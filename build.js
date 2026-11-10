/**
 * Produces a single self-contained public/index.html.
 * The classroom PC may have no network, so nothing may be fetched at runtime:
 * fonts are inlined as base64 woff2, sprites and game logic are inlined as source.
 *
 * The only absolute URLs allowed in the output are SITE inside <meta> tags
 * (Open Graph needs absolute image URLs). Meta tags are never fetched by the page.
 */
const fs = require("fs");
const path = require("path");

const SITE = "https://professorwhiting.vercel.app";

const root = __dirname;
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");
const b64 = (f) => fs.readFileSync(path.join(root, "src/fonts", f)).toString("base64");

function build() {
  /* ── validate sprite maps before they ship ── */
  const spritesSrc = read("src/sprites.js");
  const { SPR, PAL } = new Function(spritesSrc + ";return {SPR,PAL}")();
  for (const [name, rows] of Object.entries(SPR)) {
    const w = rows[0].length;
    const bad = rows.map((r, i) => [i, r.length]).filter(([, len]) => len !== w);
    if (bad.length) throw new Error(`sprite ${name}: ragged rows ${JSON.stringify(bad)}`);
    if (rows.length !== w) throw new Error(`sprite ${name}: not square (${w}x${rows.length})`);
    const unknown = [...new Set(rows.join(""))].filter((c) => c !== "." && !(c in PAL));
    if (unknown.length) throw new Error(`sprite ${name}: colours not in PAL ${JSON.stringify(unknown)}`);
  }

  /* ── favicon: the TARIFF boss, rendered from its pixel map ── */
  const pct = SPR.PCT;
  let rects = "";
  pct.forEach((row, y) => {
    for (let x = 0; x < row.length; ) {
      const c = row[x];
      let run = 1;
      while (x + run < row.length && row[x + run] === c) run++;
      if (c !== ".") rects += `<rect x="${x}" y="${y}" width="${run}" height="1" fill="${PAL[c]}"/>`;
      x += run;
    }
  });
  const favicon =
    "data:image/svg+xml;base64," +
    Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${pct.length} ${pct.length}" shape-rendering="crispEdges">${rects}</svg>`
    ).toString("base64");

  const gameSrc = read("src/game.js");

  let out = read("src/index.src.html")
    .replace("__SPRITES__", () => spritesSrc)
    .replace("__GAME__", () => gameSrc)
    .replace("__FAVICON__", () => favicon)
    .replace(/__SITE__/g, SITE)
    .replace("__PS2P__", `data:font/woff2;base64,${b64("ps2p.woff2")}`)
    .replace("__SILKB__", `data:font/woff2;base64,${b64("silkb.woff2")}`)
    .replace("__SILK__", `data:font/woff2;base64,${b64("silk.woff2")}`);

  for (const token of ["__SPRITES__", "__GAME__", "__FAVICON__", "__SITE__", "__PS2P__", "__SILK__", "__SILKB__"]) {
    if (out.includes(token)) throw new Error(`placeholder ${token} not replaced`);
  }
  const withoutMeta = out.replace(/<meta [^>]*>/g, "");
  if (/https?:\/\/(?!www\.w3\.org)/.test(withoutMeta)) {
    throw new Error("external URL found outside <meta>: the build must be fully offline");
  }
  const metaUrls = (out.match(/<meta [^>]*>/g) || []).join("\n").match(/https?:\/\/[^"']+/g) || [];
  const foreign = metaUrls.filter((u) => !u.startsWith(SITE + "/"));
  if (foreign.length) throw new Error(`unexpected URL in <meta>: ${foreign.join(", ")}`);

  return { html: out, sprites: Object.keys(SPR).length };
}

if (require.main === module) {
  const { html, sprites } = build();
  fs.mkdirSync(path.join(root, "public"), { recursive: true });
  fs.writeFileSync(path.join(root, "public/index.html"), html);
  console.log(
    `built public/index.html: ${(html.length / 1024).toFixed(0)} KB, ` +
      `${sprites} sprites, zero runtime requests`
  );
}

module.exports = { build, SITE };
