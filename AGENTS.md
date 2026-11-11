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
3. **Keyboard-driven.** `SPACE` advances, `1-4` records the room's vote, `←` steps back, `P` pauses,
   `M` mutes, `F` fullscreen, `R` resets (asks twice mid-game). Mouse and touch work too: the control
   bar is buttons, and `html.touch` (set from `(hover:none) and (pointer:coarse)` or a first
   `touchstart`) swaps PRESS copy for TAP copy via `.kb` / `.tc` spans.

## Build and test

```bash
npm run build   # node build.js: src/ -> public/index.html
npm test        # node --test test/*.test.js (no deps)
```

`build.js` inlines `src/sprites.js`, `src/game.js`, a favicon (rendered from `SPR.PCT`) and the three
woff2 fonts into `src/index.src.html`. **Edit `src/`, never `public/index.html`.** It is committed on
purpose (emailed / flash drive) and `test/build.test.js` fails if it is stale: rebuild before commit.
CI (`.github/workflows/ci.yml`) runs tests, build, then `git diff --exit-code`.

The build validates every sprite map is square, has no ragged rows and uses only `PAL` colours.

Offline rule: the only absolute URLs allowed are `SITE` (`https://tariffwars.trevorrosato.com`) inside
`<meta>` tags (Open Graph needs absolute image URLs; meta tags are never fetched). `public/og.png` is a
1200x630 screenshot of the real title screen. If the deploy URL changes, change `SITE` in build.js.

Files: `src/game.js` = all rules + copy, pure, `module.exports` guarded so it also runs inline.
`src/index.src.html` = rendering, input, audio, persistence. Every metric change goes through
`applyDelta()`; `simulate(picks)` replays a game in screen order and is what the tests use.

## Design decisions worth remembering

**Why not NES.css or a game engine.** Deliberately hand-rolled. A CSS framework would have made it
look like every other 8-bit web project. All 16 sprites live in `src/sprites.js` as ASCII maps and
render to inline SVG with `shape-rendering:crispEdges`.

**Sprites with curves, circles or diagonals are rasterized, not hand-placed.** Hand-placing pixels
produced a "stack of crates" that read as a toaster and a percent sign that was not round. The
generator lives at `tools/gen-sprites.js`: it draws with `disc` / `line` / `rect` into a grid, runs
`outline()` to wrap every shape in the outline colour, asserts the result is square, and prints maps
to paste in. **Regenerate with it rather than editing curved sprites by hand**, and preview as
terminal blocks before trusting a shape.

**Every sprite must be legible at a glance to someone who has never seen it.** Ones that failed and
were replaced: a crate stack meant to be "the bullwhip effect" (read as a robot), a rubber stamp for
"the tariff" (replaced with a giant `%` whose two rings are its eyes), a cargo ship used for an
airfreight option, and the same phone icon repeated for screen / chips / camera in the briefing.

**Backgrounds are tiled pixel maps, not CSS gradients.** An earlier version used
`repeating-linear-gradient` for hazard stripes and a `radial-gradient` for the arena. It read as
"high quality stapled onto 8-bit" because smooth diagonals and gradients are what an 8-bit machine
cannot do. `stairTile()` generates a true 45-degree staircase (1px rise per 1px run, seamless when
tiled) and `checkerTile()` a hard dither. **Do not reintroduce gradients into the arena.**

**The impact banner does not rotate.** Rotation antialiases the edges and instantly reads as vector.
It is an unrotated banner with stepped `box-shadow` rings and a hard offset shadow.

**Audio is synthesized with Web Audio oscillators**, no audio files. Defaults ON, `M` toggles
(stored in localStorage). `ac()` returns null until the first gesture (`GEST`) so a resumed run does
not trip autoplay warnings. Music is a step sequencer in `SONGS` (16 steps/bar, MIDI numbers): `theme`
on title/brief/lesson, `vote` on menus, silence elsewhere so the presenter can talk.

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

Menus are built from a deep copy (`menuFor`) and the shown menu is stored in `S.menus[r]` at pick
time, so result/paths screens (and a refresh) show exactly what the room voted on.

Economics fixed in Nov 2026, keep them: the tariff is *announced* for next month (so STOCK UP is
front-loading, not buying at the tariffed price); RAISE PRICES has no cash gain (margin kept, volume
lost); the briefing shows where parts end up, not invented BOM percentages.

## Balance (verified, keep it verified)

All 64 paths simulated. Distribution: **S=1, A=5, B=30, C=12, D=16.**

**The single S path is `STOCK UP > CHINA + 1 > USE FACTORY TWO`.** Buffer first, then structure, then
use it. That is the thesis and it is the unique optimum by construction.

`MOVE FACTORIES > PANIC BUY > USE FACTORY TWO` reaches the same end state but grades **A** at $15,
because doing the right things in the wrong order is the failure mode the presentation is about.

S requires `BOTH && cash>=30 && phones>=85 && risk<=60`. The `risk<=60` clause exists specifically so
that stocking up and building but never *using* the second factory does not qualify.

**A previous tuning pass made S mathematically unreachable.** `npm test` now pins the distribution,
the unique S path, the wrong-order A, and stocked-never-touches-risk. Touch a `dmg` value, run it.

**Stocking up never changes `risk`. This is intentional and load-bearing** — the closing screen
says so out loud. A buffer buys time, it does not reduce dependence. Never give `stocked` a risk
discount.

## Presenting it

Three ways onto the classroom machine, use all three: the Vercel URL, the file emailed as an
attachment, and a copy on a flash drive. `public/index.html` is standalone — double-clicking it works
with no server.

Steps are linear (18 screens). State model, easy to break:
- `entry` = snapshot of `S` taken in `enterStep()` *before* the screen's effects; `hist` stores
  `{step, state: entry}`. `back()` restores the previous screen's entry state and replays its effects.
  (The old code snapshotted after effects: back onto a result applied damage twice, and back into a
  menu kept the old pick's flags.)
- Effects mutate `S` immediately; only the HUD (`shown`) animates on timers. All screen timers go
  through `later()` and are cancelled in `enterStep()`, so nothing lands after back/reset.
- `choose()` locks with `choosing` so a double vote cannot apply two picks. Resuming a paused, confirmed vote completes its transition; its one-shot timer may have expired while paused. `test/flow.test.js` pins both timer orders.
- Persistence: `{step, entry, hist}` in localStorage key `tariffwars.v2`, saved on every screen
  entry; boot resumes from it. All storage access is try/catch.
- `enterStep()` wraps `draw()` in a try/catch that skips a broken screen rather than freezing.

Verify in a browser at 1920x1080, ~1024x768 and a phone with touch. Headless Chromium does not report
`pointer:coarse`; dispatch a `touchstart` to get the touch UI. Driving it: `STEPS[step].t`, `S`, `TW.done`
are globals. agent-browser needs `--executable-path` to the cached `chromium_headless_shell-1254`.

- Build text is normalized to LF, and .gitattributes keeps fresh Windows source/artifact checkouts LF. Verify generated public/index.html against the raw HEAD blob; Git diff alone normalizes CRLF and can hide byte differences.
