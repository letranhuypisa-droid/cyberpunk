# CHROMEFALL — Hồ sơ nhân vật (Archive) · v0.3

> ⚠️ **File này là bản cũ (trước 11/09).** Ngày 11/09 anh viết lại toàn bộ 19 hồ sơ; bản chốt nằm ở `LORE` trong `js/data.js`
> và in ra ở **`docs/library.md` phần C** (`node scratch/library_dump.js`). Danh xưng, tiểu sử, câu nói, tên nội tại ở dưới đều đã lỗi thời —
> giữ lại vì dòng *Art* (chữ nhận dạng để dán vào prompt ảnh) và bảng chỉ số vẫn dùng được. Đừng chép chữ từ file này sang chỗ khác.

Bản chạy trong game là `LORE` trong `js/data.js`; đọc ở tab HỒ SƠ của màn ARCHIVE sau khi sở hữu. Skill/passive nằm ở `ROSTER` cùng file.
Muốn xem lore và kỹ năng của cả 19 người cạnh nhau: `docs/characters-kit.md` (bản tiếng Anh: `docs/characters-kit.en.md`). Thuật ngữ, địa điểm, vũ khí: `docs/glossary.md`.
Khung mỗi hồ sơ: **Là ai** (2 câu) → **Chuyện đã xảy ra** → **Bây giờ** → **Câu nói**. Quy tắc viết: `docs/story.md` mục 5.
Hai hồ sơ dùng khung khác để thử giao diện: **KAI** viết bằng lá thư, **ECHO** viết bằng bản ghi hỏng kèm ghi chú kỹ thuật viên. Khai bằng `form` + `labels` trong `LORE` (`js/data.js`); ARCHIVE tự đổi nhãn và kiểu chữ.
Dòng *Art* là 5–7 chữ nhận dạng để dán vào prompt ảnh/video (xem `docs/comic-prompts.md`, `docs/ult-prompts.md`).

**Chỉ số nhanh (11/09, ★ FAKE)** — SPD quyết định ai ra đòn trước, CRIT = % chí mạng cơ bản (`js/data.js`; 10 nhân vật chưa có art: `HERO_EXTRA`):

| | Yuki | Psalm | Ash | Kai | Ronin | Muzzle | Echo | Wire | Stitch |
|---|---|---|---|---|---|---|---|---|---|
| ATK / HP | 145 / 950 | 110 / 1100 | 120 / 1000 | 95 / 1200 | 130 / 1050 | 70 / 1750 | 105 / 1000 | 80 / 1500 | 140 / 900 |
| SPD | 112 | 88 | 105 | 96 | 104 | 80 | 100 | 90 | 108 |
| CRIT | 20% | 5% | 12% | 10% (+15 skill) | 15% (+10) | 5% | 10% (+5) | 8% | 15% |

---

## YUKI — Đơn vị 07 · Chromefall
*Chrome · S · sở hữu từ đầu · Art: tóc bob trắng, tai mèo máy, Halo gãy, giáp kimono trắng viền tím, katana ZERO*

**Là ai.** Kiếm sĩ máy giỏi nhất của Canticle, rơi xuống Khu Đáy với cái Halo gãy. Cô chỉ nhớ tên mình và cách chém.

**Chuyện đã xảy ra.** Sáu năm trước, Tầng Bốn sập. Bố mẹ Yuki chết trong đống bê tông. Ba ngày sau, xe trắng của Canticle xuống Đáy thu gom trẻ mồ côi. Con bé mười một tuổi cầm kiếm của bố ra chặn xe, vừa chặn vừa đọc bài đếm bước của trẻ con Đáy. Người đàn ông đội Halo vàng chỉ vào nó: lấy đứa này. Trên Tháp, họ thay nửa người cô bằng máy, đội cho cô cái Halo, khoá hết ký ức cũ và đặt tên mới: Đơn vị 07. Sáu năm cô làm sát thủ cho họ, không hỏi, không nhớ.

**Bây giờ.** Vài ngày trước Halo lỗi, ký ức bắt đầu rò ra. Canticle lệnh xoá. Người xét xử tên Psalm không xoá, mà cắt vòng của cả hai rồi đẩy cả hai rơi xuống Đáy. Giờ Yuki đi cùng tổ nhặt sắt, nhặt lại từng mảnh ký ức. Cô vẫn đếm một, hai, ba trước khi chém. Đến ba thì thường không còn ai đứng.

> "Một… hai… ba! Ơ. Xong rồi à?"

Đòn thường: mục tiêu dưới 30% HP → đòn thường +50%. Ult **ZERO** 320% ATK, giết được hoàn 50 Energy. Passive: NGƯỜI CANH GÁC (với Psalm: vào trận 50 Energy) · NỢ CŨ (địch Chrome: +15% dmg) · CÁI TÊN (Cantor: +30% dmg).

---

## PSALM — Người xét xử
*Chrome · S · thưởng 07-C · Art: tóc trắng ngắn, Halo đỏ, mắt đỏ, vai và tay phải bằng máy, áo choàng đen đỏ dán bùa giấy, đèn lồng đỏ*

**Là ai.** Từng ngồi trong buồng xét xử của Canticle, nghe lính máy hỏng kể hết rồi nhấn nút xoá. Ba trăm mười hai lần.

**Chuyện đã xảy ra.** Trên Tháp, lính Choir nào bắt đầu nhớ hay bắt đầu hỏi thì bị coi là hỏng. Họ được đưa tới Psalm. Bà nghe, ghi lại, rồi nhấn nút. Hồ sơ ghi: ba trăm mười hai ca, không sai sót. Ca thứ ba trăm mười ba là một con bé cầm kiếm, mã Đơn vị 07. Nó không kể gì cả. Nó hỏi: bà có đếm không? Psalm ngồi im mười giây. Rồi bà đưa tay lên đầu, giật đứt vòng Halo của chính mình, cắt luôn vòng của con bé, đạp bung sàn ống rác. Hai người cùng rơi.

**Bây giờ.** Halo của bà giờ đỏ và câm, không nhận lệnh của ai nữa. Bà theo Yuki từ xa suốt mấy ngày vì không chắc con bé có muốn giết mình không. Ở hàng rào Canticle, bà bước ra. Bà không xin lỗi ai. Bà nói: tha thứ là thứ Canticle bán, tôi không mua.

> "Xưng tội đi. Đùa thôi. Tôi bỏ nghề rồi."

Đòn thường: +30 Energy mỗi đòn. Ult **APOSTASY**: điều khiển một kẻ địch một lượt. Passive: CA THỨ 313 (với Yuki: +20% HP) · BIẾT RÕ CHOIR (địch Chrome: −15% dmg nhận).

---

## ASH — Chị
*Rust · A · sở hữu từ đầu · Art: tóc đen dài, da tái, son đen, vòng cổ gai, áo da vá đầu lâu, katana cán quấn đỏ rỉ axit xanh, thuốc lá*

**Là ai.** Kiếm sĩ của tổ nhặt sắt, lưỡi kiếm tẩm axit xanh. Nhìn cái gì cô cũng thấy giá tiền trước, rồi mới thấy nó là gì.

**Chuyện đã xảy ra.** Ash và Kai là chị em sinh đôi. Bố mẹ hai đứa chết trong vụ sập Tầng Bốn sáu năm trước. Ash mười ba tuổi, kéo em trai trốn ba ngày trong ống nước để tránh xe thu gom của Canticle. Ra khỏi ống, cô học kiếm ở xưởng tháo dỡ, mua axit ở bãi hoá chất để tẩm lưỡi, và nhận mọi việc có tiền. Ronin nhận hai chị em vào tổ vì một điều: Ash chưa bao giờ bán đồng đội, dù cô định giá được tất cả.

**Bây giờ.** Đêm nhặt được Yuki, chính Ash nói: tháo Halo, bán. Kai cản. Cô im, không phải vì chịu thua, mà vì cô biết một lính máy hạng S còn sống đáng giá hơn một cái vòng gãy. Cô vẫn nói sẽ bán Yuki. Chưa ai thấy cô làm.

> "Đừng chết trước khi tôi kịp bán cô."

Đòn thường: +35 Energy mỗi đòn, để lại độc 2 lượt (20% ATK mỗi lượt). Ult **FLASHOVER**: gài lưới mìn dưới chân địch rồi bật lửa, cả bãi nổ một lượt, 150% ATK lên toàn bộ địch rồi cháy 2 lượt (20% ATK mỗi lượt) (theo video ult; sprite trận vẫn là kiếm). Passive: CHỊ EM (với Kai: +10% ATK) · ĐỊNH GIÁ (địch Rust: +10% dmg) · TẦNG BỐN (Cantor: +20% dmg).

---

## KAI — Em
*Rust · B · sở hữu từ đầu · Art: em sinh đôi của Ash, tóc đen dài, da tái, son đen, áo da vá đầu lâu, ngực xăm, katana cán đỏ rỉ axit, thuốc lá; từ 11/09 sprite trận đeo thêm khẩu pháo điện từ RIPCORD sau lưng (khớp art thẻ + video ult)*

*(Hồ sơ dạng **lá thư** — `form:'letter'` trong `LORE`.)*

**Là ai.** Em trai sinh đôi của Ash, cùng kiểu kiếm, cùng cái áo. Cậu kể mọi chuyện to gấp ba sự thật — cố ý — vì ở Đáy, chuyện được kể lại mới là chuyện có thật.

**Thư đêm nay.** Gửi ai đó sẽ nhớ tôi.
Tôi lớn lên trong ống nước và trại trẻ Khu Đáy. Ở đó một đứa biến mất thì một tuần sau không ai nhắc tên nó nữa. Bị quên là chết lần thứ hai.
Nên tôi kể to gấp ba. Không phải để oai. Chuyện nhỏ thì người ta quên trong một đêm; chuyện to thì họ kể lại, mà kể lại là còn sống. Tôi cũng ký tên lên mọi bức tường đi qua. Nếu còn đứa nào ở trại trẻ ngày đó chưa chết, nó sẽ thấy tên tôi và biết tìm tôi ở đâu.
Ký: Kai. K, A, I.

**Tái bút.** Tối nay tôi cản chị. Chị định tháo cái vòng của con máy rơi xuống Bãi Rơi đem bán. Tôi gọi nó bằng tên trước: Yuki. Gọi tên rồi thì khó bán hơn.
Từ hôm nay tôi viết cả tổ vào đây. Ronin. Muzzle. Chị. Yuki. Ai đọc được thư này thì nhớ giùm bốn cái tên. Tên tôi thì tôi tự lo, tường ngoài kia đầy rồi.

> "Ghi lại nhé: Kai. K, A, I. Sau này người ta viết cho đúng."

Đòn thường: +15% chí mạng. Ult **RIPCORD**: vác súng điện từ to hơn người, ngắm kỹ rồi bắn một phát xuyên thẳng, 240% ATK, trúng là choáng mất lượt kế tiếp — boss miễn (theo video ult; sprite trận vẫn là kiếm). Passive: CHỊ EM (với Ash: +15% HP) · FAN SỐ MỘT (với Yuki: +10% ATK) · CHÓ MÁY (Chrome Hound: +40% dmg).

---

## RONIN — Trưởng tổ
*Rust · A · gacha (NPC trong comic chương 1) · Art: tóc đen gai đầu đỏ, mặt nạ nửa mặt đèn đỏ, áo choàng đen chữ cam, tay máy, katana thép phát sáng*

**Là ai.** Trưởng tổ nhặt sắt ở Khu Đáy. Không cấy ghép, không máy móc, một thanh kiếm thép và một luật: không tháo người.

**Chuyện đã xảy ra.** Chị của Ronin được Canticle "tuyển" lên Tháp năm anh mười sáu tuổi. Chị để lại thanh kiếm và một câu dặn: đừng bán thứ gì còn ấm. Rồi không về. Ronin lập tổ nhặt sắt với luật duy nhất đó. Vì luật ấy mà tổ nghèo hơn mọi băng khác, và cũng vì luật ấy mà ai nhặt được người, được máy còn thở, đều mang tới chỗ anh.

**Bây giờ.** Anh không tin lính máy của Tháp, nhưng cho Yuki thử việc. Anh giao việc, không hỏi thêm, và là người quyết định cả tổ có leo lên Tháp hay không. Anh chưa nói. Anh đang mài kiếm.

> "Việc xong thì về. Chưa xong thì đừng về."

---

## MUZZLE — Cửa xe
*Rust · B · gacha (NPC trong comic chương 1) · Art: đàn ông to lớn, mặt nạ phòng độc kính vàng, áo choàng xanh đen bọc giáp phế liệu, dụng cụ sau lưng, khiên là cửa xe hơi móp*

**Là ai.** Gác cổng cho Canticle mười bốn năm không sót ca nào. Bị đuổi vì bước ra khỏi chốt đúng một lần.

**Chuyện đã xảy ra.** Ca đêm ở cổng vành đai, một đứa nhỏ Khu Đáy chui qua khe cổng nhặt thuốc rơi. Lính Enforcer giương súng. Gã gác cổng to như cái tủ, mười bốn năm chưa rời vị trí, lần này bước ra đứng vào giữa. Súng hạ xuống. Sáng hôm sau biên bản ghi: hành vi ngoài chỉ thị, chấm dứt hợp đồng. Muzzle đi bộ xuống Đáy với bộ giáp cũ và một cánh cửa xe hơi làm khiên.

**Bây giờ.** Ở tổ Ronin, anh đứng trước mọi người. Anh đặt tên cho từng cánh cửa theo thứ tự: cánh đang dùng là Bà Ba. Hỏi anh sợ chết không, anh cười: chết trước tổ thì được, chết sau tổ thì không.

> "Bà Ba chịu được ba đòn. Đòn thứ tư là phần của tôi."

---

## JUNKER — Xe vẫn chạy
*Rust · B · gacha · chưa có art*

**Là ai.** Mất nửa người dưới trong vụ sập Tầng Bốn, được hàn vào chính chiếc xe kéo của mình. Hỏi gì anh cũng chỉ nói ba chữ.

**Chuyện đã xảy ra.** Tầng Bốn sập lúc ba giờ chiều. Junker đang lái chuyến hàng thứ ba trong ngày. Cabin bị ép giữa hai tấm sàn, đội cứu hộ tự phát kéo anh ra sau mười một tiếng, nửa dưới cơ thể để lại trong đó. Bác sĩ Stitch không có bộ phận thay thế. Bà có chiếc xe. Bà hàn phần còn lại của anh vào khung gầm, nối dây thần kinh vào tay lái, bảo anh đạp ga thử. Xe chạy.

**Bây giờ.** Anh chở hàng, chở người bị thương, chở cả cửa xe vỡ của Muzzle về chôn. Một ngày nói chưa tới mười chữ. Chưa từ chối chuyến nào, kể cả chuyến lên Tháp.

> "Lên. Tôi chở."

---

## GRAVEDIGGER — Người giữ nghĩa địa
*Rust · B · gacha · chưa có art*

**Là ai.** Hơn hai nghìn tấm thép khắc tên sau lò đúc. Ông nhớ từng tấm, và ông chôn cho cả người lẫn máy.

**Chuyện đã xảy ra.** Khu Đáy không có nghĩa trang. Rồi một ông già từ tầng trên xuống, không nói tầng nào, mang theo cái xẻng và một thói quen lạ: đào hố sâu hai thước, đặt tấm thép, khắc tên. Không biết tên thì khắc ngày và ba chữ: từng ở đây. Sau vụ sập Tầng Bốn, ông khắc bốn nghìn tấm. Khắc suốt một năm.

**Bây giờ.** Ông vào tổ sau lần suýt chôn nhầm Kai. Thằng nhóc nằm dưới hố, bất tỉnh, còn thở. Ông kéo nó lên, xin lỗi vì đào nhanh quá. Ông đánh chậm, chắc, y như đào. Ai hỏi sao chôn cả lính máy, ông bảo: đất không hỏi phe.

> "Đất không hỏi phe."

---

## STITCH — Bác sĩ của Đáy
*Rust · S · gacha · Art: chân dung có sẵn (art/card/stitch.jpg)*

**Là ai.** Mất giấy phép vì vá cho một lính máy đào ngũ. Giờ bà vá cả người lẫn máy trong một cái container, ai trả gì cũng nhận.

**Chuyện đã xảy ra.** Một đêm ở bệnh viện tầng trên, một lính Choir gãy Halo bò vào phòng cấp cứu. Quy trình bắt phải báo Canticle ngay. Bác sĩ trực tên Stitch vá cho nó xong, rồi mở cửa sau. Sáng hôm sau, giấy phép bị thu, tên bị xoá khỏi danh bạ. Bà xuống Đáy với bộ tay phẫu thuật nhiều khớp, mở phòng khám trong container cạnh bãi xe.

**Bây giờ.** Bệnh nhân trả bằng bất cứ thứ gì, hoặc kể một câu chuyện. Bà ghi hết vào sổ, không ai được đọc. Bà là người hàn Junker vào xe, và là người duy nhất Psalm cho phép chạm vào cái Halo đỏ. Mỗi lần mất một bệnh nhân, bà khâu thêm một mũi lên tay áo.

> "Nằm yên. Tôi khâu người còn khéo hơn khâu máy."

---

## TOLL — Người thu nợ
*Rust · S · gacha · chưa có art*

**Là ai.** Bốn nghìn cái tên trong một cuốn sổ. Ông đi đòi Canticle trả từng tên một, có hoá đơn hẳn hoi.

**Chuyện đã xảy ra.** Đêm Tầng Bốn sập, Toll trực trên cầu trục bốc hàng, đủ cao để nhìn thấy ba tổ kỹ thuật của Canticle cắt trụ đỡ đúng lịch, để thử tải cho phần móng mới của Tháp. Bốn nghìn người ở dưới. Ông ở trên. Không làm được gì. Ông chép tên từng người vào sổ theo thứ tự nhà, rồi bắt đầu đi đòi: mỗi lính Enforcer một dòng, mỗi dòng một tờ hoá đơn để lại tại chỗ.

**Bây giờ.** Canticle treo giá cái đầu ông. Ông ghi luôn khoản đó vào sổ, coi như nợ mới. Toll lễ phép với tất cả, kể cả người ông sắp giết. Trong sổ, Yuki và Psalm là tài sản bị chiếm đoạt, tức là cũng bị hại. Điều kiện duy nhất khi vào tổ: ngày lên tới Tháp, ông là người gõ cửa.

> "Xin lỗi đã làm phiền. Tôi tới vì khoản nợ ngày mười bảy."

---

## SPARK — Đứa cắt dây Tháp
*Rust · A · gacha · chưa có art*

**Là ai.** Sáu tháng lớn lên trong bóng tối. Giờ cô thắp đèn cho cả tầng bằng điện câu trộm từ Tháp, và mang tụ điện đi đánh nhau.

**Chuyện đã xảy ra.** Sau vụ sập Tầng Bốn, Canticle cắt điện cả khu của Spark sáu tháng, gọi là cách ly kỹ thuật. Năm ấy cô mười một tuổi, đếm ngày bằng bữa ăn, học nối dây bằng tay trong bóng tối. Lúc đèn sáng trở lại, cô đã thuộc lòng đường điện cả khu và biết nó chạy từ đâu xuống.

**Bây giờ.** Cô câu điện thẳng từ trụ Tháp, chia cho từng hành lang, đổi tuyến mỗi khi bị dò ra. Trên lưng là dàn tụ điện tự chế; bị chặn đường thì cô phóng điện. Cô nói nhanh, cười to, gặp ai một phút là đặt biệt danh. Yuki là Đèn Tuýp. Psalm là Cầu Chì.

> "Đèn Tuýp, lùi lại. Cái này sáng lắm đấy."

---

## VIXEN — Kẻ mượn lính
*Rust · A · gacha · chưa có art*

**Là ai.** Mười một lính Choir bị cô "mượn" khỏi tay Canticle. Không con nào bị bán. Con nào cũng được đặt tên rồi thả đi.

**Chuyện đã xảy ra.** Hồ sơ Canticle ghi Vixen là tội phạm trộm tài sản, mười một vụ. Không vụ nào có hàng xuất hiện ở chợ đen. Cô đưa lính máy ra khỏi hàng rào, tháo Halo bằng đồ nghề mua của Wire, dạy chúng một cái tên, rồi thả. Cô gọi đó là trả hàng về đúng chủ.

**Bây giờ.** Cô nói dối gần như mọi chuyện: tuổi, quê, lý do xuống Đáy. Nhưng có ba thứ cô không bao giờ nói dối: đường thoát, chỗ đặt mìn, và ai sẽ chết nếu kế hoạch hỏng. Ronin nhận cô vào tổ vì phân biệt được hai loại ấy.

> "Tôi nói dối đấy. Nhưng cửa bên trái là thật. Đi."

---

## VESPER — Em cùng lô
*Chrome · S · gacha (rate-up) · chưa có art*

**Là ai.** Ra lò cùng ngày, cùng lô với Yuki. Khi Yuki rơi, Canticle giao vị trí của chị cho em. Và em làm tốt hơn.

**Chuyện đã xảy ra.** Trong Choir, mỗi lính giữ một vị trí trong đội hình. Ngày Đơn vị 07 rơi, vị trí của cô được chuyển cho Vesper. Kỹ thuật viên ghi nhận: bản mới ổn định hơn bản gốc. Halo của Vesper chưa từng trễ lệnh một giây. Cô tin cái vòng là thứ giữ cho Choir không tan rã, và ngoài nó chỉ có im lặng.

**Bây giờ.** Canticle cử cô xuống tìm Yuki. Cô hỏi han đối thủ vài câu trước khi ra tay, thật lòng, và không thấy có gì lạ trong chuyện đó. Cô gọi Yuki là chị. Cô chưa từng thấy chị mình chém mà không có lệnh.

> "Chị ơi, về đi. Ngoài này lạnh lắm."

---

## NYX — Nguyên mẫu không Halo
*Chrome · S · gacha · chưa có art*

**Là ai.** Canticle tạo ra cô để trả lời một câu hỏi, rồi nhốt cô bốn năm vì không chịu nổi câu trả lời.

**Chuyện đã xảy ra.** Câu hỏi của dự án: lính Choir không đội Halo thì làm gì? Canticle chuẩn bị hai đáp án: nó nổi loạn, hoặc nó vô dụng. Nyx không làm cả hai. Cô hỏi. Hỏi tên người gác. Hỏi sao sàn phải sạch. Hỏi tại sao ai cũng khóc khi vòng của họ bị tắt. Dự án bị đóng. Nyx bị nhốt dưới hầm cùng toàn bộ hồ sơ. Bốn năm trong hầm, cô đọc hết.

**Bây giờ.** Cô hiểu lời nói theo nghĩa đen: bảo giữ vị trí, cô ôm chặt cây cột gần nhất. Nhưng vào trận, cô là thứ Canticle không xử lý được: một lính chọn mục tiêu vì lý do của riêng mình.

> "Sao lại giữ vị trí? Nó có rơi không?"

---

## HALO — Y tá của Choir
*Chrome · A · gacha · chưa có art*

**Là ai.** Lính máy duy nhất được Canticle cho phép cảm thấy đau, vì đau là cách chẩn bệnh. Bảy năm, hàng nghìn vết thương, không cái nào của cô.

**Chuyện đã xảy ra.** Choir cần cách sửa lính hỏng mà không phải tháo rời. Canticle làm ra cô: chạm vào là biết đau ở đâu. Bảy năm, cô mang trong người bản sao của hàng nghìn vết thương. Cho tới ngày cô chữa cho một lính vừa ra khỏi buồng xét xử, và thấy một vết thương không nằm trên thân máy. Cô bỏ đi, bị bắt lại, bị xích vào lò đúc Halo.

**Bây giờ.** Cô chữa cho bất kỳ ai còn thở, kể cả kẻ vừa bắn mình. Ash bảo thế là ngu. Cô bảo: tôi biết chính xác họ đau ở đâu, tôi không thể không biết.

> "Đứng yên. Tôi thấy chỗ đó rồi."

---

## CIPHER — Kẻ làm cả khoá lẫn chìa
*Chrome · A · gacha · chưa có art*

**Là ai.** Ban ngày viết phần mềm Halo cho Canticle. Ban đêm viết cách mở nó, bán xuống Đáy. Anh gọi đó là cân bằng thị trường.

**Chuyện đã xảy ra.** Cipher là người thường, không Halo, một trong bốn kỹ sư được đọc toàn bộ mã của Halo. Anh biết thứ mà gần như không ai còn nhớ: Halo vốn chỉ là bộ lọc, làm ra để lính mới ráp khỏi điếc vì tiếng ồn. Đoạn biến nó thành dây cương được ghép thêm vào sau, và anh biết chính xác chỗ nó nằm. Lệnh xoá mà Canticle kích hoạt khi một lính tự tách khỏi hệ thống là do anh viết. Trong đó anh cố tình chừa một khoảng trống ba giây, đủ để một lính làm được một việc trước khi bị khoá. Anh không biết ai sẽ dùng. Người đó là Psalm.

**Bây giờ.** Anh chưa bao giờ kể với bà. Khi Canticle bắt đầu rà soát bốn kỹ sư, anh xuống Đáy, mang theo đúng một thứ: máy pha cà phê của phòng nghỉ tập đoàn.

> "Cái gì tôi cũng có cửa sau. Trừ tủ lạnh của Ash."

---

## MERIDIAN — Hết hạn sử dụng
*Chrome · B · gacha · chưa có art*

**Là ai.** Được chế tạo để tự tắt sau mười năm. Còn vài trăm giờ, cô dùng từng giờ để che cho những ai nhỏ hơn mình. Tức là tất cả.

**Chuyện đã xảy ra.** Dòng lính hậu cần của Canticle có hạn dùng cố định: chạy mười năm rồi tự ngắt, khỏi tốn tiền bảo trì. Meridian thuộc lô cuối. Kéo hàng, dựng tường, mười năm chưa từng được giao một trận. Wire tìm thấy cô ở bãi tái chế, đang ngồi đếm to số giờ còn lại, và tháo bộ đếm ra khỏi ngực cô.

**Bây giờ.** Cô vẫn đếm bằng miệng. Cô đứng chắn trước bất kỳ ai nhỏ hơn mình và gọi cả tổ là con. Cô không sợ tắt. Cô chỉ sợ tắt đúng lúc không ai cần.

> "Còn bốn trăm linh chín giờ. Đủ cho trận này. Đứng sau mẹ."

---

## ECHO — Giọng sao chép
*Chrome · A · gacha · Art: chân dung có sẵn (art/card/echo.jpg)*

**Là ai.** Mang giọng của Yuki để gọi Yuki về. Đêm thứ tư, cô nghe lại băng ghi âm của chính mình và tự cắt loa.

*(Hồ sơ dạng **bản ghi hỏng + ghi chú của người Canticle** — `form:'log'` trong `LORE`.)*

**Bản ghi thu hồi · trích.**
`[Đêm 1 · cống C-12] "Về nhà đi." — 41 lần. Không phản hồi.`
`[Đêm 2 · cống C-19] "Về nhà đi." — 63 lần. Không phản hồi.`
`[Đêm 3 · Bãi Rơi] "Về nhà đi. Chị ơi." — 12 lần. Cụm "chị ơi" không có trong kịch bản.`
`[Đêm 4 · kho lưu giọng] Đơn vị mở bản ghi của chính nó. Nghe hết 4 giờ 06 phút.`
`[Đêm 4 · 03:11] Bản ghi dừng. Loa bị cắt từ bên trong.`

**Ghi chú kỹ thuật viên.** Đơn vị mang giọng sao chép từ hồ sơ Đơn vị 07, xuất xưởng ba ngày sau khi 07 rơi.
Xếp diện thu hồi: hỏng thiết bị. Không xếp diện phản bội — một cái loa không có quyền phản bội.
Kiến nghị: thay loa, giữ Halo, đưa lại tuyến cống.
Kiến nghị bị bác. Đơn vị đã rời tuyến.

> "Đừng nhìn tôi như nhìn chị ấy."

---

## WIRE — Thợ lắp Halo bỏ trốn
*Chrome · B · gacha · Art: chân dung có sẵn (art/card/wire.jpg)*

**Là ai.** Tám năm lắp Halo cho Canticle, chín trăm cái, nhớ từng số lô. Giờ cô đi tháo từng cái mình đã lắp.

**Chuyện đã xảy ra.** Đêm cô bỏ đi chẳng có gì gay cấn. Một lính vừa bị xoá được chở về xưởng để tháo vòng, nhật ký của nó còn mở trên màn hình. Dòng cuối ghi: xin đừng tắt đèn. Wire đọc dòng đó ba lần, đóng nhật ký, cầm đồ nghề và hai hộp ốc vít, đi thang máy hàng xuống Đáy.

**Bây giờ.** Cô tháo Halo cho những lính Vixen mang ra, hàn lại vòng gãy của Yuki đủ để không rò điện. Riêng vòng đỏ của Psalm thì bị cấm chạm vào, vì Wire sẽ muốn sửa, mà Psalm muốn nó cứ hỏng. Cô nói chuyện với máy nhiều hơn với người, và xin lỗi cả hai như nhau.

> "Ngoan nào. Đừng rò điện."
