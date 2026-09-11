# CYBERWARE — kế hoạch & đặc tả (11/09)

Màn hình riêng để **cấy ghép và nâng cấp cyberware**: chọn nhân vật → chọn ô → chọn món → lắp / nâng bậc.
Đây là **đợt 3 + đợt 4** của kế hoạch giữ chân (`docs/plan-2026-09.md`), gộp làm một vì chúng là hai nửa của
cùng một vòng: phân tách bản dư ra **linh kiện**, rồi tiêu linh kiện vào cyberware.

Đợt 2 (chiếm bãi) ở `docs/dep-loan.md`.

---

## A. Vì sao gộp đợt 3 và đợt 4

Từ đợt 1 (11/09) gacha **không hoàn SH khi trùng nữa** — lá trùng rơi vào `PLAYER.extra` với lời hứa "giữ lại
để phân tách lấy linh kiện". Lời hứa đó treo hai đợt rồi: người chơi quay ×10 ở CHIÊU MỘ, nhận về 6–7 lá trùng,
và chúng **không làm gì cả**. Càng quay nhiều càng thấy vô nghĩa.

Cyberware mà không có nguồn linh kiện thì cũng là một màn hình trống. Hai thứ này khoá vào nhau, nên làm rời
ra là làm hai lần một nửa. Gộp lại thì vòng lặp đóng kín ngay:

```
DẸP LOẠN → CR → CHIÊU MỘ ×10 → lá trùng → PHÂN TÁCH → LINH KIỆN (LK)
   → cấy ghép + nâng bậc cyberware → đội mạnh hơn → bãi lớn hơn / tầng cao hơn → CR
```

Đây cũng là chỗ **lá trùng bậc S cuối cùng có giá**: 60 LK một lá, gần đủ cho một bậc nâng của món hạng A.

---

## B. Quyết định đã chốt

Theo lệ: chỗ nào cần hỏi thì tự chọn cái khuyến nghị rồi ghi lại (xem `chromefall-work-style`).

| # | Câu hỏi | Chốt | Vì sao |
|---|---|---|---|
| Q1 | Vào màn từ đâu? | **Nút `CYBERWARE` ở menu HOME** + nút tắt trong hồ sơ nhân vật (ARCHIVE → KỸ NĂNG) | Nó là màn nâng sức mạnh, ngang hàng SQUAD/GACHA. Nút tắt trong hồ sơ vì đó là chỗ người chơi đang nhìn chỉ số. |
| Q2 | Mấy ô, ô gì? | **5 ô: NÃO · MẮT · TAY · NGỰC · CHÂN** | Đúng con số kế hoạch tháng 9 ghi ("cyberware 5 ô"), và năm chỗ này là năm thứ truyện đã nói tới (Halo ở đầu, thấu kính vô cảm, tay máy, lồng ngực, chân chạy). |
| Q3 | Cyberware cộng gì? | **Chỉ 4 chỉ số `unitStats` đang trả về**: ATK% · HP% · SPD · CRIT | Nối vào `unitStats(id)` là xong — thẻ nhân vật, `power()`, và lúc vào trận tự khớp. Thêm chỉ số mới thì phải sửa cả engine. |
| Q4 | Lấy cyberware ở đâu? | **Chế tạo tại chỗ bằng LK + CR**, không có kho đồ rời | Kho đồ rời đẻ ra cả một tầng quản lý (sắp xếp, khoá, bán) cho một prototype. Chế thẳng vào ô thì "chọn cyberware" vẫn còn nguyên mà không có tầng nào thừa. |
| Q5 | LK lấy ở đâu? | **Chỉ từ phân tách bản dư** ở đợt này | Đóng đúng lời hứa đang treo. Bãi ở DẸP LOẠN vẫn **không** đẻ LK (giữ nguyên quyết định Q7 của `dep-loan.md`) — thêm một vòi nữa là phải cân lại cả bảng thu nhập. |
| Q6 | "Nâng cấp cyberware" nghĩa là gì? | **Hai trục**: đổi sang món hạng cao hơn (B→A→S) *và* nâng bậc món đang lắp (`+1`, `+2`) | Người chơi vừa có việc ngắn (nâng bậc món đang có) vừa có đích dài (đủ LK cho món hạng S). |
| Q7 | RONIN thì sao? | **Không lắp được** — lore nói rõ "không một khớp nối kim loại". Đổi lại anh có **THÉP TRẦN**: cộng cố định bằng một bộ hạng A đầy đủ | Truyện là canon trong dự án này (xem lệ "art thắng chữ"). Nhưng khoá suông thì Ronin thành nhân vật rác, nên phải bù. ★ FAKE, chỉnh bằng một hằng số. |
| Q8 | Icon 15 món? | **Vẽ bằng SVG trong code**, prompt cho art thật ở §F | Đúng lệ "thử code trước". Thả `art/cyber/<id>.png` vào là tự thay. |
| Q9 | Tháo món ra có hoàn không? | **Hoàn 50% LK** đã bỏ vào (cả tiền chế lẫn tiền nâng), không hoàn CR | Thử một cấu hình rồi đổi ý không được phạt nặng; giữ 50% để không thành cái máy in LK. |

---

## C. Số liệu

### C1. 15 món (5 ô × 3 hạng) ★ FAKE

| Ô | Hạng B | Hạng A | Hạng S |
|---|---|---|---|
| **NÃO** | CHIP THẦN KINH THÔ<br>+3 CRIT | BỘ ĐỒNG BỘ TÁI CHẾ<br>+5 CRIT · +3 SPD | LÕI HALO TÁI SINH<br>+8 CRIT · +4% ATK |
| **MẮT** | THẤU KÍNH NHẶT BÃI<br>+4 CRIT | MẮT NGẮM QUÂN DỤNG<br>+7 CRIT · +3% ATK | MẮT THÁP<br>+11 CRIT · +5% ATK |
| **TAY** | KHỚP TAY HÀN LẠI<br>+5% ATK | TAY MÁY XƯỞNG RÃ<br>+9% ATK | TAY THÉP CANTICLE<br>+14% ATK · +3 CRIT |
| **NGỰC** | GIÁP TÔN CHẮP<br>+6% HP | LỒNG NGỰC GIA CỐ<br>+11% HP | LÕI PHẢN ỨNG CHROME<br>+16% HP · +3% ATK |
| **CHÂN** | GIÀY ĐỆM LÒ XO<br>+4 SPD | CHÂN CHẠY ĐƯỜNG ỐNG<br>+7 SPD · +3% HP | CHÂN NHẢY TẦNG<br>+11 SPD · +4% HP |

Bậc nhân thẳng vào số trên: **bậc 1 ×1 · bậc 2 ×1.5 · bậc 3 ×2**.

### C2. Giá

| | Chế tạo | Nâng bậc 2 | Nâng bậc 3 |
|---|---|---|---|
| Hạng B | 20 LK + 600 CR | 12 LK + 360 CR | 24 LK + 720 CR |
| Hạng A | 60 LK + 2 400 CR | 36 LK + 1 440 CR | 72 LK + 2 880 CR |
| Hạng S | 150 LK + 7 000 CR | 90 LK + 4 200 CR | 180 LK + 8 400 CR |

Nâng bậc = `0.6×` và `1.2×` giá chế. **Một ô hạng S kịch bậc = 420 LK + 19 600 CR.**
Năm ô, một nhân vật: **2 100 LK + 98 000 CR** — ngang tiền nâng một nhân vật từ cấp 1 lên 20 (76 000 CR),
cố ý, để hai trục nâng không lệch nhau quá xa.

### C3. Linh kiện từ phân tách

| Bậc lá trùng | LK |
|---|---|
| B | 10 |
| A | 25 |
| S | 60 |

Một lượt **CHIÊU MỘ ×10** (5 400 CR) ở bể 20 kẻ địch, khi đã sở hữu gần hết, cho khoảng **7–9 lá trùng**
(tỉ lệ bể là 2 / 13 / 85) ≈ **85–110 LK**. Ở mức thu nhập của DẸP LOẠN đủ 9 bãi (≈ 13 900 CR/ngày) thì đó là
**~2,5 lượt/ngày ≈ 250 LK/ngày** — tức khoảng **một ô hạng B kịch bậc mỗi ngày**, hoặc gom 8–9 ngày cho một ô
hạng S kịch bậc. Đủ chậm để thành việc của tháng, đủ nhanh để mỗi ngày thấy một bước.

### C4. Sức mạnh cộng thêm

Bộ hạng S kịch bậc (cả 5 ô): **+52% ATK · +40% HP · +22 SPD · +44 CRIT**.
Trên Yuki cấp 1: `ATK 145 → 220 · HP 950 → 1.330 · SPD 112 → 134 · CRIT 20 → 64`.
Con số CRIT là chỗ cần để mắt nhất — 64% với `critMult 1.5` là thêm ~32% sát thương nữa.

> **Cảnh báo cân bằng:** `scratch/sim.js` **chưa mô phỏng cyberware** — `--lv` chỉ nhân cấp nâng cấp.
> Nghĩa là bảng tỉ lệ thắng ở `docs/dep-loan.md` §F1 giờ là **sàn**: người có cyberware sẽ thấy dễ hơn thế.
> Nhãn ÁP ĐẢO/NGANG SỨC vẫn đúng hướng vì `power()` đã tính cyberware qua `unitStats`, nhưng nếu sau này thấy
> vòng 3 của DẸP LOẠN quá dễ thì thủ phạm là ở đây, không phải ở `mult`.

---

## D. Cơ chế

### D1. Nối vào chỉ số

`unitStats(id)` trong `js/state.js` là **chỗ duy nhất** tính chỉ số cuối (README đã ghi vậy từ đợt 1).
Cyberware nối vào đúng đó:

```
atk  = gốc × (1 + 0.04×(cấp−1)) × (1 + ΣatkPct/100)
hp   = gốc × (1 + 0.04×(cấp−1)) × (1 + ΣhpPct/100)
spd  = gốc + Σspd
crit = gốc + Σcrit
```

Nhân với cấp nâng cấp **trước**, rồi mới nhân cyberware — hai nguồn nhân nhau chứ không cộng dồn phần trăm.
Vì thế `cardEl`, `power()`, `initBattle` và màn hồ sơ tự khớp, không phải sửa chỗ nào khác.

### D2. Phân tách

Bản dư đọc từ `PLAYER.extra` (`copiesOf(id) − 1`). Phân tách **không đụng bản đầu**: `owned` giữ nguyên, nên
không bao giờ mất nhân vật vì lỡ tay. Bậc lấy từ `ROSTER[id].tier`.

### D3. Ronin — THÉP TRẦN

Def nào có `noChrome:true` thì không lắp được ô nào. Đổi lại `cyberBonus()` trả về một bộ cố định bằng **tổng
của một bộ hạng A bậc 1** (+12% ATK · +14% HP · +10 SPD · +12 CRIT) ★ FAKE. Màn hình hiện đúng dòng lore thay
cho 5 ô.

---

## E. Giao diện

```
┌─ Cyberware ──────── LK 340 · CR 60.000 ───── ◂ BASE ┐
├─ dải chọn nhân vật (cuộn ngang) ────────────────────┤
│  (o) (o) (o) (o) (o) (o) …   chân dung, ai đã có    │
├─────────────────────────────────────────────────────┤
│  [chân dung]  YUKI · TIER S · LV 1 · 2/5 Ô          │
│               ATK 145 → 168   HP 950 → 1.045        │
│               SPD 112 → 115   CRIT 20 → 28          │
│               (số sau mũi tên = đã tính cyberware)  │
├─ 5 Ô CẤY GHÉP ─────────────────────────────────────┤
│  ◆NÃO   CHIP THẦN KINH THÔ  B+2   +5 CRIT       ▸  │
│  ◆MẮT   — trống —                               ▸  │
│  ◆TAY   TAY MÁY XƯỞNG RÃ    A     +9% ATK       ▸  │
│  ◆NGỰC  — trống —                               ▸  │
│  ◆CHÂN  — trống —                               ▸  │
├─────────────────────────────────────────────────────┤
│  [ PHÂN TÁCH BẢN DƯ → 12 LÁ · +310 LK ]            │
└─────────────────────────────────────────────────────┘
```

Chạm một ô → tờ trượt lên liệt kê **3 món của ô đó**: hạng, chỉ số (số thật ở bậc đang có), giá, và nút
**LẮP / NÂNG BẬC / THÁO**. Món đang lắp nằm trên cùng và có viền sáng.

Luật giao diện giữ như bên DẸP LOẠN: **mọi con số đều có mốc so sánh** (`145 → 168` chứ không phải `168`),
và **công thức hiện nguyên** ở dòng dưới mỗi món (`gốc +9% ATK × bậc 1.5`).

Màn **PHÂN TÁCH** là một tờ riêng: danh sách lá trùng kèm số bản và LK nhận được, nút phân tách từng dòng +
nút **PHÂN TÁCH TẤT CẢ**.

---

## F. Art

| Thứ | Code được? | Hiện đang là gì |
|---|---|---|
| Icon 5 ô (NÃO/MẮT/TAY/NGỰC/CHÂN) | **Được** | SVG inline, đổi màu theo hạng |
| Icon 15 món | **Được** | Dùng lại icon của ô + viền/chấm theo hạng |
| Chân dung nhân vật | Đã có | `art/card/<id>_portrait.jpg` |

Không có thứ gì bắt buộc phải sinh ảnh. Nếu muốn đẹp hơn thì 15 icon món, quy cách **256×256 PNG nền trong
suốt**, tên `art/cyber/<id>.png` — thả vào là tự thay.

Prompt chung (chỉ đổi phần in đậm):

```
Single cyberpunk implant part icon, centred on transparent background, 256x256, no text, no background
scene. <MÔ TẢ>. Scuffed metal, exposed wiring, oil stains. Rust-orange and acid-yellow for scavenged
parts, cold violet and pale steel for corporate parts. Cel-shaded technical illustration, thick dark
outline, readable as a 40px silhouette. --ar 1:1 --style raw
```

| id | `<MÔ TẢ>` |
|---|---|
| `neu1` | A crude neural chip, hand-soldered, one bent pin |
| `neu2` | A refurbished sync module, three ribbon cables, corporate serial half sanded off |
| `neu3` | A reforged halo ring core, violet glow inside a cracked ceramic shell |
| `opt1` | A scavenged lens screwed into a salvaged eye socket ring |
| `opt2` | A military targeting eye, iris shutter half open, range dial on the rim |
| `opt3` | A spire-grade optic, mirror-smooth, thin violet crosshair etched in the glass |
| `arm1` | A welded-shut elbow joint, weld beads visible, mismatched plating |
| `arm2` | A chop-shop arm actuator, hydraulic piston, grip pads worn through |
| `arm3` | A Canticle steel forearm, white ceramic over black steel, clean seams |
| `cor1` | A chest plate made of riveted corrugated tin |
| `cor2` | A reinforced ribcage brace, shock absorbers between the ribs |
| `cor3` | A chrome reactor core, violet light through a slit vent |
| `leg1` | A spring-loaded boot sole, coil visible through the heel |
| `leg2` | A runner's lower leg built for pipes, gecko treads, mud in the joints |
| `leg3` | A jump-rated leg, twin pistons, scorch marks on the foot pad |

---

## G. Việc

| # | Việc | File | Xong |
|---|---|---|---|
| C1 | 15 món, giá, LK, phân tách, lắp/nâng/tháo, THÉP TRẦN | `js/cyber.js` (mới) | ✓ |
| C2 | Màn `cyber` + tờ chọn món + tờ phân tách | `js/cyberui.js` (mới) | ✓ |
| C3 | Giao diện | `css/cyber.css` (mới) | ✓ |
| C4 | Markup màn + nút menu + nạp file | `index.html` | ✓ |
| C5 | Nối cyberware vào `unitStats` | `js/state.js` | ✓ |
| C6 | `noChrome:true` cho Ronin · ví `parts` trong hồ sơ | `js/data.js` | ✓ |
| C7 | Router + nút tắt trong hồ sơ nhân vật | `js/app.js` | ✓ |
| C8 | Ghi vào README + nhật ký | `README.md`, `docs/plan-2026-09.md` | ✓ |

**Không làm ở đợt này:** kho đồ rời, cyberware có nội tại riêng (không chỉ chỉ số), bộ đồ cùng hạng cộng thêm,
cyberware rơi ra từ trận, mô phỏng cyberware trong `sim.js`.

---

## H. Nhật ký

### 11/09 — dựng xong

Viết plan rồi cài thẳng, cùng phiên với DẸP LOẠN đợt 2 (`docs/dep-loan.md`).

**Chỗ nối duy nhất là `unitStats(id)`** và nó đã được chuẩn bị sẵn từ đợt 1 ("thêm nguồn cộng chỉ số mới thì
nối vào đây, không đi sửa ba chỗ rời nhau"). Kiểm trong trận thật: Yuki lắp 3 ô → thẻ nhân vật, hồ sơ ARCHIVE,
`power()` và chỉ số lúc vào trận **cùng ra 198/1102/116/28**, không chỗ nào lệch. Thêm `baseStats(id)` cạnh nó
để màn này in được vế trái của "168 → 198".

**Bẫy đã tránh:** nhân cấp nâng cấp **trước** rồi mới nhân cyberware. Cộng dồn phần trăm (`1 + 0.76 + 0.52`)
sẽ cho số khác hẳn nhân nhau (`1.76 × 1.52`), và vì `power()` dùng chung hàm nên sai ở đây là sai lan sang cả
ngưỡng giữ bãi của DẸP LOẠN.

**Một chỗ cố ý làm ngược lệ thường:** `cyberFit` gọi `cyberRemove` cho món cũ **trước** khi trừ tiền món mới,
nên thay món luôn hoàn 50% LK của món bị thay — không có đường nào mất trắng vì bấm nhầm.

**RONIN thành ca kiểm tra tốt cho chính cái lệ "truyện là canon":** hồ sơ của anh viết rõ "không một khớp nối
kim loại". Khoá suông thì anh thành nhân vật rác, nên `CYBER.bare` bù đúng một bộ hạng A bậc 1
(+12% ATK · +14% HP · +10 SPD · +12 CRIT) và màn hình in hẳn đoạn giải thích thay cho 5 ô trống.

**Số ra khi chạy thật:** Yuki cấp 5 lắp `neu3 + arm2+1 + leg1` → ATK 168 → 198, SPD 112 → 116, CRIT 20 → 28%.
Bộ hạng S kịch bậc cả 5 ô → +52% ATK · +40% HP · +22 SPD · +44 CRIT (bản plan ghi nhầm 46% HP, đã sửa).

**Phân tách chạy đúng chỗ đáng lo nhất:** `PLAYER.owned` không đổi một lần nào trong lúc phân tách 11 lá
(`owned` vẫn 11 người, `extra` về rỗng, +140 LK) — không có đường nào mất nhân vật vì bấm nhầm.

**Hồi quy:** `ult_lint` 60/60, `comic_lint` + `art_audit` xanh, chiến dịch 100/100/100/74/30/18 %,
DẸP LOẠN 9 bãi không đổi một điểm. Console 0 lỗi JS.

**Còn nợ:** 15 icon `art/cyber/<id>.png` (tuỳ chọn, §F) · `sim.js` chưa mô phỏng cyberware (§C4).
