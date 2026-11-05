// Local authoring proof, not game artwork or a substitute for physical iPhone review.
// Run: node scripts/review-level.mjs 54
// Open output/level-review-054.html directly; no server or network is needed.
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, extname, relative, isAbsolute } from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const id = Number(process.argv[2]);
if (!Number.isInteger(id) || id < 1 || process.argv.length !== 3) {
  console.error('Usage: node scripts/review-level.mjs <level number>');
  process.exit(1);
}
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tag = String(id).padStart(3, '0');
const level = JSON.parse(await readFile(resolve(root, `public/content/levels/${tag}.json`), 'utf8'));
const css = await readFile(resolve(root, 'src/style.css'), 'utf8');
const source = await readFile(resolve(root, `artwork/source/${tag}.png`));
const fingerprint = createHash('sha256').update(JSON.stringify(level)).update(source).digest('hex').slice(0, 16);
const asData = (buffer, mime) => `data:${mime};base64,${buffer.toString('base64')}`;
async function publicImage(path) {
  const directory = resolve(root, 'public'), file = resolve(directory, path);
  const within = relative(directory, file);
  if (within.startsWith('..') || isAbsolute(within)) throw Error(`Asset outside public: ${path}`);
  const mime = { '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' }[extname(file)];
  if (!mime) throw Error(`Unsupported image type: ${path}`);
  return asData(await readFile(file), mime);
}
const art = await publicImage(level.art);
const targets = await Promise.all(level.targets.map(async target => {
  const { x, y, width, height } = target.crop;
  return { ...target, previewData: await publicImage(target.preview), sourceCropData: asData(await sharp(source).extract({ left: x, top: y, width, height }).png().toBuffer(), 'image/png') };
}));
const payload = JSON.stringify({ ...level, targets, artData: art, css, fingerprint }).replaceAll('<', '\\u003c');
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Level ${tag} — authoring proof</title>
<style>
*{box-sizing:border-box}body{margin:0;padding:24px;background:#f3f1e9;color:#344130;font:16px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}h1{font:32px Georgia,serif;margin:0 0 10px}h2{font:24px Georgia,serif;margin:0 0 14px}h3{font-size:16px;margin:0 0 10px}p{line-height:1.5;margin:8px 0}button,select,textarea,input{font:inherit}button,select{min-height:44px;border:1px solid #bfc7b6;border-radius:7px;background:#fffdf7;color:inherit;padding:8px 12px}button{cursor:pointer}button:hover{background:#e5ebdc}label{display:flex;gap:8px;align-items:center;min-height:34px}input[type=checkbox]{width:19px;height:19px;accent-color:#52694f}textarea{display:block;width:100%;min-height:82px;margin-top:7px;border:1px solid #bfc7b6;border-radius:7px;background:#fffefa;padding:8px;color:inherit}.intro{max-width:1000px;margin-bottom:24px}.small{font-size:13px;color:#62705a}.layout{display:grid;grid-template-columns:397px minmax(340px,1fr);gap:24px;align-items:start;max-width:1400px}.panel{background:#fffdf7;border:1px solid #d6d9cb;border-radius:12px;padding:18px;margin-bottom:18px}.phone-panel{padding:10px}.phone-wrap{width:375px;max-width:none}iframe{display:block;width:375px;height:748px;border:0;background:#f6f3ec}.controls{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}.toggles{display:flex;gap:12px;flex-wrap:wrap}.sticky{position:sticky;top:16px}.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:16px}.proof-tile{min-width:0;display:flex;flex-direction:column;align-items:center;gap:8px;padding:8px;border:1px solid #e1e3d8;border-radius:8px}.proof-tile.current{border-color:#52694f;background:#edf1e6}.proof-tile>img{width:100%;height:142px;object-fit:contain;background:#f4f0e5}.tray-card{position:relative;display:flex;flex-direction:column;align-items:center;border:1px solid #e3e5d9;border-radius:5px;background:#fffdf7;color:#394536;width:var(--card-width,72.75px);height:var(--card-height,61px);min-height:var(--card-height,61px);padding:3px 3px 2px;gap:2px;justify-content:start}.tray-card .picture{height:var(--preview-height,32px);flex:0 0 var(--preview-height,32px);width:100%;display:flex;align-items:center;justify-content:center}.tray-card img{width:100%;height:100%;object-fit:contain}.tray-card .name{font-size:11px;line-height:1.05;min-height:23px;max-height:23px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;width:100%;text-align:center;letter-spacing:-.025em}.target-number{font-size:12px;font-weight:600;color:#69745f}.details{display:grid;grid-template-columns:repeat(3,minmax(120px,1fr));gap:12px}.detail-image{height:210px;display:flex;align-items:center;justify-content:center;background:#f4f0e5;border-radius:6px;padding:6px}.detail-image img,.detail-image svg{max-height:100%;max-width:100%;width:100%;height:100%;object-fit:contain}.detail-title{font-size:12px;font-weight:600;margin:0 0 6px}.legend{display:flex;gap:14px;flex-wrap:wrap;font-size:12px}.legend span::before{content:"";display:inline-block;width:12px;height:12px;margin-right:5px;background:var(--color)}.checklist{display:grid;grid-template-columns:repeat(2,minmax(180px,1fr));gap:4px 10px;margin-top:12px}.status{font-size:12px;min-height:18px}#target-select{flex:1;min-width:180px}#notes-label{display:block;margin-top:10px}pre{font-size:12px;white-space:pre-wrap;background:#f3f1e9;padding:10px;border-radius:6px}summary{cursor:pointer;min-height:34px;padding-top:7px}.review-summary{font-size:13px;font-weight:600}a{color:#52694f}
@media(max-width:850px){body{padding:10px}.layout{display:block}.sticky{position:static}.phone-panel{width:397px;max-width:none}.details{grid-template-columns:1fr}.detail-image{height:230px}.checklist{grid-template-columns:1fr}.cards{grid-template-columns:repeat(2,minmax(130px,1fr))}}
</style></head><body>
<header class="intro"><h1 id="title"></h1><p>Review the finished scene, real tray previews and independent target geometry together. This is an authoring proof; it does not collect objects or certify physical iPhone performance.</p><p class="small">The scene is 375 CSS pixels wide. The iframe uses the current game stylesheet and portrait viewport; keep browser zoom at 100% when judging apparent size. The game’s Fit picture scale can be smaller on shorter screens.</p></header>
<main class="layout"><section class="sticky">
<div class="panel phone-panel"><div class="phone-wrap"><iframe id="phone" title="375 CSS-pixel scene and actual game tray"></iframe></div></div>
<div class="panel"><h2>Scene overlays</h2><div class="toggles"><label><input id="show-outline" type="checkbox">Selected outline</label><label><input id="show-hint" type="checkbox">Broad hint</label><label><input id="show-all" type="checkbox">All positions</label></div><div class="controls"><button id="plain" type="button">Plain picture</button><button id="locate" type="button">Locate selected object</button></div><p id="geometry" class="small"></p><div class="legend"><span style="--color:#ef2378">Exact outline</span><span style="--color:#e6a833">Broad hint</span><span style="--color:#23aec1">Preview crop / positions</span></div></div>
</section><section>
<div class="panel"><h2>Selected target</h2><div class="controls"><button id="previous" aria-label="Previous target">←</button><select id="target-select" aria-label="Target to inspect"></select><button id="next" aria-label="Next target">→</button></div>
<div class="details"><div><p class="detail-title">Actual game preview, enlarged</p><div class="detail-image"><img id="enlarged" alt=""></div></div><div><p class="detail-title">Unchanged source crop</p><div class="detail-image"><img id="source-crop" alt=""></div></div><div><p class="detail-title">Source crop + reveal outline</p><div id="contour" class="detail-image"></div></div></div><p id="target-notes" class="small"></p><details><summary>Target coordinates and inspection zoom</summary><pre id="coordinates"></pre></details>
<div class="checklist" id="checklist"></div><label id="notes-label">Review notes<textarea id="review-notes" placeholder="Identity, crop, outline or placement corrections needed…"></textarea></label><p class="status" id="storage-status" role="status"></p><p id="review-summary" class="review-summary"></p><button id="export-notes" type="button">Export review notes</button></div>
<div class="panel"><h2>Every preview at tray size and enlarged</h2><p class="small">The small buttons use the dimensions measured from the real tray above. The larger copies help distinguish a clear small object from an unclear source image. Select any button to review its geometry.</p><div class="cards" id="all-targets"></div></div>
</section></main><script type="application/json" id="review-data">${payload}</script>
<script>
const data = JSON.parse(document.getElementById('review-data').textContent);
const $ = id => document.getElementById(id);
const escape = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const path = (poly, x=0, y=0) => 'M' + poly.map(p => (p[0]-x)+','+(p[1]-y)).join('L') + 'Z';
const contours = (target,x=0,y=0) => (target.regions||[{outline:target.outline,holes:target.holes}]).flatMap(r=>[r.outline,...r.holes||[]]).map(p=>path(p,x,y)).join('');
const checks = [['identity','Name and ordinary object identity clear'],['tray','Recognizable in the actual-size tray'],['crop','All visible target parts in preview'],['outline','Outline / holes follow visible target'],['hint','Hint and inspection position useful'],['placement','Concealment feels fair and intentional']];
const key = 'little-discoveries-authoring-proof:'+data.id+':'+data.fingerprint;
let selected=0, frameReady=false, storageOK=true, reviews={};
try{reviews=JSON.parse(localStorage.getItem(key)||'{}');if(!reviews||Array.isArray(reviews)||typeof reviews!=='object')reviews={};}catch{storageOK=false;}
$('title').textContent='Level '+data.id+' — '+data.title;
$('target-select').innerHTML=data.targets.map((t,i)=>'<option value="'+i+'">'+(i+1)+'. '+escape(t.name)+'</option>').join('');
$('checklist').innerHTML=checks.map(([id,label])=>'<label><input type="checkbox" data-check="'+id+'">'+label+'</label>').join('');
$('all-targets').innerHTML=data.targets.map((t,i)=>'<article class="proof-tile" data-tile="'+i+'"><span class="target-number">'+(i+1)+'. '+escape(t.name)+'</span><button class="tray-card" data-target="'+i+'" aria-label="Review '+escape(t.name)+'"><span class="picture"><img src="'+t.previewData+'" alt=""></span><span class="name">'+escape(t.name)+'</span></button><img src="'+t.previewData+'" alt="Enlarged '+escape(t.name)+'"></article>').join('');

const card = (t,i) => '<button class="object-card" data-index="'+i+'" aria-label="'+escape(t.name)+'"><span class="object-preview"><img src="'+t.previewData+'" alt="" draggable="false"></span><span class="object-name">'+escape(t.name)+'</span></button>';
const frame = $('phone');
frame.onload=()=>{
  frameReady=true;
  frame.contentDocument.querySelectorAll('[data-index]').forEach(button=>button.addEventListener('click',()=>select(Number(button.dataset.index))));
  const rect=frame.contentDocument.querySelector('.object-card').getBoundingClientRect();
  const preview=frame.contentDocument.querySelector('.object-preview').getBoundingClientRect();
  document.documentElement.style.setProperty('--card-width',rect.width+'px');
  document.documentElement.style.setProperty('--card-height',rect.height+'px');
  document.documentElement.style.setProperty('--preview-height',preview.height+'px');
  const height=frame.contentDocument.documentElement.scrollHeight;
  frame.style.height=height+'px';
  $('geometry').textContent='Measured portrait tray: '+rect.width.toFixed(2)+' × '+rect.height.toFixed(0)+' CSS px cards; '+preview.height.toFixed(0)+' px pictures. '+data.targetCount+' targets.';
  renderOverlay();
};
frame.srcdoc='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>'+data.css+'</style><style>html,body{margin:0;overflow:hidden}.play{height:auto;min-height:0;display:block;padding:0;width:375px}.play-header{height:58px}.proof-scene{display:block;width:375px;height:auto}.play-controls{height:51px}.object-pane{height:74px}.proof-scene .annotation{pointer-events:none}.proof-symbol{width:44px;height:44px;display:flex;align-items:center;justify-content:center;font-size:20px}.object-card.selected{border-color:#52694f}</style></head><body><main class="play"><header class="play-header"><span class="proof-symbol">‹</span><div class="play-heading"><p>SCENE '+data.id+'</p><h1>'+escape(data.title)+'</h1></div><span class="progress-count">0 / '+data.targetCount+'</span></header><svg class="proof-scene" viewBox="0 0 '+data.width+' '+data.height+'" xmlns="http://www.w3.org/2000/svg" aria-label="'+escape(data.title)+'"><image href="'+data.artData+'" width="'+data.width+'" height="'+data.height+'"/><g id="overlay" class="annotation"></g></svg><div class="play-controls"><span class="help-button">Hint</span><span class="help-button">Show me</span><span class="zoom-controls"><span class="proof-symbol">−</span><span class="proof-symbol">+</span></span><span class="fit-button">Fit picture</span></div><aside class="object-pane"><span class="tray-more proof-symbol">▦</span><div class="object-tray">'+data.targets.map(card).join('')+'</div></aside></main></body></html>';

function renderOverlay(){
  if(!frameReady)return;
  const target=data.targets[selected],c=target.crop,h=target.hint;
  let svg='';
  if($('show-hint').checked)svg+='<rect x="'+h.x+'" y="'+h.y+'" width="'+h.width+'" height="'+h.height+'" rx="20" fill="#e6a833" fill-opacity=".16" stroke="#e6a833" stroke-width="5"/>';
  if($('show-all').checked)svg+=data.targets.map((t,i)=>{const center=t.inspect;return '<g><circle cx="'+(center.x*data.width)+'" cy="'+(center.y*data.height)+'" r="24" fill="#176d7e" stroke="white" stroke-width="3"/><text x="'+(center.x*data.width)+'" y="'+(center.y*data.height+9)+'" text-anchor="middle" fill="white" font-family="sans-serif" font-size="25" font-weight="700">'+(i+1)+'</text></g>';}).join('');
  if($('show-outline').checked)svg+='<rect x="'+c.x+'" y="'+c.y+'" width="'+c.width+'" height="'+c.height+'" fill="none" stroke="#23aec1" stroke-width="3" stroke-dasharray="9 7"/><path d="'+contours(target)+'" fill="none" stroke="#ef2378" stroke-width="4"/>';
  frame.contentDocument.getElementById('overlay').innerHTML=svg;
  frame.contentDocument.querySelectorAll('[data-index]').forEach(button=>{const current=Number(button.dataset.index)===selected;button.classList.toggle('selected',current);button.setAttribute('aria-pressed',String(current));});
}
function select(index){
  selected=(index+data.targets.length)%data.targets.length;
  const target=data.targets[selected],c=target.crop,review=reviews[target.id]||{};
  $('target-select').value=String(selected);
  $('enlarged').src=target.previewData;$('enlarged').alt=target.name+' game preview';
  $('source-crop').src=target.sourceCropData;$('source-crop').alt=target.name+' unchanged source crop';
  $('contour').innerHTML='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+c.width+' '+c.height+'" aria-label="'+escape(target.name)+' source and outline"><image href="'+target.sourceCropData+'" width="'+c.width+'" height="'+c.height+'"/><path d="'+contours(target,c.x,c.y)+'" fill="none" stroke="#ef2378" stroke-width="1.25"/></svg>';
  $('target-notes').textContent=target.notes||'No authoring notes recorded.';
  $('coordinates').textContent=JSON.stringify({id:target.id,previewMode:target.previewMode,crop:target.crop,hint:target.hint,inspect:target.inspect,outlinePoints:target.outline.length,holeCount:(target.holes||[]).length},null,2);
  document.querySelectorAll('[data-check]').forEach(box=>box.checked=review[box.dataset.check]===true);
  $('review-notes').value=review.notes||'';
  document.querySelectorAll('[data-tile]').forEach(tile=>tile.classList.toggle('current',Number(tile.dataset.tile)===selected));
  updateSummary();renderOverlay();
}
function updateSummary(){
  const complete=data.targets.filter(t=>checks.every(([id])=>reviews[t.id]?.[id]===true)).length;
  $('review-summary').textContent=complete+' / '+data.targetCount+' targets have all six checks marked. These checks are reviewer notes only; they do not change game content.';
  $('storage-status').textContent=storageOK?'Notes stay in this browser for this exact artwork and definition. Export a copy to share or retain them.':'Browser storage is unavailable. Notes remain on this page until it closes; use Export review notes.';
}
function saveReview(){
  const review={notes:$('review-notes').value};
  document.querySelectorAll('[data-check]').forEach(box=>review[box.dataset.check]=box.checked);
  reviews[data.targets[selected].id]=review;
  try{localStorage.setItem(key,JSON.stringify(reviews));storageOK=true;}catch{storageOK=false;}
  updateSummary();
}
$('target-select').addEventListener('change',event=>select(Number(event.target.value)));
$('previous').addEventListener('click',()=>select(selected-1));$('next').addEventListener('click',()=>select(selected+1));
document.querySelectorAll('[data-target]').forEach(button=>button.addEventListener('click',()=>select(Number(button.dataset.target))));
document.querySelectorAll('[data-check]').forEach(box=>box.addEventListener('change',saveReview));
$('review-notes').addEventListener('input',saveReview);
['show-outline','show-hint','show-all'].forEach(id=>$(id).addEventListener('change',renderOverlay));
$('plain').addEventListener('click',()=>{['show-outline','show-hint','show-all'].forEach(id=>$(id).checked=false);renderOverlay();});
$('locate').addEventListener('click',()=>{$('show-outline').checked=true;renderOverlay();});
$('export-notes').addEventListener('click',()=>{
  const content={level:data.id,title:data.title,fingerprint:data.fingerprint,exportedAt:new Date().toISOString(),reviews};
  const url=URL.createObjectURL(new Blob([JSON.stringify(content,null,2)+'\\n'],{type:'application/json'}));
  const anchor=document.createElement('a');anchor.href=url;anchor.download='level-review-'+String(data.id).padStart(3,'0')+'.json';anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
});
select(0);
</script></body></html>`;
await mkdir(resolve(root, 'output'), { recursive: true });
const output = resolve(root, `output/level-review-${tag}.html`);
await writeFile(output, html);
console.log(`Review proof: ${output}\n${targets.length} targets; standalone HTML; notes fingerprint ${fingerprint}.`);
