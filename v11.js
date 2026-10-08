/* V11 builds on the existing interactions; it does not replace navigation or form handlers. */
(()=>{'use strict';
const $=s=>document.querySelector(s),params=new URLSearchParams(location.search),still=()=>matchMedia('(prefers-reduced-motion:reduce)').matches||document.documentElement.classList.contains('static-mode');
const art=params.get('art')==='sun'?'sun':'blue';document.documentElement.dataset.mailArt=art;
const envelope=['wave','flora','boat'].includes(params.get('envelope'))?params.get('envelope'):'wave';
const motif={wave:'<path d="M16 69Q25 63 34 69T52 69T70 69T88 69 M17 74Q26 68 35 74T53 74T71 74T89 74" stroke="#4c8995"/><circle cx="77" cy="37" r="13" stroke="#a4774d"/><path d="M70 37L75 42L84 32" stroke="#a4774d"/>',flora:'<circle cx="53" cy="48" r="12" fill="#bd7a72" stroke="#a66e62"/><path d="M50 53Q57 42 52 39M52 47Q45 42 48 39M52 44Q60 43 60 38" stroke="#fff5df"/><path d="M21 72Q27 62 23 52M24 64Q16 59 17 54M25 59Q34 55 32 51" stroke="#829775"/>',boat:'<path d="M12 68Q23 61 34 68T56 68T78 68T100 68" stroke="#51849a"/><path d="M39 43L63 28L72 54L55 66L32 54Z" fill="#e5c384" stroke="#937b4c"/><path d="M39 43L55 55L63 28M32 54L72 54" stroke="#937b4c"/>'};
function svg(which){return '<svg class="hello-envelope" viewBox="0 0 112 88" aria-hidden="true"><g stroke="#315748" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"><path d="M8 17L102 23L98 79L5 71Z" fill="#faf3df"/><path d="M9 18L52 52L101 24M6 70L36 43M97 78L68 45" fill="none"/><path d="M16 20L52 43L92 26" fill="none" opacity=".3"/>'+motif[which]+'</g></svg>'}
document.querySelectorAll('.header-hello .hello-envelope').forEach(el=>el.outerHTML=svg(envelope));
document.querySelectorAll('[data-envelope-sample]').forEach(el=>el.innerHTML=svg(el.dataset.envelopeSample));
document.querySelectorAll('.hello-envelope>g').forEach(el=>el.setAttribute('fill','none'));
document.querySelectorAll('a[href]').forEach(a=>{const raw=a.getAttribute('href');if(!/^(contact|index)\.html/.test(raw))return;const url=new URL(raw,location.href);url.searchParams.set('v','11');if(!url.searchParams.has('art'))url.searchParams.set('art',art);if(!url.searchParams.has('envelope'))url.searchParams.set('envelope',envelope);a.href=url.pathname.split('/').pop()+url.search+url.hash});
const moon=$('[data-make=script]');let spin;
moon?.addEventListener('click',()=>{spin?.cancel();if(!still())spin=moon.querySelector('.make-art>img').animate([{rotate:'0deg'},{rotate:'360deg'}],{duration:1700,easing:'cubic-bezier(.2,.7,.3,1)'})});
const notebook=$('.floral-writing-art'),editing=$('[data-make=editing]');let writingFrame=0;
if(notebook&&editing){
 const pen=$('.writing-pen'),stroke=notebook.querySelector('.ink-stroke path'),svgEl=stroke.ownerSVGElement,len=stroke.getTotalLength();stroke.style.strokeDasharray=len;stroke.style.strokeDashoffset=len;
 const rest=()=>{cancelAnimationFrame(writingFrame);pen.style.left='65%';pen.style.top='58%';pen.style.transform='translate(-50%,-95.3%) rotate(31deg)';stroke.style.strokeDashoffset=len};
 function tipAt(t){const pt=stroke.getPointAtLength(t*len);return{x:pt.x/2,y:pt.y/2}}
 function write(){cancelAnimationFrame(writingFrame);if(editing.getAttribute('aria-expanded')!=='true'){rest();return}const begin=performance.now(),start=tipAt(0);const frame=now=>{if(editing.getAttribute('aria-expanded')!=='true'){rest();return}const t=still()?1:Math.min(1,(now-begin)/2600),travel=Math.min(1,t/.26),smooth=travel*travel*(3-2*travel),progress=Math.max(0,(t-.26)/.74),p=travel<1?{x:65+(start.x-65)*smooth,y:58+(start.y-58)*smooth}:tipAt(progress);pen.style.left=p.x+'%';pen.style.top=p.y+'%';pen.style.transform='translate(-50%,-95.3%) rotate('+(31+Math.sin(progress*28)*2)+'deg)';stroke.style.strokeDashoffset=len*(1-progress);if(t<1)writingFrame=requestAnimationFrame(frame)};writingFrame=requestAnimationFrame(frame)}
 editing.addEventListener('click',write);document.querySelectorAll('.make-item:not([data-make=editing])').forEach(b=>b.addEventListener('click',rest));addEventListener('v6-motion-change',rest);addEventListener('resize',()=>{if(editing.getAttribute('aria-expanded')==='true')write()});
}
const passport=$('.passport-book');if(passport){passport.tabIndex=0;passport.setAttribute('aria-label','个人档案，悬停或聚焦可放大 / Personal archive, focus to enlarge')}
})();
