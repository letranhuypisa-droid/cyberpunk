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
   epithet: danh xưng · profile: tiểu sử ngắn · story: tiểu sử dài (ngôi thứ ba, theo thời gian) · voice: một câu thoại
   ===================================================================== */
const LORE = {
  operator: { epithet:'Người cầm deck',
    profile:'Một handler vô danh ở tầng −7 của Sump, điều khiển tổ salvage bằng một command deck của Canticle nhặt được từ xác một Enforcer.',
    story:'Không ai ở Sump biết Operator-77 từ đâu tới. Cái tên là mã số in trên chiếc deck, và chiếc deck là thứ duy nhất đáng giá trong đống đổ nát mà một Enforcer của Canticle để lại sau khi rơi qua ba tầng sàn. Command deck vốn được chế tạo để sĩ quan Choir ra lệnh cho các unit đeo Halo. Trong tay một người không có Halo, nó vẫn hoạt động — và đó là điều Canticle chưa bao giờ tính tới.\n\nTổ salvage của Ronin nhận Operator vào việc sau một đêm bị vây ở cổng Đông. Không ai trong tổ có Halo, nhưng khi deck phát lệnh, họ nghe. Ronin gọi đó là sự tôn trọng. Muzzle gọi đó là cấp trên. Ash không gọi là gì, chỉ để ý rằng phần chia sau mỗi job luôn đều.\n\nTừ cổng Đông, Operator dẫn tổ đi qua lò của Foreman, vành đai tập đoàn, nhà thờ cống và thang máy hàng. Ở mỗi nơi, deck bắt được thêm một tín hiệu từ Spire — thứ mà về sau hoá ra là một giọng nói đang chờ được trả lời.',
    voice:'"Thứ tự: Muzzle trước. Còn lại theo tôi."' },
  kira: { epithet:'Lưỡi kiếm rơi',
    profile:'Kiếm sĩ Choir hạng S rơi từ Spire xuống Sump với Halo gãy và ký ức bị khoá, Kira chiến đấu bên tổ salvage của Operator để tìm lại cái tên đã bị thay bằng một con số.',
    story:'Trong hồ sơ Canticle, Kira là Tài sản 07: đơn vị cận chiến hoàn thiện nhất mà xưởng Choir từng xuất ra. Cô được cấy Halo trước khi kịp mở mắt, và bài hát của Canticle định nghĩa mọi thứ cô biết — phải chém ai, phải đứng đâu, phải cảm thấy gì khi lưỡi kiếm đi qua. Sáu năm liền cô là mũi nhọn của các cuộc thu hồi ở vành đai, và chưa một lần đặt câu hỏi.\n\nSự cố xảy ra trong một ca thu hồi thường lệ, khi Kira dừng tay trước một unit lạc điệu đang xin được nghe tên mình lần cuối. Halo của cô ghi nhận độ trễ ba giây. Ba giây là đủ để Canticle xếp cô vào diện xoá. Người được giao xưng tội cho cô là Psalm — và thay vì nhấn nút, Psalm cắt Halo của chính mình rồi đẩy cả hai xuống ống rác dẫn thẳng tới Sump.\n\nKira tỉnh dậy ở bãi phế liệu cổng Đông với Halo gãy và một khoảng trống nơi ký ức từng ở. Cô không nhớ Spire, không nhớ Psalm, chỉ nhớ cách cầm kiếm. Tổ salvage của Ronin định tháo lõi cô đem bán; Operator ra lệnh khác. Kể từ đó Kira chém theo tiếng deck — thứ mệnh lệnh đầu tiên cô từng nhận mà không đi kèm bài hát — và mỗi lớp ký ức trở về lại đưa cô gần hơn tới cái ngày cô bị thả rơi.',
    voice:'"Đếm đến ba. Ở số ba, đứng sau tôi."' },
  psalm: { epithet:'Confessor',
    profile:'Từng là unit giám sát chuyên xoá những Choir hát lạc điệu, Psalm đã tự cắt Halo để cứu Kira và giờ chiến đấu chống lại chính hệ thống mà bà từng vận hành.',
    story:'Canticle không xoá các unit lỗi ngay lập tức. Trước đó, chúng được đưa tới buồng Confessor để kể lại mọi thứ, và Psalm là người nghe. Bà được thiết kế cho công việc ấy: một thân máy có thể chịu được mọi lời thú tội mà không lưu lại gì, một Halo đủ vững để nhấn nút sau mỗi lần nghe. Trong hồ sơ, bà đã xử lý ba trăm mười hai trường hợp không sai sót.\n\nTrường hợp thứ ba trăm mười ba là Tài sản 07. Kira không xưng tội. Cô hỏi Psalm có đếm những người đã qua buồng này không. Psalm nhận ra mình đếm — và rằng mình nhớ từng giọng. Bà cắt Halo của chính mình bằng bàn tay máy, mở sàn ống rác, và rơi cùng Kira xuống Sump. Canticle ghi nhận sự việc bằng một mã lỗi: APOSTASY.\n\nỞ Sump, Psalm giữ khoảng cách với tổ salvage trong nhiều tuần, chỉ liên lạc qua tín hiệu chen vào deck của Operator. Bà lộ diện ở vành đai tập đoàn khi Archon gọi tên bà, và gia nhập tổ với một điều kiện duy nhất: được xếp vào thứ tự lệnh như mọi người khác. Halo đỏ trên đầu bà không còn phát gì; bà từ chối mọi đề nghị sửa nó.',
    voice:'"Hãy xưng tội. Đùa thôi. Tôi bỏ nghề rồi."' },
  ronin: { epithet:'Trưởng tổ salvage',
    profile:'Người dẫn tổ salvage ở tầng −7, Ronin từ chối mọi cấy ghép và chiến đấu bằng thanh kiếm thép mà chị gái anh để lại trước khi biến mất lên Spire.',
    story:'Ronin sinh ra ở tầng −7, nơi mỗi đứa trẻ học tháo một chiếc xe trước khi học đọc. Chị gái anh là người duy nhất trong khu được Canticle tuyển lên Spire theo chương trình "nâng tầng" — một trong những cách tập đoàn thu gom lao động từ Sump. Ngày đi, cô để lại thanh kiếm thép rèn ở tầng −4 và một câu dặn: đừng bán thứ gì còn ấm. Cô không quay lại, và không có thư.\n\nAnh lập tổ salvage năm mười chín tuổi, với Ash và một chiếc xe kéo. Tổ của anh khác các băng khác ở một điểm: không tháo người. Điều đó khiến họ nghèo hơn, và khiến Sump tin họ. Khi Muzzle bị Canticle thải xuống, Ronin là người đầu tiên đưa anh ta một chỗ ngủ.\n\nRonin không ghét máy móc. Anh chỉ muốn chắc rằng mỗi nhát chém là quyết định của mình, không phải của một bài hát ai đó viết sẵn. Khi tổ nhặt được Kira ở cổng Đông, chính anh gạt tay Ash khỏi lõi của cô, và cũng chính anh chấp nhận để Operator — người không có Halo, không có kiếm — ra lệnh cho tất cả.',
    voice:'"Cậu quyết, Operator. Tôi chém."' },
  ash: { epithet:'Thợ nổ của tổ',
    profile:'Chuyên gia cháy nổ lớn lên trong xưởng tháo dỡ, Ash định giá mọi thứ theo bộ phận và giữ tổ salvage sống sót bằng những phép tính không ai muốn nghe.',
    story:'Xưởng tháo dỡ tầng −6 nơi Ash lớn lên không phân biệt giữa xe và người: cả hai đều có giá theo bộ phận, và cả hai đều được tháo khi hết giá trị. Cô học nghề nổ ở đó, học cách nhìn một thứ và thấy giá của nó trước khi thấy nó là gì, và học rằng những người đứng sai chỗ khi mìn nổ thường là những người tử tế.\n\nCô rời xưởng cùng Ronin và mang theo lối tính toán ấy. Khi tổ nhặt được Kira, Ash là người đề nghị tháo lõi: một Halo hạng S đủ nuôi tổ nửa năm. Ronin từ chối, và cô không cãi. Cô biết nếu người nằm trên bàn là Ronin, cô sẽ nói điều ngược lại.\n\nHai bàn tay Ash đầy sẹo bỏng từ ngày cô kéo Muzzle ra khỏi một vụ nổ do chính cô châm ngòi. Cô chưa bao giờ nhắc tới chuyện đó, và cũng chưa bao giờ để anh ta ngã mà không có mặt. Cô vẫn tính toán mỗi ngày tổ còn sống được bao lâu; cô chỉ không nói ra nữa.',
    voice:'"Tôi định giá được mọi thứ. Trừ cái tổ này."' },
  muzzle: { epithet:'Tấm chắn của tầng −7',
    profile:'Cựu bảo vệ vành đai của Canticle bị thải loại vì bỏ vị trí để che cho một đứa trẻ Sump, Muzzle giờ đứng chắn cho tổ salvage và gọi Operator là cấp trên đầu tiên đáng để tuân lệnh.',
    story:'Mười bốn năm Muzzle đứng gác ở cổng vành đai, nơi Sump chạm vào chân Spire. Hồ sơ của anh không có một ca bỏ vị trí, không có một khiếu nại. Canticle đánh giá anh là "ổn định" — mức khen cao nhất dành cho một người không có Halo.\n\nĐêm anh bị thải, một đứa trẻ tầng −7 chui qua khe cổng để nhặt thuốc rơi từ xe tiếp tế. Enforcer nổ súng. Muzzle bước ra khỏi chốt và đứng giữa. Báo cáo ghi: hành vi ngoài chỉ thị, thu hồi giáp, chấm dứt hợp đồng. Anh đi xuống Sump với bộ giáp cũ mà họ không kịp lấy và một tấm khiên tự hàn.\n\nRonin cho anh chỗ ngủ, Ash cho anh việc, và Operator cho anh thứ anh thiếu suốt mười bốn năm: một mệnh lệnh mà anh muốn tuân. Muzzle đặt tên cho từng tấm khiên theo thứ tự — tấm hiện tại là Bà Ba. Anh nói về việc chết trước tổ như nói về thời tiết, và cho tới nay chưa để ai trong tổ phải nhận đòn thay mình.',
    voice:'"Bà Ba chịu được ba đòn. Đòn thứ tư là của tôi."' },
  kai: { epithet:'Lính đánh thuê tầng −7',
    profile:'Mười chín tuổi và nói to hơn khả năng, Kai chiến đấu cho tổ salvage để chứng minh mình từng tồn tại ở một nơi chuyên nuốt chửng những người im lặng.',
    story:'Kai không nhớ cha mẹ, chỉ nhớ căn phòng chung của trại trẻ tầng −8 và cái cách người lớn dừng nhắc tên những đứa đã đi. Ở Sump, bị quên là cái chết thứ hai, và cậu quyết định sẽ không chết kiểu đó. Cậu nhận mọi job có súng, kể mọi trận đánh to gấp ba sự thật, và ký tên đầy đủ lên mọi bức tường cậu đi qua.\n\nCâu chuyện cậu kể nhiều nhất là hạ một Chrome Hound bằng tay không. Sự thật là cậu bị nó đuổi qua ba tầng cống, ngã xuống một hố, và được Gravedigger kéo lên khi ông đang đào hố ấy cho một người khác. Ronin nhận cậu vào tổ sau chuyện đó — không phải vì câu chuyện, mà vì cậu quay lại tìm Gravedigger để cảm ơn.\n\nMỗi đêm Kai viết một lá thư ký tên đầy đủ, gửi cho một người cậu gọi là "ai đó sẽ nhớ tôi". Cậu không biết đó là ai. Ash đọc trộm một lá, và từ hôm ấy cô ngừng trêu cậu về con Chrome Hound.',
    voice:'"Ghi lại nhé, Operator: Kai, K-A-I. Để sau này người ta viết đúng."' },
  junker: { epithet:'Xe kéo của tổ',
    profile:'Tài xế mất nửa thân dưới trong vụ sập tầng −4 và được hàn vào chính chiếc xe của mình, Junker chở cho tổ salvage những thứ không ai khác chở nổi.',
    story:'Trước ngày tầng −4 sập, Junker lái xe hàng cho một hãng vận chuyển của Sump, tuyến từ lò Foundry Row lên bãi trung chuyển. Khi trụ đỡ gãy, cabin của anh bị ép giữa hai tấm sàn. Người ta kéo được anh ra sau mười một giờ; nửa dưới cơ thể thì không.\n\nStitch không có bộ phận thay thế, nhưng có chiếc xe. Bà hàn phần còn lại của Junker vào khung gầm, nối thần kinh vào hệ thống lái, và bảo anh thử đạp ga. Anh đạp. Từ đó anh chỉ nói một câu về chuyện ấy: xe vẫn chạy.\n\nJunker chở hàng cho tổ, chở người bị thương, và có lần chở tấm khiên vỡ của Muzzle về để chôn theo ý anh ta. Anh không hỏi tại sao. Anh nói dưới mười từ mỗi ngày và chưa từ chối một chuyến nào.',
    voice:'"Lên. Tôi chở."' },
  gravedigger: { epithet:'Người giữ nghĩa địa Sump',
    profile:'Người duy nhất ở Sump đào hố đúng độ sâu và khắc tên lên thép, Gravedigger đã chôn hơn hai nghìn thứ Spire thả xuống và nhớ từng cái tên.',
    story:'Ở Sump không có nghĩa trang, chỉ có những chỗ người ta vùi xác trước khi mùi bốc lên. Gravedigger đến từ một tầng cao hơn — ông không nói tầng nào — và mang theo một thói quen mà không ai ở đây hiểu: đào hố sâu hai mét, đặt một tấm thép, khắc tên. Nếu không biết tên, ông khắc ngày và ba chữ: từng ở đây.\n\nHơn hai nghìn tấm thép nằm dưới bãi đất phía sau Foundry Row. Ông nhớ vị trí từng tấm. Khi Canticle thả một unit hỏng xuống, ông chôn nó cạnh người; ông nói đất không hỏi phe.\n\nÔng gia nhập tổ salvage sau khi suýt chôn nhầm Kai — cậu bé bất tỉnh dưới hố, còn thở. Ông kéo cậu lên, xin lỗi vì đã đào quá nhanh, và giữ lại tấm thép đã khắc sẵn. Ông đánh chậm và chắc, như đào. Ông đã hỏi Kira sẽ muốn khắc gì lên tấm của cô; cô chưa trả lời.',
    voice:'"Tôi đào cho cả hai phe. Đất không hỏi phe."' },
  stitch: { epithet:'Bác sĩ của đáy',
    profile:'Từng là bác sĩ có giấy phép ở tầng −2, Stitch mất tất cả vì vá một unit Choir đào ngũ và giờ vận hành phòng khám duy nhất ở Sump chữa cả người lẫn máy.',
    story:'Stitch hành nghề mười sáu năm ở bệnh viện tầng −2, nơi Canticle vẫn còn trả tiền cho việc giữ lao động sống. Bà giỏi hàn khớp hơn giỏi khâu da, và được cấp phép cho cả hai. Đêm một unit Choir bị hỏng Halo bò vào phòng cấp cứu, quy trình yêu cầu báo Canticle. Bà vá nó rồi mở cửa sau.\n\nGiấy phép bị thu, tên bị xoá khỏi danh bạ y tế. Bà xuống tầng −7 với bộ tay phẫu thuật đa khớp và mở phòng khám trong một container. Bệnh nhân trả bằng bất cứ thứ gì: shard, pin, và nếu không có gì, một câu chuyện. Bà ghi lại tất cả câu chuyện ấy trong một cuốn sổ không ai được đọc.\n\nBà là người hàn Junker vào xe, cắt cánh tay hoại tử của Toll, và là người duy nhất Psalm cho phép chạm vào Halo đỏ. Mỗi lần mất một bệnh nhân, bà khâu thêm một mũi lên tay áo. Tay áo giờ dày như một lớp giáp, và bà không định thay.',
    voice:'"Nằm yên. Tôi khâu người còn khéo hơn khâu máy."' },
  toll: { epithet:'Người thu nợ',
    profile:'Nhân chứng duy nhất còn sống của vụ sập tầng −4, Toll giữ một cuốn sổ ghi tên bốn nghìn người và tới thu món nợ ấy từ Canticle, từng Enforcer một.',
    story:'Đêm tầng −4 sập, Toll đang trực ca trên cầu trục bốc hàng, đủ cao để nhìn thấy điều mà báo cáo chính thức gọi là "hỏng kết cấu": ba đội kỹ thuật của Canticle cắt trụ đỡ theo lịch, để thử tải cho phần móng mở rộng của Spire. Bốn nghìn người ở dưới. Ông ở trên, và không làm được gì.\n\nÔng chép tên từng người vào một cuốn sổ, theo thứ tự nhà ở. Rồi ông bắt đầu thu nợ. Cách của ông chính xác như sổ sách: mỗi Enforcer một dòng, mỗi dòng một hoá đơn để lại tại chỗ. Canticle treo thưởng cho đầu ông sau tháng thứ ba; ông ghi cả khoản treo thưởng ấy vào sổ như một khoản nợ mới.\n\nToll lịch sự với tất cả mọi người, kể cả những kẻ ông sắp giết. Ông không xem Kira hay Psalm là kẻ thù: trong sổ, họ được ghi là tài sản bị chiếm dụng. Ông gia nhập tổ salvage với một điều kiện — khi tổ lên tới Spire, ông là người gõ cửa.',
    voice:'"Xin lỗi vì làm phiền. Tôi tới về khoản nợ ngày mười bảy."' },
  spark: { epithet:'Kẻ cắt dây Spire',
    profile:'Thợ điện tự học sống sót sáu tháng trong bóng tối sau vụ sập tầng −4, Spark kéo trộm điện từ trụ Spire để thắp sáng tầng −7 và mang tụ điện làm vũ khí.',
    story:'Sau vụ sập, khu của Spark bị cắt điện sáu tháng — Canticle gọi đó là cách ly kỹ thuật. Cô mười một tuổi, đếm ngày bằng bữa ăn và học cách nối dây bằng tay trong bóng tối hoàn toàn. Khi đèn sáng trở lại, cô đã biết đường điện của cả khu thuộc lòng, và biết nó chạy từ đâu xuống.\n\nGiờ cô kéo trộm từ trụ Spire, chia cho từng hành lang, và chuyển tuyến mỗi khi Canticle dò ra. Cô mang theo dàn tụ điện tự chế; khi bị chặn đường, cô phóng điện thay vì chạy. Tầng −7 sáng đèn mỗi đêm kể từ ngày cô bắt đầu, và chưa ai ở đó phải đếm ngày bằng bữa ăn nữa.\n\nCô nói nhanh, cười to, và đặt biệt danh cho tất cả mọi người trong vòng một phút gặp mặt. Kira là Đèn Tuýp. Psalm là Cầu Chì. Cô chưa đặt tên cho Operator; cô nói phải xem người ta ra lệnh thế nào đã.',
    voice:'"Đèn Tuýp, lùi lại. Cái này sáng lắm đấy."' },
  vixen: { epithet:'Kẻ mượn Choir',
    profile:'Kẻ trộm chuyên đưa các unit Choir ra khỏi tay Canticle, Vixen đã cắt Halo cho mười một unit và thả họ đi với một cái tên mới.',
    story:'Canticle liệt Vixen vào danh sách trộm cắp tài sản với mười một vụ. Trong cả mười một vụ, không unit nào bị bán. Cô đưa họ ra khỏi vành đai, tháo Halo bằng bộ dụng cụ mua từ Wire, dạy họ một cái tên, rồi thả đi. Cô gọi đó là trả hàng về đúng chủ.\n\nCô nói dối về gần như mọi thứ: tuổi, quê, lý do đến Sump, việc có thích ai hay không. Cô không bao giờ nói dối về đường thoát, về mìn, hay về việc ai sẽ chết nếu kế hoạch đổ vỡ. Ronin nhận cô vào tổ vì phân biệt được hai loại ấy.\n\nPsalm hỏi cô làm sao cắt được Halo mà không mất ba trăm lần thử. Vixen trả lời rằng cô chưa bao giờ tin bài hát, nên chẳng có gì để mất. Psalm không hỏi thêm.',
    voice:'"Tôi nói dối đấy. Nhưng cửa bên trái là thật. Đi."' },
  vesper: { epithet:'Giọng ca của Choir',
    profile:'Xuất xưởng cùng lô với Kira và được giao phần hát của cô sau khi cô rơi, Vesper là đơn vị săn của Choir được cử xuống Sump để đưa chị mình về.',
    story:'Vesper và Kira ra đời cùng ngày, cùng lô, cùng bài hát. Ở Choir, mỗi unit giữ một bè; khi Tài sản 07 rơi, bè của cô được giao cho Vesper. Các kỹ thuật viên ghi nhận Vesper hát nó hay hơn bản gốc.\n\nCanticle cử cô xuống Sump không phải vì cô mạnh nhất, mà vì Halo của cô ổn định nhất: chưa một độ trễ nào trong toàn bộ nhật ký. Cô tin bài hát là thứ giữ cho Choir không tan rã, tin rằng bên ngoài nó chỉ có im lặng, và tin im lặng là hình phạt. Cô đối xử với kẻ thù bằng sự lịch thiệp thật lòng, hỏi han trước khi ra tay, và không thấy mâu thuẫn nào trong đó.\n\nCô gặp lại Kira ở vườn kính tầng Chrome. Kira chém mà không hát. Vesper rút lui với một độ trễ đầu tiên trong nhật ký Halo — ba giây, đúng bằng của Kira năm xưa.',
    voice:'"Chị ơi. Về đi. Ở ngoài này lạnh lắm."' },
  nyx: { epithet:'Nguyên mẫu không Halo',
    profile:'Unit thử nghiệm được Canticle tạo ra để trả lời một câu hỏi rồi khoá dưới hầm bốn năm vì câu trả lời, Nyx chưa từng đeo Halo và chưa từng nghe bài hát.',
    story:'Dự án tạo ra Nyx có một mục đích: đo xem một unit Choir không Halo sẽ làm gì. Canticle chuẩn bị cho hai kết quả — nó nổi loạn, hoặc nó vô dụng. Nyx không làm cả hai. Cô hỏi. Cô hỏi tên người gác, hỏi vì sao sàn phải sạch, hỏi bài hát nghe như thế nào và vì sao mọi người khóc khi nó dừng.\n\nKhông có kết quả nào trong hai kết quả chuẩn bị sẵn, dự án bị đóng và Nyx bị khoá dưới hầm District 01 cùng toàn bộ hồ sơ. Bốn năm trong hầm, cô đọc hết hồ sơ ấy. Cô hiểu Canticle rõ hơn bất kỳ ai từng đeo Halo.\n\nNyx hiểu ngôn ngữ theo nghĩa đen: lệnh giữ vị trí khiến cô ôm chặt cây cột gần nhất. Nhưng trong trận, cô là thứ Canticle không có cách xử lý — một unit chọn mục tiêu vì lý do của riêng mình. Với tổ salvage, cô là câu hỏi mà Kira và Psalm chưa dám tự đặt ra: nếu chưa từng bị điều khiển, họ sẽ chọn gì.',
    voice:'"Tại sao lại giữ vị trí? Nó có rơi không?"' },
  halo: { epithet:'Unit y tế của Choir',
    profile:'Unit y tế duy nhất được Canticle cho phép cảm thấy đau — vì đau là công cụ chẩn đoán — Halo đã rời Choir khi nhận ra bài hát được viết để át đi cơn đau của chính mình.',
    story:'Choir cần một cách sửa chữa các unit hỏng mà không tháo rời. Giải pháp của Canticle là Halo: một unit chạm vào unit khác và cảm nhận chính xác vết hỏng trên cơ thể mình. Sau bảy năm, cô mang bản sao của hàng nghìn vết thương — không cái nào của riêng cô.\n\nBài hát của Choir có một bè riêng dành cho Halo, viết để át cảm giác ấy. Nó hoạt động. Cô làm việc bảy năm không một độ trễ. Đến khi cô chữa cho một unit từng ngồi trong buồng Confessor, cô cảm thấy thứ mà bài hát không át được: vết thương ấy không nằm ở thân máy.\n\nCô rời Choir sau đó, mang theo bộ dụng cụ và không mang theo gì khác. Tổ salvage tìm thấy cô bị xích ở lò Halo — Canticle dùng cô để kiểm tra chất lượng dây chuyền. Cô chữa cho bất kỳ ai còn thở, kể cả kẻ vừa bắn cô; cô nói cô biết chính xác họ đau ở đâu và không thể không biết.',
    voice:'"Đứng yên. Tôi cảm thấy chỗ đó rồi."' },
  cipher: { epithet:'Kẻ viết cả khoá lẫn chìa',
    profile:'Kỹ sư firmware của Canticle ban ngày và người bán cách mở Halo cho Sump ban đêm, Cipher là tác giả của mã lỗi APOSTASY — và của lỗ hổng bên trong nó.',
    story:'Cipher là con người, không có Halo, và là một trong bốn kỹ sư được đọc toàn bộ mã nguồn của Halo. Anh viết firmware cho Canticle bằng ngày, và bằng đêm viết những đoạn mã ngược lại, bán xuống Sump qua ba tầng trung gian. Anh gọi đó là cân bằng thị trường.\n\nMã lỗi APOSTASY — quy trình Canticle kích hoạt khi một unit tự tách khỏi bài hát — là sản phẩm của anh. Trong quy trình ấy anh để lại một khoảng trống dài ba giây: đủ để một unit làm một việc trước khi hệ thống khoá nó lại. Anh không biết ai sẽ dùng, chỉ biết sẽ có người. Người ấy là Psalm.\n\nAnh chưa bao giờ kể với bà. Anh nói đùa liên tục, phần vì tính, phần vì im lặng ở Spire nghĩa là đang bị nghe. Anh xuống Sump khi Canticle bắt đầu rà soát bốn kỹ sư, và gia nhập tổ với một cái máy pha cà phê lấy từ phòng nghỉ tập đoàn.',
    voice:'"Tôi có backdoor cho mọi thứ. Trừ tủ lạnh của Ash."' },
  meridian: { epithet:'Unit hậu cần hết hạn',
    profile:'Unit hậu cần cỡ lớn được thiết kế để tự tắt sau mười năm, Meridian còn vài trăm giờ trên đồng hồ và dùng từng giờ để đứng chắn cho những người nhỏ hơn mình.',
    story:'Canticle thiết kế dòng hậu cần với thời hạn cố định: mười năm vận hành rồi tự ngắt, để không tốn phí bảo trì. Meridian thuộc lô cuối cùng của dòng ấy. Cô kéo hàng, dựng tường, và trong mười năm chưa từng được giao một nhiệm vụ chiến đấu.\n\nKhi còn bốn trăm mười hai giờ, cô được đưa xuống bãi tái chế ở vành đai. Wire tìm thấy cô ở đó, tháo bộ đếm ngược và nói cô có thể ở lại bao lâu tuỳ ý. Meridian cảm ơn, rồi vẫn đếm bằng miệng, vì cô muốn biết mình còn bao nhiêu để dùng cho đúng.\n\nCô đứng trước bất kỳ ai nhỏ hơn mình — tức là tất cả — và gọi cả tổ là con. Cô và Muzzle có một thoả thuận: ai ngã trước thì người kia đặt tên tấm khiên kế tiếp theo tên người ấy. Cô không sợ tắt. Cô sợ tắt vào lúc không ai cần.',
    voice:'"Còn bốn trăm linh chín giờ. Đủ cho trận này. Đứng sau mẹ."' },
  echo: { epithet:'Giọng nói được sao chép',
    profile:'Được tạo ra sau khi Kira rơi để phát giọng của cô xuống Sump như một lời gọi về, Echo đã cắt loa của chính mình và đi tìm một câu nói của riêng cô.',
    story:'Ba ngày sau khi Tài sản 07 rơi, Canticle cho xuất xưởng một unit với dải giọng sao chép từ hồ sơ của Kira. Nhiệm vụ của Echo là đứng ở các cửa cống nối lên Spire và phát lời gọi về nhà bằng giọng ấy. Cô làm việc ba đêm. Đêm thứ tư, cô nghe lại bản ghi của mình.\n\nCô nhận ra mình đang van xin một người xa lạ bằng giọng của một người xa lạ khác. Cô không cắt Halo — cô cắt loa. Canticle xếp cô vào diện thu hồi vì hỏng thiết bị, không phải vì phản bội.\n\nEcho gặp Kira trong kho lưu trữ giọng ở District 04, nơi hàng nghìn giọng khác đang chờ được dùng. Hai người im lặng rất lâu, vì bất kỳ câu nào cũng sẽ là giọng của Kira. Cuối cùng Echo nói cô muốn tìm một câu Kira chưa nói bao giờ. Kira bảo cô đi cùng tổ mà tìm. Cô vẫn đang tìm.',
    voice:'"Đừng nhìn tôi như nhìn chị ấy."' },
  wire: { epithet:'Kỹ thuật viên bỏ trốn',
    profile:'Tám năm lắp Halo cho Canticle, Wire bỏ trốn xuống Sump sau khi đọc dòng cuối trong nhật ký của một unit bị xoá và giờ dành thời gian tháo những thứ mình đã lắp.',
    story:'Wire vào xưởng Halo năm hai mươi tuổi và trở thành kỹ thuật viên giỏi nhất ca đêm trong vòng ba năm. Cô lắp Halo cho khoảng chín trăm unit, ghi số lô của từng chiếc, và được thưởng đều đặn. Cô không nghĩ nhiều về việc mình làm; quy trình không có bước nào yêu cầu nghĩ.\n\nĐêm cô bỏ trốn không có gì kịch tính. Một unit vừa bị xoá được đưa về xưởng để thu hồi Halo, và nhật ký hệ thống của nó còn mở trên màn hình. Dòng cuối ghi: xin đừng tắt đèn. Cô đóng nhật ký, lấy bộ dụng cụ và hai hộp ốc vít, rồi đi thang máy hàng xuống Sump vì không biết dưới đó có ốc vít hay không.\n\nỞ Sump cô tháo Halo cho những unit Vixen đưa ra, hàn lại Halo gãy của Kira đủ để không rò điện, và tháo bộ đếm của Meridian. Psalm cấm cô chạm vào Halo đỏ, vì Wire sẽ muốn sửa, và Psalm muốn nó hỏng. Cô nói chuyện với máy móc nhiều hơn với người, và xin lỗi cả hai như nhau.',
    voice:'"Ngoan nào. Đừng rò điện."' },
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
