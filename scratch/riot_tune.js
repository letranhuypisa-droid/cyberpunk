// Dò độ khó THẬT của 9 cái bãi DẸP LOẠN — chọn `mult` bằng số đo thay vì đoán.
//
//   node scratch/riot_tune.js m50   [số trận]   → mult làm đội mở đầu cấp 1 thắng 55% (hằng số m50 để tính SỨC MẠNH Ổ)
//   node scratch/riot_tune.js plan  [số trận]   → mult để mỗi bãi đạt đúng tỉ lệ thắng đã thiết kế (bảng TARGET)
//
// Vì sao phải đo: đội hình wave quyết định độ khó nhiều hơn `mult` rất nhiều. Một con THỢ HÀN biết vá máu
// đứng sau hai con ĐỔ XỈ nặng hơn cả một con trùm — rải mult đều theo vòng là sai ngay từ đầu.
// Chặt nhị phân CẢ 9 BÃI cùng lúc trong một lần gọi sim (sim.js nhận --ymult cho từng bãi), nên 7 lần chạy
// là xong chứ không phải 63.
'use strict';
const fs=require('fs'), path=require('path'), vm=require('vm'), cp=require('child_process');
const MODE=process.argv[2]||'m50', N=+process.argv[3]|| (MODE==='m50'?200:200);
const TEAM='yuki,ash,kai';

/* Tỉ lệ thắng THIẾT KẾ cho từng bãi, và đo bằng đội nào.
   Vòng 1–2 đo bằng đội mở đầu cấp 1; vòng 3 đo bằng chính đội đó đã nâng cấp 20 (+76% ATK/HP),
   vì vòng 3 cố ý là nội dung của người đã cày. */
const TARGET = {
  drop:{win:.98, lv:1},  drain:{win:.95, lv:1},  fence:{win:.88, lv:1},
  smelter:{win:.70,lv:1}, market:{win:.58,lv:1}, church:{win:.45,lv:1},
  lift:{win:.75, lv:20}, tower:{win:.60, lv:20}, grave:{win:.45, lv:20},
};

const SIM=path.join(__dirname,'sim.js');
function run(mults, lv){
  const arg=Object.keys(mults).map(k=>k+'='+mults[k]).join(',');
  const out=cp.execFileSync(process.execPath,[SIM,String(N),TEAM,'--yard','--lv',String(lv),'--ymult',arg],{encoding:'utf8'});
  const w={};
  out.split('\n').forEach(l=>{ const m=l.match(/^(\S+)\s.*win\s+(\d+)%/); if(m) w[m[1]]=+m[2]/100; });
  return w;
}
const ctx={console,Math,JSON,Object,Array,Set,Map,Number,String,Date,window:{},localStorage:undefined,rand:a=>a[0]};
ctx.window=ctx; vm.createContext(ctx);
['data.js','state.js','riot.js'].forEach(f=>vm.runInContext(fs.readFileSync(path.join(__dirname,'..','js',f),'utf8'),ctx,{filename:f}));
const { RIOT_YARDS } = vm.runInContext('({RIOT_YARDS})', ctx);

/* Một lượt chặt nhị phân cho MỘT nhóm bãi cùng cấp đội */
function search(ids, want, lv){
  const lo={}, hi={};
  ids.forEach(id=>{ lo[id]=.25; hi[id]=3.4; });
  for(let i=0;i<8;i++){
    const mid={}; ids.forEach(id=>{ mid[id]=Math.round((lo[id]+hi[id])/2*100)/100; });
    const w=run(mid, lv);
    ids.forEach(id=>{ if(w[id] > (typeof want==='function'?want(id):want)) lo[id]=mid[id]; else hi[id]=mid[id]; });
  }
  const out={}; ids.forEach(id=>{ out[id]=Math.round((lo[id]+hi[id])/2*100)/100; });
  return out;
}

if(MODE==='m50'){
  const LV=+process.argv[4]||1;
  const ids=RIOT_YARDS.map(y=>y.id);
  const r=search(ids, .55, LV);
  console.log(`m50 = mult làm đội ${TEAM} cấp ${LV} thắng 55% · ${N} trận/lần đo`);
  console.log('Dán vào RIOT_YARDS (js/riot.js), trường m50:');
  RIOT_YARDS.forEach(y=>console.log(`  ${y.id.padEnd(8)} m50:${String(r[y.id]).padEnd(5)}  (đang đặt ${y.m50!=null?y.m50:'—'})`));
} else {
  const byLv={};
  RIOT_YARDS.forEach(y=>{ const t=TARGET[y.id]; (byLv[t.lv]=byLv[t.lv]||[]).push(y.id); });
  const res={};
  for(const lv of Object.keys(byLv)){
    Object.assign(res, search(byLv[lv], id=>TARGET[id].win, +lv));
  }
  console.log(`mult để đạt tỉ lệ thắng thiết kế · ${N} trận/lần đo`);
  console.log('Dán vào RIOT_YARDS (js/riot.js), trường mult:');
  RIOT_YARDS.forEach(y=>console.log(`  ${y.id.padEnd(8)} mult:${String(res[y.id]).padEnd(5)}  ← ${Math.round(TARGET[y.id].win*100)}% với đội cấp ${TARGET[y.id].lv}  (đang đặt ${y.mult})`));
}
