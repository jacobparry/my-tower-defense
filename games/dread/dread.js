// Diamond Dread — top-down survival mining. See docs/superpowers/specs.
const CW = 900;
const CH = 700;

let gameState = "menu"; // "menu" | "play" | "craft" | "wyr" | "gameover" | "win"
let player; // set in startGame()
const keys = {}; // keyCode -> bool

let inventory;
let pickaxeTier; // 0 none, 1 wood, 2 stone, 3 iron, 4 ruby
const PICK_NAMES = ["Bare hands", "Wood Pickaxe", "Stone Pickaxe", "Iron Pickaxe", "Ruby Pickaxe"];
let trees = [];

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

function resetPlayer() {
  player = {
    x: CW / 2,
    y: CH / 2,
    r: 16,
    speed: 3.2,
    facing: { x: 0, y: 1 }, // default facing down
  };
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

function draw() {
  background(30, 30, 35);
  if (gameState === "menu") {
    drawMenu();
  } else if (gameState === "play") {
    background(90, 150, 80);
    for (const t of trees) t.draw();
    updatePlayer();
    drawPlayer();
    drawHUD();
  } else if (gameState === "craft") {
    background(90, 150, 80);
    for (const t of trees) t.draw();
    drawPlayer();
    drawHUD();
    drawCraftMenu();
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
  }
}

function keyPressed() {
  keys[keyCode] = true;
  if (gameState === "play" && key === " ") tryPunch();
  if (gameState === "play" && (key === "c" || key === "C")) gameState = "craft";
  else if (gameState === "craft" && (key === "c" || key === "C")) gameState = "play";
}
function keyReleased() {
  keys[keyCode] = false;
}
function windowResized() {}
