# CYBERWARE — kế hoạch & đặc tả (11/09)

Màn hình riêng để **trang bị và nâng cấp**: chọn nhân vật → chọn ô → đi lên trong một **thang 10 bậc**.
Đây là **đợt 3 + đợt 4** của kế hoạch giữ chân (`docs/plan-2026-09.md`), gộp làm một vì chúng là hai nửa của
cùng một vòng: phân tách bản dư ra **linh kiện**, rồi tiêu linh kiện vào cyberware.

Đợt 2 (chiếm bãi) ở `docs/dep-loan.md`.

> **Bản này dựng lại theo bộ art anh gửi chiều 11/09.** Bản đầu tôi tự nghĩ ra 5 ô × 3 hạng × 3 bậc.
> Anh gửi **6 tấm contact sheet, mỗi tấm 10 món xếp 01→10 theo độ hiếm** — bộ art đó nói ra một mô hình
> gọn hơn hẳn: **một thang, không phải hai trục**. Theo lệ của dự án (art thắng, chữ và cơ chế chạy theo
> art) thì đổi hết. Chi tiết cái gì đổi và vì sao ở §H.

---

## A. Vì sao gộp đợt 3 và đợt 4

Từ đợt 1 (11/09) gacha **không hoàn SH khi trùng nữa** — lá trùng rơi vào `PLAYER.extra` với lời hứa "giữ lại
để phân tách lấy linh kiện". Lời hứa đó treo hai đợt rồi: người chơi quay ×10 ở CHIÊU MỘ, nhận về 6–7 lá trùng,
và chúng **không làm gì cả**. Càng quay nhiều càng thấy vô nghĩa.

Cyberware mà không có nguồn linh kiện thì cũng là một màn hình trống. Hai thứ này khoá vào nhau, nên làm rời
ra là làm hai lần một nửa. Gộp lại thì vòng lặp đóng kín ngay:

```
DẸP LOẠN → CR → CHIÊU MỘ ×10 → lá trùng → PHÂN TÁCH → LINH KIỆN (LK)
   → nâng bậc 6 ô cyberware → đội mạnh hơn → bãi lớn hơn / tầng cao hơn → CR
```

Đây cũng là chỗ **lá trùng bậc S cuối cùng có giá**: 60 LK một lá, đủ trả gần hai bậc giữa thang.

---

## B. Quyết định đã chốt

Theo lệ: chỗ nào cần hỏi thì tự chọn cái khuyến nghị rồi ghi lại (xem `chromefall-work-style`).

| # | Câu hỏi | Chốt | Vì sao |
|---|---|---|---|
| Q1 | Vào màn từ đâu? | **Nút `CYBERWARE` ở menu HOME** + nút tắt trong hồ sơ nhân vật (ARCHIVE → KỸ NĂNG) | Nó là màn nâng sức mạnh, ngang hàng SQUAD/GACHA. Nút tắt trong hồ sơ vì đó là chỗ người chơi đang nhìn chỉ số. |
| Q2 | Mấy ô? | **6 ô: ĐẦU · THÂN · TAY · CHÂN · PHỤ KIỆN A · PHỤ KIỆN B** | Đúng 6 tấm art anh gửi. Bản đầu tách NÃO/MẮT là tôi tự nghĩ; art gộp cả hai vào dòng mũ/nón bảo hiểm và thêm hai ô phụ kiện. |
| Q3 | Một trục hay hai? | **Một thang 10 bậc mỗi ô** | Art xếp sẵn 01→10. Người chơi đọc "TAY 06/10" là biết ngay mình ở đâu; "hạng A bậc 2" thì phải nhẩm. Bỏ luôn khái niệm chế tạo/tháo/hoàn. |
| Q4 | Cyberware cộng gì? | **Chỉ 4 chỉ số `unitStats` đang trả về**: ATK% · HP% · SPD · CRIT | Nối vào `unitStats(id)` là xong — thẻ nhân vật, `power()`, và lúc vào trận tự khớp. Thêm chỉ số mới thì phải sửa cả engine. |
| Q5 | LK lấy ở đâu? | **Chỉ từ phân tách bản dư** ở đợt này | Đóng đúng lời hứa đang treo. Bãi ở DẸP LOẠN vẫn **không** đẻ LK (giữ nguyên Q7 của `dep-loan.md`) — thêm một vòi nữa là phải cân lại cả bảng thu nhập. |
| Q6 | Tháo ra được không? | **Không.** Thang chỉ đi lên | Không có gì để tháo: bậc sau luôn hơn bậc trước ở cùng một ô. Bỏ được cả cơ chế hoàn 50% LK của bản đầu. |
| Q7 | RONIN thì sao? | **Đi được tới món cuối cùng còn là ĐỒ MẶC VÀO của từng ô rồi dừng**, và món ở đúng bậc trần đó cho **×1.5** chỉ số | Chính bộ art giải bài này: bậc thấp không phải cấy ghép mà là **găng tay, áo khoác, mũ lưỡi trai, giày**. Nên anh không bị khoá sạch, chỉ dừng ở chỗ món bắt đầu thay thịt bằng máy. Xem §D3. |
| Q8 | Tên món tiếng Việt hay tiếng Anh? | **Giữ nguyên tiếng Anh như in trên art** | Chữ trong game và chữ trên ảnh phải là một. Dòng phụ thì viết tiếng Việt. |
| Q9 | Cắt 60 ảnh thế nào? | **`scratch/cyber_sheet.py`** cắt lưới 5×2, khử nền (tự dò alpha/xanh/trắng), cắt sát nội dung, ra **WebP 512 vuông** | Cùng loại việc với `key_enemy.py`. Chưa có file thì giao diện vẽ icon SVG của ô — không bao giờ là ô trống. |
| Q10 | Cyberware theo từng nhân vật hay dùng chung? | **Theo từng nhân vật** | Đây là chỗ "chọn 3 người để đầu tư" trở thành một quyết định thật, và nó khớp với luật đồn trú bên DẸP LOẠN (`power()` có tính cyberware). |

---

## C. Số liệu

### C1. 6 ô × 10 bậc = 60 món

Độ hiếm theo bậc, đúng nhịp in trên art: `01 02` COMMON · `03 04` UNCOMMON · `05 06` RARE · `07 08` EPIC ·
`09` LEGENDARY · `10` MYTHIC.

| Ô | id | Chỉ số | 01 → 10 |
|---|---|---|---|
| **ĐẦU** | `head` | CRIT + SPD | Street Cap · Tactical Cap · Tech Beanie · Tactical Headset · Urban Helmet · Tactical Helmet · Combat Helmet · Exo Helmet · Neural Helmet · Quantum Helmet |
| **THÂN** | `body` | HP | Street Jacket · Tactical Jacket · Field Coat · Tech Coat · Armored Jacket · Tactical Coat · Cyber Coat · Augment Coat · Prime Coat · Void Coat |
| **TAY** | `arm` | ATK | Field Gloves · Reinforced Gloves · Tactical Glove · Augment Glove · Prosthetic Arm MK.I · MK.II · Cyber Arm MK.III · MK.IV · Advanced Cyber Arm · High Quality Prosthetic Arm |
| **CHÂN** | `legs` | SPD + HP | Street Sneakers · Tactical Boots · Urban Boots · Reinforced Boots · Exo Boots · Performance Boots · Cyber Boots · Advanced Cyber Boots · Orion Boots · Quantum Boots |
| **PHỤ KIỆN A** | `ac1` | HP + CRIT | ID Tag · Neck Scarf · Tactical Earpiece · Tactical Glasses · AR Visor · Respirator Mask · Tactical Backpack · Cyber Cloak · Gravity Halo · Singularity Crown |
| **PHỤ KIỆN B** | `ac2` | ATK + SPD | Tactical Pouch · Access Card Set · Cyber Necklace · Scout Drone · Cyber Earpiece · Tactical Goggles · Neural Watch · Katana Sheath · Levitating Halo · Exo Wings |

> Trên art tấm `ac2` in **"LEVIATING HALO"** — thiếu chữ `T`. Trong game viết đúng **LEVITATING HALO**.
> Đây là chỗ duy nhất chữ trong game lệch chữ trên ảnh; nếu anh sinh lại tấm đó thì sửa luôn cho khớp.

### C2. Chỉ số ở bậc 10 và đường cong ★ FAKE

| Ô | Ở bậc 10 |
|---|---|
| ĐẦU | +22 CRIT · +6 SPD |
| THÂN | +26% HP |
| TAY | +28% ATK |
| CHÂN | +16 SPD · +10% HP |
| PHỤ KIỆN A | +16% HP · +12 CRIT |
| PHỤ KIỆN B | +16% ATK · +8 SPD |

Bậc thấp hơn = số trên × đường cong `[.05 .09 .14 .20 .28 .36 .46 .60 .78 1.00]`. Dốc lên cuối thang là cố ý:
thang 10 bậc mà chia đều thì bậc nào cũng nhạt như nhau.

**Đủ 6 ô bậc 10: +44% ATK · +52% HP · +30 SPD · +34 CRIT.**
Trên Yuki cấp 1: `ATK 145 → 209 · HP 950 → 1.444 · SPD 112 → 142 · CRIT 20 → 54`.

### C3. Giá

Giá để **lên bậc k** (bậc 1 mua từ ô trống): `LK = round(4 × 1.45^(k−1))`, `CR = LK × 60`.

| Bậc | 01 | 02 | 03 | 04 | 05 | 06 | 07 | 08 | 09 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| LK | 4 | 6 | 9 | 13 | 19 | 27 | 39 | 56 | 80 | 115 |
| CR | 240 | 360 | 540 | 780 | 1 140 | 1 620 | 2 340 | 3 360 | 4 800 | 6 900 |

- Một ô đi hết thang: **368 LK + 22 080 CR**
- Một nhân vật đủ 6 ô bậc 10: **2 208 LK + 132 480 CR**
- RONIN đi hết trần của anh (41 bậc): **≈ 830 LK + 49 800 CR**

Bậc đầu gần như cho không (4 LK) là cố ý — mở màn phải thấy ngay một bước tiến.

### C4. Linh kiện từ phân tách

| Bậc lá trùng | LK |
|---|---|
| B | 10 |
| A | 25 |
| S | 60 |

Một lượt **CHIÊU MỘ ×10** (5 400 CR) ở bể 20 kẻ địch, khi đã sở hữu gần hết, cho khoảng **7–9 lá trùng**
(tỉ lệ bể 2/13/85) ≈ **85–110 LK**. Ở mức thu nhập DẸP LOẠN đủ 9 bãi (≈ 13 900 CR/ngày) thì đó là
**~2,5 lượt/ngày ≈ 250 LK/ngày**.

→ **Một nhân vật kịch cả 6 ô ≈ 9 ngày. Cả đội 3 người ≈ 26 ngày.** Đúng cỡ việc-của-tháng, và vì `power()`
có tính cyberware nên vẫn phải chọn: dồn cho đội ra trận, hay rải cho quân đồn trú ở DẸP LOẠN.

> **Cảnh báo cân bằng:** `scratch/sim.js` **chưa mô phỏng cyberware** — `--lv` chỉ nhân cấp nâng cấp.
> Bảng tỉ lệ thắng ở `docs/dep-loan.md` §F1 vì thế là **sàn**: người có cyberware sẽ thấy dễ hơn thế.
> Nhãn ÁP ĐẢO/NGANG SỨC vẫn đúng hướng vì `power()` đã tính cyberware qua `unitStats`, nhưng nếu sau này
> thấy vòng 3 của DẸP LOẠN quá dễ thì thủ phạm là ở đây, không phải ở `mult`.

---

## D. Cơ chế

### D1. Nối vào chỉ số

`unitStats(id)` trong `js/state.js` là **chỗ duy nhất** tính chỉ số cuối (README đã ghi vậy từ đợt 1).
Cyberware nối vào đúng đó, qua đúng một hàm `cyberBonus(id)`:

```
atk  = gốc × (1 + 0.04×(cấp−1)) × (1 + ΣatkPct/100)
hp   = gốc × (1 + 0.04×(cấp−1)) × (1 + ΣhpPct/100)
spd  = gốc + Σspd
crit = gốc + Σcrit
```

Nhân với cấp nâng cấp **trước**, rồi mới nhân cyberware — hai nguồn nhân nhau chứ không cộng dồn phần trăm.
Vì thế `cardEl`, `power()`, `initBattle` và màn hồ sơ tự khớp, không phải sửa chỗ nào khác.

### D2. Phân tách

Bản dư đọc từ `PLAYER.extra`. Phân tách **không đụng `PLAYER.owned`**, nên không bao giờ mất nhân vật vì lỡ
tay. Bậc lấy từ `ROSTER[id].tier`.

### D3. RONIN — THÉP TRẦN

Bộ art tự giải bài này: **bậc thấp của mọi ô đều không phải cấy ghép.** Găng da, áo khoác đường phố,
mũ lưỡi trai, giày vải, thẻ bài, khăn che bụi — toàn thứ khoác lên người. Nên Ronin không bị khoá sạch;
anh đi lên như mọi người rồi **dừng ở món cuối cùng còn là đồ mặc vào**:

| Ô | Trần của Ronin | Món cuối anh dùng được | Bậc sau đó là gì |
|---|---|---|---|
| TAY | **02** | REINFORCED GLOVES | 03 Tactical Glove đã là ngón máy |
| THÂN | **07** | CYBER COAT | 08 Augment Coat có cổng nối thần kinh |
| ĐẦU | **08** | EXO HELMET | 09 Neural Helmet nối thẳng vào thần kinh |
| CHÂN | **08** | ADVANCED CYBER BOOTS | 09/10 là đồ bay/nhảy tầng |
| PHỤ KIỆN A | **08** | CYBER CLOAK | 09 Gravity Halo lơ lửng |
| PHỤ KIỆN B | **08** | KATANA SHEATH | 09/10 là vòng lơ lửng và cánh ngoài |

Tổng: **41/60 bậc.** Đổi lại, món đang đứng **đúng bậc trần** cho **×1.5** chỉ số — *đồ trần trong tay anh
ăn đứt đồ cấy trong tay người khác*. Kết quả là một bộ chỉ số khác hẳn chứ không phải yếu hơn:

| | ATK | HP | SPD | CRIT |
|---|---|---|---|---|
| Yuki cấp 1, 60/60 bậc | 209 | 1 444 | 142 | 54 |
| Ronin cấp 1, 41/41 bậc | **154** | **1 484** | 131 | 46 |

Anh mất hẳn sát thương (tay chỉ tới găng), nhưng máu còn hơn, và tốc/chí mạng gần bằng. Cộng với nội tại
+10% chí mạng của đòn thường, Ronin thành người lì đòn đánh chí mạng chứ không phải người đánh mạnh.
★ FAKE — chỉnh bằng `CYBER.bareCap` và `CYBER.bareBonus`, cả hai là một dòng.

---

## E. Giao diện

```
┌─ Cyberware ──────── LK 1.010 · CR 188.600 ─── ◂ BASE ┐
├─ dải chọn nhân vật (cuộn ngang) ─────────────────────┤
│  (o)(o)(o)(o)(o)…  huy hiệu = tổng bậc, RONIN = TRẦN │
├──────────────────────────────────────────────────────┤
│  [chân dung]  YUKI · TIER S · LV 5 · 20/60 BẬC       │
│               ATK 168 ▸ 193   HP 1.102 ▸ 1.152       │
│               SPD 112 ▸ 117   CRIT 20% ▸ 24%         │
├─ 6 Ô ────────────────────────────────────────────────┤
│ [ảnh] ĐẦU   TACTICAL HEADSET  +1.2 SPD · +4.4 CRIT   │
│             ▰▰▰▰▱▱▱▱▱▱                        04/10  │
│ [ảnh] THÂN  FIELD COAT        +3.6% HP               │
│             ▰▰▰▱▱▱▱▱▱▱                        03/10  │
│  …                                                   │
├──────────────────────────────────────────────────────┤
│  [ PHÂN TÁCH BẢN DƯ · 10 LÁ TRÙNG · +130 LK ]        │
└──────────────────────────────────────────────────────┘
```

Chạm một ô → tờ trượt lên hiện **cả 10 bậc**, không chỉ bậc kế:

```
 01 COMMON      FIELD GLOVES           +1.4% ATK         (mờ, đã qua)
 …
 06 RARE  [ĐANG DÙNG]  PROSTHETIC ARM (MK.II)  +10.1% ATK   (viền sáng)
 07 EPIC       CYBER ARM (MK.III)     +12.9% ATK   [ NÂNG · 39 LK · 2.340 CR ]
 08 EPIC       CYBER ARM (MK.IV)      +16.8% ATK        56 LK · 3.360 CR
 …
 10 MYTHIC     HIGH QUALITY PROSTHETIC ARM  +28% ATK     115 LK · 6.900 CR
```

Bày cả thang chứ không chỉ bước kế là **cố ý**: bộ art đã xếp 01→10 thành một con đường, màn hình phải cho
thấy con đường đó. Người chơi nhìn một cái là biết còn bao xa và món cuối trông như thế nào.

Ba luật giao diện giữ như bên DẸP LOẠN: **mọi con số đều có mốc so sánh** (`168 ▸ 193`), **màu = độ hiếm**
(6 màu lấy thẳng từ token có sẵn), và **không có ô trống** — chưa có ảnh thì vẽ icon SVG của ô.

---

## F. Art

### F1. Sáu tấm contact sheet → 60 ảnh rời — **ĐÃ CẮT XONG 11/09**

Anh thả 6 tấm vào **`art-src/CYBER/`** (`head · body · arm · legs · ac1 · ac2`, đều 1536×1024), rồi:

```bash
python scratch/cyber_sheet.py            # cắt cả 6 tấm
python scratch/cyber_sheet.py head arm   # chỉ cắt hai tấm
python scratch/cyber_sheet.py --dry      # xem sẽ làm gì, không ghi file
```

Ra **`art/cyber/<ô><bậc>.webp`** — 60 file, 512×512 nền trong suốt, **2,1 MB cả bộ**.
`art-src/` bị gitignore nên không có trong git worktree; script tự lần theo file `.git` sang bản chính.

**Định dạng: WebP q88, không phải PNG.** Cùng 512px mà 35 KB thay vì 262 KB — cả bộ 2,1 MB thay vì
15 MB, trong khi ảnh chỉ hiện ở cỡ 44–56px. Repo đã dùng `.webp` cho sprite sheet hiệu ứng nên không
thêm định dạng mới. `cyberArt()` thử `.webp` trước rồi mới tới `.png`, nên vẫn đè tay bằng PNG được.

**Số đo bố cục thẻ** (lấy tỉ lệ pixel-đục trung bình theo dòng và theo cột của **cả 60 thẻ** — thẻ do
cùng một khuôn sinh ra nên một lần đo là đúng cho cả bộ):

| Phần | Vị trí | Độ đục |
|---|---|---|
| Đầu thẻ (số + độ hiếm) | dòng 0 – 8.6% | 0.80 – 0.95 |
| **Ảnh** | dòng 9.4 – 82.8% | 0.10 – 0.63 |
| Chân thẻ (tên + mô tả) | dòng 83.6 – 97% | 0.89 – 0.97 |
| Hai viền dọc khung thẻ | cột 2% và 97.7% | 0.54 và 0.35 |

Script làm ba việc: cắt ruột thẻ theo số đo trên (`INNER`), khử nền (**tự dò** `alpha` / `green` /
`bright` cho cả tấm — tấm `arm` anh gửi đã có sẵn kênh trong suốt), rồi cắt sát vật thể và đặt giữa
khung vuông. Thêm `clear_corners()` xoá bốn dấu trang trí ở góc khung, và `bbox()` lọc vệt mảnh.

### F2. Nếu sinh lại tấm nào

Giữ nguyên: **lưới 5×2, 10 thẻ đánh số 01→10, thứ tự độ hiếm COMMON ×2 · UNCOMMON ×2 · RARE ×2 · EPIC ×2 ·
LEGENDARY · MYTHIC**, vật thể nằm giữa ruột thẻ, **nền xanh `#00FF00` đồng nhất** (dễ cắt hơn nền trắng).
Đổi thứ tự hay số lượng thẻ thì phải sửa `CYBER_SLOTS` trong `js/cyber.js` cho khớp.

---

## G. Việc

| # | Việc | File | Xong |
|---|---|---|---|
| C1 | 6 ô × 10 bậc, đường cong, giá, LK, phân tách, trần của RONIN | `js/cyber.js` | ✓ |
| C2 | Màn `cyber` + tờ thang 10 bậc + tờ phân tách | `js/cyberui.js` | ✓ |
| C3 | Giao diện, 6 màu độ hiếm, thanh 10 vạch | `css/cyber.css` | ✓ |
| C4 | Markup màn + nút menu + nạp file | `index.html` | ✓ |
| C5 | Nối cyberware vào `unitStats` + `baseStats` | `js/state.js` | ✓ |
| C6 | `noChrome:true` cho Ronin · ví `parts`/`cyber` trong hồ sơ | `js/data.js` | ✓ |
| C7 | Router + nút tắt trong hồ sơ nhân vật | `js/app.js` | ✓ |
| C8 | Cắt 6 contact sheet → 60 PNG | `scratch/cyber_sheet.py` | ✓ |
| C9 | Ghi vào README + nhật ký | `README.md`, `docs/plan-2026-09.md` | ✓ |

**Không làm ở đợt này:** kho đồ rời, cyberware có nội tại riêng (không chỉ chỉ số), bộ đồ cùng độ hiếm cộng
thêm, cyberware rơi ra từ trận, mô phỏng cyberware trong `sim.js`.

---

## H. Nhật ký

### 11/09 (sáng) — bản đầu, 5 ô × 3 hạng × 3 bậc

Tôi tự nghĩ ra 15 món, icon vẽ bằng SVG. Chạy được, kiểm trong trận thật: Yuki lắp 3 ô thì thẻ nhân vật,
hồ sơ ARCHIVE, `power()` và chỉ số lúc vào trận **cùng ra 198/1102/116/28**.

### 11/09 (chiều) — anh gửi art, dựng lại theo art

Sáu tấm contact sheet, 60 món. Bộ art nói ra một mô hình gọn hơn hẳn nên đổi hết. Cái gì đổi:

| | Bản sáng (tôi nghĩ) | Bản chiều (theo art) |
|---|---|---|
| Ô | 5 (NÃO · MẮT · TAY · NGỰC · CHÂN) | **6** (ĐẦU · THÂN · TAY · CHÂN · PK A · PK B) |
| Trục nâng | hai (hạng B/A/S × bậc 1–3) | **một** (thang 10 bậc) |
| Số món | 15 | **60** |
| Ảnh | icon SVG vẽ tay | **art thật**, cắt từ 6 tấm |
| Tháo/hoàn | có, hoàn 50% LK | **bỏ hẳn** — thang chỉ đi lên |
| RONIN | khoá sạch, bù bằng hằng số bịa ra | **dừng ở món cuối còn là đồ mặc vào**, ×1.5 ở bậc trần |

**Chỗ đáng ghi nhất: bộ art tự giải bài RONIN.** Bản sáng tôi phải bịa ra một bộ chỉ số `CYBER.bare` để bù
cho việc khoá anh khỏi toàn bộ hệ thống — một con số không có lý do nào ngoài "cho khỏi thành nhân vật rác".
Art cho thấy **bậc thấp không phải cấy ghép**: găng da, áo khoác, mũ lưỡi trai, giày vải. Nên luật đúng là
*anh đi lên tới món cuối cùng còn là đồ mặc vào rồi dừng* — đọc thẳng từ ảnh, không bịa. Anh còn 41/60 bậc,
mất hẳn sát thương (tay dừng ở găng tay) nhưng máu và tốc gần bằng. **Bài học lặp lại lần thứ ba trong dự án
này: khi art và cơ chế đá nhau, đọc kỹ art thêm một lượt thường ra luật hay hơn luật mình bịa.**

**Một lỗi im lặng của NumPy 2 bắt được khi viết `cyber_sheet.py`.** NEP 50 giữ nguyên dtype khi trừ mảng
`uint8` với số Python, nên `60 - d` **quay vòng** chứ không ra số âm: mọi pixel thành đục và ảnh cắt ra là
nguyên cái khung thẻ, không báo lỗi gì. Nhánh nền-trắng thì đúng vì nó lỡ ép `int16` từ trước — tức là hai
nhánh cùng một hàm chạy khác nhau mà không ai biết. Ép `int16` ngay đầu hàm. **Đã thử bằng hai tấm giả
(một nền xanh, một nền trắng) trước khi dùng với tấm thật** — cả hai giờ ra cùng kết quả.

**Số ra khi chạy thật:** Yuki 20/60 bậc → ATK 168 → 193, CRIT 20 → 24%. Yuki 60/60 → 209/1.444/142/54.
Ronin 41/41 → 154/1.484/131/46.

**Hồi quy:** `ult_lint` 60/60, `comic_lint` + `art_audit` xanh, chiến dịch không đổi, 9 bãi DẸP LOẠN không
đổi. Console 0 lỗi JS.

### 11/09 (tối) — cắt xong 60 ảnh từ 6 tấm

Anh thả 6 tấm vào `art-src/CYBER/`. Cắt xong: **60 file `art/cyber/<ô><bậc>.webp`, 2,1 MB cả bộ.**

**Bốn lần cắt sai trước khi đúng, và cả bốn đều vì ĐOÁN thay vì ĐO:**

| Lần | Cách làm | Sai ở đâu |
|---|---|---|
| 1 | Cắt cố định `top .13 / bottom .21` (đoán) | Cụt tà áo choàng Mythic — 60/60 ảnh ra cùng cỡ `xxx×338`, đúng bằng vùng cắt |
| 2 | Dò động dải ảnh theo tỉ lệ pixel-nền từng dòng | Đầu thẻ là hình chevron nên vẫn hở nền, còn áo choàng rộng thì dòng nào cũng kín — tín hiệu đảo chiều, ra dải 487px hoặc 150px tuỳ thẻ |
| 3 | Cắt cố định `top .115 / bottom .115` (đoán lại) | Còn dính nguyên thanh chân thẻ và dấu chevron ở góc |
| 4 | Thêm lọc "bỏ hạt lẻ" khi tính hộp bao | Vệt góc dày ~30px chứ không mảnh, lọc không đụng tới |

**Lần thứ năm mới đo thật:** lấy tỉ lệ pixel-đục **trung bình của cả 60 thẻ** theo dòng và theo cột. Vì 60
thẻ do cùng một khuôn sinh ra, biểu đồ trung bình lộ ngay ba dải rõ ràng (số ở §F1) — đầu thẻ 0–8.6%,
ảnh 9.4–82.8%, chân thẻ 83.6–97%, hai viền dọc ở 2% và 97.7%. Cộng thêm `clear_corners()` xoá bốn dấu
trang trí ở góc. Kết quả: 60/60 ảnh có cỡ nội dung **khác nhau**, không ảnh nào chạm mép, không ảnh nào rỗng.

**Dấu hiệu nhận ra mình đang sai mà lúc đầu bỏ qua: 60 ảnh ra cùng một cỡ.** Sáu mươi món khác hình
khác dáng thì không đời nào cùng kích thước — con số đó đã nói "hộp bao đang lấy cả vùng cắt" ngay từ
lần chạy đầu, mà tôi vẫn đi sửa chỗ khác hai lần nữa mới nhìn ra.

**Một nhánh nữa của `key_alpha`:** tấm `arm` anh gửi là RGBA **đã có kênh trong suốt sẵn** — key lại là
hỏng. Thêm nhánh `alpha` dùng thẳng kênh có sẵn, và `sheet_bg` dò ba kiểu nền chứ không phải hai.

**Định dạng:** WebP q88 thay vì PNG — cùng 512px mà 35 KB thay vì 262 KB, cả bộ 2,1 MB thay vì 15 MB.
Ảnh chỉ hiện ở cỡ 44–56px nên không mất gì. `cyberArt()` thử `.webp` trước rồi `.png`.

**Kiểm trong game:** 6 ô của Yuki lên đúng art, thang 10 bậc của PHỤ KIỆN A load đủ 10/10 ảnh,
console 0 lỗi.
