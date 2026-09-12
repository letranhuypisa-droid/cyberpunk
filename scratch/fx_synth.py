#!/usr/bin/env python3
"""Dựng 14 overlay hiệu ứng bằng công thức -> PNG trong suốt, rồi gọi fx_sheet.py ra art/fx/<kind>.webp.

    python scratch/fx_synth.py                 # dựng cả 14
    python scratch/fx_synth.py crit zero       # chỉ vài cái
    python scratch/fx_synth.py --png-only hit  # chỉ ghi PNG ra art-src/FX/<kind>/, không gọi fx_sheet

VÌ SAO DỰNG BẰNG CÔNG THỨC. Quy cách ở docs/fx-prompts.md §2 đòi ba thứ video AI rất khó cho: nền một màu phẳng
tuyệt đối, máy quay đứng yên từng pixel, và bốn bản _loop phải khép vòng không nháy. Dựng bằng numpy thì:
  · alpha là alpha thật, không phải khử nền -> không ăn mất mép mờ (đúng cảnh báo ở §2 "Ánh sáng")
  · màu lấy thẳng token trong css/chromefall.css, không lệch khỏi hai tông Chrome / Rust
  · mọi tham số là hàm của pha p = i/N, nên bản _loop khép vòng CHÍNH XÁC, frame cuối nối liền frame đầu
Đây là BẢN NỀN để hết 404 và để trận đánh có overlay thật. Có art xịn hơn (hoặc video AI) thì ghi đè
art/fx/<kind>.webp, không phải sửa code — prompt từng loại nằm ở docs/fx-prompts.md §3.

Vẽ bằng trường khoảng cách (distance field): mỗi hình là exp(-(d/w)^2) nên mép tự mịn, không cần lọc răng cưa.
Hiệu ứng tự phát sáng thì cộng dồn (additive) rồi mới rút alpha ra từ độ sáng; khói là lớp tối riêng, nằm dưới.
"""
import json, os, shutil, subprocess, sys
import numpy as np
from PIL import Image

if hasattr(sys.stdout, 'reconfigure'):        # in tiếng Việt ra pipe: Windows mặc định cp1252 là vỡ
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'art-src', 'FX')          # nơi để PNG nguồn (art-src/ đã trong .gitignore)
OUT = os.path.join(ROOT, 'art', 'fx')
S = 512                                            # cỡ render; fx_sheet.py cắt theo hộp chung rồi hạ về 256
M = 0.10                                           # lề chừa ra, hiệu ứng không được chạm mép (§2)

Y, X = np.mgrid[0:S, 0:S].astype(np.float32)
Y += .5
X += .5

# ---- Màu: lấy đúng token css/chromefall.css ----
def rgb(h):
    h = h.lstrip('#')
    return np.array([int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)], np.float32)

CHROME    = rgb('#7C4DFF')
CHROME_HI = rgb('#B7A4FF')
WHITE     = rgb('#DCE6F7')
CRIT      = rgb('#FFB224')
RUST      = rgb('#E2703A')
RUST_HI   = rgb('#F5A26E')
ACID      = rgb('#C9D830')
GREEN     = rgb('#8FD14F')
HP        = rgb('#5DC286')
ENERGY    = rgb('#42C4EA')
STUN      = rgb('#D8B64B')


class Frame:
    """Một frame: lớp sáng cộng dồn + lớp khói tối riêng."""

    def __init__(self):
        self.lit = np.zeros((S, S, 3), np.float32)
        self.smoke = np.zeros((S, S), np.float32)

    # -- nguyên thuỷ --
    def glow(self, x, y, r, color, gain=1.0, falloff=2.0):
        d = np.hypot(X - x, Y - y)
        self.lit += (np.exp(-(d / max(r, .5)) ** falloff) * gain)[..., None] * color

    def streak(self, x0, y0, x1, y1, w, color, gain=1.0, taper=1.0, core=0.0, flame=False):
        """Vệt thẳng. core>0 thì thêm lõi trắng mảnh bên trong.
           taper>0: thuôn đều CẢ HAI đầu — dáng nhát cắt.
           flame=True: BÈ ở (x0,y0), NHỌN ở (x1,y1) — lửa mà thuôn hai đầu thì ra hình lá bay,
           không ra ngọn lửa mọc từ đất."""
        dx, dy = x1 - x0, y1 - y0
        L2 = max(dx * dx + dy * dy, 1e-6)
        t = np.clip(((X - x0) * dx + (Y - y0) * dy) / L2, 0, 1)
        d = np.hypot(X - (x0 + t * dx), Y - (y0 + t * dy))
        if flame:
            sw = (1 - t) ** .55
        elif taper:
            # t=1 thì np.pi*t (float32) nhúc nhích quá pi -> sin ra số ÂM cỡ -9e-8, luỹ thừa không
            # nguyên thành NaN, mà NaN đi qua np.maximum là lây ra cả frame. Chặn về >=0 trước.
            sw = np.maximum(np.sin(np.pi * t), 0.0) ** taper
        else:
            sw = 1.0
        ww = np.maximum(w * sw, .6)
        i = np.exp(-(d / ww) ** 2)
        self.lit += (i * gain)[..., None] * color
        if core:
            wc = np.maximum(ww * .28, .5)
            self.lit += (np.exp(-(d / wc) ** 2) * core)[..., None] * WHITE

    def ring(self, x, y, r, w, color, gain=1.0):
        d = np.abs(np.hypot(X - x, Y - y) - r)
        self.lit += (np.exp(-(d / max(w, .5)) ** 2) * gain)[..., None] * color

    def arc(self, x, y, r, w, a0, a1, color, gain=1.0):
        """Cung tròn từ góc a0 tới a1 (radian, 0 = phải, ngược chiều kim đồng hồ)."""
        ang = np.arctan2(Y - y, X - x)
        da = (ang - a0) % (2 * np.pi)
        span = (a1 - a0) % (2 * np.pi)
        inside = da <= span
        d = np.abs(np.hypot(X - x, Y - y) - r)
        e = np.exp(-(d / max(w, .5)) ** 2)
        # tắt dần ở hai đầu cung cho khỏi cụt
        fade = np.clip(np.minimum(da, span - da) / max(span * .18, 1e-3), 0, 1)
        self.lit += (e * inside * fade * gain)[..., None] * color

    def bolt(self, x0, y0, x1, y1, w, color, gain=1.0, seg=7, jag=.16, rnd=None, core=0.0):
        """Tia điện: nối các đoạn thẳng lệch ngang so với đường gốc."""
        rnd = rnd or np.random.default_rng(0)
        dx, dy = x1 - x0, y1 - y0
        L = np.hypot(dx, dy)
        nx, ny = -dy / L, dx / L
        pts = []
        for k in range(seg + 1):
            t = k / seg
            o = 0 if k in (0, seg) else rnd.uniform(-1, 1) * jag * L
            pts.append((x0 + dx * t + nx * o, y0 + dy * t + ny * o))
        for (ax, ay), (bx, by) in zip(pts, pts[1:]):
            self.streak(ax, ay, bx, by, w, color, gain, taper=0, core=core)

    def star(self, x, y, r, color, gain=1.0, rot=0.0, points=4, w=None):
        w = w or max(r * .16, .8)
        for k in range(points):
            a = rot + k * np.pi / points
            self.streak(x - np.cos(a) * r, y - np.sin(a) * r,
                        x + np.cos(a) * r, y + np.sin(a) * r, w, color, gain, taper=1.6)
        self.glow(x, y, r * .34, WHITE, gain * .7)

    def tongue(self, x, base, h, w, color, gain=1.0, curve=0.0, n=6, lean=.6):
        """Lưỡi lửa: xếp một chuỗi đốm sáng nhỏ dần theo đường CONG.
           Dùng streak thẳng thì bảy lưỡi ra bảy cái nón đều tăm tắp, nhìn thành hàng rào cọc
           chứ không thành lửa — lửa phải lượn và so le."""
        for k in range(n):
            t = k / (n - 1)
            self.glow(x + curve * t ** 1.6, base - h * t,
                      w * (1 - t) ** lean + .9, color, gain * (1 - .22 * t))

    def puff(self, x, y, r, a=1.0):
        d = np.hypot(X - x, Y - y)
        self.smoke += np.exp(-(d / max(r, .5)) ** 2) * a

    # -- kết xuất --
    def rgba(self):
        lit = np.nan_to_num(self.lit)
        lum = lit.max(axis=2)
        # Hiệu ứng tự phát sáng: màu giữ NGUYÊN độ tươi, cường độ dồn hết vào alpha.
        # Để màu tối dần theo cường độ là tối HAI lần (màu tối × alpha thấp): hạt lửa mờ ra
        # đốm XÁM chứ không phải đốm cam mờ, và trên nền tối của game thì gần như mất hẳn.
        col = lit / np.maximum(lum[..., None], 1e-6)
        a_lit = np.clip(lum, 0, 1)
        a_smoke = np.clip(self.smoke, 0, 1) * .55
        smoke_col = np.array([.10, .09, .10], np.float32)
        a = np.clip(a_lit + a_smoke * (1 - a_lit), 0, 1)
        with np.errstate(invalid='ignore', divide='ignore'):
            c = (col * a_lit[..., None] + smoke_col * (a_smoke * (1 - a_lit))[..., None]) / np.maximum(a[..., None], 1e-6)
        c = np.clip(np.nan_to_num(c), 0, 1)
        return (np.dstack([c, a]) * 255).astype(np.uint8)


def clamp01(x):
    return 0.0 if x < 0 else (1.0 if x > 1 else float(x))


def ease_out(p, k=2.0):
    return 1 - (1 - clamp01(p)) ** k


def dec(x, k=1.0):
    """Số hạng tắt dần, đã chặn về [0,1]. Không chặn thì x lố 1 một phần tỉ tỉ do làm tròn là
       (1-x)**k thành luỹ thừa số âm -> numpy trả số phức và vỡ cả frame."""
    return clamp01(x) ** k


def fade_tail(p, start=.55):
    """1 tới khi p=start rồi tắt dần về 0 ở p=1.
       Số mũ để thoải (0.85 chứ không phải 1.4): mũ dốc thì bốn frame cuối của sheet chỉ còn dưới 10%
       cường độ — nhìn ra sheet trống bốn ô, phí đúng 1/4 số frame mình vừa trả tiền dung lượng."""
    return 1.0 if p <= start else max(0.0, (1 - p) / (1 - start)) ** .85


C = S / 2
R = S * (.5 - M)          # bán kính dùng được


# ============================ 10 hiệu ứng một lần ============================

def f_hit(i, n):
    """Một vệt chéo trắng nhanh + vài tia lửa nhỏ. Nhỏ và nhanh, không che mặt (§3)."""
    p = i / (n - 1)
    f = Frame()
    g = fade_tail(p, .25)
    L = R * (.62 + .38 * ease_out(min(p / .35, 1), 2.2))
    ax, ay = C - L * .72, C - L * .72
    bx, by = C + L * .72, C + L * .72
    f.streak(ax, ay, bx, by, S * .030 * (1.1 - .5 * p), WHITE, 1.05 * g, taper=1.1, core=.85 * g)
    f.streak(ax, ay, bx, by, S * .075, CHROME_HI, .30 * g)
    rnd = np.random.default_rng(7)
    for k in range(9):
        a = rnd.uniform(0, 2 * np.pi)
        sp = rnd.uniform(.35, 1.0) * R * .85 * ease_out(p, 1.7)
        f.glow(C + np.cos(a) * sp, C + np.sin(a) * sp, S * .010, WHITE, .8 * fade_tail(p, .15))
    return f


def f_crit(i, n):
    """Hai vệt vàng cắt nhau thành chữ X + loé lõi trắng + tia lửa vàng bung ra. Màu --crit (§3)."""
    p = i / (n - 1)
    f = Frame()
    for k, d0 in enumerate((.0, .16)):                      # vệt thứ hai vào sau một nhịp
        q = (p - d0) / (1 - d0)
        if q <= 0:
            continue
        g = fade_tail(q, .4)
        L = R * (.55 + .45 * ease_out(min(q / .3, 1), 2.4))
        s = 1 if k == 0 else -1
        f.streak(C - L * .74, C - L * .74 * s, C + L * .74, C + L * .74 * s,
                 S * .034 * (1.1 - .45 * q), CRIT, 1.0 * g, taper=1.0, core=.9 * g)
        f.streak(C - L * .74, C - L * .74 * s, C + L * .74, C + L * .74 * s,
                 S * .085, CRIT, .26 * g)
    if p < .5:                                             # loé giữa lúc hai vệt gặp nhau
        b = np.exp(-((p - .22) / .1) ** 2)
        f.glow(C, C, S * .075, WHITE, 1.25 * b)
        f.glow(C, C, S * .17, CRIT, .55 * b)
    rnd = np.random.default_rng(11)
    for k in range(16):
        a = rnd.uniform(0, 2 * np.pi)
        sp = rnd.uniform(.3, 1.0) * R * ease_out(max(p - .12, 0) / .88, 1.6)
        f.glow(C + np.cos(a) * sp, C + np.sin(a) * sp, S * .011,
               CRIT if k % 3 else WHITE, .95 * fade_tail(p, .3))
    return f


def f_zero(i, n):
    """ZERO của Yuki: MỘT nhát DỌC tím-trắng, lõi mảnh sắc, quầng tím lạnh loang ra,
       thêm một vòng tím mảnh nở ra. Đúng câu 'Ba bước, một nhát' (§3)."""
    p = i / (n - 1)
    f = Frame()
    g = fade_tail(p, .42)
    grow = ease_out(min(p / .26, 1), 3.0)
    L = R * (.35 + .65 * grow)
    f.streak(C, C - L, C, C + L, S * .068, CHROME, .34 * g)                # quầng loang, để mảnh cho ra dao
    f.streak(C, C - L, C, C + L, S * .022 * (1.15 - .5 * p), CHROME_HI, 1.0 * g, taper=.9, core=1.0 * g)
    if p > .14:                                                            # vòng nở: chỉ là nhấn phụ
        q = clamp01((p - .14) / .46)                                       # xong ở p≈.6, đừng kéo tới cuối
        f.ring(C, C, R * (.10 + .48 * ease_out(q, 2.4)), S * .0075, CHROME_HI, .45 * dec(1 - q, 1.1))
    if p < .4:
        f.glow(C, C, S * .055, WHITE, 1.1 * np.exp(-((p - .16) / .095) ** 2))
    rnd = np.random.default_rng(3)
    for k in range(7):                                                     # bụi tím rơi theo nhát
        a = rnd.uniform(-.5, .5)
        sp = rnd.uniform(.4, 1.0) * R * .9 * ease_out(p, 1.5)
        f.glow(C + np.sin(a) * sp * .5, C + rnd.uniform(-1, 1) * L * .8, S * .009, CHROME_HI,
               .7 * fade_tail(p, .25))
    return f


def f_explode(i, n):
    """Cầu lửa cam bung ra + vòng xung kích nở + cuộn khói tối. Vừa là mìn FLASHOVER vừa là lúc khiên vỡ (§2)."""
    p = i / (n - 1)
    f = Frame()
    rnd = np.random.default_rng(23)
    for k in range(9):                                                     # khói vào sau, trôi lên, ở lại lâu hơn
        a = rnd.uniform(0, 2 * np.pi)
        sp = rnd.uniform(.2, .95) * R * .78 * ease_out(p, 1.3)
        f.puff(C + np.cos(a) * sp, C + np.sin(a) * sp - R * .18 * p,
               S * (.06 + .095 * p), .6 * min(p / .22, 1) * (1 - .5 * p))
    # Thuỳ lửa LỆCH TÂM: một quầng tròn duy nhất thì ra "quả bóng phát sáng", không ra vụ nổ.
    hot = np.exp(-((p - .10) / .16) ** 2)
    for k in range(7):
        a = k * 2 * np.pi / 7 + rnd.uniform(-.35, .35)
        sp = R * (.10 + .46 * ease_out(min(p / .5, 1), 1.7)) * rnd.uniform(.7, 1.25)
        rr = S * (.075 + .055 * ease_out(min(p / .45, 1), 1.5)) * rnd.uniform(.75, 1.2)
        x, y = C + np.cos(a) * sp, C + np.sin(a) * sp
        f.glow(x, y, rr, RUST, .95 * fade_tail(p, .28))
        f.glow(x, y, rr * .55, CRIT, .9 * fade_tail(p, .2))
        f.glow(x, y, rr * .30, WHITE, .8 * hot)
    if p < .42:
        f.glow(C, C, S * .085, WHITE, 1.15 * np.exp(-((p - .08) / .11) ** 2))
    if p > .04:
        q = clamp01((p - .04) / .70)
        f.ring(C, C, R * (.12 + .88 * ease_out(q, 2.3)), S * .012, RUST_HI, .85 * dec(1 - q, 1.1))
    for k in range(12):                                                    # mảnh bay: VỆT ngắn theo hướng bay
        a = rnd.uniform(0, 2 * np.pi)                                      # (đốm tròn thì nhìn ra hạt bụi lơ lửng)
        d0 = R * (.25 + .75 * ease_out(p, 1.45)) * rnd.uniform(.55, 1.05)
        ln = S * .035 * (1 - .4 * p)
        x0, y0 = C + np.cos(a) * d0, C + np.sin(a) * d0 - R * .10 * p * p
        f.streak(x0, y0, x0 + np.cos(a) * ln, y0 + np.sin(a) * ln, S * .0065,
                 CRIT if k % 2 else RUST_HI, .9 * fade_tail(p, .3), taper=1.2)
    return f


def f_shock(i, n):
    """Tia điện răng cưa xanh-trắng nổ quanh một điểm, nháy (§3). Mỗi frame một hình tia khác -> nhìn ra 'nháy'."""
    p = i / (n - 1)
    f = Frame()
    rnd = np.random.default_rng(100 + i)                                   # đổi theo frame: nháy
    g = fade_tail(p, .5) * (.55 + .45 * abs(np.sin(p * np.pi * 3.4)))      # nhịp nháy
    f.glow(C, C, S * .085, ENERGY, .5 * g)
    for k in range(5):
        a = rnd.uniform(0, 2 * np.pi)
        L = R * rnd.uniform(.55, 1.0)
        f.bolt(C, C, C + np.cos(a) * L, C + np.sin(a) * L, S * .0085, ENERGY, 1.0 * g,
               seg=6, jag=.075, rnd=rnd, core=.55 * g)
    if p < .35:
        f.glow(C, C, S * .05, WHITE, .95 * np.exp(-((p - .1) / .1) ** 2))
    for k in range(6):
        a = rnd.uniform(0, 2 * np.pi)
        sp = rnd.uniform(.5, 1.0) * R
        f.glow(C + np.cos(a) * sp, C + np.sin(a) * sp, S * .009, WHITE, .7 * g)
    return f


def f_poison(i, n):
    """Axit xanh bắn ra, giọt nhỏ chảy xuống, bong bóng độc nhỏ (§3)."""
    p = i / (n - 1)
    f = Frame()
    rnd = np.random.default_rng(31)
    g = fade_tail(p, .38)
    # Quầng giữa phải NHỎ: để to là thành quả cầu xanh, mất hẳn cảm giác bắn toé.
    f.glow(C, C, S * (.05 + .055 * ease_out(min(p / .35, 1), 1.8)), GREEN, .8 * g)
    f.glow(C, C, S * (.028 + .030 * ease_out(min(p / .3, 1), 2)), ACID, .95 * fade_tail(p, .2))
    for k in range(13):                                                    # giọt bay theo tia rồi rơi
        a = rnd.uniform(0, 2 * np.pi)
        sp = rnd.uniform(.45, 1.0) * R * .92 * ease_out(p, 1.45)
        fall = R * .50 * (p ** 2.1) * rnd.uniform(.5, 1.35)
        x = C + np.cos(a) * sp
        y = C + np.sin(a) * sp * .62 + fall
        rr = S * .014 * (1 - .3 * p) * rnd.uniform(.7, 1.3)
        f.glow(x, y, rr, ACID if k % 3 else GREEN, .95 * g)
        f.streak(x, y, x - np.cos(a) * S * .030, y - np.sin(a) * S * .018 - fall * .35,
                 rr * .5, GREEN, .5 * g, taper=1.3)                        # đuôi giọt: cho thấy hướng bắn
    for k in range(4):                                                     # bong bóng nổi lên rồi vỡ
        q = (p * 1.2 + k / 4) % 1
        x = C + (k - 1.5) * R * .30 + np.sin(q * 6.0 + k) * S * .016
        y = C + R * .26 - q * R * .70
        rr = S * .017 * (.5 + .5 * q)
        f.ring(x, y, rr, S * .005, ACID, .85 * g * dec(1 - q, .8))
        f.glow(x, y, rr * .6, GREEN, .35 * g * (1 - q))
    return f


def f_burn(i, n):
    """Lửa bùng lên từ mặt đất kèm than, cam-vàng. Neo ở chân (§3) nên dựng ở đáy khung."""
    p = i / (n - 1)
    f = Frame()
    base = C + R * .80
    g = fade_tail(p, .45)
    rise = ease_out(min(p / .4, 1), 2.0)
    f.streak(C - R * .40, base, C + R * .40, base, S * .052, RUST, .55 * g, taper=0)   # bệ lửa: cho bảy lưỡi
    for k in range(7):                                                     # dính thành một khối, không rời rạc
        ph = (p * 1.5 + k / 7) % 1
        x = C + (k - 3) * R * .20 + np.sin(ph * 5.2 + k * 1.7) * S * .022
        sz = .70 + .30 * ((k * 5) % 7) / 6                                 # lệch cỡ theo lưỡi, khỏi đều nhau
        h = R * (.30 + .70 * rise) * (.55 + .45 * np.sin(np.pi * min(ph + .15, 1))) * sz
        cur = np.sin(ph * 6.283 + k * 2.1) * S * .045
        f.tongue(x, base, h, S * .040 * sz, RUST, .95 * g, curve=cur)
        f.tongue(x, base, h * .58, S * .022 * sz, CRIT, 1.0 * g, curve=cur * .5, n=4)
    f.glow(C, base, R * (.22 + .18 * rise), RUST, .55 * g, falloff=1.6)
    f.glow(C, base - R * .06, R * .11, CRIT, .8 * g)
    rnd = np.random.default_rng(41)
    for k in range(10):                                                    # than bay lên
        q = (p * 1.3 + k / 10) % 1
        x = C + rnd.uniform(-1, 1) * R * .55 + np.sin(q * 7 + k) * S * .02
        f.glow(x, base - q * R * 1.25, S * .0085, CRIT, .85 * g * dec(1 - q, .9))
    return f


def f_stun(i, n):
    """Vòng vàng loé + ba ngôi sao nhỏ nảy ra (§3)."""
    p = i / (n - 1)
    f = Frame()
    g = fade_tail(p, .35)
    q = ease_out(min(p / .45, 1), 2.2)
    f.ring(C, C, R * (.18 + .72 * q), S * .016 * (1 - .45 * p), STUN, .95 * g)
    if p < .4:
        f.glow(C, C, S * .07, WHITE, .9 * np.exp(-((p - .08) / .1) ** 2))
    for k in range(3):
        a = -np.pi / 2 + (k - 1) * 1.05
        d = R * (.22 + .58 * ease_out(min(p / .5, 1), 1.8))
        pop = np.clip((p - .08 - k * .05) / .3, 0, 1)
        f.star(C + np.cos(a) * d, C + np.sin(a) * d * .8, S * .052 * (.4 + .6 * pop),
               STUN, 1.0 * g * pop, rot=p * 2.0 + k, points=4)
    return f


def f_heal(i, n):
    """Hạt sáng xanh bay lên kèm quầng dịu (§3)."""
    p = i / (n - 1)
    f = Frame()
    g = fade_tail(p, .5)
    # Cột sáng dựng lên + quầng nền: thiếu nó thì 18 hạt nhỏ nằm rời rạc, nhìn ra bụi chứ không ra hồi máu.
    f.streak(C, C + R * .75, C, C - R * .30 * ease_out(min(p / .6, 1), 1.6), S * .085, HP, .34 * g)
    f.glow(C, C + R * .30, R * (.30 + .16 * ease_out(p, 1.4)), HP, .45 * g, falloff=1.7)
    rnd = np.random.default_rng(53)
    for k in range(18):
        q = (p * 1.15 + k / 18) % 1
        x = C + rnd.uniform(-1, 1) * R * .58 + np.sin(q * 5.5 + k * 2.1) * S * .022
        y = C + R * .72 - q * R * 1.45
        r = S * .0135 * (.6 + .55 * np.sin(np.pi * q))
        f.glow(x, y, r, HP if k % 3 else WHITE, 1.05 * g * dec(np.sin(np.pi * q), .55))
    f.ring(C, C + R * .62, R * .42, S * .011, HP, .45 * g * ease_out(p, 1.2))
    return f


def f_shield(i, n):
    """Vòm lục giác cam ập vào quanh người kèm than (§2). Lúc vỡ thì game phát explode, không phải file này."""
    p = i / (n - 1)
    f = Frame()
    g = fade_tail(p, .5)
    snap = ease_out(min(p / .28, 1), 3.2)
    rr = R * (1.35 - .38 * snap)                                           # ập từ ngoài vào
    for k in range(6):                                                     # sáu cạnh lục giác
        a0 = -np.pi / 2 + k * np.pi / 3
        a1 = a0 + np.pi / 3
        x0, y0 = C + np.cos(a0) * rr, C + np.sin(a0) * rr * .92
        x1, y1 = C + np.cos(a1) * rr, C + np.sin(a1) * rr * .92
        f.streak(x0, y0, x1, y1, S * .012, RUST_HI, .95 * g, taper=0, core=.45 * g)
        f.streak(x0, y0, x1, y1, S * .035, RUST, .38 * g, taper=0)
    f.ring(C, C, rr * .99, S * .05, RUST, .20 * g)
    if p < .45:
        f.glow(C, C, S * .12, RUST_HI, .55 * np.exp(-((p - .26) / .12) ** 2))
    rnd = np.random.default_rng(61)
    for k in range(9):                                                     # than quanh vòm
        a = rnd.uniform(0, 2 * np.pi)
        f.glow(C + np.cos(a) * rr * .98, C + np.sin(a) * rr * .9, S * .009, CRIT, .8 * g * snap)
    return f


# ============================ 4 bản lặp (khép vòng) ============================
# Mọi tham số chỉ phụ thuộc pha p = i/n (KHÔNG phải i/(n-1)) và tuần hoàn theo p,
# nên frame cuối nối liền frame đầu -> không nháy ở chỗ nối (§2).

def f_poison_loop(i, n):
    """Bong bóng độc xanh nổi lên chậm rồi vỡ, khép vòng (§3)."""
    p = i / n
    f = Frame()
    f.glow(C, C + R * .2, R * .42, GREEN, .22, falloff=1.7)
    rnd = np.random.default_rng(71)
    K = 7
    for k in range(K):
        q = (p + k / K) % 1
        x = C + rnd.uniform(-1, 1) * R * .55 + np.sin(q * 5.4 + k * 2.3) * S * .020
        y = C + R * .62 - q * R * 1.25
        rr = S * .017 * (.45 + .55 * q)
        pop = np.clip((q - .82) / .18, 0, 1)                               # cuối đường thì vỡ
        f.ring(x, y, rr * (1 + pop * .9), S * .0055 * (1 - pop * .6), ACID, .85 * (1 - pop))
        f.glow(x, y - rr * .25, rr * .45, GREEN, .3 * (1 - pop))
        if pop > 0:
            for j in range(4):
                a = j * np.pi / 2 + q * 3
                f.glow(x + np.cos(a) * rr * 1.7 * pop, y + np.sin(a) * rr * 1.7 * pop,
                       S * .006, ACID, .7 * pop * (1 - pop))
    return f


def f_burn_loop(i, n):
    """Lửa liu riu ở đáy khung, than bay lên, khép vòng (§3)."""
    p = i / n
    f = Frame()
    base = C + R * .80
    f.streak(C - R * .38, base, C + R * .38, base, S * .048, RUST, .5, taper=0)        # bệ lửa
    for k in range(7):
        q = (p + k / 7) % 1
        x = C + (k - 3) * R * .19 + np.sin(q * 6.283 + k * 1.9) * S * .018
        sz = .70 + .30 * ((k * 5) % 7) / 6
        h = R * (.34 + .26 * np.sin(np.pi * q) + .10 * np.sin(4 * np.pi * (p + k / 7))) * sz
        cur = np.sin(q * 6.283 + k * 2.1) * S * .040
        f.tongue(x, base, h, S * .038 * sz, RUST, .9, curve=cur)
        f.tongue(x, base, h * .58, S * .021 * sz, CRIT, .95, curve=cur * .5, n=4)
    f.glow(C, base, R * (.22 + .03 * np.sin(2 * np.pi * p)), RUST, .5, falloff=1.6)
    rnd = np.random.default_rng(73)
    K = 9
    for k in range(K):
        q = (p + k / K) % 1
        x = C + rnd.uniform(-1, 1) * R * .5 + np.sin(q * 6.283 + k) * S * .018
        f.glow(x, base - q * R * 1.15, S * .008, CRIT, .8 * dec(1 - q, .9))
    return f


def f_stun_loop(i, n):
    """Ba ngôi sao vàng quay vòng trên đầu, khép vòng (§3). Chu kỳ = đúng một vòng."""
    p = i / n
    f = Frame()
    for k in range(3):
        a = 2 * np.pi * (p + k / 3)
        x = C + np.cos(a) * R * .62
        y = C + np.sin(a) * R * .26                      # ellipse: nhìn như quay quanh đầu
        depth = .55 + .45 * (np.sin(a) * .5 + .5)        # ra trước thì to và sáng hơn
        f.star(x, y, S * .048 * depth, STUN, .95 * depth, rot=2 * np.pi * p * 1.5 + k, points=4)
    f.ring(C, C + R * .02, R * .62, S * .006, STUN, .16)
    return f


def f_shield_loop(i, n):
    """Vòm lửa cam thở và lay, khép vòng (§2)."""
    p = i / n
    f = Frame()
    breath = 1 + .035 * np.sin(2 * np.pi * p)
    rr = R * .96 * breath
    for k in range(6):
        a0 = -np.pi / 2 + k * np.pi / 3
        a1 = a0 + np.pi / 3
        fl = .8 + .2 * np.sin(2 * np.pi * (p * 2 + k / 6))                 # lay theo cạnh, lệch pha
        x0, y0 = C + np.cos(a0) * rr, C + np.sin(a0) * rr * .92
        x1, y1 = C + np.cos(a1) * rr, C + np.sin(a1) * rr * .92
        f.streak(x0, y0, x1, y1, S * .011, RUST_HI, .85 * fl, taper=0, core=.3 * fl)
        f.streak(x0, y0, x1, y1, S * .032, RUST, .34 * fl, taper=0)
    f.ring(C, C, rr * .99, S * .055, RUST, .18 + .04 * np.sin(2 * np.pi * p))
    K = 6
    for k in range(K):                                                     # than trôi dọc vòm
        q = (p + k / K) % 1
        a = 2 * np.pi * q
        f.glow(C + np.cos(a) * rr, C + np.sin(a) * rr * .92, S * .0075, CRIT, .7 * (.4 + .6 * np.sin(np.pi * q)))
    return f


# kind -> (hàm, số frame, có phải bản lặp). Số frame là bội số của 6 cho khỏi thừa ô ở sheet.
KINDS = {
    'hit':         (f_hit, 12, False),        # 0.50 s @24fps
    'crit':        (f_crit, 18, False),       # 0.75 s
    'zero':        (f_zero, 18, False),       # 0.75 s
    'explode':     (f_explode, 18, False),    # 0.75 s
    'shock':       (f_shock, 12, False),      # 0.50 s
    'poison':      (f_poison, 18, False),     # 0.75 s
    'burn':        (f_burn, 18, False),       # 0.75 s
    'stun':        (f_stun, 12, False),       # 0.50 s
    'heal':        (f_heal, 18, False),       # 0.75 s
    'shield':      (f_shield, 18, False),     # 0.75 s
    'poison_loop': (f_poison_loop, 18, True),  # 1.125 s @16fps
    'burn_loop':   (f_burn_loop, 18, True),
    'stun_loop':   (f_stun_loop, 18, True),
    'shield_loop': (f_shield_loop, 18, True),
}


def render(kind):
    fn, n, loop = KINDS[kind]
    d = os.path.join(SRC, kind)
    shutil.rmtree(d, ignore_errors=True)
    os.makedirs(d, exist_ok=True)
    for i in range(n):
        Image.fromarray(fn(i, n).rgba(), 'RGBA').save(os.path.join(d, f'f_{i:03d}.png'))
    return d, n, loop


KB_MAX = 300          # mức trần một sheet theo docs/fx-prompts.md §2


def sheet(kind, d, loop):
    """Gọi fx_sheet.py. Lố trần dung lượng thì hạ chất lượng WebP rồi làm lại — mấy bản vòm lửa
       nhiều chi tiết cam ở q85 ra 307 kB, vượt trần đúng một tí."""
    out = os.path.join(OUT, f'{kind}.webp')
    for q in (85, 76, 68):
        r = subprocess.run([sys.executable, os.path.join(ROOT, 'scratch', 'fx_sheet.py'), d, out,
                            '--fps', '16' if loop else '24', '--trim', '0', '--q', str(q)],
                           capture_output=True, text=True, encoding='utf-8', errors='replace')
        if r.returncode:
            return {'kind': kind, 'loi': (r.stderr or r.stdout).strip()[:200]}
        j = json.loads(r.stdout.strip().splitlines()[-1])
        j['kind'] = kind
        j['q'] = q
        if j['kb'] <= KB_MAX:
            return j
    return j


if __name__ == '__main__':
    argv = sys.argv[1:]
    png_only = '--png-only' in argv
    names = [a for a in argv if not a.startswith('-')] or list(KINDS)
    os.makedirs(OUT, exist_ok=True)
    rows = []
    for k in names:
        if k not in KINDS:
            print(f'  ? {k} — không có trong bảng ({", ".join(KINDS)})')
            continue
        d, n, loop = render(k)
        rows.append({'kind': k, 'frames': n, 'png': d} if png_only else sheet(k, d, loop))
        print('  ' + json.dumps(rows[-1], ensure_ascii=False))
    tot = sum(r.get('kb', 0) for r in rows)
    print(f'\n{len(rows)} sheet · tổng {tot} kB · lỗi: {sum(1 for r in rows if "loi" in r)}')
