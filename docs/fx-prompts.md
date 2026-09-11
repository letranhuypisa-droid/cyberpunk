# CHROMEFALL — Overlay hiệu ứng đòn đánh, trạng thái, và hộp video chiêu cuối (v0.3 · 11/09/2026)

Ba thứ trong trận được thêm ngày 11/09, tài liệu này nói cách nó chạy và cách bạn thay ảnh thật vào:

1. **Overlay hiệu ứng** trên sprite khi trúng đòn (hit, chí mạng, nổ, điện giật, độc, cháy, choáng, hồi máu).
2. **Trạng thái** kéo dài nhiều lượt (độc, cháy, choáng) và chip trên bảng unit.
3. **Hộp holo** chiếu video chiêu cuối trên đầu người phát chiêu, thay cho cut-in phủ kín sân.

Cùng đợt: chỉ số **SPD** (ai ra đòn trước) và **CRIT** (% chí mạng) — xem mục 5.

Code: `js/fx.js` (engine overlay), `css/fx.css` (vẽ placeholder + hộp holo), `js/battle.js` (trạng thái, holo),
`js/data.js` (ai gây gì). Xem thử mọi overlay ở `kit.html` mục **B9**.

---

## 1. Overlay chạy thế nào

Mỗi unit có một lớp `.unit__fx` nằm trong `.unit__pose`, nên hiệu ứng đi theo sprite khi nó trượt tới mục tiêu và
khi nhấp nhô. Hai loại:

| Loại | Khi nào | Kind |
|---|---|---|
| **Một lần** (`playFx`) | lúc trúng đòn, lúc dính trạng thái, lúc trạng thái trừ máu, lúc được hồi máu, lúc dựng/chặn bằng lá chắn, **lúc lá chắn vỡ** | `hit` `crit` `zero` `explode` `shock` `poison` `burn` `stun` `heal` `shield` |
| **Lặp** (`setFxLoops`) | suốt thời gian còn dính trạng thái hoặc còn lá chắn, tự tắt khi hết | `poison` `burn` `stun` `shield` |

Luật chọn overlay khi trúng đòn (`dealDamage` trong `js/battle.js`):

- Đòn không khai `fx` → `hit`; nếu chí mạng → `crit`.
- Đòn có `fx` riêng (nổ, điện, độc, lửa) → phát `fx` đó; nếu còn chí mạng thì phát thêm `crit` sau 70 ms.
- Đòn đến từ bên phải (địch đánh đội mình) → overlay lật ngang (`.fx--flip`) để nhát chém đúng hướng.
- Giảm chuyển động (CONFIG hoặc hệ điều hành) → không sinh overlay một lần; bản lặp đứng yên.

Vị trí và cỡ từng kind nằm ở `FX_META` trong `js/fx.js` (`fy` = tâm theo % chiều cao hộp sprite, 0 = đỉnh đầu,
100 = sàn; `fw` = bề rộng theo % bề rộng hộp). Lửa neo ở chân (`fy` 66–74), choáng trên đầu (`fy` 6–10),
còn lại giữa thân (`fy` ≈ 50).

**Mặc định không cần ảnh**: `css/fx.css` vẽ tất cả bằng gradient/SVG. Cái này để chơi được ngay; ảnh của bạn thay dần.

---

## 2. Thay ảnh thật: thả file, không sửa code

| Kind | Một lần | Lặp (trạng thái) |
|---|---|---|
| hit | `art/fx/hit.webp` | — |
| crit | `art/fx/crit.webp` ← **animation chí mạng bạn sẽ làm** | — |
| zero | `art/fx/zero.webp` — riêng chiêu ZERO của Yuki | — |
| explode | `art/fx/explode.webp` | — |
| shock | `art/fx/shock.webp` | — |
| poison | `art/fx/poison.webp` | `art/fx/poison_loop.webp` |
| burn | `art/fx/burn.webp` | `art/fx/burn_loop.webp` |
| stun | `art/fx/stun.webp` | `art/fx/stun_loop.webp` |
| heal | `art/fx/heal.webp` | — |
| shield | `art/fx/shield.webp` | `art/fx/shield_loop.webp` |

Có file là game dùng; thiếu file là về placeholder CSS. Mỗi kind độc lập, làm cái nào trước cũng được.

`shield` là **lá chắn** (chiêu FIRE STORM của Kiln): loé một lần lúc dựng và mỗi lần chặn được đòn, bản lặp chạy suốt
thời gian còn khiên. **Lúc vỡ thì phát `explode`** (thêm 11/09) — trước đó vòm lửa chỉ tắt lặng lẽ, mất đúng khoảnh
khắc người chơi chờ nhất; nên nếu bạn làm `explode.webp` thì nhớ nó vừa là đòn nổ vừa là lúc khiên vỡ. Placeholder hiện tại là vòm lửa cam quanh người. Muốn art thật thì làm hai file như trên —
prompt gợi ý: một lần `glowing orange hexagonal energy dome snapping into place around a figure, embers, 2D game VFX, 0.7s`;
lặp `orange fire barrier dome slowly breathing and flickering, seamless loop, 2D game VFX, 1.5s`.

### Định dạng file: sprite sheet WebP

- Ô **vuông**, **6 cột**, số hàng tuỳ số frame (`js/fx.js` suy số hàng từ chiều cao ảnh, nên không cần khai gì).
- Cỡ ô **256 px** (sheet 1536 px ngang). Overlay trên sân chỉ rộng ~110–150 px nên 256 là dư nét.
- Nền **trong suốt** (alpha). Ô cuối thừa thì để trống, không sao.
- Tốc độ chạy: **24 fps** bản một lần, **16 fps** bản lặp (`FX_SHEET` trong `js/fx.js`). Đổi chung ở đó nếu cần.
- Dung lượng mục tiêu **≤ 300 KB** một sheet (WebP q85 có alpha).

Số frame gợi ý: một lần **12–24 frame** (0.5–1 s); lặp **16–24 frame** (1–1.5 s), **frame cuối phải nối được với
frame đầu** (không thì nháy ở chỗ nối).

Sao không dùng WebP động / GIF? Vì ảnh động trong `<img>` không phát lại được từ frame 0 khi trúng đòn lần nữa, và
nhiều unit dùng chung một file sẽ chạy lệch nhau. Sheet + JS đổi `background-position` thì luôn đúng frame.

### Từ video nền xanh ra sheet: một lệnh

```bash
python scratch/fx_sheet.py "art-src/FX/crit.mp4" art/fx/crit.webp --fps 24 --max 24
```

Tham số: `--fps` (mặc định 24), `--size` cỡ ô (256), `--cols` số cột (6, **đừng đổi** — `js/fx.js` cố định 6),
`--max` số frame tối đa (48; nhiều hơn thì lấy đều), `--trim` bỏ frame gần trống ở hai đầu (0.5 = alpha trung bình
dưới 0.5% của frame đậm nhất). Script in JSON `frames/rows/kb` để bạn kiểm.

Nguồn vào nhận `.mp4`, `.gif`, hoặc thư mục PNG đã trong suốt. Khử nền theo màu viền ảnh như `key_frame.py`:
nền phải **một màu phẳng** (xanh lá `#00FF00`; magenta `#FF00FF` nếu hiệu ứng có màu xanh lá như độc/axit).

### Quy cách video nguồn (để prompt)

| Mục | Giá trị | Vì sao |
|---|---|---|
| Khung | **1:1** (1024×1024 hoặc 720×720) | ô sheet vuông |
| Nền | một màu phẳng, không bóng, không sàn, không nhân vật | script khử theo màu |
| Hiệu ứng | ở **giữa**, chiếm 60–80% khung, không chạm mép | script cắt theo hộp chung rồi nới 6% |
| Thời lượng | một lần 0.5–1 s · lặp 1–1.5 s và khép vòng | số frame ở trên |
| Máy quay | **đứng yên**, không zoom, không rung | mỗi frame phải cùng toạ độ |
| Chữ / watermark | không | overlay đè lên sprite |
| Ánh sáng | hiệu ứng tự phát sáng, viền rõ | alpha khử theo khoảng cách màu, mép mờ sẽ bị ăn một phần |

Hiệu ứng **không có sprite nhân vật bên trong**: nó là lớp phủ, sprite đã có sẵn bên dưới.

---

## 3. Prompt gợi ý từng loại (Seedance / Pika / Runway đều dùng được)

Mỗi prompt: `<mô tả> , centered, flat #00FF00 chroma key background, static camera, no text, 1:1`. Giữ phong cách
cyberpunk hai màu: Chrome (tím-trắng, sạch) và Rust (cam-axit, bẩn).

| Kind | Prompt (EN) | Ghi chú |
|---|---|---|
| hit | `single fast diagonal white slash streak with small sparks, 2D game VFX, 0.5s` | nhỏ, nhanh, không che mặt |
| **crit** | `two crossing golden slash streaks forming an X, bright white core flash, gold sparks scatter, 2D game VFX, 0.7s` | màu `#FFB224` (token `--crit`) để khớp số CRIT |
| **zero** | `one single vertical violet-white katana slash streak, razor thin bright core, cold violet glow bleeding outward, thin expanding violet ring, black background, 2D game VFX, 0.6s` | chỉ chiêu ZERO của Yuki. **Một nhát, dọc** — đúng câu mô tả chiêu "Ba bước, một nhát"; tím `#7C4DFF`/`#B7A4FF` (`--chrome`) để không đội hình với crit vàng hay explode cam |
| explode | `orange fireball burst with expanding shockwave ring and dark smoke puff, 2D game VFX, 0.8s` | mìn của Ash (FLASHOVER) |
| shock | `jagged electric arcs, cyan-white lightning crackling around a point, flicker, 2D game VFX, 0.5s` | súng điện Kai, drone, Choir |
| poison | `green acid splash with dripping droplets and small toxic bubbles, 2D game VFX, 0.6s` | dùng nền **magenta** |
| poison_loop | `small green toxic bubbles rising slowly and popping, seamless loop, 2D game VFX, 1.2s` | khép vòng, nền magenta |
| burn | `flames bursting upward from the ground with embers, orange-yellow, 2D game VFX, 0.7s` | neo ở chân |
| burn_loop | `campfire-like flames flickering at the bottom of frame, embers floating up, seamless loop, 2D game VFX, 1.2s` | |
| stun | `yellow ring flash with three small stars popping, 2D game VFX, 0.5s` | |
| stun_loop | `three small yellow stars orbiting in a circle above, seamless loop, 2D game VFX, 1.1s` | trên đầu |
| heal | `soft green light particles floating upward with a gentle glow, 2D game VFX, 0.8s` | |

Kiểm ảnh: mở `kit.html` → mục **B9**, bấm từng nút; dòng dưới báo file nào đã được nạp.

---

## 4. Trạng thái: luật chơi

Khai ở `js/data.js` (skill/ult của nhân vật, `FOE_SKILL` của địch): `status:{kind, turns, pct, chance}`.

| Trạng thái | Chip | Hiệu ứng | `pct` | Hết khi |
|---|---|---|---|---|
| **Choáng** `stun` | CHOÁNG nT | mất lượt kế tiếp (đầu lượt: overlay + log "mất lượt") | — | hết `turns` lượt bị bỏ |
| **Độc** `poison` | ĐỘC nT | đầu mỗi lượt của người dính: mất `pct × ATK người gây` (tính lúc dính) | 0.2–0.3 | sau `turns` lần trừ |
| **Cháy** `burn` | CHÁY nT | như độc, màu lửa, neo ở chân | 0.2–0.3 | như độc |

- `turns` đếm theo **lượt của người dính**. Dính lại cùng loại: lấy số lượt và sát thương lớn hơn (không cộng dồn).
- `chance` = xác suất dính mỗi đòn (mặc định 1). Địch phần lớn 0.2–0.7.
- **Boss không bị choáng** (`rank:'boss'`), để không khoá boss bằng RIPCORD của Kai.
- Sang wave mới đội mình được xoá sạch trạng thái (địch mới thay hết nên không cần).
- Độc/cháy có thể giết; chết thì lượt đó bỏ, xử lý thắng/thua như thường.

Ai gây gì (★ FAKE, đổi ở `js/data.js`):

| Nguồn | fx | Trạng thái |
|---|---|---|
| Ash — đòn thường (lưỡi axit) | poison | độc 2 lượt, 20% ATK |
| Ash — FLASHOVER (toàn địch) | explode | cháy 2 lượt, 20% ATK |
| Kai — RIPCORD | shock | choáng 1 lượt (boss miễn) |
| Psalm — APOSTASY | shock | (điều khiển như cũ) |
| Echo PLAYBACK · Wire OVERCLOCK · Spark ARC FLASH | shock | — |
| Junker FULL LOAD | explode | — |
| Thợ hàn · Slagger · Kiln · Forgemaster | burn | cháy 2 lượt, 25–30%, xác suất 40–70% |
| Mother Rust | poison | độc 2 lượt, 30%, 60% |
| Chrome Hound · Bulwark · Foreman · Archon · Cantor · Warden · Enforcer Prime · Cantor Ascendant · Canticle | shock/hit | choáng 1 lượt, 20–35% |
| Drone · Enforcer · Seraph · Echo (boss) · Exorcist | shock | — |
| 00-T (scav, chuột cống, chó hoang) | hit | không — tutorial để trơn |

Cân bằng sau khi thêm (`node scratch/sim.js 500`, đội yuki+ash+kai, boss miễn choáng): xem nhật ký
`docs/plan-2026-09.md` §J ngày 11/09. Thử số khác không cần sửa file: `SIM_PATCH="ROSTER.ash.skill.status.pct=.15" node scratch/sim.js 300`.

---

## 5. SPD và CRIT

- **SPD** quyết định thứ tự lượt mỗi round: cao đi trước; bằng nhau thì đội mình trước, rồi theo slot. Thanh lượt xem
  trước round sau bằng cùng luật nên luôn đoán được ai đi trước. Rê chuột vào ô thanh lượt thấy `SPD`.
  Mốc: Yuki 112, Ash 105, Kai 96, Psalm 88; chó hoang 110, drone 108, Chrome Hound 116, Glass Jaw 118 (nhanh hơn
  Yuki để dạy luật); Tin Man 66, Bulwark 60; boss 80–100 (đội mình đi trước boss). Bảng đầy đủ: `ROSTER`, `HERO_EXTRA`,
  `FOE_STATS` trong `js/data.js`.
- **CRIT** = % chí mạng cơ bản của từng unit (Yuki 20, Ash 12, Kai 10 + 15 từ đòn thường, Psalm 5; grunt 3–8, elite
  8–15, boss 10–20, Glass Jaw 25). Sát thương chí mạng ×1.5 (`RULES.critMult`). Passive `critPct` cộng thêm như cũ.
  Không còn `RULES.critChance` chung 15%.
- Hiện ở thẻ nhân vật (SQUAD, gacha, kit) và pill trong ARCHIVE. Nâng cấp (CR) chỉ tăng ATK/HP, không tăng SPD/CRIT.

---

## 6. Hộp holo video chiêu cuối

Quy cách video vẫn ở `docs/ult-prompts.md` §1 (đã cập nhật). Tóm tắt: **16:9**, 1280×720, 5 s, không chữ; giờ hộp
đúng tỉ lệ nên **không cắt mép** nữa, nhưng hộp chỉ rộng ~270 px trên điện thoại → cận cảnh, chủ thể to.
Đổi tỉ lệ hộp: `RULES.holo.ratio` trong `js/data.js` là mặc định (CSS đọc theo), còn từng nhân vật/kẻ địch có thể khai
riêng `ultRatio` — hai video chiêu cuối của địch (Glass Jaw, Kiln) quay **dọc 3:4** nên dùng `ultRatio:3/4`. Hộp luôn bị
kẹp cao tối đa `RULES.holo.hPct` (50%) chiều cao sân để video dọc không phủ kín sân.

---

## 7. Di chuyển kiểu Idle Heroes (không còn frame dash)

Sprite giữ nguyên **idle**, trượt thẳng tới trước mặt mục tiêu (220 ms), đổi sang **attack** + đẩy nhẹ lúc chạm, giữ
150 ms, về idle rồi trượt thẳng về đúng chỗ cũ (240 ms). Số liệu: `RULES.move`. Nhân vật mới chỉ cần **idle + attack
(+ hurt)**; `art/sprite/*_dash.png` của Yuki/Psalm/Ash/Kai không còn được nạp (giữ hay xoá tuỳ bạn — 07-E i3 p2 trong
comic vẫn dùng `yuki_dash.png` làm hình nền panel).
