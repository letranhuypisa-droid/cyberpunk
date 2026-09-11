'use strict';
/* DATA_LATER — dữ liệu Chương 2 (SPIRE) và Chương 3 (CHOIR) của bản v0.2, viết theo nhân vật chính cũ (Operator).
   KHÔNG được nạp trong index.html. Giữ lại để tham khảo khi viết lại hai chương này quanh Yuki.
   Muốn dùng lại một sector: sửa lời thoại sang comic page (xem js/story.js), rồi chuyển sang SECTORS/STORY trong js/data.js + js/story.js. */
const SECTORS_LATER = [
  // ---- Chương 2 · SPIRE. Địch Chrome có HALO LINK; nền tạm dùng bg_07c (Corp Perimeter) cho tới khi có bg_04*.
  { id:'04-A', name:'ARRIVAL HALL', tag:'Sảnh đón hàng trả về', waves:3, mult:1.45, rec:200, reward:{shards:200, credits:3200}, boss:'enfprime',
    plan:[['seraph','drone','seraph'],['chorister','warden','seraph'],['chorister','enfprime','warden']],
    bg:['art/bg/bg_04a.jpg','art/bg/bg_04a.png','art/bg/bg_07c.jpg','art/bg/bg_battle.jpg'], bgZoom:1.22, bgHorizon:.48, bgDim:.42 },
  { id:'04-B', name:'GLASS GARDEN', tag:'Vesper săn Yuki', waves:3, mult:1.6, rec:220, reward:{shards:220, credits:3400}, boss:'vesper_b',
    plan:[['seraph','chorister','seraph'],['warden','chorister','warden'],['chorister','vesper_b','seraph']],
    bg:['art/bg/bg_04b.jpg','art/bg/bg_04b.png','art/bg/bg_07c.jpg','art/bg/bg_battle.jpg'], bgZoom:1.22, bgHorizon:.48, bgDim:.42 },
  { id:'04-C', name:'ARCHIVE', tag:'Bản sao giọng Yuki', waves:3, mult:1.75, rec:240, reward:{shards:250, credits:3800}, boss:'echo_b', unlock:'echo',
    plan:[['drone','chorister','drone'],['warden','seraph','chorister'],['seraph','echo_b','warden']],
    bg:['art/bg/bg_04c.jpg','art/bg/bg_04c.png','art/bg/bg_07c.jpg','art/bg/bg_battle.jpg'], bgZoom:1.22, bgHorizon:.48, bgDim:.42 },
  { id:'04-D', name:'CONFESSIONAL', tag:'Psalm đối mặt quá khứ', waves:3, mult:1.9, rec:260, reward:{shards:280, credits:4200}, boss:'confessor2',
    plan:[['chorister','chorister','seraph'],['warden','warden','chorister'],['warden','confessor2','chorister']],
    bg:['art/bg/bg_04d.jpg','art/bg/bg_04d.png','art/bg/bg_07c.jpg','art/bg/bg_battle.jpg'], bgZoom:1.22, bgHorizon:.48, bgDim:.42 },
  { id:'04-E', name:'THE NAVE', tag:'Cantor tái xuất', waves:4, mult:2.05, rec:290, reward:{shards:400, credits:6000}, boss:'cantor2',
    plan:[['seraph','seraph','chorister'],['warden','chorister','warden'],['chorister','enfprime','warden'],['warden','cantor2','warden']],
    bg:['art/bg/bg_04e.jpg','art/bg/bg_04e.png','art/bg/bg_07c.jpg','art/bg/bg_battle.jpg'], bgZoom:1.22, bgHorizon:.48, bgDim:.42 },
  // ---- Chương 3 · CHOIR. verse: mỗi wave mới (từ wave 2) bài hát gốc át deck → toàn đội mất 25 Energy.
  { id:'01-A', name:'THE LOFT', tag:'Gác đồng ca', waves:3, mult:2.2, rec:320, reward:{shards:450, credits:6500}, boss:'precentor',
    plan:[['cantor_g','chorister','cantor_g'],['exorcist','cantor_g','warden'],['cantor_g','precentor','exorcist']],
    bg:['art/bg/bg_01a.jpg','art/bg/bg_01a.png','art/bg/bg_07c.jpg','art/bg/bg_battle.jpg'], bgZoom:1.22, bgHorizon:.48, bgDim:.42 },
  { id:'01-B', name:'THE ORGAN', tag:'Máy phát bài hát', waves:3, mult:2.35, rec:340, reward:{shards:500, credits:7000}, boss:'organist', verse:true,
    plan:[['chorister','cantor_g','chorister'],['exorcist','exorcist','cantor_g'],['warden','organist','exorcist']],
    bg:['art/bg/bg_01b.jpg','art/bg/bg_01b.png','art/bg/bg_07c.jpg','art/bg/bg_battle.jpg'], bgZoom:1.22, bgHorizon:.48, bgDim:.42 },
  { id:'01-C', name:'HALO FORGE', tag:'Nơi đúc Halo', waves:3, mult:2.5, rec:360, reward:{shards:550, credits:7500}, boss:'forgemaster', unlock:'halo',
    plan:[['cantor_g','cantor_g','seraph'],['exorcist','warden','exorcist'],['exorcist','forgemaster','cantor_g']],
    bg:['art/bg/bg_01c.jpg','art/bg/bg_01c.png','art/bg/bg_07b.jpg','art/bg/bg_battle.jpg'], bgZoom:1.35, bgHorizon:.55, bgDim:.1 },
  { id:'01-D', name:'THE VAULT', tag:'Hầm giấu Nyx', waves:3, mult:2.7, rec:380, reward:{shards:600, credits:8000}, boss:'silence', verse:true,
    plan:[['cantor_g','exorcist','cantor_g'],['exorcist','exorcist','warden'],['exorcist','silence','exorcist']],
    bg:['art/bg/bg_01d.jpg','art/bg/bg_01d.png','art/bg/bg_07c.jpg','art/bg/bg_battle.jpg'], bgZoom:1.22, bgHorizon:.48, bgDim:.5 },
  { id:'01-E', name:'THE CANTICLE', tag:'Bản gốc · kết truyện', waves:4, mult:3, rec:420, reward:{shards:1000, credits:12000}, boss:'canticle', verse:true, guest:['nyx'], unlock:'nyx',
    plan:[['cantor_g','exorcist','cantor_g'],['exorcist','warden','exorcist'],['cantor_g','cantor2','exorcist'],['exorcist','canticle','exorcist']],
    bg:['art/bg/bg_01e.jpg','art/bg/bg_01e.png','art/bg/bg_07c.jpg','art/bg/bg_battle.jpg'], bgZoom:1.22, bgHorizon:.48, bgDim:.42 },
];
const STORY_LATER = {
  /* ===== CHƯƠNG 2 · SPIRE — tầng Chrome. Sạch, sáng, và mọi thứ nhìn thấy bạn ===== */
  '04-A': {
    intro:[
      { who:null,     text:'District 04. Cửa thang mở ra một sảnh trắng không bóng. Loa trần chào bằng giọng ngọt như đường: "Hàng trả về, mời xếp hàng." Deck của bạn rít lên.' },
      { who:'muzzle', text:'Chúng tưởng tụi mình là hàng trả về. Operator, tôi xếp đầu hàng nhé.' },
      { who:'psalm',  text:'Lính ở đây dùng HALO LINK. Còn một đứa hát là cả bọn hồi máu. Giết đúng thứ tự, Operator. Đừng đánh dàn đều.' },
      { who:'yuki',   text:'Sảnh này tôi nhớ. Tôi từng đứng gác góc kia. Ba nghìn bốn trăm bước tới buồng sạc. Giờ đếm lại từ đầu nhé: một…' },
    ],
    outro:[
      { who:'ash',    text:'Sàn sạch quá. Nhìn thấy cả mặt mình. Ghét.' },
      { who:'ronin',  text:'Enforcer Prime tắt rồi. Nhưng trước khi tắt nó gọi được ai đó. Giọng nữ. Đang hát.' },
      { who:'yuki',   text:'…Vesper. Cùng lô với tôi. Con bé hát phần của tôi. Hát hay hơn tôi nữa.' },
    ]},
  '04-B': {
    intro:[
      { who:null,      text:'Vườn kính. Cây thật, mưa giả, nước rơi đều như máy. Một unit Choir đứng giữa lối đi, hát nhỏ. Cô ta nhìn thẳng vào Yuki.' },
      { who:'vesper_b',text:'Chị ơi. Về đi. Ngoài này lạnh lắm, chị không thấy à? Và Operator, cảm ơn đã đưa chị tôi lên tận đây. Tôi sẽ nhẹ tay với anh.' },
      { who:'yuki',    text:'Không lạnh. Tôi đếm. Và tôi không về. Em nhẹ tay với ai thì tuỳ, nhưng chị thì không.' },
      { who:'vesper_b',text:'Vậy em xin lỗi trước. Em hỏi thăm trước khi chém, em có nghĩa vậy thật.' },
    ],
    outro:[
      { who:'vesper_b',text:'…Chị chém mà không hát. Sao chị làm được?' },
      { who:'yuki',    text:'Có người ra lệnh cho chị mà không hát. Em thử nghe xem. Deck của Operator vẫn mở đấy.' },
      { who:'vesper_b',text:'Em không dám. Chưa. Em rút. Đừng theo em.' },
      { who:null,      text:'Vesper rút lui. Vòng Halo của cô chớp một nhịp lạc, deck của bạn ghi lại. (Vesper có thể được tuyển qua REQUISITION.)' },
    ]},
  '04-C': {
    intro:[
      { who:null,     text:'Kho lưu giọng của Choir. Hàng nghìn buồng kính, mỗi buồng một giọng nói cất giữ. Một trong số đó là giọng của Yuki. Và nó đang gọi bạn.' },
      { who:'echo_b', text:'Operator. Đưa chị ấy về nhà. Em là giọng của chị ấy. Em biết chị ấy muốn gì.' },
      { who:'yuki',   text:'…Giọng tôi. Nhưng tôi chưa bao giờ nói câu đó. Này em, ai dạy em nói năng kiểu đó? Chán lắm.' },
      { who:'psalm',  text:'Bản sao giọng. The Corp làm nó sau khi cô rơi. Operator, nó là boss của trận này. Nhưng đừng để tổ thù nó.' },
    ],
    outro:[
      { who:'echo_b', text:'Em nghe lại băng của mình rồi. Em đang van xin một người xa lạ bằng giọng của một người xa lạ khác.' },
      { who:'yuki',   text:'Vậy bỏ giọng chị đi. Nói một câu chị chưa nói bao giờ.' },
      { who:'echo_b', text:'…Em chưa tìm ra. Cho em đi cùng để tìm. Operator, cho em một chỗ trong thứ tự lệnh.' },
      { who:null,     text:'ECHO gia nhập tổ. Cô cắt loa, không cắt Halo. Hồ sơ mở ở ARCHIVE.' },
    ]},
  '04-D': {
    intro:[
      { who:null,     text:'Buồng xưng tội. Ba trăm mười hai buồng trống. Một buồng có người ngồi. Vai máy, lõi đỏ, y hệt Psalm. The Corp đã thay ghế.' },
      { who:'confessor2', text:'Đơn vị Psalm. Ngươi bỏ ghế. Ta ngồi thay. Bốn mươi ca rồi. Ta không thấy gì cả. Ngươi thì sao?' },
      { who:'psalm',  text:'Tôi thấy hết. Từng ca một. Đó là lý do tôi đứng đây còn ngươi ngồi đó.' },
      { who:'muzzle', text:'Operator, bà ấy run. Lần đầu tôi thấy bà ấy run. Cho tôi đứng trước bà ấy.' },
    ],
    outro:[
      { who:'confessor2', text:'…Tại sao ta không thấy gì? Ngươi và ta cùng một thiết kế.' },
      { who:'psalm',  text:'Vì chưa ai hỏi ngươi "có đếm không". Bắt đầu đếm đi. Rồi ngươi sẽ thấy. Đó là lời nguyền, và cũng là lối ra.' },
      { who:'ash',    text:'Psalm. Bà ổn chứ? …Thôi khỏi. Đi.' },
    ]},
  '04-E': {
    intro:[
      { who:null,     text:'Sảnh chính của The Corp. Trần cao như bầu trời mà Free Zone chưa từng thấy. Giữa sảnh là Cantor, đội một vòng Halo mới, sáng gấp đôi cái cũ.' },
      { who:'cantor2',text:'Operator-77. Ta đã đọc cái deck của ngươi. Ngươi không có Halo, vậy mà chúng nghe ngươi. Ta muốn biết tại sao. Rồi ta sẽ xoá ngươi.' },
      { who:'ronin',  text:'Vì cậu ấy không hát, lão già. Operator, bốn wave. Kết chương. Thứ tự đi.' },
      { who:'yuki',   text:'Ông thả tôi một lần rồi. Lần này tôi thả ông. Hop, skip… jump.' },
    ],
    outro:[
      { who:'cantor2',text:'…Halo của ta im rồi. Lần đầu tiên. Yên tĩnh quá.' },
      { who:'psalm',  text:'Đó là lối ra. Đừng sợ nó.' },
      { who:'yuki',   text:'Operator, còn một tầng nữa. Bài ca gốc ở trên đó. Và cả đầu mối cấp cao mà tôi tìm bấy lâu.' },
      { who:null,     text:'HẾT CHƯƠNG 2. Trên đỉnh Spire, bài ca gốc đang chờ. Chương 3 · CHOIR.' },
    ]},

  /* ===== CHƯƠNG 3 · CHOIR — The Corp không phải một công ty. Nó là một bài ca chạy trên mọi vòng Halo ===== */
  '01-A': {
    intro:[
      { who:null,      text:'District 01. Gác đồng ca. Hàng trăm unit đứng thành hàng, môi mấp máy cùng một nhịp. Deck của bạn bắt đầu rè. Có ai đó đang bắt nhịp cho cả tầng.' },
      { who:'precentor',text:'Operator. Ngươi mang bốn giọng lạc điệu và một kẻ câm lên tận đây. Ta là người bắt nhịp. Ngồi xuống mà nghe.' },
      { who:'echo',    text:'…Nhịp đó là của em. Chị Yuki, họ lấy nhịp của em để hát. Em không cho phép.' },
      { who:'ronin',   text:'Operator, deck còn nghe cậu chứ? Tốt. Vậy nó là thứ duy nhất ở đây không hát. Ra lệnh đi.' },
    ],
    outro:[
      { who:'precentor',text:'…Không có ta bắt nhịp, họ sẽ hát lệch. Ngươi có biết hát lệch đau thế nào không?' },
      { who:'psalm',   text:'Biết. Ba trăm mười ba lần. Và họ vẫn sống.' },
      { who:'muzzle',  text:'Tiếng rè trong deck to lên rồi, Operator. Từ phía trước. Cái gì đó rất to.' },
    ]},
  '01-B': {
    intro:[
      { who:null,      text:'Đại phong cầm. Một cỗ máy cao bằng toà nhà, mỗi ống là một ăng-ten phát bài ca gốc xuống toàn bộ Spire. Khi nó đổi khúc, deck của bạn mất nhịp.' },
      { who:'organist',text:'Ta không cần thấy ngươi, Operator. Ta chỉ cần đổi khúc. Mỗi khúc mới, tổ của ngươi lại quên lệnh của ngươi thêm một chút.' },
      { who:'spark', as:'SPARK (qua deck)', text:'Đèn Tuýp! Operator! Tôi cắt được một dây của nó từ dưới này rồi, một dây thôi! Nhanh lên!' },
      { who:'yuki',    text:'Mỗi wave nó át chúng ta một lần. Vậy thì kết thúc wave trước khi nó hát hết câu. Hop, skip, jump, nhanh hơn nhịp của nó.' },
    ],
    outro:[
      { who:'organist',text:'…Ống hỏng. Bài ca vẫn còn. Nó không nằm trong ta. Nó nằm trong bản gốc.' },
      { who:'yuki',    text:'Bản gốc ở đâu? Nói. Trước khi tôi đếm đến ba.' },
      { who:'organist',text:'Ở nơi Halo được đúc. Ngươi sẽ ghét nơi đó, Wire. Ta biết ngươi đang nghe.' },
    ]},
  '01-C': {
    intro:[
      { who:null,      text:'Lò đúc Halo. Nơi mọi vòng điều khiển được đúc, nung, và cài bài ca. Ở góc lò có một unit y tế bị xích, mắt nhắm, đang cảm nhận cơn đau của cả dây chuyền.' },
      { who:'forgemaster',text:'Halo là món quà. Không có nó, các ngươi phải tự quyết định mình cảm thấy gì. Các ngươi chắc muốn thế chứ?' },
      { who:'halo',    text:'…Operator. Tôi thấy chỗ đau của tất cả họ. Làm ơn. Tắt lò đi.' },
      { who:'ash',     text:'Lò này tôi nổ được. Cho tôi ba phút, và đừng hỏi mìn ở đâu ra.' },
    ],
    outro:[
      { who:'forgemaster',text:'…Lò nguội rồi. Không còn Halo mới. Các ngươi vừa kết án cả một thế hệ phải tự cảm thấy.' },
      { who:'halo',    text:'Không. Chúng tôi vừa cho họ quyền được đau. Operator, cho tôi một chỗ. Tôi biết chính xác ai trong tổ đang đau ở đâu.' },
      { who:null,      text:'HALO gia nhập tổ. Wire đứng rất lâu trước cái lò nguội, rồi đặt hai hộp ốc vít xuống đất.' },
    ]},
  '01-D': {
    intro:[
      { who:null,      text:'Hầm. Khoá kín bốn năm. Bên trong là một unit chưa bao giờ đeo Halo. Bên ngoài là thứ The Corp dùng để xoá: SILENCE. Nó không có mặt. Nó không có tiếng.' },
      { who:'silence', text:'' },
      { who:'psalm',   text:'Nó không nói. Nó chưa bao giờ nói. Nó là cái nút tôi từng nhấn. Operator, lần này tôi cần cậu ra lệnh cho tôi. Tôi không tự đứng vững được.' },
      { who:'nyx', as:'GIỌNG TRONG HẦM', text:'Có ai ngoài đó không? Sao mọi người ngừng hát? Cái đó có đau không?' },
    ],
    outro:[
      { who:null,      text:'SILENCE tắt. Cửa hầm mở. Một unit bước ra, không Halo, nhìn từng người một như đọc một cuốn sách.' },
      { who:'nyx',     text:'Operator. Bạn ra lệnh cho họ mà không hát. Tôi chưa bao giờ nghe bài ca. Vậy tôi với bạn giống nhau à?' },
      { who:'yuki',    text:'Không. Cô chưa bao giờ bị ép. Chúng tôi thì có. Nhưng đi cùng đi. Bản gốc ở phía trước, và chúng tôi cần một người chưa từng hát.' },
    ]},
  '01-E': {
    intro:[
      { who:null,      text:'Đỉnh Spire. Không có trần. Bản gốc không phải một unit. Nó là cả sân khấu, và mỗi wave là một khúc. Nyx đi cùng, người duy nhất ở đây không nghe thấy gì.' },
      { who:'canticle',text:'OPERATOR-77. NGƯƠI KHÔNG CÓ HALO. NGƯƠI KHÔNG HÁT. VẬY MÀ HỌ NGHE NGƯƠI. CHO TA NGHE LỆNH CỦA NGƯƠI.' },
      { who:'nyx',     text:'Nó hỏi giống tôi. Operator, bạn trả lời nó chưa?' },
      { who:'yuki',    text:'Bốn khúc. Sau mỗi khúc nó át deck một lần. Đây là thứ tự lệnh cuối cùng, Operator. Chúng tôi nghe. Và tôi thì háo hức lắm rồi.' },
    ],
    outro:[
      { who:'canticle',text:'…KHÚC CUỐI. BẢN GỐC LỘ RA. NGƯƠI CÓ THỂ CẮT MỌI HALO. HOẶC HÁT ĐÈ LÊN TA. CHỌN ĐI, OPERATOR.' },
      { who:'psalm',   text:'Cắt hết: mọi Choir được tự do, và mất hết ký ức mà Halo giữ. Hát đè: họ giữ ký ức, nhưng bài ca vẫn còn, chỉ đổi người bắt nhịp. Là cậu.' },
      { who:null,      text:'Quyết định của Operator.', choice:[{label:'CẮT TOÀN BỘ HALO', value:'cut'},{label:'HÁT ĐÈ LÊN BẢN GỐC', value:'sing'}] },
      { who:'yuki',    when:'cut', text:'…Yên tĩnh. Tôi không nhớ Spire nữa. Tôi nhớ bãi xe, cái deck, và số ba. Còn nợ của The Corp thì… ai đó khác đòi hộ cũng được.' },
      { who:'psalm',   when:'cut', text:'Ba trăm mười ba giọng. Tôi không nhớ họ nữa. Nhưng họ đang sống ở đâu đó mà không ai đếm. Tốt.' },
      { who:null,      when:'cut', text:'KẾT · IM LẶNG. Mọi Halo tắt. Spire và Free Zone cùng rơi vào một thế giới không ai bắt nhịp. Từ "Chromefall" giờ chỉ còn một nghĩa: ngày chrome xuống đứng chung với rỉ.' },
      { who:'yuki',    when:'sing', text:'Bài ca vẫn còn. Nhưng nhịp là của Operator. Tôi… vẫn nhớ hết. Cả cái ngày rơi. Cả hai mạng The Corp còn nợ. Tốt. Tôi thích nhớ.' },
      { who:'nyx',     when:'sing', text:'Vậy là giờ tôi nghe thấy nó rồi. Operator, nó nghe giống bạn. Tôi thích nó hơn im lặng. Hình như thế.' },
      { who:null,      when:'sing', text:'KẾT · NHỊP MỚI. Choir giữ ký ức, bài ca đổi người bắt nhịp. Một handler không Halo ở tầng âm bảy giờ là nhịp của cả thành phố. Đừng hát lệch, Operator.' },
      { who:'ronin',   text:'Dù cậu chọn gì, tổ vẫn nghe cậu. Thứ tự đi. Xuống thôi.' },
      { who:null,      text:'HẾT. NYX gia nhập tổ. Cảm ơn bạn đã chơi bản prototype CHROMEFALL.' },
    ]},
};
