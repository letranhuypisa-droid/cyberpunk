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
