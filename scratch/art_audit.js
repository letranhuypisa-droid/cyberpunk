/* art_audit.js — kiểm kê art/animation còn thiếu cho chương 1.
   Chạy: node scratch/art_audit.js
   Nạp js/data.js + js/story.js trong sandbox (stub các hàm của app), rồi đối chiếu với file thật trên đĩa. */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

/* --json: nuốt bảng kiểm kê, chỉ in {issues} — mỗi thứ còn thiếu một dòng — cho scratch/check.js.
   Đặt trước sandbox vì sandbox dùng chung đúng object console này. Chương 1 vốn còn thiếu art thật, nên
   script này luôn đỏ; check.js so với bản nền để chỉ báo khi có cái MỚI mất (xoá nhầm, đổi tên file). */
const JSON_OUT = process.argv.includes('--json');
const out = console.log.bind(console);
if (JSON_OUT) console.log = () => {};
const MISSING = [];

const sandbox = {
  console, Math, Date, JSON, Object, Array, String, Number, Boolean,
  localStorage: { getItem: () => null, setItem: () => {} },
  document: { querySelector: () => null, querySelectorAll: () => [], getElementById: () => null, createElement: () => ({ style: {}, classList: { add(){}, remove(){} } }) },
  window: {},
};
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
for (const f of ['js/data.js', 'js/story.js']) {
  try { vm.runInContext(read(f).replace(/^'use strict';/, ''), sandbox, { filename: f }); }
  catch (e) { console.error('!! lỗi nạp ' + f + ': ' + e.message); }
}
/* const/let khai báo trong vm nằm ở scope từ vựng, không thành thuộc tính của sandbox → bê ra tay */
vm.runInContext('globalThis.__d = {ROSTER, ENEMY_POOL, SECTORS, CHAPTERS, STORY_ONLY, STORY, MAP_IMG, FOE_ART, HERO_SPRITE, FOE_SPRITE};', sandbox);
const { ROSTER, ENEMY_POOL, SECTORS, CHAPTERS, STORY_ONLY, STORY } = sandbox.__d;
sandbox.MAP_IMG = sandbox.__d.MAP_IMG;

const exists = rel => fs.existsSync(path.join(ROOT, rel));
const has = list => Array.isArray(list) ? list.flat(3).some(exists) : (list ? exists(list) : false);   // ultVideo của Yuki là list-of-list

/* ---- ai xuất hiện ở chương 0+1 ---- */
const ch1 = CHAPTERS.filter(c => c.n <= 1).flatMap(c => c.sectors);
const secs = SECTORS.filter(s => ch1.includes(s.id));

const foesInCh1 = new Set();
secs.forEach(s => {
  (s.plan || []).forEach(w => w.forEach(id => foesInCh1.add(id)));
  if (s.boss) foesInCh1.add(s.boss);
});

const heroesInCh1 = new Set();                       // ép đội / khách / mở khoá
secs.forEach(s => [...(s.team || []), ...(s.guest || []), ...(s.guestSwap || [])].forEach(id => heroesInCh1.add(id)));
secs.forEach(s => { if (s.unlock) heroesInCh1.add(s.unlock); });
['yuki', 'ash', 'kai'].forEach(id => heroesInCh1.add(id));   // đội mặc định chương 1

// Bỏ kẻ địch chiêu mộ (c.recruit): chúng dùng chung ảnh với bản địch, đã được kiểm ở mục địch bên dưới
const gachaable = Object.values(ROSTER).filter(c => !STORY_ONLY.includes(c.id) && !c.recruit).map(c => c.id);

const speakers = new Set();                          // người nói trong comic
const walk = v => {
  if (Array.isArray(v)) return v.forEach(walk);
  if (v && typeof v === 'object') { if (typeof v.who === 'string') speakers.add(v.who); Object.values(v).forEach(walk); }
};
ch1.forEach(id => walk(STORY && STORY[id]));

/* ---- kiểm kê một nhân vật ---- */
const POSES = ['idle', 'attack', 'crit', 'hurt', 'die'];
function audit(def, id) {
  const s = (def && def.sprites) || {};
  const poses = POSES.filter(p => has(s[p] || ['art/sprite/' + id + '_' + p + '.png']));
  return {
    id,
    name: (def && def.name) || id,
    card: exists('art/card/' + id + '.jpg'),
    portrait: has((def && def.portrait) || ['art/card/' + id + '_portrait.jpg']),
    poses,
    ult: has((def && def.ultVideo) || []) || (def && def.ultVideo ? false : null),
    ultDeclared: !!(def && def.ultVideo),
    reveal: has((def && def.reveal) || ['art/reveal/' + id + '_reveal.jpg']),
  };
}
const mark = b => b ? '✓' : '✗';
const line = a => [
  a.id.padEnd(12), (a.name || '').padEnd(14),
  'thẻ ' + mark(a.card), 'chân dung ' + mark(a.portrait),
  'sprite[' + (a.poses.length ? a.poses.join(',') : 'KHÔNG') + ']',
  a.ultDeclared ? 'ult-video ' + mark(a.ult) : 'ult-video —',
].join('  ');

function record(a) {
  if (!a.card) MISSING.push(`${a.id}: thiếu thẻ art/card/${a.id}.png`);
  if (!a.portrait) MISSING.push(`${a.id}: thiếu chân dung`);
  const thieu = POSES.filter(p => !a.poses.includes(p));
  if (thieu.length) MISSING.push(`${a.id}: thiếu sprite ${thieu.join(',')}`);
  if (a.ultDeclared && !a.ult) MISSING.push(`${a.id}: khai ultVideo nhưng không có file`);
}
function section(title, ids, defOf) {
  console.log('\n=== ' + title + ' ===');
  [...ids].sort().forEach(id => { const a = audit(defOf(id), id); console.log(line(a)); record(a); });
}
const heroDef = id => ROSTER[id];
const foeDef = id => ENEMY_POOL.find(e => e.id === id);
const anyDef = id => ROSTER[id] || foeDef(id);

section('NHÂN VẬT CHÍNH TUYẾN CHƯƠNG 1', heroesInCh1, heroDef);
section('NHÂN VẬT GACHA (có thể ra trận ở chương 1)', gachaable.filter(id => !heroesInCh1.has(id)), heroDef);
section('KẺ ĐỊCH TRONG CÁC MÀN CHƯƠNG 0-1', foesInCh1, foeDef);
section('NGƯỜI NÓI TRONG COMIC CHƯƠNG 0-1', [...speakers].filter(id => !heroesInCh1.has(id) && !foesInCh1.has(id)), anyDef);

/* ---- nền + bản đồ ---- */
console.log('\n=== NỀN / BẢN ĐỒ ===');
secs.forEach(s => { console.log(s.id.padEnd(6) + ' bg ' + mark(has(s.bg)) + '  (' + (s.bg || []).join(', ') + ')');
  if (!has(s.bg)) MISSING.push(`${s.id}: thiếu nền (${(s.bg || []).join(', ') || 'không khai bg'})`); });
console.log('map    ' + mark(has(sandbox.MAP_IMG)) + '  (' + (sandbox.MAP_IMG || []).join(', ') + ')');
if (!has(sandbox.MAP_IMG)) MISSING.push('map: thiếu ảnh bản đồ');

/* ---- bản đồ Khu Đáy + 9 ảnh bãi (DẸP LOẠN, docs/dep-loan.md §H) ----
   Nạp js/riot.js riêng ở đây: nó chỉ khai báo hằng số + hàm nên chạy được mà không cần state.js/app.js. */
try { vm.runInContext(read('js/riot.js').replace(/^'use strict';/, ''), sandbox, { filename: 'js/riot.js' }); }
catch (e) { console.error('!! lỗi nạp js/riot.js: ' + e.message); }
vm.runInContext('globalThis.__r = typeof RIOT_YARDS !== "undefined" ? { RIOT_YARDS, RIOT_MAP_IMG, yardBg } : null;', sandbox);
const riot = sandbox.__r;
if (riot) {
  console.log('\n=== DẸP LOẠN (bản đồ Khu Đáy + 9 bãi) ===');
  console.log('map D07  ' + mark(has(riot.RIOT_MAP_IMG)) + '  (' + riot.RIOT_MAP_IMG.join(', ') + ')');
  riot.RIOT_YARDS.forEach(y => {
    const list = riot.yardBg(y), own = exists(list[0]);
    console.log(y.id.padEnd(8) + y.name.padEnd(16) + 'ảnh bãi ' + mark(own) +
      (own ? '  (' + list[0] + ')' : '  → mượn tạm ' + list[1]));
  });
}

/* ---- panel comic ---- */
const comicFiles = fs.existsSync(path.join(ROOT, 'art/comic')) ? fs.readdirSync(path.join(ROOT, 'art/comic')) : [];
let panels = 0, pages = 0;
ch1.forEach(id => { const st = STORY && STORY[id]; if (!st) return;
  Object.values(st).forEach(part => { if (!Array.isArray(part)) return; part.forEach(pg => { pages++; panels += (pg.panels || pg || []).length || 0; }); }); });
console.log('\n=== COMIC ===');
console.log('trang (ước tính): ' + pages + '  ·  panel: ' + panels + '  ·  file trong art/comic: ' + comicFiles.length);

if (JSON_OUT) {
  const issues = [...new Set(MISSING)];   // một id có thể vào hai mục (vừa là địch vừa chiêu mộ được)
  out(JSON.stringify({ issues, notes: [] }));
  process.exit(issues.length ? 1 : 0);
}
