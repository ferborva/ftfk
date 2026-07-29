# El juego dentro del juego / The game inside the game

A bilingual (Spanish/English) website that teaches the foundational principles of football
to a young player, built from *La Teoría del Fútbol* / *Football Theory*
(Raymond Verheijen, after Jan Tamboer, Bert van Lingen and the KNVB).

## Opening it

Just double-click **`index.html`**. No build step, no server, no internet needed.
Everything works offline from the filesystem.

## What's here

| File | What it is |
|---|---|
| `index.html` | Home: the big idea, the three pillars, chapter grid, reading progress |
| `01-acciones.html` | Football is a game of actions — action language, "say what you see" |
| `02-mapa.html` | The map of a match — attacking / defending / transition + the 4 team tasks |
| `03-transicion.html` | The 2 seconds that decide everything — transition |
| `04-secretos.html` | The 4 secrets of every action — position, moment, direction, speed |
| `05-decidir.html` | "Didn't see it, or couldn't do it?" — decision vs execution |
| `06-piezas.html` | The 4 pieces of a player — communication → insight → technique → fitness |
| `07-mejor-y-mas.html` | Better, more, and to the end — quality, quantity, staying power |
| `08-sistemas.html` | Everything you do moves the pitch — systems thinking, chains |
| `09-equipo.html` | Team first: intention — the "what for?" rule |
| `10-entrenar.html` | How to train your head — practical, for a Tuesday afternoon |
| `glosario.html` | Searchable glossary, generated from `glossary.js` |
| `style.css` | Design system (dark default for night reading, light theme available) |
| `app.js` | Navigation, language + theme switching, tooltips, diagram renderers, quizzes |
| `glossary.js` | All 52 terms in both languages — the single source for tooltips *and* the glossary page |

## How it's put together

**Bilingual.** Every piece of prose exists twice, as `<p class="es">` and `<p class="en">`.
CSS hides one language (`html[data-lang="en"] .es { display:none }`). The toggle lives in the
header and the choice is remembered in `localStorage`. Spanish is the default, so the site
reads correctly even with JavaScript off.

**Diagrams are generated, not drawn.** Pitch diagrams are declared as JSON on the element:

```html
<div class="pitch" data-pitch='{"view":"full","players":[...],"arrows":[...]}'></div>
```

`app.js` renders them to SVG using real pitch dimensions (105 × 68). Labels accept
`{"es":"...","en":"..."}` objects and re-render when the language changes.

Two things worth knowing if you edit a diagram:

- **No apostrophes inside `data-pitch`.** The attribute is single-quoted, so a `'` inside
  the JSON silently truncates it. Use `cannot` instead of `can't`, or `&#39;`.
- Annotation (text, strokes, arrowheads) is **scale-invariant**: it stays the same on-screen
  size no matter which `view` crop you use, and gets boosted on narrow screens. That's why
  the crop views are deliberately wide — a narrow crop of a landscape pitch produces a
  portrait figure that swallows a phone screen.

**Tooltips.** `<b class="t" data-t="desmarque">desmarque</b>` pulls its definition from
`glossary.js` in the current language. Works on hover (desktop) and tap (mobile).
Adding a word to `glossary.js` makes it available to tooltips and the glossary page at once.

**Progress.** "Mark this chapter as read" stores chapter ids in `localStorage` under
`jdj.read`; the home page shows a progress ring and ticks.

**Cache busting.** Asset links carry `?v=5`. If you edit `style.css`, `app.js` or
`glossary.js` and the change doesn't show up, bump that number in all HTML files.

## What was deliberately left out

The source book is mostly about **periodisation** for professional coaches: how long to rest
between sessions, how to plan a six-week cycle, phosphate and lactic-acid systems, weekly
planning for first-team squads. None of that is a 10-year-old's job, so chapters 5–8 of the
book are not represented here. The site covers the book's chapters 1–4: the football theory
itself, football performance, and the training philosophy.
