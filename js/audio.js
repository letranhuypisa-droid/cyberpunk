'use strict';
/* =====================================================================
   AUDIO — hai lớp:
   1) SFX giao diện từ gói "Sci Fi UI SFX Pack" của JDSherbert (audio/*.ogg, xem audio/CREDITS.txt)
   2) Âm chiến đấu (hit, crit, heal, ult, KIA, wave) tổng hợp bằng WebAudio — không cần file.
   Tắt/bật ở CONFIG (PLAYER.settings.sfx). Trình duyệt chỉ cho phát sau cú chạm đầu tiên.
   ===================================================================== */
const AUDIO = {
  files:{ select:'audio/select.ogg', cursor:'audio/cursor.ogg', cancel:'audio/cancel.ogg', open:'audio/open.ogg',
          close:'audio/close.ogg', swipe:'audio/swipe.ogg', error:'audio/error.ogg', glitch:'audio/glitch.ogg' },
  pool:{}, ctx:null, master:.8,
  on(){ return !(window.PLAYER && PLAYER.settings && PLAYER.settings.sfx===false); },
  play(name, vol=.5){
    if(!this.on() || !this.files[name]) return;
    let a=this.pool[name]; if(!a){ a=new Audio(this.files[name]); a.preload='auto'; this.pool[name]=a; }
    const c=a.cloneNode(); c.volume=Math.min(1, vol*this.master); c.play().catch(()=>{});
    return c;
  },
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
  hit(){ this.noise(.09,.35,1800); this.tone(180,.08,'square',.14,-120); },
  crit(){ this.noise(.14,.5,3200); this.tone(340,.12,'sawtooth',.18,-220); this.tone(90,.2,'square',.18,-40,.02); },
  heal(){ this.tone(660,.12,'sine',.12,220); this.tone(990,.16,'sine',.1,260,.09); },
  ult(){ this.noise(.35,.4,900); this.tone(110,.5,'sawtooth',.2,330); this.tone(55,.6,'square',.15,60,.1); },
  kia(){ this.tone(150,.35,'sawtooth',.2,-110); this.noise(.3,.3,500,.05); },
  ready(){ this.tone(880,.06,'square',.08); this.tone(1320,.1,'square',.08,0,.06); },
  wave(){ const g=this.play('glitch',.35); if(g) setTimeout(()=>{ try{ g.pause(); }catch(e){} }, 900); },
};
const sfx = (n,v) => AUDIO.play(n,v);

/* Âm giao diện chung: mọi nút bấm. Nút hành động/menu = select, còn lại = cursor. Nút disabled = error. */
document.addEventListener('click', e=>{
  const t=e.target.closest('button,.card,.tile,.srow,.tslot,.comms');
  if(!t) return;
  if(t.disabled){ sfx('error',.4); return; }
  if(t.matches('.btn-act,.menu__btn,.btn-ult,.srow')) sfx('select',.5);
  else if(t.matches('.story__box')) sfx('cursor',.25);
  else sfx('cursor',.4);
}, true);
