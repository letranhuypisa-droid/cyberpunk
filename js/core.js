'use strict';
/* CORE — tiện ích DOM, loader ảnh, thanh HP/Energy, thẻ nhân vật, theme. Nạp đầu tiên. */
/* =====================================================================
   TIỆN ÍCH
   ===================================================================== */
const $ = (s, r=document) => r.querySelector(s);
const el = (tag, cls, html) => { const e=document.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; };
const wait = ms => new Promise(r=>setTimeout(r,ms));
const rand = a => a[Math.floor(Math.random()*a.length)];
const RM = matchMedia('(prefers-reduced-motion: reduce)');
const setting = (k, dflt) => { const s = typeof PLAYER!=='undefined' && PLAYER.settings; return s && k in s ? s[k] : dflt; };
const reduced = () => RM.matches || !!setting('motion', false);
/* Animation sprite nhân vật (sheet nhiều frame). Tắt → dùng ảnh tĩnh. Giảm chuyển động cũng tắt luôn:
   một vòng lặp chạy liên tục đúng là thứ prefers-reduced-motion muốn dừng. */
const animOn     = () => setting('anim', true) && !reduced();
const ultVideoOn = () => setting('ultVideo', true);
const revealVideoOn = () => setting('revealVideo', true);   // video mở rương ở gacha (khác video chiêu cuối trong trận)

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
/* Video: HEAD lần lượt, trả về đường dẫn đầu tiên tồn tại (hoặc null) */
const videoCache = new Map();
function resolveVideo(list){
  if(!list||!list.length) return Promise.resolve(null);
  const key=list.join('|'); if(videoCache.has(key)) return videoCache.get(key);
  const p=(async()=>{ for(const src of list){ try{ const r=await fetch(encodeURI(src),{method:'HEAD'}); if(r.ok) return encodeURI(src); }catch(e){} } return null; })();
  videoCache.set(key,p); return p;
}
/* Nạp sẵn byte của một video. resolveVideo chỉ gửi HEAD nên KHÔNG tải gì — thứ tốn thời gian là lúc <video>
   bắt đầu buffer. Gọi hàm này ngay khi biết trước sẽ cần, rồi lấy quãng animation ở giữa làm thời gian nạp.
   Giữ lại thẻ <video> trong map để trình duyệt không thu hồi phần đã buffer. */
const videoWarm = new Map();
function warmVideo(list){
  resolveVideo(list).then(src=>{
    if(!src || videoWarm.has(src)) return;
    const v=document.createElement('video'); v.preload='auto'; v.muted=true; v.playsInline=true;
    videoWarm.set(src, v); v.src=src; v.load();
  });
}
/* Phát video trong một hộp .cutin (có <video>, .cutin__who, .cutin__name, .cutin__skip): chiêu cuối trong trận, mở rương ở gacha.
   Xong khi video hết / lỗi / bấm SKIP / quá 8s (không bao giờ treo). Tắt tiếng theo PLAYER.settings.sound.
   opts.silent = không kêu tiếng mở hộp (chiêu cuối trong trận dùng cờ này: video đã có tiếng sẵn, 11/09). */
async function playVideoBox(box, src, who, name, accent, opts={}){
  const v=box.querySelector('video');
  box.querySelector('.cutin__who').textContent=who; box.querySelector('.cutin__name').textContent=name;
  box.style.setProperty('--accent', accent||'var(--chrome)');
  v.src=src; v.currentTime=0; v.muted=!(PLAYER.settings&&PLAYER.settings.sound); box.hidden=false; if(!opts.silent) sfx('open',.22);
  await new Promise(async res=>{
    let done=false; const end=()=>{ if(!done){ done=true; box._end=null; res(); } };
    box._end=end; v.onended=end; v.onerror=end; box.querySelector('.cutin__skip').onclick=end;
    const guard=setTimeout(end, 8000);
    try{ await v.play(); }catch(e){ v.muted=true; try{ await v.play(); }catch(e2){ end(); } }
    v.addEventListener('ended',()=>clearTimeout(guard),{once:true});
  });
  v.pause(); box.hidden=true; v.removeAttribute('src'); v.load();
}
function stopVideoBox(box){ if(!box) return; if(box._end) box._end(); if(!box.hidden){ box.querySelector('video').pause(); box.hidden=true; } }
/* URL tuyệt đối cho url() đặt trong biến CSS inline (Chrome tính url() tương đối theo file .css chứa var(), không theo trang) */
const absUrl = src => new URL(src, location.href).href;
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
   THẺ NHÂN VẬT — dùng ở squad, gacha (app.js) và kit.html (kit.js)
   ===================================================================== */
function cardEl(def, state){
  const c=el('article', `card card--${def.faction} card--${def.tier.toLowerCase()} ${state==='selected'?'is-selected':state==='locked'?'is-locked':''}`);
  c.dataset.id=def.id; c.draggable = state!=='locked';
  /* Chỉ số cuối (đã tính cấp nâng cấp, linh kiện, cyberware) — cùng con số người chơi thấy trong trận.
     kit.html không nạp state.js nên thiếu unitStats thì rơi về chỉ số gốc của def. */
  const st = typeof unitStats==='function' ? unitStats(def.id) : def;
  const up = st.atk>def.atk;                                      // có nâng cấp → tô sáng cụm chỉ số
  const body=el('div','card__body');
  body.appendChild(Object.assign(portraitEl(def,'card__portrait'),{}));
  body.insertAdjacentHTML('beforeend', `<div class="card__tier">${def.tier}</div><div class="card__fac">${def.faction}</div>
    <div class="card__info"><div class="card__name">${def.name}</div>
    <div class="card__stats${up?' is-up':''}"><span><b>ATK</b><em>${st.atk}</em></span><span><b>HP</b><em>${st.hp}</em></span><span><b>SPD</b><em>${st.spd||0}</em></span><span><b>CRIT</b><em>${st.crit||0}%</em></span></div></div>
    <div class="card__state">${state==='selected'?'SELECTED':state==='locked'?'LOCKED':''}</div>`);
  c.appendChild(body);
  c.addEventListener('dragstart', ev=>{ ev.dataTransfer.setData('text/plain',def.id); c.classList.add('is-dragging'); const tm=$('#team'); if(tm) tm.querySelectorAll('.tslot.is-over').forEach(s=>s.classList.remove('is-over')); });
  c.addEventListener('dragend', ()=>c.classList.remove('is-dragging'));
  return c;
}

/* =====================================================================
   THEME TOGGLE (auto → dark → light) — nút chỉ có ở kit.html
   ===================================================================== */
{
  const order=['auto','dark','light']; const root=document.documentElement; const btn=$('#themeBtn');
  if(btn) btn.addEventListener('click',()=>{ const i=(order.indexOf(root.dataset.theme)+1)%order.length; root.dataset.theme=order[i]; btn.textContent='THEME: '+order[i].toUpperCase(); if(typeof renderSwatches==='function') renderSwatches(); });
}
