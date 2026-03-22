// ============================================
// CAFE - A Math Learning Cafe Game
// by a creative 8-year-old game designer
// ============================================

// --- CONSTANTS & CONFIG ---
const FOOD_TYPES = [
  { name: "Toast", basePrice: 3, unlockCost: 0, color: [220, 180, 100], accent: [180, 130, 50] },
  { name: "Yogurt", basePrice: 5, unlockCost: 60, color: [255, 180, 210], accent: [230, 120, 170] },
  { name: "Candy Box", basePrice: 8, unlockCost: 200, color: [255, 120, 160], accent: [220, 60, 120] },
  { name: "Cupcake", basePrice: 12, unlockCost: 500, color: [190, 160, 255], accent: [140, 100, 220] }
];

const BLOOK_SHAPES = ["blob", "cat", "bear", "star", "robot"];
const BLOOK_COLORS = [
  [255, 107, 180], [100, 190, 255], [120, 220, 160],
  [255, 180, 100], [190, 150, 255], [255, 210, 100],
  [255, 140, 140], [100, 220, 220], [255, 160, 220],
  [160, 220, 255]
];

const BLOOK_NAMES = [
  "Bob", "Sprinkles", "Wiggles", "Muffin", "Pip", "Bubbles",
  "Ziggy", "Cookie", "Bloop", "Snickers", "Jellybean", "Nugget",
  "Waffles", "Peanut", "Giggles", "Pickles", "Doodle", "Fizzy",
  "Twinkle", "Biscuit", "Noodle", "Pudding", "Sparkle", "Cheddar"
];

const UPGRADE_COSTS = {
  foodPrice: [40, 80, 160, 320, 640],
  cafe: [60, 150, 350, 700, 1500],
  pantry: [50, 120, 280, 600, 1200],
  blook: [70, 160, 350, 750, 1600],
  employeeHire: 120
};

const EMPLOYEE_SALARY = 25;
const MAX_EMPLOYEES = 3;
const MAX_UPGRADE_LEVEL = 5;
const WIN_DAY = 100;
const BASE_STOCK = 5;
const STOCK_PER_PANTRY_LEVEL = 3;
const BASE_BLOOK_PATIENCE = 8; // seconds
const PATIENCE_PER_BLOOK_LEVEL = 2;
const BASE_TIP = 0;
const TIP_PER_BLOOK_LEVEL = 1;

// --- GLOBAL STATE ---
let gameState = "menu";
let day = 1;
let money = 0;
let moneyEarnedToday = 0;
let blooksServedToday = 0;
let mathSolvedToday = 0;
let mathAttemptedToday = 0;
let strikes = 0;
let maxStrikesPerDay = 3;
let dayTimer = 0;
let dayDuration = 0;
let gameSpeed = 1;

// Upgrades
let foodUnlocked = [true, false, false, false];
let foodLevel = [0, 0, 0, 0];
let cafeLevel = 0;
let pantryLevel = [0, 0, 0, 0]; // per food item
let blookLevel = 0;
let employeeCount = 0;
let employeeAssignments = [-1, -1, -1]; // -1 = not hired, 0-3 = assigned food station

// Food stock
let foodStock = [5, 0, 0, 0];

// Active entities
let blooks = [];
let particles = [];
let floatingTexts = [];
let coins = [];

// Math problem state
let currentMathProblem = null;
let mathRestockTarget = -1;
let mathAnswerSelected = -1;
let mathResultTimer = 0;
let mathCorrect = false;

// Combo system
let comboCount = 0;
let comboTimer = 0;
let comboMultiplier = 1;
let lastComboText = "";

// Day transition
let transitionAlpha = 0;
let transitionState = "none"; // "fadeOut", "fadeIn", "none"
let nextStateAfterTransition = "";

// Night shop
let nightTab = 0; // 0=food, 1=cafe, 2=pantry, 3=blooks, 4=employees
let nightScrollY = 0;
let purchaseFlash = 0;
let purchaseFlashItem = "";

// Employee auto-serve timer
let employeeServeTimer = 0;
const EMPLOYEE_SERVE_INTERVAL = 4; // seconds

// Animation helpers
let titleBounce = 0;
let menuBlookBounce = 0;
let dayStartTimer = 0;
let dayEndTimer = 0;
let screenShake = 0;
let starRating = 0;

// Blook spawn
let blookSpawnTimer = 0;
let blookSpawnInterval = 8;

// Tooltip
let tooltipText = "";
let tooltipX = 0;
let tooltipY = 0;
let tooltipTimer = 0;

// Game over reason
let gameOverReason = "";

// Track all upgrades maxed for win condition
let allMaxed = false;

// UI scaling
let uiScale = 1;

// Tutorial
let tutorialStep = 0;
let showTutorial = false;
let tutorialArrowBounce = 0;

// VIP blook
let vipChance = 0.05;

// Button hover tracking
let hoveredButton = "";

// Spill system
let spills = []; // { stationIndex, timer, maxTimer, x, y }
let spillSpawnTimer = 0;
let spillSpawnInterval = 12; // seconds between spills
const SPILL_DURATION = 8; // seconds before spill clears itself (but blocks station)

// --- UTILITY FUNCTIONS ---
function sz(pct) {
  return min(width, height) * pct;
}

function lerpColor2(c1, c2, t) {
  return [
    lerp(c1[0], c2[0], t),
    lerp(c1[1], c2[1], t),
    lerp(c1[2], c2[2], t)
  ];
}

function easeOutBack(t) {
  let c1 = 1.70158;
  let c3 = c1 + 1;
  return 1 + c3 * pow(t - 1, 3) + c1 * pow(t - 1, 2);
}

function easeOutBounce(t) {
  if (t < 1 / 2.75) return 7.5625 * t * t;
  else if (t < 2 / 2.75) return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
  else if (t < 2.5 / 2.75) return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
  else return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - pow(-2 * t + 2, 3) / 2;
}

function shuffleArray(arr) {
  let a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    let j = floor(random(i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getMaxStock(foodIndex) {
  let level = (foodIndex !== undefined) ? pantryLevel[foodIndex] : 0;
  return BASE_STOCK + level * STOCK_PER_PANTRY_LEVEL;
}

function getFoodPrice(index) {
  return FOOD_TYPES[index].basePrice + foodLevel[index] * 2;
}

function getBlookPatience() {
  return BASE_BLOOK_PATIENCE + blookLevel * PATIENCE_PER_BLOOK_LEVEL;
}

function getBlookTip() {
  return BASE_TIP + blookLevel * TIP_PER_BLOOK_LEVEL;
}

function getDayDuration() {
  if (day <= 10) return 50;
  if (day <= 25) return 65;
  if (day <= 50) return 80;
  return 90;
}

function getBlookSpawnInterval() {
  let base = 4;
  base -= day * 0.03;
  base -= cafeLevel * 0.25;
  return max(1.2, base);
}

function getMaxBlooksAtOnce() {
  return 4 + cafeLevel + floor(day / 10);
}

function checkAllMaxed() {
  for (let i = 0; i < 4; i++) {
    if (!foodUnlocked[i]) return false;
    if (foodLevel[i] < MAX_UPGRADE_LEVEL) return false;
    if (pantryLevel[i] < MAX_UPGRADE_LEVEL) return false;
  }
  if (cafeLevel < MAX_UPGRADE_LEVEL) return false;
  if (blookLevel < MAX_UPGRADE_LEVEL) return false;
  return true;
}

function getStationPosition(foodIndex) {
  let unlockedCount = 0;
  for (let i = 0; i < 4; i++) if (foodUnlocked[i]) unlockedCount++;
  let spacing = width * 0.7 / max(unlockedCount, 1);
  let startX = width * 0.15 + spacing * 0.5;
  let pos = 0;
  for (let i = 0; i < foodIndex; i++) {
    if (foodUnlocked[i]) pos++;
  }
  return { x: startX + pos * spacing, y: height * 0.42 };
}

function isStationSpilled(foodIndex) {
  return spills.some(s => s.stationIndex === foodIndex);
}

// --- BLOOK CLASS ---
class Blook {
  constructor(isVIP) {
    this.isVIP = isVIP || false;
    this.shape = BLOOK_SHAPES[floor(random(BLOOK_SHAPES.length))];
    this.color = BLOOK_COLORS[floor(random(BLOOK_COLORS.length))].slice();
    if (this.isVIP) this.color = [255, 215, 0];
    this.name = BLOOK_NAMES[floor(random(BLOOK_NAMES.length))];
    this.size = sz(0.06) + random(-sz(0.005), sz(0.005));

    // What food they want
    let available = [];
    for (let i = 0; i < 4; i++) {
      if (foodUnlocked[i]) available.push(i);
    }
    this.wantedFood = available[floor(random(available.length))];

    // Position & movement
    this.x = -this.size;
    this.y = height * 0.62 + random(-sz(0.02), sz(0.02));
    this.targetX = 0;
    this.targetY = this.y;
    this.speed = sz(0.003) + random(sz(0.0005));
    this.state = "entering"; // entering, waiting, served, leaving, leavingSad
    this.assignStation();

    // Animation
    this.bounce = random(100);
    this.squash = 1;
    this.emotion = "happy";
    this.patienceTimer = getBlookPatience();
    this.maxPatience = this.patienceTimer;
    this.servedTimer = 0;
    this.nameAlpha = 0;

    // VIP sparkle
    this.sparkleTimer = 0;
  }

  assignStation() {
    let stationCount = 0;
    for (let i = 0; i < 4; i++) if (foodUnlocked[i]) stationCount++;
    let stationIndex = this.wantedFood;
    let spacing = width * 0.7 / max(stationCount, 1);
    let startX = width * 0.15 + spacing * 0.5;

    // Find position among unlocked foods
    let pos = 0;
    for (let i = 0; i < this.wantedFood; i++) {
      if (foodUnlocked[i]) pos++;
    }
    this.targetX = startX + pos * spacing;
    this.targetY = height * 0.58 + random(-sz(0.01), sz(0.01));
  }

  update(dt) {
    this.bounce += dt * 4;
    this.sparkleTimer += dt;

    if (this.state === "entering") {
      this.x = lerp(this.x, this.targetX, 0.04);
      this.y = lerp(this.y, this.targetY, 0.04);
      if (abs(this.x - this.targetX) < 3) {
        this.state = "waiting";
        this.emotion = "happy";
      }
    } else if (this.state === "waiting") {
      this.patienceTimer -= dt;
      if (this.patienceTimer < this.maxPatience * 0.3) {
        this.emotion = "impatient";
      }
      if (this.patienceTimer <= 0) {
        this.state = "leavingSad";
        this.emotion = "sad";
        this.targetX = width + this.size * 2;
      }
    } else if (this.state === "served") {
      this.servedTimer += dt;
      this.emotion = "eating";
      if (this.servedTimer > 1.0) {
        this.state = "leaving";
        this.emotion = "happy";
        this.targetX = width + this.size * 2;
      }
    } else if (this.state === "leaving" || this.state === "leavingSad") {
      this.x = lerp(this.x, this.targetX, 0.03);
      if (this.x > width + this.size) {
        this.state = "gone";
      }
    }

    // Squash recover
    this.squash = lerp(this.squash, 1, 0.1);

    // Name alpha (show on hover)
    let d = dist(mouseX, mouseY, this.x, this.y - this.size * 0.3);
    if (d < this.size * 0.8) {
      this.nameAlpha = lerp(this.nameAlpha, 255, 0.15);
    } else {
      this.nameAlpha = lerp(this.nameAlpha, 0, 0.1);
    }
  }

  serve() {
    if (this.state !== "waiting") return false;
    if (foodStock[this.wantedFood] <= 0) return false;
    if (isStationSpilled(this.wantedFood)) return false;

    foodStock[this.wantedFood]--;
    this.state = "served";
    this.squash = 0.6;
    this.servedTimer = 0;

    // Calculate earnings
    let price = getFoodPrice(this.wantedFood);
    let tip = getBlookTip();
    let multiplier = this.isVIP ? 5 : 1;
    let total = (price + tip) * multiplier * comboMultiplier;
    total = round(total);

    money += total;
    moneyEarnedToday += total;
    blooksServedToday++;

    // Combo
    comboCount++;
    comboTimer = 3;
    if (comboCount >= 10) { comboMultiplier = 4; lastComboText = "LEGENDARY!"; }
    else if (comboCount >= 5) { comboMultiplier = 3; lastComboText = "AMAZING!"; }
    else if (comboCount >= 3) { comboMultiplier = 2; lastComboText = "GREAT!"; }
    else if (comboCount >= 2) { comboMultiplier = 1.5; lastComboText = "NICE!"; }
    else { comboMultiplier = 1; lastComboText = ""; }

    // Spawn coins
    for (let i = 0; i < min(total, 12); i++) {
      coins.push(new Coin(this.x + random(-10, 10), this.y - this.size * 0.5, random(-3, 3), random(-6, -3)));
    }

    // Floating text
    let txt = "+$" + total;
    if (this.isVIP) txt = "VIP " + txt + "!";
    if (comboMultiplier > 1) txt += " x" + comboMultiplier;
    floatingTexts.push(new FloatingText(this.x, this.y - this.size, txt, this.isVIP ? [255, 215, 0] : [50, 180, 80]));

    // Hearts
    for (let i = 0; i < 3; i++) {
      particles.push(new HeartParticle(this.x + random(-15, 15), this.y - this.size * 0.5));
    }

    // Combo text
    if (lastComboText && comboCount > 1) {
      floatingTexts.push(new FloatingText(width / 2, height * 0.3, lastComboText, [255, 100, 50], true));
    }

    return true;
  }

  draw() {
    push();
    translate(this.x, this.y + sin(this.bounce) * sz(0.004));

    // VIP glow
    if (this.isVIP) {
      noStroke();
      for (let r = 3; r > 0; r--) {
        fill(255, 215, 0, 20 + sin(this.sparkleTimer * 3) * 10);
        ellipse(0, 0, this.size * (1.3 + r * 0.15), this.size * (1.2 + r * 0.15) * this.squash);
      }
      // Sparkles
      if (frameCount % 5 === 0) {
        particles.push(new SparkleParticle(
          this.x + random(-this.size * 0.5, this.size * 0.5),
          this.y + random(-this.size * 0.5, this.size * 0.3)
        ));
      }
    }

    // Shadow
    noStroke();
    fill(0, 0, 0, 25);
    ellipse(0, this.size * 0.4, this.size * 0.8, this.size * 0.15);

    // Draw body based on shape
    let c = this.color;
    let darkerC = [c[0] * 0.8, c[1] * 0.8, c[2] * 0.8];

    scale(1, this.squash);

    switch (this.shape) {
      case "blob":
        this.drawBlobBody(c, darkerC);
        break;
      case "cat":
        this.drawCatBody(c, darkerC);
        break;
      case "bear":
        this.drawBearBody(c, darkerC);
        break;
      case "star":
        this.drawStarBody(c, darkerC);
        break;
      case "robot":
        this.drawRobotBody(c, darkerC);
        break;
    }

    // Eyes
    this.drawEyes();
    // Mouth
    this.drawMouth();

    // Patience bar (when waiting)
    if (this.state === "waiting") {
      let barW = this.size * 0.8;
      let barH = sz(0.008);
      let barY = -this.size * 0.55;
      let pct = this.patienceTimer / this.maxPatience;

      fill(0, 0, 0, 40);
      rect(-barW / 2, barY, barW, barH, barH);

      let barColor = pct > 0.5 ? [100, 220, 100] : pct > 0.25 ? [255, 200, 50] : [255, 80, 80];
      fill(barColor[0], barColor[1], barColor[2]);
      rect(-barW / 2, barY, barW * pct, barH, barH);
    }

    // Food want bubble
    if (this.state === "waiting" || this.state === "entering") {
      this.drawWantBubble();
    }

    pop();

    // Name tooltip
    if (this.nameAlpha > 5) {
      push();
      noStroke();
      fill(60, 50, 40, this.nameAlpha);
      textAlign(CENTER, CENTER);
      textSize(sz(0.018));
      textFont("Fredoka");
      text(this.name, this.x, this.y + this.size * 0.55);
      pop();
    }
  }

  drawBlobBody(c, dc) {
    // Feet
    fill(dc[0], dc[1], dc[2]);
    ellipse(-this.size * 0.18, this.size * 0.35, this.size * 0.22, this.size * 0.12);
    ellipse(this.size * 0.18, this.size * 0.35, this.size * 0.22, this.size * 0.12);
    // Body
    fill(c[0], c[1], c[2]);
    ellipse(0, 0, this.size * 0.85, this.size * 0.8);
    // Highlight
    fill(255, 255, 255, 60);
    ellipse(-this.size * 0.12, -this.size * 0.15, this.size * 0.2, this.size * 0.15);
  }

  drawCatBody(c, dc) {
    // Ears
    fill(c[0], c[1], c[2]);
    triangle(-this.size * 0.32, -this.size * 0.2, -this.size * 0.18, -this.size * 0.52,
      -this.size * 0.02, -this.size * 0.22);
    triangle(this.size * 0.32, -this.size * 0.2, this.size * 0.18, -this.size * 0.52,
      this.size * 0.02, -this.size * 0.22);
    // Inner ears
    fill(255, 180, 180);
    triangle(-this.size * 0.27, -this.size * 0.22, -this.size * 0.18, -this.size * 0.43,
      -this.size * 0.07, -this.size * 0.23);
    triangle(this.size * 0.27, -this.size * 0.22, this.size * 0.18, -this.size * 0.43,
      this.size * 0.07, -this.size * 0.23);
    // Feet
    fill(dc[0], dc[1], dc[2]);
    ellipse(-this.size * 0.18, this.size * 0.35, this.size * 0.2, this.size * 0.12);
    ellipse(this.size * 0.18, this.size * 0.35, this.size * 0.2, this.size * 0.12);
    // Body
    fill(c[0], c[1], c[2]);
    ellipse(0, 0, this.size * 0.8, this.size * 0.75);
    // Tail
    noFill();
    stroke(c[0], c[1], c[2]);
    strokeWeight(this.size * 0.06);
    let tailWag = sin(this.bounce * 1.5) * 0.3;
    bezier(this.size * 0.35, this.size * 0.15,
      this.size * 0.55, this.size * 0.0 + tailWag * 10,
      this.size * 0.5, -this.size * 0.2 + tailWag * 15,
      this.size * 0.4, -this.size * 0.3);
    noStroke();
    // Highlight
    fill(255, 255, 255, 50);
    ellipse(-this.size * 0.1, -this.size * 0.12, this.size * 0.18, this.size * 0.13);
  }

  drawBearBody(c, dc) {
    // Ears
    fill(dc[0], dc[1], dc[2]);
    ellipse(-this.size * 0.28, -this.size * 0.32, this.size * 0.22, this.size * 0.22);
    ellipse(this.size * 0.28, -this.size * 0.32, this.size * 0.22, this.size * 0.22);
    // Inner ears
    fill(255, 200, 200);
    ellipse(-this.size * 0.28, -this.size * 0.32, this.size * 0.12, this.size * 0.12);
    ellipse(this.size * 0.28, -this.size * 0.32, this.size * 0.12, this.size * 0.12);
    // Feet
    fill(dc[0], dc[1], dc[2]);
    ellipse(-this.size * 0.18, this.size * 0.35, this.size * 0.22, this.size * 0.13);
    ellipse(this.size * 0.18, this.size * 0.35, this.size * 0.22, this.size * 0.13);
    // Body
    fill(c[0], c[1], c[2]);
    ellipse(0, 0, this.size * 0.85, this.size * 0.82);
    // Snout
    fill(255, 230, 210);
    ellipse(0, this.size * 0.08, this.size * 0.3, this.size * 0.22);
    // Nose
    fill(80, 50, 40);
    ellipse(0, this.size * 0.04, this.size * 0.09, this.size * 0.06);
    // Highlight
    fill(255, 255, 255, 50);
    ellipse(-this.size * 0.12, -this.size * 0.15, this.size * 0.18, this.size * 0.13);
  }

  drawStarBody(c, dc) {
    // Star shape
    fill(c[0], c[1], c[2]);
    this.drawStarShape(0, 0, this.size * 0.2, this.size * 0.42, 5);
    // Highlight
    fill(255, 255, 255, 70);
    ellipse(-this.size * 0.05, -this.size * 0.08, this.size * 0.15, this.size * 0.12);
    // Glow
    if (frameCount % 3 === 0) {
      noStroke();
      fill(c[0], c[1], c[2], 30);
      this.drawStarShape(0, 0, this.size * 0.25, this.size * 0.5, 5);
    }
  }

  drawStarShape(x, y, r1, r2, pts) {
    beginShape();
    for (let i = 0; i < pts * 2; i++) {
      let angle = (TWO_PI / (pts * 2)) * i - HALF_PI;
      let r = i % 2 === 0 ? r2 : r1;
      vertex(x + cos(angle) * r, y + sin(angle) * r);
    }
    endShape(CLOSE);
  }

  drawRobotBody(c, dc) {
    // Antenna
    stroke(dc[0], dc[1], dc[2]);
    strokeWeight(this.size * 0.04);
    line(0, -this.size * 0.35, 0, -this.size * 0.5);
    noStroke();
    fill(255, 80, 80);
    ellipse(0, -this.size * 0.52, this.size * 0.1, this.size * 0.1);
    // Feet
    fill(dc[0], dc[1], dc[2]);
    rect(-this.size * 0.25, this.size * 0.28, this.size * 0.18, this.size * 0.1, this.size * 0.03);
    rect(this.size * 0.07, this.size * 0.28, this.size * 0.18, this.size * 0.1, this.size * 0.03);
    // Body (rounded rect)
    fill(c[0], c[1], c[2]);
    rectMode(CENTER);
    rect(0, 0, this.size * 0.75, this.size * 0.7, this.size * 0.12);
    rectMode(CORNER);
    // Screen/belly
    fill(200, 240, 255);
    rectMode(CENTER);
    rect(0, this.size * 0.05, this.size * 0.35, this.size * 0.2, this.size * 0.05);
    rectMode(CORNER);
    // Bolts
    fill(dc[0], dc[1], dc[2]);
    ellipse(-this.size * 0.3, -this.size * 0.2, this.size * 0.07, this.size * 0.07);
    ellipse(this.size * 0.3, -this.size * 0.2, this.size * 0.07, this.size * 0.07);
  }

  drawEyes() {
    let eyeY = -this.size * 0.1;
    let eyeSpacing = this.size * 0.14;
    let eyeSize = this.size * 0.13;

    if (this.shape === "bear") eyeY = -this.size * 0.12;
    if (this.shape === "star") eyeY = -this.size * 0.06;
    if (this.shape === "robot") {
      eyeY = -this.size * 0.15;
      eyeSpacing = this.size * 0.15;
    }

    if (this.emotion === "eating") {
      // Happy closed eyes (^ ^)
      stroke(60, 40, 30);
      strokeWeight(this.size * 0.03);
      noFill();
      arc(-eyeSpacing, eyeY, eyeSize, eyeSize * 0.6, PI, TWO_PI);
      arc(eyeSpacing, eyeY, eyeSize, eyeSize * 0.6, PI, TWO_PI);
      noStroke();
    } else if (this.emotion === "sad") {
      // Sad eyes
      fill(255);
      ellipse(-eyeSpacing, eyeY, eyeSize, eyeSize);
      ellipse(eyeSpacing, eyeY, eyeSize, eyeSize);
      fill(60, 40, 30);
      ellipse(-eyeSpacing, eyeY + eyeSize * 0.1, eyeSize * 0.5, eyeSize * 0.5);
      ellipse(eyeSpacing, eyeY + eyeSize * 0.1, eyeSize * 0.5, eyeSize * 0.5);
      // Tear
      fill(100, 180, 255);
      ellipse(eyeSpacing + eyeSize * 0.3, eyeY + eyeSize * 0.5 + sin(this.bounce * 2) * 3,
        this.size * 0.04, this.size * 0.06);
    } else if (this.emotion === "impatient") {
      // Angry-ish eyes
      fill(255);
      ellipse(-eyeSpacing, eyeY, eyeSize, eyeSize);
      ellipse(eyeSpacing, eyeY, eyeSize, eyeSize);
      fill(60, 40, 30);
      ellipse(-eyeSpacing, eyeY, eyeSize * 0.55, eyeSize * 0.55);
      ellipse(eyeSpacing, eyeY, eyeSize * 0.55, eyeSize * 0.55);
      // Furrowed brows
      stroke(60, 40, 30);
      strokeWeight(this.size * 0.025);
      line(-eyeSpacing - eyeSize * 0.4, eyeY - eyeSize * 0.5,
        -eyeSpacing + eyeSize * 0.3, eyeY - eyeSize * 0.7);
      line(eyeSpacing + eyeSize * 0.4, eyeY - eyeSize * 0.5,
        eyeSpacing - eyeSize * 0.3, eyeY - eyeSize * 0.7);
      noStroke();
      // Sweat drop
      fill(150, 200, 255, 180);
      ellipse(this.size * 0.32, eyeY - this.size * 0.1, this.size * 0.05, this.size * 0.08);
    } else {
      // Normal/happy eyes
      fill(255);
      ellipse(-eyeSpacing, eyeY, eyeSize, eyeSize);
      ellipse(eyeSpacing, eyeY, eyeSize, eyeSize);
      // Pupils - follow mouse slightly
      let px = constrain((mouseX - this.x) * 0.01, -eyeSize * 0.15, eyeSize * 0.15);
      let py = constrain((mouseY - this.y) * 0.01, -eyeSize * 0.15, eyeSize * 0.15);
      fill(60, 40, 30);
      ellipse(-eyeSpacing + px, eyeY + py, eyeSize * 0.5, eyeSize * 0.5);
      ellipse(eyeSpacing + px, eyeY + py, eyeSize * 0.5, eyeSize * 0.5);
      // Eye shine
      fill(255, 255, 255, 200);
      ellipse(-eyeSpacing + px - eyeSize * 0.1, eyeY + py - eyeSize * 0.1,
        eyeSize * 0.2, eyeSize * 0.2);
      ellipse(eyeSpacing + px - eyeSize * 0.1, eyeY + py - eyeSize * 0.1,
        eyeSize * 0.2, eyeSize * 0.2);
    }

    // Blush (when happy or eating)
    if (this.emotion === "happy" || this.emotion === "eating") {
      fill(255, 150, 150, 80);
      noStroke();
      ellipse(-eyeSpacing - eyeSize * 0.3, eyeY + eyeSize * 0.6, this.size * 0.1, this.size * 0.06);
      ellipse(eyeSpacing + eyeSize * 0.3, eyeY + eyeSize * 0.6, this.size * 0.1, this.size * 0.06);
    }
  }

  drawMouth() {
    let mouthY = this.size * 0.12;
    if (this.shape === "bear") mouthY = this.size * 0.15;
    if (this.shape === "star") mouthY = this.size * 0.1;
    if (this.shape === "robot") mouthY = this.size * 0.08;

    noFill();
    stroke(60, 40, 30);
    strokeWeight(this.size * 0.025);

    if (this.emotion === "happy" || this.emotion === "eating") {
      arc(0, mouthY, this.size * 0.2, this.size * 0.15, 0, PI);
    } else if (this.emotion === "sad") {
      arc(0, mouthY + this.size * 0.05, this.size * 0.15, this.size * 0.1, PI, TWO_PI);
    } else if (this.emotion === "impatient") {
      line(-this.size * 0.08, mouthY, this.size * 0.08, mouthY);
    } else {
      arc(0, mouthY, this.size * 0.12, this.size * 0.08, 0, PI);
    }
    noStroke();
  }

  drawWantBubble() {
    let bx = this.size * 0.35;
    let by = -this.size * 0.55;
    let bs = this.size * 0.4;

    // Bubble
    fill(255, 255, 255, 230);
    stroke(200, 200, 200);
    strokeWeight(1.5);
    ellipse(bx, by, bs, bs);
    // Bubble tail
    noStroke();
    fill(255, 255, 255, 230);
    triangle(bx - bs * 0.2, by + bs * 0.35, bx - bs * 0.35, by + bs * 0.55, bx + bs * 0.05, by + bs * 0.35);

    // Food icon
    noStroke();
    drawFoodIcon(bx, by, bs * 0.55, this.wantedFood);
  }

  isClicked(mx, my) {
    return dist(mx, my, this.x, this.y) < this.size * 0.5;
  }
}

// --- FOOD DRAWING ---
function drawFoodIcon(x, y, size, type) {
  push();
  translate(x, y);
  let s = size;

  switch (type) {
    case 0: // Toast
      fill(220, 180, 100);
      rectMode(CENTER);
      rect(0, 0, s * 0.7, s * 0.8, s * 0.1);
      // Crust top
      fill(195, 150, 70);
      arc(0, -s * 0.25, s * 0.7, s * 0.4, PI, TWO_PI, CHORD);
      // Butter
      fill(255, 230, 80);
      rectMode(CENTER);
      rect(0, s * 0.05, s * 0.3, s * 0.15, s * 0.05);
      rectMode(CORNER);
      break;

    case 1: // Yogurt
      // Cup
      fill(240, 240, 250);
      beginShape();
      vertex(-s * 0.3, -s * 0.15);
      vertex(-s * 0.25, s * 0.35);
      vertex(s * 0.25, s * 0.35);
      vertex(s * 0.3, -s * 0.15);
      endShape(CLOSE);
      // Yogurt top
      fill(255, 150, 200);
      ellipse(0, -s * 0.15, s * 0.6, s * 0.25);
      // Swirl
      noFill();
      stroke(255, 200, 220);
      strokeWeight(s * 0.06);
      arc(0, -s * 0.18, s * 0.2, s * 0.1, 0, PI);
      noStroke();
      // Berry on top
      fill(200, 50, 80);
      ellipse(0, -s * 0.25, s * 0.12, s * 0.12);
      break;

    case 2: // Candy Box
      // Box
      fill(255, 100, 140);
      rectMode(CENTER);
      rect(0, s * 0.05, s * 0.65, s * 0.55, s * 0.06);
      // Lid
      fill(255, 130, 160);
      rect(0, -s * 0.2, s * 0.7, s * 0.2, s * 0.06);
      rectMode(CORNER);
      // Ribbon
      fill(255, 220, 80);
      rectMode(CENTER);
      rect(0, 0, s * 0.1, s * 0.7);
      rect(0, -s * 0.05, s * 0.65, s * 0.08);
      rectMode(CORNER);
      // Bow
      fill(255, 220, 80);
      ellipse(-s * 0.1, -s * 0.32, s * 0.15, s * 0.1);
      ellipse(s * 0.1, -s * 0.32, s * 0.15, s * 0.1);
      break;

    case 3: // Cupcake
      // Wrapper
      fill(255, 180, 200);
      beginShape();
      vertex(-s * 0.3, s * 0.35);
      vertex(-s * 0.22, s * 0.0);
      vertex(s * 0.22, s * 0.0);
      vertex(s * 0.3, s * 0.35);
      endShape(CLOSE);
      // Wrapper lines
      stroke(240, 150, 175);
      strokeWeight(s * 0.02);
      line(-s * 0.15, s * 0.03, -s * 0.2, s * 0.33);
      line(0, s * 0.01, 0, s * 0.33);
      line(s * 0.15, s * 0.03, s * 0.2, s * 0.33);
      noStroke();
      // Frosting
      fill(255, 200, 230);
      ellipse(0, -s * 0.05, s * 0.5, s * 0.3);
      fill(255, 220, 240);
      ellipse(-s * 0.08, -s * 0.12, s * 0.2, s * 0.15);
      ellipse(s * 0.1, -s * 0.08, s * 0.2, s * 0.15);
      // Cherry
      fill(220, 30, 60);
      ellipse(0, -s * 0.22, s * 0.13, s * 0.13);
      // Stem
      stroke(80, 140, 60);
      strokeWeight(s * 0.025);
      line(0, -s * 0.28, s * 0.05, -s * 0.38);
      noStroke();
      // Cherry shine
      fill(255, 255, 255, 120);
      ellipse(-s * 0.02, -s * 0.24, s * 0.04, s * 0.04);
      break;
  }
  pop();
}

// --- PARTICLE CLASSES ---
class Particle {
  constructor(x, y, col) {
    this.x = x;
    this.y = y;
    this.vx = random(-3, 3);
    this.vy = random(-5, -1);
    this.life = 1;
    this.decay = random(0.015, 0.03);
    this.size = random(sz(0.005), sz(0.012));
    this.color = col || [255, 200, 50];
    this.gravity = 0.15;
  }

  update(dt) {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.life -= this.decay;
  }

  draw() {
    noStroke();
    fill(this.color[0], this.color[1], this.color[2], this.life * 255);
    ellipse(this.x, this.y, this.size * this.life, this.size * this.life);
  }

  isDead() { return this.life <= 0; }
}

class ConfettiParticle extends Particle {
  constructor(x, y) {
    super(x, y);
    this.vx = random(-6, 6);
    this.vy = random(-8, -2);
    this.rotation = random(TWO_PI);
    this.rotSpeed = random(-0.2, 0.2);
    this.w = random(sz(0.005), sz(0.012));
    this.h = random(sz(0.003), sz(0.008));
    this.color = [
      [255, 100, 100], [100, 255, 100], [100, 100, 255],
      [255, 255, 100], [255, 100, 255], [100, 255, 255]
    ][floor(random(6))];
    this.decay = random(0.008, 0.015);
    this.gravity = 0.12;
  }

  draw() {
    push();
    translate(this.x, this.y);
    rotate(this.rotation);
    this.rotation += this.rotSpeed;
    noStroke();
    fill(this.color[0], this.color[1], this.color[2], this.life * 255);
    rectMode(CENTER);
    rect(0, 0, this.w, this.h, 2);
    pop();
  }
}

class HeartParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vy = random(-2, -0.8);
    this.vx = random(-0.5, 0.5);
    this.life = 1;
    this.size = random(sz(0.01), sz(0.02));
    this.decay = random(0.01, 0.02);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= this.decay;
  }

  draw() {
    push();
    translate(this.x, this.y);
    let s = this.size * this.life;
    fill(255, 80, 120, this.life * 255);
    noStroke();
    beginShape();
    vertex(0, -s * 0.35);
    bezierVertex(-s * 0.5, -s * 0.8, -s, -s * 0.2, 0, s * 0.4);
    bezierVertex(s, -s * 0.2, s * 0.5, -s * 0.8, 0, -s * 0.35);
    endShape(CLOSE);
    pop();
  }

  isDead() { return this.life <= 0; }
}

class SparkleParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.life = 1;
    this.size = random(sz(0.003), sz(0.008));
    this.decay = random(0.03, 0.06);
  }

  update() { this.life -= this.decay; }

  draw() {
    push();
    translate(this.x, this.y);
    let s = this.size * this.life;
    fill(255, 255, 200, this.life * 255);
    noStroke();
    // 4-point star
    beginShape();
    vertex(0, -s);
    vertex(-s * 0.25, -s * 0.25);
    vertex(-s, 0);
    vertex(-s * 0.25, s * 0.25);
    vertex(0, s);
    vertex(s * 0.25, s * 0.25);
    vertex(s, 0);
    vertex(s * 0.25, -s * 0.25);
    endShape(CLOSE);
    pop();
  }

  isDead() { return this.life <= 0; }
}

class Coin {
  constructor(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.life = 1;
    this.size = sz(0.012);
    this.gravity = 0.2;
    this.bounced = false;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.vx *= 0.99;

    // Bounce off bottom
    if (this.y > height * 0.75 && !this.bounced) {
      this.vy = -abs(this.vy) * 0.4;
      this.bounced = true;
    }

    if (this.bounced) {
      this.life -= 0.03;
    }
  }

  draw() {
    noStroke();
    // Coin shadow
    fill(200, 170, 0, this.life * 100);
    ellipse(this.x, this.y + 2, this.size, this.size * 0.5);
    // Coin
    fill(255, 215, 0, this.life * 255);
    ellipse(this.x, this.y, this.size, this.size);
    // Dollar sign
    fill(200, 170, 0, this.life * 255);
    textSize(this.size * 0.5);
    textAlign(CENTER, CENTER);
    textFont("Fredoka");
    text("$", this.x, this.y);
  }

  isDead() { return this.life <= 0; }
}

class FloatingText {
  constructor(x, y, txt, col, isBig) {
    this.x = x;
    this.y = y;
    this.text = txt;
    this.color = col || [50, 50, 50];
    this.life = 1;
    this.isBig = isBig || false;
    this.scale = 0;
  }

  update() {
    this.y -= 1.2;
    this.life -= 0.012;
    this.scale = min(this.scale + 0.12, 1);
  }

  draw() {
    let s = this.isBig ? sz(0.05) : sz(0.028);
    let sc = easeOutBack(min(this.scale, 1));
    push();
    translate(this.x, this.y);
    scale(sc);
    textFont("Fredoka");
    textSize(s);
    textAlign(CENTER, CENTER);
    // Outline
    fill(255, 255, 255, this.life * 200);
    stroke(255, 255, 255, this.life * 200);
    strokeWeight(4);
    text(this.text, 0, 0);
    // Text
    noStroke();
    fill(this.color[0], this.color[1], this.color[2], this.life * 255);
    text(this.text, 0, 0);
    pop();
  }

  isDead() { return this.life <= 0; }
}

// --- MATH PROBLEM SYSTEM ---
function getMathTier() {
  if (day <= 10) return 1;
  if (day <= 25) return 2;
  if (day <= 45) return 3;
  if (day <= 70) return 4;
  return 5;
}

function generateMathProblem() {
  let tier = getMathTier();
  let problem = {};

  switch (tier) {
    case 1: { // Addition
      let a = floor(random(1, 10));
      let b = floor(random(1, 10));
      let contexts = [
        `$${a} + $${b} = ?`,
        `A blook buys toast for $${a}\nand a drink for $${b}.\nHow much total?`,
        `You have $${a}.\nA blook tips you $${b}.\nHow much now?`
      ];
      problem.question = contexts[floor(random(contexts.length))];
      problem.answer = a + b;
      problem.operation = "+";
      break;
    }
    case 2: { // Subtraction & making change
      let total = floor(random(10, 21));
      let cost = floor(random(2, total - 1));
      let contexts = [
        `$${total} - $${cost} = ?`,
        `A blook pays $${total} for\na $${cost} item.\nHow much change?`,
        `You have $${total}.\nYou spend $${cost} on supplies.\nHow much left?`
      ];
      problem.question = contexts[floor(random(contexts.length))];
      problem.answer = total - cost;
      problem.operation = "-";
      break;
    }
    case 3: { // Multiplication
      let qty = floor(random(2, 7));
      let price = floor(random(2, 8));
      let contexts = [
        `${qty} x $${price} = ?`,
        `${qty} blooks each buy\na $${price} item.\nTotal earned?`,
        `${qty} cupcakes at\n$${price} each.\nHow much?`
      ];
      problem.question = contexts[floor(random(contexts.length))];
      problem.answer = qty * price;
      problem.operation = "x";
      break;
    }
    case 4: { // Mixed operations
      let type = floor(random(3));
      if (type === 0) {
        // Two-step: buy two things
        let a = floor(random(3, 12));
        let b = floor(random(3, 12));
        problem.question = `A blook buys food for $${a}\nand a drink for $${b}.\nTotal?`;
        problem.answer = a + b;
      } else if (type === 1) {
        // Multiplication with bigger numbers
        let qty = floor(random(3, 9));
        let price = floor(random(3, 12));
        problem.question = `${qty} items at $${price} each.\nTotal cost?`;
        problem.answer = qty * price;
      } else {
        // Making change from larger bills
        let paid = [20, 50][floor(random(2))];
        let cost = floor(random(5, paid - 2));
        problem.question = `Blook pays $${paid} for\na $${cost} order.\nChange?`;
        problem.answer = paid - cost;
      }
      problem.operation = "mix";
      break;
    }
    case 5: { // Division & complex
      let type = floor(random(3));
      if (type === 0) {
        // Division (splitting bills)
        let people = [2, 3, 4, 5][floor(random(4))];
        let total = people * floor(random(3, 12));
        problem.question = `$${total} split equally\nbetween ${people} blooks.\nEach pays?`;
        problem.answer = total / people;
      } else if (type === 1) {
        // Multi-step
        let a = floor(random(5, 15));
        let b = floor(random(5, 15));
        let tip = floor(random(2, 8));
        problem.question = `Food: $${a} + $${b}\nPlus $${tip} tip.\nTotal?`;
        problem.answer = a + b + tip;
      } else {
        // Multiplication with larger numbers
        let qty = floor(random(4, 10));
        let price = floor(random(5, 15));
        problem.question = `${qty} orders at $${price}.\nTotal earned?`;
        problem.answer = qty * price;
      }
      problem.operation = "mix";
      break;
    }
  }

  // Generate choices
  problem.choices = generateChoices(problem.answer);
  return problem;
}

function generateChoices(correct) {
  let choices = new Set([correct]);
  let attempts = 0;

  while (choices.size < 4 && attempts < 50) {
    let offset;
    if (correct <= 10) {
      offset = floor(random(-3, 4));
    } else if (correct <= 30) {
      offset = floor(random(-5, 6));
    } else {
      offset = floor(random(-8, 9));
    }
    let wrong = correct + offset;
    if (wrong > 0 && wrong !== correct) {
      choices.add(wrong);
    }
    attempts++;
  }

  // Fill remaining with random offsets
  while (choices.size < 4) {
    choices.add(correct + choices.size * 2 + 1);
  }

  return shuffleArray([...choices]);
}

// --- DRAWING HELPERS ---
function drawCafeBackground() {
  // Sky
  let skyTop, skyBottom;
  if (gameState === "night" || gameState === "dayEnd") {
    skyTop = [25, 25, 60];
    skyBottom = [50, 40, 80];
  } else {
    let dayPct = dayTimer / dayDuration;
    // Morning → afternoon → evening
    if (dayPct < 0.3) {
      skyTop = lerpColor2([255, 200, 150], [135, 190, 255], dayPct / 0.3);
      skyBottom = lerpColor2([255, 230, 180], [200, 225, 255], dayPct / 0.3);
    } else if (dayPct < 0.8) {
      skyTop = [135, 190, 255];
      skyBottom = [200, 225, 255];
    } else {
      skyTop = lerpColor2([135, 190, 255], [255, 150, 100], (dayPct - 0.8) / 0.2);
      skyBottom = lerpColor2([200, 225, 255], [255, 180, 130], (dayPct - 0.8) / 0.2);
    }
  }

  // Draw gradient sky
  for (let y = 0; y < height * 0.35; y++) {
    let t = y / (height * 0.35);
    let c = lerpColor2(skyTop, skyBottom, t);
    stroke(c[0], c[1], c[2]);
    line(0, y, width, y);
  }
  noStroke();

  // Sun/Moon
  if (gameState === "night" || gameState === "dayEnd") {
    // Moon
    fill(240, 240, 220);
    let moonX = width * 0.8;
    let moonY = height * 0.1;
    ellipse(moonX, moonY, sz(0.05), sz(0.05));
    fill(25, 25, 60);
    ellipse(moonX + sz(0.01), moonY - sz(0.005), sz(0.04), sz(0.04));
    // Stars
    fill(255, 255, 230);
    for (let i = 0; i < 15; i++) {
      let sx = (i * 173 + 50) % width;
      let sy = (i * 97 + 20) % (height * 0.3);
      let ss = sz(0.003) + sin(frameCount * 0.05 + i) * sz(0.001);
      ellipse(sx, sy, ss, ss);
    }
  } else {
    // Sun
    let sunPct = dayTimer / dayDuration;
    let sunX = lerp(width * 0.15, width * 0.85, sunPct);
    let sunY = height * 0.12 - sin(sunPct * PI) * height * 0.08;
    fill(255, 220, 80, 60);
    ellipse(sunX, sunY, sz(0.08), sz(0.08));
    fill(255, 230, 100);
    ellipse(sunX, sunY, sz(0.05), sz(0.05));
  }

  // Clouds
  fill(255, 255, 255, gameState === "night" ? 30 : 80);
  for (let i = 0; i < 4; i++) {
    let cx = ((i * 250 + frameCount * 0.3 * (i % 2 === 0 ? 1 : 0.7)) % (width + 200)) - 100;
    let cy = height * 0.08 + i * height * 0.06;
    ellipse(cx, cy, sz(0.08), sz(0.025));
    ellipse(cx + sz(0.03), cy - sz(0.008), sz(0.06), sz(0.02));
    ellipse(cx - sz(0.02), cy - sz(0.005), sz(0.05), sz(0.02));
  }

  // Cafe building
  // Wall
  let wallColor = [
    [255, 245, 230],
    [255, 235, 215],
    [245, 225, 200],
    [240, 220, 195],
    [235, 215, 190],
    [230, 210, 185]
  ][min(cafeLevel, 5)];

  fill(wallColor[0], wallColor[1], wallColor[2]);
  rect(0, height * 0.3, width, height * 0.7);

  // Cafe sign / awning
  let awningColors = [
    [[255, 130, 80], [255, 255, 255]],
    [[255, 100, 120], [255, 240, 230]],
    [[100, 180, 255], [255, 255, 255]],
    [[160, 120, 255], [255, 240, 255]],
    [[80, 200, 160], [255, 255, 240]],
    [[255, 180, 50], [255, 255, 230]]
  ][min(cafeLevel, 5)];

  for (let i = 0; i < 12; i++) {
    let stripe = i % 2 === 0 ? awningColors[0] : awningColors[1];
    fill(stripe[0], stripe[1], stripe[2]);
    let aw = width / 12;
    triangle(i * aw, height * 0.3, (i + 1) * aw, height * 0.3,
      (i + 0.5) * aw, height * 0.35);
  }

  // Floor
  drawCheckeredFloor();

  // Counter
  let counterY = height * 0.48;
  let counterH = height * 0.06;

  // Counter shadow
  fill(0, 0, 0, 15);
  rect(0, counterY + counterH, width, sz(0.01));

  // Counter body
  let counterColors = [
    [160, 120, 60],
    [150, 100, 50],
    [130, 80, 40],
    [110, 70, 45],
    [90, 60, 40],
    [70, 50, 35]
  ][min(cafeLevel, 5)];
  fill(counterColors[0], counterColors[1], counterColors[2]);
  rect(width * 0.05, counterY, width * 0.9, counterH, sz(0.005));

  // Counter top (lighter)
  fill(counterColors[0] + 40, counterColors[1] + 40, counterColors[2] + 20);
  rect(width * 0.05, counterY, width * 0.9, counterH * 0.3, sz(0.005), sz(0.005), 0, 0);

  // Decorations based on cafe level
  if (cafeLevel >= 1) {
    // Flower pot
    fill(180, 80, 60);
    rectMode(CENTER);
    rect(width * 0.92, counterY - sz(0.015), sz(0.025), sz(0.03), sz(0.003));
    fill(80, 180, 80);
    ellipse(width * 0.92, counterY - sz(0.04), sz(0.03), sz(0.03));
    fill(255, 100, 100);
    ellipse(width * 0.92, counterY - sz(0.048), sz(0.012), sz(0.012));
    rectMode(CORNER);
  }
  if (cafeLevel >= 2) {
    // Menu board on wall
    fill(50, 40, 30);
    rectMode(CENTER);
    rect(width * 0.88, height * 0.37, sz(0.06), sz(0.05), sz(0.005));
    fill(255, 255, 200);
    textSize(sz(0.01));
    textAlign(CENTER, CENTER);
    textFont("Fredoka");
    text("MENU", width * 0.88, height * 0.36);
    rectMode(CORNER);
  }
  if (cafeLevel >= 3) {
    // Pendant lights
    for (let i = 0; i < 3; i++) {
      let lx = width * 0.25 + i * width * 0.25;
      stroke(80);
      strokeWeight(1.5);
      line(lx, height * 0.3, lx, height * 0.36);
      noStroke();
      fill(255, 240, 200);
      ellipse(lx, height * 0.37, sz(0.02), sz(0.015));
      // Light glow
      fill(255, 240, 200, 20);
      ellipse(lx, height * 0.38, sz(0.08), sz(0.06));
    }
  }
  if (cafeLevel >= 4) {
    // Picture frames on wall
    for (let i = 0; i < 2; i++) {
      let fx = width * 0.2 + i * width * 0.4;
      fill(140, 100, 60);
      rectMode(CENTER);
      rect(fx, height * 0.37, sz(0.04), sz(0.035), sz(0.003));
      fill(200, 220, 255);
      rect(fx, height * 0.37, sz(0.032), sz(0.027), sz(0.002));
      rectMode(CORNER);
    }
  }
}

function drawCheckeredFloor() {
  let tileSize = sz(0.035);
  let floorY = height * 0.72;
  let floorH = height - floorY;

  for (let y = floorY; y < height; y += tileSize) {
    for (let x = 0; x < width; x += tileSize) {
      let i = floor(x / tileSize) + floor(y / tileSize);
      if (i % 2 === 0) {
        fill(240, 230, 215);
      } else {
        fill(220, 210, 195);
      }
      rect(x, y, tileSize, tileSize);
    }
  }

  // Perspective darken at bottom
  for (let y = floorY; y < height; y++) {
    let t = (y - floorY) / floorH;
    fill(0, 0, 0, t * 20);
    rect(0, y, width, 1);
  }
}

function drawFoodStations() {
  let unlockedCount = 0;
  for (let i = 0; i < 4; i++) if (foodUnlocked[i]) unlockedCount++;

  let spacing = width * 0.7 / max(unlockedCount, 1);
  let startX = width * 0.15 + spacing * 0.5;
  let stationY = height * 0.42;
  let pos = 0;

  for (let i = 0; i < 4; i++) {
    if (!foodUnlocked[i]) continue;

    let sx = startX + pos * spacing;
    let sw = spacing * 0.7;
    let sh = sz(0.1);

    // Station platform
    let fc = FOOD_TYPES[i].color;
    fill(fc[0], fc[1], fc[2], 40);
    rectMode(CENTER);
    rect(sx, stationY + sh * 0.3, sw, sh * 0.15, sz(0.005));

    // Food icon
    let foodIconSize = sz(0.06);
    drawFoodIcon(sx, stationY, foodIconSize, i);
    if (foodStock[i] <= 0) {
      // Grey overlay on empty food
      fill(255, 255, 255, 160);
      noStroke();
      ellipse(sx, stationY, foodIconSize * 1.1, foodIconSize * 1.1);
      // "EMPTY" tag
      fill(255, 80, 80);
      rectMode(CENTER);
      rect(sx, stationY, sz(0.06), sz(0.022), sz(0.005));
      fill(255);
      textSize(sz(0.013));
      textAlign(CENTER, CENTER);
      textFont("Fredoka");
      text("EMPTY!", sx, stationY);
    }

    // Stock bar
    let barW = sw * 0.6;
    let barH = sz(0.012);
    let barY = stationY + sh * 0.45;
    let maxStock = getMaxStock(i);
    let stockPct = foodStock[i] / maxStock;

    fill(0, 0, 0, 30);
    rect(sx, barY, barW, barH, barH);

    let barColor = stockPct > 0.5 ? [100, 200, 100] :
      stockPct > 0.2 ? [255, 200, 50] : [255, 80, 80];
    if (stockPct <= 0) barColor = [180, 180, 180];

    fill(barColor[0], barColor[1], barColor[2]);
    rect(sx - barW * 0.5 + barW * stockPct * 0.5, barY, barW * stockPct, barH, barH);

    // Stock number
    fill(80, 60, 40);
    textSize(sz(0.014));
    textAlign(CENTER, CENTER);
    textFont("Fredoka");
    text(foodStock[i] + "/" + maxStock, sx, barY + barH * 1.5);

    // Food name & price
    textSize(sz(0.016));
    fill(80, 60, 40);
    text(FOOD_TYPES[i].name, sx, stationY - foodIconSize * 0.7);
    textSize(sz(0.013));
    fill(80, 140, 60);
    text("$" + getFoodPrice(i), sx, stationY - foodIconSize * 0.7 - sz(0.02));

    // Restock button (pushed down so it doesn't cover stock number)
    let btnW = sw * 0.55;
    let btnH = sz(0.035);
    let btnY = barY + sz(0.055);

    let isLow = foodStock[i] < maxStock * 0.5;
    let isEmpty = foodStock[i] <= 0;
    let pulse = isEmpty ? sin(frameCount * 0.1) * 0.15 + 0.85 : 1;

    let btnColor = isEmpty ? [255, 80, 80] : isLow ? [255, 180, 50] : [100, 180, 100];

    // Check hover
    let isHovered = mouseX > sx - btnW / 2 && mouseX < sx + btnW / 2 &&
      mouseY > btnY - btnH / 2 && mouseY < btnY + btnH / 2;

    // Button shadow
    fill(0, 0, 0, 30);
    rect(sx, btnY + 3, btnW, btnH, sz(0.008));

    // Button
    fill(btnColor[0] * pulse, btnColor[1] * pulse, btnColor[2] * pulse);
    if (isHovered) fill(btnColor[0] * 0.85, btnColor[1] * 0.85, btnColor[2] * 0.85);
    rect(sx, isHovered ? btnY + 1 : btnY, btnW, btnH, sz(0.008));

    fill(255);
    textSize(sz(0.016));
    text("RESTOCK", sx, isHovered ? btnY + 1 : btnY);

    rectMode(CORNER);
    pos++;
  }
}

function drawSpills() {
  for (let spill of spills) {
    push();
    translate(spill.x, spill.y);

    let pulse = sin(spill.wobble) * 0.05 + 1;
    let urgency = spill.timer / spill.maxTimer;

    // Puddle
    noStroke();
    fill(180, 130, 80, 180);
    ellipse(0, 0, sz(0.07) * pulse, sz(0.03) * pulse);
    // Puddle highlight
    fill(200, 160, 100, 100);
    ellipse(-sz(0.01), -sz(0.005), sz(0.03), sz(0.012));

    // Splatter drops
    fill(180, 130, 80, 150);
    ellipse(sz(0.035), -sz(0.008), sz(0.015), sz(0.01));
    ellipse(-sz(0.03), sz(0.01), sz(0.012), sz(0.008));

    // "CLEAN UP!" text (pulses red as time runs out)
    let textCol = urgency > 0.4 ? [255, 180, 50] : [255, 80, 60];
    let textPulse = urgency <= 0.4 ? sin(spill.wobble * 2) * 0.1 + 1 : 1;

    fill(textCol[0], textCol[1], textCol[2]);
    textFont("Fredoka");
    textSize(sz(0.016) * textPulse);
    textAlign(CENTER, CENTER);
    text("CLEAN UP!", 0, -sz(0.025));

    // Timer bar
    let barW = sz(0.05);
    let barH = sz(0.006);
    fill(0, 0, 0, 40);
    rectMode(CENTER);
    rect(0, sz(0.02), barW, barH, barH);
    let barCol = urgency > 0.4 ? [255, 200, 80] : [255, 80, 60];
    fill(barCol[0], barCol[1], barCol[2]);
    rect(-barW * (1 - urgency) * 0.5, sz(0.02), barW * urgency, barH, barH);
    rectMode(CORNER);

    pop();
  }
}

function handleSpillClick(mx, my) {
  for (let i = spills.length - 1; i >= 0; i--) {
    let s = spills[i];
    if (dist(mx, my, s.x, s.y) < sz(0.05)) {
      // Cleaned up!
      floatingTexts.push(new FloatingText(s.x, s.y - sz(0.03), "Cleaned!", [100, 200, 100]));
      // Sparkle effect
      for (let j = 0; j < 8; j++) {
        particles.push(new SparkleParticle(s.x + random(-20, 20), s.y + random(-15, 15)));
      }
      spills.splice(i, 1);
      return true;
    }
  }
  return false;
}

function drawHUD() {
  // Top bar background
  fill(0, 0, 0, 40);
  rect(0, 0, width, sz(0.07));

  textFont("Fredoka");
  textAlign(LEFT, CENTER);
  let hudY = sz(0.035);
  let margin = sz(0.02);

  // Day (pushed right to avoid back button)
  fill(255);
  textSize(sz(0.022));
  text("Day " + day + (day >= 100 ? " (FINAL)" : ""), width * 0.15, hudY);

  // Money
  fill(255, 215, 0);
  textSize(sz(0.025));
  let moneyX = width * 0.35;
  text("$" + money, moneyX, hudY);

  // Strikes
  let strikeX = width * 0.55;
  for (let i = 0; i < maxStrikesPerDay; i++) {
    if (i < strikes) {
      fill(255, 60, 60);
      textSize(sz(0.025));
      text("X", strikeX + i * sz(0.03), hudY);
    } else {
      fill(255, 255, 255, 80);
      textSize(sz(0.025));
      text("O", strikeX + i * sz(0.03), hudY);
    }
  }

  // Day timer bar
  let timerBarW = width * 0.25;
  let timerBarH = sz(0.012);
  let timerX = width * 0.72;
  let timerY = hudY;
  let timerPct = dayTimer / dayDuration;

  fill(0, 0, 0, 40);
  rect(timerX, timerY - timerBarH / 2, timerBarW, timerBarH, timerBarH);

  let timerColor = timerPct < 0.8 ? [100, 200, 255] : [255, 150, 80];
  fill(timerColor[0], timerColor[1], timerColor[2]);
  rect(timerX, timerY - timerBarH / 2, timerBarW * timerPct, timerBarH, timerBarH);

  // Timer icon (clock)
  fill(255, 255, 255, 180);
  textSize(sz(0.018));
  textAlign(RIGHT, CENTER);
  let timeLeft = max(0, ceil(dayDuration - dayTimer));
  text(timeLeft + "s", timerX - sz(0.01), timerY);

  // Combo indicator
  if (comboCount > 1 && comboTimer > 0) {
    textAlign(CENTER, CENTER);
    let comboAlpha = min(comboTimer / 0.5, 1) * 255;
    fill(255, 100, 50, comboAlpha);
    textSize(sz(0.02));
    text(comboCount + "x COMBO", width * 0.5, sz(0.085));
  }

  textAlign(LEFT, TOP);
}

function drawButton2(x, y, w, h, label, bgCol, textCol, disabled) {
  let isHov = !disabled && mouseX > x - w / 2 && mouseX < x + w / 2 &&
    mouseY > y - h / 2 && mouseY < y + h / 2;

  push();
  rectMode(CENTER);
  // Shadow
  noStroke();
  fill(0, 0, 0, 30);
  rect(x, y + 3, w, h, sz(0.01));

  // Button
  if (disabled) {
    fill(150, 150, 150);
  } else if (isHov) {
    fill(bgCol[0] * 0.85, bgCol[1] * 0.85, bgCol[2] * 0.85);
  } else {
    fill(bgCol[0], bgCol[1], bgCol[2]);
  }
  rect(x, isHov ? y + 1 : y, w, h, sz(0.01));

  // Text
  fill(disabled ? [200, 200, 200] : textCol);
  textSize(sz(0.022));
  textAlign(CENTER, CENTER);
  textFont("Fredoka");
  text(label, x, isHov ? y + 1 : y);
  pop();

  return isHov;
}

function isInRect(mx, my, x, y, w, h) {
  return mx > x - w / 2 && mx < x + w / 2 && my > y - h / 2 && my < y + h / 2;
}

// --- TUTORIAL SYSTEM ---
function drawTutorial() {
  if (!showTutorial) return;
  tutorialArrowBounce += 0.08;

  let messages = [
    { text: "Welcome to your Cafe!\nBlooks will come to buy food!", x: width / 2, y: height * 0.35 },
    { text: "Tap a blook to serve them!\nThey pay you money!", x: width / 2, y: height * 0.55 },
    { text: "When food runs low,\ntap RESTOCK and solve math!", x: width / 2, y: height * 0.7 },
    { text: "Don't get math wrong -\nyou'll get a strike! 3 strikes = fired!", x: width / 2, y: height * 0.4 },
    { text: "After the day ends, use money\nto upgrade your cafe at night!", x: width / 2, y: height * 0.4 },
  ];

  if (tutorialStep >= messages.length) {
    showTutorial = false;
    return;
  }

  let msg = messages[tutorialStep];

  // Dim overlay
  fill(0, 0, 0, 80);
  rect(0, 0, width, height);

  // Message box
  let bw = sz(0.35);
  let bh = sz(0.12);
  fill(255, 255, 240);
  stroke(255, 180, 80);
  strokeWeight(3);
  rectMode(CENTER);
  rect(msg.x, msg.y, bw, bh, sz(0.015));
  noStroke();

  // Text
  fill(80, 60, 40);
  textSize(sz(0.02));
  textAlign(CENTER, CENTER);
  textFont("Fredoka");
  text(msg.text, msg.x, msg.y - sz(0.01));

  // Tap to continue
  fill(150, 130, 100);
  textSize(sz(0.014));
  text("Tap to continue", msg.x, msg.y + bh * 0.35);

  rectMode(CORNER);
}

// --- GAME STATE: MENU ---
function drawMenu() {
  // Warm background
  background(255, 245, 230);

  // Decorative pattern
  noStroke();
  for (let i = 0; i < 20; i++) {
    let x = (i * 137 + frameCount * 0.2) % (width + 100) - 50;
    let y = (i * 89) % height;
    let foodType = i % 4;
    push();
    translate(x, y);
    scale(0.5);
    fill(0, 0, 0, 8);
    drawFoodIcon(0, 0, sz(0.06), foodType);
    pop();
  }

  titleBounce += 0.03;
  menuBlookBounce += 0.06;

  // Title
  push();
  textFont("Fredoka");
  textAlign(CENTER, CENTER);

  // Title shadow
  let titleY = height * 0.22 + sin(titleBounce) * 8;
  fill(200, 150, 80, 80);
  textSize(sz(0.12));
  text("CAFE", width / 2 + 3, titleY + 3);

  // Title
  fill(220, 140, 50);
  text("CAFE", width / 2, titleY);

  // Subtitle
  fill(160, 120, 70);
  textSize(sz(0.025));
  text("A Math Learning Adventure!", width / 2, titleY + sz(0.09));
  pop();

  // Mascot blook
  push();
  let mascotX = width / 2;
  let mascotY = height * 0.48;
  let mascotSize = sz(0.12);

  // Draw a big cute blook
  translate(mascotX, mascotY + sin(menuBlookBounce) * 5);

  // Shadow
  fill(0, 0, 0, 20);
  ellipse(0, mascotSize * 0.45, mascotSize * 0.8, mascotSize * 0.15);

  // Body
  fill(255, 150, 200);
  ellipse(0, 0, mascotSize, mascotSize * 0.9);

  // Highlight
  fill(255, 255, 255, 60);
  ellipse(-mascotSize * 0.12, -mascotSize * 0.15, mascotSize * 0.25, mascotSize * 0.2);

  // Eyes
  fill(255);
  ellipse(-mascotSize * 0.15, -mascotSize * 0.08, mascotSize * 0.18, mascotSize * 0.18);
  ellipse(mascotSize * 0.15, -mascotSize * 0.08, mascotSize * 0.18, mascotSize * 0.18);
  fill(60, 40, 30);
  ellipse(-mascotSize * 0.15, -mascotSize * 0.06, mascotSize * 0.09, mascotSize * 0.09);
  ellipse(mascotSize * 0.15, -mascotSize * 0.06, mascotSize * 0.09, mascotSize * 0.09);
  // Shine
  fill(255, 255, 255, 200);
  ellipse(-mascotSize * 0.17, -mascotSize * 0.1, mascotSize * 0.05, mascotSize * 0.05);
  ellipse(mascotSize * 0.13, -mascotSize * 0.1, mascotSize * 0.05, mascotSize * 0.05);

  // Blush
  fill(255, 130, 130, 100);
  ellipse(-mascotSize * 0.25, mascotSize * 0.05, mascotSize * 0.12, mascotSize * 0.07);
  ellipse(mascotSize * 0.25, mascotSize * 0.05, mascotSize * 0.12, mascotSize * 0.07);

  // Big smile
  noFill();
  stroke(60, 40, 30);
  strokeWeight(mascotSize * 0.03);
  arc(0, mascotSize * 0.1, mascotSize * 0.3, mascotSize * 0.2, 0, PI);
  noStroke();

  // Chef hat
  fill(255);
  ellipse(0, -mascotSize * 0.4, mascotSize * 0.4, mascotSize * 0.35);
  ellipse(-mascotSize * 0.1, -mascotSize * 0.35, mascotSize * 0.25, mascotSize * 0.25);
  ellipse(mascotSize * 0.1, -mascotSize * 0.35, mascotSize * 0.25, mascotSize * 0.25);
  rect(-mascotSize * 0.2, -mascotSize * 0.3, mascotSize * 0.4, mascotSize * 0.1);

  // Feet
  fill(230, 130, 180);
  ellipse(-mascotSize * 0.2, mascotSize * 0.4, mascotSize * 0.18, mascotSize * 0.1);
  ellipse(mascotSize * 0.2, mascotSize * 0.4, mascotSize * 0.18, mascotSize * 0.1);

  pop();

  // Play button
  let btnW = sz(0.2);
  let btnH = sz(0.06);
  let btnY = height * 0.72;
  let btnPulse = 1 + sin(frameCount * 0.05) * 0.03;

  push();
  rectMode(CENTER);
  // Shadow
  fill(0, 0, 0, 30);
  rect(width / 2, btnY + 4, btnW * btnPulse, btnH * btnPulse, sz(0.015));
  // Button
  let isHov = isInRect(mouseX, mouseY, width / 2, btnY, btnW, btnH);
  fill(isHov ? [90, 190, 90] : [100, 210, 100]);
  rect(width / 2, isHov ? btnY + 1 : btnY, btnW * btnPulse, btnH * btnPulse, sz(0.015));
  // Text
  fill(255);
  textSize(sz(0.03));
  textFont("Fredoka");
  textAlign(CENTER, CENTER);
  text("PLAY!", width / 2, isHov ? btnY + 1 : btnY);
  pop();

  // Food icons at bottom
  let iconY = height * 0.88;
  for (let i = 0; i < 4; i++) {
    let ix = width * 0.25 + i * width * 0.17;
    let bounce = sin(frameCount * 0.04 + i * 1.5) * 5;
    drawFoodIcon(ix, iconY + bounce, sz(0.04), i);
  }

  // Credits
  textFont("Fredoka");
  textSize(sz(0.013));
  fill(180, 160, 130);
  textAlign(CENTER, CENTER);
  text("Serve blooks, solve math, upgrade your cafe!", width / 2, height * 0.95);
}

function handleMenuClick() {
  let btnW = sz(0.2);
  let btnH = sz(0.06);
  let btnY = height * 0.72;

  if (isInRect(mouseX, mouseY, width / 2, btnY, btnW, btnH)) {
    startNewGame();
  }
}

function startNewGame() {
  day = 1;
  money = 0;
  strikes = 0;
  foodUnlocked = [true, false, false, false];
  foodLevel = [0, 0, 0, 0];
  cafeLevel = 0;
  pantryLevel = [0, 0, 0, 0];
  blookLevel = 0;
  employeeCount = 0;
  employeeAssignments = [-1, -1, -1];
  foodStock = [getMaxStock(0), 0, 0, 0];
  blooks = [];
  particles = [];
  floatingTexts = [];
  coins = [];
  comboCount = 0;
  comboTimer = 0;
  comboMultiplier = 1;
  showTutorial = true;
  tutorialStep = 0;
  startDay();
}

// --- GAME STATE: DAY ---
function startDay() {
  gameState = "dayStart";
  dayStartTimer = 0;
  dayTimer = 0;
  dayDuration = getDayDuration();
  moneyEarnedToday = 0;
  blooksServedToday = 0;
  mathSolvedToday = 0;
  mathAttemptedToday = 0;
  strikes = 0;
  blooks = [];
  blookSpawnTimer = 0;
  blookSpawnInterval = getBlookSpawnInterval();
  comboCount = 0;
  comboTimer = 0;
  comboMultiplier = 1;
  employeeServeTimer = 0;
  spills = [];
  spillSpawnTimer = 0;

  // Ensure stock is initialized for unlocked foods
  for (let i = 0; i < 4; i++) {
    if (foodUnlocked[i] && foodStock[i] <= 0) {
      foodStock[i] = getMaxStock(i);
    }
  }
}

function drawDayStart() {
  drawCafeBackground();
  drawFoodStations();

  dayStartTimer += deltaTime / 1000;

  // "Day X" announcement
  let t = min(dayStartTimer / 1.5, 1);
  let sc = easeOutBack(t);
  let alpha = t < 0.7 ? 255 : lerp(255, 0, (t - 0.7) / 0.3);

  push();
  translate(width / 2, height * 0.4);
  scale(sc);
  textFont("Fredoka");
  textAlign(CENTER, CENTER);

  // Background card
  fill(255, 255, 240, alpha * 0.9);
  stroke(255, 180, 80, alpha);
  strokeWeight(3);
  rectMode(CENTER);
  rect(0, 0, sz(0.3), sz(0.12), sz(0.015));
  noStroke();

  // Text
  fill(220, 140, 50, alpha);
  textSize(sz(0.05));
  text("Day " + day, 0, -sz(0.01));

  fill(150, 120, 70, alpha);
  textSize(sz(0.018));
  if (day === 1) text("Good luck, Chef!", 0, sz(0.03));
  else if (day % 25 === 0) text("Milestone day!", 0, sz(0.03));
  else if (day === WIN_DAY) text("THE FINAL DAY!", 0, sz(0.03));
  else text("Let's cook!", 0, sz(0.03));

  pop();

  if (dayStartTimer > 2.0) {
    gameState = "day";
  }
}

function updateDay(dt) {
  dayTimer += dt;
  tutorialArrowBounce += 0.05;

  // Spawn blooks
  blookSpawnTimer += dt;
  if (blookSpawnTimer >= blookSpawnInterval && blooks.filter(b => b.state !== "gone").length < getMaxBlooksAtOnce()) {
    blookSpawnTimer = 0;
    let isVIP = random() < vipChance;
    blooks.push(new Blook(isVIP));
  }

  // Update blooks
  for (let i = blooks.length - 1; i >= 0; i--) {
    blooks[i].update(dt);
    if (blooks[i].state === "gone") {
      blooks.splice(i, 1);
    }
  }

  // Combo decay
  if (comboTimer > 0) {
    comboTimer -= dt;
    if (comboTimer <= 0) {
      comboCount = 0;
      comboMultiplier = 1;
    }
  }

  // Employee auto-serve (only at assigned stations)
  if (employeeCount > 0) {
    employeeServeTimer += dt;
    if (employeeServeTimer >= EMPLOYEE_SERVE_INTERVAL / employeeCount) {
      employeeServeTimer = 0;
      // Build set of stations that have employees
      let staffedStations = new Set();
      for (let a of employeeAssignments) {
        if (a >= 0) staffedStations.add(a);
      }
      // Find a waiting blook at a staffed station
      for (let b of blooks) {
        if (b.state === "waiting" && staffedStations.has(b.wantedFood) && foodStock[b.wantedFood] > 0) {
          b.serve();
          floatingTexts.push(new FloatingText(b.x, b.y - b.size * 1.2, "Auto!", [100, 150, 255]));
          break;
        }
      }
    }
  }

  // Update particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update(dt);
    if (particles[i].isDead()) particles.splice(i, 1);
  }
  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    floatingTexts[i].update();
    if (floatingTexts[i].isDead()) floatingTexts.splice(i, 1);
  }
  for (let i = coins.length - 1; i >= 0; i--) {
    coins[i].update();
    if (coins[i].isDead()) coins.splice(i, 1);
  }

  // Spill system
  spillSpawnTimer += dt;
  // Spills start after day 3, get more frequent with more food types
  let unlockedFoods = foodUnlocked.filter(f => f).length;
  let effectiveSpillInterval = spillSpawnInterval - unlockedFoods * 1.5 - day * 0.03;
  effectiveSpillInterval = max(effectiveSpillInterval, 5);

  if (day > 3 && spillSpawnTimer >= effectiveSpillInterval) {
    spillSpawnTimer = 0;
    // Only spill on a station that isn't already spilled
    let candidates = [];
    for (let i = 0; i < 4; i++) {
      if (foodUnlocked[i] && !spills.find(s => s.stationIndex === i)) {
        candidates.push(i);
      }
    }
    if (candidates.length > 0) {
      let idx = candidates[floor(random(candidates.length))];
      let stationPos = getStationPosition(idx);
      spills.push({
        stationIndex: idx,
        timer: SPILL_DURATION,
        maxTimer: SPILL_DURATION,
        x: stationPos.x,
        y: stationPos.y + sz(0.15),
        wobble: random(100)
      });
    }
  }

  // Update spills
  for (let i = spills.length - 1; i >= 0; i--) {
    spills[i].timer -= dt;
    spills[i].wobble += dt * 5;
    if (spills[i].timer <= 0) {
      spills.splice(i, 1);
    }
  }

  // Screen shake decay
  screenShake *= 0.9;

  // Day end (don't end while math overlay is showing — wait for it to close)
  if (dayTimer >= dayDuration && gameState !== "math") {
    endDay();
  }
}

function drawDay() {
  let dt = (deltaTime / 1000) * gameSpeed;
  updateDay(dt);

  push();
  if (screenShake > 0.5) {
    translate(random(-screenShake, screenShake), random(-screenShake, screenShake));
  }

  drawCafeBackground();
  drawFoodStations();
  drawSpills();

  // Draw blooks (sorted by y for depth)
  let sortedBlooks = blooks.slice().sort((a, b) => a.y - b.y);
  for (let b of sortedBlooks) {
    b.draw();
  }

  // Draw particles
  for (let p of particles) p.draw();
  for (let c of coins) c.draw();
  for (let ft of floatingTexts) ft.draw();

  pop();

  drawHUD();

  // Tutorial overlay
  if (showTutorial && day === 1) {
    drawTutorial();
  }
}

function endDay() {
  gameState = "dayEnd";
  dayEndTimer = 0;

  // Calculate star rating
  let maxBlooks = floor(dayDuration / blookSpawnInterval);
  let servePct = maxBlooks > 0 ? blooksServedToday / max(maxBlooks * 0.5, 1) : 0;
  let mathPct = mathAttemptedToday > 0 ? mathSolvedToday / mathAttemptedToday : 1;

  if (servePct >= 0.8 && mathPct >= 0.9) starRating = 3;
  else if (servePct >= 0.5 && mathPct >= 0.7) starRating = 2;
  else starRating = 1;

  // Check lose condition: no money earned
  if (moneyEarnedToday === 0 && day > 1) {
    gameOverReason = "Your cafe earned $0 today!\nThe landlord shut it down!";
    gameState = "gameover";
    return;
  }
}

function drawDayEnd() {
  dayEndTimer += deltaTime / 1000;

  drawCafeBackground();

  // Overlay
  fill(0, 0, 0, min(dayEndTimer * 200, 150));
  rect(0, 0, width, height);

  let cardT = min(dayEndTimer / 0.5, 1);
  let sc = easeOutBack(cardT);

  push();
  translate(width / 2, height * 0.42);
  scale(sc);

  // Card
  fill(255, 255, 240);
  stroke(255, 180, 80);
  strokeWeight(3);
  rectMode(CENTER);
  rect(0, 0, sz(0.4), sz(0.35), sz(0.02));
  noStroke();

  textFont("Fredoka");
  textAlign(CENTER, CENTER);

  // Title
  fill(220, 140, 50);
  textSize(sz(0.035));
  text("Day " + day + " Complete!", 0, -sz(0.12));

  // Stars
  for (let i = 0; i < 3; i++) {
    let starDelay = 0.5 + i * 0.2;
    if (dayEndTimer > starDelay) {
      let ssc = easeOutBack(min((dayEndTimer - starDelay) / 0.3, 1));
      push();
      translate(-sz(0.05) + i * sz(0.05), -sz(0.07));
      scale(ssc);
      fill(i < starRating ? [255, 215, 0] : [200, 200, 200]);
      textSize(sz(0.035));
      text("\u2605", 0, 0);
      pop();
    }
  }

  // Stats
  fill(100, 80, 60);
  textSize(sz(0.02));
  text("Money earned: $" + moneyEarnedToday, 0, -sz(0.02));
  text("Blooks served: " + blooksServedToday, 0, sz(0.015));
  text("Math solved: " + mathSolvedToday + "/" + mathAttemptedToday, 0, sz(0.05));

  // Confetti on 3 stars
  if (starRating === 3 && dayEndTimer > 1 && dayEndTimer < 1.1) {
    for (let i = 0; i < 30; i++) {
      particles.push(new ConfettiParticle(width / 2 + random(-100, 100), height * 0.3));
    }
  }

  pop();

  // Continue button (after delay)
  if (dayEndTimer > 1.5) {
    drawButton2(width / 2, height * 0.78, sz(0.2), sz(0.05),
      "Continue to Night", [80, 60, 120], [255, 255, 255]);
  }

  // Draw particles
  for (let p of particles) {
    p.update(deltaTime / 1000);
    p.draw();
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    if (particles[i].isDead()) particles.splice(i, 1);
  }
}

function handleDayEndClick() {
  if (dayEndTimer > 1.5) {
    if (isInRect(mouseX, mouseY, width / 2, height * 0.78, sz(0.2), sz(0.05))) {
      startNight();
    }
  }
}

// --- GAME STATE: MATH PROBLEM ---
function startMathProblem(foodIndex) {
  currentMathProblem = generateMathProblem();
  mathRestockTarget = foodIndex;
  mathAnswerSelected = -1;
  mathResultTimer = 0;
  mathCorrect = false;
  mathAttemptedToday++;
  gameState = "math";
}

function drawMathProblem() {
  // Day keeps running behind the math overlay!
  let dt = (deltaTime / 1000) * gameSpeed;
  updateDay(dt);

  // Draw the day scene behind (dimmed)
  push();
  if (screenShake > 0.5) {
    translate(random(-screenShake, screenShake), random(-screenShake, screenShake));
  }
  drawCafeBackground();
  drawFoodStations();
  drawSpills();
  let sortedBlooks = blooks.slice().sort((a, b) => a.y - b.y);
  for (let b of sortedBlooks) b.draw();
  for (let p of particles) p.draw();
  for (let c of coins) c.draw();
  for (let ft of floatingTexts) ft.draw();
  pop();

  drawHUD();

  // Dim overlay
  fill(0, 0, 0, 120);
  rect(0, 0, width, height);

  screenShake *= 0.9;

  if (!currentMathProblem) return;

  // Math card
  let cardW = sz(0.45);
  let cardH = sz(0.45);
  let cardX = width / 2;
  let cardY = height * 0.45;

  push();
  rectMode(CENTER);

  // Card background
  fill(255, 255, 245);
  stroke(255, 180, 80);
  strokeWeight(3);
  rect(cardX, cardY, cardW, cardH, sz(0.02));
  noStroke();

  // Header
  fill(255, 230, 200);
  rect(cardX, cardY - cardH * 0.38, cardW, cardH * 0.15, sz(0.02), sz(0.02), 0, 0);

  fill(200, 130, 50);
  textFont("Fredoka");
  textSize(sz(0.025));
  textAlign(CENTER, CENTER);
  text("Restock " + FOOD_TYPES[mathRestockTarget].name + "!", cardX, cardY - cardH * 0.38);

  // Question
  fill(80, 60, 40);
  textSize(sz(0.024));
  let lines = currentMathProblem.question.split("\n");
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], cardX, cardY - cardH * 0.18 + i * sz(0.032));
  }

  // Answer choices (2x2 grid)
  let btnW = cardW * 0.38;
  let btnH = sz(0.05);
  let gridStartY = cardY + cardH * 0.1;
  let gridSpacingX = cardW * 0.22;
  let gridSpacingY = sz(0.065);

  if (mathAnswerSelected === -1) {
    // Show clickable choices
    for (let i = 0; i < 4; i++) {
      let col = i % 2;
      let row = floor(i / 2);
      let bx = cardX + (col === 0 ? -gridSpacingX : gridSpacingX);
      let by = gridStartY + row * gridSpacingY;

      let colors = [
        [100, 180, 255], [255, 140, 100],
        [100, 210, 140], [220, 140, 255]
      ];

      let isHov = isInRect(mouseX, mouseY, bx, by, btnW, btnH);

      fill(0, 0, 0, 25);
      rect(bx, by + 3, btnW, btnH, sz(0.008));

      fill(isHov ? [colors[i][0] * 0.85, colors[i][1] * 0.85, colors[i][2] * 0.85] : colors[i]);
      rect(bx, isHov ? by + 1 : by, btnW, btnH, sz(0.008));

      fill(255);
      textSize(sz(0.028));
      text("$" + currentMathProblem.choices[i], bx, isHov ? by + 1 : by);
    }
  } else {
    // Show result
    mathResultTimer += deltaTime / 1000;

    for (let i = 0; i < 4; i++) {
      let col = i % 2;
      let row = floor(i / 2);
      let bx = cardX + (col === 0 ? -gridSpacingX : gridSpacingX);
      let by = gridStartY + row * gridSpacingY;

      let isCorrectChoice = currentMathProblem.choices[i] === currentMathProblem.answer;
      let isSelected = i === mathAnswerSelected;

      if (isCorrectChoice) {
        fill(80, 200, 80);
      } else if (isSelected && !mathCorrect) {
        fill(255, 80, 80);
      } else {
        fill(180, 180, 180);
      }
      rect(bx, by, btnW, btnH, sz(0.008));

      fill(255);
      textSize(sz(0.028));
      text("$" + currentMathProblem.choices[i], bx, by);

      if (isCorrectChoice) {
        fill(255, 255, 255, 200);
        textSize(sz(0.018));
        text("\u2713", bx + btnW * 0.35, by);
      }
      if (isSelected && !mathCorrect) {
        fill(255, 255, 255, 200);
        textSize(sz(0.018));
        text("\u2717", bx + btnW * 0.35, by);
      }
    }

    // Result message
    if (mathCorrect) {
      fill(80, 180, 80);
      textSize(sz(0.03));
      text("CORRECT!", cardX, cardY + cardH * 0.42);
    } else {
      fill(255, 80, 80);
      textSize(sz(0.025));
      text("Not quite! Answer: $" + currentMathProblem.answer, cardX, cardY + cardH * 0.42);
    }

    // Auto-close after delay
    if (mathResultTimer > 1.5) {
      closeMathProblem();
    }
  }

  rectMode(CORNER);
  pop();

  // Draw confetti particles (for correct answer)
  for (let p of particles) {
    p.update(deltaTime / 1000);
    p.draw();
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    if (particles[i].isDead()) particles.splice(i, 1);
  }
}

function handleMathClick() {
  if (!currentMathProblem || mathAnswerSelected !== -1) return;

  let cardW = sz(0.45);
  let cardH = sz(0.45);
  let cardX = width / 2;
  let cardY = height * 0.45;
  let btnW = cardW * 0.38;
  let btnH = sz(0.05);
  let gridStartY = cardY + cardH * 0.1;
  let gridSpacingX = cardW * 0.22;
  let gridSpacingY = sz(0.065);

  for (let i = 0; i < 4; i++) {
    let col = i % 2;
    let row = floor(i / 2);
    let bx = cardX + (col === 0 ? -gridSpacingX : gridSpacingX);
    let by = gridStartY + row * gridSpacingY;

    if (isInRect(mouseX, mouseY, bx, by, btnW, btnH)) {
      mathAnswerSelected = i;
      mathCorrect = currentMathProblem.choices[i] === currentMathProblem.answer;

      if (mathCorrect) {
        // Restock food (fills half the max — gotta restock often!)
        let maxSt = getMaxStock(mathRestockTarget);
        let restockAmount = ceil(maxSt / 2);
        foodStock[mathRestockTarget] = min(foodStock[mathRestockTarget] + restockAmount, maxSt);
        mathSolvedToday++;

        // Confetti
        for (let j = 0; j < 20; j++) {
          particles.push(new ConfettiParticle(width / 2 + random(-80, 80), height * 0.35));
        }
      } else {
        // Strike!
        strikes++;
        screenShake = 15;

        if (strikes >= maxStrikesPerDay) {
          // Fired!
          setTimeout(() => {
            gameOverReason = "You got " + maxStrikesPerDay + " math problems wrong!\nThe Math Inspector shut down your cafe!";
            gameState = "gameover";
          }, 1500);
        }
      }

      mathResultTimer = 0;
      break;
    }
  }
}

function closeMathProblem() {
  currentMathProblem = null;
  mathRestockTarget = -1;
  mathAnswerSelected = -1;
  if (gameState === "math") {
    gameState = "day";
  }
}

// --- GAME STATE: NIGHT ---
function startNight() {
  gameState = "night";
  nightTab = 0;
  nightScrollY = 0;
  purchaseFlash = 0;

  // Pay employee salaries
  let totalSalary = employeeCount * EMPLOYEE_SALARY;
  if (totalSalary > 0) {
    if (money >= totalSalary) {
      money -= totalSalary;
      floatingTexts.push(new FloatingText(width / 2, height * 0.5,
        "Salaries paid: -$" + totalSalary, [255, 100, 100]));
    } else {
      // Can't pay - all employees quit
      let firedCount = employeeCount;
      employeeCount = 0;
      employeeAssignments = [-1, -1, -1];
      money = max(0, money);
      floatingTexts.push(new FloatingText(width / 2, height * 0.5,
        firedCount + " employee(s) quit!", [255, 80, 80], true));
    }
  }

  // Check win condition
  allMaxed = checkAllMaxed();
  if (allMaxed && day >= WIN_DAY) {
    gameState = "win";
  }
}

function drawNight() {
  // Night background
  background(30, 25, 50);

  // Stars
  fill(255, 255, 230);
  for (let i = 0; i < 30; i++) {
    let sx = (i * 137 + 50) % width;
    let sy = (i * 89 + 20) % (height * 0.25);
    let ss = sz(0.003) + sin(frameCount * 0.03 + i * 0.7) * sz(0.001);
    ellipse(sx, sy, ss, ss);
  }

  // Moon
  fill(240, 240, 220);
  ellipse(width * 0.85, height * 0.08, sz(0.04), sz(0.04));
  fill(30, 25, 50);
  ellipse(width * 0.85 + sz(0.008), height * 0.08 - sz(0.005), sz(0.032), sz(0.032));

  // Building silhouette
  fill(20, 18, 40);
  rect(0, height * 0.2, width, height);

  // Cafe interior (warm glow)
  fill(50, 40, 35);
  rect(width * 0.05, height * 0.22, width * 0.9, height * 0.75, sz(0.01));

  // Warm interior glow
  fill(60, 50, 40);
  rect(width * 0.07, height * 0.24, width * 0.86, height * 0.71, sz(0.008));

  // Title
  textFont("Fredoka");
  textAlign(CENTER, CENTER);
  fill(255, 220, 150);
  textSize(sz(0.035));
  text("Night - Upgrade Shop", width / 2, height * 0.28);

  // Money display
  fill(255, 215, 0);
  textSize(sz(0.025));
  text("$" + money, width / 2, height * 0.33);

  // Day counter
  fill(200, 180, 150);
  textSize(sz(0.016));
  text("Day " + day + " / " + WIN_DAY, width / 2, height * 0.365);

  // Tabs
  let tabs = ["Food", "Cafe", "Pantry", "Blooks", "Staff"];
  let tabW = width * 0.86 / tabs.length;
  let tabY = height * 0.4;
  let tabH = sz(0.04);

  for (let i = 0; i < tabs.length; i++) {
    let tx = width * 0.07 + i * tabW;
    let isActive = nightTab === i;
    let isHov = mouseX > tx && mouseX < tx + tabW && mouseY > tabY && mouseY < tabY + tabH;

    fill(isActive ? [255, 180, 80] : isHov ? [80, 70, 60] : [60, 50, 40]);
    rect(tx, tabY, tabW - 2, tabH, sz(0.005), sz(0.005), 0, 0);

    fill(isActive ? [60, 40, 20] : [200, 180, 150]);
    textSize(sz(0.016));
    textAlign(CENTER, CENTER);
    text(tabs[i], tx + tabW / 2, tabY + tabH / 2);
  }

  // Content area
  let contentY = tabY + tabH + sz(0.01);
  let contentH = height * 0.88 - contentY;
  let contentW = width * 0.86;
  let contentX = width * 0.07;

  fill(45, 38, 32);
  rect(contentX, contentY, contentW, contentH, 0, 0, sz(0.008), sz(0.008));

  // Clip content area (fake clip by drawing over)
  push();

  switch (nightTab) {
    case 0: drawNightFood(contentX, contentY, contentW, contentH); break;
    case 1: drawNightCafe(contentX, contentY, contentW, contentH); break;
    case 2: drawNightPantry(contentX, contentY, contentW, contentH); break;
    case 3: drawNightBlooks(contentX, contentY, contentW, contentH); break;
    case 4: drawNightStaff(contentX, contentY, contentW, contentH); break;
  }

  pop();

  // Next Day button
  let ndBtnW = sz(0.2);
  let ndBtnH = sz(0.05);
  let ndBtnY = height * 0.94;
  drawButton2(width / 2, ndBtnY, ndBtnW, ndBtnH, "Next Day \u2192", [100, 180, 100], [255, 255, 255]);

  // Purchase flash effect
  if (purchaseFlash > 0) {
    fill(255, 215, 0, purchaseFlash);
    rect(0, 0, width, height);
    purchaseFlash -= 5;
  }

  // Floating texts
  for (let ft of floatingTexts) {
    ft.update();
    ft.draw();
  }
  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    if (floatingTexts[i].isDead()) floatingTexts.splice(i, 1);
  }
}

function drawNightFood(cx, cy, cw, ch) {
  let y = cy + sz(0.02);
  let itemH = sz(0.07);

  for (let i = 0; i < 4; i++) {
    let ix = cx + sz(0.02);
    let iy = y + i * (itemH + sz(0.01));

    if (iy + itemH > cy + ch) break;

    // Item background
    fill(55, 48, 42);
    rect(ix, iy, cw - sz(0.04), itemH, sz(0.008));

    // Food icon
    drawFoodIcon(ix + sz(0.04), iy + itemH / 2, sz(0.04), i);

    // Food name
    textFont("Fredoka");
    textAlign(LEFT, CENTER);

    if (!foodUnlocked[i]) {
      // Locked - show unlock option
      fill(180, 160, 140);
      textSize(sz(0.02));
      text(FOOD_TYPES[i].name, ix + sz(0.08), iy + itemH * 0.3);

      fill(150, 140, 120);
      textSize(sz(0.014));
      text("Locked", ix + sz(0.08), iy + itemH * 0.65);

      // Unlock button
      let btnX = ix + cw - sz(0.16);
      let btnY2 = iy + itemH / 2;
      let canAfford = money >= FOOD_TYPES[i].unlockCost;
      drawButton2(btnX, btnY2, sz(0.12), sz(0.035),
        "Unlock $" + FOOD_TYPES[i].unlockCost,
        canAfford ? [100, 180, 100] : [100, 100, 100],
        [255, 255, 255], !canAfford);
    } else {
      // Unlocked - show upgrade
      fill(255, 220, 150);
      textSize(sz(0.02));
      text(FOOD_TYPES[i].name, ix + sz(0.08), iy + itemH * 0.3);

      fill(180, 160, 130);
      textSize(sz(0.014));
      text("Price: $" + getFoodPrice(i) + "  |  Level " + foodLevel[i] + "/" + MAX_UPGRADE_LEVEL,
        ix + sz(0.08), iy + itemH * 0.65);

      // Level dots
      for (let l = 0; l < MAX_UPGRADE_LEVEL; l++) {
        fill(l < foodLevel[i] ? [255, 180, 80] : [80, 70, 60]);
        ellipse(ix + sz(0.24) + l * sz(0.015), iy + itemH * 0.65, sz(0.008), sz(0.008));
      }

      if (foodLevel[i] < MAX_UPGRADE_LEVEL) {
        let cost = UPGRADE_COSTS.foodPrice[foodLevel[i]];
        let canAfford = money >= cost;
        let btnX = ix + cw - sz(0.16);
        drawButton2(btnX, iy + itemH / 2, sz(0.12), sz(0.035),
          "Upgrade $" + cost,
          canAfford ? [100, 180, 255] : [100, 100, 100],
          [255, 255, 255], !canAfford);
      } else {
        fill(255, 215, 0);
        textSize(sz(0.016));
        textAlign(RIGHT, CENTER);
        text("MAX!", ix + cw - sz(0.06), iy + itemH / 2);
      }
    }
  }
  textAlign(LEFT, TOP);
}

function drawNightCafe(cx, cy, cw, ch) {
  let y = cy + sz(0.03);

  // Cafe level display
  textFont("Fredoka");
  textAlign(CENTER, CENTER);
  fill(255, 220, 150);
  textSize(sz(0.025));
  text("Cafe Level: " + cafeLevel + "/" + MAX_UPGRADE_LEVEL, cx + cw / 2, y);

  // Level dots
  for (let l = 0; l < MAX_UPGRADE_LEVEL; l++) {
    fill(l < cafeLevel ? [255, 180, 80] : [80, 70, 60]);
    ellipse(cx + cw / 2 - sz(0.05) + l * sz(0.025), y + sz(0.025), sz(0.012), sz(0.012));
  }

  // Description
  fill(180, 160, 130);
  textSize(sz(0.016));
  let descriptions = [
    "Basic cafe. Upgrade to attract more blooks!",
    "Flower pots added! Blooks come a bit faster.",
    "Menu board on the wall! More blooks visit.",
    "Pendant lights! Your cafe looks amazing!",
    "Picture frames! Almost a 5-star cafe!",
    "MAX LEVEL! The fanciest cafe in town!"
  ];
  text(descriptions[min(cafeLevel, 5)], cx + cw / 2, y + sz(0.06));

  // Effects
  fill(150, 140, 120);
  textSize(sz(0.014));
  text("Effect: More blooks visit your cafe", cx + cw / 2, y + sz(0.09));
  text("Current capacity: " + getMaxBlooksAtOnce() + " blooks at once", cx + cw / 2, y + sz(0.11));

  // Upgrade button
  if (cafeLevel < MAX_UPGRADE_LEVEL) {
    let cost = UPGRADE_COSTS.cafe[cafeLevel];
    let canAfford = money >= cost;
    drawButton2(cx + cw / 2, y + sz(0.16), sz(0.18), sz(0.045),
      "Upgrade Cafe $" + cost,
      canAfford ? [100, 180, 255] : [100, 100, 100],
      [255, 255, 255], !canAfford);
  } else {
    fill(255, 215, 0);
    textSize(sz(0.025));
    text("\u2605 MAXED OUT! \u2605", cx + cw / 2, y + sz(0.16));
  }
}

function drawNightPantry(cx, cy, cw, ch) {
  let y = cy + sz(0.02);
  let itemH = sz(0.07);

  textFont("Fredoka");
  textAlign(CENTER, CENTER);
  fill(255, 220, 150);
  textSize(sz(0.02));
  text("Upgrade pantry storage per food item", cx + cw / 2, y);

  y += sz(0.03);

  for (let i = 0; i < 4; i++) {
    let ix = cx + sz(0.02);
    let iy = y + i * (itemH + sz(0.01));

    if (iy + itemH > cy + ch) break;

    // Item background
    fill(55, 48, 42);
    rect(ix, iy, cw - sz(0.04), itemH, sz(0.008));

    // Food icon
    drawFoodIcon(ix + sz(0.04), iy + itemH / 2, sz(0.04), i);

    textFont("Fredoka");
    textAlign(LEFT, CENTER);

    if (!foodUnlocked[i]) {
      fill(120, 110, 100);
      textSize(sz(0.018));
      text(FOOD_TYPES[i].name + " (locked)", ix + sz(0.08), iy + itemH / 2);
    } else {
      // Food name
      fill(255, 220, 150);
      textSize(sz(0.02));
      text(FOOD_TYPES[i].name, ix + sz(0.08), iy + itemH * 0.3);

      // Stock info
      fill(180, 160, 130);
      textSize(sz(0.014));
      text("Max stock: " + getMaxStock(i) + "  |  Level " + pantryLevel[i] + "/" + MAX_UPGRADE_LEVEL,
        ix + sz(0.08), iy + itemH * 0.65);

      // Level dots
      for (let l = 0; l < MAX_UPGRADE_LEVEL; l++) {
        fill(l < pantryLevel[i] ? [255, 180, 80] : [80, 70, 60]);
        ellipse(ix + sz(0.26) + l * sz(0.015), iy + itemH * 0.65, sz(0.008), sz(0.008));
      }

      if (pantryLevel[i] < MAX_UPGRADE_LEVEL) {
        let cost = UPGRADE_COSTS.pantry[pantryLevel[i]];
        let canAfford = money >= cost;
        let btnX = ix + cw - sz(0.16);
        drawButton2(btnX, iy + itemH / 2, sz(0.12), sz(0.035),
          "Upgrade $" + cost,
          canAfford ? [100, 180, 255] : [100, 100, 100],
          [255, 255, 255], !canAfford);
      } else {
        fill(255, 215, 0);
        textSize(sz(0.016));
        textAlign(RIGHT, CENTER);
        text("MAX!", ix + cw - sz(0.06), iy + itemH / 2);
      }
    }
  }
  textAlign(LEFT, TOP);
}

function drawNightBlooks(cx, cy, cw, ch) {
  let y = cy + sz(0.03);

  textFont("Fredoka");
  textAlign(CENTER, CENTER);
  fill(255, 220, 150);
  textSize(sz(0.025));
  text("Blook Level: " + blookLevel + "/" + MAX_UPGRADE_LEVEL, cx + cw / 2, y);

  for (let l = 0; l < MAX_UPGRADE_LEVEL; l++) {
    fill(l < blookLevel ? [255, 180, 80] : [80, 70, 60]);
    ellipse(cx + cw / 2 - sz(0.05) + l * sz(0.025), y + sz(0.025), sz(0.012), sz(0.012));
  }

  fill(180, 160, 130);
  textSize(sz(0.016));
  text("Upgraded blooks are hungrier and tip more!", cx + cw / 2, y + sz(0.06));

  fill(150, 140, 120);
  textSize(sz(0.014));
  text("Current patience: " + getBlookPatience() + " seconds", cx + cw / 2, y + sz(0.09));
  text("Current tips: +$" + getBlookTip() + " per blook", cx + cw / 2, y + sz(0.11));

  // Show example blook
  push();
  translate(cx + cw / 2, y + sz(0.18));
  let exSize = sz(0.05);
  fill(255, 150, 200);
  ellipse(0, 0, exSize, exSize * 0.9);
  fill(255, 255, 255, 60);
  ellipse(-exSize * 0.12, -exSize * 0.1, exSize * 0.2, exSize * 0.15);
  fill(255);
  ellipse(-exSize * 0.13, -exSize * 0.05, exSize * 0.14, exSize * 0.14);
  ellipse(exSize * 0.13, -exSize * 0.05, exSize * 0.14, exSize * 0.14);
  fill(60, 40, 30);
  ellipse(-exSize * 0.13, -exSize * 0.04, exSize * 0.07, exSize * 0.07);
  ellipse(exSize * 0.13, -exSize * 0.04, exSize * 0.07, exSize * 0.07);
  noFill();
  stroke(60, 40, 30);
  strokeWeight(exSize * 0.03);
  arc(0, exSize * 0.1, exSize * 0.2, exSize * 0.15, 0, PI);
  noStroke();
  pop();

  if (blookLevel < MAX_UPGRADE_LEVEL) {
    let cost = UPGRADE_COSTS.blook[blookLevel];
    let canAfford = money >= cost;
    drawButton2(cx + cw / 2, y + sz(0.26), sz(0.18), sz(0.045),
      "Upgrade Blooks $" + cost,
      canAfford ? [100, 180, 255] : [100, 100, 100],
      [255, 255, 255], !canAfford);
  } else {
    fill(255, 215, 0);
    textSize(sz(0.025));
    text("\u2605 MAXED OUT! \u2605", cx + cw / 2, y + sz(0.26));
  }
}

function drawEmployeeIcon(x, y, s) {
  fill(100, 180, 255);
  ellipse(x, y, s, s);
  fill(255);
  ellipse(x - s * 0.17, y - s * 0.1, s * 0.22, s * 0.22);
  ellipse(x + s * 0.17, y - s * 0.1, s * 0.22, s * 0.22);
  fill(60, 40, 30);
  ellipse(x - s * 0.17, y - s * 0.08, s * 0.11, s * 0.11);
  ellipse(x + s * 0.17, y - s * 0.08, s * 0.11, s * 0.11);
  noFill();
  stroke(60, 40, 30);
  strokeWeight(s * 0.06);
  arc(x, y + s * 0.15, s * 0.3, s * 0.2, 0, PI);
  noStroke();
  // Hat
  fill(80, 60, 140);
  arc(x, y - s * 0.35, s * 0.8, s * 0.5, PI, TWO_PI);
  rect(x - s * 0.5, y - s * 0.37, s, s * 0.08);
}

function drawNightStaff(cx, cy, cw, ch) {
  let y = cy + sz(0.02);

  textFont("Fredoka");
  textAlign(CENTER, CENTER);
  fill(255, 220, 150);
  textSize(sz(0.02));
  text("Hire employees and assign them to food stations", cx + cw / 2, y);

  fill(150, 140, 120);
  textSize(sz(0.013));
  text("Salary: $" + EMPLOYEE_SALARY + "/employee/night" +
    (employeeCount > 0 ? "  |  Total: $" + (employeeCount * EMPLOYEE_SALARY) + "/night" : ""),
    cx + cw / 2, y + sz(0.025));

  let slotY = y + sz(0.05);
  let slotH = sz(0.08);

  for (let i = 0; i < MAX_EMPLOYEES; i++) {
    let sy = slotY + i * (slotH + sz(0.01));
    let hired = employeeAssignments[i] >= 0;

    // Slot background
    fill(hired ? [55, 55, 45] : [50, 45, 40]);
    rect(cx + sz(0.02), sy, cw - sz(0.04), slotH, sz(0.008));

    let slotX = cx + sz(0.02);

    if (!hired) {
      // Not hired — show hire button
      fill(120, 110, 100);
      textSize(sz(0.018));
      textAlign(LEFT, CENTER);
      text("Employee " + (i + 1) + " — Not hired", slotX + sz(0.06), sy + slotH / 2);

      // Empty icon
      fill(80, 70, 60);
      ellipse(slotX + sz(0.035), sy + slotH / 2, sz(0.035), sz(0.035));
      fill(120, 110, 100);
      textAlign(CENTER, CENTER);
      textSize(sz(0.02));
      text("?", slotX + sz(0.035), sy + slotH / 2);

      let canAfford = money >= UPGRADE_COSTS.employeeHire;
      drawButton2(slotX + cw - sz(0.14), sy + slotH / 2, sz(0.12), sz(0.035),
        "Hire $" + UPGRADE_COSTS.employeeHire,
        canAfford ? [100, 180, 100] : [100, 100, 100],
        [255, 255, 255], !canAfford);
    } else {
      // Hired — show employee icon + assigned station + reassign buttons
      drawEmployeeIcon(slotX + sz(0.035), sy + slotH / 2, sz(0.035));

      textAlign(LEFT, CENTER);
      fill(255, 220, 150);
      textSize(sz(0.016));
      text("Employee " + (i + 1), slotX + sz(0.065), sy + slotH * 0.3);

      // Show assigned station
      let assignedFood = employeeAssignments[i];
      fill(180, 160, 130);
      textSize(sz(0.013));
      text("Assigned to:", slotX + sz(0.065), sy + slotH * 0.65);

      // Draw food assignment buttons (one per unlocked food)
      let btnStartX = slotX + sz(0.16);
      let btnSize = sz(0.032);
      let bi = 0;
      for (let f = 0; f < 4; f++) {
        if (!foodUnlocked[f]) continue;
        let bx = btnStartX + bi * (btnSize + sz(0.008));
        let by = sy + slotH * 0.65;
        let isAssigned = assignedFood === f;

        // Button bg
        fill(isAssigned ? FOOD_TYPES[f].color : [70, 60, 55]);
        if (isAssigned) {
          stroke(255, 220, 100);
          strokeWeight(2);
        }
        rectMode(CENTER);
        rect(bx, by, btnSize, btnSize * 0.8, sz(0.004));
        noStroke();
        rectMode(CORNER);

        // Food icon (small)
        drawFoodIcon(bx, by, btnSize * 0.65, f);
        bi++;
      }
    }
  }

  // Warning about salary
  let warningY = slotY + MAX_EMPLOYEES * (slotH + sz(0.01)) + sz(0.01);
  if (employeeCount > 0) {
    let totalSalary = employeeCount * EMPLOYEE_SALARY;
    if (money < totalSalary * 2) {
      fill(255, 150, 80);
      textSize(sz(0.013));
      textAlign(CENTER, CENTER);
      text("Warning: Low funds! Employees may quit!", cx + cw / 2, warningY);
    }
  }
}

function handleNightClick() {
  // Tab clicks
  let tabs = ["Food", "Cafe", "Pantry", "Blooks", "Staff"];
  let tabW = width * 0.86 / tabs.length;
  let tabY = height * 0.4;
  let tabH = sz(0.04);

  for (let i = 0; i < tabs.length; i++) {
    let tx = width * 0.07 + i * tabW;
    if (mouseX > tx && mouseX < tx + tabW && mouseY > tabY && mouseY < tabY + tabH) {
      nightTab = i;
      return;
    }
  }

  // Next day button
  let ndBtnW = sz(0.2);
  let ndBtnH = sz(0.05);
  let ndBtnY = height * 0.94;
  if (isInRect(mouseX, mouseY, width / 2, ndBtnY, ndBtnW, ndBtnH)) {
    day++;
    if (allMaxed && day > WIN_DAY) {
      gameState = "win";
    } else {
      startDay();
    }
    return;
  }

  // Content area clicks
  let contentTabY = tabY + tabH + sz(0.01);
  let contentW = width * 0.86;
  let contentX = width * 0.07;

  switch (nightTab) {
    case 0: handleNightFoodClick(contentX, contentTabY, contentW); break;
    case 1: handleNightCafeClick(contentX, contentTabY, contentW); break;
    case 2: handleNightPantryClick(contentX, contentTabY, contentW); break;
    case 3: handleNightBlooksClick(contentX, contentTabY, contentW); break;
    case 4: handleNightStaffClick(contentX, contentTabY, contentW); break;
  }
}

function handleNightFoodClick(cx, cy, cw) {
  let y = cy + sz(0.02);
  let itemH = sz(0.07);

  for (let i = 0; i < 4; i++) {
    let ix = cx + sz(0.02);
    let iy = y + i * (itemH + sz(0.01));
    let btnX = ix + cw - sz(0.16);
    let btnY = iy + itemH / 2;

    if (isInRect(mouseX, mouseY, btnX, btnY, sz(0.12), sz(0.035))) {
      if (!foodUnlocked[i]) {
        // Unlock
        if (money >= FOOD_TYPES[i].unlockCost) {
          money -= FOOD_TYPES[i].unlockCost;
          foodUnlocked[i] = true;
          foodStock[i] = getMaxStock(i);
          purchaseFlash = 100;
          floatingTexts.push(new FloatingText(width / 2, height * 0.5,
            FOOD_TYPES[i].name + " Unlocked!", [100, 255, 100], true));
          // Confetti
          for (let j = 0; j < 15; j++) {
            particles.push(new ConfettiParticle(width / 2 + random(-100, 100), height * 0.4));
          }
        }
      } else if (foodLevel[i] < MAX_UPGRADE_LEVEL) {
        // Upgrade
        let cost = UPGRADE_COSTS.foodPrice[foodLevel[i]];
        if (money >= cost) {
          money -= cost;
          foodLevel[i]++;
          purchaseFlash = 60;
          floatingTexts.push(new FloatingText(width / 2, height * 0.5,
            FOOD_TYPES[i].name + " upgraded!", [100, 200, 255]));
        }
      }
      return;
    }
  }
}

function handleNightCafeClick(cx, cy, cw) {
  let y = cy + sz(0.03);
  if (cafeLevel < MAX_UPGRADE_LEVEL) {
    if (isInRect(mouseX, mouseY, cx + cw / 2, y + sz(0.16), sz(0.18), sz(0.045))) {
      let cost = UPGRADE_COSTS.cafe[cafeLevel];
      if (money >= cost) {
        money -= cost;
        cafeLevel++;
        purchaseFlash = 80;
        floatingTexts.push(new FloatingText(width / 2, height * 0.5,
          "Cafe upgraded to Level " + cafeLevel + "!", [100, 200, 255], true));
        for (let j = 0; j < 10; j++) {
          particles.push(new ConfettiParticle(width / 2 + random(-80, 80), height * 0.4));
        }
      }
    }
  }
}

function handleNightPantryClick(cx, cy, cw) {
  let y = cy + sz(0.02) + sz(0.03);
  let itemH = sz(0.07);

  for (let i = 0; i < 4; i++) {
    if (!foodUnlocked[i]) continue;
    let ix = cx + sz(0.02);
    let iy = y + i * (itemH + sz(0.01));
    let btnX = ix + cw - sz(0.16);
    let btnY = iy + itemH / 2;

    if (pantryLevel[i] < MAX_UPGRADE_LEVEL && isInRect(mouseX, mouseY, btnX, btnY, sz(0.12), sz(0.035))) {
      let cost = UPGRADE_COSTS.pantry[pantryLevel[i]];
      if (money >= cost) {
        money -= cost;
        pantryLevel[i]++;
        // Refill this food's stock to new max
        foodStock[i] = getMaxStock(i);
        purchaseFlash = 80;
        floatingTexts.push(new FloatingText(width / 2, height * 0.5,
          FOOD_TYPES[i].name + " pantry upgraded! Max: " + getMaxStock(i), [100, 200, 255]));
      }
      return;
    }
  }
}

function handleNightBlooksClick(cx, cy, cw) {
  let y = cy + sz(0.03);
  if (blookLevel < MAX_UPGRADE_LEVEL) {
    if (isInRect(mouseX, mouseY, cx + cw / 2, y + sz(0.26), sz(0.18), sz(0.045))) {
      let cost = UPGRADE_COSTS.blook[blookLevel];
      if (money >= cost) {
        money -= cost;
        blookLevel++;
        purchaseFlash = 80;
        floatingTexts.push(new FloatingText(width / 2, height * 0.5,
          "Blooks upgraded! Tips: +$" + getBlookTip(), [100, 200, 255]));
      }
    }
  }
}

function handleNightStaffClick(cx, cy, cw) {
  let y = cy + sz(0.02);
  let slotY = y + sz(0.05);
  let slotH = sz(0.08);

  for (let i = 0; i < MAX_EMPLOYEES; i++) {
    let sy = slotY + i * (slotH + sz(0.01));
    let hired = employeeAssignments[i] >= 0;
    let slotX = cx + sz(0.02);

    if (!hired) {
      // Hire button
      let btnX = slotX + cw - sz(0.14);
      let btnY = sy + slotH / 2;
      if (isInRect(mouseX, mouseY, btnX, btnY, sz(0.12), sz(0.035))) {
        if (money >= UPGRADE_COSTS.employeeHire) {
          money -= UPGRADE_COSTS.employeeHire;
          // Auto-assign to first unlocked food without an employee
          let assignTo = 0;
          for (let f = 0; f < 4; f++) {
            if (foodUnlocked[f] && !employeeAssignments.includes(f)) {
              assignTo = f;
              break;
            }
          }
          // Fallback: assign to first unlocked food
          if (!foodUnlocked[assignTo]) {
            for (let f = 0; f < 4; f++) {
              if (foodUnlocked[f]) { assignTo = f; break; }
            }
          }
          employeeAssignments[i] = assignTo;
          employeeCount++;
          purchaseFlash = 80;
          floatingTexts.push(new FloatingText(width / 2, height * 0.5,
            "Employee hired for " + FOOD_TYPES[assignTo].name + "!", [100, 255, 100], true));
        }
        return;
      }
    } else {
      // Reassign buttons — check food station clicks
      let btnStartX = slotX + sz(0.16);
      let btnSize = sz(0.032);
      let bi = 0;
      for (let f = 0; f < 4; f++) {
        if (!foodUnlocked[f]) continue;
        let bx = btnStartX + bi * (btnSize + sz(0.008));
        let by = sy + slotH * 0.65;
        if (isInRect(mouseX, mouseY, bx, by, btnSize, btnSize * 0.8)) {
          employeeAssignments[i] = f;
          floatingTexts.push(new FloatingText(width / 2, height * 0.5,
            "Employee " + (i + 1) + " assigned to " + FOOD_TYPES[f].name, [100, 200, 255]));
          return;
        }
        bi++;
      }
    }
  }
}

// --- GAME STATE: GAME OVER ---
function drawGameOver() {
  background(40, 20, 20);

  // Sad blook
  push();
  translate(width / 2, height * 0.32);
  let s = sz(0.1);
  let wobble = sin(frameCount * 0.03) * 3;
  translate(wobble, 0);

  fill(0, 0, 0, 20);
  ellipse(0, s * 0.45, s * 0.8, s * 0.15);

  fill(180, 180, 200);
  ellipse(0, 0, s, s * 0.9);
  fill(255, 255, 255, 40);
  ellipse(-s * 0.12, -s * 0.15, s * 0.2, s * 0.15);

  // Sad eyes
  fill(255);
  ellipse(-s * 0.14, -s * 0.08, s * 0.16, s * 0.16);
  ellipse(s * 0.14, -s * 0.08, s * 0.16, s * 0.16);
  fill(60, 40, 30);
  ellipse(-s * 0.14, -s * 0.04, s * 0.08, s * 0.08);
  ellipse(s * 0.14, -s * 0.04, s * 0.08, s * 0.08);

  // Tear
  fill(100, 180, 255, 180);
  ellipse(s * 0.22, s * 0.05 + sin(frameCount * 0.05) * 3, s * 0.05, s * 0.07);

  // Sad mouth
  noFill();
  stroke(60, 40, 30);
  strokeWeight(s * 0.03);
  arc(0, s * 0.18, s * 0.2, s * 0.12, PI, TWO_PI);
  noStroke();
  pop();

  // Text
  textFont("Fredoka");
  textAlign(CENTER, CENTER);

  fill(255, 100, 100);
  textSize(sz(0.05));
  text("Cafe Closed!", width / 2, height * 0.5);

  fill(200, 180, 170);
  textSize(sz(0.02));
  let lines = gameOverReason.split("\n");
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], width / 2, height * 0.57 + i * sz(0.03));
  }

  // Stats
  fill(180, 160, 150);
  textSize(sz(0.018));
  text("You lasted " + day + " days!", width / 2, height * 0.68);
  text("Total money earned: $" + money, width / 2, height * 0.72);

  // Encouragement
  fill(255, 200, 100);
  textSize(sz(0.016));
  text("Don't give up! Every great chef starts somewhere!", width / 2, height * 0.78);

  // Try again button
  drawButton2(width / 2, height * 0.87, sz(0.2), sz(0.055),
    "Try Again!", [255, 130, 80], [255, 255, 255]);
}

function handleGameOverClick() {
  if (isInRect(mouseX, mouseY, width / 2, height * 0.87, sz(0.2), sz(0.055))) {
    gameState = "menu";
  }
}

// --- GAME STATE: WIN ---
function drawWin() {
  // Rainbow-ish background
  let hue = (frameCount * 0.5) % 360;
  colorMode(HSB, 360, 100, 100, 100);
  background(hue, 15, 95);
  colorMode(RGB, 255, 255, 255, 255);

  // Confetti constantly
  if (frameCount % 3 === 0) {
    particles.push(new ConfettiParticle(random(width), -20));
  }

  // Happy blook with crown
  push();
  translate(width / 2, height * 0.3);
  let s = sz(0.12);
  let bounce = sin(frameCount * 0.05) * 5;
  translate(0, bounce);

  fill(0, 0, 0, 20);
  ellipse(0, s * 0.5, s * 0.9, s * 0.15);

  fill(255, 180, 100);
  ellipse(0, 0, s, s * 0.9);
  fill(255, 255, 255, 60);
  ellipse(-s * 0.12, -s * 0.15, s * 0.25, s * 0.2);

  // Happy eyes (^_^)
  stroke(60, 40, 30);
  strokeWeight(s * 0.03);
  noFill();
  arc(-s * 0.14, -s * 0.08, s * 0.14, s * 0.1, PI, TWO_PI);
  arc(s * 0.14, -s * 0.08, s * 0.14, s * 0.1, PI, TWO_PI);

  // Big smile
  arc(0, s * 0.1, s * 0.3, s * 0.25, 0, PI);
  noStroke();

  // Blush
  fill(255, 130, 130, 100);
  ellipse(-s * 0.25, s * 0.05, s * 0.12, s * 0.07);
  ellipse(s * 0.25, s * 0.05, s * 0.12, s * 0.07);

  // Crown!
  fill(255, 215, 0);
  beginShape();
  vertex(-s * 0.25, -s * 0.35);
  vertex(-s * 0.22, -s * 0.55);
  vertex(-s * 0.1, -s * 0.42);
  vertex(0, -s * 0.6);
  vertex(s * 0.1, -s * 0.42);
  vertex(s * 0.22, -s * 0.55);
  vertex(s * 0.25, -s * 0.35);
  endShape(CLOSE);
  // Crown gems
  fill(255, 50, 50);
  ellipse(-s * 0.12, -s * 0.42, s * 0.05, s * 0.05);
  fill(50, 100, 255);
  ellipse(s * 0.12, -s * 0.42, s * 0.05, s * 0.05);
  fill(50, 200, 100);
  ellipse(0, -s * 0.48, s * 0.05, s * 0.05);

  pop();

  // Text
  textFont("Fredoka");
  textAlign(CENTER, CENTER);

  fill(80, 60, 20);
  textSize(sz(0.06));
  text("YOU WIN!", width / 2, height * 0.5);

  fill(120, 90, 40);
  textSize(sz(0.025));
  text("Master Chef Extraordinaire!", width / 2, height * 0.57);

  fill(100, 80, 50);
  textSize(sz(0.018));
  text("100 days of cafe greatness!", width / 2, height * 0.64);
  text("All upgrades maxed out!", width / 2, height * 0.68);
  text("Total fortune: $" + money, width / 2, height * 0.72);

  // Play again
  drawButton2(width / 2, height * 0.85, sz(0.2), sz(0.055),
    "Play Again!", [100, 200, 100], [255, 255, 255]);

  // Particles
  for (let p of particles) {
    p.update(deltaTime / 1000);
    p.draw();
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    if (particles[i].isDead()) particles.splice(i, 1);
  }
}

function handleWinClick() {
  if (isInRect(mouseX, mouseY, width / 2, height * 0.85, sz(0.2), sz(0.055))) {
    gameState = "menu";
  }
}

// --- DAY CLICK HANDLER ---
function handleDayClick() {
  // Tutorial advancement
  if (showTutorial && day === 1) {
    tutorialStep++;
    if (tutorialStep >= 5) showTutorial = false;
    return;
  }

  // Check spill clicks first (clean up messes!)
  if (handleSpillClick(mouseX, mouseY)) return;

  // Check blook clicks (serve)
  for (let b of blooks) {
    if (b.state === "waiting" && b.isClicked(mouseX, mouseY)) {
      if (isStationSpilled(b.wantedFood)) {
        // Station is spilled - show hint
        floatingTexts.push(new FloatingText(b.x, b.y - b.size,
          "Clean the spill first!", [255, 150, 50]));
        screenShake = 2;
      } else if (foodStock[b.wantedFood] > 0) {
        b.serve();
      } else {
        // Food is empty - show floating text
        floatingTexts.push(new FloatingText(b.x, b.y - b.size,
          "No " + FOOD_TYPES[b.wantedFood].name + "!", [255, 100, 80]));
        screenShake = 3;
      }
      return;
    }
  }

  // Check restock button clicks
  let unlockedCount = 0;
  for (let i = 0; i < 4; i++) if (foodUnlocked[i]) unlockedCount++;

  let spacing = width * 0.7 / max(unlockedCount, 1);
  let startX = width * 0.15 + spacing * 0.5;
  let stationY = height * 0.42;
  let stationH = sz(0.1);
  let barY = stationY + stationH * 0.45;
  let pos = 0;

  for (let i = 0; i < 4; i++) {
    if (!foodUnlocked[i]) { continue; }
    let sx = startX + pos * spacing;
    let btnW = spacing * 0.7 * 0.55;
    let btnH = sz(0.035);
    let btnY = barY + sz(0.055);

    if (isInRect(mouseX, mouseY, sx, btnY, btnW, btnH)) {
      startMathProblem(i);
      return;
    }
    pos++;
  }
}

// --- P5.JS CORE FUNCTIONS ---
function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Fredoka");
  frameRate(60);
  uiScale = min(width, height) / 700;
}

function draw() {
  cursor(ARROW);

  switch (gameState) {
    case "menu":
      drawMenu();
      break;
    case "dayStart":
      drawDayStart();
      break;
    case "day":
      drawDay();
      break;
    case "math":
      drawMathProblem();
      break;
    case "dayEnd":
      drawDayEnd();
      break;
    case "night":
      drawNight();
      break;
    case "gameover":
      drawGameOver();
      break;
    case "win":
      drawWin();
      break;
  }
}

function mousePressed() {
  switch (gameState) {
    case "menu":
      handleMenuClick();
      break;
    case "day":
      handleDayClick();
      break;
    case "math":
      handleMathClick();
      break;
    case "dayEnd":
      handleDayEndClick();
      break;
    case "night":
      handleNightClick();
      break;
    case "gameover":
      handleGameOverClick();
      break;
    case "win":
      handleWinClick();
      break;
  }
  return false; // Prevent default
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  uiScale = min(width, height) / 700;
}

// Prevent context menu on long press (mobile)
document.addEventListener('contextmenu', function (e) {
  e.preventDefault();
});
