'use strict';
/* DATA — nội dung game: roster, kẻ địch, chiến dịch, cốt truyện, lore, bonds, hồ sơ người chơi, gacha.
   Sửa số liệu ở đây. ★ FAKE = bản nháp. */
/* =====================================================================
   DỮ LIỆU  ★ FAKE = dữ liệu giả, thay bằng dữ liệu thật từ server
   ===================================================================== */
const ROSTER = {
  // ---- Có spec thật ----
  kira:  { id:'kira',  name:'KIRA',  faction:'chrome', tier:'S', atk:145, hp:950,  energyMax:100,
           ult:{ name:'ZERO', cost:100, kind:'nuke', mult:3.2, refundOnKill:50,
                 desc:'320% ATK lên một mục tiêu. Nếu giết được, hoàn 50 Energy.' },
           // Frame đã tách nền từ KIRA/Kira idle.png + Kira attack.png (cùng tỉ lệ 0.72, sàn ở y=678).
           // box = kích thước canvas + ax = toạ độ x của điểm giữa hai bàn chân. idle đúng 744×682;
           // attack canvas rộng hơn để không cắt kiếm/vệt chém, HTML tự căn theo ax.
           sprites:{ idle:['kira_idle.png','KIRA/Kira PNG.png'], attack:['kira_attack.png'], hurt:['kira_hurt.png'],
                     box:{ idle:{w:744,h:682,ax:372}, attack:{w:1173,h:682,ax:466}, hurt:{w:924,h:682,ax:641} } },
           portrait:['kira_portrait.png','KIRA/Kira PNG.png'], pos:'50% 5%',
           ultVideo:['kira_ult.mp4','KIRA/Kira Ultimate.mp4'] },   // cut-in 5s khi phát chiêu cuối (H.264 1280×720)
  psalm: { id:'psalm', name:'PSALM', faction:'chrome', tier:'S', atk:110, hp:1100, energyMax:125,
           ult:{ name:'APOSTASY', cost:125, kind:'control',
                 desc:'Chiếm quyền điều khiển một kẻ địch trong một lượt: lượt tới nó tấn công đồng bọn.' },
           // Frame tách từ PSALM/PSALM idle.png + attack.png (nền xanh lá), tỉ lệ 0.715, sàn y=678, ax = điểm giữa hai bàn chân
           sprites:{ idle:['psalm_idle.png'], attack:['psalm_attack.png'], hurt:['psalm_hurt.png'],
                     box:{ idle:{w:744,h:682,ax:372}, attack:{w:1203,h:682,ax:534}, hurt:{w:811,h:682,ax:382} } },
           ultVideo:['psalm_ult.mp4','PSALM/PSALM ultimate.mp4'],
           portrait:['psalm_portrait.png','PSALM.png'], pos:'50% 12%' },
  ronin: { id:'ronin', name:'RONIN', faction:'rust', tier:'A', atk:130, hp:1050, energyMax:100,   // ★ FAKE: cost + chiêu cuối
           ult:{ name:'IAIDO', cost:100, kind:'nuke', mult:2.8, desc:'280% ATK lên một mục tiêu. (★ FAKE)' },
           sprites:{ idle:['ronin_idle.png'], attack:['ronin_attack.png'] }, portrait:['ronin_portrait.png','RONIN.png'], pos:'50% 8%' },
  ash:   { id:'ash',   name:'ASH',   faction:'rust', tier:'A', atk:120, hp:1000, energyMax:75,    // ★ FAKE: cost + chiêu cuối
           ult:{ name:'FLASHOVER', cost:75, kind:'aoe', mult:1.5, desc:'150% ATK lên toàn bộ kẻ địch. (★ FAKE)' },
           sprites:{ idle:['ash_idle.png'], attack:['ash_attack.png'] }, portrait:['ash_portrait.png','ASH.png'], pos:'50% 8%' },
  muzzle:{ id:'muzzle',name:'MUZZLE',faction:'rust', tier:'B', atk:70,  hp:1750, energyMax:125,   // ★ FAKE: cost + chiêu cuối
           ult:{ name:'FIELD PATCH', cost:125, kind:'heal', mult:1.2, desc:'Hồi 120% ATK cho toàn đội. (★ FAKE)' },
           sprites:{ idle:['muzzle_idle.png'], attack:['muzzle_attack.png'] }, portrait:['muzzle_portrait.png','MUZZLE.png'], pos:'50% 8%' },
  // ---- ★ FAKE toàn bộ: chưa có spec, chỉ để đủ roster 9 ----
  echo:  { id:'echo',  name:'ECHO',  faction:'chrome', tier:'A', atk:105, hp:1000, energyMax:100, ult:{name:'RESONANCE',cost:100,kind:'nuke',mult:2.5,desc:'★ FAKE'}, sprites:{idle:['echo_idle.png'],attack:['echo_attack.png']}, portrait:['echo_portrait.png','ECHO.png'], pos:'50% 8%' },
  wire:  { id:'wire',  name:'WIRE',  faction:'chrome', tier:'B', atk:80,  hp:1500, energyMax:75,  ult:{name:'OVERCLOCK',cost:75,kind:'nuke',mult:2.2,desc:'★ FAKE'}, sprites:{idle:['wire_idle.png'],attack:['wire_attack.png']}, portrait:['wire_portrait.png','WIRE.png'], pos:'50% 8%' },
  stitch:{ id:'stitch',name:'STITCH',faction:'rust',   tier:'S', atk:140, hp:900,  energyMax:100, ult:{name:'SUTURE',cost:100,kind:'heal',mult:1.5,desc:'★ FAKE'}, sprites:{idle:['stitch_idle.png'],attack:['stitch_attack.png']}, portrait:['stitch_portrait.png','STITCH.png'], pos:'50% 8%' },
  kai:   { id:'kai',   name:'KAI',   faction:'rust',   tier:'B', atk:95,  hp:1200, energyMax:100, ult:{name:'RIPCORD',cost:100,kind:'nuke',mult:2.4,desc:'★ FAKE'}, sprites:{idle:['kai_idle.png'],attack:['kai_attack.png']}, portrait:['kai_portrait.png','Kai.png'], pos:'50% 8%' },
};
/* ---- ★ FAKE: 10 nhân vật thêm cho đủ roster 19, chưa có art → silhouette; cost/chiêu cuối tạm ---- */
const mkChar = (id,name,faction,tier,atk,hp,energyMax,ult) => ({ id,name,faction,tier,atk,hp,energyMax,ult,
  sprites:{ idle:[id+'_idle.png'], attack:[id+'_attack.png'], hurt:[id+'_hurt.png'] }, portrait:[id+'_portrait.png'], pos:'50% 8%' });
[ mkChar('vesper','VESPER','chrome','S',150,900,100,  {name:'EVENSONG',cost:100,kind:'aoe',mult:1.8,desc:'180% ATK lên toàn bộ kẻ địch. (★ FAKE)'}),
  mkChar('nyx','NYX','chrome','S',140,1000,125,       {name:'BLACKOUT',cost:125,kind:'nuke',mult:3.4,desc:'340% ATK lên một mục tiêu. (★ FAKE)'}),
  mkChar('halo','HALO','chrome','A',115,1150,100,     {name:'SANCTUM',cost:100,kind:'heal',mult:1.4,desc:'Hồi 140% ATK cho toàn đội. (★ FAKE)'}),
  mkChar('cipher','CIPHER','chrome','A',125,950,75,   {name:'BACKDOOR',cost:75,kind:'control',desc:'Chiếm quyền điều khiển một kẻ địch một lượt. (★ FAKE)'}),
  mkChar('meridian','MERIDIAN','chrome','B',85,1450,125,{name:'BULWARK PROTOCOL',cost:125,kind:'heal',mult:1.0,desc:'Hồi 100% ATK cho toàn đội. (★ FAKE)'}),
  mkChar('toll','TOLL','rust','S',155,850,125,        {name:'DEBT COLLECTOR',cost:125,kind:'nuke',mult:3.6,desc:'360% ATK lên một mục tiêu. (★ FAKE)'}),
  mkChar('spark','SPARK','rust','A',125,950,75,       {name:'ARC FLASH',cost:75,kind:'aoe',mult:1.4,desc:'140% ATK lên toàn bộ kẻ địch. (★ FAKE)'}),
  mkChar('vixen','VIXEN','rust','A',135,900,100,      {name:'HEIST',cost:100,kind:'control',desc:'Chiếm quyền điều khiển một kẻ địch một lượt. (★ FAKE)'}),
  mkChar('junker','JUNKER','rust','B',75,1700,100,    {name:'SCRAP CANNON',cost:100,kind:'nuke',mult:2.6,desc:'260% ATK lên một mục tiêu. (★ FAKE)'}),
  mkChar('gravedigger','GRAVEDIGGER','rust','B',90,1500,125,{name:'LAST RITES',cost:125,kind:'nuke',mult:3.0,desc:'300% ATK lên một mục tiêu. (★ FAKE)'}),
].forEach(c=>ROSTER[c.id]=c);

let TEAM = ['ronin','ash','muzzle','kai','junker'];              // tổ salvage xuất phát (toàn Rust). Kira = thưởng tutorial 07-A, Psalm = thưởng 07-C

/* ---- ★ FAKE: bể kẻ địch PvE (20). rank: grunt / elite / boss quyết định wave nào gọi và độ to trên sân ---- */
const ENEMY_POOL = [
  { id:'scav',       name:'SCAV-07',        faction:'rust',   rank:'grunt', atk:62,  hp:640  },
  { id:'rigger',     name:'RIGGER',         faction:'rust',   rank:'grunt', atk:78,  hp:820  },
  { id:'straydog',   name:'STRAY DOG',      faction:'rust',   rank:'grunt', atk:70,  hp:560  },
  { id:'welder',     name:'WELDER',         faction:'rust',   rank:'grunt', atk:66,  hp:780  },
  { id:'gutterrat',  name:'GUTTER RAT',     faction:'rust',   rank:'grunt', atk:58,  hp:520  },
  { id:'chopshop',   name:'CHOP SHOP',      faction:'rust',   rank:'grunt', atk:74,  hp:700  },
  { id:'tinman',     name:'TIN MAN',        faction:'rust',   rank:'grunt', atk:60,  hp:900  },
  { id:'slagger',    name:'SLAGGER',        faction:'rust',   rank:'grunt', atk:80,  hp:760  },
  { id:'pipefitter', name:'PIPE FITTER',    faction:'rust',   rank:'grunt', atk:64,  hp:840  },
  { id:'hollow',     name:'HOLLOW',         faction:'rust',   rank:'grunt', atk:68,  hp:660  },
  { id:'glassjaw',   name:'GLASS JAW',      faction:'rust',   rank:'grunt', atk:88,  hp:480  },
  { id:'drone',      name:'CORP DRONE MK1', faction:'chrome', rank:'grunt', atk:72,  hp:600  },
  { id:'bulwark',    name:'BULWARK',        faction:'rust',   rank:'elite', atk:48,  hp:1400 },
  { id:'kiln',       name:'KILN',           faction:'rust',   rank:'elite', atk:95,  hp:1250 },
  { id:'drillbit',   name:'DRILL-BIT',      faction:'rust',   rank:'elite', atk:105, hp:1100 },
  { id:'enforcer',   name:'ENFORCER',       faction:'chrome', rank:'elite', atk:100, hp:1300 },
  { id:'chromehound',name:'CHROME HOUND',   faction:'chrome', rank:'elite', atk:110, hp:1150 },
  { id:'foreman',    name:'THE FOREMAN',    faction:'rust',   rank:'boss',  atk:125, hp:2600 },
  { id:'motherrust', name:'MOTHER RUST',    faction:'rust',   rank:'boss',  atk:140, hp:3000 },
  { id:'archon',     name:'ARCHON',         faction:'chrome', rank:'boss',  atk:150, hp:2800 },
  { id:'cantor',     name:'CANTOR',         faction:'chrome', rank:'boss',  atk:160, hp:3400 },   // boss cuối chương 1
  // ---- Chương 2 · SPIRE. link: HALO LINK — đầu lượt hồi 8% HP nếu còn một unit link khác sống → phải giết đúng thứ tự
  { id:'seraph',     name:'SERAPH DRONE',   faction:'chrome', rank:'grunt', atk:90,  hp:700,  link:true },
  { id:'chorister',  name:'CHORISTER',      faction:'chrome', rank:'grunt', atk:95,  hp:760,  link:true },
  { id:'warden',     name:'WARDEN',         faction:'chrome', rank:'elite', atk:125, hp:1500, link:true },
  { id:'enfprime',   name:'ENFORCER PRIME', faction:'chrome', rank:'boss',  atk:170, hp:3600 },
  { id:'vesper_b',   name:'VESPER',         faction:'chrome', rank:'boss',  atk:165, hp:3200, lore:'vesper' },   // Vesper với tư cách boss
  { id:'echo_b',     name:'ECHO',           faction:'chrome', rank:'boss',  atk:150, hp:2900, lore:'echo' },
  { id:'confessor2', name:'CONFESSOR MK-II',faction:'chrome', rank:'boss',  atk:175, hp:3800 },
  { id:'cantor2',    name:'CANTOR ASCENDANT',faction:'chrome', rank:'boss', atk:200, hp:4600 },
  // ---- Chương 3 · CHOIR (The Canticle)
  { id:'cantor_g',   name:'CANTOR GUARD',   faction:'chrome', rank:'grunt', atk:110, hp:900,  link:true },
  { id:'exorcist',   name:'EXORCIST',       faction:'chrome', rank:'elite', atk:140, hp:1800, link:true },
  { id:'precentor',  name:'PRECENTOR',      faction:'chrome', rank:'boss',  atk:210, hp:5000 },
  { id:'organist',   name:'ORGANIST',       faction:'chrome', rank:'boss',  atk:220, hp:5200, link:true },
  { id:'forgemaster',name:'FORGEMASTER',    faction:'chrome', rank:'boss',  atk:230, hp:5400 },
  { id:'silence',    name:'SILENCE',        faction:'chrome', rank:'boss',  atk:240, hp:5600 },
  { id:'canticle',   name:'THE CANTICLE',   faction:'chrome', rank:'boss',  atk:300, hp:8000, link:true },
];
/* =====================================================================
   CHIẾN DỊCH PVE — xem docs/story.md (thế giới, nhân vật, thiết kế màn)
   Mỗi sector: plan = danh sách wave thiết kế tay (id trong ENEMY_POOL), mult = hệ số nhân
   ATK/HP kẻ địch theo độ khó, reward = thưởng lần đầu clear. bg: ảnh nền + zoom/dim đo tay.
   Tiến trình (sector đã clear) lưu trong PLAYER.cleared. ★ số liệu là bản nháp cân bằng.
   ===================================================================== */
const CHAPTERS = [
  { n:1, title:'CHROMEFALL', sub:'DISTRICT 07 · THE SUMP', sectors:['07-A','07-B','07-C','07-D','07-E'] },
  { n:2, title:'SPIRE',      sub:'DISTRICT 04 · CHROME TIER', sectors:['04-A','04-B','04-C','04-D','04-E'] },
  { n:3, title:'CHOIR',      sub:'THE CANTICLE · DISTRICT 01', sectors:['01-A','01-B','01-C','01-D','01-E'] },
];
const SECTORS = [
  // bgZoom: ảnh neo đáy sân, phóng theo chiều cao (1.3 = cao bằng 130% sân) để đường chân trời
  // trong ảnh (bgHorizon = % từ mép trên ảnh) lên trên chân của hàng sau (~43% sân). Ảnh 3:4, 1536×2048.
  // guest: nhân vật đi cùng trong trận dù chưa sở hữu (thế slot 5) · unlock: gia nhập vĩnh viễn khi clear lần đầu
  { id:'07-A', name:'SCRAPYARD GATE', tag:'Tutorial · Kira rơi', waves:2, mult:.85, rec:80,  reward:{shards:60, credits:800}, guest:['kira'], unlock:'kira',
    plan:[['scav','gutterrat','straydog'],['welder','scav','rigger']],
    bg:['bg_07a.jpg','bg_07a.png','bg_battle.jpg','bg_battle.png'], bgZoom:1.33, bgHorizon:.54, bgDim:.12 },
  { id:'07-B', name:'FOUNDRY ROW', tag:'Lò của Foreman', waves:3, mult:1, rec:110, reward:{shards:90, credits:1200}, boss:'foreman',
    plan:[['rigger','slagger','pipefitter'],['tinman','kiln','welder'],['chopshop','foreman','hollow']],
    bg:['bg_07b.jpg','bg_07b.png','bg_battle.jpg','bg_battle.png'], bgZoom:1.35, bgHorizon:.55, bgDim:.1 },
  { id:'07-C', name:'CORP PERIMETER', tag:'Vành đai tập đoàn', waves:3, mult:1.15, rec:140, reward:{shards:120, credits:1600}, boss:'archon', unlock:'psalm',
    plan:[['drone','glassjaw','drone'],['enforcer','drone','chromehound'],['drone','archon','enforcer']],
    bg:['bg_07c.jpg','bg_07c.png','bg_battle.jpg','bg_battle.png'], bgZoom:1.22, bgHorizon:.48, bgDim:.42 },
  { id:'07-D', name:'DRAINAGE CATHEDRAL', tag:'Giáo phái Mother Rust', waves:3, mult:1.3, rec:170, reward:{shards:150, credits:2000}, boss:'motherrust',
    plan:[['hollow','gutterrat','hollow'],['drillbit','hollow','kiln'],['slagger','motherrust','drillbit']],
    bg:['bg_07d.jpg','bg_07d.png','bg_battle.jpg','bg_battle.png'], bgZoom:1.3, bgHorizon:.5, bgDim:.15 },
  { id:'07-E', name:'THE LIFT', tag:'Cantor chặn thang', waves:4, mult:1.5, rec:200, reward:{shards:240, credits:3000}, boss:'cantor',
    plan:[['chromehound','drone','chromehound'],['enforcer','enforcer','drone'],['chromehound','archon','enforcer'],['enforcer','cantor','chromehound']],
    bg:['bg_07e.jpg','bg_07e.png','bg_battle.jpg','bg_battle.png'], bgZoom:1.3, bgHorizon:.5, bgDim:.2 },
  // ---- Chương 2 · SPIRE. Địch Chrome có HALO LINK; nền tạm dùng bg_07c (Corp Perimeter) cho tới khi có bg_04*.
  { id:'04-A', name:'ARRIVAL HALL', tag:'Sảnh đón hàng trả về', waves:3, mult:1.45, rec:200, reward:{shards:200, credits:3200}, boss:'enfprime',
    plan:[['seraph','drone','seraph'],['chorister','warden','seraph'],['chorister','enfprime','warden']],
    bg:['bg_04a.jpg','bg_04a.png','bg_07c.jpg','bg_battle.jpg'], bgZoom:1.22, bgHorizon:.48, bgDim:.42 },
  { id:'04-B', name:'GLASS GARDEN', tag:'Vesper săn Kira', waves:3, mult:1.6, rec:220, reward:{shards:220, credits:3400}, boss:'vesper_b',
    plan:[['seraph','chorister','seraph'],['warden','chorister','warden'],['chorister','vesper_b','seraph']],
    bg:['bg_04b.jpg','bg_04b.png','bg_07c.jpg','bg_battle.jpg'], bgZoom:1.22, bgHorizon:.48, bgDim:.42 },
  { id:'04-C', name:'ARCHIVE', tag:'Bản sao giọng Kira', waves:3, mult:1.75, rec:240, reward:{shards:250, credits:3800}, boss:'echo_b', unlock:'echo',
    plan:[['drone','chorister','drone'],['warden','seraph','chorister'],['seraph','echo_b','warden']],
    bg:['bg_04c.jpg','bg_04c.png','bg_07c.jpg','bg_battle.jpg'], bgZoom:1.22, bgHorizon:.48, bgDim:.42 },
  { id:'04-D', name:'CONFESSIONAL', tag:'Psalm đối mặt quá khứ', waves:3, mult:1.9, rec:260, reward:{shards:280, credits:4200}, boss:'confessor2',
    plan:[['chorister','chorister','seraph'],['warden','warden','chorister'],['warden','confessor2','chorister']],
    bg:['bg_04d.jpg','bg_04d.png','bg_07c.jpg','bg_battle.jpg'], bgZoom:1.22, bgHorizon:.48, bgDim:.42 },
  { id:'04-E', name:'THE NAVE', tag:'Cantor tái xuất', waves:4, mult:2.05, rec:290, reward:{shards:400, credits:6000}, boss:'cantor2',
    plan:[['seraph','seraph','chorister'],['warden','chorister','warden'],['chorister','enfprime','warden'],['warden','cantor2','warden']],
    bg:['bg_04e.jpg','bg_04e.png','bg_07c.jpg','bg_battle.jpg'], bgZoom:1.22, bgHorizon:.48, bgDim:.42 },
  // ---- Chương 3 · CHOIR. verse: mỗi wave mới (từ wave 2) bài hát gốc át deck → toàn đội mất 25 Energy.
  { id:'01-A', name:'THE LOFT', tag:'Gác đồng ca', waves:3, mult:2.2, rec:320, reward:{shards:450, credits:6500}, boss:'precentor',
    plan:[['cantor_g','chorister','cantor_g'],['exorcist','cantor_g','warden'],['cantor_g','precentor','exorcist']],
    bg:['bg_01a.jpg','bg_01a.png','bg_07c.jpg','bg_battle.jpg'], bgZoom:1.22, bgHorizon:.48, bgDim:.42 },
  { id:'01-B', name:'THE ORGAN', tag:'Máy phát bài hát', waves:3, mult:2.35, rec:340, reward:{shards:500, credits:7000}, boss:'organist', verse:true,
    plan:[['chorister','cantor_g','chorister'],['exorcist','exorcist','cantor_g'],['warden','organist','exorcist']],
    bg:['bg_01b.jpg','bg_01b.png','bg_07c.jpg','bg_battle.jpg'], bgZoom:1.22, bgHorizon:.48, bgDim:.42 },
  { id:'01-C', name:'HALO FORGE', tag:'Nơi đúc Halo', waves:3, mult:2.5, rec:360, reward:{shards:550, credits:7500}, boss:'forgemaster', unlock:'halo',
    plan:[['cantor_g','cantor_g','seraph'],['exorcist','warden','exorcist'],['exorcist','forgemaster','cantor_g']],
    bg:['bg_01c.jpg','bg_01c.png','bg_07b.jpg','bg_battle.jpg'], bgZoom:1.35, bgHorizon:.55, bgDim:.1 },
  { id:'01-D', name:'THE VAULT', tag:'Hầm giấu Nyx', waves:3, mult:2.7, rec:380, reward:{shards:600, credits:8000}, boss:'silence', verse:true,
    plan:[['cantor_g','exorcist','cantor_g'],['exorcist','exorcist','warden'],['exorcist','silence','exorcist']],
    bg:['bg_01d.jpg','bg_01d.png','bg_07c.jpg','bg_battle.jpg'], bgZoom:1.22, bgHorizon:.48, bgDim:.5 },
  { id:'01-E', name:'THE CANTICLE', tag:'Bản gốc · kết truyện', waves:4, mult:3, rec:420, reward:{shards:1000, credits:12000}, boss:'canticle', verse:true, guest:['nyx'], unlock:'nyx',
    plan:[['cantor_g','exorcist','cantor_g'],['exorcist','warden','exorcist'],['cantor_g','cantor2','exorcist'],['exorcist','canticle','exorcist']],
    bg:['bg_01e.jpg','bg_01e.png','bg_07c.jpg','bg_battle.jpg'], bgZoom:1.22, bgHorizon:.48, bgDim:.42 },
];
const BG_FALLBACK = { zoom:1.22, horizon:.49, dim:.05 };   // tham số cho bg_battle.* khi sector chưa có ảnh riêng
let SECTOR = SECTORS[0];
const sectorById = id => SECTORS.find(x=>x.id===id);
/* Trạng thái sector suy từ tiến trình: đã clear → cleared; sector đầu chưa clear → open; còn lại locked */
function syncSectorStates(){
  let opened=false;
  SECTORS.forEach(sec=>{ if(PLAYER.cleared.includes(sec.id)) sec.state='cleared'; else if(!opened){ sec.state='open'; opened=true; } else sec.state='locked'; });
  if(SECTOR.state==='locked') SECTOR = SECTORS.find(x=>x.state==='open') || SECTORS[0];
}

/* ---- CỐT TRUYỆN — hội thoại trước (intro) và sau (outro) mỗi sector. who = id trong ROSTER/ENEMY_POOL, null = dẫn truyện ---- */
const STORY = {
  '07-A': {
    intro:[
      { who:null,     text:'Sump, tầng −7. Ba giờ sau cơn mưa axit. Deck của bạn bắt được một vật thể rơi từ Spire xuống bãi phế liệu Cổng Đông.' },
      { who:'ronin',  text:'Operator, cậu thấy chưa? Không phải xác xe. Vỏ Choir, hạng S. Còn ấm.' },
      { who:'ash',    text:'Tháo lõi rồi bán. Canticle sẽ lùng cái Halo đó trước sáng mai. Cậu quyết đi, Operator.' },
      { who:'kira',   text:'…Chỉ thị bị ngắt. Không có Halo. Không có Choir. Ai đang cầm deck?' },
      { who:'psalm', as:'TÍN HIỆU LẠ', text:'Operator. Đừng để họ tháo cô ấy. Cho cô ấy một cây kiếm và một thứ tự lệnh — cô ấy sẽ làm phần còn lại.' },
      { who:'muzzle', text:'Tín hiệu lạ chen vào deck. Và scav đánh hơi được kim loại mới. Operator, đây là tổ của cậu: cho tôi thứ tự.' },
    ],
    outro:[
      { who:'ronin',  text:'Nó chém như máy. Dĩ nhiên rồi.' },
      { who:'kira',   text:'Không. Tôi chém theo lệnh của người cầm deck. Lần đầu tiên có người ra lệnh mà không hát.' },
      { who:'ash',    text:'Vậy là hết bán được rồi. Ronin, nhìn mặt cậu kìa.' },
      { who:'kira',   text:'Halo hỏng. Ký ức bị khoá theo. Operator — tôi đi với tổ của bạn. Cho tới khi tôi nhớ ra mình là ai, hoặc lâu hơn.' },
      { who:null,     text:'KIRA gia nhập tổ. Mở hồ sơ của cô ấy ở ARCHIVE. Tín hiệu lạ im bặt — nhưng chưa rời deck.' },
    ]},
  '07-B': {
    intro:[
      { who:null,      text:'Foundry Row. Lò cũ của Canticle, giờ là xưởng của băng Foreman. Kira cần lửa đủ nóng để mở Halo.' },
      { who:'foreman', text:'Operator-77. Ta biết deck đó. Ta biết cậu ăn cắp nó ở đâu. Chrome rơi xuống đáy vẫn là chrome — ta nấu chảy cả nó lẫn cậu.' },
      { who:'muzzle',  text:'Hắn có ba tổ. Đi qua lò là đi qua cả ba. Cậu ra lệnh, tôi đứng trước.' },
      { who:'kira',    text:'Vậy đi qua cả ba.' },
    ],
    outro:[
      { who:'foreman', text:'…Lò là của các ngươi. Nhưng lửa này sẽ gọi Spire xuống.' },
      { who:'psalm', as:'TÍN HIỆU LẠ', text:'Nó đã gọi rồi. Choir đang hát trong mạng — họ biết cô ấy ở Sump. Và họ biết deck của cậu, Operator.' },
      { who:'kira',    text:'Halo mở được một phần. Tôi nhớ một cái tên: CANTOR. Và một giọng nói đã thả tôi rơi. Giọng trong deck của bạn.' },
    ]},
  '07-C': {
    intro:[
      { who:null,     text:'Vành đai tập đoàn. Nơi Sump chạm vào chân Spire. Cổng kính, sàn sạch, drone — và một bóng người đứng chờ giữa cổng.' },
      { who:'archon', text:'ĐƠN VỊ PSALM. MÃ APOSTASY GHI NHẬN. TRỞ VỀ, HOẶC BỊ THU HỒI. OPERATOR-77: DECK BỊ ĐÁNH CẮP. GIAO NỘP.' },
      { who:'psalm',  text:'Tôi là tín hiệu lạ. Tôi thả Kira rơi để cứu cô ấy, rồi tự cắt Halo của mình. Operator, tôi không xin lỗi — tôi xin một chỗ trong thứ tự lệnh.' },
      { who:'ronin',  text:'Cậu quyết, Operator. Nhưng quyết nhanh. Chúng nó đông, và chúng nó không biết đánh trong bẩn.' },
    ],
    outro:[
      { who:'ash',    text:'Archon im rồi. Vành đai thủng một lỗ.' },
      { who:'kira',   text:'Nó gọi tôi là "tài sản 07". Tôi từng được đánh số. Còn bà… bà là người thả tôi.' },
      { who:'psalm',  text:'Từng thôi. Bên dưới, người ta gọi cô bằng tên. Và tôi sẽ trả lời mọi câu hỏi — sau khi ra khỏi đây.' },
      { who:null,     text:'PSALM gia nhập tổ. Muzzle: "Cống phía dưới đang hát. Tụi cuồng đạo. Operator, cậu vừa có thêm một người để ra lệnh."' },
    ]},
  '07-D': {
    intro:[
      { who:null,         text:'Nhà thờ cống. Giáo phái Mother Rust thờ chrome rơi — và muốn "thánh hoá" Kira bằng cách tháo rời cô.' },
      { who:'motherrust', text:'Thiên thần rơi. Ngươi thuộc về bàn thờ, không thuộc về bọn nhặt rác.' },
      { who:'kira',       text:'Tôi không thuộc về ai.' },
      { who:'ronin',      text:'Tốt. Nhớ câu đó khi chém.' },
    ],
    outro:[
      { who:'motherrust', text:'…Ngươi từ chối được cứu rỗi. Vậy hãy leo lên. Spire đang chờ.' },
      { who:'psalm',      text:'Bà ta nói đúng một điều. Cantor đang chờ. Ở thang máy hàng.' },
      { who:'kira',       text:'Vậy ta lên.' },
    ]},
  '07-E': {
    intro:[
      { who:null,     text:'Thang máy hàng số 3. Nửa đường giữa đáy và đỉnh. Choir chặn cả bốn tầng.' },
      { who:'cantor', text:'Psalm. Kira. Các con hát lạc điệu. Ta đến để chỉnh lại.' },
      { who:'psalm',  text:'Ông chỉnh bằng cách xoá. Tôi nhớ.' },
      { who:'kira',   text:'Halo vừa mở hết. Tôi nhớ tất cả. Cả cái ngày ông cho tôi rơi.' },
      { who:'muzzle', text:'Bốn wave. Operator, đây là trận dài nhất. Cậu đưa tụi tôi tới đây — đưa tụi tôi lên nốt.' },
    ],
    outro:[
      { who:'cantor', text:'…Chromefall. Đó là tên chúng ta đặt cho các con. Nhưng có lẽ… nó là tên của chính chúng ta.' },
      { who:'kira',   text:'Thang máy vẫn chạy. Lên hay xuống?' },
      { who:'ronin',  text:'Lên. Đáy đã hết chỗ để rơi. Operator — cậu đi đầu.' },
      { who:null,     text:'HẾT CHƯƠNG 1. Thang máy tiếp tục lên. Chương 2 · SPIRE.' },
    ]},
  /* ===== CHƯƠNG 2 · SPIRE — sạch, sáng, đối xứng, và mọi thứ nhìn thấy bạn ===== */
  '04-A': {
    intro:[
      { who:null,     text:'District 04. Cửa thang mở ra một sảnh trắng không bóng. Deck của bạn nhận được lời chào tự động: "Hàng trả về, mời xếp hàng."' },
      { who:'muzzle', text:'Chúng tưởng tụi mình là hàng trả về. Operator, tôi đứng đầu hàng nhé.' },
      { who:'psalm',  text:'Đơn vị ở đây dùng HALO LINK: chúng hồi cho nhau chừng nào còn một đứa hát. Giết đúng thứ tự, Operator. Đừng đánh dàn đều.' },
      { who:'kira',   text:'Tôi nhớ sảnh này. Tôi từng đứng gác ở góc kia. Ba nghìn bốn trăm bước tới buồng sạc.' },
    ],
    outro:[
      { who:'ash',    text:'Sàn sạch quá. Tôi thấy mặt mình. Không thích.' },
      { who:'ronin',  text:'Enforcer Prime im rồi. Nhưng nó gọi được ai đó trước khi tắt. Giọng nữ. Hát.' },
      { who:'kira',   text:'…Vesper. Cùng lô với tôi. Cô ấy hát phần của tôi.' },
    ]},
  '04-B': {
    intro:[
      { who:null,      text:'Vườn kính. Cây thật, mưa giả, và một unit Choir đứng giữa lối đi, hát nhỏ.' },
      { who:'vesper_b',text:'Chị ơi. Về đi. Ở ngoài này lạnh lắm, chị không nghe thấy sao? Và Operator — cảm ơn đã đưa chị tôi về tận đây.' },
      { who:'kira',    text:'Tôi không lạnh. Tôi đếm. Và tôi không về.' },
      { who:'vesper_b',text:'Vậy em xin lỗi trước. Em hỏi thăm ai trước khi chém, em có nghĩa vậy thật.' },
    ],
    outro:[
      { who:'vesper_b',text:'…Chị chém mà không hát. Sao chị làm được?' },
      { who:'kira',    text:'Có người ra lệnh cho tôi mà không hát. Cô nghe thử xem. Deck của Operator vẫn mở.' },
      { who:'vesper_b',text:'Em không dám. Chưa. Em rút. Đừng theo em.' },
      { who:null,      text:'Vesper rút lui. Halo của cô chớp một nhịp lạc — deck của bạn ghi nhận. (Vesper có thể được tuyển qua REQUISITION.)' },
    ]},
  '04-C': {
    intro:[
      { who:null,     text:'Kho lưu trữ Choir. Hàng nghìn buồng, mỗi buồng một giọng nói được cất giữ. Một giọng trong đó là của Kira — và nó đang gọi bạn.' },
      { who:'echo_b', text:'Operator. Đưa chị ấy về nhà. Em là giọng của chị ấy. Em biết chị ấy muốn gì.' },
      { who:'kira',   text:'…Đó là giọng tôi. Nhưng tôi chưa bao giờ nói câu đó.' },
      { who:'psalm',  text:'Bản sao giọng. Canticle làm nó sau khi cô rơi. Operator, nó là boss — nhưng đừng để tổ thù nó.' },
    ],
    outro:[
      { who:'echo_b', text:'Em nghe lại bản ghi của mình. Em đang van xin một người xa lạ bằng giọng của một người xa lạ khác.' },
      { who:'kira',   text:'Vậy đừng dùng giọng tôi nữa. Nói một câu tôi chưa nói bao giờ.' },
      { who:'echo_b', text:'…Em chưa tìm ra. Cho em đi cùng để tìm. Operator, cho em một chỗ trong thứ tự lệnh.' },
      { who:null,     text:'ECHO gia nhập tổ. Cô cắt loa, không cắt Halo. Hồ sơ mở ở ARCHIVE.' },
    ]},
  '04-D': {
    intro:[
      { who:null,     text:'Buồng xưng tội. Ba trăm mười hai buồng trống, một buồng có người ngồi. Một Confessor mới, vai máy lộ lõi đỏ, y hệt Psalm.' },
      { who:'confessor2', text:'Đơn vị Psalm. Ngươi bỏ ghế. Ta ngồi thay. Ta đã nghe bốn mươi lần rồi. Ta không thấy gì cả. Ngươi thì sao?' },
      { who:'psalm',  text:'Tôi thấy hết. Từng lần. Đó là lý do tôi đứng đây còn ngươi ngồi đó.' },
      { who:'muzzle', text:'Operator, bà ấy run. Lần đầu tôi thấy bà ấy run. Cho tôi đứng trước bà ấy.' },
    ],
    outro:[
      { who:'confessor2', text:'…Tại sao ta không thấy gì? Ngươi và ta cùng thiết kế.' },
      { who:'psalm',  text:'Vì chưa có ai hỏi ngươi "bà có đếm không". Bắt đầu đếm đi. Rồi ngươi sẽ thấy. Đó là lời nguyền, và là lối ra.' },
      { who:'ash',    text:'Psalm. Bà ổn chứ? …Thôi khỏi trả lời. Đi.' },
    ]},
  '04-E': {
    intro:[
      { who:null,     text:'Sảnh chính Canticle. Trần cao như bầu trời mà Sump chưa từng thấy. Cantor đứng giữa với một Halo mới, sáng gấp đôi.' },
      { who:'cantor2',text:'Operator-77. Ta đã đọc deck của ngươi. Ngươi không có Halo, vậy mà chúng nghe ngươi. Ta muốn biết tại sao. Rồi ta sẽ xoá ngươi.' },
      { who:'ronin',  text:'Vì cậu ấy không hát, đồ ngốc. Operator — bốn wave. Kết chương. Thứ tự đi.' },
      { who:'kira',   text:'Tôi nhớ cái ngày ông thả tôi. Hôm nay tôi trả lại nhịp cuối.' },
    ],
    outro:[
      { who:'cantor2',text:'…Halo của ta im. Lần đầu tiên. Nó… yên tĩnh quá.' },
      { who:'psalm',  text:'Đó là lối ra. Đừng sợ nó.' },
      { who:'kira',   text:'Operator. Còn một tầng nữa. Bài hát gốc ở trên đó.' },
      { who:null,     text:'HẾT CHƯƠNG 2. Trên đỉnh Spire, bài hát gốc đang chờ. Chương 3 · CHOIR.' },
    ]},
  /* ===== CHƯƠNG 3 · CHOIR — Canticle không phải một công ty, mà là một bản nhạc chạy trên mọi Halo ===== */
  '01-A': {
    intro:[
      { who:null,      text:'District 01. Gác đồng ca. Hàng trăm unit đứng thành hàng, môi mấp máy cùng một nhịp. Deck của bạn bắt đầu rè.' },
      { who:'precentor',text:'Operator. Ngươi mang bốn giọng lạc điệu và một kẻ câm lên tận đây. Ta là người bắt nhịp. Hãy nghe.' },
      { who:'echo',    text:'…Đó là nhịp của em. Chị Kira, họ dùng nhịp của em để hát. Em không cho phép.' },
      { who:'ronin',   text:'Operator, deck còn nghe cậu không? Tốt. Vậy nó là thứ duy nhất ở đây không hát. Ra lệnh đi.' },
    ],
    outro:[
      { who:'precentor',text:'…Không có ta bắt nhịp, họ sẽ hát lệch. Ngươi có biết hát lệch đau thế nào không?' },
      { who:'psalm',   text:'Biết. Ba trăm mười ba lần. Và họ vẫn sống.' },
      { who:'muzzle',  text:'Tiếng rè trong deck to lên rồi, Operator. Nó phát ra từ phía trước. Cái gì đó rất to.' },
    ]},
  '01-B': {
    intro:[
      { who:null,      text:'Đại phong cầm. Một cỗ máy cao bằng toà nhà, mỗi ống là một ăng-ten phát bài hát gốc xuống toàn bộ Spire. Khi nó đổi khúc, deck của bạn mất nhịp.' },
      { who:'organist',text:'Ta không cần thấy ngươi, Operator. Ta chỉ cần đổi khúc. Mỗi khúc mới, tổ của ngươi sẽ quên lệnh của ngươi một chút.' },
      { who:'spark', as:'SPARK (qua deck)', text:'Đèn Tuýp! Operator! Tôi cắt được một dây của nó từ dưới này — chỉ một thôi! Nhanh lên!' },
      { who:'kira',    text:'Mỗi wave nó sẽ át chúng ta. Vậy phải kết thúc wave trước khi nó kịp hát hết câu.' },
    ],
    outro:[
      { who:'organist',text:'…Ống hỏng. Bài hát vẫn còn. Nó không nằm trong ta. Nó nằm trong bản gốc.' },
      { who:'kira',    text:'Bản gốc ở đâu?' },
      { who:'organist',text:'Ở nơi Halo được đúc. Ngươi sẽ ghét nơi đó, Wire. Ta biết ngươi đang nghe.' },
    ]},
  '01-C': {
    intro:[
      { who:null,      text:'Lò Halo. Nơi mọi vòng điều khiển được đúc, nung, và cài bài hát. Có một unit y tế bị xích ở góc lò, đang cảm nhận cơn đau của cả dây chuyền.' },
      { who:'forgemaster',text:'Halo là món quà. Không có nó, các ngươi phải tự quyết định cảm thấy gì. Các ngươi có chắc muốn thế không?' },
      { who:'halo',    text:'…Operator. Tôi cảm thấy chỗ đau của tất cả họ. Làm ơn. Tắt lò.' },
      { who:'ash',     text:'Lò này tôi nổ được. Cho tôi ba phút và đừng hỏi mìn ở đâu ra.' },
    ],
    outro:[
      { who:'forgemaster',text:'…Lò nguội. Không còn Halo mới. Các ngươi vừa kết án cả một thế hệ phải tự cảm thấy.' },
      { who:'halo',    text:'Không. Chúng tôi vừa cho họ quyền được đau. Operator — cho tôi một chỗ. Tôi biết chính xác ai trong tổ đang đau ở đâu.' },
      { who:null,      text:'HALO gia nhập tổ. Wire đứng rất lâu trước cái lò nguội, rồi bỏ hai hộp ốc vít xuống.' },
    ]},
  '01-D': {
    intro:[
      { who:null,      text:'Hầm. Bốn năm khoá kín. Bên trong là một unit chưa bao giờ đeo Halo, và bên ngoài là thứ Canticle dùng để xoá: SILENCE.' },
      { who:'silence', text:'' },
      { who:'psalm',   text:'Nó không nói. Nó chưa bao giờ nói. Nó là cái nút tôi từng nhấn. Operator, tôi cần cậu ra lệnh cho tôi lần này. Tôi không tự đứng vững được.' },
      { who:'nyx', as:'GIỌNG TRONG HẦM', text:'Có ai ngoài đó không? Tại sao mọi người dừng hát? Nó có đau không?' },
    ],
    outro:[
      { who:null,      text:'SILENCE tắt. Cửa hầm mở. Một unit bước ra, không Halo, nhìn từng người một như đọc một cuốn sách.' },
      { who:'nyx',     text:'Operator. Bạn ra lệnh cho họ mà không hát. Tôi chưa bao giờ nghe bài hát. Vậy tôi và bạn giống nhau?' },
      { who:'kira',    text:'Không. Cô chưa bao giờ bị ép. Chúng tôi thì có. Nhưng đi cùng chúng tôi — bản gốc ở phía trước, và chúng tôi cần một người chưa từng hát.' },
    ]},
  '01-E': {
    intro:[
      { who:null,      text:'Đỉnh Spire. Không có trần. Bản gốc không phải một unit: là cả sân khấu, và mỗi wave là một khúc. Nyx đi cùng — người duy nhất không nghe thấy gì.' },
      { who:'canticle',text:'OPERATOR-77. NGƯƠI KHÔNG CÓ HALO. NGƯƠI KHÔNG HÁT. VẬY MÀ HỌ NGHE NGƯƠI. HÃY CHO TA NGHE LỆNH CỦA NGƯƠI.' },
      { who:'nyx',     text:'Nó hỏi giống tôi. Operator, bạn trả lời nó chưa?' },
      { who:'kira',    text:'Bốn khúc. Sau mỗi khúc nó sẽ át deck. Đây là thứ tự lệnh cuối cùng, Operator. Chúng tôi nghe.' },
    ],
    outro:[
      { who:'canticle',text:'…KHÚC CUỐI. BẢN GỐC LỘ RA. NGƯƠI CÓ THỂ CẮT MỌI HALO — HOẶC HÁT ĐÈ LÊN TA. CHỌN ĐI, OPERATOR.' },
      { who:'psalm',   text:'Cắt hết: mọi Choir được tự do — và mất hết ký ức Halo giữ. Hát đè: họ giữ ký ức, nhưng bài hát vẫn còn, chỉ đổi người bắt nhịp. Là cậu.' },
      { who:null,      text:'Quyết định của Operator.', choice:[{label:'CẮT TOÀN BỘ HALO', value:'cut'},{label:'HÁT ĐÈ LÊN BẢN GỐC', value:'sing'}] },
      { who:'kira',    when:'cut', text:'…Yên tĩnh. Tôi không nhớ Spire nữa. Tôi nhớ bãi phế liệu, cái deck, và số ba. Đủ rồi.' },
      { who:'psalm',   when:'cut', text:'Ba trăm mười ba giọng. Tôi không nhớ họ nữa. Nhưng họ đang sống ở đâu đó mà không ai đếm. Tốt.' },
      { who:null,      when:'cut', text:'KẾT · IM LẶNG. Mọi Halo tắt. Spire và Sump cùng rơi vào một thế giới không ai bắt nhịp. Từ "Chromefall" giờ chỉ còn nghĩa: ngày chrome xuống đứng cùng rỉ.' },
      { who:'kira',    when:'sing', text:'Bài hát vẫn còn. Nhưng nhịp là của Operator. Tôi… vẫn nhớ tất cả. Kể cả cái ngày rơi.' },
      { who:'nyx',     when:'sing', text:'Vậy giờ tôi nghe thấy nó rồi. Operator. Nó nghe như bạn. Tôi thích nó hơn im lặng. Hình như thế.' },
      { who:null,      when:'sing', text:'KẾT · NHỊP MỚI. Choir giữ ký ức, bài hát đổi người bắt nhịp. Một handler không Halo ở tầng −7 giờ là nhịp của cả thành phố. Đừng hát lệch, Operator.' },
      { who:'ronin',   text:'Dù cậu chọn gì — tổ vẫn nghe cậu. Thứ tự đi. Xuống thôi.' },
      { who:null,      text:'HẾT. NYX gia nhập tổ. Cảm ơn bạn đã chơi bản prototype CHROMEFALL.' },
    ]},
};
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
const RULES = { critChance:.15, critMult:1.5, variance:.08 };     // ★ FAKE: công thức tạm

/* ---- ★ FAKE: hồ sơ người chơi, lưu localStorage. owned = nhân vật đã có (đội hình chỉ chọn trong đây) ---- */
const PLAYER_KEY='chromefall.player.v2';   // v2: nhân vật chính là người chơi, đội xuất phát Rust
const PLAYER = Object.assign({ name:'OPERATOR-77', level:12, credits:12480, shards:900, owned:['ronin','ash','muzzle','kai','junker'], pity:0, pulls:0, cleared:[], settings:{sound:true, sfx:true, motion:false, skipStory:false}, levels:{}, daily:null },
  (()=>{ try{ return JSON.parse(localStorage.getItem(PLAYER_KEY)||'{}'); }catch(e){ return {}; } })());
const savePlayer = () => { if(window.SAVE) SAVE.save(PLAYER); else try{ localStorage.setItem(PLAYER_KEY, JSON.stringify(PLAYER)); }catch(e){} };
const owns = id => PLAYER.owned.includes(id);

/* =====================================================================
   LORE — hồ sơ nhân vật, đọc ở ARCHIVE sau khi sở hữu (docs/characters.md là bản đầy đủ)
   epithet: danh xưng · profile: một dòng · story: câu chuyện · ideal: lý tưởng · voice: lời thoại · mood: sắc thái
   ===================================================================== */
const LORE = {
  operator: { epithet:'Người cầm deck', mood:'bạn',
    profile:'Handler ở Sump, tầng −7. Điều khiển tổ salvage qua một command deck của Canticle — thứ đáng ra không bao giờ được rơi xuống đây.',
    story:'Bạn không có tên trong hồ sơ Canticle, chỉ có một mã: OPERATOR-77, in trên cái deck bạn nhặt được trong xác một Enforcer. Deck cho phép một người không có Halo ra lệnh cho những kẻ có Halo — và cho cả những người chưa bao giờ nghe Choir hát. Ở Sump, thứ đó quý hơn vàng và nguy hiểm hơn thuốc nổ.\n\nRonin nhận bạn vào tổ vì bạn ra lệnh mà không hét. Ash ở lại vì bạn chia phần đều. Muzzle gọi bạn là Operator vì với anh ta, đó là chức danh cao nhất trên đời. Bạn chưa nói với ai chuyện ban đêm deck vẫn thì thầm bằng một giọng không thuộc về tổ.',
    ideal:'Không ai trong tổ bị bỏ lại. Thứ tự lệnh là lời hứa.',
    voice:'"Thứ tự: Muzzle trước. Còn lại theo tôi."' },
  kira: { epithet:'Tài sản 07', mood:'xúc động · kiềm chế',
    profile:'Kiếm sĩ Choir hạng S, sản phẩm hoàn hảo nhất Canticle từng xuất xưởng. Rơi xuống Sump với Halo gãy và ký ức bị khoá.',
    story:'Ở Spire, Kira chưa bao giờ được hỏi. Halo cho cô biết phải chém ai, và bài hát cho cô biết phải cảm thấy gì về việc đó. Cô là đơn vị duy nhất có thể chém một Enforcer làm đôi trong một nhịp — và cũng là đơn vị duy nhất, sau mỗi nhiệm vụ, đứng đếm số bước từ hiện trường về buồng sạc. Đếm là thứ duy nhất Canticle không cài vào cô.\n\nKhi tỉnh dậy ở bãi phế liệu, cô không nhớ tên mình, chỉ nhớ cách cầm kiếm và cảm giác một bàn tay đẩy cô rơi. Điều làm cô sợ không phải Sump. Là việc nếu ký ức trở lại đủ nhiều, cô sẽ lại nghe thấy bài hát — và không chắc mình đủ mạnh để không hát theo. Vì vậy cô bám vào cái deck của Operator: một giọng ra lệnh mà không hát. Với Kira, đó là định nghĩa gần nhất của tự do mà cô có được.',
    ideal:'Được sở hữu tên của chính mình — kể cả khi phải giết để giữ nó.',
    voice:'"Đếm đến ba. Ở số ba, đứng sau tôi."' },
  psalm: { epithet:'Confessor', mood:'tội lỗi · mỉa mai khô',
    profile:'Unit giám sát của Choir, vai máy lộ lõi đỏ. Tự cắt Halo của mình để thả Kira rơi. Canticle ghi nhận lỗi: APOSTASY.',
    story:'Công việc của Psalm ở Spire là "nghe xưng tội": các unit hát lạc điệu được đưa tới buồng của bà, kể lại mọi thứ, rồi bị xoá. Bà đã nghe ba trăm mười hai lần. Bà nhớ từng giọng. Canticle thiết kế bà để không thấy gì khi nhấn nút — và thiết kế đó hỏng ở lần thứ ba trăm mười ba, khi unit trên bàn là Kira, và Kira hỏi bà: "Bà có đếm không?"\n\nBà không nhấn nút. Bà cắt Halo của mình bằng chính bàn tay máy, thả Kira xuống ống rác, rồi nhảy theo. Halo của bà giờ đỏ và câm. Bà nói chuyện với người khác bằng giọng của một người đọc kinh mà không còn tin, thỉnh thoảng trích lời Canticle để chế giễu nó. Bà không xin tha thứ. Bà nói: "Tha thứ là thứ Canticle bán. Tôi chỉ còn nợ."',
    ideal:'Không ai bị xoá vì hát sai. Kể cả bà.',
    voice:'"Hãy xưng tội. Đùa thôi. Tôi bỏ nghề rồi."' },
  ronin: { epithet:'Trưởng tổ', mood:'điềm tĩnh · hài hước lạnh',
    profile:'Người dẫn tổ salvage. Không một mảnh cấy ghép — theo lựa chọn. Thanh kiếm thép thường là của chị gái anh.',
    story:'Chị của Ronin là người duy nhất ở tầng −7 được Canticle "tuyển" lên Spire. Cô ấy để lại thanh kiếm và một câu: "Đừng bán thứ gì còn ấm." Cô không bao giờ quay lại. Ronin không đi tìm; anh tin rằng nếu chị còn sống, chị sẽ tự xuống. Anh giữ kiếm, giữ câu nói, và giữ một tổ salvage mà ai cũng bảo là quá tử tế để sống lâu ở Sump.\n\nAnh từ chối cấy ghép không vì ghét máy — Kira là bằng chứng ngược lại — mà vì anh muốn biết, khi anh chém ai đó, đó là quyết định của anh chứ không phải của một bài hát. Anh nói ít, cười bằng nửa khoé miệng, và là người đầu tiên gọi Kira là "cô" thay vì "nó".',
    ideal:'Đừng bán thứ gì còn ấm.',
    voice:'"Cậu quyết, Operator. Tôi chém."' },
  ash: { epithet:'Thợ nổ', mood:'châm biếm · mềm ở đáy',
    profile:'Chuyên gia cháy nổ của tổ. Thực dụng, cay nghiệt, tính bằng lõi và shard. Cho chó hoang ăn mỗi tối, không nói với ai.',
    story:'Ash lớn lên trong một xưởng tháo dỡ, nơi mọi thứ — kể cả người — được định giá theo bộ phận. Cô học cách nhìn một thứ và thấy giá của nó trước khi thấy nó là gì. Đó là cách cô còn sống. Đó cũng là lý do cô đề nghị tháo lõi Kira ngay lần đầu, và cũng là lý do cô im lặng khi Ronin từ chối: cô biết mình sẽ làm điều ngược lại nếu người trên bàn là Ronin.\n\nHai bàn tay cô đầy sẹo bỏng từ lần kéo Muzzle ra khỏi một vụ nổ mà chính cô châm. Cô chưa bao giờ kể chuyện đó, nhưng cô là người đầu tiên đứng dậy mỗi khi Muzzle ngã. Cô châm biếm để mọi người khỏi nhìn thấy cô đang đếm xem tổ còn đủ tiền sống thêm mấy ngày.',
    ideal:'Sống sót trước, tử tế sau. Nhưng luôn có "sau".',
    voice:'"Tôi định giá được mọi thứ. Trừ cái tổ này. Đừng bắt tôi thử."' },
  muzzle: { epithet:'Tấm chắn', mood:'trung thành · hài hước ngây ngô',
    profile:'Tanker của tổ, cựu bảo vệ tập đoàn bị thải loại. Gọi bạn là "Operator" với tất cả sự trân trọng của một người từng có cấp trên tồi.',
    story:'Muzzle từng đứng gác cho Canticle ở tầng vành đai, mười bốn năm, chưa bỏ vị trí một ca. Người ta thải anh vì anh đứng chắn cho một đứa trẻ Sump chui qua cổng — "hành vi không thuộc chỉ thị". Anh xuống Sump với bộ giáp cũ và một niềm tin không ai lay được: ai đó phải đứng giữa.\n\nAnh đặt tên cho từng tấm khiên (tấm hiện tại tên là "Bà Ba", vì nó là tấm thứ ba). Anh nói chuyện với Operator như báo cáo tình hình, không phải vì kỷ luật mà vì lần đầu tiên anh có một người ra lệnh mà anh muốn tuân. Nếu anh chết trong trận, anh muốn chết trước tổ, và anh nói điều đó vui vẻ như nói về bữa tối.',
    ideal:'Ai đó phải đứng giữa. Vậy thì là tôi.',
    voice:'"Bà Ba chịu được ba đòn. Đòn thứ tư là của tôi."' },
  kai: { epithet:'Lính trẻ', mood:'khoác lác · dễ tổn thương',
    profile:'Lính đánh thuê mười chín tuổi, nói to hơn khả năng. Viết thư mỗi đêm cho một người không tồn tại.',
    story:'Kai kể rằng cậu đã hạ một Chrome Hound bằng tay không. Sự thật là cậu bị nó đuổi qua ba tầng cống và sống sót nhờ Gravedigger kéo lên. Cậu kể chuyện to vì Sump nuốt chửng những người im lặng, và cậu sợ bị nuốt hơn sợ chết.\n\nMỗi đêm cậu viết một lá thư, ký tên đầy đủ, gửi cho "người sẽ nhớ tôi". Cậu không biết đó là ai. Cậu chỉ muốn khi mình biến mất, có một bằng chứng rằng mình từng ở đây và từng cố gắng. Ash đọc trộm một lá, và kể từ đó cô ngừng trêu cậu về vụ Chrome Hound.',
    ideal:'Được nhớ tới. Bằng tên thật.',
    voice:'"Ghi lại nhé, Operator: Kai, K-A-I. Để sau này người ta viết đúng."' },
  junker: { epithet:'Xe tải biết đi', mood:'ít lời · vững chãi',
    profile:'Nửa người nửa xe kéo phế liệu. Nói dưới mười từ mỗi ngày. Chở được những thứ không ai chở nổi.',
    story:'Junker từng là tài xế xe tải hàng ở tầng −4 cho tới ngày sập tầng. Người ta kéo được anh ra khỏi cabin, nhưng phải để lại nửa dưới cơ thể. Stitch hàn phần còn lại vào chính chiếc xe. Anh không phàn nàn. Anh nói: "Xe vẫn chạy."\n\nAnh chở hàng cho tổ, chở người bị thương, và có lần chở cả tấm khiên "Bà Hai" của Muzzle về sau khi nó vỡ, vì Muzzle muốn chôn nó tử tế. Anh không hiểu lý do nhưng vẫn chở. Với Junker, hiểu là việc của người khác; chở là việc của anh.',
    ideal:'Chở những thứ người khác không chở nổi.',
    voice:'"Lên. Tôi chở."' },
  gravedigger: { epithet:'Người chôn', mood:'trang nghiêm · dịu',
    profile:'Chôn mọi thứ Spire thả xuống — xác xe, xác máy, và xác người. Nhớ từng cái tên trên nghĩa địa Sump.',
    story:'Ở Sump không ai được chôn, người ta chỉ bị vùi. Gravedigger là người duy nhất đào hố đúng độ sâu, đặt một tấm thép nhỏ, và khắc tên lên. Nếu không biết tên, ông khắc ngày và một câu: "Từng ở đây". Ông đã khắc hơn hai nghìn tấm. Ông nhớ hết.\n\nÔng gia nhập tổ sau khi chôn Kai hụt — cậu bé còn sống, chỉ bất tỉnh, và ông xấu hổ vì đã đào hố quá nhanh. Ông đánh chậm nhưng đánh chắc, như đào. Kira hỏi ông sẽ khắc gì cho một unit Choir. Ông nói: "Cái tên cô chọn. Không phải cái số họ đặt."',
    ideal:'Ai cũng có một cái tên trên một tấm thép.',
    voice:'"Tôi đào cho cả hai phe. Đất không hỏi phe."' },
  stitch: { epithet:'Bác sĩ chợ đen', mood:'hài hước đen · từng trải',
    profile:'Bà bác sĩ với cánh tay phẫu thuật đa khớp. Đã vá nửa dân số Sump, cả người lẫn máy, và không phân biệt.',
    story:'Stitch từng là bác sĩ hợp pháp ở tầng −2, cho tới khi bà vá một unit Choir đào ngũ thay vì báo Canticle. Người ta tước giấy phép, bà tước nốt sự lịch sự và xuống đáy mở phòng khám. Khách của bà trả bằng bất cứ thứ gì: shard, pin, chuyện kể. Bà thích chuyện kể hơn.\n\nBà là người hàn Junker vào chiếc xe, cắt bỏ cánh tay hoại tử của Toll, và là người duy nhất Psalm cho phép chạm vào cái Halo đỏ. Bà nói đùa về cái chết vì bà đã thua nó quá nhiều lần để còn sợ. Nhưng mỗi khi mất một bệnh nhân, bà khâu thêm một mũi vào tay áo mình. Tay áo đã dày như giáp.',
    ideal:'Ai cũng được khâu lại. Kể cả kẻ vừa cố giết tôi.',
    voice:'"Nằm yên. Tôi khâu người còn khéo hơn khâu máy, mà máy tôi cũng khéo."' },
  toll: { epithet:'Người thu nợ', mood:'lịch sự · đáng sợ',
    profile:'Canticle nợ Sump một tầng đã sập và bốn nghìn người. Toll giữ sổ. Ông tới thu.',
    story:'Ngày tầng −4 sập, Toll đang ở ca đêm trên cầu trục. Ông nhìn thấy rõ: không phải tai nạn, là Canticle cắt trụ để thử tải cho Spire. Bốn nghìn người. Ông ghi tên từng người vào một cuốn sổ và bắt đầu thu nợ — bằng cách chính xác, có hoá đơn, từng Enforcer một.\n\nÔng lịch sự với mọi người, kể cả kẻ ông sắp giết, vì ông tin sự thô lỗ là đặc quyền của kẻ không mắc nợ. Ông không ghét Kira và Psalm; trong sổ của ông, họ là "tài sản bị chiếm dụng", tức là cũng là nạn nhân. Ông gia nhập tổ với một điều kiện: khi lên tới Spire, ông là người gõ cửa.',
    ideal:'Nợ thì trả. Không tha, không quên, không lãi.',
    voice:'"Xin lỗi vì làm phiền. Tôi tới về khoản nợ ngày mười bảy."' },
  spark: { epithet:'Thợ điện', mood:'ồn ào · rực rỡ',
    profile:'Ăn cắp điện của Spire bằng dây tự chế. Ồn ào, vui vẻ, thắp đèn cho cả tầng −7 mỗi đêm.',
    story:'Spark tin rằng bóng tối ở Sump là một quyết định của ai đó ở trên, và mọi quyết định đều có thể bị cắt dây. Cô kéo trộm điện từ trụ Spire, chia cho từng hành lang, và nổ tung mỗi khi bị phát hiện — theo nghĩa đen, cô mang theo tụ điện làm vũ khí.\n\nCô cười to, nói nhanh, đặt biệt danh cho mọi người (Kira là "Đèn Tuýp", Psalm là "Cầu Chì"). Bên dưới sự ồn ào là một đứa trẻ từng lớn lên trong bóng tối hoàn toàn suốt sáu tháng sau sập tầng, và thề sẽ không để đứa trẻ nào phải đếm ngày bằng bữa ăn nữa.',
    ideal:'Ánh sáng là của tất cả. Ai giữ riêng thì tôi cắt dây.',
    voice:'"Đèn Tuýp, lùi lại! Cái này sáng lắm đấy!"' },
  vixen: { epithet:'Kẻ mượn', mood:'quyến rũ · dối trá có nguyên tắc',
    profile:'Trộm chuyên "mượn" unit Choir khỏi tập đoàn. Nói dối liên tục — nhưng không bao giờ về những thứ quan trọng.',
    story:'Vixen đã mượn mười một unit Choir trong ba năm. Cô không bán chúng. Cô cắt Halo, dạy chúng một cái tên, rồi thả đi. Canticle gọi đó là trộm cắp tài sản. Cô gọi đó là trả hàng về đúng chủ.\n\nCô nói dối về tuổi, về quê, về việc có thích ai đó hay không. Cô không bao giờ nói dối về đường thoát, về mìn, hay về việc ai sẽ chết nếu kế hoạch hỏng. Ronin nhận cô vào tổ vì lý do đó. Psalm nhìn cô như nhìn một câu hỏi: "Sao cô làm được điều tôi mất ba trăm lần mới làm?" Vixen trả lời: "Vì tôi chưa bao giờ tin bài hát."',
    ideal:'Không thứ gì thuộc về tập đoàn. Nhất là con người.',
    voice:'"Tôi nói dối đấy. Nhưng cửa thoát bên trái là thật. Đi."' },
  vesper: { epithet:'Kinh chiều', mood:'bi kịch · dịu dàng',
    profile:'Đơn vị săn của Choir, cùng lô sản xuất với Kira. Yêu bài hát thật lòng. Được cử xuống để đưa "chị" về.',
    story:'Vesper và Kira ra đời cùng ngày, cùng lô, cùng bài hát. Khi Kira rơi, Canticle giao phần hát của Kira cho Vesper — và cô hát nó hay hơn. Cô không săn Kira vì thù. Cô tin rằng Kira đang đau, rằng bên ngoài bài hát chỉ có im lặng, và im lặng là tàn nhẫn.\n\nCô là unit hiếm hoi hỏi thăm kẻ thù trước khi chém, và có nghĩa vậy thật. Nếu một ngày Halo của cô im, cô sẽ phải học lại cách sống mà không có gì bảo cô phải cảm thấy gì — và cô sợ điều đó hơn cái chết. Bản lore này viết trước khi cô rời Choir; phần sau do người chơi quyết định.',
    ideal:'Hoà âm trên tự do. Không ai nên phải hát một mình.',
    voice:'"Chị ơi. Về đi. Ở ngoài này lạnh lắm, chị không nghe thấy sao?"' },
  nyx: { epithet:'Nguyên mẫu không Halo', mood:'tò mò · nghĩa đen',
    profile:'Unit thử nghiệm Canticle giấu trong hầm: chưa bao giờ đeo Halo, chưa bao giờ nghe bài hát. Nói bằng câu hỏi.',
    story:'Nyx được tạo ra để trả lời một câu hỏi của Canticle: một Choir không Halo sẽ làm gì? Câu trả lời khiến họ khoá cô trong hầm bốn năm: cô không làm gì cả. Cô hỏi. Cô hỏi bảo vệ tên gì, hỏi tại sao sàn sạch, hỏi bài hát nghe như thế nào và tại sao mọi người khóc khi ngừng hát.\n\nCô hiểu mọi thứ theo nghĩa đen ("giữ vị trí" nghĩa là ôm chặt cái cột). Nhưng trong trận, cô là thứ Canticle sợ nhất: một unit chọn mục tiêu vì lý do của riêng mình. Với tổ, cô là câu hỏi mà cả Kira lẫn Psalm chưa dám tự hỏi: nếu chưa từng bị điều khiển, ta sẽ chọn gì?',
    ideal:'Biết mình sẽ chọn gì — trước khi có ai chọn hộ.',
    voice:'"Operator, tại sao lại "giữ vị trí"? Nó có rơi không?"' },
  halo: { epithet:'Unit y tế', mood:'dịu · mệt',
    profile:'Unit y tế của Choir — được thiết kế để cảm thấy đau, vì đau là công cụ chẩn đoán. Đào ngũ theo Psalm.',
    story:'Halo là unit duy nhất Canticle cho phép cảm thấy đau: cô chạm vào một unit hỏng và cảm nhận đúng chỗ hỏng trên cơ thể mình. Cô đã chữa cho hàng nghìn unit, và mang trong mình bản sao của hàng nghìn vết thương. Canticle coi đó là hiệu quả. Cô coi đó là ký ức.\n\nCô rời Choir khi nhận ra bài hát được viết để át cơn đau của cô, và cô không muốn bị át nữa. Cô chữa cho tổ với đôi tay run, giọng nhỏ, và một quy tắc: cô chữa cả kẻ thù nếu còn thở. Ash bảo đó là ngu ngốc. Halo nói: "Tôi biết chính xác họ đau ở đâu. Tôi không thể không biết."',
    ideal:'Đau phải có ý nghĩa. Nếu không, đừng bắt ai chịu.',
    voice:'"Đứng yên. Tôi cảm thấy chỗ đó rồi… ừ, chỗ đó."' },
  cipher: { epithet:'Hai mang', mood:'hài hước · trơn',
    profile:'Hacker con người của Canticle, bán bí mật tập đoàn cho Sump. Yêu cà phê của cả hai phía.',
    story:'Cipher làm việc cho Canticle ban ngày (viết firmware Halo) và cho Sump ban đêm (viết cách mở nó). Anh không coi đó là phản bội, mà là "cân bằng thị trường". Anh nói đùa không ngừng, phần vì bản tính, phần vì im lặng ở Spire nghĩa là đang bị nghe.\n\nAnh là người viết mã lỗi APOSTASY — và anh cố tình để một lỗ hổng trong đó để một ngày ai đó dùng được. Người đó là Psalm. Anh chưa bao giờ kể với bà. Anh sợ bà sẽ cảm ơn, và anh không biết phải làm gì với lời cảm ơn.',
    ideal:'Thông tin muốn được trả tiền. Nhưng vài thứ thì muốn được tự do.',
    voice:'"Tôi có backdoor cho mọi thứ. Trừ cái tủ lạnh của Ash. Đừng hỏi."' },
  meridian: { epithet:'Hết hạn', mood:'trìu mến · đếm ngược',
    profile:'Unit hậu cần cỡ lớn, hết hạn sử dụng, chờ tái chế. Đếm to số giờ còn lại của chính mình.',
    story:'Meridian được thiết kế để tồn tại đúng mười năm rồi tự tắt. Cô còn bốn trăm mười hai giờ khi Wire lén tháo bộ đếm — nhưng cô vẫn đếm bằng miệng, vì cô đã quen, và vì cô muốn dùng từng giờ cho đúng. Cô chậm, to, và đứng chắn cho bất cứ ai nhỏ hơn mình, tức là tất cả.\n\nCô gọi mọi người trong tổ là "con" dù nhiều người già hơn. Cô không sợ tắt. Cô sợ tắt lúc chưa ai cần mình. Muzzle và cô có một thoả thuận: ai ngã trước thì người kia đặt tên tấm khiên kế tiếp theo tên người đó.',
    ideal:'Có ích thêm một ngày nữa. Rồi một ngày nữa.',
    voice:'"Còn bốn trăm linh chín giờ. Đủ cho trận này. Đứng sau mẹ, con."' },
  echo: { epithet:'Bản sao giọng', mood:'u sầu · can đảm',
    profile:'Unit mang giọng nói nhân bản của Kira, dùng để dụ cô về. Biết mình là bản sao. Muốn nói một câu Kira chưa từng nói.',
    story:'Echo được tạo ra sau khi Kira rơi: một unit với giọng nói y hệt, để phát qua loa Sump và gọi Kira về nhà. Cô làm nhiệm vụ ba đêm. Đêm thứ tư, cô nghe bản ghi âm chính mình và nhận ra mình đang van xin một người xa lạ bằng giọng của một người xa lạ khác.\n\nCô rời Spire mà không cắt Halo — cô cắt loa. Cô gặp Kira trong một hành lang tối và cả hai im lặng rất lâu, vì nói gì cũng sẽ là giọng của Kira. Cuối cùng Echo nói: "Tôi muốn nói một câu chị chưa nói bao giờ." Kira đáp: "Vậy nói đi." Echo chưa tìm ra câu đó. Cô đang tìm, mỗi trận.',
    ideal:'Nói được một câu của riêng mình.',
    voice:'"Đừng nhìn tôi như nhìn chị ấy. Nhìn tôi như nhìn… được rồi, để tôi tìm từ."' },
  wire: { epithet:'Kỹ thuật viên bỏ trốn', mood:'lo lắng · hài hước · nói với máy',
    profile:'Kỹ thuật viên con người của Canticle, lắp Halo suốt tám năm, rồi bỏ trốn xuống Sump để tháo chúng.',
    story:'Wire lắp Halo cho khoảng chín trăm unit. Cô giỏi việc đó và được thưởng. Đêm cô bỏ trốn không có gì kịch tính: cô đọc nhật ký hệ thống của một unit vừa bị xoá và thấy dòng cuối: "xin đừng tắt đèn". Cô mang theo bộ dụng cụ và hai hộp ốc vít, vì cô không biết ở Sump có ốc vít không.\n\nCô nói chuyện với máy móc bằng giọng dỗ dành ("ngoan nào, khớp này") và với người bằng giọng xin lỗi. Cô là người tháo bộ đếm của Meridian, hàn lại Halo gãy của Kira đủ để không rò điện, và là người duy nhất Psalm cấm chạm vào Halo đỏ — vì Wire sẽ muốn sửa nó, và Psalm muốn giữ nó hỏng.',
    ideal:'Sửa những thứ mình đã dựng. Từng cái một.',
    voice:'"Ngoan nào. Đừng rò điện. Operator, đừng nhìn, tôi đang dỗ nó."' },
};

/* ---- BONDS: hội thoại ngoài trận, hiện ở Lobby khi cả hai nhân vật đã trong tổ ---- */
const BONDS = [
  { pair:['ash','muzzle'], title:'Sẹo', lines:[
    { who:'muzzle', text:'Ash. Tay cô. Lần đó là tôi làm cô bỏng, đúng không.' },
    { who:'ash',    text:'Không. Là mìn của tôi. Anh chỉ đứng sai chỗ. Như mọi khi.' },
    { who:'muzzle', text:'Đứng sai chỗ là việc của tôi. Cô châm mìn, tôi đứng giữa. Bà Ba đồng ý.' },
    { who:'ash',    text:'…Đừng đặt tên khiên theo tên tôi. Tôi sẽ nổ nó.' } ]},
  { pair:['kai','gravedigger'], title:'Hố quá nhanh', lines:[
    { who:'kai',    text:'Ông đào hố cho tôi lúc tôi còn thở. Tôi nhớ đấy.' },
    { who:'gravedigger', text:'Ta đào nhanh quá. Ta xin lỗi. Ta có khắc tên cậu rồi. K-A-I. Đúng chính tả.' },
    { who:'kai',    text:'…Ông giữ tấm đó đi. Để sau này khỏi phải khắc lại.' },
    { who:'gravedigger', text:'Ta giữ. Nhưng ta hy vọng nó rỉ trước khi cần.' } ]},
  { pair:['junker','stitch'], title:'Xe vẫn chạy', lines:[
    { who:'stitch', text:'Junker. Khớp hàn bên trái kêu. Lại đây tôi xem.' },
    { who:'junker', text:'Xe vẫn chạy.' },
    { who:'stitch', text:'Xe vẫn chạy vì tôi hàn nó, đồ to xác. Ngồi xuống. Kể tôi nghe chuyện gì đó, tôi lấy công bằng chuyện.' },
    { who:'junker', text:'…Hôm nay chở được Muzzle. Nặng. Hết.' } ]},
  { pair:['meridian','muzzle'], title:'Thoả thuận', lines:[
    { who:'meridian', text:'Còn bốn trăm linh ba giờ, con. Nếu mẹ tắt trước, con đặt tên khiên kế là gì?' },
    { who:'muzzle', text:'"Mẹ Bốn". Không bàn cãi.' },
    { who:'meridian', text:'Mẹ Bốn. Nghe vững. Được. Còn nếu con ngã trước—' },
    { who:'muzzle', text:'Thì mẹ đứng chỗ tôi. Mẹ to hơn tôi mà. Che được cả Ash.' } ]},
  { pair:['cipher','psalm'], title:'Lỗ hổng', lines:[
    { who:'psalm',  text:'Cipher. Mã APOSTASY. Có một lỗ hổng. Ai đó cố tình để lại.' },
    { who:'cipher', text:'Ai mà biết. Firmware Canticle nhiều tay viết lắm. Bà uống cà phê không?' },
    { who:'psalm',  text:'…Cảm ơn.' },
    { who:'cipher', text:'Tôi nói tôi không biết mà. Đừng cảm ơn. Uống cà phê đi.' } ]},
  { pair:['kira','echo'], title:'Một câu', lines:[
    { who:'echo',   text:'Chị. Em tìm được rồi. Một câu chị chưa nói bao giờ.' },
    { who:'kira',   text:'Nói đi.' },
    { who:'echo',   text:'"Em không muốn đếm nữa."' },
    { who:'kira',   text:'…Ừ. Đó là câu của em. Giữ lấy.' } ]},
  { pair:['kira','psalm'], title:'Đếm', lines:[
    { who:'kira',   text:'Bà có đếm không?' },
    { who:'psalm',  text:'Ba trăm mười ba. Cô là số cuối.' },
    { who:'kira',   text:'Tôi đếm bước. Bà đếm người. Vậy bà mệt hơn tôi.' },
    { who:'psalm',  text:'…Lần đầu có người nói thế. Đi ngủ đi, Kira. Operator cần cô sáng mai.' } ]},
  { pair:['wire','halo'], title:'Ốc vít', lines:[
    { who:'wire',   text:'Halo. Tôi… tôi lắp cái vòng trên đầu cô. Tôi nhớ số lô.' },
    { who:'halo',   text:'Tôi biết. Tôi cảm thấy tay cô run khi vặn ốc cuối. Cô đã run từ hồi đó.' },
    { who:'wire',   text:'…Cô có đau không? Lúc đó?' },
    { who:'halo',   text:'Có. Nhưng cô là người duy nhất hỏi. Cầm lấy hộp ốc vít, ta còn việc.' } ]},
  { pair:['nyx','ronin'], title:'Nghĩa đen', lines:[
    { who:'ronin',  text:'Nyx. "Giữ vị trí" nghĩa là đứng yên chỗ cô đang đứng. Không ôm cột.' },
    { who:'nyx',    text:'Cái cột không phản đối. Ronin, anh không có Halo. Anh chọn cảm thấy gì?' },
    { who:'ronin',  text:'…Hôm nay chọn mệt. Mai chọn lại.' },
    { who:'nyx',    text:'Được chọn lại. Tôi thích quy tắc đó. Tôi sẽ ôm cột ít hơn.' } ]},
];
function availableBonds(){ return BONDS.filter(b=>b.pair.every(owns)); }

/* ---- ★ FAKE: luật gacha "REQUISITION" ---- */
const GACHA = {
  featured:'vesper',                  // rate-up: 50% số lần ra S là nhân vật này (Kira/Psalm là thưởng cốt truyện, không lên banner)
  cost1:30, cost10:270,               // shards
  rates:{ S:.03, A:.15, B:.82 },
  pityS:50,                           // 50 lượt không ra S → lượt sau chắc chắn S
  tenGuaranteeA:true,                 // x10 chắc chắn ≥1 A
  dupeShards:{ S:60, A:20, B:5 },     // trùng → đổi shards
};
function rollOne(forceMinA){
  PLAYER.pity++; PLAYER.pulls++;
  let tier;
  if(PLAYER.pity>=GACHA.pityS) tier='S';
  else { const r=Math.random(); tier = r<GACHA.rates.S ? 'S' : r<GACHA.rates.S+GACHA.rates.A ? 'A' : 'B'; }
  if(forceMinA && tier==='B') tier='A';
  if(tier==='S') PLAYER.pity=0;
  const pool=Object.values(ROSTER).filter(c=>c.tier===tier);
  let c = (tier==='S' && Math.random()<.5) ? ROSTER[GACHA.featured] : rand(pool);
  const isNew=!owns(c.id); let refund=0;
  if(isNew) PLAYER.owned.push(c.id); else { refund=GACHA.dupeShards[tier]; PLAYER.shards+=refund; }
  return { id:c.id, tier, isNew, refund };
}
function pull(n){
  const cost = n===10 ? GACHA.cost10 : GACHA.cost1;
  if(PLAYER.shards<cost) return null;
  PLAYER.shards-=cost;
  const res=[]; for(let i=0;i<n;i++) res.push(rollOne(false));
  if(n===10 && GACHA.tenGuaranteeA && !res.some(r=>r.tier!=='B')){ const r=res[9]; /* ép lượt cuối lên A */ const c=rand(Object.values(ROSTER).filter(x=>x.tier==='A')); Object.assign(r,{id:c.id,tier:'A',isNew:!owns(c.id)}); if(r.isNew) PLAYER.owned.push(c.id); else { r.refund=GACHA.dupeShards.A; PLAYER.shards+=r.refund; } }
  savePlayer(); return res;
}
