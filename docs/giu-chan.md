# GIỮ CHÂN NGƯỜI CHƠI — cơ chế nào làm người ta quay lại (nghiên cứu, 16/09/2026)

> Anh đặt bài: *"tìm hiểu các cơ chế để game gây nghiện hơn"*. Tài liệu này là **phần tìm hiểu**, chưa cài gì.
> Gồm: cái gì thật sự giữ người chơi (§A–B), CHROMEFALL đang có gì và thiếu gì (§C), bảy đề xuất xếp theo
> tác động chia cho công sức (§D), và những cơ chế **cố ý không làm** kèm lý do (§E).
> Số liệu ngành ở §F — đọc như *hình dạng* để đối chiếu, không phải chỉ tiêu: chúng đo game thương mại có
> tiền quảng cáo và tiền nạp, còn đây là prototype một người làm, **không có đồng tiền thật nào trong game**.

## A. "Gây nghiện" là ba thứ khác nhau, đừng gộp

| Tầng | Câu hỏi của người chơi | Thời gian | CHROMEFALL hiện mạnh/yếu |
|---|---|---|---|
| **Nhịp trong phiên** | "Lượt sau có gì?" | 10 giây – 3 phút | **Mạnh** — chọn mục tiêu, chí mạng, chiêu cuối có phim, wave |
| **Vòng một ngày** | "Hôm nay còn gì chưa làm?" | 5 – 20 phút | **Trung bình** — có nhiệm vụ ngày + kiện hàng ở bãi, nhưng không có lý do *mở game* |
| **Đường dài** | "Mình đang tiến tới cái gì?" | tuần – tháng | **Yếu** — có cyberware và roster, nhưng không nhìn thấy đích, không có mốc để khoe |

Thứ tự sửa nên đi **từ dưới lên**: nhịp trong phiên đã tốt rồi; cái thiếu là *lý do mở game hôm nay* và
*cái đích của tháng này*. Đây cũng là chỗ dữ liệu ngành chỉ ra: người chơi rơi rụng mạnh nhất không phải
trong trận đầu mà ở ngày thứ hai và tuần thứ nhất.

**Một phân biệt phải giữ suốt tài liệu này:**

- **Muốn quay lại** = người chơi mở game vì còn thứ họ *thích* đang chờ (quà tích lại, một mốc gần tới, một
  chương truyện mới). Càng nhiều càng tốt.
- **Sợ bỏ lỡ** = người chơi mở game vì nếu không mở thì *mất* thứ gì đó (streak đứt, sự kiện hết hạn, bãi bị
  cướp). Dùng liều nhỏ thì thành nhịp; dùng nặng tay thì thành nghĩa vụ, và nghĩa vụ là thứ người ta bỏ.

## B. Cơ chế đang có — kiểm kê thật

| Cơ chế | Trong game | Ghi chú |
|---|---|---|
| Nhiệm vụ ngày | ✅ 5 việc, reset 00:00, tổng **170 SH/ngày** | `DAILY_TASKS` ở `js/state.js` |
| Hợp đồng tuần | ⚠️ có nhưng **chỉ trong DẸP LOẠN** (3 việc, 370 SH/tuần) | `RIOT_WEEK` ở `js/riot.js`, khoá tới khi xong 07-A |
| Thu nhập lúc không chơi | ⚠️ kiện hàng ở bãi, 45 phút/kiện, trần 8 kiện = 6 giờ | phải chiếm bãi trước, tức khoá sau 07-A |
| Báo cáo vắng mặt | ✅ `riotFeed` — kể chuyện xảy ra lúc đi vắng | chỉ ở màn Khu Đáy, không phải màn đầu |
| Gacha + pity | ✅ một bể, pity 50, bể lớn dần theo kẻ địch đã hạ | |
| Hố tiêu dài hạn | ✅ nâng cấp 20 cấp · cyberware 60 bậc (~9 ngày cày/người) | |
| Thang vô hạn | ✅ HỐ LOẠN 40 tầng | có `best` nhưng không khoe được ở đâu |
| Truyện | ✅ 40 trang comic, đọc lại được ở THƯ VIỆN | chương 2 chưa có |
| AUTO · tốc độ · quét | ✅ đợt 5 | |
| **Điểm danh / chuỗi ngày** | ❌ | |
| **Quà lúc quay lại (ngoài bãi)** | ❌ | |
| **Mùa / thẻ mùa / mục tiêu tháng** | ❌ | |
| **Thành tựu, huy hiệu, kỷ lục** | ❌ | |
| **Sự kiện xoay vòng theo ngày** | ❌ | |
| **Mốc "đột phá" của nhân vật** | ❌ nâng cấp tuyến tính +4%/cấp, không có bậc đổi chất | |

Kết luận kiểm kê: **cái đã có đều thuộc tầng "vòng một ngày" và đều bị khoá sau 07-A.** Người chơi mới trong
ba ngày đầu — đúng quãng rơi rụng mạnh nhất — hầu như không có gì ngoài đánh màn.

## C. Bảy lỗ hổng, xếp theo tác động ÷ công sức

Cột *công sức* là ước lượng của tôi cho đúng repo này (đã biết chỗ nào phải sửa).

| # | Lỗ hổng | Tác động | Công sức | Đụng cân bằng? |
|---|---|---|---|---|
| 1 | **Mở game không có gì đón** | cao | thấp (~½ ngày) | không |
| 2 | **Không có chuỗi ngày** | cao | thấp | nhẹ (thêm SH) |
| 3 | **Không có đích tháng này** | cao | trung bình (~1–2 ngày) | có, phải tính lại nguồn SH |
| 4 | **Nhân vật lên cấp không có khoảnh khắc** | trung bình–cao | trung bình | có |
| 5 | **Không có kỷ lục để khoe với chính mình** | trung bình | thấp | không |
| 6 | **Nhiệm vụ tuần chỉ nằm trong DẸP LOẠN** | trung bình | thấp | nhẹ |
| 7 | **Không có việc xoay theo ngày trong tuần** | trung bình | trung bình | có |

## D. Bảy đề xuất cụ thể

### D1. "VỀ RỒI" — màn đón khi mở game (ưu tiên 1)
Mở game là thấy **một hộp tổng kết vắng mặt**: đi vắng bao lâu, trong lúc đó bãi đẻ mấy kiện, ai đánh úp bãi
nào, nhiệm vụ ngày đã reset chưa, và **một phần quà nhỏ theo thời gian vắng** (trần 8 giờ, ví dụ 10 SH/giờ,
tối đa 80 SH — đúng trần của kiện hàng để không đẻ ra nguồn tiền thứ hai).
*Vì sao mạnh:* nó biến việc mở game thành **nhận**, không phải **bắt đầu làm**. Đây là thứ mọi game idle đều
có và CHROMEFALL đang thiếu hẳn.
*Rẻ vì:* `riotFeed` (báo cáo vắng mặt) và `PLAYER.sweep`/`daily` đã có sẵn mốc thời gian; chỉ cần một màn mới.

### D2. Chuỗi ngày kiểu **tích luỹ, không phải chuỗi gãy** (ưu tiên 2)
"Mở game **3 trong 7 ngày**" thay cho "7 ngày liên tiếp, đứt là về 0". Thưởng tăng dần theo số ngày trong
tuần: ngày 1/3/5/7 có mốc, ngày 7 là một lượt quay miễn phí.
*Vì sao chọn kiểu tích luỹ:* chuỗi gãy tạo cảm giác bị phạt vì một ngày bận — mà bị phạt là lý do người ta
bỏ hẳn. Bản tích luỹ giữ được động lực mà không sinh nghĩa vụ.

### D3. **HỢP ĐỒNG THÁNG** — cái đích nhìn thấy được (ưu tiên 3)
Một thanh tiến trình dài 30 ngày với ~20 mốc: mỗi hoạt động (thắng màn, quay thẻ, nâng cyberware, chiếm bãi,
đọc truyện) cho điểm; mốc trả SH, LK, và **hai mốc cuối trả thứ chỉ có ở đây** — ví dụ một khung viền thẻ,
một danh hiệu hiện cạnh tên ở màn chính. Đây là "thẻ mùa" (battle pass) bản không bán tiền: **chỉ có nhánh
miễn phí**, vì game không có tiền thật.
*Vì sao:* nó trả lời câu hỏi "mình đang tiến tới cái gì" — thứ mà cyberware (9 ngày cày một người) trả lời
quá chậm và quá trừu tượng.
*Cảnh báo:* phải tính lại tổng SH vào mỗi tuần, nếu không thì bể gacha bị thổi phồng và pity mất nghĩa.

### D4. **ĐỘT PHÁ** — cho cấp có khoảnh khắc
Nâng cấp hiện tại là +4%/cấp, 20 cấp, không có gì xảy ra. Đề xuất: cấp **5 · 10 · 15 · 20** là mốc đột phá —
tốn thêm bản dư của chính nhân vật đó, đổi lại **mở một thứ đọc được**: cấp 5 mở dòng nội tại thứ hai, cấp 10
tăng một bậc chiêu cuối (hệ số ×1.15), cấp 15 đổi viền thẻ, cấp 20 mở một trang hồ sơ mới trong THƯ VIỆN.
*Vì sao:* nó cho bản dư (đang chỉ để phân tách) một đường dùng thứ hai, và biến 20 cấp phẳng thành 4 cái đích.

### D5. **KỶ LỤC** — tự cạnh tranh, không cần server
Một trang trong THƯ VIỆN: tầng HỐ LOẠN sâu nhất, trận thắng nhanh nhất (số vòng), sát thương một đòn cao
nhất, chuỗi ngày dài nhất, số bãi giữ lâu nhất. Mỗi kỷ lục có ngày lập và đội hình lúc đó.
*Vì sao:* game không có mạng, nên đối thủ duy nhất là bản thân hôm qua — và đó vẫn là một đối thủ tử tế.
*Rẻ vì:* dữ liệu đã đi qua `finish()` và `PLAYER` rồi, chỉ cần ghi lại chỗ cao nhất.

### D6. Kéo **hợp đồng tuần** ra khỏi DẸP LOẠN
Hiện 3 việc tuần nằm trong Khu Đáy nên người chưa qua 07-A không thấy. Đưa lên thành **nhiệm vụ tuần chung**
(6 việc: thắng 20 trận, quay 10 lượt, nâng 5 bậc cyberware, hạ 3 trùm, đọc 1 chương truyện, nhận 40 kiện) và
để 3 việc cũ thành một nhóm con.

### D7. **VIỆC HÔM NAY** — xoay theo thứ trong tuần
Mỗi ngày trong tuần một màn thưởng đôi: thứ Hai ×2 CR ở 07-B, thứ Ba ×2 SH ở HỐ LOẠN tầng chẵn… Không phải
nội dung mới, chỉ là một hệ số và một dòng chữ ở màn chính.
*Vì sao:* nó làm hai ngày liên tiếp khác nhau — thứ mà một game chỉ có 6 màn rất cần.

**Nếu chỉ làm ba thứ:** D1 (về rồi) → D2 (chuỗi tích luỹ) → D5 (kỷ lục). Ba cái này **không đụng cân bằng**,
cộng lại vẫn dưới một ngày công, và chúng vá đúng lỗ to nhất: *mở game không có gì đón, và không có gì để
tự hào*. D3 (hợp đồng tháng) là thứ đáng làm nhất về lâu dài nhưng phải tính lại kinh tế SH nên để riêng.

## E. Cố ý KHÔNG làm — và vì sao

| Cơ chế | Vì sao không |
|---|---|
| **Thanh thể lực** (hết lượt phải chờ nạp) | Nó không giữ chân, nó **chặn** chơi. Với game không bán gì thì nó chỉ còn tác dụng làm người ta khó chịu. Quét nhanh 8 vé/ngày đã là cái trần mềm rồi |
| **Sự kiện hết hạn với phần thưởng độc quyền** | Đây là FOMO đúng nghĩa: người chơi mở game vì *sợ mất*, và nghiên cứu ghi nhận nó dẫn thẳng tới mệt mỏi rồi bỏ hẳn. Nếu làm sự kiện thì cho **quay lại được** ở THƯ VIỆN sau khi hết |
| **Chuỗi ngày gãy về 0** | Phạt người bận một hôm. Bản tích luỹ ở D2 đạt cùng mục tiêu mà không phạt ai |
| **Hộp quà ngẫu nhiên đổi bằng tiền thật** | Game này không có tiền thật. Giữ nguyên như vậy — mọi thứ trong tài liệu này đều phải chạy được mà không cần ví |
| **Giấu tỉ lệ gacha** | Game đang in tỉ lệ và thanh pity ngay trên banner. Đó là lựa chọn đúng, đừng đổi |
| **Thông báo đẩy kiểu "bãi của bạn đang bị cướp!"** | Không có backend, và loại thông báo gây lo lắng là thứ bị chỉ trích nhiều nhất trong nghiên cứu về dark pattern |
| **Đếm ngược ép quyết định** (mua/nhận trong 10 phút) | Ép ra quyết định dưới áp lực; không có chỗ dùng ở một game không bán gì |

Lý do thực dụng, không chỉ đạo đức: đây là game **một người làm cho vui**, người chơi đầu tiên là chính anh
và bạn bè. Cái giá của một cơ chế ép buộc không phải là tiếng xấu — mà là **chính anh chán game của mình**.

## F. Số liệu ngành để đối chiếu (không phải chỉ tiêu)

- Trung vị toàn thị trường 2025 khá thấp: **D1 ~22%**, **D7 ~4%**, **D30 ~0.7–0.8%**; nhóm 1% dẫn đầu giữ
  **64–68% D1** và **13–15% D30**. Mục tiêu "khoẻ mạnh" thường được nhắc là **D1 30–40% · D7 10–20% · D30 5–10%**.
  (*D1 = tỉ lệ người chơi quay lại vào ngày hôm sau; D7, D30 tương tự cho ngày thứ 7 và 30.*)
- Thời lượng trung vị: **~12 phút/ngày, ~3–3,5 phút/phiên, ~3,8 phiên/ngày**; game nhập vai và chiến thuật
  chịu được phiên **20–60 phút**. → Trận CHROMEFALL sau đợt 5 dài **40–97 giây** là **đúng cỡ một phiên ngắn**.
- Điểm danh nên là **tích luỹ ("3 trong 7 ngày")** thay vì chuỗi liên tiếp, vì chuỗi gãy phá thói quen.
- Thẻ mùa hiệu quả nhờ ba thứ: **cam kết trước · sợ mất phần thưởng sắp hết hạn · thanh tiến trình nhìn thấy**;
  thứ ba là thứ duy nhất dùng được cho game không bán gì — và nó vẫn là phần mạnh nhất.
- Mùa nên **đi kèm nội dung mới** (nhân vật, chương truyện), không chỉ phần thưởng — hợp với việc chương 2
  đang là đích lớn tiếp theo của dự án.
- Thu nhập lúc không chơi chủ yếu phục vụ **người chơi rảnh ít**; người chơi nhiều gần như không hưởng lợi.
  Nghĩa là D1 ("về rồi") không làm hỏng cân bằng của người cày — nó chỉ nâng sàn cho người bận.

**Nguồn:** [GameAnalytics 2026 benchmarks](https://www.gameanalytics.com/reports/2026-mobile-pc-gaming-benchmarks) ·
[Segwise: D1 benchmarks](https://segwise.ai/blog/mobile-gaming-app-user-retention-strategies) ·
[The Game Scientist: retention by genre](https://thegamescientist.com/tools/retention-benchmarks/) ·
[Daily rewards, streaks & battle passes](https://www.designthegame.com/learning/tutorial/daily-rewards-streaks-battle-passes-player-retention) ·
[Deconstructor of Fun: battle passes](https://www.deconstructoroffun.com/blog/2022/6/4/battle-passes-analysis) ·
[Deconstructor of Fun: AFK Arena](https://www.deconstructoroffun.com/blog/2019/6/6/afk-arena-puts-lilith-into-the-billionaire-club) ·
[gamedesignskills: player retention](https://gamedesignskills.com/game-design/player-retention/) ·
[CHI: A Game of Dark Patterns](https://dl.acm.org/doi/fullHtml/10.1145/3491101.3519837) ·
[DiVA: Dark Patterns Within Gacha Games](https://www.diva-portal.org/smash/get/diva2:1888600/FULLTEXT01.pdf) ·
[ScienceDirect 2026: dark patterns & random rewards](https://www.sciencedirect.com/science/article/pii/S1875952126000443)

## G. Đã cài — gói D1 + D2 + D5 (16/09, anh chốt ngay trong phiên)

| Việc | Cài ở đâu | Số chốt |
|---|---|---|
| **D1 · VỀ RỒI** | `comebackOffer/comebackClaim` (`js/state.js`), hộp `#backBox`, gọi từ `renderHome` | `COMEBACK` = **8 SH + 200 CR mỗi giờ vắng**, trần **8 giờ**, tối thiểu 1 giờ, **một lần mỗi ngày** |
| **D2 · CHUỖI NGÀY** | `streakTick/streakClaim`, dải `#streak` ở HOME | `STREAK` = mốc **1 · 3 · 5 · 7** ngày → **20 · 40 · 60 · 120 SH**, tổng **240 SH/tuần**, tuần bắt đầu thứ Hai |
| **D5 · KỶ LỤC** | `recordSet/recordGet`, tab **KỶ LỤC** trong THƯ VIỆN | 6 dòng: thắng gọn nhất (số vòng) · cú đánh mạnh nhất · tầng HỐ LOẠN sâu nhất · chuỗi tuần · bãi đang giữ · đã hạ |

**Quà vắng mặt đặt ở đâu trong kinh tế:** 8 giờ vắng = **64 SH + 1.600 CR**, so với quét 8 vé tầng 20 là
**120 SH + 6.240 CR** và nhiệm vụ ngày **170 SH**. Tức nó **nâng sàn cho người bận**, không thay được việc
chơi, và vì chỉ nhận một lần mỗi ngày nên không có đường tắt-mở game liên tục để farm.

**Chuỗi ngày cố ý không gãy:** nghỉ một hôm chỉ làm mốc sau tới chậm hơn, không mất gì — và câu đó được
**in thẳng trên đầu danh sách** chứ không để người chơi tự đoán.

**D4 (đột phá) đã làm ngay sau đó** — đặc tả và số đo riêng ở `docs/dot-pha.md`.

**D3 (hợp đồng tháng) đã làm** — `docs/hop-dong-thang.md`; phép đo SH ở đó đã đổi hẳn thiết kế thưởng.

Còn để dành: **D6** (kéo nhiệm vụ tuần ra khỏi
DẸP LOẠN) · **D7** (việc hôm nay xoay theo thứ). D3 phải kèm một lượt tính lại tổng SH mỗi tuần —
`node scratch/riot_econ.js` mới đo phần thu nhập từ bãi, chưa đo phần nhiệm vụ.

## H. Nhật ký

### 16/09 — cài D1 + D2 + D5

**Mốc thời gian phải do game tự đóng dấu, không tin `Date.now()` lúc mở.** `PLAYER.lastSeen` được ghi ở ba
chỗ: `pagehide`, `visibilitychange → hidden`, và mỗi 3 phút khi tab đang hiện. Thiếu cái thứ ba thì một
phiên bị kill (đóng máy, hết pin) sẽ để lại mốc từ lần mở trước và quà vắng mặt tính sai hẳn một ngày.

**Hồ sơ mới không được nhận quà "về rồi".** `comebackOffer` trả `null` khi `lastSeen` bằng 0 — người chưa
từng rời đi thì không có gì để "về". Nếu không chặn, người chơi mới mở game lần đầu đã ăn ngay 64 SH và
mất luôn ý nghĩa của cơ chế.

**Kỷ lục "thắng gọn nhất" đo bằng SỐ VÒNG chứ không bằng giây.** Từ đợt 5 game có tốc độ ×1/×2/×3 và AUTO,
nên thời gian thật của một trận phụ thuộc vào nút người chơi bấm — đo giây thì kỷ lục chỉ nói lên rằng
họ đã vặn ×3. Số vòng là thước đo duy nhất không đổi theo cách xem.

**`recordSet` nhận hàm so sánh** vì không phải kỷ lục nào cũng "lớn hơn là tốt hơn": thắng gọn nhất là
**nhỏ hơn**. Viết sẵn tham số `better` ngay từ đầu rẻ hơn nhiều so với việc sau này phát hiện ra và phải
sửa ở ba chỗ gọi.

**Ghi kỷ lục sát thương ngay trong `dealDamage`** — mỗi đòn đều xét, nhưng `recordSet` chỉ lưu hồ sơ khi
con số thật sự lớn hơn cái cũ, nên không thành mỗi đòn một lần ghi ổ đĩa. Chỉ tính đòn của đội mình và chỉ
tính phần thật sự vào máu (phần lá chắn đỡ không phải thành tích).
