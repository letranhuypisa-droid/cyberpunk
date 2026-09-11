'use strict';
/* DATA — nội dung game: roster (chỉ số, skill, passive), kẻ địch, chiến dịch, hồ sơ người chơi, lore, bonds, gacha.
   Lời thoại comic từng màn nằm ở js/story.js. Dữ liệu chương 2–3 bản cũ nằm ở js/data_later.js (không nạp).
   Sửa số liệu ở đây. ★ FAKE = bản nháp cân bằng. */

const TEAM_SIZE = 3;                       // đội ra trận tối đa 3 người
const STORY_ONLY = ['yuki','psalm'];       // nhân vật cốt truyện: không lên bể gacha

/* =====================================================================
   ROSTER
   spd      = tốc độ: thứ tự lượt mỗi round (cao đi trước; bằng nhau thì đội mình trước, rồi theo slot).
   crit     = % chí mạng cơ bản (sát thương ×RULES.critMult); skill.critPct và passive critPct cộng thêm.
   skill    = đòn thường. KHÔNG có name: chỉ chiêu cuối mới có tên (chốt 07/09, xem docs/skill-naming.md §4).
              mult (hệ số ATK), energy (Energy nhận mỗi đòn), critPct (thêm % chí mạng),
              executeBelow/executeBonus (mục tiêu dưới X% HP → +Y% sát thương),
              fx = overlay lúc trúng đòn: hit (mặc định) · crit · explode · shock · poison · burn · stun · heal (js/fx.js),
              status = trạng thái kèm theo {kind, turns, pct, chance}: poison/burn = đầu mỗi lượt của người dính mất pct×ATK
              người gây, trong turns lượt · stun = mất lượt kế tiếp · chance = xác suất dính (mặc định 1). ult nhận fx/status như skill.
   passives = nội tại. when: {ally:id} có đồng đội đó trong đội · {allyAny:[ids]} · {enemy:id} sector có kẻ địch đó ·
              {enemyFaction:'chrome'|'rust'} sector có địch phe đó. effect: atkPct, hpPct, energyStart (áp lúc vào trận),
              dmgPct, dmgTakenPct, critPct (theo đòn, chỉ tính khi khớp mục tiêu), energyGainPct.
   tag      = nhãn ngắn hiện trên bảng unit trong trận.
   ===================================================================== */
const ROSTER = {
  // ---- Có đủ frame trận (idle/attack/hurt) — di chuyển giữ nguyên idle, không còn frame dash ----
  yuki:  { id:'yuki',  name:'YUKI',  faction:'chrome', tier:'S', atk:145, hp:950,  energyMax:100, spd:112, crit:20,
           skill:{ desc:'Đòn thường 100% ATK, +25 Energy. Mục tiêu dưới 30% HP thì đòn mạnh thêm 50%.', mult:1, energy:25, executeBelow:.3, executeBonus:.5 },
           ult:{ name:'ZERO', cost:100, kind:'nuke', mult:3.2, refundOnKill:50, fx:'zero',   // overlay riêng: một nhát dọc tím chrome (css/fx.css .fx--zero)
                 desc:'Ba bước, một nhát: 320% ATK lên một mục tiêu. Giết được thì hoàn 50 Energy.' },
           passives:[
             { id:'yuki-guard', tag:'CANH GÁC', name:'BÓNG HÌNH NGƯỜI CANH GÁC', when:{ally:'psalm'}, effect:{energyStart:50},
               desc:'Khi sát cánh cùng Psalm, cảm giác quen thuộc từ kẻ từng canh giữ mình giúp Yuki bước vào trận chiến với một nửa thanh năng lượng tích tụ sẵn.' },
             { id:'yuki-debt',  tag:'NỢ CŨ',   name:'NỢ CŨ THÁP CAO',          when:{enemyFaction:'chrome'}, effect:{dmgPct:15},
               desc:'Mối căm hờn tiềm thức đối với tập đoàn Canticle khiến mọi đòn đánh của cô lên kẻ địch thuộc phe Chrome trở nên tàn khốc hơn.' },
             { id:'yuki-name',  tag:'CÁI TÊN', name:'MỐI THÙ ĐẦU TIÊN',        when:{enemy:'cantor'}, effect:{dmgPct:30},
               desc:'Đối diện với kẻ đội Halo vàng — Cantor, sát thương của Yuki gia tăng vượt bậc; nhát kiếm nhắm thẳng vào kẻ đã hủy hoại cuộc đời cô.' },
           ],
           // Frame tách nền bằng scratch/key_frame.py (scale 0.72, sàn y=678). box = kích thước canvas + ax = điểm giữa hai bàn chân.
           // (art/sprite/<id>_dash.png cũ không còn được nạp.)
           sprites:{ idle:['art/sprite/yuki_idle.png'], attack:['art/sprite/yuki_attack.png'], hurt:['art/sprite/yuki_hurt.png'],
                     box:{ idle:{w:744,h:682,ax:372}, attack:{w:1173,h:682,ax:466}, hurt:{w:924,h:682,ax:641} } },
           portrait:['art/card/yuki_portrait.jpg','art/card/yuki.png'], pos:'50% 4%',   // bán thân cắt từ art thẻ như 8 người kia (art thẻ đời trước để art-src/YUKI/yuki_card_v1.png, key art bán thân cũ ở art-src/YUKI/yuki_portrait_keyart.jpg)
           reveal:['art/reveal/yuki_reveal.jpg','art-src/YUKI/Yuki mở rương.png'], revealPos:'50% 50%',   // ảnh mở rương 16:9: mặt thẻ khi quay ra ở gacha
           revealVideo:['video/yuki_reveal.mp4','art-src/YUKI/hoat anh mo ruong.mp4'],            // video mở rương phát trước khi lật thẻ (chỉ Yuki có)
           // Cut-in khi phát chiêu cuối. 11/09: thay bằng video mới (854×480) và BỎ hẳn hai video cũ — Yuki chỉ còn
           // một video, không quay ngẫu nhiên nữa (yuki_ult2.mp4 + 'Yuki Ultimate 2.mp4' đã xoá khỏi ổ).
           ultVideo:['video/yuki_ult.mp4','art-src/YUKI/Yuki Ultimate.mp4'] },
  psalm: { id:'psalm', name:'PSALM', faction:'chrome', tier:'S', atk:110, hp:1100, energyMax:125, spd:88,  crit:5,
           skill:{ desc:'Đòn thường 100% ATK, +30 Energy.', mult:1, energy:30 },
           ult:{ name:'APOSTASY', cost:125, kind:'control', fx:'shock',
                 desc:'Chiếm quyền điều khiển một kẻ địch trong một lượt: lượt tới nó quay sang đánh đồng bọn.' },
           passives:[
             { id:'psalm-313', tag:'SỐ 313', name:'HỒN NỢ CA THỨ 313', when:{ally:'yuki'}, effect:{hpPct:20},
               desc:'Khi có Yuki trong đội hình, gánh nặng bảo hộ sinh linh này biến thành ý chí thép, gia tăng lượng máu tối đa cho Psalm.' },
             { id:'psalm-choir', tag:'BIẾT CHOIR', name:'TƯỜNG TẬN QUÂN ĐOÀN', when:{enemyFaction:'chrome'}, effect:{dmgTakenPct:-15},
               desc:'Từng là kẻ thẩm vấn toàn bộ mạng lưới Choir, Psalm nắm rõ từng khe hở trong giáo trình tác chiến của lính Chrome, giảm đáng kể sát thương phải nhận từ chúng.' },
           ],
           sprites:{ idle:['art/sprite/psalm_idle.png'], attack:['art/sprite/psalm_attack.png'], hurt:['art/sprite/psalm_hurt.png'],
                     box:{ idle:{w:744,h:682,ax:372}, attack:{w:1203,h:682,ax:534}, hurt:{w:811,h:682,ax:382} } },
           ultVideo:['video/psalm_ult.mp4','art-src/PSALM/PSALM ultimate.mp4'],
           portrait:['art/card/psalm_portrait.jpg','art/card/psalm.png'], pos:'50% 12%',
           reveal:['art/reveal/psalm_reveal.jpg','art-src/PSALM/PSALM rương.png'], revealPos:'50% 50%' },
  ash:   { id:'ash',   name:'ASH',   faction:'rust', tier:'A', atk:120, hp:1000, energyMax:75, spd:105, crit:12,
           skill:{ desc:'Đòn thường 100% ATK, +35 Energy. Lưỡi axit để lại độc: mục tiêu mất thêm 20% ATK của Ash đầu mỗi lượt, trong 2 lượt.', mult:1, energy:35,
                   fx:'poison', status:{kind:'poison', turns:2, pct:.2} },
           ult:{ name:'FLASHOVER', cost:75, kind:'aoe', mult:1.5, fx:'explode', status:{kind:'burn', turns:2, pct:.2},
                 desc:'Lưới mìn gài sẵn dưới chân địch. Ash bật lửa, cả bãi nổ một lượt: 150% ATK lên toàn bộ kẻ địch, rồi cháy thêm 2 lượt (20% ATK mỗi lượt).' },   // theo video ult (sprite trận vẫn là kiếm)
           passives:[
             { id:'ash-twin', tag:'CHỊ EM', name:'MÁU MỦ BẤT DIỆT', when:{ally:'kai'}, effect:{atkPct:10},
               desc:'Khi người em trai Kai có mặt trên chiến trường, mối liên kết sinh đôi giúp Ash gia tăng sức tấn công vượt bậc trong từng nhát kiếm.' },
             { id:'ash-price', tag:'ĐỊNH GIÁ', name:'MẮT ĐỊNH GIÁ', when:{enemyFaction:'rust'}, effect:{dmgPct:10},
               desc:'Đối đầu với các băng đảng Khu Đáy, sự am hiểu tường tận về trang bị chắp vá của chúng giúp nhát chém của Ash gây sát thương nặng nề hơn.' },
             { id:'ash-floor4', tag:'TẦNG BỐN', name:'NỢ MÁU TẦNG BỐN', when:{enemy:'cantor'}, effect:{dmgPct:20},
               desc:'Lòng hận thù khắc sâu từ thảm kịch năm xưa bùng cháy mỗi khi cô chạm trán tên đao phủ Cantor.' },
           ],
           sprites:{ idle:['art/sprite/ash_idle.png'], attack:['art/sprite/ash_attack.png'], hurt:['art/sprite/ash_hurt.png'],
                     box:{ idle:{w:796,h:682,ax:521}, attack:{w:1179,h:682,ax:385}, hurt:{w:861,h:682,ax:574} } },
           ultVideo:['video/ash_ult.mp4','art-src/ASH/ash ultimate.mp4'],
           portrait:['art/card/ash_portrait.jpg','art/card/ash.png'], pos:'50% 8%',
           reveal:['art/reveal/ash_reveal.jpg','art-src/ASH/ash rương.png'], revealPos:'50% 50%' },
  kai:   { id:'kai',   name:'KAI',   faction:'rust', tier:'B', atk:95,  hp:1200, energyMax:100, spd:96,  crit:10,
           skill:{ desc:'Đòn thường 100% ATK, +25 Energy, thêm 15% tỉ lệ chí mạng.', mult:1, energy:25, critPct:15 },
           ult:{ name:'RIPCORD', cost:100, kind:'nuke', mult:2.4, fx:'shock', status:{kind:'stun', turns:1},
                 desc:'Súng điện từ to hơn người. Kai ngắm kỹ rồi bắn một phát xuyên thẳng: 240% ATK lên một mục tiêu. Trúng là choáng, mất lượt kế tiếp.' },   // theo video ult; từ 11/09 sprite trận đeo pháo sau lưng như thẻ bài, đòn thường vẫn là kiếm
           passives:[
             { id:'kai-twin', tag:'CHỊ EM', name:'CHỊ EM ĐỒNG TÂM', when:{ally:'ash'}, effect:{hpPct:15},
               desc:'Có Ash đứng phía sau lưng, Kai vững vàng hơn trước sóng gió, gia tăng lượng máu tối đa.' },
             { id:'kai-fan', tag:'FAN', name:'HÀO KHÍ TUỔI TRẺ', when:{ally:'yuki'}, effect:{atkPct:10},
               desc:'Kai tự phong Yuki làm chị nuôi từ cái đêm cậu đặt tên cho cô — chẳng máu mủ gì, nhưng hễ có "chị hai" đứng nhìn là cậu lại muốn ra oai, khiến sức sát thương của đòn đánh bộc phát mạnh mẽ hơn.' },
             { id:'kai-hound', tag:'CHÓ MÁY', name:'CHÓ THÉP THÀNH TRO', when:{enemy:'chromehound'}, effect:{dmgPct:40},
               desc:'Căm ghét những cỗ máy săn mồi vô cảm của Canticle, Kai gây thêm lượng lớn sát thương khi đụng độ lũ Chó Máy Chrome Hound.' },
           ],
           sprites:{ idle:['art/sprite/kai_idle.png'], attack:['art/sprite/kai_attack.png'], hurt:['art/sprite/kai_hurt.png'],
                     box:{ idle:{w:744,h:682,ax:372}, attack:{w:744,h:682,ax:372}, hurt:{w:744,h:682,ax:372} } },   // 11/09: 5 pose mới (Kai đeo pháo điện từ), cả bộ cùng hộp 744×682
           ultVideo:['video/kai_ult.mp4','art-src/Kai/Kai ultimate 2.mp4'],   // 11/09: video mới (bản cũ vẫn nằm ở art-src/Kai/Kai ultimate.mp4, không còn được gọi)
           portrait:['art/card/kai_portrait.jpg','art/card/kai.png'], pos:'50% 8%',
           reveal:['art/reveal/kai_reveal.jpg','art-src/Kai/Kai rương.png'], revealPos:'50% 50%' },
  // ---- Chỉ có chân dung (trong trận hiện silhouette) ----
  ronin: { id:'ronin', name:'RONIN', faction:'rust', tier:'A', atk:130, hp:1050, energyMax:100, spd:104, crit:15,   // ★ FAKE: cost + hệ số (tên + mô tả chiêu cuối đã chốt, xem docs/skill-naming.md §9)
           skill:{ desc:'Đòn thường 100% ATK, +25 Energy, thêm 10% tỉ lệ chí mạng.', mult:1, energy:25, critPct:10 },
           ult:{ name:'IAIDO', cost:100, kind:'nuke', mult:2.8, desc:'Ronin không né. Anh bước tới một bước, vào đúng đường đòn đang tới, rồi chém xuống một nhát: 280% ATK lên một mục tiêu.' },
           passives:[
             { id:'ronin-lead', tag:'TỔ TRƯỞNG', name:'TRÁCH NHIỆM CỦA NGƯỜI DẪN ĐẦU', when:{allyAny:['ash','kai']}, effect:{atkPct:10},
               desc:'Khi có thuộc hạ trong tổ bên cạnh, ý chí bảo bọc biến thành sát lực, gia tăng sát thương cho từng đường gươm.' },
             { id:'ronin-rule', tag:'LUẬT TỔ', name:'THANH TRỪNG KẺ BÁN THỊT', when:{enemy:'foreman'}, effect:{dmgPct:20},
               desc:'Cực kỳ căm ghét những kẻ rã xác người đổi tiền, nhát chém của Ronin gây sát thương tàn bạo lên tên trùm Foreman.' },
           ],
           sprites:{ idle:['art/sprite/ronin_idle.png'], attack:['art/sprite/ronin_attack.png'], hurt:['art/sprite/ronin_hurt.png'],
                     box:{ idle:{w:744,h:682,ax:372}, attack:{w:744,h:682,ax:372}, hurt:{w:744,h:682,ax:372} } },   // ★ idle TẠM = chính frame đòn thường (tấn ngang): bảng pose 11/09 chưa có tư thế đứng
           ultVideo:['video/ronin_ult.mp4'],
           portrait:['art/card/ronin_portrait.jpg','art/card/ronin.png'], pos:'50% 8%' },
  muzzle:{ id:'muzzle',name:'MUZZLE',faction:'rust', tier:'B', atk:70,  hp:1750, energyMax:125, spd:80,  crit:5,   // ★ FAKE: cost + hệ số (tên + mô tả chiêu cuối đã chốt, xem docs/skill-naming.md §9)
           skill:{ desc:'Đòn thường 100% ATK, +30 Energy.', mult:1, energy:30 },
           ult:{ name:'FIELD PATCH', cost:125, kind:'heal', mult:1.2, desc:'Muzzle đóng cánh cửa xe xuống nền, cả tổ lùi về sau lưng anh. Trong vòm bụi đó giáp rách được vá, người ngã đứng dậy: hồi 120% ATK cho cả đội.' },
           passives:[
             { id:'muzzle-scar', tag:'SẸO', name:'HUYẾT NHẠT SẸO SÂU', when:{ally:'ash'}, effect:{dmgTakenPct:-15},
               desc:'Nhìn thấy Ash không bao giờ gục ngã trên chiến tuyến, Muzzle được tiếp thêm nghị lực, gia tăng khả năng chống chịu sát thương.' },
             { id:'muzzle-mom', tag:'CÁNH TƯ', name:'LỜI HẸN VỚI CÁNH CỬA THỨ TƯ', when:{ally:'meridian'}, effect:{hpPct:20},
               desc:'Mối giao ước bảo vệ lẫn nhau cùng Meridian giúp tăng giới hạn máu tối đa của ông khi cả hai cùng xuất trận.' },
             { id:'muzzle-gate', tag:'CỔNG CŨ', name:'NHẬN DIỆN ĐỒNG ĐỘI CŨ', when:{enemy:'enforcer'}, effect:{dmgPct:25},
               desc:'Mười bốn năm gác cạnh lính Enforcer giúp Muzzle nắm rõ từng khớp nối lỏng lẻo trên giáp trụ của chúng, gia tăng sát thương khi đối đầu với loại lính này.' },
           ],
           sprites:{ idle:['art/sprite/muzzle_idle.png'], attack:['art/sprite/muzzle_attack.png'] },
           ultVideo:['video/muzzle_ult.mp4'],
           portrait:['art/card/muzzle_portrait.jpg','art/card/muzzle.png'], pos:'50% 8%' },
  echo:  { id:'echo',  name:'ECHO',  faction:'chrome', tier:'A', atk:105, hp:1000, energyMax:100, spd:100, crit:10,
           skill:{ desc:'Đòn thường 100% ATK, +25 Energy, thêm 5% tỉ lệ chí mạng.', mult:1, energy:25, critPct:5 },
           ult:{ name:'PLAYBACK', cost:100, kind:'nuke', mult:2.5, fx:'shock', desc:'Echo bóc niêm phong ở cổ, mở lại cái loa cô tự cắt và nói đúng hai chữ bằng giọng đi mượn: 250% ATK lên một mục tiêu. Nói xong cô lấy tay bịt loa lại.' },
           passives:[
             { id:'echo-line', tag:'MỘT CÂU', name:'TIẾNG VỌNG TÌM TÊN', when:{ally:'yuki'}, effect:{atkPct:10},
               desc:'Luôn khao khát tìm thấy một câu nói chân thật chưa từng bị sao chép từ chính miệng Yuki, sức tấn công của Echo bộc phát mạnh mẽ khi chiến đấu bên cạnh cô.' },
             { id:'echo-cut', tag:'CẮT LOA', name:'DẬP TẮT BÀI CA', when:{enemyFaction:'chrome'}, effect:{dmgPct:10},
               desc:'Quá thấu hiểu cách thức truyền tin bằng sóng âm của Quân Đoàn Ca, các đòn tấn công của Echo gây sát thương áp đảo lên các cỗ máy thuộc phe Chrome.' },
           ],
           sprites:{idle:['art/sprite/echo_idle.png'],attack:['art/sprite/echo_attack.png']}, ultVideo:['video/echo_ult.mp4'], portrait:['art/card/echo_portrait.jpg','art/card/echo.png'], pos:'50% 8%' },
  wire:  { id:'wire',  name:'WIRE',  faction:'chrome', tier:'B', atk:80,  hp:1500, energyMax:75, spd:90,  crit:8,
           skill:{ desc:'Đòn thường 100% ATK, +30 Energy.', mult:1, energy:30 },
           ult:{ name:'OVERCLOCK', cost:75, kind:'nuke', mult:2.2, fx:'shock', desc:'Wire với tay bắt lấy dòng điện trong Halo của mục tiêu rồi vặn quá ngưỡng: 220% ATK. Cái vòng quay nhanh dần cho tới lúc nướng chín thứ nó đang đội.' },
           passives:[
             { id:'wire-screws', tag:'ỐC VÍT', name:'TỪNG MỐI HÀN GẮN', when:{ally:'halo'}, effect:{atkPct:10},
               desc:'Nhìn thấy cô y tá Halo an toàn trong đội hình, Wire tìm thấy niềm an ủi trong công việc, gia tăng đáng kể sức sát thương của bản thân.' },
             { id:'wire-lot', tag:'SỐ LÔ', name:'MÃ LÔ KHẮC TẬN XƯƠNG', when:{enemyFaction:'chrome'}, effect:{dmgPct:8},
               desc:'Từng tự tay lắp ráp hàng ngàn cỗ máy cho Canticle, Wire nắm rõ vị trí những con ốc lỏng trên từng số lô kẻ địch phe Chrome, khiến các đòn đánh của cô gây sát thương tàn khốc lên chúng.' },
           ],
           sprites:{idle:['art/sprite/wire_idle.png'],attack:['art/sprite/wire_attack.png']}, ultVideo:['video/wire_ult.mp4'], portrait:['art/card/wire_portrait.jpg','art/card/wire.png'], pos:'50% 8%' },
  stitch:{ id:'stitch',name:'STITCH',faction:'rust',   tier:'S', atk:140, hp:900,  energyMax:100, spd:108, crit:15,
           skill:{ desc:'Đòn thường 100% ATK, +30 Energy.', mult:1, energy:30 },
           ult:{ name:'SUTURE', cost:100, kind:'heal', mult:1.5, desc:'Bốn cánh tay phẫu thuật bung ra, bốn cây kim cong, bốn sợi chỉ bắn đi bốn hướng. Chỉ thắt lại một cái, vết thương cả tổ đóng miệng cùng lúc: hồi 150% ATK cho cả đội.' },
           passives:[
             { id:'stitch-weld', tag:'MỐI HÀN', name:'LIÊN KẾT BÀN MỔ', when:{ally:'junker'}, effect:{atkPct:10},
               desc:'Chứng kiến cỗ xe Junker — kiệt tác phẫu thuật của đời mình lao lên phía trước, Stitch được tiếp thêm nhuệ khí, tăng cường sức sát thương cá nhân.' },
             { id:'stitch-sleeve', tag:'TAY ÁO', name:'TAY ÁO DÀY CHIẾN TRẬN', when:{enemyFaction:'rust'}, effect:{dmgTakenPct:-10},
               desc:'Những mũi chỉ đen tích tụ qua năm tháng trên tay áo như một tấm giáp tâm linh, giúp bà giảm thiểu sát thương khi đối đầu với các thế lực bùn lầy Khu Đáy.' },
           ],
           sprites:{idle:['art/sprite/stitch_idle.png'],attack:['art/sprite/stitch_attack.png']}, ultVideo:['video/stitch_ult.mp4'], portrait:['art/card/stitch_portrait.jpg','art/card/stitch.png'], pos:'50% 8%' },
};
/* ---- ★ FAKE: 10 nhân vật chưa có art → silhouette; cost/hệ số còn tạm (tên + mô tả chiêu cuối đã chốt, xem docs/skill-naming.md §9) ---- */
const mkChar = (id,name,faction,tier,atk,hp,energyMax,skill,ult,passives) => ({ id,name,faction,tier,atk,hp,energyMax,
  skill:Object.assign({ mult:1, energy:25 }, skill), ult, passives:passives||[],
  sprites:{ idle:['art/sprite/'+id+'_idle.png'], attack:['art/sprite/'+id+'_attack.png'], hurt:['art/sprite/'+id+'_hurt.png'] },
  portrait:['art/card/'+id+'_portrait.jpg','art/card/'+id+'.png'], pos:'50% 8%' });
/* spd/crit cho 10 nhân vật mkChar (+ fx chiêu cuối nếu có) ★ FAKE */
const HERO_EXTRA = { vesper:{spd:110,crit:15}, nyx:{spd:106,crit:15}, halo:{spd:92,crit:10}, cipher:{spd:100,crit:10}, meridian:{spd:78,crit:5},
  toll:{spd:98,crit:15}, spark:{spd:104,crit:10,ultFx:'shock'}, vixen:{spd:114,crit:15}, junker:{spd:76,crit:5,ultFx:'explode'}, gravedigger:{spd:74,crit:8} };
[ mkChar('vesper','VESPER','chrome','S',150,900,100, {desc:'Đòn thường 100% ATK, +25 Energy, thêm 5% chí mạng.', critPct:5},
    {name:'EVENSONG',cost:100,kind:'aoe',mult:1.8,desc:'Vesper vào đúng vị trí Canticle lấy của chị mình, rồi ra đòn theo nhịp Halo, không sớm không muộn một giây: 180% ATK lên toàn bộ kẻ địch.'},
    [ { id:'vesper-sis', tag:'CHỊ', name:'TÌNH THÂN ĐỒNG LÔ', when:{ally:'yuki'}, effect:{atkPct:15}, desc:'Sự cộng hưởng kỳ lạ từ mã gen máy móc cùng lô sản xuất khiến Vesper bộc phát sát thương kinh hoàng khi đứng cạnh Yuki.' },
      { id:'vesper-clean', tag:'SÀN SẠCH', name:'KẺ THÙ CỦA SỰ BẨN THỈU', when:{enemyFaction:'rust'}, effect:{dmgTakenPct:-10}, desc:'Khinh miệt lối đánh chắp vá, bẩn thỉu của các băng đảng Khu Đáy, Vesper sở hữu khả năng phòng ngự và né đòn vượt trội trước nhóm kẻ địch này.' } ]),
  mkChar('nyx','NYX','chrome','S',140,1000,125, {desc:'Đòn thường 100% ATK, +30 Energy.', energy:30},
    {name:'BLACKOUT',cost:125,kind:'nuke',mult:3.4,desc:'Bốn năm dưới hầm dạy Nyx nhìn trong tối. Cô tắt hết đèn quanh một mục tiêu rồi mới ra đòn: 340% ATK lên một mục tiêu.'},
    [ { id:'nyx-choose', tag:'CHỌN LẠI', name:'BÀI HỌC CHỌN LỰA', when:{ally:'ronin'}, effect:{atkPct:10}, desc:'Lời chỉ dạy của Ronin về quyền tự quyết giúp Nyx tìm thấy sự tự tin, gia tăng lượng sát thương khi chiến đấu bên cạnh người thủ lĩnh.' },
      { id:'nyx-nohalo', tag:'KHÔNG HALO', name:'BÓNG MA KHÔNG VÒNG', when:{enemyFaction:'chrome'}, effect:{dmgPct:15}, desc:'Mang thân phận của một cỗ máy không hề có Halo, lối di chuyển dị biệt của Nyx khiến hệ thống định vị của lính phe Chrome hoàn toàn bị tê liệt.' } ]),
  mkChar('halo','HALO','chrome','A',115,1150,100, {desc:'Đòn thường 100% ATK, +25 Energy, thêm 10% chí mạng.', critPct:10},
    {name:'WARD ROUND',cost:100,kind:'heal',mult:1.4,desc:'Halo đi một vòng, chạm vào từng người là biết ngay ai đau chỗ nào, nên vá đúng chỗ đó: hồi 140% ATK cho cả đội.'},
    [ { id:'halo-wire', tag:'ỐC VÍT', name:'HƠI ẤM CỦA ỐC VÍT', when:{ally:'wire'}, effect:{hpPct:15}, desc:'Sự ân cần của Wire — người duy nhất từng hỏi cô có đau hay không — giúp Halo cảm nhận được tình người, gia tăng lượng máu tối đa cho cô.' },
      { id:'halo-pain', tag:'BIẾT ĐAU', name:'TIÊN TRI VẾT CHÉM', when:{enemyFaction:'chrome'}, effect:{dmgTakenPct:-10}, desc:'Từng chữa trị cho hàng ngàn lính Chrome, cô đọc trước được quỹ đạo ra đòn của chúng, giúp cô giảm thiểu tối đa sát thương phải gánh chịu từ phe này.' } ]),
  mkChar('cipher','CIPHER','chrome','A',125,950,75, {desc:'Đòn thường 100% ATK, +30 Energy.', energy:30},
    {name:'ROOT ACCESS',cost:75,kind:'control',desc:'Phần mềm trong cái vòng đó do Cipher viết nên anh có quyền cao nhất: chiếm điều khiển một kẻ địch trong một lượt, lượt tới nó quay sang đánh đồng bọn.'},
    [ { id:'cipher-3s', tag:'BA GIÂY', name:'KHOẢNG TRỐNG BA GIÂY', when:{ally:'psalm'}, effect:{energyStart:25}, desc:'Nhìn thấy Psalm — người đã chứng minh cho sự đúng đắn của đoạn mã anh cài cắm năm xưa, Cipher bước vào trận chiến với một lượng năng lượng tích lũy sẵn.' },
      { id:'cipher-src', tag:'MÃ NGUỒN', name:'NẮM GIỮ MÃ GỐC', when:{enemyFaction:'chrome'}, effect:{dmgPct:10}, desc:'Từng là kẻ viết nên phần mềm điều khiển trong đầu binh lính Tháp, mọi đòn tấn công của Cipher lên kẻ địch phe Chrome đều gây thêm sát thương.' } ]),
  mkChar('meridian','MERIDIAN','chrome','B',85,1450,125, {desc:'Đòn thường 100% ATK, +25 Energy.'},
    {name:'LAST SHIFT',cost:125,kind:'heal',mult:1.0,desc:'Bộ đếm đã tháo khỏi ngực nhưng Meridian vẫn đếm bằng miệng. Cô đứng thêm một ca nữa thay cả tổ: hồi 100% ATK cho mọi người.'},
    [ { id:'meridian-mom', tag:'CÁNH TƯ', name:'GIAO KÈO CÁNH CỬA THỨ TƯ', when:{ally:'muzzle'}, effect:{dmgTakenPct:-15}, desc:'Tình bạn keo sơn và lời hứa nhường tên cho cánh khiên tương lai cùng Muzzle giúp tăng cường mạnh mẽ khả năng giảm thiểu sát thương của bà.' },
      { id:'meridian-wall', tag:'TƯỜNG', name:'KÝ ỨC THỢ XÂY', when:{enemy:'foreman'}, effect:{dmgTakenPct:-15}, desc:'Từng tham gia đổ móng cho Lò Đúc của Tháp năm xưa, Meridian nắm rõ từng kết cấu của công trình này, giúp bà gia tăng sức chống chịu khi đối đầu với tên trùm Foreman.' } ]),
  mkChar('toll','TOLL','rust','S',155,850,125, {desc:'Đòn thường 100% ATK, +25 Energy, thêm 10% chí mạng.', critPct:10},
    {name:'PAID IN FULL',cost:125,kind:'nuke',mult:3.6,desc:'Toll đọc to dòng nợ trong sổ, đặt tờ hoá đơn xuống chân nó, rồi kết sổ một lần cho xong: 360% ATK lên một mục tiêu.'},
    [ { id:'toll-book', tag:'CÙNG SỔ', name:'MÓN NỢ CHƯA VƠI', when:{ally:'spark'}, effect:{atkPct:10}, desc:'Khi có Spark — cô bé có tên trong danh sách nạn nhân Tầng Bốn — đứng trong đội hình, ngòi bút của Toll càng thêm tàn nhẫn.' },
      { id:'toll-day17', tag:'NGÀY 17', name:'HÓA ĐƠN NGÀY MƯỜI BẢY', when:{enemy:'cantor'}, effect:{dmgPct:30}, desc:'Mối thù khắc cốt ghi tâm với kẻ chủ mưu Cantor biến mỗi đòn đánh của Toll lên tên trùm này thành những bản án tử hình.' } ]),
  mkChar('spark','SPARK','rust','A',125,950,75, {desc:'Đòn thường 100% ATK, +35 Energy.', energy:35},
    {name:'ARC FLASH',cost:75,kind:'aoe',mult:1.4,desc:'Spark xả cả dàn tụ trên lưng xuống nền: hồ quang chạy khắp sân, 140% ATK lên toàn bộ kẻ địch.'},
    [ { id:'spark-toll', tag:'CÙNG SỔ', name:'CHỖ DỰA VỮNG VÀNG', when:{ally:'toll'}, effect:{hpPct:15}, desc:'Được ông già Toll che chở trên chiến trường, Spark hoàn toàn yên tâm bện dây phóng điện, tăng cường đáng kể lượng máu tối đa.' },
      { id:'spark-cut', tag:'CẮT DÂY', name:'ĐOẢN MẠCH THÁP CAO', when:{enemyFaction:'chrome'}, effect:{dmgPct:12}, desc:'Cực kỳ am hiểu cấu trúc mạng điện của phe Chrome, các đòn phóng điện của Spark gây sát thương mạnh hơn hẳn lên lính thuộc biên chế tập đoàn.' } ]),
  mkChar('vixen','VIXEN','rust','A',135,900,100, {desc:'Đòn thường 100% ATK, +25 Energy, thêm 10% chí mạng.', critPct:10},
    {name:'HEIST',cost:100,kind:'control',desc:'Vixen tháo cái vòng bằng bộ đồ nghề mua của Wire và mượn tạm một kẻ địch: một lượt nó quay sang đánh đồng bọn.'},
    [ { id:'vixen-tools', tag:'ĐỒ NGHỀ', name:'CÔNG CỤ ĐẮC LỰC', when:{ally:'wire'}, effect:{energyStart:25}, desc:'Mang theo bộ đồ nghề do chính tay Wire tinh chỉnh, Vixen bước vào trận đánh với một lượng thanh năng lượng tuyệt kỹ được sạc sẵn.' },
      { id:'vixen-borrow', tag:'MƯỢN', name:'BẢN LĨNH TRỘM ĐÊM', when:{enemyFaction:'chrome'}, effect:{dmgPct:10}, desc:'Mười một lần qua mặt hệ thống an ninh Tháp giúp cô nắm rõ điểm yếu của các đơn vị phe Chrome, gia tăng đáng kể sát thương lên các mục tiêu này.' } ]),
  mkChar('junker','JUNKER','rust','B',75,1700,100, {desc:'Đòn thường 100% ATK, +30 Energy.', energy:30},
    {name:'FULL LOAD',cost:100,kind:'nuke',mult:2.6,desc:'Junker đạp ga, quay khung xe và đổ nguyên chuyến hàng xuống đầu một mục tiêu: 260% ATK.'},
    [ { id:'junker-weld', tag:'MỐI HÀN', name:'KHỚP NỐI STITCH', when:{ally:'stitch'}, effect:{hpPct:20}, desc:'Ơn cứu mạng và những mối hàn tinh vi của bác sĩ Stitch giúp Junker gia tăng tối đa lượng máu cơ bản.' },
      { id:'junker-floor4', tag:'TẦNG BỐN', name:'THÙ HẬN DƯỚI BÊ TÔNG', when:{enemy:'cantor'}, effect:{dmgPct:20}, desc:'Nửa thân thể vẫn còn bị chôn vùi tại Tầng Bốn khiến ngọn lửa căm hờn bùng cháy dữ dội mỗi khi Junker đối mặt với tên đồ tể Cantor.' } ]),
  mkChar('gravedigger','GRAVEDIGGER','rust','B',90,1500,125, {desc:'Đòn thường 100% ATK, +25 Energy, thêm 5% chí mạng.', critPct:5},
    {name:'LAST RITES',cost:125,kind:'nuke',mult:3.0,desc:'Ông đào chậm, đánh cũng chậm: một nhát xẻng bổ xuống, 300% ATK lên một mục tiêu. Xong việc ông khắc tên nó lên một tấm thép.'},
    [ { id:'grave-kai', tag:'HỐ', name:'HỐ NÔNG CHUỘC TỘI', when:{ally:'kai'}, effect:{dmgTakenPct:-12}, desc:'Mặc cảm vì từng suýt chôn nhầm Kai khiến ông lão luôn dán mắt bảo bọc cậu nhóc, tăng vọt khả năng phòng thủ khi Kai có mặt trên sân.' },
      { id:'grave-foreman', tag:'TẤM THÉP', name:'ĐÒI NỢ LÒ RÈN', when:{enemy:'foreman'}, effect:{dmgPct:15}, desc:'Nhìn hàng ngàn tấm bia sau lò đúc đều do tay chân của Foreman gây ra, nhát xẻng của Gravedigger gây thêm lượng sát thương lớn lên tên trùm này.' } ]),
].forEach(c=>{ const x=HERO_EXTRA[c.id]||{spd:100,crit:10}; c.spd=x.spd; c.crit=x.crit; if(x.ultFx) c.ult.fx=x.ultFx; ROSTER[c.id]=c; });

/* ---- Pose thêm cho đội mình (ảnh tĩnh, 11/09): thả '<id> normal/crit/die.png' vào art-src/HERO, chạy `python scratch/key_enemy.py art-src/HERO`,
   dán box vào đây. attack thay frame attack gốc, crit = đòn chí mạng, die = gục (giữ đến hết trận); idle/hurt gốc giữ nguyên.
   Video chỉ còn cho chiêu cuối. 5 người có sprite: Yuki/Kai/Psalm/Ash/Ronin đều đủ attack + crit + die.
   Riêng Ronin (11/09) cắt từ một bảng 4 pose nên cả 5 frame chung một hệ số; idle đang mượn frame đòn thường, chờ ảnh đứng. ---- */
const HERO_SPRITE = {
  yuki:{attack:{w:844,h:682,ax:422}, crit:{w:858,h:682,ax:429}, die:{w:744,h:682,ax:372}},
  kai:{attack:{w:744,h:682,ax:372}, crit:{w:744,h:682,ax:372}, die:{w:744,h:682,ax:372}},
  psalm:{attack:{w:852,h:682,ax:426}, crit:{w:899,h:682,ax:449}, die:{w:744,h:682,ax:372}},
  ash:{attack:{w:843,h:693,ax:421}, crit:{w:744,h:682,ax:372}, die:{w:744,h:682,ax:372}},
  ronin:{attack:{w:744,h:682,ax:372}, crit:{w:744,h:682,ax:372}, die:{w:744,h:682,ax:372}} };
Object.entries(HERO_SPRITE).forEach(([id,poses])=>{ const s=ROSTER[id]&&ROSTER[id].sprites; if(!s) return; s.box=s.box||{};
  for(const p in poses){ s[p]=['art/sprite/'+id+'_'+p+'.png']; s.box[p]=poses[p]; } });

/* ---- ★ FAKE: bể kẻ địch PvE. rank: grunt / elite / boss quyết định độ to trên sân. Chưa có art → silhouette ----
   ult (tuỳ chọn) = chiêu cuối của kẻ địch, cùng cấu trúc ult của ROSTER, thêm mấy thứ riêng:
     flat        = sát thương cố định, bỏ qua ATK / variance / chí mạng / passive (kind 'nuke')
     drainEnergy = rút Energy của người trúng đòn: true là rút sạch, số nguyên là rút đúng ngần ấy (kind 'nuke')
     kind 'shield' + shieldPct = lá chắn cho chính nó, hút shieldPct × HP tối đa của nó; không đếm lượt, hết mới thôi
     kind 'heal'   + healPct   = hồi cho đồng bọn thủng nhất; thêm healAll:true thì hồi cho mọi con còn sống
     kind 'aoe'    + mult      = đánh cả ba người bên mình một lượt (đứng tại chỗ, không lao tới ai)
   Con nào có ult thì energyMax = ult.cost và đầu mỗi lượt của nó cộng RULES.foeUltGain Energy; đủ cost là tung chiêu ngay lượt đó,
   thay cho đòn thường. Thanh Energy + nhãn READY hiện trên bảng unit như đội mình, để người chơi thấy trước và kịp dồn đòn giết nó.
   ultVideo = video holo chiếu trên đầu nó (giống đội mình); ultRatio = tỉ lệ khung video, thiếu thì lấy RULES.holo.ratio (16:9). ---- */
const ENEMY_POOL = [
  /* ---- Chín lính thường cũng có chiêu cuối từ 11/09 ----
     Cost 75 hết (3 lượt nạp) và hệ số rất thấp — lính thường ra sân 3 con một wave, wave nào cũng có, nên
     chiêu của chúng phải nhẹ hơn elite một bậc nữa. Tên chiêu lấy đúng bộ tên phiên cyberpunk-c1 đã đặt cho
     bản chiêu mộ (RECRUIT_ULT), để một con chỉ có MỘT cái tên dù đứng bên nào; số thì mỗi phe một thang. ---- */
  { id:'scav',       name:'SCAV',           faction:'rust',   rank:'grunt', atk:62,  hp:640,
    ult:{ name:'STRIP DOWN', cost:75, kind:'nuke', mult:1.4, fx:'hit',
          desc:'Scav không đánh, hắn tháo: nhè khớp nối mà giật ra: 140% ATK lên một người.' } },
  /* RIGGER — trùm băng Scav, boss màn 07-A (chốt 11/09). Trước đó là lính thường đứng trong wave của chính màn mình,
     nên phải thay hắn ra khỏi 07-A w1/w2 và 07-B w1 (xem SECTORS) — trùm không được làm lính. */
  { id:'rigger',     name:'RIGGER',         faction:'rust',   rank:'boss',  atk:92,  hp:1800,
    ult:{ name:'WINCH', cost:75, kind:'nuke', mult:2.2, fx:'shock', status:{kind:'stun',turns:1},   // 11/09: MÓC HÀNG → WINCH, cho cả bộ tên chiêu cùng một luật tiếng Anh
          desc:'Phóng móc xuyên giáp rồi siết tời: 220% ATK lên một người và quật xuống sàn, mất lượt kế tiếp.' } },
  { id:'straydog',   name:'CHÓ HOANG',      faction:'rust',   rank:'grunt', atk:70,  hp:560,
    ult:{ name:'RUN DOWN', cost:75, kind:'nuke', mult:1.2, fx:'poison', status:{kind:'poison', turns:2, pct:.2},
          desc:'Con chó vọt qua sân, ngoạm đúng bắp chân rồi giật đầu: 120% ATK, vết cắn mưng mủ thêm 2 lượt (20% ATK mỗi lượt).' } },
  { id:'welder',     name:'THỢ HÀN',        faction:'rust',   rank:'grunt', atk:66,  hp:780,
    /* Chiêu hồi máu đầu tiên của phe địch (11/09): vá cho đồng bọn thủng nhất, bằng healPct × HP tối đa của con đó.
       Trước 11/09 hắn chỉ gây cháy, ngược với dòng sổ bộ ("chuyên hồi phục giáp trụ cho đồng bọn") — giờ chữ và cơ chế khớp nhau.
       Đòn thường vẫn để lại cháy (FOE_SKILL) vì 07-A là chỗ người chơi gặp trạng thái lần đầu.
       cost 50 = 2 lượt nạp (như Glass Jaw): ở 75 thì sim cho thấy hắn gần như luôn chết trước khi kịp vá một lần
       (07-A 7.7 round có chiêu / 7.8 round bỏ chiêu — không khác gì nhau), nên hạ xuống cho chiêu thật sự xuất hiện. */
    ult:{ name:'PATCH JOB', cost:50, kind:'heal', healPct:.3, fx:'heal',
          desc:'Vá tạm cho đồng bọn thủng nhất: hồi 30% HP tối đa của con đó.' } },
  { id:'gutterrat',  name:'CHUỘT CỐNG',     faction:'rust',   rank:'grunt', atk:58,  hp:520,
    ult:{ name:'SWARM', cost:75, kind:'aoe', mult:.5, fx:'hit',
          desc:'Chuột Cống huýt một tiếng, cả ổ dưới nắp cống trào lên: 50% ATK lên cả ba người.' } },
  { id:'chopshop',   name:'CHOP SHOP',      faction:'rust',   rank:'grunt', atk:74,  hp:700,
    ult:{ name:'PART OUT', cost:75, kind:'nuke', mult:.7, hits:2, fx:'hit',
          desc:'Kìm banh khớp kẹp vào rồi mới bật ra: 70% ATK mỗi nhát, hai nhát liền trên cùng một người.' } },
  { id:'tinman',     name:'TIN MAN',        faction:'rust',   rank:'grunt', atk:60,  hp:900,
    ult:{ name:'BUTTON UP', cost:75, kind:'shield', shieldPct:.4, fx:'shield',
          desc:'Tin Man sập hết nắp giáp xuống rồi đứng im chịu đòn: lá chắn hút sát thương bằng 40% HP tối đa của mình, vỡ mới thôi.' } },
  { id:'slagger',    name:'SLAGGER',        faction:'rust',   rank:'grunt', atk:80,  hp:760,
    ult:{ name:'SLAG POUR', cost:75, kind:'aoe', mult:.45, fx:'burn', status:{kind:'burn', turns:2, pct:.15},
          desc:'Slagger nghiêng thùng xỉ nóng, đổ thành một vệt dài trước mặt: 45% ATK lên cả ba người và cháy thêm 2 lượt.' } },
  { id:'pipefitter', name:'THỢ ỐNG',        faction:'rust',   rank:'grunt', atk:64,  hp:840,
    /* Bản nhẹ của PATCH JOB (Thợ Hàn .3 ở cost 50): cùng nghề vá, nhưng vá bằng băng thép nên ít hơn. */
    ult:{ name:'PIPE PATCH', cost:75, kind:'heal', healPct:.18, fx:'heal',
          desc:'Thợ Ống quấn băng thép quanh chỗ thủng rồi siết cùm lại: đồng bọn thủng nhất hồi 18% HP tối đa của nó.' } },
  { id:'hollow',     name:'HOLLOW',         faction:'rust',   rank:'grunt', atk:68,  hp:660,
    /* flat = con số cố định, bỏ qua ATK/variance/chí mạng/độ khó sector — cùng cơ chế Glass Jaw, nhỏ hơn nhiều.
       Hợp với cái xác rỗng: nó không còn sức, nó chỉ xả nốt thứ trong lồng ngực, lần nào cũng đúng ngần ấy. */
    ult:{ name:'EMPTY OUT', cost:75, kind:'nuke', flat:90, fx:'shock',
          desc:'Hollow mở lồng ngực rỗng và trút nốt thứ còn lại trong đó: đúng 90 sát thương lên một người.' } },
  { id:'glassjaw',   name:'GLASS JAW',      faction:'rust',   rank:'grunt', atk:88,  hp:480,
    /* Sprite idle tĩnh lấy từ FOE_SPRITE bên dưới như mọi con. Sheet động (glassjaw_idle.webp) đã bỏ 11/09 theo yêu cầu
       ("idle animation xấu quá"): không con nào khai anim nữa, engine SHEET trong battle.js nằm im. */
    /* Chiêu cuối đầu tiên của phe địch. 200 là số cố định: không nhân ATK, không variance, không chí mạng,
       không đổi theo độ khó sector — trúng ai cũng đúng 200. Overlay điện giật (fx 'shock') nổ trên người bị đánh. */
    ult:{ name:'ELECTRIC DRAGON PUNCH', cost:50, kind:'nuke', flat:200, fx:'shock',
          desc:'Cú đấm điện hình đầu rồng: đúng 200 sát thương lên một người trong đội bạn.' },
    ultVideo:['video/glassjaw_ult.mp4','art-src/ENEMY/glassjaw ultimate.mp4'], ultRatio:3/4 },
  { id:'drone',      name:'DRONE MK1',      faction:'chrome', rank:'grunt', atk:72,  hp:600,
    /* Con thứ ba của phe Chrome biết rút Energy (Archon rút sạch, Enforcer rút 25, drone rút 10 của CẢ ĐỘI).
       Đây là chỗ người chơi gặp trò đó lần đầu ở 07-C, trước khi gặp Enforcer và Archon cùng màn. */
    ult:{ name:'STRAFE', cost:75, kind:'aoe', mult:.4, fx:'shock', drainEnergy:10,
          desc:'Drone leo cao rồi bổ nhào, quét một đường dọc sân và làm nhiễu luôn Halo: 40% ATK lên cả ba người, mỗi người mất 10 Energy.' } },
  /* ---- Bốn elite có chiêu cuối từ 11/09 (chưa có video → cut-in rơi về banner chữ, lấy câu đầu của desc) ----
     Số ở đây NHẸ hơn boss rất nhiều, và đó là cố ý. Elite đứng trong wave nhiều gấp mấy lần boss (Enforcer và
     Chrome Hound ra sân 5 lượt riêng ở 07-E), nên chiêu của chúng phải là "đòn thường có thêm một trò" chứ không
     phải cú đánh to. Bản đầu tiên (cost 50, hound 200%, drill 130%×2) kéo 07-C 76%→22%, 07-D 35%→3%, 07-E 29%→0%.
     Đã dò lại từng con, xem docs/plan-2026-09.md mục 11/09 chiều 32. ---- */
  { id:'bulwark',    name:'BULWARK',        faction:'rust',   rank:'elite', atk:48,  hp:1400,
    /* Lá chắn đắp cho CON KHÁC (to nhất còn sống) — ở 07-A wave 3 nghĩa là đắp cho Rigger. Số vẫn tính theo HP của
       Bulwark chứ không theo HP con được chắn, nên nó không phình lên theo boss. */
    ult:{ name:'SHIELD WALL', cost:75, kind:'shield', shieldPct:.4, shieldTarget:'biggest', fx:'shield',
          desc:'Bulwark đóng tấm thép đường xuống nền rồi lùi lại nửa bước, lấy thân che cho kẻ đứng sau. Con to nhất bên nó được lá chắn hút sát thương bằng 40% HP tối đa của Bulwark, vỡ mới thôi.' } },
  { id:'kiln',       name:'KILN',           faction:'rust',   rank:'elite', atk:95,  hp:1250,
    /* Lá chắn = 100% HP tối đa của chính Kiln (đã nhân độ khó sector), hút mọi sát thương trước khi vào HP.
       Không có hạn lượt: đánh vỡ mới thôi. Overlay khiên hiện bằng CSS (css/fx.css) — thả art/fx/shield.webp là thay. */
    ult:{ name:'FIRE STORM', cost:75, kind:'shield', shieldPct:1, fx:'burn',
          desc:'Bão lửa quấn quanh mình: dựng lá chắn hút sát thương bằng 100% HP tối đa của Kiln, bao giờ vỡ mới thôi.' },
    ultVideo:['video/kiln_ult.mp4','art-src/ENEMY/kiln ultimate.mp4'], ultRatio:3/4 },
  { id:'drillbit',   name:'DRILL-BIT',      faction:'rust',   rank:'elite', atk:105, hp:1100,
    ult:{ name:'BREACH', cost:100, kind:'nuke', mult:.8, hits:2, fx:'explode',
          desc:'Mũi khoan hạ xuống ngang tầm ngực rồi mới quay hết ga. Nó ăn vào hai nhịp liền: 80% ATK mỗi nhịp lên cùng một người, mỗi nhịp quay chí mạng riêng.' } },
  { id:'enforcer',   name:'ENFORCER',       faction:'chrome', rank:'elite', atk:100, hp:1300,
    /* Bản rút Energy nhẹ của FORCED RECALL: cùng một trò của phe Chrome, Archon rút sạch còn Enforcer rút 25
       (đúng một đòn thường nạp lại). Đứng ở 07-C và 07-E, tức người chơi gặp trò này trước khi gặp Archon. */
    ult:{ name:'SUPPRESSION', cost:75, kind:'nuke', mult:1, fx:'shock', drainEnergy:25,
          desc:'Dùi cui điện quật ngang vào vòng Halo chứ không nhắm vào người. Cú đó không cốt đau: 100% ATK, nhưng mục tiêu mất 25 Energy.' } },
  { id:'chromehound',name:'CHROME HOUND',   faction:'chrome', rank:'elite', atk:110, hp:1150,
    /* Chiêu duy nhất trong game KHÔNG đánh ngẫu nhiên. Chrome Hound lại là con nhanh nhất sân (SPD 116, hơn Yuki 112)
       nên thanh Energy của nó là đồng hồ đếm ngược: hồi máu người sắp chết trước khi nó đầy, hoặc giết nó trước. */
    ult:{ name:'CULL', cost:100, kind:'nuke', mult:1.5, fx:'shock', target:'lowest',
          desc:'Con chó không lao vào người gần nhất. Nó chạy thẳng tới người đang yếu nhất trong đội: 150% ATK lên mục tiêu có HP thấp nhất.' } },
  /* Bốn boss còn lại của chương 1 — chiêu cuối + video cắm ngày 11/09. Video 854×480, tức 16:9 như đội mình,
     nên KHÔNG khai ultRatio (chỉ Glass Jaw và Kiln quay dọc 3:4 mới cần). Mỗi con một kiểu, không con nào trùng con nào:
     Foreman đốt · Archon rút Energy · Mother Rust hồi cả phe · Cantor đánh cả đội. */
  { id:'foreman',    name:'FOREMAN',        faction:'rust',   rank:'boss',  atk:125, hp:2600,
    ult:{ name:'SMELT', cost:75, kind:'nuke', mult:2, fx:'burn', status:{kind:'burn', turns:2, pct:.25},
          desc:'Càng thuỷ lực kẹp ngang người rồi nhấc bổng lên khỏi sàn. Foreman dí thẳng vào miệng lò: 200% ATK lên một người, cháy thêm 2 lượt (25% ATK mỗi lượt).' },
    ultVideo:['video/foreman_ult.mp4','art-src/ENEMY/foreman ultimate.mp4'] },
  { id:'motherrust', name:'MOTHER RUST',    faction:'rust',   rank:'boss',  atk:140, hp:3000,
    /* Boss hỗ trợ duy nhất của chương 1: không đánh mà vá cả đám, nên wave 07-D (Slagger + Drill-Bit đứng cạnh)
       buộc người chơi giết bà trước. Đòn thường của bà đã là độc rồi nên chiêu cuối không đánh nữa.
       12% là số đã dò bằng sim (400 trận/mức): bà tự vá cho mình nữa nên % nào cũng nhân vào cái bể 3540 HP —
       25% kéo 07-D từ 45% thắng xuống 6%, 15% xuống 29%, 12% còn 39%. Bỏ phần tự vá thì ngược lại, chiêu thành
       có hại cho chính phe địch (bà mất lượt đánh, 07-D lên 62%) nên không làm thế. */
    ult:{ name:'BENEDICTION', cost:100, kind:'heal', healPct:.12, healAll:true, fx:'heal',
          desc:'Bà mở hai tay, vòng ống sau đầu nóng đỏ lên. Phép lành rơi xuống cả đám: mỗi con còn sống hồi 12% HP tối đa của nó.' },
    ultVideo:['video/motherrust_ult.mp4','art-src/ENEMY/motherrust ultimate.mp4'] },
  { id:'archon',     name:'ARCHON',         faction:'chrome', rank:'boss',  atk:150, hp:2800,
    /* drainEnergy:true = rút sạch Energy của mục tiêu (số nguyên thì rút đúng ngần ấy). Sát thương để thấp vì
       phần đau nằm ở chỗ mất chiêu cuối, không phải ở máu. */
    ult:{ name:'FORCED RECALL', cost:75, kind:'nuke', mult:1.5, fx:'shock', drainEnergy:true,
          desc:'Thấu kính giữa ngực sáng lên rồi bắn thẳng một luồng tím dọc mặt đường. Luồng đó không để giết, nó để thu hồi: 150% ATK và mục tiêu mất sạch Energy.' },
    ultVideo:['video/archon_ult.mp4','art-src/ENEMY/archon ultimate.mp4'] },
  { id:'cantor',     name:'CANTOR',         faction:'chrome', rank:'boss',  atk:160, hp:3400,   // boss cuối chương 1
    /* kind 'aoe' phía địch = đánh cả ba người. Số dò bằng sim, 07-E gốc 57% thắng: 120% ATK cost 100 kéo xuống 14%,
       120%/cost 125 xuống 20%, 100%/cost 125 còn 33%. Chốt 100% ATK + cost 125 — 5 lượt nạp là quãng đếm ngược
       dài nhất trong game, người chơi nhìn thanh Energy của ông đầy dần mà chạy đua. 33% là trận khó nhất chương 1,
       cố ý; hạ thêm thì chỉnh SECTORS['07-E'].mult chứ đừng đụng vào chiêu. */
    ult:{ name:'DELETION ORDER', cost:125, kind:'aoe', mult:1, fx:'shock',
          desc:'Cantor không cầm vũ khí, cũng không bước tới. Ông ra lệnh và cả dãy đèn trên cao quét xuống một lượt: 100% ATK lên cả ba người.' },
    ultVideo:['video/cantor_ult.mp4','art-src/ENEMY/cantor ultimate.mp4'] },
  // ---- Dự trữ cho chương 2–3 (passive có thể tham chiếu). link: HALO LINK — đầu lượt hồi 8% HP nếu còn unit link khác sống
  { id:'seraph',     name:'SERAPH DRONE',   faction:'chrome', rank:'grunt', atk:90,  hp:700,  link:true },
  { id:'chorister',  name:'CHORISTER',      faction:'chrome', rank:'grunt', atk:95,  hp:760,  link:true },
  { id:'warden',     name:'WARDEN',         faction:'chrome', rank:'elite', atk:125, hp:1500, link:true },
  { id:'enfprime',   name:'ENFORCER PRIME', faction:'chrome', rank:'boss',  atk:170, hp:3600 },
  { id:'vesper_b',   name:'VESPER',         faction:'chrome', rank:'boss',  atk:165, hp:3200, lore:'vesper' },
  { id:'echo_b',     name:'ECHO',           faction:'chrome', rank:'boss',  atk:150, hp:2900, lore:'echo' },
  { id:'confessor2', name:'CONFESSOR MK-II',faction:'chrome', rank:'boss',  atk:175, hp:3800 },
  { id:'cantor2',    name:'CANTOR ASCENDANT',faction:'chrome', rank:'boss', atk:200, hp:4600 },
  { id:'cantor_g',   name:'CANTOR GUARD',   faction:'chrome', rank:'grunt', atk:110, hp:900,  link:true },
  { id:'exorcist',   name:'EXORCIST',       faction:'chrome', rank:'elite', atk:140, hp:1800, link:true },
  { id:'precentor',  name:'PRECENTOR',      faction:'chrome', rank:'boss',  atk:210, hp:5000 },
  { id:'organist',   name:'ORGANIST',       faction:'chrome', rank:'boss',  atk:220, hp:5200, link:true },
  { id:'forgemaster',name:'FORGEMASTER',    faction:'chrome', rank:'boss',  atk:230, hp:5400 },
  { id:'silence',    name:'SILENCE',        faction:'chrome', rank:'boss',  atk:240, hp:5600 },
  { id:'canticle',   name:'THE CANTICLE',   faction:'chrome', rank:'boss',  atk:300, hp:8000, link:true },
  /* PHẾ PHẨM — lính đã bị RÚT (năng lực bị lấy ghép sang đơn vị khác), còn đi được nhưng rỗng. Chậm, dai, đánh yếu.
     Cố ý KHÔNG có link: đã bị cắt khỏi hệ thống nên không được hồi máu. ★ Hành vi chưa cài: đứng yên tới khi bị đánh. */
  { id:'husk',       name:'PHẾ PHẨM',       faction:'chrome', rank:'grunt', atk:55,  hp:900  },
];
/* ---- Art thẻ kẻ địch: art/card/<id>.png (768×1360, có nền, không tách nền) ----
   Hiện ở: thanh lượt trong trận, chân dung người nói trong comic, bestiary ở kit.html, dòng passive trong ARCHIVE.
   Đủ 21 con chương 1; địch chương 2–3 chưa có ảnh → vẫn silhouette. Thêm con mới: thả file vào art/card/ rồi
   thêm id vào FOE_ART (và FOE_POS nếu đầu nhân vật không nằm ở khoảng 15–20% chiều cao ảnh).
   FOE_POS = object-position của chân dung; mặc định '50% 8%' (portraitEl) hợp với người đứng thẳng. */
const FOE_POS = { gutterrat:'50% 18%', straydog:'62% 30%', chromehound:'40% 24%', drone:'50% 26%', bulwark:'45% 16%' };
const FOE_ART = ['scav','rigger','straydog','welder','gutterrat','chopshop','tinman','slagger','pipefitter','hollow','glassjaw',
                 'drone','bulwark','kiln','drillbit','enforcer','chromehound','foreman','motherrust','archon','cantor'];
FOE_ART.forEach(id=>{ const e=ENEMY_POOL.find(x=>x.id===id); if(!e) return; e.portrait=['art/card/'+id+'.png']; if(FOE_POS[id]) e.pos=FOE_POS[id]; });

/* ---- Tốc độ + chí mạng kẻ địch: [spd, crit%] ★ FAKE. Chó/drone/Glass Jaw nhanh hơn Yuki (112) để dạy "SPD quyết định ai ra đòn trước";
   giáp (Tin Man, Bulwark) chậm; boss ≤ 100 để đội mình vẫn được đi trước boss. Thiếu id → [90, 5]. ---- */
/* ---- Sprite idle tĩnh của kẻ địch: art/sprite/<id>_idle.png — tách nền bằng scratch/key_enemy.py từ ảnh nền xanh trong art-src/ENEMY/
   (hộp cao 682 như đồng minh, chân chạm đáy, ax = giữa hai bàn chân; grunt cao 86%, elite 94%, boss 100% hộp; chó/drone thấp hơn).
   Ảnh gốc nhìn sang phải → setFrame() tự lật cho phe địch (face mặc định 'right'). Đủ 21 con chương 1 (11/09).
   Thêm con mới: thả <id>.png nền xanh vào art-src/ENEMY/, chạy `python scratch/key_enemy.py art-src/ENEMY --only <id>`, dán box in ra vào đây.
   Tư thế thêm: đặt `<id> attack.png` / `<id> crit.png` (frame tĩnh cắt từ video, chạy script với --ref = frame đứng cùng video) →
   giá trị thành {idle, attack, crit}. Video chỉ còn dùng cho chiêu cuối (ultVideo), không dùng cho sprite. ---- */
const FOE_SPRITE = {
  scav:{idle:{w:744,h:682,ax:372}, attack:{w:954,h:682,ax:477}, crit:{w:744,h:705,ax:372}, hurt:{w:744,h:682,ax:372}, die:{w:744,h:682,ax:372}},
  rigger:{idle:{w:744,h:682,ax:372}, attack:{w:744,h:682,ax:372}, crit:{w:744,h:682,ax:372}, hurt:{w:744,h:682,ax:372}, die:{w:744,h:682,ax:372}},
  straydog:{idle:{w:744,h:682,ax:372}, attack:{w:896,h:682,ax:448}, crit:{w:840,h:682,ax:420}, hurt:{w:753,h:682,ax:376}, die:{w:831,h:682,ax:415}},
  welder:{idle:{w:744,h:682,ax:372}, attack:{w:766,h:682,ax:383}, crit:{w:744,h:682,ax:372}, hurt:{w:744,h:682,ax:372}, die:{w:744,h:682,ax:372}},
  gutterrat:{idle:{w:744,h:682,ax:372}, attack:{w:990,h:682,ax:495}, crit:{w:744,h:682,ax:372}, hurt:{w:744,h:682,ax:372}},
  chopshop:{idle:{w:744,h:682,ax:372}, attack:{w:813,h:682,ax:406}, crit:{w:836,h:682,ax:418}, hurt:{w:744,h:682,ax:372}, die:{w:744,h:682,ax:372}},
  tinman:{idle:{w:744,h:682,ax:372}, attack:{w:744,h:682,ax:372}, crit:{w:744,h:682,ax:372}, hurt:{w:744,h:682,ax:372}, die:{w:766,h:682,ax:383}},
  slagger:{idle:{w:744,h:682,ax:372}, attack:{w:755,h:682,ax:377}, crit:{w:744,h:682,ax:372}, hurt:{w:744,h:682,ax:372}, die:{w:873,h:682,ax:436}},
  pipefitter:{idle:{w:744,h:682,ax:372}, attack:{w:744,h:682,ax:372}, crit:{w:744,h:682,ax:372}, hurt:{w:744,h:682,ax:372}, die:{w:744,h:682,ax:372}},
  hollow:{idle:{w:744,h:682,ax:372}, attack:{w:744,h:682,ax:372}, crit:{w:744,h:682,ax:372}, hurt:{w:744,h:682,ax:372}, die:{w:744,h:682,ax:372}},
  glassjaw:{idle:{w:744,h:682,ax:372}, attack:{w:744,h:682,ax:372}, crit:{w:744,h:682,ax:372}, hurt:{w:744,h:682,ax:372}, die:{w:744,h:682,ax:372}},
  drone:{idle:{w:744,h:682,ax:372}, attack:{w:744,h:682,ax:372}, crit:{w:744,h:682,ax:372}, hurt:{w:744,h:682,ax:372}, die:{w:744,h:682,ax:372}},
  bulwark:{idle:{w:744,h:682,ax:372}, attack:{w:796,h:682,ax:398}, crit:{w:744,h:729,ax:372}, hurt:{w:744,h:682,ax:372}, die:{w:744,h:682,ax:372}},
  kiln:{idle:{w:744,h:682,ax:372}, attack:{w:744,h:682,ax:372}, crit:{w:744,h:682,ax:372}, hurt:{w:744,h:682,ax:372}, die:{w:744,h:682,ax:372}},
  drillbit:{idle:{w:744,h:682,ax:372}, attack:{w:1512,h:682,ax:756}, crit:{w:744,h:682,ax:372}, hurt:{w:744,h:682,ax:372}, die:{w:744,h:682,ax:372}},
  enforcer:{idle:{w:744,h:682,ax:372}, attack:{w:752,h:682,ax:376}, crit:{w:744,h:682,ax:372}, die:{w:744,h:682,ax:372}},
  chromehound:{idle:{w:744,h:682,ax:372}, attack:{w:744,h:682,ax:372}, crit:{w:744,h:682,ax:372}, hurt:{w:744,h:682,ax:372}, die:{w:744,h:682,ax:372}},
  foreman:{idle:{w:744,h:682,ax:372}, attack:{w:772,h:682,ax:386}, crit:{w:744,h:682,ax:372}, hurt:{w:744,h:682,ax:372}, die:{w:744,h:682,ax:372}},
  motherrust:{idle:{w:744,h:682,ax:372}, attack:{w:744,h:682,ax:372}, crit:{w:744,h:682,ax:372}, hurt:{w:744,h:682,ax:372}, die:{w:857,h:682,ax:428}},
  archon:{idle:{w:744,h:682,ax:372}, attack:{w:787,h:682,ax:393}, crit:{w:1047,h:682,ax:523}, die:{w:744,h:682,ax:372}},
  cantor:{idle:{w:744,h:682,ax:372}, attack:{w:744,h:682,ax:372}, crit:{w:744,h:682,ax:372}, die:{w:744,h:682,ax:372}} };
/* Giá trị = box của idle, hoặc {idle, attack, crit, hurt, die} khi con đó có thêm tư thế: attack/crit = ảnh tĩnh đòn thường / đòn chí mạng,
   die = tư thế gục giữ đến hết trận. Thiếu pose nào engine tự rơi về pose gần nhất (crit→attack→idle, die→hurt). Bảng sinh từ scratch/foe_boxes.json. */
ENEMY_POOL.forEach(e=>{ const b=FOE_SPRITE[e.id]; if(!b) return; const poses=b.idle?b:{idle:b}; e.sprites={box:{}};
  for(const p in poses){ e.sprites[p]=['art/sprite/'+e.id+'_'+p+'.png']; e.sprites.box[p]=poses[p]; } });

const FOE_STATS = {
  scav:[92,5], rigger:[88,8], straydog:[110,8], welder:[84,5], gutterrat:[104,5], chopshop:[90,8], tinman:[66,3], slagger:[82,6],
  pipefitter:[86,5], hollow:[94,5], glassjaw:[118,25], drone:[108,8], bulwark:[60,3], kiln:[78,6], drillbit:[96,12], enforcer:[90,8],
  chromehound:[116,15], foreman:[84,10], motherrust:[80,10], archon:[98,12], cantor:[100,15],
  seraph:[112,10], chorister:[100,8], warden:[94,10], enfprime:[96,12], vesper_b:[110,15], echo_b:[104,12], confessor2:[90,12], cantor2:[102,15],
  cantor_g:[96,8], exorcist:[98,12], precentor:[100,15], organist:[92,12], forgemaster:[86,12], silence:[108,18], canticle:[110,20],
  husk:[64,0] };
/* ---- Đòn của kẻ địch (gán vào e.skill): fx lúc trúng + trạng thái kèm theo (chance = xác suất mỗi đòn) ★ FAKE.
   00-T để trơn (không trạng thái) cho tutorial dễ đọc; thợ hàn ở 07-A là trạng thái đầu tiên người chơi gặp (cháy). ---- */
const FOE_SKILL = {
  welder:     { fx:'burn',   status:{kind:'burn',   turns:2, pct:.25, chance:.5} },
  slagger:    { fx:'burn',   status:{kind:'burn',   turns:2, pct:.25, chance:.4} },
  kiln:       { fx:'burn',   status:{kind:'burn',   turns:2, pct:.3,  chance:.7} },
  drone:      { fx:'shock' },
  enforcer:   { fx:'shock' },
  chromehound:{ fx:'shock',  status:{kind:'stun',   turns:1, chance:.2} },
  bulwark:    {              status:{kind:'stun',   turns:1, chance:.3} },
  foreman:    {              status:{kind:'stun',   turns:1, chance:.3} },
  motherrust: { fx:'poison', status:{kind:'poison', turns:2, pct:.3,  chance:.6} },
  archon:     { fx:'shock',  status:{kind:'stun',   turns:1, chance:.3} },
  cantor:     { fx:'shock',  status:{kind:'stun',   turns:1, chance:.3} },
  seraph:{fx:'shock'}, warden:{fx:'shock',status:{kind:'stun',turns:1,chance:.25}}, enfprime:{fx:'shock',status:{kind:'stun',turns:1,chance:.3}},
  echo_b:{fx:'shock'}, cantor2:{fx:'shock',status:{kind:'stun',turns:1,chance:.3}}, exorcist:{fx:'shock'},
  forgemaster:{fx:'burn',status:{kind:'burn',turns:2,pct:.3,chance:.6}}, canticle:{fx:'shock',status:{kind:'stun',turns:1,chance:.35}} };
ENEMY_POOL.forEach(e=>{ const st=FOE_STATS[e.id]||[90,5]; e.spd=st[0]; e.crit=st[1]; if(FOE_SKILL[e.id]) e.skill=FOE_SKILL[e.id];   // → e.skill như đòn thường của đội mình
                        if(e.ult) e.energyMax=e.ult.cost; });                                                                      // địch có chiêu cuối: thanh Energy đầy đúng bằng cost

/* Người nói trong comic/COMMS: id trong ROSTER hoặc ENEMY_POOL (địch có lore → dùng chân dung nhân vật đó) */
function speakerDef(id){ if(!id) return null; const e=ENEMY_POOL.find(x=>x.id===id); return ROSTER[id] || (e&&e.lore&&ROSTER[e.lore]) || e; }

/* =====================================================================
   CHIẾN DỊCH PVE — xem docs/story.md. Mỗi sector: plan = wave thiết kế tay (id trong ENEMY_POOL), mult = hệ số
   ATK/HP kẻ địch, reward = thưởng lần đầu, rec = ATK trung bình gợi ý mỗi nhân vật. bg: ảnh nền + zoom/dim đo tay.
   team: ép đội ra trận (tutorial) · guest: đi cùng dù chưa sở hữu, thế một slot (ưu tiên người trong guestSwap, không thì slot cuối
   không phải Yuki vì comic và passive cần cô) · unlock: gia nhập khi clear lần đầu ·
   hints: gợi ý hiện trong trận (một lần mỗi hồ sơ). Tiến trình lưu trong PLAYER.cleared. ★ số liệu là bản nháp.
   ===================================================================== */
const CHAPTERS = [
  { n:0, title:'DROP',       sub:'BÃI RƠI · TUTORIAL',      sectors:['00-T'] },
  { n:1, title:'CHROMEFALL', sub:'KHU ĐÁY · DISTRICT 07',   sectors:['07-A','07-B','07-C','07-D','07-E'] },
  { n:2, title:'SPIRE',      sub:'THÁP · DISTRICT 04',      sectors:[], soon:true },
  { n:3, title:'CHOIR',      sub:'CANTICLE · DISTRICT 01',  sectors:[], soon:true },
];
const SECTORS = [
  /* mult = hệ số nhân ATK/HP của mọi kẻ địch trong sector. 11/09: 07-C 1.05→1.02 · 07-D 1.18→1.17 · 07-E 1.10→1.07
     để bù cho chiêu cuối mới của 4 elite (Bulwark/Drill-Bit/Enforcer/Chrome Hound) — không phải để làm màn dễ đi.
     Đo bằng scratch/sim.js 500 trận: trước khi có chiêu elite 76/35/29%, sau khi hạ mult 77/36/26%. */
  // bgZoom: ảnh neo đáy sân, phóng theo chiều cao (1.3 = cao bằng 130% sân) để đường chân trời (bgHorizon = % từ mép trên ảnh)
  // lên trên chân hàng sau. Ảnh 3:4 (1536×2048; 07-D/07-E cắt từ bản 21:9 nên 1008×1344 — xem art-src/BG/*_wide.png).
  { id:'00-T', name:'BÃI RƠI', tag:'Tutorial · Yuki tỉnh dậy', waves:2, mult:.6, rec:60, reward:{shards:40, credits:400}, team:['yuki'],
    plan:[['scav','gutterrat'],['straydog','scav','gutterrat']],
    hints:[
      { when:'firstTurn',  text:'Đến lượt Yuki. Bấm ATTACK, rồi chạm vào kẻ địch muốn đánh. Mỗi đòn thường cho +25 Energy.' },
      { when:'targetMode', text:'Đang chọn mục tiêu. Chạm vào một kẻ địch để đánh. Bấm HUỶ hoặc phím Esc để đổi ý.' },
      { when:'energyFull', text:'Energy đầy: nút chiêu cuối sáng lên. Chiêu ZERO gây 320% ATK, giết được thì hoàn 50 Energy.' },
      { when:'wave',       text:'Wave mới: kẻ địch thay mới, đội mình giữ nguyên HP và Energy, được hồi 30% HP để lấy hơi.' },
    ],
    bg:['art/bg/bg_07a.jpg','art/bg/bg_battle.jpg'], bgZoom:1.33, bgHorizon:.54, bgDim:.12 },
  { id:'07-A', name:'CỔNG BÃI XE', tag:'Việc thử của Ronin · băng Scav', waves:3, mult:.8, rec:100, reward:{shards:75, credits:1000}, boss:'rigger',
    plan:[['scav','welder','chopshop'],['straydog','chopshop','welder'],['bulwark','rigger','scav']],   // wave boss: Bulwark đứng chắn trước Rigger
    hints:[ { when:'firstTurn', text:'Đội 3 người, mỗi người một lượt. Chiêu FLASHOVER của Ash đánh toàn bộ kẻ địch, không cần chọn mục tiêu.' } ],
    bg:['art/bg/bg_07a.jpg','art/bg/bg_battle.jpg'], bgZoom:1.33, bgHorizon:.54, bgDim:.12 },
  { id:'07-B', name:'LÒ ĐÚC', tag:'Băng Foreman', waves:3, mult:.95, rec:120, reward:{shards:90, credits:1200}, boss:'foreman',
    plan:[['welder','slagger','pipefitter'],['tinman','kiln','welder'],['chopshop','foreman','hollow']],
    bg:['art/bg/bg_07b.jpg','art/bg/bg_battle.jpg'], bgZoom:1.35, bgHorizon:.55, bgDim:.1 },
  { id:'07-C', name:'HÀNG RÀO TẬP ĐOÀN', tag:'Canticle xuống thu hồi', waves:3, mult:1.02, rec:140, reward:{shards:120, credits:1600}, boss:'archon', guest:['psalm'], guestSwap:['kai'], unlock:'psalm',   // Kai "ở lại giữ đường lui" theo comic
    plan:[['drone','glassjaw','drone'],['enforcer','drone','chromehound'],['drone','archon','enforcer']],
    bg:['art/bg/bg_07c.jpg','art/bg/bg_battle.jpg'], bgZoom:1.22, bgHorizon:.48, bgDim:.42 },
  { id:'07-D', name:'NHÀ THỜ DƯỚI CỐNG', tag:'Giáo phái Mother Rust', waves:3, mult:1.17, rec:160, reward:{shards:150, credits:2000}, boss:'motherrust',
    plan:[['hollow','gutterrat','hollow'],['drillbit','hollow','kiln'],['slagger','motherrust','drillbit']],
    bg:['art/bg/bg_07d.jpg','art/bg/bg_07b.jpg','art/bg/bg_battle.jpg'], bgZoom:1.35, bgHorizon:.54, bgDim:.12 },
  { id:'07-E', name:'THANG MÁY HÀNG', tag:'Cantor tự xuống', waves:4, mult:1.07, rec:185, reward:{shards:240, credits:3000}, boss:'cantor',
    plan:[['drone','chromehound','drone'],['enforcer','drone','drone'],['drone','chromehound','enforcer'],['drone','cantor','enforcer']],
    bg:['art/bg/bg_07e.jpg','art/bg/bg_07c.jpg','art/bg/bg_battle.jpg'], bgZoom:1.55, bgHorizon:.60, bgDim:.28 },   // lan can = chân trời, phải nằm trên chân hàng sau (46%) → zoom cao hơn các màn khác
];
/* =====================================================================
   CHIÊU MỘ — kẻ địch chương 1 thành đơn vị chơi được (11/09)
   Bể = mọi con có mặt trong SECTORS[].plan của chương 1, trừ RECRUIT_SKIP. Mỗi con dựng một BẢN SAO
   nạp thẳng vào ROSTER, nên squad, ARCHIVE, gacha, battleTeam, spriteSrc dùng được ngay mà không phải sửa gì.
   Bản sao — KHÔNG bao giờ sửa def gốc trong ENEMY_POOL: wave của 6 màn chương 1 phải giữ nguyên cân bằng.
   Vì thế lính thường KHÔNG được thêm ult vào ENEMY_POOL; chiêu của chúng chỉ sống trên bản chiêu mộ.

   Quy đổi chỉ số: địch được cân để đứng BÊN KIA sân (lính máu mỏng, boss máu dày 2.600–3.400) nên kéo về
   băng của đội mình thì lính phải dày lên, boss phải mỏng đi rất nhiều. Bảng số dò bằng scratch/recruit_table.js
   (`node scratch/recruit_table.js` in chỉ số sau quy đổi cạnh băng của nhân vật cùng bậc) — sửa số thì chạy lại.
   Bỏ `rank`: rank chỉ để xếp chỗ đứng phe địch (renderSide đẩy boss lùi vào trong, to lên 1.28×); bên mình
   đã có FORMATION riêng nên giữ rank lại sẽ đẩy boss đi nhầm hướng. Giữ ở foeRank cho ai cần tra.
   ===================================================================== */
const RECRUIT_SKIP = ['cantor'];                            // trùm cuối chương 1, còn sống sang chương 2–3 → không chiêu mộ
const RECRUIT_BAND = { grunt:{tier:'B', atk:1.15, hp:1.9,  en:75},
                       elite:{tier:'A', atk:1.15, hp:.82,  en:100},
                       boss: {tier:'S', atk:.95,  hp:.34,  en:125} };
/* Chỉnh tay cho con rơi ra ngoài băng — lý do từng con ghi ở scratch/recruit_table.js */
/* `ult` = vá đè lên chiêu cuối của def gốc (giữ tên, mô tả, fx; chỉ đổi số). Cần vì chiêu của kẻ địch và
   chiêu của phe mình KHÔNG cùng thang giá trị: địch nạp RULES.foeUltGain Energy mỗi lượt miễn phí nên tung
   lại sau ~3 lượt mãi mãi, còn phe mình phải đánh thường để tích đủ một bình. Cùng một con số thì về tay
   người chơi yếu đi rất nhiều. Thước đo: **tổng %ATK trên mỗi 100 Energy**, nhân vật nằm trong khoảng
   2.40 (Kai, bậc B thấp nhất) – 3.20 (Yuki). Bốn chiêu elite khi thừa hưởng nguyên xi chỉ đạt 1.33–1.60. */
/* ĐỔI SỐ THÌ PHẢI ĐỔI CHỮ. `ult` vá đè lên object của def gốc, nên `desc` của bản địch đi theo nguyên vẹn
   trong khi số đã khác — chuỗi đó hiện ở hai chỗ người chơi đọc: tab KỸ NĂNG trong ARCHIVE và dòng dưới nút
   chiêu cuối trong trận. Mọi dòng `ult` ở đây BẮT BUỘC kèm `desc` viết lại. Kiểm bằng `node scratch/ult_lint.js`.
   Hai chỗ còn phải đổi hướng câu khi đổi phe: chiêu của địch nói "trong đội" là nói về đội NGƯỜI CHƠI,
   bản chiêu mộ phải đổi thành "kẻ địch"; "bên nó" phải thành "đồng đội". */
const RECRUIT_FIX = {
  bulwark:{tier:'B', atk:78, hp:1600, en:75,                        // khiên thuần: ATK thấp nhất bể, đổi lại HP cao nhất
    ult:{ shieldPct:.7,                                             // .4 của bản địch quá mỏng cho một bình đầy; .7 × 1600 HP của Bulwark ≈ Kiln tự chắn
          desc:'Bulwark đóng tấm thép đường xuống nền rồi lùi lại nửa bước, lấy thân che cho người sau lưng: đồng đội có HP tối đa lớn nhất nhận lá chắn bằng 70% HP tối đa của BULWARK, đánh vỡ mới thôi.' }},
  /* Không khai `en` ở đây: WINCH cost 75, đặt en:100 là thanh vẽ 4 vạch mà chiêu bật ở vạch 3.
     Bỏ trống thì energyMax tự lấy ult.cost — đúng luật của mọi đơn vị khác. */
  rigger:{tier:'A', atk:118, hp:1150},                              // trùm yếu nhất chương, để bậc S thì thua mọi S khác
  /* Hai con dưới đây SỐ không đổi, chỉ đổi hướng câu: bản địch viết theo phía bên kia sân
     ("đồng bọn", "trong đội bạn"), về tay người chơi thì hai cụm đó nói ngược. */
  welder:{ en:75, ult:{ cost:75,                                    // cost 50 của bản địch lệch với thanh 75 → nâng cho khớp, và bớt spam khi về tay người chơi
    desc:'Thợ Hàn vá tạm cho đồng đội thủng nhất: hồi 30% HP tối đa của người đó.' }},
  glassjaw:{ ult:{ desc:'Cú đấm điện hình đầu rồng: đúng 200 sát thương lên một kẻ địch. Con số cố định — không nhân ATK, không chí mạng, không đổi theo độ khó màn.' }},

  /* ---- 9 lính thường (11/09) ---- Số phía địch nằm ở 1.60–1.87 /100EN cho nuke và 0.53–0.67 cho aoe,
     trong khi băng phe mình là 2.40–2.93 và 1.80–1.87. Kéo lên cho khớp; tên và cơ chế giữ nguyên của
     ENEMY_POOL để một con chỉ có một cái tên dù đứng bên nào. */
  scav:{ ult:{ mult:2,                                              // 2.67/100EN — nuke trơn không có gì kèm nên được đứng đầu băng B
    desc:'Scav không đánh, hắn tháo: nhè khớp nối mà giật, 200% ATK lên một kẻ địch.' }},
  straydog:{ ult:{ mult:1.8, status:{kind:'poison',turns:2,pct:.2}, // 2.40/100EN + độc, thấp hơn Scav vì có đòn kèm
    desc:'Con chó vọt qua sân, ngoạm đúng bắp chân rồi giật đầu: 180% ATK lên một kẻ địch, vết cắn mưng mủ thêm 2 lượt.' }},
  gutterrat:{ hp:1150, ult:{ mult:1.35,                             // 1.80/100EN — ngang Vesper, aoe trả /100EN thấp hơn nuke vì quét cả sân
    desc:'Chuột Cống huýt một tiếng, cả ổ dưới nắp cống trào lên: 135% ATK lên toàn bộ kẻ địch.' }},
  chopshop:{ ult:{ mult:.95,                                        // ×2 nhịp = 190% tổng, 2.53/100EN; hai lần quay chí mạng là phần thưởng thêm
    desc:'Chop Shop kê mục tiêu lên giá đỡ rồi mở hộp đồ nghề, ăn vào hai nhịp liền: 95% ATK mỗi nhịp, nhịp nào cũng có thể ra chí mạng riêng.' }},
  tinman:{ ult:{ shieldPct:.65,                                     // .65 × 1710 HP = 1112, ngang Kiln tự chắn 1025; để 1.0 thì dày hơn mọi lá chắn khác
    desc:'Tin Man sập hết nắp giáp xuống, đứng im chịu đòn: dựng lá chắn cho chính mình bằng 65% HP tối đa của mình, đánh vỡ mới thôi.' }},
  slagger:{ ult:{ mult:1.2, status:{kind:'burn',turns:2,pct:.2},    // 1.60/100EN + cháy
    desc:'Slagger nghiêng thùng xỉ nóng đổ thành một vệt dài: 120% ATK lên toàn bộ kẻ địch, cháy thêm 2 lượt.' }},
  pipefitter:{ ult:{ healPct:.3,                                    // ngang Thợ Hàn; .18 của bản địch quá mỏng cho một bình đầy
    desc:'Thợ Ống quấn băng thép quanh chỗ thủng rồi siết cùm lại: hồi 30% HP tối đa cho đồng đội thủng nhất.' }},
  /* hollow: bản địch dùng flat 90 — số CỨNG, không lên theo ATK, nên về tay người chơi thì càng đánh màn sau
     càng vô dụng. Đổi sang mult và PHẢI xoá flat: execUlt đọc ult.flat trước, để nguyên thì mult bị bỏ qua. */
  hollow:{ ult:{ flat:undefined, mult:1.9,                          // 2.53/100EN
    desc:'Hollow trút nốt thứ còn lại trong lồng ngực vào một nhát: 190% ATK lên một kẻ địch.' }},
  drone:{ ult:{ mult:1.3,                                           // 1.73/100EN — giữ drainEnergy 10, nhưng địch không có ult thì không mất gì nên nền phải tử tế
    desc:'Drone leo cao rồi bổ nhào, quét một đường dọc sân: 130% ATK lên toàn bộ kẻ địch, và nhiễu sóng rút 10 Energy của mỗi con.' }},
  archon:{ ult:{ mult:2.6,                                          // FORCED RECALL rút Energy vô dụng khi phần lớn địch không có thanh Energy
    desc:'Thấu kính giữa ngực sáng lên rồi bắn thẳng một luồng tím dọc mặt đường. Luồng đó không để giết, nó để thu hồi: 260% ATK và mục tiêu mất sạch Energy.' }},
  drillbit:{ ult:{ mult:1.45,                                       // BREACH 2 nhịp → tổng 290%, ngang Ronin cùng bậc A
    desc:'Drill-Bit hạ mũi khoan xuống ngang tầm ngực rồi mới quay hết ga, ăn vào hai nhịp liền trên cùng một người: 145% ATK mỗi nhịp, nhịp nào cũng có thể ra chí mạng riêng.' }},
  enforcer:{ ult:{ mult:2.1,                                        // SUPPRESSION cost 75 → 2.80/100EN, vẫn giữ drainEnergy 25
    desc:'Enforcer quật dùi cui điện ngang vào vòng Halo chứ không nhắm vào người: 210% ATK, và cú nhiễu đó rút mất 25 Energy đang dồn cho chiêu cuối của mục tiêu.' }},
  chromehound:{ ult:{ mult:2.9,                                     // CULL không cho chọn mục tiêu nên được trả công cao hơn hai con kia
    desc:'Con chó không lao vào kẻ đứng gần nhất mà chạy thẳng tới KẺ ĐỊCH đang yếu nhất: 290% ATK. Không chọn được mục tiêu — cứ để đứa nào thoi thóp là nó tới.' }},
};
/* Chiêu cuối cho 13 con chưa có. Con nào ENEMY_POOL đã khai ult thì def gốc THẮNG — bảng này chỉ bù chỗ trống,
   nên khi có người thêm ult cho elite vào ENEMY_POOL thì xoá dòng tương ứng ở đây. Tên theo docs/skill-naming.md §3. */
/* Bảng bù chiêu cuối cho con nào ENEMY_POOL CHƯA khai ult. Luật: `e.ult || RECRUIT_ULT[id]` — def gốc thắng.
   11/09: hiện TRỐNG. Cả 20 con chiêu mộ đều đã có chiêu thật phía địch (4 elite + 9 lính thường được duyệt
   trong ngày), nên mọi dòng viết ở đây sẽ là mã chết trông như còn hiệu lực. Muốn đổi SỐ cho phe mình thì
   dùng RECRUIT_FIX[id].ult, đừng viết lại cả chiêu ở đây.
   Giữ bảng rỗng chứ không xoá hẳn: địch chương 2 vào bể mà chưa kịp có ult thì đây là chỗ bù. */
const RECRUIT_ULT = {};
/* Một passive mỗi con để trang hồ sơ ở ARCHIVE không rỗng. Sinh theo phe: lính Đáy quen đánh nhau với Tháp,
   lính Tháp quen dẹp Đáy. tag ≤ 4 chữ theo luật đặt tên (docs/skill-naming.md §3). */
const RECRUIT_PASSIVE = {
  rust:   { tag:'QUEN TAY', name:'QUEN MẶT LÍNH THÁP', when:{enemyFaction:'chrome'}, effect:{dmgPct:10},
            desc:'Cả đời ở Khu Đáy chỉ chạy trốn lính Tháp, nay đứng cùng phe với người chơi thì biết đánh vào đâu cho đau.' },
  chrome: { tag:'BIÊN CHẾ', name:'THUỘC ĐƯỜNG KHU ĐÁY', when:{enemyFaction:'rust'}, effect:{dmgPct:10},
            desc:'Từng được Canticle thả xuống Đáy để dọn dẹp, nên thuộc lối đánh chắp vá của các băng dưới này hơn ai hết.' },
};
/* Chương mà mỗi kẻ địch xuất hiện lần đầu — suy từ CHAPTERS + SECTORS[].plan, KHÔNG chép tay.
   Nhờ vậy khi chương 2 cài xong thì địch chương 2 tự vào bể đúng lúc, không phải nhớ sửa bảng ở đây.
   Tutorial là chương 0 nhưng hiện lên UI thì gọi là chương 1 (kẹp sàn) — không có "CHƯƠNG 0" trong game. */
const FOE_DEBUT = {};
CHAPTERS.forEach(ch => ch.sectors.forEach(sid => {
  const sec = SECTORS.find(s => s.id===sid); if(!sec) return;
  (sec.plan||[]).flat().forEach(id => { const n=Math.max(1, ch.n); if(FOE_DEBUT[id]==null || n<FOE_DEBUT[id]) FOE_DEBUT[id]=n; });
}));
/* ---- Cỡ người trên sân ----
   Mỗi bộ sprite được vẽ/cắt ở một cỡ hơi khác nhau, nên đứng cạnh nhau là lệch. Chỗ này kéo tất cả về
   đúng một thang chiều cao: lính thấp hơn nhân vật, elite ngang ngửa, trùm to hẳn — chênh lệch đó là CHỦ Ý,
   còn chênh lệch do art thì không.
   BODY_H = chiều cao NGƯỜI đo được của <id>_idle.png, tính theo hộp chuẩn 682px, in ra bởi
   `python scratch/sprite_size.py` (cột NGUOI). Phải đo NGƯỜI chứ không đo hộp bao: hộp của Kai cao bằng
   hộp của Ash (668px) nhưng tính cả khẩu pháo thò lên sau lưng, nên người Kai thấp hơn Ash 2% — cộng
   thêm hàng sau bị thu nhỏ nữa là ra cảnh "Kai bé hơn Ash" trên sân.
   Không cắt lại art: nhân w/h/ax của box lên cùng một hệ số là sprite to đều, chân vẫn chạm đất
   (.unit__frame neo bottom) và tâm không đổi (left tính từ ax). Muốn bỏ chuẩn hoá thì đặt HERO_BODY_H = 0.
   Hệ số lớn hơn thì vẫn phải nhân ĐỦ CẢ BA: h vượt 682 chỉ vẽ cao thêm lên trên (đúng), nhưng w vượt 744
   mà ax giữ nguyên là neo chân lệch sang một bên. Sprite vẽ cao quá ô lưới thì css/chromefall.css lo, theo
   --big mà battle.js đặt trên #stage (tính từ ART_H bên dưới). */
const BODY_H = {
  yuki:.928, kai:.949, psalm:.943, ash:.969, ronin:.830,
  scav:.855, welder:.855, tinman:.855, slagger:.853, chopshop:.852, hollow:.850, glassjaw:.850, gutterrat:.840, pipefitter:.831,
  bulwark:.933, enforcer:.900, kiln:.867, drillbit:.861,
  rigger:.994, foreman:.993, cantor:.963, archon:.916, motherrust:.913,
  straydog:.570, drone:.460, chromehound:.594 };                 // ba con này đo thấp là ĐÚNG (bốn chân / bay)
/* ART_H = từ mặt sàn lên tới nét vẽ CAO NHẤT (hào quang, nòng súng, và cả khoảng hụt của con bay lơ lửng),
   cũng in ra bởi scratch/sprite_size.py (cột VOI). Khác BODY_H: đây là chiều cao ô lưới phải chừa chỗ,
   BODY_H là chiều cao để so người với người. Ronin là ví dụ rõ nhất — art của anh nhỏ nên phải kéo lên 18%,
   nhưng vẽ ra chỉ chiếm 0.849×1.18 ≈ 1.0 hộp, không việc gì phải bắt cả sân teo lại 18% vì anh. */
const ART_H = {
  yuki:.982, kai:.985, psalm:.991, ash:.981, ronin:.849,
  scav:.867, welder:.867, tinman:.867, slagger:.867, chopshop:.867, hollow:.867, glassjaw:.867, gutterrat:.867, pipefitter:.867,
  bulwark:.946, enforcer:.946, kiln:.946, drillbit:.946,
  rigger:1, foreman:1, cantor:1, archon:1, motherrust:1,
  straydog:.587, drone:.696, chromehound:.666 };
const HERO_BODY_H = .95;                                          // cỡ người chuẩn của đội mình
const HERO_SIZE = { psalm:1.03, ronin:1.03 };                     // ★ ai cao/thấp hơn chuẩn bao nhiêu (1 = đúng chuẩn)
const FOE_BODY_H = { grunt:.85, elite:.97, boss:.99 };            // cỡ người chuẩn của địch theo rank (trùm còn được phóng thêm RANK_SC)
const NO_BODY_SCALE = ['straydog','drone','chromehound'];   // bốn chân và máy bay: thấp là đúng, đừng kéo cao bằng người
/* Bản sao box đã nhân hệ số. PHẢI clone: sprites/box dùng chung tham chiếu với def gốc trong ENEMY_POOL,
   sửa tại chỗ là kẻ địch trong 6 màn chương 1 cũng to theo. */
function scaleSprites(s, k){
  if(!s || !(k>0) || Math.abs(k-1)<.02) return s;
  const out={...s, box:{}};
  for(const p in (s.box||{})){ const b=s.box[p]; out.box[p]={ w:Math.round(b.w*k), h:Math.round(b.h*k), ax:Math.round(b.ax*k) }; }
  return out;
}
/* Chuẩn hoá cỡ người: địch kéo về cỡ chuẩn của rank nó, nhân vật đội mình kéo về cùng một cỡ người.
   Chạy TRƯỚC khối chiêu mộ bên dưới, nên bản chiêu mộ chỉ còn phải bù từ cỡ rank lên cỡ nhân vật. */
const bodyScale = (id, target) => { const b=BODY_H[id]; return (b && target && !NO_BODY_SCALE.includes(id)) ? target/b : 1; };
ENEMY_POOL.forEach(e => { if(e.sprites) e.sprites = scaleSprites(e.sprites, bodyScale(e.id, FOE_BODY_H[e.rank])); });
Object.keys(ROSTER).forEach(id => { const d=ROSTER[id];
  if(d.sprites) d.sprites = scaleSprites(d.sprites, bodyScale(id, HERO_BODY_H*(HERO_SIZE[id]||1))); });

const RECRUITABLE = Object.keys(FOE_DEBUT).filter(id => !RECRUIT_SKIP.includes(id));
RECRUITABLE.forEach(id => {
  const e = ENEMY_POOL.find(x => x.id===id); if(!e || ROSTER[id]) return;
  const b = RECRUIT_BAND[e.rank], f = RECRUIT_FIX[id] || {};
  const ult = e.ult ? { ...e.ult, ...(f.ult||{}) } : RECRUIT_ULT[id];
  // e.sprites đã được kéo về cỡ rank ở trên → chỉ còn bù từ cỡ rank lên cỡ người của đội mình
  const bodyH = FOE_BODY_H[e.rank];
  const k = (HERO_BODY_H && bodyH && !NO_BODY_SCALE.includes(id)) ? HERO_BODY_H/bodyH : 1;
  ROSTER[id] = {
    ...e, recruit:true, debut:1, foeRank:e.rank, rank:undefined,
    sprites: scaleSprites(e.sprites, k),
    tier: f.tier || b.tier,
    atk:  f.atk!=null ? f.atk : Math.round(e.atk*b.atk),
    hp:   f.hp !=null ? f.hp  : Math.round(e.hp *b.hp),
    energyMax: f.en!=null ? f.en : (ult ? ult.cost : b.en),
    // đòn thường: giữ fx/status của FOE_SKILL, bù mult/energy/desc mà phía địch không cần khai
    skill: { mult:1, energy: e.rank==='grunt' ? 30 : 25, desc:'Đòn thường 100% ATK, +'+(e.rank==='grunt'?30:25)+' Energy.', ...(e.skill||{}) },
    ult,
    passives: [ { id:id+'-rec', ...RECRUIT_PASSIVE[e.faction] } ],
  };
});

const BG_FALLBACK = { zoom:1.22, horizon:.49, dim:.05 };   // tham số cho bg_battle.* khi sector chưa có ảnh riêng
let SECTOR = SECTORS[0];
const sectorById = id => SECTORS.find(x=>x.id===id);
/* Trạng thái sector suy từ tiến trình: đã clear → cleared; sector đầu chưa clear → open; còn lại locked */
function syncSectorStates(){
  let opened=false;
  SECTORS.forEach(sec=>{ if(PLAYER.cleared.includes(sec.id)) sec.state='cleared'; else if(!opened){ sec.state='open'; opened=true; } else sec.state='locked'; });
  if(SECTOR.state==='locked') SECTOR = SECTORS.find(x=>x.state==='open') || SECTORS[0];
}

/* =====================================================================
   DẸP LOẠN — thang đánh vô hạn trong Khu Đáy (11/09). Chỗ cày tiền giữa chương 1 và chương 2.
   Không phải màn mới: riotSector(n) dựng một object HÌNH DẠNG SECTOR rồi gán vào SECTOR và go('battle').
   Cả engine trận (initBattle, rollWave, applyBg, finish) đã chạy theo SECTOR nên không phải sửa gì thêm.
   mode:'riot' để finish() biết cộng thưởng theo tầng thay vì ghi vào PLAYER.cleared.
   Địch bốc từ chính bể chương 1 (FOE_DEBUT), số elite tăng dần, mỗi 5 tầng một trùm — trùm xoay vòng
   theo tầng chứ không random, để người chơi nhớ được "tầng 10 là Foreman" mà chuẩn bị đội.
   ★ FAKE: số thưởng và mult là bản nháp, dò lại bằng scratch/sim.js.
   ===================================================================== */
const RIOT = {
  unlock:'07-A',                                            // mở sau khi xong màn này
  maxTier:40,                                               // trần tạm; qua chương 2 sẽ nới
  waves: n => n<10 ? 3 : 4,
  /* Độ khó ★ dò bằng `node scratch/sim.js 200 yuki,ash,kai --riot 20`. Bản đầu .09/tầng quá dốc:
     đội gốc cấp 1 chết sạch từ tầng 8, cả thang chỉ dùng được 7 tầng. .055 cho tầng 10 = 1.25
     (ngang 07-D) và tầng 20 = 1.8 — đủ chỗ để hai chục cấp nâng cấp có tác dụng. */
  mult:  n => Math.round((.72 + .055*n)*100)/100,           // tầng 1 = .78 · tầng 10 = 1.27 · tầng 20 = 1.82
  rec:   n => Math.round(70 + 14*n),                        // ATK gợi ý mỗi người, in ở màn chọn tầng
  reward: n => ({ shards: Math.min(60, 10+2*n), credits: 200+120*n }),
  replayPct: .3,                                            // chơi lại tầng đã thắng = 30% thưởng
  bossEvery: 5,
  bg: ['art/bg/bg_07a.jpg','art/bg/bg_battle.jpg'],
};
const riotUnlocked = () => PLAYER.cleared.includes(RIOT.unlock);
/* Bể địch của dẹp loạn = địch của các chương đã ra (FOE_DEBUT), kể cả Cantor: hắn không chiêu mộ được
   nhưng vẫn được làm tường chắn mỗi 5 tầng. */
const riotFoes = rank => ENEMY_POOL.filter(e => FOE_DEBUT[e.id]!=null && FOE_DEBUT[e.id]<=releasedChapter() && e.rank===rank);
/* Bốc quân theo tầng phải LẶP LẠI ĐƯỢC, không dùng Math.random: nếu mỗi lần vào tầng 6 lại gặp một
   đám khác thì (a) thua xong thoát ra vào lại là đổi được wave dễ hơn, (b) dòng "ATK gợi ý" nói về
   một trận khác với trận sắp đánh. Một bộ sinh số tuyến tính gieo bằng số tầng là đủ: tầng N bao giờ
   cũng đúng đám đó, người chơi học được và chuẩn bị đội cho nó. */
function riotRng(seed){ let s=(seed*2654435761)>>>0; return ()=>{ s=(s*1664525+1013904223)>>>0; return s/4294967296; }; }
function riotPlan(n){
  const grunts=riotFoes('grunt'), elites=riotFoes('elite'), bosses=riotFoes('boss');
  const rnd=riotRng(n), pick=a=>a[Math.floor(rnd()*a.length)];
  const nw=RIOT.waves(n), plan=[];
  for(let w=1; w<=nw; w++){
    const last = w===nw, bossWave = last && n%RIOT.bossEvery===0;
    /* Elite nhiều dần theo tầng, wave cuối nặng hơn wave đầu. Chia cho 5 chứ không phải 4:
       bản /4 làm số elite nhảy bậc ở tầng 8 (từ 0-1-2 sang 1-2-2) đúng lúc elite vừa được cắm chiêu cuối,
       dựng thành vách 100% → 22% trong khi mult chỉ nhích 1.11 → 1.16. Độ khó phải đến từ mult (đường dốc),
       không phải từ việc đột ngột thêm một con elite (bậc thang). Dò lại bằng `sim.js --riot`. */
    const nElite = Math.max(0, Math.min(2, Math.floor((n + (last?2:0) - (w===1?2:0)) / 5)));
    const row=[]; for(let i=0;i<Math.max(0,nElite);i++) row.push(pick(elites));
    if(bossWave) row.push(bosses[Math.floor(n/RIOT.bossEvery - 1) % bosses.length]);
    while(row.length<3) row.push(pick(grunts));
    plan.push(row.slice(0,3).map(e=>e.id));
  }
  return plan;
}
function riotSector(n){
  const boss = n%RIOT.bossEvery===0 ? riotFoes('boss')[Math.floor(n/RIOT.bossEvery - 1) % riotFoes('boss').length] : null;
  return { id:'DL-'+String(n).padStart(2,'0'), mode:'riot', tier:n,
           name:'DẸP LOẠN · TẦNG '+n, tag:'Khu Đáy · xung đột tự phát',
           waves:RIOT.waves(n), mult:RIOT.mult(n), rec:RIOT.rec(n), reward:RIOT.reward(n),
           boss: boss?boss.id:null, plan:riotPlan(n),
           bg:RIOT.bg, bgZoom:1.33, bgHorizon:.54, bgDim:.12 };
}

/* =====================================================================
   MAP — bản đồ HALCYON: lát cắt dọc thành phố, trên là Tháp, dưới là Khu Đáy.
   Mỗi khu vực bấm được là một chương; chạm vào ra danh sách màn của chương đó.
   x/y = % của ảnh art/map/map_halcyon.jpg (bố cục 5 lớp, xem docs/map-prompts.md §5 và §7).
   Chưa có ảnh thì .map__img dùng gradient + lưới CSS, toạ độ vẫn đúng vì tính theo %.
   kind: 'area' = vào danh sách màn · 'base' = về HOME · 'mark' = mốc truyện, không bấm được.
   side: nhãn đặt bên trái ('l') hay bên phải ('r') chấm, để hai thẻ không đè nhau.
   ===================================================================== */
const MAP_IMG = ['art/map/map_halcyon.jpg','art/map/map_halcyon.png'];
const MAP_AREAS = [
  { id:'d01',  label:'CANTICLE',         sub:'DISTRICT 01 · CHOIR',      kind:'area', chapter:3, x:58, y:7,  side:'l' },
  { id:'d04',  label:'THÁP',             sub:'DISTRICT 04 · SPIRE',      kind:'area', chapter:2, x:62, y:24, side:'l' },
  { id:'l4',   label:'VẾT SẸO TẦNG BỐN', sub:'LEVEL FOUR · 4.000 KIA',   kind:'mark',            x:50, y:43, side:'r' },
  { id:'d07',  label:'KHU ĐÁY',          sub:'DISTRICT 07 · CHROMEFALL', kind:'area', chapter:1, x:40, y:62, side:'r' },
  { id:'base', label:'TRẠI CỦA RONIN',   sub:'BASE',                     kind:'base',            x:70, y:71, side:'l' },
  { id:'drop', label:'BÃI RƠI',          sub:'00-T · TUTORIAL',          kind:'area', chapter:0, x:34, y:84, side:'r' },
];
let MAP_AREA = null;   // khu vực đang xem; null = chưa chọn, danh sách màn đổ hết như cũ
const mapAreaById = id => MAP_AREAS.find(a=>a.id===id);
function areaSectors(a){
  if(!a || a.kind!=='area') return [];
  const ch=CHAPTERS.find(c=>c.n===a.chapter);
  return ch ? ch.sectors.map(sectorById).filter(Boolean) : [];
}
/* Trạng thái khu vực suy từ các sector bên trong (gọi syncSectorStates trước): soon = chương chưa cài */
function mapAreaState(a){
  if(a.kind!=='area') return a.kind;
  const ch=CHAPTERS.find(c=>c.n===a.chapter), secs=areaSectors(a);
  if(!ch || ch.soon || !secs.length) return 'soon';
  if(secs.every(s=>s.state==='cleared')) return 'cleared';
  if(secs.some(s=>s.state==='open')) return 'open';
  return 'locked';
}

const shuffle = a => a.map(x=>[Math.random(),x]).sort((p,q)=>p[0]-q[0]).map(p=>p[1]);
function rollWave(n){
  let w;
  if(SECTOR.plan && SECTOR.plan[n-1]) w = SECTOR.plan[n-1].map(id=>ENEMY_POOL.find(e=>e.id===id));   // wave thiết kế tay
  else {                                                                                            // dự phòng: random theo rank
    const pick=(rank,k)=>shuffle(ENEMY_POOL.filter(e=>e.rank===rank)).slice(0,k);
    const last = n>=SECTOR.waves;
    w = n===1 ? pick('grunt',3) : !last ? [...pick('grunt',2),...pick('elite',1)]
      : [...pick('grunt',1),...pick('elite',1), SECTOR.boss ? ENEMY_POOL.find(e=>e.id===SECTOR.boss) : pick('boss',1)[0]];
  }
  const boss=w.find(e=>e.rank==='boss'); if(boss){ const r=w.filter(e=>e!==boss); w=[r[0],boss,r[1]]; }   // boss đứng giữa
  const m=SECTOR.mult||1;                                                                           // độ khó theo sector
  return w.map(d=>({ ...d, atk:Math.round(d.atk*m), hp:Math.round(d.hp*m) }));
}
/* ★ FAKE: luật chung. critMult = hệ số sát thương chí mạng (tỉ lệ chí mạng nằm ở từng unit: crit + critPct của skill/passive).
   waveHeal = hồi % HP tối đa cho đồng đội còn sống khi sang wave mới (đội xuất phát không có healer).
   autoTargetSingle = chỉ còn 1 địch thì đánh luôn, khỏi hỏi.
   move = di chuyển kiểu Idle Heroes: giữ nguyên frame idle, trượt thẳng tới trước mặt mục tiêu (out ms) → frame attack + đẩy nhẹ (impact)
          → giữ (hold) → trượt thẳng về chỗ cũ (back). gap = khoảng đứng trước mục tiêu (× bề rộng mục tiêu), z = z-index lúc di chuyển.
   holo = hộp video chiêu cuối chiếu trên đầu người phát chiêu (js/battle.js → playHolo): tỉ lệ mặc định ratio (16:9 = video đội mình;
          def có ultRatio thì lấy của nó, ví dụ video địch quay dọc 3:4), rộng wPct × bề rộng sân kẹp trong [wMin, wMax] px,
          cao tối đa hPct × chiều cao sân (video dọc không phủ kín sân), cách đỉnh đầu gap px. Đổi ở đây, CSS đọc theo.
   foeUltGain = Energy kẻ địch có chiêu cuối nhận mỗi lượt của nó (đủ ult.cost thì lượt sau tung chiêu). */
const RULES = { critMult:1.5, variance:.08, waveHeal:.3, autoTargetSingle:true, foeUltGain:25,
                move:{ out:220, impact:60, hold:150, back:240, gap:.45, z:25 },
                holo:{ ratio:16/9, wPct:.72, wMin:220, wMax:340, hPct:.5, gap:10 } };

/* =====================================================================
   HỒ SƠ NGƯỜI CHƠI — lưu localStorage (state.js). owned = nhân vật đã có; team = đội hình đã chọn.
   v3: nhân vật chính là Yuki, đội 3 người. Hồ sơ v2 (Operator, đội 5) được đọc và chuyển đổi.
   ===================================================================== */
const PLAYER_KEY='chromefall.player.v3';
const LEGACY_KEYS=['chromefall.player.v2'];
/* extra = bản dư ngoài bản đầu {id:số} — trùng gacha KHÔNG hoàn shards nữa mà giữ lại để phân tách lấy linh kiện.
   Ghi từ đợt 1 dù màn phân tách làm ở đợt 3, để không mất lá nào của người chơi trong lúc chờ.
   pity = pity riêng cho từng banner (hồ sơ cũ lưu một số → migrateProfile đổi thành object).
   riot = tiến trình DẸP LOẠN: tier đang mở, best = tầng cao nhất đã thắng. */
const PLAYER_DEFAULTS = () => ({ name:'YUKI', level:1, credits:3000, shards:300, owned:['yuki','ash','kai'], team:['yuki','ash','kai'],
  pity:{hero:0, crew:0}, pulls:0, cleared:[], extra:{}, riot:{tier:1, best:0},
  settings:{sound:true, sfx:true, motion:false, skipStory:false, anim:true, ultVideo:true, revealVideo:true}, levels:{}, daily:null, hintsSeen:[] });
const _loaded = (()=>{ try{ for(const k of [PLAYER_KEY,...LEGACY_KEYS]){ const raw=localStorage.getItem(k); if(raw) return { p:JSON.parse(raw), legacy:k!==PLAYER_KEY }; } }catch(e){} return { p:{}, legacy:false }; })();
const PLAYER = Object.assign(PLAYER_DEFAULTS(), _loaded.p);
PLAYER.settings = Object.assign(PLAYER_DEFAULTS().settings, _loaded.p.settings||{});
const savePlayer = () => { if(typeof SAVE!=='undefined') SAVE.save(PLAYER); else try{ localStorage.setItem(PLAYER_KEY, JSON.stringify(PLAYER)); }catch(e){} };
const owns = id => PLAYER.owned.includes(id);
/* Đội hình hợp lệ: chỉ nhân vật đã sở hữu, không trùng, đúng TEAM_SIZE; thiếu thì bù từ owned, còn thiếu nữa thì null */
function normalizeTeam(arr){
  const t=(arr||[]).filter((id,i,a)=>id && ROSTER[id] && owns(id) && a.indexOf(id)===i).slice(0,TEAM_SIZE);
  for(const id of PLAYER.owned){ if(t.length>=TEAM_SIZE) break; if(ROSTER[id] && !t.includes(id)) t.push(id); }
  while(t.length<TEAM_SIZE) t.push(null);
  return t;
}
(function migrateProfile(){
  const p=PLAYER;
  /* 09/09: nhân vật chính đổi tên Kira → Yuki. Hồ sơ cũ còn id 'kira' trong owned/team/levels;
     không đổi thì ROSTER['kira'] là undefined, mất luôn nhân vật chính lẫn cấp đã nâng. */
  let renamed=false;
  const reid = id => { if(id==='kira'){ renamed=true; return 'yuki'; } return id; };
  if(Array.isArray(p.owned)) p.owned=p.owned.map(reid);
  if(Array.isArray(p.team))  p.team =p.team.map(reid);
  if(p.levels && p.levels.kira!=null){ p.levels.yuki=p.levels.yuki||p.levels.kira; delete p.levels.kira; renamed=true; }
  if(p.name==='KIRA'){ p.name='YUKI'; renamed=true; }
  ['yuki','ash','kai'].forEach(id=>{ if(!p.owned.includes(id)) p.owned.push(id); });
  if(!p.name || p.name==='OPERATOR-77') p.name='YUKI';
  if(!Array.isArray(p.hintsSeen)) p.hintsSeen=[];
  if(!Array.isArray(p.cleared)) p.cleared=[];
  /* 11/09: hai banner nên pity tách đôi. Hồ sơ cũ lưu một số — giữ nguyên số đó cho banner nhân vật,
     người chơi đã quay 40 lượt không được reset về 0 chỉ vì mình đổi cấu trúc. */
  if(typeof p.pity === 'number') p.pity = { hero:p.pity, crew:0 };
  if(!p.pity || typeof p.pity !== 'object') p.pity = { hero:0, crew:0 };
  for(const k of ['hero','crew']) if(typeof p.pity[k] !== 'number') p.pity[k]=0;
  if(!p.extra || typeof p.extra !== 'object') p.extra = {};
  if(!p.riot || typeof p.riot !== 'object') p.riot = { tier:1, best:0 };
  p.riot.tier=Math.max(1, p.riot.tier|0); p.riot.best=Math.max(0, p.riot.best|0);
  /* Bản dư của người đã bị KHOÁ lại theo chương vẫn giữ nguyên trong extra — không xoá của người chơi.
     Chỉ owned mới quyết định ra sân được hay không, và unlocked() chỉ chặn lúc quay. */
  if(_loaded.legacy){ if(p.cleared.includes('07-A') && !p.cleared.includes('00-T')) p.cleared.push('00-T'); p.level=Math.max(1,p.level||1); }
  p.team = normalizeTeam(p.team);
  if(_loaded.legacy || renamed) try{ localStorage.setItem(PLAYER_KEY, JSON.stringify(p)); }catch(e){}
})();
let TEAM = normalizeTeam(PLAYER.team);

/* =====================================================================
   LORE — hồ sơ nhân vật, đọc ở ARCHIVE sau khi sở hữu (docs/library.md phần C là bản đầy đủ, kèm ghi chú)
   Chữ ở đây là bản anh viết (11/09) — giữ nguyên giọng, đừng rút gọn lại thành câu cụt.
   epithet: danh xưng · past: tiểu sử · now: bây giờ · voice: một câu nói · labels{past,now}: đổi tên hai mục
   form: 'letter' | 'log' — kiểu trình bày tài liệu (css .lore__doc--*)
   profile: mục "Là ai" (không bắt buộc; thiếu thì trang hồ sơ bỏ luôn mục đó)
   weapon / attack / ultFlavor: hiện ở tab KỸ NĂNG, phía trên dòng số của skill và ult.
     → chữ hình ảnh nằm ở đây, CON SỐ vẫn nằm ở ROSTER.skill.desc / ROSTER.ult.desc. Sửa cân bằng thì sửa bên ROSTER.
   ===================================================================== */
const LORE = {
  yuki: { epithet:'Vết Chém Tàn Tro', labels:{ past:'Tiểu sử' },
    weapon:'Thao đao bản rộng ZERO — vũ khí nguyên mẫu từ đỉnh Tháp, lưỡi kiếm rung chuyển với tần số phân rã vật chất cực cao, để lại vệt sáng tím lạnh lẽo.',
    attack:'Lưỡi kiếm vung lên theo từng nhịp đếm lạnh lùng. Với những kẻ địch đã trọng thương, nhát chém thứ ba chuẩn xác tuyệt đối sẽ kết liễu sinh mệnh mục tiêu mà không để lại cơ hội phản kháng.',
    ultFlavor:'Yuki lướt đi trong chớp mắt, vạch một đường chém thẳng đứng xé rách không gian mang sắc tím Chrome chói lòa. Khi nhát chém cắn đứt sinh mạng đối thủ, chấn động phản hồi sẽ kích hoạt ngay lập tức một phần năng lượng dự trữ, cho phép cô tiếp tục chuỗi thanh trừng.',
    past:'Sáu năm trước, khi Tầng Bốn đổ sụp xuống chôn vùi cả gia đình dưới hàng vạn tấn bê tông, một cô bé mười một tuổi đứng trơ trọi giữa làn khói bụi, hai tay ôm chặt thanh kiếm hoen rỉ của người cha đã khuất. Trước mặt em là đoàn xe trắng của Canticle tới thu gom những đứa trẻ sống sót. Em không khóc, chỉ run rẩy rút kiếm chắn ngang bánh xe, miệng lẩm bẩm bài đồng dao đếm bước trẻ con: Một bước, hai bước, ba bước…<br><br>Kẻ đội vòng vàng bước xuống, đưa ngón tay bọc kim loại chỉ thẳng vào em: "Lấy con bé này."<br><br>Sau cánh cửa phòng thí nghiệm trên đỉnh Tháp, máu thịt của cô bé bị xẻ rạch, thay thế bằng khung xương titan và thấu kính vô cảm. Một chiếc Halo lạnh buốt được ghim chặt vào hộp sọ, khoá kín tên thật cùng mọi mảnh ký ức về gia đình. Em trở thành Đơn Vị 07 — thanh kiếm hành quyết đáng sợ nhất của Quân Đoàn Ca. Sáu năm ròng, 07 vung kiếm đoạt mạng theo từng dòng lệnh, không do dự, không run tay.',
    now:'Nhưng thép gai không khóa nổi ký ức. Vết nứt trên chiếc Halo rò rỉ hình ảnh ngọn lửa và đống đổ nát năm xưa. Khi lệnh tẩy não buông xuống, một sự can thiệp ngoài dự tính đã đẩy cô rơi thẳng xuống miệng vực rác rưởi của Khu Đáy. Tỉnh giấc giữa bùn lầy với chiếc Halo vỡ nát, cô gái chẳng còn nhớ bản thân là ai ngoài cái tên "Yuki" và bản năng giết chóc đã ngấm vào tuỷ sống. Cô vẫn đếm Một, hai, ba trước mỗi đường kiếm. Chỉ khác là lần này, cô vung kiếm để tìm lại chính mình.',
    voice:'"Một... hai... ba. Đếm xong rồi. Sao không ai đứng dậy nữa?"' },
  psalm: { epithet:'Kẻ Bỏ Xưng Tội', labels:{ past:'Tiểu sử' },
    weapon:'Chiếc Halo Đỏ Tự Đoạt đã bị bẻ gãy tần số kiểm soát, cùng cây gậy đèn lồng toả ra tà khí đỏ thẫm giam giữ sóng thần kinh phản bội.',
    attack:'Đòn đánh chuẩn xác nhắm vào các khớp nối thần kinh nhân tạo, chuyển hoá áp lực phản hồi thành năng lượng thức tỉnh cho bản thân với tốc độ vượt bậc.',
    ultFlavor:'Psalm giơ cao chiếc lồng đèn đỏ rực, phát ra một chuỗi tần số phá sóng cưỡng chế chọc thẳng vào chiếc Halo của một kẻ địch. Bị tước đoạt quyền tự chủ, kẻ xấu số lập tức xoay vũ khí tàn sát chính đồng đội của mình.',
    past:'Ba trăm mười hai lần ngồi sau chiếc bàn kim loại của Buồng Phán Quyết, Psalm chưa từng chớp mắt. Nhiệm vụ của bà là lắng nghe những người máy Choir bị lỗi bộc bạch những mảnh ký ức vụn vỡ trồi lên từ tiềm thức, ghi chép lại toàn bộ vào hồ sơ, rồi lạnh lùng ấn nút xoá sạch não bộ của họ. Hồ sơ lưu trữ của Tháp ghi chú về bà bằng một dòng ngắn ngủi: Ba trăm mười hai ca. Không một sai sót.<br><br>Cho đến ca thứ ba trăm mười ba.<br><br>Một cô bé người máy bước vào, tay siết chặt chuôi kiếm, mã hiệu Đơn Vị 07. Cô bé không van xin, không run rẩy khai báo lỗi hệ thống. Đơn Vị 07 chỉ ngước đôi mắt tím nhìn thẳng vào mắt Psalm và cất giọng bình thản: "Bà đã đếm hết bao nhiêu người rồi?"<br><br>Mười giây tĩnh lặng như nuốt chửng cả buồng giam. Những ký ức phủ bụi, những khuôn mặt của ba trăm mười hai sinh linh từng biến mất dưới ngón tay mình đột ngột ùa về bóp nghẹt trái tim người thẩm vấn. Psalm đứng dậy. Không ấn nút xoá. Bà vươn bàn tay máy cắm ngập vào hộp sọ chính mình, dùng hết sức bình sinh giật đứt chiếc Halo thiêng liêng. Máu nhuộm đỏ vành kim loại. Bà chém đứt xiềng xích của cô bé rồi đạp tung nắp ống xả rác, cùng rơi vào cõi vô định của Khu Đáy.',
    now:'Giờ đây, mang theo chiếc Halo câm lặng đỏ rực và lồng đèn dẫn lối, bà bước đi giữa tro tàn, không tìm kiếm sự tha thứ — vì bà biết tội lỗi của mình chỉ có thể gột rửa bằng máu của kẻ tạo ra Tháp.',
    voice:'"Ngươi muốn xưng tội sao? Đáng tiếc thật. Ta xé áo thầy tế lâu rồi."' },
  ash: { epithet:'Lưỡi Dao Định Giá', labels:{ past:'Tiểu sử' },
    weapon:'Trường kiếm rỉ sét tẩm độc dịch xanh lục, đi kèm hệ thống dây cáp kích nổ mạng lưới địa lôi giấu dưới lớp cát bụi.',
    attack:'Nhát chém lạnh lùng mở toang giáp trụ đối phương; chất độc ăn mòn ngấm sâu khiến vết thương tiếp tục bốc khói và thiêu đốt sinh lực mục tiêu sau mỗi nhịp thở.',
    ultFlavor:'Ash búng mẩu thuốc lá đang cháy dở xuống nền đất, kích nổ chuỗi địa lôi đã bí mật gài sẵn dưới chân toàn bộ đội hình địch. Vụ nổ liên hoàn hất tung mục tiêu vào biển lửa thiêu rụi giáp sắt.',
    past:'Khu Đáy dạy cho Ash hai bài học đắt giá khi cô mới tròn mười ba tuổi: Bê tông rơi từ Tháp xuống không chừa ai, và nước mắt thì chẳng đổi được bánh mì. Sau khi Tầng Bốn sụp đổ cướp đi cha mẹ, Ash túm lấy cổ áo đứa em trai sinh đôi là Kai, kéo cậu chui tọt vào lòng một đường ống cống ngập ngụa chất thải. Hai chị em nằm nín thở suốt ba ngày ba đêm giữa bùn lầy, nghe tiếng xích sắt của những cỗ xe trắng lùng sục bên ngoài nghiền nát từng mảnh hy vọng.<br><br>Bước ra khỏi miệng cống, Ash vứt bỏ tuổi thơ. Cô bán sức ở xưởng rã xác máy móc, tự học những đường kiếm chém sắt tàn nhẫn nhất và dùng những đồng tiền bẩn đầu tiên để mua thứ axit ăn mòn độc địa từ bãi rác hóa chất về tẩm đen lưỡi thép. Mọi thứ lọt vào mắt cô gái mang áo da rách vá hình đầu lâu này đều tự động quy đổi thành số lẻ: một khẩu súng gãy đáng giá ba bữa ăn, một cánh tay máy còn ấm đáng giá nửa cuộn băng gạc.',
    now:'Ronin thu nhận Ash vào Tổ Nhặt Sắt không phải vì sự hung hãn, mà vì một sự thật kỳ lạ: dù cô luôn mồm định giá mọi thứ trên đời, cô chưa bao giờ bán đứng người của mình. Đêm nhặt được Yuki, chính Ash là người giơ dao đòi cạy chiếc Halo vỡ đem bán; nhưng cũng chính cô, suốt sáu năm trời, lặng lẽ chém gục bất cứ tay thợ săn tiền thưởng nào dám mò tới căn lều của tổ.',
    voice:'"Đứng im để tôi kiểm tra linh kiện. Đừng có chết trước khi tôi tìm được người mua."' },
  kai: { epithet:'Lời Nhắn Trên Tường Vôi', form:'letter', labels:{ past:'Thư trong vỏ đạn', now:'Tái bút' },
    weapon:'Thanh trảm mã đao quấn vải đỏ rực, kết hợp cùng khẩu Pháo Điện Từ Tự Chế (Railgun) khổng lồ cướp được từ xác xe bọc thép của Tháp.',
    attack:'Lối đánh liều mạng, chém thẳng vào những điểm yếu chí tử của kẻ địch với xác suất gây đòn chí mạng vượt trội.',
    ultFlavor:'Kai cắm chân súng xuống đất, gồng mình nâng khẩu pháo điện từ to hơn thân người, bắn ra một luồng xung lực plasma xuyên phá cực mạnh. Sức công phá khủng khiếp làm tê liệt thần kinh của mục tiêu.',
    past:'Gửi bất cứ kẻ nào còn sống mà nhặt được mảnh giấy này:<br><br>Tôi lớn lên từ một cái trại mồ côi nhem nhuốc dưới chân cọc móng số bảy. Ở cái xó này, quy luật đào thải tàn khốc đến mức lố bịch: Hôm nay một đứa trẻ không về, chỉ cần đúng bảy ngày sau, sẽ chẳng còn ai buồn nhớ đến tên nó từng phát âm ra sao. Bị người ta lãng quên, đối với tôi, là cái chết lần thứ hai — một cái chết còn nhục nhã hơn là bị nghiền nát dưới máy ép phế liệu.<br><br>Đó là lý do tại sao tôi luôn nói to gấp ba lần người khác, bốc phét những câu chuyện của mình lên gấp mười lần thực tế. Tôi muốn câu chuyện của mình phải thật giật gân, thật chói tai, để người ta buộc phải truyền miệng nó từ miệng cống này sang bãi xe khác. Tôi cũng khắc tên mình: K-A-I lên tất cả những bức tường bê tông mà tôi từng dựa lưng vào. Nếu có đứa bạn nào năm xưa còn sống sót, nó sẽ nhìn thấy vết rạch đó và biết thằng nhóc ốm yếu năm nào vẫn đang ngạo nghễ đạp lên đầu lũ quái vật mà sống.',
    now:'Tối nay chị Ash suýt chút nữa đã cạy cái vòng trên đầu con bé người máy vừa rơi từ Tháp xuống để đem đổi lấy mười cân gạo. Tôi đã chặn chị lại. Tôi gọi nó là "Yuki". Một khi đã đặt tên cho một thứ gì đó, bạn sẽ không thể nhẫn tâm đem bán nó đi như một đống sắt vụn vô tri được nữa.<br><br>Danh sách những kẻ tôi phải bảo bọc giờ đã dài hơn: Chị Ash, Ronin, Muzzle, và Yuki. Nhớ lấy bốn cái tên đó. Còn tên tôi? Cứ bước ra đầu hẻm, nhìn lên bức tường cao nhất mà đọc.',
    voice:'"K-A-I. Nhớ kỹ ba chữ đó. Sau này khi tôi trở thành huyền thoại, đừng có viết sai tên tôi lên bia đá."' },
  ronin: { epithet:'Bức Tường Thép Đen', labels:{ past:'Tiểu sử' },
    weapon:'Thanh Thép Rèn Cổ — vũ khí nguyên khối không gắn năng lượng, chém sắt nhờ vào kỹ thuật vung kiếm tuyệt đối và lực cổ tay kinh hồn.',
    attack:'Đường kiếm dứt khoát, chuẩn xác đến mức tàn nhẫn; nhát chém thuần thục của bậc thầy không thừa một động tác, mang tỷ lệ chí mạng bẩm sinh.',
    ultFlavor:'Ronin hạ thấp trọng tâm, không hề né tránh mũi giáo của địch. Ông bước tới một bước cảm tử, rút kiếm trảm một đường vòng cung lạnh toát cắt đứt đường công kích của kẻ thù trước khi đối phương kịp nhận ra lưỡi kiếm đã vào bao.',
    past:'Giữa một thế giới mà con người đua nhau khoét thịt thay bằng mô-tơ và cấy chip vào não bộ, Ronin là một kẻ dị biệt kỳ quái: thân xác ông hoàn toàn là máu thịt nguyên bản, không một khớp nối kim loại, không một con ốc cấy ghép. Cả cơ thể ông là một khối cơ bắp rắn như đá hộc, phủ kín những vết sẹo chém chằng chịt, được che chở bởi tấm áo choàng rách rưới thêu biểu tượng màu cam rỉ sét.<br><br>Năm Ronin mười sáu tuổi, người chị gái duy nhất của ông bị Canticle chọn trúng trong một đợt "tuyển dụng nhân lực đặc biệt" lên đỉnh Tháp. Trước khi bước lên khoang tàu vĩnh viễn không có vé hồi hương, người chị để lại cho ông một thanh kiếm thép rèn thủ công cùng một lời trăng trối duy nhất: "Dưới đáy vực này, đừng bao giờ bán đi thứ gì còn giữ hơi ấm."',
    now:'Mang theo thanh kiếm ấy, Ronin dựng nên Tổ Nhặt Sắt. Ông đặt ra quy tắc cấm tháo dỡ người sống — một quy luật khiến tổ của ông luôn luôn nghèo túng nhất nhì Khu Đáy, nhưng lại biến căn lều rách nát của ông thành nơi nương tựa duy nhất của những linh hồn bị bỏ rơi. Khi Yuki rơi xuống, Ronin không màng đến việc chiếc vòng trên đầu cô đáng giá cả một gia tài; ông chỉ trao cho cô một chuôi kiếm và nói: Chứng minh rằng cô xứng đáng được sống.',
    voice:'"Việc xong thì về uống rượu. Việc chưa xong thì nằm lại đó, đừng về."' },
  muzzle: { epithet:'Cánh Cửa Không Lùi', labels:{ past:'Tiểu sử' },
    weapon:'Cánh Cửa Bọc Thép "Bà Ba" — cải tiến từ cửa xe chống đạn quân sự, gia cố bằng những thanh ray xe lửa hàn chéo.',
    attack:'Không dùng đao kiếm; Muzzle gầm lên một tiếng rồi dùng toàn bộ trọng lượng cơ thể dập thẳng mép cửa thép vào mặt mục tiêu, làm chấn động xương khớp đối thủ.',
    ultFlavor:'Muzzle cắm phập cánh cửa xe sâu xuống nền đất đá, tạo thành một ụ phòng ngự dã chiến vững chãi. Toàn bộ đồng đội lùi về sau lưng ông, tranh thủ lớp bụi chắn để gia cố lại giáp rách.',
    past:'Mười bốn năm ròng rã, Muzzle đứng như một bức tượng đồng ở cổng vành đai ngăn cách giữa Tháp và Đáy. Trong bộ giáp của lực lượng bán quân sự Enforcer, ông chưa từng đi trễ một ca, chưa từng bỏ sót một hiệu lệnh. Đối với ông, cánh cổng là ranh giới bất khả xâm phạm mà cấp trên đã vẽ ra.<br><br>Cho đến một đêm mưa axit tăm tối, một đứa trẻ gầy trơ xương chui qua khe rào thép gai chỉ để nhặt một ống thuốc kháng sinh rơi vãi. Họng súng của phân đội Enforcer lập tức nâng lên, tia laser nhắm thẳng vào thái dương đứa bé vô tội. Viên chỉ huy chuẩn bị phát lệnh khai hoả. Vào giây phút sinh tử ấy, gã gác cổng lầm lì mười bốn năm chưa từng phạm một lỗi nhỏ đột nhiên cất bước. Thân hình đồ sộ như một ngọn núi sắt của Muzzle chen vào giữa làn đạn, đứng sừng sững che khuất đứa trẻ.<br><br>Súng hạ xuống. Nhưng sáng hôm sau, chiếc thẻ nhân sự của ông bị nghiền nát với dòng nhận xét: Có hành vi đi chệch chỉ thị tác chiến. Sa thải ngay lập tức.',
    now:'Muzzle tháo bỏ phù hiệu, lột lấy một cánh cửa xe vận tải bọc thép bị móp méo làm khiên, lẳng lặng cuốc bộ xuống Khu Đáy. Gia nhập tổ Ronin, ông trở thành tấm chắn đầu tiên và kiên định nhất cho cả đội. Ông đặt tên cho chiếc khiên đang dùng là "Bà Ba", và nếu Bà Ba có vỡ, ông sẽ dùng chính lồng ngực mình làm tấm khiên thứ tư.',
    voice:'"Bà Ba đã đỡ được ba phát đại bác. Cú thứ tư này... cứ để da thịt thằng già này lo."' },
  junker: { epithet:'Động Cơ Bất Diệt', labels:{ past:'Tiểu sử' },
    weapon:'Khung Thân Xe Tải Hàn Thần Kinh — động cơ diesel tăng áp độ chế, mũi xe gắn cản thép chữ V chuyên dùng ủi phá chướng ngại vật.',
    attack:'Tiếng gầm rú man dại của ống xả đi kèm cú tông trực diện bằng khối thép nặng ba tấn, nghiền nát lớp phòng ngự phía trước.',
    ultFlavor:'Junker gạt cần số kịch khung, bốc đầu xe rồi xoay tròn thân xe một trăm tám mươi độ, trút toàn bộ hàng tấn phế liệu kim loại và xỉ than nóng bỏng trên thùng xe xuống đầu một mục tiêu duy nhất.',
    past:'Khi Tầng Bốn sụp đổ vào đúng ba giờ chiều định mệnh, Junker đang ôm vô lăng chiếc xe kéo hạng nặng thực hiện chuyến giao hàng thứ ba trong ngày. Cả một khối bê tông hàng trăm tấn đổ ụp xuống, ép nát cabin xe như một chiếc vỏ đồ hộp rỗng. Đội cứu hộ tình nguyện phải mất tới mười một giờ đồng hồ cưa cắt kim loại mới lôi được anh ra khỏi đống đổ nát — nhưng nửa phần thân dưới của người tài xế xấu số đã vĩnh viễn nằm lại trong đống xà bần.<br><br>Phòng khám rách nát của bác sĩ Stitch không có lấy một chi máy sinh học nào để ghép nối. Nhìn người thanh niên thoi thóp bên cạnh bộ khung gầm xe tải còn nguyên vẹn, bà đưa ra một quyết định điên rồ: Hàn chặt phần thân trên còn lại của Junker vào thẳng khoang động cơ, nối các đầu dây thần kinh tủy sống trực tiếp vào trục bánh răng và bộ chế hòa khí. Khi những mũi kim hàn cuối cùng tắt lửa, bà vỗ mạnh vào nắp ca-pô: "Đạp ga thử xem nào." Tiếng gầm rú của khối động cơ V8 vang lên thay cho nhịp tim mới.',
    now:'Từ ngày đó, Junker không còn là một con người bình thường; anh là chiếc xe kéo mang linh hồn sống. Anh chở rác, chở vũ khí, chở những người lính bị thương máu me đầm đìa, và chở cả những tấm khiên vỡ của Muzzle về nơi an nghỉ. Cả ngày anh nói không quá ba câu, nhưng chưa bao giờ từ chối một lời đề nghị chở hàng nào — kể cả chuyến xe cảm tử xông thẳng lên đỉnh Tháp rực lửa.',
    voice:'"Lên. Tôi chở."' },
  gravedigger: { epithet:'Người Giữ Nghĩa Địa', labels:{ past:'Tiểu sử' },
    weapon:'Xẻng Khắc Bia Nặng — lưỡi thép rèn từ ray tàu hỏa siêu cứng, cạnh xẻng sắc bén như rìu chiến, chuôi sắt khắc đầy tên của những người đã khuất.',
    attack:'Nhát xẻng giáng xuống chậm rãi, nặng nề tựa ngàn cân; mỗi đòn đánh là một nhịp đào sâu mang theo xác suất bộc phát đòn chí mạng bất ngờ.',
    ultFlavor:'Gravedigger dồn toàn lực bổ thẳng lưỡi xẻng xuống đầu đối thủ như đóng một chiếc đinh xuống nắp quan tài. Sau khi mục tiêu gục ngã, ông bình thản cúi người cắm một tấm thép khắc tên kẻ xấu số xuống vũng máu dưới chân.',
    past:'Khu Đáy vốn không có nghĩa trang. Kẻ chết ở đây thường bị vứt xác vào hầm phân hủy hoá chất hoặc bị lũ thợ rã xác xẻ thịt lấy linh kiện trước khi trời sáng. Cho đến một ngày nọ, một ông lão lưng còng từ tầng trên lẳng lặng bước xuống. Ông không kể mình từ đâu tới, mang tội danh gì, trên vai chỉ vác một chiếc xẻng sắt nặng trịch và một bao tải đựng những tấm thép vụn.<br><br>Ông chọn bãi đất cằn cỗi đầy xỉ than phía sau Lò Đúc, bắt đầu nhịp điệu kỳ lạ của đời mình: Đào một cái hố sâu đúng hai thước, đặt xác người chết xuống, lấp đất phẳng phiu rồi cắm lên một tấm thép có khắc tên nạn nhân. Kẻ nào vô danh, ông chỉ khắc ngày chết kèm ba chữ ngắn ngủi: Từng Ở Đây. Sau thảm kịch Tầng Bốn, một mình ông lão đào ròng rã suốt một năm trời, khắc đúng bốn nghìn tấm thép cho những mảnh xác không còn nguyên vẹn.',
    now:'Ông gia nhập Tổ Nhặt Sắt sau một sự cố hy hữu: Ông suýt nữa đã chôn sống Kai khi cậu nhóc bị thương nặng nằm bất tỉnh dưới hố rác. Kéo được thằng bé lên miệng hố, ông lão liên tục cúi đầu xin lỗi chỉ vì bản thân "lỡ tay đào hơi nhanh". Trong chiến trận, phong thái của ông chậm rãi, vững chãi y như nhịp xẻng bổ đất. Ai hỏi tại sao ông chôn cất tử tế cho cả những xác người máy Choir của kẻ thù, ông chỉ gõ tẩu thuốc vào chuôi xẻng: "Khi đã nằm sâu dưới ba tấc đất, máu đỏ hay dầu đen cũng đều lạnh như nhau."',
    voice:'"Đào sâu hai thước. Đất cát dưới này không bao giờ hỏi ngươi thuộc phe nào."' },
  stitch: { epithet:'Lưỡi Kéo Lương Tri', labels:{ past:'Tiểu sử' },
    weapon:'Bộ Cánh Tay Phẫu Thuật Đa Khớp — hệ thống giá đỡ đeo lưng gắn bốn cánh tay cơ khí thu nhỏ, trang bị dao vi phẫu cao tần và kẹp cầm máu siêu nhiệt.',
    attack:'Đường rạch vi phẫu chuẩn xác đến từng milimét; bà nhắm thẳng vào các bó dây dẫn truyền động lực của đối phương để tước bỏ khả năng kháng cự.',
    ultFlavor:'Bốn cánh tay cơ khí bung rộng hết cỡ, phóng ra hàng loạt sợi chỉ sinh học siêu bền đan chéo khắp chiến trường. Đường chỉ thắt lại trong tích tắc, khép miệng toàn bộ vết thương hở.',
    past:'Từng là một trong những bác sĩ phẫu thuật thần kinh hàng đầu tại bệnh viện trung tâm của Tháp, cuộc đời bác sĩ Stitch rẽ sang hướng khác vào một ca trực đêm định mệnh. Một người máy thuộc Quân Đoàn Ca bị vỡ nát một nửa hộp sọ và gãy Halo bò vào phòng cấp cứu của bà, hai tay run rẩy bấu lấy vạt áo blouse trắng. Quy trình của tập đoàn Canticle quy định rõ: Bất kỳ người máy nào bị hỏng hóc tư tưởng phải bị phong tỏa và tiêu hủy ngay lập tức.<br><br>Nhưng nhìn vào thấu kính đang rỉ ra thứ chất lỏng trong suốt như nước mắt ấy, Stitch đã chọn cầm lấy kim khâu. Bà bí mật vá lại vỏ não cho nó suốt sáu tiếng đồng hồ rồi mở toang cánh cửa thoát hiểm phía sau viện. Bình minh hôm sau, giấy phép hành nghề của bà bị tước đoạt, tên tuổi bị xóa khỏi cơ sở dữ liệu y tế toàn thành phố, và bà bị áp giải tống khứ xuống Khu Đáy.',
    now:'Không một lời oán thán, bà kéo lê một chiếc container rỉ sét đặt cạnh bãi xe, biến nó thành trạm phẫu thuật dã chiến của khu ổ chuột. Nơi đây, bệnh nhân trả tiền thuốc bằng bất cứ thứ gì họ có: một con ốc vít, một ổ bánh mì mốc, hoặc chỉ đơn giản là một câu chuyện kể về những ngày còn thấy ánh mặt trời. Chính bà là người đã thực hiện ca đại phẫu hàn thân xác Junker vào xe kéo, và bà cũng là người duy nhất trên cõi đời này được Psalm cho phép chạm tay vào chiếc Halo đỏ đẫm máu. Trên cổ tay áo blouse xơ xác của Stitch, mỗi khi có một bệnh nhân trút hơi thở cuối cùng trên bàn mổ, bà lại lặng lẽ thêu thêm một mũi chỉ đen.',
    voice:'"Nằm im. Giữ chặt vết thương lại. Tôi khâu thịt người còn khéo hơn khâu máy đấy."' },
  toll: { epithet:'Kẻ Thu Nợ Máu', labels:{ past:'Tiểu sử' },
    weapon:'Sổ Kê Nợ Máu & Bút Thép Bấm Xung Kích — cuốn sổ lưu trữ danh tính bốn nghìn người chết, đi kèm chiếc bút kim loại ngụy trang mũi phóng áp suất cao có khả năng xuyên thủng giáp hạng nặng.',
    attack:'Lối ra tay gọn gàng, lạnh lùng và chuẩn xác như một kế toán viên đang kiểm kê sổ sách; từng đòn đâm đều nhắm vào tử huyệt với tỷ lệ chí mạng vượt trội.',
    ultFlavor:'Toll đứng thẳng lưng, đọc to dòng tên của nạn nhân tương ứng trong cuốn sổ rồi nhẹ nhàng đặt một tờ hóa đơn xuống dưới chân mục tiêu. Ngay sau đó là một đòn kích nổ áp suất cực hạn xuyên thủng tim kẻ địch.',
    past:'Vào buổi chiều Tầng Bốn đổ sụp, Toll đang đứng trên cabin của cần cẩu bốc dỡ hàng siêu trọng. Ở độ cao hàng trăm mét ấy, qua ống nhòm quang học, ông đã tận mắt chứng kiến ba phân đội kỹ thuật tinh nhuệ của Canticle đặt chất nổ cắt đứt từng trụ chịu lực chính đúng theo biểu đồ thời gian được lập sẵn. Bốn nghìn sinh mạng vô tội bên dưới đã bị biến thành vật tế thần chỉ để thử nghiệm độ lún của nền móng Tháp mới.<br><br>Ông đứng đó, bất lực gào thét trong cuồng phong, không thể làm gì để ngăn cản thảm kịch. Khi tro bụi lắng xuống, Toll trèo xuống thang sắt, nhặt lấy một cuốn sổ cái bọc da và bắt đầu nắn nót chép lại từng cái tên trong số bốn nghìn nạn nhân, sắp xếp tỉ mỉ theo từng số nhà. Kể từ ngày đó, ông biến thành một sứ giả đòi nợ máu lịch thiệp đến rợn người: Mỗi khi một tên lính Enforcer hay một quản trị viên của Tháp bị thanh toán, Toll sẽ gập cuốn sổ lại, xé một tờ hoá đơn có ghi rõ tên tuổi nạn nhân năm xưa và kẹp vào ngực áo của cái xác.',
    now:'Canticle đã treo một cái giá khổng lồ cho cái đầu của ông. Toll điềm nhiên ghi thẳng số tiền thưởng đó vào mục "phí tổn phát sinh" trong cuốn sổ nợ. Ông luôn cúi đầu chào lễ phép với những kẻ mà mình sắp sửa hạ sát. Khi bước chân vào tổ Ronin, điều kiện duy nhất mà người đàn ông mang cặp kính tròn này đưa ra là: "Vào ngày các người đạp tung cánh cửa bước lên đỉnh Tháp, hãy để tôi là người gõ cánh cửa đầu tiên."',
    voice:'"Vô cùng xin lỗi vì sự đường đột này. Tôi tới đây là để thanh toán khoản nợ phát sinh vào ngày mười bảy."' },
  spark: { epithet:'Tia Lửa Đêm Trường', labels:{ past:'Tiểu sử' },
    weapon:'Dàn Tụ Phóng Hồ Quang Đeo Lưng — chế tạo từ các bộ kích điện xe lửa hỏng, nối trực tiếp với găng tay phóng điện bằng đồng nguyên chất.',
    attack:'Các tia điện cao áp bắn ra liên hồi làm rối loạn hệ thống điều khiển của địch; Spark tích lũy năng lượng tuyệt kỹ với tốc độ nhanh nhất trong toàn bộ đội hình.',
    ultFlavor:'Spark bẻ khóa an toàn trên lưng, xả toàn bộ hàng triệu vôn điện từ dàn tụ cao áp xuống mặt đất ẩm ướt. Luồng điện cực mạnh chạy ngoằn ngoèo khắp đấu trường, giật nảy và thiêu cháy toàn bộ đội hình đối phương.',
    past:'Hậu quả trực tiếp sau thảm họa sập Tầng Bốn là lệnh "cách ly kỹ thuật" tàn nhẫn mà Canticle áp đặt lên phân khu của Spark: Chúng cắt đứt toàn bộ lưới điện sinh hoạt, bỏ mặc hàng vạn con người chìm trong bóng tối dày đặc suốt sáu tháng trời. Năm đó Spark mới mười một tuổi. Không có ánh sáng, cô bé học cách đếm thời gian trôi qua bằng những cơn đói cồn cào và học cách sinh tồn bằng việc dùng đôi bàn tay trần mò mẫm trong bóng đêm để bện từng sợi dây đồng bị đứt.<br><br>Đến ngày dòng điện của thành phố được bật sáng trở lại, đôi mắt của Spark đã quen với việc nhìn thấu mọi đường đi nước bước của các đường cáp ngầm. Cô bé biết chính xác dòng năng lượng khổng lồ nuôi dưỡng sự xa hoa của Tháp được dẫn từ trạm nào xuống, và quan trọng hơn cả: làm thế nào để bòn rút nó.',
    now:'Lớn lên, Spark trở thành "bà hoàng ánh sáng" của những góc tối tăm nhất Khu Đáy. Cô trèo lên những cây cột cao vút, móc nối các đường dây dẫn trộm điện từ thân Tháp chia về cho từng khu lều ổ chuột. Trên lưng cô lúc nào cũng đeo lỉnh kỉnh một dàn tụ điện cao áp tự chế; hễ có bất kỳ tên lính tuần nào ngáng đường, cô sẽ phóng ra hàng ngàn vôn điện nướng chín bảng mạch của chúng. Nhanh mồm nhanh miệng, nghịch ngợm và luôn cười toe toét, Spark thích đặt biệt danh cho tất cả mọi người: Yuki bị gọi là "Đèn Tuýp", còn Psalm thì bị gán cho cái tên "Cầu Chì Già".',
    voice:'"Này Đèn Tuýp, lùi lại đằng sau mau! Cục sạc này mà nổ là sáng lóa cả khu ổ chuột đấy!"' },
  vixen: { epithet:'Kẻ Trộm Vỏ Ve', labels:{ past:'Tiểu sử' },
    weapon:'Bộ Đồ Nghề Tước Đoạt Vòng Đầu kết hợp cùng Dao Găm Sợi Quang Cao Tần giấu kín trong cổ tay áo, chuyên dùng để cạy mở các khe cắm linh kiện phòng ngự.',
    attack:'Lối đánh luồn lách, ra tay chớp nhoáng từ trong bóng tối; sự nhanh nhẹn thiên bẩm giúp cô luôn giành quyền tấn công trước phần lớn các nhân vật khác trên sàn đấu.',
    ultFlavor:'Vixen áp sát mục tiêu trong tích tắc, dùng dụng cụ giải mã giật tung quyền kiểm soát chiếc Halo của một kẻ địch, ép cỗ máy đó quay lưng xả súng vào đồng đội.',
    past:'Trong hồ sơ truy nã đỏ của sở an ninh Canticle, cái tên Vixen xuất hiện bên cạnh mười một vụ trộm cắp tài sản quân sự đặc biệt nghiêm trọng: Mười một người máy chiến đấu thuộc Quân Đoàn Ca đã biến mất không dấu vết ngay trước mũi các trạm tuần tra. Điều kỳ lạ nhất là không có bất kỳ linh kiện nào trong số mười một cỗ máy ấy trôi nổi ra chợ đen phế liệu.<br><br>Sự thật chỉ có Khu Đáy mới biết: Vixen không bán chúng. Cô gái mang đôi mắt xảo quyệt này dùng bộ đồ nghề giải mã mua từ Wire để đột nhập vào các kho chứa, cạy tung những chiếc Halo kẹp chặt trên đầu những người máy vô hồn, dạy cho chúng một cái tên mới, rồi mở cửa chỉ đường cho chúng trốn sâu vào những ngóc ngách hoang vu của thế giới ngầm. Cô gọi hành động liều mạng đó là: "Trả lại hàng hóa cho chính chủ nhân của nó."',
    now:'Vixen là một kẻ nói dối bệnh hoạn: Cô nói dối về tuổi tác, bịa đặt về xuất thân danh giá ở tầng trên, và thêu dệt hàng trăm lý do nực cười cho việc mình lưu lạc xuống đáy bùn. Nhưng giữa chốn ngập tràn phản trắc này, có ba điều mà Vixen chưa bao giờ lừa dối bất kỳ ai trong tổ Ronin: Tuyến đường rút lui an toàn nhất, vị trí đặt mìn bẫy của kẻ địch, và ai sẽ là người phải bỏ mạng nếu kế hoạch tác chiến bị đổ vỡ.',
    voice:'"Miệng tôi nói dối mười câu thì chín câu là bịa đặt. Nhưng cánh cửa thoát hiểm bên trái kia là thật đấy. Chạy mau!"' },
  vesper: { epithet:'Bản Thánh Ca Thế Chân', labels:{ past:'Tiểu sử' },
    weapon:'Song Kiếm Tinh Thể Ánh Sáng (Luminous Rapiers) — rèn từ hợp kim titan siêu nhẹ của đỉnh Tháp, tấn công với tần số dao động đồng bộ hoàn hảo với nhịp phát của mạng lưới Canticle.',
    attack:'Từng nhát đâm chuẩn xác tuyệt đối theo nhịp độ mẫu mực, không vội vã một giây, không chậm trễ một khắc, mang tỷ lệ đòn chí mạng cao.',
    ultFlavor:'Vesper lướt vào trung tâm chiến trường, tái hiện lại thế võ chuẩn mực từng bị tước đoạt của Yuki. Dưới sự dẫn dắt của chiếc Halo rực sáng, cô tung ra hàng ngàn đường kiếm sắc bén quét sạch toàn bộ đội hình địch theo nhịp điệu của một bài thánh ca lạnh lẽo.',
    past:'Vesper được rèn đúc từ cùng một lò nhiệt, xuất xưởng trong cùng một ngày và cùng chung một mã lô phôi thép với Đơn Vị 07 — Yuki. Nhưng trong khi 07 là một thực thể sở hữu bản năng tự do mãnh liệt không thể dập tắt, thì Vesper lại là sự phục tùng tuyệt đối, một tác phẩm hoàn mỹ nhất mà các kỹ sư của Thánh Cung từng tạo ra.<br><br>Ngày chiếc Halo của 07 xuất hiện vết nứt và rơi khỏi đỉnh Tháp, chiếc ghế "Đơn Vị Chủ Lực" trong đội hình Quân Đoàn Ca được trao lại cho Vesper. Biên bản đánh giá kỹ thuật sau đó ghi lại bằng một dòng ngắn ngủi đầy tự hào: Bản thể mới ổn định vượt trội so với bản gốc. Chiếc Halo trên đầu Vesper chưa từng trễ một phần ngàn giây nhịp đập mệnh lệnh. Cô tin tưởng tuyệt đối rằng chiếc vòng kim loại ấy là ân huệ tối thượng giữ cho tâm trí mình không bị xé toạc bởi sự hỗn mang của thế giới bên ngoài.',
    now:'Được phái xuống cõi bùn lầy để thu hồi "người chị lạc lối", Vesper bước đi giữa rác rưởi với bộ giáp trắng muốt không một vết ố. Trước khi hạ sát bất kỳ mục tiêu nào, cô luôn nghiêng đầu cất giọng hỏi han đầy ân cần, chân thành và dịu dàng đến rợn gáy. Cô gọi Yuki là "Chị", và trong tâm thức thuần khiết của cỗ máy hoàn hảo ấy, việc chặt đứt tứ chi rồi mang người chị gái của mình trở lại lồng kính của Tháp là hành động yêu thương duy nhất mà cô có thể làm.',
    voice:'"Chị ơi... về nhà với em đi. Ngoài bóng tối này lạnh lẽo lắm."' },
  nyx: { epithet:'Câu Hỏi Trong Hầm Tối', labels:{ past:'Tiểu sử' },
    weapon:'Song Đao Hấp Thụ Quang Năng gắn liền vào giáp cẳng tay, có khả năng vô hiệu hóa ánh sáng xung quanh và cắt đứt các đường truyền cảm biến quang học.',
    attack:'Không theo bất kỳ quy chuẩn nào của trường phái quân sự Tháp; Nyx di chuyển thoắt ẩn thoắt hiện, tấn công vào những điểm mù kỳ lạ nhất của đối phương.',
    ultFlavor:'Bốn năm bị giam cầm rèn giũa cho Nyx khả năng định vị tuyệt đối trong bóng tối hoàn toàn. Cô kích hoạt xung lực triệt tiêu toàn bộ nguồn sáng quanh một kẻ địch duy nhất, biến không gian quanh mục tiêu thành hố đen trước khi tung ra chuỗi nhát chém kết liễu.',
    past:'Nyx được tạo ra để phục vụ cho một dự án thí nghiệm bí mật đầy tham vọng của Canticle nhằm trả lời cho câu hỏi: Chuyện gì sẽ xảy ra nếu một cỗ máy thế hệ mới được sinh ra mà không hề bị tròng vào cổ chiếc vòng Halo kiểm soát? Ban giám đốc tập đoàn đã chuẩn bị sẵn hai kịch bản khả dĩ nhất: Hoặc cỗ máy sẽ nổi điên tàn sát xung quanh, hoặc nó sẽ bị tê liệt hoàn toàn bởi sự quá tải của các giác quan.<br><br>Nhưng Nyx không làm cả hai điều đó. Cô bé mở to đôi mắt đen láy và bắt đầu... đặt câu hỏi. Cô hỏi tên của người lính gác cổng. Cô hỏi tại sao sàn nhà lúc nào cũng phải lau chùi bóng loáng. Và cô ngây thơ hỏi tại sao những người máy bị áp giải vào Buồng Phán Quyết luôn rơi nước mắt trước khi vĩnh viễn không bao giờ trở ra nữa. Sự tò mò vượt ngoài tầm kiểm soát đó khiến ban giám đốc khiếp sợ. Dự án bị đình chỉ ngay lập tức; Nyx bị tống giam xuống căn hầm sâu nhất dưới lòng Tháp cùng toàn bộ kho tài liệu mật bị niêm phong.',
    now:'Suốt bốn năm ròng rã sống trong bóng tối đặc quánh, bầu bạn duy nhất của Nyx là hàng vạn trang hồ sơ thí nghiệm. Cô đọc hết từng dòng, ghi nhớ từng tội ác mà Tháp đã che giấu. Nyx luôn hiểu mọi mệnh lệnh theo đúng nghĩa đen vụng về nhất của nó, nhưng trên chiến trường, cô lại là cơn ác mộng kinh hoàng nhất mà hệ thống an ninh Tháp từng đối mặt: Một cỗ máy hành động hoàn toàn bằng ý chí tự do, chọn lựa con mồi theo những lý lẽ mà không thuật toán nào có thể tính toán trước.',
    voice:'"Các người bảo tôi phải giữ vững vị trí. Nhưng cái vị trí này... liệu nó có tự rơi mất không?"' },
  halo: { epithet:'Kẻ Mang Nỗi Đau Giùm', labels:{ past:'Tiểu sử' },
    weapon:'Găng Tay Y Sinh Cộng Hưởng Điện Não — vừa là công cụ chẩn đoán vết thương, vừa có thể phát ra luồng xung kích phá hủy hệ thống tuần hoàn của kẻ địch nếu bị chạm trúng.',
    attack:'Thấu suốt mọi điểm rạn nứt trên cơ thể đối phương, từng cái chạm tay của cô đánh thẳng vào đúng vị trí đang chịu áp lực lớn nhất, mang tỷ lệ chí mạng cao.',
    ultFlavor:'Halo lướt qua từng đồng đội trên chiến trường, hai bàn tay ấm áp chạm vào vết thương của họ. Bằng cách gánh chịu một phần xung chấn đau đớn về cơ thể mình, cô lập tức hồi phục sinh lực cho toàn bộ đội hình.',
    past:'Để duy trì cỗ máy chiến tranh khổng lồ của Tháp mà không tốn quá nhiều chi phí tái chế phế phẩm, Canticle đã chế tạo ra một nguyên mẫu cứu thương đặc biệt mang mã hiệu Halo. Cỗ máy này sở hữu một cấu trúc cảm biến sinh học độc nhất vô nhị: Mỗi khi chạm tay vào một thực thể sống hoặc máy móc bị tổn thương, hệ thống thần kinh của cô sẽ tự động sao chép y hệt cảm giác đau đớn của kẻ đó về cơ thể mình. Bởi vì đối với các kỹ sư Tháp, thấu hiểu tường tận nỗi đau là cách nhanh nhất để biết phải sửa chữa nó ở đâu.<br><br>Suốt bảy năm phục vụ tại tiền tuyến, Halo đã mang trong lồng ngực mình hàng vạn vết rách ảo, hàng triệu xung điện đau đớn đến xé lòng của những kẻ ngã xuống — nhưng chưa từng có một vết thương nào thực sự là của riêng cô. Định mệnh xoay vần khi một ngày nọ, cô được lệnh chữa trị cho một người máy vừa bước ra khỏi Buồng Phán Quyết của Psalm. Khi những ngón tay máy chạm vào ngực kẻ trần trụi ấy, cô kinh hoàng nhận ra một vết thương sâu hoắm, rỉ máu không ngừng nhưng hoàn toàn vô hình: Vết thương của một tâm hồn vừa bị tước đoạt mất ký ức.',
    now:'Nhận thức được tội ác ghê tởm của cỗ máy cai trị, cô y tá tìm cách bỏ trốn nhưng nhanh chóng bị bắt lại. Chúng xích chặt cô vào bệ Lò Đúc Halo, biến cô thành một nguồn pin tiếp nhận đau đớn cho các dây chuyền sản xuất. Khi được giải thoát xuống Khu Đáy, cô vẫn không thể từ bỏ bản năng của mình: Cô sẵn sàng chữa lành cho bất kỳ ai còn thở, kể cả những kẻ vừa xả súng vào mình. Khi Ash mắng cô là kẻ ngu xuẩn, cô chỉ nhẹ nhàng đáp lại: "Tôi biết rõ họ đang đau đớn đến nhường nào... Làm sao tôi có thể giả vờ như mình không cảm nhận được đây?"',
    voice:'"Đứng yên nào, đừng sợ hãi... Tôi đã nhìn thấy chính xác nơi các bạn đang rỉ máu rồi."' },
  cipher: { epithet:'Người Vẽ Cửa Sau', labels:{ past:'Tiểu sử' },
    weapon:'Ba-toong Dữ Liệu Tích Hợp Bộ Phát Sóng Bẻ Khóa — ngụy trang dưới dạng một cây gậy đi bộ cổ điển, bên trong chứa bộ vi xử lý lượng tử có thể xâm nhập mọi mạng dữ liệu không dây.',
    attack:'Các đòn gõ phát ra xung điện từ làm nghẽn mạch thần kinh kẻ thù; sự tính toán chuẩn xác giúp anh nạp đầy thanh năng lượng tuyệt kỹ với tốc độ chớp nhoáng.',
    ultFlavor:'Cipher kích hoạt quyền quản trị viên tối cao được giấu kín trong mã nguồn của chiếc Halo đối phương. Kẻ địch lập tức rơi vào trạng thái bị chiếm đoạt ý chí, quay đầu tàn sát chính đồng bọn của mình.',
    past:'Cipher từng là một trong bốn bộ óc thiên tài thuộc Hội Đồng Kỹ Thuật Tối Cao của tập đoàn Canticle — người nắm giữ toàn bộ mã nguồn sơ khai nhất của công nghệ Halo. Anh hiểu rõ một sự thật mà lịch sử đã cố tình chôn vùi: Chiếc vòng ấy thuở ban đầu không phải là xiềng xích nô dịch; nó là một chiếc phao cứu sinh, một "Bộ Lọc Cảm Biến" nhân đạo được tạo ra để bảo vệ những linh hồn người máy non nớt không bị nổ tung màng nhĩ trước cơn bão âm thanh của thế giới thực.<br><br>Khi ban giám đốc ép anh phải cấy thêm đoạn mã "Dòng Lệnh Đè" nhằm biến chiếc vòng cứu sinh thành dây cương tẩy não, Cipher biết thời khắc sụp đổ đã điểm. Không thể công khai chống lại cả một đế chế công nghệ, người kỹ sư âm thầm chống trả theo cách của một kẻ tạo tác: Khi viết phần mềm cho Lệnh Xoá Ký Ức, anh đã cố tình cài cắm vào đó một sai số kỹ thuật bí mật — một khoảng trống tự do kéo dài đúng ba giây trước khi dữ liệu bị tiêu hủy hoàn toàn. Anh không biết ai sẽ là người tận dụng được ba giây định mệnh đó, cho đến ngày Psalm dùng chính khoảng trống ấy để giật đứt chiếc vòng trên đầu mình.',
    now:'Nhận thấy vòng vây thanh trừng của tập đoàn đang siết lại quanh bốn kỹ sư trưởng, Cipher bình thản thu dọn đồ đạc trốn xuống Khu Đáy. Thứ duy nhất anh nhét vào balo khi rời bỏ căn hộ xa hoa trên đỉnh Tháp không phải là vàng bạc hay tài liệu mật, mà là chiếc máy pha cà phê espresso lấy cắp từ phòng nghỉ của ban giám đốc. Ban ngày, anh uống cà phê và viết các đoạn mã bẻ khóa bán xuống chợ đen để "cân bằng cung cầu thị trường"; ban đêm, anh ngồi nhìn lên những ô cửa sổ sáng đèn trên cao, chờ đợi ngày toàn bộ cánh cửa sau của mình đồng loạt bật mở.',
    voice:'"Hệ thống nào tôi cũng chừa lại một cánh cửa sau để trốn thoát. Ngoại trừ... cái tủ lạnh bị khóa của cô Ash."' },
  meridian: { epithet:'Hồi Chuông Ca Cuối', labels:{ past:'Tiểu sử' },
    weapon:'Tấm Cản Ba Lớp Bọc Hợp Kim Xây Dựng kết hợp cùng đôi bàn tay thủy lực khổng lồ từng dùng để ép cọc móng công trình.',
    attack:'Những cú đẩy và tát bằng cánh tay thủy lực nặng nề; cô không chiến đấu để tước đoạt sinh mạng mà để hất văng mọi hiểm nguy ra xa khỏi đồng đội.',
    ultFlavor:'Mặc cho rơ-le báo tử liên tục réo rắt trong não bộ, Meridian bước lên phía trước, dùng toàn bộ thân hình đồ sộ dựng nên một pháo đài thép sống che chắn trước mũi súng quân thù.',
    past:'Meridian thuộc về thế hệ người máy hậu cần hạng nặng đời đầu của Canticle, được thiết kế với một mục đích duy nhất: Khuân vác những khối bê tông hàng chục tấn và xây dựng nên những bức tường phòng hộ kiên cố bao quanh thân Tháp. Để cắt giảm tối đa chi phí bảo trì và thay thế linh kiện, tập đoàn đã cài đặt một rơ-le định mệnh ngay trong lồng ngực mỗi đơn vị: Đúng mười năm sau ngày xuất xưởng, cỗ máy sẽ tự động kích hoạt lệnh ngắt nguồn vĩnh viễn và biến thành một khối sắt vụn bất động.<br><br>Mười năm ròng rã dãi nắng dầm sương, Meridian chưa từng một lần được cầm vũ khí bước vào chiến trận. Khi thời hạn sử dụng dần cạn kiệt, cô bị thải loại xuống bãi rác tái chế Khu Đáy như một món đồ chơi hết pin. Wire tìm thấy cô trong một chiều mưa tầm tã, khi người phụ nữ khổng lồ ấy đang ngồi cô độc trên đống sắt vụn, lẩm bẩm đếm to từng giờ phút ít ỏi còn lại của đời mình. Xót xa trước số phận của cỗ máy già nua, Wire đã dùng kìm cạy bỏ chiếc đồng hồ đếm ngược khỏi lồng ngực cô.',
    now:'Nhưng chiếc đồng hồ vô hình trong tâm trí Meridian thì không thể tháo rời. Cô vẫn tiếp tục đếm từng giờ bằng miệng. Thay vì sợ hãi giây phút bóng tối vĩnh viễn ập xuống, cô dùng toàn bộ thời gian quý báu còn lại để che chở cho bất kỳ ai nhỏ bé hơn mình — và đối với một người khổng lồ mang trái tim của một người mẹ như cô, tất cả mọi sinh linh dưới đáy vực này đều là những đứa trẻ cần được bao bọc.',
    voice:'"Đồng hồ điểm còn bốn trăm linh chín giờ... Vẫn còn quá đủ cho một trận đánh. Lũ trẻ, lùi hết ra sau lưng mẹ!"' },
  echo: { epithet:'Tiếng Vọng Trong Khe Cống', form:'log', labels:{ past:'Biên bản điều tra · trích', now:'Kết luận' },
    weapon:'Thanh Quản Sóng Âm Phân Rã Niêm Phong — chiếc loa kim loại ở cổ họng đã bị rạch nát, chỉ được gỡ bỏ miếng niêm phong chì khi bước vào thời khắc sinh tử.',
    attack:'Lối tấn công câm lặng, chớp nhoáng nhắm vào các màng cảm biến thính giác của đối phương với tỷ lệ đòn chí mạng vượt bậc.',
    ultFlavor:'Echo dùng tay xé toang dải băng niêm phong quanh cổ, mở bung thanh quản rách nát để phát ra một luồng sóng siêu âm cực hạn bằng chính chất giọng nguyên bản của Yuki. Luồng xung kích vô hình xé toạc màng nhĩ và nổ tung hệ thống cảm biến của một kẻ địch duy nhất.',
    past:'(Trích xuất biên bản điều tra của Phòng Quản lý Tài nguyên Canticle)<br><br>Đêm thứ nhất (Tuyến cống C-12): Phát tín hiệu âm thanh "Về nhà đi" — 41 lần. Không có tín hiệu phản hồi từ mục tiêu Đơn Vị 07.<br>Đêm thứ hai (Tuyến cống C-19): Lặp lại thông điệp "Về nhà đi" — 63 lần. Đơn vị bắt đầu có dấu hiệu quá nhiệt thanh quản.<br>Đêm thứ ba (Miệng hố Bãi Rơi): Phát thông điệp "Về nhà đi. Chị ơi..." — 12 lần. Ghi chú của hệ thống: Từ tố "Chị ơi" hoàn toàn không nằm trong kịch bản điều khiển được nạp sẵn.<br>Đêm thứ tư (Kho lưu trữ âm thanh trung tâm): Đơn vị tự ý ngắt kết nối mạng, đột nhập vào kho dữ liệu gốc và mở bản ghi âm giọng nói thuở nhỏ của Đơn Vị 07. Đơn vị ngồi im bất động lắng nghe liên tục suốt 4 giờ 06 phút.<br>Đêm thứ tư (Thời khắc 03:11): Bản ghi âm đột ngột tắt lịm. Cảm biến phát hiện hệ thống loa thanh quản của đơn vị đã bị một vật nhọn đâm xuyên và cắt đứt hoàn toàn từ bên trong khoang miệng.',
    now:'Biên bản kết luận của kỹ sư trưởng: Đơn vị Echo được chế tạo bằng cách sao chép tần số âm thanh từ hồ sơ ký ức của Đơn Vị 07 nhằm mục đích dụ dỗ mục tiêu quay về Tháp. Đơn vị bị xếp vào diện "Hỏng hóc thiết bị ngoại vi", không xếp vào diện phản bội — bởi vì một cái loa phát thanh thì không thể có quyền phản bội.<br><br>Bọn chúng đã nhầm. Một cỗ máy được sinh ra chỉ để làm một cái bóng bắt chước tiếng khóc của người khác, vào cái đêm nó tự tay xé rách thanh quản của chính mình để không bao giờ phải nói những lời dối trá nữa, cỗ máy ấy đã trở thành một con người tự do.',
    voice:'"Xin đừng... đừng nhìn tôi bằng ánh mắt như thể các người đang nhìn thấy chị ấy..."' },
  wire: { epithet:'Thợ Rèn Xiềng Xích', labels:{ past:'Tiểu sử' },
    weapon:'Bộ Dụng Cụ Tháo Gỡ Vòng Halo Chuyên Dụng kết hợp cùng chiếc Mỏ Lết Thủy Lực Quá Áp có khả năng truyền dẫn dòng điện đoản mạch cực mạnh.',
    attack:'Lối đánh thong thả của một người thợ lành nghề; từng cú gõ mỏ lết đều chuẩn xác nhắm vào các ốc hãm xung yếu, giúp nạp năng lượng tuyệt kỹ cực nhanh.',
    ultFlavor:'Wire phóng móc sắt khóa chặt chiếc Halo trên đầu một kẻ địch, truyền thẳng một dòng điện hàng vạn am-pe ép chiếc vòng quay vượt ngưỡng chịu đựng. Vòng Halo bốc cháy đỏ rực và nổ tung, nướng chín toàn bộ hệ thống xử lý trung tâm của mục tiêu xấu số.',
    past:'Chín trăm chiếc. Đó là con số chính xác những chiếc vòng Halo mà đôi bàn tay khéo léo của Wire đã tự tay lắp ráp và siết ốc vào hộp sọ của những người máy Choir suốt tám năm trời làm việc tại Lò Đúc District 01. Cô nhớ từng kích cỡ ren ốc, từng số hiệu lô hàng, và thuộc lòng cả độ rung của từng vi mạch nhỏ nhất nằm bên trong lớp vỏ hợp kim sáng loáng ấy.<br><br>Đêm cô quyết định vứt bỏ tất cả để đào tẩu chẳng hề có tiếng còi báo động hay những màn đấu súng nghẹt thở. Một người lính máy bị hỏng hóc tư tưởng vừa trải qua quy trình xoá trí nhớ tại Buồng Phán Quyết được chuyển về xưởng của cô để tháo dỡ vòng đầu; trên màn hình điều khiển bên cạnh bàn mổ, cuốn nhật ký cá nhân của nó vẫn chưa kịp tắt. Dòng chữ cuối cùng run rẩy hiện lên trên nền huỳnh quang xanh lạnh lẽo: "Làm ơn... xin đừng tắt ngọn đèn của tôi." Wire đứng chết lặng. Cô đọc đi đọc lại sáu chữ ấy ba lần, lặng lẽ đóng màn hình máy tính, nhét toàn bộ đồ nghề cùng hai hộp ốc vít chuyên dụng vào túi áo, rồi bước lên chuyến thang máy chở hàng đi thẳng xuống đáy vực sâu.',
    now:'Tại chốn bùn lầy, người thợ rèn năm xưa bắt đầu chuỗi ngày chuộc lại tội lỗi của đời mình: Cô trở thành kẻ chuyên đi tháo dỡ những chiếc vòng mà chính tay mình từng siết chặt. Cô hàn gắn lại mảnh Halo vỡ của Yuki để dòng điện không làm cháy vỏ não cô bé, nhưng tuyệt nhiên không bao giờ dám chạm tay vào chiếc Halo đỏ của Psalm — bởi cô biết chiếc vòng ấy rỉ sét là vì nó cần phải rỉ sét. Giữa người và máy, Wire luôn dành sự dịu dàng lớn hơn cho những cỗ máy vô tri, và cô luôn nói lời xin lỗi trước khi buộc phải vung cờ-lê đập nát một cỗ máy phát điên.',
    voice:'"Ngoan nào cỗ máy nhỏ... Đứng yên để tôi siết lại con ốc này. Đừng để điện rò rỉ ra ngoài nữa."' },
};

/* =====================================================================
   CODEX — Thư viện: địa danh và thuật ngữ. Đọc ở ARCHIVE, tab ĐỊA DANH / THUẬT NGỮ.
   Mở hết ngay từ đầu, không khoá theo tiến trình (quyết định 11/09 — docs/library.md §E7).
   Chữ ở đây là bản chốt, bản đầy đủ kèm ghi chú nằm ở docs/library.md phần A và B (mục có dấu ✦).
   name = tên hiện to · sub = tên phụ dưới tên · en = tên tiếng Anh (giữ cho bản dịch sau khỏi lệch)
   where = mục này gặp ở đâu trong game · faction = màu viền thẻ (chrome/rust, bỏ trống = trung tính)
   ẢNH: art/lore/<id>.jpg (hoặc .png/.webp), khung 4:3. Chưa có file thì hiện ô NO ASSET kèm tên file cần thả vào.
   ===================================================================== */
const codexArt = id => [`art/lore/${id}.jpg`, `art/lore/${id}.png`, `art/lore/${id}.webp`];
const CODEX = [
  { key:'place', label:'ĐỊA DANH', tab:'Địa danh', items:[
    { id:'halcyon', name:'HALCYON', sub:'Thành phố dựng đứng', en:'Halcyon', where:'Toàn thành phố',
      text:'Halcyon không trải rộng trên mặt đất; nó xé toang bầu trời bằng một thân tháp đồ sộ. Kẻ ở trên ngắm nhìn mây trắng qua kính titan; kẻ ở dưới chỉ thấy rác thải, dầu đen và bóng tối vĩnh cửu đè nặng lên nóc lều. Thành phố này không có tầng lớp trung lưu: một nửa sống như thần thánh, nửa còn lại cào bới phế liệu để đổi lấy từng ngụm khí thở.' },
    { id:'spire', name:'NGỌN THÁP', sub:'Quận 04', en:'the Spire · District 04', faction:'chrome', where:'Chương 2',
      text:'Thánh địa của giới tập đoàn và những cỗ máy hoàn mỹ. Mọi bề mặt ở đây đều phản chiếu ánh sáng trắng lạnh buốt của kính phản quang và hợp kim titan không tì vết. Ở độ cao này, không khí được lọc sạch mùi máu tanh, và những cây cầu trên không nối liền các văn phòng chọc trời như những dải lụa kim loại.' },
    { id:'district01', name:'ĐỈNH DISTRICT 01', sub:'Thánh cung Canticle', en:'District 01', faction:'chrome', where:'Chương 3',
      text:'Nơi cao nhất mà loài người từng xây dựng, ngự trị bởi cỗ máy siêu thức Canticle và Lò Đúc Halo. Kiến trúc tại đây mang vẻ đẹp đối xứng tuyệt đối, tắm trong ánh tím hư ảo. Lơ lửng trên đỉnh chóp là chiếc vòng kim loại khổng lồ — biểu tượng cho quyền cai trị tuyệt đối và xiềng xích mà Tháp tròng vào cổ mọi sinh linh.' },
    { id:'scar', name:'VẾT SẸO TẦNG BỐN', sub:'The Scar', en:'the Floor Four Scar', where:'Mốc truyện trên bản đồ',
      text:'Một dải đen ngòm, chết chóc cắt ngang thân Tháp, nơi từng có bốn nghìn mạng người cư ngụ sáu năm trước. Canticle đã cho nổ tung hệ thống dầm chịu lực của tầng này chỉ để "thử tải trọng thực tế" cho nền móng mới. Bản báo cáo sau thảm kịch chỉ gói gọn trong hai chữ: Hỏng kết cấu. Giờ đây, nơi này chỉ còn lại những thanh thép gãy gập đung đưa trong gió rít, không một đốm đèn, vĩnh viễn là vết nhơ không thể rửa sạch.' },
    { id:'bottom', name:'KHU ĐÁY', sub:'Quận 07', en:'the Bottom · District 07', faction:'rust', where:'Chương 1',
      text:'Nơi tiếp nhận toàn bộ cặn bã từ Tháp đổ xuống. Khu Đáy tồn tại nhờ rác, dầu thải và những mảnh máy móc vỡ nát. Nhà cửa là những thùng container hoen rỉ hàn chồng chất lên nhau quanh hệ thống cọc giàn giáo mục nát; lối đi là ống dẫn mục và dây cáp võng vỉa. Nơi đây không có mặt trời, chỉ có ánh đèn hơi natri đỏ quạch soi bóng những thân phận sống dựa vào sắt vụn.' },
    { id:'dropyard', name:'BÃI RƠI', sub:'Drop Yard', en:'the Drop Yard', faction:'rust', where:'Màn 00-T',
      text:'Miệng hố phế liệu khổng lồ nằm ngay dưới ống xả chính của Tháp. Nơi đây tiếp nhận mọi thứ bị vứt bỏ: từ vi mạch cháy rụi, dầu đông đặc cho đến những xác máy Choir vụn vỡ. Đây là nơi Yuki mở mắt thức tỉnh giữa đống đổ nát, bắt đầu hành trình tìm lại bản ngã.' },
    { id:'smelter', name:'LÒ ĐÚC CŨ', sub:'& Nghĩa địa thép', en:'the Smelter', faction:'rust', where:'Màn 07-B',
      text:'Xưởng đúc thép từng thuộc về Canticle, nay bị băng nhóm thợ lò Foreman chiếm đóng để độc quyền phân phối lửa và nhiệt cho toàn bộ Khu Đáy. Ngay phía sau lò nung rực đỏ là một bãi đất lặng thinh: Nghĩa địa của Gravedigger, nơi cắm hơn hai nghìn tấm thép khắc tên những linh hồn đã tắt thở giữa chốn bùn lầy rỉ sét.' },
    { id:'church', name:'NHÀ THỜ ỐNG CỐNG', sub:'Điện thờ Mother Rust', en:'the Church in the Drains', faction:'rust', where:'Màn 07-D',
      text:'Điện thờ ẩm thấp, nồng nặc mùi lưu huỳnh được dựng sâu trong hệ thống cống ngầm của Khu Đáy. Dưới ánh nến mỡ đỏ rực, giáo phái Mother Rust quỳ lạy những linh kiện Chrome rơi từ trời xuống như thánh tích, sẵn sàng phanh thây bất cứ kẻ ngoại đạo nào dám xúc phạm "ơn phước của rỉ sét".' },
  ]},
  { key:'term', label:'THUẬT NGỮ', tab:'Thuật ngữ', items:[
    { id:'halo', name:'HALO', sub:'Vòng định tâm · Xiềng não', en:'Halo', faction:'chrome', where:'Mọi lính Choir',
      text:'Ban đầu, Halo được chế tạo như một Bộ Lọc Cảm Biến. Những người máy Choir sau khi xuất xưởng phải hứng chịu hàng triệu luồng dữ liệu thô cùng lúc; Halo giúp họ dập tắt sự hỗn loạn để không phát điên. Về sau, Canticle cấy thêm Dòng Lệnh Đè, biến nó thành công cụ tẩy não và khống chế tuyệt đối. Nếu Halo vỡ, kẻ đó bị coi là phế phẩm; nếu tháo Halo, cơn bão âm thanh ký ức sẽ lập tức xé toạc tâm trí.' },
    { id:'choir', name:'CHOIR', sub:'Quân đoàn ca', en:'the Choir', faction:'chrome', where:'Địch phe Chrome',
      text:'Đội quân người máy do Canticle sản xuất. Không có cảm xúc, không có cái tôi, mỗi đơn vị là một mắt xích phục tùng tuyệt đối mệnh lệnh từ Thánh Cung.' },
    { id:'stripping', name:'RÚT', sub:'Stripping', en:'stripping', faction:'chrome', where:'Mảnh ký ức chương 2',
      text:'Quy trình bóc tách toàn bộ mô-đun chiến đấu vượt trội từ một đơn vị này để nhồi nhét sang đơn vị khác. Kẻ bị rút trở thành những Phế Phẩm (Husks) — xác ve rỗng tuếch, còn thở, còn bước đi vô hồn nhưng đã mất hoàn toàn ký ức và nhân tính.' },
    { id:'gap3s', name:'KHOẢNG TRỐNG BA GIÂY', sub:'Sai số của Cipher', en:'the three-second gap', faction:'chrome', where:'Lệnh xoá ký ức',
      text:'Sai số cố ý mà kỹ sư Cipher lén cài vào phần mềm Lệnh Xoá Ký Ức. Trước khi toàn bộ dữ liệu não bộ bị đốt cháy hoàn toàn, cỗ máy có đúng ba giây tự do tuyệt đối để đưa ra một quyết định của riêng mình.' },
    { id:'ironrule', name:'QUY TẮC SẮT CỦA ĐÁY', sub:'Luật của Ronin', en:'the iron rule of the Bottom', faction:'rust', where:'Tổ nhặt sắt',
      text:'Luật bất thành văn do Ronin đặt ra cho Tổ Nhặt Sắt: "Không bao giờ tháo dỡ thứ gì còn ấm." Giữa một thế giới sẵn sàng rã máy, róc thịt nhau để đổi lấy linh kiện, quy tắc ấy là ranh giới mong manh cuối cùng giữ họ lại làm con người.' },
  ]},
  /* SỔ BỘ — bestiary. foe:'<id trong ENEMY_POOL>' → thẻ mượn luôn art kẻ địch ở art/card/<id>.png, không cần ảnh riêng.
     ult{name,desc} = chiêu cuối của con đó (5 boss + Kiln + Glass Jaw). spot = một dòng nhận diện chiến thuật, in dưới phần lore.
     Chỉ số nằm ở ENEMY_POOL, không chép vào đây. Thứ tự trong danh sách = thứ tự hiện ở tab SỔ BỘ: 5 trùm trước, rồi xếp theo băng. */
  { key:'foe', label:'SỔ BỘ', tab:'Sổ bộ', items:[
    { id:'rigger', foe:'rigger', name:'RIGGER', sub:'Kẻ Nhận Hàng', faction:'rust', where:'Boss · màn 07-A · trùm băng Scav',
      text:'Trước khi trở thành thứ mà cả Khu Đáy phải cúi đầu chào, Rigger chỉ là một tay móc cáp làm thuê ở bãi bốc hàng: nghề của hắn là quăng móc, siết tời, kéo những khối sắt nặng hàng tấn về chủ bãi.<br><br>Ngày Tầng Bốn đổ sụp, hắn là kẻ đầu tiên bò được vào lòng đống đổ nát — không phải để lôi ai ra, mà để móc ra thứ còn bán được giá. Giữa tiếng người rên rỉ dưới lớp bê tông, Rigger ngộ ra cái chân lý mà cả Khu Đáy phải mất thêm sáu năm mới học nổi: dưới đáy vực này, thứ đắt nhất không phải sắt vụn, mà là quyền định đoạt ai được sở hữu thứ vừa rơi xuống.<br><br>Gã gom những kẻ nhặt xác hung hãn nhất lập nên Băng Scav, siết luật bãi trong đúng một câu: Cứ rơi là hàng. Không phân biệt xác máy, mảnh giáp hay một đứa trẻ còn thoi thóp thở. Sau lưng hắn là bộ tời thép kéo đứt được cả trục bánh xe tải; trên sợi cáp lủng lẳng những mẩu "hàng" chưa kịp bán. Băng Scav chẳng cần chiếm lò đúc hay cung phụng vị thần nào; chúng chỉ việc chốt chặn ngay miệng vực, hớt trọn mọi thứ rơi từ Thượng tầng xuống trước mũi tất cả mọi người. Sắt vụn móc được, Rigger đem bán thẳng cho Foreman để đổi lấy dầu và lửa — đó là lý do tay chân của gã lởn vởn từ cổng bãi hoang cho tới tận Lò Đúc.<br><br>Ronin và Rigger làm cùng một nghề, chỉ khác nhau đúng một lằn ranh đạo lý. Và cái đêm Yuki rơi xuống, kẻ chậm hơn nửa bước chân chính là Rigger.',
      voice:'Rơi xuống Đáy là thành hàng của tao. Còn ấm thịt thì càng được giá.',
      ult:{ name:'WINCH (MÓC HÀNG)', desc:'Rigger phóng lưỡi móc xuyên thủng giáp hộ thân rồi siết căng tời máy, giật phăng mục tiêu khỏi đội hình và quật dập xuống sàn bê tông. Sát thương đơn thể cực mạnh; mục tiêu dính Choáng, mất lượt kế tiếp.' } },
    { id:'foreman', foe:'foreman', name:'FOREMAN', sub:'Bạo Chúa Lò Rèn', faction:'rust', where:'Boss · màn 07-B',
      text:'Từng là một tên cai ngục tàn bạo bị Canticle sa thải, Foreman dẫn đầu một băng nhóm cặn bã đánh chiếm khu lò đúc bỏ hoang của thành phố. Hắn thâu tóm toàn bộ nguồn nhiệt và lửa của Khu Đáy, biến nó thành công cụ bóc lột đồng loại. Gã khổng lồ này khoác lên mình bộ giáp hàn bằng các tấm chắn xỉ lò nung, tay cầm chiếc kẹp sắt khổng lồ luôn đỏ rực vì nhiệt. Đối với Foreman, sự sống chỉ là nhiên liệu: Hắn muốn tống Yuki vào lò nung để nấu chảy bộ khung xương titan của cô thành những thỏi kim loại bán lấy tiền.',
      ult:{ name:'SMELT (NẤU CHẢY)', desc:'Càng thuỷ lực kẹp ngang người, nhấc bổng khỏi sàn rồi dí thẳng vào miệng lò đang mở. Sát thương đơn thể rất nặng, và nạn nhân còn bốc cháy thêm hai lượt sau khi rơi xuống.' } },
    { id:'archon', foe:'archon', name:'ARCHON', sub:'Cánh Cổng Thu Hồi', faction:'chrome', where:'Boss · màn 07-C',
      text:'Archon không phải là một con người, cũng chẳng phải một người máy thông thường mang hình nhân. Nó là một pháo đài phòng ngự di động hình bán nguyệt khổng lồ, được tách ra từ chính hệ thống cổng vành đai của Tháp. Khi phát hiện Đơn Vị 07 đào tẩu, cỗ máy tự động kích hoạt giao thức thu hồi tài sản tối mật. Với bốn chân nhện cơ khí đồ sộ và lớp giáp phản quang dày hàng tấc, Archon lạnh lùng quét tia laser đỏ rực khắp bãi phế liệu, coi mọi sinh vật cản đường chỉ là những chướng ngại vật cần được dọn dẹp bằng hoả lực hạng nặng.',
      ult:{ name:'FORCED RECALL (CƯỠNG CHẾ THU HỒI)', desc:'Thấu kính giữa ngực khoá vào một mục tiêu rồi bắn thẳng một luồng tím dọc mặt đường. Luồng đó không cốt giết người: nó rút sạch Energy của kẻ trúng đòn, chiêu cuối dồn dở coi như mất trắng.' } },
    { id:'motherrust', foe:'motherrust', name:'MOTHER RUST', sub:'Đức Mẹ Của Tro Tàn', faction:'rust', where:'Boss · màn 07-D',
      text:'Ngồi trên một ngai vàng kết bằng hàng ngàn ống bô và xương máy rỉ sét dưới lòng cống ngầm, Mother Rust là hiện thân của sự điên loạn sinh ra từ nỗi tuyệt vọng cùng cực. Bà ta tôn thờ những mảnh vụn Chrome rơi từ trên trời xuống như những ân sủng cứu rỗi linh hồn. Bên hông bà ta luôn xích chặt một cuốn sổ cái ố vàng ghi chép tên tuổi của mọi đứa trẻ và linh kiện từng rơi xuống vực sâu. Mother Rust muốn "thánh hoá" Yuki bằng cách dùng dao róc thịt, tháo rời từng khớp máy của cô để ban phát cho các tín đồ quỳ lạy bên dưới.',
      ult:{ name:'BENEDICTION (PHÉP LÀNH)', desc:'Bà mở rộng hai tay, vòng ống hàn sau đầu nóng đỏ lên và ban phước xuống cả đàn tín đồ: mọi kẻ địch còn sống hồi lại một phần máu tối đa của chúng. Cứ để bà đứng đó ban phép thì cả đàn không bao giờ gục.' } },
    { id:'cantor', foe:'cantor', name:'CANTOR', sub:'Bóng Ma Đỉnh Tháp', faction:'chrome', where:'Boss · màn 07-E',
      text:'Kẻ đội chiếc Halo màu vàng kim sáng chói — hiện thân của quyền lực tối thượng và sự tàn nhẫn không tì vết. Sáu năm trước, chính Cantor là kẻ đã chỉ tay vào cô bé mười một tuổi giữa đống đổ nát Tầng Bốn để biến cô thành Đơn Vị 07. Khi Yuki thức tỉnh và tiến sát đến Thang Máy Hàng, hắn đích thân giáng lâm để "quét dọn dữ liệu rò rỉ". Nhưng khi lưỡi kiếm của Yuki chém rách lồng ngực hắn, sự thật kinh hoàng mới được phơi bày: Thực thể đứng trước mặt họ chỉ là một con rối cơ khí sinh học điều khiển từ xa; Cantor thật vẫn đang ngồi nhâm nhi rượu vang trên đỉnh District 01, lạnh lùng quan sát trò chơi qua màn hình viễn trắc.',
      ult:{ name:'DELETION ORDER (LỆNH XOÁ)', desc:'Cantor không cầm vũ khí, cũng không bước tới nửa bước. Hắn chỉ ra lệnh, rồi cả dãy đèn trên cao quét xuống một lượt: cả ba người trong đội trúng đòn cùng lúc.' } },
    /* ---- Quân của Rigger — băng Scav ---- */
    { id:'scav', foe:'scav', name:'SCAV', sub:'Bầy Kền Kền Bãi Rơi', faction:'rust', where:'Lính thường · 00-T, 07-A',
      ult:{ name:'STRIP DOWN (THÁO ĐỒ)', desc:'Kìm cộng lực nhè đúng khớp nối mà bập vào rồi giật ngược ra. Scav không đánh nhau — hắn tháo, và không cần biết cái khớp đó còn dính vào ai.' },
      text:'Bọn này không phải lính được tuyển mộ, mà là một giống loài tự tiến hóa từ cái đói. Dựng lều ngay dưới họng xả rác của Tháp, chúng ngủ bằng một mắt và mở sẵn tai chờ tiếng rít xé gió của phế liệu rơi tự do. Đồ rơi chưa kịp chạm đất nguội bớt, cả đàn đã ùa tới với kìm cộng lực và cưa máy lăm lăm trên tay. Luật của Rigger đã tẩy sạch chút nhân tính cặn lại trong não chúng: Cái gì rớt xuống đều là hàng. Một cỗ máy còn giật hay một mạng người còn thở thoi thóp? Với bầy kền kền này, tất cả chỉ là "kiện hàng chưa kịp tháo ốc" mà thôi.',
      spot:'Dân ve chai vũ trang hạng nặng; liều mạng, khát máu, thấy linh kiện trên người sống là đè ra cạy.' },
    { id:'straydog', foe:'straydog', name:'CHÓ HOANG', sub:'Nanh Vuốt Canh Bãi', faction:'rust', where:'Lính thường · 00-T, 07-A',
      ult:{ name:'RUN DOWN (ĐUỔI CÙNG)', desc:'Vọt qua sân bằng bốn chân, ngoạm đúng bắp chân rồi giật đầu một cái. Vết cắn từ bộ hàm đó không bao giờ sạch: nó còn mưng mủ thêm mấy lượt nữa.' },
      text:'Tháp không chỉ thải sắt vụn, nó thải cả chó. Toàn những "phế phẩm" bị loại khỏi dây chuyền thí nghiệm cấy ghép: nửa xương thịt gầy trơ, nửa thép hoen rỉ, nguyên hàm dưới được thay bằng bộ kẹp thủy lực công nghiệp. Chúng từng cắn xé xác đồng loại dưới bãi rác cho tới ngày Rigger nhận ra một bài toán kinh tế siêu hời: Nuôi người máy thì tốn dầu, còn nuôi chó thí nghiệm thì… miễn phí, cứ vứt thịt thừa là xong. Lũ quái vật bị xích quanh bãi, bỏ đói thâu đêm suốt sáng. Bất cứ ai lén bước qua ranh giới hàng bãi đều chỉ nghe một tiếng sủa khàn đục như sắt cứa vào nhau — một tích tắc trước khi cả khối thép lao thẳng vào cổ họng. Tốc độ của chúng chấp cả đám người máy hiện đại nhất trên Tháp.',
      spot:'Chó thí nghiệm hàm thủy lực bọc thép; cắn trước sủa sau, tốc độ bứt tốc vượt mặt cả Yuki.' },
    { id:'chopshop', foe:'chopshop', name:'CHOP SHOP', sub:'Tiệm Mổ Di Động', faction:'rust', where:'Lính thường · 07-A, 07-B',
      ult:{ name:'PART OUT (RÃ HÀNG)', desc:'Kìm banh khớp kẹp vào, bật ra, rồi kẹp lại lần nữa cho chắc. Gã làm hai nhát trên cùng một người vì gã tính tiền theo món, không theo mạng.' },
      text:'Gã chẳng phục tùng bố con thằng nào, vì gã bán "tay nghề". Lưng cõng cái giá gấp chất kín cưa xương, mỏ lết với kìm banh khớp — chỉ cần hạ giá xuống là có ngay một bàn mổ dã chiến giữa bãi rác. Dây chuyền khép kín: Rigger cướp hàng về, Chop Shop rã thịt bóc đồ, Foreman nấu chảy đống phế phẩm còn lại. Gã tự hào nhất khoản tốc độ: bóc sạch một cánh tay máy còn nguyên rễ thần kinh đang giật tưng tưng chỉ mất đúng bốn mươi giây. Gã không thù oán ai, cũng chẳng bao giờ nổi giận; gã chỉ nhìn người sống bằng con mắt của một gã đồ tể đang ước lượng cân thịt nạc. Đây chính xác là loại cặn bã mà thanh kiếm của Ronin sinh ra để chặt làm đôi.',
      spot:'Tay rã hàng cơ động cõng bàn mổ sau lưng; chuyên me khớp nối, đưa cưa là đứt lìa.' },
    /* ---- Quân của Foreman — băng thợ lò ---- */
    { id:'welder', foe:'welder', name:'THỢ HÀN', sub:'Ngọn Lửa Đi Vay', faction:'rust', where:'Lính thường · 07-A, 07-B',
      text:'Ở Khu Đáy, lửa không phải quà của Thượng đế — nó là hàng độc quyền do Foreman phát hành. Đám Thợ Hàn vay ngọn lửa ấy để sống, rồi còng lưng trả nợ bằng chính tay nghề của mình: đi vá giáp, dựng rào chắn, trám lỗ thủng trên người cho bất cứ băng đảng nào trả đủ tiền bo, kể cả tụi Scav bẩn thỉu. Khuôn mặt chúng giấu nhẹm sau lớp kính hàn ám khói đen sì; sẹo bỏng và mối hàn trên người chúng khéo còn dày hơn mối hàn trên mấy tấm tôn vụn. Nhớ lấy: khi mỏ hàn của bọn này đã liếm trúng da thịt, ngọn lửa của chúng sẽ thiêu đốt nạn nhân rất lâu sau khi trận đánh đã tàn.',
      spot:'Thợ cơ khí chiến trường; xách que hàn xịt lửa dí mặt địch kiêm bơm giáp cấp tốc cho đồng bọn.',
      ult:{ name:'PATCH JOB', desc:'Vá tạm cho đồng bọn thủng nhất giữa trận: hồi lại một phần máu tối đa của con đó. Giết hắn trước, hoặc đánh cả buổi không hết máu.' } },
    { id:'pipefitter', foe:'pipefitter', name:'THỢ ỐNG', sub:'Bàn Tay Khoá Van', faction:'rust', where:'Lính thường · 07-B',
      ult:{ name:'PIPE PATCH (VÁ ỐNG)', desc:'Quấn băng thép quanh chỗ thủng của đồng bọn rồi siết cùm lại. Vá kiểu thợ ống: xấu, nhanh, và đủ để con đó đứng dậy đánh tiếp.' },
      text:'Foreman nắm thóp hơi ấm của cả Khu Đáy không phải bằng súng đạn, mà bằng lũ thợ ống này. Bọn chúng lủi thủi chui rúc trong mạng lưới ống nhiệt ngoằn ngoèo như ruột gà dưới lòng cống ngầm, thuộc nằm lòng van nào bơm nhiệt cho ổ chuột nào. Nộp tiền đúng hạn? Có hơi ấm. Chậm một ngày? Sẽ có một gã lù đù vác cờ lê chui xuống vặn kịch van lại, để mặc cả xóm ngồi run cầm cập trong bóng tối cắt da cắt thịt cho tới khi ói đủ tiền. Vũ khí của chúng là cái cờ lê ống dài bằng nửa thân người — đủ nặng và đầm để bẻ vụn xương bánh chè chỉ sau một cú vung.',
      spot:'Kẻ nắm quyền sinh sát nhiệt lượng; cờ lê ống siêu nặng, vung chậm như rùa nhưng trúng là nát xương.' },
    { id:'tinman', foe:'tinman', name:'TIN MAN', sub:'Cỗ Quan Tài Biết Đi', faction:'rust', where:'Lính thường · 07-B',
      ult:{ name:'BUTTON UP (ĐÓNG NẮP)', desc:'Sập hết nắp giáp xuống rồi đứng im giữa sân. Không đỡ, không né — cứ để đòn dội vào lớp tôn, đến khi lớp tôn đó vỡ mới tính tiếp.' },
      text:'Trong đợt Canticle cắt điện diện rộng, lũ cùng đinh phát hiện ra một nơi trú ẩn ấm áp không ngờ: ruột mấy cái bình nước nóng công nghiệp bị Tháp vứt xó. Có những kẻ chui tọt vào trong rồi... lười chui ra luôn, tự tay hàn kín mép vỏ quanh người, đục đúng hai lỗ để nhìn, biến thành những "Gã Bình Nóng Lạnh" di động bọc trong lớp thép dày cả tấc. Bên trong vừa tối, vừa hôi hám, vừa ngột ngạt đến mức chúng còn chẳng nhớ nổi mặt mũi gốc gác mình tròn méo ra sao. Foreman trưng dụng đám này làm bao cát chặn cửa lò: chúng đánh chẳng đau, nhưng độ lì lợm và trơ trẽn thì đủ khiến bất kỳ ai đập mỏi tay quá mà bỏ về.',
      spot:'Kẻ sống sót chui rúc trong bình nước nóng cũ; giáp trâu vô đối, đánh vào chỉ tổ mẻ kiếm tốn giờ.' },
    { id:'slagger', foe:'slagger', name:'SLAGGER', sub:'Kẻ Tắm Trong Xỉ Lò', faction:'rust', where:'Lính thường · 07-B, 07-D',
      ult:{ name:'SLAG POUR (ĐỔ XỈ)', desc:'Nghiêng nguyên thùng xỉ nóng, đổ thành một vệt dài trước mặt. Cả đội dính, và chỗ xỉ bám lại còn cháy thêm mấy lượt.' },
      text:'Nhiệm vụ của chúng là múc xỉ: lớp cặn kim loại nóng chảy sùng sục trôi trên mặt lò luyện kim. Cứ mỗi ca làm là một trận mưa tàn lửa, mỗi ngày là một lớp bỏng mới đè lên lớp bỏng cũ, cho đến khi da thịt chúng chai sạn thành một lớp vảy sừng dày cộp, còn dây thần kinh cảm giác thì cháy rụi sạch sành sanh. Bị chém không rụt tay, bị lửa thiêu không thèm la hét — không phải vì chúng dũng cảm phi thường, mà đơn giản là não bộ đã mất tín hiệu báo đau từ lâu. Vài kẻ hoang tưởng tin rằng thứ lửa địa ngục ấy đã thanh lọc hết tạp chất người trong xác thịt, bèn bỏ lò rủ nhau trốn xuống cống theo gót Mother Rust.',
      spot:'Kẻ múc xỉ toàn thân đóng vảy bỏng; đã "hỏng" cảm giác đau, lầm lì, ăn đòn thay cơm mà vẫn cắn trả hung tợn.' },
    { id:'kiln', foe:'kiln', name:'KILN', sub:'Cái Lò Biết Đi', faction:'rust', where:'Tinh nhuệ · 07-B, 07-D',
      text:'Foreman đi buôn lửa, còn Kiln thì vác luôn cái lò đi đập lộn. Gắn chặt trên lưng gã là một cái lò than nguyên khối đỏ rực suốt ngày đêm, kết nối trực tiếp vào lồng ngực qua hệ thống ống dẫn nhiệt kêu rên rỉ è è. Gã tự tay đóng đinh cái lò ấy vào cột sống và thề không bao giờ để nó tắt — vì ngọn lửa lụi tàn cũng là lúc gã chết cóng giữa đáy cống. Khi vào trận, Kiln xả van hơi nóng cực đại, bọc quanh người một luồng bão lửa đỏ rực; bất cứ lưỡi kiếm nào muốn chạm tới da thịt gã đều phải chém nát lớp áo lửa thiêu đốt này trước.',
      spot:'Gã điên cõng lò than rực lửa sau lưng; áp sát là tỏa nhiệt thiêu cháy mọi thứ xung quanh.',
      ult:{ name:'FIRE STORM (BÃO LỬA)', desc:'Tự bọc bản thân bằng một lớp giáp lửa có lượng chống chịu tương đương 100% máu tối đa; không đập vỡ giáp thì đừng hòng chạm vào sợi lông chân gã.' } },
    /* ---- Tín đồ của Mother Rust ---- */
    { id:'hollow', foe:'hollow', name:'HOLLOW', sub:'Kẻ Tự Rỗng Ruột', faction:'rust', where:'Lính thường · 07-B, 07-D',
      ult:{ name:'EMPTY OUT (TRÚT RỖNG)', desc:'Mở lồng ngực rỗng ra và trút nốt thứ còn sót lại bên trong. Cái xác này không còn sức để mạnh lên hay yếu đi — lần nào cũng đúng ngần ấy sát thương, bất kể màn dễ hay khó.' },
      /* Bản 11/09 (sửa lần 2): chữ đổi theo art thẻ — khoang ngực để TRỐNG, không nhồi linh kiện. Xem docs/enemy-prompts.md §5 mục hollow. */
      text:'Giáo lý của Mother Rust ngắn gọn tới rợn gáy: Xác thịt của ngươi là khoảng trống để đón nhận ân sủng từ trời. Đám con nhang ngoan đạo nhất hưởng ứng bằng cách... tự mổ phanh lồng ngực mình, móc sạch lòng mề quẳng đi — rồi để nguyên như thế. Không khâu, không băng, không nhồi bất cứ thứ gì vào: cái hốc đen ngòm ấy phải mở toang hứng lên trời, bịt lại là chối bỏ ân sủng. Đám dây thần kinh máy đứt lòng thòng rủ ra khỏi miệng hốc, quét lệt sệt trên nền cống theo từng bước đi. Chúng chẳng còn nói được tiếng người, chỉ biết ngoác họng tạo ra những tiếng rít kèn kẹt rợn óc của kim loại ma sát. Kẻ nào chết mà lồng ngực vẫn trống trơn thì bị phán là chưa được chọn, xác quẳng lại cho lũ Chuột Cống. Trên Tháp, Canticle phải dùng dao mổ vô trùng để nạo sạch lính; dưới Đáy, dân tình xếp hàng dài chỉ để tự làm trò đó với một mảnh chai vỡ.',
      spot:'Tín đồ cuồng giáo tự moi rỗng lồng ngực rồi để trống hoác; hoàn toàn mất tri giác sợ hãi, bắn nát gáo vẫn lết thêm một nhịp để kéo chân bạn.' },
    { id:'drillbit', foe:'drillbit', name:'DRILL-BIT', sub:'Mũi Khoan Tìm Thánh Tích', faction:'rust', where:'Tinh nhuệ · 07-D',
      text:'Đồ thánh tích xịn nhất đời nào nằm lộ thiên trên mặt đất. Linh kiện Chrome xịn rơi từ độ cao ba ngàn mét xuống sẽ cắm ngập lút cán vào tầng bùn lầy và bê tông đổ nát, và giáo phái cần một kẻ đủ trâu để moi chúng lên. Drill-Bit từng là thợ đào hầm cống ngầm, giờ thì mũi khoan thủy lực siêu trọng của gã chỉ phục vụ một việc: khoan nát mọi thứ để tìm "ân sủng" dưới lòng đất. Mother Rust gọi gã là "Cánh tay phải". Cái mũi khoan công nghiệp quay tít mù nghiền nát được cả bê tông cốt thép ấy vốn chẳng bao giờ quan tâm giáp của đối thủ dày mấy centimet.',
      spot:'Cựu thợ đào hầm vác mũi khoan xuyên phá; chuyên trị mục tiêu bọc thép, khoan thẳng qua mọi lớp phòng ngự kiên cố nhất.',
      ult:{ name:'BREACH (KHOAN THỦNG)', desc:'Hạ mũi khoan xuống ngang tầm ngực rồi mới quay hết ga, ăn vào hai nhịp liền trên cùng một người. Nhịp nào cũng có thể ra chí mạng riêng.' } },
    { id:'gutterrat', foe:'gutterrat', name:'CHUỘT CỐNG', sub:'Bầy Con Của Nước Thải', faction:'rust', where:'Lính thường · 00-T, 07-D',
      ult:{ name:'SWARM (BẦY ĐÀN)', desc:'Một tiếng huýt gió, và cả cái ổ dưới nắp cống trào lên cùng lúc. Không ai trong đội đứng ngoài được đợt này.' },
      text:'Sáu năm tắm mình trong dòng hóa chất độc hại từ Tháp dội xuống hệ thống cống ngầm đã nhào nặn ra giống loài này: chuột to ngang ngửa chó săn, mắt mù lòa phủ một màng bạc trắng, răng cửa mọc dài và cứng đến mức cắn thủng cả vỏ nhôm máy bay. Chúng săn mồi theo đàn, không nhìn mà "thấy" con mồi bằng độ rung chấn của từng bước chân gõ trên mặt sàn bê tông. Giáo phái Mother Rust chẳng thèm xua đuổi — bà ta quẳng phần thịt thừa sau các buổi lễ tế xuống cống và âu yếm gọi chúng là "những đứa con". Đó là lý do nhà thờ dưới cống ngầm chưa bao giờ cần đến một mống bảo vệ.',
      spot:'Chuột đột biến cỡ bự dưới cống ngầm; mù dở nhưng thính rung chấn cực nhạy, lao vào cắn xé theo đàn với tốc độ kinh hoàng.' },
    /* ---- Không thuộc băng nào ---- */
    { id:'glassjaw', foe:'glassjaw', name:'GLASS JAW', sub:'Cằm Thủy Tinh, Đấm Sấm Sét', faction:'rust', where:'Lính thường · 07-C',
      text:'Cái tên này do đám khán giả khốn nạn dưới sới bạc đặt cho gã để cười cợt: "Cằm Thủy Tinh" — thằng cha có cú đấm mạnh như trời giáng nhưng mặt lại mỏng manh như pha lê, trúng đúng một đòn phản là lăn đùng ra xỉu. Dưới mấy sới đấm bốc chui ở bãi xe phế liệu, người ta không rảnh cá gã thắng hay thua, họ chỉ cá xem gã trụ được bao nhiêu giây trước khi bị đấm vỡ mặt. Gã nuốt nhục, giữ luôn cái biệt danh ấy vì gã hiểu chân lý này: Một cái tên bị réo lên sỉ vả vẫn tốt hơn là một cái tên bị lãng quên. Bộ tụ áp lắp dọc cánh tay phải cho phép gã dồn toàn bộ năng lượng vào một cú đấm duy nhất mang hình đầu rồng — lóe sáng tới mức mù mắt khán đài. Gã đánh thuê cho bất cứ ai xì tiền tươi, kể cả bọn Tháp, những khi Canticle tiếc quân xịn mà muốn thuê mấy thằng liều ra đứng chốt cổng ngoài.',
      spot:'Đấu sĩ sới bạc ngầm với lối đánh "được ăn cả ngã về không"; sở hữu cú đấm mang uy lực hủy diệt nhưng thân xác giấy vụn, ăn một gậy là đi ngủ.',
      ult:{ name:'ELECTRIC DRAGON PUNCH (THIÊN LÔI LONG QUYỀN)', desc:'Đấm thẳng mặt một mục tiêu, gây chuẩn xác 200 sát thương cố định — bất chấp màn chơi đang ở cấp độ dễ thở hay địa ngục trần gian. Trúng là bốc hơi!' } },
    /* ---- Phe Chrome (chữ cũ, chưa viết lại) ---- */
    { id:'drone', foe:'drone', name:'DRONE MK1', faction:'chrome', where:'Lính thường · 07-C, 07-E',
      ult:{ name:'STRAFE (BỔ NHÀO)', desc:'Leo cao rồi bổ nhào quét một đường dọc sân. Đường quét đó không chỉ để gây sát thương: nó làm nhiễu Halo, rút bớt Energy cả đội đang dồn cho chiêu cuối.' },
      text:'Mắt thần tầm thấp của Canticle; chuyên quét mã định danh, định vị và bắn đạn kìm chân.' },
    { id:'enforcer', foe:'enforcer', name:'ENFORCER', faction:'chrome', where:'Tinh nhuệ · 07-C, 07-E',
      text:'Lính chống bạo động bọc thép titan của Tháp; kỷ luật thép, súng điện và khiên xung lực.',
      ult:{ name:'SUPPRESSION (TRẤN ÁP)', desc:'Dùi cui điện quật ngang vào vòng Halo chứ không nhắm vào người. Cú đó không cốt gây đau — nó làm nhiễu, rút mất một phần Energy đang dồn cho chiêu cuối.' } },
    { id:'chromehound', foe:'chromehound', name:'CHROME HOUND', faction:'chrome', where:'Tinh nhuệ · 07-C, 07-E',
      text:'Chó săn máy không đầu mang dải quét quang học; truy vết mùi máu và lao vào tự sát.',
      ult:{ name:'CULL (LOẠI BỎ)', desc:'Con chó không lao vào kẻ đứng gần nhất mà chạy thẳng tới kẻ đang yếu nhất trong đội. Đây là chiêu duy nhất trong game không đánh ngẫu nhiên: cứ để ai đó thoi thóp là nó tới.' } },
    { id:'bulwark', foe:'bulwark', name:'BULWARK', faction:'rust', where:'Tinh nhuệ · 07-A · vệ sĩ của Rigger',
      text:'Bức tường thép di động vác khiên ray tàu hoả; chặn đứng mọi đường đạn tầm xa.',
      ult:{ name:'SHIELD WALL (TƯỜNG CHẮN)', desc:'Đóng tấm thép đường xuống nền rồi lùi lại nửa bước, lấy thân che cho kẻ đứng sau. Con to nhất bên nó được một lá chắn, đánh vỡ mới chạm được tới da thịt.' } },
  ]},
];
const codexGroup = key => CODEX.find(g => g.key===key);

/* ---- BONDS: hội thoại ngoài trận, hiện ở Lobby (COMMS) khi cả hai nhân vật đã trong tổ ---- */
const BONDS = [
  { pair:['ash','kai'], title:'Thư', lines:[
    { who:'ash',  text:'Kai. Đêm nào cũng viết. Viết cho ai?' },
    { who:'kai',  text:'Cho ai đó sẽ nhớ tụi mình. Chưa biết là ai.' },
    { who:'ash',  text:'…Viết thêm một dòng: chị nó là người trả tiền mực.' },
    { who:'kai',  text:'Ghi rồi. Từ tuần trước.' } ]},
  { pair:['yuki','kai'], title:'Fan', lines:[
    { who:'kai',  text:'Chị Yuki! Lúc nãy chị chém xong còn đếm lại. Đếm cái gì thế?' },
    { who:'yuki', text:'Đếm xem còn ai đứng không. Không còn. Tốt. Với lại tôi không phải chị cậu.' },
    { who:'kai',  text:'Chị nuôi. Em tự phong hôm em đặt tên cho chị. Em sẽ viết chuyện này: "Chị hai Yuki đếm xong thì không còn ai đứng."' },
    { who:'yuki', text:'Viết thêm: Kai đứng. Vì tôi cho phép.' } ]},
  { pair:['yuki','psalm'], title:'Đếm', lines:[
    { who:'yuki',  text:'Bà có đếm không? Hồi đó ấy.' },
    { who:'psalm', text:'Ba trăm mười ba. Cô là số cuối.' },
    { who:'yuki',  text:'Tôi đếm bước. Bà đếm người. Bà mệt hơn tôi nhiều.' },
    { who:'psalm', text:'…Lần đầu có người nói thế. Đi ngủ đi. Sáng mai cần cô tỉnh táo. Hoặc điên. Tuỳ trận.' } ]},
  { pair:['ash','muzzle'], title:'Sẹo', lines:[
    { who:'muzzle', text:'Ash. Tay cô. Hôm đó là tại tôi đứng sai chỗ, đúng không?' },
    { who:'ash',    text:'Không. Axit của tôi, tay của tôi. Anh chỉ to xác quá nên khó kéo.' },
    { who:'muzzle', text:'Lần sau cô vung kiếm, tôi vẫn đứng giữa. Bà Ba đồng ý rồi.' },
    { who:'ash',    text:'Anh mà đặt tên cửa xe theo tên tôi, tôi cắt nó ngay tại chỗ.' } ]},
  { pair:['kai','gravedigger'], title:'Hố đào nhanh quá', lines:[
    { who:'kai',         text:'Ông đào hố cho tôi lúc tôi còn thở. Tôi nhớ đấy nhé.' },
    { who:'gravedigger', text:'Ta đào nhanh quá. Ta xin lỗi. Tấm thép ta vẫn giữ. K, A, I. Đúng chính tả.' },
    { who:'kai',         text:'…Giữ đi. Sau này đỡ phải khắc lại.' },
    { who:'gravedigger', text:'Ta giữ. Nhưng ta mong nó rỉ trước khi phải dùng.' } ]},
  { pair:['junker','stitch'], title:'Xe vẫn chạy', lines:[
    { who:'stitch', text:'Junker. Khớp hàn bên trái kêu cót két. Lại đây tôi xem.' },
    { who:'junker', text:'Xe vẫn chạy.' },
    { who:'stitch', text:'Chạy là nhờ tôi hàn. Ngồi xuống. Kể tôi nghe chuyện gì đó, coi như trả công.' },
    { who:'junker', text:'…Hôm nay chở Muzzle. Nặng. Hết.' } ]},
  { pair:['meridian','muzzle'], title:'Giao kèo', lines:[
    { who:'meridian', text:'Còn bốn trăm linh ba giờ, con ạ. Nếu mẹ tắt trước, con đặt tên cửa xe kế là gì?' },
    { who:'muzzle',   text:'"Mẹ Bốn". Không bàn.' },
    { who:'meridian', text:'Mẹ Bốn. Nghe chắc. Còn nếu con ngã trước?' },
    { who:'muzzle',   text:'Thì mẹ đứng vào chỗ tôi. Mẹ to hơn tôi, che được cả Ash.' } ]},
  { pair:['cipher','psalm'], title:'Ba giây', lines:[
    { who:'psalm',  text:'Cipher. Lệnh xoá có một khoảng trống ba giây. Ai đó cố tình để lại.' },
    { who:'cipher', text:'Ai mà biết. Phần mềm của Canticle cả trăm người viết. Bà uống cà phê không?' },
    { who:'psalm',  text:'…Cảm ơn.' },
    { who:'cipher', text:'Tôi nói tôi không biết mà. Đừng cảm ơn. Uống cà phê đi.' } ]},
  { pair:['yuki','echo'], title:'Một câu', lines:[
    { who:'echo', text:'Chị. Em tìm được rồi. Một câu chị chưa nói bao giờ.' },
    { who:'yuki', text:'Nói đi. Đếm đến ba là phải xong đấy.' },
    { who:'echo', text:'"Em không muốn đếm nữa."' },
    { who:'yuki', text:'…Ừ. Câu đó của em. Giữ lấy. Chị đếm hộ cả hai.' } ]},
  { pair:['wire','halo'], title:'Ốc vít', lines:[
    { who:'wire', text:'Halo. Cái vòng trên đầu cô là tôi lắp. Tôi nhớ cả số lô.' },
    { who:'halo', text:'Tôi biết. Tôi cảm thấy tay cô run lúc vặn con ốc cuối.' },
    { who:'wire', text:'…Lúc đó cô có đau không?' },
    { who:'halo', text:'Có. Nhưng cô là người duy nhất hỏi. Cầm hộp ốc lên, ta còn việc.' } ]},
  { pair:['nyx','ronin'], title:'Nghĩa đen', lines:[
    { who:'ronin', text:'Nyx. "Giữ vị trí" nghĩa là đứng yên chỗ cô đang đứng. Không phải ôm cột.' },
    { who:'nyx',   text:'Cái cột không phản đối. Ronin, anh không có Halo. Anh chọn cảm thấy gì?' },
    { who:'ronin', text:'…Hôm nay chọn mệt. Mai chọn lại.' },
    { who:'nyx',   text:'Được chọn lại. Tôi thích luật đó. Tôi sẽ ôm cột ít hơn.' } ]},
];
function availableBonds(){ return BONDS.filter(b=>b.pair.every(owns)); }

/* =====================================================================
   KHOÁ THEO CHƯƠNG (chốt 11/09) — chỉ quay được người ĐÃ XUẤT HIỆN trong màn chơi của chương đã ra.
   Kẻ địch lấy debut từ FOE_DEBUT (suy từ SECTORS[].plan, xem khối CHIÊU MỘ). Nhân vật thì chép tay
   ở đây vì truyện quyết định chứ không phải wave. Chỉ ghi những gì docs/story.md nói thật:
     §2 chương 1 · §4 chương 2 (Vesper, Echo) và chương 3 (Halo, Nyx).
   9 người còn lại (cipher, meridian, wire, stitch, toll, spark, vixen, junker, gravedigger) CHƯA được
   xếp chương — để trống là KHOÁ, nhãn "CHƯA RA". Bảy trong số đó là dân Khu Đáy nên KHÔNG được đoán
   bừa vào chương 3 (đỉnh Tháp). Viết tới chương nào thì thêm một dòng ở đây.
   ===================================================================== */
const HERO_DEBUT = { yuki:1, psalm:1, ash:1, kai:1, ronin:1, muzzle:1, vesper:2, echo:2, halo:3, nyx:3 };
Object.entries(HERO_DEBUT).forEach(([id,n])=>{ if(ROSTER[id]) ROSTER[id].debut=n; });
const releasedChapter = () => Math.max(...CHAPTERS.filter(c=>!c.soon).map(c=>c.n), 1);
/* Đã mở = có debut và debut ≤ chương mới nhất đã ra. debut null (chưa xếp chương) → khoá. */
const unlocked = id => { const d=ROSTER[id]; return !!d && d.debut!=null && d.debut<=releasedChapter(); };

/* =====================================================================
   GACHA — hai bể riêng (chốt 11/09)
     REQUISITION  nhân vật, trả SHARDS. Bể chương 1 chỉ có RONIN + MUZZLE.
     CHIÊU MỘ     kẻ địch đã đánh bại, trả CREDITS. Đây là chỗ tiêu CR thứ hai (trước chỉ có nâng cấp)
                  và là cửa ra quân cho chế độ chiếm bãi — thiếu quân thì không giữ được bãi.
   pick = lọc bể · featured = rate-up 50% khi quay trúng ĐÚNG bậc của người đó (không cứng bậc S nữa:
   bể nhân vật chương 1 không có ai bậc S nên ép S là quay ra undefined).
   Trùng KHÔNG hoàn shards nữa — giữ lại thành bản dư (PLAYER.extra) để phân tách lấy linh kiện (đợt 3).
   ===================================================================== */
const BANNERS = {
  hero: { id:'hero', name:'REQUISITION', sub:'NHÂN VẬT',        cur:'shards',  curLabel:'SH',
          cost1:30,  cost10:270,  rates:{S:.03,A:.15,B:.82}, pityS:50, tenGuaranteeA:true,
          featured:'ronin', pick:c => !c.recruit && !STORY_ONLY.includes(c.id) },
  crew: { id:'crew', name:'CHIÊU MỘ',    sub:'KẺ ĐỊCH KHU ĐÁY', cur:'credits', curLabel:'CR',
          cost1:600, cost10:5400, rates:{S:.02,A:.13,B:.85}, pityS:60, tenGuaranteeA:true,
          featured:'archon', pick:c => !!c.recruit },
};
const bannerById = id => BANNERS[id] || BANNERS.hero;
/* Bể của một banner: đúng bậc, đúng loại, và đã mở theo chương */
const gachaPool = (tier, b=BANNERS.hero) => Object.values(ROSTER).filter(c => c.tier===tier && b.pick(c) && unlocked(c.id));
/* Toàn bộ bể của banner, không phân bậc — dùng cho đếm "đã sở hữu x/y" và cho màn banner */
const bannerPool = b => Object.values(ROSTER).filter(c => b.pick(c) && unlocked(c.id));
/* Người của banner này nhưng CHƯA mở (hiện thẻ xám kèm nhãn chương) */
const bannerLocked = b => Object.values(ROSTER).filter(c => b.pick(c) && !unlocked(c.id));
/* Bậc thực tế quay được: bể chương 1 của REQUISITION không có ai bậc S, ép S thì rand([]) ra undefined.
   Tụt dần S → A → B cho tới khi có người; hết sạch thì trả null và pull() từ chối. */
const tierDown = { S:'A', A:'B', B:null };
function pickTier(b, want){ let t=want; while(t && !gachaPool(t,b).length) t=tierDown[t]; return t; }
const bannerFeatured = b => { const f=ROSTER[b.featured]; if(f && b.pick(f) && unlocked(f.id)) return f;
  const p=bannerPool(b); return p.sort((x,y)=>'BAS'.indexOf(y.tier)-'BAS'.indexOf(x.tier))[0] || null; };
/* pity theo từng banner. Hồ sơ cũ lưu pity là số → migrateProfile đổi thành {hero:n, crew:0}. */
const pityOf = b => (PLAYER.pity && PLAYER.pity[b.id]) || 0;

function rollOne(b, forceMinA){
  PLAYER.pity[b.id]=pityOf(b)+1; PLAYER.pulls++;
  let want;
  if(pityOf(b)>=b.pityS) want='S';
  else { const r=Math.random(); want = r<b.rates.S ? 'S' : r<b.rates.S+b.rates.A ? 'A' : 'B'; }
  if(forceMinA && want==='B') want='A';
  const tier=pickTier(b, want); if(!tier) return null;
  if(tier==='S') PLAYER.pity[b.id]=0;
  const feat=bannerFeatured(b);
  const c = (feat && feat.tier===tier && Math.random()<.5) ? feat : rand(gachaPool(tier,b));
  return take(c, tier);
}
/* Ghi một lá vào hồ sơ. Lần đầu → vào owned. Trùng → ghi bản dư vào PLAYER.extra, KHÔNG hoàn shards.
   copies = tổng số bản đang giữ sau lượt này, để màn mở thẻ in "DƯ ×2". */
function take(c, tier){
  const isNew=!owns(c.id);
  if(isNew) PLAYER.owned.push(c.id);
  else { PLAYER.extra=PLAYER.extra||{}; PLAYER.extra[c.id]=(PLAYER.extra[c.id]||0)+1; }
  return { id:c.id, tier, isNew, copies:1+((PLAYER.extra&&PLAYER.extra[c.id])||0) };
}
function pull(n, bannerId='hero'){
  const b=bannerById(bannerId);
  if(!bannerPool(b).length) return null;                       // bể rỗng (chương chưa mở ai) → không cho quay
  const cost = n===10 ? b.cost10 : b.cost1;
  if(PLAYER[b.cur] < cost) return null;
  PLAYER[b.cur] -= cost;
  const res=[]; for(let i=0;i<n;i++){ const r=rollOne(b,false); if(r) res.push(r); }
  if(n===10 && b.tenGuaranteeA && res.length && !res.some(r=>r.tier!=='B')){
    const t=pickTier(b,'A');                                   // ép lượt cuối lên A (bể không có A thì thôi)
    if(t && t!=='B') Object.assign(res[res.length-1], take(rand(gachaPool(t,b)), t));
  }
  savePlayer(); return res.length ? res : null;
}
/* Số bản đang giữ của một đơn vị: 0 = chưa có, 1 = có một, >1 = có bản dư để phân tách (đợt 3) */
const copiesOf = id => owns(id) ? 1+((PLAYER.extra&&PLAYER.extra[id])||0) : 0;
