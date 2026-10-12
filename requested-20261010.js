(()=>{'use strict';
 const reduced=()=>matchMedia('(prefers-reduced-motion:reduce)').matches||document.documentElement.classList.contains('static-mode');
 // Match T's independent float parent; keep the existing hover/drag transforms.
 document.querySelectorAll('.research-art-target>.v5-note-mesh,.research-art-target>.v4-film-wrap,.research-art-target>.v4-ship-wrap,.hello-line .study-postcard,.stamp-options>.topic-stamp').forEach((el,i)=>{
  el.classList.add('t-idle-art');el.style.setProperty('--idle-phase',(-i*1.19)+'s');
 });
 // T /shows title reveal: y -6 -> 0 in world coordinates; scale 0 -> 1;
 // z rotation -0.5 rad -> 0; 1.35 seconds, power4.out. Positive DOM y is downward.
 // The user specifically requests a downward-scroll trigger and no reverse playback.
 const pending=new Set(),tweens=new Map();
 const groups=[...document.querySelectorAll('.speech-bubble,.photo-volume,.notes-volume')];
 let previous=scrollY,frame=0;
 function finish(el){el.classList.remove('t-pop-waiting');el.dataset.popSeen='true';el.style.translate='0px 0px';el.style.scale='1';el.style.rotate='0rad';el.style.willChange='auto';pending.delete(el);}
 function reveal(el){
  if(!pending.has(el))return;pending.delete(el);el.classList.remove('t-pop-waiting');el.dataset.popSeen='true';
  if(reduced()||!window.gsap){finish(el);return;}
  const distance=Math.min(innerHeight*.66,560),state={p:0};
  const paint=()=>{el.style.translate=`0px ${distance*(1-state.p)}px`;el.style.scale=String(state.p);el.style.rotate=`${-.5*(1-state.p)}rad`;};
  paint();const tween=gsap.to(state,{p:1,duration:1.35,delay:el.matches('.listener')?.1:0,ease:'power4.out',onUpdate:paint,onComplete:()=>{finish(el);tweens.delete(el)}});tweens.set(el,tween);
 }
 groups.forEach(el=>{el.classList.add('t-pop-object');if(reduced()){finish(el);return;}el.classList.add('t-pop-waiting');pending.add(el);});
 function check(){frame=0;const down=scrollY>=previous;previous=scrollY;if(!down&&!reduced())return;
  pending.forEach(el=>{const stage=el.closest('.bubble-pair,.photo-book-stage,.notes-book-scene'),r=(stage||el).getBoundingClientRect();if(reduced()||r.top+r.height*.4<innerHeight*.86&&r.bottom>0)reveal(el);});
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(check)}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);
 function motionChanged(){if(reduced()){tweens.forEach(t=>t.kill());tweens.clear();groups.forEach(finish);}else schedule();}
 addEventListener('v6-motion-change',motionChanged);matchMedia('(prefers-reduced-motion:reduce)').addEventListener('change',motionChanged);
 document.querySelector('.perspective-switch')?.addEventListener('click',()=>document.querySelectorAll('.speech-bubble').forEach(reveal));
 // Keyboard navigation must never land on an invisible object.
 document.addEventListener('keydown',e=>{if(e.key==='Tab')pending.forEach(el=>{const r=el.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0)reveal(el);});});
 document.fonts.ready.then(schedule);schedule();
 const mark='<svg class="folded-quote" viewBox="0 0 98 94" aria-hidden="true"><g fill="#d5a0b6" stroke="#fffdf8" stroke-width="1.6" stroke-linejoin="round"><path d="M30 9 41 21 32 19Q23 33 24 45L39 44 41 77 9 85 3 72 14 69Q9 36 30 9Z"/><path d="M76 7 87 19 78 17Q68 31 69 43L85 42 87 75 56 82 49 69 60 66Q55 33 76 7Z"/><path d="M3 72 32 65 41 77 9 85Z"/><path d="M49 69 78 62 87 75 56 82Z"/></g><g fill="#f0c5d5"><path d="m32 65 9 12-4-25Z"/><path d="m78 62 9 13-4-25Z"/><path d="m30 9 11 12-9-2Z"/><path d="m76 7 11 12-9-2Z"/></g></svg>';
 document.querySelector('[data-favourite=music]')?.addEventListener('click',()=>{
  const body=document.querySelector('#favourite-content .favourite-body>div:last-child');if(!body)return;
  const p=body.querySelector('p');if(!p)return;
  const quote=document.createElement('blockquote');quote.className='music-quote';quote.innerHTML=mark+'<span class="bi"><span lang="zh-CN">人类不能没有音乐和电影</span><span lang="en">We can’t live without music and films.</span></span>'+mark.replace('class="folded-quote"','class="folded-quote closing"');p.replaceWith(quote);
 });
})();
