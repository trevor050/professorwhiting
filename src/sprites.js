/* ═══════════════════════════════════════════════════════════════
   SPRITES — hand-authored pixel maps.
   Each entry: {p: palette map, d: rows}. '.' is transparent.
   build.js asserts every row in a sprite is the same length.
   ═══════════════════════════════════════════════════════════════ */
const PAL = {
  K: "#17111f", // outline
  D: "#3a2a4a", // shadow
  R: "#c42020", // red
  r: "#f04a28", // red light
  Y: "#e8a010", // amber
  y: "#f8cc50", // amber light
  W: "#fcfcfc", // white
  G: "#58d854", // green
  B: "#2c8cd8", // blue
  S: "#7c7c94", // steel
  s: "#bcbcd0"  // steel light
};

const SPR = {

/* ── BOSS 1 · TARIFF-30 — a rubber stamp with a bad attitude ── */
STAMP: [
"..........KKKKKKKKKKKK..........",
"..........KKrrrrrrrrKK..........",
"..........KKrrrrrrrrKK..........",
"..........KKrrKKKKrrKK..........",
"..........KKrr....rrKK..........",
"..........KKrr....rrKK..........",
"..........KKrr....rrKK..........",
"..........KKrrKKKKrrKK..........",
"..........KKrrrrrrrrKK..........",
"....KKrrrrrrrrrrrrrrrrrrrrKK....",
"..KKrrrrrrrrrrrrrrrrrrrrrrrrKK..",
".KKrrrrrrrrrrrrrrrrrrrrrrrrrrKK.",
"KKrrrrrrrrrrrrrrrrrrrrrrrrrrrrKK",
"KKRRRRRRRRRRRRRRRRRRRRRRRRRRRRKK",
"KKRRRRRRRRRRRRRRRRRRRRRRRRRRRRKK",
"KKRRRRWWWWRRRRRRRRRRRRWWWWRRRRKK",
"KKRRRRWKKWRRRRRRRRRRRRWKKWRRRRKK",
"KKRRRRWKKWRRRRRRRRRRRRWKKWRRRRKK",
"KKRRRRWWWWRRRRRRRRRRRRWWWWRRRRKK",
"KKRRRRRRRRRRRRRRRRRRRRRRRRRRRRKK",
"KKRRRRRKKKKKKKKKKKKKKKKKKRRRRRKK",
"KKRRRRRKWKWKWKWKWKWKWKWKWRRRRRKK",
"KKRRRRRKKKKKKKKKKKKKKKKKKRRRRRKK",
"KKRRRRRRRRRRRRRRRRRRRRRRRRRRRRKK",
"KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK",
"KKYYYYYYYYYYYYYYYYYYYYYYYYYYYYKK",
"KKYYKKYYKKYYKKYYKKYYKKYYKKYYYYKK",
"KKYYYYYYYYYYYYYYYYYYYYYYYYYYYYKK",
".KKKKKKKKKKKKKKKKKKKKKKKKKKKKKK.",
"..KKKKKKKKKKKKKKKKKKKKKKKKKKKK..",
"....DDDDDDDDDDDDDDDDDDDDDDDD....",
"................................"
],

/* ── BOSS 2 · THE AUDIT — a magnifier that has found something ── */
EYE: [
"..........KKKKKKKKKKKK..........",
"........KKSSSSSSSSSSSSKK........",
"......KKSSSSSSSSSSSSSSSSKK......",
".....KKSSSSWWWWWWWWWWSSSSKK.....",
"...KKSSSSWWWWWWWWWWWWWWSSSSKK...",
".KKSSSWWWWWWWWWWWWWWWWWWWWSSSKK.",
".KKSSWWWWWWWWWWWWWWWWWWWWWWSSKK.",
"KKSSWWWWWWWWWWWWWWWWWWWWWWWWSSKK",
"KKSSWWWWWWWWWWWWWWWWWWWWWWWWSSKK",
"KKSSWWWWWWWWWBBBBBBWWWWWWWWWSSKK",
"KKSSWWWWWWWBBBBBBBBBBWWWWWWWSSKK",
"KKSSWWWWWWBBBBBBBBBBBBWWWWWWSSKK",
"KKSSWWWWWBBBBKKKKKKBBBBWWWWWSSKK",
"KKSSWWWWWBBBKKKKKKKKBBBWWWWWSSKK",
"KKSSWWWWWBBBKKKKWWKKBBBWWWWWSSKK",
"KKSSWWWWWBBBKKKKKKKKBBBWWWWWSSKK",
"KKSSWWWWWBBBBKKKKKKBBBBWWWWWSSKK",
"KKSSWWWWWWBBBBBBBBBBBBWWWWWWSSKK",
"KKSSWWWWWWWBBBBBBBBBBWWWWWWWSSKK",
"KKSSWWWWWWWWWBBBBBBWWWWWWWWWSSKK",
"KKSSWWWWWWWWWWWWWWWWWWWWWWWWSSKK",
".KKSSWWWWWWWWWWWWWWWWWWWWWWSSKK.",
".KKSSSWWWWWWWWWWWWWWWWWWWWSSSKK.",
"..KKSSSSWWWWWWWWWWWWWWWWSSSSKK..",
"...KKSSSSWWWWWWWWWWWWWWSSSSKK...",
".....KKSSSSSSSSSSSSSSSSSSKK.....",
"......KKSSSSSSSSSSSSSSSSKK......",
"........KKSSSSSSSSSSSSKKSSKK....",
"..........KKKKKKKKKKKKSSSSKK....",
"........................SSSSKK..",
".........................SSSSKK.",
"..........................SSKKK."
],

/* ── BOSS 3 · THE BAN — the door closes ── */
LOCK: [
"................................",
".............KKKKKK.............",
"...........KKSSSSSSKK...........",
"..........KKSSKKKKSSKK..........",
".........KKSSKK..KKSSKK.........",
"........KKSSKK....KKSSKK........",
"........KKSSKK....KKSSKK........",
".......KKSSKK......KKSSKK.......",
".......KKSSKK......KKSSKK.......",
".......KKSSKK......KKSSKK.......",
".......KKSSKK......KKSSKK.......",
".......KKSSKK......KKSSKK.......",
".......KKSSKK......KKSSKK.......",
"....KKKKKKKKKKKKKKKKKKKKKKKK....",
"....KKyyyyyyyyyyyyyyyyyyyyKK....",
"....KKYYYYYYYYYYYYYYYYYYYYKK....",
"....KKYYYYYYYYYYYYYYYYYYYYKK....",
"....KKYYYYYYYYKKKKYYYYYYYYKK....",
"....KKYYYYYYYKKKKKKYYYYYYYKK....",
"....KKYYYYYYYKKKKKKYYYYYYYKK....",
"....KKYYYYYYYYKKKKYYYYYYYYKK....",
"....KKYYYYYYYYKKKKYYYYYYYYKK....",
"....KKYYYYYYYYKKKKYYYYYYYYKK....",
"....KKYYYYYYYKKKKKKYYYYYYYKK....",
"....KKYYYYYYYKKKKKKYYYYYYYKK....",
"....KKYYYYYYYYYYYYYYYYYYYYKK....",
"....KKYYYYYYYYYYYYYYYYYYYYKK....",
"....KKKKKKKKKKKKKKKKKKKKKKKK....",
".....KKKKKKKKKKKKKKKKKKKKKK.....",
"......DDDDDDDDDDDDDDDDDDDD......",
"................................",
"................................"
],

/* ── 16×16 command icons ── */
CRATE: [
"................",
"..KKKKKKKKKKKK..",
"..KyyyyyyyyyyK..",
"..KyKKyyyyKKyK..",
"..KyyKKyyKKyyK..",
"..KyyyKKKKyyyK..",
"..KyyKKyyKKyyK..",
"..KyKKyyyyKKyK..",
"..KyyyyyyyyyyK..",
"..KyKKyyyyKKyK..",
"..KyyKKyyKKyyK..",
"..KyyyKKKKyyyK..",
"..KyyKKyyKKyyK..",
"..KyyyyyyyyyyK..",
"..KKKKKKKKKKKK..",
"................"
],

FACTORY: [
"................",
"..KKK...........",
"..KSK...........",
"..KSK...........",
"..KSK...........",
"..KSK...........",
"KKKKKKKKKKKKKKKK",
"KSSSSSSSSSSSSSSK",
"KSWWSSWWSSWWSSSK",
"KSWWSSWWSSWWSSSK",
"KSSSSSSSSSSSSSSK",
"KSSKKKSSSSKKKSSK",
"KSSKyKSSSSKyKSSK",
"KSSKyKSSSSKyKSSK",
"KKKKKKKKKKKKKKKK",
"................"
],

SHIP: [
"................",
".........K......",
".........KR.....",
".........KRR....",
"......KKKKKKK...",
"......KyyyKyyK..",
"......KyyyKyyK..",
"..KKKKKKKKKKKKK.",
"..KrrKrrKrrKrrK.",
"..KrrKrrKrrKrrK.",
"..KKKKKKKKKKKKK.",
".KSSSSSSSSSSSSSK",
"..KSSSSSSSSSSSK.",
"...KKKKKKKKKKK..",
"..BB..BB..BB..BB",
"BB..BB..BB..BB.."
],

DOC: [
"................",
"..KKKKKKKKKK....",
"..KWWWWWWWWK....",
"..KWKKKKKKWK....",
"..KWWWWWWWWK....",
"..KWKKKKKKWK....",
"..KWWWWWWWWK....",
"..KWKKKKKKWK....",
"..KWWWWWWWWK....",
"..KWKKKKKKWK....",
"..KWWWWWWWWK....",
"..KKKKKKKKKK....",
"......KKKKKKKK..",
"......KRRRRRRK..",
"......KRRRRRRK..",
"......KKKKKKKK.."
],

DOOR: [
"................",
"...KKKKKKKKKK...",
"...KSSSSSSSSK...",
"...KSKKKKKKSK...",
"...KSKGGGGKSK...",
"...KSKGGGGKSK...",
"...KSKGGGGKSK...",
"...KSKGGGGKSK...",
"...KSKGGGGKSK...",
"...KSKGGGGKSK...",
"...KSKGGGGKSK...",
"...KSKGyGGKSK...",
"...KSKGGGGKSK...",
"...KSKKKKKKSK...",
"...KKKKKKKKKK...",
"................"
],

/* ── 8×8 HUD icons ── */
COIN: [
"..KKKK..",
".KyyyyK.",
"KyYYYYyK",
"KyYKKYyK",
"KyYKKYyK",
"KyYYYYyK",
".KyyyyK.",
"..KKKK.."
],

BOX: [
"KKKKKKKK",
"KyyyyyyK",
"KyKyyKyK",
"KyyKKyyK",
"KyyKKyyK",
"KyKyyKyK",
"KyyyyyyK",
"KKKKKKKK"
],

HAZ: [
"...KK...",
"..KKKK..",
"..KRRK..",
".KRKKRK.",
".KRKKRK.",
"KRRKKRRK",
"KRRRRRRK",
"KKKKKKKK"
]
};
