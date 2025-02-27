// --- Global Variables ---
let towers = [];
let enemies = [];
let projectiles = [];
let particles = [];

let path = []; // Fixed enemy path (waypoints)
let waveManager;
let selectedTowerType = null; // For placing new towers
let selectedTower = null; // For upgrading an existing tower

let gold = 500;
let lives = 10;

let gameState = "build"; // "build" (player placing towers) or "wave" (enemies spawning)
let towerOptions = []; // UI tower choices

// --- Tooltip System ---
let tooltip = {
    text: "",
    x: 0,
    y: 0,
    visible: false,
    timer: 0,
    show: function (text, x, y) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.visible = true;
        this.timer = 120; // Show for 2 seconds (60 frames per second)
    },
    update: function () {
        if (this.visible && this.timer > 0) {
            this.timer--;
            if (this.timer <= 0) {
                this.visible = false;
            }
        }
    },
    draw: function () {
        if (this.visible) {
            push();
            // Draw tooltip background
            fill(50, 50, 80, 230);
            stroke(150, 150, 200);
            strokeWeight(1);
            rectMode(CORNER);

            // Calculate text width for proper sizing
            textSize(12);
            let textW = textWidth(this.text) + 20;
            let textH = 20;

            // Position tooltip near the mouse but ensure it stays on screen
            let tooltipX = this.x;
            let tooltipY = this.y + 20;

            // Keep tooltip on screen
            if (tooltipX + textW > width) tooltipX = width - textW;
            if (tooltipY + textH > height) tooltipY = this.y - textH - 5;

            rect(tooltipX, tooltipY, textW, textH, 5);

            // Draw tooltip text
            fill(255);
            noStroke();
            textAlign(CENTER, CENTER);
            text(this.text, tooltipX + textW / 2, tooltipY + textH / 2);
            pop();
        }
    }
};

// --- Grid System Variables ---
let gridCellSize = 40; // Size of each grid cell
let pathWidth = gridCellSize * 1.2; // Path is 1.2x the width of a tower (smaller than before)
let showGrid = true; // Toggle grid visibility

// --- Theme and Visual Settings ---
let gameTheme = "fantasy"; // Options: "fantasy", "cyber", "zombie", "alien"
let gameSpeed = 1; // Game speed multiplier (1x, 2x, 3x)
let particleColors = {
    fantasy: [
        [255, 215, 0],    // Gold
        [148, 0, 211],    // Purple
        [0, 191, 255]     // Deep sky blue
    ],
    hit: [255, 100, 0]    // Hit effect (orange)
};

// --- p5.js Setup ---
function setup() {
    createCanvas(800, 600);

    // Define fixed path using waypoints aligned to grid
    // Each point is at the center of a grid cell
    path = [
        createVector(gridCellSize * 1.5, height - gridCellSize * 1.5),  // Start at bottom left
        createVector(gridCellSize * 1.5, gridCellSize * 8),             // Go up
        createVector(gridCellSize * 10, gridCellSize * 8),              // Go right
        createVector(gridCellSize * 10, gridCellSize * 2.5),            // Go up
        createVector(width - gridCellSize * 1.5, gridCellSize * 2.5)    // Go right to exit
    ];

    // Initialize wave manager (10 waves total)
    waveManager = new WaveManager();

    // Create UI tower options (all assets drawn in code)
    // Archer Tower: fast firing, moderate damage.
    towerOptions.push(new TowerOption("Archer", 100, "archer"));
    // Mage Tower: slower, higher damage with magical projectiles.
    towerOptions.push(new TowerOption("Mage", 150, "mage"));
    // Cannon Tower: slow firing, high damage with splash effect.
    towerOptions.push(new TowerOption("Cannon", 200, "cannon"));
    // Barracks: deploys soldiers that attack and block enemies.
    towerOptions.push(new TowerOption("Barracks", 175, "barracks"));
}

// --- Main Game Loop ---
function draw() {
    // Draw background
    background(40, 100, 40); // Darker green for better contrast with path

    // Draw the grid if enabled
    if (showGrid) {
        drawGrid();
    }

    // Draw the fixed enemy path
    drawPath();

    // Update and draw towers
    for (let t of towers) {
        t.update();
        t.draw();
    }

    // Update and draw enemies (iterate backwards for safe removal)
    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].update();
        enemies[i].draw();
        // If enemy reaches the end, remove it and subtract a life
        if (enemies[i].reachedEnd) {
            enemies.splice(i, 1);
            lives--;
            if (lives <= 0) {
                gameState = "gameover";
            }
        }
        // Remove dead enemies and reward gold
        else if (enemies[i].health <= 0) {
            gold += enemies[i].goldReward;
            enemies.splice(i, 1);
        }
    }

    // Update and draw projectiles (iterate backwards for safe removal)
    for (let i = projectiles.length - 1; i >= 0; i--) {
        projectiles[i].update();
        projectiles[i].draw();
        if (projectiles[i].toRemove) {
            projectiles.splice(i, 1);
        }
    }

    // Update and draw particles (iterate backwards for safe removal)
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].finished()) {
            particles.splice(i, 1);
        }
    }

    // If in wave mode, update the wave manager to spawn enemies
    if (gameState === "wave") {
        waveManager.update();
    }

    // Draw UI elements
    drawUI();

    // Update and draw tooltip
    tooltip.update();
    tooltip.draw();

    // Check for UI hover events
    checkUIHover();

    // Check for game over
    if (gameState === "gameover") {
        fill(0, 0, 0, 150);
        rect(0, 0, width, height);
        fill(255, 0, 0);
        textAlign(CENTER, CENTER);
        textSize(40);
        text("GAME OVER", width / 2, height / 2);
        noLoop();
    }

    // If all waves are completed, show victory screen
    if (waveManager.currentWave > waveManager.totalWaves && enemies.length === 0) {
        fill(0, 0, 0, 150);
        rect(0, 0, width, height);
        fill(255, 215, 0);
        textAlign(CENTER, CENTER);
        textSize(40);
        text("VICTORY!", width / 2, height / 2);
        noLoop();
    }
}

// --- Draw the Enemy Path ---
function drawPath() {
    push();

    // Use a grid-based path approach
    fill(180, 170, 150); // Light stone color
    stroke(100, 90, 70);
    strokeWeight(1);
    rectMode(CORNER); // Ensure we're using CORNER mode for grid alignment

    // For each segment of the path, draw grid cells
    for (let i = 0; i < path.length - 1; i++) {
        let start = path[i];
        let end = path[i + 1];

        // Determine if this is a horizontal or vertical segment
        let isHorizontal = abs(end.y - start.y) < abs(end.x - start.x);

        if (isHorizontal) {
            // Horizontal segment
            let minX = min(start.x, end.x);
            let maxX = max(start.x, end.x);
            let y = start.y;

            // Calculate grid-aligned start and end points
            let startGridX = Math.floor((minX - gridCellSize / 2) / gridCellSize) * gridCellSize;
            let endGridX = Math.ceil((maxX + gridCellSize / 2) / gridCellSize) * gridCellSize;
            let gridY = Math.round(y / gridCellSize) * gridCellSize - gridCellSize / 2;

            // Draw grid cells along the path
            for (let x = startGridX; x < endGridX; x += gridCellSize) {
                rect(x, gridY, gridCellSize, gridCellSize);
            }
        } else {
            // Vertical segment
            let minY = min(start.y, end.y);
            let maxY = max(start.y, end.y);
            let x = start.x;

            // Calculate grid-aligned start and end points
            let startGridY = Math.floor((minY - gridCellSize / 2) / gridCellSize) * gridCellSize;
            let endGridY = Math.ceil((maxY + gridCellSize / 2) / gridCellSize) * gridCellSize;
            let gridX = Math.round(x / gridCellSize) * gridCellSize - gridCellSize / 2;

            // Draw grid cells along the path
            for (let y = startGridY; y < endGridY; y += gridCellSize) {
                rect(gridX, y, gridCellSize, gridCellSize);
            }
        }
    }

    pop();
}

// --- Mouse Interaction ---
function mousePressed() {
    // Check if clicking on any tower option UI box
    let clickedOnUI = false;

    // Check tower options
    for (let opt of towerOptions) {
        if (opt.contains(mouseX, mouseY)) {
            // If already selected, unselect it
            if (selectedTowerType === opt.type) {
                selectedTowerType = null;
            } else {
                selectedTowerType = opt.type;
                selectedTower = null; // Clear any tower upgrade selection
            }
            clickedOnUI = true;
            return;
        }
    }

    // Check if clicking on social share button
    let socialX = width - 50;
    let socialY = 20;
    if (mouseX > socialX - 25 && mouseX < socialX + 25 && mouseY > socialY - 15 && mouseY < socialY + 15) {
        shareToSocial();
        clickedOnUI = true;
        return;
    }

    // Check if clicking on the "Next Wave" button (now on the right side)
    if (mouseX > width - 120 && mouseX < width - 20 && mouseY > height - 50 && mouseY < height - 10 && waveManager.waveCompleted) {
        startWave();
        clickedOnUI = true;
        return;
    }

    // Check if clicking on game speed buttons
    if (mouseY > 10 && mouseY < 30) {
        let waveDisplay = new WaveDisplay();
        let speedX = waveDisplay.x + waveDisplay.width + 20;
        let buttonWidth = 30;
        let buttonSpacing = 5;

        // 1x speed button
        if (mouseX > speedX && mouseX < speedX + buttonWidth) {
            gameSpeed = 1;
            clickedOnUI = true;
            return;
        }

        // 2x speed button
        speedX += buttonWidth + buttonSpacing;
        if (mouseX > speedX && mouseX < speedX + buttonWidth) {
            gameSpeed = 2;
            clickedOnUI = true;
            return;
        }

        // 3x speed button
        speedX += buttonWidth + buttonSpacing;
        if (mouseX > speedX && mouseX < speedX + buttonWidth) {
            gameSpeed = 3;
            clickedOnUI = true;
            return;
        }
    }

    // Check if clicking on an existing tower to select it for upgrade
    // Calculate the grid cell center where the mouse is
    let gridX = Math.floor(mouseX / gridCellSize) * gridCellSize + gridCellSize / 2;
    let gridY = Math.floor(mouseY / gridCellSize) * gridCellSize + gridCellSize / 2;

    let clickedOnTower = false;
    for (let t of towers) {
        if (t.x === gridX && t.y === gridY) { // Exact grid match
            // If already selected, unselect it
            if (selectedTower === t) {
                selectedTower = null;
            } else {
                selectedTower = t;
                selectedTowerType = null;
            }
            clickedOnTower = true;
            clickedOnUI = true;
            return;
        }
    }

    // If a tower type is selected, attempt to place a new tower (allowed in both build and wave modes)
    if (selectedTowerType) {
        // Calculate the grid cell center where the mouse is
        let gridX = Math.floor(mouseX / gridCellSize) * gridCellSize + gridCellSize / 2;
        let gridY = Math.floor(mouseY / gridCellSize) * gridCellSize + gridCellSize / 2;

        // Disallow placement if on the enemy path
        if (isOnPath(gridX, gridY)) return;

        // Disallow placement if a tower already exists at this grid cell
        if (isTowerAt(gridX, gridY)) return;

        // Determine cost based on tower type
        let cost;
        switch (selectedTowerType) {
            case "archer": cost = 100; break;
            case "mage": cost = 150; break;
            case "cannon": cost = 200; break;
            case "barracks": cost = 175; break;
            default: cost = 100;
        }

        if (gold >= cost) {
            gold -= cost;
            towers.push(new Tower(gridX, gridY, selectedTowerType));
            clickedOnUI = true;
        }
    }

    // If a tower is already selected for upgrade, check if click is on its upgrade button.
    if (selectedTower) {
        // Upgrade button drawn at the top-right corner of the grid cell
        let buttonX = selectedTower.x + gridCellSize / 2;
        let buttonY = selectedTower.y - gridCellSize / 2;
        let buttonWidth = 40;
        let buttonHeight = 20;

        if (mouseX > buttonX && mouseX < buttonX + buttonWidth &&
            mouseY > buttonY && mouseY < buttonY + buttonHeight) {
            let upgradeCost = selectedTower.getUpgradeCost();
            if (gold >= upgradeCost) {
                gold -= upgradeCost;
                selectedTower.upgrade();
            }
            clickedOnUI = true;
            return;
        }
    }

    // If clicked elsewhere and not on UI, unselect everything
    if (!clickedOnUI) {
        selectedTower = null;
        selectedTowerType = null;
    }
}

// --- Helper: Check if a Point Is on the Path ---
function isOnPath(x, y) {
    // Get the grid cell that contains the point
    let gridX = Math.floor(x / gridCellSize) * gridCellSize;
    let gridY = Math.floor(y / gridCellSize) * gridCellSize;

    // For grid-based path, check if the point is within a grid cell of the path
    for (let i = 0; i < path.length - 1; i++) {
        let start = path[i];
        let end = path[i + 1];

        // Determine if this is a horizontal or vertical segment
        let isHorizontal = abs(end.y - start.y) < abs(end.x - start.x);

        if (isHorizontal) {
            // Horizontal segment
            let minX = min(start.x, end.x);
            let maxX = max(start.x, end.x);
            let pathY = start.y;

            // Calculate grid-aligned y position
            let gridPathY = Math.round(pathY / gridCellSize) * gridCellSize;

            // Check if point's grid cell is on this segment
            if (gridY === gridPathY - gridCellSize / 2 &&
                gridX >= Math.floor((minX - gridCellSize / 2) / gridCellSize) * gridCellSize &&
                gridX < Math.ceil((maxX + gridCellSize / 2) / gridCellSize) * gridCellSize) {
                return true;
            }
        } else {
            // Vertical segment
            let minY = min(start.y, end.y);
            let maxY = max(start.y, end.y);
            let pathX = start.x;

            // Calculate grid-aligned x position
            let gridPathX = Math.round(pathX / gridCellSize) * gridCellSize;

            // Check if point's grid cell is on this segment
            if (gridX === gridPathX - gridCellSize / 2 &&
                gridY >= Math.floor((minY - gridCellSize / 2) / gridCellSize) * gridCellSize &&
                gridY < Math.ceil((maxY + gridCellSize / 2) / gridCellSize) * gridCellSize) {
                return true;
            }
        }
    }

    return false;
}

// --- Helper: Distance from a Point to a Line Segment ---
function distToSegment(p, a, b) {
    let l2 = p5.Vector.sub(b, a).magSq();
    if (l2 === 0) return p5.Vector.dist(p, a);
    let t = max(0, min(1, p5.Vector.sub(p, a).dot(p5.Vector.sub(b, a)) / l2));
    let projection = p5.Vector.add(a, p5.Vector.sub(b, a).mult(t));
    return p5.Vector.dist(p, projection);
}

// --- Start the Next Wave ---
function startWave() {
    gameState = "wave";
    waveManager.startNextWave();
}

// Add keyPressed function here:

// --- Keyboard Interaction ---
function keyPressed() {
    // Toggle grid visibility with 'G' key
    if (key === 'g' || key === 'G') {
        showGrid = !showGrid;
    }
}

// --- Draw UI Elements ---
function drawUI() {
    // Draw top UI bar with resources
    fill(50, 50, 80, 200);
    noStroke();
    rect(0, 0, width, 40);

    // Gold display
    fill(255, 215, 0);
    ellipse(20, 20, 20, 20);
    fill(200, 150, 0);
    ellipse(20, 20, 14, 14);

    fill(255);
    textAlign(LEFT, CENTER);
    textSize(16);
    text(gold, 35, 20);

    // Lives display
    fill(255, 50, 50);
    beginShape();
    vertex(90, 20);
    vertex(100, 10);
    vertex(110, 20);
    vertex(100, 35);
    endShape(CLOSE);

    fill(255);
    textAlign(LEFT, CENTER);
    text(lives, 120, 20);

    // Draw wave display and game speed controls
    let waveDisplay = new WaveDisplay();
    waveDisplay.draw();

    // Draw tower options at the bottom
    let startX = 150; // Move tower menu to the right to avoid covering the path
    let startY = height - 110;
    let optionWidth = 100;
    let optionHeight = 100;
    let optionSpacing = 10;

    for (let i = 0; i < towerOptions.length; i++) {
        // Calculate position for each tower option
        let x = startX + i * (optionWidth + optionSpacing);
        let y = startY;

        // Set the position for the tower option
        towerOptions[i].x = x;
        towerOptions[i].y = y;
        towerOptions[i].w = optionWidth;
        towerOptions[i].h = optionHeight;

        // Check if this tower type is selected
        let isSelected = selectedTowerType === towerOptions[i].type;

        // Draw selection highlight if selected
        if (isSelected) {
            stroke(255, 215, 0);
            strokeWeight(3);
            noFill();
            rect(x - 5, y - 5, optionWidth + 10, optionHeight + 10, 5);
        }

        // Draw tower option
        fill(60, 60, 100);
        stroke(100, 100, 150);
        strokeWeight(1);
        rect(x, y, optionWidth, optionHeight, 5);

        // Draw tower icon
        if (towerOptions[i].type === "archer") {
            drawTowerIcon(x + optionWidth / 2, y + 40, "archer");
        } else if (towerOptions[i].type === "mage") {
            drawTowerIcon(x + optionWidth / 2, y + 40, "mage");
        } else if (towerOptions[i].type === "cannon") {
            drawTowerIcon(x + optionWidth / 2, y + 40, "cannon");
        } else if (towerOptions[i].type === "barracks") {
            drawTowerIcon(x + optionWidth / 2, y + 40, "barracks");
        }

        // Draw tower name
        fill(255);
        noStroke();
        textAlign(CENTER);
        textSize(14);
        text(towerOptions[i].name, x + optionWidth / 2, y + 15);

        // Draw tower cost
        fill(255, 215, 0);
        ellipse(x + 20, y + optionHeight - 15, 14, 14);
        fill(200, 150, 0);
        ellipse(x + 20, y + optionHeight - 15, 10, 10);

        fill(255);
        textAlign(LEFT, CENTER);
        textSize(14);
        text(towerOptions[i].cost, x + 30, y + optionHeight - 15);

        // Check if mouse is hovering
        if (mouseX > x && mouseX < x + optionWidth &&
            mouseY > y && mouseY < y + optionHeight) {
            // Draw hover effect
            noFill();
            stroke(255, 255, 255, 100);
            strokeWeight(2);
            rect(x, y, optionWidth, optionHeight, 5);
        }
    }

    // Draw "Next Wave" button when wave is completed
    if (waveManager.waveCompleted) {
        // Move the Next Wave button to the right side of the screen to avoid overlap with tower menu
        let buttonX = width - 120;
        let buttonY = height - 50;
        let buttonWidth = 100;
        let buttonHeight = 40;

        // Button glow effect when hovering
        if (mouseX > buttonX && mouseX < buttonX + buttonWidth &&
            mouseY > buttonY && mouseY < buttonY + buttonHeight) {
            // Glow effect
            noStroke();
            fill(100, 255, 100, 50 + sin(frameCount * 0.1) * 20);
            rect(buttonX - 5, buttonY - 5, buttonWidth + 10, buttonHeight + 10, 8);
        }

        // Button background
        fill(50, 150, 50);
        stroke(100, 255, 100);
        strokeWeight(2);
        rect(buttonX, buttonY, buttonWidth, buttonHeight, 5);

        // Button text
        fill(255);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(16);
        text("Next Wave", buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);
    }

    // Draw tower stats and upgrade button if a tower is selected
    if (selectedTower) {
        let infoX = width - 150;
        let infoY = height - 100;

        // Info panel background
        fill(50, 50, 80, 200);
        stroke(150, 150, 200);
        strokeWeight(1);
        rect(infoX, infoY, 140, 90, 5);

        // Tower type and level
        fill(255);
        noStroke();
        textAlign(LEFT);
        textSize(14);
        text(selectedTower.type.charAt(0).toUpperCase() + selectedTower.type.slice(1) + " (Lvl " + selectedTower.level + ")", infoX + 10, infoY + 20);

        // Tower stats
        textSize(12);
        text("Damage: " + selectedTower.damage, infoX + 10, infoY + 40);
        text("Range: " + selectedTower.range, infoX + 10, infoY + 55);
        text("Fire Rate: " + (60 / selectedTower.fireRate).toFixed(1) + "/s", infoX + 10, infoY + 70);

        // Upgrade button
        let upgradeCost = selectedTower.getUpgradeCost();
        let buttonX = selectedTower.x + gridCellSize / 2;
        let buttonY = selectedTower.y - gridCellSize / 2;
        let buttonWidth = 40;
        let buttonHeight = 20;

        // Button background
        if (gold >= upgradeCost) {
            fill(50, 150, 50);
            stroke(100, 255, 100);
        } else {
            fill(150, 50, 50);
            stroke(255, 100, 100);
        }
        strokeWeight(1);
        rect(buttonX, buttonY, buttonWidth, buttonHeight, 3);

        // Button text
        fill(255);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(10);
        text("+" + upgradeCost, buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);
    }

    // Draw tower placement preview if a tower type is selected
    if (selectedTowerType && !selectedTower) {
        // Calculate the grid cell center where the mouse is
        let gridX = Math.floor(mouseX / gridCellSize) * gridCellSize + gridCellSize / 2;
        let gridY = Math.floor(mouseY / gridCellSize) * gridCellSize + gridCellSize / 2;

        // Check if placement is valid
        let validPlacement = !isOnPath(gridX, gridY) && !isTowerAt(gridX, gridY);

        // Draw ghost preview
        push();
        translate(gridX, gridY);

        // Semi-transparent preview
        if (validPlacement) {
            // Valid placement
            fill(100, 255, 100, 100);
            stroke(100, 255, 100);
        } else {
            // Invalid placement
            fill(255, 100, 100, 100);
            stroke(255, 100, 100);
        }

        strokeWeight(1);
        ellipse(0, 0, gridCellSize * 0.8, gridCellSize * 0.8);

        // Draw range indicator
        noFill();
        stroke(255, 255, 255, 100);
        let range;
        switch (selectedTowerType) {
            case "archer": range = 100; break;
            case "mage": range = 120; break;
            case "cannon": range = 80; break;
            case "barracks": range = 60; break;
            default: range = 100;
        }
        ellipse(0, 0, range * 2, range * 2);
        pop();
    }

    // Draw social sharing button
    let socialX = width - 50;
    let socialY = 20;

    // Button background
    fill(59, 89, 152); // Facebook blue
    stroke(255);
    strokeWeight(1);
    rect(socialX - 25, socialY - 15, 50, 30, 5);

    // Share icon
    fill(255);
    noStroke();
    // Arrow
    triangle(socialX - 10, socialY - 5, socialX - 5, socialY - 10, socialX, socialY - 5);
    rect(socialX - 5, socialY - 5, 5, 10);
    // World icon
    ellipse(socialX + 5, socialY + 5, 15, 15);
    ellipse(socialX + 5, socialY + 5, 10, 10);
}

// Helper function to draw tower icons
function drawTowerIcon(x, y, type) {
    push();
    translate(x, y);

    if (type === "archer") {
        // Tower base
        fill(150, 75, 0);
        rectMode(CENTER);
        rect(0, 0, 16, 16);

        // Roof
        fill(80, 40, 0);
        triangle(-8, -8, 8, -8, 0, -16);

        // Archer
        fill(0);
        ellipse(0, -12, 6, 6);
    } else if (type === "mage") {
        // Tower base
        fill(100, 100, 180);
        rectMode(CENTER);
        rect(0, 0, 16, 16);

        // Roof
        fill(70, 70, 150);
        triangle(-8, -8, 8, -8, 0, -14);

        // Orb
        fill(255, 215, 0);
        ellipse(0, -18, 8, 8);
    } else if (type === "cannon") {
        // Tower base
        fill(100, 100, 100);
        ellipse(0, 0, 16, 16);

        // Cannon barrel
        fill(50, 50, 50);
        rect(5, 0, 10, 6);

        // Barrel end
        fill(40, 40, 40);
        rect(10, 0, 3, 8);
    } else if (type === "barracks") {
        // Tower base
        fill(150, 150, 150);
        rectMode(CENTER);
        rect(0, 0, 16, 16);

        // Roof
        fill(100, 60, 60);
        beginShape();
        vertex(-8, -8);
        vertex(8, -8);
        vertex(6, -12);
        vertex(-6, -12);
        endShape(CLOSE);

        // Flag
        fill(255, 0, 0);
        rect(0, -15, 1, 5);
        triangle(1, -15, 5, -14, 5, -12);
    }

    pop();
}

// --- TowerOption Class ---
class TowerOption {
    constructor(name, cost, type) {
        this.name = name;
        this.cost = cost;
        this.type = type;
        this.x = 0;
        this.y = 0;
        this.w = 100;
        this.h = 100;
        this.hoverAmount = 0;
    }

    contains(mx, my) {
        return (mx > this.x && mx < this.x + this.w &&
            my > this.y && my < this.y + this.h);
    }

    draw(x, y) {
        this.x = x;
        this.y = y;
        push();

        // Check if mouse is hovering
        let hovering = this.contains(mouseX, mouseY);

        // Smooth hover transition
        if (hovering && this.hoverAmount < 1) {
            this.hoverAmount += 0.1;
        } else if (!hovering && this.hoverAmount > 0) {
            this.hoverAmount -= 0.1;
        }

        // Selected state or hover effect
        if (selectedTowerType === this.type || this.hoverAmount > 0) {
            // Glow effect
            noStroke();
            let glowColor = selectedTowerType === this.type ?
                color(255, 215, 0, 100) : // Gold for selected
                color(255, 255, 255, 50 * this.hoverAmount); // White for hover

            fill(glowColor);
            rect(this.x - 5, this.y - 5, this.w + 10, this.h + 10, 8);
        }

        // Card background with gradient
        let topColor = color(80, 80, 120);
        let bottomColor = color(50, 50, 80);

        noStroke();
        for (let i = 0; i < this.h; i++) {
            let inter = map(i, 0, this.h, 0, 1);
            let c = lerpColor(topColor, bottomColor, inter);
            fill(c);
            rect(this.x, this.y + i, this.w, 1, 5);
        }

        // Border
        if (selectedTowerType === this.type) {
            stroke(255, 215, 0); // Gold border for selected
            strokeWeight(2);
        } else {
            stroke(150, 150, 200);
            strokeWeight(1);
        }
        noFill();
        rect(this.x, this.y, this.w, this.h, 5);

        // Tower icon
        if (this.type === "archer") {
            this.drawArcherIcon();
        } else if (this.type === "mage") {
            this.drawMageIcon();
        } else if (this.type === "cannon") {
            this.drawCannonIcon();
        } else if (this.type === "barracks") {
            this.drawBarracksIcon();
        }

        // Tower name
        fill(255);
        noStroke();
        textSize(14);
        textAlign(CENTER);
        text(this.name, this.x + this.w / 2, this.y + 15);

        // Cost with coin icon
        fill(255, 215, 0);
        ellipse(this.x + 20, this.y + this.h - 15, 14, 14);
        fill(200, 150, 0);
        ellipse(this.x + 20, this.y + this.h - 15, 10, 10);

        fill(255);
        textAlign(LEFT, CENTER);
        textSize(14);
        text(this.cost, this.x + 30, this.y + this.h - 15);

        pop();
    }

    drawArcherIcon() {
        // Draw a miniature archer tower
        push();
        translate(this.x + this.w / 2, this.y + 35);

        // Tower base
        fill(150, 75, 0);
        rectMode(CENTER);
        rect(0, 0, 16, 16);

        // Roof
        fill(80, 40, 0);
        triangle(-8, -8, 8, -8, 0, -16);

        // Archer
        fill(0);
        ellipse(0, -12, 6, 6);

        pop();
    }

    drawMageIcon() {
        // Draw a miniature mage tower
        push();
        translate(this.x + this.w / 2, this.y + 35);

        // Tower base
        fill(100, 100, 180);
        rectMode(CENTER);
        rect(0, 0, 16, 16);

        // Roof
        fill(70, 70, 150);
        triangle(-8, -8, 8, -8, 0, -14);

        // Orb with glow
        fill(255, 215, 0, 100);
        ellipse(0, -18, 12, 12);
        fill(255, 215, 0);
        ellipse(0, -18, 8, 8);

        pop();
    }

    drawCannonIcon() {
        // Draw a miniature cannon tower
        push();
        translate(this.x + this.w / 2, this.y + 35);

        // Tower base
        fill(100, 100, 100);
        ellipse(0, 0, 16, 16);

        // Cannon barrel
        fill(50, 50, 50);
        rect(5, 0, 10, 6);

        // Barrel end
        fill(40, 40, 40);
        rect(10, 0, 3, 8);

        pop();
    }

    drawBarracksIcon() {
        // Draw a miniature barracks tower
        push();
        translate(this.x + this.w / 2, this.y + 35);

        // Tower base
        fill(150, 150, 150);
        rectMode(CENTER);
        rect(0, 0, 16, 16);

        // Roof
        fill(100, 60, 60);
        beginShape();
        vertex(-8, -8);
        vertex(8, -8);
        vertex(6, -12);
        vertex(-6, -12);
        endShape(CLOSE);

        // Flag
        fill(255, 0, 0);
        rect(0, -15, 1, 5);
        triangle(1, -15, 5, -14, 5, -12);

        // Soldiers
        fill(0);
        ellipse(-4, 8, 4, 4); // Soldier 1
        ellipse(0, 8, 4, 4);  // Soldier 2
        ellipse(4, 8, 4, 4);  // Soldier 3

        pop();
    }
}

// --- Helper: Check if a Tower Exists at a Grid Position ---
function isTowerAt(x, y) {
    for (let t of towers) {
        if (t.x === x && t.y === y) {
            return true;
        }
    }
    return false;
}

// --- Draw Grid System ---
function drawGrid() {
    // Make grid lines darker and more visible
    stroke(80, 80, 80, 120);
    strokeWeight(1);

    // Draw vertical grid lines
    for (let x = 0; x <= width; x += gridCellSize) {
        line(x, 0, x, height);
    }

    // Draw horizontal grid lines
    for (let y = 0; y <= height; y += gridCellSize) {
        line(0, y, width, y);
    }
}

// --- WaveManager Class ---
class WaveManager {
    constructor() {
        this.totalWaves = 10;
        this.currentWave = 0;
        this.waveProgress = 0;
        this.waveCompleted = true; // Start with wave completed so player can start first wave

        // Enemy spawning properties
        this.enemySpawnTimer = 0;
        this.enemySpawnRate = 90; // Frames between enemy spawns
        this.enemiesPerWave = 0;
        this.enemiesSpawned = 0;

        // Enemy types available based on wave number
        this.enemyTypes = ["normal"];
    }

    startNextWave() {
        this.currentWave++;
        this.waveProgress = 0;
        this.waveCompleted = false;

        // Calculate number of enemies for this wave
        this.enemiesPerWave = 5 + Math.floor(this.currentWave * 1.5);
        this.enemiesSpawned = 0;

        // Unlock new enemy types based on wave number
        if (this.currentWave >= 3 && !this.enemyTypes.includes("fast")) {
            this.enemyTypes.push("fast");
        }
        if (this.currentWave >= 5 && !this.enemyTypes.includes("tank")) {
            this.enemyTypes.push("tank");
        }
        if (this.currentWave >= 8 && !this.enemyTypes.includes("boss")) {
            this.enemyTypes.push("boss");
        }

        // Adjust spawn rate for later waves (faster spawning)
        this.enemySpawnRate = Math.max(30, 90 - this.currentWave * 5);
    }

    update() {
        // If all enemies for this wave have been spawned and none remain, mark wave as completed
        if (this.enemiesSpawned >= this.enemiesPerWave && enemies.length === 0) {
            if (!this.waveCompleted) {
                // Award bonus gold for completing a wave
                gold += 50 + this.currentWave * 10;
                this.waveCompleted = true;
            }
        }

        // If we still have enemies to spawn for this wave
        if (this.enemiesSpawned < this.enemiesPerWave) {
            this.enemySpawnTimer += gameSpeed;

            if (this.enemySpawnTimer >= this.enemySpawnRate) {
                this.enemySpawnTimer = 0;

                // Determine enemy type based on wave number and randomness
                let enemyType = "normal";

                // Last enemy of the last wave is always a boss
                if (this.currentWave === this.totalWaves && this.enemiesSpawned === this.enemiesPerWave - 1) {
                    enemyType = "boss";
                } else {
                    // Random selection weighted by wave number
                    let rand = random();

                    if (this.enemyTypes.includes("boss") && rand < 0.1) {
                        enemyType = "boss";
                    } else if (this.enemyTypes.includes("tank") && rand < 0.3) {
                        enemyType = "tank";
                    } else if (this.enemyTypes.includes("fast") && rand < 0.5) {
                        enemyType = "fast";
                    }
                }

                // Spawn the enemy at the start of the path
                enemies.push(new Enemy(path[0].x, path[0].y, enemyType, this.currentWave));
                this.enemiesSpawned++;
            }
        }

        // Update wave progress
        if (this.enemiesPerWave > 0) {
            this.waveProgress = (this.enemiesSpawned / this.enemiesPerWave) * 0.5 +
                (this.enemiesSpawned > 0 && enemies.length === 0 ? 0.5 :
                    (1 - (enemies.length / this.enemiesSpawned)) * 0.5);
        }
    }
}

// --- WaveDisplay Class ---
class WaveDisplay {
    constructor() {
        this.x = width - 200;
        this.y = 10;
        this.width = 140;
        this.height = 20;
    }

    draw() {
        push();

        // Draw wave text
        fill(255);
        textAlign(RIGHT, CENTER);
        textSize(14);
        text("Wave: " + waveManager.currentWave + "/" + waveManager.totalWaves, this.x - 10, this.y + this.height / 2);

        // Draw progress bar background
        fill(50, 50, 50);
        stroke(100, 100, 100);
        strokeWeight(1);
        rect(this.x, this.y, this.width, this.height, 5);

        // Draw progress bar fill
        if (waveManager.waveCompleted) {
            fill(100, 255, 100); // Green for completed
        } else {
            fill(255, 100, 100); // Red for in progress
        }
        noStroke();
        let progressWidth = this.width * waveManager.waveProgress;
        rect(this.x, this.y, progressWidth, this.height, 5, 0, 0, 5);

        // Draw game speed controls with better spacing and labels
        let speedX = this.x + this.width + 20; // Increased spacing
        let speedY = this.y;
        let buttonWidth = 30;
        let buttonHeight = this.height;
        let buttonSpacing = 5;

        // Speed control label
        fill(255);
        textAlign(RIGHT, CENTER);
        textSize(12);
        text("Speed:", speedX - 5, speedY + buttonHeight / 2);

        // 1x speed button
        fill(gameSpeed === 1 ? 100 : 50, gameSpeed === 1 ? 255 : 100, gameSpeed === 1 ? 100 : 50);
        stroke(100, 100, 100);
        strokeWeight(1);
        rect(speedX, speedY, buttonWidth, buttonHeight, 5);

        fill(255);
        textAlign(CENTER, CENTER);
        textSize(12);
        text("1x", speedX + buttonWidth / 2, speedY + buttonHeight / 2);

        // 2x speed button
        speedX += buttonWidth + buttonSpacing;
        fill(gameSpeed === 2 ? 100 : 50, gameSpeed === 2 ? 255 : 100, gameSpeed === 2 ? 100 : 50);
        stroke(100, 100, 100);
        strokeWeight(1);
        rect(speedX, speedY, buttonWidth, buttonHeight, 5);

        fill(255);
        textAlign(CENTER, CENTER);
        textSize(12);
        text("2x", speedX + buttonWidth / 2, speedY + buttonHeight / 2);

        // 3x speed button
        speedX += buttonWidth + buttonSpacing;
        fill(gameSpeed === 3 ? 100 : 50, gameSpeed === 3 ? 255 : 100, gameSpeed === 3 ? 100 : 50);
        stroke(100, 100, 100);
        strokeWeight(1);
        rect(speedX, speedY, buttonWidth, buttonHeight, 5);

        fill(255);
        textAlign(CENTER, CENTER);
        textSize(12);
        text("3x", speedX + buttonWidth / 2, speedY + buttonHeight / 2);

        pop();
    }
}

// --- Share to Social Media ---
function shareToSocial() {
    // Create a share confirmation animation
    let shareConfirmation = new ShareConfirmation();
    particles.push(shareConfirmation);

    console.log("Shared game progress: Wave " + waveManager.currentWave +
        " with " + towers.length + " towers and " + gold + " gold!");
}

// --- ShareConfirmation Class ---
class ShareConfirmation {
    constructor() {
        this.x = width - 50;
        this.y = 20;
        this.lifespan = 60;
        this.particles = [];

        // Create particles that fly outward
        for (let i = 0; i < 20; i++) {
            let angle = random(TWO_PI);
            let speed = random(1, 3);
            let vx = cos(angle) * speed;
            let vy = sin(angle) * speed;
            let size = random(3, 6);
            let color = [59, 89, 152]; // Facebook blue

            this.particles.push({
                x: this.x,
                y: this.y,
                vx: vx,
                vy: vy,
                size: size,
                color: color,
                alpha: 255
            });
        }
    }

    update() {
        this.lifespan--;

        for (let p of this.particles) {
            p.x += p.vx;
            p.y += p.vy;
            p.size *= 0.95;
            p.alpha = map(this.lifespan, 60, 0, 255, 0);
        }
    }

    draw() {
        push();
        for (let p of this.particles) {
            noStroke();
            fill(p.color[0], p.color[1], p.color[2], p.alpha);
            ellipse(p.x, p.y, p.size, p.size);
        }

        // Draw checkmark if still visible
        if (this.lifespan > 30) {
            stroke(255);
            strokeWeight(3);
            noFill();
            let alpha = map(this.lifespan, 60, 30, 255, 0);
            stroke(255, 255, 255, alpha);

            // Checkmark
            beginShape();
            vertex(this.x - 10, this.y);
            vertex(this.x - 5, this.y + 5);
            vertex(this.x + 10, this.y - 10);
            endShape();
        }
        pop();
    }

    finished() {
        return this.lifespan <= 0;
    }
}

// --- Enemy Class ---
class Enemy {
    constructor(x, y, type, wave) {
        this.x = x;
        this.y = y;
        this.type = type || "normal";
        this.wave = wave || 1;

        // Set properties based on enemy type
        switch (this.type) {
            case "fast":
                this.maxHealth = 30 + wave * 5;
                this.speed = 2 + wave * 0.1;
                this.reward = 15 + wave * 2;
                this.size = 15;
                this.color = [0, 200, 255]; // Cyan
                break;
            case "tank":
                this.maxHealth = 150 + wave * 20;
                this.speed = 0.5 + wave * 0.05;
                this.reward = 30 + wave * 3;
                this.size = 25;
                this.color = [100, 100, 100]; // Gray
                break;
            case "boss":
                this.maxHealth = 500 + wave * 50;
                this.speed = 0.7 + wave * 0.03;
                this.reward = 100 + wave * 10;
                this.size = 35;
                this.color = [200, 0, 200]; // Purple
                break;
            default: // normal
                this.maxHealth = 50 + wave * 10;
                this.speed = 1 + wave * 0.05;
                this.reward = 10 + wave * 1;
                this.size = 20;
                this.color = [255, 0, 0]; // Red
        }

        this.health = this.maxHealth;
        this.currentWaypoint = 1; // Start moving toward the second waypoint
        this.reachedEnd = false;
        this.dead = false;

        // Animation properties
        this.animationOffset = random(TWO_PI); // For bobbing/floating effect
        this.hitEffectTimer = 0;
    }

    update() {
        // Skip update if dead
        if (this.dead) return;

        // Move toward current waypoint
        let target = path[this.currentWaypoint];
        let dx = target.x - this.x;
        let dy = target.y - this.y;
        let distance = sqrt(dx * dx + dy * dy);

        // If reached waypoint, move to next one
        if (distance < this.speed * gameSpeed) {
            this.x = target.x;
            this.y = target.y;
            this.currentWaypoint++;

            // If reached the end of the path
            if (this.currentWaypoint >= path.length) {
                this.reachedEnd = true;
                return;
            }
        } else {
            // Move toward waypoint
            this.x += (dx / distance) * this.speed * gameSpeed;
            this.y += (dy / distance) * this.speed * gameSpeed;
        }

        // Update hit effect timer
        if (this.hitEffectTimer > 0) {
            this.hitEffectTimer -= gameSpeed;
        }
    }

    draw() {
        push();
        translate(this.x, this.y);

        // Bobbing animation
        let bobAmount = sin(frameCount * 0.1 + this.animationOffset) * 2;
        translate(0, bobAmount);

        // Hit effect (flash white when hit)
        if (this.hitEffectTimer > 0) {
            fill(255, 255, 255, map(this.hitEffectTimer, 10, 0, 200, 0));
            noStroke();
            ellipse(0, 0, this.size + 10, this.size + 10);
        }

        // Draw different enemy types
        switch (this.type) {
            case "fast":
                this.drawFastEnemy();
                break;
            case "tank":
                this.drawTankEnemy();
                break;
            case "boss":
                this.drawBossEnemy();
                break;
            default:
                this.drawNormalEnemy();
        }

        // Health bar
        let healthPercent = this.health / this.maxHealth;
        let barWidth = this.size * 1.2;
        let barHeight = 4;

        // Health bar background
        fill(100, 100, 100);
        noStroke();
        rect(-barWidth / 2, -this.size - 10, barWidth, barHeight, 2);

        // Health bar fill
        if (healthPercent > 0.6) fill(0, 255, 0);
        else if (healthPercent > 0.3) fill(255, 255, 0);
        else fill(255, 0, 0);

        rect(-barWidth / 2, -this.size - 10, barWidth * healthPercent, barHeight, 2);

        pop();
    }

    drawNormalEnemy() {
        // Body
        fill(this.color[0], this.color[1], this.color[2]);
        stroke(0);
        strokeWeight(1);
        ellipse(0, 0, this.size, this.size);

        // Eyes
        fill(255);
        noStroke();
        ellipse(-this.size / 5, -this.size / 5, this.size / 3, this.size / 3);
        ellipse(this.size / 5, -this.size / 5, this.size / 3, this.size / 3);

        // Pupils
        fill(0);
        ellipse(-this.size / 5, -this.size / 5, this.size / 6, this.size / 6);
        ellipse(this.size / 5, -this.size / 5, this.size / 6, this.size / 6);

        // Mouth
        noFill();
        stroke(0);
        strokeWeight(1);
        arc(0, this.size / 5, this.size / 2, this.size / 4, 0, PI);
    }

    drawFastEnemy() {
        // Streamlined body
        fill(this.color[0], this.color[1], this.color[2]);
        stroke(0);
        strokeWeight(1);

        // Teardrop shape
        beginShape();
        for (let i = 0; i < TWO_PI; i += 0.1) {
            let r = this.size / 2;
            if (i > PI / 2 && i < PI * 3 / 2) {
                r = this.size / 2 * (1 + 0.5 * sin(i));
            }
            let x = cos(i) * r;
            let y = sin(i) * r;
            vertex(x, y);
        }
        endShape(CLOSE);

        // Eyes
        fill(255);
        noStroke();
        ellipse(-this.size / 6, -this.size / 6, this.size / 4, this.size / 4);

        // Pupils
        fill(0);
        ellipse(-this.size / 6, -this.size / 6, this.size / 8, this.size / 8);

        // Speed lines
        stroke(200, 200, 255, 150);
        strokeWeight(1);
        line(-this.size, 0, -this.size / 2, 0);
        line(-this.size * 0.9, this.size / 4, -this.size / 2, this.size / 8);
        line(-this.size * 0.9, -this.size / 4, -this.size / 2, -this.size / 8);
    }

    drawTankEnemy() {
        // Heavy armored body
        fill(this.color[0], this.color[1], this.color[2]);
        stroke(0);
        strokeWeight(2);
        ellipse(0, 0, this.size, this.size);

        // Armor plates
        fill(this.color[0] - 30, this.color[1] - 30, this.color[2] - 30);
        arc(0, 0, this.size, this.size, PI / 4, PI * 3 / 4, CHORD);
        arc(0, 0, this.size, this.size, PI * 5 / 4, PI * 7 / 4, CHORD);

        // Rivets
        fill(50);
        noStroke();
        let rivetSize = this.size / 10;
        for (let i = 0; i < 6; i++) {
            let angle = i * PI / 3;
            let x = cos(angle) * this.size / 2 * 0.7;
            let y = sin(angle) * this.size / 2 * 0.7;
            ellipse(x, y, rivetSize, rivetSize);
        }

        // Eye slit
        fill(255, 0, 0);
        rect(-this.size / 4, -this.size / 6, this.size / 2, this.size / 10, 2);
    }

    drawBossEnemy() {
        // Main body
        fill(this.color[0], this.color[1], this.color[2]);
        stroke(0);
        strokeWeight(2);
        ellipse(0, 0, this.size, this.size);

        // Crown/spikes
        fill(255, 215, 0);
        stroke(0);
        strokeWeight(1);
        for (let i = 0; i < 5; i++) {
            let angle = map(i, 0, 5, -PI / 3, PI / 3) - PI / 2;
            let x1 = cos(angle) * this.size / 2;
            let y1 = sin(angle) * this.size / 2;
            let x2 = cos(angle) * this.size;
            let y2 = sin(angle) * this.size;
            let x3 = cos(angle + PI / 10) * this.size / 2;
            let y3 = sin(angle + PI / 10) * this.size / 2;

            triangle(x1, y1, x2, y2, x3, y3);
        }

        // Eyes
        fill(255, 0, 0);
        noStroke();
        ellipse(-this.size / 4, -this.size / 6, this.size / 5, this.size / 5);
        ellipse(this.size / 4, -this.size / 6, this.size / 5, this.size / 5);

        // Mouth
        fill(0);
        arc(0, this.size / 4, this.size / 2, this.size / 4, 0, PI);

        // Teeth
        fill(255);
        for (let i = 0; i < 4; i++) {
            let x = map(i, 0, 3, -this.size / 5, this.size / 5);
            triangle(x, this.size / 4, x + this.size / 20, this.size / 4, x + this.size / 40, this.size / 3);
        }

        // Aura effect
        noFill();
        stroke(this.color[0], this.color[1], this.color[2], 100);
        strokeWeight(1);
        for (let i = 1; i <= 3; i++) {
            let pulseSize = this.size + i * 5 + sin(frameCount * 0.1) * 2;
            ellipse(0, 0, pulseSize, pulseSize);
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        this.hitEffectTimer = 10;

        // Create hit particles
        for (let i = 0; i < 5; i++) {
            let angle = random(TWO_PI);
            let speed = random(1, 3);
            let p = new Particle(
                this.x,
                this.y,
                cos(angle) * speed,
                sin(angle) * speed,
                particleColors.hit,
                random(3, 6),
                20
            );
            particles.push(p);
        }

        // Check if dead
        if (this.health <= 0) {
            this.dead = true;

            // Create death explosion particles
            for (let i = 0; i < 20; i++) {
                let angle = random(TWO_PI);
                let speed = random(1, 4);
                let p = new Particle(
                    this.x,
                    this.y,
                    cos(angle) * speed,
                    sin(angle) * speed,
                    this.color,
                    random(5, 10),
                    40
                );
                particles.push(p);
            }
        }
    }
}

// --- Particle Class ---
class Particle {
    constructor(x, y, vx, vy, color, size, lifespan) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.size = size;
        this.initialSize = size;
        this.lifespan = lifespan || 30;
        this.initialLifespan = this.lifespan;
    }

    update() {
        // Update position
        this.x += this.vx * gameSpeed;
        this.y += this.vy * gameSpeed;

        // Simulate gravity
        this.vy += 0.05 * gameSpeed;

        // Air resistance
        this.vx *= 0.95;
        this.vy *= 0.95;

        // Fade out
        this.lifespan -= gameSpeed;
        this.size = this.initialSize * (this.lifespan / this.initialLifespan);
    }

    draw() {
        push();
        noStroke();

        // Set color with alpha based on remaining lifespan
        let alpha = map(this.lifespan, 0, this.initialLifespan, 0, 255);
        fill(this.color[0], this.color[1], this.color[2], alpha);

        ellipse(this.x, this.y, this.size, this.size);
        pop();
    }

    finished() {
        return this.lifespan <= 0;
    }
}

// --- Soldier Class (extends Projectile) ---
class Soldier {
    constructor(x, y, targetEnemy) {
        this.x = x;
        this.y = y;
        this.targetEnemy = targetEnemy;
        this.speed = 1;
        this.damage = 10;
        this.lifespan = 600; // 10 seconds at 60fps
        this.finished = false;
        this.attackRange = 20;
        this.attackCooldown = 0;
        this.attackRate = 60; // Attack once per second
    }

    update() {
        // Decrease lifespan
        this.lifespan -= gameSpeed;
        if (this.lifespan <= 0) {
            this.finished = true;
            return;
        }

        // Decrease attack cooldown
        if (this.attackCooldown > 0) {
            this.attackCooldown -= gameSpeed;
        }

        // If target is dead or doesn't exist, find a new one
        if (!this.targetEnemy || this.targetEnemy.dead || this.targetEnemy.reachedEnd) {
            // Find the closest enemy
            let closestDist = Infinity;
            let closestEnemy = null;

            for (let enemy of enemies) {
                if (!enemy.dead && !enemy.reachedEnd) {
                    let d = dist(this.x, this.y, enemy.x, enemy.y);
                    if (d < closestDist) {
                        closestDist = d;
                        closestEnemy = enemy;
                    }
                }
            }

            this.targetEnemy = closestEnemy;
        }

        // If we have a target, move toward it
        if (this.targetEnemy) {
            let dx = this.targetEnemy.x - this.x;
            let dy = this.targetEnemy.y - this.y;
            let distance = sqrt(dx * dx + dy * dy);

            // If in attack range, stop and attack
            if (distance <= this.attackRange) {
                // Attack if cooldown is ready
                if (this.attackCooldown <= 0) {
                    this.targetEnemy.takeDamage(this.damage);
                    this.attackCooldown = this.attackRate;
                }
            } else {
                // Move toward target
                this.x += (dx / distance) * this.speed * gameSpeed;
                this.y += (dy / distance) * this.speed * gameSpeed;
            }
        } else {
            // No target, wander randomly
            this.x += random(-1, 1) * this.speed * 0.2 * gameSpeed;
            this.y += random(-1, 1) * this.speed * 0.2 * gameSpeed;
        }
    }

    draw() {
        push();
        translate(this.x, this.y);

        // Determine angle based on movement or target
        let angle = 0;
        if (this.targetEnemy) {
            angle = atan2(this.targetEnemy.y - this.y, this.targetEnemy.x - this.x);
        }
        rotate(angle);

        // Body
        fill(0, 0, 150);
        stroke(0);
        strokeWeight(1);
        ellipse(0, 0, 12, 12);

        // Sword
        stroke(200);
        strokeWeight(2);
        line(6, 0, 15, 0);

        // Shield
        fill(150, 0, 0);
        stroke(200);
        strokeWeight(1);
        arc(-2, 0, 10, 15, -PI / 2, PI / 2);

        // Attack animation
        if (this.attackCooldown > this.attackRate - 10) {
            // Sword slash effect
            noFill();
            stroke(255, 255, 255, map(this.attackCooldown, this.attackRate, this.attackRate - 10, 255, 0));
            strokeWeight(2);
            arc(6, 0, 20, 20, -PI / 4, PI / 4);
        }

        pop();
    }
}

// --- Tower Class ---
class Tower {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.level = 1;
        this.target = null;
        this.fireTimer = 0;
        this.angle = 0;
        this.size = gridCellSize * 0.8;

        // Set properties based on tower type
        this.setPropertiesByType();
    }

    setPropertiesByType() {
        switch (this.type) {
            case "archer":
                this.damage = 20 + (this.level - 1) * 10;
                this.range = 100 + (this.level - 1) * 15;
                this.fireRate = 30 - (this.level - 1) * 3; // Frames between shots
                this.projectileSpeed = 5 + (this.level - 1) * 0.5;
                this.projectileSize = 5 + (this.level - 1);
                this.color = [150, 75, 0]; // Brown
                break;
            case "mage":
                this.damage = 40 + (this.level - 1) * 20;
                this.range = 120 + (this.level - 1) * 15;
                this.fireRate = 60 - (this.level - 1) * 5;
                this.projectileSpeed = 4 + (this.level - 1) * 0.3;
                this.projectileSize = 8 + (this.level - 1) * 1.5;
                this.color = [100, 100, 180]; // Blue
                break;
            case "cannon":
                this.damage = 60 + (this.level - 1) * 30;
                this.range = 80 + (this.level - 1) * 10;
                this.fireRate = 90 - (this.level - 1) * 7;
                this.projectileSpeed = 3 + (this.level - 1) * 0.2;
                this.projectileSize = 10 + (this.level - 1) * 2;
                this.color = [100, 100, 100]; // Gray
                this.splashRadius = 30 + (this.level - 1) * 5;
                break;
            case "barracks":
                this.damage = 0; // Barracks don't deal direct damage
                this.range = 60 + (this.level - 1) * 10;
                this.fireRate = 180 - (this.level - 1) * 15;
                this.soldierCount = 1 + Math.floor((this.level - 1) / 2); // Extra soldier every 2 levels
                this.color = [150, 150, 150]; // Light gray
                break;
        }
    }

    update() {
        // Decrease fire timer
        if (this.fireTimer > 0) {
            this.fireTimer -= gameSpeed;
        }

        // Find a target if we don't have one or if current target is dead/gone
        if (!this.target || this.target.dead || this.target.reachedEnd) {
            this.findTarget();
        }

        // If we have a target, check if it's still in range
        if (this.target) {
            let distance = dist(this.x, this.y, this.target.x, this.target.y);
            if (distance > this.range) {
                this.target = null;
                this.findTarget();
            } else {
                // Update angle to face target
                this.angle = atan2(this.target.y - this.y, this.target.x - this.x);

                // Fire if ready
                if (this.fireTimer <= 0) {
                    this.fire();
                }
            }
        }
    }

    findTarget() {
        let closestDist = Infinity;
        let closestEnemy = null;

        for (let enemy of enemies) {
            if (!enemy.dead && !enemy.reachedEnd) {
                let distance = dist(this.x, this.y, enemy.x, enemy.y);
                if (distance < this.range && distance < closestDist) {
                    // For barracks, prioritize enemies that are further along the path
                    if (this.type === "barracks") {
                        if (!closestEnemy || enemy.currentWaypoint > closestEnemy.currentWaypoint) {
                            closestDist = distance;
                            closestEnemy = enemy;
                        }
                    } else {
                        closestDist = distance;
                        closestEnemy = enemy;
                    }
                }
            }
        }

        this.target = closestEnemy;
    }

    fire() {
        if (this.type === "barracks") {
            // Spawn soldiers
            for (let i = 0; i < this.soldierCount; i++) {
                let soldier = new Soldier(this.x, this.y, this.target);
                projectiles.push(soldier);
            }
        } else {
            // Create a projectile
            let projectile = new Projectile(
                this.x,
                this.y,
                this.target,
                this.damage,
                this.projectileSpeed,
                this.projectileSize,
                this.type,
                this.type === "cannon" ? this.splashRadius : 0
            );
            projectiles.push(projectile);
        }

        // Reset fire timer
        this.fireTimer = this.fireRate;
    }

    draw() {
        push();
        translate(this.x, this.y);

        // Draw base
        fill(80, 80, 80);
        stroke(50, 50, 50);
        strokeWeight(1);
        ellipse(0, 0, this.size * 0.8, this.size * 0.8);

        // Draw tower based on type
        if (this.type === "archer") {
            this.drawArcherTower();
        } else if (this.type === "mage") {
            this.drawMageTower();
        } else if (this.type === "cannon") {
            this.drawCannonTower();
        } else if (this.type === "barracks") {
            this.drawBarracksTower();
        }

        // Draw range indicator if this tower is selected
        if (selectedTower === this) {
            noFill();
            stroke(255, 255, 255, 100);
            strokeWeight(1);
            ellipse(0, 0, this.range * 2, this.range * 2);
        }

        // Draw level indicator
        fill(255);
        noStroke();
        textSize(10);
        textAlign(CENTER, CENTER);
        text(this.level, 0, this.size * 0.5);

        pop();
    }

    drawArcherTower() {
        push();
        rotate(this.angle);

        // Tower body
        fill(this.color[0], this.color[1], this.color[2]);
        stroke(0);
        strokeWeight(1);
        rectMode(CENTER);
        rect(0, 0, this.size, this.size);

        // Roof
        fill(this.color[0] - 30, this.color[1] - 30, this.color[2] - 30);
        triangle(-this.size / 2, -this.size / 2, this.size / 2, -this.size / 2, 0, -this.size);

        // Archer
        fill(0);
        ellipse(this.size / 4, 0, this.size / 3, this.size / 3);

        // Bow
        stroke(150, 75, 0);
        strokeWeight(2);
        noFill();
        arc(this.size / 4 + this.size / 6, 0, this.size / 2, this.size / 3, -PI / 2, PI / 2);

        // Arrow
        if (this.target && this.fireTimer < this.fireRate / 3) {
            stroke(100);
            strokeWeight(1);
            line(this.size / 4 + this.size / 6, 0, this.size, 0);
            // Arrowhead
            fill(100);
            noStroke();
            triangle(this.size, 0, this.size - 5, -3, this.size - 5, 3);
        }

        pop();
    }

    drawMageTower() {
        push();
        rotate(this.angle);

        // Tower body
        fill(this.color[0], this.color[1], this.color[2]);
        stroke(0);
        strokeWeight(1);
        rectMode(CENTER);
        rect(0, 0, this.size, this.size);

        // Roof
        fill(this.color[0] - 30, this.color[1] - 30, this.color[2] - 30);
        triangle(-this.size / 2, -this.size / 2, this.size / 2, -this.size / 2, 0, -this.size);

        // Mage
        fill(50, 50, 100);
        ellipse(0, -this.size / 4, this.size / 3, this.size / 3);

        // Staff
        stroke(150, 75, 0);
        strokeWeight(2);
        line(0, -this.size / 4, this.size / 2, -this.size / 4);

        // Orb
        fill(255, 215, 0, 150 + sin(frameCount * 0.1) * 50);
        noStroke();
        ellipse(this.size / 2, -this.size / 4, this.size / 4, this.size / 4);

        // Magic sparkles
        if (this.target) {
            for (let i = 0; i < 3; i++) {
                let angle = frameCount * 0.1 + i * TWO_PI / 3;
                let x = this.size / 2 + cos(angle) * this.size / 6;
                let y = -this.size / 4 + sin(angle) * this.size / 6;
                fill(255, 255, 255, 150);
                ellipse(x, y, 3, 3);
            }
        }

        pop();
    }

    drawCannonTower() {
        push();
        rotate(this.angle);

        // Tower body
        fill(this.color[0], this.color[1], this.color[2]);
        stroke(0);
        strokeWeight(1);
        ellipse(0, 0, this.size, this.size);

        // Cannon barrel
        fill(50, 50, 50);
        rectMode(CENTER);
        rect(this.size / 4, 0, this.size / 2, this.size / 4);

        // Barrel end
        fill(30, 30, 30);
        rect(this.size / 2, 0, this.size / 10, this.size / 3);

        // Firing effect
        if (this.target && this.fireTimer < 5) {
            fill(255, 150, 0, 200);
            ellipse(this.size / 2 + this.size / 8, 0, this.size / 4, this.size / 4);
            fill(255, 255, 0, 150);
            ellipse(this.size / 2 + this.size / 8, 0, this.size / 6, this.size / 6);
        }

        pop();
    }

    drawBarracksTower() {
        // Tower body
        fill(this.color[0], this.color[1], this.color[2]);
        stroke(0);
        strokeWeight(1);
        rectMode(CENTER);
        rect(0, 0, this.size, this.size);

        // Roof
        fill(100, 60, 60);
        beginShape();
        vertex(-this.size / 2, -this.size / 2);
        vertex(this.size / 2, -this.size / 2);
        vertex(this.size / 3, -this.size * 0.8);
        vertex(-this.size / 3, -this.size * 0.8);
        endShape(CLOSE);

        // Flag
        fill(255, 0, 0);
        rect(0, -this.size * 0.9, 2, this.size / 4);
        triangle(2, -this.size * 0.9, 2 + this.size / 4, -this.size * 0.9 + this.size / 8, 2, -this.size * 0.9 + this.size / 4);

        // Door
        fill(80, 40, 0);
        rect(0, this.size / 4, this.size / 3, this.size / 2);

        // Soldiers (show more based on level)
        fill(0);
        for (let i = 0; i < min(this.soldierCount, 3); i++) {
            let x = map(i, 0, 2, -this.size / 4, this.size / 4);
            ellipse(x, -this.size / 4, this.size / 6, this.size / 6);
        }
    }

    upgrade() {
        if (this.level < 3) { // Max level is 3
            this.level++;
            this.setPropertiesByType();
        }
    }

    getUpgradeCost() {
        // Base cost is the original tower cost
        let baseCost;
        switch (this.type) {
            case "archer": baseCost = 100; break;
            case "mage": baseCost = 150; break;
            case "cannon": baseCost = 200; break;
            case "barracks": baseCost = 175; break;
            default: baseCost = 100;
        }

        // Upgrade cost increases with level
        return baseCost * this.level;
    }
}

// --- Projectile Class ---
class Projectile {
    constructor(x, y, target, damage, speed, size, type, splashRadius) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.damage = damage;
        this.speed = speed;
        this.size = size;
        this.type = type;
        this.splashRadius = splashRadius || 0;
        this.finished = false;

        // Trail effect
        this.trail = [];
        this.maxTrailLength = 5;

        // Animation properties
        this.angle = 0;
        if (target) {
            this.angle = atan2(target.y - y, target.x - x);
        }
    }

    update() {
        // Skip if no target or already finished
        if (!this.target || this.finished) return;

        // Add current position to trail
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }

        // Move toward target
        let dx = this.target.x - this.x;
        let dy = this.target.y - this.y;
        let distance = sqrt(dx * dx + dy * dy);

        // If reached target or target is dead
        if (distance < this.speed * gameSpeed || this.target.dead || this.target.reachedEnd) {
            this.hit();
            return;
        }

        // Update position
        this.x += (dx / distance) * this.speed * gameSpeed;
        this.y += (dy / distance) * this.speed * gameSpeed;

        // Update angle
        this.angle = atan2(dy, dx);
    }

    hit() {
        // Skip if already finished
        if (this.finished) return;

        // Deal damage to target
        if (!this.target.dead && !this.target.reachedEnd) {
            if (this.splashRadius > 0) {
                // Splash damage to all enemies in radius
                for (let enemy of enemies) {
                    if (!enemy.dead && !enemy.reachedEnd) {
                        let distance = dist(this.target.x, this.target.y, enemy.x, enemy.y);
                        if (distance <= this.splashRadius) {
                            // Damage falls off with distance
                            let damageMultiplier = 1 - (distance / this.splashRadius);
                            enemy.takeDamage(this.damage * damageMultiplier);
                        }
                    }
                }

                // Create explosion effect
                for (let i = 0; i < 20; i++) {
                    let angle = random(TWO_PI);
                    let speed = random(1, 3);
                    let p = new Particle(
                        this.target.x,
                        this.target.y,
                        cos(angle) * speed,
                        sin(angle) * speed,
                        [255, 100, 0], // Orange explosion
                        random(5, 10),
                        30
                    );
                    particles.push(p);
                }
            } else {
                // Direct damage to target
                this.target.takeDamage(this.damage);
            }
        }

        // Mark as finished
        this.finished = true;
    }

    draw() {
        push();

        // Draw trail
        for (let i = 0; i < this.trail.length; i++) {
            let alpha = map(i, 0, this.trail.length - 1, 50, 200);
            let size = map(i, 0, this.trail.length - 1, this.size * 0.5, this.size);

            if (this.type === "archer") {
                // Arrow trail
                noStroke();
                fill(150, 75, 0, alpha);
                ellipse(this.trail[i].x, this.trail[i].y, size * 0.5, size * 0.5);
            } else if (this.type === "mage") {
                // Magic trail
                noStroke();
                fill(100, 100, 255, alpha);
                ellipse(this.trail[i].x, this.trail[i].y, size, size);
            } else if (this.type === "cannon") {
                // Cannonball trail (smoke)
                noStroke();
                fill(100, 100, 100, alpha);
                ellipse(this.trail[i].x, this.trail[i].y, size, size);
            }
        }

        // Draw projectile
        translate(this.x, this.y);
        rotate(this.angle);

        if (this.type === "archer") {
            // Arrow
            fill(150, 75, 0);
            stroke(100, 50, 0);
            strokeWeight(1);
            rect(0, 0, this.size * 2, this.size * 0.5);

            // Arrowhead
            fill(100, 100, 100);
            noStroke();
            triangle(this.size * 2, 0, this.size * 1.5, -this.size * 0.8, this.size * 1.5, this.size * 0.8);

            // Fletching
            fill(200, 200, 200);
            triangle(-this.size, 0, -this.size * 2, -this.size, -this.size * 2, this.size);
        } else if (this.type === "mage") {
            // Magic orb
            for (let i = 3; i > 0; i--) {
                fill(100, 100, 255, 50);
                noStroke();
                ellipse(0, 0, this.size * 1.5 * i / 3, this.size * 1.5 * i / 3);
            }

            fill(200, 200, 255);
            ellipse(0, 0, this.size, this.size);

            // Sparkles
            for (let i = 0; i < 3; i++) {
                let angle = frameCount * 0.2 + i * TWO_PI / 3;
                let x = cos(angle) * this.size / 2;
                let y = sin(angle) * this.size / 2;
                fill(255);
                ellipse(x, y, 2, 2);
            }
        } else if (this.type === "cannon") {
            // Cannonball
            fill(50, 50, 50);
            stroke(30, 30, 30);
            strokeWeight(1);
            ellipse(0, 0, this.size, this.size);

            // Highlight
            fill(80, 80, 80);
            noStroke();
            ellipse(-this.size / 4, -this.size / 4, this.size / 3, this.size / 3);
        }

        pop();
    }
}

// --- Check UI Hover for Tooltips ---
function checkUIHover() {
    // Reset tooltip visibility if not hovering over any UI element
    let hovering = false;

    // Check gold icon
    if (dist(mouseX, mouseY, 20, 20) < 15) {
        tooltip.show("Gold: Used to purchase and upgrade towers", mouseX, mouseY);
        hovering = true;
    }

    // Check lives icon
    if (dist(mouseX, mouseY, 100, 20) < 15) {
        tooltip.show("Lives: Lose all lives and it's game over", mouseX, mouseY);
        hovering = true;
    }

    // Check wave display
    let waveDisplay = new WaveDisplay();
    if (mouseX > waveDisplay.x && mouseX < waveDisplay.x + waveDisplay.width &&
        mouseY > waveDisplay.y && mouseY < waveDisplay.y + waveDisplay.height) {
        tooltip.show("Wave Progress: Shows current wave and completion", mouseX, mouseY);
        hovering = true;
    }

    // Check speed buttons
    let speedX = waveDisplay.x + waveDisplay.width + 20;
    let speedY = waveDisplay.y;
    let buttonWidth = 30;
    let buttonHeight = waveDisplay.height;
    let buttonSpacing = 5;

    // Speed label
    if (mouseX > speedX - 40 && mouseX < speedX &&
        mouseY > speedY && mouseY < speedY + buttonHeight) {
        tooltip.show("Game Speed Controls", mouseX, mouseY);
        hovering = true;
    }

    // 1x speed button
    if (mouseX > speedX && mouseX < speedX + buttonWidth &&
        mouseY > speedY && mouseY < speedY + buttonHeight) {
        tooltip.show("Normal Speed (1x)", mouseX, mouseY);
        hovering = true;
    }

    // 2x speed button
    speedX += buttonWidth + buttonSpacing;
    if (mouseX > speedX && mouseX < speedX + buttonWidth &&
        mouseY > speedY && mouseY < speedY + buttonHeight) {
        tooltip.show("Double Speed (2x)", mouseX, mouseY);
        hovering = true;
    }

    // 3x speed button
    speedX += buttonWidth + buttonSpacing;
    if (mouseX > speedX && mouseX < speedX + buttonWidth &&
        mouseY > speedY && mouseY < speedY + buttonHeight) {
        tooltip.show("Triple Speed (3x)", mouseX, mouseY);
        hovering = true;
    }

    // Check tower options
    let startX = 150; // Updated tower menu position
    let startY = height - 110;
    let optionWidth = 100;
    let optionHeight = 100;
    let optionSpacing = 10;

    for (let i = 0; i < towerOptions.length; i++) {
        let x = startX + i * (optionWidth + optionSpacing);
        let y = startY;

        if (mouseX > x && mouseX < x + optionWidth &&
            mouseY > y && mouseY < y + optionHeight) {

            let tooltipText = "";
            switch (towerOptions[i].type) {
                case "archer":
                    tooltipText = "Archer Tower: Fast firing, moderate damage";
                    break;
                case "mage":
                    tooltipText = "Mage Tower: Slower, higher damage with magical projectiles";
                    break;
                case "cannon":
                    tooltipText = "Cannon Tower: Slow firing, high damage with splash effect";
                    break;
                case "barracks":
                    tooltipText = "Barracks: Deploys soldiers that attack and block enemies";
                    break;
            }

            tooltip.show(tooltipText + " (Cost: " + towerOptions[i].cost + " gold)", mouseX, mouseY);
            hovering = true;
        }
    }

    // Check Next Wave button
    if (waveManager.waveCompleted) {
        let buttonX = width - 120;
        let buttonY = height - 50;
        let buttonWidth = 100;
        let buttonHeight = 40;

        if (mouseX > buttonX && mouseX < buttonX + buttonWidth &&
            mouseY > buttonY && mouseY < buttonY + buttonHeight) {
            tooltip.show("Start the next wave of enemies", mouseX, mouseY);
            hovering = true;
        }
    }

    // If not hovering over any UI element, hide the tooltip
    if (!hovering && tooltip.visible) {
        tooltip.visible = false;
    }
}
