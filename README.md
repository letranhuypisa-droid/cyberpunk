# CHROMEFALL

Web gacha turn-based cyberpunk, portrait-first. Prototype: ba chương PvE, 19 nhân vật có hồ sơ, gacha, nâng cấp, nhiệm vụ ngày.

## Chạy

Cần một static server để ảnh/video/âm thanh load được (mở file trực tiếp sẽ thiếu asset):

```bash
python -m http.server 8765
```

rồi mở `http://localhost:8765/index.html`. UI kit và token nằm cuối trang (`#kit`).

## Cấu trúc

| Đường dẫn | Nội dung |
|---|---|
| `index.html` | Markup mọi màn hình + kit |
| `css/chromefall.css` | Token thiết kế (Chrome/Rust/tier/ngữ nghĩa, sáng + tối) và toàn bộ giao diện |
| `js/core.js` | Tiện ích DOM, loader ảnh có fallback, thanh HP/Energy, theme |
| `js/data.js` | **Nội dung & số liệu**: roster, kẻ địch, chương/sector, cốt truyện, lore, bonds, gacha. Sửa ở đây. |
| `js/state.js` | Lưu/nạp hồ sơ (`SAVE`, local hoặc remote), nâng cấp (`UPGRADE`), nhiệm vụ ngày |
| `js/audio.js` | SFX giao diện (audio/*.ogg) + âm chiến đấu tổng hợp WebAudio |
| `js/battle.js` | Engine trận: lượt, sát thương, animation, ult + cut-in video, wave, HALO LINK, VERSE |
| `js/app.js` | Router màn hình, lobby, squad, sector, gacha, archive, config, story overlay |
| `docs/story.md` | Thế giới, chiến dịch, thiết kế màn, hai kết |
| `docs/characters.md` | Hồ sơ 19 nhân vật + Operator |
| `docs/bg-prompts.md` | Prompt sinh ảnh nền và quy tắc zoom/chân trời |

Mọi số liệu cân bằng đánh dấu `★ FAKE` là bản nháp.

## Asset

- Sprite: `<id>_idle.png` (744×682), `<id>_attack.png`, `<id>_hurt.png` — tách nền bằng `scratch/key_frame.py` (xem docs).
- Nền sector: `bg_<sector>.jpg` 1536×2048; thiếu thì dùng `bg_battle.jpg`.
- Video ult: `<id>_ult.mp4` H.264.
- Ảnh gốc độ phân giải cao để trong `art-src/` (không đưa lên repo).

UI SFX: "Sci Fi UI SFX Pack (FREE)" © JDSherbert — xem `audio/CREDITS.txt`.
