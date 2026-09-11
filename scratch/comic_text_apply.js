'use strict';
/* comic_text_apply.js — đẩy chữ đã sửa trong docs/comic-text.md ngược vào js/story.js.
   Cặp với scratch/comic_text_dump.js. Chỉ thay CHỮ, không đụng bố cục, ảnh, vị trí bong bóng.

     node scratch/comic_text_apply.js            → ghi đè js/story.js (có tạo .bak)
     node scratch/comic_text_apply.js --dry      → chỉ in ra chỗ nào đổi, không ghi

   Cách ghép: bong bóng thứ N trong file md ứng với lời gọi say/think/yell/cap/bang thứ N trong js/story.js
   (thứ tự trong md sinh ra từ chính thứ tự file nên luôn khớp). Lệch số lượng → dừng, không ghi gì. */

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'js/story.js');
const MD = path.join(ROOT, 'docs/comic-text.md');
const DRY = process.argv.includes('--dry');

/* ---- 1. Đọc chữ từ md, theo thứ tự ---- */
const md = fs.readFileSync(MD, 'utf8');
const wanted = [];
for (const line of md.split('\n')) {
  const m = line.match(/^- `([^`]*)` — ([\s\S]*)$/);
  if (m) wanted.push({ meta: m[1], text: m[2].trim() });
}

/* ---- 2. Tìm mọi lời gọi bong bóng trong story.js, theo thứ tự ----
   say/think/yell: chữ là tham số THỨ HAI · cap/bang: tham số THỨ NHẤT.
   Chuỗi trong file luôn dùng nháy đơn; bắt cả \' đã escape. */
const src = fs.readFileSync(SRC, 'utf8');
const STR = "'((?:[^'\\\\]|\\\\.)*)'";
const RE = new RegExp(`\\b(say|think|yell)\\(\\s*(?:null|${STR})\\s*,\\s*${STR}|\\b(cap|bang)\\(\\s*${STR}`, 'g');

const found = [];
let m;
while ((m = RE.exec(src)) !== null) {
  // nhóm: 1=say/think/yell 2=who 3=text | 4=cap/bang 5=text
  const isSpeech = !!m[1];
  const text = isSpeech ? m[3] : m[5];
  const start = m.index + m[0].lastIndexOf("'" + text + "'") + 1;
  found.push({ fn: isSpeech ? m[1] : m[4], text, start, end: start + text.length });
}

if (found.length !== wanted.length) {
  console.error(`! Lệch số lượng: md có ${wanted.length} bong bóng, js/story.js có ${found.length}.`);
  console.error('  Có thể anh đã thêm/bớt dòng trong md. Chạy lại comic_text_dump.js rồi sửa tiếp, không ghi gì cả.');
  process.exit(1);
}

/* ---- 3. Thay từ cuối lên đầu để không lệch vị trí ---- */
const esc = s => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
let out = src, changed = 0;
for (let i = found.length - 1; i >= 0; i--) {
  const cur = found[i].text;                       // đang ở dạng đã escape trong file
  const next = esc(wanted[i].text);
  if (cur === next) continue;
  changed++;
  if (DRY) console.log(`  ${found[i].fn}: "${cur}"\n            → "${next}"`);
  out = out.slice(0, found[i].start) + next + out.slice(found[i].end);
}

if (!changed) { console.log('Khong co gi doi.'); process.exit(0); }
if (DRY) { console.log(`(--dry) ${changed} bong bong se doi.`); process.exit(0); }

fs.writeFileSync(path.join(ROOT, 'scratch/story.js.bak'), src);
fs.writeFileSync(SRC, out);
console.log(`js/story.js: da doi ${changed} bong bong (ban cu luu o scratch/story.js.bak).`);
