# Diamond Dread Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a top-down 2D survival-mining game where you climb a pickaxe tech tree, mine your first diamond (a win), avoid monsters at night, and evade a demon that only moves when you are not looking at it.

**Architecture:** A single self-contained p5.js global-mode game in `games/dread/` (`dread.html` + `dread.js`), following the exact conventions of the other games in this repo (CDN-loaded p5.js, in-canvas UI, no DOM widgets, no build step). All game logic lives in `dread.js` with a string `gameState` machine, entity arrays + classes with `update()`/`draw()`, and frame-delta timers.

**Tech Stack:** HTML + p5.js 1.4.0 (CDN), vanilla JS. No package manager, no test framework, no build step.

## Global Constraints

- p5.js loaded from `https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js` (match existing games).
- p5.js **global mode**: top-level `setup()`, `draw()`, `keyPressed()`, `keyReleased()`, `mousePressed()`, `windowResized()`.
- Fixed canvas **900×700**, parented to `#sketch-holder`.
- **All UI drawn on the canvas** — no DOM elements except the standard `#back-button` link.
- Verification is **manual in-browser** (no test framework exists in this repo). Serve root with `python3 -m http.server 8000` and open `http://localhost:8000/games/dread/dread.html`. Use browser console for assertions where noted.
- Recipes are fixed: Wood Pickaxe = 2 sticks + 3 wood; Stone = 2 sticks + 3 stone; Iron = 2 sticks + 3 iron; Ruby = 2 sticks + 3 ruby. Sticks = 1 wood → 2 sticks.
- Timers: caves every **15s**, would-you-rather every **60s**, night at **~3.5 min (210s)**.
- Rarity ladder for cave ore spawn weights: stone > iron > ruby > diamond.
- Demon: always present, freezes when inside the player's facing cone, **instant kill** on contact.
- Win condition: mining the **first diamond** ends the game as a win.

---

### Task 1: Scaffold game files, hub card, and README

Create the HTML shell, an empty-but-running `dread.js` with a title-screen state machine, wire it into `index.html`, and document it in `README.md`. Deliverable: the game loads, shows a menu, and is reachable from the hub.

**Files:**
- Create: `games/dread/dread.html`
- Create: `games/dread/dread.js`
- Modify: `index.html` (add `.dread-card` CSS rule near line ~107 and a game card near line ~213)
- Modify: `README.md` (add a game description)

**Interfaces:**
- Produces: global `gameState` (string), `CW = 900`, `CH = 700` canvas constants, `function startGame()` that resets state and sets `gameState = "play"`.

- [ ] **Step 1: Create `games/dread/dread.html`**

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Diamond Dread</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js"></script>
    <style>
        body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #1a1a1a;
        }
        #sketch-holder {
            position: relative;
            box-shadow: 0 0 30px rgba(0, 0, 0, 0.7);
        }
        #back-button {
            position: absolute;
            top: 10px;
            left: 10px;
            padding: 10px 20px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-family: Arial, sans-serif;
            z-index: 10;
        }
        #back-button:hover { background: rgba(0, 0, 0, 0.9); }
    </style>
</head>
<body>
    <a href="../../index.html" id="back-button">← Back to Games</a>
    <div id="sketch-holder"></div>
    <script src="dread.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create `games/dread/dread.js` with a minimal menu state machine**

```javascript
// Diamond Dread — top-down survival mining. See docs/superpowers/specs.
const CW = 900;
const CH = 700;

let gameState = "menu"; // "menu" | "play" | "craft" | "wyr" | "gameover" | "win"

function setup() {
  const canvas = createCanvas(CW, CH);
  canvas.parent("sketch-holder");
  textFont("Arial");
}

function startGame() {
  gameState = "play";
}

function draw() {
  background(30, 30, 35);
  if (gameState === "menu") {
    drawMenu();
  } else if (gameState === "play") {
    background(60, 120, 60);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(20);
    text("Play state — coming soon", CW / 2, CH / 2);
  }
}

function drawMenu() {
  fill(220, 60, 60);
  textAlign(CENTER, CENTER);
  textSize(56);
  text("💎 DIAMOND DREAD", CW / 2, CH / 2 - 120);
  fill(200);
  textSize(18);
  text("Arrows: move   C: craft", CW / 2, CH / 2 - 50);
  text("Mine your first diamond to win. Don't let the demon touch you.", CW / 2, CH / 2 - 20);
  // Start button
  fill(60, 160, 90);
  rectMode(CENTER);
  rect(CW / 2, CH / 2 + 60, 200, 60, 10);
  fill(255);
  textSize(24);
  text("START", CW / 2, CH / 2 + 60);
  rectMode(CORNER);
}

function mousePressed() {
  if (gameState === "menu") {
    if (mouseX > CW / 2 - 100 && mouseX < CW / 2 + 100 &&
        mouseY > CH / 2 + 30 && mouseY < CH / 2 + 90) {
      startGame();
    }
  }
}

function keyPressed() {}
function keyReleased() {}
function windowResized() {}
```

- [ ] **Step 3: Add the hub card CSS rule to `index.html`**

After the `.kitten-card { ... }` rule (around line 109), add:

```css
        .dread-card {
            background: linear-gradient(135deg, rgba(120, 40, 200, 0.3), rgba(40, 200, 220, 0.3));
        }
```

- [ ] **Step 4: Add the hub game card to `index.html`**

Immediately before the closing `</div>` of `.games-container` (after the kitten card, ~line 213):

```html
        <a href="games/dread/dread.html" class="game-card dread-card">
            <div class="game-title">💎 Diamond Dread</div>
            <div class="game-theme">Survival Mining Horror</div>
            <div class="game-description">
                Chop, craft, and mine your way up the pickaxe tech tree to the first diamond.
                But caves hide ore, night brings monsters, and a demon hunts you — it only
                moves when you're not looking.
            </div>
            <div class="game-features">
                ✦ Wood → Stone → Iron → Ruby → Diamond<br>
                ✦ Caves appear every 15 seconds<br>
                ✦ Would-you-rather every minute<br>
                ✦ Never take your eyes off the demon
            </div>
            <div class="status new">New! 🌟</div>
        </a>
```

- [ ] **Step 5: Add a README entry**

Add a bullet/section describing Diamond Dread alongside the other games in `README.md` (match the surrounding format — find where the other games are listed and add a parallel entry):

```markdown
### 💎 Diamond Dread (`games/dread/`)
Top-down survival mining. Chop trees, craft pickaxes (wood → stone → iron → ruby),
and dive into caves that appear every 15 seconds to mine ore. Mining your first
diamond wins the game. A would-you-rather choice strikes every minute, monsters
spawn at night, and a demon chases you that only freezes while you look at it —
and kills you in one hit.
```

- [ ] **Step 6: Verify in browser**

Run: `python3 -m http.server 8000` (from repo root), open `http://localhost:8000/index.html`.
Expected: a "💎 Diamond Dread" card appears. Clicking it loads the game; the menu shows the title and a START button; clicking START switches to a green "Play state — coming soon" screen. No console errors.

- [ ] **Step 7: Commit**

```bash
git add games/dread/ index.html README.md
git commit -m "scaffold Diamond Dread game: menu, hub card, README"
```

---

### Task 2: Player movement and facing direction

Add a player with arrow-key movement bounded to the canvas, and a facing direction (last non-zero movement) drawn as an indicator. Deliverable: a controllable character that visibly faces where it last moved.

**Files:**
- Modify: `games/dread/dread.js`

**Interfaces:**
- Consumes: `gameState`, `CW`, `CH`, `startGame()`.
- Produces: global `player` object `{ x, y, r, speed, facing: {x, y} }`; `function updatePlayer()`; `function drawPlayer()`; `const keys = {}` map populated by `keyPressed`/`keyReleased`.

- [ ] **Step 1: Add player state and key tracking**

Add near the top globals:

```javascript
let player; // set in startGame()
const keys = {}; // keyCode -> bool

function resetPlayer() {
  player = {
    x: CW / 2,
    y: CH / 2,
    r: 16,
    speed: 3.2,
    facing: { x: 0, y: 1 }, // default facing down
  };
}
```

Update `startGame()`:

```javascript
function startGame() {
  resetPlayer();
  gameState = "play";
}
```

- [ ] **Step 2: Implement movement + facing update**

```javascript
function updatePlayer() {
  let dx = 0, dy = 0;
  if (keys[LEFT_ARROW]) dx -= 1;
  if (keys[RIGHT_ARROW]) dx += 1;
  if (keys[UP_ARROW]) dy -= 1;
  if (keys[DOWN_ARROW]) dy += 1;
  if (dx !== 0 || dy !== 0) {
    const len = Math.hypot(dx, dy);
    dx /= len; dy /= len;
    player.x += dx * player.speed;
    player.y += dy * player.speed;
    player.facing = { x: dx, y: dy };
  }
  player.x = constrain(player.x, player.r, CW - player.r);
  player.y = constrain(player.y, player.r, CH - player.r);
}
```

- [ ] **Step 3: Implement player rendering with a facing indicator**

```javascript
function drawPlayer() {
  // body
  fill(245, 220, 170);
  stroke(60, 40, 20);
  strokeWeight(2);
  ellipse(player.x, player.y, player.r * 2);
  // facing indicator (eyes / nose)
  noStroke();
  fill(40, 30, 20);
  const fx = player.facing.x, fy = player.facing.y;
  ellipse(player.x + fx * player.r * 0.6, player.y + fy * player.r * 0.6, 7);
}
```

- [ ] **Step 4: Wire key handlers and the play loop**

Replace the stub `keyPressed`/`keyReleased` and the `"play"` branch of `draw()`:

```javascript
function keyPressed() {
  keys[keyCode] = true;
}
function keyReleased() {
  keys[keyCode] = false;
}
```

In `draw()`, replace the placeholder play branch with:

```javascript
  } else if (gameState === "play") {
    background(90, 150, 80);
    updatePlayer();
    drawPlayer();
  }
```

- [ ] **Step 5: Verify in browser**

Reload the game, click START. Expected: a round character you can move with the arrow keys. It stops at the canvas edges. The dark "face" dot points in the direction you last moved. Diagonal movement is not faster than straight movement.

- [ ] **Step 6: Commit**

```bash
git add games/dread/dread.js
git commit -m "Diamond Dread: player movement and facing direction"
```

---

### Task 3: Trees, punching, inventory, and HUD

Add harvestable trees, punch-to-collect-wood (no tool needed), an inventory object, and an on-canvas HUD showing material counts and the current pickaxe. Deliverable: walk to a tree, press SPACE to punch it, watch wood accumulate in the HUD.

**Files:**
- Modify: `games/dread/dread.js`

**Interfaces:**
- Consumes: `player`, `gameState`, key handling.
- Produces: global `inventory = { wood, sticks, stone, iron, ruby, diamond }`; global `trees = []`; `class Tree`; `function spawnTrees(n)`; `function tryPunch()`; `function drawHUD()`; global `pickaxeTier` (0=none,1=wood,2=stone,3=iron,4=ruby) and `const PICK_NAMES`.

- [ ] **Step 1: Add inventory, pickaxe tier, and the Tree class**

```javascript
let inventory;
let pickaxeTier; // 0 none, 1 wood, 2 stone, 3 iron, 4 ruby
const PICK_NAMES = ["Bare hands", "Wood Pickaxe", "Stone Pickaxe", "Iron Pickaxe", "Ruby Pickaxe"];
let trees = [];

class Tree {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.r = 18;
    this.wood = 4; // wood remaining
  }
  draw() {
    noStroke();
    fill(90, 60, 30); // trunk
    rect(this.x - 4, this.y, 8, 16);
    fill(40, 110, 50); // canopy
    ellipse(this.x, this.y - 4, this.r * 2);
    if (this.wood < 4) { // damaged tint
      fill(255, 255, 255, 40);
      ellipse(this.x, this.y - 4, this.r * 2);
    }
  }
}

function spawnTrees(n) {
  for (let i = 0; i < n; i++) {
    trees.push(new Tree(random(40, CW - 40), random(60, CH - 40)));
  }
}
```

- [ ] **Step 2: Initialize inventory and trees in `startGame()`**

```javascript
function startGame() {
  resetPlayer();
  inventory = { wood: 0, sticks: 0, stone: 0, iron: 0, ruby: 0, diamond: 0 };
  pickaxeTier = 0;
  trees = [];
  spawnTrees(8);
  gameState = "play";
}
```

- [ ] **Step 3: Implement punching (SPACE) — collect wood from the nearest tree in range**

```javascript
function tryPunch() {
  let best = null, bestD = 50; // reach
  for (const t of trees) {
    const d = dist(player.x, player.y, t.x, t.y);
    if (d < bestD) { best = t; bestD = d; }
  }
  if (best) {
    best.wood -= 1;
    inventory.wood += 1;
    if (best.wood <= 0) {
      trees.splice(trees.indexOf(best), 1);
      spawnTrees(1); // keep the world stocked
    }
  }
}
```

Add to `keyPressed()` (only while playing):

```javascript
function keyPressed() {
  keys[keyCode] = true;
  if (gameState === "play" && key === " ") tryPunch();
}
```

- [ ] **Step 4: Draw trees and the HUD; update the play branch**

```javascript
function drawHUD() {
  // panel
  noStroke();
  fill(0, 0, 0, 140);
  rect(0, 0, CW, 34);
  fill(255);
  textAlign(LEFT, CENTER);
  textSize(15);
  const inv = inventory;
  text(`🌳${inv.wood}  🪵${inv.sticks}  🪨${inv.stone}  ⛓️${inv.iron}  🔴${inv.ruby}  💎${inv.diamond}`, 12, 17);
  textAlign(RIGHT, CENTER);
  text(PICK_NAMES[pickaxeTier], CW - 12, 17);
}
```

In `draw()` play branch:

```javascript
  } else if (gameState === "play") {
    background(90, 150, 80);
    for (const t of trees) t.draw();
    updatePlayer();
    drawPlayer();
    drawHUD();
  }
```

- [ ] **Step 5: Verify in browser**

Reload, START. Expected: 8 trees scattered. Stand next to one, press SPACE repeatedly: the HUD `🌳` wood count rises. After 4 punches the tree disappears and a new one spawns elsewhere. HUD shows "Bare hands" at the right.

- [ ] **Step 6: Commit**

```bash
git add games/dread/dread.js
git commit -m "Diamond Dread: trees, punching, inventory, HUD"
```

---

### Task 4: Crafting menu (sticks + pickaxe ladder)

Add a crafting overlay opened with `C`, where the player crafts sticks and each pickaxe tier per the fixed recipes. Deliverable: collect wood, open craft, make sticks, then a wood pickaxe; the HUD updates the equipped pickaxe.

**Files:**
- Modify: `games/dread/dread.js`

**Interfaces:**
- Consumes: `inventory`, `pickaxeTier`, `gameState`, `PICK_NAMES`.
- Produces: `const RECIPES` array; `function craft(recipeKey)`; `function drawCraftMenu()`; click handling for craft buttons in `mousePressed()`.

- [ ] **Step 1: Define recipes and a generic craft function**

```javascript
// Each recipe: cost is a partial inventory map; effect mutates inventory / pickaxeTier.
const RECIPES = [
  { key: "sticks", label: "Sticks (1 wood → 2 sticks)", cost: { wood: 1 },
    can: () => inventory.wood >= 1,
    make: () => { inventory.wood -= 1; inventory.sticks += 2; } },
  { key: "wood_pick", label: "Wood Pickaxe (2 sticks, 3 wood)", cost: { sticks: 2, wood: 3 },
    can: () => pickaxeTier < 1 && inventory.sticks >= 2 && inventory.wood >= 3,
    make: () => { inventory.sticks -= 2; inventory.wood -= 3; pickaxeTier = Math.max(pickaxeTier, 1); } },
  { key: "stone_pick", label: "Stone Pickaxe (2 sticks, 3 stone)", cost: { sticks: 2, stone: 3 },
    can: () => pickaxeTier < 2 && inventory.sticks >= 2 && inventory.stone >= 3,
    make: () => { inventory.sticks -= 2; inventory.stone -= 3; pickaxeTier = Math.max(pickaxeTier, 2); } },
  { key: "iron_pick", label: "Iron Pickaxe (2 sticks, 3 iron)", cost: { sticks: 2, iron: 3 },
    can: () => pickaxeTier < 3 && inventory.sticks >= 2 && inventory.iron >= 3,
    make: () => { inventory.sticks -= 2; inventory.iron -= 3; pickaxeTier = Math.max(pickaxeTier, 3); } },
  { key: "ruby_pick", label: "Ruby Pickaxe (2 sticks, 3 ruby)", cost: { sticks: 2, ruby: 3 },
    can: () => pickaxeTier < 4 && inventory.sticks >= 2 && inventory.ruby >= 3,
    make: () => { inventory.sticks -= 2; inventory.ruby -= 3; pickaxeTier = Math.max(pickaxeTier, 4); } },
];

function craft(recipeKey) {
  const r = RECIPES.find((x) => x.key === recipeKey);
  if (r && r.can()) r.make();
}
```

- [ ] **Step 2: Draw the crafting overlay**

```javascript
function craftRowRect(i) {
  // returns {x,y,w,h} for recipe row i
  return { x: CW / 2 - 220, y: 150 + i * 64, w: 440, h: 52 };
}

function drawCraftMenu() {
  // dim background behind menu
  noStroke();
  fill(0, 0, 0, 180);
  rect(0, 0, CW, CH);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(34);
  text("CRAFTING", CW / 2, 90);
  textSize(14);
  text("Press C to close", CW / 2, 122);
  for (let i = 0; i < RECIPES.length; i++) {
    const r = RECIPES[i];
    const b = craftRowRect(i);
    const ok = r.can();
    fill(ok ? color(60, 150, 90) : color(80, 80, 80));
    rect(b.x, b.y, b.w, b.h, 8);
    fill(255);
    textAlign(LEFT, CENTER);
    textSize(18);
    text(r.label, b.x + 16, b.y + b.h / 2);
    textAlign(RIGHT, CENTER);
    textSize(14);
    text(ok ? "CRAFT" : "need more", b.x + b.w - 14, b.y + b.h / 2);
  }
}
```

- [ ] **Step 3: Toggle craft state with `C` and handle clicks**

In `keyPressed()` add (after the punch handling):

```javascript
  if (gameState === "play" && (key === "c" || key === "C")) gameState = "craft";
  else if (gameState === "craft" && (key === "c" || key === "C")) gameState = "play";
```

In `mousePressed()` add a branch:

```javascript
  } else if (gameState === "craft") {
    for (let i = 0; i < RECIPES.length; i++) {
      const b = craftRowRect(i);
      if (mouseX > b.x && mouseX < b.x + b.w && mouseY > b.y && mouseY < b.y + b.h) {
        craft(RECIPES[i].key);
      }
    }
  }
```

- [ ] **Step 4: Render the craft state in `draw()`**

Add after the play branch:

```javascript
  } else if (gameState === "craft") {
    background(90, 150, 80);
    for (const t of trees) t.draw();
    drawPlayer();
    drawHUD();
    drawCraftMenu();
  }
```

- [ ] **Step 5: Verify in browser**

Reload, START, punch trees to collect ~5 wood. Press `C`: the crafting overlay appears. Click "Sticks" twice (wood→sticks). Now click "Wood Pickaxe" — sticks/wood deduct, HUD right-side reads "Wood Pickaxe". Press `C` to close. Buttons you can't afford are gray and do nothing.

- [ ] **Step 6: Commit**

```bash
git add games/dread/dread.js
git commit -m "Diamond Dread: crafting menu and pickaxe ladder"
```

---

### Task 5: Caves — spawn every 15s, enter/exit cave view

Add cave entrances that spawn on the overworld every 15 seconds, an interior cave view you enter by walking onto an entrance, and an exit back to the overworld. Deliverable: caves appear on a timer; walking into one switches to a dark cave screen; an exit returns you.

**Files:**
- Modify: `games/dread/dread.js`

**Interfaces:**
- Consumes: `player`, `gameState`, `CW`, `CH`.
- Produces: globals `caves = []`, `currentCave` (null on overworld, else a `Cave`), `lastCaveSpawn`; `class Cave`; `function updateCaveTimer()`; `function enterCave(cave)`; `function exitCave()`; `function drawOverworldCaves()`; `function drawCaveInterior()`. Adds a `location` concept: `currentCave === null` means overworld.

- [ ] **Step 1: Add a millisecond clock helper and cave globals**

p5.js `millis()` returns ms since sketch start. Track a game-start offset so timers reset per run.

```javascript
let gameStartMs = 0;
function gameTime() { return millis() - gameStartMs; } // ms since this run started

let caves = [];
let currentCave = null; // null = overworld
let lastCaveSpawnMs = 0;

class Cave {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.r = 26;
    this.ores = []; // filled in Task 6
    this.exit = { x: CW / 2, y: CH - 50, r: 26 }; // exit pad inside the cave
  }
  drawEntrance() {
    noStroke();
    fill(20, 20, 25);
    ellipse(this.x, this.y, this.r * 2);
    fill(50, 45, 40);
    ellipse(this.x, this.y, this.r * 2 + 10, this.r * 2 + 10);
    fill(15, 15, 18);
    ellipse(this.x, this.y, this.r * 2 - 6);
  }
}
```

- [ ] **Step 2: Cave spawn timer (every 15s, max a few on the map)**

```javascript
function updateCaveTimer() {
  if (gameTime() - lastCaveSpawnMs >= 15000) {
    lastCaveSpawnMs = gameTime();
    if (caves.length < 6) {
      caves.push(new Cave(random(60, CW - 60), random(80, CH - 60)));
    }
  }
}
```

- [ ] **Step 3: Enter/exit logic**

```javascript
function enterCave(cave) {
  currentCave = cave;
  player.x = CW / 2;
  player.y = 80; // drop in near the top
}
function exitCave() {
  currentCave = null;
  player.x = CW / 2;
  player.y = CH / 2;
}
```

Overworld → detect walking onto an entrance (called each play frame when on overworld):

```javascript
function checkCaveEntry() {
  for (const c of caves) {
    if (dist(player.x, player.y, c.x, c.y) < c.r) { enterCave(c); return; }
  }
}
```

Cave → detect walking onto the exit pad:

```javascript
function checkCaveExit() {
  const e = currentCave.exit;
  if (dist(player.x, player.y, e.x, e.y) < e.r) exitCave();
}
```

- [ ] **Step 4: Rendering for overworld caves and the cave interior**

```javascript
function drawOverworldCaves() {
  for (const c of caves) c.drawEntrance();
}

function drawCaveInterior() {
  background(35, 30, 28);
  // rocky border
  noStroke();
  fill(25, 22, 20);
  rect(0, 0, CW, 24); rect(0, CH - 24, CW, 24);
  rect(0, 0, 24, CH); rect(CW - 24, 0, 24, CH);
  // exit pad
  const e = currentCave.exit;
  fill(90, 200, 120);
  ellipse(e.x, e.y, e.r * 2);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(12);
  text("EXIT", e.x, e.y);
  // (ore drawn in Task 6)
}
```

- [ ] **Step 5: Restructure the play branch around location, and reset timers**

In `startGame()`, add at the end (before `gameState = "play"`):

```javascript
  caves = [];
  currentCave = null;
  gameStartMs = millis();
  lastCaveSpawnMs = 0;
```

Replace the play branch of `draw()`:

```javascript
  } else if (gameState === "play") {
    if (currentCave === null) {
      background(90, 150, 80);
      updateCaveTimer();
      for (const t of trees) t.draw();
      drawOverworldCaves();
      updatePlayer();
      drawPlayer();
      checkCaveEntry();
    } else {
      drawCaveInterior();
      updatePlayer();
      drawPlayer();
      checkCaveExit();
    }
    drawHUD();
  }
```

Keep the `"craft"` branch working: change its body to render the current location backdrop. Simplest — replace its world drawing with a neutral dim:

```javascript
  } else if (gameState === "craft") {
    if (currentCave === null) { background(90, 150, 80); for (const t of trees) t.draw(); drawOverworldCaves(); }
    else { drawCaveInterior(); }
    drawPlayer();
    drawHUD();
    drawCraftMenu();
  }
```

- [ ] **Step 6: Verify in browser**

Reload, START. Expected: every 15 seconds a new dark cave entrance appears (watch up to ~3). Walk onto one — the screen switches to a dark rocky cave with a green EXIT pad at the bottom. Walk onto EXIT — back to the overworld at center. Crafting (`C`) still opens in both locations.

- [ ] **Step 7: Commit**

```bash
git add games/dread/dread.js
git commit -m "Diamond Dread: caves spawn on timer with enter/exit"
```

---

### Task 6: Ore nodes, rarity, pickaxe-gated mining, and the diamond win

Populate caves with ore obeying the rarity ladder, let the player mine the nearest node with SPACE only if their pickaxe tier is high enough, and end the game as a WIN when the first diamond is mined. Deliverable: mine stone with a wood pickaxe, climb the tiers, and win on the first diamond.

**Files:**
- Modify: `games/dread/dread.js`

**Interfaces:**
- Consumes: `currentCave`, `player`, `inventory`, `pickaxeTier`, `tryPunch` (extend punch to also mine), `gameState`.
- Produces: `const ORE_TYPES` (name, color, requiredTier, weight, yields-inventory-key); `function fillCaveOres(cave)`; `function tryMine()`; ore drawing inside `drawCaveInterior()`; win transition `gameState = "win"` + `drawWin()`.

- [ ] **Step 1: Define ore types with rarity weights and required pickaxe tier**

Rarity ladder via weights (higher weight = more common): stone > iron > ruby > diamond. `requiredTier` is the minimum `pickaxeTier` that can mine it.

```javascript
const ORE_TYPES = [
  { key: "stone",   inv: "stone",   color: [130, 130, 130], requiredTier: 1, weight: 60 },
  { key: "iron",    inv: "iron",    color: [200, 170, 130], requiredTier: 2, weight: 25 },
  { key: "ruby",    inv: "ruby",    color: [200, 40, 60],   requiredTier: 3, weight: 12 },
  { key: "diamond", inv: "diamond", color: [120, 230, 240], requiredTier: 4, weight: 3 },
];

function pickWeightedOre() {
  const total = ORE_TYPES.reduce((s, o) => s + o.weight, 0);
  let r = random(total);
  for (const o of ORE_TYPES) { if (r < o.weight) return o; r -= o.weight; }
  return ORE_TYPES[0];
}
```

- [ ] **Step 2: Fill a cave with ore nodes when it is created**

```javascript
function fillCaveOres(cave) {
  const n = floor(random(5, 9));
  for (let i = 0; i < n; i++) {
    const type = pickWeightedOre();
    cave.ores.push({
      x: random(60, CW - 60),
      y: random(60, CH - 120), // keep clear of the bottom exit pad
      r: 16,
      type,
    });
  }
}
```

Call it in the `Cave` constructor (replace the empty `this.ores = []`):

```javascript
    this.ores = [];
    // populated after construction by spawnCave()/updateCaveTimer
```

And in `updateCaveTimer()`, after pushing the new cave, fill it:

```javascript
    if (caves.length < 6) {
      const c = new Cave(random(60, CW - 60), random(80, CH - 60));
      fillCaveOres(c);
      caves.push(c);
    }
```

- [ ] **Step 3: Draw ore nodes inside the cave interior**

In `drawCaveInterior()`, before the exit pad drawing, add:

```javascript
  for (const ore of currentCave.ores) {
    const col = ore.type.color;
    noStroke();
    fill(70, 65, 60); // rock matrix
    ellipse(ore.x, ore.y, ore.r * 2 + 8);
    fill(col[0], col[1], col[2]);
    ellipse(ore.x, ore.y, ore.r * 2);
    fill(255, 255, 255, 70);
    ellipse(ore.x - 4, ore.y - 4, 6);
  }
```

- [ ] **Step 4: Implement mining and route SPACE to it inside caves**

```javascript
function tryMine() {
  if (!currentCave) return;
  let best = null, bestD = 46;
  for (const ore of currentCave.ores) {
    const d = dist(player.x, player.y, ore.x, ore.y);
    if (d < bestD) { best = ore; bestD = d; }
  }
  if (!best) return;
  if (pickaxeTier < best.type.requiredTier) {
    flashMessage("Need a better pickaxe!");
    return;
  }
  inventory[best.type.inv] += 1;
  currentCave.ores.splice(currentCave.ores.indexOf(best), 1);
  if (best.type.key === "diamond") {
    gameState = "win"; // Rule 2: first diamond ends the game
  }
}
```

Add a tiny transient message helper (used here and later):

```javascript
let flashMsg = "";
let flashUntil = 0;
function flashMessage(m) { flashMsg = m; flashUntil = millis() + 1500; }
function drawFlash() {
  if (millis() < flashUntil) {
    fill(0, 0, 0, 160);
    noStroke();
    rectMode(CENTER);
    rect(CW / 2, CH - 70, textWidth(flashMsg) + 40, 36, 8);
    rectMode(CORNER);
    fill(255, 230, 120);
    textAlign(CENTER, CENTER);
    textSize(18);
    text(flashMsg, CW / 2, CH - 70);
  }
}
```

Update `keyPressed()` so SPACE punches on the overworld and mines in caves:

```javascript
  if (gameState === "play" && key === " ") {
    if (currentCave === null) tryPunch(); else tryMine();
  }
```

- [ ] **Step 5: Add the win screen and draw the flash message**

Add to `draw()` after the craft branch:

```javascript
  } else if (gameState === "win") {
    drawWin();
  }
```

```javascript
function drawWin() {
  background(20, 30, 50);
  fill(120, 230, 240);
  textAlign(CENTER, CENTER);
  textSize(54);
  text("💎 DIAMOND!", CW / 2, CH / 2 - 60);
  fill(255);
  textSize(22);
  text("You mined your first diamond. You win.", CW / 2, CH / 2);
  textSize(16);
  text("Click to play again", CW / 2, CH / 2 + 50);
}
```

In `mousePressed()`, add restart-from-win:

```javascript
  } else if (gameState === "win" || gameState === "gameover") {
    gameState = "menu";
  }
```

In both the play and craft branches of `draw()`, call `drawFlash();` last (after `drawHUD()`).

- [ ] **Step 6: Verify in browser**

Reload, START. Collect wood, craft sticks + wood pickaxe. Enter a cave. Press SPACE near a gray stone node: stone count rises and the node vanishes. Try mining a colored higher-tier node with only a wood pickaxe → "Need a better pickaxe!" flashes. Craft up the ladder (you may need several caves to find ruby). Mining a cyan diamond node switches to the "💎 DIAMOND! You win" screen. Clicking returns to the menu.

Tip for faster verification: temporarily raise the diamond `weight` to 100, confirm the win, then restore to 3. Note the change in your commit message if you leave any debug aid in (you should not).

- [ ] **Step 7: Commit**

```bash
git add games/dread/dread.js
git commit -m "Diamond Dread: ore nodes, rarity, pickaxe-gated mining, diamond win"
```

---

### Task 7: The demon — chase, gaze-freeze, instant kill

Add a single demon that chases the player across overworld and caves, freezes while inside the player's facing cone, and kills instantly on contact (→ game over). Deliverable: a menacing pursuer you must keep glancing at; touching it ends the run.

**Files:**
- Modify: `games/dread/dread.js`

**Interfaces:**
- Consumes: `player` (incl. `facing`), `gameState`, `currentCave`, `CW`, `CH`.
- Produces: global `demon = { x, y, r, speed, frozen }`; `function resetDemon()`; `function updateDemon()`; `function isDemonInGaze()`; `function drawDemon()`; `function drawGameOver()`; `const GAZE_COS` constant for the cone half-angle.

- [ ] **Step 1: Add the demon and the gaze-cone test**

The gaze cone: the demon is "looked at" if the angle between the player's facing vector and the player→demon vector is within a half-angle. Use a dot-product threshold. `cos(50°) ≈ 0.64`.

```javascript
let demon;
const GAZE_COS = 0.64; // cone half-angle ≈ 50°

function resetDemon() {
  demon = { x: 60, y: 60, r: 18, speed: 1.7, frozen: false };
}

function isDemonInGaze() {
  const vx = demon.x - player.x, vy = demon.y - player.y;
  const len = Math.hypot(vx, vy) || 1;
  const nx = vx / len, ny = vy / len;
  const fx = player.facing.x, fy = player.facing.y;
  const flen = Math.hypot(fx, fy) || 1;
  const dot = (nx * fx + ny * fy) / flen;
  return dot >= GAZE_COS;
}
```

- [ ] **Step 2: Demon movement + kill check**

```javascript
function updateDemon() {
  demon.frozen = isDemonInGaze();
  if (!demon.frozen) {
    const vx = player.x - demon.x, vy = player.y - demon.y;
    const len = Math.hypot(vx, vy) || 1;
    demon.x += (vx / len) * demon.speed;
    demon.y += (vy / len) * demon.speed;
  }
  if (dist(demon.x, demon.y, player.x, player.y) < demon.r + player.r - 4) {
    gameState = "gameover";
  }
}
```

- [ ] **Step 3: Draw the demon (frozen = caught-in-gaze tint)**

```javascript
function drawDemon() {
  push();
  noStroke();
  // shadow body
  fill(demon.frozen ? color(90, 60, 120) : color(20, 10, 20));
  ellipse(demon.x, demon.y, demon.r * 2);
  // horns
  fill(demon.frozen ? color(140, 110, 160) : color(40, 20, 30));
  triangle(demon.x - 12, demon.y - 10, demon.x - 6, demon.y - 22, demon.x - 2, demon.y - 12);
  triangle(demon.x + 12, demon.y - 10, demon.x + 6, demon.y - 22, demon.x + 2, demon.y - 12);
  // glowing eyes
  fill(255, demon.frozen ? 220 : 60, 60);
  ellipse(demon.x - 6, demon.y - 2, 6);
  ellipse(demon.x + 6, demon.y - 2, 6);
  pop();
}
```

- [ ] **Step 4: Spawn the demon and update/draw it in both locations**

In `startGame()` add `resetDemon();` before `gameState = "play"`.

In the play branch of `draw()`, add `updateDemon(); drawDemon();` after `drawPlayer();` in **both** the overworld and cave sub-branches (so it chases everywhere). Place `updateDemon()` after `updatePlayer()` so facing is current.

Example (overworld sub-branch):

```javascript
      updatePlayer();
      drawPlayer();
      updateDemon();
      drawDemon();
      checkCaveEntry();
```

And the cave sub-branch:

```javascript
      updatePlayer();
      drawPlayer();
      updateDemon();
      drawDemon();
      checkCaveExit();
```

- [ ] **Step 5: Game-over screen**

```javascript
function drawGameOver() {
  background(30, 10, 15);
  fill(220, 60, 60);
  textAlign(CENTER, CENTER);
  textSize(54);
  text("☠ THE DEMON GOT YOU", CW / 2, CH / 2 - 50);
  fill(255);
  textSize(20);
  text("Never look away next time.", CW / 2, CH / 2 + 6);
  textSize(16);
  text("Click to return to menu", CW / 2, CH / 2 + 50);
}
```

Add to `draw()`:

```javascript
  } else if (gameState === "gameover") {
    drawGameOver();
  }
```

(The win/gameover click-to-restart handler was added in Task 6.)

- [ ] **Step 6: Verify in browser**

Reload, START. Expected: a horned dark demon starts in a corner and advances toward you. When you face it (move toward/keep facing its direction), it turns purple and **freezes**. Turn away (move the other way) and it resumes chasing. Let it touch you → "THE DEMON GOT YOU" screen; clicking returns to the menu. It also follows you into caves.

- [ ] **Step 7: Commit**

```bash
git add games/dread/dread.js
git commit -m "Diamond Dread: demon with gaze-freeze and instant kill"
```

---

### Task 8: Would-You-Rather every 60 seconds

Add a modal that pauses the game every 60 seconds and offers two options, each granting a perk and a cost. Deliverable: every minute the game pauses with two tradeoff choices; picking one applies both effects and resumes.

**Files:**
- Modify: `games/dread/dread.js`

**Interfaces:**
- Consumes: `player`, `demon`, `inventory`, `gameState`, `gameTime()`.
- Produces: globals `lastWyrMs`, `currentWyr`; `const WYR_POOL` (each entry has two options, each with `label` and `apply()`); `function maybeTriggerWyr()`; `function pickWyr()`; `function drawWyr()`; click handling in `mousePressed()`.

- [ ] **Step 1: Define the would-you-rather pool**

Each option pairs a benefit with a cost in its `apply()`.

```javascript
let lastWyrMs = 0;
let currentWyr = null;

const WYR_POOL = [
  { a: { label: "Move faster (+speed), BUT the demon speeds up too",
         apply: () => { player.speed += 0.8; demon.speed += 0.5; } },
    b: { label: "Slow the demon, BUT you move slower too",
         apply: () => { demon.speed = Math.max(0.6, demon.speed - 0.6); player.speed = Math.max(1.6, player.speed - 0.6); } } },
  { a: { label: "Gain 10 wood now, BUT the demon jumps closer",
         apply: () => { inventory.wood += 10; const a = atan2(player.y - demon.y, player.x - demon.x); demon.x = player.x - cos(a) * 120; demon.y = player.y - sin(a) * 120; } },
    b: { label: "Gain 5 stone now, BUT lose all your sticks",
         apply: () => { inventory.stone += 5; inventory.sticks = 0; } } },
  { a: { label: "Wider gaze cone (demon easier to freeze), BUT you move slower",
         apply: () => { GAZE_HALF_COS_ADJUST(-0.15); player.speed = Math.max(1.6, player.speed - 0.5); } },
    b: { label: "Gain 5 iron now, BUT the demon speeds up",
         apply: () => { inventory.iron += 5; demon.speed += 0.6; } } },
];
```

Because `GAZE_COS` is a `const`, change it to a `let` (Task 7 declared it `const`) and add the adjuster:

```javascript
// In Task 7's declaration, change `const GAZE_COS = 0.64;` to:
let GAZE_COS = 0.64;
// helper:
function GAZE_HALF_COS_ADJUST(delta) { GAZE_COS = constrain(GAZE_COS + delta, 0.2, 0.95); }
```

- [ ] **Step 2: Trigger the modal on the 60s timer**

```javascript
function maybeTriggerWyr() {
  if (gameTime() - lastWyrMs >= 60000) {
    lastWyrMs = gameTime();
    currentWyr = random(WYR_POOL);
    gameState = "wyr";
  }
}
```

Call `maybeTriggerWyr();` at the top of the play branch (before the location split) so it can fire on the overworld or in a cave.

- [ ] **Step 3: Draw the modal**

```javascript
function wyrOptionRect(which) {
  const w = 360, h = 140, gap = 40;
  const totalW = w * 2 + gap;
  const x = which === "a" ? CW / 2 - totalW / 2 : CW / 2 + gap / 2;
  return { x, y: CH / 2 - h / 2 + 30, w, h };
}

function drawWyr() {
  // keep the world frozen behind the modal
  if (currentCave === null) { background(90, 150, 80); for (const t of trees) t.draw(); drawOverworldCaves(); }
  else { drawCaveInterior(); }
  drawPlayer();
  drawDemon();
  drawHUD();
  // dim
  noStroke();
  fill(0, 0, 0, 170);
  rect(0, 0, CW, CH);
  fill(255, 230, 120);
  textAlign(CENTER, CENTER);
  textSize(40);
  text("WOULD YOU RATHER…", CW / 2, CH / 2 - 110);
  for (const which of ["a", "b"]) {
    const opt = currentWyr[which];
    const b = wyrOptionRect(which);
    fill(60, 90, 150);
    rect(b.x, b.y, b.w, b.h, 12);
    fill(255);
    textSize(18);
    textAlign(CENTER, CENTER);
    text(opt.label, b.x + b.w / 2, b.y + b.h / 2, b.w - 30, b.h - 30);
  }
}
```

- [ ] **Step 4: Handle clicks and render the state**

In `mousePressed()` add:

```javascript
  } else if (gameState === "wyr") {
    for (const which of ["a", "b"]) {
      const b = wyrOptionRect(which);
      if (mouseX > b.x && mouseX < b.x + b.w && mouseY > b.y && mouseY < b.y + b.h) {
        currentWyr[which].apply();
        currentWyr = null;
        gameState = "play";
      }
    }
  }
```

In `draw()` add:

```javascript
  } else if (gameState === "wyr") {
    drawWyr();
  }
```

Reset timer in `startGame()`: add `lastWyrMs = 0; currentWyr = null;`.

- [ ] **Step 5: Verify in browser**

Reload, START, and wait ~60 seconds (or temporarily lower the `60000` threshold to `6000` to verify quickly, then restore). Expected: the game pauses, "WOULD YOU RATHER…" appears with two readable tradeoff panels. The demon does not move while the modal is up. Clicking a panel applies its effect (e.g. wood jumps by 10, or your speed changes) and resumes play. The next modal fires ~60s later. Restore the threshold to `60000` before committing.

- [ ] **Step 6: Commit**

```bash
git add games/dread/dread.js
git commit -m "Diamond Dread: would-you-rather tradeoff modal every 60s"
```

---

### Task 9: Day/night cycle, HP hearts, and night monsters

Add a day→night cycle (night at ~3.5 min), an HP/hearts system, monsters that spawn at night and chip HP on contact, and pickaxe-swing combat against them. Deliverable: after ~3.5 minutes the world darkens, monsters spawn and chase, contact costs hearts, swinging kills them, and 0 HP is a game over.

**Files:**
- Modify: `games/dread/dread.js`

**Interfaces:**
- Consumes: `player`, `gameTime()`, `gameState`, `currentCave`, `tryMine`/`tryPunch` SPACE binding (extend SPACE to also swing at monsters), demon/game-over flow.
- Produces: globals `isNight`, `monsters = []`, `playerHp`, `playerMaxHp`; `const NIGHT_MS = 210000`; `class Monster`; `function updateDayNight()`; `function spawnMonster()`; `function updateMonsters()`; `function drawMonsters()`; `function trySwing()`; HP rendering in `drawHUD()`; night overlay in rendering.

- [ ] **Step 1: Add HP, night, and monster globals + the Monster class**

```javascript
const NIGHT_MS = 210000; // ~3.5 min
let isNight = false;
let monsters = [];
let playerHp, playerMaxHp;
let lastMonsterSpawnMs = 0;

class Monster {
  constructor(x, y) {
    this.x = x; this.y = y;
    this.r = 15;
    this.speed = 1.3;
    this.hp = 2;
    this.hitCooldown = 0; // ms timestamp until which it can't hit again
  }
  update() {
    const vx = player.x - this.x, vy = player.y - this.y;
    const len = Math.hypot(vx, vy) || 1;
    this.x += (vx / len) * this.speed;
    this.y += (vy / len) * this.speed;
    if (dist(this.x, this.y, player.x, player.y) < this.r + player.r && millis() > this.hitCooldown) {
      playerHp -= 1;
      this.hitCooldown = millis() + 1000;
      if (playerHp <= 0) gameState = "gameover";
    }
  }
  draw() {
    noStroke();
    fill(80, 30, 90);
    ellipse(this.x, this.y, this.r * 2);
    fill(255, 80, 80);
    ellipse(this.x - 4, this.y - 2, 5);
    ellipse(this.x + 4, this.y - 2, 5);
  }
}
```

- [ ] **Step 2: Day/night transition and monster spawning**

```javascript
function updateDayNight() {
  isNight = gameTime() >= NIGHT_MS;
  if (isNight && currentCave === null && gameTime() - lastMonsterSpawnMs >= 4000 && monsters.length < 8) {
    lastMonsterSpawnMs = gameTime();
    spawnMonster();
  }
}

function spawnMonster() {
  // spawn at a random edge
  const edge = floor(random(4));
  let x, y;
  if (edge === 0) { x = 0; y = random(CH); }
  else if (edge === 1) { x = CW; y = random(CH); }
  else if (edge === 2) { x = random(CW); y = 0; }
  else { x = random(CW); y = CH; }
  monsters.push(new Monster(x, y));
}

function updateMonsters() {
  for (let i = monsters.length - 1; i >= 0; i--) {
    monsters[i].update();
    if (monsters[i].hp <= 0) monsters.splice(i, 1);
  }
}

function drawMonsters() {
  for (const m of monsters) m.draw();
}
```

- [ ] **Step 3: Pickaxe swing combat (SPACE also hits nearby monsters)**

```javascript
function trySwing() {
  let hitAny = false;
  for (const m of monsters) {
    if (dist(player.x, player.y, m.x, m.y) < 48) {
      m.hp -= 1;
      hitAny = true;
    }
  }
  return hitAny;
}
```

Extend the SPACE binding in `keyPressed()` so swinging happens alongside punch/mine:

```javascript
  if (gameState === "play" && key === " ") {
    const swung = trySwing();
    if (!swung) {
      if (currentCave === null) tryPunch(); else tryMine();
    }
  }
```

- [ ] **Step 4: HP in HUD, night overlay, and wiring into the loop**

Add HP hearts to `drawHUD()` (append after the pickaxe text):

```javascript
  // hearts
  textAlign(LEFT, CENTER);
  let hearts = "";
  for (let i = 0; i < playerMaxHp; i++) hearts += i < playerHp ? "❤️" : "🖤";
  text(hearts, CW / 2 - textWidth(hearts) / 2, 17);
```

Add a night-darkening overlay helper:

```javascript
function drawNightOverlay() {
  if (isNight && currentCave === null) {
    noStroke();
    fill(10, 10, 40, 150);
    rect(0, 0, CW, CH);
  }
}
```

In the play branch of `draw()`:
- call `updateDayNight();` near the top (with `maybeTriggerWyr()`).
- in the overworld sub-branch, after `drawOverworldCaves()` and before `updatePlayer()`, draw and update monsters: call `updateMonsters();` after `updatePlayer()`, and `drawMonsters();` after `drawPlayer()`.
- call `drawNightOverlay();` after the world entities but before `drawHUD()` so the HUD stays readable.

Overworld sub-branch becomes:

```javascript
      background(90, 150, 80);
      updateCaveTimer();
      for (const t of trees) t.draw();
      drawOverworldCaves();
      updatePlayer();
      updateMonsters();
      updateDemon();
      drawPlayer();
      drawMonsters();
      drawDemon();
      drawNightOverlay();
      checkCaveEntry();
```

- [ ] **Step 5: Initialize HP and night state in `startGame()`**

```javascript
  playerMaxHp = 3;
  playerHp = 3;
  isNight = false;
  monsters = [];
  lastMonsterSpawnMs = 0;
```

- [ ] **Step 6: Verify in browser**

Reload, START. Hearts (❤️❤️❤️) show in the HUD. To verify night quickly, temporarily set `NIGHT_MS = 8000`, reload: after 8s the overworld darkens and purple monsters spawn from the edges and chase you. Standing in them drains hearts (one per second). Press SPACE near a monster to swing — two hits kill it. At 0 hearts → game over. Restore `NIGHT_MS = 210000` before committing. Monsters do not spawn while you're inside a cave.

- [ ] **Step 7: Commit**

```bash
git add games/dread/dread.js
git commit -m "Diamond Dread: day/night cycle, HP hearts, night monsters, combat"
```

---

### Task 10: Polish — controls hint, demon proximity cue, day/night clock, final review

Add small quality touches: an on-screen controls/clock line, a demon-proximity warning, ensure all state transitions and restarts are clean, and confirm the full game loop end-to-end. Deliverable: a finished, readable game.

**Files:**
- Modify: `games/dread/dread.js`

**Interfaces:**
- Consumes: all prior globals.
- Produces: `function drawClockAndHints()`; `function drawDemonProximity()`.

- [ ] **Step 1: Add a clock + controls line and demon proximity warning**

```javascript
function drawClockAndHints() {
  const t = floor(gameTime() / 1000);
  const mm = floor(t / 60), ss = t % 60;
  fill(255);
  textAlign(LEFT, CENTER);
  textSize(13);
  const phase = isNight ? "NIGHT" : "DAY";
  text(`${phase}  ${mm}:${ss < 10 ? "0" : ""}${ss}   [SPACE] act  [C] craft`, 12, CH - 16);
}

function drawDemonProximity() {
  if (!demon) return;
  const d = dist(demon.x, demon.y, player.x, player.y);
  if (d < 180 && !demon.frozen) {
    const a = map(d, 60, 180, 200, 40);
    noFill();
    stroke(220, 40, 40, a);
    strokeWeight(4);
    rect(2, 2, CW - 4, CH - 4);
    noStroke();
    fill(220, 40, 40, a);
    textAlign(CENTER, TOP);
    textSize(16);
    text("⚠ THE DEMON IS NEAR — LOOK AT IT", CW / 2, 40);
  }
}
```

- [ ] **Step 2: Call the helpers in the play branch**

In the play branch of `draw()`, after `drawNightOverlay()` (overworld) / after the cave entities, and before `drawHUD()`, call:

```javascript
      drawDemonProximity();
```

And after `drawHUD();` (in both play sub-branches) call:

```javascript
    drawClockAndHints();
```

(Place `drawClockAndHints()` once at the end of the play branch, outside the location split, so it shows in both.)

- [ ] **Step 3: Confirm clean restarts**

Verify `startGame()` resets every mutable global: `player` (via `resetPlayer`), `inventory`, `pickaxeTier`, `trees` (+ `spawnTrees`), `caves`, `currentCave`, `gameStartMs`, `lastCaveSpawnMs`, `demon` (via `resetDemon`), `lastWyrMs`, `currentWyr`, `playerHp`, `playerMaxHp`, `isNight`, `monsters`, `lastMonsterSpawnMs`, `flashMsg`/`flashUntil`. Add any missing reset lines.

- [ ] **Step 4: Full end-to-end verification**

Run `python3 -m http.server 8000`, open the game from the hub. Confirm in one session:
1. Menu → START works.
2. Movement + facing indicator.
3. Punch trees → wood; craft sticks → wood pickaxe (HUD updates).
4. Caves appear ~every 15s; enter/exit works.
5. Mining gated by pickaxe tier; climbing tiers works; "Need a better pickaxe!" on too-weak.
6. Demon chases, freezes in gaze, instant-kills on contact → game over → click → menu.
7. Would-you-rather fires ~every 60s and applies effects.
8. Night (use real timing or briefly lower `NIGHT_MS`) darkens world + spawns monsters; combat + hearts + 0-HP game over work. **Restore `NIGHT_MS` after testing.**
9. Mining a diamond → win screen → click → menu.
10. Restart from menu produces a fresh, fully-reset game. No console errors throughout.

- [ ] **Step 5: Commit**

```bash
git add games/dread/dread.js
git commit -m "Diamond Dread: clock, controls hint, demon proximity cue, final polish"
```

---

## Self-Review

**Spec coverage** (each spec requirement → task):
- Move with arrows → Task 2. ✓
- Game ends on first diamond → Task 6 (win). ✓
- Would-you-rather every minute, good-at-a-cost → Task 8. ✓
- Caves every 15s → Task 5. ✓
- Mine ore with pickaxes → Task 6. ✓
- Different materials for different pickaxes → Task 4. ✓
- Night (sped to ~3.5min) → Task 9. ✓
- Monsters at night → Task 9. ✓
- "Realistic"/flat-shaded readable art → all rendering tasks (2,3,5,6,7,9). ✓
- Rarity ladder stone>iron>ruby>diamond → Task 6 weights. ✓
- Ore in caves → Task 6. ✓
- Demon chases throughout → Task 7 (overworld + caves). ✓
- Look at demon → freeze → Task 7 gaze cone. ✓
- Demon one-hit kill → Task 7. ✓
- All four pickaxe recipes + sticks → Task 4 RECIPES. ✓
- Hub card + README → Task 1. ✓

**Placeholder scan:** No "TBD"/"handle edge cases" placeholders; every code step shows full code.

**Type/name consistency:** `gameTime()` defined in Task 5 and reused (8,9,10). `GAZE_COS` declared in Task 7 then explicitly changed from `const` to `let` in Task 8 with `GAZE_HALF_COS_ADJUST` — flagged in-line so the implementer makes the edit. SPACE binding is progressively extended (Task 3 punch → Task 6 punch/mine → Task 9 swing-or-act); each task shows the full replacement. `inventory` keys (`wood/sticks/stone/iron/ruby/diamond`) consistent across Tasks 3, 4, 6, 8. `currentCave === null` is the single source of truth for location across Tasks 5–10.

One known cross-task edit to watch: Task 8 Step 1 requires changing Task 7's `const GAZE_COS` to `let GAZE_COS`. This is called out explicitly in Task 8.
