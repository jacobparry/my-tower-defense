// Diamond Dread — top-down survival mining. See docs/superpowers/specs.
const CW = 900;
const CH = 700;

let gameState = "menu"; // "menu" | "play" | "craft" | "wyr" | "gameover" | "win"
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

function setup() {
  const canvas = createCanvas(CW, CH);
  canvas.parent("sketch-holder");
  textFont("Arial");
}

function startGame() {
  resetPlayer();
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

function draw() {
  background(30, 30, 35);
  if (gameState === "menu") {
    drawMenu();
  } else if (gameState === "play") {
    background(90, 150, 80);
    updatePlayer();
    drawPlayer();
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

function keyPressed() {
  keys[keyCode] = true;
}
function keyReleased() {
  keys[keyCode] = false;
}
function windowResized() {}
