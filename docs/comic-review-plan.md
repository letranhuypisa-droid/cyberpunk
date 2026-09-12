# CHROMEFALL — Kế hoạch rà soát comic từng màn (v0.3 · lập ngày 06/09/2026)

> Dữ liệu trang: `js/story.js`. Renderer: `js/comic.js`. Prompt ảnh: `docs/comic-prompts.md`. Luật viết: `docs/story.md` §5.
> Kế hoạch này có sẵn phần "phát hiện" từ lần khảo sát 06/09 để bắt tay sửa ngay; phần checklist dùng lại cho mọi lần rà sau.
>
> **Cập nhật 12/09 — renderer đổi, một phần checklist nhóm C/D hết hiệu lực** (chi tiết: `docs/comic-reader.md`):
> ảnh vẽ tay dán `contain` nên **không bao giờ bị xén** (C5, D1, D2 hết lo), và mọi bong bóng dồn thành một cột
> ở đáy panel nên **không thể đè nhau** (C1 luôn đạt) và không còn che mặt (C3, C4 hết nghĩa). Cái còn phải canh
> là **cột chữ cao quá, nuốt mất tranh** — ngưỡng mới: cột chữ ≤ 45% chiều cao ô đo ở 375×812.

---

## 0. Tình trạng lúc lập kế hoạch

| Mục | Số liệu (lint 06/09) |
|---|---|
| Màn | 6 (00-T, 07-A, 07-B, 07-C, 07-D, 07-E) |
| Trang / panel / bong bóng | 29 / 66 / 131 |
| Ảnh panel riêng trong `art/comic/` | 0/66 — mọi panel đang dùng key art, nền sector, hoặc silhouette |
| Nền sector thiếu | `art/bg/bg_07d.jpg` (nhà thờ cống), `art/bg/bg_07e.jpg` (thang máy hàng) → 07-D đang mượn lò đúc + tint cam, 07-E mượn hàng rào + tint tím |
| Luật cứng (≤ 25 chữ / caption ≤ 40, id người nói, khớp prompt, đủ ô) | 0 lỗi |
| Bong bóng đè nhau (đo trên trình duyệt 375×812) | 13 panel |
| Panel nhỏ bị bong bóng che > 30% | 8 panel |
| Lỗi lời / mạch truyện đã thấy | 6 |
| Lỗi cơ chế ảnh hưởng truyện | 2 (khách 07-C thế nhầm slot; `pos`/`zoom` áp cả lên ảnh vẽ riêng) |

---

## 1. Mục tiêu và nguyên tắc

**Mục tiêu.** Sau rà soát: mỗi trang đọc trôi, đúng luật viết, không bong bóng đè nhau hay che mặt nhân vật, và bảng prompt ghi đúng khổ ô thật để sinh ảnh một lần là dùng được.

**Nguyên tắc.**
1. **Sửa chữ và bố cục trước, sinh ảnh sau.** Tên file ảnh theo vị trí (`<sector>_<i|o><trang>_p<panel>.jpg`). Đổi trang hay panel sau khi đã có ảnh là phải đổi tên hàng loạt.
2. Mỗi trang trả lời được: ai muốn gì, cái gì cản, họ làm gì tiếp (luật 4).
3. Sáu thuật ngữ (Tháp, Khu Đáy, Canticle, Choir, Halo, Chromefall) phải được giải thích ngay lần đầu xuất hiện. Không thêm thuật ngữ mới.
4. **Sức chứa panel**: ô nhỏ (w3 nhỏ, h2) tối đa 2 bong bóng. Một dải (trên hoặc dưới) tối đa 2 bong bóng, và chỉ khi cả hai ngắn (tổng ≤ 12 chữ). Caption rộng 86% ô → coi như chiếm cả dải.
5. Mỗi lần sửa `js/story.js` xong: chạy lại lint, rồi đo lại trên trình duyệt.

---

## 2. Công cụ

| Việc | Cách làm |
|---|---|
| Kiểm luật cứng, thuật ngữ, đại từ, wave | `node scratch/comic_lint.js` |
| Đo bố cục thật (đè, tràn, % che, tỉ lệ ô) | Mở game trên trình duyệt, F12 → Console → dán nội dung `scratch/comic_measure.js` → xem bảng và danh sách "cần xem" |
| Xem một trang bất kỳ, không cần đánh trận | Console: `playComic(STORY['07-C'].outro, sectorById('07-C'), 'outro')` (đổi màn / `intro` / `outro`). Outro chỉ tự chạy ở lần thắng đầu, nên đây là cách duy nhất xem lại nhanh. |
| Xem đúng luồng người chơi mới | Hồ sơ mới: `localStorage.removeItem('chromefall.player.v3')` rồi tải lại. **Mất tiến trình** — chỉ làm ở đợt 3. |
| Khổ xem chuẩn | Điện thoại 375×812 (DevTools → Toggle device). Sân comic khi đó là 375×697. |

---

## 3. Ô thật so với bảng khổ trong `docs/comic-prompts.md`

Đo ở 375×812. Bảng khổ hiện tại trong `comic-prompts.md` sai với ô thật, sinh ảnh theo bảng đó sẽ bị cắt nhiều (ảnh `object-fit: cover`).

| Layout | Ô thật | Tỉ lệ thật | Doc đang ghi | Khổ sinh ảnh nên dùng | Vùng an toàn |
|---|---|---|---|---|---|
| `v2` (trên/dưới) | 359×338 | ≈ 1:1 | 3:2 | **1:1** | Góc trên trái để trống cho caption |
| `w3` ô rộng | 359×362 | ≈ 1:1 | 4:3 | **1:1** | Như trên |
| `w3` ô nhỏ | 176×315 | ≈ 9:16 | 4:5 | **9:16** | Chủ thể ở nửa trên; bong bóng chiếm ~30% ô |
| `h2` (trái/phải) | 176×685 | ≈ 1:4 | 9:16 | **9:16 hoặc 9:21**; game cắt hai bên, còn ~46% bề ngang (9:16) hoặc ~60% (9:21) | Chủ thể trong dải giữa 45% bề ngang. Chỉ dùng `h2` cho nhân vật đứng; cảnh rộng + silhouette nên đổi sang `v2` |
| `splash` | 359×685 | ≈ 1:2 | 3:4 | **9:16** (cắt nhẹ trên dưới) | — |

Việc: sửa bảng "Quy cách" trong `comic-prompts.md` theo cột "nên dùng" + cột vùng an toàn, rồi mới sinh ảnh.

---

## 4. Checklist cho từng trang

Rà mỗi trang theo 4 nhóm, đánh dấu vào bảng ở mục 6.

**A. Lời (luật viết §5)**
- A1. Bong bóng ≤ 25 chữ, caption ≤ 40. Câu ngắn, chủ ngữ rõ.
- A2. Thuật ngữ lần đầu có giải thích ngay trong cùng bong bóng hoặc caption.
- A3. Đúng giọng: Yuki đếm số + tò mò; Ash nói giá tiền; Kai khoác lác, hỏi nhiều, gọi Ash là "chị"; Psalm ngắn, không xin lỗi; Ronin ra lệnh gọn; Mother Rust "ta/con"; Cantor "tôi/cô".
- A4. Không ẩn dụ hát / bài ca / nhịp; không từ bản cũ (bài ca, Operator, deck, Free Zone…).

**B. Mạch truyện**
- B1. Trang trả lời: ai muốn gì, cái gì cản, làm gì tiếp.
- B2. Số liệu khớp `data.js`: số wave, số địch, tên địch, ai có trong đội (00-T solo Yuki; 07-C Psalm là khách).
- B3. Khớp hồ sơ (`docs/characters.md`, `LORE`): 312/313, Tầng Bốn 6 năm trước, ba ngày sau xe trắng, "kiếm của bố".
- B4. Nhân vật được gọi tên lần đầu thì phải đã xuất hiện (hình hoặc lời) trước đó.

**C. Bố cục (đo bằng `comic_measure.js`)**
- C1. Không cặp bong bóng nào đè nhau (ĐÈ = 0). Không bong bóng tràn khỏi ô (TRÀN = 0).
- C2. Tổng diện tích bong bóng ≤ 30% ô (ô nhỏ ≤ 35%).
- C3. Thứ tự hiện bong bóng đi từ trên xuống dưới. Ngoại lệ có chủ ý: ô cận mặt (bong bóng đầu ở dưới để chừa mặt) — ghi rõ.
- C4. SFX (`bang`) không đè lên chữ khác; shout `c` chỉ dùng khi giữa ô không có mặt nhân vật.
- C5. `h2`: nội dung sống được trong dải 1:4. Sprite `fg` không bị cắt mặt (kiểm `fgX`, `fgH`).

**D. Ảnh (làm ở đợt 2, khi đã có ảnh riêng)**
- D1. Ảnh đúng khổ theo mục 3; chủ thể không nằm dưới bong bóng (đổi `at` hoặc `pos`).
- D2. Ảnh vẽ riêng phải hiện nguyên khung: `pos`/`zoom` trong data chỉ dành cho ảnh tạm (xem mục 5.3, việc 2).
- D3. Silhouette tự ẩn khi có ảnh (`has-art`) — kiểm từng panel có `sil`.
- D4. Màu phe: panel Tháp tím/trắng, panel Đáy cam/xanh axit; panel ký ức có tint đúng.

---

## 5. Phát hiện sẵn — sửa trong đợt 1

### 5.1 Lời và mạch truyện

| # | Vị trí | Vấn đề | Sửa đề xuất |
|---|---|---|---|
| L1 | 07-E i2 p2 · Psalm | "Ba trăm mười ba lần tôi nhấn nút cho ông." Mâu thuẫn 07-C o1: bà xoá 312 ca, ca 313 là Yuki và bà **không** nhấn. | "Ba trăm mười hai lần tôi nhấn nút cho ông." |
| L2 | 07-E i1 p1 · caption | "lính Choir" là lần đầu chữ **Choir** xuất hiện trong comic, chưa giải thích. | Giải thích sớm hơn ở 07-C o1 p1 (Psalm): "Trên Tháp, lính máy gọi là Choir. Đứa nào hỏng thì bị đưa tới tôi. Kể hết. Rồi bị xoá." (21 chữ). Nếu không, sửa caption 07-E: "Mỗi tầng một hàng lính máy của Canticle, lính Choir, đứng chờ." |
| L3 | 00-T o1 p2 · Ash | "Halo hạng S…" là lần đầu chữ **Halo**; trước đó chỉ gọi "cái vòng". | "Halo. Cái vòng trên đầu cô. Hạng S, gãy, nhưng lõi còn nguyên." (14 chữ) |
| L4 | 07-C i2 p3 · caption | "Kai và Muzzle ở lại giữ đường lui." **Muzzle** chưa từng xuất hiện (hình hay lời). Prompt 07a_i1_p1 có anh ở nền nhưng lời không nhắc. | Giới thiệu Muzzle ở 07-A i1: đổi trang thành Ronin / **Muzzle** (`half('muzzle')`, một câu: "Cửa xe chịu ba đòn. Đòn thứ tư phần tôi.") / Kai; đẩy câu "Tôi đang cười à?" của Yuki sang i2 (xem mục 6). Hoặc bỏ tên Muzzle khỏi caption 07-C. |
| L5 | 07-B o1 p2–p3 | Giọng ký ức nói "Đơn vị 07. Ngươi bị loại." rồi Yuki kết luận "Cái tên đó là Cantor" — trong ký ức không ai xưng Cantor. | Giọng: "Đơn vị 07. Cantor đây. Ngươi bị loại." hoặc caption p3: "Giọng đó xưng là Cantor." |
| L6 | 07-D o2 p1 "Hop. Skip. Jump." · 07-E i3 p2 "Hop!" | Motif đếm của Yuki đang lẫn tiếng Anh; 00-T dùng "Một… hai…", hồ sơ ghi "một, hai, ba". | Quyết định một kiểu. Đề xuất tiếng Việt: bài đếm bước "Một bước. Hai bước. Ba bước." và tiếng hô 07-E "Một!". Nếu giữ tiếng Anh thì phải nêu đó là bài hát trẻ con Đáy ngay trong 07-D. |
| L7 | 07-D i2 p2 · Psalm | "ba hàng tín đồ" nhưng địch 07-D tên HOLLOW / CHUỘT CỐNG / DRILL-BIT / KILN / SLAGGER, không con nào là tín đồ. | Đổi lời: "Bà ta có ba lớp người chắn. Đánh từ ngoài vào." hoặc đặt nhãn `as` / đổi tên địch 07-D cho hợp giáo phái. |
| L8 | 07-D o1 p2 · Mother Rust | "vừa chặn vừa hát bài đếm bước" — hát theo nghĩa đen, không phạm luật 3, nhưng là chữ "hát" duy nhất còn lại. | Tuỳ chọn: "vừa chặn vừa đọc bài đếm bước". |

**Tình trạng 08/09:** L1, L2, L3, L5, L6, L7, L8 đã sửa trong `js/story.js` (L8 sửa cả `LORE` trong `js/data.js`, `docs/characters.md`, `docs/story.md`). L4 làm cùng việc tách trang 07-A (T3, 09/09). Lint 0 lỗi. Đo lại: 66 panel, đè 11, tràn 0, che ≥ 30%: 12 (tăng 2 vì L2 và L3 dài hơn; xử lý ở T3/T4).

### 5.2 Bố cục (đo 06/09 ở 375×812)

**Bong bóng đè nhau (13 panel).** Nguyên nhân chung: hai bong bóng cùng dải dưới (`bl` + `br`) đều dài, hoặc góc + caption giữa (`br` + `b`). Mỗi bong bóng rộng tối đa 74% ô nên hai cái cùng dải luôn chạm nhau khi tổng chữ > 12.

| Panel | Cặp đè | Kích thước đè | Sửa |
|---|---|---|---|
| 00-T o2 p2 | tl × tr (Ash hai câu) | 105×44 px | Gộp hai câu Ash thành một (≤ 25 chữ) ở `tl`; caption `b` giữ. |
| 07-A i1 p1 | bl × br (Ronin hai câu) | 88×36 | Gộp: "Lính máy của Tháp, trong tổ tôi. Được. Thử việc: băng Scav chiếm cổng bãi xe, cắt đường chở hàng. Dẹp." (22 chữ) ở `br`. |
| 07-B o2 p2 | br × b ("…Ừ.") | 38×38 | "…Ừ." sang `bl`. |
| 07-C i2 p1 | bl × br (Psalm hai câu) | 58×44 | Gộp: "Tôi là người cắt vòng của cô. Muốn giết tôi thì đợi xong trận." (15 chữ) ở `br`. |
| 07-C o1 p1 | bl × br (Psalm 19 + 17 chữ) | **186×60** | Tách trang (xem 07-C ở mục 6). |
| 07-C o2 p2 | br × b (caption "PSALM gia nhập tổ.") | 85×47 | Caption sang `bl`. |
| 07-D o1 p1 | bl × br (Mother Rust 14 + 21 chữ) | **186×60** | Tách trang (xem 07-D ở mục 6). |
| 07-D o2 p1 | bl × br (hai suy nghĩ) | 3×44 | Sát mép; rút "Tiếng sập. Bụi. Bố. Mẹ. Xe trắng." (7 chữ). |
| 07-D o3 p1 | br × b (caption "Lần đầu Ash nói…") | 51×32 | Caption sang `bl`. |
| 07-E o1 p1 | bl × br (Cantor hai câu) | 86×44 | Gộp: "Tôi không ở đây. Cái cô chém chỉ là một cái vỏ. Lên Tháp mà tìm. Tôi chờ." (18 chữ) ở `br`. |
| 07-E o3 p1 | br × b (Yuki × "HẾT CHƯƠNG 1") | 82×44 | Tách "HẾT CHƯƠNG 1" ra một trang splash riêng không ảnh (title card): `cap('HẾT CHƯƠNG 1','c')` + `cap('Chương 2: THÁP — đang phát triển.','b')`. |

**Ô nhỏ bị che > 30% (8 panel, đều là ô nhỏ `w3` 176×315):** 00-T o1 p2 (31%), 00-T o1 p3 (35%), 07-A o2 p2 (35%), 07-B o1 p2 (32%), 07-B o1 p3 (30%), 07-D o2 p2 (30%), 07-E i2 p2 (31%), 07-E o2 p2 (37%, ba bong bóng). Sửa chung: ô nhỏ tối đa 2 bong bóng, mỗi câu ≤ 12 chữ; câu dài chuyển sang ô rộng cùng trang.

**Thứ tự đọc ngược (bong bóng sau nằm trên bong bóng trước, kiểu `bl` → `tr`):** 00-T o1 p2, 00-T o1 p3, 00-T o2 p1, 07-A o2 p1, 07-C i3 p1, 07-C o2 p1, 07-D i2 p1. Tất cả là ô cận mặt (`face`/`half`) chừa mặt ở trên. Quyết định một quy ước: giữ (vì bong bóng hiện dần theo chạm) nhưng khi có ảnh riêng phải kiểm bong bóng `tr` không đè mặt; hoặc đổi thành `tl` → `br` và dời `pos`.

**Sprite bị cắt:** 07-E i3 p2 (`art/comic/07e_i3_p2_fg.png` — nguyên là frame dash cũ của Yuki, đổi chỗ 11/09 khi bỏ frame dash; `fgX:'40%'`) trong dải `h2` 176 px: mặt Yuki bị cắt ở mép phải. Sửa `fgX:'55%'` hoặc `fgH:'70%'`, hoặc đổi trang sang `v2`.

### 5.3 Kỹ thuật liên quan truyện

1. ✅ 08/09 · **Khách 07-C thế nhầm slot** — `js/battle.js` `battleTeam()`: khách (`guest`) thay vào slot cuối bất kể ai đứng đó. Người chơi xếp Yuki ở slot 3 thì Yuki bị đẩy khỏi trận, trong khi comic và passive CA THỨ 313 cần Yuki. Sửa: thay slot cuối **không phải Yuki** (ưu tiên `kai` cho khớp caption "Kai ở lại giữ đường lui"), hoặc bỏ tên người ở lại khỏi caption.
2. ✅ 08/09 · **`pos`/`zoom` áp cả lên ảnh vẽ riêng** — `.panel__img` dùng `--pos`/`--zoom` cho mọi nguồn ảnh. Ảnh panel vẽ đúng khung sẽ bị phóng (vd 00-T i2 p2 `zoom:2.4`). Thêm CSS: `.panel.has-art .panel__img{transform:none;object-position:50% 50%}` để ảnh riêng hiện nguyên khung; `pos`/`zoom` chỉ còn tác dụng với ảnh tạm.
3. ✅ 08/09 · **Nền 07-D / 07-E** — `js/story.js` đang trỏ thẳng `BG.foundry` / `BG.gate`. Thêm `sewer:['art/bg/bg_07d.jpg','art/bg/bg_07b.jpg']`, `lift:['art/bg/bg_07e.jpg','art/bg/bg_07c.jpg']` vào `BG` và dùng ở 07-D / 07-E, để thả file nền vào là tự thay, không sửa code (cùng cách với `art/comic/`).
4. **Bong bóng cùng dải** (tuỳ chọn) — CSS `.panel:has(.bub--bl):has(.bub--br) .bub--bl, .panel:has(.bub--bl):has(.bub--br) .bub--br{max-width:47%}` giảm đè cho các cặp ngắn. Không thay được việc tách trang cho cặp dài.
5. **Xem lại outro** (tuỳ chọn) — outro chỉ chạy lần thắng đầu. Nút "XEM LẠI TRUYỆN" ở sector đã clear giúp người chơi và người rà soát; trước mắt dùng console (mục 2).

### 5.4 Tài liệu

- `docs/comic-prompts.md`: sửa bảng khổ theo mục 3; đổi tên file và prompt cho các trang bị tách/đổi (07-A i1–i2, 07-C o1–o3, 07-D o1–o4, 07-E o2, o4); prompt 07e_o2_p1 thêm Ash trong khung (Ash có lời ở panel đó).
- `docs/story.md` §3: cập nhật "29 trang, 66 panel" sau khi tách trang.

---

## 6. Kế hoạch theo từng màn

Ký hiệu: **i** = intro, **o** = outro, **p** = panel. Ưu tiên: ★★★ chặn sinh ảnh · ★★ nên sửa đợt 1 · ★ tuỳ chọn.

### 00-T · BÃI RƠI (i 3 trang / o 2 trang · 12 panel)
| Trang | Layout | Việc | Ưu tiên |
|---|---|---|---|
| i1 | v2 | Hai caption OK (22 và 18 chữ). Khi có ảnh: caption `tl` cần góc trên trái thoáng. | — |
| i2 | w3 | p2 `zoom:2.4` cận Halo: ảnh riêng phải hiện nguyên khung (5.3 việc 2). | ★★ |
| i3 | h2 | p1 dải 1:4 nền + silhouette Scav → ảnh riêng vẽ dọc (mục 3). p2 kiểm `yuki_attack` `fgX:48%` không cắt mặt. "Hai người. Rồi ba người." khớp wave 2 → 3 ✓. | ★★ |
| o1 | w3 | p2 sửa L3 (giải thích Halo). p2, p3 che 31–35%: rút mỗi câu ≤ 12 chữ. Thứ tự `bl` → `tr` (quy ước 5.2). | ★★★ |
| o2 | v2 | p2 đè `tl` × `tr` → gộp hai câu Ash. Caption "Yuki gật đầu…" giữ `b`. | ★★★ |

### 07-A · CỔNG BÃI XE (i 2 / o 2 · 10 panel)
| Trang | Layout | Việc | Ưu tiên |
|---|---|---|---|
| i1 | w3 | p1 đè `bl` × `br` → gộp câu Ronin. Giới thiệu Muzzle (L4): đề xuất đổi trang thành Ronin (rộng) / Muzzle (nhỏ) / Kai (nhỏ). | ★★★ |
| i2 | h2 → w3 | Nếu làm L4: trang này thành w3: Yuki "Tôi đang cười à?" (rộng) / Ash "Đừng chết trước khi tôi kịp bán cô." / cổng bãi xe + silhouette. "Ba người, rồi ba người nữa." khớp wave 3 → 3 ✓. | ★★ |
| o1 | v2 | p2 `kai_attack` `fgX:46%` + caption `b` + SFX `tr`: kiểm SFX không đè caption. | ★ |
| o2 | w3 | p1 thứ tự `bl` → `tr`. p2 che 35% → "Drone của Canticle, tập đoàn trên Tháp." + "Chúng tìm cô. Cô đáng tiền hơn tôi tưởng." | ★★ |

### 07-B · LÒ ĐÚC (i 2 / o 2 · 9 panel)
| Trang | Layout | Việc | Ưu tiên |
|---|---|---|---|
| i1 | v2 | Caption 23 chữ giải thích lò và lửa mở Halo ✓. p2 silhouette Foreman → ảnh riêng (prompt có). | — |
| i2 | h2 | p2 ba bong bóng (`tl`, `c`, `b`) trong dải 1:4: đo lại sau khi có ảnh; shout `c` che giữa ô. | ★ |
| o1 | w3 | Sửa L5 (tên Cantor trong ký ức). p2, p3 che 30–32%: rút caption "Yuki thấy một căn buồng trắng." / "Người phụ nữ Halo đỏ đưa tay lên đầu cô." Tint `chrome` cho ký ức ✓. | ★★★ |
| o2 | v2 | p2 "…Ừ." sang `bl`. | ★★ |

### 07-C · HÀNG RÀO TẬP ĐOÀN (i 3 / o 2 · 11 panel)
| Trang | Layout | Việc | Ưu tiên |
|---|---|---|---|
| i1 | v2 | Nhãn "ARCHON · AI CỔNG" giải thích Archon ✓. | — |
| i2 | w3 | p1 gộp hai câu Psalm. p3 caption phụ thuộc 5.3 việc 1 và L4 (Muzzle). | ★★★ |
| i3 | h2 | p1 thứ tự `bl` → `tr`. p2 silhouette drone trong dải 1:4 → ảnh dọc. | ★ |
| o1 | v2 → tách | p1 đè nặng nhất (186×60). Đề xuất: **o1** v2 = [Psalm nửa người: caption "Archon tắt…" `tl` + câu 1 (kèm giải thích Choir, L2) `br`] · [Psalm cận mặt: câu 2 "Ba trăm mười hai ca…" `bl`]; **o2** v2 = [Yuki: "Rồi bà cắt vòng của cả hai." `tl` + "Bà nợ tôi một câu trả lời…" `br`] · [Psalm cận mặt: "Tôi không biết. Nhưng tôi biết ai biết." `tl` + "Dưới cống có một bà già…" `br`]; **o3** v2 = [Ash: "Mother Rust…" `tl` + "Họ sẽ muốn tháo cô ra để thờ." `br`] · [cổng/đường lui hoặc Psalm: caption "PSALM gia nhập tổ." `c`]. Outro thành 3 trang / 6 panel → cập nhật prompt. | ★★★ |
| o2 | h2 | Nếu không tách: caption "PSALM gia nhập tổ." sang `bl`; p1 thứ tự `bl` → `tr`. | ★★ |

### 07-D · NHÀ THỜ DƯỚI CỐNG (i 2 / o 3 · 11 panel · nặng nhất: 17 bong bóng, 151 chữ ở outro)
| Trang | Layout | Việc | Ưu tiên |
|---|---|---|---|
| i1 | v2 | Caption tả nhà thờ cống nhưng nền tạm là lò đúc → thêm `BG.sewer` (5.3 việc 3); ưu tiên sinh `art/bg/bg_07d.jpg` hoặc ảnh 07d_i1_p1 sớm. | ★★ |
| i2 | h2 | p1 thứ tự `bl` → `tr`. p2 sửa L7 ("tín đồ"). Kai "Sao lần nào cũng ba?!" khớp 3 wave ✓. | ★★ |
| o1 | v2 → tách | Đè 186×60. Đề xuất outro 4 trang: **o1** v2 = [Mother Rust silhouette: caption `tl` + "Sáu năm trước, Tầng Bốn sập…" `br`] · [nến/bàn thờ hoặc Mother Rust cận: "Ba ngày sau, xe trắng…" `tl`]; **o2** v2 = [bãi xe, tint cam: "Ta giấu được vài đứa…" `tl`] · [bãi xe cận con bé: "Con cầm kiếm của bố…" `br`] (sửa L8 nếu muốn); **o3** = o2 hiện tại (Yuki nhớ, giọng Halo vàng, "Cantor."); **o4** = o3 hiện tại. Cập nhật prompt từ o2 trở đi. | ★★★ |
| o2 | w3 | p1 rút "Tiếng sập. Bụi. Bố. Mẹ. Xe trắng." Quyết định L6 (motif đếm). p2 giọng ký ức tint `chrome` + silhouette Cantor ✓. | ★★ |
| o3 | v2 | p1 caption "Lần đầu Ash nói về chuyện đó." sang `bl`. p2 Mother Rust dẫn sang 07-E ✓. | ★★ |

### 07-E · THANG MÁY HÀNG (i 3 / o 3 · 13 panel)
| Trang | Layout | Việc | Ưu tiên |
|---|---|---|---|
| i1 | v2 | L2 (Choir). Nền tạm là hàng rào → `BG.lift`; ưu tiên `art/bg/bg_07e.jpg`. | ★★ |
| i2 | w3 | p2 sửa L1 (312). p2 che 31% → rút "Ba trăm mười hai lần tôi nhấn nút cho ông." + "Hôm nay, cho tôi." Ash "Bốn tầng. Bốn đợt." khớp 4 wave ✓. | ★★★ |
| i3 | h2 | p2 sprite cắt mặt → `fgX:'55%'` hoặc đổi `v2`. "Hop!" theo L6. | ★★ |
| o1 | v2 | p1 gộp hai câu Cantor. | ★★ |
| o2 | w3 | p2 ba bong bóng che 37%. Đề xuất: p1 rộng = Psalm "Trên đó có cả nghìn đứa như cô…" `bl` + Ash "Trên đó có cả nghìn Halo hạng S." `tr`; p2 nhỏ = Kai "Chị!" (`c`) + Ash "Đùa thôi. Một nửa." (`b`); p3 nhỏ = Kai viết thư. Prompt 07e_o2_p1 thêm Ash. | ★★ |
| o3 | splash | Tách title card "HẾT CHƯƠNG 1" thành trang o4. Splash còn caption Chromefall `tl` + Yuki "Thang máy vẫn chạy. Lên." `br`. | ★★★ |

---

## 7. Thứ tự làm

> **Tình trạng 09/09:** bước 1–4 và 7 đã xong (đợt 1: chữ + bố cục + kỹ thuật + tài liệu). 07-C outro → 3 trang, 07-D outro → 4 trang, 07-E thêm title card o4, 07-A i1 có Muzzle và i2 thành `w3`. Tổng mới: 32 trang · 72 panel. Bước 6 (đọc to từng trang) làm ngày 11/09.

**Đợt 1 — chữ và bố cục (chưa cần ảnh, ~1 buổi).**
1. Chạy `node scratch/comic_lint.js`, lưu kết quả làm mốc.
2. Quyết định 3 việc mở: motif đếm (L6), quy ước thứ tự đọc ở ô cận mặt (5.2), giới thiệu Muzzle ở 07-A hay bỏ tên ở 07-C (L4). **Đã chốt 08/09/2026:** L6 tiếng Việt, bài đếm bước "Một bước. Hai bước. Ba bước." và tiếng hô 07-E "Một!" (đã áp). Thứ tự đọc `bl → tr` ở ô cận mặt: giữ, thành quy ước (ghi ở `face()` trong `js/story.js`). Muzzle: giới thiệu ở 07-A i1 (làm cùng T3 ngày 09/09).
3. Sửa `js/story.js` theo mục 5.1 → 5.2 → mục 6, theo thứ tự màn (00-T → 07-E). Tách trang ở 07-C o1, 07-D o1, 07-E o3 (title card).
4. Làm 5.3 việc 1, 2, 3 (khách, `has-art`, `BG.sewer`/`BG.lift`).
5. Chạy lại lint (0 lỗi) và `comic_measure.js` (ĐÈ = 0, TRÀN = 0, che ≤ 30%/35%).
6. Đọc to từng trang bằng `playComic(...)` trên console, tick checklist A–C vào bảng mục 6.
7. Cập nhật `docs/comic-prompts.md` (bảng khổ mục 3, tên file + prompt cho trang đã đổi) và `docs/story.md` §3 (số trang/panel).

**Đợt 2 — ảnh (sau khi có ảnh panel, theo lô).** Sinh ảnh theo lô ưu tiên: (1) 00-T i1–i3 và o1 (ấn tượng đầu), (2) 07-B o1 và 07-D o1–o3 (ký ức, cao trào), (3) panel đang là silhouette (16 panel), (4) còn lại. Mỗi lô: thả vào `art/comic/`, xem bằng console, tick checklist D; chỉnh `at` nếu bong bóng đè chủ thể.

**Đợt 3 — chơi thật (~1 giờ).** Hồ sơ mới, không bật "BỎ QUA COMIC", chơi 00-T → 07-E, đọc intro/outro đúng luồng, kiểm hint tutorial không đè comic, kiểm outro chỉ chạy lần đầu, kiểm 07-C với đội xếp Yuki ở slot 3.

**Điều kiện xong một trang.** Lint sạch · ĐÈ/TRÀN = 0 · che trong ngưỡng · đọc to không vấp · thuật ngữ mới đều được giải thích · (đợt 2) ảnh đúng khung, chủ thể không bị che.

---

## 8. Mẫu ghi chú khi rà

```
07-C o1 p1 · [lời|mạch|bố cục|ảnh] · <vấn đề một câu> · sửa: <đề xuất> · [ ] chưa / [x] xong
```
Ghi vào cột "Việc" của bảng mục 6 hoặc ngay cạnh trang trong `js/story.js` (comment một dòng), rồi xoá khi xong.
