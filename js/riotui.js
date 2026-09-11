'use strict';
/* =====================================================================
   DẸP LOẠN — màn hình. Bản đồ Khu Đáy (riotmap), tờ chi tiết một bãi, chọn người đóng quân,
   báo cáo vắng mặt, hợp đồng tuần. Số liệu + logic ở js/riot.js. Đặc tả: docs/dep-loan.md §E.

   Nạp CUỐI CÙNG (sau js/app.js): file này bọc quanh winReward()/finish() của js/battle.js để cộng thưởng
   trận chiếm bãi — không sửa một dòng nào trong battle.js.
   ===================================================================== */

/* ---- Định dạng ---- */
const rn = n => Math.round(n).toLocaleString('en-US');
function rms(ms){
  if(ms==null) return '—';
  const s=Math.max(0,Math.round(ms/1000)), h=Math.floor(s/3600), m=Math.floor(s%3600/60), ss=s%60;
  return h ? `${h}:${String(m).padStart(2,'0')}:${String(ss).padStart(2,'0')}` : `${m}:${String(ss).padStart(2,'0')}`;
}
/* "6 giờ" / "4 giờ 30" / "45 phút" — người chơi đọc thời gian chứ không đọc số chu kỳ.
   Dưới một phút chỉ gặp ở chế độ thử ?riotfast, nhưng để "0 phút" trên màn thì đọc như lỗi. */
function rdur(min){
  if(min < 1) return Math.round(min*60)+' giây';
  min=Math.round(min); if(min<60) return min+' phút';
  const h=Math.floor(min/60), m=min%60; return m ? `${h} giờ ${m}` : `${h} giờ`;
}
const rbar = (pct, cls='') => `<i class="rbar ${cls}"><u style="width:${Math.max(0,Math.min(100,pct)).toFixed(1)}%"></u></i>`;

/* =====================================================================
   BẢN ĐỒ DỰ PHÒNG — vẽ bằng SVG khi chưa có art/map/map_d07.jpg.
   Bố cục đúng 5 dải của docs/dep-loan.md §H1 nên toạ độ nút trong RIOT_YARDS không phải sửa khi thay ảnh thật.
   ===================================================================== */
function riotMapSvg(){
  /* Bộ sinh số cố định: bản đồ phải giống hệt nhau mỗi lần mở, không nhảy múa */
  let s=20260911>>>0; const rnd=()=>{ s=(s*1664525+1013904223)>>>0; return s/4294967296; };
  const P=[];
  const CH='rgba(160,140,255,', RU='rgba(235,140,80,', ST='rgba(205,215,238,', AC='rgba(201,216,48,';
  const box=(x,y,w,h,f)=>P.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}"/>`);
  const line=(x1,y1,x2,y2,st,w=2,da='')=>P.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${st}" stroke-width="${w}"${da?` stroke-dasharray="${da}"`:''} stroke-linecap="round"/>`);
  const poly=(pts,f,st,w=3)=>P.push(`<polygon points="${pts}" fill="${f}"${st?` stroke="${st}" stroke-width="${w}"`:''}/>`);
  const circ=(x,y,r,f,st,w=3)=>P.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="${f}"${st?` stroke="${st}" stroke-width="${w}"`:''}/>`);
  const txt=(x,y,t,f,sz=26)=>P.push(`<text x="${x}" y="${y}" text-anchor="middle" font-family="monospace" font-size="${sz}" letter-spacing="6" fill="${f}">${t}</text>`);

  /* Vạch chia ba vòng, nhãn nằm NGAY DƯỚI vạch và gọi tên dải bắt đầu từ đó.
     Khớp y của RIOT_YARDS: vòng 3 (trung tâm) 14–32% · vòng 2 (lòng khu) 41–59% · vòng 1 (vành ngoài) 68–86%. */
  [[584,'LÒNG KHU', RU+'.55)'],[1016,'VÀNH NGOÀI', RU+'.55)']].forEach(([y,t,c])=>{
    line(40,y,860,y, ST+'.14)',2,'6 14');
    P.push(`<text x="52" y="${y+28}" font-family="monospace" font-size="20" letter-spacing="7" fill="${c}">${t}</text>`);
  });
  P.push(`<text x="52" y="126" font-family="monospace" font-size="20" letter-spacing="7" fill="${CH}.6)">TRUNG TÂM · CHÂN THÁP</text>`);

  /* ---- Vòng 3 · dải trên: cọc móng Tháp, nghĩa địa thép (540,224), tháp nước 9 (288,368), thang máy (567,512) */
  for(let i=0;i<4;i++){ const x=90+i*215; poly(`${x},80 ${x+104},80 ${x+78},470 ${x+26},470`, CH+'.13)', CH+'.30)',2); line(x+52,80,x+52,470, CH+'.28)',2); }
  for(let i=0;i<34;i++){ const x=470+rnd()*170, y=190+rnd()*80; box(x,y,6,20+rnd()*16, ST+'.48)'); }
  line(466,286,650,286, ST+'.30)',2);
  circ(288,368,52, RU+'.14)', RU+'.70)',4); txt(288,382,'9', RU+'.85)',34);
  line(258,412,246,470, RU+'.55)',5); line(318,412,330,470, RU+'.55)',5);
  for(let i=0;i<8;i++){ const y=452+i*20; line(508,y,626,y, ST+'.20)',2); }
  line(508,452,508,612, ST+'.45)',4); line(626,452,626,612, ST+'.45)',4);
  line(508,452,626,612, ST+'.16)',2); line(626,452,508,612, ST+'.16)',2);

  /* ---- Vòng 2 · dải giữa: mái nhà thờ (261,656), chợ thép (549,800), sân lò đúc (297,944) */
  poly('182,718 261,616 340,718', RU+'.16)', RU+'.60)',4);
  line(261,616,261,566, RU+'.75)',5); line(238,592,284,592, RU+'.75)',5);
  for(let i=0;i<12;i++){ const x=466+(i%4)*48, y=754+Math.floor(i/4)*34;
    poly(`${x},${y} ${x+42},${y} ${x+33},${y+23} ${x+9},${y+23}`, AC+'.12)', AC+'.42)',2); }
  circ(297,944,44, RU+'.18)', RU+'.70)',4); circ(297,944,18, RU+'.35)');
  for(let i=0;i<3;i++) P.push(`<ellipse cx="${305+i*12}" cy="${890-i*42}" rx="${26+i*11}" ry="${12+i*5}" fill="${RU}.10)"/>`);

  /* ---- Vòng 1 · dải dưới: hàng rào gãy (522,1088), cống ba ngã (270,1232), bãi rơi (558,1376), hố loạn (306,1520) */
  line(60,1150,860,1040, ST+'.42)',4,'40 18');
  for(let i=0;i<10;i++){ const t=i/9, x=60+t*800, y=1150-t*110; line(x,y-15,x,y+15, ST+'.28)',2); }
  circ(270,1232,34,'rgba(8,10,14,.9)', ST+'.45)',3);
  [[-58,-34],[0,-64],[58,-34]].forEach(([dx,dy])=>{ line(270+dx,1232+dy,270,1232, ST+'.32)',9); circ(270+dx,1232+dy,15,'rgba(8,10,14,.75)', ST+'.38)',2); });
  for(let i=0;i<26;i++){ const x=430+rnd()*360, y=1300+rnd()*180, w=22+rnd()*52, h=12+rnd()*20;
    box(x,y,w,h, rnd()<.4 ? RU+'.26)' : 'rgba(130,118,102,.34)'); }
  line(470,1330,700,1420, ST+'.16)',2);
  circ(306,1520,70,'rgba(6,7,10,.95)','rgba(255,75,75,.55)',4); circ(306,1520,44,'rgba(255,75,75,.12)');
  for(let i=0;i<3;i++) P.push(`<ellipse cx="${300+i*9}" cy="${1462-i*32}" rx="${26+i*11}" ry="${12+i*5}" fill="rgba(255,75,75,.09)"/>`);

  /* Đường đi xuyên ba vòng, nối đúng các mốc */
  P.push(`<path d="M306,1450 C360,1380 470,1400 558,1376 C640,1350 600,1200 522,1088 C440,980 330,1010 297,944 C262,874 230,760 261,656 C300,540 480,560 567,512 C640,470 400,440 288,368 C210,318 360,270 540,224"
    fill="none" stroke="${ST}.16)" stroke-width="4" stroke-dasharray="12 16"/>`);

  return `<svg viewBox="0 0 900 1600" preserveAspectRatio="none" aria-hidden="true">
    <defs><linearGradient id="rmg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0"   stop-color="#1E1740"/><stop offset=".20" stop-color="#16162E"/>
      <stop offset=".44" stop-color="#0F111A"/><stop offset=".70" stop-color="#1B1310"/>
      <stop offset="1"   stop-color="#0B0D12"/></linearGradient></defs>
    <rect width="900" height="1600" fill="url(#rmg)"/>${P.join('')}</svg>`;
}

/* =====================================================================
   MÀN BẢN ĐỒ
   ===================================================================== */
let RMAP = { yard:null, tick:null, imgTried:false };

function renderRiotMap(){
  if(!riotUnlocked()){ sfx('error',.4); return go('riot'); }   // chưa mở khoá: màn thang tầng đã có sẵn lời giải thích
  settleYards(); riotWeekTick();
  if(!RMAP.imgTried){ RMAP.imgTried=true; loadFirst(RIOT_MAP_IMG).then(src=>{
    const a=$('#rmArt');
    if(src){ a.style.backgroundImage=`url("${absUrl(src)}")`; a.classList.add('has-img'); $('#rmCred').textContent='DISTRICT 07'; }
    else { a.innerHTML=riotMapSvg(); $('#rmCred').textContent='BẢN VẼ TẠM'; }
  }); }
  renderRiotHead(); renderRiotNodes(); riotTickStart();
  if($('#yardSheet').hidden===false && RMAP.yard) renderYard();
}

function renderRiotHead(){
  const o=riotSummary();
  $('#rmSub').textContent = `D07 · ${o.own}/${RIOT_YARDS.length} BÃI` + (o.contested?` · ${o.contested} MẤT`:'');
  $('#rmOwn').textContent = `${o.own}/${RIOT_YARDS.length}`;
  $('#rmRate').innerHTML  = o.own ? `${rn(o.crPerH)} CR<small>/GIỜ</small>${o.shPerH?` · ${o.shPerH} SH<small>/GIỜ</small>`:''}` : '—';
  $('#rmCrates').textContent = o.crates;
  const cd=$('#rmNext');
  cd.textContent = !o.own ? 'CHƯA CHIẾM BÃI NÀO' : o.next==null ? 'ĐẦY TRẦN' : rms(o.next);
  cd.classList.toggle('is-full', o.own>0 && o.next==null);
  const ms=riotCycleMs();
  $('#rmNextBar').style.width = (o.next==null ? 100 : (1-o.next/ms)*100).toFixed(1)+'%';
  const un=riotFeedUnseen(); const fb=$('#rmFeedBtn');
  fb.hidden = !riotStore().feed.length; $('#rmFeedN').textContent=un; fb.classList.toggle('has-new', un>0);
  const w=riotWeekTick(), done=RIOT_WEEK.filter(t=>(w.prog[t.id]||0)>=t.goal).length;
  $('#rmWeekN').textContent=`${done}/${RIOT_WEEK.length}`;
  $('#rmWeekBtn').classList.toggle('has-new', riotWeekClaimable().length>0);
  const btn=$('#btnClaimAll');
  btn.disabled = !o.crates;
  $('#claimAllMeta').textContent = o.crates ? `${o.crates} KIỆN · +${rn(o.cr)} CR${o.sh?` · +${o.sh} SH`:''}`
    : o.own ? 'CHƯA CÓ KIỆN NÀO CHÍN' : 'CHIẾM MỘT CÁI BÃI RỒI ĐÓNG QUÂN VÀO';
  renderWallet();
}

/* Dòng số đang chạy của một bãi đang giữ: "3/8 · 12:47" hoặc "8/8 · ĐẦY TRẦN" */
function yardCd(y, now){
  const s=yst(y.id); if(!s) return '';
  const ms=yardNextMs(y, now);
  return `${s.crates}/${yardCap(y)} · ${ms==null?'ĐẦY TRẦN':rms(ms)}`;
}
/* Trạng thái một nút trên bản đồ */
function yardNode(y){
  if(!yardOpen(y)) return 'locked';
  const s=yst(y.id); if(!s) return 'free';
  if(s.state==='contested') return 'contested';
  return s.crates >= yardCap(y) ? 'full' : 'own';
}
function renderRiotNodes(){
  const box=$('#rmNodes'); box.innerHTML='';
  const now=Date.now();
  RIOT_YARDS.forEach(y=>{
    const st=yardNode(y), s=yst(y.id), side=y.x<50?'r':'l';
    const n=el('button',`ynode ynode--${side} is-${st}`);
    n.dataset.id=y.id; n.style.left=y.x+'%'; n.style.top=y.y+'%';
    /* Thẻ nhãn chỉ chở đúng 3 dòng: tên · tình trạng · con số đang chạy. Thêm chữ nữa là nó xuống dòng
       và đè lên cái bãi bên cạnh (đã dính một lần ở bản đầu). */
    let meta='', cd='', live=false;
    if(st==='locked'){        meta='KHOÁ';                           cd='CẦN TẦNG '+y.need; }
    else if(st==='free'){     meta=`Ổ LOẠN · ${y.plan.length} WAVE`; cd='SỨC MẠNH '+rn(yardPower(y)); }
    else if(st==='contested'){ meta='ĐANG BỊ CHIẾM';                 cd='GIÀNH LẠI'; }
    else { meta=`${s.gar.length}/${y.slots} QUÂN · BẬC ${yardLv(y)}`; live=true;
           cd = yardCd(y, now); }
    /* data-live: chỉ dòng của bãi ĐANG GIỮ mới được đồng hồ ghi đè mỗi giây. Bản đầu quét hết .ynode__cd nên
       bãi khoá và bãi chưa chiếm cũng bị thay thành "ĐẦY TRẦN" — sai hoàn toàn với trạng thái của chúng. */
    n.innerHTML=`<i class="ynode__dot"></i>${s&&s.crates?`<em class="ynode__badge">${s.crates}</em>`:''}
      <span class="ynode__card"><b>${y.name}</b><em>${meta}</em>${cd?`<u class="mono ynode__cd"${live?' data-live="1"':''}>${cd}</u>`:''}</span>`;
    n.addEventListener('click',()=>openYard(y.id));
    box.appendChild(n);
  });
  /* HỐ LOẠN — thang tầng cũ, không phải bãi. Toạ độ khớp miệng hố vẽ trong riotMapSvg() (306,1520 / 900×1600). */
  const p=el('button','ynode ynode--pit ynode--r is-open');
  p.style.left='34%'; p.style.top='95%';
  p.innerHTML=`<i class="ynode__dot"></i><span class="ynode__card"><b>HỐ LOẠN</b><em>THANG VÔ HẠN</em><u class="mono">TẦNG ${PLAYER.riot.tier} · CAO ${PLAYER.riot.best||0}</u></span>`;
  p.addEventListener('click',()=>{ sfx('select',.3); go('riot'); });
  box.appendChild(p);
  /* Sương che phần chưa mở khoá: lùi dần khi leo tầng */
  const open=RIOT_YARDS.filter(yardOpen);
  const top = open.length ? Math.min(...open.map(y=>y.y)) : 100;
  $('#rmFog').style.height=Math.max(0, top-7)+'%';
}

/* Đồng hồ: kết sổ mỗi giây (rẻ — 9 phép chia), có gì đổi thì vẽ lại cả màn, không thì chỉ thay chữ đếm ngược */
function riotTickStart(){
  riotTickStop();
  RMAP.tick=setInterval(()=>{
    if($('#battle').dataset.screen!=='riotmap') return riotTickStop();
    if(settleYards()){ renderRiotHead(); renderRiotNodes(); if(!$('#yardSheet').hidden) renderYard(); return; }
    const now=Date.now(), o=riotSummary(now);
    const cd=$('#rmNext'); cd.textContent = !o.own ? 'CHƯA CHIẾM BÃI NÀO' : o.next==null ? 'ĐẦY TRẦN' : rms(o.next);
    $('#rmNextBar').style.width = (o.next==null?100:(1-o.next/riotCycleMs())*100).toFixed(1)+'%';
    $('#rmNodes').querySelectorAll('.ynode[data-id]').forEach(n=>{
      const u=n.querySelector('.ynode__cd[data-live]'); if(!u) return;
      u.textContent = yardCd(yardById(n.dataset.id), now);
    });
    const y=RMAP.yard&&yardById(RMAP.yard), c=$('#yCd');
    if(c && y && yardOwned(y.id)){ const ms=yardNextMs(y, now); c.textContent = ms==null ? 'ĐẦY TRẦN' : rms(ms); }
  }, 1000);
}
function riotTickStop(){ if(RMAP.tick){ clearInterval(RMAP.tick); RMAP.tick=null; } }

$('#btnClaimAll').addEventListener('click',()=>{
  const g=claimAllYards(); if(!g) return sfx('error',.35);
  sfx('open',.26); renderRiotMap();
  $('#claimAllMeta').textContent=`ĐÃ NHẬN ${g.n} KIỆN · +${rn(g.cr)} CR${g.sh?` · +${g.sh} SH`:''}`;
});

/* ---- Báo cáo vắng mặt ---- */
const RFEED_ICON = { hold:'▲', lost:'✕', full:'■', take:'◆', retake:'◆' };
$('#rmFeedBtn').addEventListener('click',()=>{
  const list=$('#rmFeedList'); list.innerHTML='';
  const f=riotStore().feed;
  if(!f.length) list.innerHTML='<div class="dl__row"><div class="dl__info"><b>CHƯA CÓ GÌ</b><span class="mono">Chiếm một cái bãi rồi đóng quân vào, báo cáo sẽ hiện ở đây.</span></div></div>';
  f.forEach(x=>{
    const ago=Date.now()-x.t, m=Math.round(ago/60000);
    list.insertAdjacentHTML('beforeend',
      `<div class="dl__row rfeed rfeed--${x.kind}"><div class="dl__info"><b>${RFEED_ICON[x.kind]||'·'} ${x.text}</b><span class="mono">${m<1?'vừa xong':m<60?m+' phút trước':Math.floor(m/60)+' giờ trước'}</span></div></div>`);
  });
  riotFeedSeen(); $('#rmFeedBox').hidden=false; sfx('open',.2);
});
$('#rmFeedClose').addEventListener('click',()=>{ $('#rmFeedBox').hidden=true; renderRiotHead(); });

/* ---- Hợp đồng tuần ---- */
function renderWeekList(){
  const w=riotWeekTick(), list=$('#rmWeekList'); list.innerHTML='';
  $('#rmWeekDate').textContent=`RESET THỨ HAI 00:00 · TUẦN ${w.id}`;
  RIOT_WEEK.forEach(t=>{
    const p=w.prog[t.id]||0, done=p>=t.goal, claimed=w.claimed.includes(t.id);
    const r=el('div','dl__row'+(claimed?' is-claimed':''));
    r.innerHTML=`<div class="dl__info"><b>${t.label}</b>
      <div class="bar" data-state="ok" style="--v:${Math.round(p/t.goal*100)}%"><div class="bar__track"><i class="bar__ghost"></i><i class="bar__fill"></i><i class="bar__ticks"></i></div></div>
      <span class="mono">${p}/${t.goal} · +${t.reward} SH</span></div>
      <button class="btn-ghost dl__claim" ${done&&!claimed?'':'disabled'}>${claimed?'ĐÃ NHẬN':done?'NHẬN':'—'}</button>`;
    r.querySelector('.dl__claim').addEventListener('click',()=>{ if(riotWeekClaim(t.id)){ sfx('open',.22); renderWeekList(); renderRiotHead(); } });
    list.appendChild(r);
  });
}
$('#rmWeekBtn').addEventListener('click',()=>{ renderWeekList(); $('#rmWeekBox').hidden=false; sfx('open',.2); });
$('#rmWeekClose').addEventListener('click',()=>{ $('#rmWeekBox').hidden=true; renderRiotHead(); });

/* =====================================================================
   TỜ CHI TIẾT MỘT BÃI — thứ tự đúng bằng thứ tự câu hỏi trong đầu người chơi:
   mình mạnh hơn nó không → cần bao nhiêu quân → được bao nhiêu → khi nào nhận → bao giờ bị đánh → nâng được gì.
   ===================================================================== */
function openYard(id){
  const y=yardById(id); if(!y) return;
  if(!yardOpen(y)){ sfx('error',.4); $('#rmSub').textContent=`KHOÁ — PHẢI THẮNG TẦNG ${y.need} Ở HỐ LOẠN TRƯỚC`; return; }
  sfx('select',.3); RMAP.yard=id; $('#yardSheet').hidden=false;
  const im=$('#yImg'); im.style.backgroundImage='none'; im.classList.remove('has-img');
  loadFirst(yardBg(y)).then(src=>{ if(src && RMAP.yard===id){ im.style.backgroundImage=`url("${absUrl(src)}")`; im.classList.add('has-img'); } });
  renderYard();
}
$('#yClose').addEventListener('click',()=>{ $('#yardSheet').hidden=true; RMAP.yard=null; sfx('cancel',.25); renderRiotMap(); });

function foeLine(y){
  const c={}; y.plan.flat().forEach(id=>c[id]=(c[id]||0)+1);
  return Object.keys(c).map(id=>{ const d=_foe(id); return (d?d.name:id)+(c[id]>1?' ×'+c[id]:''); }).join(' · ');
}
function renderYard(){
  const y=yardById(RMAP.yard); if(!y) return;
  const s=yst(y.id), st=yardNode(y), owned=st==='own'||st==='full', retake=st==='contested';
  const mine=teamPower(TEAM), pw=yardPower(y, retake), v=powerVerdict(mine, pw);
  const max=Math.max(mine,pw)||1;

  $('#yTags').innerHTML=`<span class="ytag ytag--${y.fav}">${y.fav==='rust'?'RUST':'CHROME'}</span><span class="ytag">${y.sub}</span>`
    + (owned?`<span class="ytag ytag--own">ĐANG GIỮ</span>`:retake?`<span class="ytag ytag--bad">ĐANG BỊ CHIẾM</span>`:`<span class="ytag ytag--free">Ổ LOẠN</span>`);
  $('#yName').textContent=y.name;
  $('#yDesc').textContent=y.desc;

  const yl=yardYield(y);
  /* Dự kiến khi đóng đủ quân đúng ngưỡng — để người chơi biết TRƯỚC khi đánh là chiếm về thì được gì */
  const projCr=Math.round(y.cr*RIOT_ECON.lvYield[0]), projSh=Math.round(y.sh*RIOT_ECON.lvYield[0]);
  const cap=yardCap(y), cycMin=RIOT_ECON.cycleMin;
  const H=[];

  /* 1. SỨC MẠNH */
  H.push(`<section class="ysec">
    <h4>1 · SỨC MẠNH</h4>
    <div class="ypw"><span class="lbl">Đội của bạn</span>${rbar(mine/max*100,'rbar--mine')}<b class="mono">${rn(mine)}</b></div>
    <div class="ypw"><span class="lbl">Ổ loạn</span>${rbar(pw/max*100,'rbar--foe')}<b class="mono">${rn(pw)}</b></div>
    <div class="yverdict"><span class="ychip ychip--${v.key}">${v.label}</span><span>${v.hint}</span></div>
    <p class="ynote">${y.plan.length} wave · độ khó ×${yardMult(y,retake)}${y.boss?` · TRÙM ${(_foe(y.boss)||{}).name}`:''}<br>Gặp: ${foeLine(y)}</p>
  </section>`);

  /* 2. ĐỒN TRÚ */
  const gar=(s&&s.gar)||[];
  const slots=Array.from({length:y.slots},(_,i)=>{
    const id=gar[i];
    if(!id) return `<button class="yslot" data-act="pick" ${owned?'':'disabled'}><span class="yslot__plus">+</span><span class="yslot__lbl">${owned?'ĐÓNG QUÂN':'CHƯA CHIẾM'}</span></button>`;
    const d=ROSTER[id];
    return `<button class="yslot is-filled f-${d.faction}${d.faction===y.fav?' is-fav':''}" data-act="drop" data-id="${id}">
      <span class="yslot__p" data-portrait="${id}"></span><span class="yslot__nm">${d.name}</span>
      <span class="yslot__pw mono">${rn(power(id))}</span>${d.faction===y.fav?'<em class="yslot__fav">ƯU THẾ</em>':''}</button>`;
  }).join('');
  H.push(`<section class="ysec">
    <h4>2 · ĐỒN TRÚ</h4>
    <div class="yslots">${slots}</div>
    <div class="ypw"><span class="lbl">Quân đóng</span>${rbar(y.hold?yl.gp/y.hold*100:0, yl.gp>=y.hold?'rbar--ok':'rbar--warn')}<b class="mono">${rn(yl.gp)} / ${rn(y.hold)}</b></div>
    <p class="ynote">Ngưỡng giữ bãi ${rn(y.hold)} = 100% sản lượng. Vượt ngưỡng vẫn có lợi tới ${RIOT_ECON.fillCap*100|0}%.
      Quân phe <b>${y.fav==='rust'?'RUST':'CHROME'}</b> cộng thêm ${RIOT_ECON.favBonus*100|0}% CR.
      Người đang trong đội hình không đóng quân được — đổi ở màn SQUAD.</p>
    ${(owned && gar.length<y.slots && !freeUnits().length)
      ? `<p class="ynote ywarn">Bạn chưa có ai rảnh: cả ${PLAYER.owned.length} người đều đang ra trận.
         Quay một lượt <b>CHIÊU MỘ</b> ở GACHA (600 CR) để có người đóng bãi — bãi không quân thì không đẻ kiện.</p>` : ''}
  </section>`);

  /* 3. THƯỞNG MỖI KIỆN — có quân thì in số thật + công thức; chưa có thì in số DỰ KIẾN ở đúng ngưỡng,
        để người chơi biết chiếm về thì được gì TRƯỚC khi bỏ công đánh. */
  const hasGar = !!(s && s.gar.length);
  H.push(`<section class="ysec">
    <h4>3 · THƯỞNG MỖI KIỆN</h4>
    <div class="ypay"><b class="mono">${hasGar?yl.cr:projCr}<small>CR</small></b><b class="mono">${hasGar?yl.sh:projSh}<small>SH</small></b>
      <span class="lbl">${hasGar?'mỗi kiện, với quân hiện tại':'dự kiến khi đóng đủ quân tới ngưỡng'}</span></div>
    ${hasGar?`<p class="ynote ymath">gốc ${y.cr} × quân ${yl.fill.toFixed(2)} × phe ${yl.fav.toFixed(2)} × bậc ${yl.lvm.toFixed(2)}</p>`:''}
    <p class="ynote">Một kiện chín sau <b>${rdur(cycMin)}</b> · trần <b>${cap} kiện</b> (${rdur(cap*cycMin)}) rồi ngừng đẻ.
      ${hasGar&&owned?`Ở mức này bãi cho <b>${rn(yl.cr*60/cycMin)} CR/giờ</b>.`:''}</p>
  </section>`);

  /* 4. KIỆN HÀNG */
  if(owned||retake){
    const now=Date.now(), ms=yardNextMs(y, now), left=(cap-s.crates);
    H.push(`<section class="ysec">
      <h4>4 · KIỆN HÀNG</h4>
      <div class="ycrate"><b class="mono">${s.crates}/${cap}</b><span class="lbl">kiện đang chờ</span>
        <span class="ycd">${retake?'ĐÓNG BĂNG':'KIỆN TIẾP'} <b class="mono" id="yCd">${retake?'—':(ms==null?'ĐẦY TRẦN':rms(ms))}</b></span></div>
      ${rbar(s.crates/cap*100, s.crates>=cap?'rbar--full':'rbar--ok')}
      <p class="ynote">${retake ? 'Bãi đang bị chiếm: ngừng đẻ kiện, số kiện đã có <b>bị đóng băng chứ không mất</b> — giành lại là nhận được nguyên vẹn.'
        : s.crates>=cap ? 'Đầy trần — thời gian đang trôi đi vô ích. Nhận kiện để bãi chạy lại.'
        : `Còn ${left} kiện nữa là đầy trần, tức khoảng ${rdur(left*cycMin)}.`}</p>
      ${(!retake&&s.crates)?`<button class="btn-act btn-act--full ybtn" data-act="claim"><span class="btn-act__k">Nhận kiện</span><span class="btn-act__v">+${rn(s.cr)} CR${s.sh?` · +${s.sh} SH`:''}</span></button>`:''}
    </section>`);
  }

  /* 5. PHẢN KÍCH */
  if(owned||retake){
    const rp=raidPower(y), ok=yl.gp>=rp, left=RIOT_ECON.raidEvery-(s.rc||0);
    H.push(`<section class="ysec">
      <h4>5 · PHẢN KÍCH</h4>
      <div class="ypw"><span class="lbl">Đợt tới</span>${rbar(rp/Math.max(rp,yl.gp)*100,'rbar--foe')}<b class="mono">${rn(rp)}</b></div>
      <div class="ypw"><span class="lbl">Đồn trú</span>${rbar(yl.gp/Math.max(rp,yl.gp)*100, ok?'rbar--ok':'rbar--warn')}<b class="mono">${rn(yl.gp)}</b></div>
      <div class="yverdict"><span class="ychip ychip--${ok?'over':'dead'}">${ok?'GIỮ ĐƯỢC':'SẼ MẤT BÃI'}</span>
        <span>${retake?'Phải giành lại trước đã.':`còn ${left} chu kỳ (${rdur(left*cycMin)})`}</span></div>
      <p class="ynote">Đã giữ ${(s.held||0)} đợt liên tiếp · mỗi đợt giữ được thì đợt sau mạnh thêm ${RIOT_ECON.raidStep*100|0}%,
        trần ${rn(y.hold*RIOT_ECON.raidCap)}. <b>Đồn trú gấp đôi ngưỡng thì không bao giờ mất bãi.</b>
        Phản kích chỉ nổ trong lúc bãi còn đẻ kiện — đầy trần là mọi thứ đóng băng.</p>
    </section>`);
  }

  /* 6. NÂNG BÃI */
  if(owned){
    const lv=yardLv(y), cost=yardUpCost(y), max5=lv>=RIOT_ECON.maxLv;
    H.push(`<section class="ysec">
      <h4>6 · NÂNG BÃI</h4>
      <div class="ylv">${RIOT_ECON.lvYield.map((_,i)=>`<i class="${i<lv?'on':''}"></i>`).join('')}<b class="mono">BẬC ${lv}/${RIOT_ECON.maxLv}</b></div>
      <p class="ynote">${max5 ? 'Đã kịch bậc: sản lượng ×3, trần 16 kiện (12 giờ).'
        : `BẬC ${lv} → ${lv+1}: sản lượng ×${RIOT_ECON.lvYield[lv-1]} → <b>×${RIOT_ECON.lvYield[lv]}</b> · trần ${cap} → <b>${cap+RIOT_ECON.capPerLv} kiện</b> (${rdur((cap+RIOT_ECON.capPerLv)*cycMin)}).
           Nâng bãi không làm ngưỡng giữ bãi hay phản kích tăng theo.`}</p>
      ${max5?'':`<button class="btn-act btn-act--full ybtn" data-act="up" ${PLAYER.credits<cost?'disabled':''}><span class="btn-act__k">Nâng bậc</span><span class="btn-act__v">${rn(cost)} CR${PLAYER.credits<cost?' · KHÔNG ĐỦ':''}</span></button>`}
    </section>`);
  }

  const body=$('#yBody'); body.innerHTML=H.join('');
  body.querySelectorAll('[data-portrait]').forEach(sp=>{ const d=ROSTER[sp.dataset.portrait]; if(d) sp.appendChild(portraitEl(d)); });

  /* Nút hành động dưới cùng = VIỆC TIẾP THEO đáng làm nhất ở cái bãi này, không phải một nút "đóng" chết */
  const act=$('#yAction'), setAct=(k,vv,kind)=>{ $('#yActK').textContent=k; $('#yActV').textContent=vv; act.disabled=false; act.dataset.kind=kind; };
  if(!owned&&!retake)            setAct('Chiếm bãi', `${y.plan.length} WAVE · ${v.label} · +${rn(yardTakeReward(y,false).credits)} CR`, 'take');
  else if(retake)                setAct('Giành lại', `${y.plan.length} WAVE · ĐỘ KHÓ ×${yardMult(y,true)} · GIỮ NGUYÊN QUÂN VÀ KIỆN`, 'retake');
  else if(s.crates)              setAct('Nhận kiện', `${s.crates} KIỆN · +${rn(s.cr)} CR${s.sh?` · +${s.sh} SH`:''}`, 'claim');
  else if(gar.length<y.slots && freeUnits().length)
                                 setAct('Đóng quân', `CÒN ${y.slots-gar.length} Ô TRỐNG · BÃI TRỐNG QUÂN THÌ KHÔNG ĐẺ KIỆN`, 'pick');
  else                           setAct('Đóng', gar.length<y.slots ? 'CHƯA CÓ AI RẢNH ĐỂ ĐÓNG QUÂN' : 'BÃI ĐANG CHẠY ĐỦ QUÂN', 'close');
}

/* Bấm trong thân tờ chi tiết */
$('#yBody').addEventListener('click', e=>{
  const b=e.target.closest('[data-act]'); if(!b || b.disabled) return;
  const y=yardById(RMAP.yard); if(!y) return;
  if(b.dataset.act==='pick')  return openPick(y);
  if(b.dataset.act==='drop'){ garrisonRemove(y.id, b.dataset.id); sfx('cancel',.25); renderYard(); return renderRiotHead(); }
  if(b.dataset.act==='claim'){ const g=claimYard(y.id); if(g){ sfx('open',.26); renderYard(); renderRiotHead(); renderRiotNodes(); } return; }
  if(b.dataset.act==='up'){
    const r=upgradeYard(y.id);
    if(r==='ok'){ sfx('open',.26); renderYard(); renderRiotHead(); } else sfx('error',.35);
  }
});
$('#yAction').addEventListener('click',()=>{
  const y=yardById(RMAP.yard); if(!y) return;
  const k=$('#yAction').dataset.kind;
  if(k==='close'){ $('#yardSheet').hidden=true; RMAP.yard=null; sfx('cancel',.25); return renderRiotMap(); }
  if(k==='pick')  return openPick(y);
  if(k==='claim'){ const g=claimYard(y.id); if(g){ sfx('open',.26); renderYard(); renderRiotHead(); renderRiotNodes(); } return; }
  SECTOR = yardSector(y, k==='retake');
  $('#yardSheet').hidden=true;
  go('battle');
});

/* ---- Chọn người đóng quân ---- */
function openPick(y){
  const s=yst(y.id); if(!s || s.state!=='own' || s.gar.length>=y.slots) return sfx('error',.35);
  $('#yPickSub').textContent=`${y.name} · CÒN ${y.slots-s.gar.length} Ô · ƯU THẾ PHE ${y.fav==='rust'?'RUST':'CHROME'}`;
  const list=$('#yPickList'); list.innerHTML='';
  const ids=PLAYER.owned.filter(id=>ROSTER[id]).sort((a,b)=>{
    const ba=garrisonBlock(a,y.id)?1:0, bb=garrisonBlock(b,y.id)?1:0;
    return ba-bb || power(b)-power(a);
  });
  ids.forEach(id=>{
    const d=ROSTER[id], block=garrisonBlock(id,y.id), fav=d.faction===y.fav;
    const r=el('button',`gpick f-${d.faction}${block?' is-off':''}${fav?' is-fav':''}`);
    r.innerHTML=`<span class="gpick__p"></span><span class="gpick__i"><b>${d.name}</b>
      <em>${d.tier} · ${d.faction.toUpperCase()}${fav?' · ƯU THẾ +'+(RIOT_ECON.favBonus*100|0)+'%':''}</em></span>
      <span class="gpick__pw mono">${rn(power(id))}${block?`<small>${block}</small>`:''}</span>`;
    r.querySelector('.gpick__p').appendChild(portraitEl(d));
    if(!block) r.addEventListener('click',()=>{
      if(garrisonAdd(y.id, id)){ sfx('select',.3); $('#yPickBox').hidden=true; renderYard(); renderRiotHead(); renderRiotNodes(); }
    });
    list.appendChild(r);
  });
  $('#yPickBox').hidden=false; sfx('open',.2);
}
$('#yPickClose').addEventListener('click',()=>{ $('#yPickBox').hidden=true; });

/* =====================================================================
   TRẬN CHIẾM BÃI — bọc quanh js/battle.js, KHÔNG sửa file đó.
   winReward() chỉ biết hai chế độ (chiến dịch / 'riot'); mode 'yard' đi qua nhánh riêng ở đây.
   ===================================================================== */
const _winReward0 = winReward;
winReward = async function(g){
  if(SECTOR.mode==='yard'){
    dailyProgress('win');
    const y=yardById(SECTOR.yard); if(!y) return '';
    const res=captureYard(y.id), r=res.reward;
    PLAYER.credits+=r.credits; PLAYER.shards+=r.shards; savePlayer();
    return `${res.retake?'GIÀNH LẠI':'CHIẾM ĐƯỢC'} ${y.name} · +${rn(r.credits)} CR · +${r.shards} SH`
         + `<br>${res.retake?'KIỆN ĐÓNG BĂNG ĐÃ ĐƯỢC TRẢ LẠI':'ĐÓNG QUÂN VÀO ĐỂ BÃI BẮT ĐẦU ĐẺ KIỆN'}`;
  }
  if(SECTOR.mode==='riot'){ riotWeekProgress('win'); savePlayer(); }   // tầng ở HỐ LOẠN cũng tính vào hợp đồng tuần
  return _winReward0(g);
};
/* Thắng hay thua ở Khu Đáy đều được về thẳng bản đồ, khỏi đi vòng qua HOME */
const _finish0 = finish;
finish = async function(win){
  const b=$('#btnResRiot'); if(b) b.hidden = !(SECTOR.mode==='yard' || SECTOR.mode==='riot');
  return _finish0(win);
};
