// Mô phỏng trận để cân bằng: node scratch/sim.js [số trận mỗi sector] [team: yuki,ash,kai]
// Nạp js/data.js thật (ROSTER, ENEMY_POOL, SECTORS, RULES), tái hiện luật trong js/battle.js (passive, wave heal, thứ tự lượt theo SPD,
// chí mạng theo crit từng unit, variance, trạng thái độc/cháy/choáng) với chính sách chơi đơn giản: đòn thường vào địch thấp máu nhất;
// ult nuke vào địch nhiều máu nhất, control vào địch ATK cao nhất, aoe khi còn ≥2 địch, heal khi có người dưới 50% HP.
// In tỉ lệ thắng + số round trung bình theo sector.
'use strict';
const fs=require('fs'), path=require('path'), vm=require('vm');
const N=+process.argv[2]||300;
const TEAM_ARG=(process.argv[3]||'yuki,ash,kai').split(',');
// Ghi đè mult để dò cân bằng: node scratch/sim.js 400 yuki,ash,kai 07-D=1.0,07-E=1.15
const OVR=Object.fromEntries((process.argv[4]||'').split(',').filter(Boolean).map(x=>{ const [id,v]=x.split('='); return [id,+v]; }));
const ctx={ console, Math, JSON, Object, Array, Set, Map, Number, String, Date, window:{}, localStorage:undefined,
  rand:a=>a[Math.floor(Math.random()*a.length)] };
ctx.window=ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(__dirname,'..','js','data.js'),'utf8'), ctx, {filename:'data.js'});
const { ROSTER, ENEMY_POOL, SECTORS, RULES, TEAM_SIZE } = vm.runInContext('({ROSTER,ENEMY_POOL,SECTORS,RULES,TEAM_SIZE})', ctx);
SECTORS.forEach(s=>{ if(OVR[s.id]!=null) s.mult=OVR[s.id]; });
// Thử số liệu khác không cần sửa data.js: SIM_PATCH="ROSTER.ash.skill.status.pct=.15" node scratch/sim.js 300
if(process.env.SIM_PATCH) vm.runInContext(process.env.SIM_PATCH, ctx);

function passiveOn(p, teamIds, enemyDefs, self){ const w=p.when||{};
  if(w.always) return true; if(w.ally) return w.ally!==self.id && teamIds.includes(w.ally);
  if(w.allyAny) return w.allyAny.some(id=>id!==self.id && teamIds.includes(id));
  if(w.enemy) return enemyDefs.some(e=>e.id===w.enemy); if(w.enemyFaction) return enemyDefs.some(e=>e.faction===w.enemyFaction); return false; }
const scopeHits=(w,o)=>!w||w.always||w.ally||w.allyAny||(w.enemy&&o.id===w.enemy)||(w.enemyFaction&&o.side==='enemy'&&o.faction===w.enemyFaction);
function mods(src,tgt){ let dmg=0,taken=0,crit=0;
  (src.active||[]).forEach(p=>{ if(scopeHits(p.when,tgt)){ dmg+=p.effect.dmgPct||0; crit+=p.effect.critPct||0; } });
  (tgt.active||[]).forEach(p=>{ if(scopeHits(p.when,src)) taken+=p.effect.dmgTakenPct||0; });
  return { mult:(1+dmg/100)*(1+taken/100), crit:crit/100 }; }
/* Trạng thái như battle.js applyStatus/tickStatus: pct × ATK người gây, đếm theo lượt người dính; stun = mất lượt */
function applyStatus(src,tgt,st){ if(!st||!tgt.alive) return; if(st.kind==='stun'&&tgt.rank==='boss') return;   // boss không bị choáng (battle.js cùng luật)
  if(st.chance!=null&&Math.random()>=st.chance) return;
  const dmg=st.pct?Math.round(src.atk*st.pct):0, turns=st.turns||1; const cur=tgt.status.find(s=>s.kind===st.kind);
  if(cur){ cur.turns=Math.max(cur.turns,turns); cur.dmg=Math.max(cur.dmg,dmg); } else tgt.status.push({kind:st.kind,turns,dmg}); }
function tickStatus(u){ for(const s of u.status){ if(!s.dmg) continue; u.hp=Math.max(0,u.hp-s.dmg); s.turns--; if(u.hp<=0){ u.alive=false; u.status=[]; return true; } }
  const st=u.status.find(s=>s.kind==='stun'); let skip=false; if(st){ st.turns--; skip=true; }
  u.status=u.status.filter(s=>s.turns>0); return skip; }
/* o.flat = sát thương cố định (chiêu cuối địch): bỏ qua ATK/variance/chí mạng/passive. Lá chắn hút trước, phần thừa mới vào HP. */
function hit(src,tgt,mult,basic,o={}){ const pm=mods(src,tgt), sk=src.skill||{}, flat=o.flat||0;
  const crit=!flat&&Math.random()<(src.crit||0)/100+pm.crit+(basic?(sk.critPct||0)/100:0);
  const v=1+(Math.random()*2-1)*RULES.variance;
  let d=flat||src.atk*mult*v*(crit?RULES.critMult:1)*pm.mult;
  if(!flat&&basic&&sk.executeBelow&&tgt.hp/tgt.hpMax<sk.executeBelow) d*=1+(sk.executeBonus||0);
  d=Math.round(d);
  if(tgt.shield){ const b=Math.min(tgt.shield,d); tgt.shield-=b; d-=b; }
  tgt.hp=Math.max(0,tgt.hp-d); const killed=tgt.alive&&tgt.hp<=0; if(killed){ tgt.alive=false; tgt.status=[]; tgt.shield=0; }
  if(!killed&&o.status) applyStatus(src,tgt,o.status); return killed; }

function runSector(sec, teamIds){
  const ids=(sec.team||teamIds).slice(0,TEAM_SIZE);
  (sec.guest||[]).forEach(g=>{ if(ids.includes(g)) return;                    // cùng luật battleTeam(): guestSwap → slot cuối không phải yuki
    const pref=(sec.guestSwap||[]).find(id=>ids.includes(id)); let i=pref?ids.indexOf(pref):-1;
    if(i<0){ for(let k=ids.length-1;k>=0;k--){ if(ids[k]!=='yuki'){ i=k; break; } } }
    if(i<0) i=ids.length-1; ids[i]=g; });
  const enemyDefs=[...new Set(sec.plan.flat())].map(id=>ENEMY_POOL.find(e=>e.id===id));
  const allies=ids.map((id,i)=>{ const d=ROSTER[id]; const u={...d, side:'ally', slot:i, hp:d.hp, hpMax:d.hp, energy:0, alive:true, status:[]};
    u.active=(d.passives||[]).filter(p=>passiveOn(p,ids,enemyDefs,u)); let atk=1,hp=1,en=0;
    u.active.forEach(({effect:e={}})=>{ atk+=(e.atkPct||0)/100; hp+=(e.hpPct||0)/100; en=Math.max(en,e.energyStart||0); });
    u.atk=Math.round(u.atk*atk); u.hpMax=Math.round(u.hpMax*hp); u.hp=u.hpMax; u.energy=Math.min(u.energyMax,en); return u; });
  let round=0, enemies=[];
  const alive=arr=>arr.filter(u=>u.alive);
  for(let w=1; w<=sec.waves; w++){
    if(w>1) alive(allies).forEach(u=>{ u.hp=Math.min(u.hpMax,u.hp+Math.round(u.hpMax*RULES.waveHeal)); u.status=[]; });
    enemies=sec.plan[w-1].map((id,i)=>{ const d=ENEMY_POOL.find(e=>e.id===id); return {...d, side:'enemy', slot:i, atk:Math.round(d.atk*sec.mult), hp:Math.round(d.hp*sec.mult), hpMax:Math.round(d.hp*sec.mult), alive:true, controlled:false, status:[], energy:0, shield:0}; });
    while(alive(enemies).length && alive(allies).length){
      round++; if(round>200) return {win:false, round};
      // thứ tự lượt = battle.js buildQueue: SPD giảm dần, bằng thì đội mình trước rồi theo slot
      const q=[...alive(allies),...alive(enemies)].sort((a,b)=>(b.spd||0)-(a.spd||0) || (a.side===b.side ? a.slot-b.slot : (a.side==='ally'?-1:1)));
      for(const u of q){
        if(!u.alive) continue; if(!alive(enemies).length||!alive(allies).length) break;
        if(u.status.length && tickStatus(u)) continue;                        // độc/cháy trừ HP (có thể chết), choáng mất lượt
        if(!u.alive) continue;
        if(u.side==='ally'){
          const es=alive(enemies); const k=u.ult.kind, ult=u.ult, sk=u.skill||{};
          const useUlt=u.energy>=ult.cost && (k==='nuke' || (k==='aoe'&&es.length>=2) || (k==='heal'&&alive(allies).some(x=>x.hp/x.hpMax<.5)) || (k==='control'&&es.length>=2));
          if(useUlt){ u.energy-=ult.cost;
            if(k==='nuke'){ const t=es.slice().sort((p,q)=>q.hp-p.hp)[0]; if(hit(u,t,ult.mult,false,{status:ult.status})&&ult.refundOnKill) u.energy=Math.min(u.energyMax,u.energy+ult.refundOnKill); }
            else if(k==='aoe'){ es.forEach(t=>hit(u,t,ult.mult,false,{status:ult.status})); }
            else if(k==='heal'){ alive(allies).forEach(t=>{ t.hp=Math.min(t.hpMax,t.hp+Math.round(u.atk*ult.mult)); }); }
            else if(k==='control'){ const t=es.slice().sort((p,q)=>q.atk-p.atk)[0]; t.controlled=true; }
          } else { const t=es.slice().sort((p,q)=>p.hp-q.hp)[0]; hit(u,t,sk.mult||1,true,{status:sk.status});
            const bonus=(u.active||[]).reduce((s,p)=>s+(p.effect.energyGainPct||0),0); u.energy=Math.min(u.energyMax,u.energy+Math.round((sk.energy||25)*(1+bonus/100))); }
        } else {
          const o={status:(u.skill||{}).status};
          /* chiêu cuối của địch như battle.js enemyAct/enemyUlt: đầu lượt nạp RULES.foeUltGain Energy, đủ cost thì tung ngay lượt đó
             thay cho đòn thường (nuke = mult × ATK hoặc flat lên một người, ngẫu nhiên hoặc target:'lowest', đánh hits nhịp,
             kèm drainEnergy thì rút Energy người đó; aoe = đánh cả đội; shield = lá chắn cho chính nó, shieldTarget:'biggest'
             thì đắp cho con to nhất; heal = vá cho đồng bọn tỉ lệ HP thấp nhất, tính cả chính nó, healAll thì vá cho mọi con còn sống) */
          if(u.ult) u.energy=Math.min(u.energyMax,u.energy+RULES.foeUltGain);
          if(u.ult && u.energy>=u.ult.cost && !u.controlled){ u.energy-=u.ult.cost;
            if(u.ult.kind==='shield'){ const others=alive(enemies).filter(x=>x!==u);
                                       const st=u.ult.shieldTarget==='biggest'&&others.length ? others.slice().sort((p,q)=>q.hpMax-p.hpMax)[0] : u;
                                       st.shield+=Math.round(u.hpMax*(u.ult.shieldPct||1)); }
            else if(u.ult.kind==='heal'){ const list=u.ult.healAll ? alive(enemies) : [alive(enemies).slice().sort((p,q)=>p.hp/p.hpMax-q.hp/q.hpMax)[0]||u];
                                          list.forEach(t=>{ if(t) t.hp=Math.min(t.hpMax, t.hp+Math.round(t.hpMax*(u.ult.healPct||.3))); }); }
            else if(u.ult.kind==='aoe'){ alive(allies).forEach(t=>{ hit(u,t,u.ult.mult||1,false,{status:u.ult.status});
                                           if(u.ult.drainEnergy && t.alive) t.energy=u.ult.drainEnergy===true ? 0 : Math.max(0, t.energy-u.ult.drainEnergy); }); }
            else { const a2=alive(allies);
                   const t=u.ult.target==='lowest' ? a2.slice().sort((p,q)=>p.hp-q.hp)[0] : a2[Math.floor(Math.random()*a2.length)];
                   for(let i=0;i<Math.max(1,u.ult.hits||1)&&t.alive;i++) hit(u,t,u.ult.mult||1,false,{flat:u.ult.flat, status:u.ult.status});
                   if(u.ult.drainEnergy && t.alive) t.energy=u.ult.drainEnergy===true ? 0 : Math.max(0, t.energy-u.ult.drainEnergy); }
            continue;
          }
          if(u.controlled){ u.controlled=false; const oth=alive(enemies).filter(x=>x!==u); const t=oth.length?oth[Math.floor(Math.random()*oth.length)]:u; hit(u,t,1,false,o); }
          else { const a2=alive(allies); const t=a2[Math.floor(Math.random()*a2.length)]; hit(u,t,1,false,o); }
        }
      }
    }
    if(!alive(allies).length) return {win:false, round};
  }
  return {win:true, round, survivors:alive(allies).length};
}
/* ---- Chế độ DẸP LOẠN: node scratch/sim.js 300 yuki,ash,kai --riot [tầng cuối]
   riotSector(n) trả về object hình dạng sector nên runSector chạy thẳng, không phải viết lại gì.
   Đọc bảng: tầng nào tụt xuống dưới ~40% là chỗ người chơi phải dừng lại nâng cấp — muốn tường đó
   sớm/muộn hơn thì chỉnh RIOT.mult trong js/data.js rồi chạy lại. ---- */
if(process.argv.includes('--riot')){
  const { riotSector, RIOT, ENEMY_POOL } = vm.runInContext('({riotSector,RIOT,ENEMY_POOL})', ctx);
  const last = +process.argv[process.argv.indexOf('--riot')+1] || 20;
  console.log(`team=${TEAM_ARG.join('+')} · ${N} trận/tầng · DẸP LOẠN tầng 1–${last}`);
  for(let n=1; n<=last; n++){
    const sec=riotSector(n);
    let wins=0, rounds=0, surv=0;
    for(let i=0;i<N;i++){ const r=runSector(sec,TEAM_ARG); if(r.win){ wins++; surv+=r.survivors; } rounds+=r.round; }
    const w=wins/N*100, bossName=sec.boss?(ENEMY_POOL.find(e=>e.id===sec.boss)||{}).name:'';
    console.log(`tầng ${String(n).padStart(2)}  mult ${String(sec.mult).padEnd(5)} ATK gợi ý ${String(sec.rec).padStart(3)}  win ${w.toFixed(0).padStart(3)}%  round tb ${(rounds/N).toFixed(1).padStart(5)}  sống sót tb ${wins?(surv/wins).toFixed(2):'-'}  +${sec.reward.credits} CR${bossName?'  · TRÙM '+bossName:''}${w<40?'   ← TƯỜNG':''}`);
  }
  process.exit(0);
}
console.log(`team=${TEAM_ARG.join('+')} · ${N} trận/sector · waveHeal ${RULES.waveHeal} · critMult ${RULES.critMult}`);
for(const sec of SECTORS){
  let wins=0, rounds=0, surv=0;
  for(let i=0;i<N;i++){ const r=runSector(sec,TEAM_ARG); if(r.win){ wins++; surv+=r.survivors; } rounds+=r.round; }
  console.log(`${sec.id.padEnd(5)} ${sec.name.padEnd(20)} mult ${String(sec.mult).padEnd(4)} win ${(wins/N*100).toFixed(0).padStart(3)}%  round tb ${(rounds/N).toFixed(1).padStart(5)}  sống sót tb ${wins?(surv/wins).toFixed(2):'-'}${sec.team?'  (đội ép: '+sec.team.join(',')+')':''}${sec.guest?'  (khách: '+sec.guest.join(',')+')':''}`);
}
