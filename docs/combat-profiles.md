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

## ECHO

### 1. Tên nhân vật

**ECHO** — *Giọng nói sao chép*

`Chrome · hạng A · thưởng khi clear 04-C ARCHIVE` — ATK 105 · HP 1000 · Energy tối đa 100

Biên bản The Corp gọi cô là **VX-07/B**: unit giọng, mang bản sao lô B của hồ sơ giọng Tài sản 07. Cái tên Echo không ai đặt cho cô cả — echo là một trường kỹ thuật trong nhật ký hệ thống, nghĩa là phát lại một mẫu đã lưu. Cô lấy đúng cái chữ xấu xí ấy làm tên, vì trong toàn bộ hồ sơ thì nó là chữ duy nhất nói đúng sự thật.

Người chơi gặp cô lần đầu ở phía bên kia sân, làm boss sector 04-C. Đánh xong thì cô xin một chỗ trong thứ tự lệnh.

### 2. Vũ khí

**LOA PHÁT TẦM XA "BẢN 07"** — *"COPY 07" broadcast cone*

Một cái loa đường kính bằng bàn tay, nối vào cổng dưới quai hàm bằng một sợi cáp bọc vải. Nó không phải để nói chuyện — nó để đẩy tiếng đi xa trong đường ống, nơi âm thanh dội mãi không tắt. The Corp đưa nó cho cô cùng ba câu được phép đọc, và trong ba đêm nó dụ được bảy người ra khỏi cửa.

Đêm thứ tư Echo cắt sợi cáp ấy. Cô không cắt vòng Halo trên đầu — cô cắt cái loa.

Rồi cô nhặt nó lên và giữ. Wire là người hàn lại sợi cáp đứt, nhưng **đấu ngược chiều**: giờ nó chỉ phát ra, không nhận vào. Không ai ra lệnh cho cái loa ấy được nữa, kể cả The Corp, kể cả Echo.

Trong bộ nhớ của nó vẫn còn nguyên bản sao giọng lô B. Nghĩa là thứ Echo cầm trong tay khi ra trận đúng là cái giọng đã giết bảy người, và cô dùng nó vì cô cho rằng bỏ nó đi thì bảy người kia không còn ai nhớ hộ.

### 3. Đánh xa hay cận chiến

**Đánh xa.** Xung âm định hướng, ăn cả một vòng cung phía trước; xa nhất roster cho tới lúc này.

Echo đứng **tuyến sau**, và phải đứng tuyến sau: HP 1000 với ATK 105 nghĩa là cô đánh khá đau nhưng ngã rất nhanh. Đội hình muốn dùng cô thì phải có người chắn — Muzzle hoặc Meridian đứng trước, Echo đứng sau và không di chuyển.

Cô là đối cực của Wire về mọi mặt. Wire vào sát, chịu đòn, làm **một** mục tiêu ăn đau hơn. Echo đứng xa, không chịu nổi đòn nào, và làm **cả sân địch** đánh yếu đi. Ghép hai người vào cùng đội thì một bên tăng damage đội mình gây ra, một bên giảm damage đội địch gây ra.

### 4. Chiêu cuối

**Nội tại — [MUTE] / CÂM**

Mỗi đòn thường của Echo áp `[MUTE]` lên mục tiêu, kéo dài tới hết lượt kế tiếp của chính nó. Trong lúc bị câm, mục tiêu:

- **gây ít hơn 25% sát thương**
- **bị cắt khỏi HALO LINK** — không hồi 8% HP mỗi lượt, và không tính là bạn link cho con khác

Vế thứ hai là lý do Echo tồn tại. Từ chương 2 trở đi, The Corp thả ra Warden, Exorcist, Organist và cuối cùng là The Canticle — đám `link:true` hồi máu lẫn cho nhau và kéo dài trận đến vô tận. Echo cắt đúng sợi dây đó.

**FEEDBACK — PHẢN HỒI** · 100 Energy · sát thương diện rộng + câm toàn sân

> **EN — FEEDBACK**
> Echo puts the Choir's own channel back into itself. Deals **140% ATK to all enemies** and applies `[MUTE]` to every one of them. For one round the Corp's song is only noise, and nothing on that channel heals anything.

> **VN — PHẢN HỒI**
> Echo đẩy chính kênh phát của Choir ngược trở lại vào nó. Gây **140% ATK lên toàn bộ kẻ địch** và áp `[MUTE]` lên tất cả. Trong một vòng, bài hát của The Corp chỉ còn là tiếng ồn, và không con nào trên kênh đó hồi được máu cho con nào.

*Vì sao là FEEDBACK chứ không phải RESONANCE như bản nháp trong `data.js`: cộng hưởng nghĩa là khuếch đại lên, tức ngược hẳn với việc cô làm. Feedback là tiếng rú khi đầu ra bị đưa ngược vào đầu vào — đúng cơ chế, và trong tiếng Việt "phản hồi" còn có nghĩa đáp lại, đúng luôn cái vòng truyện của cô: cô thôi lặp lại và bắt đầu trả lời. Đây là chỗ tôi tự đổi tên, không có va chạm nào bắt buộc phải đổi — bạn giữ RESONANCE cũng được.*

**Kịch bản video 5 giây** (`echo_ult.mp4`, H.264 1280×720):

| Thời điểm | Hình |
|---|---|
| 0–1s | Cận mặt nạ Echo. Cái mặt cười vẽ bằng đèn cyan trên tấm che **tắt hẳn**, chỉ còn tấm nhựa đen trơn. Hai cái ăng-ten trên đầu dựng lên. |
| 1–2s | Cô tháo cái loa khỏi quai hàm, cầm ngửa trong lòng bàn tay. Sợi cáp bọc vải buông thõng. Không có tiếng gì cả — **một giây im lặng tuyệt đối**, kể cả nhạc nền cũng ngắt. |
| 2–3.5s | Cô úp cái loa xuống. Vòng sóng cyan bung ra thành từng lớp đồng tâm, quét ngang sân. Kính vỡ, bụi bốc ngược lên trần. |
| 3.5–4.5s | Từng kẻ địch một, vòng Halo trên đầu chúng **nhấp nháy rồi tắt**. Đứa đang giơ vũ khí thì khựng lại giữa chừng. |
| 4.5–5s | Mặt nạ Echo sáng lại. Nhưng cái mặt hiện lên **không phải mặt cười** — chỉ là một đường thẳng. |

> *"Nghe rõ chưa? Đấy không phải giọng tôi."*

### 5. Lore

*Bản đầy đủ 10 chương: [`docs/chronicles/echo.md`](chronicles/echo.md) — đọc trong game ở ARCHIVE sau khi mở khoá.*

Điều đầu tiên Echo nghe được là giọng của chính mình, và nó không phải của cô. Ba ngày sau khi Tài sản 07 rơi khỏi Spire, The Corp xuất xưởng một unit giọng mang bản sao lô B thu từ hồ sơ của Kira — thu năm con bé bảy tuổi, trước khi người ta thay nửa người nó bằng chrome. Rồi hiệu chỉnh lên thành giọng người lớn bằng cách đoán. Nghĩa là cái giọng Echo đang mang không phải giọng Kira bây giờ, cũng chẳng phải giọng Kira hồi bé. Nó là giọng của một người chưa từng tồn tại.

Việc của cô có đúng một dòng mô tả: đứng ở miệng cống nối lên Spire, và gọi. Ba câu, thay nhau, không được thêm bớt. Về nhà đi. Ở đây an toàn. Chị không giận em đâu.

Đêm thứ nhất không ai ra. Đêm thứ hai một ông già ra, cầm theo cái đèn, vì ông nghe có đứa con gái gọi trong ống cống lúc hai giờ sáng và nghĩ nó bị lạc. Đêm thứ ba có bốn người, trong đó một người đàn bà vừa chạy vừa gọi tên con gái mình. Bảy người trong ba đêm, và không ai trong số đó là người The Corp muốn tìm. Echo đọc đủ ba câu cho đến hết ca, vì quy trình ghi rõ rằng ngừng giữa chừng làm giảm hiệu quả thu hút.

Đến ca thứ tư thì hệ thống báo bản thu bị lỗi mức, cần nghe lại để hiệu chỉnh. Cô nghe. Đến lần thứ mười một thì cô nghĩ ra được câu mô tả đúng việc mình đang làm, và cô nghĩ ra nó bằng chính giọng đi mượn: mình đang van xin một người xa lạ, bằng giọng của một người xa lạ khác.

Cô biết cách cắt vòng Halo. Mọi unit đều biết, người ta không buồn giấu. Cô không cắt. Cô luồn kìm xuống dưới quai hàm và cắt sợi cáp nối cái loa. Biên bản The Corp ghi: thu hồi, lý do hỏng thiết bị phát. Không có chữ phản bội nào cả — trong hệ thống phân loại của The Corp, việc cô làm không nằm ở mục hành vi mà nằm ở mục bảo trì. Về sau cô bảo Psalm rằng đó mới là câu tàn nhẫn nhất người ta từng viết về mình, vì muốn phản bội thì trước hết phải có ai đó tin mình, mà không ai tin một cái loa. Người ta chỉ bật nó lên.

Giờ cô ở trong tổ của Operator, và cô có một danh sách. Mỗi đêm nghĩ ra một câu, đọc lên, ghi lại, sáng hôm sau đối chiếu với bản gốc — trùng thì xoá. Gần như đêm nào cũng xoá, vì hoá ra một đứa bé bảy tuổi bị thu âm suốt sáu tháng đã nói gần hết những câu người ta cần nói trong đời. Danh sách hiện còn đúng một dòng, nằm đó mười một ngày, và cô vẫn xếp nó ở cột chưa xác nhận vì cô cho rằng mình tra chưa kỹ.

Dòng đó là: *Đừng nhìn tôi như nhìn chị ấy.* Cả tổ đã nghe cô nói câu ấy rồi. Không ai bảo cô cả — Ash bảo tìm hộ thì không tính, còn Kira nói ngắn hơn: nó là của nó rồi, chỉ là nó chưa dám nhận thôi.

> *"Đừng nhìn tôi như nhìn chị ấy."*

---
