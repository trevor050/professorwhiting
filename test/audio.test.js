const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

/* AudioContext.resume() can reject, for example in Firefox when the page is
   reloaded while resume is still pending. Those rejections must be handled,
   or every such reload logs an uncaught InvalidStateError. */
test("a rejected AudioContext.resume() is never left unhandled", async () => {
  const source = fs.readFileSync(path.join(__dirname, "../src/index.src.html"), "utf8");
  const start = source.indexOf("function ac(){");
  const end = source.indexOf("function tone(");
  assert.ok(start >= 0 && end > start);
  class FakeContext {
    constructor() { this.state = "suspended"; }
    resume() { return Promise.reject(new Error("InvalidStateError: Navigated away from page")); }
  }
  const context = { GEST: true, AC: null, window: { AudioContext: FakeContext }, setTimeout: () => {}, syncMusic: () => {}, Promise };
  vm.createContext(context);
  vm.runInContext(`let GEST=true,AC=null;${source.slice(start, end)}`, context);
  const unhandled = [];
  const onUnhandled = (reason) => unhandled.push(String(reason));
  process.on("unhandledRejection", onUnhandled);
  try {
    vm.runInContext("ac(); ac();", context);
    await new Promise((r) => setTimeout(r, 20));
  } finally {
    process.off("unhandledRejection", onUnhandled);
  }
  assert.deepEqual(unhandled, []);
});
