# CHROMEFALL — Prompt sinh ảnh nền chiến trường

Sân đấu là side-by-side: đội mình đứng nửa trái, địch nửa phải, nhân vật đứng
dọc theo mặt sàn từ 2% đến ~95% chiều cao sân. Vì vậy ảnh nền cần:

- **Khổ dọc 3:4** (khuyến nghị 1536×2048 hoặc 1200×1600). Sân đấu trên mobile
  ~375×570, desktop ~560×850; ảnh dùng `object-fit: cover`, tâm ảnh giữ nguyên.
- **Mặt sàn phẳng chiếm 2/3 dưới**, đường chân trời ở ~35–40% tính từ trên xuống.
  Sàn tối, ít chi tiết, có vân/lưới mờ để bóng nhân vật đọc được.
- **Không có nhân vật, không chữ, không logo.** Không vật thể nổi bật ở giữa khung.
- **Tối và trầm**: nhân vật sáng, UI mảnh 1px. Điểm sáng chỉ ở xa (đèn, lò, biển hiệu).
- Dải mép trái/phải và 15% đáy nên tối hơn để bảng HP/Energy đặt lên vẫn đọc được.
- Xuất PNG hoặc JPG chất lượng cao, đặt cùng thư mục HTML với đúng tên file bên dưới.

Tên file HTML sẽ tự tìm: `art/bg/bg_07a.png`, `art/bg/bg_07b.png`, `art/bg/bg_07c.png`, fallback `art/bg/bg_battle.png`.
Thiếu file thì sân dùng gradient + lưới CSS mặc định.

## Cách sân đấu đặt ảnh (để không bị "nhân vật lơ lửng" hoặc "quá nhỏ")

- Ảnh **neo mép dưới** sân và phóng theo chiều cao bằng `bgZoom` trong `SECTORS` (JS).
  `bgZoom: 1.3` nghĩa là ảnh cao bằng 130% sân, phần trên ảnh (trời/trần) bị cắt bớt,
  hai mép trái/phải bị cắt khoảng 15–25% tuỳ màn hình.
- Vì sao cần zoom: đội hình 2 hàng đặt chân nhân vật từ đáy sân lên tới ~43% từ trên xuống,
  nên đường chân trời trong ảnh phải nằm **cao hơn 43%**. Công thức vị trí chân trời trên sân:
  `y = horizon × zoom − (zoom − 1)` (tính theo phần chiều cao sân, từ trên xuống).
  Ví dụ 07-B chân trời ở 52% ảnh, zoom 1.32 → 0.52×1.32 − 0.32 = 0.37 → 37% sân. Đạt.
- Kích thước nhân vật = 23% chiều cao sân (`--uw` trong CSS). Muốn nhân vật to hơn thì tăng
  `--uw` và giảm `y` của hàng sau trong `FORMATION`; muốn ảnh ít bị phóng thì giảm `bgZoom`
  và kéo hàng sau xuống thấp hơn. Hai tham số này kéo nhau, chỉnh một thì kiểm tra cái kia.
- Khi vẽ ảnh: chân trời ở 45–55% là đẹp nhất; 25% đáy ảnh sẽ là chỗ hàng trước đứng nên
  giữ tối, ít chi tiết.

---

## Prompt chung (dán trước mỗi prompt riêng)

```
Cyberpunk turn-based RPG battle background, empty stage with no characters, no text, no logos.
Vertical 3:4 composition. A wide flat floor plane fills the lower two thirds of the frame,
horizon line at roughly 38% from the top, slight low camera angle so the floor reads as a stage.
Deep dark palette, high contrast, restrained light sources only in the distance.
Left and right edges darker than the center, bottom 15% falls into shadow.
3D CG anime key visual quality, dense detail, sharp geometry, subtle volumetric haze, no lens flare.
```

## Negative prompt (nếu tool hỗ trợ)

```
people, character, silhouette, figure, text, letters, watermark, logo, UI, HUD,
bright neon everywhere, rainbow colors, pixel art, cartoon, blurry, fisheye, tilt,
object in the center foreground, low contrast, washed out
```

---

## art/bg/bg_07a.png — Sector 07-A · SCRAPYARD GATE (Rust, dễ)

```
Rust district scrapyard gate at night: a cracked concrete lot bordered by walls of crushed cars
and welded scrap, chain-link fences patched with corrugated metal, oil puddles reflecting a
single sodium-orange floodlight in the far distance. Rusted orange #E2703A, toxic yellow-green
signal lamps, dirty grey concrete. Haze low on the ground. Floor: stained concrete with faint
painted grid lines and tire marks. Distant skyline of the Chrome corporate towers as tiny cold
white lights on the horizon.
```

## art/bg/bg_07b.png — Sector 07-B · FOUNDRY ROW (Rust, chuẩn)

```
Abandoned foundry interior repurposed by scavengers: a long steel-plate floor with welded seams
and drainage grates, massive cold furnaces and ladles along the far wall, hanging chains, a thin
river of molten slag glowing burnt-orange far in the background as the only strong light.
Rust and soot everywhere, patched with stolen chrome panels that reflect cold violet light.
Steam vents low on the sides. Floor: dark riveted steel with a faint grid pattern, oil sheen,
subtle reflections. Overhead gantry cranes lost in darkness.
```

## art/bg/bg_07c.png — Sector 07-C · CORP PERIMETER (Chrome, boss)

```
Corporate perimeter checkpoint of the Chrome elite: a pristine polished white-and-graphite
floor with a precise luminous grid, seamless walls of frosted glass and brushed titanium,
a tall closed security gate at the far end glowing pale violet #7C4DFF through thin light
slits, holographic barrier lines hovering low near the horizon. Cold white and slate-blue tones,
surgical cleanliness, absolute symmetry, faint rain on the glass. Floor reflects the gate glow.
No warmth, no rust, no clutter.
```

## art/bg/bg_battle.png — nền dự phòng (dùng cho mọi sector chưa có ảnh)

```
Neutral cyberpunk arena: a dark elevated platform of matte graphite plates with a faint
luminous grid, surrounded by darkness and distant city lights, a single thin horizon line
of cold light. Minimal, quiet, no landmarks. Slight violet and rust tint on opposite sides
of the frame: violet haze on the left, rust-orange haze on the right.
```

---

## art/title_keyart.png — ảnh cho màn Title

**Khung thật** (đo từ `.title__art` trong `css/chromefall.css`): ảnh neo **đáy màn hình, mép phải**, cao bằng
**76% chiều cao màn**, và bị đẩy lệch ra ngoài **26% bề rộng ảnh** — tức là **1/4 bên phải bị cắt khỏi màn hình**.
Game còn phủ `opacity .42` và mask mờ dần từ 55% chiều cao lên đỉnh. Nghĩa là khi vẽ:

- **Khổ dọc, nền trong suốt (PNG alpha).** Toàn thân, hai bàn chân chạm sát mép dưới ảnh, không có bóng đổ.
- **Mặt và thân đặt lệch về nửa trái ảnh.** Phần bên phải (vai xa, tay xa, chuôi kiếm) là phần sẽ bị cắt — đừng để
  chi tiết quan trọng ở đó.
- **Nửa trên nhạt dần là chuyện của game**, bạn cứ vẽ đủ; nhưng đừng đặt điểm nhấn ở đỉnh đầu vì nó sẽ mờ hết.
- Ảnh chỉ hiện ở **42% độ đục** trên nền tím than, nên **tương phản trong ảnh phải mạnh** — viền sáng lạnh, mảng
  trắng của áo, vòng Halo tím. Ảnh nhạt sẽ biến mất hẳn.
- Thiếu file thì game dùng tạm `art-src/YUKI/Yuki PNG.png`.

```
Yuki, white-haired android swordswoman in white kimono-armor with violet accents and a broken
halo ring, full body head to toe, standing three-quarter view facing left, katana lowered in
her right hand, calm downward gaze, feet flat at the very bottom edge of the frame, body
positioned slightly left of center, transparent background, no shadow, no ground plane,
tall vertical composition, 3D CG anime key visual, high detail, sharp edges, strong cold rim
light from the left, deep contrast between white armor and dark undersuit.
```

---

## art/bg/bg_base.jpg — TRẠI CỦA RONIN (nền màn COMMS ở HOME)

Đây **không phải nền trận** mà là nền cho màn truyện COMMS — hai đồng đội nói chuyện ở nhà
(`js/app.js` → `renderHome`, `playStory(..., {id:'BASE', bg:['art/bg/bg_base.jpg', ...]})`).
Nó chạy qua đúng bộ máy của comic: **neo đáy, phóng theo chiều cao**, chân dung người nói đè lên nửa dưới.
Vì vậy vẫn giữ nguyên quy cách **3:4 dọc, 1536×2048**, mặt sàn ở 2/3 dưới, **nửa dưới phải trống và tối**
để chân dung hai người đè lên vẫn đọc được.

Bối cảnh: tổ nhặt sắt của Ronin, đóng trong một bãi xe cũ ở Khu Đáy. Ấm, chật, đồ đạc chắp vá — ngược hẳn
với cái lạnh của Tháp. Đây là chỗ duy nhất trong game người chơi thấy đội mình lúc không đánh nhau.

```
Interior of a scavenger crew's camp in a derelict underground parking garage: stripped car
bodies pushed against the walls as makeshift shelters, tarpaulins and corrugated steel sheets
strung overhead, a burning oil drum in the middle distance, strings of mismatched bulbs on
sagging cables, a workbench of salvaged limbs and cybernetic parts, crates, coiled hose, a
battered radio antenna rig. Warm rust-orange firelight against cold concrete, thin smoke haze,
a single shaft of pale violet light falling from a broken ceiling grate far above. Lived-in and
cluttered at the edges, but the center of the floor is a swept empty patch of stained concrete.
Floor: flat, dark, low detail across the bottom third.
```

Negative dùng chung ở đầu tài liệu, thêm: `cozy pastel, clean, tidy, daylight, wide open sky`.

---

## art/bg/bg_07d.png — Sector 07-D · DRAINAGE CATHEDRAL (giáo phái Mother Rust) ✔ ĐÃ CÓ

> **Đã lắp 07/09.** Ảnh bạn sinh ra khổ **21:9 (3168×1344)**, không phải 3:4 — đã cắt lấy khối giữa
> `art/bg/bg_07d.jpg` (1008×1344), bản rộng giữ ở `art-src/BG/bg_07d_wide.png`.
> **Bài học cho những ảnh sau: khung sân là 3:4 dọc, ảnh 21:9 chỉ hiện được ~21% bề ngang** — hai dàn ống
> đàn ở rìa trái/phải không bao giờ lọt vào khung. Sinh thẳng khổ dọc thì giữ được hết.

```
Flooded drainage cathedral beneath the city: a vast brick and concrete sewer vault with gothic
proportions, rows of rusted pipe organs made from welded conduits along the walls, an altar of
stacked broken android shells at the far end lit by hundreds of red votive lamps, shallow black
water on the floor with faint ripples and reflections, candle smoke, dripping stalactites of
rust. Rusted orange metal, blood-red lamp light, wet dark stone. Floor: a raised walkway of
riveted iron grating running toward the altar, flat and empty in the center.
```

## art/bg/bg_07e.png — Sector 07-E · THE LIFT (thang máy hàng lên Spire) ✔ ĐÃ CÓ

> **Đã lắp 07/09**, cùng cách cắt như 07-D (bản rộng ở `art-src/BG/bg_07e_wide.png`). Hàng lan can trong ảnh
> đóng vai đường chân trời và nằm khá thấp (60% chiều cao ảnh) nên sector này phải để `bgZoom:1.55` — cao hơn
> mọi màn khác — thì lan can mới lên trên chân hàng sau (46% chiều cao sân). Hai tang cuốn cáp hai bên bị cắt mất.

```
Interior of a colossal industrial cargo lift climbing a vertical shaft: a wide flat steel deck
with yellow hazard stripes worn to grey, waist-high railings, massive cable drums and pistons
on both sides, the shaft walls rushing past as blurred bands of light, cold violet corporate
lighting from above meeting warm rust-orange emergency lamps from below, sparks and wind-blown
dust. Half chrome, half rust: the upper part of the frame is clean and violet, the lower part
is scarred and orange. Floor: flat, empty center, slight downward camera angle.
```

---

## Chương 2 · SPIRE — bg_04a..bg_04e (tầng Chrome: sạch, sáng có kiểm soát, đối xứng)

Lưu ý chung cho chương 2: ảnh sáng hơn chương 1, nhưng **vẫn giữ 25% đáy tối** và tránh trắng xoá ở nửa trên
(game phủ lớp tối 42% lên ảnh sáng; nếu ảnh quá trắng thì chữ HUD sẽ phải phủ nặng và mất chi tiết).

**art/bg/bg_04a.png — ARRIVAL HALL**
```
Corporate arrival hall of a vertical megacity: an immense white marble floor with hairline grid seams,
rows of pale violet holographic queue markers hovering low, a distant reception wall of frosted glass
with a thin violet #7C4DFF light strip, symmetrical columns receding, no people. Cold white and slate,
faint mist at floor level, the lower quarter of the frame in soft shadow.
```
**art/bg/bg_04b.png — GLASS GARDEN**
```
Indoor glass garden on a high floor: real trees under a glass ceiling, artificial rain streaking the
panes, a straight stone walkway between reflecting pools, pale violet grow-lights hidden in the canopy,
city lights far below through the glass walls. Cool green-white palette with violet accents, symmetrical,
the walkway flat and empty in the center, bottom of the frame darker.
```
**art/bg/bg_04c.png — ARCHIVE**
```
Choir voice archive: endless rows of identical glass pods stacked into curved walls, each with a faint
violet standby light, a central polished black floor, soft data-light haze, absolute silence conveyed
by symmetry and emptiness. Dark graphite and violet, cold, the pods dimmer toward the edges.
```
**art/bg/bg_04d.png — CONFESSIONAL**
```
A long hall of confession booths: hundreds of small dark alcoves with one red light each, a single
booth at the far end lit brighter, a narrow white floor lane leading to it, everything else near black.
Red #FF4B4B pinpoints on black with a cold white lane; low fog; bottom of the frame nearly black.
```
**art/bg/bg_04e.png — THE NAVE**
```
The nave of the Canticle: a cathedral-scale corporate hall with a ceiling lost in light, tall slit
windows glowing pale violet, a raised central dais at the far end under a suspended glowing ring
(a giant Halo), symmetrical rows of pillars, a polished floor reflecting the ring. Grand, cold, sacred,
no people, the floor flat and empty in the center, bottom quarter in shadow.
```
