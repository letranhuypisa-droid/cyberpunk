# Sprite động trong trận

> **11/09: idle animation đã bỏ theo quyết định của bạn ("xấu quá").** Mọi kẻ địch dùng ảnh tĩnh `art/sprite/<id>_idle.png`
> (tách nền bằng `scratch/key_enemy.py`, box trong `FOE_SPRITE`). Không con nào khai `anim` nữa; engine `SHEET` trong
> `js/battle.js` và CSS `.unit__sheet` còn nằm đó nhưng không chạy — xoá được khi rảnh. Tài liệu dưới giữ để tham khảo.
> Quy ước từ 11/09: **video chỉ dùng cho chiêu cuối** (`ultVideo`); đòn thường / đòn chí mạng là **ảnh tĩnh** `<id>_attack.png` /
> `<id>_crit.png` (Glass Jaw: hai frame cắt từ `jaw normal attack.mp4` và `jaw crit attack.mp4`, tách nền bằng `scratch/key_enemy.py --ref`).


Nhân vật trong trận là ảnh tĩnh đổi tư thế (idle / attack / dash / hurt). Con nào cần nhúc nhích
liên tục thì thêm **sprite sheet**: một ảnh chứa nhiều frame xếp thành lưới, JS đổi `background-position`
để chạy như phim. Hiện mới **Glass Jaw** dùng cách này.

Không dùng `<video>` cho sprite trong trận: mỗi thẻ `<video>` chiếm một mạch giải mã của máy, điện thoại
chỉ chạy trơn 4–6 cái, mà một trận đã có tới 6 unit. Video để dành cho cut-in chiêu cuối — lúc đó chỉ có
một video chạy. Xem `video/` và `playVideoBox()` trong `js/core.js`.

## Khai báo

Trong `ROSTER` (đội mình) hoặc `ENEMY_POOL` (kẻ địch), thêm `sprites`:

```js
sprites:{
  idle:['art/sprite/glassjaw_idle_still.webp'],          // ảnh tĩnh — bắt buộc
  anim:{ idle:{ sheet:['art/sprite/glassjaw_idle.webp'],
                cols:5, rows:4, count:20, fps:12, mode:'alt' } },
  box:{ idle:{w:418, h:682, ax:201} },
  face:'right',                                          // hướng nhìn trong file gốc, mặc định 'right'
}
```

| Khoá | Nghĩa |
|---|---|
| `idle` / `attack` / `dash` / `hurt` | ảnh tĩnh của từng tư thế, mỗi cái là danh sách dự phòng (`loadFirst` lấy file đầu tiên tồn tại) |
| `anim.<tư thế>` | sheet động cho tư thế đó. Thiếu, hoặc file lỗi → tự rơi về ảnh tĩnh |
| `cols` × `rows` | lưới của sheet. `count` = số frame thật (ô thừa ở cuối bị bỏ qua) |
| `mode` | `'loop'` chạy vòng, `'alt'` chạy xuôi rồi ngược |
| `box` | quy frame về hộp 744×682 để cao bằng các nhân vật khác — xem bên dưới |
| `face` | `'right'` hoặc `'left'`. Sprite nhìn cùng hướng với phe đối diện thì `setFrame()` lật ngang |

**`mode:'alt'` là cách chữa vòng lặp không khép.** Clip dựng từ video thường không quay về đúng tư thế
ban đầu, chạy vòng sẽ nảy một nhịp mỗi lần nối. Chạy xuôi rồi ngược thì chỗ nối chính là frame cuối nên
mượt tuyệt đối. Với động tác nhún tại chỗ mắt không nhận ra là đang tua ngược.

## Tính `box`

Hộp chuẩn của một unit là **744×682**, chân neo ở `x=372`, sàn trùng đáy hộp. `box` nói cho `setFrame()`
biết frame của bạn to bao nhiêu *trong hệ toạ độ đó*:

- `h` — chọn sao cho nhân vật cao bằng đồng đội. Sprite hero hiện tại: người chiếm **668/682 ≈ 98%** chiều
  cao khung. Nếu nhân vật của bạn chiếm `c` px trong frame cao `H` px thì `h = 668 × H / c`.
- `w` = `chiều rộng frame × h / H`
- `ax` — tâm bàn chân, tính từ mép trái frame, rồi nhân cùng hệ số `h/H`

Glass Jaw: frame 406×662, người cao 648 px, tâm chân ở x=195
→ `h = 668×662/648 = 682`, `w = 406×682/662 = 418`, `ax = 195×682/662 = 201`.

## Làm sheet từ video nền xanh

```bash
# 1. Tìm khung thật của nhân vật qua toàn bộ frame (đừng tin cropdetect — nó bỏ sót rìa mờ)
ffmpeg -i in.mp4 -vf "chromakey=0x16EE1A:0.16:0.04,format=rgba,alphaextract" -f rawvideo -pix_fmt gray alpha.raw
# rồi đo bbox của alpha.raw bằng numpy, nới thêm ~6px mỗi phía

# 2. Cắt + khử nền + lấy 12fps + xếp lưới
ffmpeg -y -i in.mp4 -vf "select='between(n,28,66)*not(mod(n-28,2))',\
crop=406:662:437:41,chromakey=0x16EE1A:0.16:0.04,despill=type=green:mix=0.5:expand=0.3,tile=5x4" \
  -vsync 0 -frames:v 1 sheet.png
ffmpeg -y -i sheet.png -c:v libwebp -quality 82 -compression_level 6 art/sprite/<id>_idle.webp

# 3. Ảnh tĩnh: lấy frame gần "tư thế trung bình" nhất, không phải frame đầu
ffmpeg -y -i in.mp4 -vf "select=eq(n\,50),crop=...,chromakey=...,despill=..." \
  -vsync 0 -frames:v 1 - | ffmpeg -y -i - -c:v libwebp -quality 88 art/sprite/<id>_idle_still.webp
```

Vài điều đã vấp phải:

- **`despill` là bắt buộc.** Không có nó, giáp trắng ăn ánh xanh của phông, đặt lên nền tối là thấy ngay.
- **Đếm bộ nhớ, không chỉ đếm KB.** Sheet giải nén ra chiếm `rộng × cao × 4` byte VRAM. Bản 20 frame của
  Glass Jaw là 21 MB; nếu để đủ 48 frame full-res thì thành 46 MB một con — ba con một trận là quá nặng cho điện thoại.
- **Đừng làm to hơn mức hiển thị.** `--uw` trong CSS kẹp unit ở 84–160 px; màn retina nhân đôi là 320 px.
  Người rộng 393 px trong sheet là vừa đủ, upscale nữa chỉ tốn dung lượng.
- **Bóng đổ dưới chân trong video** bị khử nền giữ lại thành vệt tối, chồng lên `.unit__shadow` của game.
  Crop cho khít người là hết.

## Người chơi tắt được

CONFIG có hai công tắc, mặc định bật (`js/app.js` → `renderConfig`):

- **ANIMATION NHÂN VẬT** (`settings.anim`) — tắt thì mọi sprite dùng ảnh tĩnh, `SHEET` ngừng chạy.
- **VIDEO CHIÊU CUỐI** (`settings.ultVideo`) — tắt thì `playCutin()` thoát ngay, chỉ còn banner tên chiêu.
  Sát thương và Energy không đổi.

**GIẢM CHUYỂN ĐỘNG** (`settings.motion`) và `prefers-reduced-motion` của hệ điều hành cũng tắt animation
sprite — một vòng lặp chạy mãi đúng là thứ hai cái đó muốn dừng. Xem `animOn()` trong `js/core.js`.

## Bộ máy chạy

`SHEET` trong `js/battle.js`: **một** vòng `requestAnimationFrame` chung cho mọi sprite, không phải mỗi
unit một vòng. Unit chết (`updateUnit`) hoặc rời sân (`renderSide` → `SHEET.prune()`) thì bị gỡ khỏi
registry; `initBattle()` xoá sạch. Đừng chỉ dựa vào `isConnected` trong vòng tick để dọn: tab ẩn thì
`requestAnimationFrame` không chạy, node cũ sẽ nằm lại qua nhiều trận.

## Chỉnh thử

`scratch/idletest/preview.html` — xem sheet chạy ở ba cỡ (84 / 160 / 320 px), có thanh chỉnh fps và
công tắc ping-pong. Mở qua server tĩnh (`.claude/launch.json` → `static`), không mở bằng `file://`.
