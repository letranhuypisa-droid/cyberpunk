# ARCHIVE — một mục cho một nhân vật

Kế hoạch bỏ trùng giữa tab **Nhân vật** và tab **Sổ bộ**: mỗi sinh vật trong game chỉ còn **một** mục,
và mục đó chứa đủ cả lore lẫn bảng kit thay vì bị xẻ đôi qua hai tab.

Viết 12/09, tiếp sau `docs/gacha-merge.md`. Chưa cài.

---

## A. Hiện trạng — không chỉ trùng mặt, mà là bị xẻ đôi

Tab **Nhân vật** đọc `Object.values(ROSTER)` ([js/app.js:128](../js/app.js)) → **39** mục, đã bao gồm cả 20 kẻ
địch chiêu mộ được. Tab **Sổ bộ** đọc nhóm `foe` của `CODEX` → **21** mục. **20/21 trùng đúng id.**
Chỉ `cantor` là riêng của Sổ bộ (nằm trong `RECRUIT_SKIP`).

Lần trước tôi ghi là "trùng mặt, không trùng cơ chế". Đọc kỹ hơn thì **nặng hơn thế**: hai tab đang giữ
hai NỬA của cùng một trang. Mở hồ sơ SCAV (đã sở hữu) ở tab Nhân vật, đo bằng DOM:

| | tab Nhân vật (`openLore`) | tab Sổ bộ (`openCodex`) |
|---|---|---|
| danh xưng | *(trống)* | `sub` — "Bầy Kền Kền Bãi Rơi" |
| tiểu sử | **"Chưa có hồ sơ."** | `text` — có đủ |
| nhận diện | — | `spot` — có |
| chiêu cuối | chỉ dòng số, không có flavor | `ult.desc` — flavor có |
| gặp ở | — | `where` — có |
| chỉ số + nâng cấp | có | — |
| passive | có | — |

Nguyên nhân: `LORE[id]` chỉ có cho 19 nhân vật, còn chữ của 20 con chiêu mộ nằm bên `CODEX`. Nên tab
HỒ SƠ của cả 20 con đang **rỗng**, trong khi chữ lấp chỗ rỗng đó đang nằm ở tab bên cạnh.

Gộp lại vừa bỏ được trùng, vừa lấp 20 tab rỗng mà **không phải viết thêm chữ nào**.

---

## B. Chốt

**Sổ bộ là nhà DUY NHẤT của 21 kẻ địch. Tab Nhân vật chỉ còn 19 người.**

| tab | trước | sau |
|---|---|---|
| Nhân vật | 39 (19 người + 20 địch) | **19** người |
| Sổ bộ | 21 địch (20 trùng) | **21** địch, không trùng với đâu |
| Địa danh · Thuật ngữ | không đổi | không đổi |

**Một mục Sổ bộ = một trang, có tab, y như trang nhân vật:**

- chưa sở hữu → chỉ **HỒ SƠ** (lore + nhận diện + tuyệt kỹ + gặp ở)
- đã sở hữu → **KỸ NĂNG · PASSIVE · HỒ SƠ**, dùng lại đúng `openLore`

Chữ của Sổ bộ được nối vào đúng chỗ nó thuộc về trong trang nhân vật:

| CODEX (foe) | → | LORE |
|---|---|---|
| `sub` | → | `epithet` (danh xưng dưới tên) |
| `text` | → | `profile` ("Là ai") |
| `spot` | → | `now` + `labels.now = 'NHẬN DIỆN'` |
| `voice` | → | `voice` |
| `ult.desc` | → | `ultFlavor` (dòng flavor **trên** dòng số của chiêu cuối) |
| `where` | → | pill `GẶP Ở` |

`ult.desc` → `ultFlavor` là chỗ khớp đẹp nhất: `openLore` vốn in hai dòng cho chiêu cuối — `lore__flavor`
(văn) rồi `span` (số). Bản CODEX viết theo phía địch không số, bản `ROSTER` viết theo phe mình có số.
Đúng hai dòng đó, không phải sửa gì.

---

## C. Quyết định

**C1. Vì sao Sổ bộ nuốt kẻ địch, chứ không phải Nhân vật nuốt Sổ bộ.**
Hướng ngược lại (bỏ tab Sổ bộ, nhét lore vào trang nhân vật) **mất nội dung**: `openLore` chỉ mở được khi
`owns(id)` ([js/app.js:134](../js/app.js)), nên con đã đánh nhau mà chưa chiêu mộ về sẽ không đọc được nữa —
hôm nay Sổ bộ mở cho tất cả. Thêm nữa `cantor` không có trong `ROSTER` nên sẽ mất chỗ ở.
Chiều này thì: một mục một sinh vật · Cantor có nhà · lore không bị khoá · và hai tab **cuối cùng cũng
khác nghĩa nhau** ("người của mình" vs "thứ gặp ngoài kia") thay vì "tất cả" vs "một phần của tất cả".

**C2. `FOE_LORE` là map RIÊNG, KHÔNG trộn vào `LORE`.**
`scratch/library_dump.js` duyệt `Object.keys(LORE)` để in §C của `docs/library.md`
([scratch/library_dump.js:49](../scratch/library_dump.js)). Trộn vào là §C phình từ 19 lên 39 mục và tài liệu
đổi hàng loạt, trong khi §D1 vẫn in lại đúng chừng đó chữ từ `CODEX` — thành in hai lần cùng một thứ.
Giữ riêng thì cả §C lẫn §D1 **không đổi một byte**.

**C3. Sinh `FOE_LORE` từ `CODEX` lúc nạp, KHÔNG chép tay.**
Chép tay là chữ ở hai chỗ, sửa một chỗ quên chỗ kia. Một vòng `forEach` trên `codexGroup('foe').items`.

**C4. Ô Sổ bộ hiện trạng thái tiến trình: `CHƯA HẠ` → `ĐÃ HẠ` → `LV n` (đã sở hữu).**
Nối thẳng vào `PLAYER.defeated` vừa dựng hôm nay. Sổ bộ thành bảng kiểm cho đúng vòng lặp
đánh → hạ → mở bể → chiêu mộ, thay vì một danh sách chữ đứng yên.

**C5. KHÔNG khoá đọc theo tiến trình.** Hôm nay Sổ bộ mở hết; gắn khoá vào là lấy đi nội dung đang có,
dựng thành "tiến trình". Chữ viết ra để đọc. Chỉ **đánh dấu** trạng thái, không giấu tên, không giấu chữ.

**C6. `cantor`: trang chỉ có HỒ SƠ, kèm một dòng nói rõ vì sao không chiêu mộ được.**
Hắn sống sang chương 2–3 nên không vào `ROSTER`. Không nói thì người chơi tưởng hỏng.

**C7. Chưa sở hữu thì khối TUYỆT KỸ vẫn phải hiện — trong pane HỒ SƠ.**
Cạm bẫy: `ultFlavor` nằm ở pane KỸ NĂNG, mà pane đó chỉ dựng khi đã sở hữu. Cứ thế thì con **đã hạ nhưng
chưa chiêu mộ** bị mất luôn phần mô tả chiêu cuối — hôm nay Sổ bộ có. Nên HỒ SƠ in khối `TUYỆT KỸ` khi
**không** có pane KỸ NĂNG, và thôi khi có (để không in hai lần).

**C8. Ô Sổ bộ dùng đúng hình thẻ của tab Nhân vật** (`tile` 3/4 + `portraitEl` + bậc + trạng thái), bỏ
`tile--wide` / `arch--codex` cho nhóm foe. Chúng giờ là cùng một loại thứ — thứ sở hữu được — nên phải trông
giống nhau. `arch--codex` giữ nguyên cho Địa danh / Thuật ngữ.
`portraitEl` chạy được cho cả 21 con: def trong `ROSTER` lẫn `ENEMY_POOL` đều có `portrait`.

**C9. `openCodex` vẫn sống** cho Địa danh / Thuật ngữ. Chỉ nhóm `foe` đổi đường.

---

## D. Việc phải làm

### D1 · `js/data.js`

1. Sau khối `CODEX`, thêm `FOE_LORE` sinh từ `codexGroup('foe')` theo bảng ánh xạ ở §B. Giữ luôn
   `where` và `ultName` để trang dùng.
2. Khối chú thích của `LORE` ghi thêm một dòng: 19 nhân vật ở đây, 21 kẻ địch sinh từ `CODEX` sang `FOE_LORE`.

### D2 · `js/app.js`

3. `renderArchive()`: tab `char` lọc `!d.recruit` → 19 mục. `archCount` đổi thành `x/19 HỒ SƠ`.
4. Tab `foe` **không** đi qua `renderCodexGrid` nữa — thêm `renderFoeGrid()`: 21 ô `tile` (định nghĩa lấy từ
   `ROSTER[id] || ENEMY_POOL`), sắp theo *đã sở hữu → đã hạ → chưa hạ*, mỗi ô một nhãn trạng thái (C4).
   `archCount` = `x/21 ĐÃ HẠ`.
5. `openLore(id)` nhận thêm kẻ địch:
   - `const d = ROSTER[id] || ENEMY_POOL.find(...)` — Cantor không có trong `ROSTER`.
   - `const L = LORE[id] || FOE_LORE[id] || {}`.
   - Dòng tag: bỏ `TIER x` khi def không có `tier` (Cantor).
   - Hai pane KỸ NĂNG / PASSIVE chỉ dựng khi `ROSTER[id] && owns(id)`; không thì chỉ còn HỒ SƠ và hàng tab
     phải ẩn đi (một tab thì đừng vẽ tab).
   - HỒ SƠ thêm: pill `GẶP Ở`, khối `TUYỆT KỸ` theo C7, dòng lý do của Cantor theo C6, và dòng
     "chưa chiêu mộ — hạ rồi thì quay ở REQUISITION" cho con chưa sở hữu.
   - `LORE_TAB.cur` có thể đang là `skill` khi mở một con không có pane đó → phải rơi về `lore`.
6. Chú thích đầu khối ARCHIVE viết lại (đang ghi "3 tab", thực tế 4).

### D3 · `index.html` · `css/chromefall.css`

7. Chú thích màn ARCHIVE.
8. CSS: thêm `.tile__lock--beat` (đã hạ, chưa chiêu mộ) cho khác màu với `LOCKED`. `tile--wide` vẫn dùng cho
   Địa danh / Thuật ngữ nên **không** xoá.

### D4 · Tài liệu

9. `README.md` dòng bảng `js/app.js` ("archive (tab Kỹ năng / Passive / Hồ sơ)") + thêm một đoạn ở khối 12/09.
10. `docs/plan-2026-09.md` §J.
11. `docs/gacha-merge.md` §F: gạch mục "để đợt sau", trỏ sang file này.

---

## E. Cách kiểm

```bash
node scratch/library_dump.js
```

```bash
node scratch/ult_lint.js
```

`library_dump` phải in ra `19 hồ sơ · 21 mục sổ bộ` **và `docs/library.md` không đổi một byte** (`git diff`
rỗng) — đó là cái chốt của C2.

Trong game (F12 → Console):

- **Hết trùng:** `Object.values(ROSTER).filter(d=>!d.recruit).length` = 19, lưới tab Nhân vật đúng 19 ô;
  lưới Sổ bộ 21 ô; không id nào có mặt ở cả hai.
- **20 tab HỒ SƠ hết rỗng:** mở SCAV → "Là ai" phải là chữ của sổ bộ, danh xưng "Bầy Kền Kền Bãi Rơi" hiện
  dưới tên, chiêu cuối có **hai** dòng (flavor + số).
- **Chưa sở hữu vẫn đọc được:** xoá scav khỏi `PLAYER.owned` → mở vẫn ra HỒ SƠ, vẫn thấy TUYỆT KỸ (C7),
  không có tab KỸ NĂNG, không có nút Upgrade.
- **Cantor:** mở được, chỉ có HỒ SƠ, có dòng nói vì sao không chiêu mộ được, không vỡ vì thiếu `ROSTER`.
- **Trạng thái ô:** hồ sơ mới → 21 ô `CHƯA HẠ`; sau khi hạ scav → ô scav thành `ĐÃ HẠ`; sau khi quay trúng
  → thành `LV 1`.
- **Chuyển tab qua lại** Nhân vật ↔ Sổ bộ ↔ Địa danh: `LORE_TAB.cur` đang là `skill` rồi mở Cantor không
  được ra trang trắng.
- **375×667 và 375×812**: lưới 21 ô không tràn, trang lore cuộn được.

---

## F. Ngoài phạm vi

- Viết `weapon` / `attack` cho 20 con chiêu mộ (hai mục này của `LORE` vẫn trống — không bịa).
- Ảnh `art/lore/<id>.jpg` riêng cho mục sổ bộ: vẫn mượn `art/card/<id>.png` như hôm nay.
