// Diamond Dread — top-down survival mining. See docs/superpowers/specs.
const CW = 900;
const CH = 700;

let gameState = "menu"; // "menu" | "play" | "craft" | "wyr" | "gameover" | "win"
let player; // set in startGame()
const keys = {}; // keyCode -> bool

let demon;
let GAZE_COS = 0.64; // cone half-angle ≈ 50°
function GAZE_HALF_COS_ADJUST(delta) { GAZE_COS = constrain(GAZE_COS + delta, 0.2, 0.95); }

let inventory;
let pickaxeTier; // 0 none, 1 wood, 2 stone, 3 iron, 4 ruby
const PICK_NAMES = ["Bare hands", "Wood Pickaxe", "Stone Pickaxe", "Iron Pickaxe", "Ruby Pickaxe"];
let trees = [];

let gameStartMs = 0;
function gameTime() { return millis() - gameStartMs; } // ms since this run started

let caves = [];
let currentCave = null; // null = overworld
let lastCaveSpawnMs = 0;

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

// Crafting recipes
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

function fillCaveOres(cave) {
  const n = floor(random(5, 9));
  for (let i = 0; i < n; i++) {
    const type = pickWeightedOre();
    cave.ores.push({
      x: random(60, CW - 60),
      y: random(60, CH - 120),
      r: 16,
      type,
    });
  }
}

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

function resetPlayer() {
  player = {
    x: CW / 2,
    y: CH / 2,
    r: 16,
    speed: 3.2,
    facing: { x: 0, y: 1 }, // default facing down
  };
}

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

function updateCaveTimer() {
  if (gameTime() - lastCaveSpawnMs >= 15000) {
    lastCaveSpawnMs = gameTime();
    if (caves.length < 6) {
      const c = new Cave(random(60, CW - 60), random(80, CH - 60));
      fillCaveOres(c);
      caves.push(c);
    }
  }
}

function maybeTriggerWyr() {
  if (gameTime() - lastWyrMs >= 60000) {
    lastWyrMs = gameTime();
    currentWyr = random(WYR_POOL);
    gameState = "wyr";
  }
}

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

function checkCaveEntry() {
  for (const c of caves) {
    if (dist(player.x, player.y, c.x, c.y) < c.r) { enterCave(c); return; }
  }
}

function checkCaveExit() {
  const e = currentCave.exit;
  if (dist(player.x, player.y, e.x, e.y) < e.r) exitCave();
}

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
  // ore nodes
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
  // exit pad
  const e = currentCave.exit;
  fill(90, 200, 120);
  ellipse(e.x, e.y, e.r * 2);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(12);
  text("EXIT", e.x, e.y);
}

function setup() {
  const canvas = createCanvas(CW, CH);
  canvas.parent("sketch-holder");
  textFont("Arial");
}

function startGame() {
  resetPlayer();
  inventory = { wood: 0, sticks: 0, stone: 0, iron: 0, ruby: 0, diamond: 0 };
  pickaxeTier = 0;
  trees = [];
  spawnTrees(8);
  caves = [];
  currentCave = null;
  gameStartMs = millis();
  lastCaveSpawnMs = 0;
  lastWyrMs = 0;
  currentWyr = null;
  resetDemon();
  gameState = "play";
}

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
    gameState = "win";
  }
}

function draw() {
  background(30, 30, 35);
  if (gameState === "menu") {
    drawMenu();
  } else if (gameState === "play") {
    maybeTriggerWyr();
    if (currentCave === null) {
      background(90, 150, 80);
      updateCaveTimer();
      for (const t of trees) t.draw();
      drawOverworldCaves();
      updatePlayer();
      updateDemon();
      drawPlayer();
      drawDemon();
      checkCaveEntry();
    } else {
      drawCaveInterior();
      updatePlayer();
      updateDemon();
      drawPlayer();
      drawDemon();
      checkCaveExit();
    }
    drawHUD();
    drawFlash();
  } else if (gameState === "craft") {
    if (currentCave === null) { background(90, 150, 80); for (const t of trees) t.draw(); drawOverworldCaves(); }
    else { drawCaveInterior(); }
    drawPlayer();
    drawHUD();
    drawCraftMenu();
    drawFlash();
  } else if (gameState === "wyr") {
    drawWyr();
  } else if (gameState === "win") {
    drawWin();
  } else if (gameState === "gameover") {
    drawGameOver();
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

function mousePressed() {
  if (gameState === "menu") {
    if (mouseX > CW / 2 - 100 && mouseX < CW / 2 + 100 &&
        mouseY > CH / 2 + 30 && mouseY < CH / 2 + 90) {
      startGame();
    }
  } else if (gameState === "craft") {
    for (let i = 0; i < RECIPES.length; i++) {
      const b = craftRowRect(i);
      if (mouseX > b.x && mouseX < b.x + b.w && mouseY > b.y && mouseY < b.y + b.h) {
        craft(RECIPES[i].key);
      }
    }
  } else if (gameState === "wyr") {
    for (const which of ["a", "b"]) {
      const b = wyrOptionRect(which);
      if (mouseX > b.x && mouseX < b.x + b.w && mouseY > b.y && mouseY < b.y + b.h) {
        currentWyr[which].apply();
        currentWyr = null;
        gameState = "play";
      }
    }
  } else if (gameState === "win" || gameState === "gameover") {
    gameState = "menu";
  }
}

function keyPressed() {
  keys[keyCode] = true;
  if (gameState === "play" && key === " ") {
    if (currentCave === null) tryPunch(); else tryMine();
  }
  if (gameState === "play" && (key === "c" || key === "C")) gameState = "craft";
  else if (gameState === "craft" && (key === "c" || key === "C")) gameState = "play";
}
function keyReleased() {
  keys[keyCode] = false;
}
function windowResized() {}
