/* Requested V10 refinements only. Existing object interactions remain in v5-v8. */
(()=>{'use strict';
document.querySelectorAll('.window-trigger').forEach(button=>button.textContent='');
document.querySelectorAll('.header-hello').forEach(link=>{
 const label=link.querySelector('.bi'); if(!label)return;
 link.querySelectorAll(':scope > span[aria-hidden]').forEach(el=>el.remove());
 link.insertAdjacentHTML('beforeend','<svg class="hello-envelope" viewBox="0 0 100 78" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14L91 18L86 69L5 61Z M10 15L46 49L90 19 M6 61L32 39 M86 68L61 41"/></g><path fill="currentColor" d="M47 55C40 46 32 42 35 35C38 28 46 31 48 36C53 28 62 32 60 40C59 46 52 51 47 55Z"/></svg>');
});
if(!document.body.classList.contains('contact-body'))return;
const mail=document.querySelector('.contact-mail');let pending=false;
function paint(){pending=false;const r=mail.getBoundingClientRect(),progress=Math.min(1,Math.max(0,(innerHeight-r.top)/(innerHeight*.9)));const eased=progress*progress*(3-2*progress);const end=[199,223,210];document.body.style.backgroundColor=`rgb(${end.map(v=>Math.round(255+(v-255)*eased)).join(',')})`;}
function queue(){if(!pending){pending=true;requestAnimationFrame(paint)}}
addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue);paint();
})();
