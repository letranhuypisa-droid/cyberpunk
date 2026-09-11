# CHROMEFALL — Đặt tên chiêu & viết mô tả (tham khảo LMHT bản tiếng Việt)

Đọc `leagueoflegends.com/vi-vn/champions` (173 tướng) và bộ dữ liệu chính thức Data Dragon bản `vi_VN` 16.17.1: **865 tên chiêu** (nội tại + 4 chiêu mỗi tướng) và **692 mô tả**. Dưới đây là cái đo được, cái nên lấy, cái không nên lấy, và đề xuất cụ thể cho 19 nhân vật.

> **Trạng thái 07/09.** Chốt: **đòn thường không có tên, chỉ chiêu cuối mới có.** Cả 19 `skill.name` đã xoá khỏi `js/data.js` và ba chỗ hiển thị trong code đã sửa theo — xem §4. Sáu tên chiêu cuối đã đổi, ba đề xuất bị rút lại sau khi đối chiếu `docs/ult-prompts.md` — xem §5 và §7. Phần tách con số khỏi mô tả (§6) **chưa làm**, vì đụng vào chỗ hiển thị trong code.

---

## 1. Đo được gì ở bản dịch LMHT

**Độ dài tên chiêu** (865 tên):

| Số chữ | Số tên | Tỉ lệ |
|---|---|---|
| 1 chữ | 12 | 1% |
| 2 chữ | 257 | 30% |
| 3 chữ | 177 | 20% |
| **4 chữ** | **367** | **42%** |
| 5 chữ trở lên | 52 | 6% |

→ **92% tên chiêu nằm trong 2–4 chữ.** Bốn chữ là nhịp phổ biến nhất, thường là hai cụm hai chữ ghép lại.

**Ba thói quen rõ rệt:**

1. **Gần như không dùng "của"** — chỉ 9/865 tên (1%). Không ai viết "Lưỡi Kiếm Của Bóng Tối"; họ nén thành hai danh từ đứng cạnh nhau.
2. **57 tên mở đầu bằng loại từ** — Đòn, Cú, Nhát, Đường, Lưỡi, Bộ, Vòng, Cơn, Làn, Tia, Vũ, Mưa, Phát. Đây là mẹo biến một danh từ trừu tượng thành một hành động nhìn thấy được.
3. **Tên gọi hình ảnh, không gọi cơ chế.** Tên chiêu tả *cái người chơi thấy*, không tả *cái nó làm*. Không có chiêu nào tên là "Gây Sát Thương Diện Rộng".

**Mô tả chiêu** (692 mô tả):

- Trung vị **33 chữ**, 90% dưới 57 chữ → khoảng 2 câu.
- **26% mở đầu bằng chính tên nhân vật làm chủ ngữ** (dạng "Ahri bắn ra…"). Đây là kiểu phổ biến nhất.
- **37% có mệnh đề nối** (", gây…" / "sau đó…") → công thức *hành động → hậu quả*.
- **Chỉ 10% mô tả có chứa chữ số.** Con số nằm ở bảng chỉ số riêng, không nằm trong câu văn.

Điểm cuối cùng này là khác biệt lớn nhất so với CHROMEFALL hiện tại.

## 2. Cái KHÔNG nên lấy

Từ vựng hay gặp nhất trong tên chiêu LMHT: *thần (21), kiếm (19), băng (19), lửa (18), hồn (17), hỏa (16), hư (15), tử (15), hoàng (15), linh (14), ma (13)…* — đây là kho từ Hán-Việt kiểu kiếm hiệp/thần thoại.

**Không bê kho từ này sang CHROMEFALL.** Ba lý do:

1. `docs/story.md` §5 quy tắc 3 cấm ẩn dụ kiểu đó, quy tắc 1–2 bắt câu ngắn và giải thích thuật ngữ ngay. "Xiềng Xích Địa Ngục" là đúng chất LMHT nhưng sai chất Khu Đáy.
2. `docs/story.md` §1 đã chốt: **tên chiêu cuối giữ tiếng Anh** (ZERO, APOSTASY, FLASHOVER, RIPCORD). Đổi sang Hán-Việt là phá luật đó, và bốn cái tên kia đã gắn với video cut-in đã dựng xong.
3. CHROMEFALL là thế giới công nghiệp, rỉ sét, tay chân dầu mỡ. Kho từ của nó phải là: *thép, hàn, rỉ, ốc, vít, dây, lò, cống, mã, lệnh, khoá, vòng, cầu chì, tụ điện, xăng, dầu, xe, cửa, hố, sổ.*

**Kết luận: lấy cấu trúc, bỏ từ vựng.** Lấy nhịp 2–4 chữ, lấy loại từ mở đầu, lấy luật không dùng "của", lấy công thức mô tả — nhưng thay chữ kiếm hiệp bằng chữ nhà xưởng.

## 3. Luật đặt tên cho CHROMEFALL

Áp cho **tên nội tại** (phần tên tiếng Việt duy nhất còn hiện trong UI sau khi bỏ tên đòn thường) và cho tên chiêu cuối nếu sau này có cái nào đặt bằng tiếng Việt.

| Nên | Không nên |
|---|---|
| 2 hoặc 4 chữ (3 cũng được) | 5 chữ trở lên |
| Tên gọi cái nhìn thấy: **CỬA XE**, **ĐẠP GA** | Tên gọi cơ chế: "Đòn Diện Rộng" |
| Mở bằng loại từ khi cần: **NHÁT**, **CÚ**, **VÒNG**, **CƠN** | "của" trong tên |
| Nén hai danh từ: **LƯỠI ĐỘC**, **HOÁ ĐƠN** | Cụm giới từ dài: "Cửa Bên Trái" |
| Từ nhà xưởng: thép, ốc, dây, lò, mã | Từ kiếm hiệp: thần, hỏa, linh, hư |
| Tên gắn với một chi tiết riêng của nhân vật đó | Tên ai đeo cũng được |

**Mô tả** theo công thức LMHT, đã chỉnh cho hợp luật viết của mình:

> `[Tên nhân vật] + [làm gì] + [ra sao].` Một tới hai câu, dưới 35 chữ. **Con số tách xuống dòng riêng sau dấu ·**

Hiện tại mô tả của mình là bảng số viết thành câu ("Đòn thường 100% ATK, +25 Energy"). Người chơi đọc xong không thấy nhân vật làm gì. Tách ra thì được cả hai: câu văn có hình ảnh, con số vẫn tra được.

---

## 4. Đòn thường — đã bỏ tên (07/09)

Chốt: **đòn thường không cần tên.** Nó là đòn cơ bản ai cũng có, một lượt một cái; đặt tên cho nó chỉ làm loãng cái tên đáng nhớ duy nhất là chiêu cuối. Cả 19 `skill.name` đã xoá khỏi `ROSTER`.

Ba chỗ trong code từng in tên đó, đã sửa:

| Chỗ | Trước | Sau |
|---|---|---|
| `js/app.js` — ARCHIVE, tab KỸ NĂNG | `ĐÒN THƯỜNG · <tên>` | `ĐÒN THƯỜNG` |
| `js/battle.js` — dòng thông tin dưới nút chiêu cuối | `ĐÒN THƯỜNG · <tên>: <mô tả>` | `ĐÒN THƯỜNG: <mô tả>` |
| `js/battle.js` — nhãn trong log sát thương | in `skill.name` khi đòn kết liễu nổ | in `KẾT LIỄU` |

Chỗ thứ ba đáng chú ý: nhãn đó chỉ hiện khi đòn thường ăn thêm sát thương do mục tiêu dưới ngưỡng máu (`executeBelow`), và **chỉ Yuki có cơ chế này**. Trước đây log in ra chữ "BA BƯỚC", giờ in `KẾT LIỄU` — gọi đúng cơ chế thay vì gọi tên.

Mô tả đòn thường thì **vẫn giữ** — đó mới là chỗ phân biệt từng người (Ash để lại độc, Kai thêm chí mạng, Yuki đánh mạnh vào mục tiêu yếu).

## 5. Đề xuất — chiêu cuối

Giữ luật tên tiếng Anh. Bốn chiêu đã có video **không đổi**.

| Nhân vật | Hiện tại | Đề xuất | Vì sao |
|---|---|---|---|
| YUKI | ZERO | **Khoá** | Đã có video, tên gắn với katana. |
| PSALM | APOSTASY | **Khoá** | Đã có video. "Bỏ đạo" — đúng nghĩa việc bà làm. |
| ASH | FLASHOVER | **Khoá** | Đã có video. Thuật ngữ cứu hoả thật (cả phòng bùng cháy cùng lúc). |
| KAI | RIPCORD | **Khoá** | Đã có video. |
| RONIN | IAIDO | **Giữ** | Đã cân nhắc đổi vì "tiếng Nhật lạc thế giới", nhưng nhân vật tên RONIN nên tên chiêu tiếng Nhật là nhất quán. Xem §7. |
| MUZZLE | FIELD PATCH | **Giữ** | Đúng giọng quân dụng. |
| **MERIDIAN** | BULWARK PROTOCOL | **LAST SHIFT** · *hoặc* OVERTIME | ⚠ **Trùng tên kẻ địch BULWARK** (elite phe Rust). Người chơi sẽ tưởng có liên quan. LAST SHIFT = ca cuối, nối thẳng vào chuyện bà đếm giờ còn lại. |
| **STITCH** | SUTURE | **Giữ** | Video ult đã đặc tả là bốn cây kim bốn sợi chỉ. Trùng tên xử lý ở đòn thường (KHÂU → DAO MỔ). Xem §7. |
| **CIPHER** | BACKDOOR | **ROOT ACCESS** · *hoặc* KILL SWITCH | BACKDOOR trùng nghĩa hệt đòn thường CỬA SAU. ROOT ACCESS = quyền cao nhất, hợp với chiêu chiếm quyền điều khiển. |
| **ECHO** | RESONANCE | **PLAYBACK** · *hoặc* FEEDBACK | RESONANCE là từ vật lý chung chung, không phải chuyện của cô. PLAYBACK = phát lại băng ghi âm — đúng cái đêm thứ tư cô nghe lại chính mình. |
| **WIRE** | OVERCLOCK | **Giữ** | Video ult đã đặc tả là ép dòng điện trong Halo quá ngưỡng — đúng nghĩa overclock. Xem §7. |
| **HALO** | SANCTUM | **WARD ROUND** · *hoặc* TRIAGE | SANCTUM nghe nhà thờ. Cô là y tá — WARD ROUND là đi buồng khám cho cả phòng, đúng chiêu hồi máu toàn đội. |
| **NYX** | BLACKOUT | **Giữ** | Tắt hết đèn. Hợp. |
| **VESPER** | EVENSONG | **Giữ** | Kinh chiều — đúng mạch tên Choir/Canticle. |
| **TOLL** | DEBT COLLECTOR | **PAID IN FULL** · *hoặc* FINAL NOTICE | "Debt Collector" là gọi nghề của ông, không gọi cú đánh. PAID IN FULL = trả đủ, đúng khoảnh khắc kết sổ. |
| **SPARK** | ARC FLASH | **Giữ** | Thuật ngữ điện thật, hợp cô. |
| **VIXEN** | HEIST | **Giữ** | |
| **JUNKER** | SCRAP CANNON | **FULL LOAD** · *hoặc* giữ | "Scrap Cannon" tả khẩu súng; anh không có súng, anh có xe. FULL LOAD = đổ nguyên chuyến hàng. |
| **GRAVEDIGGER** | LAST RITES | **Giữ** | |

## 6. Đề xuất — viết lại mô tả

Áp công thức: **câu văn trước, con số sau dấu ·**

Ba ví dụ đủ để thấy khác biệt; nếu anh duyệt em viết nốt 19 người.

**YUKI · BA BƯỚC**
- Hiện tại: `Đòn thường 100% ATK, +25 Energy. Mục tiêu dưới 30% HP thì đòn mạnh thêm 50%.`
- Đề xuất: `Yuki đếm một, hai, ba rồi mới chém. Con nào đã yếu thì không nghe hết ba tiếng.`
  `· 100% ATK · +25 Energy · mục tiêu dưới 30% HP: +50% sát thương`

**ASH · LƯỠI ĐỘC**
- Hiện tại: `Đòn thường 100% ATK, +35 Energy. Lưỡi axit để lại độc: mục tiêu mất thêm 20% ATK của Ash đầu mỗi lượt, trong 2 lượt.`
- Đề xuất: `Axit xanh trên lưỡi kiếm không rửa được. Vết cắt ăn tiếp sau khi Ash đã quay đi.`
  `· 100% ATK · +35 Energy · độc 2 lượt, mỗi lượt 20% ATK`

**MUZZLE · CỬA XE**
- Hiện tại: `Đòn thường 100% ATK, +30 Energy.`
- Đề xuất: `Muzzle không vung vũ khí. Anh đẩy cả cánh cửa vào mặt nó.`
  `· 100% ATK · +30 Energy`

Cái được: **cả 19 mô tả đòn thường đang dùng chung một khuôn** mở đầu bằng "Đòn thường 100% ATK, +XX Energy", trong đó **9 người có mô tả y hệt nhau**, chỉ khác con số Energy (Psalm, Muzzle, Wire, Stitch, Nyx, Cipher, Meridian, Spark, Junker). Đọc ARCHIVE không phân biệt được ai với ai. Tách số ra thì mỗi người có một câu riêng, mà bảng số vẫn nguyên.

## 7. Đã đổi những gì (07/09)

**Đòn thường:** đã đổi 6 tên trong ngày, rồi bỏ hẳn tên đòn thường luôn — xem §4. Phần này chỉ còn giá trị lịch sử.

**Chiêu cuối — 6 cái:**

| Nhân vật | Cũ | Mới |
|---|---|---|
| MERIDIAN | BULWARK PROTOCOL | **LAST SHIFT** |
| CIPHER | BACKDOOR | **ROOT ACCESS** |
| ECHO | RESONANCE | **PLAYBACK** |
| HALO | SANCTUM | **WARD ROUND** |
| TOLL | DEBT COLLECTOR | **PAID IN FULL** |
| JUNKER | SCRAP CANNON | **FULL LOAD** |

Mô tả của 6 chiêu cuối trên cũng sửa theo cho khỏi lệch với tên mới (ví dụ Junker không còn "bắn một khối phế liệu" mà là "đổ nguyên chuyến hàng").

### Ba đề xuất đã rút lại

Đọc kỹ `docs/ult-prompts.md` — nơi mô tả video cut-in đã đặc tả xong — thì ba cái này **không nên đổi**:

| Chiêu | Lý do giữ |
|---|---|
| RONIN · **IAIDO** | Lý do định đổi là "tiếng Nhật, lạc thế giới". Nhưng chính nhân vật tên là RONIN (lãng nhân — samurai vô chủ). Tên chiêu tiếng Nhật là nhất quán với nhân vật, không phải lạc. |
| WIRE · **OVERCLOCK** | Lý do định đổi là "từ máy tính, cô là thợ cơ khí". Sai: `ult-prompts.md` §12 tả cô **bắt lấy dòng điện trong Halo của mục tiêu rồi vặn quá ngưỡng** cho tới khi nó tự nướng chín — đúng nghĩa overclock, và `fx:'shock'`. TORQUE làm lệch khỏi video đã đặc tả. |
| STITCH · **SUTURE** | `ult-prompts.md` §13 tả **bốn cánh tay phẫu thuật bung ra, bốn cây kim cong, bốn sợi chỉ bắn đi bốn hướng**. SUTURE là tên đúng của đúng cái video đó. Vấn đề trùng tên đã xử lý bằng cách đổi *đòn thường* thành DAO MỔ. |

**Bài học:** trước khi đổi tên chiêu cuối, đọc `docs/ult-prompts.md` xem chiêu đó đã có đặc tả video chưa. Chín người đã có: Yuki, Kai, Ash, Psalm, Ronin, Muzzle, Echo, Wire, Stitch. Mười người còn lại đổi tên thoải mái.

## 8. Việc còn lại

**Tách con số khỏi mô tả (§6) — chưa làm.** Đụng vào chỗ hiển thị: `js/app.js` (ARCHIVE) và `js/battle.js` (dòng `ultInfo` dưới nút chiêu cuối) đang in thẳng `desc`. Nếu làm thì thêm trường `stat` riêng bên cạnh `desc` chứ không nhét dấu · vào chuỗi cũ. Anh duyệt thì em làm cả 19 người một lượt.

---

## 9. Mô tả chiêu cuối — đã viết cho 15 người còn lại

Bốn người có video (Yuki, Psalm, Ash, Kai) giữ nguyên tên **và** mô tả. Mười lăm người còn lại: **tên giữ đúng bảng §5/§7**, chỉ **mô tả** được viết lại và bỏ chữ `(★ FAKE)` khỏi chuỗi `desc` — chữ đó đang hiện thẳng cho người chơi trong ARCHIVE và ở dòng dưới nút chiêu cuối. Cost / hệ số / `kind` **không đụng tới**, vẫn là bản nháp cân bằng.

Khuôn áp cho cả 15: **một hình ảnh riêng của nhân vật trước, con số sau** — đúng nhịp của bốn mô tả đã chốt (ZERO, FLASHOVER, RIPCORD, APOSTASY). Mỗi câu phải bám một chi tiết chỉ người đó có: cánh cửa Bà Ba, bốn cây kim, số lô Halo, cuốn sổ bốn nghìn tên, bộ đếm tháo khỏi ngực.

| Nhân vật | Chiêu | Chi tiết riêng dùng làm hình ảnh |
|---|---|---|
| RONIN | IAIDO | Bước tới một bước vào đúng đường đòn, chém xuống, không tra kiếm (`ult-prompts.md` §9) |
| MUZZLE | FIELD PATCH | Cánh cửa xe Bà Ba đóng xuống nền, cả tổ lùi về sau lưng (§10) |
| ECHO | PLAYBACK | Bóc niêm phong ở cổ, hai chữ bằng giọng đi mượn, rồi tự bịt loa (§11) |
| WIRE | OVERCLOCK | Bắt dòng điện trong Halo mục tiêu rồi vặn quá ngưỡng (§12) |
| STITCH | SUTURE | Bốn cánh tay, bốn cây kim cong, bốn sợi chỉ (§13) |
| VESPER | EVENSONG | Vào đúng vị trí Canticle lấy của Yuki, ra đòn theo nhịp Halo |
| NYX | BLACKOUT | Bốn năm trong hầm dạy cô nhìn trong tối |
| HALO | WARD ROUND | Chạm vào là biết ai đau chỗ nào |
| CIPHER | ROOT ACCESS | Phần mềm trong cái vòng do chính anh viết |
| MERIDIAN | LAST SHIFT | Bộ đếm đã tháo nhưng cô vẫn đếm bằng miệng; đứng thêm một ca |
| TOLL | PAID IN FULL | Đọc to dòng nợ, đặt hoá đơn xuống chân |
| SPARK | ARC FLASH | Xả cả dàn tụ trên lưng xuống nền |
| VIXEN | HEIST | Bộ đồ nghề tháo Halo mua của Wire |
| JUNKER | FULL LOAD | Đạp ga, quay khung xe, đổ nguyên chuyến hàng |
| GRAVEDIGGER | LAST RITES | Đào chậm đánh chậm; xong việc khắc tên lên tấm thép |

Hai chỗ phải sửa cùng lúc mỗi khi đổi `desc`: `docs/characters-kit.md` và bản tiếng Anh `docs/characters-kit.en.md` (chép tay, không sinh tự động).

**Chưa làm, vẫn chờ duyệt:** tách con số khỏi câu văn (§6/§8). Mười lăm mô tả mới vẫn để con số trong câu cho khớp với bốn mô tả cũ; đổi thì đổi cả 19 một lượt.

---

## 10. Chiêu cuối cho 20 kẻ địch chiêu mộ (11/09)

Người chơi chiêu mộ được kẻ địch chương 1 qua banner **CHIÊU MỘ** (trả CR). Chúng vào `ROSTER` như nhân
vật, nên cũng phải có chiêu cuối — chiêu cuối là **cái tên duy nhất đáng nhớ** của một đơn vị (§4).

**7 con đã có sẵn** chiêu cuối trong `ENEMY_POOL` (WINCH, PATCH JOB, ELECTRIC DRAGON PUNCH, FIRE STORM,
SMELT, BENEDICTION, FORCED RECALL) — bản chiêu mộ dùng lại y nguyên, không đổi tên.

**13 con còn lại** ban đầu viết trong `RECRUIT_ULT` (chỉ tồn tại trên bản chiêu mộ). Nhưng trong ngày
11/09 người dùng duyệt cho cắm chiêu cuối thật vào `ENEMY_POOL` cho cả **4 elite và 9 lính thường**, nên
`RECRUIT_ULT` giờ **rỗng** — giữ bảng lại chỉ để bù cho địch chương 2 nếu có con nào chưa kịp có ult.
**Tên giữ nguyên bộ đã đặt ở đây**: một con chỉ có một cái tên dù đứng bên nào.

| id | Chiêu | Kiểu | Số phía **địch** | Số bản **chiêu mộ** | Hình ảnh riêng |
|---|---|---|---|---|---|
| `scav` | STRIP DOWN | nuke | 1.4 | **2.0** | Không đánh, hắn tháo — nhè khớp nối mà giật |
| `straydog` | RUN DOWN | nuke + độc | 1.2 | **1.8** | Vọt qua sân, ngoạm bắp chân, giật đầu |
| `gutterrat` | SWARM | aoe | .5 | **1.35** | Huýt một tiếng, cả ổ dưới nắp cống trào lên |
| `chopshop` | PART OUT | nuke ×2 nhịp | .7 | **.95** | Kê mục tiêu lên giá đỡ rồi mở hộp đồ nghề |
| `tinman` | BUTTON UP | shield (tự chắn) | .4 | **.65** | Sập hết nắp giáp xuống, đứng im chịu đòn |
| `slagger` | SLAG POUR | aoe + cháy | .45 | **1.2** | Nghiêng thùng xỉ nóng đổ thành một vệt dài |
| `pipefitter` | PIPE PATCH | heal | .18 | **.30** | Quấn băng thép quanh chỗ thủng, siết cùm |
| `hollow` | EMPTY OUT | nuke | **flat 90** | **mult 1.9** | Trút nốt thứ còn lại trong lồng ngực vào một nhát |
| `drone` | STRAFE | aoe + rút Energy | .4 | **1.3** | Leo cao rồi bổ nhào, quét một đường dọc sân |

`hollow` là trường hợp duy nhất đổi cả **cơ chế**: bản địch dùng `flat 90` (số cứng, không nhân ATK) — hợp
cho một con lính đứng một màn, nhưng về tay người chơi thì càng đánh màn sau càng vô dụng. Bản chiêu mộ đổi
sang `mult`, và **phải xoá `flat`** (`flat:undefined`) vì `execUlt` đọc `ult.flat` trước, để nguyên thì `mult`
bị bỏ qua im lặng.

**Một ngoại lệ ghi rõ để sau này khỏi tưởng là lỗi:** `archon` bản chiêu mộ nâng `ult.mult` từ 1.5 lên 2.6.
FORCED RECALL rút sạch Energy — đứng bên địch thì đau vì cướp mất chiêu cuối của người chơi, nhưng về tay
người chơi thì phần lớn kẻ địch **không có thanh Energy** (chỉ con nào khai `ult` mới có), nên chiêu còn
150% ATK suông, quá yếu cho bậc S. Bản boss ở 07-C giữ nguyên 1.5.

### Bốn con elite — đã có chiêu thật trong `ENEMY_POOL` (11/09)

`bulwark` `drillbit` `enforcer` `chromehound` giờ có chiêu cuối viết cho phía địch, nên **đã xoá** khỏi
`RECRUIT_ULT` (def gốc thắng theo `e.ult || RECRUIT_ULT[id]`, bản viết ở đây chỉ còn là mã chết).

| id | Chiêu | Cờ riêng | Bản địch | **Bản chiêu mộ** |
|---|---|---|---|---|
| `bulwark` | SHIELD WALL | `shieldTarget:'biggest'` | shieldPct .4 | **.9** |
| `drillbit` | BREACH | `hits:2` | mult .8 ×2 | **1.45 ×2** |
| `enforcer` | SUPPRESSION | `drainEnergy:25` | mult 1 | **2.1** |
| `chromehound` | CULL | `target:'lowest'` | mult 1.5 | **2.9** |

**Vì sao phải vá số, không dùng thẳng bản địch:** chiêu của hai phe không cùng thang giá trị. Kẻ địch nạp
`RULES.foeUltGain` Energy mỗi lượt **miễn phí** nên tung lại sau ~3 lượt mãi mãi; phe mình phải đánh thường
để tích đủ một bình rồi tiêu sạch. Thước đo dùng để cân: **tổng %ATK trên mỗi 100 Energy**.

| | /100 EN |
|---|---|
| Nhân vật (Kai bậc B thấp nhất → Yuki) | 2.40 – 3.20 |
| Bốn chiêu elite nếu bê nguyên xi | **1.33 – 1.60** |
| Sau khi vá bằng `RECRUIT_FIX[id].ult` | 2.80 – 2.90 |

Bê nguyên xi là giao cho người chơi ba đơn vị bậc A có chiêu cuối yếu bằng nửa nhân vật bậc B yếu nhất.

Ba cờ trên cũng đã cài vào `execUlt` (phe mình) trong `js/battle.js`, không chỉ `enemyUlt`:
- `shieldTarget:'biggest'` → đắp chắn cho **đồng đội** nhiều HP tối đa nhất, dày theo HP của người đó (đứng một mình thì tự chắn).
- `hits` → đánh nhiều nhịp vào cùng một mục tiêu, **mỗi nhịp quay chí mạng riêng**.
- `target:'lowest'` → chiêu tự khoá kẻ địch yếu nhất, `playerUlt` bỏ luôn bước chọn mục tiêu. Người chơi
  **không được chọn** — đó là nét riêng của Chrome Hound và là lý do nó được trả hệ số cao hơn hai con kia.
