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

Tên file HTML sẽ tự tìm: `bg_07a.png`, `bg_07b.png`, `bg_07c.png`, fallback `bg_battle.png`.
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

## bg_07a.png — Sector 07-A · SCRAPYARD GATE (Rust, dễ)

```
Rust district scrapyard gate at night: a cracked concrete lot bordered by walls of crushed cars
and welded scrap, chain-link fences patched with corrugated metal, oil puddles reflecting a
single sodium-orange floodlight in the far distance. Rusted orange #E2703A, toxic yellow-green
signal lamps, dirty grey concrete. Haze low on the ground. Floor: stained concrete with faint
painted grid lines and tire marks. Distant skyline of the Chrome corporate towers as tiny cold
white lights on the horizon.
```

## bg_07b.png — Sector 07-B · FOUNDRY ROW (Rust, chuẩn)

```
Abandoned foundry interior repurposed by scavengers: a long steel-plate floor with welded seams
and drainage grates, massive cold furnaces and ladles along the far wall, hanging chains, a thin
river of molten slag glowing burnt-orange far in the background as the only strong light.
Rust and soot everywhere, patched with stolen chrome panels that reflect cold violet light.
Steam vents low on the sides. Floor: dark riveted steel with a faint grid pattern, oil sheen,
subtle reflections. Overhead gantry cranes lost in darkness.
```

## bg_07c.png — Sector 07-C · CORP PERIMETER (Chrome, boss)

```
Corporate perimeter checkpoint of the Chrome elite: a pristine polished white-and-graphite
floor with a precise luminous grid, seamless walls of frosted glass and brushed titanium,
a tall closed security gate at the far end glowing pale violet #7C4DFF through thin light
slits, holographic barrier lines hovering low near the horizon. Cold white and slate-blue tones,
surgical cleanliness, absolute symmetry, faint rain on the glass. Floor reflects the gate glow.
No warmth, no rust, no clutter.
```

## bg_battle.png — nền dự phòng (dùng cho mọi sector chưa có ảnh)

```
Neutral cyberpunk arena: a dark elevated platform of matte graphite plates with a faint
luminous grid, surrounded by darkness and distant city lights, a single thin horizon line
of cold light. Minimal, quiet, no landmarks. Slight violet and rust tint on opposite sides
of the frame: violet haze on the left, rust-orange haze on the right.
```

---

## title_keyart.png — ảnh cho màn Title (tuỳ chọn)

Ảnh trong suốt hoặc nền tối, Kira đứng nhìn về phía trước, khổ dọc, chừa trống nửa trên
để đặt logo. HTML dùng file này ở góc phải dưới màn Title; thiếu thì dùng `KIRA/Kira PNG.png`.

```
Kira, white-haired android swordswoman in white kimono-armor with violet accents and a halo
ring, full body, standing three-quarter view facing left, katana lowered, calm expression,
transparent background, 3D CG anime key visual, high detail, sharp edges, cold rim light.
```

---

## bg_07d.png — Sector 07-D · DRAINAGE CATHEDRAL (giáo phái Mother Rust)

```
Flooded drainage cathedral beneath the city: a vast brick and concrete sewer vault with gothic
proportions, rows of rusted pipe organs made from welded conduits along the walls, an altar of
stacked broken android shells at the far end lit by hundreds of red votive lamps, shallow black
water on the floor with faint ripples and reflections, candle smoke, dripping stalactites of
rust. Rusted orange metal, blood-red lamp light, wet dark stone. Floor: a raised walkway of
riveted iron grating running toward the altar, flat and empty in the center.
```

## bg_07e.png — Sector 07-E · THE LIFT (thang máy hàng lên Spire)

```
Interior of a colossal industrial cargo lift climbing a vertical shaft: a wide flat steel deck
with yellow hazard stripes worn to grey, waist-high railings, massive cable drums and pistons
on both sides, the shaft walls rushing past as blurred bands of light, cold violet corporate
lighting from above meeting warm rust-orange emergency lamps from below, sparks and wind-blown
dust. Half chrome, half rust: the upper part of the frame is clean and violet, the lower part
is scarred and orange. Floor: flat, empty center, slight downward camera angle.
```
