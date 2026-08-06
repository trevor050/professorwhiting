# AGENTS.md

## What this is

**TARIFF WARS** — a single-file, offline 8-bit browser game built to be played *live in front of a
class* as part of a group presentation on geopolitical events and trade wars.

Trevor's section of the group deck argues one thesis:

> Inventory buffers and nearshoring operate on completely different clocks.
> A buffer deploys in days and protects for months. Nearshoring takes years and protects for decades.
> **Everyone who survived did both, in that order.**

The game exists to make the class *feel* that thesis instead of reading it off a slide. It is played
once, by one room, driven from the keyboard by the presenter.

Live at: see `vercel.json` / `vercel ls`.

## Hard constraints (do not break these)

1. **Fully offline, single file.** It runs off a classroom PC that may have no network. `build.js`
   asserts there are no external URLs in the output and fails the build if it finds one. Fonts are
   inlined as base64 woff2; all art is generated from pixel maps at runtime. No CDN, no fetch, ever.
2. **Projector legibility.** Type scale is deliberately large and the palette is high contrast on
   near-black. If you shrink text "to fit more in", you have broken the only deployment target.
3. **Keyboard-driven.** `SPACE` advances, `1-4` records the room's vote, `←` steps back, `M` mutes,
   `F` fullscreen, `R` resets. Mouse works as a fallback. The presenter is standing at a lectern.
4. **No em dashes in user-facing copy.** Trevor's call. Code comments are fine.
5. **Copy stays blunt.** Short sentences, concrete nouns, no clever asides. Earlier drafts were
   literary and got rejected as hard to follow at a glance. If a line cannot be read faster than it
   can be said aloud, it is too long.

## Build

```bash
node build.js          # src/ -> public/index.html
```

`build.js` inlines `src/sprites.js` and the three woff2 fonts into `src/index.src.html`.
**Edit `src/index.src.html`, never `public/index.html`** — the latter is generated and overwritten.

The build validates every sprite map is square and has no ragged rows. That check exists because a
one-character typo in an ASCII sprite is invisible in source and produces a silently mangled sprite.

## Design decisions worth remembering

**Why not NES.css or a game engine.** Deliberately hand-rolled. A CSS framework would have made it
look like every other 8-bit web project. All 11 sprites are hand-authored ASCII maps in
`src/sprites.js` rendered to inline SVG with `shape-rendering:crispEdges`.

**Backgrounds are tiled pixel maps, not CSS gradients.** An earlier version used
`repeating-linear-gradient` for the hazard stripes and a `radial-gradient` for the arena. It read as
"high quality stapled onto 8-bit" because smooth diagonals and gradients are exactly what an 8-bit
machine cannot do. `stairTile()` generates a true 45-degree staircase (1px rise per 1px run, seamless
when tiled) and `checkerTile()` generates a hard dither. Both go through the same sprite renderer.
**Do not reintroduce gradients into the arena.**

**The impact banner does not rotate.** The first version was a rotated bordered div. Rotation
antialiases the edges and instantly reads as vector. It is now an unrotated banner with stepped
`box-shadow` rings and a hard offset shadow.

**Audio is synthesized with Web Audio oscillators**, no audio files. Defaults ON, `M` toggles.
Classroom audio is a coin flip, so check it in the room before presenting.

## The content model

12 outcome cards, wide but shallow. There is no state machine or branching tree, because the game is
played exactly once. Game state is three numbers plus two booleans:

- `cash` / `fill` / `exp` — the three tracked metrics
- `buffer` — has the player ever bought inventory cover
- `structural` — has the player ever started building Monterrey

`posture()` collapses those two booleans into `BOTH | BUFFER | STRUCT | NONE`, which drives the
round-3 aftermath text and the final grade. This is the entire "branching".

Round 2 and round 3 option #2 are **dynamic** (`buildR2()` / `buildR3()`): the same slot reads
"MONTERREY / BREAK GROUND" if you have not started building and "ACCELERATE / OPEN LINE 2" if you
have. That is what makes a 4-option menu feel like it remembers you.

### The Vietnam trap (do not soften this)

Round 1 option 3 (Ha Long Nonwovens) is written to look like the obviously correct answer: cheapest,
fastest, clean audit, and it resolves with a **green CLEARED stamp** and drops exposure 85 → 35.
Then round 2's aftermath reveals they were slitting Chinese master rolls, exposure snaps back to 85,
and a red `DETAINED / ORIGIN FRAUD` banner slams down.

Nothing on the option card hints at it. That is the point — the information the player needed was
never on the card, which is the actual lesson about tier-two supplier visibility. Every playtest
instinct to "make it fairer" should be resisted.

## Balance (verified, keep it verified)

All 64 paths were simulated. Current distribution:

| Grade | Paths |
|-------|-------|
| S | 1 |
| A | 10 |
| B | 29 |
| C | 8 |
| D | 16 |

**Exactly one path reaches S: `STOCKPILE > MONTERREY > OPEN LINE 2`** — buffer first, then structure,
then the payoff. That is the thesis, and it is the unique optimum by construction.

`MONTERREY > SPOT BUY > LINE 2` reaches the same end state but ends insolvent at grade A, because
doing the right things in the wrong order is the failure mode the presentation is about.

An earlier tuning pass made **S mathematically unreachable** (the intended path ended at -$5M). If
you touch any `dmg` value, re-run the 64-path sweep before shipping. The three numbers that make S
reachable are: `AFT2[1]` cash `+6.0` (pre-duty stock appreciates once the duty lands),
`AFT3.BOTH` cash `+4.0` (the plant is producing), and round-3 `OPEN LINE 2` at `-7.0`.

## Presenting it

Three ways onto the classroom machine, use all three: the Vercel URL, the file emailed as an
attachment, and a copy on a flash drive. `public/index.html` is standalone — double-clicking it works
with no server.

Steps are linear (18 screens). `←` steps backwards and restores the metric snapshot, so a misfire
mid-presentation is recoverable. `next()` wraps `draw()` in a try/catch that skips a broken screen
rather than freezing, specifically so a bug cannot strand the presenter in front of the room.
