(()=>{'use strict';
const reduced=()=>matchMedia('(prefers-reduced-motion:reduce)').matches||document.documentElement.classList.contains('static-mode');
// Keep T's centered .6 s reveal; delay entry to the user's reference framing.
const lineObserver=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{if(isIntersecting){target.classList.add('is-inview');lineObserver.unobserve(target)}}),{rootMargin:'0px 0px -42% 0px'});
document.querySelectorAll('.research-links article,.shipping-entry').forEach(el=>{const line=document.createElement('span');line.className='t-section-line';line.setAttribute('aria-hidden','true');line.style.setProperty('--line-color',getComputedStyle(el).borderTopColor);el.classList.add('t-line-host');el.prepend(line);if(reduced())line.classList.add('is-inview');else lineObserver.observe(line)});
document.querySelector('[data-favourite=music]')?.addEventListener('click',()=>{const title=document.querySelector('#favourite-title'),link=document.querySelector('#favourite-content a[href*="music.apple.com"]');if(!title||!link)return;const row=document.createElement('div');row.className='music-title-row';title.before(row);row.append(title,link);const icon=document.createElement('span');icon.className='music-note-symbol';icon.textContent='🎵';icon.setAttribute('aria-hidden','true');link.prepend(icon);});
const label=document.querySelector('.stamp-shelf-caption .handwriting');
if(label){
 label.textContent=label.textContent.replace(/\s*[↗↖→←]$/,'');
 const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg'),path=document.createElementNS(ns,'path');svg.classList.add('stamp-guide-arrow');svg.setAttribute('aria-hidden','true');svg.append(path);label.prepend(svg);
 const mobile=matchMedia('(max-width:700px)');
 function draw(){svg.setAttribute('viewBox',mobile.matches?'0 0 40 40':'0 0 100 55');path.setAttribute('d',mobile.matches?'M34 32 C10 34 9 22 12 9 M3 19 L12 9 L20 21':'M94 12 C77 32 41 37 8 31 M23 20 Q16 27 8 31 L25 40');}
 mobile.addEventListener('change',draw);draw();
}
// T's Books hover label uses .35 s power3.out, scale 0 -> 1 and blur 10 -> 0.
// Only the background follows that reveal here; the user's label remains visible.
function prepareFavouriteLinks(){document.querySelectorAll('#favourite-content .text-link,.favourite-dialog .dialog-close').forEach(link=>{
 if(link.querySelector('.favourite-hover-oval'))return;
 const oval=document.createElement('span');oval.className='favourite-hover-oval';if(link.matches('.dialog-close'))oval.classList.add('favourite-hover-circle');oval.setAttribute('aria-hidden','true');link.prepend(oval);
 function paint(){const active=link.matches(':hover,:focus-visible');if(window.gsap){gsap.to(oval,{scale:active?1:0,opacity:active?1:0,filter:active?'blur(0px)':'blur(10px)',duration:reduced()?0:.35,ease:'power3.out',overwrite:true});}else{oval.style.transform=active?'scale(1)':'scale(0)';oval.style.opacity=active?'1':'0';oval.style.filter=active?'blur(0px)':'blur(10px)';}}
 link.addEventListener('pointerenter',paint);link.addEventListener('pointerleave',paint);link.addEventListener('focus',paint);link.addEventListener('blur',paint);
});}
const favourites=document.querySelector('#favourite-content');if(favourites){new MutationObserver(prepareFavouriteLinks).observe(favourites,{childList:true,subtree:true});prepareFavouriteLinks();}
})();
