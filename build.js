/**
 * Produces a single self-contained public/index.html.
 * The classroom PC may have no network, so nothing may be fetched at runtime:
 * fonts are inlined as base64 woff2 and sprites are inlined as source.
 */
const fs = require("fs");
const path = require("path");

const root = __dirname;
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const b64 = (f) => fs.readFileSync(path.join(root, "src/fonts", f)).toString("base64");

/* ── validate sprite maps before they ship ── */
const spritesSrc = read("src/sprites.js");
const SPR = eval(spritesSrc + ";SPR");
for (const [name, rows] of Object.entries(SPR)) {
  const w = rows[0].length;
  const bad = rows.map((r, i) => [i, r.length]).filter(([, len]) => len !== w);
  if (bad.length) throw new Error(`sprite ${name}: ragged rows ${JSON.stringify(bad)}`);
  if (rows.length !== w) throw new Error(`sprite ${name}: not square (${w}x${rows.length})`);
}

let out = read("src/index.src.html")
  .replace("__SPRITES__", () => spritesSrc)
  .replace("__PS2P__", `data:font/woff2;base64,${b64("ps2p.woff2")}`)
  .replace("__SILKB__", `data:font/woff2;base64,${b64("silkb.woff2")}`)
  .replace("__SILK__", `data:font/woff2;base64,${b64("silk.woff2")}`);

for (const token of ["__SPRITES__", "__PS2P__", "__SILK__", "__SILKB__"]) {
  if (out.includes(token)) throw new Error(`placeholder ${token} not replaced`);
}
if (/https?:\/\/(?!www\.w3\.org)/.test(out)) {
  throw new Error("external URL found — the build must be fully offline");
}

fs.mkdirSync(path.join(root, "public"), { recursive: true });
fs.writeFileSync(path.join(root, "public/index.html"), out);

console.log(
  `built public/index.html — ${(out.length / 1024).toFixed(0)} KB, ` +
    `${Object.keys(SPR).length} sprites, zero external requests`
);
