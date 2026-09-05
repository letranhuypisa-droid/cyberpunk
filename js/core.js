'use strict';
/* CORE — tiện ích DOM, loader ảnh, thanh HP/Energy, theme. Nạp đầu tiên. */
/* =====================================================================
   TIỆN ÍCH
   ===================================================================== */
const $ = (s, r=document) => r.querySelector(s);
const el = (tag, cls, html) => { const e=document.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; };
const wait = ms => new Promise(r=>setTimeout(r,ms));
const rand = a => a[Math.floor(Math.random()*a.length)];
const RM = matchMedia('(prefers-reduced-motion: reduce)');
const reduced = () => RM.matches || !!(window.PLAYER && PLAYER.settings && PLAYER.settings.motion);

/* Thử lần lượt các đường dẫn, trả về cái đầu tiên load được (hoặc null) */
const imgCache = new Map();
function loadFirst(list){
  if(!list || !list.length) return Promise.resolve(null);
  const key = list.join('|');
  if(imgCache.has(key)) return imgCache.get(key);
  const p = (async () => {
    for(const src of list){
      const ok = await new Promise(res => { const im = new Image(); im.onload=()=>res(true); im.onerror=()=>res(false); im.src=encodeURI(src); });
      if(ok) return encodeURI(src);
    }
    return null;
  })();
  imgCache.set(key,p); return p;
}
function portraitEl(def, cls=''){
  const p = el('div','portrait '+cls);
  p.style.setProperty('--pos', def.pos||'50% 8%');
  p.innerHTML = `<img alt=""><div class="sil ${def.faction==='rust'?'sil--rust':''}"><span class="sil__lbl">NO ASSET</span></div>`;
  loadFirst(def.portrait).then(src => { if(src){ p.querySelector('img').src=src; p.classList.add('has-img'); } });
  return p;
}
const hpBar = (cls='') => `<div class="bar ${cls}" data-state="ok" style="--v:100%"><div class="bar__track"><i class="bar__ghost"></i><i class="bar__fill"></i><i class="bar__ticks"></i></div></div>`;
function setHpBar(bar, hp, max){
  const pct = Math.max(0, hp/max*100);
  bar.style.setProperty('--v', pct.toFixed(1)+'%');
  bar.dataset.state = pct <= 25 ? 'low' : pct <= 50 ? 'mid' : 'ok';
  return bar.dataset.state;
}
function energyBarEl(max){ const e=el('div','ebar'); for(let i=0;i<max/25;i++) e.appendChild(el('i','seg')); return e; }
function setEnergyBar(ebar, v, max){
  [...ebar.children].forEach((s,i)=> s.classList.toggle('on', v >= (i+1)*25));
  ebar.classList.toggle('is-full', v >= max);
}

/* =====================================================================
   THEME TOGGLE (auto → dark → light)
   ===================================================================== */
{
  const order=['auto','dark','light']; const root=document.documentElement; const btn=$('#themeBtn');
  btn.addEventListener('click',()=>{ const i=(order.indexOf(root.dataset.theme)+1)%order.length; root.dataset.theme=order[i]; btn.textContent='THEME: '+order[i].toUpperCase(); renderSwatches(); });
}
