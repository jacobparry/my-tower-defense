// ================================================================
// THE BILLION DOLLAR MANSION
// An Emerald Mining Adventure
//
// Help a poor villager find emeralds, buy upgrades, and together
// build the Billion Dollar Emerald Mansion!
// ================================================================

// ==================== CONFIGURATION ====================

const MANSION_COST = 1000000000;
const COMBO_WINDOW = 25; // frames before combo resets
const HAPPINESS_DRAIN = 1.5; // per second
const SHARE_HAPPINESS_RESTORE = 30;
const COST_MULTIPLIER = 1.4;

const MILESTONES = [
  { amount: 100, bonus: 25, label: '100' },
  { amount: 1000, bonus: 100, label: '1,000' },
  { amount: 10000, bonus: 500, label: '10,000' },
  { amount: 100000, bonus: 5000, label: '100,000' },
  { amount: 500000, bonus: 25000, label: '500,000' },
  { amount: 1000000, bonus: 50000, label: '1 MILLION' },
  { amount: 10000000, bonus: 500000, label: '10 MILLION' },
  { amount: 100000000, bonus: 5000000, label: '100 MILLION' },
  { amount: 500000000, bonus: 25000000, label: '500 MILLION' },
];

// ==================== GAME STATE ====================

let gameState = 'intro'; // intro, playing, victory, gameover
let emeralds = 0;
let totalEmeraldsEarned = 0;
let displayEmeralds = 0;
let clickPower = 1;
let totalPassiveIncome = 0;
let combo = 0;
let comboTimer = 0;
let bestCombo = 0;
let screenShakeAmount = 0;
let milestoneIndex = 0;
let milestoneNotification = null;
let milestoneTimer = 0;
let gameStartTime = 0;
let introTimer = 0;
let victoryTimer = 0;
let gameOverTimer = 0;
let totalItemsBought = 0;

// Layout
let shopW, hudH, worldW, worldH, groundLevel;

// Entities
let villager;
let worldEntities = {
  detectors: [],
  planters: [],
  suckers: [],
  miners: [],
  portals: [],
  factories: [],
  volcanos: [],
};
let particles = [];
let floatingTexts = [];
let confettis = [];
let emeraldDrops = [];

// Clouds for background
let clouds = [];

// Shop state
let hoveredShopItem = -1;
let hoveredShareBtn = false;

// ==================== SHOP ITEMS ====================

let shopItems = [];

function initShopItems() {
  shopItems = [
    {
      id: 'detector',
      name: 'Emerald Detector',
      emoji: '\uD83D\uDD0D',
      baseCost: 10,
      count: 0,
      desc: 'Click power +2',
      passivePerUnit: 0,
      clickPowerPerUnit: 2,
      col: [200, 200, 50],
    },
    {
      id: 'planter',
      name: 'Emerald Planter',
      emoji: '\uD83C\uDF31',
      baseCost: 75,
      count: 0,
      desc: '+5 emeralds/sec',
      passivePerUnit: 5,
      clickPowerPerUnit: 0,
      col: [46, 204, 113],
    },
    {
      id: 'sucker',
      name: 'Emerald Sucker',
      emoji: '\uD83D\uDCA8',
      baseCost: 400,
      count: 0,
      desc: '+20 emeralds/sec',
      passivePerUnit: 20,
      clickPowerPerUnit: 0,
      col: [52, 152, 219],
    },
    {
      id: 'miner',
      name: 'Emerald Miner',
      emoji: '\u26CF\uFE0F',
      baseCost: 2000,
      count: 0,
      desc: '+100 emeralds/sec',
      passivePerUnit: 100,
      clickPowerPerUnit: 0,
      col: [155, 89, 182],
    },
    {
      id: 'portal',
      name: 'Emerald Portal',
      emoji: '\uD83C\uDF00',
      baseCost: 15000,
      count: 0,
      desc: '+500 emeralds/sec',
      passivePerUnit: 500,
      clickPowerPerUnit: 0,
      col: [231, 76, 60],
    },
    {
      id: 'factory',
      name: 'Emerald Factory',
      emoji: '\uD83C\uDFED',
      baseCost: 200000,
      count: 0,
      desc: '+5,000 emeralds/sec',
      passivePerUnit: 5000,
      clickPowerPerUnit: 0,
      col: [230, 126, 34],
    },
    {
      id: 'volcano',
      name: 'Emerald Volcano',
      emoji: '\uD83C\uDF0B',
      baseCost: 5000000,
      count: 0,
      desc: '+50,000 emeralds/sec',
      passivePerUnit: 50000,
      clickPowerPerUnit: 0,
      col: [231, 60, 60],
    },
    {
      id: 'mansion',
      name: 'Emerald Mansion',
      emoji: '\uD83C\uDFF0',
      baseCost: MANSION_COST,
      count: 0,
      desc: 'WIN THE GAME!',
      passivePerUnit: 0,
      clickPowerPerUnit: 0,
      isMansion: true,
      col: [241, 196, 15],
    },
  ];
}

function getItemCost(item) {
  if (item.isMansion) return MANSION_COST;
  return floor(item.baseCost * pow(COST_MULTIPLIER, item.count));
}

// ==================== UTILITY FUNCTIONS ====================

function formatNumber(n) {
  if (n >= 1000000000) return (n / 1000000000).toFixed(1) + 'B';
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 10000) return (n / 1000).toFixed(1) + 'K';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return floor(n).toString();
}

function formatNumberFull(n) {
  return floor(n).toLocaleString();
}

function recalculateLayout() {
  shopW = min(260, max(200, width * 0.22));
  hudH = 65;
  worldW = width - shopW;
  worldH = height - hudH;
  groundLevel = hudH + worldH * 0.55;
}

function worldProgress() {
  return min(1, totalEmeraldsEarned / MANSION_COST);
}

function getComboMultiplier() {
  if (combo >= 50) return 10;
  if (combo >= 20) return 5;
  if (combo >= 10) return 3;
  if (combo >= 5) return 2;
  return 1;
}

function signOf(x) {
  return x > 0 ? 1 : x < 0 ? -1 : 0;
}

function drawEmeraldGem(cx, cy, s) {
  push();
  translate(cx, cy);
  noStroke();
  fill(46, 204, 113);
  beginShape();
  vertex(0, -s);
  vertex(s * 0.7, -s * 0.2);
  vertex(s * 0.7, s * 0.2);
  vertex(0, s);
  vertex(-s * 0.7, s * 0.2);
  vertex(-s * 0.7, -s * 0.2);
  endShape(CLOSE);
  fill(88, 214, 141, 180);
  beginShape();
  vertex(0, -s * 0.5);
  vertex(s * 0.35, -s * 0.1);
  vertex(s * 0.35, s * 0.1);
  vertex(0, s * 0.5);
  vertex(-s * 0.35, s * 0.1);
  vertex(-s * 0.35, -s * 0.1);
  endShape(CLOSE);
  fill(255, 255, 255, 140 + sin(frameCount * 0.1 + cx * 0.1) * 80);
  ellipse(s * 0.15, -s * 0.25, s * 0.22, s * 0.22);
  pop();
}

// ==================== PARTICLE CLASS ====================

class Particle {
  constructor(x, y, vx, vy, col, life, sz) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.col = col;
    this.life = life || 60;
    this.maxLife = this.life;
    this.size = sz || 4;
    this.gravity = 0.1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.life--;
  }

  draw() {
    let alpha = map(this.life, 0, this.maxLife, 0, 255);
    noStroke();
    fill(this.col[0], this.col[1], this.col[2], alpha);
    ellipse(this.x, this.y, this.size, this.size);
  }

  isDead() { return this.life <= 0; }
}

// ==================== FLOATING TEXT CLASS ====================

class FloatingText {
  constructor(x, y, txt, col, sz) {
    this.x = x;
    this.y = y;
    this.txt = txt;
    this.col = col || [255, 255, 255];
    this.size = sz || 18;
    this.life = 60;
    this.maxLife = 60;
    this.vy = -1.5;
  }

  update() {
    this.y += this.vy;
    this.vy *= 0.98;
    this.life--;
  }

  draw() {
    let alpha = map(this.life, 0, this.maxLife, 0, 255);
    let sc = this.life > this.maxLife * 0.7 ? map(this.life, this.maxLife, this.maxLife * 0.7, 1.3, 1) : 1;
    push();
    textAlign(CENTER, CENTER);
    textSize(this.size * sc);
    textStyle(BOLD);
    fill(0, 0, 0, alpha * 0.4);
    text(this.txt, this.x + 1, this.y + 1);
    fill(this.col[0], this.col[1], this.col[2], alpha);
    text(this.txt, this.x, this.y);
    pop();
  }

  isDead() { return this.life <= 0; }
}

// ==================== CONFETTI CLASS ====================

class Confetti {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-3, 3);
    this.vy = random(-8, -1);
    this.gravity = 0.12;
    this.rotation = random(TWO_PI);
    this.rotSpeed = random(-0.2, 0.2);
    this.size = random(4, 9);
    let colors = [[46,204,113],[39,174,96],[241,196,15],[255,255,255],[52,152,219],[231,76,60]];
    this.col = colors[floor(random(colors.length))];
    this.life = 200;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.vx *= 0.99;
    this.rotation += this.rotSpeed;
    this.life--;
  }

  draw() {
    let alpha = this.life < 30 ? map(this.life, 0, 30, 0, 255) : 255;
    push();
    translate(this.x, this.y);
    rotate(this.rotation);
    noStroke();
    fill(this.col[0], this.col[1], this.col[2], alpha);
    rect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
    pop();
  }

  isDead() { return this.life <= 0; }
}

// ==================== EMERALD DROP CLASS ====================

class EmeraldDrop {
  constructor(x, y, vx, vy, val) {
    this.x = x;
    this.y = y;
    this.vx = vx || random(-2, 2);
    this.vy = vy || random(-6, -2);
    this.val = val || 1;
    this.gravity = 0.2;
    this.floorY = y + random(20, 60);
    this.bounces = 0;
    this.life = 90;
    this.collected = false;
    this.size = map(constrain(val, 1, 50), 1, 50, 5, 11);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    if (this.y >= this.floorY) {
      this.y = this.floorY;
      this.vy *= -0.5;
      this.vx *= 0.7;
      this.bounces++;
      if (this.bounces > 3) { this.vy = 0; this.vx = 0; }
    }
    this.life--;
    if (this.life <= 0) this.collected = true;
  }

  draw() {
    if (this.collected) return;
    let alpha = this.life < 20 ? map(this.life, 0, 20, 100, 255) : 255;
    push();
    // Glow
    noStroke();
    fill(46, 204, 113, alpha * 0.15);
    ellipse(this.x, this.y, this.size * 3, this.size * 3);
    pop();
    // Gem with alpha tint
    push();
    tint(255, alpha);
    drawEmeraldGem(this.x, this.y, this.size);
    pop();
  }

  isDead() { return this.collected || this.life <= 0; }
}

// ==================== VILLAGER CLASS ====================

class Villager {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.happiness = 100;
    this.targetX = 0;
    this.walkTimer = 0;
    this.bounceOffset = 0;
    this.dir = 1;
    this.celebrateTimer = 0;
    this.speechBubble = null;
    this.speechTimer = 0;
    this.shareCount = 0;
    this.totalShared = 0;
  }

  init() {
    this.x = worldW * 0.5;
    this.y = groundLevel + 10;
    this.targetX = this.x;
  }

  update() {
    // Walking
    this.walkTimer--;
    if (this.walkTimer <= 0) {
      this.targetX = random(worldW * 0.15, worldW * 0.85);
      this.walkTimer = random(120, 300);
    }
    let dx = this.targetX - this.x;
    if (abs(dx) > 2) {
      this.x += dx * 0.012;
      this.dir = dx > 0 ? 1 : -1;
      this.bounceOffset = sin(frameCount * 0.15) * 3;
    } else {
      this.bounceOffset *= 0.9;
    }

    // Celebrate bounce
    if (this.celebrateTimer > 0) {
      this.celebrateTimer--;
      this.bounceOffset = sin(frameCount * 0.3) * 8;
    }

    // Speech
    if (this.speechTimer > 0) {
      this.speechTimer--;
      if (this.speechTimer <= 0) this.speechBubble = null;
    }

    // Low happiness warnings
    if (this.happiness < 25 && this.happiness > 0 && frameCount % 300 === 0) {
      this.say("I'm getting sad...");
    }

    // Bounds
    this.y = groundLevel + 10;
    this.x = constrain(this.x, worldW * 0.1, worldW * 0.9);
  }

  say(msg) {
    this.speechBubble = msg;
    this.speechTimer = 120;
  }

  celebrate(msg) {
    this.celebrateTimer = 90;
    if (msg) this.say(msg);
  }

  draw() {
    push();
    translate(this.x, this.y + this.bounceOffset);

    // Shadow
    fill(0, 0, 0, 30);
    noStroke();
    ellipse(0, 22, 30, 8);

    push();
    scale(this.dir, 1);

    // Feet
    fill(101, 67, 33);
    rect(-11, 14, 9, 6, 2);
    rect(2, 14, 9, 6, 2);

    // Body (brown robe)
    fill(139, 90, 43);
    rect(-13, -6, 26, 22, 4);
    // Belt
    fill(101, 67, 33);
    rect(-13, 4, 26, 3);

    // Arms
    let armSwing = abs(this.targetX - this.x) > 2 ? sin(frameCount * 0.15) * 15 : 0;
    if (this.celebrateTimer > 0) armSwing = sin(frameCount * 0.3) * 30;
    push();
    translate(-15, 0);
    rotate(radians(armSwing));
    fill(139, 90, 43);
    rect(-4, -2, 8, 16, 3);
    fill(222, 184, 135);
    rect(-2, 12, 5, 5, 2);
    pop();
    push();
    translate(15, 0);
    rotate(radians(-armSwing));
    fill(139, 90, 43);
    rect(-4, -2, 8, 16, 3);
    fill(222, 184, 135);
    rect(-2, 12, 5, 5, 2);
    pop();

    // Head
    fill(222, 184, 135);
    rect(-11, -30, 22, 24, 4);

    // Hair
    fill(101, 67, 33);
    rect(-12, -33, 24, 10, 4, 4, 0, 0);

    // Big villager nose
    fill(200, 162, 114);
    rect(-3, -20, 6, 9, 3);

    // Eyes
    fill(60, 40, 20);
    if (this.happiness > 60) {
      // Happy eyes (curved up)
      noFill();
      stroke(60, 40, 20);
      strokeWeight(1.5);
      arc(-5, -24, 5, 4, PI, TWO_PI);
      arc(5, -24, 5, 4, PI, TWO_PI);
      noStroke();
    } else if (this.happiness > 30) {
      // Neutral eyes
      ellipse(-5, -24, 3, 3);
      ellipse(5, -24, 3, 3);
    } else {
      // Sad eyes
      ellipse(-5, -24, 3, 4);
      ellipse(5, -24, 3, 4);
      // Tear
      fill(100, 180, 255, 180);
      ellipse(7, -20, 2, 3);
    }

    // Mouth
    noFill();
    stroke(60, 40, 20);
    strokeWeight(1.5);
    if (this.happiness > 70 || this.celebrateTimer > 0) {
      arc(0, -13, 10, 8, 0, PI); // big smile
    } else if (this.happiness > 40) {
      line(-3, -12, 3, -12); // neutral
    } else {
      arc(0, -10, 10, 6, PI, TWO_PI); // frown
    }
    noStroke();

    pop(); // end direction scale

    pop(); // end translate

    // Speech bubble (drawn outside transform for correct positioning)
    if (this.speechBubble && this.speechTimer > 0) {
      let alpha = this.speechTimer < 20 ? map(this.speechTimer, 0, 20, 0, 255) : 255;
      push();
      let bx = this.x;
      let by = this.y - 55 + this.bounceOffset;
      textSize(11);
      let tw = textWidth(this.speechBubble);
      let bw = max(tw + 18, 50);
      rectMode(CENTER);
      fill(255, 255, 255, alpha);
      stroke(0, 0, 0, alpha * 0.2);
      strokeWeight(1);
      rect(bx, by, bw, 24, 8);
      noStroke();
      fill(255, 255, 255, alpha);
      triangle(bx - 4, by + 12, bx + 4, by + 12, bx, by + 20);
      fill(60, 40, 20, alpha);
      textAlign(CENTER, CENTER);
      textStyle(BOLD);
      text(this.speechBubble, bx, by - 1);
      textStyle(NORMAL);
      pop();
    }

    // Happiness bar
    push();
    let barW = 36;
    let barH = 5;
    let barX = this.x - barW / 2;
    let barY = this.y - 45 + this.bounceOffset;
    noStroke();
    fill(0, 0, 0, 80);
    rect(barX - 1, barY - 1, barW + 2, barH + 2, 3);
    let hpct = this.happiness / 100;
    if (hpct > 0.6) fill(46, 204, 113);
    else if (hpct > 0.3) fill(241, 196, 15);
    else {
      let pulse = sin(frameCount * 0.15) * 0.3 + 0.7;
      fill(231, 76, 60, 255 * pulse);
    }
    rect(barX, barY, barW * hpct, barH, 2);
    textSize(8);
    fill(255, 80, 80);
    textAlign(RIGHT, CENTER);
    text('\u2764', barX - 3, barY + 3);
    pop();
  }
}

// ==================== DETECTOR DEVICE ====================

class DetectorDevice {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.blinkTimer = random(100);
  }

  update() { this.blinkTimer++; }

  draw() {
    push();
    translate(this.x, this.y);
    // Stick
    stroke(160, 160, 140);
    strokeWeight(3);
    line(0, 0, 0, -22);
    // Detector dish
    noStroke();
    fill(200, 200, 60);
    ellipse(0, -22, 16, 10);
    // Blinking LED
    let blink = sin(this.blinkTimer * 0.08) > 0.3;
    fill(blink ? color(255, 50, 50) : color(80, 20, 20));
    ellipse(0, -26, 5, 5);
    // Ground scan glow
    if (blink) {
      fill(46, 204, 113, 25);
      ellipse(0, 5, 45, 16);
    }
    pop();
  }
}

// ==================== PLANTER PLOT ====================

class PlanterPlot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.growth = random(0, 0.3); // start at different stages
    this.growSpeed = 0.0015 + random(0.0005);
  }

  update() {
    this.growth += this.growSpeed;
    if (this.growth > 1.2) this.growth = 0; // cycle
  }

  draw() {
    push();
    translate(this.x, this.y);
    // Soil mound
    noStroke();
    fill(101, 67, 33);
    arc(0, 0, 32, 16, PI, TWO_PI);
    fill(80, 55, 25);
    rect(-16, -2, 32, 5, 2);

    let g = min(this.growth, 1);
    if (g > 0.05) {
      // Stem
      let stemH = g * 28;
      stroke(34, 139, 34);
      strokeWeight(2);
      line(0, -4, 0, -4 - stemH);
      noStroke();

      // Leaves
      if (g > 0.35) {
        fill(34, 180, 34);
        ellipse(-7, -4 - stemH * 0.5, 10, 5);
        ellipse(7, -4 - stemH * 0.35, 9, 5);
      }

      // Emerald crystal on top
      if (g > 0.7) {
        let gemSize = map(g, 0.7, 1, 3, 7);
        drawEmeraldGem(0, -4 - stemH - gemSize, gemSize);
        // Sparkle when fully grown
        if (g > 0.95) {
          fill(255, 255, 255, 180 + sin(frameCount * 0.15 + this.x) * 75);
          noStroke();
          let sx = sin(frameCount * 0.12 + this.x) * 6;
          ellipse(sx, -4 - stemH - gemSize * 1.5, 3, 3);
        }
      }
    }
    pop();
  }
}

// ==================== SUCKER BOT ====================

class SuckerBot {
  constructor() {
    this.x = random(worldW * 0.15, worldW * 0.85);
    this.y = groundLevel + random(5, 40);
    this.targetX = this.x;
    this.targetY = this.y;
    this.speed = 2.5;
    this.trail = [];
    this.angle = 0;
  }

  update() {
    let dx = this.targetX - this.x;
    let dy = this.targetY - this.y;
    let d = sqrt(dx * dx + dy * dy);
    if (d > 5) {
      this.x += (dx / d) * this.speed;
      this.y += (dy / d) * this.speed;
      this.angle = atan2(dy, dx);
    } else {
      this.targetX = random(worldW * 0.1, worldW * 0.85);
      this.targetY = groundLevel + random(-10, 50);
    }
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 12) this.trail.shift();
  }

  draw() {
    // Trail
    for (let i = 0; i < this.trail.length; i++) {
      let a = map(i, 0, this.trail.length, 15, 80);
      let s = map(i, 0, this.trail.length, 2, 8);
      fill(52, 152, 219, a);
      noStroke();
      ellipse(this.trail[i].x, this.trail[i].y, s, s);
    }
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    // Body
    noStroke();
    fill(90, 90, 110);
    ellipse(0, 0, 18, 12);
    // Nozzle
    fill(70, 70, 90);
    rect(6, -3, 8, 6, 2);
    // Suction effect lines
    stroke(52, 152, 219, 120);
    strokeWeight(1);
    for (let i = 0; i < 3; i++) {
      let sx = 12 + i * 4;
      line(sx, -2, sx + 3, -2);
      line(sx, 2, sx + 3, 2);
    }
    // Eye
    noStroke();
    fill(52, 152, 219);
    ellipse(-3, 0, 6, 6);
    fill(255);
    ellipse(-2, -1, 3, 3);
    pop();
  }
}

// ==================== MINER BOT ====================

class MinerBot {
  constructor() {
    this.x = random(worldW * 0.05, worldW * 0.35);
    this.y = groundLevel + random(10, 50);
    this.targetX = this.x;
    this.isMining = false;
    this.mineTimer = 0;
    this.pickAngle = 0;
    this.dir = 1;
  }

  update() {
    if (this.isMining) {
      this.mineTimer--;
      this.pickAngle = sin(frameCount * 0.3) * 50;
      if (this.mineTimer <= 0) {
        this.isMining = false;
        emeraldDrops.push(new EmeraldDrop(this.x, this.y - 12, random(-2, 2), random(-4, -2), 1));
        for (let i = 0; i < 3; i++) {
          particles.push(new Particle(this.x, this.y - 5, random(-1, 1), random(-2, 0), [150, 150, 150], 20, 3));
        }
        this.targetX = random(worldW * 0.05, worldW * 0.4);
      }
    } else {
      let dx = this.targetX - this.x;
      if (abs(dx) > 3) {
        this.x += signOf(dx) * 0.8;
        this.dir = dx > 0 ? 1 : -1;
      } else {
        this.isMining = true;
        this.mineTimer = random(60, 120);
      }
    }
  }

  draw() {
    push();
    translate(this.x, this.y);
    scale(this.dir, 1);

    // Shadow
    fill(0, 0, 0, 20);
    noStroke();
    ellipse(0, 14, 20, 6);

    // Feet
    fill(100, 100, 120);
    rect(-8, 10, 6, 4, 1);
    rect(2, 10, 6, 4, 1);

    // Body
    fill(150, 150, 170);
    rect(-7, -4, 14, 16, 3);

    // Head
    fill(170, 170, 190);
    rect(-6, -14, 12, 12, 3);

    // Hard hat
    fill(241, 196, 15);
    rect(-8, -18, 16, 6, 3, 3, 0, 0);

    // LED eyes
    fill(0, 255, 100);
    rect(-4, -10, 3, 3, 1);
    rect(1, -10, 3, 3, 1);

    // Pickaxe
    push();
    translate(10, -6);
    rotate(radians(this.isMining ? this.pickAngle : -10));
    stroke(120, 80, 40);
    strokeWeight(2);
    line(0, 0, 0, -14);
    noStroke();
    fill(180, 180, 190);
    beginShape();
    vertex(-5, -14);
    vertex(5, -16);
    vertex(6, -14);
    vertex(-4, -12);
    endShape(CLOSE);
    pop();

    pop();
  }
}

// ==================== EMERALD PORTAL ====================

class EmeraldPortal {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 35;
    this.rotation = random(TWO_PI);
    this.spawnTimer = 0;
    this.pulse = 0;
  }

  update() {
    this.rotation += 0.03;
    this.pulse = sin(frameCount * 0.05 + this.x * 0.01) * 0.15;
    this.spawnTimer++;
    if (this.spawnTimer >= 25) {
      this.spawnTimer = 0;
      emeraldDrops.push(new EmeraldDrop(
        this.x + random(-12, 12), this.y + 5,
        random(-1.5, 1.5), random(-3, -1), 1
      ));
    }
  }

  draw() {
    push();
    translate(this.x, this.y);
    let s = this.size * (1 + this.pulse);

    // Outer glow
    noStroke();
    for (let i = 4; i > 0; i--) {
      fill(46, 204, 113, 10);
      ellipse(0, 0, s * 2 + i * 16, s * 2 + i * 16);
    }

    // Rotating arcs
    noFill();
    for (let i = 0; i < 3; i++) {
      let a = this.rotation + i * TWO_PI / 3;
      let r = s - i * 6;
      stroke(46, 204, 113, 220 - i * 60);
      strokeWeight(3 - i * 0.7);
      arc(0, 0, r * 2, r * 2, a, a + PI * 0.75);
    }

    // Inner vortex
    noStroke();
    fill(10, 60, 30, 200);
    ellipse(0, 0, s * 0.85, s * 0.85);
    fill(20, 120, 60, 150);
    ellipse(0, 0, s * 0.55, s * 0.55);
    fill(46, 204, 113, 100);
    ellipse(0, 0, s * 0.3, s * 0.3);

    // Center sparkle
    fill(255, 255, 255, 150 + sin(frameCount * 0.2) * 100);
    ellipse(0, 0, 6, 6);
    pop();
  }
}

// ==================== EMERALD FACTORY ====================

class EmeraldFactory {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.smokeTimer = 0;
    this.gearAngle = 0;
  }

  update() {
    this.smokeTimer++;
    this.gearAngle += 0.04;
    // Smoke particles
    if (this.smokeTimer % 15 === 0) {
      particles.push(new Particle(
        this.x + random(-5, 15), this.y - 55,
        random(-0.3, 0.3), random(-1.5, -0.5),
        [160, 160, 160], 40, random(5, 10)
      ));
    }
    // Emerald output
    if (this.smokeTimer % 40 === 0) {
      emeraldDrops.push(new EmeraldDrop(
        this.x + 15, this.y - 10,
        random(1, 3), random(-3, -1), 5
      ));
    }
  }

  draw() {
    push();
    translate(this.x, this.y);

    // Building base
    fill(120, 80, 50);
    rect(-25, -40, 50, 40, 3);
    // Emerald-tinted walls
    fill(40, 130, 70, 120);
    rect(-25, -40, 50, 40, 3);

    // Chimney
    fill(100, 70, 45);
    rect(5, -55, 14, 20);

    // Door
    fill(80, 55, 35);
    rect(-8, -18, 16, 18, 3, 3, 0, 0);

    // Gear on side
    push();
    translate(-18, -25);
    rotate(this.gearAngle);
    stroke(180, 150, 50);
    strokeWeight(2);
    noFill();
    ellipse(0, 0, 14, 14);
    line(-5, 0, 5, 0);
    line(0, -5, 0, 5);
    pop();

    // Conveyor belt output
    fill(80, 80, 90);
    rect(20, -12, 15, 6, 2);
    // Moving dots on belt
    let beltOffset = (frameCount * 2) % 8;
    fill(46, 204, 113);
    for (let i = 0; i < 2; i++) {
      ellipse(22 + beltOffset + i * 8, -9, 4, 4);
    }

    // Sign
    fill(230, 126, 34);
    noStroke();
    rect(-12, -52, 24, 10, 2);
    fill(255);
    textSize(6);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    text('FACTORY', 0, -47);
    textStyle(NORMAL);

    noStroke();
    pop();
  }
}

// ==================== EMERALD VOLCANO ====================

class EmeraldVolcano {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.eruptTimer = 0;
    this.isErupting = false;
    this.eruptCooldown = 0;
    this.lavaGlow = 0;
  }

  update() {
    this.eruptTimer++;
    this.lavaGlow = sin(frameCount * 0.1) * 0.3 + 0.7;

    // Eruption cycle: erupt every ~90 frames
    this.eruptCooldown--;
    if (this.eruptCooldown <= 0) {
      this.isErupting = true;
      this.eruptCooldown = 90;

      // Burst of emeralds!
      for (let i = 0; i < 5; i++) {
        emeraldDrops.push(new EmeraldDrop(
          this.x + random(-10, 10), this.y - 45,
          random(-4, 4), random(-8, -4), 5
        ));
      }
      // Lava particles
      for (let i = 0; i < 8; i++) {
        particles.push(new Particle(
          this.x + random(-8, 8), this.y - 45,
          random(-2, 2), random(-5, -2),
          [255, random(80, 160), 0], random(25, 45), random(3, 6)
        ));
      }
      screenShakeAmount = max(screenShakeAmount, 2);
    }

    if (this.eruptCooldown < 80) this.isErupting = false;

    // Ambient smoke
    if (this.eruptTimer % 20 === 0) {
      particles.push(new Particle(
        this.x + random(-5, 5), this.y - 48,
        random(-0.2, 0.2), random(-1, -0.3),
        [100, 100, 100], 30, random(4, 8)
      ));
    }
  }

  draw() {
    push();
    translate(this.x, this.y);

    // Volcano base (wide triangle mountain)
    fill(90, 70, 60);
    noStroke();
    beginShape();
    vertex(-40, 0);
    vertex(-15, -40);
    vertex(15, -40);
    vertex(40, 0);
    endShape(CLOSE);

    // Darker rock streaks
    fill(70, 55, 45);
    beginShape();
    vertex(-25, 0);
    vertex(-10, -35);
    vertex(0, -35);
    vertex(15, 0);
    endShape(CLOSE);

    // Crater rim
    fill(60, 45, 35);
    ellipse(0, -40, 34, 12);

    // Lava glow in crater
    fill(255, 100, 20, 180 * this.lavaGlow);
    ellipse(0, -40, 24, 8);
    fill(255, 180, 50, 120 * this.lavaGlow);
    ellipse(0, -40, 16, 5);

    // Green emerald veins on mountain
    stroke(46, 204, 113, 120);
    strokeWeight(2);
    line(-20, -10, -12, -25);
    line(10, -5, 8, -20);
    line(22, -8, 15, -18);
    noStroke();

    // Eruption glow
    if (this.isErupting) {
      fill(255, 150, 0, 60);
      ellipse(0, -45, 50, 50);
    }

    pop();
  }
}

// ==================== P5.JS LIFECYCLE ====================

function setup() {
  createCanvas(windowWidth, windowHeight);
  recalculateLayout();
  initShopItems();
  villager = new Villager();
  villager.init();
  for (let i = 0; i < 6; i++) {
    clouds.push({
      x: random(width),
      y: random(hudH + 15, hudH + worldH * 0.22),
      size: random(50, 110),
      speed: random(0.1, 0.35),
    });
  }
  textFont('Arial');
  gameStartTime = millis();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  recalculateLayout();
  if (villager) villager.init();
}

function draw() {
  cursor(ARROW);
  switch (gameState) {
    case 'intro': updateIntro(); drawIntro(); break;
    case 'playing': updatePlaying(); drawPlaying(); break;
    case 'victory': updateVictory(); drawVictoryScreen(); break;
    case 'gameover': updateGameOver(); drawGameOverScreen(); break;
  }
}

// ==================== INTRO ====================

function updateIntro() {
  introTimer++;
}

function drawIntro() {
  // Background gradient
  for (let y = 0; y < height; y++) {
    let t = y / height;
    let c = lerpColor(color(15, 40, 25), color(10, 25, 15), t);
    stroke(c);
    line(0, y, width, y);
  }

  // Floating emerald particles
  noStroke();
  for (let i = 0; i < 20; i++) {
    let px = (i * 137 + frameCount * 0.3) % width;
    let py = (i * 89 + frameCount * 0.5) % height;
    let sz = 3 + sin(frameCount * 0.03 + i) * 2;
    fill(46, 204, 113, 40 + sin(frameCount * 0.05 + i * 0.7) * 30);
    ellipse(px, py, sz, sz);
  }

  // Title
  let titleAlpha = min(255, introTimer * 6);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);

  // Title glow
  textSize(42);
  fill(46, 204, 113, titleAlpha * 0.3);
  text('THE BILLION DOLLAR MANSION', width / 2, height * 0.18 + 2);
  // Title text
  fill(241, 196, 15, titleAlpha);
  text('THE BILLION DOLLAR MANSION', width / 2, height * 0.18);

  // Subtitle
  if (introTimer > 20) {
    let subAlpha = min(255, (introTimer - 20) * 6);
    textSize(18);
    fill(200, 200, 200, subAlpha);
    textStyle(ITALIC);
    text('An Emerald Mining Adventure', width / 2, height * 0.26);
  }

  // Villager (drawn manually for intro - sad version)
  if (introTimer > 40) {
    let vAlpha = min(255, (introTimer - 40) * 5);
    push();
    translate(width / 2, height * 0.5);

    // Shadow
    fill(0, 0, 0, vAlpha * 0.12);
    noStroke();
    ellipse(0, 35, 50, 14);

    // Simple sad villager
    // Feet
    fill(101, 67, 33, vAlpha);
    rect(-14, 22, 11, 8, 3);
    rect(3, 22, 11, 8, 3);
    // Body
    fill(139, 90, 43, vAlpha);
    rect(-16, -8, 32, 32, 5);
    fill(101, 67, 33, vAlpha);
    rect(-16, 6, 32, 4);
    // Head
    fill(222, 184, 135, vAlpha);
    rect(-14, -40, 28, 32, 5);
    // Hair
    fill(101, 67, 33, vAlpha);
    rect(-15, -44, 30, 12, 5, 5, 0, 0);
    // Nose
    fill(200, 162, 114, vAlpha);
    rect(-4, -26, 8, 11, 4);
    // Sad eyes
    fill(60, 40, 20, vAlpha);
    ellipse(-6, -30, 4, 5);
    ellipse(6, -30, 4, 5);
    // Tear
    fill(100, 180, 255, vAlpha * 0.7);
    ellipse(8, -25, 3, 4);
    // Frown
    noFill();
    stroke(60, 40, 20, vAlpha);
    strokeWeight(2);
    arc(0, -14, 14, 8, PI, TWO_PI);
    noStroke();

    pop();
  }

  // Story text
  if (introTimer > 70) {
    let txtAlpha = min(255, (introTimer - 70) * 5);
    textStyle(NORMAL);
    textSize(20);
    fill(255, 255, 255, txtAlpha);
    text('This poor villager needs your help!', width / 2, height * 0.68);
    textSize(15);
    fill(180, 220, 190, txtAlpha);
    text('Mine emeralds, buy upgrades, and build the', width / 2, height * 0.74);
    fill(241, 196, 15, txtAlpha);
    textStyle(BOLD);
    text('Billion Dollar Emerald Mansion!', width / 2, height * 0.79);
  }

  // Click to start (pulsing)
  if (introTimer > 100) {
    let pulse = sin(frameCount * 0.06) * 0.3 + 0.7;
    textStyle(BOLD);
    textSize(22);
    fill(46, 204, 113, 255 * pulse);
    text('Click anywhere to start!', width / 2, height * 0.9);
  }

  textStyle(NORMAL);
}

// ==================== GAME UPDATE ====================

function updatePlaying() {
  // Passive income
  recalculatePassiveIncome();
  let passiveThisFrame = totalPassiveIncome / 60;
  emeralds += passiveThisFrame;
  totalEmeraldsEarned += passiveThisFrame;

  // Display emeralds animation
  let diff = emeralds - displayEmeralds;
  if (abs(diff) < 0.5) displayEmeralds = emeralds;
  else displayEmeralds += diff * 0.15;

  // Combo timer
  if (comboTimer > 0) {
    comboTimer--;
    if (comboTimer <= 0) combo = 0;
  }

  // Villager happiness drain
  villager.happiness -= HAPPINESS_DRAIN / 60;
  villager.happiness = max(0, villager.happiness);
  villager.update();

  // Game over check
  if (villager.happiness <= 0) {
    gameState = 'gameover';
    gameOverTimer = 0;
    return;
  }

  // Update world entities
  for (let e of worldEntities.detectors) e.update();
  for (let e of worldEntities.planters) e.update();
  for (let e of worldEntities.suckers) e.update();
  for (let e of worldEntities.miners) e.update();
  for (let e of worldEntities.portals) e.update();
  for (let e of worldEntities.factories) e.update();
  for (let e of worldEntities.volcanos) e.update();

  // Update particles (backward iteration for safe removal)
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    if (particles[i].isDead()) particles.splice(i, 1);
  }
  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    floatingTexts[i].update();
    if (floatingTexts[i].isDead()) floatingTexts.splice(i, 1);
  }
  for (let i = emeraldDrops.length - 1; i >= 0; i--) {
    emeraldDrops[i].update();
    if (emeraldDrops[i].isDead()) emeraldDrops.splice(i, 1);
  }
  for (let i = confettis.length - 1; i >= 0; i--) {
    confettis[i].update();
    if (confettis[i].isDead()) confettis.splice(i, 1);
  }

  // Screen shake decay
  if (screenShakeAmount > 0) {
    screenShakeAmount *= 0.9;
    if (screenShakeAmount < 0.3) screenShakeAmount = 0;
  }

  // Milestones
  checkMilestones();
  if (milestoneNotification) {
    milestoneTimer--;
    if (milestoneTimer <= 0) milestoneNotification = null;
  }

  // Clouds
  for (let c of clouds) {
    c.x += c.speed;
    if (c.x > worldW + c.size) c.x = -c.size;
  }
}

function recalculatePassiveIncome() {
  totalPassiveIncome = 0;
  for (let item of shopItems) {
    if (item.passivePerUnit) {
      totalPassiveIncome += item.passivePerUnit * item.count;
    }
  }
}

function checkMilestones() {
  if (milestoneIndex < MILESTONES.length) {
    let m = MILESTONES[milestoneIndex];
    if (totalEmeraldsEarned >= m.amount) {
      emeralds += m.bonus;
      totalEmeraldsEarned += m.bonus;
      milestoneNotification = m;
      milestoneTimer = 180;
      villager.celebrate('WOW!!!');
      screenShakeAmount = 8;
      for (let i = 0; i < 30; i++) {
        confettis.push(new Confetti(random(worldW), random(hudH, height * 0.4)));
      }
      floatingTexts.push(new FloatingText(
        worldW / 2, height / 2 - 30,
        '+' + formatNumber(m.bonus) + ' BONUS!',
        [241, 196, 15], 30
      ));
      milestoneIndex++;
    }
  }
}

function updateVictory() {
  victoryTimer++;
  if (victoryTimer < 400 && frameCount % 2 === 0) {
    confettis.push(new Confetti(random(width), random(-20, height * 0.15)));
  }
  for (let i = confettis.length - 1; i >= 0; i--) {
    confettis[i].update();
    if (confettis[i].isDead()) confettis.splice(i, 1);
  }
  villager.celebrateTimer = 999;
  villager.happiness = 100;
  villager.update();
}

function updateGameOver() {
  gameOverTimer++;
}

// ==================== DRAWING: BACKGROUND ====================

function drawBackground() {
  let prog = worldProgress();

  // Sky gradient
  let skyTop, skyBottom;
  if (prog < 0.25) {
    skyTop = lerpColor(color(140, 148, 160), color(110, 170, 230), prog * 4);
    skyBottom = lerpColor(color(175, 180, 185), color(185, 215, 245), prog * 4);
  } else if (prog < 0.75) {
    skyTop = lerpColor(color(110, 170, 230), color(90, 150, 230), (prog - 0.25) * 2);
    skyBottom = lerpColor(color(185, 215, 245), color(210, 235, 255), (prog - 0.25) * 2);
  } else {
    skyTop = lerpColor(color(90, 150, 230), color(255, 160, 90), (prog - 0.75) * 4);
    skyBottom = lerpColor(color(210, 235, 255), color(255, 225, 160), (prog - 0.75) * 4);
  }

  noStroke();
  for (let y = hudH; y < groundLevel; y += 2) {
    let t = map(y, hudH, groundLevel, 0, 1);
    fill(lerpColor(skyTop, skyBottom, t));
    rect(0, y, worldW, 2);
  }

  // Sun
  if (prog > 0.2) {
    let sunA = map(prog, 0.2, 0.5, 0, 255);
    sunA = min(255, sunA);
    let sx = worldW * 0.72;
    let sy = hudH + worldH * 0.12;
    noStroke();
    for (let i = 5; i > 0; i--) {
      fill(255, 230, 100, sunA * 0.05);
      ellipse(sx, sy, 35 + i * 18, 35 + i * 18);
    }
    fill(255, 235, 130, sunA);
    ellipse(sx, sy, 35, 35);
  }

  // Clouds
  noStroke();
  for (let c of clouds) {
    fill(255, 255, 255, 50 + prog * 70);
    ellipse(c.x, c.y, c.size, c.size * 0.45);
    ellipse(c.x + c.size * 0.3, c.y - c.size * 0.08, c.size * 0.65, c.size * 0.35);
    ellipse(c.x - c.size * 0.2, c.y + c.size * 0.04, c.size * 0.55, c.size * 0.3);
  }

  // Distant hills
  fill(lerpColor(color(85, 125, 65), color(65, 170, 65), prog));
  beginShape();
  vertex(0, groundLevel);
  for (let x = 0; x <= worldW; x += 15) {
    let y = groundLevel - sin(x * 0.007) * 22 - cos(x * 0.011 + 1) * 14;
    vertex(x, y);
  }
  vertex(worldW, groundLevel);
  endShape(CLOSE);

  // Ground
  fill(lerpColor(color(95, 140, 55), color(80, 180, 55), prog));
  rect(0, groundLevel, worldW, height - groundLevel);

  // Dirt layer at bottom
  fill(lerpColor(color(125, 105, 75), color(145, 125, 85), prog));
  rect(0, groundLevel + worldH * 0.32, worldW, height);

  // Mine entrance
  let mx = worldW * 0.08;
  let my = groundLevel + 5;
  let mw = 55;
  let mh = 45;
  // Cave
  fill(25, 20, 18);
  arc(mx + mw / 2, my + mh, mw, mh * 2, PI, TWO_PI);
  // Rock border
  noFill();
  stroke(110, 105, 100);
  strokeWeight(4);
  arc(mx + mw / 2, my + mh, mw + 8, mh * 2 + 6, PI, TWO_PI);
  noStroke();
  // Support beams
  fill(130, 85, 40);
  rect(mx + 3, my + 12, 6, mh - 8);
  rect(mx + mw - 9, my + 12, 6, mh - 8);
  rect(mx, my + 8, mw, 6, 2);

  // Grass tufts on ground
  stroke(lerpColor(color(65, 145, 35), color(50, 210, 65), prog));
  strokeWeight(1.5);
  for (let i = 0; i < 18; i++) {
    let gx = (i * worldW / 18) + 20;
    let gy = groundLevel + 1;
    line(gx, gy, gx - 2, gy - 7);
    line(gx, gy, gx + 2, gy - 6);
    line(gx, gy, gx + 5, gy - 5);
  }
  noStroke();

  // Flowers (appear with progress)
  if (prog > 0.15) {
    let flowerCount = floor(prog * 14);
    for (let i = 0; i < flowerCount; i++) {
      let fx = ((i * 137 + 50) % floor(worldW * 0.9)) + worldW * 0.05;
      let fy = groundLevel + 4 + (i * 73 % 25);
      let fc = [
        color(255, 100, 110), color(255, 255, 100), color(200, 110, 255),
        color(255, 180, 100), color(150, 200, 255)
      ][i % 5];
      fill(40, 170, 40);
      noStroke();
      rect(fx, fy, 2, 7);
      fill(fc);
      ellipse(fx + 1, fy - 2, 6, 6);
    }
  }

  // Rainbow at high progress
  if (prog > 0.75) {
    let rAlpha = map(prog, 0.75, 1, 0, 60);
    noFill();
    strokeWeight(3);
    let cols = [[255,0,0],[255,127,0],[255,255,0],[0,255,0],[0,0,255],[75,0,130],[148,0,211]];
    for (let i = 0; i < cols.length; i++) {
      stroke(cols[i][0], cols[i][1], cols[i][2], rAlpha);
      arc(worldW * 0.5, groundLevel, worldW * 0.6 - i * 8, worldH * 0.7 - i * 8, PI, TWO_PI);
    }
    noStroke();
  }
}

// ==================== DRAWING: PLAYING STATE ====================

function drawPlaying() {
  background(30, 30, 40);

  push();
  // Screen shake
  if (screenShakeAmount > 0) {
    translate(random(-screenShakeAmount, screenShakeAmount), random(-screenShakeAmount, screenShakeAmount));
  }

  drawBackground();

  // Draw world entities (ordered back to front)
  for (let e of worldEntities.detectors) e.draw();
  for (let e of worldEntities.planters) e.draw();
  for (let e of worldEntities.factories) e.draw();
  for (let e of worldEntities.volcanos) e.draw();
  for (let e of worldEntities.portals) e.draw();
  for (let d of emeraldDrops) d.draw();
  for (let e of worldEntities.miners) e.draw();
  for (let e of worldEntities.suckers) e.draw();

  // Villager
  villager.draw();

  // Particles
  for (let p of particles) p.draw();
  for (let f of floatingTexts) f.draw();
  for (let c of confettis) c.draw();

  pop();

  // UI overlays (not affected by screen shake)
  drawHUD();
  drawShopPanel();
  drawMilestoneNotification();
  drawComboDisplay();
}

// ==================== DRAWING: HUD ====================

function drawHUD() {
  // Background bar
  noStroke();
  fill(20, 20, 30, 220);
  rect(0, 0, width, hudH);
  // Bottom border
  fill(46, 204, 113, 80);
  rect(0, hudH - 2, width, 2);

  // Emerald count (offset right to avoid back button)
  let emeraldX = 180;
  drawEmeraldGem(emeraldX, hudH / 2, 12);
  textAlign(LEFT, CENTER);
  textStyle(BOLD);
  textSize(22);
  fill(46, 204, 113);
  let displayStr = formatNumberFull(displayEmeralds);
  text(displayStr, emeraldX + 19, hudH / 2);

  // Stats section - to the right of the emerald count
  let statsX = emeraldX + 19 + textWidth(displayStr) + 30;

  // Divider line
  stroke(255, 255, 255, 40);
  strokeWeight(1);
  line(statsX - 15, hudH * 0.2, statsX - 15, hudH * 0.8);
  noStroke();

  // Per second display
  textAlign(LEFT, CENTER);
  if (totalPassiveIncome > 0) {
    textSize(15);
    fill(150, 220, 170);
    textStyle(BOLD);
    text('+' + formatNumber(totalPassiveIncome) + '/sec', statsX, hudH / 2 - 10);
  }

  // Click power display
  textSize(14);
  fill(200, 200, 80);
  textStyle(BOLD);
  let cpText = 'Click: ' + clickPower;
  let comboMult = getComboMultiplier();
  if (comboMult > 1) cpText += ' x' + comboMult;
  text(cpText, statsX, hudH / 2 + 12);

  // Share button (right side of HUD)
  let shareBtnW = 100;
  let shareBtnH = 36;
  let shareBtnX = worldW - shareBtnW - 15;
  let shareBtnY = hudH / 2 - shareBtnH / 2;

  // Check hover
  hoveredShareBtn = mouseX >= shareBtnX && mouseX <= shareBtnX + shareBtnW &&
                    mouseY >= shareBtnY && mouseY <= shareBtnY + shareBtnH;

  let shareCost = getShareCost();
  let canShare = emeralds >= shareCost && villager.happiness < 100;
  let needsShare = villager.happiness < 60;

  // Button background
  if (needsShare && !canShare) {
    fill(100, 40, 40, 200);
  } else if (hoveredShareBtn && canShare) {
    fill(200, 60, 80, 220);
    cursor(HAND);
  } else if (canShare) {
    fill(180, 50, 70, 180 + (needsShare ? sin(frameCount * 0.1) * 50 : 0));
  } else {
    fill(60, 60, 70, 180);
  }
  rect(shareBtnX, shareBtnY, shareBtnW, shareBtnH, 6);

  // Button text
  textAlign(CENTER, CENTER);
  textSize(12);
  textStyle(BOLD);
  fill(255, 255, 255, canShare ? 255 : 120);
  text('\u2764 Share', shareBtnX + shareBtnW / 2, shareBtnY + shareBtnH / 2 - 5);
  textSize(9);
  textStyle(NORMAL);
  fill(255, 200, 200, canShare ? 200 : 80);
  text('Cost: ' + formatNumber(shareCost), shareBtnX + shareBtnW / 2, shareBtnY + shareBtnH / 2 + 9);

  // Villager status in HUD
  let statusX = shareBtnX - 120;
  textAlign(LEFT, CENTER);
  textSize(11);
  textStyle(BOLD);
  fill(200, 200, 200);
  text('Villager', statusX, hudH / 2 - 10);
  // Mini happiness bar
  let miniBarW = 80;
  let miniBarH = 8;
  let miniBarY = hudH / 2 + 4;
  fill(40, 40, 50);
  rect(statusX, miniBarY, miniBarW, miniBarH, 4);
  let hp = villager.happiness / 100;
  if (hp > 0.6) fill(46, 204, 113);
  else if (hp > 0.3) fill(241, 196, 15);
  else fill(231, 76, 60, 200 + sin(frameCount * 0.15) * 55);
  rect(statusX, miniBarY, miniBarW * hp, miniBarH, 4);
  textStyle(NORMAL);
  textSize(9);
  fill(255);
  textAlign(CENTER, CENTER);
  text(floor(villager.happiness) + '%', statusX + miniBarW / 2, miniBarY + miniBarH / 2);

  // Progress toward mansion
  let progBarX = statusX - 130;
  let progBarW = 110;
  textAlign(LEFT, CENTER);
  textSize(10);
  textStyle(BOLD);
  fill(241, 196, 15);
  text('\uD83C\uDFF0 Mansion', progBarX, hudH / 2 - 10);
  textStyle(NORMAL);
  textSize(9);
  fill(180, 180, 180);
  let mansionProg = min(1, emeralds / MANSION_COST);
  text(formatNumber(emeralds) + ' / 1B', progBarX, hudH / 2 + 4);
  // Mini progress bar
  fill(40, 40, 50);
  rect(progBarX, hudH / 2 + 14, progBarW, 6, 3);
  fill(241, 196, 15, 200);
  rect(progBarX, hudH / 2 + 14, progBarW * mansionProg, 6, 3);

  textStyle(NORMAL);
}

// ==================== DRAWING: SHOP PANEL ====================

function drawShopPanel() {
  let sx = worldW;

  // Panel background
  noStroke();
  fill(20, 22, 35, 235);
  rect(sx, 0, shopW, height);
  // Left border
  fill(46, 204, 113, 60);
  rect(sx, 0, 2, height);

  // Title
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(16);
  fill(46, 204, 113);
  text('SHOP', sx + shopW / 2, hudH / 2);
  textStyle(NORMAL);

  // Items
  let padding = 6;
  let itemStartY = hudH + 8;
  let availH = height - hudH - 16;
  let itemH = min(95, availH / shopItems.length - padding);

  hoveredShopItem = -1;

  for (let i = 0; i < shopItems.length; i++) {
    let item = shopItems[i];
    let ix = sx + padding;
    let iy = itemStartY + i * (itemH + padding);
    let iw = shopW - padding * 2;

    let cost = getItemCost(item);
    let canAfford = emeralds >= cost;
    let isHovered = mouseX >= ix && mouseX <= ix + iw && mouseY >= iy && mouseY <= iy + itemH;

    if (isHovered) {
      hoveredShopItem = i;
      cursor(HAND);
    }

    // Card background
    if (item.isMansion && canAfford) {
      // Pulsing gold for affordable mansion
      let pulse = sin(frameCount * 0.08) * 0.2 + 0.8;
      fill(60, 50, 15, 255 * pulse);
      stroke(241, 196, 15, 200 * pulse);
      strokeWeight(2);
      rect(ix, iy, iw, itemH, 8);
      noStroke();
    } else if (isHovered && canAfford) {
      fill(40, 55, 45, 250);
      stroke(46, 204, 113, 150);
      strokeWeight(1);
      rect(ix, iy, iw, itemH, 8);
      noStroke();
    } else {
      fill(30, 32, 45, 220);
      noStroke();
      rect(ix, iy, iw, itemH, 8);
    }

    // Color accent bar
    fill(item.col[0], item.col[1], item.col[2], canAfford ? 200 : 60);
    rect(ix, iy, 4, itemH, 4, 0, 0, 4);

    // Emoji and name
    textAlign(LEFT, TOP);
    textSize(13);
    textStyle(BOLD);
    fill(255, 255, 255, canAfford ? 255 : 100);
    text(item.emoji + ' ' + item.name, ix + 10, iy + 6);

    // Description
    textStyle(NORMAL);
    textSize(10);
    fill(item.col[0], item.col[1], item.col[2], canAfford ? 200 : 80);
    text(item.desc, ix + 10, iy + 24);

    // Count owned
    if (item.count > 0 && !item.isMansion) {
      textAlign(RIGHT, TOP);
      textSize(10);
      fill(180, 180, 180);
      text('Owned: ' + item.count, ix + iw - 8, iy + 6);
    }

    // Cost and buy button
    let btnW = iw - 20;
    let btnH = 22;
    let btnX = ix + 10;
    let btnY = iy + itemH - btnH - 8;

    if (canAfford) {
      fill(46, 204, 113, isHovered ? 220 : 160);
    } else {
      fill(50, 50, 60, 150);
    }
    rect(btnX, btnY, btnW, btnH, 5);

    textAlign(CENTER, CENTER);
    textSize(11);
    textStyle(BOLD);
    if (item.isMansion && canAfford) {
      fill(255, 255, 100);
      text('\uD83C\uDFF0 BUY MANSION! \uD83C\uDFF0', btnX + btnW / 2, btnY + btnH / 2);
    } else if (canAfford) {
      fill(255);
      text('BUY - ' + formatNumber(cost), btnX + btnW / 2, btnY + btnH / 2);
    } else {
      fill(150, 150, 150, 80);
      text('\uD83D\uDD12 ' + formatNumber(cost), btnX + btnW / 2, btnY + btnH / 2);
    }
    textStyle(NORMAL);
  }
}

// ==================== DRAWING: COMBO DISPLAY ====================

function drawComboDisplay() {
  if (combo < 3) return;

  let comboMult = getComboMultiplier();
  let cx = 170;
  let cy = hudH + 30;

  // Background
  let intensity = map(combo, 3, 50, 0.5, 1);
  let pulse = sin(frameCount * 0.15) * 0.15 + 0.85;

  textAlign(CENTER, CENTER);
  textStyle(BOLD);

  // Shadow
  textSize(22 * pulse);
  fill(0, 0, 0, 100);
  text('COMBO x' + comboMult + '!', cx + 1, cy + 1);

  // Text color based on combo level
  if (combo >= 50) fill(255, 215, 0);
  else if (combo >= 20) fill(255, 165, 0);
  else if (combo >= 10) fill(255, 100, 50);
  else fill(46, 204, 113);

  textSize(22 * pulse);
  text('COMBO x' + comboMult + '!', cx, cy);

  // Hit counter
  textSize(10);
  fill(200, 200, 200, 180);
  text(combo + ' hits', cx, cy + 16);

  textStyle(NORMAL);
}

// ==================== DRAWING: MILESTONE NOTIFICATION ====================

function drawMilestoneNotification() {
  if (!milestoneNotification) return;

  let alpha = milestoneTimer < 30 ? map(milestoneTimer, 0, 30, 0, 255) : 255;
  let slideIn = milestoneTimer > 150 ? map(milestoneTimer, 180, 150, -60, 0) : 0;

  push();
  translate(0, slideIn);
  // Banner
  rectMode(CENTER);
  fill(20, 40, 25, alpha * 0.9);
  stroke(241, 196, 15, alpha * 0.8);
  strokeWeight(2);
  rect(worldW / 2, hudH + 50, 350, 50, 10);
  noStroke();

  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(18);
  fill(241, 196, 15, alpha);
  text('\u2B50 ' + milestoneNotification.label + ' EMERALDS! \u2B50', worldW / 2, hudH + 45);
  textSize(12);
  fill(46, 204, 113, alpha);
  text('+' + formatNumber(milestoneNotification.bonus) + ' bonus emeralds!', worldW / 2, hudH + 60);

  textStyle(NORMAL);
  rectMode(CORNER);
  pop();
}

// ==================== DRAWING: VICTORY ====================

function drawVictoryScreen() {
  // Emerald green gradient background
  for (let y = 0; y < height; y++) {
    let t = y / height;
    let c = lerpColor(color(20, 80, 40), color(10, 50, 25), t);
    stroke(c);
    line(0, y, width, y);
  }
  noStroke();

  // Gold sparkles
  for (let i = 0; i < 30; i++) {
    let px = (i * 113 + frameCount * 0.4) % width;
    let py = (i * 79 + frameCount * 0.3) % height;
    let sz = 2 + sin(frameCount * 0.04 + i) * 2;
    fill(241, 196, 15, 60 + sin(frameCount * 0.06 + i * 0.5) * 40);
    ellipse(px, py, sz, sz);
  }

  // Mansion drawing (builds up with victoryTimer)
  let buildProgress = min(1, victoryTimer / 120);
  let mx = width / 2;
  let my = height * 0.48;

  if (buildProgress > 0) {
    push();
    translate(mx, my);

    let bh = 160 * buildProgress;
    let bw = 200;

    // Foundation
    if (buildProgress > 0.1) {
      fill(80, 80, 90);
      rect(-bw / 2 - 10, 10, bw + 20, 20, 3);
    }

    // Main walls
    if (buildProgress > 0.2) {
      let wallH = min(bh, 120);
      fill(30, 140, 70);
      rect(-bw / 2, 10 - wallH, bw, wallH);
      // Emerald sheen
      fill(46, 204, 113, 80);
      rect(-bw / 2, 10 - wallH, bw, wallH);
    }

    // Windows
    if (buildProgress > 0.4) {
      for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 3; col++) {
          let wx = -60 + col * 50;
          let wy = -100 + row * 50;
          fill(255, 230, 100, 180);
          rect(wx, wy, 25, 30, 3);
          // Window frame
          stroke(200, 170, 50);
          strokeWeight(2);
          noFill();
          rect(wx, wy, 25, 30, 3);
          line(wx + 12, wy, wx + 12, wy + 30);
          line(wx, wy + 15, wx + 25, wy + 15);
          noStroke();
        }
      }
    }

    // Door
    if (buildProgress > 0.5) {
      fill(139, 90, 43);
      rect(-15, -20, 30, 30, 5, 5, 0, 0);
      fill(241, 196, 15);
      ellipse(8, -5, 5, 5);
      // Arch
      fill(30, 140, 70);
      arc(0, -20, 34, 20, PI, TWO_PI);
    }

    // Roof
    if (buildProgress > 0.6) {
      fill(20, 100, 50);
      triangle(-bw / 2 - 15, -110, bw / 2 + 15, -110, 0, -175);
      // Roof shine
      fill(46, 204, 113, 60);
      triangle(-bw / 2 - 10, -110, bw / 2 + 10, -112, 0, -172);
    }

    // Towers
    if (buildProgress > 0.7) {
      for (let side = -1; side <= 1; side += 2) {
        let tx = side * (bw / 2 + 15);
        fill(25, 120, 60);
        rect(tx - 15, -130, 30, 140, 3);
        fill(46, 204, 113, 60);
        rect(tx - 15, -130, 30, 140, 3);
        // Tower roof
        fill(20, 100, 50);
        triangle(tx - 18, -130, tx + 18, -130, tx, -165);
        // Tower window
        fill(255, 230, 100, 160);
        ellipse(tx, -100, 14, 18);
      }
    }

    // Giant emerald on top
    if (buildProgress > 0.85) {
      let gemPulse = sin(frameCount * 0.05) * 3;
      drawEmeraldGem(0, -175 - 15 + gemPulse, 15 + gemPulse * 0.5);
      // Glow
      noStroke();
      fill(46, 204, 113, 30 + sin(frameCount * 0.08) * 20);
      ellipse(0, -190 + gemPulse, 60, 60);
    }

    // "$1,000,000,000" sign
    if (buildProgress > 0.9) {
      fill(0, 0, 0, 120);
      rect(-55, 30, 110, 25, 5);
      textAlign(CENTER, CENTER);
      textStyle(BOLD);
      textSize(14);
      fill(241, 196, 15);
      text('$1,000,000,000', 0, 42);
    }

    pop();
  }

  // Confetti
  for (let c of confettis) c.draw();

  // Villager (celebrating next to mansion)
  if (victoryTimer > 60) {
    villager.x = width / 2 + 140;
    villager.y = height * 0.48 + 20;
    villager.draw();
  }

  // Text
  if (victoryTimer > 90) {
    let alpha = min(255, (victoryTimer - 90) * 4);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);

    // YOU DID IT - golden glow
    textSize(48);
    fill(241, 196, 15, alpha * 0.3);
    text('YOU DID IT!', width / 2 + 2, height * 0.1 + 2);
    fill(241, 196, 15, alpha);
    text('YOU DID IT!', width / 2, height * 0.1);

    textSize(18);
    fill(255, 255, 255, alpha);
    text('You and the Villager built the', width / 2, height * 0.18);
    fill(46, 204, 113, alpha);
    textSize(22);
    text('Billion Dollar Emerald Mansion!', width / 2, height * 0.23);
  }

  // Stats
  if (victoryTimer > 150) {
    let alpha = min(255, (victoryTimer - 150) * 4);
    let statY = height * 0.78;
    textAlign(CENTER, CENTER);
    textSize(13);
    textStyle(NORMAL);
    fill(200, 200, 200, alpha);
    let timePlayed = floor((millis() - gameStartTime) / 1000);
    let mins = floor(timePlayed / 60);
    let secs = timePlayed % 60;
    text('Time: ' + mins + 'm ' + secs + 's  |  Emeralds Mined: ' + formatNumberFull(totalEmeraldsEarned) +
         '  |  Items Bought: ' + totalItemsBought, width / 2, statY);

    // Play again
    let pulse = sin(frameCount * 0.06) * 0.3 + 0.7;
    textStyle(BOLD);
    textSize(20);
    fill(46, 204, 113, alpha * pulse);
    text('Click to play again!', width / 2, height * 0.88);
  }

  textStyle(NORMAL);
}

// ==================== DRAWING: GAME OVER ====================

function drawGameOverScreen() {
  // Dark dim background
  for (let y = 0; y < height; y++) {
    let t = y / height;
    let c = lerpColor(color(30, 15, 15), color(20, 10, 10), t);
    stroke(c);
    line(0, y, width, y);
  }
  noStroke();

  // Sad villager walking away
  let walkOffset = min(gameOverTimer * 0.5, 100);
  push();
  translate(width / 2 + walkOffset, height * 0.45);
  // Simple sad villager
  fill(0, 0, 0, 30);
  noStroke();
  ellipse(0, 30, 40, 10);
  fill(101, 67, 33, 200);
  rect(-12, 18, 10, 7, 2);
  rect(2, 18, 10, 7, 2);
  fill(139, 90, 43, 200);
  rect(-14, -8, 28, 28, 4);
  fill(222, 184, 135, 200);
  rect(-12, -36, 24, 28, 4);
  fill(101, 67, 33, 200);
  rect(-13, -40, 26, 10, 4, 4, 0, 0);
  fill(200, 162, 114, 200);
  rect(-3, -24, 6, 9, 3);
  fill(60, 40, 20, 200);
  ellipse(-5, -28, 3, 4);
  ellipse(5, -28, 3, 4);
  fill(100, 180, 255, 150);
  ellipse(7, -24, 3, 4);
  ellipse(-7, -24, 3, 4);
  noFill();
  stroke(60, 40, 20, 200);
  strokeWeight(2);
  arc(0, -14, 12, 8, PI, TWO_PI);
  noStroke();
  // "..." thought
  if (gameOverTimer > 30) {
    fill(255, 255, 255, 150);
    textSize(20);
    textAlign(CENTER, CENTER);
    text('...', 0, -55);
  }
  pop();

  // Text
  if (gameOverTimer > 20) {
    let alpha = min(255, (gameOverTimer - 20) * 5);
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(40);
    fill(231, 76, 60, alpha);
    text('Game Over', width / 2, height * 0.15);

    textSize(18);
    textStyle(NORMAL);
    fill(200, 180, 180, alpha);
    text('The villager became too sad and left...', width / 2, height * 0.25);
    textSize(14);
    fill(150, 150, 150, alpha);
    text('Remember to share emeralds to keep them happy!', width / 2, height * 0.31);
  }

  // Stats
  if (gameOverTimer > 60) {
    let alpha = min(255, (gameOverTimer - 60) * 4);
    textAlign(CENTER, CENTER);
    textSize(13);
    fill(180, 180, 180, alpha);
    let timePlayed = floor((millis() - gameStartTime) / 1000);
    let mins = floor(timePlayed / 60);
    let secs = timePlayed % 60;
    text('Time: ' + mins + 'm ' + secs + 's  |  Emeralds Mined: ' + formatNumberFull(totalEmeraldsEarned),
         width / 2, height * 0.7);

    // Try again
    let pulse = sin(frameCount * 0.06) * 0.3 + 0.7;
    textStyle(BOLD);
    textSize(22);
    fill(46, 204, 113, alpha * pulse);
    text('Click to try again!', width / 2, height * 0.85);
  }

  textStyle(NORMAL);
}

// ==================== INPUT HANDLING ====================

function mousePressed() {
  if (gameState === 'intro') {
    if (introTimer > 80) {
      gameState = 'playing';
      gameStartTime = millis();
      villager.say('Thank you for helping me!');
    }
    return;
  }

  if (gameState === 'victory') {
    if (victoryTimer > 180) {
      resetGame();
    }
    return;
  }

  if (gameState === 'gameover') {
    if (gameOverTimer > 80) {
      resetGame();
    }
    return;
  }

  if (gameState !== 'playing') return;

  // Check shop panel clicks
  if (mouseX >= worldW) {
    handleShopClick();
    return;
  }

  // Check HUD clicks (share button)
  if (mouseY < hudH) {
    if (hoveredShareBtn) {
      shareWithVillager();
    }
    return;
  }

  // Click in world = mine!
  if (mouseX < worldW && mouseY > hudH) {
    mineAt(mouseX, mouseY);
  }
}

function handleShopClick() {
  if (hoveredShopItem < 0 || hoveredShopItem >= shopItems.length) return;
  let item = shopItems[hoveredShopItem];
  buyItem(item);
}

// ==================== GAME ACTIONS ====================

function getShareCost() {
  return max(5, floor(totalPassiveIncome * 0.8 + 5));
}

function shareWithVillager() {
  let cost = getShareCost();
  if (emeralds < cost) return;
  if (villager.happiness >= 100) return;

  emeralds -= cost;
  villager.happiness = min(100, villager.happiness + SHARE_HAPPINESS_RESTORE);
  villager.shareCount++;
  villager.totalShared += cost;

  // Visual feedback
  villager.celebrate('Thank you!');

  // Heart particles from villager
  for (let i = 0; i < 5; i++) {
    floatingTexts.push(new FloatingText(
      villager.x + random(-20, 20),
      villager.y - 30 + random(-10, 10),
      '\u2764',
      [255, 80, 100], 16
    ));
  }

  // Small emerald bonus back (10% returned as gratitude)
  let bonus = floor(cost * 0.1);
  if (bonus > 0) {
    emeralds += bonus;
    totalEmeraldsEarned += bonus;
    floatingTexts.push(new FloatingText(
      villager.x, villager.y - 50,
      '+' + bonus + ' back!',
      [46, 204, 113], 12
    ));
  }
}

function mineAt(mx, my) {
  // Combo
  combo++;
  comboTimer = COMBO_WINDOW;
  if (combo > bestCombo) bestCombo = combo;

  let comboMult = getComboMultiplier();
  let earned = clickPower * comboMult;

  emeralds += earned;
  totalEmeraldsEarned += earned;

  // Visual emerald drops
  let dropCount = min(5, 1 + floor(earned / 10));
  for (let i = 0; i < dropCount; i++) {
    emeraldDrops.push(new EmeraldDrop(mx + random(-8, 8), my, random(-3, 3), random(-5, -2), 1));
  }

  // Floating text
  let earnText = '+' + formatNumber(earned);
  if (comboMult > 1) earnText += ' (x' + comboMult + ')';
  let txtCol = comboMult >= 5 ? [255, 215, 0] :
               comboMult >= 3 ? [255, 165, 0] :
               comboMult >= 2 ? [46, 204, 113] : [200, 255, 200];
  floatingTexts.push(new FloatingText(mx + random(-10, 10), my - 10, earnText, txtCol, 14 + comboMult * 2));

  // Particles
  let pCount = 3 + comboMult;
  for (let i = 0; i < pCount; i++) {
    particles.push(new Particle(
      mx, my,
      random(-3, 3), random(-4, -1),
      [46, 204, 113], random(20, 40), random(3, 6)
    ));
  }
  // Dust particles
  for (let i = 0; i < 2; i++) {
    particles.push(new Particle(
      mx + random(-10, 10), my + random(-5, 5),
      random(-1, 1), random(-1, 0.5),
      [160, 140, 120], 15, 3
    ));
  }

  // Screen shake at high combo
  if (combo >= 10) {
    screenShakeAmount = min(6, combo * 0.15);
  }

  // Combo milestone speech
  if (combo === 10) villager.say('So fast!');
  else if (combo === 20) villager.say('INCREDIBLE!');
  else if (combo === 50) villager.say('UNSTOPPABLE!!!');
}

function buyItem(item) {
  let cost = getItemCost(item);
  if (emeralds < cost) return;

  emeralds -= cost;
  item.count++;
  totalItemsBought++;

  // Apply click power bonus
  if (item.clickPowerPerUnit) {
    clickPower += item.clickPowerPerUnit;
  }

  // Recalculate passive
  recalculatePassiveIncome();

  // Spawn visual entity in world
  spawnEntity(item.id);

  // Screen shake + particles
  screenShakeAmount = 5;
  let ex = worldW / 2;
  let ey = height / 2;
  for (let i = 0; i < 15; i++) {
    particles.push(new Particle(
      ex + random(-30, 30), ey + random(-30, 30),
      random(-3, 3), random(-4, -1),
      item.col, random(30, 50), random(3, 7)
    ));
  }

  // Floating text
  floatingTexts.push(new FloatingText(
    worldW / 2, height * 0.4,
    item.emoji + ' ' + item.name + '!',
    item.col, 22
  ));

  // Villager reactions
  if (totalItemsBought === 1) villager.say('Ooh, what\'s that?');
  else if (item.id === 'portal') villager.say('AMAZING!');
  else if (item.id === 'factory') villager.say('A whole factory!');
  else if (item.id === 'volcano') villager.say('A VOLCANO?!');
  else if (item.id === 'miner') villager.say('A robot helper!');
  else if (item.count === 1 && item.id === 'planter') villager.say('We\'re farming!');

  // Check for mansion win
  if (item.isMansion) {
    gameState = 'victory';
    victoryTimer = 0;
    villager.celebrate('WE DID IT!!!');
    // Massive confetti
    for (let i = 0; i < 80; i++) {
      confettis.push(new Confetti(random(width), random(-50, height * 0.3)));
    }
    screenShakeAmount = 15;
  }
}

function spawnEntity(itemId) {
  let x, y;
  switch (itemId) {
    case 'detector':
      x = random(worldW * 0.1, worldW * 0.85);
      y = groundLevel + random(5, 40);
      worldEntities.detectors.push(new DetectorDevice(x, y));
      break;
    case 'planter':
      x = random(worldW * 0.35, worldW * 0.8);
      y = groundLevel + random(8, 45);
      worldEntities.planters.push(new PlanterPlot(x, y));
      break;
    case 'sucker':
      worldEntities.suckers.push(new SuckerBot());
      break;
    case 'miner':
      worldEntities.miners.push(new MinerBot());
      break;
    case 'portal':
      x = random(worldW * 0.25, worldW * 0.75);
      y = hudH + worldH * random(0.25, 0.45);
      worldEntities.portals.push(new EmeraldPortal(x, y));
      break;
    case 'factory':
      x = random(worldW * 0.3, worldW * 0.75);
      y = groundLevel + random(5, 30);
      worldEntities.factories.push(new EmeraldFactory(x, y));
      break;
    case 'volcano':
      x = random(worldW * 0.15, worldW * 0.7);
      y = groundLevel + random(-5, 15);
      worldEntities.volcanos.push(new EmeraldVolcano(x, y));
      break;
  }
}

function resetGame() {
  emeralds = 0;
  totalEmeraldsEarned = 0;
  displayEmeralds = 0;
  clickPower = 1;
  totalPassiveIncome = 0;
  combo = 0;
  comboTimer = 0;
  bestCombo = 0;
  screenShakeAmount = 0;
  milestoneIndex = 0;
  milestoneNotification = null;
  milestoneTimer = 0;
  victoryTimer = 0;
  gameOverTimer = 0;
  totalItemsBought = 0;
  introTimer = 0;

  initShopItems();
  villager = new Villager();
  villager.init();

  worldEntities = { detectors: [], planters: [], suckers: [], miners: [], portals: [], factories: [], volcanos: [] };
  particles = [];
  floatingTexts = [];
  confettis = [];
  emeraldDrops = [];

  gameStartTime = millis();
  gameState = 'playing';
}
