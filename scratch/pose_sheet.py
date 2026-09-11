"""Bang kiem tu the sprite: dung lai dung phep dat frame cua setFrame() trong js/battle.js
   (keo ca file vao rect box.w x box.h, dat box.ax trung x=372, day rect trung day hop 744x682)
   roi xep thanh bang de nhin bang mat: chan co dung neo khong, nguoi co cao bang nhau khong,
   tu the co nhin ve phia dich (ben phai) khong.

   python scratch/pose_sheet.py                 -> doi minh  -> scratch/pose_hero.png
   python scratch/pose_sheet.py --foe           -> ke dich   -> scratch/pose_foe.png
   python scratch/pose_sheet.py --overlay yuki  -> chong idle (xanh) len cac pose khac (do)

   Bang box lay thang tu js/data.js qua scratch/pose_boxes.js (can node)."""
import json, os, subprocess, sys
from PIL import Image, ImageDraw

BW, BH = 744, 682
HERO = ['yuki', 'psalm', 'ash', 'kai']
POSES = ['idle', 'attack', 'crit', 'hurt', 'die']
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def boxes():
    subprocess.run(['node', 'scratch/pose_boxes.js'], cwd=ROOT, check=True, stdout=subprocess.DEVNULL)
    return json.load(open(os.path.join(ROOT, 'scratch/_boxes.json'), encoding='utf-8'))


def cell(v, tint=None):
    """Mot o 744x682 da dat frame dung cho. tint = to phang mot mau de chong hai pose len nhau."""
    c = Image.new('RGBA', (BW, BH), (0, 0, 0, 0))
    path = os.path.join(ROOT, v['file'])
    if not os.path.exists(path):
        return c
    b = v['box'] or {'w': BW, 'h': BH, 'ax': BW // 2}
    im = Image.open(path).convert('RGBA').resize((b['w'], b['h']), Image.LANCZOS)
    if tint:
        solid = Image.new('RGBA', im.size, tint + (0,))
        solid.putalpha(im.split()[3])
        im = solid
    c.alpha_composite(im, (372 - b['ax'], BH - b['h']))
    return c


def grid(ids, data, out, s=.40):
    w, h = int(BW * s), int(BH * s)
    rows = [(i, [p for p in POSES if p in data.get(i, {})]) for i in ids]
    rows = [r for r in rows if r[1]]
    sheet = Image.new('RGB', (w * max(len(r[1]) for r in rows), h * len(rows)), (24, 25, 30))
    d = ImageDraw.Draw(sheet)
    for ri, (i, ps) in enumerate(rows):
        for ci, p in enumerate(ps):
            bg = Image.new('RGB', (BW, BH), (38, 40, 48) if ci % 2 else (30, 32, 38))
            c = cell(data[i][p]); bg.paste(c, (0, 0), c)
            x0, y0 = ci * w, ri * h
            sheet.paste(bg.resize((w, h), Image.LANCZOS), (x0, y0))
            d.line([(x0 + w // 2, y0), (x0 + w // 2, y0 + h)], fill=(255, 60, 60))   # neo chan x=372
            d.line([(x0, y0 + h - 1), (x0 + w, y0 + h - 1)], fill=(60, 220, 120))    # san
            d.rectangle([x0, y0, x0 + w - 1, y0 + h - 1], outline=(70, 72, 80))
            d.text((x0 + 3, y0 + 2), f'{i} {p}', fill=(255, 230, 120))
            d.text((x0 + w - 52, y0 + 2), 'DICH >', fill=(120, 200, 255))
    sheet.save(os.path.join(ROOT, out))
    print(out, sheet.size)


def overlay(i, data, out, s=.46):
    ps = [p for p in POSES if p in data.get(i, {}) and p != 'idle']
    w, h = int(BW * s), int(BH * s)
    sheet = Image.new('RGB', (w * len(ps), h), (18, 19, 24))
    d = ImageDraw.Draw(sheet)
    for k, p in enumerate(ps):
        bg = Image.new('RGBA', (BW, BH), (18, 19, 24, 255))
        bg.alpha_composite(cell(data[i]['idle'], (90, 170, 255)))
        bg.alpha_composite(cell(data[i][p], (255, 110, 90)))
        sheet.paste(bg.convert('RGB').resize((w, h), Image.LANCZOS), (k * w, 0))
        d.line([(k * w + w // 2, 0), (k * w + w // 2, h)], fill=(255, 255, 255))
        d.text((k * w + 4, 3), f'{i}: idle(xanh) vs {p}(do)', fill=(255, 230, 120))
    sheet.save(os.path.join(ROOT, out))
    print(out, sheet.size)


if __name__ == '__main__':
    data = boxes()
    a = sys.argv[1:]
    if a and a[0] == '--overlay':
        overlay(a[1], data, f'scratch/pose_overlay_{a[1]}.png')
    elif a and a[0] == '--foe':
        grid([k for k in data if k not in HERO and any(v['box'] for v in data[k].values())],
             data, 'scratch/pose_foe.png', .26)
    else:
        grid(HERO, data, 'scratch/pose_hero.png')
