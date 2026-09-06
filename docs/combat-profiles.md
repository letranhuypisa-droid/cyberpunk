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

Tên thật ư? Hồ sơ nhân sự xưởng Halo tầng 40 ghi **KTV-9331**, ca đêm, tổ lắp ráp số 3. Không ai ở Free Zone gọi cô như thế. Cái tên Wire là do em gái cô đặt, năm con bé mười một tuổi, cho một sợi cáp dài hai mươi phân — chuyện ấy ở mục 5.

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

*Bản đầy đủ 10 chương: [`docs/chronicles/wire.md`](chronicles/wire.md) — đọc trong game ở ARCHIVE sau khi mở khoá.*

Xưởng Halo, tầng 40, ca đêm. Một unit vừa bị xoá được chở về để tháo vòng, và nhật ký hệ thống của nó còn mở trên màn hình. Dòng cuối ghi: xin đừng tắt đèn. Wire đọc dòng đó ba lần. Rồi cô rút trong túi áo ra một data shard đã mòn hết góc, cắm vào cổng tay, nghe lại bảy giây mà đêm nào cô cũng nghe. Nghe xong, cô đóng nhật ký, tháo sợi cáp hàn khỏi bàn thợ, nhét hai hộp ốc vít vào túi, và đi thang máy hàng xuống đáy. Vì cô không chắc dưới đó có ốc vít.

Bảy giây ấy là giọng em gái cô. Mira, kém cô tám tuổi, mắc một chứng thần kinh làm tay chân mỗi năm một mất kiểm soát. Con bé thích vẽ. Nên năm mười chín tuổi, Wire ra bãi phế liệu sau nhà nhặt đồ về lắp cho em một cánh tay. Xấu, không nhãn hiệu, không giấy chứng nhận của The Corp, và nó chạy. Trong cánh tay có một sợi cáp nhỏ nối thẳng vào cổng gáy, Mira gọi sợi cáp đó là sợi dây. Con bé bảo: còn sợi dây này thì chị em mình không mất kết nối đâu. Cái tên Wire là câu đùa của một đứa mười một tuổi, và nó theo cô đến tận bây giờ.

Nhưng linh kiện nuôi một cánh tay như thế thì phải mua, mà thứ đó không bán ở Free Zone. Nên khi The Corp treo bảng tuyển thợ ca đêm cho xưởng Halo tầng 40, Wire ký. Tám năm. Chừng chín trăm vòng. Cô ghi số lô từng cái vào một cuốn sổ tay không ai bắt cô ghi, và cô không nghĩ nhiều về việc mình làm, vì quy trình lắp Halo không có bước nào bắt phải nghĩ. Có một bước tên là "kiểm tra phản ứng đau". Ngay cả bước đó cũng chỉ yêu cầu tick vào ô.

Rồi đến lượt Mira. The Corp không giải thích, mà cũng chẳng cần: hồ sơ dân đáy có một ô ghi "chưa xác minh", và trong tay The Corp thì ô ấy muốn nghĩa là gì cũng được. Ba ngày sau Wire đi tra lại. Giấy khai sinh: không có. Hồ sơ khám: không có. Sổ trường: không có. Cái phòng khám dưới cống cũng bảo chưa từng nhận bệnh nhân nào tên đó. Mira Kess chưa từng tồn tại. Thứ duy nhất còn lại nằm trong hệ thống cánh tay cũ của Wire, dài đúng bảy giây: "Chị Wire… em vẽ xong rồi." Rồi tiếng cười.

Vậy nên đêm ấy, đọc đến dòng xin đừng tắt đèn, Wire mới chịu hiểu cái điều mà tám năm liền cô cố tình không hiểu. Chín trăm cái vòng kia cô lắp lên đầu chín trăm người, và mỗi người trong số đó là Mira của một ai đó. Cô bỏ trốn vì hối hận ư? Không. Hối hận là thứ ngồi yên một chỗ. Cô bỏ trốn vì cô còn nợ đúng chín trăm cái.

Giờ cô ở Free Zone, trong tổ của Operator, và cô đi tháo. Tháo Halo cho những unit Vixen mang ra khỏi hàng rào, hàn lại vòng gãy của Kira đủ để không rò điện, gỡ bộ đếm ngược khỏi ngực Meridian rồi bảo: chị muốn ở lại bao lâu thì ở. Riêng vòng đỏ của Psalm thì cô bị cấm chạm vào, vì Wire sẽ muốn sửa mà Psalm thì muốn nó cứ hỏng. Có một cái vòng cô không cần mở sổ ra tra: đêm Halo gia nhập tổ, Wire nhìn lên đầu cô ấy và đọc thuộc lòng số lô. Halo bảo tôi biết, tôi cảm thấy tay cô run lúc vặn con ốc cuối. Wire hỏi lúc ấy cô có đau không. Halo nói có, và nói thêm rằng cô là người duy nhất từng hỏi.

Đêm nào cô cũng nghe lại bảy giây đó một lần, vì cô sợ có ngày mình quên mất giọng con bé. Trên vỏ shard, cô lấy mũi dao khắc một dòng: MIRA — MẤT KẾT NỐI. Khắc xong cô ngồi nhìn nó rất lâu. Rồi cô khắc đè lên hai chữ cuối cùng.

MIRA — VẪN ĐANG KẾT NỐI.

> *"Ngoan nào. Đừng rò điện."*

---
