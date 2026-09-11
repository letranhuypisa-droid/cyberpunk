/* comic_overlap.js — quét chồng lấn bong bóng comic NGAY TRONG TRÌNH DUYỆT.
   Đo bằng getBoundingClientRect thật, không đoán, vì ô panel co giãn theo chiều cao màn hình.

   Dùng: mở game rồi dán vào console (hoặc nạp bằng fetch + eval):
     await fetch('scratch/comic_overlap.js').then(r=>r.text()).then(eval)
     await comicOverlap()                      // quét tất cả sector
     await comicOverlap(['07-C','07-D'])       // quét vài sector

   Khổ máy nên quét: 375×812 (iPhone thường) VÀ 375×667 (iPhone SE — thấp nhất còn phổ biến).
   Bỏ qua chồng lấn ≤18px khi một bên là chữ tượng thanh: .bub--sfx trong suốt, không có khung.
   Panel nào báo lỗi thì thêm stack:true vào panel đó trong js/story.js (xem đầu file story.js). */
'use strict';
window.comicOverlap = async function (only) {
  const ids = only || Object.keys(STORY);
  const rep = [];
  const st = document.querySelector('#comicStage');
  for (const sid of ids) {
    for (const kind of ['intro', 'outro']) {
      const pages = (STORY[sid] || {})[kind]; if (!pages || !pages.length) continue;
      playComic(pages, SECTORS.find(s => s.id === sid), kind);
      await new Promise(r => setTimeout(r, 600));
      for (let pg = 1; pg <= pages.length; pg++) {
        let guard = 0;
        while (st.querySelectorAll('.bub.is-hid').length && guard++ < 14) { st.click(); await new Promise(r => setTimeout(r, 120)); }
        await new Promise(r => setTimeout(r, 220));
        [...st.querySelectorAll('.panel')].forEach((p, pi) => {
          const pr = p.getBoundingClientRect();
          const bs = [...p.querySelectorAll('.bub')].map(b => {
            const r = b.getBoundingClientRect();
            return { sfx: b.classList.contains('bub--sfx'),
                     cls: ([...b.classList].find(c => /^bub--(tl|tr|bl|br|t|b|c)$/.test(c)) || '?').slice(5),
                     t: Math.round(r.top - pr.top), b: Math.round(r.bottom - pr.top),
                     l: Math.round(r.left - pr.left), r: Math.round(r.right - pr.left) };
          });
          const bad = [];
          for (let a = 0; a < bs.length; a++) for (let c = a + 1; c < bs.length; c++) {
            const A = bs[a], B = bs[c];
            if (A.t < B.b && B.t < A.b && A.l < B.r && B.l < A.r) {
              const ov = Math.min(A.b, B.b) - Math.max(A.t, B.t);
              if (!(A.sfx || B.sfx) || ov > 18) bad.push(`${A.cls}x${B.cls}(${ov}px)`);
            }
          }
          bs.forEach(b => { if (b.b > pr.height + 3) bad.push(`${b.cls} tràn đáy +${Math.round(b.b - pr.height)}`); });
          if (bad.length) rep.push(`${sid} ${kind} t${pg}p${pi + 1} [${Math.round(pr.width)}x${Math.round(pr.height)}] `
            + bs.map(b => `${b.cls}:${b.t}-${b.b}`).join(' | ') + '   ** ' + bad.join(' ; '));
        });
        if (pg < pages.length) { st.click(); await new Promise(r => setTimeout(r, 460)); }
      }
      if (COMIC.running) COMIC.running();
      await new Promise(r => setTimeout(r, 120));
    }
  }
  return `${innerWidth}×${innerHeight} — ` + (rep.length ? `${rep.length} panel lỗi\n` + rep.join('\n') : 'sạch, không panel nào chồng lấn');
};
