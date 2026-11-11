const test = require("node:test");
const assert = require("node:assert/strict");
const G = require("../src/game.js");

const allPaths = () => {
  const out = [];
  for (let a = 0; a < 4; a++) for (let b = 0; b < 4; b++) for (let c = 0; c < 4; c++) out.push([a, b, c]);
  return out;
};
const flagCombos = [
  { stocked: false, plusone: false },
  { stocked: true, plusone: false },
  { stocked: false, plusone: true },
  { stocked: true, plusone: true }
];

test("the 64-path sweep keeps its documented grade distribution", () => {
  const dist = {};
  for (const p of allPaths()) {
    const g = G.simulate(p).grade.g;
    dist[g] = (dist[g] || 0) + 1;
  }
  assert.deepEqual(dist, { S: 1, A: 5, B: 30, C: 12, D: 16 });
});

test("S is reachable by exactly one path: stock up, then China + 1, then use factory two", () => {
  const s = allPaths().filter((p) => G.simulate(p).grade.g === "S");
  assert.deepEqual(s, [[2, 3, 2]]);
  const { state } = G.simulate([2, 3, 2]);
  assert.equal(G.menuFor(1, G.freshState())[2].t, "STOCK UP");
  assert.equal(state.menus[2][3].t, "CHINA + 1");
  assert.equal(state.menus[3][2].t, "USE FACTORY TWO");
});

test("the right moves in the wrong order grade A, not S", () => {
  /* MOVE FACTORIES > PANIC BUY > USE FACTORY TWO reaches the same posture */
  const r = G.simulate([3, 0, 2]);
  assert.equal(G.posture(r.state), "BOTH");
  assert.equal(r.grade.g, "A");
});

test("stocking up and building but never using the second factory is not S", () => {
  /* the risk <= 60 clause exists for exactly this path */
  const r = G.simulate([2, 3, 1]);
  assert.equal(G.posture(r.state), "BOTH");
  assert.equal(r.grade.g, "A");
});

test("selling the company is always a D", () => {
  for (const p of allPaths().filter((p) => p[2] === 3)) assert.equal(G.simulate(p).grade.g, "D");
});

test("a stockpile never changes reliance on one country", () => {
  /* load-bearing: the closing screen says so out loud */
  const menus = [G.R1].concat(flagCombos.flatMap((f) => [G.buildR2(f), G.buildR3(f)]));
  for (const opts of menus) {
    for (const o of opts) {
      if (o.set && o.set.stocked) assert.ok(!o.dmg.risk, `${o.t} stocks up and changes risk`);
      if (o.t === "SELL SPARE PARTS" || o.t === "RIDE IT OUT") assert.ok(!o.dmg.risk, `${o.t} changes risk`);
    }
  }
  for (const a of Object.values(G.AFT2)) assert.ok(!a.dmg.risk);
  assert.ok(!G.AFT3.STOCKED.dmg.risk);
});

test("round 2 and round 3 menus remember what you did", () => {
  assert.equal(G.buildR2({ stocked: true }).at(2).stamp[0], "SOLD HIGH");
  assert.equal(G.buildR2({ stocked: false }).at(2).stamp[0], "NOTHING TO SELL");
  assert.equal(G.buildR2({ plusone: true }).at(3).t, "SPEED IT UP");
  assert.equal(G.buildR2({ plusone: false }).at(3).t, "CHINA + 1");
  assert.equal(G.buildR3({ stocked: true }).at(1).stamp[0], "COVERED");
  assert.equal(G.buildR3({ stocked: false }).at(1).stamp[0], "EMPTY SHELVES");
  assert.equal(G.buildR3({ plusone: true }).at(2).t, "USE FACTORY TWO");
  assert.equal(G.buildR3({ plusone: false }).at(2).t, "BUILD A FACTORY");
  /* building in round 2 always counts as China + 1, whichever version you were offered */
  for (const f of flagCombos) assert.deepEqual(G.buildR2(f)[3].set, { plusone: true });
});

test("menus are copies, so picking never mutates the content tables", () => {
  const before = JSON.stringify([G.R1, G.R2, G.R3]);
  for (const p of allPaths()) G.simulate(p);
  assert.equal(JSON.stringify([G.R1, G.R2, G.R3]), before);
});

test("applyDelta clamps every metric to its range", () => {
  const S = G.freshState();
  G.applyDelta(S, { phones: 500, risk: -500, cash: -500 });
  assert.equal(S.phones, 100);
  assert.equal(S.risk, 0);
  assert.equal(S.cash, G.CAPS.cash[0]);
  G.applyDelta(S, { cash: 5000 });
  assert.equal(S.cash, G.CAPS.cash[1]);
});

test("isGood treats reliance as the one metric where down is good", () => {
  assert.equal(G.isGood("cash", 10), true);
  assert.equal(G.isGood("phones", -10), false);
  assert.equal(G.isGood("risk", -10), true);
  assert.equal(G.isGood("risk", 10), false);
});

test("raising prices protects margin but does not make money", () => {
  /* passing a tariff on to customers costs volume; it is not a profit */
  const raise = G.R1.find((o) => o.t === "RAISE PRICES");
  assert.ok(!(raise.dmg.cash > 0));
  assert.ok(raise.dmg.phones < 0);
});

test("every menu option shows four complete cards", () => {
  const menus = [G.R1].concat(flagCombos.flatMap((f) => [G.buildR2(f), G.buildR3(f)]));
  for (const opts of menus) {
    assert.equal(opts.length, 4);
    for (const o of opts) {
      for (const k of ["t", "d", "res", "alt"]) assert.ok(o[k], `${o.t || "?"} is missing ${k}`);
      assert.equal(o.st.length, 3, `${o.t} needs COST / TAKES / FIXES IT?`);
      assert.ok(o.stamp[0], `${o.t} has no stamp`);
    }
  }
});

test("user-facing copy follows the content rules: no em dashes, no banned jargon", () => {
  /* see AGENTS.md: this is an intro-level class */
  const banned = ["substantial transformation", "origin fraud", "CBP", "Section 301", "Section 232", "USMCA",
    "binding ruling", "tier-two", "working capital", "capital expenditure", "carrying cost", "spot market",
    "transshipment", "fill rate", "exposure"];
  const menus = [G.R1].concat(flagCombos.flatMap((f) => [G.buildR2(f), G.buildR3(f)]));
  const copy = JSON.stringify([G.BOSS, G.SHOCK, G.AFT2, G.AFT3, menus, allPaths().map((p) => G.simulate(p).grade)]);
  assert.ok(!copy.includes("—"), "em dash in game copy");
  for (const w of banned) assert.ok(!copy.toLowerCase().includes(w.toLowerCase()), `banned word: ${w}`);
});
