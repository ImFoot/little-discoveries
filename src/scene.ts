import { Application, Assets, Container, Graphics, Sprite, Texture } from 'pixi.js';
import { clampView, pickTarget } from './geometry';
import type { Level, Point, Target, View } from './types';

type Touch={x:number;y:number;startX:number;startY:number};
export class SceneView {
  private app=new Application();
  private world=new Container();
  private marks=new Graphics();
  private effect=new Graphics();
  private sprite?:Sprite;
  private level?:Level;
  private view:View={x:.5,y:.5,zoom:1};
  private found=new Set<string>();
  private pointers=new Map<number,Touch>();
  private gesture=false;
  private moved=false;
  private pinching=false;
  private lastMid:Point=[0,0];
  private lastDistance=0;
  private observer?:ResizeObserver;
  private currentArt='';
  private selected?:Target;
  private broad?:Target;
  private hintTimer?:number;
  private showMarkers=true;
  private started=false;
  private paused=false;
  private disposed=false;
  private loadToken=0;
  constructor(private host:HTMLElement, private onFind:(target:Target)=>void,private onView:(view:View)=>void,private resolve:(path:string)=>string,private onPicturePaused?:()=>void){}
  async init(){
    await this.app.init({width:Math.max(this.host.clientWidth,1),height:Math.max(this.host.clientHeight,1),resolution:Math.min(window.devicePixelRatio||1,2),autoDensity:true,antialias:true,backgroundAlpha:0,preference:'webgl',autoStart:false,powerPreference:'low-power'});
    this.app.stage.addChild(this.world);this.world.addChild(this.marks,this.effect);
    this.host.appendChild(this.app.canvas);
    this.app.canvas.addEventListener('webglcontextlost',event=>{
      if(this.disposed)return;
      event.preventDefault();this.paused=true;this.resetGesture();
      this.onPicturePaused?.();
    });
    this.app.canvas.setAttribute('aria-label','Illustrated scene. Drag to explore, pinch to zoom, or use the zoom buttons.');
    this.app.canvas.setAttribute('role','img');
    this.host.addEventListener('pointerdown',this.down);
    this.host.addEventListener('pointermove',this.move);
    this.host.addEventListener('pointerup',this.up);
    this.host.addEventListener('pointercancel',this.cancel);
    this.host.addEventListener('lostpointercapture',this.cancel);
    this.host.addEventListener('wheel',this.wheel,{passive:false});
    this.host.addEventListener('keydown',this.key);
    this.observer=new ResizeObserver(()=>this.resize());this.observer.observe(this.host);
    this.started=true;
  }
  async load(level:Level,view:View,found:string[],markers:boolean){
    const token=++this.loadToken;
    const path=this.resolve(level.art);
    const texture=await Assets.load<Texture>(path);
    if(token!==this.loadToken) return;
    const old=this.currentArt;
    this.sprite?.destroy();
    this.sprite=new Sprite(texture);this.sprite.width=level.width;this.sprite.height=level.height;
    this.world.addChildAt(this.sprite,0);
    this.level=level;this.currentArt=path;this.view={...view};this.found=new Set(found);this.showMarkers=markers;
    this.selected=undefined;this.broad=undefined;this.resetGesture();
    // Prepare the vector feedback pipeline beneath the opaque picture, so a
    // first discovery does not have to compile its graphics during the tap.
    const warmup=new Graphics().circle(level.width/2,level.height/2,8).fill(0x4f6b50).stroke({color:0xffffff,width:2});
    warmup.moveTo(level.width/2-4,level.height/2).lineTo(level.width/2,level.height/2+3).lineTo(level.width/2+4,level.height/2-3).stroke({color:0xffffff,width:2,cap:'round',join:'round'});
    this.world.addChildAt(warmup,0);this.resize();
    await new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve())));
    if(this.disposed||token!==this.loadToken)return;
    this.world.removeChild(warmup);warmup.destroy();
    if(old&&old!==path) await Assets.unload(old);
  }
  private resize(){
    if(!this.started||this.paused) return;
    const w=this.host.clientWidth,h=this.host.clientHeight;if(w<1||h<1) return;
    this.app.renderer.resize(w,h);this.apply();
  }
  get scale(){return this.world.scale.x;}
  get currentView():View{return {...this.view};}
  private apply(notify=true){
    if(!this.level) return;
    const w=this.host.clientWidth,h=this.host.clientHeight;
    if(w<1||h<1) return;
    this.view=clampView(this.view,this.level.width,this.level.height,w,h);
    const s=Math.min(w/this.level.width,h/this.level.height)*this.view.zoom;
    this.world.scale.set(s);
    this.world.position.set(w/2-this.view.x*this.level.width*s,h/2-this.view.y*this.level.height*s);
    this.draw();
    if(notify)this.onView({...this.view});
  }
  private draw(){
    if(!this.level||this.paused) return;
    this.marks.clear();this.effect.clear();
    const s=this.scale;
    if(this.showMarkers) for(const target of this.level.targets){
      if(!this.found.has(target.id))continue;
      const x=target.inspect.x*this.level.width,y=target.inspect.y*this.level.height;
      const r=9/s;
      this.marks.circle(x,y,r).fill({color:0x4f6b50,alpha:.9}).stroke({color:0xffffff,width:1.5/s});
      this.marks.moveTo(x-r*.45,y).lineTo(x-r*.08,y+r*.35).lineTo(x+r*.5,y-r*.37).stroke({color:0xffffff,width:1.8/s,cap:'round',join:'round'});
    }
    if(this.broad){
      const h=this.broad.hint;
      this.effect.ellipse(h.x+h.width/2,h.y+h.height/2,h.width/2,h.height/2).fill({color:0xffe6a4,alpha:.1}).stroke({color:0x553f26,width:6/s,alpha:.65}).stroke({color:0xffe6a4,width:3/s});
    }
    if(this.selected&&!this.found.has(this.selected.id)){
      const points=this.selected.outline.flat();
      this.effect.poly(points).stroke({color:0x473b22,width:7/s,alpha:.8,join:'round'});
      this.effect.poly(points).stroke({color:0xffeb9e,width:3/s,join:'round'});
      for(const hole of this.selected.holes??[]){this.effect.poly(hole.flat()).stroke({color:0x473b22,width:7/s,alpha:.8,join:'round'});this.effect.poly(hole.flat()).stroke({color:0xffeb9e,width:3/s,join:'round'});}
    }
    this.app.render();
  }
  setFound(found:string[],markers=this.showMarkers){this.found=new Set(found);this.showMarkers=markers;if(this.selected&&this.found.has(this.selected.id))this.selected=undefined;if(this.broad&&this.found.has(this.broad.id))this.broad=undefined;this.draw();}
  fit(){if(this.paused)return;this.view={x:.5,y:.5,zoom:1};this.apply();}
  zoom(factor:number,anchor?:Point){
    if(!this.level||this.paused)return;
    const a=anchor??[this.host.clientWidth/2,this.host.clientHeight/2];
    const before=this.toWorld(a);this.view.zoom=Math.min(8,Math.max(1,this.view.zoom*factor));
    const s=Math.min(this.host.clientWidth/this.level.width,this.host.clientHeight/this.level.height)*this.view.zoom;
    this.view.x=(before[0]-(a[0]-this.host.clientWidth/2)/s)/this.level.width;
    this.view.y=(before[1]-(a[1]-this.host.clientHeight/2)/s)/this.level.height;
    this.apply();
  }
  help(target:Target,exact:boolean){
    clearTimeout(this.hintTimer);this.broad=exact?undefined:target;this.selected=exact?target:undefined;
    this.view=exact?{...target.inspect}:{x:(target.hint.x+target.hint.width/2)/(this.level?.width??1),y:(target.hint.y+target.hint.height/2)/(this.level?.height??1),zoom:Math.min(target.inspect.zoom,2)};
    this.apply();
    if(!exact)this.hintTimer=window.setTimeout(()=>{this.broad=undefined;this.draw();},6500);
  }
  dismissHelp(){this.selected=undefined;this.broad=undefined;clearTimeout(this.hintTimer);this.draw();}
  acknowledge(target:Target){
    // The HTML toast acknowledges repeat finds. Preserve any exact reveal.
    if(this.found.has(target.id))this.draw();
  }
  private local(e:{clientX:number;clientY:number}):Point{const r=this.host.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top];}
  private toWorld(p:Point):Point{return[(p[0]-this.world.x)/this.scale,(p[1]-this.world.y)/this.scale];}
  private down=(e:PointerEvent)=>{
    // Recovery controls live inside the viewport. Their pointer events must
    // never start a scene gesture or discover an object behind the overlay.
    if(e.button!==0||!this.level||this.paused||this.disposed)return;
    if(e.target!==this.host&&e.target!==this.app.canvas)return;
    e.preventDefault();this.host.focus({preventScroll:true});
    this.host.setPointerCapture(e.pointerId);
    const [x,y]=this.local(e);this.pointers.set(e.pointerId,{x,y,startX:x,startY:y});
    if(this.pointers.size===1){this.gesture=true;this.moved=false;this.pinching=false;}
    if(this.pointers.size>=2){
      this.pinching=true;this.moved=true;
      const[a,b]=[...this.pointers.values()];this.lastMid=[(a.x+b.x)/2,(a.y+b.y)/2];this.lastDistance=Math.hypot(a.x-b.x,a.y-b.y);
    }
  };
  private move=(e:PointerEvent)=>{
    const pointer=this.pointers.get(e.pointerId);if(!pointer||!this.level)return;
    e.preventDefault();const[x,y]=this.local(e),dx=x-pointer.x,dy=y-pointer.y;pointer.x=x;pointer.y=y;
    if(Math.hypot(x-pointer.startX,y-pointer.startY)>7)this.moved=true;
    if(this.pointers.size>=2){
      const[a,b]=[...this.pointers.values()];const mid:Point=[(a.x+b.x)/2,(a.y+b.y)/2];
      const distance=Math.hypot(a.x-b.x,a.y-b.y);
      this.view.x-=(mid[0]-this.lastMid[0])/(this.scale*this.level.width);
      this.view.y-=(mid[1]-this.lastMid[1])/(this.scale*this.level.height);
      this.apply(false);
      if(this.lastDistance>0)this.zoom(distance/this.lastDistance,mid);
      this.lastMid=mid;this.lastDistance=distance;
    }else if(this.moved){
      this.view.x-=dx/(this.scale*this.level.width);this.view.y-=dy/(this.scale*this.level.height);this.apply();
    }
  };
  private up=(e:PointerEvent)=>{
    const pointer=this.pointers.get(e.pointerId);if(!pointer)return;
    const movedOnRelease=Math.hypot(...this.local(e).map((v,i)=>v-[pointer.startX,pointer.startY][i]))>7;
    const tap=this.gesture&&!this.moved&&!this.pinching&&!movedOnRelease&&this.pointers.size===1;
    this.pointers.delete(e.pointerId);
    if(this.host.hasPointerCapture(e.pointerId))this.host.releasePointerCapture(e.pointerId);
    if(tap&&this.level){const target=pickTarget(this.toWorld(this.local(e)),this.level.targets,this.scale,this.found,this.selected?.id);if(target)this.onFind(target);}
    if(!this.pointers.size)this.resetGesture();
    this.onView({...this.view});
  };
  private cancel=(e:PointerEvent)=>{this.pointers.delete(e.pointerId);this.moved=true;if(!this.pointers.size)this.resetGesture();};
  private resetGesture(){this.pointers.clear();this.gesture=false;this.moved=false;this.pinching=false;}
  private wheel=(e:WheelEvent)=>{e.preventDefault();this.zoom(Math.exp(-e.deltaY*.002),this.local(e));};
  private key=(e:KeyboardEvent)=>{
    if(!this.level||this.paused)return;
    if(['+','=','-','0','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))e.preventDefault();
    if(e.key==='+'||e.key==='=')this.zoom(1.4);
    else if(e.key==='-')this.zoom(1/1.4);
    else if(e.key==='0')this.fit();
    else {const d=.12/this.view.zoom;if(e.key==='ArrowLeft')this.view.x-=d;if(e.key==='ArrowRight')this.view.x+=d;if(e.key==='ArrowUp')this.view.y-=d;if(e.key==='ArrowDown')this.view.y+=d;this.apply();}
  };
  destroy(){
    this.disposed=true;
    ++this.loadToken;this.observer?.disconnect();clearTimeout(this.hintTimer);
    this.host.removeEventListener('pointerdown',this.down);this.host.removeEventListener('pointermove',this.move);this.host.removeEventListener('pointerup',this.up);this.host.removeEventListener('pointercancel',this.cancel);this.host.removeEventListener('lostpointercapture',this.cancel);this.host.removeEventListener('wheel',this.wheel);this.host.removeEventListener('keydown',this.key);
    if(this.started)this.app.destroy(true,{children:true,texture:false});
    if(this.currentArt)void Assets.unload(this.currentArt);
  }
}
