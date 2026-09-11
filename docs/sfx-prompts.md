# CHROMEFALL — SFX: danh sách âm thanh trong game + prompt cho ElevenLabs (v0.1 · 11/09/2026)

Game hiện có **hai lớp âm thanh**:

1. **SFX giao diện** — 8 file `.ogg`, nay chỉ còn `cancel` và `close` là hàng mượn từ gói "Sci Fi UI SFX Pack" của
   JDSherbert (`audio/CREDITS.txt`), mà hai cái đó chưa chỗ nào gọi.
2. **Âm chiến đấu** — 13 tiếng **tổng hợp bằng WebAudio** ngay lúc chạy (`js/audio.js`), không có file. Nghe được ngay
   nhưng nó là tiếng máy tính kêu bíp-bụp, không phải tiếng đấm vào giáp.

Từ 11/09, lớp 2 nhận file thật: **thả `audio/<tên>.ogg` (hoặc `.mp3`, `.wav`) là game dùng file đó, thiếu file thì tự
tổng hợp như cũ** — giống luật `art/fx/*.webp` bên `docs/fx-prompts.md`. Không phải sửa code, không phải khai gì.

> **Tình trạng sau đợt 2 (§8):** 18/18 tiếng trong trận **đã có file**, không còn cái nào chạy bằng WebAudio.
> Sáu tiếng giao diện `error` `glitch` `swipe` (đợt 1) và `select` `cursor` `open` (đợt 2) đã là hàng nhà — bản
> JDSherbert cũ cất ở `audio/jdsherbert/`. Chỉ `cancel` `close` còn mượn, và **cả hai chưa chỗ nào gọi**: bỏ hai file
> đó khỏi `AUDIO.files` là gỡ được credit trong `audio/CREDITS.txt` và `README.md`. File nguồn (mp3/m4a chưa xử lý)
> nằm ở `art-src/SFX/`.

> **Prompt influence** = thanh trượt trong ElevenLabs quyết định nó bám sát chữ bạn viết đến đâu (cao = bám chữ, ít
> sáng tạo). Tiếng máy móc nên để cao. **One-shot** = tiếng phát một phát rồi tắt, không lặp.

---

## 1. Cách tạo và thả file

### Ở ElevenLabs (Sound Effects)

| Mục | Đặt thế nào | Vì sao |
|---|---|---|
| Duration | **Khai tay đúng số giây trong bảng dưới**, đừng để Auto | Auto hay đệm thêm 1–2 s im lặng ở đuôi |
| Prompt influence | **0.5–0.7** | tiếng va chạm/máy móc cần bám chữ; để thấp nó tự "diễn" thành nhạc |
| Số bản | sinh **4 bản một prompt**, nghe rồi chọn | mỗi lần sinh ra một kiểu khác nhau, bản 1 hiếm khi trúng |
| Ngôn ngữ prompt | **tiếng Anh** | model nghe tiếng Anh chuẩn hơn hẳn |

Ba chữ nên có ở cuối mọi prompt: `dry, no music, no voice`. Thiếu nó là hay dính nền nhạc hoặc tiếng vang dài, mà đuôi
vang dài thì đánh 3 đòn liên tiếp là nghe như trong nhà tắm.

### Sau khi tải về: một lệnh

Đặt file tải về ở **thư mục gốc dự án** hoặc `art-src/SFX/`, đặt tên đúng như cột "Tên file" bên dưới (`hit.mp3`,
`crit.m4a`…), rồi:

```bash
python scratch/sfx_install.py
```

Script làm ba việc rồi ghi ra `audio/<tên>.ogg` (bản gốc không bị xoá):

1. **cắt im lặng đầu và đuôi** — không cắt thì tiếng đánh đến trễ hơn hình. Khoảng lặng ở **giữa** thì giữ nguyên, vì
   có tiếng cố ý có nhịp nghỉ (ult: nạp năng lượng rồi mới nổ).
2. **kéo đỉnh về −1 dBFS** để mọi tiếng cùng một mức. File 11labs sinh ra chênh nhau tới 12 dB, không chuẩn hoá thì
   `heal` gần như không nghe thấy trong khi `shock` chói tai.
3. **mono 44.1 kHz, ogg q5** — nhẹ và mọi trình duyệt đều đọc. Riêng `.m4a` thì `js/audio.js` không tìm, buộc phải đổi.

`python scratch/sfx_install.py --dry` chỉ đo rồi in bảng (dài bao nhiêu, cắt còn bao nhiêu, đỉnh mấy dB) — chạy cái này
trước để biết file nào bị đệm im lặng.

Nghe lệch to nhỏ thì **đừng sửa file** — sửa số âm lượng trong `js/audio.js` (số thứ hai trong `this.clip('hit',.5)`).

### Kiểm

Mở game (`index.html` — `kit.html` không nạp `js/audio.js` nên không có `AUDIO`), F12 → Console:

```
AUDIO.list()      // bảng: tên nào đang chạy bằng file, tên nào còn WebAudio
AUDIO.crit()      // nghe thử một tiếng bất kỳ
```

Chưa có file thì Network báo 404 cho `audio/<tên>.ogg|mp3|wav` — **bình thường**, đúng như ảnh `art/fx/*.webp` chưa có.

---

## 2. Âm chiến đấu — 13 tiếng (thả file là dùng ngay)

| Tên file | Khi nào kêu | Dài | Ghi chú |
|---|---|---|---|
| `hit` | mọi đòn thường trúng (`dealDamage`, [battle.js:361](../js/battle.js#L361)) | **0.4 s** | kêu nhiều nhất trận — ngắn, khô, **không đuôi vang** |
| `crit` | đòn chí mạng | 0.7 s | phải nghe "đắt" hơn `hit` rõ rệt, cùng họ tiếng |
| `kia` | một unit gục (cả ta lẫn địch) | 1.0 s | |
| `heal` | được hồi máu (Psalm, nghỉ giữa wave) | 0.9 s | **một lượt hồi chỉ kêu một tiếng** dù chữa mấy người (§5) |
| `ready` | Energy đầy, chiêu cuối mở khoá | 0.5 s | tiếng báo, không phải tiếng đánh |
| `ult` | mở màn chiêu cuối, lúc chớp sân (`ultCutin`) | 1.4 s | dùng chung cho cả đội mình và địch |
| `wave` | banner "WAVE 02 · ĐỢT ĐỊCH MỚI" | 1.2 s | đang mượn tạm `glitch.ogg` |
| `explode` | mìn FLASHOVER của Ash · **lá chắn vỡ** | 1.0 s | một file cho cả hai — xem `fx-prompts.md` §2 |
| `shock` | súng điện Kai (RIPCORD), drone, APOSTASY của Psalm | 0.6 s | |
| `burn` | dính cháy và mỗi lượt cháy trừ máu (Kiln, thợ hàn) | 0.8 s | |
| `poison` | dính độc và mỗi lượt độc trừ máu (Ash, Mother Rust) | 0.7 s | |
| `stun` | dính choáng và lúc mất lượt vì choáng | 0.6 s | |
| `shield` | dựng lá chắn và mỗi lần khiên chặn được đòn | 0.9 s | |

Bốn cái `burn` `poison` `stun` `shield` kêu **mỗi lượt** khi còn dính trạng thái → giữ nhỏ và ngắn, đừng làm hoành tráng.

### Tiếng chồng lên nhau — đã sửa ở đợt 3, giữ bảng này để hiểu vì sao

> **Từ đợt 3 (§9) một đòn chỉ còn kêu MỘT tiếng.** Bảng dưới là cảnh cũ, vẫn đáng đọc vì nó giải thích thứ tự ưu
> tiên bây giờ và vì sao `hit` vẫn phải mỏng.

Một đòn đánh gọi **nhiều tiếng cùng lúc**, không phải một. Tiếng tổng hợp hồi đó nhỏ và mỏng nên không thấy vấn đề,
nhưng thay bằng file thật là nghe rõ ngay:

| Tình huống | Kêu những gì | Cách nhau |
|---|---|---|
| Đòn thường trúng | `hit` | — |
| Đòn thường chí mạng | `crit` | — |
| Đòn có hiệu ứng riêng (mìn Ash, súng điện Kai) | `hit`/`crit` **+** `explode`/`shock` | cùng lúc |
| Đòn gây trạng thái (lưỡi axit Ash) | `hit` **+** `poison` (hiệu ứng) **+** `poison` (lúc dính) | cùng lúc — **cùng một tiếng phát hai lần** |
| Đòn kết liễu | `kia` thay cho `hit` (+ hiệu ứng riêng nếu có) | cùng lúc |

Vì vậy **`hit` vẫn phải mỏng và ngắn**: nó là tiếng kêu nhiều nhất trận, và nếu sau này bạn nới cửa sổ `SFX_BEAT`
thì nó lại nằm chung nhịp với tiếng khác.

Cả ba dòng "cùng lúc" ở trên **hết từ đợt 3**: `dealDamage` giờ chọn đúng một tiếng theo thứ tự ưu tiên, tiếng
trạng thái gọi sau rơi vào cùng nhịp nên tự bị bỏ. Chi tiết ở §9.1.

### Prompt

**hit** — 0.4 s
```
sharp metallic impact on armor plating, short punchy thud with a thin metal ring, close mic, single one-shot, dry, no music, no voice
```

**crit** — 0.7 s
```
heavy blade slashing through a metal plate, bright sharp crack with a quick high sparkle tail, single one-shot, dry, no reverb, no music, no voice
```

**kia** — 1.0 s
```
heavy metal body collapsing onto a concrete floor, servo motor whine dying out, low descending electronic groan, single one-shot, dry, no music, no voice
```

**heal** — 0.9 s
```
medical stimulant injector hiss followed by a soft warm synthetic chime rising, clean glassy shimmer, single one-shot, dry, no music, no voice
```

**ready** — 0.5 s
```
two note bright digital confirmation blip rising, clean futuristic UI beep, short, dry, no music, no voice
```

**ult** — 1.4 s
```
deep sub bass swell rising into a bright energy surge, heavy weapon charging up, metallic capacitor whine, ends with a hard snap, single one-shot, dry, no music, no voice
```

**wave** — 1.2 s
```
digital signal glitch burst with stuttering static tearing, short distorted industrial alarm stab underneath, single one-shot, dry, no music, no voice
```

**explode** — 1.0 s
```
small proximity mine detonation, punchy low boom with metal shrapnel and debris scattering, short tail, single one-shot, dry, no music, no voice
```

**shock** — 0.6 s
```
high voltage electric arc discharging across metal, sharp zap with a crackling hissing tail, taser, single one-shot, dry, no music, no voice
```

**burn** — 0.8 s
```
gas burner igniting, flame whoosh flaring up and crackling briefly, close mic, single one-shot, dry, no music, no voice
```

**poison** — 0.7 s
```
corrosive acid splashing onto metal, wet sizzling and small bubbles popping, single one-shot, dry, no music, no voice
```

**stun** — 0.6 s
```
flashbang pop with a ringing high frequency tail, disoriented metallic ring out, single one-shot, dry, no music, no voice
```

**shield** — 0.9 s
```
energy barrier snapping into place around a body, deep hum rising under a glassy shell forming, short airy whoosh, single one-shot, dry, no music, no voice
```

---

## 3. SFX giao diện — 8 file (ghi đè để thành của bạn)

Tám file này **đã có** và đang chạy; muốn thay thì ghi đè đúng tên `.ogg` trong `audio/` (`AUDIO.files` khai cứng đuôi
`.ogg`, nên ở đây phải chuyển định dạng chứ không thả `.mp3` được — `scratch/sfx_install.py` tự làm việc đó và cất bản
cũ vào `audio/jdsherbert/`).

**Đã thay đợt 1**: `error` `glitch` `swipe`. **Đã thay đợt 2**: `select` `cursor` `open` (§8). **Còn mượn của
JDSherbert**: `cancel` `close` — hai file thừa từ gói gốc, chưa chỗ nào gọi; gỡ khỏi `AUDIO.files` là bỏ được credit
trong `audio/CREDITS.txt` và `README.md`.

| Tên file | Khi nào kêu | Dài |
|---|---|---|
| `select` | nút hành động: ATTACK, ULT, nút menu, dòng chọn màn | 0.25 s |
| `cursor` | nút phụ, thẻ, lật thẻ thường ở gacha, hiện bong bóng truyện | 0.15 s |
| `open` | mở hộp video, nhận thưởng ngày, nâng cấp xong, lật thẻ tier S | 0.5 s |
| `swipe` | chuyển màn hình, lật trang truyện tranh | 0.35 s |
| `error` | bấm nút đang khoá, thiếu shard, màn chưa mở | 0.4 s |
| `glitch` | banner wave mới (qua `AUDIO.wave()`) | 1.0 s |
| `cancel` | **khai rồi nhưng chưa chỗ nào gọi** | 0.25 s |
| `close` | **khai rồi nhưng chưa chỗ nào gọi** | 0.3 s |

`cancel` và `close` là hai file thừa từ gói gốc — hoặc gắn vào nút Huỷ chọn mục tiêu / đóng hộp lore, hoặc bỏ qua.

### Prompt

**select** — 0.25 s
```
clean short futuristic UI confirm click, crisp synthetic tick with a tiny bright tail, dry, no music, no voice
```

**cursor** — 0.15 s
```
very short soft UI tick, subtle quiet digital blip, minimal, dry, no music, no voice
```

**open** — 0.5 s
```
holographic panel opening, airy digital whoosh rising with a soft glassy chime, clean sci-fi interface, dry, no music, no voice
```

**swipe** — 0.35 s
```
quick digital swipe transition whoosh, thin airy sweep, short, dry, no music, no voice
```

**error** — 0.4 s
```
harsh short denial buzz, low distorted double beep, access denied interface sound, dry, no music, no voice
```

**glitch** — 1.0 s
```
digital signal corruption, stuttering static tearing and broken data bursts, short, dry, no music, no voice
```

**cancel** — 0.25 s
```
soft descending two tone UI cancel blip, muted, short, dry, no music, no voice
```

**close** — 0.3 s
```
small mechanical panel sliding shut with a soft digital whoosh downward, short, dry, no music, no voice
```

---

## 4. Năm tiếng phụ — đã nối vào code (11/09)

Năm chỗ trước đây im lặng hoặc mượn tiếng khác, nay có tiếng riêng. Thiếu file thì **rơi về đúng cách cũ**, không lỗi.

| Tên file | Kêu ở đâu | Thiếu file thì |
|---|---|---|
| `victory` | bảng THẮNG — [battle.js:520](../js/battle.js#L520) | im lặng |
| `defeat` | bảng CẢ ĐỘI GỤC — cùng chỗ | im lặng |
| `reveal_s` | thẻ tier S lật ở gacha — [app.js:219](../js/app.js#L219) | dùng `open` như cũ |
| `shield_break` | lá chắn vỡ — [battle.js:424](../js/battle.js#L424) | dùng `explode` như cũ |
| `upgrade` | nâng cấp CR xong — [app.js:178](../js/app.js#L178) | dùng `open` như cũ |

**Hai tiếng đã bỏ hẳn (11/09):**

- `type` — gõ chữ hội thoại. Chỗ gọi là mỗi ký tự một lần, không tiếng nào chịu nổi nhịp đó. Bỏ ý tưởng.
- `target_on` — vào chế độ chọn mục tiêu. Bỏ vì nút ATTACK/ULT đã kêu `select` ngay trước đó rồi, thêm một tiếng nữa
  là kêu hai lần cho một thao tác.

Cả hai đã gỡ khỏi `js/audio.js`, `js/battle.js` và bảng `MAP` trong `scratch/sfx_install.py`; file nguồn vẫn nằm ở
`art-src/SFX/` phòng khi đổi ý.

### Prompt

**victory** — 2.0 s
```
short synthetic victory sting, three ascending bright chords on a warm analog synth pad, clean cyberpunk, ends resolved, no drums, no voice
```

**defeat** — 2.0 s
```
short dark defeat sting, descending detuned synth drone fading out, low hum, bleak, no drums, no voice
```

**reveal_s** — 1.5 s
```
rare item reveal fanfare, bright rising shimmer with a metallic chime hit and glass sparkle tail, premium, short, no drums, no voice
```

**shield_break** — 1.0 s
```
energy barrier shattering, glass shell cracking apart with an electrical discharge pop and falling debris, single one-shot, dry, no music, no voice
```

**upgrade** — 0.8 s
```
mechanical upgrade install, metal part locking into place followed by a bright power-up chime, short, dry, no music, no voice
```

---

## 5. Đợt file 11/09: đã xử lý những gì

Đo bằng `python scratch/sfx_install.py --dry`. Ba tiếng bị 11labs chèn khoảng lặng vào **giữa** nên nghe thành hai tiếng
rời — đã dồn lại (`TIGHT` trong `scratch/sfx_install.py`), độ dài tự ngắn đi mà không mất phần tiếng nào:

| Tên | Trước | Sau | Khoảng lặng đã cắt |
|---|---|---|---|
| `wave` | 2.25 s | **1.18 s** | 1.19 s ở giữa (0.23 → 1.42) |
| `ult` | 2.25 s | **1.67 s** | 0.56 s ở giữa (1.00 → 1.55) |
| `explode` | 2.25 s | **2.16 s** | 0.14 s ở giữa (0.32 → 0.46) |

`ready` soi kỹ ở ngưỡng −50 dB thì **không có khoảng lặng nào**, giữ nguyên 2.25 s như bạn nói.

### Một hành động = một tiếng (`AUDIO.gate`)

> **Đợt 3 đã siết chặt hơn — đọc §9 trước, bảng dưới đây là trạng thái cũ (đợt 1).**

Đánh diện rộng và hồi máu cả đội gọi hàm cho **từng mục tiêu** trong cùng một nhịp, nên một tiếng kêu 3 lần đè lên nhau
(3 bản sóng giống hệt cộng vào nhau = to thêm ~9.5 dB, nghe vỡ). `AUDIO.gate(name, ms)` chặn cùng một tiếng lặp lại
trong khoảng ms:

| Tiếng | Cửa sổ | Vì sao |
|---|---|---|
| `heal` | 400 ms | HỒI MÁU của Psalm chữa cả 3 người, nghỉ giữa wave cũng hồi cả đội |
| `hit` · `explode` | 100 ms | chiêu diện rộng (FLASHOVER của Ash) đánh 3 địch cùng lúc |

100 ms đủ hẹp để không nuốt đòn thường kế tiếp — lượt trong game cách nhau ít nhất 200 ms.

**Chưa gate** (đến đợt 3 thì hết, xem §9): `burn` `poison` `stun` `shock` `crit` `kia`.

Còn lại đúng cỡ, không phải làm lại: `hit` 0.48 · `crit` 0.72 · `shock` 0.69 · `burn` 0.53 · `poison` 0.66 ·
`shield` 0.71 · `stun` 0.79 · `kia` 1.06 · `error` 0.25 · `swipe` 0.48 · `glitch` 0.87 · `reveal_s` 1.04 ·
`upgrade` 1.13 · `shield_break` 1.26 · `victory` 1.53 · `defeat` 1.70.

Hai file nguồn **chưa dùng** vì không khớp tên nào trong hệ thống: `bleeding.m4a`, `laser gun.m4a` (ở `art-src/SFX/`).
`laser gun` để dành: khi bạn chỉ định đòn thường của nhân vật nào dùng nó thì thêm chỗ gọi.

---

## 6. Chưa hỗ trợ (đừng làm vội)

- **Tiếng lặp theo trạng thái** (kiểu `burn_loop` cháy rì rì suốt lượt như overlay ảnh bên `fx.js`): code chưa có phần
  phát vòng lặp và tự tắt, thả file vào không chạy.
- **Nhạc nền (BMS/BGM)**: chưa có lớp nhạc nào cả. Nhạc là việc khác hẳn SFX — nếu làm thì cần thêm nút bật/tắt riêng,
  fade khi đổi màn, và ElevenLabs không phải chỗ tốt nhất cho nhạc dài.
- **Tiếng riêng từng nhân vật** (`ult_yuki`, `ult_ash`…): `AUDIO.ult()` hiện không biết ai đang phát chiêu. Sửa được
  bằng một dòng ở `ultCutin`, nhưng hãy làm sau khi 13 tiếng cơ bản đã xong và nghe ổn.

---

## 7. Sinh hàng loạt bằng API (nếu không muốn bấm tay nhiều lần)

```bash
curl -X POST https://api.elevenlabs.io/v1/sound-generation \
  -H "xi-api-key: $ELEVEN_KEY" -H "Content-Type: application/json" \
  -d '{"text":"sharp metallic impact on armor plating, short punchy thud with a thin metal ring, close mic, single one-shot, dry, no music, no voice","duration_seconds":0.4,"prompt_influence":0.6}' \
  --output hit.mp3
```

Đổi `text` / `duration_seconds` theo bảng trên rồi lặp. Tên tham số có thể đổi theo phiên bản API — lỗi thì tra lại
docs ElevenLabs, phần Sound Effects. Sinh xong vẫn phải **nghe từng cái**: cứ 4 bản thì thường 1 bản dùng được.

---

## 8. Đợt 2: gói SFX mới — thay 8, giữ 6, để dành 5

Bạn thả 23 file mp3 vào thư mục gốc (attack · click · dark magic ×2 · electric · explosion · fire ×2 · gain · gun ·
heal · hero skill · iced · level up · male die ×4 · plasma · select ×2 · wave · win). Nguồn đã cất hết vào
`art-src/SFX/`. Trang nghe đối chiếu: **`scratch/sfx_ab.html`** (mở bằng preview `static-sfx`, cổng 8791) — mỗi dòng
hai nút, bản đang dùng cạnh bản kia, âm lượng đã cân bằng nhau cho khỏi bị "cái nào to hơn nghe hay hơn".

> **Cách tôi so — đọc chỗ này trước khi tin cái bảng dưới.** Tôi **không nghe được file**, nên không có ý kiến gì về
> chuyện tiếng nào hay hơn. Tôi chỉ đo được: **thời lượng · thời gian tới đỉnh · đuôi vang · độ sáng (spectral
> centroid) · số nhịp (onset)** — bằng `python scratch/sfx_compare.py <file|thư mục>` — rồi đối chiếu với quy cách
> §2/§3 và với chỗ tiếng đó kêu trong trận. Tai bạn quyết cuối cùng, tôi chỉ dọn sẵn.

### Đã thay — 8 tiếng

| Tiếng | Nguồn mới | Đo được | Vì sao đổi |
|---|---|---|---|
| `cursor` | `click.mp3` | 0,25 s · một nhịp · đỉnh ngay đầu | đích 0,15 s; bản mượn cũng 0,25 s nhưng **bỏ được một file mượn** |
| `select` | `select 2.mp3` | 0,77 s | ngắn hơn bản mượn (0,88 s), bỏ thêm một file mượn |
| `open` | `select.mp3` | 1,40 s · sáng 4958 Hz | gần y hệt bản mượn (1,42 s · 4680 Hz) — đổi để bỏ nốt file mượn thứ ba |
| `heal` | `heal.mp3` | 1,32 s · đỉnh ở 0,35 s | bản cũ 2,25 s và **đỉnh rơi ở giây 1,70**: tiếng kêu xong thì số hồi máu đã bay mất |
| `explode` | `explosion.mp3` | 1,99 s · đuôi 0,90 s | bản cũ đuôi 1,56 s; FLASHOVER đánh 3 địch trong một nhịp nên đuôi ngắn mới sạch |
| `upgrade` | `level up.mp3` | 0,91 s | đích 0,8 s, bản cũ 1,08 s; tên file khớp đúng chỗ dùng |
| `victory` | `win.mp3` | 1,32 s | ngang bản cũ (1,38 s) — đổi **theo ý bạn đặt tên file**, không phải vì bản cũ sai cỡ |
| `wave` | `wave.mp3` | 0,57 s · một nhịp | bản cũ 1,18 s tiếng nhiễu kéo dài; banner wave không cần tiếng lấp kín |

**Âm lượng phải chỉnh theo.** Ba file giao diện mới đều được kéo đỉnh về −1 dBFS, còn bản mượn thì không
(`cursor.ogg` cũ đỉnh **−15,7 dB**) → để nguyên số `vol` cũ là tiếng chuột kêu to hơn trước ~22 dB. Đã nhân lại ở mọi
chỗ gọi: **`cursor` ×0,25 · `select` ×0,7 · `open` ×0,43** (`js/audio.js`, `js/app.js`, `js/core.js`, `js/comic.js`),
và `upgrade` `.5 → .38` vì bản mới đặc hơn 2,5 dB. Năm tiếng còn lại chênh dưới 1,5 dB nên giữ nguyên số.

### Chưa thay — 6 tiếng lúc đó, giờ còn 5 (`hit` đã xong ở §9)

Có ứng viên nhưng đo ra bản đang dùng hợp hơn. Đổi thì sửa `MAP` trong `scratch/sfx_install.py` rồi chạy
`python scratch/sfx_install.py <tên>`:

| Tiếng | Ứng viên | Vì sao tôi chưa tự đổi |
|---|---|---|
| ~~`hit`~~ | ~~`attack.mp3`~~ | **xong ở đợt 3**: `attack.mp3` thành `hit2`, đòn thường bốc ngẫu nhiên một trong hai bản (§9.3) |
| `crit` | `attack.mp3` | nếu nghe thấy nó "đắt" hơn thì chuyển hẳn sang `crit`: 0,74 s so với 0,66 s, cùng cỡ |
| `ult` | `hero skill.mp3` | bản đang dùng nạp rồi mới nổ (đỉnh ở 1,36 s) — đúng ý đồ cut-in; ứng viên dồn hết vào đầu |
| `ready` | `gain.mp3` | bản đang dùng **lệch quy cách nhất bộ** (2,25 s, đỉnh ở 1,66 s, đích 0,5 s) nhưng hôm trước bạn dặn giữ nguyên nên tôi không tự đổi |
| `shock` | `plasma.mp3` | 0,92 s so với 0,63 s. Từ đợt 3 nó thay hẳn tiếng đấm chứ không đè lên nữa, nên dài hơn cũng không bết — nghe rồi quyết |
| `burn` | `fire.mp3` (hoặc `fire 2`) | 0,91 s so với 0,49 s. `burn` kêu **mỗi lượt** khi còn dính cháy — dài là mệt tai |

`kia` ← `male die.mp3` thì tôi khuyên **đừng**, không phải vì tiếng dở: `kia` kêu cho **cả drone, máy móc và
Yuki/Psalm/Echo/Vesper**. Muốn dùng tiếng người gục thì phải tách `kia` theo từng unit — code chưa có (§6).

### Chưa có chỗ dùng — 5 file

| File | Vướng gì |
|---|---|
| `electric.mp3` | 5,10 s — dài gấp 8 lần `shock`, không nhét vào chỗ nào |
| `iced.mp3` | game không có trạng thái đóng băng (chỉ `stun` · `poison` · `burn`) |
| `dark magic.mp3` · `dark magic 2.mp3` | chỗ hợp nhất là fx `zero` — nhát chém ZERO của Yuki. Nó **đang câm** vì `js/battle.js` gọi `AUDIO[fx]()` mà chưa ai viết `AUDIO.zero()`. Thêm một dòng là chạy, bảo tôi nếu muốn |
| `gun.mp3` | tiếng súng riêng cho Muzzle/Kai — đòn thường chưa tách tiếng theo nhân vật (cùng cảnh `laser gun.m4a` để dành từ đợt 1) |
| `male die 2·3·4.mp3` | đợt 3 đã có cơ chế nhiều bản (§9.3) nên dùng được ngay — nhưng vẫn vướng chỗ cũ: `kia` kêu cho cả drone và máy móc |

### Muốn quay lại bản cũ

Gói mới có `heal.mp3` và `wave.mp3` **trùng tên** với nguồn đợt 1, nên hai nguồn cũ đã đổi thành
`art-src/SFX/heal_v1.mp3` và `wave_v1.mp3`. Trả về bản cũ = sửa `MAP` (`'heal': 'heal_v1'`, `'wave': 'wave_v1'`, còn
lại đổi về `None`) rồi chạy lại script. Riêng `select`/`cursor`/`open` thì bản mượn nằm sẵn ở `audio/jdsherbert/`,
chép đè ngược lại là xong — nhớ trả luôn số `vol` (nhân ngược 4 · 1,4 · 2,3).

---

## 9. Đợt 3: một thao tác = một tiếng, và đòn thường có nhiều bản

Ba việc bạn yêu cầu sau khi nghe đợt 2.

### 9.1 Hết chồng tiếng

Trước đây một thao tác kêu 2–4 tiếng cùng lúc. Hai chỗ sinh ra chuyện đó:

| Chỗ | Trước | Giờ |
|---|---|---|
| **Trong trận** | một đòn gọi `hit`/`crit` **+** tiếng hiệu ứng (`explode`, `shock`…) **+** tiếng trạng thái lúc dính; đòn diện rộng đánh 3 địch thì nhân ba | `SFX_ONE` + `SFX_BEAT` trong `js/audio.js`: 10 tiếng va chạm dùng chung **một cửa sổ 140 ms**, tiếng nào gọi trước thì được kêu, các tiếng gọi sau trong cùng nhịp bị bỏ |
| **Nút bấm** | listener chung chạy ở pha **capture** (trước hàm của nút) nên nút nào tự kêu tiếng riêng là kêu **hai** tiếng — tab ARCHIVE kêu `cursor` hai lần, nút NHẬN thưởng kêu `cursor` + `open`, mọi nút menu kêu `select` + `swipe` | tiếng bấm bị **hoãn tới cuối lượt xử lý**; hàm của nút chạy xong mà đã có tiếng nào phát ra thì thôi (`AUDIO.n` đếm số tiếng đã phát) |

**Thứ tự ưu tiên nằm ở chỗ gọi trong `js/battle.js`**, không phải trong `js/audio.js`: `dealDamage` gọi theo thứ tự
**kết liễu (`kia`) > hiệu ứng riêng của đòn > chí mạng > đấm thường**. Hiệu ứng riêng đứng trên chí mạng vì nó cho biết
*đòn gì* vừa trúng, còn chí mạng thì đã có overlay và số đỏ trên màn rồi. Muốn đảo thì đổi chỗ hai nhánh giữa.

**Ba tiếng cố tình KHÔNG bị chặn** — chúng là tiếng báo, mất là người chơi không biết chuyện gì vừa xảy ra:
`ready` (Energy đầy) · `ult` · `wave` · `victory`/`defeat`. Riêng `ready` luôn kêu đúng lúc với tiếng đấm vừa nạp
Energy cho nó, nên nó được **lùi 320 ms** để nghe thành "đấm — *ding*" chứ không phải hai tiếng chồng lên nhau.

Đo trong trận thật (07-A, 3 lượt): `poison +0ms · hit2 +10049 · hit +11597 · hit2 +13222 · poison +13939 ·
burn +15458` — không có hai tiếng nào cách nhau dưới 700 ms.

### 9.2 Bấm ATTACK không kêu nữa

`SFX_MUTE` ở cuối `js/audio.js` (đang là `'#btnAttack'`). Nút nào muốn im lúc bấm thì thêm selector vào đây —
tiếng đấm lúc trúng mới là phản hồi thật, tiếng bấm chỉ làm nhiễu.

### 9.3 Đòn thường bốc ngẫu nhiên nhiều bản

`SFX_VARIANTS = { hit:3 }` trong `js/audio.js` — game tự tìm `audio/hit2.*`, `audio/hit3.*` và **bốc ngẫu nhiên**
mỗi lần kêu. Thiếu bản nào thì bỏ qua bản đó, còn một bản thì y như cũ.

Đang có **2 bản**: `hit.ogg` (0,42 s, đợt 1) và `hit2.ogg` (0,78 s, từ `attack.mp3` của bạn). Muốn bản thứ ba thì
thả `hit3.mp3` vào thư mục gốc rồi `python scratch/sfx_install.py hit3` — không phải sửa code.

> Trong đống file bạn gửi không còn tiếng va chạm nào hợp làm bản thứ ba: `laser gun.m4a` đo ra gần `hit` nhất
> (0,71 s · 2186 Hz so với 0,42 s · 2243 Hz) nhưng nó là **tiếng súng**, mà `hit` dùng chung cho cả đội — Yuki và
> Ronin cầm katana thì nghe sai. Muốn tiếng súng thì phải tách tiếng đòn thường theo nhân vật (§6).

Muốn tiếng khác cũng có nhiều bản (ví dụ `kia` với 4 bản `male die`): thêm một dòng vào `SFX_VARIANTS` rồi cài
`kia2` `kia3` `kia4` — cơ chế đã dùng chung.
