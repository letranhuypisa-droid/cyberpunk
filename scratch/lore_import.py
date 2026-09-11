# -*- coding: utf-8 -*-
"""lore_import.py — nhập ảnh minh hoạ cho Thư viện: art/lore/<id CODEX>.jpg

Ô ảnh trong game có hai khổ: thẻ trong lưới là **4:3**, còn khi mở mục ra thì ô hero cao 42% màn
(~1,10 ở 375×812). Cả hai đều object-fit:cover nên file nên là 4:3 — mở ra chỉ bị xén nhẹ hai bên.

Ảnh nguồn hay là khổ dọc 9:16, cắt về 4:3 là bỏ đi ~58% chiều cao → phải chọn DẢI, không cắt giữa mù.
`band` = tâm dải theo tỉ lệ chiều cao (0 = sát mép trên, 1 = sát mép dưới).

Dấu Gemini ở góc phải dưới được dò và tránh; không tô đè.

Chạy:  python scratch/lore_import.py
"""
import os, sys
import numpy as np
from PIL import Image

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
OUT  = os.path.join(ROOT, 'art', 'lore')
RATIO = 4 / 3
MAXW = 1400

# (đường dẫn nguồn, id trong CODEX, tâm dải cắt)
JOBS = [
    ('comic char/ch1 alt/1_4k.jpg', 'halcyon',  .34),   # tháp xé trời + nóc lều khu ổ chuột dưới chân
    ('comic char/ch1 alt/2_4k.jpg', 'dropyard', .34),   # bãi phế liệu dưới họng xả, có biển WASTE CHUTE No 9
    ('comic char/ch1 alt/6_4k.jpg', 'bottom',   .36),   # dân Đáy sống dựa vào sắt vụn
]


def find_watermark(im):
    """Dò ngôi sao 4 cánh sáng ở góc phải dưới. Trả về bbox hoặc None."""
    a = np.asarray(im.convert('L'), dtype=np.int16)
    H, W = a.shape
    y0, y1 = int(H * .86), int(H * .98)
    x0, x1 = int(W * .84), int(W * .99)
    r = a[y0:y1, x0:x1]
    thr = max(120, int(np.median(r)) + 45)
    ys, xs = np.where(r > thr)
    if len(xs) < 40:
        return None
    return (x0 + xs.min(), y0 + ys.min(), x0 + xs.max(), y0 + ys.max())


def main():
    os.makedirs(OUT, exist_ok=True)
    for src, cid, band in JOBS:
        p = os.path.join(ROOT, src)
        if not os.path.exists(p):
            print('  ! thieu', src); continue
        im = Image.open(p).convert('RGB')
        W, H = im.size
        wm = find_watermark(im)

        if W / H > RATIO:                       # nguồn rộng hơn 4:3 → cắt ngang
            w, h = int(round(H * RATIO)), H
            x0, y0 = (W - w) // 2, 0
        else:                                   # nguồn dọc → cắt lấy một dải ngang
            w, h = W, int(round(W / RATIO))
            x0 = 0
            y0 = int(round(band * H - h / 2))
            y0 = max(0, min(H - h, y0))

        note = ''
        if wm:
            wx0, wy0, wx1, wy1 = wm
            if x0 < wx1 and x0 + w > wx0 and y0 < wy1 and y0 + h > wy0:
                up = wy0 - h                     # đẩy dải lên cho hết dấu
                if up >= 0:
                    y0, note = up, ' · day dai len tranh dau'
                else:
                    h = max(1, wy0 - y0); w = int(round(h * RATIO)); x0 = (W - w) // 2
                    note = ' · cat bot day tranh dau'

        out = im.crop((x0, y0, x0 + w, y0 + h))
        if out.width > MAXW:
            s = MAXW / out.width
            out = out.resize((MAXW, round(out.height * s)), Image.LANCZOS)
        f = os.path.join(OUT, cid + '.jpg')
        out.save(f, 'JPEG', quality=92, optimize=True, progressive=True)
        print('%-30s -> art/lore/%-13s %s  ti le %.3f  dai y %d-%d/%d  %d KB%s'
              % (os.path.basename(src), cid + '.jpg', '%dx%d' % out.size,
                 out.size[0] / out.size[1], y0, y0 + h, H,
                 round(os.path.getsize(f) / 1024), note))


if __name__ == '__main__':
    main()
