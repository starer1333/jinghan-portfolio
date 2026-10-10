/* Local preview. Requested interactions only; no network or external writes. */
(()=>{'use strict';
const reduced=()=>matchMedia('(prefers-reduced-motion:reduce)').matches||document.documentElement.classList.contains('static-mode');
const ns='http://www.w3.org/2000/svg';
const svgNode=(tag,attrs)=>{const e=document.createElementNS(ns,tag);for(const [k,v]of Object.entries(attrs||{}))e.setAttribute(k,v);return e};
// A cut-away corner with a curved paper underside and moving contact shadow.
document.querySelectorAll('.original-pdf').forEach((link,index)=>{
 const content=document.createElement('span');content.className='note-content';
 while(link.firstChild)content.append(link.firstChild);
 const svg=svgNode('svg',{viewBox:'0 0 320 116',preserveAspectRatio:'none',class:'note-paper','aria-hidden':'true'});
 const defs=svgNode('defs'),gradient=svgNode('linearGradient',{id:'note-fold-'+index,x1:'0%',y1:'0%',x2:'100%',y2:'100%'});
 for(const [offset,color]of [['0%','#ba7188'],['24%','#edb7c6'],['57%','#fff0f3'],['88%','#f7d6df'],['100%','#d293a7']])gradient.append(svgNode('stop',{offset,'stop-color':color}));
 defs.append(gradient);svg.append(defs);
 const face=svgNode('path',{class:'note-face'}),crease=svgNode('path',{class:'note-crease'}),fold=svgNode('path',{class:'note-fold',fill:'url(#note-fold-'+index+')'});
 svg.append(face,crease,fold);link.append(svg,content);
 let current=13,target=13,frame=0;
 function paint(c){
  const x=316-c,y=112-c;
  face.setAttribute('d',`M5 8 Q55 3 105 6 L184 3 Q241 5 314 2 L316 ${y} Q${314-c*.16} ${y+c*.2} ${x} 112 L255 111 L221 115 L156 112 L92 115 L44 111 L3 113 L5 76 L2 44 Z`);
  crease.setAttribute('d',`M316 ${y} Q${x+8} ${y+9} ${x} 112`);
  fold.setAttribute('d',`M316 ${y} C308 ${y+9} ${x+9} ${y-2} ${x+5} ${y+9} C${x} ${y+20} ${x+12} 102 ${x} 112 Q${x+c*.48} ${y+c*.63} 316 ${y}Z`);
  link.style.setProperty('--note-lift',((c-13)/38).toFixed(3));
 }
 function tick(){current+=(target-current)*.17;paint(current);if(Math.abs(target-current)>.06)frame=requestAnimationFrame(tick);else{paint(target);frame=0}}
 function aim(n){target=reduced()?13:n;if(!frame)frame=requestAnimationFrame(tick)}
 link.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')aim(45)});
 link.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'){const r=link.getBoundingClientRect();aim(35+18*Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)))}});
 link.addEventListener('pointerleave',()=>aim(link.matches(':focus-visible')?45:13));
 link.addEventListener('focus',()=>aim(45));link.addEventListener('blur',()=>aim(13));paint(13);
});
// Keep each source note with its contents list while scrolling, so they cannot overlap.
document.querySelectorAll('.reader-grid>aside').forEach(aside=>{
 if(!aside.querySelector(':scope>.original-pdf'))return;
 const group=document.createElement('div');group.className='reader-source-group';
 while(aside.firstChild)group.append(aside.firstChild);aside.append(group);
});
// Keep the text, language spans and highlights. Every introduction reveals once.
const selectors=['.question-intro>h3','.observe-layout-v5>div>h3','.make-chapter>h3','.notes-intro h3','.about-intro h3'];
let headings=[...document.querySelectorAll(selectors.join(','))];
const notes=document.querySelector('#notes h3');if(notes&&!headings.includes(notes))headings.push(notes);
const observer=new IntersectionObserver(entries=>{entries.forEach(({target,isIntersecting})=>{
 if(!isIntersecting)return;target.dataset.revealed='true';target.classList.remove('reveal-waiting');target.classList.add('reveal-playing');observer.unobserve(target);
 setTimeout(()=>target.classList.remove('reveal-playing'),1500);
})},{rootMargin:'0px 0px -12% 0px',threshold:.12});
headings.forEach(h=>{
 h.classList.add('intro-reveal');
 const names={zh:h.querySelector('[lang="zh-CN"]')?.textContent,en:h.querySelector('[lang="en"]')?.textContent};
 const name=()=>h.setAttribute('aria-label',(document.documentElement.dataset.language==='en'?names.en:names.zh)||h.textContent);
 name();addEventListener('how-language-change',name);
 const walker=document.createTreeWalker(h,NodeFilter.SHOW_TEXT),nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 let count=0;
 for(const node of nodes){
  if(!node.textContent.trim())continue;
  const fragment=document.createDocumentFragment(),segments=node.textContent.match(/[A-Za-z0-9]+(?:[’'\-][A-Za-z]+)*|\s+|[^\s]/gu)||[];
  for(const part of segments){
   if(/^\s+$/.test(part)){fragment.append(document.createTextNode(part));continue;}
   const mask=document.createElement('span');mask.className='reveal-mask';
   const ink=document.createElement('span');ink.className='reveal-ink';ink.textContent=part;
   mask.style.setProperty('--reveal-delay',Math.min(count++*24,500)+'ms');mask.append(ink);fragment.append(mask);
  }node.replaceWith(fragment);
 }
 if(reduced()||h.getBoundingClientRect().bottom<0){h.dataset.revealed='true';return;}
 h.classList.add('reveal-waiting');observer.observe(h);
});
const opening=document.querySelector('.opening');if(!opening)return;
const icon='<svg viewBox="0 0 72 72" aria-hidden="true"><circle class="scroll-ring" cx="36" cy="36" r="31"/><path class="scroll-chevron" d="M27 33 L36 42 L45 33"/></svg>';
const idle=document.createElement('button');idle.type='button';idle.className='hero-idle-hint';idle.setAttribute('aria-label','向下探索 / Scroll to explore');idle.innerHTML=icon;idle.hidden=true;opening.append(idle);
// The native pointer remains unchanged; only the bottom-centre hint responds.
let lower=false,lastScroll=performance.now(),timer=0;
const atOpening=()=>scrollY<innerHeight*.62&&opening.getBoundingClientRect().bottom>innerHeight*.5;
function update(){idle.hidden=!atOpening()||!!document.querySelector('#main-nav.open')||!(lower||performance.now()-lastScroll>2700);}
function schedule(){clearTimeout(timer);timer=setTimeout(update,2800);}
document.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;lower=e.clientY>innerHeight*.5;update()},{passive:true});
document.documentElement.addEventListener('pointerleave',()=>{lower=false;update()});
addEventListener('scroll',()=>{lastScroll=performance.now();update();schedule()},{passive:true});
addEventListener('resize',update);
idle.addEventListener('click',()=>{idle.hidden=true;document.querySelector('#question')?.scrollIntoView({behavior:reduced()?'instant':'smooth',block:'start'})});
update();schedule();
})();
