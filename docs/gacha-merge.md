# GỘP GACHA — một bể, mở khoá theo kẻ đã đánh bại

Kế hoạch cho đợt gộp hai bể `REQUISITION` + `CHIÊU MỘ` thành **một bể duy nhất**, và thay khoá-theo-chương
của kẻ địch bằng **khoá-theo-đã-đánh-bại**: chưa hạ con nào thì con đó không có trong bể.

Viết 12/09. Chưa cài. Nhánh `claude/requisition-recruitment-mechanics-d58352`.

---

## A. Vì sao gộp

Hai bể dựng ngày 11/09 chạy **chung một hàm** `pull()` ([js/data.js:1216](../js/data.js)). Toàn bộ khác biệt
nằm trong 5 trường của object `BANNERS` ([js/data.js:1172](../js/data.js)):

| | REQUISITION | CHIÊU MỘ |
|---|---|---|
| tiền | SH | CR |
| giá ×1 / ×10 | 30 / 270 | 600 / 5400 |
| tỉ lệ S/A/B | 3 / 15 / 82 | 2 / 13 / 85 |
| pity S | 50 | 60 |
| bể | 17 nhân vật | 20 kẻ địch |

Còn lại **giống hệt**: cách đếm pity, đảm bảo ≥1 A khi quay ×10, rate-up 50% cho người featured, màn lật thẻ,
trùng đẩy vào `PLAYER.extra` không hoàn tiền. Và quan trọng nhất, **đầu ra đổ chung một chỗ**:
[js/data.js:614](../js/data.js) nhét bản sao kẻ địch thẳng vào `ROSTER`, nên con Scav chiêu mộ về và Ronin
quay ra là cùng một loại object, cùng tranh 3 slot squad, cùng thang nâng cấp CR.

Nên hai cái tên hứa hẹn hai chuyện khác nhau — xin quân từ trên / thu nạp kẻ bại trận — mà code chỉ là **một
gacha có hai tab**. Cái fiction "thu nạp kẻ bại trận" không được cơ chế nào chống lưng: hiện tại chỉ cần tới
chương 1 là quay ra được Mother Rust dù chưa từng gặp bà.

Đợt này lấy chính cái fiction đó làm cơ chế thật, rồi bỏ tab đi.

---

## B. Chốt

**Một bể.** Tên `REQUISITION`, trả SH, giá 30 / 270, tỉ lệ S 3 / A 15 / B 82, pity 50. Bỏ tab, bỏ
`BANNERS.crew`, bỏ khái niệm "banner đang xem".

**Bể = nhân vật đã tới chương + kẻ địch ĐÃ ĐÁNH BẠI.**

- Nhân vật: giữ nguyên khoá theo chương (`debut ≤ releasedChapter()`). Truyện quyết định, không phải wave.
- Kẻ địch: phải **đã hạ con đó trong trận** mới vào bể. Khoá theo chương vẫn giữ làm lớp ngoài (chương 2 chưa
  ra thì địch chương 2 không vào bể kể cả khi gặp ở DẸP LOẠN).

Bể tự lớn theo tiến trình, không cần cân thêm:

| xong màn | địch mới hạ | bể |
|---|---|---|
| (mới tạo hồ sơ) | — | 4 |
| 00-T | scav · gutterrat · straydog | 7 |
| 07-A | welder · chopshop · bulwark · rigger | 11 |
| 07-B | slagger · pipefitter · tinman · kiln · foreman · hollow | 17 |
| 07-C | drone · glassjaw · enforcer · chromehound · archon | 22 |
| 07-D | drillbit · motherrust | 24 |
| 07-E | (cantor — không chiêu mộ được) | 24 |

Đầu game bể đúng 4 người như REQUISITION hôm nay, nên nhịp mở màn không đổi. Trần chương 1 là 24 thay vì 17 +
20 tách rời.

---

## C. Quyết định

Chốt luôn, không hỏi lại. Lý do ghi kèm để sau này đổi thì biết mình đang đổi cái gì.

**C1. Tiền của bể gộp = SH.** CR về lại đúng một việc: nâng cấp nhân vật.
Vì SH đã là tiền gacha ở mọi chỗ người chơi đọc — nhiệm vụ ngày "Quay Requisition 1 lần"
([js/state.js:62](../js/state.js)), chữ thưởng cuối trận, nút DEV. Đổi sang CR thì phải sửa hết, và tệ hơn:
CR làm hai việc cùng lúc thì mỗi lần quay là một lần không nâng cấp được, nâng cấp thành hình phạt.

**C2. Giá giữ 30 / 270 SH.** Không lấy trung bình với 600 / 5400 — đó là số CR, không cùng thang.
Bể to lên (17 → tối đa 37 khi ra hết 3 chương) nhưng nhịp đã do C-bảng ở §B lo: bể thật bắt đầu ở 4 và lớn dần
theo số con đã hạ. Nhịp đến từ cái khoá, không đến từ giá.

**C3. Thưởng DẸP LOẠN giữ nguyên số, chỉ sửa chữ.**
`reward: n => ({ shards: Math.min(60, 10+2*n), credits: 200+120*n })` ([js/data.js:656](../js/data.js)) —
trần 60 SH mỗi tầng giờ là cái van duy nhất của cả gacha, và đó là chủ ý: SH khan, CR cày vô hạn.
Hệ quả phải nói thẳng: **CR mất chỗ tiêu thứ hai**, nâng cấp max hết đội là CR thành rác. Không cân lại bây
giờ vì CYBERWARE (đợt 3+4, 60 món) là cái hố CR đang tới; cân trước rồi cân lại lần nữa là làm hai lần.
Chữ phải sửa: [js/app.js:460](../js/app.js) đang viết "Dẹp loạn là chỗ cày CR để chiêu mộ quân".

**C4. Lưu "đã đánh bại" vào `PLAYER.defeated` — mảng id, ghi ngay lúc con đó chết.**
Không suy từ `PLAYER.cleared`, vì hai lý do:
1. DẸP LOẠN **không ghi vào `cleared`** ([js/battle.js:541](../js/battle.js) nhánh `mode==='riot'`). Suy từ
   `cleared` thì người cày 20 tầng dẹp loạn không mở được con nào — đọc ra thành lỗi.
2. Hạ được trùm ở wave 3 rồi chết ở wave 4 thì vẫn là đã hạ. Bắt clear cả màn mới tính là tự đặt thêm một
   luật người chơi không được thông báo.

Chốt: **tính lúc chết, thắng thua không liên quan.**

**C5. Chuyển hồ sơ cũ: gieo `defeated` từ `cleared` × `SECTORS[].plan`.**
Người đã xong 07-B mà mở bản mới thấy bể tụt về 4 là mất tiến trình. Gieo một lần trong `migrateProfile`.

**C6. Gate chỉ áp cho `recruit:true`.** Nhân vật không phải đánh bại mới quay được — Ronin là đồng đội từ đầu
chương, bắt hạ Ronin thì vô nghĩa.

**C7. Con chưa hạ hiện ở lưới xám `#gLocked`, nhóm riêng, ghi chỗ gặp.**
Lưới đã có sẵn cho người chưa tới chương ([js/app.js:283](../js/app.js) `renderLockedPool`). Thêm một nhóm
`CHƯA ĐÁNH BẠI` kèm màn gặp được (suy từ `SECTORS[].plan`, không chép tay). Đúng nguyên tắc đã viết ở
[js/app.js:266](../js/app.js): nói thật về bể, đừng để người chơi quay mãi không hiểu vì sao.

**C8. Pity gộp = `max(hero, crew)`.** Giữ nguyên hình dạng object `{hero:n}` để `pityOf` không phải sửa.
Lấy số lớn hơn là hướng có lợi cho người chơi; xấu nhất là sớm ra một con S. Bể `crew` mới sống một ngày
(11/09) nên chẳng ai kịp gom, cái giá gần bằng không. Giữ object chứ không hạ về số trơn: mai có bể giới hạn
thời gian thì khỏi chuyển hồ sơ lần thứ ba.

**C9. Featured = `ronin`.** Bỏ `archon`. Ronin là người của chương 1 và `bannerFeatured()` đã có nhánh dự
phòng khi người featured còn khoá.

**C10. Tỉ lệ + pity lấy bản của REQUISITION** (3/15/82, pity 50), không lấy 2/13/85 + 60. Một bể giờ gánh cả
game thì lấy bản rộng tay hơn.

---

## D. Việc phải làm

### D1 · `js/data.js`

1. `BANNERS` → `BANNER` (một object, bỏ `crew`). `pick` mới:
   `c => !STORY_ONLY.includes(c.id) && (!c.recruit || beaten(c.id))`.
   Giữ `cur:'shards'`, `curLabel:'SH'`, giá/tỉ lệ/pity theo C2 + C10, `featured:'ronin'` theo C9.
2. Thêm `const beaten = id => (PLAYER.defeated||[]).includes(id);` cạnh `owns`.
3. `bannerById()` bỏ. `pull(n, bannerId)` → `pull(n)`; `rollOne(b)` giữ tham số `b` (nội bộ) hoặc đọc thẳng
   `BANNER` — chọn giữ tham số, `gachaPool(tier, b=BANNER)` đã mặc định sẵn.
4. `bannerPool` / `bannerLocked` / `bannerFeatured` / `gachaPool`: đổi mặc định `b=BANNER`.
   **`bannerLocked` phải phân biệt hai lý do khoá** để C7 in đúng nhóm — trả về mảng có `why:'chapter'|'unbeaten'`,
   hoặc thêm hàm thứ hai. Chọn: `bannerLocked()` trả `[{def, why}]`.
5. `PLAYER_DEFAULTS`: thêm `defeated:[]`, `pity:{hero:0}` (bỏ `crew`).
6. `migrateProfile`: thay khối pity 11/09 ([js/data.js:797](../js/data.js)) bằng gộp theo C8; thêm gieo
   `defeated` theo C5 — nếu `!Array.isArray(p.defeated)` thì dựng từ `p.cleared` × `SECTORS[].plan`
   (`SECTORS` khai **trước** khối hồ sơ nên gọi được).
7. Khối chú thích "GACHA — hai bể riêng (chốt 11/09)" ([js/data.js:1163](../js/data.js)) viết lại. Khối
   "CHIÊU MỘ — kẻ địch chương 1 thành đơn vị chơi được" ([js/data.js:487](../js/data.js)) giữ nguyên cơ chế
   nhưng sửa câu nói về hai bể. Khối "KHOÁ THEO CHƯƠNG" ([js/data.js:1148](../js/data.js)) thêm lớp gate mới.

### D2 · `js/battle.js`

8. `killUnit(u)` ([js/battle.js:424](../js/battle.js)) — chỗ duy nhất mọi cái chết đi qua (cả sát thương ở
   dòng 362 và độc/cháy ở dòng 451). Thêm: `u.side==='enemy'` thì `PLAYER.defeated.push(u.id)` nếu chưa có.
   `makeUnit` spread `...def` nên `u.id` chính là id trong `ENEMY_POOL`. `controlled` **không** đổi `side`
   nên con bị điều khiển chết vẫn tính đúng.
   Không `savePlayer()` ở đây.
9. `finish(win)` ([js/battle.js:563](../js/battle.js)): gọi `savePlayer()` một lần, **cả nhánh thua** — hôm
   nay thua thì không lưu gì. Kèm dòng chữ ở bảng kết quả khi có con mới vào bể:
   `MỞ BỂ · <tên> — quay được ở REQUISITION`.

### D3 · `index.html`

10. Bỏ `<div class="lore__tabs gacha__tabs" id="gachaTabs">` + 2 nút ([index.html:156](../index.html)).
11. `#gCurLbl` cứng `SH` (giữ thẻ, `renderGacha` không set nữa) — hoặc bỏ hẳn `#gCurLbl` và viết `SH` thẳng.
    Chọn: giữ thẻ, bỏ dòng set.
12. Sửa comment `<!-- ===== SCREEN: GACHA — hai bể... -->` và comment ở `#gLocked`.

### D4 · `js/app.js`

13. Bỏ `GA` + `curBanner` + listener tab ([js/app.js:234-240](../js/app.js)).
14. `renderGacha()`: `b` = `BANNER`; bỏ dòng set `#gachaTitle`/`#gCurLbl`/class tab; `PLAYER[b.cur]` → giữ
    (vẫn đúng, `cur:'shards'`).
15. `#gNote`: câu "Bể của chương này chưa mở ai" giờ sai — bể trống chỉ xảy ra nếu chưa hạ ai **và** chưa tới
    chương ai, thực tế không xảy ra (4 nhân vật chương 1 luôn có). Đổi câu mô tả sang nói cả hai đường vào bể.
16. `renderLockedPool()`: nhận `[{def, why}]`, in hai nhóm — `CHƯA ĐÁNH BẠI` (kèm màn gặp) và `CHƯƠNG n`.
17. `doPull()`: `pull(n, b.id)` → `pull(n)` ([js/app.js:381](../js/app.js)).
18. Nút DEV `#btnRefill` ([js/app.js:446](../js/app.js)): bỏ nhánh chọn tiền, nạp 1000 SH.
19. Chữ DẸP LOẠN theo C3 ([js/app.js:460](../js/app.js)).
20. Comment `/* Hai bể: ... */` viết lại.

### D5 · `css/chromefall.css`

21. `.gacha__tabs` ([css/chromefall.css:583](../css/chromefall.css)) thành mã chết → bỏ.
22. `.glocked__ch` dùng lại cho nhãn nhóm mới, không cần thêm class; nếu nhãn "CHƯA ĐÁNH BẠI" dài hơn
    "CHƯƠNG 1" làm xô hàng thì thêm `.glocked__ch--foe` màu khác.

### D6 · `scratch/library_dump.js`

23. Dòng 15-16 destructure `BANNERS` → `BANNER`; `ownText()` dòng 31 bỏ nhánh `d.recruit ? crew : hero`,
    đổi câu thành `gacha · trả SH` cho cả hai, và với `recruit:true` thì thêm `· phải hạ <tên> trước`.
    Không sửa là script vỡ ngay (`BANNERS` thành `undefined`).

### D7 · Chữ lẻ

24. [index.html:131](../index.html) CONFIG "VIDEO MỞ RƯƠNG … ở REQUISITION" — vẫn đúng, để nguyên.
25. [js/state.js:62](../js/state.js) nhiệm vụ ngày "Quay Requisition 1 lần" — vẫn đúng, để nguyên.
26. [README.md:132-137](../README.md) khối "Khoá gacha theo chương" — viết lại: một bể, và luật mới.
27. `docs/plan-2026-09.md` §J — thêm mục 12/09 khi cài xong.

---

## E. Cách kiểm

Chạy trong thư mục dự án.

```bash
node scratch/ult_lint.js
```

```bash
node scratch/library_dump.js
```

```bash
node scratch/sim.js 400
```

```bash
python -m http.server 8765
```

Trong game (F12 → Console):

- **Bể đầu game:** `localStorage.removeItem('chromefall.player.v3')` → tải lại → màn GACHA phải là **4 đơn vị**
  (ash, kai, ronin, muzzle), lưới xám có nhóm `CHƯA ĐÁNH BẠI` 20 con kèm màn gặp.
- **Gate mở đúng lúc:** đánh 00-T, để chết ở wave 1 sau khi hạ 1 con → con đó **phải** vào bể dù thua trận.
- **Gate qua DẸP LOẠN:** `PLAYER.defeated` phải dài ra sau một tầng dẹp loạn (đó là lý do C4 không suy từ
  `cleared`).
- **Cantor không vào bể:** hạ cantor ở 07-E → `PLAYER.defeated` có `cantor` nhưng `bannerPool()` không có
  (`RECRUIT_SKIP`, không nằm trong `ROSTER`).
- **Hồ sơ cũ không tụt:** đặt tay `PLAYER.cleared=['00-T','07-A','07-B']`, xoá `PLAYER.defeated`, tải lại →
  bể phải là **17**.
- **Pity gộp:** hồ sơ cũ `pity:{hero:12, crew:47}` → sau chuyển đổi phải là `{hero:47}`.
- **Quay tới trần:** khi đã sở hữu hết bể, `#gNote` phải nói "đã đủ", không phải "bể trống".

Kiểm ở **375×667** lẫn 375×812: bỏ hàng tab làm màn GACHA cao lên 1 hàng, thanh pity và nút Pull không được
trôi xuống dưới màn.

---

## F. Ngoài phạm vi đợt này

- **Sổ bộ vs Nhân vật ở ARCHIVE.** 20 trong 21 mục Sổ bộ trùng id với tab Nhân vật; chỉ `cantor` là riêng.
  Nội dung **không** trùng (Sổ bộ = lore không số, viết theo phía địch, `openCodex`; Nhân vật = bảng kit có
  số, viết theo phe mình, `openLore`) nên đây là trùng **mặt**, không trùng cơ chế. Để đợt sau.
- **Cân lại kinh tế CR** sau khi CYBERWARE có chỗ tiêu (C3).
- **Bể giới hạn thời gian.** Hình dạng `{hero:n}` của pity giữ lại chỗ cho nó (C8), nhưng không cài bây giờ.
