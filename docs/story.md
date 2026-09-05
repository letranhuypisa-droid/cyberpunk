# CHROMEFALL — Cốt truyện & thiết kế màn PvE

> Tài liệu thiết kế. Phần đã cài trong game: Chương 1 (5 sector, hội thoại, thưởng). Chương 2–3: dàn ý.
> Mọi số liệu cân bằng là bản nháp, đánh dấu ★.

---

## 1. Thế giới

**HALCYON SPIRE** là một megacity dựng thẳng đứng. Càng lên cao càng sạch, càng xuống thấp càng rỉ.

- **SPIRE (trên)** — lãnh địa của tập đoàn **CANTICLE**. Canticle sản xuất android chiến đấu gọi là **CHOIR**
  ("dàn đồng ca"). Mỗi unit Choir đeo một **HALO**: vòng điều khiển trên đầu, vừa là dây xích vừa là ký ức.
  Halo còn sáng thì unit còn "hát đúng điệu". Halo tắt hoặc gãy: unit bị coi là *hát lạc điệu* và bị thu hồi.
  Phe này trong game là **CHROME**: tím #7C4DFF, trắng lạnh, đường nét chuẩn xác.
- **SUMP (dưới)** — tầng đáy, nơi mọi thứ từ Spire rơi xuống: nước thải, phế liệu, và thỉnh thoảng là một
  android hỏng. Dân Sump sống bằng nghề nhặt, hàn, và ăn cắp công nghệ. Phe này là **RUST**: cam rỉ #E2703A,
  vàng độc, cạnh sờn, chắp vá.
- **CHROMEFALL** là từ lóng ở Sump: *một thứ chrome rơi xuống đáy.* Đến cuối chương 1, nó mang nghĩa thứ hai.

**Nhân vật chính là người chơi: OPERATOR-77.** Một handler ở Sump điều khiển tổ salvage qua một *command deck*
nhặt được từ xác một Enforcer của Canticle. Deck cho phép người không có Halo ra lệnh cho những kẻ có Halo — vì vậy
người chơi ra lệnh cho cả đội theo lượt, mọi nhân vật đều xưng hô với "Operator", và mỗi màn PvE là một "job".
Kira không phải nhân vật chính: cô là **phần thưởng sau tutorial (07-A)**, còn Psalm gia nhập sau 07-C.
Hồ sơ đầy đủ của từng nhân vật (đọc ở màn ARCHIVE sau khi sở hữu) nằm trong `docs/characters.md`.

### Ba chỉ số, ba luật

- **ATK** — sức mạnh đòn thường và chiêu cuối.
- **HP** — về 0 là **KIA vĩnh viễn trong trận**. Không hồi sinh. Câu chuyện cũng theo luật này: cái chết ở Sump là thật.
- **ENERGY** — mỗi đòn thường +25; chiêu cuối tốn 75/100/125. Mỗi nhân vật đúng một chiêu cuối.

---

## 2. Nhân vật

### Hai nhân vật trung tâm (Chrome, hạng S)

**KIRA** — "Tài sản 07". Kiếm sĩ Choir, sản phẩm hoàn hảo nhất Canticle từng xuất xưởng. Rơi xuống Sump với
Halo gãy, ký ức bị khoá. Không nhớ mình là ai, chỉ nhớ *cách chém*. Cả chương 1 là hành trình mở lại Halo và
nhớ ra cái ngày cô bị thả rơi. Chiêu **ZERO**: 320% ATK một mục tiêu, giết được thì hoàn 50 Energy — Kira
càng giết càng sắc.

**PSALM** — "Confessor". Unit cao cấp có vai máy lộ lõi đỏ. Là người giám sát Kira ở Spire. Khi Canticle ra
lệnh xoá Kira, Psalm **tự cắt Halo của mình** (mã lỗi Canticle ghi nhận: *APOSTASY* — bội giáo) và đưa Kira
rơi cùng. Halo của Psalm giờ đỏ. Chiêu **APOSTASY**: chiếm quyền điều khiển một kẻ địch một lượt — bà biết
rõ Choir bị điều khiển thế nào.

### Tổ salvage (Rust, đội xuất phát của người chơi)

- **RONIN** (A) — Trưởng tổ. Kiếm thép thường, không cấy ghép, tự hào về điều đó. Chiêu **IAIDO** ★.
- **ASH** (A) — Chuyên gia nổ và cháy. Thực dụng, luôn muốn "tháo lõi bán". Chiêu **FLASHOVER** ★ (đánh toàn bộ).
- **MUZZLE** (B) — Tanker, đọc chiến trường, nói chuyện trực tiếp với Operator. Chiêu **FIELD PATCH** ★ (hồi máu).
- **KAI** (B) — Lính trẻ khoác lác, viết thư mỗi đêm. **JUNKER** (B) — nửa người nửa xe kéo, nói dưới mười từ mỗi ngày.

Kira và Psalm là **thưởng cốt truyện**, không lên banner gacha. Banner rate-up mở đầu là **VESPER**.

### Roster mở rộng (mở qua Gacha) ★ toàn bộ là placeholder

| ID | Tên | Phe | Tier | Vai trò gợi ý | Ghi chú cốt truyện |
|---|---|---|---|---|---|
| vesper | VESPER | Chrome | S | AOE | Choir "kinh chiều", đơn vị săn Kira ở chương 2 |
| nyx | NYX | Chrome | S | Nuke | Unit thử nghiệm không Halo, Canticle giấu |
| halo | HALO | Chrome | A | Heal | Unit y tế của Choir, đào ngũ theo Psalm |
| cipher | CIPHER | Chrome | A | Control | Hacker của Canticle, hai mang |
| meridian | MERIDIAN | Chrome | B | Heal/Tank | Unit hậu cần hết hạn sử dụng |
| echo | ECHO | Chrome | A | Nuke | Bản sao giọng Kira, dùng để dụ cô |
| wire | WIRE | Chrome | B | Nuke | Kỹ thuật viên Canticle bỏ trốn xuống Sump |
| toll | TOLL | Rust | S | Nuke | "Người thu nợ" — đòi Canticle món nợ cũ |
| stitch | STITCH | Rust | S | Heal | Bác sĩ chợ đen, vá cả người lẫn máy |
| spark | SPARK | Rust | A | AOE | Thợ điện, ăn cắp điện Spire |
| vixen | VIXEN | Rust | A | Control | Trộm, chuyên "mượn" Choir |
| kai | KAI | Rust | B | Nuke | Lính đánh thuê trẻ |
| junker | JUNKER | Rust | B | Nuke | Xe phế liệu biết đi |
| gravedigger | GRAVEDIGGER | Rust | B | Nuke | Chôn những thứ Spire thả xuống |

### Phe địch

- **Băng Foreman** (Rust) — chiếm Foundry Row. Boss **THE FOREMAN**.
- **Canticle / Choir** (Chrome) — drone, Enforcer, Chrome Hound. Boss **ARCHON** (AI cổng), **CANTOR** (Choir-master).
- **Giáo phái Mother Rust** (Rust) — thờ chrome rơi, muốn "thánh hoá" Kira bằng cách tháo rời. Boss **MOTHER RUST**.

---

## 3. Chương 1 · CHROMEFALL (District 07 · The Sump) — ĐÃ CÀI

Nhịp chương: **rơi → cần lửa → chạm Spire → bị kéo xuống → leo lên.** Người chơi là người ra quyết định ở mỗi
nút thắt (giữ hay bán Kira, có tin "tín hiệu lạ" hay không, có leo lên hay không); Kira là nhân vật *được* phát triển
qua quyết định của người chơi. Trước 07-C, Psalm chỉ xuất hiện dưới dạng "TÍN HIỆU LẠ" chen vào deck.

| Sector | Tên | Nhịp truyện | Wave | Hệ số ★ | Boss | Thưởng lần đầu ★ |
|---|---|---|---|---|---|---|
| 07-A | SCRAPYARD GATE | **Tutorial.** Tổ nhặt được Kira; cô đi cùng dạng khách, clear xong gia nhập | 2 | 0.85 | — | 60 SH · 800 CR · **KIRA** |
| 07-B | FOUNDRY ROW | Cần lò để mở Halo; băng Foreman | 3 | 1.00 | THE FOREMAN | 90 SH · 1200 CR |
| 07-C | CORP PERIMETER | "Tín hiệu lạ" trong deck lộ diện: Psalm; gia nhập sau trận | 3 | 1.15 | ARCHON | 120 SH · 1600 CR · **PSALM** |
| 07-D | DRAINAGE CATHEDRAL | Giáo phái muốn tháo rời Kira | 3 | 1.30 | MOTHER RUST | 150 SH · 2000 CR |
| 07-E | THE LIFT | Cantor chặn thang; Kira nhớ hết | 4 | 1.50 | CANTOR | 240 SH · 3000 CR |

### Thiết kế wave (id trong ENEMY_POOL; boss luôn đứng giữa)

- **07-A**: `scav, gutterrat, straydog` → `welder, scav, rigger`. Dạy đòn thường, energy, chọn mục tiêu.
- **07-B**: `rigger, slagger, pipefitter` → `tinman, kiln, welder` → `chopshop, FOREMAN, hollow`. Elite đầu tiên (Kiln) ở wave 2 để dạy ưu tiên mục tiêu.
- **07-C**: `drone, glassjaw, drone` → `enforcer, drone, chromehound` → `drone, ARCHON, enforcer`. Địch Chrome đánh mạnh, máu mỏng: dạy dùng AOE.
- **07-D**: `hollow, gutterrat, hollow` → `drillbit, hollow, kiln` → `slagger, MOTHER RUST, drillbit`. Boss HP 3000 ×1.3: dạy tích energy cho ZERO.
- **07-E**: `chromehound, drone, chromehound` → `enforcer, enforcer, drone` → `chromehound, ARCHON, enforcer` → `enforcer, CANTOR, chromehound`. Trận dài, hai boss, kiểm tra quản lý HP vì không hồi sinh.

### Đường cong độ khó

- Kẻ địch nhân ATK/HP theo hệ số sector. Đội xuất phát tổng ATK ≈ 575; REC ATK trên màn là gợi ý tổng ATK/5.
- 07-A..07-C chơi được bằng đội xuất phát. 07-D cần dùng ult đúng lúc. 07-E được thiết kế để cần 1–2 nhân vật từ Gacha
  (hoặc chơi rất kỹ). Thưởng cộng dồn 07-A..07-D = 420 SH ≈ 1,5 lần quay ×10.

### Hội thoại

Đã cài trong `STORY` (JS), trước trận (intro) và sau lần clear đầu (outro). Chơi lại (RETRY/RESET) bỏ qua intro.
Nhân vật nói có chân dung; địch dùng silhouette cho đến khi có art.

---

## 4. Chương 2 · SPIRE (District 04 · Chrome tier) — DÀN Ý

Tổ theo thang máy lên tầng Chrome. Sạch, sáng, đối xứng — và mọi thứ đều nhìn thấy họ.

| Sector | Tên | Nhịp | Boss dự kiến |
|---|---|---|---|
| 04-A | ARRIVAL HALL | Sảnh đón: Choir tưởng họ là hàng trả về | ENFORCER PRIME |
| 04-B | GLASS GARDEN | Vườn kính; Vesper săn Kira lần đầu | VESPER (boss trước, mở gacha sau) |
| 04-C | ARCHIVE | Kho ký ức Choir; Kira thấy bản sao giọng mình (Echo) | ECHO |
| 04-D | CONFESSIONAL | Nơi Psalm từng "xưng tội" cho unit lỗi; bà đối mặt quá khứ | CONFESSOR MK-II |
| 04-E | THE NAVE | Sảnh chính Canticle; Cantor tái xuất với Halo mới | CANTOR ASCENDANT |

Cơ chế mới đề xuất: **HALO LINK** — một số địch Chrome hồi năng lượng cho nhau khi đứng cạnh; giết đúng thứ tự để cắt link.

## 5. Chương 3 · CHOIR (The Canticle) — DÀN Ý

Đỉnh Spire. Canticle không phải một công ty, mà là một *bản nhạc* chạy trên mọi Halo. Kira và Psalm phải chọn:
cắt toàn bộ Halo (giải phóng Choir nhưng xoá ký ức của họ) hay giữ Halo và hát đè lên bản nhạc gốc.
Kết chương: **CHROMEFALL** — Spire mất kiểm soát Choir; chrome "rơi" xuống cùng Sump. Cái tên đổi nghĩa.

Boss cuối dự kiến: **THE CANTICLE** — không phải một unit, là cả sân khấu (mỗi wave là một "khúc").

---

## 6. Việc cần làm để lên bản chơi thật

1. Art cho 17 nhân vật còn lại và 21 kẻ địch (silhouette đang giữ chỗ).
2. Cân bằng số: bảng ATK/HP địch, hệ số sector, thưởng.
3. Ảnh nền 07-D (nhà thờ cống) và 07-E (thang máy hàng) — prompt thêm trong `docs/bg-prompts.md`.
4. Hệ thống nhiệm vụ phụ / nông trại tài nguyên để có SH ngoài thưởng lần đầu.
5. Lưu tiến trình lên server thay cho localStorage.
