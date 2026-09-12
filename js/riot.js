'use strict';
/* =====================================================================
   DẸP LOẠN — đợt 2 "chiếm bãi". Số liệu + logic thuần; màn hình nằm ở js/riotui.js.
   Đặc tả đầy đủ (vì sao, quyết định, cân bằng, prompt art): docs/dep-loan.md.

   Nạp SAU js/state.js (cần power/unitStats/savePlayer) và TRƯỚC js/app.js.
   File này KHÔNG đụng tới js/battle.js: trận chiếm bãi dùng một object hình dạng SECTOR (yardSector)
   y như thang tầng cũ, còn phần thưởng do js/riotui.js bọc quanh winReward().

   Vòng lặp: chiếm bãi → đóng quân → bãi đẻ kiện hàng theo chu kỳ → nhận kiện · giữ phản kích · nâng bãi.

   Số liệu: `mult` và `m50` của từng bãi là SỐ ĐO (xem chú thích RIOT_YARDS), đừng sửa tay.
   Còn lại ★ FAKE — dò bằng:
     node scratch/sim.js 400 yuki,ash,kai --yard [--lv 20]   tỉ lệ thắng + nhãn từng bãi
     node scratch/riot_tune.js m50|plan 200                  đo lại m50 / mult sau khi sửa `plan`
     node scratch/riot_econ.js                               thu nhập/giờ, hiệu suất, hồi vốn nâng bãi
   ===================================================================== */

const RIOT_ECON = {
  cycleMin:  45,        // một chu kỳ = một kiện hàng
  capBase:   8,         // trần kiện ở bậc 1 (8 × 45' = 6 giờ)
  capPerLv:  2,         // mỗi bậc bãi thêm 2 kiện vào trần
  raidEvery: 6,         // 6 chu kỳ (4h30) = một đợt phản kích
  raidStep:  .10,       // mỗi đợt giữ được, đợt sau mạnh thêm 10%
  raidCap:   2.0,       // trần: đồn trú ≥ 2× ngưỡng là KHÔNG BAO GIỜ mất bãi (lời hứa với người chơi)
  raidLoot:  .5,        // giữ được một đợt = thưởng thêm nửa kiện
  favBonus:  .15,       // quân đúng phe của bãi: +15% CR (không cộng SH)
  fillCap:   1.5,       // hệ số quân trần — đồn trú vượt ngưỡng vẫn có lợi tới 1.5×
  lvYield:   [1, 1.35, 1.8, 2.35, 3],
  lvCostK:   [40, 100, 220, 440],     // giá nâng bậc = CR/kiện gốc × hệ số này
  maxLv:     5,
  retakeMult:.85,       // trận GIÀNH LẠI nhẹ hơn trận chiếm: bọn chiếm đóng còn dính thương
  refPower:  4208,      // power() của đội mở đầu yuki+ash+kai cấp 1 — mốc neo của "sức mạnh ổ", xem m50 bên dưới
  feedMax:   12,        // số dòng báo cáo vắng mặt giữ lại
};
/* Cày thử không phải chờ 45 phút: mở game bằng ...index.html?riotfast → một chu kỳ 15 giây. */
if(typeof location!=='undefined' && /[?&]riotfast\b/.test(location.search)) RIOT_ECON.cycleMin = .25;
const riotCycleMs = () => Math.round(RIOT_ECON.cycleMin*60*1000);
/* Cờ kiểm thử trên URL (docs/dep-loan.md Q15) — chỉ sống trong phiên, KHÔNG ghi gì vào hồ sơ:
     ?riot       mở game là vào thẳng bản đồ Khu Đáy (js/riotui.js gọi go('riotmap') thay vì màn tiêu đề),
                 và riotUnlocked() (data.js) coi như đã xong 07-A dù hồ sơ chưa có.
     ?riot=all   như trên, thêm: bỏ điều kiện tầng HỐ LOẠN → cả 9 bãi mở (yardOpen bên dưới).
   Chạy localhost và vào thẳng: `python scratch/riot_serve.py` (launch "static-riot") — nó chuyển `/` sang
   `index.html?riot&riotfast&dev`. Ở sim.js không có `location` nên cả hai cờ tắt. */
const RIOT_DEV = (()=>{
  const q = typeof location!=='undefined' ? new URLSearchParams(location.search) : null;
  const v = q && q.has('riot') ? (q.get('riot')||'') : null;
  return { start: v!=null, allYards: v==='all' };
})();

/* =====================================================================
   9 CÁI BÃI — ba vòng từ rìa bãi rác vào chân Tháp.
   x/y = % của ảnh art/map/map_d07.jpg — ĐO TRÊN ẢNH THẬT (12/09), mỗi nút rơi đúng cái mốc của nó:
   tháp nước số 9, chân thang máy, nghĩa địa thép, mái nhà thờ, chợ, sân lò đúc, hàng rào, cống ba ngã,
   bãi rơi, miệng hố. Hai luật khi sửa: (1) hai nút liền nhau phải cách nhau ≥ 8% theo trục dọc, nếu không
   hai thẻ nhãn (cao ~45 px trên ảnh cao ~628 px) đè lên nhau — thẻ mọc vào giữa màn nên x so le không cứu
   được; (2) sửa xong chạy lại `?riot=all` ở 375×812 xem chấm có còn nằm trên vật thể không.
   SVG dự phòng trong riotui.js (chỉ hiện khi thiếu ảnh) vẽ theo đúng bộ toạ độ này.
   need  = tầng DẸP LOẠN phải thắng trước mới mở (0 = mở ngay khi mở chế độ)
   hold  = ngưỡng giữ bãi: tổng power() của quân đồn trú để đạt 100% sản lượng và chặn đợt phản kích đầu
   cr/sh = thu nhập GỐC mỗi kiện, trước mọi hệ số
   plan  = wave thiết kế tay, chỉ dùng 21 kẻ địch chương 1 (đã có đủ art + sprite, không cần ảnh mới)
   mult  = hệ số ATK/HP kẻ địch — ĐO chứ không đoán, xem `node scratch/riot_tune.js plan`
   m50   = mult làm đội mở đầu cấp 1 thắng đúng 55% trận này (`node scratch/riot_tune.js m50`).
           Đây là thước đo độ khó THẬT của đội hình wave và là mốc để tính "sức mạnh ổ" hiện ở giao diện.
           Đội hình wave nặng hơn mult rất nhiều: SÂN LÒ ĐÚC m50 0.89 còn CỐNG BA NGÃ m50 2.23 — cùng một
           con số mult mà hai bãi chênh nhau hai lần rưỡi, vì lò đúc có thợ hàn vá máu + lò nung dựng lá chắn.
           Sửa `plan` thì PHẢI đo lại m50, nếu không con số giao diện hứa với người chơi sẽ sai.
   ===================================================================== */
const RIOT_YARDS = [
  { id:'drop',    name:'BÃI RƠI CŨ',      sub:'VÀNH NGOÀI', ring:1, x:72, y:83, fav:'rust',   slots:1, need:0,  hold:800,  cr:20,  sh:0, mult:1.88, m50:2.14, bg:'07a',
    desc:'Chỗ Yuki rơi xuống. Băng Scav quay lại vì vẫn còn thứ moi được dưới lớp container.',
    plan:[['scav','scav','gutterrat'],['scav','straydog','chopshop']] },
  { id:'drain',   name:'CỐNG BA NGÃ',     sub:'VÀNH NGOÀI', ring:1, x:33, y:75, fav:'rust',   slots:1, need:0,  hold:1000, cr:25,  sh:0, mult:1.97, m50:2.23, bg:'07d',
    desc:'Ba miệng cống đổ vào một hố. Ai giữ được chỗ này thì giữ được đường rút của cả vành ngoài.',
    plan:[['gutterrat','gutterrat','straydog'],['gutterrat','pipefitter','hollow']] },
  { id:'fence',   name:'HÀNG RÀO GÃY',    sub:'VÀNH NGOÀI', ring:1, x:45, y:63, fav:'chrome', slots:2, need:3,  hold:2200, cr:35,  sh:0, mult:1.33, m50:1.45, bg:'07c',
    desc:'Vành đai Canticle đứt một quãng. Đèn cảnh báo vẫn chớp, lính vẫn tới theo ca.',
    plan:[['drone','drone','enforcer'],['enforcer','drone','tinman'],['enforcer','bulwark','drone']] },

  { id:'smelter', name:'SÂN LÒ ĐÚC',      sub:'LÒNG KHU',   ring:2, x:25, y:55, fav:'rust',   slots:2, need:5,  hold:2800, cr:45,  sh:1, mult:0.86, m50:0.89, bg:'07b', boss:'foreman',
    desc:'Lò nguội nhưng sân vẫn ấm. Người của Foreman canh từng xe xỉ.',
    plan:[['welder','slagger','slagger'],['kiln','welder','slagger'],['kiln','drillbit','foreman']] },
  { id:'market',  name:'CHỢ THÉP',        sub:'LÒNG KHU',   ring:2, x:68, y:47, fav:'rust',   slots:2, need:7,  hold:3200, cr:55,  sh:1, mult:1.38, m50:1.38, bg:'07a', boss:'rigger',
    desc:'Mái tôn chắp vá, quầy bán tay chân máy đã tháo. Rigger ăn phần trăm từng quầy.',
    plan:[['scav','chopshop','hollow'],['chopshop','glassjaw','scav'],['glassjaw','drillbit','rigger']] },
  { id:'church',  name:'MÁI NHÀ THỜ',     sub:'LÒNG KHU',   ring:2, x:27, y:39, fav:'rust',   slots:2, need:9,  hold:3600, cr:65,  sh:2, mult:1.17, m50:1.13, bg:'07d', boss:'motherrust',
    desc:'Cây thánh giá hàn từ ống nước nhô lên khỏi mặt cống. Giáo phái không bỏ chỗ này.',
    plan:[['tinman','hollow','pipefitter'],['hollow','tinman','bulwark'],['bulwark','glassjaw','motherrust']] },

  { id:'lift',    name:'CHÂN THANG MÁY',  sub:'TRUNG TÂM',  ring:3, x:63, y:23, fav:'chrome', slots:3, need:12, hold:5000, cr:95,  sh:2, mult:1.59, m50:0.94, bg:'07e', boss:'archon',
    desc:'Bệ hàng to bằng một con phố, cáp biến mất trong sương. Đường lên Tháp nằm ngay trên đầu.',
    plan:[['drone','enforcer','enforcer'],['chromehound','drone','enforcer'],['bulwark','chromehound','enforcer'],['chromehound','drillbit','archon']] },
  { id:'tower',   name:'THÁP NƯỚC SỐ 9',  sub:'TRUNG TÂM',  ring:3, x:29, y:15, fav:'rust',   slots:3, need:15, hold:5600, cr:110, sh:3, mult:2.16, m50:1.22, bg:'07a', boss:'rigger',
    desc:'Bồn nước rỉ sơn tay số 9. Ai ngồi trên đó thì nhìn được cả nửa quận.',
    plan:[['scav','chopshop','glassjaw'],['glassjaw','drillbit','chopshop'],['drillbit','bulwark','glassjaw'],['glassjaw','chromehound','rigger']] },
  { id:'grave',   name:'NGHĨA ĐỊA THÉP',  sub:'TRUNG TÂM',  ring:3, x:80, y:31, fav:'rust',   slots:3, need:18, hold:6400, cr:130, sh:3, mult:1.77, m50:0.99,  bg:'07d', boss:'motherrust',
    desc:'Hơn hai nghìn tấm thép cắm đứng, mỗi tấm một cái tên. Không ai dám tháo một tấm nào.',
    plan:[['tinman','hollow','slagger'],['kiln','glassjaw','bulwark'],['drillbit','bulwark','chromehound'],['chromehound','glassjaw','motherrust']] },
];
/* HỐ LOẠN không phải bãi (bấm vào là sang màn thang tầng cũ) nhưng vẫn là một cái nút trên bản đồ:
   để toạ độ ở đây cho nút, bản vẽ SVG dự phòng và tài liệu cùng đọc một chỗ. Miệng hố đỏ ở đáy map_d07.jpg. */
const RIOT_PIT = { x:46, y:91 };
const yardById = id => RIOT_YARDS.find(y=>y.id===id);
/* Ảnh minh hoạ: ảnh riêng của bãi nếu có (art/riot/), không thì dùng lại nền sector chương 1 */
const yardBg = y => ['art/riot/yard_'+y.id+'.jpg', 'art/bg/bg_'+y.bg+'.jpg', 'art/bg/bg_battle.jpg'];
const RIOT_MAP_IMG = ['art/map/map_d07.jpg','art/map/map_d07.png'];

/* =====================================================================
   HỒ SƠ — PLAYER.riot mở rộng thêm yards / week / feed. Hồ sơ cũ (chỉ có tier/best) tự lên đủ.
   Một bãi: { state, gar[], lv, t0, crates, cr, sh, rc, held }
     state 'own' = đang giữ · 'contested' = bị chiếm lại, ngừng đẻ, kiện đóng băng
     t0    = mốc tính chu kỳ · rc = số chu kỳ kể từ đợt phản kích gần nhất · held = số đợt đã giữ liên tiếp
   ===================================================================== */
function riotStore(){
  const r = (PLAYER.riot && typeof PLAYER.riot==='object') ? PLAYER.riot : (PLAYER.riot = { tier:1, best:0 });
  if(!r.yards || typeof r.yards!=='object') r.yards = {};
  if(!Array.isArray(r.feed)) r.feed = [];
  if(!r.week || typeof r.week!=='object') r.week = { id:riotWeekId(), prog:{}, claimed:[] };
  return r;
}
const yst = id => riotStore().yards[id] || null;
const yardOwned = id => { const s=yst(id); return !!s && s.state==='own'; };
const yardHeld  = id => !!yst(id);                                   // đang giữ HOẶC đang bị chiếm (đã từng chiếm được)
const yardOpen  = y => riotUnlocked() && (RIOT_DEV.allYards || PLAYER.riot.best >= (y.need||0));   // ?riot=all: mở hết để kiểm
const yardLv    = y => { const s=yst(y.id); return (s && s.lv) || 1; };
const yardCap   = y => RIOT_ECON.capBase + RIOT_ECON.capPerLv*(yardLv(y)-1);

/* =====================================================================
   SỨC MẠNH Ổ LOẠN — con số hiện cạnh sức mạnh đội, nên nó PHẢI nói đúng sự thật.

   Bản đầu cộng chỉ số kẻ địch bằng chính công thức power() (ATK×4 + HP×0.6 + SPD×2 + CRIT×6) rồi lấy wave
   nặng nhất. Sim bác ngay: HÀNG RÀO GÃY tỉ lệ 0.85 thắng 100%, còn CHỢ THÉP tỉ lệ 0.64 thắng 94% trong khi
   SÂN LÒ ĐÚC tỉ lệ 0.55 thắng 0%. Cộng chỉ số không thấy được thợ hàn vá máu, lò nung dựng lá chắn hay
   trùm gây choáng — tức là nó nói dối người chơi.

   Bản này neo vào SỐ ĐO: `m50` (mult làm đội mở đầu cấp 1 thắng 55%) là độ khó thật của đội hình wave, đo
   bằng `node scratch/riot_tune.js m50`. Sức mạnh ổ suy ra từ đó:

       sức mạnh ổ = power(đội mốc) × mult / m50

   Nghĩa của tỉ lệ vì thế rõ ràng: **đội bạn / ổ loạn = 1.0 ⇒ thắng khoảng 55%**. Sửa `plan` thì đo lại m50.
   ===================================================================== */
const _foe = id => ENEMY_POOL.find(e=>e.id===id);
const yardMult  = (y, retake) => Math.round(y.mult*(retake?RIOT_ECON.retakeMult:1)*100)/100;
const yardPower = (y, retake) => Math.round(RIOT_ECON.refPower * yardMult(y, retake) / (y.m50||1));
/* Nhãn đọc được thay cho một con số trần trụi. Ngưỡng đo bằng `node scratch/sim.js 200 ... --yard`
   (bảng đối chiếu ở docs/dep-loan.md §D1). Băng cố ý rộng và hơi BI QUAN ở đầu trên: power() cộng cả SPD và
   CRIT, mà hai thứ đó không tăng theo cấp nâng cấp, nên đội đã nâng cấp 20 mạnh hơn con số của nó khoảng 11%.
   Thà nhãn nói nặng hơn thực tế còn hơn hứa hão. */
function powerVerdict(mine, theirs){
  const r = theirs>0 ? mine/theirs : 9;
  if(r>=1.08) return { key:'over',  label:'ÁP ĐẢO',    hint:'Thắng gần như chắc chắn.' };
  if(r>=0.98) return { key:'even',  label:'NGANG SỨC',  hint:'Thắng được, nhưng sẽ có người gục.' };
  if(r>=0.85) return { key:'risk',  label:'NGUY HIỂM',  hint:'Năm ăn năm thua. Nâng cấp rồi hãy vào.' };
  return                { key:'dead',  label:'TỰ SÁT',    hint:'Chưa tới lúc. Đi cày thêm.' };
}

/* =====================================================================
   ĐỒN TRÚ
   ===================================================================== */
function garrisonOf(id){ const ys=riotStore().yards; for(const k in ys){ const s=ys[k]; if(s && (s.gar||[]).includes(id)) return k; } return null; }
const garrisoned = id => garrisonOf(id)!=null;
const garList    = y => { const s=yst(y.id); return (s && s.gar) || []; };
const garPower   = y => garList(y).reduce((a,id)=>a + (typeof power==='function'?power(id):0), 0);
/* Bất biến: quân đồn trú ∩ đội hình = rỗng. normalizeTeam() (data.js) có thể tự bù người vào slot trống
   mà không biết gì về đồn trú, nên quét lại một lần mỗi lần kết sổ — đội hình thắng, quân bị rút khỏi bãi. */
function syncGarrison(){
  const ys=riotStore().yards; let changed=false;
  for(const k in ys){ const s=ys[k]; if(!s||!s.gar) continue;
    const keep=s.gar.filter(id => ROSTER[id] && owns(id) && !(TEAM||[]).includes(id));
    if(keep.length!==s.gar.length){ s.gar=keep; changed=true; } }
  return changed;
}
/* Người còn rảnh để đóng quân: đã sở hữu, không ở bãi nào, không trong đội hình.
   Người chơi mới sở hữu đúng 3 người và cả 3 đều trong đội → danh sách này rỗng, giao diện phải nói thẳng
   ra chứ không để họ bấm vào một ô trống mãi không được gì. */
const freeUnits = () => PLAYER.owned.filter(id => ROSTER[id] && !garrisoned(id) && !(TEAM||[]).includes(id));
/* Vì sao không đóng quân được — trả về chuỗi lý do, null = đóng được */
function garrisonBlock(id, yid){
  if(!ROSTER[id] || !owns(id))     return 'CHƯA SỞ HỮU';
  if((TEAM||[]).includes(id))      return 'ĐANG TRONG ĐỘI';
  const at=garrisonOf(id);
  if(at && at!==yid)               return 'ĐỒN TRÚ · '+yardById(at).name;
  return null;
}
function garrisonAdd(yid, id){
  const y=yardById(yid), s=yst(yid);
  if(!y || !s || s.state!=='own' || garrisonBlock(id,yid)) return false;
  if(s.gar.length>=y.slots) return false;
  settleYards();                      // kết sổ ở hệ số CŨ trước khi đổi quân
  s.gar.push(id); savePlayer(); return true;
}
function garrisonRemove(yid, id){
  const s=yst(yid); if(!s) return false;
  const i=s.gar.indexOf(id); if(i<0) return false;
  settleYards();                      // rút quân không phải là cách ăn kiện ở hệ số cao rồi bỏ đi
  s.gar.splice(i,1); savePlayer(); return true;
}

/* =====================================================================
   THU NHẬP — công thức hiện nguyên ở giao diện (docs/dep-loan.md §D3)
   ===================================================================== */
function yardYield(y){
  const s=yst(y.id);
  const gar=(s&&s.gar)||[], n=gar.length, gp=garPower(y), lv=yardLv(y);
  const fill = n ? Math.min(RIOT_ECON.fillCap, gp/y.hold) : 0;
  const fav  = n ? 1 + RIOT_ECON.favBonus*(gar.filter(id=>ROSTER[id]&&ROSTER[id].faction===y.fav).length/n) : 1;
  const lvm  = RIOT_ECON.lvYield[lv-1];
  return { cr:Math.round(y.cr*fill*fav*lvm), sh:Math.round(y.sh*fill*lvm), fill, fav, lvm, gp, n, lv };
}
const raidPower = y => Math.round(y.hold * Math.min(RIOT_ECON.raidCap, 1 + RIOT_ECON.raidStep*(((yst(y.id)||{}).held)||0)));
/* Bãi đang giữ mà TRỐNG QUÂN: đồng hồ đứng — không đẻ kiện, không phản kích (§D3: hệ số quân = 0).
   Bản 11/09 quên chỗ này: bãi trống vẫn đẻ kiện 0 CR, vẫn tính vào hợp đồng tuần "nhận 40 kiện", và sau 6 chu kỳ
   thì thua phản kích với 0 quân — người chơi mới (3 người đều trong đội) chiếm được bãi rồi mất luôn mà không hiểu vì sao. */
const yardIdle = y => { const s=yst(y.id); return !!s && s.state==='own' && !(s.gar||[]).length; };
/* Mili-giây tới kiện kế. null = không đếm: đã đầy trần (thời gian ngừng chạy — đây là cái đồng hồ kéo người
   chơi về) hoặc chưa có quân (giao diện phân biệt hai trường hợp bằng yardIdle) */
function yardNextMs(y, now){
  const s=yst(y.id); if(!s || s.state!=='own') return null;
  if(yardIdle(y) || s.crates >= yardCap(y)) return null;
  const ms=riotCycleMs(); const d=(now||Date.now()) - s.t0;
  return ms - ((d % ms) + ms) % ms;
}

/* =====================================================================
   KẾT SỔ — chạy khi mở màn DẸP LOẠN, khi nhận kiện, khi đổi quân, và mỗi 30 giây khi màn đang mở.
   Đây là chỗ duy nhất cộng kiện và giải quyết phản kích, kể cả lúc người chơi đi vắng.
   ===================================================================== */
function settleYard(y, now){
  const s=yst(y.id); if(!s || s.state!=='own') return 0;
  if(s.t0 > now + 60000) s.t0 = now;                       // đồng hồ máy bị vặn lùi → kéo về hiện tại
  if(yardIdle(y)){ s.t0 = now; return 0; }                 // trống quân: đồng hồ đứng, đóng quân vào mới bắt đầu đếm
  const ms=riotCycleMs(), cap=yardCap(y), yl=yardYield(y);
  const n = Math.floor((now - s.t0)/ms);
  if(n <= 0) return 0;
  const gain = Math.min(n, Math.max(0, cap - s.crates));
  let fell=false;
  for(let i=0;i<gain;i++){
    s.crates++; s.cr += yl.cr; s.sh += yl.sh; s.rc = (s.rc||0)+1;
    if(s.rc >= RIOT_ECON.raidEvery){
      s.rc = 0;
      if(yl.gp >= raidPower(y)){
        s.held=(s.held||0)+1;
        const bcr=Math.round(yl.cr*RIOT_ECON.raidLoot), bsh=Math.round(yl.sh*RIOT_ECON.raidLoot);
        s.cr+=bcr; s.sh+=bsh; riotWeekProgress('hold');
        riotFeed('hold', `${y.name} giữ được một đợt phản kích · +${bcr} CR`);
      } else {
        s.state='contested'; s.held=0; s.t0=now; fell=true;
        riotFeed('lost', `${y.name} thất thủ — kiện hàng bị đóng băng, phải giành lại`);
        break;
      }
    }
  }
  if(!fell){
    if(s.crates >= cap){ if(gain>0) riotFeed('full', `${y.name} đầy trần ${cap} kiện — không đẻ thêm nữa`); s.t0 = now; }
    else s.t0 += gain*ms;
  }
  return gain;
}
function settleYards(now){
  now = now || Date.now();
  let changed = syncGarrison();
  RIOT_YARDS.forEach(y=>{ if(settleYard(y, now)>0) changed=true; });
  if(changed) savePlayer();
  return changed;
}

/* =====================================================================
   HÀNH ĐỘNG
   ===================================================================== */
function claimYard(yid){
  settleYards();
  const y=yardById(yid), s=yst(yid);
  if(!y || !s || s.state!=='own' || !s.crates) return null;
  const got={ n:s.crates, cr:s.cr, sh:s.sh };
  PLAYER.credits += s.cr; PLAYER.shards += s.sh;
  s.crates=0; s.cr=0; s.sh=0; s.t0=Date.now();
  riotWeekProgress('crate', got.n);
  if(typeof dailyProgress==='function') dailyProgress('riotcrate', got.n);
  savePlayer(); return got;
}
function claimAllYards(){
  settleYards();
  const tot={ n:0, cr:0, sh:0, yards:0 };
  RIOT_YARDS.forEach(y=>{ const g=claimYard(y.id); if(g){ tot.n+=g.n; tot.cr+=g.cr; tot.sh+=g.sh; tot.yards++; } });
  return tot.n ? tot : null;
}
/* Thắng trận chiếm/giành lại → gọi từ js/riotui.js. Giành lại giữ nguyên quân, bậc và kiện đang đóng băng. */
function captureYard(yid){
  const y=yardById(yid), r=riotStore(), prev=r.yards[yid], now=Date.now();
  const retake = !!(prev && prev.state==='contested');
  if(retake){ prev.state='own'; prev.t0=now; prev.rc=0; prev.held=0; }
  else r.yards[yid] = { state:'own', gar:[], lv:1, t0:now, crates:0, cr:0, sh:0, rc:0, held:0 };
  riotWeekProgress('win');
  riotFeed(retake?'retake':'take', `${retake?'Giành lại':'Chiếm được'} ${y.name}`);
  savePlayer();
  return { retake, reward:yardTakeReward(y, retake) };
}
/* Thưởng một lần cho trận chiếm bãi (khác thu nhập theo giờ) — giành lại ăn nửa */
function yardTakeReward(y, retake){
  const k = retake ? .5 : 1;
  return { credits: Math.round(y.cr*10*k), shards: Math.round(Math.max(2, y.sh*4)*k) };
}
const yardUpCost = y => { const lv=yardLv(y); return lv>=RIOT_ECON.maxLv ? 0 : Math.round(y.cr*RIOT_ECON.lvCostK[lv-1]); };
function upgradeYard(yid){
  const y=yardById(yid), s=yst(yid); if(!y||!s) return 'no';
  if(yardLv(y) >= RIOT_ECON.maxLv) return 'max';
  const c=yardUpCost(y); if(PLAYER.credits < c) return 'poor';
  settleYards();
  PLAYER.credits -= c; s.lv = yardLv(y)+1; savePlayer(); return 'ok';
}

/* =====================================================================
   HỢP ĐỒNG TUẦN — reset thứ Hai 00:00 giờ máy
   ===================================================================== */
const RIOT_WEEK = [
  { id:'crate', label:'Nhận kiện hàng ở Khu Đáy',                goal:40, reward:120 },
  { id:'hold',  label:'Giữ được đợt phản kích',                  goal:10, reward:150 },
  { id:'win',   label:'Thắng trận ở Khu Đáy (bãi hoặc tầng)',    goal:8,  reward:100 },
];
function riotWeekId(d){
  d = d || new Date();
  const t = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  t.setDate(t.getDate() - ((t.getDay()+6)%7));                    // lùi về thứ Hai
  return `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,'0')}-${String(t.getDate()).padStart(2,'0')}`;
}
function riotWeekTick(){
  const r=riotStore();
  if(r.week.id !== riotWeekId()){ r.week={ id:riotWeekId(), prog:{}, claimed:[] }; savePlayer(); }
  return r.week;
}
function riotWeekProgress(id, n=1){
  const w=riotWeekTick(), t=RIOT_WEEK.find(x=>x.id===id); if(!t) return;
  w.prog[id] = Math.min(t.goal, (w.prog[id]||0)+n);
}
const riotWeekClaimable = () => { const w=riotWeekTick(); return RIOT_WEEK.filter(t=>(w.prog[t.id]||0)>=t.goal && !w.claimed.includes(t.id)); };
function riotWeekClaim(id){
  const w=riotWeekTick(), t=RIOT_WEEK.find(x=>x.id===id);
  if(!t || (w.prog[id]||0)<t.goal || w.claimed.includes(id)) return false;
  w.claimed.push(id); PLAYER.shards += t.reward; savePlayer(); return true;
}

/* ---- Báo cáo vắng mặt: những gì xảy ra lúc người chơi không có mặt ---- */
function riotFeed(kind, text){
  const r=riotStore();
  r.feed.unshift({ t:Date.now(), kind, text, seen:false });
  if(r.feed.length > RIOT_ECON.feedMax) r.feed.length = RIOT_ECON.feedMax;
}
const riotFeedUnseen = () => riotStore().feed.filter(f=>!f.seen).length;
function riotFeedSeen(){ const r=riotStore(); let ch=false; r.feed.forEach(f=>{ if(!f.seen){ f.seen=true; ch=true; } }); if(ch) savePlayer(); }

/* =====================================================================
   TỔNG QUAN — số hiện ở dải đầu màn bản đồ và ở nút DẸP LOẠN của HOME
   ===================================================================== */
function riotSummary(now){
  now = now || Date.now();
  const o = { own:0, contested:0, open:0, crates:0, cr:0, sh:0, crPerH:0, shPerH:0, next:null, full:0, idle:0 };
  const perCycle = 60/RIOT_ECON.cycleMin;
  RIOT_YARDS.forEach(y=>{
    if(yardOpen(y)) o.open++;
    const s=yst(y.id); if(!s) return;
    if(s.state==='contested'){ o.contested++; return; }
    o.own++; o.crates+=s.crates; o.cr+=s.cr; o.sh+=s.sh;
    if(yardIdle(y)){ o.idle++; return; }                    // trống quân: không đếm, không tính vào thu nhập/giờ
    const yl=yardYield(y); o.crPerH += yl.cr*perCycle; o.shPerH += yl.sh*perCycle;
    const nx=yardNextMs(y, now);
    if(nx==null) o.full++; else if(o.next==null || nx<o.next) o.next=nx;
  });
  o.crPerH=Math.round(o.crPerH); o.shPerH=Math.round(o.shPerH*10)/10;
  return o;
}
/* Có việc phải làm ở Khu Đáy không (chấm đỏ ở HOME) */
const riotHasWork = () => { const o=riotSummary(); return o.crates>0 || o.contested>0 || riotWeekClaimable().length>0; };

/* =====================================================================
   TRẬN CHIẾM BÃI — object HÌNH DẠNG SECTOR, y như riotSector(n) của thang tầng.
   mode:'yard' để js/riotui.js biết cộng thưởng theo bãi thay vì theo tầng.
   ===================================================================== */
function yardSector(y, retake){
  return { id:'BÃI-'+y.id.toUpperCase().slice(0,5), mode:'yard', yard:y.id, retake:!!retake,
           name:y.name, tag:'KHU ĐÁY · '+y.sub+(retake?' · GIÀNH LẠI':''),
           waves:y.plan.length, mult:yardMult(y, retake), rec:Math.round(y.hold/6),
           reward:yardTakeReward(y, retake), boss:y.boss||null, plan:y.plan,
           bg:yardBg(y), bgZoom:1.3, bgHorizon:.52, bgDim:.1 };
}

/* Nạp hồ sơ: dựng đủ ô mới cho hồ sơ cũ, kết sổ luôn phần thời gian đã trôi qua lúc đóng game. */
(function riotBoot(){
  if(typeof PLAYER==='undefined') return;
  riotStore(); riotWeekTick(); settleYards();
})();
