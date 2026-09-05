'use strict';
/* APP — router màn hình, lobby, squad, sector, gacha, archive, config, story overlay, kit demos. Nạp cuối. */

/* =====================================================================
   SCREEN ROUTER — title → home → squad → sector → battle
   ===================================================================== */
const APP=$('#battle');
function go(name){
  if(name==='battle'){ if(TEAM.length!==5) return go('squad'); }
  if(APP.dataset.screen!==name && APP.dataset.screen!=='title') sfx('swipe',.35);
  APP.dataset.screen=name;
  document.querySelectorAll('.screen').forEach(sc=>sc.classList.toggle('is-active', sc.dataset.screen===name));
  if(name==='battle') initBattle();
  if(name==='squad') renderSquad();
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

/* ---- TITLE: key art (title_keyart.png → fallback ảnh Kira trong suốt) ---- */
loadFirst(['title_keyart.png','KIRA/Kira PNG.png']).then(src=>{ if(src){ const im=$('#titleArt'); im.src=src; im.classList.add('has-img'); } });

/* ---- HOME ---- */
function renderWallet(){ document.querySelectorAll('#pShards,#gShards').forEach(e=>e.textContent=PLAYER.shards.toLocaleString('en-US')); $('#pCredits').textContent=PLAYER.credits.toLocaleString('en-US'); $('#pName').textContent=PLAYER.name; $('#pLevel').textContent=`LV ${PLAYER.level} · CHROME LICENSE`; }
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
    r.querySelector('.dl__claim').addEventListener('click',()=>{ if(dailyClaim(t.id)){ sfx('open',.5); renderWallet(); renderDailyList(); renderDailyStrip(); } });
    list.appendChild(r); });
}
$('#daily').addEventListener('click',()=>{ renderDailyList(); $('#dailyBox').hidden=false; });
$('#dailyClose').addEventListener('click',()=>{ $('#dailyBox').hidden=true; });
function renderHome(){
  renderWallet(); renderDailyStrip();
  const bonds=availableBonds(); const c=$('#comms');
  if(bonds.length){ const b=bonds[Math.floor(Math.random()*bonds.length)]; c.hidden=false;
    $('#commsText').innerHTML=`<b>${ROSTER[b.pair[0]].name} · ${ROSTER[b.pair[1]].name}</b> — ${b.lines[0].text}`;
    c.onclick=()=>playStory(b.lines, {id:'BASE', name:`COMMS · ${b.title.toUpperCase()}`, bg:['bg_base.jpg','bg_battle.jpg','bg_battle.png']}).then(renderHome);
  } else c.hidden=true;
  if(!$('#homeAvatar').firstChild) $('#homeAvatar').appendChild(portraitEl({name:'YOU',faction:'rust',portrait:['operator_portrait.png'],pos:'50% 10%'}));
  const feat = owns('kira') ? ROSTER.kira : ROSTER[TEAM[0]];
  if($('#heroArt').dataset.id!==feat.id){ const p=portraitEl(feat); $('#heroArt').replaceWith(p); p.id='heroArt'; p.dataset.id=feat.id; $('#heroFeat').innerHTML=`${owns('kira')?'FEATURED':'SQUAD LEAD'} · TIER ${feat.tier}<b>${feat.name}</b>`; }
  syncSectorStates();
  const sec = SECTORS.find(x=>x.state==='open') || SECTORS[SECTORS.length-1];
  SECTOR = sec;
  $('#homeSector').textContent=sec.id; $('#homeSectorMeta').textContent=`${sec.name} · ${sec.waves} WAVES · ${sec.boss?ENEMY_POOL.find(e=>e.id===sec.boss).name:'NO BOSS'}`;
}

/* ---- SQUAD: 5 slot + roster 19, bấm thẻ để thêm/bỏ, kéo thả cũng được ---- */
const SQUAD = { slots:[...TEAM] };
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
  // nhân vật chưa sở hữu → khoá (lấy ở màn GACHA); đã sở hữu nhưng đang trong đội → SELECTED
  SQUAD.slots = SQUAD.slots.map(id => id && owns(id) ? id : null);
  roster.querySelectorAll('.card').forEach(c=>{ const id=c.dataset.id, on=SQUAD.slots.includes(id), locked=!owns(id);
    c.classList.toggle('is-selected',on); c.classList.toggle('is-locked',locked); c.draggable=!locked;
    c.querySelector('.card__state').textContent = on?'SELECTED':locked?'LOCKED':''; });
  // sắp xếp: đã sở hữu lên trước
  [...roster.querySelectorAll('.card')].sort((a,b)=>owns(b.dataset.id)-owns(a.dataset.id)).forEach(c=>roster.appendChild(c));
  const n=SQUAD.slots.filter(Boolean).length;
  $('#squadCount').innerHTML=`<b>${n}</b>/5 DEPLOYED`;
  const btn=$('#btnDeploy'); btn.disabled = n!==5; btn.querySelector('.btn-act__v').textContent = n===5 ? 'Tiếp → chọn sector' : `Chọn thêm ${5-n} nhân vật`;
  if(n===5) TEAM=SQUAD.slots.slice();
}

/* ---- CONFIG ---- */
function renderConfig(){
  PLAYER.settings = Object.assign({sound:true, sfx:true, motion:false, skipStory:false}, PLAYER.settings||{});
  document.querySelectorAll('.cfg__row[data-cfg]').forEach(r=>{ r.classList.toggle('is-on', !!PLAYER.settings[r.dataset.cfg]); });
  document.documentElement.classList.toggle('rm-forced', !!PLAYER.settings.motion);
}
document.querySelectorAll('.cfg__row[data-cfg]').forEach(r=>r.addEventListener('click',()=>{ PLAYER.settings[r.dataset.cfg]=!PLAYER.settings[r.dataset.cfg]; savePlayer(); renderConfig(); }));
$('#cfgReset').addEventListener('click',()=>{ if(confirm('Xoá toàn bộ tiến trình trên máy này?')){ SAVE.reset(); location.reload(); } });

/* ---- ARCHIVE ---- */
function renderArchive(){
  const grid=$('#archGrid'); grid.innerHTML='';
  const all=Object.values(ROSTER); const n=all.filter(d=>owns(d.id)).length;
  $('#archCount').textContent=`${n+1}/${all.length+1} HỒ SƠ`;
  const you=el('div','tile tile--you'); you.appendChild(portraitEl({name:PLAYER.name,faction:'rust',portrait:['operator_portrait.png'],pos:'50% 10%'}));
  you.insertAdjacentHTML('beforeend',`<span class="tile__you">YOU</span><div class="tile__name"><span>${PLAYER.name}</span></div>`);
  you.addEventListener('click',()=>openLore('operator')); grid.appendChild(you);
  [...all].sort((a,b)=>owns(b.id)-owns(a.id) || 'SAB'.indexOf(a.tier)-'SAB'.indexOf(b.tier)).forEach(d=>{
    const has=owns(d.id); const t=el('div',`tile tile--${d.faction} tile--${d.tier.toLowerCase()} ${has?'':'is-locked'}`);
    t.appendChild(portraitEl(d));
    t.insertAdjacentHTML('beforeend',`${has?(lvl(d.id)>1?`<span class="tile__lock tile__lv">LV ${lvl(d.id)}</span>`:''):'<span class="tile__lock">LOCKED</span>'}<div class="tile__name"><span>${has?d.name:'???'}</span><span class="tier">${d.tier}</span></div>`);
    if(has) t.addEventListener('click',()=>openLore(d.id));
    grid.appendChild(t);
  });
}
function openLore(id){
  const L=LORE[id]; if(!L) return;
  const d = id==='operator' ? {name:PLAYER.name, faction:'rust', tier:null, portrait:['operator_portrait.png'], pos:'50% 0%'} : ROSTER[id];
  const box=$('#lore'); box.className='lore '+(d.faction==='rust'?'lore--rust':'lore--chrome');
  const art=portraitEl(d); $('#loreArt').replaceWith(art); art.id='loreArt';
  $('#loreTags').textContent = id==='operator' ? 'OPERATOR · SUMP · DECK 77' : `${d.faction.toUpperCase()} · TIER ${d.tier} · ${d.ult.name}`;
  $('#loreName').textContent=d.name; $('#loreEpithet').textContent=L.epithet;
  const m = id==='operator' ? 1 : statMult(id), L1 = id==='operator' ? 0 : lvl(id);
  const upTxt = L1>=UPGRADE.maxLevel ? 'MAX' : `LV ${L1+1} · ${UPGRADE.cost(L1).toLocaleString('en-US')} CR`;
  const stats = id==='operator' ? '' : `<div class="lore__stats"><span class="pill"><small>LV</small>${L1}</span><span class="pill"><small>ATK</small>${Math.round(d.atk*m)}</span><span class="pill"><small>HP</small>${Math.round(d.hp*m)}</span><span class="pill"><small>EN</small>${d.energyMax}</span>
      <button class="btn-act btn-act--go lore__up" id="loreUp" ${L1>=UPGRADE.maxLevel||PLAYER.credits<UPGRADE.cost(L1)?'disabled':''}><span class="btn-act__k">Upgrade</span><span class="btn-act__v">${upTxt} · +${Math.round(UPGRADE.statPerLevel*100)}% ATK/HP</span></button></div>
    <div class="lore__ult"><b>ULT · ${d.ult.name} · ${d.ult.cost} EN</b><span>${d.ult.desc}</span></div>`;
  $('#loreBody').innerHTML = stats + `
    <div class="lore__sec"><span class="lbl">Hồ sơ</span><p>${L.profile}</p><span class="lore__mood">SẮC THÁI · ${L.mood}</span></div>
    <div class="lore__sec"><span class="lbl">Câu chuyện</span>${L.story.split('\n\n').map(x=>`<p>${x}</p>`).join('')}</div>
    <div class="lore__sec"><span class="lbl">Lý tưởng</span><p class="ideal">${L.ideal}</p></div>
    <div class="lore__sec"><span class="lbl">Lời thoại</span><p class="voice">${L.voice}</p></div>`;
  $('#loreBody').scrollTop=0; box.hidden=false;
  const up=$('#loreUp'); if(up) up.addEventListener('click',()=>{ const r=upgrade(id); if(r==='ok'){ sfx('open',.5); renderWallet(); const sc=$('#loreBody').scrollTop; openLore(id); $('#loreBody').scrollTop=sc; } else sfx('error',.4); });
}
$('#loreClose').addEventListener('click',()=>{ $('#lore').hidden=true; });
/* Đổi tên Operator: chạm vào tên ở Lobby */
$('#pName').addEventListener('click',()=>{ const n=prompt('Tên Operator (tối đa 14 ký tự):', PLAYER.name); if(n&&n.trim()){ PLAYER.name=n.trim().slice(0,14).toUpperCase(); savePlayer(); renderWallet(); } });

/* ---- GACHA ---- */
function renderGacha(){
  renderWallet();
  if(!$('#gachaArt').classList.contains('mounted')){ const p=portraitEl(ROSTER[GACHA.featured]); $('#gachaArt').replaceWith(p); p.id='gachaArt'; p.classList.add('mounted'); }
  $('#gachaFeat').textContent=ROSTER[GACHA.featured].name;
  $('#gPity').textContent=`${PLAYER.pity}/${GACHA.pityS}`;
  $('#gOwned').textContent=PLAYER.owned.length; $('#gPulls').textContent=PLAYER.pulls;
  $('#btnPull1').disabled = PLAYER.shards<GACHA.cost1; $('#btnPull10').disabled = PLAYER.shards<GACHA.cost10;
}
async function doPull(n){
  const res=pull(n); if(!res){ sfx('error',.4); return; }
  dailyProgress('pull'); renderGacha();
  const box=$('#reveal'), grid=$('#revealGrid'); grid.innerHTML=''; grid.classList.toggle('n1', n===1); box.classList.toggle('n1', n===1);
  $('#btnRevealDone').hidden=true; $('#btnRevealSkip').hidden=false; box.hidden=false;
  const cards=res.map(r=>{
    const d=ROSTER[r.id]; const w=el('div',`rv t-${r.tier}`);
    w.innerHTML=`<div class="rv__in"><div class="rv__face rv__back"></div><div class="rv__face rv__front"></div></div><span class="rv__new">NEW</span><span class="rv__dupe">${r.refund?'DUPE +'+r.refund+' SH':''}</span>`;
    const c=cardEl(d,''); c.draggable=false; w.querySelector('.rv__front').appendChild(c);
    if(!r.isNew) w.querySelector('.rv__new').remove();
    grid.appendChild(w); return w;
  });
  let skipped=false; $('#btnRevealSkip').onclick=()=>{ skipped=true; cards.forEach(c=>c.classList.add('is-open')); };
  for(const [i,c] of cards.entries()){
    if(skipped) break;
    await wait(reduced()?40:(c.classList.contains('t-S')?520:170));
    c.classList.add('is-open'); sfx(c.classList.contains('t-S')?'open':'cursor', c.classList.contains('t-S')?.6:.35);
  }
  await wait(reduced()?100:600);
  $('#btnRevealSkip').hidden=true; $('#btnRevealDone').hidden=false;
  $('#btnRevealDone').onclick=()=>{ box.hidden=true; renderGacha(); };
}
$('#btnPull1').addEventListener('click',()=>doPull(1));
$('#btnPull10').addEventListener('click',()=>doPull(10));
$('#btnRefill').addEventListener('click',()=>{ PLAYER.shards+=1000; savePlayer(); renderGacha(); });   // ★ DEV

/* ---- STORY: hội thoại kiểu visual novel, gõ chữ 18ms/ký tự, chạm để hiện hết rồi sang câu kế ---- */
function speakerDef(id){ if(!id) return null; const e=ENEMY_POOL.find(x=>x.id===id); return ROSTER[id] || (e&&e.lore&&ROSTER[e.lore]) || e; }
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
      name.textContent = L.as || (d ? d.name : 'SUMP · LOG');
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

/* ---- SECTOR SELECT ---- */
function renderSectors(){
  syncSectorStates();
  const list=$('#sectorList'); list.innerHTML='';
  CHAPTERS.forEach(ch=>{
    const secs=ch.sectors.map(sectorById);
    const done=secs.filter(x=>x.state==='cleared').length;
    list.insertAdjacentHTML('beforeend',`<div class="chap ${ch.soon?'is-soon':''}"><span class="chap__n">CH.${ch.n}</span><span class="chap__t">${ch.title}</span><span class="chap__s">${ch.sub}</span><span class="chap__p mono">${ch.soon?'COMING':done+'/'+secs.length}</span></div>`);
    secs.forEach(sec=>{
      const r=el('button',`srow is-${sec.state} ${sec===SECTOR?'is-selected':''}`);
      const bossName = sec.boss ? ENEMY_POOL.find(e=>e.id===sec.boss).name : (sec.waves>2?'BOSS ???':'NO BOSS');
      r.innerHTML=`<span class="srow__id">${sec.id}</span>
        <span><div class="srow__name">${sec.name}</div><div class="srow__meta">${sec.tag} · ${sec.waves} WAVES · REC ATK ${sec.rec}+ · ${sec.state==='cleared'||sec.state==='open'?bossName:'???'}</div>
        <div class="srow__waves">${Array.from({length:sec.waves},(_,i)=>`<i class="${sec.boss&&i===sec.waves-1?'boss':''} ${sec.state==='cleared'?'done':''}"></i>`).join('')}<span class="srow__rw">${sec.state==='cleared'?'PATROL +'+Math.round(sec.reward.shards*.25)+' SH':'+'+sec.reward.shards+' SH'}</span></div></span>
        <span class="srow__state">${sec.state.toUpperCase()}</span>`;
      if(sec.state==='locked') r.disabled=true;
      else r.addEventListener('click',()=>{ SECTOR=sec; renderSectors(); });
      list.appendChild(r);
    });
    if(ch.soon) list.insertAdjacentHTML('beforeend',`<div class="srow is-locked srow--soon"><span class="srow__id">—</span><span><div class="srow__name">ĐANG PHÁT TRIỂN</div><div class="srow__meta">Xem docs/story.md để biết dàn ý chương ${ch.n}</div></span></div>`);
  });
  $('#enterMeta').textContent=`${SECTOR.id} · ${SECTOR.name} · ${SECTOR.waves} WAVES`;
}
syncSectorStates();

renderConfig();
go('title');

/* =====================================================================
   KIT DEMOS
   ===================================================================== */
/* B1: cards — ma trận 2 phe × 3 tier + trạng thái */
function cardEl(def, state){
  const c=el('article', `card card--${def.faction} card--${def.tier.toLowerCase()} ${state==='selected'?'is-selected':state==='locked'?'is-locked':''}`);
  c.dataset.id=def.id; c.draggable = state!=='locked';
  const body=el('div','card__body');
  body.appendChild(Object.assign(portraitEl(def,'card__portrait'),{}));
  body.insertAdjacentHTML('beforeend', `<div class="card__tier">${def.tier}</div><div class="card__fac">${def.faction}</div>
    <div class="card__info"><div class="card__name">${def.name}</div>
    <div class="card__stats"><span><b>ATK</b><em>${def.atk}</em></span><span><b>HP</b><em>${def.hp}</em></span></div></div>
    <div class="card__state">${state==='selected'?'SELECTED':state==='locked'?'LOCKED':''}</div>`);
  c.appendChild(body);
  c.addEventListener('dragstart', ev=>{ ev.dataTransfer.setData('text/plain',def.id); c.classList.add('is-dragging'); $('#team').querySelectorAll('.tslot.is-over').forEach(s=>s.classList.remove('is-over')); });
  c.addEventListener('dragend', ()=>c.classList.remove('is-dragging'));
  return c;
}
{
  const row=$('#cardRow');
  const specs=[['kira','selected'],['echo',''],['wire','locked'],['psalm','selected'],['stitch',''],['ronin',''],['muzzle',''],['ash','locked']];
  specs.forEach(([id,st])=>{ const w=el('div','sample'); w.appendChild(cardEl(ROSTER[id],st)); const d=ROSTER[id];
    w.insertAdjacentHTML('beforeend', `<span class="sample__cap">${d.faction} · tier ${d.tier} · ${st||'unselected'}${['echo','wire','stitch','kai'].includes(id)?'<span class="fake">FAKE</span>':''}</span>`); row.appendChild(w); });
  const g=cardEl(ROSTER.kira,''); g.classList.add('is-dragging'); g.draggable=false; $('#dragGhost').appendChild(g);
  // Roster đầy đủ
  const rr=$('#rosterRow'); const all=Object.values(ROSTER); $('#rosterCount').textContent=all.length;
  all.forEach(d=>{ const w=el('div','sample'); w.appendChild(cardEl(d,'')); w.insertAdjacentHTML('beforeend',`<span class="sample__cap">${d.faction} · ${d.tier} · ${d.ult.name}</span>`); rr.appendChild(w); });
  // Bestiary: tái dùng khung thẻ, badge = rank
  const er=$('#enemyRow'); $('#enemyCount').textContent=ENEMY_POOL.length;
  ENEMY_POOL.forEach(d=>{
    const tier={grunt:'B',elite:'A',boss:'S'}[d.rank];
    const c=cardEl({...d, tier, portrait:[], pos:''},''); c.draggable=false;
    c.querySelector('.card__tier').textContent=d.rank[0].toUpperCase();
    c.querySelector('.card__fac').textContent=`${d.faction} · ${d.rank}`;
    const w=el('div','sample'); w.appendChild(c); er.appendChild(w);
  });
}
/* B2: mất máu demo */
{
  const bar=$('#drainBar'), line=$('#drainLine'), txt=$('#drainTxt'); let hp=950;
  setInterval(()=>{ hp -= 140 + Math.round(Math.random()*180); if(hp<0) hp=950; const st=setHpBar(bar,hp,950); line.dataset.state=st; txt.textContent=`${hp} / 950`; }, 1700);
}
/* B3: energy 0/25/50/75/100 + 125 (Psalm) */
{
  const row=$('#energyRow');
  [[0,100],[25,100],[50,100],[75,100],[100,100],[125,125]].forEach(([v,max])=>{
    const s=el('div','sample sample--w'); const full=v>=max;
    s.innerHTML=`<div class="eline ${full?'is-full':''}"><span class="lbl">Energy</span><span><span class="ready">READY</span> <span class="mono">${v}/${max}</span></span></div>`;
    const eb=energyBarEl(max); eb.classList.add('ebar--lg'); setEnergyBar(eb,v,max); s.appendChild(eb);
    s.insertAdjacentHTML('beforeend', `<span class="sample__cap">${full?'ĐẦY · sắp tung chiêu':v+' / '+max}${max===125?' · 5 ô (cost 125)':''}</span>`); row.appendChild(s);
  });
}
/* B4: team slots + drag & drop */
{
  const team=$('#team'); const state=['kira','psalm',null,null,null];
  function render(){
    team.innerHTML='';
    state.forEach((id,i)=>{
      const s=el('div','tslot'); s.dataset.idx=i;
      s.innerHTML=`<span class="tslot__idx">${String(i+1).padStart(2,'0')}</span><div class="tslot__empty"></div>`;
      if(id){ const d=ROSTER[id]; s.classList.add('is-filled','f-'+d.faction); s.appendChild(portraitEl(d)); s.insertAdjacentHTML('beforeend', `<div class="tslot__name">${d.name}</div><button class="tslot__x" title="Gỡ">×</button>`);
        s.querySelector('.tslot__x').addEventListener('click',()=>{ state[i]=null; render(); }); }
      if(i===2 && !id && !team.dataset.touched) s.classList.add('is-over');   // demo tĩnh trạng thái drag-over
      s.addEventListener('dragover', ev=>{ ev.preventDefault(); team.dataset.touched='1'; team.querySelectorAll('.is-over').forEach(x=>x.classList.remove('is-over')); s.classList.add('is-over'); });
      s.addEventListener('dragleave', ()=>s.classList.remove('is-over'));
      s.addEventListener('drop', ev=>{ ev.preventDefault(); const id=ev.dataTransfer.getData('text/plain'); if(!ROSTER[id]) return; const j=state.indexOf(id); if(j>-1) state[j]=null; state[i]=id; render(); });
      team.appendChild(s);
    });
  }
  render();
}
/* B5: casting demo lặp */
setInterval(()=>{ const i=$('#castDemo'); i.style.animation='none'; void i.offsetWidth; i.style.animation=''; }, 1300);
/* B6: turn bar demo tự chạy */
{
  const seq=['kira','scav','psalm','rigger','ronin','bulwark','ash','muzzle'].map(id=>ROSTER[id]||{...ENEMY_POOL.find(e=>e.id===id), portrait:[], pos:''});
  let i=0; const bar=$('#turnDemo'); const tiles=new Map();
  const mk=(u,key)=>{ const k=u.id+key; if(!tiles.has(k)){ const t=el('div',`tu tu--${u.faction}`); t.appendChild(portraitEl(u)); t.insertAdjacentHTML('beforeend','<span class="tu__lbl">NOW</span><i class="tu__mark"></i>'); tiles.set(k,t); } const t=tiles.get(k); t.classList.remove('is-active','is-next'); return t; };
  function draw(){ bar.innerHTML=''; const rest=seq.slice(i), next=seq.slice(0,Math.max(0,7-rest.length));
    rest.forEach((u,k)=>{ const t=mk(u,'a'); if(k===0) t.classList.add('is-active'); bar.appendChild(t); }); if(next.length){ bar.appendChild(el('i','turn__sep')); next.forEach(u=>{ const t=mk(u,'n'); t.classList.add('is-next'); bar.appendChild(t); }); } }
  draw(); setInterval(()=>{ i=(i+1)%seq.length; draw(); },1600);
}
/* B7: số bay lên */
{
  const box=$('#dmgDemo');
  const fire=()=>{ const s=box.getBoundingClientRect(); const put=(x,txt,k,delay)=>setTimeout(()=>{ const d=el('div','dmg'+(k?' dmg--'+k:''),txt); d.style.left=x+'%'; d.style.top='70%'; box.appendChild(d); d.addEventListener('animationend',()=>d.remove()); },delay);
    put(18,'151','',0); put(50,'232','crit',180); put(82,'+84','heal',360); };
  fire(); $('#btnDmg').addEventListener('click',fire); setInterval(fire,3200);
}
/* A: swatches — đọc giá trị computed để kiểm tra theme */
function renderSwatches(){
  const names=[['--chrome','Chrome'],['--chrome-hi','Chrome hi'],['--chrome-white','Chrome white'],['--chrome-slate','Chrome slate'],
    ['--rust','Rust'],['--rust-hi','Rust hi'],['--rust-acid','Rust acid'],['--rust-grime','Rust grime'],
    ['--tier-s','Tier S'],['--tier-a','Tier A'],['--tier-b','Tier B'],
    ['--bg-0','bg 0'],['--bg-1','bg 1'],['--surface-1','surface 1'],['--surface-2','surface 2'],['--surface-3','surface 3'],['--surface-4','surface 4'],
    ['--line-1','line 1'],['--line-2','line 2'],['--line-3','line 3'],['--text-1','text 1'],['--text-2','text 2'],['--text-3','text 3'],
    ['--hp','hp'],['--hp-mid','hp mid'],['--hp-low','hp low'],['--heal','heal'],['--crit','crit'],['--energy','energy'],['--energy-full','energy full']];
  const cs=getComputedStyle(document.documentElement);
  $('#swatches').innerHTML=names.map(([v,n])=>`<div class="sw"><i style="--c:var(${v})"></i><b>${n}<small>${v} · ${cs.getPropertyValue(v).trim()}</small></b></div>`).join('');
}
renderSwatches();
