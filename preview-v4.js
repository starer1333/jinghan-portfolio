/* Independent local preview: no remote requests, tracking or publishing. */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduced=()=>matchMedia('(prefers-reduced-motion:reduce)').matches||document.documentElement.classList.contains('static-mode');
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
// A pop out, settle, then existing 3D pointer response. This does not change book layout.
const books=[]; // New book movement is staged in motion-study.html.
const bookObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('pop-seen');if(!reduced()){e.target.classList.add('pop-playing');setTimeout(()=>e.target.classList.remove('pop-playing'),1150)}bookObserver.unobserve(e.target)}),{threshold:.18});
books.forEach(book=>{book.classList.add('v4-book-pop','pop-ready');bookObserver.observe(book)});
// Small idle motion belongs to the art, so existing link and scroll transforms remain intact.
$$('.research-art-target>img').forEach(img=>img.classList.add('v4-motion-art'));
function wrap(img,cls){const s=document.createElement('span');s.className=cls;img.before(s);s.append(img);return s;}
$$('.shipping-entry .research-art-target>img').forEach(img=>{const w=wrap(img,'v4-ship-wrap');w.insertAdjacentHTML('beforeend','<svg class="sea-ripples" viewBox="0 0 260 60" aria-hidden="true"><path d="M3 22q17-5 33 0t34 0t34 0t34 0t34 0t34 0t34 0"/><path d="M15 33q18-4 36 0t36 0t36 0t36 0t36 0t36 0"/><path d="M28 43q17-4 34 0t34 0t34 0t34 0t34 0"/><path d="M42 52q25-3 50 0t50 0t50 0"/></svg>')});
$$('.cinema-link .research-art-target>img').forEach(img=>{const w=wrap(img,'v4-film-wrap');const reel=document.createElement('span');reel.className='reel-disc';reel.setAttribute('aria-hidden','true');w.append(reel)});
// Two continuous sheets. Deterministic multi-scale fibers, a curved reverse face,
// and a damped spring on the torn edge. No spacer or chapter dimensions are changed.
const ns='http://www.w3.org/2000/svg';
function node(tag,attrs,parent){const n=document.createElementNS(ns,tag);for(const[k,v]of Object.entries(attrs||{}))n.setAttribute(k,v);parent?.append(n);return n;}
$$('.paper-transition').forEach((section,index)=>{
 const s=$('svg',section);s.innerHTML='';const defs=node('defs',{},s),id='v4-paper-'+index;
 const texture=node('filter',{id:id+'-grain',x:'0',y:'0',width:'100%',height:'100%'},defs);
 node('feTurbulence',{type:'fractalNoise',baseFrequency:'.32',numOctaves:'3',seed:'17',result:'noise'},texture);
 node('feColorMatrix',{type:'saturate',values:'0',in:'noise',result:'gray'},texture);
 node('feComponentTransfer',{in:'gray',result:'soft'},texture).innerHTML='<feFuncA type="linear" slope=".16"/>';
 node('feComposite',{in:'soft',in2:'SourceGraphic',operator:'in',result:'grain'},texture);
 node('feBlend',{in:'SourceGraphic',in2:'grain',mode:'multiply'},texture);
 const grad=node('linearGradient',{id:id+'-fold',x1:'0%',y1:'20%',x2:'100%',y2:'65%'},defs);
 [['0%','#cbd0c7'],['16%','#eeeFE8'],['46%','#fffef8'],['78%','#f5f5ef'],['100%','#c9cfc4']].forEach(([offset,color])=>node('stop',{offset,'stop-color':color},grad));
 const recover=section.classList.contains('recover'),front=recover?'var(--mint)':'#ffffff';
 const base=node('rect',{fill:recover?'#ffffff':'var(--mint)',x:'0',y:'0'},s);
 const shadow=node('path',{fill:'#29473a',class:'v4-paper-shadow'},s);
 const fiber=node('path',{fill:'#f7f6ed',filter:`url(#${id}-grain)`,class:'v4-paper-fiber'},s);
 const face=node('path',{fill:front},s);
 const fringe=node('path',{fill:'none',stroke:'#edeedf','stroke-width':'.8','stroke-opacity':'.9'},s);
 const foldShadow=node('path',{fill:'#213d32',opacity:'.16',style:'filter:blur(6px)'},s);
 const fold=node('path',{fill:`url(#${id}-fold)`,filter:`url(#${id}-grain)`,class:'v4-fold-hit'},s);
 const crease=node('path',{fill:'none',stroke:'#fffef6','stroke-width':'1.2',opacity:'.85'},s);
 const hit=node('path',{class:'paper-hit'},s);
 let w=0,h=0,canvas=0,progress=0,spring=0,velocity=0,mouseX=0,frame=0,last=0;
 function edge(x){const q=x/w;return h*(.66-.36*q)+Math.sin(x*.019)*5+Math.sin(x*.064+.7)*2.3+Math.sin(x*.31)*1.1+Math.sin(x*1.03)*.48+spring*Math.exp(-Math.pow((x-mouseX)/150,2));}
 function draw(){
  const r=section.getBoundingClientRect();w=section.clientWidth;h=section.clientHeight;canvas=h+180;
  progress=reduced()?1:clamp((innerHeight*.95-r.top)/(innerHeight*.55));section.dataset.progress=progress.toFixed(3);
  s.setAttribute('viewBox',`0 0 ${w} ${canvas}`);base.setAttribute('width',w);base.setAttribute('height',h);
  const ease=progress*progress*(3-2*progress),tip=w*(1.13-1.4*ease),start=clamp(tip,-10,w+10),ty=edge(tip),depth=canvas-ty;
  const wave=[];for(let x=w+4;x>=Math.max(-4,start);x-=2)wave.push([x,edge(x)]);
  wave.push([start,edge(start)]);
  const line=wave.map(([x,y])=>`${x.toFixed(2)},${y.toFixed(2)}`).join(' L');
  const hasFold=tip>-160&&tip<w&&progress>.02&&progress<.99;
  const curlLeft=-195+spring*.7;
  // The covered region extends beyond every canvas edge: no rectangular cutout.
  const tail=tip>=w?`L${w+6},${canvas+6} L-6,${canvas+6}`:tip<-160?'':`C${tip+depth*.11},${ty+depth*.35} ${tip-depth*.24},${ty+depth*.88} ${curlLeft},${canvas+8} L-6,${canvas+8}`;
  const d=tip>=w?`M-6,-6H${w+6}V${canvas+8}H-6Z`:`M-6,-6H${w+6} L${line}${tail}Z`;
  face.setAttribute('d',d);
  const fiberLine=wave.map(([x,y])=>`${x.toFixed(2)},${(y+12+5*Math.sin(x*.027)+2*Math.sin(x*.11)).toFixed(2)}`).join(' L');
  fiber.setAttribute('d',tip>=w?d:`M-6,-6H${w+6} L${fiberLine}${tail}Z`);shadow.setAttribute('d',fiber.getAttribute('d'));shadow.setAttribute('transform',`translate(2 ${5+Math.abs(spring)*.1})`);
  let fibers='';for(const[x,y]of wave){if(Math.floor(x)%6<2)fibers+=`M${x},${y+3}l${Math.sin(x)*1.5},${2+Math.abs(Math.sin(x*.6))*5}`;}fringe.setAttribute('d',fibers);
  if(hasFold){
   const bottom=canvas+16,drop=bottom-ty,fw=Math.min(w*.36,drop*1.18);
   const jag=t=>Math.sin(t*91)*2.3+Math.sin(t*231)*1.1+Math.sin(t*477)*.5;
   const rough=[];
   for(let k=0;k<=70;k++){const q=k/70;rough.push([tip+drop*(.15*q-.10*q*q)+jag(q)*Math.min(1,q*12),ty+drop*q]);}
   const roughLine=rough.map(([x,y])=>`${x.toFixed(2)},${y.toFixed(2)}`).join(' L');
   const fd=`M${roughLine} L${tip+fw},${bottom+4} C${tip+fw*.94},${ty+drop*.75} ${tip+fw*.3},${ty+drop*.27} ${tip},${ty}Z`;
   fold.setAttribute('d',fd);foldShadow.setAttribute('d',fd);foldShadow.setAttribute('transform','translate(-14 9)');
   crease.setAttribute('d',`M${tip},${ty} C${tip+fw*.3},${ty+drop*.27} ${tip+fw*.94},${ty+drop*.75} ${tip+fw},${bottom+4}`);

  }else{fold.setAttribute('d','');foldShadow.setAttribute('d','');crease.setAttribute('d','');}
  hit.setAttribute('d',wave.length?`M${line}`:'');
 }
 function tick(now){frame=0;const dt=Math.min((now-last)/16.67||1,2);last=now;velocity+=(-spring*.065-velocity*.15)*dt;spring+=velocity*dt;draw();if(Math.abs(spring)+Math.abs(velocity)>.03)frame=requestAnimationFrame(tick);}
 function schedule(){if(!frame){last=performance.now();frame=requestAnimationFrame(tick)}}
 function stir(e){if(reduced()||progress<.08||progress>.96)return;mouseX=e.clientX-section.getBoundingClientRect().left;velocity+=clamp((e.movementY||2)*.3,-2,2);spring+=.45;schedule();}
 hit.addEventListener('pointermove',stir);fold.addEventListener('pointermove',stir);hit.addEventListener('pointerenter',stir);fold.addEventListener('pointerenter',stir);
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);addEventListener('v6-motion-change',schedule);draw();
});
})();
