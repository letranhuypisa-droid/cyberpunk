// Soát chiêu cuối: chữ có khớp cơ chế không — node scratch/ult_lint.js
// Cùng loại việc với scratch/comic_lint.js, nhưng cho ult: đọc mọi ult trong ROSTER và ENEMY_POOL,
// bóc con số trong `desc` rồi đối chiếu với số thật (mult, hits, cost, shieldPct, healPct, flat, drainEnergy).
//
// Vì sao cần: bản chiêu mộ dựng bằng `{...e.ult, ...RECRUIT_FIX[id].ult}` — vá `mult` mà quên `desc` thì
// chuỗi cũ đi theo nguyên vẹn, và người chơi đọc số sai ở hai chỗ (tab KỸ NĂNG ở ARCHIVE, dòng dưới nút
// chiêu cuối trong trận). Lỗi im lặng, không ai thấy cho tới khi có người cộng tay.
//
// Mã thoát 1 nếu có lỗi, để cắm vào lệnh kiểm trước khi đóng gói.
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');

const ctx = { console, Math, JSON, Object, Array, Set, Map, Number, String, Date, window:{},
              localStorage:undefined, rand:a=>a[Math.floor(Math.random()*a.length)] };
ctx.window = ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname,'..','js','data.js'),'utf8'), ctx, {filename:'data.js'});
const { ROSTER, ENEMY_POOL } = vm.runInContext('({ROSTER,ENEMY_POOL})', ctx);

const pcts = s => [...String(s||'').matchAll(/(\d+(?:[.,]\d+)?)\s*%/g)].map(m => +m[1].replace(',', '.'));
const nums = s => [...String(s||'').matchAll(/(?<![\d.,%])(\d+(?:[.,]\d+)?)(?!\s*%)/g)].map(m => +m[1].replace(',', '.'));

const problems = [];
function check(where, id, def) {
  const u = def.ult; if (!u) return;
  const tag = `${where} · ${id} · ${u.name}`;
  if (!u.desc) { problems.push([tag, 'không có desc']); return; }
  const inPct = pcts(u.desc), inNum = nums(u.desc);

  // % phải nhắc tới: hệ số sát thương, % lá chắn, % hồi máu
  const want = [];
  if (u.mult != null && !u.flat) want.push(['hệ số sát thương', Math.round(u.mult * 100)]);
  if (u.shieldPct != null) want.push(['lá chắn', Math.round(u.shieldPct * 100)]);
  if (u.healPct != null) want.push(['hồi máu', Math.round(u.healPct * 100)]);
  for (const [what, v] of want) {
    if (!inPct.includes(v)) {
      problems.push([tag, `${what} thật ${v}% — trong desc chỉ thấy ${inPct.length ? inPct.map(x=>x+'%').join(', ') : 'không có số %'}`]);
    }
  }
  // số nguyên phải nhắc tới: sát thương cố định, số nhịp, Energy bị rút
  if (u.flat != null && !inNum.includes(u.flat)) problems.push([tag, `sát thương cố định thật ${u.flat} — desc không nhắc`]);
  if (u.hits > 1 && !/hai|ba|bốn|\b2\b|\b3\b/i.test(u.desc)) problems.push([tag, `đánh ${u.hits} nhịp — desc không nói`]);
  if (typeof u.drainEnergy === 'number' && !inNum.includes(u.drainEnergy)) problems.push([tag, `rút ${u.drainEnergy} Energy — desc không nhắc đúng số`]);

  // hướng câu: chiêu của địch nói "trong đội / bên nó" là nói về phía bên kia.
  // Bản chiêu mộ đứng phe người chơi nên hai cụm đó đổi nghĩa, phải viết lại.
  if (def.recruit) {
    /* KHÔNG dùng \b ở đây. \b của JS dựa trên [A-Za-z0-9_], nên "đ" và "ó" không phải ký tự từ:
       /\bđồng bọn\b/ không bao giờ khớp, và /\bbên nó\b/ hỏng ở đầu kia. Lint im lặng bỏ sót còn
       tệ hơn không có lint. Dùng so khớp chuỗi thường trên bản đã hạ chữ thường. */
    const d = u.desc.toLowerCase();
    for (const [cum, why] of [['trong đội', '"trong đội" — bản địch nói về đội người chơi, bản chiêu mộ phải là "kẻ địch"'],
                              ['đội bạn',   '"đội bạn" — bản địch gọi đội người chơi, bản chiêu mộ phải là "kẻ địch"'],
                              ['bên nó',    '"bên nó" — bản chiêu mộ phải là "đồng đội"'],
                              ['đồng bọn',  '"đồng bọn" — bản chiêu mộ phải là "đồng đội"']]) {
      if (d.includes(cum)) problems.push([tag, why]);
    }
    if (u.target === 'lowest' && !/không chọn được mục tiêu/i.test(u.desc)) {
      problems.push([tag, "target:'lowest' bỏ luôn bước chọn mục tiêu — desc phải nói 'không chọn được mục tiêu'"]);
    }
  }
}

/* Thanh Energy phải đầy đúng bằng giá chiêu cuối. Lệch thì bar vẽ sai số vạch và nút chiêu sáng lên
   giữa chừng — không lỗi, không ai thấy, phải soát tay mới ra (đã dính hai lần: welder rồi rigger).
   Bên địch có một ngoại lệ CỐ Ý: THỢ HÀN cost 50 (dò sim: ở 75 hắn chết trước khi kịp vá một lần). */
const BAR_EXEMPT = { welder:'ĐỊCH' };
function checkBar(where, id, def) {
  if (!def.ult || def.energyMax == null) return;
  if (BAR_EXEMPT[id] === where) return;
  if (def.energyMax !== def.ult.cost) {
    problems.push([`${where} · ${id} · ${def.ult.name}`,
      `energyMax ${def.energyMax} ≠ ult.cost ${def.ult.cost} — thanh vẽ ${Math.round(def.energyMax/25)} vạch mà chiêu bật ở vạch ${Math.round(def.ult.cost/25)}`]);
  }
}

Object.values(ROSTER).forEach(d => { const w = d.recruit ? 'CHIÊU MỘ' : 'NHÂN VẬT'; check(w, d.id, d); checkBar(w, d.id, d); });
ENEMY_POOL.forEach(e => { if (e.ult) { check('ĐỊCH', e.id, e); checkBar('ĐỊCH', e.id, e); } });

/* Bản chiêu mộ và bản địch của cùng một con: desc PHẢI khác nhau nếu số khác nhau */
Object.values(ROSTER).filter(d => d.recruit && d.ult).forEach(d => {
  const e = ENEMY_POOL.find(x => x.id === d.id); if (!e || !e.ult) return;
  const soKhac = ['mult','shieldPct','healPct','flat','hits','cost','drainEnergy'].some(k => d.ult[k] !== e.ult[k]);
  if (soKhac && d.ult.desc === e.ult.desc) {
    problems.push([`CHIÊU MỘ · ${d.id} · ${d.ult.name}`, 'số khác bản địch nhưng desc y hệt — thiếu desc trong RECRUIT_FIX']);
  }
});

const nUlt = Object.values(ROSTER).filter(d => d.ult).length + ENEMY_POOL.filter(e => e.ult).length;

/* --json: chỉ in {issues} cho scratch/check.js, mỗi vấn đề gộp thành một dòng để so với bản nền. */
if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ issues: problems.map(([tag, msg]) => `${tag} — ${msg}`), notes: [] }));
  process.exit(problems.length ? 1 : 0);
}
if (!problems.length) {
  console.log(`\n${nUlt} chiêu cuối: chữ khớp cơ chế, không có vấn đề.\n`);
  process.exit(0);
}
console.log(`\n${problems.length} vấn đề trên ${nUlt} chiêu cuối:\n`);
for (const [tag, msg] of problems) console.log(`  ${tag}\n      ${msg}`);
console.log('');
process.exit(1);
