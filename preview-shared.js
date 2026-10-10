(()=>{'use strict';
const header=document.querySelector('.v5-header');
header?.querySelectorAll('.window-trigger').forEach(e=>e.textContent='');
// Exactly the same original envelope illustration in every header.
const envelope='<svg class="hello-envelope" viewBox="0 0 112 88" aria-hidden="true"><g fill="none" stroke="#315748" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"><path d="M8 17L102 23L98 79L5 71Z" fill="#faf3df"/><path d="M9 18L52 52L101 24M6 70L36 43M97 78L68 45"/><path d="M16 20L52 43L92 26" opacity=".3"/><path d="M16 69Q25 63 34 69T52 69T70 69T88 69 M17 74Q26 68 35 74T53 74T89 74" stroke="#4c8995"/><circle cx="77" cy="37" r="13" stroke="#a4774d"/><path d="M70 37L75 42L84 32" stroke="#a4774d"/></g></svg>';
header?.querySelectorAll('.header-hello .hello-envelope,.header-hello>span[aria-hidden]').forEach(e=>e.remove());header?.querySelector('.header-hello')?.insertAdjacentHTML('beforeend',envelope);
function labelSize(){const sample=document.querySelector('.question-intro>div>p');if(sample)document.documentElement.style.setProperty('--chapter-label-size',getComputedStyle(sample).fontSize);}
addEventListener('resize',labelSize);document.fonts.ready.then(labelSize);labelSize();
// Deform the actual transparent PNG. Its alpha edge remains the paper silhouette;
// no invented triangular overlay or rectangular patch is added.
const image=document.querySelector('.communication-link .research-art-target>img');
if(!image)return;
const wrapper=document.createElement('span');wrapper.className='v5-note-mesh';image.before(wrapper);wrapper.append(image);image.classList.remove('v4-motion-art');
const canvas=document.createElement('canvas');canvas.setAttribute('aria-hidden','true');wrapper.append(canvas);const ctx=canvas.getContext('2d');
const reduced=()=>matchMedia('(prefers-reduced-motion:reduce)').matches;
let curl=0,target=0,raf=0;
function triangle(a,b,c,ua,ub,uc){
 ctx.save();ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.lineTo(c[0],c[1]);ctx.closePath();ctx.clip();
 const den=ua[0]*(ub[1]-uc[1])+ub[0]*(uc[1]-ua[1])+uc[0]*(ua[1]-ub[1]);
 const coeff=v=>[(v[0]*(ub[1]-uc[1])+v[1]*(uc[1]-ua[1])+v[2]*(ua[1]-ub[1]))/den,(v[0]*(uc[0]-ub[0])+v[1]*(ua[0]-uc[0])+v[2]*(ub[0]-ua[0]))/den,(v[0]*(ub[0]*uc[1]-uc[0]*ub[1])+v[1]*(uc[0]*ua[1]-ua[0]*uc[1])+v[2]*(ua[0]*ub[1]-ub[0]*ua[1]))/den];
 const x=coeff([a[0],b[0],c[0]]),y=coeff([a[1],b[1],c[1]]);ctx.transform(x[0],y[0],x[1],y[1],x[2],y[2]);ctx.drawImage(image,0,0);ctx.restore();
}
function draw(){if(!image.complete||!image.naturalWidth)return;const size=384;canvas.width=size;canvas.height=size;ctx.clearRect(0,0,size,size);const pad=22,w=size-pad*2,n=14;
 const point=(x,y)=>{const d=Math.max(0,(x-.52)*.85+(y-.50)*.7),theta=d*curl*2.1,z=(1-Math.cos(theta))*w*.2;return[pad+x*w-z*.75,pad+y*w-z*.95];};
 for(let y=0;y<n;y++)for(let x=0;x<n;x++){const uv=[[x/n,y/n],[(x+1)/n,y/n],[(x+1)/n,(y+1)/n],[x/n,(y+1)/n]],xy=uv.map(([x,y])=>point(x,y)),src=uv.map(([x,y])=>[x*image.naturalWidth,y*image.naturalHeight]);triangle(xy[0],xy[1],xy[2],src[0],src[1],src[2]);triangle(xy[0],xy[2],xy[3],src[0],src[2],src[3]);}
 if(curl>.01){ctx.globalCompositeOperation='source-atop';const g=ctx.createLinearGradient(210,220,355,355);g.addColorStop(0,'rgba(255,255,244,0)');g.addColorStop(.55,`rgba(245,250,220,${curl*.17})`);g.addColorStop(1,`rgba(45,78,52,${curl*.23})`);ctx.fillStyle=g;ctx.fillRect(0,0,size,size);ctx.globalCompositeOperation='source-over';}
}
function tick(){curl+=(target-curl)*.13;draw();if(Math.abs(curl-target)>.002)raf=requestAnimationFrame(tick);else{curl=target;draw();raf=0;}}
function aim(n){target=reduced()?0:n;if(!raf)raf=requestAnimationFrame(tick)}
const link=wrapper.closest('a');link.addEventListener('pointerenter',()=>aim(.95));link.addEventListener('pointerleave',()=>aim(0));link.addEventListener('focus',()=>aim(.95));link.addEventListener('blur',()=>aim(0));image.addEventListener('load',draw);draw();
})();
