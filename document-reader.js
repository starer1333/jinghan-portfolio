(()=>{'use strict';
const $=s=>document.querySelector(s),params=new URLSearchParams(location.search),id=params.get('id');let entry,page=0,zoom=1,figures=[],frame=0;
const viewport=$('#document-viewport'),select=$('#page-select'),status=$('#reader-status');
function updatePage(index){page=Math.max(0,Math.min(entry.pages.length-1,index));select.value=String(page);$('#previous').disabled=page===0;$('#next').disabled=page===entry.pages.length-1;const url=new URL(location.href);url.searchParams.set('page',String(page+1));history.replaceState(null,'',url);}
function go(index){if(!entry)return;updatePage(index);figures[page].scrollIntoView({block:'start',behavior:'instant'});}
function paintZoom(){viewport.style.setProperty('--page-zoom',zoom);$('#zoom-status').textContent=Math.round(zoom*100)+'%';$('#zoom-out').disabled=zoom<=.75;$('#zoom-in').disabled=zoom>=2;}
function track(){frame=0;if(!entry)return;const guide=$('.document-toolbar').getBoundingClientRect().bottom+innerHeight*.18;let current=0;for(let i=0;i<figures.length;i++){if(figures[i].getBoundingClientRect().top<=guide)current=i;else break;}if(current!==page)updatePage(current);}
addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(track)},{passive:true});
$('#previous').addEventListener('click',()=>go(page-1));$('#next').addEventListener('click',()=>go(page+1));select.addEventListener('change',()=>go(+select.value));
$('#zoom-out').addEventListener('click',()=>{zoom=Math.max(.75,zoom-.25);paintZoom();go(page)});$('#zoom-in').addEventListener('click',()=>{zoom=Math.min(2,zoom+.25);paintZoom();go(page)});$('#fit-page').addEventListener('click',()=>{zoom=1;paintZoom();go(page)});
document.addEventListener('keydown',e=>{if(e.target.matches('input,textarea,select,button')||e.ctrlKey||e.altKey||e.metaKey)return;if(e.key==='ArrowRight'){e.preventDefault();go(page+1)}if(e.key==='ArrowLeft'){e.preventDefault();go(page-1)}});
fetch('reading-manifest.json').then(r=>{if(!r.ok)throw Error('manifest');return r.json()}).then(data=>{
 entry=data[id];if(!entry)throw Error('document');$('#document-title').textContent=entry.title;document.title=entry.title+' · Jinghan Wang';$('#reader-back').href=entry.back;viewport.replaceChildren();
 entry.pages.forEach((p,i)=>{const option=document.createElement('option');option.value=String(i);option.textContent=String(i+1);select.append(option);
  const figure=document.createElement('figure');figure.className='document-page';figure.dataset.page=i+1;figure.id='page-'+(i+1);
  const image=document.createElement('img');image.className='page-image';image.width=p.width;image.height=p.height;image.alt=`${entry.title} · 第 ${i+1} 页 / Page ${i+1}`;image.draggable=false;image.loading=i<2?'eager':'lazy';image.decoding='async';image.src=p.image;
  image.addEventListener('error',()=>{status.textContent=`第 ${i+1} 页未能加载，请刷新重试。 / Please refresh to retry.`});
  const caption=document.createElement('figcaption');caption.textContent=`${i+1} / ${entry.pages.length}`;
  const text=document.createElement('div');text.className='reader-sr-only';text.textContent=p.text;figure.append(image,caption,text);viewport.append(figure);figures.push(figure);
 });$('#total-pages').textContent='/ '+entry.pages.length;status.textContent='';paintZoom();updatePage(Math.max(0,(parseInt(params.get('page'),10)||1)-1));if(page>0)requestAnimationFrame(()=>go(page));
}).catch(()=>{$('#document-title').textContent='暂时无法打开这份原文';status.textContent='请返回项目页面重新选择。 / Please return to the project and try again.';$('.document-toolbar').hidden=true;viewport.hidden=true;});
})();
