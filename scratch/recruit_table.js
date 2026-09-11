// Dò bảng quy đổi kẻ địch → đơn vị chơi được: node scratch/recruit_table.js
// Nạp js/data.js thật (chỉ đọc, không ghi gì), áp RECRUIT_BAND + RECRUIT_FIX rồi in chỉ số sau quy đổi
// cạnh băng chỉ số của nhân vật cùng bậc, để thấy ngay con nào rơi ra ngoài băng.
// Sửa BAND/FIX ở ngay dưới rồi chạy lại — chốt số xong mới chép vào js/data.js.
//   node scratch/recruit_table.js          → bảng đầy đủ
//   node scratch/recruit_table.js --bad    → chỉ in con lệch băng
'use strict';
const fs=require('fs'), path=require('path'), vm=require('vm');

const ctx={ console, Math, JSON, Object, Array, Set, Map, Number, String, Date, window:{},
            localStorage:undefined, rand:a=>a[Math.floor(Math.random()*a.length)] };
ctx.window=ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname,'..','js','data.js'),'utf8'), ctx, {filename:'data.js'});
const { ROSTER, ENEMY_POOL, SECTORS } = vm.runInContext('({ROSTER,ENEMY_POOL,SECTORS})', ctx);

/* ---- Bể chiêu mộ = mọi kẻ địch có mặt trong màn chơi chương 1, trừ RECRUIT_SKIP ---- */
const RECRUIT_SKIP = ['cantor'];                       // trùm cuối chương 1, còn sống sang ch.2–3
const ch1 = [...new Set(SECTORS.flatMap(s=>(s.plan||[]).flat()))].filter(id=>!RECRUIT_SKIP.includes(id));

/* ---- Băng quy đổi theo rank. Địch được cân để ĐỨNG BÊN KIA sân (lính máu mỏng, boss máu dày);
       kéo về băng của đội mình thì lính phải dày lên, boss phải mỏng đi rất nhiều. ---- */
const BAND = { grunt:{tier:'B', atk:1.15, hp:1.9,  en:75},
               elite:{tier:'A', atk:1.15, hp:.82,  en:100},
               boss: {tier:'S', atk:.95,  hp:.34,  en:125} };
/* ---- Chỉnh tay cho con rơi ra ngoài băng ----
   bulwark   ATK 48 là khiên thuần. Để bậc A thì 78 ATK thua cả Tin Man bậc B → hạ xuống B, đổi lại HP cao nhất bể.
   rigger    trùm yếu nhất chương (ATK 92); để bậc S thì thua mọi S khác → bậc A.
   gutterrat con yếu nhất bể, quy đổi thẳng ra 988 HP thì kém mọi mặt → kéo HP lên đáy băng B, giữ SPD cao làm nét riêng.
   welder    PATCH JOB hồi 30% HP tối đa mỗi 2 lượt là quá rẻ khi về tay người chơi (phe địch chết trước khi kịp dùng,
             đội mình thì không) → cost 50 → 75.
   glassjaw  HP 912 dưới băng B là CHỦ Ý: 101 ATK · 118 SPD · 25% chí mạng — bình thuỷ tinh, đánh đổi bằng máu.
   archon    FORCED RECALL rút Energy: bên địch thì đau, nhưng bên mình thì phần lớn kẻ địch không có thanh Energy
             → chiêu thành 150% ATK suông, quá yếu cho bậc S. Bản chiêu mộ nâng mult (KHÔNG đụng bản boss ở 07-C). ---- */
const FIX = { bulwark:{tier:'B', atk:78, hp:1600, en:75},
              rigger:{tier:'A', atk:118, hp:1150, en:100},
              gutterrat:{hp:1150},
              welder:{en:75},
              archon:{ultMult:2.6} };
const OK_OUT = ['glassjaw'];                           // cố tình lệch băng, đừng báo

function convert(e){
  const b=BAND[e.rank], f=FIX[e.id]||{};
  return { id:e.id, name:e.name, rank:e.rank, faction:e.faction,
           tier: f.tier||b.tier,
           atk:  f.atk!=null ? f.atk : Math.round(e.atk*b.atk),
           hp:   f.hp !=null ? f.hp  : Math.round(e.hp *b.hp),
           en:   f.en !=null ? f.en  : (e.ult ? e.ult.cost : b.en),
           spd:e.spd, crit:e.crit,
           ult: e.ult ? e.ult.name + (f.ultMult ? ` (mult ${e.ult.mult}→${f.ultMult})` : '') : null,
           src:e };
}

/* ---- Băng chỉ số của nhân vật theo bậc, để so ---- */
const heroes=Object.values(ROSTER);
const band={};
for(const t of ['S','A','B']){
  const g=heroes.filter(h=>h.tier===t);
  band[t]={ atk:[Math.min(...g.map(h=>h.atk)), Math.max(...g.map(h=>h.atk))],
            hp: [Math.min(...g.map(h=>h.hp)),  Math.max(...g.map(h=>h.hp))], n:g.length };
}
const within=(v,[lo,hi],slack=.15)=> v>=lo*(1-slack) && v<=hi*(1+slack);

const rows=ch1.map(id=>convert(ENEMY_POOL.find(e=>e.id===id)))
              .sort((a,b)=>'SAB'.indexOf(a.tier)-'SAB'.indexOf(b.tier) || b.atk-a.atk);
const onlyBad=process.argv.includes('--bad');

console.log(`\nBĂNG CHỈ SỐ NHÂN VẬT (để so, ±15% vẫn tính là đạt)`);
for(const t of ['S','A','B']) console.log(`  ${t} (${band[t].n} người)  ATK ${band[t].atk[0]}–${band[t].atk[1]}   HP ${band[t].hp[0]}–${band[t].hp[1]}`);
console.log(`\nBỂ CHIÊU MỘ — ${rows.length} con (bỏ: ${RECRUIT_SKIP.join(', ')||'không'})`);
console.log('  ' + ['ID','BẬC','RANK','ATK gốc→mới','HP gốc→mới','EN','SPD','CRIT','ULT'].join(' | '));

let bad=0;
for(const r of rows){
  const free=OK_OUT.includes(r.id);
  const okA=free||within(r.atk, band[r.tier].atk), okH=free||within(r.hp, band[r.tier].hp);
  if(!okA||!okH) bad++;
  if(onlyBad && okA && okH) continue;
  const mark = (okA&&okH) ? '  ' : '!!';
  console.log(`${mark}${r.id.padEnd(12)} ${r.tier}  ${r.rank.padEnd(5)}  ` +
    `${String(r.src.atk).padStart(4)}→${String(r.atk).padStart(4)}${okA?' ':'*'}  ` +
    `${String(r.src.hp).padStart(4)}→${String(r.hp).padStart(5)}${okH?' ':'*'}  ` +
    `${String(r.en).padStart(3)}  ${String(r.spd).padStart(3)}  ${String(r.crit).padStart(2)}%  ` +
    (r.ult||'— CẦN VIẾT CHIÊU'));
}

const noUlt=rows.filter(r=>!r.ult);
console.log(`\n${rows.length-noUlt.length}/${rows.length} con đã có chiêu cuối. Còn phải viết ${noUlt.length}:`);
console.log('  ' + noUlt.map(r=>r.id).join(', '));
console.log(`${bad} con lệch băng (* = chỉ số lệch) — chỉnh BAND/FIX ở đầu file rồi chạy lại.\n`);
