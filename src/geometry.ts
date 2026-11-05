import type { Point, Target, View } from './types';

export function inside(point: Point, polygon: Point[]): boolean {
  const [x,y]=point; let hit=false;
  for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
    const a=polygon[i], b=polygon[j];
    if(((a[1]>y)!==(b[1]>y)) && x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0]) hit=!hit;
  }
  return hit;
}
export function edgeDistance(p: Point, polygon: Point[]): number {
  if(inside(p,polygon)) return 0;
  return boundaryDistance(p,polygon);
}
function boundaryDistance(p:Point,polygon:Point[]):number{
  let best=Infinity;
  for(let i=0;i<polygon.length;i++){
    const a=polygon[i],b=polygon[(i+1)%polygon.length];
    const dx=b[0]-a[0],dy=b[1]-a[1];
    const t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/(dx*dx+dy*dy||1)));
    best=Math.min(best,Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy));
  }
  return best;
}
export function polygonArea(polygon:Point[]):number{
  return Math.abs(polygon.reduce((sum,a,i)=>{const b=polygon[(i+1)%polygon.length];return sum+a[0]*b[1]-b[0]*a[1];},0))/2;
}
/** Visible shape wins over padding. Smaller foreground silhouettes win shared visible areas. */
export function pickTarget(point: Point, targets: Target[], sceneScale: number,found:ReadonlySet<string>=new Set(),revealed?:string): Target | undefined {
  return targets.map((target,index)=>{
    const regions=target.regions??[{outline:target.outline,holes:target.holes}];
    const visible=regions.some(r=>inside(point,r.outline)&&!r.holes?.some(h=>inside(point,h)));
    const d=target.regions?Math.min(...regions.map(r=>{const hole=r.holes?.find(h=>inside(point,h));return hole?boundaryDistance(point,hole):edgeDistance(point,r.outline);})):target.holes?.some(h=>inside(point,h))?Math.min(...target.holes.filter(h=>inside(point,h)).map(h=>boundaryDistance(point,h))):edgeDistance(point,target.hit);
    return{target,index,d,visible,area:regions.reduce((n,r)=>n+polygonArea(r.outline),0)};
  })
    .filter(t=>t.d<=Math.min(75,18/sceneScale))
    .sort((a,b)=>{
      if(a.visible!==b.visible){
        const visible=a.visible?a:b,padded=a.visible?b:a;
        // A collected textile behind a smaller object must not swallow its edge.
        // Other visible shapes still take precedence over generous padding.
        const foregroundEdge=(found.has(visible.target.id)||padded.target.id===revealed)&&!found.has(padded.target.id)&&padded.area<visible.area*.8&&padded.d*sceneScale<=4;
        return foregroundEdge?(a.visible?1:-1):(a.visible?-1:1);
      }
      return(a.visible&&b.visible?a.area-b.area:0)||a.d-b.d||a.index-b.index;
    })[0]?.target;
}
export function clampView(view: View, width: number, height: number, viewportWidth: number, viewportHeight: number): View {
  const zoom=Math.min(8,Math.max(1,view.zoom));
  const scale=Math.min(viewportWidth/width,viewportHeight/height)*zoom;
  const hx=Math.min(.5,viewportWidth/(2*width*scale)),hy=Math.min(.5,viewportHeight/(2*height*scale));
  return {zoom,x:Math.min(1-hx,Math.max(hx,view.x)),y:Math.min(1-hy,Math.max(hy,view.y))};
}
