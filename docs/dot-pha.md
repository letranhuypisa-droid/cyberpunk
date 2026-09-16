# ĐỘT PHÁ — bốn cái đích trên thang 20 cấp (đợt 7, D4)

> Lập 16/09/2026. Bản nháp nằm ở `docs/giu-chan.md` §D4; tài liệu này là đặc tả thật, đã sửa theo **dữ liệu
> trong `ROSTER`** chứ không theo giả định của bản nháp.

## A. Vấn đề

Nâng cấp hiện tại: **20 cấp, +4% ATK/HP mỗi cấp, giá 400 × cấp** (tổng 76.000 CR cho một người, +76% chỉ số).
Hai mươi cấp giống hệt nhau — không có cấp nào đáng nhớ, không có cấp nào phải chuẩn bị. Và **bản dư**
(`PLAYER.extra`) chỉ có đúng một đường dùng: phân tách lấy LK.

## B. Hai chỗ bản nháp sai, phát hiện khi đọc dữ liệu

| Bản nháp §D4 | Dữ liệu thật | Xử lý |
|---|---|---|
| "cấp 5 mở **nội tại thứ hai**" | **20/39 đơn vị chỉ có MỘT nội tại** (15 có hai, 4 có ba) — nửa roster không có gì để mở | Bỏ. Thưởng phải là thứ **ai cũng có** |
| "tốn **bản dư của chính nhân vật đó**" | `STORY_ONLY = ['yuki','psalm']` không nằm trong bể gacha → **không bao giờ có bản dư** | Bản dư là đường **rẻ**, LINH KIỆN là đường **luôn có** |

## C. Thiết kế

**Đột phá là CỬA, không phải phần thưởng phụ.** Cấp 5 · 10 · 15 là trần tạm: đủ CR cũng không lên cấp tiếp
được cho tới khi đột phá. Cấp 20 là đỉnh — đột phá thứ tư không mở thêm cấp, nó là phần thưởng cuối.

| Mốc | Ở cấp | Mở tới cấp | Giá CR | Trả bằng bản dư | Hoặc trả bằng LK | Thưởng |
|---|---|---|---|---|---|---|
| **★ I** | 5 | 10 | 2.000 | 1 | 60 | **+6% ATK/HP** |
| **★ II** | 10 | 15 | 6.000 | 1 | 90 | **vào trận có sẵn 20 Energy** |
| **★ III** | 15 | 20 | 12.000 | 2 | 150 | **+6% ATK/HP · +5 CRIT** |
| **★ IV** | 20 | — (đỉnh) | 24.000 | 3 | 240 | **chiêu cuối ×1.15 hệ số** |

Cộng lại ở ★IV: **+12,4% ATK/HP** (1,06 × 1,06, nhân chứ không cộng — cùng luật với cyberware),
**+20 Energy vào trận**, **+5 CRIT**, **chiêu cuối ×1,15**. Tổng chi thêm: **44.000 CR** + (7 bản dư · hoặc 540 LK).

**Vì sao mỗi mốc một loại thưởng khác nhau:** bốn lần cùng một thứ (+6% mãi) thì mốc thứ tư không đáng nhớ
hơn mốc đầu. Energy khởi đầu đổi *cách mở trận* (tung chiêu sớm hơn một lượt), CRIT đổi *cảm giác từng đòn*,
chiêu cuối ×1.15 đổi *đỉnh của trận* — ba thứ người chơi cảm được ngay mà không phải đọc bảng số.

**Vì sao giá LK cố định theo mốc, không theo bậc nhân vật:** để dòng chữ trên nút luôn đọc được ("240 LK")
thay vì phải giải thích vì sao Yuki đắt hơn Scav. Bản dư vẫn luôn là đường rẻ hơn cho người quay được.

**Ảnh hưởng cân bằng — có, và ở đâu:**
- `scratch/sim.js` chạy 6 màn chiến dịch bằng **đội cấp 1**, nên bảng cân bằng chương 1 **không đổi một điểm nào**.
- Chỗ thật sự đổi là **DẸP LOẠN**: `power()` đọc `unitStats`, nên đội đã đột phá có sức mạnh cao hơn và
  ngưỡng giữ bãi dễ đạt hơn. Sim chế độ bãi (`--yard --lv N`) nay tự áp bonus đột phá theo cấp, vì trong
  game **không có đường nào lên cấp 20 mà chưa đột phá đủ bốn lần**.
- Chiêu cuối ×1.15 chỉ áp cho **đội mình**, không áp cho bản chiêu mộ đứng phía địch (chúng dùng def gốc).

## D. Cài ở đâu

| File | Thêm gì |
|---|---|
| `js/data.js` | `ASCEND` — bảng 4 mốc (cấp, giá CR, số bản dư, giá LK, thưởng) · `PLAYER.asc` |
| `js/state.js` | `ascStars/ascNext/ascCost/canAscend/ascend/ascBonus` · `unitStats` nhân thêm · `upgrade()` chặn ở cửa |
| `js/battle.js` | Energy khởi đầu và hệ số chiêu cuối của đột phá lúc dựng unit |
| `js/app.js` | Khối ĐỘT PHÁ trong hồ sơ nhân vật (4 ô sao, nút đột phá, hai cách trả) |
| `js/core.js` | Dấu ★ trên thẻ nhân vật |
| `scratch/sim.js` | `--lv` áp luôn bonus đột phá tương ứng |

## E. Kiểm

```bash
node scratch/sim.js 400                       # 6 màn chương 1: KHÔNG được lệch (sim đánh bằng đội cấp 1)
node scratch/sim.js 300 yuki,ash,kai --yard --lv 20   # bãi: đội cấp 20 giờ đã gồm 4 sao
node scratch/check.js
```

Chơi thử: nâng Yuki tới cấp 5 → nút Upgrade phải đổi thành **ĐỘT PHÁ**, không lên cấp 6 được cho tới khi
đột phá; Yuki không có bản dư nên chỉ còn đường LK; sau ★II vào trận phải thấy thanh Energy đã có sẵn 20.

## F. Đo thật sau khi cài (16/09)

**Chiến dịch không lệch một điểm nào** — `node scratch/sim.js 400` cho 100/100/100/81/40/21, nằm gọn trong
khoảng nhiễu của chính lệnh đó (hai lần chạy cùng code trước đây ra 80/33/21 và 77/39/25). Đúng như dự đoán:
sim đánh 6 màn bằng **đội cấp 1**, mà cấp 1 thì chưa có sao nào.

**Chỗ thật sự đổi là DẸP LOẠN.** Cùng một lệnh, chỉ khác bật/tắt đột phá (`SIM_PATCH="ASCEND.length=0"`):

| Bãi | Cấp 20, **không** đột phá | Cấp 20 + **4 sao** |
|---|---|---|
| CHÂN THANG MÁY | 77% · nhãn NGUY HIỂM | **99%** |
| THÁP NƯỚC SỐ 9 | 63% · nhãn NGUY HIỂM | **98%** |
| NGHĨA ĐỊA THÉP | 44% · nhãn NGUY HIỂM | **96%** |

Đây là **hệ quả cố ý** (bỏ 44.000 CR + 7 bản dư thì phải mạnh lên thật), nhưng nó phơi ra một lỗi cũ:
nhãn độ khó vẫn ghi **NGANG SỨC** trong khi tỉ lệ thắng là 96–99%. Lý do: `power()` chỉ cộng bốn chỉ số,
mà hai thưởng đột phá — **Energy mở màn** và **chiêu cuối ×1.15** — không nằm trong bốn chỉ số ấy.
Đã sửa: `ascPowerExtra()` trong `js/state.js` cộng thêm phần phi-chỉ-số (0,03 cho Energy + một nửa phần
chiêu cuối tăng thêm ⇒ **+10,5%** ở bốn sao), và `scratch/sim.js` dùng đúng công thức đó. Sau khi sửa,
ba bãi trên hiện tỉ lệ 1,10–1,16 → nhãn **ÁP ĐẢO**, khớp với 96–99% thật.

**Việc còn nợ, không làm trong đợt này:** đội đủ bốn sao thắng **96–100% cả chín bãi**, tức DẹP LOẠN hết
thử thách ở cuối đường nâng cấp. Cách sửa đúng là **thêm bậc bãi khó hơn** (hoặc nâng `mult` ba bãi cuối)
khi chương 2 mở thêm địch — chỉnh bây giờ sẽ đá vào người chơi chưa đột phá, vốn đang đúng độ khó.

## G. Nhật ký

### 16/09 — dựng D4

**Đọc dữ liệu trước khi tin bản nháp.** Hai ý trong `giu-chan.md` §D4 chết ngay khi mở `ROSTER` ra đếm:
"mở nội tại thứ hai" (20/39 đơn vị chỉ có một nội tại) và "trả bằng bản dư của chính nhân vật đó"
(Yuki và Psalm thuộc `STORY_ONLY`, không vào bể quay, vĩnh viễn 0 bản dư — sẽ kẹt ở cấp 5).

**Đột phá là CỬA nên "cấp 20" luôn đồng nghĩa "bốn sao".** Tính chất đó làm `scratch/sim.js` đơn giản hẳn:
`--lv 20` tự áp bonus bốn sao, không cần thêm cờ. Nhưng phải nhớ sim **giả lập cấp bằng cách nhân thẳng vào
def**, không đi qua `PLAYER.levels`/`PLAYER.asc`, nên `unitStats()` trong sim không nhìn thấy sao — phần
phi-chỉ-số phải cộng tay ở chỗ tính `mine`. Lần đầu quên, bảng in ra tỉ lệ 1,00 trong khi thắng 99%.

**Nút nâng cấp phải nói vì sao nó tắt.** Khi chạm trần tạm, nút đổi chữ thành `CẦN ĐỘT PHÁ ★N` thay vì chỉ
mờ đi — người chơi đủ 200.000 CR mà nút xám không giải thích gì là chỗ dễ tưởng game hỏng nhất.

**Chữ mô tả chiêu cuối vẫn in số gốc.** `ult.desc` là văn viết tay trong `data.js` ("gây 320% ATK"), còn số
thật sau ★IV là 368%. Nút chiêu và bảng chỉ số đọc `u.ult.mult` nên hiện đúng; sinh 39 câu mô tả động chỉ
để khớp một dòng chữ là không đáng, nên chênh này được ghi lại ở đây thay vì sửa.
