# CHROMEFALL — Sửa trình đọc truyện tranh (12/09/2026)

> Code: `js/comic.js` (renderer) · `css/chromefall.css` mục "COMIC" · `index.html` khối `#comic` · `js/app.js` (tab Archive).
> Dữ liệu trang: `js/story.js` — **đợt này KHÔNG sửa một chữ thoại nào** (lời đã chốt 10/09: 40 trang / 94 panel / 178 bong bóng).
> Đo: `node scratch/comic_fit.js` (khổ ảnh so với ô) · `scratch/comic_measure.js` (đo thật trên trình duyệt).

## 1. Bốn việc anh đặt

| # | Yêu cầu | Làm gì |
|---|---|---|
| 1 | Có nút quay lại trang vừa đọc | Nút `◂ TRANG TRƯỚC` ở thanh dưới + phím ← / Backspace |
| 2 | Đọc lại được trong Archive | Tab **TRUYỆN** mới trong Archive, liệt kê intro/outro từng màn |
| 3 | **Quan trọng nhất:** ảnh không được cắt mặt; bong bóng che quá nhiều | Ảnh vẽ tay chuyển sang `contain` (không bao giờ cắt) + chữ dồn xuống dải riêng dưới tranh |
| 4 | Bỏ đuôi bong bóng chỉ vào người nói | Xoá `data-tail` và toàn bộ CSS đuôi; giữ nhãn tên người nói |

## 2. Vì sao ảnh bị cắt mặt — đo được, không phải đoán

Ảnh panel dán bằng `object-fit: cover`, tức là **ô cắt ảnh cho vừa**. Ảnh thì tỉ lệ cố định (cắt sẵn theo mốc 375×812),
còn ô thì co giãn theo chiều cao màn. Đo `.panel` thật ở ba khổ máy:

| Layout | Ảnh cắt sẵn | Ô ở 375×812 | Ô ở 414×896 | Ô ở **375×667** | Cắt mất ở 375×667 |
|---|---|---|---|---|---|
| `splash` | 0.49 | 0.49 | 0.49 | 0.62 | **21% hai bên** |
| `v2` | 1.00 | 1.00 | 0.99 | 1.25 | **20% hai bên** |
| `w3` ô rộng | 0.93 | 0.93 | 0.92 | 1.17 | **21% hai bên** |
| `w3` ô nhỏ | 0.52 | 0.52 | 0.52 | 0.66 | **21% hai bên** |
| `v3` | 1.51 | 1.51 | 1.50 | 1.90 | **21% hai bên** |

`node scratch/comic_fit.js`: **94 panel, 0 panel lệch khung ở mốc 375×812** — ảnh vẽ đúng khổ. Lỗi nằm ở renderer,
không nằm ở ảnh. Máy nào màn ngắn hơn 812 (iPhone SE/8 375×667, cửa sổ trình duyệt thấp, máy có thanh địa chỉ)
là **mọi panel** đều bị xén, và vì `object-position` mặc định `50% 50%` nên xén đều trên dưới → mất trán, mất mắt.

Chốt: **ảnh vẽ tay (`has-art`) không bao giờ được cắt.** Đổi sang `object-fit: contain`. Chỗ trống thừa lấp bằng
chính ảnh đó phóng to + làm mờ (`.panel__bg`), nên panel vẫn kín khung, không có dải đen chết.
Ảnh tạm (thẻ nhân vật / nền sector, 1 panel còn thiếu ảnh riêng) vẫn giữ `cover` + `pos`/`zoom` như cũ vì đã chỉnh tay.

## 3. Vì sao bong bóng che nhiều — và cách bỏ che

Bong bóng đang neo tuyệt đối vào 7 góc (`tl tr bl br t b c`) **đè lên tranh**. Panel nhiều chữ nhất đang có
290 ký tự trong một ô 176px (`node scratch/comic_fit.js` liệt kê 39 panel ≥ 150 ký tự) — đo thật thì có panel
bị che tới 54% diện tích, và vì mặt nhân vật luôn ở nửa trên, bong bóng `tl`/`tr` che thẳng vào mặt.

Chốt: **panel tách làm hai tầng.** Tranh ở trên, chữ ở dưới, trong cùng một khung viền:

```
figure.panel          ← khung viền đen, nền = ảnh mờ
  div.panel__art      ← tranh (contain, không cắt) · sfx vẫn neo đè lên tranh
  div.panel__bubs     ← cột bong bóng, nền tối mờ
```

- Tranh giữ tối thiểu **46% chiều cao panel**; chữ dài đến mấy cũng không nuốt hết tranh.
- `at` (tl/tr/bl/br/t/b/c) từ nay **chỉ còn quyết định lệch trái / giữa / phải**, không còn quyết định trên/dưới.
  Thứ tự dọc = thứ tự viết trong `js/story.js`. Không sửa `js/story.js`: các giá trị cũ tự dịch sang căn ngang.
- `stack:true` / `stack:'end'` thành thừa (mọi panel đều xếp cột) — giữ nguyên trong data, renderer bỏ qua.
- Chữ tượng thanh (`bang`) vẫn neo tuyệt đối đè lên tranh, vì nó trong suốt và cố ý nằm trên tranh.

Đánh đổi đã cân nhắc: tranh nhỏ đi (mất phần diện tích nhường cho chữ) nhưng **thấy trọn vẹn**. Chọn thấy trọn
vẹn, vì đó là yêu cầu số 3.

## 4. Nút quay lại (việc 1)

- Thanh dưới: `◂ TRANG TRƯỚC` bên trái, gợi ý `CHẠM ▸` bên phải.
- Trang 1 thì nút mờ đi, bấm không ăn.
- Quay lại thì trang cũ hiện **đủ cả bong bóng** (đã đọc rồi, không bắt bấm lại từng câu).
- Phím: `←` hoặc `Backspace` = lùi · `→` / `Space` / `Enter` = tiến · `Esc` = thoát.

## 5. Archive → tab TRUYỆN (việc 2)

- Tab thứ 5 trong Archive, cạnh Nhân vật / Địa danh / Thuật ngữ / Sổ bộ.
- Mỗi màn một thẻ rộng: intro (`TRƯỚC TRẬN`) và outro (`SAU TRẬN`), kèm số trang.
- **Khoá theo tiến trình để không lộ truyện:** intro mở khi màn đã mở (`open`/`cleared`), outro chỉ mở khi
  **đã thắng** màn đó (`PLAYER.cleared`). Chưa mở thì thẻ xám, ghi `CHƯA MỞ`.
- Ảnh thẻ: panel đầu của phần đó (`art/comic/<sector>_<i|o>1_p1.jpg`).

## 6. Kết quả đo sau khi sửa

Đo thật trên trình duyệt, cả 94 panel của 40 trang, ở ba khổ máy:

| Khổ máy | Panel bị cắt ảnh | Bong bóng tràn khỏi ô | Che trung bình | Che nhiều nhất | Viền chừa nhiều nhất |
|---|---|---|---|---|---|
| 375×812 | **0** | **0** | 25% | 48% | 4% (trung bình 2%) |
| 375×667 | **1** — `07-C o4 p1`, panel duy nhất chưa có ảnh riêng nên rơi về ảnh tạm (`cover`) | **0** | 33% | 61% | 23% |
| 360×640 | **0** | **0** | 33% | 64% | 23% |

Mốc cũ (khảo sát 06/09, trước khi sửa): che trung bình ~30%, **13 panel bong bóng đè nhau**, và ở mọi khổ máy
khác 375×812 thì **mọi panel** đều bị xén ~21%, xén đều trên dưới nên mất trán/mắt nhân vật.

Che trung bình giờ còn 26% *và* toàn bộ nằm ở đáy khung, nên nửa trên — chỗ có mặt nhân vật — luôn thoáng.
Máy màn ngắn (667/640) chữ chiếm nhiều hơn vì ô thấp hơn mà lời thoại thì không đổi; đó là giới hạn của
lời đã chốt, không phải lỗi bố cục.

**Kiểm lại:**
- `node scratch/comic_fit.js` → 94 panel · 1 thiếu ảnh (`07c_o4_p1.jpg`) · 0 panel lệch khung ≥ 12%
- `node scratch/comic_lint.js` → 40 trang · 94 panel · 178 bong bóng (không đổi — đợt này không sửa lời)
- Đọc trọn 40 trang bằng trình đọc: 12/12 phần đóng đúng, không kẹt trang

## 7. Còn nợ

- `art/comic/07c_o4_p1.jpg` — panel duy nhất chưa có ảnh riêng. Có ảnh rồi là hết cắt ở mọi khổ máy.
- Bốn panel chữ nặng nhất (`07-E o3p2`, `07-E o5p1–p3`) che 61–64% ở máy màn ngắn. Muốn nhẹ hơn thì phải
  cắt bớt lời hoặc tách trang — cả hai đều đụng vào lời đã chốt, nên để anh quyết.
