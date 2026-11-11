const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { build, SITE } = require("../build.js");

const { html } = build();

test("the build is a single file with no runtime network requests", () => {
  const body = html.replace(/<meta [^>]*>/g, "");
  assert.doesNotMatch(body, /https?:\/\/(?!www\.w3\.org)/);
  assert.doesNotMatch(html, /__[A-Z0-9]+__/, "unreplaced placeholder");
  assert.doesNotMatch(html, /<script[^>]+src=/i);
  assert.doesNotMatch(html, /<link[^>]+rel="stylesheet"/i);
});

test("the only absolute URLs are Open Graph metadata on the canonical site", () => {
  const urls = html.match(/https?:\/\/(?!www\.w3\.org)[^"' )]+/g) || [];
  assert.ok(urls.length > 0);
  for (const u of urls) assert.ok(u.startsWith(SITE + "/"), u);
  assert.match(html, /<meta property="og:image" content="[^"]+\/og\.png">/);
  assert.ok(fs.existsSync(path.join(__dirname, "../public/og.png")), "public/og.png is missing");
});

test("the inline game script parses", () => {
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  assert.equal(scripts.length, 1);
  assert.doesNotThrow(() => new vm.Script(scripts[0]));
});

test("committed public/index.html matches a fresh build", () => {
  /* the file is committed on purpose so it can be emailed or put on a flash drive; it must never be stale */
  const committed = fs.readFileSync(path.join(__dirname, "../public/index.html"), "utf8");
  assert.ok(committed === html, "public/index.html is stale: run `npm run build` and commit it");
});

test("CRLF source checkouts produce the same committed bytes", () => {
  const source = fs.readFileSync(path.join(__dirname, "../build.js"), "utf8");
  const sandbox = {
    module: { exports: {} }, __dirname: path.join(__dirname, ".."), Buffer,
    require(name) {
      if (name !== "fs") return require(name);
      return { ...fs, readFileSync(file, encoding) {
        const value = fs.readFileSync(file, encoding);
        return encoding === "utf8" ? value.replace(/\r\n?/g, "\n").replace(/\n/g, "\r\n") : value;
      } };
    }
  };
  vm.runInNewContext(source, sandbox);
  assert.ok(sandbox.module.exports.build().html === html, "CRLF inputs change the artifact bytes");
});
