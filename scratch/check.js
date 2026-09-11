'use strict';
/* check.js — MỘT lệnh soát hết, để "sửa xong kiểm lại, xanh rồi mới đi tiếp" không phụ thuộc trí nhớ.
   Chạy:
     node scratch/check.js            soát hết, chỉ báo vấn đề MỚI so với bản nền   (mã thoát 1 nếu có)
     node scratch/check.js --all      in mọi vấn đề, kể cả loại đã chấp nhận
     node scratch/check.js --accept   ghi lại bản nền theo hiện trạng

   Vì sao có "bản nền" (scratch/check-baseline.json): chương 1 còn 24 chỗ chữ quá dài và 23 món art chưa vẽ —
   đều là việc đang làm dở, không phải lỗi mới. Nếu bắt phải sạch tuyệt đối thì lệnh này đỏ vĩnh viễn và
   thành vô dụng. Bản nền chốt lại "những chỗ đã biết", còn lệnh chỉ đỏ khi xuất hiện chỗ CHƯA biết —
   đúng thứ cần bắt: sửa data.js làm lệch desc, xoá nhầm một file art, đổi tên sprite, thêm panel thiếu prompt.

   Rút bản nền xuống mỗi khi sửa được một mục: chạy lại, script tự khoe mục nào đã hết, rồi `--accept`. */

const { execFileSync } = require('child_process');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const BASE = path.join(__dirname, 'check-baseline.json');

const ALL = process.argv.includes('--all');
const ACCEPT = process.argv.includes('--accept');

const TOOLS = [
  { key: 'comic_lint', desc: 'truyện tranh: trang/panel, chữ trong bong bóng, người nói, khổ ảnh vs prompt' },
  { key: 'ult_lint',   desc: 'chiêu cuối: chữ khớp cơ chế, thanh Energy khớp cost' },
  { key: 'art_audit',  desc: 'art: thẻ, chân dung, sprite, video ult, nền, bản đồ' },
];

const baseline = fs.existsSync(BASE) ? JSON.parse(fs.readFileSync(BASE, 'utf8')) : {};
const now = {};
let crashed = 0;

for (const t of TOOLS) {
  const script = path.join(__dirname, t.key + '.js');
  let raw = '', err = null;
  try {
    raw = execFileSync(process.execPath, [script, '--json'], { cwd: ROOT, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  } catch (e) {
    // Mã thoát 1 là bình thường (có vấn đề) — vẫn có JSON trên stdout. Chỉ là hỏng thật khi không đọc nổi.
    raw = (e.stdout || '').toString();
    if (!raw.trim()) err = e.stderr ? String(e.stderr).trim() : e.message;
  }
  if (err === null) {
    try { now[t.key] = JSON.parse(raw.trim().split('\n').pop()).issues || []; }
    catch (e) { err = 'không đọc được JSON: ' + raw.trim().slice(0, 200); }
  }
  if (err !== null) { crashed++; now[t.key] = null; t.err = err; }
}

if (ACCEPT) {
  if (crashed) { console.log('Có script hỏng, không ghi bản nền. Sửa xong chạy lại.'); process.exit(1); }
  fs.writeFileSync(BASE, JSON.stringify(now, null, 2) + '\n', 'utf8');
  const tot = Object.values(now).reduce((s, l) => s + l.length, 0);
  console.log(`Đã ghi bản nền: ${tot} vấn đề đã biết → scratch/check-baseline.json`);
  process.exit(0);
}

let nNew = 0, nFixed = 0, nKnown = 0;
for (const t of TOOLS) {
  if (now[t.key] === null) { console.log(`\n✗ ${t.key} — SCRIPT HỎNG\n    ${t.err}`); continue; }
  const old = new Set(baseline[t.key] || []), cur = now[t.key];
  const fresh = cur.filter(x => !old.has(x));
  const gone = [...old].filter(x => !cur.includes(x));
  nNew += fresh.length; nFixed += gone.length; nKnown += cur.length - fresh.length;

  if (!fresh.length && !gone.length && !ALL) { console.log(`✓ ${t.key.padEnd(11)} ${cur.length ? `(${cur.length} chỗ đã biết)` : 'sạch'}`); continue; }
  console.log(`\n${fresh.length ? '✗' : '✓'} ${t.key} — ${t.desc}`);
  fresh.forEach(x => console.log('    MỚI  ' + x));
  gone.forEach(x => console.log('    hết  ' + x));
  if (ALL) cur.filter(x => old.has(x)).forEach(x => console.log('    đã biết  ' + x));
}

console.log('');
if (crashed) { console.log(`${crashed} script không chạy được.`); process.exit(1); }
if (nFixed) console.log(`${nFixed} chỗ đã sửa xong — chạy 'node scratch/check.js --accept' để rút bản nền xuống.`);
if (nNew) { console.log(`ĐỎ: ${nNew} vấn đề MỚI (${nKnown} chỗ đã biết từ trước).`); process.exit(1); }
console.log(`XANH: không có vấn đề mới (${nKnown} chỗ đã biết từ trước, xem bằng --all).`);
process.exit(0);
