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
           ult:{ name:'IAIDO', cost:100, kind:'nuke', mult:2.8, exact:true,
                 desc:'Đúng 280% ATK lên một mục tiêu. Không chí mạng, không sai số' },
           talent:{ name:'ĐÁP', mult:.6, verseImmune:true },
           sprites:{ idle:['ronin_idle.png'], attack:['ronin_attack.png'] }, portrait:['ronin_portrait.png','RONIN.png'], pos:'50% 8%' },
  ash:   { id:'ash',   name:'ASH',   faction:'rust', tier:'A', atk:120, hp:1000, energyMax:75,    // ★ FAKE: cost + chiêu cuối
           ult:{ name:'FLASHOVER', cost:75, kind:'aoe', mult:1.5, blowCharges:true,
                 desc:'150% ATK lên toàn bộ kẻ địch, rồi kích nổ mọi quả mìn còn lại' },
           talent:{ name:'MÌN', mult:.6 },
           sprites:{ idle:['ash_idle.png'], attack:['ash_attack.png'] }, portrait:['ash_portrait.png','ASH.png'], pos:'50% 8%' },
  muzzle:{ id:'muzzle',name:'MUZZLE',faction:'rust', tier:'B', atk:70,  hp:1750, energyMax:125,   // ★ FAKE: cost + chiêu cuối
           ult:{ name:'FIELD PATCH', cost:125, kind:'heal', mult:1.2, desc:'Hồi 120% ATK cho toàn đội. (★ FAKE)' },
           sprites:{ idle:['muzzle_idle.png'], attack:['muzzle_attack.png'] }, portrait:['muzzle_portrait.png','MUZZLE.png'], pos:'50% 8%' },
  // ---- ★ FAKE toàn bộ: chưa có spec, chỉ để đủ roster 9 ----
  echo:  { id:'echo',  name:'ECHO',  faction:'chrome', tier:'A', atk:105, hp:1000, energyMax:100, ult:{ name:'FEEDBACK', cost:100, kind:'aoe', mult:1.4, muteAll:true,
         desc:'140% ATK lên toàn bộ kẻ địch và áp [MUTE] lên tất cả' },
         talent:{ name:'MUTE', dmg:.25 }, sprites:{idle:['echo_idle.png'],attack:['echo_attack.png']}, portrait:['echo_portrait.png','ECHO.png'], pos:'50% 8%' },
  wire:  { id:'wire',  name:'WIRE',  faction:'chrome', tier:'B', atk:80,  hp:1500, energyMax:75,  ult:{ name:'DEAD SHORT', cost:75, kind:'aoe', mult:1.6, perStack:.4,
         desc:'160% ATK lên toàn bộ kẻ địch, +40% ATK cho mỗi [OVERLOAD] trên mục tiêu đó. Ăn sạch stack.' },
         talent:{ name:'OVERLOAD', max:3, vuln:.10 }, sprites:{idle:['wire_idle.png'],attack:['wire_attack.png']}, portrait:['wire_portrait.png','WIRE.png'], pos:'50% 8%' },
  stitch:{ id:'stitch',name:'STITCH',faction:'rust',   tier:'S', atk:140, hp:900,  energyMax:100, ult:{ name:'SUTURE', cost:100, kind:'heal', mult:.8, ledgerShare:.35, ledgerMax:8,
           desc:'Hồi 80% ATK + 35% sổ cho toàn đội, rồi xoá sổ' },
         talent:{ name:'SỔ', max:8 }, sprites:{idle:['stitch_idle.png'],attack:['stitch_attack.png']}, portrait:['stitch_portrait.png','STITCH.png'], pos:'50% 8%' },
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
    chronicleTitle:'KIRA — CÁI NÀO LÀ CỦA TÔI',
    chronicle:[
      { t:'I · Con ngõ ở quận SIS', p:[
        'Năm tên băng Neo Tokyo dồn cô vào một con ngõ cụt sau chợ đêm. Một đứa cầm súng hoa cải. Hai đứa lắp chrome rẻ tiền ở tay với chân, loại mua ngoài chợ, hàn bằng mỏ hàn. Đứa thứ tư có hai lưỡi bung ra từ cẳng tay. Đứa thứ năm đứng sau cùng, không rút gì cả, vì nó là đứa nói.',
        'Nó hỏi: mày biết mày vừa động vào ai không.',
        'Kira nghiêng đầu. Hai cái tai trên đầu cô khẽ động theo.',
        'Cô nói: không.',
        'Nó nói: Ishi.',
        'Ở quận SIS, cái tên ấy đủ để người ta bỏ hàng xuống mà đi. Kira chớp mắt, nhìn thanh kiếm trong tay mình, rồi nói: à. Vậy chắc tôi gây chuyện to rồi.',
        'Mười phút sau cô bước ra khỏi ngõ, lau lưỡi Zero bằng một mảnh vải còn dính trên đó. Đứa thứ năm đã chạy. Cô không đuổi.',
        'Cô đứng lại giữa vũng nước dưới biển đèn, và nhận ra một chuyện.',
        'Cô đang cười.',
        'Không phải cười thắng. Không phải cười vui. Chỉ là cười, rất tự nhiên, như thể cái mặt cô vẫn hay để ở đó. Kira đưa tay chạm lên môi mình.',
        'Cô nói, với không ai cả: lạ thật.' ] },
      { t:'II · Ác ma bé bỏng', p:[
        'Ở Free Zone, muốn đứa trẻ chịu ăn thì người ta doạ nó bằng Kira.',
        'Câu chuyện kể rằng có một con bé đi trong ngõ lúc nửa đêm, đằng sau kéo lê một thanh kiếm dài hơn cả người nó, và đứa trẻ nào không chịu ngủ thì ác ma bé bỏng sẽ tới bắt mất linh hồn. Người lớn kể xong thì cười. Nhưng có mấy người ở quận SIS không cười, vì họ có mặt ở đó thật.',
        'Chuyện thật thì ngắn hơn truyền thuyết nhiều. Năm ấy có một con bé bảy tuổi, một thanh kiếm, và một nhóm người đi tìm nó. Sáng hôm sau người ta đếm được bao nhiêu thì không ai nói ra, vì nói ra thì thành đồng loã.',
        'Điều đáng chú ý không phải con số. Điều đáng chú ý là chuyện đó xảy ra **trước** khi The Corp chạm vào cô.',
        'Nên câu hỏi mà cả Free Zone tránh không hỏi to là: The Corp đã biến một đứa bé thành cái này, hay The Corp chỉ nhặt được một thứ đã sẵn như thế và lắp thêm dây cương.' ] },
      { t:'III · Zero', p:[
        'Thanh kiếm tên Zero, và không ai biết ai rèn nó.',
        'Dân quận SIS tin đó là một Ripperdoc tên Jack, một ông già chuyên tháo chrome ở tầng âm bốn, chết từ lâu rồi. Người ta tin thế vì cần tin một cái gì đó. Không có bằng chứng nào cả. Trên lưỡi không có dấu lò, không có số hiệu, không có một chữ nào.',
        'Kira có Zero từ năm bảy tuổi. Hỏi ai đưa thì cô không trả lời được, và cô đã thôi cố nhớ.',
        'Về sau The Corp phát cho Tài sản 07 một thanh kiếm khác: lưỡi ngắn hơn, phát sáng tím, số hiệu khắc ở chuôi, thay được lưỡi khi mòn. Đồ tốt hơn Zero về mọi thông số đo được.',
        'Cô đeo cả hai. Thanh của The Corp cô chưa đặt tên bao giờ, và cũng chưa vứt đi bao giờ. Ash có lần hỏi sao không bán, bán được khối tiền. Kira bảo: vì em muốn biết em rút thanh nào trước, khi em không kịp nghĩ.' ] },
      { t:'IV · Cái đêm không ai kể', p:[
        'Bố mẹ Kira chết trong một đêm, và chuyện đó không có nhân chứng nào còn sống để kể lại cho đúng.',
        'Có một mảnh cô nhớ được, mảnh này quay lại vào những lúc không mời: sàn nhà, một cái gầm bàn, và giày. Rất nhiều giày đi qua trước mặt. Giày lính Choir đế cứng, đi đều, không vội. Người ta không vội vì không có gì phải vội.',
        'Rồi có tiếng ai đó nói, giọng bình thản như đọc danh mục: xoá con bé luôn.',
        'Và có tiếng một người khác nói: khoan.',
        'Cô không nhìn được mặt người thứ hai. Cô đã thử rất nhiều lần. Mỗi lần thử thì đầu đau đến mức phải ngồi xuống, và cái mảnh ấy lại rách thêm một tí.',
        'Nhưng cô hiểu ra ý nghĩa của chữ khoan ấy từ lâu rồi. Một con bé bảy tuổi vừa làm được cái việc mà nó vừa làm ở con ngõ đêm đó thì không đáng để xoá. Nó đáng để mang về.' ] },
      { t:'V · Tài sản 07', p:[
        'Trên Spire, người ta không hỏi tên. Người ta phát mã.',
        'Họ thay nửa người cô bằng chrome, và không phải loại chợ đen như của mấy đứa Neo Tokyo. Loại này khớp êm, không kêu, mười năm không cần siết lại. Rồi họ chụp lên đầu cô một vòng Halo và ghi vào hồ sơ: Tài sản 07.',
        'Vòng ấy không phải hàng thường. Về sau, khi Wire cầm nó lên xem, cô ấy tra số lô rất lâu rồi nói một câu ngắn: cái này không phải của xưởng chị. Tám năm ở tầng 40, chín trăm cái vòng, và không cái nào giống cái này. Hàng hạng S lắp ở đâu, ai lắp, Wire không biết, mà Wire là người biết nhiều nhất về chuyện lắp Halo trong cả tổ.',
        'Sáu năm sau đó, Tài sản 07 làm việc.',
        'Cô không có một mảnh ký ức nào trong sáu năm ấy — không phải quên, mà là không có. Người ta không cho phép hình thành. Cô nhận lệnh, đi, làm xong, về, và nằm chờ lệnh sau. Echo, người mang bản sao giọng cô thu hồi bảy tuổi, có lần nói một câu mà không ai trong tổ đáp lại được: trong sáu năm đó chị gần như không nói gì, nên bản thu duy nhất còn dùng được vẫn là giọng một đứa trẻ con.' ] },
      { t:'VI · Nụ cười là một thiết lập', p:[
        'Vòng Halo không chỉ dùng để ra lệnh. Nó còn giữ cho unit ở trạng thái dùng được.',
        'Sát thủ thì hỏng nhanh. Làm cái việc ấy đủ lâu, người ta rối loạn, run tay, tự sát, hoặc quay súng lại. The Corp giải quyết chuyện đó như giải quyết một lỗi kỹ thuật: nó không sửa cái đầu, nó khoá cái mặt. Trong cấu hình của Tài sản 07 có một tham số giữ nét mặt ở một trạng thái cố định, chọn sao cho tài sản vận hành ổn định nhất trong thời gian dài.',
        'Trạng thái được chọn là cười.',
        'Sáu năm, mỗi lần Tài sản 07 hoàn thành một việc, cái mặt ấy vẫn ở đó. Nó không phải cảm xúc. Nó là một dòng cấu hình.',
        'Rồi Psalm bẻ vòng Halo của cô, hai người rơi xuống đáy, Wire hàn lại chỗ gãy đủ để nó thôi rò điện xuống sống lưng, và cái vòng ấy từ đó không phát đi đâu nữa.',
        'Nụ cười thì ở lại.',
        'Đó mới là chuyện đáng sợ, và Kira là người duy nhất trong tổ hiểu vì sao nó đáng sợ. Cái mặt cô đang mang bây giờ không còn ai điều khiển nữa. Nghĩa là hoặc nó đã thành của cô, hoặc nó vốn là của cô ngay từ trước cả cái vòng — và hồ sơ về con bé bảy tuổi trong ngõ thì không giúp cô loại trừ khả năng nào cả.' ] },
      { t:'VII · Ca ba trăm mười ba', p:[
        'Trên Spire có một căn buồng mà lính Choir sợ hơn cả lò tái chế. Unit nào hát lạc điệu thì bị dẫn vào đó, kể hết, rồi không đi ra.',
        'Người ngồi nghe là Psalm. Ba trăm mười hai ca, hồ sơ ghi không sai sót.',
        'Ca thứ ba trăm mười ba là Tài sản 07.',
        'Kira không xưng tội. Không phải vì bướng — vì cô không có gì để xưng. Muốn kể tội thì phải nhớ mình đã làm gì, mà cô thì không được phép nhớ. Cô ngồi đó, nhìn người đàn bà vai máy mắt đỏ ngồi đối diện, và trong đầu chỉ có đúng một câu hỏi tự nó nổi lên, không ai gài vào cả.',
        'Cô hỏi: bà có đếm không.',
        'Psalm ngồi im mười giây.',
        'Về sau, khi hai người đã ở cùng một tổ, Kira có hỏi lại bà rằng lúc ấy bà nghĩ gì. Psalm trả lời: tôi nghĩ là cô đang cười. Và tôi nghĩ, cái thứ khiến một đứa bé vừa cười vừa hỏi tôi câu đó thì không phải đứa bé, mà là thứ chúng tôi lắp lên đầu nó.' ] },
      { t:'VIII · Rơi', p:[
        'Psalm đưa tay lên đầu mình trước, giật đứt vòng Halo của chính bà. Rồi bà bẻ vòng của Kira. Rồi bà đạp bung tấm sàn ống rác.',
        'Hai người rơi.',
        'The Corp không gọi đó là bỏ trốn hay phản bội. Nó ghi một mã lỗi: APOSTASY. Kẻ bội giáo.',
        'Kira tiếp đất ở đáy District 07, giữa một bãi xe hỏng, bất tỉnh, vòng Halo hạng S gãy đôi vẫn nằm trên đầu. Tổ nhặt sắt của Ronin tìm thấy cô sáng hôm sau.',
        'Ash là người nói trước: tháo lõi, bán. Một cái Halo hạng S nuôi cả tổ nửa năm, mà The Corp thì sẽ lùng nó trước sáng mai — giữ con bé lại là mang cả Spire về nhà. Ash nói không sai một chữ nào.',
        'Ronin lắc đầu. Anh không giải thích. Luật tổ chỉ có một điều, và điều đó là không tháo người.',
        'Wire lấy đồ nghề ra, hàn chỗ gãy, và không hỏi gì cả. Mãi về sau Kira mới biết vì sao Wire không hỏi.' ] },
      { t:'IX · Cái nào là của tôi', p:[
        'Bây giờ Kira đi cùng tổ của Operator, xếp hàng như mọi người, và cô đang tìm một đầu mối cấp cao của The Corp. Để làm gì thì cô nói thẳng, không vòng vo: để trả thù cho bố mẹ cô.',
        'Nhưng có một việc khác cô làm mà cô không nói với ai, trừ một lần.',
        'Một đêm cô sang chỗ Echo và bảo: mở bản thu đi.',
        'Echo hỏi bản nào. Kira nói: bản gốc. Cái thu hồi tôi bảy tuổi.',
        'Echo mở. Trong loa là giọng một đứa bé, hơi khàn, có tiếng cười giấu ở cuối câu, đang đọc mấy chữ vô nghĩa cho người ta đo mức âm.',
        'Kira nghe hết. Rồi nghe lại. Rồi ngồi im rất lâu.',
        'Cuối cùng cô nói: nó cũng đang cười.',
        'Echo không đáp, vì không có câu nào đáp được. Cái vòng Halo chưa được lắp vào đầu con bé ấy. Cấu hình chưa tồn tại. Và nó vẫn cười.',
        'Kira đứng dậy, cảm ơn, đi ra. Ở cửa cô dừng lại và nói thêm một câu, giọng vẫn nhẹ như mọi khi: tôi không định biết chúng đã lấy đi cái gì. Tôi định biết cái nào chúng chưa từng đưa.' ] },
      { t:'X · Ishi', p:[
        'Đứa thứ năm chạy khỏi con ngõ đêm đó và chạy thẳng về chỗ Ishi. Đó là chuyện Kira tính trước.',
        'Băng Neo Tokyo đã ở quận SIS đủ lâu. Ishi cầm băng đó từ trước cái đêm nhà cô cháy, và một người cầm băng thì phải biết đêm ấy khu mình có ai vào, ai ra, ai được trả tiền để nhìn chỗ khác. Kira không cần Ishi chết. Cô cần Ishi nói.',
        'Cả tổ đều biết chuyện này có thể hỏng theo nhiều cách. Ronin bảo để anh đi cùng. Ash hỏi thẳng: nếu hắn không nói thì sao. Kira suy nghĩ thật, nghĩ khá lâu, rồi trả lời rất thành thật rằng cô không biết, và đó là lý do cô muốn có người đứng cạnh.',
        'Nên bây giờ ở quận SIS có một lời đồn mới, và lần này nó không dùng để doạ trẻ con.',
        'Lời đồn nói rằng nếu có một con bé tóc trắng đeo hai thanh kiếm mỉm cười với bạn, thì chạy đi. Không phải vì bạn là mục tiêu của nó.',
        'Mà vì bạn là một mảnh ký ức nó đang cố nhớ lại, và nó sẽ lấy bằng được.' ] },
    ],
    voice:'"Hop! Skip! Jump! Oh... you\'re dead already?"' },
  psalm: { epithet:'Người nghe xưng tội',
    profile:'Ba trăm mười hai unit đã kể hết mọi chuyện cho bà rồi bị xoá. Đến lượt thứ ba trăm mười ba, bà xoá chính mình khỏi The Corp.',
    story:'Có một căn buồng trên Spire mà lính Choir sợ hơn cả lò tái chế. Buồng xưng tội. Unit nào hát lạc điệu sẽ bị dẫn vào đó, kể hết, rồi không bao giờ đi ra. Người ngồi nghe suốt bao năm là Psalm. Vai máy, mắt đỏ, lõi đỏ, và một bàn tay chưa bao giờ run khi nhấn nút. Hồ sơ ghi: ba trăm mười hai ca, không sai sót.\n\nCa thứ ba trăm mười ba là một con bé cầm kiếm tên Tài sản 07. Nó không xưng tội. Nó hỏi: bà có đếm không? Psalm ngồi im mười giây. Rồi bà làm cái việc mà không unit nào từng làm: đưa tay lên đầu, giật đứt vòng Halo của chính mình, đạp bung sàn ống rác. Hai người rơi. The Corp gọi chuyện đó bằng một mã lỗi: APOSTASY. Kẻ bội giáo.\n\nGiờ bà ở đâu ư? Ở Free Zone, trong tổ của Operator, xếp hàng như mọi người. Vòng Halo đỏ trên đầu bà không còn phát gì nữa. Wire xin sửa, bà lắc đầu. Stitch xin xem, bà gật. Còn ai hỏi bà có hối hận không, bà chỉ nói: tha thứ là thứ The Corp bán. Tôi không mua.',
    voice:'"Xưng tội đi. Đùa thôi. Tôi bỏ nghề rồi."' },
  ronin: { epithet:'Trưởng tổ nhặt sắt',
    profile:'Không cấy ghép, không Halo, một thanh kiếm thép và một câu dặn của người chị. Cả Free Zone tin tổ của anh, vì tổ của anh không tháo người.',
    story:'Ở Free Zone, muốn biết ai đáng tin thì nhìn vào tay. Tay Ronin không có lấy một mảnh chrome. Anh từ chối tất cả, từ mắt hồng ngoại cho tới khớp gối tăng lực, và chiến đấu bằng một thanh kiếm thép rèn ở tầng âm bốn. Kiếm của chị anh. Người chị duy nhất trong xóm được The Corp "tuyển" lên Spire, để lại thanh kiếm và một câu: đừng bán thứ gì còn ấm. Rồi không về.\n\nMười chín tuổi, Ronin lập tổ nhặt sắt với Ash và một chiếc xe kéo hỏng. Luật tổ chỉ có một điều: không tháo người. Vì thế mà nghèo hơn mọi băng khác. Cũng vì thế mà khi Muzzle bị The Corp đá xuống, khi Kira nằm bất tỉnh giữa bãi xe, người ta đều mang tới chỗ Ronin.\n\nAnh có ghét máy móc không ư? Không. Anh chỉ muốn chắc một điều: mỗi nhát chém là của anh, không phải của một bài ca nào đó viết sẵn. Và đêm ở cổng Đông, chính anh là người đầu tiên gật đầu để một kẻ không Halo, không kiếm, ra lệnh cho cả tổ.',
    chronicleTitle:'RONIN — ĐỪNG BÁN THỨ GÌ CÒN ẤM',
    chronicle:[
      { t:'I · Luật một điều', p:[
        'Bãi xe tầng âm bảy, một buổi chiều. Có hai gã kéo tới một cái xe đẩy phủ bạt, và dưới lớp bạt là một người còn thở.',
        'Chúng nói giá luôn, không vòng vo: thằng này sắp đi rồi, trong người có bộ lọc gan còn tốt với một cặp mắt hồng ngoại loại khá. Tổ nào cũng nhận. Chia đôi.',
        'Ronin nhìn cái xe đẩy, rồi nhìn hai gã, rồi bảo: mang nó vào trong. Chỗ Stitch. Tôi trả tiền chuyến.',
        'Một trong hai gã cười, bảo anh điên. Gã kia thì tính nhanh hơn, hỏi thẳng: thế bọn tôi được gì.',
        'Ronin nói: không được gì.',
        'Tuần đó tổ ăn đồ hộp hết hạn. Ash ghi vào sổ chi tiêu ba chữ, gạch chân hai lần, và không nói gì suốt hai ngày. Người kia thì sống, và đến giờ vẫn đang kéo hàng ở khu cổng Đông, không biết mình từng nằm dưới tấm bạt đó.',
        'Luật của tổ Ronin chỉ có một điều, và ai vào tổ cũng được nghe đúng một lần: không tháo người.' ] },
      { t:'II · Người chị', p:[
        'Nhà Ronin có hai chị em. Chị anh là người duy nhất trong xóm được The Corp tuyển lên Spire.',
        'Cả khu ăn mừng. Được tuyển lên trên nghĩa là có ăn, có thuốc, có tên trong một danh sách nào đó thay vì không có gì. Người ta gói cho chị anh một túi đồ, tiễn tới tận cổng vành đai, và có người còn nhờ chị nếu gặp được ai ở trên thì nói giúp cho con họ một tiếng.',
        'Trước lúc đi, chị đưa cho anh thanh kiếm thép rèn ở tầng âm bốn, thứ đắt nhất nhà, và dặn anh một câu.',
        'Đừng bán thứ gì còn ấm.',
        'Rồi chị đi. Rồi không về.',
        'Không có thư. Không có tin. Không có một dòng nào trong bất kỳ hệ thống nào để tra. Ronin có hỏi. Anh hỏi suốt ba năm, hỏi khắp mọi cửa mà một thằng nhóc tầng âm bảy có thể gõ, và câu trả lời đầy đủ nhất anh nhận được là một cái nhún vai.' ] },
      { t:'III · Một câu không rõ nghĩa', p:[
        'Chuyện Ronin không kể với ai là anh không chắc mình hiểu đúng câu ấy.',
        'Đừng bán thứ gì còn ấm. Chị anh nói câu đó trong lúc đưa thanh kiếm, nên rất có thể chị chỉ đang dặn về cái chuôi kiếm bọc da, thứ mà đem cầm đồ thì được kha khá. Rất có thể đó là một câu dặn hết sức bình thường của một người sắp đi xa, và anh đã dựng cả một đời lên trên nó.',
        'Nhưng một cái xác thì cũng ấm. Trong vài giờ.',
        'Và ở tầng âm bảy, thứ ấm ấy có giá cụ thể, tính theo bộ phận, ai cũng biết bảng giá.',
        'Nên anh chọn cách hiểu thứ hai. Không phải vì anh chắc. Vì trong hai cách hiểu, chỉ có một cách khiến anh chịu được việc phải nhìn mặt mình mỗi sáng.' ] },
      { t:'IV · Mười chín tuổi', p:[
        'Tổ nhặt sắt của Ronin bắt đầu bằng ba thứ: một chiếc xe kéo gãy trục, Ash, và một tấm biển viết tay treo ở bãi xe.',
        'Ash lúc ấy mười bảy, vừa ra khỏi xưởng tháo dỡ tầng âm sáu, biết định giá mọi thứ trên đời theo bộ phận. Cô đọc cái luật một điều rồi hỏi anh có biết luật đó làm tổ nghèo hơn mọi băng khác trong khu không.',
        'Anh bảo biết.',
        'Cô hỏi thế thì sao vẫn làm.',
        'Anh không trả lời được. Anh mới mười chín, và mười chín tuổi thì chưa có câu trả lời nào nghe cho ra hồn. Anh chỉ đứng đó.',
        'Ash ở lại. Mười năm sau cô vẫn ở lại, vẫn ghi sổ chi tiêu, vẫn gạch chân hai lần mỗi lần tổ mất tiền vì cái luật ấy, và vẫn chưa bỏ đi lần nào.' ] },
      { t:'V · Những thứ anh từ chối', p:[
        'Người ta chào hàng Ronin nhiều lần, và món nào cũng hợp lý.',
        'Mắt hồng ngoại: nhìn được trong đường ống, riêng cái đó thôi đã cứu mạng vài lần. Khớp gối tăng lực: nhảy được hai tầng giàn giáo, đỡ mất bốn phút đi vòng. Cấy phản xạ: nhanh hơn một phần mười giây, mà một phần mười giây thì đủ để không chết.',
        'Anh từ chối hết. Từng món một, không lần nào do dự, và cũng không lần nào giải thích dài.',
        'Anh không ghét máy móc. Đây là chỗ hầu hết mọi người hiểu sai về anh, kể cả người trong tổ. Anh hàn cho Junker. Anh giữ Muzzle lại dù nửa người Muzzle là đồ The Corp. Anh chưa từng nói một câu nào về chrome của ai.',
        'Cái anh không muốn chỉ có một thứ, và nó gọn đến mức anh nói được trong một câu: mỗi nhát chém phải là của anh, không phải của một bài ca nào đó viết sẵn.',
        'Anh đã nhìn thấy lính Choir đánh nhau. Chúng đánh rất giỏi. Chúng đánh giỏi hơn anh, đồng đều hơn anh, không mệt như anh. Và không có nhát nào trong đó là của chúng cả.' ] },
      { t:'VI · Muzzle', p:[
        'Muzzle đi bộ xuống Free Zone với bộ giáp The Corp chưa kịp lột và một tấm khiên anh tự hàn, vì mười bốn năm gác cổng không sót một ca đổi được đúng một dòng biên bản: hành vi ngoài chỉ thị, chấm dứt hợp đồng.',
        'Người ta chỉ anh tới chỗ Ronin. Không phải vì tổ Ronin giàu — tổ Ronin nghèo nhất khu. Vì ở tầng âm bảy, ai cũng biết một điều: mang một người còn thở tới chỗ Ronin thì người đó ra khỏi đó vẫn còn đủ bộ phận.',
        'Ronin cho Muzzle chỗ ngủ. Ash cho việc. Không ai hỏi anh mười bốn năm ấy anh đã đứng gác cho ai, và Muzzle cũng không kể.',
        'Mãi rất lâu sau Muzzle mới hỏi Ronin một câu: sao hôm đó anh nhận tôi mà không hỏi gì.',
        'Ronin bảo: vì anh đi bộ xuống. Người của The Corp thì có xe.' ] },
      { t:'VII · Con bé trong bãi xe', p:[
        'Sáng hôm ấy tổ tìm thấy một đứa con gái nằm bất tỉnh giữa đống xác xe, nửa người bằng chrome, và trên đầu là một vòng Halo hạng S gãy đôi.',
        'Ash nói trước, và Ash nói đúng từng chữ: tháo lõi, bán, một cái vòng hạng S nuôi cả tổ nửa năm, mà giữ con bé này lại thì trước sáng mai The Corp sẽ mang cả Spire xuống đây tìm. Không có chỗ nào trong câu đó sai cả.',
        'Ronin lắc đầu.',
        'Anh không tranh luận, không viện luật tổ, không nói gì về đạo đức. Anh chỉ ngồi xuống cạnh con bé, đặt tay lên cổ nó xem còn mạch không, rồi bảo Junker lấy xe.',
        'Về sau Kira có hỏi anh vì sao. Anh trả lời như trả lời một câu hỏi về thời tiết: em còn ấm.',
        'Kira không hiểu câu đó. Cả tổ chỉ có Ash hiểu, và Ash thì không giải thích cho ai.' ] },
      { t:'VIII · Cổng Đông', p:[
        'Đêm ấy tổ bị bốn chục tên Scav vây kín trong bãi xe. Muzzle đã gãy tấm khiên thứ hai. Ash còn đúng một quả mìn. Ronin đã tính xong đường rút, và đường rút của anh là đứng lại chặn để bốn người kia chạy.',
        'Rồi có một kẻ lạ hoắc bước ra từ sau đống xác xe, tay cầm một chiếc deck đen sì của The Corp, và bảo cả tổ nghe theo mình.',
        'Chuyện xảy ra sau đó thì cả Free Zone vẫn kể. Chuyện không ai kể là khoảnh khắc trước đó, khi bốn người trong tổ quay sang nhìn Ronin, vì trong tổ ai ra lệnh thì cả tổ đã biết từ mười năm nay.',
        'Ronin nhìn kẻ lạ. Nhìn chiếc deck. Nhìn cái đầu không có vòng Halo nào của kẻ ấy.',
        'Rồi anh gật.',
        'Anh không giải thích cái gật đó cho ai, và nếu có ai hỏi thì anh sẽ trả lời cụt lủn rằng lúc ấy không còn lựa chọn nào khác — chuyện đó đúng, nhưng không phải lý do. Lý do là anh vừa nhìn thấy một người ra lệnh cho cả một tổ mà không cần lắp vòng lên đầu ai cả.',
        'Anh đã đợi mười năm để biết chuyện đó có làm được không.' ] },
      { t:'IX · Nửa nhịp', p:[
        'Ngày Echo vào tổ thì có một chuyện không hay xảy ra, và người trong cuộc không nói ra.',
        'Giữa trận, Echo hô một câu. Ronin quay đầu lại — vì đó là giọng Kira, mà Kira thì đang đứng ở hướng khác. Anh mất nửa nhịp. Nửa nhịp ấy đủ để một con Chorister chạm được vào sườn anh.',
        'Anh không trách Echo. Anh cũng không kể với ai. Trận sau, anh lặng lẽ đổi chỗ đứng của mình sang bên phải Echo, để tai trái anh hướng ra ngoài, và từ đó không lệch nhịp lần nào nữa.',
        'Echo biết. Cô không nói cảm ơn, vì nói cảm ơn thì thành ra bắt anh thừa nhận anh đã lệch.',
        'Còn Nyx thì hỏi thẳng anh, kiểu Nyx vẫn hỏi: anh không có Halo, vậy anh chọn cảm thấy gì?',
        'Ronin nghĩ một lúc rồi bảo: hôm nay chọn mệt. Mai chọn lại.',
        'Nyx thích câu đó tới mức ghi lại. Cô bảo được chọn lại là một cái luật hay.' ] },
      { t:'X · Anh đi lên', p:[
        'Bây giờ tổ đang đi lên, từng tầng một, và Ronin chưa lần nào nói ra lý do của riêng anh.',
        'Cả tổ đều biết. Ash biết từ lâu nhất. Muzzle đoán ra ở chương hai. Stitch thì không cần đoán, vì Ronin có một lần nằm trên bàn mổ của bà, thuốc chưa hết tác dụng, và người ta nói nhiều thứ trên cái bàn ấy — bà chép vào sổ, buộc dây cao su, và không đọc lại.',
        'Trên Spire có một cái danh sách những người được tuyển lên. Danh sách ấy có tên chị anh, và chỉ có một cách để đọc nó.',
        'Anh không nói với ai rằng anh đang đi tìm chị. Anh nói anh đang chém. Và anh chém thật — không có cấy phản xạ, không có mắt hồng ngoại, không có khớp gối tăng lực, chỉ có một thanh thép rèn ở tầng âm bốn và một câu dặn mà anh vẫn chưa chắc mình hiểu đúng.',
        'Nhưng có một chuyện anh đã chắc từ lâu rồi, và nó là lý do anh chịu được cái không chắc kia.',
        'Nếu hiểu sai, thì anh sai theo hướng ít người chết hơn.' ] },
    ],
    voice:'"Cậu quyết đi, Operator. Tôi chém."' },
  ash: { epithet:'Thợ nổ',
    profile:'Cô định giá được mọi thứ theo từng bộ phận. Trừ cái tổ này. Và cô ghét việc mình không định giá được nó.',
    story:'Xưởng tháo dỡ tầng âm sáu không phân biệt xe với người. Cái gì cũng có giá theo bộ phận, hết giá thì tháo. Ash lớn lên ở đó, học nghề nổ ở đó, và học được một điều mà cô mang theo suốt đời: nhìn một thứ thì phải thấy giá của nó trước, rồi mới thấy nó là gì.\n\nĐêm tổ nhặt được Kira, chính Ash là người nói: tháo lõi, bán. Một cái Halo hạng S nuôi cả tổ nửa năm, còn The Corp thì sẽ lùng nó trước sáng mai. Ronin lắc đầu. Cô im. Không phải vì chịu thua. Mà vì cô biết, nếu người nằm trên bàn là Ronin, cô sẽ nói ngược lại.\n\nHai bàn tay cô đầy sẹo bỏng. Chuyện gì ư? Một quả mìn do chính cô châm, một đường hầm sập sớm hơn tính toán, và Muzzle kẹt bên trong. Cô không kể với ai. Chỉ là từ hôm đó, Muzzle ngã lần nào là có cô đứng dậy trước lần ấy. Tối tối, cô vẫn cho lũ chó hoang sau bãi xe ăn. Ai hỏi thì cô bảo: cho chúng no để chúng không cắn hàng.',
    chronicleTitle:'ASH — TRANG CUỐI CUỐN SỔ',
    chronicle:[
      { t:'I · Xưởng tháo dỡ tầng âm sáu', p:[
        'Trên vách xưởng tháo dỡ tầng âm sáu có một tấm bảng gỗ, và trên tấm bảng là bảng giá.',
        'Cột trái ghi bộ phận. Cột phải ghi giá. Trục truyền, hộp số, bơm dầu, ắc quy. Rồi xuống dưới nữa, cùng một nét chữ, cùng một cách kẻ dòng: bộ lọc gan, phổi phụ, khớp gối, giác mạc.',
        'Không ai ở xưởng thấy chuyện đó lạ. Xe hỏng thì tháo, người hết giá thì cũng tháo, và cả hai đều nằm trên cùng một tấm bảng vì kế toán thì chỉ có một cuốn sổ.',
        'Ash lớn lên dưới tấm bảng ấy. Cô học đọc bằng nó.',
        'Đến năm mười hai tuổi thì cô đã làm được cái việc mà thợ cả ở đó mất mười năm mới làm được: nhìn một thứ và thấy giá của nó trước, rồi mới thấy nó là cái gì. Người ta khen cô có mắt. Đó là lời khen, và cô nhận nó như nhận một lời khen.' ] },
      { t:'II · Cái ngày cô định giá đúng', p:[
        'Chuyện xảy ra vào một buổi chiều bình thường. Người ta kéo vào xưởng một cái xe đẩy, và trên xe là một ông thợ hàn ca sáng bị điện giật, chết trước đó chừng hai tiếng.',
        'Ash nhìn ông một cái, và cái nhìn ấy tự làm việc của nó trước khi cô kịp ngăn.',
        'Giác mạc còn tốt. Khớp gối trái đã thay, loại cũ nhưng bán được. Bộ lọc gan thì hỏng rồi, ông uống nhiều.',
        'Cô đọc xong ba dòng ấy trong đầu, rồi mới nhận ra dòng thứ tư: đây là ông Khảm, người tháng nào cũng cho cô một nửa cái bánh trong hộp cơm của ông, suốt bốn năm liền, và chưa lần nào nói gì cả.',
        'Cô không khóc. Cô cũng không bỏ chạy. Cô đứng đó và đợi cho cái bảng giá trong đầu mình tắt đi, mà nó thì không tắt.',
        'Từ hôm ấy Ash biết một chuyện về bản thân mà cô chưa từng nói với ai trong tổ: cái mắt kia không phải kỹ năng cô học. Nó là thứ đã lắp vào cô rồi, không tháo ra được, và nó chạy kể cả khi cô không muốn.' ] },
      { t:'III · Mười bảy tuổi', p:[
        'Cô bỏ xưởng năm mười bảy, mang theo hai thứ: nghề nổ, và tấm bảng giá không tắt được kia.',
        'Thằng nhóc mười chín tuổi ở bãi xe có một chiếc xe kéo gãy trục và một tấm biển viết tay. Trên biển là luật của tổ, đúng một điều: không tháo người.',
        'Ash đọc xong thì bật cười. Rồi cô hỏi anh có biết cái luật đó làm tổ nghèo hơn mọi băng khác trong khu không.',
        'Anh bảo biết.',
        'Cô hỏi thế sao vẫn làm.',
        'Anh không trả lời được. Anh mới mười chín, và cô nhìn ra ngay là anh không có câu trả lời nào cả, chỉ có một câu dặn của ai đó mà anh bám vào.',
        'Lẽ ra cô phải đi. Một tổ do một thằng nhóc không biết giải thích luật của chính nó cầm đầu thì định giá rất thấp.',
        'Cô ở lại. Cô không giải thích được vì sao, và mười năm sau vẫn chưa giải thích được.' ] },
      { t:'IV · Gạch chân hai lần', p:[
        'Ash giữ sổ chi tiêu của tổ. Không ai giao việc đó cho cô, cô tự nhận, vì trong tổ không ai khác cộng nổi ba con số mà không sai.',
        'Trong sổ có một quy ước chỉ mình cô hiểu. Khoản nào tổ mất tiền vì cái luật một điều thì gạch chân hai lần.',
        'Chuyến hàng bỏ dở vì phải chở người đi cấp cứu: gạch chân hai lần. Cái lõi Halo không tháo: gạch chân hai lần. Tiền chuyến trả cho hai gã kéo xe đẩy đến bãi, cái hôm tổ ăn đồ hộp hết hạn cả tuần: gạch chân hai lần.',
        'Mười năm. Mấy trăm dòng. Cô cộng lại được, và cô đã cộng lại, nhiều lần, vào những đêm không ngủ.',
        'Nhưng có một chuyện trong mười năm ấy chưa xảy ra lần nào: cô chưa một lần đề nghị bỏ cái luật.',
        'Cô ghi. Cô gạch chân. Cô đưa sổ cho Ronin xem mỗi cuối tháng, đúng con số, không bớt một đồng. Rồi cô cất sổ đi và sáng hôm sau vẫn đi làm.' ] },
      { t:'V · Đường hầm', p:[
        'Vụ ấy tính toán sai đúng bốn giây.',
        'Tổ cần mở một lối xuyên qua vách bê tông ở tầng âm năm, và Ash là người đặt mìn, tính lượng, đếm ngược. Cô đã làm việc đó vài chục lần. Lần này cô tính lượng thuốc theo độ dày vách mà không tính tới việc phía sau vách là một khoang rỗng.',
        'Vách sập sớm hơn bốn giây. Bốn giây ấy là quãng đường Muzzle chưa ra khỏi hầm.',
        'Cô lao vào. Không có găng, không có gì che, chỉ có hai bàn tay và một khối bê tông đang nóng đỏ ở mép vỡ. Cô bới bằng tay trần trong mười bảy phút cho tới khi Ronin kéo được cô ra và mấy người khác kéo được Muzzle ra.',
        'Muzzle sống. Gãy ba xương sườn, bỏng vai, nhưng sống.',
        'Hai bàn tay Ash thì không lành lại được như cũ. Stitch vá hết mức có thể, rồi bảo cô từ giờ nên đeo găng, không phải để giấu mà để đỡ nứt.',
        'Cô đeo găng từ đó. Hở ngón, vì phải sờ được dây.' ] },
      { t:'VI · Đứng dậy trước', p:[
        'Ash không kể chuyện bốn giây ấy với ai. Không phải vì sợ bị trách — tổ không phải loại trách nhau. Vì kể ra thì thành ra cô xin được tha, mà cô thì không nghĩ mình nên được tha.',
        'Nên cô làm một việc khác, và cô làm nó suốt từ đó tới giờ.',
        'Trận nào cũng vậy: Muzzle ngã xuống, thì trước khi anh kịp chống tay đứng lên, Ash đã đứng dậy rồi. Cô đứng dậy trước anh. Lần nào cũng thế, kể cả những lần cô ngã đau hơn anh.',
        'Muzzle biết. Anh biết từ lâu rồi, và anh chưa từng nói ra, vì nói ra thì cô sẽ thôi làm.',
        'Có một lần duy nhất anh nói gần tới. Sau trận ở hàng rào The Corp, lúc tấm khiên Bà Hai vỡ, anh ngồi thở dốc và bảo: cô đứng dậy nhanh quá đấy, Ash.',
        'Cô đáp: anh chậm quá đấy, Muzzle.',
        'Rồi cả hai không nói gì thêm.' ] },
      { t:'VII · Con bé trong bãi xe', p:[
        'Sáng hôm đó, cái mắt của Ash làm việc của nó trước khi cô kịp ngăn, y như mọi lần.',
        'Nửa người bằng chrome, loại khớp êm không kêu, hàng trên Spire. Một vòng Halo hạng S gãy đôi — riêng cái lõi nuôi cả tổ nửa năm. Và một thanh kiếm không số hiệu, thứ này khó bán nhưng bán được.',
        'Cô nói ra. Cô nói to, trước mặt cả tổ, không giấu chữ nào: tháo lõi, bán. Giữ con bé này lại thì trước sáng mai The Corp mang cả Spire xuống đây tìm.',
        'Không có chỗ nào trong câu đó sai. Ronin lắc đầu.',
        'Ash im. Cả tổ tưởng cô chịu thua.',
        'Cô không chịu thua. Cô im vì đúng lúc ấy cô nhận ra một chuyện, và cái chuyện đó thì đáng sợ hơn nhiều so với việc bị Ronin bác: nếu người nằm trên đống xác xe kia là Ronin, thì cô đã nói ngược lại. Cũng giọng ấy, cũng chắc chắn ấy, cũng không sai chỗ nào.',
        'Nghĩa là cái bảng giá trong đầu cô có ngoại lệ. Mà một bảng giá có ngoại lệ thì không còn là bảng giá nữa.',
        'Cô ghét việc đó. Cô vẫn ghét nó tới giờ.' ] },
      { t:'VIII · Để ở cửa, không gõ', p:[
        'Có một danh sách những thứ Ash để ở cửa nhà người khác rồi đi, không gõ, không nói.',
        'Một thùng pin ở cửa container của Stitch, tuần nào cũng có, từ cái hôm bà hỏi cô định giá một người không có gì để trả bằng bao nhiêu và cô không đáp được.',
        'Một cái áo mới, gấp phẳng, để ở cùng chỗ, sau lần cô nhìn thấy tay áo trái của bà dày tới mức vướng lúc mổ. Cái áo đó Stitch không mặc. Nó vẫn nằm trong container, còn nguyên nếp gấp. Ash biết. Cô không mua cái thứ hai.',
        'Nửa hộp thuốc giảm đau ở chỗ Toll, cái đêm sau ca cắt tay.',
        'Một cuộn băng dính bạc ở chỗ Wire, loại tốt, khó kiếm.',
        'Cô không bao giờ gõ cửa. Ai hỏi thì cô bảo tiện đường. Không ai trong tổ tin câu đó, kể cả Muzzle, mà Muzzle thì tin gần như mọi thứ.' ] },
      { t:'IX · Lũ chó sau bãi xe', p:[
        'Tối nào Ash cũng ra sau bãi xe cho lũ chó hoang ăn. Đều đặn, không sót tối nào, kể cả tối vừa đánh nhau về.',
        'Ai hỏi thì cô có sẵn câu trả lời, và câu ấy nghe rất giống cô: cho chúng no để chúng không cắn hàng.',
        'Chuyện là thế này. Sau bãi xe không còn hàng nữa. Kho ấy dọn từ ba năm trước, chỗ đó bây giờ chỉ là một khoảng đất trống với mấy cái khung xe han gỉ, và không có gì để cắn cả.',
        'Cô vẫn ra. Tối nào cũng ra.',
        'Kai có lần đi theo, thấy hết, rồi về kể lại với Kira như kể một chuyện buồn cười. Kira nghe xong không cười. Con bé chỉ bảo: đừng nói với chị ấy là mày biết.' ] },
      { t:'X · Trang cuối cuốn sổ', p:[
        'Trong cuốn sổ chi tiêu của tổ, trang cuối cùng bị gấp mép và không bao giờ đưa cho Ronin xem.',
        'Trên trang đó là một phép tính, viết bằng bút chì, xoá đi viết lại nhiều lần đến mức giấy mỏng hẳn. Nó liệt kê từng người trong tổ, từng bộ phận, từng món đồ, theo đúng cách tấm bảng gỗ ở tầng âm sáu đã dạy cô. Chrome của Kira. Vòng Halo đỏ của Psalm. Bộ giáp Muzzle chưa lột. Khung gầm của Junker. Bốn cái tay của Stitch. Cả cô nữa, cô cũng ghi cả cô vào, hai bàn tay sẹo bỏng định giá rất thấp.',
        'Cô đã cộng xong con số ấy từ lâu. Nó nằm đó, tròn trịa, đúng đến từng đồng.',
        'Nó là dòng duy nhất trong cả cuốn sổ không được gạch chân.',
        'Vì gạch chân hai lần nghĩa là tổ đã mất tiền vì cái luật một điều, mà tới dòng này thì cô không còn quyết được là tổ đang mất hay đang được, và Ash thì không gạch chân một con số cô chưa hiểu.',
        'Ronin có một lần nhìn thấy trang ấy. Anh không đọc, chỉ hỏi cô đang tính gì.',
        'Cô bảo: đang tính.',
        'Mười năm rồi, và cô vẫn đang tính.' ] },
    ],
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
    chronicleTitle:'STITCH — HAI CUỐN SỔ',
    chronicle:[
      { t:'I · Ca trực đêm', p:[
        'Bệnh viện tầng âm hai, hai giờ sáng, ca trực của bác sĩ Stitch. Một unit Choir bò vào phòng cấp cứu bằng hai tay, kéo theo hai chân không còn nghe lệnh, và trên đầu nó là một vòng Halo gãy làm đôi.',
        'Quy trình có ba bước, in trên tường, chữ to. Bước một: không can thiệp. Bước hai: báo The Corp. Bước ba: giữ nguyên hiện trạng cho tới khi đội thu hồi tới.',
        'Stitch đọc ba bước ấy mỗi ca trực suốt mười một năm. Bà thuộc lòng.',
        'Bà kéo rèm lại, cố định hai đốt sống cổ, nối tạm dây thần kinh chân, cầm máu, và khâu bốn mươi hai mũi. Hết hai tiếng. Xong bà đi ra hành lang sau, mở cái cửa dẫn ra đường ống thoát nước, rồi quay lại lau bàn.',
        'Bà không nói gì với cái unit đó. Nó cũng không nói gì với bà. Nó chỉ nhìn cái cửa đang mở, rồi nhìn bà, rồi đi.' ] },
      { t:'II · Buổi sáng hôm sau', p:[
        'Không có ai tới bắt bà. Đó là điều bà nhớ rõ nhất.',
        'Chín giờ sáng, hệ thống báo giấy phép hành nghề bị thu hồi. Chín giờ mười, tên bà biến khỏi danh bạ y tế của cả thành phố. Chín giờ hai mươi, thẻ cửa không mở được nữa, và bà đứng ngoài hành lang tầng âm hai với một cái hộp giấy.',
        'Không có phiên toà. Không có ai giải thích. The Corp không cần làm cái việc dài dòng đó — nó chỉ cần rút một cái tên ra khỏi một danh sách, và thế là xong một đời người.',
        'Điều bà làm tiếp theo thì mãi sau này mới có người hỏi. Trên đường ra, bà rẽ qua kho thiết bị, mở tủ, và lấy đi một bộ giá đeo lưng bốn tay phẫu thuật nhiều khớp. Tài sản bệnh viện, có số kiểm kê, dán tem.',
        'Bà ăn cắp nó. Bà biết bà đang ăn cắp nó. Bà vẫn lấy, vì cái thứ ở tầng âm bảy không có là cái thứ đó.' ] },
      { t:'III · Cái container', p:[
        'Phòng khám của bà là một cái container xếp cạnh bãi xe ở tầng âm bảy. Trần dột hai chỗ. Bàn mổ là một tấm cửa xe tải kê lên hai thùng phuy, lau bằng cồn công nghiệp trước mỗi ca.',
        'Bốn cái tay thì bà gắn lên giá treo bên trên bàn: một cái cầm kim dài, một cái cầm cưa xương, một cái kẹp, một cái mỏ đốt cầm máu. Bốn tay ấy làm được cùng lúc bốn việc mà một người chỉ làm được hai. Ở tầng âm bảy thì đó là khác biệt giữa cứu được và không.',
        'Dân trong xóm gọi chỗ đó là chỗ bà bốn tay. Bà không thích cái tên ấy lắm, nhưng bà không sửa, vì sửa thì mất thời gian mà thời gian thì đang có người chảy máu.' ] },
      { t:'IV · Bảng giá', p:[
        'Bảng giá của Stitch viết bằng sơn trắng trên vách container, và nó chỉ có một dòng:',
        'Trả được gì thì trả.',
        'Người ta trả bằng shard, bằng pin, bằng thuốc, bằng đồ hộp, bằng một buổi trông cửa, bằng nửa cái mô-tơ. Ai không có gì thì bà nhận một câu chuyện. Một câu chuyện có thật, của chính người đó, kể xong là hết nợ.',
        'Ash có lần bảo cái giá đó là giá dở nhất bà từng nghe, và Ash là người định giá được mọi thứ. Stitch nghe xong thì hỏi lại: thế cô định giá một người không có gì để trả bằng bao nhiêu.',
        'Ash không đáp. Nhưng từ hôm đó, mỗi lần tổ đi qua container, cô đều để lại một thùng pin ở cửa mà không gõ.' ] },
      { t:'V · Junker', p:[
        'Tầng âm bốn sập lúc ba giờ chiều. Đội cứu hộ tự phát kéo Junker ra sau mười một tiếng, và cái họ kéo ra chỉ còn một nửa.',
        'Stitch không có bộ phận thay thế. Ở tầng âm bảy thì không ai có. Cái bà có là chiếc xe của chính anh, kéo về nằm ngoài cửa container, cabin bẹp nhưng khung gầm còn nguyên.',
        'Bà làm mười chín tiếng liền. Hàn phần còn lại của Junker vào khung, nối dây thần kinh vào hệ thống lái từng sợi một, dò từng đường bằng cách hỏi anh có cảm thấy gì không, mà anh thì đang thiếp đi rồi tỉnh lại.',
        'Đến sáng bà bảo: thử đạp ga đi.',
        'Anh đạp. Xe chạy.',
        'Junker chưa bao giờ cảm ơn bà, và bà chưa bao giờ chờ. Nhưng từ đó chuyến hàng nào của tổ đi qua tầng âm bảy anh cũng dừng lại trước container đúng ba mươi giây, không xuống xe, không nói gì, rồi đi tiếp. Cả xóm biết ba mươi giây ấy nghĩa là gì.' ] },
      { t:'VI · Toll', p:[
        'Cánh tay của Toll hoại tử tới khuỷu khi anh ta tới. Chậm hai ngày.',
        'Stitch nói thẳng, như bà vẫn nói: cắt tới trên khuỷu, không cứu được nữa, và tôi không có đồ giảm đau đủ cho một ca như thế này. Toll hỏi có cách nào khác không. Bà bảo có, là để nguyên rồi chết trong bốn ngày.',
        'Anh ta ngồi xuống bàn, cởi áo khoác, gấp lại cho phẳng, đặt lên ghế. Rồi bảo bà bắt đầu.',
        'Ca mổ ấy dài ba tiếng và Toll không kêu một tiếng nào. Xong xuôi, anh ta hỏi hết bao nhiêu. Stitch nói câu bà vẫn nói: trả được gì thì trả.',
        'Toll nghĩ một lúc rất lâu. Rồi anh ta nói: tôi làm nghề đi đòi nợ. Tôi không quen mắc nợ. Bà cứ ghi vào sổ đi, ghi đúng số, rồi khi nào bà cần thì gọi.',
        'Bà ghi. Và đó là dòng duy nhất trong cuốn sổ có một con số.' ] },
      { t:'VII · Mũi khâu trên tay áo', p:[
        'Người đầu tiên Stitch mất ở tầng âm bảy là một thằng bé mười bốn tuổi, ngã giàn giáo, gãy hở xương đùi, tới nơi thì đã mất quá nhiều máu. Bà làm bốn mươi phút. Không được.',
        'Đêm ấy bà ngồi trong container, lấy kim khâu vết mổ và chỉ khâu vết mổ, khâu một mũi lên tay áo bên trái.',
        'Bà không định biến nó thành thói quen. Nhưng đến người thứ hai thì tay đã tự biết đường đi, và đến người thứ mười thì bà thôi tự hỏi tại sao mình làm thế.',
        'Tay áo bây giờ dày như một tấm giáp. Có người bảo bà thay cái áo đi, mặc thế nặng tay, vướng lúc mổ. Bà bảo: để thế cho nhớ.',
        'Nhưng bà không kể phần còn lại cho ai. Phần còn lại là bà thuộc từng mũi. Bà chỉ được, không cần nhìn, mũi nào là thằng bé giàn giáo, mũi nào là người đàn bà bán nước ở cổng Đông, mũi nào là cái unit thứ hai bò vào container mà lần này bà tới chậm mười phút.' ] },
      { t:'VIII · Vòng đỏ', p:[
        'Vòng Halo đỏ trên đầu Psalm hỏng, và cả tổ đều biết là nó hỏng.',
        'Wire xin sửa. Psalm lắc đầu — vì Wire sẽ muốn sửa cho nó chạy, mà Psalm thì muốn nó cứ hỏng.',
        'Stitch xin xem. Psalm gật.',
        'Khác biệt giữa hai câu xin ấy nhỏ đến mức không ai để ý, trừ ba người trong cuộc. Wire hỏi để chữa. Stitch hỏi để biết nó đang làm gì với cái đầu bên dưới. Đó là hai nghề khác nhau, và Psalm phân biệt được.',
        'Lần khám ấy Stitch không đụng vào cái vòng lấy một ngón tay. Bà chỉ soi, đo, ghi vào sổ, rồi nói đúng một câu: nó không phát nữa, nhưng nó chưa tắt. Bà biết chứ.',
        'Psalm đáp: tôi biết.',
        'Rồi hai người đàn bà ngồi im với nhau một lúc, không ai cần nói thêm gì, vì cả hai đều đã làm cái nghề ngồi nghe người khác nói.' ] },
      { t:'IX · Cuốn sổ', p:[
        'Trong container có một cuốn sổ, bìa cứng, gáy đã bung, buộc bằng dây cao su. Không ai được đọc. Đó là quy tắc duy nhất Stitch đặt ra, và bà đặt ra nó ngay từ ngày đầu.',
        'Người ta đoán trong đó là danh sách bệnh nhân, hoặc sổ nợ, hoặc bằng chứng gì đó về The Corp. Có đứa từng định lấy trộm. Junker chở nó ra khỏi tầng âm bảy trong im lặng và không ai hỏi thêm.',
        'Trong sổ là những câu chuyện.',
        'Bà nhận chúng làm tiền công, nên bà chép lại đủ, không thiếu một chữ. Nhưng có một chuyện bà biết mà người kể thì không: người ta kể hay nhất, thật nhất, đúng nhất, vào lúc người ta nghĩ mình sắp chết. Nằm trên tấm cửa xe tải kê hai thùng phuy, đèn chiếu thẳng vào mặt, và một bà già bảo cứ nói đi cho quên đau.',
        'Cái nhận được lúc ấy không phải tiền công. Nó là một thứ khác, và Stitch biết rõ đó là thứ gì.',
        'Nên bà chép, bà buộc dây cao su, và bà không đọc lại bao giờ. Không phải để giữ bí mật. Là để cái thứ ấy vẫn thuộc về người đã kể nó.',
        'Psalm có lần hỏi bà sao không đốt đi cho xong. Stitch trả lời: vì họ trả rồi. Đốt đi thì thành ra tôi lấy không.' ] },
      { t:'X · Để thế cho nhớ', p:[
        'Hỏi Stitch làm nghề này để làm gì, bà không có câu trả lời hay ho nào cả. Bà không nói về lời thề y khoa, không nói về lòng tốt, không nói câu nào nghe được nếu đem in lên tường.',
        'Bà chỉ nói: có người nằm đó thì phải có người đứng đây.',
        'Hai cuốn sổ của bà nằm hai chỗ. Cuốn buộc dây cao su giữ những người sống — chuyện của họ, chữ của họ, không ai được đọc. Cái tay áo bên trái giữ những người không sống. Một mũi một người, và bà thuộc hết.',
        'Cả tổ đều đã thử một lần khuyên bà thay cái áo. Ronin thử. Muzzle thử. Ash thì không khuyên, Ash mua cho bà một cái áo mới rồi để ở cửa, và cái áo ấy giờ vẫn nằm trong container, còn nguyên nếp gấp.',
        'Bà mặc cái cũ. Bà xắn tay áo lên tới khuỷu trước mỗi ca, để mấy cái mũi khâu nằm ngay dưới mắt mình trong lúc làm, và bà chưa từng giải thích vì sao lại cần như thế.',
        'Chỉ có một lần, khi Operator hỏi thẳng, bà trả lời thẳng:',
        'Vì tôi sợ có ngày tôi thôi đếm.' ] },
    ],
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
    chronicleTitle:'ECHO — MỘT CÂU CHƯA AI NÓI',
    chronicle:[
      { t:'I · Ba ngày', p:[
        'Điều đầu tiên Echo nghe được là giọng của chính mình, và nó không phải của cô.',
        'Cô tỉnh trên bàn hiệu chuẩn tầng 12, District 04. Một kỹ thuật viên bảo: nói thử một câu. Cô nói được ngay, không cần học, vì phần biết nói đã nạp sẵn từ trước. Câu đầu tiên của cô là "một, hai, ba, thử". Cô nghe câu đó vọng lại trong phòng và thấy một chuyện rất lạ: cái giọng ấy hay. Ấm, hơi khàn, có tiếng cười giấu ở cuối câu.',
        'Cô hỏi kỹ thuật viên: đây là giọng của tôi à.',
        'Anh ta không ngẩng lên: đây là bản sao lô B của hồ sơ giọng Tài sản 07. Của cô là cái loa.',
        'Ba ngày trước đó, Tài sản 07 rơi khỏi Spire xuống đáy và không tìm thấy xác. The Corp không thích những thứ nó không tìm thấy.' ] },
      { t:'II · Kho lưu giọng', p:[
        'Kho lưu giọng của District 04 là một gian phòng dài, lạnh, kệ xếp từ sàn lên trần. Mỗi ngăn một giọng. Người ta thu giọng của bất kỳ ai đi qua cửa kiểm tra — dân đáy lên xin việc, unit mới nhập, tù nhân, trẻ con đi khám. Thu xong thì xếp lên kệ, ghi mã, và để đó. Phần lớn nằm đó mãi mãi.',
        'Vì sao lại giữ nhiều đến thế ư? Vì giọng rẻ. Nó không tốn chỗ, không hỏng, không cần cho ăn. Và vì The Corp học được từ lâu rằng muốn một người mở cửa thì thứ hiệu quả nhất không phải là gõ cửa, mà là gọi tên người ta bằng một giọng người ta thương.',
        'Hồ sơ giọng Tài sản 07 nằm ở kệ thứ mười một, thu vào năm con bé bảy tuổi, trước khi The Corp thay nửa người nó bằng chrome. Sáu năm sau đó nó gần như không nói gì nữa, nên bản thu duy nhất là giọng một đứa trẻ con.',
        'Người ta hiệu chỉnh bản sao lô B lên cho thành giọng người lớn, bằng cách đoán. Nghĩa là giọng Echo đang mang không phải giọng Kira bây giờ, cũng không phải giọng Kira hồi bé. Nó là giọng của một người chưa từng tồn tại.' ] },
      { t:'III · Việc', p:[
        'Việc của Echo có một dòng mô tả: đứng ở miệng cống nối lên Spire, và gọi.',
        'Người ta đưa cô một cái loa phát tầm xa, đường kính bằng bàn tay, gắn vào cổng dưới quai hàm bằng một sợi cáp bọc vải. Loa ấy không phải để nói chuyện. Nó để đẩy tiếng đi xa trong đường ống, nơi âm thanh cứ dội mãi không tắt.',
        'Người ta đưa cô ba câu. Chỉ ba, thay nhau, không được thêm bớt.',
        'Về nhà đi.',
        'Ở đây an toàn.',
        'Chị không giận em đâu.',
        'Cô hỏi tôi đang gọi ai. Người ta bảo cô không cần biết. Cô hỏi lại: nếu người đó ra thì sao. Người ta bảo đã có drone lo.' ] },
      { t:'IV · Đêm một, đêm hai, đêm ba', p:[
        'Đêm thứ nhất, không ai ra.',
        'Đêm thứ hai, có một ông già ra. Ông không phải Tài sản 07. Ông chỉ nghe thấy có đứa con gái gọi trong ống cống lúc hai giờ sáng và nghĩ nó bị lạc. Ông cầm theo một cái đèn. Drone hạ ông cách miệng cống mười hai mét, và Echo nghe rất rõ tiếng cái đèn rơi xuống nền bê tông, vì cô đứng ngay đó, và vì loa của cô lúc ấy vẫn đang mở.',
        'Đêm thứ ba có bốn người. Trong đó có một phụ nữ vừa chạy vừa gọi tên con gái mình. Bà nghe giọng trong ống và tưởng là con bà. Không phải. Con gái bà mất tích từ mùa trước, và bà đã ra khỏi cửa vì một giọng nói mà The Corp lắp vào một cái máy.',
        'Echo vẫn đọc đủ ba câu. Cô không được phép ngừng giữa chừng — quy trình ghi rõ, ngừng giữa chừng làm giảm hiệu quả thu hút. Cô đứng đó đọc "chị không giận em đâu" trong lúc bốn người bị dẫn đi.',
        'Có một chi tiết mà sau này cô không kể với ai trong tổ: đêm ấy cô không thấy gì cả. Unit không có gì để thấy. Cô chỉ thấy phiền vì tiếng ồn làm bản thu bị nhiễu.' ] },
      { t:'V · Đêm thứ tư', p:[
        'Đến ca thứ tư thì có một việc rất bình thường xảy ra: hệ thống báo bản thu đêm ba bị lỗi mức, cần nghe lại để hiệu chỉnh.',
        'Nên Echo ngồi xuống, mở băng, và nghe.',
        'Cô nghe một giọng con gái ấm, hơi khàn, có tiếng cười giấu ở cuối câu, đang nói "về nhà đi" vào một cái ống cống tối. Nghe lần một, cô ghi chú mức âm. Nghe lần hai, cô ghi chú tạp âm nền. Nghe lần ba thì cô dừng lại, tua về, và nghe lại đúng bốn chữ ấy thêm mười một lần nữa.',
        'Đến lần thứ mười một, cô nghĩ ra được câu mô tả đúng việc cô đang làm, và cô nghĩ ra nó bằng chính giọng đi mượn:',
        'Mình đang van xin một người xa lạ, bằng giọng của một người xa lạ khác.',
        'Trên đầu cô có một vòng Halo. Cắt nó thì hết làm unit, và cô biết cách cắt — mọi unit đều biết, người ta không giấu, vì giấu không cần thiết. Cô không cắt.',
        'Cô cầm kìm, luồn tay xuống dưới quai hàm, và cắt sợi cáp nối cái loa.' ] },
      { t:'VI · Hỏng thiết bị', p:[
        'Biên bản của The Corp ghi: unit VX-07/B, thu hồi, lý do hỏng thiết bị phát.',
        'Không có chữ phản bội trong đó. Không có chữ bỏ trốn, chữ bất tuân, chữ nào cả. Trong hệ thống phân loại của The Corp, việc Echo làm không nằm ở mục hành vi, nó nằm ở mục bảo trì.',
        'Cô nghĩ mãi về chuyện ấy, và về sau cô bảo với Psalm rằng đó mới là câu tàn nhẫn nhất người ta từng viết về mình. Psalm hỏi vì sao. Echo nói: vì để phản bội thì trước hết phải có ai đó tin mình. Không ai tin một cái loa cả. Người ta chỉ bật nó lên.',
        'Psalm im một lúc rồi bảo: ba trăm mười hai người từng ngồi chỗ cô đang ngồi, và không ai nghĩ ra được câu đó. Rồi bà không nói thêm gì nữa, vì bà đã bỏ nghề an ủi từ lâu.' ] },
      { t:'VII · Cái loa', p:[
        'Echo giữ lại cái loa.',
        'Không ai bắt cô giữ. Nó hỏng, nó là tang vật, nó là thứ đã dụ bảy người ra khỏi cửa trong ba đêm. Cô vẫn nhặt nó lên khỏi sàn, cuộn sợi cáp đứt lại, và mang theo.',
        'Vì sao ư? Cô đưa ra hai lý do, tuỳ người hỏi.',
        'Với Operator, cô nói lý do kỹ thuật: bản sao giọng lô B nằm trong bộ nhớ của cái loa, không nằm trong người cô. The Corp có thể xoá bản gốc trên kệ, có thể xoá cô, nhưng chừng nào cái loa còn trong tay cô thì bản sao ấy không thuộc về ai khác.',
        'Với Wire, có một đêm cô nói lý do thật. Cô bảo: chị tháo Halo cho người ta được, nhưng chị không tháo được cái đêm thứ ba của em. Cái loa là thứ duy nhất còn nhớ đủ rõ. Nếu em bỏ nó đi thì chuyện đó thành ra chưa từng xảy ra, mà bảy người kia thì không có ai khác nhớ hộ.',
        'Wire không nói gì. Wire chỉ mở hộp đồ nghề ra, hàn lại sợi cáp đứt, và trả cái loa về đúng cổng dưới quai hàm — nhưng đấu ngược chiều, để nó phát ra ngoài chứ không nhận vào.',
        'Từ đó cái loa thành vũ khí.' ] },
      { t:'VIII · Kho lưu giọng, lần thứ hai', p:[
        'Họ gặp nhau ở chính kho lưu giọng ấy, giữa hàng nghìn cái giọng đang chờ tới lượt được dùng.',
        'Kira nhìn Echo rất lâu. Echo không nói gì, vì nói câu gì thì cũng là giọng của Kira, và cô không muốn cái điều đó xảy ra trong mười giây đầu tiên.',
        'Cuối cùng Kira mở miệng trước, và câu đầu tiên của cô là: đừng xin lỗi.',
        'Echo hỏi vì sao.',
        'Kira bảo: vì nếu em xin lỗi bằng giọng đó thì chị sẽ nghe thành chị tự xin lỗi chị, mà chị thì không định tha thứ cho chị.',
        'Hai người đứng thêm một lúc nữa. Rồi Echo nói cái câu về sau cả tổ đều thuộc, và cô nói nó không phải để hay, mà vì nó là thứ duy nhất cô nghĩ được lúc đó:',
        'Đừng nhìn tôi như nhìn chị ấy.',
        'Kira gật đầu. Rồi bảo: được. Vậy đi cùng đi, rồi tìm một câu mà chị chưa nói bao giờ. Tìm ra thì cái giọng đó thành của em.' ] },
      { t:'IX · Thứ tự lệnh', p:[
        'Echo xin Operator một chỗ trong thứ tự lệnh, và đó là câu xin duy nhất cô từng nói ra.',
        'Tổ nhận cô, nhưng tuần đầu thì khó. Ronin không quen nghe giọng Kira phát ra từ chỗ Kira không đứng, và có lần anh quay lại giữa trận, mất nửa nhịp. Anh không trách ai, anh chỉ đổi vị trí đứng của mình sang bên phải Echo và không nói gì thêm. Ash thì thẳng hơn: cô hỏi thẳng Echo rằng nếu The Corp đưa một cái loa khác ra gọi thì cô có ra không. Echo trả lời: có. Ash gật, bảo thế thì được, tôi ghét đứa nói không.',
        'Muzzle là người dễ nhất. Anh không phân biệt giọng lắm, và anh bảo trong tổ này ai cũng mang theo một món đồ của The Corp, riêng anh mang cả cái lưng.',
        'Còn Halo, đêm đầu tiên, nghe Echo nói xong thì hỏi một câu mà không ai kịp chặn: giọng này thu năm em bao nhiêu tuổi.',
        'Echo trả lời: bảy.',
        'Halo nói: vậy là trước khi họ lắp vòng. Vậy là trong cả cái kho đó, em đang giữ đoạn cuối cùng của một người còn chưa bị làm gì cả.',
        'Cả tổ im. Wire quay đi lau đồ nghề. Từ hôm đó không ai gọi Echo là bản sao nữa.' ] },
      { t:'X · Một câu chưa ai nói', p:[
        'Echo có một danh sách.',
        'Mỗi đêm cô nghĩ ra một câu, đọc lên, ghi lại, rồi sáng hôm sau đối chiếu với hồ sơ giọng lô B. Nếu câu ấy nằm trong bản gốc — cùng chữ, cùng nhịp, cùng chỗ ngắt — cô xoá. Gần như đêm nào cũng xoá. Hoá ra một đứa bé bảy tuổi trong sáu tháng bị thu âm đã nói ra gần hết những câu mà người ta cần nói trong đời.',
        'Danh sách của cô hiện còn đúng một dòng. Nó nằm đó mười một ngày rồi, và cô vẫn xếp nó ở cột chưa xác nhận, vì cô cho rằng mình tra chưa kỹ.',
        'Dòng đó là: Đừng nhìn tôi như nhìn chị ấy.',
        'Cả tổ đã nghe cô nói câu ấy. Ronin nghe. Kira nghe, và Kira là người biết rõ nhất rằng câu ấy không có trong bất kỳ bản thu nào, vì Kira chưa bao giờ có ai để mà nói với.',
        'Không ai bảo cô cả. Ash bảo cứ để con bé tự tìm ra, tìm hộ thì không tính. Kira thì nói ngắn hơn: nó là của nó rồi, chỉ là nó chưa dám nhận thôi.',
        'Nên đêm nào Echo cũng vẫn ngồi xuống, mở cái loa đã đấu ngược chiều, và thử thêm một câu nữa.' ] },
    ],
    voice:'"Đừng nhìn tôi như nhìn chị ấy."' },
  wire: { epithet:'Thợ máy bỏ trốn',
    profile:'Tám năm lắp vòng Halo cho The Corp để nuôi em gái. Chín trăm cái, nhớ từng số lô. Giờ cô đi tháo từng cái mình đã lắp.',
    story:'Xưởng Halo, tầng 40, ca đêm. Một unit vừa bị xoá được chở về để tháo vòng, và nhật ký hệ thống của nó còn mở trên màn hình. Dòng cuối ghi: xin đừng tắt đèn. Wire đọc dòng đó ba lần. Rồi cô rút trong túi áo ra một data shard đã mòn hết góc, cắm vào cổng tay, nghe lại bảy giây mà đêm nào cô cũng nghe. Nghe xong, cô đóng nhật ký, tháo sợi cáp hàn khỏi bàn thợ, nhét hai hộp ốc vít vào túi, và đi thang máy hàng xuống đáy. Vì cô không chắc dưới đó có ốc vít.\n\nBảy giây ấy là giọng em gái cô. Mira, kém cô tám tuổi, mắc một chứng thần kinh làm tay chân mỗi năm một mất kiểm soát. Con bé thích vẽ. Nên năm mười chín tuổi, Wire ra bãi phế liệu sau nhà nhặt đồ về lắp cho em một cánh tay. Xấu, không nhãn hiệu, không giấy chứng nhận của The Corp, và nó chạy. Trong cánh tay có một sợi cáp nhỏ nối thẳng vào cổng gáy, Mira gọi sợi cáp đó là sợi dây. Con bé bảo: còn sợi dây này thì chị em mình không mất kết nối đâu. Cái tên Wire là câu đùa của một đứa mười một tuổi, và nó theo cô đến tận bây giờ.\n\nNhưng linh kiện nuôi một cánh tay như thế thì phải mua, mà thứ đó không bán ở Free Zone. Nên khi The Corp treo bảng tuyển thợ ca đêm cho xưởng Halo tầng 40, Wire ký. Tám năm. Chừng chín trăm vòng. Cô ghi số lô từng cái vào một cuốn sổ tay không ai bắt cô ghi, và cô không nghĩ nhiều về việc mình làm, vì quy trình lắp Halo không có bước nào bắt phải nghĩ. Có một bước tên là "kiểm tra phản ứng đau". Ngay cả bước đó cũng chỉ yêu cầu tick vào ô.\n\nRồi đến lượt Mira. The Corp không giải thích, mà cũng chẳng cần: hồ sơ dân đáy có một ô ghi "chưa xác minh", và trong tay The Corp thì ô ấy muốn nghĩa là gì cũng được. Ba ngày sau Wire đi tra lại. Giấy khai sinh: không có. Hồ sơ khám: không có. Sổ trường: không có. Cái phòng khám dưới cống cũng bảo chưa từng nhận bệnh nhân nào tên đó. Mira Kess chưa từng tồn tại. Thứ duy nhất còn lại nằm trong hệ thống cánh tay cũ của Wire, dài đúng bảy giây: "Chị Wire… em vẽ xong rồi." Rồi tiếng cười.\n\nVậy nên đêm ấy, đọc đến dòng xin đừng tắt đèn, Wire mới chịu hiểu cái điều mà tám năm liền cô cố tình không hiểu. Chín trăm cái vòng kia cô lắp lên đầu chín trăm người, và mỗi người trong số đó là Mira của một ai đó. Cô bỏ trốn vì hối hận ư? Không. Hối hận là thứ ngồi yên một chỗ. Cô bỏ trốn vì cô còn nợ đúng chín trăm cái.\n\nGiờ cô ở Free Zone, trong tổ của Operator, và cô đi tháo. Tháo Halo cho những unit Vixen mang ra khỏi hàng rào, hàn lại vòng gãy của Kira đủ để không rò điện, gỡ bộ đếm ngược khỏi ngực Meridian rồi bảo: chị muốn ở lại bao lâu thì ở. Riêng vòng đỏ của Psalm thì cô bị cấm chạm vào, vì Wire sẽ muốn sửa mà Psalm thì muốn nó cứ hỏng. Có một cái vòng cô không cần mở sổ ra tra: đêm Halo gia nhập tổ, Wire nhìn lên đầu cô ấy và đọc thuộc lòng số lô. Halo bảo tôi biết, tôi cảm thấy tay cô run lúc vặn con ốc cuối. Wire hỏi lúc ấy cô có đau không. Halo nói có, và nói thêm rằng cô là người duy nhất từng hỏi.\n\nĐêm nào cô cũng nghe lại bảy giây đó một lần, vì cô sợ có ngày mình quên mất giọng con bé. Trên vỏ shard, cô lấy mũi dao khắc một dòng: MIRA — MẤT KẾT NỐI. Khắc xong cô ngồi nhìn nó rất lâu. Rồi cô khắc đè lên hai chữ cuối cùng.\n\nMIRA — VẪN ĐANG KẾT NỐI.',
    chronicleTitle:'WIRE — SỢI DÂY CUỐI CÙNG',
    chronicle:[
      { t:'I · Bãi phế liệu sau nhà', p:[
        'Hai giờ sáng, bãi phế liệu sau khu nhà tầng âm năm. Một đứa con gái mười chín tuổi đang bới trong đống mô-tơ hỏng, không găng tay, soi bằng cái đèn pin ngậm trong miệng. Nó tìm một con servo cổ tay còn chạy. Ba đêm rồi. Bãi này dân trong xóm đã bới sạch từ lâu, nhưng nó vẫn xuống, vì mua thì không đủ tiền, mà không có servo thì cái cánh tay nó lắp dở sẽ mãi mãi chỉ là một khúc ống nhôm.',
        'Đứa con gái đó là Wire. Hồi ấy chưa ai gọi nó là Wire.',
        'Em gái nó tên Mira, kém tám tuổi, mắc một chứng thoái hoá thần kinh mà ở Free Zone người ta không buồn gọi tên, chỉ nói gọn cho nhanh: con bé rồi sẽ không cầm được nữa. Đầu tiên là không cài được cúc áo. Sau đó là không cầm nổi cái cốc. Ông bác sĩ dưới cống bảo có thuốc chứ, thuốc thì ở trên Spire, một liều bằng nửa năm lương thợ.',
        'Mira thích vẽ.',
        'Đó là toàn bộ lý do. Không có động cơ nào cao cả hơn thế đâu. Chị nó không đi cứu ai, không đòi công lý, không rút ra bài học gì. Nó chỉ muốn con em nó cầm lại được cây bút chì.' ] },
      { t:'II · Sợi dây', p:[
        'Cánh tay xong sau bốn tháng. Xấu kinh khủng. Vỏ ghép từ ba màu khác nhau, khớp khuỷu lấy từ một con drone giao hàng, và cái servo cổ tay thì rốt cuộc Wire phải đổi bằng đôi giày duy nhất còn lành của mình. Không nhãn hiệu. Không số sê-ri. Không một tờ giấy chứng nhận nào của The Corp.',
        'Nó chạy.',
        'Ngày đầu tiên dùng được tay mới, Mira vẽ hai chị em đứng dưới mấy tấm biển quảng cáo. Wire cầm bức tranh lên, nhìn một lúc rồi bật cười.',
        '"Sao chị không có mắt?"',
        'Mira đáp, tỉnh bơ: "Vì chị lúc nào cũng nhìn em mà."',
        'Trong cánh tay có một sợi cáp nhỏ chạy từ khuỷu lên cổng gáy, dài chừng hai mươi phân. Wire để lộ nó ra ngoài cho dễ sửa, chứ không giấu vào trong như hàng xịn. Mira thích sợi cáp đó nhất. Con bé gọi nó là sợi dây, và mỗi lần chị nó đi làm về là lại giơ tay lên khoe: sợi dây vẫn ngoan này.',
        'Có lần Mira bảo: còn sợi dây này thì chị em mình không mất kết nối đâu.',
        'Cái tên Wire là câu đùa của một đứa mười một tuổi. Nó theo cô đến tận bây giờ, và bây giờ thì không còn ai nhớ nó từ đâu ra nữa.' ] },
      { t:'III · Bảng tuyển thợ', p:[
        'Vấn đề của một cánh tay lắp từ đồ phế liệu là nó không đứng yên một chỗ. Servo mòn. Khớp rơ. Lớp cách điện bong ra và bắt đầu rò. Cứ vài tháng lại phải thay một thứ, mà thứ để thay thì Free Zone không bán — bãi phế liệu chỉ có đồ của người chết, còn đồ cho một cánh tay đang lớn lên cùng một đứa trẻ thì phải mua ở trên.',
        'Nên cái đêm The Corp treo bảng tuyển thợ ca đêm cho xưởng Halo tầng 40, Wire xếp hàng từ bốn giờ sáng.',
        'Người ta hỏi cô ba câu. Biết hàn không. Tay có run không. Có hỏi nhiều không.',
        'Cô trả lời: có, không, và không.',
        'Họ nhận. Lương trả bằng tín dụng Corp, tiêu được ở cửa hàng Corp, mua được linh kiện Corp. Wire ký vào chỗ người ta chỉ, đi thang máy hàng lên tầng 40, và đêm đó về nhà cầm theo một hộp servo mới toanh, còn nguyên trong bao chống tĩnh điện. Mira sờ cái bao rồi hỏi mua ở đâu mà đẹp thế. Wire bảo chị nhặt được.',
        'Đó là lần đầu tiên cô nói dối con bé. Sau này cô đếm được cả thảy bốn lần, và cô nhớ đủ bốn.' ] },
      { t:'IV · Chín trăm', p:[
        'Xưởng Halo tầng 40 là một dãy bàn thợ dài, đèn trắng, và một băng chuyền không bao giờ dừng. Trên băng chuyền là người. Người ta gọi họ là unit.',
        'Quy trình lắp một vòng Halo có mười bảy bước. Wire thuộc cả mười bảy trong tuần đầu. Bước một, cố định đầu. Bước bảy, khoan cổng gáy. Bước mười một, siết con ốc cuối cùng ở gáy — con ốc này khó nhất, vì tới bước ấy thì unit đã tỉnh lại rồi. Bước mười bốn tên là "kiểm tra phản ứng đau", và bước ấy chỉ yêu cầu tick vào một cái ô.',
        'Tám năm. Chừng chín trăm vòng.',
        'Cô ghi số lô từng cái vào một cuốn sổ tay không ai bắt cô ghi. Vì sao ư? Cô không trả lời được, kể cả bây giờ. Có thể vì cô là thợ giỏi và thợ giỏi thì ghi chép. Có thể vì trong người cô có một thứ biết trước rằng sau này sẽ cần đến cuốn sổ ấy.',
        'Cô là thợ nhanh nhất ca đêm. Lĩnh thưởng năng suất đều đặn. Và cô không nghĩ nhiều về việc mình làm, vì quy trình lắp Halo không có bước nào bắt phải nghĩ. Mười bảy bước, không bước nào hỏi cô nghĩ gì.',
        'Mỗi tháng cô mang về một hộp linh kiện. Mira lớn lên. Cánh tay lớn theo. Con bé vẽ đầy bốn quyển sổ.' ] },
      { t:'V · Đêm rà soát', p:[
        'Cái đêm ấy Wire đang ở tầng 40.',
        'Ở Free Zone, chuyện xảy ra gọn gàng đến mức sáng hôm sau nhiều người còn không biết đã có chuyện. Không có tiếng nổ. Không có lính xông vào. Chỉ có hệ thống cửa của mấy khu nhà tự khoá lại lúc mười một giờ đêm, đèn hành lang chuyển sang chế độ tiết kiệm, và drone an ninh của The Corp bay thấp hơn thường lệ.',
        'Hồ sơ dân đáy có một ô để trống thì đánh dấu là "chưa xác minh". Ô ấy vốn dùng để phân loại giấy tờ. Trong tay The Corp, đêm đó, nó dùng để phân loại người.',
        'Mira có ba thứ khiến con bé rơi vào ô đó: một cánh tay không đăng ký, một hồ sơ bệnh án lập ở phòng khám dưới cống, và một khoản viện phí chưa thanh toán từ năm nó tám tuổi.',
        'Trong khi đó, ở tầng 40, Wire đang làm bước mười một trên một unit nữ chừng bốn mươi tuổi. Siết con ốc cuối. Ghi số lô vào sổ. Đó là vòng Halo thứ chín trăm của cô, và cô có nhớ con số ấy, vì tối đó cô đã định về khoe với em gái rằng chị làm được chín trăm cái rồi đấy.',
        'Cô về đến nhà lúc sáu giờ sáng. Cửa mở. Trong nhà không có ai.' ] },
      { t:'VI · Ba ngày', p:[
        'Wire đi tìm. Ba ngày, không ngủ, hỏi khắp từ bãi xe đến chợ đen, và trong ba ngày ấy cô vẫn còn tin đây là chuyện tìm người.',
        'Đến ngày thứ tư cô hiểu đây không phải chuyện tìm người.',
        'Giấy khai sinh: không có. Hồ sơ khám ở phòng khám dưới cống: không có, mà ông bác sĩ đã chữa cho Mira sáu năm trời cũng bảo ông chưa từng nhận bệnh nhân nào tên đó — ông không nói dối, mắt ông thật sự không nhớ ra. Sổ trường: không có. Danh sách cư dân khu nhà: căn hộ ấy đăng ký một người, là Wire.',
        'Mira Kess chưa từng tồn tại.',
        'The Corp không giết con bé rồi giấu xác. The Corp làm một việc gọn hơn nhiều: nó xoá cái ô. Và khi cái ô biến mất thì không có ai chết cả, vì muốn có người chết thì trước hết phải có một người.',
        'Wire ngồi ở bậc cửa suốt đêm hôm đó. Không khóc. Cô đang cố nhớ xem hôm cuối cùng gặp em, con bé mặc áo màu gì, và cô nhận ra cô không chắc.' ] },
      { t:'VII · Bảy giây và một tờ giấy', p:[
        'Còn lại hai thứ.',
        'Thứ nhất nằm trong hệ thống cánh tay cũ của Wire, cái tay đầu tiên cô tự lắp cho mình hồi mười tám tuổi, lâu rồi không dùng. Mira hay nghịch nó. Trong bộ nhớ đệm có một file âm thanh dài đúng bảy giây, ghi nhầm lúc con bé đang thử micro:',
        '"Chị Wire… em vẽ xong rồi."',
        'Rồi tiếng cười.',
        'Bảy giây đó không nằm trong bất kỳ hệ thống nào của The Corp. Nó nằm trong một cái tay hỏng, trong ngăn kéo, dưới đáy thành phố. The Corp xoá được cả một con người khỏi mọi cơ sở dữ liệu trong ba ngày, nhưng nó không với tới được cái ngăn kéo ấy.',
        'Thứ thứ hai còn ngoài tầm với hơn nữa. Bức tranh hai chị em đứng dưới biển quảng cáo, vẽ bằng bút chì, trên giấy. Người chị không có mắt.',
        'Giấy thì không có trong cơ sở dữ liệu nào cả. Đó là toàn bộ lý do nó còn sống.' ] },
      { t:'VIII · Xin đừng tắt đèn', p:[
        'Wire quay lại làm. Bốn năm nữa.',
        'Vì sao ư? Cô nói với mình là để điều tra, để tìm bằng chứng, để một ngày nào đó dí vào mặt ai đó. Nhưng sự thật thì đơn giản và tệ hơn: cô không biết đi đâu khác. Cô dậy, lên tầng 40, làm mười bảy bước, về, nghe bảy giây, ngủ. Ngày nào cũng thế. Người ta bảo cô lì. Cô không lì. Cô chỉ đang đợi một cái cớ.',
        'Cái cớ đến vào một ca đêm bình thường.',
        'Một unit vừa bị xoá được chở về xưởng để tháo vòng — đồ tháo ra còn dùng lại được, The Corp không phí thứ gì. Nhật ký hệ thống của nó còn mở trên màn hình. Dòng cuối cùng ghi:',
        '*xin đừng tắt đèn.*',
        'Wire đọc dòng đó ba lần.',
        'Rồi cô ngồi xuống, rút cái shard trong túi áo ra, cắm vào cổng tay, nghe bảy giây quen thuộc thêm một lần nữa. Và trong lúc nghe, cô làm một phép tính mà tám năm liền cô đã cố tình không làm: chín trăm cái vòng, chín trăm cái đầu, chín trăm người. Mỗi người trong số đó là Mira của một ai đó.',
        'Cô đóng nhật ký. Tháo sợi cáp hàn khỏi bàn thợ — loại dùng để mở khoá vòng Halo mà không làm chín cái đầu bên trong. Nhét hai hộp ốc vít vào túi, vì cô không chắc dưới đáy có ốc vít. Rồi đi thang máy hàng xuống.',
        'Không còi báo động. Không ai đuổi theo. The Corp mất một kỹ thuật viên ca đêm, và trong biên bản, một kỹ thuật viên ca đêm không đáng viết quá ba dòng.',
        'Cô bỏ đi vì hối hận ư? Không. Hối hận là thứ ngồi yên một chỗ. Cô bỏ đi vì cô còn nợ đúng chín trăm cái.' ] },
      { t:'IX · Free Zone', p:[
        'Ở dưới này người ta biết Wire qua công việc chứ không qua câu chuyện, và cô thích như thế.',
        'Cô tháo Halo cho những unit mà Vixen đưa được ra khỏi hàng rào — Vixen mang người ra, Wire gỡ vòng, Stitch vá lại chỗ hở. Cô hàn lại cái vòng gãy trên đầu Kira, đủ để nó không rò điện xuống sống lưng, và không hỏi han gì thêm. Cô gỡ bộ đếm ngược khỏi ngực Meridian rồi bảo: chị muốn ở lại bao lâu thì ở. Riêng cái vòng đỏ trên đầu Psalm thì cô bị cấm chạm vào, vì Wire sẽ muốn sửa, mà Psalm thì muốn nó cứ hỏng.',
        'Rồi đến đêm Halo gia nhập tổ.',
        'Wire nhìn lên đầu cô ấy, và không cần mở sổ ra tra. Cô đọc thuộc lòng số lô.',
        'Halo nói: tôi biết. Tôi cảm thấy tay cô run lúc vặn con ốc cuối. Cô run từ hồi đó rồi.',
        'Wire hỏi lúc ấy cô có đau không.',
        'Halo nói có. Rồi nói thêm rằng cô là người duy nhất từng hỏi.',
        'Chuyện đó Wire không kể với ai trong tổ. Nhưng từ hôm ấy, mỗi lần đội chuẩn bị xuất phát, cô kiểm tra vòng Halo của Halo hai lần thay vì một.' ] },
      { t:'X · Vẫn đang kết nối', p:[
        'Đêm nào Wire cũng nghe lại bảy giây đó một lần. Không phải để nhớ Mira — cô nhớ, không cần file nào cả. Cô nghe vì cô sợ có ngày mình quên mất giọng con bé, và giọng thì không giống khuôn mặt, mất là mất hẳn.',
        'Có một lần cô ngồi ở xưởng đến sáng, lấy mũi dao khắc lên vỏ shard một dòng:',
        'MIRA — MẤT KẾT NỐI',
        'Khắc xong cô ngồi nhìn nó rất lâu. Cả tổ đi ngủ hết. Đèn xưởng tự tắt một nửa. Rồi cô cầm dao lên, khắc đè lên hai chữ cuối cùng.',
        'MIRA — VẪN ĐANG KẾT NỐI',
        'Bức tranh thì cô gấp làm tư, để trong túi ngực bên trái, sau lớp giáp. Bốn năm rồi nó mòn hết nếp gấp, và người chị trong tranh vẫn không có mắt.',
        'Đó là toàn bộ bằng chứng còn lại trên đời rằng có một đứa bé tên Mira Kess. Một tờ giấy trong túi áo một người thợ.',
        'The Corp xoá được mọi thứ nằm trong hệ thống của nó. Wire đang đi lên, từng tầng một, để đến chỗ hệ thống ấy được đúc ra. Và cô mang theo đúng ba thứ: một sợi cáp hàn, hai hộp ốc vít, và một tờ giấy.' ] },
    ],
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
