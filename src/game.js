/* ═══════════════════════════════════════════════════════════════
   GAME RULES AND CONTENT. Pure data and pure functions, no DOM.
   build.js inlines this file into the page; test/*.test.js requires it.
   Every state change in the game goes through applyDelta().
   ═══════════════════════════════════════════════════════════════ */

const START = { cash: 100, phones: 100, risk: 90, stocked: false, plusone: false, quit: false, picks: [], menus: {} };

/* clamp ranges per metric; cash may go a little negative, the other two are percentages */
const CAPS = { cash: [-99, 999], phones: [0, 100], risk: [0, 100] };

const BOSS = {
  1: { n: "THE TARIFF", s: "30% ON EVERYTHING FROM CHINA, STARTING NEXT MONTH", art: "PCT", cls: "" },
  2: { n: "THE BULLWHIP", s: "EVERYBODY PANICKED AND ORDERED TRIPLE", art: "WAVE", cls: "b3" },
  3: { n: "THE SHUTDOWN", s: "THE PORT IS CLOSED FOR TWO MONTHS", art: "LOCK", cls: "b2" }
};

const SHOCK = {
  1: "A trade war starts. Next month, everything you import from China gets 30% more expensive.\n\nThat is a tariff. Somebody has to pay it, and unless you do something, that somebody is you.",
  2: "Every phone company panicked at once and ordered triple. Now suppliers are backed up for months and parts cost whatever they feel like.\n\nThis is the bullwhip effect. A small panic goes in, a huge mess comes out.",
  3: "The port closes. Nothing leaves China for two months.\n\nIf everything you own comes from one place, this is the round where you find out."
};

const R1 = [
  { n: 1, ic: "MONEY", t: "EAT THE COST", d: "Pay the tariff yourself. Keep your price exactly where it is.",
    st: [["COST", "BIG"], ["TAKES", "NO TIME"], ["FIXES IT?", "NO"]],
    stamp: ["PAID", null, "sa"], dmg: { cash: -30 },
    res: "You pay it. Every phone, every month. Your customers never notice, which is nice, and your bank account absolutely does.",
    alt: "Costs a fortune and changes nothing." },
  /* passing a tariff on protects your margin per phone but sells fewer phones; it does not make you richer */
  { n: 2, ic: "TAG", t: "RAISE PRICES", d: "Charge customers more and let them cover the tariff.",
    st: [["COST", "NONE"], ["TAKES", "NO TIME"], ["FIXES IT?", "NO"]],
    stamp: ["PRICE UP", null, "sa"], dmg: { phones: -20 },
    res: "Your phone costs more now. Some people shrug and buy it. A lot of people go look at what else is out there.",
    alt: "You keep your margin. You lose the customers." },
  /* front-loading: the tariff is announced, so buying before it starts actually dodges it */
  { n: 3, ic: "CRATE", t: "STOCK UP", d: "Buy a year of parts right now, before the tariff kicks in.",
    st: [["COST", "MEDIUM"], ["TAKES", "WEEKS"], ["FIXES IT?", "FOR A WHILE"]],
    stamp: ["WAREHOUSE FULL", null, "sg"], dmg: { cash: -25, phones: 10 }, set: { stocked: true },
    res: "Your warehouse is packed to the roof, all bought at the old price. You have a year of breathing room.\n\nYou still buy everything from the same country. You just bought time to do something about it.",
    alt: "Buys you a year. Does not fix the actual problem." },
  { n: 4, ic: "FACTORY", t: "MOVE FACTORIES", d: "Start building phones in Vietnam too. This is the China + 1 strategy.",
    st: [["COST", "HUGE"], ["TAKES", "2 YEARS"], ["FIXES IT?", "EVENTUALLY"]],
    stamp: ["BUILDING", null, "sa"], dmg: { cash: -40, phones: -10, risk: -10 }, set: { plusone: true },
    res: "Construction starts. This is genuinely the right idea.\n\nIt is also two years from making a single phone, and you just spent most of your money.",
    alt: "The right move. Just very slow and very expensive." }
];

const R2 = [
  { n: 1, ic: "CRATE", t: "PANIC BUY TOO", d: "Everyone else is panic buying. Join them and overpay.",
    st: [["COST", "HUGE"], ["TAKES", "WEEKS"], ["FIXES IT?", "FOR A WHILE"]],
    stamp: ["BOUGHT HIGH", null, "sa"], dmg: { cash: -35, phones: 20 }, set: { stocked: true },
    res: "You buy parts at the worst possible price, along with everybody else, which is exactly why the price is so bad.",
    alt: "Works, at the worst price of the year." },
  { n: 2, ic: "CLOCK", t: "WAIT IT OUT", d: "Do nothing. Panics end. Let this one end.",
    st: [["COST", "NONE"], ["TAKES", "MONTHS"], ["FIXES IT?", "NO"]],
    stamp: ["WAITING", null, "sa"], dmg: { phones: -20 },
    res: "You are right that the panic ends. You are also out of parts while you wait for it.",
    alt: "Free. You just cannot build much." },
  { n: 3, ic: "MONEY", t: "SELL SPARE PARTS", d: "", st: [], stamp: ["", null, "sa"], dmg: {}, res: "", alt: "" },
  { n: 4, ic: "FACTORY", t: "", d: "", st: [], stamp: ["", null, "sa"], dmg: {}, res: "", alt: "" }
];

const R3 = [
  { n: 1, ic: "PLANE", t: "FLY IT IN", d: "Forget the boat. Put the parts on planes.",
    st: [["COST", "HUGE"], ["TAKES", "DAYS"], ["FIXES IT?", "THIS ONCE"]],
    stamp: ["AIRLIFTED", null, "sa"], dmg: { cash: -40, phones: 20 },
    res: "It works and it is absurdly expensive. Planes hold a lot less than ships do, and they charge like it.",
    alt: "Fast, once, for a painful amount of money." },
  { n: 2, ic: "CRATE", t: "RIDE IT OUT", d: "", st: [], stamp: ["", null, "sa"], dmg: {}, res: "", alt: "" },
  { n: 3, ic: "FACTORY", t: "", d: "", st: [], stamp: ["", null, "sa"], dmg: {}, res: "", alt: "" },
  { n: 4, ic: "DOOR", t: "SELL THE COMPANY", d: "Take the money and go do something else with your life.",
    st: [["COST", "NONE"], ["TAKES", "NO TIME"], ["FIXES IT?", "TECHNICALLY"]],
    stamp: ["SOLD", null, "sr"], dmg: { cash: 40, phones: -60, risk: -90 }, set: { quit: true },
    res: "You sell. Your risk drops to zero, because you no longer make anything.\n\nThe company that buys you built a second factory back in year one.",
    alt: "Risk hits zero because the company does." }
];

/* what your round 1 pick did to you, one year later */
const AFT2 = {
  0: { stamp: ["STILL PAYING", null, "sa"], dmg: { cash: -15 },
    txt: "A year goes by. The tariff does not. You paid it every single month and your profits are gone." },
  1: { stamp: ["CUSTOMERS LEFT", null, "sa"], dmg: { phones: -10 },
    txt: "A cheaper phone showed up while yours got expensive. Some of your customers are using it right now." },
  2: { stamp: ["GOOD CALL", null, "sg"], dmg: { cash: 15 },
    txt: "Prices kept climbing after you bought. The parts sitting in your warehouse are now worth more than you paid for them.\n\nYou sell a few spares and look like a genius. Mostly you were just early." },
  3: { stamp: ["HALF A FACTORY", null, "sa"], dmg: { cash: -15, phones: -10 },
    txt: "Your new factory is half built and makes exactly zero phones.\n\nMeanwhile you are still buying everything from China at 30% more, with nothing saved up." }
};

/* what your overall strategy did to you, two years later */
const AFT3 = {
  BOTH: { stamp: ["IT WORKED", null, "sg"], dmg: { cash: 15, phones: 10 },
    txt: "The new factory makes its first real phones the same month your warehouse runs dry.\n\nThat is not luck twice in a row. That is what the stockpile was for." },
  STOCKED: { stamp: ["WAREHOUSE EMPTY", null, "sa"], dmg: { phones: -25 },
    txt: "You are out of parts. You are back exactly where you started, except with less money.\n\nStocking up buys time. You never spent the time on anything." },
  PLUSONE: { stamp: ["FINALLY OPEN", null, "sa"], dmg: { cash: -10, phones: -15 },
    txt: "The factory finally works. It took two years, and you could barely ship a phone the whole time it was being built.\n\nCustomers do not wait two years." },
  NONE: { stamp: ["NO BACKUP", null, "sr"], dmg: { cash: -20, phones: -30 }, crit: true,
    txt: "No spare parts. No second factory. Everything still comes from one country.\n\nYou have been getting away with it. That is about to end." }
};

const STEPS = [
  { t: "title" }, { t: "brief" },
  { t: "boss", r: 1 }, { t: "menu", r: 1 }, { t: "result", r: 1 }, { t: "paths", r: 1 },
  { t: "aft", r: 2 }, { t: "boss", r: 2 }, { t: "menu", r: 2 }, { t: "result", r: 2 }, { t: "paths", r: 2 },
  { t: "aft", r: 3 }, { t: "boss", r: 3 }, { t: "menu", r: 3 }, { t: "result", r: 3 }, { t: "paths", r: 3 },
  { t: "rank" }, { t: "lesson" }
];

function clone(o) { return JSON.parse(JSON.stringify(o)) }
function freshState() { return clone(START) }

/* round 2 options 3 and 4 rewrite themselves based on what you did in round 1 */
function buildR2(S) {
  const o = clone(R2);
  /* option 3 only pays off if you actually stocked up in round 1 */
  if (S.stocked) {
    o[2].d = "You are sitting on a warehouse everyone else desperately wants. Sell some of it.";
    o[2].st = [["COST", "NONE"], ["TAKES", "DAYS"], ["FIXES IT?", "PROFITABLE"]];
    o[2].stamp = ["SOLD HIGH", null, "sg"]; o[2].dmg = { cash: 30, phones: -10 };
    o[2].res = "You bought cheap and everyone else is buying expensive. You sell part of your stockpile straight into the panic.";
    o[2].alt = "Free money, but only if you stocked up last year.";
  } else {
    o[2].d = "Sell spare parts into the panic. Requires having spare parts.";
    o[2].st = [["COST", "NONE"], ["TAKES", "N/A"], ["FIXES IT?", "NO"]];
    o[2].stamp = ["NOTHING TO SELL", null, "sr"]; o[2].dmg = { phones: -15 };
    o[2].res = "You go to the warehouse. The warehouse is empty. You never stocked up, so there is nothing to sell and nothing to build with either.";
    o[2].alt = "Nothing in the warehouse. Nothing to sell.";
  }
  /* option 4 is either starting China + 1 or speeding up the one you started */
  if (S.plusone) {
    o[3].t = "SPEED IT UP"; o[3].d = "Throw money at the half built factory and open it early.";
    o[3].st = [["COST", "MEDIUM"], ["TAKES", "MONTHS"], ["FIXES IT?", "YES"]];
    o[3].stamp = ["OPENING EARLY", null, "sg"]; o[3].dmg = { cash: -15, phones: 10, risk: -25 };
    o[3].res = "Extra crews, extra shifts, extra money. The factory opens months ahead of schedule because you already had one going up.";
    o[3].alt = "Only on the menu because you started building last year.";
  } else {
    o[3].t = "CHINA + 1"; o[3].d = "Start building in Vietnam now. Keep China, add a second country.";
    o[3].st = [["COST", "HUGE"], ["TAKES", "2 YEARS"], ["FIXES IT?", "EVENTUALLY"]];
    o[3].stamp = ["BUILDING", null, "sa"]; o[3].dmg = { cash: -40, phones: -10, risk: -10 };
    o[3].res = "You start building. Correct idea, and you are a year late to it, so it costs more and arrives later.";
    o[3].alt = "Right idea, started a year late.";
  }
  o[3].set = { plusone: true };
  return o;
}

/* round 3 options 2 and 3 are the payoff (or the bill) for the stockpile and the second factory */
function buildR3(S) {
  const o = clone(R3);
  if (S.stocked) {
    o[1].d = "Just use the parts in your warehouse until the port opens again.";
    o[1].st = [["COST", "NONE"], ["TAKES", "NO TIME"], ["FIXES IT?", "YES"]];
    o[1].stamp = ["COVERED", null, "sg"]; o[1].dmg = { phones: 10 };
    o[1].res = "The port is closed and you barely notice, because you already own the parts. This is the entire point of a stockpile.";
    o[1].alt = "Free, easy, and only possible if you stocked up.";
  } else {
    o[1].d = "Use the parts in your warehouse. Assuming you have any.";
    o[1].st = [["COST", "NONE"], ["TAKES", "NO TIME"], ["FIXES IT?", "NO"]];
    o[1].stamp = ["EMPTY SHELVES", null, "sr"]; o[1].dmg = { phones: -30 };
    o[1].res = "There is nothing in the warehouse to ride out anything with. The line stops. You just wait, like everybody else who did not prepare.";
    o[1].alt = "Nothing to ride it out with.";
  }
  if (S.plusone) {
    o[2].t = "USE FACTORY TWO"; o[2].d = "Switch production to Vietnam. It has been running for a year.";
    o[2].st = [["COST", "SMALL"], ["TAKES", "DAYS"], ["FIXES IT?", "YES"]];
    o[2].stamp = ["SWITCHED", null, "sg"]; o[2].dmg = { cash: -10, phones: 25, risk: -30 };
    o[2].res = "You flip production to Vietnam and keep shipping while your competitors sit and wait for a port to reopen.\n\nThe decision that made this possible was made two years ago.";
    o[2].alt = "Keep shipping while everyone else waits.";
  } else {
    o[2].t = "BUILD A FACTORY"; o[2].d = "Start a second factory right now, in the middle of the shutdown.";
    o[2].st = [["COST", "HUGE"], ["TAKES", "2 YEARS"], ["FIXES IT?", "TOO LATE"]];
    o[2].stamp = ["TWO YEARS OUT", null, "sr"]; o[2].dmg = { cash: -45, phones: -15 };
    o[2].res = "You start building. It will be ready in two years.\n\nThe shutdown is happening now. Money cannot buy back the two years you did not start.";
    o[2].alt = "Two years too late to help with this.";
  }
  return o;
}

function menuFor(r, S) { return r === 1 ? clone(R1) : r === 2 ? buildR2(S) : buildR3(S) }

function posture(S) {
  if (S.stocked && S.plusone) return "BOTH";
  if (S.stocked) return "STOCKED";
  if (S.plusone) return "PLUSONE";
  return "NONE";
}

/* the aftermath screen that opens round r (2 or 3) */
function aftermath(r, S) { return r === 2 ? AFT2[S.picks[0]] : AFT3[posture(S)] }

/* record the room's pick for round r: remembers the menu as shown, and sets the strategy flags */
function pick(S, r, i, opts) {
  S.picks[r - 1] = i;
  S.menus[r] = opts;
  if (opts[i].set) Object.assign(S, opts[i].set);
  return opts[i];
}

/* the one place metrics change; clamps each metric to CAPS */
function applyDelta(S, d) {
  Object.keys(d || {}).forEach(function (k) {
    if (!d[k]) return;
    S[k] = Math.min(CAPS[k][1], Math.max(CAPS[k][0], S[k] + d[k]));
  });
  return S;
}

/* is this change good for the player? risk is the one metric where down is good */
function isGood(k, v) { return k === "risk" ? v < 0 : v > 0 }

function grade(S) {
  if (S.quit) return { g: "D", c: "red", t: "YOU SOLD THE COMPANY",
    x: "Your reliance on one country is zero, because you do not make anything anymore. The company that bought you started building a second factory back in year one." };
  const p = posture(S);
  if (p === "BOTH" && S.cash >= 30 && S.phones >= 85 && S.risk <= 60) return { g: "S", c: "green", t: "YOU ACTUALLY PULLED IT OFF",
    x: "You stocked up first, which bought you time. Then you spent that time building a second factory. That order is the whole trick, and almost nobody picks it in round one." };
  if (p === "BOTH") return { g: "A", c: "amber", t: "YOU MADE IT. BARELY.",
    x: "You did both of the right things and paid full price for both. You survived, and you are broke. Doing them in the other order would have been cheaper." };
  if (p === "STOCKED") return { g: "B", c: "amber", t: "SAFE FOR NOW, STUCK FOREVER",
    x: "Stocking up kept you alive and it never fixed anything. Same country, same parts, same problem, less money. A stockpile always runs out." };
  if (p === "PLUSONE") return { g: "B", c: "amber", t: "RIGHT IDEA, TERRIBLE TIMING",
    x: "The second factory was the correct call. You just had nothing to sell during the two years it took to build, and customers do not wait two years." };
  return { g: "C", c: "red", t: "OOF",
    x: "No spare parts, no second factory, everything still from one country. You saved money every single round, and it cost you more every single round." };
}

/* play a whole game headlessly, in the same order the screens apply effects */
function simulate(picks) {
  const S = freshState();
  STEPS.forEach(function (st) {
    if (st.t === "menu") pick(S, st.r, picks[st.r - 1], menuFor(st.r, S));
    else if (st.t === "result") applyDelta(S, S.menus[st.r][S.picks[st.r - 1]].dmg);
    else if (st.t === "aft") applyDelta(S, aftermath(st.r, S).dmg);
  });
  return { state: S, grade: grade(S) };
}

if (typeof module !== "undefined") {
  module.exports = { START, CAPS, BOSS, SHOCK, R1, R2, R3, AFT2, AFT3, STEPS,
    clone, freshState, buildR2, buildR3, menuFor, posture, aftermath, pick, applyDelta, isGood, grade, simulate };
}
