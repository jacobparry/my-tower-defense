# Diamond Dread — Design Spec

A top-down 2D survival-mining game where the goal is to climb a pickaxe tech
tree, mine your first diamond (which **ends the game as a win**), and avoid a
demon that can only move when you are not looking at it.

Lives in `games/dread/` as a self-contained `dread.html` + `dread.js` pair using
p5.js in global mode, matching repo conventions. Added as a card on `index.html`
and documented in `README.md`.

## Source Rules (from request)

1. Move with arrow keys.
2. The game ends when you mine your first diamond.
3. Random "would you rather" prompts pop up every minute.
4. Each "would you rather" grants something good at the cost of something bad.
5. Caves appear every 15 seconds.
6. You mine ore with pickaxes.
7. Different materials are needed for different pickaxes.
8. Night happens (sped up to ~3.5 min per design decision, not 15 min).
9. Monsters appear at night.
10. Everything is "realistic" — interpreted as clean flat-shaded solid shapes
    with lighting/shadow for day-night and cave darkness; not pixel-art, not
    literal photorealism.
11. Rarity ladder: stone rarer than wood, iron rarer than stone, ruby rarer
    than iron, diamond rarer than ruby.
12. Ore appears in caves.
13. A demon chases you throughout the game.
14. If you look at the demon, it freezes.
15. The demon kills you in one hit.

Pickaxe recipes:
- Wood Pickaxe — 2 sticks, 3 wood
- Stone Pickaxe — 2 sticks, 3 stone
- Iron Pickaxe — 2 sticks, 3 iron
- Ruby Pickaxe — 2 sticks, 3 ruby

## Design Decisions (confirmed)

- **Perspective:** Top-down 2D, fixed canvas (~900×700).
- **Demon gaze:** Freezes when within the player's facing cone; advances toward
  the player otherwise. Contact = instant death.
- **Timings:** Caves every 15s, would-you-rather every 60s, night at ~3.5 min,
  demon always present.

## World & Movement

- Fixed canvas, scrolling/centered overworld. Arrow keys move the player.
- Player has a **facing direction** = last non-zero movement direction, drawn as
  a small indicator (e.g. an arrow / pick orientation).
- **Trees** (decorative + harvestable) dot the overworld at fixed/random spots.
- Every **15 seconds** a **cave entrance** spawns at a random open overworld
  location. Walking onto a cave entrance transitions into that cave's interior
  view (a darker screen). Leaving the cave returns to the overworld.
- Overworld is day-lit; caves are always dark (vignette around player).

## Gathering & Pickaxe Tech Tree

- **Punch trees** (no tool needed) → **wood**.
- **Craft sticks** from wood: 1 wood → 2 sticks (crafting menu).
- Pickaxe ladder (each pickaxe required to mine the next tier of ore):
  - Wood Pickaxe (2 sticks + 3 wood) → mines **stone**
  - Stone Pickaxe (2 sticks + 3 stone) → mines **iron**
  - Iron Pickaxe (2 sticks + 3 iron) → mines **ruby**
  - Ruby Pickaxe (2 sticks + 3 ruby) → mines **diamond**
- Holding a higher pickaxe can mine all lower tiers too.
- **Mining your first diamond ends the game = WIN.**

## Ore & Caves

- Ore nodes are embedded inside caves only.
- Cave ore composition obeys the rarity ladder via descending spawn weights:
  stone > iron > ruby > diamond (wood is only from trees, not caves).
- Mining a node with the correct (or better) pickaxe yields its material and
  removes the node; with too weak a pickaxe, mining does nothing (with feedback).

## The Demon (Weeping-Angel)

- A single demon is always present, hunting the player across overworld and
  caves.
- **Facing cone check each frame:** if the demon lies within the player's facing
  cone (angle threshold + optionally line-of-sight), the demon is **frozen** and
  rendered "caught in your gaze". Otherwise it moves toward the player at its
  speed.
- **Contact = instant death** → `gameover` (lose).
- Provides constant tension: the player must periodically face the demon, which
  conflicts with facing the direction they want to travel/mine.

## Would-You-Rather

- Every **60 seconds** the game pauses and a modal presents **two** options.
- Each option grants a perk **and** imposes a cost. Examples:
  - "Faster mining" BUT "demon moves faster"
  - "+1 max heart" BUT "trees give less wood"
  - "Move faster" BUT "wider — easier for monsters to hit"
  - "See ore through walls" BUT "narrower gaze cone"
- The player must pick one (no skip). Effects apply immediately and persist.

## Night & Monsters

- Day/night cycle. Night falls at ~3.5 min; screen darkens (overworld dims
  toward cave-like darkness).
- At night, **monsters** spawn at the map edges and chase the player.
- Monsters **chip HP** on contact (not instant kill). Player swings the equipped
  pickaxe to damage/kill monsters.
- The demon persists through day and night independently of monsters.

## Health

- Player has **HP shown as hearts** (e.g. 3 to start; would-you-rather can
  raise max).
- Monsters reduce HP; reaching 0 HP → `gameover` (lose).
- Demon ignores HP — always one-hit kill.

## State Machine & HUD

- `gameState`: `"menu"`, `"play"`, `"craft"`, `"wyr"`, `"gameover"`, `"win"`.
- `"craft"` opened with a key (e.g. `C`); pauses play.
- `"wyr"` triggered on the 60s timer; pauses play.
- HUD (drawn on canvas): inventory counts (wood, sticks, stone, iron, ruby,
  diamond), current pickaxe, HP hearts, day/night clock, and a demon-proximity
  indicator.

## Architecture

- Single `dread.js`, p5.js global mode. Required top-level functions:
  `setup()`, `draw()`, `keyPressed()`/`keyReleased()` (movement + menu keys),
  `mousePressed()` (menu/would-you-rather button clicks), `windowResized()`.
- Entity arrays: `trees[]`, `caves[]`, `ores[]`, `monsters[]`, `particles[]`,
  plus a single `demon` and `player` object.
- Entity classes with `update()` and `draw()` methods; backward-iteration
  removal pattern when culling.
- `gameSpeed`-style time handling via frame deltas; timers for cave spawn (15s),
  would-you-rather (60s), and night (~3.5 min).
- In-canvas UI only — no DOM elements (matches existing games).

## Art Direction

- Clean flat-shaded 2D: solid readable shapes, soft shadows, a radial light
  vignette for caves and night. Distinct, legible colors per material
  (brown wood, gray stone, tan iron, red ruby, cyan diamond). Demon is a dark
  menacing silhouette with glowing eyes.

## Testing / Verification

- No automated tests in this repo. Verify by serving the root with a static
  server and playing: confirm movement + facing, tree harvesting, crafting each
  pickaxe, cave spawn cadence, ore mining gated by pickaxe tier, would-you-rather
  cadence and effects, demon freeze-on-gaze + instant kill, night onset +
  monsters, and the diamond win condition.

## Out of Scope (YAGNI)

- Saving/loading, multiple levels, sound, mobile/touch controls, multiplayer,
  a full crafting tree beyond the five recipes above.
