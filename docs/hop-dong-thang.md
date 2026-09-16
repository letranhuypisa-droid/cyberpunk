# HỢP ĐỒNG THÁNG — cái đích dài 30 ngày (đợt 7 · D3)

> Lập 16/09/2026. Bản nháp ở `docs/giu-chan.md` §D3. Đây là "thẻ mùa" (battle pass) bản **chỉ có nhánh
> miễn phí** — game không bán gì, nên thứ duy nhất mượn từ mô hình đó là **thanh tiến trình nhìn thấy được**,
> đúng phần được cho là mạnh nhất và cũng là phần duy nhất không dựa vào tiền hay vào nỗi sợ hết hạn.

## A. Đo trước đã: SH đang thừa, không phải thiếu

Công cụ mới `scratch/econ_sh.js` cộng mọi nguồn SH (đọc thẳng `data.js` / `state.js` / `riot.js` nên không
bao giờ lệch với game). Kết quả 16/09:

| Nguồn | SH/tuần (chơi 7/7 ngày) |
|---|---|
| Nhiệm vụ ngày | 1.190 |
| Quà VỀ RỒI | 448 |
| Quét nhanh (tầng 20) | 840 |
| Chuỗi ngày | 240 |
| Hợp đồng tuần (DẸP LOẠN) | 370 |
| **Tổng** | **3.088** |

Quy ra thứ người chơi quan tâm: **103 lượt quay/tuần ≈ 11 loạt ×10**, tức **chạm pity 50 sau chưa đầy nửa tuần**.
Người chơi 3 ngày/tuần cũng được 1.492 SH = 50 lượt = **đúng một lần pity mỗi tuần**.

**Kết luận đổi hẳn thiết kế:** hợp đồng tháng **không trả SH làm thưởng chính**. Thêm SH vào đây là đổ nước
vào cốc đã tràn — và làm hỏng nốt ý nghĩa của thanh pity. Thưởng đi vào chỗ đang thiếu thật:

| Tài nguyên | Đang thiếu tới mức nào |
|---|---|
| **LK (linh kiện)** | một người kịch cyberware cần **2.208 LK**, mà nguồn duy nhất là phân tách bản dư |
| **CR** | một người lên cấp 20 = **76.000 CR**, đột phá đủ bốn sao thêm **44.000 CR** |
| **Cosmetic** | game **chưa có thứ nào** để khoe: không danh hiệu, không khung thẻ |

> **Việc nợ phát hiện khi đo (không sửa trong đợt này):** nguồn SH đã vượt xa giá quay từ trước D3, nên thanh
> pity gần như không còn tác dụng. Siết lại là đá vào người chơi hiện tại, nên cách đúng là **nâng giá trị
> của lượt quay** (bể to hơn khi chương 2 tới) chứ không phải cắt SH. Ghi ở đây để đợt sau không quên.

## B. Thiết kế

**Mùa = một tháng dương lịch.** Sang tháng thì thanh về 0 và mốc làm lại — cùng cách tính với nhiệm vụ ngày
(đổi ngày) và chuỗi tuần (đổi thứ Hai), nên không có đồng hồ thứ tư để lệch.

**Điểm gọi là DẤU.** Mọi việc trong game đều sinh dấu, nên không có "đường cày dấu" riêng nào phải học:

| Việc | Dấu | Ghi chú |
|---|---|---|
| Thắng một trận | 2 | mọi chế độ |
| Quay một lượt | 1 | ×10 tính 10 |
| Nhận một kiện hàng ở Khu Đáy | 1 | |
| Làm xong một nhiệm vụ ngày | 4 | 5 việc = 20 dấu |
| Nâng một cấp nhân vật | 2 | |
| Đột phá một sao | 15 | |

**Trần 60 dấu mỗi ngày.** Một ngày chăm (10 trận + 5 nhiệm vụ ngày + 10 lượt quay + 8 kiện) ra đúng khoảng
đó — trần tồn tại để **một buổi cày trắng đêm không nuốt cả mùa**, chứ không phải để chặn người chơi.

**20 mốc × 50 dấu = 1.000 dấu.** Chơi đều tay 30 ngày là 1.800 dấu (dư dả); chơi ~17 ngày là vừa đủ. Cố ý
để **đạt hết trước khi hết tháng** — cảm giác "xong sớm, vẫn còn chơi vì thích" tốt hơn "chạy nước rút cuối tháng".

Thưởng: **CR 53.000 · LK 560 · SH 300** cho cả mùa (bằng ~70% chi phí nâng một người lên cấp 20, và ~25%
số LK để kịch cyberware một người), cộng hai thứ chỉ có ở đây —
**khung viền thẻ** (mốc 10) và **danh hiệu** (mốc 20). Cosmetic không cộng một điểm sức mạnh nào.

## C. Cài ở đâu

| File | Thêm gì |
|---|---|
| `js/data.js` | `PASS` — mùa, trần ngày, bảng dấu, 20 mốc và thưởng · `PLAYER.pass`, `PLAYER.title`, `PLAYER.frame` |
| `js/pass.js` | `passTick/passAdd/passClaim/passInfo` + màn hợp đồng |
| `js/state.js` | gọi `passAdd` từ **một chỗ duy nhất** (`dailyProgress`) cho thắng trận / quay / kiện, và từ `dailyClaim`, `upgrade`, `ascend` |
| `js/app.js` | dải HỢP ĐỒNG ở HOME · danh hiệu dưới tên · khung thẻ |
| `index.html` + `css` | màn hợp đồng, dải, khung viền thẻ, danh hiệu |
| `scratch/econ_sh.js` | công cụ đo SH mỗi tuần (đã có, dùng lại mỗi lần thêm nguồn thưởng) |

## D. Kiểm

```bash
node scratch/econ_sh.js          # SH/tuần KHÔNG được tăng vì hợp đồng tháng (thưởng là CR/LK)
node scratch/check.js
```

Chơi thử: thắng một trận → dấu +2; làm xong một nhiệm vụ ngày → +4; đủ 50 dấu → mốc đầu nhận được;
đổi sang tháng mới → thanh về 0 và mốc đã nhận reset.

## E. Đo lại sau khi cài

`node scratch/econ_sh.js 7` — tổng SH/tuần **3.088 → 3.158** (+2,3%). Hợp đồng tháng chỉ góp **70 SH/tuần**
(300 SH cả mùa chia 30 ngày), đúng ý định: nó không đổ thêm nước vào cốc SH đã tràn. Phần thưởng thật nằm ở
**53.000 CR + 560 LK** mỗi mùa — hai thứ đang thiếu.

## F. Nhật ký

### 16/09 — dựng D3

**Đo trước, thiết kế sau — và phép đo đã đổi hẳn thiết kế.** Bản nháp §D3 định trả SH như mọi thẻ mùa
khác. Viết `scratch/econ_sh.js` để cộng mọi nguồn SH rồi mới thấy: người chơi đủ 7 ngày đã nhận
**3.088 SH/tuần = 103 lượt quay = chạm pity sau chưa đầy nửa tuần**. Thêm SH vào đây là làm hỏng nốt ý nghĩa
của thanh pity, nên thưởng chuyển hết sang **CR + LK + hai món cosmetic**.

**Hook điểm ở MỘT chỗ thay vì rải khắp code.** `dailyProgress(id, n)` vốn đã là cửa duy nhất cho
thắng trận / quay thẻ / nhận kiện, nên `passAdd` chỉ cần nằm ở đó cộng thêm ba chỗ riêng
(`dailyClaim`, `upgrade`, `ascend`). Không đụng một dòng nào trong `battle.js`, `riot.js`, `app.js` cho phần điểm.

**Dấu cộng theo số lần THẬT, không theo tiến độ nhiệm vụ ngày.** Nhiệm vụ "thắng 1 trận" đầy sau trận đầu,
nhưng trận thứ mười vẫn phải cho dấu — nếu không thì chơi nhiều hơn không được gì thêm, đúng thứ hợp đồng
tháng sinh ra để thưởng.

**Thanh tiến trình chạy trong phạm vi MỐC, không phải cả mùa.** 1.000 dấu cho cả tháng nghĩa là một thanh
"pts/1000" gần như đứng yên suốt tuần đầu — nhìn vào không thấy mình đang tiến. Vẽ theo mốc hiện tại thì
mỗi buổi chơi đều đẩy được thanh một đoạn thấy rõ.
