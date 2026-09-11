# CHROMEFALL — Lore, Passives and Ultimates (19 characters)

English mirror of `docs/characters-kit.md`, section for section, so the two can be read side by side. Source of truth is still the Vietnamese: **lore** from `LORE` in `js/data.js`, **stats / basic attack / ultimate / passives** from `ROSTER` in the same file. Numbers are draft balance (★ FAKE) — edit `js/data.js`, not this file.

Glossary used throughout: **the Spire** = Tháp · **the Bottom** = Khu Đáy · **Floor Four** = Tầng Bốn · **the scrap crew** = tổ nhặt sắt · Canticle, Choir, Halo, Unit 07 keep their names.

## How to read the tables

- **ATK / HP** — base damage and health.
- **SPD** — speed: higher goes first each round.
- **CRIT** — base crit chance; a crit deals 1.5× damage (`RULES.critMult`). Skills and passives can add to it.
- **Energy** — the ultimate meter. Only basic attacks charge it, and every character's max Energy is exactly the cost of their own ultimate, so a full bar always means the ultimate is ready.
- **Hits to fill** — basic attacks needed to reach the ultimate from zero Energy, before any passive that grants starting Energy.
- **Ultimate type** — `nuke` single target · `aoe` all enemies · `heal` whole party · `control` take over one enemy for a turn.
- **Passives** — switch on by themselves when their condition is met: ally X is on the team, or the sector contains enemy X / an enemy of that faction.

## Stat sheet

| Character | Faction | Tier | ATK | HP | SPD | CRIT | Energy | Energy/hit | Hits to fill |
|---|---|---|---|---|---|---|---|---|---|
| YUKI | Chrome | S | 145 | 950 | 112 | 20% | 100 | +25 | 4 |
| PSALM | Chrome | S | 110 | 1100 | 88 | 5% | 125 | +30 | 5 |
| ASH | Rust | A | 120 | 1000 | 105 | 12% | 75 | +35 | 3 |
| KAI | Rust | B | 95 | 1200 | 96 | 10% (+15) | 100 | +25 | 4 |
| RONIN | Rust | A | 130 | 1050 | 104 | 15% (+10) | 100 | +25 | 4 |
| MUZZLE | Rust | B | 70 | 1750 | 80 | 5% | 125 | +30 | 5 |
| JUNKER | Rust | B | 75 | 1700 | 76 | 5% | 100 | +30 | 4 |
| GRAVEDIGGER | Rust | B | 90 | 1500 | 74 | 8% (+5) | 125 | +25 | 5 |
| STITCH | Rust | S | 140 | 900 | 108 | 15% | 100 | +30 | 4 |
| TOLL | Rust | S | 155 | 850 | 98 | 15% (+10) | 125 | +25 | 5 |
| SPARK | Rust | A | 125 | 950 | 104 | 10% | 75 | +35 | 3 |
| VIXEN | Rust | A | 135 | 900 | 114 | 15% (+10) | 100 | +25 | 4 |
| VESPER | Chrome | S | 150 | 900 | 110 | 15% (+5) | 100 | +25 | 4 |
| NYX | Chrome | S | 140 | 1000 | 106 | 15% | 125 | +30 | 5 |
| HALO | Chrome | A | 115 | 1150 | 92 | 10% (+10) | 100 | +25 | 4 |
| CIPHER | Chrome | A | 125 | 950 | 100 | 10% | 75 | +30 | 3 |
| MERIDIAN | Chrome | B | 85 | 1450 | 78 | 5% | 125 | +25 | 5 |
| ECHO | Chrome | A | 105 | 1000 | 100 | 10% (+5) | 100 | +25 | 4 |
| WIRE | Chrome | B | 80 | 1500 | 90 | 8% | 75 | +30 | 3 |

The number in brackets under CRIT is extra crit chance on basic attacks.

---

# I. STORY CAST

## YUKI — Unit 07 · Chromefall
`Chrome · S · owned from the start` — ATK 145 · HP 950 · SPD 112 · CRIT 20% · Energy 100

**Who she is.** Canticle's best machine swordfighter, dropped into the Bottom with a broken Halo. She remembers her name and how to cut. Nothing else.

**What happened.** Six years ago, Floor Four came down. Yuki's parents died in the concrete. Three days later Canticle's white vans came down to the Bottom to collect the orphans. An eleven-year-old girl stood in front of one with her father's sword, blocking it and reciting the Bottom kids' counting rhyme at the same time. A man in a gold Halo pointed at her: take that one. Up on the Spire they replaced half of her with machine, fitted her Halo, locked away every old memory and gave her a new name: Unit 07. For six years she killed for them, no questions, no memory.

**Now.** A few days ago the Halo faulted and the memories started leaking through. Canticle ordered a wipe. A Confessor named Psalm didn't wipe her — she cut both their rings and dropped them both into the Bottom. Now Yuki runs with a scrap crew, picking her memories back up one piece at a time. She still counts one, two, three before she cuts. By three there's usually nobody left standing.

> "One… two… three! Huh. Done already?"

**Basic attack** · 100% ATK, +25 Energy. Against a target under 30% HP the hit gains another 50%.

**Ultimate — ZERO** · cost 100 · nuke · 320% ATK on one target. If it kills, 50 Energy comes back. *(Has its own FX: a single vertical chrome-violet slash.)*

**Passives**

| Name | Condition | Effect | Reason |
|---|---|---|---|
| THE WATCHER | Psalm on the team | starts the fight with 50 Energy | Psalm watched over her for six years. |
| OLD DEBT | sector has Chrome enemies | +15% damage | Canticle owes her six years. |
| THE NAME | sector has Cantor | +30% damage to him | He's the one who put her in the van. |

---

## PSALM — The Confessor
`Chrome · S · reward for clearing 07-C` — ATK 110 · HP 1100 · SPD 88 · CRIT 5% · Energy 125

**Who she is.** She used to sit in Canticle's confession chamber, listen to faulty machine soldiers tell her everything, then press the wipe button. Three hundred and twelve times.

**What happened.** On the Spire, any Choir soldier who starts remembering or starts asking is counted as faulty. They were brought to Psalm. She listened, wrote it down, pressed the button. The file says: three hundred and twelve cases, no errors. Case three hundred and thirteen was a girl with a sword, designation Unit 07. The girl told her nothing. She asked one thing: do you count? Psalm sat still for ten seconds. Then she reached up, tore off her own Halo, cut the girl's ring too, and kicked open the waste chute. They fell together.

**Now.** Her Halo is red and mute now; it takes orders from nobody. She followed Yuki at a distance for days because she wasn't sure the girl didn't want her dead. At the Canticle fence she stepped out. She apologised to nobody. She said: forgiveness is something Canticle sells, and I'm not buying.

> "Confess. …Kidding. I quit that job."

**Basic attack** · 100% ATK, +30 Energy.

**Ultimate — APOSTASY** · cost 125 · control · Takes an enemy over for one turn: on its next turn it attacks its own side.

**Passives**

| Name | Condition | Effect | Reason |
|---|---|---|---|
| CASE 313 | Yuki on the team | +20% HP | She gave up everything for this case. |
| SHE KNOWS THE CHOIR | sector has Chrome enemies | −15% damage taken | She knows every move a Choir soldier makes. |

---

## ASH — Big Sister
`Rust · A · owned from the start` — ATK 120 · HP 1000 · SPD 105 · CRIT 12% · Energy 75

**Who she is.** The scrap crew's swordfighter, blade soaked in green acid. She sees the price of a thing first and what it is second.

**What happened.** Ash and Kai are twins. Their parents died when Floor Four came down six years ago. Ash was thirteen; she dragged her brother into a drain pipe and kept him there three days to stay clear of Canticle's collection vans. Out of the pipe she learned the sword at a breaker's yard, bought acid at the chemical dump to coat her blade, and took any job that paid. Ronin took the pair into his crew for one reason: Ash has never sold out a crewmate, even though she can put a price on everything.

**Now.** The night they found Yuki, it was Ash who said: pull the Halo, sell it. Kai stopped her. She went quiet — not because she'd lost the argument, but because she knows a living S-grade machine soldier is worth more than a broken ring. She still says she'll sell Yuki. Nobody has seen her do it.

> "Don't die before I get to sell you."

**Basic attack** · 100% ATK, +35 Energy. The acid blade leaves poison: the target loses another 20% of Ash's ATK at the start of each of its turns, for 2 turns.

**Ultimate — FLASHOVER** · cost 75 · aoe · A mine net already laid under their feet. Ash strikes a light and the whole yard goes up at once: 150% ATK to every enemy, then burning for 2 more turns (20% ATK per turn). *(Follows the ult video; her battle sprite is still the sword.)*

**Passives**

| Name | Condition | Effect | Reason |
|---|---|---|---|
| TWINS | Kai on the team | +10% ATK | The two of them have fought in the same rhythm since they were kids. |
| APPRAISAL | sector has Rust enemies | +10% damage | She knows what every gang in the Bottom is worth. |
| FLOOR FOUR | sector has Cantor | +20% damage to him | Her parents were on Floor Four too. |

---

## KAI — Little Brother
`Rust · B · owned from the start` — ATK 95 · HP 1200 · SPD 96 · CRIT 10% · Energy 100

*(Profile written as a **letter** — `form:'letter'` in `LORE`.)*

**Who he is.** Ash's twin brother, same kind of sword, same jacket. He tells every story three times bigger than it was — on purpose — because down here, a story only counts as real once somebody repeats it.

**Tonight's letter.** To whoever will remember me.
I grew up in drain pipes and Bottom orphanages. Down there, when a kid disappears, nobody says their name a week later. Being forgotten is dying a second time.
So I tell it three times bigger. Not to show off. A small story gets forgotten in a night; a big one gets repeated, and being repeated is being alive. I also sign my name on every wall I pass. If any kid from that orphanage is still breathing, they'll see my name and know where to find me.
Signed: Kai. K, A, I.

**P.S.** Tonight I stopped my sister. She was going to pull the ring off the machine that fell into the Drop Yard and sell it. I said her name first: Yuki. Harder to sell something once you've named it.
From tonight I'm writing the whole crew in here. Ronin. Muzzle. My sister. Yuki. Whoever reads this, remember four names. Mine I handle myself — the walls out there are covered.

> "Write it down: Kai. K, A, I. So they spell it right later."

**Basic attack** · 100% ATK, +25 Energy, +15% crit chance.

**Ultimate — RIPCORD** · cost 100 · nuke · A railgun bigger than he is. Kai lines it up carefully and puts one shot straight through: 240% ATK on one target. A hit stuns, costing it its next turn (bosses are immune). *(Follows the ult video; his battle sprite is still the sword.)*

**Passives**

| Name | Condition | Effect | Reason |
|---|---|---|---|
| TWINS | Ash on the team | +15% HP | With his sister next to him he takes more punishment. |
| NUMBER ONE FAN | Yuki on the team | +10% ATK | He wants Yuki to see him fight. |
| MACHINE DOG | sector has Chrome Hound | +40% damage to it | The story about him downing a machine dog barehanded is made up. This time he'd like it to be true. |

---

# II. THE SCRAP CREW (RUST)

## RONIN — Crew Boss
`Rust · A · gacha (an NPC in the chapter 1 comic)` — ATK 130 · HP 1050 · SPD 104 · CRIT 15% · Energy 100

**Who he is.** Boss of a scrap crew in the Bottom. No implants, no machinery, one steel sword and one rule: you don't part out people.

**What happened.** Ronin's sister was "recruited" up to the Spire when he was sixteen. She left behind the sword and one instruction: don't sell anything that's still warm. Then she never came back. Ronin built his crew around that one rule. Because of it the crew is poorer than every other outfit down here — and also because of it, anyone who finds a person, or a machine, still breathing brings them to him.

**Now.** He doesn't trust the Spire's machine soldiers, but he gave Yuki a trial job. He hands out the work and doesn't ask anything more, and he's the one who decides whether the crew climbs the Spire. He hasn't said. He's sharpening his sword.

> "Job's done, come home. Not done, don't."

**Basic attack** · 100% ATK, +25 Energy, +10% crit chance.

**Ultimate — IAIDO** · cost 100 · nuke · Ronin does not dodge. He steps into the incoming swing and cuts down once: 280% ATK on a single target. ★ FAKE

**Passives**

| Name | Condition | Effect | Reason |
|---|---|---|---|
| CREW BOSS | Ash **or** Kai on the team | +10% ATK | With his own people beside him his cuts land surer. |
| NO PARTING OUT PEOPLE | sector has Foreman | +20% damage to him | Foreman strips people and sells them by the piece. |

---

## MUZZLE — Car Door
`Rust · B · gacha (an NPC in the chapter 1 comic)` — ATK 70 · HP 1750 · SPD 80 · CRIT 5% · Energy 125

**Who he is.** Fourteen years on Canticle's gates without missing a shift. Fired for stepping out of his post exactly once.

**What happened.** Night shift at the perimeter gate: a Bottom kid squeezed through the gap to pick up dropped medicine. An Enforcer raised its gun. The gate guard, a man the size of a cabinet, fourteen years without leaving his position, stepped out and stood in the middle. The gun came down. The next morning's report read: conduct outside directive, contract terminated. Muzzle walked down to the Bottom with his old armour and a car door for a shield.

**Now.** In Ronin's crew he stands in front of everyone. He names each door in order; the one he's carrying is Missus Three. Ask him if he's afraid of dying and he laughs: dying before the crew is fine, dying after them isn't.

> "Missus Three takes three hits. The fourth one's mine."

**Basic attack** · 100% ATK, +30 Energy.

**Ultimate — FIELD PATCH** · cost 125 · heal · Muzzle drives the car door into the ground and the crew falls in behind him. Inside that dome of dust torn armour gets patched and the fallen get up: heals 120% ATK to the whole party. ★ FAKE

**Passives**

| Name | Condition | Effect | Reason |
|---|---|---|---|
| SCAR | Ash on the team | −15% damage taken | Ash always gets up before he goes down. |
| THE FOURTH DOOR (CÁNH THỨ TƯ) | Meridian on the team | +20% HP | Their deal: whoever falls first, the other one names the shield. He's carrying Missus Three; the fourth door will take her name. |
| THE OLD GATE | sector has Enforcers | +25% damage to them | He stood next to Enforcers for fourteen years and knows where their armour gaps. |

---

## JUNKER — The Truck Still Runs
`Rust · B · gacha · no art yet` — ATK 75 · HP 1700 · SPD 76 · CRIT 5% · Energy 100

**Who he is.** Lost the lower half of his body when Floor Four came down, and was welded into his own hauler. Ask him anything and you get three words.

**What happened.** Floor Four came down at three in the afternoon. Junker was driving his third load of the day. The cab was crushed between two slabs; a volunteer rescue crew pulled him out after eleven hours and left the lower half of him in there. Doctor Stitch had no replacement parts. She had the truck. She welded what was left of him onto the chassis, wired his nerves into the steering, and told him to try the accelerator. It ran.

**Now.** He hauls cargo, hauls the wounded, hauls Muzzle's broken car doors out to be buried. He says under ten words a day. He has never turned down a run — including the run up the Spire.

> "Get in. I'll drive."

**Basic attack** · 100% ATK, +30 Energy.

**Ultimate — FULL LOAD** · cost 100 · nuke · Junker floors it, swings the frame around and dumps a whole haul on one target: 260% ATK. Explosion FX. ★ FAKE

**Passives**

| Name | Condition | Effect | Reason |
|---|---|---|---|
| THE WELD | Stitch on the team | +20% HP | Stitch welded him into the truck. |
| FLOOR FOUR | sector has Cantor | +20% damage to him | Half of him is still down on Floor Four. |

---

## GRAVEDIGGER — Keeper of the Graveyard
`Rust · B · gacha · no art yet` — ATK 90 · HP 1500 · SPD 74 · CRIT 8% · Energy 125

**Who he is.** Over two thousand steel plates with names cut into them, out behind the smelter. He remembers every one, and he buries machines the same as people.

**What happened.** The Bottom had no cemetery. Then an old man came down from an upper floor — he never says which — with a shovel and an odd habit: dig two metres down, lay a steel plate, cut a name into it. If he doesn't know the name he cuts the date and three words: was here once. After Floor Four came down he cut four thousand plates. It took him a year.

**Now.** He joined the crew after nearly burying Kai by mistake. The kid was lying in the hole, unconscious, still breathing. He pulled him out and apologised for digging too fast. He fights slow and sure, the same way he digs. Ask him why he buries machine soldiers too and he says: the dirt doesn't ask what side you're on.

> "The dirt doesn't ask what side you're on."

**Basic attack** · 100% ATK, +25 Energy, +5% crit chance.

**Ultimate — LAST RITES** · cost 125 · nuke · He digs slow and he fights slow: one shovel swing coming down, 300% ATK on one target. Afterwards he cuts its name into a steel plate. ★ FAKE

**Passives**

| Name | Condition | Effect | Reason |
|---|---|---|---|
| THE HOLE HE DUG TOO FAST | Kai on the team | −12% damage taken | He nearly buried Kai, so now he stands close to him. |
| THE PLATES | sector has Foreman | +15% damage to him | Half the plates behind the smelter are Foreman's doing. |

---

## STITCH — The Bottom's Doctor
`Rust · S · gacha` — ATK 140 · HP 900 · SPD 108 · CRIT 15% · Energy 100

**Who she is.** Lost her licence for patching up a deserter machine soldier. Now she patches people and machines in a shipping container and takes whatever they can pay.

**What happened.** One night in an upper-floor hospital, a Choir soldier with a broken Halo crawled into emergency. Protocol was to call Canticle immediately. The doctor on duty, Stitch, patched it up and then opened the back door. By morning her licence was pulled and her name was struck off the register. She went down to the Bottom with her multi-jointed surgical arms and opened a clinic in a container next to the truck yard.

**Now.** Patients pay with anything they've got, or with a story. She writes every one of them in a notebook nobody is allowed to read. She's the one who welded Junker into his truck, and the only person Psalm lets touch the red Halo. Every time she loses a patient she sews another stitch into her sleeve.

> "Hold still. I stitch people better than I stitch machines."

**Basic attack** · 100% ATK, +30 Energy.

**Ultimate — SUTURE** · cost 100 · heal · Four surgical arms unfold, four curved needles, four threads shot in four directions. One pull on the thread and the whole crew closes up at once: heals 150% ATK to the whole party. ★ FAKE

**Passives**

| Name | Condition | Effect | Reason |
|---|---|---|---|
| THE WELD | Junker on the team | +10% ATK | She welded Junker into the truck. |
| THE SLEEVE | sector has Rust enemies | −10% damage taken | The sleeve is stitched thick enough to be armour. |

---

## TOLL — The Collector
`Rust · S · gacha · no art yet` — ATK 155 · HP 850 · SPD 98 · CRIT 15% · Energy 125

**Who he is.** Four thousand names in one notebook. He's collecting them back from Canticle one at a time, with a proper invoice each.

**What happened.** The night Floor Four came down, Toll was up in the loading gantry, high enough to watch three Canticle engineering teams cut the support columns on schedule, to load-test the foundations of the new Spire. Four thousand people were below. He was above. There was nothing he could do. He copied every name into a notebook in order of address, then started collecting: one line per Enforcer, one invoice left behind at each.

**Now.** Canticle has put a price on his head. He entered that in the notebook too, as a new debt. Toll is polite to everyone, including the people he is about to kill. In the book, Yuki and Psalm are listed as seized property, which makes them victims as well. His only condition for joining the crew: on the day they reach the Spire, he's the one who knocks.

> "Sorry to trouble you. I'm here about the debt from the seventeenth."

**Basic attack** · 100% ATK, +25 Energy, +10% crit chance.

**Ultimate — PAID IN FULL** · cost 125 · nuke · Toll reads the debt out loud, lays the invoice at its feet and closes the account in one payment: 360% ATK on a single target (the highest multiplier in the roster). ★ FAKE

**Passives**

| Name | Condition | Effect | Reason |
|---|---|---|---|
| SAME BOOK | Spark on the team | +10% ATK | Spark's name is in his notebook too. |
| THE SEVENTEENTH | sector has Cantor | +30% damage to him | Four thousand lines in the book, and one name at the top of it. |

---

## SPARK — The Kid Who Taps the Spire
`Rust · A · gacha · no art yet` — ATK 125 · HP 950 · SPD 104 · CRIT 10% · Energy 75

**Who she is.** Six months of growing up in the dark. Now she lights a whole floor on power stolen from the Spire, and takes her capacitors into fights.

**What happened.** After Floor Four came down, Canticle cut the power to Spark's whole block for six months and called it technical isolation. She was eleven that year, counting days by meals, learning to splice wire by hand in the dark. By the time the lights came back she knew every circuit in the block by heart, and where it all came down from.

**Now.** She taps power straight off the Spire's column and splits it corridor by corridor, rerouting every time she's traced. On her back is a homemade capacitor rack; block her path and she'll discharge it. She talks fast, laughs loud, and has a nickname for you within a minute of meeting you. Yuki is Fluoro. Psalm is Fuse.

> "Fluoro, back up. This one gets bright."

**Basic attack** · 100% ATK, +35 Energy.

**Ultimate — ARC FLASH** · cost 75 · aoe · Spark dumps the whole capacitor rack off her back into the floor: the arc runs across the field, 140% ATK to every enemy. Shock FX. ★ FAKE

**Passives**

| Name | Condition | Effect | Reason |
|---|---|---|---|
| SAME BOOK | Toll on the team | +15% HP | With Toll covering her she splices easier. |
| CUT THE LINE | sector has Chrome enemies | +12% damage | If she can steal the Spire's power she can shock the Spire's soldiers. |

---

## VIXEN — The Borrower
`Rust · A · gacha · no art yet` — ATK 135 · HP 900 · SPD 114 · CRIT 15% · Energy 100

**Who she is.** Eleven Choir soldiers "borrowed" out of Canticle's hands. Not one of them sold. Every one of them given a name and let go.

**What happened.** Canticle's file lists Vixen as a property thief, eleven counts. Not one of those loads ever turned up on the black market. She walks machine soldiers out past the fence, takes the Halo off with tools she bought from Wire, teaches them a name, and lets them go. She calls it returning goods to their rightful owner.

**Now.** She lies about nearly everything: her age, where she's from, why she came down here. But there are three things she never lies about: the way out, where the mines are, and who dies if the plan fails. Ronin took her in because she can tell those two kinds apart.

> "I'm lying. But the left door is real. Go."

**Basic attack** · 100% ATK, +25 Energy, +10% crit chance.

**Ultimate — HEIST** · cost 100 · control · Vixen pops the ring with the toolkit she bought from Wire and borrows an enemy: for one turn it turns on its own side. ★ FAKE

**Passives**

| Name | Condition | Effect | Reason |
|---|---|---|---|
| THE TOOLS | Wire on the team | starts the fight with 25 Energy | She bought her Halo-removal kit from Wire. |
| BORROWED SOLDIERS | sector has Chrome enemies | +10% damage | Eleven times she's borrowed Canticle's soldiers. |

Fastest in the roster (SPD 114).

---

# III. PEOPLE OF THE SPIRE (CHROME)

## VESPER — Same Batch
`Chrome · S · gacha (rate-up) · no art yet` — ATK 150 · HP 900 · SPD 110 · CRIT 15% · Energy 100

**Who she is.** Off the line the same day, in the same batch as Yuki. When Yuki fell, Canticle gave the older one's position to the younger. And the younger does it better.

**What happened.** In the Choir every soldier holds a position in the formation. The day Unit 07 fell, her position was transferred to Vesper. The technicians noted: the new unit is more stable than the original. Vesper's Halo has never been a second late on an order. She believes the ring is the thing holding the Choir together, and that outside it there is only silence.

**Now.** Canticle sent her down to find Yuki. She asks her opponents a few questions before she goes to work — sincerely — and sees nothing strange in that. She calls Yuki her sister. She has never seen her sister cut without an order.

> "Come home, sister. It's cold out here."

**Basic attack** · 100% ATK, +25 Energy, +5% crit chance.

**Ultimate — EVENSONG** · cost 100 · aoe · Vesper takes the slot Canticle took from her sister and strikes on the Halo beat, not a second early or late: 180% ATK to every enemy. ★ FAKE

**Passives**

| Name | Condition | Effect | Reason |
|---|---|---|---|
| SISTER | Yuki on the team | +15% ATK | She came off the line in Yuki's batch. |
| CLEAN FLOOR | sector has Rust enemies | −10% damage taken | The Bottom fights dirty, and she's learned to slip it. |

She's the gacha banner's rate-up unit (`GACHA.featured`): half of all S-tier pulls come out as her.

---

## NYX — The Prototype With No Halo
`Chrome · S · gacha · no art yet` — ATK 140 · HP 1000 · SPD 106 · CRIT 15% · Energy 125

**Who she is.** Canticle built her to answer one question, then locked her up for four years because they couldn't live with the answer.

**What happened.** The project's question: what does a Choir soldier do without a Halo? Canticle had two answers ready — it revolts, or it's useless. Nyx did neither. She asked questions. What's the guard's name. Why does the floor have to be clean. Why does everyone cry when their ring is switched off. The project was shut down. Nyx was locked in a basement together with the entire archive. Four years down there, she read all of it.

**Now.** She takes words literally: tell her to hold her position and she'll wrap her arms around the nearest pillar. But in a fight she's the thing Canticle couldn't process: a soldier choosing a target for reasons of her own.

> "Why hold the position? Is it going to fall?"

**Basic attack** · 100% ATK, +30 Energy.

**Ultimate — BLACKOUT** · cost 125 · nuke · Four years in the cellar taught Nyx to see in the dark. She kills every light around one target before she strikes: 340% ATK on one target. ★ FAKE

**Passives**

| Name | Condition | Effect | Reason |
|---|---|---|---|
| CHOOSE AGAIN | Ronin on the team | +10% ATK | Ronin taught her: choose today, choose again tomorrow. |
| NO HALO | sector has Chrome enemies | +15% damage | Choir soldiers don't know how to handle one that isn't wearing a ring. |

---

## HALO — The Choir's Nurse
`Chrome · A · gacha · no art yet` — ATK 115 · HP 1150 · SPD 92 · CRIT 10% · Energy 100

**Who she is.** The only machine soldier Canticle allows to feel pain, because pain is how you diagnose. Seven years, thousands of injuries, not one of them hers.

**What happened.** The Choir needed a way to repair faulty soldiers without taking them apart. Canticle built her: she touches you and knows where it hurts. For seven years she carried copies of thousands of injuries inside her. Until the day she treated a soldier just out of the confession chamber and found an injury that wasn't anywhere on the machine. She left, was caught, and was chained to the Halo foundry.

**Now.** She treats anyone still breathing, including whoever just shot her. Ash says that's stupid. She says: I know exactly where it hurts them, and I can't un-know it.

> "Stand still. I've found the spot."

**Basic attack** · 100% ATK, +25 Energy, +10% crit chance.

**Ultimate — WARD ROUND** · cost 100 · heal · Halo walks the round, and one touch tells her where each of them hurts, so she patches exactly there: heals 140% ATK to the whole party. ★ FAKE

**Passives**

| Name | Condition | Effect | Reason |
|---|---|---|---|
| SCREWS | Wire on the team | +15% HP | Wire is the only one who ever asked if it hurt. |
| SHE KNOWS PAIN | sector has Chrome enemies | −10% damage taken | She knows where Choir soldiers will strike before they strike. |

---

## CIPHER — The Man Who Made Both the Lock and the Key
`Chrome · A · gacha · no art yet` — ATK 125 · HP 950 · SPD 100 · CRIT 10% · Energy 75

**Who he is.** By day he writes Halo software for Canticle. By night he writes ways to open it and sells them to the Bottom. He calls it balancing the market.

**What happened.** Cipher is an ordinary man, no Halo, one of four engineers cleared to read the whole Halo codebase. He knows the thing almost nobody remembers: the Halo started out as a filter, built so a freshly assembled soldier wouldn't go deaf from the noise. The stretch that turned it into a bridle was grafted on afterwards, and he knows exactly where it sits. The wipe command Canticle triggers when a soldier detaches from the system is his. He deliberately left a three-second gap inside it, long enough for a soldier to do one thing before the lock closes. He didn't know who would use it. It was Psalm.

**Now.** He has never told her. When Canticle started auditing the four engineers he went down to the Bottom, taking exactly one thing with him: the espresso machine from the corporate break room.

> "I've got a back door into everything. Except Ash's fridge."

**Basic attack** · 100% ATK, +30 Energy.

**Ultimate — ROOT ACCESS** · cost 75 · control · Cipher wrote the software inside that ring, so he holds the top-level key: takes over one enemy for a turn, and next turn it fights its own side. ★ FAKE

**Passives**

| Name | Condition | Effect | Reason |
|---|---|---|---|
| THREE SECONDS | Psalm on the team | starts the fight with 25 Energy | The three-second gap he left in the code was for her. |
| SOURCE CODE | sector has Chrome enemies | +10% damage | He wrote the software running in their heads. |

The cheapest control ultimate in the game (75 Energy — three basic attacks).

---

## MERIDIAN — Past Her Expiry Date
`Chrome · B · gacha · no art yet` — ATK 85 · HP 1450 · SPD 78 · CRIT 5% · Energy 125

**Who she is.** Built to shut herself off after ten years. With a few hundred hours left, she spends every one of them shielding anyone smaller than her. Which is everyone.

**What happened.** Canticle's logistics line has a fixed service life: run ten years, then cut out, so nobody has to pay for maintenance. Meridian was in the last batch. Hauling loads, putting up walls, ten years and never once sent into a fight. Wire found her at the recycling yard, sitting there counting her remaining hours out loud, and pulled the counter out of her chest.

**Now.** She still counts out loud. She plants herself in front of anyone smaller than she is and calls the whole crew her kids. She isn't afraid of shutting off. She's only afraid of shutting off at the moment somebody needs her.

> "Four hundred and nine hours left. Enough for this fight. Get behind Mom."

**Basic attack** · 100% ATK, +25 Energy.

**Ultimate — LAST SHIFT** · cost 125 · heal · The counter is out of her chest but Meridian still counts out loud. She takes one more shift for the crew: heals 100% ATK to everyone. ★ FAKE

**Passives**

| Name | Condition | Effect | Reason |
|---|---|---|---|
| THE FOURTH DOOR (CÁNH THỨ TƯ) | Muzzle on the team | −15% damage taken | She and Muzzle take turns standing in front, and the fourth car door will take her name. |
| THE WALL | sector has Foreman | −15% damage taken | She built walls for that very smelter once. |

---

## ECHO — The Copied Voice
`Chrome · A · gacha` — ATK 105 · HP 1000 · SPD 100 · CRIT 10% · Energy 100

**Who she is.** She carries Yuki's voice in order to call Yuki home. On the fourth night she listened back to her own recording and cut out her own speaker.

*(Profile written as a **damaged log with a Canticle technician's notes** — `form:'log'` in `LORE`.)*

**Recovered log · excerpt.**
`[Night 1 · drain C-12] "Come home." — 41 times. No response.`
`[Night 2 · drain C-19] "Come home." — 63 times. No response.`
`[Night 3 · Drop Yard] "Come home. Sister." — 12 times. The phrase "sister" is not in the script.`
`[Night 4 · voice archive] Unit opened its own recording. Played all 4 hours 06 minutes.`
`[Night 4 · 03:11] Recording ends. Speaker cut from the inside.`

**Technician's note.** Unit carries a voice copied from the file of Unit 07, rolled out three days after 07 fell.
Filed for recovery: equipment failure. Not filed as betrayal — a speaker has no standing to betray.
Recommendation: replace speaker, keep Halo, return to drain patrol.
Recommendation denied. Unit has left the patrol.

> "Don't look at me the way you look at her."

**Basic attack** · 100% ATK, +25 Energy, +5% crit chance.

**Ultimate — PLAYBACK** · cost 100 · nuke · Echo breaks the seal at her throat, reopens the speaker she cut herself and says exactly two words in a borrowed voice: 250% ATK on one target. Then she claps a hand over the speaker. Shock FX. ★ FAKE

**Passives**

| Name | Condition | Effect | Reason |
|---|---|---|---|
| ONE SENTENCE | Yuki on the team | +10% ATK | She's looking for a sentence Yuki has never said. |
| CUT SPEAKER | sector has Chrome enemies | +10% damage | She knows what the Choir listens for. |

---

## WIRE — The Halo Fitter Who Ran
`Chrome · B · gacha` — ATK 80 · HP 1500 · SPD 90 · CRIT 8% · Energy 75

**Who she is.** Eight years fitting Halos for Canticle, nine hundred of them, every batch number remembered. Now she goes around taking off the ones she put on.

**What happened.** There was nothing dramatic about the night she left. A soldier who had just been wiped was hauled back to the shop to have the ring removed, and its log was still open on the screen. The last line read: please don't turn off the light. Wire read that line three times, closed the log, picked up her tools and two boxes of screws, and took the freight lift down to the Bottom.

**Now.** She takes the Halos off the soldiers Vixen brings out, and she welded Yuki's broken ring back together just enough to stop it leaking current. Psalm's red ring is the one thing she's forbidden to touch — because Wire would want to fix it, and Psalm wants it left broken. She talks to machines more than to people, and apologises to both the same way.

> "There, there. Don't leak current."

**Basic attack** · 100% ATK, +30 Energy.

**Ultimate — OVERCLOCK** · cost 75 · nuke · Wire reaches out, catches the current inside the target Halo and winds it past the limit: 220% ATK. The ring spins faster and faster until it cooks what it is sitting on. Shock FX. ★ FAKE

**Passives**

| Name | Condition | Effect | Reason |
|---|---|---|---|
| SCREWS | Halo on the team | +10% ATK | She fitted the ring on Halo's head. |
| BATCH NUMBER | sector has Chrome enemies | +8% damage | She remembers every Halo she fitted, and which ones she left loose. |

---

# Appendix A — Passives by pairing

Who unlocks what by standing next to whom. Use this to build a team of three.

| Pair | Who gets what |
|---|---|
| Yuki ↔ Psalm | Yuki: 50 starting Energy · Psalm: +20% HP |
| Yuki → Kai | Kai +10% ATK |
| Yuki → Echo | Echo +10% ATK |
| Yuki → Vesper | Vesper +15% ATK |
| Ash ↔ Kai | Ash +10% ATK · Kai +15% HP |
| Ash → Muzzle | Muzzle −15% damage taken |
| Ash / Kai → Ronin | Ronin +10% ATK (either one is enough) |
| Kai → Gravedigger | Gravedigger −12% damage taken |
| Muzzle ↔ Meridian | Muzzle +20% HP · Meridian −15% damage taken |
| Stitch ↔ Junker | Stitch +10% ATK · Junker +20% HP |
| Toll ↔ Spark | Toll +10% ATK · Spark +15% HP |
| Wire ↔ Halo | Wire +10% ATK · Halo +15% HP |
| Wire → Vixen | Vixen: 25 starting Energy |
| Psalm → Cipher | Cipher: 25 starting Energy |
| Ronin → Nyx | Nyx +10% ATK |

# Appendix B — Passives by enemy

| Enemy | Who counters it |
|---|---|
| Cantor (chapter 1 final boss) | Yuki +30% · Toll +30% · Ash +20% · Junker +20% damage |
| Foreman (boss) | Ronin +20% · Gravedigger +15% damage · Meridian −15% damage taken |
| Enforcer (elite) | Muzzle +25% damage |
| Chrome Hound (elite) | Kai +40% damage |
| **Chrome** faction | Yuki +15% · Nyx +15% · Spark +12% · Cipher/Echo/Vixen +10% · Wire +8% damage; Psalm −15% · Halo −10% damage taken |
| **Rust** faction | Ash +10% damage; Stitch −10% · Vesper −10% damage taken |

# Appendix C — Enemy ultimates

Two enemies in chapter 1 have ultimates. How they work: the enemy gains 25 Energy at the start of each of its turns (`RULES.foeUltGain`), and the moment it can afford the cost it fires the ultimate that turn instead of a basic attack. Its Energy bar and a READY label show on its panel so the player has time to focus it down first.

| Enemy | Ultimate | Cost | Effect |
|---|---|---|---|
| GLASS JAW (grunt) | ELECTRIC DRAGON PUNCH | 50 (2 turns) | An electric punch shaped like a dragon's head: **exactly 200 damage** to one party member — a flat number, not scaled by ATK, never crits, and unchanged by sector difficulty. |
| KILN (elite) | FIRE STORM | 75 (3 turns) | A firestorm wrapped around itself: raises a shield absorbing damage equal to **100% of Kiln's max HP**, with no turn limit — it lasts until it's broken. |

Bosses are immune to stun, so Kai's RIPCORD only stuns grunts and elites.
