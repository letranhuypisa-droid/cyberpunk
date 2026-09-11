# Dựng sprite sheet hiệu ứng (art/fx/<kind>.webp) từ video/gif nền xanh, hoặc từ thư mục PNG đã trong suốt.
#   python scratch/fx_sheet.py <in.mp4|in.gif|thư mục> art/fx/<kind>.webp [--fps 24] [--size 256] [--cols 6] [--max 48] [--trim 0.5]
# Quy ước để js/fx.js đọc không cần khai báo: ô vuông, 6 cột, số hàng suy từ chiều cao ảnh, chạy 24 fps (bản _loop 16 fps).
# In JSON {frames, cols, rows, frame, fps, kb}. Quy cách nguồn và prompt: docs/fx-prompts.md.
import sys, os, json, glob, subprocess, tempfile, shutil
from PIL import Image; import numpy as np

args=[a for a in sys.argv[1:] if not a.startswith('--')]
opt={k:v for k,v in zip(sys.argv[1:], sys.argv[2:]) if k.startswith('--')}
if len(args)<2: sys.exit(__doc__ or 'python scratch/fx_sheet.py <in> <out.webp> [--fps 24] [--size 256] [--cols 6] [--max 48] [--trim 0.5]')
src, out = args[0], args[1]
FPS=int(opt.get('--fps',24)); SIZE=int(opt.get('--size',256)); COLS=int(opt.get('--cols',6)); MAX=int(opt.get('--max',48))
TRIM=float(opt.get('--trim',0.5))    # bỏ frame đầu/cuối gần như trống (alpha trung bình < TRIM% của frame đậm nhất)
T0,T1=28,120                          # ngưỡng khoảng cách màu nền → alpha (như key_frame.py)

tmp=None
if os.path.isdir(src): files=sorted(glob.glob(os.path.join(src,'*.png')))
else:
    tmp=tempfile.mkdtemp(prefix='fx_'); pat=os.path.join(tmp,'f_%04d.png')
    subprocess.run(['ffmpeg','-v','error','-y','-i',src,'-vf',f'fps={FPS}',pat],check=True)
    files=sorted(glob.glob(os.path.join(tmp,'f_*.png')))
if not files: sys.exit('không có frame nào')

def key(im):
    """Ảnh RGB nền phẳng → RGBA. Ảnh đã có alpha thật thì giữ nguyên."""
    if im.mode=='RGBA' and np.array(im)[...,3].min()<250: return np.array(im).astype(np.float32)
    a3=np.array(im.convert('RGB')).astype(np.float32)
    border=np.concatenate([a3[:4].reshape(-1,3),a3[-4:].reshape(-1,3),a3[:,:4].reshape(-1,3),a3[:,-4:].reshape(-1,3)])
    bg=np.median(border,axis=0); dom=int(bg.argmax())
    d=np.sqrt(((a3-bg)**2).sum(axis=2)); a=np.clip((d-T0)/(T1-T0),0,1)
    al=a[...,None]; F=(a3-(1-al)*bg)/np.maximum(al,0.02); F=np.where(al>0.02,F,a3); F=np.clip(F,0,255)
    if dom==1:   # nền xanh lá: khử xanh còn sót ở mép
        o=[c for c in range(3) if c!=1]; F[...,1]=np.minimum(F[...,1],(F[...,o[0]]+F[...,o[1]])/2+6)
    return np.dstack([F,a*255])

frames=[key(Image.open(f)) for f in files]
if tmp: shutil.rmtree(tmp,ignore_errors=True)
# cắt frame gần trống ở hai đầu, rồi lấy tối đa MAX frame (lấy đều)
w=np.array([fr[...,3].mean() for fr in frames]); keep=np.where(w>=w.max()*TRIM/100)[0] if TRIM>0 else np.arange(len(frames))
frames=frames[keep.min():keep.max()+1]
if len(frames)>MAX: frames=[frames[int(i)] for i in np.linspace(0,len(frames)-1,MAX)]
# hộp chung của mọi frame → cắt vuông quanh tâm, ép về SIZE
al=np.max(np.stack([fr[...,3] for fr in frames]),axis=0)>12
ys,xs=np.where(al)
if not len(ys): sys.exit('frame trống hoàn toàn (nền không khử được?)')
cx,cy=(xs.min()+xs.max())/2,(ys.min()+ys.max())/2; side=int(max(xs.max()-xs.min(),ys.max()-ys.min())*1.06)+2
x0,y0=int(round(cx-side/2)),int(round(cy-side/2))
H,W=frames[0].shape[:2]
def cut(fr):
    canvas=np.zeros((side,side,4),np.float32)
    sx0,sy0=max(0,x0),max(0,y0); sx1,sy1=min(W,x0+side),min(H,y0+side)
    canvas[sy0-y0:sy1-y0, sx0-x0:sx1-x0]=fr[sy0:sy1,sx0:sx1]
    return Image.fromarray(canvas.astype(np.uint8)).resize((SIZE,SIZE),Image.LANCZOS)
tiles=[cut(fr) for fr in frames]
rows=(len(tiles)+COLS-1)//COLS
sheet=Image.new('RGBA',(COLS*SIZE,rows*SIZE),(0,0,0,0))
for i,t in enumerate(tiles): sheet.paste(t,((i%COLS)*SIZE,(i//COLS)*SIZE))
os.makedirs(os.path.dirname(out) or '.',exist_ok=True)
sheet.save(out,'WEBP',quality=int(opt.get('--q',85)),method=6)
print(json.dumps({'out':out,'frames':len(tiles),'cols':COLS,'rows':rows,'frame':SIZE,'fps':FPS,'kb':round(os.path.getsize(out)/1024)}))
