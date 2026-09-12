'use strict';
/* BATTLE — engine trận đấu: unit, passive, lượt theo SPD, chọn mục tiêu, di chuyển tới mục tiêu (kiểu Idle Heroes), sát thương + chí mạng,
   trạng thái (choáng/độc/cháy), ult + video holo trên đầu nhân vật, wave, hint. Overlay hiệu ứng: js/fx.js. */

/* =====================================================================
   BATTLE ENGINE
   B.mode: 'idle' | 'target' (đang chờ người chơi chạm kẻ địch). B.gen tăng mỗi lần initBattle: mọi hàm async
   chụp lại gen và dừng nếu trận đã bị reset giữa chừng (RESET / RETRY / BASE).
   ===================================================================== */
/* opened = kẻ địch LẦN ĐẦU bị hạ trong trận này, để bảng kết quả in "MỞ BỂ · <tên>". */
const B = { units:[], queue:[], idx:0, round:0, target:null, busy:false, over:false, frames:{}, mode:'idle', pending:null, gen:0, opened:[] };
const UI = {
  stage:$('#stage'), allies:$('#allies'), enemies:$('#enemies'), turnbar:$('#turnbar'), ticker:$('#ticker'), fx:$('#fx'), log:$('#log'),
  btnAttack:$('#btnAttack'), btnUlt:$('#btnUlt'), ultName:$('#ultName'), ultMeta:$('#ultMeta'), ultBar:$('#ultBarFill'), ultInfo:$('#ultInfo'),
  banner:$('#ultBanner'), ubName:$('#ubName'), ubSub:$('#ubSub'), stageflash:$('#stageflash'), result:$('#result'), roundNo:$('#roundNo'), waveNo:$('#waveNo'), sectorNo:$('#sectorNo'),
  hint:$('#hint'), hintText:$('#hintText'),
};

function makeUnit(def, side, i){
  return { ...def, side, uid:side+'-'+i, hp:def.hp, hpMax:def.hp, energy:0, shield:0, alive:true, controlled:false, chips:[], status:[], active:[], el:null };
}
const alive = side => B.units.filter(u=>u.alive && (!side || u.side===side));
const current = () => B.queue[B.idx];

/* Đội ra trận: sector ép đội (tutorial) hoặc TEAM đã chọn. Khách chưa sở hữu thế một slot: ưu tiên người trong SECTOR.guestSwap
   (07-C: Kai "ở lại giữ đường lui" theo comic), không thì slot cuối không phải Yuki — Yuki là nhân vật chính, comic và passive
   CA THỨ 313 cần cô có mặt. scratch/sim.js dùng cùng luật. */
function battleTeam(){
  let ids=(SECTOR.team||TEAM).filter(Boolean).slice(0,TEAM_SIZE);
  (SECTOR.guest||[]).filter(g=>!owns(g)&&!ids.includes(g)).forEach(g=>{
    const pref=(SECTOR.guestSwap||[]).find(id=>ids.includes(id));
    let i=pref?ids.indexOf(pref):-1;
    if(i<0){ for(let k=ids.length-1;k>=0;k--){ if(ids[k]!=='yuki'){ i=k; break; } } }
    if(i<0) i=ids.length-1;
    if(i<0) ids.push(g); else ids[i]=g;
  });
  return ids;
}
/* ---- Passive: xét một lần lúc vào trận. Điều kiện địch tính trên toàn bộ sector (biết trước sẽ gặp ai). ---- */
const sectorEnemyDefs = () => [...new Set((SECTOR.plan||[]).flat())].map(id=>ENEMY_POOL.find(e=>e.id===id)).filter(Boolean);
function passiveOn(p, teamIds, enemyDefs, self){
  const w=p.when||{};
  if(w.always) return true;
  if(w.ally) return w.ally!==self.id && teamIds.includes(w.ally);
  if(w.allyAny) return w.allyAny.some(id=>id!==self.id && teamIds.includes(id));
  if(w.enemy) return enemyDefs.some(e=>e.id===w.enemy);
  if(w.enemyFaction) return enemyDefs.some(e=>e.faction===w.enemyFaction);
  return false;
}
function applyStaticPassives(u, teamIds, enemyDefs){
  u.active=(u.passives||[]).filter(p=>passiveOn(p,teamIds,enemyDefs,u));
  let atk=1, hp=1, en=0;
  u.active.forEach(({effect:e={}})=>{ atk+=(e.atkPct||0)/100; hp+=(e.hpPct||0)/100; en=Math.max(en,e.energyStart||0); });
  u.atk=Math.round(u.atk*atk); u.hpMax=Math.round(u.hpMax*hp); u.hp=u.hpMax; u.energy=Math.min(u.energyMax,en);
  u.active.forEach(p=>u.chips.push({type:'buff',label:p.tag||p.name,pas:p.id}));   // pas → chip chạm được, mở bảng nội tại
}
/* Passive theo đòn: đồng đội → luôn áp; địch → chỉ khi mục tiêu đúng id / đúng phe */
const scopeHits = (w,other) => !w || w.always || w.ally || w.allyAny || (w.enemy && other.id===w.enemy) || (w.enemyFaction && other.side==='enemy' && other.faction===w.enemyFaction);
function passiveMods(src,tgt){
  let dmg=0, taken=0, crit=0;
  (src.active||[]).forEach(p=>{ if(scopeHits(p.when,tgt)){ dmg+=p.effect.dmgPct||0; crit+=p.effect.critPct||0; } });
  (tgt.active||[]).forEach(p=>{ if(scopeHits(p.when,src)) taken+=p.effect.dmgTakenPct||0; });
  return { mult:(1+dmg/100)*(1+taken/100), crit:crit/100, dmg, taken };
}

/* Cổng nạp vào trận: chờ đúng thứ PHẢI có rồi mới mở màn — nền sector, pose `idle` của mọi unit sắp ra sân,
   và hai sheet fx kêu ngay đòn đầu. Khoảng 3 MB thay vì 14 MB. Bốn pose còn lại, sheet trạng thái và HEAD
   video ult chạy ở nền sau khi cổng mở (xem frameSet và FX.preloadAll).
   Gọi trước initBattle ở router (js/app.js). loadFirst/FX.sheet đều có cache nên gọi lại không tải lần hai. */
async function battleGate(){
  if(typeof LOAD==='undefined') return;
  const tasks=[ ()=>applyBg(UI.stage, SECTOR) ];
  battleTeam().forEach(id=>{ const s=spriteSrc(id,'ally'); if(s&&s.idle) tasks.push(()=>loadFirst(s.idle)); });
  sectorEnemyDefs().forEach(d=>{ const s=spriteSrc(d.id,'enemy'); if(s&&s.idle) tasks.push(()=>loadFirst(s.idle)); });
  tasks.push(()=>FX.sheet('hit',false), ()=>FX.sheet('crit',false));
  await LOAD.gate(`SECTOR ${SECTOR.id} · ĐANG NẠP`, tasks);
}

function initBattle(){
  B.gen++; const g=B.gen;
  exitTargeting(); hideHint(); closePassive(); stopCutin(); SHEET.clear();
  const team=battleTeam(), enemyDefs=sectorEnemyDefs();
  stageScale([...team.map(id=>ROSTER[id]), ...enemyDefs]);
  // đội mình: nhân ATK/HP theo cấp nâng cấp (state.js), rồi áp passive tĩnh
  // unitStats (state.js) = chỉ số cuối: gốc × cấp nâng cấp × linh kiện × cyberware. Thẻ nhân vật đọc cùng hàm này
  // nên con số trên thẻ và con số vào trận luôn khớp.
  B.units = team.map((id,i)=>{ const d=ROSTER[id], s=unitStats(id); const u=makeUnit({...d, ...s, level:lvl(id)},'ally',i); applyStaticPassives(u,team,enemyDefs); return u; });
  B.round=0; B.idx=0; B.target=null; B.busy=false; B.over=false; B.wave=0; B.queue=[]; B.opened=[];
  UI.log.innerHTML=''; UI.result.hidden=true; UI.fx.innerHTML=''; turnTiles.clear();
  UI.sectorNo.textContent=SECTOR.id; UI.waveNo.textContent=`0/${SECTOR.waves}`; UI.roundNo.textContent='00';
  UI.stage.classList.remove('has-bg'); UI.stage.style.removeProperty('--bgimg');
  applyBg(UI.stage, SECTOR).then(ok=>{ if(ok) UI.stage.classList.add('has-bg'); });
  renderSide('ally'); preloadFrames(); FX.preloadAll();   // fx SAU sprite: sprite là thứ người chơi đang chờ thấy
  UI.enemies.innerHTML=''; setInputs(false); ticker('Khởi tạo…');
  const st=STORY[SECTOR.id];
  const intro = st&&st.intro&&!B.skipIntro&&!(PLAYER.settings&&PLAYER.settings.skipStory) ? playComic(st.intro, SECTOR, 'intro') : Promise.resolve();
  intro.then(()=>{ if(g===B.gen && !B.over){ spawnWave(); newRound(); } });
}
/* Nạp ảnh nền sector vào một phần tử (sân đấu hoặc màn hội thoại) với zoom/dim đúng */
async function applyBg(elm, sector){
  const src=await loadFirst(sector.bg); if(!src) return false;
  const fb=/bg_battle\./.test(src);                 // ảnh dự phòng → dùng tham số riêng của nó
  elm.style.setProperty('--bgimg',`url("${absUrl(src)}")`);   // URL tuyệt đối: url() trong biến CSS bị tính theo css/, không theo trang
  elm.style.setProperty('--bgzoom', fb ? BG_FALLBACK.zoom : (sector.bgZoom||1.3));
  elm.style.setProperty('--bgdim',  fb ? BG_FALLBACK.dim  : (sector.bgDim||0));
  return true;
}
/* Gọi wave kế: giữ nguyên đội mình (Energy/KIA), hồi một phần HP, thay toàn bộ kẻ địch */
function spawnWave(){
  B.wave++; UI.waveNo.textContent=`${B.wave}/${SECTOR.waves}`;
  if(B.wave>1 && RULES.waveHeal){
    alive('ally').forEach(u=>{ const amt=Math.round(u.hpMax*RULES.waveHeal); if(u.hp<u.hpMax) heal(u,u,amt); });
    log(`Nghỉ lấy hơi: cả đội hồi ${Math.round(RULES.waveHeal*100)}% HP`, true);
  }
  if(B.wave>1) alive('ally').forEach(clearStatus);                          // độc/cháy/choáng không kéo sang wave sau
  if(SECTOR.verse && B.wave>1){                                             // VERSE (chương 3): mất 25 Energy mỗi wave mới
    alive('ally').forEach(u=>{ if(u.energy>0){ u.energy=Math.max(0,u.energy-25); u.chips=u.chips.filter(c=>c.label!=='VERSE'); u.chips.push({type:'debuff',label:'VERSE',val:'−25'}); updateUnit(u); setTimeout(()=>removeChip(u,'VERSE'),2500); } });
    log('VERSE: toàn đội −25 Energy', true);
  }
  B.units = [ ...B.units.filter(u=>u.side==='ally'), ...rollWave(B.wave).map((d,i)=>makeUnit(d,'enemy',i)) ];
  B.target=null; renderSide('enemy');
  log(`Wave ${B.wave}/${SECTOR.waves}: ${alive('enemy').map(e=>e.name).join(' · ')}`, true);
  if(B.wave>1) showHint('wave');
}
async function waveTransition(){
  const g=B.gen; B.busy=true; setInputs(false); AUDIO.wave();
  UI.ubName.textContent=`WAVE ${String(B.wave+1).padStart(2,'0')}`; UI.ubSub.textContent='ĐỢT ĐỊCH MỚI';
  UI.banner.style.setProperty('--accent','var(--rust)');
  UI.banner.classList.remove('show'); void UI.banner.offsetWidth; UI.banner.classList.add('show');
  await wait(reduced()?300:1000); if(g!==B.gen) return;
  spawnWave(); B.busy=false; newRound();
}

/* ---- Đội hình trên sân: LƯỚI 3 hàng mỗi phe, mỗi người một hàng ----
   row 1 = hàng trong cùng (trên, xa người xem) … row 3 = hàng ngoài cùng (dưới). Mỗi hàng là một dải ngang riêng
   (css .field là grid 3 hàng bằng nhau) nên sprite và bảng chỉ số của hai người không bao giờ chồng lên nhau.
   x = % bề ngang nửa sân, so le để vẫn đọc ra chiều sâu; z = thứ tự vẽ, hàng ngoài đè lên hàng trong.
   KHÔNG thu nhỏ hàng sau nữa (trước đây sc .94/.9): cùng một người đứng hàng nào cũng phải to như nhau —
   cỡ người giờ do BODY_H trong js/data.js quyết định, không do chỗ đứng. ---- */
const FORMATION = {
  ally:  [{row:3,x:58},{row:2,x:41},{row:1,x:54}],
  enemy: [{row:3,x:42},{row:2,x:58},{row:1,x:46}],
};
/* Chỉ TRÙM mới được phóng to quá khung hàng (phần tràn trổ lên khoảng trời trên sân — xem sidePositions + css .field).
   Elite không phóng nữa: cỡ của nó đã khai ở bảng SIZE trong js/data.js rồi, phóng thêm là đầu nó
   thò lên đè vào bảng chỉ số của người đứng hàng trong. */
const RANK_SC = { boss:1.15 };
function unitEl(u,pos){
  const e=el('div',`unit unit--${u.side} unit--${u.faction} unit--${(u.tier||'b').toLowerCase()}`);
  e.dataset.uid=u.uid;
  e.style.cssText=`--row:${pos.row};--x:${pos.x}%;--z:${pos.row};--sc:${pos.sc||1};--bob-delay:${-Math.round(Math.random()*2400)}ms`;
  e.innerHTML=`<div class="unit__sprite"><div class="unit__shadow"></div><div class="unit__ring"></div>
      <div class="unit__bob"><div class="unit__pose"><div class="sil sil--free ${u.faction==='rust'?'sil--rust':''}"><span class="sil__lbl">NO SPRITE</span></div>
      <div class="unit__frame"><img alt=""><i class="unit__sheet"></i><div class="unit__flash"></div></div></div></div>
      <div class="unit__brk"><i></i></div><span class="unit__tgt">TGT</span><div class="kia">KIA</div></div>
    <div class="unit__plate"><div class="unit__name"><span>${u.name}</span>${u.side==='ally'?`<span class="tier">${u.tier}</span>`:`<span class="rank">${u.rank==='boss'?'BOSS':u.rank==='elite'?'ELITE':'ATK '+u.atk}</span>`}</div>${hpBar()}</div>`;
  const plate=e.querySelector('.unit__plate');
  if(u.energyMax) plate.appendChild(energyBarEl(u.energyMax));   // đội mình luôn có; địch chỉ con nào có chiêu cuối (energyMax = ult.cost)
  plate.insertAdjacentHTML('beforeend',`<div class="unit__hp mono"></div><span class="unit__ready">READY</span>`);
  e.insertAdjacentHTML('beforeend','<div class="chips"></div>');   // NGOÀI bảng chỉ số: bảng có clip-path nên thứ gì nằm trong cũng bị cắt
  if(u.side==='enemy') e.addEventListener('click',()=>onEnemyTap(u));
  else e.addEventListener('click',()=>{ if((u.passives||[]).length) openPassive(u); });   // người của mình: chạm để đọc nội tại
  return e;
}
/* Chỗ đứng của cả một phe. Boss cao hơn khung hàng (RANK_SC) nên luôn đẩy về hàng TRONG CÙNG: phần vượt ra
   trổ lên khoảng trời phía trên sân chứ không đè lên đầu con đứng trước. rollWave() vốn xếp boss đứng giữa. */
function sidePositions(side, units){
  const pos=units.map((u,i)=>({...(FORMATION[side][i]||FORMATION[side][0]), sc:RANK_SC[u.rank]||1}));
  const bi=units.findIndex(u=>u.rank==='boss');
  if(bi>=0){
    let back=0; pos.forEach((p,i)=>{ if(p.row<pos[back].row) back=i; });
    if(back!==bi){ const t={row:pos[bi].row,x:pos[bi].x}; pos[bi].row=pos[back].row; pos[bi].x=pos[back].x; pos[back].row=t.row; pos[back].x=t.x; }
  }
  return pos;
}
function renderSide(side){
  const host = side==='ally'?UI.allies:UI.enemies; host.innerHTML=''; SHEET.prune();
  const units=B.units.filter(u=>u.side===side), pos=sidePositions(side, units);
  units.forEach((u,i)=>{
    u.el=unitEl(u,pos[i]); if(u.rank) u.el.classList.add('unit--'+u.rank);
    if(u.link){ u.chips.push({type:'buff',label:'HALO LINK'}); }
    host.appendChild(u.el); updateUnit(u);
    if(u.sprites) mountSprite(u);      // địch có sprite riêng (Glass Jaw); còn lại giữ silhouette
  });
}
/* #stage --big = NÉT VẼ cao nhất của trận vượt hộp chuẩn 682 bao nhiêu lần; css chia bề ngang ô lưới cho số này
   để người cao nhất vẫn nằm gọn trong hàng của mình.
   Phải tính theo nét vẽ (ART_H × hệ số đã phóng của hộp) chứ không theo hộp: hộp của Ronin bị phóng 18% để anh cao
   bằng người khác, nhưng trong hộp đó có sẵn 15% khoảng trống trên đầu — lấy hộp thì cả sân teo 18% vì một mình anh.
   Đặt MỘT LẦN cho cả trận (đội hình + toàn bộ địch của sector): tính lại mỗi wave thì sân co giật mỗi lần đổi đợt.
   Chỉ đo pose idle — pose đánh có cao hơn thì lúc đó unit cũng đã trượt ra khỏi hàng rồi. */
function stageScale(defs){
  let big=1;
  defs.forEach(d=>{ const b=d && d.sprites && d.sprites.box && d.sprites.box.idle;
    if(b&&b.h) big=Math.max(big, (ART_H[d.id]||1) * b.h/682); });
  UI.stage.style.setProperty('--big', big.toFixed(3));
}
function updateUnit(u){
  const e=u.el; if(!e) return;
  setHpBar(e.querySelector('.bar'), u.hp, u.hpMax);
  e.querySelector('.unit__hp').textContent = `${Math.max(0,u.hp)}/${u.hpMax}`;
  const eb=e.querySelector('.ebar'); if(eb){ setEnergyBar(eb,u.energy,u.energyMax); e.classList.toggle('is-ready', u.energy>=u.energyMax && u.alive); }
  e.querySelector('.chips').innerHTML = [...u.chips, ...shieldChip(u), ...statusChips(u)].map(c=>
    `<span class="chip chip--${c.type}${c.pas?' chip--info':''}"${c.pas?` data-pas="${c.pas}" data-uid="${u.uid}"`:''}>${c.label}${c.val?` <em>${c.val}</em>`:''}</span>`).join('');
  syncStatusFx(u);
  e.classList.toggle('is-dead', !u.alive);
  if(!u.alive) SHEET.del(e.querySelector('.unit__frame'));   // xác nằm im, không nhún tiếp
}
function addChip(u,type,label,val){ u.chips.push({type,label,val}); updateUnit(u); }
function removeChip(u,label){ u.chips=u.chips.filter(c=>c.label!==label); updateUnit(u); }

/* ---- Sprite: preload frame idle/attack/hurt (không còn frame dash: di chuyển giữ nguyên idle) ----
   Nguồn sprite: ROSTER (đội mình) hoặc ENEMY_POOL (kẻ địch có sprite riêng, hiện mới Glass Jaw).
   Con nào không khai báo sprites thì vẫn là silhouette như cũ. */
/* Cùng một id có thể có HAI bộ box khác cỡ: bản đứng bên địch (ENEMY_POOL, cỡ theo rank) và bản đã chiêu mộ về
   đội mình (ROSTER, đã kéo lên cỡ người — js/data.js). Phải tra theo PHE, không thì một con Scav đứng bên kia sân
   vẫn to bằng Yuki và cả thang cỡ người (lính nhỏ · elite ngang · trùm to) đổ hết. Cache cũng phải tách theo phe. */
const spriteSrc = (id,side) => ((side==='enemy' ? (ENEMY_POOL.find(e=>e.id===id) || ROSTER[id]) : (ROSTER[id] || ENEMY_POOL.find(e=>e.id===id))) || {}).sprites;
const frameKey = u => (u.side==='enemy' ? 'foe:' : '') + u.id;
const POSES = ['idle','attack','crit','hurt','die'];   // crit = tư thế đòn chí mạng (thiếu → attack) · die = tư thế gục (thiếu → hurt); đều tuỳ chọn
function frameSet(id, side){
  const key=(side==='enemy'?'foe:':'')+id;
  if(B.frames[key]) return B.frames[key];
  const s=spriteSrc(id,side); if(!s) return null;
  const box=s.box||{}, anim=s.anim||{};
  // mỗi pose: ảnh tĩnh (bắt buộc) + sheet động (tuỳ chọn). Sheet hỏng/thiếu file → tự rơi về ảnh tĩnh.
  const sheetOf = p => anim[p] ? loadFirst(anim[p].sheet).then(src => src && {...anim[p], src}) : Promise.resolve(null);
  const pose = (src,p,sh) => src && { src, box:box[p], anim:sh||null, face:s.face||'right' };
  /* HAI PHA — vì sao. Bản cũ Promise.all cả 5 pose nên sprite chỉ hiện khi ~2 MB của unit đó về XONG; sáu
     unit trên sân là 12 MB trước khi thấy người đầu tiên. Giờ pha 1 chỉ chờ `idle` (~400 kB), bốn pose kia
     về sau và được điền TẠI CHỖ vào cùng object — sớm nhất thì unit cũng phải vài giây nữa mới thật sự đánh.
     Trong lúc chờ, unit chạy đúng luật của một con thiếu pose: mọi chỗ gọi đều là `f[pose] || f.attack` nên
     nó tạm dùng idle, không chỗ nào vỡ. Đủ bộ rồi thì áp lại luật rơi của bản cũ (crit→attack, die→hurt). */
  B.frames[key] = Promise.all([loadFirst(s.idle), sheetOf('idle')]).then(([src, sh])=>{
    const f = { idle:pose(src,'idle',sh), attack:null, crit:null, hurt:null, die:null };
    f.attack = f.crit = f.idle;                        // hai pose này chỗ gọi coi là luôn có
    const got = {};                                    // pose nào THẬT SỰ nạp được — khai trong data mà file 404
    const rest = ['attack','crit','hurt','die'].map(p => !s[p] ? null :   // thì phải rơi y như bản cũ
      Promise.all([loadFirst(s[p]), sheetOf(p)]).then(([s2,sh2])=>{ const q=pose(s2,p,sh2); if(q){ f[p]=q; got[p]=1; } }));
    Promise.all(rest.filter(Boolean)).then(()=>{
      if(!got.attack) f.attack = f.idle;
      if(!got.crit)   f.crit   = f.attack;
      if(!got.die)    f.die    = f.hurt;
    });
    return f;
  });
  return B.frames[key];
}
function preloadFrames(){
  battleTeam().forEach(id=>{
    frameSet(id,'ally');
    if(ultVideoOn()) ultVariants(ROSTER[id]).forEach(resolveVideo);   // HEAD video ult ngay từ đầu trận để lúc phát chiêu không phải chờ
  });
  sectorEnemyDefs().forEach(d=>{ if(d.sprites) frameSet(d.id,'enemy');        // nạp sớm sheet của địch trong sector
    if(ultVideoOn() && d.ult) ultVariants(d).forEach(resolveVideo); });   // và video chiêu cuối của địch (Glass Jaw, Kiln)
  B.units.filter(u=>u.side==='ally').forEach(mountSprite);
}

/* ---- Sprite sheet động ----
   Một vòng requestAnimationFrame duy nhất chạy mọi sprite đang sống (không phải mỗi unit một vòng).
   Ô (c,r) của sheet cols×rows: background-size = cols·100% × rows·100%, background-position = c/(cols−1) × r/(rows−1).
   --f (vị trí ô) đặt trên .unit__frame để cả .unit__sheet lẫn mask của .unit__flash dùng chung.
   mode 'alt' = xuôi rồi ngược (clip gốc không khép vòng, chạy thẳng sẽ giật ở chỗ nối). */
const SHEET = {
  reg:new Map(), raf:0,
  add(fb, a){ this.reg.set(fb, {a, i:0, dir:1, next:0}); if(!this.raf) this.raf=requestAnimationFrame(SHEET.tick); },
  del(fb){ this.reg.delete(fb); },
  clear(){ this.reg.clear(); },
  /* Bỏ unit đã rời khỏi sân. Không dựa vào tick để dọn: tab ẩn thì requestAnimationFrame không chạy,
     node cũ sẽ nằm lại trong Map qua nhiều trận. */
  prune(){ for(const fb of this.reg.keys()) if(!fb.isConnected) this.reg.delete(fb); },
  pos(a, i){
    const c=i%a.cols, r=(i/a.cols)|0;
    return (a.cols>1 ? c*100/(a.cols-1) : 0)+'% ' + (a.rows>1 ? r*100/(a.rows-1) : 0)+'%';
  },
  tick(now){
    SHEET.raf = SHEET.reg.size ? requestAnimationFrame(SHEET.tick) : 0;
    for(const [fb,s] of SHEET.reg){
      if(!fb.isConnected){ SHEET.reg.delete(fb); continue; }   // unit đã bị gỡ khỏi sân (đổi wave / reset trận)
      if(now < s.next) continue;
      s.next = now + 1000/s.a.fps;
      if(s.a.mode==='alt'){ s.i+=s.dir; if(s.i>=s.a.count-1){ s.i=s.a.count-1; s.dir=-1; } else if(s.i<=0){ s.i=0; s.dir=1; } }
      else s.i = (s.i+1) % s.a.count;
      fb.style.setProperty('--f', SHEET.pos(s.a, s.i));
    }
  },
};
/* Đặt frame vào hộp 744×682 của unit: neo chân (box.ax) trùng x=372, sàn trùng đáy hộp.
   Frame không có box (ảnh fallback) → chiếm trọn hộp, object-fit contain đáy.
   sprites.face = hướng nhân vật nhìn trong file gốc ('right' nếu không khai). Sprite nhìn cùng hướng với phe
   đối diện thì lật ngang (.is-flip trên .unit__frame — không đặt trên .unit__pose vì pose đang giữ transform
   của dash/attack). Lật rồi thì neo chân soi gương thành w−ax.
   Có anim + animOn() → dán sheet lên .unit__sheet và cho SHEET chạy; không thì <img> tĩnh như cũ. */
function setFrame(u, frame){
  if(!u.el) return;
  const b=frame.box, fb=u.el.querySelector('.unit__frame'), st=fb.style;
  const flip = (u.side==='enemy') === ((frame.face||'right')==='right');
  fb.classList.toggle('is-flip', flip);
  if(b){ const ax=flip?b.w-b.ax:b.ax; st.width=(b.w/744*100)+'%'; st.height=(b.h/682*100)+'%'; st.left=((372-ax)/744*100)+'%'; }
  else { st.width='100%'; st.height='100%'; st.left='0'; }
  SHEET.del(fb);
  const a=frame.anim && frame.anim.src && animOn() ? frame.anim : null;
  fb.classList.toggle('is-sheet', !!a);
  const mask = `url("${absUrl(a ? a.src : frame.src)}")`;
  fb.querySelector('.unit__flash').style.setProperty('--mask', mask);
  if(a){
    const size=(a.cols*100)+'% '+(a.rows*100)+'%';
    st.setProperty('--sheet', mask); st.setProperty('--msize', size); st.setProperty('--f', SHEET.pos(a,0));
    fb.querySelector('.unit__sheet').style.backgroundSize = size;
    SHEET.add(fb, a);
  } else {
    fb.querySelector('img').src = frame.src;
  }
}
async function mountSprite(u){
  const p=frameSet(u.id,u.side); if(!p) return;
  const f=await p; if(!f||!f.idle||!u.el) return;
  setFrame(u,f.idle); u.el.querySelector('.unit__pose').classList.add('has-img');
}
/* CONFIG đổi ANIMATION / GIẢM CHUYỂN ĐỘNG giữa chừng: dựng lại frame idle cho mọi unit đang trên sân */
function syncSpriteAnim(){
  SHEET.clear();
  B.units.forEach(u=>{ if(u.el && u.el.isConnected) mountSprite(u); });
}
/* Chớp trắng opacity .26 tắt dần 200ms, che khoảnh khắc đổi frame */
function flashSprite(u){
  if(!u.el) return;
  const pose=u.el.querySelector('.unit__pose');
  if(pose.classList.contains('has-img')) pose.querySelector('.unit__flash').animate([{opacity:.26},{opacity:0}],{duration:200,easing:'linear'});
  else pose.querySelector('.sil').animate([{filter:'brightness(2.2)'},{filter:'brightness(1)'}],{duration:200,easing:'linear'});
}
/* Trúng đòn: đổi sang frame hurt (nếu có) + giật lùi 300ms + chớp đỏ, rồi về idle.
   Chết: giữ frame hurt, mất bão hoà, sụm nhẹ xuống (CSS .is-dead). */
async function playHurt(u, killed){
  const e=u.el; if(!e) return; e.classList.add('is-hit'); setTimeout(()=>e.classList.remove('is-hit'), 320);
  const f = B.frames[frameKey(u)] ? await B.frames[frameKey(u)] : null;
  const fr = f && (killed ? f.die : f.hurt);           // chết → frame die (Drill-Bit), không có thì hurt; trúng đòn → hurt
  if(!fr) return;
  flashSprite(u); setFrame(u, fr);
  if(killed) return;
  await wait(reduced()?200:420);
  if(!u.alive || u.el!==e) return;
  flashSprite(u); setFrame(u, f.idle);
}
const animDone = (a, ms) => Promise.race([a.finished.catch(()=>{}), wait(ms+80)]);
/* Attack tại chỗ (giảm chuyển động / dự phòng): +28px/90ms out (scale 1.02,.96) → giữ 120ms → về 0/180ms. Tổng 390ms */
async function playAttackAnim(u, poseName){
  const f = await B.frames[frameKey(u)]; if(!u.el) return; const pose=u.el.querySelector('.unit__pose');
  flashSprite(u);
  const fr=f&&(f[poseName]||f.attack); if(fr) setFrame(u,fr);   // poseName 'crit' → frame đòn chí mạng nếu sprite có
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
/* ---- Di chuyển tới mục tiêu (kiểu Idle Heroes) ----
   Không có frame dash: sprite giữ nguyên idle, trượt thẳng tới điểm đứng trước mặt mục tiêu, đổi sang frame attack lúc chạm,
   rồi trượt thẳng về đúng chỗ cũ. Neo = .unit__sprite (không bị bob/pose làm lệch). Chân = giữa đáy rect. Điểm đứng = trước chân
   mục tiêu một khoảng gap (RULES.move.gap × bề rộng mục tiêu), phía bên mình. Translate px nằm trong .unit đã scale(--sc) → chia cho k. */
function moveDelta(u,tgt){
  if(!u.el||!tgt.el) return null;
  const sa=u.el.querySelector('.unit__sprite'), st=tgt.el.querySelector('.unit__sprite');
  const a=sa.getBoundingClientRect(), t=st.getBoundingClientRect(); if(!a.width||!t.width) return null;
  const k=(a.width/sa.offsetWidth)||1, dir=u.side==='ally'?1:-1, gap=t.width*RULES.move.gap;
  return { dx:((t.left+t.width/2) - dir*gap - (a.left+a.width/2))/k, dy:(t.bottom-a.bottom)/k, dir };
}
/* Chuỗi: idle trượt tới (out) → frame attack + đẩy nhẹ (impact) → strike() → giữ (hold) → frame idle → trượt về chỗ cũ (back).
   strike được gọi đúng lúc va chạm (dealDamage ở đó). Giảm chuyển động hoặc không đo được vị trí → đánh tại chỗ. */
async function playMoveAttack(u,tgt,strike,o){
  o=Object.assign({},RULES.move,o||{});
  const g=B.gen; const f=B.frames[frameKey(u)]?await B.frames[frameKey(u)]:null; if(g!==B.gen||!u.el) return;
  const pose=u.el.querySelector('.unit__pose'); const d=!reduced()&&moveDelta(u,tgt);
  if(!d){ const p=playAttackAnim(u,o.pose); await wait(90); if(g===B.gen) strike(); await p; return; }
  const elm=u.el; elm.classList.add('is-dashing'); elm.style.setProperty('--zd',o.z);
  const to=`translate(${d.dx}px,${d.dy}px)`, push=`translate(${d.dx+12*d.dir}px,${d.dy}px)`;
  const out=pose.animate([{transform:'translate(0,0)'},{transform:to}],{duration:o.out,easing:'cubic-bezier(.2,.8,.2,1)',fill:'forwards'});
  await animDone(out,o.out);
  if(g!==B.gen){ out.cancel(); return; }
  const fr=f&&(f[o.pose]||f.attack); flashSprite(u); if(fr) setFrame(u,fr);   // o.pose='crit' → frame đòn chí mạng (quay trước bằng rollCrit)
  const hit=pose.animate([{transform:to},{transform:push}],{duration:o.impact,fill:'forwards'});
  strike();
  await animDone(hit,o.impact); await wait(o.hold);
  if(g!==B.gen){ out.cancel(); hit.cancel(); return; }
  flashSprite(u); if(f&&f.idle) setFrame(u,f.idle);
  const back=pose.animate([{transform:push},{transform:'translate(0,0)'}],{duration:o.back,easing:'cubic-bezier(.3,0,.4,1)',fill:'forwards'});
  await animDone(back,o.back); out.cancel(); hit.cancel(); back.cancel();
  elm.classList.remove('is-dashing'); elm.style.removeProperty('--zd');
}

/* Quay chí mạng TRƯỚC khi lao tới, để playMoveAttack chọn frame 'crit' (sprite có tư thế riêng, vd Glass Jaw) đúng lúc chạm;
   dealDamage nhận lại kết quả qua opts.crit nên tỉ lệ không đổi. basic = đòn thường (cộng critPct của skill). */
function rollCrit(src,tgt,basic){ const pm=passiveMods(src,tgt), sk=src.skill||{}; return Math.random() < (src.crit||0)/100 + pm.crit + (basic ? (sk.critPct||0)/100 : 0); }

/* ---- Số bay lên ---- */
function spawnNumber(targetEl, text, kind){
  const s=UI.fx.getBoundingClientRect(), r=targetEl.getBoundingClientRect();
  const d=el('div','dmg'+(kind?' dmg--'+kind:''), text);
  d.style.left = (r.left + r.width/2 - s.left + (Math.random()*20-10)) + 'px';
  d.style.top  = (r.top + r.height*.38 - s.top) + 'px';
  UI.fx.appendChild(d); d.addEventListener('animationend',()=>d.remove());
}

/* ---- Sát thương. opts: basic = đòn thường (crit thêm của skill, đòn kết liễu) · fx = overlay lúc trúng (mặc định hit; chí mạng → crit) ·
   status = trạng thái kèm theo {kind,turns,pct,chance} → applyStatus (không áp lên mục tiêu vừa chết) ·
   flat = sát thương cố định: bỏ qua ATK, variance, chí mạng, passive và đòn kết liễu (chiêu cuối của địch, js/data.js).
   Tỉ lệ chí mạng = crit của người đánh + critPct passive (+ critPct skill nếu đòn thường); sát thương chí mạng ×RULES.critMult.
   Có lá chắn thì lá chắn hút trước, phần thừa mới vào HP. ---- */
function dealDamage(src, tgt, mult, opts={}){
  const pm=passiveMods(src,tgt), sk=src.skill||{}, flat=opts.flat||0;
  const crit = !flat && (opts.crit!=null ? !!opts.crit : rollCrit(src,tgt,opts.basic));   // đã quay trước (để chọn frame) hoặc quay tại đây
  const v = 1 + (Math.random()*2-1)*RULES.variance;
  let dmg = flat || src.atk * mult * v * (crit?RULES.critMult:1) * pm.mult;
  const exec = !flat && opts.basic && sk.executeBelow && tgt.hp/tgt.hpMax < sk.executeBelow;
  if(exec) dmg *= 1+(sk.executeBonus||0);
  dmg=Math.round(dmg);
  const blocked = absorbShield(tgt, dmg), real = dmg-blocked;
  tgt.hp = Math.max(0, tgt.hp - real);
  const spr=tgt.el.querySelector('.unit__sprite');
  if(blocked) spawnNumber(spr, blocked, 'shield');
  if(real || !blocked) spawnNumber(spr, real, crit?'crit':'');
  const killed = tgt.hp<=0 && tgt.alive;
  if(killed) killUnit(tgt);
  /* Một đòn = một tiếng (xem SFX_ONE trong js/audio.js). Thứ tự ưu tiên: kết liễu > hiệu ứng riêng của đòn
     (mìn, súng điện) > chí mạng > đấm thường — hiệu ứng riêng đứng trên chí mạng vì nó cho biết ĐÒN GÌ vừa trúng,
     còn chí mạng thì đã có overlay và số đỏ trên màn. Tiếng trạng thái gọi sau (applyStatus) rơi vào cùng nhịp
     nên tự bị bỏ. Muốn đảo lại thì đổi thứ tự hai nhánh giữa. */
  if(killed) AUDIO.kia();
  else if(opts.fx && opts.fx!=='hit' && AUDIO[opts.fx]) AUDIO[opts.fx]();
  else if(crit) AUDIO.crit();
  else AUDIO.hit();
  playHurt(tgt, killed);
  const flip = tgt.side==='ally';                                  // đòn đến từ bên phải → lật hướng nhát chém
  playFx(tgt, opts.fx || (crit?'crit':'hit'), {flip});
  if(crit && opts.fx) playFx(tgt, 'crit', {flip, delay:70});       // chí mạng luôn có overlay crit, kể cả đòn có hiệu ứng riêng
  if(blocked) playFx(tgt, 'shield', {flip, delay:60});             // lá chắn loé lên đúng lúc chặn
  updateUnit(tgt);
  // exec = đòn thường ăn thêm sát thương vì mục tiêu dưới executeBelow (chỉ Yuki có). Đòn thường không có tên nên nhãn gọi theo cơ chế.
  const mods=[crit?'CRIT':'', exec?'KẾT LIỄU':'', blocked?`KHIÊN −${blocked}`:'', pm.dmg?`+${pm.dmg}%`:'', pm.taken?`${pm.taken}% nhận`:'', killed?'KIA':''].filter(Boolean).join(' · ');
  log(`${src.name} → ${tgt.name} · ${real}${mods?' · '+mods:''}`, crit||killed||exec);
  if(!killed && opts.status) applyStatus(src, tgt, opts.status, opts.fx===opts.status.kind);   // overlay đòn đã cùng loại → không phát lại lúc dính
  return {dmg:real, blocked, crit, killed};
}
function heal(src, tgt, amount){
  const before=tgt.hp; tgt.hp=Math.min(tgt.hpMax, tgt.hp+amount);
  if(tgt.el) spawnNumber(tgt.el.querySelector('.unit__sprite'), '+'+(tgt.hp-before), 'heal'); updateUnit(tgt); AUDIO.heal();
}
function gainEnergy(u, n){
  const bonus=(u.active||[]).reduce((s,p)=>s+(p.effect.energyGainPct||0),0); n=Math.round(n*(1+bonus/100));
  const was=u.energy; u.energy=Math.min(u.energyMax, u.energy+n); updateUnit(u); if(u.side==='ally' && u===current()) updateUltButton(u);
  if(was<u.energyMax && u.energy>=u.energyMax) AUDIO.ready();
  if(u.side==='ally' && was<u.ult.cost && u.energy>=u.ult.cost) showHint('energyFull');
}
/* Rút Energy (chiêu cuối của địch: ARCHON rút sạch). n=null → rút hết. Chip đỏ 2,5 giây như VERSE ở spawnWave.
   Trả về số Energy thật sự mất, để chỗ gọi ghi log đúng (đang 0 thì không rút được gì). */
function loseEnergy(u, n){
  const lost=Math.min(u.energy, n==null?u.energy:n); if(lost<=0) return 0;
  u.energy-=lost; removeChip(u,'ENERGY'); addChip(u,'debuff','ENERGY','−'+lost);
  if(u.side==='ally' && u===current()) updateUltButton(u);
  setTimeout(()=>removeChip(u,'ENERGY'), 2500);
  return lost;
}

/* ---- Trạng thái (status). Khai trong js/data.js ở skill/ult/địch: status:{kind,turns,pct,chance} ----
   stun = mất lượt kế tiếp · poison/burn = đầu mỗi lượt của người dính mất dmg (= pct × ATK người gây lúc dính).
   turns đếm theo lượt của người dính; dính lại thì lấy số lượt và sát thương lớn hơn. Chip trên bảng unit (statusChips),
   overlay lặp theo js/fx.js (syncStatusFx qua updateUnit). Sang wave mới đội mình được xoá sạch. scratch/sim.js dùng cùng luật. ---- */
const STATUS_DEF = { stun:{label:'CHOÁNG'}, poison:{label:'ĐỘC'}, burn:{label:'CHÁY'} };
function applyStatus(src, tgt, st, quiet){
  if(!st || !STATUS_DEF[st.kind] || !tgt.alive) return false;
  if(st.kind==='stun' && tgt.rank==='boss'){ log(`${tgt.name} là boss, không bị choáng`); return false; }   // boss miễn choáng (scratch/sim.js cùng luật)
  if(st.chance!=null && Math.random()>=st.chance) return false;
  const dmg = st.pct ? Math.round(src.atk*st.pct) : 0, turns=st.turns||1;
  const cur = tgt.status.find(s=>s.kind===st.kind);
  if(cur){ cur.turns=Math.max(cur.turns,turns); cur.dmg=Math.max(cur.dmg,dmg); }
  else { tgt.status.push({ kind:st.kind, turns, dmg }); if(!quiet) playFx(tgt, st.kind); }
  if(!quiet && AUDIO[st.kind]) AUDIO[st.kind]();     // quiet = đòn đã phát đúng tiếng này rồi (fx cùng loại) → không kêu chồng
  updateUnit(tgt);
  log(`${tgt.name} ${STATUS_DEF[st.kind].label.toLowerCase()} ${turns} lượt${dmg?` · −${dmg}/lượt`:''}`, true);
  return true;
}
const statusChips = u => (u.status||[]).map(s=>({ type:s.kind, label:STATUS_DEF[s.kind].label, val:s.turns+'T' }));
const syncStatusFx = u => setFxLoops(u, [...(u.shield?['shield']:[]), ...(u.status||[]).map(s=>s.kind)]);
function clearStatus(u){ if(u.status && u.status.length){ u.status=[]; updateUnit(u); } }
/* Chỗ duy nhất mọi cái chết đi qua — gọi từ cả sát thương (dealDamage) và độc/cháy (tickStatus).
   Hạ kẻ địch = mở con đó ở bể gacha (xem khối GACHA trong data.js). Ghi ngay tại đây chứ không đợi
   clear màn: hạ trùm ở wave 3 rồi chết ở wave 4 thì vẫn là đã hạ, và DẸP LOẠN không ghi vào cleared.
   makeUnit spread ...def nên u.id là id trong ENEMY_POOL; `controlled` không đổi u.side nên con bị
   điều khiển chết vẫn tính đúng bên. Không savePlayer ở đây — finish() lưu một lần cho cả trận. */
function killUnit(u){
  u.alive=false; u.chips=[]; u.status=[]; u.shield=0; if(B.target===u) B.target=null;
  if(u.side==='enemy' && noteDefeated(u.id)) B.opened.push(u.id);
}

/* ---- Lá chắn: hút sát thương trước khi vào HP, không đếm lượt — đánh vỡ mới thôi (chiêu FIRE STORM của Kiln).
   Hiện thành chip KHIÊN <số còn lại> trên bảng unit + overlay lặp 'shield' (js/fx.js, syncStatusFx). ---- */
const shieldChip = u => u.shield ? [{ type:'shield', label:'KHIÊN', val:u.shield }] : [];
function addShield(u, amount){
  u.shield=(u.shield||0)+amount; updateUnit(u);
  if(u.el) spawnNumber(u.el.querySelector('.unit__sprite'), '+'+amount, 'shield');
  playFx(u,'shield'); if(AUDIO.shield) AUDIO.shield();
}
/* Trừ vào lá chắn trước, trả về phần đã chặn (phần còn lại mới vào HP) */
function absorbShield(u, dmg){
  if(!u.shield || dmg<=0) return 0;
  const blocked=Math.min(u.shield, dmg); u.shield-=blocked;
  /* Vỡ khiên: nổ tung chứ không lặng lẽ biến mất. Trước đây vòm lửa chỉ tắt (syncStatusFx gỡ overlay lặp)
     và chỉ còn một dòng log — mất đúng khoảnh khắc người chơi chờ nhất khi đánh Kiln.
     delay 120ms để nổ sau overlay trúng đòn, đọc thành "đòn tới → khiên vỡ". */
  if(!u.shield){ log(`Lá chắn của ${u.name} vỡ`, true); playFx(u,'explode',{delay:120}); AUDIO.shield_break(); }
  return blocked;
}
/* Đầu lượt: độc/cháy trừ HP (có thể chết), rồi choáng → mất lượt. Trả về true nếu lượt này không được hành động. */
async function tickStatus(u){
  const g=B.gen;
  for(const s of [...u.status]){
    if(!s.dmg) continue;
    u.hp=Math.max(0,u.hp-s.dmg); s.turns--;
    spawnNumber(u.el.querySelector('.unit__sprite'), s.dmg, s.kind); playFx(u,s.kind); flashSprite(u);
    const killed=u.hp<=0;
    log(`${u.name} ${STATUS_DEF[s.kind].label.toLowerCase()}: −${s.dmg}${killed?' · KIA':''}`, killed);
    if(killed){ killUnit(u); AUDIO.kia(); playHurt(u,true); updateUnit(u); return true; }
    if(AUDIO[s.kind]) AUDIO[s.kind]();
    updateUnit(u); await wait(reduced()?120:380); if(g!==B.gen) return true;
  }
  const st=u.status.find(s=>s.kind==='stun'); let skip=false;
  if(st){ st.turns--; skip=true; playFx(u,'stun'); if(AUDIO.stun) AUDIO.stun(); log(`${u.name} bị choáng, mất lượt`, true); }
  u.status=u.status.filter(s=>s.turns>0); updateUnit(u);
  if(skip){ await wait(reduced()?150:520); if(g!==B.gen) return true; }
  return skip;
}

/* ---- Lượt ---- */
/* Thứ tự lượt theo SPD giảm dần; bằng SPD thì đội mình trước, rồi theo slot. Dựng lại mỗi round (unit chết bị loại);
   thanh lượt xem trước round sau bằng cùng luật nên thứ tự luôn đoán được. */
function buildQueue(){
  const slot=u=>+u.uid.split('-')[1];
  return alive().sort((a,b)=>(b.spd||0)-(a.spd||0) || (a.side===b.side ? slot(a)-slot(b) : (a.side==='ally'?-1:1)));
}
function newRound(){ B.round++; UI.roundNo.textContent=String(B.round).padStart(2,'0'); B.queue=buildQueue(); B.idx=0; startTurn(); }
/* Ô chân dung trong thanh lượt được tạo một lần rồi tái sử dụng (không reload ảnh mỗi lượt) */
const turnTiles = new Map();
function turnTile(u, key){
  const k=u.uid+key; if(!turnTiles.has(k)){ const t=el('div',`tu tu--${u.faction}`); t.title=`${u.name} · SPD ${u.spd||0}`; t.appendChild(portraitEl(u)); t.insertAdjacentHTML('beforeend','<span class="tu__lbl">NOW</span><i class="tu__mark"></i>'); turnTiles.set(k,t); }
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
function setTarget(u){ B.target=u; ensureTarget(); ticker(`Mục tiêu ưu tiên: ${u.name}`); }
function setInputs(on){ UI.btnAttack.disabled=!on; if(!on){ UI.btnUlt.dataset.state='locked'; exitTargeting(); } }
function updateUltButton(u){
  UI.btnUlt.classList.toggle('btn-ult--rust', u.faction==='rust');
  UI.ultName.textContent=u.ult.name;
  UI.ultBar.style.setProperty('--p', (u.energy/u.ult.cost*100)+'%');
  const kindTxt = u.ult.kind==='control'?'ĐIỀU KHIỂN':u.ult.kind==='heal'?'HỒI MÁU':u.ult.kind==='aoe'?'TOÀN BỘ ĐỊCH · '+Math.round(u.ult.mult*100)+'% ATK':Math.round(u.ult.mult*100)+'% ATK';
  if(u.energy>=u.ult.cost){ UI.btnUlt.dataset.state='ready'; UI.ultMeta.textContent=`${u.energy}/${u.ult.cost} · ${kindTxt}`; }
  else { UI.btnUlt.dataset.state='locked'; UI.ultMeta.textContent=`THIẾU ${u.ult.cost-u.energy} EN · ${u.energy}/${u.ult.cost}`; }
  const sk=u.skill||{};
  UI.ultInfo.innerHTML=`<b>${u.name} · ${u.ult.name}</b>${u.ult.desc}<span class="mono">COST ${u.ult.cost} · ENERGY ${u.energy}/${u.energyMax}</span>`
    + (sk.desc?`<span class="mono">ĐÒN THƯỜNG: ${sk.desc}</span>`:'')
    + ((u.active||[]).length?`<span class="mono">PASSIVE: ${u.active.map(p=>p.name).join(' · ')}</span>`:'');
}
function ticker(t){ UI.ticker.textContent=t; }
function log(t, hi){ const li=el('li', hi?'hi':'', `<b>R${B.round}</b>${t}`); UI.log.prepend(li); ticker(t); }

/* ---- Hint tutorial: hiện một lần mỗi hồ sơ, theo SECTOR.hints ---- */
function showHint(key){
  const h=(SECTOR.hints||[]).find(x=>x.when===key); if(!h) return;
  const id=`${SECTOR.id}:${key}`; if(PLAYER.hintsSeen.includes(id)) return;
  PLAYER.hintsSeen.push(id); savePlayer();
  UI.hintText.textContent=h.text; UI.hint.hidden=false;
}
function hideHint(){ UI.hint.hidden=true; }
$('#hintClose').addEventListener('click', e=>{ e.stopPropagation(); hideHint(); });

/* ---- Bảng nội tại trong trận ----
   Trên sân chỉ hiện chip của nội tại ĐANG BẬT và chip chỉ có chỗ cho hai chữ (CHỊ EM, FAN…), nên chạm vào chip
   — hoặc chạm vào chính người của đội mình — sẽ mở bảng liệt kê ĐỦ nội tại của người đó: tên đầy đủ, điều kiện,
   con số, mô tả, và nội tại nào chưa bật. Dùng chung passiveInfo()/fxText() với trang hồ sơ ở ARCHIVE (js/app.js,
   nạp sau file này nên chỉ gọi lúc người chơi bấm, không gọi lúc nạp trang). */
const PAS = { box:$('#pasBox'), who:$('#pasWho'), body:$('#pasBody') };
function openPassive(u, focusId){
  const list=u.passives||[]; if(!list.length) return;
  PAS.who.textContent=u.name;
  PAS.body.innerHTML = list.map(p=>{
    const on=(u.active||[]).some(a=>a.id===p.id);
    const cond=(typeof passiveInfo==='function' ? passiveInfo(p).cond : '') || '';
    const fx=(typeof fxText==='function' ? fxText(p.effect||{}) : '') || '';
    return `<div class="pas ${on?'is-active':'is-locked'}${p.id===focusId?' is-focus':''}">
      <div class="pas__body"><b class="pas__name">${p.name}</b><span class="pas__cond">${cond}</span>
        <span class="pas__fx">${fx}</span><p class="pas__desc">${p.desc||''}</p></div>
      <span class="pas__state">${on?'ĐANG BẬT':'CHƯA BẬT'}</span></div>`;
  }).join('');
  PAS.body.scrollTop=0; PAS.box.hidden=false; sfx('swipe',.3);
}
function closePassive(){ if(PAS.box) PAS.box.hidden=true; }
$('#pasClose').addEventListener('click', e=>{ e.stopPropagation(); closePassive(); });
/* Bắt ở pha capture: chạm vào chip của kẻ địch không được biến thành chạm chọn mục tiêu */
UI.stage.addEventListener('click', e=>{
  const c=e.target.closest && e.target.closest('.chip--info'); if(!c) return;
  e.stopPropagation(); e.preventDefault();
  const u=B.units.find(x=>x.uid===c.dataset.uid); if(u) openPassive(u, c.dataset.pas);
}, true);

async function startTurn(){
  if(B.over) return;
  const u=current();
  if(!u){ return newRound(); }
  if(!u.alive){ return endTurn(); }
  renderTurnbar();
  B.units.forEach(x=>x.el&&x.el.classList.toggle('is-active', x===u));
  if(u.status.length){ const g=B.gen; const skip=await tickStatus(u); if(g!==B.gen) return; if(skip||!u.alive) return endTurn(); }   // độc/cháy trừ HP, choáng mất lượt
  if(u.side==='ally'){
    ensureTarget(); setInputs(true); updateUltButton(u); ticker(`${u.name} — chọn hành động`);
    if(B.round===1) showHint('firstTurn');
  } else {
    setInputs(false); ticker(`${u.name} đang hành động…`);
    const g=B.gen; await wait(reduced()?250:700); if(g!==B.gen) return; await enemyAct(u);
  }
}
function endTurn(){
  if(B.over) return;
  if(!alive('enemy').length) return B.wave<SECTOR.waves ? waveTransition() : finish(true);
  if(!alive('ally').length) return finish(false);
  B.idx++;
  setTimeout(()=> B.idx>=B.queue.length ? newRound() : startTurn(), 0);
}
/* Thưởng thắng trận theo CHẾ ĐỘ. SECTOR.mode: không có = chiến dịch (mặc định) · 'riot' = dẹp loạn.
   Chiến dịch ghi tiến trình vào PLAYER.cleared và chạy comic kết màn; dẹp loạn chỉ nâng tầng.
   Trả về dòng chữ hiện ở bảng kết quả. */
async function winReward(g){
  dailyProgress('win');
  if(SECTOR.mode==='riot'){
    const n=SECTOR.tier, r=SECTOR.reward, first = n>PLAYER.riot.best;
    const k = first ? 1 : RIOT.replayPct;                              // chơi lại tầng đã thắng = 30%
    const sh=Math.round(r.shards*k), cr=Math.round(r.credits*k);
    PLAYER.shards+=sh; PLAYER.credits+=cr;
    if(first){ PLAYER.riot.best=n; PLAYER.riot.tier=Math.min(RIOT.maxTier, n+1); }
    savePlayer();
    return first ? `TẦNG ${n} LẦN ĐẦU · +${sh} SH · +${cr} CR` + (PLAYER.riot.tier>n?`<br>MỞ TẦNG ${PLAYER.riot.tier}`:'')
                 : `DỌN LẠI TẦNG ${n} · +${sh} SH · +${cr} CR`;
  }
  const first=!PLAYER.cleared.includes(SECTOR.id);
  let txt;
  if(first){ PLAYER.cleared.push(SECTOR.id); PLAYER.shards+=SECTOR.reward.shards; PLAYER.credits+=SECTOR.reward.credits; savePlayer();
    txt=`LẦN ĐẦU · +${SECTOR.reward.shards} SH · +${SECTOR.reward.credits} CR`;
    if(SECTOR.unlock && !owns(SECTOR.unlock)){ PLAYER.owned.push(SECTOR.unlock); savePlayer(); txt+=`<br>NHÂN VẬT MỚI · ${ROSTER[SECTOR.unlock].name} — đọc hồ sơ ở ARCHIVE`; } }
  else { const sh=Math.round(SECTOR.reward.shards*.25), cr=Math.round(SECTOR.reward.credits*.25);   // chơi lại = tuần tra, 25% thưởng
    PLAYER.shards+=sh; PLAYER.credits+=cr; savePlayer(); txt=`TUẦN TRA · +${sh} SH · +${cr} CR`; }
  syncSectorStates();
  const st=STORY[SECTOR.id];
  if(st&&st.outro&&first&&!(PLAYER.settings&&PLAYER.settings.skipStory)){ await wait(700); if(g!==B.gen) return txt; await playComic(st.outro, SECTOR, 'outro'); }
  return txt;
}
/* Kẻ địch mới hạ được trong trận này → dòng thông báo mở bể. Chỉ kể con chiêu mộ được VÀ đã tới chương
   của nó: hạ Cantor thì defeated có hắn nhưng bể không bao giờ có (RECRUIT_SKIP), nói "mở bể" là nói dối. */
function openedTxt(){
  const ids=B.opened.filter(id => ROSTER[id] && unlocked(id));
  if(!ids.length) return '';
  const names=ids.map(id=>ROSTER[id].name).join(' · ');
  return `MỞ BỂ · ${names} — quay được ở REQUISITION`;
}
let finish = async function(win){
  const g=B.gen; B.over=true; setInputs(false);
  let rewardTxt='';
  if(win){
    rewardTxt = await winReward(g);
    if(g!==B.gen) return;
  }
  /* Lưu một lần cho cả trận, KỂ CẢ khi thua: killUnit đã ghi vào PLAYER.defeated mà nhánh thua
     trước giờ không lưu gì, để nguyên thì hạ được con nào rồi chết là mất trắng con đó. */
  savePlayer();
  const opened=openedTxt();
  if(opened) rewardTxt = rewardTxt ? rewardTxt+'<br>'+opened : opened;
  const nAlly=B.units.filter(u=>u.side==='ally').length;
  if(win) AUDIO.victory(); else AUDIO.defeat();
  UI.result.hidden=false; UI.result.className='result '+(win?'win':'lose');
  $('#resT').textContent = win?'THẮNG':'CẢ ĐỘI GỤC';
  $('#resS').innerHTML = (win?`${SECTOR.waves} wave · round ${B.round} · ${alive('ally').length}/${nAlly} sống sót`:`Wave ${B.wave}/${SECTOR.waves} · round ${B.round} · cả đội KIA`) + (rewardTxt?`<br><b class="result__rw">${rewardTxt}</b>`:'');
  log(win?'Thắng.':'Thua.', true);
};

/* ---- Chọn mục tiêu: bấm ATTACK / ULT đơn mục tiêu → địch sáng lên → chạm địch → thực hiện ---- */
function enterTargeting(kind){
  B.mode='target'; B.pending=kind;
  UI.stage.classList.add('is-targeting'); alive('enemy').forEach(x=>x.el.classList.add('is-pick')); ensureTarget();
  UI.btnAttack.disabled = kind!=='attack'; UI.btnAttack.classList.toggle('is-cancel', kind==='attack');
  UI.btnAttack.querySelector('.btn-act__k').textContent = kind==='attack' ? 'Huỷ' : 'Attack';
  if(kind==='ult'){ UI.btnUlt.dataset.state='targeting'; UI.ultMeta.textContent='CHỌN MỤC TIÊU · CHẠM ĐỂ HUỶ'; }
  else UI.btnUlt.dataset.state='locked';
  const u=current(); ticker(`Chọn mục tiêu cho ${kind==='attack'?'đòn thường':u.ult.name}: chạm vào kẻ địch · Esc để huỷ`);
  showHint('targetMode');
}
function exitTargeting(){
  if(B.mode!=='target') return;
  B.mode='idle'; B.pending=null;
  UI.stage.classList.remove('is-targeting'); B.units.forEach(x=>x.el&&x.el.classList.remove('is-pick'));
  UI.btnAttack.classList.remove('is-cancel'); UI.btnAttack.querySelector('.btn-act__k').textContent='Attack';
}
function cancelTargeting(){
  exitTargeting(); const u=current();
  if(u&&u.side==='ally'&&!B.busy&&!B.over){ setInputs(true); updateUltButton(u); ticker(`${u.name} — chọn hành động`); }
}
function onEnemyTap(u){ if(!u.alive||B.over) return; if(B.mode!=='target') return setTarget(u); confirmTarget(u); }
function confirmTarget(t){
  if(B.busy||B.over||B.mode!=='target'||!t||!t.alive) return;
  const kind=B.pending, u=current(); exitTargeting();
  B.target=t; ensureTarget();
  if(kind==='attack') execAttack(u,t); else execUlt(u,t);
}
function playerAttack(){
  if(B.over) return; const u=current(); if(!u||u.side!=='ally') return;
  if(B.mode==='target') return cancelTargeting();
  if(B.busy) return;
  const e=alive('enemy'); if(!e.length) return;
  if(RULES.autoTargetSingle && e.length===1) return execAttack(u,e[0]);
  enterTargeting('attack');
}
function playerUlt(){
  if(B.over) return; const u=current(); if(!u||u.side!=='ally') return;
  if(B.mode==='target') return cancelTargeting();
  if(B.busy||u.energy<u.ult.cost) return;
  // Diện rộng / hồi máu / lá chắn: không cần mục tiêu. target:'lowest' (CULL) cũng không — chiêu tự khoá người yếu nhất.
  if(!/nuke|control/.test(u.ult.kind) || u.ult.target==='lowest') return execUlt(u,null);
  const e=alive('enemy'); if(!e.length) return;
  if(RULES.autoTargetSingle && e.length===1) return execUlt(u,e[0]);
  enterTargeting('ult');
}
async function execAttack(u,t){
  const g=B.gen; B.busy=true; setInputs(false);
  const sk=u.skill||{};
  const crit=rollCrit(u,t,true);   // quay trước để chọn frame chí mạng
  await playMoveAttack(u,t,()=>{ dealDamage(u,t,sk.mult||1,{basic:true, crit, fx:sk.fx, status:sk.status}); gainEnergy(u,sk.energy||25); dailyProgress('attacks'); },{pose:crit?'crit':'attack'});
  if(g!==B.gen) return;
  await wait(reduced()?80:160); if(g!==B.gen) return;
  B.busy=false; endTurn();
}
/* Mở màn chiêu cuối, dùng chung cho đội mình và kẻ địch: chớp sân, rồi video holo trên đầu người phát chiêu
   (thiếu file / tắt VIDEO CHIÊU CUỐI trong CONFIG → banner tên chiêu như cũ).
   11/09: có video thì KHÔNG kêu tiếng chiêu cuối nữa (AUDIO.ult) và cũng bỏ luôn tiếng mở hộp trong playVideoBox —
   video tự có tiếng, chồng thêm hai tiếng tổng hợp lên trên chỉ làm đục. Không có video thì banner vẫn kêu như cũ.
   Cùng ngày, sau khi chạy thử một trận thật: `playHolo` giờ trả về CÓ CHẠY ĐƯỢC KHÔNG. Trình duyệt từ chối phát
   video có tiếng khi trang chưa nhận cú chạm nào (và file hỏng cũng vậy) — trước đây gặp cảnh đó là người chơi
   vừa không thấy hình vừa không nghe tiếng, vì AUDIO.ult đã bị bỏ. Nay hỏng thì rơi xuống banner + tiếng. */
async function ultCutin(u){
  UI.stageflash.animate([{opacity:.18},{opacity:0}],{duration:360,easing:'ease-out'});
  const src = ultVideoOn() ? await pickCutin(u) : null;
  if(src && await playHolo(u, src)) return;          // video chạy được: xong, tiếng đã nằm trong video
  AUDIO.ult();                                       // không có video, hoặc có mà không phát nổi → banner chữ + tiếng như cũ
  UI.ubName.textContent=u.ult.name; UI.ubSub.textContent=`${u.name} · ${u.ult.desc.split('.')[0]}`;
  UI.banner.style.setProperty('--accent', u.faction==='rust'?'var(--rust)':'var(--chrome)');
  UI.banner.classList.remove('show'); void UI.banner.offsetWidth; UI.banner.classList.add('show');
  return wait(reduced()?150:420);
}
async function execUlt(u,t){
  const g=B.gen; B.busy=true; setInputs(false); UI.btnUlt.dataset.state='casting'; UI.ultMeta.textContent='CASTING…';
  dailyProgress('ult');
  u.energy-=u.ult.cost; updateUnit(u);
  await ultCutin(u);
  if(g!==B.gen) return;
  const ult=u.ult, k=ult.kind, o={fx:ult.fx, status:ult.status};
  if(k==='nuke'){
    // target:'lowest' (CULL) = chiêu tự khoá người yếu nhất, người chơi KHÔNG được chọn — đó là nét riêng của
    // con chó, và là lý do nó được trả hệ số cao hơn. playerUlt cũng bỏ qua bước chọn mục tiêu cho chiêu này.
    if(ult.target==='lowest'){ const e=alive('enemy'); t = e.slice().sort((x,y)=>x.hp-y.hp)[0] || null; }
    if(!t||!t.alive) t=ensureTarget();
    const crit=!!t&&!ult.flat&&rollCrit(u,t,false);     // flat = sát thương cố định, không chí mạng (Glass Jaw)
    const hits=Math.max(1, ult.hits||1);               // hits = mấy nhịp vào cùng một người (BREACH 2), mỗi nhịp quay chí mạng riêng
    if(t) await playMoveAttack(u,t,()=>{
      let killed=false;
      for(let i=0;i<hits && t.alive;i++){
        const c = hits>1 ? rollCrit(u,t,false) : crit;  // nhiều nhịp thì quay lại chí mạng từng nhịp
        const r=dealDamage(u,t,ult.mult,{...o, crit:c, flat:ult.flat});
        killed = killed || r.killed;
      }
      if(killed && ult.refundOnKill){ gainEnergy(u,ult.refundOnKill); addChip(u,'refund','EN REFUND','+'+ult.refundOnKill); log(`${u.name} hoàn ${ult.refundOnKill} Energy (kill)`, true); setTimeout(()=>removeChip(u,'EN REFUND'), 2500); }
      // drainEnergy: rút Energy mục tiêu (Archon, Enforcer). Địch không có chiêu cuối thì không có thanh Energy → không rút được gì.
      if(ult.drainEnergy && t.alive){ const lost=loseEnergy(t, ult.drainEnergy===true?null:ult.drainEnergy); if(lost) log(`${t.name} mất ${lost} Energy`, true); }
    },{pose:crit?'crit':'attack'});
  } else if(k==='aoe'){
    const anim=playAttackAnim(u); await wait(90); if(g!==B.gen) return;
    alive('enemy').forEach(x=>dealDamage(u,x,ult.mult,o));
    // drainEnergy trên nhánh diện rộng: rút của MỌI kẻ địch còn sống (DRONE). Con nào không có chiêu cuối
    // thì không có thanh Energy nên không mất gì — đó là lý do bản chiêu mộ phải có hệ số nền tử tế.
    if(ult.drainEnergy){ let tong=0;
      alive('enemy').forEach(x=>{ tong += loseEnergy(x, ult.drainEnergy===true?null:ult.drainEnergy) || 0; });
      if(tong) log(`Nhiễu sóng: kẻ địch mất tổng ${tong} Energy`, true);
    }
    await anim;
  } else if(k==='heal'){
    /* Hai công thức hồi máu, KHÔNG gộp được — chúng thuộc về hai bộ số khác nhau:
       · mult  (Halo, Meridian, Psalm): hồi atk × mult cho CẢ ĐỘI. Luật gốc của đội mình, giữ nguyên.
       · healPct (Thợ Hàn, Mother Rust, Thợ Ống — chiêu của kẻ địch chiêu mộ về): hồi % HP TỐI ĐA của
         người được vá, mặc định cho người thủng nhất; healAll thì cho cả đội. Tính theo máu chứ không
         theo ATK nên mấy con đỡ đòn ATK thấp vẫn vá được ra hồn. */
    const anim=playAttackAnim(u); await wait(90); if(g!==B.gen) return;
    if(ult.healPct){
      const list = ult.healAll ? alive('ally') : [alive('ally').sort((a,b)=>a.hp/a.hpMax - b.hp/b.hpMax)[0] || u];
      let total=0;
      list.forEach(x=>{ if(!x) return; const before=x.hp; heal(u,x,Math.round(x.hpMax*ult.healPct)); playFx(x, ult.fx||'heal'); total+=x.hp-before; });
      log(ult.healAll ? `${u.name} vá cho cả đội — hồi ${total} HP` : `${u.name} vá cho ${list[0].name} — hồi ${total} HP`, true);
    } else {
      alive('ally').forEach(x=>{ heal(u,x,Math.round(u.atk*ult.mult)); playFx(x,'heal'); }); log(`${u.name} hồi máu cả đội`, true);
    }
    await anim;
  } else if(k==='shield'){
    /* Lá chắn, không đếm lượt, đánh vỡ mới thôi. Mặc định đắp cho chính mình (Kiln, Tin Man);
       shieldTarget:'biggest' thì đắp cho ĐỒNG ĐỘI nhiều HP tối đa nhất (Bulwark lấy thân che người sau lưng).
       Độ dày LUÔN tính theo hpMax của NGƯỜI DỰNG, kể cả khi chắn hộ — giống hệt enemyUlt, và đúng hình ảnh:
       cái che là tấm thép của Bulwark, to bằng chính hắn, không to theo người đứng sau. */
    const others=alive('ally').filter(x=>x!==u);
    const tgt = (ult.shieldTarget==='biggest' && others.length)
      ? others.sort((x,y)=>y.hpMax-x.hpMax)[0] : u;
    const amt=Math.round(u.hpMax*(ult.shieldPct||1));
    const anim=playAttackAnim(u); await wait(90); if(g!==B.gen) return;
    addShield(tgt, amt); playFx(tgt, ult.fx||'shield');
    log(tgt===u ? `${u.name} dựng lá chắn ${amt} — đánh vỡ mới thôi`
               : `${u.name} che cho ${tgt.name}: lá chắn ${amt} — đánh vỡ mới thôi`, true);
    await anim;
  } else if(k==='control'){
    if(!t||!t.alive) t=ensureTarget();
    if(t){
      /* Cùng nhịp với nhánh 'aoe': nhún tới + đổi sang frame đánh, 90ms sau mới ăn hiệu ứng lên mục tiêu.
         Trước 11/09 nhánh này không đụng gì tới người phát chiêu — xem hết video holo xong Psalm vẫn đứng yên. */
      const anim=playAttackAnim(u); await wait(90); if(g!==B.gen) return;
      t.controlled=true; addChip(t,'control','CONTROLLED','1T'); playFx(t, ult.fx||'shock'); if(AUDIO.shock) AUDIO.shock();
      log(`${u.name} chiếm quyền điều khiển ${t.name}`, true);
      await anim;
    }
  }
  if(g!==B.gen) return;
  await wait(reduced()?200:600); if(g!==B.gen) return;
  B.busy=false; endTurn();
}
/* ---- Video chiêu cuối: hộp holo chiếu trên đầu người phát chiêu (RULES.holo · css/fx.css .holo · playVideoBox ở core.js) ----
   Tỉ lệ cố định 16:9 (đúng tỉ lệ video đang có, không cắt), rộng 72% sân kẹp 220–340 px, neo trên đỉnh .unit__sprite của người
   phát chiêu và kẹp trong sân; sân mờ đi (.stagedim), người phát chiêu nổi lên (.is-casting); chạm sân hoặc SKIP để bỏ qua.
   ultVideo trong ROSTER: ['a.mp4','dự phòng.mp4'] = một video (thử lần lượt, lấy file đầu tiên tồn tại),
   hoặc [['a.mp4',…],['b.mp4',…]] = nhiều video, mỗi lần phát chiêu chọn ngẫu nhiên một trong số tồn tại. */
const ultVariants = def => (!def.ultVideo||!def.ultVideo.length) ? [] : (Array.isArray(def.ultVideo[0]) ? def.ultVideo : [def.ultVideo]);
async function pickCutin(u){
  const found=(await Promise.all(ultVariants(u).map(resolveVideo))).filter(Boolean);
  return found.length ? rand(found) : null;
}
function holoPlace(u){
  const box=$('#ultHolo'), s=UI.stage.getBoundingClientRect(), H=RULES.holo;
  const ratio=u.ultRatio||H.ratio;                                    // video của def (địch quay dọc 3:4) hay mặc định 16:9
  let w=Math.round(Math.min(H.wMax, Math.max(H.wMin, s.width*H.wPct))), h=Math.round(w/ratio);
  const hMax=Math.round(s.height*H.hPct);                             // video dọc: kẹp theo chiều cao để hộp không phủ kín sân
  if(h>hMax){ h=hMax; w=Math.round(h*ratio); }
  let cx=s.width/2, top=s.height*.12;
  const sp=u.el && u.el.querySelector('.unit__sprite');
  if(sp){ const r=sp.getBoundingClientRect(); cx=r.left+r.width/2-s.left; top=r.top-s.top-H.gap-12-h; }   // 12 = đuôi mũi tên
  const left=Math.round(Math.min(s.width-w-6, Math.max(6, cx-w/2))); top=Math.round(Math.min(s.height-h-6, Math.max(6, top)));
  box.style.setProperty('--hx', left+'px'); box.style.setProperty('--hy', top+'px'); box.style.setProperty('--hw', w+'px');
  box.style.setProperty('--holo-ratio', String(ratio)); box.style.setProperty('--tx', Math.round(Math.min(w-16, Math.max(16, cx-left)))+'px');
}
/* Trả về true nếu video chạy thật. false = trình duyệt không cho phát (chưa có cú chạm nào) hoặc file hỏng —
   lúc đó ultCutin phải rơi về banner chữ, nếu không người chơi vừa không thấy hình vừa không nghe tiếng. */
async function playHolo(u, src){
  const box=$('#ultHolo'); if(!box) return false;
  holoPlace(u); UI.stage.classList.add('is-holo'); if(u.el) u.el.classList.add('is-casting');
  try{ return await playVideoBox(box, src, `${u.name} · ULTIMATE`, u.ult.name, u.faction==='rust'?'var(--rust)':'var(--chrome)', {silent:true}); }   // silent: không kêu tiếng mở hộp, để nguyên tiếng của video
  finally{ UI.stage.classList.remove('is-holo'); if(u.el) u.el.classList.remove('is-casting'); }
}
/* Dừng video (reset trận / rời trận) — app.js gọi khi đổi màn hình */
function stopCutin(){ const box=$('#ultHolo'); if(box) stopVideoBox(box); UI.stage.classList.remove('is-holo'); B.units.forEach(u=>u.el&&u.el.classList.remove('is-casting')); }
{ const dim=$('#stagedim'); if(dim) dim.addEventListener('click', ()=>{ const box=$('#ultHolo'); if(box&&box._end) box._end(); }); }

async function enemyAct(e){
  const g=B.gen;
  if(e.link && e.alive && alive('enemy').some(x=>x!==e && x.link)){            // HALO LINK
    const amt=Math.round(e.hpMax*.08); if(e.hp<e.hpMax){ heal(e,e,amt); log(`${e.name} hồi ${amt} HP qua HALO LINK`); await wait(reduced()?100:350); if(g!==B.gen) return; }
  }
  if(e.ult){ gainEnergy(e, RULES.foeUltGain); await wait(reduced()?60:220); if(g!==B.gen) return; }   // nạp Energy đầu lượt: người chơi kịp thấy thanh đầy
  if(e.ult && e.energy>=e.ult.cost && !e.controlled){                          // đủ Energy → tung chiêu cuối thay cho đòn thường
    await enemyUlt(e); if(g!==B.gen) return;
    await wait(reduced()?200:600); if(g!==B.gen) return;
    return endTurn();
  }
  let tgt;
  if(e.controlled){
    e.controlled=false; removeChip(e,'CONTROLLED');
    const others=alive('enemy').filter(x=>x!==e); tgt=others.length?rand(others):e;
    log(`${e.name} bị điều khiển → tấn công ${tgt.name}`, true);
  } else {
    const a=alive('ally'); if(!a.length) return endTurn(); tgt=rand(a);
  }
  const sk=e.skill||{}, crit=rollCrit(e,tgt,false), o={fx:sk.fx, status:sk.status, crit};   // fx/status: FOE_SKILL (js/data.js); crit quay trước để chọn frame
  if(tgt===e){ dealDamage(e,tgt,1,o); }
  else await playMoveAttack(e,tgt,()=>dealDamage(e,tgt,1,o),{out:200,impact:60,hold:100,back:200,pose:crit?'crit':'attack'});
  if(g!==B.gen) return;
  await wait(reduced()?200:320); if(g!==B.gen) return;
  endTurn();
}
/* ---- Chiêu cuối của kẻ địch (khai trong ENEMY_POOL, js/data.js) ----
   Cut-in dùng chung với đội mình (ultCutin → holo trên đầu nó). Bốn kiểu đang có:
     nuke   = lao tới một người của bạn (chọn ngẫu nhiên như đòn thường), đánh mult × ATK hoặc flat sát thương cố định
              — GLASS JAW (flat), RIGGER, FOREMAN, ENFORCER. Ba cờ phụ:
                drainEnergy = rút Energy của người trúng đòn — ARCHON (sạch), ENFORCER (25)
                target:'lowest' = không chọn ngẫu nhiên mà nhắm người HP thấp nhất — CHROME HOUND
                hits = đánh liền mấy nhịp vào cùng một người, mỗi nhịp quay chí mạng riêng — DRILL-BIT (2)
     aoe    = đứng tại chỗ đánh cả ba người một lượt — CANTOR
     shield = dựng lá chắn bằng shieldPct × HP tối đa của CHÍNH NÓ — KILN (tự chắn);
              thêm shieldTarget:'biggest' thì đắp cho con to nhất còn sống thay vì cho mình — BULWARK
     heal   = hồi cho đồng bọn thủng nhất (tỉ lệ HP thấp nhất, tính cả chính nó), bằng healPct × HP tối đa của con đó
              — THỢ HÀN; thêm healAll:true thì hồi cho mọi con còn sống — MOTHER RUST */
async function enemyUlt(e){
  const g=B.gen, ult=e.ult;
  e.energy-=ult.cost; updateUnit(e);
  log(`${e.name} tung chiêu cuối · ${ult.name}`, true);
  await ultCutin(e); if(g!==B.gen || !e.alive) return;
  if(ult.kind==='shield'){
    const amt=Math.round(e.hpMax*(ult.shieldPct||1));                                        // lá chắn luôn tính theo HP của CON DỰNG, kể cả khi chắn hộ con khác
    const others=alive('enemy').filter(x=>x!==e);
    const t = ult.shieldTarget==='biggest' && others.length                                   // BULWARK chắn cho con to nhất còn sống (đứng một mình thì tự chắn)
      ? others.sort((a,b)=>b.hpMax-a.hpMax)[0] : e;
    const anim=playAttackAnim(e); await wait(90); if(g!==B.gen) return;
    addShield(t, amt); playFx(t, ult.fx||'shield');
    log(t===e ? `${e.name} dựng lá chắn ${amt} — đánh vỡ mới thôi` : `${e.name} dựng lá chắn ${amt} cho ${t.name} — đánh vỡ mới thôi`, true);
    await anim;
  } else if(ult.kind==='heal'){
    const list = ult.healAll ? alive('enemy') : [alive('enemy').sort((a,b)=>a.hp/a.hpMax - b.hp/b.hpMax)[0] || e];   // con thủng nhất, tính cả chính nó
    const anim=playAttackAnim(e); await wait(90); if(g!==B.gen) return;
    let total=0;
    list.forEach(t=>{ if(!t) return; const before=t.hp; heal(e, t, Math.round(t.hpMax*(ult.healPct||.3))); playFx(t, ult.fx||'heal'); total+=t.hp-before; });
    log(ult.healAll ? `${e.name} vá cho cả đám — hồi ${total} HP` : `${e.name} vá cho ${list[0].name} — hồi ${total} HP`, true);
    await anim;
  } else if(ult.kind==='aoe'){
    const a=alive('ally'); if(!a.length) return;
    const anim=playAttackAnim(e); await wait(90); if(g!==B.gen) return;
    a.forEach(t=>dealDamage(e, t, ult.mult||1, {fx:ult.fx, status:ult.status}));
    if(ult.drainEnergy){                                                                      // DRONE MK1: quét một đường rồi nhiễu Halo cả đội
      const lost=a.filter(t=>t.alive).map(t=>loseEnergy(t, ult.drainEnergy===true?null:ult.drainEnergy)).reduce((x,y)=>x+y,0);
      if(lost) log(`${e.name} làm nhiễu — cả đội mất ${lost} Energy`, true);
    }
    await anim;
  } else {
    const a=alive('ally'); if(!a.length) return;
    const t = ult.target==='lowest' ? a.slice().sort((x,y)=>x.hp-y.hp)[0] : rand(a);          // CHROME HOUND săn người yếu nhất; còn lại chọn ngẫu nhiên như đòn thường
    const hits=Math.max(1, ult.hits||1);                                                      // DRILL-BIT khoan hai nhịp vào cùng một người, mỗi nhịp quay chí mạng riêng
    await playMoveAttack(e, t, ()=>{
      for(let i=0;i<hits && t.alive;i++) dealDamage(e, t, ult.mult||1, {flat:ult.flat, fx:ult.fx, status:ult.status});
      if(ult.drainEnergy && t.alive){ const lost=loseEnergy(t, ult.drainEnergy===true?null:ult.drainEnergy); if(lost) log(`${t.name} mất ${lost} Energy`, true); }
    }, {out:200,impact:60,hold:100,back:200});
  }
}
UI.btnAttack.addEventListener('click', playerAttack);
UI.btnUlt.addEventListener('click', playerUlt);
$('#btnReset').addEventListener('click', ()=>{ B.skipIntro=true; initBattle(); B.skipIntro=false; });
$('#btnAgain').addEventListener('click', ()=>{ B.skipIntro=true; initBattle(); B.skipIntro=false; });
document.addEventListener('keydown', e=>{
  if($('#battle').dataset.screen!=='battle') return;
  if(e.key==='Escape' && PAS.box && !PAS.box.hidden){ e.preventDefault(); return closePassive(); }   // Esc đóng bảng nội tại trước
  if(B.mode!=='target') return;
  if(e.key==='Escape'){ e.preventDefault(); cancelTargeting(); }
  else if(e.key==='Enter'){ e.preventDefault(); const t=ensureTarget(); if(t) confirmTarget(t); }
});
