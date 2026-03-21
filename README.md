# Game Collection

A collection of browser-based games built with p5.js. Each game explores a different theme and unique mechanics.

**Play now:** [jparry.github.io/my-tower-defense](https://jparry.github.io/my-tower-defense/)

## Games

### Medieval Defense
Classic path-based tower defense with a fantasy theme. Place towers along enemy paths to stop waves of invaders.

- 3 difficulty levels with different maps
- 4 tower types: Archer, Mage, Cannon, Barracks
- 10 progressive waves
- Gold-based economy with tower upgrades

### Galactic Outpost
Orbital space station defense with 360-degree combat. Satellites orbit your station and engage enemies from all directions.

- Orbital mechanics — towers rotate around your station
- 5 satellite types including Shield Generators and Tesla Coils
- Dual economy: credits for building, energy for operation
- 1000 waves with boss encounters every 10th wave
- Speed controls: pause, 1x, 5x, 10x

### The Million Dollar Mansion
Idle/clicker emerald mining adventure. Help a poor villager find emeralds, buy upgrades, and build the Million Dollar Emerald Mansion together.

- Click-to-mine with combo multiplier system
- 6 shop items: Detector, Planter, Sucker, Miner, Portal, Mansion
- Villager companion with happiness mechanic (share emeralds to keep them happy)
- Visual world that evolves as you progress
- Milestone celebrations and epic victory sequence

## Tech Stack

- **p5.js** — rendering, animation, and input handling
- **Vanilla JavaScript** — game logic (one JS file per game)
- **HTML5 Canvas** — all rendering via p5.js
- No build step, no dependencies beyond p5.js (loaded via CDN)

## Project Structure

```
my-tower-defense/
├── index.html                    # Game selection hub
├── games/
│   ├── medieval/
│   │   ├── medieval.html         # Game page (loads p5.js + game script)
│   │   └── medieval.js           # All game logic
│   ├── space/
│   │   ├── space.html            # Game page
│   │   └── space.js              # All game logic
│   └── mansion/
│       ├── mansion.html          # Game page
│       └── mansion.js            # All game logic
└── README.md
```

## Local Development

1. Clone the repo
2. Serve the directory with any static file server:
   ```bash
   # Python
   python3 -m http.server 8000

   # Node
   npx serve .
   ```
3. Open `http://localhost:8000` in your browser

> Opening `index.html` directly (via `file://`) works for most browsers but may hit CORS issues with some setups. A local server avoids this.

## Adding a New Game

### 1. Create the game directory

```
games/your-game-name/
├── your-game-name.html
└── your-game-name.js
```

### 2. Set up the HTML page

Use an existing game's HTML as a template. The key pieces:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Your Game Name</title>
    <!-- Load p5.js from CDN -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js"></script>
    <style>
        /* Full-viewport canvas, no scrollbars */
        html, body { margin: 0; padding: 0; overflow: hidden; }
        canvas { display: block; }
    </style>
</head>
<body>
    <script src="your-game-name.js"></script>
</body>
</html>
```

### 3. Write the game script

p5.js expects these global functions in your JS file:

```javascript
function setup() {
    createCanvas(windowWidth, windowHeight);
    // Initialize game state
}

function draw() {
    // Main game loop — called every frame
    // Handle update logic and rendering here
}

function mousePressed() {
    // Handle click events
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
```

All game logic lives in a single JS file. Use classes to organize entities (towers, enemies, projectiles, etc.).

### 4. Add a card to the hub

Add a new `<a>` element inside the `.games-container` div in `index.html`:

```html
<a href="games/your-game-name/your-game-name.html" class="game-card your-card-class">
    <div class="game-title">Your Game Name</div>
    <div class="game-theme">Theme Description</div>
    <div class="game-description">
        Short description of the game's unique hook.
    </div>
    <div class="game-features">
        ✦ Feature 1<br>
        ✦ Feature 2<br>
        ✦ Feature 3
    </div>
    <div class="status new">New!</div>
</a>
```

Add a matching CSS class for the card's gradient background:

```css
.your-card-class {
    background: linear-gradient(135deg, rgba(R, G, B, 0.3), rgba(R, G, B, 0.3));
}
```

### 5. Update this README

Add a section for your game under [Games](#games) with a brief description and feature list.

## Game Architecture Patterns

Each game follows these conventions:

- **Single-file game logic** — all classes and functions in one `.js` file
- **p5.js global mode** — `setup()`, `draw()`, `mousePressed()`, etc. as top-level functions
- **Class-based entities** — `Tower`, `Enemy`, `Projectile`, `Particle`, etc.
- **Game state machine** — use a `gameState` variable (e.g., `"menu"`, `"playing"`, `"gameover"`) to control flow
- **Wave system** — enemies spawn in waves with configurable timing and composition
- **In-canvas UI** — all menus, buttons, and HUD elements are drawn on the p5.js canvas (no DOM elements)
- **Self-contained** — each game is fully independent with no shared code between games
