# AGENTS.md

## What this is

**TARIFF WARS** — a single-file, offline 8-bit browser game played *live in front of a class* during
a group presentation titled "Geopolitics, Trade Wars, and Supply Chain Disruptions."

It is the **playable summary of the whole group deck**, not of any one person's slides. Read
`Presentation 1.pdf` context below before changing content.

### The audience is the constraint

This is an **intro-level survey class**. An earlier version was built around adhesive bandages,
customs origin rulings, substantial transformation, Section 301/232, and lead times on German
converting equipment. It was rejected as too hard and too specific, and it was correct to reject it.

**Rules for content:**
- The product is a **phone**, because the deck's own anchor example (slide 3) is the iPhone's
  journey: US designs chips, Taiwan makes them, Japan does cameras, China assembles.
- Use **the deck's own vocabulary** so the class hears words it just heard: tariff, bullwhip effect,
  China + 1, stock up / front-loading, just-in-time vs just-in-case, reliance on one country.
- **Banned words** (all previously in and removed): substantial transformation, origin fraud, CBP,
  Section 301/232, USMCA, binding ruling, tier-two visibility, working capital, capital expenditure,
  carrying cost, spot market, transshipment, fill rate, exposure.
- Tone is light and a bit funny. It is a 5 minute game in a survey class, not a case study.
- No em dashes in user-facing copy. Trevor's call.
- Short sentences. If a line cannot be read faster than it can be said aloud, it is too long.

### The three metrics are deliberately plain

`cash` → **MONEY**, `phones` → **PHONES YOU CAN MAKE**, `risk` → **RELIANCE ON ONE COUNTRY**.
Do not rename these back to industry terms.

## Hard constraints (do not break these)

1. **Fully offline, single file.** It runs off a classroom PC that may have no network. `build.js`
   asserts there are no external URLs in the output and fails the build if it finds one. Fonts are
   inlined as base64 woff2; all art is generated from pixel maps at runtime. No CDN, no fetch, ever.
2. **Projector legibility.** Type scale is deliberately large and high contrast. If you shrink text
   "to fit more in", you have broken the only deployment target.
3. **Keyboard-driven.** `SPACE` advances, `1-4` records the room's vote, `←` steps back, `M` mutes,
   `F` fullscreen, `R` resets. Mouse works as a fallback.

## Build

```bash
node build.js          # src/ -> public/index.html
```

`build.js` inlines `src/sprites.js` and the three woff2 fonts into `src/index.src.html`.
**Edit `src/index.src.html`, never `public/index.html`** — the latter is generated and overwritten.

The build validates every sprite map is square with no ragged rows. That check exists because a
one-character typo in an ASCII sprite is invisible in source and silently mangles the sprite.

## Design decisions worth remembering

**Why not NES.css or a game engine.** Deliberately hand-rolled. A CSS framework would have made it
look like every other 8-bit web project. All 13 sprites are hand-authored ASCII maps in
`src/sprites.js` rendered to inline SVG with `shape-rendering:crispEdges`.

**Backgrounds are tiled pixel maps, not CSS gradients.** An earlier version used
`repeating-linear-gradient` for hazard stripes and a `radial-gradient` for the arena. It read as
"high quality stapled onto 8-bit" because smooth diagonals and gradients are what an 8-bit machine
cannot do. `stairTile()` generates a true 45-degree staircase (1px rise per 1px run, seamless when
tiled) and `checkerTile()` a hard dither. **Do not reintroduce gradients into the arena.**

**The impact banner does not rotate.** Rotation antialiases the edges and instantly reads as vector.
It is an unrotated banner with stepped `box-shadow` rings and a hard offset shadow.

**Audio is synthesized with Web Audio oscillators**, no audio files. Defaults ON, `M` toggles.

## The content model

Wide but shallow. There is no branching tree, because the game is played once. State is three
numbers plus two booleans:

- `cash` / `phones` / `risk`
- `stocked` — has the player ever bought a buffer of parts
- `plusone` — has the player ever started a second country (China + 1)

`posture()` collapses the booleans into `BOTH | STOCKED | PLUSONE | NONE`, which drives the round-3
aftermath and the final grade. That is the entire "branching".

**Dynamic options.** Round 2 option 3 ("sell spare parts") and option 4, and round 3 options 2 and 3,
all rewrite themselves based on `stocked` / `plusone`. That is what makes a 4-option menu feel like
it remembers you, and it is where the lesson lives:

- Round 2, if you stocked up: sell into the panic at a profit. If not: the warehouse is empty.
- Round 3, if you built: switch to factory two. If not: starting one now takes two years, too late.

## Balance (verified, keep it verified)

All 64 paths simulated. Distribution: **S=1, A=5, B=30, C=12, D=16.**

**The single S path is `STOCK UP > CHINA + 1 > USE FACTORY TWO`.** Buffer first, then structure, then
use it. That is the thesis and it is the unique optimum by construction.

`MOVE FACTORIES > PANIC BUY > USE FACTORY TWO` reaches the same end state but grades **A** at $15,
because doing the right things in the wrong order is the failure mode the presentation is about.

S requires `BOTH && cash>=30 && phones>=85 && risk<=60`. The `risk<=60` clause exists specifically so
that stocking up and building but never *using* the second factory does not qualify.

**A previous tuning pass made S mathematically unreachable.** If you touch any `dmg` value, re-run
the 64-path sweep in the browser console before shipping.

**Stocking up never changes `risk`. This is intentional and load-bearing** — the closing screen
says so out loud. A buffer buys time, it does not reduce dependence. Never give `stocked` a risk
discount.

## Presenting it

Three ways onto the classroom machine, use all three: the Vercel URL, the file emailed as an
attachment, and a copy on a flash drive. `public/index.html` is standalone — double-clicking it works
with no server.

Steps are linear (18 screens). `←` steps backwards and restores the metric snapshot, so a misfire
mid-presentation is recoverable. `next()` wraps `draw()` in a try/catch that skips a broken screen
rather than freezing, specifically so a bug cannot strand the presenter in front of the room.
