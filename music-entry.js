(()=>{'use strict';
try{if(window.parent!==window&&window.parent.document.documentElement.dataset.musicShell==='true')return;}catch{}
const button=document.createElement('button');button.type='button';button.className='site-music-entry';button.innerHTML='<span aria-hidden="true">🎵</span> 听音乐 <small>Music</small>';button.setAttribute('aria-label','开启浏览时的 Apple Music 播放器 / Listen while browsing');
button.addEventListener('click',()=>{const view=location.pathname.split('/').pop()+location.search+location.hash,url=new URL('music.html',location.href);url.searchParams.set('view',view);url.searchParams.set('scroll',String(Math.round(scrollY)));location.assign(url.href);});document.body.append(button);
})();
