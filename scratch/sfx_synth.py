#!/usr/bin/env python3
"""Tổng hợp 6 tiếng còn trống thành wav nguồn -> art-src/SFX/<tên>.wav.

    python scratch/sfx_synth.py                 # sinh cả 6
    python scratch/sfx_synth.py tell hit3       # chỉ vài cái
    python scratch/sfx_synth.py --out .         # ghi ra thư mục khác

Sinh xong chạy `python scratch/sfx_install.py <tên>...` để cắt lặng, kéo đỉnh về -1 dBFS và ghi audio/<tên>.ogg.

VÌ SAO CÓ FILE NÀY. Năm tiếng gacha (tell, tell_up, tell_down, reveal_a, new_char) và bản thứ ba của đòn thường
(hit3) chưa có file, nên js/audio.js rơi về AUDIO.tone() — một bộ dao động trần, nghe là tiếng máy kêu bíp. Chỗ này
tổng hợp cũng bằng công thức nhưng nhiều lớp: có transient đầu, có hoà âm lệch, có đuôi tắt dần. Nó là BẢN NỀN để
hết 404 và để nhịp gacha có tiếng thật — thu được bản ElevenLabs thì ghi đè thẳng, không phải sửa code (prompt ở
docs/sfx-prompts.md §10).

Chỉ dùng thư viện có sẵn của Python (wave, array, math, random) — không cần numpy. Sinh bằng cộng sin nên không có
méo răng cưa: sóng vuông/tam giác dựng từ hoạ ba lẻ, cắt trước ngưỡng Nyquist.
"""
import array, math, random, sys, wave
from pathlib import Path

SR = 44100
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'art-src' / 'SFX'
PEAK = 0.89                      # ~-1 dBFS; sfx_install.py đo lại và chuẩn hoá lần nữa

# Hoạ ba: (bội số tần số, biên độ). Tiếng kim loại dùng bội số LỆCH (không phải số nguyên) nên nghe ra tấm thép
# chứ không ra nốt nhạc — đúng mấy mode dao động của tấm/thanh kim loại.
TRI   = [(1, 1.0), (3, 1 / 9), (5, 1 / 25), (7, 1 / 49), (9, 1 / 81)]    # tam giác: hoạ ba lẻ, 1/n^2
SQR   = [(1, 1.0), (3, 1 / 3), (5, 1 / 5), (7, 1 / 7), (9, 1 / 9)]       # vuông: hoạ ba lẻ, 1/n
METAL = [(1, 1.0), (2.76, .55), (5.40, .30), (8.93, .16)]                # tấm kim loại
BELL  = [(1, 1.0), (2.0, .45), (2.76, .32), (3.98, .18)]                 # chuông sáng


def blank(dur):
    return [0.0] * int(SR * dur + 1)


def env_at(t, dur, atk, curve):
    """Lên nhanh rồi tắt theo hàm mũ. curve to = tắt gấp."""
    if t < 0 or t > dur:
        return 0.0
    up = t / atk if t < atk else 1.0
    return up * math.exp(-curve * t / dur)


def tone(buf, t0, dur, f0, f1=None, shape=((1, 1.0),), amp=.3, atk=.004, curve=4.0, detune=0.0):
    """Cộng sin có trượt tần số theo hàm mũ (giống exponentialRampToValueAtTime bên WebAudio).
       detune: lệch cỡ phần nghìn cho hai lớp đập vào nhau — nghe dày và hơi chua."""
    f1 = f0 if f1 is None else f1
    n0, n = int(t0 * SR), int(dur * SR)
    norm = sum(a for _, a in shape) or 1.0
    for mult, a in shape:
        if f0 * mult > SR * .45 or f1 * mult > SR * .45:
            continue                                       # quá Nyquist -> bỏ, khỏi méo
        ph, k = 0.0, mult * (1.0 + detune)
        for i in range(n):
            t = i / SR
            f = f0 * (f1 / f0) ** (t / dur) * k
            ph += 2 * math.pi * f / SR
            j = n0 + i
            if j < len(buf):
                buf[j] += math.sin(ph) * (a / norm) * amp * env_at(t, dur, atk, curve)


def noise(buf, t0, dur, amp=.3, lp=None, hp=None, atk=.001, curve=5.0, seed=0):
    """Ồn trắng qua lọc một cực. lp = chặn cao (thân tiếng va chạm), hp = chặn thấp (tiếng tách ở đầu)."""
    rnd = random.Random(seed)
    n0, n = int(t0 * SR), int(dur * SR)
    a_lp = 1 - math.exp(-2 * math.pi * (lp or SR / 2) / SR)
    a_hp = 1 - math.exp(-2 * math.pi * (hp or 1) / SR)
    y_lp = y_hp = 0.0
    for i in range(n):
        x = rnd.uniform(-1, 1)
        y_lp += a_lp * (x - y_lp)
        y_hp += a_hp * (y_lp - y_hp)
        v = y_lp - y_hp if hp else y_lp                    # trừ phần thấp = chặn thấp
        j = n0 + i
        if j < len(buf):
            buf[j] += v * amp * env_at(i / SR, dur, atk, curve) * 2.2


def write(name, buf, out):
    m = max(abs(v) for v in buf) or 1.0
    g = PEAK / m
    s = array.array('h', (int(max(-32767, min(32767, math.tanh(v * g * 1.02) * 32767))) for v in buf))
    p = out / f'{name}.wav'
    with wave.open(str(p), 'wb') as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(s.tobytes())
    return p, len(buf) / SR


# ---- Sáu tiếng. Số giây và tính cách lấy từ chỗ gọi trong js/audio.js + docs/sfx-prompts.md §10 ----

def s_tell():
    """0.26s — nhịp nền, kêu cho MỌI thẻ (loạt x10 = 10 lần). Mỏng, ngắn, hơi vươn lên, không được chiếm chỗ."""
    b = blank(.26)
    tone(b, 0, .11, 300, 400, shape=[(1, 1.0)], amp=.50, curve=4.5)      # thân: sin vươn lên
    tone(b, 0, .10, 450, 600, shape=[(1, 1.0)], amp=.16, curve=5.0)      # quãng năm cho sáng
    tone(b, 0, .08, 80, 90, shape=[(1, 1.0)], amp=.13, curve=3.5)        # chút thân dưới
    noise(b, 0, .004, amp=.14, hp=4000, seed=11)                         # tách đầu: nghe rõ trên loa bé
    return b


def s_tell_up():
    """0.48s — nâng bậc. Vươn lên, có lấp lánh ở đuôi, có cú nhấn dưới cho ra trọng lượng."""
    b = blank(.48)
    tone(b, 0, .20, 480, 900, shape=TRI, amp=.52, curve=3.2)
    tone(b, .06, .17, 720, 1350, shape=[(1, 1.0)], amp=.28, curve=3.6)
    for i, f in enumerate((1800, 2400, 3000)):                           # lấp lánh: ba hạt cao lệch nhau
        tone(b, .09 + i * .018, .13, f, f * 1.12, shape=[(1, 1.0)], amp=.085, curve=5.5)
    tone(b, 0, .11, 110, 132, shape=SQR, amp=.20, curve=4.0)             # nhấn dưới
    noise(b, .02, .17, amp=.09, hp=2600, curve=2.2, seed=21)             # tiếng gió dâng
    return b


def s_tell_down():
    """0.44s — nâng hụt (near-miss). Tụt xuống, hai lớp lệch nhau nghe chua, CỐ Ý không có lấp lánh."""
    b = blank(.44)
    tone(b, 0, .21, 470, 290, shape=TRI, amp=.46, curve=3.0)
    tone(b, 0, .20, 470, 290, shape=TRI, amp=.24, curve=3.0, detune=-.006)   # đập với lớp trên
    noise(b, 0, .14, amp=.11, lp=900, curve=3.2, seed=31)                    # phù hơi tắt
    tone(b, .17, .13, 180, 150, shape=[(1, 1.0)], amp=.16, curve=3.0)        # rơi xuống đáy
    return b


def s_reveal_a():
    """0.74s — lật thẻ bậc A. Chuông sáng, có cú vươn lên dẫn vào, nhẹ hơn reveal_s (1.04s) rõ rệt."""
    b = blank(.74)
    tone(b, 0, .15, 440, 880, shape=[(1, 1.0)], amp=.26, curve=4.5)          # vươn lên dẫn vào
    tone(b, .05, .55, 660, 672, shape=BELL, amp=.50, curve=4.2)              # thân chuông
    tone(b, .07, .22, 2640, 2660, shape=[(1, 1.0)], amp=.075, curve=5.0)     # hạt thuỷ tinh
    tone(b, .09, .18, 3300, 3320, shape=[(1, 1.0)], amp=.055, curve=5.5)
    tone(b, .04, .13, 110, 118, shape=SQR, amp=.18, curve=4.0)               # trọng lượng lúc hạ
    noise(b, .05, .30, amp=.05, hp=5000, curve=3.0, seed=41)                 # hơi sáng ở đuôi
    return b


def s_new_char():
    """0.62s — nhãn NEW nảy vào. Ba nhịp số hoá đi lên, dứt khoát, KHÔNG phải chuông (khác reveal_a)."""
    b = blank(.62)
    for i, f in enumerate((880, 1320, 1760)):
        tone(b, i * .075, .10 + i * .02, f, f * 1.09, shape=SQR, amp=.40 - i * .06, curve=4.8)
    tone(b, 0, .07, 140, 160, shape=[(1, 1.0)], amp=.16, curve=4.0)      # tách dưới cho chắc
    noise(b, .16, .22, amp=.065, hp=4200, curve=3.4, seed=51)            # bụi sáng ở đuôi
    return b


def s_hit3():
    """0.50s — bản thứ ba của đòn thường (hit 0.48s, hit2 0.78s). Khô, ngắn, KHÔNG đuôi vang:
       nó là tiếng kêu nhiều nhất trận, vang dài là đánh ba đòn nghe như trong nhà tắm."""
    b = blank(.50)
    noise(b, 0, .012, amp=.55, hp=2500, curve=6.0, seed=61)              # tách: lưỡi chạm giáp
    noise(b, 0, .11, amp=.45, lp=1600, curve=5.0, seed=62)               # thân va chạm
    # Cú thụp dưới phải NẶNG. Để tiếng tách đầu lấn đỉnh thì sau khi chuẩn hoá, dải thấp của hit3 tụt xuống
    # -28 dB trong khi hit ở -16 và hit2 ở -22: cùng đỉnh mà nghe mỏng hơn hẳn, mà ba bản này game bốc ngẫu nhiên.
    tone(b, 0, .16, 220, 100, shape=SQR, amp=.85, curve=3.0)
    # Ngân kim loại: để nhỏ nhưng tắt CHẬM. Cắt gấp thì sau khi sfx_install.py bỏ lặng chỉ còn 0,16 s —
    # ngắn hơn hit (0,48) và hit2 (0,78) ba lần, nghe thành tiếng khác họ chứ không phải bản thứ ba.
    tone(b, .006, .30, 1500, 1460, shape=METAL, amp=.14, curve=3.6)
    noise(b, .004, .05, amp=.18, hp=3000, curve=5.0, seed=63)            # chút xé ở đầu
    return b


SFX = {'tell': s_tell, 'tell_up': s_tell_up, 'tell_down': s_tell_down,
       'reveal_a': s_reveal_a, 'new_char': s_new_char, 'hit3': s_hit3}

if __name__ == '__main__':
    argv = sys.argv[1:]
    out = OUT
    if '--out' in argv:
        i = argv.index('--out')
        out = Path(argv[i + 1]).resolve()
        argv = argv[:i] + argv[i + 2:]
    names = [a for a in argv if not a.startswith('-')] or list(SFX)
    out.mkdir(parents=True, exist_ok=True)
    for n in names:
        if n not in SFX:
            print(f'  ? {n} — không có trong bảng ({", ".join(SFX)})')
            continue
        p, dur = write(n, SFX[n](), out)
        print(f'  {n:10s} {dur:.2f}s  {p.stat().st_size / 1024:6.1f} kB  {p}')
