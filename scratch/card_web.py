# -*- coding: utf-8 -*-
"""
card_web.py — art thẻ PNG (art/card/*.png) -> JPEG bản web, giữ nguyên bản gốc ở art-src/CARD/.

Vì sao: art thẻ là PNG 24-bit KHÔNG có kênh trong suốt (mode RGB), ảnh vẽ nhiều dải màu mượt —
đúng loại ảnh mà PNG nén tệ nhất. Khung game rộng tối đa 560 CSS px (css .screens max-width),
nên 1152 px ngang đã là mật độ 2x; ảnh 1536 px chỉ tốn băng thông chứ không sắc nét hơn.

Công thức JPEG theo đúng quy ước đang có trong repo (art/card/<id>_portrait.jpg, art/comic/*.jpg):
q90, subsampling 4:2:0, progressive, optimize.

Chạy:
  python scratch/card_web.py --dry                      # xem trước, không ghi gì
  python scratch/card_web.py                            # sao lưu + tạo .jpg (giữ .png)
  python scratch/card_web.py --del                      # + xoá .png SAU KHI đã kiểm md5 bản sao lưu
  python scratch/card_web.py --backup D:/khac/CARD      # đổi chỗ sao lưu

--del chỉ xoá file nào đã có bản sao lưu trùng md5 (ở --backup hoặc bất kỳ đâu trong art-src/).
Thêm art thẻ mới: thả .png vào art/card/ rồi chạy lại — file đã có .jpg mới hơn sẽ bị bỏ qua.
"""
import argparse, hashlib, os, shutil, sys
from PIL import Image

CARD_DIR = 'art/card'
DEF_BACKUP = 'art-src/CARD'
CAP = 1152          # chiều ngang tối đa (2x của khung game 560 CSS px)
QUALITY = 90


def md5(path):
    m = hashlib.md5()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(1 << 20), b''):
            m.update(chunk)
    return m.hexdigest()


def index_art_src(root):
    """md5 -> đường dẫn, cho mọi file > 200 KB trong art-src (bắt cả bản sao lưu tên khác)."""
    idx = {}
    if not os.path.isdir(root):
        return idx
    for dirpath, _, files in os.walk(root):
        for name in files:
            p = os.path.join(dirpath, name)
            try:
                if os.path.getsize(p) > 200_000:
                    idx.setdefault(md5(p), p)
            except OSError:
                pass
    return idx


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--backup', default=DEF_BACKUP)
    ap.add_argument('--cap', type=int, default=CAP)
    ap.add_argument('--q', type=int, default=QUALITY)
    ap.add_argument('--only', help='chỉ xử lý một id (không đuôi file)')
    ap.add_argument('--dry', action='store_true')
    ap.add_argument('--del', dest='delete', action='store_true')
    a = ap.parse_args()

    if not os.path.isdir(CARD_DIR):
        sys.exit('khong thay ' + CARD_DIR + ' — chay tu thu muc goc cua repo')

    src_root = os.path.dirname(a.backup.rstrip('/\\')) or '.'
    seen = index_art_src(src_root)
    print('art-src da co %d file (theo md5), sao luu vao %s' % (len(seen), a.backup))

    pngs = sorted(f for f in os.listdir(CARD_DIR) if f.lower().endswith('.png'))
    if a.only:
        pngs = [f for f in pngs if os.path.splitext(f)[0] == a.only]
    if not a.dry:
        os.makedirs(a.backup, exist_ok=True)

    before = after = 0
    kept = []
    for name in pngs:
        stem = os.path.splitext(name)[0]
        png = os.path.join(CARD_DIR, name)
        jpg = os.path.join(CARD_DIR, stem + '.jpg')
        n_before = os.path.getsize(png)
        before += n_before

        # 1. sao lưu bản gốc (bỏ qua nếu art-src đã có file trùng md5)
        h = md5(png)
        have = seen.get(h)
        dest = os.path.join(a.backup, name)
        if have:
            note = 'da co o ' + os.path.relpath(have, src_root).encode('ascii', 'replace').decode()
        else:
            note = 'sao luu'
            if not a.dry:
                shutil.copy2(png, dest)
                if md5(dest) != h:
                    sys.exit('SAO LUU HONG: ' + dest)
                seen[h] = dest
            have = dest

        # 2. chuyển sang jpg
        im = Image.open(png)
        w, h_px = im.size
        im = im.convert('RGB')
        if w > a.cap:
            im = im.resize((a.cap, round(h_px * a.cap / w)), Image.LANCZOS)
        if not a.dry:
            im.save(jpg, 'JPEG', quality=a.q, subsampling=2, optimize=True, progressive=True)
            n_after = os.path.getsize(jpg)
        else:
            import io
            b = io.BytesIO()
            im.save(b, 'JPEG', quality=a.q, subsampling=2, optimize=True, progressive=True)
            n_after = len(b.getvalue())
        after += n_after

        # 3. xoá bản .png (chỉ khi bản sao lưu tồn tại và trùng md5)
        gone = ''
        if a.delete:
            safe = a.dry or (os.path.isfile(have) and md5(have) == h)
            if safe:
                if not a.dry:
                    os.remove(png)
                gone = ' · xoa .png'
            else:
                kept.append(name)
                gone = ' · GIU .png (sao luu chua khop)'

        print('%-18s %4dx%-4d -> %4dx%-4d  %6.2f MB -> %6.0f KB  (%s)%s'
              % (name, w, h_px, im.size[0], im.size[1], n_before / 1048576, n_after / 1024, note, gone))

    print('\n%d file · truoc %.1f MB · sau %.1f MB · giam %.0f%%'
          % (len(pngs), before / 1048576, after / 1048576, 100 - after * 100.0 / max(before, 1)))
    if kept:
        print('CHUA XOA:', ', '.join(kept))


if __name__ == '__main__':
    main()
