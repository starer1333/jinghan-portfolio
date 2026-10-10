/* Independent local preview: no remote requests, tracking or publishing. */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduced=()=>matchMedia('(prefers-reduced-motion:reduce)').matches||document.documentElement.classList.contains('static-mode');
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
const svg=(body,cls='')=>`<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${body}</svg>`;
const contacts=[
 {key:'email',name:'邮箱 / Email',value:'wangjh2923@mails.jlu.edu.cn',href:'mailto:wangjh2923@mails.jlu.edu.cn',action:'写邮件 / Write an email',icon:svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>')},
 {key:'wechat',name:'微信 / WeChat',value:'w15604697857',icon:svg('<path fill="currentColor" stroke="none" d="M9 3C4.6 3 1 5.9 1 9.5c0 2.1 1.2 4 3.2 5.2l-.8 2.8 3.2-1.7 1.9.2c-.4-.8-.6-1.7-.6-2.6 0-3.8 3.7-6.8 8.2-6.8h.9C15.9 4.5 12.7 3 9 3Z"/><path fill="currentColor" stroke="none" d="M23 13.5c0-3.2-3-5.7-6.7-5.7s-6.7 2.5-6.7 5.7 3 5.7 6.7 5.7l1.8-.2 2.7 1.5-.6-2.5c1.7-1 2.8-2.6 2.8-4.5Z"/><g fill="#fffdf9" stroke="none"><circle cx="6" cy="8" r="1"/><circle cx="11.5" cy="8" r="1"/><circle cx="13.8" cy="12.5" r=".9"/><circle cx="18.7" cy="12.5" r=".9"/></g>')},
 {key:'qq',name:'QQ',value:'355325491',icon:svg('<path fill="currentColor" stroke="none" d="M6.3 9.7C5.8 1.5 18.2 1.5 17.7 9.7c1.8 2.6 3.9 7.2 2.3 7.7-.7.3-1.5-1.1-2.1-1.8-.6 3.3-2.7 5.1-5.9 5.1s-5.3-1.8-5.9-5.1c-.6.7-1.4 2.1-2.1 1.8-1.6-.5.5-5.1 2.3-7.7Z"/><ellipse fill="#fffdf9" stroke="none" cx="12" cy="14.8" rx="4.3" ry="4.8"/><g fill="#fffdf9" stroke="none"><ellipse cx="10" cy="6.6" rx="1.1" ry="1.6"/><ellipse cx="14" cy="6.6" rx="1.1" ry="1.6"/></g><g fill="currentColor" stroke="none"><circle cx="10.1" cy="7" r=".5"/><circle cx="13.9" cy="7" r=".5"/></g><path d="M9 9.2q3-1.3 6 0-3 1.7-6 0Z" fill="#fffdf9" stroke="none"/><path d="M6.9 10.8q5 2.2 10.2 0" stroke="#fffdf9" stroke-width="1.3"/><path d="M7.8 20.3 5 21h5m4 0h5l-2.8-.7"/>')},
 {key:'phone',name:'电话 / Phone',value:'15604697857',href:'tel:15604697857',action:'拨打电话 / Call',icon:svg('<path d="m7 3 3 5-2 2c1 3 3 5 6 6l2-2 5 3c-1 6-7 4-11 1S2 10 3 6q1-3 4-3Z"/>')}
];
const panel=document.createElement('dialog');panel.className='quick-contact';panel.id='quick-contact';panel.setAttribute('aria-labelledby','contact-title');document.body.append(panel);
let opener=null;
function close(){panel.close();opener?.setAttribute('aria-expanded','false');opener?.focus({preventScroll:true});}
function position(){if(!opener)return;const r=opener.getBoundingClientRect(),w=panel.offsetWidth,h=panel.offsetHeight;panel.style.left=Math.max(16,Math.min(innerWidth-w-16,r.right-w))+'px';panel.style.top=Math.max(16,Math.min(innerHeight-h-16,r.top-h-16))+'px';}
function open(item,button){
 opener=button;button.setAttribute('aria-expanded','true');
 panel.innerHTML=`<button class="contact-close" aria-label="关闭 / Close">×</button><h2 id="contact-title">${item.name}</h2><span class="contact-value">${item.value}</span>${item.href?`<a class="contact-action" href="${item.href}">${item.action}</a>`:'<button class="contact-action contact-copy">复制账号 / Copy</button>'}<div class="contact-status" role="status"></div>`;
 $('.contact-close',panel).addEventListener('click',close);
 $('.contact-copy',panel)?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(item.value);$('.contact-status',panel).textContent='已复制 / Copied';}catch{const selection=getSelection(),range=document.createRange();range.selectNodeContents($('.contact-value',panel));selection.removeAllRanges();selection.addRange(range);$('.contact-status',panel).textContent='已选中，请复制 / Selected — copy this text';}});
 panel.showModal();position();$('.contact-close',panel).focus({preventScroll:true});
}
panel.addEventListener('cancel',e=>{e.preventDefault();close()});panel.addEventListener('click',e=>{const r=panel.getBoundingClientRect();if(e.target===panel&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))close()});addEventListener('resize',position);
function group(cls){const g=document.createElement('div');g.className='contact-circles '+cls;g.setAttribute('role','group');g.setAttribute('aria-label','联系方式 / Contact');contacts.forEach(item=>{const b=document.createElement('button');b.type='button';b.className='contact-circle';b.dataset.contact=item.key;b.setAttribute('aria-label',item.name);b.setAttribute('aria-haspopup','dialog');b.setAttribute('aria-expanded','false');b.setAttribute('aria-controls',panel.id);b.innerHTML=item.icon.replace('<svg class=""','<svg class="contact-symbol"')+'<svg class="contact-ring" viewBox="0 0 54 54" aria-hidden="true"><circle cx="27" cy="27" r="26" pathLength="1"/></svg>';b.addEventListener('click',()=>open(item,b));g.append(b)});return g}
$('.opening')?.append(group('hero-contacts'));document.querySelectorAll('footer').forEach(f=>f.append(group('footer-contacts')));

// The icon scales into its ring as the hero leaves, reversing as the footer arrives.
let contactFrame=0;
function contactProgress(){contactFrame=0;const hero=$('.hero-contacts');if(hero){const presence=reduced()?(scrollY<innerHeight*.5?1:0):clamp(1-scrollY/(innerHeight*.55));hero.style.setProperty('--presence',presence);hero.inert=presence<.015;hero.style.visibility=presence<.015?'hidden':'visible';}
 document.querySelectorAll('.footer-contacts').forEach(g=>{const r=g.closest('footer').getBoundingClientRect(),presence=reduced()?1:clamp((innerHeight-r.top)/Math.min(95,r.height*.7));g.style.setProperty('--presence',presence);g.inert=presence<.015;});}
function contactSchedule(){if(!contactFrame)contactFrame=requestAnimationFrame(contactProgress)}
addEventListener('scroll',contactSchedule,{passive:true});addEventListener('resize',contactSchedule);contactProgress();
})();
