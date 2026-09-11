'use strict';
/* =====================================================================
   CYBERWARE — 6 ô trang bị, mỗi ô một THANG 10 BẬC, và LINH KIỆN (LK) lấy từ phân tách bản dư.
   Số liệu + logic thuần; màn hình ở js/cyberui.js. Đặc tả đầy đủ: docs/cyberware.md.

   Nạp SAU js/state.js (cần unitStats/savePlayer) và TRƯỚC js/app.js.
   Nối vào chỉ số qua MỘT chỗ duy nhất: unitStats(id) trong js/state.js gọi cyberBonus(id).

   ---- 11/09 (chiều): dựng lại theo bộ art anh gửi ----
   Bản đầu tôi tự nghĩ ra 5 ô × 3 hạng × 3 bậc. Anh gửi 6 tấm contact sheet, mỗi tấm 10 món xếp
   01→10 theo độ hiếm (COMMON ×2 · UNCOMMON ×2 · RARE ×2 · EPIC ×2 · LEGENDARY · MYTHIC).
   Bộ art đó nói ra một mô hình gọn hơn hẳn: MỘT THANG, không phải hai trục. Theo lệ của dự án
   (art thắng, chữ và cơ chế chạy theo art) thì đổi hết sang thang 10 bậc. Tên món giữ NGUYÊN
   tiếng Anh như trên art để chữ trong game và chữ trên ảnh là một.

   ★ FAKE: chỉ số và giá là bản nháp. scratch/sim.js CHƯA mô phỏng cyberware, nên bảng tỉ lệ thắng
   ở docs/dep-loan.md §F1 là SÀN — người có cyberware sẽ thấy dễ hơn thế.
   ===================================================================== */

/* Sáu độ hiếm, đúng bộ nhãn in trên art. Màu lấy từ token có sẵn của css/chromefall.css. */
const CYBER_RARITY = {
  C: { key:'C', label:'COMMON',    css:'r-c' },
  U: { key:'U', label:'UNCOMMON',  css:'r-u' },
  R: { key:'R', label:'RARE',      css:'r-r' },
  E: { key:'E', label:'EPIC',      css:'r-e' },
  L: { key:'L', label:'LEGENDARY', css:'r-l' },
  M: { key:'M', label:'MYTHIC',    css:'r-m' },
};
/* Bậc 1..10 → độ hiếm. Cùng nhịp với art: hai COMMON, hai UNCOMMON, hai RARE, hai EPIC, rồi LEGENDARY, MYTHIC */
const CYBER_STEP_RARITY = ['C','C','U','U','R','R','E','E','L','M'];

const CYBER = {
  maxStep: 10,
  /* Đường cong chỉ số: bậc 10 = 1.00, bậc 1 = 5%. Thang 10 bậc thì dốc lên cuối mới đã tay. */
  curve: [.05, .09, .14, .20, .28, .36, .46, .60, .78, 1.00],
  /* Giá NÂNG LÊN bậc i+1 (bậc 1 mua từ ô trống). lk = round(4 × 1.45^i), cr = lk × 60. */
  lk:   [4, 6, 9, 13, 19, 27, 39, 56, 80, 115],
  crK:  60,
  scrap: { B:10, A:25, S:60 },     // LK nhận được khi phân tách một lá trùng, theo bậc nhân vật
  /* RONIN: art cho thấy bậc thấp KHÔNG phải cấy ghép (găng tay, áo khoác, mũ lưỡi trai, giày).
     Anh đi được tới bậc cuối cùng còn là ĐỒ MẶC VÀO của từng ô, rồi dừng. Số dưới đây đọc thẳng từ art. */
  bareCap: { head:8, body:7, arm:2, legs:8, ac1:8, ac2:8 },
  bareBonus: 1.5,                  // món đang đứng ĐÚNG bậc trần của anh: chỉ số ×1.5 (THÉP TRẦN)
};
const cyberLkCost = step => CYBER.lk[step-1] || 0;                    // giá để LÊN bậc `step`
const cyberCost   = step => ({ lk:cyberLkCost(step), cr:cyberLkCost(step)*CYBER.crK });

/* =====================================================================
   6 Ô — mỗi ô một tấm art, mỗi tấm 10 món.
   max  = chỉ số ở BẬC 10 (bậc thấp hơn = max × CYBER.curve[step-1])
   list = [tên trên art, dòng phụ tiếng Việt] theo đúng thứ tự 01→10 của tấm
   ===================================================================== */
const CYBER_SLOTS = [
  { id:'head', name:'ĐẦU',  sub:'mũ · nón · nón bảo hiểm', sheet:'head',
    max:{ crit:22, spd:6 },
    list:[
      ['STREET CAP',         'Mũ lưỡi trai bạc màu'],
      ['TACTICAL CAP',       'Vải gia cố'],
      ['TECH BEANIE',        'Mũ len giữ nhiệt'],
      ['TACTICAL HEADSET',   'Tăng cường thính giác'],
      ['URBAN HELMET',       'Kính chắn tăng tầm nhìn'],
      ['TACTICAL HELMET',    'HUD tích hợp'],
      ['COMBAT HELMET',      'Giao diện thực tại tăng cường'],
      ['EXO HELMET',         'Kín hoàn toàn, lọc khí'],
      ['NEURAL HELMET',      'Nối thẳng vào thần kinh'],
      ['QUANTUM HELMET',     'Đồng bộ toàn phần'],
    ] },
  { id:'body', name:'THÂN', sub:'áo khoác · giáp', sheet:'body',
    max:{ hpPct:26 },
    list:[
      ['STREET JACKET',      'Áo khoác đường phố'],
      ['TACTICAL JACKET',    'Vải bền, nhiều túi'],
      ['FIELD COAT',         'Chịu được mưa axit'],
      ['TECH COAT',          'Tự điều nhiệt'],
      ['ARMORED JACKET',     'Chắn được va đập'],
      ['TACTICAL COAT',      'Lắp ghép theo mảnh'],
      ['CYBER COAT',         'Mạch chạy trong lớp vải'],
      ['AUGMENT COAT',       'Có cổng nối thần kinh'],
      ['PRIME COAT',         'Giáp tự thích ứng'],
      ['VOID COAT',          'Không gì xuyên qua'],
    ] },
  { id:'arm',  name:'TAY',  sub:'găng · tay máy', sheet:'arm',
    max:{ atkPct:28 },
    list:[
      ['FIELD GLOVES',       'Găng da hở ngón'],
      ['REINFORCED GLOVES',  'Đốt ngón bọc đệm cứng'],
      ['TACTICAL GLOVE',     'Ngón máy, bám chắc hơn'],
      ['AUGMENT GLOVE',      'Cấy ghép mức cơ bản'],
      ['PROSTHETIC ARM (MK.I)',  'Thay hẳn cánh tay'],
      ['PROSTHETIC ARM (MK.II)', 'Khớp mượt hơn'],
      ['CYBER ARM (MK.III)', 'Bản độ cho chiến đấu'],
      ['CYBER ARM (MK.IV)',  'Hệ thống tích hợp'],
      ['ADVANCED CYBER ARM', 'Đỉnh của dòng dân dụng'],
      ['HIGH QUALITY PROSTHETIC ARM', 'Hàng Tháp, không bán ra ngoài'],
    ] },
  { id:'legs', name:'CHÂN', sub:'giày · ủng', sheet:'legs',
    max:{ spd:16, hpPct:10 },
    list:[
      ['STREET SNEAKERS',    'Giày vải đi bãi'],
      ['TACTICAL BOOTS',     'Bền và chắc'],
      ['URBAN BOOTS',        'Nhẹ chân hơn'],
      ['REINFORCED BOOTS',   'Mũi thép, chống dập'],
      ['EXO BOOTS',          'Có trợ lực bước đi'],
      ['PERFORMANCE BOOTS',  'Nhanh nhẹn hơn hẳn'],
      ['CYBER BOOTS',        'Hệ thống tích hợp'],
      ['ADVANCED CYBER BOOTS','Đồng bộ thần kinh'],
      ['ORION BOOTS',        'Đỉnh hiệu năng'],
      ['QUANTUM BOOTS',      'Bước một cái là tới'],
    ] },
  { id:'ac1',  name:'PHỤ KIỆN A', sub:'đeo trên người', sheet:'ac1',
    max:{ hpPct:16, crit:12 },
    list:[
      ['ID TAG',             'Thẻ bài — STILL HUMAN'],
      ['NECK SCARF',         'Khăn che bụi'],
      ['TACTICAL EARPIECE',  'Liên lạc rõ hơn'],
      ['TACTICAL GLASSES',   'Lọc chói'],
      ['AR VISOR',           'Lớp phủ chiến thuật'],
      ['RESPIRATOR MASK',    'Thở được trong khí độc'],
      ['TACTICAL BACKPACK',  'Mang thêm đồ'],
      ['CYBER CLOAK',        'Áo choàng nhận mặt'],
      ['GRAVITY HALO',       'Vòng lơ lửng quanh cổ'],
      ['SINGULARITY CROWN',  'Vương miện cộng hưởng'],
    ] },
  { id:'ac2',  name:'PHỤ KIỆN B', sub:'đồ nghề · hỗ trợ', sheet:'ac2',
    max:{ atkPct:16, spd:8 },
    list:[
      ['TACTICAL POUCH',     'Túi hông đựng đồ'],
      ['ACCESS CARD SET',    'Thẻ ra vào các khu'],
      ['CYBER NECKLACE',     'Giữ thần kinh ổn định'],
      ['SCOUT DRONE',        'Drone bay theo dò đường'],
      ['CYBER EARPIECE',     'Nghe được cả tần số máy'],
      ['TACTICAL GOGGLES',   'Phân tích bằng AR'],
      ['NEURAL WATCH',       'Theo dõi trạng thái cơ thể'],
      ['KATANA SHEATH',      'Rút kiếm nhanh hơn'],
      ['LEVITATING HALO',    'Vòng khuếch đại tập trung'],
      ['EXO WINGS',          'Cánh ngoài, cơ động tuyệt đối'],
    ] },
];
const cyberSlot   = id => CYBER_SLOTS.find(s=>s.id===id);
const cyberItem   = (slot, step) => { const s=cyberSlot(slot); return s && step>=1 && step<=CYBER.maxStep ? { name:s.list[step-1][0], sub:s.list[step-1][1], step, slot, rar:CYBER_STEP_RARITY[step-1] } : null; };
/* Ảnh: art/cyber/<ô><bậc 2 chữ số>.png, cắt từ 6 tấm contact sheet bằng scratch/cyber_sheet.py.
   Chưa có file thì giao diện vẽ icon SVG của ô — không phải ô trống. */
const cyberArt    = (slot, step) => ['art/cyber/'+slot+String(step).padStart(2,'0')+'.png'];

/* =====================================================================
   HỒ SƠ — PLAYER.parts (ví LK) + PLAYER.cyber = { [heroId]: { [slot]: bậc 0..10 } }
   Bậc 0 = ô trống. Thang chỉ đi lên, không có tháo/hoàn.
   ===================================================================== */
function cyberStore(){
  if(typeof PLAYER.parts !== 'number') PLAYER.parts = 0;
  if(!PLAYER.cyber || typeof PLAYER.cyber !== 'object') PLAYER.cyber = {};
  return PLAYER.cyber;
}
const cyberNoFit  = id => !!(ROSTER[id] && ROSTER[id].noChrome);
const cyberRow    = id => { const s=cyberStore(); return (s[id] = s[id] || {}); };
const cyberStep   = (id, slot) => Math.max(0, Math.min(CYBER.maxStep, cyberRow(id)[slot]|0));
/* Trần của một người ở một ô: RONIN dừng ở chỗ món còn là đồ mặc vào, người khác đi hết thang */
const cyberCap    = (id, slot) => cyberNoFit(id) ? (CYBER.bareCap[slot] || 0) : CYBER.maxStep;
const cyberAtCap  = (id, slot) => cyberStep(id, slot) >= cyberCap(id, slot);
const cyberFilled = id => CYBER_SLOTS.filter(s=>cyberStep(id, s.id) > 0).length;
/* Tổng số bậc đang có / tổng số bậc đi được — thước tiến trình của một nhân vật */
const cyberProgress = id => ({
  now: CYBER_SLOTS.reduce((a,s)=>a+cyberStep(id, s.id), 0),
  max: CYBER_SLOTS.reduce((a,s)=>a+cyberCap(id, s.id), 0),
});

/* Chỉ số của MỘT ô ở bậc đang có. RONIN đứng đúng bậc trần thì ×1.5 (THÉP TRẦN). */
function cyberSlotFx(heroId, slot){
  const s=cyberSlot(slot), step=cyberStep(heroId, slot);
  const out={};
  if(!s || !step) return out;
  const k = CYBER.curve[step-1] * (cyberNoFit(heroId) && cyberAtCap(heroId, slot) ? CYBER.bareBonus : 1);
  for(const st in s.max) out[st] = Math.round(s.max[st]*k*10)/10;
  return out;
}
/* Chỉ số của một BẬC BẤT KỲ ở một ô — dùng để in "bậc sau cho bao nhiêu" */
function cyberStepFx(heroId, slot, step){
  const s=cyberSlot(slot); const out={};
  if(!s || !step) return out;
  const k = CYBER.curve[step-1] * (cyberNoFit(heroId) && step>=cyberCap(heroId, slot) ? CYBER.bareBonus : 1);
  for(const st in s.max) out[st] = Math.round(s.max[st]*k*10)/10;
  return out;
}
/* Tổng cyberware của một nhân vật — unitStats() trong js/state.js gọi hàm này và CHỈ hàm này */
function cyberBonus(id){
  const t={ atkPct:0, hpPct:0, spd:0, crit:0 };
  if(typeof PLAYER==='undefined' || typeof ROSTER==='undefined' || !ROSTER[id]) return t;
  CYBER_SLOTS.forEach(s=>{ const fx=cyberSlotFx(id, s.id); for(const k in fx) t[k]+=fx[k]; });
  for(const k in t) t[k]=Math.round(t[k]*10)/10;
  return t;
}

/* =====================================================================
   NÂNG BẬC — hành động duy nhất của thang. Không có tháo, không có hoàn.
   ===================================================================== */
const canPay = p => PLAYER.parts >= p.lk && PLAYER.credits >= p.cr;
function cyberUp(heroId, slot){
  if(!ROSTER[heroId] || !cyberSlot(slot)) return 'no';
  const step=cyberStep(heroId, slot);
  if(step >= cyberCap(heroId, slot)) return cyberNoFit(heroId) ? 'bare' : 'max';
  const cost=cyberCost(step+1);
  if(!canPay(cost)) return 'poor';
  PLAYER.parts -= cost.lk; PLAYER.credits -= cost.cr;
  cyberRow(heroId)[slot] = step+1;
  savePlayer(); return 'ok';
}
/* Tổng LK + CR còn phải bỏ ra để một người đi hết thang của mình (in ở màn hình) */
function cyberRemaining(heroId){
  let lk=0, cr=0;
  CYBER_SLOTS.forEach(s=>{
    for(let k=cyberStep(heroId, s.id)+1; k<=cyberCap(heroId, s.id); k++){ const c=cyberCost(k); lk+=c.lk; cr+=c.cr; }
  });
  return { lk, cr };
}

/* =====================================================================
   PHÂN TÁCH BẢN DƯ — lời hứa treo từ đợt 1 ("trùng không hoàn SH nữa, giữ lại để phân tách").
   CHỈ đụng PLAYER.extra; PLAYER.owned không bao giờ bị chạm, nên không mất nhân vật vì lỡ tay.
   ===================================================================== */
const scrapLk = id => CYBER.scrap[(ROSTER[id]||{}).tier] || 0;
const scrapList = () => Object.keys(PLAYER.extra||{})
  .filter(id => ROSTER[id] && PLAYER.extra[id] > 0)
  .map(id => ({ id, n:PLAYER.extra[id], each:scrapLk(id), lk:PLAYER.extra[id]*scrapLk(id) }))
  .sort((a,b)=> b.each-a.each || b.n-a.n);
const scrapTotal = () => scrapList().reduce((s,x)=>({ n:s.n+x.n, lk:s.lk+x.lk }), { n:0, lk:0 });
function scrapOne(id, n){
  const have=(PLAYER.extra||{})[id]||0; const k=Math.max(0, Math.min(have, n==null?have:n));
  if(!k) return null;
  PLAYER.extra[id]=have-k; if(!PLAYER.extra[id]) delete PLAYER.extra[id];
  const lk=k*scrapLk(id); PLAYER.parts+=lk; savePlayer();
  return { n:k, lk };
}
function scrapAll(){
  const t=scrapTotal(); if(!t.n) return null;
  scrapList().forEach(x=>scrapOne(x.id));
  return t;
}

/* Nạp hồ sơ: dựng ô mới, kẹp bậc về trần, và chuyển hồ sơ của bản 5-ô-3-hạng (sáng 11/09) sang thang mới. */
(function cyberBoot(){
  if(typeof PLAYER==='undefined') return;
  const s=cyberStore(); let ch=false;
  for(const hero in s){
    if(!ROSTER[hero]){ delete s[hero]; ch=true; continue; }
    for(const slot in s[hero]){
      const v=s[hero][slot];
      /* Bản cũ lưu {id, lv}; thang mới lưu một con số. Quy đổi thô: hạng B/A/S → bậc 2/5/8, cộng (lv−1). */
      if(v && typeof v==='object'){
        const t={ b:2, a:5, s:8 }[String(v.id||'').slice(-1)] || ({neu1:2,opt1:2,arm1:2,cor1:2,leg1:2})[v.id] || 2;
        s[hero][slot] = Math.min(CYBER.maxStep, t + Math.max(0,(v.lv|0)-1)); ch=true;
      }
      if(!cyberSlot(slot)){ delete s[hero][slot]; ch=true; continue; }
      const clamp=Math.max(0, Math.min(cyberCap(hero, slot), s[hero][slot]|0));
      if(clamp !== s[hero][slot]){ s[hero][slot]=clamp; ch=true; }
    }
  }
  if(ch) savePlayer();
})();
