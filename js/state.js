'use strict';
/* =====================================================================
   STATE — lưu/nạp hồ sơ người chơi.
   Mặc định: localStorage (key PLAYER_KEY trong data.js; hồ sơ v2 cũ được data.js tự chuyển đổi). Muốn lưu server: đặt SAVE.mode='remote'
   và trỏ SAVE.endpoint tới API nhận PUT/GET JSON hồ sơ (chưa có backend).
   Mọi nơi trong game chỉ gọi savePlayer(); không đụng localStorage trực tiếp.
   ===================================================================== */
const SAVE = {
  mode: 'local',                 // 'local' | 'remote'
  endpoint: '/api/profile',      // ★ backend chưa có
  key: PLAYER_KEY,
  load(){ try{ return JSON.parse(localStorage.getItem(this.key)||'{}'); }catch(e){ return {}; } },
  save(p){
    try{ localStorage.setItem(this.key, JSON.stringify(p)); }catch(e){}
    if(this.mode==='remote') this.push(p);
  },
  _t:null,
  push(p){                       // gộp nhiều lần lưu liên tiếp thành một request
    clearTimeout(this._t);
    this._t=setTimeout(async()=>{ try{ await fetch(this.endpoint,{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify(p)}); }catch(e){ console.warn('SAVE.push failed',e); } }, 800);
  },
  async pull(){
    if(this.mode!=='remote') return null;
    try{ const r=await fetch(this.endpoint); if(r.ok) return await r.json(); }catch(e){ console.warn('SAVE.pull failed',e); }
    return null;
  },
  reset(){ try{ localStorage.removeItem(this.key); (typeof LEGACY_KEYS!=='undefined'?LEGACY_KEYS:[]).forEach(k=>localStorage.removeItem(k)); }catch(e){} },
};

/* ---- Nâng cấp nhân vật bằng CR ★ FAKE: +4% ATK/HP mỗi cấp, tối đa 20, giá 400×cấp ---- */
const UPGRADE = { maxLevel:20, statPerLevel:.04, cost: l => 400*l };
const lvl = id => (PLAYER.levels && PLAYER.levels[id]) || 1;
const statMult = id => 1 + UPGRADE.statPerLevel*(lvl(id)-1);
function upgrade(id){
  const l=lvl(id); if(l>=UPGRADE.maxLevel) return 'max';
  const c=UPGRADE.cost(l); if(PLAYER.credits<c) return 'poor';
  PLAYER.credits-=c; PLAYER.levels=PLAYER.levels||{}; PLAYER.levels[id]=l+1; savePlayer(); return 'ok';
}

/* =====================================================================
   CHỈ SỐ CUỐI — một chỗ duy nhất tính ATK/HP/SPD/CRIT của một đơn vị.
   Gọi ở: initBattle (battle.js), cardEl (core.js), openLore (app.js), power() bên dưới.
   Thêm nguồn cộng chỉ số mới (linh kiện, cyberware) thì nối vào đây, không đi sửa ba chỗ rời nhau.
   core.js nạp trước state.js và kit.html không nạp state.js — nơi gọi phải guard typeof.
   ===================================================================== */
/* Cấp nâng cấp NHÂN trước, cyberware nhân sau — hai nguồn nhân nhau chứ không cộng dồn phần trăm.
   cyberBonus() ở js/cyber.js nạp sau file này, nên phải guard typeof (kit.html cũng không nạp nó). */
function unitStats(id){
  const d = (typeof ROSTER!=='undefined' && ROSTER[id]) || null;
  if(!d) return { atk:0, hp:0, spd:100, crit:0 };
  const m = statMult(id);
  const c = typeof cyberBonus==='function' ? cyberBonus(id) : { atkPct:0, hpPct:0, spd:0, crit:0 };
  return { atk:  Math.round(d.atk*m*(1+(c.atkPct||0)/100)),
           hp:   Math.round(d.hp *m*(1+(c.hpPct ||0)/100)),
           spd:  Math.round((d.spd||100) + (c.spd||0)),
           crit: Math.round((d.crit||0)  + (c.crit||0)) };
}
/* Chỉ số GỐC (đã tính cấp, chưa tính cyberware) — màn CYBERWARE in "145 → 168" cần vế trái này */
function baseStats(id){
  const d = (typeof ROSTER!=='undefined' && ROSTER[id]) || null;
  if(!d) return { atk:0, hp:0, spd:100, crit:0 };
  const m = statMult(id);
  return { atk:Math.round(d.atk*m), hp:Math.round(d.hp*m), spd:d.spd||100, crit:d.crit||0 };
}
/* Sức mạnh tổng — thước đo duy nhất cho ngưỡng giữ bãi ở chế độ chiếm bãi.
   Trọng số ★ FAKE, đo bằng đội mở đầu: Yuki cấp 1 ≈ 1.494 · yuki+ash+kai ≈ 4.200. */
const power = id => { const s=unitStats(id); return Math.round(s.atk*4 + s.hp*.6 + s.spd*2 + s.crit*6); };
const teamPower = ids => (ids||[]).filter(Boolean).reduce((s,id)=>s+power(id), 0);

/* ---- Nhiệm vụ ngày ★ FAKE: reset theo ngày địa phương ---- */
const DAILY_TASKS = [
  { id:'win',     label:'Thắng 1 trận',              goal:1,  reward:40 },
  { id:'attacks', label:'Tung 15 đòn thường',        goal:15, reward:30 },
  { id:'ult',     label:'Phát 3 chiêu cuối',         goal:3,  reward:40 },
  { id:'pull',    label:'Quay Requisition 1 lần',    goal:1,  reward:30 },
  { id:'riotcrate', label:'Nhận 5 kiện ở Khu Đáy',   goal:5,  reward:30 },   // DẸP LOẠN, js/riot.js gọi dailyProgress
];
const today = () => { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
function dailyTick(){
  if(!PLAYER.daily || PLAYER.daily.date!==today()){ PLAYER.daily={ date:today(), prog:{}, claimed:[] }; savePlayer(); }
  return PLAYER.daily;
}
function dailyProgress(id, n=1){
  const d=dailyTick(); const t=DAILY_TASKS.find(x=>x.id===id); if(!t) return;
  const before=d.prog[id]||0; d.prog[id]=Math.min(t.goal, before+n);
  if(before<t.goal && d.prog[id]>=t.goal && typeof AUDIO!=='undefined') AUDIO.ready();
  savePlayer();
}
function dailyClaimable(){ const d=dailyTick(); return DAILY_TASKS.filter(t=>(d.prog[t.id]||0)>=t.goal && !d.claimed.includes(t.id)); }
function dailyClaim(id){
  const d=dailyTick(); const t=DAILY_TASKS.find(x=>x.id===id);
  if(!t || (d.prog[id]||0)<t.goal || d.claimed.includes(id)) return false;
  d.claimed.push(id); PLAYER.shards+=t.reward; savePlayer(); return true;
}
