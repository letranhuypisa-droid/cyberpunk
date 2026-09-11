# Đo cỡ người thật trên sprite: python scratch/sprite_size.py [pose]
# Đọc art/sprite/<id>_<pose>.png rồi quy ra % của hộp chuẩn 682px, HAI cách:
#   HOP  = hộp bao toàn bộ phần không trong suốt — kể cả vầng hào quang trên đầu Yuki/Psalm
#          và nòng pháo thò lên sau lưng Kai.
#   NGUOI= hộp bao sau khi bào mòn (erosion) 41px, tức là bỏ mọi thứ mảnh hơn 41px:
#          hào quang, nòng súng, đuôi áo bay. Đây mới là chiều cao NGƯỜI.
# Dùng để chốt BODY_H / ART_H trong js/data.js: hai người cùng đứng trên sân phải
# cao bằng nhau, mà muốn thế thì phải so chiều cao NGƯỜI chứ không phải chiều cao hộp —
# Kai và Ash có hộp bằng nhau (668px) nhưng người thì Kai thấp hơn, vì hộp của Kai tính cả khẩu pháo.
# Bốn chân (chó) và máy bay (drone) đo ra thấp là ĐÚNG, đừng chuẩn hoá chúng.
import sys
from PIL import Image, ImageFilter

POSE = sys.argv[1] if len(sys.argv) > 1 else 'idle'
BOX_H = 682.0
ERODE = 41          # bào mòn: bỏ chi tiết mảnh hơn ngần này px (đầu người rộng ~90px nên vẫn còn)
HERO_TARGET = .95   # HERO_BODY_H trong js/data.js — in sẵn hệ số phải nhân để mọi người cao bằng nhau

GROUPS = {
    'NHAN VAT': ['yuki', 'kai', 'psalm', 'ash', 'ronin'],
    'grunt': ['scav', 'straydog', 'gutterrat', 'welder', 'chopshop', 'tinman',
              'slagger', 'pipefitter', 'hollow', 'glassjaw', 'drone'],
    'elite': ['bulwark', 'kiln', 'drillbit', 'enforcer', 'chromehound'],
    'boss':  ['rigger', 'foreman', 'motherrust', 'archon', 'cantor'],
}
FOUR_LEG = {'straydog', 'drone', 'chromehound'}   # thấp là đúng, không phải lỗi


def measure(path):
    try:
        im = Image.open(path).convert('RGBA')
    except Exception:
        return None
    a = im.split()[-1].point(lambda v: 255 if v > 60 else 0)
    bb = a.getbbox()
    if not bb:
        return None
    er = a.filter(ImageFilter.MinFilter(ERODE)).getbbox()
    top = max(0, er[1] - ERODE // 2) if er else bb[1]     # trả lại phần bào mòn ở đỉnh đầu
    # VOI = từ mặt sàn (đáy canvas) lên tới nét vẽ cao nhất — kể cả hào quang, nòng súng, và cả khoảng
    # hụt của mấy con bay lơ lửng. Đây là chiều cao mà bố cục phải chừa chỗ, KHÁC chiều cao người.
    return dict(box_h=bb[3] - bb[1], body_h=bb[3] - top, reach=im.size[1] - bb[1],
                w=bb[2] - bb[0], size=im.size)


print('pose = %s   (hop chuan %dpx, bao mon %dpx)' % (POSE, BOX_H, ERODE))
body_js, art_js = [], []
for g, ids in GROUPS.items():
    rows = [(i, m) for i, m in ((i, measure('art/sprite/%s_%s.png' % (i, POSE))) for i in ids) if m]
    if not rows:
        continue
    solid = [m for i, m in rows if i not in FOUR_LEG]
    avg = sum(m['body_h'] for m in solid) / len(solid) if solid else 0
    print('\n%-9s nguoi dung thang: cao TB %.0fpx = %.1f%%' % (g, avg, avg / BOX_H * 100))
    for i, m in sorted(rows, key=lambda x: -x[1]['body_h']):
        tag = '  <- bon chan/bay, khong chuan hoa' if i in FOUR_LEG else ''
        k = HERO_TARGET / (m['body_h'] / BOX_H)
        # Máy không phân biệt được "người thấp" với "người đang tấn thấp". Thấp hơn nhóm 6% trở lên thì
        # PHẢI nhìn bằng mắt trước khi kéo cao: kéo một tư thế tấn rộng lên cho bằng người đứng thẳng là
        # đầu nó to hơn hẳn mọi người (đúng vụ Ronin 11/09 — xem BODY_FIX trong js/data.js).
        if i not in FOUR_LEG and avg and m['body_h'] < avg * 0.94:
            tag += '  <- THAP hon nhom: tan thap hay nguoi thap? soi mat roi hay chot BODY_FIX'
        print('   %-12s NGUOI %4d (%5.1f%%)  VOI %4d (%5.1f%%)  HOP %4d  rong %4d  file %dx%d  x%.3f%s'
              % (i, m['body_h'], m['body_h'] / BOX_H * 100, m['reach'], m['reach'] / BOX_H * 100,
                 m['box_h'], m['w'], m['size'][0], m['size'][1], k, tag))
        body_js.append('%s:%.3f' % (i, m['body_h'] / BOX_H))
        art_js.append('%s:%.3f' % (i, m['reach'] / BOX_H))

# Dán thẳng vào js/data.js
print('\n--- js/data.js ---')
print('const BODY_H = { %s };' % ', '.join(body_js))
print('const ART_H  = { %s };' % ', '.join(art_js))
