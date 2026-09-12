// Bảng kinh tế DẸP LOẠN: thu nhập mỗi giờ, thời gian đầy trần, giá nâng bãi và thời gian hồi vốn.
//   node scratch/riot_econ.js            → đồn trú vừa đủ ngưỡng (hệ số quân 1.0), không tính ưu thế phe
//   node scratch/riot_econ.js 1.5 1.15   → hệ số quân 1.5 (kịch trần) và ưu thế phe đầy đủ
// Đọc thẳng js/riot.js nên số ở đây không bao giờ lệch với số trong game.
'use strict';
const fs=require('fs'), path=require('path'), vm=require('vm');
const FILL=+process.argv[2]||1, FAV=+process.argv[3]||1;

const ctx={console,Math,JSON,Object,Array,Set,Map,Number,String,Date,window:{},localStorage:undefined,rand:a=>a[0]};
ctx.window=ctx; vm.createContext(ctx);
['data.js','state.js','riot.js'].forEach(f=>vm.runInContext(fs.readFileSync(path.join(__dirname,'..','js',f),'utf8'),ctx,{filename:f}));
const { RIOT_YARDS, RIOT_ECON, RIOT_WEEK, UPGRADE } = vm.runInContext('({RIOT_YARDS,RIOT_ECON,RIOT_WEEK,UPGRADE})', ctx);

const E=RIOT_ECON, perH=60/E.cycleMin;
const hrs = m => { const h=Math.floor(m/60), mm=Math.round(m%60); return mm?`${h}h${String(mm).padStart(2,'0')}`:`${h}h`; };
const pad = (s,n) => String(s).padEnd(n);
const pn  = (s,n) => String(s).padStart(n);

console.log(`DẸP LOẠN · kinh tế · chu kỳ ${E.cycleMin} phút · hệ số quân ${FILL} · ưu thế phe ${FAV}\n`);
console.log(`${pad('bãi',9)} ${pn('vòng',4)} ${pn('ngưỡng',7)} ${pn('CR/kiện',8)} ${pn('SH/kiện',8)} ${pn('CR/giờ',7)} ${pn('SH/giờ',7)} ${pn('trần',5)} ${pn('đầy sau',8)}`);
let tc=0, ts=0;
const ring={};
for(const y of RIOT_YARDS){
  const cr=Math.round(y.cr*FILL*FAV), sh=Math.round(y.sh*FILL);
  const cap=E.capBase;
  tc+=cr*perH; ts+=sh*perH;
  ring[y.ring]=ring[y.ring]||{cr:0,sh:0}; ring[y.ring].cr+=cr*perH; ring[y.ring].sh+=sh*perH;
  console.log(`${pad(y.id,9)} ${pn(y.ring,4)} ${pn(y.hold,7)} ${pn(cr,8)} ${pn(sh,8)} ${pn(Math.round(cr*perH),7)} ${pn((sh*perH).toFixed(1),7)} ${pn(cap,5)} ${pn(hrs(cap*E.cycleMin),8)}`);
}
console.log('');
[1,2,3].forEach(r=>console.log(`vòng ${r}: ${Math.round(ring[r].cr)} CR/giờ · ${ring[r].sh.toFixed(1)} SH/giờ`));
console.log(`TỔNG 9 bãi bậc 1: ${Math.round(tc)} CR/giờ · ${ts.toFixed(1)} SH/giờ`);

/* Hiệu suất thật: trần chặn lại giữa hai lần vào game. Nhận n lần/ngày, cách đều nhau. */
console.log('\nHiệu suất theo số lần vào game mỗi ngày (bậc 1, trần '+E.capBase+' kiện = '+hrs(E.capBase*E.cycleMin)+'):');
[2,3,4,6].forEach(n=>{
  const gapMin=24*60/n, eff=Math.min(1, E.capBase*E.cycleMin/gapMin);
  console.log(`  ${n} lần/ngày (cách ${hrs(gapMin)}): hiệu suất ${Math.round(eff*100)}% → ${Math.round(tc*24*eff)} CR + ${Math.round(ts*24*eff)} SH mỗi ngày`);
});
const weekSh=RIOT_WEEK.reduce((a,t)=>a+t.reward,0);
console.log(`  hợp đồng tuần cộng thêm ${weekSh} SH/tuần (${(weekSh/7).toFixed(0)} SH/ngày)`);

console.log('\nNâng bãi — giá và thời gian hồi vốn (tính ở hiệu suất 75%):');
console.log(`${pad('bãi',9)} ${pn('b1→2',8)} ${pn('b2→3',8)} ${pn('b3→4',8)} ${pn('b4→5',8)} ${pn('tổng',9)} ${pn('hồi vốn b1→2',13)}`);
let allUp=0;
for(const y of RIOT_YARDS){
  const cost=E.lvCostK.map(k=>Math.round(y.cr*k)); const sum=cost.reduce((a,b)=>a+b,0); allUp+=sum;
  const gainH=y.cr*FILL*FAV*(E.lvYield[1]-E.lvYield[0])*perH*.75;       // CR thêm mỗi giờ sau khi lên bậc 2
  const days=gainH>0 ? cost[0]/(gainH*24) : 0;
  console.log(`${pad(y.id,9)} ${pn(cost[0],8)} ${pn(cost[1],8)} ${pn(cost[2],8)} ${pn(cost[3],8)} ${pn(sum,9)} ${pn(days.toFixed(1)+' ngày',13)}`);
}
console.log(`Nâng cả 9 bãi lên bậc 5: ${allUp.toLocaleString('en-US')} CR`);

console.log('\nĐối chiếu chỗ tiêu:');
console.log(`  chiêu mộ ×10 (kẻ địch)      5 400 CR`);
console.log(`  Requisition ×10 (nhân vật)    270 SH`);
let lvCost=0; for(let l=1;l<UPGRADE.maxLevel;l++) lvCost+=UPGRADE.cost(l);
console.log(`  nâng một nhân vật 1 → ${UPGRADE.maxLevel}     ${lvCost.toLocaleString('en-US')} CR`);
const day=tc*24*.75;
console.log(`  → ${Math.round(day).toLocaleString('en-US')} CR/ngày = ${(day/5400).toFixed(1)} lượt chiêu mộ ×10, hoặc ${(day/lvCost).toFixed(2)} nhân vật nâng kịch cấp`);
