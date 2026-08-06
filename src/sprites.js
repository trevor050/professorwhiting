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

/* BOSS 1 · THE TARIFF — a percent sign whose two rings are its eyes */
PCT: [
"................................",
"......KKKKK.....................",
"....KKRRRRRKK...........KKKKK...",
"...KRRRRRRRRRK.........KRRRRRK..",
"..KRRRRRRRRRRRK.......KRRRRRRK..",
"..KRRRWWWWWRRRK......KRRRRRRRK..",
".KRRRWWWWWWWRRRK....KRRRRRRRRK..",
".KRRRWWKKKWWRRRK...KRRRRRRRRK...",
".KRRRWWKKKWWRRRK..KRRRRRRRRK....",
".KRRRWWKKKWWRRRK.KRRRRRRRRK.....",
".KRRRWWKKKWWRRRKKRRRRRRRRK......",
"..KRRRWWWWWRRRK.KRRRRRRRK.......",
"..KRRRRRRRRRRRKKRRRRRRRK........",
"...KRRRRRRRRRKKRRRRRRRK.........",
"....KKRRRRRKKKRRRRRRRK..........",
"......KKKKK.KRRRRRRRK...........",
"...........KRRRRRRRK.KKKKK......",
"..........KRRRRRRRKKKRRRRRKK....",
".........KRRRRRRRRKRRRRRRRRRK...",
"........KRRRRRRRRKRRRRRRRRRRRK..",
".......KRRRRRRRRKKRRRWWWWWRRRK..",
"......KRRRRRRRRKKRRRWWWWWWWRRRK.",
".....KRRRRRRRRK.KRRRWWKKKWWRRRK.",
".....KRRRRRRRK..KRRRWWKKKWWRRRK.",
"....KRRRRRRRK...KRRRWWKKKWWRRRK.",
"...KRRRRRRRK....KRRRWWKKKWWRRRK.",
"...KRRRRRRK......KRRRWWWWWRRRK..",
"...KRRRRRK.......KRRRRRRRRRRRK..",
"...KRRRRK.........KRRRRRRRRRK...",
"...KRRRRK..........KKRRRRRKK....",
"....KKKK.............KKKKK......",
"................................"
],

/* BOSS 2 · THE BULLWHIP — a small wobble in, a huge swing out */
WAVE: [
"................................",
"................................",
"................................",
"................................",
"................................",
"....................KKKKKKKKKK..",
"...................KYYYYYYYYYYK.",
"...................KYWWWYYWWWYK.",
"...................KYWKKYYWKKYK.",
"...................KYWKKYYWKKYK.",
"...................KYWKKYYWKKYK.",
"...................KYYYYYYYYYYK.",
"...................KYYYYYYYYYYYK",
"....................KYYYYKKYYYYK",
".....KKKKK..........KYYYYK.KYYYK",
"..KKKYYYYYKK.......KYYYYK..KYYYY",
"KKYYYYYYYYYYK......KYYYYK..KYYYY",
"YYYYYYYYYYYYYK....KYYYYK...KYYYY",
"YYYYYYYYYYYYYYK...KYYYYK....KYYY",
"YYYYKKKKKYYYYYYK.KYYYYK.....KYYY",
"KKKK.....KYYYYYYKYYYYYK......KKK",
"..........KYYYYYYYYYYK..........",
"...........KKYYYYYYYYK..........",
".............KYYYYYYK...........",
"..............KKKKKK............",
"................................",
"................................",
"................................",
"................................",
"................................",
"................................",
"................................"
],

/* airfreight */
PLANE: [
"................",
"................",
".......KK.......",
"......KssK......",
"......KssK..K...",
"......KsssKKsK..",
"......KsssKKsK..",
"..KKKKKKssKKKsK.",
".KssssssssssBBsK",
".KsssssssssssssK",
"..KKKKKsssKKKKK.",
"......KsssK.....",
"......KssK......",
"......KssK......",
"......KssK......",
".......KK......."
],

/* phone parts, one icon each so the brief is not three identical phones */
SCREEN: [
"................",
".KKKKKKKKKKKKKK.",
"KssssssssssssssK",
"KssssssssssssssK",
"KssBBBBBBBBBBssK",
"KssBBBBBBBBBBssK",
"KssBBBBBBBBBBssK",
"KssBBBBBBBBBBssK",
"KssBBBBBBBBBBssK",
"KssBBBBBBBBBBssK",
"KssssssssssssssK",
"KssssssssssssssK",
".KKKKKssssKKKKK.",
"....KKssssKK....",
"...KssssssssK...",
"....KKKKKKKK...."
],

/*  */
CHIP: [
"................",
".....K.K.K......",
"....KsKsKsK.....",
"....KsKsKsKK....",
"..KKGGGGGGGGKK..",
".KssGGGGGGGGssK.",
"..KKGGKKKKGGKK..",
".KssGGKKKKGGssK.",
"..KKGGKKKKGGKK..",
".KssGGKKKKGGssK.",
"..KKGGGGGGGGKK..",
"...KGGGGGGGGK...",
"....KsKsKsKK....",
"....KsKsKsK.....",
".....K.K.K......",
"................"
],

/*  */
CAM: [
"................",
".....KKKKK......",
"....KSSSSSK.....",
"..KKKSSSSSKKKK..",
".KSSSSSSSSSSSSK.",
".KSSSSKKKKKyySK.",
".KSSSKBBBBByySK.",
".KSSKBBBBBBBKSK.",
".KSSKBBWWWBBKSK.",
".KSSKBBWWWBBKSK.",
".KSSKBBWWWBBKSK.",
".KSSKBBBBBBBKSK.",
".KSSSKBBBBBKSSK.",
".KSSSSKKKKKSSSK.",
"..KKKK.....KKK..",
"................"
],

/* paying */
MONEY: [
"................",
"................",
"................",
".KKKKKKKKKKKKKK.",
"KGGGGGGGGGGGGGGK",
"KGGGGGGKKKGGGGGK",
"KGGKGGKKKKKGKGGK",
"KGGKGKKGGGKKKGGK",
"KGGKGKKGGGKKKGGK",
"KGGKGKKGGGKKKGGK",
"KGGKGGKKKKKGKGGK",
"KGGGGGGKKKGGGGGK",
"KGGGGGGGGGGGGGGK",
".KKKKKKKKKKKKKK.",
"................",
"................"
],

/* charging more */
TAG: [
"................",
"................",
"...........K.K..",
"..........KKKRK.",
".........KKKKK..",
".........KKKKRK.",
"........KRRKRRK.",
".......KRRRRRRK.",
"......KRRRRRRRK.",
".....KRRRRRRRRK.",
"....KRRRRRRRRRK.",
"...KRRRRRRRRRRK.",
"..KRRRRRRRRRRRK.",
".KRRRRRRRRRRRRK.",
"..KKKKKKKKKKKK..",
"................"
],

/* waiting */
CLOCK: [
"................",
".....KKKKKKK....",
"....KsssssssK...",
"...KssWWWWWssK..",
"..KsWWWWKWWWWsK.",
".KssWWWWKWWWWssK",
".KsWWWWWKWWWWWsK",
".KsWWWWWKWWWWWsK",
".KsWWWWWKKWWWWsK",
".KsWWWWWWWKKWWsK",
".KsWWWWWWWWWWWsK",
".KssWWWWWWWWWssK",
"..KsWWWWWWWWWsK.",
"...KssWWWWWssK..",
"....KsssssssK...",
".....KKKKKKK...."
],

/* HUD: phones you can make */
PHONE8: [
".KWWWWK.",
".KWBBWK.",
".KWBBWK.",
".KWBBWK.",
".KWBBWK.",
".KWBBWK.",
".KWWWWK.",
".KWWWWK."
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
