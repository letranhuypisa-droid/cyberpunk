'use strict';
/* econ_sh.js — ĐẾM SH VÀO VÍ MỖI TUẦN, theo từng nguồn.
   Chạy: node scratch/econ_sh.js [số ngày chơi trong tuần]   (mặc định 7)

   Vì sao cần: mọi đợt thêm nguồn SH mới (nhiệm vụ ngày → chuỗi ngày → quà VỀ RỒI → hợp đồng tháng) đều
   được cân riêng lẻ, không ai cộng lại. Mà giá trị của SH chỉ có nghĩa khi so với GIÁ QUAY: thêm 1.000 SH
   một tuần là thêm gần bốn lượt ×10, và pity 50 lượt mất nghĩa nếu tuần nào cũng quay đủ để chạm nó.

   Script đọc thẳng js/data.js, js/state.js, js/riot.js nên số ở đây không bao giờ lệch với số trong game —
   sửa DAILY_TASKS hay STREAK rồi chạy lại là ra ngay ảnh hưởng.

   KHÔNG tính: SH thưởng lần đầu clear màn (một lần duy nhất, không lặp lại hằng tuần) và SH của hợp đồng
   tuần DẸP LOẠN khi chưa mở khoá — cả hai đều được in riêng để tự cộng nếu cần. */

const fs=require('fs'), path=require('path'), vm=require('vm');
const ctx={ console, Math, JSON, Object, Array, Set, Map, Number, String, Date, window:{},
            localStorage:undefined, document:undefined, matchMedia:undefined, location:undefined };
ctx.window=ctx; vm.createContext(ctx);
const load = f => vm.runInContext(fs.readFileSync(path.join(__dirname,'..','js',f),'utf8'), ctx, {filename:f});
load('data.js'); load('state.js'); load('riot.js');
const { DAILY_TASKS, STREAK, COMEBACK, PLAY, RIOT, RIOT_WEEK, BANNER, SECTORS, ASCEND, PASS, WEEK_TASKS, TODAY_BONUS, TODAY_SWEEP_BONUS } =
  vm.runInContext('({DAILY_TASKS,STREAK,COMEBACK,PLAY,RIOT,RIOT_WEEK,BANNER,SECTORS,ASCEND,PASS,WEEK_TASKS,TODAY_BONUS,TODAY_SWEEP_BONUS})', ctx);

const DAYS = Math.max(1, Math.min(7, +process.argv[2] || 7));
const fmt = n => Math.round(n).toLocaleString('en-US');

/* Một ngày chơi đầy đủ = làm hết nhiệm vụ ngày, nhận quà vắng mặt kịch trần, quét hết vé.
   Vé quét tính ở tầng HỐ LOẠN 20 — chỗ cày quen của đội cấp 15–20. */
const dailySh   = DAILY_TASKS.reduce((s,t)=>s+t.reward, 0);
const comeback  = COMEBACK.capHours * COMEBACK.shHour;
const sweepTier = 20;
const sweepSh   = Math.round(RIOT.reward(sweepTier).shards * RIOT.replayPct) * PLAY.sweepDay;
const streakSh  = STREAK.filter(s=>s.days<=DAYS).reduce((s,x)=>s+x.sh, 0);
const riotWeek  = RIOT_WEEK.reduce((s,t)=>s+t.reward, 0);

/* Hợp đồng tháng cố ý trả rất ít SH (thưởng chính là CR/LK) — vẫn phải đếm, vì "cố ý ít" chỉ đúng
   khi có con số đứng cạnh những nguồn kia. Quy về tuần: cả mùa chia 30 ngày rồi nhân số ngày chơi. */
const passSh = PASS ? PASS.tiers.reduce((s,t)=>s+(t.sh||0),0) : 0;
const passWeek = passSh/30*DAYS;

/* VIỆC HÔM NAY (D7) chỉ có MỘT loại đụng tới SH: ngày thêm vé quét. CR×2, LK×2, DẤU×2 không sinh SH —
   đó là lý do chọn bốn loại đó thay vì SH×2. Tính theo số ngày `sweep` trong tuần, kẹp theo số ngày chơi. */
const sweepDays = (TODAY_BONUS||[]).filter(b=>b.kind==='sweep').length;
const bonusTicketSh = Math.min(DAYS, sweepDays) * (TODAY_SWEEP_BONUS||0)
  * Math.round(RIOT.reward(sweepTier).shards * RIOT.replayPct);

const rows = [
  ['Nhiệm vụ ngày',            dailySh*DAYS,  `${dailySh} SH × ${DAYS} ngày`],
  ['Hợp đồng tháng',           passWeek,      `${passSh} SH cả mùa ÷ 30 ngày × ${DAYS} (thưởng chính là CR/LK)`],
  ['Nhiệm vụ tuần chung',      (WEEK_TASKS||[]).reduce((s,t)=>s+(t.sh||0),0), `${(WEEK_TASKS||[]).length} việc — trả CR/LK, cố ý không trả SH`],
  ['Việc hôm nay (thêm vé)',   bonusTicketSh, `${sweepDays} ngày × ${TODAY_SWEEP_BONUS||0} vé · CR×2/LK×2/DẤU×2 không sinh SH`],
  ['Quà VỀ RỒI',               comeback*DAYS, `${comeback} SH × ${DAYS} ngày (kịch trần ${COMEBACK.capHours} giờ)`],
  ['Quét nhanh (tầng 20)',     sweepSh*DAYS,  `${PLAY.sweepDay} vé × ${Math.round(RIOT.reward(sweepTier).shards*RIOT.replayPct)} SH × ${DAYS} ngày`],
  ['Chuỗi ngày',               streakSh,      `mốc đạt được khi chơi ${DAYS} ngày`],
  ['Hợp đồng tuần (DẸP LOẠN)', riotWeek,      `${RIOT_WEEK.length} việc, cần mở khoá ${RIOT.unlock}`],
];
const total = rows.reduce((s,r)=>s+r[1], 0);

console.log(`SH VÀO VÍ MỖI TUẦN — chơi ${DAYS}/7 ngày\n`);
rows.forEach(([name,sh,note])=>console.log(`  ${name.padEnd(26)} ${fmt(sh).padStart(7)} SH   ${note}`));
console.log(`  ${''.padEnd(26)} ${'───────'}`);
console.log(`  ${'TỔNG'.padEnd(26)} ${fmt(total).padStart(7)} SH\n`);

/* Quy ra thứ người chơi thật sự quan tâm: quay được mấy lượt, và có chạm pity không */
const b = BANNER;
const pulls10 = total / b.cost10, pulls = total / b.cost1;
console.log(`Quy ra lượt quay (${b.cost1} SH/lượt · ${b.cost10} SH cho ×10):`);
console.log(`  ${pulls.toFixed(1)} lượt = ${pulls10.toFixed(1)} loạt ×10 mỗi tuần`);
console.log(`  pity ${b.pityS} lượt → chạm pity sau ${(b.pityS/pulls).toFixed(1)} tuần\n`);

/* Trần một lần: thưởng clear lần đầu cả chiến dịch — in riêng vì nó không lặp lại */
const firstClear = SECTORS.reduce((s,x)=>s+x.reward.shards, 0);
console.log(`Một lần duy nhất (không tính vào tuần): clear lần đầu ${SECTORS.length} màn = ${fmt(firstClear)} SH`);
console.log(`Hố tiêu CR để đối chiếu: nâng 1 người lên cấp 20 = ${fmt(76000)} CR · đột phá đủ 4 sao = `
  + `${fmt(ASCEND.reduce((s,x)=>s+x.cr,0))} CR + ${ASCEND.reduce((s,x)=>s+x.lk,0)} LK`);
