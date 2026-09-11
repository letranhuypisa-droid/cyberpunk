# Đo cỡ người thật trên sprite: python scratch/sprite_size.py [pose]
# Lấy hộp bao phần KHÔNG trong suốt của art/sprite/<id>_<pose>.png rồi quy ra % của hộp chuẩn 682px.
# Dùng để chốt RECRUIT_BODY_H trong js/data.js — kẻ địch chiêu mộ về làm đồng đội phải cao bằng nhân vật,
# không thì một con Scav đứng cạnh Yuki trông như trẻ con.
# Bốn chân (chó) và máy bay (drone) đo ra thấp là ĐÚNG, đừng chuẩn hoá chúng.
import sys
from PIL import Image

POSE = sys.argv[1] if len(sys.argv) > 1 else 'idle'
BOX_H = 682.0

GROUPS = {
    'NHAN VAT': ['yuki', 'kai', 'psalm', 'ash', 'ronin'],
    'grunt': ['scav', 'straydog', 'gutterrat', 'welder', 'chopshop', 'tinman',
              'slagger', 'pipefitter', 'hollow', 'glassjaw', 'drone'],
    'elite': ['bulwark', 'kiln', 'drillbit', 'enforcer', 'chromehound'],
    'boss':  ['rigger', 'foreman', 'motherrust', 'archon'],
}
FOUR_LEG = {'straydog', 'drone', 'chromehound'}   # thấp là đúng, không phải lỗi


def measure(path):
    try:
        im = Image.open(path).convert('RGBA')
    except Exception:
        return None
    a = im.split()[-1].getbbox()
    return None if not a else (a[3] - a[1], a[2] - a[0], im.size)


print('pose = %s   (hop chuan %dpx)' % (POSE, BOX_H))
for g, ids in GROUPS.items():
    rows = []
    for i in ids:
        r = measure('art/sprite/%s_%s.png' % (i, POSE))
        if r:
            rows.append((i, r[0], r[1], r[2]))
    if not rows:
        continue
    solid = [r for r in rows if r[0] not in FOUR_LEG]
    avg = sum(r[1] for r in solid) / len(solid) if solid else 0
    print('\n%-9s nguoi dung thang: cao TB %.0fpx = %.1f%%' % (g, avg, avg / BOX_H * 100))
    for i, h, w, size in sorted(rows, key=lambda x: -x[1]):
        tag = '  <- bon chan/bay, khong chuan hoa' if i in FOUR_LEG else ''
        print('   %-12s cao %4d (%5.1f%%)  rong %4d  file %dx%d%s'
              % (i, h, h / BOX_H * 100, w, size[0], size[1], tag))
