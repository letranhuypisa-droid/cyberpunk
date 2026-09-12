'use strict';
/* STORY — trang comic trước (intro) và sau (outro) mỗi sector. Đọc bằng js/comic.js (playComic).
   Sửa lời thoại ở đây. Quy tắc viết: câu ngắn, thuật ngữ giải thích ngay lần đầu, bong bóng ≤ 25 chữ, caption ≤ 40 chữ.

   page(layout, ...panel)      layout: splash · v2 (trên/dưới) · h2 (trái/phải) · w3 (1 rộng + 2) · g4 (2×2)
   panel = { img:[ảnh nền, fallback…], pos:'x% y%' (object-position), zoom,
             fg:[sprite trong suốt đè lên], fgFlip, fgX, fgH,
             tint:'chrome'|'rust', sil:'chrome'|'rust' (silhouette khi không có ảnh), bubbles:[…] }
   Ảnh riêng cho panel: đặt file art/comic/<sector>_<i|o><trang>_p<panel>.jpg (vd art/comic/00t_i1_p2.jpg) → tự được ưu tiên
   trước danh sách img. Xem docs/comic-prompts.md.
   Bong bóng: say(who, text, at) · think(who, text, at) · yell(who, text, at) · cap(text, at) · bang(text, at)
   at: tl tr bl br c t b · who: id trong ROSTER/ENEMY_POOL, null = không tên · thêm {as:'TÊN'} để đổi nhãn.

   ĐỔI 12/09 (xem docs/comic-reader.md): tranh phủ TRỌN panel và dán `contain` — không bao giờ bị xén nữa;
   mọi bong bóng dồn thành MỘT CỘT ở đáy panel. Hệ quả cho dữ liệu bên dưới:
   · `at` chỉ còn quyết định LỆCH TRÁI / GIỮA / PHẢI. Thứ tự dọc = thứ tự viết ở đây. Các khối không thể đè nhau.
   · `stack` và `artPos` thành THỪA — renderer bỏ qua. Còn sót trong dữ liệu cũ thì cứ để, không hại gì.
   · `pos` / `zoom` chỉ còn tác dụng với ảnh TẠM (thẻ nhân vật, nền sector) vì ảnh tạm vẫn dán `cover`.
   · Chỉ `bang()` còn neo đè lên tranh, và neo trong vùng tranh CÒN THẤY phía trên cột chữ. */

const say   = (who,text,at='bl')=>({ who, kind:'speech',  text, at });
const think = (who,text,at='bl')=>({ who, kind:'thought', text, at });
const yell  = (who,text,at='c')=>({ who, kind:'shout',   text, at });
const cap   = (text,at='tl')=>({ who:null, kind:'caption', text, at });
const bang  = (text,at='br')=>({ who:null, kind:'sfx', text, at, auto:true });
const page  = (layout,...panels)=>({ layout, panels });
const as    = (b,label)=>Object.assign(b,{as:label});

const ART = { yuki:['art/card/yuki.png'], ash:['art/card/ash.png'], kai:['art/card/kai.png'], psalm:['art/card/psalm.png'], ronin:['art/card/ronin.png'], muzzle:['art/card/muzzle.png'],
              // art thẻ kẻ địch (art/card/<id>.png) — panel nào có mặt địch thì dùng thẳng, khỏi silhouette
              scav:['art/card/scav.png'], rigger:['art/card/rigger.png'], foreman:['art/card/foreman.png'], archon:['art/card/archon.png'],
              motherrust:['art/card/motherrust.png'], cantor:['art/card/cantor.png'] };
const BG  = { yard:['art/bg/bg_07a.jpg'], foundry:['art/bg/bg_07b.jpg'], gate:['art/bg/bg_07c.jpg'], arena:['art/bg/bg_battle.jpg'],
              sewer:['art/bg/bg_07d.jpg','art/bg/bg_07b.jpg'], lift:['art/bg/bg_07e.jpg','art/bg/bg_07c.jpg'] };   // 07-D / 07-E: thả bg_07d.jpg, bg_07e.jpg vào là tự thay nền tạm
const face = (id,zoom=1.6)=>({ img:ART[id], pos:'50% 6%', zoom });        // cận mặt (pos/zoom chỉ dùng cho ảnh tạm — xem ghi chú 12/09 ở đầu file)
const half = (id,zoom=1.15)=>({ img:ART[id], pos:'50% 18%', zoom });      // nửa người

const STORY = {
  /* ===== 00-T · BÃI RƠI — Yuki tỉnh dậy ===== */
  '00-T': {
    intro:[
      page('v2',
        { img:BG.gate, pos:'50% 15%', zoom:1.2, tint:'chrome', bubbles:[
          cap('HALCYON chọc thẳng lên trời như một mũi giáo thép. Ngự trên đỉnh là Tháp Canticle — lộng lẫy, sạch bóng, và ngạo nghễ dòm xuống tất cả.'),
        ]},
        { img:BG.yard, pos:'50% 60%', bubbles:[
          cap('Dưới đáy cùng là Khu Đáy — bãi nôn của Tháp. Luật ở đây ngắn gọn đúng một câu: thứ gì rớt xuống mà không đè chết mày, thì nó là của mày mang đi bán.'),
          bang('VÚT','br'),
        ]}),
      page('w3',
        { ...face('yuki',1.7), bubbles:[
          cap('Đêm nay Tháp lại xả rác. Nhưng thứ cắm thẳng xuống họng xả số 9 không phải một đống sắt vụn.','tl'),
          think('yuki','…Không thấy đau. Chỉ thấy rỗng toác. Như thể vừa bị ai đó thọc tay vào đầu bốc mất nửa linh hồn.','br'),
        ]},
        { img:ART.yuki, pos:'50% 2%', zoom:2.4, bubbles:[
          cap('Cái Halo — vòng định danh mà Canticle tròng lên đầu đám lính máy — đã gãy gập, tóe ra từng tia điện xanh lè giật liên hồi.','bl'),
          bang('XẸT… XOẸT','tr'),
        ]},
        { img:BG.yard, pos:'50% 70%', bubbles:[   // đã có art riêng 00t_i2_p3 → bỏ lớp fg sprite, không thì vẽ chồng hai Yuki
          say('yuki','Trong đầu sót lại đúng hai mảnh ký ức. Tên mình là Yuki.','tl'),
          say('yuki','Và… cách chém người bằng thanh kiếm này.','br'),
        ]}),
      /* Trang 3 đổi h2 → v2 (11/09): art anh vẽ là khổ ngang 16:9, mà ô của h2 là cột dọc 176×685 —
         cắt giữa kiểu đó thì ba tên Scav chỉ còn một, và đường chém của Yuki mất sạch. v2 là hai ô ngang xếp chồng. */
      page('v2',
        { ...half('scav',1.25), bubbles:[
          cap('Đám Scav đánh hơi thấy mùi “đồ chơi” xịn vừa rớt. Tiếng ủng cao su lội lép bép trong vũng mưa axit, kính hồng ngoại lập lòe như mắt thú đói.','tl'),
          as(yell('scav','Hàng tuyển rơi tụi bay ơi! Giữ nguyên cái vòng! Lột sạch giáp ngoài! Xẻ thịt chia phần mau!','b'),'SCAV'),
        ]},
        { img:BG.yard, pos:'50% 70%', bubbles:[
          say('yuki','Sáu mạng. Tạm đủ khởi động.','tl'),
          yell('yuki','Một… hai…','br'),
        ]}),
    ],
    outro:[
      /* Trang này đổi w3 → v3 (11/09): art anh vẽ là khổ ngang, mà hai ô nhỏ của w3 là cột dọc 0,52 —
         riêng panel 3 có cả Ash lẫn Kai trong một khung, cắt kiểu đó là chặt đôi cả hai người. */
      page('v3',
        /* Dải v3 rất thấp (238px ở màn 812, còn thấp hơn ở màn ngắn) → MỖI DẢI CHỈ MỘT BONG BÓNG,
           gộp hai câu lại. artPos neo ảnh lên trên để không mất đầu nhân vật khi ô bị bẹt. */
        /* Yuki đứng chính giữa khung nên bong bóng nào ở nửa trên cũng che mặt cô.
           Caption rút còn ba chữ để nó hẹp, nép được vào góc trái; câu "bùn lầy nhuộm đỏ quạch" bỏ đi
           vì bùn đỏ quạch đã nằm sẵn trong ảnh, không cần tả lại. Thoại dồn xuống đáy. */
        { img:BG.yard, pos:'50% 65%', artPos:'50% 44%', bubbles:[   // đã có art riêng 00t_o1_p1 → bỏ lớp fg sprite
          cap('Mười phút sau.','tl'),
          say('yuki','…Xong hết rồi à?','b'),
        ]},
        { ...half('ash'), artPos:'50% 34%', bubbles:[
          say('ash','Hàng cực phẩm… Halo cấp S, vỡ vòng ngoài nhưng lõi còn nguyên tem. Cạy ra bán, chị em tao húp thịt hộp nửa năm!','br'),
        ]},
        { ...half('kai'), artPos:'50% 30%', bubbles:[
          say('kai','Bớt giùm em đi, bà chị sinh trước bảy phút ơi. Chị định để em mồ côi một mình hay gì?','b'),
        ]}),
      page('v2',
        /* artPos neo lên sát mép trên: Halo với bàn tay chỉ lên nằm ở đỉnh khung, neo giữa là mất cả hai. */
        { ...face('yuki'), artPos:'50% 8%', bubbles:[
          say('yuki','Yuki. Tôi chỉ nhớ mỗi cái tên đó thôi.','bl'),
          say('yuki','Ai mở được cái này ra?','tr'),
        ]},
        /* Mặt Ash nằm ở góc trên-trái khung và ô này chỉ cao ~274px, nên khối chữ lớn phải dồn xuống dưới:
           caption ngắn ở `t` (chỉ chớm vai cô), lời thoại gộp làm một ở `b` (đè lên thân, không đè lên mặt).
           Hai câu của Ash vốn là một lượt nói liền mạch nên gộp không mất gì. */
        { ...half('ash'), artPos:'50% 26%', bubbles:[
          say('ash','Lò đúc lão Foreman. Chỉ lửa ở đó luộc nổi hợp kim Tháp. Mà tao không làm từ thiện: gỡ vòng xong thì trừ nợ.','c'),
          cap('Không đáp lời, cô lẳng lặng cất bước đi theo.','b'),   // rút còn một dòng: dài hơn là đè lên bong bóng ở giữa
        ]}),
    ]},

  /* ===== 07-A · CỔNG BÃI XE — việc thử của Ronin ===== */
  '07-A': {
    intro:[
      page('w3',
        /* Ba khối chữ trong một ô: neo tuyệt đối tl → c → b vẫn đè nhau ở máy thấp (iPhone SE 375×667),
           vì `c` luôn căn giữa 50% bất kể khối dưới cao bao nhiêu. Xếp cột (stack) thì hết đè. */
        { ...half('ronin'), stack:true, bubbles:[
          cap('Tổ nhặt phế liệu của Ronin. Thiết quân luật duy nhất: cấm rã xác người.','tl'),
          say('ronin','Ở đây tao lượm sắt vụn, không xẻ thịt đồng loại. Muốn nhập bọn thì chứng minh mày không phải cục nợ.','c'),
          say('ronin','Lũ Scav đang chặn cổng bãi xe, bóp nghẹt đường ăn của tổ. Dọn sạch chúng nó cho tao.','b'),
        ]},
        { ...half('muzzle'), stack:true, bubbles:[
          /* Ô nhỏ của w3 chỉ rộng 176px → chứa vừa HAI khối chữ, ở máy thấp thì vừa sát nút.
             Gộp "Đỡ đòn." vào câu sau (giọng cộc lốc giữ nguyên) rồi xếp cột cho chắc. */
          cap('Muzzle quẳng cho Yuki một tấm khiên thô, gò vội từ cánh cửa xe bọc thép.','tl'),
          say('muzzle','Đỡ đòn. Cửa này chịu được ba phát. Phát thứ tư… để tôi lấy thân ra đỡ.','b'),
        ]},
        { ...half('kai'), bubbles:[
          say('kai','Quy tắc vàng để sống sót ở cái xó này: đừng bao giờ tin nụ cười của bất kỳ ai.','tl'),
          say('kai','Trừ em ra nhé. Em đẹp trai uy tín thế này, lừa chị làm sao được!','br'),
        ]}),
      page('w3',
        { ...face('yuki'), bubbles:[
          say('yuki','Tôi đang cười à? Ừ. Chắc là vậy.','bl'),
        ]},
        { ...half('ash'), bubbles:[
          say('ash','Liệu mà sống. Mày chết trước khi tao kịp bán cái vòng thì tao lỗ.','bl'),
        ]},
        { ...half('scav',1.1), bubbles:[
          cap('Cổng bãi xe. Hai tốp Scav đang chờ.','tl'),
          say('yuki','Một tốp. Hai tốp. Tôi đếm được.','b'),
        ]}),
      /* Trang thêm 11/09 — ra mắt RIGGER, trùm băng Scav, boss của màn này (thêm ở CUỐI intro, không đụng cấu trúc trang đã chốt 09/09).
         Ảnh riêng nếu vẽ: art/comic/07a_i3_p1.jpg … _p3.jpg */
      page('w3',
        { ...half('rigger',1.15), bubbles:[
          cap('Rồi tốp thứ ba tới. Đi sau cùng, không vội. Trùm băng Scav.','tl'),
          yell('rigger','Luật bãi tao gọn thôi. Cứ rơi là hàng!','b'),
        ]},
        { ...face('yuki'), bubbles:[
          say('rigger','Con ả này rớt trúng bãi tao đêm kia. Nó là đồ của tao!','tl'),
          think('yuki','…Hàng. Ai cũng gọi tôi là hàng.','br'),
        ]},
        /* Ô nhỏ 176px, hai khối chữ + một tiếng động. Để câu của Ash ở `c` thì lời dẫn nuốt mất ở máy thấp
           → xếp cột: câu Ash lên đầu, lời dẫn xuống đáy, tiếng RÍT vẫn neo tự do để đè lên tranh. */
        { ...half('ash'), stack:true, bubbles:[
          say('ash','Hàng của tổ tao, cọc rồi. Biến.','tl'),
          bang('RÍT','c'),   // 'tr' bị bong bóng của Ash che gần hết sau khi xếp cột; 'c' rơi đúng đường chém
          cap('Ash chém toác khớp vai hắn rồi bước lên chắn trước mặt Yuki.','b'),
        ]}),
    ],
    outro:[
      page('v2',
        { img:BG.yard, pos:'50% 20%', zoom:1.2, bubbles:[
          cap('Xuyên qua màn sương mù độc hại, một con drone trinh sát của Canticle hạ thấp độ cao. Tia laser đỏ lòm khóa thẳng vào con ngươi Yuki.','tl'),
          bang('VÙÙÙ','br'),
        ]},
        { img:BG.yard, pos:'50% 70%', bubbles:[
          yell('kai','Chết cha mày nè!','tl'),
          bang('XOẸT!!','c'),
          cap('Nhát chém ngọt xớt của Kai phạt con drone làm đôi. Trên mảnh vỏ hợp kim còn bốc khói khét lẹt, một ký hiệu khắc laser lộ ra: 07.','b'),
        ]}),
      page('w3',
        { ...face('yuki'), bubbles:[
          say('yuki','07. Ký hiệu đó…','bl'),
          say('yuki','…Ám chỉ tôi sao?','tr'),
        ]},
        { ...half('ash'), bubbles:[
          say('ash','Canticle đang lùng sục mày ráo riết rồi đấy.','tl'),
          say('ash','Mày có giá hơn tao tưởng nhiều. Nhưng cũng phiền phức gấp mười lần.','br'),
        ]},
        { ...half('ronin'), bubbles:[
          say('ronin','Rồi. Lò Foreman. Sáng mai cả ba đứa đi.','bl'),
        ]}),
    ]},

  /* ===== 07-B · LÒ ĐÚC — băng Foreman ===== */
  '07-B': {
    intro:[
      page('v2',
        { img:BG.foundry, pos:'50% 40%', bubbles:[
          cap('Xưởng đúc bỏ hoang cắm sâu dưới lòng đất. Từng của Canticle, nay là hang ổ băng Foreman — nơi có ngọn lửa duy nhất ở Khu Đáy đủ nóng để bẻ khóa một chiếc Halo.','tl'),
        ]},
        { ...half('foreman'), bubbles:[
          say('foreman','Lũ trên Tháp cứ tưởng dát vàng lên người là thành thần thành thánh.','t'),
          say('foreman','Rơi vào lò tao thì vàng ròng hay sắt vụn cũng thành nước phở hết! Đống chrome trên người mày… tao tính tiền theo cân!','b'),
        ]}),
      /* Trang thêm 11/09 (chỗ mỏng 2): dựng giá phải trả trước khi nung — nung hỏng thì ký ức trong vòng chết theo. */
      page('w3',
        { img:BG.foundry, pos:'50% 55%', zoom:1.25, bubbles:[
          cap('Cửa lò mở tung. Luồng nhiệt hừng hực thốc vào mặt, đẩy cả ba phải lùi lại nửa bước.','tl'),
          say('ash','Ký ức mày bị niêm phong trong cái vòng đó. Muốn cạy ra thì phải nung đỏ.','br'),
        ]},
        { ...face('yuki'), bubbles:[
          say('yuki','Nung hỏng thì sao?','bl'),
          say('ash','Thì cái vòng hỏng. Ký ức bên trong cũng mất.','tr'),
        ]},
        { ...half('kai'), bubbles:[
          say('kai','Tự dưng chị lải nhải giải thích dài dòng thế là đang lo sốt vó lên chứ gì?','tl'),
          say('yuki','Cứ nung đi. Tôi tự chịu.','br'),
        ]}),
      /* Tách panel (10/09 — theo art anh vẽ): anh gửi BA ảnh cho trang này (Yuki hỏi · Foreman gầm ·
         Ash-Kai rút vũ khí), nên panel 2 cũ tách làm hai — Foreman một khung, hai chị em một khung.
         Layout h2 (hai cột 0,26) không chứa nổi ảnh dọc 0,56; w3b = hai ô dọc trên + một ô rộng dưới,
         đúng khớp với khổ anh xuất: hai tấm dọc 0,563 và một tấm vuông 1,0. */
      page('w3b',
        { ...face('yuki'), bubbles:[
          say('yuki','Tôi cần mượn ngọn lửa của ông để bẻ cái vòng này. Ông muốn đổi bằng thứ gì?','bl'),
        ]},
        { ...face('foreman',1.5), bubbles:[
          say('foreman','Tao muốn tống cả xác mày vào lò làm củi đốt!','tl'),
        ]},
        /* Không xếp cột ở đây: art để đầu Ash và Kai sát mép trên, mà xếp cột thì câu hét của Kai
           lên đầu cột và che mất cả hai cái đầu. Neo `c` cho câu hét (đè ngực) + `b` cho câu của Ash. */
        { ...half('ash'), bubbles:[
          yell('kai','Chị ơi?! Lão này có hiểu tiếng người không đấy?!','c'),
          say('ash','Rút đồ chơi ra!','b'),
        ]}),
    ],
    outro:[
      page('w3',
        { img:BG.foundry, pos:'50% 45%', zoom:1.2, bubbles:[
          cap('Foreman đổ sụp xuống sàn. Ngọn lò vẫn cháy hừng hực. Ash dùng kẹp sắt giữ chặt chiếc vòng gãy, dí sát mối nối vào tim lửa trắng.','tl'),
          bang('XÈÈÈO…','br'),
        ]},
        { ...face('yuki',1.9), tint:'chrome', bubbles:[
          cap('Một căn phòng vô trùng trắng toát đến lạnh người. Yuki bị xích chặt trên ghế kim loại.','tl'),
          as(say(null,'Đơn vị 07. Xác nhận từ Cantor: Tỷ lệ đồng bộ dưới 40%. Xếp loại: Phế phẩm thải loại.','br'),'GIỌNG TRONG KÝ ỨC'),
        ]},
        { ...half('psalm'), tint:'chrome', bubbles:[
          cap('Một bàn tay mang găng đen khẽ đặt lên đỉnh đầu cô. Chủ nhân của nó mang một chiếc Halo rực ĐỎ.','tl'),
          think('yuki','…Cantor. Người đó chính là Cantor.','br'),
        ]}),
      /* Trang thêm 11/09 (chỗ mỏng 2): ký ức chạy tiếp — bàn tay không nhấn nút. Hình trước, nghĩa sau: 07-C mới giải thích. */
      page('w3',
        { ...half('psalm'), tint:'chrome', bubbles:[
          cap('Nhưng bàn tay ấy không nhấn nút hủy. Nó đưa ngược lên đỉnh đầu của chính mình.','tl'),
          bang('RẮC!','bl'),   // art đã cắm: 'c' đè thẳng vào mặt Psalm, 'tr' thì đè lời dẫn → góc dưới-trái là chỗ trống duy nhất
        ]},
        { img:BG.gate, pos:'50% 55%', zoom:1.4, tint:'chrome', bubbles:[
          cap('Chiếc vòng đỏ gãy lìa. Ngay sau đó, vòng của cô nứt toác. Sàn kim loại dưới chân bất thình lình mở toang—','tl'),
          bang('ẦM!!','br'),
        ]},
        { ...face('yuki',1.9), bubbles:[
          cap('Đoạn ký ức tắt ngấm. Yuki giật bắn mình tỉnh lại, quỳ sụp giữa sàn xưởng.','tl'),
          say('yuki','Có người đã thả tôi xuống đây… Là cố tình làm vậy.','br'),
        ]}),
      page('v2',
        { ...half('foreman'), bubbles:[
          say('foreman','Lũ óc chó này… Bật lò hết công suất thế này thì tín hiệu nhiệt trên Tháp nó thấy sạch rồi…','tl'),
          say('foreman','Tụi mày vừa tự thắp đuốc… dẫn quỷ xuống gõ đầu đấy…','br'),
        ]},
        { ...half('ash'), bubbles:[
          say('ash','Càng tốt. Đỡ mất công trèo lên tận nơi kiếm tụi nó.','tl'),
          say('kai','Chị nói câu đó cho đỡ quê à?','br'),
          say('ash','…Ừ.','bl'),
        ]}),
    ]},

  /* ===== 07-C · HÀNG RÀO TẬP ĐOÀN — Canticle xuống thu hồi, Psalm lộ diện ===== */
  '07-C': {
    intro:[
      page('v2',
        { img:BG.gate, pos:'50% 40%', bubbles:[
          cap('Vành đai đệm ngăn cách Khu Đáy với chân Tháp. Kính cường lực xám xịt, lưới quét nhiệt đan dày, tháp súng tự động chĩa họng đen ngòm.','tl'),
        ]},
        { ...half('archon'), bubbles:[
          as(say('archon','Cảnh báo: Phát hiện Đơn vị 07. Trạng thái: hư hỏng. Yêu cầu tự giác bước vào khoang thu hồi để tháo dỡ linh kiện.','t'),'ARCHON · AI CỔNG'),
          as(say('archon','Các cá thể đi cùng: Giải tán ngay lập tức, hoặc bị tiêu huỷ theo diện phế phẩm.','b'),'ARCHON · AI CỔNG'),
        ]}),
      page('w3',
        { ...half('psalm'), stack:true, bubbles:[
          cap('Một bóng người bước ra từ góc khuất rỉ sét. Chiếc Halo đỏ trên đầu đã nứt toác, câm bặt ánh sáng. Cánh tay và bả vai phải bọc hoàn toàn bằng kim khí thô ráp.','tl'),
          say('psalm','Tôi là Psalm. Kẻ đã cắt đứt vòng định danh Halo của cô rồi tống cô xuống đường ống cống.','br'),
          say('psalm','Muốn xiên tôi đòi nợ à? Sống qua trận này đã.','b'),
        ]},
        { ...half('kai'), bubbles:[
          say('kai','Khoan đã bà chị! Nhìn cái Halo màu đỏ kìa. Hàng xịn thế này ra chợ đen bán được bộn tiền không?!','bl'),
        ]},
        { ...half('ash'), bubbles:[
          say('ash','Ngậm mồm lại.','tl'),
          cap('Kai và Muzzle lùi về bọc hậu giữ đường lui. Psalm bước lên lấp vào khoảng trống đội hình.','b'),
        ]}),
      /* h2 -> v2 (10/09): ô của h2 là cột dọc 0,26. Ảnh anh gửi cho panel 1 có Yuki và Psalm đứng CẠNH
         nhau, cắt xuống 0,26 là mất hẳn một người. v2 (0,997) giữ được cả hai, chỉ hụt phần chân. */
      page('v2',
        { ...face('yuki'), bubbles:[
          say('yuki','Bà là người xuất hiện trong ký ức của tôi. Chúng ta có chuyện để nói với nhau đấy.','bl'),
          say('psalm','Xem ra cô phản xạ nhanh hơn lần cuối tôi thấy đấy, Đơn vị 07.','tr'),
        ]},
        { ...face('archon',1.4), bubbles:[
          as(say('archon','Kích hoạt giao thức cưỡng chế thu hồi.','t'),'ARCHON · AI CỔNG'),
          bang('VÙ… VÙÙÙ!','br'),
        ]}),
    ],
    outro:[
      page('v2',
        { ...half('psalm'), bubbles:[
          cap('Cỗ máy Archon nổ tung thành biển lửa, thổi bay một mảng hàng rào hợp kim kiên cố. Khói đen cuộn xoáy.','tl'),
          say('psalm','Trên Tháp, lính sinh học biến đổi như cô gọi là Choir — Đội Hợp Xướng. Hỏng hóc là bị lôi đến phòng tôi.','br'),
        ]},
        { ...face('psalm',1.5), bubbles:[
          say('psalm','Tôi nghe chúng xưng tội lần cuối, rồi tự tay nhấn nút format sạch sành sanh. Ba trăm mười hai đứa, không sót một mống.','bl'),
          say('psalm','Cô là ca thứ ba trăm mười ba. Cô không xưng tội. Cô hỏi ngược tôi: “Bà đã tước bao nhiêu mạng người?”','tr'),
        ]}),
      page('v2',
        { ...face('yuki'), bubbles:[
          say('yuki','Và thế là bà cắt đứt Halo của cả hai người.','tl'),
          say('yuki','Bà nợ tôi một câu trả lời. Tôi rốt cuộc là ai trước khi bị tống lên ngọn Tháp đó?','br'),
        ]},
        { ...face('psalm',1.5), bubbles:[
          say('psalm','Tôi không biết.','tl'),
          say('psalm','Nhưng dưới đáy cống ngầm có mụ già ghi chép mọi thứ rơi từ trên trời xuống. Từ sắt vụn… cho tới trẻ con.','br'),
        ]}),
      /* Trang thêm 11/09 (chỗ mỏng 3): Yuki phải TRẢ GIÁ để nhận Psalm. Lý do tha nằm ở luật của Kai — bị quên là chết lần thứ hai. */
      page('w3',
        { ...face('yuki'), bubbles:[
          cap('Yuki chậm rãi nâng thanh kiếm lên, gác ngang vai Psalm. Lưỡi bén áp sát cổ họng. Không một ai bước ra can ngăn.','tl'),
          say('yuki','Ba trăm mười hai sinh mạng. Cho tôi một lý do để tha cho bà.','br'),
        ]},
        { ...face('psalm',1.5), bubbles:[
          say('psalm','Chẳng có lý do nào cả. Tôi đã làm, và tôi nhớ trọn vẹn ba trăm mười hai cái tên đó.','bl'),
          say('psalm','Muốn chém thì cứ vung kiếm. Tôi không mở miệng xin tha.','tr'),
        ]},
        /* art đã cắm: đầu Kai nằm ở 1/5 trên khung. Hai câu này dài, cộng lại 220px trong ô cao 335px —
           vừa đủ chỗ, nhưng dàn đều thì khối đầu dính mép trên và che kín mặt. stack:'end' dồn cả cột
           xuống đáy: mặt Kai lộ trọn phần trên, hai khối vẫn không đè nhau. */
        { ...half('kai'), stack:'end', bubbles:[
          say('kai','Đừng chị… Nếu bả chết, ba trăm mười hai con người kia cũng biến mất vĩnh viễn theo.','tl'),
          say('kai','Ở dưới Khu Đáy này, bị người đời lãng quên mới là cái chết thực sự.','bl'),
        ]}),
      page('v2',
        { ...half('ash'), bubbles:[
          say('ash','Mother Rust. Giáo phái Rỉ Sét, lũ cuồng tín chuyên thờ phụng những mảnh rác rơi xuống từ Tháp.','tl'),
          say('ash','Mày mà vác xác tới đó, lũ đó sẽ lột sạch đồ của mày ra để đem lên bàn thờ đấy.','br'),
        ]},
        { ...half('psalm'), bubbles:[
          say('yuki','Bà đi cùng chúng tôi. Và dọc đường, bà phải đọc cho tôi nghe từng cái tên một.','tl'),
          cap('PSALM gia nhập tổ đội. Không phải vì được dung thứ — mà để trở thành cuốn sổ sống lưu giữ người đã khuất.','b'),
        ]}),
    ]},

  /* ===== 07-D · NHÀ THỜ DƯỚI CỐNG — Mother Rust và tên thật ===== */
  '07-D': {
    intro:[
      page('v2',
        { img:BG.sewer, pos:'50% 30%', zoom:1.4, tint:'rust', bubbles:[
          cap('Thánh đường rữa nát dưới lòng cống. Ống xả mục hàn chắp vá thành cây đàn phong cầm khổng lồ; xác lính máy xếp thành bệ thờ nghi ngút khói; nến đỏ cắm ngập trên những hộp sọ cơ khí.','tl'),
        ]},
        { ...half('motherrust'), tint:'rust', bubbles:[
          say('motherrust','Hỡi đứa con của sắt thép… Ta nhớ ánh mắt hoang dại này, từ trước khi lũ trên Tháp khắc số hiệu lên gáy con.','t'),
          say('motherrust','Quỳ xuống đi. Để ta tháo rời từng khớp xương rỉ máu, gột rửa và thánh hóa con trong bể dầu thánh…','b'),
        ]}),
      /* h2 -> v2 (10/09): ô h2 chỉ giữ 46% bề ngang ảnh. Thử cắt cả hai kiểu rồi so — panel 2 mất sạch
         mấy hàng tín đồ đứng sau lưng Psalm, đúng cái mà câu thoại đang nói ("ba vòng tín đồ cảm tử"). */
      page('v2',
        { ...face('yuki'), bubbles:[
          say('yuki','Kể chuyện trước, tháo xác sau.','bl'),
          say('yuki','Bằng không, kẻ bị tháo rời linh kiện đầu tiên sẽ là bà.','tr'),
        ]},
        { ...half('psalm'), bubbles:[
          say('psalm','Bà ta giăng sẵn ba vòng tín đồ cảm tử. Phải đánh bóc vỏ từ ngoài vào trong.','tl'),
          yell('kai','Khỉ thật, sao lúc quái nào cũng là ba lớp thế hả?!','br'),
        ]}),
    ],
    outro:[
      page('v2',
        { ...face('motherrust',1.5), tint:'rust', bubbles:[
          cap('Mother Rust gục ngã dưới chân bệ thờ loang lổ. Bà không chạy trốn, run rẩy giở cuốn sổ bọc da đen ngòm vì dầu nhớt.','tl'),
          say('motherrust','Sáu năm trước, Tầng Bốn sụp đổ. Bốn nghìn mạng người. Canticle đóng lên một con dấu đỏ: “Sự cố kết cấu”.','br'),
        ]},
        { img:BG.sewer, pos:'50% 35%', zoom:1.3, tint:'rust', bubbles:[
          say('motherrust','Ba ngày sau, xe tải bọc thép trắng bò xuống vùng đổ nát. Chúng không bới sắt vụn… chúng vét lũ trẻ mồ côi.','tl'),
          say('motherrust','Lựa những đứa phản xạ bén nhất, lầm lì và cứng đầu nhất…','br'),
        ]}),
      page('v2',
        { img:BG.yard, pos:'50% 40%', zoom:1.3, tint:'rust', bubbles:[
          say('motherrust','Ta chỉ kịp nhét vài đứa giấu sâu dưới đáy hầm phân hủy. Nhưng không tài nào giấu nổi con…','tl'),
        ]},
        { img:BG.yard, pos:'50% 70%', zoom:1.5, tint:'rust', bubbles:[
          say('motherrust','Con bé mười một tuổi gầy trơ xương, tay cầm đoản kiếm rỉ sét của bố, đứng chắn ngang bánh xích xe tải.','tl'),
          say('motherrust','Mắt nó ráo hoảnh, không một giọt nước mắt. Miệng chỉ lẩm nhẩm bài đồng dao đếm bước chân của trẻ Khu Đáy…','br'),
        ]}),
      page('w3',
        { ...face('yuki',1.9), stack:true, bubbles:[
          cap('Mảnh ký ức vụn vỡ bất ngờ dội về trong tâm trí Yuki.','tl'),
          think('yuki','Một bước… Hai bước… Ba bước…','tr'),
          think('yuki','Bê tông nứt toác. Cát bụi mù mịt. Bàn tay lạnh ngắt của mẹ buông thõng. Xác bố bẹp dúm dưới dầm thép gãy.','br'),
        ]},
        /* art đã cắm: Cantor và cái Halo vàng kim nằm ở 1/4 trên khung, mà lời dẫn 28 chữ trong ô nhỏ 176px
           cao tới 162px — để `tl` là che kín cả đầu lẫn vòng. stack:'end' dồn xuống đáy, chừa lại đúng
           cái Halo vàng — thứ mà chính câu lời dẫn đang gọi tên. Mặt hắn để dành cho panel sau. */
        { ...face('cantor',1.5), tint:'chrome', stack:'end', bubbles:[
          cap('Chiếc xe bọc thép trắng tinh không tì một vệt bụi bẩn. Gã đàn ông đội chiếc Halo vàng kim chói lóa cúi người nhìn xuống cô bé lấm lem đang gườm gườm chĩa kiếm.','tl'),
          as(say(null,'Đứa này. Xích cổ nó ném lên xe.','b'),'GIỌNG TRONG KÝ ỨC'),
        ]},
        { ...face('yuki'), bubbles:[
          say('yuki','Cantor…','tl'),
          say('yuki','Chính lão ta là kẻ đã ném tôi lên chuyến xe đó.','br'),
        ]}),
      page('v2',
        { ...half('kai'), stack:true, bubbles:[
          say('kai','…Bố mẹ chị… cũng chôn xác ở Tầng Bốn sao?','tl'),
          say('ash','Ba mẹ tao. Và cả dòng họ tao với thằng Kai nữa… Tất cả đều nằm vĩnh viễn dưới đống gạch vụn thối rữa đó.','br'),
          cap('Lần đầu tiên trong đời, Ash mở miệng nói về gia đình mình.','bl'),
        ]},
        { ...half('motherrust'), tint:'rust', bubbles:[
          say('motherrust','Thang máy vận chuyển hàng số 3 nằm ngay sau lưng ta. Dẫn thẳng lên khu nghiên cứu trung tâm của Tháp.','tl'),
          say('motherrust','Cơ mà các con chẳng cần nhọc xác leo lên đâu… Thằng cha Cantor đang đích thân dẫn quân xuống đây dọn rác rồi đấy.','br'),
        ]}),
    ]},

  /* ===== 07-E · THANG MÁY HÀNG — Cantor ===== */
  '07-E': {
    intro:[
      page('v2',
        { img:BG.lift, pos:'50% 20%', zoom:1.3, tint:'chrome', bubbles:[
          cap('Sàn nâng công nghiệp số 3, một khối lồng sắt khổng lồ lao từ đỉnh Tháp xuống đáy sâu. Mỗi lần cửa lưới mở ra là một hàng lính Choir đứng bất động, vô hồn như búp bê cơ khí.','tl'),
        ]},
        { ...half('cantor'), tint:'chrome', bubbles:[
          say('cantor','Đơn vị 07. Cô đang để dữ liệu bảo mật rò rỉ khắp cái máng lợn này. Ta đích thân xuống ấn nút xóa rác.','t'),
          say('cantor','Còn Psalm… Giờ khắc của cô cũng hết hạn rồi.','b'),
        ]}),
      /* Trang thêm 11/09 (chỗ mỏng 5): khép vòng — bốn kẻ định giá của chương 1 vọng lại, rồi Yuki đáp bằng cái tên. */
      page('w3',
        { ...face('yuki'), bubbles:[
          cap('Trước khi mở miệng đáp lời, toàn bộ những thanh âm định giá thân xác cô suốt hành trình trốn chạy đồng loạt cuộn trào về, gầm vang chát chúa trong lồng ngực.','tl'),
        ]},
        { img:BG.foundry, pos:'50% 50%', zoom:1.3, tint:'rust', bubbles:[
          say('rigger','Rơi trúng bãi của tao, thì nó là tài sản của tao!','tl'),
          say('foreman','Mớ chrome trên người mày, tao mua tính theo từng ký lô!','br'),
        ]},
        { img:BG.sewer, pos:'50% 40%', zoom:1.3, bubbles:[
          say('archon','Tài sản trốn chạy. Cưỡng chế thu hồi để rã xác phế phẩm.','tl'),
          say('motherrust','Bộ xương thép của thiên thần giáng thế… Rã ra mà thánh hóa!','br'),
        ]}),
      page('w3',
        { ...face('yuki'), stack:true, bubbles:[
          say('yuki','Lũ chúng mày thích gọi tao bằng đủ thứ tên định giá trên đời. Nhưng tao có tên thật của tao.','bl'),
          say('yuki','Tao là Yuki. Còn mày chỉ là một thằng đồ tể nợ máu bốn nghìn sinh mạng ở Tầng Bốn!','br'),
        ]},
        { ...half('psalm'), bubbles:[
          say('psalm','Ba trăm mười hai lần tôi bấm nút format ký ức theo mệnh lệnh của ông.','tl'),
          say('psalm','Hôm nay, lần thứ ba trăm mười ba… là nhát bấm tiễn đưa chính ông xuống mồ.','br'),
        ]},
        { ...half('ash'), bubbles:[
          say('ash','Bốn tầng nâng. Bốn đợt xả đạn.','tl'),
          say('kai','Một tầng một mạng! Đếm tiếp đi, chị hai Yuki!','br'),
        ]}),
      /* h2 -> v2 (10/09, trang h2 thứ tư phải đổi): ô h2 chỉ giữ 46% bề ngang. Cắt kiểu đó thì panel 1
         mất sạch hàng lính Choir đứng hai bên Cantor, còn panel 2 mất hết vệt chạy của Yuki. */
      page('v2',
        { ...face('cantor',1.5), tint:'chrome', bubbles:[
          say('cantor','Tiêu hủy. Bắt đầu.','t'),
        ]},
        /* Đã có art riêng 07e_i4_p2.jpg → bỏ lớp fg sprite cũ (07e_i4_p2_fg.png), không thì vẽ chồng hai Yuki. */
        { img:BG.lift, pos:'50% 70%', bubbles:[
          yell('yuki','MỘT!','tr'),
        ]}),
    ],
    outro:[
      /* Chỗ mỏng 4 (sửa 11/09): cú lộ con rối trước chỉ gói trong một bong bóng, giờ dựng thành hai trang. */
      page('w3',
        { img:BG.lift, pos:'50% 55%', zoom:1.3, bubbles:[
          cap('Lưỡi kiếm rít gió, chém ngọt một đường chéo dứt khoát xẻ toang lồng ngực Cantor. Nhưng tuyệt nhiên không có một giọt máu tươi bắn ra.','tl'),
          bang('XOẸT!','br'),
        ]},
        { ...face('cantor',1.4), tint:'chrome', bubbles:[
          cap('Chỉ có chùm cáp quang đứt phụt, tia lửa điện nổ tanh tách tóe sáng cùng dung dịch làm mát màu xanh nhớt trào ra như mủ.','tl'),
          think('yuki','…Không phải cơ thể người?!','br'),
        ]},
        { ...face('cantor',1.5), tint:'chrome', bubbles:[
          cap('Trên lớp da mặt bằng nhựa tổng hợp đang biến dạng nham nhở vì chập điện, một mắt chiếu hologram bật sáng nhấp nháy.','tl'),
          say('cantor','Ra đòn ấn tượng đấy, 07. Tiếc thay, thứ cô vừa xẻ đôi chỉ là một con rối điều khiển từ xa mà thôi.','br'),
        ]}),
      page('v2',
        { img:BG.gate, pos:'50% 18%', zoom:1.45, tint:'chrome', bubbles:[
          cap('Phân khu Thượng tầng District 01. Cantor thật ung dung tựa lưng vào ghế nhung, nhấp ly vang đỏ trong căn penthouse áp mái, ngạo nghễ nhìn xuống qua màn ảnh viễn trắc.','tl'),
          say('cantor','Muốn tìm ta bằng xương bằng thịt? Tự nhấc chân mà leo lên đỉnh Tháp này. Ta ngồi đây đợi cô… đồ rác rưởi.','br'),
        ]},
        { ...face('yuki'), bubbles:[
          say('yuki','Tao đã nhớ lại toàn bộ.','tl'),
          say('yuki','Bố. Mẹ. Thảm kịch Tầng Bốn. Và sáu năm ròng rã bị biến thành món đồ chơi “Đơn vị 07” của mày.','br'),
        ]}),
      /* Tách trang (10/09): bản văn anh viết lại dài hơn ~60%, ba panel này gộp một trang thì panel 2
         (Kai hét + hai câu của Ash) cần 204px chữ mà ô v3 ở iPhone SE chỉ cao 189px — tràn 42px.
         Cắt làm hai trang: v2 cho hai panel đối thoại, splash cho lời thề của Kai.
         SỐ PANEL KHÔNG ĐỔI (vẫn 3 tấm art), chỉ đổi tên file: panel 3 giờ là 07e_o4_p1. */
      page('v2',
        /* art đã cắm: đầu Psalm và Ash nằm ở 1/4 trên khung → dàn đều là che kín cả hai mặt.
           stack:'end' dồn cột xuống đáy, chừa trọn phần đầu. */
        { ...half('psalm'), stack:'end', bubbles:[
          say('psalm','Trên đỉnh Tháp có hàng nghìn đứa trẻ bị bắt cóc như cô năm xưa. Giờ chúng đã thành một dàn Choir hoàn chỉnh.','tl'),
          say('ash','Hàng nghìn đứa? Thế nghĩa là… có cả nghìn cái Halo hạng S nguyên seal chưa bóc tem à?','br'),
        ]},
        { ...half('ash'), stack:true, bubbles:[
          yell('kai','Chuyến này trúng mánh rồi! Bán xong nhớ chia em sáu phần đấy nhé!','c'),
          say('ash','Bớt mơ mộng đi nhóc con. Chị mày chui ra khỏi bụng mẹ trước mày bảy phút. Chia đôi sòng phẳng.','t'),
          say('ash','…Còn phần của mày, Yuki. Tụi tao để riêng một cọc.','b'),
        ]}),
      page('splash',
        { ...half('kai'), stack:true, bubbles:[
          say('kai','Em sẽ lấy bút ghi lại hết. Không sót một cái tên nào. Phải để lũ chuột dưới cống này biết đường mà nhớ họ!','bl'),
        ]}),
      /* Trang thêm 11/09 (chỗ mỏng 1): Ronin và Muzzle biến mất sau 07-A. Trả họ về đúng chỗ Ronin phải quyết — cả tổ có leo Tháp hay không.
         Đổi w3 -> v3 (10/09): ô nhỏ 176px không chứa nổi lời dẫn dài + câu của Ronin (tràn 31px ở iPhone SE). */
      page('v3',
        { ...half('muzzle'), stack:true, bubbles:[
          cap('Tiếng sắt thép cọ quẹt nặng nề kéo lê dọc đường ống. Muzzle lù lù bước ra trước, trên vai vác một cánh cửa xe tải bọc thép méo mó lỗ chỗ vết đạn.','tl'),
          say('muzzle','Bà Ba gãy nát ở khúc cống ngầm rồi. Cánh thứ tư này… tôi chưa kịp đặt tên.','br'),
        ]},
        { ...half('ronin'), stack:true, bubbles:[
          cap('Ronin chậm rãi bước theo sau. Anh bình thản tra thanh kiếm thép sắc lạnh vừa mài suốt cả chương vào lại bao kiếm. Không một lời tuyên bố đi hay ở, chỉ có hành động.','tl'),
          say('ronin','Tổ của tao xưa nay tuy nghèo rớt mồng tơi, nhưng chưa bao giờ có tiền lệ bỏ mặc khách hàng lại phía sau.','br'),
        ]},
        { ...face('yuki'), stack:true, bubbles:[
          say('ronin','Tôn chỉ của tổ tao: không tháo dỡ đồng loại. Trên kia cả nghìn người bị tháo tung. Đã đi thì cả tổ cùng đi.','tl'),
          say('yuki','Rõ, tổ trưởng.','br'),
        ]}),
      page('splash',
        { img:ART.yuki, pos:'50% 30%', zoom:1.05, bubbles:[
          cap('Dân Khu Đáy bao đời nay vẫn gọi những thứ phế liệu rớt từ trên đỉnh Tháp xuống bằng cái tên rẻ rúng: Chromefall. Những đống rác rưởi vụn vặt bị Tháp thượng tầng ruồng bỏ.','tl'),
          say('yuki','Vậy thì bảo đám người trên đỉnh ngước mắt xuống mà nhìn… Rác rưởi Chromefall này đang leo ngược trở lại tìm chúng nó đây!','br'),
        ]}),
      page('splash',                                                       // title card kết chương (ảnh riêng: comic/07e_o4_p1.jpg, tuỳ chọn)
        { img:BG.lift, pos:'50% 15%', zoom:1.3, tint:'chrome', bubbles:[
          cap('HẾT CHƯƠNG 1','c'),
          cap('CHƯƠNG 2: THÁP — ĐANG PHÁT TRIỂN','b'),
        ]}),
    ]},
};
