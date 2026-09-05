# CHROMEFALL — Hồ sơ chiến đấu

Mỗi hồ sơ gồm đúng năm mục: **tên nhân vật · vũ khí · cự ly · chiêu cuối (Anh + Việt) · lore**.

Số liệu khớp với `ROSTER` trong `js/data.js`. Phần lore nối tiếp `docs/characters.md`, cùng một giọng kể:
mở bằng một cảnh đang diễn ra, có địa danh và truyền thuyết đường phố, động cơ nói thẳng.
Cơ chế nào cần engine đụng vào thì viết ở `docs/mechanics.md`, không viết ở đây.
Thêm nhân vật thì nối vào cuối file, giữ nguyên năm mục theo đúng thứ tự.

**Ràng buộc sản xuất** (quyết định mọi thiết kế vũ khí trong file này): engine load đúng ba frame mỗi nhân vật —
`idle`, `attack`, `hurt` (`preloadFrames`, `js/battle.js:115`). Vũ khí phải đọc được trong **một pose vung tay duy nhất**.
Chiêu cuối là video 5 giây phát bằng `playCutin`. Không particle system, không skeletal, không physics.

---

## WIRE

### 1. Tên nhân vật

**WIRE** — *Thợ máy bỏ trốn*

`Chrome · hạng B · nhận qua gacha (Requisition)` — ATK 80 · HP 1500 · Energy tối đa 75

Tên thật ư? Hồ sơ nhân sự xưởng Halo tầng 40 ghi **KTV-9331**, ca đêm, tổ lắp ráp số 3. Không ai ở Free Zone gọi cô như thế. Người ta gọi cô là Wire, vì thứ bước vào phòng trước cô bao giờ cũng là một sợi dây.

### 2. Vũ khí

**ARC WHIP "CHÍN TRĂM"** — *cybernetic conductive blade*

Cô ấy có một sợi dây duy nhất, nhưng nó luôn tìm được đường tới mục tiêu.

Một sợi cáp kim loại đen, dài chừng một mét rưỡi, nối thẳng vào cẳng tay giả bên phải. Lúc không đánh nhau nó cuộn quanh cổ tay như một cái vòng. Lúc kích hoạt, ba mươi phân cuối cùng bung ra thành một lưỡi năng lượng cyan — và đó là toàn bộ vũ khí. Không có sợi thứ hai.

Hai cánh tay cybernetic trong suốt của cô mới là bộ nguồn; Arc Whip chỉ là thứ được triển khai ra từ đó. Nên khi cả hai tay tắt đèn, cô không còn gì cả. Cô biết điều đó và vẫn tắt.

Tên chính thức trong sổ tay xưởng là arc whip, loại dùng để mở khoá vòng Halo mà không làm chín cái đầu bên trong. Wire gọi nó là **Chín Trăm**. Đúng bằng số vòng cô đã lắp.

Bộ đồ nghề dắt kèm ở hông:

- **Kẹp chẩn đoán** — cắn vào cyberware đối phương, đọc số hiệu, rồi làm ngược lại đúng những gì hướng dẫn sử dụng dặn.
- **Hai hộp ốc vít** — thứ duy nhất cô mang theo đêm bỏ trốn. Ốc M4 chèn khớp gối. Rẻ, bẩn, hiệu quả.

Cô không mài roi, không lên đạn, không kiểm tra vũ khí trước trận. Cô lau nó. Trước mỗi trận, Wire ngồi lau sợi cáp bằng một mảnh giẻ, và nói chuyện với nó.

### 3. Đánh xa hay cận chiến

**Cận chiến.** Tầm với chừng một mét rưỡi — đúng đoạn cáp bung ra, không hơn.

Đừng nhầm Arc Whip với vũ khí tầm xa. Wire vẫn phải đứng trong vòng chiến như Ronin, chỉ là cô không cần bước nốt bước cuối cùng. Một mét rưỡi ấy đủ để cô đứng ngoài tầm tay của một unit Choir mà vẫn chạm được vào cổng sống lưng của nó.

Chỗ đứng: **tuyến trước–giữa**. Chỉ số nói rõ vai trò — ATK 80 là gần thấp nhất roster, nhưng HP 1500 chỉ thua Muzzle và Junker. Cô không giết ai nhanh cả. Cô đứng đó, chịu đòn, và làm cho mọi thứ đội mình đánh vào mục tiêu ấy đau hơn.

Điểm yếu thì cô biết và không giấu: roi cần một nhịp để cuộn về. Ai qua được nhịp ấy thì tới được chỗ cô.

### 4. Chiêu cuối

**Nội tại — [OVERLOAD]**

Mỗi đòn thường của Wire cắm thêm một stack `[OVERLOAD]` lên mục tiêu, tối đa 3. Mỗi stack làm mục tiêu **nhận thêm 10% sát thương từ mọi nguồn** — kể cả đòn của đồng đội. Stack không tự nổ. Nó nằm đó và chờ.

Vì đòn thường cho 25 Energy còn Wire cần 75, ba đòn của cô vừa lấp đầy thanh Energy vừa lấp đầy ba stack. Hai cái đồng hồ chạy song song, và cùng về đích một lúc.

**DEAD SHORT — CHẬP MẠCH** · 75 Energy · sát thương diện rộng

> **EN — DEAD SHORT**
> Wire cuts every load out of the circuit and lets the current take the short path. Deals **160% ATK to all enemies**, plus **40% ATK per [OVERLOAD]** stacked on that target, then consumes every stack on the field.

> **VN — CHẬP MẠCH**
> Wire cắt bỏ toàn bộ tải ra khỏi mạch và để dòng điện đi đường tắt. Gây **160% ATK lên toàn bộ kẻ địch**, cộng thêm **40% ATK cho mỗi stack [OVERLOAD]** đang nằm trên chính mục tiêu đó, rồi ăn sạch mọi stack trên sân.

Nghĩa là người chơi có một quyết định thật trước khi bấm: dồn cả ba stack vào con boss, hay rải mỗi con một stack. Dồn thì một mục tiêu bốc hơi. Rải thì cả sân cùng cháy.

*Chú thích thuật ngữ: dead short là đoản mạch — dòng điện tìm được đường đi không qua tải, và mọi thứ trên đường đó cháy tức thì. Đó đúng là việc Wire làm với cyberware của đối phương.*

**Kịch bản video 5 giây** (`wire_ult.mp4`, H.264 1280×720):

| Thời điểm | Hình |
|---|---|
| 0–1s | Wire cúi nhẹ người. Hai cánh tay cybernetic mở ra. Toàn bộ đèn cyan trên tay cô **tắt phụt**. Màn hình tối đi trong chớp mắt. |
| 1–2s | *KZZZT—* Điện cyan chạy **ngược** từ hai bàn tay lên vai và cổ. Mắt Wire sáng lên. Sau lưng cô hiện một mạng lưới điện hình vòng cung. |
| 2–3.5s | Wire biến mất khỏi vị trí. Một đường cyan loé ngang màn hình. *SLASH.* Cô xuất hiện phía sau toàn bộ kẻ địch. Một nhịp im lặng. |
| 3.5–4.5s | Tất cả kẻ địch đồng loạt phát sáng cyan. Mọi `[OVERLOAD]` kích hoạt cùng một lúc. *KRA-KOOOM.* |
| 4.5–5s | Wire quay người lại. Arc Whip tự cuộn về cổ tay. Cô nhìn thẳng phía trước. |

> *"Chập mạch rồi. Xin lỗi nhé — số lô của mày tao cũng nhớ."*

### 5. Lore

Xưởng Halo, tầng 40, ca đêm. Một unit vừa bị xoá được chở về để tháo vòng, và nhật ký hệ thống của nó còn mở trên màn hình. Dòng cuối ghi: *xin đừng tắt đèn*. Wire đọc dòng đó ba lần. Rồi cô đóng nhật ký lại, tháo sợi arc whip khỏi bàn thợ, nhét hai hộp ốc vít vào túi áo, và đi thang máy hàng xuống đáy. Vì cô không chắc dưới đó có ốc vít.

Đêm cô bỏ trốn chẳng có gì gay cấn. Không còi báo động, không truy đuổi, không ai chặn ở cửa. The Corp mất một kỹ thuật viên ca đêm, mà trong biên bản, một kỹ thuật viên ca đêm không đáng viết quá ba dòng.

Trước đó là tám năm. Chừng chín trăm vòng Halo, và cô ghi số lô từng cái vào một cuốn sổ tay không ai bắt cô ghi. Cô là thợ nhanh nhất ca đêm, lĩnh thưởng đều đặn, không nghĩ nhiều về việc mình làm — quy trình lắp Halo không có bước nào bắt phải nghĩ. Có một bước tên là "kiểm tra phản ứng đau". Ngay cả bước đó cũng chỉ yêu cầu tick vào ô.

Vậy nên bây giờ cô đi tháo. Cô tháo Halo cho những unit Vixen mang ra khỏi hàng rào, hàn lại vòng gãy của Kira đủ để không rò điện, gỡ bộ đếm ngược khỏi ngực Meridian và bảo: chị muốn ở lại bao lâu thì ở. Riêng vòng Halo đỏ của Psalm thì cô bị cấm chạm vào — vì Wire sẽ muốn sửa, mà Psalm thì muốn nó cứ hỏng.

Có một cái vòng cô không cần mở sổ ra tra. Đêm Halo gia nhập tổ, Wire nhìn lên đầu cô ấy và đọc thuộc lòng số lô. Halo bảo: tôi biết, tôi cảm thấy tay cô run lúc vặn con ốc cuối, cô run từ hồi đó rồi. Wire hỏi lúc ấy cô có đau không. Halo nói có, và nói thêm rằng cô là người duy nhất từng hỏi.

Cô nói chuyện với máy nhiều hơn với người, và xin lỗi cả hai như nhau. Cô đang đi lên, cùng tổ của Operator, về phía cái nơi mà giọng nói trong ống dẫn gọi là *chỗ Halo được đúc* — và bảo rằng cô sẽ ghét nơi đó. Nó nói đúng. Đứng trước cái lò đã nguội, Wire đứng rất lâu, rồi đặt hai hộp ốc vít xuống đất.

Hoá ra dưới này vẫn có ốc vít. Cô chỉ cần tám năm để tin điều đó.

> *"Ngoan nào. Đừng rò điện."*

---
