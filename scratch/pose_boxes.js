const fs=require('fs'), vm=require('vm');
const stub=new Proxy({},{get:()=>()=>{}});
const ctx={console, document:{addEventListener(){},querySelector:()=>null,createElement:()=>stub},
  localStorage:{getItem:()=>null,setItem(){}}, matchMedia:()=>({matches:false,addEventListener(){}}),
  loadFirst:async()=>null, absUrl:s=>s, el:()=>stub, requestAnimationFrame:()=>0, Image:function(){}, location:{href:'http://x/'}};
ctx.window=ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync('js/data.js','utf8')+'\n;globalThis.__X={ROSTER,ENEMY_POOL};', ctx, {filename:'js/data.js'});
const {ROSTER,ENEMY_POOL}=ctx.__X, out={};
const add=(id,s)=>{ if(!s) return; out[id]={}; for(const p of ['idle','attack','crit','hurt','die']) if(s[p]) out[id][p]={file:s[p][0], box:(s.box&&s.box[p])||null}; };
for(const id in ROSTER) add(id, ROSTER[id].sprites);
ENEMY_POOL.forEach(e=>add(e.id, e.sprites));
fs.writeFileSync('scratch/_boxes.json', JSON.stringify(out,null,1));
console.log('ids:', Object.keys(out).length);
