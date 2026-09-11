# CHROMEFALL — Map chọn khu vực (prompt ảnh + tên khu vực)

> Thay màn `sector` dạng danh sách bằng **bản đồ thành phố HALCYON**: chạm vào một khu vực →
> vào danh sách màn của khu vực đó → chạm màn → ENTER SECTOR.
> Ảnh do người dùng sinh, đặt vào `art/map/`. Thiếu ảnh thì màn map vẫn chạy bằng nền CSS.

---

## 1. Luồng màn hình

```
HOME ──▶ SQUAD ──▶ MAP (bản đồ HALCYON) ──▶ SECTOR LIST (lọc theo khu vực) ──▶ BATTLE
  └────────────────── TIẾP TỤC 07-x ───────────────────────────────────────────┘
```

- Map chỉ có **một tầng**. Không làm map lồng map, nếu không người chơi phải chạm 3 lần mới đánh được.
- Nút **TIẾP TỤC** ở HOME nhảy thẳng vào sector đang mở, bỏ qua map — dành cho người chơi lại.
- Map nhớ khu vực chọn lần trước.
- Giai đoạn 2 (sau khi chương 1 xong): map District 07 (mục 6) **thay cho** danh sách màn, không thêm tầng mới.

---

## 2. Tên khu vực trên map

Thành phố tên **HALCYON**, xây thẳng đứng. Bản đồ là **lát cắt dọc**: nhìn từ bên hông, trên là Tháp, dưới là Khu Đáy.
Chữ trên map do HTML vẽ, **không vẽ chữ vào ảnh**.

| # | Nhãn hiển thị | Nhãn phụ (mono) | Chương | Trạng thái đầu game | Bấm vào thì |
|---|---|---|---|---|---|
| 1 | **CANTICLE** | DISTRICT 01 · CHOIR | 3 | Khoá · SẮP RA | Hiện "đang phát triển" |
| 2 | **THÁP** | DISTRICT 04 · SPIRE | 2 | Khoá · SẮP RA | Hiện "đang phát triển" |
| 3 | **VẾT SẸO TẦNG BỐN** | LEVEL FOUR · 4.000 KIA | — | Mốc truyện, không bấm | — |
| 4 | **KHU ĐÁY** | DISTRICT 07 · CHROMEFALL | 1 | Khoá tới khi xong 00-T | Danh sách 07-A…07-E |
| 5 | **BÃI RƠI** | 00-T · TUTORIAL | 0 | Mở | Danh sách chỉ có 00-T |
| 6 | **TRẠI CỦA RONIN** | BASE | — | Mốc, luôn hiện | Về HOME |

Trạng thái nút: `open` (xanh, nhấp nháy) · `cleared` (xanh lá) · `locked` (mờ, bấm vào báo cần xong màn nào trước) ·
`soon` (mờ hơn, bấm vào báo "đang phát triển") · `mark` (không bấm được) · `base`.

Ghi chú lore: Tầng Bốn là chỗ Canticle cắt trụ đỡ 6 năm trước, 4.000 người chết — vết thương chung của
Yuki, Ash, Kai. Để nó nằm giữa Tháp và Đáy như một khoảng đen là nhắc người chơi mỗi lần mở map.

---

## 3. Quy cách ảnh map

- **Khổ dọc 9:16, 1152×2048** (khung game portrait, rộng tối đa 560px, cao 600–980px).
- Ảnh hiển thị `width:100%; height:auto` rồi **cuộn dọc** — không dùng `cover`. Lý do: toạ độ điểm chạm
  tính theo **% của ảnh**, `cover` cắt hai mép sẽ làm điểm chạm lệch trên máy khác nhau.
- Muốn map dài cuộn nhiều hơn (cảm giác leo từ Đáy lên Tháp) thì xuất **1152×2560**; giữ nguyên bố cục 5 lớp,
  chỉ giãn khoảng cách giữa các lớp.
- **Không chữ, không số, không logo, không icon, không pin/marker.** Game tự vẽ nút, nhãn, đường nối.
- Chừa **dải tối phẳng ở mép trái và mép phải mỗi lớp** để đặt thẻ nhãn (rộng ~30% khung, ít chi tiết).
- Tối trầm, giống nền trận: sáng ở xa, đáy khung tối. Tím `#7C4DFF` ở trên, cam rỉ `#E2703A` ở dưới.
- Khu vực khoá **không cần vẽ tối hơn** — game phủ lớp sương + dim lên trên.
- File: `art/map/map_halcyon.jpg` (chất lượng cao, ~500KB).

---

## 4. Prompt chung (dán trước mỗi prompt riêng)

```
Cyberpunk city map illustration, vertical cutaway cross-section of one single megastructure city
seen from the side, oblique high angle. No characters, no text, no letters, no numbers, no logos,
no map pins, no icons, no UI frame. Portrait 9:16 composition.
Deep near-black background, high contrast, restrained light. Cold violet #7C4DFF light at the top
of the frame grading into sodium rust-orange #E2703A at the bottom. Volumetric haze separating each
layer so depth reads instantly. Flat dark low-detail margins on the left and right of every layer.
3D CG anime key visual quality with matte-painting density, sharp geometry, muted palette,
no lens flare, no bloom overload.
```

## Negative prompt

```
people, character, silhouette, text, letters, numbers, watermark, logo, UI, HUD, map pin, marker,
icon, compass, legend, minimap frame, grid overlay, bright rainbow neon, saturated colors,
pixel art, cartoon, blurry, fisheye, tilt-shift, low contrast, washed out, centered focal object
```

---

## 5. `art/map/map_halcyon.jpg` — bản đồ chính

```
Vertical cross-section of the megacity HALCYON, read top to bottom as five stacked layers with
clear dark gaps between them:

(1) TOP — the summit of a colossal tower: clean white and pale violet architecture, a single
enormous glowing ring suspended above the spire, thin cold light slits, absolute symmetry.
(2) UPPER MIDDLE — the tower body: smooth glass and brushed titanium terraces stepping outward,
sky bridges, faint streaks of corporate air traffic, cold white windows in strict rows.
(3) MIDDLE — a collapsed level torn out of the tower like a bite: broken floor slabs, severed
support columns, hanging cables and dead cabling, no lights at all, the only unlit band in the frame.
(4) LOWER MIDDLE — the slum sprawl clinging to the tower base: dense welded shacks stacked on
scaffolding, rope and pipe bridges, corrugated roofs, sodium-orange lamps, smoke rising, a few
small fires, cranes made of scrap.
(5) BOTTOM — a flooded scrap plain: black shallow water, canals and drainage mouths, mountains of
crushed cars and machine parts, sparse orange embers, thick low fog swallowing the horizon.

The tower is slightly off-center so the left third stays dark and empty. Cold violet dominates
layers 1-2, dead grey layer 3, rust orange layers 4-5.
```

---

## 6. `art/map/map_07.jpg` — map District 07 (giai đoạn 2, chưa cần ngay)

Dùng khi thay danh sách màn bằng map con. Mốc trong ảnh phải khớp 5 sector chương 1:

| Sector | Tên | Mốc cần thấy trong ảnh |
|---|---|---|
| 07-A | CỔNG BÃI XE | Cổng lưới sắt, tường xe ép, đèn cao áp cam |
| 07-B | LÒ ĐÚC | Ống khói lò, dòng xỉ nóng cam sáng nhất khung |
| 07-C | HÀNG RÀO TẬP ĐOÀN | Bức tường trắng thẳng tắp, đèn tím, cắt ngang khu ổ chuột |
| 07-D | NHÀ THỜ DƯỚI CỐNG | Miệng cống lớn, cắt lộ hầm vòm bên dưới, đèn đỏ li ti |
| 07-E | THANG MÁY HÀNG | Trục thang máy khổng lồ chạy lên khỏi khung, cáp và bánh xe cáp |

```
Oblique bird's-eye map of a slum district built at the foot of a colossal tower, cutaway so one
underground vault is visible. Left edge: a scrapyard gate of chain-link and crushed cars under a
single orange floodlight. Center left: a dead foundry with tall chimneys and one river of molten
slag glowing orange, the brightest point in the frame. Right edge: a perfectly straight white
corporate wall with violet light strips slicing across the slum. Center bottom: a wide drainage
mouth cut open to reveal a brick vault below with tiny red votive lights. Top right: the base of a
gigantic cargo lift shaft with cable drums, rising out of the frame toward the tower.
Between them: welded shacks, catwalks, puddles, smoke, scrap cranes, no vehicles moving.
Dark rust-orange palette with cold violet only along the corporate wall.
```

---

## 7. Toạ độ điểm chạm (khớp bố cục ảnh ở mục 5)

Tính theo **% của ảnh**, gốc góc trên-trái. Nút xen kẽ trái/phải để thẻ nhãn không đè nhau.

| Khu vực | x | y | Ghi chú |
|---|---|---|---|
| CANTICLE (D01) | 58% | 7% | Nhãn đặt bên trái nút |
| THÁP (D04) | 62% | 24% | Nhãn bên trái |
| VẾT SẸO TẦNG BỐN | 50% | 43% | Chỉ là dấu gạch + chữ, không phải nút |
| KHU ĐÁY (D07) | 40% | 62% | Nhãn bên phải, có vòng nhấp nháy khi đang mở |
| TRẠI CỦA RONIN | 68% | 71% | Nút nhỏ, về HOME |
| BÃI RƠI (00-T) | 34% | 84% | Nhãn bên phải |

Đường nối giữa các nút vẽ bằng SVG `polyline` trong HTML (nét đứt 1px), không vẽ vào ảnh —
để còn tô sáng đoạn đã đi qua theo tiến trình.

---

## 8. Đã cài trong code (2026-09-07)

- `js/data.js`: `MAP_IMG`, `MAP_AREAS` (đúng bảng mục 2 và toạ độ mục 7), `MAP_AREA` (khu vực đang xem),
  `areaSectors(a)`, `mapAreaState(a)`. Trạng thái suy từ `CHAPTERS` + `PLAYER.cleared`, không lưu thêm gì vào hồ sơ.
- `index.html`: màn `data-screen="map"` gồm `.map__view > .map__img > (.map__lines, .map__fog, .map__nodes)`.
  Nút HOME "SECTOR/PVE" đổi thành "MAP/HALCYON"; nút Confirm squad đi sang map; dòng "Next mission" ở HOME
  thành nút **TIẾP TỤC** vào thẳng màn đang mở.
- `js/app.js`: `renderMap()` vẽ nút, đường đi (SVG polyline, đoạn đã qua tô xanh lá), sương, và cuộn khung
  tới khu vực đang chơi. `renderSectors()` lọc theo `MAP_AREA`. Nút ◂ MAP quay lại bản đồ.
- Ảnh nền đặt bằng biến CSS `--mapimg` (dùng `absUrl`), thêm class `has-img`. **Chưa có ảnh vẫn chơi được**:
  `.map__img` dùng gradient tím→cam + lưới CSS, nhãn góc dưới ghi tên file còn thiếu.
- Thả `art/map/map_halcyon.jpg` vào là xong, không phải sửa code. Nếu ảnh vẽ khác bố cục 5 lớp thì
  chỉnh lại `x/y` trong `MAP_AREAS` cho khớp mốc trong ảnh.

## 9. Ảnh đã lắp (07/09)

`art/map/map_halcyon.jpg` — **941×1672** (tỉ lệ 9:16 đúng, nhưng nhỏ hơn quy cách 1152×2048 nên hơi mềm nét trên
màn retina). Bản gốc PNG ở `art-src/MAP/halcyon.png`. Bố cục 5 lớp khớp bảng toạ độ mục 7, **không phải chỉnh
`MAP_AREAS`**: vòng Halo + tháp nhọn ở 7%, khối tháp tím ở 24%, tầng đổ nát xám ở 43%, khu ổ chuột cam ở 62–71%,
bãi phế liệu ngập nước ở 84%.

Hai điểm còn gợn, chưa sửa vì thuộc bố cục màn chứ không phải ảnh:

- `.map__img` khai `aspect-ratio:9/16` nên khung map cao 666 px trên máy rộng 375, trong khi `.map__view` cao
  ~740 px → **thừa một dải trống ~74 px dưới đáy map**. Muốn hết thì hoặc xuất ảnh 1152×2560 (mục 3 đã gợi ý,
  cuộn dài hơn, hợp cảm giác leo từ Đáy lên Tháp), hoặc cho `.map__view` co theo nội dung.
- Nhãn **KHU ĐÁY** và **TRẠI CỦA RONIN** rơi vào mảng ổ chuột cam rất nhiều chi tiết nên hơi khó đọc. Ảnh sau
  chừa dải tối phẳng ở hai mép của lớp đó (mục 3 đã ghi) là xong.
