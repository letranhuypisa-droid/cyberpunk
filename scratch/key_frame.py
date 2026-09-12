# Dùng chung: python key_frame.py <ảnh nguồn> <tên ra> <scale>  → PNG trong suốt, sàn y=678, neo = điểm giữa hai bàn chân.
# (Frame idle/attack/hurt gốc của 4 nhân vật chính. Pose thêm normal/crit/die dùng scratch/key_enemy.py cho cả đội mình lẫn địch; dash đã bỏ 11/09.)
#
# <scale> có hai cách viết:
#   số      — hệ số phóng thô như cũ, ví dụ 0.72
#   auto    — tự tính hệ số để CHIỀU CAO NGƯỜI của ảnh ra đúng cỡ chuẩn (auto:0.95 để đặt cỡ khác).
#             Chỉ dùng cho tư thế ĐỨNG YÊN: chiều cao người đo bằng cách bào mòn 41px (bỏ hào quang, nòng
#             súng, đuôi áo), mà tấn thấp thì đo ra hụt — auto sẽ phóng to quá tay (xem BODY_FIX trong
#             js/data.js, vụ Ronin 11/09). Pose động thì cắt theo hệ số của pose idle cùng nhân vật.
# Cuối cùng script in ra BODY_H / ART_H của ảnh vừa cắt để dán thẳng vào js/data.js.
import sys, json
from PIL import Image, ImageFilter; import numpy as np
src, out = sys.argv[1], sys.argv[2]
arg = sys.argv[3]
AUTO = arg.startswith('auto')
TARGET = float(arg.split(':')[1]) if AUTO and ':' in arg else .95
S = 1.0 if AUTO else float(arg)
ERODE = 41
T0,T1=28,120
im=np.array(Image.open(src).convert("RGB")).astype(np.float32)
border=np.concatenate([im[:6].reshape(-1,3),im[-6:].reshape(-1,3),im[:,:6].reshape(-1,3),im[:,-6:].reshape(-1,3)])
bg=np.median(border,axis=0); dom=int(bg.argmax())
d=np.sqrt(((im-bg)**2).sum(axis=2)); a=np.clip((d-T0)/(T1-T0),0,1)
a3=a[...,None]; F=(im-(1-a3)*bg)/np.maximum(a3,0.02); F=np.where(a3>0.02,F,im); F=np.clip(F,0,255)
others=[c for c in range(3) if c!=dom]
if dom==1:   # nền xanh lá: nhân vật không có xanh → khử toàn cục
    F[...,dom]=np.minimum(F[...,dom],(F[...,others[0]]+F[...,others[1]])/2+6)
else:        # nền magenta: chỉ khử ở pixel bán trong suốt (giữ tím của nhân vật)
    R,G,B=F[...,0],F[...,1],F[...,2]; mn=np.minimum(R,B); spill=np.clip(mn-G-40,0,None)*(a<0.999)
    F[...,0]=R-spill*np.clip((R-G)/np.maximum(mn-G,1),0,1)*0.6; F[...,2]=B-spill*np.clip((B-G)/np.maximum(mn-G,1),0,1)*0.6
rgba=np.dstack([np.clip(F,0,255),a*255]).astype(np.uint8)
al=rgba[...,3]>200; ys,xs=np.where(al); bottom=ys.max()
rows=al[bottom-70:bottom+1]; cols=np.where(rows.any(axis=0))[0]
cl=[]; st=pv=cols[0]
for c in cols[1:]:
    if c-pv>25: cl.append((st,pv)); st=c
    pv=c
cl.append((st,pv)); cl=[c for c in cl if c[1]-c[0]>=20] or cl   # bỏ cụm lẻ (mép áo, tia lửa)
centers=[(x0+x1)/2 for x0,x1 in cl]; com=(min(centers)+max(centers))/2
H=682; PAD_B=4; PAD=8
# auto: đo chiều cao NGƯỜI trên ảnh nguồn (bào mòn ERODE để bỏ tóc mảnh / nòng súng / đuôi áo) rồi
# chọn S sao cho người cao đúng TARGET × 682 trên hộp chuẩn.
if AUTO:
    m=Image.fromarray((rgba[...,3]>150).astype(np.uint8)*255).filter(ImageFilter.MinFilter(ERODE))
    er=np.array(m)>0; ry=np.nonzero(er.any(axis=1))[0]
    head=max(0,int(ry[0])-ERODE//2) if len(ry) else int(ys.min())
    S=(TARGET*H)/(bottom-head+1)
left=(com-xs.min())*S+PAD; right=(xs.max()-com)*S+PAD
W=max(744,int(np.ceil(left+right))); ax=int(round(left)) if W>744 else 372
h,w=rgba.shape[:2]; sm=Image.fromarray(rgba).resize((round(w*S),round(h*S)),Image.LANCZOS)
canvas=Image.new("RGBA",(W,H),(0,0,0,0)); canvas.paste(sm,(round(ax-com*S),round((H-PAD_B)-bottom*S)))
canvas.save(out,optimize=True)
# Đo lại trên ảnh ĐÃ CẮT: body_h = BODY_H, art_h = ART_H (js/data.js). Kèm bề ngang đầu để so cỡ người
# với nhân vật khác — đây mới là thước so được khi hai bên khác tư thế.
al2=np.array(canvas.getchannel("A"))
mask=al2>60; oy,ox=np.where(mask)
er2=np.array(Image.fromarray((al2>150).astype(np.uint8)*255).filter(ImageFilter.MinFilter(ERODE)))>0
ry2=np.nonzero(er2.any(axis=1))[0]
head2=max(0,int(ry2[0])-ERODE//2) if len(ry2) else int(oy.min())
band=mask[head2:head2+int((oy.max()-head2)*.12)]
runs=[]
for r in band:
    c=b=0
    for v in r:
        c=c+1 if v else 0; b=max(b,c)
    runs.append(b)
print(json.dumps({"out":out,"S":round(S,4),"bg":[int(x) for x in bg],"feet":[[int(a),int(b)] for a,b in cl],
                 "box":{"w":W,"h":H,"ax":ax},
                 "BODY_H":round((oy.max()-head2+1)/H,3), "ART_H":round((H-oy.min())/H,3),
                 "head_w":int(max(runs) if runs else 0)}))
