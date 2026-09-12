'use strict';
/* comic_lint.js — kiểm tra nhanh js/story.js, không cần trình duyệt. Chạy: node scratch/comic_lint.js
   Kiểm: số trang/panel/bong bóng từng màn · layout đủ ô · bong bóng ≤ 25 chữ, caption ≤ 40 · id người nói có trong
   ROSTER/ENEMY_POOL · hai bong bóng cùng góc · tên file + khổ ảnh so với docs/comic-prompts.md · ảnh đã có trong art/comic/ ·
   từ cấm (docs/story.md §1) · lần xuất hiện đầu của thuật ngữ · đại từ xưng hô theo người nói · wave theo data.js. */
const fs = require('fs'), vm = require('vm'), path = require('path');
const ROOT = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

/* --json: nuốt hết bảng biểu, chỉ in {issues, notes} cho scratch/check.js đọc. Phải đặt trước khi dựng ctx
   của vm vì ctx dùng chung đúng object console này — nạp file lỗi giữa chừng cũng không làm hỏng JSON. */
const JSON_OUT = process.argv.includes('--json');
const out = console.log.bind(console);
if (JSON_OUT) console.log = () => {};

/* ---- sandbox tối thiểu để nạp core.js / data.js / state.js / story.js ---- */
const noop = () => {}; const mem = {};
const elStub = () => ({ style: { setProperty: noop, removeProperty: noop }, classList: { add: noop, remove: noop, toggle: noop, contains: () => false },
  dataset: {}, appendChild: noop, prepend: noop, setAttribute: noop, addEventListener: noop, removeEventListener: noop,
  querySelector: () => null, querySelectorAll: () => [], textContent: '', innerHTML: '' });
const ctx = { console, Math, JSON, Date, Object, Array, String, Number, RegExp, Promise, Map, Set, Symbol, Error, URL,
  encodeURI, decodeURI, parseInt, parseFloat, isNaN, setTimeout, clearTimeout, setInterval, clearInterval,
  structuredClone: typeof structuredClone === 'function' ? structuredClone : undefined,
  localStorage: { getItem: k => (k in mem ? mem[k] : null), setItem: (k, v) => { mem[k] = String(v); }, removeItem: k => { delete mem[k]; } },
  navigator: { userAgent: 'node', language: 'vi' }, location: { search: '', href: 'http://localhost/', hash: '' }, history: { replaceState: noop },
  matchMedia: () => ({ matches: false, addEventListener: noop, addListener: noop }),
  document: Object.assign(elStub(), { documentElement: elStub(), body: elStub(), head: elStub(), createElement: elStub, getElementById: () => null, hidden: false }),
  fetch: () => Promise.reject(new Error('no fetch')), Image: function () { return elStub(); }, Audio: function () { return elStub(); },
  requestAnimationFrame: noop, cancelAnimationFrame: noop };
ctx.window = ctx; ctx.globalThis = ctx; ctx.self = ctx;
vm.createContext(ctx);
const load = f => { try { vm.runInContext(read(f), ctx, { filename: f }); } catch (e) { console.log(`  (nạp ${f} lỗi giữa chừng, vẫn dùng phần đã khai báo: ${e.message})`); } };
['js/core.js', 'js/data.js', 'js/state.js', 'js/comic.js', 'js/story.js'].forEach(load);
const G = n => { try { return vm.runInContext(`typeof ${n}!=='undefined'?${n}:null`, ctx); } catch (e) { return null; } };
const die = m => { if (JSON_OUT) out(JSON.stringify({ issues: [m], notes: [] })); else console.log(m); process.exit(1); };
const STORY = G('STORY'); if (!STORY) die('Không đọc được STORY từ js/story.js');
const ROSTER = G('ROSTER') || {}, POOL = G('ENEMY_POOL') || [], SECTORS = G('SECTORS') || [];
const speakers = new Set([...Object.keys(ROSTER), ...POOL.map(e => e.id)]);
const secById = id => SECTORS.find(s => s.id === id);

/* ---- quy ước ---- */
/* Số ô và khổ ảnh lấy thẳng từ bảng LAYOUTS trong js/comic.js — bản gốc duy nhất. Trước đây chép tay ở đây,
   nên thêm `w3b` và `v3` hôm 11/09 xong lint báo oan "layout lạ" và in khổ '?' cho 9 panel đúng. */
const LAYOUTS = G('LAYOUTS'); if (!LAYOUTS) die('Không đọc được LAYOUTS từ js/comic.js');
const CELLS = Object.fromEntries(Object.entries(LAYOUTS).map(([k, v]) => [k, v.cells]));
const ratio = (layout, k) => { const L = LAYOUTS[layout]; if (!L) return '?'; return (L.wide === k && L.arWide) ? L.arWide : (L.ar || '?'); };   // khổ theo ô thật 375×812 (docs/comic-prompts.md §1)
const fname = (sid, kind, pg, pn) => `art/comic/${sid.toLowerCase().replace(/[^a-z0-9]/g, '')}_${kind === 'outro' ? 'o' : 'i'}${pg}_p${pn}.jpg`;
const words = t => String(t).replace(/…/g, ' ').trim().split(/\s+/).filter(Boolean).length;
const BANNED = ['bài ca', 'hát lạc điệu', 'bắt nhịp', 'thứ tự lệnh', 'deck', 'Operator', 'Free Zone', 'quận SIS', 'tầng âm bảy'];
const TERMS = ['Tháp', 'Khu Đáy', 'Canticle', 'Choir', 'Halo', 'Chromefall', 'Chrome', 'Scav', 'Ronin', 'Muzzle', 'Foreman', 'Psalm', 'Archon', 'Cantor', 'Mother Rust', 'Tầng Bốn', 'Đơn vị 07', 'lính máy', 'vòng', 'drone', 'Enforcer'];
const PRON = ['tôi', 'tao', 'mày', 'cô', 'cậu', 'bà', 'ông', 'chị', 'em', 'ta', 'con', 'ngươi', 'anh', 'mình', 'tụi tôi', 'tụi bay', 'họ', 'lão'];
const ART_ID = { 'art/card/yuki.jpg': 'yuki', 'art/card/ash.jpg': 'ash', 'art/card/kai.jpg': 'kai', 'art/card/psalm.jpg': 'psalm', 'art/card/ronin.jpg': 'ronin', 'art/card/muzzle.jpg': 'muzzle' };

/* ---- docs/comic-prompts.md ---- */
const doc = read('docs/comic-prompts.md'); const docMap = new Map();
// Tiền tố `art/comic/` là tuỳ chọn: bản viết lại 11/09 ghi tên trần (`07a_i1_p1.jpg`). Bắt cả hai kiểu rồi
// chuẩn hoá về đường dẫn đầy đủ, nếu không docMap rỗng và mọi panel đều bị báo oan "chưa có prompt".
for (const m of doc.matchAll(/^- `(?:art\/comic\/)?([^`\/]+\.jpg)` — (\S+) — (.+)$/gm)) docMap.set('art/comic/' + m[1], { ratio: m[2], text: m[3] });

/* ---- duyệt ---- */
const issues = [], notes = [], firstSeen = new Map(), pron = {}, seenFiles = new Set(), rows = [];
let totP = 0, totPn = 0, totB = 0;
for (const sid of Object.keys(STORY)) {
  for (const kind of ['intro', 'outro']) {
    const pages = STORY[sid][kind] || []; let pnl = 0, bub = 0, w = 0, sil = 0, fg = 0, art = 0;
    pages.forEach((pg, pi) => {
      totP++; const cells = CELLS[pg.layout];
      if (!cells) issues.push(`${sid} ${kind} tr${pi + 1}: layout lạ '${pg.layout}'`);
      else if (pg.panels.length !== cells) issues.push(`${sid} ${kind} tr${pi + 1}: layout ${pg.layout} có ${cells} ô nhưng ${pg.panels.length} panel (thừa bị cắt / thiếu để trống)`);
      pg.panels.slice(0, cells || 9).forEach((p, k) => {
        totPn++; pnl++; const f = fname(sid, kind, pi + 1, k + 1); seenFiles.add(f);
        const d = docMap.get(f), r = ratio(pg.layout, k);
        if (!d) issues.push(`${f}: chưa có prompt trong docs/comic-prompts.md`);
        else if (d.ratio !== r) issues.push(`${f}: khổ trong doc ${d.ratio} ≠ layout ${pg.layout} → ${r}`);
        if (!(p.img && p.img.length) && !p.sil) issues.push(`${f}: không có img fallback lẫn silhouette`);
        if (p.sil) sil++; if (p.fg) fg++;
        const artId = p.img && ART_ID[p.img[0]]; if (artId) art++;
        const bs = p.bubbles || []; bub += bs.length; totB += bs.length;
        if (bs.length > 3) issues.push(`${f}: ${bs.length} bong bóng trong một panel (đông)`);
        const ats = {}; bs.forEach(b => { const at = b.at || 'bl'; (ats[at] = ats[at] || []).push(b); });
        Object.entries(ats).filter(([, l]) => l.length > 1).forEach(([a, l]) => issues.push(`${f}: ${l.length} bong bóng cùng góc '${a}' → đè nhau`));
        // cùng dải trên/dưới → dễ đè nhau (bong bóng rộng tối đa 74% ô, caption 86%); đo chính xác bằng scratch/comic_measure.js
        const band = at => /^t/.test(at) ? 'trên' : /^b/.test(at) ? 'dưới' : 'giữa';
        ['trên', 'dưới'].forEach(bd => { const l = bs.filter(b => b.kind !== 'sfx' && band(b.at || 'bl') === bd);
          if (l.length >= 2) { const wide = l.some(b => b.at === 't' || b.at === 'b' || b.kind === 'caption'); const sum = l.reduce((s, b) => s + words(b.text), 0);
            if (wide || sum > 12) notes.push(`${f}: ${l.length} bong bóng cùng dải ${bd} (${l.map(b => b.at).join('+')}, ${sum} chữ) → dễ đè, đo bằng comic_measure.js`); } });
        // thứ tự đọc: bong bóng sau nằm ở dải trên bong bóng trước
        let prev = null; bs.filter(b => b.kind !== 'sfx').forEach(b => { const bd = band(b.at || 'bl'); if (prev === 'dưới' && bd === 'trên') notes.push(`${f}: thứ tự đọc ngược (bong bóng sau ở trên bong bóng trước)`); prev = bd; });
        const offPanel = bs.filter(b => b.who && b.kind !== 'caption' && b.kind !== 'sfx' && artId && b.who !== artId).map(b => b.who);
        if (offPanel.length) notes.push(`${f}: ảnh fallback là ${artId} nhưng có lời của ${[...new Set(offPanel)].join(', ')} (người nói ngoài khung)`);
        bs.forEach(b => {
          const n = words(b.text); w += n; const lim = b.kind === 'caption' ? 40 : (b.kind === 'sfx' ? 4 : 25);
          if (n > lim) issues.push(`${f}: ${b.kind}${b.who ? ' ' + b.who : ''} ${n} chữ > ${lim}: "${b.text}"`);
          if (b.who && !speakers.has(b.who)) issues.push(`${f}: người nói '${b.who}' không có trong ROSTER/ENEMY_POOL`);
          BANNED.forEach(x => { if (b.text.toLowerCase().includes(x.toLowerCase())) issues.push(`${f}: từ cấm "${x}": "${b.text}"`); });
          TERMS.forEach(t => { if (b.text.includes(t) && !firstSeen.has(t)) firstSeen.set(t, `${sid} ${kind} tr${pi + 1} p${k + 1} [${b.kind}${b.who ? ' ' + b.who : ''}]: "${b.text}"`); });
          if (b.who && b.kind !== 'caption') { const low = ' ' + b.text.toLowerCase().replace(/[.,!?:…]/g, ' ') + ' '; PRON.forEach(pr => { if (low.includes(' ' + pr + ' ')) (pron[b.who] = pron[b.who] || new Set()).add(pr); }); }
        });
      });
    });
    rows.push({ sid, kind, pages: pages.length, panels: pnl, bubbles: bub, words: w, sil, fg, art });
  }
}
for (const f of docMap.keys()) if (!seenFiles.has(f)) issues.push(`${f}: có trong doc nhưng không có panel tương ứng trong story.js`);
const have = [...seenFiles].filter(f => fs.existsSync(path.join(ROOT, f)));

/* ---- in ---- */
console.log('== TỔNG (panel: sil = silhouette địch, fg = sprite đè, art = key art nhân vật) ==');
rows.forEach(r => console.log(`  ${r.sid} ${r.kind.padEnd(5)}  ${r.pages} trang · ${String(r.panels).padStart(2)} panel · ${String(r.bubbles).padStart(2)} bong bóng · ${String(r.words).padStart(3)} chữ · sil ${r.sil} · fg ${r.fg} · art ${r.art}`));
console.log(`  Tổng: ${totP} trang · ${totPn} panel · ${totB} bong bóng · prompt trong doc: ${docMap.size} · ảnh riêng đã có trong art/comic/: ${have.length}/${totPn}`);
console.log(`  Người nói hợp lệ: ${speakers.size} id (ROSTER ${Object.keys(ROSTER).length}, ENEMY_POOL ${POOL.length})`);
console.log('\n== SECTOR THEO data.js (đối chiếu lời thoại đếm số / tên địch / nền) ==');
Object.keys(STORY).forEach(id => { const s = secById(id); if (!s) { console.log(`  ${id}: không có trong SECTORS`); return; }
  const plan = Array.isArray(s.plan) ? s.plan.map(wv => Array.isArray(wv) ? wv.join(',') : String(wv)).join('  →  ') : '(không có plan)';
  console.log(`  ${s.id} ${s.name}: waves ${s.waves} — ${plan}`);
  console.log(`      bg: ${JSON.stringify(s.bg)}${s.team ? ' · team ép: ' + s.team.join(',') : ''}${s.guest ? ' · guest: ' + s.guest.join(',') : ''}${s.unlock ? ' · unlock: ' + s.unlock : ''}${s.boss ? ' · boss: ' + s.boss : ''}`);
});
console.log('\n== LẦN XUẤT HIỆN ĐẦU CỦA THUẬT NGỮ (đọc theo thứ tự màn) ==');
TERMS.forEach(t => console.log(`  ${t.padEnd(11)} ${firstSeen.get(t) || '(không xuất hiện)'}`));
console.log('\n== ĐẠI TỪ THEO NGƯỜI NÓI ==');
Object.entries(pron).forEach(([k, v]) => console.log(`  ${k.padEnd(11)} ${[...v].join(', ')}`));
console.log(`\n== GHI CHÚ (${notes.length}) ==`);
notes.forEach(x => console.log('  - ' + x));
console.log(`\n== VẤN ĐỀ (${issues.length}) ==`);
issues.forEach(x => console.log('  - ' + x));

if (JSON_OUT) out(JSON.stringify({ issues, notes }));
process.exit(issues.length ? 1 : 0);   // ghi chú (notes) không làm đỏ, chỉ vấn đề
