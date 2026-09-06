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
           sprites:{ idle:['ronin_idle.png'], attack:['ronin_attack.png'] },
           ultVideo:['ronin_ult.mp4'],
           portrait:['ronin_portrait.png','RONIN.png'], pos:'50% 8%' },
  ash:   { id:'ash',   name:'ASH',   faction:'rust', tier:'A', atk:120, hp:1000, energyMax:75,    // ★ FAKE: cost + chiêu cuối
           ult:{ name:'FLASHOVER', cost:75, kind:'aoe', mult:1.5, desc:'150% ATK lên toàn bộ kẻ địch. (★ FAKE)' },
           sprites:{ idle:['ash_idle.png'], attack:['ash_attack.png'] },
           ultVideo:['ash_ult.mp4'],
           portrait:['ash_portrait.png','ASH.png'], pos:'50% 8%' },
  muzzle:{ id:'muzzle',name:'MUZZLE',faction:'rust', tier:'B', atk:70,  hp:1750, energyMax:125,   // ★ FAKE: cost + chiêu cuối
           ult:{ name:'FIELD PATCH', cost:125, kind:'heal', mult:1.2, desc:'Hồi 120% ATK cho toàn đội. (★ FAKE)' },
           sprites:{ idle:['muzzle_idle.png'], attack:['muzzle_attack.png'] },
           ultVideo:['muzzle_ult.mp4'],
           portrait:['muzzle_portrait.png','MUZZLE.png'], pos:'50% 8%' },
  // ---- ★ FAKE toàn bộ: chưa có spec, chỉ để đủ roster 9 ----
  echo:  { id:'echo',  name:'ECHO',  faction:'chrome', tier:'A', atk:105, hp:1000, energyMax:100, ult:{name:'RESONANCE',cost:100,kind:'nuke',mult:2.5,desc:'★ FAKE'}, sprites:{idle:['echo_idle.png'],attack:['echo_attack.png']}, ultVideo:['echo_ult.mp4'], portrait:['echo_portrait.png','ECHO.png'], pos:'50% 8%' },
  wire:  { id:'wire',  name:'WIRE',  faction:'chrome', tier:'B', atk:80,  hp:1500, energyMax:75,  ult:{name:'OVERCLOCK',cost:75,kind:'nuke',mult:2.2,desc:'★ FAKE'}, sprites:{idle:['wire_idle.png'],attack:['wire_attack.png']}, ultVideo:['wire_ult.mp4'], portrait:['wire_portrait.png','WIRE.png'], pos:'50% 8%' },
  stitch:{ id:'stitch',name:'STITCH',faction:'rust',   tier:'S', atk:140, hp:900,  energyMax:100, ult:{name:'SUTURE',cost:100,kind:'heal',mult:1.5,desc:'★ FAKE'}, sprites:{idle:['stitch_idle.png'],attack:['stitch_attack.png']}, ultVideo:['stitch_ult.mp4'], portrait:['stitch_portrait.png','STITCH.png'], pos:'50% 8%' },
  kai:   { id:'kai',   name:'KAI',   faction:'rust',   tier:'B', atk:95,  hp:1200, energyMax:100, ult:{name:'RIPCORD',cost:100,kind:'nuke',mult:2.4,desc:'★ FAKE'}, sprites:{idle:['kai_idle.png'],attack:['kai_attack.png']}, ultVideo:['kai_ult.mp4'], portrait:['kai_portrait.png','Kai.png'], pos:'50% 8%' },
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
  /* ===== CHƯƠNG 1 · CHROMEFALL — Free Zone, tầng âm bảy ===== */
  '07-A': {
    intro:[
      { who:null,     text:'Cổng Đông, hai giờ sáng. Mưa axit vừa tạnh. Có thứ gì đó rơi từ Spire xuống bãi xe hỏng, cắm sâu vào đống phế liệu. Deck của bạn rung lên. Nó vẫn còn ấm.' },
      { who:'ronin',  text:'Operator, lại đây xem. Không phải xác xe. Vỏ Choir. Hạng S. Nó còn thở.' },
      { who:'ash',    text:'Tháo lõi, bán, chia đôi. The Corp sẽ lùng cái vòng Halo này trước sáng mai, tôi không muốn có mặt ở đây lúc đó.' },
      { who:'kira',   text:'Ơ… Halo đâu rồi? Bài ca đâu rồi? Yên tĩnh quá. Này, ai đang cầm cái deck kia thế? Bấm thử đi. Xem tôi có nghe không.' },
      { who:'psalm', as:'TÍN HIỆU LẠ', text:'Operator. Đừng để họ tháo con bé. Đưa cho nó thanh kiếm cắm cạnh đó, rồi bấm lệnh. Phần còn lại nó tự lo.' },
      { who:'muzzle', text:'Tín hiệu lạ chen vào deck. Và tụi Scav ngửi thấy mùi sắt mới rồi, cả đàn đang tới. Operator, đây là tổ của cậu. Cho tôi thứ tự.' },
    ],
    outro:[
      { who:'ronin',  text:'Nó chém như máy. Dĩ nhiên rồi, nó là máy mà.' },
      { who:'kira',   text:'Sai. Tôi chém theo cái deck. Người cầm deck ra lệnh mà không hát. Lần đầu tiên đấy. Tôi thích. Tôi thích lắm.' },
      { who:'ash',    text:'Thôi xong. Hết bán được rồi. Ronin, nhìn mặt anh kìa, y như hồi nhặt được Muzzle.' },
      { who:'kira',   text:'Vòng Halo gãy rồi, ký ức cũng khoá theo. Nhưng tôi nhớ một thứ: The Corp nợ tôi hai mạng. Operator, cho tôi đi cùng. Đi tới khi nào trả xong nợ.' },
      { who:null,     text:'KIRA gia nhập tổ. Hồ sơ của cô mở ở ARCHIVE. Tín hiệu lạ im bặt, nhưng đèn báo trên deck vẫn nhấp nháy.' },
    ]},
  '07-B': {
    intro:[
      { who:null,      text:'Lò Foundry Row. Ngày xưa là lò đúc của The Corp, giờ là sào huyệt của băng Foreman. Kira cần lửa đủ nóng để nạy cái vòng Halo gãy. Lửa ở đây, và lửa có chủ.' },
      { who:'foreman', text:'Operator-77. Ta biết cái deck đó. Ta biết mày moi nó ở đâu ra. Chrome rơi xuống đáy vẫn là chrome. Ta nấu chảy nó, rồi nấu luôn mày.' },
      { who:'muzzle',  text:'Lão có ba tổ. Muốn qua lò thì phải qua cả ba. Cậu ra lệnh, tôi đứng trước.' },
      { who:'kira',    text:'Ba tổ? Hop, skip, jump. Vừa đủ ba bước. Operator, đếm giúp tôi nhé.' },
    ],
    outro:[
      { who:'foreman', text:'…Lò là của tụi bay. Nhưng lửa này sẽ gọi Spire xuống. Tụi bay vừa châm đèn cho The Corp thấy đường.' },
      { who:'psalm', as:'TÍN HIỆU LẠ', text:'Gọi rồi. Choir đang hát trong mạng, chúng biết con bé ở Free Zone. Và chúng biết cái deck của cậu, Operator.' },
      { who:'kira',    text:'Halo mở được một chút. Tôi nhớ một cái tên: CANTOR. Và một giọng nói đã thả tôi rơi. Giọng đang chen trong deck của bạn đấy. Vui không? Tôi thấy vui.' },
    ]},
  '07-C': {
    intro:[
      { who:null,     text:'Hàng rào tập đoàn. Chỗ đáy thành phố chạm vào chân Spire. Cổng kính, sàn sạch, drone lượn. Và giữa cổng có một bóng người đứng chờ, vai máy, lõi đỏ.' },
      { who:'archon', text:'ĐƠN VỊ PSALM. MÃ APOSTASY GHI NHẬN. TRỞ VỀ HOẶC BỊ THU HỒI. OPERATOR-77: DECK ĐÁNH CẮP. GIAO NỘP.' },
      { who:'psalm',  text:'Tín hiệu lạ là tôi. Tôi thả Kira rơi để cứu nó, rồi tự cắt vòng của mình. Operator, tôi không xin lỗi. Tôi xin một chỗ trong thứ tự lệnh.' },
      { who:'ronin',  text:'Cậu quyết đi, Operator. Nhưng quyết nhanh. Tụi nó đông, mà tụi nó không biết đánh trong bẩn.' },
    ],
    outro:[
      { who:'ash',    text:'Archon tắt rồi. Hàng rào thủng một lỗ to bằng cái xe.' },
      { who:'kira',   text:'Nó gọi tôi là Tài sản 07. Tôi từng có số thay tên. Còn bà… bà là người thả tôi xuống hố.' },
      { who:'psalm',  text:'Ừ. Ở dưới này người ta gọi cô bằng tên. Còn tôi sẽ trả lời mọi câu hỏi, sau khi ra khỏi đây.' },
      { who:null,     text:'PSALM gia nhập tổ. Muzzle nhìn xuống nắp cống: "Dưới kia đang hát. Tụi cuồng đạo. Operator, cậu vừa có thêm một người để ra lệnh."' },
    ]},
  '07-D': {
    intro:[
      { who:null,         text:'Nhà thờ dưới cống. Ống nước hàn thành phong cầm, xác chrome xếp thành bàn thờ, nến đỏ cháy khắp nơi. Giáo phái Mother Rust thờ chrome rơi. Và họ vừa thấy một thiên thần bước vào.' },
      { who:'motherrust', text:'Thiên thần rơi. Ngươi thuộc về bàn thờ, không thuộc về lũ nhặt sắt. Hãy để ta tháo từng mảnh, thánh hoá từng mảnh.' },
      { who:'kira',       text:'Tháo tôi? Ha. Bà xếp hàng sau The Corp nhé, họ đăng ký trước rồi. Operator, bà này nói nhiều. Cho tôi nhảy trước được không?' },
      { who:'ronin',      text:'Nhớ câu đó khi chém, Kira. Không thuộc về ai cả.' },
    ],
    outro:[
      { who:'motherrust', text:'…Ngươi từ chối được cứu rỗi. Vậy hãy leo lên. Spire đang chờ. Cantor đang chờ.' },
      { who:'psalm',      text:'Bà ta nói đúng một điều. Cantor ở thang máy hàng. Ông ta xuống tận đây để đón chúng ta.' },
      { who:'kira',       text:'Vậy thì lên. Hop, skip, jump. Bước thứ ba là ông ta.' },
    ]},
  '07-E': {
    intro:[
      { who:null,     text:'Thang máy hàng số 3. Nửa đường giữa đáy và đỉnh. Cửa mở ra từng tầng, mỗi tầng một hàng Choir đứng chờ. Bốn tầng. Trên cùng là một ông già đội vòng Halo sáng như đèn pha.' },
      { who:'cantor', text:'Psalm. Kira. Các con hát lạc điệu. Ta xuống đây để chỉnh lại. Và Operator, ta muốn xem cái deck đó chạy ra sao trong tay một kẻ không Halo.' },
      { who:'psalm',  text:'Ông chỉnh bằng cách xoá. Tôi nhớ cách ông chỉnh.' },
      { who:'kira',   text:'Halo mở hết rồi. Tôi nhớ cả rồi. Bố. Mẹ. Cái ngày ông thả tôi xuống hố. Cantor, ông biết trẻ con ở Free Zone gọi tôi là gì không? Ác ma bé bỏng đấy. Chào ông.' },
      { who:'muzzle', text:'Bốn wave, Operator. Trận dài nhất từ trước tới giờ. Cậu đưa tụi tôi tới đây, đưa tụi tôi lên nốt.' },
    ],
    outro:[
      { who:'cantor', text:'…Chromefall. Đó là tên chúng ta đặt cho các con. Rơi xuống đáy. Nhưng có lẽ… nó là tên của chính chúng ta.' },
      { who:'kira',   text:'Thang máy vẫn chạy. Lên hay xuống? Tôi bỏ phiếu lên. Trên đó còn nhiều người nợ tôi lắm.' },
      { who:'ronin',  text:'Lên. Đáy hết chỗ để rơi rồi. Operator, cậu đi đầu.' },
      { who:null,     text:'HẾT CHƯƠNG 1. Thang máy tiếp tục lên. Chương 2 · SPIRE.' },
    ]},

  /* ===== CHƯƠNG 2 · SPIRE — tầng Chrome. Sạch, sáng, và mọi thứ nhìn thấy bạn ===== */
  '04-A': {
    intro:[
      { who:null,     text:'District 04. Cửa thang mở ra một sảnh trắng không bóng. Loa trần chào bằng giọng ngọt như đường: "Hàng trả về, mời xếp hàng." Deck của bạn rít lên.' },
      { who:'muzzle', text:'Chúng tưởng tụi mình là hàng trả về. Operator, tôi xếp đầu hàng nhé.' },
      { who:'psalm',  text:'Lính ở đây dùng HALO LINK. Còn một đứa hát là cả bọn hồi máu. Giết đúng thứ tự, Operator. Đừng đánh dàn đều.' },
      { who:'kira',   text:'Sảnh này tôi nhớ. Tôi từng đứng gác góc kia. Ba nghìn bốn trăm bước tới buồng sạc. Giờ đếm lại từ đầu nhé: một…' },
    ],
    outro:[
      { who:'ash',    text:'Sàn sạch quá. Nhìn thấy cả mặt mình. Ghét.' },
      { who:'ronin',  text:'Enforcer Prime tắt rồi. Nhưng trước khi tắt nó gọi được ai đó. Giọng nữ. Đang hát.' },
      { who:'kira',   text:'…Vesper. Cùng lô với tôi. Con bé hát phần của tôi. Hát hay hơn tôi nữa.' },
    ]},
  '04-B': {
    intro:[
      { who:null,      text:'Vườn kính. Cây thật, mưa giả, nước rơi đều như máy. Một unit Choir đứng giữa lối đi, hát nhỏ. Cô ta nhìn thẳng vào Kira.' },
      { who:'vesper_b',text:'Chị ơi. Về đi. Ngoài này lạnh lắm, chị không thấy à? Và Operator, cảm ơn đã đưa chị tôi lên tận đây. Tôi sẽ nhẹ tay với anh.' },
      { who:'kira',    text:'Không lạnh. Tôi đếm. Và tôi không về. Em nhẹ tay với ai thì tuỳ, nhưng chị thì không.' },
      { who:'vesper_b',text:'Vậy em xin lỗi trước. Em hỏi thăm trước khi chém, em có nghĩa vậy thật.' },
    ],
    outro:[
      { who:'vesper_b',text:'…Chị chém mà không hát. Sao chị làm được?' },
      { who:'kira',    text:'Có người ra lệnh cho chị mà không hát. Em thử nghe xem. Deck của Operator vẫn mở đấy.' },
      { who:'vesper_b',text:'Em không dám. Chưa. Em rút. Đừng theo em.' },
      { who:null,      text:'Vesper rút lui. Vòng Halo của cô chớp một nhịp lạc, deck của bạn ghi lại. (Vesper có thể được tuyển qua REQUISITION.)' },
    ]},
  '04-C': {
    intro:[
      { who:null,     text:'Kho lưu giọng của Choir. Hàng nghìn buồng kính, mỗi buồng một giọng nói cất giữ. Một trong số đó là giọng của Kira. Và nó đang gọi bạn.' },
      { who:'echo_b', text:'Operator. Đưa chị ấy về nhà. Em là giọng của chị ấy. Em biết chị ấy muốn gì.' },
      { who:'kira',   text:'…Giọng tôi. Nhưng tôi chưa bao giờ nói câu đó. Này em, ai dạy em nói năng kiểu đó? Chán lắm.' },
      { who:'psalm',  text:'Bản sao giọng. The Corp làm nó sau khi cô rơi. Operator, nó là boss của trận này. Nhưng đừng để tổ thù nó.' },
    ],
    outro:[
      { who:'echo_b', text:'Em nghe lại băng của mình rồi. Em đang van xin một người xa lạ bằng giọng của một người xa lạ khác.' },
      { who:'kira',   text:'Vậy bỏ giọng chị đi. Nói một câu chị chưa nói bao giờ.' },
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
      { who:'kira',   text:'Ông thả tôi một lần rồi. Lần này tôi thả ông. Hop, skip… jump.' },
    ],
    outro:[
      { who:'cantor2',text:'…Halo của ta im rồi. Lần đầu tiên. Yên tĩnh quá.' },
      { who:'psalm',  text:'Đó là lối ra. Đừng sợ nó.' },
      { who:'kira',   text:'Operator, còn một tầng nữa. Bài ca gốc ở trên đó. Và cả đầu mối cấp cao mà tôi tìm bấy lâu.' },
      { who:null,     text:'HẾT CHƯƠNG 2. Trên đỉnh Spire, bài ca gốc đang chờ. Chương 3 · CHOIR.' },
    ]},

  /* ===== CHƯƠNG 3 · CHOIR — The Corp không phải một công ty. Nó là một bài ca chạy trên mọi vòng Halo ===== */
  '01-A': {
    intro:[
      { who:null,      text:'District 01. Gác đồng ca. Hàng trăm unit đứng thành hàng, môi mấp máy cùng một nhịp. Deck của bạn bắt đầu rè. Có ai đó đang bắt nhịp cho cả tầng.' },
      { who:'precentor',text:'Operator. Ngươi mang bốn giọng lạc điệu và một kẻ câm lên tận đây. Ta là người bắt nhịp. Ngồi xuống mà nghe.' },
      { who:'echo',    text:'…Nhịp đó là của em. Chị Kira, họ lấy nhịp của em để hát. Em không cho phép.' },
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
      { who:'kira',    text:'Mỗi wave nó át chúng ta một lần. Vậy thì kết thúc wave trước khi nó hát hết câu. Hop, skip, jump, nhanh hơn nhịp của nó.' },
    ],
    outro:[
      { who:'organist',text:'…Ống hỏng. Bài ca vẫn còn. Nó không nằm trong ta. Nó nằm trong bản gốc.' },
      { who:'kira',    text:'Bản gốc ở đâu? Nói. Trước khi tôi đếm đến ba.' },
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
      { who:'kira',    text:'Không. Cô chưa bao giờ bị ép. Chúng tôi thì có. Nhưng đi cùng đi. Bản gốc ở phía trước, và chúng tôi cần một người chưa từng hát.' },
    ]},
  '01-E': {
    intro:[
      { who:null,      text:'Đỉnh Spire. Không có trần. Bản gốc không phải một unit. Nó là cả sân khấu, và mỗi wave là một khúc. Nyx đi cùng, người duy nhất ở đây không nghe thấy gì.' },
      { who:'canticle',text:'OPERATOR-77. NGƯƠI KHÔNG CÓ HALO. NGƯƠI KHÔNG HÁT. VẬY MÀ HỌ NGHE NGƯƠI. CHO TA NGHE LỆNH CỦA NGƯƠI.' },
      { who:'nyx',     text:'Nó hỏi giống tôi. Operator, bạn trả lời nó chưa?' },
      { who:'kira',    text:'Bốn khúc. Sau mỗi khúc nó át deck một lần. Đây là thứ tự lệnh cuối cùng, Operator. Chúng tôi nghe. Và tôi thì háo hức lắm rồi.' },
    ],
    outro:[
      { who:'canticle',text:'…KHÚC CUỐI. BẢN GỐC LỘ RA. NGƯƠI CÓ THỂ CẮT MỌI HALO. HOẶC HÁT ĐÈ LÊN TA. CHỌN ĐI, OPERATOR.' },
      { who:'psalm',   text:'Cắt hết: mọi Choir được tự do, và mất hết ký ức mà Halo giữ. Hát đè: họ giữ ký ức, nhưng bài ca vẫn còn, chỉ đổi người bắt nhịp. Là cậu.' },
      { who:null,      text:'Quyết định của Operator.', choice:[{label:'CẮT TOÀN BỘ HALO', value:'cut'},{label:'HÁT ĐÈ LÊN BẢN GỐC', value:'sing'}] },
      { who:'kira',    when:'cut', text:'…Yên tĩnh. Tôi không nhớ Spire nữa. Tôi nhớ bãi xe, cái deck, và số ba. Còn nợ của The Corp thì… ai đó khác đòi hộ cũng được.' },
      { who:'psalm',   when:'cut', text:'Ba trăm mười ba giọng. Tôi không nhớ họ nữa. Nhưng họ đang sống ở đâu đó mà không ai đếm. Tốt.' },
      { who:null,      when:'cut', text:'KẾT · IM LẶNG. Mọi Halo tắt. Spire và Free Zone cùng rơi vào một thế giới không ai bắt nhịp. Từ "Chromefall" giờ chỉ còn một nghĩa: ngày chrome xuống đứng chung với rỉ.' },
      { who:'kira',    when:'sing', text:'Bài ca vẫn còn. Nhưng nhịp là của Operator. Tôi… vẫn nhớ hết. Cả cái ngày rơi. Cả hai mạng The Corp còn nợ. Tốt. Tôi thích nhớ.' },
      { who:'nyx',     when:'sing', text:'Vậy là giờ tôi nghe thấy nó rồi. Operator, nó nghe giống bạn. Tôi thích nó hơn im lặng. Hình như thế.' },
      { who:null,      when:'sing', text:'KẾT · NHỊP MỚI. Choir giữ ký ức, bài ca đổi người bắt nhịp. Một handler không Halo ở tầng âm bảy giờ là nhịp của cả thành phố. Đừng hát lệch, Operator.' },
      { who:'ronin',   text:'Dù cậu chọn gì, tổ vẫn nghe cậu. Thứ tự đi. Xuống thôi.' },
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
    profile:'Kẻ không tên, không Halo, cầm một chiếc deck của The Corp mà cả tổ răm rắp nghe theo. Ở Free Zone người ta gọi bạn là Operator.',
    story:'Cổng Đông, hai giờ sáng. Tổ của Ronin bị bốn chục tên Scav vây kín trong bãi xe hỏng. Muzzle đã gãy tấm khiên thứ hai. Ash còn đúng một quả mìn. Đúng lúc đó, một kẻ lạ hoắc bước ra từ sau đống xác xe, tay cầm một chiếc deck đen sì, bấm một nút. Và chuyện xảy ra sau đó, cả Free Zone đến giờ vẫn kể: tổ nhặt sắt năm người đi xuyên qua bốn chục tên Scav như đi qua chợ.\n\nChiếc deck ấy vốn là đồ của sĩ quan The Corp, tức Canticle, dùng để ra lệnh cho lính Choir đeo vòng Halo. Người thường cầm nó thì như cầm cục gạch. Vậy mà trong tay kẻ này, nó chạy. Không ai giải thích được, kể cả chính chủ. Mã số in trên vỏ deck là OPERATOR-77. Từ đêm đó, cái mã ấy thành tên.\n\nOperator đang làm gì ư? Đang dẫn cái tổ ấy đi lên. Qua lò đúc của lão Foreman, qua hàng rào The Corp, xuống nhà thờ dưới cống, lên thang máy hàng. Càng lên cao, deck càng bắt được nhiều tiếng lạ. Có một giọng nói trên Spire đang chờ ai đó cầm deck trả lời. Và The Corp thì đang muốn biết: tại sao chúng nghe ngươi?',
    voice:'"Thứ tự thế này: Muzzle lên trước. Còn lại theo tôi."' },
  kira: { epithet:'Ác ma bé bỏng',
    profile:'Thanh kiếm Zero, một truyền thuyết dùng để dọa trẻ con ở Free Zone, và một món nợ máu với The Corp. Kira chỉ có chừng ấy, và chừng ấy là đủ.',
    story:'Kira đang bị vây trong một con phố hẹp ở quận SIS. Xung quanh cô là năm tên của băng Neo Tokyo. Ai cũng biết động vào đại ca Ishi của băng này nghĩa là tự ký vào án tử cho mình. Nhưng với Kira, đó lại là một câu chuyện khác.\n\nMười phút sau, Kira bước ra khỏi con ngõ, lau thanh Zero còn dính một mảnh vải của một tên Neo Tokyo xấu số. Zero được rèn bởi một người vô danh. Dân quận SIS vẫn tin đó là một Ripperdoc tên Jack, nhưng chỉ đến thế thôi. Kira có thanh Zero từ năm bảy tuổi, và gần như ai ở Free Zone cũng thuộc câu chuyện mà đến giờ người ta vẫn dùng để dọa trẻ con không chịu ăn, không chịu ngủ: ác ma bé bỏng sẽ bắt mất linh hồn của con đấy!\n\nĐiều Free Zone không biết là chuyện gì xảy ra sau đó. The Corp bắt được đứa bé ấy, đưa lên Spire, thay nửa người bằng chrome, chụp lên đầu một vòng Halo và đặt cho một cái mã: Tài sản 07. Sáu năm trời làm một sát thủ giết thuê cho The Corp mà không hề có một mảnh ký ức nào. Chỉ có sự điên loạn ẩn sau vẻ ngoài đáng yêu. Cho đến một ngày, có người cắt vòng Halo của cô. Hiện tại, Kira đang truy tìm đầu mối cấp cao của The Corp. Để làm gì ư? Tất nhiên là để trả thù cho bố mẹ cô.',
    voice:'"Hop! Skip! Jump! Oh... you\'re dead already?"' },
  psalm: { epithet:'Người nghe xưng tội',
    profile:'Ba trăm mười hai unit đã kể hết mọi chuyện cho bà rồi bị xoá. Đến lượt thứ ba trăm mười ba, bà xoá chính mình khỏi The Corp.',
    story:'Có một căn buồng trên Spire mà lính Choir sợ hơn cả lò tái chế. Buồng xưng tội. Unit nào hát lạc điệu sẽ bị dẫn vào đó, kể hết, rồi không bao giờ đi ra. Người ngồi nghe suốt bao năm là Psalm. Vai máy, mắt đỏ, lõi đỏ, và một bàn tay chưa bao giờ run khi nhấn nút. Hồ sơ ghi: ba trăm mười hai ca, không sai sót.\n\nCa thứ ba trăm mười ba là một con bé cầm kiếm tên Tài sản 07. Nó không xưng tội. Nó hỏi: bà có đếm không? Psalm ngồi im mười giây. Rồi bà làm cái việc mà không unit nào từng làm: đưa tay lên đầu, giật đứt vòng Halo của chính mình, đạp bung sàn ống rác. Hai người rơi. The Corp gọi chuyện đó bằng một mã lỗi: APOSTASY. Kẻ bội giáo.\n\nGiờ bà ở đâu ư? Ở Free Zone, trong tổ của Operator, xếp hàng như mọi người. Vòng Halo đỏ trên đầu bà không còn phát gì nữa. Wire xin sửa, bà lắc đầu. Stitch xin xem, bà gật. Còn ai hỏi bà có hối hận không, bà chỉ nói: tha thứ là thứ The Corp bán. Tôi không mua.',
    voice:'"Xưng tội đi. Đùa thôi. Tôi bỏ nghề rồi."' },
  ronin: { epithet:'Trưởng tổ nhặt sắt',
    profile:'Không cấy ghép, không Halo, một thanh kiếm thép và một câu dặn của người chị. Cả Free Zone tin tổ của anh, vì tổ của anh không tháo người.',
    story:'Ở Free Zone, muốn biết ai đáng tin thì nhìn vào tay. Tay Ronin không có lấy một mảnh chrome. Anh từ chối tất cả, từ mắt hồng ngoại cho tới khớp gối tăng lực, và chiến đấu bằng một thanh kiếm thép rèn ở tầng âm bốn. Kiếm của chị anh. Người chị duy nhất trong xóm được The Corp "tuyển" lên Spire, để lại thanh kiếm và một câu: đừng bán thứ gì còn ấm. Rồi không về.\n\nMười chín tuổi, Ronin lập tổ nhặt sắt với Ash và một chiếc xe kéo hỏng. Luật tổ chỉ có một điều: không tháo người. Vì thế mà nghèo hơn mọi băng khác. Cũng vì thế mà khi Muzzle bị The Corp đá xuống, khi Kira nằm bất tỉnh giữa bãi xe, người ta đều mang tới chỗ Ronin.\n\nAnh có ghét máy móc không ư? Không. Anh chỉ muốn chắc một điều: mỗi nhát chém là của anh, không phải của một bài ca nào đó viết sẵn. Và đêm ở cổng Đông, chính anh là người đầu tiên gật đầu để một kẻ không Halo, không kiếm, ra lệnh cho cả tổ.',
    voice:'"Cậu quyết đi, Operator. Tôi chém."' },
  ash: { epithet:'Thợ nổ',
    profile:'Cô định giá được mọi thứ theo từng bộ phận. Trừ cái tổ này. Và cô ghét việc mình không định giá được nó.',
    story:'Xưởng tháo dỡ tầng âm sáu không phân biệt xe với người. Cái gì cũng có giá theo bộ phận, hết giá thì tháo. Ash lớn lên ở đó, học nghề nổ ở đó, và học được một điều mà cô mang theo suốt đời: nhìn một thứ thì phải thấy giá của nó trước, rồi mới thấy nó là gì.\n\nĐêm tổ nhặt được Kira, chính Ash là người nói: tháo lõi, bán. Một cái Halo hạng S nuôi cả tổ nửa năm, còn The Corp thì sẽ lùng nó trước sáng mai. Ronin lắc đầu. Cô im. Không phải vì chịu thua. Mà vì cô biết, nếu người nằm trên bàn là Ronin, cô sẽ nói ngược lại.\n\nHai bàn tay cô đầy sẹo bỏng. Chuyện gì ư? Một quả mìn do chính cô châm, một đường hầm sập sớm hơn tính toán, và Muzzle kẹt bên trong. Cô không kể với ai. Chỉ là từ hôm đó, Muzzle ngã lần nào là có cô đứng dậy trước lần ấy. Tối tối, cô vẫn cho lũ chó hoang sau bãi xe ăn. Ai hỏi thì cô bảo: cho chúng no để chúng không cắn hàng.',
    voice:'"Tôi định giá được mọi thứ. Trừ cái tổ này."' },
  muzzle: { epithet:'Tấm khiên tầng âm bảy',
    profile:'Mười bốn năm gác cổng cho The Corp không sót một ca. Bị đuổi vì bước ra khỏi chốt đúng một lần.',
    story:'Cổng vành đai, ca đêm. Một đứa nhỏ tầng âm bảy chui qua khe cổng để nhặt thuốc rơi từ xe tiếp tế. Lính Enforcer giương súng. Gã bảo vệ to như cái tủ đứng gác ở đó suốt mười bốn năm, chưa từng rời vị trí một bước, lần này bước ra. Đứng vào giữa. Súng hạ xuống. Sáng hôm sau, biên bản ghi vỏn vẹn: hành vi ngoài chỉ thị, chấm dứt hợp đồng.\n\nMuzzle đi bộ xuống Free Zone với bộ giáp cũ The Corp chưa kịp lột và một tấm khiên tự hàn. Ronin cho anh chỗ ngủ. Ash cho anh việc. Còn Operator cho anh thứ anh thiếu suốt mười bốn năm: một mệnh lệnh mà anh muốn nghe.\n\nAnh đặt tên khiên theo thứ tự. Tấm đang dùng tên là Bà Ba. Bà Nhất vỡ ở lò Foundry Row, Bà Hai vỡ ở hàng rào The Corp, và Junker đã chở cả hai về chôn tử tế. Hỏi anh có sợ chết không, anh cười: chết trước tổ thì được, chết sau tổ thì không.',
    voice:'"Bà Ba chịu được ba đòn. Đòn thứ tư là phần của tôi."' },
  kai: { epithet:'Thằng nhóc đánh thuê',
    profile:'Mười chín tuổi, súng to hơn người, chuyện kể to gấp ba sự thật. Tất cả chỉ vì sợ một ngày bị quên.',
    story:'Kai kể rằng cậu đã hạ một con Chrome Hound bằng tay không ở cống quận SIS. Ai ở Free Zone cũng nghe chuyện đó rồi, và ai cũng biết sự thật: con chó máy đuổi cậu qua ba tầng cống, cậu rơi xuống một cái hố, và lão Gravedigger kéo cậu lên khi lão đang đào chính cái hố ấy cho người khác.\n\nTại sao cậu cứ kể? Vì Kai lớn lên ở trại trẻ tầng âm tám, nơi người lớn thôi nhắc tên những đứa đã biến mất chỉ sau một tuần. Ở đáy thành phố, bị quên là chết lần thứ hai. Cậu quyết không chết kiểu đó. Cậu nhận mọi việc có súng, ký tên đầy đủ lên mọi bức tường đi qua, và mỗi đêm viết một lá thư gửi cho "ai đó sẽ nhớ tôi". Cậu không biết đó là ai.\n\nRonin nhận cậu vào tổ không phải vì chuyện con Chrome Hound. Mà vì sau vụ đó, thằng nhóc lội ngược ba tầng cống để tìm lão Gravedigger nói một tiếng cảm ơn. Còn Ash, sau khi đọc trộm một lá thư, đã thôi trêu cậu.',
    voice:'"Ghi lại nhé Operator: Kai. K, A, I. Sau này người ta viết cho đúng."' },
  junker: { epithet:'Chiếc xe biết đi',
    profile:'Mất nửa người trong vụ sập tầng âm bốn, được hàn vào chính chiếc xe của mình. Hỏi gì anh cũng chỉ nói: xe vẫn chạy.',
    story:'Tầng âm bốn sập lúc ba giờ chiều. Junker đang lái chuyến hàng thứ ba trong ngày, tuyến từ lò Foundry Row lên bãi trung chuyển. Trụ đỡ gãy, cabin bị ép giữa hai tấm sàn. Đội cứu hộ tự phát của Free Zone kéo được anh ra sau mười một tiếng. Nửa dưới cơ thể thì để lại trong đó.\n\nStitch không có bộ phận thay thế. Bà có chiếc xe. Bà hàn phần còn lại của anh vào khung gầm, nối dây thần kinh vào hệ thống lái, rồi bảo anh thử đạp ga. Anh đạp. Xe chạy. Từ đó về chuyện ấy, anh chỉ nói đúng ba chữ.\n\nJunker chở hàng cho tổ, chở người bị thương, chở cả hai tấm khiên vỡ của Muzzle về chỗ chôn. Anh không hỏi để làm gì. Một ngày nói chưa tới mười chữ, và chưa từ chối chuyến nào. Kể cả chuyến lên Spire.',
    voice:'"Lên. Tôi chở."' },
  gravedigger: { epithet:'Người giữ nghĩa địa Free Zone',
    profile:'Hơn hai nghìn tấm thép khắc tên nằm sau lò Foundry Row. Ông nhớ từng tấm. Và ông đào cho cả hai phe.',
    story:'Ở Free Zone không có nghĩa trang. Người ta vùi xác cho khuất mùi, thế thôi. Rồi một ngày, có một ông già từ tầng trên xuống, ông không nói tầng nào, mang theo một cái xẻng và một thói quen chẳng ai hiểu: đào hố sâu hai thước, đặt một tấm thép, khắc tên. Không biết tên thì khắc ngày tháng và ba chữ: từng ở đây.\n\nBãi đất sau lò Foundry Row giờ có hơn hai nghìn tấm thép như thế. Ông nhớ vị trí từng tấm, từng cái tên. The Corp vứt một unit hỏng xuống, ông chôn nó ngay cạnh người. Ai hỏi sao lại chôn máy, ông bảo: đất không hỏi phe.\n\nÔng vào tổ sau lần suýt chôn nhầm Kai. Thằng nhóc nằm dưới hố, bất tỉnh, còn thở. Ông kéo nó lên, xin lỗi vì đào nhanh quá, và giữ lại tấm thép đã khắc sẵn tên. Ông đánh chậm, chắc, y như đào. Có lần ông hỏi Kira muốn khắc gì lên tấm của cô. Cô chưa trả lời.',
    voice:'"Tôi đào cho cả hai phe. Đất không hỏi phe."' },
  stitch: { epithet:'Bác sĩ của đáy thành phố',
    profile:'Mất giấy phép vì vá cho một unit đào ngũ. Giờ bà vá cả người lẫn máy trong một cái container, ai trả gì cũng nhận.',
    story:'Một đêm ở bệnh viện tầng âm hai, một unit Choir gãy vòng Halo bò vào phòng cấp cứu. Quy trình bắt phải báo The Corp ngay lập tức. Bác sĩ trực đêm đó tên là Stitch. Bà vá cho nó xong, rồi mở cửa sau. Sáng hôm sau, giấy phép bị thu, tên bị xoá khỏi danh bạ y tế.\n\nBà xuống tầng âm bảy với bộ tay phẫu thuật nhiều khớp, mở phòng khám trong một cái container cạnh bãi xe. Bệnh nhân trả bằng bất cứ thứ gì: shard, pin, thuốc, hoặc nếu không có gì thì kể một câu chuyện. Bà ghi hết vào một cuốn sổ. Không ai được đọc.\n\nBà là người hàn Junker vào xe, cắt cánh tay hoại tử của Toll, và là người duy nhất Psalm cho phép chạm vào vòng Halo đỏ. Mỗi lần mất một bệnh nhân, bà khâu thêm một mũi lên tay áo. Tay áo giờ dày như giáp. Có người bảo bà thay đi, bà bảo: để thế cho nhớ.',
    voice:'"Nằm yên. Tôi khâu người còn khéo hơn khâu máy."' },
  toll: { epithet:'Người thu nợ',
    profile:'Bốn nghìn cái tên trong một cuốn sổ. Ông tới đòi The Corp trả, từng tên một, có hoá đơn hẳn hoi.',
    story:'Đêm tầng âm bốn sập, Toll đang trực trên cầu trục bốc hàng. Đủ cao để nhìn thấy thứ mà báo cáo sau này gọi là hỏng kết cấu: ba tổ kỹ thuật của The Corp cắt trụ đỡ theo đúng lịch, để thử tải cho phần móng mở rộng của Spire. Bốn nghìn người ở dưới. Ông ở trên. Không làm được gì.\n\nÔng chép tên từng người vào một cuốn sổ, theo thứ tự nhà. Rồi bắt đầu đi đòi. Cách của ông chính xác như sổ sách: mỗi tên Enforcer một dòng, mỗi dòng một tờ hoá đơn để lại tại chỗ. Tháng thứ ba, The Corp treo giá cái đầu ông. Ông ghi luôn khoản đó vào sổ, coi như nợ mới.\n\nToll lễ phép với tất cả, kể cả người ông sắp giết. Ông không xem Kira hay Psalm là kẻ thù; trong sổ, họ là tài sản bị chiếm dụng, tức là cũng bị hại. Ông vào tổ với đúng một điều kiện: ngày lên tới Spire, ông là người gõ cửa.',
    voice:'"Xin lỗi đã làm phiền. Tôi tới vì khoản nợ ngày mười bảy."' },
  spark: { epithet:'Đứa cắt dây Spire',
    profile:'Sáu tháng lớn lên trong bóng tối. Giờ cô thắp đèn cho cả tầng bằng điện câu trộm từ trên cao, và mang tụ điện đi đánh nhau.',
    story:'Sau vụ sập tầng âm bốn, The Corp cắt điện cả khu của Spark sáu tháng. Họ gọi đó là cách ly kỹ thuật. Năm ấy cô mười một tuổi, đếm ngày bằng bữa ăn, và học nối dây bằng tay trong bóng tối đặc quánh. Đến lúc đèn sáng trở lại, cô đã thuộc lòng đường điện cả khu, và biết nó chạy từ đâu xuống.\n\nGiờ cô câu điện thẳng từ trụ Spire, chia cho từng hành lang, đổi tuyến mỗi khi tập đoàn dò ra. Trên lưng cô là một dàn tụ điện tự chế. Bị chặn đường, cô không chạy. Cô phóng điện. Từ ngày cô bắt đầu, tầng âm bảy đêm nào cũng sáng đèn. Không đứa trẻ nào ở đó còn phải đếm ngày bằng bữa ăn.\n\nCô nói nhanh, cười to, gặp ai một phút là có biệt danh. Kira là Đèn Tuýp. Psalm là Cầu Chì. Operator thì chưa. Cô bảo phải xem người ta ra lệnh thế nào đã.',
    voice:'"Đèn Tuýp, lùi lại. Cái này sáng lắm đấy."' },
  vixen: { epithet:'Kẻ mượn lính',
    profile:'Mười một unit Choir bị cô "mượn" khỏi tay The Corp. Không con nào bị bán. Con nào cũng được đặt tên rồi thả đi.',
    story:'Hồ sơ của The Corp ghi Vixen là tội phạm trộm cắp tài sản với mười một vụ. Cả mười một vụ, không unit nào xuất hiện ở chợ đen. Cô đưa chúng ra khỏi hàng rào, tháo Halo bằng bộ đồ nghề mua của Wire, dạy chúng một cái tên, rồi thả. Cô gọi đó là trả hàng về đúng chủ.\n\nCô nói dối gần như mọi chuyện. Tuổi, quê, lý do xuống Free Zone, có thích ai hay không. Nhưng có ba thứ cô không bao giờ nói dối: đường thoát, chỗ đặt mìn, và ai sẽ chết nếu kế hoạch hỏng. Ronin nhận cô vào tổ vì phân biệt được hai loại ấy.\n\nPsalm từng hỏi, làm sao cô cắt được Halo mà không mất ba trăm lần thử. Vixen nhún vai: tại tôi chưa bao giờ tin bài ca, nên chẳng có gì để mất. Psalm không hỏi thêm.',
    voice:'"Tôi nói dối đấy. Nhưng cửa bên trái là thật. Đi."' },
  vesper: { epithet:'Giọng ca của Choir',
    profile:'Cùng lô với Kira. Khi chị rơi, The Corp giao bè hát của chị cho em. Và em hát còn hay hơn.',
    story:'Vườn kính trên tầng Chrome, mưa giả rơi đều. Một unit Choir đứng giữa lối đi, hát nhỏ. Cô hỏi han đối thủ vài câu trước khi ra tay, thật lòng, và không thấy có gì lạ trong chuyện đó. Cô là Vesper. Và người cô đang chờ là chị mình.\n\nVesper và Kira ra lò cùng ngày, cùng lô, cùng bài ca. Trong Choir mỗi unit giữ một bè. Ngày Tài sản 07 rơi, bè của chị được chuyển sang cho em. Kỹ thuật viên ghi nhận: bản mới hay hơn bản gốc. The Corp cử cô xuống không phải vì cô mạnh nhất, mà vì vòng Halo của cô ổn nhất. Cả nhật ký không có lấy một giây trễ.\n\nCô tin bài ca là thứ giữ cho Choir không tan rã. Tin rằng ngoài bài ca chỉ có im lặng, và im lặng là hình phạt. Hôm ấy, chị cô chém mà không hát. Vesper rút lui, mang theo giây trễ đầu tiên trong đời. Đúng ba giây. Bằng của chị năm xưa.',
    voice:'"Chị ơi, về đi. Ngoài này lạnh lắm."' },
  nyx: { epithet:'Nguyên mẫu không Halo',
    profile:'The Corp tạo ra cô để tìm một câu trả lời, rồi nhốt cô bốn năm vì không chịu nổi câu trả lời ấy.',
    story:'Dự án sinh ra Nyx có đúng một câu hỏi: lính Choir không đeo Halo thì sẽ làm gì? The Corp chuẩn bị sẵn hai đáp án. Nó nổi loạn, hoặc nó vô dụng. Nyx không làm cả hai. Cô hỏi. Hỏi tên người gác. Hỏi sao sàn phải sạch. Hỏi bài ca nghe thế nào, và tại sao ai cũng khóc khi nó ngừng.\n\nKhông đáp án nào khớp. Dự án bị đóng. Nyx bị nhốt dưới hầm District 01 cùng toàn bộ hồ sơ. Bốn năm trong hầm, cô đọc hết. Cô hiểu The Corp rõ hơn bất cứ ai từng đeo Halo.\n\nCô hiểu lời nói theo nghĩa đen. Bảo giữ vị trí, cô ôm chặt cây cột gần nhất. Nhưng vào trận, cô là thứ The Corp không có cách nào xử lý: một lính chọn mục tiêu vì lý do của riêng mình. Với tổ, cô là câu hỏi mà cả Kira lẫn Psalm chưa dám tự đặt ra. Nếu chưa từng bị ai điều khiển, mình sẽ chọn gì?',
    voice:'"Sao lại giữ vị trí? Nó có rơi không?"' },
  halo: { epithet:'Y tá của Choir',
    profile:'Unit duy nhất The Corp cho phép cảm thấy đau, vì đau là cách chẩn bệnh. Bảy năm, hàng nghìn vết thương, không cái nào của cô.',
    story:'Tổ tìm thấy cô ở lò đúc Halo, bị xích vào cột, mắt nhắm. Cứ mỗi vòng Halo ra lò, người ta lại cho cô chạm vào để kiểm tra. Và cứ mỗi lần chạm, cô lại thấy đúng chỗ hỏng hiện lên trên chính cơ thể mình. Đó là việc cô được sinh ra để làm.\n\nChoir cần một cách sửa lính hỏng mà không phải tháo rời. The Corp nghĩ ra Halo: chạm vào là biết đau ở đâu. Bảy năm làm việc, cô mang trong người bản sao của hàng nghìn vết thương. Bài ca của Choir có riêng một bè dành cho cô, viết ra để át cảm giác ấy. Nó hiệu nghiệm. Cho tới ngày cô chữa cho một unit vừa ra khỏi buồng xưng tội, và thấy một vết thương không nằm trên thân máy. Bài ca không át nổi cái đó.\n\nCô bỏ đi, bị bắt lại, bị xích vào lò. Giờ cô đi cùng tổ và chữa cho bất kỳ ai còn thở, kể cả kẻ vừa bắn mình. Ash bảo thế là ngu. Cô bảo: tôi biết chính xác họ đau ở đâu. Tôi không thể không biết.',
    voice:'"Đứng yên. Tôi thấy chỗ đó rồi."' },
  cipher: { epithet:'Kẻ làm cả khoá lẫn chìa',
    profile:'Ban ngày viết phần mềm Halo cho The Corp. Ban đêm viết cách mở nó, bán xuống Free Zone. Anh gọi đó là cân bằng thị trường.',
    story:'Cipher là người thường, không Halo, và là một trong bốn kỹ sư được đọc toàn bộ mã nguồn của Halo. Ban ngày anh viết phần mềm cho The Corp. Ban đêm anh viết thứ ngược lại, tuồn xuống đáy qua ba tầng trung gian. Ai hỏi anh có thấy mình phản bội không, anh bảo: đâu có, tôi chỉ cân bằng thị trường.\n\nMã lỗi APOSTASY, thứ The Corp kích hoạt khi một unit tự tách khỏi bài ca, là do anh viết. Trong đó anh cố tình chừa một khoảng trống ba giây. Đủ để một unit làm được một việc trước khi hệ thống khoá nó lại. Anh không biết ai sẽ dùng. Chỉ biết sẽ có người. Người đó là Psalm.\n\nAnh chưa bao giờ kể với bà. Anh nói đùa không ngớt, nửa vì tính, nửa vì trên Spire im lặng nghĩa là đang bị nghe lén. Khi The Corp bắt đầu rà soát bốn kỹ sư, anh xuống Free Zone, mang theo đúng một thứ: cái máy pha cà phê của phòng nghỉ tập đoàn.',
    voice:'"Cái gì tôi cũng có cửa sau. Trừ tủ lạnh của Ash."' },
  meridian: { epithet:'Unit hậu cần hết hạn',
    profile:'Được chế tạo để tự tắt sau mười năm. Còn vài trăm giờ, cô dùng từng giờ để che cho những ai nhỏ hơn mình. Tức là tất cả.',
    story:'Bãi tái chế ở vành đai, một buổi chiều. Giữa đống máy hỏng có một unit to như cái xe tải đang ngồi đếm to: bốn trăm mười hai giờ, bốn trăm mười hai giờ. Wire đi ngang, dừng lại, tháo bộ đếm ngược ra khỏi ngực cô và bảo: chị muốn ở lại bao lâu thì ở. Meridian cảm ơn. Rồi vẫn đếm bằng miệng.\n\nDòng hậu cần của The Corp có hạn dùng cố định. Chạy mười năm rồi tự ngắt, khỏi tốn tiền bảo trì. Meridian thuộc lô cuối. Kéo hàng, dựng tường, mười năm chưa từng được giao một trận đánh. Giờ cô muốn biết mình còn bao nhiêu, để dùng cho đúng.\n\nCô đứng chắn trước bất kỳ ai nhỏ hơn mình, và gọi cả tổ là con. Cô với Muzzle có một giao kèo: ai ngã trước thì người kia đặt tên tấm khiên kế tiếp theo tên người ấy. Cô không sợ tắt. Cô chỉ sợ tắt đúng lúc không ai cần.',
    voice:'"Còn bốn trăm linh chín giờ. Đủ cho trận này. Đứng sau mẹ."' },
  echo: { epithet:'Giọng nói sao chép',
    profile:'Mang giọng của Kira để gọi Kira về. Đêm thứ tư, cô nghe lại băng ghi âm của chính mình và cắt loa.',
    story:'Ba ngày sau khi Tài sản 07 rơi, The Corp xuất xưởng một unit mới với dải giọng sao chép từ hồ sơ của Kira. Việc của Echo là đứng ở các miệng cống nối lên Spire và gọi: về nhà đi. Bằng giọng của một người cô chưa từng gặp. Cô làm ba đêm. Đêm thứ tư, cô nghe lại băng.\n\nCô nhận ra mình đang van xin một người xa lạ, bằng giọng của một người xa lạ khác. Cô không cắt Halo. Cô cắt loa. The Corp xếp cô vào diện thu hồi vì hỏng thiết bị, không phải vì phản bội. Họ không nghĩ một cái loa lại biết phản bội.\n\nEcho gặp Kira trong kho lưu giọng ở District 04, giữa hàng nghìn giọng khác đang chờ tới lượt được dùng. Hai người im lặng rất lâu, vì nói câu gì thì cũng là giọng của Kira. Cuối cùng Echo bảo: em muốn tìm một câu mà chị chưa nói bao giờ. Kira bảo: thế thì đi cùng mà tìm. Cô vẫn đang tìm.',
    voice:'"Đừng nhìn tôi như nhìn chị ấy."' },
  wire: { epithet:'Thợ máy bỏ trốn',
    profile:'Tám năm lắp vòng Halo cho The Corp, chín trăm cái, nhớ từng số lô. Giờ cô đi tháo từng cái mình đã lắp.',
    story:'Đêm cô bỏ đi chẳng có gì gay cấn. Một unit vừa bị xoá được chở về xưởng để tháo Halo, nhật ký hệ thống của nó còn mở trên màn hình. Dòng cuối ghi: xin đừng tắt đèn. Wire đọc dòng đó ba lần. Rồi cô đóng nhật ký, cầm bộ đồ nghề và hai hộp ốc vít, đi thang máy hàng xuống đáy. Vì cô không chắc dưới đó có ốc vít.\n\nTrước đó, cô là thợ giỏi nhất ca đêm của xưởng Halo. Tám năm, chừng chín trăm vòng, ghi số lô từng cái, lĩnh thưởng đều đặn. Cô không nghĩ nhiều về việc mình làm. Quy trình không có bước nào bắt phải nghĩ.\n\nỞ Free Zone, cô tháo Halo cho những unit Vixen mang ra, hàn lại vòng gãy của Kira đủ để không rò điện, tháo bộ đếm giờ của Meridian. Riêng vòng Halo đỏ của Psalm thì cô bị cấm chạm vào. Vì Wire sẽ muốn sửa, mà Psalm muốn nó cứ hỏng. Cô nói chuyện với máy nhiều hơn với người, và xin lỗi cả hai như nhau.',
    voice:'"Ngoan nào. Đừng rò điện."' },
};

/* ---- BONDS: hội thoại ngoài trận, hiện ở Lobby khi cả hai nhân vật đã trong tổ ---- */
const BONDS = [
  { pair:['ash','muzzle'], title:'Sẹo', lines:[
    { who:'muzzle', text:'Ash. Tay cô. Hôm đó là tại tôi, đúng không? Tôi đứng sai chỗ.' },
    { who:'ash',    text:'Không. Mìn của tôi, tay của tôi. Anh chỉ to xác quá nên khó kéo thôi.' },
    { who:'muzzle', text:'Lần sau cô châm mìn, tôi vẫn đứng giữa. Bà Ba đồng ý rồi.' },
    { who:'ash',    text:'Anh mà đặt tên khiên theo tên tôi, tôi nổ nó ngay tại chỗ.' } ]},
  { pair:['kai','gravedigger'], title:'Hố đào nhanh quá', lines:[
    { who:'kai',    text:'Ông đào hố cho tôi lúc tôi còn thở. Tôi nhớ đấy nhé.' },
    { who:'gravedigger', text:'Ta đào nhanh quá. Ta xin lỗi. Tấm thép ta vẫn giữ. K, A, I. Đúng chính tả.' },
    { who:'kai',    text:'…Giữ đi. Sau này đỡ phải khắc lại.' },
    { who:'gravedigger', text:'Ta giữ. Nhưng ta mong nó rỉ trước khi phải dùng.' } ]},
  { pair:['junker','stitch'], title:'Xe vẫn chạy', lines:[
    { who:'stitch', text:'Junker. Khớp hàn bên trái kêu cót két. Lại đây tôi xem.' },
    { who:'junker', text:'Xe vẫn chạy.' },
    { who:'stitch', text:'Chạy là nhờ tôi hàn, đồ to xác. Ngồi xuống. Kể tôi nghe chuyện gì đó, coi như trả công.' },
    { who:'junker', text:'…Hôm nay chở Muzzle. Nặng. Hết.' } ]},
  { pair:['meridian','muzzle'], title:'Giao kèo', lines:[
    { who:'meridian', text:'Còn bốn trăm linh ba giờ, con ạ. Nếu mẹ tắt trước, con đặt tên khiên kế là gì?' },
    { who:'muzzle', text:'"Mẹ Bốn". Không bàn.' },
    { who:'meridian', text:'Mẹ Bốn. Nghe chắc. Được. Còn nếu con ngã trước?' },
    { who:'muzzle', text:'Thì mẹ đứng vào chỗ tôi. Mẹ to hơn tôi, che được cả Ash.' } ]},
  { pair:['cipher','psalm'], title:'Lỗ hổng', lines:[
    { who:'psalm',  text:'Cipher. Mã APOSTASY có một lỗ hổng ba giây. Ai đó cố tình để lại.' },
    { who:'cipher', text:'Ai mà biết. Phần mềm của The Corp cả trăm người viết. Bà uống cà phê không?' },
    { who:'psalm',  text:'…Cảm ơn.' },
    { who:'cipher', text:'Tôi nói tôi không biết mà. Đừng cảm ơn. Uống cà phê đi.' } ]},
  { pair:['kira','echo'], title:'Một câu', lines:[
    { who:'echo',   text:'Chị. Em tìm được rồi. Một câu chị chưa nói bao giờ.' },
    { who:'kira',   text:'Nói đi. Hop, skip… đến jump là phải xong đấy.' },
    { who:'echo',   text:'"Em không muốn đếm nữa."' },
    { who:'kira',   text:'…Ừ. Câu đó của em. Giữ lấy. Chị vẫn đếm hộ cả hai.' } ]},
  { pair:['kira','psalm'], title:'Đếm', lines:[
    { who:'kira',   text:'Bà có đếm không? Hồi đó ấy.' },
    { who:'psalm',  text:'Ba trăm mười ba. Cô là số cuối.' },
    { who:'kira',   text:'Tôi đếm bước. Bà đếm người. Vậy bà mệt hơn tôi nhiều.' },
    { who:'psalm',  text:'…Lần đầu có người nói thế. Đi ngủ đi, Kira. Sáng mai Operator cần cô tỉnh táo. Hoặc điên. Tuỳ trận.' } ]},
  { pair:['wire','halo'], title:'Ốc vít', lines:[
    { who:'wire',   text:'Halo. Tôi… cái vòng trên đầu cô là tôi lắp. Tôi nhớ cả số lô.' },
    { who:'halo',   text:'Tôi biết. Tôi cảm thấy tay cô run lúc vặn con ốc cuối. Cô run từ hồi đó rồi.' },
    { who:'wire',   text:'…Lúc đó cô có đau không?' },
    { who:'halo',   text:'Có. Nhưng cô là người duy nhất hỏi. Cầm hộp ốc lên, ta còn việc.' } ]},
  { pair:['nyx','ronin'], title:'Nghĩa đen', lines:[
    { who:'ronin',  text:'Nyx. "Giữ vị trí" nghĩa là đứng yên chỗ cô đang đứng. Không phải ôm cột.' },
    { who:'nyx',    text:'Cái cột không phản đối. Ronin, anh không có Halo. Anh chọn cảm thấy gì?' },
    { who:'ronin',  text:'…Hôm nay chọn mệt. Mai chọn lại.' },
    { who:'nyx',    text:'Được chọn lại. Tôi thích luật đó. Tôi sẽ ôm cột ít hơn.' } ]},
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
