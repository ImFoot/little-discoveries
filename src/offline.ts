import type {Level} from './types';
import {levelUrl,offlineManifestUrl} from './content';
export type OfflineAsset={url:string;bytes:number};
export type OfflineChapter={id:number;files:OfflineAsset[];bytes:number;readyLevels:number;expectedLevels:number};
type Manifest={catalogRevision:3;version:string;contentVersion:string;shell:string[];chapters:OfflineChapter[]};
export type DownloadState={total:number;cached:number;bytes:number;available:boolean;partial:boolean};
export class OfflineLibrary {
  manifest?:Manifest;
  error='';
  busy=new Set<number>();
  constructor(private resolve:(path:string)=>string){}
  async init(){
    if(!('serviceWorker' in navigator)||!('caches' in window)){this.error='Offline downloads need a browser with service worker support over HTTPS.';return;}
    if(import.meta.env.DEV){this.error='This preview needs a connection. Offline chapters are available in the published game. Your discoveries are saved on this device.';return;}
    try{
      await navigator.serviceWorker.register(this.resolve('sw.js'),{scope:new URL('.',this.resolve('sw.js')).pathname});
      await navigator.serviceWorker.ready;
      const response=await fetch(this.resolve(offlineManifestUrl));
      if(!response.ok)throw Error('Download information is unavailable.');
      this.manifest=await response.json() as Manifest;
      if(this.manifest.catalogRevision!==3){this.manifest=undefined;throw Error('The download list belongs to an older collection.');}
    }catch{this.error='Offline setup could not finish. Reconnect and open Settings to retry. Your progress is safe.';}
  }
  private async shellReady(){
    if(!this.manifest)return false;
    const cache=await caches.open(`little-discoveries-shell-${this.manifest.version}`);
    for(const file of this.manifest.shell)if(!(await cache.match(this.resolve(file))))return false;
    return true;
  }
  async state(id:number):Promise<DownloadState>{
    const chapter=this.manifest?.chapters.find(c=>c.id===id);
    if(!chapter||!this.manifest)return{total:0,cached:0,bytes:0,available:false,partial:false};
    const cache=await caches.open(`little-discoveries-content-${this.manifest.contentVersion}`);
    const cached=(await Promise.all(chapter.files.map(async f=>(await cache.match(this.resolve(f.url)))?.ok??false))).filter(Boolean).length;
    const shell=await this.shellReady();
    return{total:chapter.files.length,cached,bytes:chapter.bytes,available:chapter.readyLevels===chapter.expectedLevels&&cached===chapter.files.length&&shell,partial:cached>0&&cached<chapter.files.length};
  }
  async keepVisited(level:Level){
    if(!this.manifest)return;
    try{
      const cache=await caches.open(`little-discoveries-content-${this.manifest.contentVersion}`);
      const files=[levelUrl(level.id),level.art,level.thumbnail,...level.targets.map(t=>t.preview)];
      for(const path of files){const url=this.resolve(path);if((await cache.match(url))?.ok)continue;const response=await fetch(url);if(response.ok&&!response.headers.get('content-type')?.includes('text/html'))await cache.put(url,response);}
    }catch{/* Optional visit caching never prevents play or changes search progress. */}
  }
  async download(id:number,onProgress:(state:DownloadState)=>void,signal?:AbortSignal){
    if(this.busy.has(id))return;
    const chapter=this.manifest?.chapters.find(c=>c.id===id);
    if(!chapter||!this.manifest)throw Error(this.error||'Download information is not ready. Please retry.');
    if(chapter.readyLevels!==chapter.expectedLevels)throw Error(`This chapter has ${chapter.readyLevels} of ${chapter.expectedLevels} illustrated scenes. Its full offline package will be available when the chapter is finished.`);
    this.busy.add(id);
    try{
      const cache=await caches.open(`little-discoveries-content-${this.manifest.contentVersion}`);
      const existing=await Promise.all(chapter.files.map(async file=>({url:this.resolve(file.url),ok:(await cache.match(this.resolve(file.url)))?.ok??false})));
      const saved=new Set(existing.filter(file=>file.ok).map(file=>file.url));
      for(const file of chapter.files){
        signal?.throwIfAborted();
        const url=this.resolve(file.url);
        if(saved.has(url))continue;
        const response=await fetch(url,{signal});
        if(!response.ok||response.type==='opaque'||response.headers.get('content-type')?.includes('text/html'))throw Error('The connection paused. Downloaded files are kept; tap Resume download when you are ready.');
        // A controlling worker may already have cached the response. Avoid a
        // second write, and count this verified file without rescanning the chapter.
        if(!(await cache.match(url))?.ok)await cache.put(url,response.clone());
        saved.add(url);
        onProgress({total:chapter.files.length,cached:saved.size,bytes:chapter.bytes,available:false,partial:saved.size<chapter.files.length});
      }
      const state=await this.state(id);
      if(!state.available)throw Error('The chapter files are saved, but the app shell is still being prepared. Reconnect and retry.');
      onProgress(state);
      try{await navigator.storage?.persist?.();}catch{/* A browser may decline persistent storage. */}
    }catch(e){
      if(e instanceof DOMException&&e.name==='QuotaExceededError')throw Error('Device storage is full. Free some space and resume this download. Your search progress is safe.');
      if(e instanceof DOMException&&e.name==='AbortError')throw Error('Download paused. Saved files will be reused when you resume.');
      if(e instanceof TypeError||e instanceof DOMException&&e.name==='NetworkError')throw Error('The connection paused. Saved files and progress are safe. Reconnect and resume the download.');
      throw e;
    }finally{this.busy.delete(id);}
  }
}
