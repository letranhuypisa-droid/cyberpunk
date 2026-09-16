# CHẾ ĐỘ CHƠI — AUTO, tốc độ, quét nhanh, đánh tiếp (đợt 5)

> Lập 16/09/2026. Phạm vi: **nhịp chơi** của ba chế độ đang có (chiến dịch · HỐ LOẠN · chiếm bãi),
> không thêm chế độ mới, không đổi một con số cân bằng nào.
> Liên quan: `docs/plan-2026-09.md` (kế hoạch tháng), `docs/dep-loan.md` (chiếm bãi), `docs/cyberware.md` (hố tiêu CR).

## A. Vấn đề

Bốn đợt giữ chân trước đã cho game **đủ chỗ để chơi**: 6 màn chương 1, thang HỐ LOẠN 40 tầng,
9 cái bãi, 60 món cyberware, 39 đơn vị. Cái còn thiếu không phải nội dung nữa mà là **nhịp**:

| Hiện trạng 16/09 | Con số |
|---|---|
| Một trận 3 wave ở tốc độ cũ (đo ở §C) | **96,7 giây · 52 lượt**, mỗi lượt của mình là 2 cú chạm |
| Để một nhân vật kịch 6 ô cyberware | 132.480 CR ≈ **170 trận** HỐ LOẠN tầng 20 |
| Nút để bỏ qua animation | **không có** |
| Nút để máy tự đánh | **không có** |
| Nút để lấy thưởng màn đã thắng mà không đánh lại | **không có** |

Nghĩa là mọi hố tiêu tiền dựng ở đợt 3–4 đều đòi số giờ mà cái nhịp hiện tại không trả nổi. Người chơi
không bỏ game vì hết nội dung — họ bỏ vì trận thứ ba mươi vẫn dài y như trận đầu.

Đợt này làm bốn thứ, tất cả đều là **điều khiển nhịp**, không phải nội dung mới:

1. **AUTO** — máy đánh thay, luật chơi ghi rõ ở §B.
2. **TỐC ĐỘ ×1 / ×2 / ×3** — chia mọi khoảng chờ trong trận (§C).
3. **QUÉT NHANH** — màn/tầng đã thắng: lấy thưởng chơi lại, không vào trận, có trần vé mỗi ngày (§D).
4. **ĐÁNH TIẾP** — thắng rồi đi thẳng sang tầng/màn kế từ bảng kết quả (§E).

## B. AUTO — máy đánh thay

Nút `AUTO` ở hàng trên trong trận, cạnh RESET. Bấm được bất cứ lúc nào, kể cả khi đang chọn mục tiêu
(đang chọn thì huỷ chế độ chọn rồi máy đánh tiếp). Trạng thái lưu ở `PLAYER.settings.auto`, nên
**bật một lần là trận sau vẫn bật** — người cày 30 trận một tối không phải bấm 30 lần.

Luật máy chơi (`autoPlan` trong `js/battle.js`) — cố ý ngắn và đoán được, để người chơi tin được nó:

| Tình huống | Máy làm gì | Vì sao |
|---|---|---|
| Chưa đủ Energy | đòn thường vào con **HP hiện tại thấp nhất** | bớt một con địch là bớt một lượt bị đánh; Yuki còn ăn thêm đòn kết liễu dưới 35% HP |
| Đủ Energy · `nuke` | tung ngay, vào con **HP thấp nhất** | `target:'lowest'` (CULL) thì chiêu tự khoá, máy không chen vào |
| Đủ Energy · `aoe` | tung ngay | diện rộng không có mục tiêu để chọn sai |
| Đủ Energy · `shield` | tung ngay | lá chắn không đếm lượt, đắp sớm không mất gì |
| Đủ Energy · `control` | tung ngay, vào con **nguy hiểm nhất**: trùm → elite → ATK cao nhất | chiếm quyền một con lính thường là đổ chiêu |
| Đủ Energy · `heal` | **chỉ tung khi có người ≤ 70% HP**, không thì đánh thường và giữ Energy | hồi máu lúc cả đội full là đổ đi; `energyMax = ult.cost` nên giữ không tràn |

Ba điều AUTO **không** làm:

- **Không bỏ qua truyện.** Comic intro/outro vẫn chạy như cũ (muốn tắt thì đã có SKIP và CONFIG *BỎ QUA TRUYỆN*).
- **Không đổi tỉ lệ gì.** Nó chỉ bấm hộ hai cái nút người chơi vẫn bấm — chí mạng, variance, passive, trạng thái đi
  qua đúng `execAttack`/`execUlt` cũ. `scratch/sim.js` vì thế vẫn đo đúng cân bằng.
- **Không tự rút lui.** Sắp chết thì nó vẫn đánh tới lượt cuối; muốn thoát thì người chơi bấm ◂ BASE.

> Lệch đã biết: `sim.js` chọn mục tiêu theo luật riêng của nó (ngẫu nhiên), AUTO chọn con HP thấp nhất.
> Nghĩa là tỉ lệ thắng thật khi bật AUTO **cao hơn** bảng sim một chút. Không thống nhất trong đợt này —
> đổi luật chọn mục tiêu của sim là đổi mọi con số cân bằng đã chốt, phải đo lại từ đầu.

## C. TỐC ĐỘ ×1 / ×2 / ×3

Nút `×1` trong HUD, bấm để xoay vòng ×1 → ×2 → ×3 → ×1. Lưu ở `PLAYER.settings.speed`.

Một hệ số duy nhất `BSPEED.k`; `sp(ms)` chia mọi khoảng chờ và mọi `duration` animation **trong trận** cho nó:
trượt tới, đẩy nhẹ lúc chạm, giữ, trượt về, giật lùi khi trúng đòn, nhịp độc/cháy, chờ giữa hai lượt, băng chuyển wave.

Không tăng tốc bốn thứ:

| Thứ | Vì sao |
|---|---|
| **Video chiêu cuối** | video có nhịp riêng của nó; chạy nhanh 3× là mất luôn cái mình bỏ tiền làm. Muốn nhanh thì SKIP, hoặc tắt ở CONFIG |
| **Trang comic** | chữ để đọc, không để quét |
| **Màn nạp** (`LOAD.gate`) | nó chờ byte về, không chờ animation |
| **Kiện hàng / phản kích ở chiếm bãi** | đồng hồ thật, có cờ `?riotfast` riêng để thử |

Đo thật 16/09, cùng một chỗ: **HỐ LOẠN tầng 1**, 3 wave, đội yuki+ash+kai, AUTO bật, video ult tắt.
Đếm cả lượt của mình lẫn lượt của địch (đo bằng đồng hồ trong trang, không bấm tay):

| Tốc độ | Cả trận | Số lượt | Một lượt thật | Chuỗi đòn thường (tính từ hằng số) |
|---|---|---|---|---|
| ×1 | **96,7 giây** | 52 | 1 859 ms | 830 ms |
| ×2 | **53,4 giây** | 51 | 1 047 ms | 415 ms |
| ×3 | **40,5 giây** | 50 | 811 ms | 277 ms |

Cột cuối cộng từ chính các hằng số (`RULES.move`: trượt tới 220 + chạm 60 + giữ 150 + trượt về 240, cộng
160 ms chờ sang lượt kế). Nó **nhỏ hơn** một lượt thật vì lượt thật còn có nhịp chờ trước lượt địch, tick
độc/cháy, giật lùi khi trúng đòn, banner chiêu cuối và băng chuyển wave.

×2 nhanh hơn 1,8 lần và ×3 nhanh hơn 2,3 lần — **không** đúng 2× và 3×, và đó là đúng: phần chia được là
animation với khoảng chờ, còn cổng nạp lúc vào trận, việc dựng lại thanh lượt / bảng chỉ số mỗi lượt và bản
thân thời gian tính toán thì không chia. Ở ×3 một lượt chỉ còn 811 ms nên phần cố định ấy chiếm tỉ trọng lớn hẳn.

×3 là trần cố ý: dưới ~55 ms một nhịp thì số bay lên chưa đọc kịp đã tắt, và sprite đổi tư thế nhanh quá
thành nháy. Muốn nhanh hơn nữa thì dùng QUÉT NHANH, đừng vặn tốc độ.

## D. QUÉT NHANH — trả thưởng mà không vào trận

Nút `QUÉT` nằm ngay trên dòng của màn/tầng **đã thắng**, ở cả hai danh sách: màn chiến dịch và thang HỐ LOẠN.

```
màn đã thắng  →  QUÉT (1 vé)  →  cộng đúng phần thưởng CHƠI LẠI  →  bảng kết quả gọn, không có trận
```

- **Thưởng bằng đúng mức chơi lại, không hơn:** chiến dịch **25%** (đúng "TUẦN TRA" đang có),
  HỐ LOẠN **30%** (`RIOT.replayPct`). Quét không bao giờ lãi hơn đánh — nó chỉ đổi thời gian thành tiền.
- **Vé quét: 8 lượt mỗi ngày**, reset 00:00 cùng nhiệm vụ ngày (`PLAYER.sweep = {date, used}`).
  Nút hiện quét **một vé mỗi lần bấm**; `sweepRun(sec, n)` đã nhận sẵn n lượt nên thêm `QUÉT ×N` sau này
  chỉ là việc của giao diện.

**Vì sao phải có trần vé.** Thưởng chơi lại là cái vòi không đáy — trước nay thứ duy nhất chặn nó là
*thời gian đánh tay*. Bỏ thời gian đi mà không đặt trần thì CR và SH thành vô hạn trong một buổi tối,
và cả hai hố tiêu vừa dựng (nâng cấp 20 cấp, cyberware 60 bậc) hỏng theo — chúng được tính theo đơn vị *ngày cày*.

Số đo (tầng 20 là chỗ cày quen của đội cấp 15–20):

| Nguồn | CR/ngày | SH/ngày | Thời gian người chơi phải ngồi |
|---|---|---|---|
| Đánh tay 8 trận tầng 20, ×2, AUTO | 6.240 | 120 | **★ ~10–14 phút** (một trận tầng 1 ở ×2 mất 53 giây, tầng 20 lâu hơn) |
| **Quét 8 vé tầng 20** | **6.240** | **120** | ~10 giây |
| 9 cái bãi đầy kiện (chiếm bãi, đợt 2) | ~9.000 | ~300 | 2 lần vào game |

Tức là vé quét ≈ một buổi cày, không phải một tuần cày. Nó cắt việc lặp, không cắt đường cong.

Bốn thứ quét **không** cho:

1. **Không mở gì.** Quét không ghi `PLAYER.defeated` (không thêm quân vào bể gacha) và không nâng tầng
   HỐ LOẠN (`PLAYER.riot.tier` đứng yên). Muốn mở đường thì phải đánh thật.
2. **Không tính nhiệm vụ ngày** (`win` / `attacks` / `ult`). Nhiệm vụ ngày muốn người chơi *chơi*.
3. **Không quét được màn chưa thắng** — chiến dịch phải `cleared`, HỐ LOẠN phải `tầng ≤ best`.
4. **Không có ở chiếm bãi.** Bãi đã có chu kỳ kiện hàng riêng; quét thêm ở đó là hai đồng hồ chồng nhau.

## E. ĐÁNH TIẾP từ bảng kết quả

Thắng xong, bảng kết quả hiện thêm **một** nút tuỳ chế độ:

| Chế độ | Nút | Đi đâu |
|---|---|---|
| HỐ LOẠN, còn tầng đã mở ở trên | `TẦNG N ▸` | vào thẳng tầng kế, không qua danh sách |
| Chiến dịch, trận này vừa mở màn mới | `MÀN KẾ ▸` | vào thẳng màn vừa mở |
| Còn lại | (không thêm nút) | RETRY / ◂ KHU ĐÁY / RETURN TO BASE như cũ |

Lý do: thang tầng là chỗ bấm lặp nhiều nhất trong game, mà đường ra hiện tại là
*bảng kết quả → HOME → DẸP LOẠN → HỐ LOẠN → chọn tầng → vào* — năm cú chạm cho một việc.

## F. Đã cài ở đâu

| File | Thêm gì |
|---|---|
| `js/data.js` | `PLAY` (số của đợt này: trần tốc độ, vé quét, % thưởng quét) · `PLAYER.settings.auto/speed` · `PLAYER.sweep` |
| `js/battle.js` | `BSPEED` + `sp()` bọc mọi khoảng chờ · `autoPlan()`/`autoAct()` · nút AUTO và TỐC ĐỘ · nút đánh tiếp ở bảng kết quả |
| `js/sweep.js` | vé quét (`sweepLeft`, `sweepUse`), tính thưởng quét cho cả hai chế độ (`sweepRun`), bảng kết quả quét |
| `js/app.js` | nút QUÉT trên dòng màn chiến dịch (`renderSectors`) và dòng tầng HỐ LOẠN (`renderRiot`) |
| `index.html` | hai nút trong HUD trận, hộp kết quả quét, `<script src="js/sweep.js">` |
| `css/chromefall.css` | `.hud__tg` + `.hud__pace` (nút bật/tắt trong HUD), `.entbar` (thanh đáy hai nút), `.swbox` (hộp kết quả quét), `.btn-ghost--go` |

## G. Việc phải làm

- [x] G1. Spec này.
- [x] G2. `PLAY` + hồ sơ (`settings.auto`, `settings.speed`, `sweep`).
- [x] G3. Tốc độ: `sp()` bọc hết khoảng chờ trong `battle.js`, nút xoay vòng ×1/×2/×3.
- [x] G4. AUTO: `autoPlan`/`autoAct`, nút bật/tắt, bật giữa lúc đang ngắm thì huỷ chế độ chọn rồi đánh tiếp.
- [x] G5. QUÉT NHANH: `js/sweep.js`, nút ở hai danh sách, hộp kết quả, vé theo ngày.
- [x] G6. ĐÁNH TIẾP: nút ở bảng kết quả cho HỐ LOẠN và chiến dịch (trận chiếm bãi thì không).
- [x] G7. Kiểm: `check.js` xanh · `sim.js 400` không lệch ngoài nhiễu · chơi thật 00-T, HỐ LOẠN tầng 1–2, quét cả hai chế độ.
- [x] G8. README + nhật ký `docs/plan-2026-09.md`.

Còn để dành (không làm trong đợt này): **quét nhiều lượt một lần** (`QUÉT ×N` — hiện mỗi cú bấm là một vé),
và **thống nhất luật chọn mục tiêu của `sim.js` với AUTO** (xem ghi chú ở §B).

## H. Kiểm

```bash
node scratch/check.js                 # soát gộp (comic/ult/art) — phải không có mục MỚI
node scratch/sim.js 400               # cân bằng 6 màn: AUTO/tốc độ/quét không được làm lệch một điểm nào
python -m http.server 8765            # rồi mở http://localhost:8765/index.html
```

Chơi thử phải thấy đủ bốn thứ:

1. Bật AUTO ở 00-T → hết trận không phải chạm lần nào; Yuki tự tung ZERO khi đầy Energy.
2. Vặn ×3 → một lượt gọn lại còn khoảng một phần ba, số sát thương vẫn đọc được.
3. Màn đã thắng có nút QUÉT; bấm → ví tăng đúng 25%, vé tụt 1, không có trận nào chạy.
4. Thắng một tầng HỐ LOẠN → bảng kết quả có `TẦNG N ▸`, bấm là vào thẳng tầng kế.

## I. Nhật ký

### 16/09 — dựng đợt 5

Bốn thứ ở §A cài xong và chơi thật rồi: 00-T, HỐ LOẠN tầng 1–2, quét ở cả hai danh sách. Console 0 lỗi,
`node scratch/check.js` xanh, `node scratch/sim.js 400` chạy hai lần ra 100/100/100/80/33/21 và
100/100/100/77/39/25 — hai lần **cùng code** đã lệch nhau tới 6 điểm ở 07-D, nên đây là nhiễu của phép đo
chứ không phải cân bằng bị đụng. (`sim.js` chỉ nạp `data.js`, `state.js`, `riot.js` — nó không đọc `battle.js`,
mà hôm nay gần như mọi thứ sửa đều nằm trong `battle.js`.)

**Tốc độ làm bằng một hệ số, không phải bằng cách xoá animation.** `sp(ms)` chia mọi khoảng chờ và mọi
`duration` trong `battle.js`; `RULES.move` (out 220 · impact 60 · hold 150 · back 240) cũng đi qua nó. Cái bẫy
gặp ngay: `animDone(a, ms)` chờ `a.finished` **hoặc** `wait(ms+80)`, nên nếu chỉ chia `duration` mà quên chia
mốc timeout thì ×3 vẫn chờ đúng bằng ×1 — nhanh phần hình, không nhanh phần chờ. Phải chia cả hai.

**AUTO là một hàm trả ý định, không phải một nhánh chạy song song.** `autoPlan(u)` trả về
`{kind:'attack'|'ult', target}` rồi `autoAct` gọi đúng `execAttack`/`execUlt` mà người chơi vẫn gọi — nên không
có đường nào để AUTO đánh theo luật khác. Chỗ nối duy nhất là `startTurn`: tới lượt người của mình mà AUTO đang
bật thì chờ `PLAY.autoDelay` (240 ms, chia theo tốc độ) rồi tự bấm. `B.gen` vẫn được chụp lại như mọi hàm async
khác, nên rời trận giữa lúc AUTO đang chờ thì nó dừng, không đánh vào một trận đã đóng.

**Quét nhanh: chỗ khó không phải tính thưởng mà là quyết định cái gì KHÔNG cộng.** `sweepRun` cố ý chỉ
gọi đúng hai dòng của nhánh "chơi lại" trong `winReward` — không `dailyProgress`, không `noteDefeated`,
không nâng `PLAYER.riot.tier`. Viết kiểu chép lại hai dòng đó thay vì gọi `winReward(null)` là có ý:
`winReward` còn chạy comic kết màn và ghi `cleared`, những thứ một cú bấm quét không được phép làm.

**Vé quét dùng chung cơ chế ngày với nhiệm vụ ngày** (`today()` trong `js/state.js`) nên không có đồng hồ thứ hai
để lệch: nhiệm vụ ngày reset là vé cũng reset.

**Ba chỗ tự gây lỗi rồi tự thấy, ghi lại vì cả ba đều là loại dễ lặp:**

1. *Hai nút mới làm vỡ hàng HUD.* Thêm AUTO và ×1 vào hàng trên làm nó rộng 423 px trong khung 355 px —
   `◂ BASE` bị đẩy khuất hẳn ra ngoài. Hạ `gap` 16 → 8 và `padding` nút ghost 10 → 6 là vừa (345 px), cộng
   `flex-wrap` để máy hẹp hơn 375 thì xuống hàng chứ không nuốt mất nút.
2. *Màu "đang bật" trùng màu hover.* Bản đầu tô nút AUTO bằng `--energy-full`, mà ở theme tối token đó là
   `#FFFFFF` — đúng bằng màu `.btn-ghost:hover`. Nhìn thì thấy sáng nhưng không phân biệt được "đang bật" với
   "đang rê chuột". Đổi sang `--energy` (#42C4EA, cùng màu thanh Energy).
3. *Nút đánh tiếp suýt mời nhầm chỗ.* `js/riotui.js` bọc `finish()` và có chế độ thứ ba là `'yard'` (trận chiếm
   bãi). Nhánh mặc định của `syncNextBtn` là chiến dịch, nên thắng một trận **chiếm bãi** lại hiện nút mời vào
   màn 07-x. Thêm `if(SECTOR.mode) return;` — chỉ chiến dịch (không mode) và `'riot'` mới có nút.

**Một lần suýt tin nhầm công cụ:** bấm nút AUTO bằng chuột trong khung xem trước không ăn, hai lần liền. Kiểm
bằng `document.elementFromPoint` ngay tâm nút thì ra đúng `#btnAuto` (không bị lớp nào che), và gọi `.click()`
từ console thì bật/tắt chuẩn. Tức là kênh chuột của khung xem trước không gửi được (nó cũng đang báo "trang
chưa vẽ xong"), không phải nút hỏng. **Trước khi sửa code vì một cú bấm không ăn, hãy kiểm xem cú bấm có tới nơi.**
