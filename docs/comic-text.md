# CHROMEFALL — toàn bộ chữ trong comic

> **File này sinh tự động** từ `js/story.js`. Sửa chữ ở đây rồi đẩy ngược vào game:
>
> ```bash
> node scratch/comic_text_apply.js
> ```
>
> **Luật sửa:** chỉ đổi phần chữ **sau** dấu `` ` `` cuối cùng và dấu `—`. Giữ nguyên mã trong dấu nháy ngược
> (`ai · kiểu · vị trí`), **đừng thêm dòng, đừng bớt dòng, đừng đổi thứ tự** — script ghép lại theo đúng thứ tự này.
> Muốn thêm hoặc bỏ hẳn một bong bóng thì sửa trong `js/story.js` rồi chạy lại `comic_text_dump.js`.
>
> **Vị trí bong bóng:** `tl` trên-trái · `t` trên · `tr` trên-phải · `bl` dưới-trái · `b` dưới · `br` dưới-phải · `c` giữa.
> **Kiểu:** `nói` · `nghĩ` · `hét` · `dẫn` (lời dẫn truyện) · `tiếng` (chữ tượng thanh).
> Luật viết (`docs/story.md` §5): bong bóng ≤ 25 chữ, lời dẫn ≤ 40 chữ, câu ngắn, thuật ngữ lần đầu phải giải thích ngay.

---

## 00-T · BÃI RƠI

### INTRO — trước trận

#### Trang 1 · bố cục `v2`

**Panel 1** · `art/comic/00t_i1_p1.jpg`
- `— · dẫn · tl` — HALCYON chọc thẳng lên trời như một mũi giáo thép. Ngự trên đỉnh là Tháp Canticle — lộng lẫy, sạch bóng, và ngạo nghễ dòm xuống tất cả.

**Panel 2** · `art/comic/00t_i1_p2.jpg`
- `— · dẫn · tl` — Dưới đáy cùng là Khu Đáy — bãi nôn của Tháp. Luật ở đây ngắn gọn đúng một câu: thứ gì rớt xuống mà không đè chết mày, thì nó là của mày mang đi bán.
- `— · tiếng · br` — VÚT

#### Trang 2 · bố cục `w3`

**Panel 1** · `art/comic/00t_i2_p1.jpg`
- `— · dẫn · tl` — Đêm nay Tháp lại xả rác. Nhưng thứ cắm thẳng xuống họng xả số 9 không phải một đống sắt vụn.
- `yuki · nghĩ · br` — …Không thấy đau. Chỉ thấy rỗng toác. Như thể vừa bị ai đó thọc tay vào đầu bốc mất nửa linh hồn.

**Panel 2** · `art/comic/00t_i2_p2.jpg`
- `— · dẫn · bl` — Cái Halo — vòng định danh mà Canticle tròng lên đầu đám lính máy — đã gãy gập, tóe ra từng tia điện xanh lè giật liên hồi.
- `— · tiếng · tr` — XẸT… XOẸT

**Panel 3** · `art/comic/00t_i2_p3.jpg`
- `yuki · nói · tl` — Trong đầu sót lại đúng hai mảnh ký ức. Tên mình là Yuki.
- `yuki · nói · br` — Và… cách chém người bằng thanh kiếm này.

#### Trang 3 · bố cục `v2`

**Panel 1** · `art/comic/00t_i3_p1.jpg`
- `— · dẫn · tl` — Đám Scav đánh hơi thấy mùi “đồ chơi” xịn vừa rớt. Tiếng ủng cao su lội lép bép trong vũng mưa axit, kính hồng ngoại lập lòe như mắt thú đói.
- `scav · hét · b · nhãn:SCAV` — Hàng tuyển rơi tụi bay ơi! Giữ nguyên cái vòng! Lột sạch giáp ngoài! Xẻ thịt chia phần mau!

**Panel 2** · `art/comic/00t_i3_p2.jpg`
- `yuki · nói · tl` — Sáu mạng. Tạm đủ khởi động.
- `yuki · hét · br` — Một… hai…

### OUTRO — sau trận

#### Trang 1 · bố cục `v3`

**Panel 1** · `art/comic/00t_o1_p1.jpg`
- `— · dẫn · tl` — Mười phút sau.
- `yuki · nói · b` — …Xong hết rồi à?

**Panel 2** · `art/comic/00t_o1_p2.jpg`
- `ash · nói · br` — Hàng cực phẩm… Halo cấp S, gãy vòng ngoài nhưng lõi còn nguyên tem. Cạy được cục này đem bán thì hai chị em tao húp thịt hộp nhòe mồm nửa năm!

**Panel 3** · `art/comic/00t_o1_p3.jpg`
- `kai · nói · b` — Bớt giùm em đi, bà chị sinh trước bảy phút ơi. Chị định để em mồ côi một mình hay gì?

#### Trang 2 · bố cục `v2`

**Panel 1** · `art/comic/00t_o2_p1.jpg`
- `yuki · nói · bl` — Yuki. Tôi chỉ nhớ mỗi cái tên đó thôi.
- `yuki · nói · tr` — Ai mở được cái này ra?

**Panel 2** · `art/comic/00t_o2_p2.jpg`
- `ash · nói · c` — Lò đúc của lão Foreman. Chỉ có lửa ở đấy mới luộc nổi hợp kim của Tháp. Mà đời này không ai nuôi báo cô ai đâu cưng — muốn gỡ vòng thì vác xác về làm culi trừ nợ cho băng của tao.
- `— · dẫn · b` — Không đáp lời, cô lẳng lặng cất bước đi theo.

---

## 07-A · CỔNG BÃI XE

### INTRO — trước trận

#### Trang 1 · bố cục `w3`

**Panel 1** · `art/comic/07a_i1_p1.jpg`
- `— · dẫn · tl` — Tổ nhặt phế liệu của Ronin. Thiết quân luật duy nhất: cấm rã xác người.
- `ronin · nói · c` — Ở đây tao chỉ lượm sắt vụn, không xẻ thịt đồng loại. Muốn nhập bọn thì tự chứng minh mày không phải một cục nợ vô dụng.
- `ronin · nói · b` — Lũ Scav đang chặn cổng bãi xe, bóp nghẹt đường ăn của tổ. Dọn sạch chúng nó cho tao.

**Panel 2** · `art/comic/07a_i1_p2.jpg`
- `— · dẫn · tl` — Muzzle quẳng cho Yuki một tấm khiên thô, gò vội từ cánh cửa xe bọc thép.
- `muzzle · nói · b` — Đỡ đòn. Cửa này chịu được ba phát. Phát thứ tư… để tôi lấy thân ra đỡ.

**Panel 3** · `art/comic/07a_i1_p3.jpg`
- `kai · nói · tl` — Quy tắc vàng để sống sót ở cái xó này: đừng bao giờ tin nụ cười của bất kỳ ai.
- `kai · nói · br` — Trừ em ra nhé. Em đẹp trai uy tín thế này, lừa chị làm sao được!

#### Trang 2 · bố cục `w3`

**Panel 1** · `art/comic/07a_i2_p1.jpg`
- `yuki · nói · bl` — Tôi đang cười à? Ừ. Chắc là vậy.

**Panel 2** · `art/comic/07a_i2_p2.jpg`
- `ash · nói · bl` — Liệu mà sống. Mày chết trước khi tao kịp bán cái vòng thì tao lỗ.

**Panel 3** · `art/comic/07a_i2_p3.jpg`
- `— · dẫn · tl` — Cổng bãi xe. Hai tốp Scav đang chờ.
- `yuki · nói · b` — Một tốp. Hai tốp. Tôi đếm được.

#### Trang 3 · bố cục `w3`

**Panel 1** · `art/comic/07a_i3_p1.jpg`
- `— · dẫn · tl` — Rồi tốp thứ ba tới. Đi sau cùng, không vội. Trùm băng Scav.
- `rigger · hét · b` — Luật bãi tao gọn thôi. Cứ rơi là hàng!

**Panel 2** · `art/comic/07a_i3_p2.jpg`
- `rigger · nói · tl` — Con ả này rớt trúng bãi tao đêm kia. Nó là đồ của tao!
- `yuki · nghĩ · br` — …Hàng. Ai cũng gọi tôi là hàng.

**Panel 3** · `art/comic/07a_i3_p3.jpg`
- `ash · nói · tl` — Hàng của tổ tao, cọc rồi. Biến.
- `— · tiếng · c` — RÍT
- `— · dẫn · b` — Ash chém toác khớp vai hắn rồi bước lên chắn trước mặt Yuki.

### OUTRO — sau trận

#### Trang 1 · bố cục `v2`

**Panel 1** · `art/comic/07a_o1_p1.jpg`
- `— · dẫn · tl` — Xuyên qua màn sương mù độc hại, một con drone trinh sát của Canticle hạ thấp độ cao. Tia laser đỏ lòm khóa thẳng vào con ngươi Yuki.
- `— · tiếng · br` — VÙÙÙ

**Panel 2** · `art/comic/07a_o1_p2.jpg`
- `kai · hét · tl` — Chết cha mày nè!
- `— · tiếng · c` — XOẸT!!
- `— · dẫn · b` — Nhát chém ngọt xớt của Kai phạt con drone làm đôi. Trên mảnh vỏ hợp kim còn bốc khói khét lẹt, một ký hiệu khắc laser lộ ra: 07.

#### Trang 2 · bố cục `w3`

**Panel 1** · `art/comic/07a_o2_p1.jpg`
- `yuki · nói · bl` — 07. Ký hiệu đó…
- `yuki · nói · tr` — …Ám chỉ tôi sao?

**Panel 2** · `art/comic/07a_o2_p2.jpg`
- `ash · nói · tl` — Canticle đang lùng sục mày ráo riết rồi đấy.
- `ash · nói · br` — Mày có giá hơn tao tưởng nhiều. Nhưng cũng phiền phức gấp mười lần.

**Panel 3** · `art/comic/07a_o2_p3.jpg`
- `ronin · nói · bl` — Rồi. Lò Foreman. Sáng mai cả ba đứa đi.

---

## 07-B · LÒ ĐÚC

### INTRO — trước trận

#### Trang 1 · bố cục `v2`

**Panel 1** · `art/comic/07b_i1_p1.jpg`
- `— · dẫn · tl` — Xưởng đúc bỏ hoang cắm sâu dưới lòng đất. Từng thuộc sở hữu của Canticle, nay là hang ổ của băng Foreman — nơi sở hữu ngọn lửa duy nhất ở Khu Đáy đủ nhiệt để bẻ khóa một chiếc Halo.

**Panel 2** · `art/comic/07b_i1_p2.jpg`
- `foreman · nói · t` — Lũ trên Tháp cứ tưởng dát vàng lên người là thành thần thành thánh.
- `foreman · nói · b` — Rơi vào lò tao thì vàng ròng hay sắt vụn cũng thành nước phở hết! Đống chrome trên người mày… tao tính tiền theo cân!

#### Trang 2 · bố cục `w3`

**Panel 1** · `art/comic/07b_i2_p1.jpg`
- `— · dẫn · tl` — Cửa lò mở tung. Luồng nhiệt hừng hực thốc vào mặt, đẩy cả ba phải lùi lại nửa bước.
- `ash · nói · br` — Ký ức mày bị niêm phong trong cái vòng đó. Muốn cạy ra thì phải nung đỏ.

**Panel 2** · `art/comic/07b_i2_p2.jpg`
- `yuki · nói · bl` — Nung hỏng thì sao?
- `ash · nói · tr` — Thì cái vòng hỏng. Ký ức bên trong cũng mất.

**Panel 3** · `art/comic/07b_i2_p3.jpg`
- `kai · nói · tl` — Tự dưng chị lải nhải giải thích dài dòng thế là đang lo sốt vó lên chứ gì?
- `yuki · nói · br` — Cứ nung đi. Tôi tự chịu.

#### Trang 3 · bố cục `w3b`

**Panel 1** · `art/comic/07b_i3_p1.jpg`
- `yuki · nói · bl` — Tôi cần mượn ngọn lửa của ông để bẻ cái vòng này. Ông muốn đổi bằng thứ gì?

**Panel 2** · `art/comic/07b_i3_p2.jpg`
- `foreman · nói · tl` — Tao muốn tống cả xác mày vào lò làm củi đốt!

**Panel 3** · `art/comic/07b_i3_p3.jpg`
- `kai · hét · c` — Chị ơi?! Lão này có hiểu tiếng người không đấy?!
- `ash · nói · b` — Rút đồ chơi ra!

### OUTRO — sau trận

#### Trang 1 · bố cục `w3`

**Panel 1** · `art/comic/07b_o1_p1.jpg`
- `— · dẫn · tl` — Foreman đổ sụp xuống sàn. Ngọn lò vẫn cháy hừng hực. Ash dùng kẹp sắt giữ chặt chiếc vòng gãy, dí sát mối nối vào tim lửa trắng.
- `— · tiếng · br` — XÈÈÈO…

**Panel 2** · `art/comic/07b_o1_p2.jpg`
- `— · dẫn · tl` — Một căn phòng vô trùng trắng toát đến lạnh người. Yuki bị xích chặt trên ghế kim loại.
- `— · nói · br · nhãn:GIỌNG TRONG KÝ ỨC` — Đơn vị 07. Xác nhận từ Cantor: Tỷ lệ đồng bộ dưới 40%. Xếp loại: Phế phẩm thải loại.

**Panel 3** · `art/comic/07b_o1_p3.jpg`
- `— · dẫn · tl` — Một bàn tay mang găng đen khẽ đặt lên đỉnh đầu cô. Chủ nhân của nó mang một chiếc Halo rực ĐỎ.
- `yuki · nghĩ · br` — …Cantor. Người đó chính là Cantor.

#### Trang 2 · bố cục `w3`

**Panel 1** · `art/comic/07b_o2_p1.jpg`
- `— · dẫn · tl` — Nhưng bàn tay ấy không nhấn nút hủy. Nó đưa ngược lên đỉnh đầu của chính mình.
- `— · tiếng · bl` — RẮC!

**Panel 2** · `art/comic/07b_o2_p2.jpg`
- `— · dẫn · tl` — Chiếc vòng đỏ gãy lìa. Ngay sau đó, vòng của cô nứt toác. Sàn kim loại dưới chân bất thình lình mở toang—
- `— · tiếng · br` — ẦM!!

**Panel 3** · `art/comic/07b_o2_p3.jpg`
- `— · dẫn · tl` — Đoạn ký ức tắt ngấm. Yuki giật bắn mình tỉnh lại, quỳ sụp giữa sàn xưởng.
- `yuki · nói · br` — Có người đã thả tôi xuống đây… Là cố tình làm vậy.

#### Trang 3 · bố cục `v2`

**Panel 1** · `art/comic/07b_o3_p1.jpg`
- `foreman · nói · tl` — Lũ óc chó này… Bật lò hết công suất thế này thì tín hiệu nhiệt trên Tháp nó thấy sạch rồi…
- `foreman · nói · br` — Tụi mày vừa tự thắp đuốc… dẫn quỷ xuống gõ đầu đấy…

**Panel 2** · `art/comic/07b_o3_p2.jpg`
- `ash · nói · tl` — Càng tốt. Đỡ mất công trèo lên tận nơi kiếm tụi nó.
- `kai · nói · br` — Chị nói câu đó cho đỡ quê à?
- `ash · nói · bl` — …Ừ.

---

## 07-C · HÀNG RÀO TẬP ĐOÀN

### INTRO — trước trận

#### Trang 1 · bố cục `v2`

**Panel 1** · `art/comic/07c_i1_p1.jpg`
- `— · dẫn · tl` — Vành đai đệm ngăn cách Khu Đáy với chân Tháp. Kính cường lực xám xịt, lưới quét nhiệt đan dày, tháp súng tự động chĩa họng đen ngòm.

**Panel 2** · `art/comic/07c_i1_p2.jpg`
- `archon · nói · t · nhãn:ARCHON · AI CỔNG` — Cảnh báo: Phát hiện Đơn vị 07. Trạng thái: hư hỏng. Yêu cầu tự giác bước vào khoang thu hồi để tháo dỡ linh kiện.
- `archon · nói · b · nhãn:ARCHON · AI CỔNG` — Các cá thể đi cùng: Giải tán ngay lập tức, hoặc bị tiêu huỷ theo diện phế phẩm.

#### Trang 2 · bố cục `w3`

**Panel 1** · `art/comic/07c_i2_p1.jpg`
- `— · dẫn · tl` — Một bóng người bước ra từ góc khuất rỉ sét. Chiếc Halo đỏ trên đầu đã nứt toác, câm bặt ánh sáng. Cánh tay và bả vai phải bọc hoàn toàn bằng kim khí thô ráp.
- `psalm · nói · br` — Tôi là Psalm. Kẻ đã cắt đứt vòng định danh Halo của cô rồi tống cô xuống đường ống cống.
- `psalm · nói · b` — Muốn xiên tôi đòi nợ à? Sống qua trận này đã.

**Panel 2** · `art/comic/07c_i2_p2.jpg`
- `kai · nói · bl` — Khoan đã bà chị! Nhìn cái Halo màu đỏ kìa. Hàng xịn thế này ra chợ đen bán được bộn tiền không?!

**Panel 3** · `art/comic/07c_i2_p3.jpg`
- `ash · nói · tl` — Ngậm mồm lại.
- `— · dẫn · b` — Kai và Muzzle lùi về bọc hậu giữ đường lui. Psalm bước lên lấp vào khoảng trống đội hình.

#### Trang 3 · bố cục `v2`

**Panel 1** · `art/comic/07c_i3_p1.jpg`
- `yuki · nói · bl` — Bà là người xuất hiện trong ký ức của tôi. Chúng ta có chuyện để nói với nhau đấy.
- `psalm · nói · tr` — Xem ra cô phản xạ nhanh hơn lần cuối tôi thấy đấy, Đơn vị 07.

**Panel 2** · `art/comic/07c_i3_p2.jpg`
- `archon · nói · t · nhãn:ARCHON · AI CỔNG` — Kích hoạt giao thức cưỡng chế thu hồi.
- `— · tiếng · br` — VÙ… VÙÙÙ!

### OUTRO — sau trận

#### Trang 1 · bố cục `v2`

**Panel 1** · `art/comic/07c_o1_p1.jpg`
- `— · dẫn · tl` — Cỗ máy Archon nổ tung thành biển lửa, thổi bay một mảng hàng rào hợp kim kiên cố. Khói đen cuộn xoáy.
- `psalm · nói · br` — Trên Tháp, đám lính sinh học biến đổi như cô được gọi là Choir — Đội Hợp Xướng. Đứa nào hỏng hóc, lỗi nhịp đều bị lôi đến phòng tôi.

**Panel 2** · `art/comic/07c_o1_p2.jpg`
- `psalm · nói · bl` — Tôi nghe chúng xưng tội lần cuối, rồi tự tay nhấn nút format sạch sành sanh. Ba trăm mười hai đứa, không sót một mống.
- `psalm · nói · tr` — Cô là ca thứ ba trăm mười ba. Cô không xưng tội. Cô trừng mắt hỏi tôi: “Bà có đếm xem tay bà đã tước bao nhiêu mạng người rồi không?”

#### Trang 2 · bố cục `v2`

**Panel 1** · `art/comic/07c_o2_p1.jpg`
- `yuki · nói · tl` — Và thế là bà cắt đứt Halo của cả hai người.
- `yuki · nói · br` — Bà nợ tôi một câu trả lời. Tôi rốt cuộc là ai trước khi bị tống lên ngọn Tháp đó?

**Panel 2** · `art/comic/07c_o2_p2.jpg`
- `psalm · nói · tl` — Tôi không biết.
- `psalm · nói · br` — Nhưng dưới đáy cống ngầm có một mụ già ghi chép mọi thứ rơi từ trên trời xuống. Từ sắt vụn… cho tới những đứa trẻ.

#### Trang 3 · bố cục `w3`

**Panel 1** · `art/comic/07c_o3_p1.jpg`
- `— · dẫn · tl` — Yuki chậm rãi nâng thanh kiếm lên, gác ngang vai Psalm. Lưỡi bén áp sát cổ họng. Không một ai bước ra can ngăn.
- `yuki · nói · br` — Ba trăm mười hai sinh mạng. Cho tôi một lý do để tha cho bà.

**Panel 2** · `art/comic/07c_o3_p2.jpg`
- `psalm · nói · bl` — Chẳng có lý do nào cả. Tôi đã làm, và tôi nhớ trọn vẹn ba trăm mười hai cái tên đó.
- `psalm · nói · tr` — Muốn chém thì cứ vung kiếm. Tôi không mở miệng xin tha.

**Panel 3** · `art/comic/07c_o3_p3.jpg`
- `kai · nói · tl` — Đừng chị… Nếu bả chết, ba trăm mười hai con người kia cũng biến mất vĩnh viễn theo.
- `kai · nói · bl` — Ở dưới Khu Đáy này, bị người đời lãng quên mới là cái chết thực sự.

#### Trang 4 · bố cục `v2`

**Panel 1** · `art/comic/07c_o4_p1.jpg` *(chưa có ảnh)*
- `ash · nói · tl` — Mother Rust. Giáo phái Rỉ Sét, lũ cuồng tín chuyên thờ phụng những mảnh rác rơi xuống từ Tháp.
- `ash · nói · br` — Mày mà vác xác tới đó, lũ đó sẽ lột sạch đồ của mày ra để đem lên bàn thờ đấy.

**Panel 2** · `art/comic/07c_o4_p2.jpg`
- `yuki · nói · tl` — Bà đi cùng chúng tôi. Và dọc đường, bà phải đọc cho tôi nghe từng cái tên một.
- `— · dẫn · b` — PSALM gia nhập tổ đội. Không phải vì được dung thứ — mà để trở thành cuốn sổ sống lưu giữ người đã khuất.

---

## 07-D · NHÀ THỜ DƯỚI CỐNG

### INTRO — trước trận

#### Trang 1 · bố cục `v2`

**Panel 1** · `art/comic/07d_i1_p1.jpg`
- `— · dẫn · tl` — Thánh đường ngầm rữa nát dưới lòng cống. Ống xả mục nát hàn chắp vá thành một cây đàn phong cầm khổng lồ; xác lính máy xếp lớp thành bệ thờ nghi ngút khói; nến đỏ cắm ngập trên những hộp sọ cơ khí cháy sém.

**Panel 2** · `art/comic/07d_i1_p2.jpg`
- `motherrust · nói · t` — Hỡi đứa con của sắt thép… Ta vẫn nhớ ánh mắt hoang dại này, từ trước khi lũ trên Tháp khắc số hiệu nô lệ lên gáy con.
- `motherrust · nói · b` — Quỳ xuống đi. Để ta tháo rời từng khớp xương rỉ máu, gột rửa và thánh hóa con trong bể dầu thánh…

#### Trang 2 · bố cục `v2`

**Panel 1** · `art/comic/07d_i2_p1.jpg`
- `yuki · nói · bl` — Kể chuyện trước, tháo xác sau.
- `yuki · nói · tr` — Bằng không, kẻ bị tháo rời linh kiện đầu tiên sẽ là bà.

**Panel 2** · `art/comic/07d_i2_p2.jpg`
- `psalm · nói · tl` — Bà ta giăng sẵn ba vòng tín đồ cảm tử. Phải đánh bóc vỏ từ ngoài vào trong.
- `kai · hét · br` — Khỉ thật, sao lúc quái nào cũng là ba lớp thế hả?!

### OUTRO — sau trận

#### Trang 1 · bố cục `v2`

**Panel 1** · `art/comic/07d_o1_p1.jpg`
- `— · dẫn · tl` — Mother Rust gục ngã dưới chân bệ thờ loang lổ. Bà không chạy trốn, run rẩy giở cuốn sổ bọc da đen ngòm vì dầu nhớt.
- `motherrust · nói · br` — Sáu năm về trước, Tầng Bốn sụp đổ. Bốn nghìn mạng người về với thánh. Canticle lạnh lùng đóng lên một con dấu đỏ chót: “Sự cố kết cấu kỹ thuật”.

**Panel 2** · `art/comic/07d_o1_p2.jpg`
- `motherrust · nói · tl` — Ba ngày sau, những chuyến xe tải bọc thép màu trắng bò xuống vùng đổ nát. Chúng không đến để bới sắt vụn… chúng đến để vét sạch lũ trẻ mồ côi.
- `motherrust · nói · br` — Lựa những đứa phản xạ bén nhất, lầm lì và cứng đầu nhất…

#### Trang 2 · bố cục `v2`

**Panel 1** · `art/comic/07d_o2_p1.jpg`
- `motherrust · nói · tl` — Ta chỉ kịp nhét vài đứa giấu sâu dưới đáy hầm phân hủy. Nhưng không tài nào giấu nổi con…

**Panel 2** · `art/comic/07d_o2_p2.jpg`
- `motherrust · nói · tl` — Con bé mười một tuổi gầy trơ xương, tay cầm thanh đoản kiếm rỉ sét của bố, lầm lũi đứng chắn ngang bánh xích xe tải.
- `motherrust · nói · br` — Khóe mắt nó ráo hoảnh, không rơi một giọt nước mắt. Miệng nó chỉ lẩm nhẩm bài đồng dao đếm bước chân của lũ trẻ Khu Đáy…

#### Trang 3 · bố cục `w3`

**Panel 1** · `art/comic/07d_o3_p1.jpg`
- `— · dẫn · tl` — Mảnh ký ức vụn vỡ bất ngờ dội về trong tâm trí Yuki.
- `yuki · nghĩ · tr` — Một bước… Hai bước… Ba bước…
- `yuki · nghĩ · br` — Âm thanh bê tông nứt toác. Cát bụi mù mịt. Bàn tay lạnh ngắt của mẹ buông thõng. Xác bố bẹp dúm dưới khối dầm thép gãy.

**Panel 2** · `art/comic/07d_o3_p2.jpg`
- `— · dẫn · tl` — Chiếc xe bọc thép trắng tinh không tì một vệt bụi bẩn. Gã đàn ông đội chiếc Halo vàng kim chói lóa cúi người nhìn xuống cô bé lấm lem đang gườm gườm chĩa kiếm.
- `— · nói · b · nhãn:GIỌNG TRONG KÝ ỨC` — Đứa này. Xích cổ nó ném lên xe.

**Panel 3** · `art/comic/07d_o3_p3.jpg`
- `yuki · nói · tl` — Cantor…
- `yuki · nói · br` — Chính lão ta là kẻ đã ném tôi lên chuyến xe đó.

#### Trang 4 · bố cục `v2`

**Panel 1** · `art/comic/07d_o4_p1.jpg`
- `kai · nói · tl` — …Bố mẹ chị… cũng chôn xác ở Tầng Bốn sao?
- `ash · nói · br` — Ba mẹ tao. Và cả dòng họ tao với thằng Kai nữa… Tất cả đều nằm vĩnh viễn dưới đống gạch vụn thối rữa đó.
- `— · dẫn · bl` — Lần đầu tiên trong đời, Ash mở miệng nói về gia đình mình.

**Panel 2** · `art/comic/07d_o4_p2.jpg`
- `motherrust · nói · tl` — Thang máy vận chuyển hàng số 3 nằm ngay sau lưng ta. Dẫn thẳng lên khu nghiên cứu trung tâm của Tháp.
- `motherrust · nói · br` — Cơ mà các con chẳng cần nhọc xác leo lên đâu… Thằng cha Cantor đang đích thân dẫn quân xuống đây dọn rác rồi đấy.

---

## 07-E · THANG MÁY HÀNG

### INTRO — trước trận

#### Trang 1 · bố cục `v2`

**Panel 1** · `art/comic/07e_i1_p1.jpg`
- `— · dẫn · tl` — Sàn nâng công nghiệp số 3, một khối lồng sắt khổng lồ lao vun vút từ đỉnh Tháp xé gió rít xuống đáy sâu. Mỗi nhịp cửa lưới thép mở ra ở từng khoang là một hàng lính Choir đứng bất động, vô hồn như búp bê cơ khí.

**Panel 2** · `art/comic/07e_i1_p2.jpg`
- `cantor · nói · t` — Đơn vị 07. Cô đang để dữ liệu bảo mật rò rỉ bừa bãi ra khắp cái máng lợn tăm tối này. Ta đành phải đích thân hạ cố xuống đây ấn nút xóa rác.
- `cantor · nói · b` — Còn Psalm… Giờ khắc của cô cũng hết hạn rồi.

#### Trang 2 · bố cục `w3`

**Panel 1** · `art/comic/07e_i2_p1.jpg`
- `— · dẫn · tl` — Trước khi mở miệng đáp lời, toàn bộ những thanh âm định giá thân xác cô suốt hành trình trốn chạy đồng loạt cuộn trào về, gầm vang chát chúa trong lồng ngực.

**Panel 2** · `art/comic/07e_i2_p2.jpg`
- `rigger · nói · tl` — Rơi trúng bãi của tao, thì nó là tài sản của tao!
- `foreman · nói · br` — Mớ chrome trên người mày, tao mua tính theo từng ký lô!

**Panel 3** · `art/comic/07e_i2_p3.jpg`
- `archon · nói · tl` — Tài sản trốn chạy. Cưỡng chế thu hồi để rã xác phế phẩm.
- `motherrust · nói · br` — Bộ xương thép của thiên thần giáng thế… Rã ra mà thánh hóa!

#### Trang 3 · bố cục `w3`

**Panel 1** · `art/comic/07e_i3_p1.jpg`
- `yuki · nói · bl` — Lũ chúng mày thích gọi tao bằng đủ thứ tên định giá trên đời. Nhưng tao có tên thật của tao.
- `yuki · nói · br` — Tao là Yuki. Còn mày chỉ là một thằng đồ tể nợ máu bốn nghìn sinh mạng ở Tầng Bốn!

**Panel 2** · `art/comic/07e_i3_p2.jpg`
- `psalm · nói · tl` — Ba trăm mười hai lần tôi bấm nút format ký ức theo mệnh lệnh của ông.
- `psalm · nói · br` — Hôm nay, lần thứ ba trăm mười ba… là nhát bấm tiễn đưa chính ông xuống mồ.

**Panel 3** · `art/comic/07e_i3_p3.jpg`
- `ash · nói · tl` — Bốn tầng nâng. Bốn đợt xả đạn.
- `kai · nói · br` — Một tầng một mạng! Đếm tiếp đi, chị hai Yuki!

#### Trang 4 · bố cục `v2`

**Panel 1** · `art/comic/07e_i4_p1.jpg`
- `cantor · nói · t` — Tiêu hủy. Bắt đầu.

**Panel 2** · `art/comic/07e_i4_p2.jpg`
- `yuki · hét · tr` — MỘT!

### OUTRO — sau trận

#### Trang 1 · bố cục `w3`

**Panel 1** · `art/comic/07e_o1_p1.jpg`
- `— · dẫn · tl` — Lưỡi kiếm rít gió, chém ngọt một đường chéo dứt khoát xẻ toang lồng ngực Cantor. Nhưng tuyệt nhiên không có một giọt máu tươi bắn ra.
- `— · tiếng · br` — XOẸT!

**Panel 2** · `art/comic/07e_o1_p2.jpg`
- `— · dẫn · tl` — Chỉ có chùm cáp quang đứt phụt, tia lửa điện nổ tanh tách tóe sáng cùng dung dịch làm mát màu xanh nhớt trào ra như mủ.
- `yuki · nghĩ · br` — …Không phải cơ thể người?!

**Panel 3** · `art/comic/07e_o1_p3.jpg`
- `— · dẫn · tl` — Trên lớp da mặt bằng nhựa tổng hợp đang biến dạng nham nhở vì chập điện, một mắt chiếu hologram bật sáng nhấp nháy.
- `cantor · nói · br` — Ra đòn ấn tượng đấy, 07. Tiếc thay, thứ cô vừa xẻ đôi chỉ là một con rối điều khiển từ xa mà thôi.

#### Trang 2 · bố cục `v2`

**Panel 1** · `art/comic/07e_o2_p1.jpg`
- `— · dẫn · tl` — Phân khu Thượng tầng District 01. Cantor thật ung dung tựa lưng vào ghế nhung, nhấp ly vang đỏ trong căn penthouse áp mái, ngạo nghễ nhìn xuống qua màn ảnh viễn trắc.
- `cantor · nói · br` — Muốn tìm ta bằng xương bằng thịt? Tự nhấc chân mà leo lên đỉnh Tháp này. Ta ngồi đây đợi cô… đồ rác rưởi.

**Panel 2** · `art/comic/07e_o2_p2.jpg`
- `yuki · nói · tl` — Tao đã nhớ lại toàn bộ.
- `yuki · nói · br` — Bố. Mẹ. Thảm kịch Tầng Bốn. Và sáu năm ròng rã bị biến thành món đồ chơi “Đơn vị 07” của mày.

#### Trang 3 · bố cục `v2`

**Panel 1** · `art/comic/07e_o3_p1.jpg`
- `psalm · nói · tl` — Trên đỉnh Tháp hiện có hàng nghìn đứa trẻ bị bắt cóc như cô năm xưa. Giờ tất cả đã bị nhào nặn thành một dàn Hợp Xướng Choir hoàn chỉnh.
- `ash · nói · br` — Hàng nghìn đứa? Thế nghĩa là… có cả nghìn cái Halo hạng S nguyên seal chưa bóc tem à?

**Panel 2** · `art/comic/07e_o3_p2.jpg`
- `kai · hét · c` — Chuyến này trúng mánh rồi! Bán xong nhớ chia em sáu phần đấy nhé!
- `ash · nói · t` — Bớt mơ mộng đi nhóc con. Chị mày chui ra khỏi bụng mẹ trước mày bảy phút. Chia đôi sòng phẳng.
- `ash · nói · b` — …Còn phần của mày, Yuki. Tụi tao để riêng một cọc.

#### Trang 4 · bố cục `splash`

**Panel 1** · `art/comic/07e_o4_p1.jpg`
- `kai · nói · bl` — Em sẽ lấy bút ghi lại hết. Không để sót một cái tên nào trên đời. Phải để lũ chuột dưới cống ngầm này biết đường mà ghi nhớ họ!

#### Trang 5 · bố cục `v3`

**Panel 1** · `art/comic/07e_o5_p1.jpg`
- `— · dẫn · tl` — Tiếng sắt thép cọ quẹt nặng nề kéo lê dọc đường ống. Muzzle lù lù bước ra trước, trên vai vác một cánh cửa xe tải bọc thép méo mó lỗ chỗ vết đạn.
- `muzzle · nói · br` — Bà Ba gãy nát ở khúc cống ngầm rồi. Cánh thứ tư này… tôi chưa kịp đặt tên.

**Panel 2** · `art/comic/07e_o5_p2.jpg`
- `— · dẫn · tl` — Ronin chậm rãi bước theo sau. Anh bình thản tra thanh kiếm thép sắc lạnh vừa mài suốt cả chương vào lại bao kiếm. Không một lời tuyên bố đi hay ở, chỉ có hành động.
- `ronin · nói · br` — Tổ của tao xưa nay tuy nghèo rớt mồng tơi, nhưng chưa bao giờ có tiền lệ bỏ mặc khách hàng lại phía sau.

**Panel 3** · `art/comic/07e_o5_p3.jpg`
- `ronin · nói · tl` — Tôn chỉ làm ăn của tổ tao: Không tháo dỡ đồng loại. Mà trên kia, đang có cả nghìn con người bị lũ trên Tháp tháo tung ra từng mảnh. Đã đi… thì cả tổ cùng đi.
- `yuki · nói · br` — Rõ, tổ trưởng.

#### Trang 6 · bố cục `splash`

**Panel 1** · `art/comic/07e_o6_p1.jpg`
- `— · dẫn · tl` — Dân Khu Đáy bao đời nay vẫn gọi những thứ phế liệu rớt từ trên đỉnh Tháp xuống bằng cái tên rẻ rúng: Chromefall. Những đống rác rưởi vụn vặt bị Tháp thượng tầng ruồng bỏ.
- `yuki · nói · br` — Vậy thì bảo đám người trên đỉnh ngước mắt xuống mà nhìn… Rác rưởi Chromefall này đang leo ngược trở lại tìm chúng nó đây!

#### Trang 7 · bố cục `splash`

**Panel 1** · `art/comic/07e_o7_p1.jpg`
- `— · dẫn · c` — HẾT CHƯƠNG 1
- `— · dẫn · b` — CHƯƠNG 2: THÁP — ĐANG PHÁT TRIỂN

---

*40 trang · 94 panel · 178 bong bóng.*

**Quá hạn chữ:**
- art/comic/00t_o1_p2.jpg · ash: 32 chữ (hạn 25)
- art/comic/00t_o2_p2.jpg · ash: 44 chữ (hạn 25)
- art/comic/07a_i1_p1.jpg · ronin: 27 chữ (hạn 25)
- art/comic/07b_i1_p1.jpg · —: 41 chữ (hạn 40)
- art/comic/07c_o1_p1.jpg · psalm: 30 chữ (hạn 25)
- art/comic/07c_o1_p2.jpg · psalm: 31 chữ (hạn 25)
- art/comic/07c_o2_p2.jpg · psalm: 26 chữ (hạn 25)
- art/comic/07d_i1_p1.jpg · —: 46 chữ (hạn 40)
- art/comic/07d_i1_p2.jpg · motherrust: 28 chữ (hạn 25)
- art/comic/07d_o1_p1.jpg · motherrust: 31 chữ (hạn 25)
- art/comic/07d_o1_p2.jpg · motherrust: 32 chữ (hạn 25)
- art/comic/07d_o2_p2.jpg · motherrust: 26 chữ (hạn 25)
- art/comic/07d_o2_p2.jpg · motherrust: 27 chữ (hạn 25)
- art/comic/07d_o3_p1.jpg · yuki: 27 chữ (hạn 25)
- art/comic/07e_i1_p1.jpg · —: 49 chữ (hạn 40)
- art/comic/07e_i1_p2.jpg · cantor: 35 chữ (hạn 25)
- art/comic/07e_o3_p1.jpg · psalm: 31 chữ (hạn 25)
- art/comic/07e_o4_p1.jpg · kai: 30 chữ (hạn 25)
- art/comic/07e_o5_p3.jpg · ronin: 37 chữ (hạn 25)
