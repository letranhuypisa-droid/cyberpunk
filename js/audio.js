'use strict';
/* =====================================================================
   AUDIO — hai lớp:
   1) SFX giao diện từ gói "Sci Fi UI SFX Pack" của JDSherbert (audio/*.ogg, xem audio/CREDITS.txt)
   2) Âm chiến đấu (hit, crit, heal, ult, KIA, wave) tổng hợp bằng WebAudio — không cần file.
      Thả audio/<tên>.ogg (hoặc .mp3 / .wav) là game dùng file đó thay cho tiếng tổng hợp, không phải sửa code.
      Danh sách tên + prompt tạo bằng AI: docs/sfx-prompts.md
   Tắt/bật ở CONFIG (PLAYER.settings.sfx). Trình duyệt chỉ cho phát sau cú chạm đầu tiên.
   ===================================================================== */
const SFX_EXT = ['ogg','mp3','wav'];
const SFX_BATTLE = ['hit','crit','heal','ult','kia','ready','wave','explode','shock','burn','poison','stun','shield',
                    'victory','defeat','reveal_s','shield_break','upgrade',
                    'tell','tell_up','tell_down','reveal_a','new_char'];   // gacha: nhịp báo trước khi lật thẻ (xem docs/sfx-prompts.md)
/* Tiếng va chạm: một nhịp chỉ cho kêu MỘT tiếng trong nhóm này (SFX_BEAT ms).
   Đòn diện rộng đánh 3 địch = 3 lần gọi, đòn có hiệu ứng riêng còn gọi thêm tiếng hiệu ứng và tiếng trạng thái —
   để tự do là nghe thành một mớ. Thứ tự ưu tiên nằm ở CHỖ GỌI (js/battle.js): gọi tiếng nặng nhất trước, tiếng
   gọi sau trong cùng nhịp bị bỏ. Ngoài nhóm này (ready, ult, wave, victory…) không bị chặn — chúng là tiếng báo,
   mất là người chơi không biết chuyện gì vừa xảy ra. */
const SFX_ONE  = ['hit','crit','kia','explode','shock','burn','poison','stun','shield','shield_break'];
const SFX_BEAT = 140;
/* Tiếng có nhiều bản, bốc ngẫu nhiên mỗi lần kêu cho đỡ nhàm: game tự tìm <tên>2 … <tên>N trong audio/.
   Thiếu bản nào thì bỏ qua bản đó, chỉ còn một bản thì y như cũ. Thả thêm audio/hit3.ogg là dùng ngay, không sửa code. */
const SFX_VARIANTS = { hit:3 };
const AUDIO = {
  /* select · cursor · open đổi sang gói mới đợt 2 (bản mượn cất ở audio/jdsherbert/). File mới kéo đỉnh về −1 dBFS,
     bản mượn thì không (cursor cũ đỉnh −15.7 dB) → số vol ở chỗ gọi phải nhỏ đi tương ứng: cursor ×0,25 · select ×0,7 ·
     open ×0,43. Đổi file khác thì đo lại, đừng sửa file (docs/sfx-prompts.md §1). */
  files:{ select:'audio/select.ogg', cursor:'audio/cursor.ogg', cancel:'audio/cancel.ogg', open:'audio/open.ogg',
          close:'audio/close.ogg', swipe:'audio/swipe.ogg', error:'audio/error.ogg', glitch:'audio/glitch.ogg' },
  pool:{}, ctx:null, master:.8,
  n:0,                                             // đếm số tiếng đã phát — chỗ nút bấm dùng để biết "đã có tiếng rồi"
  on(){ return !(typeof PLAYER!=='undefined' && PLAYER.settings && PLAYER.settings.sfx===false); },
  play(name, vol=.5){
    if(!this.on() || !this.files[name]) return;
    let a=this.pool[name]; if(!a){ a=new Audio(this.files[name]); a.preload='auto'; this.pool[name]=a; }
    const c=a.cloneNode(); c.volume=Math.min(1, vol*this.master); c.play().catch(()=>{}); this.n++;
    return c;
  },
  /* ---- Âm chiến đấu bằng file (tuỳ chọn) ----
     bank: tên → <audio> đã nạp được; null = đã tìm cả 3 đuôi mà không có → giữ tiếng tổng hợp. ---- */
  bank:{},
  probe(name, i=0){
    if(i===0){ if(name in this.bank) return; this.bank[name]=null; }
    if(i>=SFX_EXT.length) return;                                   // hết đuôi file → thôi, dùng WebAudio
    const a=new Audio(`audio/${name}.${SFX_EXT[i]}`); a.preload='auto';
    const ok=()=>{ this.bank[name]=a; };
    a.addEventListener('loadeddata', ok, {once:true}); a.addEventListener('canplay', ok, {once:true});
    a.addEventListener('error', ()=>this.probe(name, i+1), {once:true});
  },
  warm(){ if(this.warmed) return; this.warmed=true;                                            // gọi ở cú chạm đầu
    SFX_BATTLE.forEach(n=>this.probe(n));
    Object.entries(SFX_VARIANTS).forEach(([n,k])=>{ for(let i=2;i<=k;i++) this.probe(n+i); });
  },
  /* Các bản của một tiếng (hit, hit2, hit3…) đã nạp được. Một bản thì trả về chính nó. */
  pick(name){
    const k=SFX_VARIANTS[name]; if(!k) return this.bank[name];
    const ok=[this.bank[name]]; for(let i=2;i<=k;i++) if(this.bank[name+i]) ok.push(this.bank[name+i]);
    return ok.length>1 ? ok[Math.random()*ok.length|0] : ok[0];
  },
  /* true = đã phát bằng file, đã bị chặn vì trùng nhịp, hoặc SFX đang tắt → bỏ qua phần tổng hợp bên dưới */
  clip(name, vol=.5){
    if(!this.on()) return true;
    if(SFX_ONE.includes(name) && !this.gate('_beat', SFX_BEAT)) return true;   // nhịp này đã có tiếng va chạm rồi
    const a=this.pick(name); if(!a){ this.probe(name); return false; }
    const c=a.cloneNode(); c.volume=Math.min(1, vol*this.master); c.play().catch(()=>{}); this.n++;
    return true;
  },
  /* Chặn kêu chồng trong ms mili giây. Hai kiểu dùng:
     · gate('_beat', SFX_BEAT) trong clip() — một nhịp một tiếng va chạm, cho cả nhóm SFX_ONE.
     · gate('<tên>', ms) ở đầu một hàm — chỉ chặn riêng tiếng đó, đang dùng cho heal (400 ms: hồi cả đội một tiếng). */
  gate(name, ms){ const t=performance.now(), L=this._last||(this._last={}); if(L[name] && t-L[name]<ms) return false; L[name]=t; return true; },
  /* Kiểm trong console: AUDIO.list() → tên nào đang chạy bằng file, tên nào còn tổng hợp, tiếng nào có mấy bản */
  list(){ this.warm(); setTimeout(()=>console.table(SFX_BATTLE.map(n=>{
    const ban=[n].concat(SFX_VARIANTS[n] ? Array.from({length:SFX_VARIANTS[n]-1},(_,i)=>n+(i+2)) : []).filter(x=>this.bank[x]);
    return { sfx:n, nguon:this.bank[n]?this.bank[n].src.split('/').pop():'WebAudio', ban:ban.length };
  })), 800); },
  ac(){
    if(!this.ctx){ try{ this.ctx=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){ return null; } }
    if(this.ctx.state==='suspended') this.ctx.resume().catch(()=>{});
    return this.ctx;
  },
  /* tone: tần số, thời lượng (s), dạng sóng, âm lượng, trượt tần số (Hz), trễ (s) */
  tone(freq, dur, type='square', vol=.2, slide=0, delay=0){
    if(!this.on()) return; const c=this.ac(); if(!c) return;
    const t0=c.currentTime+delay, o=c.createOscillator(), g=c.createGain();
    o.type=type; o.frequency.setValueAtTime(freq,t0); if(slide) o.frequency.exponentialRampToValueAtTime(Math.max(20,freq+slide),t0+dur);
    g.gain.setValueAtTime(0,t0); g.gain.linearRampToValueAtTime(vol*this.master,t0+.008); g.gain.exponentialRampToValueAtTime(.0001,t0+dur);
    o.connect(g).connect(c.destination); o.start(t0); o.stop(t0+dur+.02);
  },
  /* noise: tiếng ồn lọc thấp — dùng cho va chạm */
  noise(dur, vol=.3, cutoff=1500, delay=0){
    if(!this.on()) return; const c=this.ac(); if(!c) return;
    const n=Math.floor(c.sampleRate*dur), buf=c.createBuffer(1,n,c.sampleRate), d=buf.getChannelData(0);
    for(let i=0;i<n;i++) d[i]=(Math.random()*2-1)*(1-i/n);
    const s=c.createBufferSource(), f=c.createBiquadFilter(), g=c.createGain(); const t0=c.currentTime+delay;
    s.buffer=buf; f.type='lowpass'; f.frequency.value=cutoff; g.gain.setValueAtTime(vol*this.master,t0); g.gain.exponentialRampToValueAtTime(.0001,t0+dur);
    s.connect(f).connect(g).connect(c.destination); s.start(t0);
  },
  /* Mỗi hàm: có file trong audio/ thì phát file, không thì tổng hợp như cũ. Số sau tên là âm lượng của bản file. */
  hit(){ if(this.clip('hit',.5)) return; this.noise(.09,.35,1800); this.tone(180,.08,'square',.14,-120); },   // gate: SFX_ONE trong clip()
  crit(){ if(this.clip('crit',.6)) return; this.noise(.14,.5,3200); this.tone(340,.12,'sawtooth',.18,-220); this.tone(90,.2,'square',.18,-40,.02); },
  /* Hồi máu cả đội (HỒI MÁU của Psalm, nghỉ giữa wave) gọi heal() cho từng người trong cùng một nhịp →
     gate: một lượt hồi chỉ kêu một tiếng, dù chữa 1 hay 3 người. */
  heal(){ if(!this.gate('heal',400)) return; if(this.clip('heal',.45)) return; this.tone(660,.12,'sine',.12,220); this.tone(990,.16,'sine',.1,260,.09); },
  ult(){ if(this.clip('ult',.7)) return; this.noise(.35,.4,900); this.tone(110,.5,'sawtooth',.2,330); this.tone(55,.6,'square',.15,60,.1); },
  kia(){ if(this.clip('kia',.55)) return; this.tone(150,.35,'sawtooth',.2,-110); this.noise(.3,.3,500,.05); },
  /* Energy đầy: lùi lại một nhịp. Nó luôn kêu cùng lúc với tiếng đấm vừa nạp Energy — đè lên nhau thì mất cả hai,
     mà chặn hẳn thì người chơi không biết chiêu cuối vừa mở. Cho nó kêu SAU tiếng đấm. */
  ready(){ setTimeout(()=>{ if(this.clip('ready',.4)) return; this.tone(880,.06,'square',.08); this.tone(1320,.1,'square',.08,0,.06); }, 320); },
  wave(){ if(this.clip('wave',.55)) return; const g=this.play('glitch',.35); if(g) setTimeout(()=>{ try{ g.pause(); }catch(e){} }, 900); },
  /* Âm theo overlay hiệu ứng (js/fx.js): battle.js gọi AUDIO[kind]() khi đòn có fx riêng / trạng thái tick */
  explode(){ if(this.clip('explode',.6)) return; this.noise(.28,.55,700); this.tone(70,.32,'square',.2,-40); this.tone(160,.12,'sawtooth',.12,-100,.03); },
  shock(){ if(this.clip('shock',.5)) return; this.noise(.12,.3,6000); this.tone(1800,.09,'square',.1,-900); this.tone(2400,.07,'square',.08,-1200,.05); this.tone(900,.1,'sawtooth',.08,-500,.1); },
  burn(){ if(this.clip('burn',.45)) return; this.noise(.22,.25,900); this.tone(220,.18,'sawtooth',.06,120); },
  poison(){ if(this.clip('poison',.45)) return; this.tone(420,.14,'sine',.1,-180); this.tone(300,.16,'sine',.08,-120,.08); this.noise(.1,.15,1200,.04); },
  stun(){ if(this.clip('stun',.5)) return; this.tone(1200,.08,'square',.1,300); this.tone(1500,.08,'square',.1,300,.09); this.tone(1800,.1,'square',.08,300,.18); },
  shield(){ if(this.clip('shield',.5)) return; this.tone(160,.4,'sine',.16,340); this.tone(320,.3,'triangle',.1,220,.05); this.noise(.25,.2,800,.02); },   // vòm khiên dựng lên
  /* Tiếng phụ — không có bản tổng hợp: thiếu file thì im hoặc rơi về tiếng cũ (xem docs/sfx-prompts.md §4) */
  victory(){ this.clip('victory',.7); },
  defeat(){ this.clip('defeat',.7); },
  shield_break(){ if(!this.clip('shield_break',.6)) this.explode(); },
  reveal_s(){ if(!this.clip('reveal_s',.6)) this.play('open',.26); },
  /* ---- Gacha: ba nhịp báo trước khi lật thẻ. Tiếng đi TRƯỚC hình khoảng 200ms mới kịp hồi hộp. ----
     tell = nhịp nền (mọi thẻ) · tell_up = nâng bậc · tell_down = nâng hụt (near-miss) · reveal_a/new_char = lúc lật. */
  tell(){ if(this.clip('tell',.35)) return; this.tone(320,.1,'sine',.09,90); },
  tell_up(){ if(this.clip('tell_up',.5)) return; this.tone(520,.13,'triangle',.13,260); this.tone(780,.12,'sine',.08,180,.06); },
  tell_down(){ if(this.clip('tell_down',.4)) return; this.tone(430,.16,'triangle',.1,-190); },
  reveal_a(){ if(this.clip('reveal_a',.55)) return; this.tone(660,.16,'triangle',.13,220); this.tone(990,.2,'sine',.09,140,.05); },
  new_char(){ if(this.clip('new_char',.5)) return; this.tone(880,.09,'square',.09,120); this.tone(1320,.12,'square',.07,200,.07); },
  upgrade(){ if(!this.clip('upgrade',.38)) this.play('open',.22); },
};
const sfx = (n,v) => AUDIO.play(n,v);

/* Âm giao diện chung: mọi nút bấm. Nút hành động/menu = select, còn lại = cursor. Nút disabled = error.
   MỘT CÚ BẤM = MỘT TIẾNG. Listener này chạy ở pha capture, tức là TRƯỚC hàm xử lý của nút, nên nút nào tự kêu
   tiếng riêng (nhận thưởng ngày = open, nâng cấp = upgrade, tab ARCHIVE = cursor) là kêu hai tiếng chồng nhau.
   Cách chặn: nhớ số tiếng đã phát rồi hoãn tiếng bấm sang cuối lượt xử lý — hàm của nút chạy xong mà đã có tiếng
   nào phát ra thì thôi, không kêu nữa. Nút nào muốn im hẳn thì thêm vào SFX_MUTE. */
const SFX_MUTE = '#btnAttack';                     // Đòn thường: im lúc bấm, tiếng đấm lúc trúng là đủ
document.addEventListener('click', e=>{
  AUDIO.warm();                                    // cú chạm đầu: đi tìm file âm chiến đấu, kịp trước khi vào trận
  const t=e.target.closest('button,.card,.tile,.srow,.tslot,.comms');
  if(!t || t.matches(SFX_MUTE)) return;
  if(t.disabled){ sfx('error',.4); return; }
  const n=AUDIO.n;
  setTimeout(()=>{
    if(AUDIO.n!==n) return;                        // hàm của nút đã tự kêu rồi
    if(t.matches('.btn-act,.menu__btn,.btn-ult,.srow')) sfx('select',.35);
    else if(t.matches('.story__box')) sfx('cursor',.07);
    else sfx('cursor',.1);
  }, 0);
}, true);
