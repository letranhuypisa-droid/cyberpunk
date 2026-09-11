'use strict';
/* KIT — demo cho kit.html: thẻ, HP/Energy bar, đội hình, nút ult, thanh lượt, số bay, roster, bestiary, token swatches.
   Nạp sau js/core.js và js/data.js. Không nạp trong bản chơi (index.html). */
/* =====================================================================
   KIT DEMOS
   ===================================================================== */
/* B1: cards — ma trận 2 phe × 3 tier + trạng thái */
{
  const row=$('#cardRow');
  const specs=[['yuki','selected'],['echo',''],['wire','locked'],['psalm','selected'],['stitch',''],['ronin',''],['muzzle',''],['ash','locked']];
  specs.forEach(([id,st])=>{ const w=el('div','sample'); w.appendChild(cardEl(ROSTER[id],st)); const d=ROSTER[id];
    w.insertAdjacentHTML('beforeend', `<span class="sample__cap">${d.faction} · tier ${d.tier} · ${st||'unselected'}${['echo','wire','stitch'].includes(id)?'<span class="fake">FAKE</span>':''}</span>`); row.appendChild(w); });
  const g=cardEl(ROSTER.yuki,''); g.classList.add('is-dragging'); g.draggable=false; $('#dragGhost').appendChild(g);
  // Roster đầy đủ
  const rr=$('#rosterRow'); const all=Object.values(ROSTER); $('#rosterCount').textContent=all.length;
  all.forEach(d=>{ const w=el('div','sample'); w.appendChild(cardEl(d,'')); w.insertAdjacentHTML('beforeend',`<span class="sample__cap">${d.faction} · ${d.tier} · ${d.ult.name}</span>`); rr.appendChild(w); });
  // Bestiary: tái dùng khung thẻ, badge = rank
  const er=$('#enemyRow'); $('#enemyCount').textContent=ENEMY_POOL.length;
  ENEMY_POOL.forEach(d=>{
    const tier={grunt:'B',elite:'A',boss:'S'}[d.rank];
    const c=cardEl({...d, tier},''); c.draggable=false;   // art thẻ địch: portrait/pos gán trong js/data.js (FOE_ART)
    c.querySelector('.card__tier').textContent=d.rank[0].toUpperCase();
    c.querySelector('.card__fac').textContent=`${d.faction} · ${d.rank}`;
    const w=el('div','sample'); w.appendChild(c); er.appendChild(w);
  });
}
/* B2: mất máu demo */
{
  const bar=$('#drainBar'), line=$('#drainLine'), txt=$('#drainTxt'); let hp=950;
  setInterval(()=>{ hp -= 140 + Math.round(Math.random()*180); if(hp<0) hp=950; const st=setHpBar(bar,hp,950); line.dataset.state=st; txt.textContent=`${hp} / 950`; }, 1700);
}
/* B3: energy 0/25/50/75/100 + 125 (Psalm) */
{
  const row=$('#energyRow');
  [[0,100],[25,100],[50,100],[75,100],[100,100],[125,125]].forEach(([v,max])=>{
    const s=el('div','sample sample--w'); const full=v>=max;
    s.innerHTML=`<div class="eline ${full?'is-full':''}"><span class="lbl">Energy</span><span><span class="ready">READY</span> <span class="mono">${v}/${max}</span></span></div>`;
    const eb=energyBarEl(max); eb.classList.add('ebar--lg'); setEnergyBar(eb,v,max); s.appendChild(eb);
    s.insertAdjacentHTML('beforeend', `<span class="sample__cap">${full?'ĐẦY · sắp tung chiêu':v+' / '+max}${max===125?' · 5 ô (cost 125)':''}</span>`); row.appendChild(s);
  });
}
/* B4: team slots + drag & drop */
{
  const team=$('#team'); const state=['yuki','psalm',null];
  function render(){
    team.innerHTML='';
    state.forEach((id,i)=>{
      const s=el('div','tslot'); s.dataset.idx=i;
      s.innerHTML=`<span class="tslot__idx">${String(i+1).padStart(2,'0')}</span><div class="tslot__empty"></div>`;
      if(id){ const d=ROSTER[id]; s.classList.add('is-filled','f-'+d.faction); s.appendChild(portraitEl(d)); s.insertAdjacentHTML('beforeend', `<div class="tslot__name">${d.name}</div><button class="tslot__x" title="Gỡ">×</button>`);
        s.querySelector('.tslot__x').addEventListener('click',()=>{ state[i]=null; render(); }); }
      if(i===2 && !id && !team.dataset.touched) s.classList.add('is-over');   // demo tĩnh trạng thái drag-over
      s.addEventListener('dragover', ev=>{ ev.preventDefault(); team.dataset.touched='1'; team.querySelectorAll('.is-over').forEach(x=>x.classList.remove('is-over')); s.classList.add('is-over'); });
      s.addEventListener('dragleave', ()=>s.classList.remove('is-over'));
      s.addEventListener('drop', ev=>{ ev.preventDefault(); const id=ev.dataTransfer.getData('text/plain'); if(!ROSTER[id]) return; const j=state.indexOf(id); if(j>-1) state[j]=null; state[i]=id; render(); });
      team.appendChild(s);
    });
  }
  render();
}
/* B5: casting demo lặp */
setInterval(()=>{ const i=$('#castDemo'); i.style.animation='none'; void i.offsetWidth; i.style.animation=''; }, 1300);
/* B6: turn bar demo tự chạy */
{
  const seq=['yuki','scav','psalm','rigger','ronin','bulwark','ash','muzzle'].map(id=>ROSTER[id]||ENEMY_POOL.find(e=>e.id===id));
  let i=0; const bar=$('#turnDemo'); const tiles=new Map();
  const mk=(u,key)=>{ const k=u.id+key; if(!tiles.has(k)){ const t=el('div',`tu tu--${u.faction}`); t.appendChild(portraitEl(u)); t.insertAdjacentHTML('beforeend','<span class="tu__lbl">NOW</span><i class="tu__mark"></i>'); tiles.set(k,t); } const t=tiles.get(k); t.classList.remove('is-active','is-next'); return t; };
  function draw(){ bar.innerHTML=''; const rest=seq.slice(i), next=seq.slice(0,Math.max(0,7-rest.length));
    rest.forEach((u,k)=>{ const t=mk(u,'a'); if(k===0) t.classList.add('is-active'); bar.appendChild(t); }); if(next.length){ bar.appendChild(el('i','turn__sep')); next.forEach(u=>{ const t=mk(u,'n'); t.classList.add('is-next'); bar.appendChild(t); }); } }
  draw(); setInterval(()=>{ i=(i+1)%seq.length; draw(); },1600);
}
/* B7: số bay lên */
{
  const box=$('#dmgDemo');
  const fire=()=>{ const s=box.getBoundingClientRect(); const put=(x,txt,k,delay)=>setTimeout(()=>{ const d=el('div','dmg'+(k?' dmg--'+k:''),txt); d.style.left=x+'%'; d.style.top='70%'; box.appendChild(d); d.addEventListener('animationend',()=>d.remove()); },delay);
    put(18,'151','',0); put(50,'232','crit',180); put(82,'+84','heal',360); };
  fire(); $('#btnDmg').addEventListener('click',fire); setInterval(fire,3200);
}
/* B9: overlay hiệu ứng (js/fx.js) trên một unit dựng tay giống unitEl của battle.js */
{
  const host=$('#fxDemo');
  if(host){
    const u=el('div','unit unit--ally unit--chrome unit--s'); u.style.cssText='position:relative;left:auto;bottom:auto;transform:none;width:150px';
    u.innerHTML='<div class="unit__sprite"><div class="unit__shadow"></div><div class="unit__bob"><div class="unit__pose has-img"><div class="unit__frame"><img alt=""></div></div></div></div>';
    host.appendChild(u); loadFirst(ROSTER.yuki.sprites.idle).then(src=>{ if(src) u.querySelector('img').src=src; });
    const btns=$('#fxBtns'), loops=new Set();
    ['hit','crit','zero','explode','shock','poison','burn','stun','heal','shield'].forEach(k=>{ const b=el('button','chip chip--buff',k.toUpperCase()); b.addEventListener('click',()=>playFx(u,k,{flip:$('#fxFlip').checked, force:true})); btns.appendChild(b); });
    ['poison','burn','stun','shield'].forEach(k=>{ const b=el('button','chip chip--debuff','LẶP '+k.toUpperCase()); b.addEventListener('click',()=>{ loops.has(k)?loops.delete(k):loops.add(k); b.classList.toggle('is-on',loops.has(k)); setFxLoops(u,[...loops]); }); btns.appendChild(b); });
    FX.preloadAll();
    const files=()=>{ const have=[...FX.ready].filter(([,v])=>v).map(([k,v])=>`${k} (${v.count}f)`); $('#fxFiles').textContent = have.length ? 'ẢNH ĐÃ CÓ: '+have.join(' · ') : 'Chưa có file art/fx/*.webp — đang dùng placeholder CSS'; };
    FX.sheets.forEach(p=>p.then(files)); files();
  }
}
/* A: swatches — đọc giá trị computed để kiểm tra theme */
function renderSwatches(){
  const names=[['--chrome','Chrome'],['--chrome-hi','Chrome hi'],['--chrome-white','Chrome white'],['--chrome-slate','Chrome slate'],
    ['--rust','Rust'],['--rust-hi','Rust hi'],['--rust-acid','Rust acid'],['--rust-grime','Rust grime'],
    ['--tier-s','Tier S'],['--tier-a','Tier A'],['--tier-b','Tier B'],
    ['--bg-0','bg 0'],['--bg-1','bg 1'],['--surface-1','surface 1'],['--surface-2','surface 2'],['--surface-3','surface 3'],['--surface-4','surface 4'],
    ['--line-1','line 1'],['--line-2','line 2'],['--line-3','line 3'],['--text-1','text 1'],['--text-2','text 2'],['--text-3','text 3'],
    ['--hp','hp'],['--hp-mid','hp mid'],['--hp-low','hp low'],['--heal','heal'],['--crit','crit'],['--energy','energy'],['--energy-full','energy full']];
  const cs=getComputedStyle(document.documentElement);
  $('#swatches').innerHTML=names.map(([v,n])=>`<div class="sw"><i style="--c:var(${v})"></i><b>${n}<small>${v} · ${cs.getPropertyValue(v).trim()}</small></b></div>`).join('');
}
renderSwatches();
