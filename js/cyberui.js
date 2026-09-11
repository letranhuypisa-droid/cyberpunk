'use strict';
/* =====================================================================
   CYBERWARE — màn hình. Chọn nhân vật → chọn ô → chọn món → lắp / nâng bậc / tháo, và tờ phân tách bản dư.
   Số liệu + logic ở js/cyber.js. Đặc tả: docs/cyberware.md §E.
   Nạp sau js/app.js (cần go/renderWallet/portraitEl).
   ===================================================================== */

/* ---- Icon 5 ô: vẽ trong code, chưa cần một file ảnh nào. Thả art/cyber/<id>.png vào là tự thay. ---- */
const CB_ICON = {
  neu:'<rect x="5" y="5" width="14" height="14" rx="2"/><rect x="9" y="9" width="6" height="6" fill="currentColor" stroke="none"/><path d="M12 5V2M12 22v-3M5 12H2M22 12h-3M8 5V3M16 5V3M8 21v-2M16 21v-2"/>',
  opt:'<path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6Z"/><circle cx="12" cy="12" r="3.4"/><path d="M12 6V3M18.5 8.5 20.6 6.4"/>',
  arm:'<rect x="2" y="4.5" width="3.5" height="5" rx="1"/><path d="M5.5 7h4l3 4"/><circle cx="13.6" cy="11.6" r="2.4"/><path d="M15.4 13.2 19 17.2"/><path d="M19 17.2l2.2-1.4M19 17.2l-1.4 2.2"/>',
  cor:'<path d="M12 3v18"/><path d="M6 7c3 1.4 9 1.4 12 0M5.5 12c3.4 1.6 9.6 1.6 13 0M6.5 17c3 1.4 8 1.4 11 0"/><path d="M4 5v14M20 5v14"/>',
  leg:'<path d="M9 3h5l-1 7 3 5-2 6H8l-1-6 3-5Z"/><path d="M9.2 10h5.6M7 21h11"/><circle cx="11.5" cy="6" r="1.3" fill="currentColor" stroke="none"/>',
};
const cbIcon = (slot, cls='') => `<svg class="cbic ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${CB_ICON[slot]||''}</svg>`;
const cbTier = t => t.toLowerCase();
/* "+9% ATK · +3 CRIT" — cùng thứ tự ở mọi chỗ, để mắt quen */
function cbFxText(fx){
  return [ fx.atkPct&&`+${fx.atkPct}% ATK`, fx.hpPct&&`+${fx.hpPct}% HP`, fx.spd&&`+${fx.spd} SPD`, fx.crit&&`+${fx.crit} CRIT` ]
    .filter(Boolean).join(' · ') || '—';
}
const cbCostText = c => `${rn(c.lk)} LK · ${rn(c.cr)} CR`;

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

/* Dải chọn nhân vật: ai đã sở hữu, người trong đội lên trước, huy hiệu = số ô đã lắp */
function renderCbPick(owned){
  const box=$('#cbPick'); box.innerHTML='';
  const rank = id => (TEAM.includes(id)?2:0) + (cyberCount(id)?1:0);
  [...owned].sort((a,b)=> rank(b)-rank(a) || 'SAB'.indexOf(ROSTER[a].tier)-'SAB'.indexOf(ROSTER[b].tier)).forEach(id=>{
    const d=ROSTER[id], n=cyberCount(id), bare=cyberNoFit(id);
    const b=el('button',`cbp cbp--${d.faction} ${id===CB.hero?'is-on':''}`);
    b.dataset.id=id;
    b.appendChild(portraitEl(d));
    b.insertAdjacentHTML('beforeend',
      `<span class="cbp__n">${d.name}</span>`
      + (bare ? `<em class="cbp__b cbp__b--bare">TRẦN</em>` : n ? `<em class="cbp__b">${n}/5</em>` : '')
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
  const base=baseStats(id), fin=unitStats(id), bo=cyberBonus(id), bare=cyberNoFit(id);
  const H=[];
  H.push(`<div class="cbhero cbhero--${d.faction}">
    <div class="cbhero__p" id="cbHeroPic"></div>
    <div class="cbhero__i">
      <b>${d.name}</b><em>TIER ${d.tier} · LV ${lvl(id)} · ${bare?'KHÔNG CẤY GHÉP':`${cyberCount(id)}/5 Ô`}</em>
      ${cbStatRow('ATK', base.atk, fin.atk)}${cbStatRow('HP', base.hp, fin.hp)}
      ${cbStatRow('SPD', base.spd, fin.spd)}${cbStatRow('CRIT', base.crit, fin.crit, '%')}
    </div>
  </div>`);

  if(bare){
    H.push(`<div class="cbbare">
      <h4>THÉP TRẦN</h4>
      <p>${d.name} không có một khớp nối kim loại nào — cả người là máu thịt nguyên bản, đó là lý do anh còn
         sống theo luật của mình. <b>Không lắp cyberware được.</b></p>
      <p class="cbbare__fx">Đổi lại, anh luôn mang sẵn: <b>${cbFxText(CYBER.bare)}</b></p>
    </div>`);
  } else {
    H.push('<div class="cbslots">' + CYBER_SLOTS.map(s=>{
      const it=cyberAt(id, s.id), c=it&&cyberById(it.id);
      const fx=it?cyberFx(it.id, it.lv):null;
      return `<button class="cbslot ${c?'is-on t-'+cbTier(c.tier):''}" data-slot="${s.id}">
        <i class="cbslot__ic">${cbIcon(s.id)}</i>
        <span class="cbslot__k">${s.name}</span>
        <span class="cbslot__i">${c
          ? `<b>${c.name}</b><em>${cbFxText(fx)}</em>`
          : `<b class="is-empty">— TRỐNG —</b><em>chạm để lắp</em>`}</span>
        ${c?`<span class="cbslot__t">${c.tier}${it.lv>1?`<u>+${it.lv-1}</u>`:''}</span>`:''}
        <i class="cbslot__go">▸</i>
      </button>`;
    }).join('') + '</div>');
    const tot=cbFxText(bo);
    H.push(`<p class="cbnote">Tổng cyberware đang mang: <b>${tot}</b>.
      Cấp nâng cấp nhân trước, cyberware nhân sau — hai nguồn nhân nhau, không cộng dồn phần trăm.</p>`);
  }
  body.innerHTML=H.join('');
  const pic=$('#cbHeroPic'); if(pic) pic.appendChild(portraitEl(d));
  body.scrollTop=0;
}
$('#cbBody').addEventListener('click', e=>{
  const b=e.target.closest('.cbslot'); if(!b) return;
  CB.slot=b.dataset.slot; sfx('select',.3); renderCbSlot(); $('#cbSlotBox').hidden=false;
});

/* =====================================================================
   TỜ CHỌN MÓN CHO MỘT Ô — ba hạng của ô đó, món đang lắp lên đầu
   ===================================================================== */
function renderCbSlot(){
  const id=CB.hero, s=CYBER_SLOTS.find(x=>x.id===CB.slot); if(!s) return;
  const cur=cyberAt(id, s.id), curDef=cur&&cyberById(cur.id);
  $('#cbSlotTitle').textContent=s.name;
  $('#cbSlotSub').textContent=`${ROSTER[id].name} · ${s.sub.toUpperCase()} · ${rn(PLAYER.parts)} LK`;
  const list=$('#cbSlotList'); list.innerHTML='';
  const defs=cyberOfSlot(s.id).slice().sort((a,b)=>
    (cur&&cur.id===b.id?1:0)-(cur&&cur.id===a.id?1:0) || 'BAS'.indexOf(a.tier)-'BAS'.indexOf(b.tier));

  defs.forEach(c=>{
    const on = cur && cur.id===c.id, lv = on ? cur.lv : 1;
    const fx = cyberFx(c.id, lv), craft = cyberCraftCost(c);
    const row=el('div',`cbitem t-${cbTier(c.tier)} ${on?'is-on':''}`);
    const acts=[];
    if(on){
      if(lv < CYBER.maxLv){ const up=cyberUpCost(c, lv);
        acts.push(`<button class="btn-act btn-act--go cbbtn" data-act="up" ${canPay(up)?'':'disabled'}><span class="btn-act__k">Nâng bậc ${lv+1}</span><span class="btn-act__v">${cbCostText(up)}${canPay(up)?'':' · KHÔNG ĐỦ'}</span></button>`); }
      else acts.push(`<div class="cbmax">KỊCH BẬC ${CYBER.maxLv}/${CYBER.maxLv}</div>`);
      acts.push(`<button class="btn-ghost cbbtn cbbtn--off" data-act="off">Tháo · hoàn ${rn(Math.round(cyberSunkLk(c,lv)*CYBER.refund))} LK</button>`);
    } else {
      acts.push(`<button class="btn-act cbbtn" data-act="fit" data-id="${c.id}" ${canPay(craft)?'':'disabled'}><span class="btn-act__k">${curDef?'Thay':'Lắp'}</span><span class="btn-act__v">${cbCostText(craft)}${canPay(craft)?'':' · KHÔNG ĐỦ'}</span></button>`);
    }
    row.innerHTML=`<div class="cbitem__h"><i class="cbitem__ic">${cbIcon(s.id)}</i>
        <div class="cbitem__n"><b>${c.name}</b><em>${cbFxText(fx)}</em></div>
        <span class="cbitem__t">${c.tier}${on&&lv>1?`<u>+${lv-1}</u>`:''}</span></div>
      <p class="cbitem__d">${c.desc}</p>
      <p class="cbitem__math">gốc ${cbFxText(c.fx)} × bậc ${CYBER.lvMult[lv-1].toFixed(2)}${on&&lv<CYBER.maxLv?` → bậc ${lv+1} cho ${cbFxText(cyberFx(c.id, lv+1))}`:''}</p>
      <div class="cbitem__act">${acts.join('')}</div>`;
    list.appendChild(row);
  });
}
$('#cbSlotList').addEventListener('click', e=>{
  const b=e.target.closest('[data-act]'); if(!b || b.disabled) return;
  const id=CB.hero, slot=CB.slot;
  let r;
  if(b.dataset.act==='fit') r=cyberFit(id, b.dataset.id);
  else if(b.dataset.act==='up') r=cyberUp(id, slot);
  else if(b.dataset.act==='off') r=cyberRemove(id, slot);
  if(r==='ok'){ sfx('open',.24); renderCbSlot(); renderCyber(); }
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
    const r=el('div',`dl__row cbscrap t-${cbTier(d.tier)}`);
    const pic=el('span','cbscrap__p'); pic.appendChild(portraitEl(d));
    r.appendChild(pic);
    r.insertAdjacentHTML('beforeend',
      `<div class="dl__info"><b>${d.name} <span class="cbitem__t">${d.tier}</span></b>
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
