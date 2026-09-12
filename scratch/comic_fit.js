'use strict';
/* comic_fit.js — đo ĐỘ LỆCH KHUNG giữa ảnh panel và ô của layout, không cần trình duyệt.
   Chạy: node scratch/comic_fit.js

   Vì sao cần: ảnh panel dán theo `object-fit: cover`, nên ảnh nào có tỉ lệ khác ô là bị CẮT — cắt ngang thì mất
   hai bên, cắt dọc thì mất trên/dưới (mất mặt nhân vật). Bảng dưới cho biết mỗi panel mất bao nhiêu phần trăm.
   Tỉ lệ ô là số đo thật ở 375×812 (ghi trong js/comic.js); ô co giãn theo chiều cao màn nên số này là mốc, không tuyệt đối. */
const fs = require('fs'), vm = require('vm'), path = require('path');
const ROOT = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

const noop = () => {}; const mem = {};
const elStub = () => ({ style: { setProperty: noop, removeProperty: noop }, classList: { add: noop, remove: noop, toggle: noop, contains: () => false },
  dataset: {}, appendChild: noop, prepend: noop, setAttribute: noop, addEventListener: noop, removeEventListener: noop,
  querySelector: () => null, querySelectorAll: () => [], textContent: '', innerHTML: '' });
const ctx = { console, Math, JSON, Date, Object, Array, String, Number, RegExp, Promise, Map, Set, Symbol, Error, URL,
  encodeURI, decodeURI, parseInt, parseFloat, isNaN, setTimeout, clearTimeout, setInterval, clearInterval,
  localStorage: { getItem: k => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = String(v); }, removeItem: k => { delete mem[k]; } },
  navigator: { userAgent: 'node', language: 'vi' }, location: { search: '', href: 'http://localhost/', hash: '' }, history: { replaceState: noop },
  matchMedia: () => ({ matches: false, addEventListener: noop, addListener: noop }),
  document: Object.assign(elStub(), { documentElement: elStub(), body: elStub(), head: elStub(), createElement: elStub, getElementById: () => null, hidden: false }),
  fetch: () => Promise.reject(new Error('no fetch')), Image: function () { return elStub(); }, Audio: function () { return elStub(); },
  requestAnimationFrame: noop, cancelAnimationFrame: noop };
ctx.window = ctx; ctx.globalThis = ctx; ctx.self = ctx;
vm.createContext(ctx);
const load = f => { try { vm.runInContext(read(f), ctx, { filename: f }); } catch (e) { console.log(`  (nạp ${f} lỗi giữa chừng: ${e.message})`); } };
['js/core.js', 'js/data.js', 'js/state.js', 'js/story.js'].forEach(load);
const G = n => { try { return vm.runInContext(`typeof ${n}!=='undefined'?${n}:null`, ctx); } catch (e) { return null; } };
const STORY = G('STORY'); if (!STORY) { console.log('Không đọc được STORY'); process.exit(1); }

/* Tỉ lệ ô đo thật ở 375×812 (khớp chú thích đầu js/comic.js) */
const CELLS = {
  splash: [0.49],
  v2:     [1.00, 1.00],
  h2:     [0.26, 0.26],
  w3:     [0.93, 0.52, 0.52],
  w3b:    [0.52, 0.52, 0.93],
  v3:     [1.51, 1.51, 1.51],
  g4:     [0.52, 0.52, 0.52, 0.52],
};

/* Khổ ảnh JPEG/PNG đọc thẳng từ file, khỏi cần thư viện */
function imgSize(file) {
  let b; try { b = fs.readFileSync(file); } catch (e) { return null; }
  if (b[0] === 0x89 && b[1] === 0x50) return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  let i = 2;
  while (i < b.length) {
    if (b[i] !== 0xFF) { i++; continue; }
    const m = b[i + 1];
    if (m >= 0xC0 && m <= 0xCF && m !== 0xC4 && m !== 0xC8 && m !== 0xCC) return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
    i += 2 + b.readUInt16BE(i + 2);
  }
  return null;
}
const imgName = (sid, kind, pg, pn) => `art/comic/${String(sid).toLowerCase().replace(/[^a-z0-9]/g, '')}_${kind === 'outro' ? 'o' : 'i'}${pg}_p${pn}.jpg`;

const rows = [];
for (const sid of Object.keys(STORY)) for (const kind of ['intro', 'outro']) {
  (STORY[sid][kind] || []).forEach((pg, i) => {
    const cells = CELLS[pg.layout] || CELLS.splash;
    pg.panels.slice(0, cells.length).forEach((p, k) => {
      const file = imgName(sid, kind, i + 1, k + 1);
      const sz = imgSize(path.join(ROOT, file));
      const cell = cells[k], nat = sz ? sz.w / sz.h : 0;
      let axis = '', cut = 0;
      if (nat) { if (nat > cell) { axis = 'hai bên'; cut = Math.round((1 - cell / nat) * 100); } else if (nat < cell) { axis = 'trên/dưới'; cut = Math.round((1 - nat / cell) * 100); } }
      rows.push({ id: `${sid} ${kind[0]}${i + 1}p${k + 1}`, file, layout: pg.layout, cell, nat: +nat.toFixed(2), axis, cut,
        bubbles: (p.bubbles || []).filter(b => b.kind !== 'sfx').length, chars: (p.bubbles || []).reduce((n, b) => n + (b.text || '').length, 0), missing: !sz });
    });
  });
}
const bad = rows.filter(r => r.cut >= 12);
console.log(`${rows.length} panel · ${rows.filter(r => r.missing).length} thiếu ảnh · ${bad.length} panel ảnh lệch khung ≥ 12%\n`);
console.log('PANEL          LAYOUT  Ô     ẢNH   CẮT            CHỮ');
bad.sort((a, b) => b.cut - a.cut).forEach(r =>
  console.log(`${r.id.padEnd(14)} ${r.layout.padEnd(7)} ${String(r.cell).padEnd(5)} ${String(r.nat).padEnd(5)} ${(r.cut + '% ' + r.axis).padEnd(14)} ${r.bubbles} khối / ${r.chars} ký tự`));
console.log('\nThiếu ảnh: ' + (rows.filter(r => r.missing).map(r => r.file).join(', ') || 'không'));
const heavy = rows.filter(r => r.chars >= 150).sort((a, b) => b.chars - a.chars);
console.log(`\n${heavy.length} panel nhiều chữ (≥ 150 ký tự) — chỗ bong bóng che nhiều nhất:`);
heavy.forEach(r => console.log(`  ${r.id.padEnd(14)} ${r.layout.padEnd(5)} ô ${r.cell}  ${r.bubbles} khối / ${r.chars} ký tự`));
