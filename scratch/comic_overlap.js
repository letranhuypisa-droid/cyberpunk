/* comic_overlap.js — quét bố cục panel comic NGAY TRONG TRÌNH DUYỆT.
   Đo bằng getBoundingClientRect thật, không đoán, vì ô panel co giãn theo chiều cao màn hình.

   Dùng: mở game rồi dán vào console (hoặc nạp bằng fetch + eval):
     await fetch('scratch/comic_overlap.js').then(r=>r.text()).then(eval)
     await comicOverlap()                      // quét tất cả sector
     await comicOverlap(['07-C','07-D'])       // quét vài sector

   Khổ máy nên quét: 375×812 (iPhone thường) VÀ 375×667 (iPhone SE — thấp nhất còn phổ biến).

   ĐỔI 12/09 (docs/comic-reader.md): renderer đổi nên hai lỗi cũ hết xảy ra được —
   · bong bóng đè nhau: không thể, vì mọi khối chữ xếp thành MỘT CỘT flex ở đáy panel;
   · ảnh bị xén: không thể, vì ảnh vẽ tay dán `object-fit: contain`.
   Công cụ vẫn kiểm cả hai (để bắt hồi quy nếu ai đó sửa css), nhưng thứ CẦN canh bây giờ là:
   · CỘT CHỮ CAO QUÁ, nuốt mất tranh — ngưỡng cảnh báo 45% chiều cao ô (đo ở 375×812);
   · bong bóng tràn khỏi ô;
   · ảnh bị xén (chỉ còn xảy ra với panel chưa có ảnh riêng, rơi về ảnh tạm dán `cover`). */
'use strict';
window.comicOverlap = async function (only) {
  const ids = only || Object.keys(STORY);
  const rep = [], all = [];
  const st = document.querySelector('#comicStage');
  for (const sid of ids) {
    for (const kind of ['intro', 'outro']) {
      const pages = (STORY[sid] || {})[kind]; if (!pages || !pages.length) continue;
      playComic(pages, SECTORS.find(s => s.id === sid), kind, { replay: true });
      await new Promise(r => setTimeout(r, 600));
      for (let pg = 1; pg <= pages.length; pg++) {
        let guard = 0;
        while (st.querySelectorAll('.bub.is-hid').length && guard++ < 14) { st.click(); await new Promise(r => setTimeout(r, 120)); }
        await new Promise(r => setTimeout(r, 220));
        [...st.querySelectorAll('.page:not(.is-out) .panel')].forEach((p, pi) => {
          const pr = p.getBoundingClientRect();
          const img = p.querySelector('.panel__img'), col = p.querySelector('.panel__bubs');
          const bad = [];

          /* 1. Cột chữ cao bao nhiêu phần ô */
          const colH = col ? Math.round(col.getBoundingClientRect().height / pr.height * 100) : 0;
          if (colH > 45) bad.push(`cột chữ ${colH}% ô`);

          /* 2. Ảnh có bị xén không. contain thì chừa viền (pad), cover thì xén (cut). */
          const nat = img && img.naturalWidth ? img.naturalWidth / img.naturalHeight : 0;
          const cell = pr.width / pr.height, art = p.classList.contains('has-art');
          let pad = 0;
          if (nat) {
            const f = nat > cell ? (1 - cell / nat) : (1 - nat / cell);
            if (art) pad = Math.round(f * 100);
            else if (f >= .1) bad.push(`ẢNH XÉN ${Math.round(f * 100)}% (ảnh tạm, chưa có ảnh riêng)`);
          }

          /* 3. Hồi quy: bong bóng đè nhau / tràn khỏi ô */
          const bs = [...p.querySelectorAll('.bub')].map(b => {
            const r = b.getBoundingClientRect();
            return { sfx: b.classList.contains('bub--sfx'),
                     cls: ([...b.classList].find(c => /^bub--(tl|tr|bl|br|t|b|c)$/.test(c)) || '?').slice(5),
                     t: Math.round(r.top - pr.top), b: Math.round(r.bottom - pr.top),
                     l: Math.round(r.left - pr.left), r: Math.round(r.right - pr.left) };
          });
          for (let a = 0; a < bs.length; a++) for (let c = a + 1; c < bs.length; c++) {
            const A = bs[a], B = bs[c];
            if (A.t < B.b && B.t < A.b && A.l < B.r && B.l < A.r) {
              const ov = Math.min(A.b, B.b) - Math.max(A.t, B.t);
              if (!(A.sfx || B.sfx) || ov > 18) bad.push(`ĐÈ NHAU ${A.cls}x${B.cls}(${ov}px)`);
            }
          }
          bs.forEach(b => {
            if (b.b > pr.height + 3) bad.push(`${b.cls} TRÀN đáy +${Math.round(b.b - pr.height)}`);
            if (b.t < -3) bad.push(`${b.cls} TRÀN đỉnh ${Math.round(b.t)}`);
          });

          all.push({ id: `${sid} ${kind[0]}${pg}p${pi + 1}`, colH, pad });
          if (bad.length) rep.push(`${sid} ${kind} t${pg}p${pi + 1} [${Math.round(pr.width)}x${Math.round(pr.height)}]`
            + (pad ? ` viền chừa ${pad}%` : '') + '   ** ' + bad.join(' ; '));
        });
        if (pg < pages.length) { st.click(); await new Promise(r => setTimeout(r, 460)); }
      }
      if (COMIC.running) COMIC.running();
      await new Promise(r => setTimeout(r, 120));
    }
  }
  const avg = a => Math.round(a.reduce((s, x) => s + x, 0) / (a.length || 1));
  const head = `${innerWidth}×${innerHeight} — ${all.length} panel · cột chữ trung bình ${avg(all.map(x => x.colH))}%`
    + ` (cao nhất ${Math.max(0, ...all.map(x => x.colH))}%) · viền chừa trung bình ${avg(all.map(x => x.pad))}%`;
  return head + '\n' + (rep.length ? `${rep.length} panel cần xem\n` + rep.join('\n') : 'sạch — không panel nào vượt ngưỡng');
};
