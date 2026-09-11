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

## Cấu trúc

| Đường dẫn | Nội dung |
|---|---|
| `index.html` | Bản chơi: markup mọi màn hình + overlay comic |
| `kit.html` + `js/kit.js` | UI kit: component, token, roster, bestiary (demo, không nạp trong bản chơi) |
| `css/chromefall.css` | Token thiết kế (Chrome/Rust/tier/ngữ nghĩa, sáng + tối) và toàn bộ giao diện; khối `v0.3` ở cuối: chọn mục tiêu, lao vào, hint, comic, archive |
| `css/fx.css` | Overlay hiệu ứng đòn đánh/trạng thái (placeholder vẽ bằng CSS, `.fx--sheet` khi có ảnh) + hộp holo video chiêu cuối `.holo` |
| `js/core.js` | Tiện ích DOM, thẻ nhân vật (`cardEl`), loader ảnh/video có fallback, hộp phát video `.cutin` dùng chung (ult trong trận, mở rương ở gacha), thanh HP/Energy, theme |
| `js/data.js` | **Số liệu & hồ sơ**: roster (ATK/HP/SPD/CRIT, skill + fx/status, passive), kẻ địch (`FOE_STATS`, `FOE_SKILL`, `ult`), **chiêu mộ** (`RECRUIT_*` — nạp kẻ địch chương 1 vào `ROSTER` thành đơn vị chơi được), chương/sector, **`RIOT`** (dẹp loạn), `RULES` (move, holo, foeUltGain), hồ sơ người chơi (v3, tự chuyển từ v2), lore, bonds, **`BANNERS`** (hai bể gacha + khoá theo chương). Sửa ở đây. |
| `js/story.js` | **Comic từng màn**: trang, panel, bong bóng cho intro/outro của 00-T → 07-E. Sửa lời thoại ở đây. |
| `js/comic.js` | Renderer trang comic: layout panel, ảnh + fallback, bong bóng hiện dần, lật trang, SKIP |
| `js/state.js` | Lưu/nạp hồ sơ (`SAVE`, local hoặc remote), nâng cấp (`UPGRADE`), **`unitStats(id)`** — một chỗ duy nhất tính chỉ số cuối, và `power(id)`/`teamPower()`, nhiệm vụ ngày |
| `js/audio.js` | SFX giao diện (audio/*.ogg) + âm chiến đấu: có `audio/<tên>.ogg\|mp3\|wav` thì dùng file, thiếu thì tổng hợp WebAudio. Một thao tác = một tiếng (`SFX_ONE`/`SFX_BEAT`); `SFX_VARIANTS` cho tiếng nhiều bản (`hit`, `hit2`…); `SFX_MUTE` cho nút không kêu |
| `js/fx.js` | Overlay hiệu ứng trên sprite: một lần (hit/crit/nổ/điện/độc/cháy/choáng/hồi máu/lá chắn) và lặp theo trạng thái + lá chắn; tự dùng sprite sheet `art/fx/<kind>.webp` nếu có |
| `js/battle.js` | Engine trận: lưới sân 3 hàng mỗi phe (`FORMATION`, không ai chồng lên ai) + `stageScale()` đặt `--big`, bảng nội tại chạm-để-đọc (`openPassive`), passive, lượt theo SPD, chế độ chọn mục tiêu, di chuyển tới mục tiêu kiểu Idle Heroes (`playMoveAttack`), sát thương + chí mạng, lá chắn (`addShield`/`absorbShield`), trạng thái choáng/độc/cháy (`applyStatus`/`tickStatus`), ult + video holo trên đầu nhân vật (`playHolo`), chiêu cuối của địch (`enemyUlt`), wave (hồi máu giữa wave), hint tutorial. `finish()` tách nhánh thưởng theo `SECTOR.mode` (chiến dịch / `'riot'`) |
| `js/app.js` | Router màn hình, lobby, squad (3 slot, lưu đội), sector, **dẹp loạn** (`renderRiot`), gacha hai bể, archive (tab Kỹ năng / Passive / Hồ sơ), config, COMMS |
| `js/data_later.js` | Dữ liệu chương 2–3 bản cũ (không nạp), giữ để viết lại quanh Yuki |
| `scratch/key_frame.py` | Tách nền frame sprite (idle/attack/hurt), in `box` để dán vào `ROSTER` |
| `scratch/ult_lint.js` | Soát chiêu cuối: số trong `desc` có khớp `mult`/`hits`/`shieldPct`/`healPct`/`flat`/`drainEnergy` không, `energyMax` có bằng `ult.cost` không, và bản chiêu mộ có còn viết theo giọng phía địch không. Thoát mã 1 nếu lệch |
| `scratch/sprite_size.py` | Đo sprite theo % hộp 682 và in sẵn hai bảng để dán vào `js/data.js`: **`BODY_H`** = chiều cao NGƯỜI (bào mòn 41px nên bỏ hào quang / nòng súng) để mọi người cao bằng nhau, **`ART_H`** = chiều cao NÉT VẼ tính từ mặt sàn, để lưới sân chừa đủ chỗ |
| `scratch/recruit_table.js` | Dò bảng quy đổi kẻ địch → đơn vị chơi được: in chỉ số sau quy đổi cạnh băng chỉ số nhân vật cùng bậc, đánh dấu con lệch băng (`--bad` chỉ in con lệch) |
| `scratch/fx_sheet.py` | Video/gif nền xanh → sprite sheet hiệu ứng `art/fx/<kind>.webp` (ô vuông 256, 6 cột) |
| `scratch/sfx_install.py` | File SFX sinh bằng AI (`art-src/SFX/*.mp3\|m4a`) → `audio/<tên>.ogg`: cắt im lặng, chuẩn hoá đỉnh −1 dB, mono ogg (`--dry` để chỉ đo) |
| `scratch/sfx_compare.py` | Đo đặc tính file SFX (dài, thời gian tới đỉnh, đuôi vang, độ sáng, số nhịp) để so bản mới với bản đang dùng |
| `scratch/sfx_ab.html` | Trang nghe đối chiếu SFX: bản đang dùng cạnh bản kia, âm lượng đã cân — mở bằng preview `static-sfx` |
| `scratch/key_enemy.py` | Tách nền hàng loạt ảnh idle kẻ địch (`art-src/ENEMY/<id>.png` → `art/sprite/<id>_idle.png`), tự chọn cỡ theo rank, in `box` cho `FOE_SPRITE` |
| `scratch/sim.js` | Mô phỏng trận bằng Node để cân bằng `mult` từng sector (cùng luật SPD/crit/trạng thái; `SIM_PATCH` để thử số khác) |
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
| `art/card/` | **Art thẻ**: key art nhân vật `<id>.png`, chân dung cắt `<id>_portrait.jpg`, art kẻ địch `<id>.png` | dọc 9:16, có nền, ~768×1360 (nhân vật 1152×2048 hoặc 1536×2720). Chân dung = cắt phần trên art thẻ (đầu → ngang hông), JPEG q90 ≤ 400 KB |
| `art/sprite/` | Frame trong trận `<id>_idle/attack/crit/hurt/die.png` (`crit` = đòn chí mạng, `die` = gục; đều tuỳ chọn; không cần `dash`) | **tách nền**, cao 682px (pose giơ vũ khí có thể cao hơn), chân chạm đáy |
| `art/fx/` | Overlay hiệu ứng `<kind>.webp` (một lần) và `<kind>_loop.webp` (lặp): hit, crit, explode, shock, poison, burn, stun, heal, shield | sprite sheet ô vuông 256 px, 6 cột, nền trong suốt — `docs/fx-prompts.md` |
| `art/bg/` | Nền sector `bg_<sector>.jpg` (+ `bg_base.jpg` cho màn COMMS ở HOME) | 3:4 dọc, 1536×2048; thiếu thì rơi về `art/bg/bg_battle.jpg` |
| `art/map/` | Bản đồ Halcyon `map_halcyon.jpg` | 9:16 dọc, 1152×2048; toạ độ nút tính theo % ảnh (`MAP_AREAS`) |
| `art/reveal/` | Mặt thẻ khi mở rương `<id>_reveal.jpg` | 1280×720, nhân vật đứng giữa |
| `art/comic/` | Ảnh panel comic `<sector>_<i\|o><trang>_p<panel>.jpg` (vd `00t_i1_p2.jpg`) | prompt từng panel ở `docs/comic-prompts.md` |
| `video/` | Cut-in chiêu cuối `<id>_ult.mp4` (cả nhân vật lẫn kẻ địch), video mở rương `<id>_reveal.mp4` | H.264 1280×720; video địch đang là 540×720 dọc (`ultRatio:3/4`) |
| `audio/` | SFX giao diện `select/cursor/open/swipe/error/glitch/cancel/close.ogg` + âm chiến đấu `hit/crit/kia/heal/ready/ult/wave/explode/shock/burn/poison/stun/shield` (`.ogg`, `.mp3` hoặc `.wav`) | mono 44.1 kHz, 0.15–1.4 s, cắt hết im lặng ở đầu — `docs/sfx-prompts.md` |
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
- **Art thẻ kẻ địch** (`art/card/<id>.png`, đủ 21 con chương 1) hiện ở thanh lượt trong trận, chân dung người nói trong comic,
  panel comic của boss và bestiary `kit.html`. Thêm con mới: thả file + thêm id vào `FOE_ART` trong `js/data.js`.
- **Chân dung** ưu tiên `<id>_portrait.jpg` (bán thân, đọc rõ ở cỡ 30px); thiếu thì dùng thẳng key art `<id>.png`.
  Đủ 9 người có art (yuki, ash, kai, psalm, ronin, muzzle, echo, wire, stitch): cắt phần trên của `art/card/<id>.png`
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
node scratch/sim.js 200 yuki,ash,kai --riot 20            # dò 20 tầng DẸP LOẠN (đánh dấu ← TƯỜNG khi win < 40%)
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

**Khoá gacha theo chương.** Chỉ quay được người đã xuất hiện trong màn chơi của chương đã ra.
Nhân vật lấy chương từ `HERO_DEBUT` (chép tay theo `docs/story.md`); kẻ địch suy từ `CHAPTERS` + `SECTORS[].plan`
nên chương 2 cài xong là địch chương 2 tự vào bể. Hai bể: **REQUISITION** (nhân vật, SH) và **CHIÊU MỘ**
(kẻ địch, CR). Trùng không hoàn SH nữa — giữ thành bản dư trong `PLAYER.extra` để phân tách lấy linh kiện (đợt 3).

**DẸP LOẠN.** Thang đánh vô hạn ở Khu Đáy, mở sau 07-A. `riotSector(n)` dựng object hình dạng SECTOR rồi
`go('battle')` — engine trận không biết mình đang ở chế độ nào. Wave của mỗi tầng **cố định** (`riotRng` gieo
bằng số tầng), không bốc lại mỗi lần vào.

Đợt sau: chiếm bãi (cần art map District 07) · phân tách → linh kiện · cyberware 5 ô.
