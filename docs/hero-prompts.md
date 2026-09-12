# CHROMEFALL — Prompt art 10 nhân vật gacha chưa có ảnh

Mười người này (`HERO_EXTRA` trong `js/data.js`) có đủ lore, chỉ số, đòn thường, chiêu cuối và nội tại, nhưng **chưa có một
tấm ảnh nào**: không ảnh thẻ, không ảnh bán thân, không sprite trận. Quay trúng ai trong bể gacha thì ra sân là một bóng đen
có chữ NO SPRITE.

| | Phe | Bậc | ATK / HP | SPD | Chiêu cuối |
|---|---|---|---|---|---|
| **VESPER** | Chrome | S | 150 / 900 | 110 | EVENSONG — 180% ATK toàn bộ địch |
| **NYX** | Chrome | S | 140 / 1000 | 106 | BLACKOUT — 340% ATK một mục tiêu |
| **HALO** | Chrome | A | 115 / 1150 | 92 | WARD ROUND — hồi 140% ATK cả đội |
| **CIPHER** | Chrome | A | 125 / 950 | 100 | ROOT ACCESS — điều khiển một địch một lượt |
| **MERIDIAN** | Chrome | B | 85 / 1450 | 78 | LAST SHIFT — hồi 100% ATK cả đội |
| **TOLL** | Rust | S | 155 / 850 | 98 | PAID IN FULL — 360% ATK một mục tiêu |
| **SPARK** | Rust | A | 125 / 950 | 104 | ARC FLASH — 140% ATK toàn bộ địch |
| **VIXEN** | Rust | A | 135 / 900 | 114 | HEIST — điều khiển một địch một lượt |
| **JUNKER** | Rust | B | 75 / 1700 | 76 | FULL LOAD — 260% ATK một mục tiêu |
| **GRAVEDIGGER** | Rust | B | 90 / 1500 | 74 | LAST RITES — 300% ATK một mục tiêu |

Lore đầy đủ: `docs/characters.md`. Thuật ngữ và vũ khí: `docs/glossary.md`. Quy cách sprite nền xanh: `docs/enemy-prompts.md` §2.

> **★ Chỗ tôi tự đề xuất.** Lore không tả ngoại hình mười người này, nên tạo hình dưới đây là đề xuất của tôi, bám vào nghề
> nghiệp và câu chuyện của từng người. Mọi chi tiết đánh dấu ★ là do tôi nghĩ ra (chủ yếu là **vũ khí**, vì trong lore sáu
> người không có vũ khí nào được nhắc tên). Sinh ảnh xong là tạo hình chốt luôn — xem qua mục 7 trước khi chạy, chỗ nào
> không ưng thì nói, tôi sửa prompt.

---

## 1. Mỗi người cần mấy ảnh

| # | Ảnh | File đích | Khổ | Cần không |
|---|---|---|---|---|
| 1 | **Ảnh thẻ** (key art toàn thân, **có bối cảnh**) | gốc `art-src/CARD/<id>.png` → game `art/card/<id>.jpg` | sinh ở dọc 1536×2720; bản game hạ còn ngang 1152 | **bắt buộc** — mở khoá 4 chỗ cùng lúc |
| 2 | Ảnh bán thân | `art/card/<id>_portrait.jpg` | tự cắt từ (1) | tôi cắt bằng script, bạn không phải sinh |
| 3 | **Sprite đứng** (toàn thân, **nền xanh**) | `art/sprite/<id>_idle.png` | dọc, cạnh dài ≥ 1024 | **bắt buộc để ra trận** |
| 4 | Sprite `attack` / `crit` / `hurt` / `die` | `art/sprite/<id>_<pose>.png` | như (3) | nên có — thiếu thì engine tự dùng lại pose gần nhất |
| 5 | Ảnh mở rương | `art/reveal/<id>_reveal.jpg` | ngang 1280×720 | tuỳ chọn — thiếu thì gacha lật ra ảnh thẻ |
| 6 | Video chiêu cuối | `video/<id>_ult.mp4` | 1280×720 | để sau, `docs/ult-prompts.md` |

Một ảnh thẻ (1) là đủ để người đó **hết bóng đen ở mọi màn hình ngoài trận**: mặt thẻ gacha, hàng chọn đội ở SQUAD,
hồ sơ ở ARCHIVE, và chân dung người nói nếu sau này họ có thoại trong comic. Nhưng ảnh thẻ **không dùng làm sprite được**
(có nền, có bóng đổ, cỡ người không khớp hộp 682) — sân đấu vẫn cần ảnh nền xanh riêng ở (3).

**Thứ tự nên làm:** 10 ảnh thẻ trước (một buổi) → 10 sprite đứng → pose thêm. Làm xong bước 1 là lọc được bể gacha
theo art (việc K12) mà không phải cắt ai khỏi bể.

---

## 2. Quy cách ảnh thẻ

| Mục | Giá trị | Vì sao |
|---|---|---|
| Khổ | **1536×2720** (dọc, ~9:16). Yuki 1536×2752, tám người kia 1536×2720 | để cạnh nhau trong SQUAD cho đều |
| Định dạng | PNG hoặc JPG chất lượng cao — tôi sẽ nén lại | bản gốc 5–9 MB, tôi cắt ra `_portrait.jpg` ~300 KB rồi cất bản gốc vào `art-src/HERO/` |
| Nội dung | **một người, toàn thân, đứng, có bối cảnh phía sau** | khác sprite: thẻ là tranh có cảnh, sprite là hình cắt rời |
| Bố cục dọc | đỉnh đầu cách mép trên **4–8%**, ngang hông rơi vào khoảng **38–42%** chiều cao, bàn chân gần mép dưới | ảnh bán thân cắt đúng dải trên (0,375–0,424 chiều cao) — hông thấp quá thì mặt bị nhỏ |
| Bố cục ngang | chủ thể trong **dải giữa 75%** bề ngang | khung thẻ 3:4 hẹp hơn ảnh, nó **cắt hai bên** chứ không cắt trên dưới |
| Ánh sáng | nền tối, viền sáng theo màu phe; mặt phải sáng hơn nền | ở cỡ thẻ (176 px) người chơi chỉ đọc được bóng ngoài + một điểm màu |
| Cấm | chữ, logo, khung, chú thích, hai người, chibi | game vẽ tên và bậc đè lên thẻ |

### Prompt chung (dán trước mỗi prompt riêng ở mục 7)

```
Full-body character key art of a single character for a cyberpunk anime RPG, vertical 9:16 poster composition.
The character stands facing the viewer in a relaxed ready pose, head near the top of the frame, feet near the
bottom edge, whole body visible, centered in the middle 75% of the width.
Behind them, a dark cyberpunk environment with real depth, dimmer than the character.
3D CG anime key visual, cinematic rim lighting, high contrast, dense believable mechanical detail,
clean readable silhouette. No text, no logo, no frame, no caption.
```

Rồi thêm đúng một dòng màu theo phe:

```
Palette: Chrome faction — cold white #DCE6F7 and graphite, violet #7C4DFF glow on lenses, halo rings and light slits, near-black background #06070A.
```
```
Palette: Rust faction — rust-orange #E2703A, burnt steel, soot and dirty concrete grey, acid-green #C9D830 accents, warm sodium light, near-black background #06070A.
```

### Negative prompt

```
text, letters, watermark, logo, UI, frame, border, two characters, duplicate, crowd, cropped head,
cropped feet, cut off limbs, extra limbs, extra fingers, chibi, blurry, low contrast, soft focus,
bright saturated rainbow colors, flat lighting, empty white background
```

---

## 3. Quy cách sprite trận (nền xanh)

Giống hệt kẻ địch (`docs/enemy-prompts.md` §2), **trừ hướng nhìn**:

| Mục | Giá trị |
|---|---|
| Nền | một màu phẳng xanh lá `#00FF00`; ai có chi tiết xanh lá (Spark có đèn xanh axit) thì dùng magenta `#FF00FF` |
| Hướng | **quay sang PHẢI khung** — đội mình đứng nửa trái sân, nhìn về phía địch (địch thì quay trái) |
| Tư thế | đứng thủ, vũ khí cầm sẵn, **không vung**; thấy rõ hai bàn chân |
| Cấm | bóng đổ, mặt sàn, cảnh nền, chữ, khung |
| Khổ | dọc, cạnh dài ≥ 1024 px (1536×2048 là đẹp) |
| Tên file nguồn | `art-src/HERO/<id>.png` (pose thêm: `<id> normal.png`, `<id> crit.png`, `<id> hurt.png`, `<id> die.png`) |

### Prompt chung sprite

```
Full-body character art of a single character for a cyberpunk turn-based RPG battle sprite.
Standing idle in a braced ready stance, weapon held ready, not swinging.
Three-quarter view angled toward the viewer's RIGHT, whole body in frame, feet flat and fully visible.
Flat solid green #00FF00 background, nothing else: no floor, no ground plane, no cast shadow,
no scenery, no text, no logo, no frame.
3D CG anime key visual, clean rendering, high contrast, dense mechanical detail,
strong readable silhouette that stays clear at small size.
```

Negative: dùng lại khối negative ở mục 2, thêm `floor, ground, cast shadow, scenery, gradient background`.

**Tách nền** (tôi chạy, hoặc bạn chạy rồi đưa tôi số):

```bash
python scratch/key_enemy.py art-src/HERO --only vesper
```

Script tự khớp cỡ người với đồng đội, neo chân vào đáy hộp 744×682, in ra `box` để dán vào `HERO_SPRITE` (`js/data.js`).

---

## 4. Luật silhouette — mười người phải khác nhau từ xa

Trên sân mỗi người chỉ rộng 84–160 px. Ở cỡ đó chỉ còn **bóng ngoài + một điểm sáng màu**. Bảng dưới là thứ giữ cho mười
người không lẫn vào nhau (và không lẫn với chín người đã có):

| | Chiều cao | Bóng ngoài nhận ra nhờ | Điểm sáng |
|---|---|---|---|
| VESPER | như Yuki | đuôi tóc dài + **vòng Halo còn nguyên** + kiếm tra vỏ ngang hông | tím lạnh |
| NYX | như Yuki | **ngàm Halo rỗng** chìa hai chấu trên đầu + gậy dài | mắt trắng xanh |
| HALO | hơi thấp | tay găng dài quá khuỷu + **đoạn xích ở cổ chân** + chuỗi vòng nhỏ ở hông | vệt sáng trên thân |
| CIPHER | trung bình | **máy pha cà phê đeo sau lưng** + cửa sổ mã lơ lửng | tím trên hologram |
| MERIDIAN | cao nhất nhóm | **vai vuông gấp đôi** + tấm tường gập sau lưng | hai khe mắt ấm |
| TOLL | cao, gầy | **móc cẩu treo xích** vắt vai + cuốn sổ dày bên hông | cam sodium |
| SPARK | thấp nhất | **balo tụ điện** + hai sợi cáp cong ra hai bên | xanh axit |
| VIXEN | thấp, gọn | **chuỗi mười một vòng Halo** đeo chéo + cuộn dây leo | cam nhạt |
| JUNKER | rộng nhất | **nửa dưới là khung xe kéo có bánh** | một đèn pha |
| GRAVEDIGGER | cao, khòm | **xẻng dài** + chồng tấm thép buộc sau lưng | không có, tối |

Kiểm nhanh: tô ảnh thành một mảng đen, còn đoán được là ai thì đạt.

---

## 5. Mẹo tiết kiệm

Năm người phe Chrome (Vesper, Nyx, Halo, Meridian) đi chung một bộ xương giáp Choir — vẽ **Vesper** cho thật đẹp trước,
rồi image-to-image (denoise 0,5–0,6) đổi phần mô tả để ra Nyx và Halo; Meridian phải vẽ riêng vì khung to gấp rưỡi.
Cipher là **người thường không cấy ghép**, vẽ riêng. Năm người phe Rust khác nghề nhau hoàn toàn, không đẻ biến thể được.

---

## 6. Ăn khớp với các doc khác

Dòng **Nhận diện** trong mục 7 viết đúng định dạng của `docs/comic-prompts.md` §1 — sinh ảnh xong, dán y nguyên dòng đó
vào prompt panel comic nếu người đó xuất hiện, để tạo hình không trôi. Sửa một bên thì sửa cả hai bên.

---

## 7. Prompt từng người

Ghép: **prompt chung (mục 2 hoặc 3) + dòng màu theo phe + khối riêng bên dưới**.

---

### VESPER — Em cùng lô · Chrome · S · rate-up

Ra lò cùng lô với Yuki, được giao vị trí của Yuki trong đội hình Choir sau khi chị rơi, và làm tốt hơn. Halo chưa từng
trễ lệnh một giây. Hỏi han đối thủ vài câu trước khi ra tay, thật lòng.

**Ý đồ tạo hình:** là Yuki nếu Yuki không bao giờ hỏng — cùng bộ giáp, cùng lô, nhưng mọi thứ còn nguyên và sạch bong.
Yuki có tóc bob + tai mèo máy + Halo gãy toé lửa; Vesper có **tóc đuôi ngựa dài** + **Halo tròn nguyên vẹn sáng đều** +
không tai mèo. ★ Vũ khí: cùng kiểu katana nhưng là bản Choir tiêu chuẩn còn tra trong vỏ trắng, số lô khắc ở chuôi.

**Nhận diện (dán vào prompt comic):**
```
Vesper — young android soldier, the same production lot as Yuki: white Choir armor with violet accents,
white cybernetic legs, but everything pristine and undamaged; long white ponytail, no cat-ear headgear,
a perfect unbroken violet halo ring floating above her head, standard-issue Choir katana still in its white
sheath at her hip, polite gentle expression
```

**Prompt thẻ:**
```
Vesper stands at attention in a pristine white Canticle corridor, frosted glass and violet light slits behind her,
faint violet holographic outlines of three more soldiers holding formation in the depth of the corridor.
Young android woman, pristine white Choir armor with violet trim, white cybernetic legs, long white ponytail,
a perfect unbroken violet halo ring floating above her head, standard-issue katana in a white sheath at her hip,
one hand resting on the sheath, polite gentle expression, head slightly tilted.
```

**Sprite:** đứng thủ, tay trái giữ vỏ, tay phải đặt trên chuôi (tư thế rút kiếm) — chưa rút. `crit` = đã rút, lưỡi ngang mặt.

---

### NYX — Nguyên mẫu không Halo · Chrome · S

Canticle làm ra cô để trả lời câu hỏi "lính Choir không đội Halo thì làm gì", rồi nhốt cô bốn năm dưới hầm hồ sơ vì cô
không nổi loạn cũng không vô dụng — cô hỏi. Hiểu mọi lời theo nghĩa đen.

**Ý đồ tạo hình:** thứ đập vào mắt là **cái vòng không có ở đó**. Trên đầu cô là một cái ngàm kim loại rỗng hai chấu —
chỗ đáng lẽ gắn Halo. Giáp Choir nhưng màu than xỉn, không phải trắng: cô là bản không lên dây, không ai đánh bóng cho.
Bốn năm dưới hầm để lại: giấy hồ sơ buộc dây ở hông, chân đi giày mềm sờn. ★ Vũ khí: một **gậy đèn cảm biến dài** đã tắt,
cầm hai tay như côn — chiêu BLACKOUT là lúc mọi đèn quanh mục tiêu tắt theo nó.

**Nhận diện:**
```
Nyx — android soldier prototype with NO halo: an empty two-pronged metal mount juts up from her head where the ring
should be; matte graphite Choir armor, never polished, short messy black hair, pale skin, wide pale-blue glowing eyes,
a bundle of paper files tied at her hip, holding a long unlit sensor rod like a staff, literal blank curious expression
```

**Prompt thẻ:**
```
Nyx stands in a flooded underground archive basement, dead fluorescent tubes overhead, walls of paper files
and sealed project crates behind her, her glowing eyes the brightest thing in the frame.
Android woman in matte graphite Choir armor with no halo, an empty two-pronged mount jutting from her head,
short messy black hair, pale-blue glowing eyes, paper files tied at her hip, holding a long unlit sensor rod
like a staff in both hands, head tilted, asking a question.
```

**Sprite:** gậy chống chéo trước người, hai tay. `crit` = quét ngang một vòng, đèn quanh gậy tắt tối lại.

---

### HALO — Y tá của Choir · Chrome · A

Lính máy duy nhất được phép cảm thấy đau, vì đau là cách chẩn bệnh. Bảy năm mang trong người bản sao hàng nghìn vết
thương, không cái nào của cô. Chữa cho bất kỳ ai còn thở, kể cả kẻ vừa bắn mình. Bị bắt lại một lần, bị xích vào lò đúc Halo.

**Ý đồ tạo hình:** một y tá trắng-tím sạch sẽ, nhưng khắp thân có **những đường sáng mờ hình vết thương** — sẹo ánh sáng
của người khác, chạy trên tay, sườn, cổ. Cổ chân còn **một vòng xích bị cắt dở** kéo lê một đoạn ngắn. Trên đai hông treo
một chuỗi Halo nhỏ đã hỏng, mỗi cái là một ca. ★ Không vũ khí: hai bàn tay găng dài quá khuỷu, đầu ngón phát sáng —
chạm vào là biết đau ở đâu, và đánh cũng bằng cách chạm.

**Nhận diện:**
```
Halo — android field nurse of the Choir, slender white-and-violet medical frame, soft violet halo ring,
long white gloves past the elbow with glowing fingertips, faint glowing wound-lines mapped all over her body
that are not her own, a cut shackle and a short length of chain still on one ankle, a strap of small broken
halo rings at her hip, calm attentive expression
```

**Prompt thẻ:**
```
Halo stands inside a Halo foundry: racks of unfinished halo rings glowing violet on both sides, hanging chains,
a cooling vat behind her.
Slender android nurse in a white-and-violet medical frame, soft violet halo ring above her head, long white gloves
past the elbow with glowing fingertips raised as if about to touch someone, faint glowing wound-lines all over her
body, a cut shackle and short chain on one ankle, a strap of small broken halo rings at her hip, calm attentive face.
```

**Sprite:** hai tay hơi nâng ngang ngực, lòng bàn tay hướng ra. `crit` = một tay chạm về phía trước, sáng bùng ở đầu ngón.

---

### CIPHER — Kẻ làm cả khoá lẫn chìa · Chrome · A

Người thường, không Halo, một trong bốn kỹ sư được đọc toàn bộ mã Halo. Ban ngày viết phần mềm cho Canticle, ban đêm bán
cách mở xuống Đáy. Lệnh xoá là do anh viết, và anh cố tình chừa trong đó khoảng trống ba giây. Bỏ Tháp, mang theo đúng một
thứ: máy pha cà phê của phòng nghỉ tập đoàn.

**Ý đồ tạo hình:** người duy nhất trong nhóm **không có mảnh máy nào trên người**. Sơ mi tập đoàn nhàu, thẻ nhân viên vẫn
đeo (chưa gỡ, cũng chưa dám gỡ), khoác hoodie ngoài, mắt thâm quầng, râu vài ngày. Đai kỹ thuật đầy cuộn cáp và đầu nối.
**Máy pha cà phê espresso buộc sau lưng như balo** — đó là bóng ngoài của anh. ★ Vũ khí: một thanh khoá cứng (dongle) to
bằng bàn tay nối cáp, cầm như chìa; quanh anh lơ lửng ba bốn cửa sổ mã hình chìa khoá màu tím.

**Nhận diện:**
```
Cipher — ordinary human man in his late thirties, no implants and no halo, rumpled corporate dress shirt with the
company badge still clipped on, grey hoodie over it, tired shadowed eyes, few days of stubble, technician harness
of cable spools and connectors, a chrome espresso machine strapped to his back like a rucksack, holding a hardware
key dongle trailing a cable, violet key-shaped code windows floating around his hands
```

**Prompt thẻ:**
```
Cipher stands in a squatted server room deep in the underworld: corporate glass wall cracked behind him,
racks rewired with scavenged cable, one warm lamp, his espresso machine plugged into a server rack.
Ordinary human man, no implants, rumpled corporate shirt with badge, grey hoodie, tired eyes, stubble,
technician harness of cable spools, chrome espresso machine strapped to his back, holding up a hardware key
dongle on a cable, three violet key-shaped code windows floating around his hand, wry half-smile.
```

**Sprite:** đứng hơi lệch, một tay giơ dongle, cửa sổ mã nhỏ lơ lửng cạnh vai. `crit` = cắm dongle về phía trước, cửa sổ mã bung ra.

---

### MERIDIAN — Hết hạn sử dụng · Chrome · B

Lính hậu cần chế tạo để tự tắt sau mười năm. Kéo hàng, dựng tường, mười năm chưa từng được giao một trận. Wire tìm thấy
cô ở bãi tái chế đang ngồi đếm to số giờ còn lại, và tháo bộ đếm ra khỏi ngực cô. Cô vẫn đếm bằng miệng. Đứng chắn trước
bất kỳ ai nhỏ hơn mình và gọi cả tổ là con.

**Ý đồ tạo hình:** to nhất nhóm và hiền nhất nhóm. Khung hậu cần trắng ngà **đã ố vàng vì mười năm**, vai vuông rộng gấp
đôi người thường, cánh tay dày. Giữa ngực là **một hốc rỗng nơi bộ đếm bị tháo ra**, dây còn lủng lẳng, viền hốc sáng yếu.
Sau lưng gập **hai tấm tường di động** (mở ra là chiêu LAST SHIFT). Mặt là mặt nạ trơn không miệng với hai khe mắt ấm.
★ Vũ khí: một thanh đòn nâng hàng bằng thép dùng thay gậy.

**Nhận diện:**
```
Meridian — huge logistics android, cream-white frame yellowed with ten years of wear, shoulders twice the width of
a human, thick arms, a smooth faceplate with two warm glowing eye slits and no mouth, an empty socket in the middle
of her chest where a countdown module was removed with loose cables hanging out, two folded barrier panels stowed
on her back, a steel cargo lever held like a staff, protective motherly posture
```

**Prompt thẻ:**
```
Meridian stands in a recycling yard at night, stacked shipping containers and a crane silhouette behind her,
sodium lamps low and warm.
Huge logistics android, cream-white frame yellowed with wear, shoulders twice human width, smooth faceplate with
two warm glowing eye slits, an empty chest socket with loose cables where her countdown module was removed,
two folded barrier panels on her back, holding a steel cargo lever like a staff, standing between the viewer and
something behind her, protective posture.
```

**Sprite:** đứng tấn, thanh đòn chống đất, người hơi nghiêng ra trước như che. `crit` = một tấm tường bung ra nửa chừng.

---

### TOLL — Người thu nợ · Rust · S

Đêm Tầng Bốn sập, Toll trực trên cầu trục bốc hàng, đủ cao để nhìn thấy ba tổ kỹ thuật Canticle cắt trụ đỡ đúng lịch.
Bốn nghìn người ở dưới. Ông chép tên từng người vào sổ rồi đi đòi, mỗi lính Enforcer một dòng, mỗi dòng để lại một tờ
hoá đơn tại chỗ. Lễ phép với tất cả, kể cả người ông sắp giết.

**Ý đồ tạo hình:** ATK cao nhất, HP thấp nhất nhóm — một ông già gầy, cao, chậm rãi, nhưng cầm thứ nặng nhất. Áo khoác dài
bạc màu cam rỉ, sơ mi cài kín cổ, cà vạt cũ thắt ngay ngắn (ông đi đòi nợ, phải ăn mặc đàng hoàng), găng tay công nhân,
kính đọc sách trễ mũi. **Cuốn sổ dày buộc xích vào thắt lưng**, một xấp hoá đơn kẹp túi ngực. ★ Vũ khí: một **móc cẩu hàng
bằng thép nối xích** vắt qua vai — đồ nghề cũ của nghề cầu trục, giờ dùng để đòi nợ.

**Nhận diện:**
```
Toll — tall gaunt elderly man in a faded rust-orange long coat over a buttoned shirt and an old necktie,
work gloves, reading glasses low on his nose, a thick ledger chained to his belt, a stack of paper invoices in
his breast pocket, a heavy steel cargo hook on a chain slung over one shoulder, polite exhausted expression
```

**Prompt thẻ:**
```
Toll stands under a loading gantry crane at night, cable drums and stacked freight behind him, sodium-orange
floodlight from above, a single paper invoice pinned to a crate beside him.
Tall gaunt elderly man in a faded rust-orange long coat, buttoned shirt and old necktie, work gloves, reading
glasses low on his nose, thick ledger chained to his belt, invoices in his breast pocket, a heavy steel cargo hook
on a chain slung over his shoulder, holding the chain in one hand, polite tired face, slight courteous bow.
```

**Sprite:** móc cẩu buông thõng cạnh chân, xích chùng, tay kia giữ sổ. `crit` = móc vung lên quá đầu.

---

### SPARK — Đứa cắt dây Tháp · Rust · A

Canticle cắt điện cả khu của cô sáu tháng sau vụ sập, gọi là cách ly kỹ thuật. Năm ấy cô mười một tuổi, học nối dây bằng
tay trong bóng tối. Giờ cô câu điện thẳng từ trụ Tháp chia cho từng hành lang. Nói nhanh, cười to, gặp ai một phút là đặt
biệt danh — Yuki là Đèn Tuýp, Psalm là Cầu Chì.

**Ý đồ tạo hình:** nhỏ nhất nhóm và ồn nhất nhóm. Thiếu nữ mười sáu mười bảy, tóc ngắn cháy vàng ở ngọn, kính bảo hộ đẩy
lên trán, áo khoác thợ điện quá khổ nhiều túi, băng dính màu quấn cổ tay và mắt cá. **Dàn tụ điện tự chế trên lưng**:
sáu tám ống tụ nối dây, một đồng hồ kim, đèn xanh axit nhấp nháy. Hai tay cầm hai kẹp cá sấu nối cáp, giữa hai kẹp là một
tia điện đang nhảy. Đứng nhón chân, cười toe.

**Nhận diện:**
```
Spark — small teenage girl, short black hair with burnt blonde tips, safety goggles pushed up on her forehead,
oversized electrician's jacket full of pockets, colored tape wrapped around her wrists and ankles, a homemade
capacitor rack strapped to her back with six capacitor tubes, an analog dial and blinking acid-green lights,
holding two alligator clamps on cables with an electric arc jumping between them, wide grin
```

**Prompt thẻ:**
```
Spark stands in a slum corridor of the underworld, a chaotic bundle of tapped power cables running along the
ceiling behind her, one hallway light just coming back on, warm orange light with acid-green sparks.
Small teenage girl, short black hair with burnt blonde tips, goggles on her forehead, oversized electrician's
jacket, colored tape on wrists, homemade capacitor rack on her back with blinking acid-green lights, holding two
alligator clamps with an electric arc jumping between them, up on her toes, wide grin.
```

**Sprite:** hai tay dang thấp, hai kẹp toé tia. `crit` = giơ hai kẹp chạm nhau trên đầu, tia nổ trắng. Nền **magenta `#FF00FF`**
cho con này, vì đèn tụ màu xanh axit.

---

### VIXEN — Kẻ mượn lính · Rust · A

Hồ sơ Canticle ghi mười một vụ trộm tài sản, không vụ nào có hàng ra chợ đen. Cô đưa lính máy ra khỏi hàng rào, tháo Halo
bằng đồ nghề mua của Wire, dạy chúng một cái tên rồi thả. Nói dối gần như mọi chuyện, trừ ba thứ: đường thoát, chỗ đặt mìn,
và ai sẽ chết nếu kế hoạch hỏng.

**Ý đồ tạo hình:** nhanh nhất game (SPD 114) — dáng phải gọn, nhẹ, sẵn sàng chạy. Áo khoác ngắn có mũ, khăn che mặt kéo
xuống cằm (đã lộ mặt rồi, đang cười), quần bó, ủng mềm. Đai chéo đầy **đồ nghề tháo Halo**: kìm nhỏ, tua vít từ, cuộn dây.
★ **Mười một vòng Halo nhỏ xâu vào một sợi dây đeo chéo ngực** — đếm được đúng mười một, mỗi cái một cái tên khắc tay.
Bên hông một cuộn dây leo có móc.

**Nhận diện:**
```
Vixen — young woman, lean and quick, short hooded jacket, face wrap pulled down to her chin, fitted pants and
soft boots, a tool bandolier of small pliers, magnetic screwdrivers and wire spools, eleven small halo rings
threaded on a strap across her chest each with a name scratched into it, a coiled grappling line with a hook at
her hip, amused lying smile
```

**Prompt thẻ:**
```
Vixen crouch-stands at the outside of a pristine white Canticle checkpoint fence at night, one section of the
fence neatly cut open behind her, violet light spilling through the gap onto rust-orange scrap ground.
Young woman, lean and quick, short hooded jacket, face wrap pulled down to her chin, tool bandolier, eleven small
halo rings threaded on a strap across her chest, coiled grappling line at her hip, one finger to her lips,
amused lying smile.
```

**Sprite:** dáng thấp, trọng tâm trước, một tay cầm kìm nhỏ, một tay giữ cuộn dây. `crit` = ném móc dây về phía trước.

---

### JUNKER — Xe vẫn chạy · Rust · B

Mất nửa người dưới trong vụ sập Tầng Bốn. Bác sĩ Stitch không có bộ phận thay thế, bà có chiếc xe: bà hàn phần còn lại của
anh vào khung gầm, nối dây thần kinh vào tay lái, bảo anh đạp ga thử. Xe chạy. Một ngày anh nói chưa tới mười chữ, chưa từ
chối chuyến nào.

**Ý đồ tạo hình:** bóng ngoài không lẫn với ai trong game — **nửa trên là người, nửa dưới là xe**. Vai rộng, tay to chai
sạn, râu quai nón, mặt lì; từ ngang hông trở xuống là khung gầm xe kéo hàn thẳng vào người: hai bánh sau lớn, một dàn bánh
xích nhỏ phía trước, mối hàn thô còn thấy đường que hàn. **Tay lái mọc ra trước bụng**, một bó dây thần kinh bọc vải nối
từ sườn anh vào cột lái. Sau lưng là thùng hàng nhỏ chằng dây. Một đèn pha xe còn sáng, cái kia vỡ.

**Nhận diện:**
```
Junker — a man welded into his own hauler: human from the waist up, broad shoulders, thick calloused arms, full
beard, blank patient face; below the waist his body is welded directly into a scrap hauler chassis with two large
rear wheels and a small track unit in front, crude visible weld beads, a steering column rising in front of his
stomach with a bundle of cloth-wrapped nerve cables running from his side into it, a small cargo bed strapped
behind him, one working headlamp and one broken
```

**Prompt thẻ:**
```
Junker sits welded into his hauler on a night haul road at the edge of the scrapyard, crushed cars and chain-link
fence behind him, his one working headlamp throwing a cone of warm light forward.
A man welded into his own hauler: human from the waist up, broad shoulders, thick arms, full beard, blank patient
face, below the waist a scrap hauler chassis with two large rear wheels and a front track unit, crude weld beads,
a steering column in front of his stomach with cloth-wrapped nerve cables running into it, small strapped cargo
bed behind him, both hands on the wheel.
```

**Sprite:** hai tay trên tay lái, thân hơi nghiêng tới. `crit` = chồm lên, bánh trước nhấc khỏi mặt đất, thùng hàng đổ về trước.
Lưu ý: con này **thấp và rộng**, đừng vẽ cao bằng người khác — trong hộp 682 nó sẽ chiếm chiều ngang chứ không chiều cao.

---

### GRAVEDIGGER — Người giữ nghĩa địa · Rust · B

Khu Đáy không có nghĩa trang. Rồi một ông già từ tầng trên xuống, mang cái xẻng và thói quen đào hố sâu hai thước, đặt tấm
thép, khắc tên. Không biết tên thì khắc ngày và ba chữ: *từng ở đây*. Sau vụ sập Tầng Bốn, ông khắc bốn nghìn tấm, khắc
suốt một năm. Ai hỏi sao chôn cả lính máy, ông bảo: đất không hỏi phe.

**Ý đồ tạo hình:** chậm nhất game (SPD 74) — mọi thứ phải nặng và chắc. Ông già cao, hơi khòm, áo choàng vải bạt dài phủ bụi
xi măng, mũ vành sụp, khẩu trang vải kéo xuống cổ, tay gân guốc **không một mảnh cấy ghép**. **Xẻng thép cán dài** cầm dựng
như gậy, lưỡi xẻng mòn vẹt một bên. Sau lưng buộc **năm sáu tấm thép khắc tên** chồng lên nhau bằng dây thừng. Ủng nặng dính
đất. Không có điểm sáng nào trên người — ông là mảng tối duy nhất trong mười người.

**Nhận diện:**
```
Gravedigger — tall stooped old man, long dusty canvas coat, wide-brimmed hat low over his eyes, cloth mask pulled
down to his neck, weathered hands with no implants at all, a long-handled steel shovel held upright like a staff
with one worn edge, five or six engraved steel name plates roped to his back, heavy mud-caked boots, patient
silent face
```

**Prompt thẻ:**
```
Gravedigger stands in the plate field behind the foundry: hundreds of engraved steel name plates driven upright
into the dirt in rows stretching into fog behind him, one fresh open grave at his feet, cold light, almost no color.
Tall stooped old man in a long dusty canvas coat, wide-brimmed hat low over his eyes, cloth mask at his neck,
weathered hands, long-handled steel shovel held upright like a staff, engraved steel name plates roped to his back,
heavy mud-caked boots, patient silent face.
```

**Sprite:** xẻng chống đất, hai tay chồng lên cán. `crit` = xẻng bổ xuống, một tấm thép rơi khỏi lưng.

---

## 8. Có ảnh rồi thì làm gì

1. Thả ảnh thẻ vào thư mục gốc (hoặc `art-src/HERO/`) → tôi đổi tên thành `art-src/CARD/<id>.png` (bản gốc), chạy
   `python scratch/card_web.py --only <id>` ra bản game `art/card/<id>.jpg` (ngang ≤ 1152, q90), rồi cắt
   `<id>_portrait.jpg` (JPEG q90, dải trên 0,375–0,424 chiều cao).
2. Thả ảnh nền xanh → `python scratch/key_enemy.py art-src/HERO --only <id>` → `art/sprite/<id>_idle.png` + số `box`
   dán vào `HERO_SPRITE` trong `js/data.js`.
3. Xong bước 1 cho cả 10 người thì **lọc bể gacha theo art** (việc K12) không còn cắt ai — mọi người trong bể đều có mặt.
4. Ảnh mở rương và video chiêu cuối làm sau, không chặn gì.

**Kiểm tra còn thiếu ai:** `node scratch/art_audit.js`

---

## 9. Sprite mới cho YUKI và KAI (art thẻ đổi 11/09)

Art thẻ của hai người đã thay bản mới, **sprite trong trận thì chưa** — vì hai ảnh thẻ mới không dùng làm sprite được:
ảnh Kai cắt ngang đùi (không có bàn chân để neo vào sàn), ảnh Yuki tuy đủ người nhưng có nền, có sàn phản chiếu,
và đứng chính diện trong khi sprite cần tư thế động nhìn nghiêng phải. Muốn đổi sprite thì phải sinh ảnh **nền xanh** riêng
theo quy cách mục 3.

### Cần mấy ảnh

| Pose | File nguồn | Trong game dùng khi | Bắt buộc |
|---|---|---|---|
| `idle` | `yuki idle.png` · `kai idle.png` | đứng chờ lượt, và mọi lúc không có pose riêng | **có** |
| `attack` | `<id> attack.png` | ra đòn thường | nên có |
| `crit` | `<id> crit.png` | đòn chí mạng (engine tự chọn trước khi đánh) | nên có |
| `hurt` | `<id> hurt.png` | trúng đòn | nên có |
| `die` | `<id> die.png` | gục, HP về 0 | nên có |

Thiếu pose nào engine tự dùng lại pose gần nhất, không lỗi — nhưng thiếu `idle` thì ra sân là bóng đen.

### Quy cách (giống mục 3, nhắc lại cho gọn)

Nền xanh lá phẳng `#00FF00` · **quay sang phải khung** · cả người, **hai bàn chân trong khung và tách rời nhau**
(script lấy điểm giữa hai bàn chân làm neo) · không bóng đổ, không mặt sàn, không cảnh nền, không chữ ·
dọc, cạnh dài ≥ 1024 px.

### YUKI — khối tả ngoại hình (dán chung cho cả 5 pose)

```
A slender young android woman: silver-white bob with blunt bangs, violet eyes, pale skin.
Above her head floats a glowing violet neon halo ring, not touching her. On the sides of her head sit
mechanical cat-ear plates with round glowing violet lenses. She wears a long white cyber-kimono haori with
wide sleeves and violet inner lining, small barcode decals on the sleeve, over a white-and-black mecha bodysuit
with round violet glowing joints, a black tactical obi belt with buckles, and white armored mech legs
with heeled boots. She carries a katana with a black-and-violet diamond-wrapped grip and a long pale blade.
```

| Pose | Câu tư thế thêm vào cuối |
|---|---|
| `idle` | `Braced ready stance, katana held low in both hands, blade angled forward, not swinging.` |
| `attack` | `Mid-lunge forward, katana sweeping in a single horizontal slash, haori sleeves flaring behind her.` |
| `crit` | `Deep vertical downward cut just finished, katana at the bottom of the arc, violet energy trailing the blade, body low and coiled.` |
| `hurt` | `Knocked back half a step, torso twisted away, one arm raised to shield her face, katana dropping off-line.` |
| `die` | `Collapsing to one knee, head down, katana driven into the ground holding her up, halo ring flickering and broken.` |

### KAI — khối tả ngoại hình

```
A slim pale young man: long straight black hair falling past his shoulders, blue glowing eyes, red eyeshadow,
black lipstick, a spiked black choker. He wears an open black leather biker jacket with a white skull patch
on the shoulder, a short black crop top, black tribal tattoos across his stomach and one arm, fingerless gloves,
a studded belt and dark cargo pants with straps, heavy black boots. A katana with a red-wrapped grip and
black-and-red diamond-wrapped scabbard is slung across his back, and a heavy railgun with a glowing blue
energy channel hangs on his hip.
```

**Vũ khí:** trong trận Kai đánh bằng **kiếm** — khẩu railgun chỉ để đeo, nó là chiêu cuối RIPCORD (đã có video).
Đừng cho cậu ta cầm railgun ở pose `idle`/`attack`, sẽ đá nhau với `desc` trong `js/data.js`.

| Pose | Câu tư thế thêm vào cuối |
|---|---|
| `idle` | `Braced ready stance, katana drawn and held low in one hand, other hand loose, railgun still slung on his hip.` |
| `attack` | `Mid-lunge forward, katana slashing upward across his body, jacket and hair flaring behind him.` |
| `crit` | `Two-handed downward cut just finished, blade at the bottom of the arc, blue energy crackling along the edge.` |
| `hurt` | `Staggered backwards, shoulder turned in, free arm across his chest, katana dropping off-line.` |
| `die` | `On both knees, head hanging forward, katana fallen flat beside him, jacket slipping off one shoulder.` |

### Negative (dùng chung)

```
text, letters, watermark, logo, UI, frame, border, two characters, duplicate, crowd, cropped head,
cropped feet, cut off limbs, extra limbs, extra fingers, chibi, blurry, low contrast, soft focus,
flat lighting, floor, ground, cast shadow, scenery, gradient background, white background
```

### Xong rồi đưa tôi

Thả 10 file vào thư mục gốc, tên đúng dạng `yuki idle.png` … `kai die.png` (hoa thường sao cũng được).
Tôi chuyển vào `art-src/HERO/`, chạy `python scratch/key_frame.py` (pose `idle`/`attack`/`hurt`) và
`python scratch/key_enemy.py art-src/HERO --only yuki` (pose thêm), cập nhật `HERO_SPRITE` trong `js/data.js`
rồi kiểm trong trận. Không cần đủ 10 file mới làm được — có bao nhiêu cắt bấy nhiêu.

---

## 10. Art thẻ mới cho RONIN (đợt sau Yuki/Kai)

Bạn gửi `Ronin.png` (942×1669). Đã cắm xong theo đúng mục 8:

| Việc | Kết quả |
|---|---|
| Ảnh thẻ | `art/card/ronin.jpg` — 942×1669, tỉ lệ 0,5644 (chuẩn là 0,5647, lệch không đáng kể) |
| Ảnh bán thân | `art/card/ronin_portrait.jpg` — 942×707, cắt dải trên 0,4239 chiều cao như 8 người kia, JPEG q90, 143 KB |
| Bản cũ | `art-src/HERO/ronin_card_v1.png` + `ronin_portrait_v1.jpg` |
| Bản gốc mới | `art-src/HERO/ronin_card_v2.png` |

**Khổ nhỏ hơn chuẩn**: 942 px ngang so với 1536 của tám người kia (Yuki và Kai đang là 1152). Không phải sửa gì —
thẻ hiển thị ở 176 px, chân dung lớn nhất cũng chỉ ~400 px, và game co ảnh theo CSS chứ không theo pixel gốc. Chỉ cần
nhớ nếu sau này làm poster in hay ảnh mở rương khổ lớn thì ảnh này **không đủ nét để phóng**.

~~**Vẫn chưa ra trận được.**~~ **Xong 11/09:** bạn gửi `Ronin.png` — một **bảng 2×2 nền xanh** gồm 4 tư thế
(Light Attack · Crit Attack · Khụy Gối · Hurt), 1254×1254, người cao ~560 px trong mỗi ô. Cắt theo hai vạch ngăn rồi
chạy `python scratch/key_enemy.py art-src/HERO --only ronin --h 0.843` là ra đủ 5 file. **Bảng gộp nhiều ô như vậy là
cách tốt nhất từ trước tới nay** — bốn ô chung một ảnh nên chung một hệ số phóng, không phải đoán cỡ từng pose như khi
nhận ảnh rời. Thiếu đúng một ô: **tư thế đứng (idle)**, nên `ronin_idle.png` hiện mượn frame đòn thường. Xem mục 11
cho quy cách bảng đầy đủ.

---

## 11. Bảng pose nền xanh cho MUZZLE (và mẫu bảng dùng chung từ nay)

Sau đợt Ronin 11/09, **Muzzle là người chơi được duy nhất còn thiếu sprite trận**: ảnh thẻ `art/card/muzzle.jpg`
(1152×2040, gốc 1536×2720 ở `art-src/CARD/`) và chân dung đều đã có, nên màn mở rương và thanh lượt hiện đúng mặt ông — nhưng ra sân vẫn là bóng đen.
Nếu bể gacha chương 1 chỉ mở Ronin + Muzzle thì một trong hai lá bài hiếm hoi ấy kéo về sẽ không đánh nhau được tử tế.

### Quy cách bảng gộp (rút từ bảng Ronin — cách tốt nhất hiện nay)

- **Một ảnh, lưới 3 cột × 2 hàng = 6 ô vuông**, mỗi ô cạnh **≥ 620 px** (bảng ~1880×1250). Ô nào cũng cùng một cỡ người —
  đây chính là chỗ ăn tiền: 6 ô chung một ảnh thì chung một hệ số phóng, tôi không phải đoán cỡ từng pose như khi nhận ảnh rời.
- Nền **xanh lá phẳng `#00FF00`** cho cả bảng, kể cả khe giữa các ô. Vạch ngăn mảnh (≤ 3 px) hoặc không có đều được.
- Nhân vật **nhìn sang phải**, **cả người**, **hai bàn chân trong khung và tách rời nhau** (script lấy điểm giữa hai bàn chân
  làm neo sàn). Không bóng đổ, không mặt sàn, không cảnh nền, không khói.
- Người cao khoảng **85–90% chiều cao ô**, chừa trên dưới ~5% để vũ khí giơ cao không bị cắt cụt.
- Nhãn ô ("1. Idle") viết được — script tự xoá — nhưng để **sát góc trên bên trái**, đừng đè lên người.
- **Ô `idle` là bắt buộc.** Bảng Ronin thiếu đúng ô này nên `ronin_idle.png` đang phải mượn frame đòn thường: ông ta đứng
  tấn ngang suốt lượt chờ và lúc đánh thường gần như không thấy đổi khung.

| Ô | Pose | Trong game dùng khi |
|---|---|---|
| 1 | `idle` | đứng chờ lượt, và mọi lúc không có pose riêng — **bắt buộc** |
| 2 | `attack` | ra đòn thường |
| 3 | `crit` | đòn chí mạng |
| 4 | `hurt` | trúng đòn |
| 5 | `die` | gục, HP về 0 (giữ nguyên khung đến hết trận) |
| 6 | — | để trống nền xanh, hoặc vẽ tư thế chiêu cuối để dành |

### MUZZLE — khối tả ngoại hình (dán chung cho cả 6 ô)

```
A heavy-set middle-aged man, broad shoulders, thick build. He wears a black rubber gas mask with two round
filter canisters and a strapped-on pair of round goggles with glowing yellow lenses; short cropped black hair
above the mask. A heavy navy-blue cloak hangs from his shoulders over a chest rig of overlapping scrap-metal
plates lashed with straps, a wide belt with pouches, a long dark navy coat below the belt, and battered work
boots. His left forearm is a chrome mechanical prosthetic with exposed pistons and wires; the other arm is
bare with dark tribal tattoos and a black fingerless glove. Strapped across his back is a rack of salvage
tools — pliers, a power drill, a work lamp, a handsaw. He carries a battered car door as a shield: dented
white-grey steel, rust streaks, window glass still in the frame, door handle intact.
```

**Vũ khí là cánh cửa xe** — nó chiếm nửa bóng của ông ta ở cỡ 160 px trên sân, nên **ô nào cũng phải thấy cửa xe**,
và đống đồ nghề sau lưng cũng đừng bỏ. Chiêu cuối FIELD PATCH là đóng cửa xe xuống nền cho cả tổ nấp sau (`js/data.js`),
nên đừng vẽ ông ta cầm súng hay dao.

| Pose | Câu tư thế thêm vào cuối |
|---|---|
| `idle` | `Standing guard, feet planted apart, car door held upright in front of him like a shield, mechanical hand gripping its edge.` |
| `attack` | `Stepping in and driving the edge of the car door forward as a shield bash, cloak swinging behind him.` |
| `crit` | `Full-body slam just landed, car door swung wide overhead and crashing down, whole body behind the weight, boots skidding.` |
| `hurt` | `Knocked back half a step, car door shoved aside off-line, free arm thrown up across the mask, one knee buckling.` |
| `die` | `Down on one knee, head hanging, car door planted edge-first into the ground and holding his weight, goggle lenses gone dark.` |

Negative: dùng chung khối ở mục 9.

### Xong rồi đưa tôi

Thả đúng **một file** vào thư mục gốc (tên gì cũng được, `Muzzle.png` là gọn nhất). Tôi cắt theo vạch ngăn, chạy
`python scratch/key_enemy.py art-src/HERO --only muzzle` — có ô `idle` là **tư thế đứng thật** thì không cần `--h`,
script tự lấy 98% hộp như mọi nhân vật chính — rồi cập nhật `HERO_SPRITE` trong `js/data.js` và kiểm trong trận.
Cùng cách này áp cho bất kỳ ai còn thiếu sprite sau này.
