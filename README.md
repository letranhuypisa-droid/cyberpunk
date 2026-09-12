# CHROMEFALL

Web gacha turn-based cyberpunk, màn hình dọc. Prototype v0.3: nhân vật chính **Yuki**, đội 3 người, chọn mục tiêu rồi trượt tới đánh (kiểu Idle Heroes),
thứ tự lượt theo SPD, chí mạng theo CRIT, trạng thái choáng/độc/cháy với overlay hiệu ứng, video chiêu cuối chiếu trên đầu nhân vật
(**kẻ địch cũng có chiêu cuối**: Glass Jaw đấm điện 200 dmg, Kiln dựng lá chắn),
truyện kể bằng trang comic, hệ thống skill/passive, Tutorial + Chương 1 (5 màn). Chương 2–3 đang phát triển.

## Chạy

Cần một static server để ảnh/video/âm thanh load được (mở file trực tiếp sẽ thiếu asset):

```bash
python -m http.server 8765
```

rồi mở `http://localhost:8765/index.html`. UI kit và token: `kit.html`. Nút DEV +1000 SH ở gacha chỉ hiện khi thêm `?dev` vào URL.
Kiểm DẸP LOẠN mà không phải qua tiêu đề: `python scratch/riot_serve.py` rồi mở `http://127.0.0.1:8802/` (xem mục DẸP LOẠN).

## Cấu trúc

| Đường dẫn | Nội dung |
|---|---|
| `index.html` | Bản chơi: markup mọi màn hình + overlay comic |
| `kit.html` + `js/kit.js` | UI kit: component, token, roster, bestiary (demo, không nạp trong bản chơi) |
| `css/chromefall.css` | Token thiết kế (Chrome/Rust/tier/ngữ nghĩa, sáng + tối) và toàn bộ giao diện; khối `v0.3` ở cuối: chọn mục tiêu, lao vào, hint, comic, archive |
| `css/fx.css` | Overlay hiệu ứng đòn đánh/trạng thái (placeholder vẽ bằng CSS, `.fx--sheet` khi có ảnh) + hộp holo video chiêu cuối `.holo` |
| `js/core.js` | Tiện ích DOM, thẻ nhân vật (`cardEl`), loader ảnh/video có fallback, hộp phát video `.cutin` dùng chung (ult trong trận, mở rương ở gacha), thanh HP/Energy, theme |
| `js/data.js` | **Số liệu & hồ sơ**: roster (ATK/HP/SPD/CRIT, skill + fx/status, passive), kẻ địch (`FOE_STATS`, `FOE_SKILL`, `ult`), **chiêu mộ** (`RECRUIT_*` — nạp kẻ địch chương 1 vào `ROSTER` thành đơn vị chơi được), chương/sector, **`RIOT`** (dẹp loạn), `RULES` (move, holo, foeUltGain), hồ sơ người chơi (v3, tự chuyển từ v2), lore, bonds, **`BANNER`** (một bể gacha; khoá theo chương + `beaten()` cho quân chiêu mộ). Sửa ở đây. |
| `js/story.js` | **Comic từng màn**: trang, panel, bong bóng cho intro/outro của 00-T → 07-E. Sửa lời thoại ở đây. |
| `js/comic.js` | Renderer trang comic: layout panel, ảnh + fallback, bong bóng hiện dần, lật trang, SKIP |
| `js/state.js` | Lưu/nạp hồ sơ (`SAVE`, local hoặc remote), nâng cấp (`UPGRADE`), **`unitStats(id)`** — một chỗ duy nhất tính chỉ số cuối (gốc × cấp × cyberware) và `baseStats(id)`, và `power(id)`/`teamPower()`, nhiệm vụ ngày |
| `js/audio.js` | SFX giao diện (audio/*.ogg) + âm chiến đấu: có `audio/<tên>.ogg\|mp3\|wav` thì dùng file, thiếu thì tổng hợp WebAudio. Một thao tác = một tiếng (`SFX_ONE`/`SFX_BEAT`); `SFX_VARIANTS` cho tiếng nhiều bản (`hit`, `hit2`…); `SFX_MUTE` cho nút không kêu |
| `js/fx.js` | Overlay hiệu ứng trên sprite: một lần (hit/crit/nổ/điện/độc/cháy/choáng/hồi máu/lá chắn) và lặp theo trạng thái + lá chắn; tự dùng sprite sheet `art/fx/<kind>.webp` nếu có |
| `js/battle.js` | Engine trận: lưới sân 3 hàng mỗi phe (`FORMATION`, không ai chồng lên ai) + `stageScale()` đặt `--big`, bảng nội tại chạm-để-đọc (`openPassive`), passive, lượt theo SPD, chế độ chọn mục tiêu, di chuyển tới mục tiêu kiểu Idle Heroes (`playMoveAttack`), sát thương + chí mạng, lá chắn (`addShield`/`absorbShield`), trạng thái choáng/độc/cháy (`applyStatus`/`tickStatus`), ult + video holo trên đầu nhân vật (`playHolo`), chiêu cuối của địch (`enemyUlt`), wave (hồi máu giữa wave), hint tutorial. `finish()` tách nhánh thưởng theo `SECTOR.mode` (chiến dịch / `'riot'`) |
| `js/app.js` | Router màn hình, lobby, squad (3 slot, lưu đội, **khoá người đang đồn trú**), sector, thang tầng dẹp loạn (`renderRiot`), gacha một bể, archive (5 tab: Nhân vật · Sổ bộ · Địa danh · Thuật ngữ · Truyện; `openLore` dùng chung cho nhân vật lẫn kẻ địch), config, COMMS |
| `js/riot.js` | **DẸP LOẠN — chiếm bãi**: 9 cái bãi ở District 07 (`RIOT_YARDS`), kinh tế (`RIOT_ECON`), sức mạnh ổ neo vào số đo `m50`, đồn trú, kiện hàng theo chu kỳ, phản kích, nâng bãi, hợp đồng tuần. Số liệu sửa ở đây |
| `js/riotui.js` | Màn bản đồ Khu Đáy + tờ chi tiết một bãi + chọn quân đồn trú + báo cáo vắng mặt; bản đồ dự phòng vẽ bằng SVG. Bọc `winReward`/`finish` của `battle.js` để cộng thưởng trận chiếm bãi (không sửa `battle.js`) |
| `js/cyber.js` | **CYBERWARE**: 6 ô × thang 10 bậc = 60 món (`CYBER_SLOTS`), đường cong chỉ số, giá, ví **LINH KIỆN (LK)**, phân tách bản dư, trần của RONIN. Nối vào chỉ số qua `cyberBonus(id)` — `unitStats` gọi đúng một chỗ này |
| `js/cyberui.js` | Màn CYBERWARE: chọn nhân vật → chọn ô → xem cả thang 10 bậc → nâng bậc; tờ phân tách bản dư. Ảnh món `art/cyber/`, chưa có thì vẽ icon SVG của ô |
| `js/data_later.js` | Dữ liệu chương 2–3 bản cũ (không nạp), giữ để viết lại quanh Yuki |
| `scratch/key_frame.py` | Tách nền frame sprite (idle/attack/hurt), in `box` để dán vào `ROSTER` |
| `scratch/ult_lint.js` | Soát chiêu cuối: số trong `desc` có khớp `mult`/`hits`/`shieldPct`/`healPct`/`flat`/`drainEnergy` không, `energyMax` có bằng `ult.cost` không, và bản chiêu mộ có còn viết theo giọng phía địch không. Thoát mã 1 nếu lệch |
| `scratch/sprite_size.py` | Đo sprite theo % hộp 682 và in sẵn hai bảng để dán vào `js/data.js`: **`BODY_H`** = chiều cao NGƯỜI (bào mòn 41px nên bỏ hào quang / nòng súng) để mọi người cao bằng nhau, **`ART_H`** = chiều cao NÉT VẼ tính từ mặt sàn, để lưới sân chừa đủ chỗ |
| `scratch/recruit_table.js` | Dò bảng quy đổi kẻ địch → đơn vị chơi được: in chỉ số sau quy đổi cạnh băng chỉ số nhân vật cùng bậc, đánh dấu con lệch băng (`--bad` chỉ in con lệch) |
| `scratch/fx_sheet.py` | Video/gif nền xanh → sprite sheet hiệu ứng `art/fx/<kind>.webp` (ô vuông 256, 6 cột) |
| `scratch/sfx_install.py` | File SFX sinh bằng AI (`art-src/SFX/*.mp3\|m4a`) → `audio/<tên>.ogg`: cắt im lặng, chuẩn hoá đỉnh −1 dB, mono ogg (`--dry` để chỉ đo) |
| `scratch/sfx_synth.py` | Tổng hợp offline sáu tiếng chưa có bản thu (`tell`, `tell_up`, `tell_down`, `reveal_a`, `new_char`, `hit3`) → `art-src/SFX/<tên>.wav`, Python thuần; sửa số trong script rồi chạy lại `sfx_install.py` là đổi được tính cách (`docs/sfx-prompts.md` §10) |
| `scratch/sfx_compare.py` | Đo đặc tính file SFX (dài, thời gian tới đỉnh, đuôi vang, độ sáng, số nhịp) để so bản mới với bản đang dùng |
| `scratch/sfx_ab.html` | Trang nghe đối chiếu SFX: bản đang dùng cạnh bản kia, âm lượng đã cân — mở bằng preview `static-sfx` |
| `scratch/key_enemy.py` | Tách nền hàng loạt ảnh idle kẻ địch (`art-src/ENEMY/<id>.png` → `art/sprite/<id>_idle.png`), tự chọn cỡ theo rank, in `box` cho `FOE_SPRITE` |
| `scratch/sim.js` | Mô phỏng trận bằng Node để cân bằng `mult` từng sector (cùng luật SPD/crit/trạng thái; `SIM_PATCH` để thử số khác) |
| `scratch/cyber_sheet.py` | Cắt 6 tấm contact sheet CYBERWARE (lưới 5×2) → 60 WebP nền trong `art/cyber/<ô><bậc>.webp`; tự dò nền (alpha / xanh / trắng), số đo bố cục thẻ trong `INNER` |
| `scratch/comic_lint.js` | Soát comic: người nói, bong bóng, tên file panel so với `docs/comic-prompts.md` |
| `scratch/comic_measure.js` | Đo chữ trong bong bóng/caption từng panel |
| `scratch/art_audit.js` | Kiểm kê art/animation còn thiếu cho chương 1 (thẻ, chân dung, pose sprite, video ult, nền, panel) |
| `docs/story.md` | Thế giới, nhân vật, Tutorial + Chương 1, dàn ý chương 2–3, quy tắc viết tiếng Việt |
| `docs/characters.md` | Hồ sơ 19 nhân vật + nhận dạng art |
| `docs/characters-kit.md` | Lore + đòn thường + chiêu cuối + nội tại của cả 19 nhân vật, gộp một chỗ (bản `.en.md` là bản tiếng Anh song song) |
| `docs/glossary.md` | Từ điển thuật ngữ: địa điểm, tổ chức, công nghệ, vũ khí, thuật ngữ trận và giao diện (kèm cách gọi tiếng Anh) |
| `docs/skill-naming.md` | Luật đặt tên chiêu và viết mô tả (đo từ 865 tên chiêu LMHT bản Việt) + đề xuất đổi tên, **chưa áp vào code** |
| `docs/comic-prompts.md` | Quy cách ảnh panel comic + prompt cho từng panel (tên file `art/comic/…`) |
| `docs/bg-prompts.md` | Prompt sinh ảnh nền và quy tắc zoom/chân trời |
| `docs/ult-prompts.md` | Quy cách video cut-in chiêu cuối + prompt từng nhân vật |
| `docs/plan-2026-09.md` | Đánh giá hiện trạng 07/09 + kế hoạch tháng 9 (mục tiêu: hoàn thành chương 1 trước 30/09) |
| `docs/dep-loan.md` | **DẸP LOẠN**: thiết kế 9 cái bãi, đóng quân, kiện hàng, phản kích, nâng bãi, hợp đồng tuần + số cân bằng đo được + đặc tả giao diện + prompt bản đồ District 07 |
| `docs/cyberware.md` | **CYBERWARE**: 6 ô × 10 bậc = 60 món, đường cong chỉ số, giá LK/CR, phân tách bản dư, trần của RONIN, quy cách 6 tấm contact sheet |
| `docs/enemy-prompts.md` | Prompt art 21 kẻ địch chương 1 + đề xuất nội tại/lore cho địch |
| `docs/hero-prompts.md` | Prompt art 10 nhân vật gacha chưa có ảnh (thẻ + sprite nền xanh), kèm đề xuất tạo hình từng người |
| `docs/fx-prompts.md` | Overlay hiệu ứng: cách chạy, tên file thay thế, quy cách sheet + prompt; luật trạng thái; SPD/CRIT; hộp holo; di chuyển kiểu Idle Heroes |
| `docs/sfx-prompts.md` | Âm thanh: 13 tiếng trong trận + 8 tiếng giao diện, tên file, độ dài, prompt ElevenLabs; chỗ còn im lặng |

Mọi số liệu cân bằng đánh dấu `★ FAKE` là bản nháp.

## Asset

Mọi ảnh nằm trong `art/`, video trong `video/`, ảnh gốc chưa xử lý trong `art-src/` (không đưa lên repo).
Thả file đúng tên vào đúng thư mục là game tự dùng — không cần sửa code.

| Thư mục | Đựng gì | Quy cách |
|---|---|---|
| `art/card/` | **Art thẻ**: key art nhân vật `<id>.jpg`, chân dung cắt `<id>_portrait.jpg`, art kẻ địch `<id>.jpg` | dọc 9:16, có nền, JPEG q90 4:2:0. Ngang ≤ 1152 px (khung game rộng tối đa 560 CSS px → 1152 đã là mật độ 2×); địch giữ nguyên 768×1360. Bản gốc PNG cất ở `art-src/CARD/`, chuyển bằng `python scratch/card_web.py`. Chân dung = cắt phần trên art thẻ (đầu → ngang hông), q90 ≤ 400 KB |
| `art/sprite/` | Frame trong trận `<id>_idle/attack/crit/hurt/die.png` (`crit` = đòn chí mạng, `die` = gục; đều tuỳ chọn; không cần `dash`) | **tách nền**, cao 682px (pose giơ vũ khí có thể cao hơn), chân chạm đáy |
| `art/fx/` | Overlay hiệu ứng `<kind>.webp` (một lần) và `<kind>_loop.webp` (lặp): hit, crit, explode, shock, poison, burn, stun, heal, shield | sprite sheet ô vuông 256 px, 6 cột, nền trong suốt — `docs/fx-prompts.md` |
| `art/bg/` | Nền sector `bg_<sector>.jpg` (+ `bg_base.jpg` cho màn COMMS ở HOME) | 3:4 dọc, 1536×2048; thiếu thì rơi về `art/bg/bg_battle.jpg` |
| `art/map/` | Bản đồ Halcyon `map_halcyon.jpg` | 9:16 dọc, 1152×2048; toạ độ nút tính theo % ảnh (`MAP_AREAS`) |
| `art/reveal/` | Mặt thẻ khi mở rương `<id>_reveal.jpg` | 1280×720, nhân vật đứng giữa |
| `art/comic/` | Ảnh panel comic `<sector>_<i\|o><trang>_p<panel>.jpg` (vd `00t_i1_p2.jpg`) | prompt từng panel ở `docs/comic-prompts.md` |
| `video/` | Cut-in chiêu cuối `<id>_ult.mp4` (cả nhân vật lẫn kẻ địch), video mở rương `<id>_reveal.mp4` | H.264 1280×720; video địch đang là 540×720 dọc (`ultRatio:3/4`) |
| `audio/` | SFX giao diện `select/cursor/open/swipe/error/glitch/cancel/close.ogg` + âm chiến đấu `hit/hit2/hit3/crit/kia/heal/ready/ult/wave/explode/shock/burn/poison/stun/shield` + tiếng phụ và nhịp gacha `victory/defeat/reveal_s/reveal_a/shield_break/upgrade/tell/tell_up/tell_down/new_char` (`.ogg`, `.mp3` hoặc `.wav`) | 25/25 tên đã có file, mono 44.1 kHz, 0.15–1.4 s, cắt hết im lặng ở đầu — `docs/sfx-prompts.md` |
| `art-src/` | Ảnh/video gốc theo thư mục nhân vật (`YUKI/`, `ASH/`, `Kai/`, `PSALM/`), `HERO/` (pose normal/crit/die mới của đội mình), `ENEMY/` (idle + pose của địch, video ult địch), `BG/` + `MAP/` (bản gốc chưa cắt của nền và bản đồ), `SFX/` (file âm gốc chưa cắt) | bản chưa hạ chuẩn |

- **Sprite trong trận** tách nền bằng `scratch/key_frame.py`
  (`python scratch/key_frame.py "art-src/YUKI/Yuki attack.png" art/sprite/yuki_attack.png 0.72`, dán `box` in ra vào `ROSTER`).
  Cần `idle` + `attack` (+ `hurt`); di chuyển giữ nguyên idle nên **không có frame dash** (đã xoá 11/09; `yuki_dash.png` cũ thành ảnh panel `art/comic/07e_i3_p2_fg.png`).
  Pose của đội mình (`<id>_idle/attack/crit/hurt/die.png`, ảnh tĩnh từ `art-src/HERO/`, bảng `HERO_SPRITE`): **Yuki · Psalm · Ash · Kai · Ronin đủ cả 5**
  (Ronin 11/09 cắt từ bảng 4 pose nên `ronin_idle.png` đang mượn frame đòn thường — chờ ảnh tư thế đứng).
  **Muzzle có art thẻ + chân dung nhưng chưa có sprite nào** → ngoài trận hiện đúng mặt, vào trận là bóng đen; quy cách bảng pose ở `docs/hero-prompts.md` §11.
  **Kẻ địch**: 21 con chương 1 có `art/sprite/<id>_idle.png` tách nền bằng `scratch/key_enemy.py`
  từ ảnh nền xanh trong `art-src/ENEMY/` (box trong `FOE_SPRITE`, `js/data.js`); ảnh gốc nhìn sang phải, engine tự lật. Idle animation (sprite sheet) đã bỏ 11/09.
  Tư thế của địch = ảnh tĩnh `<id>_attack/crit/hurt/die.png`: **21/21 con chương 1 có idle + attack + crit**, 20 có die (thiếu Chuột cống),
  18 có hurt (thiếu Archon, Cantor, Enforcer). Thiếu pose nào engine tự rơi về pose gần nhất.
  Script nhận cả ảnh chụp màn hình từ contact sheet (tự cắt viền, xoá nhãn số, bỏ mảnh ô kế bên) và tự khớp cỡ thân với idle.
  **Video chỉ còn dùng cho chiêu cuối** (`ultVideo`), không dùng cho sprite trong trận.
- **Overlay hiệu ứng** mặc định vẽ bằng CSS; thả `art/fx/<kind>.webp` là game dùng ảnh (animation chí mạng: `art/fx/crit.webp`).
  Làm sheet từ video nền xanh: `python scratch/fx_sheet.py in.mp4 art/fx/crit.webp`. Xem thử ở `kit.html` mục B9.
- **Video chiêu cuối** giờ chiếu trong hộp trên đầu người phát chiêu (`RULES.holo`), không phủ kín sân; video cũ dùng nguyên.
  Mặc định 16:9; def khai `ultRatio` thì dùng tỉ lệ riêng (hai video chiêu cuối của địch quay dọc 3:4, 540×720), hộp kẹp cao tối đa 50% sân.
- **Art thẻ kẻ địch** (`art/card/<id>.jpg`, đủ 21 con chương 1) hiện ở thanh lượt trong trận, chân dung người nói trong comic,
  panel comic của boss và bestiary `kit.html`. Thêm con mới: thả file + thêm id vào `FOE_ART` trong `js/data.js`.
- **Chân dung** ưu tiên `<id>_portrait.jpg` (bán thân, đọc rõ ở cỡ 30px); thiếu thì dùng thẳng key art `<id>.jpg`.
  Đủ 9 người có art (yuki, ash, kai, psalm, ronin, muzzle, echo, wire, stitch): cắt phần trên của bản gốc `art-src/CARD/<id>.png`
  (đầu → ngang hông, ~38–42% chiều cao thẻ, tuỳ người đứng gần hay xa trong ảnh gốc), lưu JPEG q90.
  Khung thẻ 3:4 hẹp hơn ảnh bán thân nên nó cắt hai bên chứ không cắt trên dưới — `pos` trong `ROSTER` không còn tác dụng ở khung này.
- **Video ult**: file gốc trong `art-src/<TÊN>/`, hạ chuẩn bằng lệnh ffmpeg trong `docs/ult-prompts.md` §1. Một nhân vật
  nhiều cut-in: thêm `<id>_ult2.mp4`… và khai `ultVideo:[[…],[…]]` trong `ROSTER`, game chọn ngẫu nhiên mỗi lần phát (Yuki có 2).
- **Mở rương**: `<id>_reveal.jpg` làm mặt thẻ khi quay ra (đã có: yuki, psalm, ash, kai); `video/<id>_reveal.mp4` phát trước khi
  lật thẻ (đã có: yuki). Khai `reveal` / `revealPos` / `revealVideo` trong `ROSTER`.

## Cân bằng

```bash
node scratch/sim.js 400                       # đội mặc định yuki,ash,kai
node scratch/sim.js 400 yuki,ash,psalm        # đội khác
node scratch/sim.js 400 yuki,ash,kai 07-D=1.0,07-E=1.1   # thử mult khác cho sector
node scratch/sim.js 200 yuki,ash,kai --riot 20            # dò 20 tầng HỐ LOẠN (đánh dấu ← TƯỜNG khi win < 40%)
node scratch/sim.js 400 yuki,ash,kai --yard [--lv 20]     # dò 9 cái bãi DẸP LOẠN: sức mạnh ổ, tỉ lệ thắng, nhãn
node scratch/riot_tune.js m50 200 [cấp]                   # đo lại m50 (độ khó thật của đội hình wave) sau khi sửa plan
node scratch/riot_tune.js plan 200                        # đo ngược `mult` cho đúng tỉ lệ thắng thiết kế
node scratch/riot_econ.js [hệ số quân] [ưu thế phe]       # thu nhập/giờ, hiệu suất theo số lần vào game, hồi vốn nâng bãi
node scratch/recruit_table.js                            # bảng quy đổi 20 kẻ địch chiêu mộ
node scratch/ult_lint.js                                 # chữ mô tả chiêu cuối có khớp số thật không
```

`sim.js` chạy cùng luật với `battle.js`, gồm cả chiêu cuối của kẻ địch (Energy đầu lượt, sát thương cố định, lá chắn).
Sau khi thêm hai chiêu này: 100/100/100/90/46/56 % (trước là 100/100/100/91/48/56) — chưa cần chỉnh `mult`.

UI SFX: "Sci Fi UI SFX Pack (FREE)" © JDSherbert — xem `audio/CREDITS.txt`.

## Giữ chân giữa chương 1 và chương 2 (11/09)

Ba thứ cài để game còn việc làm trong lúc chờ chương 2. Chi tiết + nhật ký ở `docs/plan-2026-09.md`.

**Chiêu mộ kẻ địch.** 20 con địch chương 1 (trừ CANTOR) chơi được như nhân vật. `RECRUIT` trong `js/data.js`
dựng **bản sao** rồi nạp vào `ROSTER` — def gốc trong `ENEMY_POOL` không bị đụng, nên cân bằng 6 màn chương 1
giữ nguyên. Lính thường **không** được thêm `ult` vào `ENEMY_POOL`; chiêu của chúng chỉ sống trên bản chiêu mộ.

**Một bể gacha, hai đường vào bể (gộp 12/09 — `docs/gacha-merge.md`).** Bản 11/09 tách hai bể REQUISITION
(nhân vật, SH) và CHIÊU MỘ (kẻ địch, CR), nhưng cả hai chạy chung `pull()` và đổ chung vào `ROSTER` nên khác
biệt duy nhất là loại tiền — hai cái tên hứa hẹn hai cơ chế không có thật. Giờ còn **một bể REQUISITION trả SH**:

- *nhân vật* mở theo chương. Lấy từ `HERO_DEBUT` (chép tay theo `docs/story.md`).
- *quân chiêu mộ* phải **đánh bại con đó trong trận** mới vào bể (`PLAYER.defeated`, ghi trong `killUnit`).
  Vẫn kèm khoá theo chương suy từ `CHAPTERS` + `SECTORS[].plan`, nên chương 2 cài xong là địch chương 2 tự vào.

Tính lúc con đó **chết**, không đợi clear màn: hạ trùm ở wave 3 rồi gục ở wave 4 thì vẫn là đã hạ, và DẸP LOẠN
không ghi vào `PLAYER.cleared`. Bể tự lớn theo tiến trình: 4 (hồ sơ mới) → 7 → 11 → 17 → 22 → 24 (xong 07-D).
Hồ sơ cũ được gieo `defeated` từ `cleared` × `SECTORS[].plan` nên không tụt.
Trùng không hoàn SH — giữ thành bản dư trong `PLAYER.extra` để phân tách lấy linh kiện (đợt 3).
CR giờ chỉ còn việc nâng cấp; hố tiêu CR thứ hai là cyberware.

**Một mục cho một nhân vật ở ARCHIVE (12/09 — `docs/archive-merge.md`).** Trước đó 20 trong 21 mục *Sổ bộ*
trùng id với tab *Nhân vật*, và hai tab giữ hai **nửa** của cùng một trang: `LORE` chỉ có cho 19 nhân vật nên
tab HỒ SƠ của cả 20 con chiêu mộ rỗng, trong khi danh xưng / tiểu sử / nhận diện / flavor chiêu cuối của
chúng nằm bên `CODEX`. Giờ tab **Nhân vật = 19 người**, tab **Sổ bộ = 21 kẻ địch** và không id nào ở cả hai.
`FOE_LORE` sinh từ `CODEX` lúc nạp rồi ánh xạ sang hình dạng `LORE`, nên `openLore` dựng được trang cho cả
hai bên mà không phải viết thêm chữ. Sổ bộ **không khoá đọc**, chỉ đánh dấu `CHƯA HẠ` → `ĐÃ HẠ` → `ĐÃ CÓ`.

**HỐ LOẠN.** Thang đánh vô hạn ở Khu Đáy, mở sau 07-A. `riotSector(n)` dựng object hình dạng SECTOR rồi
`go('battle')` — engine trận không biết mình đang ở chế độ nào. Wave của mỗi tầng **cố định** (`riotRng` gieo
bằng số tầng), không bốc lại mỗi lần vào.

## DẸP LOẠN — chiếm bãi (11/09, đợt 2)

Đặc tả đầy đủ: `docs/dep-loan.md`. Nút DẸP LOẠN ở HOME giờ mở **bản đồ Khu Đáy** (`riotmap`) với 9 cái bãi
chiếm được + một nút xuống HỐ LOẠN (thang tầng cũ, giữ nguyên).

```
chiếm bãi (đánh) → đóng quân 1–3 người → bãi đẻ KIỆN HÀNG mỗi 45 phút, trần 8 kiện (6 giờ)
   → quay lại nhận kiện · giữ PHẢN KÍCH (mỗi 4h30) · NÂNG BÃI (5 bậc, ×3 sản lượng)
```

- **Quân đóng bãi bị khoá khỏi đội hình** — đây là lý do duy nhất khiến roster 39 người có giá trị.
  Người đang trong đội thì không đóng quân được (đổi ở SQUAD), nên đội không bao giờ bị rút xuống dưới 3.
- **Sức mạnh ổ loạn** hiện cạnh sức mạnh đội, và nó neo vào **số đo** chứ không phải phép cộng chỉ số:
  `power(đội mốc) × mult / m50`, với `m50` đo bằng `scratch/riot_tune.js`. Tỉ lệ 1.0 = thắng ~55%.
  Cộng chỉ số từng xếp SÂN LÒ ĐÚC (0% thắng) dễ hơn HÀNG RÀO GÃY (100% thắng) — xem `docs/dep-loan.md` §D1.
- **Thua phản kích không mất bãi vĩnh viễn**: bãi thành ĐANG BỊ CHIẾM, ngừng đẻ kiện, kiện đã có **đóng băng
  chứ không mất**; đánh một trận GIÀNH LẠI (×0.85 độ khó) là nhận lại nguyên vẹn.
  Đồn trú ≥ 2× ngưỡng thì **không bao giờ** mất bãi.
- **Art (12/09):** bản đồ thật `art/map/map_d07.jpg` (941×1672) + 9 ảnh bãi `art/riot/yard_<id>.jpg` (1024×576).
  Toạ độ 10 cái nút đo trên chính ảnh đó (`RIOT_YARDS`/`RIOT_PIT` trong `js/riot.js`, bảng ở `docs/dep-loan.md` §C);
  hai nút liền nhau phải cách ≥ 8% theo trục dọc, gần hơn là hai thẻ nhãn đè nhau. Thiếu file thì `riotMapSvg()`
  vẽ bản dự phòng bằng SVG — nó đọc cùng bộ toạ độ nên không lệch được. Kiểm kê: `node scratch/art_audit.js`.
- Thử không phải chờ 45 phút: mở `index.html?riotfast` → một chu kỳ **15 giây**.
- **Kiểm nhanh (12/09):** `python scratch/riot_serve.py` (hoặc launch `static-riot`, cổng 8802) rồi mở
  `http://127.0.0.1:8802/` → tự chuyển sang `index.html?riot&riotfast&dev`: vào thẳng bản đồ Khu Đáy, coi như đã mở
  khoá (**chỉ trong phiên**, không ghi hồ sơ), chu kỳ 15 giây, có nút nạp tiền. `?riot=all` mở cả 9 bãi.
  Bãi trống quân thì đồng hồ đứng (không kiện rỗng, không phản kích). Việc còn nợ: `docs/dep-loan.md` §K.

## CYBERWARE + phân tách bản dư (11/09, đợt 3+4)

Đặc tả đầy đủ: `docs/cyberware.md`. Nút **CYBERWARE** ở HOME (và nút tắt trong hồ sơ nhân vật ở ARCHIVE).

```
lá trùng gacha → PHÂN TÁCH → LINH KIỆN (LK) → nâng bậc 6 ô cyberware → đội mạnh hơn
```

- **6 ô, mỗi ô một thang 10 bậc** (ĐẦU · THÂN · TAY · CHÂN · PHỤ KIỆN A · PHỤ KIỆN B) = **60 món**,
  đúng bộ art 6 tấm contact sheet. Một trục duy nhất: người chơi đọc "TAY 06/10" là biết mình ở đâu.
  Độ hiếm theo bậc: `01 02` COMMON · `03 04` UNCOMMON · `05 06` RARE · `07 08` EPIC · `09` LEGENDARY · `10` MYTHIC.
  **Thang chỉ đi lên** — không tháo, không hoàn.
- **Cộng đúng 4 chỉ số `unitStats` đang trả về** (ATK% · HP% · SPD · CRIT) và nối vào **một chỗ duy nhất**:
  `unitStats(id)` gọi `cyberBonus(id)`. Thẻ nhân vật, `power()`, hồ sơ và chỉ số lúc vào trận vì thế luôn khớp.
  Cấp nâng cấp nhân **trước**, cyberware nhân sau — hai nguồn nhân nhau, không cộng dồn phần trăm.
  Đủ 6 ô bậc 10 = **+44% ATK · +52% HP · +30 SPD · +34 CRIT**.
- **LINH KIỆN (LK)** chỉ đến từ **phân tách bản dư** (`PLAYER.extra`) — đóng lời hứa treo từ đợt 1 của gacha.
  Bậc B 10 LK · A 25 LK · S 60 LK. Phân tách **không đụng `PLAYER.owned`**, không có đường nào mất nhân vật.
  Bãi ở DẸP LOẠN vẫn chỉ đẻ CR + SH. Một nhân vật kịch cả 6 ô ≈ 2 208 LK + 132 480 CR ≈ 9 ngày cày.
- **RONIN (`noChrome:true`)** đi lên như mọi người rồi **dừng ở món cuối cùng còn là đồ mặc vào** — vì bậc
  thấp của mọi ô đều không phải cấy ghép (găng da, áo khoác, mũ lưỡi trai, giày vải). TAY dừng ở 02, các ô
  khác 07–08; tổng 41/60 bậc. Đổi lại món ở đúng bậc trần cho **×1.5** chỉ số (THÉP TRẦN).
- **Ảnh món đã có đủ 60** (`art/cyber/<ô><bậc>.webp`, 512×512 nền trong, 2,1 MB cả bộ), cắt từ 6 tấm
  contact sheet trong `art-src/CYBER/` bằng `python scratch/cyber_sheet.py`. Đổi tấm nào thì chạy lại
  tấm đó (`python scratch/cyber_sheet.py head`). Thiếu file thì ô hiện icon SVG, game vẫn chạy.

> `scratch/sim.js` **chưa mô phỏng cyberware** — bảng tỉ lệ thắng ở `docs/dep-loan.md` §F1 là **sàn**.

