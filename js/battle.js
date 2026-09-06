'use strict';
/* BATTLE — engine trận đấu: unit, lượt, sát thương, animation, ult, cut-in, wave. */

/* =====================================================================
   BATTLE ENGINE
   ===================================================================== */
const B = { units:[], queue:[], idx:0, round:0, target:null, busy:false, over:false, frames:{}, actorId:null };
const UI = {
  stage:$('#stage'), allies:$('#allies'), enemies:$('#enemies'), turnbar:$('#turnbar'), ticker:$('#ticker'), fx:$('#fx'), log:$('#log'),
  btnAttack:$('#btnAttack'), btnUlt:$('#btnUlt'), ultName:$('#ultName'), ultMeta:$('#ultMeta'), ultBar:$('#ultBarFill'), ultInfo:$('#ultInfo'),
  banner:$('#ultBanner'), ubName:$('#ubName'), ubSub:$('#ubSub'), stageflash:$('#stageflash'), result:$('#result'), roundNo:$('#roundNo'), waveNo:$('#waveNo'), sectorNo:$('#sectorNo'),
};

function makeUnit(def, side, i){
  return { ...def, side, uid:side+'-'+i, hp:def.hp, hpMax:def.hp, energy:0, alive:true, controlled:false,
           chips: def.talent && def.talent.guard ? [{ type:'guard', label:def.talent.name, val:def.talent.guard }] : [],
           el:null };
}
const alive = side => B.units.filter(u=>u.alive && (!side || u.side===side));
const current = () => B.queue[B.idx];

function battleTeam(){
  let ids=TEAM.slice();
  (SECTOR.guest||[]).filter(g=>!owns(g)&&!ids.includes(g)).forEach(g=>{ ids=[...ids.slice(0,4), g]; });   // khách thế slot cuối
  return ids;
}
function initBattle(){
  // đội mình: nhân ATK/HP theo cấp nâng cấp (state.js)
  B.units = battleTeam().map((id,i)=>{ const d=ROSTER[id], m=statMult(id); return makeUnit({...d, atk:Math.round(d.atk*m), hp:Math.round(d.hp*m), level:lvl(id)},'ally',i); });
  B.round=0; B.idx=0; B.target=null; B.busy=false; B.over=false; B.wave=0;
  UI.log.innerHTML=''; UI.result.hidden=true; UI.fx.innerHTML=''; turnTiles.clear();
  UI.sectorNo.textContent=SECTOR.id;
  UI.stage.classList.remove('has-bg'); UI.stage.style.removeProperty('--bgimg');
  applyBg(UI.stage, SECTOR).then(ok=>{ if(ok) UI.stage.classList.add('has-bg'); });
  renderSide('ally'); preloadFrames();
  UI.enemies.innerHTML='';
  const st=STORY[SECTOR.id];
  (st&&st.intro&&!B.skipIntro&&!(PLAYER.settings&&PLAYER.settings.skipStory) ? playStory(st.intro, SECTOR) : Promise.resolve()).then(()=>{ if(!B.over){ spawnWave(); newRound(); } });
}
/* Nạp ảnh nền sector vào một phần tử (sân đấu hoặc màn hội thoại) với zoom/dim đúng */
async function applyBg(elm, sector){
  const src=await loadFirst(sector.bg); if(!src) return false;
  const fb=/bg_battle\./.test(src);                 // ảnh dự phòng → dùng tham số riêng của nó
  elm.style.setProperty('--bgimg',`url("${src}")`);
  elm.style.setProperty('--bgzoom', fb ? BG_FALLBACK.zoom : (sector.bgZoom||1.3));
  elm.style.setProperty('--bgdim',  fb ? BG_FALLBACK.dim  : (sector.bgDim||0));
  return true;
}
/* Gọi wave kế: giữ nguyên đội mình (HP/Energy/KIA), thay toàn bộ kẻ địch */
function spawnWave(){
  B.wave++; UI.waveNo.textContent=`${B.wave}/${SECTOR.waves}`;
  if(SECTOR.verse && B.wave>1){                                             // VERSE: bài hát gốc át deck
    // Ronin không Halo, không nhận lệnh qua deck → bài hát không với tới anh
    alive('ally').forEach(u=>{ if(u.energy>0 && u.id!==RIPOSTE.src){u.energy=Math.max(0,u.energy-25); u.chips=u.chips.filter(c=>c.label!=='VERSE'); u.chips.push({type:'debuff',label:'VERSE',val:'−25'}); updateUnit(u); setTimeout(()=>removeChip(u,'VERSE'),2500); } });
    log('VERSE — bài hát gốc át deck: toàn đội −25 Energy', true);
  }
  B.units = [ ...B.units.filter(u=>u.side==='ally'), ...rollWave(B.wave).map((d,i)=>makeUnit(d,'enemy',i)) ];
  B.target=null; renderSide('enemy');
  log(`Wave ${B.wave}/${SECTOR.waves}: ${alive('enemy').map(e=>e.name).join(' · ')}`, true);
}
async function waveTransition(){
  B.busy=true; setInputs(false); AUDIO.wave();
  UI.ubName.textContent=`WAVE ${String(B.wave+1).padStart(2,'0')}`; UI.ubSub.textContent='HOSTILES INBOUND';
  UI.banner.style.setProperty('--accent','var(--rust)');
  UI.banner.classList.remove('show'); void UI.banner.offsetWidth; UI.banner.classList.add('show');
  await wait(reduced()?300:1000);
  spawnWave(); B.busy=false; newRound();
}

/* ---- Đội hình trên sân: % trong vùng phe (x từ trái, y từ đáy), z = thứ tự vẽ, sc = thu nhỏ hàng sau.
   Đội mình: hàng trước 3 (slot 0/2/4), hàng sau 2 (slot 1/3). Tinh chỉnh tự do. ---- */
const FORMATION = {
  ally:  [{x:66,y:2,z:5},{x:32,y:17,z:4,sc:.92},{x:66,y:32,z:3},{x:32,y:46,z:2,sc:.92},{x:66,y:60,z:1}],
  enemy: [{x:40,y:4,z:3},{x:57,y:34,z:2},{x:40,y:58,z:1}],
};
function unitEl(u,pos){
  const e=el('div',`unit unit--${u.side} unit--${u.faction} unit--${(u.tier||'b').toLowerCase()}`);
  e.dataset.uid=u.uid;
  e.style.cssText=`--x:${pos.x}%;--y:${pos.y}%;--z:${pos.z};--sc:${pos.sc||1};--bob-delay:${-Math.round(Math.random()*2400)}ms`;
  e.innerHTML=`<div class="unit__sprite"><div class="unit__shadow"></div><div class="unit__ring"></div>
      <div class="unit__bob"><div class="unit__pose"><div class="sil sil--free ${u.faction==='rust'?'sil--rust':''}"><span class="sil__lbl">NO SPRITE</span></div>
      <div class="unit__frame"><img alt=""><div class="unit__flash"></div></div></div></div>
      <div class="unit__brk"><i></i></div><span class="unit__tgt">TGT</span><div class="kia">KIA</div></div>
    <div class="unit__plate"><div class="unit__name"><span>${u.name}</span>${u.side==='ally'?`<span class="tier">${u.tier}</span>`:`<span class="rank">${u.rank==='boss'?'BOSS':u.rank==='elite'?'ELITE':'ATK '+u.atk}</span>`}</div>${hpBar()}</div>`;
  const plate=e.querySelector('.unit__plate');
  if(u.side==='ally') plate.appendChild(energyBarEl(u.energyMax));
  plate.insertAdjacentHTML('beforeend',`<div class="unit__hp mono"></div><div class="chips"></div><span class="unit__ready">READY</span>`);
  if(u.side==='enemy') e.addEventListener('click',()=>{ if(u.alive) setTarget(u); });
  return e;
}
function renderSide(side){
  const host = side==='ally'?UI.allies:UI.enemies; host.innerHTML='';
  B.units.filter(u=>u.side===side).forEach(u=>{
    const i=+u.uid.split('-')[1]; let pos=FORMATION[side][i];
    if(u.rank==='boss') pos={...pos, x:pos.x-12, sc:1.28, z:pos.z+3};   // boss to hơn, lùi vào trong, vẽ đè lên
    else if(u.rank==='elite') pos={...pos, sc:1.08};
    u.el=unitEl(u,pos); if(u.rank) u.el.classList.add('unit--'+u.rank);
    if(u.link){ u.chips.push({type:'buff',label:'HALO LINK'}); }
    host.appendChild(u.el); updateUnit(u);
  });
}
function updateUnit(u){
  const e=u.el; if(!e) return;
  setHpBar(e.querySelector('.bar'), u.hp, u.hpMax);
  e.querySelector('.unit__hp').textContent = `${Math.max(0,u.hp)}/${u.hpMax}`;
  const eb=e.querySelector('.ebar'); if(eb){ setEnergyBar(eb,u.energy,u.energyMax); e.classList.toggle('is-ready', u.energy>=u.energyMax && u.alive); }
  e.querySelector('.chips').innerHTML = u.chips.map(c=>`<span class="chip chip--${c.type}">${c.label}${c.val?` <em>${c.val}</em>`:''}</span>`).join('');
  e.classList.toggle('is-dead', !u.alive);
}
function addChip(u,type,label,val){ u.chips.push({type,label,val}); updateUnit(u); }
function removeChip(u,label){ u.chips=u.chips.filter(c=>c.label!==label); updateUnit(u); }
/* OVERLOAD — Wire cắm stack bằng đòn thường; mỗi stack +10% sát thương mục tiêu phải nhận (mọi nguồn).
   Không tự nổ: chỉ DEAD SHORT mới ăn stack, xem docs/mechanics.md */
const OVERLOAD = { label:'OVERLOAD', max:3, vuln:.10, src:'wire' };
const overloadStacks = u => { const c=u.chips.find(c=>c.label===OVERLOAD.label); return c ? c.val : 0; };
/* MUTE — Echo cắt mục tiêu khỏi bài hát: gây ít sát thương hơn và rụng khỏi HALO LINK.
   Hết hạn ở lượt của chính mục tiêu, mượn nguyên khuôn `controlled` nên không cần bộ đếm lượt */
const MUTE = { label:'MUTE', dmg:.25, src:'echo' };
/* SỔ — Stitch ghi mọi sát thương đồng đội phải chịu; SUTURE trả sổ rồi xoá.
   Bà phải còn sống mới ghi được, xem docs/mechanics.md */
const HOURS  = { label:'GIỜ',  src:'meridian' };         // giờ Meridian đã tiêu; chỉ đi lên
const SHIELD = { label:'TƯỜNG' };                        // lá chắn: ăn sát thương TRƯỚC máu
const hoursOf = u => { const c=u.chips.find(x=>x.label===HOURS.label); return c?c.val:0; };
function tickHours(){
  const m=B.units.find(u=>u.id===HOURS.src && u.side==='ally' && u.alive); if(!m) return;
  const c=m.chips.find(x=>x.label===HOURS.label);
  if(c) c.val++; else m.chips.push({ type:'hours', label:HOURS.label, val:1 });
  updateUnit(m);
}
function setBarrier(u, n){
  u.barrier=Math.max(u.barrier||0, n);
  const c=u.chips.find(x=>x.label===SHIELD.label);
  if(c) c.val=u.barrier; else u.chips.push({ type:'shield', label:SHIELD.label, val:u.barrier });
  updateUnit(u);
}
function drainBarrier(u, dmg){
  if(!u.barrier) return dmg;
  const soak=Math.min(u.barrier, dmg); u.barrier-=soak;
  if(u.barrier<=0){ u.barrier=0; removeChip(u,SHIELD.label); }
  else { const c=u.chips.find(x=>x.label===SHIELD.label); if(c) c.val=u.barrier; updateUnit(u); }
  return dmg-soak;
}
const GUARD = { src:'muzzle' };                          // Muzzle đỡ thay đồng đội; Bà Ba chịu ba đòn
const guardOf = u => u.chips.find(c=>c.type==='guard');
function mendGuard(m, n){
  const c=guardOf(m); if(!c || !m.talent) return;
  c.val=Math.min(m.talent.guard, c.val+n); updateUnit(m);
}
const CHARGE = { label:'MÌN', mult:.6, src:'ash' };      // Ash gài mìn; nổ khi kẻ mang nó chết, có dây chuyền
const hasCharge = u => u.chips.some(c=>c.label===CHARGE.label);
function plantCharge(tgt){
  if(hasCharge(tgt)) return;
  tgt.chips.push({ type:'charge', label:CHARGE.label }); updateUnit(tgt);
}
function detonate(tgt){
  removeChip(tgt, CHARGE.label);                                    // gỡ TRƯỚC → dây chuyền chắc chắn dừng
  const src=B.units.find(u=>u.id===CHARGE.src && u.side==='ally');  // nổ kể cả khi Ash đã ngã
  const others=alive('enemy').filter(x=>x!==tgt);
  if(!src || !others.length) return;
  log(`MÌN nổ trên ${tgt.name}`, true);
  others.forEach(x=>{ if(x.alive) dealDamage(src, x, CHARGE.mult); });
}
const RIPOSTE = { label:'ĐÁP', mult:.6, src:'ronin' };   // Ronin chém trả ngay khi bị đánh; cũng là người miễn VERSE
const LEDGER = { label:'SỔ', src:'stitch' };
const ledgerKeeper = () => B.units.find(u=>u.id===LEDGER.src && u.side==='ally' && u.alive);
function noteLedger(dmg){
  const s=ledgerKeeper(); if(!s) return;
  const cap=Math.round(s.atk*((s.ult&&s.ult.ledgerMax)||8));
  s.ledger=Math.min(cap,(s.ledger||0)+dmg);
  const c=s.chips.find(c=>c.label===LEDGER.label);
  if(c) c.val=s.ledger; else s.chips.push({ type:'ledger', label:LEDGER.label, val:s.ledger });
  updateUnit(s);
}
function addMute(tgt){
  tgt.muted = true;
  if(!tgt.chips.some(c=>c.label===MUTE.label)) tgt.chips.push({ type:'mute', label:MUTE.label, val:'1T' });
  updateUnit(tgt);
}
function addOverload(tgt){
  const c=tgt.chips.find(c=>c.label===OVERLOAD.label);
  if(c){ if(c.val>=OVERLOAD.max) return c.val; c.val++; }
  else tgt.chips.push({ type:'overload', label:OVERLOAD.label, val:1 });
  updateUnit(tgt); return overloadStacks(tgt);
}

/* ---- Sprite: preload frame idle/attack cho cả đội ---- */
function preloadFrames(){
  battleTeam().forEach(id=>{
    const d=ROSTER[id];
    const box=d.sprites.box||{};
    B.frames[id] = Promise.all([loadFirst(d.sprites.idle), loadFirst(d.sprites.attack), loadFirst(d.sprites.hurt)])
      .then(([idle,attack,hurt])=>({ idle:idle&&{src:idle, box:box.idle},
        attack:(attack&&{src:attack, box:box.attack}) || (idle&&{src:idle, box:box.idle}),
        hurt:  hurt&&{src:hurt, box:box.hurt} }));
  });
  B.units.filter(u=>u.side==='ally').forEach(mountSprite);
}
/* Đặt frame vào hộp 744×682 của unit: neo chân (box.ax) trùng x=372, sàn trùng đáy hộp.
   Frame không có box (ảnh fallback) → chiếm trọn hộp, object-fit contain đáy. */
function setFrame(u, frame){
  const b=frame.box, fb=u.el.querySelector('.unit__frame'), st=fb.style;
  if(b){ st.width=(b.w/744*100)+'%'; st.height=(b.h/682*100)+'%'; st.left=((372-b.ax)/744*100)+'%'; }
  else { st.width='100%'; st.height='100%'; st.left='0'; }
  fb.querySelector('img').src=frame.src; fb.querySelector('.unit__flash').style.setProperty('--mask', `url("${frame.src}")`);
}
async function mountSprite(u){
  const f=await B.frames[u.id]; if(!f||!f.idle||!u.el) return;
  setFrame(u,f.idle); u.el.querySelector('.unit__pose').classList.add('has-img');
}
/* Chớp trắng opacity .26 tắt dần 200ms, che khoảnh khắc đổi frame */
function flashSprite(u){
  const pose=u.el.querySelector('.unit__pose');
  if(pose.classList.contains('has-img')) pose.querySelector('.unit__flash').animate([{opacity:.26},{opacity:0}],{duration:200,easing:'linear'});
  else pose.querySelector('.sil').animate([{filter:'brightness(2.2)'},{filter:'brightness(1)'}],{duration:200,easing:'linear'});
}
/* Trúng đòn: đổi sang frame hurt (nếu có) + giật lùi 300ms + chớp đỏ, rồi về idle.
   Chết: giữ frame hurt, mất bão hoà, sụm nhẹ xuống (CSS .is-dead). */
async function playHurt(u, killed){
  const e=u.el; e.classList.add('is-hit'); setTimeout(()=>e.classList.remove('is-hit'), 320);
  const f = B.frames[u.id] ? await B.frames[u.id] : null;
  if(!f||!f.hurt) return;
  flashSprite(u); setFrame(u, f.hurt);
  if(killed) return;
  await wait(reduced()?200:420);
  if(!u.alive) return;
  flashSprite(u); setFrame(u, f.idle);
}
const animDone = (a, ms) => Promise.race([a.finished.catch(()=>{}), wait(ms+80)]);
/* Attack: +28px/90ms out (scale 1.02,.96) → giữ 120ms → về 0/180ms. Tổng 390ms */
async function playAttackAnim(u){
  const f = await B.frames[u.id]; const pose=u.el.querySelector('.unit__pose');
  flashSprite(u);
  if(f&&f.attack) setFrame(u,f.attack);
  if(!reduced()){
    // animDone: không chỉ chờ .finished — tab nền/bị throttle có thể không tick animation → kèm timeout để trận không treo
    const out = pose.animate([{transform:'translateX(0) scale(1,1)'},{transform:'translateX(28px) scale(1.02,.96)'}],{duration:90,easing:'cubic-bezier(.16,.9,.3,1)',fill:'forwards'});
    await animDone(out,90); await wait(120);
    const back = pose.animate([{transform:'translateX(28px) scale(1.02,.96)'},{transform:'translateX(0) scale(1,1)'}],{duration:180,easing:'cubic-bezier(.3,0,.4,1)',fill:'forwards'});
    await animDone(back,180); out.cancel(); back.cancel();
  } else { await wait(390); }
  flashSprite(u);
  if(f&&f.idle) setFrame(u,f.idle);
}

/* ---- Số bay lên ---- */
function spawnNumber(targetEl, text, kind){
  const s=UI.fx.getBoundingClientRect(), r=targetEl.getBoundingClientRect();
  const d=el('div','dmg'+(kind?' dmg--'+kind:''), text);
  d.style.left = (r.left + r.width/2 - s.left + (Math.random()*20-10)) + 'px';
  d.style.top  = (r.top + r.height*.38 - s.top) + 'px';
  UI.fx.appendChild(d); d.addEventListener('animationend',()=>d.remove());
}

/* ---- Sát thương ---- */
function dealDamage(src, tgt, mult, opts={}){
  const crit = !opts.exact && Math.random() < RULES.critChance;      // exact: đúng con số, không may rủi
  const v = opts.exact ? 1 : 1 + (Math.random()*2-1)*RULES.variance;
  const vuln = 1 + overloadStacks(tgt)*OVERLOAD.vuln;
  const hush = src.muted ? (1-MUTE.dmg) : 1;                 // câm thì đánh yếu đi
  const dmg = Math.round(src.atk * mult * v * vuln * hush * (crit?RULES.critMult:1));
  const dealt = drainBarrier(tgt, dmg);                    // TƯỜNG ăn trước máu
  tgt.hp = Math.max(0, tgt.hp - dealt);
  if(tgt.side==='ally' && dealt>0) noteLedger(dealt);      // sổ chỉ ghi phần chảy máu thật
  spawnNumber(tgt.el.querySelector('.unit__sprite'), dealt>0?dealt:dmg, dealt>0?(crit?'crit':''):'heal');
  const mined = tgt.side==='enemy' && hasCharge(tgt);      // đọc TRƯỚC dòng tgt.chips=[]
  const killed = tgt.hp<=0 && tgt.alive;
  if(killed){ tgt.alive=false; tgt.chips=[]; }
  if(killed) AUDIO.kia(); else if(crit) AUDIO.crit(); else AUDIO.hit();
  playHurt(tgt, killed);
  updateUnit(tgt);
  log(`${src.name} → ${tgt.name} · ${dmg}${crit?' CRIT':''}${killed?' · KIA':''}`, crit||killed);
  if(killed && B.target===tgt) B.target=null;
  if(killed && mined) detonate(tgt);                       // dây chuyền phá dỡ
  return {dmg,crit,killed};
}
function heal(src, tgt, amount){
  const before=tgt.hp; tgt.hp=Math.min(tgt.hpMax, tgt.hp+amount);
  spawnNumber(tgt.el.querySelector('.unit__sprite'), '+'+(tgt.hp-before), 'heal'); updateUnit(tgt); AUDIO.heal();
}
function gainEnergy(u, n){ const was=u.energy; u.energy=Math.min(u.energyMax, u.energy+n); updateUnit(u); if(u===current()) updateUltButton(u); if(was<u.energyMax && u.energy>=u.energyMax) AUDIO.ready(); }

/* ---- Lượt ---- */
function buildQueue(){
  // ★ FAKE thứ tự: hệ chỉ có ATK/HP/Energy, chưa có tốc độ → xen kẽ ta/địch theo slot
  const a=alive('ally'), e=alive('enemy'), q=[];
  for(let i=0;i<Math.max(a.length,e.length);i++){ if(a[i]) q.push(a[i]); if(e[i]) q.push(e[i]); }
  return q;
}
function newRound(){ B.round++; UI.roundNo.textContent=String(B.round).padStart(2,'0');
  const m=B.units.find(u=>u.id===GUARD.src && u.side==='ally' && u.alive); if(m) mendGuard(m,1);   // Bà Ba hồi 1 lượt chắn
  tickHours();                                                                                   // Meridian tiêu thêm một giờ
  B.queue=buildQueue(); B.idx=0; startTurn(); }
/* Ô chân dung trong thanh lượt được tạo một lần rồi tái sử dụng (không reload ảnh mỗi lượt) */
const turnTiles = new Map();
function turnTile(u, key){
  const k=u.uid+key; if(!turnTiles.has(k)){ const t=el('div',`tu tu--${u.faction}`); t.appendChild(portraitEl(u)); t.insertAdjacentHTML('beforeend','<span class="tu__lbl">NOW</span><i class="tu__mark"></i>'); turnTiles.set(k,t); }
  const t=turnTiles.get(k); t.classList.remove('is-active','is-next'); return t;
}
function renderTurnbar(){
  UI.turnbar.innerHTML='';
  const rest=B.queue.slice(B.idx).filter(u=>u.alive);
  const next=buildQueue().slice(0, Math.max(0, 7-rest.length));
  rest.forEach((u,i)=>{ const t=turnTile(u,'a'); if(i===0) t.classList.add('is-active'); UI.turnbar.appendChild(t); });
  if(next.length){ UI.turnbar.appendChild(el('i','turn__sep')); next.forEach(u=>{ const t=turnTile(u,'n'); t.classList.add('is-next'); UI.turnbar.appendChild(t); }); }
}
function ensureTarget(){ if(!B.target||!B.target.alive){ const e=alive('enemy'); B.target=e[0]||null; } B.units.forEach(u=>u.el&&u.el.classList.toggle('is-target',u===B.target)); return B.target; }
function setTarget(u){ B.target=u; ensureTarget(); ticker(`Mục tiêu: ${u.name}`); }
function setInputs(on){ UI.btnAttack.disabled=!on; if(!on){ UI.btnUlt.dataset.state='locked'; } }
function updateUltButton(u){
  UI.btnUlt.classList.toggle('btn-ult--rust', u.faction==='rust');
  UI.ultName.textContent=u.ult.name;
  UI.ultBar.style.setProperty('--p', (u.energy/u.ult.cost*100)+'%');
  if(u.energy>=u.ult.cost){ UI.btnUlt.dataset.state='ready'; UI.ultMeta.textContent=`${u.energy}/${u.ult.cost} · ${u.ult.kind==='control'?'CONTROL':u.ult.kind==='heal'?'HEAL':Math.round(u.ult.mult*100)+'% ATK'}`; }
  else { UI.btnUlt.dataset.state='locked'; UI.ultMeta.textContent=`−${u.ult.cost-u.energy} EN · ${u.energy}/${u.ult.cost}`; }
  UI.ultInfo.innerHTML=`<b>${u.name} · ${u.ult.name}</b>${u.ult.desc}<span class="mono">COST ${u.ult.cost} · ENERGY ${u.energy}/${u.energyMax}</span>`;
}
function ticker(t){ UI.ticker.textContent=t; }
function log(t, hi){ const li=el('li', hi?'hi':'', `<b>R${B.round}</b>${t}`); UI.log.prepend(li); ticker(t); }

async function startTurn(){
  if(B.over) return;
  const u=current();
  if(!u){ return newRound(); }
  if(!u.alive){ return endTurn(); }
  renderTurnbar();
  B.units.forEach(x=>x.el&&x.el.classList.toggle('is-active', x===u));
  if(u.side==='ally'){
    ensureTarget(); setInputs(true); updateUltButton(u); ticker(`${u.name} — chọn hành động`);
  } else {
    setInputs(false); ticker(`${u.name} đang hành động…`);
    await wait(reduced()?250:700); await enemyAct(u);
  }
}
function endTurn(){
  if(B.over) return;
  if(!alive('enemy').length) return B.wave<SECTOR.waves ? waveTransition() : finish(true);
  if(!alive('ally').length) return finish(false);
  B.idx++;
  setTimeout(()=> B.idx>=B.queue.length ? newRound() : startTurn(), 0);
}
let finish = async function(win){
  B.over=true; setInputs(false);
  let rewardTxt='';
  if(win){
    const first=!PLAYER.cleared.includes(SECTOR.id); dailyProgress('win');
    if(first){ PLAYER.cleared.push(SECTOR.id); PLAYER.shards+=SECTOR.reward.shards; PLAYER.credits+=SECTOR.reward.credits; savePlayer();
      rewardTxt=`FIRST CLEAR · +${SECTOR.reward.shards} SH · +${SECTOR.reward.credits} CR`;
      if(SECTOR.unlock && !owns(SECTOR.unlock)){ PLAYER.owned.push(SECTOR.unlock); savePlayer(); rewardTxt+=`<br>NEW OPERATIVE · ${ROSTER[SECTOR.unlock].name} — đọc hồ sơ ở ARCHIVE`; } }
    else { const sh=Math.round(SECTOR.reward.shards*.25), cr=Math.round(SECTOR.reward.credits*.25);   // chơi lại = tuần tra, 25% thưởng
      PLAYER.shards+=sh; PLAYER.credits+=cr; savePlayer(); rewardTxt=`PATROL · +${sh} SH · +${cr} CR`; }
    syncSectorStates();
    const st=STORY[SECTOR.id]; if(st&&st.outro&&first&&!(PLAYER.settings&&PLAYER.settings.skipStory)){ await wait(700); await playStory(st.outro, SECTOR); }
  }
  UI.result.hidden=false; UI.result.className='result '+(win?'win':'lose');
  $('#resT').textContent = win?'SECTOR CLEARED':'SQUAD LOST';
  $('#resS').innerHTML = (win?`${SECTOR.waves} wave · round ${B.round} · ${alive('ally').length}/5 sống sót`:`Wave ${B.wave}/${SECTOR.waves} · round ${B.round} · toàn đội KIA`) + (rewardTxt?`<br><b class="result__rw">${rewardTxt}</b>`:'');
  log(win?'Thắng.':'Thua.', true);
};

async function playerAttack(){
  if(B.busy||B.over) return; const u=current(); if(!u||u.side!=='ally') return; const t=ensureTarget(); if(!t) return;
  B.busy=true; setInputs(false);
  const anim=playAttackAnim(u);
  await wait(90);                       // va chạm tại đỉnh của cú lao ra
  dealDamage(u,t,1);
  if(u.id===OVERLOAD.src && t.alive) addOverload(t);   // stack cắm sau, nên đòn này ăn theo số stack đã có
  if(u.id===MUTE.src && t.alive) addMute(t);
  if(u.id===CHARGE.src && t.alive) plantCharge(t);
  gainEnergy(u,25); dailyProgress('attacks');
  await anim; await wait(reduced()?80:160);
  B.busy=false; endTurn();
}
async function playerUlt(){
  if(B.busy||B.over) return; const u=current(); if(!u||u.side!=='ally'||u.energy<u.ult.cost) return;
  B.busy=true; UI.btnAttack.disabled=true; UI.btnUlt.dataset.state='casting'; UI.ultMeta.textContent='CASTING…';
  UI.ubName.textContent=u.ult.name; UI.ubSub.textContent=`${u.name} · ${u.ult.desc.split('.')[0]}`;
  UI.banner.style.setProperty('--accent', u.faction==='rust'?'var(--rust)':'var(--chrome)');
  UI.banner.classList.remove('show'); void UI.banner.offsetWidth; UI.banner.classList.add('show');
  UI.stageflash.animate([{opacity:.18},{opacity:0}],{duration:360,easing:'ease-out'});
  AUDIO.ult(); dailyProgress('ult');
  u.energy-=u.ult.cost; updateUnit(u);
  await wait(reduced()?150:420);
  await playCutin(u);                     // video ult nếu nhân vật có (bỏ qua nếu thiếu file / không phát được)
  const k=u.ult.kind;
  if(k==='nuke'){
    const t=ensureTarget(); const anim=playAttackAnim(u); await wait(90);
    const r=dealDamage(u,t,u.ult.mult,{exact:u.ult.exact});
    if(r.killed && u.ult.refundOnKill){ gainEnergy(u,u.ult.refundOnKill); addChip(u,'refund','EN REFUND','+'+u.ult.refundOnKill); log(`${u.name} hoàn ${u.ult.refundOnKill} Energy (kill)`, true); setTimeout(()=>removeChip(u,'EN REFUND'), 2500); }
    await anim;
  } else if(k==='aoe'){
    const anim=playAttackAnim(u); await wait(90);
    alive('enemy').forEach(t=>{                      // perStack: chỉ Wire có, người khác st=0 nên giữ nguyên hành vi cũ
      const st = u.ult.perStack ? overloadStacks(t) : 0;
      dealDamage(u, t, u.ult.mult + st*(u.ult.perStack||0));
      if(st) removeChip(t, OVERLOAD.label);
      if(u.ult.muteAll && t.alive) addMute(t);
    });
    if(u.ult.blowCharges) alive('enemy').filter(hasCharge).forEach(t=>detonate(t));   // con chết vì aoe đã nổ theo đường chết
    if(u.ult.perStack) log(`${u.name} kích nổ toàn bộ ${OVERLOAD.label}`, true);
    await anim;
  } else if(k==='heal'){
    const book = u.ult.ledgerShare ? (u.ledger||0) : 0;      // ledgerShare: chỉ Stitch có
    const amt  = Math.round(u.atk*u.ult.mult + book*(u.ult.ledgerShare||0));
    alive('ally').forEach(t=>heal(u,t,amt));
    if(u.ult.mendGuard && u.talent) mendGuard(u, u.talent.guard);
    if(u.ult.ledgerShare){ u.ledger=0; removeChip(u,LEDGER.label); log(`${u.name} trả sổ ${book} → hồi ${amt}/người`, true); }
    else log(`${u.name} hồi máu toàn đội`, true);
  } else if(k==='barrier'){
    const amt=Math.round(u.atk*u.ult.mult*(1+hoursOf(u)*(u.ult.perHour||0)));
    alive('ally').forEach(t=>setBarrier(t,amt));
    log(`${u.name} dựng vách — lá chắn ${amt}/người (giờ ${hoursOf(u)})`, true);
  } else if(k==='control'){
    const t=ensureTarget(); t.controlled=true; addChip(t,'control','CONTROLLED','1T'); log(`${u.name} chiếm quyền điều khiển ${t.name}`, true);
  }
  await wait(reduced()?200:600);
  B.busy=false; endTurn();
}
/* ---- Cut-in video chiêu cuối ---- */
const videoCache=new Map();
function resolveVideo(list){
  if(!list||!list.length) return Promise.resolve(null);
  const key=list.join('|'); if(videoCache.has(key)) return videoCache.get(key);
  const p=(async()=>{ for(const src of list){ try{ const r=await fetch(encodeURI(src),{method:'HEAD'}); if(r.ok) return encodeURI(src); }catch(e){} } return null; })();
  videoCache.set(key,p); return p;
}
async function playCutin(u){
  const src=await resolveVideo(u.ultVideo); if(!src) return;
  const box=$('#cutin'), v=$('#cutinVideo');
  $('#cutinWho').textContent=`${u.name} · ULTIMATE`; $('#cutinName').textContent=u.ult.name;
  box.style.setProperty('--accent', u.faction==='rust'?'var(--rust)':'var(--chrome)');
  v.src=src; v.currentTime=0; v.muted=!(PLAYER.settings&&PLAYER.settings.sound); box.hidden=false; sfx('open',.5);
  await new Promise(async res=>{
    let done=false; const end=()=>{ if(!done){ done=true; res(); } };
    v.onended=end; v.onerror=end; $('#cutinSkip').onclick=end;
    const guard=setTimeout(end, 8000);                        // không bao giờ treo trận
    try{ await v.play(); }catch(e){ v.muted=true; try{ await v.play(); }catch(e2){ end(); } }
    v.addEventListener('ended',()=>clearTimeout(guard),{once:true});
  });
  v.pause(); box.hidden=true; v.removeAttribute('src'); v.load();
}
async function enemyAct(e){
  if(e.link && !e.muted && e.alive && alive('enemy').some(x=>x!==e && x.link && !x.muted)){   // HALO LINK — câm thì rụng khỏi mạng
    const amt=Math.round(e.hpMax*.08); if(e.hp<e.hpMax){ heal(e,e,amt); log(`${e.name} hồi ${amt} HP qua HALO LINK`); await wait(reduced()?100:350); }
  }
  let tgt;
  if(e.controlled){
    e.controlled=false; removeChip(e,'CONTROLLED');
    const others=alive('enemy').filter(x=>x!==e); tgt=others.length?rand(others):e;
    log(`${e.name} bị điều khiển → tấn công ${tgt.name}`, true);
  } else {
    const a=alive('ally'); if(!a.length) return endTurn(); tgt=rand(a);
  }
  let soak=0;
  if(tgt.side==='ally' && tgt.id!==GUARD.src){                 // BÀ BA — đổi đích sang Muzzle
    const m=B.units.find(u=>u.id===GUARD.src && u.side==='ally' && u.alive);
    const c=m && guardOf(m);
    if(c && c.val>0){ c.val--; updateUnit(m); log(`${m.name} đỡ thay ${tgt.name}`, true); tgt=m; soak=m.talent.soak; }
  }
  e.el.classList.add('is-lunge'); setTimeout(()=>e.el.classList.remove('is-lunge'),300);
  await wait(reduced()?0:110);
  dealDamage(e,tgt,soak||1);
  if(tgt.id===RIPOSTE.src && tgt.alive && e.alive){          // ĐÁP — chém trả ngay, không chờ lượt
    addChip(tgt,'riposte',RIPOSTE.label); setTimeout(()=>removeChip(tgt,RIPOSTE.label), 1200);
    await wait(reduced()?60:180);
    dealDamage(tgt,e,RIPOSTE.mult);
  }
  if(e.muted){ e.muted=false; removeChip(e,MUTE.label); }   // câm hết hạn SAU khi nó đã đánh xong lượt này
  await wait(reduced()?200:520);
  endTurn();
}
UI.btnAttack.addEventListener('click', playerAttack);
UI.btnUlt.addEventListener('click', playerUlt);
$('#btnReset').addEventListener('click', ()=>{ B.skipIntro=true; initBattle(); B.skipIntro=false; });
$('#btnAgain').addEventListener('click', ()=>{ B.skipIntro=true; initBattle(); B.skipIntro=false; });
