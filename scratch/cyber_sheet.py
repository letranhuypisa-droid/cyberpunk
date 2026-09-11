#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Cắt 6 tấm contact sheet CYBERWARE (lưới 5x2, 10 thẻ) thành 60 ảnh rời nền trong suốt.

    python scratch/cyber_sheet.py                      # cắt cả 6 tấm trong art-src/CYBER/
    python scratch/cyber_sheet.py head arm             # chỉ cắt hai ô đó
    python scratch/cyber_sheet.py --dry                # chỉ in ra sẽ làm gì, không ghi file

Vào:  art-src/CYBER/<ô>.png   với ô = head · body · arm · legs · ac1 · ac2
Ra:   art/cyber/<ô><bậc 2 chữ số>.webp  (head01.webp … head10.webp)

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
SLOTS = ['head', 'body', 'arm', 'legs', 'ac1', 'ac2']


def find_src():
    """art-src/ bị gitignore nên KHÔNG có trong git worktree — tấm gốc chỉ nằm ở bản chính.
       Không có ở đây thì lần theo file .git (worktree ghi 'gitdir: <bản chính>/.git/worktrees/<tên>')."""
    here = os.path.join(ROOT, 'art-src', 'CYBER')
    if os.path.isdir(here) and any(f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))
                                   for f in os.listdir(here)):
        return here
    gitfile = os.path.join(ROOT, '.git')
    if os.path.isfile(gitfile):
        try:
            gitdir = open(gitfile, encoding='utf-8').read().split('gitdir:', 1)[1].strip()
            main = os.path.abspath(os.path.join(gitdir, '..', '..', '..'))   # .git/worktrees/<tên> → bản chính
            cand = os.path.join(main, 'art-src', 'CYBER')
            if os.path.isdir(cand):
                return cand
        except Exception:
            pass
    return here


SRC = find_src()
DST = os.path.join(ROOT, 'art', 'cyber')

COLS, ROWS = 5, 2
# Ruột ảnh của một thẻ, theo % ô lưới. ĐO chứ không đoán: lấy tỉ lệ pixel-đục trung bình theo dòng và
# theo cột của CẢ 60 THẺ (`scratch/_cyber_profile` trong nhật ký) — thẻ do cùng một khuôn sinh ra nên
# một lần đo là đúng cho cả bộ.
#   dòng:  0–8.6%  đầu thẻ (số + độ hiếm), đục 0.80–0.95   ·  9.4–82.8% ảnh, đục 0.10–0.63
#          83.6–97% chân thẻ (tên + mô tả), đục 0.89–0.97
#   cột:   2% và 97.7% là hai đường viền dọc của khung thẻ (đục 0.54 và 0.35)
# Ba lần đoán trước đó đều sai theo một trong hai hướng: cắt thiếu thì dính thanh chữ, cắt thừa thì
# cụt món cao (áo choàng Mythic có tà chạm tận 82%).
INNER = dict(left=.04, right=.04, top=.155, bottom=.168)
OUT   = 512          # ảnh ra: vuông OUT x OUT
PAD   = .06          # lề chừa quanh nội dung, theo % OUT
# WebP q88 chứ không PNG: cùng 512px mà 40 KB thay vì 262 KB (cả bộ 2.3 MB thay vì 15 MB), mắt không
# phân biệt được ở cỡ hiển thị 44–56px. Repo đã dùng .webp cho sprite sheet hiệu ứng nên không thêm
# định dạng mới. js/cyber.js thử .webp trước rồi mới tới .png, nên vẫn đè tay bằng PNG được.
FMT, QUALITY = 'webp', 88


CORNER = (.22, .09)      # bề rộng × chiều cao của ô góc bị xoá, theo % vùng cắt


def clear_corners(alpha):
    """Xoá 4 dấu trang trí ở góc khung thẻ (vạch ngang trên, tam giác dưới).

    Chúng dày ~30px nên lọc-theo-độ-dày không đụng tới được, và cắt sâu thêm thì cụt món cao.
    Nhưng chúng nằm CỐ ĐỊNH ở bốn góc — thẻ do cùng một khuôn sinh ra — còn vật thể thì luôn nằm
    giữa thẻ, không bao giờ chạm góc. Xoá thẳng theo vị trí là cách gọn nhất và không mất art."""
    h, w = alpha.shape
    cw, chh = max(1, int(w * CORNER[0])), max(1, int(h * CORNER[1]))
    alpha[:chh, :cw] = 0; alpha[:chh, -cw:] = 0
    alpha[-chh:, :cw] = 0; alpha[-chh:, -cw:] = 0
    return alpha


def dense(op, k=13, thr=.5):
    """Mặt nạ 'dày': pixel chỉ được tính nếu ô vuông k×k quanh nó đục ít nhất thr.
       Bảng tổng tích luỹ nên O(n), không cần scipy."""
    p = np.zeros((op.shape[0] + 1, op.shape[1] + 1), dtype=np.int32)
    p[1:, 1:] = np.cumsum(np.cumsum(op.astype(np.int32), axis=0), axis=1)
    h, w = op.shape; r = k // 2
    y0 = np.clip(np.arange(h) - r, 0, h); y1 = np.clip(np.arange(h) + r + 1, 0, h)
    x0 = np.clip(np.arange(w) - r, 0, w); x1 = np.clip(np.arange(w) + r + 1, 0, w)
    s = (p[np.ix_(y1, x1)] - p[np.ix_(y0, x1)] - p[np.ix_(y1, x0)] + p[np.ix_(y0, x0)])
    area = np.outer(y1 - y0, x1 - x0)
    return s >= thr * area


def bbox(alpha):
    """Hộp bao nội dung, BỎ VỆT MẢNH.

    Sau khi cắt đúng ruột thẻ vẫn còn 4 vệt nhỏ ở góc: mép vát của thanh đầu/chân thẻ. Chỉ 4 vệt đó
    thôi cũng kéo hộp bao ra bằng đúng cả vùng cắt, và 60/60 ảnh ra cùng một cỡ — nhìn số là biết sai.
    Lọc theo ĐỘ DÀY: vệt cao ~4px thì trong ô 13×13 chỉ đục ~30%, bị loại; còn gai nhọn của EXO WINGS
    hay quai mũ vẫn dày đủ để giữ. Chỉ dùng để QUYẾT ĐỊNH hộp bao — alpha ghi ra vẫn là bản gốc."""
    op = alpha > 24
    if not op.any(): return None
    d = dense(op)
    if not d.any(): d = op                      # vật thể mảnh toàn phần: thà giữ hết còn hơn cắt trụi
    ys, xs = np.where(d)
    return xs.min(), xs.max() + 1, ys.min(), ys.max() + 1


def sheet_bg(sheet):
    """Nền của CẢ TẤM: 'alpha' (ảnh gốc đã trong suốt sẵn — tấm TAY) · 'green' · 'bright'.
       Dò một lần cho cả tấm chứ không dò theo từng ô: mép một ô có thể rơi trúng khung thẻ màu tối
       và làm đoán sai — đã dính đúng bẫy này lúc thử."""
    if sheet.mode == 'RGBA':
        a = np.asarray(sheet.getchannel('A'))
        if (a < 250).mean() > .05:          # có phần trong suốt thật, không phải kênh alpha đặc
            return 'alpha'
    s = np.asarray(sheet.convert('RGB').resize((120, 80)), dtype=np.int16)
    r, g, b = s[..., 0], s[..., 1], s[..., 2]
    green = ((g > r + 40) & (g > b + 40)).mean()
    return 'green' if green > .25 else 'bright'


def key_alpha(rgb8, mode):
    """Trả về (alpha 0..1, rgb đã khử vệt nền).

    LƯU Ý dtype: NumPy 2 giữ nguyên uint8 khi trừ với số Python (NEP 50), nên `60 - d` trên mảng uint8
    quay vòng chứ không ra số âm — lần đầu viết hàm này đúng lỗi đó, mọi pixel thành đục và ảnh cắt ra
    là nguyên khung thẻ. Ép int16 ngay từ đầu."""
    if mode == 'alpha':                      # ảnh gốc đã có kênh alpha thật: dùng thẳng, đừng key lại
        return rgb8[..., 3] / 255.0, rgb8[..., :3]
    rgb = rgb8[..., :3].astype(np.int16)
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    if mode == 'green':
        # Nền xanh: xanh trội hẳn so với đỏ VÀ lam. Chuyển mềm để không ăn mất viền vật thể.
        d = g - np.maximum(r, b)
        a = np.clip((60 - d) / 40.0, 0, 1)
        # Khử vệt xanh còn bám ở rìa: kéo kênh xanh xuống mức trung bình của hai kênh kia
        fix = rgb8[..., :3].copy()
        m = (d > 10) & (a > 0)
        avg = ((r + b) // 2).astype(np.int16)
        fix[..., 1] = np.where(m, np.minimum(g, avg + 12), g).clip(0, 255).astype(np.uint8)
        return a, fix
    # Nền sáng (tấm TAY anh gửi trên nền trắng): sáng VÀ gần như không màu = nền
    lum = rgb.mean(axis=2)
    sat = rgb.max(axis=2) - rgb.min(axis=2)
    a = np.clip((238 - lum) / 22.0, 0, 1)
    a = np.maximum(a, np.clip((sat - 12) / 18.0, 0, 1))     # chỗ có màu thì giữ lại dù sáng
    return a, rgb8[..., :3]


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
    sheet = Image.open(src)
    mode = sheet_bg(sheet)
    sheet = sheet.convert('RGBA' if mode == 'alpha' else 'RGB')
    print(f'  {slot:5s} — {os.path.relpath(src, ROOT)}  {sheet.size[0]}x{sheet.size[1]}  nền: {mode}')
    n = 0
    for i in range(COLS * ROWS):
        step = i + 1
        cell = cut_cell(sheet, i % COLS, i // COLS)
        rgb = np.asarray(cell, dtype=np.uint8)
        a, fixed = key_alpha(rgb, mode)
        alpha = clear_corners((a * 255).astype(np.uint8))
        bb = bbox(alpha)
        if bb is None:
            print(f'    {step:02d} — ô rỗng, bỏ qua'); continue
        x0, x1, y0, y1 = bb
        cut = Image.fromarray(np.dstack([fixed, alpha]).astype(np.uint8), 'RGBA').crop((x0, y0, x1, y1))
        # Đặt vào khung vuông, giữ tỉ lệ, chừa lề
        inner = int(OUT * (1 - 2 * PAD))
        k = min(inner / cut.width, inner / cut.height)
        cut = cut.resize((max(1, int(cut.width * k)), max(1, int(cut.height * k))), Image.LANCZOS)
        out = Image.new('RGBA', (OUT, OUT), (0, 0, 0, 0))
        out.paste(cut, ((OUT - cut.width) // 2, (OUT - cut.height) // 2), cut)
        name = f'{slot}{step:02d}.{FMT}'
        print(f'    {name}  nội dung {x1-x0}x{y1-y0}')
        if not dry:
            os.makedirs(DST, exist_ok=True)
            out.save(os.path.join(DST, name), quality=QUALITY, method=6)
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
