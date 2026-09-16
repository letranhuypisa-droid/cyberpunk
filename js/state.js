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
  if(l>=ascCap(id)) return 'gate';                                  // tới trần tạm: phải ĐỘT PHÁ mới lên tiếp
  const c=UPGRADE.cost(l); if(PLAYER.credits<c) return 'poor';
  PLAYER.credits-=c; PLAYER.levels=PLAYER.levels||{}; PLAYER.levels[id]=l+1;
  if(typeof passAdd==='function') passAdd('level');
  savePlayer(); return 'ok';
}

/* =====================================================================
   ĐỘT PHÁ (đợt 7 · D4 — bảng mốc ở ASCEND trong js/data.js, đặc tả ở docs/dot-pha.md)
   Cấp 5/10/15 là cửa: hết CR cũng không qua được cho tới khi đột phá. Vì cửa chặn nên số sao suy được
   từ cấp — nhưng vẫn lưu riêng ở PLAYER.asc, để "đang ở cấp 5 và ĐÃ đột phá" khác "đang ở cấp 5 và chưa".
   ===================================================================== */
const ascStars = id => (PLAYER.asc && PLAYER.asc[id]) || 0;
/* Trần cấp hiện tại: chưa sao nào thì 5, một sao thì 10… đủ bốn sao thì chạm trần chung UPGRADE.maxLevel */
const ascCap = id => Math.min(UPGRADE.maxLevel, ASCEND[ascStars(id)] ? ASCEND[ascStars(id)].lv : UPGRADE.maxLevel);
/* Mốc sắp tới (null nếu đã đủ bốn sao) */
const ascNext = id => ASCEND[ascStars(id)] || null;
const dupesOf = id => (PLAYER.extra && PLAYER.extra[id]) || 0;
/* Vì sao chưa đột phá được — trả về chuỗi lý do để nút nói thẳng thay vì chỉ mờ đi */
function ascWhy(id){
  const m=ascNext(id); if(!m) return 'max';
  if(lvl(id) < m.lv) return 'level';                                // chưa tới cấp mốc
  if(PLAYER.credits < m.cr) return 'cr';
  if(dupesOf(id) < m.dupes && PLAYER.parts < m.lk) return 'pay';    // không đủ CẢ HAI đường trả
  return 'ok';
}
const canAscend = id => ascWhy(id)==='ok';
/* Trả bằng gì: 'dupes' nếu còn đủ bản dư, không thì 'lk'. Bản dư luôn là đường rẻ nên ưu tiên khi có đủ. */
const ascPayWith = id => { const m=ascNext(id); if(!m) return null; return dupesOf(id)>=m.dupes ? 'dupes' : 'lk'; };
function ascend(id, pay){
  const m=ascNext(id); if(!m) return 'max';
  if(lvl(id) < m.lv) return 'level';
  if(PLAYER.credits < m.cr) return 'cr';
  pay = pay || ascPayWith(id);
  if(pay==='dupes'){ if(dupesOf(id) < m.dupes) return 'pay';
    PLAYER.extra[id] = dupesOf(id) - m.dupes; if(!PLAYER.extra[id]) delete PLAYER.extra[id]; }
  else { if(PLAYER.parts < m.lk) return 'pay'; PLAYER.parts -= m.lk; }
  PLAYER.credits -= m.cr;
  PLAYER.asc = PLAYER.asc || {}; PLAYER.asc[id] = ascStars(id) + 1;
  if(typeof passAdd==='function') passAdd('ascend');
  savePlayer(); return 'ok';
}
/* Cộng dồn thưởng của những sao ĐÃ đạt. statPct nhân dồn (1.06 × 1.06), giống cách cyberware nối vào. */
function ascBonus(id){
  const n=ascStars(id); const b={ statMult:1, crit:0, energyStart:0, ultMult:1 };
  for(let i=0;i<n && i<ASCEND.length;i++){ const m=ASCEND[i];
    if(m.statPct) b.statMult *= 1 + m.statPct/100;
    if(m.crit) b.crit += m.crit;
    if(m.energyStart) b.energyStart = Math.max(b.energyStart, m.energyStart);
    if(m.ultMult) b.ultMult *= m.ultMult;
  }
  return b;
}

/* =====================================================================
   CHỈ SỐ CUỐI — một chỗ duy nhất tính ATK/HP/SPD/CRIT của một đơn vị.
   Gọi ở: initBattle (battle.js), cardEl (core.js), openLore (app.js), power() bên dưới.
   Thêm nguồn cộng chỉ số mới (linh kiện, cyberware) thì nối vào đây, không đi sửa ba chỗ rời nhau.
   core.js nạp trước state.js và kit.html không nạp state.js — nơi gọi phải guard typeof.
   ===================================================================== */
/* Cấp nâng cấp NHÂN trước, cyberware nhân sau — hai nguồn nhân nhau chứ không cộng dồn phần trăm.
   cyberBonus() ở js/cyber.js nạp sau file này, nên phải guard typeof (kit.html cũng không nạp nó). */
/* Ba nguồn, nhân/cộng theo đúng thứ tự: cấp nâng cấp (nhân) × đột phá (nhân) × cyberware (nhân);
   CRIT thì cộng thẳng. Đột phá nằm giữa vì nó là phần thưởng của chính thang cấp. */
function unitStats(id){
  const d = (typeof ROSTER!=='undefined' && ROSTER[id]) || null;
  if(!d) return { atk:0, hp:0, spd:100, crit:0 };
  const m = statMult(id);
  const a = typeof ascBonus==='function' ? ascBonus(id) : { statMult:1, crit:0 };
  const c = typeof cyberBonus==='function' ? cyberBonus(id) : { atkPct:0, hpPct:0, spd:0, crit:0 };
  return { atk:  Math.round(d.atk*m*a.statMult*(1+(c.atkPct||0)/100)),
           hp:   Math.round(d.hp *m*a.statMult*(1+(c.hpPct ||0)/100)),
           spd:  Math.round((d.spd||100) + (c.spd||0)),
           crit: Math.round((d.crit||0)  + (a.crit||0) + (c.crit||0)) };
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
/* Hai thưởng đột phá KHÔNG nằm trong bốn chỉ số (Energy vào trận, chiêu cuối ×1.15) nên phải cộng tay,
   nếu không thì nhãn độ khó ở DẸP LOẠN nói dối: đo 16/09 thấy đội cấp 20 đủ bốn sao thắng 94–100% ở ba
   cái bãi mà nhãn vẫn ghi NGANG SỨC (docs/dot-pha.md §F). 0.03 cho Energy mở màn + một nửa phần chiêu
   cuối tăng thêm — nửa còn lại coi như đã nằm trong ATK. */
function ascPowerExtra(id){
  if(typeof ascBonus!=='function') return 0;
  const a=ascBonus(id);
  return (a.energyStart?.03:0) + (a.ultMult>1 ? (a.ultMult-1)*.5 : 0);
}
const power = id => { const s=unitStats(id); return Math.round((s.atk*4 + s.hp*.6 + s.spd*2 + s.crit*6) * (1+ascPowerExtra(id))); };
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
/* Một chỗ duy nhất cho cả nhiệm vụ ngày lẫn dấu HỢP ĐỒNG THÁNG: win / pull / riotcrate đều đi qua đây,
   nên hook ở đây rẻ hơn nhiều so với rải passAdd khắp battle.js, app.js, riot.js (docs/hop-dong-thang.md §C).
   Dấu cộng theo SỐ LẦN THẬT (n), không theo tiến độ nhiệm vụ — nhiệm vụ ngày đầy rồi thì vẫn còn dấu. */
function dailyProgress(id, n=1){
  if(typeof passAdd==='function') passAdd(id, n);
  const d=dailyTick(); const t=DAILY_TASKS.find(x=>x.id===id); if(!t) return;
  const before=d.prog[id]||0; d.prog[id]=Math.min(t.goal, before+n);
  if(before<t.goal && d.prog[id]>=t.goal && typeof AUDIO!=='undefined') AUDIO.ready();
  savePlayer();
}
function dailyClaimable(){ const d=dailyTick(); return DAILY_TASKS.filter(t=>(d.prog[t.id]||0)>=t.goal && !d.claimed.includes(t.id)); }

/* =====================================================================
   GIỮ CHÂN (đợt 7 — docs/giu-chan.md §D1 §D2 §D5). Số liệu ở COMEBACK/STREAK trong js/data.js.
   ===================================================================== */

/* ---- VỀ RỒI: quà theo số giờ vắng mặt ----
   PLAYER.lastSeen được đóng dấu lúc rời trang (pagehide) và định kỳ khi đang chơi, nên nó là "lần cuối
   thật sự có mặt". Quà tính theo giờ, kẹp ở COMEBACK.capHours, và CHỈ NHẬN MỘT LẦN MỖI NGÀY — không có
   đường tắt-mở game liên tục để farm. Trả về null nếu chưa đủ COMEBACK.minHours hoặc đã nhận hôm nay. */
function comebackOffer(){
  const last = PLAYER.lastSeen || 0;
  if(!last) return null;                                    // hồ sơ mới: chưa từng rời đi thì không có gì để "về"
  if(PLAYER.records && PLAYER.records.comebackDate === today()) return null;
  const hoursRaw = (Date.now() - last) / 36e5;
  if(hoursRaw < COMEBACK.minHours) return null;
  const h = Math.min(COMEBACK.capHours, Math.floor(hoursRaw));
  return { hours:h, hoursRaw, shards:h*COMEBACK.shHour, credits:h*COMEBACK.crHour, capped:hoursRaw>COMEBACK.capHours };
}
function comebackClaim(offer){
  if(!offer) return false;
  PLAYER.shards += offer.shards; PLAYER.credits += offer.credits;
  PLAYER.records = PLAYER.records || {}; PLAYER.records.comebackDate = today();
  savePlayer(); return true;
}
/* Đóng dấu "tôi đang ở đây". Gọi lúc rời trang và mỗi vài phút — đừng gọi mỗi frame, mỗi lần là một lần ghi ổ đĩa. */
function touchSeen(){ PLAYER.lastSeen = Date.now(); savePlayer(); }

/* ---- CHUỖI NGÀY: đếm số ngày CÓ MỞ GAME trong tuần, tích luỹ ----
   Cố ý KHÔNG phải chuỗi liên tiếp: nghỉ một hôm thì chậm tới mốc sau chứ không mất gì (docs/giu-chan.md §D2).
   Tuần bắt đầu thứ Hai; dùng chung cách tính với hợp đồng tuần của DẸP LOẠN nếu file đó đã nạp. */
function weekId(d){
  if(typeof riotWeekId==='function') return riotWeekId(d);
  d = d || new Date();
  const t = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  t.setDate(t.getDate() - ((t.getDay()+6)%7));
  return `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,'0')}-${String(t.getDate()).padStart(2,'0')}`;
}
function streakTick(){
  const id=weekId();
  if(!PLAYER.week || PLAYER.week.id!==id) PLAYER.week={ id, days:[], claimed:[] };
  const d=today();
  if(!PLAYER.week.days.includes(d)){ PLAYER.week.days.push(d); savePlayer(); }
  return PLAYER.week;
}
const streakDays = () => streakTick().days.length;
const streakClaimable = () => { const w=streakTick(); return STREAK.filter(s=>w.days.length>=s.days && !w.claimed.includes(s.days)); };
/* Mốc kế tiếp chưa tới (để in "còn 2 ngày nữa"); hết mốc thì null */
const streakNext = () => { const n=streakDays(); return STREAK.find(s=>s.days>n) || null; };
function streakClaim(days){
  const w=streakTick(), s=STREAK.find(x=>x.days===days);
  if(!s || w.days.length<s.days || w.claimed.includes(days)) return false;
  w.claimed.push(days); PLAYER.shards += s.sh; savePlayer(); return true;
}

/* ---- KỶ LỤC: cái tốt nhất mình từng làm (docs/giu-chan.md §D5) ----
   Không có server, nên đối thủ duy nhất là bản thân hôm qua. recordSet chỉ ghi khi thật sự tốt hơn:
   `better` quyết định chiều so sánh vì "nhanh nhất" là nhỏ hơn còn "sâu nhất" là lớn hơn. */
function recordSet(key, value, extra, better){
  PLAYER.records = PLAYER.records || {};
  const cur = PLAYER.records[key];
  const cmp = better || ((a,b)=>a>b);                       // mặc định: lớn hơn là tốt hơn
  if(cur && !cmp(value, cur.value)) return false;
  PLAYER.records[key] = Object.assign({ value, date:today() }, extra||{});
  savePlayer(); return true;
}
const recordGet = key => (PLAYER.records||{})[key] || null;
function dailyClaim(id){
  const d=dailyTick(); const t=DAILY_TASKS.find(x=>x.id===id);
  if(!t || (d.prog[id]||0)<t.goal || d.claimed.includes(id)) return false;
  d.claimed.push(id); PLAYER.shards+=t.reward;
  if(typeof passAdd==='function') passAdd('daily');   // làm xong một nhiệm vụ ngày = 4 dấu hợp đồng tháng
  savePlayer(); return true;
}
