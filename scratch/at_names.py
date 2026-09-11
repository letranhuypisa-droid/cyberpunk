# -*- coding: utf-8 -*-
"""at_names.py — thêm tiền tố @ vào tên nhân vật trong docs/comic-prompts.md để AI tạo ảnh
tự nhận ra nhân vật tham chiếu (@Yuki, @Ash…). Chỉ đụng vào phần chữ prompt:
dòng nhận dạng nhân vật (§1) và nội dung từng panel (§2). Phần giải thích tiếng Việt giữ nguyên.
Chạy lại được nhiều lần: đã có @ thì bỏ qua.
"""
import io, os, re

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
DOC = os.path.join(ROOT, 'docs', 'comic-prompts.md')

# tên hai chữ phải xử lý trước và dính liền lại thành một token
MULTI = [(u'Mother Rust', u'@MotherRust')]
SINGLE = [u'Yuki', u'Ash', u'Kai', u'Psalm', u'Ronin', u'Muzzle',
          u'Foreman', u'Archon', u'Cantor', u'Rigger']
RE_SINGLE = re.compile(u'(?<![@\\w])(' + u'|'.join(SINGLE) + u')\\b')


def tag(text):
    for old, new in MULTI:
        text = text.replace(u'@MotherRust', u'\x00')          # giữ chỗ nếu đã tag
        text = text.replace(old, new)
        text = text.replace(u'\x00', u'@MotherRust')
    return RE_SINGLE.sub(lambda m: u'@' + m.group(1), text)


doc = io.open(DOC, encoding='utf-8').read()
out, changed = [], 0
for line in doc.split(u'\n'):
    new = line
    # §1 — dòng nhận dạng nhân vật: chỉ tag phần trong dấu ``
    if line.startswith(u'- **') and u'`' in line:
        head, _, rest = line.partition(u'`')
        body, _, tail = rest.rpartition(u'`')
        new = head + u'`' + tag(body) + u'`' + tail
    # §2 — dòng prompt panel: tag phần sau khổ ảnh
    elif re.match(u'^- `[a-z0-9_]+\\.jpg` — [0-9:]+ — ', line):
        pre, sep, body = line.partition(u' — ')
        ratio, sep2, content = body.partition(u' — ')
        new = pre + sep + ratio + sep2 + tag(content)
    if new != line:
        changed += 1
    out.append(new)

doc = u'\n'.join(out)

NOTE = u'### Nhận dạng nhân vật (dán vào prompt khi nhân vật xuất hiện; giữ nguyên để không trôi tạo hình)'
NEW_NOTE = (u'### Nhận dạng nhân vật (dán vào prompt khi nhân vật xuất hiện; giữ nguyên để không trôi tạo hình)\n\n'
            u'> **Tên nhân vật luôn viết kèm `@`** (`@Yuki`, `@Ash`, `@MotherRust`…) để công cụ tạo ảnh tự nhận ra '
            u'nhân vật tham chiếu và giữ đúng tạo hình giữa các panel. Tên hai chữ viết dính liền, không có dấu cách. '
            u'Đừng bỏ dấu `@` khi sửa prompt.')
if u'Tên nhân vật luôn viết kèm' not in doc:
    doc = doc.replace(NOTE, NEW_NOTE, 1)

io.open(DOC, 'w', encoding='utf-8').write(doc)
print('comic-prompts.md: da tag @ cho %d dong' % changed)
