'use strict';
/* =====================================================================
   CYBERWARE — màn hình. Chọn nhân vật → chọn ô → xem thang 10 bậc → nâng bậc; và tờ phân tách bản dư.
   Số liệu + logic ở js/cyber.js. Đặc tả: docs/cyberware.md §E.
   Nạp sau js/app.js (cần go/renderWallet/portraitEl/rn ở js/riotui.js).

   Ảnh món: art/cyber/<ô><bậc>.png (cắt từ 6 tấm contact sheet bằng scratch/cyber_sheet.py).
   Chưa có file thì vẽ icon SVG của ô — luôn có hình, không bao giờ là ô trống.
   ===================================================================== */

const CB_ICON = {
  head:'<path d="M4.5 14a7.5 7.5 0 0 1 15 0v3.5a1.5 1.5 0 0 1-1.5 1.5h-2.5"/><path d="M4.5 14v4a1.5 1.5 0 0 0 1.5 1.5h2"/><path d="M7 11.5h10"/><circle cx="9.5" cy="15" r="1.2" fill="currentColor" stroke="none"/>',
  body:'<path d="M9 3 5 5.5 3.5 12l2.5.8V21h12v-8.2l2.5-.8L19 5.5 15 3"/><path d="M9 3l3 3.5L15 3"/><path d="M12 6.5V21"/>',
  arm: '<rect x="2" y="4.5" width="3.5" height="5" rx="1"/><path d="M5.5 7h4l3 4"/><circle cx="13.6" cy="11.6" r="2.4"/><path d="M15.4 13.2 19 17.2"/><path d="M19 17.2l2.2-1.4M19 17.2l-1.4 2.2"/>',
  legs:'<path d="M9 3h5l-1 7 3 5-2 6H8l-1-6 3-5Z"/><path d="M9.2 10h5.6M7 21h11"/><circle cx="11.5" cy="6" r="1.3" fill="currentColor" stroke="none"/>',
  ac1: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3"/><circle cx="12" cy="12" r="2.6" fill="currentColor" stroke="none"/>',
  ac2: '<rect x="4" y="7" width="16" height="11" rx="2"/><path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7"/><path d="M4 12h16"/><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/>',
};
const cbIcon = slot => `<svg class="cbic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${CB_ICON[slot]||''}</svg>`;
/* Ô ảnh món: icon SVG trước, thay bằng art/cyber/<ô><bậc>.png ngay khi file có */
function cbPic(slot, step, cls=''){
  const p=el('span','cbpic '+cls);
  p.innerHTML=cbIcon(slot);
  if(step) loadFirst(cyberArt(slot, step)).then(src=>{ if(src){ p.innerHTML=`<img src="${src}" alt="">`; p.classList.add('has-img'); } });
  return p;
}
/* "+9% ATK · +3 CRIT" — cùng thứ tự ở mọi chỗ, để mắt quen */
function cbFxText(fx){
  const n = v => Number.isInteger(v) ? v : v.toFixed(1);
  return [ fx.atkPct&&`+${n(fx.atkPct)}% ATK`, fx.hpPct&&`+${n(fx.hpPct)}% HP`, fx.spd&&`+${n(fx.spd)} SPD`, fx.crit&&`+${n(fx.crit)} CRIT` ]
    .filter(Boolean).join(' · ') || '—';
}
const cbCostText = c => `${rn(c.lk)} LK · ${rn(c.cr)} CR`;
const cbRar = step => CYBER_RARITY[CYBER_STEP_RARITY[step-1]];

const CB = { hero:null, slot:null };

/* =====================================================================
   MÀN CHÍNH
   ===================================================================== */
function renderCyber(){
  const owned = PLAYER.owned.filter(id=>ROSTER[id]);
  if(!CB.hero || !owned.includes(CB.hero)) CB.hero = TEAM.find(id=>id&&owned.includes(id)) || owned[0];
  $('#cbParts').textContent = rn(PLAYER.parts);
  $('#cbCr').textContent    = rn(PLAYER.credits);
  renderCbPick(owned); renderCbBody();
  const t=scrapTotal();
  $('#btnScrap').disabled = !t.n;
  $('#scrapMeta').textContent = t.n ? `${t.n} LÁ TRÙNG · +${rn(t.lk)} LK` : 'CHƯA CÓ LÁ TRÙNG NÀO — QUAY GACHA ĐỂ CÓ';
  if(!$('#cbSlotBox').hidden && CB.slot) renderCbSlot();
}

/* Dải chọn nhân vật: ai đã sở hữu, người trong đội lên trước, huy hiệu = tổng bậc đang có */
function renderCbPick(owned){
  const box=$('#cbPick'); box.innerHTML='';
  const rank = id => (TEAM.includes(id)?2:0) + (cyberProgress(id).now?1:0);
  [...owned].sort((a,b)=> rank(b)-rank(a) || 'SAB'.indexOf(ROSTER[a].tier)-'SAB'.indexOf(ROSTER[b].tier)).forEach(id=>{
    const d=ROSTER[id], p=cyberProgress(id), bare=cyberNoFit(id);
    const b=el('button',`cbp cbp--${d.faction} ${id===CB.hero?'is-on':''}`);
    b.dataset.id=id;
    b.appendChild(portraitEl(d));
    b.insertAdjacentHTML('beforeend',
      `<span class="cbp__n">${d.name}</span>`
      + (p.now ? `<em class="cbp__b${bare?' cbp__b--bare':''}">${p.now}/${p.max}</em>` : bare ? '<em class="cbp__b cbp__b--bare">TRẦN</em>' : '')
      + (TEAM.includes(id)?'<i class="cbp__team"></i>':''));
    b.addEventListener('click',()=>{ CB.hero=id; sfx('cursor',.08); renderCyber(); });
    box.appendChild(b);
  });
  const on=box.querySelector('.cbp.is-on'); if(on) on.scrollIntoView({block:'nearest', inline:'center', behavior:reduced()?'auto':'smooth'});
}

/* Một dòng chỉ số "145 → 168": vế trái là gốc (đã tính cấp), vế phải đã tính cyberware */
function cbStatRow(lbl, a, b, suffix=''){
  const up = b>a;
  return `<div class="cbstat"><span class="lbl">${lbl}</span><b class="mono">${rn(a)}${suffix}</b>`
       + (up ? `<i>▸</i><b class="mono is-up">${rn(b)}${suffix}</b>` : `<i class="is-flat">—</i><b class="mono is-flat">${rn(b)}${suffix}</b>`)
       + `</div>`;
}
function renderCbBody(){
  const id=CB.hero, d=ROSTER[id], body=$('#cbBody');
  if(!d){ body.innerHTML='<p class="cbempty">Chưa sở hữu nhân vật nào.</p>'; return; }
  const base=baseStats(id), fin=unitStats(id), bo=cyberBonus(id), bare=cyberNoFit(id), pr=cyberProgress(id);
  const H=[];
  H.push(`<div class="cbhero cbhero--${d.faction}">
    <div class="cbhero__p" id="cbHeroPic"></div>
    <div class="cbhero__i">
      <b>${d.name}</b><em>TIER ${d.tier} · LV ${lvl(id)} · ${pr.now}/${pr.max} BẬC${bare?' · KHÔNG CẤY GHÉP':''}</em>
      ${cbStatRow('ATK', base.atk, fin.atk)}${cbStatRow('HP', base.hp, fin.hp)}
      ${cbStatRow('SPD', base.spd, fin.spd)}${cbStatRow('CRIT', base.crit, fin.crit, '%')}
    </div>
  </div>`);

  H.push('<div class="cbslots">' + CYBER_SLOTS.map(s=>{
    const step=cyberStep(id, s.id), cap=cyberCap(id, s.id), it=cyberItem(s.id, step), fx=cyberSlotFx(id, s.id);
    const r=step?cbRar(step):null;
    const pips=Array.from({length:CYBER.maxStep},(_,i)=>
      `<i class="${i<step?'on':''}${i>=cap?' off':''}"></i>`).join('');
    return `<button class="cbslot ${step?'is-on '+r.css:''}" data-slot="${s.id}">
      <span class="cbslot__pic" data-pic="${s.id}" data-step="${step}"></span>
      <span class="cbslot__i">
        <span class="cbslot__k">${s.name}</span>
        <b${step?'':' class="is-empty"'}>${it?it.name:'— TRỐNG —'}</b>
        <em>${step?cbFxText(fx):'chạm để lắp bậc 1'}</em>
        <span class="cbpips">${pips}<u>${String(step).padStart(2,'0')}/${cap}</u></span>
      </span>
      <i class="cbslot__go">▸</i>
    </button>`;
  }).join('') + '</div>');

  H.push(`<p class="cbnote">Tổng cyberware đang mang: <b>${cbFxText(bo)}</b>.
    Cấp nâng cấp nhân trước, cyberware nhân sau — hai nguồn nhân nhau, không cộng dồn phần trăm.</p>`);

  if(bare){
    const left=cyberRemaining(id);
    H.push(`<div class="cbbare">
      <h4>THÉP TRẦN</h4>
      <p>${d.name} không có một khớp nối kim loại nào. Anh mặc được đồ, nhưng dừng lại ở món cuối cùng còn là
         <b>thứ khoác lên người</b> — găng tay thì được, tay máy thì không.</p>
      <p>Đổi lại, món đang đứng đúng bậc trần của anh cho <b>×${CYBER.bareBonus}</b> chỉ số: đồ trần trong tay
         anh ăn đứt đồ cấy trong tay người khác.</p>
      <p class="cbbare__fx">Trần từng ô: ${CYBER_SLOTS.map(s=>`${s.name} ${CYBER.bareCap[s.id]}`).join(' · ')}.
        Còn phải bỏ ra <b>${rn(left.lk)} LK + ${rn(left.cr)} CR</b> để đi hết.</p>
    </div>`);
  }
  body.innerHTML=H.join('');
  const pic=$('#cbHeroPic'); if(pic) pic.appendChild(portraitEl(d));
  body.querySelectorAll('[data-pic]').forEach(sp=>sp.appendChild(cbPic(sp.dataset.pic, +sp.dataset.step)));
  body.scrollTop=0;
}
$('#cbBody').addEventListener('click', e=>{
  const b=e.target.closest('.cbslot'); if(!b) return;
  CB.slot=b.dataset.slot; sfx('select',.3); renderCbSlot(); $('#cbSlotBox').hidden=false;
});

/* =====================================================================
   TỜ MỘT Ô — cả thang 10 bậc, bậc đang dùng sáng, bậc kế có nút nâng.
   Bộ art xếp 01→10 nên màn hình bày đúng như thế: người chơi thấy cả con đường, không chỉ bước kế.
   ===================================================================== */
function renderCbSlot(){
  const id=CB.hero, s=cyberSlot(CB.slot); if(!s) return;
  const step=cyberStep(id, s.id), cap=cyberCap(id, s.id);
  $('#cbSlotTitle').textContent=s.name;
  $('#cbSlotSub').textContent=`${ROSTER[id].name} · ${String(step).padStart(2,'0')}/${cap} · ${rn(PLAYER.parts)} LK`;
  const list=$('#cbSlotList'); list.innerHTML='';

  for(let k=1;k<=CYBER.maxStep;k++){
    const it=cyberItem(s.id, k), r=cbRar(k), fx=cyberStepFx(id, s.id, k);
    const state = k<step ? 'past' : k===step ? 'cur' : k===step+1 && k<=cap ? 'next' : k>cap ? 'locked' : 'far';
    const row=el('div',`cbstep ${r.css} is-${state}`);
    const cost=cyberCost(k), afford=canPay(cost);
    row.innerHTML=`<span class="cbstep__pic" data-pic="${s.id}" data-step="${k}"></span>
      <div class="cbstep__i">
        <div class="cbstep__h"><b class="mono">${String(k).padStart(2,'0')}</b><span class="cbstep__r">${r.label}</span>
          ${k===step?'<em class="cbstep__now">ĐANG DÙNG</em>':''}${k>cap?'<em class="cbstep__lock">CẤY GHÉP</em>':''}</div>
        <b class="cbstep__n">${it.name}</b>
        <em class="cbstep__d">${it.sub}</em>
        <span class="cbstep__fx">${cbFxText(fx)}</span>
      </div>
      ${state==='next' ? `<button class="btn-act btn-act--go cbstep__go" data-up="1" ${afford?'':'disabled'}><span class="btn-act__k">Nâng</span><span class="btn-act__v">${cbCostText(cost)}${afford?'':' · THIẾU'}</span></button>`
        : state==='far' ? `<span class="cbstep__cost mono">${cbCostText(cost)}</span>` : ''}`;
    list.appendChild(row);
  }
  list.querySelectorAll('[data-pic]').forEach(sp=>sp.appendChild(cbPic(sp.dataset.pic, +sp.dataset.step)));
  const cur=list.querySelector('.is-cur, .is-next');
  if(cur) cur.scrollIntoView({block:'center', behavior:'auto'});
}
$('#cbSlotList').addEventListener('click', e=>{
  const b=e.target.closest('[data-up]'); if(!b || b.disabled) return;
  const r=cyberUp(CB.hero, CB.slot);
  if(r==='ok'){ AUDIO.upgrade ? AUDIO.upgrade() : sfx('open',.24); renderCbSlot(); renderCyber(); }
  else sfx('error',.35);
});
$('#cbSlotClose').addEventListener('click',()=>{ $('#cbSlotBox').hidden=true; CB.slot=null; sfx('cancel',.25); });

/* =====================================================================
   TỜ PHÂN TÁCH BẢN DƯ — lời hứa treo từ đợt 1 của gacha
   ===================================================================== */
function renderCbScrap(){
  const rows=scrapList(), t=scrapTotal(), list=$('#cbScrapList'); list.innerHTML='';
  $('#cbScrapSub').textContent=`${t.n} LÁ TRÙNG · +${rn(t.lk)} LK · ĐANG CÓ ${rn(PLAYER.parts)} LK`;
  if(!rows.length){
    list.innerHTML=`<div class="dl__row"><div class="dl__info"><b>CHƯA CÓ LÁ TRÙNG NÀO</b>
      <span class="mono">Quay trúng người đã sở hữu thì lá đó thành bản dư, phân tách ở đây lấy linh kiện. Bậc B 10 LK · A 25 LK · S 60 LK.</span></div></div>`;
  }
  rows.forEach(x=>{
    const d=ROSTER[x.id];
    const r=el('div',`dl__row cbscrap t-${d.tier.toLowerCase()}`);
    const pic=el('span','cbscrap__p'); pic.appendChild(portraitEl(d));
    r.appendChild(pic);
    r.insertAdjacentHTML('beforeend',
      `<div class="dl__info"><b>${d.name} <span class="cbscrap__t">${d.tier}</span></b>
        <span class="mono">DƯ ×${x.n} · ${x.each} LK mỗi lá → <b>+${rn(x.lk)} LK</b></span></div>
       <button class="btn-ghost dl__claim" data-id="${x.id}">PHÂN TÁCH</button>`);
    list.appendChild(r);
  });
  $('#btnScrapAll').disabled=!t.n;
  $('#scrapAllMeta').textContent = t.n ? `${t.n} LÁ · +${rn(t.lk)} LK` : '—';
}
$('#cbScrapList').addEventListener('click', e=>{
  const b=e.target.closest('[data-id]'); if(!b) return;
  const g=scrapOne(b.dataset.id);
  if(g){ sfx('open',.24); renderCbScrap(); renderCyber(); } else sfx('error',.35);
});
$('#btnScrap').addEventListener('click',()=>{ renderCbScrap(); $('#cbScrapBox').hidden=false; sfx('open',.2); });
$('#btnScrapAll').addEventListener('click',()=>{
  const g=scrapAll(); if(!g) return sfx('error',.35);
  sfx('open',.26); renderCbScrap(); renderCyber();
  $('#scrapAllMeta').textContent=`ĐÃ PHÂN TÁCH ${g.n} LÁ · +${rn(g.lk)} LK`;
});
$('#cbScrapClose').addEventListener('click',()=>{ $('#cbScrapBox').hidden=true; renderCyber(); });

/* ---- Vào màn từ hồ sơ nhân vật ở ARCHIVE: mở thẳng đúng người đang xem ---- */
function openCyberFor(id){ CB.hero=id; $('#lore').hidden=true; go('cyber'); }
