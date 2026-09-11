'use strict';
/* FX — overlay hiệu ứng trên sprite: đòn trúng (một lần) và trạng thái (lặp).
   Nạp sau core.js (dùng el, loadFirst, absUrl, reduced), trước battle.js. kit.html cũng nạp để xem thử (mục B9).
   CSS ở css/fx.css. Không có ảnh thì vẽ bằng CSS (placeholder). Có ảnh thì dùng ảnh:
     art/fx/<kind>.webp        — bản một lần (hit, crit, explode, shock, poison, burn, stun, heal)
     art/fx/<kind>_loop.webp   — bản lặp khi unit còn dính trạng thái (poison, burn, stun)
   Ảnh = sprite sheet ô vuông, FX_SHEET.cols cột, số hàng suy từ kích thước ảnh, chạy FX_SHEET.fps.
   Làm sheet từ video nền xanh: python scratch/fx_sheet.py — quy cách và prompt ở docs/fx-prompts.md.
   Animation chí mạng của bạn: thả art/fx/crit.webp là game dùng, không sửa code. */

/* fy = tâm hiệu ứng theo % chiều cao hộp sprite (0 = đỉnh, 100 = sàn) · fw = bề rộng theo % bề rộng hộp ·
   ms = thời lượng placeholder CSS (sheet thì theo số frame / fps) · loop = vị trí bản lặp */
const FX_META = {
  hit:     { ms:420, fy:48, fw:120 },
  crit:    { ms:520, fy:46, fw:140 },
  zero:    { ms:540, fy:46, fw:150 },   // ZERO của Yuki: một nhát dọc tím chrome, xem .fx--zero trong css/fx.css
  explode: { ms:640, fy:52, fw:150 },
  shock:   { ms:520, fy:46, fw:135 },
  poison:  { ms:560, fy:52, fw:110, loop:{ fy:55, fw:100 } },
  burn:    { ms:600, fy:66, fw:115, loop:{ fy:74, fw:105 } },
  stun:    { ms:600, fy:10, fw:80,  loop:{ fy:6,  fw:80  } },
  heal:    { ms:700, fy:50, fw:120 },
  shield:  { ms:700, fy:50, fw:135, loop:{ fy:50, fw:130 } },   // lá chắn (FIRE STORM của Kiln): loé một lần lúc dựng/chặn + vòm lửa lặp khi còn khiên
};
const FX_SHEET = { dir:'art/fx/', cols:6, fps:24, fpsLoop:16 };

const FX = {
  sheets:new Map(),   // tên → Promise<meta|null>
  ready:new Map(),    // tên → meta đã nạp xong (đọc đồng bộ giữa đòn, không chờ mạng)
  reg:new Map(), raf:0,
  /* Tìm sheet cho kind (+loop). Kết quả cache; thiếu file → null (và CSS placeholder được dùng). */
  sheet(kind, loop){
    const name=kind+(loop?'_loop':''); if(this.sheets.has(name)) return this.sheets.get(name);
    const p=(async()=>{
      const src=await loadFirst([FX_SHEET.dir+name+'.webp']); if(!src) return null;
      const im=new Image(); await new Promise(r=>{ im.onload=r; im.onerror=r; im.src=src; });
      if(!im.naturalWidth) return null;
      const cols=FX_SHEET.cols, frame=im.naturalWidth/cols, rows=Math.max(1,Math.round(im.naturalHeight/frame));
      return { src, cols, rows, count:cols*rows, fps:loop?FX_SHEET.fpsLoop:FX_SHEET.fps };
    })();
    p.then(v=>this.ready.set(name,v));
    this.sheets.set(name,p); return p;
  },
  preloadAll(){ Object.keys(FX_META).forEach(k=>{ this.sheet(k,false); if(FX_META[k].loop) this.sheet(k,true); }); },
  /* Lớp chứa hiệu ứng: .unit__fx trong .unit__pose (đi theo sprite khi lao tới / nhấp nhô). Tạo khi cần. */
  host(t){
    const root = t && t.el ? t.el : t; if(!root || !root.querySelector) return null;
    const pose = root.querySelector('.unit__pose') || root;
    let h = pose.querySelector(':scope > .unit__fx');
    if(!h){ h=el('div','unit__fx'); pose.appendChild(h); }
    return h;
  },
  /* Một lần. t = unit (có .el) hoặc phần tử .unit. opts: flip (đòn đến từ bên phải), delay (ms), fy/fw (đè vị trí), force (kể cả khi giảm chuyển động) */
  play(t, kind, opts={}){
    const m=FX_META[kind]; const host=this.host(t); if(!m||!host) return;
    if(reduced() && !opts.force) return;
    const run=()=>{
      if(!host.isConnected) return;
      const e=el('i',`fx fx--${kind}${opts.flip?' fx--flip':''}`,'<b></b>');
      e.style.setProperty('--fy',(opts.fy!=null?opts.fy:m.fy)+'%'); e.style.setProperty('--fw',(opts.fw!=null?opts.fw:m.fw)+'%');
      host.appendChild(e);
      const done=()=>{ this.reg.delete(e); e.remove(); };
      const s=this.ready.get(kind);
      if(s) this.runSheet(e, s, false, done); else setTimeout(done, m.ms);
    };
    if(opts.delay) setTimeout(run, opts.delay); else run();
  },
  /* Lặp theo trạng thái: kinds = các kind đang dính. Thêm cái thiếu, gỡ cái thừa. */
  loops(t, kinds){
    const host=this.host(t); if(!host) return;
    host.querySelectorAll('.fx--loop').forEach(e=>{ if(!kinds.includes(e.dataset.kind)){ this.reg.delete(e); e.remove(); } });
    kinds.forEach(kind=>{
      const m=FX_META[kind]; if(!m||!m.loop || host.querySelector(`.fx--loop[data-kind="${kind}"]`)) return;
      const e=el('i',`fx fx--loop fx--${kind}`,'<b></b>'); e.dataset.kind=kind;
      e.style.setProperty('--fy',m.loop.fy+'%'); e.style.setProperty('--fw',m.loop.fw+'%');
      host.appendChild(e);
      const s=this.ready.get(kind+'_loop'); if(s) this.runSheet(e, s, true);
    });
  },
  clear(t){ const host=this.host(t); if(host){ host.querySelectorAll('.fx').forEach(e=>this.reg.delete(e)); host.innerHTML=''; } },
  /* Sheet: một vòng requestAnimationFrame cho mọi hiệu ứng đang chạy */
  runSheet(e, s, loop, done){
    e.classList.add('fx--sheet');
    e.style.setProperty('--fxsheet',`url("${absUrl(s.src)}")`);
    e.style.setProperty('--fxsize',(s.cols*100)+'% '+(s.rows*100)+'%');
    e.style.setProperty('--fxpos', this.pos(s,0));
    this.reg.set(e,{ s, i:0, next:0, loop, done });
    if(!this.raf) this.raf=requestAnimationFrame(FX.tick);
  },
  pos(s,i){ const c=i%s.cols, r=(i/s.cols)|0; return (s.cols>1?c*100/(s.cols-1):0)+'% '+(s.rows>1?r*100/(s.rows-1):0)+'%'; },
  tick(now){
    FX.raf = FX.reg.size ? requestAnimationFrame(FX.tick) : 0;
    for(const [e,st] of FX.reg){
      if(!e.isConnected){ FX.reg.delete(e); continue; }
      if(now<st.next) continue;
      st.next=now+1000/st.s.fps; st.i++;
      if(st.i>=st.s.count){ if(st.loop) st.i=0; else { FX.reg.delete(e); if(st.done) st.done(); continue; } }
      e.style.setProperty('--fxpos', FX.pos(st.s,st.i));
    }
  },
};
const playFx     = (t,kind,opts) => FX.play(t,kind,opts);
const setFxLoops = (t,kinds)     => FX.loops(t,kinds);
