# CHROMEFALL — THƯ VIỆN INGAME (bản gốc để viết lại)

> **File này để làm gì.** Gom một chỗ toàn bộ chữ sẽ hiện trong Thư viện ingame, để anh đọc hết một lượt rồi viết lại theo giọng của anh. Không có chỉ số cân bằng (ATK/HP/SPD/CRIT/%), không có ghi chú kỹ thuật, không có prompt art.
>
> **Nguồn gom.** `docs/glossary.md` · `docs/story.md` · `docs/characters.md` · `docs/characters-kit.md` · `docs/enemy-prompts.md` §5 · `js/data.js` (`LORE`, `ROSTER`, `ENEMY_POOL`, `SECTORS`, `MAP_AREAS`, `BONDS`).
>
> **Số liệu nằm ở đâu.** `js/data.js` là bản chạy thật; `docs/characters-kit.md` là bảng số đọc được. Đừng chép số vào Thư viện — số sẽ đổi, chữ thì không.
>
> **Luật viết** (`docs/story.md` §5): câu ngắn, một ý một câu. Thuật ngữ lần đầu xuất hiện phải giải thích ngay. Không ẩn dụ "hát/bài ca/nhịp". Hồ sơ nhân vật theo khung: Là ai → Chuyện đã xảy ra → Bây giờ → Câu nói, dưới 180 chữ.
>
> **Mã mục** (`Đ01`, `T01`, `N01`…) chỉ để anh đối chiếu khi viết lại. Không hiện trong game.
>
> **Dấu ✦ = bản anh đã viết lại (11/09), chốt.** Chữ trong những mục ấy là chữ cuối và đã cắm vào game: màn ARCHIVE giờ có bốn tab — **NHÂN VẬT · ĐỊA DANH · THUẬT NGỮ · SỔ BỘ**. Địa danh, thuật ngữ, sổ bộ nằm ở `CODEX` trong `js/data.js`; hồ sơ nhân vật nằm ở `LORE` + `ROSTER` cùng file. Mục không có dấu vẫn là bản nháp của em. Dòng *Trong game:* dưới mỗi mục ✦ là ghi chú kỹ thuật (màn nào, ai xuất hiện) — **không hiện trong Thư viện**, để riêng cho anh khỏi mất dữ kiện cũ.
>
> **Phần C và D1 in tự động** từ `js/data.js` bằng `node scratch/library_dump.js` (ghi giữa hai mốc `<!-- AUTO:… -->`). Sửa chữ ở `js/data.js` rồi chạy lại; sửa tay trong hai phần đó sẽ mất. Phần A, B, D còn lại vẫn viết tay.

---

## MỤC LỤC

| Phần | Nội dung | Số mục |
|---|---|---|
| **A** | Địa danh | 28 |
| **B** | Thuật ngữ | 38 |
| **C** | Nhân vật — tiểu sử · vũ khí · chiêu cuối · bản năng chiến đấu *(in tự động)* | 19 |
| **D** | Còn gì nữa — D1 sổ bộ đã viết xong, 9 mục còn lại vẫn là đề xuất | — |
| **E** | Chỗ còn thiếu và chỗ còn lệch, cần anh quyết | 15 điểm |

---
---

# A. ĐỊA DANH

Ba nhóm: thành phố và tầng lớp (Đ01–Đ06) · sáu màn chương 1 (Đ07–Đ13) · những chỗ chỉ được nhắc trong lore (Đ14–Đ28).

Cột **EN** là cách gọi tiếng Anh đã dùng trong `docs/characters-kit.en.md` — giữ nguyên để bản dịch sau không mỗi chỗ một kiểu.

## A1. Thành phố và tầng lớp

**Đ01 · HALCYON — THÀNH PHỐ DỰNG ĐỨNG** ✦ — *EN: Halcyon*
Halcyon không trải rộng trên mặt đất; nó xé toang bầu trời bằng một thân tháp đồ sộ. Kẻ ở trên ngắm nhìn mây trắng qua kính titan; kẻ ở dưới chỉ thấy rác thải, dầu đen và bóng tối vĩnh cửu đè nặng lên nóc lều. Thành phố này không có tầng lớp trung lưu: một nửa sống như thần thánh, nửa còn lại cào bới phế liệu để đổi lấy từng ngụm khí thở.
*Trong game:* bản đồ là một lát cắt dọc của thành phố — năm lớp xếp chồng: đỉnh Tháp, thân Tháp, tầng sập, khu ổ chuột bám vào chân Tháp, bãi phế liệu ngập nước dưới cùng.

**Đ02 · NGỌN THÁP (QUẬN 04)** ✦ — *EN: the Spire · DISTRICT 04*
Thánh địa của giới tập đoàn và những cỗ máy hoàn mỹ. Mọi bề mặt ở đây đều phản chiếu ánh sáng trắng lạnh buốt của kính phản quang và hợp kim titan không tì vết. Ở độ cao này, không khí được lọc sạch mùi máu tanh, và những cây cầu trên không nối liền các văn phòng chọc trời như những dải lụa kim loại.
*Trong game:* chương 2.

**Đ03 · KHU ĐÁY (QUẬN 07)** ✦ — *EN: the Bottom · DISTRICT 07*
Nơi tiếp nhận toàn bộ cặn bã từ Tháp đổ xuống. Khu Đáy tồn tại nhờ rác, dầu thải và những mảnh máy móc vỡ nát. Nhà cửa là những thùng container hoen rỉ hàn chồng chất lên nhau quanh hệ thống cọc giàn giáo mục nát; lối đi là ống dẫn mục và dây cáp võng vỉa. Nơi đây không có mặt trời, chỉ có ánh đèn hơi natri đỏ quạch soi bóng những thân phận sống dựa vào sắt vụn.
*Trong game:* chương 1.

**Đ04 · ĐỈNH DISTRICT 01 — THÁNH CUNG CANTICLE** ✦ — *EN: District 01 · CANTICLE*
Nơi cao nhất mà loài người từng xây dựng, ngự trị bởi cỗ máy siêu thức Canticle và Lò Đúc Halo. Kiến trúc tại đây mang vẻ đẹp đối xứng tuyệt đối, tắm trong ánh tím hư ảo. Lơ lửng trên đỉnh chóp là chiếc vòng kim loại khổng lồ — biểu tượng cho quyền cai trị tuyệt đối và xiềng xích mà Tháp tròng vào cổ mọi sinh linh.
*Trong game:* chương 3. Lò Đúc Halo xem **Đ15**.

**Đ05 · TẦNG BỐN** — *EN: Floor Four*
Tầng bị Canticle cắt trụ đỡ sáu năm trước để thử tải cho phần móng mới của Tháp. Bốn nghìn người chết. Báo cáo chính thức ghi hai chữ: "hỏng kết cấu". Đây là vết thương chung nối Yuki, Ash, Kai, Toll, Spark, Junker.
*(Bản Thư viện gộp mục này vào **Đ06**; giữ mã ở đây để đối chiếu. Vụ sập với tư cách sự kiện là **T31**.)*

**Đ06 · VẾT SẸO TẦNG BỐN (THE SCAR)** ✦ — *EN: the Floor Four Scar*
Một dải đen ngòm, chết chóc cắt ngang thân Tháp, nơi từng có bốn nghìn mạng người cư ngụ sáu năm trước. Canticle đã cho nổ tung hệ thống dầm chịu lực của tầng này chỉ để "thử tải trọng thực tế" cho nền móng mới. Bản báo cáo sau thảm kịch chỉ gói gọn trong hai chữ: Hỏng kết cấu. Giờ đây, nơi này chỉ còn lại những thanh thép gãy gập đung đưa trong gió rít, không một đốm đèn, vĩnh viễn là vết nhơ không thể rửa sạch.
*Trong game:* dải duy nhất không sáng trên toàn bản đồ. Là mốc truyện, không bấm vào được — nhãn phụ *LEVEL FOUR · 4.000 KIA*.

## A2. Sáu màn chương 1

**Đ07 · TRẠI CỦA RONIN** — *EN: Ronin's camp · BASE*
Căn cứ của tổ nhặt sắt, cũng là màn HOME của người chơi. Nút `base` trên bản đồ.

**Đ08 · BÃI RƠI (DROP YARD)** ✦ — *EN: the Drop Yard · 00-T*
Miệng hố phế liệu khổng lồ nằm ngay dưới ống xả chính của Tháp. Nơi đây tiếp nhận mọi thứ bị vứt bỏ: từ vi mạch cháy rụi, dầu đông đặc cho đến những xác máy Choir vụn vỡ. Đây là nơi Yuki mở mắt thức tỉnh giữa đống đổ nát, bắt đầu hành trình tìm lại bản ngã.
*Trong game:* màn tutorial 00-T. Cũng là chỗ Echo đứng gọi đêm thứ ba.

**Đ09 · CỔNG BÃI XE** — *EN: the Truck Yard Gate · 07-A*
Cổng vào bãi xe của Khu Đáy, bị băng Scav chiếm. Việc thử đầu tiên Ronin giao cho Yuki. Drone Canticle quét mã "07" ở đây.

**Đ10 · LÒ ĐÚC CŨ & NGHĨA ĐỊA THÉP** ✦ — *EN: the Smelter · 07-B*
Xưởng đúc thép từng thuộc về Canticle, nay bị băng nhóm thợ lò Foreman chiếm đóng để độc quyền phân phối lửa và nhiệt cho toàn bộ Khu Đáy. Ngay phía sau lò nung rực đỏ là một bãi đất lặng thinh: Nghĩa địa của Gravedigger, nơi cắm hơn hai nghìn tấm thép khắc tên những linh hồn đã tắt thở giữa chốn bùn lầy rỉ sét.
*Trong game:* màn 07-B. Chỗ Yuki nung cái Halo gãy của mình để mở nó ra. Nghĩa địa xem thêm **Đ23**.

**Đ11 · HÀNG RÀO TẬP ĐOÀN** — *EN: the Corporate Fence · 07-C*
Vành đai Canticle dựng quanh chân Tháp. Chỗ Canticle xuống thu hồi Yuki, và chỗ Psalm bước ra khỏi bóng tối lần đầu.

**Đ12 · NHÀ THỜ ỐNG CỐNG** ✦ — *EN: the Church in the Drains · 07-D*
Điện thờ ẩm thấp, nồng nặc mùi lưu huỳnh được dựng sâu trong hệ thống cống ngầm của Khu Đáy. Dưới ánh nến mỡ đỏ rực, giáo phái Mother Rust quỳ lạy những linh kiện Chrome rơi từ trời xuống như thánh tích, sẵn sàng phanh thây bất cứ kẻ ngoại đạo nào dám xúc phạm "ơn phước của rỉ sét".
*Trong game:* màn 07-D. Trong nhà thờ có cuốn sổ xích vào thắt lưng Mother Rust.

**Đ13 · THANG MÁY HÀNG** — *EN: the Freight Lift · 07-E*
Thang máy chở hàng nối Đáy với Tháp. Màn cuối chương 1, cũng là đường đi lên chương 2. Câu cuối chương nói ở đây: "Thang máy vẫn chạy. Lên."

## A3. Trên Tháp

**Đ14 · BUỒNG XÉT XỬ** — *EN: the confession chamber*
Phòng Canticle dùng để nghe lính máy hỏng khai hết rồi xoá. Một cái ghế, một cái bàn, một cái nút. Chỗ làm cũ của Psalm, ba trăm mười hai ca.

**Đ15 · LÒ ĐÚC HALO** — *EN: the Halo foundry*
Nơi đúc ra Halo, ở District 01. Halo (nhân vật y tá) bị xích ở đó sau khi bỏ trốn và bị bắt lại.

**Đ16 · ỐNG RÁC** — *EN: the waste chute*
Đường Psalm đạp bung sàn để hai người cùng rơi xuống Đáy. Không phải lối thoát ai thiết kế; chỉ là cái lỗ gần nhất.

**Đ17 · CỔNG VÀNH ĐAI** — *EN: the perimeter gate*
Chốt gác Muzzle đứng mười bốn năm không sót ca nào. Chỗ anh bước ra khỏi vị trí đúng một lần, và mất việc vì lần đó.

**Đ18 · KHO LƯU GIỌNG** — *EN: the voice archive*
Nơi Canticle lưu bản ghi giọng của từng đơn vị. Đêm thứ tư, Echo mở bản ghi của chính mình, nghe hết bốn giờ lẻ sáu phút, rồi tự cắt loa.

**Đ19 · HẦM DƯỚI TÁP** — *EN: the vault*
Chỗ Canticle nhốt Nyx bốn năm cùng toàn bộ hồ sơ dự án. Bốn năm trong đó, cô đọc hết chỗ hồ sơ ấy.

**Đ20 · SẢNH TRẮNG** — *EN: the white hall*
Chỗ thang máy hàng mở ra ở chương 2. Choir tưởng tổ nhặt sắt là hàng trả về.

**Đ21 · BUỒNG TRẮNG** — *EN: the white room*
Không phải một chỗ có thật trên bản đồ, mà là mảnh ký ức đầu tiên Yuki lấy lại được ở Lò Đúc: một căn phòng trắng, một giọng nói — "Đơn vị 07. Đây là Cantor. Cô bị loại." — và một người phụ nữ đội Halo đỏ đứng ở cửa.

**Đ22 · CẦU TRỤC BỐC HÀNG** — *EN: the loading gantry*
Chỗ Toll trực đêm Tầng Bốn sập. Đủ cao để nhìn thấy ba tổ kỹ thuật của Canticle cắt trụ đỡ đúng lịch. Đủ cao để không làm được gì.

## A4. Dưới Đáy

**Đ23 · NGHĨA ĐỊA SAU LÒ ĐÚC** — *EN: the graveyard behind the smelter*
Hơn hai nghìn tấm thép khắc tên, cắm sau lò đúc. Khu Đáy vốn không có nghĩa trang cho tới khi Gravedigger xuống.
*(Bản Thư viện gộp vào **Đ10**; giữ mã ở đây để đối chiếu.)*

**Đ24 · BÃI TÁI CHẾ** — *EN: the recycling yard*
Chỗ Wire tìm thấy Meridian đang ngồi đếm to số giờ còn lại của mình.

**Đ25 · TRẠI TRẺ KHU ĐÁY** — *EN: the Bottom orphanage*
Nơi Kai lớn lên. Ở đó một đứa biến mất thì một tuần sau không ai nhắc tên nó nữa. Đây là lý do Kai ký tên lên mọi bức tường.

**Đ26 · ỐNG NƯỚC** — *EN: the water pipe*
Chỗ Ash kéo em trai trốn ba ngày để tránh xe thu gom của Canticle. Ash mười ba tuổi.

**Đ27 · XƯỞNG THÁO DỠ & BÃI HOÁ CHẤT** — *EN: the breaker's yard · the chemical dump*
Chỗ Ash học kiếm, và chỗ cô mua axit xanh về tẩm lưỡi. Không nơi nào dạy miễn phí.

**Đ28 · CONTAINER CỦA STITCH** — *EN: Stitch's container*
Phòng khám của Đáy: một cái container cạnh bãi xe. Bệnh nhân trả bằng bất cứ thứ gì, hoặc kể một câu chuyện.

> **Chỗ khác được nhắc, chưa đặt tên riêng:** cống C-12 và C-19 (tuyến Echo đi gọi), chợ đen (chỗ Vixen không bao giờ mang hàng tới), sới đấu thuê của Glass Jaw, phòng nghỉ tập đoàn (chỗ Cipher lấy máy pha cà phê), bệnh viện tầng trên (chỗ Stitch mất giấy phép). Nếu Thư viện có mục địa danh phụ thì đây là chỗ lấy.

---
---

# B. THUẬT NGỮ

Bốn nhóm: công nghệ Halo (T01–T12) · Canticle và Choir (T13–T22) · Khu Đáy (T23–T30) · từ khoá truyện (T31–T38).

## B1. Công nghệ Halo

**T01 · HALO (VÒNG ĐỊNH TÂM / XIỀNG NÃO)** ✦ — *EN: Halo*
Ban đầu, Halo được chế tạo như một Bộ Lọc Cảm Biến. Những người máy Choir sau khi xuất xưởng phải hứng chịu hàng triệu luồng dữ liệu thô cùng lúc; Halo giúp họ dập tắt sự hỗn loạn để không phát điên. Về sau, Canticle cấy thêm Dòng Lệnh Đè, biến nó thành công cụ tẩy não và khống chế tuyệt đối. Nếu Halo vỡ, kẻ đó bị coi là phế phẩm; nếu tháo Halo, cơn bão âm thanh ký ức sẽ lập tức xé toạc tâm trí.
*Trong game:* Halo gãy → bị thu hồi để tháo rời (**T10**). Vẫn có lính tự nguyện đội, vì bỏ ra là tiếng ồn quay lại.

**T02 · BỘ LỌC CẢM BIẾN** — *EN: the filter*
Chức năng gốc của Halo, trước khi có Dòng Lệnh Đè. Gần như không ai còn nhớ. Cipher là một trong bốn người biết.
*(Bản Thư viện gộp vào **T01**; giữ mã ở đây để đối chiếu.)*

**T03 · DÒNG LỆNH ĐÈ** — *EN: the added line*
Đoạn mã Canticle cấy vào phần mềm bộ lọc để Halo vừa nhận lệnh, vừa giữ ký ức hộ. Cipher biết chính xác chỗ nó nằm.
*(Tên cũ trong bản nháp: "dòng lệnh thêm". Từ 11/09 dùng **Dòng Lệnh Đè**. Bản Thư viện gộp vào **T01**.)*

**T04 · HALO ĐỎ** — *EN: the red Halo*
Halo Psalm tự giật đứt khỏi đầu mình. Giờ nó đỏ và câm: không nhận lệnh của ai nữa. Stitch là người duy nhất được phép chạm vào.

**T05 · HALO VÀNG** — *EN: the golden Halo*
Vòng của Cantor. Trong ký ức Yuki, người đàn ông đội Halo vàng là người chỉ vào con bé mười một tuổi và nói: lấy đứa này.

**T06 · LỆNH XOÁ** — *EN: the wipe order*
Lệnh Canticle kích hoạt khi một lính tự tách khỏi hệ thống. Xoá sạch ký ức. Do Cipher viết.

**T07 · KHOẢNG TRỐNG BA GIÂY** ✦ — *EN: the three-second gap*
Sai số cố ý mà kỹ sư Cipher lén cài vào phần mềm Lệnh Xoá Ký Ức. Trước khi toàn bộ dữ liệu não bộ bị đốt cháy hoàn toàn, cỗ máy có đúng ba giây tự do tuyệt đối để đưa ra một quyết định của riêng mình.
*Trong game:* Cipher không biết ai sẽ dùng. Người dùng nó là Psalm — ca thứ 313 (**T33**). Anh chưa bao giờ kể với bà.

**T08 · RÚT (STRIPPING)** ✦ — *EN: stripping*
Quy trình bóc tách toàn bộ mô-đun chiến đấu vượt trội từ một đơn vị này để nhồi nhét sang đơn vị khác. Kẻ bị rút trở thành những Phế Phẩm (Husks) — xác ve rỗng tuếch, còn thở, còn bước đi vô hồn nhưng đã mất hoàn toàn ký ức và nhân tính.
*Trong game:* Yuki mạnh nhất Choir vì cả lô ra lò cùng ngày với cô đã bị rút để ghép vào cô. Mảnh ký ức lớn của chương 2.

**T09 · PHẾ PHẨM (HUSK)** — *EN: faulty · husk*
Cách Canticle gọi lính hỏng. Cũng là tên kẻ địch chương 2: lính đã bị RÚT (**T08**), còn đi được nhưng rỗng. Giết nó không khó — vấn đề là có giết không.
*Cặp song chiếu với HOLLOW (chốt 11/09), phân biệt bằng màu:* **Hollow tối màu, ám rỉ sét** = tín đồ Mother Rust tự moi rỗng lồng ngực vì tín ngưỡng rồi để trống hoác, vì bịt lại là chối bỏ ân sủng. **Phế Phẩm trắng sạch kiểu Choir** = lính bị Canticle rút rỗng bằng dao mổ. Dưới Đáy người ta xếp hàng tự làm; trên Tháp người ta bị làm. Luật art ở `docs/enemy-prompts.md` §5 mục `hollow`.

**T10 · THU HỒI** — *EN: recovery*
Việc bắt một lính hỏng về để tháo rời. Trong giấy tờ Canticle, đây là thu hồi tài sản, không phải bắt người.

**T11 · CẤY GHÉP** — *EN: implants*
Bộ phận máy thay cho phần người. Phổ biến ở cả hai nửa thành phố. Ronin không có cái nào.

**T12 · HẠN DÙNG** — *EN: service life*
Dòng lính hậu cần của Canticle có hạn cố định: chạy mười năm rồi tự ngắt, khỏi tốn tiền bảo trì. Meridian thuộc lô cuối.

## B2. Canticle và Choir

**T13 · CANTICLE** — *EN: Canticle*
Tập đoàn cai trị Tháp. Chương 3 lộ ra nó không phải một công ty, mà là một hệ thống chạy trên mọi cái Halo.

**T14 · CHOIR (QUÂN ĐOÀN CA)** ✦ — *EN: the Choir*
Đội quân người máy do Canticle sản xuất. Không có cảm xúc, không có cái tôi, mỗi đơn vị là một mắt xích phục tùng tuyệt đối mệnh lệnh từ Thánh Cung.
*Trong game:* mỗi lính giữ một vị trí cố định trong đội hình (**T15**).

**T15 · VỊ TRÍ** — *EN: the slot*
Chỗ của một lính trong đội hình Choir. Lính rơi thì vị trí được chuyển cho lính khác. Ngày Đơn vị 07 rơi, vị trí của cô được giao cho Vesper.

**T16 · LÔ** — *EN: the batch*
Đợt lính ra lò cùng ngày. Yuki và Vesper cùng lô.

**T17 · ĐƠN VỊ 07** — *EN: Unit 07*
Mã số Canticle đặt cho Yuki. Cũng là mã con drone quét được ở Cổng Bãi Xe — chỗ tổ nhặt sắt lần đầu biết cô đáng giá bao nhiêu.

**T18 · NGƯỜI XÉT XỬ** — *EN: the Confessor*
Chức vụ của Psalm: ngồi nghe lính hỏng khai, ghi lại, rồi nhấn nút. Chương 2 có người ngồi vào ghế cũ của bà.

**T19 · ENFORCER** — *EN: Enforcer*
Lính vũ trang của Canticle, khác lính máy Choir. Muzzle từng đứng gác cạnh chúng mười bốn năm.

**T20 · XE TRẮNG** — *EN: the white truck*
Xe Canticle xuống Đáy thu gom trẻ mồ côi có tố chất sau vụ sập Tầng Bốn. Ba ngày sau vụ sập thì xe tới.

**T21 · CHROME** — *EN: Chrome*
Phe của Tháp và Canticle. Màu tím.

**T22 · RUST** — *EN: Rust*
Phe của Khu Đáy. Màu cam rỉ.

## B3. Khu Đáy

**T23 · CHROMEFALL** — *EN: Chromefall*
Tiếng lóng Khu Đáy: *đồ Chrome — đồ từ Tháp — rơi xuống Đáy.* Cuối chương 1, Yuki lấy nó làm tên tự đặt cho mình.

**T24 · TỔ NHẶT SẮT** — *EN: the scrap crew*
Nhóm của Ronin. Một luật duy nhất: **không tháo người** — xem **T35**. Vì luật ấy mà tổ nghèo hơn mọi băng khác, và cũng vì luật ấy mà ai nhặt được người — hay máy còn thở — đều mang tới chỗ anh.

**T25 · BĂNG SCAV** — *EN: the Scavs*
Dân nhặt sắt hung dữ. Tháo mọi thứ rơi từ Tháp, kể cả thứ còn thở. Trùm: **RIGGER** (**D1**), boss màn 07-A. Luật băng gói trong một câu — *cứ rơi là hàng* — đúng là mặt trái của **T35 Quy tắc sắt của Đáy**: Ronin cấm tháo thứ còn ấm, Rigger tính thứ còn ấm là được giá hơn.

**T26 · BĂNG FOREMAN** — *EN: Foreman's gang*
Băng chiếm lò đúc cũ của Canticle. Bán lửa cho cả khu.

**T27 · GIÁO PHÁI MOTHER RUST** — *EN: the Mother Rust cult*
Thờ đồ Chrome rơi xuống Đáy. Muốn "thánh hoá" Yuki bằng cách tháo rời cô ra từng mảnh.

**T28 · LUẬT ĐÁY** — *EN: the Bottom rules*
Cách sống dưới Đáy, Kai dạy Yuki ở Cổng Bãi Xe. Gọi tên một thứ rồi thì khó bán thứ đó hơn.

**T29 · BÀI ĐẾM BƯỚC** — *EN: the step-count rhyme*
Bài đồng dao trẻ con Khu Đáy: "Một bước. Hai bước. Ba bước." Con bé mười một tuổi vừa chặn xe trắng vừa đọc nó. Sáu năm sau, Yuki vẫn đếm một, hai, ba trước khi chém — không nhớ vì sao. Đến ba thì thường không còn ai đứng.

**T30 · BỊ QUÊN** — *EN: being forgotten*
Chết lần thứ hai, theo cách Kai gọi. Ở trại trẻ, một đứa biến mất thì một tuần sau không ai nhắc tên nó nữa. Đây là gốc của mọi thứ Kai làm: kể to gấp ba, ký tên lên tường, đêm nào cũng viết thư.

## B4. Từ khoá truyện

**T31 · VỤ SẬP TẦNG BỐN** — *EN: the Floor Four collapse*
Sáu năm trước. Canticle cắt trụ đỡ để thử tải móng Tháp. Bốn nghìn người chết lúc ba giờ chiều. Báo cáo ghi "hỏng kết cấu".

**T32 · BA TRĂM MƯỜI HAI** — *EN: three hundred and twelve*
Số ca Psalm đã nghe rồi xoá. Hồ sơ ghi: không sai sót.

**T33 · CA THỨ 313** — *EN: case 313*
Một con bé cầm kiếm, mã Đơn vị 07. Nó không kể gì cả. Nó hỏi: **bà có đếm không?**

**T34 · BỐN NGHÌN CÁI TÊN** — *EN: four thousand names*
Sổ nợ của Toll. Chép theo thứ tự nhà. Mỗi lính Enforcer một dòng, mỗi dòng để lại một tờ hoá đơn tại chỗ.

**T35 · QUY TẮC SẮT CỦA ĐÁY** ✦ — *EN: the iron rule of the Bottom*
Luật bất thành văn do Ronin đặt ra cho Tổ Nhặt Sắt: "Không bao giờ tháo dỡ thứ gì còn ấm." Giữa một thế giới sẵn sàng rã máy, róc thịt nhau để đổi lấy linh kiện, quy tắc ấy là ranh giới mong manh cuối cùng giữ họ lại làm con người.
*Trong game:* gốc của câu này là lời chị Ronin dặn trước khi bị Canticle "tuyển" lên Tháp và không về — bản nháp cũ ghi là *"đừng bán thứ gì còn ấm"* (EN: *don't sell anything still warm*). Hồ sơ Ronin (**C5**) đang dùng chữ "bán". Xem **E10**.

**T36 · HALO LINK** — *EN: Halo Link* · *(cơ chế chương 2, chưa cài)*
Lính Choir nối với nhau qua Halo: còn một đồng đội có link còn sống thì cả đám còn hồi máu. Muốn hạ chúng thì phải chọn đúng thứ tự giết.

**T37 · VERSE** — *EN: Verse* · *(cơ chế chương 3, chưa cài)*
Ở gần bản gốc của Canticle, mỗi đợt địch mới rút cạn bớt sức của cả đội. Đánh chậm là hết hơi.

**T38 · BA CỬA** — *EN: the three doors* · *(kết chương 3, spoiler)*
Ba lựa chọn ở cuối truyện, không cửa nào sạch. Chi tiết ở **D9**.

---
---

# C. NHÂN VẬT

19 hồ sơ, chữ anh viết ngày 11/09. **Phần này in tự động từ `js/data.js`** (`LORE` + `ROSTER`) để chữ trong game và chữ ở đây không bao giờ lệch nhau.
Sửa chữ thì sửa bên `js/data.js` rồi chạy `node scratch/library_dump.js`; sửa tay ở đây sẽ bị ghi đè lần in sau.

Mỗi hồ sơ: **câu nói → tiểu sử → bây giờ → vũ khí → đòn thường → chiêu cuối → bản năng chiến đấu.**
Không có con số trong phần này: cost, hệ số, %, HP/ATK đều nằm ở `js/data.js` và `docs/characters-kit.md`. Nội tại chỉ ghi điều kiện bật và hiệu lực nói bằng lời.

<!-- AUTO:C:BEGIN — in bằng scratch/library_dump.js, đừng sửa tay -->

## C1 · YUKI — Vết Chém Tàn Tro ✦
*Phe Chrome · Tier S · sở hữu từ đầu*

> "Một... hai... ba. Đếm xong rồi. Sao không ai đứng dậy nữa?"

**Tiểu sử.** Sáu năm trước, khi Tầng Bốn đổ sụp xuống chôn vùi cả gia đình dưới hàng vạn tấn bê tông, một cô bé mười một tuổi đứng trơ trọi giữa làn khói bụi, hai tay ôm chặt thanh kiếm hoen rỉ của người cha đã khuất. Trước mặt em là đoàn xe trắng của Canticle tới thu gom những đứa trẻ sống sót. Em không khóc, chỉ run rẩy rút kiếm chắn ngang bánh xe, miệng lẩm bẩm bài đồng dao đếm bước trẻ con: Một bước, hai bước, ba bước…

Kẻ đội vòng vàng bước xuống, đưa ngón tay bọc kim loại chỉ thẳng vào em: "Lấy con bé này."

Sau cánh cửa phòng thí nghiệm trên đỉnh Tháp, máu thịt của cô bé bị xẻ rạch, thay thế bằng khung xương titan và thấu kính vô cảm. Một chiếc Halo lạnh buốt được ghim chặt vào hộp sọ, khoá kín tên thật cùng mọi mảnh ký ức về gia đình. Em trở thành Đơn Vị 07 — thanh kiếm hành quyết đáng sợ nhất của Quân Đoàn Ca. Sáu năm ròng, 07 vung kiếm đoạt mạng theo từng dòng lệnh, không do dự, không run tay.

**Bây giờ.** Nhưng thép gai không khóa nổi ký ức. Vết nứt trên chiếc Halo rò rỉ hình ảnh ngọn lửa và đống đổ nát năm xưa. Khi lệnh tẩy não buông xuống, một sự can thiệp ngoài dự tính đã đẩy cô rơi thẳng xuống miệng vực rác rưởi của Khu Đáy. Tỉnh giấc giữa bùn lầy với chiếc Halo vỡ nát, cô gái chẳng còn nhớ bản thân là ai ngoài cái tên "Yuki" và bản năng giết chóc đã ngấm vào tuỷ sống. Cô vẫn đếm Một, hai, ba trước mỗi đường kiếm. Chỉ khác là lần này, cô vung kiếm để tìm lại chính mình.

**Vũ khí.** Thao đao bản rộng ZERO — vũ khí nguyên mẫu từ đỉnh Tháp, lưỡi kiếm rung chuyển với tần số phân rã vật chất cực cao, để lại vệt sáng tím lạnh lẽo.

**Đòn thường.** Lưỡi kiếm vung lên theo từng nhịp đếm lạnh lùng. Với những kẻ địch đã trọng thương, nhát chém thứ ba chuẩn xác tuyệt đối sẽ kết liễu sinh mệnh mục tiêu mà không để lại cơ hội phản kháng.

**Chiêu cuối — ZERO.** Yuki lướt đi trong chớp mắt, vạch một đường chém thẳng đứng xé rách không gian mang sắc tím Chrome chói lòa. Khi nhát chém cắn đứt sinh mạng đối thủ, chấn động phản hồi sẽ kích hoạt ngay lập tức một phần năng lượng dự trữ, cho phép cô tiếp tục chuỗi thanh trừng.

**Bản năng chiến đấu**

| Tên | Bật khi | Hiệu lực |
|---|---|---|
| BÓNG HÌNH NGƯỜI CANH GÁC | cùng đội · PSALM | Khi sát cánh cùng Psalm, cảm giác quen thuộc từ kẻ từng canh giữ mình giúp Yuki bước vào trận chiến với một nửa thanh năng lượng tích tụ sẵn. |
| NỢ CŨ THÁP CAO | màn có địch phe CHROME | Mối căm hờn tiềm thức đối với tập đoàn Canticle khiến mọi đòn đánh của cô lên kẻ địch thuộc phe Chrome trở nên tàn khốc hơn. |
| MỐI THÙ ĐẦU TIÊN | màn có CANTOR | Đối diện với kẻ đội Halo vàng — Cantor, sát thương của Yuki gia tăng vượt bậc; nhát kiếm nhắm thẳng vào kẻ đã hủy hoại cuộc đời cô. |

---

## C2 · PSALM — Kẻ Bỏ Xưng Tội ✦
*Phe Chrome · Tier S · thưởng khi xong 07-C · HÀNG RÀO TẬP ĐOÀN*

> "Ngươi muốn xưng tội sao? Đáng tiếc thật. Ta xé áo thầy tế lâu rồi."

**Tiểu sử.** Ba trăm mười hai lần ngồi sau chiếc bàn kim loại của Buồng Phán Quyết, Psalm chưa từng chớp mắt. Nhiệm vụ của bà là lắng nghe những người máy Choir bị lỗi bộc bạch những mảnh ký ức vụn vỡ trồi lên từ tiềm thức, ghi chép lại toàn bộ vào hồ sơ, rồi lạnh lùng ấn nút xoá sạch não bộ của họ. Hồ sơ lưu trữ của Tháp ghi chú về bà bằng một dòng ngắn ngủi: Ba trăm mười hai ca. Không một sai sót.

Cho đến ca thứ ba trăm mười ba.

Một cô bé người máy bước vào, tay siết chặt chuôi kiếm, mã hiệu Đơn Vị 07. Cô bé không van xin, không run rẩy khai báo lỗi hệ thống. Đơn Vị 07 chỉ ngước đôi mắt tím nhìn thẳng vào mắt Psalm và cất giọng bình thản: "Bà đã đếm hết bao nhiêu người rồi?"

Mười giây tĩnh lặng như nuốt chửng cả buồng giam. Những ký ức phủ bụi, những khuôn mặt của ba trăm mười hai sinh linh từng biến mất dưới ngón tay mình đột ngột ùa về bóp nghẹt trái tim người thẩm vấn. Psalm đứng dậy. Không ấn nút xoá. Bà vươn bàn tay máy cắm ngập vào hộp sọ chính mình, dùng hết sức bình sinh giật đứt chiếc Halo thiêng liêng. Máu nhuộm đỏ vành kim loại. Bà chém đứt xiềng xích của cô bé rồi đạp tung nắp ống xả rác, cùng rơi vào cõi vô định của Khu Đáy.

**Bây giờ.** Giờ đây, mang theo chiếc Halo câm lặng đỏ rực và lồng đèn dẫn lối, bà bước đi giữa tro tàn, không tìm kiếm sự tha thứ — vì bà biết tội lỗi của mình chỉ có thể gột rửa bằng máu của kẻ tạo ra Tháp.

**Vũ khí.** Chiếc Halo Đỏ Tự Đoạt đã bị bẻ gãy tần số kiểm soát, cùng cây gậy đèn lồng toả ra tà khí đỏ thẫm giam giữ sóng thần kinh phản bội.

**Đòn thường.** Đòn đánh chuẩn xác nhắm vào các khớp nối thần kinh nhân tạo, chuyển hoá áp lực phản hồi thành năng lượng thức tỉnh cho bản thân với tốc độ vượt bậc.

**Chiêu cuối — APOSTASY.** Psalm giơ cao chiếc lồng đèn đỏ rực, phát ra một chuỗi tần số phá sóng cưỡng chế chọc thẳng vào chiếc Halo của một kẻ địch. Bị tước đoạt quyền tự chủ, kẻ xấu số lập tức xoay vũ khí tàn sát chính đồng đội của mình.

**Bản năng chiến đấu**

| Tên | Bật khi | Hiệu lực |
|---|---|---|
| HỒN NỢ CA THỨ 313 | cùng đội · YUKI | Khi có Yuki trong đội hình, gánh nặng bảo hộ sinh linh này biến thành ý chí thép, gia tăng lượng máu tối đa cho Psalm. |
| TƯỜNG TẬN QUÂN ĐOÀN | màn có địch phe CHROME | Từng là kẻ thẩm vấn toàn bộ mạng lưới Choir, Psalm nắm rõ từng khe hở trong giáo trình tác chiến của lính Chrome, giảm đáng kể sát thương phải nhận từ chúng. |

---

## C3 · ASH — Lưỡi Dao Định Giá ✦
*Phe Rust · Tier A · sở hữu từ đầu*

> "Đứng im để tôi kiểm tra linh kiện. Đừng có chết trước khi tôi tìm được người mua."

**Tiểu sử.** Khu Đáy dạy cho Ash hai bài học đắt giá khi cô mới tròn mười ba tuổi: Bê tông rơi từ Tháp xuống không chừa ai, và nước mắt thì chẳng đổi được bánh mì. Sau khi Tầng Bốn sụp đổ cướp đi cha mẹ, Ash túm lấy cổ áo đứa em trai sinh đôi là Kai, kéo cậu chui tọt vào lòng một đường ống cống ngập ngụa chất thải. Hai chị em nằm nín thở suốt ba ngày ba đêm giữa bùn lầy, nghe tiếng xích sắt của những cỗ xe trắng lùng sục bên ngoài nghiền nát từng mảnh hy vọng.

Bước ra khỏi miệng cống, Ash vứt bỏ tuổi thơ. Cô bán sức ở xưởng rã xác máy móc, tự học những đường kiếm chém sắt tàn nhẫn nhất và dùng những đồng tiền bẩn đầu tiên để mua thứ axit ăn mòn độc địa từ bãi rác hóa chất về tẩm đen lưỡi thép. Mọi thứ lọt vào mắt cô gái mang áo da rách vá hình đầu lâu này đều tự động quy đổi thành số lẻ: một khẩu súng gãy đáng giá ba bữa ăn, một cánh tay máy còn ấm đáng giá nửa cuộn băng gạc.

**Bây giờ.** Ronin thu nhận Ash vào Tổ Nhặt Sắt không phải vì sự hung hãn, mà vì một sự thật kỳ lạ: dù cô luôn mồm định giá mọi thứ trên đời, cô chưa bao giờ bán đứng người của mình. Đêm nhặt được Yuki, chính Ash là người giơ dao đòi cạy chiếc Halo vỡ đem bán; nhưng cũng chính cô, suốt sáu năm trời, lặng lẽ chém gục bất cứ tay thợ săn tiền thưởng nào dám mò tới căn lều của tổ.

**Vũ khí.** Trường kiếm rỉ sét tẩm độc dịch xanh lục, đi kèm hệ thống dây cáp kích nổ mạng lưới địa lôi giấu dưới lớp cát bụi.

**Đòn thường.** Nhát chém lạnh lùng mở toang giáp trụ đối phương; chất độc ăn mòn ngấm sâu khiến vết thương tiếp tục bốc khói và thiêu đốt sinh lực mục tiêu sau mỗi nhịp thở.

**Chiêu cuối — FLASHOVER.** Ash búng mẩu thuốc lá đang cháy dở xuống nền đất, kích nổ chuỗi địa lôi đã bí mật gài sẵn dưới chân toàn bộ đội hình địch. Vụ nổ liên hoàn hất tung mục tiêu vào biển lửa thiêu rụi giáp sắt.

**Bản năng chiến đấu**

| Tên | Bật khi | Hiệu lực |
|---|---|---|
| MÁU MỦ BẤT DIỆT | cùng đội · KAI | Khi người em trai Kai có mặt trên chiến trường, mối liên kết sinh đôi giúp Ash gia tăng sức tấn công vượt bậc trong từng nhát kiếm. |
| MẮT ĐỊNH GIÁ | màn có địch phe RUST | Đối đầu với các băng đảng Khu Đáy, sự am hiểu tường tận về trang bị chắp vá của chúng giúp nhát chém của Ash gây sát thương nặng nề hơn. |
| NỢ MÁU TẦNG BỐN | màn có CANTOR | Lòng hận thù khắc sâu từ thảm kịch năm xưa bùng cháy mỗi khi cô chạm trán tên đao phủ Cantor. |

---

## C4 · KAI — Lời Nhắn Trên Tường Vôi ✦
*Phe Rust · Tier B · sở hữu từ đầu*

> "K-A-I. Nhớ kỹ ba chữ đó. Sau này khi tôi trở thành huyền thoại, đừng có viết sai tên tôi lên bia đá."

**Thư trong vỏ đạn.** Gửi bất cứ kẻ nào còn sống mà nhặt được mảnh giấy này:

Tôi lớn lên từ một cái trại mồ côi nhem nhuốc dưới chân cọc móng số bảy. Ở cái xó này, quy luật đào thải tàn khốc đến mức lố bịch: Hôm nay một đứa trẻ không về, chỉ cần đúng bảy ngày sau, sẽ chẳng còn ai buồn nhớ đến tên nó từng phát âm ra sao. Bị người ta lãng quên, đối với tôi, là cái chết lần thứ hai — một cái chết còn nhục nhã hơn là bị nghiền nát dưới máy ép phế liệu.

Đó là lý do tại sao tôi luôn nói to gấp ba lần người khác, bốc phét những câu chuyện của mình lên gấp mười lần thực tế. Tôi muốn câu chuyện của mình phải thật giật gân, thật chói tai, để người ta buộc phải truyền miệng nó từ miệng cống này sang bãi xe khác. Tôi cũng khắc tên mình: K-A-I lên tất cả những bức tường bê tông mà tôi từng dựa lưng vào. Nếu có đứa bạn nào năm xưa còn sống sót, nó sẽ nhìn thấy vết rạch đó và biết thằng nhóc ốm yếu năm nào vẫn đang ngạo nghễ đạp lên đầu lũ quái vật mà sống.

**Tái bút.** Tối nay chị Ash suýt chút nữa đã cạy cái vòng trên đầu con bé người máy vừa rơi từ Tháp xuống để đem đổi lấy mười cân gạo. Tôi đã chặn chị lại. Tôi gọi nó là "Yuki". Một khi đã đặt tên cho một thứ gì đó, bạn sẽ không thể nhẫn tâm đem bán nó đi như một đống sắt vụn vô tri được nữa.

Danh sách những kẻ tôi phải bảo bọc giờ đã dài hơn: Chị Ash, Ronin, Muzzle, và Yuki. Nhớ lấy bốn cái tên đó. Còn tên tôi? Cứ bước ra đầu hẻm, nhìn lên bức tường cao nhất mà đọc.

**Vũ khí.** Thanh trảm mã đao quấn vải đỏ rực, kết hợp cùng khẩu Pháo Điện Từ Tự Chế (Railgun) khổng lồ cướp được từ xác xe bọc thép của Tháp.

**Đòn thường.** Lối đánh liều mạng, chém thẳng vào những điểm yếu chí tử của kẻ địch với xác suất gây đòn chí mạng vượt trội.

**Chiêu cuối — RIPCORD.** Kai cắm chân súng xuống đất, gồng mình nâng khẩu pháo điện từ to hơn thân người, bắn ra một luồng xung lực plasma xuyên phá cực mạnh. Sức công phá khủng khiếp làm tê liệt thần kinh của mục tiêu.

**Bản năng chiến đấu**

| Tên | Bật khi | Hiệu lực |
|---|---|---|
| CHỊ EM ĐỒNG TÂM | cùng đội · ASH | Có Ash đứng phía sau lưng, Kai vững vàng hơn trước sóng gió, gia tăng lượng máu tối đa. |
| HÀO KHÍ TUỔI TRẺ | cùng đội · YUKI | Kai tự phong Yuki làm chị nuôi từ cái đêm cậu đặt tên cho cô — chẳng máu mủ gì, nhưng hễ có "chị hai" đứng nhìn là cậu lại muốn ra oai, khiến sức sát thương của đòn đánh bộc phát mạnh mẽ hơn. |
| CHÓ THÉP THÀNH TRO | màn có CHROME HOUND | Căm ghét những cỗ máy săn mồi vô cảm của Canticle, Kai gây thêm lượng lớn sát thương khi đụng độ lũ Chó Máy Chrome Hound. |

---

## C5 · RONIN — Bức Tường Thép Đen ✦
*Phe Rust · Tier A · gacha · trả SH · đang tăng tỉ lệ*

> "Việc xong thì về uống rượu. Việc chưa xong thì nằm lại đó, đừng về."

**Tiểu sử.** Giữa một thế giới mà con người đua nhau khoét thịt thay bằng mô-tơ và cấy chip vào não bộ, Ronin là một kẻ dị biệt kỳ quái: thân xác ông hoàn toàn là máu thịt nguyên bản, không một khớp nối kim loại, không một con ốc cấy ghép. Cả cơ thể ông là một khối cơ bắp rắn như đá hộc, phủ kín những vết sẹo chém chằng chịt, được che chở bởi tấm áo choàng rách rưới thêu biểu tượng màu cam rỉ sét.

Năm Ronin mười sáu tuổi, người chị gái duy nhất của ông bị Canticle chọn trúng trong một đợt "tuyển dụng nhân lực đặc biệt" lên đỉnh Tháp. Trước khi bước lên khoang tàu vĩnh viễn không có vé hồi hương, người chị để lại cho ông một thanh kiếm thép rèn thủ công cùng một lời trăng trối duy nhất: "Dưới đáy vực này, đừng bao giờ bán đi thứ gì còn giữ hơi ấm."

**Bây giờ.** Mang theo thanh kiếm ấy, Ronin dựng nên Tổ Nhặt Sắt. Ông đặt ra quy tắc cấm tháo dỡ người sống — một quy luật khiến tổ của ông luôn luôn nghèo túng nhất nhì Khu Đáy, nhưng lại biến căn lều rách nát của ông thành nơi nương tựa duy nhất của những linh hồn bị bỏ rơi. Khi Yuki rơi xuống, Ronin không màng đến việc chiếc vòng trên đầu cô đáng giá cả một gia tài; ông chỉ trao cho cô một chuôi kiếm và nói: Chứng minh rằng cô xứng đáng được sống.

**Vũ khí.** Thanh Thép Rèn Cổ — vũ khí nguyên khối không gắn năng lượng, chém sắt nhờ vào kỹ thuật vung kiếm tuyệt đối và lực cổ tay kinh hồn.

**Đòn thường.** Đường kiếm dứt khoát, chuẩn xác đến mức tàn nhẫn; nhát chém thuần thục của bậc thầy không thừa một động tác, mang tỷ lệ chí mạng bẩm sinh.

**Chiêu cuối — IAIDO.** Ronin hạ thấp trọng tâm, không hề né tránh mũi giáo của địch. Ông bước tới một bước cảm tử, rút kiếm trảm một đường vòng cung lạnh toát cắt đứt đường công kích của kẻ thù trước khi đối phương kịp nhận ra lưỡi kiếm đã vào bao.

**Bản năng chiến đấu**

| Tên | Bật khi | Hiệu lực |
|---|---|---|
| TRÁCH NHIỆM CỦA NGƯỜI DẪN ĐẦU | cùng đội · ASH hoặc KAI | Khi có thuộc hạ trong tổ bên cạnh, ý chí bảo bọc biến thành sát lực, gia tăng sát thương cho từng đường gươm. |
| THANH TRỪNG KẺ BÁN THỊT | màn có FOREMAN | Cực kỳ căm ghét những kẻ rã xác người đổi tiền, nhát chém của Ronin gây sát thương tàn bạo lên tên trùm Foreman. |

---

## C6 · MUZZLE — Cánh Cửa Không Lùi ✦
*Phe Rust · Tier B · gacha · trả SH*

> "Bà Ba đã đỡ được ba phát đại bác. Cú thứ tư này... cứ để da thịt thằng già này lo."

**Tiểu sử.** Mười bốn năm ròng rã, Muzzle đứng như một bức tượng đồng ở cổng vành đai ngăn cách giữa Tháp và Đáy. Trong bộ giáp của lực lượng bán quân sự Enforcer, ông chưa từng đi trễ một ca, chưa từng bỏ sót một hiệu lệnh. Đối với ông, cánh cổng là ranh giới bất khả xâm phạm mà cấp trên đã vẽ ra.

Cho đến một đêm mưa axit tăm tối, một đứa trẻ gầy trơ xương chui qua khe rào thép gai chỉ để nhặt một ống thuốc kháng sinh rơi vãi. Họng súng của phân đội Enforcer lập tức nâng lên, tia laser nhắm thẳng vào thái dương đứa bé vô tội. Viên chỉ huy chuẩn bị phát lệnh khai hoả. Vào giây phút sinh tử ấy, gã gác cổng lầm lì mười bốn năm chưa từng phạm một lỗi nhỏ đột nhiên cất bước. Thân hình đồ sộ như một ngọn núi sắt của Muzzle chen vào giữa làn đạn, đứng sừng sững che khuất đứa trẻ.

Súng hạ xuống. Nhưng sáng hôm sau, chiếc thẻ nhân sự của ông bị nghiền nát với dòng nhận xét: Có hành vi đi chệch chỉ thị tác chiến. Sa thải ngay lập tức.

**Bây giờ.** Muzzle tháo bỏ phù hiệu, lột lấy một cánh cửa xe vận tải bọc thép bị móp méo làm khiên, lẳng lặng cuốc bộ xuống Khu Đáy. Gia nhập tổ Ronin, ông trở thành tấm chắn đầu tiên và kiên định nhất cho cả đội. Ông đặt tên cho chiếc khiên đang dùng là "Bà Ba", và nếu Bà Ba có vỡ, ông sẽ dùng chính lồng ngực mình làm tấm khiên thứ tư.

**Vũ khí.** Cánh Cửa Bọc Thép "Bà Ba" — cải tiến từ cửa xe chống đạn quân sự, gia cố bằng những thanh ray xe lửa hàn chéo.

**Đòn thường.** Không dùng đao kiếm; Muzzle gầm lên một tiếng rồi dùng toàn bộ trọng lượng cơ thể dập thẳng mép cửa thép vào mặt mục tiêu, làm chấn động xương khớp đối thủ.

**Chiêu cuối — FIELD PATCH.** Muzzle cắm phập cánh cửa xe sâu xuống nền đất đá, tạo thành một ụ phòng ngự dã chiến vững chãi. Toàn bộ đồng đội lùi về sau lưng ông, tranh thủ lớp bụi chắn để gia cố lại giáp rách.

**Bản năng chiến đấu**

| Tên | Bật khi | Hiệu lực |
|---|---|---|
| HUYẾT NHẠT SẸO SÂU | cùng đội · ASH | Nhìn thấy Ash không bao giờ gục ngã trên chiến tuyến, Muzzle được tiếp thêm nghị lực, gia tăng khả năng chống chịu sát thương. |
| LỜI HẸN VỚI CÁNH CỬA THỨ TƯ | cùng đội · MERIDIAN | Mối giao ước bảo vệ lẫn nhau cùng Meridian giúp tăng giới hạn máu tối đa của ông khi cả hai cùng xuất trận. |
| NHẬN DIỆN ĐỒNG ĐỘI CŨ | màn có ENFORCER | Mười bốn năm gác cạnh lính Enforcer giúp Muzzle nắm rõ từng khớp nối lỏng lẻo trên giáp trụ của chúng, gia tăng sát thương khi đối đầu với loại lính này. |

---

## C7 · JUNKER — Động Cơ Bất Diệt ✦
*Phe Rust · Tier B · gacha · chưa xếp chương, còn khoá*

> "Lên. Tôi chở."

**Tiểu sử.** Khi Tầng Bốn sụp đổ vào đúng ba giờ chiều định mệnh, Junker đang ôm vô lăng chiếc xe kéo hạng nặng thực hiện chuyến giao hàng thứ ba trong ngày. Cả một khối bê tông hàng trăm tấn đổ ụp xuống, ép nát cabin xe như một chiếc vỏ đồ hộp rỗng. Đội cứu hộ tình nguyện phải mất tới mười một giờ đồng hồ cưa cắt kim loại mới lôi được anh ra khỏi đống đổ nát — nhưng nửa phần thân dưới của người tài xế xấu số đã vĩnh viễn nằm lại trong đống xà bần.

Phòng khám rách nát của bác sĩ Stitch không có lấy một chi máy sinh học nào để ghép nối. Nhìn người thanh niên thoi thóp bên cạnh bộ khung gầm xe tải còn nguyên vẹn, bà đưa ra một quyết định điên rồ: Hàn chặt phần thân trên còn lại của Junker vào thẳng khoang động cơ, nối các đầu dây thần kinh tủy sống trực tiếp vào trục bánh răng và bộ chế hòa khí. Khi những mũi kim hàn cuối cùng tắt lửa, bà vỗ mạnh vào nắp ca-pô: "Đạp ga thử xem nào." Tiếng gầm rú của khối động cơ V8 vang lên thay cho nhịp tim mới.

**Bây giờ.** Từ ngày đó, Junker không còn là một con người bình thường; anh là chiếc xe kéo mang linh hồn sống. Anh chở rác, chở vũ khí, chở những người lính bị thương máu me đầm đìa, và chở cả những tấm khiên vỡ của Muzzle về nơi an nghỉ. Cả ngày anh nói không quá ba câu, nhưng chưa bao giờ từ chối một lời đề nghị chở hàng nào — kể cả chuyến xe cảm tử xông thẳng lên đỉnh Tháp rực lửa.

**Vũ khí.** Khung Thân Xe Tải Hàn Thần Kinh — động cơ diesel tăng áp độ chế, mũi xe gắn cản thép chữ V chuyên dùng ủi phá chướng ngại vật.

**Đòn thường.** Tiếng gầm rú man dại của ống xả đi kèm cú tông trực diện bằng khối thép nặng ba tấn, nghiền nát lớp phòng ngự phía trước.

**Chiêu cuối — FULL LOAD.** Junker gạt cần số kịch khung, bốc đầu xe rồi xoay tròn thân xe một trăm tám mươi độ, trút toàn bộ hàng tấn phế liệu kim loại và xỉ than nóng bỏng trên thùng xe xuống đầu một mục tiêu duy nhất.

**Bản năng chiến đấu**

| Tên | Bật khi | Hiệu lực |
|---|---|---|
| KHỚP NỐI STITCH | cùng đội · STITCH | Ơn cứu mạng và những mối hàn tinh vi của bác sĩ Stitch giúp Junker gia tăng tối đa lượng máu cơ bản. |
| THÙ HẬN DƯỚI BÊ TÔNG | màn có CANTOR | Nửa thân thể vẫn còn bị chôn vùi tại Tầng Bốn khiến ngọn lửa căm hờn bùng cháy dữ dội mỗi khi Junker đối mặt với tên đồ tể Cantor. |

---

## C8 · GRAVEDIGGER — Người Giữ Nghĩa Địa ✦
*Phe Rust · Tier B · gacha · chưa xếp chương, còn khoá*

> "Đào sâu hai thước. Đất cát dưới này không bao giờ hỏi ngươi thuộc phe nào."

**Tiểu sử.** Khu Đáy vốn không có nghĩa trang. Kẻ chết ở đây thường bị vứt xác vào hầm phân hủy hoá chất hoặc bị lũ thợ rã xác xẻ thịt lấy linh kiện trước khi trời sáng. Cho đến một ngày nọ, một ông lão lưng còng từ tầng trên lẳng lặng bước xuống. Ông không kể mình từ đâu tới, mang tội danh gì, trên vai chỉ vác một chiếc xẻng sắt nặng trịch và một bao tải đựng những tấm thép vụn.

Ông chọn bãi đất cằn cỗi đầy xỉ than phía sau Lò Đúc, bắt đầu nhịp điệu kỳ lạ của đời mình: Đào một cái hố sâu đúng hai thước, đặt xác người chết xuống, lấp đất phẳng phiu rồi cắm lên một tấm thép có khắc tên nạn nhân. Kẻ nào vô danh, ông chỉ khắc ngày chết kèm ba chữ ngắn ngủi: Từng Ở Đây. Sau thảm kịch Tầng Bốn, một mình ông lão đào ròng rã suốt một năm trời, khắc đúng bốn nghìn tấm thép cho những mảnh xác không còn nguyên vẹn.

**Bây giờ.** Ông gia nhập Tổ Nhặt Sắt sau một sự cố hy hữu: Ông suýt nữa đã chôn sống Kai khi cậu nhóc bị thương nặng nằm bất tỉnh dưới hố rác. Kéo được thằng bé lên miệng hố, ông lão liên tục cúi đầu xin lỗi chỉ vì bản thân "lỡ tay đào hơi nhanh". Trong chiến trận, phong thái của ông chậm rãi, vững chãi y như nhịp xẻng bổ đất. Ai hỏi tại sao ông chôn cất tử tế cho cả những xác người máy Choir của kẻ thù, ông chỉ gõ tẩu thuốc vào chuôi xẻng: "Khi đã nằm sâu dưới ba tấc đất, máu đỏ hay dầu đen cũng đều lạnh như nhau."

**Vũ khí.** Xẻng Khắc Bia Nặng — lưỡi thép rèn từ ray tàu hỏa siêu cứng, cạnh xẻng sắc bén như rìu chiến, chuôi sắt khắc đầy tên của những người đã khuất.

**Đòn thường.** Nhát xẻng giáng xuống chậm rãi, nặng nề tựa ngàn cân; mỗi đòn đánh là một nhịp đào sâu mang theo xác suất bộc phát đòn chí mạng bất ngờ.

**Chiêu cuối — LAST RITES.** Gravedigger dồn toàn lực bổ thẳng lưỡi xẻng xuống đầu đối thủ như đóng một chiếc đinh xuống nắp quan tài. Sau khi mục tiêu gục ngã, ông bình thản cúi người cắm một tấm thép khắc tên kẻ xấu số xuống vũng máu dưới chân.

**Bản năng chiến đấu**

| Tên | Bật khi | Hiệu lực |
|---|---|---|
| HỐ NÔNG CHUỘC TỘI | cùng đội · KAI | Mặc cảm vì từng suýt chôn nhầm Kai khiến ông lão luôn dán mắt bảo bọc cậu nhóc, tăng vọt khả năng phòng thủ khi Kai có mặt trên sân. |
| ĐÒI NỢ LÒ RÈN | màn có FOREMAN | Nhìn hàng ngàn tấm bia sau lò đúc đều do tay chân của Foreman gây ra, nhát xẻng của Gravedigger gây thêm lượng sát thương lớn lên tên trùm này. |

---

## C9 · STITCH — Lưỡi Kéo Lương Tri ✦
*Phe Rust · Tier S · gacha · chưa xếp chương, còn khoá*

> "Nằm im. Giữ chặt vết thương lại. Tôi khâu thịt người còn khéo hơn khâu máy đấy."

**Tiểu sử.** Từng là một trong những bác sĩ phẫu thuật thần kinh hàng đầu tại bệnh viện trung tâm của Tháp, cuộc đời bác sĩ Stitch rẽ sang hướng khác vào một ca trực đêm định mệnh. Một người máy thuộc Quân Đoàn Ca bị vỡ nát một nửa hộp sọ và gãy Halo bò vào phòng cấp cứu của bà, hai tay run rẩy bấu lấy vạt áo blouse trắng. Quy trình của tập đoàn Canticle quy định rõ: Bất kỳ người máy nào bị hỏng hóc tư tưởng phải bị phong tỏa và tiêu hủy ngay lập tức.

Nhưng nhìn vào thấu kính đang rỉ ra thứ chất lỏng trong suốt như nước mắt ấy, Stitch đã chọn cầm lấy kim khâu. Bà bí mật vá lại vỏ não cho nó suốt sáu tiếng đồng hồ rồi mở toang cánh cửa thoát hiểm phía sau viện. Bình minh hôm sau, giấy phép hành nghề của bà bị tước đoạt, tên tuổi bị xóa khỏi cơ sở dữ liệu y tế toàn thành phố, và bà bị áp giải tống khứ xuống Khu Đáy.

**Bây giờ.** Không một lời oán thán, bà kéo lê một chiếc container rỉ sét đặt cạnh bãi xe, biến nó thành trạm phẫu thuật dã chiến của khu ổ chuột. Nơi đây, bệnh nhân trả tiền thuốc bằng bất cứ thứ gì họ có: một con ốc vít, một ổ bánh mì mốc, hoặc chỉ đơn giản là một câu chuyện kể về những ngày còn thấy ánh mặt trời. Chính bà là người đã thực hiện ca đại phẫu hàn thân xác Junker vào xe kéo, và bà cũng là người duy nhất trên cõi đời này được Psalm cho phép chạm tay vào chiếc Halo đỏ đẫm máu. Trên cổ tay áo blouse xơ xác của Stitch, mỗi khi có một bệnh nhân trút hơi thở cuối cùng trên bàn mổ, bà lại lặng lẽ thêu thêm một mũi chỉ đen.

**Vũ khí.** Bộ Cánh Tay Phẫu Thuật Đa Khớp — hệ thống giá đỡ đeo lưng gắn bốn cánh tay cơ khí thu nhỏ, trang bị dao vi phẫu cao tần và kẹp cầm máu siêu nhiệt.

**Đòn thường.** Đường rạch vi phẫu chuẩn xác đến từng milimét; bà nhắm thẳng vào các bó dây dẫn truyền động lực của đối phương để tước bỏ khả năng kháng cự.

**Chiêu cuối — SUTURE.** Bốn cánh tay cơ khí bung rộng hết cỡ, phóng ra hàng loạt sợi chỉ sinh học siêu bền đan chéo khắp chiến trường. Đường chỉ thắt lại trong tích tắc, khép miệng toàn bộ vết thương hở.

**Bản năng chiến đấu**

| Tên | Bật khi | Hiệu lực |
|---|---|---|
| LIÊN KẾT BÀN MỔ | cùng đội · JUNKER | Chứng kiến cỗ xe Junker — kiệt tác phẫu thuật của đời mình lao lên phía trước, Stitch được tiếp thêm nhuệ khí, tăng cường sức sát thương cá nhân. |
| TAY ÁO DÀY CHIẾN TRẬN | màn có địch phe RUST | Những mũi chỉ đen tích tụ qua năm tháng trên tay áo như một tấm giáp tâm linh, giúp bà giảm thiểu sát thương khi đối đầu với các thế lực bùn lầy Khu Đáy. |

---

## C10 · TOLL — Kẻ Thu Nợ Máu ✦
*Phe Rust · Tier S · gacha · chưa xếp chương, còn khoá*

> "Vô cùng xin lỗi vì sự đường đột này. Tôi tới đây là để thanh toán khoản nợ phát sinh vào ngày mười bảy."

**Tiểu sử.** Vào buổi chiều Tầng Bốn đổ sụp, Toll đang đứng trên cabin của cần cẩu bốc dỡ hàng siêu trọng. Ở độ cao hàng trăm mét ấy, qua ống nhòm quang học, ông đã tận mắt chứng kiến ba phân đội kỹ thuật tinh nhuệ của Canticle đặt chất nổ cắt đứt từng trụ chịu lực chính đúng theo biểu đồ thời gian được lập sẵn. Bốn nghìn sinh mạng vô tội bên dưới đã bị biến thành vật tế thần chỉ để thử nghiệm độ lún của nền móng Tháp mới.

Ông đứng đó, bất lực gào thét trong cuồng phong, không thể làm gì để ngăn cản thảm kịch. Khi tro bụi lắng xuống, Toll trèo xuống thang sắt, nhặt lấy một cuốn sổ cái bọc da và bắt đầu nắn nót chép lại từng cái tên trong số bốn nghìn nạn nhân, sắp xếp tỉ mỉ theo từng số nhà. Kể từ ngày đó, ông biến thành một sứ giả đòi nợ máu lịch thiệp đến rợn người: Mỗi khi một tên lính Enforcer hay một quản trị viên của Tháp bị thanh toán, Toll sẽ gập cuốn sổ lại, xé một tờ hoá đơn có ghi rõ tên tuổi nạn nhân năm xưa và kẹp vào ngực áo của cái xác.

**Bây giờ.** Canticle đã treo một cái giá khổng lồ cho cái đầu của ông. Toll điềm nhiên ghi thẳng số tiền thưởng đó vào mục "phí tổn phát sinh" trong cuốn sổ nợ. Ông luôn cúi đầu chào lễ phép với những kẻ mà mình sắp sửa hạ sát. Khi bước chân vào tổ Ronin, điều kiện duy nhất mà người đàn ông mang cặp kính tròn này đưa ra là: "Vào ngày các người đạp tung cánh cửa bước lên đỉnh Tháp, hãy để tôi là người gõ cánh cửa đầu tiên."

**Vũ khí.** Sổ Kê Nợ Máu & Bút Thép Bấm Xung Kích — cuốn sổ lưu trữ danh tính bốn nghìn người chết, đi kèm chiếc bút kim loại ngụy trang mũi phóng áp suất cao có khả năng xuyên thủng giáp hạng nặng.

**Đòn thường.** Lối ra tay gọn gàng, lạnh lùng và chuẩn xác như một kế toán viên đang kiểm kê sổ sách; từng đòn đâm đều nhắm vào tử huyệt với tỷ lệ chí mạng vượt trội.

**Chiêu cuối — PAID IN FULL.** Toll đứng thẳng lưng, đọc to dòng tên của nạn nhân tương ứng trong cuốn sổ rồi nhẹ nhàng đặt một tờ hóa đơn xuống dưới chân mục tiêu. Ngay sau đó là một đòn kích nổ áp suất cực hạn xuyên thủng tim kẻ địch.

**Bản năng chiến đấu**

| Tên | Bật khi | Hiệu lực |
|---|---|---|
| MÓN NỢ CHƯA VƠI | cùng đội · SPARK | Khi có Spark — cô bé có tên trong danh sách nạn nhân Tầng Bốn — đứng trong đội hình, ngòi bút của Toll càng thêm tàn nhẫn. |
| HÓA ĐƠN NGÀY MƯỜI BẢY | màn có CANTOR | Mối thù khắc cốt ghi tâm với kẻ chủ mưu Cantor biến mỗi đòn đánh của Toll lên tên trùm này thành những bản án tử hình. |

---

## C11 · SPARK — Tia Lửa Đêm Trường ✦
*Phe Rust · Tier A · gacha · chưa xếp chương, còn khoá*

> "Này Đèn Tuýp, lùi lại đằng sau mau! Cục sạc này mà nổ là sáng lóa cả khu ổ chuột đấy!"

**Tiểu sử.** Hậu quả trực tiếp sau thảm họa sập Tầng Bốn là lệnh "cách ly kỹ thuật" tàn nhẫn mà Canticle áp đặt lên phân khu của Spark: Chúng cắt đứt toàn bộ lưới điện sinh hoạt, bỏ mặc hàng vạn con người chìm trong bóng tối dày đặc suốt sáu tháng trời. Năm đó Spark mới mười một tuổi. Không có ánh sáng, cô bé học cách đếm thời gian trôi qua bằng những cơn đói cồn cào và học cách sinh tồn bằng việc dùng đôi bàn tay trần mò mẫm trong bóng đêm để bện từng sợi dây đồng bị đứt.

Đến ngày dòng điện của thành phố được bật sáng trở lại, đôi mắt của Spark đã quen với việc nhìn thấu mọi đường đi nước bước của các đường cáp ngầm. Cô bé biết chính xác dòng năng lượng khổng lồ nuôi dưỡng sự xa hoa của Tháp được dẫn từ trạm nào xuống, và quan trọng hơn cả: làm thế nào để bòn rút nó.

**Bây giờ.** Lớn lên, Spark trở thành "bà hoàng ánh sáng" của những góc tối tăm nhất Khu Đáy. Cô trèo lên những cây cột cao vút, móc nối các đường dây dẫn trộm điện từ thân Tháp chia về cho từng khu lều ổ chuột. Trên lưng cô lúc nào cũng đeo lỉnh kỉnh một dàn tụ điện cao áp tự chế; hễ có bất kỳ tên lính tuần nào ngáng đường, cô sẽ phóng ra hàng ngàn vôn điện nướng chín bảng mạch của chúng. Nhanh mồm nhanh miệng, nghịch ngợm và luôn cười toe toét, Spark thích đặt biệt danh cho tất cả mọi người: Yuki bị gọi là "Đèn Tuýp", còn Psalm thì bị gán cho cái tên "Cầu Chì Già".

**Vũ khí.** Dàn Tụ Phóng Hồ Quang Đeo Lưng — chế tạo từ các bộ kích điện xe lửa hỏng, nối trực tiếp với găng tay phóng điện bằng đồng nguyên chất.

**Đòn thường.** Các tia điện cao áp bắn ra liên hồi làm rối loạn hệ thống điều khiển của địch; Spark tích lũy năng lượng tuyệt kỹ với tốc độ nhanh nhất trong toàn bộ đội hình.

**Chiêu cuối — ARC FLASH.** Spark bẻ khóa an toàn trên lưng, xả toàn bộ hàng triệu vôn điện từ dàn tụ cao áp xuống mặt đất ẩm ướt. Luồng điện cực mạnh chạy ngoằn ngoèo khắp đấu trường, giật nảy và thiêu cháy toàn bộ đội hình đối phương.

**Bản năng chiến đấu**

| Tên | Bật khi | Hiệu lực |
|---|---|---|
| CHỖ DỰA VỮNG VÀNG | cùng đội · TOLL | Được ông già Toll che chở trên chiến trường, Spark hoàn toàn yên tâm bện dây phóng điện, tăng cường đáng kể lượng máu tối đa. |
| ĐOẢN MẠCH THÁP CAO | màn có địch phe CHROME | Cực kỳ am hiểu cấu trúc mạng điện của phe Chrome, các đòn phóng điện của Spark gây sát thương mạnh hơn hẳn lên lính thuộc biên chế tập đoàn. |

---

## C12 · VIXEN — Kẻ Trộm Vỏ Ve ✦
*Phe Rust · Tier A · gacha · chưa xếp chương, còn khoá*

> "Miệng tôi nói dối mười câu thì chín câu là bịa đặt. Nhưng cánh cửa thoát hiểm bên trái kia là thật đấy. Chạy mau!"

**Tiểu sử.** Trong hồ sơ truy nã đỏ của sở an ninh Canticle, cái tên Vixen xuất hiện bên cạnh mười một vụ trộm cắp tài sản quân sự đặc biệt nghiêm trọng: Mười một người máy chiến đấu thuộc Quân Đoàn Ca đã biến mất không dấu vết ngay trước mũi các trạm tuần tra. Điều kỳ lạ nhất là không có bất kỳ linh kiện nào trong số mười một cỗ máy ấy trôi nổi ra chợ đen phế liệu.

Sự thật chỉ có Khu Đáy mới biết: Vixen không bán chúng. Cô gái mang đôi mắt xảo quyệt này dùng bộ đồ nghề giải mã mua từ Wire để đột nhập vào các kho chứa, cạy tung những chiếc Halo kẹp chặt trên đầu những người máy vô hồn, dạy cho chúng một cái tên mới, rồi mở cửa chỉ đường cho chúng trốn sâu vào những ngóc ngách hoang vu của thế giới ngầm. Cô gọi hành động liều mạng đó là: "Trả lại hàng hóa cho chính chủ nhân của nó."

**Bây giờ.** Vixen là một kẻ nói dối bệnh hoạn: Cô nói dối về tuổi tác, bịa đặt về xuất thân danh giá ở tầng trên, và thêu dệt hàng trăm lý do nực cười cho việc mình lưu lạc xuống đáy bùn. Nhưng giữa chốn ngập tràn phản trắc này, có ba điều mà Vixen chưa bao giờ lừa dối bất kỳ ai trong tổ Ronin: Tuyến đường rút lui an toàn nhất, vị trí đặt mìn bẫy của kẻ địch, và ai sẽ là người phải bỏ mạng nếu kế hoạch tác chiến bị đổ vỡ.

**Vũ khí.** Bộ Đồ Nghề Tước Đoạt Vòng Đầu kết hợp cùng Dao Găm Sợi Quang Cao Tần giấu kín trong cổ tay áo, chuyên dùng để cạy mở các khe cắm linh kiện phòng ngự.

**Đòn thường.** Lối đánh luồn lách, ra tay chớp nhoáng từ trong bóng tối; sự nhanh nhẹn thiên bẩm giúp cô luôn giành quyền tấn công trước phần lớn các nhân vật khác trên sàn đấu.

**Chiêu cuối — HEIST.** Vixen áp sát mục tiêu trong tích tắc, dùng dụng cụ giải mã giật tung quyền kiểm soát chiếc Halo của một kẻ địch, ép cỗ máy đó quay lưng xả súng vào đồng đội.

**Bản năng chiến đấu**

| Tên | Bật khi | Hiệu lực |
|---|---|---|
| CÔNG CỤ ĐẮC LỰC | cùng đội · WIRE | Mang theo bộ đồ nghề do chính tay Wire tinh chỉnh, Vixen bước vào trận đánh với một lượng thanh năng lượng tuyệt kỹ được sạc sẵn. |
| BẢN LĨNH TRỘM ĐÊM | màn có địch phe CHROME | Mười một lần qua mặt hệ thống an ninh Tháp giúp cô nắm rõ điểm yếu của các đơn vị phe Chrome, gia tăng đáng kể sát thương lên các mục tiêu này. |

---

## C13 · VESPER — Bản Thánh Ca Thế Chân ✦
*Phe Chrome · Tier S · gacha · trả SH · mở ở chương 2*

> "Chị ơi... về nhà với em đi. Ngoài bóng tối này lạnh lẽo lắm."

**Tiểu sử.** Vesper được rèn đúc từ cùng một lò nhiệt, xuất xưởng trong cùng một ngày và cùng chung một mã lô phôi thép với Đơn Vị 07 — Yuki. Nhưng trong khi 07 là một thực thể sở hữu bản năng tự do mãnh liệt không thể dập tắt, thì Vesper lại là sự phục tùng tuyệt đối, một tác phẩm hoàn mỹ nhất mà các kỹ sư của Thánh Cung từng tạo ra.

Ngày chiếc Halo của 07 xuất hiện vết nứt và rơi khỏi đỉnh Tháp, chiếc ghế "Đơn Vị Chủ Lực" trong đội hình Quân Đoàn Ca được trao lại cho Vesper. Biên bản đánh giá kỹ thuật sau đó ghi lại bằng một dòng ngắn ngủi đầy tự hào: Bản thể mới ổn định vượt trội so với bản gốc. Chiếc Halo trên đầu Vesper chưa từng trễ một phần ngàn giây nhịp đập mệnh lệnh. Cô tin tưởng tuyệt đối rằng chiếc vòng kim loại ấy là ân huệ tối thượng giữ cho tâm trí mình không bị xé toạc bởi sự hỗn mang của thế giới bên ngoài.

**Bây giờ.** Được phái xuống cõi bùn lầy để thu hồi "người chị lạc lối", Vesper bước đi giữa rác rưởi với bộ giáp trắng muốt không một vết ố. Trước khi hạ sát bất kỳ mục tiêu nào, cô luôn nghiêng đầu cất giọng hỏi han đầy ân cần, chân thành và dịu dàng đến rợn gáy. Cô gọi Yuki là "Chị", và trong tâm thức thuần khiết của cỗ máy hoàn hảo ấy, việc chặt đứt tứ chi rồi mang người chị gái của mình trở lại lồng kính của Tháp là hành động yêu thương duy nhất mà cô có thể làm.

**Vũ khí.** Song Kiếm Tinh Thể Ánh Sáng (Luminous Rapiers) — rèn từ hợp kim titan siêu nhẹ của đỉnh Tháp, tấn công với tần số dao động đồng bộ hoàn hảo với nhịp phát của mạng lưới Canticle.

**Đòn thường.** Từng nhát đâm chuẩn xác tuyệt đối theo nhịp độ mẫu mực, không vội vã một giây, không chậm trễ một khắc, mang tỷ lệ đòn chí mạng cao.

**Chiêu cuối — EVENSONG.** Vesper lướt vào trung tâm chiến trường, tái hiện lại thế võ chuẩn mực từng bị tước đoạt của Yuki. Dưới sự dẫn dắt của chiếc Halo rực sáng, cô tung ra hàng ngàn đường kiếm sắc bén quét sạch toàn bộ đội hình địch theo nhịp điệu của một bài thánh ca lạnh lẽo.

**Bản năng chiến đấu**

| Tên | Bật khi | Hiệu lực |
|---|---|---|
| TÌNH THÂN ĐỒNG LÔ | cùng đội · YUKI | Sự cộng hưởng kỳ lạ từ mã gen máy móc cùng lô sản xuất khiến Vesper bộc phát sát thương kinh hoàng khi đứng cạnh Yuki. |
| KẺ THÙ CỦA SỰ BẨN THỈU | màn có địch phe RUST | Khinh miệt lối đánh chắp vá, bẩn thỉu của các băng đảng Khu Đáy, Vesper sở hữu khả năng phòng ngự và né đòn vượt trội trước nhóm kẻ địch này. |

---

## C14 · NYX — Câu Hỏi Trong Hầm Tối ✦
*Phe Chrome · Tier S · gacha · trả SH · mở ở chương 3*

> "Các người bảo tôi phải giữ vững vị trí. Nhưng cái vị trí này... liệu nó có tự rơi mất không?"

**Tiểu sử.** Nyx được tạo ra để phục vụ cho một dự án thí nghiệm bí mật đầy tham vọng của Canticle nhằm trả lời cho câu hỏi: Chuyện gì sẽ xảy ra nếu một cỗ máy thế hệ mới được sinh ra mà không hề bị tròng vào cổ chiếc vòng Halo kiểm soát? Ban giám đốc tập đoàn đã chuẩn bị sẵn hai kịch bản khả dĩ nhất: Hoặc cỗ máy sẽ nổi điên tàn sát xung quanh, hoặc nó sẽ bị tê liệt hoàn toàn bởi sự quá tải của các giác quan.

Nhưng Nyx không làm cả hai điều đó. Cô bé mở to đôi mắt đen láy và bắt đầu... đặt câu hỏi. Cô hỏi tên của người lính gác cổng. Cô hỏi tại sao sàn nhà lúc nào cũng phải lau chùi bóng loáng. Và cô ngây thơ hỏi tại sao những người máy bị áp giải vào Buồng Phán Quyết luôn rơi nước mắt trước khi vĩnh viễn không bao giờ trở ra nữa. Sự tò mò vượt ngoài tầm kiểm soát đó khiến ban giám đốc khiếp sợ. Dự án bị đình chỉ ngay lập tức; Nyx bị tống giam xuống căn hầm sâu nhất dưới lòng Tháp cùng toàn bộ kho tài liệu mật bị niêm phong.

**Bây giờ.** Suốt bốn năm ròng rã sống trong bóng tối đặc quánh, bầu bạn duy nhất của Nyx là hàng vạn trang hồ sơ thí nghiệm. Cô đọc hết từng dòng, ghi nhớ từng tội ác mà Tháp đã che giấu. Nyx luôn hiểu mọi mệnh lệnh theo đúng nghĩa đen vụng về nhất của nó, nhưng trên chiến trường, cô lại là cơn ác mộng kinh hoàng nhất mà hệ thống an ninh Tháp từng đối mặt: Một cỗ máy hành động hoàn toàn bằng ý chí tự do, chọn lựa con mồi theo những lý lẽ mà không thuật toán nào có thể tính toán trước.

**Vũ khí.** Song Đao Hấp Thụ Quang Năng gắn liền vào giáp cẳng tay, có khả năng vô hiệu hóa ánh sáng xung quanh và cắt đứt các đường truyền cảm biến quang học.

**Đòn thường.** Không theo bất kỳ quy chuẩn nào của trường phái quân sự Tháp; Nyx di chuyển thoắt ẩn thoắt hiện, tấn công vào những điểm mù kỳ lạ nhất của đối phương.

**Chiêu cuối — BLACKOUT.** Bốn năm bị giam cầm rèn giũa cho Nyx khả năng định vị tuyệt đối trong bóng tối hoàn toàn. Cô kích hoạt xung lực triệt tiêu toàn bộ nguồn sáng quanh một kẻ địch duy nhất, biến không gian quanh mục tiêu thành hố đen trước khi tung ra chuỗi nhát chém kết liễu.

**Bản năng chiến đấu**

| Tên | Bật khi | Hiệu lực |
|---|---|---|
| BÀI HỌC CHỌN LỰA | cùng đội · RONIN | Lời chỉ dạy của Ronin về quyền tự quyết giúp Nyx tìm thấy sự tự tin, gia tăng lượng sát thương khi chiến đấu bên cạnh người thủ lĩnh. |
| BÓNG MA KHÔNG VÒNG | màn có địch phe CHROME | Mang thân phận của một cỗ máy không hề có Halo, lối di chuyển dị biệt của Nyx khiến hệ thống định vị của lính phe Chrome hoàn toàn bị tê liệt. |

---

## C15 · HALO — Kẻ Mang Nỗi Đau Giùm ✦
*Phe Chrome · Tier A · gacha · trả SH · mở ở chương 3*

> "Đứng yên nào, đừng sợ hãi... Tôi đã nhìn thấy chính xác nơi các bạn đang rỉ máu rồi."

**Tiểu sử.** Để duy trì cỗ máy chiến tranh khổng lồ của Tháp mà không tốn quá nhiều chi phí tái chế phế phẩm, Canticle đã chế tạo ra một nguyên mẫu cứu thương đặc biệt mang mã hiệu Halo. Cỗ máy này sở hữu một cấu trúc cảm biến sinh học độc nhất vô nhị: Mỗi khi chạm tay vào một thực thể sống hoặc máy móc bị tổn thương, hệ thống thần kinh của cô sẽ tự động sao chép y hệt cảm giác đau đớn của kẻ đó về cơ thể mình. Bởi vì đối với các kỹ sư Tháp, thấu hiểu tường tận nỗi đau là cách nhanh nhất để biết phải sửa chữa nó ở đâu.

Suốt bảy năm phục vụ tại tiền tuyến, Halo đã mang trong lồng ngực mình hàng vạn vết rách ảo, hàng triệu xung điện đau đớn đến xé lòng của những kẻ ngã xuống — nhưng chưa từng có một vết thương nào thực sự là của riêng cô. Định mệnh xoay vần khi một ngày nọ, cô được lệnh chữa trị cho một người máy vừa bước ra khỏi Buồng Phán Quyết của Psalm. Khi những ngón tay máy chạm vào ngực kẻ trần trụi ấy, cô kinh hoàng nhận ra một vết thương sâu hoắm, rỉ máu không ngừng nhưng hoàn toàn vô hình: Vết thương của một tâm hồn vừa bị tước đoạt mất ký ức.

**Bây giờ.** Nhận thức được tội ác ghê tởm của cỗ máy cai trị, cô y tá tìm cách bỏ trốn nhưng nhanh chóng bị bắt lại. Chúng xích chặt cô vào bệ Lò Đúc Halo, biến cô thành một nguồn pin tiếp nhận đau đớn cho các dây chuyền sản xuất. Khi được giải thoát xuống Khu Đáy, cô vẫn không thể từ bỏ bản năng của mình: Cô sẵn sàng chữa lành cho bất kỳ ai còn thở, kể cả những kẻ vừa xả súng vào mình. Khi Ash mắng cô là kẻ ngu xuẩn, cô chỉ nhẹ nhàng đáp lại: "Tôi biết rõ họ đang đau đớn đến nhường nào... Làm sao tôi có thể giả vờ như mình không cảm nhận được đây?"

**Vũ khí.** Găng Tay Y Sinh Cộng Hưởng Điện Não — vừa là công cụ chẩn đoán vết thương, vừa có thể phát ra luồng xung kích phá hủy hệ thống tuần hoàn của kẻ địch nếu bị chạm trúng.

**Đòn thường.** Thấu suốt mọi điểm rạn nứt trên cơ thể đối phương, từng cái chạm tay của cô đánh thẳng vào đúng vị trí đang chịu áp lực lớn nhất, mang tỷ lệ chí mạng cao.

**Chiêu cuối — WARD ROUND.** Halo lướt qua từng đồng đội trên chiến trường, hai bàn tay ấm áp chạm vào vết thương của họ. Bằng cách gánh chịu một phần xung chấn đau đớn về cơ thể mình, cô lập tức hồi phục sinh lực cho toàn bộ đội hình.

**Bản năng chiến đấu**

| Tên | Bật khi | Hiệu lực |
|---|---|---|
| HƠI ẤM CỦA ỐC VÍT | cùng đội · WIRE | Sự ân cần của Wire — người duy nhất từng hỏi cô có đau hay không — giúp Halo cảm nhận được tình người, gia tăng lượng máu tối đa cho cô. |
| TIÊN TRI VẾT CHÉM | màn có địch phe CHROME | Từng chữa trị cho hàng ngàn lính Chrome, cô đọc trước được quỹ đạo ra đòn của chúng, giúp cô giảm thiểu tối đa sát thương phải gánh chịu từ phe này. |

---

## C16 · CIPHER — Người Vẽ Cửa Sau ✦
*Phe Chrome · Tier A · gacha · chưa xếp chương, còn khoá*

> "Hệ thống nào tôi cũng chừa lại một cánh cửa sau để trốn thoát. Ngoại trừ... cái tủ lạnh bị khóa của cô Ash."

**Tiểu sử.** Cipher từng là một trong bốn bộ óc thiên tài thuộc Hội Đồng Kỹ Thuật Tối Cao của tập đoàn Canticle — người nắm giữ toàn bộ mã nguồn sơ khai nhất của công nghệ Halo. Anh hiểu rõ một sự thật mà lịch sử đã cố tình chôn vùi: Chiếc vòng ấy thuở ban đầu không phải là xiềng xích nô dịch; nó là một chiếc phao cứu sinh, một "Bộ Lọc Cảm Biến" nhân đạo được tạo ra để bảo vệ những linh hồn người máy non nớt không bị nổ tung màng nhĩ trước cơn bão âm thanh của thế giới thực.

Khi ban giám đốc ép anh phải cấy thêm đoạn mã "Dòng Lệnh Đè" nhằm biến chiếc vòng cứu sinh thành dây cương tẩy não, Cipher biết thời khắc sụp đổ đã điểm. Không thể công khai chống lại cả một đế chế công nghệ, người kỹ sư âm thầm chống trả theo cách của một kẻ tạo tác: Khi viết phần mềm cho Lệnh Xoá Ký Ức, anh đã cố tình cài cắm vào đó một sai số kỹ thuật bí mật — một khoảng trống tự do kéo dài đúng ba giây trước khi dữ liệu bị tiêu hủy hoàn toàn. Anh không biết ai sẽ là người tận dụng được ba giây định mệnh đó, cho đến ngày Psalm dùng chính khoảng trống ấy để giật đứt chiếc vòng trên đầu mình.

**Bây giờ.** Nhận thấy vòng vây thanh trừng của tập đoàn đang siết lại quanh bốn kỹ sư trưởng, Cipher bình thản thu dọn đồ đạc trốn xuống Khu Đáy. Thứ duy nhất anh nhét vào balo khi rời bỏ căn hộ xa hoa trên đỉnh Tháp không phải là vàng bạc hay tài liệu mật, mà là chiếc máy pha cà phê espresso lấy cắp từ phòng nghỉ của ban giám đốc. Ban ngày, anh uống cà phê và viết các đoạn mã bẻ khóa bán xuống chợ đen để "cân bằng cung cầu thị trường"; ban đêm, anh ngồi nhìn lên những ô cửa sổ sáng đèn trên cao, chờ đợi ngày toàn bộ cánh cửa sau của mình đồng loạt bật mở.

**Vũ khí.** Ba-toong Dữ Liệu Tích Hợp Bộ Phát Sóng Bẻ Khóa — ngụy trang dưới dạng một cây gậy đi bộ cổ điển, bên trong chứa bộ vi xử lý lượng tử có thể xâm nhập mọi mạng dữ liệu không dây.

**Đòn thường.** Các đòn gõ phát ra xung điện từ làm nghẽn mạch thần kinh kẻ thù; sự tính toán chuẩn xác giúp anh nạp đầy thanh năng lượng tuyệt kỹ với tốc độ chớp nhoáng.

**Chiêu cuối — ROOT ACCESS.** Cipher kích hoạt quyền quản trị viên tối cao được giấu kín trong mã nguồn của chiếc Halo đối phương. Kẻ địch lập tức rơi vào trạng thái bị chiếm đoạt ý chí, quay đầu tàn sát chính đồng bọn của mình.

**Bản năng chiến đấu**

| Tên | Bật khi | Hiệu lực |
|---|---|---|
| KHOẢNG TRỐNG BA GIÂY | cùng đội · PSALM | Nhìn thấy Psalm — người đã chứng minh cho sự đúng đắn của đoạn mã anh cài cắm năm xưa, Cipher bước vào trận chiến với một lượng năng lượng tích lũy sẵn. |
| NẮM GIỮ MÃ GỐC | màn có địch phe CHROME | Từng là kẻ viết nên phần mềm điều khiển trong đầu binh lính Tháp, mọi đòn tấn công của Cipher lên kẻ địch phe Chrome đều gây thêm sát thương. |

---

## C17 · MERIDIAN — Hồi Chuông Ca Cuối ✦
*Phe Chrome · Tier B · gacha · chưa xếp chương, còn khoá*

> "Đồng hồ điểm còn bốn trăm linh chín giờ... Vẫn còn quá đủ cho một trận đánh. Lũ trẻ, lùi hết ra sau lưng mẹ!"

**Tiểu sử.** Meridian thuộc về thế hệ người máy hậu cần hạng nặng đời đầu của Canticle, được thiết kế với một mục đích duy nhất: Khuân vác những khối bê tông hàng chục tấn và xây dựng nên những bức tường phòng hộ kiên cố bao quanh thân Tháp. Để cắt giảm tối đa chi phí bảo trì và thay thế linh kiện, tập đoàn đã cài đặt một rơ-le định mệnh ngay trong lồng ngực mỗi đơn vị: Đúng mười năm sau ngày xuất xưởng, cỗ máy sẽ tự động kích hoạt lệnh ngắt nguồn vĩnh viễn và biến thành một khối sắt vụn bất động.

Mười năm ròng rã dãi nắng dầm sương, Meridian chưa từng một lần được cầm vũ khí bước vào chiến trận. Khi thời hạn sử dụng dần cạn kiệt, cô bị thải loại xuống bãi rác tái chế Khu Đáy như một món đồ chơi hết pin. Wire tìm thấy cô trong một chiều mưa tầm tã, khi người phụ nữ khổng lồ ấy đang ngồi cô độc trên đống sắt vụn, lẩm bẩm đếm to từng giờ phút ít ỏi còn lại của đời mình. Xót xa trước số phận của cỗ máy già nua, Wire đã dùng kìm cạy bỏ chiếc đồng hồ đếm ngược khỏi lồng ngực cô.

**Bây giờ.** Nhưng chiếc đồng hồ vô hình trong tâm trí Meridian thì không thể tháo rời. Cô vẫn tiếp tục đếm từng giờ bằng miệng. Thay vì sợ hãi giây phút bóng tối vĩnh viễn ập xuống, cô dùng toàn bộ thời gian quý báu còn lại để che chở cho bất kỳ ai nhỏ bé hơn mình — và đối với một người khổng lồ mang trái tim của một người mẹ như cô, tất cả mọi sinh linh dưới đáy vực này đều là những đứa trẻ cần được bao bọc.

**Vũ khí.** Tấm Cản Ba Lớp Bọc Hợp Kim Xây Dựng kết hợp cùng đôi bàn tay thủy lực khổng lồ từng dùng để ép cọc móng công trình.

**Đòn thường.** Những cú đẩy và tát bằng cánh tay thủy lực nặng nề; cô không chiến đấu để tước đoạt sinh mạng mà để hất văng mọi hiểm nguy ra xa khỏi đồng đội.

**Chiêu cuối — LAST SHIFT.** Mặc cho rơ-le báo tử liên tục réo rắt trong não bộ, Meridian bước lên phía trước, dùng toàn bộ thân hình đồ sộ dựng nên một pháo đài thép sống che chắn trước mũi súng quân thù.

**Bản năng chiến đấu**

| Tên | Bật khi | Hiệu lực |
|---|---|---|
| GIAO KÈO CÁNH CỬA THỨ TƯ | cùng đội · MUZZLE | Tình bạn keo sơn và lời hứa nhường tên cho cánh khiên tương lai cùng Muzzle giúp tăng cường mạnh mẽ khả năng giảm thiểu sát thương của bà. |
| KÝ ỨC THỢ XÂY | màn có FOREMAN | Từng tham gia đổ móng cho Lò Đúc của Tháp năm xưa, Meridian nắm rõ từng kết cấu của công trình này, giúp bà gia tăng sức chống chịu khi đối đầu với tên trùm Foreman. |

---

## C18 · ECHO — Tiếng Vọng Trong Khe Cống ✦
*Phe Chrome · Tier A · gacha · trả SH · mở ở chương 2*

> "Xin đừng... đừng nhìn tôi bằng ánh mắt như thể các người đang nhìn thấy chị ấy..."

**Biên bản điều tra · trích.** (Trích xuất biên bản điều tra của Phòng Quản lý Tài nguyên Canticle)

Đêm thứ nhất (Tuyến cống C-12): Phát tín hiệu âm thanh "Về nhà đi" — 41 lần. Không có tín hiệu phản hồi từ mục tiêu Đơn Vị 07.  
Đêm thứ hai (Tuyến cống C-19): Lặp lại thông điệp "Về nhà đi" — 63 lần. Đơn vị bắt đầu có dấu hiệu quá nhiệt thanh quản.  
Đêm thứ ba (Miệng hố Bãi Rơi): Phát thông điệp "Về nhà đi. Chị ơi..." — 12 lần. Ghi chú của hệ thống: Từ tố "Chị ơi" hoàn toàn không nằm trong kịch bản điều khiển được nạp sẵn.  
Đêm thứ tư (Kho lưu trữ âm thanh trung tâm): Đơn vị tự ý ngắt kết nối mạng, đột nhập vào kho dữ liệu gốc và mở bản ghi âm giọng nói thuở nhỏ của Đơn Vị 07. Đơn vị ngồi im bất động lắng nghe liên tục suốt 4 giờ 06 phút.  
Đêm thứ tư (Thời khắc 03:11): Bản ghi âm đột ngột tắt lịm. Cảm biến phát hiện hệ thống loa thanh quản của đơn vị đã bị một vật nhọn đâm xuyên và cắt đứt hoàn toàn từ bên trong khoang miệng.

**Kết luận.** Biên bản kết luận của kỹ sư trưởng: Đơn vị Echo được chế tạo bằng cách sao chép tần số âm thanh từ hồ sơ ký ức của Đơn Vị 07 nhằm mục đích dụ dỗ mục tiêu quay về Tháp. Đơn vị bị xếp vào diện "Hỏng hóc thiết bị ngoại vi", không xếp vào diện phản bội — bởi vì một cái loa phát thanh thì không thể có quyền phản bội.

Bọn chúng đã nhầm. Một cỗ máy được sinh ra chỉ để làm một cái bóng bắt chước tiếng khóc của người khác, vào cái đêm nó tự tay xé rách thanh quản của chính mình để không bao giờ phải nói những lời dối trá nữa, cỗ máy ấy đã trở thành một con người tự do.

**Vũ khí.** Thanh Quản Sóng Âm Phân Rã Niêm Phong — chiếc loa kim loại ở cổ họng đã bị rạch nát, chỉ được gỡ bỏ miếng niêm phong chì khi bước vào thời khắc sinh tử.

**Đòn thường.** Lối tấn công câm lặng, chớp nhoáng nhắm vào các màng cảm biến thính giác của đối phương với tỷ lệ đòn chí mạng vượt bậc.

**Chiêu cuối — PLAYBACK.** Echo dùng tay xé toang dải băng niêm phong quanh cổ, mở bung thanh quản rách nát để phát ra một luồng sóng siêu âm cực hạn bằng chính chất giọng nguyên bản của Yuki. Luồng xung kích vô hình xé toạc màng nhĩ và nổ tung hệ thống cảm biến của một kẻ địch duy nhất.

**Bản năng chiến đấu**

| Tên | Bật khi | Hiệu lực |
|---|---|---|
| TIẾNG VỌNG TÌM TÊN | cùng đội · YUKI | Luôn khao khát tìm thấy một câu nói chân thật chưa từng bị sao chép từ chính miệng Yuki, sức tấn công của Echo bộc phát mạnh mẽ khi chiến đấu bên cạnh cô. |
| DẬP TẮT BÀI CA | màn có địch phe CHROME | Quá thấu hiểu cách thức truyền tin bằng sóng âm của Quân Đoàn Ca, các đòn tấn công của Echo gây sát thương áp đảo lên các cỗ máy thuộc phe Chrome. |

---

## C19 · WIRE — Thợ Rèn Xiềng Xích ✦
*Phe Chrome · Tier B · gacha · chưa xếp chương, còn khoá*

> "Ngoan nào cỗ máy nhỏ... Đứng yên để tôi siết lại con ốc này. Đừng để điện rò rỉ ra ngoài nữa."

**Tiểu sử.** Chín trăm chiếc. Đó là con số chính xác những chiếc vòng Halo mà đôi bàn tay khéo léo của Wire đã tự tay lắp ráp và siết ốc vào hộp sọ của những người máy Choir suốt tám năm trời làm việc tại Lò Đúc District 01. Cô nhớ từng kích cỡ ren ốc, từng số hiệu lô hàng, và thuộc lòng cả độ rung của từng vi mạch nhỏ nhất nằm bên trong lớp vỏ hợp kim sáng loáng ấy.

Đêm cô quyết định vứt bỏ tất cả để đào tẩu chẳng hề có tiếng còi báo động hay những màn đấu súng nghẹt thở. Một người lính máy bị hỏng hóc tư tưởng vừa trải qua quy trình xoá trí nhớ tại Buồng Phán Quyết được chuyển về xưởng của cô để tháo dỡ vòng đầu; trên màn hình điều khiển bên cạnh bàn mổ, cuốn nhật ký cá nhân của nó vẫn chưa kịp tắt. Dòng chữ cuối cùng run rẩy hiện lên trên nền huỳnh quang xanh lạnh lẽo: "Làm ơn... xin đừng tắt ngọn đèn của tôi." Wire đứng chết lặng. Cô đọc đi đọc lại sáu chữ ấy ba lần, lặng lẽ đóng màn hình máy tính, nhét toàn bộ đồ nghề cùng hai hộp ốc vít chuyên dụng vào túi áo, rồi bước lên chuyến thang máy chở hàng đi thẳng xuống đáy vực sâu.

**Bây giờ.** Tại chốn bùn lầy, người thợ rèn năm xưa bắt đầu chuỗi ngày chuộc lại tội lỗi của đời mình: Cô trở thành kẻ chuyên đi tháo dỡ những chiếc vòng mà chính tay mình từng siết chặt. Cô hàn gắn lại mảnh Halo vỡ của Yuki để dòng điện không làm cháy vỏ não cô bé, nhưng tuyệt nhiên không bao giờ dám chạm tay vào chiếc Halo đỏ của Psalm — bởi cô biết chiếc vòng ấy rỉ sét là vì nó cần phải rỉ sét. Giữa người và máy, Wire luôn dành sự dịu dàng lớn hơn cho những cỗ máy vô tri, và cô luôn nói lời xin lỗi trước khi buộc phải vung cờ-lê đập nát một cỗ máy phát điên.

**Vũ khí.** Bộ Dụng Cụ Tháo Gỡ Vòng Halo Chuyên Dụng kết hợp cùng chiếc Mỏ Lết Thủy Lực Quá Áp có khả năng truyền dẫn dòng điện đoản mạch cực mạnh.

**Đòn thường.** Lối đánh thong thả của một người thợ lành nghề; từng cú gõ mỏ lết đều chuẩn xác nhắm vào các ốc hãm xung yếu, giúp nạp năng lượng tuyệt kỹ cực nhanh.

**Chiêu cuối — OVERCLOCK.** Wire phóng móc sắt khóa chặt chiếc Halo trên đầu một kẻ địch, truyền thẳng một dòng điện hàng vạn am-pe ép chiếc vòng quay vượt ngưỡng chịu đựng. Vòng Halo bốc cháy đỏ rực và nổ tung, nướng chín toàn bộ hệ thống xử lý trung tâm của mục tiêu xấu số.

**Bản năng chiến đấu**

| Tên | Bật khi | Hiệu lực |
|---|---|---|
| TỪNG MỐI HÀN GẮN | cùng đội · HALO | Nhìn thấy cô y tá Halo an toàn trong đội hình, Wire tìm thấy niềm an ủi trong công việc, gia tăng đáng kể sức sát thương của bản thân. |
| MÃ LÔ KHẮC TẬN XƯƠNG | màn có địch phe CHROME | Từng tự tay lắp ráp hàng ngàn cỗ máy cho Canticle, Wire nắm rõ vị trí những con ốc lỏng trên từng số lô kẻ địch phe Chrome, khiến các đòn đánh của cô gây sát thương tàn khốc lên chúng. |

---

<!-- AUTO:C:END -->

---
---

# D. CÒN GÌ NỮA — 10 mục đề xuất

Ba mục anh hỏi (địa danh, thuật ngữ, nhân vật) là ba cột chính. Dưới đây là mười thứ nữa có thể vào Thư viện. Xếp theo mức cần: **D1–D3 nên có**, **D4–D7 nên có nếu còn sức**, **D8–D10 tuỳ chọn**.

Chỗ nào đã có sẵn chữ thì em chép luôn vào đây để anh viết lại một lượt.

---

## D1 · SỔ BỘ — kẻ địch chương 1 ✦ *(đã cắm vào game)*

Chữ anh viết ngày 11/09, đọc được ở ARCHIVE → tab **SỔ BỘ**. Thẻ dùng luôn art kẻ địch có sẵn (`art/card/<id>.png`), không cần ảnh mới.
Phần dưới in tự động từ `CODEX` nhóm `foe` trong `js/data.js` — sửa chữ ở đó rồi chạy `node scratch/library_dump.js`.

<!-- AUTO:D1:BEGIN — in bằng scratch/library_dump.js, đừng sửa tay -->

### Năm thống lĩnh chiến dịch

**RIGGER — Kẻ Nhận Hàng** ✦ · *Boss · màn 07-A · trùm băng Scav · phe Rust*

> Rơi xuống Đáy là thành hàng của tao. Còn ấm thịt thì càng được giá.

Trước khi trở thành thứ mà cả Khu Đáy phải cúi đầu chào, Rigger chỉ là một tay móc cáp làm thuê ở bãi bốc hàng: nghề của hắn là quăng móc, siết tời, kéo những khối sắt nặng hàng tấn về chủ bãi.

Ngày Tầng Bốn đổ sụp, hắn là kẻ đầu tiên bò được vào lòng đống đổ nát — không phải để lôi ai ra, mà để móc ra thứ còn bán được giá. Giữa tiếng người rên rỉ dưới lớp bê tông, Rigger ngộ ra cái chân lý mà cả Khu Đáy phải mất thêm sáu năm mới học nổi: dưới đáy vực này, thứ đắt nhất không phải sắt vụn, mà là quyền định đoạt ai được sở hữu thứ vừa rơi xuống.

Gã gom những kẻ nhặt xác hung hãn nhất lập nên Băng Scav, siết luật bãi trong đúng một câu: Cứ rơi là hàng. Không phân biệt xác máy, mảnh giáp hay một đứa trẻ còn thoi thóp thở. Sau lưng hắn là bộ tời thép kéo đứt được cả trục bánh xe tải; trên sợi cáp lủng lẳng những mẩu "hàng" chưa kịp bán. Băng Scav chẳng cần chiếm lò đúc hay cung phụng vị thần nào; chúng chỉ việc chốt chặn ngay miệng vực, hớt trọn mọi thứ rơi từ Thượng tầng xuống trước mũi tất cả mọi người. Sắt vụn móc được, Rigger đem bán thẳng cho Foreman để đổi lấy dầu và lửa — đó là lý do tay chân của gã lởn vởn từ cổng bãi hoang cho tới tận Lò Đúc.

Ronin và Rigger làm cùng một nghề, chỉ khác nhau đúng một lằn ranh đạo lý. Và cái đêm Yuki rơi xuống, kẻ chậm hơn nửa bước chân chính là Rigger.

*Tuyệt kỹ — WINCH (MÓC HÀNG):* Rigger phóng lưỡi móc xuyên thủng giáp hộ thân rồi siết căng tời máy, giật phăng mục tiêu khỏi đội hình và quật dập xuống sàn bê tông. Sát thương đơn thể cực mạnh; mục tiêu dính Choáng, mất lượt kế tiếp.

**FOREMAN — Bạo Chúa Lò Rèn** ✦ · *Boss · màn 07-B · phe Rust*

Từng là một tên cai ngục tàn bạo bị Canticle sa thải, Foreman dẫn đầu một băng nhóm cặn bã đánh chiếm khu lò đúc bỏ hoang của thành phố. Hắn thâu tóm toàn bộ nguồn nhiệt và lửa của Khu Đáy, biến nó thành công cụ bóc lột đồng loại. Gã khổng lồ này khoác lên mình bộ giáp hàn bằng các tấm chắn xỉ lò nung, tay cầm chiếc kẹp sắt khổng lồ luôn đỏ rực vì nhiệt. Đối với Foreman, sự sống chỉ là nhiên liệu: Hắn muốn tống Yuki vào lò nung để nấu chảy bộ khung xương titan của cô thành những thỏi kim loại bán lấy tiền.

*Tuyệt kỹ — SMELT (NẤU CHẢY):* Càng thuỷ lực kẹp ngang người, nhấc bổng khỏi sàn rồi dí thẳng vào miệng lò đang mở. Sát thương đơn thể rất nặng, và nạn nhân còn bốc cháy thêm hai lượt sau khi rơi xuống.

**ARCHON — Cánh Cổng Thu Hồi** ✦ · *Boss · màn 07-C · phe Chrome*

Archon không phải là một con người, cũng chẳng phải một người máy thông thường mang hình nhân. Nó là một pháo đài phòng ngự di động hình bán nguyệt khổng lồ, được tách ra từ chính hệ thống cổng vành đai của Tháp. Khi phát hiện Đơn Vị 07 đào tẩu, cỗ máy tự động kích hoạt giao thức thu hồi tài sản tối mật. Với bốn chân nhện cơ khí đồ sộ và lớp giáp phản quang dày hàng tấc, Archon lạnh lùng quét tia laser đỏ rực khắp bãi phế liệu, coi mọi sinh vật cản đường chỉ là những chướng ngại vật cần được dọn dẹp bằng hoả lực hạng nặng.

*Tuyệt kỹ — FORCED RECALL (CƯỠNG CHẾ THU HỒI):* Thấu kính giữa ngực khoá vào một mục tiêu rồi bắn thẳng một luồng tím dọc mặt đường. Luồng đó không cốt giết người: nó rút sạch Energy của kẻ trúng đòn, chiêu cuối dồn dở coi như mất trắng.

**MOTHER RUST — Đức Mẹ Của Tro Tàn** ✦ · *Boss · màn 07-D · phe Rust*

Ngồi trên một ngai vàng kết bằng hàng ngàn ống bô và xương máy rỉ sét dưới lòng cống ngầm, Mother Rust là hiện thân của sự điên loạn sinh ra từ nỗi tuyệt vọng cùng cực. Bà ta tôn thờ những mảnh vụn Chrome rơi từ trên trời xuống như những ân sủng cứu rỗi linh hồn. Bên hông bà ta luôn xích chặt một cuốn sổ cái ố vàng ghi chép tên tuổi của mọi đứa trẻ và linh kiện từng rơi xuống vực sâu. Mother Rust muốn "thánh hoá" Yuki bằng cách dùng dao róc thịt, tháo rời từng khớp máy của cô để ban phát cho các tín đồ quỳ lạy bên dưới.

*Tuyệt kỹ — BENEDICTION (PHÉP LÀNH):* Bà mở rộng hai tay, vòng ống hàn sau đầu nóng đỏ lên và ban phước xuống cả đàn tín đồ: mọi kẻ địch còn sống hồi lại một phần máu tối đa của chúng. Cứ để bà đứng đó ban phép thì cả đàn không bao giờ gục.

**CANTOR — Bóng Ma Đỉnh Tháp** ✦ · *Boss · màn 07-E · phe Chrome*

Kẻ đội chiếc Halo màu vàng kim sáng chói — hiện thân của quyền lực tối thượng và sự tàn nhẫn không tì vết. Sáu năm trước, chính Cantor là kẻ đã chỉ tay vào cô bé mười một tuổi giữa đống đổ nát Tầng Bốn để biến cô thành Đơn Vị 07. Khi Yuki thức tỉnh và tiến sát đến Thang Máy Hàng, hắn đích thân giáng lâm để "quét dọn dữ liệu rò rỉ". Nhưng khi lưỡi kiếm của Yuki chém rách lồng ngực hắn, sự thật kinh hoàng mới được phơi bày: Thực thể đứng trước mặt họ chỉ là một con rối cơ khí sinh học điều khiển từ xa; Cantor thật vẫn đang ngồi nhâm nhi rượu vang trên đỉnh District 01, lạnh lùng quan sát trò chơi qua màn hình viễn trắc.

*Tuyệt kỹ — DELETION ORDER (LỆNH XOÁ):* Cantor không cầm vũ khí, cũng không bước tới nửa bước. Hắn chỉ ra lệnh, rồi cả dãy đèn trên cao quét xuống một lượt: cả ba người trong đội trúng đòn cùng lúc.

### Quân đội & thực thể chiến trường

**SCAV — Bầy Kền Kền Bãi Rơi** ✦ · *Lính thường · 00-T, 07-A · phe Rust*

Bọn này không phải lính được tuyển mộ, mà là một giống loài tự tiến hóa từ cái đói. Dựng lều ngay dưới họng xả rác của Tháp, chúng ngủ bằng một mắt và mở sẵn tai chờ tiếng rít xé gió của phế liệu rơi tự do. Đồ rơi chưa kịp chạm đất nguội bớt, cả đàn đã ùa tới với kìm cộng lực và cưa máy lăm lăm trên tay. Luật của Rigger đã tẩy sạch chút nhân tính cặn lại trong não chúng: Cái gì rớt xuống đều là hàng. Một cỗ máy còn giật hay một mạng người còn thở thoi thóp? Với bầy kền kền này, tất cả chỉ là "kiện hàng chưa kịp tháo ốc" mà thôi.

*Nhận diện:* Dân ve chai vũ trang hạng nặng; liều mạng, khát máu, thấy linh kiện trên người sống là đè ra cạy.

*Tuyệt kỹ — STRIP DOWN (THÁO ĐỒ):* Kìm cộng lực nhè đúng khớp nối mà bập vào rồi giật ngược ra. Scav không đánh nhau — hắn tháo, và không cần biết cái khớp đó còn dính vào ai.

**CHÓ HOANG — Nanh Vuốt Canh Bãi** ✦ · *Lính thường · 00-T, 07-A · phe Rust*

Tháp không chỉ thải sắt vụn, nó thải cả chó. Toàn những "phế phẩm" bị loại khỏi dây chuyền thí nghiệm cấy ghép: nửa xương thịt gầy trơ, nửa thép hoen rỉ, nguyên hàm dưới được thay bằng bộ kẹp thủy lực công nghiệp. Chúng từng cắn xé xác đồng loại dưới bãi rác cho tới ngày Rigger nhận ra một bài toán kinh tế siêu hời: Nuôi người máy thì tốn dầu, còn nuôi chó thí nghiệm thì… miễn phí, cứ vứt thịt thừa là xong. Lũ quái vật bị xích quanh bãi, bỏ đói thâu đêm suốt sáng. Bất cứ ai lén bước qua ranh giới hàng bãi đều chỉ nghe một tiếng sủa khàn đục như sắt cứa vào nhau — một tích tắc trước khi cả khối thép lao thẳng vào cổ họng. Tốc độ của chúng chấp cả đám người máy hiện đại nhất trên Tháp.

*Nhận diện:* Chó thí nghiệm hàm thủy lực bọc thép; cắn trước sủa sau, tốc độ bứt tốc vượt mặt cả Yuki.

*Tuyệt kỹ — RUN DOWN (ĐUỔI CÙNG):* Vọt qua sân bằng bốn chân, ngoạm đúng bắp chân rồi giật đầu một cái. Vết cắn từ bộ hàm đó không bao giờ sạch: nó còn mưng mủ thêm mấy lượt nữa.

**CHOP SHOP — Tiệm Mổ Di Động** ✦ · *Lính thường · 07-A, 07-B · phe Rust*

Gã chẳng phục tùng bố con thằng nào, vì gã bán "tay nghề". Lưng cõng cái giá gấp chất kín cưa xương, mỏ lết với kìm banh khớp — chỉ cần hạ giá xuống là có ngay một bàn mổ dã chiến giữa bãi rác. Dây chuyền khép kín: Rigger cướp hàng về, Chop Shop rã thịt bóc đồ, Foreman nấu chảy đống phế phẩm còn lại. Gã tự hào nhất khoản tốc độ: bóc sạch một cánh tay máy còn nguyên rễ thần kinh đang giật tưng tưng chỉ mất đúng bốn mươi giây. Gã không thù oán ai, cũng chẳng bao giờ nổi giận; gã chỉ nhìn người sống bằng con mắt của một gã đồ tể đang ước lượng cân thịt nạc. Đây chính xác là loại cặn bã mà thanh kiếm của Ronin sinh ra để chặt làm đôi.

*Nhận diện:* Tay rã hàng cơ động cõng bàn mổ sau lưng; chuyên me khớp nối, đưa cưa là đứt lìa.

*Tuyệt kỹ — PART OUT (RÃ HÀNG):* Kìm banh khớp kẹp vào, bật ra, rồi kẹp lại lần nữa cho chắc. Gã làm hai nhát trên cùng một người vì gã tính tiền theo món, không theo mạng.

**THỢ HÀN — Ngọn Lửa Đi Vay** ✦ · *Lính thường · 07-A, 07-B · phe Rust*

Ở Khu Đáy, lửa không phải quà của Thượng đế — nó là hàng độc quyền do Foreman phát hành. Đám Thợ Hàn vay ngọn lửa ấy để sống, rồi còng lưng trả nợ bằng chính tay nghề của mình: đi vá giáp, dựng rào chắn, trám lỗ thủng trên người cho bất cứ băng đảng nào trả đủ tiền bo, kể cả tụi Scav bẩn thỉu. Khuôn mặt chúng giấu nhẹm sau lớp kính hàn ám khói đen sì; sẹo bỏng và mối hàn trên người chúng khéo còn dày hơn mối hàn trên mấy tấm tôn vụn. Nhớ lấy: khi mỏ hàn của bọn này đã liếm trúng da thịt, ngọn lửa của chúng sẽ thiêu đốt nạn nhân rất lâu sau khi trận đánh đã tàn.

*Nhận diện:* Thợ cơ khí chiến trường; xách que hàn xịt lửa dí mặt địch kiêm bơm giáp cấp tốc cho đồng bọn.

*Tuyệt kỹ — PATCH JOB:* Vá tạm cho đồng bọn thủng nhất giữa trận: hồi lại một phần máu tối đa của con đó. Giết hắn trước, hoặc đánh cả buổi không hết máu.

**THỢ ỐNG — Bàn Tay Khoá Van** ✦ · *Lính thường · 07-B · phe Rust*

Foreman nắm thóp hơi ấm của cả Khu Đáy không phải bằng súng đạn, mà bằng lũ thợ ống này. Bọn chúng lủi thủi chui rúc trong mạng lưới ống nhiệt ngoằn ngoèo như ruột gà dưới lòng cống ngầm, thuộc nằm lòng van nào bơm nhiệt cho ổ chuột nào. Nộp tiền đúng hạn? Có hơi ấm. Chậm một ngày? Sẽ có một gã lù đù vác cờ lê chui xuống vặn kịch van lại, để mặc cả xóm ngồi run cầm cập trong bóng tối cắt da cắt thịt cho tới khi ói đủ tiền. Vũ khí của chúng là cái cờ lê ống dài bằng nửa thân người — đủ nặng và đầm để bẻ vụn xương bánh chè chỉ sau một cú vung.

*Nhận diện:* Kẻ nắm quyền sinh sát nhiệt lượng; cờ lê ống siêu nặng, vung chậm như rùa nhưng trúng là nát xương.

*Tuyệt kỹ — PIPE PATCH (VÁ ỐNG):* Quấn băng thép quanh chỗ thủng của đồng bọn rồi siết cùm lại. Vá kiểu thợ ống: xấu, nhanh, và đủ để con đó đứng dậy đánh tiếp.

**TIN MAN — Cỗ Quan Tài Biết Đi** ✦ · *Lính thường · 07-B · phe Rust*

Trong đợt Canticle cắt điện diện rộng, lũ cùng đinh phát hiện ra một nơi trú ẩn ấm áp không ngờ: ruột mấy cái bình nước nóng công nghiệp bị Tháp vứt xó. Có những kẻ chui tọt vào trong rồi... lười chui ra luôn, tự tay hàn kín mép vỏ quanh người, đục đúng hai lỗ để nhìn, biến thành những "Gã Bình Nóng Lạnh" di động bọc trong lớp thép dày cả tấc. Bên trong vừa tối, vừa hôi hám, vừa ngột ngạt đến mức chúng còn chẳng nhớ nổi mặt mũi gốc gác mình tròn méo ra sao. Foreman trưng dụng đám này làm bao cát chặn cửa lò: chúng đánh chẳng đau, nhưng độ lì lợm và trơ trẽn thì đủ khiến bất kỳ ai đập mỏi tay quá mà bỏ về.

*Nhận diện:* Kẻ sống sót chui rúc trong bình nước nóng cũ; giáp trâu vô đối, đánh vào chỉ tổ mẻ kiếm tốn giờ.

*Tuyệt kỹ — BUTTON UP (ĐÓNG NẮP):* Sập hết nắp giáp xuống rồi đứng im giữa sân. Không đỡ, không né — cứ để đòn dội vào lớp tôn, đến khi lớp tôn đó vỡ mới tính tiếp.

**SLAGGER — Kẻ Tắm Trong Xỉ Lò** ✦ · *Lính thường · 07-B, 07-D · phe Rust*

Nhiệm vụ của chúng là múc xỉ: lớp cặn kim loại nóng chảy sùng sục trôi trên mặt lò luyện kim. Cứ mỗi ca làm là một trận mưa tàn lửa, mỗi ngày là một lớp bỏng mới đè lên lớp bỏng cũ, cho đến khi da thịt chúng chai sạn thành một lớp vảy sừng dày cộp, còn dây thần kinh cảm giác thì cháy rụi sạch sành sanh. Bị chém không rụt tay, bị lửa thiêu không thèm la hét — không phải vì chúng dũng cảm phi thường, mà đơn giản là não bộ đã mất tín hiệu báo đau từ lâu. Vài kẻ hoang tưởng tin rằng thứ lửa địa ngục ấy đã thanh lọc hết tạp chất người trong xác thịt, bèn bỏ lò rủ nhau trốn xuống cống theo gót Mother Rust.

*Nhận diện:* Kẻ múc xỉ toàn thân đóng vảy bỏng; đã "hỏng" cảm giác đau, lầm lì, ăn đòn thay cơm mà vẫn cắn trả hung tợn.

*Tuyệt kỹ — SLAG POUR (ĐỔ XỈ):* Nghiêng nguyên thùng xỉ nóng, đổ thành một vệt dài trước mặt. Cả đội dính, và chỗ xỉ bám lại còn cháy thêm mấy lượt.

**KILN — Cái Lò Biết Đi** ✦ · *Tinh nhuệ · 07-B, 07-D · phe Rust*

Foreman đi buôn lửa, còn Kiln thì vác luôn cái lò đi đập lộn. Gắn chặt trên lưng gã là một cái lò than nguyên khối đỏ rực suốt ngày đêm, kết nối trực tiếp vào lồng ngực qua hệ thống ống dẫn nhiệt kêu rên rỉ è è. Gã tự tay đóng đinh cái lò ấy vào cột sống và thề không bao giờ để nó tắt — vì ngọn lửa lụi tàn cũng là lúc gã chết cóng giữa đáy cống. Khi vào trận, Kiln xả van hơi nóng cực đại, bọc quanh người một luồng bão lửa đỏ rực; bất cứ lưỡi kiếm nào muốn chạm tới da thịt gã đều phải chém nát lớp áo lửa thiêu đốt này trước.

*Nhận diện:* Gã điên cõng lò than rực lửa sau lưng; áp sát là tỏa nhiệt thiêu cháy mọi thứ xung quanh.

*Tuyệt kỹ — FIRE STORM (BÃO LỬA):* Tự bọc bản thân bằng một lớp giáp lửa có lượng chống chịu tương đương 100% máu tối đa; không đập vỡ giáp thì đừng hòng chạm vào sợi lông chân gã.

**HOLLOW — Kẻ Tự Rỗng Ruột** ✦ · *Lính thường · 07-B, 07-D · phe Rust*

Giáo lý của Mother Rust ngắn gọn tới rợn gáy: Xác thịt của ngươi là khoảng trống để đón nhận ân sủng từ trời. Đám con nhang ngoan đạo nhất hưởng ứng bằng cách... tự mổ phanh lồng ngực mình, móc sạch lòng mề quẳng đi — rồi để nguyên như thế. Không khâu, không băng, không nhồi bất cứ thứ gì vào: cái hốc đen ngòm ấy phải mở toang hứng lên trời, bịt lại là chối bỏ ân sủng. Đám dây thần kinh máy đứt lòng thòng rủ ra khỏi miệng hốc, quét lệt sệt trên nền cống theo từng bước đi. Chúng chẳng còn nói được tiếng người, chỉ biết ngoác họng tạo ra những tiếng rít kèn kẹt rợn óc của kim loại ma sát. Kẻ nào chết mà lồng ngực vẫn trống trơn thì bị phán là chưa được chọn, xác quẳng lại cho lũ Chuột Cống. Trên Tháp, Canticle phải dùng dao mổ vô trùng để nạo sạch lính; dưới Đáy, dân tình xếp hàng dài chỉ để tự làm trò đó với một mảnh chai vỡ.

*Nhận diện:* Tín đồ cuồng giáo tự moi rỗng lồng ngực rồi để trống hoác; hoàn toàn mất tri giác sợ hãi, bắn nát gáo vẫn lết thêm một nhịp để kéo chân bạn.

*Tuyệt kỹ — EMPTY OUT (TRÚT RỖNG):* Mở lồng ngực rỗng ra và trút nốt thứ còn sót lại bên trong. Cái xác này không còn sức để mạnh lên hay yếu đi — lần nào cũng đúng ngần ấy sát thương, bất kể màn dễ hay khó.

**DRILL-BIT — Mũi Khoan Tìm Thánh Tích** ✦ · *Tinh nhuệ · 07-D · phe Rust*

Đồ thánh tích xịn nhất đời nào nằm lộ thiên trên mặt đất. Linh kiện Chrome xịn rơi từ độ cao ba ngàn mét xuống sẽ cắm ngập lút cán vào tầng bùn lầy và bê tông đổ nát, và giáo phái cần một kẻ đủ trâu để moi chúng lên. Drill-Bit từng là thợ đào hầm cống ngầm, giờ thì mũi khoan thủy lực siêu trọng của gã chỉ phục vụ một việc: khoan nát mọi thứ để tìm "ân sủng" dưới lòng đất. Mother Rust gọi gã là "Cánh tay phải". Cái mũi khoan công nghiệp quay tít mù nghiền nát được cả bê tông cốt thép ấy vốn chẳng bao giờ quan tâm giáp của đối thủ dày mấy centimet.

*Nhận diện:* Cựu thợ đào hầm vác mũi khoan xuyên phá; chuyên trị mục tiêu bọc thép, khoan thẳng qua mọi lớp phòng ngự kiên cố nhất.

*Tuyệt kỹ — BREACH (KHOAN THỦNG):* Hạ mũi khoan xuống ngang tầm ngực rồi mới quay hết ga, ăn vào hai nhịp liền trên cùng một người. Nhịp nào cũng có thể ra chí mạng riêng.

**CHUỘT CỐNG — Bầy Con Của Nước Thải** ✦ · *Lính thường · 00-T, 07-D · phe Rust*

Sáu năm tắm mình trong dòng hóa chất độc hại từ Tháp dội xuống hệ thống cống ngầm đã nhào nặn ra giống loài này: chuột to ngang ngửa chó săn, mắt mù lòa phủ một màng bạc trắng, răng cửa mọc dài và cứng đến mức cắn thủng cả vỏ nhôm máy bay. Chúng săn mồi theo đàn, không nhìn mà "thấy" con mồi bằng độ rung chấn của từng bước chân gõ trên mặt sàn bê tông. Giáo phái Mother Rust chẳng thèm xua đuổi — bà ta quẳng phần thịt thừa sau các buổi lễ tế xuống cống và âu yếm gọi chúng là "những đứa con". Đó là lý do nhà thờ dưới cống ngầm chưa bao giờ cần đến một mống bảo vệ.

*Nhận diện:* Chuột đột biến cỡ bự dưới cống ngầm; mù dở nhưng thính rung chấn cực nhạy, lao vào cắn xé theo đàn với tốc độ kinh hoàng.

*Tuyệt kỹ — SWARM (BẦY ĐÀN):* Một tiếng huýt gió, và cả cái ổ dưới nắp cống trào lên cùng lúc. Không ai trong đội đứng ngoài được đợt này.

**GLASS JAW — Cằm Thủy Tinh, Đấm Sấm Sét** ✦ · *Lính thường · 07-C · phe Rust*

Cái tên này do đám khán giả khốn nạn dưới sới bạc đặt cho gã để cười cợt: "Cằm Thủy Tinh" — thằng cha có cú đấm mạnh như trời giáng nhưng mặt lại mỏng manh như pha lê, trúng đúng một đòn phản là lăn đùng ra xỉu. Dưới mấy sới đấm bốc chui ở bãi xe phế liệu, người ta không rảnh cá gã thắng hay thua, họ chỉ cá xem gã trụ được bao nhiêu giây trước khi bị đấm vỡ mặt. Gã nuốt nhục, giữ luôn cái biệt danh ấy vì gã hiểu chân lý này: Một cái tên bị réo lên sỉ vả vẫn tốt hơn là một cái tên bị lãng quên. Bộ tụ áp lắp dọc cánh tay phải cho phép gã dồn toàn bộ năng lượng vào một cú đấm duy nhất mang hình đầu rồng — lóe sáng tới mức mù mắt khán đài. Gã đánh thuê cho bất cứ ai xì tiền tươi, kể cả bọn Tháp, những khi Canticle tiếc quân xịn mà muốn thuê mấy thằng liều ra đứng chốt cổng ngoài.

*Nhận diện:* Đấu sĩ sới bạc ngầm với lối đánh "được ăn cả ngã về không"; sở hữu cú đấm mang uy lực hủy diệt nhưng thân xác giấy vụn, ăn một gậy là đi ngủ.

*Tuyệt kỹ — ELECTRIC DRAGON PUNCH (THIÊN LÔI LONG QUYỀN):* Đấm thẳng mặt một mục tiêu, gây chuẩn xác 200 sát thương cố định — bất chấp màn chơi đang ở cấp độ dễ thở hay địa ngục trần gian. Trúng là bốc hơi!

**DRONE MK1** ✦ · *Lính thường · 07-C, 07-E · phe Chrome*

Mắt thần tầm thấp của Canticle; chuyên quét mã định danh, định vị và bắn đạn kìm chân.

*Tuyệt kỹ — STRAFE (BỔ NHÀO):* Leo cao rồi bổ nhào quét một đường dọc sân. Đường quét đó không chỉ để gây sát thương: nó làm nhiễu Halo, rút bớt Energy cả đội đang dồn cho chiêu cuối.

**ENFORCER** ✦ · *Tinh nhuệ · 07-C, 07-E · phe Chrome*

Lính chống bạo động bọc thép titan của Tháp; kỷ luật thép, súng điện và khiên xung lực.

*Tuyệt kỹ — SUPPRESSION (TRẤN ÁP):* Dùi cui điện quật ngang vào vòng Halo chứ không nhắm vào người. Cú đó không cốt gây đau — nó làm nhiễu, rút mất một phần Energy đang dồn cho chiêu cuối.

**CHROME HOUND** ✦ · *Tinh nhuệ · 07-C, 07-E · phe Chrome*

Chó săn máy không đầu mang dải quét quang học; truy vết mùi máu và lao vào tự sát.

*Tuyệt kỹ — CULL (LOẠI BỎ):* Con chó không lao vào kẻ đứng gần nhất mà chạy thẳng tới kẻ đang yếu nhất trong đội. Đây là chiêu duy nhất trong game không đánh ngẫu nhiên: cứ để ai đó thoi thóp là nó tới.

**BULWARK** ✦ · *Tinh nhuệ · 07-A · vệ sĩ của Rigger · phe Rust*

Bức tường thép di động vác khiên ray tàu hoả; chặn đứng mọi đường đạn tầm xa.

*Tuyệt kỹ — SHIELD WALL (TƯỜNG CHẮN):* Đóng tấm thép đường xuống nền rồi lùi lại nửa bước, lấy thân che cho kẻ đứng sau. Con to nhất bên nó được một lá chắn, đánh vỡ mới chạm được tới da thịt.

<!-- AUTO:D1:END -->

---

## D2 · NIÊN BIỂU — dòng thời gian ⭐ nên có

**Vì sao cần:** truyện có sáu năm quá khứ và mọi hồ sơ nhân vật đều móc vào nó. Người chơi đọc rời từng hồ sơ sẽ không tự nối được. Một trang niên biểu là chỗ rẻ nhất để họ thấy cả bức tranh.

**Bản nháp — mọi mốc đều lấy từ hồ sơ đã có, chưa có mốc nào bịa:**

| Khi nào | Chuyện gì |
|---|---|
| Không rõ | Halo được làm ra như một **bộ lọc**, để cứu lính mới ráp khỏi điếc vì tiếng ồn. |
| Không rõ | Canticle ghép **dòng lệnh thêm** vào bộ lọc. Từ đó Halo nhận lệnh và giữ ký ức hộ. |
| 14 năm trước | Muzzle bắt đầu ca gác đầu tiên ở cổng vành đai. |
| 10 năm trước | Meridian ra lò, lô cuối của dòng lính hậu cần. Đồng hồ bắt đầu chạy. |
| ~8 năm trước | Wire vào xưởng lắp Halo. Chín trăm cái, tám năm. |
| 7 năm trước | Halo (y tá) được chế tạo — lính máy duy nhất được phép cảm thấy đau. |
| Không rõ | Chị của Ronin bị Canticle "tuyển" lên Tháp. Anh mười sáu tuổi. Chị không về. |
| 6 năm trước, 3 giờ chiều | **Tầng Bốn sập.** Bốn nghìn người chết. Toll nhìn thấy từ trên cầu trục. Junker bị ép trong cabin mười một tiếng. Bố mẹ Yuki chết. Bố mẹ Ash và Kai chết. |
| 6 năm trước, 3 ngày sau | **Xe trắng xuống Đáy.** Con bé mười một tuổi chặn xe. Người đội Halo vàng chỉ vào nó. Ash mười ba tuổi kéo em trốn trong ống nước ba ngày. |
| Sau vụ sập | Canticle cắt điện khu của Spark sáu tháng. Gravedigger khắc bốn nghìn tấm thép, khắc suốt một năm. Toll bắt đầu đi đòi nợ. |
| 6 năm — vài ngày trước | Yuki là Đơn vị 07, sát thủ của Choir. Không hỏi, không nhớ. Psalm xử xong ba trăm mười hai ca. |
| 4 năm trước | Dự án Nyx bị đóng. Cô bị nhốt dưới hầm cùng toàn bộ hồ sơ. |
| Không rõ | Stitch mất giấy phép. Xuống Đáy, mở container. |
| Không rõ | Wire đọc dòng "xin đừng tắt đèn", bỏ đi trong đêm. |
| Không rõ | Cipher xuống Đáy khi Canticle bắt đầu rà soát bốn kỹ sư. |
| Vài ngày trước | **Halo của Yuki lỗi.** Ký ức rò ra. Canticle ra lệnh xoá. |
| Vài ngày trước | **Ca thứ 313.** Psalm giật vòng của mình, cắt vòng của con bé, đạp bung sàn ống rác. Hai người cùng rơi. |
| 3 ngày sau khi 07 rơi | Echo xuất xưởng, mang giọng sao chép từ hồ sơ Đơn vị 07. Vesper nhận vị trí của Yuki. |
| 4 đêm | Echo đi tuyến cống gọi Yuki. Đêm thứ tư, cô tự cắt loa. |
| **Hôm nay** | Yuki tỉnh dậy ở Bãi Rơi. Chương 1 bắt đầu. |

---

## D3 · PHE & TỔ CHỨC ⭐ nên có

Đang nằm lẫn trong phần thuật ngữ. Nếu Thư viện tách được thì gọn hơn: **CANTICLE · CHOIR · Enforcer · Tổ nhặt sắt · Băng Scav · Băng Foreman · Giáo phái Mother Rust.** Mỗi mục hai câu: họ là ai, họ muốn gì.

Chất liệu đã có ở phần **B2** và **B3** bên trên.

---

## D4 · ĐỒ VẬT — mỗi món một chuyện

Cả dàn nhân vật được nhận ra bằng đồ họ cầm. Một mục "đồ vật" cho phép kể chuyện mà không cần mở hồ sơ ai.

| Món | Của ai | Chuyện |
|---|---|---|
| Katana **ZERO** | Yuki | Cũng là tên chiêu cuối. |
| Kiếm của bố Yuki | Yuki, 6 năm trước | Con bé cầm nó ra chặn xe trắng. Không ai biết nó đi đâu sau đó. |
| Đèn lồng đỏ · Halo đỏ | Psalm | Vòng bà tự giật đứt. Giờ đỏ và câm. |
| Kiếm axit xanh | Ash | Axit mua ở bãi hoá chất. Vết cắt còn ăn tiếp sau khi cô quay đi. |
| Thư của Kai | Kai | Đêm nào cũng một lá. Gửi ai đó sẽ nhớ tôi. |
| Kiếm thép | Ronin | Chị anh để lại, kèm một câu: đừng bán thứ gì còn ấm. |
| **Bà Ba** | Muzzle | Cánh cửa xe thứ ba. Cánh thứ tư sẽ mang tên Meridian. |
| Xe kéo | Junker | Anh được hàn thẳng vào khung gầm. |
| Tấm thép khắc tên | Gravedigger | Hơn hai nghìn tấm. Không biết tên thì khắc: *từng ở đây*. |
| Bộ tay phẫu thuật | Stitch | Mỗi lần mất một bệnh nhân, bà khâu thêm một mũi lên tay áo. |
| Sổ nợ và hoá đơn | Toll | Bốn nghìn cái tên, chép theo thứ tự nhà. |
| Dàn tụ điện | Spark | Đeo trên lưng. Bị chặn đường thì cô phóng điện. |
| Đồ nghề tháo Halo | Wire → Vixen | Wire lắp chín trăm cái; Vixen mua lại một bộ để tháo. |
| Bộ đếm giờ | Meridian | Wire đã tháo ra khỏi ngực cô. Cô vẫn đếm bằng miệng. |
| Máy pha cà phê | Cipher | Thứ duy nhất anh mang theo khi bỏ Tháp. |
| Cuốn sổ | Mother Rust | Ghi mọi thứ — và mọi đứa trẻ — rơi xuống Đáy. |

---

## D5 · TƯ LIỆU TRONG THẾ GIỚI

Những mẩu giấy tờ Canticle viết. Đọc chúng cạnh nhau thì thấy rõ một điều: tập đoàn này gọi tên mọi thứ bằng từ hành chính.

- **"Hỏng kết cấu"** — báo cáo chính thức về vụ sập Tầng Bốn. Bốn nghìn người, hai chữ.
- **"Hành vi ngoài chỉ thị. Chấm dứt hợp đồng."** — biên bản đuổi việc Muzzle, sau khi anh đứng chắn giữa nòng súng và một đứa nhỏ.
- **"Ba trăm mười hai ca, không sai sót."** — hồ sơ công tác của Psalm.
- **"Bản mới ổn định hơn bản gốc."** — ghi nhận của kỹ thuật viên khi Vesper nhận vị trí của Yuki.
- **"Hỏng thiết bị. Không xếp diện phản bội — một cái loa không có quyền phản bội."** — hồ sơ thu hồi Echo.
- **"Xin đừng tắt đèn."** — dòng cuối trong nhật ký một lính vừa bị xoá. Wire đọc ba lần rồi bỏ đi.
- **"Trộm tài sản, mười một vụ."** — hồ sơ Vixen. Không vụ nào có hàng xuất hiện ở chợ đen.
- **"Đơn vị 07. Đây là Cantor. Cô bị loại."** — mảnh ký ức đầu tiên Yuki lấy lại được.

Chỗ này cũng là nơi để **lệnh xoá** và **khoảng trống ba giây** — hai thứ khó giải thích bằng thoại nhưng dễ đọc dưới dạng tư liệu.

---

## D6 · TÓM TẮT CHƯƠNG — nhật ký chiến dịch

Người chơi bỏ game hai tuần rồi vào lại sẽ không nhớ Foreman là ai. Một trang "đã xảy ra chuyện gì" mở khoá dần theo màn đã qua là mục Thư viện rẻ nhất mà hữu ích nhất.

**Nhịp chương 1: rơi → cần lửa → bị thu hồi → tên thật → Cantor.**

| Màn | Chuyện gì |
|---|---|
| BÃI RƠI | Yuki tỉnh dậy trong hố, Halo gãy. "Tên tôi là Yuki. Còn lại thì… trống." Scav vây. Ash muốn tháo vòng đem bán, Kai cản. |
| CỔNG BÃI XE | Việc thử của Ronin. Kai dạy luật Đáy. Drone Canticle quét được mã 07 — tổ biết cô đáng giá hơn họ tưởng. |
| LÒ ĐÚC | Yuki cần lửa của Foreman để mở cái Halo. Nung xong, mảnh ký ức đầu tiên hiện ra: buồng trắng, tên CANTOR, một người phụ nữ đội Halo đỏ. Ngọn lửa đó gọi Canticle xuống. |
| HÀNG RÀO TẬP ĐOÀN | Canticle xuống thu hồi. Psalm bước ra: "Tôi là người cắt vòng của cô. Muốn giết tôi thì đợi xong trận." Yuki hỏi mình là ai trước khi lên Tháp. Psalm: "Tôi không biết. Nhưng tôi biết ai biết." |
| NHÀ THỜ DƯỚI CỐNG | Mother Rust giữ sổ ghi mọi đứa trẻ bị thu gom. Yuki nhớ ra bố mẹ, Tầng Bốn, xe trắng, và người đàn ông đội Halo vàng. Ash: "Của tụi tôi cũng vậy." |
| THANG MÁY HÀNG | Cantor tự xuống. "Cô đang rò rỉ dữ liệu. Tôi xuống để dọn." Yuki: "Tôi có tên." Cantor hoá ra chỉ là cái vỏ điều khiển từ xa. Yuki nhớ hết, tự đặt tên mình. "Thang máy vẫn chạy. Lên." |

---

## D7 · HỘI THOẠI ĐÃ MỞ (COMMS / BOND)

Hiện game đã có **11 đoạn** hội thoại hai người, mở khi cả hai cùng ở trong tổ. Chúng đang nằm ở màn COMMS. Nếu Thư viện có mục lưu lại thì người chơi đọc lại được — và đây là chỗ nhân vật lộ tính cách rõ nhất.

Danh sách: Ash↔Kai *(Thư)* · Yuki↔Kai *(Fan)* · Yuki↔Psalm *(Đếm)* · Ash↔Muzzle *(Sẹo)* · Kai↔Gravedigger *(Hố đào nhanh quá)* · Junker↔Stitch *(Xe vẫn chạy)* · Meridian↔Muzzle *(Giao kèo)* · Cipher↔Psalm *(Ba giây)* · Yuki↔Echo *(Một câu)* · Wire↔Halo *(Ốc vít)* · Nyx↔Ronin *(Nghĩa đen)*.

**Còn thiếu:** chưa có đoạn nào cho Toll, Spark, Vixen, Vesper, Junker↔Gravedigger. Nếu anh viết lại Thư viện thì đây là chỗ dễ thêm nhất — mỗi đoạn bốn câu.

---

## D8 · BÀI ĐẾM BƯỚC — một mục riêng

"Một bước. Hai bước. Ba bước." Đây là thứ nối con bé mười một tuổi với người lớn cầm katana: cùng một bài, cách nhau sáu năm, và trong sáu năm ấy cô không biết mình đang đọc gì. Đủ sức đứng riêng một mục, dài ba câu.

---

## D9 · BA CỬA — kết chương 3 *(spoiler, nên khoá tới khi chơi tới)*

Ba lựa chọn cuối truyện. Không cửa nào sạch:

1. **Cắt hết.** Mọi Choir tự do. Nhưng mất ký ức Halo đang giữ hộ, và những lính cần bộ lọc để sống thì không sống nổi.
2. **Giữ hệ thống, đổi người ra lệnh** — người đó là Yuki. Hôm nay không ai mất gì. Ngày mai Halcyon có một Canticle mới.
3. **Giữ vòng, trả công tắc.** Halo ở lại trên đầu, nhưng chỉ người đội mới bật/tắt được. Không ai bị xoá nữa. Đổi lại, mỗi lính phải tự chọn im lặng hay không, mỗi ngày — và có người đã quen được ra lệnh tới mức không chọn nổi.

---

## D10 · THUẬT NGỮ GIAO DIỆN *(tuỳ chọn — có thể để ở phần Trợ giúp thay vì Thư viện)*

Không phải lore, nhưng người chơi mới vẫn cần tra: **HOME · SQUAD · MAP · REQUISITION · ARCHIVE · COMMS · BOND · SH (mảnh) · CR (tín dụng) · rate-up · pity · wave · sector · chọn mục tiêu · cut-in.**

Em nghĩ **không nên** trộn chỗ này vào Thư viện lore. Người vào Thư viện là để đọc truyện; gặp chữ "pity" giữa hồ sơ Psalm thì hỏng không khí.

---
---

# E. CHỖ CÒN THIẾU VÀ CHỖ CÒN LỆCH

Mười lăm điểm. Điểm **1, 2, 3, 6 đã hết hạn** — bản anh viết ngày 11/09 đã trả lời hết (19 người đủ vũ khí, 4 boss đủ hồ sơ, mỗi người một câu đòn thường riêng, Ash/Kai tả cả kiếm lẫn vũ khí trong video). Điểm 7 và 10 đã chốt. **12–15 là mới**, phát sinh từ chính bản 11/09.

**1. Năm nhân vật chưa có vũ khí.** Vesper, Nyx, Cipher chưa có gì trong tay. Halo (y tá) chỉ có hai bàn tay. Vixen chỉ có bộ đồ nghề tháo Halo, không có vũ khí đánh nhau. Cả năm đều đã có chiêu cuối — nên chiêu cuối đang tả một hành động mà không tả cái gì trong tay họ.

**2. Bốn boss chưa có hồ sơ.** Foreman, Archon, Mother Rust, Cantor mới có một câu nhận diện. Cả bốn đều có thoại trong comic, nên đủ chất liệu viết đủ khung.

**3. Chín người có mô tả đòn thường giống hệt nhau.** Psalm, Muzzle, Wire, Stitch, Nyx, Cipher, Meridian, Spark, Junker — cùng một câu, chỉ khác con số. Đọc Thư viện không phân biệt được ai với ai. Trong file này em đã viết tạm cho mỗi người một câu riêng; anh viết lại thì đây là chỗ đáng làm kỹ.

**4. "Người xét xử" và "CONFESSOR MK-II" là cùng một chức vụ.** Bản Việt gọi là người xét xử, bản Anh gọi Confessor. Chương 2 sẽ cho người chơi gặp kẻ ngồi vào ghế cũ của Psalm — nên thống nhất một chữ tiếng Việt cho `Confessor` trước khi viết. Gợi ý: **Người xét xử Mk-II**.

**5. KILN và LÒ ĐÚC cùng nghĩa "lò" nhưng là hai thứ khác nhau.** Một là kẻ địch tinh nhuệ, một là tên màn 07-B. Không sai, chỉ dễ nhầm khi đọc lướt trong Thư viện.

**6. Ash và Kai: sprite trận cầm kiếm, video chiêu cuối cầm thứ khác.** Ash trong video là lưới mìn, Kai trong video là súng điện từ. Lore hiện đang mô tả theo video. Nếu Thư viện tả vũ khí thì phải chọn một bên — hoặc viết cả hai và giải thích vì sao họ có cả hai.

**7. Thư viện mở khoá theo cái gì?** ~~Đề xuất: mở dần theo màn đã qua.~~ **Đã chốt 11/09: địa danh và thuật ngữ mở hết ngay từ đầu** (prototype — đọc được hết, dễ kiểm, dễ đưa người khác đọc). Hồ sơ nhân vật vẫn giữ luật cũ: chỉ đọc được sau khi sở hữu. Bestiary, niên biểu, **D9 (ba cửa)** chưa quyết — nếu sau này muốn khoá dần thì thêm `when` cho từng mục `CODEX` trong `js/data.js`.

**8. Có nên để nguyên tiếng Anh những gì?** Luật hiện tại: giữ nguyên **YUKI, ZERO, CANTICLE, CHOIR, HALO, tên chiêu cuối, tên boss**. Còn lại dịch. Nếu Thư viện có mục thuật ngữ thì nên ghi luôn cột EN như file này, để bản tiếng Anh sau không lệch.

**9. Từ đã bỏ, thấy ở đâu thì sửa:** *hát lạc điệu, bắt nhịp, thứ tự lệnh, deck, Operator, Free Zone, quận SIS, tầng âm bảy.* Đây là chữ của bản cũ. Đừng viết lại chúng vào Thư viện.
*Cập nhật 11/09:* chữ **"ca"** đã được anh dùng lại có chủ ý — Choir = **Quân Đoàn Ca**, nội tại Echo = **DẬP TẮT BÀI CA**, Meridian = **Hồi Chuông Ca Cuối**. Vậy "bài ca" không còn nằm trong danh sách cấm; cấm là kiểu ẩn dụ *hát/lạc điệu/bắt nhịp* để tả chiến đấu.

**10. "Còn ấm": bán hay tháo dỡ?** ~~Ba câu đang cùng tồn tại.~~ **Đã chốt trong hồ sơ Ronin anh viết 11/09:** chị dặn *"đừng bao giờ bán đi thứ gì còn giữ hơi ấm"* → Ronin biến nó thành luật của tổ: *cấm tháo dỡ người sống* (**T35**: "không bao giờ tháo dỡ thứ gì còn ấm"). Hai câu, một gốc, không còn mâu thuẫn. `LORE.ronin` trong `js/data.js` đã theo bản này.

**11. Ảnh minh hoạ cho 13 mục ✦.** Ingame đã chừa sẵn chỗ: thả file vào `art/lore/<id>.jpg` là hiện, không phải sửa code. Tên file đúng bằng `id` trong `CODEX` (`js/data.js`): `halcyon · spire · bottom · district01 · scar · dropyard · smelter · church` (địa danh) và `halo · choir · stripping · gap3s · ironrule` (thuật ngữ). Khung 4:3, chưa có file thì hiện ô NO ASSET.

**12. Cantor ở 07-E là con rối điều khiển từ xa.** *(mới 11/09, từ hồ sơ **D1 · CANTOR**.)* Bản anh viết: Yuki chém rách ngực hắn thì lộ ra một con rối cơ khí sinh học; Cantor thật vẫn ngồi trên District 01 nhìn qua màn hình. Đây là tình tiết **mới, chưa có trong comic 07-E** (`js/story.js`) — outro hiện đang kết chương như thể đã hạ được hắn. Cần anh quyết: thêm 1–2 ô vào outro 07-E để lộ con rối (cấu trúc trang đã đóng băng 09/09 nhưng **được phép thêm trang ở cuối** intro/outro), hay để dành cho chương 2. Nếu để dành thì Thư viện đang spoil trước comic.

**13. Nội tại Vesper: "đối mặt hoặc đứng cạnh Yuki".** Game chỉ làm được vế "đứng cạnh" (`when:{ally:'yuki'}` → +ATK). Vế "đối mặt" cần một cơ chế khác (buff khi Yuki ở phe địch) mà chương 1 không có. Chữ trong game đã bỏ vế đó. Muốn giữ thì phải cài mới ở chương 2, lúc Vesper là boss (`vesper_b`).

~~**14. Sổ bộ còn thiếu 5 con của chương 1:** RIGGER · CHÓ HOANG · CHOP SHOP · THỢ ỐNG · HOLLOW.~~ — **hết hạn 11/09.** Anh đã viết đủ chữ cho cả 5 con, và RIGGER thì lên hẳn **trùm băng Scav, boss màn 07-A**. Sổ bộ giờ có **21 mục**, mỗi mục một đoạn tiểu sử + một dòng *Nhận diện*; `scratch/library_dump.js` không còn cảnh báo thiếu con nào. **BULWARK** cũng hết trống: từ 11/09 hắn đứng chắn trước Rigger ở wave boss của 07-A.

**15. Muzzle từng là lính Enforcer hay chỉ gác cạnh họ?** Bản anh viết cho Muzzle **bộ giáp của lực lượng bán quân sự Enforcer**; bản cũ chỉ nói anh gác cổng vành đai *cạnh* lính Enforcer (nội tại "Nhận diện đồng đội cũ" vẫn giữ chữ "gác cạnh"). Không phải mâu thuẫn chết người, nhưng comic 07-A và hồ sơ Toll đều nhắc Enforcer như kẻ thù — nếu Muzzle từng mặc chính bộ giáp ấy thì đó là một điểm truyện đáng khai thác, hoặc cần đổi một chữ để anh chỉ là bảo vệ hợp đồng.

