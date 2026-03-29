// ================================================
// KITTEN FINDER - A Forest Adventure Game
// Find 20 lost kittens in America's National Parks!
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
  },
  {
    name: "Grand Canyon",
    subtitle: "Arizona",
    skyTop: [80, 160, 240],
    skyBottom: [200, 170, 130],
    groundColor: [190, 120, 70],
    groundColor2: [170, 100, 55],
    treeType: "pine",
    ambientType: "motes",
    iconEmoji: "canyon"
  },
  {
    name: "Zion",
    subtitle: "Utah",
    skyTop: [90, 170, 240],
    skyBottom: [180, 160, 130],
    groundColor: [195, 130, 80],
    groundColor2: [175, 110, 65],
    treeType: "pine",
    ambientType: "motes",
    iconEmoji: "cliff"
  },
  {
    name: "Glacier",
    subtitle: "Montana",
    skyTop: [130, 190, 240],
    skyBottom: [200, 220, 240],
    groundColor: [70, 140, 60],
    groundColor2: [55, 120, 45],
    treeType: "pine",
    ambientType: "spray",
    iconEmoji: "glacier"
  },
  {
    name: "Acadia",
    subtitle: "Maine",
    skyTop: [110, 160, 220],
    skyBottom: [170, 200, 230],
    groundColor: [90, 130, 55],
    groundColor2: [75, 110, 40],
    treeType: "autumn",
    ambientType: "spray",
    iconEmoji: "lighthouse"
  },
  {
    name: "Everglades",
    subtitle: "Florida",
    skyTop: [140, 200, 230],
    skyBottom: [180, 220, 200],
    groundColor: [75, 130, 55],
    groundColor2: [55, 110, 40],
    treeType: "mossy",
    ambientType: "steam",
    iconEmoji: "swamp"
  },
  {
    name: "Rocky Mountain",
    subtitle: "Colorado",
    skyTop: [100, 170, 240],
    skyBottom: [190, 210, 230],
    groundColor: [80, 145, 55],
    groundColor2: [65, 120, 40],
    treeType: "pine",
    ambientType: "motes",
    iconEmoji: "mountain"
  },
  {
    name: "Joshua Tree",
    subtitle: "California",
    skyTop: [120, 170, 230],
    skyBottom: [230, 200, 150],
    groundColor: [210, 185, 140],
    groundColor2: [190, 165, 120],
    treeType: "pine",
    ambientType: "motes",
    iconEmoji: "desert"
  },
  {
    name: "Denali",
    subtitle: "Alaska",
    skyTop: [150, 200, 240],
    skyBottom: [210, 225, 240],
    groundColor: [100, 145, 70],
    groundColor2: [80, 125, 55],
    treeType: "pine",
    ambientType: "rain",
    iconEmoji: "snowpeak"
  },
  {
    name: "Shenandoah",
    subtitle: "Virginia",
    skyTop: [130, 170, 220],
    skyBottom: [180, 200, 210],
    groundColor: [90, 140, 55],
    groundColor2: [70, 120, 40],
    treeType: "autumn",
    ambientType: "leaves",
    iconEmoji: "valley"
  },
  {
    name: "Big Bend",
    subtitle: "Texas",
    skyTop: [100, 160, 230],
    skyBottom: [220, 190, 140],
    groundColor: [180, 150, 100],
    groundColor2: [160, 130, 85],
    treeType: "pine",
    ambientType: "motes",
    iconEmoji: "cactus"
  },
  {
    name: "Crater Lake",
    subtitle: "Oregon",
    skyTop: [90, 155, 230],
    skyBottom: [160, 195, 230],
    groundColor: [70, 130, 55],
    groundColor2: [55, 110, 40],
    treeType: "pine",
    ambientType: "spray",
    iconEmoji: "lake"
  },
  {
    name: "Bryce Canyon",
    subtitle: "Utah",
    skyTop: [95, 165, 240],
    skyBottom: [210, 170, 130],
    groundColor: [205, 130, 75],
    groundColor2: [185, 110, 60],
    treeType: "pine",
    ambientType: "motes",
    iconEmoji: "hoodoo"
  },
  {
    name: "Sequoia",
    subtitle: "California",
    skyTop: [95, 130, 85],
    skyBottom: [125, 155, 105],
    groundColor: [65, 105, 45],
    groundColor2: [50, 85, 35],
    treeType: "redwood",
    ambientType: "motes",
    iconEmoji: "bigtree"
  },
  {
    name: "Hawaii Volcanoes",
    subtitle: "Hawaii",
    skyTop: [120, 160, 210],
    skyBottom: [180, 140, 110],
    groundColor: [60, 60, 55],
    groundColor2: [45, 45, 40],
    treeType: "mossy",
    ambientType: "steam",
    iconEmoji: "volcano"
  },
  {
    name: "Carlsbad Caverns",
    subtitle: "New Mexico",
    skyTop: [70, 90, 120],
    skyBottom: [50, 60, 80],
    groundColor: [100, 90, 75],
    groundColor2: [80, 70, 55],
    treeType: "pine",
    ambientType: "motes",
    iconEmoji: "cave"
  }
];

var KITTENS = [
  {
    name: "Whiskers",
    personality: "loves to eat",
    bodyColor: [255, 160, 60],
    darkColor: [200, 120, 40],
    eyeColor: [80, 190, 80],
    marking: "stripes",
    forestIndex: 0,
    neededItem: "fish",
    hint: "This kitten is SO HUNGRY!\nIt wants something to EAT!",
    foundText: "Whiskers was so hungry! Yum yum fish!"
  },
  {
    name: "Mittens",
    personality: "loves to play",
    bodyColor: [240, 240, 248],
    darkColor: [170, 170, 185],
    eyeColor: [70, 140, 220],
    marking: "paws",
    forestIndex: 1,
    neededItem: "yarn",
    hint: "This kitten wants to PLAY\nwith a round toy!",
    foundText: "Mittens was in a tree! She loves yarn!"
  },
  {
    name: "Shadow",
    personality: "likes to hide",
    bodyColor: [55, 55, 60],
    darkColor: [35, 35, 40],
    eyeColor: [210, 190, 60],
    marking: "none",
    forestIndex: 2,
    neededItem: "flashlight",
    hint: "It's SO DARK in here!\nYou need something that makes LIGHT!",
    foundText: "Shadow was in a dark cave! The light helped!"
  },
  {
    name: "Sunny",
    personality: "loves to chase bugs",
    bodyColor: [255, 215, 80],
    darkColor: [235, 185, 55],
    eyeColor: [100, 185, 100],
    marking: "none",
    forestIndex: 3,
    neededItem: "feather",
    hint: "This kitten wants to chase\nsomething FLUFFY and TICKLY!",
    foundText: "Sunny loves to chase the feather! So fun!"
  },
  {
    name: "Patches",
    personality: "loves to sniff",
    bodyColor: [255, 225, 185],
    darkColor: [235, 140, 60],
    eyeColor: [165, 125, 65],
    marking: "calico",
    forestIndex: 4,
    neededItem: "catnip",
    hint: "This kitten keeps SNIFFING!\nIt wants something that SMELLS good!",
    foundText: "Patches loves the smell of catnip!"
  },
  {
    name: "Pebble",
    personality: "loves to nap",
    bodyColor: [175, 175, 185],
    darkColor: [145, 145, 155],
    eyeColor: [100, 165, 210],
    marking: "none",
    forestIndex: 5,
    neededItem: "bell",
    hint: "Shhh! So hard to hear!\nUse something that JINGLES!",
    foundText: "Pebble was asleep! The bell woke her up!"
  },
  {
    name: "Maple",
    personality: "loves fall leaves",
    bodyColor: [225, 115, 50],
    darkColor: [185, 85, 30],
    eyeColor: [80, 165, 80],
    marking: "stripes",
    forestIndex: 6,
    neededItem: "blanket",
    hint: "Brrr! This kitten is SO COLD!\nIt needs something WARM!",
    foundText: "Maple was so cold! The blanket made her warm!"
  },
  {
    name: "Misty",
    personality: "so sneaky",
    bodyColor: [230, 230, 240],
    darkColor: [200, 200, 212],
    eyeColor: [155, 135, 210],
    marking: "none",
    forestIndex: 7,
    neededItem: "milk",
    hint: "This kitten is SO THIRSTY!\nIt needs something to DRINK!",
    foundText: "Misty was so thirsty! She loved the milk!"
  },
  {
    name: "Fern",
    personality: "loves plants",
    bodyColor: [165, 125, 80],
    darkColor: [135, 100, 60],
    eyeColor: [80, 175, 80],
    marking: "stripes",
    forestIndex: 8,
    neededItem: "laser",
    hint: "This kitten is chasing\na tiny RED DOT!",
    foundText: "Fern loves the red dot! So fun to chase!"
  },
  {
    name: "Luna",
    personality: "loves the stars",
    bodyColor: [90, 90, 105],
    darkColor: [65, 65, 80],
    eyeColor: [175, 175, 255],
    marking: "star",
    forestIndex: 9,
    neededItem: "music",
    hint: "This kitten loves SOUNDS!\nPlay a TUNE for it!",
    foundText: "Luna came down for the song! She loves music!"
  },
  {
    name: "Rusty",
    personality: "loves to explore",
    bodyColor: [200, 100, 50],
    darkColor: [160, 75, 35],
    eyeColor: [180, 160, 60],
    marking: "stripes",
    forestIndex: 10,
    neededItem: "compass",
    hint: "This kitten is SO LOST!\nIt needs something to show the WAY!",
    foundText: "Rusty found the way! The compass helped!"
  },
  {
    name: "Dusty",
    personality: "loves the desert",
    bodyColor: [220, 190, 140],
    darkColor: [190, 160, 110],
    eyeColor: [160, 130, 60],
    marking: "none",
    forestIndex: 11,
    neededItem: "hat",
    hint: "This kitten's head is SO HOT!\nIt needs something to block the SUN!",
    foundText: "Dusty is cool now! The hat blocks the sun!"
  },
  {
    name: "Snowball",
    personality: "loves the cold",
    bodyColor: [240, 245, 255],
    darkColor: [200, 210, 225],
    eyeColor: [80, 150, 220],
    marking: "none",
    forestIndex: 12,
    neededItem: "scarf",
    hint: "This kitten's neck is SO CHILLY!\nIt needs something long and COZY!",
    foundText: "Snowball loves the scarf! So warm and snuggly!"
  },
  {
    name: "Clover",
    personality: "loves to pick flowers",
    bodyColor: [140, 180, 100],
    darkColor: [110, 150, 75],
    eyeColor: [100, 200, 100],
    marking: "calico",
    forestIndex: 13,
    neededItem: "butterfly_net",
    hint: "This kitten sees something FLYING!\nIt needs something to CATCH it!",
    foundText: "Clover caught a butterfly! What a fun net!"
  },
  {
    name: "Pepper",
    personality: "loves to be sneaky",
    bodyColor: [70, 65, 60],
    darkColor: [45, 40, 35],
    eyeColor: [220, 170, 50],
    marking: "none",
    forestIndex: 14,
    neededItem: "treat",
    hint: "This kitten's tummy is GROWLING!\nGive it a yummy SNACK!",
    foundText: "Pepper loved the treat! Munch munch munch!"
  },
  {
    name: "Splash",
    personality: "loves water",
    bodyColor: [150, 180, 210],
    darkColor: [120, 150, 180],
    eyeColor: [60, 160, 200],
    marking: "stripes",
    forestIndex: 15,
    neededItem: "boat",
    hint: "This kitten is stuck by the WATER!\nIt needs something that FLOATS!",
    foundText: "Splash rode the boat across! What fun!"
  },
  {
    name: "Ziggy",
    personality: "loves to climb",
    bodyColor: [210, 150, 80],
    darkColor: [180, 120, 55],
    eyeColor: [130, 200, 100],
    marking: "stripes",
    forestIndex: 16,
    neededItem: "rope",
    hint: "This kitten is stuck UP HIGH!\nIt needs something long to CLIMB DOWN!",
    foundText: "Ziggy climbed down the rope! So brave!"
  },
  {
    name: "Acorn",
    personality: "loves to collect things",
    bodyColor: [180, 130, 70],
    darkColor: [150, 100, 45],
    eyeColor: [140, 180, 80],
    marking: "calico",
    forestIndex: 17,
    neededItem: "basket",
    hint: "This kitten found so many TREASURES!\nIt needs something to CARRY them!",
    foundText: "Acorn filled the basket! What a collector!"
  },
  {
    name: "Ember",
    personality: "loves warm things",
    bodyColor: [230, 100, 50],
    darkColor: [190, 70, 30],
    eyeColor: [255, 180, 50],
    marking: "stripes",
    forestIndex: 18,
    neededItem: "torch",
    hint: "This kitten wants something\nBRIGHT and GLOWING!",
    foundText: "Ember loves the warm glow! So pretty!"
  },
  {
    name: "Echo",
    personality: "loves dark places",
    bodyColor: [100, 95, 110],
    darkColor: [70, 65, 80],
    eyeColor: [170, 200, 170],
    marking: "star",
    forestIndex: 19,
    neededItem: "gem",
    hint: "This kitten wants something\nSHINY and SPARKLY!",
    foundText: "Echo loves the sparkly gem! It glows so bright!"
  }
];

var ITEMS = [
  { id: "fish", name: "Fish", price: 5, desc: "Yummy fish to eat!", color: [70, 150, 220] },
  { id: "yarn", name: "Yarn Ball", price: 5, desc: "A fun round toy!", color: [235, 80, 130] },
  { id: "flashlight", name: "Light", price: 6, desc: "Shines in the dark!", color: [255, 220, 80] },
  { id: "feather", name: "Feather", price: 5, desc: "Fun to chase!", color: [185, 105, 225] },
  { id: "catnip", name: "Catnip", price: 5, desc: "Smells so good!", color: [80, 195, 80] },
  { id: "bell", name: "Bell", price: 4, desc: "Jingle jingle!", color: [245, 205, 60] },
  { id: "blanket", name: "Blanket", price: 5, desc: "Warm and soft!", color: [130, 170, 230] },
  { id: "milk", name: "Milk", price: 4, desc: "A yummy drink!", color: [240, 240, 248] },
  { id: "laser", name: "Laser", price: 6, desc: "A red dot to chase!", color: [230, 60, 60] },
  { id: "music", name: "Music Box", price: 5, desc: "Plays a fun song!", color: [220, 160, 200] },
  { id: "compass", name: "Compass", price: 5, desc: "Shows the way!", color: [180, 50, 50] },
  { id: "hat", name: "Sun Hat", price: 4, desc: "Blocks the sun!", color: [240, 220, 150] },
  { id: "scarf", name: "Scarf", price: 5, desc: "Long and cozy!", color: [200, 80, 80] },
  { id: "butterfly_net", name: "Net", price: 5, desc: "Catch things!", color: [180, 220, 180] },
  { id: "treat", name: "Treat", price: 4, desc: "A yummy snack!", color: [200, 150, 80] },
  { id: "boat", name: "Toy Boat", price: 6, desc: "Floats on water!", color: [80, 140, 200] },
  { id: "rope", name: "Rope", price: 5, desc: "Strong and long!", color: [180, 150, 100] },
  { id: "basket", name: "Basket", price: 4, desc: "Holds treasures!", color: [170, 120, 60] },
  { id: "torch", name: "Torch", price: 6, desc: "Bright and glowy!", color: [255, 160, 50] },
  { id: "gem", name: "Gem", price: 5, desc: "Shiny and sparkly!", color: [150, 100, 220] }
];

var SPOT_TEMPLATES = [
  // Forest 0: Yellowstone
  [
    { rx: 0.20, ry: 0.52, rSize: 0.09, type: "geyser", content: "kitten", kittenIndex: 0, label: "Hot Steam" },
    { rx: 0.45, ry: 0.68, rSize: 0.08, type: "pool", content: "coins", coins: 5, label: "Hot Pool" },
    { rx: 0.88, ry: 0.62, rSize: 0.07, type: "rocks", content: "critter", critter: "butterfly", label: "Rocks" },
    { rx: 0.10, ry: 0.72, rSize: 0.07, type: "log", content: "coins", coins: 5, label: "Old Log" }
  ],
  // Forest 1: Yosemite
  [
    { rx: 0.58, ry: 0.53, rSize: 0.10, type: "flowers", content: "kitten", kittenIndex: 1, label: "Flowers" },
    { rx: 0.82, ry: 0.48, rSize: 0.08, type: "rocks", content: "coins", coins: 5, label: "Waterfall" },
    { rx: 0.38, ry: 0.42, rSize: 0.07, type: "log", content: "critter", critter: "bunny", label: "Big Log" },
    { rx: 0.90, ry: 0.70, rSize: 0.07, type: "bush", content: "coins", coins: 5, label: "Berry Bush" }
  ],
  // Forest 2: Redwood
  [
    { rx: 0.28, ry: 0.48, rSize: 0.10, type: "hollowtree", content: "kitten", kittenIndex: 2, label: "Tree Hole" },
    { rx: 0.48, ry: 0.38, rSize: 0.08, type: "mushroom", content: "coins", coins: 5, label: "Mushrooms" },
    { rx: 0.12, ry: 0.65, rSize: 0.07, type: "log", content: "critter", critter: "squirrel", label: "Log Bridge" },
    { rx: 0.85, ry: 0.55, rSize: 0.07, type: "rocks", content: "coins", coins: 5, label: "Mossy Rock" }
  ],
  // Forest 3: Smoky Mountains
  [
    { rx: 0.38, ry: 0.62, rSize: 0.10, type: "leaves", content: "kitten", kittenIndex: 3, label: "Leaf Pile" },
    { rx: 0.18, ry: 0.55, rSize: 0.08, type: "stream", content: "coins", coins: 5, label: "Stream" },
    { rx: 0.55, ry: 0.40, rSize: 0.07, type: "stump", content: "critter", critter: "bird", label: "Tree Stump" },
    { rx: 0.90, ry: 0.68, rSize: 0.07, type: "bush", content: "coins", coins: 5, label: "Red Bush" }
  ],
  // Forest 4: Olympic Rainforest
  [
    { rx: 0.32, ry: 0.56, rSize: 0.09, type: "mushroom", content: "kitten", kittenIndex: 4, label: "Big Mushroom" },
    { rx: 0.12, ry: 0.64, rSize: 0.07, type: "puddle", content: "coins", coins: 5, label: "Puddle" },
    { rx: 0.50, ry: 0.50, rSize: 0.07, type: "vines", content: "critter", critter: "frog", label: "Vines" },
    { rx: 0.90, ry: 0.58, rSize: 0.07, type: "ferns", content: "coins", coins: 5, label: "Fern Cave" }
  ],
  // Forest 5: Grand Canyon
  [
    { rx: 0.25, ry: 0.55, rSize: 0.09, type: "rocks", content: "kitten", kittenIndex: 5, label: "Red Rocks" },
    { rx: 0.65, ry: 0.45, rSize: 0.08, type: "cave", content: "coins", coins: 5, label: "Rock Cave" },
    { rx: 0.85, ry: 0.60, rSize: 0.07, type: "bush", content: "critter", critter: "bird", label: "Dry Bush" },
    { rx: 0.45, ry: 0.70, rSize: 0.07, type: "log", content: "coins", coins: 5, label: "Old Log" }
  ],
  // Forest 6: Zion
  [
    { rx: 0.35, ry: 0.50, rSize: 0.10, type: "cave", content: "kitten", kittenIndex: 6, label: "Canyon Cave" },
    { rx: 0.70, ry: 0.60, rSize: 0.08, type: "rocks", content: "coins", coins: 5, label: "Big Boulder" },
    { rx: 0.15, ry: 0.65, rSize: 0.07, type: "stream", content: "critter", critter: "frog", label: "Creek" },
    { rx: 0.85, ry: 0.50, rSize: 0.07, type: "pinetree", content: "coins", coins: 5, label: "Pine Tree" }
  ],
  // Forest 7: Glacier
  [
    { rx: 0.40, ry: 0.48, rSize: 0.09, type: "rocks", content: "kitten", kittenIndex: 7, label: "Icy Rocks" },
    { rx: 0.75, ry: 0.55, rSize: 0.08, type: "pool", content: "coins", coins: 5, label: "Glacier Pool" },
    { rx: 0.20, ry: 0.62, rSize: 0.07, type: "pinetree", content: "critter", critter: "squirrel", label: "Tall Pine" },
    { rx: 0.60, ry: 0.70, rSize: 0.07, type: "flowers", content: "coins", coins: 5, label: "Wildflowers" }
  ],
  // Forest 8: Acadia
  [
    { rx: 0.30, ry: 0.55, rSize: 0.09, type: "rocks", content: "kitten", kittenIndex: 8, label: "Beach Rocks" },
    { rx: 0.60, ry: 0.45, rSize: 0.08, type: "pinetree", content: "coins", coins: 5, label: "Shore Pine" },
    { rx: 0.85, ry: 0.60, rSize: 0.07, type: "bush", content: "critter", critter: "bird", label: "Blueberry Bush" },
    { rx: 0.15, ry: 0.70, rSize: 0.07, type: "pool", content: "coins", coins: 5, label: "Tidepool" }
  ],
  // Forest 9: Everglades
  [
    { rx: 0.25, ry: 0.52, rSize: 0.10, type: "vines", content: "kitten", kittenIndex: 9, label: "Tangled Vines" },
    { rx: 0.55, ry: 0.65, rSize: 0.08, type: "puddle", content: "coins", coins: 5, label: "Swamp Puddle" },
    { rx: 0.80, ry: 0.48, rSize: 0.07, type: "log", content: "critter", critter: "frog", label: "Swamp Log" },
    { rx: 0.40, ry: 0.72, rSize: 0.07, type: "ferns", content: "coins", coins: 5, label: "Swamp Ferns" }
  ],
  // Forest 10: Rocky Mountain
  [
    { rx: 0.35, ry: 0.50, rSize: 0.09, type: "pinetree", content: "kitten", kittenIndex: 10, label: "Mountain Pine" },
    { rx: 0.70, ry: 0.58, rSize: 0.08, type: "rocks", content: "coins", coins: 5, label: "Mountain Rocks" },
    { rx: 0.15, ry: 0.62, rSize: 0.07, type: "stream", content: "critter", critter: "butterfly", label: "Mountain Stream" },
    { rx: 0.88, ry: 0.68, rSize: 0.07, type: "flowers", content: "coins", coins: 5, label: "Alpine Flowers" }
  ],
  // Forest 11: Joshua Tree
  [
    { rx: 0.30, ry: 0.55, rSize: 0.09, type: "rocks", content: "kitten", kittenIndex: 11, label: "Desert Rocks" },
    { rx: 0.65, ry: 0.48, rSize: 0.08, type: "bush", content: "coins", coins: 5, label: "Sage Bush" },
    { rx: 0.85, ry: 0.65, rSize: 0.07, type: "log", content: "critter", critter: "bird", label: "Old Cactus" }
  ],
  // Forest 12: Denali
  [
    { rx: 0.40, ry: 0.52, rSize: 0.09, type: "rocks", content: "kitten", kittenIndex: 12, label: "Snowy Rocks" },
    { rx: 0.75, ry: 0.60, rSize: 0.08, type: "pinetree", content: "coins", coins: 5, label: "Snow Pine" },
    { rx: 0.15, ry: 0.65, rSize: 0.07, type: "stream", content: "critter", critter: "bunny", label: "Icy Stream" },
    { rx: 0.55, ry: 0.72, rSize: 0.07, type: "bush", content: "coins", coins: 5, label: "Snow Bush" }
  ],
  // Forest 13: Shenandoah
  [
    { rx: 0.35, ry: 0.55, rSize: 0.10, type: "flowers", content: "kitten", kittenIndex: 13, label: "Wildflower Patch" },
    { rx: 0.70, ry: 0.45, rSize: 0.08, type: "stump", content: "coins", coins: 5, label: "Old Stump" },
    { rx: 0.15, ry: 0.60, rSize: 0.07, type: "bush", content: "critter", critter: "butterfly", label: "Berry Bush" },
    { rx: 0.85, ry: 0.68, rSize: 0.07, type: "leaves", content: "coins", coins: 5, label: "Leaf Pile" }
  ],
  // Forest 14: Big Bend
  [
    { rx: 0.30, ry: 0.52, rSize: 0.09, type: "cave", content: "kitten", kittenIndex: 14, label: "Desert Cave" },
    { rx: 0.65, ry: 0.62, rSize: 0.08, type: "rocks", content: "coins", coins: 5, label: "Hot Rocks" },
    { rx: 0.85, ry: 0.48, rSize: 0.07, type: "bush", content: "critter", critter: "bird", label: "Thorny Bush" },
    { rx: 0.15, ry: 0.70, rSize: 0.07, type: "log", content: "coins", coins: 5, label: "Dry Log" }
  ],
  // Forest 15: Crater Lake
  [
    { rx: 0.25, ry: 0.55, rSize: 0.09, type: "pool", content: "kitten", kittenIndex: 15, label: "Blue Pool" },
    { rx: 0.60, ry: 0.45, rSize: 0.08, type: "pinetree", content: "coins", coins: 5, label: "Lake Pine" },
    { rx: 0.80, ry: 0.62, rSize: 0.07, type: "rocks", content: "critter", critter: "squirrel", label: "Crater Rocks" },
    { rx: 0.45, ry: 0.72, rSize: 0.07, type: "ferns", content: "coins", coins: 5, label: "Lake Ferns" }
  ],
  // Forest 16: Bryce Canyon
  [
    { rx: 0.35, ry: 0.50, rSize: 0.09, type: "rocks", content: "kitten", kittenIndex: 16, label: "Red Pillar" },
    { rx: 0.70, ry: 0.58, rSize: 0.08, type: "cave", content: "coins", coins: 5, label: "Rock Arch" },
    { rx: 0.15, ry: 0.65, rSize: 0.07, type: "pinetree", content: "critter", critter: "bird", label: "Canyon Pine" },
    { rx: 0.88, ry: 0.68, rSize: 0.07, type: "bush", content: "coins", coins: 5, label: "Canyon Bush" }
  ],
  // Forest 17: Sequoia
  [
    { rx: 0.28, ry: 0.48, rSize: 0.10, type: "hollowtree", content: "kitten", kittenIndex: 17, label: "Giant Tree" },
    { rx: 0.60, ry: 0.60, rSize: 0.08, type: "ferns", content: "coins", coins: 5, label: "Big Ferns" },
    { rx: 0.85, ry: 0.52, rSize: 0.07, type: "mushroom", content: "critter", critter: "squirrel", label: "Mushroom Ring" },
    { rx: 0.15, ry: 0.68, rSize: 0.07, type: "log", content: "coins", coins: 5, label: "Fallen Giant" }
  ],
  // Forest 18: Hawaii Volcanoes
  [
    { rx: 0.30, ry: 0.55, rSize: 0.09, type: "geyser", content: "kitten", kittenIndex: 18, label: "Lava Vent" },
    { rx: 0.65, ry: 0.48, rSize: 0.08, type: "rocks", content: "coins", coins: 5, label: "Lava Rocks" },
    { rx: 0.85, ry: 0.62, rSize: 0.07, type: "ferns", content: "critter", critter: "bird", label: "Tropical Ferns" },
    { rx: 0.15, ry: 0.70, rSize: 0.07, type: "vines", content: "coins", coins: 5, label: "Jungle Vines" }
  ],
  // Forest 19: Carlsbad Caverns
  [
    { rx: 0.35, ry: 0.52, rSize: 0.09, type: "cave", content: "kitten", kittenIndex: 19, label: "Deep Cavern" },
    { rx: 0.65, ry: 0.60, rSize: 0.08, type: "rocks", content: "coins", coins: 5, label: "Crystal Rocks" },
    { rx: 0.20, ry: 0.65, rSize: 0.07, type: "puddle", content: "critter", critter: "frog", label: "Cave Pool" },
    { rx: 0.80, ry: 0.48, rSize: 0.07, type: "mushroom", content: "coins", coins: 5, label: "Cave Mushroom" }
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
  coins = 30;
  ownedItems = {};
  foundKittens = [];
  for (var i = 0; i < KITTENS.length; i++) foundKittens.push(false);
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
  var titleSize = min(width, height) * 0.12;

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
  textSize(titleSize * 0.38);
  textStyle(NORMAL);
  fill(255, 255, 255, 200);
  text("A Fun Forest Game", width / 2, titleY + titleSize * 0.7);

  // Draw cute kittens peeking from sides
  drawMenuKittens();

  // Play button
  var btnY = height * 0.6;
  var btnW = min(width * 0.45, 340);
  var btnH = min(height * 0.1, 85);
  var btnHover = isInRect(mouseX, mouseY, width / 2, btnY, btnW, btnH);
  drawButton(width / 2, btnY, btnW, btnH, "PLAY!", [100, 200, 100], btnHover);

  // Paw prints decoration
  drawPawPrints(width / 2, height * 0.75, menuFrame);

  // Back to games link hint
  textSize(min(width, height) * 0.025);
  fill(255, 255, 255, 120);
  textAlign(CENTER, CENTER);
  text("Press ESC to go back", width / 2, height * 0.93);
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
  var btnW = min(width * 0.45, 340);
  var btnH = min(height * 0.1, 85);
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
    textSize(min(width, height) * 0.08);
    fill(255, 200, 100);
    text("Oh no!", width / 2, height * 0.15);

    textStyle(NORMAL);
    textSize(min(width, height) * 0.042);
    fill(255, 255, 255, 230);
    textWrap(WORD);
    textLeading(min(width, height) * 0.065);
    text(
      "Your 20 cute kittens ran away\nand got lost in the woods!",
      width / 2, height * 0.30
    );

    // Draw scattered kitten silhouettes
    var storyCols = 5;
    var storyRows = ceil(KITTENS.length / storyCols);
    for (var i = 0; i < KITTENS.length; i++) {
      var kx = width * 0.15 + (i % storyCols) * (width * 0.17);
      var ky = height * 0.42 + floor(i / storyCols) * (height * 0.10);
      var kb = sin(menuFrame * 0.06 + i * 0.7) * 4;
      drawKittenCharacter(kx, ky + kb, min(width, height) * 0.065, i, "idle");
    }

    textSize(min(width, height) * 0.038);
    fill(255, 255, 255, 180);
    text(
      "They are hiding in parks far away.\nCan you find them all?",
      width / 2, height * 0.78
    );
  } else {
    // Tips page
    textAlign(CENTER, CENTER);
    textStyle(BOLD);
    textSize(min(width, height) * 0.06);
    fill(255, 200, 100);
    text("How to Find Kittens", width / 2, height * 0.12);

    textStyle(NORMAL);
    var tipSize = min(width, height) * 0.038;
    textSize(tipSize);
    fill(255, 255, 255, 220);

    var tips = [
      "Read the HINT to pick the right thing!",
      "Each kitten needs its OWN thing!",
      "Wrong thing = kitten runs away!",
      "Buy things at the SHOP!",
      "You can go to any forest!"
    ];

    var startY = height * 0.26;
    var gap = min(height * 0.1, 65);
    for (var i = 0; i < tips.length; i++) {
      var tipY = startY + i * gap;
      var icon = ["fish", "feather", "bell", "coins", "map"][i];
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
  var btnW = min(width * 0.4, 280);
  var btnH = min(height * 0.09, 70);
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
  var btnW = min(width * 0.4, 280);
  var btnH = min(height * 0.09, 70);
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
  textSize(min(width, height) * 0.06);
  fill(80, 50, 20);
  text("Pick a Forest!", width / 2, height * 0.07);

  // Kitten counter
  var foundCount = countFoundKittens();
  textStyle(NORMAL);
  textSize(min(width, height) * 0.035);
  fill(120, 80, 40);
  text("Kittens Found: " + foundCount + " / " + KITTENS.length, width / 2, height * 0.12);

  // Coin counter
  drawCoinHUD(width - 80, height * 0.06);

  // Forest cards - scrollable grid
  var mapCols = width > 900 ? 5 : (width > 600 ? 4 : 3);
  var mapRows = ceil(FORESTS.length / mapCols);
  var cardW = min((width * 0.85) / mapCols, 150);
  var cardH = min((height * 0.58) / mapRows, 140);
  var gap = min(width * 0.015, 10);
  mapHoveredForest = -1;

  var totalGridW = mapCols * cardW + (mapCols - 1) * gap;
  var gridStartX = (width - totalGridW) / 2 + cardW / 2;
  var gridStartY = height * 0.19;

  for (var i = 0; i < FORESTS.length; i++) {
    var col = i % mapCols;
    var row = floor(i / mapCols);
    var cx = gridStartX + col * (cardW + gap);
    var cy = gridStartY + row * (cardH + gap) + cardH / 2;
    drawForestCard(i, cx, cy, cardW, cardH);
  }

  // Bottom buttons: Shop and Collection
  var bbY = height * 0.93;
  var bbW = min(width * 0.25, 200);
  var bbH = min(height * 0.08, 65);
  var shopHover = isInRect(mouseX, mouseY, width * 0.35, bbY, bbW, bbH);
  var collHover = isInRect(mouseX, mouseY, width * 0.65, bbY, bbW, bbH);
  drawButton(width * 0.35, bbY, bbW, bbH, "SHOP", [220, 160, 60], shopHover);
  drawButton(width * 0.65, bbY, bbW, bbH, "MY KITTENS", [200, 100, 160], collHover);

  // Back to hub
  var backHover = isInRect(mouseX, mouseY, 60, 30, 100, 40);
  drawSmallButton(60, 30, 100, 40, "HOME", backHover);
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
  textSize(min(w * 0.18, 20));
  fill(70, 50, 30);
  text(f.name, cx, cy + h * 0.22);

  // Subtitle
  textStyle(NORMAL);
  textSize(min(w * 0.13, 14));
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
  var f = FORESTS[idx];
  if (f.treeType === "redwood") return [100, 55, 25];
  if (f.treeType === "autumn") return [200, 110, 40];
  if (f.treeType === "mossy") return [30, 80, 35];
  // pine and default
  return [35, 85, 35];
}

function drawForestFeature(idx, x, y, s) {
  push();
  noStroke();
  var f = FORESTS[idx];
  var ambient = f.ambientType;
  var tree = f.treeType;

  if (ambient === "steam") {
    // Geyser steam
    fill(200, 220, 255, 150);
    ellipse(x, y, s * 0.5, s);
    fill(100, 180, 230, 100);
    ellipse(x, y + s * 0.3, s * 0.6, s * 0.3);
  } else if (ambient === "spray") {
    // Waterfall / spray
    fill(180, 190, 200);
    rect(x - s * 0.4, y - s * 0.4, s * 0.3, s * 0.9);
    fill(200, 230, 255, 180);
    rect(x - s * 0.35, y - s * 0.3, s * 0.2, s * 0.8);
  } else if (tree === "redwood") {
    // Big tree trunk
    fill(120, 65, 30);
    rect(x - s * 0.12, y - s * 0.3, s * 0.24, s * 0.7);
    fill(60, 130, 50);
    ellipse(x, y - s * 0.4, s * 0.6, s * 0.4);
  } else if (tree === "autumn") {
    // Autumn leaves
    var lcolors = [[220, 80, 40], [240, 180, 40], [200, 50, 30]];
    for (var i = 0; i < 5; i++) {
      var lc = lcolors[i % 3];
      fill(lc[0], lc[1], lc[2], 200);
      var lx = x + sin(i * 2.5) * s * 0.3;
      var ly = y + cos(i * 1.8) * s * 0.2;
      ellipse(lx, ly, s * 0.2, s * 0.15);
    }
  } else if (ambient === "rain") {
    // Rain drops
    stroke(150, 200, 220, 150);
    strokeWeight(1);
    for (var i = 0; i < 6; i++) {
      var rx = x - s * 0.4 + i * s * 0.16;
      var ry = y - s * 0.3 + (i % 3) * s * 0.2;
      line(rx, ry, rx - 2, ry + s * 0.15);
    }
  } else {
    // Default - motes / dust
    fill(255, 255, 200, 120);
    for (var i = 0; i < 4; i++) {
      var mx = x + sin(i * 2.1) * s * 0.3;
      var my = y + cos(i * 1.7) * s * 0.2;
      ellipse(mx, my, s * 0.1, s * 0.1);
    }
  }
  pop();
}

function handleMapClick() {
  // Back button
  if (isInRect(mouseX, mouseY, 60, 30, 100, 40)) {
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
  var bbY = height * 0.93;
  var bbW = min(width * 0.25, 200);
  var bbH = min(height * 0.08, 65);

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
  textSize(min(width, height) * 0.065);
  fill(130, 80, 30);
  text("SHOP", width / 2, height * 0.07);

  // Coin counter
  drawCoinHUD(width / 2, height * 0.13);

  // Items grid
  var cols = width > 900 ? 5 : (width > 500 ? 3 : 2);
  var itemW = min(width / (cols + 1), 155);
  var itemH = min(height * 0.18, 150);
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
  var backHover = isInRect(mouseX, mouseY, width / 2, height * 0.92, 160, 55);
  drawButton(width / 2, height * 0.92, 160, 55, "BACK", [150, 130, 110], backHover);
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

  // Item icon
  var iconSize = min(w * 0.4, h * 0.3);
  drawItemIcon(item.id, cx, cy - h * 0.18, iconSize);

  // Name
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(min(w * 0.17, 18));
  fill(70, 50, 30);
  text(item.name, cx, cy + h * 0.12);

  // Price or "OWNED"
  textStyle(NORMAL);
  textSize(min(w * 0.14, 16));
  if (owned) {
    fill(60, 160, 60);
    text("OWNED!", cx, cy + h * 0.28);
  } else {
    fill(canAfford ? [180, 140, 40] : [200, 80, 80]);
    text(item.price + " coins", cx, cy + h * 0.28);
  }

  // Description
  textSize(min(w * 0.12, 13));
  fill(130, 110, 80);
  text(item.desc, cx, cy + h * 0.4);

  pop();
}

function handleShopClick() {
  // Back button
  if (isInRect(mouseX, mouseY, width / 2, height * 0.92, 160, 55)) {
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
      showFeedback("You have this!", mouseX, mouseY - 30);
    } else {
      showFeedback("Need more coins!", mouseX, mouseY - 30);
    }
  }
}

// ============== SCREEN: FOREST ==============

function enterForest(idx) {
  forestSpots = [];
  var templates = SPOT_TEMPLATES[idx];

  // Create all spots as empty first
  for (var i = 0; i < templates.length; i++) {
    var t = templates[i];
    forestSpots.push({
      rx: t.rx, ry: t.ry, rSize: t.rSize,
      type: t.type, label: t.label,
      content: "empty", kittenIndex: -1,
      coins: 0, critter: "",
      investigated: false, scared: false
    });
  }

  // Find unfound kittens for this forest
  var forestKittens = getKittensInForest(idx);
  var unfoundKittens = [];
  for (var i = 0; i < forestKittens.length; i++) {
    if (!foundKittens[forestKittens[i]]) unfoundKittens.push(forestKittens[i]);
  }

  // Shuffle spot indices for random placement
  var spotIndices = [];
  for (var i = 0; i < forestSpots.length; i++) spotIndices.push(i);
  for (var i = spotIndices.length - 1; i > 0; i--) {
    var j = floor(random(i + 1));
    var tmp = spotIndices[i];
    spotIndices[i] = spotIndices[j];
    spotIndices[j] = tmp;
  }

  // Assign unfound kittens to random spots
  var assigned = 0;
  for (var i = 0; i < unfoundKittens.length && i < spotIndices.length; i++) {
    var si = spotIndices[i];
    forestSpots[si].content = "kitten";
    forestSpots[si].kittenIndex = unfoundKittens[i];
    assigned++;
  }

  // Fill remaining spots with coins and critters
  var critters = ["butterfly", "bunny", "squirrel", "bird", "frog"];
  var critterIdx = floor(random(critters.length));
  var fillerIdx = 0;
  for (var i = assigned; i < spotIndices.length; i++) {
    var si = spotIndices[i];
    if (fillerIdx % 3 === 2) {
      forestSpots[si].content = "critter";
      forestSpots[si].critter = critters[critterIdx % critters.length];
      critterIdx++;
    } else {
      forestSpots[si].content = "coins";
      forestSpots[si].coins = 8;
    }
    fillerIdx++;
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
  rect(0, 0, width, height * 0.1);

  // Forest name
  textAlign(LEFT, CENTER);
  textStyle(BOLD);
  textSize(min(width, height) * 0.04);
  fill(255);
  text(FORESTS[currentForest].name, 110, height * 0.04);

  // Kitten count for this forest
  var fk = getKittensInForest(currentForest);
  var fkFound = 0;
  for (var i = 0; i < fk.length; i++) {
    if (foundKittens[fk[i]]) fkFound++;
  }
  textStyle(NORMAL);
  textSize(min(width, height) * 0.03);
  fill(255, 220, 150);
  text("Kittens: " + fkFound + "/" + fk.length, 110, height * 0.075);

  // Coins
  drawCoinHUD(width - 80, height * 0.04);

  // Back button
  var backHover = isInRect(mouseX, mouseY, 45, height * 0.05, 80, 38);
  drawSmallButton(45, height * 0.05, 80, 38, "MAP", backHover);

  // Help hint at bottom
  if (hoveredSpot >= 0) {
    var spot = forestSpots[hoveredSpot];
    textAlign(CENTER, CENTER);
    textStyle(NORMAL);
    textSize(min(width, height) * 0.035);

    // Background pill
    var tw = textWidth(spot.label) + 40;
    noStroke();
    fill(0, 0, 0, 150);
    rect(width / 2 - tw / 2, height * 0.89, tw, 40, 20);
    fill(255);
    text(spot.label, width / 2, height * 0.89 + 20);
  }
}

function handleForestClick() {
  // Back button
  if (isInRect(mouseX, mouseY, 45, height * 0.05, 80, 38)) {
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
        butterfly: "A butterfly! Not a kitten!",
        bunny: "A bunny! Not a kitten!",
        squirrel: "A squirrel! Not a kitten!",
        bird: "A bird! Not a kitten!",
        frog: "Ribbit! A frog! Not a kitten!"
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
    textSize(min(panelW, panelH) * 0.09);
    fill(255, 150, 100);
    var meowBob = sin(menuFrame * 0.1) * 3;
    text("Meow!", panelX, panelY - panelH * 0.35 + meowBob);
  }

  // Hint text
  textStyle(NORMAL);
  textSize(min(panelW, panelH) * 0.06);
  fill(80, 60, 40);
  textAlign(CENTER, CENTER);

  if (spot.scared) {
    fill(200, 60, 60);
    textSize(min(panelW, panelH) * 0.06);
    text("Oh no! Wrong one!", panelX, panelY - panelH * 0.02);
    textSize(min(panelW, panelH) * 0.05);
    fill(200, 60, 60);
    text("The kitten ran away!", panelX, panelY + panelH * 0.06);
    textSize(min(panelW, panelH) * 0.04);
    fill(140, 100, 70);
    text("Go back and try again!", panelX, panelY + panelH * 0.14);
  } else {
    text(kitten.hint, panelX, panelY + panelH * 0.02);
  }

  // Item inventory
  if (!spot.scared) {
    var itemY = panelY + panelH * 0.25;
    textAlign(CENTER, CENTER);
    textSize(min(panelW, panelH) * 0.04);
    fill(140, 120, 90);
    text("Pick one:", panelX, itemY - panelH * 0.06);

    var ownedList = getOwnedItemsList();
    if (ownedList.length === 0) {
      fill(180, 100, 60);
      text("You have no things! Go to the shop!", panelX, itemY);
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
  var cbHover = isInRect(mouseX, mouseY, panelX, cbY, 140, 48);
  drawButton(panelX, cbY, 140, 48, "BACK", [160, 140, 120], cbHover);
}

function handleInvestigateClick() {
  var spot = forestSpots[currentSpotIndex];
  var panelW = min(width * 0.85, 600);
  var panelH = min(height * 0.8, 500);
  var panelX = width / 2;
  var panelY = height * 0.45;

  // Close button
  var cbY = panelY + panelH * 0.42;
  if (isInRect(mouseX, mouseY, panelX, cbY, 140, 48)) {
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

  if (itemId === kitten.neededItem) {
    // Correct item! Found the kitten!
    foundKittens[spot.kittenIndex] = true;
    spot.investigated = true;
    foundKittenIdx = spot.kittenIndex;
    foundAnimTimer = 0;
    gameState = "found";
    transitionAlpha = 200;
    coins += 10;
    spawnConfetti(width / 2, height / 2, 40, [255, 200, 100]);
    return;
  }

  // Wrong item - kitten gets scared and runs away!
  spot.scared = true;
  spawnConfetti(width / 2, height / 2, 15, [200, 60, 60]);
  showFeedback("Oh no! Wrong one! It ran away!", width / 2, height * 0.3);
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
  textSize(min(width, height) * 0.08 * titleScale);
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
    textSize(min(width, height) * 0.06);
    fill(kitten.bodyColor[0], kitten.bodyColor[1], kitten.bodyColor[2], nameAlpha);
    stroke(0, 0, 0, nameAlpha * 0.3);
    strokeWeight(2);
    text(kitten.name.toUpperCase(), width / 2, height * 0.66);
    noStroke();

    // Personality
    textStyle(NORMAL);
    textSize(min(width, height) * 0.035);
    fill(120, 90, 60, nameAlpha);
    text(kitten.personality, width / 2, height * 0.71);
  }

  // Story text
  if (foundAnimTimer > 30) {
    var storyAlpha = min(255, (foundAnimTimer - 30) * 10);
    textSize(min(width, height) * 0.032);
    fill(100, 75, 50, storyAlpha);
    text(kitten.foundText, width / 2, height * 0.78);

    // +10 coins
    textStyle(BOLD);
    textSize(min(width, height) * 0.04);
    fill(240, 190, 50, storyAlpha);
    text("+10 coins!", width / 2, height * 0.83);
  }

  // Continue button
  if (foundAnimTimer > 50) {
    var btnAlpha = min(255, (foundAnimTimer - 50) * 10);
    var btnHover = isInRect(mouseX, mouseY, width / 2, height * 0.91, 200, 60);
    if (btnAlpha >= 200) {
      drawButton(width / 2, height * 0.91, 200, 60, "YAY!", [100, 200, 120], btnHover);
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

  if (isInRect(mouseX, mouseY, width / 2, height * 0.91, 200, 60)) {
    // Check if all kittens found
    if (countFoundKittens() >= KITTENS.length) {
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
  textSize(min(width, height) * 0.065);
  fill(160, 80, 120);
  text("My Kittens", width / 2, height * 0.07);

  var foundCount = countFoundKittens();
  textStyle(NORMAL);
  textSize(min(width, height) * 0.035);
  fill(140, 110, 130);
  text(foundCount + " of " + KITTENS.length + " found", width / 2, height * 0.12);

  // Kitten grid
  var cols = width > 900 ? 5 : (width > 500 ? 4 : 3);
  var rows = ceil(KITTENS.length / cols);
  var cellW = min(width / (cols + 1), 120);
  var cellH = min((height * 0.7) / rows, 130);
  var gap = min(width * 0.01, 6);

  for (var i = 0; i < KITTENS.length; i++) {
    var col = i % cols;
    var row = floor(i / cols);
    var totalRowW = cols * cellW + (cols - 1) * gap;
    var startX = (width - totalRowW) / 2 + cellW / 2;
    var cx = startX + col * (cellW + gap);
    var cy = height * 0.22 + row * (cellH + gap) + cellH / 2;
    drawCollectionKitten(i, cx, cy, cellW, cellH);
  }

  // Back button
  var backHover = isInRect(mouseX, mouseY, width / 2, height * 0.93, 160, 55);
  drawButton(width / 2, height * 0.93, 160, 55, "BACK", [160, 120, 150], backHover);
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
    textSize(min(w * 0.18, 17));
    noStroke();
    fill(80, 60, 40);
    text(kitten.name, cx, cy + h * 0.33);

    // Forest hint
    textStyle(NORMAL);
    textSize(min(w * 0.13, 13));
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
    textSize(min(w * 0.3, 28));
    fill(180, 170, 165);
    text("?", cx, cy + h * 0.02);

    textSize(min(w * 0.14, 14));
    fill(170, 165, 160);
    text("???", cx, cy + h * 0.35);
  }
  pop();
}

function handleCollectionClick() {
  if (isInRect(mouseX, mouseY, width / 2, height * 0.93, 160, 55)) {
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
  textSize(min(width, height) * 0.085);
  fill(255, 100, 150);
  stroke(255, 255, 255);
  strokeWeight(3);
  text("YOU FOUND THEM ALL!", width / 2, height * 0.1 + titleBounce);
  noStroke();

  // All kittens in a cute arrangement
  var kitSize = min(width, height) * 0.07;
  for (var i = 0; i < KITTENS.length; i++) {
    var angle = (i / KITTENS.length) * TWO_PI - HALF_PI;
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
    textSize(min(width, height) * 0.04);
    noStroke();
    fill(120, 60, 80);
    text("Your kittens are so happy to be home!", width / 2, height * 0.8);
  }

  // Play again button
  if (winTimer > 60) {
    var btnHover = isInRect(mouseX, mouseY, width / 2, height * 0.9, 220, 65);
    drawButton(width / 2, height * 0.9, 220, 65, "PLAY AGAIN!", [200, 100, 150], btnHover);
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
  if (isInRect(mouseX, mouseY, width / 2, height * 0.9, 220, 65)) {
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
    default: drawGenericForestScene(idx); break;
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

function drawGenericForestScene(idx) {
  var f = FORESTS[idx];
  noStroke();

  // Mountains
  fill(f.groundColor[0] - 20, f.groundColor[1] - 10, f.groundColor[2] - 5, 150);
  drawMountainRange(height * 0.35, 5, 0.15, 0.1);
  fill(f.groundColor[0] - 10, f.groundColor[1] - 5, f.groundColor[2], 180);
  drawMountainRange(height * 0.42, 4, 0.18, 0.08);

  // Ground
  fill(f.groundColor[0], f.groundColor[1], f.groundColor[2]);
  rect(0, height * 0.55, width, height * 0.45);
  fill(f.groundColor2[0], f.groundColor2[1], f.groundColor2[2]);
  rect(0, height * 0.7, width, height * 0.3);

  // Trees based on treeType
  var treeC = getTreeColor(idx);
  if (f.treeType === "pine") {
    for (var i = 0; i < 8; i++) {
      var tx = width * (0.05 + i * 0.13);
      var ty = height * (0.42 + sin(i * 2.1) * 0.06);
      var th = height * (0.12 + sin(i * 1.5) * 0.04);
      drawPineTree(tx, ty, th, [treeC[0] + i * 3, treeC[1] + i * 2, treeC[2]]);
    }
  } else if (f.treeType === "redwood") {
    var trunkColors = [[120, 65, 30], [110, 58, 25], [130, 70, 35]];
    var trunkPositions = [0.1, 0.4, 0.65, 0.9];
    for (var i = 0; i < trunkPositions.length; i++) {
      var tc = trunkColors[i % trunkColors.length];
      fill(tc[0], tc[1], tc[2]);
      var tw = width * 0.07;
      var tx = width * trunkPositions[i];
      rect(tx - tw / 2, 0, tw, height * 0.72);
      fill(tc[0] - 15, tc[1] - 10, tc[2] - 8, 80);
      for (var j = 0; j < 6; j++) {
        var by = j * height * 0.1 + 10;
        rect(tx - tw / 2 + 3, by, tw - 6, 3);
      }
    }
    for (var i = 0; i < 10; i++) {
      var fx = (i / 9) * width;
      var fy = height * (0.6 + sin(i * 1.7) * 0.04);
      drawFern(fx, fy, 22 + sin(i * 2.3) * 6);
    }
  } else if (f.treeType === "autumn") {
    var autumnColors = [
      [220, 80, 30], [240, 160, 30], [200, 50, 25],
      [180, 120, 30], [230, 130, 40], [210, 190, 40]
    ];
    for (var i = 0; i < 9; i++) {
      var tx = width * (0.05 + i * 0.11);
      var ty = height * (0.42 + sin(i * 1.9) * 0.06);
      var th = height * (0.1 + sin(i * 2.3) * 0.03);
      var tc = autumnColors[i % autumnColors.length];
      fill(100, 70, 40);
      rect(tx - 4, ty, 8, th * 0.5);
      fill(tc[0], tc[1], tc[2]);
      ellipse(tx, ty - th * 0.1, th * 0.8, th * 0.9);
    }
  } else if (f.treeType === "mossy") {
    for (var i = 0; i < 7; i++) {
      var tx = width * (0.05 + i * 0.14);
      var ty = height * 0.5;
      var th = height * (0.2 + sin(i * 1.6) * 0.06);
      fill(50, 40, 30);
      rect(tx - 8, ty - th, 16, th + 8);
      fill(80, 150, 60, 180);
      rect(tx - 10, ty - th * 0.8, 6, th * 0.5);
      fill(30, 75, 30);
      ellipse(tx, ty - th - 8, 40, 32);
    }
    for (var i = 0; i < 8; i++) {
      var fx = (i / 7) * width;
      var fy = height * (0.55 + sin(i * 2.1) * 0.04);
      drawFern(fx, fy, 25 + sin(i * 1.4) * 8);
    }
  }

  // Ambient details based on ambientType
  if (f.ambientType === "steam") {
    for (var i = 0; i < 4; i++) {
      var sx = width * (0.2 + i * 0.2) + sin(menuFrame * 0.02 + i) * 8;
      var sy = height * 0.55 - sin(menuFrame * 0.015 + i * 1.5) * 20;
      var sa = 80 + sin(menuFrame * 0.03 + i * 2) * 30;
      fill(255, 255, 255, sa);
      ellipse(sx, sy, 20 + i * 5, 15 + i * 3);
    }
  } else if (f.ambientType === "spray") {
    for (var i = 0; i < 6; i++) {
      var sx = width * 0.5 + sin(i * 1.8 + menuFrame * 0.03) * 15;
      var sy = height * 0.55 + cos(i * 2.3 + menuFrame * 0.02) * 8;
      fill(220, 235, 255, 80 + sin(menuFrame * 0.05 + i) * 30);
      ellipse(sx, sy, 6 + i % 3 * 3, 6 + i % 2 * 2);
    }
  }

  // Ground details
  fill(f.groundColor[0] + 20, f.groundColor[1] + 10, f.groundColor[2] - 10);
  for (var i = 0; i < 8; i++) {
    var rx = (sin(i * 5.7) * 0.5 + 0.5) * width;
    var ry = height * 0.7 + (cos(i * 3.2) * 0.5 + 0.5) * height * 0.12;
    ellipse(rx, ry, 7 + i % 3 * 3, 4 + i % 2 * 2);
  }
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
    fill(100, 160, 220);
    rect(-s * 0.12, -s * 0.22, s * 0.24, s * 0.1, 3, 3, 0, 0);
    // Label
    fill(100, 160, 220, 60);
    rect(-s * 0.1, 0, s * 0.2, s * 0.12);
    // Milk drop
    fill(240, 240, 248);
    ellipse(0, s * 0.05, s * 0.1, s * 0.08);
  } else if (itemId === "blanket") {
    // Folded blanket
    fill(130, 170, 230);
    rect(-s * 0.25, -s * 0.1, s * 0.5, s * 0.3, 5);
    fill(110, 150, 210);
    rect(-s * 0.25, -s * 0.1, s * 0.5, s * 0.12, 5, 5, 0, 0);
    // Pattern
    fill(160, 195, 240);
    ellipse(-s * 0.1, s * 0.05, s * 0.08, s * 0.08);
    ellipse(s * 0.1, s * 0.05, s * 0.08, s * 0.08);
    // Fold edge
    fill(150, 185, 235);
    rect(-s * 0.22, -s * 0.15, s * 0.44, s * 0.06, 3);
  } else if (itemId === "laser") {
    // Laser pointer body
    fill(180, 180, 190);
    rect(-s * 0.06, -s * 0.05, s * 0.12, s * 0.35, 3);
    // Button
    fill(230, 60, 60);
    ellipse(0, s * 0.05, s * 0.08, s * 0.06);
    // Laser beam
    fill(230, 60, 60, 120);
    triangle(-s * 0.03, -s * 0.05, s * 0.03, -s * 0.05, 0, -s * 0.4);
    // Red dot
    fill(255, 40, 40);
    ellipse(0, -s * 0.4, s * 0.1, s * 0.1);
    fill(255, 100, 100, 150);
    ellipse(0, -s * 0.4, s * 0.18, s * 0.18);
  } else if (itemId === "music") {
    // Music box body
    fill(180, 130, 90);
    rect(-s * 0.2, -s * 0.05, s * 0.4, s * 0.25, 4);
    // Lid
    fill(200, 150, 100);
    rect(-s * 0.22, -s * 0.12, s * 0.44, s * 0.1, 4, 4, 0, 0);
    // Handle/crank
    fill(220, 190, 50);
    rect(s * 0.18, 0, s * 0.08, s * 0.04);
    ellipse(s * 0.28, s * 0.02, s * 0.06, s * 0.06);
    // Music notes
    fill(220, 160, 200);
    ellipse(-s * 0.15, -s * 0.25, s * 0.08, s * 0.06);
    stroke(220, 160, 200);
    strokeWeight(1.5);
    line(-s * 0.11, -s * 0.25, -s * 0.11, -s * 0.4);
    noStroke();
    fill(220, 160, 200);
    ellipse(s * 0.1, -s * 0.32, s * 0.07, s * 0.05);
    stroke(220, 160, 200);
    strokeWeight(1.5);
    line(s * 0.135, -s * 0.32, s * 0.135, -s * 0.45);
    noStroke();
  } else if (itemId === "compass") {
    // Compass body
    fill(180, 50, 50);
    ellipse(0, 0, s * 0.7, s * 0.7);
    fill(240, 235, 220);
    ellipse(0, 0, s * 0.55, s * 0.55);
    // Needle
    fill(220, 40, 40);
    triangle(0, -s * 0.2, -s * 0.04, s * 0.02, s * 0.04, s * 0.02);
    fill(200, 200, 210);
    triangle(0, s * 0.2, -s * 0.04, -s * 0.02, s * 0.04, -s * 0.02);
    // Center dot
    fill(80, 80, 90);
    ellipse(0, 0, s * 0.06, s * 0.06);
    // N marker
    fill(220, 40, 40);
    textAlign(CENTER, CENTER);
    textSize(s * 0.12);
    textStyle(BOLD);
    text("N", 0, -s * 0.28);
    textStyle(NORMAL);
  } else if (itemId === "hat") {
    // Sun hat
    fill(240, 220, 150);
    ellipse(0, s * 0.05, s * 0.8, s * 0.2);
    fill(230, 210, 140);
    arc(0, s * 0.05, s * 0.5, s * 0.5, PI, TWO_PI);
    // Ribbon
    fill(200, 80, 80);
    rect(-s * 0.25, -s * 0.02, s * 0.5, s * 0.07);
  } else if (itemId === "scarf") {
    // Scarf
    fill(200, 80, 80);
    rect(-s * 0.3, -s * 0.1, s * 0.6, s * 0.12, 4);
    rect(-s * 0.3, -s * 0.1, s * 0.12, s * 0.4, 4);
    // Fringe
    fill(180, 60, 60);
    for (var i = 0; i < 3; i++) {
      rect(-s * 0.28 + i * s * 0.04, s * 0.25, s * 0.02, s * 0.06);
    }
    // Pattern
    fill(240, 220, 150);
    ellipse(-s * 0.05, -s * 0.04, s * 0.06, s * 0.06);
    ellipse(s * 0.1, -s * 0.04, s * 0.06, s * 0.06);
  } else if (itemId === "butterfly_net") {
    // Net handle
    stroke(160, 120, 70);
    strokeWeight(3);
    line(0, s * 0.35, 0, -s * 0.05);
    noStroke();
    // Net ring
    noFill();
    stroke(100, 160, 100);
    strokeWeight(2);
    ellipse(0, -s * 0.2, s * 0.4, s * 0.35);
    noStroke();
    // Net mesh
    fill(180, 220, 180, 80);
    triangle(-s * 0.2, -s * 0.2, s * 0.2, -s * 0.2, 0, -s * 0.45);
  } else if (itemId === "treat") {
    // Treat / biscuit
    fill(200, 150, 80);
    ellipse(0, 0, s * 0.5, s * 0.4);
    fill(180, 130, 60);
    ellipse(0, s * 0.02, s * 0.4, s * 0.3);
    // Sprinkles
    fill(255, 100, 100);
    ellipse(-s * 0.08, -s * 0.04, s * 0.04, s * 0.04);
    fill(100, 200, 100);
    ellipse(s * 0.06, s * 0.02, s * 0.04, s * 0.04);
    fill(100, 150, 255);
    ellipse(-s * 0.02, s * 0.06, s * 0.04, s * 0.04);
  } else if (itemId === "boat") {
    // Toy boat hull
    fill(80, 140, 200);
    arc(0, s * 0.1, s * 0.7, s * 0.3, 0, PI);
    // Sail
    fill(255, 250, 240);
    triangle(0, -s * 0.35, 0, s * 0.05, s * 0.2, s * 0.0);
    // Mast
    stroke(160, 120, 70);
    strokeWeight(2);
    line(0, -s * 0.35, 0, s * 0.1);
    noStroke();
    // Flag
    fill(230, 60, 60);
    triangle(0, -s * 0.35, 0, -s * 0.28, s * 0.08, -s * 0.32);
  } else if (itemId === "rope") {
    // Coiled rope
    noFill();
    stroke(180, 150, 100);
    strokeWeight(3);
    arc(0, 0, s * 0.4, s * 0.4, 0, PI + HALF_PI);
    arc(s * 0.05, s * 0.02, s * 0.28, s * 0.28, PI, TWO_PI + HALF_PI);
    noStroke();
    // End
    fill(180, 150, 100);
    ellipse(s * 0.15, s * 0.2, s * 0.06, s * 0.06);
    ellipse(-s * 0.2, 0, s * 0.06, s * 0.06);
  } else if (itemId === "basket") {
    // Woven basket
    fill(170, 120, 60);
    arc(0, s * 0.05, s * 0.6, s * 0.4, 0, PI);
    rect(-s * 0.3, -s * 0.02, s * 0.6, s * 0.08);
    // Handle
    noFill();
    stroke(150, 100, 45);
    strokeWeight(2.5);
    arc(0, -s * 0.02, s * 0.4, s * 0.3, PI, TWO_PI);
    noStroke();
    // Weave pattern
    fill(190, 140, 75);
    for (var i = 0; i < 4; i++) {
      rect(-s * 0.22 + i * s * 0.13, s * 0.06, s * 0.04, s * 0.12);
    }
  } else if (itemId === "torch") {
    // Torch handle
    fill(140, 100, 50);
    rect(-s * 0.06, -s * 0.05, s * 0.12, s * 0.4, 3);
    // Flame
    fill(255, 160, 50, 200);
    ellipse(0, -s * 0.15, s * 0.25, s * 0.35);
    fill(255, 220, 80, 180);
    ellipse(0, -s * 0.2, s * 0.15, s * 0.25);
    fill(255, 250, 200, 150);
    ellipse(0, -s * 0.22, s * 0.08, s * 0.15);
    // Glow
    fill(255, 200, 80, 30);
    ellipse(0, -s * 0.15, s * 0.5, s * 0.5);
  } else if (itemId === "gem") {
    // Gem
    fill(150, 100, 220);
    beginShape();
    vertex(0, -s * 0.3);
    vertex(s * 0.2, -s * 0.1);
    vertex(s * 0.15, s * 0.15);
    vertex(-s * 0.15, s * 0.15);
    vertex(-s * 0.2, -s * 0.1);
    endShape(CLOSE);
    // Facet
    fill(180, 140, 240, 150);
    triangle(0, -s * 0.3, s * 0.2, -s * 0.1, 0, s * 0.05);
    // Sparkle
    fill(255, 255, 255, 200);
    ellipse(-s * 0.05, -s * 0.15, s * 0.06, s * 0.06);
    fill(255, 255, 255, 120);
    ellipse(s * 0.08, -s * 0.05, s * 0.04, s * 0.04);
  }

  pop();
}

function drawItemMiniIcon(type, x, y, size) {
  push();
  if (type === "coins") {
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
  } else {
    drawItemIcon(type, x, y, size * 0.7);
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

  noStroke();
  drawItemIcon(itemId, x, y - s * 0.05, s * 0.6);

  // Name below
  textAlign(CENTER, CENTER);
  textStyle(NORMAL);
  textSize(s * 0.22);
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
  textSize(22);
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
  textSize(min(width, height) * 0.038);

  // Background pill
  var tw = textWidth(feedbackMsg) + 30;
  noStroke();
  fill(0, 0, 0, alpha * 0.5);
  rect(feedbackX - tw / 2, floatY - 18, tw, 36, 18);

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
