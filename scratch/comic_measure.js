/* comic_measure.js — dán toàn bộ vào Console (F12) của game khi đã mở index.html (khổ điện thoại 375×812).
   Chạy hết 29 trang comic, đo từng panel: tỉ lệ ô thật, % diện tích bị bong bóng che, cặp bong bóng đè nhau (px),
   bong bóng tràn khỏi ô, bong bóng cao > 40% ô. In console.table + danh sách panel cần xem. Không sửa gì. */
(async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const out = [];
  for (const sid of Object.keys(STORY)) for (const kind of ['intro', 'outro']) {
    const pages = STORY[sid][kind] || [];
    for (let i = 0; i < pages.length; i++) {
      playComic([pages[i]], sectorById(sid), kind); await sleep(60);
      document.querySelectorAll('#comicStage .bub.is-hid').forEach(b => b.classList.remove('is-hid')); await sleep(280);
      [...document.querySelectorAll('#comicStage .page .panel')].forEach((p, k) => {
        const r = p.getBoundingClientRect();
        const bs = [...p.querySelectorAll('.bub')].map(b => ({
          at: ([...b.classList].find(c => /^bub--(tl|tr|bl|br|t|b|c)$/.test(c)) || 'bub--?').slice(5),
          kind: ([...b.classList].find(c => /^bub--(speech|thought|shout|caption|sfx)$/.test(c)) || 'bub--?').slice(5),
          q: b.getBoundingClientRect() }));
        let cover = 0; bs.forEach(b => cover += b.q.width * b.q.height);
        const ov = [];
        for (let a = 0; a < bs.length; a++) for (let c = a + 1; c < bs.length; c++) {
          const A = bs[a].q, B = bs[c].q;
          const w = Math.min(A.right, B.right) - Math.max(A.left, B.left), h = Math.min(A.bottom, B.bottom) - Math.max(A.top, B.top);
          if (w > 2 && h > 2) ov.push(`${bs[a].at}×${bs[c].at} ${Math.round(w)}×${Math.round(h)}px`);
        }
        const clip = bs.filter(b => b.q.left < r.left - 1 || b.q.right > r.right + 1 || b.q.top < r.top - 1 || b.q.bottom > r.bottom + 1).map(b => b.at);
        const tall = bs.filter(b => b.kind !== 'sfx' && b.q.height > r.height * .4).map(b => b.at + ' ' + Math.round(b.q.height / r.height * 100) + '%');
        out.push({ panel: `${sid} ${kind === 'intro' ? 'i' : 'o'}${i + 1} p${k + 1}`, file: comicImgName(sid, kind, i + 1, k + 1), layout: pages[i].layout,
          size: `${Math.round(r.width)}×${Math.round(r.height)}`, ratio: +(r.width / r.height).toFixed(2), cover: Math.round(cover / (r.width * r.height) * 100),
          overlap: ov.join(', '), clip: clip.join(','), tall: tall.join(',') });
      });
    }
  }
  comicEnd();
  console.table(out);
  const flagged = out.filter(x => x.overlap || x.clip || x.tall || x.cover >= 30);
  console.log(`${out.length} panel đo · ${flagged.length} cần xem:\n` + flagged.map(x =>
    `${x.panel} [${x.layout} ${x.ratio}] che ${x.cover}%${x.overlap ? ' · ĐÈ ' + x.overlap : ''}${x.clip ? ' · TRÀN ' + x.clip : ''}${x.tall ? ' · CAO ' + x.tall : ''}`).join('\n'));
  return out;
})();
