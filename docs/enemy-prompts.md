# CHROMEFALL — Prompt art kẻ địch (Tutorial + Chương 1)

> **Trạng thái 07/09/2026.** Đủ **21/21 art thẻ** (`art/card/<id>.jpg`, ảnh dọc có nền) — đã cắm vào game: thanh lượt
> trong trận, chân dung người nói trong comic, 14 panel comic của boss (không còn silhouette), bestiary `kit.html`.
> Danh sách id có art nằm ở `FOE_ART` trong `js/data.js`.
>
> **Còn thiếu: sprite tách nền để đứng trên sân** (`art/sprite/<id>_idle.png`) — art thẻ có nền nên không dùng thay
> được. Trong trận địch vẫn là silhouette "NO SPRITE" (`js/battle.js` → `unitEl`). File này là quy cách cho bản
> tách nền đó: cùng nhân vật, vẽ lại trên nền phẳng theo mục 2, rồi cắm theo mục 6 (~15 dòng code).
> Sprite tách nền còn dùng lại được làm lớp `fg` đè lên panel comic (`js/story.js`), nên một ảnh ăn hai chỗ.
>
> Danh sách lấy từ `ENEMY_POOL` và `SECTORS[].plan` trong `js/data.js`. Đủ cho tutorial + chương 1: **21 con**.

---

## 1. Danh sách địch chương 1

| # | id | Tên trong game | Phe | Rank | Xuất hiện | Ưu tiên |
|---|---|---|---|---|---|---|
| 1 | `scav` | SCAV | Rust | grunt | 00-T, 07-A | **P0** |
| 2 | `gutterrat` | CHUỘT CỐNG | Rust | grunt | 00-T, 07-D | **P0** |
| 3 | `straydog` | CHÓ HOANG | Rust | grunt | 00-T, 07-A | **P0** |
| 4 | `welder` | THỢ HÀN | Rust | grunt | 07-A, 07-B | **P0** |
| 5 | `rigger` | RIGGER | Rust | **boss** | 07-A | **P0** |
| 6 | `foreman` | FOREMAN | Rust | **boss** | 07-B | **P1** |
| 7 | `archon` | ARCHON | Chrome | **boss** | 07-C | **P1** |
| 8 | `motherrust` | MOTHER RUST | Rust | **boss** | 07-D | **P1** |
| 9 | `cantor` | CANTOR | Chrome | **boss** | 07-E | **P1** |
| 10 | `slagger` | SLAGGER | Rust | grunt | 07-B, 07-D | P2 |
| 11 | `pipefitter` | THỢ ỐNG | Rust | grunt | 07-B | P2 |
| 12 | `tinman` | TIN MAN | Rust | grunt | 07-B | P2 |
| 13 | `chopshop` | CHOP SHOP | Rust | grunt | 07-B | P2 |
| 14 | `hollow` | HOLLOW | Rust | grunt | 07-B, 07-D | P2 |
| 15 | `kiln` | KILN | Rust | elite | 07-B, 07-D | P2 |
| 16 | `drillbit` | DRILL-BIT | Rust | elite | 07-D | P2 |
| 17 | `drone` | DRONE MK1 | Chrome | grunt | 07-C, 07-E | P3 |
| 18 | `glassjaw` | GLASS JAW | Rust | grunt | 07-C | P3 |
| 19 | `enforcer` | ENFORCER | Chrome | elite | 07-C, 07-E | P3 |
| 20 | `chromehound` | CHROME HOUND | Chrome | elite | 07-C, 07-E | P3 |
| 21 | `bulwark` | BULWARK | Rust | elite | **chưa dùng** ở màn nào | P4 |

P0 = làm 5 con này là 00-T và 07-A hết silhouette. P1 = bốn cái mặt của chương, đứng giữa sân, to nhất, người
chơi nhìn lâu nhất. P4 = `bulwark` chỉ nằm trong bể dự phòng, mọi sector đều có `plan` tay nên nó không bao giờ
ra sân — làm sau cùng, hoặc thay một con trong `plan` của 07-B bằng nó.

---

## 2. Quy cách ảnh

| Mục | Giá trị | Vì sao |
|---|---|---|
| Ảnh nguồn | **1 nhân vật, toàn thân, thấy rõ chỗ chạm đất** (hai bàn chân, hoặc bốn chân) | `scratch/key_frame.py` neo sàn theo pixel thấp nhất và tìm cụm bàn chân ở 70px đáy |
| Nền | **một màu phẳng**: xanh lá `#00FF00` cho hầu hết; magenta `#FF00FF` nếu con đó có chi tiết xanh lá | script khử nền theo màu viền ảnh; nền xanh thì nó khử xanh toàn cục |
| Cấm trong ảnh nguồn | bóng đổ dưới chân, mặt sàn, cảnh nền, chữ, khung, logo | sân tự vẽ bóng (`.unit__shadow`); nền còn sót sẽ thành mảng đen quanh chân |
| Khổ | dọc, cạnh dài ≥ 1024px (1536×2048 là đẹp) | ảnh bị thu về canvas cao 682px |
| Hướng | **quay sang trái khung**, tư thế 3/4 | địch đứng nửa phải sân, nhìn về phía đội mình. Art đồng minh (Yuki) đang quay phải |
| Tư thế | đứng thủ, vũ khí cầm sẵn, không vung | đây là frame `idle`, sân tự bob lên xuống 6px |
| Tên file ra | `art/sprite/<id>_idle.png` (ảnh nguồn để ở `art-src/ENEMY/<id>.png`) | trùng cách đặt của `art/sprite/yuki_idle.png` |

**Chiều cao trong khung (quan trọng hơn mọi thứ khác).** Canvas cao 682px, chân chạm đáy. Vẽ xong chỉnh
`scale` khi chạy script sao cho:

| Rank | Cao trong canvas | Sân còn phóng thêm |
|---|---|---|
| grunt | ~86% (≈590px) | ×1.0 |
| elite | ~94% (≈640px) | ×1.08 |
| boss | 100% (≈680px) | ×1.28 và lùi vào trong, vẽ đè lên |

Nghĩa là boss trên sân to gấp rưỡi grunt. Đừng vẽ boss "hoành tráng" rồi lại thu nhỏ cho vừa — cứ để nó
chiếm hết canvas, sân lo phần còn lại (`js/battle.js` → `renderSide`).

**Tách nền:**

```bash
python scratch/key_enemy.py art-src/ENEMY --only scav      # bỏ --only để làm cả thư mục
```

Script tự thu nhỏ theo rank (bảng trên; chó/drone có số riêng trong `HEIGHT`/`LIFT`), tự bỏ watermark ✦ ở góc,
in JSON có `box` — chép vào `FOE_SPRITE` trong `js/data.js` (mục 6). **Đã làm xong 21/21 con ngày 11/09.**

**Cần mấy frame một con?** Chỉ `idle` là đủ: engine thiếu `attack` thì tự lấy `idle` dùng lại (`frameSet`).
Tư thế thêm là **ảnh tĩnh**, không phải animation: `<id> attack.png` (đòn thường) và `<id> crit.png` (đòn chí mạng —
engine quay chí mạng trước khi lao tới để chọn đúng frame lúc chạm), có thể cắt từ một frame video nền xanh; chạy
`python scratch/key_enemy.py art-src/ENEMY --only <id> --ref "<frame đứng cùng video>"` để cỡ người khớp idle.
Đã có: Glass Jaw, Scav, Slagger, Drill-Bit (thêm `die` = tư thế gục, giữ đến hết trận), Kiln (11/09). Video chỉ dùng cho chiêu cuối.
Tên file chấp nhận `<id> normal.png` (= attack), `<id> crit attack.png`, `<id> die.png`; ảnh chụp màn hình từ contact sheet cũng được
(script tự cắt viền đen, xoá nhãn số ở góc, bỏ chữ chú thích và mảnh ô kế bên) nhưng **ảnh ~400 px sẽ mờ** khi phóng lên hộp 682 —
có frame gốc/video thì thả frame gốc. Nếu còn sức thì làm `<id> hurt.png` cho 4 boss.

---

## 3. Prompt chung

Dán khối này trước mỗi prompt riêng ở mục 5.

```
Full-body character art of a single enemy unit for a cyberpunk turn-based RPG.
Standing idle in a braced combat stance, weapon held ready, not swinging.
Three-quarter view angled toward the viewer's LEFT, whole body in frame, feet flat and fully visible.
Flat solid green #00FF00 background, nothing else: no floor, no ground plane, no cast shadow,
no scenery, no text, no logo, no frame.
3D CG anime key visual, clean rendering, high contrast, dense mechanical detail,
strong readable silhouette that stays clear at small size.
```

Rồi thêm một dòng màu theo phe:

```
Palette: rust-orange #E2703A, burnt steel, soot and dirty concrete grey, warm sodium light.
```
```
Palette: cold white #DCE6F7, graphite grey, violet #7C4DFF glow on lenses and halo rings.
```

**Negative prompt:**

```
text, letters, watermark, logo, UI, frame, border, two characters, duplicate, crowd,
cropped feet, cut off limbs, floor, ground, cast shadow, scenery, gradient background,
bright saturated rainbow colors, chibi, blurry, low contrast, soft focus
```

**Luật silhouette.** Trên sân mỗi con chỉ rộng 84–160px. Ở cỡ đó người chơi không thấy chi tiết, chỉ thấy
**bóng ngoài + một điểm sáng màu**. Nên mỗi con phải khác con bên cạnh ở ít nhất hai trong ba thứ: chiều cao,
độ rộng vai, món đồ cầm/đeo nhô ra khỏi người. Kiểm tra nhanh: tô ảnh thành một mảng đen, còn đoán được là
con nào thì đạt.

---

## 4. Mẹo tiết kiệm: đẻ biến thể từ một ảnh gốc

21 con không cần 21 lần vẽ từ đầu. Chúng đi thành gia đình, cùng bộ xương, khác đồ nghề. Vẽ một con gốc cho
đẹp rồi chạy image-to-image (denoise ~0.5–0.6) hoặc giữ nguyên seed và đổi phần mô tả đồ nghề:

| Gia đình | Con gốc nên vẽ trước | Đẻ ra |
|---|---|---|
| Nhặt sắt — gầy, mặt nạ, đồ vá | `scav` | `gutterrat` (thấp hơn, ướt), `chopshop` (tạp dề + bao tay chân máy) |
| Thợ — tạp dề, đồ nghề nặng | `welder` | `pipefitter` (mỏ lết), `slagger` (gáo nước thép), `kiln` (lò trên lưng, to hơn) |
| Giáp — khối vuông, tôn tấm | `tinman` | `rigger` (tời từ + móc), `bulwark` (khiên tấm đường) |
| Máy hỏng & thú bốn chân | `straydog` | `hollow` (đứng hai chân, ngực rỗng), `chromehound` (bản Chrome sạch, trắng-tím) |
| Choir — trắng, sạch, có Halo | `enforcer` | `drone` (nhỏ, bay), `archon` (cao gấp rưỡi, không đầu), `cantor` (người, quân phục) |
| Lẻ, phải vẽ riêng | — | `glassjaw`, `drillbit`, `foreman`, `motherrust` |

Bốn boss thì đừng đẻ biến thể. Mỗi boss vẽ riêng, thử 4–6 lần lấy bản tốt nhất.

**Ăn khớp với comic.** Bốn boss đã có dòng nhận dạng trong `docs/comic-prompts.md` §1; prompt dưới đây giữ
nguyên các chi tiết đó (tạp dề + càng thuỷ lực của Foreman, vòng ống hàn của Mother Rust, thấu kính tím của
Archon, Halo vàng của Cantor). Sửa một bên thì sửa cả hai bên, không thì panel comic và sân đấu ra hai người.

---

## 5. Prompt từng con

Ghép: **prompt chung + dòng màu theo phe + khối riêng bên dưới**.
Dòng "Nhận diện" là tiếng Việt một câu — dùng luôn làm lore ngắn của con đó (mục 7).

### Gia đình nhặt sắt

#### `scav` · SCAV — Rust · grunt · 00-T, 07-A · **P0**
**Nhận diện:** Dân nhặt sắt có vũ khí. Tháo mọi thứ rơi từ Tháp xuống, kể cả thứ còn thở.
```
A wiry scrapyard raider: patchwork armor welded from car panels and street signs over a hooded rag coat,
full-face gas mask with one cracked lens, a rusted crowbar in one hand, salvage hooks and cut cable on the belt.
Lean and hunched, half a head shorter than a soldier, dirty and improvised.
```

#### `gutterrat` · CHUỘT CỐNG — Rust · grunt · 00-T, 07-D · **P0**
**Nhận diện:** Sống dưới cống, ăn theo đàn. Nhỏ nhất, nhanh nhất, chết cũng nhanh nhất.
```
The smallest enemy on the field: a sewer scavenger in a dripping poncho stitched from plastic sheet,
a headlamp strapped over a rag-wrapped face, crouched low, a short hooked blade in each hand,
coils of stolen copper cable around the waist. Silhouette clearly shorter and narrower than every other unit.
```

#### `chopshop` · CHOP SHOP — Rust · grunt · 07-B · P2
**Nhận diện:** Tháo tay chân máy đem bán. Trong bao sau lưng lúc nào cũng có hàng.
```
A cyber-limb harvester: a butcher's apron over a tool vest, surgical goggles pushed up on a scarred bald head,
a small cutting torch in one hand and a bone saw in the other, a sack of severed chrome arms and legs
slung across the back with fingers poking out.
```

### Gia đình thợ

#### `welder` · THỢ HÀN — Rust · grunt · 07-A, 07-B · **P0**
**Nhận diện:** Thợ hàn của băng. Vá giáp cho đồng bọn ngay giữa trận.
```
A foundry welder: heavy leather apron over patched overalls, full welding hood with a narrow view slit
lit hot white from inside, thick gauntlets, an arc-welding torch in the right hand throwing sparks,
a battered gas cylinder strapped to the back with hoses running over the shoulder.
```

#### `pipefitter` · THỢ ỐNG — Rust · grunt · 07-B · P2
**Nhận diện:** Lắp ống cho Khu Đáy hai mươi năm. Giờ dùng mỏ lết theo cách khác.
```
A pipe worker built like a wall: barrel-chested, forearms and torso wrapped in duct tape and heat cloth,
a huge two-handed pipe wrench held across the body, lengths of steel pipe strapped to the back like a quiver,
valve wheels hanging from the belt, face behind a scratched respirator.
```

#### `slagger` · SLAGGER — Rust · grunt · 07-B, 07-D · P2
**Nhận diện:** Múc kim loại nóng chảy. Bị bỏng đến mức không còn thấy đau.
```
A slag pourer: half-melted plate armor with glowing orange seams running through the cracks,
a long-handled steel ladle of molten metal carried in both hands, dripping sparks,
face hidden behind a soot-streaked heat visor, heat haze rising off the shoulders.
```

#### `kiln` · KILN — Rust · **elite** · 07-B, 07-D · P2
**Nhận diện:** Vác nguyên cái lò trên lưng. Đứng gần là cháy.
```
A walking furnace: a huge worker with a lit foundry crucible bolted to his back, chest hatch open showing
the fire inside, forearms sheathed in glowing molten metal that drips, a heat-scarred riveted iron mask
with no eye holes, only a grille. Wider and a head taller than the grunts, air distorting around him.
```

### Gia đình giáp

#### `tinman` · TIN MAN — Rust · grunt · 07-B · P2
**Nhận diện:** Người ngồi trong cái bình nước nóng. Đánh yếu nhưng lâu chết.
```
The tank: a man sealed inside a riveted boiler-plate suit built from a water heater and road signs,
a narrow horizontal eye slit, short stubby armored arms, a stop sign bolted to one forearm as a shield,
oversized welded boots. Wide, boxy, almost cubic silhouette; slow and heavy.
```

#### `rigger` · RIGGER — Rust · **boss** · 07-A · **P0**
**Nhận diện:** Trùm băng Scav (lên trùm 11/09, trước là lính thường). Thợ cẩu của bãi, kéo mục tiêu về phía mình bằng móc.

> **Ảnh thẻ hiện tại vẫn dùng được** — sprite trận tự phóng to theo `rank` (boss = 100% hộp, lính thường = 86%), không phải vẽ lại.
> Nếu muốn hắn ra dáng trùm hơn thì thêm: bộ tời thép cỡ lớn cõng sau lưng, dây cáp vắt chéo ngực có móc treo lủng lẳng mấy mẩu "hàng" chưa bán, và một chân đứng chống lên khối bê tông vụn.

```
A yard rigger: dented hard hat with a lamp, harness of straps and carabiners over a sleeveless work jacket,
the right arm replaced by a magnetic winch with a heavy hook on a chain hanging down to the knee,
a coil of steel cable over the shoulder. Broad-shouldered, chain swinging.
```

#### `bulwark` · BULWARK — Rust · **elite** · chưa dùng · P4
**Nhận diện:** Một bức tường biết đi. Không ai đi qua chỗ nó đứng.
```
A wall on legs: a squat heavy fighter behind a barricade shield welded from road plates and guardrail,
spikes along the shield's bottom edge, a short spiked hammer in the other hand, boots braced wide apart,
only the eye slit of a welded helmet visible above the shield rim. Shape reads as a rectangle, not a person.
```

### Máy hỏng & thú bốn chân

#### `straydog` · CHÓ HOANG — Rust · grunt · 00-T, 07-A · **P0**
**Nhận diện:** Chó máy bị bỏ ở bãi, chạy theo bầy. Không còn phần nào nhận lệnh người.
```
A four-legged scrap dog: a stripped animal-frame robot with exposed piston legs and bare cable tendons,
no head plating, a jaw built from two circular saw blades, one glowing orange eye lens,
a tail of braided wire. Low to the ground, tense pouncing stance, all four paws flat on the ground.
```

#### `hollow` · HOLLOW — Rust · grunt · 07-B, 07-D · P2
**Nhận diện:** Tín đồ của Mother Rust tự mổ phanh lồng ngực, móc sạch lòng mề rồi **để trống hoác như thế** — bịt lại là chối bỏ ân sủng. Dây thần kinh máy đứt lòng thòng rủ ra khỏi miệng hốc.

> **Chốt 11/09: chữ chạy theo ảnh.** Bản lore đầu tiên cho tín đồ nhồi linh kiện vào bụng rồi khâu bằng dây thép, nhưng `art/card/hollow.jpg` đã vẽ khoang ngực trống — anh chọn **đổi chữ trong sổ bộ**, giữ nguyên ảnh. Prompt dưới đúng với ảnh đang chạy; đừng thêm chi tiết nhồi/khâu vào các biến thể sau.

> **MÀU LÀ CHỖ PHÂN BIỆT (chốt 11/09).** Cùng một dáng người, hai câu chuyện ngược nhau:
> **tối màu, ám rỉ sét, xanh chì ngả tím** = `hollow`, người Đáy **tự moi** vì tín ngưỡng (phe Rust).
> **trắng sạch kiểu Choir** = `husk`, lính Tháp **bị RÚT** rỗng bằng dao mổ (phe Chrome, chương 2).
> Người chơi phải nhận ra khác biệt bằng mắt, không cần ai giải thích. Đẻ `husk` từ chính ảnh `hollow` theo mẹo §4 — đừng vẽ lại từ đầu.

```
A gutted cultist: a humanoid frame in dark graphite and blue-grey metal washed with violet, the chest
cavity torn wide open and left completely empty, cut cables and coloured wires spilling out of the hollow
and trailing down, one forearm stripped to the bare actuator bundle, smooth blank face with a single dim
orange ember behind the eye slit. Hanging crooked from two slack cables like a puppet on strings, grimy
rusted metal, no clothing. Standing in a wet scrapyard.
```

**Biến thể chương 2 — `husk` · PHẾ PHẨM (Chrome, grunt):** giữ nguyên dáng đứng xiêu vẹo và cái khoang ngực rỗng ở trên, đổi bảng màu.
```
Same hollowed humanoid frame, but as a corporate unit: clean white Choir plating still glossy under
the grime, violet trim, a dead violet halo ring hanging broken at its shoulder, the chest cavity
opened by a surgical cut — straight edges, no tearing — and emptied. Face plate intact and serene,
eye slit dark, no light behind it. Standing upright and perfectly still, arms slack at its sides.
```

#### `chromehound` · CHROME HOUND — Chrome · **elite** · 07-C, 07-E · P3
**Nhận diện:** Chó săn của Canticle. Không có đầu, chỉ có một dải cảm biến.
```
A corporate hunter unit: a sleek four-legged android hound in clean white plating, headless —
a violet sensor strip runs across the front where a face would be, blade-shaped legs, a spine of cooling fins,
a small violet halo ring floating above its shoulders. Low predatory stance, all four feet on the ground.
```

### Choir — phe Chrome

#### `drone` · DRONE MK1 — Chrome · grunt · 07-C, 07-E · P3
**Nhận diện:** Mắt của Canticle. Quét mã, báo về, bắn cầm chân.
```
A corporate patrol drone: a small hovering machine the size of a torso in a clean white shell,
a single violet scanning lens, two stub cannons folded underneath, thin articulated arms tucked in,
a violet halo ring spinning around its body. Hovering at knee height, with a thin violet scanning beam
reaching down and touching the ground directly below it.
```
> Con này không có chân. Chùm sáng chạm đất là bắt buộc: script neo pixel thấp nhất xuống mặt sàn, thiếu nó
> thì drone bị dán xuống đất như đang ngồi.

#### `enforcer` · ENFORCER — Chrome · **elite** · 07-C, 07-E · P3
**Nhận diện:** Lính chống bạo động của Choir. Gác cổng vành đai — Muzzle từng đứng cạnh loại này.
```
A Canticle riot android: humanoid, white and graphite armor plating with clean panel lines and no visible face,
a single horizontal violet visor slit, a violet halo ring floating above the head,
a shock baton in the right hand and a slim energy shield on the left forearm, a corporate insignia plate
on the chest. Disciplined upright posture, taller than any Rust grunt.
```

#### `archon` · ARCHON — Chrome · **boss** · 07-C · **P1**
**Nhận diện:** Không phải người. Là cái cổng vành đai tự đứng dậy đi thu hồi hàng.
```
Archon, the body of a gate AI: a tall faceless security frame in white and graphite, no head —
a single large violet lens set into the torso column, long thin limbs with barrier projectors on the forearms,
holographic violet barrier lines folding open around it, a wide halo ring rotating overhead.
Taller and far thinner than anything else on the field, standing perfectly straight.
```

#### `cantor` · CANTOR — Chrome · **boss** · 07-E · **P1**
**Nhận diện:** Người ra lệnh xoá Yuki, và là người xếp trẻ con lên xe sau vụ sập Tầng Bốn.
```
Cantor, commander of the Choir: a gaunt elderly man in a spotless white corporate uniform with violet piping,
a golden glowing halo ring above his head, gloved hands folded behind his back, cold empty expression,
no weapon. Hairline seams at the neck and wrists with faint golden light leaking out of them —
he is a remote-controlled shell, and it should only be visible if you look twice.
```
> Vết nối ở cổ tay và cổ là chi tiết cài sẵn cho outro 07-E ("Cantor chỉ là cái vỏ"). Đừng làm nó lộ quá.

### Lẻ

#### `glassjaw` · GLASS JAW — Rust · grunt · 07-C · P3
**Nhận diện:** Đấm thuê ở sới. Đánh mạnh nhất trong đám lính thường, và gãy cũng dễ nhất.
```
A bare-chested pit brawler: cracked white ceramic plating over the shoulders and forearms,
a transparent glass-and-chrome jaw implant glowing faintly from inside, taped fists up in a boxing guard,
a scarred torso, no helmet, hair shaved to stubble. Wide shoulders, thin waist, light on his feet.
```

#### `drillbit` · DRILL-BIT — Rust · **elite** · 07-D · P2
**Nhận diện:** Đào đường xuống nhà thờ cống. Cái khoan nặng hơn cả người.
```
A mining rig of a man: the right arm replaced by an oversized hydraulic drill with a spiral bit,
hydraulic hoses running up into a caged exoskeleton back frame, safety-orange plating scratched down
to bare steel, welding goggles above a grinning mouth guard. Leaning forward, drill lowered and ready to bite.
```

#### `foreman` · FOREMAN — Rust · **boss** · 07-B · **P1**
**Nhận diện:** Chiếm lò đúc cũ của Canticle. Bán lửa, và định nấu chảy Yuki.
```
Foreman, boss of the foundry gang: a massive scarred man in a welder's apron over bare tattooed shoulders,
one arm replaced by a heavy hydraulic industrial claw, a cutting torch on the hip, half his face burn-scarred,
a cigar stub in his teeth. Lit from below by molten-metal glow. Head and shoulders larger than any grunt,
standing with his weight forward like he owns the floor.
```

#### `motherrust` · MOTHER RUST — Rust · **boss** · 07-D · **P1**
**Nhận diện:** Thờ đồ Chrome rơi xuống Đáy. Giữ sổ ghi mọi thứ và mọi đứa trẻ đã rơi.
```
Mother Rust, priestess of the sewer cathedral: an old woman draped in rust-colored rags and layered
scrap-metal jewellery, a halo welded from cut pipes fixed behind her head, mismatched salvaged prosthetic
fingers, a heavy ledger book chained to her waist, red candle stubs melted onto her shoulder plates.
Arms opening in a blessing, warm red light on her face from below. Wide and heavy with all the layered rags.
```

---

## 6. Cắm ảnh vào game (đã làm 11/09: `FOE_SPRITE` trong `js/data.js`, `frameSet`/`setFrame` trong `js/battle.js` tự lật)

Hiện `preloadFrames()` trong `js/battle.js` chỉ nạp frame cho đội mình; địch luôn rơi vào nhánh silhouette.
Khi có ảnh, việc cần làm:

1. Thêm `sprites` vào từng entry `ENEMY_POOL` (`js/data.js`), y như `ROSTER`:
   `sprites:{ idle:['art/sprite/scav_idle.png'], box:{ idle:{w:744,h:682,ax:372} } }` — `box` chép từ JSON mà
   `key_frame.py` in ra.
2. `preloadFrames()` nạp thêm frame cho các `u.side==='enemy'` của wave hiện tại, `spawnWave()` gọi
   `mountSprite(u)` cho địch (giờ chỉ gọi cho `ally`).
3. Con nào lỡ vẽ quay phải thì thêm cờ `flip:true` và một dòng CSS `.unit--enemy.is-flip img{transform:scaleX(-1)}`.

Nói một tiếng là làm, không cần chờ đủ 21 con — thiếu ảnh thì con đó tự quay về silhouette như cũ.

---

## 7. Địch có cần kỹ năng và lore không — đề xuất (chưa cài)

**Lore: cần, nhưng mỗi con một câu, không phải hồ sơ.** Dòng "Nhận diện" ở mục 5 là đủ, và nó đã được viết
sẵn rồi — cùng một câu vừa dùng để ra prompt, vừa dùng làm lore. Chỗ hiện: chạm vào bảng tên con địch trong
trận, hoặc một tab BESTIARY trong ARCHIVE. Lý do nên có: passive của nhân vật đang gọi thẳng tên địch
(`kai-hound` → Chrome Hound, `ronin-rule` → Foreman, `yuki-name` và `ash-floor4` → Cantor, `muzzle-gate` →
Enforcer). Người chơi đọc passive thấy tên lạ mà không tra được ở đâu thì passive thành chữ suông.

**Bốn boss thì viết đủ khung lore** (Là ai → Chuyện đã xảy ra → Bây giờ → Câu nói, ≤ 180 chữ, `docs/story.md`
§5.6) vì cả bốn đều có thoại trong comic. Grunt thì một câu, hết.

**Kỹ năng: cần, nhưng ít và chỉ cho elite/boss.** Lý do thật: hiện 21 con chỉ khác nhau ở ATK và HP, con nào
cũng đánh một đòn thường. Người chơi luôn bấm vào con máu thấp nhất, nên thao tác chạm-chọn-mục-tiêu vừa làm
xong không có quyết định nào phía sau. Cho địch một chiêu là cách rẻ nhất để thao tác đó có ý nghĩa —
không cần art mới, không cần video.

Đề xuất năm nội tại, mỗi con nhiều nhất một cái:

| Nội tại | Hiệu ứng ★ | Con nào | Dạy người chơi điều gì |
|---|---|---|---|
| **GIÁP** | nhận −25% sát thương | `tinman`, `bulwark` | đừng đánh con dày trước |
| **BẦY** | +30% ATK khi còn ≥2 đồng bọn sống | `straydog`, `chromehound` | giết bớt là giảm sát thương nhận |
| **HÀN** | đầu lượt hồi 8% HP cho đồng bọn thấp máu nhất | `welder`, `pipefitter` | phải giết con hỗ trợ trước |
| **CHÁY** | đòn của nó để lại 3% HP tối đa mỗi lượt, 2 lượt | `kiln`, `slagger` | kết thúc wave nhanh |
| **NHIỄU** | đòn của nó rút 15 Energy của mục tiêu | `drone`, `enforcer` | dọn drone trước khi dồn chiêu cuối |

Boss thì thêm một nhịp riêng: đòn lớn **báo trước một lượt** (hiện chip "SẮP RA ĐÒN" trên bảng của nó) và
gọi thêm một grunt khi mất 50% HP. Báo trước là phần quan trọng — nó biến lượt đó thành một lựa chọn: dồn
sát thương giết trước, hay lùi lại chịu đòn.

Hai lưu ý trước khi cài: (1) `tinman` và `straydog` là grunt nhưng vẫn nên có nội tại, vì chúng ra sân từ
00-T và 07-A, là chỗ dạy người chơi — các grunt còn lại để trơn cho tutorial dễ đọc. (2) Cài xong phải chạy
lại `node scratch/sim.js`: 07-D và 07-E đang ở 48–49% thắng, thêm nội tại cho địch sẽ kéo xuống nữa.

Thứ tự nên làm: art P0 + 4 boss trước, chốt hình xong mới gán nội tại — để nội tại khớp với cái con đó cầm
trên tay (con vác bình hàn thì mới có HÀN).
