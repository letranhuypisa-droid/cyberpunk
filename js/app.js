'use strict';
/* APP — router màn hình, lobby, squad, sector, gacha, archive (kỹ năng / passive / hồ sơ), config, COMMS. Nạp cuối.
   Demo UI kit nằm ở js/kit.js (kit.html); thẻ nhân vật cardEl ở js/core.js. */

/* =====================================================================
   SCREEN ROUTER — title → home → squad → map → sector → battle
   ===================================================================== */
const APP=$('#battle');
function go(name){
  if(name==='battle' && !SECTOR.team){ TEAM=normalizeTeam(TEAM); if(TEAM.includes(null)) return go('squad'); }
  if(APP.dataset.screen==='battle' && name!=='battle'){ B.gen++; exitTargeting(); stopCutin(); comicEnd(); }   // rời trận giữa chừng: huỷ mọi việc đang chờ
  if(APP.dataset.screen==='gacha' && name!=='gacha') stopVideoBox($('#revealCutin'));
  if(APP.dataset.screen!==name && APP.dataset.screen!=='title') sfx('swipe',.35);
  APP.dataset.screen=name;
  document.querySelectorAll('.screen').forEach(sc=>sc.classList.toggle('is-active', sc.dataset.screen===name));
  if(name==='battle') initBattle();
  if(name==='squad') renderSquad();
  if(name==='map') renderMap();
  if(name==='riot') renderRiot();
  if(name==='sector') renderSectors();
  if(name==='home') renderHome();
  if(name==='gacha') renderGacha();
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
  $('#dailyText').innerHTML=`<b>DAILY ${done}/${DAILY_TASKS.length}</b> — ${claim?claim+' nhiệm vụ chờ nhận thưởng':'nhiệm vụ hôm nay'}`;
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
function renderHome(){
  renderWallet(); renderDailyStrip();
  const bonds=availableBonds(); const c=$('#comms');
  if(bonds.length){ const b=bonds[Math.floor(Math.random()*bonds.length)]; c.hidden=false;
    $('#commsText').innerHTML=`<b>${ROSTER[b.pair[0]].name} · ${ROSTER[b.pair[1]].name}</b> — ${b.lines[0].text}`;
    c.onclick=()=>playStory(b.lines, {id:'BASE', name:`COMMS · ${b.title.toUpperCase()}`, bg:['art/bg/bg_base.jpg','art/bg/bg_battle.jpg']}).then(renderHome);
  } else c.hidden=true;
  if(!$('#homeAvatar').firstChild) $('#homeAvatar').appendChild(portraitEl(ROSTER.yuki));
  const feat = ROSTER.yuki;
  if($('#heroArt').dataset.id!==feat.id){ const p=portraitEl(feat); $('#heroArt').replaceWith(p); p.id='heroArt'; p.dataset.id=feat.id; $('#heroFeat').innerHTML=`NHÂN VẬT CHÍNH · TIER ${feat.tier}<b>${feat.name}</b>`; }
  syncSectorStates();
  /* Nút DẸP LOẠN: khoá tới khi xong màn mở khoá, rồi in tầng đang mở để người chơi biết chỗ cày */
  const rb=$('#btnRiotMenu'); if(rb){ const on=riotUnlocked();
    rb.classList.toggle('is-locked', !on); rb.disabled=!on;
    $('#riotMenuSub').textContent = on ? `TẦNG ${PLAYER.riot.tier}` : `CẦN XONG ${RIOT.unlock}`; }
  const sec = SECTORS.find(x=>x.state==='open') || SECTORS[SECTORS.length-1];
  SECTOR = sec;
  $('#homeSector').textContent=sec.id; $('#homeSectorMeta').textContent=`${sec.name} · ${sec.waves} WAVE · ${sec.boss?ENEMY_POOL.find(e=>e.id===sec.boss).name:'KHÔNG BOSS'}`;
}

/* ---- SQUAD: 3 slot + roster, bấm thẻ để thêm/bỏ, kéo thả cũng được. Đội hình lưu vào hồ sơ. ---- */
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
      c.addEventListener('click',()=>{ if(!owns(d.id)) return; const j=SQUAD.slots.indexOf(d.id); if(j>-1) SQUAD.slots[j]=null; else { const k=SQUAD.slots.indexOf(null); if(k<0) return; SQUAD.slots[k]=d.id; } renderSquad(); });
      roster.appendChild(c);
    });
  }
  // nhân vật chưa sở hữu → khoá (lấy ở màn GACHA hoặc cốt truyện); đã sở hữu nhưng đang trong đội → SELECTED
  SQUAD.slots = SQUAD.slots.map(id => id && owns(id) ? id : null);
  roster.querySelectorAll('.card').forEach(c=>{ const id=c.dataset.id, on=SQUAD.slots.includes(id), locked=!owns(id);
    c.classList.toggle('is-selected',on); c.classList.toggle('is-locked',locked); c.draggable=!locked;
    c.querySelector('.card__state').textContent = on?'SELECTED':locked?'LOCKED':''; });
  // sắp xếp: đã sở hữu lên trước
  [...roster.querySelectorAll('.card')].sort((a,b)=>owns(b.dataset.id)-owns(a.dataset.id)).forEach(c=>roster.appendChild(c));
  const n=SQUAD.slots.filter(Boolean).length;
  $('#squadCount').innerHTML=`<b>${n}</b>/${TEAM_SIZE} DEPLOYED`;
  const btn=$('#btnDeploy'); btn.disabled = n!==TEAM_SIZE; btn.querySelector('.btn-act__v').textContent = n===TEAM_SIZE ? 'Tiếp → bản đồ HALCYON' : `Chọn thêm ${TEAM_SIZE-n} nhân vật`;
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

/* ---- ARCHIVE: 5 tab. NHÂN VẬT = thẻ sáng khi đã sở hữu, bấm mở hồ sơ (KỸ NĂNG · PASSIVE · HỒ SƠ).
       ĐỊA DANH / THUẬT NGỮ / SỔ BỘ = Thư viện (CODEX trong data.js), mở hết ngay, không khoá theo tiến trình.
       TRUYỆN = đọc lại trang comic từng màn, khoá theo tiến trình (xem comicEntries). ---- */
const ARCH = { tab:'char' };
function renderArchive(){
  const grid=$('#archGrid'); grid.innerHTML=''; $('#codex').hidden=true;
  document.querySelectorAll('#archTabs .lore__tab').forEach(b=>b.classList.toggle('is-on', b.dataset.atab===ARCH.tab));
  grid.classList.toggle('arch--codex', ARCH.tab!=='char');
  if(ARCH.tab==='comic') return renderComicGrid(grid);
  if(ARCH.tab!=='char') return renderCodexGrid(grid, codexGroup(ARCH.tab));
  const all=Object.values(ROSTER); const n=all.filter(d=>owns(d.id)).length;
  $('#archCount').textContent=`${n}/${all.length} HỒ SƠ`;
  [...all].sort((a,b)=>owns(b.id)-owns(a.id) || 'SAB'.indexOf(a.tier)-'SAB'.indexOf(b.tier)).forEach(d=>{
    const has=owns(d.id); const t=el('div',`tile tile--${d.faction} tile--${d.tier.toLowerCase()} ${has?'':'is-locked'}`);
    t.appendChild(portraitEl(d));
    t.insertAdjacentHTML('beforeend',`${has?(lvl(d.id)>1?`<span class="tile__lock tile__lv">LV ${lvl(d.id)}</span>`:''):'<span class="tile__lock">LOCKED</span>'}<div class="tile__name"><span>${has?d.name:'???'}</span><span class="tier">${d.tier}</span></div>`);
    if(has) t.addEventListener('click',()=>openLore(d.id));
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
const LORE_TAB = { cur:'skill' };
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
function openLore(id){
  const L=LORE[id]||{}; const d=ROSTER[id]; if(!d) return;
  const box=$('#lore'); box.className='lore '+(d.faction==='rust'?'lore--rust':'lore--chrome');
  const art=portraitEl(d); $('#loreArt').replaceWith(art); art.id='loreArt';
  $('#loreTags').textContent = `${d.faction.toUpperCase()} · TIER ${d.tier} · ${d.ult.name}`;
  $('#loreName').textContent=d.name; $('#loreEpithet').textContent=L.epithet||'';
  const st=unitStats(id), L1=lvl(id), sk=d.skill||{};   // cùng hàm với thẻ nhân vật và lúc vào trận
  const upTxt = L1>=UPGRADE.maxLevel ? 'MAX' : `LV ${L1+1} · ${UPGRADE.cost(L1).toLocaleString('en-US')} CR`;
  const kindTxt = d.ult.kind==='control'?'ĐIỀU KHIỂN':d.ult.kind==='heal'?'HỒI MÁU':d.ult.kind==='aoe'?'TOÀN BỘ ĐỊCH':'MỘT MỤC TIÊU';
  const body=$('#loreBody'); body.innerHTML=`
    <div class="lore__tabs"><button class="lore__tab" data-tab="skill">Kỹ năng</button><button class="lore__tab" data-tab="passive">Passive</button><button class="lore__tab" data-tab="lore">Hồ sơ</button></div>
    <div class="lore__pane lore__pane--skill">
      <div class="lore__stats"><span class="pill"><small>LV</small>${L1}</span><span class="pill"><small>ATK</small>${st.atk}</span><span class="pill"><small>HP</small>${st.hp}</span><span class="pill"><small>EN</small>${d.energyMax}</span><span class="pill"><small>SPD</small>${st.spd}</span><span class="pill"><small>CRIT</small>${st.crit+(sk.critPct||0)}%</span>
        <button class="btn-act btn-act--go lore__up" id="loreUp" ${L1>=UPGRADE.maxLevel||PLAYER.credits<UPGRADE.cost(L1)?'disabled':''}><span class="btn-act__k">Upgrade</span><span class="btn-act__v">${upTxt} · +${Math.round(UPGRADE.statPerLevel*100)}% ATK/HP</span></button></div>
      ${L.weapon?`<div class="lore__ult"><b>VŨ KHÍ</b><span class="lore__flavor">${L.weapon}</span></div>`:''}
      <div class="lore__ult lore__skill"><b>ĐÒN THƯỜNG</b>${L.attack?`<span class="lore__flavor">${L.attack}</span>`:''}<span>${sk.desc||'100% ATK, +25 Energy.'}</span></div>
      <div class="lore__ult"><b>CHIÊU CUỐI · ${d.ult.name}</b>${L.ultFlavor?`<span class="lore__flavor">${L.ultFlavor}</span>`:''}<span>${d.ult.desc}</span><div class="lore__pills"><span class="pill"><small>COST</small>${d.ult.cost} EN</span><span class="pill">${kindTxt}</span>${d.ult.mult?`<span class="pill">${Math.round(d.ult.mult*100)}% ATK</span>`:''}</div></div>
    </div>
    <div class="lore__pane lore__pane--passive"></div>
    <div class="lore__pane lore__pane--lore${L.form?' lore__doc lore__doc--'+L.form:''}">
      ${L.profile||!L.past?`<div class="lore__sec"><span class="lbl">Là ai</span><p class="lead">${L.profile||'Chưa có hồ sơ.'}</p></div>`:''}
      ${L.past?`<div class="lore__sec"><span class="lbl">${(L.labels||{}).past||'Chuyện đã xảy ra'}</span><p>${L.past}</p></div>`:''}
      ${L.now?`<div class="lore__sec"><span class="lbl">${(L.labels||{}).now||'Bây giờ'}</span><p>${L.now}</p></div>`:''}
      ${L.voice?`<div class="lore__sec"><p class="voice">${L.voice}</p></div>`:''}
    </div>`;
  const pane=body.querySelector('.lore__pane--passive');
  if(!(d.passives||[]).length) pane.innerHTML='<p class="lore__empty">Chưa có nội tại.</p>';
  (d.passives||[]).forEach(p=>{
    const info=passiveInfo(p); const r=el('div',`pas ${info.cls}`);
    const pic=el('div','pas__pic'); if(info.def) pic.appendChild(portraitEl(info.def)); r.appendChild(pic);
    r.insertAdjacentHTML('beforeend',`<div class="pas__body"><b class="pas__name">${p.name}</b><span class="pas__cond">${info.cond}</span><span class="pas__fx">${fxText(p.effect||{})}</span><p class="pas__desc">${p.desc||''}</p></div><span class="pas__state">${info.state}</span>`);
    pane.appendChild(r);
  });
  body.querySelectorAll('.lore__tab').forEach(b=>b.addEventListener('click',()=>{ LORE_TAB.cur=b.dataset.tab; box.dataset.tab=LORE_TAB.cur; body.querySelectorAll('.lore__tab').forEach(x=>x.classList.toggle('is-on',x===b)); body.scrollTop=0; }));
  box.dataset.tab=LORE_TAB.cur; body.querySelectorAll('.lore__tab').forEach(x=>x.classList.toggle('is-on',x.dataset.tab===LORE_TAB.cur));
  body.scrollTop=0; box.hidden=false;
  const up=$('#loreUp'); if(up) up.addEventListener('click',()=>{ const r=upgrade(id); if(r==='ok'){ AUDIO.upgrade(); renderWallet(); const sc=body.scrollTop; openLore(id); body.scrollTop=sc; } else sfx('error',.4); });
}
$('#loreClose').addEventListener('click',()=>{ $('#lore').hidden=true; });
/* Đổi biệt danh hồ sơ: chạm vào tên ở Lobby */
$('#pName').addEventListener('click',()=>{ const n=prompt('Biệt danh hồ sơ (tối đa 14 ký tự):', PLAYER.name); if(n&&n.trim()){ PLAYER.name=n.trim().slice(0,14).toUpperCase(); savePlayer(); renderWallet(); } });

/* ---- GACHA ---- */
/* Hai bể: 'hero' = REQUISITION (nhân vật, trả SH) · 'crew' = CHIÊU MỘ (kẻ địch đã đánh bại, trả CR) */
const GA = { banner:'hero' };
const curBanner = () => BANNERS[GA.banner];
document.querySelectorAll('#gachaTabs .lore__tab').forEach(b=>b.addEventListener('click',()=>{
  if(GA.banner===b.dataset.banner) return;
  GA.banner=b.dataset.banner; sfx('cursor',.2); renderGacha();
}));
function renderGacha(){
  renderWallet();
  const b=curBanner(), pool=bannerPool(b), locked=bannerLocked(b), feat=bannerFeatured(b);
  const have=pool.filter(c=>owns(c.id)).length;
  document.querySelectorAll('#gachaTabs .lore__tab').forEach(t=>t.classList.toggle('is-on', t.dataset.banner===b.id));
  $('#gachaTitle').textContent=b.name; $('#gCurLbl').textContent=b.curLabel;
  /* Ví hiện đúng loại tiền của bể đang xem — CHIÊU MỘ trả CR chứ không trả SH */
  $('#gShards').textContent=PLAYER[b.cur].toLocaleString('en-US');
  /* Tải sẵn ảnh mở rương (nhẹ, và màn khoe nhân vật cần tới ngay). Video thì KHÔNG nạp ở đây:
     resolveVideo chỉ gửi HEAD nên nạp sẵn cũng vô nghĩa, còn kéo byte của mọi video lúc mở màn là phí băng thông
     cho thứ 97% lượt quay không dùng tới. Byte được nạp trong doPull, khi đã biết chắc thẻ nào cần. */
  if(!renderGacha.pre){ renderGacha.pre=true; Object.values(ROSTER).forEach(d=>{ if(d.reveal) loadFirst(d.reveal); }); }
  const art=$('#gachaArt');
  if(feat && art.dataset.id!==feat.id){ const p=portraitEl(feat); art.replaceWith(p); p.id='gachaArt'; p.dataset.id=feat.id; }
  $('#gachaTag').textContent = feat ? `RATE-UP · TIER ${feat.tier}` : 'BỂ TRỐNG';
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
  /* Nói thật về bể: chương 1 của REQUISITION chỉ có 4 người, giấu đi thì người chơi quay mãi không hiểu vì sao toàn trùng */
  const full = pool.length && have>=pool.length;
  $('#gNote').innerHTML = !pool.length
    ? `Bể của chương này chưa mở ai. Để dành ${b.curLabel} cho chương sau.`
    : full
      ? `<b>Đã đủ cả ${pool.length} đơn vị của chương này.</b> Quay tiếp chỉ ra bản dư — giữ lại để phân tách lấy linh kiện.`
      : `Bể chương này có <b>${pool.length}</b> đơn vị · 50% số lần ra bậc của người rate-up là chính họ · ×10 chắc chắn ≥1 A · trùng thành <b>bản dư</b>, không hoàn ${b.curLabel}`;
  $('#gOwned').parentElement.innerHTML=`Owned <b id="gOwned">${have}</b>/${pool.length} · Pulls <b id="gPulls">${PLAYER.pulls}</b>`;
  const canPull = pool.length>0;
  $('#btnPull1').disabled = !canPull || PLAYER[b.cur]<b.cost1;
  $('#btnPull10').disabled= !canPull || PLAYER[b.cur]<b.cost10;
  $('#btnPull1').querySelector('.btn-act__v').textContent=`${b.cost1.toLocaleString('en-US')} ${b.curLabel}`;
  $('#btnPull10').querySelector('.btn-act__v').textContent=`${b.cost10.toLocaleString('en-US')} ${b.curLabel} · ≥1 A`;
  renderLockedPool(locked);
}
/* Thẻ xám cho người chưa tới chương của họ. Bể nhân vật chương 1 chỉ có 4 người, nên phải cho thấy
   13 người còn lại đang chờ ở chương nào — đó là lý do để dành SH thay vì tưởng game hết nội dung. */
function renderLockedPool(locked){
  const box=$('#gLocked'), grid=$('#gLockedGrid');
  if(!locked.length){ box.hidden=true; return; }
  box.hidden=false;
  const byCh = locked.reduce((m,c)=>{ const k=c.debut==null?'?':c.debut; (m[k]=m[k]||[]).push(c); return m; },{});
  $('#gLockedSub').textContent=`${locked.length} đơn vị · mở dần theo chương`;
  grid.innerHTML=Object.keys(byCh).sort().map(k=>{
    const lbl = k==='?' ? 'CHƯA XẾP CHƯƠNG' : 'CHƯƠNG '+k;
    return `<div class="glocked__row"><span class="glocked__ch">${lbl}</span>`
      + byCh[k].map(c=>`<span class="glocked__u t-${c.tier}"><b>${c.name}</b><em>${c.tier}</em></span>`).join('')
      + `</div>`;
  }).join('');
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
  const b=curBanner();
  const res=pull(n, b.id); if(!res){ sfx('error',.4); return; }
  dailyProgress('pull'); renderWallet();      // ★ chỉ cập nhật ví: gọi renderGacha() ở đây sẽ tụt thanh pity về 0 và lộ ngay là có S
  $('#gShards').textContent=PLAYER[b.cur].toLocaleString('en-US');   // ví của bể đang xem (CHIÊU MỘ trả CR)
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
// ★ DEV: nạp đúng loại tiền của bể đang xem (CHIÊU MỘ trả CR nên nạp SH thì vô dụng)
$('#btnRefill').addEventListener('click',()=>{ const b=curBanner(); PLAYER[b.cur]+= b.cur==='credits'?20000:1000; savePlayer(); renderGacha(); });

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
    list.innerHTML=`<div class="srow is-locked srow--soon"><span class="srow__id">—</span><span><div class="srow__name">CHƯA MỞ</div><div class="srow__meta">Xong màn ${RIOT.unlock} rồi quay lại. Dẹp loạn là chỗ cày CR để chiêu mộ quân.</div></span></div>`;
    $('#btnRiotGo').disabled=true; $('#riotMeta').textContent='CẦN XONG '+RIOT.unlock; return;
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
      <div class="srow__meta">${s.waves} WAVE · ĐỘ KHÓ ×${s.mult} · ATK GỢI Ý ${s.rec}+${isBoss?' · '+ENEMY_POOL.find(e=>e.id===s.boss).name:''}</div>
      <div class="srow__waves">${Array.from({length:s.waves},(_,i)=>`<i class="${isBoss&&i===s.waves-1?'boss':''} ${done?'done':''}"></i>`).join('')}<span class="srow__rw">${rw}</span></div></span>
      <span class="srow__state">${done?'XONG':'MỚI'}</span>`;
    r.addEventListener('click',()=>{ RIOTV.tier=n; renderRiot(); });
    list.appendChild(r);
  }
  const s=riotSector(RIOTV.tier);
  $('#btnRiotGo').disabled=false;
  $('#riotMeta').textContent=`TẦNG ${RIOTV.tier} · ${s.waves} WAVE · ĐỘ KHÓ ×${s.mult}`;
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
$('#btnContinue').addEventListener('click',()=>{ const a=currentArea(); if(a) openArea(a); else go('map'); });

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
        <span><div class="srow__name">${sec.name}</div><div class="srow__meta">${sec.tag} · ${sec.waves} WAVE · ATK GỢI Ý ${sec.rec}+ · ${sec.state==='cleared'||sec.state==='open'?bossName:'???'}</div>
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
    ? `${SECTOR.id} · ${SECTOR.name} · ${SECTOR.waves} WAVE${SECTOR.team?' · ĐỘI CỐ ĐỊNH: '+SECTOR.team.map(i=>ROSTER[i].name).join(', '):''}`
    : 'CHỌN MỘT MÀN ĐANG MỞ';
}
syncSectorStates();

renderConfig();
go('title');
