# DẸP LOẠN — kế hoạch & đặc tả (11/09)

> Tên file: `docs/dep-loan.md`. Anh yêu cầu đặt tên file là "dẹp loạn"; cả repo đang dùng tên ASCII không dấu
> (`plan-2026-09.md`, `comic-prompts.md`, `map-prompts.md`) và tên file có dấu + dấu cách hay vỡ khi chạy script
> Python/Node trên Windows, nên tôi giữ đúng nội dung nhưng bỏ dấu ở tên file. **Quyết định Q0.**

Tài liệu này là chỗ duy nhất mô tả chế độ **DẸP LOẠN**: bản đồ riêng của Khu Đáy, chiếm bãi, đóng quân,
kiện hàng, phản kích, nâng bãi, hợp đồng tuần — kèm số liệu cân bằng, đặc tả giao diện và prompt sinh ảnh.
**Việc còn chưa làm ở §K** (soát 12/09). Nhật ký chung vẫn ở `docs/plan-2026-09.md`.

> **Kiểm nhanh:** chạy launch `static-riot` (hoặc `python scratch/riot_serve.py`) rồi mở `http://127.0.0.1:8802/`
> → vào thẳng bản đồ Khu Đáy với chu kỳ 15 giây và nút nạp tiền, không phải qua tiêu đề hay thắng 07-A. Xem Q15.

---

## A. Vì sao phải làm

Bản 11/09 của dẹp loạn là **một thang tầng vô hạn**: bấm tầng → đánh → +CR → mở tầng sau. Nó chữa được đúng một
việc (hết màn thì còn chỗ cày tiền) và hỏng ở ba chỗ:

1. **Không có việc làm khi không đánh.** Đóng game là tiến trình dừng. Người chơi không có lý do mở lại sau
   bốn tiếng — retention của một cái thang chỉ dài bằng sức người bấm.
2. **Roster rộng không có giá trị.** 19 nhân vật + 20 đơn vị chiêu mộ, nhưng ra trận chỉ 3. Người thứ tư trở đi
   chỉ nằm trong ARCHIVE. Gacha vì thế mất động lực sau khi có 3 con đủ mạnh.
3. **Người chơi không đọc được sức mạnh.** Dòng "ATK GỢI Ý 210+" không nói được đội mình so với ổ loạn thế nào,
   nên thua là bất ngờ chứ không phải hậu quả của một lựa chọn.

Bản này thêm một lớp **giữ đất** lên trên cái thang đó: bản đồ Khu Đáy có 9 cái bãi, chiếm được thì **để quân ở
lại** và bãi tự đẻ ra CR/SH theo giờ; đi vắng lâu thì bị cướp lại. Cái thang giữ nguyên, thành cột mốc mở khoá
bãi và chỗ đo sức mạnh.

**Vòng lặp mới:**

```
BẢN ĐỒ KHU ĐÁY → chọn bãi → so sức mạnh (đội mình ⇄ ổ loạn) → CHIẾM (đánh)
   → ĐÓNG QUÂN (1–3 người, khoá khỏi đội hình) → bãi đẻ KIỆN HÀNG theo chu kỳ
   → quay lại NHẬN KIỆN · giữ PHẢN KÍCH · NÂNG BÃI
   → CR/SH → chiêu mộ + nâng cấp → đủ quân cho bãi lớn hơn → leo thang mở bãi mới
```

Ba thứ nuôi retention, theo ba nhịp khác nhau:

| Nhịp | Cơ chế | Kéo người chơi về sau |
|---|---|---|
| Ngắn | Kiện hàng đầy trần sau **6 giờ** (bậc 1) | 2–3 lần/ngày |
| Vừa | Phản kích mỗi **4h30** mỗi bãi, mạnh dần | mỗi phiên chơi |
| Dài | Nâng bãi 5 bậc + hợp đồng tuần | vài tuần |

---

## B. Quyết định đã chốt

Anh dặn "cần hỏi gì thì cứ mặc định chọn cái bạn khuyến nghị" — đây là các chỗ tôi tự chốt và lý do.

| # | Câu hỏi | Chốt | Vì sao |
|---|---|---|---|
| Q0 | Tên file | `docs/dep-loan.md` | Tên có dấu + dấu cách hay vỡ ở script và đường dẫn Windows. |
| Q1 | Bản đồ riêng hay nhét vào map Halcyon? | **Màn riêng `riotmap`**, vào từ nút DẸP LOẠN ở HOME | Map Halcyon là lát cắt dọc cả thành phố cho chiến dịch; nhét 9 nút bãi vào đó là hai hệ toạ độ đè nhau. Bãi nằm trong DISTRICT 07 nên đáng có bản đồ mặt bằng riêng. |
| Q2 | Quân đóng bãi có được ra trận không? | **Không** — đóng quân là khoá khỏi đội hình | Đây là lý do duy nhất khiến roster rộng có giá trị. Không khoá thì đóng quân miễn phí, mất luôn ý nghĩa. |
| Q3 | Người đang trong đội có đóng quân được không? | **Không.** Phải bỏ khỏi đội ở màn SQUAD trước | Tự động rút người khỏi đội sau lưng người chơi là thay đổi ngầm; báo lỗi rõ ràng tốt hơn. |
| Q4 | Thua phản kích thì mất gì? | Bãi thành **ĐANG BỊ CHIẾM**: ngừng đẻ kiện, **kiện đang chờ bị đóng băng chứ không mất**, phải đánh một trận GIÀNH LẠI | Mất sạch của người đi vắng một đêm là trừng phạt cuộc sống thật, không phải trừng phạt lựa chọn. Ngừng sản xuất đã đủ đau. |
| Q5 | Có mất bãi vĩnh viễn không? | **Không.** Giành lại được mãi mãi | Prototype một người chơi, không có lý do gì để xoá tiến trình. |
| Q6 | Quân đủ mạnh thì có bao giờ mất bãi không? | **Không.** Phản kích mạnh trần **×2 ngưỡng giữ bãi** | Phải có một cái đích "đầu tư đủ thì ngủ yên", nếu không thì mọi bãi đều rơi và người chơi bỏ cuộc. |
| Q7 | Tài nguyên thứ ba (linh kiện)? | **Bãi chỉ đẻ CR + SH** | Linh kiện (LK) đã có từ `docs/cyberware.md` (cùng ngày), nhưng nguồn của nó là **phân tách bản dư**, không phải bãi. Thêm một vòi nữa vào bãi là phải cân lại cả bảng thu nhập ở §F2. Giữ nguyên. |
| Q8 | Đồng hồ chạy khi tắt game? | **Có**, tính bằng `Date.now()` | Cả điểm của chế độ. Người chơi vặn đồng hồ máy thì gian lận được — chấp nhận, đây là bản chạy trên máy người chơi, không có server. |
| Q9 | Ảnh bản đồ District 07? | **Vẽ bằng SVG trong code trước** (không phải ô trống), prompt ảnh thật ở §H. **12/09: đã có ảnh thật**, SVG lùi về làm bản dự phòng | Đúng yêu cầu "thử code trước". Thả `art/map/map_d07.jpg` vào là game tự thay — và đúng như thế thật. |
| Q10 | Ảnh riêng cho từng bãi? | **Dùng lại `art/bg/bg_07*.jpg`** đang có. **12/09: đã có đủ 9 ảnh riêng** | 9 ảnh mới chỉ để làm hình minh hoạ nhỏ là phí — nhưng anh sinh rồi thì dùng, tờ chi tiết mở ra thấy đúng cái bãi mình đang đánh chứ không phải nền màn khác. |
| Q16 | Anh gửi **hai** bản đồ, dùng bản nào? (12/09) | **Bản 1** → `art/map/map_d07.jpg`; bản 2 giữ ở `art-src/MAP/d07-alt.png` | Chọn theo cái đo được, không theo cái đẹp hơn: 10 nút phải cách nhau ≥ 8% dọc (§C), mà bản 1 rải mốc đúng khoảng đó — chợ xuống tới 46%, hàng rào 63%, hố ở giữa đáy. Bản 2 dồn chợ + nhà thờ vào cùng dải 33–38% và hết mốc ở khoảng 58–70%, nhét 10 nút vào là hoặc chấm rơi ra chỗ trống, hoặc thẻ đè nhau. Đổi sang bản 2 thì phải đo lại cả bảng toạ độ §C. |
| Q11 | Thang tầng cũ giữ hay bỏ? | **Giữ nguyên**, thành một nút trên bản đồ mới (`HỐ LOẠN`) | Nó đã cân bằng xong và là thước đo sức mạnh; giờ thêm việc mở khoá bãi. |
| Q12 | "Sức mạnh ổ" tính từ chỉ số kẻ địch hay từ số đo? | **Từ số đo (`m50`)** | Cộng chỉ số xếp SÂN LÒ ĐÚC (0% thắng) *dễ hơn* HÀNG RÀO GÃY (100% thắng). Chi tiết ở §D1 — đây là chỗ đổi lớn nhất so với bản thiết kế ban đầu. |
| Q13 | Nút dưới cùng của tờ chi tiết làm gì khi đã giữ bãi? | **Đổi theo việc tiếp theo đáng làm**: NHẬN KIỆN → ĐÓNG QUÂN → ĐÓNG | Một nút "đóng" chết ở vị trí đẹp nhất màn hình là phí. |
| Q14 | Chu kỳ 45 phút thì thử thế nào? | Mở game bằng `index.html?riotfast` → **một chu kỳ 15 giây** | Không ai ngồi chờ 6 tiếng để kiểm một cái trần. |
| Q15 | Kiểm thử có phải đi qua tiêu đề → HOME → thắng 07-A mới thấy bản đồ? (12/09) | **Không.** `index.html?riot` vào thẳng bản đồ Khu Đáy và coi như đã mở khoá **chỉ trong phiên** (không ghi hồ sơ); `?riot=all` mở luôn cả 9 bãi. `python scratch/riot_serve.py` (launch `static-riot`, cổng 8802) là `http.server` cộng một dòng chuyển `/` sang `index.html?riot&riotfast&dev` | Sửa một dòng mà phải đánh lại 07-A thì không ai kiểm. Ghi "đã mở khoá" vào hồ sơ thì lan sang bản chơi thật; cờ trong phiên thì bỏ tham số là hết. Mỗi cổng là một hồ sơ riêng (localStorage tính theo origin) nên cổng kiểm không đụng hồ sơ ở 8765. |

---

## C. Bản đồ Khu Đáy — 9 cái bãi

Mặt bằng DISTRICT 07 nhìn từ trên xuống hơi chếch, chia ba vòng: **vành ngoài** (rìa bãi rác) → **lòng khu**
(nơi có người ở) → **trung tâm** (chân Tháp). Càng vào trong càng nhiều tiền, càng nhiều quân phải bỏ ra.

Cột `#` không phải số trang trí: nó là **`yardNo()`** — mã màn `BÃI 1`…`BÃI 9` hiện ở ô SECTOR khi vào trận và
ở chip đầu tờ chi tiết. Số lấy theo vị trí trong `RIOT_YARDS`, nên **đổi thứ tự mảng là đổi mã màn**.

| # | id | Tên | Vòng | Mở khi | Phe giữ | Ô quân | Ngưỡng giữ | CR/kiện | SH/kiện | Wave | mult | m50 | Sức mạnh ổ | Trùm | Nền |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `drop` | **BÃI RƠI CŨ** | 1 | ngay | rust | 1 | 800 | 20 | 0 | 2 | 1.88 | 2.14 | 3 697 | — | `bg_07a` |
| 2 | `drain` | **CỐNG BA NGÃ** | 1 | ngay | rust | 1 | 1 000 | 25 | 0 | 2 | 1.97 | 2.23 | 3 717 | — | `bg_07d` |
| 3 | `fence` | **HÀNG RÀO GÃY** | 1 | tầng 3 | chrome | 2 | 2 200 | 35 | 0 | 3 | 1.33 | 1.45 | 3 860 | — | `bg_07c` |
| 4 | `smelter` | **SÂN LÒ ĐÚC** | 2 | tầng 5 | rust | 2 | 2 800 | 45 | 1 | 3 | 0.86 | 0.89 | 4 066 | FOREMAN | `bg_07b` |
| 5 | `market` | **CHỢ THÉP** | 2 | tầng 7 | rust | 2 | 3 200 | 55 | 1 | 3 | 1.38 | 1.38 | 4 208 | RIGGER | `bg_07a` |
| 6 | `church` | **MÁI NHÀ THỜ** | 2 | tầng 9 | rust | 2 | 3 600 | 65 | 2 | 3 | 1.17 | 1.13 | 4 357 | MOTHER RUST | `bg_07d` |
| 7 | `lift` | **CHÂN THANG MÁY** | 3 | tầng 12 | chrome | 3 | 5 000 | 95 | 2 | 4 | 1.59 | 0.94 | 7 118 | ARCHON | `bg_07e` |
| 8 | `tower` | **THÁP NƯỚC SỐ 9** | 3 | tầng 15 | rust | 3 | 5 600 | 110 | 3 | 4 | 2.16 | 1.22 | 7 450 | RIGGER | `bg_07a` |
| 9 | `grave` | **NGHĨA ĐỊA THÉP** | 3 | tầng 18 | rust | 3 | 6 400 | 130 | 3 | 4 | 1.77 | 0.99 | 7 523 | MOTHER RUST | `bg_07d` |

Tên lấy từ `docs/glossary.md` §1 để không đẻ thêm địa danh lạ: Bãi Rơi (`00-T`), Nhà Thờ Dưới Cống (`07-D`),
Lò Đúc (`07-B`), Hàng Rào Tập Đoàn (`07-C`), Thang Máy Hàng (`07-E`), nghĩa địa sau lò đúc (lore Gravedigger).

**Cột `mult` không đọc ngang hàng được giữa các bãi.** SÂN LÒ ĐÚC `mult 0.86` *khó hơn* CỐNG BA NGÃ `mult 1.97`,
vì lò đúc có thợ hàn vá máu + lò nung dựng lá chắn. Cột thật sự nói lên độ khó là **`m50`** (§D1), và cả hai đều
là số **đo được** bằng `node scratch/riot_tune.js`, không phải số đoán.

**Mốc mở khoá ăn khớp với tường của thang tầng.** Đội mở đầu cấp 1 đi được tới tầng 9 rồi vấp tường ở tầng 10
(trùm FOREMAN). Vòng 3 cần tầng 12/15/18 — nghĩa là **không thể mở vòng 3 trước khi đủ mạnh để đánh nó**;
không phải rào chắn giả, mà là cùng một thước đo.

**Toạ độ trên ảnh** (`% ảnh 9:16`) — **đo lại 12/09 trên ảnh thật `art/map/map_d07.jpg`**, mỗi chấm rơi đúng
cái mốc của nó. Luật khoảng cách: **≥ 8% theo trục dọc giữa hai nút liền nhau**. Đo ở 375 px: ảnh cao 629 px,
thẻ nhãn 3 dòng cao **45 px**, nên 8% = 50 px chừa được 5 px. Thẻ mọc **vào giữa màn** (`x < 50` thì thẻ sang
phải, ngược lại sang trái) nên x so le **không** cứu được — hai thẻ gặp nhau ở giữa (đã dính một lần ở bản đầu).

| id | x | y | mốc trên ảnh | | id | x | y | mốc trên ảnh |
|---|---|---|---|---|---|---|---|---|
| `tower` | 29 | 15 | bồn nước sơn số 9 | | `smelter` | 25 | 55 | miệng lò còn đỏ |
| `lift` | 63 | 23 | chân khung thang máy | | `fence` | 45 | 63 | chỗ tường rào gãy |
| `grave` | 80 | 31 | ruộng tấm thép cắm đứng | | `drain` | 33 | 75 | ba miệng cống |
| `church` | 27 | 39 | mái nhà thờ + thánh giá | | `drop` | 72 | 83 | bãi container |
| `market` | 68 | 47 | dãy mái tôn chợ | | `pit` (HỐ LOẠN) | 46 | 91 | miệng hố đỏ |

`pit` không phải bãi: bấm vào là sang màn thang tầng cũ. Toạ độ của nó ở `RIOT_PIT` (`js/riot.js`) để nút,
bản vẽ SVG dự phòng và bảng này cùng đọc một chỗ.

**Thứ tự trên ảnh không trùng thứ tự vòng.** Ảnh đặt nghĩa địa thép (vòng 3) thấp hơn chân thang máy, còn chợ
(vòng 2) thì lệch xuống dưới nhà thờ — bảng trên đi theo **ảnh**, vì người chơi nhìn ảnh chứ không nhìn bảng vòng.

### Đội hình từng bãi (`plan`)

Chỉ dùng 21 kẻ địch chương 1 đã có art và sprite — **không cần một ảnh mới nào**.

| Bãi | Wave 1 | Wave 2 | Wave 3 | Wave 4 |
|---|---|---|---|---|
| `drop` | scav · scav · gutterrat | scav · straydog · chopshop | — | — |
| `drain` | gutterrat · gutterrat · straydog | gutterrat · pipefitter · hollow | — | — |
| `fence` | drone · drone · enforcer | enforcer · drone · tinman | enforcer · bulwark · drone | — |
| `smelter` | welder · slagger · slagger | kiln · welder · slagger | kiln · drillbit · **foreman** | — |
| `market` | scav · chopshop · hollow | chopshop · glassjaw · scav | glassjaw · drillbit · **rigger** | — |
| `church` | tinman · hollow · pipefitter | hollow · tinman · bulwark | bulwark · glassjaw · **motherrust** | — |
| `lift` | drone · enforcer · enforcer | chromehound · drone · enforcer | bulwark · chromehound · enforcer | chromehound · drillbit · **archon** |
| `tower` | scav · chopshop · glassjaw | glassjaw · drillbit · chopshop | drillbit · bulwark · glassjaw | glassjaw · chromehound · **rigger** |
| `grave` | tinman · hollow · slagger | kiln · glassjaw · bulwark | drillbit · bulwark · chromehound | chromehound · glassjaw · **motherrust** |

---

## D. Cơ chế

### D1. Sức mạnh — một con số, hai bên sân

Sức mạnh đội mình đã có sẵn: `power(id)` trong `js/state.js`, cộng cho cả ba người.

```
power = ATK×4 + HP×0.6 + SPD×2 + CRIT×6
```

**Bản đầu dùng đúng công thức đó cho kẻ địch. Sim bác ngay:**

| bãi | tỉ lệ đội/ổ theo công thức cộng chỉ số | tỉ lệ thắng thật |
|---|---|---|
| HÀNG RÀO GÃY | 0.85 | **100%** |
| CHỢ THÉP | 0.64 | **94%** |
| SÂN LÒ ĐÚC | 0.55 | **0%** |

Cộng chỉ số không nhìn thấy thợ hàn vá máu, lò nung dựng lá chắn hay trùm gây choáng. Một con số sai thứ tự
như thế **là nói dối người chơi**, mà đây lại đúng là con số họ dựa vào để quyết định có đánh hay không.

**Bản dùng thật neo vào số đo.** `m50` = hệ số `mult` làm đội mở đầu cấp 1 thắng đúng 55% cái bãi đó, đo bằng
chặt nhị phân trên sim (`node scratch/riot_tune.js m50`). Đó là độ khó thật của đội hình wave.

```
sức mạnh ổ = power(đội mốc) × mult / m50          (đội mốc = yuki+ash+kai cấp 1 = 4 208)
```

Nghĩa của tỉ lệ vì thế nói thành lời được: **đội bạn ÷ ổ loạn = 1.0 ⇒ thắng khoảng 55%.**
Đổi `plan` của một bãi thì **phải đo lại `m50`**, nếu không con số trên màn sẽ lệch khỏi sự thật.

**Bảng đọc** hiện ngay dưới hai thanh sức mạnh (đo bằng `sim.js --yard`, 400 trận/bãi — số thật ở §F1):

| Tỉ lệ đội / ổ | Nhãn | Màu | Tỉ lệ thắng đo được |
|---|---|---|---|
| ≥ 1.08 | **ÁP ĐẢO** | `--hp` | 85 – 100% |
| 0.98 – 1.08 | **NGANG SỨC** | `--energy` | 50 – 85% |
| 0.85 – 0.98 | **NGUY HIỂM** | `--crit` | 30 – 75% |
| < 0.85 | **TỰ SÁT** | `--danger` | < 30% |

Băng rộng và **hơi bi quan ở đầu trên** là cố ý. `power()` cộng cả SPD và CRIT, mà hai thứ đó *không* tăng theo
cấp nâng cấp, nên một đội đã nâng cấp 20 mạnh hơn con số của chính nó khoảng **11%** (đo: `m50` cấp 20 ÷ `m50`
cấp 1 = 1.775 trong khi `power` chỉ tăng 1.601). Hệ quả: đội cày kỹ sẽ thấy nhãn nói nặng hơn thực tế một bậc.
Sai về phía đó chấp nhận được; hứa hão thì không.

### D2. Đóng quân

- Mỗi bãi có 1–3 ô. Chạm ô → mở danh sách người đang rảnh → chọn.
- Một người chỉ ở được **một bãi**.
- Người đang đóng quân **không ra trận được** (xám ở SQUAD, nhãn `ĐỒN TRÚ`, không kéo thả được).
- Người đang trong đội **không đóng quân được** (xám ở danh sách chọn, nhãn `ĐANG TRONG ĐỘI`). → Q3.
- Rút quân về **miễn phí và tức thì**, nhưng mọi kiện đang chờ được kết sổ ngay tại thời điểm rút
  (rút quân xong không phải là cách gian lận để nhận kiện ở hệ số cao rồi bỏ đi).

Hai luật trên tự bảo vệ đội hình: vì người trong đội không đóng quân được, đội **không bao giờ** bị rút xuống
dưới 3 người — không cần thêm luật "phải chừa 3 người rảnh" nào nữa.

`normalizeTeam()` (data.js) có thể tự bù người vào slot trống mà không biết gì về đồn trú, nên `settleYards()`
quét lại bất biến *quân đồn trú ∩ đội hình = rỗng* mỗi lần kết sổ; đụng độ thì **đội hình thắng**.

**Ngõ cụt của người chơi mới.** Người mới sở hữu đúng 3 người và cả 3 đều trong đội → không đóng quân được ai,
bãi chiếm về nằm không. Tờ chi tiết nói thẳng ra chỗ đó bằng một khối cảnh báo vàng
(*"cả 3 người đều đang ra trận — quay một lượt CHIÊU MỘ (600 CR)…"*), và nút hành động dưới cùng đổi theo
việc tiếp theo đáng làm: **NHẬN KIỆN → ĐÓNG QUÂN → ĐÓNG**.

**Sức mạnh đồn trú** = tổng `power` của người trong bãi. So với **ngưỡng giữ bãi** ở bảng §C.
Một đơn vị chiêu mộ bậc B ≈ 1 230 điểm, một nhân vật bậc A/S cấp 1 ≈ 1 450–1 500.

### D3. Kiện hàng — thu nhập theo giờ

Một **chu kỳ = 45 phút** → một **kiện**. Kiện dồn lại tới **trần** rồi ngừng đẻ (đây là cái đồng hồ kéo người
chơi về).

```
hệ số quân = min(1.5, sức mạnh đồn trú / ngưỡng giữ bãi)      (0 nếu bãi trống quân → không đẻ kiện)
hệ số phe  = 1 + 0.15 × (số quân đúng phe của bãi / số quân đang đóng)
hệ số bậc  = [1 · 1.35 · 1.8 · 2.35 · 3][bậc bãi − 1]

CR mỗi kiện = làm tròn( CR/kiện gốc × hệ số quân × hệ số phe × hệ số bậc )
SH mỗi kiện = làm tròn( SH/kiện gốc × hệ số quân × hệ số bậc )        ← phe không cộng SH
trần kiện   = 8 + 2 × (bậc bãi − 1)                                   ← bậc 1 = 8 kiện = 6 giờ
```

Bỏ quân **vượt** ngưỡng vẫn có lợi tới 1.5× — nên một bãi nhỏ vẫn đáng để dồn người mạnh vào, và người chơi có
một lựa chọn thật: dàn mỏng 9 bãi hay dồn 3 bãi to.

**Kết sổ (settle)** chạy mỗi lần mở màn DẸP LOẠN, mỗi lần nhận kiện, mỗi lần đổi quân, và **mỗi giây** khi đang
mở màn đó (`riotTick` trong `js/riotui.js` — rẻ, chín phép chia; bản 11/09 của tài liệu ghi "30 giây" là ghi sai):

```
số chu kỳ trôi qua = floor((bây giờ − mốc) / 45 phút),  kẹp theo chỗ trống còn lại của trần
với mỗi chu kỳ: +1 kiện, cộng CR/SH, tăng biến đếm phản kích
mốc += (số chu kỳ) × 45 phút          ← giữ lại phần lẻ, không mất
nếu đã đầy trần: mốc = bây giờ         ← đầy rồi thì thời gian ngừng chạy, đúng nghĩa "trần"
```

**Nhận kiện**: cộng CR/SH vào ví, xoá kiện chờ, `mốc = bây giờ`. Có nút **NHẬN TẤT CẢ** ở bản đồ.
(`mốc = bây giờ` lúc nhận làm mất phần lẻ của chu kỳ đang chạy — xem K6, chưa đổi.)

**Bãi trống quân thì đồng hồ đứng** (hệ số quân = 0; sửa 12/09, xem §J): không đẻ kiện, không đếm phản kích,
`mốc = bây giờ` ở mỗi lần kết sổ — đóng quân vào mới bắt đầu đếm. Giao diện in `CHƯA CÓ QUÂN` ở đúng chỗ đáng lẽ
là đồng hồ (đầu màn, nút bãi, mục 4 của tờ chi tiết) và chip phản kích nói `ĐỨNG YÊN`. Bản 11/09 quên chỗ này:
bãi trống vẫn đẻ kiện 0 CR rồi thua phản kích với 0 quân sau 6 chu kỳ.

### D4. Phản kích

Cứ **6 chu kỳ** (4 giờ 30) một bãi ăn một đợt phản kích. Đợt chỉ nổ **trong lúc bãi còn đẻ kiện** — đầy trần là
mọi thứ đóng băng, nên đi vắng một tuần cũng chỉ ăn tối đa `trần ÷ 6` đợt (bậc 1 = 1 đợt, bậc 5 = 2 đợt).

```
sức mạnh phản kích = ngưỡng giữ bãi × min(2.0, 1 + 0.10 × số đợt đã giữ được)

giữ được (đồn trú ≥ phản kích):  +1 vào số đợt đã giữ · thưởng thêm nửa kiện (chiến lợi phẩm)
thua    (đồn trú <  phản kích):  bãi → ĐANG BỊ CHIẾM · ngừng đẻ · kiện chờ đóng băng · số đợt về 0
```

Trần ×2.0 là lời hứa với người chơi: **đồn trú gấp đôi ngưỡng thì không bao giờ mất bãi** (Q6). Đây là cái đích
dài hạn của cả chế độ.

**Giành lại**: một trận đúng đội hình lúc chiếm nhưng `mult × 0.85` (bọn chiếm đóng còn dính thương). Thắng thì
bãi trở lại **ĐANG GIỮ** và **kiện đóng băng được trả lại nguyên vẹn**.

### D5. Nâng bãi — chỗ tiêu CR dài hạn

5 bậc. Mỗi bậc nâng cả **sản lượng** lẫn **trần**:

| Bậc | Hệ số sản lượng | Trần kiện | Giá (× CR/kiện gốc) | Ví dụ `grave` (130) |
|---|---|---|---|---|
| 1 | ×1.00 | 8 (6 h) | — | — |
| 2 | ×1.35 | 10 (7 h 30) | ×40 | 5 200 CR |
| 3 | ×1.80 | 12 (9 h) | ×100 | 13 000 CR |
| 4 | ×2.35 | 14 (10 h 30) | ×220 | 28 600 CR |
| 5 | ×3.00 | 16 (12 h) | ×440 | 57 200 CR |

Nâng bãi **không** làm ngưỡng giữ bãi hay phản kích tăng theo — nâng là phần thưởng thuần, không phải cái bẫy.

### D6. Hợp đồng tuần

Reset **thứ Hai 00:00 giờ máy**. Ba việc, tất cả đều chỉ tiến được ở Khu Đáy:

| id | Việc | Mốc | Thưởng |
|---|---|---|---|
| `crate` | Nhận kiện hàng | 40 | 120 SH |
| `hold` | Giữ được đợt phản kích | 10 | 150 SH |
| `win` | Thắng trận ở Khu Đáy (chiếm · giành lại · tầng) | 8 | 100 SH |

Thêm một việc ngày vào `DAILY_TASKS` (`js/state.js`): **Nhận 5 kiện ở Khu Đáy → 30 SH**.

### D7. Báo cáo vắng mặt

Mọi việc xảy ra lúc không có người chơi (kiện đầy trần, giữ được phản kích, mất bãi) ghi vào
`PLAYER.riot.feed` (giữ 12 dòng gần nhất). Mở màn DẸP LOẠN thấy một dải **BÁO CÁO** kèm số dòng chưa đọc.
Đây là thứ làm việc "mở game buổi sáng" có phần thưởng cảm xúc, không chỉ có số.

---

## E. Giao diện

Hai màn mới + một dải sửa nhỏ. Màn dọc 375×812 là chuẩn kiểm (xem lại ở 375×667, luật cũ của repo).

### E1. `riotmap` — BẢN ĐỒ KHU ĐÁY

```
┌─ Dẹp loạn ───────────── KHU ĐÁY · 4/9 BÃI ── ◂ BASE ┐
├─ TỔNG QUAN ────────────────────────────────────────┤
│  GIỮ 4/9   ·  +248 CR/GIỜ  ·  +2 SH/GIỜ            │
│  KIỆN CHỜ  12   ·  KIỆN TIẾP  12:47                │
│  [ NHẬN TẤT CẢ · +1.480 CR · +9 SH ]               │
├─ BÁO CÁO (2) ──────────────────────────────────────┤
│  ▸ MÁI NHÀ THỜ giữ được 1 đợt phản kích (+32 CR)   │
│  ▸ THÁP NƯỚC SỐ 9 thất thủ — cần giành lại         │
├─ HỢP ĐỒNG TUẦN ────────────────────────────────────┤
│  KIỆN 23/40 ▪▪▪▪▪▪░░░  GIỮ 4/10 ░░  THẮNG 8/8 ✓   │
├────────────────────────────────────────────────────┤
│                                                    │
│            [ ẢNH / SVG BẢN ĐỒ 9:16 ]               │
│        nút bãi đặt theo % ảnh, cuộn dọc            │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Nút bãi** (`.ynode`) — hình thoi như `.mapnode` cho đồng bộ, nhưng thẻ nhãn dày hơn vì phải chở trạng thái:

| Trạng thái | Chấm | Thẻ nhãn |
|---|---|---|
| `locked` | xám mờ | `KHOÁ · CẦN TẦNG 12` |
| `free` (chưa chiếm) | viền `--danger`, nhấp nháy | `Ổ LOẠN · SỨC MẠNH 5.240` |
| `own` | `--hp`, có huy hiệu số kiện | `2/2 QUÂN · 3/8 KIỆN · 12:47` |
| `full` (đầy trần) | `--energy-full`, nhấp nháy trắng | `ĐẦY TRẦN · 8/8 KIỆN` |
| `contested` | `--crit`, nhấp nháy | `ĐANG BỊ CHIẾM · GIÀNH LẠI` |

Nút **HỐ LOẠN** ở đáy bản đồ: hình khác (vòng tròn), nhãn `THANG VÔ HẠN · TẦNG 7`.

### E2. `riotYard` — tờ chi tiết một bãi (overlay trượt lên)

Thứ tự đúng bằng thứ tự câu hỏi trong đầu người chơi:

```
┌ BÃI RƠI CŨ ─────────────────── VÀNH NGOÀI · RUST ──┐
│  [ ảnh nền bãi 16:9 · nhãn trạng thái đè lên ]     │
├─ 1. SỨC MẠNH ──────────────────────────────────────┤
│  ĐỘI CỦA BẠN  ████████████████░░░  4.204           │
│  Ổ LOẠN       ██████████░░░░░░░░░  2.680           │
│                         [ ÁP ĐẢO ]  2 wave · ×0.85 │
│  Gặp: SCAV ×3 · CHUỘT CỐNG · CHÓ HOANG · CHOP SHOP │
├─ 2. ĐỒN TRÚ ───────────────────────────────────────┤
│  [ ẢNH ]  ← 1 ô                                    │
│  SỨC MẠNH ĐỒN TRÚ  1.494 / 800   ██████ 150% (trần)│
├─ 3. THƯỞNG MỖI KIỆN ───────────────────────────────┤
│  CR 30  ·  SH 0                                    │
│  gốc 20 × quân 1.50 × phe 1.00 × bậc 1.00          │
│  chu kỳ 45 phút · trần 8 kiện (6 giờ)              │
├─ 4. KIỆN HÀNG ─────────────────────────────────────┤
│  3/8 KIỆN  ·  KIỆN TIẾP THEO  12:47                │
│  ████████░░░░░░░░░░░░  ĐẦY TRẦN SAU 3 GIỜ 48       │
│  [ NHẬN · +90 CR ]                                 │
├─ 5. PHẢN KÍCH ─────────────────────────────────────┤
│  ĐỢT SAU sau 3 chu kỳ (2 giờ 15)                   │
│  PHẢN KÍCH 880  ⇄  ĐỒN TRÚ 1.494    [ GIỮ ĐƯỢC ]   │
│  Đã giữ 1 đợt · mỗi đợt +10%, trần 1.600           │
├─ 6. NÂNG BÃI ──────────────────────────────────────┤
│  BẬC 1 → 2 : sản lượng ×1.35 · trần 8 → 10 kiện    │
│  [ NÂNG · 800 CR ]                                 │
└────────────────────────────────────────────────────┘
        [ CHIẾM BÃI ] / [ GIÀNH LẠI ] / [ ĐÓNG ]
```

Ba luật giao diện tôi giữ chặt:

1. **Không có số nào trần trụi.** Mọi con số đều có đơn vị hoặc mốc so sánh đi kèm (`1.494 / 800`,
   `3/8 KIỆN`, `+10%, trần 1.600`). Người chơi không phải nhớ ngưỡng ở màn khác.
2. **Công thức hiện nguyên.** Dòng `gốc 20 × quân 1.50 × phe 1.00 × bậc 1.00` cho người chơi biết **đổi gì thì
   số nào nhúc nhích**. Đây là thứ duy nhất biến "đóng quân" từ một nút bấm thành một quyết định.
3. **Đồng hồ luôn đếm.** Mỗi giây một nhịp khi màn đang mở (`riotTick`), không phải mở lại màn mới thấy đổi.

### E3. Sửa nhỏ ở màn cũ

- HOME: nút **DẸP LOẠN** trỏ sang `riotmap`; dòng phụ đổi thành `4/9 BÃI · 12 KIỆN` (hoặc `TẦNG 7` nếu chưa
  chiếm bãi nào), và có chấm đỏ khi có kiện chờ hoặc bãi đang bị chiếm.
- SQUAD: người đang đồn trú → thẻ xám, nhãn `ĐỒN TRÚ`, không kéo thả được.
- Màn thang tầng cũ: nút lùi đổi từ `◂ BASE` thành `◂ KHU ĐÁY`.
- Bảng kết quả trận: thêm nút `◂ KHU ĐÁY` (chỉ hiện ở trận dẹp loạn) để không phải đi vòng qua HOME.

---

## F. Cân bằng

### F1. Đường cong độ khó — đo thật, 400 trận mỗi bãi

| Đội | `teamPower` |
|---|---|
| Yuki + Ash + Kai cấp 1 (đội mở đầu) | **4 208** |
| Cùng đội, cấp 20 (+76% ATK/HP) | **6 736** |

`node scratch/sim.js 400 yuki,ash,kai --yard [--lv 20]`:

| bãi | sức mạnh ổ | tỉ lệ cấp 1 | **win cấp 1** | nhãn cấp 1 | tỉ lệ cấp 20 | **win cấp 20** |
|---|---|---|---|---|---|---|
| `drop` | 3 697 | 1.14 | **99%** | ÁP ĐẢO | 1.82 | 100% |
| `drain` | 3 717 | 1.13 | **93%** | ÁP ĐẢO | 1.81 | 100% |
| `fence` | 3 860 | 1.09 | **85%** | ÁP ĐẢO | 1.75 | 100% |
| `smelter` | 4 066 | 1.03 | **71%** | NGANG SỨC | 1.66 | 100% |
| `market` | 4 208 | 1.00 | **50%** | NGANG SỨC | 1.60 | 100% |
| `church` | 4 357 | 0.97 | **44%** | NGUY HIỂM | 1.55 | 100% |
| `lift` | 7 118 | 0.59 | **0%** | TỰ SÁT | 0.95 | **72%** |
| `tower` | 7 450 | 0.56 | **0%** | TỰ SÁT | 0.90 | **64%** |
| `grave` | 7 523 | 0.56 | **0%** | TỰ SÁT | 0.90 | **45%** |

Đúng ba bậc như thiết kế: **vòng 1 thông ngay với đội gốc · vòng 2 là chỗ phải chọn (71 → 50 → 44%) · vòng 3
đóng kín cho tới khi nâng cấp**. Không cần thêm rào chắn nhân tạo nào.

Đối chiếu với cột "ngưỡng giữ bãi" ở §C: giữ hết 9 bãi ở 100% cần **30 600 điểm sức mạnh đồn trú**. Một đơn vị
chiêu mộ bậc B có power ≈ 1 230 (SCAV 1 228, CHUỘT CỐNG 1 196), nên đây là khoảng **20–25 đơn vị** ngoài đội
hình 3 người. Người chơi có tối đa 19 nhân vật + 20 đơn vị chiêu mộ = 39, nên đích này với tới được — nhưng chỉ
sau khi đã quay kha khá. Đó chính là chỗ roster rộng lấy lại giá trị.

**Hồi quy sau khi cài:** chiến dịch 100/100/100/76/35/21 % và tường thang tầng vẫn ở tầng 10 — **không lệch một
điểm nào** so với trước. `node scratch/ult_lint.js` xanh (60/60).

### F2. Thu nhập

Tổng ở bậc 1, đồn trú vừa đủ ngưỡng (hệ số quân 1.0), không tính ưu thế phe:

| | CR/kiện | SH/kiện | CR/giờ | SH/giờ |
|---|---|---|---|---|
| Vòng 1 (3 bãi) | 80 | 0 | 107 | 0 |
| Vòng 2 (3 bãi) | 165 | 4 | 220 | 5.3 |
| Vòng 3 (3 bãi) | 335 | 8 | 447 | 10.7 |
| **Cả 9 bãi** | **580** | **12** | **773** | **16** |

Thực tế nhận được ít hơn vì trần: nhận 3 lần/ngày, cách nhau 8 giờ, mỗi lần chỉ lấy được 6 giờ sản lượng →
**hiệu suất ≈ 75%** → khoảng **14 000 CR + 290 SH mỗi ngày** khi đã giữ đủ 9 bãi bậc 1.

Hiệu suất thật theo số lần vào game (`node scratch/riot_econ.js`):

| Vào game | Hiệu suất | CR/ngày | SH/ngày |
|---|---|---|---|
| 2 lần (cách 12 h) | 50% | 9 280 | 192 |
| **3 lần (cách 8 h)** | **75%** | **13 920** | **288** |
| 4 lần trở lên (cách ≤ 6 h) | 100% | 18 560 | 384 |

Đúng cái ý đồ: **trần 6 giờ biến "vào game lần thứ ba" thành phần thưởng chứ không phải nghĩa vụ** — bỏ một lần
cũng chỉ mất 25%, không mất trắng.

Đối chiếu các chỗ tiêu:

| Chỗ tiêu | Giá |
|---|---|
| Chiêu mộ ×10 (kẻ địch) | 5 400 CR |
| Requisition ×10 (nhân vật) | 270 SH |
| Nâng một cấp nhân vật (cấp `l`) | 400 × `l` CR |
| Nâng nhân vật 1 → 20 | 76 000 CR |
| Nâng cả 9 bãi lên bậc 5 | **464 000 CR** |

Giữ đủ 9 bãi ≈ **2,6 lượt chiêu mộ ×10 + 1 lượt Requisition ×10 mỗi ngày**. Đủ để thấy tiến bộ mỗi ngày, không
đủ để tiêu hết nội dung trong một tuần. Nâng bãi là cái hố sâu nhất: **33 ngày** ở mức thu nhập đó — cố ý, đó là
việc của tháng, và vì thu nhập tăng theo bậc nên đường cong tự dốc lên.

Thời gian hồi vốn của bậc 1 → 2 là **4,8 ngày cho MỌI bãi** — giá và sản lượng cùng tỉ lệ với `CR/kiện`, nên
không có cái bãi nào "đáng nâng hơn" cái nào. Người chơi nâng cái mình đang giữ, khỏi phải tra bảng.

> Hai chỗ dễ chỉnh nếu chơi thấy lệch: **cột `cr` trong `RIOT_YARDS`** (đổi tổng thu nhập) và **`capBase`**
> (đổi nhịp vào game). Đừng đụng công thức ở §D3.

### F3. Lệnh kiểm

```bash
node scratch/sim.js 400 yuki,ash,kai --yard            # 9 bãi: tỉ lệ thắng, sức mạnh ổ, nhãn
node scratch/sim.js 400 yuki,ash,kai --yard --lv 20    # cùng đội đã nâng cấp 20
node scratch/riot_tune.js m50 200 [cấp]                # đo lại m50 sau khi sửa `plan` của bãi
node scratch/riot_tune.js plan 200                     # đo lại `mult` cho đúng tỉ lệ thắng thiết kế
node scratch/riot_econ.js [hệ số quân] [ưu thế phe]    # thu nhập/giờ, hiệu suất, hồi vốn nâng bãi
node scratch/sim.js 200 yuki,ash,kai --riot 20         # thang tầng (không đổi)
```

Mục tiêu dò: **vòng 1 thông với đội mở đầu cấp 1** (≥ 85%) · **vòng 2 là 70 → 45%** · **vòng 3 chỉ mở khi đã
nâng cấp**. Nhãn ở §D1 phải khớp tỉ lệ thắng thật trong ±1 bậc, và chỉ được lệch về phía **bi quan**.

---

## G. Việc phải làm (và đã làm)

| # | Việc | File | Xong |
|---|---|---|---|
| R1 | Số liệu 9 bãi + hằng số kinh tế + toàn bộ logic (kết sổ, phản kích, đồn trú, nâng bãi, tuần) | `js/riot.js` (mới) | ✓ |
| R2 | Màn `riotmap` + tờ chi tiết bãi + đồng hồ đếm | `js/riotui.js` (mới) | ✓ |
| R3 | Giao diện | `css/riot.css` (mới) | ✓ |
| R4 | Markup 2 màn + nạp file mới + nút `◂ KHU ĐÁY` ở bảng kết quả | `index.html` | ✓ |
| R5 | Hồ sơ người chơi: `PLAYER.riot.yards / week / feed`, tự chuyển từ hồ sơ cũ | `js/riot.js` | ✓ |
| R6 | SQUAD khoá người đang đồn trú · nút HOME trỏ sang `riotmap` | `js/app.js` | ✓ |
| R7 | Trận chiếm bãi: thưởng + ghi bãi (bọc `winReward`, **không sửa** `battle.js`) | `js/riotui.js` | ✓ |
| R8 | Việc ngày "Nhận 5 kiện ở Khu Đáy" | `js/state.js` | ✓ |
| R9 | `--yard`/`--lv`/`--ymult`/`--only` cho sim · `riot_tune.js` (đo `m50` + `mult`) · `riot_econ.js` | `scratch/` | ✓ |
| R10 | Bản đồ District 07 vẽ bằng SVG (chờ ảnh thật) | `js/riotui.js` | ✓ |
| R11 | Prompt sinh ảnh | §H tài liệu này | ✓ |
| R12 | Ghi vào README + nhật ký | `README.md`, `docs/plan-2026-09.md` | ✓ |
| R13 | Cờ `?riot` / `?riot=all`: vào thẳng bản đồ, mở khoá trong phiên (Q15) | `js/riot.js`, `js/data.js`, `js/riotui.js` | ✓ 12/09 |
| R14 | Server kiểm `scratch/riot_serve.py` + launch `static-riot` chuyển `/` sang `?riot&riotfast&dev` | `scratch/`, `.claude/launch.json` | ✓ 12/09 |
| R15 | Bãi trống quân: đồng hồ đứng — không kiện rỗng, không phản kích (§D3) | `js/riot.js`, `js/riotui.js` | ✓ 12/09 |
| R16 | Art thật: `art/map/map_d07.jpg` + 9 `art/riot/yard_<id>.jpg`; đo lại 10 toạ độ nút trên ảnh (§C) | `art/`, `js/riot.js` | ✓ 12/09 |
| R17 | SVG dự phòng lấy toạ độ từ `RIOT_YARDS`/`RIOT_PIT` · thẻ nhãn hết xuống dòng (K5) · `art_audit` kiểm kê 10 file | `js/riotui.js`, `css/riot.css`, `scratch/art_audit.js` | ✓ 12/09 |

**Không làm ở đợt này** (ghi lại để khỏi quên): PvP tranh bãi, đổi ca đồn trú tự động, bãi có sự kiện theo mùa.
Linh kiện và cyberware đã làm cùng ngày 11/09 ở đợt 3+4 gộp (`docs/cyberware.md`); bãi vẫn chỉ đẻ CR + SH (Q7).
Danh sách còn nợ cập nhật ở **§K**.

---

## H. Art — cái gì code được, cái gì cần anh sinh

Nguyên tắc theo yêu cầu: **thử code trước**. Kết quả:

| Thứ | Code được? | Hiện đang là gì |
|---|---|---|
| Bản đồ District 07 | **Được** | **12/09: ảnh thật `art/map/map_d07.jpg` (941×1672, 439 KB)**. SVG `riotMapSvg()` trong `js/riotui.js` lùi về làm bản dự phòng khi thiếu file, và giờ lấy thẳng toạ độ mốc từ `RIOT_YARDS` nên không lệch khỏi ảnh được nữa. |
| Biểu tượng kiện / quân / phản kích / sức mạnh | **Được — nhưng chưa vẽ** | Giao diện đang dùng chữ (`KIỆN`, `QUÂN ĐÓNG`, `ĐỢT TỚI`) và chấm màu, đọc được. Bản 11/09 ghi "đã có SVG inline" là ghi nhầm — soát 12/09 không thấy trong `js/riotui.js`. Tuỳ chọn, K3. |
| Ảnh minh hoạ từng bãi | **Không cần ảnh mới** | **12/09: đủ 9 ảnh `art/riot/yard_<id>.jpg`** (1024×576, 163–194 KB). Chuỗi dự phòng `bg_07*.jpg` vẫn còn nguyên trong `yardBg()`. |
| Chấm/huy hiệu trạng thái | **Được** | CSS thuần. |

Kiểm kê 10 file này bằng `node scratch/art_audit.js` — mục **DẸP LOẠN** in từng bãi có ảnh riêng hay đang mượn nền.

### H1. `art/map/map_d07.jpg` — bản đồ DISTRICT 07 ✓ đã có (12/09)

Anh gửi hai bản; bản dùng là **bản 1** (lý do chọn ở Q16), gốc giữ ở `art-src/MAP/d07.png`, bản kia ở
`art-src/MAP/d07-alt.png`.

Quy cách **thực tế đang dùng: 941×1672 (9:16 dọc), JPEG, 439 KB** — đúng cỡ `map_halcyon.jpg` đang có, và
lớn hơn chỗ hiển thị (354 px rộng) gấp 2,7 lần nên màn hình dày pixel vẫn nét. Bản 11/09 ghi 1152×2048 là
số đặt ra trước khi có ảnh; phóng ảnh 941 lên 1152 chỉ làm file nặng thêm chứ không thêm nét, nên giữ cỡ gốc.

Nhìn từ trên xuống chếch khoảng 20° (isometric nông), **không** phải lát cắt dọc như `map_halcyon.jpg` —
đây là mặt bằng một quận.

Bố cục **đặt hàng** (prompt bên dưới viết theo bảng này) — ảnh sinh ra có đủ cả 10 mốc nhưng **cao độ lệch
so với đơn đặt**, nên toạ độ nút đã đo lại trên ảnh thật (bảng §C là bảng đang chạy, bảng dưới đây chỉ để
đọc prompt cho khớp):

| Dải | % ảnh | Phải có gì, ở đâu | Ảnh thật rơi vào |
|---|---|---|---|
| Chân Tháp | 0 – 12% | Bốn cọc móng bê tông khổng lồ cắm xuống, bóng đổ dài, ánh tím lạnh hắt từ trên | 0 – 12% ✓ |
| **TRUNG TÂM** | 12 – 35% | **Nghĩa địa thép** (60/14) · **tháp nước rỉ sơn số 9** (32/23) · **chân thang máy hàng** khung thép (63/32) | nghĩa địa dạt sang phải và xuống (80/31) · tháp nước lên cao (29/15) · thang máy (63/23) |
| **LÒNG KHU** | 36 – 62% | **Mái nhà thờ dưới cống** + thánh giá hàn từ ống (29/41) · **chợ thép** mái tôn chắp vá (61/50) · **sân lò đúc** còn bốc khói (33/59) | nhà thờ (27/39) ✓ · chợ (68/47) · lò đúc (25/55) |
| **VÀNH NGOÀI** | 63 – 90% | **Hàng rào tập đoàn** đứt đoạn chạy chéo qua (58/68) · **cống ba ngã** (30/77) · **bãi rơi cũ** xác xe + container (62/86) | hàng rào (45/63) · cống (33/75) · bãi rơi (72/83) |
| Đáy | 90 – 100% | **HỐ LOẠN**: một cái hố tròn tối om (34/95), miệng hố bốc khói đỏ | hố ra giữa đáy (46/91) |

Lệch nhiều nhất là **nghĩa địa thép**: đặt hàng ở 60/14, ảnh vẽ thành một ruộng tấm thép ở 80/31. Không sửa
ảnh — sửa `x/y` là đúng thứ tự việc (§H1 cuối mục), và bố cục ảnh đọc tự nhiên hơn bảng đặt hàng.

**Prompt (tiếng Anh, dùng cho Midjourney / Nano Banana / Flux):**

```
Top-down oblique map of a cyberpunk slum district, vertical 9:16 composition, rendered as a hand-drawn
tactical map on stained paper. Seven horizontal bands from top to bottom, each element at the stated
height (0% = top edge, 100% = bottom edge):

 0-12%  four colossal concrete tower footings punching down through the frame, long shadows, cold violet
        light bleeding down from above
12-35%  at 60% width / 14% height: a graveyard of upright steel grave-plates
        at 32% width / 23% height: a rusted water tower hand-painted with the numeral 9
        at 63% width / 32% height: the steel lattice foot of a freight elevator shaft
36-62%  at 29% / 41%: a church roof breaking up through the ground, a cross welded from pipe
        at 61% / 50%: a patchwork tin-roof scrap market
        at 33% / 59%: a smelter yard still smoking
63-90%  a broken corporate perimeter fence running diagonally across the whole band
        at 30% / 77%: a three-way storm drain junction, three mouths feeding one pit
        at 62% / 86%: a junk field of dead cars and shipping containers
90-100% at 34% / 95%: a round black pit, red smoke rising from its mouth

Palette: rust orange #E2703A and acid yellow #C9D830 in the lower half, cold violet #7C4DFF and pale steel
#DCE6F7 in the upper half, deep near-black background #0B0D12. Muted, grimy, high contrast, faint printed
grid overlay, scratches and coffee-stain texture, no text, no labels, no people, no logos.
Style: technical illustration meets weathered field map, ink and wash, cel-shaded, not photoreal.
--ar 9:16 --style raw
```

Hạ chuẩn sau khi sinh (đã chạy 12/09 — giữ nguyên cỡ gốc 941×1672, chỉ nén; `-q:v 5` ra ~440 KB):

```bash
ffmpeg -i "art-src/MAP/d07.png" -q:v 5 art/map/map_d07.jpg
```

**Kiểm sau khi thả file** (đã làm 12/09, cách làm cho lần sau): mở `?riot=all` ở 375×812, xem 10 cái chấm có
rơi đúng vật thể không. Lệch thì sửa `x/y` trong `RIOT_YARDS` (`js/riot.js`) **chứ đừng sửa ảnh** — và nhớ luật
≥ 8% ở §C. Muốn nhìn nhanh chấm nằm đâu mà không phải mở game thì vẽ chấm thẳng lên ảnh:

```bash
python -c "from PIL import Image,ImageDraw; im=Image.open('art/map/map_d07.jpg').resize((760,1350)); d=ImageDraw.Draw(im); [d.ellipse([760*x/100-11,1350*y/100-11,760*x/100+11,1350*y/100+11],outline=(0,255,120),width=3) for x,y in [(29,15),(63,23),(80,31),(27,39),(68,47),(25,55),(45,63),(33,75),(72,83),(46,91)]]; im.save('scratch/_nodes.png')"
```

### H2. `art/riot/yard_<id>.jpg` — ảnh từng bãi ✓ đã có đủ 9 (12/09)

Quy cách: **1024×576 (16:9), JPEG q81–85, 163–194 KB** (gốc 1672×941 ở `art-src/RIOT/<id>.png`).
Không có thì game lùi về `art/bg/bg_07*.jpg` — chuỗi dự phòng vẫn giữ trong `yardBg()`.

Ảnh hiện ở dải hero của tờ chi tiết: cao 22% màn (≈ 176 px trên 375×812), `cover` + `center 40%`, tức là
thấy gần trọn chiều cao ảnh, chỉ cắt hai mép trên dưới vài chục pixel. Chữ tên bãi đè lên nhờ lớp phủ tối
`.yard__img.has-img::after`, nên ảnh sáng cũng không nuốt chữ.

Hạ chuẩn cả bộ:

```bash
python -c "from PIL import Image; [Image.open('art-src/RIOT/%s.png'%n).convert('RGB').resize((1024,576),Image.LANCZOS).save('art/riot/yard_%s.jpg'%n,quality=85,optimize=True,progressive=True) for n in ['drop','drain','fence','smelter','market','church','lift','tower','grave']]"
```

Khung chung cho cả 9 prompt (chỉ đổi phần in đậm):

```
Cyberpunk slum location, wide 16:9 establishing shot, no people, no text.
<CẢNH>. Grimy rust-orange and acid-yellow palette, cold violet rim light from the distant spire above,
deep shadows, volumetric dust, wet concrete, cel-shaded illustration, high contrast. --ar 16:9 --style raw
```

| id | `<CẢNH>` |
|---|---|
| `drop` | A junk yard of crashed cargo drones and split shipping containers, one long gouge in the dirt where something heavy fell recently |
| `drain` | A three-way storm drain junction, three concrete mouths pouring grey water into a shared pit, gang tags on the rims |
| `fence` | A broken corporate perimeter fence, chrome-white panels torn open, warning strobes still blinking on the standing sections |
| `smelter` | An abandoned foundry yard, a cold crucible tipped on its side, slag frozen mid-pour, chain hoists overhead |
| `market` | A scrap market of patchwork tin roofs and hanging cables, stalls of stripped cyberlimbs and dead drones |
| `church` | The roof of a church built inside a storm drain, a bent cross welded from pipe, candles in ration tins |
| `lift` | The steel lattice foot of a freight elevator shaft, a loading platform the size of a street, cables vanishing upward into fog |
| `tower` | A rusted water tower with a hand-painted number 9, gangplanks and sniper nests built around the tank |
| `grave` | A graveyard of upright steel plates hammered with names, more than two thousand of them, in the shadow behind a foundry |

### H3. Cái đã code, không cần sinh ảnh

- **Bản đồ SVG dự phòng** — `riotMapSvg()` trong `js/riotui.js`. Vẽ 5 dải, khối nhà, ống cống, hàng rào chéo,
  miệng hố, sương ở phần chưa mở khoá. Từ 12/09 nó **lấy thẳng toạ độ mốc từ `RIOT_YARDS` + `RIOT_PIT`**
  (`x_svg = x% × 9`, `y_svg = y% × 16` trên viewBox 900×1600) nên sửa toạ độ một cái bãi là bản vẽ đi theo,
  không còn cảnh hai bản đồ chỉ hai chỗ khác nhau. Kiểm nó khi đã có ảnh thật: mở console gõ
  `rmArt.innerHTML = riotMapSvg()` sau khi bỏ `has-img`, hoặc đổi tên file ảnh đi rồi tải lại.
- **Biểu tượng** — *chưa làm* (bản 11/09 ghi là đã có, soát 12/09 thì không). Nếu làm: kiện hàng (thùng có nắp
  chéo), quân (hình người vai vuông), phản kích (mũi tên gãy), sức mạnh (tia), `<svg>` 16×16 inline trong
  `js/riotui.js`, đổi màu theo `currentColor`. Không bắt buộc — chữ đang đủ đọc (K3).

---

## I. Rủi ro

| Rủi ro | Xử lý |
|---|---|
| Vặn đồng hồ máy để ăn kiện | Chấp nhận (Q8). Có chặn thô: mốc thời gian ở tương lai > 1 phút thì kéo về `bây giờ`. |
| Đóng quân làm người chơi hết người ra trận | Q3 chặn ở gốc: người trong đội không đóng quân được, nên đội luôn còn nguyên (§D2). |
| Người chơi mới chiếm được bãi nhưng không có ai để đóng | Khối cảnh báo vàng ở mục 2 + nút dưới cùng nói rõ, chỉ thẳng sang GACHA (§D2). |
| 9 bãi × 6 mục = quá nhiều chữ trên màn dọc | Tờ chi tiết chỉ mở khi chạm, mỗi mục một dòng số + một dòng giải thích. Nút bãi trên bản đồ chở đúng 3 dòng — thêm dòng thứ tư là hai cái thẻ đè nhau (đã dính, xem §C). |
| Sản lượng quá tay làm hỏng gacha | §F2 đã đối chiếu với giá chiêu mộ/Requisition; chỉnh bằng `CR/kiện` trong `RIOT_YARDS`, không chỉnh công thức. |
| Xung đột với phiên khác đang sửa `battle.js` | R7 bọc `winReward`/`finish` từ `js/riotui.js`, **không chạm một dòng nào** trong `battle.js`. |
| Sửa `plan` của một bãi làm "sức mạnh ổ" nói sai | `m50` là số đo, không tự suy ra được. Sửa `plan` thì phải chạy lại `riot_tune.js m50` — đã ghi ngay trong comment của `RIOT_YARDS`. |

---

## J. Nhật ký

### 11/09 — dựng xong đợt 2 "chiếm bãi"

Viết tài liệu này rồi cài thẳng trong cùng một phiên. Ba chỗ bản thiết kế ban đầu **sai và phải sửa**:

**1. Cộng chỉ số kẻ địch không đo được độ khó.** Bản đầu tính "sức mạnh ổ" = wave nặng nhất theo công thức
`power()` × hệ số hao mòn. Sim bác ngay: tỉ lệ 0.85 thắng 100%, tỉ lệ 0.64 thắng 94%, tỉ lệ 0.55 thắng **0%** —
sai cả thứ tự. Nguyên nhân: công thức không nhìn thấy thợ hàn vá máu, lò nung dựng lá chắn, trùm gây choáng.
Thay bằng mốc neo đo được `m50` (§D1) và viết `scratch/riot_tune.js` để đo. Đo xong mới lộ ra **đội hình wave
nặng hơn `mult` tới hai lần rưỡi**: SÂN LÒ ĐÚC `m50` 0.89 còn CỐNG BA NGÃ `m50` 2.23 — cùng một dàn quân,
cùng một con số `mult`, mà một cái là tường còn một cái là sân tập.

**2. `mult` rải đều theo vòng là vô nghĩa.** Bảng đầu đặt 0.85 → 1.70 tăng đều. Sau khi có `m50`, mult được
**đo ngược** từ tỉ lệ thắng thiết kế (`riot_tune.js plan`), ra một dãy trông lộn xộn nhưng đúng: SÂN LÒ ĐÚC
`0.86` *khó hơn* CỐNG BA NGÃ `1.97`. Kết quả 400 trận/bãi ở §F1 — đúng ba bậc 99/93/85 · 71/50/44 · 0/0/0,
và với đội cấp 20 thì vòng 3 thành 72/64/45.

**3. Nút trên bản đồ cách nhau 2% là hai cái thẻ đè lên nhau.** Toạ độ đầu đặt theo "trông cho tự nhiên";
CHỢ THÉP (50/58) và SÂN LÒ ĐÚC (72/60) chồng chữ lên nhau ngay lần chạy đầu. Thẻ cao ~46 px trên màn 375 nên
phải giãn đều **9% một nút**, và thẻ chỉ được chở đúng 3 dòng.

Ba lỗi nhỏ hơn bắt được khi chạy thật:
- Đồng hồ 1 giây quét `.ynode__cd` của **mọi** nút nên bãi khoá và bãi chưa chiếm cũng bị ghi đè thành
  "ĐẦY TRẦN". Thêm `data-live` để chỉ bãi đang giữ mới bị đồng hồ chạm vào.
- Cùng lỗi đó ở tờ chi tiết: bãi ĐANG BỊ CHIẾM hiện "ĐẦY TRẦN" thay vì "ĐÓNG BĂNG".
- Người chơi mới sở hữu đúng 3 người, cả 3 trong đội → chiếm bãi xong không đóng được ai và bãi nằm không,
  **không có chỗ nào trên màn nói lý do**. Thêm khối cảnh báo + đổi nút dưới cùng theo việc tiếp theo (Q13).

**Hồi quy:** chiến dịch 100/100/100/76/35/21 %, tường thang tầng vẫn ở tầng 10, `ult_lint` 60/60 — không lệch
một điểm nào. Console 0 lỗi JS; 404 duy nhất do mình thêm là `art/map/map_d07.jpg` và `art/riot/yard_*.jpg`,
cả hai đều là chuỗi dự phòng cố ý.

**Còn nợ:** một ảnh bản đồ `art/map/map_d07.jpg` (prompt §H1). Chín ảnh bãi là tuỳ chọn (§H2).

### 12/09 — vào thẳng bản đồ để kiểm, và một lỗi bãi trống quân

Anh cần kiểm chế độ này mà không muốn đi qua tiêu đề → HOME → thắng 07-A mỗi lần tải lại. Thêm cờ `?riot`
(Q15): `js/riotui.js` gọi `go('riotmap')` ngay sau khi `app.js` mở màn tiêu đề, còn `riotUnlocked()` trong
`data.js` coi cờ này như đã xong 07-A — **chỉ trong phiên**, hồ sơ không đổi một byte. `?riot=all` bỏ thêm
điều kiện tầng để mở cả 9 bãi. `scratch/riot_serve.py` là `http.server` cộng một dòng chuyển hướng `/` →
`/index.html?riot&riotfast&dev`, và launch `static-riot` (cổng 8802) trỏ vào nó: bấm chạy là đứng trong Khu Đáy.

Kiểm bằng chính cái đó thì lộ ngay một lỗi bản 11/09 không thấy, vì hôm đó chưa để bãi nằm không đủ lâu:
**bãi chiếm được mà chưa đóng quân vẫn đẻ kiện.** Kiện 0 CR, nhưng vẫn đếm — nút bãi hiện huy hiệu "1", nút
dưới cùng nói "NHẬN KIỆN · 1 KIỆN · +0 CR", nhận thì vẫn cộng vào hợp đồng tuần "nhận 40 kiện" và việc ngày.
Tệ hơn: biến đếm phản kích cũng chạy, nên đúng 6 chu kỳ sau bãi thua phản kích **với 0 quân** — ở `?riotfast`
là 90 giây, ngoài đời là 4 giờ 30. Người chơi mới (3 người đều trong đội, không đóng được ai — đúng cái ngõ cụt
đã ghi ở §D2) chiếm được bãi rồi mất bãi trước khi kịp quay được người thứ tư, mà không có chỗ nào giải thích.
§D3 nói rõ hệ số quân 0 là không đẻ kiện, và chính dòng chữ trên nút cũng nói "BÃI TRỐNG QUÂN THÌ KHÔNG ĐẺ
KIỆN" — code chỉ quên làm đúng lời mình hứa.

Sửa: `yardIdle()`; bãi trống quân thì `settleYard` đặt `mốc = bây giờ` rồi thoát, `yardNextMs` trả null,
`riotSummary` đếm riêng `idle` để không tính vào thu nhập/giờ. Giao diện phải phân biệt hai lý do "không đếm":
đầy trần (đồng hồ ngừng) và chưa có quân (đồng hồ chưa chạy) — bản 11/09 gộp cả hai thành "ĐẦY TRẦN", giờ in
`CHƯA CÓ QUÂN` ở đầu màn, ở nút bãi và ở mục 4; chip phản kích nói `ĐỨNG YÊN`.

Kiểm lại toàn bộ vòng lặp với `?riotfast` (chiếm bằng `captureYard()` để đi nhanh): bãi trống 17 giây (hơn một
chu kỳ) không đẻ gì · đóng SCAV vào là 15 giây sau có kiện 35 CR (20 × 1.5 × 1.15, công thức in đúng) · nhận
cộng ví + hợp đồng tuần + việc ngày · nâng bậc trừ 800 CR lên bậc 2, trần 10 · ép `rc = 5` thì đợt phản kích
giữ được +24 CR và vào báo cáo · ép `held = 6` (phản kích 1 280 > SCAV 1 228) thì thất thủ, 4 kiện + 212 CR
đóng băng · giành lại trả nguyên vẹn · báo cáo và hợp đồng tuần in đúng thứ tự · HOME báo "8 KIỆN CHỜ" + chấm
đỏ. 375×812 và 375×667 đều vừa khung, không cuộn trang.

Hai chỗ chữ nhỏ sửa luôn: ô "KIỆN TIẾP THEO" nói `GIÀNH LẠI BÃI ĐÃ MẤT` thay vì "CHƯA CHIẾM BÃI NÀO" khi bãi
duy nhất đang bị chiếm; §D3 ghi kết sổ "mỗi 30 giây" trong khi code và §E2 nói mỗi giây — sửa tài liệu theo code.

**Soát lại việc còn nợ → §K.** Đáng chú ý: §H3 bản 11/09 ghi bộ biểu tượng SVG 16×16 "đã code" nhưng không có
trong `js/riotui.js` (K3); `claimYard()` đặt `mốc = bây giờ` làm mất phần lẻ của chu kỳ đang chạy (K6) — cái này
là quyết định của §D3 chứ không phải lỗi, nên ghi ra để anh quyết chứ tôi không tự đổi.

**Hồi quy:** `ult_lint` 60/60, `comic_lint` + `art_audit` không có gì mới, `sim.js --yard` 40 trận/bãi cùng
thứ bậc (100/100/90 · 80/45/30 · 0/0/0 — lệch ngẫu nhiên của mẫu nhỏ, không đổi số nào). Console: chỉ 404 của
`map_d07`, `art/riot/yard_*` và mấy file SFX đợt 3 đang chờ anh (`tell`, `new_char`, `reveal_a`, `hit3`).

### 12/09 (chiều) — art về: bản đồ thật + 9 ảnh bãi

Anh gửi 11 ảnh: hai bản đồ District 07 (941×1672) và đúng 9 cái bãi (1672×941), tên file trùng luôn `id`
trong `RIOT_YARDS`. Đây là K1 + K2 của §K, làm hết trong một phiên.

**Chọn bản đồ bằng thước, không bằng mắt (Q16).** Hai bản gần như cùng một bố cục, khác ánh sáng. Cái quyết
định không phải bản nào đẹp hơn mà bản nào **đặt được 10 cái nút**: thẻ nhãn mọc vào giữa màn nên hai nút
cách nhau dưới 8% là hai thẻ đè nhau, tức là 10 nút cần trải gần hết chiều cao ảnh. Bản 1 rải mốc đúng
khoảng đó (chợ 47%, hàng rào 63%, hố giữa đáy 91%); bản 2 dồn chợ + nhà thờ vào cùng dải 33–38% rồi bỏ trống
58–70%, nhét vào là chấm rơi ra chỗ trống. Bản 2 giữ ở `art-src/MAP/d07-alt.png`.

**Ảnh đúng nhưng cao độ lệch bảng đặt hàng — sửa toạ độ, không sửa ảnh.** §H1 dặn sẵn như vậy từ 11/09 và lần
này dùng đến thật: nghĩa địa thép đặt ở 60/14 nhưng ảnh vẽ thành ruộng tấm thép ở **80/31**, tháp nước lên
29/15, chợ xuống 68/47, hố ra giữa đáy 46/91. Đo bằng cách vẽ chấm thẳng lên ảnh (lệnh ở cuối §H1) rồi đối
chiếu trong game. Cả 10 toạ độ ở §C là số mới.

**Hai chỗ code phải sửa theo art:**
- **Bản vẽ SVG dự phòng vẽ theo bộ toạ độ cũ** → sau khi đổi `x/y` thì chấm rơi lệch khỏi hình nó vẽ. Sửa
  gốc: `riotMapSvg()` giờ đọc thẳng `RIOT_YARDS` + `RIOT_PIT` (`x×9`, `y×16`), mọi mốc vẽ tương đối quanh đó.
  Không còn hai bảng toạ độ trong repo. `RIOT_PIT` cũng thay cho hai con số cắm cứng `34%/95%` ở `renderRiotNodes`.
- **K5 (thẻ "CHÂN THANG MÁY" xuống dòng) thành lỗi thật sự chứ không còn là chuyện thẩm mỹ**, vì luật ≥ 8%
  tính theo thẻ **3 dòng cao 45 px**; thẻ 4 dòng là 58 px, đủ để đè lên bãi bên trên. Đo trong trình duyệt:
  tên dài nhất 99 px + 12 padding + 2 viền = **113 px**, mà `max-width` ở màn ≤ 380 px đang là **112 px** —
  thiếu đúng một pixel. Nâng lên 118 px.

**Kiểm:** 375×812 và 375×667, `?riot=all&riotfast&dev` — 10 chấm nằm đúng mốc, không thẻ nào xuống dòng,
không thẻ nào đè nhau, tờ chi tiết mở ra có ảnh bãi riêng (`yard_drop.jpg` … ), console 0 lỗi JS. Network:
`map_d07.jpg` và `yard_*.jpg` 200 — hết sạch 404 của art, chỉ còn mấy file SFX đợt 3 đang chờ anh
(`tell`, `tell_up`, `tell_down`, `reveal_a`, `new_char`, `hit3`). `art_audit.js` thêm mục **DẸP LOẠN** kiểm kê
10 file này; `ult_lint` 60/60 không đổi.

**Ảnh bãi còn đi thêm một chỗ không định trước: nền trận đánh.** `yardSector()` lấy `bg:yardBg(y)`, nên đánh
BÃI RƠI CŨ giờ đứng trên đúng cái bãi container của nó thay vì nền `bg_07a` chung. Chín cái bãi thành chín nền
trận khác nhau, không phải sửa dòng nào.

### 12/09 (chiều, tiếp) — đánh tay trận chiếm bãi và trận giành lại (K7)

Hai trận đánh bằng nút thật ở hồ sơ trắng (đội mở đầu cấp 1, `?riot&riotfast&dev`), không gọi `captureYard()`:

| | CHIẾM BÃI | GIÀNH LẠI |
|---|---|---|
| Vào trận | nút dưới tờ chi tiết: `2 WAVE · ÁP ĐẢO · +200 CR` | `2 WAVE · ĐỘ KHÓ ×1.6 · GIỮ NGUYÊN QUÂN VÀ KIỆN` |
| Máu ổ | SCAV 1 203 · CHUỘT CỐNG 978 | SCAV 1 024 · CHUỘT CỐNG 832 — đúng ×0.85 của §D4 |
| Kết quả | THẮNG · round 16 · 2/3 sống sót | THẮNG · round 14 · 3/3 sống sót |
| Bảng kết quả | `CHIẾM ĐƯỢC BÃI RƠI CŨ · +200 CR · +2 SH` + `ĐÓNG QUÂN VÀO ĐỂ BÃI BẮT ĐẦU ĐẺ KIỆN` | `GIÀNH LẠI BÃI RƠI CŨ · +100 CR · +1 SH` + `KIỆN ĐÓNG BĂNG ĐÃ ĐƯỢC TRẢ LẠI` |
| Ví | 3 000 → 3 200 CR · 300 → 302 SH | → 3 300 CR · 303 SH |
| Hồ sơ bãi | `state:'own'`, quân rỗng, bậc 1 | `state:'own'`, **4 kiện + 212 CR đóng băng trả lại nguyên vẹn** |
| Hợp đồng tuần · việc ngày | `win` 1 · việc ngày `win` 1 | `win` 2 |
| Nút `◂ KHU ĐÁY` | hiện, bấm về thẳng bản đồ | hiện |

Về tới bản đồ: nút bãi thành `is-own`, thẻ in `0/1 QUÂN · BẬC 1` + `0/8 · CHƯA CÓ QUÂN`, đầu màn `GIỮ 1/9`,
`THU NHẬP 0 CR/GIỜ`, ô kiện tiếp `CHƯA CÓ QUÂN`, chip BÁO CÁO nhảy 1 — tức là **R15 (bãi trống quân thì đồng hồ
đứng) đúng cả khi bãi về bằng trận thật**, không riêng lúc gọi hàm.

Một lỗi chữ sửa luôn: dòng thưởng là dòng dài nhất trong game, ở 375 px nó gãy đúng giữa `+2` và `SH` — số một
dòng, đơn vị một dòng, đọc như hỏng. Thêm `&nbsp;` giữa số và đơn vị nên chỗ gãy rơi vào dấu `·`.

**Mã màn đổi thành `BÃI 1`…`BÃI 9` (anh chốt).** Ô SECTOR trên đầu màn trận trước in `BÃI-DROP` — `yardSector()`
ghép `'BÃI-' + id`, mà `id` là chữ Anh trong code và đây là chỗ duy nhất nó lọt ra màn hình (chiến dịch in `07-A`).
Số lấy từ `yardNo()` = vị trí trong `RIOT_YARDS`, **đúng bằng cột `#` của bảng §C** (vành ngoài → trung tâm, cũng
là thứ tự mở khoá): BÃI 1 = BÃI RƠI CŨ … BÃI 9 = NGHĨA ĐỊA THÉP. Tờ chi tiết thêm chip **`BÃI n`** đứng trước
RUST/CHROME, nếu không thì con số ở màn trận không tra được ở đâu ra. Đổi thứ tự `RIOT_YARDS` là đổi luôn số này
— muốn giữ số cố định thì phải thêm cột `no` vào bảng.

**Cách đánh tay một trận để kiểm (ghi lại cho lần sau, tốn nhiều lượt nhất ở đây):** bấm nút theo thời gian
cố định là hỏng — lượt nào cũng có hoạt ảnh dài ngắn khác nhau, bấm sớm thì mất lượt. Cách chạy được: bật
`PLAYER.settings.motion=true` (đúng công tắc GIẢM CHUYỂN ĐỘNG trong CONFIG) rồi **chờ tới khi `#btnAttack` hết
`disabled` mới bấm**, mỗi lượt hai cú: ATTACK rồi chạm kẻ địch.

---

## K. Còn chưa làm — soát lại 12/09

Đối chiếu §B–§H với code đang chạy (`js/riot.js`, `js/riotui.js`, `css/riot.css`) và chạy thử toàn bộ vòng lặp
bằng `?riot&riotfast&dev` ở 375×812 và 375×667. Những gì còn lại, xếp theo thứ đáng làm trước:

| # | Việc | Bắt buộc? | Ghi chú |
|---|---|---|---|
| ~~K1~~ | ~~Ảnh bản đồ `art/map/map_d07.jpg`~~ | — | **Xong 12/09.** 941×1672, 439 KB, bản 1 trong hai bản anh gửi (Q16). Toạ độ 10 nút đo lại trên ảnh → §C. |
| ~~K2~~ | ~~Chín ảnh bãi `art/riot/yard_<id>.jpg`~~ | — | **Xong 12/09.** Đủ 9/9, 1024×576. Kiểm kê bằng `node scratch/art_audit.js` mục DẸP LOẠN. |
| K3 | Biểu tượng 16×16 (kiện · quân · phản kích · sức mạnh) | Không | §H3 bản 11/09 ghi "đã code" nhưng thật ra chưa; giao diện dùng chữ và đọc được. |
| K4 | `sim.js` chưa mô phỏng cyberware → bảng §F1 là **sàn** | Nên | Đội đã lắp cyberware mạnh hơn số in; vòng 3 (72/64/45 % ở cấp 20) sẽ dễ hơn thực tế. Cách làm: nạp `js/cyber.js` + `PLAYER.cyber` giả vào `sim.js --yard`, đo lại `m50` vòng 3 bằng `riot_tune.js m50 200 20`. Nhãn đang lệch về phía bi quan nên chưa gấp. |
| ~~K5~~ | ~~Thẻ nhãn "CHÂN THANG MÁY" xuống dòng thành 4 dòng ở 375 px~~ | — | **Xong 12/09** (thành bắt buộc khi giãn nút xuống 8%): `.ynode__card` ở màn ≤ 380 px lên `max-width:118px`. Đo thật: tên 99 px + 12 padding + 2 viền = 113, bản cũ để 112. |
| K6 | Nhận kiện làm mất phần lẻ của chu kỳ đang chạy | Anh quyết | §D3 chốt `mốc = bây giờ` khi nhận. Hệ quả: nhận lúc kiện kế còn 5 phút thì đồng hồ nhảy về 45:00, mất 40 phút — trung bình mất nửa kiện mỗi lần nhận, 3 lần/ngày ≈ 6–8 % sản lượng, và người chơi **nhìn thấy** đồng hồ nhảy lùi. Sửa là bỏ dòng `s.t0=Date.now()` trong `claimYard()` (`settleYards()` ngay trước đó đã đặt mốc đúng cho cả hai trường hợp đầy/chưa đầy). Đổi thì số ở §F2 nhích lên chừng đó. |
| ~~K7~~ | ~~Trận chiếm bãi thật (qua `battle.js`)~~ | — | **Xong 12/09 (chiều).** Đánh tay cả hai đường ở BÃI RƠI CŨ — CHIẾM BÃI và GIÀNH LẠI — bằng nút thật, không gọi `captureYard()`. Kết quả ở §J. |
| K8 | Việc còn treo từ §G: PvP tranh bãi · đổi ca đồn trú tự động · bãi có sự kiện theo mùa | Không | Chưa có lý do làm trước chương 2. |

Đã xong 12/09 và rút khỏi danh sách: cờ `?riot` + server kiểm (Q15, R13–R14), lỗi bãi trống quân (R15).
