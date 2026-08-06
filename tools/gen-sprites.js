/* Rasterizes sprite maps so circles, diagonals and curves are geometrically right,
   then auto-outlines them. Output is pasted into src/sprites.js. */

const G = (w, h) => Array.from({ length: h }, () => Array(w).fill("."));
const put = (g, x, y, c) => {
  if (y >= 0 && y < g.length && x >= 0 && x < g[0].length) g[y][x] = c;
};
const disc = (g, cx, cy, rO, rI, c) => {
  for (let y = 0; y < g.length; y++)
    for (let x = 0; x < g[0].length; x++) {
      const d = Math.hypot(x - cx, y - cy);
      if (d <= rO + 0.5 && d >= rI - 0.5) put(g, x, y, c);
    }
};
const rect = (g, x0, y0, x1, y1, c) => {
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) put(g, x, y, c);
};
const line = (g, x0, y0, x1, y1, t, c) => {
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) * 4;
  for (let i = 0; i <= n; i++) {
    const x = x0 + ((x1 - x0) * i) / n, y = y0 + ((y1 - y0) * i) / n;
    for (let dy = 0; dy < t; dy++) for (let dx = 0; dx < t; dx++)
      put(g, Math.round(x + dx - (t - 1) / 2), Math.round(y + dy - (t - 1) / 2), c);
  }
};
/* wrap every non-empty pixel in an outline colour */
const outline = (g, c) => {
  const h = g.length, w = g[0].length, add = [];
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      if (g[y][x] !== ".") continue;
      let touch = false;
      for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]])
        if (g[y+dy] && g[y+dy][x+dx] && g[y+dy][x+dx] !== "." && g[y+dy][x+dx] !== c) touch = true;
      if (touch) add.push([x, y]);
    }
  add.forEach(([x, y]) => (g[y][x] = c));
};
const emit = (name, g) => {
  const rows = g.map((r) => r.join(""));
  const w = rows[0].length;
  if (rows.some((r) => r.length !== w) || rows.length !== w)
    throw new Error(name + " not square");
  console.log(`\n${name}: [\n${rows.map((r) => `"${r}"`).join(",\n")}\n],`);
};

/* ── BOSS 1 · THE TARIFF — a percent sign, its two rings are its eyes ── */
{
  const g = G(32, 32);
  disc(g, 8, 8, 6.2, 3.6, "R");         // top-left ring
  disc(g, 23, 23, 6.2, 3.6, "R");       // bottom-right ring
  line(g, 5, 27, 26, 4, 4, "R");        // the slash
  disc(g, 8, 8, 3.2, 0, "W");           // eye whites
  disc(g, 23, 23, 3.2, 0, "W");
  rect(g, 7, 7, 9, 10, "K");            // pupils
  rect(g, 22, 22, 24, 25, "K");
  outline(g, "K");
  emit("PCT", g);
}

/* ── BOSS 2 · THE BULLWHIP — small wobble in, huge swings out ── */
{
  const g = G(32, 32);
  let prev = null;
  for (let x = 1; x < 31; x++) {
    const amp = 1.2 + ((x - 1) / 29) ** 2.0 * 12;      // amplitude grows left to right
    const y = 18 - amp * Math.sin(((x - 1) / 29) * Math.PI * 3.0);
    if (prev) line(g, prev[0], prev[1], x, y, 3, "Y");
    prev = [x, y];
  }
  rect(g, 20, 6, 29, 12, ".");                          // clear a face panel on the last crest
  rect(g, 20, 6, 29, 12, "Y");
  rect(g, 21, 7, 23, 10, "W");                          // eyes
  rect(g, 26, 7, 28, 10, "W");
  rect(g, 22, 8, 23, 10, "K");
  rect(g, 27, 8, 28, 10, "K");
  outline(g, "K");
  emit("WAVE", g);
}

/* ── 16×16 icons ── */
const icon = (name, draw, oc = "K") => {
  const g = G(16, 16); draw(g); outline(g, oc); emit(name, g);
};

icon("PLANE", (g) => {
  line(g, 2, 8, 13, 8, 2, "s");          // fuselage
  line(g, 7, 3, 9, 8, 2, "s");           // wings
  line(g, 7, 13, 9, 8, 2, "s");
  line(g, 12, 5, 13, 8, 1, "s");         // tail
  put(g, 13, 8, "B"); put(g, 12, 8, "B");// nose window
});

icon("CHIP", (g) => {
  rect(g, 4, 4, 11, 11, "G");            // die
  rect(g, 6, 6, 9, 9, "K");
  for (let i = 5; i <= 10; i += 2) {     // legs
    rect(g, i, 2, i, 3, "s"); rect(g, i, 12, i, 13, "s");
    rect(g, 2, i, 3, i, "s"); rect(g, 12, i, 13, i, "s");
  }
});

icon("CAM", (g) => {
  rect(g, 2, 4, 13, 13, "S");            // body
  rect(g, 5, 2, 9, 3, "S");              // hump
  disc(g, 8, 9, 4.2, 0, "K");            // lens barrel
  disc(g, 8, 9, 3.2, 0, "B");
  disc(g, 8, 9, 1.4, 0, "W");
  rect(g, 11, 5, 12, 6, "y");            // flash
});

icon("SCREEN", (g) => {
  rect(g, 1, 2, 14, 11, "s");            // bezel
  rect(g, 3, 4, 12, 9, "B");             // glass
  rect(g, 6, 12, 9, 13, "s");            // stand
  rect(g, 4, 14, 11, 14, "s");
});



icon("CLOCK", (g) => {
  disc(g, 8, 8, 6.4, 0, "s");
  disc(g, 8, 8, 5.2, 0, "W");
  line(g, 8, 8, 8, 4, 1, "K");           // hands
  line(g, 8, 8, 11, 9, 1, "K");
});

/* 8×8 HUD phone */
{
  const g = G(8, 8);
  rect(g, 2, 0, 5, 7, "W");
  rect(g, 3, 1, 4, 5, "B");
  outline(g, "K");
  emit("PHONE8", g);
}

/* MONEY and TAG are pure straight lines, so they are authored directly rather
   than rasterized. The generated versions read as a face and a red wedge. */
const literal = (name, rows) => {
  const g = rows.map((r) => r.split(""));
  emit(name, g);
};
literal("MONEY", [
  "................","................","................",
  "KKKKKKKKKKKKKKKK","KGGGGGGGKGGGGGGK","KGGGGGGKKKKGGGGK",
  "KGGGGGKGKGGGGGGK","KGGGGGGKKKGGGGGK","KGGGGGGGKGKGGGGK",
  "KGGGGGKKKKGGGGGK","KGGGGGGGKGGGGGGK","KGGGGGGGGGGGGGGK",
  "KKKKKKKKKKKKKKKK","................","................","................",
]);
literal("TAG", [
  "................",".......KK.......","......KrrK......",
  ".....KrrrrK.....","....KrrrrrrK....","...KrrrrrrrrK...",
  "..KrrrrrrrrrrK..",".KrrrrrrrrrrrrK.",".KKKKKrrrrKKKKK.",
  ".....KrrrrK.....",".....KrrrrK.....",".....KrrrrK.....",
  ".....KrrrrK.....",".....KrrrrK.....",".....KKKKKK.....","................",
]);
