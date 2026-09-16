'use strict';
/* =====================================================================
   QUÉT NHANH — lấy thưởng của màn/tầng ĐÃ THẮNG mà không phải đánh lại (docs/che-do-choi.md §D).
   Nạp sau js/state.js (cần today()) và trước js/app.js (renderSectors/renderRiot đọc các hàm ở đây).

   Ba thứ file này CỐ Ý không làm, vì chúng là phần thưởng của việc đánh thật:
     · không ghi PLAYER.defeated  → quét không mở thêm quân trong bể gacha
     · không ghi PLAYER.cleared, không nâng PLAYER.riot.tier → quét không mở đường đi lên
     · không cộng nhiệm vụ ngày (win / attacks / ult) → nhiệm vụ ngày muốn người chơi CHƠI
   Nghĩa là quét chỉ đổi THỜI GIAN thành tiền, không đổi tiến trình. Vì thế nó cũng không gọi winReward()
   của battle.js: hàm đó còn chạy comic kết màn và ghi tiến trình, những việc một cú bấm không được phép làm.
   ===================================================================== */

/* ---- Vé quét: PLAY.sweepDay lượt mỗi ngày, dùng chung mốc ngày với nhiệm vụ ngày (today() ở js/state.js)
       nên không có đồng hồ thứ hai để lệch — nhiệm vụ ngày reset là vé cũng reset. ---- */
function sweepTick(){
  if(!PLAYER.sweep || PLAYER.sweep.date!==today()){ PLAYER.sweep={ date:today(), used:0 }; savePlayer(); }
  return PLAYER.sweep;
}
const sweepLeft = () => Math.max(0, PLAY.sweepDay - sweepTick().used);

/* Quét được không, và vì sao không — trả về chuỗi lý do để nút nói thẳng thay vì chỉ mờ đi.
   sec = object sector của chiến dịch, hoặc object hình dạng sector của một tầng HỐ LOẠN (riotSector(n)). */
function sweepWhy(sec){
  if(!sec || !sec.reward) return 'no';
  if(sec.mode==='riot'){ if((sec.tier||0) > PLAYER.riot.best) return 'unbeaten'; }
  else if(sec.state!=='cleared') return 'unbeaten';
  if(!sweepLeft()) return 'noticket';
  return 'ok';
}
const canSweep = sec => sweepWhy(sec)==='ok';

/* Thưởng MỘT lượt quét = đúng mức chơi lại, không hơn: chiến dịch PLAY.sweepPct (25%, bằng TUẦN TRA ở
   winReward), HỐ LOẠN RIOT.replayPct (30%). Làm tròn y hệt winReward để hai con đường không lệch nhau. */
function sweepGain(sec){
  const k = sec.mode==='riot' ? RIOT.replayPct : PLAY.sweepPct;
  return { shards: Math.round(sec.reward.shards*k), credits: Math.round(sec.reward.credits*k) };
}
/* Quét n lượt (kẹp theo vé còn lại). Trả về {n, shards, credits}, hoặc null nếu không quét được. */
function sweepRun(sec, n=1){
  if(!canSweep(sec)) return null;
  n = Math.max(1, Math.min(n, sweepLeft()));
  const g=sweepGain(sec);
  const out={ n, shards:g.shards*n, credits:g.credits*n };
  PLAYER.shards += out.shards; PLAYER.credits += out.credits;
  sweepTick().used += n; savePlayer();
  return out;
}

/* ---- Giao diện ---- */
/* Dòng chữ dưới nút QUÉT: hoặc số tiền lấy được, hoặc lý do chưa quét được.
   Số vé còn lại nằm trên dòng TÊN nút (sweepBtnKey) chứ không nhét chung vào đây — nhãn dài quá thì
   nút cao 52px ngắt thành hai dòng và dấu · rơi xuống đầu dòng dưới. */
function sweepBtnTxt(sec){
  const why=sweepWhy(sec);
  if(why==='no')       return 'Chọn một màn';
  if(why==='unbeaten') return 'Phải thắng một lần trước';
  if(why==='noticket') return 'Hết vé · quay lại 00:00';
  const g=sweepGain(sec);
  return `+${g.shards} SH · +${g.credits} CR`;
}
const sweepBtnKey = () => `Quét · ${sweepLeft()}/${PLAY.sweepDay} vé`;
/* Quét rồi hiện hộp kết quả. Hộp cố ý gọn hơn bảng kết quả trận: ở đây không có trận nào để tổng kết,
   chỉ có tiền vào ví và số vé còn lại. */
function sweepDo(sec, n=1){
  const r=sweepRun(sec, n);
  if(!r){ sfx('error',.4); return null; }
  AUDIO.upgrade();
  const box=$('#swBox');
  if(box){
    $('#swT').textContent=`QUÉT ×${r.n} · ${sec.id}`;
    $('#swS').innerHTML=`<b class="result__rw">+${r.shards.toLocaleString('en-US')} SH · +${r.credits.toLocaleString('en-US')} CR</b>`
      + `<br><span class="mono">${sec.name} · còn ${sweepLeft()}/${PLAY.sweepDay} vé hôm nay</span>`;
    box.hidden=false;
  }
  if(typeof renderWallet==='function') renderWallet();
  return r;
}
{ const box=$('#swBox'), close=$('#swClose');
  const hide=()=>{ if(box) box.hidden=true; };
  if(close) close.addEventListener('click', hide);
  if(box) box.addEventListener('click', e=>{ if(e.target===box) hide(); });   // chạm ra ngoài hộp cũng đóng
}
