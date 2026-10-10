/* A reversible presentation layer. No Store, session, snapshot or GPS writes. */
window.TTDesign = (() => {
  const key = 'turatars_appearance_v1';
  const query = new URLSearchParams(location.search).get('design');
  let saved; try { saved = localStorage.getItem(key); } catch (_) {}
  let mode = ['atlas','classic'].includes(query) ? query : saved === 'atlas' ? 'atlas' : 'classic';
  const icons = {
    home:'M3 10 12 3l9 7v11h-6v-7H9v7H3Z',
    route:'M5 5h6a4 4 0 0 1 0 8H9a4 4 0 0 0 0 8h10M5 2v6M19 18v6',
    calendar:'M4 5h16v16H4ZM8 2v6M16 2v6M4 10h16',
    people:'M8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM2 21v-3a6 6 0 0 1 12 0v3M17 4a4 4 0 0 1 0 8M17 15a5 5 0 0 1 5 5',
    book:'M3 4h7l2 2 2-2h7v16h-7l-2 2-2-2H3ZM12 6v16',
    heart:'M12 21 3 12C-3 4 7-1 12 6c5-7 15-2 9 6Z',
    gear:'M7 6V4h10v2M5 6h14v16H5ZM8 11h8v5H8Z',
    chart:'M4 3v18h17M8 17v-4M13 17V9M18 17V5',
    map:'M3 5l6-2 6 2 6-2v16l-6 2-6-2-6 2ZM9 3v16M15 5v16',
    user:'M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM3 22v-2a9 9 0 0 1 18 0v2',
    plus:'M12 4v16M4 12h16',
    inbox:'M3 3h18v18H3ZM3 14h5l2 3h4l2-3h5',
    settings:'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2',
    mountain:'M2 21 9 5l4 8 3-5 6 13ZM6 12l3 2 2-2',
    compass:'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM16 8l-3 5-5 3 3-5Z',
    cloud:'M6 19a5 5 0 0 1-1-10 7 7 0 0 1 13 0 5 5 0 0 1 0 10Z',
    bell:'M5 17h14l-2-4V8a5 5 0 0 0-10 0v5ZM10 21h4'
  };
  const glyphs = /\p{Extended_Pictographic}(?:\uFE0F|\u200D\p{Extended_Pictographic})*/gu;
  const svg = name => `<svg class="atlas-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${icons[name]||icons.compass}"/></svg>`;
  function iconFor(el) {
    const href=el.closest('a')?.getAttribute('href')||'';
    if(/uj-tura/.test(href))return 'plus';
    const routes={vezerlopult:'home',turaim:'route',naptar:'calendar',naplo:'book',bakancslista:'heart',felszereles:'gear',statisztikak:'chart',beallitasok:'settings',profil:'user',inbox:'inbox',csapat:'people',tarsak:'people',esemenyek:'calendar',terkep:'map',hagymas:'mountain',szatt:'mountain',utvonalak:'route'};
    for(const route in routes)if(href.includes(route))return routes[route];
    const text=el.textContent;
    if(/☁/.test(text))return 'cloud';if(/📖/.test(text))return 'book';if(/🎒/.test(text))return 'gear';if(/👥/.test(text))return 'people';if(/🔔/.test(text))return 'bell';if(/🥾/.test(text))return 'route';
    return 'compass';
  }
  function decorate() {
    if(mode !== 'atlas')return;
    // Known decorative icon slots only. Original text remains available for classic.
    document.querySelectorAll('.ico,.mi,.qi,.st-ic,.em-ico,.home-center-icon,.e2-big,.home-shortcuts a>span').forEach(el=>{
      if(el.dataset.atlasIcon||el.querySelector('img,svg,input'))return;
      el.dataset.atlasIcon='1';
      const original=document.createElement('span');original.className='classic-icon';
      while(el.firstChild)original.append(el.firstChild);
      el.append(original);el.insertAdjacentHTML('beforeend',svg(iconFor(el)));
    });
    document.querySelectorAll('button,.btn,.tabs a,.side-link,.mb-item,.eyebrow,.dash-top .hello,h1,h2,.wsec h3,.wpan b,label,.meta,.chip,.userchip,[data-sync-status],#v129-cloud-status').forEach(el=>{
      // Do not touch typed text, user descriptions, maps, controls or icon-only buttons.
      if(el.matches('button')&&!el.textContent.replace(glyphs,'').trim())return;
      const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
      const nodes=[];let node;while((node=walker.nextNode())){
        if(node.parentElement.closest('input,textarea,select,svg,.classic-icon,.atlas-decoration,[contenteditable],.leaflet-container'))continue;
        if(node.nodeValue.match(glyphs))nodes.push(node);
      }
      nodes.forEach(node=>{
        const frag=document.createDocumentFragment();let last=0;
        for(const match of node.nodeValue.matchAll(glyphs)){
          frag.append(document.createTextNode(node.nodeValue.slice(last,match.index)));
          const span=document.createElement('span');span.className='atlas-decoration';span.setAttribute('aria-hidden','true');span.textContent=match[0];frag.append(span);last=match.index+match[0].length;
        }
        frag.append(document.createTextNode(node.nodeValue.slice(last)));node.replaceWith(frag);
      });
    });
    document.querySelectorAll('.logo').forEach(el=>{
      if(!el.querySelector('.atlas-wordmark'))el.insertAdjacentHTML('beforeend','<span class="atlas-wordmark">túratárs<span>TÚRÁZÓK MUNKATERÜLETE</span></span>');
    });
  }
  function refresh() {
    document.documentElement.dataset.design=mode;
    const tools=document.getElementById('appearance-tools');if(!tools)return;
    tools.classList.toggle('appearance-atlas',mode==='atlas');
    tools.querySelector('[data-appearance-label]').textContent=mode==='atlas'?'Atlas megjelenés':'Megjelenés';
    const home=tools.querySelector('[data-appearance-home]');home.hidden=mode!=='atlas';
    decorate();
  }
  function choose(next) {
    if(!['atlas','classic'].includes(next))return;
    mode=next;try{localStorage.setItem(key,mode);}catch(_){}
    const url=new URL(location.href);url.searchParams.set('design',mode);
    history.replaceState(history.state,'',url);closeModal();refresh();
  }
  function chooser() {
    openModal({title:'Válassz megjelenést',body:`<p class="muted mt0">Ugyanazok a túrák és funkciók, két külön megjelenés. Bármikor visszaválthatsz.</p><div class="appearance-options"><button class="appearance-option" data-appearance="atlas" aria-pressed="${mode==='atlas'}"><span class="appearance-swatch atlas-swatch" aria-hidden="true"></span><b>Atlas</b><span>Letisztult felület, vonalas ikonok, rendezett munkaterület.</span></button><button class="appearance-option" data-appearance="classic" aria-pressed="${mode==='classic'}"><span class="appearance-swatch classic-swatch" aria-hidden="true"></span><b>Eredeti</b><span>A megszokott Túratárs megjelenés.</span></button></div>`,onOpen:root=>root.querySelectorAll('[data-appearance]').forEach(b=>b.onclick=()=>choose(b.dataset.appearance))});
  }
  document.documentElement.dataset.design=mode;
  function boot(){
    if(document.getElementById('appearance-tools'))return;
    const tools=document.createElement('div');tools.id='appearance-tools';
    tools.innerHTML='<a data-appearance-home href="#/" hidden>Túratárs <span>/ Atlas</span></a><div class="appearance-toolbar-actions"><a class="atlas-account-link" href="#/vezerlopult">Saját túraközpont</a><button type="button" class="atlas-menu-button" data-appearance-menu aria-label="Oldalak megnyitása">Menü</button><button type="button" data-appearance-toggle aria-label="Megjelenés kiválasztása"><span data-appearance-label>Megjelenés</span> <span aria-hidden="true">⌄</span></button></div>';
    tools.querySelector('[data-appearance-menu]').onclick=()=>openModal({title:'Saját túraközpont',body:'<nav class="atlas-route-menu" aria-label="Túraközpont oldalai">'+SIDE.map(([href,icon,label])=>'<a href="'+esc(href)+'" data-close>'+esc(label)+'</a>').join('')+'</nav>'});
    document.body.prepend(tools);tools.querySelector('[data-appearance-toggle]').onclick=chooser;refresh();
    let pending=false;
    new MutationObserver(()=>{if(mode!=='atlas'||pending)return;pending=true;requestAnimationFrame(()=>{pending=false;decorate();});}).observe(document.body,{childList:true,subtree:true,characterData:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
  return {refresh,choose,current:()=>mode};
})();
