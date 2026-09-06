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

## KIRA

### 1. Tên nhân vật

**KIRA** — *Ác ma bé bỏng*

`Chrome · hạng S · thưởng khi clear 07-A SCRAPYARD GATE (tutorial)` — ATK 145 · HP 950 · Energy tối đa 100

The Corp gọi cô là **Tài sản 07**. Không phải mã unit, mà mã tài sản — trên Spire người ta không hỏi tên, người ta phát mã. Kira là tên có từ trước cái mã ấy, và là thứ duy nhất còn lại từ trước.

Ở Free Zone cô không cần hồ sơ. Người ta doạ trẻ con bằng cô: *ác ma bé bỏng sẽ bắt mất linh hồn của con đấy.*

### 2. Vũ khí

**ZERO** — *thanh kiếm không có số hiệu*

Lưỡi dài hơn cả người cầm, không dấu lò, không số hiệu, không một chữ nào khắc trên đó. Dân quận SIS tin nó do một Ripperdoc tên Jack rèn, nhưng đó là niềm tin chứ không phải bằng chứng — người ta cần tin một cái gì đó. Kira có Zero từ năm bảy tuổi và không trả lời được ai đưa.

**Thanh thứ hai — hàng cấp phát của The Corp**

Ngắn hơn, lưỡi phát sáng tím, số hiệu khắc ở chuôi, thay được lưỡi khi mòn. Tốt hơn Zero về mọi thông số đo được. Cô chưa đặt tên cho nó bao giờ, và cũng chưa vứt đi bao giờ.

Ash từng hỏi sao không bán, bán được khối tiền. Kira bảo: *vì em muốn biết em rút thanh nào trước, khi em không kịp nghĩ.*

Hai thanh kiếm ấy là toàn bộ câu hỏi của nhân vật này, đeo trên người. Một cái có từ trước The Corp, một cái do The Corp đưa, và cô không chắc cái nào mới là mình.

### 3. Đánh xa hay cận chiến

**Cận chiến, tuyến trước, và không có phương án B.**

ATK 145 là cao nhì roster; HP 950 là thấp nhất trong đám có art. Kira giết nhanh hơn bất kỳ ai và ngã nhanh hơn bất kỳ ai. Không có kỹ năng phòng thủ, không có đường lùi, không có gì để đổi lấy thời gian.

Cách chơi đúng là dồn cô vào mục tiêu sắp chết chứ không phải mục tiêu to nhất — vì `ZERO` hoàn 50 Energy nếu giết được, nên một cú kết liễu đúng lúc trả lại nửa thanh Energy và mở ra cú kế tiếp. Chơi sai thì cô là 950 máu đứng trước một con boss.

Ghép đội: cô hưởng lợi nhiều nhất từ Wire. Mục tiêu dính 3 stack `[OVERLOAD]` nhận thêm 30% sát thương, mà 30% của 145 ATK là con số lớn nhất bảng.

### 4. Chiêu cuối

**ZERO** · 100 Energy · sát thương đơn mục tiêu · *tên giữ nguyên theo canon*

> **EN — ZERO**
> One cut, named after the blade. Deals **320% ATK** to a single target. If it kills, **50 Energy comes back** — the sword pays for the next one.

> **VN — ZERO**
> Một nhát, đặt theo tên thanh kiếm. Gây **320% ATK** lên một mục tiêu. Nếu giết được thì **hoàn 50 Energy** — thanh kiếm tự trả tiền cho nhát sau.

*Đây là chiêu cuối duy nhất trong ba hồ sơ tôi không đổi tên. ZERO đã nằm trong `data.js` từ đầu, cơ chế `refundOnKill` đã chạy trong engine (`battle.js`, nhánh `nuke`), và cái tên trùng với tên thanh kiếm — đó là neo lore, không phải chỗ trống chờ điền.*

**Video cut-in:** `kira_ult.mp4` **đã có sẵn** trong repo, khác Wire và Echo. Không cần viết kịch bản mới.

### 5. Lore

*Bản đầy đủ 10 chương: [`docs/chronicles/kira.md`](chronicles/kira.md) — đọc trong game ở ARCHIVE sau khi mở khoá.*

Năm tên băng Neo Tokyo dồn cô vào một con ngõ cụt sau chợ đêm ở quận SIS. Đứa đứng sau cùng hỏi cô có biết vừa động vào ai không, rồi nói tên Ishi — cái tên đủ để người ta bỏ hàng xuống mà đi. Kira chớp mắt, nhìn thanh kiếm trong tay, và bảo: à, vậy chắc tôi gây chuyện to rồi. Mười phút sau cô bước ra, lau lưỡi Zero bằng một mảnh vải còn dính trên đó, rồi đứng lại giữa vũng nước dưới biển đèn và nhận ra một chuyện: cô đang cười. Không phải cười thắng, không phải cười vui. Chỉ là cười, rất tự nhiên. Cô đưa tay chạm lên môi mình và nói, với không ai cả: lạ thật.

Chuyện Free Zone kể về cô thì ai cũng thuộc. Một con bé bảy tuổi, một thanh kiếm dài hơn cả người nó, và một đêm mà sáng hôm sau không ai chịu nói ra con số. Điều đáng chú ý không phải con số — mà là chuyện đó xảy ra **trước** khi The Corp chạm vào cô. Nên câu hỏi cả quận SIS tránh không hỏi to là: The Corp đã biến một đứa bé thành thứ này, hay The Corp chỉ nhặt được một thứ vốn đã như thế rồi lắp thêm dây cương.

Cái The Corp lắp thêm thì có hồ sơ. Chúng thay nửa người cô bằng chrome, chụp lên đầu một vòng Halo, ghi vào sổ: Tài sản 07. Rồi sáu năm làm việc, không một mảnh ký ức nào — không phải quên, mà là không được phép hình thành. Và trong cấu hình của cái vòng ấy có một tham số giữ nét mặt ở trạng thái cố định, chọn sao cho tài sản vận hành ổn định lâu dài. Trạng thái được chọn là **cười**.

Ca xưng tội thứ ba trăm mười ba, Kira không kể gì cả — muốn kể tội thì phải nhớ mình làm gì, mà cô thì không được phép nhớ. Cô chỉ hỏi Psalm đúng một câu: bà có đếm không. Mười giây sau, Psalm giật vòng Halo của chính mình, bẻ vòng của Kira, rồi đạp bung tấm sàn ống rác.

Vòng Halo từ đó không phát đi đâu nữa. Nụ cười thì ở lại. Đó mới là chuyện đáng sợ, và Kira là người duy nhất trong tổ hiểu vì sao: cái mặt cô đang mang bây giờ không còn ai điều khiển, nghĩa là hoặc nó đã thành của cô, hoặc nó vốn là của cô ngay từ trước cả cái vòng. Một đêm cô sang chỗ Echo xin mở bản thu giọng gốc, cái thu hồi cô bảy tuổi, trước khi có Halo. Nghe xong cô ngồi im rất lâu rồi nói: nó cũng đang cười.

Cô đang truy một đầu mối cấp cao của The Corp, và lý do thì cô nói thẳng: để trả thù cho bố mẹ cô. Nhưng có một việc nữa cô làm mà chỉ nói ra một lần, ở cửa phòng Echo: *tôi không định biết chúng đã lấy đi cái gì. Tôi định biết cái nào chúng chưa từng đưa.*

> *"Hop! Skip! Jump! Oh... you're dead already?"*

---

## STITCH

### 1. Tên nhân vật

**STITCH** — *Bác sĩ của đáy thành phố*

`Rust · hạng S · nhận qua gacha (Requisition)` — ATK 140 · HP 900 · Energy tối đa 100

Stitch là tên nghề, không phải tên khai sinh. Tên khai sinh của bà từng nằm trong danh bạ y tế của cả thành phố, và bị rút ra khỏi đó lúc chín giờ mười sáng một ngày thứ ba. Không phiên toà, không ai giải thích. The Corp không cần làm cái việc dài dòng đó — nó chỉ rút một cái tên khỏi một danh sách.

### 2. Vũ khí

**BỐN TAY** — *four-arm surgical rig, tài sản bệnh viện tầng âm hai, có số kiểm kê*

Một bộ giá đeo lưng mang bốn cánh tay phẫu thuật nhiều khớp: **kim khâu dài, cưa xương, kẹp, mỏ đốt cầm máu**. Bốn tay làm được cùng lúc bốn việc mà một người chỉ làm được hai — ở tầng âm bảy, đó là khác biệt giữa cứu được và không.

Bà ăn cắp nó. Trên đường bị đuổi khỏi bệnh viện, bà rẽ qua kho thiết bị, mở tủ, và lấy. Bà biết mình đang ăn cắp, và bà vẫn lấy, vì cái thứ ở tầng âm bảy không có là cái thứ đó.

> **Một mô-típ chung của roster:** Wire mang sợi cáp hàn lấy khỏi bàn thợ xưởng Halo. Echo mang cái loa The Corp cấp cho cô. Stitch mang giá bốn tay của bệnh viện. **Cả ba đều mang theo dụng cụ của chính nơi đã đuổi mình đi**, và cả ba đều dùng nó ngược lại. Không nên trùng thêm lần thứ tư.

Trong trận, bà không vung tay loạn. Bà làm việc — chính xác, không vội, một dụng cụ một lúc. Đó mới là chỗ đáng sợ: bà đánh nhau y hệt cách bà mổ.

### 3. Đánh xa hay cận chiến

**Cận chiến, tầm với khoảng hai mét** — chiều dài cánh tay cộng chiều với của giá.

Nhưng đây là nhân vật **dễ xếp đội sai nhất bảng**. Chỉ số nói hai điều ngược nhau: ATK 140 là cao nhì roster, mà HP 900 là thấp nhất. Nhìn ATK thì muốn đẩy bà lên tuyến trước. Đừng. Bà là nguồn hồi máu lớn nhất đội, và bà chết trước bất kỳ ai.

Chỗ đứng đúng: **tuyến giữa, sau một người chắn**. Muzzle hoặc Meridian đứng trước. Bà đánh thường rất đau — 140 ATK không phải để trang trí — nhưng mỗi lượt bà đứng trong tầm với của một con boss là một lượt cả đội có thể mất bác sĩ.

### 4. Chiêu cuối

**Nội tại — [SỔ] / THE LEDGER**

Chừng nào Stitch còn sống, **mọi điểm sát thương đồng đội phải chịu đều được ghi vào sổ** — kể cả của chính bà. Con số hiện trên thẻ bà, cộng dồn cho tới khi bà dùng chiêu cuối. Trần sổ là **8 × ATK**.

Bà phải còn sống thì mới ghi được. Bà ngã thì sổ ngừng cộng.

**SUTURE — MŨI KHÂU** · 100 Energy · hồi máu toàn đội · *tên giữ nguyên theo canon*

> **EN — SUTURE**
> Stitch pays out the ledger. Heals every living ally for **80% ATK plus 35% of everything the squad has bled since the last suture**, then clears the book. The worse the round has been, the more it is worth.

> **VN — MŨI KHÂU**
> Stitch trả sổ. Hồi cho mỗi đồng đội còn sống **80% ATK cộng 35% toàn bộ sát thương cả đội đã chịu kể từ lần khâu trước**, rồi xoá sổ. Vòng đấu càng tệ thì nó càng đáng tiền.

**Vì sao không phải một chiêu hồi máu phẳng nữa:** roster đã có ba cái rồi — Muzzle `FIELD PATCH` (84/người), Halo `SANCTUM` (161), Meridian `BULWARK PROTOCOL` (85). Thêm cái thứ tư thì Stitch chỉ là số to hơn. Cơ chế sổ làm cô cong theo tình thế:

| Tình huống | Sổ | Hồi mỗi người |
|---|---|---|
| Đội còn lành, vừa vào trận | ~0 | **112** — thua Halo |
| Đội ăn đòn một vòng | ~600 | **322** |
| Đội sắp vỡ, sổ đầy trần | 1120 | **504** — gấp ba Halo |

Bà là người hồi máu tệ nhất khi mọi thứ đang ổn, và giỏi nhất đúng lúc mọi thứ hỏng. Đó là một bác sĩ.

*Không cần video cut-in mới: `stitch_ult.mp4` chưa có, và cơ chế đã đủ đọc được qua con số nhảy trên thẻ.*

### 5. Lore

*Bản đầy đủ 10 chương: [`docs/chronicles/stitch.md`](chronicles/stitch.md) — đọc trong game ở ARCHIVE sau khi mở khoá.*

Bệnh viện tầng âm hai, hai giờ sáng. Một unit Choir bò vào phòng cấp cứu bằng hai tay, vòng Halo trên đầu gãy làm đôi. Quy trình in trên tường, chữ to, ba bước: không can thiệp, báo The Corp, giữ nguyên hiện trạng. Stitch đã đọc ba bước ấy mỗi ca trực suốt mười một năm và thuộc lòng. Bà kéo rèm lại, cố định đốt sống cổ, nối tạm dây thần kinh chân, khâu bốn mươi hai mũi, rồi ra hành lang sau mở cái cửa dẫn ra đường ống thoát nước.

Sáng hôm sau không có ai tới bắt bà — đó là điều bà nhớ rõ nhất. Chín giờ, giấy phép bị thu. Chín giờ mười, tên biến khỏi danh bạ y tế. Chín giờ hai mươi, thẻ cửa không mở được nữa. Trên đường ra bà rẽ qua kho thiết bị và lấy đi bộ giá bốn tay phẫu thuật, tài sản bệnh viện, có số kiểm kê. Bà biết mình đang ăn cắp. Bà vẫn lấy.

Phòng khám của bà bây giờ là một cái container cạnh bãi xe tầng âm bảy, bàn mổ là tấm cửa xe tải kê lên hai thùng phuy. Bảng giá sơn trắng trên vách, đúng một dòng: *trả được gì thì trả.* Ai không có gì thì bà nhận một câu chuyện. Bà chép hết vào một cuốn sổ bìa cứng buộc dây cao su, và không ai được đọc — không phải để giữ bí mật, mà vì người ta kể thật nhất vào lúc nghĩ mình sắp chết, và cái nhận được lúc ấy thì không phải tiền công. Psalm từng hỏi sao không đốt đi cho xong. Stitch đáp: vì họ trả rồi, đốt đi thì thành ra tôi lấy không.

Bà là người hàn Junker vào chính chiếc xe của anh sau mười chín tiếng liền, cắt cánh tay hoại tử của Toll trong ba tiếng không thuốc giảm đau, và là người duy nhất Psalm cho phép chạm vào vòng Halo đỏ — vì Wire hỏi để chữa, còn Stitch hỏi để biết nó đang làm gì với cái đầu bên dưới, và Psalm phân biệt được hai câu hỏi ấy.

Mỗi lần mất một bệnh nhân bà khâu thêm một mũi lên tay áo trái. Tay áo giờ dày như một tấm giáp. Cả tổ đã thử khuyên bà thay; Ash không khuyên, Ash mua hẳn một cái áo mới để ở cửa, và cái áo ấy vẫn nằm trong container còn nguyên nếp gấp. Bà thuộc từng mũi, chỉ được không cần nhìn, mũi nào là ai. Hỏi vì sao phải xắn tay áo lên trước mỗi ca để mấy cái mũi nằm ngay dưới mắt mình, bà chỉ trả lời một lần, với Operator:

*Vì tôi sợ có ngày tôi thôi đếm.*

> *"Nằm yên. Tôi khâu người còn khéo hơn khâu máy."*

---

## RONIN

### 1. Tên nhân vật

**RONIN** — *Trưởng tổ nhặt sắt*

`Rust · hạng A · có sẵn từ đầu game` — ATK 130 · HP 1050 · Energy tối đa 100

Ronin không có mã của The Corp, không có số hiệu, không có hồ sơ nào để tra. Đó là nhân vật duy nhất trong bốn hồ sơ trước không mang theo dụng cụ của nơi đã đuổi mình — vì chưa nơi nào nhận anh vào để mà đuổi.

Anh là người đầu tiên gật đầu ở cổng Đông, cho một kẻ không Halo, không kiếm, ra lệnh cho cả tổ.

### 2. Vũ khí

**THANH THÉP TẦNG ÂM BỐN** — *không tên, không số hiệu, không phát sáng*

Kiếm của chị anh, rèn ở tầng âm bốn, đưa lại cho anh vào hôm chị được The Corp tuyển lên Spire cùng một câu dặn: *đừng bán thứ gì còn ấm.* Rồi chị đi, rồi không về.

Trong một thành phố mà ai cũng cầm thứ gì đó phát sáng, anh cầm một miếng thép. Nó không sắc hơn, không nhẹ hơn, không có gì hơn cả. Cái nó có là nó không cần cắm vào đâu.

**Đồ anh đeo, không phải đồ anh lắp:** mặt nạ lọc khí có đèn báo bộ lọc, và một tấm ốp cẳng tay bằng thép buộc dây. Đây là chỗ người ta hay hiểu sai về anh — anh không sống trần trụi, anh chỉ không cho thứ gì đi vào dưới da. Mặt nạ tháo ra được. Mắt hồng ngoại thì không.

> ⚠ **Lệch giữa art và canon.** `RONIN.png` vẽ anh cầm một thanh kiếm **phát sáng trắng-hồng**, trong khi cả bio lẫn hồ sơ này đều dựa trên việc thanh kiếm là thép trần. Mặt nạ và tấm ốp tay thì hoà giải được (đeo, không lắp), riêng lưỡi kiếm phát sáng thì không. Cần bạn quyết: sửa mô tả cho khớp art, hay coi ánh sáng đó là phản chiếu neon và giữ thép trần. Tôi đề nghị giữ thép trần — nó là toàn bộ nhân vật.

### 3. Đánh xa hay cận chiến

**Cận chiến, tuyến trước, và anh muốn đứng đó.**

ATK 130 / HP 1050 là chỉ số cân nhất bảng — không xuất sắc chỗ nào, không thủng chỗ nào. Sau bốn nhân vật chuyên môn hoá gắt (Wire chịu đòn, Echo giấy, Kira thuỷ tinh, Stitch bác sĩ mỏng), anh là người đứng được ở bất cứ đâu.

Và nội tại của anh **thưởng cho việc bị đánh**, nên chỗ đứng đúng là ngay tuyến đầu, cạnh Muzzle.

### 4. Chiêu cuối

**Nội tại — [ĐÁP] / RIPOSTE**

Kẻ địch nào đánh trúng Ronin thì **ăn ngay một nhát trả bằng 60% ATK**, không cần chờ lượt, không tốn Energy. Anh không né, không đỡ. Anh đáp.

**Nội tại — miễn nhiễm VERSE**

`VERSE` là cơ chế của **toàn bộ chương 3** (01-A → 01-E): từ wave 2 trở đi, bài hát gốc át deck và cả đội mất 25 Energy mỗi wave. Nó đi qua vòng Halo và qua deck.

Ronin không có vòng Halo, và không nhận lệnh qua deck. **Bài hát không với tới anh.** Anh là người duy nhất trong roster giữ nguyên Energy suốt chương cuối.

**IAIDO** · 100 Energy · sát thương đơn mục tiêu · *tên giữ nguyên theo canon*

> **EN — IAIDO**
> One draw, one cut. Deals **exactly 280% ATK** to a single target — no critical hit, no variance, no luck. The only attack in the game that lands on the same number every time.

> **VN — IAIDO**
> Một lần rút, một nhát. Gây **đúng 280% ATK** lên một mục tiêu — không chí mạng, không sai số, không may rủi. Đòn duy nhất trong game rơi vào cùng một con số mỗi lần.

*Đây là chiêu cuối cố tình không có mẹo, và đó chính là điểm.* Mọi đòn khác trong game nhân với sai số ±8% và có 15% cơ hội chí mạng ×1.5, tức kỳ vọng ×1.075. `IAIDO` bỏ cả hai: anh đánh đổi khoảng 7% sát thương trung bình để lấy sự chắc chắn tuyệt đối. Đó là một đánh đổi thật, và nó là câu *"mỗi nhát chém phải là của anh, không phải của một bài ca nào đó viết sẵn"* viết bằng số.

### 5. Lore

*Bản đầy đủ 10 chương: [`docs/chronicles/ronin.md`](chronicles/ronin.md) — đọc trong game ở ARCHIVE sau khi mở khoá.*

Hai gã kéo tới bãi xe một cái xe đẩy phủ bạt, và dưới lớp bạt là một người còn thở. Chúng nói giá luôn: thằng này sắp đi rồi, trong người có bộ lọc gan còn tốt với một cặp mắt hồng ngoại loại khá, tổ nào cũng nhận, chia đôi. Ronin nhìn cái xe đẩy rồi bảo: mang nó vào trong, chỗ Stitch, tôi trả tiền chuyến. Một gã cười bảo anh điên; gã kia tính nhanh hơn, hỏi thẳng thế bọn tôi được gì. Anh nói: không được gì. Tuần đó tổ ăn đồ hộp hết hạn, Ash ghi vào sổ chi tiêu ba chữ và gạch chân hai lần.

Luật của tổ chỉ có một điều: **không tháo người.** Nó đến từ một câu dặn. Chị anh — người duy nhất trong xóm được The Corp tuyển lên Spire — đưa anh thanh kiếm thép rèn ở tầng âm bốn và nói: *đừng bán thứ gì còn ấm.* Rồi đi. Rồi không về, không thư, không một dòng nào trong bất kỳ hệ thống nào để tra.

Chuyện anh không kể với ai là anh **không chắc mình hiểu đúng câu ấy**. Rất có thể chị chỉ đang dặn về cái chuôi kiếm bọc da, đem cầm đồ thì được kha khá — một câu dặn hết sức bình thường của người sắp đi xa, mà anh đã dựng cả một đời lên trên nó. Nhưng một cái xác thì cũng ấm, trong vài giờ, và ở tầng âm bảy thứ ấm ấy có giá cụ thể tính theo bộ phận. Anh chọn cách hiểu thứ hai. Không phải vì anh chắc, mà vì trong hai cách hiểu chỉ có một cách khiến anh chịu được việc phải nhìn mặt mình mỗi sáng.

Người ta chào hàng anh nhiều lần và món nào cũng hợp lý — mắt hồng ngoại nhìn được trong đường ống, khớp gối nhảy được hai tầng giàn giáo, cấy phản xạ nhanh hơn một phần mười giây mà một phần mười giây thì đủ để không chết. Anh từ chối hết. Anh **không ghét máy móc**: anh hàn cho Junker, anh giữ Muzzle dù nửa người Muzzle là đồ The Corp. Cái anh không muốn chỉ gọn trong một câu — mỗi nhát chém phải là của anh, không phải của một bài ca nào đó viết sẵn. Anh đã nhìn lính Choir đánh nhau. Chúng đánh giỏi hơn anh, đồng đều hơn anh, không mệt như anh. Và không có nhát nào trong đó là của chúng cả.

Đêm cổng Đông, khi kẻ lạ cầm deck bước ra, bốn người trong tổ quay sang nhìn anh — vì mười năm nay trong tổ ai ra lệnh thì đã rõ. Anh nhìn kẻ lạ, nhìn chiếc deck, nhìn cái đầu không có vòng Halo nào của kẻ ấy, rồi gật. Nếu ai hỏi thì anh sẽ bảo lúc ấy không còn lựa chọn nào khác. Chuyện đó đúng, nhưng không phải lý do. Lý do là anh vừa nhìn thấy một người ra lệnh cho cả một tổ mà không cần lắp vòng lên đầu ai cả, và anh đã đợi mười năm để biết chuyện đó có làm được không.

Bây giờ tổ đang đi lên từng tầng một. Trên Spire có một danh sách những người được tuyển lên, danh sách ấy có tên chị anh, và chỉ có một cách để đọc nó. Anh không nói với ai rằng anh đang đi tìm chị — anh nói anh đang chém. Cả tổ đều biết. Và có một chuyện anh đã chắc từ lâu, đủ để chịu được cái không chắc kia: *nếu hiểu sai, thì anh sai theo hướng ít người chết hơn.*

> *"Cậu quyết đi, Operator. Tôi chém."*

---
