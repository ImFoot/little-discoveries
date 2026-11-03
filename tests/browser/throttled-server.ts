import {createServer,request,type ClientRequest} from 'node:http';
import {setTimeout as delay} from 'node:timers/promises';

// A single shared response budget covers the page, Pixi image worker and
// service worker. Page-target CDP throttling/resource entries omit worker fetches.
export async function throttledServer(upstream:string,megabits=10,latencyMs=40){
 const source=new URL(upstream),bytesPerSecond=megabits*1_000_000/8;
 const pending=new Set<ClientRequest>();let bytes=0,nextSendAt=0,stopping=false;
 const server=createServer((incoming,outgoing)=>{
  const forward=request({hostname:source.hostname,port:source.port,path:incoming.url,method:incoming.method,headers:incoming.headers},response=>{
   const parts:Buffer[]=[];
   response.on('data',part=>parts.push(Buffer.from(part)));
   response.on('error',()=>outgoing.destroy());
   response.on('end',()=>void(async()=>{
    const body=Buffer.concat(parts);
    await delay(latencyMs);
    if(stopping||outgoing.destroyed)return;
    outgoing.writeHead(response.statusCode??502,response.headers);
    for(let offset=0;offset<body.length;offset+=16_384){
     if(stopping||outgoing.destroyed)return;
     const chunk=body.subarray(offset,offset+16_384);
     const now=Date.now();nextSendAt=Math.max(now,nextSendAt)+chunk.length/bytesPerSecond*1000;
     await delay(Math.max(0,nextSendAt-now));
     if(stopping||outgoing.destroyed)return;
     bytes+=chunk.length;outgoing.write(chunk);
    }
    outgoing.end();
   })().catch(()=>outgoing.destroy()));
  });
  pending.add(forward);forward.on('close',()=>pending.delete(forward));
  forward.on('error',()=>outgoing.destroy());incoming.pipe(forward);
 });
 await new Promise<void>((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
 const address=server.address();if(!address||typeof address==='string')throw Error('The local network test server could not start.');
 return{url:`http://127.0.0.1:${address.port}`,get bytes(){return bytes;},async close(){
  stopping=true;for(const request of pending)request.destroy();server.closeAllConnections();
  await new Promise<void>(resolve=>server.close(()=>resolve()));
 }};
}
