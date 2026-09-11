# CHROMEFALL — Lore + Nội tại + Chiêu cuối (19 nhân vật)

Bản trích xuất gộp: **lore** lấy từ `LORE` trong `js/data.js` (bản đầy đủ ở `docs/characters.md`), **chỉ số / đòn thường / chiêu cuối / nội tại** lấy từ `ROSTER` cùng file. Số liệu là bản nháp cân bằng (★ FAKE) — sửa ở `js/data.js`, không sửa ở đây.

## Đọc bảng thế nào

- **ATK / HP** — sát thương gốc và máu.
- **SPD** — tốc độ: cao hơn thì ra đòn trước trong mỗi round.
- **CRIT** — % chí mạng cơ bản; đòn chí mạng nhân 1.5 sát thương (`RULES.critMult`). Skill và nội tại có thể cộng thêm.
- **Energy** — thanh tích chiêu cuối. Chỉ đòn thường mới nạp Energy; Energy tối đa của ai cũng đúng bằng cost chiêu cuối của người đó, nên "đầy thanh = tung được chiêu".
- **Đòn để đầy** — số đòn thường cần đánh để tung được chiêu cuối (tính từ 0 Energy, chưa tính nội tại cho sẵn Energy).
- **Loại chiêu cuối** — `nuke` đánh một mục tiêu · `aoe` đánh toàn bộ địch · `heal` hồi máu cả đội · `control` chiếm quyền một kẻ địch một lượt.
- **Nội tại** — tự bật khi thoả điều kiện: có đồng đội X trong đội, hoặc sector có kẻ địch X / có địch thuộc phe đó.

## Bảng chỉ số nhanh

| Nhân vật | Phe | Bậc | ATK | HP | SPD | CRIT | Energy | Đòn/Energy | Đòn để đầy |
|---|---|---|---|---|---|---|---|---|---|
| YUKI | Chrome | S | 145 | 950 | 112 | 20% | 100 | +25 | 4 |
| PSALM | Chrome | S | 110 | 1100 | 88 | 5% | 125 | +30 | 5 |
| ASH | Rust | A | 120 | 1000 | 105 | 12% | 75 | +35 | 3 |
| KAI | Rust | B | 95 | 1200 | 96 | 10% (+15) | 100 | +25 | 4 |
| RONIN | Rust | A | 130 | 1050 | 104 | 15% (+10) | 100 | +25 | 4 |
| MUZZLE | Rust | B | 70 | 1750 | 80 | 5% | 125 | +30 | 5 |
| JUNKER | Rust | B | 75 | 1700 | 76 | 5% | 100 | +30 | 4 |
| GRAVEDIGGER | Rust | B | 90 | 1500 | 74 | 8% (+5) | 125 | +25 | 5 |
| STITCH | Rust | S | 140 | 900 | 108 | 15% | 100 | +30 | 4 |
| TOLL | Rust | S | 155 | 850 | 98 | 15% (+10) | 125 | +25 | 5 |
| SPARK | Rust | A | 125 | 950 | 104 | 10% | 75 | +35 | 3 |
| VIXEN | Rust | A | 135 | 900 | 114 | 15% (+10) | 100 | +25 | 4 |
| VESPER | Chrome | S | 150 | 900 | 110 | 15% (+5) | 100 | +25 | 4 |
| NYX | Chrome | S | 140 | 1000 | 106 | 15% | 125 | +30 | 5 |
| HALO | Chrome | A | 115 | 1150 | 92 | 10% (+10) | 100 | +25 | 4 |
| CIPHER | Chrome | A | 125 | 950 | 100 | 10% | 75 | +30 | 3 |
| MERIDIAN | Chrome | B | 85 | 1450 | 78 | 5% | 125 | +25 | 5 |
| ECHO | Chrome | A | 105 | 1000 | 100 | 10% (+5) | 100 | +25 | 4 |
| WIRE | Chrome | B | 80 | 1500 | 90 | 8% | 75 | +30 | 3 |

Số trong ngoặc ở cột CRIT là phần chí mạng đòn thường cộng thêm.

---

# I. CỐT TRUYỆN

## YUKI — Đơn vị 07 · Chromefall
`Chrome · S · sở hữu từ đầu` — ATK 145 · HP 950 · SPD 112 · CRIT 20% · Energy 100

**Là ai.** Kiếm sĩ máy giỏi nhất của Canticle, rơi xuống Khu Đáy với cái Halo gãy. Cô chỉ nhớ tên mình và cách chém.

**Chuyện đã xảy ra.** Sáu năm trước, Tầng Bốn sập. Bố mẹ Yuki chết trong đống bê tông. Ba ngày sau, xe trắng của Canticle xuống Đáy thu gom trẻ mồ côi. Con bé mười một tuổi cầm kiếm của bố ra chặn xe, vừa chặn vừa đọc bài đếm bước của trẻ con Đáy. Người đàn ông đội Halo vàng chỉ vào nó: lấy đứa này. Trên Tháp, họ thay nửa người cô bằng máy, đội cho cô cái Halo, khoá hết ký ức cũ và đặt tên mới: Đơn vị 07. Sáu năm cô làm sát thủ cho họ, không hỏi, không nhớ.

**Bây giờ.** Vài ngày trước Halo lỗi, ký ức bắt đầu rò ra. Canticle lệnh xoá. Người xét xử tên Psalm không xoá, mà cắt vòng của cả hai rồi đẩy cả hai rơi xuống Đáy. Giờ Yuki đi cùng tổ nhặt sắt, nhặt lại từng mảnh ký ức. Cô vẫn đếm một, hai, ba trước khi chém. Đến ba thì thường không còn ai đứng.

> "Một… hai… ba! Ơ. Xong rồi à?"

**Đòn thường** · 100% ATK, +25 Energy. Mục tiêu dưới 30% HP thì đòn mạnh thêm 50%.

**Chiêu cuối — ZERO** · cost 100 · nuke · 320% ATK lên một mục tiêu. Giết được thì hoàn 50 Energy. *(FX riêng: một nhát dọc tím chrome)*

**Nội tại**

| Tên | Điều kiện | Hiệu lực | Lý do |
|---|---|---|---|
| NGƯỜI CANH GÁC | có Psalm trong đội | vào trận sẵn 50 Energy | Psalm từng canh cô sáu năm. |
| NỢ CŨ | sector có địch phe Chrome | +15% sát thương | Canticle nợ cô sáu năm. |
| CÁI TÊN | sector có Cantor | +30% sát thương lên hắn | Người xếp cô lên xe. |

---

## PSALM — Người xét xử
`Chrome · S · thưởng clear 07-C` — ATK 110 · HP 1100 · SPD 88 · CRIT 5% · Energy 125

**Là ai.** Từng ngồi trong buồng xét xử của Canticle, nghe lính máy hỏng kể hết rồi nhấn nút xoá. Ba trăm mười hai lần.

**Chuyện đã xảy ra.** Trên Tháp, lính Choir nào bắt đầu nhớ hay bắt đầu hỏi thì bị coi là hỏng. Họ được đưa tới Psalm. Bà nghe, ghi lại, rồi nhấn nút. Hồ sơ ghi: ba trăm mười hai ca, không sai sót. Ca thứ ba trăm mười ba là một con bé cầm kiếm, mã Đơn vị 07. Nó không kể gì cả. Nó hỏi: bà có đếm không? Psalm ngồi im mười giây. Rồi bà đưa tay lên đầu, giật đứt vòng Halo của chính mình, cắt luôn vòng của con bé, đạp bung sàn ống rác. Hai người cùng rơi.

**Bây giờ.** Halo của bà giờ đỏ và câm, không nhận lệnh của ai nữa. Bà theo Yuki từ xa suốt mấy ngày vì không chắc con bé có muốn giết mình không. Ở hàng rào Canticle, bà bước ra. Bà không xin lỗi ai. Bà nói: tha thứ là thứ Canticle bán, tôi không mua.

> "Xưng tội đi. Đùa thôi. Tôi bỏ nghề rồi."

**Đòn thường** · 100% ATK, +30 Energy.

**Chiêu cuối — APOSTASY** · cost 125 · control · Chiếm quyền điều khiển một kẻ địch trong một lượt: lượt tới nó quay sang đánh đồng bọn.

**Nội tại**

| Tên | Điều kiện | Hiệu lực | Lý do |
|---|---|---|---|
| CA THỨ 313 | có Yuki trong đội | +20% HP | Bà đã bỏ tất cả vì ca này. |
| BIẾT RÕ CHOIR | sector có địch phe Chrome | −15% sát thương phải nhận | Bà thuộc từng đòn của lính Choir. |

---

## ASH — Chị
`Rust · A · sở hữu từ đầu` — ATK 120 · HP 1000 · SPD 105 · CRIT 12% · Energy 75

**Là ai.** Kiếm sĩ của tổ nhặt sắt, lưỡi kiếm tẩm axit xanh. Nhìn cái gì cô cũng thấy giá tiền trước, rồi mới thấy nó là gì.

**Chuyện đã xảy ra.** Ash và Kai là chị em sinh đôi. Bố mẹ hai đứa chết trong vụ sập Tầng Bốn sáu năm trước. Ash mười ba tuổi, kéo em trai trốn ba ngày trong ống nước để tránh xe thu gom của Canticle. Ra khỏi ống, cô học kiếm ở xưởng tháo dỡ, mua axit ở bãi hoá chất để tẩm lưỡi, và nhận mọi việc có tiền. Ronin nhận hai chị em vào tổ vì một điều: Ash chưa bao giờ bán đồng đội, dù cô định giá được tất cả.

**Bây giờ.** Đêm nhặt được Yuki, chính Ash nói: tháo Halo, bán. Kai cản. Cô im, không phải vì chịu thua, mà vì cô biết một lính máy hạng S còn sống đáng giá hơn một cái vòng gãy. Cô vẫn nói sẽ bán Yuki. Chưa ai thấy cô làm.

> "Đừng chết trước khi tôi kịp bán cô."

**Đòn thường** · 100% ATK, +35 Energy. Lưỡi axit để lại độc: mục tiêu mất thêm 20% ATK của Ash đầu mỗi lượt, trong 2 lượt.

**Chiêu cuối — FLASHOVER** · cost 75 · aoe · Lưới mìn gài sẵn dưới chân địch. Ash bật lửa, cả bãi nổ một lượt: 150% ATK lên toàn bộ kẻ địch, rồi cháy thêm 2 lượt (20% ATK mỗi lượt). *(theo video ult; sprite trong trận vẫn là kiếm)*

**Nội tại**

| Tên | Điều kiện | Hiệu lực | Lý do |
|---|---|---|---|
| CHỊ EM | có Kai trong đội | +10% ATK | Hai chị em đánh cùng nhịp từ nhỏ. |
| ĐỊNH GIÁ | sector có địch phe Rust | +10% sát thương | Cô biết từng băng ở Đáy đáng giá bao nhiêu. |
| TẦNG BỐN | sector có Cantor | +20% sát thương lên hắn | Bố mẹ cô cũng ở Tầng Bốn. |

---

## KAI — Em
`Rust · B · sở hữu từ đầu` — ATK 95 · HP 1200 · SPD 96 · CRIT 10% · Energy 100

*(Hồ sơ dạng **lá thư** — `form:'letter'` trong `LORE`.)*

**Là ai.** Em trai sinh đôi của Ash, cùng kiểu kiếm, cùng cái áo. Cậu kể mọi chuyện to gấp ba sự thật — cố ý — vì ở Đáy, chuyện được kể lại mới là chuyện có thật.

**Thư đêm nay.** Gửi ai đó sẽ nhớ tôi.
Tôi lớn lên trong ống nước và trại trẻ Khu Đáy. Ở đó một đứa biến mất thì một tuần sau không ai nhắc tên nó nữa. Bị quên là chết lần thứ hai.
Nên tôi kể to gấp ba. Không phải để oai. Chuyện nhỏ thì người ta quên trong một đêm; chuyện to thì họ kể lại, mà kể lại là còn sống. Tôi cũng ký tên lên mọi bức tường đi qua. Nếu còn đứa nào ở trại trẻ ngày đó chưa chết, nó sẽ thấy tên tôi và biết tìm tôi ở đâu.
Ký: Kai. K, A, I.

**Tái bút.** Tối nay tôi cản chị. Chị định tháo cái vòng của con máy rơi xuống Bãi Rơi đem bán. Tôi gọi nó bằng tên trước: Yuki. Gọi tên rồi thì khó bán hơn.
Từ hôm nay tôi viết cả tổ vào đây. Ronin. Muzzle. Chị. Yuki. Ai đọc được thư này thì nhớ giùm bốn cái tên. Tên tôi thì tôi tự lo, tường ngoài kia đầy rồi.

> "Ghi lại nhé: Kai. K, A, I. Sau này người ta viết cho đúng."

**Đòn thường** · 100% ATK, +25 Energy, thêm 15% tỉ lệ chí mạng.

**Chiêu cuối — RIPCORD** · cost 100 · nuke · Súng điện từ to hơn người. Kai ngắm kỹ rồi bắn một phát xuyên thẳng: 240% ATK lên một mục tiêu. Trúng là choáng, mất lượt kế tiếp (boss miễn choáng). *(theo video ult; sprite trong trận vẫn là kiếm)*

**Nội tại**

| Tên | Điều kiện | Hiệu lực | Lý do |
|---|---|---|---|
| CHỊ EM | có Ash trong đội | +15% HP | Có chị đứng cạnh thì cậu lì hơn. |
| FAN SỐ MỘT | có Yuki trong đội | +10% ATK | Cậu muốn Yuki thấy mình đánh. |
| CHÓ MÁY | sector có Chrome Hound | +40% sát thương lên nó | Chuyện cậu hạ chó máy bằng tay không là bịa — lần này cậu muốn nó thành thật. |

---

# II. TỔ NHẶT SẮT (RUST)

## RONIN — Trưởng tổ
`Rust · A · gacha (NPC trong comic chương 1)` — ATK 130 · HP 1050 · SPD 104 · CRIT 15% · Energy 100

**Là ai.** Trưởng tổ nhặt sắt ở Khu Đáy. Không cấy ghép, không máy móc, một thanh kiếm thép và một luật: không tháo người.

**Chuyện đã xảy ra.** Chị của Ronin được Canticle "tuyển" lên Tháp năm anh mười sáu tuổi. Chị để lại thanh kiếm và một câu dặn: đừng bán thứ gì còn ấm. Rồi không về. Ronin lập tổ nhặt sắt với luật duy nhất đó. Vì luật ấy mà tổ nghèo hơn mọi băng khác, và cũng vì luật ấy mà ai nhặt được người, được máy còn thở, đều mang tới chỗ anh.

**Bây giờ.** Anh không tin lính máy của Tháp, nhưng cho Yuki thử việc. Anh giao việc, không hỏi thêm, và là người quyết định cả tổ có leo lên Tháp hay không. Anh chưa nói. Anh đang mài kiếm.

> "Việc xong thì về. Chưa xong thì đừng về."

**Đòn thường** · 100% ATK, +25 Energy, thêm 10% tỉ lệ chí mạng.

**Chiêu cuối — IAIDO** · cost 100 · nuke · Ronin không né. Anh bước tới một bước, vào đúng đường đòn đang tới, rồi chém xuống một nhát: 280% ATK lên một mục tiêu. ★ FAKE

**Nội tại**

| Tên | Điều kiện | Hiệu lực | Lý do |
|---|---|---|---|
| TỔ TRƯỞNG | có Ash **hoặc** Kai trong đội | +10% ATK | Có người của tổ bên cạnh, anh chém chắc tay hơn. |
| KHÔNG THÁO NGƯỜI | sector có Foreman | +20% sát thương lên lão | Foreman tháo người bán từng bộ phận. |

---

## MUZZLE — Cửa xe
`Rust · B · gacha (NPC trong comic chương 1)` — ATK 70 · HP 1750 · SPD 80 · CRIT 5% · Energy 125

**Là ai.** Gác cổng cho Canticle mười bốn năm không sót ca nào. Bị đuổi vì bước ra khỏi chốt đúng một lần.

**Chuyện đã xảy ra.** Ca đêm ở cổng vành đai, một đứa nhỏ Khu Đáy chui qua khe cổng nhặt thuốc rơi. Lính Enforcer giương súng. Gã gác cổng to như cái tủ, mười bốn năm chưa rời vị trí, lần này bước ra đứng vào giữa. Súng hạ xuống. Sáng hôm sau biên bản ghi: hành vi ngoài chỉ thị, chấm dứt hợp đồng. Muzzle đi bộ xuống Đáy với bộ giáp cũ và một cánh cửa xe hơi làm khiên.

**Bây giờ.** Ở tổ Ronin, anh đứng trước mọi người. Anh đặt tên cho từng cánh cửa theo thứ tự: cánh đang dùng là Bà Ba. Hỏi anh sợ chết không, anh cười: chết trước tổ thì được, chết sau tổ thì không.

> "Bà Ba chịu được ba đòn. Đòn thứ tư là phần của tôi."

**Đòn thường** · 100% ATK, +30 Energy.

**Chiêu cuối — FIELD PATCH** · cost 125 · heal · Muzzle đóng cánh cửa xe xuống nền, cả tổ lùi về sau lưng anh. Trong vòm bụi đó giáp rách được vá, người ngã đứng dậy: hồi 120% ATK cho cả đội. ★ FAKE

**Nội tại**

| Tên | Điều kiện | Hiệu lực | Lý do |
|---|---|---|---|
| SẸO | có Ash trong đội | −15% sát thương phải nhận | Ash luôn đứng dậy trước khi anh ngã. |
| CÁNH THỨ TƯ | có Meridian trong đội | +20% HP | Giao kèo: ai ngã trước thì người kia đặt tên khiên. Cánh đang dùng là Bà Ba, cánh thứ tư sẽ mang tên bà. |
| CỔNG CŨ | sector có Enforcer | +25% sát thương lên chúng | Anh gác cạnh bọn Enforcer mười bốn năm, biết giáp chúng hở ở đâu. |

---

## JUNKER — Xe vẫn chạy
`Rust · B · gacha · chưa có art` — ATK 75 · HP 1700 · SPD 76 · CRIT 5% · Energy 100

**Là ai.** Mất nửa người dưới trong vụ sập Tầng Bốn, được hàn vào chính chiếc xe kéo của mình. Hỏi gì anh cũng chỉ nói ba chữ.

**Chuyện đã xảy ra.** Tầng Bốn sập lúc ba giờ chiều. Junker đang lái chuyến hàng thứ ba trong ngày. Cabin bị ép giữa hai tấm sàn, đội cứu hộ tự phát kéo anh ra sau mười một tiếng, nửa dưới cơ thể để lại trong đó. Bác sĩ Stitch không có bộ phận thay thế. Bà có chiếc xe. Bà hàn phần còn lại của anh vào khung gầm, nối dây thần kinh vào tay lái, bảo anh đạp ga thử. Xe chạy.

**Bây giờ.** Anh chở hàng, chở người bị thương, chở cả cửa xe vỡ của Muzzle về chôn. Một ngày nói chưa tới mười chữ. Chưa từ chối chuyến nào, kể cả chuyến lên Tháp.

> "Lên. Tôi chở."

**Đòn thường** · 100% ATK, +30 Energy.

**Chiêu cuối — FULL LOAD** · cost 100 · nuke · Junker đạp ga, quay khung xe và đổ nguyên chuyến hàng xuống đầu một mục tiêu: 260% ATK. FX nổ. ★ FAKE

**Nội tại**

| Tên | Điều kiện | Hiệu lực | Lý do |
|---|---|---|---|
| MỐI HÀN | có Stitch trong đội | +20% HP | Stitch hàn anh vào xe. |
| TẦNG BỐN | sector có Cantor | +20% sát thương lên hắn | Nửa người anh còn nằm ở Tầng Bốn. |

---

## GRAVEDIGGER — Người giữ nghĩa địa
`Rust · B · gacha · chưa có art` — ATK 90 · HP 1500 · SPD 74 · CRIT 8% · Energy 125

**Là ai.** Hơn hai nghìn tấm thép khắc tên sau lò đúc. Ông nhớ từng tấm, và ông chôn cho cả người lẫn máy.

**Chuyện đã xảy ra.** Khu Đáy không có nghĩa trang. Rồi một ông già từ tầng trên xuống, không nói tầng nào, mang theo cái xẻng và một thói quen lạ: đào hố sâu hai thước, đặt tấm thép, khắc tên. Không biết tên thì khắc ngày và ba chữ: từng ở đây. Sau vụ sập Tầng Bốn, ông khắc bốn nghìn tấm. Khắc suốt một năm.

**Bây giờ.** Ông vào tổ sau lần suýt chôn nhầm Kai. Thằng nhóc nằm dưới hố, bất tỉnh, còn thở. Ông kéo nó lên, xin lỗi vì đào nhanh quá. Ông đánh chậm, chắc, y như đào. Ai hỏi sao chôn cả lính máy, ông bảo: đất không hỏi phe.

> "Đất không hỏi phe."

**Đòn thường** · 100% ATK, +25 Energy, thêm 5% tỉ lệ chí mạng.

**Chiêu cuối — LAST RITES** · cost 125 · nuke · Ông đào chậm, đánh cũng chậm: một nhát xẻng bổ xuống, 300% ATK lên một mục tiêu. Xong việc ông khắc tên nó lên một tấm thép. ★ FAKE

**Nội tại**

| Tên | Điều kiện | Hiệu lực | Lý do |
|---|---|---|---|
| HỐ ĐÀO NHANH | có Kai trong đội | −12% sát thương phải nhận | Ông suýt chôn nhầm Kai, nên giờ ông đứng gần cậu. |
| TẤM THÉP | sector có Foreman | +15% sát thương lên lão | Nửa số tấm thép sau lò là do Foreman. |

---

## STITCH — Bác sĩ của Đáy
`Rust · S · gacha` — ATK 140 · HP 900 · SPD 108 · CRIT 15% · Energy 100

**Là ai.** Mất giấy phép vì vá cho một lính máy đào ngũ. Giờ bà vá cả người lẫn máy trong một cái container, ai trả gì cũng nhận.

**Chuyện đã xảy ra.** Một đêm ở bệnh viện tầng trên, một lính Choir gãy Halo bò vào phòng cấp cứu. Quy trình bắt phải báo Canticle ngay. Bác sĩ trực tên Stitch vá cho nó xong, rồi mở cửa sau. Sáng hôm sau, giấy phép bị thu, tên bị xoá khỏi danh bạ. Bà xuống Đáy với bộ tay phẫu thuật nhiều khớp, mở phòng khám trong container cạnh bãi xe.

**Bây giờ.** Bệnh nhân trả bằng bất cứ thứ gì, hoặc kể một câu chuyện. Bà ghi hết vào sổ, không ai được đọc. Bà là người hàn Junker vào xe, và là người duy nhất Psalm cho phép chạm vào cái Halo đỏ. Mỗi lần mất một bệnh nhân, bà khâu thêm một mũi lên tay áo.

> "Nằm yên. Tôi khâu người còn khéo hơn khâu máy."

**Đòn thường** · 100% ATK, +30 Energy.

**Chiêu cuối — SUTURE** · cost 100 · heal · Bốn cánh tay phẫu thuật bung ra, bốn cây kim cong, bốn sợi chỉ bắn đi bốn hướng. Chỉ thắt lại một cái, vết thương cả tổ đóng miệng cùng lúc: hồi 150% ATK cho cả đội. ★ FAKE

**Nội tại**

| Tên | Điều kiện | Hiệu lực | Lý do |
|---|---|---|---|
| MỐI HÀN | có Junker trong đội | +10% ATK | Bà hàn Junker vào xe. |
| TAY ÁO | sector có địch phe Rust | −10% sát thương phải nhận | Tay áo khâu dày như giáp. |

---

## TOLL — Người thu nợ
`Rust · S · gacha · chưa có art` — ATK 155 · HP 850 · SPD 98 · CRIT 15% · Energy 125

**Là ai.** Bốn nghìn cái tên trong một cuốn sổ. Ông đi đòi Canticle trả từng tên một, có hoá đơn hẳn hoi.

**Chuyện đã xảy ra.** Đêm Tầng Bốn sập, Toll trực trên cầu trục bốc hàng, đủ cao để nhìn thấy ba tổ kỹ thuật của Canticle cắt trụ đỡ đúng lịch, để thử tải cho phần móng mới của Tháp. Bốn nghìn người ở dưới. Ông ở trên. Không làm được gì. Ông chép tên từng người vào sổ theo thứ tự nhà, rồi bắt đầu đi đòi: mỗi lính Enforcer một dòng, mỗi dòng một tờ hoá đơn để lại tại chỗ.

**Bây giờ.** Canticle treo giá cái đầu ông. Ông ghi luôn khoản đó vào sổ, coi như nợ mới. Toll lễ phép với tất cả, kể cả người ông sắp giết. Trong sổ, Yuki và Psalm là tài sản bị chiếm đoạt, tức là cũng bị hại. Điều kiện duy nhất khi vào tổ: ngày lên tới Tháp, ông là người gõ cửa.

> "Xin lỗi đã làm phiền. Tôi tới vì khoản nợ ngày mười bảy."

**Đòn thường** · 100% ATK, +25 Energy, thêm 10% tỉ lệ chí mạng.

**Chiêu cuối — PAID IN FULL** · cost 125 · nuke · Toll đọc to dòng nợ trong sổ, đặt tờ hoá đơn xuống chân nó, rồi kết sổ một lần cho xong: 360% ATK lên một mục tiêu (hệ số cao nhất trong roster). ★ FAKE

**Nội tại**

| Tên | Điều kiện | Hiệu lực | Lý do |
|---|---|---|---|
| CÙNG SỔ | có Spark trong đội | +10% ATK | Spark cũng có tên trong sổ của ông. |
| NGÀY MƯỜI BẢY | sector có Cantor | +30% sát thương lên hắn | Bốn nghìn dòng trong sổ, một cái tên ở đầu. |

---

## SPARK — Đứa cắt dây Tháp
`Rust · A · gacha · chưa có art` — ATK 125 · HP 950 · SPD 104 · CRIT 10% · Energy 75

**Là ai.** Sáu tháng lớn lên trong bóng tối. Giờ cô thắp đèn cho cả tầng bằng điện câu trộm từ Tháp, và mang tụ điện đi đánh nhau.

**Chuyện đã xảy ra.** Sau vụ sập Tầng Bốn, Canticle cắt điện cả khu của Spark sáu tháng, gọi là cách ly kỹ thuật. Năm ấy cô mười một tuổi, đếm ngày bằng bữa ăn, học nối dây bằng tay trong bóng tối. Lúc đèn sáng trở lại, cô đã thuộc lòng đường điện cả khu và biết nó chạy từ đâu xuống.

**Bây giờ.** Cô câu điện thẳng từ trụ Tháp, chia cho từng hành lang, đổi tuyến mỗi khi bị dò ra. Trên lưng là dàn tụ điện tự chế; bị chặn đường thì cô phóng điện. Cô nói nhanh, cười to, gặp ai một phút là đặt biệt danh. Yuki là Đèn Tuýp. Psalm là Cầu Chì.

> "Đèn Tuýp, lùi lại. Cái này sáng lắm đấy."

**Đòn thường** · 100% ATK, +35 Energy.

**Chiêu cuối — ARC FLASH** · cost 75 · aoe · Spark xả cả dàn tụ trên lưng xuống nền: hồ quang chạy khắp sân, 140% ATK lên toàn bộ kẻ địch. FX điện giật. ★ FAKE

**Nội tại**

| Tên | Điều kiện | Hiệu lực | Lý do |
|---|---|---|---|
| CÙNG SỔ | có Toll trong đội | +15% HP | Có ông Toll che thì cô nối dây yên tâm hơn. |
| CẮT DÂY | sector có địch phe Chrome | +12% sát thương | Điện của Tháp cô câu được thì lính của Tháp cô cũng giật được. |

---

## VIXEN — Kẻ mượn lính
`Rust · A · gacha · chưa có art` — ATK 135 · HP 900 · SPD 114 · CRIT 15% · Energy 100

**Là ai.** Mười một lính Choir bị cô "mượn" khỏi tay Canticle. Không con nào bị bán. Con nào cũng được đặt tên rồi thả đi.

**Chuyện đã xảy ra.** Hồ sơ Canticle ghi Vixen là tội phạm trộm tài sản, mười một vụ. Không vụ nào có hàng xuất hiện ở chợ đen. Cô đưa lính máy ra khỏi hàng rào, tháo Halo bằng đồ nghề mua của Wire, dạy chúng một cái tên, rồi thả. Cô gọi đó là trả hàng về đúng chủ.

**Bây giờ.** Cô nói dối gần như mọi chuyện: tuổi, quê, lý do xuống Đáy. Nhưng có ba thứ cô không bao giờ nói dối: đường thoát, chỗ đặt mìn, và ai sẽ chết nếu kế hoạch hỏng. Ronin nhận cô vào tổ vì phân biệt được hai loại ấy.

> "Tôi nói dối đấy. Nhưng cửa bên trái là thật. Đi."

**Đòn thường** · 100% ATK, +25 Energy, thêm 10% tỉ lệ chí mạng.

**Chiêu cuối — HEIST** · cost 100 · control · Vixen tháo cái vòng bằng bộ đồ nghề mua của Wire và mượn tạm một kẻ địch: một lượt nó quay sang đánh đồng bọn. ★ FAKE

**Nội tại**

| Tên | Điều kiện | Hiệu lực | Lý do |
|---|---|---|---|
| ĐỒ NGHỀ | có Wire trong đội | vào trận sẵn 25 Energy | Bộ đồ nghề tháo Halo cô mua của Wire. |
| MƯỢN LÍNH | sector có địch phe Chrome | +10% sát thương | Mười một lần cô mượn lính của Canticle. |

Nhanh nhất roster (SPD 114).

---

# III. NGƯỜI CỦA THÁP (CHROME)

## VESPER — Em cùng lô
`Chrome · S · gacha (rate-up) · chưa có art` — ATK 150 · HP 900 · SPD 110 · CRIT 15% · Energy 100

**Là ai.** Ra lò cùng ngày, cùng lô với Yuki. Khi Yuki rơi, Canticle giao vị trí của chị cho em. Và em làm tốt hơn.

**Chuyện đã xảy ra.** Trong Choir, mỗi lính giữ một vị trí trong đội hình. Ngày Đơn vị 07 rơi, vị trí của cô được chuyển cho Vesper. Kỹ thuật viên ghi nhận: bản mới ổn định hơn bản gốc. Halo của Vesper chưa từng trễ lệnh một giây. Cô tin cái vòng là thứ giữ cho Choir không tan rã, và ngoài nó chỉ có im lặng.

**Bây giờ.** Canticle cử cô xuống tìm Yuki. Cô hỏi han đối thủ vài câu trước khi ra tay, thật lòng, và không thấy có gì lạ trong chuyện đó. Cô gọi Yuki là chị. Cô chưa từng thấy chị mình chém mà không có lệnh.

> "Chị ơi, về đi. Ngoài này lạnh lắm."

**Đòn thường** · 100% ATK, +25 Energy, thêm 5% tỉ lệ chí mạng.

**Chiêu cuối — EVENSONG** · cost 100 · aoe · Vesper vào đúng vị trí Canticle lấy của chị mình, rồi ra đòn theo nhịp Halo, không sớm không muộn một giây: 180% ATK lên toàn bộ kẻ địch. ★ FAKE

**Nội tại**

| Tên | Điều kiện | Hiệu lực | Lý do |
|---|---|---|---|
| CHỊ | có Yuki trong đội | +15% ATK | Cô ra lò cùng lô với Yuki. |
| SÀN SẠCH | sector có địch phe Rust | −10% sát thương phải nhận | Bọn Đáy đánh bẩn, cô đã học cách né. |

Là nhân vật rate-up của bể gacha (`GACHA.featured`): 50% số lần ra bậc S sẽ là cô.

---

## NYX — Nguyên mẫu không Halo
`Chrome · S · gacha · chưa có art` — ATK 140 · HP 1000 · SPD 106 · CRIT 15% · Energy 125

**Là ai.** Canticle tạo ra cô để trả lời một câu hỏi, rồi nhốt cô bốn năm vì không chịu nổi câu trả lời.

**Chuyện đã xảy ra.** Câu hỏi của dự án: lính Choir không đội Halo thì làm gì? Canticle chuẩn bị hai đáp án: nó nổi loạn, hoặc nó vô dụng. Nyx không làm cả hai. Cô hỏi. Hỏi tên người gác. Hỏi sao sàn phải sạch. Hỏi tại sao ai cũng khóc khi vòng của họ bị tắt. Dự án bị đóng. Nyx bị nhốt dưới hầm cùng toàn bộ hồ sơ. Bốn năm trong hầm, cô đọc hết.

**Bây giờ.** Cô hiểu lời nói theo nghĩa đen: bảo giữ vị trí, cô ôm chặt cây cột gần nhất. Nhưng vào trận, cô là thứ Canticle không xử lý được: một lính chọn mục tiêu vì lý do của riêng mình.

> "Sao lại giữ vị trí? Nó có rơi không?"

**Đòn thường** · 100% ATK, +30 Energy.

**Chiêu cuối — BLACKOUT** · cost 125 · nuke · Bốn năm dưới hầm dạy Nyx nhìn trong tối. Cô tắt hết đèn quanh một mục tiêu rồi mới ra đòn: 340% ATK lên một mục tiêu. ★ FAKE

**Nội tại**

| Tên | Điều kiện | Hiệu lực | Lý do |
|---|---|---|---|
| CHỌN LẠI | có Ronin trong đội | +10% ATK | Ronin dạy cô: hôm nay chọn, mai chọn lại. |
| KHÔNG HALO | sector có địch phe Chrome | +15% sát thương | Lính Choir không biết xử lý một lính không đội vòng. |

---

## HALO — Y tá của Choir
`Chrome · A · gacha · chưa có art` — ATK 115 · HP 1150 · SPD 92 · CRIT 10% · Energy 100

**Là ai.** Lính máy duy nhất được Canticle cho phép cảm thấy đau, vì đau là cách chẩn bệnh. Bảy năm, hàng nghìn vết thương, không cái nào của cô.

**Chuyện đã xảy ra.** Choir cần cách sửa lính hỏng mà không phải tháo rời. Canticle làm ra cô: chạm vào là biết đau ở đâu. Bảy năm, cô mang trong người bản sao của hàng nghìn vết thương. Cho tới ngày cô chữa cho một lính vừa ra khỏi buồng xét xử, và thấy một vết thương không nằm trên thân máy. Cô bỏ đi, bị bắt lại, bị xích vào lò đúc Halo.

**Bây giờ.** Cô chữa cho bất kỳ ai còn thở, kể cả kẻ vừa bắn mình. Ash bảo thế là ngu. Cô bảo: tôi biết chính xác họ đau ở đâu, tôi không thể không biết.

> "Đứng yên. Tôi thấy chỗ đó rồi."

**Đòn thường** · 100% ATK, +25 Energy, thêm 10% tỉ lệ chí mạng.

**Chiêu cuối — WARD ROUND** · cost 100 · heal · Halo đi một vòng, chạm vào từng người là biết ngay ai đau chỗ nào, nên vá đúng chỗ đó: hồi 140% ATK cho cả đội. ★ FAKE

**Nội tại**

| Tên | Điều kiện | Hiệu lực | Lý do |
|---|---|---|---|
| ỐC VÍT | có Wire trong đội | +15% HP | Wire là người duy nhất hỏi cô có đau không. |
| BIẾT ĐAU | sector có địch phe Chrome | −10% sát thương phải nhận | Cô biết lính Choir sẽ đánh vào đâu trước khi chúng đánh. |

---

## CIPHER — Kẻ làm cả khoá lẫn chìa
`Chrome · A · gacha · chưa có art` — ATK 125 · HP 950 · SPD 100 · CRIT 10% · Energy 75

**Là ai.** Ban ngày viết phần mềm Halo cho Canticle. Ban đêm viết cách mở nó, bán xuống Đáy. Anh gọi đó là cân bằng thị trường.

**Chuyện đã xảy ra.** Cipher là người thường, không Halo, một trong bốn kỹ sư được đọc toàn bộ mã của Halo. Anh biết thứ mà gần như không ai còn nhớ: Halo vốn chỉ là bộ lọc, làm ra để lính mới ráp khỏi điếc vì tiếng ồn. Đoạn biến nó thành dây cương được ghép thêm vào sau, và anh biết chính xác chỗ nó nằm. Lệnh xoá mà Canticle kích hoạt khi một lính tự tách khỏi hệ thống là do anh viết. Trong đó anh cố tình chừa một khoảng trống ba giây, đủ để một lính làm được một việc trước khi bị khoá. Anh không biết ai sẽ dùng. Người đó là Psalm.

**Bây giờ.** Anh chưa bao giờ kể với bà. Khi Canticle bắt đầu rà soát bốn kỹ sư, anh xuống Đáy, mang theo đúng một thứ: máy pha cà phê của phòng nghỉ tập đoàn.

> "Cái gì tôi cũng có cửa sau. Trừ tủ lạnh của Ash."

**Đòn thường** · 100% ATK, +30 Energy.

**Chiêu cuối — ROOT ACCESS** · cost 75 · control · Phần mềm trong cái vòng đó do Cipher viết nên anh có quyền cao nhất: chiếm điều khiển một kẻ địch trong một lượt, lượt tới nó quay sang đánh đồng bọn. ★ FAKE

**Nội tại**

| Tên | Điều kiện | Hiệu lực | Lý do |
|---|---|---|---|
| BA GIÂY | có Psalm trong đội | vào trận sẵn 25 Energy | Khoảng trống ba giây anh chừa trong mã là cho bà. |
| MÃ NGUỒN | sector có địch phe Chrome | +10% sát thương | Anh viết phần mềm trong đầu chúng. |

Chiêu control rẻ nhất game (75 Energy, 3 đòn thường là đầy).

---

## MERIDIAN — Hết hạn sử dụng
`Chrome · B · gacha · chưa có art` — ATK 85 · HP 1450 · SPD 78 · CRIT 5% · Energy 125

**Là ai.** Được chế tạo để tự tắt sau mười năm. Còn vài trăm giờ, cô dùng từng giờ để che cho những ai nhỏ hơn mình. Tức là tất cả.

**Chuyện đã xảy ra.** Dòng lính hậu cần của Canticle có hạn dùng cố định: chạy mười năm rồi tự ngắt, khỏi tốn tiền bảo trì. Meridian thuộc lô cuối. Kéo hàng, dựng tường, mười năm chưa từng được giao một trận. Wire tìm thấy cô ở bãi tái chế, đang ngồi đếm to số giờ còn lại, và tháo bộ đếm ra khỏi ngực cô.

**Bây giờ.** Cô vẫn đếm bằng miệng. Cô đứng chắn trước bất kỳ ai nhỏ hơn mình và gọi cả tổ là con. Cô không sợ tắt. Cô chỉ sợ tắt đúng lúc không ai cần.

> "Còn bốn trăm linh chín giờ. Đủ cho trận này. Đứng sau mẹ."

**Đòn thường** · 100% ATK, +25 Energy.

**Chiêu cuối — LAST SHIFT** · cost 125 · heal · Bộ đếm đã tháo khỏi ngực nhưng Meridian vẫn đếm bằng miệng. Cô đứng thêm một ca nữa thay cả tổ: hồi 100% ATK cho mọi người. ★ FAKE

**Nội tại**

| Tên | Điều kiện | Hiệu lực | Lý do |
|---|---|---|---|
| CÁNH THỨ TƯ | có Muzzle trong đội | −15% sát thương phải nhận | Bà và Muzzle thay nhau đứng trước, và cánh cửa xe thứ tư sẽ mang tên bà. |
| TƯỜNG | sector có Foreman | −15% sát thương phải nhận | Bà từng dựng tường cho chính cái lò này. |

---

## ECHO — Giọng sao chép
`Chrome · A · gacha` — ATK 105 · HP 1000 · SPD 100 · CRIT 10% · Energy 100

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

**Đòn thường** · 100% ATK, +25 Energy, thêm 5% tỉ lệ chí mạng.

**Chiêu cuối — PLAYBACK** · cost 100 · nuke · Echo bóc niêm phong ở cổ, mở lại cái loa cô tự cắt và nói đúng hai chữ bằng giọng đi mượn: 250% ATK lên một mục tiêu. Nói xong cô lấy tay bịt loa lại. FX điện giật. ★ FAKE

**Nội tại**

| Tên | Điều kiện | Hiệu lực | Lý do |
|---|---|---|---|
| MỘT CÂU | có Yuki trong đội | +10% ATK | Cô đang tìm một câu Yuki chưa nói. |
| CẮT LOA | sector có địch phe Chrome | +10% sát thương | Cô biết Choir nghe gì. |

---

## WIRE — Thợ lắp Halo bỏ trốn
`Chrome · B · gacha` — ATK 80 · HP 1500 · SPD 90 · CRIT 8% · Energy 75

**Là ai.** Tám năm lắp Halo cho Canticle, chín trăm cái, nhớ từng số lô. Giờ cô đi tháo từng cái mình đã lắp.

**Chuyện đã xảy ra.** Đêm cô bỏ đi chẳng có gì gay cấn. Một lính vừa bị xoá được chở về xưởng để tháo vòng, nhật ký của nó còn mở trên màn hình. Dòng cuối ghi: xin đừng tắt đèn. Wire đọc dòng đó ba lần, đóng nhật ký, cầm đồ nghề và hai hộp ốc vít, đi thang máy hàng xuống Đáy.

**Bây giờ.** Cô tháo Halo cho những lính Vixen mang ra, hàn lại vòng gãy của Yuki đủ để không rò điện. Riêng vòng đỏ của Psalm thì bị cấm chạm vào, vì Wire sẽ muốn sửa, mà Psalm muốn nó cứ hỏng. Cô nói chuyện với máy nhiều hơn với người, và xin lỗi cả hai như nhau.

> "Ngoan nào. Đừng rò điện."

**Đòn thường** · 100% ATK, +30 Energy.

**Chiêu cuối — OVERCLOCK** · cost 75 · nuke · Wire với tay bắt lấy dòng điện trong Halo của mục tiêu rồi vặn quá ngưỡng: 220% ATK. Cái vòng quay nhanh dần cho tới lúc nướng chín thứ nó đang đội. FX điện giật. ★ FAKE

**Nội tại**

| Tên | Điều kiện | Hiệu lực | Lý do |
|---|---|---|---|
| ỐC VÍT | có Halo trong đội | +10% ATK | Cô lắp cái vòng trên đầu Halo. |
| SỐ LÔ | sector có địch phe Chrome | +8% sát thương | Cô nhớ số lô từng cái Halo mình lắp, và chỗ nào vặn lỏng. |

---

# Phụ lục A — Nội tại theo cặp

Ai đi với ai thì bật nội tại. Dùng để xếp đội 3 người.

| Cặp | Ai được gì |
|---|---|
| Yuki ↔ Psalm | Yuki: vào trận 50 Energy · Psalm: +20% HP |
| Yuki → Kai | Kai +10% ATK |
| Yuki → Echo | Echo +10% ATK |
| Yuki → Vesper | Vesper +15% ATK |
| Ash ↔ Kai | Ash +10% ATK · Kai +15% HP |
| Ash → Muzzle | Muzzle −15% sát thương nhận |
| Ash / Kai → Ronin | Ronin +10% ATK (chỉ cần một trong hai) |
| Kai → Gravedigger | Gravedigger −12% sát thương nhận |
| Muzzle ↔ Meridian | Muzzle +20% HP · Meridian −15% sát thương nhận |
| Stitch ↔ Junker | Stitch +10% ATK · Junker +20% HP |
| Toll ↔ Spark | Toll +10% ATK · Spark +15% HP |
| Wire ↔ Halo | Wire +10% ATK · Halo +15% HP |
| Wire → Vixen | Vixen vào trận 25 Energy |
| Psalm → Cipher | Cipher vào trận 25 Energy |
| Ronin → Nyx | Nyx +10% ATK |

# Phụ lục B — Nội tại theo kẻ địch

| Kẻ địch | Ai khắc chế |
|---|---|
| Cantor (boss cuối chương 1) | Yuki +30% · Toll +30% · Ash +20% · Junker +20% sát thương |
| Foreman (boss) | Ronin +20% · Gravedigger +15% sát thương · Meridian −15% sát thương nhận |
| Enforcer (elite) | Muzzle +25% sát thương |
| Chrome Hound (elite) | Kai +40% sát thương |
| Địch phe **Chrome** | Yuki +15% · Nyx +15% · Spark +12% · Cipher/Echo/Vixen +10% · Wire +8% sát thương; Psalm −15% · Halo −10% sát thương nhận |
| Địch phe **Rust** | Ash +10% sát thương; Stitch −10% · Vesper −10% sát thương nhận |

# Phụ lục C — Chiêu cuối của kẻ địch

Hai con trong chương 1 có chiêu cuối. Cách hoạt động: đầu mỗi lượt của nó cộng 25 Energy (`RULES.foeUltGain`), đủ cost là tung chiêu ngay lượt đó thay cho đòn thường. Thanh Energy và nhãn READY hiện trên bảng của nó để người chơi kịp dồn đòn giết trước.

| Kẻ địch | Chiêu cuối | Cost | Tác dụng |
|---|---|---|---|
| GLASS JAW (grunt) | ELECTRIC DRAGON PUNCH | 50 (2 lượt) | Cú đấm điện hình đầu rồng: **đúng 200 sát thương** lên một người trong đội bạn — số cố định, không nhân ATK, không chí mạng, không đổi theo độ khó sector. |
| KILN (elite) | FIRE STORM | 75 (3 lượt) | Bão lửa quấn quanh mình: dựng lá chắn hút sát thương bằng **100% HP tối đa** của Kiln, không có hạn lượt, đánh vỡ mới thôi. |

Boss miễn nhiễm choáng (stun) — nên RIPCORD của Kai chỉ choáng được grunt và elite.
