'use strict';
/* APP — router màn hình, lobby, squad, sector, gacha, archive (kỹ năng / passive / hồ sơ), config, COMMS. Nạp cuối.
   Demo UI kit nằm ở js/kit.js (kit.html); thẻ nhân vật cardEl ở js/core.js. */

/* =====================================================================
   SCREEN ROUTER — title → home → squad → map → sector → battle
   ===================================================================== */
const APP=$('#battle');
function go(name){
  if(name==='battle' && !SECTOR.team){ TEAM=normalizeTeam(TEAM); if(TEAM.includes(null)) return go('squad'); }
  if(APP.dataset.screen==='battle' && name!=='battle'){ B.gen++; exitTargeting(); closePassive(); stopCutin(); comicEnd(); }   // rời trận giữa chừng: huỷ mọi việc đang chờ
  if(APP.dataset.screen==='gacha' && name!=='gacha') stopVideoBox($('#revealCutin'));
  if(APP.dataset.screen==='riotmap' && name!=='riotmap' && typeof riotTickStop==='function') riotTickStop();   // rời bản đồ Khu Đáy: tắt đồng hồ đếm
  if(APP.dataset.screen!==name && APP.dataset.screen!=='title') sfx('swipe',.35);
  APP.dataset.screen=name;
  document.querySelectorAll('.screen').forEach(sc=>sc.classList.toggle('is-active', sc.dataset.screen===name));
  // Vào trận: che bằng cổng nạp rồi mới dựng sân. Kiểm lại data-screen vì người chơi có thể bấm ◂ BASE
  // trong lúc đang nạp — dựng sân cho một màn đã rời là vừa phí vừa sai.
  if(name==='battle') battleGate().then(()=>{ if(APP.dataset.screen==='battle') initBattle(); });
  if(name==='squad') renderSquad();
  if(name==='map') renderMap();
  if(name==='riot') renderRiot();
  if(name==='riotmap' && typeof renderRiotMap==='function') renderRiotMap();   // bản đồ Khu Đáy (js/riotui.js)
  if(name==='cyber'   && typeof renderCyber==='function')   renderCyber();     // cấy ghép 5 ô (js/cyberui.js)
  if(name==='sector') renderSectors();
  if(name==='home') renderHome();
  if(name==='gacha'){ markSeen('gacha'); renderGacha(); }
  if(name==='cyber') markSeen('cyber');
  if(name==='riotmap') markSeen('riot');
  firstTimeTip(name);                                  // hộp chỉ dẫn lần đầu vào một màn (docs/ui-nguoi-moi.md §C5)
  if(name==='archive') renderArchive();
  if(name==='config') renderConfig();
  if(scrollY<300) window.scrollTo({top:0});
}
document.addEventListener('click', e=>{
  const b=e.target.closest('[data-go]'); if(!b || b.disabled) return;
  go(b.dataset.go);
});
document.addEventListener('keydown', e=>{ if(APP.dataset.screen==='title' && (e.key==='Enter'||e.key===' ')) go('home'); });

/* ---- TITLE: key art (art/title_keyart.png → fallback ảnh Yuki trong suốt) ---- */
loadFirst(['art/title_keyart.png','art-src/YUKI/Yuki PNG.png']).then(src=>{ if(src){ const im=$('#titleArt'); im.src=src; im.classList.add('has-img'); } });

/* ---- HOME ---- */
function renderWallet(){ document.querySelectorAll('#pShards,#gShards').forEach(e=>e.textContent=PLAYER.shards.toLocaleString('en-US')); $('#pCredits').textContent=PLAYER.credits.toLocaleString('en-US'); $('#pName').textContent=PLAYER.name; $('#pLevel').textContent=`LV ${PLAYER.level} · KHU ĐÁY`; }
function renderDailyStrip(){
  const d=dailyTick(); const done=DAILY_TASKS.filter(t=>(d.prog[t.id]||0)>=t.goal).length; const claim=dailyClaimable().length;
  const s=$('#daily'); s.hidden=false; s.classList.toggle('has-claim', claim>0);
  $('#dailyText').innerHTML=`<b>NHIỆM VỤ NGÀY ${done}/${DAILY_TASKS.length}</b> — ${claim?claim+' việc chờ nhận thưởng':'làm xong được thêm SH'}`;
}
function renderDailyList(){
  const d=dailyTick(); const list=$('#dailyList'); list.innerHTML=''; $('#dailyDate').textContent=`RESET 00:00 · ${d.date}`;
  DAILY_TASKS.forEach(t=>{ const p=d.prog[t.id]||0, done=p>=t.goal, claimed=d.claimed.includes(t.id);
    const r=el('div','dl__row'+(claimed?' is-claimed':''));
    r.innerHTML=`<div class="dl__info"><b>${t.label}</b><div class="bar" data-state="ok" style="--v:${Math.round(p/t.goal*100)}%"><div class="bar__track"><i class="bar__ghost"></i><i class="bar__fill"></i><i class="bar__ticks"></i></div></div><span class="mono">${p}/${t.goal} · +${t.reward} SH</span></div>
      <button class="btn-ghost dl__claim" ${done&&!claimed?'':'disabled'}>${claimed?'ĐÃ NHẬN':done?'NHẬN':'—'}</button>`;
    r.querySelector('.dl__claim').addEventListener('click',()=>{ if(dailyClaim(t.id)){ sfx('open',.22); renderWallet(); renderDailyList(); renderDailyStrip(); } });
    list.appendChild(r); });
}
$('#daily').addEventListener('click',()=>{ renderDailyList(); $('#dailyBox').hidden=false; });
$('#dailyClose').addEventListener('click',()=>{ $('#dailyBox').hidden=true; });

/* =====================================================================
   GIỮ CHÂN (đợt 7 — docs/giu-chan.md). Ba mảnh: dải CHUỖI NGÀY ở HOME, hộp VỀ RỒI lúc mở game,
   tab KỶ LỤC trong THƯ VIỆN. Số liệu ở COMEBACK/STREAK (js/data.js), logic ở js/state.js.
   ===================================================================== */
function renderStreakStrip(){
  const n=streakDays(), claim=streakClaimable().length, next=streakNext();
  const s=$('#streak'); if(!s) return;
  s.hidden=false; s.classList.toggle('has-claim', claim>0);
  $('#streakText').innerHTML = `<b>${n}/7 NGÀY TUẦN NÀY</b> — ` + (claim ? `${claim} mốc chờ nhận`
    : next ? `còn ${next.days-n} ngày nữa là +${next.sh} SH` : 'đã nhận hết mốc tuần này');
}
function renderStreakList(){
  const w=streakTick(), list=$('#streakList'); list.innerHTML='';
  $('#streakSub').textContent=`${w.days.length}/7 NGÀY · TUẦN BẮT ĐẦU THỨ HAI`;
  /* Nói thẳng luật ngay trên đầu danh sách: đây là thứ người chơi sợ nhất ở mọi game có "chuỗi" */
  list.insertAdjacentHTML('beforeend',
    `<div class="dl__note">Đếm số ngày <b>có mở game</b> trong tuần. Nghỉ một hôm <b>không mất gì</b> —
     chỉ là tới mốc sau chậm hơn. Sang thứ Hai thì đếm lại từ đầu.</div>`);
  STREAK.forEach(s=>{
    const have=w.days.length>=s.days, claimed=w.claimed.includes(s.days);
    const r=el('div','dl__row'+(claimed?' is-claimed':''));
    r.innerHTML=`<div class="dl__info"><b>${s.days} ngày trong tuần</b>
      <div class="bar" data-state="ok" style="--v:${Math.round(Math.min(1,w.days.length/s.days)*100)}%"><div class="bar__track"><i class="bar__ghost"></i><i class="bar__fill"></i><i class="bar__ticks"></i></div></div>
      <span class="mono">${Math.min(w.days.length,s.days)}/${s.days} · +${s.sh} SH</span></div>
      <button class="btn-ghost dl__claim" ${have&&!claimed?'':'disabled'}>${claimed?'ĐÃ NHẬN':have?'NHẬN':'—'}</button>`;
    r.querySelector('.dl__claim').addEventListener('click',()=>{ if(streakClaim(s.days)){ sfx('open',.22); renderWallet(); renderStreakList(); renderStreakStrip(); } });
    list.appendChild(r);
  });
}
$('#streak').addEventListener('click',()=>{ renderStreakList(); $('#streakBox').hidden=false; });
$('#streakClose').addEventListener('click',()=>{ $('#streakBox').hidden=true; });

/* ---- VỀ RỒI: hộp đón lúc mở game, một lần mỗi ngày (docs/giu-chan.md §D1) ----
   Không chỉ đưa tiền: nó kể lại chuyện đã xảy ra lúc đi vắng (bãi đẻ kiện, nhiệm vụ ngày đã reset,
   chuỗi ngày vừa cộng thêm), để cú mở game là NHẬN chứ không phải BẮT ĐẦU LÀM. */
let backShown=false;
function showComeback(){
  if(backShown) return; backShown=true;                     // một lần mỗi phiên, kể cả khi quay lại HOME nhiều lần
  const o=comebackOffer(); if(!o) return;
  const box=$('#backBox'); if(!box) return;
  const h=Math.floor(o.hoursRaw), d=Math.floor(h/24);
  $('#backTime').innerHTML = d>=1 ? `Vắng <b>${d} ngày ${h%24} giờ</b>` : h>=1 ? `Vắng <b>${h} giờ</b>` : `Vắng <b>${Math.round(o.hoursRaw*60)} phút</b>`;
  $('#backRw').innerHTML = `+${o.shards} SH · +${o.credits.toLocaleString('en-US')} CR`
    + (o.capped ? `<span class="back__cap">(tính tối đa ${COMEBACK.capHours} giờ)</span>` : '');
  const lines=[];
  if(typeof riotSummary==='function' && riotUnlocked()){
    const s=riotSummary();
    if(s && s.crates) lines.push(`${s.crates} kiện hàng đang chờ ở Khu Đáy`);
    if(s && s.contested) lines.push(`${s.contested} bãi bị chiếm — đánh một trận là lấy lại`);
  }
  lines.push(`Nhiệm vụ ngày đã làm mới — ${DAILY_TASKS.length} việc, tổng ${DAILY_TASKS.reduce((a,t)=>a+t.reward,0)} SH`);
  const st=streakNext(); if(st) lines.push(`Chuỗi tuần: ${streakDays()}/7 ngày, còn ${st.days-streakDays()} ngày nữa là +${st.sh} SH`);
  $('#backList').innerHTML = lines.map(t=>`<li>${t}</li>`).join('');
  $('#backOkV').textContent = `+${o.shards} SH · +${o.credits.toLocaleString('en-US')} CR`;
  $('#backOk').onclick=()=>{ if(comebackClaim(o)){ AUDIO.upgrade(); renderWallet(); } box.hidden=true; };
  box.hidden=false; sfx('open',.2);
}
/* Đóng dấu "đang ở đây" — lúc rời trang và mỗi 3 phút. Quà VỀ RỒI tính từ mốc này. */
addEventListener('pagehide', ()=>{ if(typeof touchSeen==='function') touchSeen(); });
addEventListener('visibilitychange', ()=>{ if(document.visibilityState==='hidden' && typeof touchSeen==='function') touchSeen(); });
setInterval(()=>{ if(typeof touchSeen==='function' && document.visibilityState==='visible') touchSeen(); }, 180000);
/* Ngồi ở HOME là lúc rảnh nhất — tranh thủ nạp trước thứ vào trận sẽ cần: pose `idle` của đội hình, nền
   sector kế, hai sheet fx kêu ngay đòn đầu. Nạp xong thì cổng nạp lúc vào trận thường mở luôn ở 100%.
   Tuần tự ở nhịp rảnh nên không giành băng thông với ảnh đang hiện trên HOME. */
function warmNextBattle(){
  if(typeof LOAD==='undefined') return;
  const q=[];
  normalizeTeam(TEAM).filter(Boolean).forEach(id=>{
    const s=(ROSTER[id]||{}).sprites; if(s&&s.idle) q.push(()=>loadFirst(s.idle));
  });
  if(typeof SECTOR!=='undefined' && SECTOR && SECTOR.bg) q.push(()=>loadFirst(SECTOR.bg));
  if(typeof FX!=='undefined') q.push(()=>FX.sheet('hit',false), ()=>FX.sheet('crit',false));
  LOAD.idle(q);
}

function renderHome(){
  renderWallet(); renderDailyStrip(); renderStreakStrip(); warmNextBattle();
  showComeback();                                    // hộp đón lúc mở game (một lần mỗi phiên, một lần mỗi ngày)
  const bonds=availableBonds(); const c=$('#comms');
  if(bonds.length){ const b=bonds[Math.floor(Math.random()*bonds.length)]; c.hidden=false;
    $('#commsText').innerHTML=`<b>${ROSTER[b.pair[0]].name} · ${ROSTER[b.pair[1]].name}</b> — ${b.lines[0].text}`;
    c.onclick=()=>playStory(b.lines, {id:'BASE', name:`COMMS · ${b.title.toUpperCase()}`, bg:['art/bg/bg_base.jpg','art/bg/bg_battle.jpg']}).then(renderHome);
  } else c.hidden=true;
  if(!$('#homeAvatar').firstChild) $('#homeAvatar').appendChild(portraitEl(ROSTER.yuki));
  const feat = ROSTER.yuki;
  if($('#heroArt').dataset.id!==feat.id){ const p=portraitEl(feat); $('#heroArt').replaceWith(p); p.id='heroArt'; p.dataset.id=feat.id; $('#heroFeat').innerHTML=`NHÂN VẬT CHÍNH · TIER ${feat.tier}<b>${feat.name}</b>`; }
  syncSectorStates();
  /* Nút DẸP LOẠN: khoá tới khi xong màn mở khoá. Mở rồi thì in việc đang chờ ở Khu Đáy (bãi giữ được /
     kiện chờ nhận), và chấm đỏ khi có kiện, có bãi bị chiếm hoặc có hợp đồng tuần xong — riotHasWork() ở js/riot.js. */
  const rb=$('#btnRiotMenu'); if(rb){ const on=riotUnlocked();
    rb.classList.toggle('is-locked', !on); rb.disabled=!on;
    /* Nút menu chỉ cao 56px và chữ nhỏ chỉ vừa MỘT dòng — in việc gấp nhất, không in cả bảng tổng quan */
    const o = on && typeof riotSummary==='function' ? riotSummary() : null;
    $('#riotMenuSub').textContent = !on ? `cần xong ${RIOT.unlock}`
      : !o ? `tầng ${PLAYER.riot.tier}`
      : o.crates ? `${o.crates} kiện chờ`
      : o.contested ? `${o.contested} bãi mất`
      : `${o.own}/${RIOT_YARDS.length} bãi`;
    const dot=$('#riotMenuDot'); if(dot) dot.hidden = !(on && typeof riotHasWork==='function' && riotHasWork()); }
  /* Nút CẤY GHÉP: in ví linh kiện; chấm đỏ khi còn lá trùng chưa phân tách (lời hứa treo từ gacha) */
  const cb=$('#cyberMenuSub');
  if(cb && typeof scrapTotal==='function'){
    const t=scrapTotal();
    cb.textContent = PLAYER.parts ? `${PLAYER.parts.toLocaleString('en-US')} LK` : t.n ? `${t.n} lá dư` : '6 ô';
    // "có việc" ghi vào data-work chứ không tắt/bật chấm ngay: syncMenuLocks bên dưới còn một lý do
    // thứ hai để bật chấm (tính năng vừa mở khoá, chưa xem lần nào) và nó là chỗ quyết định cuối.
    const cd=$('#cyberMenuDot'); if(cd) cd.dataset.work = t.n ? '1' : '';
  }
  syncMenuLocks();
  const sec = SECTORS.find(x=>x.state==='open') || SECTORS[SECTORS.length-1];
  SECTOR = sec;
  $('#homeSector').textContent=sec.id;
  $('#homeSectorMeta').textContent=`${sec.name} · ${sec.waves} đợt địch${sec.boss?' · trùm '+ENEMY_POOL.find(e=>e.id===sec.boss).name:''}`;
  const pm=$('#playMeta'); if(pm) pm.textContent=`${sec.id} · ${sec.name}`;
}
/* Mở dần: nút chưa tới lúc thì mờ + ghi điều kiện, tới lúc thì sáng kèm chấm đỏ đúng một lần
   (docs/ui-nguoi-moi.md §C5). Mốc mở khai ở MENU_UNLOCK trong js/data.js. */
function syncMenuLocks(){
  const rows=[['gacha', $('#btnGachaMenu'), $('#gachaMenuSub'), $('#gachaMenuDot'), 'quay thẻ'],
              ['cyber', $('#btnCyberMenu'), $('#cyberMenuSub'), $('#cyberMenuDot'), null]];
  PLAYER.seenNew = PLAYER.seenNew || [];
  rows.forEach(([key, btn, sub, dot, dfl])=>{
    if(!btn) return;
    const on = typeof menuOpen==='function' ? menuOpen(key) : true;
    btn.classList.toggle('is-locked', !on); btn.disabled=!on;
    if(!on){ if(sub) sub.textContent=`cần xong ${MENU_UNLOCK[key]}`; if(dot) dot.hidden=true; return; }
    if(dfl && sub) sub.textContent=dfl;                       // CẤY GHÉP tự viết dòng của nó ở trên
    /* Chấm đỏ có ĐÚNG HAI lý do: tính năng vừa mở mà chưa xem lần nào, hoặc đang có việc phải làm
       (lá dư chờ phân tách — renderHome ghi vào data-work). Phải gán cả hai chiều: chỉ bật mà không
       bao giờ tắt thì xem xong quay lại chấm vẫn còn, đúng lỗi gặp lúc thử 16/09. */
    if(dot) dot.hidden = !(dot.dataset.work==='1' || !PLAYER.seenNew.includes(key));
  });
}
/* Ghi nhận người chơi đã xem tính năng vừa mở (tắt chấm đỏ, một lần cho mỗi hồ sơ) */
function markSeen(key){
  PLAYER.seenNew = PLAYER.seenNew || [];
  if(PLAYER.seenNew.includes(key)) return;
  PLAYER.seenNew.push(key); savePlayer();
}

/* ---- SQUAD: 3 slot + roster, bấm thẻ để thêm/bỏ, kéo thả cũng được. Đội hình lưu vào hồ sơ. ---- */
/* "Rảnh" = không đang đồn trú ở bãi nào của DẸP LOẠN (js/riot.js). Guard typeof vì kit.html không nạp riot.js. */
const isFreeUnit = id => typeof garrisoned!=='function' || !garrisoned(id);
const SQUAD = { slots: normalizeTeam(TEAM) };
function renderSquad(){
  const slots=$('#squadSlots'), roster=$('#squadRoster');
  slots.innerHTML='';
  SQUAD.slots.forEach((id,i)=>{
    const t=el('div','tslot'); t.dataset.idx=i;
    t.innerHTML=`<span class="tslot__idx">${String(i+1).padStart(2,'0')}</span><div class="tslot__empty"></div>`;
    if(id){ const d=ROSTER[id]; t.classList.add('is-filled','f-'+d.faction); t.appendChild(portraitEl(d)); t.insertAdjacentHTML('beforeend',`<div class="tslot__name">${d.name}</div>`);
      t.addEventListener('click',()=>{ SQUAD.slots[i]=null; renderSquad(); }); }
    t.addEventListener('dragover',ev=>{ ev.preventDefault(); slots.querySelectorAll('.is-over').forEach(x=>x.classList.remove('is-over')); t.classList.add('is-over'); });
    t.addEventListener('dragleave',()=>t.classList.remove('is-over'));
    t.addEventListener('drop',ev=>{ ev.preventDefault(); const id=ev.dataTransfer.getData('text/plain'); if(!ROSTER[id]) return; const j=SQUAD.slots.indexOf(id); if(j>-1) SQUAD.slots[j]=null; SQUAD.slots[i]=id; renderSquad(); });
    slots.appendChild(t);
  });
  if(!roster.dataset.built){
    roster.dataset.built='1';
    Object.values(ROSTER).forEach(d=>{
      const c=cardEl(d,''); c.dataset.id=d.id;
      c.addEventListener('click',()=>{ if(!owns(d.id)||!isFreeUnit(d.id)) return; const j=SQUAD.slots.indexOf(d.id); if(j>-1) SQUAD.slots[j]=null; else { const k=SQUAD.slots.indexOf(null); if(k<0) return; SQUAD.slots[k]=d.id; } renderSquad(); });
      roster.appendChild(c);
    });
  }
  // nhân vật chưa sở hữu → khoá (lấy ở màn GACHA hoặc cốt truyện); đang đồn trú ở một cái bãi của DẸP LOẠN → cũng khoá
  // (quy tắc Q2 ở docs/dep-loan.md: đóng quân là khoá khỏi đội hình, đây là lý do duy nhất khiến roster rộng có giá trị)
  SQUAD.slots = SQUAD.slots.map(id => id && owns(id) && isFreeUnit(id) ? id : null);
  roster.querySelectorAll('.card').forEach(c=>{ const id=c.dataset.id, on=SQUAD.slots.includes(id), inGar=!isFreeUnit(id), locked=!owns(id)||inGar;
    c.classList.toggle('is-selected',on); c.classList.toggle('is-locked',locked); c.draggable=!locked;
    c.querySelector('.card__state').textContent = on?'SELECTED':inGar?'ĐỒN TRÚ':locked?'LOCKED':''; });
  // sắp xếp: người dùng được lên trước (đã sở hữu và đang rảnh), rồi tới người đang đồn trú, cuối là chưa sở hữu
  const rank = id => (owns(id)?2:0) + (owns(id)&&isFreeUnit(id)?1:0);
  [...roster.querySelectorAll('.card')].sort((a,b)=>rank(b.dataset.id)-rank(a.dataset.id)).forEach(c=>roster.appendChild(c));
  const n=SQUAD.slots.filter(Boolean).length;
  $('#squadCount').innerHTML=`<b>${n}</b>/${TEAM_SIZE} ĐÃ CHỌN`;
  const btn=$('#btnDeploy'); btn.disabled = n!==TEAM_SIZE; btn.querySelector('.btn-act__v').textContent = n===TEAM_SIZE ? 'Xong — ra bản đồ chọn màn' : `Cần chọn thêm ${TEAM_SIZE-n} người`;
  if(n===TEAM_SIZE){ TEAM=SQUAD.slots.slice(); PLAYER.team=TEAM.slice(); savePlayer(); }
}

/* ---- CONFIG ---- */
function renderConfig(){
  PLAYER.settings = Object.assign({sound:true, sfx:true, motion:false, skipStory:false, anim:true, ultVideo:true, revealVideo:true}, PLAYER.settings||{});
  document.querySelectorAll('.cfg__row[data-cfg]').forEach(r=>{ r.classList.toggle('is-on', !!PLAYER.settings[r.dataset.cfg]); });
  document.documentElement.classList.toggle('rm-forced', !!PLAYER.settings.motion);
  syncSpriteAnim();   // anim / motion đổi → dựng lại sprite (sheet động ⇄ ảnh tĩnh)
}
document.querySelectorAll('.cfg__row[data-cfg]').forEach(r=>r.addEventListener('click',()=>{ PLAYER.settings[r.dataset.cfg]=!PLAYER.settings[r.dataset.cfg]; savePlayer(); renderConfig(); }));
$('#cfgReset').addEventListener('click',()=>{ if(confirm('Xoá toàn bộ tiến trình trên máy này?')){ SAVE.reset(); location.reload(); } });

/* ---- ARCHIVE: 5 tab.
       NHÂN VẬT  19 người — thẻ sáng khi đã sở hữu, bấm mở hồ sơ (KỸ NĂNG · PASSIVE · HỒ SƠ).
       SỔ BỘ     21 kẻ địch — nhà DUY NHẤT của chúng (bỏ trùng 12/09, xem docs/archive-merge.md): trước đó
                 20 con nằm ở CẢ HAI tab, mỗi tab một nửa trang. Bấm mở cùng openLore, đọc được cả khi chưa sở hữu.
       ĐỊA DANH / THUẬT NGỮ = Thư viện (CODEX trong data.js), mở hết ngay, không khoá theo tiến trình.
       TRUYỆN    đọc lại trang comic từng màn, khoá theo tiến trình (xem comicEntries). ---- */
const ARCH = { tab:'char' };
function renderArchive(){
  const grid=$('#archGrid'); grid.innerHTML=''; $('#codex').hidden=true;
  document.querySelectorAll('#archTabs .lore__tab').forEach(b=>b.classList.toggle('is-on', b.dataset.atab===ARCH.tab));
  /* arch--codex = lưới thẻ ngang 4:3 (cột rộng 148px): Địa danh / Thuật ngữ vì ảnh là cảnh, và Truyện vì
     ảnh là panel comic. Sổ bộ dùng đúng thẻ 3/4 của tab Nhân vật: chúng là cùng một loại thứ — thứ sở hữu được. */
  grid.classList.toggle('arch--codex', ARCH.tab!=='char' && ARCH.tab!=='foe' && ARCH.tab!=='howto');
  grid.classList.toggle('arch--howto', ARCH.tab==='howto' || ARCH.tab==='rec');
  if(ARCH.tab==='howto') return renderHowtoGrid(grid);
  if(ARCH.tab==='rec') return renderRecordGrid(grid);
  if(ARCH.tab==='comic') return renderComicGrid(grid);
  if(ARCH.tab==='foe') return renderFoeGrid(grid);
  if(ARCH.tab!=='char') return renderCodexGrid(grid, codexGroup(ARCH.tab));
  const all=Object.values(ROSTER).filter(d=>!d.recruit); const n=all.filter(d=>owns(d.id)).length;
  $('#archCount').textContent=`${n}/${all.length} HỒ SƠ`;
  [...all].sort((a,b)=>owns(b.id)-owns(a.id) || 'SAB'.indexOf(a.tier)-'SAB'.indexOf(b.tier)).forEach(d=>{
    const has=owns(d.id); const t=el('div',`tile tile--${d.faction} tile--${d.tier.toLowerCase()} ${has?'':'is-locked'}`);
    t.appendChild(portraitEl(d));
    t.insertAdjacentHTML('beforeend',`${has?(lvl(d.id)>1?`<span class="tile__lock tile__lv">LV ${lvl(d.id)}</span>`:''):'<span class="tile__lock">LOCKED</span>'}<div class="tile__name"><span>${has?d.name:'???'}</span><span class="tier">${d.tier}</span></div>`);
    if(has) t.addEventListener('click',()=>openLore(d.id));
    grid.appendChild(t);
  });
}
/* SỔ BỘ — 21 kẻ địch, thứ tự theo tiến trình: đã chiêu mộ → đã hạ → chưa gặp.
   KHÔNG khoá đọc: chữ viết ra để đọc, và người chơi đánh nhau với chúng ngay mười phút đầu. Chỉ đánh dấu
   trạng thái, không giấu tên. CANTOR không có def trong ROSTER (RECRUIT_SKIP) nên def rơi về ENEMY_POOL —
   hắn cũng không có `tier`, phải guard chứ tier.toLowerCase() là vỡ trang. */
function renderFoeGrid(grid){
  const items=(codexGroup('foe')||{items:[]}).items;
  const nBeat=items.filter(it=>beaten(it.id)).length;
  $('#archCount').textContent=`${nBeat}/${items.length} ĐÃ HẠ`;
  const rank = it => owns(it.id) ? 0 : beaten(it.id) ? 1 : 2;
  [...items].sort((a,b)=>rank(a)-rank(b)).forEach(it=>{
    const d = ROSTER[it.id] || ENEMY_POOL.find(e=>e.id===it.id); if(!d) return;
    const has=owns(it.id), beat=beaten(it.id);
    const t=el('div',`tile tile--${d.faction} ${d.tier?'tile--'+d.tier.toLowerCase():''} ${beat||has?'':'is-locked'}`);
    t.appendChild(portraitEl(d));
    /* Ba nhãn cùng một dạng ngữ pháp — sổ bộ là bảng kiểm, liếc một cái phải biết đang ở bước nào.
       Cấp nâng cấp không để ở đây: nó nằm ngay trong trang, còn "ĐÃ CÓ" mới là thông tin của lưới. */
    const badge = has ? `<span class="tile__lock tile__lv">ĐÃ CÓ</span>`
                      : beat ? `<span class="tile__lock tile__lock--beat">ĐÃ HẠ</span>`
                             : `<span class="tile__lock">CHƯA HẠ</span>`;
    t.insertAdjacentHTML('beforeend',`${badge}<div class="tile__name"><span>${d.name}</span>${d.tier?`<span class="tier">${d.tier}</span>`:''}</div>`);
    t.addEventListener('click',()=>openLore(it.id));
    grid.appendChild(t);
  });
}
document.querySelectorAll('#archTabs .lore__tab').forEach(b=>b.addEventListener('click',()=>{ ARCH.tab=b.dataset.atab; sfx('cursor',.08); renderArchive(); }));

/* Ảnh minh hoạ Thư viện: art/lore/<id>.jpg — trừ mục sổ bộ (foe:'<id>') thì mượn luôn art thẻ kẻ địch đã có.
   Chưa có file thì hiện ô trống ghi luôn tên file cần thả vào. */
function codexPic(it, cls=''){
  const foe = it.foe && ENEMY_POOL.find(x=>x.id===it.foe);
  const p=el('div','portrait cdx__pic '+cls);
  p.style.setProperty('--pos', it.pos || (foe&&foe.pos) || (foe?'50% 10%':'50% 50%'));
  p.innerHTML=`<div class="cdx__none"><span>NO ASSET</span><b>art/lore/${it.id}.jpg</b></div><img alt="">`;
  loadFirst(foe&&foe.portrait ? foe.portrait.concat(codexArt(it.id)) : codexArt(it.id))
    .then(src=>{ if(src){ p.querySelector('img').src=src; p.classList.add('has-img'); } });
  return p;
}
function renderCodexGrid(grid, g){
  $('#archCount').textContent=`${g.items.length} MỤC · ${g.label}`;
  g.items.forEach(it=>{
    const t=el('div',`tile tile--wide ${it.faction?'tile--'+it.faction:''}`);
    t.appendChild(codexPic(it));
    t.insertAdjacentHTML('beforeend',`<div class="tile__name"><span>${it.name}</span></div>`);
    t.addEventListener('click',()=>openCodex(g, it));
    grid.appendChild(t);
  });
}
/* ---- ARCHIVE · TRUYỆN: đọc lại trang comic trước/sau mỗi màn (js/story.js), mở bằng playComic.
   Khoá theo tiến trình để không lộ truyện: phần TRƯỚC TRẬN mở khi màn đã mở, phần SAU TRẬN chỉ mở khi ĐÃ THẮNG
   màn đó. Ảnh thẻ mượn panel đầu của phần ấy. ---- */
function comicEntries(){
  const out=[];
  SECTORS.forEach(sec=>{
    const st=(typeof STORY!=='undefined') && STORY[sec.id]; if(!st) return;
    if(st.intro&&st.intro.length) out.push({ sec, kind:'intro', label:'TRƯỚC TRẬN', pages:st.intro, open:sec.state!=='locked' });
    if(st.outro&&st.outro.length) out.push({ sec, kind:'outro', label:'SAU TRẬN',   pages:st.outro, open:sec.state==='cleared' });
  });
  return out;
}
function renderComicGrid(grid){
  const list=comicEntries(), open=list.filter(e=>e.open);
  $('#archCount').textContent=`${open.length}/${list.length} PHẦN · ${open.reduce((s,e)=>s+e.pages.length,0)} TRANG ĐỌC ĐƯỢC`;
  list.forEach(e=>{
    const t=el('div',`tile tile--wide tile--comic tile--${e.kind==='outro'?'rust':'chrome'} ${e.open?'':'is-locked'}`);
    const pic=el('div','portrait cdx__pic');
    pic.innerHTML='<div class="cdx__none"><span>NO ASSET</span></div><img alt="">';
    loadFirst([comicImgName(e.sec.id, e.kind, 1, 1)]).then(src=>{ if(src){ pic.querySelector('img').src=src; pic.classList.add('has-img'); } });
    t.appendChild(pic);
    t.insertAdjacentHTML('beforeend',
      `<span class="tile__lock">${e.open?e.pages.length+' TRANG':'CHƯA MỞ'}</span>
       <div class="tile__name"><span>${e.sec.id} · ${e.open?e.sec.name:'???'}</span><span class="tier">${e.label}</span></div>`);
    if(e.open) t.addEventListener('click',()=>{ sfx('open',.17); playComic(e.pages, e.sec, e.kind, {replay:true}); });
    grid.appendChild(t);
  });
}
/* Tab KỶ LỤC: cái tốt nhất mình từng làm (docs/giu-chan.md §D5). Game không có mạng nên đối thủ duy nhất
   là bản thân hôm qua — mỗi dòng ghi cả NGÀY lập để thấy mình tiến tới đâu. Chưa có thì ghi "chưa có",
   kèm câu nói làm thế nào để lập, chứ không để một dấu gạch trống không giải thích gì. */
function renderRecordGrid(grid){
  const r = k => (typeof recordGet==='function' ? recordGet(k) : null);
  const fast=r('fastWin'), hit=r('bigHit');
  const deep=PLAYER.riot.best, yards=(typeof riotSummary==='function' && riotUnlocked()) ? (riotSummary()||{}).own : 0;
  const rows=[
    { name:'Thắng gọn nhất', val: fast ? `${fast.value} vòng` : null,
      sub: fast ? `${fast.sector} · ${fast.name} · ${fast.waves} đợt · ${fast.date}` : 'Thắng một trận là có ngay' },
    { name:'Cú đánh mạnh nhất', val: hit ? hit.value.toLocaleString('en-US') : null,
      sub: hit ? `${hit.who} → ${hit.target}${hit.crit?' · chí mạng':''} · ${hit.sector} · ${hit.date}` : 'Đánh một đòn vào kẻ địch là có' },
    { name:'Tầng HỐ LOẠN sâu nhất', val: deep ? `tầng ${deep}` : null,
      sub: deep ? `mở tới tầng ${PLAYER.riot.tier}` : 'Xong 07-A rồi xuống Khu Đáy' },
    { name:'Chuỗi ngày tuần này', val: `${streakDays()}/7 ngày`,
      sub: (streakNext() ? `còn ${streakNext().days-streakDays()} ngày nữa là +${streakNext().sh} SH` : 'đã lấy hết mốc tuần này') },
    { name:'Bãi đang giữ', val: yards ? `${yards}/${typeof RIOT_YARDS!=='undefined'?RIOT_YARDS.length:9}` : null,
      sub: yards ? 'ở DẸP LOẠN' : 'Chiếm một cái bãi ở Khu Đáy' },
    { name:'Đã hạ', val: `${(PLAYER.defeated||[]).length} loại kẻ địch`, sub:`sở hữu ${PLAYER.owned.length} đơn vị · đã quay ${PLAYER.pulls} lượt` },
  ];
  $('#archCount').textContent = `${rows.filter(x=>x.val).length}/${rows.length} CÓ SỐ`;
  rows.forEach(x=>{
    const t=el('div','howtile rectile'+(x.val?'':' is-empty'));
    t.innerHTML=`<b>${x.name}</b><em>${x.val||'chưa có'}</em><small>${x.sub}</small>`;
    grid.appendChild(t);
  });
}
/* Tab CÁCH CHƠI: danh sách mục, không có ảnh — đây là chỗ tra luật, không phải chỗ ngắm */
function renderHowtoGrid(grid){
  $('#archCount').textContent=`${HOWTO.length} MỤC · KHÔNG CẦN MỞ KHOÁ`;
  HOWTO.forEach(h=>{
    const t=el('button','howtile', `<b>${h.name}</b><small>${h.sub||''}</small>`);
    t.addEventListener('click',()=>openHowto(h.id));
    grid.appendChild(t);
  });
}
function openCodex(g, it){
  const box=$('#codex'); box.className='lore lore--codex '+(it.faction==='rust'?'lore--rust':'lore--chrome');
  const pic=codexPic(it); $('#codexArt').replaceWith(pic); pic.id='codexArt';
  $('#codexTags').textContent=g.label;
  $('#codexName').textContent=it.name; $('#codexSub').textContent=it.sub||'';
  const body=$('#codexBody');
  const lbl = it.en && it.en.toUpperCase()!==it.name.toUpperCase() ? it.en : g.label;   // tên EN trùng tên Việt (HALO, CHOIR) thì khỏi lặp
  body.innerHTML=`${it.voice?`<div class="lore__sec"><p class="voice">${it.voice}</p></div>`:''}
    <div class="lore__sec"><span class="lbl">${lbl}</span><p>${it.text}</p></div>
    ${it.spot?`<div class="lore__sec"><span class="lbl">NHẬN DIỆN</span><p>${it.spot}</p></div>`:''}
    ${it.ult?`<div class="lore__ult"><b>TUYỆT KỸ · ${it.ult.name}</b><span>${it.ult.desc}</span></div>`:''}
    ${it.where?`<div class="lore__pills"><span class="pill"><small>GẶP Ở</small>${it.where}</span></div>`:''}`;
  body.scrollTop=0; box.hidden=false; sfx('open',.17);
}
$('#codexClose').addEventListener('click',()=>{ $('#codex').hidden=true; });

/* =====================================================================
   CÁCH CHƠI — overlay tra cứu (chữ ở HOWTO trong js/data.js, kế hoạch ở docs/ui-nguoi-moi.md §C4)
   Là OVERLAY chứ không phải một màn: mở giữa trận cũng được, vì nó không đụng data-screen nên
   không huỷ trận đang đánh (go() đặt B.gen++ và dọn mọi việc đang chờ khi rời màn battle).
   ===================================================================== */
function openHowto(id){
  const box=$('#howto'); if(!box || typeof HOWTO==='undefined') return;
  const cur=howtoById(id);
  const tabs=$('#howTabs'); tabs.innerHTML='';
  HOWTO.forEach(h=>{
    const b=el('button','lore__tab'+(h.id===cur.id?' is-on':''), h.name);
    b.addEventListener('click',()=>openHowto(h.id));
    tabs.appendChild(b);
  });
  $('#howSub').textContent=cur.sub||'';
  $('#howBody').innerHTML=`<p>${cur.text}</p>`;
  $('#howBody').scrollTop=0;
  box.hidden=false; sfx('open',.17);
  const on=tabs.querySelector('.is-on'); if(on && on.scrollIntoView) on.scrollIntoView({block:'nearest', inline:'center'});
}
{ const box=$('#howto');
  $('#howClose').addEventListener('click',()=>{ box.hidden=true; });
  box.addEventListener('click', e=>{ if(e.target===box) box.hidden=true; });   // chạm nền cũng đóng
  [['btnHowBattle','battle'],['btnHowSquad','stats'],['btnHowGacha','gacha']].forEach(([id,sec])=>{
    const b=$('#'+id); if(b) b.addEventListener('click', e=>{ e.stopPropagation(); openHowto(sec); });
  });
  const w=$('#walletChips'); if(w) w.addEventListener('click',()=>openHowto('money'));
  /* Chạm vào cụm chỉ số trên BẤT KỲ thẻ nhân vật nào → mục CHỈ SỐ. Bắt ở pha capture để cú chạm
     không bị thẻ nuốt mất thành "chọn người vào đội". */
  document.addEventListener('click', e=>{
    const s=e.target.closest && e.target.closest('.card__stats'); if(!s) return;
    e.stopPropagation(); e.preventDefault(); openHowto('stats');
  }, true);
}

/* ---- Chỉ dẫn lần đầu vào một màn: hai ba câu, một lần cho mỗi hồ sơ (docs/ui-nguoi-moi.md §C5).
   Dùng chung sổ `PLAYER.hintsSeen` với hint trong trận nên RESET TIẾN TRÌNH cũng xoá luôn. ---- */
const TIPS = {
  squad:   'Đội ra trận 3 người. Chạm vào thẻ bên dưới để đưa vào đội hoặc bỏ ra. Ai đang giữ bãi ở DẸP LOẠN thì không ra trận được — đổi ở màn bãi.',
  map:     'Chạm vào khu vực đang sáng để xem danh sách màn của khu đó. Khu mờ là chương chưa mở.',
  sector:  'Mỗi màn có vài đợt địch liên tiếp. Thắng lần đầu được thưởng đầy, đánh lại chỉ còn 25% — muốn cày nhanh thì bấm QUÉT.',
  gacha:   'Quay bằng SH để lấy người mới. Trúng người đã có thì thành bản dư, đem sang CẤY GHÉP phân tách lấy LK. Thanh PITY đầy là lượt sau chắc chắn ra bậc cao.',
  cyber:   'Mỗi nhân vật có 6 ô, mỗi ô một thang 10 bậc, nâng bằng LK và CR. Thang chỉ đi lên: không tháo, không hoàn.',
  riotmap: 'Chiếm một cái bãi rồi để người ở lại giữ thì bãi đẻ kiện hàng theo giờ, kể cả lúc bạn không chơi. Người giữ bãi thì không ra trận được.',
  archive: 'Hồ sơ nhân vật, sổ bộ kẻ địch, địa danh, thuật ngữ, truyện đã đọc — và tab CÁCH CHƠI nếu cần tra luật.',
};
const TIP_HOW = { squad:'stats', map:'loop', sector:'battle', gacha:'gacha', cyber:'meta', riotmap:'meta', archive:'loop' };
function firstTimeTip(screen){
  const t=TIPS[screen], box=$('#tipBox'); if(!t || !box) return;
  const key='tip:'+screen; if(PLAYER.hintsSeen.includes(key)) return;
  PLAYER.hintsSeen.push(key); savePlayer();
  $('#tipText').textContent=t;
  $('#tipHow').onclick=()=>{ box.hidden=true; openHowto(TIP_HOW[screen]||'loop'); };
  box.hidden=false; sfx('open',.17);
}
$('#tipOk').addEventListener('click',()=>{ $('#tipBox').hidden=true; });
const LORE_TAB = { cur:'skill' };
/* Dòng dưới nút CYBERWARE trong hồ sơ — guard typeof vì kit.html không nạp js/cyber.js */
function cyberBtnTxt(id){
  if(typeof cyberProgress!=='function') return '6 ô trang bị';
  const p=cyberProgress(id), lk=PLAYER.parts.toLocaleString('en-US');
  return `${p.now}/${p.max} BẬC${cyberNoFit(id)?' · THÉP TRẦN':''} · ${lk} LK`;
}
const fxText = e => [ e.atkPct&&`${e.atkPct>0?'+':''}${e.atkPct}% ATK`, e.hpPct&&`${e.hpPct>0?'+':''}${e.hpPct}% HP`, e.energyStart&&`VÀO TRẬN ${e.energyStart} EN`,
  e.dmgPct&&`${e.dmgPct>0?'+':''}${e.dmgPct}% SÁT THƯƠNG`, e.dmgTakenPct&&`${e.dmgTakenPct}% SÁT THƯƠNG NHẬN`, e.critPct&&`+${e.critPct}% CRIT`, e.energyGainPct&&`+${e.energyGainPct}% ENERGY` ].filter(Boolean).join(' · ');
/* Điều kiện passive → nhãn, chân dung, trạng thái hiện tại */
function passiveInfo(p){
  const w=p.when||{};
  if(w.ally||w.allyAny){ const ids=w.ally?[w.ally]:w.allyAny; const d=ROSTER[ids[0]];
    const inTeam=ids.some(id=>TEAM.includes(id)), own=ids.some(owns);
    return { def:d, cond:`CÙNG ĐỘI · ${ids.map(i=>ROSTER[i].name).join(' / ')}`, state: inTeam?'ĐANG BẬT':own?'NGOÀI ĐỘI':'CHƯA CÓ '+d.name, cls: inTeam?'is-active':own?'':'is-locked' }; }
  if(w.enemy){ const e=ENEMY_POOL.find(x=>x.id===w.enemy)||{name:w.enemy,faction:'rust'}; const secs=SECTORS.filter(s=>(s.plan||[]).flat().includes(w.enemy)).map(s=>s.id);
    return { def:speakerDef(w.enemy)||{name:e.name,faction:e.faction,portrait:[]}, cond:`ĐỐI ĐẦU · ${e.name}`, state: secs.length?'SECTOR '+secs.join(' · '):'CHƯA GẶP', cls:'' }; }
  if(w.enemyFaction){ const secs=SECTORS.filter(s=>(s.plan||[]).flat().some(id=>{ const e=ENEMY_POOL.find(x=>x.id===id); return e&&e.faction===w.enemyFaction; })).map(s=>s.id);
    return { def:{name:'',faction:w.enemyFaction,portrait:[]}, cond:`ĐỊCH PHE ${w.enemyFaction.toUpperCase()}`, state: secs.length?'SECTOR '+secs.join(' · '):'CHƯA GẶP', cls:'' }; }
  return { def:null, cond:'LUÔN BẬT', state:'ĐANG BẬT', cls:'is-active' };
}
/* ---- Khối ĐỘT PHÁ trong hồ sơ nhân vật (docs/dot-pha.md) ----
   Bốn ô sao: đã đạt thì sáng và ghi thưởng, chưa tới thì mờ và ghi điều kiện. Nút dưới cùng nói rõ
   PHẢI TRẢ GÌ — bản dư của chính người đó (rẻ) hoặc LINH KIỆN (luôn có, cho Yuki/Psalm không vào bể quay).
   Guard typeof vì kit.html không nạp state.js. */
function ascBlock(id){
  if(typeof ASCEND==='undefined' || typeof ascStars!=='function') return '';
  const n=ascStars(id), m=ascNext(id), L1=lvl(id);
  const cells = ASCEND.map(s=>{
    const got=s.star<=n, cur=m&&m.star===s.star;
    return `<div class="asc__cell${got?' is-on':''}${cur?' is-next':''}"><b>${'★'.repeat(s.star)}</b><small>LV ${s.lv}</small><em>${s.label}</em></div>`;
  }).join('');
  let btn='';
  if(m){
    const why=ascWhy(id), pay=ascPayWith(id), have=dupesOf(id);
    const priceTxt = `${m.cr.toLocaleString('en-US')} CR + ` + (pay==='dupes' ? `${m.dupes} bản dư` : `${m.lk} LK`);
    const txt = why==='level' ? `Cần lên cấp ${m.lv} trước (đang ${L1})`
              : why==='cr'    ? `Thiếu CR · cần ${m.cr.toLocaleString('en-US')}`
              : why==='pay'   ? `Cần ${m.dupes} bản dư ${ROSTER[id].name} (đang có ${have}) hoặc ${m.lk} LK`
              : `${priceTxt} → ${m.label}`;
    btn = `<button class="btn-act btn-act--go asc__go" id="loreAsc" ${why==='ok'?'':'disabled'}>
      <span class="btn-act__k">Đột phá ★${m.star}</span><span class="btn-act__v">${txt}</span></button>`;
  } else {
    btn = `<div class="asc__max">ĐỦ BỐN SAO · đã chạm đỉnh của thang cấp</div>`;
  }
  return `<div class="asc"><div class="asc__hd"><b>ĐỘT PHÁ</b><small>${n}/4 sao · trần cấp hiện tại ${ascCap(id)}</small></div>
    <div class="asc__grid">${cells}</div>${btn}</div>`;
}
/* Trang hồ sơ — dùng chung cho 19 nhân vật (tab NHÂN VẬT) và 21 kẻ địch (tab SỔ BỘ), xem
   docs/archive-merge.md. Ba mức, quyết bởi việc đơn vị này có def chơi được và đã sở hữu chưa:
     đã sở hữu          KỸ NĂNG · PASSIVE · HỒ SƠ  (đầy đủ, có nút Upgrade)
     chưa sở hữu        chỉ HỒ SƠ — chữ vẫn đọc được, số thì chưa
     không có ROSTER    chỉ HỒ SƠ (mỗi Cantor: sống sang chương 2–3 nên không chiêu mộ được)
   Chữ lấy LORE trước, không có thì FOE_LORE (sinh từ CODEX, xem js/data.js). */
function openLore(id){
  const d = ROSTER[id] || ENEMY_POOL.find(e=>e.id===id); if(!d) return;
  const L = LORE[id] || FOE_LORE[id] || {};
  const kit = !!(ROSTER[id] && owns(id));             // có dựng hai pane số hay không
  const foeOnly = !ROSTER[id];                        // có def chơi được không (Cantor thì không)
  const box=$('#lore'); box.className='lore '+(d.faction==='rust'?'lore--rust':'lore--chrome');
  const art=portraitEl(d); $('#loreArt').replaceWith(art); art.id='loreArt';
  const ultName = (d.ult && d.ult.name) || L.ultName || '';
  $('#loreTags').textContent = [d.faction.toUpperCase(), d.tier&&`TIER ${d.tier}`, ultName].filter(Boolean).join(' · ');
  $('#loreName').textContent=d.name; $('#loreEpithet').textContent=L.epithet||'';
  /* Khối TUYỆT KỸ chỉ in trong HỒ SƠ khi KHÔNG có pane KỸ NĂNG — có pane thì nó đã nằm ở đó rồi,
     in cả hai chỗ là đọc hai lần cùng một đoạn. Thiếu nhánh này thì con ĐÃ HẠ mà chưa chiêu mộ
     mất luôn phần mô tả chiêu cuối, trong khi tab SỔ BỘ cũ vẫn cho xem. */
  const ultBlock = !kit && ultName && (L.ultFlavor || (d.ult&&d.ult.desc))
    ? `<div class="lore__ult"><b>TUYỆT KỸ · ${ultName}</b><span>${L.ultFlavor || d.ult.desc}</span></div>` : '';
  /* Vì sao chưa mở được đủ trang — nói thẳng, đừng để người chơi tưởng hỏng. Ba trạng thái khác nhau,
     đừng gộp: bảo người đã hạ Foreman là "hãy đi hạ Foreman" thì họ biết ngay mình đang đọc chữ bịa. */
  const gateTxt = foeOnly
    ? `<p class="lore__empty">Không chiêu mộ được: ${d.name} còn sống sang chương sau.</p>`
    : kit ? ''
    : beaten(id) ? `<p class="lore__empty">Đã hạ — ${d.name} đang nằm trong bể, quay ở REQUISITION là có.</p>`
                 : `<p class="lore__empty">Chưa hạ. Đánh bại ${d.name} ngoài trận thì ${d.name} vào bể REQUISITION.</p>`;
  let skillHtml='', tabsHtml='';
  if(kit){
    const st=unitStats(id), L1=lvl(id), sk=d.skill||{};   // cùng hàm với thẻ nhân vật và lúc vào trận
    const gated = typeof ascCap==='function' && L1>=ascCap(id) && L1<UPGRADE.maxLevel;   // chạm trần tạm, phải đột phá
    const upTxt = L1>=UPGRADE.maxLevel ? 'MAX' : gated ? `CẦN ĐỘT PHÁ ★${ascStars(id)+1}` : `LV ${L1+1} · ${UPGRADE.cost(L1).toLocaleString('en-US')} CR`;
    const kindTxt = d.ult.kind==='control'?'ĐIỀU KHIỂN':d.ult.kind==='heal'?'HỒI MÁU':d.ult.kind==='aoe'?'TOÀN BỘ ĐỊCH':'MỘT MỤC TIÊU';
    tabsHtml = `<div class="lore__tabs"><button class="lore__tab" data-tab="skill">Kỹ năng</button><button class="lore__tab" data-tab="passive">Passive</button><button class="lore__tab" data-tab="lore">Hồ sơ</button></div>`;
    skillHtml = `
    <div class="lore__pane lore__pane--skill">
      <div class="lore__stats"><span class="pill"><small>LV</small>${L1}</span><span class="pill"><small>ATK</small>${st.atk}</span><span class="pill"><small>HP</small>${st.hp}</span><span class="pill"><small>EN</small>${d.energyMax}</span><span class="pill"><small>SPD</small>${st.spd}</span><span class="pill"><small>CRIT</small>${st.crit+(sk.critPct||0)}%</span>
        <button class="btn-act btn-act--go lore__up" id="loreUp" ${L1>=UPGRADE.maxLevel||gated||PLAYER.credits<UPGRADE.cost(L1)?'disabled':''}><span class="btn-act__k">Nâng cấp</span><span class="btn-act__v">${upTxt}${L1>=UPGRADE.maxLevel||gated?'':` · +${Math.round(UPGRADE.statPerLevel*100)}% ATK/HP`}</span></button>
        <button class="btn-act lore__up" id="loreCyber"><span class="btn-act__k">Cấy ghép</span><span class="btn-act__v">${cyberBtnTxt(id)}</span></button></div>
      ${ascBlock(id)}
      ${L.weapon?`<div class="lore__ult"><b>VŨ KHÍ</b><span class="lore__flavor">${L.weapon}</span></div>`:''}
      <div class="lore__ult lore__skill"><b>ĐÒN THƯỜNG</b>${L.attack?`<span class="lore__flavor">${L.attack}</span>`:''}<span>${sk.desc||'100% ATK, +25 Energy.'}</span></div>
      <div class="lore__ult"><b>CHIÊU CUỐI · ${d.ult.name}</b>${L.ultFlavor?`<span class="lore__flavor">${L.ultFlavor}</span>`:''}<span>${d.ult.desc}</span><div class="lore__pills"><span class="pill"><small>COST</small>${d.ult.cost} EN</span><span class="pill">${kindTxt}</span>${d.ult.mult?`<span class="pill">${Math.round(d.ult.mult*100)}% ATK</span>`:''}</div></div>
    </div>
    <div class="lore__pane lore__pane--passive"></div>`;
  }
  const body=$('#loreBody'); body.innerHTML=tabsHtml+skillHtml+`
    <div class="lore__pane lore__pane--lore${L.form?' lore__doc lore__doc--'+L.form:''}">
      ${L.voice&&!L.past?`<div class="lore__sec"><p class="voice">${L.voice}</p></div>`:''}
      ${L.profile||!L.past?`<div class="lore__sec"><span class="lbl">Là ai</span><p class="lead">${L.profile||'Chưa có hồ sơ.'}</p></div>`:''}
      ${L.past?`<div class="lore__sec"><span class="lbl">${(L.labels||{}).past||'Chuyện đã xảy ra'}</span><p>${L.past}</p></div>`:''}
      ${L.now?`<div class="lore__sec"><span class="lbl">${(L.labels||{}).now||'Bây giờ'}</span><p>${L.now}</p></div>`:''}
      ${L.voice&&L.past?`<div class="lore__sec"><p class="voice">${L.voice}</p></div>`:''}
      ${ultBlock}
      ${L.where?`<div class="lore__pills"><span class="pill"><small>GẶP Ở</small>${L.where}</span></div>`:''}
      ${gateTxt}
    </div>`;
  const pane=body.querySelector('.lore__pane--passive');
  if(pane){
    if(!(d.passives||[]).length) pane.innerHTML='<p class="lore__empty">Chưa có nội tại.</p>';
    (d.passives||[]).forEach(p=>{
      const info=passiveInfo(p); const r=el('div',`pas ${info.cls}`);
      const pic=el('div','pas__pic'); if(info.def) pic.appendChild(portraitEl(info.def)); r.appendChild(pic);
      r.insertAdjacentHTML('beforeend',`<div class="pas__body"><b class="pas__name">${p.name}</b><span class="pas__cond">${info.cond}</span><span class="pas__fx">${fxText(p.effect||{})}</span><p class="pas__desc">${p.desc||''}</p></div><span class="pas__state">${info.state}</span>`);
      pane.appendChild(r);
    });
  }
  body.querySelectorAll('.lore__tab').forEach(b=>b.addEventListener('click',()=>{ LORE_TAB.cur=b.dataset.tab; box.dataset.tab=LORE_TAB.cur; body.querySelectorAll('.lore__tab').forEach(x=>x.classList.toggle('is-on',x===b)); body.scrollTop=0; }));
  /* Không dựng pane số thì phải ÉP về 'lore': LORE_TAB.cur nhớ tab lần trước, còn 'skill' thì
     box[data-tab=skill] ẩn hết mọi pane đang có → trang trắng. */
  box.dataset.tab = kit ? LORE_TAB.cur : 'lore';
  body.querySelectorAll('.lore__tab').forEach(x=>x.classList.toggle('is-on',x.dataset.tab===box.dataset.tab));
  body.scrollTop=0; box.hidden=false;
  const up=$('#loreUp'); if(up) up.addEventListener('click',()=>{ const r=upgrade(id); if(r==='ok'){ AUDIO.upgrade(); renderWallet(); const sc=body.scrollTop; openLore(id); body.scrollTop=sc; } else sfx('error',.4); });
  /* Đột phá: dựng lại cả trang vì nó đổi chỉ số, đổi trần cấp và đổi luôn nút nâng cấp ở trên */
  const asc=$('#loreAsc'); if(asc) asc.addEventListener('click',()=>{
    const r=ascend(id); if(r!=='ok') return sfx('error',.4);
    AUDIO.ready(); AUDIO.upgrade(); renderWallet();
    const sc=body.scrollTop; openLore(id); $('#loreBody').scrollTop=sc;
  });
  const cy=$('#loreCyber'); if(cy) cy.addEventListener('click',()=>{ if(typeof openCyberFor==='function') openCyberFor(id); });
}
$('#loreClose').addEventListener('click',()=>{ $('#lore').hidden=true; });
/* Đổi biệt danh hồ sơ: chạm vào tên ở Lobby */
$('#pName').addEventListener('click',()=>{ const n=prompt('Biệt danh hồ sơ (tối đa 14 ký tự):', PLAYER.name); if(n&&n.trim()){ PLAYER.name=n.trim().slice(0,14).toUpperCase(); savePlayer(); renderWallet(); } });

/* ---- GACHA ---- */
/* MỘT bể REQUISITION, trả SH (gộp 12/09, xem docs/gacha-merge.md). Hai đường vào bể:
   nhân vật mở theo chương · quân chiêu mộ phải đánh bại con đó trong trận trước. */
function renderGacha(){
  renderWallet();
  const b=BANNER, pool=bannerPool(), locked=bannerLocked(), feat=bannerFeatured();
  const have=pool.filter(c=>owns(c.id)).length;
  $('#gShards').textContent=PLAYER[b.cur].toLocaleString('en-US');
  /* Tải sẵn ảnh mở rương (nhẹ, và màn khoe nhân vật cần tới ngay). Video thì KHÔNG nạp ở đây:
     resolveVideo chỉ gửi HEAD nên nạp sẵn cũng vô nghĩa, còn kéo byte của mọi video lúc mở màn là phí băng thông
     cho thứ 97% lượt quay không dùng tới. Byte được nạp trong doPull, khi đã biết chắc thẻ nào cần. */
  if(!renderGacha.pre){ renderGacha.pre=true; Object.values(ROSTER).forEach(d=>{ if(d.reveal) loadFirst(d.reveal); }); }
  const art=$('#gachaArt');
  if(feat && art.dataset.id!==feat.id){ const p=portraitEl(feat); art.replaceWith(p); p.id='gachaArt'; p.dataset.id=feat.id; }
  $('#gachaTag').textContent = feat ? `TỈ LỆ CAO · BẬC ${feat.tier}` : 'BỂ TRỐNG';
  $('#gachaFeat').textContent = feat ? feat.name : '—';
  $('#gRates').innerHTML = ['S','A','B'].map(t=>{
    const n=gachaPool(t,b).length;
    return `<span class="${n?'':'is-empty'}" title="${n} đơn vị trong bể"><b>${t}</b><em>${Math.round(b.rates[t]*100)}%</em></span>`;
  }).join('') + `<span class="grates__pity"><b>PITY</b><em id="gPity">${pityOf(b)}/${b.pityS}</em></span>`;
  /* Thanh pity: mỗi lần trượt phải nhìn thấy được là một bước tiến, không phải một lần mất tiền */
  const p=pityOf(b), left=Math.max(0, b.pityS-p), topTier=gachaPool('S',b).length?'S':gachaPool('A',b).length?'A':'B';
  $('#gPityBar').style.width = Math.min(100, p/b.pityS*100) + '%';
  $('#gPityTxt').innerHTML = left ? `Còn <b>${left}</b> lượt nữa là chắc chắn ra ${topTier}` : `<b>Lượt sau chắc chắn ra ${topTier}</b>`;
  $('#gPityTxt').closest('.gpity').classList.toggle('is-ready', left===0);
  /* Nói thật về bể: đầu game bể chỉ có 4 người, giấu đi thì người chơi quay mãi không hiểu vì sao toàn trùng.
     Từ 12/09 phải nói cả ĐƯỜNG LÀM BỂ TO RA — đánh thêm màn là có thêm quân, đó là lý do quay trượt
     vẫn không phải cụt đường. Số con đang chờ bị hạ lấy từ lưới xám bên dưới. */
  const unbeaten = locked.filter(x=>x.why==='unbeaten').length;
  const full = pool.length && have>=pool.length;
  $('#gNote').innerHTML = !pool.length
    ? `Bể đang trống. Đánh thêm màn để mở quân, rồi quay.`
    : full
      ? `<b>Đã đủ cả ${pool.length} đơn vị đang có trong bể.</b> Quay tiếp chỉ ra bản dư — giữ lại để phân tách lấy linh kiện.`
        + (unbeaten ? ` Hạ thêm kẻ địch thì bể có người mới: còn <b>${unbeaten}</b> con.` : '')
      : `Bể có <b>${pool.length}</b> đơn vị`
        + (unbeaten ? ` · còn <b>${unbeaten}</b> kẻ địch vào bể khi bị hạ ngoài trận` : '')
        + ` · 50% số lần ra bậc của người rate-up là chính họ · ×10 chắc chắn ≥1 A · trùng thành <b>bản dư</b>, không hoàn ${b.curLabel}`;
  $('#gOwned').parentElement.innerHTML=`Đã có <b id="gOwned">${have}</b>/${pool.length} · Đã quay <b id="gPulls">${PLAYER.pulls}</b> lượt`;
  const canPull = pool.length>0;
  $('#btnPull1').disabled = !canPull || PLAYER[b.cur]<b.cost1;
  $('#btnPull10').disabled= !canPull || PLAYER[b.cur]<b.cost10;
  $('#btnPull1').querySelector('.btn-act__v').textContent=`${b.cost1.toLocaleString('en-US')} ${b.curLabel}`;
  $('#btnPull10').querySelector('.btn-act__v').textContent=`${b.cost10.toLocaleString('en-US')} ${b.curLabel} · ≥1 A`;
  renderLockedPool(locked);
}
/* Thẻ xám cho đơn vị chưa vào bể. Đầu game bể chỉ có 4 người nên phải cho thấy 33 đơn vị còn lại đang
   chờ ở đâu — đó là lý do để dành SH thay vì tưởng game hết nội dung.
   HAI NHÓM, thứ tự có ý: nhóm CHƯA ĐÁNH BẠI đứng TRƯỚC vì nó là việc người chơi làm được ngay hôm nay
   (đi đánh màn đó), còn nhóm chương là việc phải chờ bản mới. Mỗi con ghi luôn màn gặp được.
   locked = [{def, why}] từ bannerLocked(). */
function renderLockedPool(locked){
  const box=$('#gLocked'), grid=$('#gLockedGrid');
  if(!locked.length){ box.hidden=true; return; }
  box.hidden=false;
  const unbeaten = locked.filter(x=>x.why==='unbeaten').map(x=>x.def);
  const byCh = locked.filter(x=>x.why==='chapter').reduce((m,x)=>{ const k=x.def.debut==null?'?':x.def.debut; (m[k]=m[k]||[]).push(x.def); return m; },{});
  $('#gLockedSub').textContent = [ unbeaten.length?`${unbeaten.length} chờ bị hạ`:'', Object.keys(byCh).length?`${locked.length-unbeaten.length} chờ chương`:'' ].filter(Boolean).join(' · ');
  const unit = c => `<span class="glocked__u t-${c.tier}"><b>${c.name}</b><em>${c.tier}</em></span>`;
  /* Nhóm con chưa hạ theo MÀN gặp được, không theo chương: người chơi cần biết đi đâu mà hạ.
     Chỉ gặp ở DẸP LOẠN (không có trong SECTORS[].plan) → gom vào nhóm cuối. */
  const bySec = unbeaten.reduce((m,c)=>{ const k=foeSector(c.id)||'DẸP LOẠN'; (m[k]=m[k]||[]).push(c); return m; },{});
  const rows = [];
  Object.keys(bySec).sort().forEach(k=>{
    rows.push(`<div class="glocked__row"><span class="glocked__ch glocked__ch--foe">HẠ Ở ${k}</span>${bySec[k].map(unit).join('')}</div>`);
  });
  Object.keys(byCh).sort().forEach(k=>{
    rows.push(`<div class="glocked__row"><span class="glocked__ch">${k==='?'?'CHƯA XẾP CHƯƠNG':'CHƯƠNG '+k}</span>${byCh[k].map(unit).join('')}</div>`);
  });
  grid.innerHTML=rows.join('');
}
/* Mặt thẻ khi quay ra: ảnh mở rương (<id>_reveal.jpg, 16:9, nhân vật đứng giữa) nếu có, không thì chân dung thường */
const revealDef = d => d.reveal ? {...d, portrait:d.reveal, pos:d.revealPos||'50% 50%'} : d;
/* Video mở rương (hiện chỉ Yuki): phát trong hộp .cutin của màn gacha, xong mới lật thẻ.
   Chỉ chạy khi CONFIG bật — người chơi quay tới lần thứ hai mươi phải có đường tắt. */
async function playRevealVideo(d){
  if(!revealVideoOn()) return;
  const src=await resolveVideo(d.revealVideo); if(!src) return;
  await playVideoBox($('#revealCutin'), src, `REQUISITION · TIER ${d.tier}`, d.name, d.faction==='rust'?'var(--rust)':'var(--chrome)');
}
/* Có phát video cho thẻ này không: bật trong CONFIG · con đó có video · và ĐANG LÀ LẦN ĐẦU sở hữu.
   Trùng thì bỏ qua video, đi thẳng vào màn khoe — cái video thứ tư của cùng một người không còn là phần thưởng. */
const wantsRevealVideo = (d, r) => !!(d.revealVideo && r && r.isNew && revealVideoOn());
/* =====================================================================
   MỞ THẺ — nhịp hồi hộp (viết lại 11/09)
   Bản cũ tiêu sạch hồi hộp trước khi bắt đầu: css tô sẵn màu bậc lên MẶT ÚP (.rv.t-S/.t-A) và thời gian chờ
   khác nhau theo bậc (520ms cho S, 170ms cho phần còn lại) → nhìn lưới 10 thẻ úp là biết hết kết quả.
   Bản mới giấu kết quả tới sát lúc lật, rồi trả ra làm ba nhịp, có kèm "nâng hụt".
   ===================================================================== */
const TIER_RANK = { B:0, A:1, S:2 };
const NEAR_MISS = .28;                                  // xác suất một thẻ B nâng lên bậc A rồi tụt lại
/* Rung máy: kênh cảm giác mạnh nhất trên điện thoại mà rẻ nhất. Máy không hỗ trợ thì bỏ qua. */
const buzz = p => { try{ if(!reduced() && navigator.vibrate) navigator.vibrate(p); }catch(e){} };

/* Ba nhịp trước khi lật một thẻ: quầng nền → nâng bậc → đỉnh.
   Thẻ B cũng có cửa nâng hụt, nên "nâng lên xanh" không còn đồng nghĩa với "chắc có hàng".
   Thời gian cố ý bằng nhau giữa B-hụt (260+240) và A (260+240) → đồng hồ cũng không rò kết quả. */
async function tellCard(c, tier){
  const T = reduced() ? 0 : 1;
  AUDIO.tell(); c.classList.add('is-tell');
  await wait(260*T);
  if(tier==='B'){
    if(Math.random() < NEAR_MISS){
      AUDIO.tell_up(); c.classList.add('tell-up'); buzz(12);
      await wait(240*T);
      c.classList.remove('tell-up'); c.classList.add('tell-down'); AUDIO.tell_down();
    }
    return;
  }
  AUDIO.tell_up(); c.classList.add('tell-up'); buzz(tier==='S'?18:12);
  await wait(240*T);
  if(tier==='S'){ AUDIO.reveal_s(); c.classList.add('tell-max'); buzz([30,40,70]); await wait(240*T); }   // tiếng đi trước hình một nhịp
}
/* Màn khoe nhân vật: art mở rương (<id>_reveal.jpg, thiếu thì rơi về art thẻ) phủ gần kín ô lưới,
   TÊN + BIỆT DANH (LORE[id].epithet) đè lên góc dưới trái. Dùng cho mọi lượt ×1 và cho thẻ S trong loạt ×10 —
   đây cũng là khoảnh khắc riêng của 17 nhân vật chưa có video mở rương. */
async function showHero(d, r){
  const box=$('#rvHero'); if(!box) return;
  const src=await loadFirst((d.reveal||[]).concat(d.portrait||[]));
  if(src) box.querySelector('.rvhero__img').src=src;
  box.style.setProperty('--fac', d.faction==='rust'?'var(--rust)':'var(--chrome)');
  $('#rvHeroTier').textContent=d.tier;
  $('#rvHeroName').textContent=d.name;
  $('#rvHeroEpi').textContent=(typeof LORE!=='undefined' && LORE[d.id] && LORE[d.id].epithet) || '';
  $('#rvHeroBadge').hidden = !(r && r.isNew);
  box.className='rvhero t-'+d.tier; box.hidden=false;
  void box.offsetWidth; box.classList.add('is-on');
  await wait(reduced()?60:900);
}
function hideHero(){ const b=$('#rvHero'); if(!b) return; b.classList.remove('is-on'); b.hidden=true; }
/* Câu nói của nhân vật vừa lật — chữ lấy thẳng từ LORE, không cần asset mới */
function revealSay(box, d){
  const v = (typeof LORE!=='undefined' && LORE[d.id] && LORE[d.id].voice) || '';
  if(!v) return;
  box.style.setProperty('--fac', d.faction==='rust'?'var(--rust)':'var(--chrome)');
  box.innerHTML=`<b>${d.name}</b><i>${v}</i>`;   // LORE.voice đã có sẵn dấu ngoặc kép, đừng bọc thêm
  box.classList.remove('is-on'); void box.offsetWidth; box.classList.add('is-on');
}
/* Trùng nhân vật: cho một mảnh bay từ thẻ về ô đếm, để "trùng" là được thêm chứ không phải hụt.
   Trước 11/09 mảnh này là số SH hoàn lại; giờ trùng giữ nguyên bản dư nên mảnh chỉ còn là dấu cộng. */
const flyDupe = (from, to) => flyShard(from, to, '+1');
function flyShard(from, to, amount){
  if(reduced()) return;
  const a=from.getBoundingClientRect(), b=to.getBoundingClientRect();
  if(!a.width || !b.width) return;
  const s=el('span','shfly'); s.textContent=String(amount);
  s.style.left=(a.left+a.width/2)+'px'; s.style.top=(a.top+a.height/2)+'px';
  document.body.appendChild(s);
  const dx=(b.left+b.width/2)-(a.left+a.width/2), dy=(b.top+b.height/2)-(a.top+a.height/2);
  s.animate([{ transform:'translate(-50%,-50%) scale(1.35)', opacity:1 },
             { transform:`translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(.75)`, opacity:0 }],
            { duration:620, easing:'cubic-bezier(.4,0,.2,1)' }).onfinish=()=>s.remove();
}

async function doPull(n){
  const b=BANNER;
  const res=pull(n); if(!res){ sfx('error',.4); return; }
  dailyProgress('pull'); renderWallet();      // ★ chỉ cập nhật ví: gọi renderGacha() ở đây sẽ tụt thanh pity về 0 và lộ ngay là có S
  $('#gShards').textContent=PLAYER[b.cur].toLocaleString('en-US');
  res.sort((a,b)=> TIER_RANK[a.tier]-TIER_RANK[b.tier]);   // hiếm nhất ra cuối: loạt ×10 thành đường dốc lên
  /* Nạp trước byte video ngay khi biết kết quả. Nhịp tell + lật thẻ phía sau cho 1–8 giây nạp,
     đủ để lúc cần phát thì đã có sẵn thay vì đứng chờ buffer giữa khoảnh khắc quan trọng nhất. */
  res.forEach(r=>{ const d=ROSTER[r.id]; if(wantsRevealVideo(d,r)) warmVideo(d.revealVideo); });
  const box=$('#reveal'), grid=$('#revealGrid'), say=$('#revealSay'), shChip=$('#revealSh');
  grid.innerHTML=''; grid.classList.toggle('n1', n===1); box.classList.toggle('n1', n===1);
  hideHero(); say.className='reveal__say'; say.innerHTML='';
  shChip.className='reveal__sh'; shChip.textContent='';
  $('#btnRevealDone').hidden=true; $('#btnRevealSkip').hidden=false; box.hidden=false;
  const cards=res.map(r=>{
    const d=ROSTER[r.id]; const w=el('div',`rv t-${r.tier}`);
    w.style.setProperty('--fac', d.faction==='rust'?'var(--rust)':'var(--chrome)');
    // Trùng không còn hoàn SH — giữ lại thành bản dư, đếm tổng số bản đang có ("DƯ ×2" = đang giữ 2 bản)
    w.innerHTML=`<div class="rv__in"><div class="rv__face rv__back"></div><div class="rv__face rv__front"></div></div><span class="rv__new">NEW</span><span class="rv__dupe">${r.isNew?'':'DƯ ×'+r.copies}</span>`;
    const c=cardEl(revealDef(d),''); c.draggable=false; w.querySelector('.rv__front').appendChild(c);
    if(!r.isNew) w.querySelector('.rv__new').remove();
    grid.appendChild(w); return w;
  });
  const nDupe = res.filter(r=>!r.isNew).length;
  const dupeTxt = () => `${nDupe} BẢN DƯ · để phân tách`;
  let skipped=false, shownDupe=0;
  const lastRes = res[res.length-1];
  $('#btnRevealSkip').onclick=()=>{
    skipped=true; stopVideoBox($('#revealCutin'));
    cards.forEach(c=>{ c.classList.remove('is-tell','tell-up','tell-max','tell-down'); c.classList.add('is-open'); });
    if(nDupe){ shChip.textContent=dupeTxt(); shChip.classList.add('is-on'); }
    revealSay(say, ROSTER[lastRes.id]);
    if(n===1) showHero(ROSTER[lastRes.id], lastRes);   // ×1: bỏ qua nhịp hồi hộp nhưng vẫn phải thấy nhân vật
  };
  /* Nhịp mở loạt ×10: một vệt sáng quét qua lưới. Cố ý dùng màu trung tính — ×10 nào cũng chắc chắn có ≥1 A
     (GACHA.tenGuaranteeA) nên quét theo bậc thì lần nào cũng như lần nào, mà quét màu S thì lộ luôn trong loạt có S.
     Muốn đổi sang kiểu "báo trước trong loạt có hàng S" thì đặt --hint theo res[res.length-1].tier. */
  if(n>1 && !reduced()){
    grid.style.setProperty('--hint','var(--energy)');
    grid.classList.remove('is-sweep'); void grid.offsetWidth; grid.classList.add('is-sweep');
    AUDIO.tell(); await wait(560);
  }
  for(const [i,r] of res.entries()){
    if(skipped) break;
    const c=cards[i], d=ROSTER[r.id];
    await tellCard(c, r.tier); if(skipped) break;
    if(wantsRevealVideo(d,r)) await playRevealVideo(d);   // video mở rương chạy trước, xong mới lật thẻ
    if(skipped) break;
    c.classList.remove('is-tell','tell-up','tell-down','tell-max');
    c.classList.add('is-open');
    if(r.tier==='A') AUDIO.reveal_a(); else if(r.tier!=='S') sfx('cursor',.08);
    if(r.isNew){ AUDIO.new_char(); buzz(14); }
    if(!r.isNew){ shownDupe++; shChip.textContent=`${shownDupe} BẢN DƯ · để phân tách`; shChip.classList.add('is-on'); flyDupe(c, shChip); }
    if(n===1 || r.tier==='S' || i===res.length-1) revealSay(say, d);
    /* ×1 thì lần nào cũng khoe (người chơi bỏ tiền ra để nhìn một người). ×10 thì chỉ bậc S mới được — hiếm mới quý. */
    if(n===1) await showHero(d, r);
    else if(r.tier==='S'){ await showHero(d, r); await wait(900); hideHero(); }
    await wait(reduced()?40:(r.tier==='S'?300:150));
  }
  grid.classList.remove('is-sweep');
  await wait(reduced()?100:500);
  $('#btnRevealSkip').hidden=true; $('#btnRevealDone').hidden=false;
  $('#btnRevealDone').onclick=()=>{ box.hidden=true; hideHero(); say.classList.remove('is-on'); renderGacha(); };
}
$('#btnPull1').addEventListener('click',()=>doPull(1));
$('#btnPull10').addEventListener('click',()=>doPull(10));
// ★ DEV: nạp SH — bể gộp chỉ còn một loại tiền
$('#btnRefill').addEventListener('click',()=>{ PLAYER.shards+=1000; savePlayer(); renderGacha(); });

/* =====================================================================
   DẸP LOẠN — danh sách tầng. Không có màn mới trong trận: chọn tầng → gán SECTOR = riotSector(n) → go('battle').
   Dùng lại .slist/.srow của màn chọn sector nên không phải thêm kiểu mới cho danh sách.
   ===================================================================== */
const RIOTV = { tier:0 };   // 0 = chưa chọn → renderRiot chọn tầng đang mở
function renderRiot(){
  const list=$('#riotList'); list.innerHTML='';
  const best=PLAYER.riot.best, open=PLAYER.riot.tier;
  $('#riotBest').textContent = best ? 'TẦNG '+best : 'CHƯA THẮNG TẦNG NÀO';
  $('#riotOpen').textContent = 'TẦNG '+open;
  if(!riotUnlocked()){
    $('#riotSub').textContent='KHOÁ · CẦN XONG '+RIOT.unlock;
    list.innerHTML=`<div class="srow is-locked srow--soon"><span class="srow__id">—</span><span><div class="srow__name">CHƯA MỞ</div><div class="srow__meta">Xong màn ${RIOT.unlock} rồi quay lại. Dẹp loạn là chỗ cày SH vô hạn — và là chỗ hạ thêm quân để mở bể.</div></span></div>`;
    $('#btnRiotGo').disabled=true; $('#riotMeta').textContent='CẦN XONG '+RIOT.unlock;
    syncSweepBtn($('#btnRiotSweep'), $('#riotSweepMeta'), null); return;
  }
  $('#riotSub').textContent='KHU ĐÁY · XUNG ĐỘT TỰ PHÁT';
  // Hiện tầng đang mở + 4 tầng đã qua gần nhất (đủ để chọn chỗ cày, không đổ ra 40 dòng)
  const from=Math.max(1, open-4);
  // Mặc định trỏ vào tầng đang mở; kẹp trong khoảng đang hiện để nút dưới không nói về một dòng không có trên màn
  if(RIOTV.tier<from || RIOTV.tier>open) RIOTV.tier=open;
  for(let n=from; n<=open; n++){
    const s=riotSector(n), done=n<=best, isBoss=!!s.boss;
    const r=el('button',`srow is-${done?'cleared':'open'} ${n===RIOTV.tier?'is-selected':''} ${isBoss?'srow--boss':''}`);
    const rw=done ? `DỌN LẠI +${Math.round(s.reward.credits*RIOT.replayPct)} CR` : `+${s.reward.credits} CR · +${s.reward.shards} SH`;
    r.innerHTML=`<span class="srow__id">${String(n).padStart(2,'0')}</span>
      <span><div class="srow__name">TẦNG ${n}${isBoss?' · TRÙM':''}</div>
      <div class="srow__meta">${s.waves} đợt địch · độ khó ×${s.mult} · nên có ATK ${s.rec}+${isBoss?' · '+ENEMY_POOL.find(e=>e.id===s.boss).name:''}</div>
      <div class="srow__waves">${Array.from({length:s.waves},(_,i)=>`<i class="${isBoss&&i===s.waves-1?'boss':''} ${done?'done':''}"></i>`).join('')}<span class="srow__rw">${rw}</span></div></span>
      <span class="srow__state">${done?'XONG':'MỚI'}</span>`;
    r.addEventListener('click',()=>{ RIOTV.tier=n; renderRiot(); });
    list.appendChild(r);
  }
  const s=riotSector(RIOTV.tier);
  $('#btnRiotGo').disabled=false;
  $('#riotMeta').textContent=`TẦNG ${RIOTV.tier} · ${s.waves} đợt địch · độ khó ×${s.mult}`;
  syncSweepBtn($('#btnRiotSweep'), $('#riotSweepMeta'), s);   // quét tầng đang chọn
}
/* Vào trận: gán SECTOR bằng object hình dạng sector của tầng đang chọn. go('battle') lo phần còn lại. */
$('#btnRiotGo').addEventListener('click',()=>{ if(riotUnlocked()) SECTOR = riotSector(RIOTV.tier); });
if(new URLSearchParams(location.search).has('dev')) $('#btnRefill').hidden=false;   // K6: nút DEV chỉ hiện khi URL có ?dev

/* ---- COMMS (BONDS): hội thoại ngắn kiểu visual novel, gõ chữ 18ms/ký tự, chạm để hiện hết rồi sang câu kế ---- */
function playStory(lines, sector){
  return new Promise(res=>{
    const box=$('#story'), spk=$('#storySpk'), name=$('#storyName'), txt=$('#storyText'), dlg=$('#storyBox');
    let bg=box.querySelector('.story__bg'); if(!bg){ bg=el('div','story__bg'); box.prepend(bg); }
    bg.style.setProperty('--bgimg','none'); applyBg(bg, sector);
    $('#storyWhere').textContent=`${sector.id} · ${sector.name}`;
    box.hidden=false; let i=0, timer=null, typing=false, done=false;
    const end=()=>{ if(done) return; done=true; clearTimeout(timer); box.hidden=true; dlg.onclick=null; $('#storySkip').onclick=null; res(); };
    const vars={}; let finishCurrent=()=>{};
    const show=()=>{
      while(i<lines.length && lines[i].when && lines[i].when!==vars.choice) i++;      // nhánh theo lựa chọn
      if(i>=lines.length) return end();
      const L=lines[i]; const d=speakerDef(L.who);
      dlg.querySelectorAll('.story__choice').forEach(x=>x.remove());
      spk.innerHTML=''; spk.classList.remove('is-on');
      if(d){ spk.appendChild(portraitEl(d)); requestAnimationFrame(()=>spk.classList.add('is-on')); }
      dlg.classList.toggle('is-narr', !d); dlg.style.setProperty('--fac', d ? (d.faction==='rust'?'var(--rust)':'var(--chrome)') : 'var(--line-3)');
      name.textContent = L.as || (d ? d.name : 'GHI CHÚ');
      txt.textContent=''; typing=true; $('#storyMore').style.visibility='hidden';
      finishCurrent=()=>{ typing=false; $('#storyMore').style.visibility=L.choice?'hidden':'visible';
        if(L.choice){ const c=el('div','story__choice'); L.choice.forEach(o=>{ const b=el('button','btn-act btn-act--go', `<span class="btn-act__k">${o.label}</span>`); b.onclick=ev=>{ ev.stopPropagation(); vars.choice=o.value; if(sector&&sector.id) { PLAYER.ending=PLAYER.ending||{}; PLAYER.ending[sector.id]=o.value; savePlayer(); } i++; show(); }; c.appendChild(b); }); dlg.appendChild(c); } };
      if(reduced()||!L.text){ txt.textContent=L.text||'…'; finishCurrent(); return; }
      let k=0; const step=()=>{ txt.textContent=L.text.slice(0,++k); if(k<L.text.length) timer=setTimeout(step,18); else finishCurrent(); }; step();
    };
    dlg.onclick=()=>{ if(typing){ clearTimeout(timer); txt.textContent=lines[i].text||'…'; finishCurrent(); } else if(!(lines[i]&&lines[i].choice)){ i++; show(); } };
    $('#storySkip').onclick=end;
    show();
  });
}

/* ---- MAP: bản đồ HALCYON (lát cắt dọc). Chạm khu vực → danh sách màn của khu vực đó.
        Nút đặt theo % của ảnh nên không phụ thuộc kích thước màn hình; chưa có ảnh thì nền là gradient CSS. ---- */
loadFirst(MAP_IMG).then(src=>{
  const m=$('#mapImg');
  if(src){ m.style.setProperty('--mapimg',`url("${absUrl(src)}")`); m.classList.add('has-img'); $('#mapCred').textContent='HALCYON'; }
  else $('#mapCred').textContent='CHƯA CÓ ẢNH · art/map/map_halcyon.jpg';
});
/* Sector đang mở nằm ở khu vực nào (dùng cho nút TIẾP TỤC) */
function currentArea(){
  const sec=SECTORS.find(s=>s.state==='open')||SECTORS[SECTORS.length-1];
  return MAP_AREAS.find(a=>areaSectors(a).includes(sec)) || null;
}
function openArea(a){
  const secs=areaSectors(a); if(!secs.length) return;
  MAP_AREA=a;
  SECTOR = secs.find(s=>s.state==='open') || secs.find(s=>s.state==='cleared') || secs[0];
  go('sector');
}
/* Thẻ nhãn co theo chỗ trống còn lại bên trái/phải của chấm, để không tràn ra ngoài khung map trên máy hẹp */
function sizeMapCards(){
  const w=$('#mapImg').clientWidth;
  $('#mapNodes').querySelectorAll('.mapnode').forEach(n=>{
    const a=mapAreaById(n.dataset.id); if(!a) return;
    const room=(a.side==='r' ? 100-a.x : a.x)/100*w - 24;
    n.querySelector('.mapnode__card').style.maxWidth=Math.max(84, Math.min(160, room))+'px';
  });
}
addEventListener('resize', sizeMapCards);
function renderMap(){
  syncSectorStates();
  const nodes=$('#mapNodes'); nodes.innerHTML='';
  $('#mapSub').textContent='CHẠM VÀO KHU VỰC';
  MAP_AREAS.forEach(a=>{
    const st=mapAreaState(a), secs=areaSectors(a), done=secs.filter(s=>s.state==='cleared').length;
    const n=el(st==='mark'?'div':'button', `mapnode mapnode--${a.side} is-${st}`);
    n.dataset.id=a.id; n.style.left=a.x+'%'; n.style.top=a.y+'%';
    const meta = st==='soon' ? 'SẮP RA' : st==='locked' ? 'KHOÁ' : st==='base' ? 'CĂN CỨ'
               : st==='mark' ? '' : `${done}/${secs.length} MÀN${st==='cleared'?' · XONG':''}`;
    n.innerHTML=`<i class="mapnode__dot"></i><span class="mapnode__card"><b>${a.label}</b><small>${a.sub}</small>${meta?`<em>${meta}</em>`:''}</span>`;
    if(st==='mark'){ nodes.appendChild(n); return; }
    n.addEventListener('click',()=>{
      if(st==='base') return go('home');
      if(st==='soon'){ sfx('error',.4); $('#mapSub').textContent=`${a.label} — CHƯƠNG ${a.chapter} ĐANG PHÁT TRIỂN`; return; }
      if(st==='locked'){ const prev=SECTORS.find(s=>s.state==='open');
        sfx('error',.4); $('#mapSub').textContent=`KHOÁ — CẦN XONG ${prev?prev.id+' · '+prev.name:'MÀN TRƯỚC'} TRƯỚC`; return; }
      openArea(a);
    });
    nodes.appendChild(n);
  });
  sizeMapCards();
  /* Đường đi giữa các khu vực (bỏ căn cứ): nét đứt cho cả tuyến, nét liền xanh cho đoạn đã qua */
  const route=MAP_AREAS.filter(a=>a.kind!=='base').slice().sort((p,q)=>q.y-p.y);   // dưới lên trên
  let cut=-1; route.forEach((a,i)=>{ const st=mapAreaState(a); if(st==='cleared'||st==='open') cut=i; });
  const pt=a=>`${a.x},${a.y}`;
  const donePts = cut>0 ? route.slice(0,cut+1).map(pt).join(' ') : '';
  $('#mapLines').innerHTML=`<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">`
    + `<polyline class="rt" points="${route.map(pt).join(' ')}" vector-effect="non-scaling-stroke"/>`
    + (donePts?`<polyline class="rt rt--done" points="${donePts}" vector-effect="non-scaling-stroke"/>`:'')
    + `</svg>`;
  /* Sương che phần thành phố chưa mở, lùi dần khi chương mới mở */
  const top=Math.min(...MAP_AREAS.filter(a=>mapAreaState(a)!=='soon').map(a=>a.y));
  $('#mapFog').style.height=Math.max(0, top-6)+'%';
  /* Nút TIẾP TỤC + cuộn khung map tới khu vực đang chơi (chỉ cuộn khung, không cuộn cả trang) */
  const sec=SECTORS.find(s=>s.state==='open')||SECTORS[SECTORS.length-1], a=currentArea();
  $('#mapContMeta').textContent = !a ? '—'
    : a.label===sec.name ? `${sec.id} · ${sec.name}` : `${a.label} · ${sec.id} · ${sec.name}`;
  $('#btnContinueMap').disabled = !a;
  if(a) requestAnimationFrame(()=>{
    const view=$('#mapView'), h=$('#mapImg').offsetHeight;
    view.scrollTo({ top: Math.max(0, h*a.y/100 - view.clientHeight/2), behavior: reduced()?'auto':'smooth' });
  });
}
$('#btnContinueMap').addEventListener('click',()=>{ const a=currentArea(); if(a) openArea(a); });
/* Hai nút cùng một việc: khối màn đang mở ở trên và nút CHƠI TIẾP ở dưới — cả hai vào thẳng
   màn đang mở (docs/ui-nguoi-moi.md §C1). Người mới chỉ cần thấy một đường đi. */
{ const play=()=>{ const a=currentArea(); if(a) openArea(a); else go('map'); };
  $('#btnContinue').addEventListener('click', play);
  const p=$('#btnPlay'); if(p) p.addEventListener('click', play); }

/* ---- SECTOR SELECT — chỉ đổ các màn của khu vực chọn trên map (MAP_AREA); null = đổ hết ---- */
function renderSectors(){
  syncSectorStates();
  const list=$('#sectorList'); list.innerHTML='';
  const chapters = MAP_AREA ? CHAPTERS.filter(c=>c.n===MAP_AREA.chapter) : CHAPTERS;
  $('#sectorSub').textContent = MAP_AREA ? `${MAP_AREA.label} · ${MAP_AREA.sub}` : 'TUTORIAL + CHƯƠNG 1 · PVE';
  if(MAP_AREA && !areaSectors(MAP_AREA).includes(SECTOR)){
    const secs=areaSectors(MAP_AREA);
    SECTOR = secs.find(s=>s.state==='open') || secs.find(s=>s.state==='cleared') || secs[0] || SECTOR;
  }
  chapters.forEach(ch=>{
    const secs=ch.sectors.map(sectorById).filter(Boolean);
    const done=secs.filter(x=>x.state==='cleared').length;
    list.insertAdjacentHTML('beforeend',`<div class="chap ${ch.soon?'is-soon':''}"><span class="chap__n">${ch.n===0?'TUT':'CH.'+ch.n}</span><span class="chap__t">${ch.title}</span><span class="chap__s">${ch.sub}</span><span class="chap__p mono">${ch.soon?'SẮP RA':done+'/'+secs.length}</span></div>`);
    secs.forEach(sec=>{
      const r=el('button',`srow is-${sec.state} ${sec===SECTOR?'is-selected':''}`);
      const bossName = sec.boss ? ENEMY_POOL.find(e=>e.id===sec.boss).name : (sec.waves>2?'BOSS ???':'KHÔNG BOSS');
      r.innerHTML=`<span class="srow__id">${sec.id}</span>
        <span><div class="srow__name">${sec.name}</div><div class="srow__meta">${sec.tag} · ${sec.waves} đợt địch · nên có ATK ${sec.rec}+ · ${sec.state==='cleared'||sec.state==='open'?bossName:'???'}</div>
        <div class="srow__waves">${Array.from({length:sec.waves},(_,i)=>`<i class="${sec.boss&&i===sec.waves-1?'boss':''} ${sec.state==='cleared'?'done':''}"></i>`).join('')}<span class="srow__rw">${sec.state==='cleared'?'TUẦN TRA +'+Math.round(sec.reward.shards*.25)+' SH':'+'+sec.reward.shards+' SH'}</span></div></span>
        <span class="srow__state">${sec.state==='cleared'?'XONG':sec.state==='open'?'MỞ':'KHOÁ'}</span>`;
      if(sec.state==='locked') r.disabled=true;
      else r.addEventListener('click',()=>{ SECTOR=sec; renderSectors(); });
      list.appendChild(r);
    });
    if(ch.soon) list.insertAdjacentHTML('beforeend',`<div class="srow is-locked srow--soon"><span class="srow__id">—</span><span><div class="srow__name">ĐANG PHÁT TRIỂN</div><div class="srow__meta">Dàn ý chương ${ch.n} ở docs/story.md</div></span></div>`);
  });
  const ok = SECTOR && SECTOR.state!=='locked';
  $('#btnEnter').disabled = !ok;
  $('#enterMeta').textContent = ok
    ? `${SECTOR.id} · ${SECTOR.name} · ${SECTOR.waves} đợt địch${SECTOR.team?' · đội cố định: '+SECTOR.team.map(i=>ROSTER[i].name).join(', '):''}`
    : 'CHỌN MỘT MÀN ĐANG MỞ';
  syncSweepBtn($('#btnSweep'), $('#sweepMeta'), SECTOR);
}
/* Nút QUÉT dùng chung cho màn chiến dịch và thang HỐ LOẠN (js/sweep.js, docs/che-do-choi.md §D).
   Guard typeof vì kit.html không nạp sweep.js. */
function syncSweepBtn(btn, meta, sec){
  if(!btn || typeof sweepWhy!=='function') return;
  btn.disabled = !canSweep(sec);
  const k=btn.querySelector('.btn-act__k'); if(k) k.textContent = sweepBtnKey();
  if(meta) meta.textContent = sweepBtnTxt(sec);
  // quét xong phải vẽ lại chính nút này: số vé còn lại nằm trên nhãn của nó
  btn.onclick = () => { if(sweepDo(sec)){ renderWallet(); syncSweepBtn(btn, meta, sec); } };
}
syncSectorStates();

renderConfig();
go('title');
