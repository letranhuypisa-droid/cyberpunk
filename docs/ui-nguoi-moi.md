# GIAO DIỆN CHO NGƯỜI MỚI (đợt 6)

> Lập 16/09/2026. Người đọc giả định: **chưa từng chơi game gacha/đánh theo lượt**, mở game lần đầu trên điện thoại.
> Phạm vi: chữ trên nút, thứ tự thông tin, dẫn dắt. **Không đụng cân bằng, không đổi cơ chế.**
> Liên quan: `docs/che-do-choi.md` (đợt 5), `docs/glossary.md` (từ điển thuật ngữ trong truyện).

## A. Người mới vấp ở đâu — soi thật, hồ sơ trắng, 375×812

| # | Vấp | Bằng chứng trên màn |
|---|---|---|
| 1 | **Không biết bấm gì trước.** HOME có **7 nút menu + 2 nút hành động**, trong đó 5 nút là chữ Anh và 6 tính năng chưa dùng được ở phút đầu | `SQUAD · MAP · DẸP LOẠN · CYBERWARE · GACHA · ARCHIVE · CONFIG` + `TIẾP TỤC ▸` + `DEPLOY` |
| 2 | **Hai nút cùng dẫn tới một chỗ.** `TIẾP TỤC ▸` vào thẳng màn đang mở, `DEPLOY` đi vòng qua đội hình rồi bản đồ rồi cũng vào đúng màn đó | `#btnContinue` và nút `data-go="squad"` nằm cạnh nhau trong cùng một khung |
| 3 | **Chữ Anh ở chỗ quan trọng nhất.** Nhãn chức năng, tiêu đề màn và HUD trận đều là tiếng Anh, trong khi toàn bộ truyện và lore là tiếng Việt | `SQUAD`, `Confirm squad`, `Next mission`, `SECTOR / ROUND / WAVE`, `ATTACK`, `REQUISITION`, `LORE`, `SYS` |
| 4 | **Chỉ số không ai giải thích.** Thẻ nhân vật in `ATK 145 · HP 950 · SPD 112 · CRIT 20%`, nút chiêu in `THIẾU 100 EN`; không có chỗ nào nói SPD hay EN là gì | màn SQUAD, nút `#btnUlt` |
| 5 | **Tiền không ai giải thích.** `CR` và `SH` nằm ở góc trên, `LK` xuất hiện ở màn cấy ghép — ba loại tiền, không dòng nào nói dùng vào việc gì | `.topbar__cur`, màn CYBERWARE |
| 6 | **Mã màn thay cho tên.** Màn đầu tiên hiện ra là `00-T`, kèm `2 WAVE · KHÔNG BOSS` | HOME, danh sách màn |
| 7 | **Hướng dẫn chỉ có trong trận.** 5 dòng hint (`SECTOR.hints`) đều nằm ở 00-T và 07-A; ngoài trận — đội hình, tuyển quân, cấy ghép, dẹp loạn — không có một dòng nào | `js/data.js` `hints:[...]` |
| 8 | **Không có chỗ tra cứu cách chơi.** ARCHIVE có 5 tab nhưng tất cả đều là *truyện*: nhân vật, sổ bộ, địa danh, thuật ngữ (lore), truyện tranh | màn ARCHIVE |

Điểm mạnh đang có, **giữ nguyên**: hint trong trận 00-T viết rất rõ; mỗi nút lớn đều có một dòng phụ giải thích
(`Chọn đội hình → bản đồ → chiến đấu`); DẸP LOẠN đã biết tự khoá và ghi điều kiện mở.

## B. Ba nguyên tắc cho đợt này

1. **Tiếng Việt là nhãn, tiếng Anh là không khí.** Mỗi nút giữ *cả hai*: dòng lớn tiếng Việt cho người đọc,
   dòng nhỏ giữ chữ Anh/mã màn cho chất cyberpunk. Không dịch tên riêng (CHROMEFALL, HALCYON, ZERO, RIPCORD,
   CHROME/RUST, REQUISITION khi nó là *tên cái bể*).
2. **Mở dần, không đổ hết.** Nút nào chưa dùng được thì vẫn hiện nhưng mờ và **ghi rõ điều kiện mở** —
   người chơi thấy game còn gì phía trước mà không phải chọn giữa bảy thứ mình chưa hiểu.
3. **Giải thích tại chỗ, không bắt đi tìm.** Chạm vào cụm chỉ số hay cụm tiền là ra ngay nghĩa của nó;
   trang CÁCH CHƠI là chỗ tra khi cần, không phải cửa ải bắt đọc trước.

## C. Việc làm

### C1. Một nút chính ở HOME (vấp 1, 2, 6)
- Gộp `TIẾP TỤC` + `DEPLOY` thành **một** nút lớn: `CHƠI TIẾP ▸` + dòng phụ `00-T · BÃI RƠI · 2 đợt địch`.
  Bấm là vào thẳng màn đang mở (đường cũ của `TIẾP TỤC`).
- `Đổi đội hình` tụt xuống thành nút phụ nhỏ bên cạnh, vì đó là việc *thỉnh thoảng*, không phải việc chính.
- Bỏ chữ "wave" khỏi mặt tiền: gọi là **đợt địch**.

### C2. Nhãn tiếng Việt (vấp 3)
| Chỗ | Cũ | Mới |
|---|---|---|
| Menu HOME | `SQUAD / 3 SLOT` | `ĐỘI HÌNH / 3 người ra trận` |
| | `MAP / HALCYON` | `BẢN ĐỒ / Thành phố HALCYON` |
| | `CYBERWARE / 6 Ô` | `CẤY GHÉP / CYBERWARE · 6 ô` |
| | `GACHA / REQUISITION` | `TUYỂN QUÂN / Quay thẻ · REQUISITION` |
| | `ARCHIVE / LORE` | `THƯ VIỆN / Hồ sơ · truyện · cách chơi` |
| | `CONFIG / SYS` | `CÀI ĐẶT / Âm thanh · video · xoá hồ sơ` |
| Tiêu đề màn | `Squad · Halcyon · Config · Cyberware` | `Đội hình · Bản đồ · Cài đặt · Cấy ghép` |
| Nút xác nhận | `Confirm squad` | `Xong · ra bản đồ` |
| HUD trận | `SECTOR · ROUND · WAVE` | `MÀN · VÒNG · ĐỢT` |
| | `RESET` | `ĐÁNH LẠI` |
| Nút đánh | `Attack` | `Đòn thường` |
| Title | `TAP TO START` | `CHẠM ĐỂ BẮT ĐẦU` (+ dòng Việt dưới logo) |

### C3. Chạm để hiểu (vấp 4, 5)
- Cụm tiền ở HOME (`CR`/`SH`) và ở màn cấy ghép (`LK`) chạm được → mở đúng mục **TIỀN** của trang CÁCH CHƠI.
- Cụm chỉ số trên thẻ nhân vật chạm được → mở mục **CHỈ SỐ**: ATK, HP, SPD (ai đi trước), CRIT, EN (Energy).
- Nút chiêu cuối trong trận: thay `THIẾU 100 EN` bằng `CÒN 4 ĐÒN NỮA` khi chưa đủ (vẫn giữ `0/100` ở dòng nhỏ).

### C4. Trang CÁCH CHƠI (vấp 8)
Tab thứ sáu trong THƯ VIỆN, viết như trả lời người bạn chưa chơi bao giờ. Tám mục ngắn:
**Vòng chơi · Trận đánh · Chỉ số · Chiêu cuối & Energy · Trạng thái · Tiền · Tuyển quân · Cấy ghép & Dẹp loạn.**
Mỗi mục ≤ 120 chữ, có ví dụ bằng số thật của game. Mở được từ nút `?` ở HUD trận, màn đội hình, màn tuyển quân.

### C5. Mở dần (vấp 1, 7)
- `TUYỂN QUÂN` khoá tới khi **xong 00-T**, `CẤY GHÉP` khoá tới khi **xong 07-A** (cùng mốc với DẸP LOẠN đang có).
  Nút khoá vẫn hiện, mờ, ghi `XONG 00-T ĐỂ MỞ` — và **bật sáng kèm chấm đỏ** đúng lần đầu mở được.
- Hint lần đầu **ngoài trận**: vào ĐỘI HÌNH / TUYỂN QUÂN / CẤY GHÉP / DẸP LOẠN lần đầu thì hiện một hộp
  2–3 câu (dùng lại `PLAYER.hintsSeen`, một lần cho mỗi hồ sơ).

## D. Không làm trong đợt này

- Không đổi bố cục sân đấu, không đổi cơ chế, không đụng một con số cân bằng nào.
- Không dịch tên chiêu, tên nhân vật, tên tổ chức — đó là tên riêng.
- Không thêm tutorial bắt buộc kiểu "bấm vào đây": game đã có hint và người chơi đã bấm được.

## E. Việc phải làm

- [x] E1. Kế hoạch này.
- [x] E2. C1 — một nút chính ở HOME.
- [x] E3. C2 — nhãn tiếng Việt toàn bộ giao diện.
- [x] E4. C4 — trang CÁCH CHƠI (9 mục: tab THƯ VIỆN + nút `?` ở ba màn).
- [x] E5. C3 — chạm để hiểu chỉ số / tiền, và nút chiêu đếm đòn thay vì đếm Energy.
- [x] E6. C5 — mở dần + hint lần đầu ngoài trận (7 màn).
- [x] E7. Kiểm: `check.js` xanh · hồ sơ trắng ở 375×812 và 375×667 · 0 lỗi JS.
- [x] E8. README + nhật ký.

Để dành: dịch nốt vài nhãn nhỏ còn tiếng Anh ở màn phụ (`◂ BASE`, `◂ MAP`, `SKIP ▸`, `PITY`, `DAILY`, `COMMS`)
— chúng ngắn, lặp nhiều và đã thành ký hiệu điều hướng; đổi thì phải đo lại chiều rộng từng thanh tiêu đề.

## F. Nhật ký

### 16/09 — dựng đợt 6

**Kiểm bằng cách chơi lại từ hồ sơ trắng**, không phải bằng cách đọc code: `localStorage.clear()` rồi đi
đúng đường một người mới đi — title → HOME → đội hình → bản đồ → màn → trận → thư viện.

**Một nút, một đường.** HOME cũ có `TIẾP TỤC ▸` và `DEPLOY` nằm cạnh nhau, cùng dẫn tới một trận; giờ
`CHƠI TIẾP` (to, tím) vào thẳng màn đang mở còn `ĐỔI ĐỘI` là nút phụ bên cạnh. Khối thông tin phía trên vẫn
bấm được nhưng chữ `CHƠI TIẾP ▸` trong đó bị rút còn một mũi tên — hai chỗ cùng một chữ thì người đọc phải
tự hỏi chúng khác nhau chỗ nào.

**Nhãn phụ phải vừa 67 px.** Ô menu là lưới 5 cột trên màn 375, mỗi ô rộng 67 px. `Thành phố HALCYON`,
`Quay thẻ · REQUISITION`, `XONG 00-T ĐỂ MỞ` đều xuống hai dòng và bóp chữ chính; rút thành `HALCYON`,
`quay thẻ`, `cần xong 00-T` là vừa một dòng. **Đo `getBoundingClientRect()` của từng ô trước khi chốt chữ.**

**Chấm đỏ phải gán cả hai chiều.** Bản đầu chỉ có `if (chưa xem) dot.hidden=false` — xem xong quay lại thì
chấm vẫn đỏ vì không có nhánh nào tắt nó. Giờ chấm có đúng hai lý do (vừa mở khoá chưa xem · đang có lá dư
chờ phân tách) và `dot.hidden` được gán trong mọi trường hợp. Lý do "có việc" đi qua `data-work` để hai
nguồn không ghi đè lẫn nhau.

**Chữ trong game phải khớp chữ trên nút.** Đổi nhãn nút `ATTACK` → `Đòn thường` làm câu hint tutorial
("Bấm ATTACK, rồi chạm vào kẻ địch") thành sai — hint là thứ duy nhất dạy người mới, sai một chữ là hỏng cả
bài học. Sửa cùng lượt. Cùng loại: bảng kết quả từng ghi "đọc hồ sơ ở ARCHIVE" trong khi nút giờ là THƯ VIỆN.

**Số trong trang CÁCH CHƠI phải lấy từ code, không lấy từ trí nhớ.** Bản nháp viết "mỗi đòn +25 Energy, đủ
100 là 4 đòn"; đọc `ROSTER` ra thì `ult.cost` có bốn mức (50/75/100/125) và Energy mỗi đòn có ba mức
(25/30/35) — câu đó sai với hơn nửa roster. Viết lại thành "khoảng ba đến năm đòn tuỳ người". **Trang hướng
dẫn sai còn tệ hơn không có trang nào.**

**Nút chiêu cuối đếm đòn thay vì đếm Energy**: `THIẾU 100 EN` → `CÒN 4 ĐÒN NỮA · 0/100 EN`. Cùng một thông
tin, nhưng vế trái nói bằng thứ người chơi điều khiển được.

**CÁCH CHƠI là overlay chứ không phải một màn.** Nếu nó là màn thì bấm `?` giữa trận sẽ gọi `go()`, mà `go()`
tăng `B.gen` và dọn mọi việc đang chờ — tức là mất trận đang đánh. Kiểm thật: mở giữa trận, đóng lại, trận
vẫn ở vòng 1 và không hề reset.

**404 còn lại không phải lỗi mới:** 12 file `art/card/<id>_portrait.jpg` của những người chưa có chân dung
cắt riêng — `loadFirst` thử chân dung trước rồi rơi về key art, đúng chuỗi dự phòng có sẵn từ trước.
