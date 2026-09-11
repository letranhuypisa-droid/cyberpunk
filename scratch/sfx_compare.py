#!/usr/bin/env python3
"""Đo đặc tính từng file SFX để so bản mới với bản đang dùng (không phải nghe bằng tai).

  python scratch/sfx_compare.py <file hoặc thư mục> ...

Cột đo:
  dai    thời lượng còn tiếng (đã bỏ im lặng đầu/đuôi ở -45 dB)
  dinh   đỉnh dBFS
  vao    thời gian từ lúc có tiếng đến đỉnh (s) — nhỏ = đánh "cộp", lớn = dâng lên
  duoi   thời gian từ đỉnh xuống -20 dB (s) — đuôi vang
  sang   spectral centroid (Hz) — cao = chói/kim loại, thấp = trầm/ục
  on     spectral flatness 0..1 — cao = tiếng ồn (nổ, xì), thấp = tiếng có cao độ (chuông, còi)
  nhip   số cú đánh (onset) trong file — >1 là tiếng nhiều nhịp, không phải one-shot
"""
import subprocess, sys, math
from pathlib import Path
import numpy as np

SR = 22050

def load(p):
    r = subprocess.run(['ffmpeg','-v','error','-i',str(p),'-ac','1','-ar',str(SR),'-f','f32le','-'],
                       capture_output=True)
    return np.frombuffer(r.stdout, dtype=np.float32).astype(np.float64)

def db(x): return 20*math.log10(max(x, 1e-9))

def feats(p):
    x = load(p)
    if x.size == 0: return None
    peak = np.abs(x).max()
    # bỏ im lặng đầu/đuôi ở -45 dB so với đỉnh
    thr = peak * 10**(-45/20)
    idx = np.where(np.abs(x) > thr)[0]
    a, b = (idx[0], idx[-1]) if idx.size else (0, x.size-1)
    y = x[a:b+1]
    n = y.size
    # envelope RMS 10 ms
    h = SR//100
    fr = y[:n-n % h].reshape(-1, h)
    rms = np.sqrt((fr**2).mean(1)) + 1e-9
    pk = int(rms.argmax())
    attack = pk*h/SR
    tail = next((i-pk for i in range(pk, rms.size) if rms[i] < rms[pk]*0.1), rms.size-pk)*h/SR
    # phổ
    w = np.hanning(min(8192, n)); seg = y[:w.size]*w
    sp = np.abs(np.fft.rfft(seg)) + 1e-12
    f = np.fft.rfftfreq(w.size, 1/SR)
    cen = float((sp*f).sum()/sp.sum())
    flat = float(np.exp(np.log(sp).mean())/sp.mean())
    # onset: RMS tăng vọt >6 dB so với 30 ms trước, cách nhau ít nhất 80 ms
    d = 20*np.log10(rms[1:]/rms[:-1])
    on, last = 1, -99
    for i, v in enumerate(d):
        if v > 6 and rms[i+1] > rms.max()*0.25 and i-last > 8:
            on += 1; last = i
    return dict(dai=n/SR, dinh=db(peak), vao=attack, duoi=tail, sang=cen, on=flat, nhip=on)

def main(args):
    files = []
    for a in args:
        p = Path(a)
        files += sorted(q for q in (p.iterdir() if p.is_dir() else [p])
                        if q.suffix.lower() in ('.mp3','.ogg','.wav','.m4a'))
    print(f"{'file':24s}{'dai':>6s}{'dinh':>7s}{'vao':>6s}{'duoi':>6s}{'sang':>7s}{'on':>6s}{'nhip':>5s}")
    for q in files:
        r = feats(q)
        if not r: print(f'{q.name:24s}  (không đọc được)'); continue
        print(f"{q.name:24s}{r['dai']:6.2f}{r['dinh']:7.1f}{r['vao']:6.2f}{r['duoi']:6.2f}"
              f"{r['sang']:7.0f}{r['on']:6.3f}{r['nhip']:5d}")

if __name__ == '__main__':
    main(sys.argv[1:] or ['audio'])
