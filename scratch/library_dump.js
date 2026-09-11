'use strict';
/* library_dump.js — in phần C (hồ sơ nhân vật) và D1 (sổ bộ kẻ địch) của docs/library.md ra từ js/data.js.
   Vì sao: chữ hồ sơ giờ nằm trong game (LORE / ROSTER / CODEX). Chép tay sang tài liệu là kiểu gì cũng lệch.
   Sửa chữ ở js/data.js rồi chạy:  node scratch/library_dump.js
   Script chỉ ghi đè phần nằm giữa hai mốc <!-- AUTO:C --> và <!-- AUTO:D1 -->; thiếu mốc thì nó dừng, không sửa gì.
   Luật của tài liệu: KHÔNG in con số cân bằng — chỉ in chữ hình ảnh (weapon/attack/ultFlavor) và điều kiện nội tại. */

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

/* Nạp js/data.js trong một hàm kín, chỉ cần giả lập localStorage */
const src = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
const shim = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
const D = new Function('localStorage', src + '\n;return {ROSTER,LORE,CODEX,ENEMY_POOL,SECTORS,BANNERS,PLAYER_DEFAULTS,STORY_ONLY};')(shim);
const { ROSTER, LORE, CODEX, ENEMY_POOL, SECTORS, BANNERS, PLAYER_DEFAULTS } = D;

const md = s => String(s || '').replace(/<br><br>/g, '\n\n').replace(/<br>/g, '  \n');
const foeName = id => (ENEMY_POOL.find(e => e.id === id) || { name: id }).name;
const heroName = id => (ROSTER[id] || { name: id }).name;

/* Cách sở hữu: có sẵn trong hồ sơ mặc định · thưởng cốt truyện (SECTORS[].unlock) · gacha.
   Từ 11/09 gacha khoá theo chương và tách hai bể: REQUISITION (nhân vật, SH) và CHIÊU MỘ (kẻ địch, CR). */
const START = PLAYER_DEFAULTS().owned;
function ownText(id) {
  if (START.includes(id)) return 'sở hữu từ đầu';
  const s = SECTORS.find(x => x.unlock === id);
  if (s) return `thưởng khi xong ${s.id} · ${s.name}`;
  const d = ROSTER[id] || {};
  if (d.debut == null) return 'gacha · chưa xếp chương, còn khoá';
  const b = d.recruit ? BANNERS.crew : BANNERS.hero;
  const feat = b.featured === id ? ' · đang tăng tỉ lệ' : '';
  const where = d.recruit ? 'chiêu mộ · trả CR' : 'gacha · trả SH';
  return d.debut > 1 ? `${where} · mở ở chương ${d.debut}` : where + feat;
}
/* Điều kiện bật nội tại, nói bằng lời, không có số */
function condText(w) {
  if (!w) return 'luôn bật';
  if (w.ally) return `cùng đội · ${heroName(w.ally)}`;
  if (w.allyAny) return `cùng đội · ${w.allyAny.map(heroName).join(' hoặc ')}`;
  if (w.enemy) return `màn có ${foeName(w.enemy)}`;
  if (w.enemyFaction) return `màn có địch phe ${w.enemyFaction.toUpperCase()}`;
  return 'luôn bật';
}

/* ---- C. NHÂN VẬT ---- */
function sectionC() {
  const out = [];
  Object.keys(LORE).forEach((id, i) => {
    const d = ROSTER[id], L = LORE[id];
    if (!d) return;
    out.push(`## C${i + 1} · ${d.name} — ${L.epithet || ''} ✦`);
    out.push(`*Phe ${d.faction === 'rust' ? 'Rust' : 'Chrome'} · Tier ${d.tier} · ${ownText(id)}*`);
    out.push('');
    if (L.voice) out.push(`> ${L.voice}`, '');
    if (L.past) out.push(`**${(L.labels || {}).past || 'Chuyện đã xảy ra'}.** ${md(L.past)}`, '');
    if (L.now) out.push(`**${(L.labels || {}).now || 'Bây giờ'}.** ${md(L.now)}`, '');
    if (L.weapon) out.push(`**Vũ khí.** ${L.weapon}`, '');
    if (L.attack) out.push(`**Đòn thường.** ${L.attack}`, '');
    if (L.ultFlavor) out.push(`**Chiêu cuối — ${d.ult.name}.** ${L.ultFlavor}`, '');
    const ps = d.passives || [];
    if (ps.length) {
      out.push('**Bản năng chiến đấu**', '');
      out.push('| Tên | Bật khi | Hiệu lực |', '|---|---|---|');
      ps.forEach(p => out.push(`| ${p.name} | ${condText(p.when)} | ${p.desc || ''} |`));
      out.push('');
    }
    out.push('---', '');
  });
  return out.join('\n');
}

/* ---- D1. SỔ BỘ ---- */
function sectionD1() {
  const g = CODEX.find(x => x.key === 'foe');
  if (!g) return '_(chưa có nhóm foe trong CODEX)_';
  /* Trùm = rank 'boss' trong ENEMY_POOL, KHÔNG phải "có ult" — Kiln và Glass Jaw cũng có chiêu cuối mà vẫn là lính. */
  const rankOf = it => ((ENEMY_POOL.find(e => e.id === it.foe) || {}).rank || 'grunt');
  const rankVi = r => (r === 'elite' ? 'Tinh nhuệ' : r === 'boss' ? 'Boss' : 'Lính thường');
  const NUM = ['Không', 'Một', 'Hai', 'Ba', 'Bốn', 'Năm', 'Sáu', 'Bảy', 'Tám', 'Chín', 'Mười'];
  const bosses = g.items.filter(it => rankOf(it) === 'boss');
  const rest = g.items.filter(it => rankOf(it) !== 'boss');
  const out = [];
  const entry = it => {
    out.push(`**${it.name}${it.sub ? ' — ' + it.sub : ''}** ✦ · *${it.where || rankVi(rankOf(it))} · phe ${it.faction === 'rust' ? 'Rust' : 'Chrome'}*`, '');
    if (it.voice) out.push(`> ${it.voice}`, '');
    out.push(md(it.text), '');
    if (it.spot) out.push(`*Nhận diện:* ${it.spot}`, '');
    if (it.ult) out.push(`*Tuyệt kỹ — ${it.ult.name}:* ${it.ult.desc}`, '');
  };
  out.push(`### ${NUM[bosses.length] || bosses.length} thống lĩnh chiến dịch`, '');
  bosses.forEach(entry);
  out.push('### Quân đội & thực thể chiến trường', '');
  rest.forEach(entry);
  const missing = ENEMY_POOL.filter(e => ['grunt', 'elite', 'boss'].includes(e.rank))
    .filter(e => !g.items.some(it => it.foe === e.id))
    .filter(e => SECTORS.some(s => (s.plan || []).flat().includes(e.id)) || SECTORS.some(s => s.boss === e.id))
    .map(e => e.name);
  if (missing.length) out.push(`> **Chương 1 còn ${missing.length} con chưa có chữ trong sổ bộ:** ${missing.join(' · ')}.`, '');
  return out.join('\n');
}

/* ---- Ghi vào docs/library.md giữa hai mốc ---- */
const DOC = path.join(ROOT, 'docs/library.md');
let doc = fs.readFileSync(DOC, 'utf8');
let wrote = 0;
[['C', sectionC()], ['D1', sectionD1()]].forEach(([key, body]) => {
  const re = new RegExp(`(<!-- AUTO:${key}:BEGIN[^>]*-->)[\\s\\S]*?(<!-- AUTO:${key}:END -->)`);
  if (!re.test(doc)) { console.error(`! Không thấy mốc AUTO:${key} trong docs/library.md — bỏ qua.`); return; }
  doc = doc.replace(re, `$1\n\n${body}\n$2`);
  wrote++;
});
if (!wrote) { console.error('Không ghi gì cả.'); process.exit(1); }
fs.writeFileSync(DOC, doc);
console.log(`docs/library.md: đã in lại ${wrote} phần · ${Object.keys(LORE).length} hồ sơ · ${(CODEX.find(x => x.key === 'foe') || { items: [] }).items.length} mục sổ bộ.`);
