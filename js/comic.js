'use strict';
/* COMIC — trang truyện tranh cho intro/outro sector: layout panel, ảnh + fallback, bong bóng hiện dần, lật trang.
   Dữ liệu trang nằm ở js/story.js. playComic(pages, sector, kind) → Promise (resolve khi đọc hết hoặc SKIP).
   Ảnh riêng cho từng panel: art/comic/<sector>_<i|o><trang>_p<panel>.jpg — có file là tự dùng, không có thì rơi về
   danh sách img trong data, rồi về nền gradient + silhouette. */

/* Tỉ lệ ô đo thật ở 375×812 — art phải cắt sẵn đúng số này vì css .panel.has-art bỏ pos/zoom:
   splash 0.52 · v2 0.997 · h2 0.26 · w3 ô rộng 0.93, ô nhỏ 0.52 · v3 ~1.6 · g4 0.52
   `ar` = khổ ghi trong docs/comic-prompts.md cho ô thường, `arWide` cho ô `wide`. Để ở đây làm bản gốc
   duy nhất: scratch/comic_lint.js đọc thẳng bảng này, thêm layout mới là lint biết ngay, không phải chép tay. */
const LAYOUTS = {
  splash:{ cells:1, css:'1fr / 1fr', ar:'9:16' },
  v2:    { cells:2, css:'1fr 1fr / 1fr', ar:'1:1' },
  h2:    { cells:2, css:'1fr / 1fr 1fr', ar:'9:16' },
  w3:    { cells:3, css:'1.15fr 1fr / 1fr 1fr', wide:0, ar:'9:16', arWide:'1:1' },
  w3b:   { cells:3, css:'1fr 1.15fr / 1fr 1fr', wide:2, ar:'9:16', arWide:'1:1' },   // ngược của w3: hai ô dọc ở trên, một ô rộng ở dưới
  v3:    { cells:3, css:'1fr 1fr 1fr / 1fr', ar:'3:2' },   // ba dải ngang xếp chồng — chỗ duy nhất hợp với art khổ ngang
  g4:    { cells:4, css:'1fr 1fr / 1fr 1fr', ar:'9:16' },
};
const TAIL_FOR = { tl:'bl', t:'bl', tr:'br', bl:'tl', b:'tl', br:'tr', c:'bl' };   // đuôi mặc định theo vị trí bong bóng
const COMIC = { box:null, running:null };
function comicUI(){
  if(!COMIC.box){ COMIC.box=$('#comic'); COMIC.stage=$('#comicStage'); COMIC.ctr=$('#comicCtr'); COMIC.where=$('#comicWhere'); COMIC.hint=$('#comicHint'); COMIC.skip=$('#comicSkip'); }
  return COMIC;
}
/* Tên file ảnh riêng của panel: art/comic/00t_i1_p2.jpg = sector 00-T, intro, trang 1, panel 2 */
const comicImgName = (sid, kind, pageNo, panelNo) => `art/comic/${String(sid).toLowerCase().replace(/[^a-z0-9]/g,'')}_${kind==='outro'?'o':'i'}${pageNo}_p${panelNo}.jpg`;

function bubbleEl(b){
  const d=speakerDef(b.who);
  const e=el('div',`bub bub--${b.kind||'speech'} bub--${b.at||'bl'}`);
  if(b.kind==='speech'||b.kind==='thought') e.dataset.tail = b.tail || TAIL_FOR[b.at||'bl'] || 'bl';
  if(d) e.style.setProperty('--fac', d.faction==='rust' ? 'var(--rust)' : 'var(--chrome)');
  const label = b.as || (d ? d.name : null);
  const who = label && b.kind!=='caption' && b.kind!=='sfx' ? `<b class="bub__who">${label}</b>` : '';
  if(b.kind==='shout') e.innerHTML=`<span class="bub__in">${who}<span class="bub__t">${b.text}</span></span>`;
  else e.innerHTML=`${who}<span class="bub__t">${b.text}</span>`;
  if(!(b.kind==='sfx'||b.auto)) e.classList.add('is-hid');
  return e;
}
function panelEl(p, sid, kind, pageNo, idx){
  const f=el('figure','panel');
  f.style.setProperty('--pos', p.pos||'50% 30%'); f.style.setProperty('--zoom', p.zoom||1);
  if(p.tint) f.classList.add('panel--'+p.tint);
  const list=[comicImgName(sid,kind,pageNo,idx+1), ...(p.img||[])];
  const img=el('img','panel__img'); img.alt=''; f.appendChild(img);
  f.appendChild(el('div','panel__ph'));
  if(p.sil){ const s=el('div','panel__sil'); s.innerHTML=`<div class="sil ${p.sil==='rust'?'sil--rust':''}"></div>`; f.appendChild(s); }
  /* has-art = ảnh vẽ riêng → ẩn silhouette, bỏ zoom, và neo lại bằng p.artPos (mặc định giữa khung).
     `pos` của panel chỉ hợp cho ảnh tạm; ảnh vẽ riêng cần neo riêng vì ô co giãn theo chiều cao màn. */
  loadFirst(list).then(src=>{ if(src){ img.src=src; f.classList.add('has-img');
    if(src===encodeURI(list[0])){ f.classList.add('has-art'); f.style.setProperty('--pos', p.artPos || '50% 50%'); } } });
  if(p.fg){
    const fg=el('img','panel__fg'); fg.alt='';
    if(p.fgFlip) fg.classList.add('is-flip'); if(p.fgX) fg.style.setProperty('--fgx',p.fgX); if(p.fgH) fg.style.setProperty('--fgh',p.fgH);
    loadFirst(p.fg).then(src=>{ if(src){ fg.src=src; fg.classList.add('has-img'); } }); f.appendChild(fg);
  }
  f.appendChild(el('i','panel__tone'));
  /* stack:true → xếp bong bóng thành cột (flex) thay vì neo tuyệt đối.
     Neo tuyệt đối `c` luôn căn giữa 50% nên khi chữ dài ra là đè lên khối ở dưới — thấy rõ trên máy thấp
     (iPhone SE 375×667). Cột flex thì các khối KHÔNG THỂ đè nhau; `at` chỉ còn quyết định lệch trái/giữa/phải.
     Chữ tượng thanh (sfx) vẫn neo tuyệt đối vì nó trong suốt, cố tình nằm đè lên tranh. */
  if(p.stack && (p.bubbles||[]).filter(b=>b.kind!=='sfx').length>1){
    const wrap=el('div','panel__bubs'+(p.stack==='end'?' panel__bubs--end':''));   // 'end' = dồn cả cột xuống đáy, chừa nửa trên cho tranh
    p.bubbles.forEach(b=>(b.kind==='sfx'?f:wrap).appendChild(bubbleEl(b)));
    f.appendChild(wrap);
  } else (p.bubbles||[]).forEach(b=>f.appendChild(bubbleEl(b)));
  return f;
}

function playComic(pages, sector, kind='intro'){
  return new Promise(res=>{
    const U=comicUI(); if(!pages||!pages.length) return res();
    if(COMIC.running) COMIC.running();                       // đang có truyện khác chạy → kết thúc nó trước
    const sid=(sector&&sector.id)||'BASE';
    U.where.textContent = sector ? `${sector.id} · ${sector.name}` : 'COMMS';
    U.box.hidden=false; let i=0, done=false, busy=false, cur=null;
    const end=()=>{ if(done) return; done=true; COMIC.running=null; U.box.hidden=true; U.stage.innerHTML=''; U.stage.onclick=null; U.skip.onclick=null; document.removeEventListener('keydown',onKey); res(); };
    COMIC.running=end;
    const hidden=()=>cur?[...cur.querySelectorAll('.bub.is-hid')]:[];
    const setHint=()=>{ U.hint.textContent = hidden().length ? 'CHẠM ▸' : (i>=pages.length-1 ? 'KẾT ▸' : 'TRANG SAU ▸'); };
    const render=async()=>{
      const pg=pages[i]; const L=LAYOUTS[pg.layout]||LAYOUTS.splash;
      const pe=el('div',`page page--${pg.layout||'splash'}`); pe.style.gridTemplate=L.css; if(pg.fx) pe.dataset.fx=pg.fx;
      pg.panels.slice(0,L.cells).forEach((p,k)=>{ const f=panelEl(p,sid,kind,i+1,k); if(L.wide===k) f.classList.add('panel--wide'); pe.appendChild(f); });
      U.ctr.textContent=`TRANG ${i+1}/${pages.length}`;
      const old=cur; cur=pe; U.stage.appendChild(pe);
      if(!reduced()){ pe.classList.add('is-in'); if(old) old.classList.add('is-out'); await wait(320); }
      if(old) old.remove(); pe.classList.remove('is-in');
      const first=hidden()[0]; if(first) first.classList.remove('is-hid');   // bong bóng đầu hiện ngay, trang không bao giờ trống
      setHint();
    };
    const tap=async()=>{
      if(busy||done) return;
      const h=hidden();
      if(h.length){ h[0].classList.remove('is-hid'); sfx('cursor',.07); setHint(); return; }
      if(i>=pages.length-1) return end();
      busy=true; i++; sfx('swipe',.3); await render(); busy=false;
    };
    const onKey=e=>{ if(e.key==='Escape'){ e.preventDefault(); end(); } else if(e.key===' '||e.key==='Enter'||e.key==='ArrowRight'){ e.preventDefault(); tap(); } };
    U.stage.onclick=tap; U.skip.onclick=e=>{ e.stopPropagation(); end(); }; document.addEventListener('keydown',onKey);
    render();
  });
}
/* Kết thúc truyện đang chạy (khi rời màn battle) */
function comicEnd(){ if(COMIC.running) COMIC.running(); }
