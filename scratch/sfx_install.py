#!/usr/bin/env python3
"""File SFX sinh bằng AI (mp3/m4a/wav ở thư mục gốc) -> audio/<tên>.ogg dùng được ngay.

Làm ba việc cho mỗi file:
  1. cắt im lặng ở đầu và ở đuôi (chỉ đuôi thật sự câm đến hết file — khoảng lặng ở GIỮA giữ nguyên,
     vì có tiếng cố tình có nhịp nghỉ như ult: nạp năng lượng rồi mới nổ)
  2. kéo đỉnh về -1 dBFS để mọi tiếng cùng một mức, chênh lệch to nhỏ chỉnh bằng tham số vol trong js/audio.js
  3. mono 44.1 kHz, ogg q5 (nhẹ, mọi trình duyệt đều đọc; .m4a thì js/audio.js không tìm)

    python scratch/sfx_install.py              # cài mọi file tìm thấy theo bảng MAP
    python scratch/sfx_install.py hit crit     # chỉ vài cái
    python scratch/sfx_install.py --dry        # chỉ đo, không ghi

Nguồn nằm ở thư mục gốc dự án (chỗ tải về hay để) hoặc art-src/SFX/. Bản gốc không bị xoá.
Danh sách tên + prompt: docs/sfx-prompts.md
"""
import json, re, shutil, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'audio'
SRC_DIRS = [ROOT, ROOT / 'art-src' / 'SFX']
EXT_IN = ['.mp3', '.m4a', '.wav', '.ogg', '.aac', '.flac']

# tên trong game -> tên file nguồn (không đuôi). Trùng tên thì để None.
# Đợt 2 đổi 8 tiếng sang gói SFX mới; tên nguồn khác tên trong game nên phải khai ở đây.
# Quay lại bản 11/09: đổi về None, riêng heal/wave đổi thành 'heal_v1'/'wave_v1' (bản cũ đã đổi tên
# vì gói mới có file trùng tên), rồi chạy lại script. So sánh: docs/sfx-prompts.md §8.
# Bản thứ 2, 3… của một tiếng (hit2, hit3): game bốc ngẫu nhiên, khai số bản ở SFX_VARIANTS trong js/audio.js.
# Năm tiếng gacha + hit3 chưa có bản thu: nguồn do scratch/sfx_synth.py tổng hợp ra art-src/SFX/ (§10).
MAP = {
    'hit': None, 'hit2': 'attack', 'hit3': None, 'crit': None, 'kia': None, 'heal': None, 'ready': None,
    'ult': None, 'wave': None,
    'explode': 'explosion', 'shock': None, 'burn': None, 'poison': None, 'stun': None, 'shield': None,
    'victory': 'win', 'defeat': None, 'reveal_s': None, 'shield_break': None, 'upgrade': 'level up',
    'tell': None, 'tell_up': None, 'tell_down': None, 'reveal_a': None, 'new_char': None,
    'error': None, 'glitch': None, 'swipe': None, 'select': 'select 2', 'cursor': 'click', 'open': 'select',
    'cancel': None, 'close': None,
}
UI = {'error', 'glitch', 'swipe', 'select', 'cursor', 'open', 'cancel', 'close'}   # đè lên gói JDSherbert
# Tiếng bị 11labs chèn khoảng lặng vào GIỮA (nghe thành hai tiếng rời) → dồn lại liền mạch.
# Chỉ khai tên nào thật sự bị, vì có tiếng nghỉ đúng ý đồ thì dồn lại là hỏng.
TIGHT = {'explode', 'wave', 'ult'}
PEAK = -1.0          # dBFS đỉnh sau khi chuẩn hoá
PAD = 0.06           # giữ lại chút đuôi cho tiếng tắt tự nhiên (s)
FADE = 0.008         # vuốt nhỏ ở cuối cho khỏi cụp (s)
GAP = 0.12           # khoảng lặng ở giữa dài hơn ngần này thì cắt (s), giữ lại 0.02 s cho khỏi cụt


def ff(args):
    return subprocess.run(args, capture_output=True, text=True, encoding='utf-8', errors='replace')


def measure(src):
    """Trả về (thời lượng, đỉnh dB, cắt từ, cắt đến)."""
    dur = float(ff(['ffprobe', '-v', 'error', '-show_entries', 'format=duration',
                    '-of', 'csv=p=0', str(src)]).stdout.strip())
    log = ff(['ffmpeg', '-hide_banner', '-nostats', '-i', str(src),
              '-af', 'silencedetect=noise=-45dB:d=0.05,volumedetect', '-f', 'null', '-']).stderr
    peak = float(re.search(r'max_volume: *(-?[\d.]+) dB', log).group(1))
    spans = list(zip([float(x) for x in re.findall(r'silence_start: *([\d.]+)', log)],
                     [float(x) for x in re.findall(r'silence_end: *([\d.]+)', log)] + [dur]))
    start = spans[0][1] if spans and spans[0][0] < 0.02 else 0.0            # câm ngay từ đầu
    end = dur
    for s, e in spans:
        if e >= dur - 0.02:                                                # câm liền một mạch đến hết file
            end = min(dur, s + PAD)
            break
    return dur, peak, start, max(end, start + 0.05)


def install(name, src, dry=False):
    dur, peak, a, b = measure(src)
    new = b - a
    dst = OUT / f'{name}.ogg'
    row = dict(sfx=name, nguon=src.name, dai=round(dur, 2), con=round(new, 2),
               dinh=peak, gain=round(PEAK - peak, 1))
    if dry:
        return row
    if name in UI and dst.exists():                                        # giữ bản JDSherbert lại một chỗ
        bak = OUT / 'jdsherbert'
        bak.mkdir(exist_ok=True)
        if not (bak / dst.name).exists():
            shutil.move(str(dst), str(bak / dst.name))
    # areverse quanh afade=t=in: vuốt đuôi mà không cần biết còn dài bao nhiêu (dồn khoảng lặng xong độ dài đã đổi)
    tight = (f'silenceremove=stop_periods=-1:stop_duration={GAP}:stop_threshold=-50dB:stop_silence=0.02,'
             if name in TIGHT else '')
    af = (f'atrim=start={a:.3f}:end={b:.3f},asetpts=N/SR/TB,{tight}'
          f'volume={PEAK - peak:.1f}dB,areverse,afade=t=in:d={FADE},areverse')
    r = ff(['ffmpeg', '-y', '-v', 'error', '-i', str(src), '-af', af,
            '-ac', '1', '-ar', '44100', '-c:a', 'libvorbis', '-q:a', '5', str(dst)])
    if r.returncode:
        row['loi'] = r.stderr.strip()[:200]
    else:
        row['kb'] = round(dst.stat().st_size / 1024, 1)
    return row


def find(name):
    stem = MAP.get(name) or name
    for d in SRC_DIRS:
        for ext in EXT_IN:
            p = d / f'{stem}{ext}'
            if p.exists() and p.parent != OUT:
                return p
    return None


if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('-')]
    dry = '--dry' in sys.argv
    names = args or list(MAP)
    rows, thieu = [], []
    for n in names:
        src = find(n)
        if src:
            rows.append(install(n, src, dry))
        else:
            thieu.append(n)
    print(json.dumps({'da_cai' if not dry else 'do_thu': rows, 'chua_co_file': thieu},
                     ensure_ascii=False, indent=1))
