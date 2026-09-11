#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Cắt 6 tấm contact sheet CYBERWARE (lưới 5x2, 10 thẻ) thành 60 ảnh rời nền trong suốt.

    python scratch/cyber_sheet.py                      # cắt cả 6 tấm trong art-src/CYBER/
    python scratch/cyber_sheet.py head arm             # chỉ cắt hai ô đó
    python scratch/cyber_sheet.py --dry                # chỉ in ra sẽ làm gì, không ghi file

Vào:  art-src/CYBER/<ô>.png   với ô = head · body · arm · legs · ac1 · ac2
Ra:   art/cyber/<ô><bậc 2 chữ số>.png   (head01.png … head10.png)

Cách làm, và vì sao:
  1. Chia đều lưới 5 cột × 2 hàng. Mỗi thẻ có phần đầu (số + độ hiếm) và phần chân (tên + mô tả) do
     bộ sinh ảnh vẽ sẵn — game tự vẽ khung riêng nên PHẢI cắt bỏ, chỉ giữ ruột ảnh ở giữa.
  2. Xoá nền: tấm nền xanh chuẩn thì key theo màu xanh; tấm nền trắng/xám nhạt (tấm TAY) thì key theo
     độ sáng. Tự dò chứ không bắt khai, vì anh gửi lẫn hai kiểu.
  3. Cắt sát nội dung rồi đặt vào khung vuông, chừa lề — để 60 món cùng cỡ trên màn.

Yêu cầu: Pillow + numpy (máy này đã có, cùng bộ với scratch/key_enemy.py).
"""
import os, sys
import numpy as np
from PIL import Image

# Console Windows mặc định cp1252, in tiếng Việt là nổ UnicodeEncodeError trước khi làm được việc gì
try: sys.stdout.reconfigure(encoding='utf-8', errors='replace')
except Exception: pass

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC  = os.path.join(ROOT, 'art-src', 'CYBER')
DST  = os.path.join(ROOT, 'art', 'cyber')
SLOTS = ['head', 'body', 'arm', 'legs', 'ac1', 'ac2']

COLS, ROWS = 5, 2
# Phần ruột của một thẻ, tính theo % ô lưới. PHẢI cắt bỏ khung thẻ, đầu thẻ (số + độ hiếm) và
# chân thẻ (tên + mô tả) — chúng màu tối nên không bị key nền ăn mất, để lại là dính vào ảnh cắt ra.
INNER = dict(left=.055, right=.055, top=.13, bottom=.21)
OUT   = 512          # ảnh ra: vuông OUT x OUT
PAD   = .06          # lề chừa quanh nội dung, theo % OUT


def sheet_bg(sheet):
    """Nền của CẢ TẤM là xanh hay sáng. Dò một lần cho cả tấm chứ không dò theo từng ô: mép một ô có thể
       rơi trúng khung thẻ màu tối và làm đoán sai — đã dính đúng bẫy này lúc thử."""
    s = np.asarray(sheet.resize((120, 80)), dtype=np.int16)
    r, g, b = s[..., 0], s[..., 1], s[..., 2]
    green = ((g > r + 40) & (g > b + 40)).mean()
    return 'green' if green > .25 else 'bright'


def key_alpha(rgb8, mode):
    """Trả về (alpha 0..1, rgb đã khử vệt nền).

    LƯU Ý dtype: NumPy 2 giữ nguyên uint8 khi trừ với số Python (NEP 50), nên `60 - d` trên mảng uint8
    quay vòng chứ không ra số âm — lần đầu viết hàm này đúng lỗi đó, mọi pixel thành đục và ảnh cắt ra
    là nguyên khung thẻ. Ép int16 ngay từ đầu."""
    rgb = rgb8.astype(np.int16)
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    if mode == 'green':
        # Nền xanh: xanh trội hẳn so với đỏ VÀ lam. Chuyển mềm để không ăn mất viền vật thể.
        d = g - np.maximum(r, b)
        a = np.clip((60 - d) / 40.0, 0, 1)
        # Khử vệt xanh còn bám ở rìa: kéo kênh xanh xuống mức trung bình của hai kênh kia
        fix = rgb8.copy()
        m = (d > 10) & (a > 0)
        avg = ((r + b) // 2).astype(np.int16)
        fix[..., 1] = np.where(m, np.minimum(g, avg + 12), g).clip(0, 255).astype(np.uint8)
        return a, fix
    # Nền sáng (tấm TAY anh gửi trên nền trắng): sáng VÀ gần như không màu = nền
    lum = rgb.mean(axis=2)
    sat = rgb.max(axis=2) - rgb.min(axis=2)
    a = np.clip((238 - lum) / 22.0, 0, 1)
    a = np.maximum(a, np.clip((sat - 12) / 18.0, 0, 1))     # chỗ có màu thì giữ lại dù sáng
    return a, rgb8


def cut_cell(im, c, r):
    W, H = im.size
    cw, ch = W / COLS, H / ROWS
    x0, y0 = c * cw, r * ch
    box = (int(x0 + cw * INNER['left']),  int(y0 + ch * INNER['top']),
           int(x0 + cw * (1 - INNER['right'])), int(y0 + ch * (1 - INNER['bottom'])))
    return im.crop(box)


def process(slot, dry=False):
    src = os.path.join(SRC, slot + '.png')
    if not os.path.exists(src):
        for ext in ('.jpg', '.jpeg', '.webp'):
            if os.path.exists(os.path.join(SRC, slot + ext)):
                src = os.path.join(SRC, slot + ext); break
    if not os.path.exists(src):
        print(f'  {slot:5s} — THIẾU {os.path.relpath(src, ROOT)}'); return 0
    sheet = Image.open(src).convert('RGB')
    mode = sheet_bg(sheet)
    print(f'  {slot:5s} — {os.path.relpath(src, ROOT)}  {sheet.size[0]}x{sheet.size[1]}  nền: {mode}')
    n = 0
    for i in range(COLS * ROWS):
        step = i + 1
        cell = cut_cell(sheet, i % COLS, i // COLS)
        rgb = np.asarray(cell, dtype=np.uint8)
        a, fixed = key_alpha(rgb, mode)
        alpha = (a * 255).astype(np.uint8)
        ys, xs = np.where(alpha > 24)
        if not len(xs):
            print(f'    {step:02d} — ô rỗng, bỏ qua'); continue
        x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
        cut = Image.fromarray(np.dstack([fixed, alpha]).astype(np.uint8), 'RGBA').crop((x0, y0, x1, y1))
        # Đặt vào khung vuông, giữ tỉ lệ, chừa lề
        inner = int(OUT * (1 - 2 * PAD))
        k = min(inner / cut.width, inner / cut.height)
        cut = cut.resize((max(1, int(cut.width * k)), max(1, int(cut.height * k))), Image.LANCZOS)
        out = Image.new('RGBA', (OUT, OUT), (0, 0, 0, 0))
        out.paste(cut, ((OUT - cut.width) // 2, (OUT - cut.height) // 2), cut)
        name = f'{slot}{step:02d}.png'
        print(f'    {name}  nội dung {x1-x0}x{y1-y0}')
        if not dry:
            os.makedirs(DST, exist_ok=True)
            out.save(os.path.join(DST, name), optimize=True)
        n += 1
    return n


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('-')]
    dry = '--dry' in sys.argv
    slots = args or SLOTS
    bad = [s for s in slots if s not in SLOTS]
    if bad:
        print('Ô không có:', ', '.join(bad), '— chọn trong:', ' '.join(SLOTS)); sys.exit(1)
    print(f'CYBERWARE · cắt contact sheet{" (DRY)" if dry else ""}')
    print(f'  vào : {os.path.relpath(SRC, ROOT)}/<ô>.png')
    print(f'  ra  : {os.path.relpath(DST, ROOT)}/<ô><bậc>.png\n')
    total = sum(process(s, dry) for s in slots)
    print(f'\nXong {total} ảnh.')
    if total < len(slots) * 10:
        print('Thiếu tấm nào thì game vẫn chạy — ô đó hiện icon SVG cho tới khi có file.')


if __name__ == '__main__':
    main()
