# CHROMEFALL — Từ điển thuật ngữ

Nơi tra một chỗ: tên riêng, địa điểm, công nghệ, vũ khí, thuật ngữ trận và thuật ngữ giao diện. Mỗi mục có cột **EN** là cách gọi tiếng Anh đã dùng trong `docs/characters-kit.en.md`, để bản dịch sau này không mỗi chỗ một kiểu.

Nguồn: `docs/story.md` §1 (sáu thuật ngữ gốc), `js/data.js` (sector, map, roster, kẻ địch), `index.html` (nhãn giao diện). Luật viết tiếng Việt ở `docs/story.md` §5 — **thuật ngữ nào xuất hiện lần đầu trong comic phải được giải thích ngay tại chỗ** bằng lời nhân vật hoặc caption.

---

## 1. Thế giới & địa điểm

| Tiếng Việt | EN | Là gì |
|---|---|---|
| **HALCYON** | Halcyon | Thành phố xây thẳng đứng, trên giàu dưới nghèo. Bản đồ trong game là một lát cắt dọc của nó (`art/map/map_halcyon.jpg`). |
| **Tháp** | the Spire | Nửa trên thành phố: sạch, sáng, tập đoàn ở. Trên bản đồ là DISTRICT 04, cũng là chương 2. |
| **Khu Đáy** | the Bottom | Nửa dưới: rác, nước thải và đồ hỏng từ Tháp rơi xuống. Dân sống bằng nhặt và hàn phế liệu. DISTRICT 07, chương 1. |
| **DISTRICT 01** | District 01 | Đỉnh Tháp, nơi có Canticle và lò đúc Halo. Chương 3. |
| **Tầng Bốn** | Floor Four | Tầng bị Canticle cắt trụ đỡ 6 năm trước để thử tải móng Tháp. 4.000 người chết, báo cáo ghi "hỏng kết cấu". Vết thương chung của Yuki, Ash, Kai, Toll, Spark, Junker. |
| **Vết sẹo Tầng Bốn** | the Floor Four Scar | Mốc trên bản đồ (`l4`), không bấm được. Nhãn phụ: `LEVEL FOUR · 4.000 KIA`. |
| **Trại của Ronin** | Ronin's camp | Căn cứ của người chơi. Nút `base` trên bản đồ, dẫn về màn HOME. |
| **Bãi Rơi** | the Drop Yard | Bãi phế liệu nơi Yuki tỉnh dậy sau khi rơi. Màn tutorial `00-T`. |
| **Cổng Bãi Xe** | the Truck Yard Gate | Màn `07-A`. Việc thử của Ronin. Băng Scav chiếm; boss RIGGER. |
| **Lò Đúc** | the Smelter | Lò đúc cũ của Canticle, giờ băng Foreman chiếm. Màn `07-B` — chỗ Yuki nung Halo để mở nó. |
| **Hàng Rào Tập Đoàn** | the Corporate Fence | Vành đai Canticle. Màn `07-C`, chỗ Psalm lộ diện. |
| **Nhà Thờ Dưới Cống** | the Church in the Drains | Nơi giáo phái Mother Rust hành lễ. Màn `07-D`. |
| **Thang Máy Hàng** | the Freight Lift | Thang máy chở hàng nối Đáy với Tháp. Màn `07-E`, cũng là đường lên chương 2. |
| **Buồng xét xử** | the confession chamber | Phòng Canticle dùng để nghe lính hỏng khai rồi xoá. Chỗ làm cũ của Psalm. |
| **Lò đúc Halo** | the Halo foundry | Nơi đúc ra Halo, ở DISTRICT 01. Halo (nhân vật) bị xích ở đó. |
| **Ống rác** | the waste chute | Đường Psalm đạp bung để cả hai rơi xuống Đáy. |
| **Cổng vành đai** | the perimeter gate | Chốt Muzzle gác 14 năm. |
| **Bãi tái chế** | the recycling yard | Chỗ Wire tìm thấy Meridian đang đếm giờ. |
| **Nghĩa địa sau lò đúc** | the graveyard behind the smelter | Hơn 2.000 tấm thép khắc tên của Gravedigger. |

## 2. Tổ chức & phe

| Tiếng Việt | EN | Là gì |
|---|---|---|
| **CANTICLE** | Canticle | Tập đoàn cai trị Tháp. Chương 3 lộ ra nó không phải một công ty mà là một hệ thống chạy trên mọi Halo. |
| **CHOIR** | the Choir | Lính máy do Canticle chế tạo. Mỗi lính giữ một vị trí cố định trong đội hình. |
| **CHROME** | Chrome | Phe của Tháp/Canticle trong UI. Màu tím `#7C4DFF`. |
| **RUST** | Rust | Phe của Đáy trong UI. Màu cam rỉ `#E2703A`. |
| **Tổ nhặt sắt** | the scrap crew | Nhóm của Ronin. Luật duy nhất: không tháo người. |
| **Băng Scav** | the Scavs | Dân nhặt sắt hung dữ, tháo mọi thứ rơi từ Tháp. Luật băng: **cứ rơi là hàng** — phản đề của luật Ronin (xem *Quy tắc sắt*). Địch màn 00-T và 07-A. Boss: **RIGGER**. |
| **Băng Foreman** | Foreman's gang | Chiếm lò đúc cũ. Boss: FOREMAN. |
| **Giáo phái Mother Rust** | the Mother Rust cult | Thờ đồ Chrome rơi xuống, muốn "thánh hoá" Yuki bằng cách tháo rời cô. Boss: MOTHER RUST. |
| **Enforcer** | Enforcer | Lính vũ trang của Canticle (khác lính máy Choir). Muzzle từng đứng gác cạnh chúng. |

## 3. Công nghệ & thuật ngữ trong truyện

| Tiếng Việt | EN | Là gì |
|---|---|---|
| **HALO** | Halo | Vòng đội trên đầu mỗi lính Choir. **Vốn là bộ lọc**: lính mới ráp nghe cùng lúc mọi cảm biến và mọi ký ức nạp vào, Halo làm cho im — nó cứu họ. Canticle thêm một dòng lệnh vào đó, nên giờ Halo vừa nhận lệnh vừa giữ ký ức hộ. Halo gãy = lính bị coi là phế phẩm, bị thu hồi để tháo rời. Có lính tự nguyện đội, vì bỏ ra là tiếng ồn quay lại. |
| **Dòng lệnh thêm** | the added line | Đoạn mã Canticle ghép vào phần mềm bộ lọc để Halo nhận lệnh và giữ ký ức hộ. Cipher là một trong bốn người được đọc toàn bộ mã; anh biết chỗ nó nằm. |
| **RÚT** | stripping | Canticle rút năng lực của một lính rồi ghép vào lính khác để dựng một đơn vị mạnh hơn. Lính bị rút vẫn đi được, vẫn thở, không nhận ra ai. Yuki hạng S vì cả lô cùng ngày với cô đã bị rút. |
| **CHROMEFALL** | Chromefall | Tiếng lóng Khu Đáy: *đồ Chrome (từ Tháp) rơi xuống Đáy*. Cuối chương 1 nó thành tên Yuki tự đặt cho mình. |
| **Đơn vị 07** | Unit 07 | Mã số Canticle đặt cho Yuki. Cũng là mã drone quét được ở màn 07-A. |
| **Lệnh xoá** | the wipe order / the wipe | Lệnh Canticle kích hoạt khi một lính tự tách khỏi hệ thống, xoá sạch ký ức. Do Cipher viết — anh chừa trong đó một khoảng trống ba giây. |
| **Phế phẩm · thu hồi** | faulty · recovery | Cách Canticle gọi lính hỏng và việc bắt nó về tháo rời. Cũng là tên kẻ địch chương 2 (`husk`): lính đã bị RÚT, còn đi được nhưng rỗng. |
| **Cấy ghép** | implants | Bộ phận máy thay cho người. Ronin không có cái nào. |
| **HALO LINK** | Halo Link | Cơ chế chương 2 (chưa cài): địch Chrome hồi 8% HP đầu mỗi lượt chừng nào còn một đồng bọn có link còn sống → phải chọn thứ tự giết. Khai bằng `link:true` trong `ENEMY_POOL`. |
| **VERSE** | Verse | Cơ chế chương 3 (chưa cài): mỗi wave mới cả đội mất 25 Energy → phải kết thúc wave nhanh. |

## 4. Vũ khí & đồ nghề

| Của ai | Tiếng Việt | EN | Ghi chú |
|---|---|---|---|
| Yuki | Katana **ZERO** | the katana Zero | Cũng là tên chiêu cuối của cô. |
| Ash | Katana tẩm axit xanh | acid-soaked katana | Axit mua ở bãi hoá chất. Đòn thường để lại độc 2 lượt. |
| Ash | Lưới mìn | mine net | Chỉ có trong video chiêu cuối FLASHOVER; sprite trận vẫn là kiếm. |
| Kai | Katana cán quấn đỏ | red-wrapped katana | Cùng kiểu kiếm của chị. |
| Kai | Súng điện từ | railgun | To hơn người cậu. Chỉ có trong video chiêu cuối RIPCORD; sprite trận vẫn là kiếm. |
| Psalm | Đèn lồng đỏ · Halo đỏ | red lantern · red Halo | Halo bà tự giật đứt, giờ đỏ và câm, không nhận lệnh của ai. |
| Ronin | Kiếm thép | steel sword | Chị anh để lại. Không cấy ghép, không máy móc. |
| Muzzle | Cửa xe hơi làm khiên | a car door for a shield | Anh đặt tên từng cánh theo thứ tự; cánh đang dùng là **Bà Ba**, cánh thứ tư sẽ mang tên Meridian (nội tại CÁNH THỨ TƯ). |
| Spark | Dàn tụ điện tự chế | homemade capacitor rack | Đeo trên lưng, bị chặn đường thì phóng điện. |
| Gravedigger | Xẻng · tấm thép khắc tên | shovel · name plates | Không biết tên thì khắc ngày và ba chữ: *từng ở đây*. |
| Stitch | Bộ tay phẫu thuật nhiều khớp | multi-jointed surgical arms | Vá cả người lẫn máy. |
| Toll | Sổ nợ · hoá đơn | the notebook · invoices | 4.000 cái tên chép theo thứ tự nhà; mỗi lính Enforcer một dòng, để lại một tờ hoá đơn tại chỗ. |
| Wire | Đồ nghề tháo Halo | Halo-removal tools | Vixen mua lại một bộ (nội tại ĐỒ NGHỀ). |
| Junker | Xe kéo | the hauler | Anh được hàn thẳng vào khung gầm, dây thần kinh nối vào tay lái. |
| Meridian | Bộ đếm giờ | the counter | Wire đã tháo ra khỏi ngực cô; cô vẫn đếm bằng miệng. |
| Cipher | Máy pha cà phê | the espresso machine | Thứ duy nhất anh mang theo khi bỏ Tháp. |
| Mother Rust | Cuốn sổ | the ledger | Ghi mọi thứ — và mọi đứa trẻ — rơi xuống Đáy. |

## 5. Chỉ số & luật trận

| Từ | EN | Nghĩa |
|---|---|---|
| **ATK** | ATK | Sức mạnh đòn thường và chiêu cuối. |
| **HP** | HP | Máu. Về 0 là **KIA** đến hết trận, không hồi sinh. |
| **ENERGY** | Energy | Thanh tích chiêu cuối. Chỉ đòn thường nạp; chiêu tốn 75/100/125 và luôn bằng đúng Energy tối đa của người đó. |
| **SPD** | SPD | Tốc độ: cao hơn ra đòn trước mỗi round. Bằng nhau thì đội mình trước, rồi theo slot. |
| **CRIT** | CRIT | % chí mạng. Đòn chí mạng nhân 1.5 sát thương. |
| **Đòn thường** | basic attack | Đòn cơ bản, nạp Energy. **Không có tên** — chỉ chiêu cuối mới có tên riêng. |
| **Chiêu cuối** | ultimate | Tốn hết thanh Energy. Bốn loại: `nuke` một mục tiêu · `aoe` toàn bộ địch · `heal` hồi cả đội · `control` chiếm một kẻ địch một lượt. |
| **Nội tại** | passive | Tự bật khi có đồng đội X trong đội, hoặc sector có kẻ địch X / địch phe đó. |
| **Wave** | wave | Một đợt địch. Sang wave mới, đồng đội còn sống hồi 30% HP ("nghỉ lấy hơi"). |
| **Sector** | sector | Một màn chơi (`00-T`, `07-A`…). |
| **mult** | mult | Hệ số ATK/HP nhân cho kẻ địch của sector đó = độ khó. |
| **Rank địch** | rank | `grunt` lính thường · `elite` tinh nhuệ · `boss`. Quyết định cả độ to trên sân. |
| **Choáng / Độc / Cháy** | stun / poison / burn | Choáng = mất lượt kế tiếp (**boss miễn**). Độc và cháy = đầu mỗi lượt của người dính mất `pct × ATK` của người gây, trong `turns` lượt. |
| **Lá chắn** | shield | Hút sát thương trước khi vào HP, không đếm lượt, vỡ mới thôi. Hiện chỉ Kiln có. |
| **Chọn mục tiêu** | targeting mode | Bấm nút xong chạm vào kẻ địch muốn đánh; nhân vật trượt tới đúng con đó. Chiêu diện rộng/hồi máu ra đòn ngay. |
| **Cut-in · holo** | cut-in · holo box | Video chiêu cuối, chiếu trong một hộp trên đầu người phát chiêu (không phủ kín sân). |
| **Overlay hiệu ứng** | FX overlay | Ảnh hiệu ứng nổ trên người trúng đòn: hit, crit, explode, shock, poison, burn, stun, heal, shield. |

## 6. Màn hình & hệ thống

| Từ | EN | Nghĩa |
|---|---|---|
| **HOME / BASE** | Home / Base | Trại của Ronin. Màn chính. |
| **SQUAD** | Squad | Chọn đội 3 người. |
| **MAP** | Map | Bản đồ Halcyon, mỗi khu vực là một chương. |
| **REQUISITION** | Requisition | Màn gacha. Pull ×1 = 30 SH, ×10 = 270 SH (bảo đảm ít nhất một A). |
| **ARCHIVE** | Archive | Xem nhân vật: tab Kỹ năng / Passive / Hồ sơ. Lore đọc được sau khi sở hữu. |
| **COMMS** | Comms | Hội thoại ngoài trận, hiện khi cả hai người trong một **BOND** đã ở trong tổ. |
| **BOND** | bond | Một đoạn hội thoại giữa hai nhân vật (`BONDS` trong `js/data.js`). |
| **SH** | SH (shards) | Mảnh — tiền gacha. |
| **CR** | CR (credits) | Tín dụng — tiền nâng cấp. |
| **Rate-up** | rate-up | Nhân vật được tăng tỉ lệ: 50% số lần ra bậc S là người đó. Hiện là Vesper. |
| **Pity** | pity | Đếm số lần quay chưa ra S; đủ ngưỡng thì lần sau chắc chắn ra S. |
| **Bestiary** | bestiary | Danh sách kẻ địch, ở `kit.html` (trang demo, không nạp trong bản chơi). |
| **★ FAKE** | ★ FAKE | Nhãn đánh dấu số liệu cân bằng còn là bản nháp. |

## 7. Kẻ địch chương 1 (21 con)

| id | Tên trong game | EN | Rank | Ghi chú |
|---|---|---|---|---|
| `scav` | SCAV | Scav | grunt | **Chiêu cuối** (11/09): STRIP DOWN — sát thương một mục tiêu. |
| `rigger` | RIGGER | Rigger | **boss** | Boss 07-A, trùm băng Scav. **Có chiêu cuối**: WINCH — sát thương một mục tiêu + choáng (tên cũ MÓC HÀNG, đổi 11/09 cho cả bộ cùng luật tiếng Anh). Lên trùm 11/09 (trước đó là lính thường). |
| `straydog` | CHÓ HOANG | Stray Dog | grunt | Nhanh hơn Yuki (SPD 110). **Chiêu cuối** (11/09): RUN DOWN — cắn một người, để lại độc 2 lượt. |
| `welder` | THỢ HÀN | Welder | grunt | Trạng thái đầu tiên người chơi gặp: cháy. |
| `gutterrat` | CHUỘT CỐNG | Gutter Rat | grunt | **Chiêu cuối** (11/09): SWARM — đánh cả ba người. |
| `chopshop` | CHOP SHOP | Chop Shop | grunt | **Chiêu cuối** (11/09): PART OUT — hai nhát vào cùng một người. |
| `tinman` | TIN MAN | Tin Man | grunt | Giáp dày, chậm nhất (SPD 66). **Chiêu cuối** (11/09): BUTTON UP — tự dựng lá chắn. |
| `slagger` | SLAGGER | Slagger | grunt | **Chiêu cuối** (11/09): SLAG POUR — đánh cả ba người + cháy 2 lượt. |
| `pipefitter` | THỢ ỐNG | Pipefitter | grunt | **Chiêu cuối** (11/09): PIPE PATCH — vá máu cho đồng bọn thủng nhất (bản nhẹ của Thợ Hàn). |
| `hollow` | HOLLOW | Hollow | grunt | **Chiêu cuối** (11/09): EMPTY OUT — đúng 90 sát thương cố định, không đổi theo độ khó màn. |
| `glassjaw` | GLASS JAW | Glass Jaw | grunt | Nhanh nhất trận (SPD 118), máu mỏng, **có chiêu cuối**. |
| `drone` | DRONE MK1 | Drone Mk1 | grunt | **Chiêu cuối** (11/09): STRAFE — đánh cả ba người và rút 10 Energy mỗi người. |
| `bulwark` | BULWARK | Bulwark | elite | Chậm, trâu, đánh gây choáng. **Có chiêu cuối** (11/09): SHIELD WALL — đắp lá chắn cho con to nhất bên nó (ở 07-A là Rigger), không phải cho chính nó. |
| `kiln` | KILN | Kiln | elite | **Có chiêu cuối**: lá chắn bằng 100% HP tối đa của nó. |
| `drillbit` | DRILL-BIT | Drill-Bit | elite | **Có chiêu cuối** (11/09): BREACH — khoan hai nhịp vào cùng một người. |
| `enforcer` | ENFORCER | Enforcer | elite | **Có chiêu cuối** (11/09): SUPPRESSION — sát thương bằng đòn thường nhưng rút 25 Energy của mục tiêu. |
| `chromehound` | CHROME HOUND | Chrome Hound | elite | Chó máy. Đánh có thể gây choáng. **Có chiêu cuối** (11/09): CULL — chiêu duy nhất không đánh ngẫu nhiên, nó nhắm thẳng người HP thấp nhất. |
| `foreman` | FOREMAN | Foreman | boss | Boss 07-B. Tháo người bán từng bộ phận. **Có chiêu cuối** (11/09): SMELT — sát thương một mục tiêu + cháy 2 lượt. |
| `motherrust` | MOTHER RUST | Mother Rust | boss | Boss 07-D. Giữ sổ mọi thứ rơi xuống Đáy. **Có chiêu cuối** (11/09): BENEDICTION — hồi máu cho mọi kẻ địch còn sống. |
| `archon` | ARCHON | Archon | boss | Boss 07-C. AI cổng vành đai. **Có chiêu cuối** (11/09): FORCED RECALL — sát thương một mục tiêu + rút sạch Energy của người đó. |
| `cantor` | CANTOR | Cantor | boss | Boss cuối chương 1. Chỉ huy Choir, người ra lệnh xoá Yuki và xếp trẻ con lên xe sau vụ sập. Ở 07-E lộ ra chỉ là cái vỏ điều khiển từ xa. **Có chiêu cuối** (11/09): DELETION ORDER — đánh cả ba người trong đội một lượt. |

Địch chương 2–3 đã có số liệu nhưng chưa cài màn: Seraph Drone, Chorister, Warden, Enforcer Prime, Vesper (bản boss), Echo (bản boss), Confessor Mk-II, Cantor Ascendant, Cantor Guard, Exorcist, Precentor, Organist, Forgemaster, Silence, The Canticle, **Phế phẩm** (`husk`).

**PHẾ PHẨM** (`husk`, Chrome, grunt) — lính đã bị RÚT. Chậm, dai, sát thương thấp, **không có HALO LINK** (đã bị cắt khỏi hệ thống nên không được hồi máu). Hành vi định làm, ★ chưa cài: đứng yên cho tới khi bị đánh, đánh rồi mới đánh trả. Giết nó không khó — vấn đề là có giết không.

**PHẾ PHẨM và HOLLOW là một cặp song chiếu — phân biệt bằng màu (chốt 11/09).** Cùng một dáng người bị moi rỗng lồng ngực: **HOLLOW tối màu, ám rỉ sét** = tín đồ Mother Rust **tự moi rỗng lồng ngực** vì tín ngưỡng rồi để trống hoác, vì bịt lại là chối bỏ ân sủng rơi từ trời (phe Rust, chương 1). **PHẾ PHẨM trắng sạch kiểu Choir** = lính Tháp **bị RÚT** rỗng bằng dao mổ, vết cắt thẳng thớm (phe Chrome, chương 2). Dưới Đáy người ta xếp hàng tự làm; trên Tháp người ta bị làm. Luật art ở `docs/enemy-prompts.md` §5 mục `hollow`.

## 8. Từ không dùng nữa

Bản cũ có, đã bỏ — thấy ở đâu thì sửa: *bài ca, hát lạc điệu, bắt nhịp, thứ tự lệnh, deck, Operator, Free Zone, quận SIS, tầng âm bảy.*

Tên riêng giữ nguyên tiếng Anh trong bản Việt: YUKI, ZERO, CANTICLE, CHOIR, HALO, tên chiêu cuối, tên boss.

## 9. Chỗ còn lệch, cần anh quyết

1. **"Người xét xử" (danh xưng Psalm) và "CONFESSOR MK-II" (địch chương 2) là cùng một chức vụ** — người ngồi vào ghế cũ của bà. Bản Việt gọi là "người xét xử", bản Anh gọi là Confessor. Nếu chương 2 muốn nối hai cái này lại cho người chơi thấy, nên thống nhất một chữ tiếng Việt cho `Confessor` (gợi ý: **Người xét xử Mk-II**).
2. **Kiln (địch elite) và Lò Đúc (tên màn 07-B) cùng nghĩa "lò"** nhưng là hai thứ khác nhau. Không sai, chỉ dễ nhầm khi đọc lướt.
3. ~~Đòn thường và chiêu cuối trùng tên ở hai người~~ — **hết vấn đề 07/09**: đã chốt đòn thường không có tên, chỉ chiêu cuối mới có. Xem `docs/skill-naming.md` §4.
