'use strict';
/* comic_text_dump.js — xuất TOÀN BỘ chữ trong comic ra docs/comic-text.md để sửa cho tiện.
   Cặp đôi với scratch/comic_text_apply.js (đẩy ngược vào js/story.js).

     node scratch/comic_text_dump.js     → sinh docs/comic-text.md từ js/story.js
     (sửa chữ trong docs/comic-text.md)
     node scratch/comic_text_apply.js    → ghi chữ đã sửa trở lại js/story.js

   Thứ tự bong bóng trong file md = thứ tự trong js/story.js, nên đừng thêm/bớt/đổi chỗ dòng nào. */

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const data = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const story = fs.readFileSync(path.join(ROOT, 'js/story.js'), 'utf8');
const shim = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
const { STORY, ROSTER, ENEMY_POOL, SECTORS } =
  new Function('localStorage', data + '\n' + story + '\n;return {STORY,ROSTER,ENEMY_POOL,SECTORS};')(shim);

const KIND = { speech: 'nói', thought: 'nghĩ', shout: 'hét', caption: 'dẫn', sfx: 'tiếng' };
const sectorName = id => (SECTORS.find(s => s.id === id) || {}).name || '';
const fileOf = (sid, kind, pg, pn) =>
  `art/comic/${sid.toLowerCase().replace(/[^a-z0-9]/g, '')}_${kind === 'outro' ? 'o' : 'i'}${pg}_p${pn}.jpg`;

const out = [];
out.push('# CHROMEFALL — toàn bộ chữ trong comic');
out.push('');
out.push('> **File này sinh tự động** từ `js/story.js`. Sửa chữ ở đây rồi đẩy ngược vào game:');
out.push('>');
out.push('> ```bash');
out.push('> node scratch/comic_text_apply.js');
out.push('> ```');
out.push('>');
out.push('> **Luật sửa:** chỉ đổi phần chữ **sau** dấu `` ` `` cuối cùng và dấu `—`. Giữ nguyên mã trong dấu nháy ngược');
out.push('> (`ai · kiểu · vị trí`), **đừng thêm dòng, đừng bớt dòng, đừng đổi thứ tự** — script ghép lại theo đúng thứ tự này.');
out.push('> Muốn thêm hoặc bỏ hẳn một bong bóng thì sửa trong `js/story.js` rồi chạy lại `comic_text_dump.js`.');
out.push('>');
out.push('> **Vị trí bong bóng:** `tl` trên-trái · `t` trên · `tr` trên-phải · `bl` dưới-trái · `b` dưới · `br` dưới-phải · `c` giữa.');
out.push('> **Kiểu:** `nói` · `nghĩ` · `hét` · `dẫn` (lời dẫn truyện) · `tiếng` (chữ tượng thanh).');
out.push('> Luật viết (`docs/story.md` §5): bong bóng ≤ 25 chữ, lời dẫn ≤ 40 chữ, câu ngắn, thuật ngữ lần đầu phải giải thích ngay.');
out.push('');

let nPage = 0, nPanel = 0, nBub = 0, warn = [];
for (const [sid, sec] of Object.entries(STORY)) {
  out.push('---', '', `## ${sid} · ${sectorName(sid)}`, '');
  for (const kind of ['intro', 'outro']) {
    const pages = sec[kind]; if (!pages || !pages.length) continue;
    out.push(`### ${kind === 'intro' ? 'INTRO — trước trận' : 'OUTRO — sau trận'}`, '');
    pages.forEach((pg, pi) => {
      nPage++;
      out.push(`#### Trang ${pi + 1} · bố cục \`${pg.layout}\``, '');
      pg.panels.forEach((pa, ai) => {
        nPanel++;
        const f = fileOf(sid, kind, pi + 1, ai + 1);
        const has = fs.existsSync(path.join(ROOT, f));
        out.push(`**Panel ${ai + 1}** · \`${f}\`${has ? '' : ' *(chưa có ảnh)*'}`);
        (pa.bubbles || []).forEach(b => {
          nBub++;
          const who = b.who || '—';
          const meta = [who, KIND[b.kind] || b.kind, b.at || 'bl'].concat(b.as ? ['nhãn:' + b.as] : []).join(' · ');
          const words = String(b.text || '').trim().split(/\s+/).length;
          const lim = b.kind === 'caption' ? 40 : 25;
          if (b.kind !== 'sfx' && words > lim) warn.push(`${f} · ${who}: ${words} chữ (hạn ${lim})`);
          out.push(`- \`${meta}\` — ${b.text}`);
        });
        out.push('');
      });
    });
  }
}
out.push('---', '');
out.push(`*${nPage} trang · ${nPanel} panel · ${nBub} bong bóng.*`);
if (warn.length) out.push('', '**Quá hạn chữ:**', ...warn.map(w => '- ' + w));

const dst = path.join(ROOT, 'docs/comic-text.md');
fs.writeFileSync(dst, out.join('\n') + '\n');
console.log(`docs/comic-text.md: ${nPage} trang · ${nPanel} panel · ${nBub} bong bóng` +
            (warn.length ? ` · ${warn.length} chỗ quá hạn chữ` : ''));
