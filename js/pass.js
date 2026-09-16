'use strict';
/* =====================================================================
   HỢP ĐỒNG THÁNG — thanh tiến trình 20 mốc cho mỗi tháng (đợt 7 · D3, docs/hop-dong-thang.md).
   Nạp sau js/state.js (cần today()) và trước js/app.js (dải ở HOME đọc passInfo).

   Ba luật giữ cho nó không thành nghĩa vụ:
     · Mốc đạt được thì nhận lúc nào cũng được TRONG THÁNG — không có đếm ngược, không có "còn 2 giờ".
     · Sang tháng mới thì thanh về 0; phần chưa nhận mất, nhưng mốc cuối chỉ cần ~17 ngày chơi nên không
       ai phải chạy nước rút. Cố ý ĐẠT HẾT TRƯỚC KHI HẾT THÁNG.
     · Thưởng KHÔNG lấy SH làm chính (xem docs/hop-dong-thang.md §A: SH đang thừa, pity gần như vô nghĩa).
   ===================================================================== */

/* Hồ sơ mùa: {id, pts, day:{date,n}, claimed:[mốc đã nhận]}. day = dấu đã ăn trong NGÀY hôm nay (trần). */
function passTick(){
  const id=passSeason();
  if(!PLAYER.pass || PLAYER.pass.id!==id){ PLAYER.pass={ id, pts:0, day:{ date:today(), n:0 }, claimed:[] }; savePlayer(); }
  const p=PLAYER.pass;
  if(!p.day || p.day.date!==today()){ p.day={ date:today(), n:0 }; savePlayer(); }
  return p;
}
/* Cộng dấu cho một việc. kind là khoá trong PASS.pts. Trả về số dấu THẬT SỰ cộng (0 nếu đã chạm trần ngày). */
function passAdd(kind, times=1){
  if(typeof PASS==='undefined' || !PASS.pts[kind]) return 0;
  const p=passTick();
  /* VIỆC HÔM NAY (D7): ngày `pass2` cho gấp đôi dấu — trần ngày KHÔNG đổi, nên nó rút ngắn thời gian
     chạm trần chứ không nâng trần. */
  const x = (typeof todayIs==='function' && todayIs('pass2')) ? 2 : 1;
  const want=PASS.pts[kind]*times*x;
  const room=Math.max(0, PASS.dayCap - p.day.n);
  const got=Math.min(want, room);
  if(!got) return 0;
  p.pts += got; p.day.n += got; savePlayer();
  return got;
}
/* Tiến trình: mốc đã mở, mốc kế tiếp, dấu còn thiếu, dấu còn được ăn hôm nay */
function passInfo(){
  const p=passTick(), step=PASS.step, max=PASS.tiers.length;
  const open=Math.min(max, Math.floor(p.pts/step));
  const next=open<max ? PASS.tiers[open] : null;
  return { season:p.id, pts:p.pts, open, max, next,
           need: next ? (open+1)*step - p.pts : 0,
           claimable: PASS.tiers.filter(t=>t.n<=open && !p.claimed.includes(t.n)).length,
           dayLeft: Math.max(0, PASS.dayCap - p.day.n) };
}
const passClaimable = () => passInfo().claimable;
/* Nhận một mốc. Cosmetic được áp dụng ngay — game chỉ có một khung và một danh hiệu nên không cần màn chọn. */
function passClaim(n){
  const p=passTick(), t=PASS.tiers.find(x=>x.n===n);
  if(!t || p.claimed.includes(n) || p.pts < n*PASS.step) return null;
  p.claimed.push(n);
  if(t.cr) PLAYER.credits += t.cr;
  if(t.lk) PLAYER.parts += t.lk;
  if(t.sh) PLAYER.shards += t.sh;
  if(t.frame) PLAYER.frame = PASS.frame.id;
  if(t.title) PLAYER.title = PASS.title.name;
  savePlayer();
  return t;
}
function passClaimAll(){
  const got=[]; let t;
  PASS.tiers.forEach(x=>{ if((t=passClaim(x.n))) got.push(t); });
  return got.length ? got : null;
}
/* Chữ một dòng cho từng mốc — dùng ở cả dải HOME lẫn danh sách */
function passRewardTxt(t){
  const bits=[];
  if(t.cr) bits.push(`${t.cr.toLocaleString('en-US')} CR`);
  if(t.lk) bits.push(`${t.lk} LK`);
  if(t.sh) bits.push(`${t.sh} SH`);
  if(t.frame) bits.push(PASS.frame.name);
  if(t.title) bits.push(`DANH HIỆU · ${PASS.title.name}`);
  return bits.join(' · ');
}
