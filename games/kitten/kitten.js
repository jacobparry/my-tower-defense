// ================================================
// KITTEN FINDER - A Forest Adventure Game
// Find 10 lost kittens in America's National Parks!
// ================================================

// ============== DATA & CONFIGURATION ==============

var FORESTS = [
  {
    name: "Yellowstone",
    subtitle: "Wyoming",
    skyTop: [135, 195, 235],
    skyBottom: [200, 225, 180],
    groundColor: [120, 155, 60],
    groundColor2: [95, 135, 45],
    treeType: "pine",
    ambientType: "steam",
    iconEmoji: "steam"
  },
  {
    name: "Yosemite",
    subtitle: "California",
    skyTop: [100, 170, 235],
    skyBottom: [170, 210, 240],
    groundColor: [80, 150, 55],
    groundColor2: [65, 125, 40],
    treeType: "pine",
    ambientType: "spray",
    iconEmoji: "waterfall"
  },
  {
    name: "Redwood",
    subtitle: "California",
    skyTop: [90, 120, 80],
    skyBottom: [120, 150, 100],
    groundColor: [60, 100, 40],
    groundColor2: [45, 80, 30],
    treeType: "redwood",
    ambientType: "motes",
    iconEmoji: "bigtree"
  },
  {
    name: "Smoky Mountains",
    subtitle: "Tennessee",
    skyTop: [150, 165, 200],
    skyBottom: [190, 200, 215],
    groundColor: [130, 110, 60],
    groundColor2: [110, 90, 45],
    treeType: "autumn",
    ambientType: "leaves",
    iconEmoji: "autumn"
  },
  {
    name: "Olympic",
    subtitle: "Washington",
    skyTop: [80, 110, 90],
    skyBottom: [100, 135, 105],
    groundColor: [40, 95, 40],
    groundColor2: [30, 75, 30],
    treeType: "mossy",
    ambientType: "rain",
    iconEmoji: "rain"
  }
];

var KITTENS = [
  {
    name: "Whiskers",
    personality: "the hungry adventurer",
    bodyColor: [255, 160, 60],
    darkColor: [200, 120, 40],
    eyeColor: [80, 190, 80],
    marking: "stripes",
    forestIndex: 0,
    neededItem: "fish",
    hint: "This kitten looks really hungry!",
    foundText: "Whiskers was hiding near the geyser because he was so hungry!"
  },
  {
    name: "Mittens",
    personality: "the playful climber",
    bodyColor: [240, 240, 248],
    darkColor: [170, 170, 185],
    eyeColor: [70, 140, 220],
    marking: "paws",
    forestIndex: 0,
    neededItem: "yarn",
    hint: "This kitten wants to play with something!",
    foundText: "Mittens was stuck in the pine tree and wanted to play!"
  },
  {
    name: "Shadow",
    personality: "the shy explorer",
    bodyColor: [55, 55, 60],
    darkColor: [35, 35, 40],
    eyeColor: [210, 190, 60],
    marking: "none",
    forestIndex: 1,
    neededItem: "flashlight",
    hint: "It's so dark in here! You can barely see...",
    foundText: "Shadow was hiding in the dark cave, too shy to come out!"
  },
  {
    name: "Sunny",
    personality: "the butterfly chaser",
    bodyColor: [255, 215, 80],
    darkColor: [235, 185, 55],
    eyeColor: [100, 185, 100],
    marking: "none",
    forestIndex: 1,
    neededItem: "feather",
    hint: "This kitten is watching something fly around...",
    foundText: "Sunny was chasing butterflies in the meadow!"
  },
  {
    name: "Patches",
    personality: "the curious sniffer",
    bodyColor: [255, 225, 185],
    darkColor: [235, 140, 60],
    eyeColor: [165, 125, 65],
    marking: "calico",
    forestIndex: 2,
    neededItem: "catnip",
    hint: "This kitten keeps sniffing the air...",
    foundText: "Patches was hiding in the big tree, sniffing for something yummy!"
  },
  {
    name: "Pebble",
    personality: "the tiny sleeper",
    bodyColor: [175, 175, 185],
    darkColor: [145, 145, 155],
    eyeColor: [100, 165, 210],
    marking: "none",
    forestIndex: 2,
    neededItem: "bell",
    hint: "You can barely hear a tiny purr...",
    foundText: "Pebble was sleeping under the ferns! The bell woke her up!"
  },
  {
    name: "Maple",
    personality: "the leaf diver",
    bodyColor: [225, 115, 50],
    darkColor: [185, 85, 30],
    eyeColor: [80, 165, 80],
    marking: "stripes",
    forestIndex: 3,
    neededItem: "fish",
    hint: "This kitten's tummy is rumbling!",
    foundText: "Maple was diving in the autumn leaves, too hungry to come out!"
  },
  {
    name: "Misty",
    personality: "the ghost kitty",
    bodyColor: [230, 230, 240],
    darkColor: [200, 200, 212],
    eyeColor: [155, 135, 210],
    marking: "none",
    forestIndex: 3,
    neededItem: "flashlight",
    hint: "It's so foggy! Something is hiding in the mist...",
    foundText: "Misty was playing in the fog like a little ghost!"
  },
  {
    name: "Fern",
    personality: "the nature lover",
    bodyColor: [165, 125, 80],
    darkColor: [135, 100, 60],
    eyeColor: [80, 175, 80],
    marking: "stripes",
    forestIndex: 4,
    neededItem: "catnip",
    hint: "This kitten is sniffing around the plants...",
    foundText: "Fern was hiding under the mushrooms, smelling all the plants!"
  },
  {
    name: "Luna",
    personality: "the stargazer",
    bodyColor: [90, 90, 105],
    darkColor: [65, 65, 80],
    eyeColor: [175, 175, 255],
    marking: "star",
    forestIndex: 4,
    neededItem: "feather",
    hint: "This kitten is watching something high up in the branches...",
    foundText: "Luna was up in the mossy tree, looking at the sky!"
  }
];

var ITEMS = [
  { id: "fish", name: "Fish", price: 5, desc: "Yummy! Kittens love fish!", color: [70, 150, 220] },
  { id: "flashlight", name: "Flashlight", price: 8, desc: "Lights up dark places!", color: [255, 220, 80] },
  { id: "yarn", name: "Yarn Ball", price: 5, desc: "Kittens can't resist playing!", color: [235, 80, 130] },
  { id: "catnip", name: "Catnip", price: 6, desc: "Smells amazing to kittens!", color: [80, 195, 80] },
  { id: "feather", name: "Feather Toy", price: 5, desc: "So fun to chase!", color: [185, 105, 225] },
  { id: "bell", name: "Bell", price: 4, desc: "Jingle jingle! Find hidden kittens!", color: [245, 205, 60] },
  { id: "milk", name: "Milk", price: 3, desc: "WARNING: Kittens run from milk!", color: [240, 240, 248], warning: true }
];

var SPOT_TEMPLATES = [
  // Forest 0: Yellowstone
  [
    { rx: 0.20, ry: 0.52, rSize: 0.09, type: "geyser", content: "kitten", kittenIndex: 0, label: "Steamy Geyser" },
    { rx: 0.75, ry: 0.40, rSize: 0.10, type: "pinetree", content: "kitten", kittenIndex: 1, label: "Tall Pine Tree" },
    { rx: 0.45, ry: 0.68, rSize: 0.08, type: "pool", content: "coins", coins: 5, label: "Hot Spring" },
    { rx: 0.88, ry: 0.62, rSize: 0.07, type: "rocks", content: "critter", critter: "butterfly", label: "Rock Pile" },
    { rx: 0.10, ry: 0.72, rSize: 0.07, type: "log", content: "coins", coins: 5, label: "Old Log" }
  ],
  // Forest 1: Yosemite
  [
    { rx: 0.15, ry: 0.60, rSize: 0.09, type: "cave", content: "kitten", kittenIndex: 2, label: "Dark Cave" },
    { rx: 0.58, ry: 0.53, rSize: 0.10, type: "flowers", content: "kitten", kittenIndex: 3, label: "Flower Meadow" },
    { rx: 0.82, ry: 0.48, rSize: 0.08, type: "rocks", content: "coins", coins: 5, label: "Waterfall Rocks" },
    { rx: 0.38, ry: 0.42, rSize: 0.07, type: "log", content: "critter", critter: "bunny", label: "Fallen Tree" },
    { rx: 0.90, ry: 0.70, rSize: 0.07, type: "bush", content: "coins", coins: 5, label: "Berry Bush" }
  ],
  // Forest 2: Redwood
  [
    { rx: 0.28, ry: 0.48, rSize: 0.10, type: "hollowtree", content: "kitten", kittenIndex: 4, label: "Hollow Tree" },
    { rx: 0.68, ry: 0.60, rSize: 0.09, type: "ferns", content: "kitten", kittenIndex: 5, label: "Fern Patch" },
    { rx: 0.48, ry: 0.38, rSize: 0.08, type: "mushroom", content: "coins", coins: 5, label: "Mushroom Ring" },
    { rx: 0.12, ry: 0.65, rSize: 0.07, type: "log", content: "critter", critter: "squirrel", label: "Log Bridge" },
    { rx: 0.85, ry: 0.55, rSize: 0.07, type: "rocks", content: "coins", coins: 5, label: "Mossy Rock" }
  ],
  // Forest 3: Smoky Mountains
  [
    { rx: 0.38, ry: 0.62, rSize: 0.10, type: "leaves", content: "kitten", kittenIndex: 6, label: "Leaf Pile" },
    { rx: 0.78, ry: 0.48, rSize: 0.09, type: "mist", content: "kitten", kittenIndex: 7, label: "Misty Hollow" },
    { rx: 0.18, ry: 0.55, rSize: 0.08, type: "stream", content: "coins", coins: 5, label: "Stream" },
    { rx: 0.55, ry: 0.40, rSize: 0.07, type: "stump", content: "critter", critter: "bird", label: "Tree Stump" },
    { rx: 0.90, ry: 0.68, rSize: 0.07, type: "bush", content: "coins", coins: 5, label: "Autumn Bush" }
  ],
  // Forest 4: Olympic Rainforest
  [
    { rx: 0.32, ry: 0.56, rSize: 0.09, type: "mushroom", content: "kitten", kittenIndex: 8, label: "Giant Mushroom" },
    { rx: 0.72, ry: 0.44, rSize: 0.10, type: "mossybranch", content: "kitten", kittenIndex: 9, label: "Mossy Branch" },
    { rx: 0.12, ry: 0.64, rSize: 0.07, type: "puddle", content: "coins", coins: 5, label: "Rain Puddle" },
    { rx: 0.50, ry: 0.50, rSize: 0.07, type: "vines", content: "critter", critter: "frog", label: "Vine Curtain" },
    { rx: 0.90, ry: 0.58, rSize: 0.07, type: "ferns", content: "coins", coins: 5, label: "Fern Cave" }
  ]
];

// ============== GAME STATE ==============

var gameState = "menu";
var prevState = "";
var coins = 25;
var ownedItems = {};
var foundKittens = [];
var currentForest = -1;
var currentSpotIndex = -1;
var forestSpots = [];
var particles = [];
var ambientParticles = [];

var menuFrame = 0;
var foundAnimTimer = 0;
var foundKittenIdx = -1;
var feedbackMsg = "";
var feedbackTimer = 0;
var feedbackX = 0;
var feedbackY = 0;
var milkScareTimer = 0;
var wrongItemTimer = 0;
var wrongItemId = "";
var transitionAlpha = 0;
var storyPage = 0;
var hoveredSpot = -1;
var selectedItem = "";
var winTimer = 0;
var mapHoveredForest = -1;
var shopHoveredItem = -1;
var collectedSpots = {};

// ============== P5 CORE ==============

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Arial");
  initGame();
}

function initGame() {
  coins = 25;
  ownedItems = {};
  foundKittens = [];
  for (var i = 0; i < 10; i++) foundKittens.push(false);
  currentForest = -1;
  currentSpotIndex = -1;
  forestSpots = [];
  particles = [];
  ambientParticles = [];
  gameState = "menu";
  transitionAlpha = 0;
  winTimer = 0;
  collectedSpots = {};
}

function draw() {
  menuFrame++;

  switch (gameState) {
    case "menu": drawMenu(); break;
    case "story": drawStory(); break;
    case "map": drawMap(); break;
    case "shop": drawShop(); break;
    case "forest": drawForest(); break;
    case "investigate": drawInvestigate(); break;
    case "found": drawFound(); break;
    case "collection": drawCollection(); break;
    case "win": drawWin(); break;
  }

  updateAndDrawParticles();

  if (transitionAlpha > 0) {
    noStroke();
    fill(0, 0, 0, transitionAlpha);
    rect(0, 0, width, height);
    transitionAlpha = max(0, transitionAlpha - 12);
  }

  if (feedbackTimer > 0) {
    drawFeedback();
    feedbackTimer--;
  }
}

function mousePressed() {
  if (transitionAlpha > 30) return;

  switch (gameState) {
    case "menu": handleMenuClick(); break;
    case "story": handleStoryClick(); break;
    case "map": handleMapClick(); break;
    case "shop": handleShopClick(); break;
    case "forest": handleForestClick(); break;
    case "investigate": handleInvestigateClick(); break;
    case "found": handleFoundClick(); break;
    case "collection": handleCollectionClick(); break;
    case "win": handleWinClick(); break;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// ============== SCREEN: MENU ==============

function drawMenu() {
  // Forest background
  drawMenuBackground();

  // Darkening overlay
  noStroke();
  fill(0, 0, 0, 80);
  rect(0, 0, width, height);

  // Title
  var titleY = height * 0.28;
  var titleSize = min(width, height) * 0.09;

  // Title glow
  fill(255, 200, 100, 40 + sin(menuFrame * 0.03) * 20);
  noStroke();
  ellipse(width / 2, titleY, titleSize * 8, titleSize * 3);

  // Title text with shadow
  textAlign(CENTER, CENTER);
  textSize(titleSize);
  textStyle(BOLD);
  fill(80, 50, 20);
  text("KITTEN FINDER", width / 2 + 3, titleY + 3);
  fill(255, 230, 160);
  text("KITTEN FINDER", width / 2, titleY);

  // Subtitle
  textSize(titleSize * 0.3);
  textStyle(NORMAL);
  fill(255, 255, 255, 200);
  text("A Forest Adventure", width / 2, titleY + titleSize * 0.7);

  // Draw cute kittens peeking from sides
  drawMenuKittens();

  // Play button
  var btnY = height * 0.6;
  var btnW = min(width * 0.4, 280);
  var btnH = min(height * 0.08, 65);
  var btnHover = isInRect(mouseX, mouseY, width / 2, btnY, btnW, btnH);
  drawButton(width / 2, btnY, btnW, btnH, "PLAY!", [100, 200, 100], btnHover);

  // Paw prints decoration
  drawPawPrints(width / 2, height * 0.75, menuFrame);

  // Back to games link hint
  textSize(min(width, height) * 0.02);
  fill(255, 255, 255, 120);
  textAlign(CENTER, CENTER);
  text("Press ESC for game hub", width / 2, height * 0.93);
}

function drawMenuBackground() {
  // Gradient sky
  for (var y = 0; y < height; y++) {
    var t = y / height;
    var r = lerp(60, 25, t);
    var g = lerp(120, 60, t);
    var b = lerp(60, 30, t);
    stroke(r, g, b);
    line(0, y, width, y);
  }

  // Trees silhouette
  fill(20, 50, 20);
  noStroke();
  for (var i = 0; i < 15; i++) {
    var tx = (i / 14) * width * 1.2 - width * 0.1;
    var th = height * (0.3 + sin(i * 1.5) * 0.15);
    var tw = width * 0.08;
    triangle(tx, height, tx - tw, height, tx - tw / 2, height - th);
  }

  // Fireflies
  for (var i = 0; i < 12; i++) {
    var fx = (sin(menuFrame * 0.01 + i * 2.1) * 0.5 + 0.5) * width;
    var fy = (sin(menuFrame * 0.008 + i * 1.7) * 0.3 + 0.4) * height;
    var fa = (sin(menuFrame * 0.05 + i * 3.3) * 0.5 + 0.5) * 200;
    fill(255, 255, 150, fa);
    noStroke();
    ellipse(fx, fy, 6, 6);
    fill(255, 255, 150, fa * 0.3);
    ellipse(fx, fy, 16, 16);
  }
}

function drawMenuKittens() {
  var kitSize = min(width, height) * 0.18;

  // Left kitten peeking
  push();
  var lx = width * 0.12;
  var ly = height * 0.75;
  var lBob = sin(menuFrame * 0.04) * 5;
  drawKittenCharacter(lx, ly + lBob, kitSize, 0, "idle");
  pop();

  // Right kitten peeking
  push();
  var rx = width * 0.88;
  var ry = height * 0.73;
  var rBob = sin(menuFrame * 0.04 + 1) * 5;
  drawKittenCharacter(rx, ry + rBob, kitSize, 3, "idle");
  pop();

  // Center bottom kitten
  if (width > 500) {
    var cx = width * 0.5;
    var cy = height * 0.88;
    var cBob = sin(menuFrame * 0.04 + 2) * 4;
    drawKittenCharacter(cx, cy + cBob, kitSize * 0.7, 9, "idle");
  }
}

function handleMenuClick() {
  var btnY = height * 0.6;
  var btnW = min(width * 0.4, 280);
  var btnH = min(height * 0.08, 65);
  if (isInRect(mouseX, mouseY, width / 2, btnY, btnW, btnH)) {
    gameState = "story";
    storyPage = 0;
    transitionAlpha = 200;
  }
}

// ============== SCREEN: STORY ==============

function drawStory() {
  // Warm background
  background(45, 35, 55);

  // Stars
  fill(255, 255, 200, 150);
  noStroke();
  for (var i = 0; i < 40; i++) {
    var sx = (sin(i * 7.3) * 0.5 + 0.5) * width;
    var sy = (cos(i * 5.1) * 0.5 + 0.5) * height * 0.5;
    var ss = 2 + sin(menuFrame * 0.05 + i) * 1;
    ellipse(sx, sy, ss, ss);
  }

  var cy = height * 0.5;
  var maxW = min(width * 0.85, 700);

  if (storyPage === 0) {
    // Sad scene - kittens running into forest
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(min(width, height) * 0.055);
    fill(255, 200, 100);
    text("Oh no!", width / 2, height * 0.15);

    textStyle(NORMAL);
    textSize(min(width, height) * 0.032);
    fill(255, 255, 255, 230);
    textWrap(WORD);
    textLeading(min(width, height) * 0.05);
    text(
      "Your 10 adorable kittens escaped and\ngot lost in the forest!",
      width / 2, height * 0.30
    );

    // Draw scattered kitten silhouettes
    for (var i = 0; i < 10; i++) {
      var kx = width * 0.15 + (i % 5) * (width * 0.17);
      var ky = height * 0.48 + floor(i / 5) * (height * 0.14);
      var kb = sin(menuFrame * 0.06 + i * 0.7) * 4;
      drawKittenCharacter(kx, ky + kb, min(width, height) * 0.09, i, "idle");
    }

    textSize(min(width, height) * 0.028);
    fill(255, 255, 255, 180);
    text(
      "They're hiding in national parks all over the country.\nCan you find them all?",
      width / 2, height * 0.78
    );
  } else {
    // Tips page
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(min(width, height) * 0.045);
    fill(255, 200, 100);
    text("How to Find Kittens", width / 2, height * 0.12);

    textStyle(NORMAL);
    var tipSize = min(width, height) * 0.028;
    textSize(tipSize);
    fill(255, 255, 255, 220);

    var tips = [
      "Use FISH to lure hungry kittens!",
      "Use a FLASHLIGHT in dark places!",
      "Use YARN, FEATHERS, and more!",
      "DON'T use MILK - kittens run away!",
      "Buy items at the SHOP!",
      "Travel between forests anytime!"
    ];

    var startY = height * 0.24;
    var gap = min(height * 0.09, 55);
    for (var i = 0; i < tips.length; i++) {
      var tipY = startY + i * gap;
      var icon = ["fish", "flashlight", "yarn", "milk", "coins", "map"][i];
      drawItemMiniIcon(icon, width / 2 - maxW * 0.35, tipY, gap * 0.5);
      textAlign(LEFT, CENTER);
      fill(255, 255, 255, 220);
      text(tips[i], width / 2 - maxW * 0.22, tipY);
    }
    textAlign(CENTER, CENTER);
  }

  // Next / Go button
  var btnLabel = storyPage === 0 ? "NEXT" : "LET'S GO!";
  var btnY = height * 0.91;
  var btnW = min(width * 0.35, 220);
  var btnH = min(height * 0.07, 55);
  var btnHover = isInRect(mouseX, mouseY, width / 2, btnY, btnW, btnH);
  drawButton(width / 2, btnY, btnW, btnH, btnLabel, [100, 180, 240], btnHover);

  // Page dots
  for (var i = 0; i < 2; i++) {
    fill(i === storyPage ? 255 : 100);
    noStroke();
    ellipse(width / 2 - 10 + i * 20, height * 0.96, 8, 8);
  }
}

function handleStoryClick() {
  var btnY = height * 0.91;
  var btnW = min(width * 0.35, 220);
  var btnH = min(height * 0.07, 55);
  if (isInRect(mouseX, mouseY, width / 2, btnY, btnW, btnH)) {
    if (storyPage === 0) {
      storyPage = 1;
      transitionAlpha = 100;
    } else {
      gameState = "map";
      transitionAlpha = 200;
    }
  }
}

// ============== SCREEN: MAP ==============

function drawMap() {
  // Background - soft parchment
  drawMapBackground();

  // Title
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(min(width, height) * 0.045);
  fill(80, 50, 20);
  text("Choose a Forest!", width / 2, height * 0.07);

  // Kitten counter
  var foundCount = countFoundKittens();
  textStyle(NORMAL);
  textSize(min(width, height) * 0.025);
  fill(120, 80, 40);
  text("Kittens Found: " + foundCount + " / 10", width / 2, height * 0.12);

  // Coin counter
  drawCoinHUD(width - 80, height * 0.06);

  // Forest cards - 2 rows
  var cardW = min(width * 0.17, 180);
  var cardH = min(height * 0.32, 250);
  var gap = min(width * 0.02, 15);
  var totalW = 5 * cardW + 4 * gap;

  // If screen is narrow, use 2 rows
  var useRows = width < 700;
  mapHoveredForest = -1;

  if (useRows) {
    cardW = min(width * 0.28, 160);
    cardH = min(height * 0.28, 200);
    // Row 1: 3 cards
    for (var i = 0; i < 3; i++) {
      var cx = width / 2 + (i - 1) * (cardW + gap);
      var cy = height * 0.35;
      drawForestCard(i, cx, cy, cardW, cardH);
    }
    // Row 2: 2 cards
    for (var i = 3; i < 5; i++) {
      var cx = width / 2 + (i - 3.5) * (cardW + gap);
      var cy = height * 0.35 + cardH + gap * 2;
      drawForestCard(i, cx, cy, cardW, cardH);
    }
  } else {
    var startX = (width - totalW) / 2 + cardW / 2;
    for (var i = 0; i < 5; i++) {
      var cx = startX + i * (cardW + gap);
      var cy = height * 0.42;
      drawForestCard(i, cx, cy, cardW, cardH);
    }
  }

  // Bottom buttons: Shop and Collection
  var bbY = useRows ? height * 0.87 : height * 0.78;
  var bbW = min(width * 0.22, 160);
  var bbH = min(height * 0.065, 50);
  var shopHover = isInRect(mouseX, mouseY, width * 0.35, bbY, bbW, bbH);
  var collHover = isInRect(mouseX, mouseY, width * 0.65, bbY, bbW, bbH);
  drawButton(width * 0.35, bbY, bbW, bbH, "SHOP", [220, 160, 60], shopHover);
  drawButton(width * 0.65, bbY, bbW, bbH, "MY KITTENS", [200, 100, 160], collHover);

  // Back to hub
  var backHover = isInRect(mouseX, mouseY, 60, 30, 90, 35);
  drawSmallButton(60, 30, 90, 35, "HOME", backHover);
}

function drawMapBackground() {
  // Warm parchment gradient
  for (var y = 0; y < height; y++) {
    var t = y / height;
    stroke(lerp(240, 220, t), lerp(225, 200, t), lerp(190, 165, t));
    line(0, y, width, y);
  }

  // Subtle texture dots
  noStroke();
  fill(180, 160, 130, 30);
  for (var i = 0; i < 100; i++) {
    var dx = (sin(i * 13.7) * 0.5 + 0.5) * width;
    var dy = (cos(i * 17.3) * 0.5 + 0.5) * height;
    ellipse(dx, dy, 3, 3);
  }
}

function drawForestCard(idx, cx, cy, w, h) {
  var hovered = isInRect(mouseX, mouseY, cx, cy, w, h);
  if (hovered) mapHoveredForest = idx;

  push();
  // Card shadow
  noStroke();
  fill(0, 0, 0, 30);
  rect(cx - w / 2 + 4, cy - h / 2 + 4, w, h, 12);

  // Card background
  var f = FORESTS[idx];
  if (hovered) {
    fill(255, 245, 220);
    stroke(255, 180, 60);
    strokeWeight(3);
  } else {
    fill(255, 250, 235);
    stroke(200, 180, 150);
    strokeWeight(1);
  }
  rect(cx - w / 2, cy - h / 2, w, h, 12);

  // Mini forest scene at top
  noStroke();
  drawMiniForest(idx, cx, cy - h * 0.18, w * 0.85, h * 0.38);

  // Forest name
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(min(w * 0.14, 16));
  fill(70, 50, 30);
  text(f.name, cx, cy + h * 0.22);

  // Subtitle
  textStyle(NORMAL);
  textSize(min(w * 0.1, 11));
  fill(140, 120, 90);
  text(f.subtitle, cx, cy + h * 0.32);

  // Kitten status icons
  var kittensInForest = getKittensInForest(idx);
  var iconSize = min(w * 0.12, 16);
  for (var i = 0; i < kittensInForest.length; i++) {
    var ix = cx + (i - 0.5) * iconSize * 1.8;
    var iy = cy + h * 0.42;
    if (foundKittens[kittensInForest[i]]) {
      // Found - colored paw
      fill(KITTENS[kittensInForest[i]].bodyColor[0], KITTENS[kittensInForest[i]].bodyColor[1], KITTENS[kittensInForest[i]].bodyColor[2]);
      drawPaw(ix, iy, iconSize);
    } else {
      // Not found - gray question mark
      fill(180, 175, 170);
      ellipse(ix, iy, iconSize, iconSize);
      fill(255);
      textSize(iconSize * 0.6);
      text("?", ix, iy - 1);
    }
  }

  pop();
}

function drawMiniForest(idx, cx, cy, w, h) {
  // Tiny forest preview
  push();
  // Clip area approximation - just draw within bounds
  var f = FORESTS[idx];
  var left = cx - w / 2;
  var top = cy - h / 2;

  // Sky
  fill(f.skyTop[0], f.skyTop[1], f.skyTop[2]);
  noStroke();
  rect(left, top, w, h * 0.6, 8, 8, 0, 0);

  // Ground
  fill(f.groundColor[0], f.groundColor[1], f.groundColor[2]);
  rect(left, top + h * 0.5, w, h * 0.5, 0, 0, 8, 8);

  // Simple trees
  var treeC = getTreeColor(idx);
  fill(treeC[0], treeC[1], treeC[2]);
  for (var i = 0; i < 5; i++) {
    var tx = left + w * 0.1 + (i / 4) * w * 0.8;
    var ty = top + h * 0.5;
    var th = h * (0.35 + sin(i * 2.3) * 0.1);
    triangle(tx - w * 0.06, ty, tx + w * 0.06, ty, tx, ty - th);
  }

  // Unique feature icon
  drawForestFeature(idx, cx, top + h * 0.35, min(w, h) * 0.25);

  pop();
}

function getTreeColor(idx) {
  var colors = [
    [35, 85, 35],   // Yellowstone - dark pine
    [25, 75, 30],   // Yosemite - forest green
    [100, 55, 25],  // Redwood - reddish brown
    [200, 110, 40], // Smoky - autumn orange
    [30, 80, 35]    // Olympic - deep green
  ];
  return colors[idx];
}

function drawForestFeature(idx, x, y, s) {
  push();
  noStroke();
  if (idx === 0) {
    // Yellowstone - geyser steam
    fill(200, 220, 255, 150);
    ellipse(x, y, s * 0.5, s);
    fill(100, 180, 230, 100);
    ellipse(x, y + s * 0.3, s * 0.6, s * 0.3);
  } else if (idx === 1) {
    // Yosemite - waterfall
    fill(180, 190, 200);
    rect(x - s * 0.4, y - s * 0.4, s * 0.3, s * 0.9);
    fill(200, 230, 255, 180);
    rect(x - s * 0.35, y - s * 0.3, s * 0.2, s * 0.8);
  } else if (idx === 2) {
    // Redwood - big tree trunk
    fill(120, 65, 30);
    rect(x - s * 0.12, y - s * 0.3, s * 0.24, s * 0.7);
    fill(60, 130, 50);
    ellipse(x, y - s * 0.4, s * 0.6, s * 0.4);
  } else if (idx === 3) {
    // Smoky - autumn leaves
    var lcolors = [[220, 80, 40], [240, 180, 40], [200, 50, 30]];
    for (var i = 0; i < 5; i++) {
      var lc = lcolors[i % 3];
      fill(lc[0], lc[1], lc[2], 200);
      var lx = x + sin(i * 2.5) * s * 0.3;
      var ly = y + cos(i * 1.8) * s * 0.2;
      ellipse(lx, ly, s * 0.2, s * 0.15);
    }
  } else {
    // Olympic - rain drops
    stroke(150, 200, 220, 150);
    strokeWeight(1);
    for (var i = 0; i < 6; i++) {
      var rx = x - s * 0.4 + i * s * 0.16;
      var ry = y - s * 0.3 + (i % 3) * s * 0.2;
      line(rx, ry, rx - 2, ry + s * 0.15);
    }
  }
  pop();
}

function handleMapClick() {
  // Back button
  if (isInRect(mouseX, mouseY, 60, 30, 90, 35)) {
    window.location.href = "../../index.html";
    return;
  }

  // Forest cards
  if (mapHoveredForest >= 0) {
    currentForest = mapHoveredForest;
    enterForest(currentForest);
    gameState = "forest";
    transitionAlpha = 200;
    return;
  }

  // Bottom buttons
  var useRows = width < 700;
  var bbY = useRows ? height * 0.87 : height * 0.78;
  var bbW = min(width * 0.22, 160);
  var bbH = min(height * 0.065, 50);

  if (isInRect(mouseX, mouseY, width * 0.35, bbY, bbW, bbH)) {
    gameState = "shop";
    transitionAlpha = 200;
    return;
  }
  if (isInRect(mouseX, mouseY, width * 0.65, bbY, bbW, bbH)) {
    gameState = "collection";
    transitionAlpha = 200;
    return;
  }
}

// ============== SCREEN: SHOP ==============

function drawShop() {
  // Background
  for (var y = 0; y < height; y++) {
    var t = y / height;
    stroke(lerp(255, 240, t), lerp(240, 215, t), lerp(210, 175, t));
    line(0, y, width, y);
  }

  // Title
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(min(width, height) * 0.05);
  fill(130, 80, 30);
  text("SHOP", width / 2, height * 0.07);

  // Coin counter
  drawCoinHUD(width / 2, height * 0.13);

  // Items grid
  var cols = width > 600 ? 4 : 2;
  var itemW = min(width / (cols + 1), 160);
  var itemH = min(height * 0.2, 160);
  var gap = min(width * 0.02, 12);
  shopHoveredItem = -1;

  for (var i = 0; i < ITEMS.length; i++) {
    var col = i % cols;
    var row = floor(i / cols);
    var totalRowW = cols * itemW + (cols - 1) * gap;
    var startX = (width - totalRowW) / 2 + itemW / 2;
    var ix = startX + col * (itemW + gap);
    var iy = height * 0.25 + row * (itemH + gap);
    drawShopItem(i, ix, iy, itemW, itemH);
  }

  // Back button
  var backHover = isInRect(mouseX, mouseY, width / 2, height * 0.92, 120, 45);
  drawButton(width / 2, height * 0.92, 120, 45, "BACK", [150, 130, 110], backHover);
}

function drawShopItem(idx, cx, cy, w, h) {
  var item = ITEMS[idx];
  var owned = ownedItems[item.id];
  var canAfford = coins >= item.price;
  var hovered = isInRect(mouseX, mouseY, cx, cy, w, h);
  if (hovered && !owned) shopHoveredItem = idx;

  push();
  // Card
  noStroke();
  fill(0, 0, 0, 20);
  rect(cx - w / 2 + 3, cy - h / 2 + 3, w, h, 10);

  if (owned) {
    fill(200, 240, 200);
    stroke(100, 200, 100);
  } else if (hovered && canAfford) {
    fill(255, 250, 230);
    stroke(255, 200, 80);
  } else {
    fill(255, 252, 245);
    stroke(200, 190, 175);
  }
  strokeWeight(2);
  rect(cx - w / 2, cy - h / 2, w, h, 10);

  // Warning border for milk
  if (item.warning && !owned) {
    stroke(230, 60, 60, 150);
    strokeWeight(2);
    noFill();
    rect(cx - w / 2 + 2, cy - h / 2 + 2, w - 4, h - 4, 8);
  }

  // Item icon
  var iconSize = min(w * 0.4, h * 0.3);
  drawItemIcon(item.id, cx, cy - h * 0.18, iconSize);

  // Name
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(min(w * 0.14, 14));
  fill(item.warning ? 200 : 70, item.warning ? 50 : 50, item.warning ? 50 : 30);
  text(item.name, cx, cy + h * 0.12);

  // Price or "OWNED"
  textStyle(NORMAL);
  textSize(min(w * 0.12, 12));
  if (owned) {
    fill(60, 160, 60);
    text("OWNED!", cx, cy + h * 0.28);
  } else {
    fill(canAfford ? [180, 140, 40] : [200, 80, 80]);
    text(item.price + " coins", cx, cy + h * 0.28);
  }

  // Description
  textSize(min(w * 0.1, 10));
  fill(item.warning ? [200, 60, 60] : [130, 110, 80]);
  text(item.desc, cx, cy + h * 0.4);

  pop();
}

function handleShopClick() {
  // Back button
  if (isInRect(mouseX, mouseY, width / 2, height * 0.92, 120, 45)) {
    gameState = "map";
    transitionAlpha = 150;
    return;
  }

  // Item click
  if (shopHoveredItem >= 0) {
    var item = ITEMS[shopHoveredItem];
    if (!ownedItems[item.id] && coins >= item.price) {
      coins -= item.price;
      ownedItems[item.id] = true;
      spawnSparkles(mouseX, mouseY, 8);
      showFeedback("Got " + item.name + "!", mouseX, mouseY - 30);
    } else if (ownedItems[item.id]) {
      showFeedback("Already owned!", mouseX, mouseY - 30);
    } else {
      showFeedback("Need more coins!", mouseX, mouseY - 30);
    }
  }
}

// ============== SCREEN: FOREST ==============

function enterForest(idx) {
  forestSpots = [];
  var templates = SPOT_TEMPLATES[idx];
  for (var i = 0; i < templates.length; i++) {
    var t = templates[i];
    var spot = {
      rx: t.rx,
      ry: t.ry,
      rSize: t.rSize,
      type: t.type,
      content: t.content,
      kittenIndex: t.kittenIndex !== undefined ? t.kittenIndex : -1,
      coins: t.coins || 0,
      critter: t.critter || "",
      label: t.label,
      investigated: false,
      scared: false
    };
    // If kitten already found, mark investigated
    if (spot.content === "kitten" && foundKittens[spot.kittenIndex]) {
      spot.investigated = true;
    }
    // Reset coin spots (can collect again each visit)
    var spotKey = idx + "_" + i;
    if (spot.content === "coins" && collectedSpots[spotKey]) {
      spot.investigated = true;
    }
    forestSpots.push(spot);
  }
  ambientParticles = [];
  hoveredSpot = -1;
  selectedItem = "";
  milkScareTimer = 0;
}

function drawForest() {
  // Draw forest background
  drawForestBackground(currentForest);

  // Draw ambient particles
  updateAmbientParticles(currentForest);
  drawAmbientParticles();

  // Draw hiding spots
  hoveredSpot = -1;
  for (var i = 0; i < forestSpots.length; i++) {
    var spot = forestSpots[i];
    var sx = spot.rx * width;
    var sy = spot.ry * height;
    var ss = spot.rSize * min(width, height);
    var hovered = dist(mouseX, mouseY, sx, sy) < ss;
    if (hovered && !spot.investigated) hoveredSpot = i;
    drawSpot(spot, sx, sy, ss, hovered && !spot.investigated, i);
  }

  // Milk scare overlay
  if (milkScareTimer > 0) {
    drawMilkScare();
    milkScareTimer--;
  }

  // HUD
  drawForestHUD();
}

function drawForestHUD() {
  // Top bar
  noStroke();
  fill(0, 0, 0, 100);
  rect(0, 0, width, height * 0.08);

  // Forest name
  textAlign(LEFT, CENTER);
  textStyle(BOLD);
  textSize(min(width, height) * 0.028);
  fill(255);
  text(FORESTS[currentForest].name, 100, height * 0.04);

  // Kitten count for this forest
  var fk = getKittensInForest(currentForest);
  var fkFound = 0;
  for (var i = 0; i < fk.length; i++) {
    if (foundKittens[fk[i]]) fkFound++;
  }
  textStyle(NORMAL);
  textSize(min(width, height) * 0.02);
  fill(255, 220, 150);
  text("Kittens: " + fkFound + "/" + fk.length, 100, height * 0.065);

  // Coins
  drawCoinHUD(width - 80, height * 0.04);

  // Back button
  var backHover = isInRect(mouseX, mouseY, 40, height * 0.04, 65, 30);
  drawSmallButton(40, height * 0.04, 65, 30, "MAP", backHover);

  // Help hint at bottom
  if (hoveredSpot >= 0) {
    var spot = forestSpots[hoveredSpot];
    textAlign(CENTER, CENTER);
    textStyle(NORMAL);
    textSize(min(width, height) * 0.025);

    // Background pill
    var tw = textWidth(spot.label) + 30;
    noStroke();
    fill(0, 0, 0, 150);
    rect(width / 2 - tw / 2, height * 0.9, tw, 30, 15);
    fill(255);
    text(spot.label, width / 2, height * 0.9 + 15);
  }
}

function handleForestClick() {
  // Back button
  if (isInRect(mouseX, mouseY, 40, height * 0.04, 65, 30)) {
    gameState = "map";
    transitionAlpha = 150;
    return;
  }

  // Spot click
  if (hoveredSpot >= 0) {
    var spot = forestSpots[hoveredSpot];
    if (spot.investigated) return;

    if (spot.content === "kitten") {
      // Enter investigate mode
      currentSpotIndex = hoveredSpot;
      selectedItem = "";
      wrongItemTimer = 0;
      gameState = "investigate";
      transitionAlpha = 150;
    } else if (spot.content === "coins") {
      // Collect coins!
      coins += spot.coins;
      spot.investigated = true;
      var spotKey = currentForest + "_" + hoveredSpot;
      collectedSpots[spotKey] = true;
      spawnSparkles(spot.rx * width, spot.ry * height, 12);
      showFeedback("+" + spot.coins + " coins!", spot.rx * width, spot.ry * height - 30);
    } else if (spot.content === "critter") {
      // Cute critter!
      spot.investigated = true;
      var critterMsgs = {
        butterfly: "A pretty butterfly! Not a kitten...",
        bunny: "A cute bunny! Not a kitten though!",
        squirrel: "A silly squirrel! Keep looking!",
        bird: "A little bird! But where are the kittens?",
        frog: "Ribbit! Just a frog. Keep searching!"
      };
      spawnSparkles(spot.rx * width, spot.ry * height, 6);
      showFeedback(critterMsgs[spot.critter] || "Not a kitten!", spot.rx * width, spot.ry * height - 30);
    }
  }
}

// ============== SCREEN: INVESTIGATE ==============

function drawInvestigate() {
  // Dim forest background
  drawForestBackground(currentForest);
  noStroke();
  fill(0, 0, 0, 150);
  rect(0, 0, width, height);

  var spot = forestSpots[currentSpotIndex];
  var kitten = KITTENS[spot.kittenIndex];

  // Investigation panel
  var panelW = min(width * 0.85, 600);
  var panelH = min(height * 0.8, 500);
  var panelX = width / 2;
  var panelY = height * 0.45;

  // Panel background
  noStroke();
  fill(0, 0, 0, 40);
  rect(panelX - panelW / 2 + 5, panelY - panelH / 2 + 5, panelW, panelH, 20);
  fill(250, 245, 235);
  stroke(200, 180, 150);
  strokeWeight(3);
  rect(panelX - panelW / 2, panelY - panelH / 2, panelW, panelH, 20);

  // Hiding spot visual - kitten peeking
  var peekY = panelY - panelH * 0.18;
  drawKittenPeek(panelX, peekY, panelW * 0.3, spot.kittenIndex, spot.scared);

  // "Meow!" text
  if (!spot.scared) {
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(min(panelW, panelH) * 0.06);
    fill(255, 150, 100);
    var meowBob = sin(menuFrame * 0.1) * 3;
    text("Meow!", panelX, panelY - panelH * 0.35 + meowBob);
  }

  // Hint text
  textStyle(NORMAL);
  textSize(min(panelW, panelH) * 0.045);
  fill(80, 60, 40);
  textAlign(CENTER, CENTER);

  if (spot.scared) {
    fill(200, 60, 60);
    text("Oh no! The kitten ran away!", panelX, panelY + panelH * 0.02);
    textSize(min(panelW, panelH) * 0.035);
    fill(140, 100, 70);
    text("Come back later and try again!", panelX, panelY + panelH * 0.1);
  } else if (wrongItemTimer > 0) {
    fill(200, 120, 40);
    text("Hmm, that didn't work!", panelX, panelY + panelH * 0.02);
    textSize(min(panelW, panelH) * 0.035);
    fill(140, 100, 70);
    text("Try something else!", panelX, panelY + panelH * 0.1);
    wrongItemTimer--;
  } else {
    text(kitten.hint, panelX, panelY + panelH * 0.02);
  }

  // Item inventory
  if (!spot.scared) {
    var itemY = panelY + panelH * 0.25;
    textAlign(CENTER, CENTER);
    textSize(min(panelW, panelH) * 0.03);
    fill(140, 120, 90);
    text("Choose an item:", panelX, itemY - panelH * 0.06);

    var ownedList = getOwnedItemsList();
    if (ownedList.length === 0) {
      fill(180, 100, 60);
      text("You don't have any items! Visit the shop.", panelX, itemY);
    } else {
      var iSize = min(panelW / (ownedList.length + 1), panelH * 0.12, 55);
      var totalIW = ownedList.length * iSize * 1.5;
      var startIX = panelX - totalIW / 2 + iSize * 0.75;
      for (var i = 0; i < ownedList.length; i++) {
        var iix = startIX + i * iSize * 1.5;
        var iiy = itemY + iSize * 0.2;
        var itemHovered = dist(mouseX, mouseY, iix, iiy) < iSize * 0.7;
        drawItemButton(ownedList[i], iix, iiy, iSize, itemHovered);
      }
    }
  }

  // Close/Back button
  var cbY = panelY + panelH * 0.42;
  var cbHover = isInRect(mouseX, mouseY, panelX, cbY, 100, 36);
  drawButton(panelX, cbY, 100, 36, "BACK", [160, 140, 120], cbHover);
}

function handleInvestigateClick() {
  var spot = forestSpots[currentSpotIndex];
  var panelW = min(width * 0.85, 600);
  var panelH = min(height * 0.8, 500);
  var panelX = width / 2;
  var panelY = height * 0.45;

  // Close button
  var cbY = panelY + panelH * 0.42;
  if (isInRect(mouseX, mouseY, panelX, cbY, 100, 36)) {
    gameState = "forest";
    transitionAlpha = 100;
    if (spot.scared) {
      spot.investigated = true;
    }
    return;
  }

  // Item clicks
  if (spot.scared) return;

  var ownedList = getOwnedItemsList();
  var itemY = panelY + panelH * 0.25;
  var iSize = min(panelW / (ownedList.length + 1), panelH * 0.12, 55);
  var totalIW = ownedList.length * iSize * 1.5;
  var startIX = panelX - totalIW / 2 + iSize * 0.75;

  for (var i = 0; i < ownedList.length; i++) {
    var iix = startIX + i * iSize * 1.5;
    var iiy = itemY + iSize * 0.2;
    if (dist(mouseX, mouseY, iix, iiy) < iSize * 0.7) {
      var itemId = ownedList[i];
      useItem(itemId, spot);
      return;
    }
  }
}

function useItem(itemId, spot) {
  var kitten = KITTENS[spot.kittenIndex];

  if (itemId === "milk") {
    // Milk! Kitten runs away!
    spot.scared = true;
    milkScareTimer = 0;
    spawnConfetti(width / 2, height / 2, 15, [200, 60, 60]);
    showFeedback("NOOO! Kittens don't like milk!", width / 2, height * 0.3);
    return;
  }

  if (itemId === kitten.neededItem) {
    // Correct item! Found the kitten!
    foundKittens[spot.kittenIndex] = true;
    spot.investigated = true;
    foundKittenIdx = spot.kittenIndex;
    foundAnimTimer = 0;
    gameState = "found";
    transitionAlpha = 200;
    coins += 5;
    spawnConfetti(width / 2, height / 2, 40, [255, 200, 100]);
    return;
  }

  // Wrong item
  wrongItemTimer = 60;
  wrongItemId = itemId;
}

// ============== SCREEN: FOUND ==============

function drawFound() {
  foundAnimTimer++;

  // Celebration background
  var bgPulse = sin(foundAnimTimer * 0.05) * 20;
  for (var y = 0; y < height; y++) {
    var t = y / height;
    stroke(
      lerp(255, 200, t) + bgPulse,
      lerp(250, 180, t) + bgPulse * 0.5,
      lerp(200, 130, t)
    );
    line(0, y, width, y);
  }

  // Stars background
  for (var i = 0; i < 20; i++) {
    var sx = (sin(i * 7.3 + foundAnimTimer * 0.01) * 0.5 + 0.5) * width;
    var sy = (cos(i * 5.1 + foundAnimTimer * 0.008) * 0.5 + 0.5) * height;
    var ss = (sin(foundAnimTimer * 0.08 + i * 2) * 0.5 + 0.5) * 15 + 3;
    drawStar(sx, sy, ss, [255, 240, 150, 180]);
  }

  var kitten = KITTENS[foundKittenIdx];

  // "YOU FOUND" text - bounces in
  var titleScale = min(1, foundAnimTimer / 20);
  var titleBounce = titleScale > 0.9 ? sin(foundAnimTimer * 0.08) * 5 : 0;
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(min(width, height) * 0.06 * titleScale);
  fill(255, 120, 60);
  text("YOU FOUND", width / 2, height * 0.1 + titleBounce);

  // Kitten character - big, centered, happy
  var kitSize = min(width, height) * 0.35;
  var kitBounce = abs(sin(foundAnimTimer * 0.08)) * 15;
  drawKittenCharacter(width / 2, height * 0.42 - kitBounce, kitSize, foundKittenIdx, "happy");

  // Name plate
  if (foundAnimTimer > 15) {
    var nameAlpha = min(255, (foundAnimTimer - 15) * 15);
    noStroke();
    fill(255, 255, 255, nameAlpha * 0.8);
    var nameW = min(width * 0.6, 350);
    rect(width / 2 - nameW / 2, height * 0.62, nameW, height * 0.08, 20);

    textStyle(BOLD);
    textSize(min(width, height) * 0.045);
    fill(kitten.bodyColor[0], kitten.bodyColor[1], kitten.bodyColor[2], nameAlpha);
    stroke(0, 0, 0, nameAlpha * 0.3);
    strokeWeight(2);
    text(kitten.name.toUpperCase(), width / 2, height * 0.66);
    noStroke();

    // Personality
    textStyle(NORMAL);
    textSize(min(width, height) * 0.025);
    fill(120, 90, 60, nameAlpha);
    text(kitten.personality, width / 2, height * 0.71);
  }

  // Story text
  if (foundAnimTimer > 30) {
    var storyAlpha = min(255, (foundAnimTimer - 30) * 10);
    textSize(min(width, height) * 0.025);
    fill(100, 75, 50, storyAlpha);
    text(kitten.foundText, width / 2, height * 0.78);

    // +5 coins
    textStyle(BOLD);
    textSize(min(width, height) * 0.03);
    fill(240, 190, 50, storyAlpha);
    text("+5 coins!", width / 2, height * 0.83);
  }

  // Continue button
  if (foundAnimTimer > 50) {
    var btnAlpha = min(255, (foundAnimTimer - 50) * 10);
    var btnHover = isInRect(mouseX, mouseY, width / 2, height * 0.91, 150, 45);
    if (btnAlpha >= 200) {
      drawButton(width / 2, height * 0.91, 150, 45, "YAY!", [100, 200, 120], btnHover);
    }
  }

  // Ongoing confetti
  if (foundAnimTimer % 10 === 0) {
    spawnConfetti(random(width), random(height * 0.3), 5, [
      random(200, 255), random(150, 255), random(50, 200)
    ]);
  }
}

function handleFoundClick() {
  if (foundAnimTimer < 50) return;

  if (isInRect(mouseX, mouseY, width / 2, height * 0.91, 150, 45)) {
    // Check if all kittens found
    if (countFoundKittens() >= 10) {
      gameState = "win";
      winTimer = 0;
      transitionAlpha = 255;
    } else {
      gameState = "forest";
      transitionAlpha = 200;
    }
  }
}

// ============== SCREEN: COLLECTION ==============

function drawCollection() {
  // Background
  for (var y = 0; y < height; y++) {
    var t = y / height;
    stroke(lerp(250, 235, t), lerp(230, 210, t), lerp(240, 220, t));
    line(0, y, width, y);
  }

  // Title
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(min(width, height) * 0.05);
  fill(160, 80, 120);
  text("My Kittens", width / 2, height * 0.07);

  var foundCount = countFoundKittens();
  textStyle(NORMAL);
  textSize(min(width, height) * 0.025);
  fill(140, 110, 130);
  text(foundCount + " of 10 found", width / 2, height * 0.12);

  // Kitten grid - 2 rows of 5
  var cols = width > 500 ? 5 : 3;
  var rows = ceil(10 / cols);
  var cellW = min(width / (cols + 1), 140);
  var cellH = min((height * 0.65) / rows, 160);
  var gap = min(width * 0.01, 8);

  for (var i = 0; i < 10; i++) {
    var col = i % cols;
    var row = floor(i / cols);
    var totalRowW = cols * cellW + (cols - 1) * gap;
    var startX = (width - totalRowW) / 2 + cellW / 2;
    var cx = startX + col * (cellW + gap);
    var cy = height * 0.22 + row * (cellH + gap) + cellH / 2;
    drawCollectionKitten(i, cx, cy, cellW, cellH);
  }

  // Back button
  var backHover = isInRect(mouseX, mouseY, width / 2, height * 0.93, 120, 40);
  drawButton(width / 2, height * 0.93, 120, 40, "BACK", [160, 120, 150], backHover);
}

function drawCollectionKitten(idx, cx, cy, w, h) {
  var found = foundKittens[idx];
  var kitten = KITTENS[idx];

  push();
  // Card background
  noStroke();
  fill(0, 0, 0, 15);
  rect(cx - w / 2 + 3, cy - h / 2 + 3, w, h, 10);

  if (found) {
    fill(255, 250, 245);
    stroke(kitten.bodyColor[0], kitten.bodyColor[1], kitten.bodyColor[2], 150);
  } else {
    fill(230, 225, 220);
    stroke(190, 185, 180);
  }
  strokeWeight(2);
  rect(cx - w / 2, cy - h / 2, w, h, 10);

  if (found) {
    // Draw kitten
    var ks = min(w, h) * 0.5;
    drawKittenCharacter(cx, cy - h * 0.08, ks, idx, "idle");

    // Name
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(min(w * 0.15, 13));
    noStroke();
    fill(80, 60, 40);
    text(kitten.name, cx, cy + h * 0.33);

    // Forest hint
    textStyle(NORMAL);
    textSize(min(w * 0.1, 9));
    fill(150, 130, 110);
    text(FORESTS[kitten.forestIndex].name, cx, cy + h * 0.42);
  } else {
    // Silhouette / mystery
    noStroke();
    fill(200, 195, 190);
    ellipse(cx, cy - h * 0.05, min(w, h) * 0.35, min(w, h) * 0.3);
    // Ears
    triangle(
      cx - min(w, h) * 0.12, cy - h * 0.12,
      cx - min(w, h) * 0.04, cy - h * 0.25,
      cx - min(w, h) * 0.18, cy - h * 0.22
    );
    triangle(
      cx + min(w, h) * 0.12, cy - h * 0.12,
      cx + min(w, h) * 0.04, cy - h * 0.25,
      cx + min(w, h) * 0.18, cy - h * 0.22
    );

    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(min(w * 0.25, 22));
    fill(180, 170, 165);
    text("?", cx, cy + h * 0.02);

    textSize(min(w * 0.11, 10));
    fill(170, 165, 160);
    text("???", cx, cy + h * 0.35);
  }
  pop();
}

function handleCollectionClick() {
  if (isInRect(mouseX, mouseY, width / 2, height * 0.93, 120, 40)) {
    gameState = "map";
    transitionAlpha = 150;
  }
}

// ============== SCREEN: WIN ==============

function drawWin() {
  winTimer++;

  // Rainbow background
  for (var y = 0; y < height; y++) {
    var t = y / height;
    var hue = (t * 60 + winTimer * 0.5) % 360;
    colorMode(HSB, 360, 100, 100);
    stroke(hue, 30, 95);
    line(0, y, width, y);
    colorMode(RGB, 255);
  }

  // Big sparkle burst
  for (var i = 0; i < 30; i++) {
    var sx = width / 2 + cos(i * 0.21 + winTimer * 0.02) * (width * 0.4);
    var sy = height / 2 + sin(i * 0.33 + winTimer * 0.015) * (height * 0.4);
    var ss = (sin(winTimer * 0.08 + i * 1.5) * 0.5 + 0.5) * 12 + 2;
    drawStar(sx, sy, ss, [255, 255, 200, 180]);
  }

  // Title
  var titleBounce = sin(winTimer * 0.06) * 10;
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(min(width, height) * 0.07);
  fill(255, 100, 150);
  stroke(255, 255, 255);
  strokeWeight(3);
  text("YOU FOUND THEM ALL!", width / 2, height * 0.1 + titleBounce);
  noStroke();

  // All 10 kittens in a cute arrangement
  var kitSize = min(width, height) * 0.1;
  for (var i = 0; i < 10; i++) {
    var angle = (i / 10) * TWO_PI - HALF_PI;
    var radius = min(width, height) * 0.25;
    var kx = width / 2 + cos(angle + winTimer * 0.005) * radius;
    var ky = height * 0.48 + sin(angle + winTimer * 0.005) * radius * 0.6;
    var kBob = sin(winTimer * 0.08 + i * 0.6) * 8;
    drawKittenCharacter(kx, ky + kBob, kitSize, i, "happy");
  }

  // Heart in center
  var heartSize = min(width, height) * 0.08 + sin(winTimer * 0.06) * 10;
  drawHeart(width / 2, height * 0.48, heartSize, [255, 100, 120]);

  // Message
  if (winTimer > 30) {
    textStyle(NORMAL);
    textSize(min(width, height) * 0.03);
    noStroke();
    fill(120, 60, 80);
    text("Your kittens are so happy to be home!", width / 2, height * 0.8);
  }

  // Play again button
  if (winTimer > 60) {
    var btnHover = isInRect(mouseX, mouseY, width / 2, height * 0.9, 180, 50);
    drawButton(width / 2, height * 0.9, 180, 50, "PLAY AGAIN!", [200, 100, 150], btnHover);
  }

  // Ongoing confetti
  if (winTimer % 5 === 0) {
    spawnConfetti(random(width), -10, 3, [
      random(200, 255), random(100, 255), random(100, 255)
    ]);
  }
}

function handleWinClick() {
  if (winTimer < 60) return;
  if (isInRect(mouseX, mouseY, width / 2, height * 0.9, 180, 50)) {
    initGame();
    gameState = "menu";
    transitionAlpha = 255;
  }
}

// ============== FOREST BACKGROUNDS ==============

function drawForestBackground(idx) {
  var f = FORESTS[idx];

  // Sky gradient
  noStroke();
  for (var y = 0; y < height * 0.55; y++) {
    var t = y / (height * 0.55);
    stroke(
      lerp(f.skyTop[0], f.skyBottom[0], t),
      lerp(f.skyTop[1], f.skyBottom[1], t),
      lerp(f.skyTop[2], f.skyBottom[2], t)
    );
    line(0, y, width, y);
  }

  // Call specific forest drawer
  switch (idx) {
    case 0: drawYellowstoneScene(); break;
    case 1: drawYosemiteScene(); break;
    case 2: drawRedwoodScene(); break;
    case 3: drawSmokyScene(); break;
    case 4: drawOlympicScene(); break;
  }
}

function drawYellowstoneScene() {
  noStroke();

  // Distant mountains
  fill(80, 110, 70, 150);
  drawMountainRange(height * 0.35, 6, 0.12, 0.08);
  fill(70, 100, 60, 180);
  drawMountainRange(height * 0.4, 5, 0.15, 0.1);

  // Ground
  fill(120, 155, 60);
  rect(0, height * 0.55, width, height * 0.45);
  fill(105, 140, 50);
  rect(0, height * 0.7, width, height * 0.3);

  // Hot spring pool
  fill(70, 180, 210, 150);
  ellipse(width * 0.45, height * 0.72, width * 0.15, height * 0.06);
  fill(100, 200, 230, 100);
  ellipse(width * 0.45, height * 0.72, width * 0.1, height * 0.04);

  // Pine trees
  for (var i = 0; i < 8; i++) {
    var tx = width * (0.05 + i * 0.13);
    var ty = height * (0.45 + sin(i * 2.3) * 0.05);
    var th = height * (0.15 + sin(i * 1.7) * 0.04);
    if (i !== 2 && i !== 5) {
      drawPineTree(tx, ty, th, [35 + i * 3, 85 + i * 2, 35]);
    }
  }

  // Geyser steam (animated)
  var steamX = width * 0.22;
  var steamBaseY = height * 0.55;
  for (var i = 0; i < 6; i++) {
    var st = (menuFrame * 0.02 + i * 0.5) % 3;
    var sy = steamBaseY - st * height * 0.06;
    var sx = steamX + sin(menuFrame * 0.03 + i) * 10;
    var sa = max(0, 150 - st * 60);
    var ss = 15 + st * 10;
    fill(255, 255, 255, sa);
    ellipse(sx, sy, ss, ss * 0.7);
  }

  // Ground details - small rocks, grass tufts
  fill(140, 130, 100);
  for (var i = 0; i < 10; i++) {
    var rx = (sin(i * 5.7) * 0.5 + 0.5) * width;
    var ry = height * 0.7 + (cos(i * 3.2) * 0.5 + 0.5) * height * 0.15;
    ellipse(rx, ry, 8 + i % 3 * 4, 5 + i % 2 * 3);
  }
}

function drawYosemiteScene() {
  noStroke();

  // Granite cliff (left side)
  fill(175, 170, 165);
  beginShape();
  vertex(0, height * 0.15);
  vertex(width * 0.25, height * 0.12);
  vertex(width * 0.3, height * 0.55);
  vertex(0, height * 0.55);
  endShape(CLOSE);

  // Cliff face detail
  fill(160, 155, 150);
  beginShape();
  vertex(width * 0.05, height * 0.18);
  vertex(width * 0.22, height * 0.15);
  vertex(width * 0.25, height * 0.5);
  vertex(width * 0.05, height * 0.5);
  endShape(CLOSE);

  // Waterfall
  for (var y = height * 0.15; y < height * 0.55; y += 8) {
    var wx = width * 0.27 + sin(y * 0.1 + menuFrame * 0.1) * 3;
    var wa = 150 + sin(y * 0.05 + menuFrame * 0.05) * 50;
    fill(220, 235, 255, wa);
    rect(wx - 4, y, 8, 10);
  }

  // Splash at base
  var splashA = 100 + sin(menuFrame * 0.1) * 40;
  fill(220, 235, 255, splashA);
  ellipse(width * 0.27, height * 0.56, 40, 15);

  // Meadow ground
  fill(80, 150, 55);
  rect(0, height * 0.55, width, height * 0.45);
  fill(90, 160, 60);
  ellipse(width * 0.6, height * 0.58, width * 0.5, height * 0.08);

  // Flowers in meadow
  var flowerColors = [[255, 100, 100], [255, 200, 50], [200, 100, 255], [255, 150, 200]];
  for (var i = 0; i < 20; i++) {
    var fx = width * 0.35 + (sin(i * 3.7) * 0.5 + 0.5) * width * 0.5;
    var fy = height * 0.56 + (cos(i * 2.3) * 0.5 + 0.5) * height * 0.08;
    var fc = flowerColors[i % flowerColors.length];
    fill(fc[0], fc[1], fc[2]);
    ellipse(fx, fy, 6, 6);
    fill(255, 230, 50);
    ellipse(fx, fy, 3, 3);
  }

  // Pine trees (right side)
  for (var i = 0; i < 5; i++) {
    var tx = width * (0.6 + i * 0.09);
    var ty = height * (0.4 + sin(i * 1.8) * 0.06);
    var th = height * (0.12 + sin(i * 2.5) * 0.03);
    drawPineTree(tx, ty, th, [25 + i * 5, 75 + i * 3, 30]);
  }

  // Background trees
  fill(40, 80, 40, 120);
  for (var i = 0; i < 6; i++) {
    var tx = width * (0.3 + i * 0.12);
    var ty = height * 0.38;
    triangle(tx - 15, ty, tx + 15, ty, tx, ty - height * 0.1);
  }
}

function drawRedwoodScene() {
  noStroke();

  // Canopy overhead - dark green ceiling
  fill(30, 60, 25);
  rect(0, 0, width, height * 0.2);
  fill(40, 75, 30, 200);
  for (var i = 0; i < 8; i++) {
    var cx = (i / 7) * width;
    ellipse(cx, height * 0.15, width * 0.2, height * 0.15);
  }

  // Dappled light
  for (var i = 0; i < 8; i++) {
    var lx = (sin(i * 4.3) * 0.5 + 0.5) * width;
    var ly = height * (0.2 + sin(i * 2.7) * 0.15);
    var ls = 30 + sin(menuFrame * 0.02 + i * 1.5) * 10;
    fill(255, 255, 200, 20 + sin(menuFrame * 0.03 + i) * 10);
    ellipse(lx, ly, ls * 2, ls * 3);
  }

  // Ground
  fill(55, 90, 35);
  rect(0, height * 0.55, width, height * 0.45);
  fill(45, 75, 28);
  rect(0, height * 0.68, width, height * 0.32);

  // Giant redwood trunks
  var trunkColors = [[120, 65, 30], [110, 58, 25], [130, 70, 35]];
  var trunkPositions = [0.08, 0.35, 0.62, 0.9];
  for (var i = 0; i < trunkPositions.length; i++) {
    var tc = trunkColors[i % trunkColors.length];
    fill(tc[0], tc[1], tc[2]);
    var tw = width * 0.08;
    var tx = width * trunkPositions[i];
    rect(tx - tw / 2, 0, tw, height * 0.75);

    // Bark texture
    fill(tc[0] - 15, tc[1] - 10, tc[2] - 8, 80);
    for (var j = 0; j < 8; j++) {
      var by = j * height * 0.09 + 10;
      rect(tx - tw / 2 + 3, by, tw - 6, 3);
    }
  }

  // Ferns
  for (var i = 0; i < 12; i++) {
    var fx = (i / 11) * width;
    var fy = height * (0.6 + sin(i * 1.7) * 0.05);
    drawFern(fx, fy, 25 + sin(i * 2.3) * 8);
  }

  // Mushrooms
  var mushColors = [[200, 50, 40], [220, 180, 60], [180, 120, 70]];
  for (var i = 0; i < 6; i++) {
    var mx = (sin(i * 5.3) * 0.5 + 0.5) * width;
    var my = height * (0.68 + cos(i * 3.1) * 0.08);
    var mc = mushColors[i % mushColors.length];
    // Stem
    fill(230, 220, 200);
    rect(mx - 3, my - 8, 6, 10);
    // Cap
    fill(mc[0], mc[1], mc[2]);
    ellipse(mx, my - 10, 16, 10);
    // Spots on red ones
    if (i % 3 === 0) {
      fill(255, 255, 240);
      ellipse(mx - 3, my - 12, 3, 3);
      ellipse(mx + 4, my - 11, 2, 2);
    }
  }
}

function drawSmokyScene() {
  noStroke();

  // Layered mountain ridges
  fill(130, 140, 170, 100);
  drawMountainRange(height * 0.25, 5, 0.2, 0.12);
  fill(110, 120, 155, 130);
  drawMountainRange(height * 0.32, 4, 0.22, 0.1);
  fill(90, 105, 140, 160);
  drawMountainRange(height * 0.38, 5, 0.18, 0.08);

  // Mist layers
  for (var i = 0; i < 3; i++) {
    var my = height * (0.3 + i * 0.06);
    var ma = 40 + sin(menuFrame * 0.01 + i * 2) * 15;
    fill(200, 210, 230, ma);
    var mx = sin(menuFrame * 0.005 + i) * 30;
    ellipse(width / 2 + mx, my, width * 1.2, height * 0.06);
  }

  // Ground
  fill(130, 110, 60);
  rect(0, height * 0.55, width, height * 0.45);

  // Autumn trees
  var autumnColors = [
    [220, 80, 30], [240, 160, 30], [200, 50, 25],
    [180, 120, 30], [230, 130, 40], [210, 190, 40]
  ];
  for (var i = 0; i < 10; i++) {
    var tx = width * (0.05 + i * 0.1);
    var ty = height * (0.42 + sin(i * 1.9) * 0.06);
    var th = height * (0.1 + sin(i * 2.3) * 0.03);
    var tc = autumnColors[i % autumnColors.length];

    // Trunk
    fill(100, 70, 40);
    rect(tx - 4, ty, 8, th * 0.5);

    // Canopy
    fill(tc[0], tc[1], tc[2]);
    ellipse(tx, ty - th * 0.1, th * 0.8, th * 0.9);
    fill(tc[0] - 20, tc[1] - 10, tc[2], 150);
    ellipse(tx - th * 0.15, ty, th * 0.5, th * 0.6);
    ellipse(tx + th * 0.2, ty - th * 0.05, th * 0.5, th * 0.5);
  }

  // Stream
  fill(100, 160, 200, 150);
  beginShape();
  for (var x = 0; x <= width; x += 20) {
    var sy = height * 0.75 + sin(x * 0.01 + menuFrame * 0.02) * 5;
    vertex(x, sy);
  }
  vertex(width, height * 0.78);
  vertex(0, height * 0.78);
  endShape(CLOSE);

  // Stream sparkle
  for (var i = 0; i < 5; i++) {
    var sx = (menuFrame * 0.5 + i * width * 0.2) % width;
    var sy = height * 0.76 + sin(sx * 0.01) * 3;
    fill(255, 255, 255, 100 + sin(menuFrame * 0.1 + i) * 60);
    ellipse(sx, sy, 4, 2);
  }

  // Fallen leaves on ground
  for (var i = 0; i < 15; i++) {
    var lc = autumnColors[i % autumnColors.length];
    fill(lc[0], lc[1], lc[2], 160);
    var lx = (sin(i * 7.3) * 0.5 + 0.5) * width;
    var ly = height * (0.6 + cos(i * 4.1) * 0.12);
    push();
    translate(lx, ly);
    rotate(i * 0.8);
    ellipse(0, 0, 10, 6);
    pop();
  }
}

function drawOlympicScene() {
  noStroke();

  // Ground
  fill(40, 95, 40);
  rect(0, height * 0.5, width, height * 0.5);
  fill(30, 80, 30);
  rect(0, height * 0.65, width, height * 0.35);

  // Mossy trees
  for (var i = 0; i < 7; i++) {
    var tx = width * (0.05 + i * 0.14);
    var ty = height * 0.5;
    var th = height * (0.25 + sin(i * 1.6) * 0.08);

    // Trunk (dark)
    fill(50, 40, 30);
    rect(tx - 10, ty - th, 20, th + 10);

    // Moss on trunk
    fill(80, 150, 60, 180);
    rect(tx - 12, ty - th * 0.8, 8, th * 0.6);
    fill(100, 170, 70, 150);
    for (var j = 0; j < 4; j++) {
      ellipse(tx - 8, ty - th * (0.3 + j * 0.15), 12, 8);
    }

    // Canopy
    fill(30, 75, 30);
    ellipse(tx, ty - th - 10, 50, 40);
    fill(40, 90, 35, 200);
    ellipse(tx - 15, ty - th, 35, 30);
    ellipse(tx + 18, ty - th + 5, 30, 25);

    // Hanging moss
    stroke(90, 160, 70, 120);
    strokeWeight(1);
    for (var j = 0; j < 3; j++) {
      var hx = tx - 15 + j * 15;
      var hy = ty - th + 10;
      var hLen = 15 + sin(menuFrame * 0.02 + i + j) * 3;
      line(hx, hy, hx + sin(menuFrame * 0.01 + j) * 3, hy + hLen);
    }
    noStroke();
  }

  // Giant ferns
  for (var i = 0; i < 10; i++) {
    var fx = (i / 9) * width;
    var fy = height * (0.55 + sin(i * 2.1) * 0.04);
    drawFern(fx, fy, 30 + sin(i * 1.4) * 10);
  }

  // Mushrooms
  for (var i = 0; i < 5; i++) {
    var mx = width * (0.1 + i * 0.2);
    var my = height * (0.65 + sin(i * 3.7) * 0.06);
    fill(230, 220, 200);
    rect(mx - 4, my - 12, 8, 14);
    fill(180 + i * 10, 50, 30);
    arc(mx, my - 14, 22, 16, PI, TWO_PI);
    fill(255, 255, 240);
    ellipse(mx - 4, my - 17, 4, 3);
    ellipse(mx + 5, my - 16, 3, 2);
  }

  // Rain effect
  stroke(180, 210, 220, 60);
  strokeWeight(1);
  for (var i = 0; i < 30; i++) {
    var rx = (menuFrame * 2 + i * 37) % width;
    var ry = (menuFrame * 4 + i * 53) % height;
    line(rx, ry, rx - 2, ry + 12);
  }
  noStroke();
}

// ============== FOREST HELPERS ==============

function drawMountainRange(baseY, peaks, maxW, maxH) {
  beginShape();
  vertex(0, baseY);
  for (var i = 0; i <= peaks; i++) {
    var x = (i / peaks) * width;
    var peakH = sin(i * 2.7 + 0.5) * height * maxH + height * maxH * 0.5;
    vertex(x, baseY - peakH);
    if (i < peaks) {
      var midX = x + (width / peaks) * 0.5;
      vertex(midX, baseY - peakH * 0.3);
    }
  }
  vertex(width, baseY);
  endShape(CLOSE);
}

function drawPineTree(x, y, h, c) {
  noStroke();
  // Trunk
  fill(80, 55, 30);
  rect(x - 4, y, 8, h * 0.3);

  // Layers
  fill(c[0], c[1], c[2]);
  var layers = 3;
  for (var i = 0; i < layers; i++) {
    var ly = y - h * (i / layers) * 0.7;
    var lw = h * 0.4 * (1 - i * 0.2);
    var lh = h * 0.35;
    triangle(x - lw, ly, x + lw, ly, x, ly - lh);
  }
}

function drawFern(x, y, size) {
  push();
  translate(x, y);
  noStroke();
  for (var side = -1; side <= 1; side += 2) {
    for (var i = 0; i < 5; i++) {
      var angle = side * (0.2 + i * 0.15) - 0.1;
      var len = size * (1 - i * 0.12);
      fill(60 + i * 10, 140 + i * 8, 40, 200);
      push();
      rotate(angle);
      ellipse(0, -len * 0.5, 6, len);
      pop();
    }
  }
  // Center frond
  fill(50, 130, 35);
  ellipse(0, -size * 0.5, 5, size);
  pop();
}

// ============== AMBIENT PARTICLES ==============

function updateAmbientParticles(forestIdx) {
  // Spawn ambient particles based on forest type
  var f = FORESTS[forestIdx];
  if (menuFrame % 8 === 0) {
    if (f.ambientType === "steam") {
      ambientParticles.push({
        x: width * 0.22 + random(-15, 15),
        y: height * 0.55,
        vx: random(-0.3, 0.3),
        vy: random(-1.5, -0.5),
        size: random(10, 25),
        alpha: 150,
        type: "steam"
      });
    } else if (f.ambientType === "spray") {
      ambientParticles.push({
        x: width * 0.27 + random(-10, 10),
        y: height * 0.55 + random(-5, 5),
        vx: random(-1, 1),
        vy: random(-0.5, 0.5),
        size: random(3, 8),
        alpha: 120,
        type: "spray"
      });
    } else if (f.ambientType === "motes") {
      ambientParticles.push({
        x: random(width),
        y: random(height * 0.2, height * 0.6),
        vx: random(-0.2, 0.2),
        vy: random(-0.3, 0.3),
        size: random(2, 5),
        alpha: random(60, 120),
        type: "mote"
      });
    } else if (f.ambientType === "leaves") {
      ambientParticles.push({
        x: random(width),
        y: -10,
        vx: random(-0.5, 0.5),
        vy: random(0.5, 1.5),
        size: random(5, 10),
        alpha: 200,
        rot: random(TWO_PI),
        rotSpeed: random(-0.03, 0.03),
        color: [
          [220, 80, 30], [240, 160, 30], [200, 50, 25]
        ][floor(random(3))],
        type: "leaf"
      });
    } else if (f.ambientType === "rain") {
      for (var i = 0; i < 3; i++) {
        ambientParticles.push({
          x: random(width),
          y: -5,
          vx: -0.5,
          vy: random(5, 9),
          size: random(1, 2),
          alpha: random(40, 80),
          type: "rain"
        });
      }
    }
  }

  // Update
  for (var i = ambientParticles.length - 1; i >= 0; i--) {
    var p = ambientParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= (p.type === "rain" ? 0.3 : 1.2);
    if (p.type === "leaf" && p.rot !== undefined) p.rot += p.rotSpeed;
    if (p.alpha <= 0 || p.y > height + 20 || p.y < -50) {
      ambientParticles.splice(i, 1);
    }
  }

  // Cap particle count
  if (ambientParticles.length > 100) {
    ambientParticles = ambientParticles.slice(-80);
  }
}

function drawAmbientParticles() {
  noStroke();
  for (var i = 0; i < ambientParticles.length; i++) {
    var p = ambientParticles[i];
    if (p.type === "steam" || p.type === "spray") {
      fill(255, 255, 255, p.alpha);
      ellipse(p.x, p.y, p.size, p.size * 0.8);
    } else if (p.type === "mote") {
      fill(255, 255, 200, p.alpha);
      ellipse(p.x, p.y, p.size, p.size);
    } else if (p.type === "leaf") {
      push();
      translate(p.x, p.y);
      rotate(p.rot);
      fill(p.color[0], p.color[1], p.color[2], p.alpha);
      ellipse(0, 0, p.size, p.size * 0.6);
      pop();
    } else if (p.type === "rain") {
      stroke(180, 210, 230, p.alpha);
      strokeWeight(p.size);
      line(p.x, p.y, p.x - 1, p.y + 8);
      noStroke();
    }
  }
}

// ============== HIDING SPOTS ==============

function drawSpot(spot, x, y, size, hovered, index) {
  if (spot.investigated) {
    // Already investigated - dim
    if (spot.content === "kitten" && foundKittens[spot.kittenIndex]) {
      // Found kitten - show happy paw print
      fill(KITTENS[spot.kittenIndex].bodyColor[0],
           KITTENS[spot.kittenIndex].bodyColor[1],
           KITTENS[spot.kittenIndex].bodyColor[2], 120);
      noStroke();
      drawPaw(x, y, size * 0.4);
    }
    return;
  }

  // Glow effect
  var glowPulse = sin(menuFrame * 0.05 + index * 1.5) * 0.3 + 0.7;
  var glowSize = size * 2.2 * glowPulse;
  noStroke();
  fill(255, 220, 100, hovered ? 60 : 30);
  ellipse(x, y, glowSize, glowSize);
  fill(255, 230, 130, hovered ? 40 : 18);
  ellipse(x, y, glowSize * 0.7, glowSize * 0.7);

  // Spot visual based on type
  drawSpotVisual(spot.type, x, y, size, hovered);

  // Hover indicator
  if (hovered) {
    noFill();
    stroke(255, 240, 150, 180);
    strokeWeight(2);
    ellipse(x, y, size * 2, size * 2);
    noStroke();

    // Sparkle ring
    for (var i = 0; i < 4; i++) {
      var angle = menuFrame * 0.05 + i * HALF_PI;
      var sx = x + cos(angle) * size;
      var sy = y + sin(angle) * size;
      fill(255, 255, 200, 200);
      drawStar(sx, sy, 5, [255, 255, 200, 200]);
    }
  }
}

function drawSpotVisual(type, x, y, size, hovered) {
  noStroke();
  var s = size;

  if (type === "geyser") {
    // Rocky mound with steam
    fill(140, 130, 110);
    ellipse(x, y + s * 0.2, s * 1.4, s * 0.6);
    fill(120, 110, 90);
    ellipse(x, y + s * 0.1, s, s * 0.5);
    // Steam
    fill(255, 255, 255, 100 + sin(menuFrame * 0.08) * 40);
    ellipse(x, y - s * 0.3, s * 0.4, s * 0.5);
  } else if (type === "pinetree") {
    // Tall pine
    fill(80, 55, 30);
    rect(x - 5, y - s * 0.2, 10, s * 0.6);
    fill(30, 80, 30);
    triangle(x - s * 0.5, y - s * 0.1, x + s * 0.5, y - s * 0.1, x, y - s * 0.9);
    triangle(x - s * 0.4, y - s * 0.35, x + s * 0.4, y - s * 0.35, x, y - s * 1.1);
  } else if (type === "pool") {
    // Hot spring pool
    fill(80, 190, 220, 180);
    ellipse(x, y, s * 1.2, s * 0.6);
    fill(120, 210, 240, 120);
    ellipse(x, y - 2, s * 0.7, s * 0.35);
  } else if (type === "rocks") {
    fill(150, 145, 135);
    ellipse(x - s * 0.2, y + s * 0.1, s * 0.6, s * 0.4);
    fill(140, 135, 125);
    ellipse(x + s * 0.2, y, s * 0.5, s * 0.4);
    fill(160, 155, 145);
    ellipse(x, y - s * 0.1, s * 0.4, s * 0.35);
  } else if (type === "log") {
    fill(100, 65, 30);
    push();
    translate(x, y);
    rotate(0.15);
    rect(-s * 0.6, -s * 0.12, s * 1.2, s * 0.25, 5);
    pop();
    fill(80, 50, 20);
    ellipse(x + s * 0.55, y, s * 0.22, s * 0.25);
  } else if (type === "cave") {
    // Dark cave opening
    fill(100, 95, 90);
    arc(x, y + s * 0.2, s * 1.4, s * 1.2, PI, TWO_PI);
    fill(30, 25, 25);
    arc(x, y + s * 0.2, s * 1, s * 0.8, PI, TWO_PI);
  } else if (type === "flowers") {
    // Flower patch
    fill(70, 150, 50);
    ellipse(x, y + s * 0.1, s * 1.4, s * 0.5);
    var fc = [[255, 100, 150], [255, 200, 50], [200, 120, 255], [255, 150, 100]];
    for (var i = 0; i < 7; i++) {
      var fi = fc[i % fc.length];
      fill(fi[0], fi[1], fi[2]);
      var fx = x + sin(i * 2.3) * s * 0.5;
      var fy = y + cos(i * 1.7) * s * 0.15 - s * 0.05;
      ellipse(fx, fy, 8, 8);
      fill(255, 230, 50);
      ellipse(fx, fy, 3, 3);
    }
  } else if (type === "bush") {
    fill(60, 130, 45);
    ellipse(x, y, s * 1.2, s * 0.9);
    fill(50, 115, 38);
    ellipse(x - s * 0.2, y + s * 0.05, s * 0.7, s * 0.6);
    fill(70, 140, 52);
    ellipse(x + s * 0.2, y - s * 0.1, s * 0.6, s * 0.5);
  } else if (type === "hollowtree") {
    // Big tree with hole
    fill(110, 60, 25);
    rect(x - s * 0.3, y - s * 0.8, s * 0.6, s * 1.2);
    fill(40, 25, 15);
    ellipse(x, y - s * 0.1, s * 0.35, s * 0.45);
    fill(30, 70, 25);
    ellipse(x, y - s * 0.9, s * 0.9, s * 0.5);
  } else if (type === "ferns") {
    drawFern(x, y + s * 0.2, s * 0.9);
  } else if (type === "mushroom") {
    // Big mushroom
    fill(230, 220, 200);
    rect(x - 6, y - s * 0.1, 12, s * 0.4);
    fill(200, 60, 40);
    arc(x, y - s * 0.1, s * 0.9, s * 0.6, PI, TWO_PI);
    fill(255, 255, 240);
    ellipse(x - s * 0.12, y - s * 0.25, 6, 5);
    ellipse(x + s * 0.15, y - s * 0.2, 5, 4);
  } else if (type === "leaves") {
    // Leaf pile
    var lc = [[220, 80, 30], [240, 160, 30], [200, 50, 25], [230, 130, 40]];
    for (var i = 0; i < 10; i++) {
      var li = lc[i % lc.length];
      fill(li[0], li[1], li[2], 200);
      var lx = x + sin(i * 2.7) * s * 0.4;
      var ly = y + cos(i * 1.9) * s * 0.2;
      push();
      translate(lx, ly);
      rotate(i * 0.7);
      ellipse(0, 0, s * 0.25, s * 0.15);
      pop();
    }
  } else if (type === "mist") {
    // Foggy area
    for (var i = 0; i < 4; i++) {
      var ma = 60 + sin(menuFrame * 0.03 + i * 1.5) * 25;
      fill(200, 210, 230, ma);
      var mx = x + sin(menuFrame * 0.01 + i * 2) * 10;
      ellipse(mx, y + i * 6 - 10, s * (1.2 - i * 0.15), s * 0.35);
    }
  } else if (type === "stream") {
    fill(100, 170, 210, 160);
    ellipse(x, y, s * 1.3, s * 0.4);
    fill(140, 200, 230, 100);
    var sx = sin(menuFrame * 0.05) * 5;
    ellipse(x + sx, y - 2, s * 0.7, s * 0.2);
  } else if (type === "stump") {
    fill(100, 70, 35);
    rect(x - s * 0.25, y - s * 0.1, s * 0.5, s * 0.35, 3);
    fill(130, 100, 55);
    ellipse(x, y - s * 0.1, s * 0.5, s * 0.2);
    fill(90, 60, 30);
    ellipse(x, y - s * 0.1, s * 0.25, s * 0.1);
  } else if (type === "mossybranch") {
    fill(60, 50, 35);
    push();
    translate(x, y);
    rotate(-0.2);
    rect(-s * 0.6, -6, s * 1.2, 12, 6);
    pop();
    fill(80, 160, 60, 180);
    ellipse(x - s * 0.3, y - 5, s * 0.3, 10);
    ellipse(x + s * 0.1, y - 6, s * 0.25, 8);
    ellipse(x + s * 0.4, y - 4, s * 0.2, 9);
  } else if (type === "puddle") {
    fill(100, 160, 190, 140);
    ellipse(x, y, s * 1.1, s * 0.4);
    // Ripple
    noFill();
    stroke(150, 200, 220, 60 + sin(menuFrame * 0.08) * 30);
    strokeWeight(1);
    var rippleS = (menuFrame * 0.03) % 1;
    ellipse(x, y, s * rippleS, s * 0.15 * rippleS);
    noStroke();
  } else if (type === "vines") {
    fill(50, 100, 40);
    for (var i = 0; i < 5; i++) {
      var vx = x - s * 0.3 + i * s * 0.15;
      var sway = sin(menuFrame * 0.02 + i) * 3;
      rect(vx + sway, y - s * 0.5, 3, s);
      // Leaves
      fill(60, 130, 45);
      ellipse(vx + sway, y - s * 0.3 + i * 5, 10, 6);
      fill(50, 100, 40);
    }
  }
}

// ============== KITTEN DRAWING ==============

function drawKittenCharacter(x, y, s, idx, animation) {
  var k = KITTENS[idx];
  var bc = k.bodyColor;
  var dc = k.darkColor;
  var ec = k.eyeColor;

  push();
  translate(x, y);

  var bobY = 0;
  var tailWag = 0;
  var earWiggle = 0;
  var eyeScale = 1;
  var mouthOpen = false;

  if (animation === "idle") {
    bobY = sin(menuFrame * 0.04 + idx * 0.8) * s * 0.015;
    tailWag = sin(menuFrame * 0.06 + idx) * 0.25;
  } else if (animation === "happy") {
    bobY = abs(sin(menuFrame * 0.1 + idx * 0.5)) * s * -0.06;
    tailWag = sin(menuFrame * 0.12) * 0.4;
    earWiggle = sin(menuFrame * 0.15) * 0.05;
    mouthOpen = true;
  } else if (animation === "scared") {
    eyeScale = 1.5;
    bobY = sin(menuFrame * 0.2) * s * 0.01;
  }

  translate(0, bobY);

  noStroke();

  // Tail
  push();
  var tailX = s * 0.22;
  var tailY = s * 0.05;
  stroke(bc[0], bc[1], bc[2]);
  strokeWeight(s * 0.05);
  noFill();
  bezier(
    tailX, tailY,
    tailX + s * 0.15, tailY - s * 0.15 + sin(menuFrame * 0.06 + idx) * s * 0.05,
    tailX + s * 0.1, tailY - s * 0.3 + tailWag * s * 0.1,
    tailX + s * 0.05 + tailWag * s * 0.08, tailY - s * 0.35
  );
  pop();

  noStroke();

  // Body
  fill(bc[0], bc[1], bc[2]);
  ellipse(0, s * 0.05, s * 0.45, s * 0.35);

  // Front paws
  fill(dc[0], dc[1], dc[2]);
  if (k.marking === "paws") {
    fill(dc[0], dc[1], dc[2]);
  }
  ellipse(-s * 0.1, s * 0.2, s * 0.1, s * 0.07);
  ellipse(s * 0.1, s * 0.2, s * 0.1, s * 0.07);

  // Head
  fill(bc[0], bc[1], bc[2]);
  ellipse(0, -s * 0.16, s * 0.4, s * 0.35);

  // Ears
  push();
  rotate(earWiggle);
  // Left ear
  fill(bc[0], bc[1], bc[2]);
  triangle(-s * 0.15, -s * 0.28, -s * 0.06, -s * 0.42, -s * 0.22, -s * 0.4);
  // Right ear
  triangle(s * 0.15, -s * 0.28, s * 0.06, -s * 0.42, s * 0.22, -s * 0.4);
  // Inner ears (pink)
  fill(255, 180, 180);
  triangle(-s * 0.14, -s * 0.29, -s * 0.08, -s * 0.39, -s * 0.19, -s * 0.37);
  triangle(s * 0.14, -s * 0.29, s * 0.08, -s * 0.39, s * 0.19, -s * 0.37);
  pop();

  // Body markings (stripes)
  if (k.marking === "stripes") {
    fill(dc[0], dc[1], dc[2], 100);
    // Forehead stripes
    for (var i = -1; i <= 1; i++) {
      push();
      translate(i * s * 0.05, -s * 0.3);
      rotate(i * 0.15);
      rect(-1, -s * 0.06, 2, s * 0.08);
      pop();
    }
    // Body stripes
    for (var i = 0; i < 3; i++) {
      push();
      translate(0, s * (i * 0.06 - 0.04));
      rect(-s * 0.12, -1, s * 0.24, 2);
      pop();
    }
  }

  // Calico patches
  if (k.marking === "calico") {
    fill(dc[0], dc[1], dc[2], 150);
    ellipse(-s * 0.08, -s * 0.12, s * 0.12, s * 0.1);
    ellipse(s * 0.12, s * 0.02, s * 0.1, s * 0.09);
    fill(60, 50, 45, 120);
    ellipse(s * 0.05, -s * 0.2, s * 0.08, s * 0.07);
    ellipse(-s * 0.1, s * 0.06, s * 0.09, s * 0.08);
  }

  // Star marking (Luna)
  if (k.marking === "star") {
    fill(255, 255, 240);
    drawStar(0, -s * 0.3, s * 0.05, [255, 255, 240, 255]);
  }

  // Gray paw markings (Mittens)
  if (k.marking === "paws") {
    fill(dc[0], dc[1], dc[2]);
    ellipse(-s * 0.1, s * 0.2, s * 0.11, s * 0.08);
    ellipse(s * 0.1, s * 0.2, s * 0.11, s * 0.08);
  }

  // Eyes
  var es = s * 0.085 * eyeScale;
  // White
  fill(255);
  ellipse(-s * 0.07, -s * 0.17, es * 1.5, es * 1.6);
  ellipse(s * 0.07, -s * 0.17, es * 1.5, es * 1.6);
  // Iris
  fill(ec[0], ec[1], ec[2]);
  ellipse(-s * 0.07, -s * 0.16, es * 1.1, es * 1.2);
  ellipse(s * 0.07, -s * 0.16, es * 1.1, es * 1.2);
  // Pupil
  fill(20, 20, 25);
  ellipse(-s * 0.07, -s * 0.155, es * 0.55, es * 0.65);
  ellipse(s * 0.07, -s * 0.155, es * 0.55, es * 0.65);
  // Shine
  fill(255, 255, 255, 220);
  ellipse(-s * 0.055, -s * 0.18, es * 0.3, es * 0.3);
  ellipse(s * 0.085, -s * 0.18, es * 0.18, es * 0.18);

  // Nose
  fill(255, 160, 160);
  triangle(0, -s * 0.1, -s * 0.018, -s * 0.115, s * 0.018, -s * 0.115);

  // Mouth
  noFill();
  stroke(dc[0], dc[1], dc[2], 180);
  strokeWeight(s * 0.012);
  if (mouthOpen) {
    arc(-s * 0.015, -s * 0.085, s * 0.04, s * 0.035, 0, PI);
    arc(s * 0.015, -s * 0.085, s * 0.04, s * 0.035, 0, PI);
  } else {
    arc(-s * 0.015, -s * 0.09, s * 0.035, s * 0.02, 0, PI);
    arc(s * 0.015, -s * 0.09, s * 0.035, s * 0.02, 0, PI);
  }

  // Whiskers
  stroke(dc[0], dc[1], dc[2], 130);
  strokeWeight(s * 0.008);
  // Left
  line(-s * 0.05, -s * 0.1, -s * 0.18, -s * 0.13);
  line(-s * 0.05, -s * 0.09, -s * 0.18, -s * 0.09);
  line(-s * 0.05, -s * 0.08, -s * 0.17, -s * 0.05);
  // Right
  line(s * 0.05, -s * 0.1, s * 0.18, -s * 0.13);
  line(s * 0.05, -s * 0.09, s * 0.18, -s * 0.09);
  line(s * 0.05, -s * 0.08, s * 0.17, -s * 0.05);

  noStroke();
  pop();
}

function drawKittenPeek(x, y, size, idx, scared) {
  var k = KITTENS[idx];
  var bc = k.bodyColor;
  var ec = k.eyeColor;
  var s = size;

  push();
  translate(x, y);
  noStroke();

  if (scared) {
    // Empty spot - kitten ran away
    fill(200, 180, 160, 100);
    textAlign(CENTER, CENTER);
    textSize(s * 0.4);
    text("...", 0, 0);
    pop();
    return;
  }

  // Hiding surface
  fill(120, 100, 70);
  rect(-s * 0.8, s * 0.1, s * 1.6, s * 0.5, 5);
  fill(100, 85, 60);
  rect(-s * 0.7, s * 0.1, s * 1.4, s * 0.08);

  // Ears peeking over
  fill(bc[0], bc[1], bc[2]);
  triangle(-s * 0.25, s * 0.12, -s * 0.15, -s * 0.08, -s * 0.35, -s * 0.04);
  triangle(s * 0.25, s * 0.12, s * 0.15, -s * 0.08, s * 0.35, -s * 0.04);
  // Inner ears
  fill(255, 180, 180);
  triangle(-s * 0.24, s * 0.1, -s * 0.17, -s * 0.04, -s * 0.32, -s * 0.01);
  triangle(s * 0.24, s * 0.1, s * 0.17, -s * 0.04, s * 0.32, -s * 0.01);

  // Head top peeking
  fill(bc[0], bc[1], bc[2]);
  arc(0, s * 0.12, s * 0.7, s * 0.5, PI, TWO_PI);

  // Eyes peeking (big and curious)
  var eyeBlink = sin(menuFrame * 0.03 + idx * 2) > 0.95;
  var es = s * 0.13;
  if (!eyeBlink) {
    fill(255);
    ellipse(-s * 0.12, s * 0.04, es * 1.5, es * 1.4);
    ellipse(s * 0.12, s * 0.04, es * 1.5, es * 1.4);
    fill(ec[0], ec[1], ec[2]);
    ellipse(-s * 0.12, s * 0.05, es * 1.1, es * 1.1);
    ellipse(s * 0.12, s * 0.05, es * 1.1, es * 1.1);
    fill(20);
    ellipse(-s * 0.12, s * 0.06, es * 0.5, es * 0.55);
    ellipse(s * 0.12, s * 0.06, es * 0.5, es * 0.55);
    fill(255, 255, 255, 220);
    ellipse(-s * 0.1, s * 0.03, es * 0.25, es * 0.25);
    ellipse(s * 0.14, s * 0.03, es * 0.15, es * 0.15);
  } else {
    // Blinking
    stroke(bc[0] - 30, bc[1] - 30, bc[2] - 30);
    strokeWeight(2);
    line(-s * 0.17, s * 0.05, -s * 0.07, s * 0.05);
    line(s * 0.07, s * 0.05, s * 0.17, s * 0.05);
    noStroke();
  }

  pop();
}

// ============== ITEM ICONS ==============

function drawItemIcon(itemId, x, y, size) {
  push();
  translate(x, y);
  noStroke();
  var s = size;

  if (itemId === "fish") {
    // Fish body
    fill(70, 150, 220);
    ellipse(0, 0, s * 0.8, s * 0.4);
    // Tail
    triangle(s * 0.3, 0, s * 0.5, -s * 0.2, s * 0.5, s * 0.2);
    // Eye
    fill(255);
    ellipse(-s * 0.15, -s * 0.05, s * 0.12, s * 0.12);
    fill(20);
    ellipse(-s * 0.15, -s * 0.05, s * 0.06, s * 0.06);
    // Fin
    fill(50, 130, 200);
    triangle(0, -s * 0.15, -s * 0.1, -s * 0.3, s * 0.1, -s * 0.15);
  } else if (itemId === "flashlight") {
    // Body
    fill(100, 100, 110);
    rect(-s * 0.12, -s * 0.25, s * 0.24, s * 0.5, 4);
    // Head
    fill(200, 200, 210);
    rect(-s * 0.15, -s * 0.35, s * 0.3, s * 0.15, 3);
    // Light beam
    fill(255, 240, 100, 100);
    triangle(-s * 0.15, -s * 0.35, s * 0.15, -s * 0.35, 0, -s * 0.55);
    fill(255, 255, 200, 80);
    ellipse(0, -s * 0.35, s * 0.2, s * 0.08);
  } else if (itemId === "yarn") {
    // Ball
    fill(235, 80, 130);
    ellipse(0, 0, s * 0.6, s * 0.6);
    // Yarn lines
    noFill();
    stroke(255, 130, 170);
    strokeWeight(1.5);
    arc(-s * 0.05, 0, s * 0.35, s * 0.35, -0.5, 2);
    arc(s * 0.05, -s * 0.05, s * 0.25, s * 0.25, 1, 3.5);
    noStroke();
    // Trailing yarn
    stroke(235, 80, 130);
    strokeWeight(2);
    noFill();
    bezier(s * 0.25, s * 0.1, s * 0.35, s * 0.25, s * 0.2, s * 0.35, s * 0.35, s * 0.4);
    noStroke();
  } else if (itemId === "catnip") {
    // Stem
    stroke(60, 140, 50);
    strokeWeight(2);
    line(0, s * 0.25, 0, -s * 0.05);
    noStroke();
    // Leaves
    fill(80, 190, 70);
    ellipse(-s * 0.12, -s * 0.1, s * 0.2, s * 0.35);
    ellipse(s * 0.12, -s * 0.12, s * 0.2, s * 0.33);
    fill(60, 170, 55);
    ellipse(0, -s * 0.22, s * 0.18, s * 0.3);
    // Sparkle (it's magical!)
    fill(255, 255, 200, 150);
    drawStar(-s * 0.2, -s * 0.3, s * 0.06, [255, 255, 200, 180]);
  } else if (itemId === "feather") {
    // Stick
    stroke(160, 120, 70);
    strokeWeight(2);
    line(0, s * 0.35, 0, -s * 0.05);
    noStroke();
    // Feather
    fill(185, 105, 225);
    beginShape();
    vertex(0, -s * 0.05);
    bezierVertex(-s * 0.2, -s * 0.2, -s * 0.15, -s * 0.4, 0, -s * 0.45);
    bezierVertex(s * 0.15, -s * 0.4, s * 0.2, -s * 0.2, 0, -s * 0.05);
    endShape();
    // Feather line
    stroke(150, 80, 200);
    strokeWeight(1);
    line(0, -s * 0.05, 0, -s * 0.4);
    noStroke();
    // Second feather
    fill(100, 200, 230, 180);
    push();
    rotate(0.3);
    beginShape();
    vertex(0, -s * 0.05);
    bezierVertex(-s * 0.15, -s * 0.18, -s * 0.1, -s * 0.32, 0, -s * 0.35);
    bezierVertex(s * 0.1, -s * 0.32, s * 0.15, -s * 0.18, 0, -s * 0.05);
    endShape();
    pop();
  } else if (itemId === "bell") {
    // Bell body
    fill(245, 210, 70);
    arc(0, s * 0.05, s * 0.5, s * 0.5, PI, TWO_PI);
    rect(-s * 0.25, s * 0.03, s * 0.5, s * 0.07, 0, 0, 4, 4);
    // Top loop
    noFill();
    stroke(220, 185, 50);
    strokeWeight(2);
    arc(0, -s * 0.2, s * 0.15, s * 0.12, PI, TWO_PI);
    noStroke();
    // Clapper
    fill(200, 170, 40);
    ellipse(0, s * 0.12, s * 0.08, s * 0.08);
    // Shine
    fill(255, 250, 200, 150);
    ellipse(-s * 0.08, -s * 0.05, s * 0.08, s * 0.12);
  } else if (itemId === "milk") {
    // Bottle
    fill(240, 240, 248);
    rect(-s * 0.15, -s * 0.15, s * 0.3, s * 0.4, 3);
    // Cap
    fill(200, 50, 50);
    rect(-s * 0.12, -s * 0.22, s * 0.24, s * 0.1, 3, 3, 0, 0);
    // Label
    fill(200, 50, 50, 80);
    rect(-s * 0.1, 0, s * 0.2, s * 0.12);
    // X
    stroke(200, 50, 50);
    strokeWeight(2.5);
    line(-s * 0.2, -s * 0.3, s * 0.2, s * 0.3);
    line(s * 0.2, -s * 0.3, -s * 0.2, s * 0.3);
    noStroke();
  }

  pop();
}

function drawItemMiniIcon(type, x, y, size) {
  push();
  if (type === "fish") {
    drawItemIcon("fish", x, y, size * 0.7);
  } else if (type === "flashlight") {
    drawItemIcon("flashlight", x, y, size * 0.7);
  } else if (type === "yarn") {
    drawItemIcon("yarn", x, y, size * 0.7);
  } else if (type === "milk") {
    drawItemIcon("milk", x, y, size * 0.7);
  } else if (type === "coins") {
    drawCoinIcon(x, y, size * 0.3);
  } else if (type === "map") {
    noStroke();
    fill(200, 180, 140);
    rect(x - size * 0.3, y - size * 0.25, size * 0.6, size * 0.5, 3);
    stroke(120, 100, 70);
    strokeWeight(1);
    line(x - size * 0.15, y - size * 0.1, x + size * 0.15, y - size * 0.1);
    line(x - size * 0.1, y, x + size * 0.1, y);
    line(x - size * 0.15, y + size * 0.1, x + size * 0.15, y + size * 0.1);
    noStroke();
  }
  pop();
}

function drawItemButton(itemId, x, y, size, hovered) {
  var item = getItemData(itemId);
  var s = size;

  // Circle background
  noStroke();
  fill(0, 0, 0, 20);
  ellipse(x + 2, y + 2, s * 1.4, s * 1.4);

  if (hovered) {
    fill(255, 245, 220);
    stroke(255, 200, 80);
    strokeWeight(3);
  } else {
    fill(255, 250, 240);
    stroke(200, 190, 170);
    strokeWeight(1.5);
  }
  ellipse(x, y, s * 1.4, s * 1.4);

  // Warning ring for milk
  if (item && item.warning) {
    noFill();
    stroke(230, 60, 60, 180);
    strokeWeight(2);
    ellipse(x, y, s * 1.3, s * 1.3);
  }

  noStroke();
  drawItemIcon(itemId, x, y - s * 0.05, s * 0.6);

  // Name below
  textAlign(CENTER, CENTER);
  textStyle(NORMAL);
  textSize(s * 0.18);
  fill(80, 60, 40);
  text(item ? item.name : itemId, x, y + s * 0.55);
}

// ============== UI HELPERS ==============

function drawButton(cx, cy, w, h, label, bgColor, hovered) {
  noStroke();
  // Shadow
  fill(0, 0, 0, 35);
  rect(cx - w / 2 + 3, cy - h / 2 + 3, w, h, h * 0.3);

  // Button
  var r = bgColor[0], g = bgColor[1], b = bgColor[2];
  if (hovered) {
    fill(min(r + 25, 255), min(g + 25, 255), min(b + 25, 255));
  } else {
    fill(r, g, b);
  }
  rect(cx - w / 2, cy - h / 2, w, h, h * 0.3);

  // Top highlight
  fill(255, 255, 255, hovered ? 60 : 35);
  rect(cx - w / 2 + 2, cy - h / 2 + 2, w - 4, h * 0.35, h * 0.3, h * 0.3, 0, 0);

  // Border
  noFill();
  stroke(255, 255, 255, 50);
  strokeWeight(1);
  rect(cx - w / 2, cy - h / 2, w, h, h * 0.3);

  // Label
  noStroke();
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(h * 0.4);
  fill(255, 255, 255);
  text(label, cx, cy);
  textStyle(NORMAL);
}

function drawSmallButton(cx, cy, w, h, label, hovered) {
  noStroke();
  fill(0, 0, 0, hovered ? 180 : 120);
  rect(cx - w / 2, cy - h / 2, w, h, h * 0.3);
  if (hovered) {
    stroke(255, 255, 255, 100);
    strokeWeight(1);
    noFill();
    rect(cx - w / 2, cy - h / 2, w, h, h * 0.3);
  }
  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(h * 0.4);
  text(label, cx, cy);
  textStyle(NORMAL);
}

function drawCoinHUD(x, y) {
  drawCoinIcon(x - 25, y, 10);
  textAlign(LEFT, CENTER);
  textStyle(BOLD);
  textSize(16);
  fill(220, 180, 50);
  noStroke();
  text(coins, x - 10, y);
  textStyle(NORMAL);
}

function drawCoinIcon(x, y, r) {
  noStroke();
  fill(240, 200, 50);
  ellipse(x, y, r * 2, r * 2);
  fill(255, 225, 80);
  ellipse(x - r * 0.15, y - r * 0.15, r * 1.4, r * 1.4);
  fill(220, 180, 40);
  textAlign(CENTER, CENTER);
  textSize(r * 1.1);
  textStyle(BOLD);
  text("$", x, y);
  textStyle(NORMAL);
}

function drawPaw(x, y, size) {
  noStroke();
  var s = size;
  // Pad
  ellipse(x, y + s * 0.1, s * 0.5, s * 0.4);
  // Toes
  ellipse(x - s * 0.2, y - s * 0.15, s * 0.2, s * 0.22);
  ellipse(x - s * 0.05, y - s * 0.25, s * 0.2, s * 0.22);
  ellipse(x + s * 0.1, y - s * 0.22, s * 0.2, s * 0.22);
  ellipse(x + s * 0.22, y - s * 0.12, s * 0.18, s * 0.2);
}

function drawPawPrints(x, y, frame) {
  noStroke();
  fill(255, 255, 255, 40);
  for (var i = 0; i < 5; i++) {
    var px = x + sin(i * 1.8 + frame * 0.01) * 100;
    var py = y + cos(i * 2.3 + frame * 0.008) * 20;
    var pa = (sin(frame * 0.03 + i * 1.5) * 0.5 + 0.5) * 40 + 20;
    fill(255, 255, 255, pa);
    drawPaw(px, py, 10 + sin(i * 3) * 3);
  }
}

function drawStar(x, y, r, col) {
  fill(col[0], col[1], col[2], col[3] !== undefined ? col[3] : 255);
  noStroke();
  push();
  translate(x, y);
  beginShape();
  for (var i = 0; i < 10; i++) {
    var angle = (i / 10) * TWO_PI - HALF_PI;
    var rad = i % 2 === 0 ? r : r * 0.4;
    vertex(cos(angle) * rad, sin(angle) * rad);
  }
  endShape(CLOSE);
  pop();
}

function drawHeart(x, y, size, col) {
  fill(col[0], col[1], col[2]);
  noStroke();
  push();
  translate(x, y);
  beginShape();
  vertex(0, size * 0.3);
  bezierVertex(-size * 0.5, -size * 0.1, -size * 0.5, -size * 0.5, 0, -size * 0.2);
  bezierVertex(size * 0.5, -size * 0.5, size * 0.5, -size * 0.1, 0, size * 0.3);
  endShape(CLOSE);
  pop();
}

function drawMilkScare() {
  // Overlay flash
  if (milkScareTimer < 10) {
    fill(255, 200, 200, 100 - milkScareTimer * 10);
    noStroke();
    rect(0, 0, width, height);
  }
}

function isInRect(mx, my, cx, cy, w, h) {
  return mx >= cx - w / 2 && mx <= cx + w / 2 && my >= cy - h / 2 && my <= cy + h / 2;
}

// ============== PARTICLES ==============

function spawnConfetti(x, y, count, baseColor) {
  for (var i = 0; i < count; i++) {
    particles.push({
      x: x + random(-20, 20),
      y: y + random(-20, 20),
      vx: random(-4, 4),
      vy: random(-6, -1),
      size: random(4, 10),
      color: [
        baseColor[0] + random(-30, 30),
        baseColor[1] + random(-30, 30),
        baseColor[2] + random(-30, 30)
      ],
      alpha: 255,
      rot: random(TWO_PI),
      rotSpeed: random(-0.1, 0.1),
      gravity: 0.15,
      type: "confetti"
    });
  }
}

function spawnSparkles(x, y, count) {
  for (var i = 0; i < count; i++) {
    var angle = random(TWO_PI);
    var speed = random(1, 3);
    particles.push({
      x: x,
      y: y,
      vx: cos(angle) * speed,
      vy: sin(angle) * speed,
      size: random(3, 7),
      color: [255, random(200, 255), random(100, 200)],
      alpha: 255,
      type: "sparkle"
    });
  }
}

function updateAndDrawParticles() {
  noStroke();
  for (var i = particles.length - 1; i >= 0; i--) {
    var p = particles[i];
    p.x += p.vx;
    p.y += p.vy;

    if (p.type === "confetti") {
      p.vy += p.gravity;
      p.rot += p.rotSpeed;
      p.alpha -= 2.5;
      push();
      translate(p.x, p.y);
      rotate(p.rot);
      fill(p.color[0], p.color[1], p.color[2], p.alpha);
      rect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      pop();
    } else if (p.type === "sparkle") {
      p.alpha -= 6;
      p.vx *= 0.95;
      p.vy *= 0.95;
      fill(p.color[0], p.color[1], p.color[2], p.alpha);
      drawStar(p.x, p.y, p.size * (p.alpha / 255), [p.color[0], p.color[1], p.color[2], p.alpha]);
    }

    if (p.alpha <= 0) {
      particles.splice(i, 1);
    }
  }
}

// ============== FEEDBACK ==============

function showFeedback(msg, x, y) {
  feedbackMsg = msg;
  feedbackX = x;
  feedbackY = y;
  feedbackTimer = 80;
}

function drawFeedback() {
  var alpha = min(255, feedbackTimer * 6);
  var floatY = feedbackY - (80 - feedbackTimer) * 0.5;

  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(min(width, height) * 0.028);

  // Background pill
  var tw = textWidth(feedbackMsg) + 24;
  noStroke();
  fill(0, 0, 0, alpha * 0.5);
  rect(feedbackX - tw / 2, floatY - 14, tw, 28, 14);

  fill(255, 255, 255, alpha);
  text(feedbackMsg, feedbackX, floatY);
  textStyle(NORMAL);
}

// ============== UTILITY ==============

function countFoundKittens() {
  var count = 0;
  for (var i = 0; i < foundKittens.length; i++) {
    if (foundKittens[i]) count++;
  }
  return count;
}

function getKittensInForest(forestIdx) {
  var result = [];
  for (var i = 0; i < KITTENS.length; i++) {
    if (KITTENS[i].forestIndex === forestIdx) result.push(i);
  }
  return result;
}

function getOwnedItemsList() {
  var result = [];
  for (var i = 0; i < ITEMS.length; i++) {
    if (ownedItems[ITEMS[i].id]) {
      result.push(ITEMS[i].id);
    }
  }
  return result;
}

function getItemData(id) {
  for (var i = 0; i < ITEMS.length; i++) {
    if (ITEMS[i].id === id) return ITEMS[i];
  }
  return null;
}

// Keyboard handler
function keyPressed() {
  if (keyCode === ESCAPE) {
    if (gameState === "forest" || gameState === "investigate") {
      if (gameState === "investigate") {
        gameState = "forest";
      } else {
        gameState = "map";
      }
      transitionAlpha = 150;
    } else if (gameState === "shop" || gameState === "collection") {
      gameState = "map";
      transitionAlpha = 150;
    } else if (gameState === "map") {
      window.location.href = "../../index.html";
    }
  }
}
