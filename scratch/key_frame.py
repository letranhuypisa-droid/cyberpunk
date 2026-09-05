# Dùng chung: python key_frame.py <ảnh nguồn> <tên ra> <scale>  → PNG trong suốt, sàn y=678, neo = điểm giữa hai bàn chân
import sys, json
from PIL import Image; import numpy as np
src, out, S = sys.argv[1], sys.argv[2], float(sys.argv[3])
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
left=(com-xs.min())*S+PAD; right=(xs.max()-com)*S+PAD
W=max(744,int(np.ceil(left+right))); ax=int(round(left)) if W>744 else 372
h,w=rgba.shape[:2]; sm=Image.fromarray(rgba).resize((round(w*S),round(h*S)),Image.LANCZOS)
canvas=Image.new("RGBA",(W,H),(0,0,0,0)); canvas.paste(sm,(round(ax-com*S),round((H-PAD_B)-bottom*S)))
canvas.save(out,optimize=True)
print(json.dumps({"out":out,"bg":[int(x) for x in bg],"feet":[[int(a),int(b)] for a,b in cl],"box":{"w":W,"h":H,"ax":ax}}))
