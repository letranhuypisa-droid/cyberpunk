# CHROMEFALL — Cốt truyện & thiết kế màn (v0.3)

> Bản chạy trong game: `js/data.js` (sector, số liệu, lore) và `js/story.js` (trang comic). Chương 2–3 mới có dàn ý.
> Mọi số liệu cân bằng là bản nháp, đánh dấu ★.

---

## 1. Thế giới — sáu thuật ngữ, mỗi cái giải thích ngay lần đầu xuất hiện

- **HALCYON**: thành phố xây thẳng đứng. **Tháp** ở trên: sạch, sáng, tập đoàn ở. **Khu Đáy** ở dưới: rác, nước thải và đồ hỏng từ Tháp rơi xuống; dân sống bằng nhặt và hàn phế liệu.
- **CANTICLE**: tập đoàn cai trị Tháp. Chế tạo lính máy gọi là **CHOIR**.
- **HALO**: vòng đội trên đầu mỗi lính Choir. Ban đầu nó là **bộ lọc**. Lính vừa ráp xong nghe cùng lúc mọi cảm biến, mọi kênh, mọi ký ức vừa nạp vào; không ai chịu nổi. Halo làm cho im. Nó cứu họ. Rồi Canticle thêm một dòng lệnh vào thứ đã cứu người: từ đó Halo vừa nhận lệnh, vừa giữ ký ức hộ. Halo gãy = lính bị coi là "phế phẩm", bị thu hồi để tháo rời. Có lính vẫn tự nguyện đội, vì bỏ ra là tiếng ồn quay lại.
- **CHROMEFALL**: tiếng lóng Khu Đáy, nghĩa là *đồ Chrome (từ Tháp) rơi xuống Đáy*. Cuối chương 1 nó thành tên gọi của Yuki.
- **Vụ sập Tầng Bốn** (6 năm trước): Canticle cắt trụ đỡ Tầng Bốn để thử tải móng Tháp, 4.000 người chết, báo cáo ghi "hỏng kết cấu". Sau đó Canticle xuống Đáy "thu gom" trẻ mồ côi có tố chất đưa lên Tháp làm lính. Đây là vết thương chung nối Yuki, Ash, Kai, Toll, Spark, Junker.
- Hai phe trong UI: **CHROME** (Tháp/Canticle, tím `#7C4DFF`) và **RUST** (Đáy, cam rỉ `#E2703A`).

Từ **không dùng nữa** (bản cũ): bài ca, hát lạc điệu, bắt nhịp, thứ tự lệnh, deck, Operator, Free Zone, quận SIS, tầng âm bảy.
Tên riêng giữ tiếng Anh: YUKI, ZERO, CANTICLE, CHOIR, HALO, tên boss.

### Ba chỉ số, ba luật
- **ATK** — sức mạnh đòn thường và chiêu cuối. **HP** — về 0 là KIA đến hết trận, không hồi sinh. **ENERGY** — đòn thường +25 (một số nhân vật hơn), chiêu cuối tốn 75/100/125.
- Đội **3 người**. Sang wave mới, đồng đội còn sống hồi 30% HP ("nghỉ lấy hơi") vì đội xuất phát không có người hồi máu.
- Đòn thường và chiêu cuối đơn mục tiêu: bấm nút rồi **chạm vào kẻ địch muốn đánh**; nhân vật lao tới đúng con đó. Chiêu diện rộng/hồi máu ra đòn ngay.

---

## 2. Nhân vật

### Nhân vật chính
**YUKI** (Chrome · S · sở hữu từ đầu). Sáu năm trước là bé gái 11 tuổi ở Khu Đáy, bố mẹ chết trong Vụ sập Tầng Bốn; bị Canticle thu gom, thay nửa người bằng máy, đội Halo, khoá ký ức cũ → **Đơn vị 07**, sát thủ giỏi nhất Choir, kiếm **ZERO**. Vài ngày trước Halo lỗi, ký ức rò rỉ → Canticle lệnh xoá → Psalm cắt Halo cả hai, đẩy cả hai rơi xuống Đáy. Tỉnh dậy ở bãi phế liệu, chỉ nhớ tên mình và cách chém.
Tính cách: vui vẻ kiểu đáng sợ, đếm "một… hai… ba" trước khi chém (bài đếm bước của trẻ con Đáy: "Một bước. Hai bước. Ba bước."), tò mò như trẻ con, thỉnh thoảng lạnh như máy.
Mục tiêu chương 1: lấy lại ký ức → biết ai đã làm gì mình → leo lên Tháp.

### Tổ nhặt sắt
- **ASH** (Rust · A · sở hữu từ đầu) — chị. Kiếm tẩm axit xanh. Thực dụng, nhìn gì cũng thấy giá tiền; nói ít, quyết nhanh. Muốn bán Halo của Yuki đêm đầu.
- **KAI** (Rust · B · sở hữu từ đầu) — em trai sinh đôi của Ash, cùng kiểu kiếm, cùng áo. Nói nhiều, khoác lác, sợ bị quên nên đêm nào cũng viết thư. Ngăn Ash bán Yuki.
- **PSALM** (Chrome · S · thưởng 07-C) — "Người xét xử" của Choir: 312 lính hỏng đã kể hết cho bà rồi bị xoá; ca 313 là Yuki, con bé hỏi "bà có đếm không?" → bà cắt Halo cả hai. Halo đỏ, câm.
- **RONIN** (trưởng tổ, luật "không tháo người") và **MUZZLE** (gác cổng cũ của Canticle, khiên là cửa xe): NPC trong comic chương 1, chưa có sprite; mở qua gacha sau.

### Phe địch chương 1
- **Băng Scav** (Rust): dân nhặt sắt hung dữ, tháo mọi thứ rơi từ Tháp.
- **Băng Foreman** (Rust): chiếm lò đúc cũ của Canticle. Boss **FOREMAN**.
- **Canticle / Choir** (Chrome): drone, Enforcer, Chrome Hound. Boss **ARCHON** (AI cổng vành đai), **CANTOR** (chỉ huy Choir, người ra lệnh xoá Yuki và xếp trẻ con lên xe sau vụ sập).
- **Giáo phái Mother Rust** (Rust): thờ đồ Chrome rơi, muốn "thánh hoá" Yuki bằng cách tháo rời. Boss **MOTHER RUST**, người giữ sổ mọi thứ (và mọi đứa trẻ) rơi xuống Đáy.

### Nhân vật mở qua gacha (★ chưa có art trừ Echo, Wire, Stitch: chân dung)
Vesper (em cùng lô với Yuki), Nyx (nguyên mẫu không Halo), Halo (y tá của Choir), Cipher (kỹ sư viết lệnh xoá, chừa khoảng trống 3 giây), Meridian (lính hậu cần hết hạn), Echo (giọng sao chép của Yuki), Wire (thợ lắp Halo bỏ trốn), Toll (người thu nợ Tầng Bốn), Stitch (bác sĩ của Đáy), Spark (cắt dây điện Tháp), Vixen (mượn lính), Junker (xe kéo biết đi), Gravedigger (người giữ nghĩa địa). Hồ sơ đầy đủ: `docs/characters.md`.

---

## 3. Tutorial + Chương 1 — nhịp: rơi → cần lửa → bị thu hồi → tên thật → Cantor

| Sector | Tên | Nhịp truyện | Wave | Địch (id `ENEMY_POOL`) | Boss | mult ★ | Thưởng lần đầu ★ |
|---|---|---|---|---|---|---|---|
| 00-T | BÃI RƠI (tutorial) | Yuki tỉnh dậy, Scav vây; **đánh solo**; Ash & Kai xuất hiện cuối màn | 2 | `scav,gutterrat` → `straydog,scav,gutterrat` | — | .6 | 40 SH · 400 CR |
| 07-A | CỔNG BÃI XE | Việc thử của Ronin: dẹp Scav chiếm cổng; drone Canticle quét mã "07" | 3 | `scav,welder,chopshop` → `straydog,chopshop,welder` → `bulwark,RIGGER,scav` | RIGGER | .8 | 75 SH · 1000 CR |
| 07-B | LÒ ĐÚC | Cần lửa mở Halo; băng Foreman; mảnh ký ức đầu: "Đơn vị 07 bị loại", tên CANTOR, người phụ nữ Halo đỏ | 3 | `welder,slagger,pipefitter` → `tinman,kiln,welder` → `chopshop,FOREMAN,hollow` | FOREMAN | .95 | 90 SH · 1200 CR |
| 07-C | HÀNG RÀO TẬP ĐOÀN | Canticle xuống thu hồi; Psalm lộ diện, đi cùng (khách thế slot 3), gia nhập | 3 | `drone,glassjaw,drone` → `enforcer,drone,chromehound` → `drone,ARCHON,enforcer` | ARCHON | 1.1 | 120 SH · 1600 CR · **PSALM** |
| 07-D | NHÀ THỜ DƯỚI CỐNG | Mother Rust giữ sổ trẻ bị thu gom; Yuki nhớ bố mẹ, Tầng Bốn, Cantor; Ash/Kai cũng mất bố mẹ ở đó | 3 | `hollow,gutterrat,hollow` → `drillbit,hollow,kiln` → `slagger,MOTHER RUST,drillbit` | MOTHER RUST | 1.15 | 150 SH · 2000 CR |
| 07-E | THANG MÁY HÀNG | Cantor tự xuống; Yuki nhớ hết, tự đặt tên; quyết định lên Tháp; hết chương | 4 | `drone,chromehound,drone` → `enforcer,drone,drone` → `drone,chromehound,enforcer` → `drone,CANTOR,enforcer` | CANTOR | 1.1 | 240 SH · 3000 CR |

Tỉ lệ thắng mô phỏng (`node scratch/sim.js`, đội Yuki+Ash+Kai chưa nâng cấp, chính sách đơn giản): 00-T..07-B 100%, 07-C 85%, 07-D 48%, 07-E 49% (65% nếu thay Kai bằng Psalm). Nâng cấp bằng CR và nhân vật gacha kéo hai màn cuối lên.

Chi tiết trang comic từng màn: `js/story.js` (**39 trang, 93 panel** — 11/09: +1 trang ra mắt Rigger, +6 trang vá 5 chỗ mỏng). Prompt ảnh từng panel: `docs/comic-prompts.md`.

### Beat từng màn
- **00-T** intro: Tháp và Khu Đáy (2 caption) → Yuki tỉnh trong hố, Halo gãy, "Tên tôi là Yuki. Còn lại thì… trống." → Scav vây, "Một… hai…". Outro: Ash muốn bán Halo, Kai cản, Yuki muốn nhớ → Ash: lửa của Foreman, làm việc cho tổ thì dẫn đi.
- **07-A** intro: Ronin cho thử việc; Muzzle và cái khiên cửa xe; Kai dạy "luật Đáy"; Ash: "Đừng chết trước khi tôi kịp bán cô." Cuối intro (thêm 11/09): **RIGGER** ra mặt — *"Cứ rơi là hàng!"*, đòi Yuki là hàng rơi trúng bãi mình; Ash bước lên chắn: *"Cô ta là hàng của tôi. Xếp hàng đi."* Outro: drone Canticle quét, Kai chém rơi, mã 07; "Chúng tìm cô. Cô đáng tiền hơn tôi tưởng."
- **07-B** intro: Foreman muốn nấu chảy Yuki; "Tôi cần lửa của ông. Ông cần gì?" — "Tao cần mày ở trong lò." Outro: nung Halo → buồng trắng, "Đơn vị 07. Đây là Cantor. Cô bị loại.", người phụ nữ Halo đỏ; Foreman: "Tụi bay vừa châm đèn gọi Canticle xuống." Thêm 11/09: trước khi nung, Ash nói rõ giá phải trả — cái vòng giữ ký ức hộ, nung hỏng là ký ức chết theo; Yuki vẫn bảo nung. Outro thêm một trang: ký ức chạy tiếp — bàn tay ấy **không nhấn nút** mà giật vòng của chính mình, hai vòng đứt, sàn mở ra; Yuki: *“Có người thả tôi xuống đây. Cố ý.”* (hình trước, nghĩa để 07-C giải thích).
- **07-C** intro: Archon đòi thu hồi; Psalm bước ra: "Tôi là người cắt vòng của cô. Muốn giết tôi thì đợi xong trận." Outro: 312 ca, ca 313 hỏi "bà có đếm không"; "Tôi là ai trước khi lên đó?" — "Tôi không biết. Nhưng tôi biết ai biết." Thêm 11/09: Yuki đặt kiếm lên vai Psalm đòi một lý do; Psalm không xin tha; **Kai** cản bằng luật của chính cậu — *bà ta chết thì 312 người kia mất luôn, ở Đáy bị quên là chết lần thứ hai*. Psalm vào tổ để **làm cuốn sổ**, không phải để được tha.
- **07-D** intro: Mother Rust muốn tháo từng mảnh; "Kể trước, tháo sau." Outro: Tầng Bốn, xe trắng, con bé cầm kiếm của bố chặn xe và đọc bài đếm bước; Yuki nhớ bố mẹ và người đàn ông Halo vàng: Cantor; Ash: "Của tụi tôi cũng vậy."
- **07-E** intro: Cantor: "Cô đang rò rỉ dữ liệu. Tôi xuống để dọn." Yuki: "Tôi có tên." Outro: Cantor chỉ là cái vỏ điều khiển từ xa; Yuki nhớ hết; "Thang máy vẫn chạy. Lên." — HẾT CHƯƠNG 1. Thêm 11/09: trước câu *“Tôi có tên”*, bốn kẻ định giá của cả chương vọng lại (Rigger · Foreman · Archon · Mother Rust) — khép vòng chủ đề. Outro dựng hẳn cú lộ **con rối**: ngực rách không có máu, chỉ gel và bảng mạch, giọng phát ra từ loa, rồi cắt lên District 01 nơi Cantor thật đặt ly rượu xuống. Và **Ronin + Muzzle** tới nơi ở đoạn quyết định: Muzzle báo Bà Ba đã gãy, Ronin mài xong kiếm và chốt *“Trên kia có cả nghìn người đang bị tháo. Đi cả tổ.”*

### Hint tutorial (trong trận, hiện một lần mỗi hồ sơ)
00-T: lượt đầu (ATTACK → chạm địch, +25 Energy), chế độ chọn mục tiêu (HUỶ/Esc), Energy đầy (ZERO 320%, hoàn 50 khi giết), wave mới (hồi 30% HP). 07-A: đội 3 người, FLASHOVER đánh toàn bộ không cần chọn.

---

## 4. Dàn ý chương 2 · SPIRE (Tháp) và chương 3 · CHOIR — chưa cài

Dữ liệu bản cũ (viết theo Operator) giữ ở `js/data_later.js` để lấy lại địch, boss, bố cục wave. Viết lại quanh Yuki:

- **Chương 2 · THÁP (District 04)**: thang máy mở ra sảnh trắng; Choir tưởng tổ là hàng trả về. **Vesper**, em cùng lô, được giao vị trí của Yuki và xuống "đón chị về". **Echo**, lính mang giọng sao chép của Yuki, gọi cô ở kho lưu giọng rồi tự cắt loa và đi theo. Psalm đối mặt **Confessor Mk-II**, người ngồi vào ghế cũ của bà. **Mảnh ký ức lớn của chương**: Yuki là hạng S vì Canticle đã **RÚT** năng lực của cả lô ra lò cùng ngày với cô rồi ghép vào cô. Những đơn vị bị rút vẫn đi được, vẫn thở, không nhận ra ai — địch mới **PHẾ PHẨM** (`husk`). Ronin có luật không tháo người; đây là chỗ luật ấy gãy, vì thứ đứng trước mặt anh đã bị tháo rồi. Kết chương: **Cantor thật**, Halo vàng, hỏi Yuki tại sao lính không Halo lại nghe cô. Cơ chế mới **HALO LINK**: địch Chrome hồi 8% HP đầu lượt chừng nào còn một đồng bọn có link sống → phải chọn thứ tự giết (chế độ chọn mục tiêu phát huy ở đây).
- **Chương 3 · CHOIR (District 01)**: đỉnh Tháp. Canticle không phải một công ty mà là một hệ thống chạy trên mọi Halo. Lò đúc Halo (**Halo** bị xích ở đó), hầm giấu **Nyx**, và **The Canticle** — bản gốc. Kết — **ba cửa, không cửa nào sạch**:
  1. **Cắt hết.** Mọi Choir tự do. Nhưng mất ký ức Halo đang giữ hộ, và những lính cần bộ lọc để sống thì không sống nổi.
  2. **Giữ hệ thống, đổi người ra lệnh** (là cô). Hôm nay không ai mất gì. Ngày mai Halcyon có một Canticle mới.
  3. **Giữ vòng, trả công tắc.** Halo ở lại trên đầu, nhưng chỉ người đội mới bật/tắt được. Không ai bị xoá nữa. Đổi lại, mỗi lính phải tự chọn im lặng hay không, mỗi ngày — và có người đã quen được ra lệnh tới mức không chọn nổi.
  Cơ chế **VERSE**: mỗi wave mới cả đội mất 25 Energy → phải kết thúc wave nhanh.

---

## 5. Quy tắc viết tiếng Việt (áp cho comic, lore, mô tả skill, ghi chú UI)
1. Câu ngắn, chủ ngữ rõ, một ý một câu. Bong bóng ≤ 25 chữ, caption ≤ 40 chữ.
2. Thuật ngữ xuất hiện lần đầu phải được giải thích ngay bằng lời nhân vật hoặc caption.
3. Không ẩn dụ "hát/bài ca/nhịp". Không kiểu "tự hỏi tự trả lời".
4. Mỗi trang comic trả lời được: ai muốn gì, cái gì cản, họ làm gì tiếp.
5. Nhân vật nói đúng tính cách: Yuki đếm số + tò mò; Ash nói giá tiền; Kai khoác lác + hỏi nhiều; Psalm ngắn gọn, không xin lỗi; Ronin ra lệnh gọn; Mother Rust "ta/con"; Cantor lạnh, xưng "tôi/cô".
6. Lore theo khung: Là ai (2 câu) → Chuyện đã xảy ra → Bây giờ → Câu nói. ≤ 180 chữ.
7. Xưng hô: Yuki–Ash "tôi/cô"; Kai gọi Ash là "chị" (chị sinh đôi thật, hơn bảy phút) và **gọi Yuki cũng bằng "chị", tự xưng "em"** — chị nuôi cậu tự phong từ đêm cậu đặt tên cho cô, **không phải chị ruột**, giọng bông đùa chứ không lễ phép; "bà chị" là biệt danh riêng cho Ash, "chị hai" riêng cho Yuki. Yuki vẫn xưng "tôi", gọi Kai là "cậu". Psalm gọi Yuki "cô", Yuki gọi Psalm "bà".

## 6. Skill & passive (★ nháp)
Xem bảng trong `js/data.js` (`ROSTER[id].skill`, `ROSTER[id].passives`). Passive đồng đội bật khi nhân vật kia có trong đội; passive đối đầu bật khi sector có kẻ địch đó (hoặc phe đó) và chỉ tính vào đòn đánh đúng mục tiêu. Archive hiển thị trạng thái: ĐANG BẬT / NGOÀI ĐỘI / CHƯA CÓ / SECTOR …

## 7. Việc còn lại để lên bản chơi thật
1. Ảnh panel comic (66 panel, prompt ở `docs/comic-prompts.md`); nền 07-D (nhà thờ cống) và 07-E (thang máy hàng).
2. Sprite cho Ronin, Muzzle, Echo, Wire, Stitch; art cho 10 nhân vật còn lại; art kẻ địch — 21 con của chương 1, prompt và quy cách ở `docs/enemy-prompts.md` (đang silhouette; cắm sprite địch vào `js/battle.js` là ~15 dòng).
3. Sprite trận của Ash/Kai là kiếm axit, còn video ult đã có là lưới mìn (Ash) và súng điện từ (Kai); lời chiêu đã sửa theo video. Muốn đồng bộ thì làm lại sprite hoặc video.
4. Chương 2–3 quanh Yuki.
5. Lưu tiến trình lên server thay cho localStorage.
