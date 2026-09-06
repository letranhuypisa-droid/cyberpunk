# CHROMEFALL — Spec cơ chế

Những cơ chế cần engine đụng vào. Mỗi mục ghi: nó là gì, sửa file nào, và **chưa áp dụng hay đã áp dụng**.
Phần chữ dành cho người chơi nằm ở `docs/combat-profiles.md`.

---

## [OVERLOAD] + DEAD SHORT — Wire

**Trạng thái: ĐÃ ÁP DỤNG.** Đo trong trận thật (Chromium, sector 07-A, tắt crit + variance để số sạch):

| Kiểm tra | Kỳ vọng | Đo được |
|---|---|---|
| Đòn 1 (0 stack) | 80 | 80 |
| Đòn 2 (1 stack, +10%) | 88 | 88 |
| Đòn 3 (2 stack, +20%) | 96 | 96 |
| Đòn 4 (3 stack, +30%) | 104 | 104 — stack kẹt trần 3 |
| DEAD SHORT ăn 3 stack | 291 | 291, stack về 0 |
| Ronin (ATK 130) đánh mục tiêu 3 stack | 169 | 169 (không stack: 130) |

Dòng cuối là điều đáng giá nhất: **vuln chạy cho cả đồng đội**, nên Wire vẫn có ích ở wave lính thường
kể cả khi mục tiêu chết trước lúc cô kịp dùng chiêu cuối.

### Cơ chế

| | |
|---|---|
| Nguồn stack | Chỉ đòn thường của Wire. Mỗi đòn +1 stack lên mục tiêu vừa đánh. |
| Trần | 3 stack |
| Hiệu ứng mỗi stack | Mục tiêu **nhận thêm 10% sát thương từ mọi nguồn** (cả đồng đội) |
| Tự kích nổ | **Không.** Stack nằm yên tới khi Wire dùng chiêu cuối. |
| Tiêu thụ | `DEAD SHORT` ăn sạch stack trên toàn sân |
| Mất stack | Mục tiêu chết (`dealDamage` đã tự xoá `chips`) |

`DEAD SHORT` = `kind:'aoe'`, `mult:1.6`, `perStack:.4`. Mỗi kẻ địch ăn `1.6 + 0.4 × (stack của chính nó)`, nhân
tiếp với hệ số vuln của chính stack đó — tức lúc kích nổ là cố tình cho ăn hai lần. Đó là phần thưởng của cả ba lượt xếp hàng.

### Vì sao bỏ auto-burst

Bản nháp đầu cho stack thứ 3 tự nổ và xoá sạch. Nhưng đòn thường cho `gainEnergy(u,25)` (`battle.js:280`) và Wire có
`energyMax:75`, nên đòn thứ ba vừa mở khoá chiêu cuối vừa kích nổ. Đúng khoảnh khắc ult sẵn sàng thì mục tiêu về 0 stack,
và điều khoản "ult mạnh hơn theo stack" không bao giờ đọc được quá 2. Hai cơ chế ăn cùng một tài nguyên.

Bỏ auto-burst thì chiêu cuối trở thành ngòi nổ duy nhất, vòng lặp rõ ra `Hit → Hit → Hit → ULT`, và nhịp 3.5–4.5s của
video (tất cả địch phát sáng cùng lúc) đúng là cơ chế chứ không còn là trang trí.

### Đã biết trước và chấp nhận

Wire hành động 1 lần/round. Grunt có 520–900 HP (`ENEMY_POOL`, `data.js:61-72`), đội 5 người dồn hoả lực ~500 dmg/round
→ grunt chết ở round 1–2, Wire chỉ kịp cắm 1–2 stack. **Bộ kỹ năng này chỉ chạy hết công suất ở elite (1100–1800 HP) và
boss (2600–8000 HP).** Đó là lựa chọn có chủ đích: Wire là chuyên gia đánh mục tiêu lớn, và ghi rõ như vậy trên thẻ.

Phần vuln 10%/stack vẫn có ích ở wave thường vì nó buff cho cả đội, không riêng Wire.

*Van xả nếu playtest thấy cô vô dụng ở wave lính:* cho **đồng đội cũng cộng stack khi đánh vào mục tiêu đã có
`[OVERLOAD]`** — Wire đánh dấu, cả tổ kích nổ. Một điều kiện trong `dealDamage`, và hợp lore hơn (cô là thợ, không phải sát thủ).

### Đã sửa gì

**1 · `js/data.js` — entry của Wire (dòng 38)**

```js
// trước
wire:  { id:'wire', name:'WIRE', faction:'chrome', tier:'B', atk:80, hp:1500, energyMax:75,
         ult:{name:'OVERCLOCK',cost:75,kind:'nuke',mult:2.2,desc:'★ FAKE'}, ... }

// sau
wire:  { id:'wire', name:'WIRE', faction:'chrome', tier:'B', atk:80, hp:1500, energyMax:75,
         ult:{ name:'DEAD SHORT', cost:75, kind:'aoe', mult:1.6, perStack:.4,
               desc:'160% ATK lên toàn bộ kẻ địch, +40% ATK cho mỗi [OVERLOAD] trên mục tiêu đó. Ăn sạch stack.' },
         talent:{ name:'OVERLOAD', max:3, vuln:.10 }, ... }
```

**2 · `js/battle.js` — hằng số + hai helper, đặt cạnh `addChip`/`removeChip` (dòng 107-108)**

```js
const OVERLOAD = { label:'OVERLOAD', max:3, vuln:.10, src:'wire' };
const overloadStacks = u => { const c=u.chips.find(c=>c.label===OVERLOAD.label); return c ? c.val : 0; };
function addOverload(tgt){
  const c=tgt.chips.find(c=>c.label===OVERLOAD.label);
  if(c){ if(c.val>=OVERLOAD.max) return c.val; c.val++; }
  else tgt.chips.push({ type:'overload', label:OVERLOAD.label, val:1 });
  updateUnit(tgt); return overloadStacks(tgt);
}
```

`updateUnit` render `<em>${c.val}</em>` nên `val` để dạng số là được; không bao giờ lưu 0 nên không vướng falsy.

**3 · `js/battle.js` — `dealDamage` (dòng 179-182), thêm hệ số vuln**

```js
  const crit = Math.random() < RULES.critChance;
  const v = 1 + (Math.random()*2-1)*RULES.variance;
  const vuln = 1 + overloadStacks(tgt)*OVERLOAD.vuln;                  // ← thêm
  const dmg = Math.round(src.atk * mult * v * vuln * (crit?RULES.critMult:1));   // ← thêm vuln
```

Chạy cho mọi mục tiêu kể cả đồng minh; ai không có stack thì `vuln === 1`, không đổi gì.

**4 · `js/battle.js` — `playerAttack` (dòng 280), cắm stack sau khi gây damage**

```js
  dealDamage(u,t,1);
  if(u.id===OVERLOAD.src && t.alive) addOverload(t);                   // ← thêm
  gainEnergy(u,25); dailyProgress('attacks');
```

Thứ tự có chủ đích: đòn hiện tại ăn theo số stack **đã có từ trước**, stack mới cắm sau. Điều kiện `t.alive` tránh
gắn chip lên xác (`dealDamage` xoá `chips` khi mục tiêu chết).

**5 · `js/battle.js` — nhánh `aoe` trong `playerUlt`, cộng stack rồi ăn stack**

```js
// trước
} else if(k==='aoe'){
  const anim=playAttackAnim(u); await wait(90);
  alive('enemy').forEach(t=>dealDamage(u,t,u.ult.mult)); await anim;

// sau
} else if(k==='aoe'){
  const anim=playAttackAnim(u); await wait(90);
  alive('enemy').forEach(t=>{
    const st = u.ult.perStack ? overloadStacks(t) : 0;
    dealDamage(u, t, u.ult.mult + st*(u.ult.perStack||0));
    if(st) removeChip(t, OVERLOAD.label);
  });
  await anim;
```

Giữ nguyên hành vi cũ cho Ash và Vesper vì hai người không có `perStack` → `st` luôn bằng 0.

**6 · `css/chromefall.css` — chip mới, đặt cạnh `.chip--refund` (dòng 364)**

```css
.chip--overload{color:var(--energy);border-color:var(--energy)}
.chip--overload::before{border:0;width:4px;height:7px;background:currentColor;
  clip-path:polygon(55% 0,100% 0,62% 40%,100% 40%,20% 100%,42% 52%,0 52%)}
```

Dùng token `--energy` (cyan, định nghĩa ở cả hai theme) cho khớp màu Arc Whip. Chip là CSS thuần → **0 asset ảnh**.

### Không làm

- **Không có nút Skill.** UI trận có đúng hai nút, `UI.btnAttack` và `UI.btnUlt`, bật tắt qua `setInputs` (`battle.js:223`).
  Thêm slot thứ ba kéo theo cooldown, AI địch, logic lượt, và cả 19 nhân vật phải có skill mới không lệch. Wire chạy bằng
  Basic + Nội tại + Ultimate.
- **Không có hệ nguyên tố.** `dealDamage` là `atk × mult × variance × crit`, không có loại sát thương hay kháng. "Điện"
  chỉ là chữ và VFX; không xây type system cho một nhân vật.
- **Không có pose Ultimate Start và Victory.** `preloadFrames` load đúng `idle/attack/hurt`; `playerUlt` phát video xong là
  dùng lại `playAttackAnim`; `finish()` chỉ bung panel chữ `UI.result`, không có sprite. Vẽ hai pose đó bây giờ là vẽ vào chỗ trống.

### Asset cần cho Wire

| # | Asset | Ghi chú |
|---|---|---|
| 1 | `wire_idle.png` | 744×682, roi cuộn quanh cổ tay phải |
| 2 | `wire_attack.png` | canvas rộng hơn cho vệt roi, khai báo `box.attack.ax` |
| 3 | `wire_hurt.png` | |
| 4 | Vệt chém Arc Whip | PNG overlay, **riêng của Wire** |
| 5 | `wire_ult.mp4` | 5 giây, H.264 1280×720 — kịch bản ở `combat-profiles.md` |

Hit spark và burst điện là **VFX dùng chung cho cả roster**, không làm riêng cho Wire — nếu không thì 19 nhân vật × 3 hiệu ứng
= 57 asset bespoke. Chip `[OVERLOAD]` không cần ảnh.

---

## [MUTE] + FEEDBACK — Echo

**Trạng thái: ĐÃ ÁP DỤNG.** Đo trong trận thật (Chromium, tắt crit + variance):

| Kiểm tra | Kỳ vọng | Đo được |
|---|---|---|
| Đòn thường Echo gắn `[MUTE]` | chip hiện | ✓ `MUTE 1T` |
| Địch ATK 53 bị câm | 40 (−25%) | 40 |
| HALO LINK bình thường | +80 HP | +80 |
| Chính nó bị câm | +0 | +0, và câm hết hạn đúng lượt của nó |
| **Bạn link bị câm** | +0 | +0 |
| FEEDBACK câm toàn sân | tất cả | ✓ |
| Hồi quy: Overload của Wire | 80 / 88 | 80 / 88, stack đúng |

> **Sửa lỗi tìm ra khi làm Muzzle:** dòng hết hạn câm ban đầu đặt ở **đầu** `enemyAct`, tức trước khi địch đánh,
> nên vế giảm 25% sát thương **chưa bao giờ có tác dụng thật** — chỉ vế chặn HALO LINK chạy. Bài test Echo lúc đó
> gọi thẳng `dealDamage` với cờ đã bật nên chứng minh được công thức mà không chứng minh được tích hợp.
> Đã dời dòng đó xuống **sau** khi địch đánh xong. Đo lại qua `enemyAct`: 78 → 59, hết hạn đúng sau một lượt,
> lượt kế tiếp về lại 78, và HALO LINK vẫn bị chặn khi câm.

Dòng thứ năm là dòng dễ làm sai nhất: câm một con thì con **kia** cũng mất chỗ dựa, vì điều kiện link
đọc cả hai đầu. Nếu chỉ chặn một đầu thì hai con link nhau vẫn hồi máu qua con đã bị câm.

### Cơ chế

| | |
|---|---|
| Nguồn | Đòn thường của Echo áp `[MUTE]` lên mục tiêu |
| Thời hạn | Tới hết lượt kế tiếp của chính mục tiêu (giống hệt `controlled` của Psalm) |
| Hiệu ứng 1 | Mục tiêu **gây ít hơn 25% sát thương** |
| Hiệu ứng 2 | Mục tiêu **bị cắt khỏi HALO LINK**: không hồi 8% HP, và không tính là bạn link cho con khác |
| Cộng dồn | Không. Đây là cờ bật/tắt, không phải stack |

`FEEDBACK` = `kind:'aoe'`, `mult:1.4`, `muteAll:true` — sát thương diện rộng rồi câm toàn sân.

### Vì sao chọn cắt HALO LINK

Engine đã có sẵn `link:true` trên Warden, Exorcist, Organist, Enforcer Prime và The Canticle (`data.js:85-98`),
và `enemyAct` cho chúng hồi 8% HP mỗi lượt chừng nào còn một con link khác sống (`battle.js:355-357`).
Đó là cơ chế kéo dài trận của chương 2–3, và hiện **không có nhân vật nào phá được nó**. Echo lấp đúng chỗ trống đó.

Vế "gây ít hơn 25% sát thương" là để cô không vô dụng ở wave lính thường, nơi không con nào có `link` —
cùng bài học rút ra từ Wire.

### Đã sửa gì

**1 · `js/data.js` — entry của Echo (dòng 37)**

```js
// trước
ult:{name:'RESONANCE',cost:100,kind:'nuke',mult:2.5,desc:'★ FAKE'}

// sau
ult:{ name:'FEEDBACK', cost:100, kind:'aoe', mult:1.4, muteAll:true,
      desc:'140% ATK lên toàn bộ kẻ địch và áp [MUTE] lên tất cả' },
talent:{ name:'MUTE', dmg:.25 }
```

**2 · `js/battle.js` — hằng số + helper, cạnh khối OVERLOAD**

```js
const MUTE = { label:'MUTE', dmg:.25, src:'echo' };
function addMute(tgt){ tgt.muted=true; if(!tgt.chips.some(c=>c.label===MUTE.label)) tgt.chips.push({type:'mute',label:MUTE.label,val:'1T'}); updateUnit(tgt); }
```

**3 · `js/battle.js` — `dealDamage`, hệ số bên NGƯỜI ĐÁNH (khác Overload, vốn ở bên người chịu)**

```js
  const hush = src.muted ? (1-MUTE.dmg) : 1;
  const dmg = Math.round(src.atk * mult * v * vuln * hush * (crit?RULES.critMult:1));
```

**4 · `js/battle.js` — `playerAttack`, cạnh dòng addOverload**

```js
  if(u.id===MUTE.src && t.alive) addMute(t);
```

**5 · `js/battle.js` — `enemyAct`: chặn HALO LINK, rồi hết hạn câm**

```js
// trước
if(e.link && e.alive && alive('enemy').some(x=>x!==e && x.link)){

// sau
if(e.link && !e.muted && e.alive && alive('enemy').some(x=>x!==e && x.link && !x.muted)){
```

Ngay sau khối HALO LINK, trước phần chọn mục tiêu, thêm:

```js
  if(e.muted){ e.muted=false; removeChip(e,MUTE.label); }   // câm hết hạn ở lượt của chính nó, giống controlled
```

**6 · `js/battle.js` — nhánh `aoe` trong `playerUlt`**, trong forEach sẵn có:

```js
      if(u.ult.muteAll && t.alive) addMute(t);
```

**7 · `css/chromefall.css` — chip, cạnh `.chip--overload`**

```css
.chip--mute{color:var(--text-3);border-color:var(--line-3)}
.chip--mute::before{border:0;width:6px;height:6px;background:currentColor;border-radius:50%;
  -webkit-mask:linear-gradient(45deg,#000 46%,transparent 46%,transparent 54%,#000 54%);
  mask:linear-gradient(45deg,#000 46%,transparent 46%,transparent 54%,#000 54%)}
```

Chip xám, không phải màu phe — vì câm là **mất** một thứ, không phải được thêm.

### Không làm

- **Không cho `[MUTE]` cộng dồn.** Nó là cờ, hết hạn theo lượt của mục tiêu. Cộng dồn thì phải đếm lượt, mà
  engine chưa có bộ đếm lượt cho trạng thái — `controlled` né được chuyện đó bằng cách tự xoá ở lượt của chính unit, và `[MUTE]` đi theo y hệt.
- **Không cho Echo câm đồng minh** hay câm chính mình. `dealDamage` đọc `src.muted` cho mọi bên, nhưng chỉ Echo mới gắn được cờ, và cô chỉ gắn lên mục tiêu cô đánh.

---

## [SỔ] + SUTURE — Stitch

**Trạng thái: ĐÃ ÁP DỤNG.** Đo trong trận thật (Chromium, tắt crit + variance):

| Kiểm tra | Kỳ vọng | Đo được |
|---|---|---|
| Đồng đội ăn đòn → ghi sổ | cộng dồn | 53 → 106 (đòn lên chính Stitch cũng ghi) |
| Stitch đánh địch | không ghi | không đổi |
| Trần sổ sau 40 đòn | 1120 | 1120 |
| SUTURE với sổ 600 | 322/người | **322**, sổ về 0 |
| Stitch ngã | sổ đứng yên | đứng yên |
| Hồi quy: Muzzle FIELD PATCH | vẫn phẳng 84 | 84, không có `ledgerShare` |

Con số 322 khớp đúng ô giữa của bảng đường cong ở trên.

### Cơ chế

| | |
|---|---|
| Nguồn | Mọi sát thương **đồng đội** phải chịu, kể cả của chính Stitch |
| Điều kiện | Stitch phải còn sống. Bà ngã thì sổ ngừng cộng |
| Trần | `8 × ATK` = 1120 |
| Hiển thị | Chip trên thẻ Stitch, hiện con số đang cộng dồn |
| Tiêu thụ | `SUTURE` trả hết rồi xoá sổ về 0 |

`SUTURE` = `kind:'heal'`, `mult:.8`, `ledgerShare:.35`, `ledgerMax:8`.
Hồi mỗi đồng đội còn sống: `ATK × 0.8 + 0.35 × sổ`.

### Vì sao không phải chiêu hồi máu phẳng thứ tư

Roster đã có ba chiêu hồi phẳng: Muzzle `FIELD PATCH` (70 ATK × 1.2 = 84), Halo `SANCTUM` (115 × 1.4 = 161),
Meridian `BULWARK PROTOCOL` (85 × 1.0 = 85). Cho Stitch một cái nữa thì bà chỉ là con số to hơn, không phải nhân vật khác.

| Tình huống | Sổ | Hồi mỗi người |
|---|---|---|
| Vừa vào trận | ~0 | 112 — **thua Halo** |
| Ăn đòn một vòng | ~600 | 322 |
| Sắp vỡ, sổ đầy trần | 1120 | 504 |

Đường cong đó là cả nhân vật: tệ nhất lúc mọi thứ đang ổn, giỏi nhất đúng lúc mọi thứ hỏng.
`heal()` đã tự chặn ở `hpMax` nên phần thừa bị bỏ, không cần cân thêm.

### Đã sửa gì

**1 · `js/data.js` — entry của Stitch (dòng 43)**

```js
// trước
ult:{name:'SUTURE',cost:100,kind:'heal',mult:1.5,desc:'★ FAKE'}

// sau
ult:{ name:'SUTURE', cost:100, kind:'heal', mult:.8, ledgerShare:.35, ledgerMax:8,
      desc:'Hồi 80% ATK + 35% sổ cho toàn đội, rồi xoá sổ' },
talent:{ name:'SỔ', max:8 }
```

**2 · `js/battle.js` — hằng số + helper, cạnh khối MUTE**

```js
const LEDGER = { label:'SỔ', src:'stitch' };
const ledgerKeeper = () => B.units.find(u=>u.id===LEDGER.src && u.side==='ally' && u.alive);
function noteLedger(dmg){
  const s=ledgerKeeper(); if(!s) return;                       // bà ngã thì thôi ghi
  const cap=Math.round(s.atk*(s.ult.ledgerMax||8));
  s.ledger=Math.min(cap,(s.ledger||0)+dmg);
  const c=s.chips.find(c=>c.label===LEDGER.label);
  if(c) c.val=s.ledger; else s.chips.push({type:'ledger',label:LEDGER.label,val:s.ledger});
  updateUnit(s);
}
```

**3 · `js/battle.js` — `dealDamage`, ngay sau khi trừ máu**

```js
  if(tgt.side==='ally' && dmg>0) noteLedger(dmg);
```

Đặt **sau** `tgt.hp = Math.max(...)` và **trước** khối `killed`, để đòn giết người cuối cùng vẫn được ghi.

**4 · `js/battle.js` — nhánh `heal` trong `playerUlt`**

```js
// trước
} else if(k==='heal'){
  alive('ally').forEach(t=>heal(u,t,Math.round(u.atk*u.ult.mult))); log(`${u.name} hồi máu toàn đội`, true);

// sau
} else if(k==='heal'){
  const book = u.ult.ledgerShare ? (u.ledger||0) : 0;
  const amt  = Math.round(u.atk*u.ult.mult + book*(u.ult.ledgerShare||0));
  alive('ally').forEach(t=>heal(u,t,amt));
  if(u.ult.ledgerShare){ u.ledger=0; removeChip(u,LEDGER.label); log(`${u.name} trả sổ ${book} → hồi ${amt}/người`, true); }
  else log(`${u.name} hồi máu toàn đội`, true);
```

Muzzle, Halo và Meridian không khai `ledgerShare` nên `book=0`, giữ nguyên hành vi cũ.

**5 · `css/chromefall.css` — chip, cạnh `.chip--mute`**

```css
.chip--ledger{color:var(--rust-hi);border-color:var(--rust)}
.chip--ledger::before{border:0;width:5px;height:6px;background:currentColor;
  clip-path:polygon(0 0,100% 0,100% 100%,50% 82%,0 100%)}
```

Màu Rust theo phe bà, hình cái dấu trang sổ.

### Không làm

- **Không cho sổ sống qua khi Stitch chết.** `ledgerKeeper` lọc `alive`, nên bà ngã là sổ đứng lại — sổ vẫn còn số cũ,
  nhưng không ai ghi thêm và không ai trả được. Đó là chủ ý: cả đội phải giữ bà.
- **Không ghi sát thương lên kẻ địch.** Chỉ `tgt.side==='ally'`.
- **Không cộng sổ khi Stitch chưa vào đội.** `ledgerKeeper` trả `undefined` thì `noteLedger` thoát ngay, không tốn gì.

---

## [ĐÁP] + miễn nhiễm VERSE + IAIDO — Ronin

**Trạng thái: ĐÃ ÁP DỤNG.** Đo trong trận thật (Chromium):

| Kiểm tra | Kỳ vọng | Đo được |
|---|---|---|
| Địch (ATK 53) đánh Ronin | ăn trả 78 | **78** |
| Địch đánh Muzzle | ăn trả 0 | 0 |
| **IAIDO ×40, crit + variance BẬT** | đúng 364 mỗi lần | **364 cả 40 lần, một giá trị duy nhất** |
| Đòn thường cùng hệ số ×40 | dao động | 336–589 |
| VERSE wave 2 | Ronin 100, còn lại 75 | Ronin 100, bốn người còn lại 75 |
| Hồi quy: sổ Stitch | ghi đòn lên Ronin, bỏ nhát đáp | đúng cả hai |

Dòng thứ ba là cả nhân vật gói trong một phép đo: bật hết may rủi lên, đòn của anh vẫn không đổi.

### Cơ chế

| | |
|---|---|
| **[ĐÁP]** | Kẻ địch đánh trúng Ronin → ăn ngay `60% ATK` chém trả. Không tốn Energy, không chờ lượt |
| Điều kiện | Cả hai còn sống sau đòn của địch. Không kích hoạt khi Ronin bị đồng đội bị chiếm quyền đánh trúng |
| **Miễn VERSE** | VERSE trừ 25 Energy toàn đội mỗi wave ở chương 3. Ronin không bị trừ |
| **IAIDO** | `280% ATK` **chính xác** — bỏ cả chí mạng lẫn sai số |

### Ba thứ này nói cùng một câu

Nhân vật này chỉ có một ý: *mỗi nhát chém phải là của anh, không phải của một bài ca viết sẵn.* Cả ba cơ chế đều là câu đó viết bằng số.

- **Miễn VERSE** — bài hát đi qua vòng Halo và qua deck. Anh không có cái nào. VERSE phủ **toàn bộ chương 3** (`01-A`→`01-E`), nên đây không phải trang trí: anh là người duy nhất giữ nguyên Energy suốt chương cuối.
- **IAIDO không chí mạng, không sai số** — mọi đòn khác nhân `variance ±8%` và có `critChance .15 × 1.5`, kỳ vọng ×1.075. Anh bỏ cả hai, đổi ~7% sát thương trung bình lấy sự chắc chắn. Không có may rủi nào trong nhát chém của anh.
- **[ĐÁP]** — anh không né, không đỡ, không chờ lượt mình. Ai chạm vào thì ăn trả ngay.

Và `dealDamage` có sẵn tham số `opts={}` bỏ trống từ commit đầu tiên của repo. `IAIDO` là thứ đầu tiên dùng tới nó.

### Đã sửa gì

**1 · `js/data.js` — entry của Ronin**

```js
ult:{ name:'IAIDO', cost:100, kind:'nuke', mult:2.8, exact:true,
      desc:'Đúng 280% ATK lên một mục tiêu. Không chí mạng, không sai số' },
talent:{ name:'ĐÁP', mult:.6, verseImmune:true }
```

**2 · `js/battle.js` — hằng số, cạnh khối LEDGER**

```js
const RIPOSTE = { label:'ĐÁP', mult:.6, src:'ronin' };
```

**3 · `js/battle.js` — `dealDamage`: đường "đúng con số"**

```js
function dealDamage(src, tgt, mult, opts={}){
  const crit = !opts.exact && Math.random() < RULES.critChance;
  const v = opts.exact ? 1 : 1 + (Math.random()*2-1)*RULES.variance;
```

**4 · `js/battle.js` — nhánh `nuke` trong `playerUlt`, truyền cờ xuống**

```js
const r=dealDamage(u,t,u.ult.mult,{exact:u.ult.exact});
```

**5 · `js/battle.js` — `enemyAct`, ngay sau đòn của địch**

```js
  dealDamage(e,tgt,1);
  if(tgt.id===RIPOSTE.src && tgt.alive && e.alive){        // ĐÁP — chém trả ngay
    addChip(tgt,'riposte',RIPOSTE.label); setTimeout(()=>removeChip(tgt,RIPOSTE.label), 1200);
    await wait(reduced()?60:180);
    dealDamage(tgt,e,RIPOSTE.mult);
  }
```

**6 · `js/battle.js` — VERSE trong `spawnWave`, bỏ qua Ronin**

```js
// trước
alive('ally').forEach(u=>{ if(u.energy>0){ ...
// sau
alive('ally').forEach(u=>{ if(u.energy>0 && u.id!==RIPOSTE.src){ ...
```

**7 · `css/chromefall.css` — chip, cạnh `.chip--ledger`**

```css
.chip--riposte{color:var(--rust-hi);border-color:var(--rust-hi)}
.chip--riposte::before{border:0;width:7px;height:2px;background:currentColor;transform:rotate(-35deg)}
```

### Không làm

- **Không cho [ĐÁP] kích hoạt dây chuyền.** Nhát chém trả gọi `dealDamage` với mục tiêu là kẻ địch, mà điều kiện chỉ bắt khi mục tiêu là Ronin, nên không có vòng lặp.
- **Không cho [ĐÁP] tính vào sổ của Stitch.** Sổ chỉ ghi `tgt.side==='ally'`; nhát trả đánh vào địch nên không ghi. Nhưng đòn địch đánh Ronin thì **có** ghi — đúng như phải thế.
- **Không cho IAIDO xuyên giáp hay thêm hiệu ứng gì.** Nó cố tình là chiêu cuối không có mẹo.

---

## [MÌN] + FLASHOVER — Ash

**Trạng thái: ĐÃ ÁP DỤNG.** Đo trong trận thật (Chromium, 3 địch, tắt crit + variance):

| Kiểm tra | Kỳ vọng | Đo được |
|---|---|---|
| Đặt mìn | không sát thương, không cộng dồn | đúng cả hai, 1 quả |
| Giết kẻ mang mìn | toé 72 lên hai con còn lại | 72 / 72 |
| **Dây chuyền** | A nổ giết B → mìn B nổ tiếp → C ăn 144 | **C còn đúng 856/1000 HP, và sống** |
| FLASHOVER, cả ba mang mìn | 180 + 72×2 = 324 mỗi con | 324 / 324 / 324, sạch mìn |
| Ash đã ngã | mìn vẫn nổ | vẫn nổ |
| Tràn stack | không | không lỗi console |

Dây chuyền là chỗ rủi ro nhất: nó đệ quy qua `dealDamage`. Ba lớp bảo vệ ở mục trên giữ nó dừng đúng chỗ.

### Cơ chế

| | |
|---|---|
| Nguồn | Đòn thường của Ash gắn một quả mìn lên mục tiêu |
| Cộng dồn | **Không.** Một quả mỗi kẻ địch |
| Khi đặt | Không gây sát thương gì cả |
| Ngòi nổ 1 | **Kẻ mang mìn chết** — vì bất cứ ai, bất cứ thứ gì |
| Ngòi nổ 2 | `FLASHOVER` kích nổ mọi quả còn lại cùng lúc |
| Sát thương nổ | `60% ATK` lên **toàn bộ kẻ địch còn sống khác** |
| Dây chuyền | Vụ nổ giết thêm một kẻ mang mìn → quả đó nổ theo |
| Ash ngã | Mìn **vẫn nổ**. Cô đặt rồi thì nó nổ |

`FLASHOVER` = `kind:'aoe'`, `mult:1.5`, `blowCharges:true`.

### Vì sao tách khỏi Wire

Đây là cơ chế đặt-rồi-nổ **thứ hai** trong roster, nên phải khác Wire ở chỗ căn bản, không chỉ khác con số:

| | Wire `[OVERLOAD]` | Ash `[MÌN]` |
|---|---|---|
| Khi chưa dùng ult | Cho vuln +10%/stack | **Không làm gì cả** |
| Ngòi nổ | Chỉ chiêu cuối | **Cái chết của mục tiêu**, hoặc chiêu cuối |
| Cần ult để có tác dụng | Có | **Không** |
| Hình dạng | Tích trên một mục tiêu | Gài khắp sân, nổ dây chuyền |

Wire tích, Ash gài. Wire thưởng cho việc dồn; Ash thưởng cho việc rải rồi chọn đúng đứa để giết trước.

Trần Energy của Ash là 75, đòn thường cho 25 → **ba lượt đặt mìn cũng vừa đúng ba lượt đầy thanh**.

### Chống đệ quy vô hạn

Dây chuyền gọi `dealDamage` lồng nhau, nên phải chắc nó dừng:

1. `detonate()` **gỡ chip trước** rồi mới gây sát thương.
2. Đường chết trong `dealDamage` đã `tgt.chips=[]`, nên đọc cờ `mined` **trước** dòng đó.
3. Mỗi kẻ địch chỉ chết được một lần, và số kẻ địch hữu hạn → độ sâu tối đa bằng số địch trên sân.

### Đã sửa gì

**1 · `js/data.js` — entry của Ash**

```js
ult:{ name:'FLASHOVER', cost:75, kind:'aoe', mult:1.5, blowCharges:true,
      desc:'150% ATK lên toàn bộ kẻ địch, rồi kích nổ mọi quả mìn còn lại' },
talent:{ name:'MÌN', mult:.6 }
```

**2 · `js/battle.js` — hằng số + helper, cạnh khối RIPOSTE**

```js
const CHARGE = { label:'MÌN', mult:.6, src:'ash' };
const hasCharge = u => u.chips.some(c=>c.label===CHARGE.label);
function plantCharge(tgt){
  if(hasCharge(tgt)) return;
  tgt.chips.push({ type:'charge', label:CHARGE.label }); updateUnit(tgt);
}
function detonate(tgt){
  removeChip(tgt, CHARGE.label);                                  // gỡ TRƯỚC → dây chuyền chắc chắn dừng
  const src=B.units.find(u=>u.id===CHARGE.src && u.side==='ally'); // nổ kể cả khi Ash đã ngã
  const others=alive('enemy').filter(x=>x!==tgt);
  if(!src || !others.length) return;
  log(`MÌN nổ trên ${tgt.name}`, true);
  others.forEach(x=>{ if(x.alive) dealDamage(src, x, CHARGE.mult); });
}
```

**3 · `js/battle.js` — `dealDamage`: đọc cờ trước khi xoá chip, nổ sau khi xong sổ sách**

```js
  const mined = tgt.side==='enemy' && hasCharge(tgt);   // đọc TRƯỚC dòng tgt.chips=[]
  const killed = tgt.hp<=0 && tgt.alive;
  ...
  if(killed && B.target===tgt) B.target=null;
  if(killed && mined) detonate(tgt);                    // dây chuyền
```

**4 · `js/battle.js` — `playerAttack`, cạnh addOverload/addMute**

```js
  if(u.id===CHARGE.src && t.alive) plantCharge(t);
```

**5 · `js/battle.js` — nhánh `aoe`, sau vòng forEach sẵn có**

```js
    if(u.ult.blowCharges) alive('enemy').filter(hasCharge).forEach(t=>detonate(t));
```

Đặt **sau** sát thương diện rộng: con nào chết vì đòn aoe thì mìn đã nổ theo đường chết rồi, ở đây chỉ còn những con sống sót.

**6 · `css/chromefall.css` — chip, cạnh `.chip--riposte`**

```css
.chip--charge{color:var(--crit);border-color:var(--crit)}
.chip--charge::before{border:0;width:6px;height:6px;background:currentColor;border-radius:50% 50% 50% 0}
```

### Không làm

- **Không cho mìn cộng dồn.** Một quả mỗi kẻ địch. Cộng dồn thì thành Wire.
- **Không cho mìn nổ vào đồng đội.** `alive('enemy')` chặn sẵn.
- **Không cho mìn nổ vào chính kẻ mang nó.** Nó đã chết rồi; nổ vào xác thì vô nghĩa và làm log rối.

---

## [BÀ BA] + FIELD PATCH — Muzzle

**Trạng thái: ĐÃ ÁP DỤNG.** Đo trong trận thật (Chromium, ép `Math.random` để mục tiêu tất định):

| Kiểm tra | Kỳ vọng | Đo được |
|---|---|---|
| Khiên lúc vào trận | 3 lượt chắn | 3, chip hiện sẵn |
| Địch (ATK 53) nhắm Echo | Muzzle ăn 27, Echo ăn 0 | 27 / 0, chắn còn 2 |
| **Bốn đòn liên tiếp** | ba đòn Muzzle đỡ, **đòn thứ tư Echo ăn đủ** | 27 / 27 / 27 rồi **Echo ăn 53** |
| Nhắm thẳng Muzzle | ăn đủ 53, không tốn chắn | 53, chắn vẫn 3 |
| Ronin `[ĐÁP]` khi Muzzle đỡ thay | không đáp | 0 |
| Ronin `[ĐÁP]` khi bị nhắm thẳng | 78 | 78 |
| Sổ Stitch | ghi con số **đã giảm** | 27 |
| `[MUTE]` × soak | 53×0.75×0.5 = 20 (nhân) | 20 |
| FIELD PATCH | khiên về 3 + hồi 84/người | đúng cả hai |

Dòng thứ ba là câu thoại của anh đo bằng số.

### Cơ chế

| | |
|---|---|
| Sức chứa | **3 lượt chắn**, bắt đầu trận đã đầy |
| Kích hoạt | Địch nhắm vào **đồng đội không phải Muzzle**, và anh còn lượt chắn |
| Hiệu ứng | Muzzle **nhận đòn thay**, chỉ ăn **50%** sát thương, tốn 1 lượt chắn |
| Hồi | **+1 mỗi đầu vòng**, trần 3 |
| Hết lượt chắn | Đồng đội ăn đòn bình thường — *đòn thứ tư là phần của anh* |
| `FIELD PATCH` | Hồi `120% ATK` toàn đội **và** trả Bà Ba về đủ 3 |

### Vai này chưa ai làm

Sáu cơ chế trước đều tác động lên **sát thương** — tăng, giảm, hoãn, hoàn. Chưa cái nào **đổi đích đến** của một đòn đánh. `enemyAct` chọn mục tiêu bằng `rand(a)` trên toàn bộ đồng minh còn sống, nên Echo (1000 HP), Stitch (900) và Kira (950) đều có thể ăn đòn boss bất kỳ lúc nào, và không ai chặn được.

Muzzle chặn. Đó là lý do ATK 70 của anh không quan trọng.

`FIELD PATCH` trước đây là chiêu hồi máu phẳng **thứ tư** của roster (84/người). Giờ nó là nút nạp lại khiên, còn hồi máu là phần kèm. Trần Energy 125 là cao nhất game — 5 lượt mới đầy — nên nó là nút xả lúc mọi thứ hỏng cùng lúc, không phải thứ bấm theo nhịp.

### Đã sửa gì

**1 · `js/data.js` — entry của Muzzle**

```js
ult:{ name:'FIELD PATCH', cost:125, kind:'heal', mult:1.2, mendGuard:true,
      desc:'Hồi 120% ATK toàn đội và vá Bà Ba về đủ 3 lượt chắn' },
talent:{ name:'BÀ BA', guard:3, soak:.5 }
```

**2 · `js/battle.js` — `makeUnit`: khiên có sẵn từ lúc dựng unit**

```js
return { ...def, side, uid:side+'-'+i, hp:def.hp, hpMax:def.hp, energy:0, alive:true, controlled:false,
         chips: def.talent && def.talent.guard ? [{ type:'guard', label:def.talent.name, val:def.talent.guard }] : [],
         el:null };
```

Đặt chip ngay trong `makeUnit` thì nó hiện từ đầu trận, không cần móc thêm chỗ nào.

**3 · `js/battle.js` — hằng số + helper**

```js
const GUARD = { src:'muzzle' };
const guardOf = u => u.chips.find(c=>c.type==='guard');
function mendGuard(m, n){
  const c=guardOf(m); if(!c || !m.talent) return;
  c.val=Math.min(m.talent.guard, c.val+n); updateUnit(m);
}
```

**4 · `js/battle.js` — `enemyAct`: đổi đích, ngay sau khi chọn `tgt`**

```js
  let soak=false;
  if(tgt.side==='ally' && tgt.id!==GUARD.src){
    const m=B.units.find(u=>u.id===GUARD.src && u.side==='ally' && u.alive);
    const c=m && guardOf(m);
    if(c && c.val>0){ c.val--; updateUnit(m); log(`${m.name} đỡ thay ${tgt.name}`, true); tgt=m; soak=true; }
  }
  ...
  dealDamage(e, tgt, soak ? m.talent.soak : 1);
```

**5 · `js/battle.js` — `newRound`: hồi 1 lượt chắn**

```js
const m=B.units.find(u=>u.id===GUARD.src && u.side==='ally' && u.alive); if(m) mendGuard(m,1);
```

**6 · `js/battle.js` — nhánh `heal`: vá khiên**

```js
    if(u.ult.mendGuard && u.talent) mendGuard(u, u.talent.guard);
```

**7 · `css/chromefall.css` — chip, cạnh `.chip--charge`**

```css
.chip--guard{color:var(--hp);border-color:var(--hp)}
.chip--guard::before{border:0;width:6px;height:7px;background:currentColor;
  clip-path:polygon(0 0,100% 0,100% 62%,50% 100%,0 62%)}
```

### Tương tác đã tính trước

- **Ronin `[ĐÁP]` không kích hoạt khi Muzzle đỡ thay anh.** Điều kiện đáp trả đọc `tgt.id===RIPOSTE.src` *sau* khi đổi đích, mà lúc đó `tgt` đã là Muzzle. Đúng như phải thế: Ronin không bị chạm thì Ronin không đáp. Nếu địch nhắm thẳng Ronin thì không có đổi đích nào cả — anh vẫn đáp bình thường.
- **Sổ của Stitch vẫn ghi đủ.** Đòn rơi vào Muzzle vẫn là `tgt.side==='ally'`, ghi đúng con số đã giảm 50%.
- **Echo `[MUTE]` cộng dồn với soak.** Địch bị câm đánh Muzzle: `0.75 × 0.5` = 37.5% sát thương gốc. Cố ý cho nhân, không cho cộng.

### Không làm

- **Không chắn cho chính Muzzle.** Điều kiện `tgt.id!==GUARD.src` chặn. Anh nhắm thẳng thì ăn đủ.
- **Không chắn khi Muzzle đã ngã.** Lọc `alive`.
- **Không cho khiên chặn sát thương mìn hay nổ dây chuyền.** Những thứ đó đánh vào địch, không đi qua `enemyAct`.

---

## [GIỜ] + [TƯỜNG] + BULWARK PROTOCOL — Meridian

**Trạng thái: ĐÃ ÁP DỤNG.** Đo trong trận thật (Chromium, tắt crit + variance):

| Kiểm tra | Kỳ vọng | Đo được |
|---|---|---|
| `[GIỜ]` cộng mỗi vòng | +4 sau 4 vòng | +4, chip hiện số |
| Lá chắn ở giờ 5 | 85×1.6×1.4 = 190 | **190**, mỗi đồng đội đều nhận |
| Địch ATK 53 đánh người có tường | máu mất 0, tường mất 53 | 0 / 53 |
| **Sổ Stitch khi bị chắn hết** | **0** | **0** |
| Tường chỉ còn 10 | máu mất 43, sổ ghi 43 | 43 / 43, tường về 0 |
| Không cộng dồn | 100 rồi 50 → giữ 100 | 100; rồi 300 → 300 |

Dòng thứ tư là chỗ ba lớp phòng thủ phải khớp nhau: tường chặn **trước** khi chảy máu, nên sổ của Stitch
không có gì để ghi. Nếu ghi thì Stitch được thưởng cho một vết thương không tồn tại.

### Cơ chế

| | |
|---|---|
| **[GIỜ]** | Bộ đếm trên thẻ Meridian, bắt đầu 0, **+1 mỗi vòng**, không bao giờ giảm |
| **[TƯỜNG]** | Lá chắn trên từng đồng minh, **hấp thụ sát thương trước khi trừ máu** |
| Nguồn tường | Chỉ `BULWARK PROTOCOL` |
| Kích cỡ | `ATK × 1.6 × (1 + 0.08 × giờ)` cho **mỗi đồng đội còn sống** |
| Chồng lá chắn | Không cộng dồn — lấy giá trị **lớn hơn** |
| Sổ Stitch | **Không ghi phần bị chắn.** Sổ ghi máu, tường thì không cho chảy máu |

`BULWARK PROTOCOL` = **`kind:'barrier'`** — loại chiêu cuối thứ năm, sau `nuke` / `aoe` / `heal` / `control`.

### Ba lớp phòng thủ, ba bản chất khác nhau

| | Cơ chế | Thời điểm |
|---|---|---|
| Muzzle `[BÀ BA]` | đổi **đích đến** của đòn | *trong lúc* đòn bay tới |
| Meridian `[TƯỜNG]` | hấp thụ **trước** khi chạm máu | *trước* khi máu mất |
| Stitch `[SỔ]` | hồi lại **sau** khi đã mất | *sau* khi máu mất |

Ba người cùng đội thì ba lớp xếp chồng theo đúng thứ tự đó, không cái nào che cái nào.

| Vòng | Giờ | Lá chắn/người |
|---|---|---|
| 1 | 0 | 136 |
| 5 | 4 | 180 |
| 10 | 9 | 234 |

Trần Energy 125 = 5 lượt mới đầy, nên lần dựng đầu rơi vào khoảng vòng 5.

### Đã sửa gì

**1 · `js/data.js` — entry của Meridian**

```js
ult:{ name:'BULWARK PROTOCOL', cost:125, kind:'barrier', mult:1.6, perHour:.08,
      desc:'Lá chắn 160% ATK + 8% mỗi giờ đã tiêu cho toàn đội, chặn trước khi mất máu' },
talent:{ name:'GIỜ', perHour:.08 }
```

**2 · `js/battle.js` — hằng số + helper**

```js
const HOURS  = { label:'GIỜ',   src:'meridian' };
const SHIELD = { label:'TƯỜNG' };
const hoursOf = u => { const c=u.chips.find(x=>x.label===HOURS.label); return c?c.val:0; };
function tickHours(){
  const m=B.units.find(u=>u.id===HOURS.src && u.side==='ally' && u.alive); if(!m) return;
  const c=m.chips.find(x=>x.label===HOURS.label);
  if(c) c.val++; else m.chips.push({ type:'hours', label:HOURS.label, val:1 });
  updateUnit(m);
}
function setBarrier(u, n){
  u.barrier=Math.max(u.barrier||0, n);
  const c=u.chips.find(x=>x.label===SHIELD.label);
  if(c) c.val=u.barrier; else u.chips.push({ type:'shield', label:SHIELD.label, val:u.barrier });
  updateUnit(u);
}
function drainBarrier(u, dmg){                 // trả phần còn lại sau khi tường ăn
  if(!u.barrier) return dmg;
  const soak=Math.min(u.barrier, dmg); u.barrier-=soak;
  const c=u.chips.find(x=>x.label===SHIELD.label);
  if(u.barrier<=0){ u.barrier=0; removeChip(u,SHIELD.label); } else if(c){ c.val=u.barrier; }
  updateUnit(u); return dmg-soak;
}
```

**3 · `js/battle.js` — `dealDamage`: tường ăn trước máu, và sổ chỉ ghi phần chảy máu thật**

```js
  const dealt = drainBarrier(tgt, dmg);        // ← thêm
  tgt.hp = Math.max(0, tgt.hp - dealt);
  if(tgt.side==='ally' && dealt>0) noteLedger(dealt);
  ...
  spawnNumber(tgt.el.querySelector('.unit__sprite'), dealt>0?dealt:dmg, dealt>0?(crit?'crit':''):'heal');
```

Khi bị chắn hết thì hiện con số đã chặn với kiểu `heal` (xanh) thay vì hiện `0`.

**4 · `js/battle.js` — nhánh chiêu cuối mới**

```js
  } else if(k==='barrier'){
    const amt=Math.round(u.atk*u.ult.mult*(1+hoursOf(u)*(u.ult.perHour||0)));
    alive('ally').forEach(t=>setBarrier(t,amt));
    log(`${u.name} dựng vách — lá chắn ${amt}/người (giờ ${hoursOf(u)})`, true);
```

**5 · `js/battle.js` — `newRound`: cộng giờ**

```js
tickHours();
```

**6 · `css/chromefall.css`**

```css
.chip--hours{color:var(--text-3);border-color:var(--line-3)}
.chip--hours::before{border:0;width:6px;height:6px;border-radius:50%;background:none;box-shadow:inset 0 0 0 1px currentColor}
.chip--shield{color:var(--chrome-hi);border-color:var(--chrome)}
.chip--shield::before{border:0;width:6px;height:7px;background:currentColor;clip-path:polygon(0 0,100% 0,100% 60%,50% 100%,0 60%)}
```

### Không làm

- **Không cho lá chắn cộng dồn.** Dựng lần hai lấy giá trị lớn hơn, không cộng vào.
- **Không cho lá chắn chặn đòn của đồng đội bị chiếm quyền.** `drainBarrier` chạy cho mọi mục tiêu — đó là chủ ý, tường không phân biệt ai đánh.
- **Không cho `[GIỜ]` giảm.** Không có cách nào lấy lại giờ đã tiêu. Đó là cả nhân vật.

---

## [ĐẾM] — Psalm

**Trạng thái: ĐÃ ÁP DỤNG.** Đo trong trận thật (Chromium, 3 địch):

| Kiểm tra | Kỳ vọng | Đo được |
|---|---|---|
| Một lượt địch | đếm +1, Energy +5 | 0→1, 0→5 |
| Ba lượt địch | đếm 3, Energy 15 | 3 / 15 |
| Psalm ngã | đếm đứng yên | đứng yên |
| `APOSTASY` còn nguyên | kind `control`, chiếm quyền 1 lượt | kind đúng, địch đánh đồng bọn, hết hiệu lực sau 1 lượt |

Dòng cuối là dòng quan trọng nhất của mục này: mục tiêu ở đây là **không đụng vào chiêu cuối**, và phép đo xác nhận
nó vẫn chạy y như trước.

### Cơ chế

| | |
|---|---|
| Kích hoạt | **Mỗi lượt của một kẻ địch bất kỳ** |
| Hiệu ứng | Bộ đếm trên thẻ Psalm +1, và bà nhận **+5 Energy** |
| Điều kiện | Psalm còn sống và đang trong đội |
| Trần | Không có. Bộ đếm chỉ đi lên |
| `APOSTASY` | **Không đổi một chữ nào** |

### Vì sao chỉ có nội tại, không đụng chiêu cuối

`APOSTASY` là chiêu cuối **duy nhất trong roster đã có spec thật từ đầu** — `data.js` không đánh dấu ★ FAKE, và
nhánh `control` đã chạy trong `playerUlt` từ trước phiên này. Việc cần làm không phải thiết kế lại nó, mà là làm cho
cái giá **125 Energy** trả được: trần cao nhất game, 5 lượt nếu chỉ trông vào đòn thường, trên một nhân vật 1100 HP.

`[ĐẾM]` cũng là **cơ chế sinh Energy đầu tiên** trong roster. Trước nó, Energy chỉ có ba đường:
`+25` mỗi đòn thường, `refundOnKill` của Kira, và `VERSE` **trừ** 25 ở chương 3.

| Số địch trên sân | Energy thêm mỗi vòng | `APOSTASY` sẵn sàng |
|---|---|---|
| 0 (chỉ đòn thường) | 0 | vòng 5 |
| 2 | +10 | vòng ~4 |
| 3 | +15 | **vòng ~3** |
| 5 | +25 | vòng ~2 |

Bà mạnh nhất đúng lúc có nhiều tiếng nói nhất, và đó là câu chuyện của bà viết bằng số.

### Đã sửa gì

**1 · `js/data.js` — entry của Psalm: chỉ thêm `talent`, giữ nguyên `ult`**

```js
talent:{ name:'ĐẾM', energy:5 }
```

**2 · `js/battle.js` — hằng số + helper**

```js
const COUNT = { label:'ĐẾM', src:'psalm', energy:5 };
function noteCount(){
  const p=B.units.find(u=>u.id===COUNT.src && u.side==='ally' && u.alive); if(!p) return;
  const c=p.chips.find(x=>x.label===COUNT.label);
  if(c) c.val++; else p.chips.push({ type:'count', label:COUNT.label, val:1 });
  gainEnergy(p, COUNT.energy);          // gainEnergy đã tự gọi updateUnit
}
```

**3 · `js/battle.js` — `enemyAct`, dòng đầu tiên**

```js
async function enemyAct(e){
  noteCount();                          // bà nghe từ lúc nó mở miệng
```

Đặt ở **đầu** chứ không phải cuối: bà đếm cái lượt, không đếm cái kết quả. Kẻ địch bị Psalm chiếm quyền vẫn tính,
vì nó vẫn tới lượt.

**4 · `css/chromefall.css`**

```css
.chip--count{color:var(--chrome-hi);border-color:var(--chrome)}
.chip--count::before{border:0;width:2px;height:7px;background:currentColor;box-shadow:3px 0 0 currentColor}
```

### Không làm

- **Không cho bộ đếm giảm hay reset giữa wave.** Bà không dừng được, đó là cả nhân vật.
- **Không đụng `APOSTASY`.** Cùng lý do đã giữ nguyên `ZERO` của Kira: đó là spec thật, không phải chỗ trống chờ điền.
- **Không cho `[ĐẾM]` chạy khi Psalm đã ngã.** Lọc `alive`.

---

## [BĂNG ĐẠN] + RIPCORD — Kai

**Trạng thái: ĐÃ ÁP DỤNG.** Đo trong trận thật (Chromium):

| Kiểm tra | Kỳ vọng | Đo được |
|---|---|---|
| Đòn thường 3 phát (tắt may rủi) | 129 | 129 (một phát đơn: 95) |
| `RIPCORD` 6 phát | 258 | 258 |
| Địch chết giữa loạt | dừng loạt | dừng, không bắn vào xác |
| **Chí mạng riêng từng phát** (bật may rủi) | dải rộng | **30 giá trị khác nhau trong 60 loạt** |
| Đối chiếu `IAIDO` cùng lúc | đúng một con số | **1 giá trị trong 20 phát** |
| Nhãn nút ult | đúng theo kind | `6×45%` / `SHIELD` / `280% ATK` / `HEAL` |

Hai dòng giữa là cả trục thiết kế chứng minh bằng số: hai nhân vật, cùng một trận, một người ra 30 kết quả
khác nhau còn người kia ra đúng một.

> **Sửa lỗi giao diện tìm ra khi làm Kai:** nhãn nút chiêu cuối rơi vào nhánh cuối `mult*100 + % ATK` cho mọi kind
> chưa liệt kê, nên `BULWARK PROTOCOL` của Meridian hiện *"160% ATK"* — sai, đó là lá chắn chứ không phải sát thương.
> Đã thêm nhánh cho `barrier` (SHIELD) và `burst` (`6×45%`).

### Cơ chế

| | |
|---|---|
| **[BĂNG ĐẠN]** | Đòn thường = **3 phát × 45% ATK**, không phải 1 phát × 100% |
| Chí mạng | **Mỗi phát tung riêng** |
| Mục tiêu chết giữa loạt | Dừng loạt, không bắn vào xác |
| **`RIPCORD`** | **6 phát × 45% ATK** lên một mục tiêu, cũng tung chí mạng riêng từng phát |

`RIPCORD` = **`kind:'burst'`** — loại chiêu cuối thứ sáu, sau `nuke` / `aoe` / `heal` / `control` / `barrier`.

### Đây là nhân vật duy nhất đánh nhiều hơn một phát

Chín cơ chế trước đều đổi **giá trị** của một đòn, hoặc đổi **đích đến**, hoặc thêm/bớt trạng thái. Không cái nào đổi **số lượng đòn**. Kai đổi.

Hệ quả: cậu ăn theo mọi thứ tính riêng từng đòn. Ba lần tung chí mạng thay vì một, và ba lần va vào lá chắn của địch nếu sau này có địch mang chắn.

**Kai và Ronin là hai cực của cùng một trục, xếp thế là cố ý:**

| | Ronin `IAIDO` | Kai `RIPCORD` |
|---|---|---|
| Số đòn | một | sáu |
| Chí mạng | không có | sáu lần tung riêng |
| Sai số | không có | có, trên từng phát |
| Kết quả | **đúng một con số mỗi lần** | **dải rộng nhất game** |

Kỳ vọng đòn thường: `95 × 3 × 0.45 × 1.075` ≈ **138**, so với `95 × 1.075` ≈ 102 nếu đánh một phát.
Đổi lại là phương sai lớn hơn nhiều — đúng một thằng nhóc mười chín tuổi bắn cho tới khi có chuyện đáng kể lại.

### Đã sửa gì

**1 · `js/data.js` — entry của Kai**

```js
ult:{ name:'RIPCORD', cost:100, kind:'burst', shots:6, mult:.45,
      desc:'Sáu phát 45% ATK lên một mục tiêu, mỗi phát tính chí mạng riêng' },
talent:{ name:'BĂNG ĐẠN', shots:3, mult:.45 }
```

**2 · `js/battle.js` — hàm bắn loạt**

```js
async function fireBurst(u, t, shots, mult){
  let last=null;
  for(let i=0;i<shots;i++){
    if(!t.alive) break;                          // chết giữa loạt thì thôi, không bắn vào xác
    last=dealDamage(u,t,mult);
    if(i<shots-1) await wait(reduced()?40:90);
  }
  return last;
}
```

**3 · `js/battle.js` — `playerAttack`: rẽ nhánh nếu có `talent.shots`**

```js
  if(u.talent && u.talent.shots) await fireBurst(u,t,u.talent.shots,u.talent.mult);
  else dealDamage(u,t,1);
```

**4 · `js/battle.js` — nhánh chiêu cuối `burst`**

```js
  } else if(k==='burst'){
    const t=ensureTarget(); const anim=playAttackAnim(u); await wait(90);
    await fireBurst(u,t,u.ult.shots,u.ult.mult);
    await anim;
```

**5 · `js/battle.js` — `updateUltButton`: sửa nhãn cho `burst` và `barrier`**

Nhãn hiện tại rơi vào nhánh cuối `Math.round(u.ult.mult*100)+'% ATK'`, nên `RIPCORD` sẽ hiện *"45% ATK"* (sai, đó là một phát)
và `BULWARK PROTOCOL` của Meridian hiện *"160% ATK"* (sai, đó là lá chắn chứ không phải sát thương). Sửa luôn cả hai:

```js
const meta = u.ult.kind==='control' ? 'CONTROL'
           : u.ult.kind==='heal'    ? 'HEAL'
           : u.ult.kind==='barrier' ? 'SHIELD'
           : u.ult.kind==='burst'   ? `${u.ult.shots}×${Math.round(u.ult.mult*100)}%`
           : Math.round(u.ult.mult*100)+'% ATK';
```

**6 · `css/chromefall.css`** — không cần chip mới. `[BĂNG ĐẠN]` là hành vi, không phải trạng thái.

### Không làm

- **Không cho số phát ngẫu nhiên.** Đã cân nhắc "2 đến 4 phát" cho hợp tính khoác lác của cậu, rồi bỏ: đòn thường của người chơi mà số lượng ngẫu nhiên thì đọc như lỗi, không đọc như thiết kế. Phương sai đã nằm ở chí mạng từng phát rồi.
- **Không cho `RIPCORD` chia mục tiêu.** Dốc cạn băng vào **một** con. Diện rộng đã có Ash và Wire.
