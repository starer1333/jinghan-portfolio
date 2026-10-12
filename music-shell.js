(()=>{'use strict';
const query=new URLSearchParams(location.search),frame=document.querySelector('#browsing-frame'),panel=document.querySelector('#music-panel'),toggle=document.querySelector('#toggle-music'),root=new URL('.',location.href);let first=true,current='index.html';
function safeView(value){try{const url=new URL(value,root),name=url.pathname.slice(root.pathname.length);if(url.origin===root.origin&&url.pathname.startsWith(root.pathname)&&/^[a-z0-9-]+\.html$/.test(name)&&name!=='music.html')return name+url.search+url.hash;}catch{}return'index.html';}
current=safeView(query.get('view')||'index.html');
function setPanel(open){panel.hidden=!open;toggle.setAttribute('aria-expanded',String(open));}
toggle.addEventListener('click',()=>setPanel(panel.hidden));document.querySelector('#minimize-music').addEventListener('click',()=>{setPanel(false);toggle.focus()});
document.querySelector('#exit-music').addEventListener('click',()=>{try{current=safeView(frame.contentWindow.location.href)}catch{}location.replace(new URL(current,root).href)});
frame.addEventListener('load',()=>{try{current=safeView(frame.contentWindow.location.href);document.title=frame.contentDocument.title+' · Music';if(first){first=false;const y=Math.max(0,Math.min(1e7,Number(query.get('scroll'))||0));if(y)frame.contentWindow.scrollTo(0,y);}
const url=new URL(location.href);url.searchParams.set('view',current);url.searchParams.delete('scroll');history.replaceState(null,'',url);}catch{}});
frame.src=new URL(current,root).href;
})();
