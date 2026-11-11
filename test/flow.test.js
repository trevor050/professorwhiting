const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const game = require("../src/game.js");

/* Exercise the real flow functions with a controllable clock and inert rendering.
   The browser smoke check covers their integration with the generated page. */
function flow() {
  const source = fs.readFileSync(path.join(__dirname, "../src/index.src.html"), "utf8");
  const start = source.indexOf("function snap(o)");
  const end = source.indexOf("function toggleSound()");
  assert.ok(start >= 0 && end > start);
  const timers = [];
  const noop = () => {};
  const state = game.freshState();
  const steps = game.clone(game.STEPS);
  steps[3]._opts = game.menuFor(1, state);
  const context = {
    clone: game.clone, freshState: game.freshState, pick: game.pick,
    S: state, entry: game.clone(state), step: 3, hist: [], STEPS: steps,
    PAUSED: false, choosing: false, TW: { done: true }, KEY: "test",
    SFX: { pick: noop, page: noop, nope: noop },
    stage: { querySelector: () => null },
    document: { querySelectorAll: () => [] },
    pauseEl: { classList: { toggle: noop } },
    store: noop, draw: noop, fitSprites: noop, requestAnimationFrame: noop,
    finishType: noop, stopMusic: noop, syncMusic: noop, toast: noop,
    clearTimeout: noop, setTimeout: (f) => timers.push(f),
    later: (f) => timers.push(f), cancelFx: () => { timers.length = 0; }, stopType: noop
  };
  vm.createContext(context);
  vm.runInContext(source.slice(start, end), context);
  return { context, timers };
}

for (const timerFired of [false, true]) {
  test(`a paused vote advances once on resume, transition timer fired: ${timerFired}`, () => {
    const { context: c, timers } = flow();
    c.choose(1);
    c.setPause(true);
    if (timerFired) timers.shift()();
    assert.equal(c.step, 3);
    c.setPause(false);
    assert.equal(c.step, 4, "confirmed vote must reach its result after resuming");
    assert.equal(c.S.picks[0], 1);
    while (timers.length) timers.shift()();
    assert.equal(c.step, 4, "the old timer must not advance a second screen");
    assert.equal(c.hist.length, 1);
  });
}
