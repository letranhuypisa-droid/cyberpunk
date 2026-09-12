# Tách nền ảnh sprite kẻ địch → art/sprite/<id>_<pose>.png, hộp cao 682 như sprite đồng minh (chân chạm đáy, neo ax = giữa hai bàn chân).
#   python scratch/key_enemy.py [thư mục nguồn (mặc định art-src/ENEMY)] [--only scav,rigger] [--out art/sprite] [--ref ảnh_đứng_cùng_nguồn.png] [--h 0.84]
#   --h = chiều cao người trong ảnh idle, tính theo phần của hộp 682 (đè lên RANK_H cho riêng lần chạy này). Dùng khi ảnh "idle" thật ra
#         là một tư thế khuỵu/tấn: để nguyên 98% thì nhân vật cao vống lên so với đồng đội. Các pose sau vẫn khớp cỡ theo idle như thường.
# Nguồn: ảnh nền một màu phẳng (xanh lá / trắng / magenta) hoặc PNG đã trong suốt; chấp nhận cả ảnh chụp màn hình từ contact sheet
# (tự cắt viền/thanh đen ở mép, xoá nhãn số ở góc, bỏ chữ chú thích dưới chân và mảnh ô bên cạnh dính ở mép trái/phải).
# Tên file = "<id>" hoặc "<id> <pose>": idle · attack (= "normal", "normal attack") · crit ("crit attack") · hurt · die. Ví dụ "kiln crit attack.PNG".
# Ảnh idle tự thu nhỏ theo rank (docs/enemy-prompts.md §2): grunt 86%, elite 94%, boss 100% của 682; con bốn chân / bay có số riêng (HEIGHT, LIFT).
# Các pose khác lấy CÙNG cỡ thân với idle: (1) --ref: hệ số = chiều cao sprite idle / chiều cao người đứng trong ảnh tham chiếu cùng nguồn;
# (2) không có --ref: khớp diện tích thân (mặt nạ bào mỏng 1% chiều cao để bỏ vòng halo / cán vũ khí mỏng), S = sqrt(thân idle đã ra / thân pose).
# Kết quả ghi vào scratch/foe_boxes.json {id:{idle:{w,h,ax}, attack:…, scale, idleH}} → dán vào FOE_SPRITE / HERO_SPRITE (js/data.js).
# Đội mình (yuki/psalm/ash/kai): thả '<id> normal/crit/die.png' vào art-src/HERO, chạy `python scratch/key_enemy.py art-src/HERO`; idle/hurt gốc giữ nguyên.
# Ronin + Muzzle (11/09, đợt sau): đã có ảnh tư thế ĐỨNG YÊN thật nên chạy thẳng, không cần --h nữa:
#   python scratch/key_enemy.py art-src/HERO --only ronin,muzzle
# (4 pose động của Muzzle cắt từ bảng 2×2 'muzzle.png' — nhớ xoá nhãn ô, vạch khung, và khử ô kính xanh trên
#  cánh cửa về trong suốt cho khớp ảnh idle, không thì trong trận cửa sổ khiên hiện ra một mảng xanh phông.)
# Nhân vật nhìn sang phải như ảnh gốc; setFrame() trong battle.js tự lật cho phe địch.
import sys, os, json, re
from PIL import Image; import numpy as np
from scipy import ndimage

RANK={ 'scav':'grunt','rigger':'boss','straydog':'grunt','welder':'grunt','gutterrat':'grunt','chopshop':'grunt','tinman':'grunt','slagger':'grunt',   # rigger lên trùm băng Scav 11/09 — ảnh cũ cắt cỡ lính, đã cắt lại
       'pipefitter':'grunt','hollow':'grunt','glassjaw':'grunt','drone':'grunt','bulwark':'elite','kiln':'elite','drillbit':'elite','enforcer':'elite',
       'chromehound':'elite','foreman':'boss','motherrust':'boss','archon':'boss','cantor':'boss' }
HERO={'yuki','psalm','ash','kai','ronin','muzzle'}        # đội mình: yuki/psalm/ash/kai có idle/hurt gốc từ key_frame.py, chỉ thêm normal/crit/die; ronin + muzzle cắt nguyên bộ 5 pose ở đây
RANK_H={'grunt':.86,'elite':.94,'boss':1.0,'hero':.98}
HEIGHT={'straydog':.58,'chromehound':.66,'drone':.50}     # bốn chân / bay: thấp hơn người
LIFT={'drone':130}                                        # bay: nhấc khỏi sàn (px trong canvas 682)
POSES=('idle','attack','crit','hurt','die')
SCALE_ADJ={('scav','crit'):0.9, ('psalm','attack'):1.15, ('psalm','crit'):1.15, ('enforcer','attack'):1.1, ('enforcer','crit'):1.1,
           ('archon','crit'):1.22,   # tia laser dài 13 px sống sót phép bào 1% → "diện tích thân" phồng lên, khớp cỡ ra nhỏ 18%
           ('kai','die'):1.17}       # quỳ một gối: bóng người dồn cục, diện tích/chiều cao lớn hơn tư thế đứng → khớp ra nhỏ; kéo về đúng hệ số của 3 pose đứng (~1.97)
           # chỉnh tay khi khớp tự động vẫn lệch (nhân thêm vào hệ số)
POSE_ALIAS={'normal':'attack','normal attack':'attack','crit attack':'crit','death':'die','dead':'die'}
H=682; PAD_B=4; PAD=8; T0,T1=28,120
BOXES='scratch/foe_boxes.json'

def strip_borders(im):
    """Ảnh chụp từ contact sheet hay dính viền/thanh đen ở mép → cắt bỏ các hàng/cột mép gần như đen (≥ 60% pixel tối)."""
    a=np.array(im.convert('RGB')).astype(int); dark=(a.sum(axis=2)<90)
    top=0; bot=a.shape[0]; left=0; right=a.shape[1]
    while top<bot-10 and dark[top].mean()>0.6: top+=1
    while bot>top+10 and dark[bot-1].mean()>0.6: bot-=1
    while left<right-10 and dark[top:bot,left].mean()>0.6: left+=1
    while right>left+10 and dark[top:bot,right-1].mean()>0.6: right-=1
    return im.crop((left,top,right,bot)) if (top,left,bot,right)!=(0,0,a.shape[0],a.shape[1]) else im

def _run_from(mask1d, from_start):
    """Độ dài đoạn True liền nhau tính từ đầu (from_start) hoặc từ cuối mảng"""
    seq=mask1d if from_start else mask1d[::-1]; n=0
    for v in seq:
        if not v: break
        n+=1
    return n

def clear_badges(a, rgb):
    """Nhãn số ở góc (ô đen 20–85 px có chữ trắng, có thể thụt vào vài px): tìm khối tối liền trong cửa sổ 110 px ở 4 góc, xoá alpha (+3 px)."""
    lum=rgb.sum(axis=2)/3; h,w=lum.shape; win=110
    for top in (True,False):
        for leftside in (True,False):
            ys=slice(0,min(win,h)) if top else slice(max(0,h-win),h); xs=slice(0,min(win,w)) if leftside else slice(max(0,w-win),w)
            d=(lum[ys,xs]<60)&(a[ys,xs]>0.3)
            lab,n=ndimage.label(d)
            if not n: continue
            for i in range(1,n+1):
                m=lab==i; rr=np.where(m.any(axis=1))[0]; cc=np.where(m.any(axis=0))[0]
                bh,bw=rr[-1]-rr[0]+1, cc[-1]-cc[0]+1
                if not (20<=bh<=85 and 20<=bw<=85): continue
                if m.sum()<0.5*bh*bw: continue                              # phải đặc như một ô (không phải mảng tối của nhân vật)
                y0=ys.start+rr[0]; x0=xs.start+cc[0]
                a[max(0,y0-3):y0+bh+3, max(0,x0-3):x0+bw+3]=0
    return a

def clear_lines(a, rgb):
    """Vạch khung mỏng (≤ 5 px) của ô contact sheet, tối hoặc sáng: hàng/cột gần như phủ kín pixel như vậy → xoá alpha (nhân vật hiếm khi có vạch thẳng dài đến thế)."""
    lum=rgb.sum(axis=2); dark=((lum<90)|(lum>540))&(a>0.3)     # vạch tối hoặc vạch sáng (xám nhạt cũng tính); chỉ xét pixel đang là tiền cảnh
    fg=a>0.3
    for axis in (0,1):
        frac=dark.mean(axis=1) if axis==0 else dark.mean(axis=0)
        # luật hình học, không phụ thuộc màu: đoạn tiền cảnh liền nhau dài ≥ 60% kích thước ảnh trên một hàng/cột (thân người không bao giờ như vậy)
        m=fg if axis==0 else fg.T; L=m.shape[1]; N=m.shape[0]
        longrun=np.array([max((len(r) for r in ''.join('1' if v else '0' for v in row).split('0')), default=0) for row in m])>=0.6*L
        edge=np.zeros(N,bool); edge[:max(2,int(0.08*N))]=True; edge[N-max(2,int(0.08*N)):]=True   # chỉ áp luật hình học sát mép ảnh (vạch khung ô)
        runs=clusters((frac>0.9)|(longrun&edge), 1)   # gap=1: hàng/cột liền nhau gộp thành MỘT đoạn, nhờ vậy luật "≤ 5 px" mới chặn được
        #   mảng dày (gap=0 tách từng hàng một, đoạn nào cũng dài 1 → xoá sạch). Ngưỡng 0.9 (cũ 0.6): vạch khung ô phủ gần hết chiều
        #   dài ảnh, còn 0.6 thì một cột xuyên qua áo da đen của Kai trong ảnh dọc 941×1672 cũng dính → thân bị rạch thành nhiều mảnh.
        for s0,e0 in runs:
            if e0-s0+1<=5:
                if axis==0: a[max(0,s0-1):e0+2,:]=0
                else: a[:,max(0,s0-1):e0+2]=0
    return a

def key(im):
    """→ (rgb float, alpha 0..1). PNG có alpha thật thì giữ; không thì khử màu nền lấy theo viền ảnh (như key_frame.py)."""
    if im.mode in ('RGBA','LA'):
        a4=np.array(im.convert('RGBA')).astype(np.float32)
        if (a4[...,3]<10).mean()>0.05: return a4[...,:3], a4[...,3]/255      # cut-out thật; alpha mờ đều (ảnh chụp) thì bỏ qua, khử theo màu
    im3=np.array(im.convert('RGB')).astype(np.float32)
    border=np.concatenate([im3[:6].reshape(-1,3),im3[-6:].reshape(-1,3),im3[:,:6].reshape(-1,3),im3[:,-6:].reshape(-1,3)])
    bg=np.median(border,axis=0); dom=int(bg.argmax())
    d=np.sqrt(((im3-bg)**2).sum(axis=2))
    if bg.min()>200:                                   # nền trắng: nhân vật có thể có màu sáng → chỉ khử vùng nền LIỀN VỚI MÉP ảnh
        t0,t1=15,70; cand=d<t1; lab,n=ndimage.label(cand)
        edge=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
        bgm=np.isin(lab,list(edge)) if edge else np.zeros_like(cand)
        a=np.where(bgm, np.clip((d-t0)/(t1-t0),0,1), 1.0); a[d<12]=0   # đúng màu nền (kể cả lỗ kín như trong mũ trùm) → trong suốt
    else:
        a=np.clip((d-T0)/(T1-T0),0,1)
    a3=a[...,None]; F=(im3-(1-a3)*bg)/np.maximum(a3,0.02); F=np.where(a3>0.02,F,im3); F=np.clip(F,0,255)
    if dom==1 and bg[1]-max(bg[0],bg[2])>60:   # nền xanh lá: nhân vật không có xanh → khử xanh còn sót toàn cục
        F[...,1]=np.minimum(F[...,1],(F[...,0]+F[...,2])/2+6)
    elif bg.min()<80 and bg.max()>150:         # nền magenta: chỉ khử ở pixel bán trong suốt
        R,G,B=F[...,0],F[...,1],F[...,2]; mn=np.minimum(R,B); spill=np.clip(mn-G-40,0,None)*(a<0.999)
        F[...,0]=R-spill*np.clip((R-G)/np.maximum(mn-G,1),0,1)*0.6; F[...,2]=B-spill*np.clip((B-G)/np.maximum(mn-G,1),0,1)*0.6
    a[a<0.15]=0
    return F, a

def clusters(mask1d, gap):
    """Các đoạn liên tiếp (cho phép hở ≤ gap) trong mảng bool 1 chiều → [(start,end)]"""
    idx=np.where(mask1d)[0]
    if not len(idx): return []
    out=[]; st=pv=idx[0]
    for i in idx[1:]:
        if i-pv>gap: out.append((st,pv)); st=i
        pv=i
    out.append((st,pv)); return out

def drop_stray(a):
    """Bỏ mảng rời: chỉ giữ thành phần liên thông lớn nhất và các mảnh có hộp giao với hộp của nó (nới 4%) — ngọn lửa, tia lửa, vũ khí
    tách rời vẫn giữ; chữ chú thích dưới chân, watermark ✦ ở góc, mảnh ô bên cạnh dính ở mép thì bỏ."""
    lab,n=ndimage.label(a>0.3)
    if n<=1: return a
    areas=ndimage.sum(np.ones_like(a),lab,range(1,n+1)); ib=int(np.argmax(areas))+1
    objs=ndimage.find_objects(lab)
    my,mx=objs[ib-1]; mh,mw=my.stop-my.start, mx.stop-mx.start; py,px=int(mh*0.04)+4, int(mw*0.04)+4
    Y0,Y1,X0,X1=my.start-py,my.stop+py,mx.start-px,mx.stop+px
    keep=np.zeros_like(a,dtype=bool); keep|=(lab==ib); Wd=a.shape[1]
    dist=ndimage.distance_transform_edt(lab!=ib); near=max(4,int(mh*0.02))   # khoảng cách tới THÂN, không chỉ tới hộp thân
    for i,sl in enumerate(objs, start=1):
        if i==ib: continue
        sy,sx=sl
        if (sx.start<=6 or sx.stop>=Wd-6) and areas[i-1]<areas[ib-1]*0.35: continue   # mảnh ô kế bên dính ở mép trái/phải
        if sy.start>=my.stop-2: continue                                             # nằm hẳn dưới chân: chữ chú thích
        cy,cx=(sy.start+sy.stop)/2,(sx.start+sx.stop)/2
        if areas[i-1]<areas[ib-1]*0.015 and not (my.start<=cy<my.stop and mx.start<=cx<mx.stop): continue   # mảnh li ti ngoài hộp thân
        if areas[i-1]<areas[ib-1]*0.015 and sy.stop<my.start+0.12*mh and dist[lab==i].min()>near: continue   # mảnh li ti ngang đầu, lơ lửng cách xa thân: chữ nhãn "(Swing)" của ô contact sheet
        if sy.start<Y1 and sy.stop>Y0 and sx.start<X1 and sx.stop>X0: keep|=(lab==i)
    a[~keep]=0
    return a

def feet(al):
    ys,xs=np.where(al); bottom=ys.max()
    rows=al[max(0,bottom-70):bottom+1]; cols=np.where(rows.any(axis=0))[0]
    cl=clusters(np.isin(np.arange(al.shape[1]),cols), 25)
    cl=[c for c in cl if c[1]-c[0]>=20] or cl
    centers=[(x0+x1)/2 for x0,x1 in cl]
    return (min(centers)+max(centers))/2, bottom, cl

def prep(im):
    """Ảnh nguồn → (rgb, alpha) đã dọn. PNG đã trong suốt thật (≥ 5% pixel alpha 0): lấy alpha sẵn (RGB chỗ trong suốt thường đen, không được
    đem đi cắt viền / khử màu). Còn lại: cắt viền đen, khử nền theo màu, xoá vạch khung, xoá nhãn góc, bỏ mảnh rời."""
    if im.mode in ('RGBA','LA'):
        a4=np.array(im.convert('RGBA')).astype(np.float32)
        if (a4[...,3]<10).mean()>0.05:
            F=a4[...,:3]; a=a4[...,3]/255; a[a<0.15]=0; a=clear_badges(a,F); a=drop_stray(a); return F,a
    im=strip_borders(im); F,a=key(im); a=clear_lines(a,F); a=clear_badges(a,F); a=drop_stray(a); return F,a

def median_lum(rgb, a):
    m=a>0.9; return float(np.median((rgb[...,0]*0.3+rgb[...,1]*0.59+rgb[...,2]*0.11)[m])) if m.any() else None

def match_brightness(F, a, ref_png):
    """Ảnh chụp từ ô bị làm tối/sáng: nhân RGB để độ sáng trung vị của thân khớp với sprite idle đã ra (kẹp 0.7–1.6)."""
    im=np.array(Image.open(ref_png).convert('RGBA')).astype(np.float32); ref=median_lum(im[...,:3], im[...,3]/255); cur=median_lum(F,a)
    if not ref or not cur: return F
    g=float(np.clip(ref/cur, 0.6, 1.6)); print(f'   can sang: idle {ref:.0f} pose {cur:.0f} -> gain {g:.2f}')
    return np.clip(F*g,0,255) if abs(g-1)>0.05 else F

def char_height(im):
    _,a=prep(im); al=a>0.5; ys,_=np.where(al); return int(ys.max()-ys.min()+1)

def process(im, uid, pose, out_dir, scale=None, ref_png=None):
    """Tách nền một ảnh → file PNG + box. scale=None → tự tính theo rank (chỉ nên cho idle). ref_png → cân sáng theo sprite idle."""
    F,a=prep(im)
    if ref_png: F=match_brightness(F,a,ref_png)
    al=a>0.5; ys,xs=np.where(al)
    if not len(ys): raise ValueError(uid+' trống')
    com,bottom,cl=feet(al)
    bh=bottom-ys.min()+1
    S = scale if scale else H*HEIGHT.get(uid,RANK_H[RANK.get(uid,'hero')])/bh
    left=(com-xs.min())*S+PAD; right=(xs.max()-com)*S+PAD
    if max(left,right)<=372: W=744; ax=372
    else: W=int(np.ceil(2*max(left,right))); ax=W//2                   # thân/vũ khí lệch một bên: nới hộp đối xứng quanh chân
    rgba=np.dstack([np.clip(F,0,255),a*255]).astype(np.uint8)
    y0,y1,x0,x1=ys.min(),bottom,xs.min(),xs.max(); crop=Image.fromarray(rgba[y0:y1+1,x0:x1+1])
    sm=crop.resize((max(1,round(crop.width*S)),max(1,round(crop.height*S))),Image.LANCZOS)
    lift=0 if pose=='die' else LIFT.get(uid,0)                          # gục thì nằm trên sàn, kể cả con bay
    Hc=H if pose=='idle' else max(H, sm.height+PAD_B+lift+2)            # idle giữ đúng 682; pose giơ vũ khí cao hơn → hộp cao thêm (engine tính % theo 682)
    canvas=Image.new('RGBA',(W,Hc),(0,0,0,0))
    canvas.paste(sm,(round(ax-(com-x0)*S),(Hc-PAD_B-lift)-sm.height))
    os.makedirs(out_dir,exist_ok=True); out=os.path.join(out_dir,f'{uid}_{pose}.png'); canvas.save(out,optimize=True)
    box={'w':W,'h':Hc,'ax':ax}
    info={'id':uid,'pose':pose,'rank':RANK.get(uid,'hero'),'src':f'{im.width}x{im.height}','charH':int(bh),'scale':round(S,3),'spriteH':sm.height,'spriteW':sm.width,
          'feet':[[int(p),int(q)] for p,q in cl],'lift':lift,'box':box,'kb':os.path.getsize(out)//1024}
    return box,S,info

def core_area(a):
    """Diện tích PHẦN THÂN: bào mỏng mặt nạ bằng 2.5% chiều cao người để bỏ tay, chân duỗi, vũ khí — để khớp cỡ pose không bị lệch bởi tư thế"""
    al=a>0.5; ys,_=np.where(al)
    if not len(ys): return 1.0
    r=max(2,int(round(0.01*(ys.max()-ys.min()+1))))                    # 1% chiều cao: bỏ vòng halo, cán vũ khí mỏng; giữ tay chân
    return float(ndimage.binary_erosion(al, structure=np.ones((2*r+1,2*r+1)), iterations=1).sum()) or 1.0
def sprite_core(path):
    return core_area(np.array(Image.open(path).convert('RGBA'))[...,3].astype(np.float32)/255)

def load_boxes():
    try: return json.load(open(BOXES))
    except Exception: return {}
def save_boxes(b): json.dump(b, open(BOXES,'w'), indent=1)

def parse_name(f):
    """'kiln crit attack.PNG' → ('kiln','crit'); 'scav normal.PNG' → ('scav','attack'); 'scav.png' → ('scav','idle'); tên lạ → (None,None)"""
    base=os.path.splitext(f)[0].strip().lower()
    m=re.match(r'^([a-z0-9]+)(?:[\s_-]+(.+))?$', base)
    if not m: return (None,None)
    pose=(m.group(2) or 'idle').strip(); pose=POSE_ALIAS.get(pose,pose)
    return (m.group(1), pose) if pose in POSES else (None,None)

if __name__=='__main__':
    args=[a for a in sys.argv[1:] if not a.startswith('--')]
    opt={k:v for k,v in zip(sys.argv[1:], sys.argv[2:]) if k.startswith('--')}
    SRC=args[0] if args else 'art-src/ENEMY'; OUT=opt.get('--out','art/sprite'); ONLY=set(opt.get('--only','').split(',')) - {''}
    boxes=load_boxes()
    files=[f for f in sorted(os.listdir(SRC)) if f.lower().endswith(('.png','.jpg','.jpeg','.webp')) and os.path.isfile(os.path.join(SRC,f))]
    items=[(f,)+parse_name(f) for f in files]; items=[(f,u,p) for f,u,p in items if (u in RANK or u in HERO) and (not ONLY or u in ONLY)]
    items.sort(key=lambda t:(t[1], POSES.index(t[2])))            # idle trước để có cỡ cho các pose sau
    for f,uid,pose in items:
        im=Image.open(os.path.join(SRC,f))
        if pose=='idle':
            S0=H*float(opt['--h'])/char_height(im) if opt.get('--h') else None
            box,S,info=process(im,uid,'idle',OUT,scale=S0)
        else:
            prev=boxes.get(uid,{}); idle_png=os.path.join(OUT,uid+'_idle.png')
            if not os.path.exists(idle_png): sys.exit(f'{uid}: chưa có {idle_png} — chạy idle trước')
            idle_src=next((os.path.join(SRC,f2) for f2,u2,p2 in items if u2==uid and p2=='idle'), None)
            if idle_src and Image.open(idle_src).size==im.size and prev.get('scale'):   # cùng khổ với ảnh idle → cùng khung hình → cùng hệ số
                S=prev['scale']
            elif opt.get('--ref'):                                 # cùng nguồn với một frame đứng → khớp chiều cao người
                bb=Image.open(idle_png).getbbox(); idleH=prev.get('idleH') or (bb[3]-bb[1] if bb else H)
                S=idleH/char_height(Image.open(opt['--ref']))
            else:                                                  # khớp diện tích PHẦN THÂN (đã bào mỏng) với sprite idle đã ra
                _,a0=prep(im); S=float(np.sqrt(sprite_core(idle_png)/core_area(a0)))
            S*=SCALE_ADJ.get((uid,pose),1.0)
            box,S,info=process(im,uid,pose,OUT,scale=S,ref_png=idle_png)
        boxes.setdefault(uid,{})[pose]=box
        if pose=='idle': boxes[uid]['scale']=round(S,4); boxes[uid]['idleH']=info['spriteH']
        print(json.dumps(info, ensure_ascii=False))
    save_boxes(boxes); print('-> '+BOXES+':', len(boxes), 'con')
