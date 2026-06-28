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

function mousePressed() {
  if (gameState === "menu") {
    if (mouseX > CW / 2 - 100 && mouseX < CW / 2 + 100 &&
        mouseY > CH / 2 + 30 && mouseY < CH / 2 + 90) {
      startGame();
    }
  }
}

function keyPressed() {
  keys[keyCode] = true;
  if (gameState === "play" && key === " ") tryPunch();
}
function keyReleased() {
  keys[keyCode] = false;
}
function windowResized() {}
