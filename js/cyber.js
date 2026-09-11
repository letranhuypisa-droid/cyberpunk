'use strict';
/* =====================================================================
   CYBERWARE — cấy ghép 5 ô cho từng nhân vật, và LINH KIỆN (LK) lấy từ phân tách bản dư.
   Số liệu + logic thuần; màn hình ở js/cyberui.js. Đặc tả đầy đủ: docs/cyberware.md.

   Nạp SAU js/state.js (cần unitStats/savePlayer) và TRƯỚC js/app.js.
   Nối vào chỉ số qua MỘT chỗ duy nhất: unitStats(id) trong js/state.js gọi cyberBonus(id).

   Vòng lặp: DẸP LOẠN → CR → CHIÊU MỘ ×10 → lá trùng → PHÂN TÁCH → LK → cấy ghép + nâng bậc.
   ★ FAKE: mọi số dưới đây là bản nháp. Chú ý: scratch/sim.js CHƯA mô phỏng cyberware, nên bảng tỉ lệ
   thắng ở docs/dep-loan.md §F1 là SÀN — người có cyberware sẽ thấy dễ hơn thế.
   ===================================================================== */

/* Năm ô, theo thứ tự từ đầu xuống chân — cùng thứ tự hiện trên màn */
const CYBER_SLOTS = [
  { id:'neu', name:'NÃO',  sub:'thần kinh' },
  { id:'opt', name:'MẮT',  sub:'thấu kính' },
  { id:'arm', name:'TAY',  sub:'chi trên' },
  { id:'cor', name:'NGỰC', sub:'lồng ngực' },
  { id:'leg', name:'CHÂN', sub:'chi dưới' },
];
const CYBER_TIERS = { B:{ lk:20,  cr:600  }, A:{ lk:60,  cr:2400 }, S:{ lk:150, cr:7000 } };
const CYBER = {
  maxLv:    3,
  lvMult:   [1, 1.5, 2],          // bậc nhân thẳng vào chỉ số của món
  upCostK:  [0, .6, 1.2],         // giá nâng lên bậc 2 / bậc 3 = hệ số × giá chế
  refund:   .5,                   // tháo ra hoàn 50% LK đã bỏ vào (không hoàn CR)
  scrap:    { B:10, A:25, S:60 }, // LK nhận được khi phân tách một lá trùng
  /* RONIN không cấy ghép (lore). Bù bằng một bộ hạng A bậc 1 cố định — xem docs/cyberware.md Q7. */
  bare:     { atkPct:12, hpPct:14, spd:10, crit:12 },
};

/* 15 món: 5 ô × 3 hạng. fx = chỉ số cộng thêm ở BẬC 1 (bậc 2/3 nhân theo CYBER.lvMult).
   Chỉ dùng đúng 4 chỉ số unitStats trả về — thêm loại mới là phải sửa cả engine trận. */
const CYBERWARE = [
  { id:'neu1', slot:'neu', tier:'B', name:'CHIP THẦN KINH THÔ',   fx:{crit:3},            desc:'Hàn tay, còn một chân cắm bị cong. Nghĩ nhanh hơn một nhịp, đau đầu cả ngày.' },
  { id:'neu2', slot:'neu', tier:'A', name:'BỘ ĐỒNG BỘ TÁI CHẾ',   fx:{crit:5, spd:3},     desc:'Gỡ từ một cái xác Choir, số lô bị mài đi một nửa. Vẫn nghe được nhịp cũ.' },
  { id:'neu3', slot:'neu', tier:'S', name:'LÕI HALO TÁI SINH',    fx:{crit:8, atkPct:4},  desc:'Ruột một chiếc Halo đã bẻ gãy tần số lệnh. Chỉ còn phần bộ lọc — phần nó vốn được làm ra để làm.' },

  { id:'opt1', slot:'opt', tier:'B', name:'THẤU KÍNH NHẶT BÃI',   fx:{crit:4},            desc:'Bắt vít vào một vành hốc mắt cũ. Nhìn xa được, nhìn gần thì nhoè.' },
  { id:'opt2', slot:'opt', tier:'A', name:'MẮT NGẮM QUÂN DỤNG',   fx:{crit:7, atkPct:3},  desc:'Màn chập mống mắt còn kêu mỗi lần mở. Có vòng chỉnh cự ly ở vành.' },
  { id:'opt3', slot:'opt', tier:'S', name:'MẮT THÁP',             fx:{crit:11, atkPct:5}, desc:'Mặt kính phẳng như gương, khắc một dấu chữ thập tím mảnh. Không ai dưới Đáy bán được thứ này.' },

  { id:'arm1', slot:'arm', tier:'B', name:'KHỚP TAY HÀN LẠI',     fx:{atkPct:5},          desc:'Mối hàn còn nổi cục, vỏ mỗi mảnh một màu. Vung được là được.' },
  { id:'arm2', slot:'arm', tier:'A', name:'TAY MÁY XƯỞNG RÃ',     fx:{atkPct:9},          desc:'Pít-tông thuỷ lực, đệm cầm mòn thủng. Xưởng rã xác lắp cho ai trả đủ.' },
  { id:'arm3', slot:'arm', tier:'S', name:'TAY THÉP CANTICLE',    fx:{atkPct:14, crit:3}, desc:'Gốm trắng bọc thép đen, đường ghép không thấy mối. Tay của lính trên Tháp.' },

  { id:'cor1', slot:'cor', tier:'B', name:'GIÁP TÔN CHẮP',        fx:{hpPct:6},           desc:'Tôn múi tán đinh. Chắn được dao, không chắn được đạn.' },
  { id:'cor2', slot:'cor', tier:'A', name:'LỒNG NGỰC GIA CỐ',     fx:{hpPct:11},          desc:'Giảm chấn nhét giữa các xương sườn. Thở nặng, nhưng ngã không gãy.' },
  { id:'cor3', slot:'cor', tier:'S', name:'LÕI PHẢN ỨNG CHROME',  fx:{hpPct:16, atkPct:3},desc:'Một khe thoát hẹp rỉ ánh tím. Đứng gần nghe được tiếng nó chạy.' },

  { id:'leg1', slot:'leg', tier:'B', name:'GIÀY ĐỆM LÒ XO',       fx:{spd:4},             desc:'Lò xo lộ ra ở gót. Nhảy được xa hơn nửa bước, kêu mỗi bước.' },
  { id:'leg2', slot:'leg', tier:'A', name:'CHÂN CHẠY ĐƯỜNG ỐNG',  fx:{spd:7, hpPct:3},    desc:'Gai bám kiểu chân tắc kè, khớp còn kẹt bùn cống. Chạy trong ống không trượt.' },
  { id:'leg3', slot:'leg', tier:'S', name:'CHÂN NHẢY TẦNG',       fx:{spd:11, hpPct:4},   desc:'Hai pít-tông song song, bàn chân cháy sém. Nhảy được một tầng, tiếp đất thì tuỳ.' },
];
const cyberById   = id => CYBERWARE.find(c=>c.id===id);
const cyberOfSlot = slot => CYBERWARE.filter(c=>c.slot===slot);
const cyberArt    = c => ['art/cyber/'+c.id+'.png'];

/* =====================================================================
   HỒ SƠ — PLAYER.parts (ví LK) + PLAYER.cyber = { [heroId]: { [slot]: {id, lv} } }
   Không có kho đồ rời: chế tạo là lắp thẳng vào ô (docs/cyberware.md Q4).
   ===================================================================== */
function cyberStore(){
  if(typeof PLAYER.parts !== 'number') PLAYER.parts = 0;
  if(!PLAYER.cyber || typeof PLAYER.cyber !== 'object') PLAYER.cyber = {};
  return PLAYER.cyber;
}
const cyberNoFit = id => !!(ROSTER[id] && ROSTER[id].noChrome);      // RONIN: lore nói không một khớp nối kim loại
const cyberFitted = id => { const s=cyberStore(); return (s[id] = s[id] || {}); };
const cyberAt = (id, slot) => cyberFitted(id)[slot] || null;
const cyberCount = id => cyberNoFit(id) ? 0 : CYBER_SLOTS.filter(s=>cyberAt(id, s.id)).length;

/* Chỉ số của MỘT món ở bậc đang có */
function cyberFx(defId, lv){
  const c=cyberById(defId); if(!c) return {};
  const k=CYBER.lvMult[Math.max(1,Math.min(CYBER.maxLv,lv||1))-1];
  const out={}; for(const s in c.fx) out[s]=Math.round(c.fx[s]*k*10)/10;
  return out;
}
/* Tổng cyberware của một nhân vật — unitStats() trong js/state.js gọi hàm này và CHỈ hàm này */
function cyberBonus(id){
  const t={ atkPct:0, hpPct:0, spd:0, crit:0 };
  if(typeof PLAYER==='undefined' || !ROSTER || !ROSTER[id]) return t;
  if(cyberNoFit(id)) return { ...CYBER.bare };                       // THÉP TRẦN
  const f=cyberFitted(id);
  for(const s in f){ const fx=cyberFx(f[s].id, f[s].lv); for(const k in fx) t[k]+=fx[k]; }
  for(const k in t) t[k]=Math.round(t[k]*10)/10;
  return t;
}

/* =====================================================================
   GIÁ + HÀNH ĐỘNG
   ===================================================================== */
const cyberCraftCost = c => ({ ...CYBER_TIERS[c.tier] });
function cyberUpCost(c, lv){                                          // giá nâng TỪ bậc lv lên lv+1
  const base=CYBER_TIERS[c.tier], k=CYBER.upCostK[lv] || 0;
  return { lk:Math.round(base.lk*k), cr:Math.round(base.cr*k) };
}
/* LK đã bỏ vào một món ở bậc lv (để tính hoàn khi tháo) */
function cyberSunkLk(c, lv){
  let lk=CYBER_TIERS[c.tier].lk;
  for(let i=1;i<lv;i++) lk += cyberUpCost(c, i).lk;
  return lk;
}
const canPay = p => PLAYER.parts >= p.lk && PLAYER.credits >= p.cr;

/* Chế tạo + lắp thẳng vào ô. Ô đang có món khác thì tháo món cũ trước (hoàn 50% LK của nó). */
function cyberFit(heroId, defId){
  const c=cyberById(defId); if(!c) return 'no';
  if(cyberNoFit(heroId)) return 'bare';
  const cost=cyberCraftCost(c); if(!canPay(cost)) return 'poor';
  const cur=cyberAt(heroId, c.slot);
  if(cur && cur.id===defId) return 'same';
  if(cur) cyberRemove(heroId, c.slot);                                // hoàn LK món cũ trước khi trừ tiền món mới
  PLAYER.parts -= cost.lk; PLAYER.credits -= cost.cr;
  cyberFitted(heroId)[c.slot] = { id:defId, lv:1 };
  savePlayer(); return 'ok';
}
function cyberUp(heroId, slot){
  const it=cyberAt(heroId, slot); if(!it) return 'no';
  const c=cyberById(it.id); if(!c) return 'no';
  if(it.lv >= CYBER.maxLv) return 'max';
  const cost=cyberUpCost(c, it.lv); if(!canPay(cost)) return 'poor';
  PLAYER.parts -= cost.lk; PLAYER.credits -= cost.cr;
  it.lv++; savePlayer(); return 'ok';
}
function cyberRemove(heroId, slot){
  const it=cyberAt(heroId, slot); if(!it) return 'no';
  const c=cyberById(it.id);
  PLAYER.parts += Math.round(cyberSunkLk(c, it.lv) * CYBER.refund);
  delete cyberFitted(heroId)[slot];
  savePlayer(); return 'ok';
}

/* =====================================================================
   PHÂN TÁCH BẢN DƯ — lời hứa treo từ đợt 1 ("trùng không hoàn SH nữa, giữ lại để phân tách").
   CHỈ đụng PLAYER.extra; PLAYER.owned không bao giờ bị chạm, nên không mất nhân vật vì lỡ tay.
   ===================================================================== */
const scrapLk = id => CYBER.scrap[(ROSTER[id]||{}).tier] || 0;
const scrapList = () => Object.keys(PLAYER.extra||{})
  .filter(id => ROSTER[id] && PLAYER.extra[id] > 0)
  .map(id => ({ id, n:PLAYER.extra[id], each:scrapLk(id), lk:PLAYER.extra[id]*scrapLk(id) }))
  .sort((a,b)=> b.each-a.each || b.n-a.n);
const scrapTotal = () => scrapList().reduce((s,x)=>({ n:s.n+x.n, lk:s.lk+x.lk }), { n:0, lk:0 });
function scrapOne(id, n){
  const have=(PLAYER.extra||{})[id]||0; const k=Math.max(0, Math.min(have, n==null?have:n));
  if(!k) return null;
  PLAYER.extra[id]=have-k; if(!PLAYER.extra[id]) delete PLAYER.extra[id];
  const lk=k*scrapLk(id); PLAYER.parts+=lk; savePlayer();
  return { n:k, lk };
}
function scrapAll(){
  const t=scrapTotal(); if(!t.n) return null;
  scrapList().forEach(x=>scrapOne(x.id));
  return t;
}

/* Nạp hồ sơ: dựng ô mới cho hồ sơ cũ, và dọn món trỏ vào def đã bị xoá */
(function cyberBoot(){
  if(typeof PLAYER==='undefined') return;
  const s=cyberStore(); let ch=false;
  for(const hero in s){
    if(!ROSTER[hero] || cyberNoFit(hero)){ delete s[hero]; ch=true; continue; }
    for(const slot in s[hero]){
      const it=s[hero][slot], c=it && cyberById(it.id);
      if(!c || c.slot!==slot){ delete s[hero][slot]; ch=true; continue; }
      it.lv=Math.max(1, Math.min(CYBER.maxLv, it.lv|0 || 1));
    }
  }
  if(ch) savePlayer();
})();
