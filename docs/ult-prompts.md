# CHROMEFALL — Prompt video cut-in chiêu cuối (Seedance 2.5)

Cut-in là đoạn video 5 giây chèn giữa trận khi một nhân vật bung chiêu cuối. Engine tìm file
theo `ultVideo` trong `ROSTER` (JS); thiếu file thì trận bỏ qua cut-in, không lỗi. Tất cả nhân
vật đã có art thẻ đều đã nối sẵn `<id>_ult.mp4` — sinh video xong chỉ việc đặt file cạnh
`index.html` là chạy.

Hai file đang có (`kira_ult.mp4`, `psalm_ult.mp4`) là chuẩn để so: H.264, 1280×720, 5.04s, có
tiếng AAC.

## Spec kỹ thuật

- **16:9, 5 giây, 1280×720, H.264 .mp4.** Trần cứng là 8s (`battle.js` có guard `setTimeout(end, 8000)`
  để trận không bao giờ treo) — quá 6s là mất đuôi.
- Video đặt giữa sân dọc theo `width:125%` + `object-fit:cover` (`css/chromefall.css`, `.cutin video`)
  → **cắt mất ~12% mỗi mép trái/phải**. Hành động chính phải nằm trong 75% giữa khung.
- Hai nêm đen chéo phủ 12% trên và 12% dưới, thanh chữ `TÊN · ULTIMATE` nằm góc dưới trái.
  **Không đặt chi tiết quan trọng ở 15% đáy khung, và tuyệt đối không có chữ trong video** —
  game tự vẽ tên chiêu rồi.
- Người chơi tắt tiếng thì video chạy `muted`. **Hình phải tự kể xong câu chuyện; thoại là phần
  thêm.** Đòn đánh phải đọc được khi câm.
- Nhân vật phải khớp art thẻ. Cách chắc ăn nhất: đưa chính `<TÊN>.png` (hoặc `kira_portrait.png`)
  làm ảnh tham chiếu / khung đầu cho Seedance, rồi mới dán prompt.

## Nhịp chung 5 giây

| Thời điểm | Việc |
|---|---|
| 0.0–1.0s | Nhận mặt. Nhân vật đứng yên hoặc một cử chỉ nhỏ, mặt rõ, chưa đánh. |
| 1.0–2.4s | Nạp chiêu. Cái gì đó bật lên: kíp nổ, dây giật, vòng halo, cần gạt. |
| 2.4–4.2s | Đòn đánh. Một hành động duy nhất, không cắt cảnh. |
| 4.2–5.0s | Giữ khung tĩnh. Cắt về trận không bị giật. |

## Prompt chung (dán trước mỗi prompt riêng)

```
Anime cinematic ultimate-attack cut-in. One continuous 16:9 shot, 5 seconds, no cuts.
Cel-shaded anime rendered at 3D CG key-visual quality: crisp rim light on the character,
painterly background falling off into near-black #06070A, high contrast, thin volumetric haze,
fine spark and dust particles. Single character, centered, kept inside the middle 75% of the
frame; face readable within the first second. Camera: slow push-in on a slight low angle, one
accent move only, no shake. Background stays dark so the silhouette reads. Motion blur on the
weapon only. Hold the last 0.6 seconds on a still frame.
```

## Negative prompt

```
on-screen text, subtitles, captions, watermark, logo, UI, HUD, health bar, letterbox bars,
split screen, second character, crowd, camera shake, fisheye, lens flare spam, rainbow neon,
low contrast, washed out, extra fingers, deformed hands, outfit changing between frames,
hair color changing, face changing between frames, photorealistic, live action
```

## Bảng màu theo phe

| Phe | Màu |
|---|---|
| Rust | cam `#E2703A`, cam sáng `#F5A26E`, acid `#C9D830`, cáu bẩn `#6E6357` |
| Chrome | tím `#7C4DFF`, tím sáng `#B7A4FF`, trắng lạnh `#DCE6F7`, xám xanh `#5C6C8E` |
| Nền | `#06070A` |

Rust không dùng tím, Chrome không dùng cam. Đây là cách người chơi đọc phe trong nửa giây.

## Thoại

Mỗi chiêu một câu, dưới 8 chữ, nói xong trước 4.5s. Câu thoại ở đây là câu **trong trận**, khác
câu trích trong hồ sơ ARCHIVE — hồ sơ là để đọc, cái này là để hét giữa tiếng súng.

Seedance đọc tiếng Việt có thể chưa chuẩn dấu. Hai đường lui: (1) sinh video câm rồi thu thoại
ghép ngoài, (2) riêng Kira thì để tiếng Anh — cô vốn nói tiếng Anh trong game.

---

## kira_ult.mp4 — KIRA · ZERO

*Chrome · nuke · 100 EN · 320% ATK một mục tiêu, giết được thì hoàn 50 EN.* **Đã có video** —
prompt dưới đây để làm lại nếu muốn đồng bộ phong cách.

Zero là tên thanh kiếm, cũng là tên The Corp đặt cho cô. Cả chiêu nằm ở chỗ không ai thấy đường
chém.

```
A petite white-haired anime girl in a white and violet kimono over a white mecha bodysuit,
cat-ear headset with glowing violet lenses, a floating violet neon halo above her head, twin
katana. She tilts her head and smiles faintly, violet eyes flaring. The halo breaks into slow
orbiting fragments. She lays one finger on the hilt at her hip and draws in a single instant
horizontal cut — the blade is never seen mid-swing, only a white slash of light across the frame,
dust frozen in the air, violet #7C4DFF rim light in her hair. She sheathes the blade with a click;
the halo closes back into a ring and she holds still.
Cold white and violet on near-black.
```

**Thoại:** "Đếm tới ba nhé. …Một." (bản EN: *"Count to three. …One."*)
Giọng bé gái, ngân nga, vui vẻ — vế sau hạ hẳn xuống, hết sạch cảm xúc.

## psalm_ult.mp4 — PSALM · APOSTASY

*Chrome · control · 125 EN · chiếm quyền một kẻ địch trong một lượt.* **Đã có video.**

Anh không đánh. Anh mời. Cái đáng sợ là anh mời rất lịch sự.

```
A tall pale albino anime man in a black-and-white clerical coat with red lining, a cracked red
neon halo hanging broken above his white hair, chrome ribs exposed at his chest, a chained lantern
glowing red in his left hand. He bows his head, eyes closed, one hand on his chest. The lantern
flares and red smoke crawls up his sleeve. He lifts his face and raises two fingers in a blessing;
thin red filaments of light stream out of frame toward something unseen, red light caught in his
eyes. He smiles, tired, and the lantern dims.
Black, bone white and blood red only, cold #7C4DFF fill from behind.
```

**Thoại:** "Xưng tội đi. …Rồi quay lại."
Giọng nam trầm, dịu, mệt. Nói nhỏ như đang ở trong nhà thờ, không nhấn chữ nào.

## ronin_ult.mp4 — RONIN · IAIDO

*Rust · nuke · 100 EN · 280% ATK một mục tiêu.*

Không cấy ghép, không Halo, một thanh thép rèn ở tầng âm bốn. Sức nặng của chiêu nằm ở khoảng
lặng trước khi rút kiếm, không phải ở nhát chém.

```
A lean anime man with messy black hair, a black respirator mask with one red sensor light, a black
hooded coat with orange kanji on the shoulder, an armored glove on his right hand. Rain and neon
reflections on wet asphalt behind him. He drops into a low stance, left hand gripping the scabbard
of a plain steel katana, breath venting from the mask. One beat of complete stillness, only embers
falling. Then a single drawing cut: a white-hot orange arc #E2703A tears across the frame, sparks
spraying sideways, his coat snapping outward. He slams the blade back into the scabbard with a hard
click and the rain closes back in.
Rust orange and dirty steel on near-black, no purple anywhere.
```

**Thoại:** "Một nhát. Đừng bắt tôi chém hai."
Giọng nam trầm, khàn, nói khẽ và chậm. Không gấp, không doạ — anh chỉ đang thông báo.

## ash_ult.mp4 — ASH · FLASHOVER

*Rust · aoe · 75 EN · 150% ATK lên toàn bộ kẻ địch.* Cost bằng đúng thanh Energy tối đa của cô,
nên đầy thanh là bung được ngay.

Flashover là lúc cả căn phòng bắt lửa cùng một lúc. Mìn đã dán từ trước; chiêu cuối chỉ là ngón
tay cái bật nắp kíp.

```
A pale anime woman with long black hair, dark lipstick, a spiked choker, a black leather jacket
with a skull patch, tattooed midriff, a red-wrapped katana slung across her back, a cigarette
between her lips. She exhales smoke, staring straight ahead, and flips open the cap of a small
detonator in her scarred hand. Acid-green #C9D830 arming lights blink along satchel charges stuck
to pipes deep in the background. She flicks the cigarette away and presses the trigger: the entire
frame ignites at once in white-orange fire #E2703A, the blast wave rolling toward camera, her hair
and jacket snapping backward, her face lit hard and unimpressed. Black smoke, drifting embers; she
puts her hand in her pocket.
Rust orange, acid green, oily black.
```

**Thoại:** "Tôi định giá xong rồi. Cháy đi."
Giọng nữ khàn, thấp, đều đều như đang đọc bảng giá. Tuyệt đối không hét — cô chưa bao giờ phải hét.

## muzzle_ult.mp4 — MUZZLE · FIELD PATCH

*Rust · heal · 125 EN · hồi 120% ATK cho toàn đội.*

Anh không chữa cho ai. Anh dựng "Bà Ba" — tấm khiên hàn từ cửa xe — rồi đứng chắn để cả tổ băng
bó phía sau. Mười bốn năm gác cổng, đây là thứ duy nhất anh biết làm.

```
A huge broad anime man in a battered corporate security rig under a navy cloak, an industrial gas
mask with two glowing amber lenses, an armored prosthetic right arm, carrying a white car door
welded into a shield. Filtered breathing; the amber lenses brighten in the dark. He takes one heavy
step forward, raises the car-door shield, then slams its bottom edge into the ground: a ring of dust
and sparks blows outward and acid-green #C9D830 light floods up the welds. Threads of that green
light run backward past the camera as if reaching allies behind him. He braces, head lowered, the
shield humming.
Rust orange, amber lens glow, acid green accents, heavy grime, near-black background.
```

**Thoại:** "Bà Ba chắn. Băng bó đi."
Giọng nam rất trầm, vang trong lồng ngực, bình tĩnh. Có tiếng phin lọc thở ra trước và sau câu.

## echo_ult.mp4 — ECHO · RESONANCE

*Chrome · nuke · 100 EN · 250% ATK một mục tiêu. (★ FAKE)*

Cô được xuất xưởng với giọng sao chép của Kira, và đêm thứ tư thì cô tự cắt loa. Chiêu cuối là
lần cô mở lại — lần này âm phát ra là của chính cô.

```
A slender white android girl, faceless black visor showing a simple glowing cyan smile, thin
antenna ears, a white lab-coat robe with cyan lining over exposed white mechanical limbs, a cable
trailing from her back. Sterile empty white Corp lab. She tilts her head, then touches a severed
speaker port at her throat; small sparks. The cyan smile on the visor flattens into a single line.
Concentric rings of cyan sound #B7A4FF burst outward in hard layers, glass and dust shattering
along each ring, her robe blown flat against her. She goes still and the smile fades back in; the
cable behind her twitches.
Clinical white, cyan and violet #7C4DFF, almost no warm color.
```

**Thoại:** "Xin lỗi. …Cái này là giọng của tôi."
Giọng nữ trẻ, nhẹ, méo nhẹ kiểu máy. Ngập ngừng nửa nhịp trước vế sau, và vế sau thì chắc.

## wire_ult.mp4 — WIRE · OVERCLOCK

*Chrome · nuke · 75 EN · 220% ATK một mục tiêu. (★ FAKE)*

Tám năm lắp Halo cho The Corp, giờ cô nói chuyện với máy nhiều hơn với người. Chiêu cuối là cô
ép chính cánh tay mình vượt ngưỡng — và xin lỗi nó trước khi ép.

```
A young anime woman with long pale silver-cyan hair, a dark bodysuit under an oversized mechanic
jacket covered in tags and patches, tattoos on her shoulder, and a transparent glowing cyan
cybernetic left arm full of visible tubing. She looks down at the arm and taps its elbow joint
twice, almost fondly. She yanks a release lever at the elbow: white coolant vents in jets, cyan
current races up the tubes, the arm blows past white-hot. She lunges and drives a single punch out
of frame; a lattice of electric discharge snaps across the shot. She pulls the arm back, shaking it
to cool, wincing.
Cyan and violet #7C4DFF over a dark scrap workshop, white coolant vapor.
```

**Thoại:** "Xin lỗi nhé. Chịu khó một nhịp."
Giọng nữ tươi, nói nhanh, ấm. Cô đang nói với cánh tay chứ không phải với kẻ địch — đừng đọc thành
lời hăm doạ.

## stitch_ult.mp4 — STITCH · SUTURE

*Rust · heal · 100 EN · hồi 150% ATK cho toàn đội. (★ FAKE)*

Bà không hô hào ai. Bà làm việc. Mỗi lần mất một bệnh nhân, bà khâu thêm một mũi lên tay áo.

```
An older anime woman, grey hair in a bun, multi-lens goggles pushed up on her forehead, a
blood-stained surgical apron over a rolled-sleeve shirt, a back harness carrying four articulated
mechanical surgical arms, a vial of glowing green fluid at her hip. She pulls the goggles down and
a headlamp snaps on. The four mechanical arms fan out behind her and load needles. Threads of pale
green light shoot out and stitch in long crossing passes across the frame, wounds closing along each
stitch. She bites the thread off, pushes the goggles back up and turns away, unimpressed.
Dirty white, surgical steel, pale green fluid glow, warm rust light far in the background.
```

**Thoại:** "Nằm yên. Một mũi thôi."
Giọng bà già, khô, hơi cáu. Nói trong lúc tay vẫn đang làm, không nhìn lên.

## kai_ult.mp4 — KAI · RIPCORD

*Rust · nuke · 100 EN · 240% ATK một mục tiêu. (★ FAKE)*

Khẩu súng của Kai hàn từ phế liệu, phải giật dây mới nổ máy như máy cưa. Cậu giật dây, nòng quay
lên, rồi dốc sạch băng đạn vào một mục tiêu — và hét tên mình, vì ở đáy thành phố bị quên là chết
lần thứ hai.

```
A nineteen-year-old anime boy with long black hair, red eye makeup, a spiked choker, an open black
leather jacket with a skull patch over a bare tattooed chest, a red-wrapped katana on his back. He
spits out a cigarette, grins, and hauls an oversized scrap-built autocannon around from his back —
welded plates, exposed springs, a pull-start engine bolted to the receiver. He plants a boot on a
wrecked car and grabs the starter cord. First pull: the engine coughs and dies. Second pull: the
barrel cluster spins up and blue exhaust smoke jets out. He opens fire — rapid orange muzzle flashes
#E2703A, shell casings arcing away, his whole body kicking back with every burst, scrap and sparks
flying. The barrels wind down; he throws his head back, shouting, laughing.
Rust orange muzzle light, blue-grey smoke, dark scrapyard, no clean neon.
```

**Thoại:** "Kai! K, A, I! Nhớ chưa?!"
Giọng con trai mười chín, vỡ giọng, hét to quá mức cần thiết và cười ngay trong lúc hét.

---

## Sau khi sinh xong

Chuẩn hoá về đúng spec rồi đặt cạnh `index.html`:

```bash
ffmpeg -i raw.mp4 -t 5 -vf "scale=1280:720:flags=lanczos" -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart ash_ult.mp4
```

Kiểm nhanh trong game: vào trận, tích đủ Energy, bung chiêu. Cut-in tự chạy vì `ultVideo` đã nối
sẵn trong `ROSTER`. Nút SKIP ở góc phải luôn có, và guard 8s đảm bảo video hỏng cũng không treo trận.

Mười nhân vật còn lại (Vesper, Nyx, Halo, Cipher, Toll, Spark, Vixen, Meridian, Gravedigger, Junker)
chưa có art thẻ nên chưa lên prompt — có art rồi mới viết, để video khớp mặt.
