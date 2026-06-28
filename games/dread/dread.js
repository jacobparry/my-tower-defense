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
