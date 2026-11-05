import './style.css';
import type { Catalog, CatalogEntry, Level, Save, Target } from './types';
import { collect, continueLevel, exportBackup, importBackup, loadSave, newAttempt, persist } from './save';
import { SceneView } from './scene';
import { icon } from './icons';
import { OfflineLibrary, type DownloadState } from './offline';
import {catalogUrl,levelUrl} from './content';

const base=new URL(import.meta.env.BASE_URL,location.href);
const asset=(path:string)=>new URL(path,base).href;
const esc=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const root=document.querySelector<HTMLDivElement>('#app')!;
const announcer=document.querySelector<HTMLElement>('#announcer')!;
let toastTimer=0;
function toast(message:string){const el=document.querySelector<HTMLElement>('#toast')!;el.textContent=message;el.classList.add('visible');announcer.textContent=message;clearTimeout(toastTimer);toastTimer=window.setTimeout(()=>el.classList.remove('visible'),4200);}
function button(label:string,action:string,cls='',symbol=''){return `<button type="button" class="${cls}" data-action="${action}">${symbol?icon(symbol):''}<span>${label}</span></button>`;}
function iconButton(label:string,action:string,symbol:string,cls=''){return `<button type="button" class="icon-button ${cls}" aria-label="${label}" title="${label}" data-action="${action}">${icon(symbol)}</button>`;}

class Game {
  private save:Save;
  private scene?:SceneView;
  private level?:Level;
  private selected?:string;
  private remainingOnly=false;
  private loadSequence=0;
  private exactShown=false;
  private pictureReady=false;
  private exactTarget?:string;
  private startDownload?:()=>Promise<void>;
  private viewTimer=0;
  private catalogTimer=0;
  private warnedStorage=false;
  private offline=new OfflineLibrary(asset);
  private route='home';
  private catalogFilter='all';
  private audio?:AudioContext;
  private modalReturn?:HTMLElement;
  constructor(private catalog:Catalog){
    const loaded=loadSave(catalog.levels);this.save=loaded.save;
    if(loaded.migrated&&/^#scene\/\d+$/.test(location.hash)){
      const oldId=Number(location.hash.split('/')[1]);
      history.replaceState(null,'',`#scene/${oldId>50?oldId-50:this.save.current}`);
    }
    this.preferences();
    root.addEventListener('click',e=>void this.click(e));
    window.addEventListener('hashchange',()=>void this.renderRoute());
    document.addEventListener('visibilitychange',()=>{if(document.hidden)this.write();});
    window.addEventListener('pagehide',()=>this.write());
    window.addEventListener('scroll',()=>{if(this.route==='scenes'){this.save.catalogScroll=window.scrollY;clearTimeout(this.catalogTimer);this.catalogTimer=window.setTimeout(()=>this.write(),250);}},{passive:true});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&this.exactShown)this.dismissHelp();});
    window.addEventListener('online',()=>toast('You’re connected again.'));
    void this.offline.init();
    if(loaded.warning)toast(loaded.warning);
    if(!location.hash){
      const resume=this.save.attempts[this.save.current];
      history.replaceState(null,'',!this.save.onboarded?'#scene/1':resume?.started&&!resume.completed?`#scene/${this.save.current}`:'#home');
    }
    void this.renderRoute();
  }
  private write(){
    clearTimeout(this.viewTimer);
    if(!persist(this.save)&&!this.warnedStorage){this.warnedStorage=true;toast('Device storage is unavailable. Please back up your progress in Settings before closing.');}
  }
  private preferences(){
    document.documentElement.classList.toggle('large-text',this.save.preferences.largeText);
    document.documentElement.classList.toggle('large-previews',this.save.preferences.largePreviews);
    document.documentElement.classList.toggle('reduce-motion',this.save.preferences.reduceMotion);
  }
  private navigate(route:string){if(location.hash===`#${route}`)void this.renderRoute();else location.hash=route;}
  private async renderRoute(){
    if(this.route==='scenes'){this.save.catalogScroll=window.scrollY;this.write();}
    const route=location.hash.slice(1)||'home';this.route=route;
    this.closeModal();
    if(route.startsWith('scene/')){
      const id=Number(route.split('/')[1]);if(Number.isInteger(id)&&this.catalog.levels.some(l=>l.id===id)){await this.play(id);return;}
    }
    ++this.loadSequence;this.scene?.destroy();this.scene=undefined;this.level=undefined;this.selected=undefined;
    document.body.classList.remove('is-playing');
    if(route==='scenes')this.renderCatalog();else if(route==='album')this.renderAlbum();else this.renderHome();
  }
  private header(active='home'){
    return `<header class="site-header"><a class="brand" href="#home" aria-label="Little Discoveries home">${icon('flower')}<span>little discoveries</span></a><nav aria-label="Main navigation"><a href="#scenes" ${active==='scenes'?'aria-current="page"':''}>${icon('grid')}<span>Scenes</span></a><a href="#album" ${active==='album'?'aria-current="page"':''}>${icon('book')}<span>My album</span></a>${iconButton('Open settings','settings','settings')}</nav></header>`;
  }
  private renderHome(){
    const next=this.catalog.levels[continueLevel(this.save,this.catalog.levels)-1];
    const found=this.save.attempts[next.id]?.found.length??0;
    const featured=[56,55,54,51,52,53].map(id=>this.catalog.levels[id-1]);
    const hero=this.catalog.levels[55];
    root.innerHTML=`${this.header()}<main class="home page"><div class="home-intro"><div class="intro-copy"><p class="eyebrow">A LITTLE TIME, JUST FOR YOU</p><h1>Lovely things.<br>Little discoveries.</h1><p class="lede">Wander into a beautiful picture.<br>Find a few hidden treasures.<br>Stay as long as you like.</p><div class="home-actions">${button(`Continue ${icon('next')}`,'continue','primary')}<a class="button secondary" href="#scenes">Choose a scene ${icon('grid')}</a></div><p class="resume-caption">${found?`${found} of ${next.targetCount} found · `:''}Scene ${next.id} · ${esc(next.title)}</p><div class="quiet-promise">${icon('leaf')}<span>No rush. A little help whenever you like.</span></div></div><button class="hero-picture" data-action="play:${hero.id}" aria-label="Explore ${esc(hero.title)}"><img src="${asset(hero.thumbnail.replace('-thumb',''))}" alt="${esc(hero.title)} — a detailed illustrated scene with concealed objects." fetchpriority="high"><span class="picture-caption"><span>${icon('sun')} Look a little closer</span><span>${String(hero.id).padStart(2,'0')} / ${this.catalog.levels.length}</span></span><span class="photo-tape" aria-hidden="true"></span></button></div><section class="wander-section"><div class="section-heading"><div><p class="eyebrow">A WORLD OF SMALL WONDERS</p><h2>Six scenes to try</h2></div><a class="text-link" href="#scenes">All ${this.catalog.levels.length} scenes ${icon('next')}</a></div><div class="featured-grid">${featured.map(l=>this.featured(l)).join('')}</div></section><footer class="home-footer">${icon('flower')}<p>Made for you, with love.</p><span>50 familiar places and 6 new scenes to try.</span></footer></main>`;
    window.scrollTo(0,0);
  }
  private featured(level:CatalogEntry){
    const chapter=this.catalog.chapters[level.chapter-1];
    return `<button class="featured-card" data-action="play:${level.id}"><div class="featured-image"><img src="${asset(level.thumbnail)}" alt="" loading="lazy"><span class="scene-number">${String(level.id).padStart(2,'0')}</span></div><div class="featured-copy"><p class="eyebrow">${esc(chapter.title)}</p><h3>${esc(level.title)}</h3><span>${level.sampleLevel?'Sample · ':''}${level.targetCount} little things to find ${icon('next')}</span></div></button>`;
  }
  private status(level:CatalogEntry){return this.save.completed.includes(level.id)?'Completed':this.save.attempts[level.id]?.started?'In progress':'Not started';}
  private sceneCard(level:CatalogEntry){
    const favorite=this.save.favorites.includes(level.id),status=this.status(level);
    return `<article class="scene-card"><button class="scene-open" data-action="play:${level.id}" aria-label="Scene ${level.id}, ${esc(level.title)}, ${status}, ${level.targetCount} objects"><div class="catalog-image">${level.status==='reviewed'?`<img src="${asset(level.thumbnail)}" alt="" loading="lazy" decoding="async">`:`<div class="art-pending">${icon('flower')}<span>Illustration in progress</span></div>`}<span class="scene-number">${String(level.id).padStart(2,'0')}</span>${status==='Completed'?`<span class="completed-seal">${icon('check')}</span>`:''}</div><div class="scene-card-copy"><h3>${esc(level.title)}</h3><p><span class="status ${status==='Completed'?'done':''}">${status}</span><span>${level.targetCount} objects</span></p></div></button><button class="favorite icon-button ${favorite?'is-favorite':''}" aria-label="${favorite?'Unfavorite':'Favorite'} ${esc(level.title)}" aria-pressed="${favorite}" data-action="favorite:${level.id}">${icon('heart')}</button></article>`;
  }
  private renderCatalog(){
    root.innerHTML=`${this.header('scenes')}<main class="page catalog"><div class="page-title"><p class="eyebrow">YOUR LITTLE GETAWAY</p><h1>Choose a scene</h1><p>Start anywhere. Every picture is yours. <a href="#scene/56">Try the new layered scene</a>.</p></div><div class="catalog-toolbar"><div class="filters" role="group" aria-label="Filter scenes">${[['all','All scenes'],['unfinished','Unfinished'],['favorites','Favorites']].map(([id,label])=>`<button data-action="filter:${id}" aria-pressed="${this.catalogFilter===id}" class="${this.catalogFilter===id?'active':''}">${label}</button>`).join('')}</div><label class="chapter-jump sr-label">Chapter<select id="chapter-jump" aria-label="Jump to chapter"><option value="">Jump to a chapter</option>${this.catalog.chapters.map(c=>`<option value="chapter-${c.id}">${c.id}. ${esc(c.title)}</option>`).join('')}</select></label></div>${this.catalog.chapters.map(c=>{
      const levels=this.catalog.levels.filter(l=>l.chapter===c.id&&(this.catalogFilter==='all'||this.catalogFilter==='unfinished'&&!this.save.completed.includes(l.id)||this.catalogFilter==='favorites'&&this.save.favorites.includes(l.id)));
      if(!levels.length)return '';
      const complete=this.catalog.levels.filter(l=>l.chapter===c.id&&this.save.completed.includes(l.id)).length;
      return `<section class="chapter" id="chapter-${c.id}" style="--chapter-color:${c.color}"><div class="chapter-heading"><div class="chapter-title"><span class="chapter-number">${String(c.id).padStart(2,'0')}</span><div><h2>${esc(c.title)}</h2><p>${esc(c.subtitle)}</p></div></div><div class="chapter-meta"><span>${complete} of ${this.catalog.levels.filter(l=>l.chapter===c.id).length} discovered</span>${button('Keep offline',`offline:${c.id}`,'small secondary','download')}</div></div><div class="scene-grid">${levels.map(l=>this.sceneCard(l)).join('')}</div></section>`;
    }).join('')}<p class="catalog-note">${icon('leaf')} Take these in any order. There’s always more time.</p></main>`;
    const jump=document.querySelector<HTMLSelectElement>('#chapter-jump')!;
    jump.onchange=()=>document.getElementById(jump.value)?.scrollIntoView({behavior:this.save.preferences.reduceMotion?'instant':'smooth',block:'start'});
    requestAnimationFrame(()=>window.scrollTo(0,this.save.catalogScroll));
  }
  private renderAlbum(){
    const completed=this.catalog.levels.filter(l=>this.save.completed.includes(l.id));
    const favorites=this.catalog.levels.filter(l=>this.save.favorites.includes(l.id));
    const postcards=this.catalog.chapters.filter(c=>this.catalog.levels.filter(l=>l.chapter===c.id).every(l=>this.save.completed.includes(l.id)));
    root.innerHTML=`${this.header('album')}<main class="page album"><div class="page-title"><p class="eyebrow">THE LOVELY THINGS YOU FOUND</p><h1>My album</h1><p>${completed.length} of ${this.catalog.levels.length} little worlds explored.</p></div>${completed.length===this.catalog.levels.length?'<div class="all-celebration"><h2>A whole world of discoveries.</h2><p>All current pictures, lovingly explored. There’s always room for another visit.</p></div>':''}${postcards.length?`<section class="postcards"><h2>Postcards from your travels</h2><div class="postcard-grid">${postcards.map(c=>`<article class="postcard"><img src="${asset(this.catalog.levels.filter(l=>l.chapter===c.id).at(-1)!.thumbnail)}" alt=""><span>${icon('flower')} Chapter ${c.id}</span><h3>${esc(c.title)}</h3><p>Every little detail discovered.</p></article>`).join('')}</div></section>`:''}<section><h2>Completed pictures</h2>${completed.length?`<div class="scene-grid">${completed.map(l=>this.sceneCard(l)).join('')}</div>`:`<div class="empty-state">${icon('book')}<h3>Your story starts with one little find.</h3><p>Finished pictures will be kept here, ready to revisit.</p>${button('Begin exploring','continue','primary','next')}</div>`}</section>${favorites.length?`<section class="favorites-section"><h2>A few favorites</h2><div class="scene-grid">${favorites.map(l=>this.sceneCard(l)).join('')}</div></section>`:''}</main>`;
    window.scrollTo(0,0);
  }
  private async play(id:number){
    const sequence=++this.loadSequence;
    this.scene?.destroy();this.scene=undefined;this.level=undefined;this.selected=undefined;this.exactShown=false;
    this.pictureReady=false;
    document.body.classList.add('is-playing');
    const meta=this.catalog.levels[id-1];
    root.innerHTML=`<main class="play"><header class="play-header">${iconButton('Choose a scene','scenes','back')}<div class="play-heading"><p>SCENE ${String(id).padStart(2,'0')}</p><h1>${esc(meta.title)}</h1></div><span id="progress" class="progress-count">${this.save.attempts[id]?.found.length??0} / ${meta.targetCount}</span>${iconButton('Open settings','settings','settings')}</header><section id="picture" class="scene-viewport" tabindex="0" aria-label="${esc(meta.title)}. Search the picture for objects."><div class="scene-message"><span class="loading-flower">${icon('flower')}</span><p>Opening a little world…</p></div></section><aside class="object-pane" aria-label="Objects to find"><span id="tray-title" class="sr-only">LITTLE THINGS TO FIND</span>${iconButton('All objects','all-objects','grid','tray-more')}<div id="object-tray" class="object-tray"></div></aside><div class="play-controls" aria-label="Search and picture controls">${button('Hint','hint','help-button','hint')}${button('Show me','reveal','help-button','eye')}<div class="zoom-controls">${iconButton('Zoom out','zoom-out','minus')}${iconButton('Zoom in','zoom-in','plus')}</div>${button('Fit picture','fit','fit-button','fit')}</div><div id="reveal-notice" class="reveal-notice" hidden>${icon('eye')}<span>Here’s a little help</span>${iconButton('Dismiss exact outline','dismiss-help','close')}</div></main>`;
    const host=document.querySelector<HTMLElement>('#picture')!;
    try{
      if(meta.status!=='reviewed')throw Error('This illustration is still in production. It is not counted as a finished level.');
      const response=await fetch(asset(levelUrl(id)));
      if(!response.ok)throw Error('This picture is not saved on this device yet. Reconnect and tap Try again. Your progress is safe.');
      const level=await response.json() as Level;
      if(sequence!==this.loadSequence)return;
      if(level.id!==meta.id||level.targets.length!==meta.targetCount||level.targets.some((target,i)=>target.id!==meta.targetIds[i]))throw Error('This scene’s object data could not be read. Please retry. Your progress is safe.');
      this.level=level;
      const attempt=this.save.attempts[id]??(this.save.attempts[id]=newAttempt(this.save.completed.includes(id)));
      this.save.current=id;attempt.updated=Date.now();this.write();
      host.innerHTML='';
      const scene=new SceneView(host,target=>this.find(target),view=>{
        if(this.level?.id!==id)return;attempt.view=view;
        clearTimeout(this.viewTimer);this.viewTimer=window.setTimeout(()=>this.write(),150);
      },asset,()=>{
        if(sequence!==this.loadSequence)return;
        if(host.querySelector('.picture-paused'))return;
        this.pictureReady=false;
        this.write();
        host.insertAdjacentHTML('beforeend',`<div class="scene-message picture-paused"><h2>A little pause</h2><p>Your discoveries are safe. Open the picture again when you’re ready.</p>${button('Open picture again',`play:${id}`,'primary','replay')}</div>`);
      });
      this.scene=scene;
      await scene.init();
      if(sequence!==this.loadSequence){scene.destroy();return;}
      await scene.load(level,attempt.view,attempt.found,this.save.preferences.markers);
      if(sequence!==this.loadSequence)return;
      this.pictureReady=true;
      this.renderTray();
      this.updateProgress();
      void navigator.serviceWorker?.ready.then(async()=>{if(!this.offline.manifest&&!this.offline.error)await this.offline.init();await this.offline.keepVisited(level);});
      if(!this.save.onboarded){this.save.onboarded=true;this.write();this.onboarding();}
    }catch(error){
      if(sequence!==this.loadSequence)return;
      this.scene?.destroy();this.scene=undefined;
      if(import.meta.env.DEV)console.warn('Picture loading paused',error);
      const message=meta.status==='reviewed'?'This picture couldn’t open. Reconnect and tap Try again. Your discoveries are safe.':'This illustration is still in production. It is not counted as a finished level.';
      host.innerHTML=`<div class="scene-message">${icon('leaf')}<h2>A little pause</h2><p>${esc(message)}</p>${button('Try again',`play:${id}`,'primary','replay')}${button('Choose a scene','scenes','secondary','grid')}</div>`;
    }
  }
  private renderTray(){
    if(!this.level)return;
    const tray=document.querySelector<HTMLElement>('#object-tray');if(!tray)return;
    const scroll=tray.scrollLeft;
    const found=this.save.attempts[this.level.id].found;
    const targets=this.level.targets.filter(t=>!this.remainingOnly||!found.includes(t.id));
    tray.innerHTML=targets.map(t=>this.targetCard(t)).join('')||'<p class="tray-all-found">Every little detail found. Stay and enjoy the view.</p>';
    tray.scrollLeft=scroll;
  }
  private targetCard(target:Target){
    const found=this.level?this.save.attempts[this.level.id].found.includes(target.id):false;
    return `<button class="object-card ${found?'found':''} ${this.selected===target.id?'selected':''}" data-action="object:${target.id}" aria-label="${esc(target.name)}${found?', found':''}" aria-pressed="${this.selected===target.id}"><span class="object-preview"><img src="${asset(target.preview)}" alt="" draggable="false" loading="eager">${found?`<span class="found-check">${icon('check')}</span>`:''}</span><span class="object-name">${esc(target.name)}</span></button>`;
  }
  private updateProgress(){
    if(!this.level)return;
    const count=this.save.attempts[this.level.id].found.length;
    const el=document.querySelector('#progress');if(el){el.textContent=`${count} / ${this.level.targetCount}`;el.setAttribute('aria-label',`${count} of ${this.level.targetCount} found`);}
    document.querySelector('#tray-title')!.textContent=count===this.level.targetCount?'ALL FOUND. NICELY SPOTTED.':'LITTLE THINGS TO FIND';
  }
  private find(target:Target){
    if(!this.level)return;
    const attempt=this.save.attempts[this.level.id];
    if(attempt.found.includes(target.id)){this.scene?.acknowledge(target);toast(`${target.name} · already found`);return;}
    const meta=this.catalog.levels[this.level.id-1];
    if(!collect(this.save,meta,target.id))return;
    this.scene?.setFound(attempt.found,this.save.preferences.markers);
    this.write();this.renderTray();this.updateProgress();
    if(this.selected===target.id)this.selected=undefined;
    if(this.exactShown&&this.exactTarget===target.id){this.exactShown=false;this.exactTarget=undefined;document.querySelector<HTMLElement>('#reveal-notice')!.hidden=true;}
    toast(`${target.name}. Lovely find!`);this.chime();
    if(attempt.completed)this.completion();
  }
  private help(exact:boolean){
    if(!this.level||!this.scene)return;
    if(!this.pictureReady){toast('The picture is opening. Your little details will be here in a moment.');return;}
    const found=this.save.attempts[this.level.id].found;
    const target=this.level.targets.find(t=>t.id===this.selected&&!found.includes(t.id))??this.level.targets.find(t=>!found.includes(t.id));
    if(!target){toast('All found. Take your time and enjoy the picture.');return;}
    this.selected=target.id;this.closeModal();this.scene.help(target,exact);this.exactShown=exact;this.exactTarget=exact?target.id:undefined;
    document.querySelector<HTMLElement>('#reveal-notice')!.hidden=!exact;
    this.renderTray();toast(exact?`${target.name} · outlined in the picture`:`${target.name} · here’s a little help`);
  }
  private dismissHelp(){this.scene?.dismissHelp();this.exactShown=false;this.exactTarget=undefined;const el=document.querySelector<HTMLElement>('#reveal-notice');if(el)el.hidden=true;}
  private openObject(id:string){
    const target=this.level?.targets.find(t=>t.id===id);if(!target||!this.level)return;
    this.selected=id;this.renderTray();
    const found=this.save.attempts[this.level.id].found.includes(id);
    const detail=found?`<p class="found-label">${icon('check')} Already found. Nicely spotted.</p>`:`<p>A little help is always here, whenever you like.</p><div class="sheet-actions">${button('Hint','hint','secondary','hint')}${button('Show me','reveal','primary','eye')}</div>${button('Mark found',`assist:${id}`,'assist-button','check')}`;
    this.modal(`<div class="enlarged-preview"><img src="${asset(target.preview)}" alt="Exact picture of ${esc(target.name)}"></div><p class="eyebrow">${found?'A LOVELY DISCOVERY':'TAKE A CLOSER LOOK'}</p><h2>${esc(target.name)}</h2>${detail}`,'object-dialog');
  }
  private allObjects(){
    if(!this.level)return;
    this.modal(`<p class="eyebrow">SCENE ${this.level.id}</p><h2>All the little things</h2><p>Tap any picture for a closer look or a little help.</p><label class="sheet-remaining"><input type="checkbox" id="remaining-only" ${this.remainingOnly?'checked':''}> Show remaining objects only in the bottom tray</label><div class="all-objects-grid">${this.level.targets.map(t=>this.targetCard(t)).join('')}</div>`,'all-objects-dialog');
    document.querySelector<HTMLInputElement>('#remaining-only')!.onchange=e=>{this.remainingOnly=(e.target as HTMLInputElement).checked;this.renderTray();};
  }
  private onboarding(){this.modal(`<div class="onboard-art">${icon('search')}${icon('flower')}</div><p class="eyebrow">WELCOME TO LITTLE DISCOVERIES</p><h2>A little time, just for you.</h2><p>Find the things pictured in the tray. Tap them in the scene when you spot them.</p><div class="onboard-tips"><p>${icon('fit')} Pinch to zoom. Drag to look around.</p><p>${icon('hint')} Hints and exact reveals are always here.</p><p>${icon('leaf')} No clock. No wrong turns. Take your time.</p></div>${button('Let’s explore','close','primary wide','next')}`,'onboarding');}
  private completion(){
    if(!this.level)return;
    const id=this.level.id,all=this.save.completed.length===this.catalog.levels.length;
    const chapter=this.catalog.chapters[this.level.chapter-1];
    const chapterComplete=this.catalog.levels.filter(l=>l.chapter===chapter.id).every(l=>this.save.completed.includes(l.id));
    this.modal(`<div class="completion-flower">${icon('flower')}</div><p class="eyebrow">${all?'A WHOLE WORLD EXPLORED':'A LOVELY LITTLE MOMENT'}</p><h2>All found.<br>Nicely spotted.</h2><p>${id===28?'Every little detail found.':id===50?'Made for you, with love.':'There’s something lovely in taking a closer look.'}</p>${chapterComplete?`<p class="postcard-note">${icon('book')} A postcard from ${esc(chapter.title)} is waiting in your album.</p>`:''}${all?`<p>You’ve explored all ${this.catalog.levels.length} pictures. They’re always here for another visit.</p>`:''}<div class="completion-actions">${id<this.catalog.levels.length?button('Next scene',`play:${id+1}`,'primary wide','next'):button('My album','album','primary wide','book')}${button('Stay and look','close','secondary wide','eye')}${button('Choose a scene','scenes','text-button','grid')}${button('Search again','replay','text-button','replay')}</div>`,'completion-dialog');
  }
  private modal(content:string,cls=''){
    this.closeModal();this.modalReturn=document.activeElement instanceof HTMLElement?document.activeElement:undefined;
    const dialog=document.createElement('dialog');dialog.className=`sheet ${cls}`;dialog.setAttribute('aria-label',cls.includes('object')?'Object details':cls.includes('settings')?'Settings':'Little Discoveries');
    dialog.innerHTML=`${iconButton('Close panel','close','close','sheet-close')}<div class="sheet-content">${content}</div>`;
    dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)this.closeModal();}else void this.click(e);});
    dialog.addEventListener('close',()=>{dialog.remove();this.modalReturn?.focus({preventScroll:true});});
    document.body.append(dialog);dialog.showModal();
  }
  private closeModal(){document.querySelector<HTMLDialogElement>('dialog')?.close();}
  private settings(){
    const p=this.save.preferences;
    this.modal(`<p class="eyebrow">MAKE YOURSELF AT HOME</p><h2>The little details</h2><div class="settings-list">${[['sound','Quiet chimes','A soft sound with each discovery.'],['largePreviews','Larger previews','More room for the pictures in your tray.'],['largeText','Larger text','A little easier to read.'],['markers','Found markers','Small check marks in the picture.'],['reduceMotion','Reduce motion','Keep transitions still and gentle.']].map(([key,label,help])=>`<label class="setting-row"><span><strong>${label}</strong><small>${help}</small></span><input type="checkbox" role="switch" data-pref="${key}" ${(p as unknown as Record<string,boolean>)[key]?'checked':''}></label>`).join('')}</div><div class="settings-section"><h3>Your progress, safely kept</h3><p>Saved automatically on this device. Keep a backup to bring it to another browser or phone.</p><div class="sheet-actions">${button('Back up progress','export','secondary','download')}${button('Restore progress','import','secondary','upload')}</div><input type="file" id="import-file" accept=".json,application/json" hidden><p class="small-note">Browser storage and offline files can be cleared by your device. A backup keeps your discoveries safe.</p></div>${this.level?`<div class="settings-section settings-scene-actions">${button('Search this scene again','replay','text-button','replay')}${button(this.save.favorites.includes(this.level.id)?'Remove favorite':'Favorite this scene',`favorite:${this.level.id}`,'text-button','heart')}</div>`:''}<div class="settings-section"><h3>Take a chapter with you</h3><p>Save pictures, previews, and the game for offline visits.</p><div class="offline-chapter-list">${this.catalog.chapters.map(c=>button(`${c.id}. ${esc(c.title)}`,`offline:${c.id}`,'offline-chapter','download')).join('')}</div></div><p class="made-with-love">Made for you, with love.</p>`,'settings-dialog');
    document.querySelectorAll<HTMLInputElement>('[data-pref]').forEach(input=>input.onchange=()=>{const key=input.dataset.pref as keyof typeof p;p[key]=input.checked;this.preferences();this.write();if(this.level)this.scene?.setFound(this.save.attempts[this.level.id].found,p.markers);});
    document.querySelector<HTMLInputElement>('#import-file')!.onchange=e=>void this.readImport((e.target as HTMLInputElement).files?.[0]);
  }
  private async readImport(file?:File){
    if(!file)return;
    try{
      if(file.size>2_000_000)throw Error('That file is too large to be a progress backup. Your progress has not changed.');
      const next=importBackup(await file.text(),this.catalog.levels);
      const complete=next.completed.length,found=Object.values(next.attempts).reduce((n,a)=>n+a.found.length,0);
      this.modal(`<p class="eyebrow">BACKUP CHECKED</p><h2>Bring your discoveries back?</h2><p>This backup contains ${complete} completed scenes and ${found} found objects.</p><p>Restoring replaces the progress currently saved on this device. You can back up your current progress first.</p><div class="sheet-actions">${button('Back up current progress','export','secondary','download')}${button('Restore this backup','confirm-import','primary','upload')}</div>${button('Keep current progress','close','text-button')}`,'restore-dialog');
      document.querySelector<HTMLButtonElement>('[data-action="confirm-import"]')!.onclick=e=>{
        e.stopPropagation();this.write();this.save=next;this.write();this.preferences();this.closeModal();this.navigate(`scene/${next.current}`);toast('Your discoveries are back. Welcome home.');
      };
    }catch(error){toast(error instanceof Error?error.message:'That backup could not be read. Your progress has not changed.');}
  }
  private export(){
    this.write();const blob=new Blob([exportBackup(this.save)],{type:'application/json'});const url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download=`little-discoveries-${new Date().toISOString().slice(0,10)}.json`;document.body.append(a);a.click();a.remove();window.setTimeout(()=>URL.revokeObjectURL(url),5000);toast('Backup ready. Keep it in Files or another safe place.');
  }
  private async offlinePanel(id:number){
    const chapter=this.catalog.chapters[id-1];
    this.modal(`<p class="eyebrow">CHAPTER ${id}</p><h2>${esc(chapter.title)}</h2><p>Keep all ${this.catalog.levels.filter(l=>l.chapter===id).length} pictures and their little details with you.</p><div id="offline-state" data-chapter="${id}" role="status">Checking saved files…</div><div id="offline-actions"></div><p class="small-note">Offline play works while your browser keeps these files. Search progress is saved separately.</p>`,'offline-dialog');
    if(!this.offline.manifest&&!this.offline.error)await this.offline.init();
    const stateEl=document.querySelector<HTMLElement>('#offline-state');if(!stateEl)return;
    if(this.offline.error){stateEl.textContent=this.offline.error;document.querySelector('#offline-actions')!.innerHTML=button('Retry offline setup',`offline-retry:${id}`,'primary','replay');return;}
    const render=(state:DownloadState)=>{
      const el=document.querySelector<HTMLElement>('#offline-state'),actions=document.querySelector('#offline-actions');if(!el||!actions||el.dataset.chapter!==String(id))return;
      const chapterInfo=this.offline.manifest?.chapters.find(c=>c.id===id);
      const ready=chapterInfo?.readyLevels??0,expected=this.catalog.levels.filter(l=>l.chapter===id).length;
      el.innerHTML=`<div class="offline-summary">${icon(state.available?'check':'download')}<strong>${state.available?'Available offline':this.offline.busy.has(id)?'Saving your little getaway…':state.partial?'Download paused':'Ready to take with you'}</strong></div><p>${(state.bytes/1_000_000).toFixed(1)} MB · ${state.cached} of ${state.total} files saved</p><progress value="${state.cached}" max="${Math.max(1,state.total)}" aria-label="Chapter download progress"></progress>${ready!==expected?`<p>${ready} of ${expected} illustrations have been produced. This full chapter package is still in production.</p>`:''}`;
      actions.innerHTML=state.available?button('Choose a picture','scenes','primary wide','grid'):this.offline.busy.has(id)?'<p class="small-note">You can keep playing while the files download.</p>':ready===expected?button(state.cached?'Resume download':'Keep this chapter offline',`download:${id}`,'primary wide','download'):'';
    };
    try{render(await this.offline.state(id));}catch{stateEl.textContent='Saved files could not be checked. Reconnect and retry. Your progress is safe.';}
    const download=async()=>{try{const promise=this.offline.download(id,render);render(await this.offline.state(id));await promise;toast('Chapter saved. A little getaway, even offline.');}catch(error){toast(error instanceof Error?error.message:'Download paused. Reconnect and resume.');render(await this.offline.state(id));} };
    this.startDownload=download;
  }
  private chime(){
    if(!this.save.preferences.sound)return;
    try{this.audio??=new AudioContext();void this.audio.resume();const o=this.audio.createOscillator(),g=this.audio.createGain(),now=this.audio.currentTime;o.type='sine';o.frequency.setValueAtTime(784,now);o.frequency.exponentialRampToValueAtTime(1046,now+.08);g.gain.setValueAtTime(.035,now);g.gain.exponentialRampToValueAtTime(.0001,now+.32);o.connect(g);g.connect(this.audio.destination);o.start();o.stop(now+.33);}catch{/* Sound never blocks a find. */}
  }
  private async click(event:Event){
    const el=(event.target as Element)?.closest<HTMLElement>('[data-action]');if(!el)return;
    const action=el.dataset.action!;const [name,...rest]=action.split(':');const value=rest.join(':');
    if(name==='play'){
      if(this.route==='scenes'){this.save.catalogScroll=window.scrollY;this.write();}
      this.navigate(`scene/${value}`);
    }else if(name==='continue')this.navigate(`scene/${continueLevel(this.save,this.catalog.levels)}`);
    else if(name==='settings')this.settings();
    else if(name==='scenes'||name==='album'||name==='home')this.navigate(name);
    else if(name==='close')this.closeModal();
    else if(name==='hint')this.help(false);
    else if(name==='reveal')this.help(true);
    else if(name==='dismiss-help')this.dismissHelp();
    else if(name==='zoom-in')this.scene?.zoom(1.5);
    else if(name==='zoom-out')this.scene?.zoom(1/1.5);
    else if(name==='fit')this.scene?.fit();
    else if(name==='object')this.openObject(value);
    else if(name==='all-objects')this.allObjects();
    else if(name==='assist'){const target=this.level?.targets.find(t=>t.id===value);this.closeModal();if(target)this.find(target);}
    else if(name==='favorite'){
      const id=+value;this.save.favorites=this.save.favorites.includes(id)?this.save.favorites.filter(n=>n!==id):[...this.save.favorites,id];this.write();
      el.classList.toggle('is-favorite',this.save.favorites.includes(id));el.setAttribute('aria-pressed',String(this.save.favorites.includes(id)));el.setAttribute('aria-label',`${this.save.favorites.includes(id)?'Unfavorite':'Favorite'} ${this.catalog.levels[id-1].title}`);
      toast(this.save.favorites.includes(id)?'Saved to your favorites.':'Removed from favorites.');
    }else if(name==='filter'){this.catalogFilter=value;this.save.catalogScroll=0;this.renderCatalog();}
    else if(name==='replay'&&this.level){
      const id=this.level.id;this.save.attempts[id]=newAttempt(this.save.completed.includes(id));this.write();this.closeModal();await this.play(id);
    }else if(name==='export')this.export();
    else if(name==='import')document.querySelector<HTMLInputElement>('#import-file')?.click();
    else if(name==='offline')await this.offlinePanel(+value);
    else if(name==='download')await this.startDownload?.();
    else if(name==='offline-retry'){this.offline.error='';await this.offline.init();await this.offlinePanel(+value);}
  }
}

async function boot(){
  try{
    const response=await fetch(asset(catalogUrl));if(!response.ok)throw Error('catalog');
    const catalog=await response.json() as Catalog;
    if(catalog.revision!==3||catalog.levels.length!==catalog.requiredScenes||catalog.levels.reduce((sum,level)=>sum+level.targetCount,0)!==catalog.requiredPlacements||!catalog.levels.some(level=>level.id===56))throw Error('catalog count or revision');
    new Game(catalog);
  }catch{
    root.innerHTML=`<main class="startup-error">${icon('flower')}<h1>A little pause</h1><p>The game could not open its scene list. Connect once to get started; downloaded chapters can then travel with you.</p><button class="primary" id="retry-start">Try again</button></main>`;
    document.querySelector('#retry-start')!.addEventListener('click',()=>void boot());
  }
}
void boot();
