# -*- coding: utf-8 -*-
"""comic_import.py — nhập ảnh panel comic từ một thư mục vào art/comic/.

Ba việc, theo đúng thứ tự:
  1. Cắt viền letterbox/pillarbox (ảnh sinh ra ở khung 16:9 nhưng bố cục dọc thì bị chèn hai dải phẳng hai bên).
  2. Cắt theo đúng tỉ lệ ô panel sẽ hiển thị — game dùng object-fit:cover và BỎ pos/zoom cho ảnh vẽ riêng
     (css .panel.has-art), nên ảnh đưa vào phải đúng khung, không thì bị cắt giữa một cách mù quáng.
  3. Đẩy khung cắt sang trái nếu nó còn dính dấu Gemini ở góc phải dưới — cắt luôn, không tô đè.

Chạy:  python scratch/comic_import.py
"""
import io, os, sys
import numpy as np
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
SRC  = os.path.join(ROOT, 'comic char')
OUT  = os.path.join(ROOT, 'art', 'comic')

# Dấu Gemini: ngôi sao 4 cánh sáng ở góc phải dưới (đo được ở x 1252-1312, y 640-700 trên khung 1376x768).
# PHẢI DÒ THẬT chứ không giả định: bộ ảnh từ công cụ khác không có dấu, mà cứ né mù thì khung cắt bị đẩy lệch.
MAXLONG = 1600

# nguồn → (tên file trong game, tỉ lệ ô panel sẽ hiển thị, tuỳ chọn)
# Tỉ lệ đo ở 375×812: v2 = 359×338 (1.062) · w3 ô rộng = 359×362 (0.992) · w3 ô nhỏ = 176×315 (0.559)
# tuỳ chọn: xr=(x0,x1) chốt tay dải ảnh thật · ay = neo dọc khi phải cắt bớt chiều cao (0 = sát mép trên)
JOBS = [
    # --- 00-T intro (đã cắm 11/09) ---
    ('ch1/1_4k.jpg', '00t_i1_p1.jpg', 359/360, dict(xr=(414, 962), ay=.10)),  # v2 — Tháp Halcyon; bố cục dọc bị chèn hai dải tối, neo lên trên để giữ đỉnh tháp
    ('ch1/2_4k.jpg', '00t_i1_p2.jpg', 359/360, {}),   # v2 — thứ rơi xuống bãi phế liệu
    ('ch1/3_4k.jpg', '00t_i2_p1.jpg', 359/386, {}),   # w3 ô rộng — Yuki mở mắt trong đống rác
    ('ch1/4_4k.jpg', '00t_i2_p2.jpg', 176/335, {}),   # w3 ô nhỏ — cận cảnh Halo gãy
    ('ch1/5_4k.jpg', '00t_i2_p3.jpg', 176/335, {}),   # w3 ô nhỏ — Yuki quỳ, cầm ZERO
    ('ch1/6_4k.jpg', '00t_i3_p1.jpg', 359/360, {}),   # v2 — ba tên Scav lội tới
    ('ch1/7_4k.jpg', '00t_i3_p2.jpg', 359/360, {}),   # v2 — Yuki chém một đường vòng cung
    # --- 00-T outro (11/09) · trang 1 dùng layout v3 (ba dải ngang), trang 2 v2 ---
    ('00-T outro/00t_o1_p1.png', '00t_o1_p1.jpg', 359/238, {}),            # v3 — Yuki đứng một mình giữa bãi, kiếm hạ xuống
    ('00-T outro/00t_o1_p2.png', '00t_o1_p2.jpg', 359/238, {}),            # v3 — Ash ngồi xổm, với tay tới cái Halo gãy
    ('00-T outro/00t_o1_p3.png', '00t_o1_p3.jpg', 359/238, {}),            # v3 — hai chị em trong một khung, cắt dọc là chặt đôi cả hai
    ('00-T outro/00t_o2_p1.png', '00t_o2_p1.jpg', 359/360, dict(ay=.30)),  # v2 — Yuki chỉ lên cái vòng; neo lên để giữ Halo + bàn tay
    ('00-T outro/00t_o2_p2.png', '00t_o2_p2.jpg', 359/360, dict(ax=.28)),  # v2 — Ash tiền cảnh, Yuki phía sau, lò đúc cháy ở chân trời; neo trái để giữ cả hai
    # --- 07-A intro (11/09) · cả 3 trang layout w3: ô rộng 0.93 · hai ô nhỏ 0.52 ---
    ('07-A/07a_i1_p1.jp.png', '07a_i1_p1.jpg', 359/386, {}),            # w3 rộng — trại Ronin, giao việc thử
    ('07-A/07a_i1_p2.jpg',    '07a_i1_p2.jpg', 176/335, {}),            # w3 nhỏ — Muzzle và cánh cửa xe
    ('07-A/07a_i1_p3.jpg',    '07a_i1_p3.jpg', 176/335, {}),            # w3 nhỏ — Kai dạy luật Đáy
    ('07-A/07a_i2_p1.jpg',    '07a_i2_p1.jpg', 359/386, {}),            # w3 rộng — Yuki tự hỏi mình có đang cười
    ('07-A/07a_i2_p2.jpg',    '07a_i2_p2.jpg', 176/335, {}),            # w3 nhỏ — Ash "liệu mà sống"
    ('07-A/07a_i2_p3.jpg',    '07a_i2_p3.jpg', 176/335, {}),            # w3 nhỏ — cổng bãi xe, hai tốp Scav
    ('07-A/07a_i3_p1.jpg',    '07a_i3_p1.jpg', 359/386, dict(ay=0)),    # w3 rộng — RIGGER ra mặt; nguồn là ảnh DỌC nên neo sát mép trên để giữ mặt + đám lâu la
    ('07-A/07a_i3_p2.jpg',    '07a_i3_p2.jpg', 176/335, {}),            # w3 nhỏ — cận mặt Yuki, "…Hàng. Ai cũng gọi tôi là hàng."
    ('07-A/07a_i3_p3.jpg',    '07a_i3_p3.jpg', 176/335, {}),            # w3 nhỏ — Ash bước lên chắn
    # --- 07-A outro (11/09) · trang 1 v2 · trang 2 w3 ---
    ('07-A — outro/07a_o1_p1.jpg', '07a_o1_p1.jpg', 359/360, {}),   # v2 — drone Canticle quét đèn đỏ vào Yuki
    ('07-A — outro/07a_o1_p2.jpg', '07a_o1_p2.jpg', 359/360, {}),   # v2 — Kai chém rơi drone, số 07 trên mảnh vỏ
    ('07-A — outro/07a_o2_p1.jpg', '07a_o2_p1.jpg', 359/386, {}),   # w3 rộng — Yuki cầm mảnh vỡ, "07… là tôi à?"
    ('07-A — outro/07a_o2_p2.jpg', '07a_o2_p2.jpg', 176/335, {}),   # w3 nhỏ — Ash; nguồn 1:1 vào ô dọc nên cắt hai bên
    ('07-A — outro/07a_o2_p3.jpg', '07a_o2_p3.jpg', 176/335, {}),   # w3 nhỏ — Ronin chốt việc
    ('07-B · LÒ ĐÚC — intro/07b_i1_p1.jpg', '07b_i1_p1.jpg', 359/360, {}),   # v2 — lòng lò đúc, dòng kim loại chảy
    ('07-B · LÒ ĐÚC — intro/07b_i1_p2.jpg', '07b_i1_p2.jpg', 359/360, {}),   # v2 — Foreman và hai cánh tay máy
    ('07-B · LÒ ĐÚC — intro/07b_i2_p1.jpg', '07b_i2_p1.jpg', 359/386, {}),   # w3 rộng — cửa lò mở, hơi nóng táp vào mặt
    ('07-B · LÒ ĐÚC — intro/07b_i2_p2.jpg', '07b_i2_p2.jpg', 176/335, {}),   # w3 nhỏ — Ash giải thích, Yuki phía dưới
    ('07-B · LÒ ĐÚC — intro/07b_i2_p3.jpg', '07b_i2_p3.jpg', 176/335, {}),   # w3 nhỏ — Kai bắt bài chị mình
    ('07-B · LÒ ĐÚC — intro/07b_i3_p1.jpg', '07b_i3_p1.jpg', 176/335, {}),   # w3b ô dọc — Yuki hỏi mượn lửa
    ('07-B · LÒ ĐÚC — intro/07b_i3_p2.jpg', '07b_i3_p2.jpg', 176/335, {}),   # w3b ô dọc — Foreman gầm lên từ chối
    ('07-B · LÒ ĐÚC — intro/07b_i3_p3.jpg', '07b_i3_p3.jpg', 359/386, {}),   # w3b ô rộng — Ash và Kai rút vũ khí
    # --- 07-B outro (10/09) · t1 w3 · t2 w3 · t3 v2 ---
    ('07-B — outro/07b_o1_p1.jpg', '07b_o1_p1.jpg', 359/386, {}),   # w3 rộng — Ash dí cái vòng vào tim lửa
    ('07-B — outro/07b_o1_p2.jpg', '07b_o1_p2.jpg', 176/335, {}),   # w3 nhỏ — KÝ ỨC: phòng trắng, Yuki bị xích trên ghế
    ('07-B — outro/07b_o1_p3.jpg', '07b_o1_p3.jpg', 176/335, {}),   # w3 nhỏ — KÝ ỨC: bàn tay găng đen, Halo ĐỎ
    ('07-B — outro/07b_o2_p1.jpg', '07b_o2_p1.jpg', 359/386, {}),   # w3 rộng — bàn tay đưa ngược lên đầu chính mình
    ('07-B — outro/07b_o2_p2.jpg', '07b_o2_p2.jpg', 176/335, {}),   # w3 nhỏ — vòng đứt, sàn mở ra
    ('07-B — outro/07b_o2_p3.jpg', '07b_o2_p3.jpg', 176/335, {}),   # w3 nhỏ — Yuki tỉnh lại, quỳ giữa sàn xưởng
    ('07-B — outro/07b_o3_p1.jpg', '07b_o3_p1.jpg', 359/360, {}),   # v2 — Foreman nằm dưới sàn, chỉ tay lên
    ('07-B — outro/07b_o3_p2.jpg', '07b_o3_p2.jpg', 359/360, {}),   # v2 — Ash khoanh tay, Kai cạnh bên
    # --- 07-C intro (10/09) · t1 v2 · t2 w3 · t3 v2 (đổi từ h2) ---
    ('07-C intro/07c_i1_p1.jpg', '07c_i1_p1.jpg', 359/360, {}),            # v2 — vành đai đệm, kính và lưới quét
    ('07-C intro/07c_i1_p2.jpg', '07c_i1_p2.jpg', 359/360, {}),            # v2 — ARCHON, AI cổng
    ('07-C intro/07c_i2_p1.jpg', '07c_i2_p1.jpg', 359/386, {}),            # w3 rộng — Psalm bước ra, Halo đỏ nứt
    ('07-C intro/07c_i2_p2.jpg', '07c_i2_p2.jpg', 176/335, {}),            # w3 nhỏ — Kai đòi bán cái Halo đỏ
    ('07-C intro/07c_i2_p3.jpg', '07c_i2_p3.jpg', 176/335, {}),            # w3 nhỏ — Muzzle và tấm khiên, đội hình lùi về
    ('07-C intro/07c_i3_p1.jpg', '07c_i3_p1.jpg', 359/360, dict(ay=0)),  # v2 — Yuki và Psalm đứng cạnh nhau; nguồn DỌC nên neo sát trên để giữ cả hai cái Halo
    ('07-C intro/07c_i3_p2.jpg', '07c_i3_p2.jpg', 359/360, {}),            # v2 — lõi mắt tím của Archon bật sáng
    # --- 07-C outro (10/09) · t1 v2 · t2 v2 · t3 w3 · t4 v2 (thiếu o4_p1) ---
    ('07-C — outro/07c_o1_p1.jpg', '07c_o1_p1.jpg', 359/360, {}),   # v2 — Archon nổ tung, mảng hàng rào bay
    ('07-C — outro/07c_o1_p2.jpg', '07c_o1_p2.jpg', 359/360, {}),   # v2 — Psalm kể về Choir
    ('07-C — outro/07c_o2_p1.jpg', '07c_o2_p1.jpg', 359/360, {}),   # v2 — Yuki đối mặt Psalm
    ('07-C — outro/07c_o2_p2.jpg', '07c_o2_p2.jpg', 359/360, {}),   # v2 — "Tôi không biết." / mụ già dưới cống
    ('07-C — outro/07c_o3_p1.jpg', '07c_o3_p1.jpg', 359/386, {}),   # w3 rộng — Yuki gác kiếm ngang cổ Psalm
    ('07-C — outro/07c_o3_p2.jpg', '07c_o3_p2.jpg', 176/335, {}),   # w3 nhỏ — cận mặt Psalm, không xin tha
    ('07-C — outro/07c_o3_p3.jpg', '07c_o3_p3.jpg', 176/335, {}),   # w3 nhỏ — Kai chen vào can
    ('07-C — outro/07c_o4_p2.jpg', '07c_o4_p2.jpg', 359/360, {}),   # v2 — cả tổ bước tới, Psalm nhập bọn (o4_p1 chưa có)
    # --- 07-D intro (10/09) · t1 v2 · t2 v2 (đổi từ h2) ---
    ('07-D · NHÀ THỜ DƯỚI CỐNG — intro/07d_i1_p1.jpg',     '07d_i1_p1.jpg', 359/360, {}),          # v2 — thánh đường ngầm, bệ thờ xác máy
    ('07-D · NHÀ THỜ DƯỚI CỐNG — intro/07d_i1_p2.jpg',     '07d_i1_p2.jpg', 359/360, {}),          # v2 — Mother Rust dang tay trên bệ thờ
    ('07-D · NHÀ THỜ DƯỚI CỐNG — intro/07d_i2_p1.jpg.png', '07d_i2_p1.jpg', 359/360, dict(ay=0)),  # v2 — Yuki ra điều kiện; nguồn DỌC nên neo sát trên để giữ Halo
    ('07-D · NHÀ THỜ DƯỚI CỐNG — intro/07d_i2_p2.jpg',     '07d_i2_p2.jpg', 359/360, dict(ay=0)),  # v2 — Psalm cầm đèn, ba vòng tín đồ đứng sau
# --- 07-D outro (10/09) · t1 v2 · t2 v2 · t3 w3 · t4 v2 ---
    ('07-D — outro/07d_o1_p1.jpg', '07d_o1_p1.jpg', 359/360, {}),   # v2 — Mother Rust gục dưới bệ thờ, giở cuốn sổ
    ('07-D — outro/07d_o1_p2.jpg', '07d_o1_p2.jpg', 359/360, {}),   # v2 — đoàn xe tải trắng bò xuống vùng đổ nát
    ('07-D — outro/07d_o2_p1.jpg', '07d_o2_p1.jpg', 359/360, {}),   # v2 — lũ trẻ giấu dưới hầm
    ('07-D — outro/07d_o2_p2.jpg', '07d_o2_p2.jpg', 359/360, {}),   # v2 — con bé 11 tuổi chắn ngang xe tải; nguồn 16:9 nên cắt hai bên, chủ thể ở giữa
    ('07-D — outro/07d_o3_p1.jpg', '07d_o3_p1.jpg', 359/386, {}),   # w3 rộng — ký ức dội về: Tầng Bốn sụp
    ('07-D — outro/07d_o3_p2.jpg', '07d_o3_p2.jpg', 176/335, {}),   # w3 nhỏ — gã đội Halo vàng cúi nhìn cô bé
    ('07-D — outro/07d_o3_p3.jpg', '07d_o3_p3.jpg', 176/335, {}),   # w3 nhỏ — Yuki gọi tên Cantor
    ('07-D — outro/07d_o4_p1.jpg', '07d_o4_p1.jpg', 359/360, {}),   # v2 — Ash lần đầu nói về gia đình
    ('07-D — outro/07d_o4_p2.jpg', '07d_o4_p2.jpg', 359/360, {}),   # v2 — Mother Rust chỉ về thang máy hàng số 3
    # --- 07-E intro (10/09) · t1 v2 · t2 w3 · t3 w3 · t4 v2 (đổi từ h2) ---
    ('07-E · THANG MÁY HÀNG — intro/07e_i1_p1.jpg', '07e_i1_p1.jpg', 359/360, {}),   # v2 — sàn nâng khổng lồ lao xuống
    ('07-E · THANG MÁY HÀNG — intro/07e_i1_p2.jpg', '07e_i1_p2.jpg', 359/360, {}),   # v2 — Cantor hạ cố xuống
    ('07-E · THANG MÁY HÀNG — intro/07e_i2_p1.jpg', '07e_i2_p1.jpg', 359/386, {}),   # w3 rộng — mọi giọng định giá cuộn về
    ('07-E · THANG MÁY HÀNG — intro/07e_i2_p2.jpg', '07e_i2_p2.jpg', 176/335, {}),   # w3 nhỏ — Rigger và Foreman
    ('07-E · THANG MÁY HÀNG — intro/07e_i2_p3.jpg', '07e_i2_p3.jpg', 176/335, {}),   # w3 nhỏ — Archon và Mother Rust
    ('07-E · THANG MÁY HÀNG — intro/07e_i3_p1.jpg', '07e_i3_p1.jpg', 359/386, {}),   # w3 rộng — "Tao là Yuki."
    ('07-E · THANG MÁY HÀNG — intro/07e_i3_p2.jpg', '07e_i3_p2.jpg', 176/335, {}),   # w3 nhỏ — Psalm đếm lần thứ 313
    ('07-E · THANG MÁY HÀNG — intro/07e_i3_p3.jpg', '07e_i3_p3.jpg', 176/335, {}),   # w3 nhỏ — Ash và Kai đếm tầng
    ('07-E · THANG MÁY HÀNG — intro/07e_i4_p1.jpg', '07e_i4_p1.jpg', 359/360, dict(ay=0)),   # v2 — Cantor ra lệnh, hàng Choir hai bên; h2 cắt mất hết lính nên đổi v2
    ('07-E · THANG MÁY HÀNG — intro/07e_i4_p2.jpg', '07e_i4_p2.jpg', 359/360, {}),   # v2 — Yuki lao tới, "MỘT!"
    # --- 07-E outro (10/09) · t1 w3 · t2 v2 · t3 v2 · t4 splash · t5 v3 · t6+t7 splash ---
    ('07-E — outro/07e_o1_p1.jpg',     '07e_o1_p1.jpg', 359/386, {}),   # w3 rộng — nhát chém xẻ ngực Cantor, không máu
    ('07-E — outro/07e_o1_p2.jpg',     '07e_o1_p2.jpg', 176/335, {}),   # w3 nhỏ — cáp quang đứt, dung dịch xanh; nguồn 1:1 nên cắt hai bên vào đúng vết thương
    ('07-E — outro/07e_o1_p3.jpg',     '07e_o1_p3.jpg', 176/335, {}),   # w3 nhỏ — da mặt nhựa chảy, hologram bật sáng
    ('07-E — outro/07e_o2_p1.jpg',     '07e_o2_p1.jpg', 359/360, {}),   # v2 — Cantor thật trong penthouse District 01
    ('07-E — outro/07e_o2_p2.jpg',     '07e_o2_p2.jpg', 359/360, {}),   # v2 — "Tao đã nhớ lại toàn bộ."
    ('07-E — outro/07e_o3_p1.jpg',     '07e_o3_p1.jpg', 359/360, {}),   # v2 — Psalm nói về hàng nghìn đứa trẻ
    ('07-E — outro/07e_o3_p2.jpg',     '07e_o3_p2.jpg', 359/360, {}),   # v2 — Kai đòi chia sáu phần, Ash chốt chia đôi
    ('07-E — outro/07e_o4_p1.jpg.jpg', '07e_o4_p1.jpg', 359/690, {}),   # splash — Kai ghi lại từng cái tên
    ('07-E — outro/07e_o5_p1.jpg',     '07e_o5_p1.jpg', 359/238, {}),   # v3 dải — Muzzle vác cánh cửa thứ tư
    ('07-E — outro/07e_o5_p2.jpg',     '07e_o5_p2.jpg', 359/238, {}),   # v3 dải — Ronin tra kiếm vào bao
    ('07-E — outro/07e_o5_p3.jpg',     '07e_o5_p3.jpg', 359/238, {}),   # v3 dải — "Rõ, tổ trưởng."
    ('07-E — outro/07e_o6_p1.jpg',     '07e_o6_p1.jpg', 359/690, {}),   # splash — Yuki dẫn cả tổ leo ngược lên
    ('07-E — outro/07e_o7_p1.jpg',     '07e_o7_p1.jpg', 359/690, {}),   # splash — title card hết chương 1
]


def find_watermark(im):
    """Dò ngôi sao 4 cánh của Gemini ở góc phải dưới. Không thấy → None.

    Hai tiêu chí tách dấu khỏi đốm sáng thường (đèn cam nhoè ở bãi phế liệu từng làm báo nhầm):
      · KÍCH THƯỚC — dấu là cụm gọn ~4,5% bề ngang ảnh, không phải mảng sáng lớn;
      · MÀU — dấu gần như xám trắng (bão hoà thấp), còn đèn thì cam rực.
    """
    rgb = np.asarray(im.convert('RGB'), dtype=np.int16)
    a = rgb.mean(axis=2)
    H, W = a.shape
    y0, y1 = int(H * .78), int(H * .98)
    x0, x1 = int(W * .86), int(W * .995)
    r, rc = a[y0:y1, x0:x1], rgb[y0:y1, x0:x1]
    if r.size == 0:
        return None
    thr = max(110, float(np.median(r)) + 45)
    m = r > thr
    if m.sum() < 60:
        return None
    ys, xs = np.where(m)
    bw, bh = xs.max() - xs.min(), ys.max() - ys.min()
    if bw > W * .09 or bh > H * .14:                 # quá to → là đèn/mảng sáng, không phải dấu
        return None
    sat = (rc[m].max(axis=1) - rc[m].min(axis=1)).mean()
    if sat > 26:                                     # quá rực → đèn màu, không phải dấu xám
        return None
    return (x0 + xs.min() - 5, y0 + ys.min() - 5, x0 + xs.max() + 5, y0 + ys.max() + 5)


def trim_bars(im, tol=7, flat=3.0):
    """Cắt dải viền phẳng hai bên / trên dưới: cột (hàng) gần như một màu VÀ trùng màu mép ảnh."""
    a = np.asarray(im.convert('RGB'), dtype=np.float32)
    H, W, _ = a.shape

    def scan(vals, ref):
        """trả về số dòng viền tính từ đầu dãy"""
        n = 0
        for i in range(len(vals)):
            line = vals[i]
            if line.std(axis=0).mean() > flat:          # còn chi tiết → hết viền
                break
            if np.abs(line.mean(axis=0) - ref).mean() > tol * 4:
                break
            n += 1
        return n

    cols = [a[:, x, :] for x in range(W)]
    left  = scan(cols, a[:, 0, :].mean(axis=0))
    right = scan(cols[::-1], a[:, -1, :].mean(axis=0))
    rows = [a[y, :, :] for y in range(H)]
    top    = scan(rows, a[0, :, :].mean(axis=0))
    bottom = scan(rows[::-1], a[-1, :, :].mean(axis=0))
    # chừa lại nếu ăn quá sâu (ảnh nền tối đều có thể bị hiểu nhầm là viền)
    if left + right > W * .55: left = right = 0
    if top + bottom > H * .55: top = bottom = 0
    return im.crop((left, top, W - right, H - bottom)), (left, top, right, bottom)


def crop_ratio(im, ratio, wm_box, ay=.5, ax=.5):
    """Cắt về đúng tỉ lệ, ưu tiên giữa khung; còn dính dấu thì đẩy sang trái cho hết dấu.
       ay = neo dọc khi phải cắt bớt chiều cao · ax = neo ngang khi phải cắt bớt chiều ngang
       (0 sát mép đầu · .5 giữa · 1 sát mép cuối)."""
    W, H = im.size
    if W / H > ratio:                      # ảnh rộng hơn ô → cắt bớt chiều ngang
        w, h = int(round(H * ratio)), H
    else:                                  # ảnh cao hơn ô → cắt bớt chiều dọc
        w, h = W, int(round(W / ratio))
    x0 = int(round((W - w) * ax))
    y0 = int(round((H - h) * ay))
    note = ''
    if wm_box:
        wx0, wy0, wx1, wy1 = wm_box
        hits = lambda X0: (X0 < wx1 and X0 + w > wx0) and (y0 < wy1 and y0 + h > wy0)
        if hits(x0):
            shift = max(0, min(x0, x0 - (x0 + w - wx0)))   # đẩy trái tới khi mép phải < mép trái dấu
            if not hits(shift):
                x0, note = shift, ' · đẩy trái cho hết dấu'
            else:
                y0, note = max(0, min(H - h, wy1 + 1)), ' · đẩy xuống cho hết dấu'
    return im.crop((x0, y0, x0 + w, y0 + h)), note


def main():
    if not os.path.isdir(SRC):
        print('Khong thay thu muc nguon:', SRC); sys.exit(1)
    os.makedirs(OUT, exist_ok=True)
    for src, dst, ratio, opt in JOBS:
        p = os.path.join(SRC, src)
        if not os.path.exists(p):
            print('  ! thieu', src); continue
        im0 = Image.open(p).convert('RGB')
        W0, H0 = im0.size
        wm = find_watermark(im0)
        if opt.get('xr'):                        # chốt tay dải ảnh thật, bỏ qua dò viền tự động
            x0, x1 = opt['xr']
            im, bars = im0.crop((x0, 0, x1, H0)), (x0, 0, W0 - x1, 0)
        else:
            im, bars = trim_bars(im0)
        # dấu nằm theo toạ độ ảnh gốc → dời về hệ toạ độ sau khi cắt viền
        if wm: wm = (wm[0] - bars[0], wm[1] - bars[1], wm[2] - bars[0], wm[3] - bars[1])
        im, note = crop_ratio(im, ratio, wm, opt.get('ay', .5), opt.get('ax', .5))
        if max(im.size) > MAXLONG:
            s = MAXLONG / max(im.size)
            im = im.resize((round(im.size[0] * s), round(im.size[1] * s)), Image.LANCZOS)
        im.save(os.path.join(OUT, dst), 'JPEG', quality=92, optimize=True, progressive=True)
        kb = round(os.path.getsize(os.path.join(OUT, dst)) / 1024)
        bar = ('cat vien L%d T%d R%d B%d' % bars) if any(bars) else 'khong co vien'
        bar += ' · co dau' if wm else ' · khong dau'
        print('%-10s -> %-16s %s  ti le %.3f  %s  %d KB%s'
              % (src, dst, '%dx%d' % im.size, im.size[0] / im.size[1], bar, kb, note))


if __name__ == '__main__':
    main()
