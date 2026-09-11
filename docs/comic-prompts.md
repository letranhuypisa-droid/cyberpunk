# CHROMEFALL — Prompt ảnh panel comic (Tutorial + Chương 1)

Trang comic được dựng bằng HTML (`js/comic.js`): bố cục panel, bong bóng, caption, SFX là CSS; **mỗi panel là một ô ảnh**.
Game tự tìm ảnh riêng theo tên `art/comic/<sector>_<i|o><trang>_p<panel>.jpg`; thiếu thì dùng art nhân vật / ảnh nền có sẵn.
Sinh ảnh xong, đặt đúng tên vào thư mục `art/comic/` cạnh `index.html` là xong, không phải sửa code.

## 1. Quy cách

| Mục | Giá trị |
|---|---|
| Định dạng | JPG chất lượng cao, tối đa 1600px cạnh dài. Ảnh riêng hiện **nguyên khung** (`object-fit: cover` theo tâm); `pos`/`zoom` trong `js/story.js` chỉ áp cho ảnh tạm |
| Khổ theo layout (đo ô thật ở 375×812) | `v2` (ô 359×338): **1:1** · `w3` ô rộng (359×362): **1:1** · `w3` ô nhỏ (176×315): **9:16** · `h2` (176×685, game cắt hai bên, còn ~46% bề ngang): **9:16**, chủ thể trong dải giữa 45% · `splash` (359×685): **9:16** |
| Chữ | **Không** chữ, không bong bóng, không SFX, không logo — game vẽ đè lên |
| Vùng an toàn | Bong bóng đặt ở góc (`at` trong data): chủ thể ở giữa khung, bốn góc ít chi tiết. Ô 1:1: góc trên trái trống cho caption. Ô nhỏ 9:16: chủ thể ở nửa trên, bong bóng chiếm ~30% ô. `h2`: chủ thể trong dải giữa 45% bề ngang |
| Phong cách | Manga/comic cyberpunk: nét mực đen, halftone, tương phản cao, ánh sáng kịch tính; game phủ thêm lớp chấm halftone nhẹ |
| Màu | Nền gần đen `#06070A`. Phe **Chrome** (Tháp/Canticle): tím `#7C4DFF` + trắng lạnh `#DCE6F7`. Phe **Rust** (Đáy): cam rỉ `#E2703A` + xanh axit `#C9D830` |

### Prompt chung (dán trước mỗi prompt riêng)
```
Cyberpunk manga panel, black ink linework with halftone screentone shading, high contrast, dramatic lighting,
cinematic composition, subject centered with quiet corners. No text, no speech bubbles, no letters, no watermark.
Palette: near-black background; violet #7C4DFF and cold white for the corporate Tower, rust-orange #E2703A and
acid-green #C9D830 for the scrapyard underworld.
```
### Negative prompt
```
text, letters, speech bubble, caption, logo, watermark, extra people, duplicate character, clone, blurry, low contrast
```

### Nhận dạng nhân vật (dán vào prompt khi nhân vật xuất hiện; giữ nguyên để không trôi tạo hình)

> **Tên nhân vật luôn viết kèm `@`** (`@Yuki`, `@Ash`, `@MotherRust`…) để công cụ tạo ảnh tự nhận ra nhân vật tham chiếu và giữ đúng tạo hình giữa các panel. Tên hai chữ viết dính liền, không có dấu cách. Đừng bỏ dấu `@` khi sửa prompt.
- **YUKI**: `@Yuki — 17-year-old android swordswoman, white bob hair, cat-ear mechanical headgear, a cracked halo ring above her head throwing sparks, white kimono-style armor with violet accents, white cybernetic legs, katana ZERO, cheerful yet unsettling expression`
- **ASH**: `@Ash — young woman, long straight black hair, pale skin, black lipstick, red eyeshadow, spiked choker, black leather jacket with a skull patch, torn dark cargo pants, katana with red-wrapped handle dripping acid-green liquid, cigarette`
- **KAI**: `@Kai — young man, @Ash's twin brother, long black hair, pale skin, black lipstick, spiked choker, open black leather jacket with skull patch over a tattooed torso, katana with red-wrapped handle dripping acid-green liquid, cigarette`
- **PSALM**: `@Psalm — tall woman, short white hair, glowing red halo ring, red eyes, chrome mechanical right shoulder and arm, black-and-red long coat covered in paper talismans, red lantern hanging from a chain`
- **RONIN**: `@Ronin — young man, spiky black hair with red tips, half-face respirator mask with a red light bar, black hooded cloak with orange kanji, cybernetic forearm, glowing steel katana`
- **MUZZLE**: `@Muzzle — huge man in a gas mask with yellow goggles, navy cloak over scrap-metal plate armor, tools strapped to his back, dented car door held as a shield`
- **FOREMAN**: `@Foreman — massive scarred gang boss in a welder's apron, one hydraulic industrial claw arm, lit by molten-metal glow`
- **ARCHON**: `@Archon — a gate AI: tall faceless white-and-graphite security frame with a single violet lens, holographic barrier lines`
- **MOTHER RUST**: `@MotherRust — ancient priestess draped in rust-colored rags and scrap-metal jewelry, a halo welded from pipes, surrounded by red candles`
- **CANTOR**: `@Cantor — gaunt elderly corporate commander in a white uniform, golden glowing halo ring, cold expression`
- **SCAV**: `scavenger gang members in welded scrap armor and gas masks carrying crowbars and cutters`
- **RIGGER**: `@Rigger — burly Scav gang boss, dented hard hat with a headlamp, sleeveless work vest over bare arms, a heavy coil of steel cable slung across his chest, a magnetic winch rig on his back with a hook on a chain, straps and carabiners, unhurried and contemptuous`
- Bối cảnh: **Khu Đáy** = `scrapyard of crushed cars, chain-link fences, sodium-orange floodlights, oil puddles`; **Lò đúc** = `abandoned foundry, cold furnaces, a river of molten slag`; **Hàng rào Canticle** = `pristine white corporate checkpoint, frosted glass, violet light slits, hovering drones`; **Nhà thờ cống** = `flooded sewer cathedral, pipe organs welded from conduits, altar of broken android shells, hundreds of red candles`; **Thang máy hàng** = `colossal industrial cargo lift, steel deck, cable drums, violet light from above, rust-orange lamps below`; **Tháp** = `a vertical megacity tower glowing violet and white above a dark city`.

---

## 2. Prompt từng panel

**Bản 11/09 — viết lại một lượt theo truyện chữ của anh**, bám đúng 94 panel đang có trong `js/story.js` (40 trang). Ghép khi tạo ảnh: *prompt chung (§1) + dòng nhận dạng nhân vật có mặt trong panel + nội dung dưới đây*. Khổ ảnh ghi ngay sau tên file. Tên file đầy đủ là `art/comic/<tên>`.

### Mười một chỗ bản văn khác với art — **đã chốt hết 11/09**

Anh chốt: **sửa văn theo art**, trừ mục 10 (không khí, không xung đột nên nhận hết). Thoại trong `js/story.js` đã được viết lại theo quyết định này, nên prompt dưới đây và game giờ nói cùng một chuyện. Giữ bảng lại để sau này không ai lật ngược.

| # | Bản văn của anh | Chốt |
|---|---|---|
| 1 | Ash bắn **súng ngắn**, "lên đạn", đập báng súng | **Katana axit.** Thoại đổi: *"Ash chém toác khớp vai hắn rồi bước lên chắn"*, *"mày chết trước khi tao kịp bán cái vòng thì tao lỗ"* (bỏ "lỗ vốn đạn") |
| 2 | Ash: áo măng-tô rách, tóc tết sát da đầu | **Art**: tóc đen dài, áo da vá đầu lâu, son đen, thuốc lá |
| 3 | Yuki ở 00-T dùng xà beng nhặt được | **Yuki rơi xuống cùng kiếm ZERO.** Thoại 00-T: *"Trong đầu tôi chỉ sót lại hai thứ. Cái tên Yuki. Và cách dùng thanh kiếm này."* |
| 4 | Ronin chột mắt, shotgun hai nòng | **Art**: mặt nạ nửa mặt đèn đỏ, tay máy, kiếm thép của chị để lại. Câu *"chưa bao giờ bỏ khách hàng lại phía sau"* giữ nguyên, chỉ đổi động tác thành tra kiếm vào bao |
| 5 | Psalm bắn súng giảm thanh, hút thuốc | **Art**: đèn lồng đỏ, áo choàng dán bùa giấy |
| 6 | Archon = khối cầu lơ lửng + Gatling | **Art**: pháo đài bán nguyệt bốn chân nhện, một mắt tím. Thoại Archon giữ nguyên bản mới (*"Trạng thái: hư hỏng… tiêu huỷ theo diện phế phẩm"*) |
| 7 | Foreman: nửa thân dưới là máy bốn chân | **Art**: gã khổng lồ giáp hàn xỉ lò + kẹp sắt nóng đỏ |
| 8 | Rigger vác búa | **Art**: tời thép + móc cáp (khớp chiêu WINCH) |
| 9 | Kai: súng tự chế to hơn người **và** đao | **Cả hai** — sprite trận là katana, chiêu cuối RIPCORD là súng điện từ (đã chốt 06/09) |
| 10 | Mưa axit · họng xả số 9 · bùn đen sủi bọt mỡ máy | **Nhận hết**, đã vào prompt và vào thoại |
| 11 | "CHROMIE FALLS" | Lỗi gõ của CHROMEFALL |

---

### 00-T · BÃI RƠI — intro *(3 trang · 7 panel)*
- `00t_i1_p1.jpg` — 1:1 — Extreme low angle from the bottom of the world: the Halcyon Tower stabbing up through toxic cloud, its windows glowing violet and cold white, impossibly clean; far below, black silhouettes of scrap rooftops; acid rain falling in long streaks. No people.
- `00t_i1_p2.jpg` — 1:1 — Night scrapyard under waste chute No.9: a mountain of crushed cars, black oily mud bubbling with machine grease, acid rain hissing; a single white streak of light falls out of the sky into the heap, throwing sparks. No people.
- `00t_i2_p1.jpg` — 1:1 — Extreme close-up of @Yuki's face lying in the scrap, eyes just opening, rain running across her cheek, the cracked halo above her sparking; her gaze is hollow rather than frightened — empty, as if half of her is missing.
- `00t_i2_p2.jpg` — 9:16 — Macro detail: the halo ring snapped clean in two above her white bob hair, blue-green arc electricity jumping across the break, raindrops flashing into steam on the hot metal.
- `00t_i2_p3.jpg` — 9:16 — @Yuki up on one knee in the mud, the katana ZERO still in her fist, staring at her own hand as if it belongs to a stranger — the sword she cannot remember earning; low angle, sodium-orange floodlight behind her.
- `00t_i3_p1.jpg` — 1:1 — Three scavengers in welded scrap armor and gas masks wading through the mud toward the camera, crowbars and cutting torches raised, infrared lenses glowing pink through the rain; predatory and hungry.
- `00t_i3_p2.jpg` — 1:1 — @Yuki mid-lunge, katana ZERO swinging in a wide arc, a small unsettling smile on her face, motion lines and rain trails; scrapyard behind her.

### 00-T — outro *(2 trang · 5 panel)*
- `00t_o1_p1.jpg` — 3:2 — Wide shot ten minutes later: @Yuki standing alone and breathing hard among felled scavengers, weapon lowered, mud around her stained dark; drained, faintly confused by what her own body just did.
- `00t_o1_p2.jpg` — 3:2 — @Ash crouched close, appraising the broken halo the way an auditor reads a ledger, cigarette in her lips, one eyebrow raised; she is pricing it, not worrying about it.
- `00t_o1_p3.jpg` — 3:2 — @Kai grabbing his sister's sleeve, half-panicked half-grinning, gesturing at @Yuki with his free hand; he is arguing and enjoying arguing.
- `00t_o2_p1.jpg` — 1:1 — @Yuki from a low angle looking straight at the twins, rain streaming down her face, one finger raised toward the cracked ring above her own head; blunt, direct, no self-pity.
- `00t_o2_p2.jpg` — 1:1 — @Ash arms crossed, chin tipped toward the distance where furnace glow stains the fog orange; @Yuki small in frame behind her, already deciding to follow.

### 07-A · CỔNG BÃI XE — intro *(3 trang · 8 panel)*
- `07a_i1_p1.jpg` — 1:1 — @Ronin in his underground scrap garage, arms folded, steel katana leaning at his hip, sizing @Yuki up across a workbench of stripped parts; hanging worklights, burnt-oil haze.
- `07a_i1_p2.jpg` — 9:16 — @Muzzle filling the garage doorway, dented car door held as a shield, yellow goggles catching the light; immovable, silent.
- `07a_i1_p3.jpg` — 9:16 — @Kai grinning and holding up two fingers like he is reciting rules, cigarette smoke curling; leaning far too close to the camera.
- `07a_i2_p1.jpg` — 1:1 — @Yuki tilting her head, fingertips on her own cheek, genuinely checking whether she is smiling; soft lamp light, an expression that is almost childlike and slightly wrong.
- `07a_i2_p2.jpg` — 9:16 — @Ash leaning on a wall, katana over her shoulder, deadpan stare straight down the lens.
- `07a_i2_p3.jpg` — 9:16 — The truck-yard gate at night from @Yuki's point of view: two knots of scavengers waiting between crushed cars under a buzzing floodlight, tall vertical framing, rain drifting.
- `07a_i3_p1.jpg` — 1:1 — @Rigger walking out of the dark toward the gate, unhurried, hands loose, a pack of scavengers fanned out behind him in sodium haze; the coil of steel cable across his chest and the winch rig on his back read clearly. Low camera looking up at him.
- `07a_i3_p2.jpg` — 9:16 — @Yuki in close-up lit hard from below by orange floodlight, head slightly lowered, unreadable; the cracked halo throws a single spark.
- `07a_i3_p3.jpg` — 9:16 — @Ash stepping in front of @Yuki, hand closing on her katana grip, cigarette clenched in her teeth, glaring off-panel; in the foreground a heavy steel hook on a chain drags across wet concrete.

### 07-A — outro *(2 trang · 5 panel)*
- `07a_o1_p1.jpg` — 1:1 — Looking up past the gate lamps: a Canticle scout drone descending out of the toxic fog, its red scanning beam stopping dead on @Yuki below; she is small, pinned by the light.
- `07a_o1_p2.jpg` — 1:1 — @Kai leaping with his blade already through the drone's housing, sparks and shattered lens fragments spraying; violent, gleeful.
- `07a_o2_p1.jpg` — 1:1 — Close-up of @Yuki holding a scorched shard of drone casing, a laser-etched "07" glowing on it, her reflection warped in the metal; the number lands on her like a verdict.
- `07a_o2_p2.jpg` — 9:16 — @Ash looking at the shard, jaw tight, cigarette forgotten; for once the appraisal on her face is not about money.
- `07a_o2_p3.jpg` — 9:16 — @Ronin in the garage doorway with his back half-turned, giving the order without looking back; finality.

### 07-B · LÒ ĐÚC — intro *(3 trang · 8 panel)*
- `07b_i1_p1.jpg` — 1:1 — Establishing the abandoned foundry: a cathedral of dead machinery deep underground, a river of molten slag running white-hot through the middle, catwalks and chains overhead, everything else pitch black.
- `07b_i1_p2.jpg` — 1:1 — @Foreman seated on a heap of furnace slag like a throne, enormous in welded slag-plate armor, giant industrial tongs glowing red in his fist, molten light from below carving his scarred face.
- `07b_i2_p1.jpg` — 1:1 — The furnace door swinging open: a wall of white heat blasting out, @Yuki, @Ash and @Kai all forced back a step, arms up, silhouetted against the glare.
- `07b_i2_p2.jpg` — 9:16 — Two-shot: @Yuki in profile facing the fire, @Ash beside her holding the broken halo in industrial pliers; @Ash is quoting a price, not comforting her.
- `07b_i2_p3.jpg` — 9:16 — @Kai looking sideways at his sister with a knowing smirk — he has caught her worrying; @Yuki behind him, already nodding at the fire.
- `07b_i3_p1.jpg` — 9:16 — @Yuki stepping to the very lip of the crucible, heat rippling the air, chin up; the flames wash her white armor orange.
- `07b_i3_p2.jpg` — 9:16 — @Foreman rearing up, tongs swinging wide, mouth open in a laugh; the slag river behind him.
- `07b_i3_p3.jpg` — 1:1 — @Ash and @Kai side by side, both pulling their blades; @Kai yelling, @Ash saying nothing. Keep both heads in the upper third — the shout balloon sits mid-frame.

### 07-B — outro *(3 trang · 8 panel)*
- `07b_o1_p1.jpg` — 1:1 — @Foreman face-down and still in the foreground, the furnace still roaring behind; @Ash braced at the crucible lip, pliers holding the broken halo directly into the white fire, sparks streaming back over her arms.
- `07b_o1_p2.jpg` — 9:16 — MEMORY, cold violet-white palette: a sterile white chamber with no shadows, @Yuki strapped to a metal chair, a speaker grille in the ceiling; sickeningly clean, no dirt anywhere.
- `07b_o1_p3.jpg` — 9:16 — MEMORY: a gloved hand descending toward the crown of her head, and behind it the blurred figure of a woman wearing a glowing RED halo; the red ring is the only warm colour in frame.
- `07b_o2_p1.jpg` — 1:1 — MEMORY: the same hand, but it does not press the button — it closes on the woman's own red halo instead. Extreme close-up of knuckles and a ring already cracking.
- `07b_o2_p2.jpg` — 9:16 — MEMORY: the red ring breaks, then @Yuki's white ring breaks, then the floor plates split open beneath the chair; debris falling, the white room dropping away upward.
- `07b_o2_p3.jpg` — 9:16 — Back in the foundry: @Yuki on her knees on the steel floor, still gripping the glowing-hot ring in her bare hand, steam rising off her fingers, eyes wide with the shock of a stolen memory coming back.
- `07b_o3_p1.jpg` — 1:1 — @Foreman dying against the slag heap, blood at his mouth, laughing up at the ceiling and pointing a thick finger toward the vents where firelight is escaping.
- `07b_o3_p2.jpg` — 1:1 — @Ash and @Kai side by side watching the furnace glow climb the shaft, both trying to look unbothered and both failing; @Kai glances at his sister, @Ash does not glance back.

### 07-C · HÀNG RÀO TẬP ĐOÀN — intro *(3 trang · 7 panel)*
- `07c_i1_p1.jpg` — 1:1 — The Canticle perimeter where the slum ends and the Tower's foundation begins: spotless white plating, frosted glass, violet light slits, hovering drones — and the filthy scrapyard stopping dead at a painted line.
- `07c_i1_p2.jpg` — 1:1 — @Archon activating: a huge semicircular white-and-graphite security fortress unfolding on four heavy mechanical legs, a single violet lens sweeping the group, holographic barrier lines snapping into place.
- `07c_i2_p1.jpg` — 1:1 — @Psalm stepping out of the dark: tall, white-haired, cracked red halo, chrome right shoulder, black-and-red coat covered in paper talismans, red lantern swinging from its chain; utterly calm.
- `07c_i2_p2.jpg` — 9:16 — @Kai leaning toward @Ash, stage-whispering behind his hand, eyes fixed greedily on the red ring; comic relief in a lethal moment.
- `07c_i2_p3.jpg` — 9:16 — @Ash silencing him with a flat look; behind them @Muzzle plants the car door across the retreat path.
- `07c_i3_p1.jpg` — 1:1 — @Yuki and @Psalm in the same frame for the first time, half a metre apart, neither looking away; the white ring and the red ring at the same height.
- `07c_i3_p2.jpg` — 1:1 — @Archon's violet lens filling the frame, gun ports opening around it, heat blooming.

### 07-C — outro *(4 trang · 9 panel)*
- `07c_o1_p1.jpg` — 1:1 — @Archon dead and smoking, a ragged hole blown through the pristine perimeter fence, filthy orange light pouring in through it from the Bottom side.
- `07c_o1_p2.jpg` — 1:1 — @Psalm in close-up telling it flat, no apology anywhere in her face; behind her, ghosted in the smoke, a suggestion of a long queue of identical halo rings.
- `07c_o2_p1.jpg` — 1:1 — @Yuki facing her, fists at her sides, demanding an answer; the anger is quiet, which is worse.
- `07c_o2_p2.jpg` — 1:1 — @Psalm looking away toward a drain grate in the ground, lantern light falling down through the bars into the dark below.
- `07c_o3_p1.jpg` — 1:1 — @Yuki laying the flat of her blade on @Psalm's shoulder beside her neck; nobody moves to stop her; the whole panel is still.
- `07c_o3_p2.jpg` — 9:16 — @Psalm's face in close-up, eyes open, chin slightly lifted into the blade — offering, not pleading.
- `07c_o3_p3.jpg` — 9:16 — @Kai stepping in with one hand raised, every trace of joking gone; the only time he looks his age.
- `07c_o4_p1.jpg` — 1:1 — @Ash pointing down at the drain grate, explaining what lives below; distaste and old fear on her face.
- `07c_o4_p2.jpg` — 1:1 — @Psalm walking half a step behind the group as they leave through the breach, lantern low; accepted, not forgiven.

### 07-D · NHÀ THỜ DƯỚI CỐNG — intro *(2 trang · 4 panel)*
- `07d_i1_p1.jpg` — 1:1 — The sewer cathedral: drainage pipes welded into a colossal pipe organ, an altar built from broken android shells, hundreds of red candles, black water ankle-deep and mirror-still.
- `07d_i1_p2.jpg` — 1:1 — @MotherRust rising from the altar in rust-coloured rags and scrap jewellery, a halo welded from pipe sections above her, arms opening in welcome; devotion and appetite in the same expression.
- `07d_i2_p1.jpg` — 1:1 — @Yuki drawing steel in the candlelight, reflections of a hundred flames sliding down the blade; no fear at all.
- `07d_i2_p2.jpg` — 1:1 — @Psalm lifting her lantern to reveal three ranks of hollow-chested cultists standing motionless in the water; @Kai visibly regretting every life choice.

### 07-D — outro *(4 trang · 9 panel)*
- `07d_o1_p1.jpg` — 1:1 — @MotherRust seated against the altar base, not fleeing, dragging a grease-stained leather ledger into her lap; candle stubs guttering around her.
- `07d_o1_p2.jpg` — 1:1 — MEMORY, six years ago: Floor Four collapsing — an entire city level folding downward into a canyon of dust and snapped rebar, tiny falling silhouettes.
- `07d_o2_p1.jpg` — 1:1 — MEMORY: a column of spotless white Canticle trucks crawling into the slum three days later, floodlights sweeping the rubble, orphaned children being lined up.
- `07d_o2_p2.jpg` — 1:1 — MEMORY: an eleven-year-old girl planted in front of the lead truck's grille, holding her dead father's rusted sword in both hands, mouth moving on a counting rhyme; the headlights swallow her.
- `07d_o3_p1.jpg` — 1:1 — Present: extreme close-up of @Yuki's eye as the memory breaks through — reflected in it, dust, a hand, a white truck.
- `07d_o3_p2.jpg` — 9:16 — MEMORY: a man in a white uniform with a golden halo crouching to eye level with the child, one gloved finger pointing straight at her face; his expression is polite and completely empty.
- `07d_o3_p3.jpg` — 9:16 — Present: @Yuki saying the name out loud for the first time, tears she has not noticed, hand tightening on her weapon.
- `07d_o4_p1.jpg` — 1:1 — @Kai and @Ash lit from below by red candlelight; @Kai stunned, @Ash staring at the black water with her jaw locked — the first crack in her armour all chapter.
- `07d_o4_p2.jpg` — 1:1 — @MotherRust pointing a thin arm past the altar at a rusted freight shutter; beyond it, cable drums and a shaft going straight up forever.

### 07-E · THANG MÁY HÀNG — intro *(4 trang · 9 panel)*
- `07e_i1_p1.jpg` — 1:1 — The colossal cargo lift: a steel deck the size of a street, cable drums the height of a house, violet light falling from above and rust-orange light rising from below; on each passing floor a rank of identical Choir soldiers waiting in the dark.
- `07e_i1_p2.jpg` — 1:1 — @Cantor descending into frame among his ranks, gaunt, white uniform without a speck of dust, golden halo blazing; he looks at the camera the way a surgeon looks at an infection.
- `07e_i2_p1.jpg` — 1:1 — @Yuki alone at the centre of the deck, head bowed, eyes closed; around her the air fills with faint overlapping ghost-images of everyone who ever put a price on her.
- `07e_i2_p2.jpg` — 9:16 — Split memory panel, rust palette: @Rigger's hook swinging on its chain, and @Foreman's glowing tongs closing — two grips reaching for the same person.
- `07e_i2_p3.jpg` — 9:16 — Split memory panel: @Archon's violet lens, and @MotherRust's outstretched hands full of candle wax — cold light and warm light wanting the same thing.
- `07e_i3_p1.jpg` — 1:1 — @Yuki's eyes opening; she takes one step forward and drags her blade tip along the steel deck, throwing a line of sparks between herself and @Cantor.
- `07e_i3_p2.jpg` — 9:16 — @Psalm beside her, lantern raised, red halo catching the light, looking up at her old master with absolute calm.
- `07e_i3_p3.jpg` — 9:16 — @Ash and @Kai back to back, counting floors as the lift plunges; @Ash grim, @Kai shouting with a huge idiot grin.
- `07e_i4_p1.jpg` — 1:1 — @Cantor lifting one hand, and the entire rank of Choir behind him moving in a single synchronised motion.
- `07e_i4_p2.jpg` — 1:1 — @Yuki exploding into a full sprint straight down the middle of the deck, the first word already out of her mouth; extreme motion blur, sparks, violet light. *(Sprite `07e_i4_p2_fg.png` cũ đã bỏ khỏi `js/story.js` khi panel có art riêng.)*

### 07-E — outro *(7 trang · 14 panel)*
- `07e_o1_p1.jpg` — 1:1 — Wide and silent: @Cantor standing with a long diagonal cut opened across his chest — and no blood anywhere, only a thin plume of vapour; @Yuki frozen mid-follow-through behind him.
- `07e_o1_p2.jpg` — 9:16 — Inside the wound: severed fibre-optic bundles, blue-green coolant welling out, a small circuit board still blinking steadily; horribly tidy.
- `07e_o1_p3.jpg` — 9:16 — @Cantor's face in close-up, half the synthetic skin sagging and melting off the jaw, the mouth still forming perfect words; a speaker grille visible where his throat should be.
- `07e_o2_p1.jpg` — 1:1 — Cut to the top of the world: a panoramic apartment in District 01, city lights far below through floor-to-ceiling glass, a man's hand setting a wine glass down beside a wall of monitors — one monitor showing the lift deck from above.
- `07e_o2_p2.jpg` — 1:1 — @Yuki looking up the shaft toward that unreachable light, exhausted, blade hanging, but her expression finally clear; she is not lost any more.
- `07e_o3_p1.jpg` — 1:1 — @Psalm and @Ash on either side of frame, both looking upward; @Psalm sombre, @Ash already doing arithmetic on a thousand halos.
- `07e_o3_p2.jpg` — 1:1 — @Kai yelping at his sister; @Ash flicking ash off her cigarette without looking at him.
- `07e_o4_p1.jpg` — 9:16 — @Kai crouched with a battered notebook on his knee and a stub of pencil, writing fast; the most serious he has looked all chapter.
- `07e_o5_p1.jpg` — 3:2 — @Muzzle arriving out of the pipe mouth dragging a fresh dented car door behind him, sparks where the metal scrapes; the old shield strapped across his back is snapped in half.
- `07e_o5_p2.jpg` — 3:2 — @Ronin stepping onto the deck, sheathing a freshly sharpened steel katana, red mask light steady; he has clearly been deciding this the whole chapter.
- `07e_o5_p3.jpg` — 3:2 — Two-shot: @Ronin giving the order, @Yuki answering him; the first order she has ever taken because she chose to.
- `07e_o6_p1.jpg` — 9:16 — Hero shot from below: @Yuki at the leading edge of the rising lift deck, coat and white hair streaming, the crew behind her in silhouette, violet Tower light pouring down over all of them; the cracked halo above her head catches the light like a crown.
- `07e_o7_p1.jpg` — 9:16 — Title card: the freight lift shrinking upward into the violet glare of the Tower, seen from the very bottom of the shaft, no people; leave the middle of the frame empty for the chapter-end text.

---

## 3. Sau khi có ảnh

**Dùng `scratch/comic_import.py` thay vì cắt tay.** Script làm ba việc theo thứ tự: cắt dải viền phẳng hai bên (ảnh bố cục dọc hay bị chèn hai dải tối vào khung 16:9) → cắt về **đúng tỉ lệ ô panel sẽ hiển thị** → đẩy khung cắt tránh **dấu Gemini** ở góc phải dưới (đo được ở `x 1252–1312, y 640–700` trên khung 1376×768; cắt hẳn chứ không tô đè). Sửa bảng `JOBS` ở đầu file rồi chạy:

```bash
python scratch/comic_import.py
```

**Vì sao phải cắt đúng tỉ lệ:** css `.panel.has-art .panel__img` **bỏ `pos`/`zoom`** và ép `object-position:50% 50%` — ảnh vẽ riêng bị cắt giữa một cách mù quáng, không chỉnh được từ `js/story.js`. Tỉ lệ ô đo thật ở 375×812: `v2` **0.997** · `w3` ô rộng **0.93** · `w3` ô nhỏ **0.52** · `w3b` ô dọc **0.52**, ô rộng **0.93** · `h2` **0.26** · `v3` **1.51** · `splash` **0.52**.
`w3b` là bản lật của `w3` — **hai ô dọc ở trên, một ô rộng ở dưới**; dùng khi trang có hai tấm dọc rồi mới tới một tấm ngang/vuông.
**`h2` (0.26) hầu như không dùng được**: nó là hai cột dọc cực hẹp, ảnh 0,563 vào đó mất 54% bề ngang — có hai người đứng cạnh nhau là mất hẳn một. Gặp `h2` thì đổi sang `v2` hoặc `w3b`. (Số trong §1 là bản đo cũ, lệch vài phần trăm — dùng bảng này.)

**Art khổ ngang thì đừng nhét vào ô dọc.** `h2` và ô nhỏ của `w3` là cột dọc 0,26–0,52; ảnh 16:9 vào đó chỉ còn 26–31% bề ngang. Đổi layout trang sang `v2` (hai ô ngang xếp chồng) rẻ hơn nhiều so với vẽ lại ảnh — đã làm thế cho 00-T trang 3.

**Sửa chữ thì dùng `docs/comic-text.md`** — toàn bộ 178 bong bóng của 40 trang nằm một chỗ, sửa xong đẩy ngược vào game:

```bash
node scratch/comic_text_dump.js    # game → file md
node scratch/comic_text_apply.js   # file md → game (có --dry để xem trước)
```

**Panel đã có art riêng thì bỏ `fg` trong `js/story.js`**, không thì sprite nhân vật vẽ chồng lên art (lớp `fg` không tự tắt khi có `has-art`).

**Sửa chữ xong phải quét lại chồng lấn bong bóng.** Chữ dài thêm vài từ là đủ để hai khối đè lên nhau — và ô panel co theo chiều cao màn, nên quét ở **hai khổ**: 375×812 (iPhone thường) và **375×667 (iPhone SE — khổ thấp nhất còn phổ biến, là khổ hay vỡ)**.

```js
// dán vào console khi game đang mở
await fetch('scratch/comic_overlap.js').then(r=>r.text()).then(eval)
await comicOverlap()                       // hoặc comicOverlap(['07-C','07-D'])
```

Panel nào báo lỗi thì thêm **`stack:true`** (hoặc **`stack:'end'`** — dồn cả cột xuống đáy ô, chừa nửa trên cho tranh, dùng khi mặt nhân vật nằm ở 1/3 trên khung) vào panel đó trong `js/story.js`: bong bóng chuyển từ neo tuyệt đối sang **xếp cột**, `at` chỉ còn quyết định lệch trái/giữa/phải, và các khối *không thể* đè nhau nữa. Neo `c` là thủ phạm thường gặp nhất vì nó luôn căn giữa 50% bất kể khối bên dưới cao bao nhiêu. Chữ tượng thanh (`bang`) vẫn neo tự do — nó trong suốt, cố tình đè lên tranh.

`stack:true` chống đè nhưng **không tạo thêm chỗ**: nếu tổng chiều cao chữ vượt quá ô thì phải nới ô — đổi layout sang `v3`/`v2`, hoặc tách trang. Ô nhỏ `w3` (176px) chứa được ~2 khối ngắn; một dải `v3` (359×189 ở màn 667) chứa được ~2 khối; ô `v2`/`w3` rộng chứa được 3 khối.

1. Đặt file vào `art/comic/` đúng tên. Không cần sửa `js/story.js` (đường dẫn được sinh tự động từ sector + trang + panel).
2. Mở game, vào sector, xem trang: ảnh phải nằm dưới bong bóng; nếu chủ thể bị bong bóng che thì đổi `at` của bong bóng trong `js/story.js` (tl/tr/bl/br/t/b/c) hoặc đổi `pos` để cắt ảnh khác đi.
3. Panel có `sil` (silhouette kẻ địch) sẽ tự ẩn silhouette khi có ảnh riêng.
