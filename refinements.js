(()=>{'use strict';
const guideSelectors=['.make-item>small','.photo-controls button','.panel-close','.dialog-close','.scroll-cue','.perspective-switch','.research-guide','.book-follow-hint','.open-book-hint','.tray-instruction','.window-controls p','.camera-trigger','.contact-back','.back-link','.stamp-shelf-caption p','.stamp-shelf-caption small','.stamp-shelf-caption .handwriting','#copy-email','.send-letter','.motion-switch','.still-toggle','.page-controls button'];
const motionSeen=new WeakSet();
const motionObserver=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>target.classList.toggle('guide-in-view',isIntersecting)),{threshold:0});
function motion(){
 document.querySelectorAll('.preview-guide').forEach(e=>{
  if(e.matches('input,textarea,label,#selected-topic,.delivery-note')||e.closest('label'))return;
  if(e.parentElement.closest('.preview-guide'))return;
  // Keep each complete phrase together and preserve links, language spans and original transforms.
  if(!/[A-Za-z]/.test(e.textContent)||motionSeen.has(e))return;
  motionSeen.add(e);e.classList.add('preview-guide-motion');motionObserver.observe(e);
 });
}
function mark(){document.querySelectorAll(guideSelectors.join(',')).forEach(e=>e.classList.add('preview-guide'));document.querySelectorAll('.text-link').forEach(e=>{if(/看看|进入|打开|继续读|返回|翻开|下载|Explore|Open |Read on|Back |Download/.test(e.textContent))e.classList.add('preview-guide')});motion();}
document.querySelectorAll('.header-hello').forEach(e=>e.setAttribute('aria-label','写信 / Contact me'));
mark();new MutationObserver(mark).observe(document.body,{childList:true,subtree:true});
const bookHint=document.querySelector('.preview-book-hint');bookHint?.addEventListener('click',()=>document.querySelector('.notes-front').click());
function bookPositions(){for(const [sceneSel,coverSel,hintSel] of [['.photo-book-stage','.volume-front','.book-follow-hint'],['.notes-book-scene','.notes-volume','.preview-book-hint']]){const scene=document.querySelector(sceneSel),cover=document.querySelector(coverSel),hint=document.querySelector(hintSel);if(!scene||!cover||!hint)continue;const r=scene.getBoundingClientRect(),c=cover.getBoundingClientRect();hint.style.top=(c.bottom-r.top+26)+'px';hint.style.left=(c.left+c.width/2-r.left)+'px';}}
let frame;function update(){cancelAnimationFrame(frame);let end=performance.now()+1100;function tick(){bookPositions();if(performance.now()<end)frame=requestAnimationFrame(tick)}frame=requestAnimationFrame(tick)}
document.querySelectorAll('.photo-book-stage,.notes-book-scene').forEach(e=>{e.addEventListener('pointermove',update);e.addEventListener('pointerleave',update);e.addEventListener('click',update)});addEventListener('resize',update);document.fonts.ready.then(update);addEventListener('load',update);
})();
