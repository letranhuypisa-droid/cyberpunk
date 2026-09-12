'use strict';
/* COMIC — trang truyện tranh cho intro/outro sector: layout panel, ảnh + fallback, bong bóng hiện dần, lật trang.
   Dữ liệu trang nằm ở js/story.js. playComic(pages, sector, kind) → Promise (resolve khi đọc hết hoặc SKIP).
   Ảnh riêng cho từng panel: art/comic/<sector>_<i|o><trang>_p<panel>.jpg — có file là tự dùng, không có thì rơi về
   danh sách img trong data, rồi về nền gradient + silhouette. */

/* Tỉ lệ ô đo thật ở 375×812 — ảnh panel cắt sẵn theo số này:
   splash 0.49 · v2 1.00 · h2 0.26 · w3 ô rộng 0.93, ô nhỏ 0.52 · v3 1.51 · g4 0.52
   NHƯNG ô co giãn theo chiều cao màn (ở 375×667 mọi ô lệch ~21%), nên ảnh vẽ tay dán bằng `contain` chứ không
   `cover`: thà chừa viền còn hơn xén mất mặt nhân vật. Chỗ chừa lấp bằng chính ảnh đó phóng to + làm mờ.
   Xem docs/comic-reader.md §2. Đo lại bằng `node scratch/comic_fit.js`.
   `ar` = khổ ghi trong docs/comic-prompts.md cho ô thường, `arWide` cho ô `wide`. Bảng này là bản gốc DUY NHẤT:
   scratch/comic_lint.js đọc thẳng nó, thêm layout mới là lint biết ngay, không phải chép tay sang chỗ khác. */
const LAYOUTS = {
  splash:{ cells:1, css:'1fr / 1fr', ar:'9:16' },
  v2:    { cells:2, css:'1fr 1fr / 1fr', ar:'1:1' },
  h2:    { cells:2, css:'1fr / 1fr 1fr', ar:'9:16' },
  w3:    { cells:3, css:'1.15fr 1fr / 1fr 1fr', wide:0, ar:'9:16', arWide:'1:1' },
  w3b:   { cells:3, css:'1fr 1.15fr / 1fr 1fr', wide:2, ar:'9:16', arWide:'1:1' },   // ngược của w3: hai ô dọc ở trên, một ô rộng ở dưới
  v3:    { cells:3, css:'1fr 1fr 1fr / 1fr', ar:'3:2' },   // ba dải ngang xếp chồng — chỗ duy nhất hợp với art khổ ngang
  g4:    { cells:4, css:'1fr 1fr / 1fr 1fr', ar:'9:16' },
};
const COMIC = { box:null, running:null };
function comicUI(){
  if(!COMIC.box){ COMIC.box=$('#comic'); COMIC.stage=$('#comicStage'); COMIC.ctr=$('#comicCtr'); COMIC.where=$('#comicWhere'); COMIC.hint=$('#comicHint');
                  COMIC.skip=$('#comicSkip'); COMIC.back=$('#comicBack'); }
  return COMIC;
}
/* Tên file ảnh riêng của panel: art/comic/00t_i1_p2.jpg = sector 00-T, intro, trang 1, panel 2 */
const comicImgName = (sid, kind, pageNo, panelNo) => `art/comic/${String(sid).toLowerCase().replace(/[^a-z0-9]/g,'')}_${kind==='outro'?'o':'i'}${pageNo}_p${panelNo}.jpg`;

/* Bong bóng KHÔNG có đuôi chỉ vào người nói (bỏ 12/09): bong bóng nằm ở dải chữ dưới tranh nên đuôi luôn chỉ
   sai chỗ. Ai nói thì đọc ở nhãn <b class="bub__who">. `at` từ nay chỉ còn quyết định lệch trái / giữa / phải. */
function bubbleEl(b){
  const d=speakerDef(b.who);
  const e=el('div',`bub bub--${b.kind||'speech'} bub--${b.at||'bl'}`);
  if(d) e.style.setProperty('--fac', d.faction==='rust' ? 'var(--rust)' : 'var(--chrome)');
  const label = b.as || (d ? d.name : null);
  const who = label && b.kind!=='caption' && b.kind!=='sfx' ? `<b class="bub__who">${label}</b>` : '';
  if(b.kind==='shout') e.innerHTML=`<span class="bub__in">${who}<span class="bub__t">${b.text}</span></span>`;
  else e.innerHTML=`${who}<span class="bub__t">${b.text}</span>`;
  if(!(b.kind==='sfx'||b.auto)) e.classList.add('is-hid');
  return e;
}
/* Panel = hai tầng: TRANH ở trên (.panel__art), CHỮ ở dưới (.panel__bubs) — xem docs/comic-reader.md §3.
   Chữ không còn đè lên tranh, nên không che mặt nhân vật nữa; đổi lại tranh nhỏ đi phần nhường cho chữ
   (css giữ cho tranh tối thiểu 46% chiều cao panel). Chữ tượng thanh (sfx) là ngoại lệ: vẫn neo đè lên tranh
   vì nó trong suốt và cố ý nằm trên tranh. `stack` trong js/story.js thành thừa — mọi panel đều xếp cột. */
function panelEl(p, sid, kind, pageNo, idx){
  const f=el('figure','panel');
  if(p.tint) f.classList.add('panel--'+p.tint);
  const art=el('div','panel__art');
  art.style.setProperty('--pos', p.pos||'50% 30%'); art.style.setProperty('--zoom', p.zoom||1);
  const list=[comicImgName(sid,kind,pageNo,idx+1), ...(p.img||[])];
  const bg=el('img','panel__bg'); bg.alt='';   // bản phóng to + làm mờ, lấp chỗ chừa hai bên / trên dưới của `contain`
  const img=el('img','panel__img'); img.alt=''; art.append(bg,img);
  art.appendChild(el('div','panel__ph'));
  if(p.sil){ const s=el('div','panel__sil'); s.innerHTML=`<div class="sil ${p.sil==='rust'?'sil--rust':''}"></div>`; art.appendChild(s); }
  /* has-art = ảnh vẽ riêng → ẩn silhouette, dán `contain` (không bao giờ xén), bỏ pos/zoom.
     `pos`/`zoom`/`artPos` chỉ còn tác dụng với ảnh tạm (thẻ nhân vật, nền sector) vì ảnh tạm vẫn dán `cover`. */
  loadFirst(list).then(src=>{ if(!src) return; img.src=src; f.classList.add('has-img');
    if(src===encodeURI(list[0])){ f.classList.add('has-art'); bg.src=src; } });
  if(p.fg){
    const fg=el('img','panel__fg'); fg.alt='';
    if(p.fgFlip) fg.classList.add('is-flip'); if(p.fgX) fg.style.setProperty('--fgx',p.fgX); if(p.fgH) fg.style.setProperty('--fgh',p.fgH);
    loadFirst(p.fg).then(src=>{ if(src){ fg.src=src; fg.classList.add('has-img'); } }); art.appendChild(fg);
  }
  art.appendChild(el('i','panel__tone'));
  f.appendChild(art);
  const bubs=p.bubbles||[];
  /* Lớp neo chữ tượng thanh: cao đúng bằng phần tranh CÒN THẤY (panel trừ cột chữ), nên `bl`/`b`/`br` rơi lên
     tranh chứ không chui xuống dưới cột chữ. Trong suốt, không bắt chạm. */
  const sfxLayer=el('div','panel__sfx');
  bubs.filter(b=>b.kind==='sfx').forEach(b=>sfxLayer.appendChild(bubbleEl(b)));
  f.appendChild(sfxLayer);
  const talk=bubs.filter(b=>b.kind!=='sfx');
  if(talk.length){ const wrap=el('div','panel__bubs'); talk.forEach(b=>wrap.appendChild(bubbleEl(b))); f.appendChild(wrap); }
  return f;
}

/* opt.replay = mở lại từ Archive (đọc lại), khác lần đọc trong mạch chơi: nút thoát ghi ĐÓNG thay vì SKIP. */
function playComic(pages, sector, kind='intro', opt={}){
  return new Promise(res=>{
    const U=comicUI(); if(!pages||!pages.length) return res();
    if(COMIC.running) COMIC.running();                       // đang có truyện khác chạy → kết thúc nó trước
    const sid=(sector&&sector.id)||'BASE';
    U.where.textContent = sector ? `${sector.id} · ${sector.name}` : 'COMMS';
    U.skip.textContent = opt.replay ? 'ĐÓNG ✕' : 'SKIP ▸';
    U.box.hidden=false; let i=0, seenTo=0, done=false, busy=false, cur=null;   // seenTo = trang xa nhất đã đọc
    const end=()=>{ if(done) return; done=true; COMIC.running=null; U.box.hidden=true; U.stage.innerHTML=''; U.stage.onclick=null; U.skip.onclick=null; U.back.onclick=null; document.removeEventListener('keydown',onKey); res(); };
    COMIC.running=end;
    const hidden=()=>cur?[...cur.querySelectorAll('.bub.is-hid')]:[];
    const setHint=()=>{
      U.hint.textContent = hidden().length ? 'CHẠM ▸' : (i>=pages.length-1 ? 'KẾT ▸' : 'TRANG SAU ▸');
      U.back.disabled = i<=0;
    };
    /* seen = trang đã đọc rồi (lùi lại hoặc tiến lại) → hiện sẵn đủ bong bóng, không bắt bấm lại từng câu */
    const render=async(seen)=>{
      const pg=pages[i]; const L=LAYOUTS[pg.layout]||LAYOUTS.splash;
      const pe=el('div',`page page--${pg.layout||'splash'}`); pe.style.gridTemplate=L.css; if(pg.fx) pe.dataset.fx=pg.fx;
      pg.panels.slice(0,L.cells).forEach((p,k)=>{ const f=panelEl(p,sid,kind,i+1,k); if(L.wide===k) f.classList.add('panel--wide'); pe.appendChild(f); });
      U.ctr.textContent=`TRANG ${i+1}/${pages.length}`;
      const old=cur; cur=pe; U.stage.appendChild(pe);
      if(!reduced()){ pe.classList.add(seen?'is-back':'is-in'); if(old) old.classList.add(seen?'is-out-back':'is-out'); await wait(320); }
      if(old) old.remove(); pe.classList.remove('is-in','is-back');
      // bong bóng đầu hiện ngay, trang không bao giờ trống; trang đã đọc thì hiện hết
      if(seen) hidden().forEach(b=>b.classList.remove('is-hid'));
      else { const first=hidden()[0]; if(first) first.classList.remove('is-hid'); }
      setHint();
    };
    const tap=async()=>{
      if(busy||done) return;
      const h=hidden();
      if(h.length){ h[0].classList.remove('is-hid'); sfx('cursor',.07); setHint(); return; }
      if(i>=pages.length-1) return end();
      busy=true; i++; sfx('swipe',.3); await render(i<=seenTo); seenTo=Math.max(seenTo,i); busy=false;
    };
    const back=async()=>{
      if(busy||done||i<=0) return;
      busy=true; i--; sfx('swipe',.3); await render(true); busy=false;
    };
    const onKey=e=>{
      if(e.key==='Escape'){ e.preventDefault(); end(); }
      else if(e.key===' '||e.key==='Enter'||e.key==='ArrowRight'){ e.preventDefault(); tap(); }
      else if(e.key==='ArrowLeft'||e.key==='Backspace'){ e.preventDefault(); back(); }
    };
    U.stage.onclick=tap;
    U.skip.onclick=e=>{ e.stopPropagation(); end(); };
    U.back.onclick=e=>{ e.stopPropagation(); back(); };
    document.addEventListener('keydown',onKey);
    render(false);
  });
}
/* Kết thúc truyện đang chạy (khi rời màn battle) */
function comicEnd(){ if(COMIC.running) COMIC.running(); }
