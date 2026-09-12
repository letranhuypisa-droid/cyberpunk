# CHROMEFALL — Prompt video chiêu cuối (ultimate cut-in)

> **Cập nhật v0.3.** Sprite trận của **ASH** và **KAI** là cặp chị em kiếm sĩ goth (katana cán quấn đỏ, lưỡi rỉ axit xanh),
> nhưng video ult đã generate (`video/ash_ult.mp4`, `video/kai_ult.mp4`) đi theo prompt cũ: Ash = lưới mìn, Kai = súng điện từ (railgun).
> Quyết định 06/09: **giữ video, sửa lời chiêu theo video** (`js/data.js`, `docs/characters.md`). Mục 6–7 bên dưới mô tả đúng
> video đang dùng; muốn đồng bộ thì làm lại sprite hoặc video, không sửa lời chiêu lần nữa.
> Nhân vật chính giờ là Yuki; lore mới ở `docs/characters.md`. Yuki có **hai** video ult, game chọn ngẫu nhiên (xem mục 1).

Mỗi nhân vật có đúng một chiêu cuối, và khi phát chiêu thì trận dừng lại để chạy một video 5 giây trong
**hộp holo nổi trên đầu người phát chiêu** (`js/battle.js` → `playHolo`, `css/fx.css` `.holo`, số liệu `RULES.holo`).
Từ 11/09 video không còn phủ kín sân: sân mờ đi, hộp 16:9 hiện trên đỉnh đầu nhân vật với đuôi chỉ xuống, chạm sân
hoặc SKIP để bỏ qua; không có video (hoặc tắt trong CONFIG) thì hiện banner tên chiêu như trước. Đây là chỗ tốn tiền nhất của game về mặt cảm giác:
người chơi bấm ULT là để xem cái này.

Công cụ đang dùng: **Seedance 2.5**, 5 giây, có sinh audio.

---

## 1. Quy cách kỹ thuật (đọc trước khi generate)

Lấy từ `css/fx.css` (`.holo`), `RULES.holo` (`js/data.js`) và `js/battle.js`, không phải ước lượng:

| Mục | Giá trị | Vì sao |
|---|---|---|
| Tỉ lệ | **16:9** cho đội mình | `RULES.holo.ratio`; hộp `.holo__frame{aspect-ratio}` đọc theo. Video 16:9 nằm trọn hộp, không cắt. Khai `ultRatio` trong def thì con đó dùng tỉ lệ riêng (chiêu cuối địch đang dùng **3:4 dọc**), hộp kẹp cao tối đa 50% sân (`RULES.holo.hPct`) |
| Độ phân giải nộp vào repo | **1280×720** H.264 + AAC | bằng `video/yuki_ult.mp4` đang chạy |
| Thời lượng | **5.0s** (tối đa 8s) | quá 8s bị `guard` cắt để không treo trận |
| Vùng an toàn | **toàn khung** | hộp đúng tỉ lệ video nên `object-fit:cover` không phải cắt gì |
| Cỡ hiển thị | **~270×152 px** trên điện thoại (72% bề rộng sân, kẹp 220–340 px) | nhỏ hơn cut-in cũ ~3 lần → quay **cận cảnh, chủ thể to**; chi tiết nhỏ và chữ trong cảnh sẽ không đọc được |
| Chữ trong video | **không** | tên chiêu (`ZERO`) nằm ở thanh dưới hộp, chèn nữa là chồng nhau |
| Watermark | **tắt** | `video/yuki_ult.mp4` hiện tại còn dính "Dola AI" ở góc phải dưới |
| Frame đầu | đã sáng sẵn, vào thẳng cao trào | hộp hiện lên trong 220ms (`holo-in`), không có chỗ cho intro |
| Frame cuối | tối, đứng yên | cắt về sân đấu cho êm |
| Audio + thoại | bake thẳng vào video được | người chơi tắt tiếng thì `v.muted=true`, tắt cả cụm |

Tên file: `video/<id>_ult.mp4`. Chín nhân vật đã có art: `yuki`, `kai`, `ash`,
`psalm`, `ronin`, `muzzle`, `echo`, `wire`, `stitch` — cả chín đã trỏ sẵn `ultVideo` trong `js/data.js`.
Đã có video: `yuki` (2 video), `psalm`, `ash`, `kai`. File gốc để trong thư mục nhân vật (`art-src/YUKI/`, `art-src/ASH/`, …),
file trong thư mục gốc là bản đã hạ chuẩn.

**Kẻ địch cũng có chiêu cuối** (từ 11/09): cùng tên file `video/<id>_ult.mp4`, khai `ult` + `ultVideo` (+ `ultRatio` nếu
video không phải 16:9) trong `ENEMY_POOL` — xem §8. Sáu con đã có video: `glassjaw`, `kiln` (3:4 dọc, 540×720, gốc HEVC
đã chuyển sang H.264 để trình duyệt nào cũng phát được) và 4 boss `foreman`, `archon`, `motherrust`, `cantor`
(854×480 tức 16:9 như đội mình → **không khai `ultRatio`**).

**Nhiều cut-in cho một nhân vật:** đặt thêm `<id>_ult2.mp4`, `<id>_ult3.mp4`… rồi khai trong `ROSTER`
`ultVideo:[ ['video/yuki_ult.mp4', 'dự phòng'], ['video/yuki_ult2.mp4'] ]` (mỗi phần tử là một danh sách dự phòng).
Mỗi lần phát chiêu, `pickCutin` chọn ngẫu nhiên một video trong số file tồn tại. **Hiện không ai dùng cách này**:
Yuki từng có 2 video, nhưng 11/09 anh chốt bỏ hai bản cũ và chỉ giữ một video mới.

Hạ về chuẩn repo sau khi generate:

```bash
ffmpeg -i raw.mp4 -vf scale=1280:720 -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 23 -c:a aac -b:a 96k -movflags +faststart video/kai_ult.mp4
```

Nếu dùng Seedance qua API, hậu tố tham số đặt cuối prompt:
`--ratio 16:9 --duration 5 --resolution 1080p --camerafixed false --watermark false`.
Dùng web UI thì bỏ dòng này, chọn tay trong panel.

**Nên chạy image-to-video**, lấy đúng file art của nhân vật (`art-src/CARD/yuki.png`, `art-src/CARD/kai.png`, `art-src/CARD/ash.png`,
`art-src/CARD/psalm.png`, `art-src/CARD/ronin.png`, `art-src/CARD/muzzle.png`, `art-src/CARD/echo.png`, `art-src/CARD/wire.png`, `art-src/CARD/stitch.png`) làm ảnh tham chiếu
để tạo hình không trôi. Khi đó rút khối `CAST` còn một câu, dành token cho máy quay.

---

## 2. Ngôn ngữ máy quay: cắt cảnh, không phải một cú máy

Lỗi hay gặp khi sinh video ult là ra **một góc quay tĩnh, nhân vật vung vũ khí tại chỗ**.
Anime chiến đấu không làm thế. Một pha ult là **3–4 cú máy khác nhau cắt cứng**, mỗi cú một tiêu
cự, một hướng, một tốc độ. Trong 5 giây (120 frame ở 24fps) thì 4 shot là vừa; quá 5 shot là model
nhão, nhân vật đổi mặt giữa chừng.

| Nhịp | Thời lượng | Việc của nó | Máy quay |
|---|---|---|---|
| **SẠC** | ~1.0s | cho biết chiêu bắt đầu | máy sát sàn, góc cực thấp, đẩy chậm |
| **QUYẾT** | ~0.9s | cận mặt, khoá cảm xúc | whip pan chốt vào extreme close-up mắt + crash zoom |
| **ĐÁNH** | ~1.4s | cú ra đòn | orbit 180° → speed ramp chậm sang thật → 2 frame trắng → rung máy |
| **DƯ ÂM** | ~1.7s | trả hậu quả | đảo trục, máy lùi/cẩu ra, nhân vật đứng yên, cảnh lắng xuống |

Thuật ngữ gọi tên đúng để model hiểu: `extreme low angle`, `crash zoom`, `arc shot / orbit around
the character`, `speed ramp from slow motion to real time`, `whip pan`, `rack focus`,
`handheld camera shake`, `top-down overhead shot` (dành cho AoE), `delayed cut` (mục tiêu đứt
**sau** khi đã tra kiếm — luật của phim kiếm).

Màu bám token trong `css/chromefall.css`: phe **Chrome** tím `#7C4DFF` + trắng lạnh `#DCE6F7`;
phe **Rust** cam rỉ `#E2703A` + vàng độc `#C9D830`. Nền luôn gần đen `#06070A`.

### Chiêu heal và control đổi nhịp thứ ba

Bốn nhịp trên viết cho chiêu sát thương. Hai loại còn lại đổi nhịp **ĐÁNH**:

| `kind` | Nhịp 3 | Khác gì |
|---|---|---|
| `nuke` · `aoe` | **ĐÁNH** | orbit → speed ramp → 2 frame trắng → rung máy |
| `heal` | **LAN** | máy cẩu lên và lùi ra để lộ vùng sáng lan rộng; không có flash trắng, thay bằng quầng ấm nở ra; không có mục tiêu trong khung |
| `control` | **CHIẾM** | **bắt buộc có kẻ địch trong khung** — loại duy nhất phải tả kẻ địch, và phải tả kỹ ngang nhân vật chính, khác nhân vật chính ở mọi điểm (xem luật 1–2 ở mục 3) |

### Mỗi nhân vật một cú máy riêng

Chín video mà cùng dùng `orbit 180°` thì tới cái thứ ba đã chán. Cú máy ở nhịp 3 là chữ ký của
nhân vật — đừng dùng lại:

| Nhân vật | Cú máy nhịp 3 | Vì sao hợp |
|---|---|---|
| YUKI | orbit 180° quanh người | cô di chuyển, đối thủ thì không |
| KAI | máy khoá tại chỗ, rung mạnh | khẩu súng ghì cậu xuống, cậu không đi đâu được |
| ASH | máy nằm sàn, cô đi thẳng vào ống kính | cô quay lưng lại với vụ nổ |
| PSALM | arc ngang cực chậm, gần như đứng yên | bà không bao giờ vội |
| RONIN | wide tĩnh rồi snap dolly-in đúng nhát chém | một nhát dứt điểm, không múa |
| MUZZLE | cẩu lên và lùi ra để lộ vòm chắn | anh đứng yên, thế giới lùi ra khỏi anh |
| ECHO | cẩu ra thật nhanh, máy bị sóng đẩy lùi | sóng âm đẩy cả máy quay |
| WIRE | máy xoay nghiêng (roll) theo dòng điện | cô vặn thiết bị, khung hình vặn theo |
| STITCH | tracking ngang lướt qua bà | bốn tay bắn chỉ ra bốn hướng, máy quét ngang |

---

## 3. Kiểm soát vật thể — tám luật

Hai lỗi thật đã gặp, và nguyên nhân:

- **Kai bắn đạn nhưng đạn thành khẩu súng.** Prompt viết `camera launched forward with the slug`.
  Model phải tự chọn xem "cái gì đang bay", mà vật nổi bật nhất trong prompt là khẩu railgun to gấp
  đôi người → nó cho khẩu súng bay. Thêm nữa `slug` là từ mơ hồ (viên đạn, mà cũng là con sên).
- **Yuki đứng trước một Yuki khác.** Prompt tả Yuki rất kỹ, còn mục tiêu chỉ gọi là
  `enemy silhouette`. Model không biết cái silhouette đó trông thế nào nên nó lấy cái duy nhất nó
  biết = Yuki.

Cùng một bệnh: prompt không đếm người và không đếm đồ. Tám luật để chặn:

**1. Đếm người bằng số, đặt ngay đầu prompt.**
`=== CAST — exactly ONE person appears in this entire video ===` rồi liệt kê. Kèm câu cấm rõ ràng:
`no second Yuki, no clone, no twin, no double, no reflection, no mirrored copy`.

**2. Cấm ba từ: `silhouette`, `figure`, `shadow` (khi nói về người).**
Ba từ này là ba cái lỗ để model đẻ thêm người. Muốn nói bóng người thì hoặc tả hẳn ra nó là ai,
hoặc đẩy khỏi khung. Cách an toàn nhất: `far behind, heavily out of focus, never resolving into a
person`.

**3. Mỗi shot có một dòng `IN FRAME:` liệt kê đúng những gì được có.**
Đây là đòn bẩy mạnh nhất trong cả tài liệu này. Cái gì không nằm trong danh sách thì không được
vẽ. Shot cận mặt thì ghi thẳng `her face only. No hands, no sword, no background detail.`

**4. Không bao giờ bắt máy quay bay theo một vật thể.**
Đạn trong anime không phải vật thể, nó là **một vệt sáng dài đúng một frame**. Tả nó là ánh sáng,
và để máy đứng yên với người bắn. Muốn thấy cú chạm thì cắt sang shot khác, đừng bay theo.

**5. Mỗi đạo cụ khoá vào một bàn tay, kèm một câu "không bao giờ".**
`The railgun is always held in both his hands. It never leaves his grip, never floats, never flies,
never appears in mid-air, never duplicates, and the camera never travels with it.`

**6. Nhắc lại nhận dạng nhân vật ở mọi shot, ngắn 5–7 chữ.**
Model trôi qua mỗi lần cắt. Dán `Yuki (white bob, cat-ear headgear, white haori)` vào đầu mỗi shot.

**7. Ít danh từ mới mỗi shot.**
Mỗi danh từ mới là một cơ hội hallucinate. Ba vật thể một shot là trần. Cần đông thì đẩy ra hậu
cảnh mất nét.

**8. Vẫn hỏng thì generate từng shot riêng rồi ghép.**
Mỗi shot 1–1.5s, một góc máy, hai ba vật thể — tỉ lệ ra đúng cao hơn hẳn so với bắt model dựng cả
4 shot trong một lần. Trim rồi nối:

```bash
ffmpeg -i shot1_raw.mp4 -ss 0 -t 1.0 -c:v libx264 -crf 20 -pix_fmt yuv420p -c:a aac s1.mp4
ffmpeg -i shot2_raw.mp4 -ss 0 -t 0.9 -c:v libx264 -crf 20 -pix_fmt yuv420p -c:a aac s2.mp4
ffmpeg -i shot3_raw.mp4 -ss 0 -t 1.4 -c:v libx264 -crf 20 -pix_fmt yuv420p -c:a aac s3.mp4
ffmpeg -i shot4_raw.mp4 -ss 0 -t 1.7 -c:v libx264 -crf 20 -pix_fmt yuv420p -c:a aac s4.mp4
printf "file 's1.mp4'\nfile 's2.mp4'\nfile 's3.mp4'\nfile 's4.mp4'\n" > list.txt
ffmpeg -f concat -safe 0 -i list.txt -vf scale=1280:720 -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 23 -c:a aac -b:a 96k -movflags +faststart video/kai_ult.mp4
```

Ghép kiểu này thì thoại phải lồng riêng (mục 4), vì mỗi clip sinh ra một giọng khác nhau.

---

## 4. Voice — lồng tiếng trong prompt

Seedance 2.5 sinh cả tiếng. Nhưng viết `cô nói giọng vui vẻ` thì không ra gì. Phải viết thoại
**có mốc thời gian + chỉ đạo giọng từng câu**:

```
=== VOICE — only Yuki speaks. No narrator, no second voice ===
0.5s  "Hop!"   — bright girlish sing-song, delighted, weightless
```

Bốn quy tắc:

- **Trần 8–12 từ cho 5 giây.** Quá là bị nói nhanh như máy hoặc bị cắt cụt. Đếm trước khi viết.
- **Cấm phụ đề rõ ràng.** Model thấy dấu ngoặc kép là hay tự vẽ subtitle lên hình:
  `NO subtitles, NO captions, NO burned-in text.`
- **Chỉ một người nói.** `Only Kai speaks. No narrator, no second voice, no crowd.`
- **Thoại tiếng Anh.** Tiếng Việt sinh ra thường sai dấu và lơ lớ. Muốn thoại tiếng Việt thì
  generate mute rồi lồng tiếng riêng và gộp bằng `ffmpeg -i video.mp4 -i voice.wav -c:v copy
  -c:a aac -shortest out.mp4`. Game thật cũng làm thế, vì còn phải đổi ngôn ngữ sau này.

Và luật quan trọng nhất, luật viết nhân vật chứ không phải luật kỹ thuật:

> **Giọng phải ngược với hành động thì mới ra chất.**
> Yuki càng giết càng vui như đang chơi nhảy lò cò. Kai càng sợ bị quên càng gào tên mình. Ash nổ
> tung cả sân mà giọng như đang đọc hoá đơn. Đó là chỗ nhân vật hiện ra, không phải ở cú chém.

---

## 5. ZERO — YUKI

*Chrome · S · 100 Energy · nuke · 320% ATK một mục tiêu, giết được thì hoàn 50 Energy*

### Mô tả chiêu

Yuki không lao tới. Cô đi ba bước.

Hop — mũi giày chạm sàn, con phố im bặt. Skip — vòng Halo gãy trên đầu cô bật sáng tím trở lại,
đúng thứ ánh sáng The Corp đã cấy vào cô sáu năm. Jump — Zero rời bao đúng một lần.

Thanh kiếm về bao trước khi cái xác kịp đổ. Yuki quay lưng đi, không nhìn lại. Vì sao ư? Vì với
cô, mục tiêu đã bằng không từ bước thứ nhất; ba bước còn lại chỉ là thủ tục.

Giọng cô suốt cả chiêu là giọng một đứa trẻ đang chơi nhảy lò cò. Đó là chỗ đáng sợ.

> "Hop! Skip! Jump! Oh... you're dead already?"

### Prompt

```
Anime battle ultimate cut-in for a dark cyberpunk RPG. 5 seconds, 16:9, FOUR hard-cut shots.
This must NOT be one continuous static camera: every shot is a different angle, focal length and
camera move.

=== CAST — exactly ONE person appears in this entire video ===
[1] YUKI — a small pale girl, short white bob, white cat-ear headgear, half-lidded violet eyes,
long white haori coat with deep purple lining, white-and-black chrome mechanical limbs with
glowing violet joint cores, a cracked violet halo ring floating above her head.
FORBIDDEN: a second Yuki, a clone, a twin, a double, her reflection, a mirrored copy, a
person-shaped shadow, any extra person, any crowd. Her target is never shown on screen.

=== PROPS — complete list, nothing else exists ===
[A] ZERO — one long katana with a violet-lit edge. Always either in her right hand or sheathed at
her left hip. It never floats, never flies, never duplicates, never leaves her hand.
[B] one cracked violet halo ring, always directly above her head, always exactly one ring.
FORBIDDEN: a second sword, a floating sword, any gun, any prop not listed above.

=== SETTING ===
A narrow wet black alley, dead neon, near-black. No people, no vehicles, no readable signage.

=== SHOTS ===
SHOT 1 — 0.0-1.0s
IN FRAME: Yuki only (white bob, cat-ear headgear, white haori), the wet floor, the halo above her.
Nothing else.
CAMERA: extreme low angle, lens almost touching the wet floor, slow dolly push-in past her boot.
ACTION: she takes one soft step forward. The cracked halo stutters, then reignites violet and lights
her face from above. Everything behind her falls to black. Slow motion, dust floating upward.

SHOT 2 — 1.0-1.9s
IN FRAME: her face only (white bob, violet eyes). No hands, no sword, no background detail.
CAMERA: fast whip pan landing on an extreme close-up, then a crash zoom into her eyes.
ACTION: violet light blooms inside her irises, white hair lifts off her shoulders. One blink.
No smile.

SHOT 3 — 1.9-3.4s
IN FRAME: Yuki only (white bob, white haori), the katana in her hands, empty black space around
her. No target. No other person.
CAMERA: low three-quarter tracking shot arcing 180 degrees around her at hip height. The camera
follows Yuki and nothing else.
ACTION: she drops into an iaido draw stance, thumb on the guard. Time is nearly frozen, violet
embers hang still in the air. On the draw the shot speed-ramps from slow motion into real time:
the katana clears the scabbard and one single horizontal violet light streak crosses the whole
frame left to right within one frame. Violent camera shake. The frame goes pure white for two
frames, then back.

SHOT 4 — 3.4-5.0s
IN FRAME: Yuki from behind over her shoulder (white bob, white haori), the katana sliding into the
scabbard, and far behind her — heavily out of focus, never resolving into a person — a collapsing
pale shape breaking apart into violet sparks.
CAMERA: over-the-shoulder from behind and slightly below, craning slowly back, then settling.
ACTION: she is already turning away. The katana clicks home into the scabbard. A beat later the
violet sparks burst upward far behind her and fade. A huge violet ring collapses behind her. The
last 0.4s is a dark, held, almost still frame.

=== VOICE — only Yuki speaks. No narrator, no second voice, no crowd ===
0.5s  "Hop!"    — bright girlish sing-song, delighted, weightless
1.3s  "Skip!"   — same voice, half a tone higher, teasing
2.6s  "Jump!"   — same voice, still cheerful, exactly on the sword draw
4.0s  "Oh... you're dead already?" — soft, mock-disappointed, curious, almost bored
Young female voice, light and childlike, close-mic, dry, no reverb, no processing. She is never
angry and never shouts. The cheerfulness over the killing is the whole point.

=== SFX ===
Room tone drops to total silence in shot 1. One thin metallic ring on the draw. One deep sub-bass
impact. The katana clicking home into the scabbard is the last sound.

=== STYLE ===
2.5D cel-shaded anime key visual, sakuga action animation, thick rim light, heavy motion smear and
speed lines on the fast frames, hard camera shake after impact, embers drifting past the lens.
Palette: violet #7C4DFF, cold white #DCE6F7, near-black #06070A. Volumetric haze, fine film grain.
Keep Yuki inside the central 80% of the frame at all times. The first frame is already at peak
intensity.

=== DO NOT RENDER ===
No subtitles, no captions, no burned-in text, no letters, no logo, no watermark, no UI, no name
plate, no lens flare crosses, no second character, no clone, no reflection of Yuki, no crowd,
no blood, no gore.
```

---

## 6. RIPCORD — KAI

*Rust · B · 100 Energy · nuke · 240% ATK một mục tiêu*

### Mô tả chiêu

**RIPCORD (video đang dùng `video/kai_ult.mp4`, 6s): súng điện từ, một phát xuyên thẳng.** Kai đứng giữa hẻm neon, cười nhe răng,
kéo khẩu súng điện từ to hơn người lên vai, ngắm qua ống kính; nòng sáng xanh rồi bắn một luồng thẳng, tia lửa bắn ngược lại.
Sprite trong trận vẫn là katana; lời chiêu trong `js/data.js` đã sửa theo video. `kind:'nuke'`, 240% ATK, một mục tiêu.
**Prompt bên dưới là bản đã dùng để generate.**

### Prompt

```
Anime battle ultimate cut-in for a dark cyberpunk RPG. 5 seconds, 16:9, FOUR hard-cut shots.
This must NOT be one continuous static camera: every shot is a different angle, focal length and
camera move.

=== CAST — exactly ONE person appears in this entire video ===
[1] KAI — a lean pale young man, nineteen, long straight black hair, red eye makeup, black
lipstick, a lit cigarette clenched in his teeth, spiked choker, open black leather jacket with a
white skull patch on the shoulder, black crop tank, tribal tattoos on his stomach and arms,
fingerless studded gloves.
FORBIDDEN: a second Kai, a clone, a twin, a reflection, a person-shaped shadow, any extra person,
any crowd. His target is never shown on screen.

=== PROPS — complete list, nothing else exists ===
[A] THE RAILGUN — one enormous scrap-built railgun, twice his size, welded from salvaged rail
segments and pipe, with a frayed pull-start ripcord on the breech. IT IS ALWAYS HELD IN HIS HANDS
and braced against his shoulder. It never leaves his grip, never floats, never flies through the
air, never appears in mid-air, never duplicates, and the camera never travels with it.
[B] THE SHOT — this is NOT an object. It is a single thin white-hot line of light that leaves the
muzzle and is gone within one frame. It is never a gun, never a rocket, never a missile, never a
drone, never any solid object.
[C] one red-wrapped katana slung flat across his back, sheathed for the entire video. He never
touches it and never draws it.
[D] one huge spent brass casing, wrist-thick. It exists only in SHOT 4.
FORBIDDEN: a flying gun, a second railgun, floating weapons, spare guns on the ground.

=== SETTING ===
A dark collapsed industrial hall, near-black, hanging dust, broken concrete floor.

=== SHOTS ===
SHOT 1 — 0.0-0.9s
IN FRAME: his right fist, the frayed ripcord handle, the breech of the railgun, the cigarette ember
at the edge of frame. Nothing else. No full body, no face.
CAMERA: macro extreme close-up, handheld, very shallow depth of field.
ACTION: his fist closes on the cord, knuckles white, and rips it hard out of frame. The camera
whip-pans with his arm.

SHOT 2 — 0.9-1.8s
IN FRAME: Kai (long black hair, leather jacket) down on one knee, both hands on the railgun,
shoulder jammed into the stock. Nothing else.
CAMERA: low angle, slight dutch tilt, tilting up along the barrel, slow push-in.
ACTION: electromagnetic coils spin up and burnt-orange arcs crawl along the barrel from the breech
toward the muzzle. His jacket and hair blow backward in the field. Mouth open mid-shout, eyes too
wide.

SHOT 3 — 1.8-3.0s
IN FRAME: Kai side-on, still holding the railgun in both hands, the muzzle at frame right. No
target, no other person, no flying object.
CAMERA: locked-off side-on medium shot with hard shake. The camera stays on Kai and does not travel
forward, does not follow anything.
ACTION: he fires. One thin white-hot line of light exits the muzzle to the right and is gone in a
single frame. The recoil throws his shoulder back and skids his boot across the concrete. Muzzle
bloom, dust blasted off the floor. The frame goes pure white for two frames, then back. The railgun
stays in his hands the entire time.

SHOT 4 — 3.0-5.0s
IN FRAME: the concrete floor, the falling spent casing, smoke, and Kai's boots and hands entering
frame at the end. Far background: only darkness and one small orange bloom, heavily out of focus,
never resolving into a person or a creature.
CAMERA: ground-level, lens resting on the floor, slow motion, shallow focus, then a small settle.
ACTION: the huge spent casing drops into frame, bounces, rings and rolls toward the lens. Smoke
pours off the barrel above. Far downrange the small orange bloom flares and dies. Kai crouches into
frame and picks the casing up. Dark held frame.

=== VOICE — only Kai speaks. No narrator, no second voice, no crowd ===
0.3s  (a ragged inhale through his teeth)
1.3s  "Say my name—"     — too loud, cracking, manic
2.5s  "K! A! I!"         — screamed exactly on the shot, voice breaking on the last letter
4.3s  "...say it right." — quiet, breathless, spoken to himself
Young male voice, nineteen, thin and raw, over-adrenalised, the voice cracks under strain.
Close-mic with a hard concrete room slap. No music-video processing.

=== SFX ===
A harsh chainsaw-like pull-start rasp. A rising electromagnetic coil whine. One enormous railgun
crack with a long tail. The casing ringing on concrete is the last sound.

=== STYLE ===
2.5D cel-shaded anime key visual, sakuga action animation, thick rim light, heavy motion smear and
speed lines on the fast frames, hard camera shake, debris and sparks past the lens.
Palette: rust orange #E2703A, acid yellow-green #C9D830, near-black #06070A. Volumetric dust, fine
film grain. Keep Kai inside the central 80% of the frame at all times. The first frame is already
at peak intensity.

=== DO NOT RENDER ===
No subtitles, no captions, no burned-in text, no letters, no logo, no watermark, no UI, no name
plate, no second character, no clone, no reflection of Kai, no crowd, no flying gun, no gun in
mid-air, no missile, no rocket, no blood, no gore.
```

---

## 7. FLASHOVER — ASH

*Rust · A · 75 Energy · aoe · 150% ATK lên toàn bộ kẻ địch*

### Mô tả chiêu

**FLASHOVER (video đang dùng `video/ash_ult.mp4`, 6s): lưới mìn, một mồi lửa.** Dây nối các quả mìn gài trên nền bê tông ướt; Ash
bật lửa châm thuốc, quay lưng đi thẳng về phía máy quay; cả bãi phía sau nổ thành một quả cầu lửa, cô đi xuyên qua tàn lửa.
Sprite trong trận vẫn là katana; lời chiêu trong `js/data.js` đã sửa theo video. `kind:'aoe'`, 150% ATK lên toàn bộ địch.
**Prompt bên dưới là bản đã dùng để generate.**

### Prompt

```
Anime battle ultimate cut-in for a dark cyberpunk RPG. 5 seconds, 16:9, FOUR hard-cut shots.
This must NOT be one continuous static camera: every shot is a different angle, focal length and
camera move.

=== CAST — exactly ONE person appears in this entire video ===
[1] ASH — a pale woman, long black hair, red eye makeup, black lipstick, cold blue eyes, a lit
cigarette between her lips, spiked choker, open black leather jacket with a white skull patch on
the shoulder, black crop top, tribal tattoos across her stomach, heavily burn-scarred hands in
cut-off studded gloves, belted cargo pants.
FORBIDDEN: a second Ash, a clone, a twin, a reflection, a person-shaped shadow, any extra person,
any crowd. Her targets are never shown on screen, and there is nobody inside the fire.

=== PROPS — complete list, nothing else exists ===
[A] one battered scrap detonator with a flip-up safety cap, always in her right hand.
[B] one lit cigarette, in her lips until SHOT 3, then on the floor.
[C] one red-wrapped katana slung flat across her back, sheathed for the entire video. She never
touches it and never draws it.
[D] the charge lights — flat points of burnt-orange light embedded in the floor. They are light
only: not devices, not visible bombs, not objects.
FORBIDDEN: thrown grenades, flying bombs, weapons in the air, a second detonator.

=== SETTING ===
A dark wet industrial yard at night, rain, dead neon, near-black.

=== SHOTS ===
SHOT 1 — 0.0-1.0s
IN FRAME: an empty dark wet floor seen from directly above, rain hitting puddles, and the charge
lights waking up. NO people at all in this shot.
CAMERA: top-down overhead, looking straight down, sliding sideways across the floor.
ACTION: one by one, small burnt-orange lights wake up across the whole floor, spreading outward
like a constellation switching on.

SHOT 2 — 1.0-1.9s
IN FRAME: her scarred right thumb, the detonator's safety cap, then her eyes. Nothing else.
CAMERA: macro close-up, then a rack focus from the detonator back to her half-lidded eyes.
ACTION: her thumb flips the safety cap open with a click. She exhales smoke through her nose,
already looking away from the field.

SHOT 3 — 1.9-3.3s
IN FRAME: Ash from behind at ankle height (black leather jacket, cargo pants), the wet floor, the
falling cigarette, and a wall of fire rising behind her. Nobody in the fire.
CAMERA: ground-level wide shot behind her ankles, lens resting on the floor, static and then hard
shake.
ACTION: she walks straight toward the lens. The cigarette drops in slow motion and touches the wet
concrete. Behind her the floor lights go white and the entire background detonates at once into a
single wall of orange fire. The shot snaps to real time, violent camera shake, the blast wave
throwing debris and burning scrap past the lens on both sides. She does not look back and does not
flinch.

SHOT 4 — 3.3-5.0s
IN FRAME: Ash walking out of the fire (long black hair, leather jacket, scarred hands), embers,
darkness. Nothing else.
CAMERA: slow-motion low-angle hero shot, slow push-in, then settle.
ACTION: she keeps walking out of the fire, backlit, jacket snapping in the heat. She looks down at
her own scarred hands, then lifts her eyes to the camera. The fire collapses into drifting embers.
Dark held frame.

=== VOICE — only Ash speaks. No narrator, no second voice, no crowd ===
1.5s  "Everything's got a price." — flat, low, bored, spoken around the cigarette
3.4s  (a slow exhale, no words)
4.6s  "That was yours."           — quieter, not addressed to anyone
Adult female voice, low, dry, tired, slightly rough. Her volume never rises. She has no reaction
to the explosion at all.

=== SFX ===
Soft blinking beeps spreading across the floor, rain on concrete. One dry detonator click. A full
beat of total silence. Then one enormous low explosion with a long tail and debris raining down.

=== STYLE ===
2.5D cel-shaded anime key visual, sakuga action animation, thick rim light, heavy motion smear on
the fast frames, hard camera shake, debris and embers past the lens.
Palette: rust orange #E2703A, acid yellow-green #C9D830, near-black #06070A. Volumetric smoke, fine
film grain. Keep Ash inside the central 80% of the frame at all times. The first frame is already
at peak intensity.

=== DO NOT RENDER ===
No subtitles, no captions, no burned-in text, no letters, no logo, no watermark, no UI, no name
plate, no second character, no clone, no reflection of Ash, no crowd, no people in the fire,
no thrown grenade, no flying bomb, no blood, no gore.
```

---

## 8. APOSTASY — PSALM

*Chrome · S · 125 Energy · control · Chiếm quyền điều khiển một kẻ địch một lượt: lượt tới nó tấn công đồng bọn*

### Mô tả chiêu

Trên Spire có một căn buồng mà lính Choir sợ hơn cả lò tái chế, và người ngồi nghe trong đó suốt
bao năm là Psalm. Ba trăm mười hai unit đã kể hết mọi chuyện cho bà rồi bị xoá.

Bà không đánh. Bà nghe.

Psalm hạ cái đèn lồng đỏ xuống, và toàn bộ mấy tờ giấy xưng tội ghim trên áo bà cùng bốc lên một
lượt. Vòng Halo của mục tiêu bắt được tần số của bà thay vì tần số của The Corp — trắng chuyển
sang đỏ. Thế là xong. Không nổ, không chớp sáng. Cái unit ấy quay đầu lại, nhìn về phía đồng đội
của nó.

Giọng bà suốt cả chiêu vẫn là giọng trong buồng xưng tội: chậm, ấm, kiên nhẫn. Đó mới là chỗ đáng
sợ.

> "Xưng tội đi. Đùa thôi. Tôi bỏ nghề rồi."

**Đây là chiêu duy nhất trong chín cái bắt buộc phải có kẻ địch trong khung.** Nên `CAST` có hai
người, và kẻ địch phải được tả kỹ ngang Psalm rồi cho khác bà ở mọi điểm — cao hơn hẳn, mặt nạ
trắng trơn không mắt, halo trắng, không tóc, không áo choàng.

Psalm thuộc phe Chrome nên thanh tên do CSS vẽ sẽ là tím `#7C4DFF`, còn video của bà thì đỏ. Cố ý:
vòng Halo đỏ là dấu bội giáo, không phải màu phe.

### Prompt

```
Anime battle ultimate cut-in for a dark cyberpunk RPG. 5 seconds, 16:9, FOUR hard-cut shots.
This must NOT be one continuous static camera. This is a mind-control ability, not an attack:
there is no explosion, no slash, no white impact flash anywhere in this video.

=== CAST — exactly TWO figures appear, and they must never look alike ===
[1] PSALM — a tall pale android woman, white slicked-back hair, glowing red eyes, a thin white
bandage band across her forehead, a bright RED halo ring floating above her head, an ornate chrome
mechanical right arm and shoulder with a glowing red core, a white-and-black armored body, a long
black coat with deep red lining, and dozens of small white paper confession slips pinned along the
coat.
[2] THE CHOIR UNIT — her target. Deliberately unlike Psalm in every way: much taller and bulkier,
a smooth featureless matte-white helmet with NO face and NO eyes, a thin WHITE halo ring above it,
no hair, no coat, plain white corporate armor plating, arms hanging at its sides.
FORBIDDEN: a second Psalm, a clone, a twin, a reflection, a third person, a crowd. The Choir unit
must NEVER have white hair, red eyes, a black coat or paper slips. It must never resemble Psalm.

=== PROPS — complete list, nothing else exists ===
[A] one small red glowing lantern hanging on a chain from her left hand. It never leaves the chain.
[B] the paper confession slips, pinned to her coat. They lift and drift around her and settle back.
[C] exactly TWO halo rings exist in this video: the red one above Psalm, and the white one above
the Choir unit. No third ring, no free-floating rings.
FORBIDDEN: swords, guns, any weapon at all. Neither figure ever holds a weapon.

=== SETTING ===
A cold white corporate corridor with the lights failing, most of the frame falling into black.

=== SHOTS ===
SHOT 1 — 0.0-1.1s
IN FRAME: Psalm left hand, the chain, the red lantern, and the paper slips on her coat. No face,
no target.
CAMERA: low close angle, lens near the floor, a very slow lateral arc — almost still. No shake.
ACTION: she lowers the lantern on its chain. Red light sweeps across the paper slips and they begin
to lift off her coat one by one.

SHOT 2 — 1.1-2.0s
IN FRAME: her face only (white slicked hair, red eyes, red halo above her). Nothing else.
CAMERA: slow push-in to an extreme close-up. No whip pan, no crash zoom, no shake.
ACTION: her expression does not change at all. She blinks once, unhurried. The red halo brightens.

SHOT 3 — 2.0-3.5s
IN FRAME: exactly two figures — Psalm at frame left (white hair, black coat, red halo), the Choir
unit at frame right (featureless white helmet, white halo). The lantern between them. Paper slips
drifting.
CAMERA: slow lateral arc across both at chest height. Very slow. No shake, no zoom.
ACTION: she raises the lantern. One thin red thread of light crosses the gap and touches the white
halo. The halo flickers, then floods red. The helmet turns slowly toward Psalm. The colour change
is the entire event — no flash, no explosion, no damage.

SHOT 4 — 3.5-5.0s
IN FRAME: Psalm from behind over her shoulder, and beyond her the Choir unit, now with a red halo,
slowly turning away from her toward something off-screen.
CAMERA: over-the-shoulder, slow pull back, settling.
ACTION: the unit turns its back on Psalm and walks out of frame. Psalm lowers the lantern. The
paper slips settle back onto her coat one by one. Dark held frame.

=== VOICE — only Psalm speaks. The Choir unit never speaks. No narrator ===
1.3s  "Confess."                   — low, warm, unhurried, a priest voice in a quiet room
4.2s  "Good. Now go and tell them." — softer, almost affectionate
Mature female voice, calm, low, patient, entirely without threat. She never raises her volume.
The gentleness over the mind-control is the whole point.

=== SFX ===
Chain links shifting. A low choir hum that bends flat and dies. Paper rustling. One soft distant
bell. No explosion at any point.

=== STYLE ===
2.5D cel-shaded anime key visual, thick rim light, slow deliberate motion, very little camera
shake. Palette: deep red #FF4B4B, cold white #DCE6F7, near-black #06070A. Volumetric haze, fine
film grain. Keep both figures inside the central 80% of the frame. The first frame is already at
peak intensity.

=== DO NOT RENDER ===
No subtitles, no captions, no burned-in text, no letters, no logo, no watermark, no UI, no name
plate, no second Psalm, no clone, no reflection, no crowd, no weapons, no explosion, no white
impact flash, no blood, no gore.
```

---

## 9. IAIDO — RONIN

*Rust · A · 100 Energy · nuke · 280% ATK một mục tiêu (★ FAKE)*

### Mô tả chiêu

Yuki cũng rút kiếm. Nhưng Yuki rút xong là đi, còn Ronin rút xong là đứng lại.

Anh không né. Anh bước tới một bước, đúng vào đường đòn đang tới, và chém xuống một nhát. Thanh
kiếm là thép, rèn ở tầng âm bốn, kiếm của chị anh, không có lấy một sợi dây điện nào trong đó. Cả
người anh cũng vậy: không cấy ghép, không Halo.

Chém xong anh giữ nguyên thế, kiếm buông thấp, thở đúng một hơi. Anh không tra kiếm, không quay
lưng. Vì sao ư? Vì nhát vừa rồi là của anh, không phải của một bài ca nào viết sẵn, nên anh đứng
lại nhận nó.

> "Cậu quyết đi, Operator. Tôi chém."

Cú máy phải khác Yuki cho bằng được: **tuyệt đối không orbit**. Wide tĩnh, rồi snap dolly-in đúng
lúc chém.

### Prompt

```
Anime battle ultimate cut-in for a dark cyberpunk RPG. 5 seconds, 16:9, FOUR hard-cut shots.
This must NOT be one continuous static camera.

=== CAST — exactly ONE person appears in this entire video ===
[1] RONIN — a young man, messy black hair, a black tactical rebreather mask covering the lower half
of his face with one glowing red lens on the cheek, one visible amber eye, a small tattoo on his
neck, a long black hooded coat with burnt-orange brush-stroke markings on the shoulder, a battered
plain steel forearm guard, heavy gloves.
He has NO cybernetic limbs, NO implants and NO halo ring — he is fully human and this matters.
FORBIDDEN: a second Ronin, a clone, a twin, a reflection, a person-shaped shadow, any extra person,
any crowd. His target is never shown on screen.

=== PROPS — complete list, nothing else exists ===
[A] one plain steel katana and its black scabbard at his left hip. The blade does not glow on its
own — it only catches a hot white line of reflected neon along the edge. It is always either in his
hand or in the scabbard, and never floats, never flies, never duplicates.
FORBIDDEN: a glowing energy blade, a second sword, a gun, any cybernetic arm.

=== SETTING ===
A narrow neon street at night in heavy rain, orange sparks drifting, near-black.

=== SHOTS ===
SHOT 1 — 0.0-1.0s
IN FRAME: Ronin standing completely still (black hooded coat, red mask lens), rain, the sheathed
katana at his hip with his left thumb resting on the guard. Nothing else.
CAMERA: medium wide, low, extremely slow push-in. No shake.
ACTION: he does not move at all. Rain runs off the hood. Only the red lens on his mask brightens
slightly. The stillness is the tension.

SHOT 2 — 1.0-1.8s
IN FRAME: his eyes and the red mask lens only. Nothing else.
CAMERA: hard cut to an extreme close-up, then a crash zoom.
ACTION: rain running down the mask. One slow blink. The amber eye fixes on something off-screen.

SHOT 3 — 1.8-3.3s
IN FRAME: Ronin side-on in a wide shot (black coat, rebreather mask), the wet street, the steel
katana. No target, no other person.
CAMERA: begins as a locked static wide, then on the cut it SNAP DOLLIES IN fast to a medium shot
and the frame shakes hard. The camera does NOT orbit him and does NOT circle him at any point.
ACTION: he steps forward once — into the attack instead of away from it — and draws in a single
motion: one diagonal downward cut, feet planted. The rain splits along the blade path. Sparks. The
frame goes pure white for two frames, then back.

SHOT 4 — 3.3-5.0s
IN FRAME: Ronin from the front at a low angle, held in the follow-through — sword down and out to
his side, blade shedding rain. Far behind him, heavily out of focus, orange sparks falling, never
resolving into a person.
CAMERA: low front angle, slow crane up, then settle.
ACTION: he holds the pose without moving. His shoulders rise once with a single breath. He does NOT
sheathe the sword and does NOT turn away. Dark held frame.

=== VOICE — only Ronin speaks. No narrator, no second voice ===
0.5s  (a slow controlled exhale through the rebreather)
2.4s  "This one is mine." — flat, low, quiet, exactly on the cut
4.5s  (one steady exhale, no words)
Adult male voice, low and level, muffled behind a rebreather mask. He never raises his volume and
never shouts.

=== SFX ===
Rain on metal. Total silence on the step forward. One clean steel draw. One heavy cut. Rain
returning as the last sound.

=== STYLE ===
2.5D cel-shaded anime key visual, sakuga action animation, thick rim light, heavy motion smear on
the cut frame, hard camera shake on the dolly-in, rain and sparks past the lens.
Palette: rust orange #E2703A, cold neon white, near-black #06070A. Volumetric rain haze, fine film
grain. Keep Ronin inside the central 80% of the frame. The first frame is already at peak intensity.

=== DO NOT RENDER ===
No subtitles, no captions, no burned-in text, no letters, no logo, no watermark, no UI, no name
plate, no second character, no clone, no reflection of Ronin, no crowd, no orbiting camera, no
glowing energy sword, no cybernetic arm, no halo ring, no blood, no gore.
```

---

## 10. FIELD PATCH — MUZZLE

*Rust · B · 125 Energy · heal · Hồi 120% ATK cho toàn đội (★ FAKE)*

### Mô tả chiêu

Bà Ba là một cánh cửa ô tô. Bà Nhất vỡ ở lò Foundry Row, Bà Hai vỡ ở hàng rào The Corp, và Junker
đã chở cả hai về chôn tử tế.

Muzzle không chữa ai bằng thuốc. Anh đóng Bà Ba xuống nền bê tông, ghì lấy, và cả tổ lùi về sau
lưng anh. Cái vòm bụi bật ra từ chỗ cánh cửa cắm xuống là chỗ trú: trong đó giáp rách được vá, máu
cầm lại, người ngã đứng dậy được. Anh gọi đó là vá dã chiến, và anh làm nó bằng cách đứng đúng một
chỗ.

Ba đòn đầu dội vào cánh cửa rồi văng ra. Đòn thứ tư thì không. Đòn thứ tư anh nhận bằng vai, vì
mười bốn năm gác cổng dạy anh đúng một điều: chỗ nào có người đi qua thì phải có người đứng lại.

> "Bà Ba chịu được ba đòn. Đòn thứ tư là phần của tôi."

Chiêu `heal` nên nhịp 3 không có flash trắng và không có mục tiêu — thay bằng vòm sáng ấm lan ra,
máy cẩu lên để lộ nó rộng tới đâu.

### Prompt

```
Anime battle ultimate cut-in for a dark cyberpunk RPG. 5 seconds, 16:9, FOUR hard-cut shots.
This must NOT be one continuous static camera. This is a defensive support ability, not an attack:
no slash, no explosion, no white impact flash anywhere in this video.

=== CAST — exactly ONE person appears in this entire video ===
[1] MUZZLE — a heavy, broad-shouldered man, short dark hair, an old rubber gas mask with two round
glowing YELLOW eye lenses, a long dark navy coat and cape, a leather harness loaded with pouches,
tattoos on his left forearm, one battered chrome mechanical right forearm with exposed tubing,
thick work gloves, heavy boots, salvage tools strapped across his back.
FORBIDDEN: a second Muzzle, a clone, a twin, a reflection, a person-shaped shadow, any extra person,
any crowd, any teammates. His team is never shown on screen — only the light that reaches them.

=== PROPS — complete list, nothing else exists ===
[A] THE SHIELD — one battered white car door used as a shield: dented, rust-streaked, with a
cracked window still in it. It is ALWAYS either in his left hand or planted edge-first in the
ground. It never floats, never flies, never duplicates, and the camera never travels with it.
FORBIDDEN: a proper riot shield, a military shield, a second shield, a gun, a sword, weapons in
the air.

=== SETTING ===
A scrapyard lot at night, broken concrete, one distant sodium floodlight, near-black.

=== SHOTS ===
SHOT 1 — 0.0-1.0s
IN FRAME: his boots, the bottom edge of the car door, the concrete floor. No face, no full body.
CAMERA: extreme low angle, lens resting on the ground, hard shake on the impact.
ACTION: he plants one boot and drives the car door edge-first into the concrete. A ring of dust
punches outward along the floor. Cracks spread from the impact point.

SHOT 2 — 1.0-1.9s
IN FRAME: the two glowing yellow lenses of his gas mask, seen through hanging dust. Nothing else.
CAMERA: hard cut to an extreme close-up, crash zoom through the dust.
ACTION: the yellow lenses brighten. Nothing else moves.

SHOT 3 — 1.9-3.4s
IN FRAME: Muzzle from behind (navy cape, gas mask, the planted car door), the concrete floor, and a
low amber dome of light spreading outward across it. Nobody inside the dome.
CAMERA: crane UP and pull back from behind him, revealing how far the amber light spreads. It does
NOT orbit and does NOT push in.
ACTION: warm amber light snaps outward from the base of the car door across the whole floor. Three
bright white impacts spark off the face of the door in quick succession and bounce away. He does
not move at all.

SHOT 4 — 3.4-5.0s
IN FRAME: Muzzle from the front at a low angle (gas mask, yellow lenses, the car door braced),
amber light, falling dust. Nothing else.
CAMERA: low front angle, slow push-in, small settle.
ACTION: a fourth impact lands — it misses the door and hits his shoulder. His body absorbs it; he
shifts one boot back but does not fall. He drives the door down harder. The amber light closes over
the crack in the door. Dark held frame.

=== VOICE — only Muzzle speaks. No narrator, no second voice ===
1.2s  "Behind me."        — deep, calm, heavily muffled through the gas mask, no urgency at all
3.7s  (a short low grunt as the fourth hit lands)
4.4s  "Fourth one is mine." — quieter, matter-of-fact, not heroic
Older male voice, deep and slow, muffled by rubber. He never shouts and never sounds strained.

=== SFX ===
One enormous metal-on-concrete slam. A low dust boom. Three sharp ricochets off sheet metal. One
dull heavy body impact. Dust settling as the last sound.

=== STYLE ===
2.5D cel-shaded anime key visual, thick rim light, heavy dust and grit, hard camera shake on the
slam. Palette: warm amber, rust orange #E2703A, deep navy, near-black #06070A. Volumetric dust,
fine film grain. Keep Muzzle inside the central 80% of the frame. The first frame is already at
peak intensity.

=== DO NOT RENDER ===
No subtitles, no captions, no burned-in text, no letters, no logo, no watermark, no UI, no name
plate, no second character, no clone, no reflection of Muzzle, no crowd, no teammates, no enemies,
no explosion, no white impact flash, no blood, no gore.
```

---

## 11. PLAYBACK — ECHO

*Chrome · A · 100 Energy · nuke · 250% ATK một mục tiêu (★ FAKE)*

### Mô tả chiêu

Echo được xuất xưởng ba ngày sau khi Tài sản 07 rơi, mang dải giọng sao chép từ hồ sơ của Yuki.
Việc của cô là đứng ở các miệng cống nối lên Spire mà gọi: về nhà đi. Bằng giọng của một người cô
chưa từng gặp. Cô làm ba đêm. Đêm thứ tư cô nghe lại băng, rồi cô cắt loa của chính mình.

Chiêu cuối của cô là mở lại cái loa đó.

Mặt Echo là một tấm màn hình. Bình thường nó vẽ một nét cười cong màu cyan. Khi cô bóc niêm phong
ở cổ, nét cười gãy thành một đường sóng nhọn, và cô nói đúng hai chữ bằng giọng đi mượn. Vòng sóng
bật ra khỏi người cô, bê tông nứt theo từng vòng, kính treo vỡ hết.

Rồi cô lấy tay bịt cái loa lại. Nhanh, như bịt miệng. Vì câu cuối cô nói là bằng giọng của chính
cô, và giọng đó nghe không giống chút nào.

> "Đừng nhìn tôi như nhìn chị ấy."

**Voice là chỗ hay nhất của nhân vật này: hai câu, hai giọng khác hẳn nhau.** Đừng để model trộn
hai giọng làm một.

### Prompt

```
Anime battle ultimate cut-in for a dark cyberpunk RPG. 5 seconds, 16:9, FOUR hard-cut shots.
This must NOT be one continuous static camera.

=== CAST — exactly ONE figure appears in this entire video ===
[1] ECHO — a slender white humanoid android in a white haori-style coat with bright cyan lining.
She has NO human face: her head is a smooth white helmet with a dark glass screen displaying a
glowing cyan curved smile and two small cyan eye dots. Two thin antennae. White armored limbs with
black joints, a sealed speaker port at her throat, a cyan cable trailing behind her.
FORBIDDEN: a second Echo, a clone, a twin, a reflection, any extra person, any crowd. She NEVER has
human skin, human eyes, a human mouth or a human face. Her target is never shown on screen.

=== PROPS — complete list, nothing else exists ===
[A] her face screen. The glowing cyan glyph on it changes: a curved smile in SHOT 1, then a flat
line, then a sharp spiking waveform in SHOT 3, then a stuttering smile in SHOT 4.
[B] the sealed speaker port at her throat: torn open in SHOT 2, clamped shut by her own hand in
SHOT 4.
[C] concentric cyan sound rings — these are LIGHT ONLY. They are never solid, never objects, never
glass, never metal.
FORBIDDEN: swords, guns, any weapon. She never holds anything.

=== SETTING ===
A cold empty machine hall with hanging glass panels, near-black.

=== SHOTS ===
SHOT 1 — 0.0-1.0s
IN FRAME: her face screen only (cyan smile curve on dark glass, two antennae). Nothing else.
CAMERA: slow push-in to an extreme close-up. Dead silence.
ACTION: the cyan smile curve flickers, glitches, and collapses into a flat horizontal line.

SHOT 2 — 1.0-1.9s
IN FRAME: her throat, her hand, and the sealed speaker port. No face screen, no background.
CAMERA: hard cut to a low close-up, then a fast whip as her hand moves.
ACTION: her fingers hook under the seal on her speaker port and tear it off. Cyan light spills out
of the opening.

SHOT 3 — 1.9-3.4s
IN FRAME: Echo small in the centre of a wide high shot (white coat, cyan lining), the machine hall
floor, and concentric cyan rings blasting outward from her. No other person.
CAMERA: fast crane-out and upward — the camera is shoved backwards by the wave. It does NOT orbit
her and does NOT follow the rings.
ACTION: concentric cyan sound rings blast outward across the floor. Each ring front cracks the
concrete and shatters the hanging glass panels. Her face screen shows a sharp spiking waveform.
The frame goes pure white for two frames, then back.

SHOT 4 — 3.4-5.0s
IN FRAME: Echo close, her own hand clamped hard over the speaker port at her throat, and her face
screen. Nothing else.
CAMERA: hard cut to a close low angle, slow push-in, settle.
ACTION: she claps her hand over the port and shuts it. The rings die instantly. The cyan glyph on
her face screen tries to return to a smile curve and stutters, failing twice before it holds.
Dark held frame.

=== VOICE — only Echo speaks, but in TWO COMPLETELY DIFFERENT VOICES ===
1.5s  "Come home."          — a bright girlish young voice, but flat and hollow, with a faint
                              digital doubling artifact. It is a copied voice: it should sound
                              borrowed, not felt.
4.3s  "...that is not mine." — a completely different voice: thin, quiet, small, hesitant,
                              unmistakably NOT the first voice.
The contrast between the two voices is the entire point of this character. Do not blend them and
do not use the same voice twice.

=== SFX ===
Total silence in shot 1. A seal tearing. One enormous pure tone that bends downward. Glass
shattering in waves. A hard clap as she covers the port. Ringing silence as the last sound.

=== STYLE ===
2.5D cel-shaded anime key visual, sakuga action animation, thick rim light, heavy motion smear on
the fast frames, glass shards and dust past the lens.
Palette: cyan, cold white #DCE6F7, violet #7C4DFF, near-black #06070A. Volumetric haze, fine film
grain. Keep Echo inside the central 80% of the frame. The first frame is already at peak intensity.

=== DO NOT RENDER ===
No subtitles, no captions, no burned-in text, no letters, no logo, no watermark, no UI, no name
plate, no second character, no clone, no reflection of Echo, no crowd, no human face on her,
no weapons, no blood, no gore.
```

---

## 12. OVERCLOCK — WIRE

*Chrome · B · 75 Energy · nuke · 220% ATK một mục tiêu (★ FAKE)*

### Mô tả chiêu

Tám năm ở ca đêm xưởng Halo, chừng chín trăm vòng, Wire nhớ số lô từng cái. Cô biết chính xác cái
vòng trên đầu đối thủ chịu được tới đâu, vì rất có thể chính tay cô lắp nó.

Cô không chém, không bắn. Cô với tay ra, bắt lấy dòng điện chạy trong vòng Halo của mục tiêu, rồi
vặn nó lên. Vặn quá ngưỡng. Bàn tay xương phát sáng cyan nắm lại, giật xuống, và cái vòng quay
nhanh dần cho tới lúc nó tự nướng chín thứ nó đang đội.

Cả chiêu cô nói ba câu, cả ba đều là nói với cái máy. Câu cuối là một lời xin lỗi, và nó không dành
cho người đang gục xuống.

> "Ngoan nào. Đừng rò điện."

### Prompt

```
Anime battle ultimate cut-in for a dark cyberpunk RPG. 5 seconds, 16:9, FOUR hard-cut shots.
This must NOT be one continuous static camera.

=== CAST — exactly ONE person appears in this entire video ===
[1] WIRE — a young woman with very long straight white hair glowing faint cyan, dark smoky eye
makeup, a small absent-minded smile, tiny cyan connector pins along her temple, a black bodysuit
with thin red circuit lines, an oversized grey work jacket covered in patches and stitched labels,
a tool belt with a small device, a tattoo on her right shoulder. Her hands and forearms are
transparent glowing cyan skeletal mechanical prosthetics.
FORBIDDEN: a second Wire, a clone, a twin, a reflection, a person-shaped shadow, any extra person,
any crowd. Her target is never shown on screen.

=== PROPS — complete list, nothing else exists ===
[A] her cyan skeletal hands — glass and light, always attached to her arms, never detached.
[B] THE CURRENT — this is NOT an object. It is a single thin cyan thread of electricity running
from her fist out of frame. It is never a rope, never a cable that flies, never a whip, never a
weapon, never a solid object, and the camera never travels along it.
FORBIDDEN: a gun, a sword, thrown tools, floating machinery, flying cables.

=== SETTING ===
A narrow dark maintenance corridor lit by cyan service lamps, near-black.

=== SHOTS ===
SHOT 1 — 0.0-1.0s
IN FRAME: her right hand only — the transparent cyan skeletal fingers — with current jumping
between the fingertips. No face, no background detail.
CAMERA: macro close-up. The camera slowly ROLLS around the hand. No push-in, no orbit of her body.
ACTION: the fingers flex open one at a time. Small arcs of cyan current snap between the fingertips.

SHOT 2 — 1.0-1.9s
IN FRAME: her face only (white hair, dark eye makeup, faint smile), lit cyan from below. Nothing
else.
CAMERA: hard cut to an extreme close-up, crash zoom.
ACTION: her eyes flick side to side, reading something we cannot see. The smile is small and
absent-minded, the way people smile at a machine and not at a person.

SHOT 3 — 1.9-3.4s
IN FRAME: Wire (white hair, grey jacket, cyan skeletal hands), her fist, and one thin cyan thread
of current pulled taut out of frame right. No target, no other person, no flying object.
CAMERA: hard cut. The camera ROLLS 90 degrees, rotating the whole frame as the current races along
the thread. It does NOT orbit her and does NOT travel along the current.
ACTION: she snaps her hand shut and yanks downward. The cyan thread whips taut and current races
along it, going white-hot. The frame goes pure white for two frames, then back.

SHOT 4 — 3.4-5.0s
IN FRAME: her open hand, falling sparks, and her face at the edge of frame. Nothing else.
CAMERA: hard cut to a medium close-up, slow pull back, settle.
ACTION: her hand opens and the thread frays and falls apart in sparks. She lowers the hand and
looks at it — not at anything else. The cyan skeleton in her fingers dims down to almost nothing.
Dark held frame.

=== VOICE — only Wire speaks. No narrator, no second voice ===
1.4s  "Easy. Easy—"  — quick, gentle, muttered to a machine and not to a person
3.1s  "—too much."   — flat and quiet, as the current burns through
4.4s  "Sorry."       — soft, and she is saying it to the hardware, not to the person
Young female voice, quick and light, talking half to herself. Never aggressive, never triumphant.

=== SFX ===
Small electrical ticks. A rising transformer whine. One hard snap. A long descending burnout hiss.
Sparks falling as the last sound.

=== STYLE ===
2.5D cel-shaded anime key visual, sakuga action animation, thick rim light, heavy motion smear on
the fast frames, sparks past the lens.
Palette: cyan, violet #7C4DFF, cold white #DCE6F7, near-black #06070A. Volumetric haze, fine film
grain. Keep Wire inside the central 80% of the frame. The first frame is already at peak intensity.

=== DO NOT RENDER ===
No subtitles, no captions, no burned-in text, no letters, no logo, no watermark, no UI, no name
plate, no second character, no clone, no reflection of Wire, no crowd, no flying cable, no weapon,
no blood, no gore.
```

---

## 13. SUTURE — STITCH

*Rust · S · 100 Energy · heal · Hồi 150% ATK cho toàn đội (★ FAKE)*

### Mô tả chiêu

Stitch mất giấy phép vì vá cho một unit đào ngũ rồi mở cửa sau cho nó đi. Giờ bà mở phòng khám
trong một cái container cạnh bãi xe, ai trả gì cũng nhận, kể cả trả bằng một câu chuyện.

Chiêu cuối của bà đúng nghĩa đen là khâu. Bốn cánh tay phẫu thuật trên lưng bung ra cùng lúc, mỗi
cánh một cây kim cong, và bốn sợi chỉ bắn đi bốn hướng khắp sân. Chỉ căng, thắt lại một cái, và
vết thương của cả tổ đóng miệng cùng một lúc.

Xong việc bà cắn đứt sợi chỉ cuối, phủi tay vào tấm tạp dề. Tay áo bà dày cộm những mũi khâu cũ —
mỗi mũi là một bệnh nhân bà không giữ được. Hôm nay bà không khâu thêm mũi nào.

> "Nằm yên. Tôi khâu người còn khéo hơn khâu máy."

### Prompt

```
Anime battle ultimate cut-in for a dark cyberpunk RPG. 5 seconds, 16:9, FOUR hard-cut shots.
This must NOT be one continuous static camera. This is a support ability, not an attack: no slash,
no explosion, no white impact flash anywhere in this video.

=== CAST — exactly ONE person appears in this entire video ===
[1] STITCH — an older woman around sixty, grey hair pinned up in a loose bun, a pen tucked behind
one ear, green-lensed surgical goggles pushed up on her forehead, a white shirt with rolled
sleeves, a heavily blood-stained clear plastic surgical apron, a harness carrying FOUR articulated
mechanical surgical arms folded over her shoulders, syringes and forceps clipped to her belt, a
green fluid vial, a faded tattoo on her right forearm. The right sleeve of her shirt is thick with
dense rows of old hand-stitching.
FORBIDDEN: a second Stitch, a clone, a twin, a reflection, any extra person, any crowd, any
patients. Her team is never shown on screen — only the threads that reach them.

=== PROPS — complete list, nothing else exists ===
[A] the four mechanical surgical arms, always attached to her harness. EXACTLY FOUR, never five,
never three, never detached, never flying free.
[B] four glowing amber-green suture threads — thin lines of light only. Never ropes, never chains,
never cables, never solid objects.
FORBIDDEN: guns, swords, a fifth arm, floating tools, thrown instruments.

=== SETTING ===
A cramped scrapyard clinic inside a shipping container at night, one work lamp, near-black.

=== SHOTS ===
SHOT 1 — 0.0-1.0s
IN FRAME: her back and shoulders and the four surgical arms unfolding one at a time. No face.
CAMERA: low angle from behind, slow crane up.
ACTION: the four arms unfold over her shoulders with mechanical clicks, each ending in a curved
surgical needle that catches the lamp light.

SHOT 2 — 1.0-1.9s
IN FRAME: her hand, the green goggle lenses, and her eyes. Nothing else.
CAMERA: hard cut to a macro close-up, then a rack focus from the goggle lens to her eyes behind it.
ACTION: she pulls the green surgical goggles down over her eyes with one hand. She is not looking
at the camera; she is looking at work.

SHOT 3 — 1.9-3.4s
IN FRAME: Stitch (grey bun, bloody apron, four arms), the container floor, and four glowing
amber-green threads firing outward in four directions. Nobody at the ends of the threads.
CAMERA: fast LATERAL TRACKING shot sweeping sideways past her. It does NOT orbit and does NOT push
in.
ACTION: the four arms fire four glowing threads outward in four different directions. The threads
snap taut all at once and cinch. Warm amber-green light runs along them outward from her.

SHOT 4 — 3.4-5.0s
IN FRAME: Stitch close — her mouth, one thread, her hand, and her heavily stitched sleeve. Nothing
else.
CAMERA: hard cut to a close shot, slow push-in onto the sleeve, settle.
ACTION: she catches the last thread in her teeth and bites it off with a short jerk of her head.
She flicks the needle aside and wipes her hand down the bloody apron. The camera settles on her
sleeve, thick with rows of old stitches. Dark held frame.

=== VOICE — only Stitch speaks. No narrator, no second voice ===
1.3s  "Hold still."      — brisk, flat, an order and not a kindness
3.6s  (a short grunt through her teeth as the threads pull taut)
4.4s  "Not on my table." — dry, final, faintly annoyed
Older female voice, roughened, unhurried, entirely unsentimental. She never softens and never
raises her volume.

=== SFX ===
Four mechanical arms unfolding and locking. Goggles snapping down. Four threads whipping taut in
unison. One wet cinch. Thread snapping between teeth as the last sound.

=== STYLE ===
2.5D cel-shaded anime key visual, thick rim light, one hard work-lamp source, heavy motion smear
on the thread frames. Palette: warm amber-green, rust orange #E2703A, near-black #06070A.
Volumetric haze, fine film grain. Keep Stitch inside the central 80% of the frame. The first frame
is already at peak intensity.

=== DO NOT RENDER ===
No subtitles, no captions, no burned-in text, no letters, no logo, no watermark, no UI, no name
plate, no second character, no clone, no reflection of Stitch, no crowd, no patients, no enemies,
no explosion, no white impact flash, no gore.
```

---

## 14. Sau khi có video

1. Hạ về 1280×720 bằng lệnh `ffmpeg` ở mục 1, đặt tên `<id>_ult.mp4` cạnh `index.html`.
2. `ROSTER` trong `js/data.js` đã trỏ sẵn `ultVideo` cho cả chín nhân vật có art. Thiếu file thì
   `resolveVideo` trả `null` và trận bỏ qua cut-in, không vỡ.
3. Kiểm bằng cách vào trận, dồn đủ Energy, bấm ULT. Xem lại năm thứ: mép trái/phải có cắt mất
   tay/kiếm không, frame đầu có bị tối rồi mới sáng không, frame cuối có đứng yên không, có nhân
   vật thừa nào không, và thoại có bị cắt cụt không.
4. Còn 10 nhân vật chưa có art. Khi có art thì dùng lại mục 2 (bốn nhịp + bảng cú máy riêng),
   mục 3 (tám luật vật thể) và mục 4 (voice), chỉ thay `CAST` / `PROPS` / động tác / bảng màu
   theo phe. Cú máy ở nhịp 3 phải là cú chưa ai trong bảng dùng.

---

## 15. Chiêu cuối của kẻ địch (11/09)

Kẻ địch giờ cũng có chiêu cuối, dùng chung toàn bộ đường ống với đội mình: cùng hộp holo trên đầu, cùng `ultCutin`,
cùng tên file `video/<id>_ult.mp4`. Khai trong `ENEMY_POOL` (`js/data.js`), không phải sửa engine:

```js
{ id:'glassjaw', …,
  ult:{ name:'ELECTRIC DRAGON PUNCH', cost:50, kind:'nuke', flat:200, fx:'shock', desc:'…' },
  ultVideo:['video/glassjaw_ult.mp4','art-src/ENEMY/glassjaw ultimate.mp4'], ultRatio:3/4 }
```

| Trường | Nghĩa |
|---|---|
| `cost` | Energy cần có. `energyMax` của con đó tự đặt bằng `cost` |
| Nạp Energy | **đầu mỗi lượt của nó** cộng `RULES.foeUltGain` (25). Glass Jaw (cost 50) tung ở lượt thứ 2 của nó, Kiln (cost 75) ở lượt thứ 3 |
| Telegraph | Bảng unit của địch hiện thanh Energy + nhãn `READY` như đội mình — người chơi thấy trước và có thể dồn đòn giết nó trước khi nó tung |
| `kind:'nuke'` + `flat` | Sát thương **cố định**: bỏ qua ATK, variance, chí mạng, passive và độ khó sector. Mục tiêu chọn ngẫu nhiên trong đội mình như đòn thường |
| `kind:'shield'` + `shieldPct` | Lá chắn cho chính nó = `shieldPct` × HP tối đa của nó. Không đếm lượt: hút sát thương tới khi vỡ. Chồng thêm nếu tung lại |
| `fx` | Overlay nổ trên mục tiêu (nuke) hoặc trên chính nó (shield) |
| `ultRatio` | Tỉ lệ khung video nếu không phải 16:9 |

Bị Psalm chiếm quyền điều khiển (`APOSTASY`) thì lượt đó nó đánh đồng bọn và **không** tung chiêu; Energy giữ nguyên
cho lượt sau. Đã có video: `glassjaw` (cú đấm điện hình rồng), `kiln` (bão lửa). Prompt cho con tiếp theo: dùng lại
mục 2–4, ảnh tham chiếu là `art-src/CARD/<id>.png`.
