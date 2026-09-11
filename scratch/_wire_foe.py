import io,sys,json
def load(p): return io.open(p,encoding='utf-8').read()
def save(p,s): io.open(p,'w',encoding='utf-8',newline='\n').write(s)
class F:
    def __init__(self,p): self.p=p; self.s=load(p); self.n0=len(self.s)
    def rep(self,old,new,count=1):
        n=self.s.count(old)
        if n!=count: sys.exit(f'ABORT {self.p}: {n} match(es) for: {old[:90]!r}')
        self.s=self.s.replace(old,new)
    def done(self): save(self.p,self.s); print(self.p,'ok, delta',len(self.s)-self.n0)

boxes=json.load(open('scratch/foe_boxes.json'))
order=['scav','rigger','straydog','welder','gutterrat','chopshop','tinman','slagger','pipefitter','hollow','glassjaw','drone',
       'bulwark','kiln','drillbit','enforcer','chromehound','foreman','motherrust','archon','cantor']
assert set(order)==set(boxes), set(order)^set(boxes)
rows=[]; line=''
for i,uid in enumerate(order):
    b=boxes[uid]; item=f"{uid}:{{w:{b['w']},h:{b['h']},ax:{b['ax']}}}"
    line += (', ' if line else '  ') + item
    if len(line)>120 or i==len(order)-1: rows.append(line); line=''
table='const FOE_SPRITE = {\n' + ',\n'.join(rows) + ' };\n'

d=F('js/data.js')
# 1. Glass Jaw: bỏ sheet động, sprite tĩnh lấy từ FOE_SPRITE như mọi con khác (giữ nguyên ult của phiên kia)
d.rep("""    /* Con địch đầu tiên có sprite động. anim.idle = sprite sheet 5×4 (20 frame, mỗi ô 406×662), chạy 12fps kiểu
       'alt' (xuôi rồi ngược) vì clip gốc không khép vòng — xem docs/sprite-anim.md. idle = ảnh tĩnh dùng khi
       tắt animation trong CONFIG / giảm chuyển động / sheet lỗi. box quy về hộp 744×682 để cao bằng đồng đội. */
    sprites:{ idle:['art/sprite/glassjaw_idle_still.webp'],
              anim:{ idle:{ sheet:['art/sprite/glassjaw_idle.webp'], cols:5, rows:4, count:20, fps:12, mode:'alt' } },
              box:{ idle:{w:418,h:682,ax:201} } },
""","""    /* Sprite idle tĩnh lấy từ FOE_SPRITE bên dưới như mọi con. Sheet động (glassjaw_idle.webp, 11/09) đã bỏ theo yêu cầu:
       "idle animation xấu quá" — engine SHEET trong battle.js còn đó nhưng không con nào khai anim nữa. */
""")
# 2. Bảng sprite địch sau FOE_SKILL
anchor="ENEMY_POOL.forEach(e=>{ const st=FOE_STATS[e.id]||[90,5]; e.spd=st[0]; e.crit=st[1]; if(FOE_SKILL[e.id]) e.skill=FOE_SKILL[e.id]; });   // → e.skill như đòn thường của đội mình\n"
d.rep(anchor, anchor + """
/* ---- Sprite idle tĩnh của kẻ địch: art/sprite/<id>_idle.png — tách nền bằng scratch/key_enemy.py từ ảnh nền xanh trong art-src/ENEMY/
   (hộp cao 682 như đồng minh, chân chạm đáy, ax = giữa hai bàn chân; grunt cao 86%, elite 94%, boss 100% hộp, chó/drone thấp hơn).
   Ảnh gốc nhìn sang phải → setFrame() tự lật cho phe địch (face mặc định 'right'). Đủ 21 con chương 1 (11/09).
   Thêm con mới: thả <id>.png nền xanh vào art-src/ENEMY/, chạy `python scratch/key_enemy.py art-src/ENEMY --only <id>`, dán box in ra vào đây. ---- */
""" + table + "ENEMY_POOL.forEach(e=>{ const b=FOE_SPRITE[e.id]; if(b) e.sprites={ idle:['art/sprite/'+e.id+'_idle.png'], box:{idle:b} }; });\n")
d.done()

h=F('index.html')
h.rep("""        <button class="cfg__row" data-cfg="anim"><span><b>ANIMATION NHÂN VẬT</b><small>Sprite nhiều frame trong trận. Tắt thì dùng ảnh tĩnh, đỡ tốn pin</small></span><i class="cfg__sw"></i></button>
""","")
h.done()
print('WIRE OK')
