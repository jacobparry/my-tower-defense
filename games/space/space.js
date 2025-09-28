// === GALACTIC OUTPOST - SPACE TOWER DEFENSE ===

// --- Global Variables ---
let station; // Central space station
let orbitalRings = []; // Array of orbital rings
let satellites = []; // All deployed satellites
let enemies = [];
let projectiles = [];
let particles = [];

// Resources
let credits = 500;
let energyCapacity = 0;
let energyUsed = 0;
let points = 0;

// Game state
let gameState = "build"; // "build", "wave", "victory", "gameover", "wave_preview"
let selectedSatelliteType = null;
let selectedRing = null;
let selectedSlot = null;
let selectedSatellite = null;

// New selection system
let selectedSlotRing = null;
let selectedSlotIndex = null;
let highlightedSatellite = null;
let waveNumber = 1;
let totalWaves = 1000;

// Game speed control
let gameSpeed = 1;
let gameSpeedOptions = [0, 1, 5, 10]; // 0x (pause), 1x, 5x, 10x speed options
let currentSpeedIndex = 1; // Start at 1x speed (index 1)
let enemiesSpawned = 0;
let enemiesPerWave = 8;
let waveTimer = 0;
let waveDelay = 180; // 3 seconds between waves
let currentWaveEnemies = [];
let autoStartWaves = false; // Auto start next wave toggle
let autoStartTimer = 0; // Timer for auto start delay
let autoStartDelay = 180; // 3 seconds delay before auto start
let perfectWave = true; // Track if any enemies reached the center this wave
let enemiesKilled = 0; // Track enemies killed this wave

// Canvas settings
const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 700;
const CENTER_X = CANVAS_WIDTH / 2;
const CENTER_Y = CANVAS_HEIGHT / 2;

// Colors
const COLORS = {
    background: [13, 27, 42],
    station: [0, 245, 255],
    ring: [0, 245, 255, 60],
    ringActive: [0, 245, 255, 120],
    satellite: [255, 255, 255],
    enemy: [255, 0, 110],
    projectile: [0, 255, 100],
    ui: [0, 245, 255],
    energy: [57, 255, 20]
};

// --- Setup Function ---
function setup() {
    let canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    canvas.parent('sketch-holder');

    // Initialize space station
    station = new SpaceStation(CENTER_X, CENTER_Y);

    // Initialize orbital rings
    initializeOrbitalRings();

    // Initialize wave manager
    initializeWaveSystem();

    console.log("Galactic Outpost initialized!");
}

// --- Main Draw Loop ---
function draw() {
    // Space background
    drawSpaceBackground();

    // Update and draw all game objects
    updateGame();
    drawGame();

    // Draw UI
    drawUI();

    // Update particles
    updateParticles();

    // Draw game state specific UI
    if (gameState === "build") {
        drawBuildPhaseUI();
    }

    if (gameState === "gameover") {
        drawGameOverScreen();
    }

    if (gameState === "victory") {
        drawVictoryScreen();
    }
}

// --- Initialize Orbital Rings ---
function initializeOrbitalRings() {
    orbitalRings = [
        new OrbitalRing(1, 120, 8, 1.5, true),  // Ring 1: Defense Grid (unlocked)
        new OrbitalRing(2, 200, 10, 1.0, false), // Ring 2: Patrol Network
        new OrbitalRing(3, 280, 12, 0.7, false)  // Ring 3: Heavy Artillery
    ];
}

// --- Initialize Wave System ---
function initializeWaveSystem() {
    generateWavePreview();
}

function generateWavePreview() {
    currentWaveEnemies = [];

    // Progressive enemy scaling for 100 waves
    enemiesPerWave = 3 + Math.floor(waveNumber * 0.5) + Math.floor(waveNumber / 10); // Starts at 3, grows slowly

    // Boss wave every 10 waves
    let isBossWave = waveNumber % 10 === 0;

    if (isBossWave) {
        enemiesPerWave = Math.floor(enemiesPerWave * 0.6); // Fewer enemies in boss wave
        currentWaveEnemies.push({type: "boss", count: 1});
        enemiesPerWave--;
    }

    // Generate random enemy composition
    let remaining = enemiesPerWave;
    let enemyTypes = ["scout", "fighter", "heavy"];

    // Progressive enemy type unlocking for 100 waves
    if (waveNumber >= 5) enemyTypes.push("heavy");
    if (waveNumber >= 15) enemyTypes.push("stealth");
    if (waveNumber >= 25) enemyTypes.push("heavy"); // Add more heavies
    if (waveNumber >= 40) enemyTypes = [...enemyTypes, "stealth", "heavy"]; // More variety

    while (remaining > 0) {
        let type = random(enemyTypes);
        let count = Math.min(remaining, Math.floor(random(1, 4)));

        // Check if this type already exists
        let existingType = currentWaveEnemies.find(e => e.type === type);
        if (existingType) {
            existingType.count += count;
        } else {
            currentWaveEnemies.push({type: type, count: count});
        }

        remaining -= count;
    }
}

// --- Space Station Class ---
class SpaceStation {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 40;
        this.health = 1000;
        this.maxHealth = 1000;
        this.level = 1;
        this.rotationAngle = 0;
        this.fireTimer = 0; // Add fire timer like satellites
        this.fireRate = 60; // Fire every 60 frames (1 second at normal speed)
    }

    update() {
        this.rotationAngle += 0.5; // Slow rotation

        // Handle fire timer (like satellites)
        if (this.fireTimer > 0) {
            this.fireTimer = Math.max(0, this.fireTimer - gameSpeed);
        }

        // Station auto-fire at nearby enemies
        if (this.fireTimer === 0) {
            this.tryFireAtEnemies();
        }
    }

    tryFireAtEnemies() {
        let closestEnemy = null;
        let closestDistance = 150; // Station range

        for (let enemy of enemies) {
            let distance = dist(this.x, this.y, enemy.x, enemy.y);
            if (distance < closestDistance) {
                closestEnemy = enemy;
                closestDistance = distance;
            }
        }

        if (closestEnemy) {
            // Station fires heavy plasma cannon
            projectiles.push(new PlasmaCannon(this.x, this.y, closestEnemy, 150));

            // Reset fire timer
            this.fireTimer = this.fireRate;

            // Muzzle flash
            for (let i = 0; i < 5; i++) {
                particles.push(new Particle(
                    this.x + random(-20, 20),
                    this.y + random(-20, 20),
                    [0, 245, 255],
                    30
                ));
            }
        }
    }

    upgrade() {
        if (this.level < 5) {
            let cost = this.getUpgradeCost();
            if (credits >= cost) {
                credits -= cost;
                this.level++;
                this.maxHealth += 200;
                this.health = this.maxHealth; // Full heal on upgrade
                return true;
            }
        }
        return false;
    }

    getUpgradeCost() {
        const costs = [0, 500, 1200, 2500, 5000];
        return costs[this.level] || 10000;
    }

    takeDamage(amount) {
        this.health -= amount;

        // Damage particles
        for (let i = 0; i < 3; i++) {
            particles.push(new Particle(
                this.x + random(-30, 30),
                this.y + random(-30, 30),
                [255, 100, 100],
                40
            ));
        }

        // Check game over
        if (this.health <= 0) {
            this.health = 0;
            gameState = "gameover";
        }
    }

    draw() {
        push();
        translate(this.x, this.y);
        rotate(radians(this.rotationAngle));

        // Station core
        fill(COLORS.station);
        stroke(COLORS.station);
        strokeWeight(2);
        ellipse(0, 0, this.radius * 2, this.radius * 2);

        // Station details
        fill(20, 40, 80);
        ellipse(0, 0, this.radius * 1.5, this.radius * 1.5);

        // Station weapons (based on level)
        this.drawStationWeapons();

        // Pulsing energy core
        let pulseSize = this.radius * 0.8 + sin(frameCount * 0.1) * 5;
        fill(COLORS.station[0], COLORS.station[1], COLORS.station[2], 100);
        noStroke();
        ellipse(0, 0, pulseSize, pulseSize);

        pop();

        // Health bar
        this.drawHealthBar();
    }

    drawStationWeapons() {
        // Basic weapons array
        for (let i = 0; i < 6; i++) {
            let angle = (360 / 6) * i;
            push();
            rotate(radians(angle));

            // Weapon mount
            fill(COLORS.station);
            rect(this.radius * 0.7, -2, 8, 4);

            // Weapon barrel
            fill(150, 150, 200);
            rect(this.radius * 0.9, -1, 6, 2);

            pop();
        }
    }

    drawHealthBar() {
        let barWidth = 80;
        let barHeight = 6;
        let x = this.x - barWidth/2;
        let y = this.y - this.radius - 20;

        // Background
        fill(50, 50, 50);
        noStroke();
        rect(x, y, barWidth, barHeight);

        // Health
        let healthPercent = this.health / this.maxHealth;
        fill(255 * (1 - healthPercent), 255 * healthPercent, 0);
        rect(x, y, barWidth * healthPercent, barHeight);

        // Border
        stroke(255);
        strokeWeight(1);
        noFill();
        rect(x, y, barWidth, barHeight);
    }
}

// --- Orbital Ring Class ---
class OrbitalRing {
    constructor(ringNumber, radius, slots, rotationSpeed, unlocked) {
        this.number = ringNumber;
        this.radius = radius;
        this.slots = slots;
        this.rotationSpeed = rotationSpeed; // degrees per frame
        this.unlocked = unlocked;
        this.currentRotation = 0;
        this.satellites = [];
        this.unlockCost = this.calculateUnlockCost();
        this.manualControl = false;
        this.manualControlCost = 800;
    }

    calculateUnlockCost() {
        const costs = [0, 200, 500, 1000, 2000];
        return costs[this.number - 1] || 0;
    }

    update() {
        if (this.unlocked) {
            this.currentRotation += this.rotationSpeed * gameSpeed;
            if (this.currentRotation >= 360) {
                this.currentRotation -= 360;
            }
        }
    }

    draw() {
        push();
        translate(CENTER_X, CENTER_Y);

        // Ring circle
        noFill();
        if (this.unlocked) {
            if (selectedRing === this) {
                stroke(COLORS.ringActive);
                strokeWeight(3);
            } else {
                stroke(COLORS.ring);
                strokeWeight(2);
            }
        } else {
            stroke(100, 100, 100, 80);
            strokeWeight(1);
            // Dashed line for locked rings
            drawDashedCircle(0, 0, this.radius * 2);
        }

        if (!this.isLockedRing()) {
            ellipse(0, 0, this.radius * 2, this.radius * 2);
        }

        // Draw satellite slots
        if (this.unlocked) {
            this.drawSatelliteSlots();
        }

        // Ring label
        fill(COLORS.ui);
        textAlign(CENTER, CENTER);
        textSize(12);
        text(`Ring ${this.number}`, this.radius + 20, -5);

        if (!this.unlocked) {
            fill(150, 150, 150);
            text(`${this.unlockCost}¢`, this.radius + 20, 10);
        }

        pop();
    }

    drawSatelliteSlots() {
        for (let i = 0; i < this.slots; i++) {
            let angle = (360 / this.slots) * i + this.currentRotation;
            let slotX = cos(radians(angle)) * this.radius;
            let slotY = sin(radians(angle)) * this.radius;

            // Check if slot is occupied
            let occupied = this.satellites.some(sat => sat.slotIndex === i);
            let isSelectedSlot = (selectedSlotRing === this && selectedSlotIndex === i);

            if (occupied) {
                // Satellite is here - draw connection line
                stroke(COLORS.energy[0], COLORS.energy[1], COLORS.energy[2], 100);
                strokeWeight(1);
                line(0, 0, slotX, slotY);
            } else {
                // Empty slot styling
                if (isSelectedSlot) {
                    // Selected empty slot - bright and pulsing
                    let pulseAlpha = 150 + sin(frameCount * 0.2) * 50;
                    fill(255, 255, 0, pulseAlpha);
                    stroke(255, 255, 0);
                    strokeWeight(3);
                    ellipse(slotX, slotY, 18, 18);

                    // Larger + symbol for selected slot
                    stroke(255, 255, 0);
                    strokeWeight(2);
                    line(slotX - 5, slotY, slotX + 5, slotY);
                    line(slotX, slotY - 5, slotX, slotY + 5);
                } else {
                    // Normal empty slot
                    fill(COLORS.ui[0], COLORS.ui[1], COLORS.ui[2], 120);
                    stroke(COLORS.ui[0], COLORS.ui[1], COLORS.ui[2], 200);
                    strokeWeight(1);
                    ellipse(slotX, slotY, 12, 12);

                    // Small + symbol for empty slots
                    stroke(COLORS.ui[0], COLORS.ui[1], COLORS.ui[2], 150);
                    strokeWeight(1);
                    line(slotX - 3, slotY, slotX + 3, slotY);
                    line(slotX, slotY - 3, slotX, slotY + 3);
                }
            }
        }
    }

    isLockedRing() {
        return !this.unlocked;
    }

    getSlotPosition(slotIndex) {
        let angle = (360 / this.slots) * slotIndex + this.currentRotation;
        return {
            x: CENTER_X + cos(radians(angle)) * this.radius,
            y: CENTER_Y + sin(radians(angle)) * this.radius,
            angle: angle
        };
    }

    hasEmptySlot() {
        return this.satellites.length < this.slots;
    }

    addSatellite(satellite) {
        // If satellite already has a specific slot assigned, use that
        if (satellite.slotIndex !== null && satellite.slotIndex !== undefined) {
            // Check if the requested slot is available
            if (!this.satellites.some(sat => sat.slotIndex === satellite.slotIndex)) {
                satellite.ring = this;
                this.satellites.push(satellite);
                satellites.push(satellite);
                console.log(`Placed satellite in requested slot ${satellite.slotIndex}`);
                return true;
            } else {
                console.log(`Slot ${satellite.slotIndex} is already occupied!`);
                return false;
            }
        }

        // Otherwise, find first empty slot (old behavior)
        if (this.hasEmptySlot()) {
            for (let i = 0; i < this.slots; i++) {
                if (!this.satellites.some(sat => sat.slotIndex === i)) {
                    satellite.slotIndex = i;
                    satellite.ring = this;
                    this.satellites.push(satellite);
                    satellites.push(satellite);
                    console.log(`Placed satellite in first available slot ${i}`);
                    return true;
                }
            }
        }
        return false;
    }
}

// --- Satellite Base Class ---
class Satellite {
    constructor(type, ring, slotIndex) {
        this.type = type;
        this.ring = ring;
        this.slotIndex = slotIndex;
        this.x = CENTER_X;
        this.y = CENTER_Y;
        this.angle = 0;
        this.health = 100;
        this.maxHealth = 100;
        this.level = 1;
        this.fireTimer = 0;

        // Set properties based on type
        this.setPropertiesByType();
    }

    setPropertiesByType() {
        switch(this.type) {
            case "laser":
                this.damage = 25;
                this.range = 100;
                this.fireRate = 20; // frames between shots
                this.energyCost = 15;
                this.cost = 75;
                break;
            case "missile":
                this.damage = 60;
                this.range = 150;
                this.fireRate = 45;
                this.energyCost = 25;
                this.cost = 125;
                break;
            case "tesla":
                this.damage = 35;
                this.range = 120;
                this.fireRate = 40;
                this.energyCost = 30;
                this.cost = 150;
                break;
            case "shield":
                this.damage = 0;
                this.range = 100;
                this.fireRate = 0;
                this.energyCost = 20;
                this.cost = 175;
                break;
            case "pylon":
                this.damage = 0;
                this.range = 180;
                this.fireRate = 0;
                this.energyCost = -75; // Generates energy
                this.cost = 200;
                break;
        }
    }

    update() {
        if (this.ring && this.ring.unlocked) {
            // Update position based on ring rotation
            let pos = this.ring.getSlotPosition(this.slotIndex);
            this.x = pos.x;
            this.y = pos.y;
            this.angle = pos.angle;

            // Update combat
            if (this.fireTimer > 0) {
                this.fireTimer--;
            }

            // Try to fire at enemies (only if we have energy)
            if (this.type !== "pylon" && this.fireTimer === 0 && this.hasEnergy()) {
                this.tryFireAtEnemies();
            }
        }
    }

    hasEnergy() {
        // Check if there's available energy for this satellite to operate
        let availableEnergy = energyCapacity - energyUsed;
        return availableEnergy >= 0;
    }

    tryFireAtEnemies() {
        // Find closest enemy in range
        let closestEnemy = null;
        let closestDistance = this.range;

        for (let enemy of enemies) {
            let distance = dist(this.x, this.y, enemy.x, enemy.y);
            if (distance <= this.range && distance < closestDistance) {
                closestEnemy = enemy;
                closestDistance = distance;
            }
        }

        if (closestEnemy) {
            this.fireAt(closestEnemy);
            this.fireTimer = this.fireRate;
        }
    }

    fireAt(target) {
        if (this.type === "laser") {
            // Instant laser beam
            projectiles.push(new LaserBeam(this.x, this.y, target.x, target.y, this.damage));
        } else if (this.type === "missile") {
            // Seeking missile
            projectiles.push(new Missile(this.x, this.y, target, this.damage));
        } else if (this.type === "tesla") {
            // Chain lightning
            projectiles.push(new TeslaChain(this.x, this.y, target, this.damage));
        } else if (this.type === "shield") {
            // Shield projection (creates temporary barriers)
            this.createShieldBarrier();
        }

        // Muzzle flash particle
        particles.push(new Particle(this.x, this.y, COLORS.projectile, 30));
    }

    createShieldBarrier() {
        // Create strategic shield wall to block enemy approach
        let angle = atan2(CENTER_Y - this.y, CENTER_X - this.x);
        let distance = 40; // Distance from generator

        // Create a defensive wall perpendicular to the center direction
        let perpAngle = angle + PI/2; // Perpendicular angle

        // Generate 4 shield particles in a line to form a barrier wall
        for (let i = -1.5; i <= 1.5; i += 1) {
            let barrierX = this.x + cos(angle) * distance + cos(perpAngle) * i * 20;
            let barrierY = this.y + sin(angle) * distance + sin(perpAngle) * i * 20;

            // Longer lasting shields for upgraded generators
            let shieldDuration = 120 + (this.level - 1) * 60; // Level 1: 2s, Level 2: 3s, Level 3: 4s
            particles.push(new ShieldParticle(barrierX, barrierY, shieldDuration));
        }

        console.log(`Shield barrier deployed by Level ${this.level} generator`);
    }

    upgrade() {
        if (this.level < 3) {
            let cost = this.getUpgradeCost();
            if (credits >= cost) {
                credits -= cost;
                this.level++;
                this.applyUpgrade();
                return true;
            }
        }
        return false;
    }

    getUpgradeCost() {
        return Math.floor(this.cost * (0.6 + 0.4 * this.level));
    }

    applyUpgrade() {
        // Special handling for power pylons
        if (this.type === "pylon") {
            // Increase energy generation by 25 per upgrade level
            let oldEnergyGen = Math.abs(this.energyCost);
            this.energyCost = -(75 + (this.level - 1) * 25); // Level 1: -75, Level 2: -100, Level 3: -125
            let newEnergyGen = Math.abs(this.energyCost);

            // Update global energy capacity
            energyCapacity += (newEnergyGen - oldEnergyGen);

            console.log(`Pylon upgraded to Level ${this.level}: generates ${newEnergyGen} energy (+${newEnergyGen - oldEnergyGen})`);
        } else if (this.type === "shield") {
            // Shield generator upgrades
            this.range = Math.floor(this.range * 1.3); // Better detection range
            this.fireRate = Math.max(15, Math.floor(this.fireRate * 0.7)); // Deploy shields faster
            console.log(`Shield generator upgraded to Level ${this.level}: +30% range, +30% deploy speed`);
        } else {
            // Regular upgrades for combat satellites
            this.damage = Math.floor(this.damage * 1.4);
            this.range = Math.floor(this.range * 1.2);
            this.fireRate = Math.max(10, Math.floor(this.fireRate * 0.8));
        }

        // Health upgrade applies to all satellites
        this.maxHealth += 50;
        this.health = this.maxHealth;
    }

    draw() {
        if (!this.ring || !this.ring.unlocked) return;

        let isHighlighted = (highlightedSatellite === this || selectedSatellite === this);

        // Draw selection highlight
        if (isHighlighted) {
            push();
            translate(this.x, this.y);

            // Pulsing selection ring
            let pulseSize = 25 + sin(frameCount * 0.15) * 5;
            let pulseAlpha = 100 + sin(frameCount * 0.15) * 50;

            fill(255, 255, 0, pulseAlpha);
            stroke(255, 255, 0, 200);
            strokeWeight(2);
            ellipse(0, 0, pulseSize, pulseSize);

            pop();
        }

        push();
        translate(this.x, this.y);
        rotate(radians(this.angle));

        // Draw based on type
        if (this.type === "laser") {
            this.drawLaserSatellite();
        } else if (this.type === "missile") {
            this.drawMissileSatellite();
        } else if (this.type === "pylon") {
            this.drawPylon();
        } else if (this.type === "tesla") {
            this.drawTeslaSatellite();
        } else if (this.type === "shield") {
            this.drawShieldSatellite();
        }

        pop();

        // Draw range indicator if this satellite is selected
        if (isHighlighted && this.type !== "pylon") {
            this.drawRangeIndicator();
        }
    }

    drawLaserSatellite() {
        // Main body
        fill(COLORS.satellite);
        stroke(COLORS.ui);
        strokeWeight(1);
        ellipse(0, 0, 12, 8);

        // Laser barrel
        fill(255, 100, 100);
        rect(6, -1, 8, 2);

        // Energy glow
        if (frameCount % 60 < 30) {
            fill(255, 100, 100, 100);
            noStroke();
            ellipse(0, 0, 16, 12);
        }
    }

    drawMissileSatellite() {
        // Main body
        fill(COLORS.satellite);
        stroke(COLORS.ui);
        strokeWeight(1);
        rect(-6, -4, 12, 8);

        // Missile tubes
        fill(100, 100, 100);
        rect(6, -3, 6, 2);
        rect(6, 1, 6, 2);
    }

    drawPylon() {
        // Pylon core
        fill(COLORS.energy);
        stroke(COLORS.energy);
        strokeWeight(2);
        ellipse(0, 0, 16, 16);

        // Energy field visualization
        let pulseSize = 20 + sin(frameCount * 0.15) * 4;
        fill(COLORS.energy[0], COLORS.energy[1], COLORS.energy[2], 50);
        noStroke();
        ellipse(0, 0, pulseSize, pulseSize);

        // Power connectors
        for (let i = 0; i < 4; i++) {
            let angle = i * 90;
            push();
            rotate(radians(angle));
            fill(COLORS.energy);
            rect(8, -1, 4, 2);
            pop();
        }
    }

    drawTeslaSatellite() {
        // Main coil body
        fill(150, 150, 255);
        stroke(100, 100, 255);
        strokeWeight(2);
        ellipse(0, 0, 10, 14);

        // Tesla coils
        for (let i = 0; i < 3; i++) {
            let angle = i * 120;
            push();
            rotate(radians(angle));
            stroke(200, 200, 255);
            strokeWeight(1);
            line(0, 0, 8, 0);
            ellipse(8, 0, 3, 3);
            pop();
        }

        // Electric arc effect
        if (frameCount % 20 < 10) {
            stroke(255, 255, 255, 150);
            strokeWeight(1);
            for (let i = 0; i < 2; i++) {
                let startAngle = random(0, 360);
                let endAngle = startAngle + random(-60, 60);
                let x1 = cos(radians(startAngle)) * 6;
                let y1 = sin(radians(startAngle)) * 6;
                let x2 = cos(radians(endAngle)) * 6;
                let y2 = sin(radians(endAngle)) * 6;
                line(x1, y1, x2, y2);
            }
        }
    }

    drawShieldSatellite() {
        // Shield generator core
        fill(100, 255, 255);
        stroke(0, 200, 255);
        strokeWeight(2);
        rect(-6, -6, 12, 12);

        // Shield projector
        fill(150, 255, 255);
        triangle(6, 0, 12, -4, 12, 4);

        // Shield field effect
        let shieldSize = 16 + sin(frameCount * 0.1) * 2;
        stroke(100, 255, 255, 80);
        strokeWeight(1);
        noFill();
        ellipse(0, 0, shieldSize, shieldSize);

        // Shield hexagons
        if (frameCount % 40 < 20) {
            stroke(150, 255, 255, 100);
            strokeWeight(1);
            this.drawHexagon(0, 0, 8);
        }
    }

    drawHexagon(x, y, size) {
        beginShape();
        for (let i = 0; i < 6; i++) {
            let angle = (i * 60) - 90;
            let px = x + cos(radians(angle)) * size;
            let py = y + sin(radians(angle)) * size;
            vertex(px, py);
        }
        endShape(CLOSE);
    }

    drawRangeIndicator() {
        // Animated range indicator
        let alpha = 80 + sin(frameCount * 0.1) * 30;
        stroke(255, 255, 0, alpha);
        strokeWeight(2);
        noFill();
        ellipse(this.x, this.y, this.range * 2, this.range * 2);

        // Inner range circle
        stroke(255, 255, 0, alpha * 0.5);
        strokeWeight(1);
        ellipse(this.x, this.y, this.range * 1.5, this.range * 1.5);
    }
}

// --- UI Functions ---
function drawUI() {
    // Resource display
    drawResourceDisplay();

    // Satellite selection
    drawSatelliteSelection();

    // Ring unlock options
    drawRingUnlockOptions();

    // Game info
    drawGameInfo();

    // Selection status and instructions
    drawSelectionStatus();
}

function drawSelectionStatus() {
    if (gameState === "build" || gameState === "wave") {
        fill(COLORS.ui);
        textAlign(LEFT, CENTER);
        textSize(12);

        if (selectedSlotRing && selectedSlotIndex !== null) {
            // Show selected slot info
            fill(255, 255, 0);
            text(`✓ Selected: Ring ${selectedSlotRing.number} Slot ${selectedSlotIndex} - Choose satellite type →`, 20, height - 15);
        } else if (selectedSatellite || highlightedSatellite) {
            // Show selected satellite info
            let sat = selectedSatellite || highlightedSatellite;
            fill(255, 255, 0);
            text(`✓ Selected: ${sat.type.charAt(0).toUpperCase() + sat.type.slice(1)} Satellite Level ${sat.level}`, 20, height - 15);
        } else {
            // Show instructions in same place as selection messages
            if (frameCount % 120 < 60) {
                fill(COLORS.ui[0], COLORS.ui[1], COLORS.ui[2], 150);
                text("Click orbital slot → Choose satellite type → Start wave", 20, height - 15);
            }
        }
    }
}

function drawSpeedControl() {
    // Speed control buttons - centered at top
    let speedY = 25;
    let buttonWidth = 35;
    let buttonHeight = 20;
    let buttonSpacing = 5;

    // Calculate total width for centering
    let totalWidth = gameSpeedOptions.length * buttonWidth + (gameSpeedOptions.length - 1) * buttonSpacing;
    let startX = (width - totalWidth) / 2;

    fill(COLORS.ui);
    textAlign(CENTER, CENTER);
    textSize(12);
    text("Speed:", startX - 30, speedY);

    for (let i = 0; i < gameSpeedOptions.length; i++) {
        let x = startX + i * (buttonWidth + buttonSpacing);
        let speed = gameSpeedOptions[i];
        let isSelected = (currentSpeedIndex === i);

        // Button background
        if (isSelected) {
            fill(COLORS.ui[0], COLORS.ui[1], COLORS.ui[2], 150);
        } else {
            fill(50, 50, 50);
        }

        stroke(COLORS.ui);
        strokeWeight(isSelected ? 2 : 1);
        rect(x, speedY - 10, buttonWidth, buttonHeight);

        // Button text
        fill(COLORS.ui);
        textAlign(CENTER, CENTER);
        textSize(speed === 0 ? 8 : 10);
        text(speed === 0 ? "PAUSE" : `${speed}x`, x + buttonWidth/2, speedY);
    }
}

function drawResourceDisplay() {
    // Credits
    fill(COLORS.ui);
    textAlign(LEFT, CENTER);
    textSize(16);
    text(`Credits: ${credits}`, 20, 30);

    // Energy
    let availableEnergy = energyCapacity - energyUsed;
    fill(COLORS.energy);
    text(`Energy: ${availableEnergy}/${energyCapacity}`, 20, 55);

    // Energy bar
    let barWidth = 120;
    let barHeight = 8;
    let energyPercent = energyCapacity > 0 ? availableEnergy / energyCapacity : 0;

    fill(50, 50, 50);
    noStroke();
    rect(140, 51, barWidth, barHeight);

    fill(COLORS.energy);
    rect(140, 51, barWidth * energyPercent, barHeight);

    stroke(COLORS.ui);
    strokeWeight(1);
    noFill();
    rect(140, 51, barWidth, barHeight);
}

function drawSatelliteSelection() {
    let startY = 100;
    let buttonHeight = 42; // Increased height back up
    let buttonSpacing = 3;  // Reduced spacing

    // Satellite types
    let satelliteTypes = [
        {type: "pylon", name: "Power Pylon", cost: 200, energy: -75, desc: "Generates energy"},
        {type: "laser", name: "Laser Satellite", cost: 75, energy: 15, desc: "Fast, precise shots"},
        {type: "missile", name: "Missile Platform", cost: 125, energy: 25, desc: "Heavy damage"},
        {type: "tesla", name: "Tesla Coil", cost: 150, energy: 30, desc: "Chain lightning"},
        {type: "shield", name: "Shield Generator", cost: 175, energy: 20, desc: "Projects barriers"}
    ];

    for (let i = 0; i < satelliteTypes.length; i++) {
        let sat = satelliteTypes[i];
        let y = startY + i * (buttonHeight + buttonSpacing);

        // Button background
        if (selectedSatelliteType === sat.type) {
            fill(COLORS.ui[0], COLORS.ui[1], COLORS.ui[2], 100);
        } else {
            fill(20, 40, 80);
        }

        stroke(COLORS.ui);
        strokeWeight(1);
        rect(20, y, 140, buttonHeight); // Reduced width to 140px

        // Text
        fill(COLORS.ui);
        textAlign(LEFT, CENTER);
        textSize(11); // Slightly smaller
        text(sat.name, 30, y + 8);

        textSize(9);
        fill(credits >= sat.cost ? COLORS.ui : [150, 150, 150]);
        text(`Cost: ${sat.cost}¢`, 30, y + 22);

        let energyText = sat.energy < 0 ? `+${Math.abs(sat.energy)} Energy` : `-${sat.energy} Energy`;
        fill(sat.energy < 0 ? COLORS.energy : [255, 200, 100]);
        text(energyText, 110, y + 22);

        fill(200, 200, 200);
        textSize(8);
        text(sat.desc, 30, y + 36);
    }

    // Draw tooltips section
    drawTooltips();
}

function drawTooltips() {
    let tooltipY = 420; // Moved much lower to avoid overlap with selectors

    fill(COLORS.ui);
    textAlign(LEFT, CENTER);
    textSize(11);
    text("── TOWER INFO ──", 20, tooltipY);

    // Show different tooltips based on selection
    textSize(9);
    fill(180, 180, 180);

    if (selectedSatelliteType) {
        // Show tooltip for selected satellite type
        drawSatelliteTooltip(selectedSatelliteType, tooltipY + 15);
    } else if (selectedSatellite) {
        // Show tooltip for selected existing satellite
        drawSelectedSatelliteInfo(selectedSatellite, tooltipY + 15);
    } else {
        // Show general help
        text("Click a tower type for details", 20, tooltipY + 15);
        text("or select an existing tower", 20, tooltipY + 25);
    }
}

function drawSatelliteTooltip(type, startY) {
    let currentY = startY;

    switch(type) {
        case "pylon":
            text("⚡ POWER PYLON", 20, currentY);
            text("• Generates energy for other towers", 20, currentY + 12);
            text("• No direct combat ability", 20, currentY + 24);
            text("UPGRADES:", 20, currentY + 40);
            text("• Lv2: +25 energy (100 total)", 20, currentY + 52);
            text("• Lv3: +50 energy (125 total)", 20, currentY + 64);
            break;

        case "laser":
            text("🔴 LASER SATELLITE", 20, currentY);
            text("• Fast firing, precise targeting", 20, currentY + 12);
            text("• Low damage, good for swarms", 20, currentY + 24);
            text("UPGRADES (per level):", 20, currentY + 40);
            text("• +40% damage, +20% range", 20, currentY + 52);
            text("• +20% fire rate, +50 health", 20, currentY + 64);
            break;

        case "missile":
            text("🚀 MISSILE PLATFORM", 20, currentY);
            text("• High damage explosive projectiles", 20, currentY + 12);
            text("• Slow but devastating impact", 20, currentY + 24);
            text("UPGRADES (per level):", 20, currentY + 40);
            text("• +40% damage, +20% range", 20, currentY + 52);
            text("• +20% fire rate, +50 health", 20, currentY + 64);
            break;

        case "tesla":
            text("⚡ TESLA COIL", 20, currentY);
            text("• Chain lightning attacks", 20, currentY + 12);
            text("• Hits multiple enemies at once", 20, currentY + 24);
            text("UPGRADES (per level):", 20, currentY + 40);
            text("• +40% damage, +20% range", 20, currentY + 52);
            text("• +20% fire rate, +50 health", 20, currentY + 64);
            break;

        case "shield":
            text("🛡️ SHIELD GENERATOR", 20, currentY);
            text("• Creates barrier walls that block enemies", 20, currentY + 12);
            text("• Barriers absorb damage and slow enemies", 20, currentY + 24);
            text("UPGRADES (per level):", 20, currentY + 40);
            text("• +30% range, +30% deploy speed", 20, currentY + 52);
            text("• Longer lasting barriers, +50 health", 20, currentY + 64);
            break;
    }
}

function drawSelectedSatelliteInfo(satellite, startY) {
    let currentY = startY;

    text(`${satellite.type.toUpperCase()} - LEVEL ${satellite.level}`, 20, currentY);
    text(`Health: ${satellite.health}/${satellite.maxHealth}`, 20, currentY + 12);

    if (satellite.type === "pylon") {
        let energyGen = Math.abs(satellite.energyCost);
        text(`Energy Generation: +${energyGen}`, 20, currentY + 24);
    } else {
        text(`Damage: ${satellite.damage}`, 20, currentY + 24);
        text(`Range: ${satellite.range}`, 20, currentY + 36);
    }

    if (satellite.level < 3) {
        let upgradeCost = satellite.getUpgradeCost();
        text(`Next upgrade: ${upgradeCost}¢`, 20, currentY + 52);
    } else {
        text("MAX LEVEL", 20, currentY + 52);
    }
}

function drawRingUnlockOptions() {
    // Show unlock options for locked rings
    fill(COLORS.ui);
    textAlign(LEFT, CENTER);
    textSize(12);
    text("Ring Expansion:", 20, height - 80);

    let lockedRings = orbitalRings.filter(ring => !ring.unlocked);
    if (lockedRings.length > 0) {
        let nextRing = lockedRings[0];
        let buttonY = height - 55;

        // Unlock button
        let canAfford = credits >= nextRing.unlockCost;
        fill(canAfford ? 50 : 30, canAfford ? 100 : 50, canAfford ? 50 : 30);
        stroke(COLORS.ui);
        strokeWeight(1);
        rect(20, buttonY, 180, 25);

        fill(canAfford ? COLORS.ui : [150, 150, 150]);
        textAlign(LEFT, CENTER);
        text(`Unlock Ring ${nextRing.number} (${nextRing.unlockCost}¢)`, 30, buttonY + 13);
    }
}

function drawGameInfo() {
    fill(COLORS.ui);
    textAlign(RIGHT, CENTER);
    textSize(14);
    text(`Wave: ${waveNumber}/${totalWaves}`, width - 20, 30);
    text(`Enemies: ${enemiesKilled}/${enemiesPerWave}`, width - 20, 50);
    text(`Points: ${points}`, width - 20, 70);

    // Speed control
    drawSpeedControl();

    // Station upgrade button
    if (station.level < 5) {
        let upgradeCost = station.getUpgradeCost();
        let canAfford = credits >= upgradeCost;

        fill(canAfford ? 50 : 30, canAfford ? 100 : 50, canAfford ? 50 : 30);
        stroke(COLORS.ui);
        strokeWeight(1);
        rect(width - 200, 90, 180, 25);

        fill(canAfford ? COLORS.ui : [150, 150, 150]);
        textAlign(CENTER, CENTER);
        textSize(12);
        text(`Upgrade Station Lv.${station.level} (${upgradeCost}¢)`, width - 110, 103);

        // Station upgrade tooltip - moved much lower
        fill(150, 150, 150);
        textAlign(RIGHT, CENTER);
        textSize(8);
        text("🏠 SPACE STATION", width - 20, 180);
        text("• Central command hub", width - 20, 190);
        text("• Auto-fires plasma cannons", width - 20, 200);
        text("Upgrades (Max Level 5):", width - 20, 210);
        text("• +200 health per level", width - 20, 220);
        text("• Full heal on upgrade", width - 20, 230);
    }

    // Selected satellite upgrade
    if (selectedSatellite && selectedSatellite.level < 3) {
        let upgradeCost = selectedSatellite.getUpgradeCost();
        let canAfford = credits >= upgradeCost;

        fill(canAfford ? 50 : 30, canAfford ? 100 : 50, canAfford ? 50 : 30);
        stroke(COLORS.ui);
        strokeWeight(1);
        rect(width - 200, 120, 180, 25);

        fill(canAfford ? COLORS.ui : [150, 150, 150]);
        textAlign(CENTER, CENTER);
        textSize(12);
        text(`Upgrade Satellite Lv.${selectedSatellite.level} (${upgradeCost}¢)`, width - 110, 133);
    }
}

// --- Utility Functions ---
function drawSpaceBackground() {
    background(COLORS.background);

    // Draw stars
    for (let i = 0; i < 100; i++) {
        let x = (i * 67) % width;
        let y = (i * 43) % height;
        let brightness = 100 + (i * 13) % 156;

        fill(brightness, brightness, brightness, 150);
        noStroke();
        let size = 1 + (i % 3);
        ellipse(x, y, size, size);
    }

    // Subtle nebula effect
    for (let i = 0; i < 20; i++) {
        let x = (i * 137) % width;
        let y = (i * 93) % height;
        let size = 30 + (i % 50);

        fill(COLORS.ui[0], COLORS.ui[1], COLORS.ui[2], 10);
        noStroke();
        ellipse(x, y, size, size);
    }
}

function drawDashedCircle(x, y, diameter) {
    let circumference = PI * diameter;
    let dashLength = 10;
    let numDashes = circumference / (dashLength * 2);

    for (let i = 0; i < numDashes; i++) {
        let startAngle = (360 / numDashes) * i;
        let endAngle = startAngle + (360 / numDashes) * 0.5;

        let x1 = x + cos(radians(startAngle)) * diameter / 2;
        let y1 = y + sin(radians(startAngle)) * diameter / 2;
        let x2 = x + cos(radians(endAngle)) * diameter / 2;
        let y2 = y + sin(radians(endAngle)) * diameter / 2;

        line(x1, y1, x2, y2);
    }
}

function updateGame() {
    // Use speed-aware update system
    updateGameWithSpeed();

    // Handle wave system
    updateWaveSystem();
}

function drawGame() {
    // Draw orbital rings
    for (let ring of orbitalRings) {
        ring.draw();
    }

    // Draw station
    station.draw();

    // Draw satellites
    for (let satellite of satellites) {
        satellite.draw();
    }

    // Draw enemies
    for (let enemy of enemies) {
        enemy.draw();
    }

    // Draw projectiles
    for (let projectile of projectiles) {
        projectile.draw();
    }

    // Draw particles
    for (let particle of particles) {
        particle.draw();
    }
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        if (particles[i].isDead) {
            particles.splice(i, 1);
        }
    }
}


function drawBuildPhaseUI() {
    // Auto start wave toggle
    let toggleColor = autoStartWaves ? [50, 150, 50] : [80, 80, 80];
    fill(toggleColor);
    stroke(COLORS.ui);
    strokeWeight(1);
    rect(width - 120, height - 85, 100, 25);

    fill(COLORS.ui);
    textAlign(CENTER, CENTER);
    textSize(10);
    text(autoStartWaves ? "AUTO: ON" : "AUTO: OFF", width - 70, height - 72);

    // Start wave button
    fill(50, 150, 50);
    stroke(COLORS.ui);
    strokeWeight(2);
    rect(width - 120, height - 50, 100, 30);

    fill(COLORS.ui);
    textAlign(CENTER, CENTER);
    textSize(14);
    if (autoStartWaves && autoStartTimer > 0) {
        let seconds = Math.ceil(autoStartTimer / 60);
        text(`AUTO START (${seconds}s)`, width - 70, height - 35);
    } else {
        text("START WAVE", width - 70, height - 35);
    }
}

function drawGameOverScreen() {
    // Semi-transparent overlay
    fill(0, 0, 0, 200);
    rect(0, 0, width, height);

    // Game over text
    fill(255, 100, 100);
    textAlign(CENTER, CENTER);
    textSize(48);
    text("STATION DESTROYED", width/2, height/2 - 50);

    fill(COLORS.ui);
    textSize(24);
    text(`Wave Reached: ${waveNumber}`, width/2, height/2);
    text(`Final Score: ${points}`, width/2, height/2 + 40);

    textSize(16);
    text("Press R to restart", width/2, height/2 + 80);
}

function drawVictoryScreen() {
    // Semi-transparent overlay
    fill(0, 0, 0, 200);
    rect(0, 0, width, height);

    // Victory text
    fill(100, 255, 100);
    textAlign(CENTER, CENTER);
    textSize(48);
    text("OUTPOST SECURED", width/2, height/2 - 50);

    fill(COLORS.ui);
    textSize(24);
    text("All waves defeated!", width/2, height/2);
    text(`Final Score: ${points}`, width/2, height/2 + 40);

    textSize(16);
    text("Press R to play again", width/2, height/2 + 80);
}

// --- Keyboard Controls ---
function keyPressed() {
    if (key === 'r' || key === 'R') {
        // Restart game
        location.reload();
    }
}

function spawnEnemy() {
    // Spawn enemy from random edge
    let angle = random(0, 360);
    let spawnDistance = 400;
    let x = CENTER_X + cos(radians(angle)) * spawnDistance;
    let y = CENTER_Y + sin(radians(angle)) * spawnDistance;

    enemies.push(new Enemy(x, y));
}

// Old mousePressed function removed - using the updated one below

function getSatelliteCost(type) {
    switch(type) {
        case "pylon": return 200;
        case "laser": return 75;
        case "missile": return 125;
        default: return 100;
    }
}

// --- Enemy Class ---
class Enemy {
    constructor(x, y, enemyType = "scout", waveNumber = 1) {
        this.x = x;
        this.y = y;
        this.targetX = CENTER_X;
        this.targetY = CENTER_Y;
        this.type = enemyType;
        this.waveNumber = waveNumber;
        this.reachedCenter = false;
        this.angle = 0;

        // Set stats based on enemy type and wave scaling
        this.setEnemyStats();
    }

    setEnemyStats() {
        // Base stats by type
        switch(this.type) {
            case "scout":
                this.speed = 2.0;
                this.health = 80;
                this.radius = 6;
                break;
            case "fighter":
                this.speed = 1.5;
                this.health = 120;
                this.radius = 8;
                break;
            case "heavy":
                this.speed = 1.0;
                this.health = 200;
                this.radius = 10;
                break;
            case "stealth":
                this.speed = 2.5;
                this.health = 60;
                this.radius = 5;
                break;
            case "boss":
                this.speed = 0.8;
                this.health = 500;
                this.radius = 20;
                break;
            default:
                this.speed = 1.5;
                this.health = 100;
                this.radius = 8;
        }

        // Wave scaling: +15% health and +5% speed per wave
        let waveMultiplier = 1 + (this.waveNumber - 1) * 0.15;
        let speedMultiplier = 1 + (this.waveNumber - 1) * 0.05;

        this.health = Math.floor(this.health * waveMultiplier);
        this.maxHealth = this.health;
        this.speed *= speedMultiplier;

        // Boss enemies get extra scaling
        if (this.type === "boss") {
            this.health = Math.floor(this.health * (1 + this.waveNumber / 10));
            this.maxHealth = this.health;
        }
    }

    update() {
        // Move toward center
        let dx = this.targetX - this.x;
        let dy = this.targetY - this.y;
        let distance = sqrt(dx * dx + dy * dy);

        if (distance > 50) { // Don't reach exact center
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        } else {
            this.reachedCenter = true;
            station.health -= 50; // Damage station
            perfectWave = false; // Mark wave as imperfect

            // Immediate game over check
            if (station.health <= 0) {
                station.health = 0;
                gameState = "gameover";
                console.log("Game Over! Station health reached 0");
            }
        }

        this.angle += 3; // Spinning motion
    }

    draw() {
        push();
        translate(this.x, this.y);
        rotate(radians(this.angle));

        // Enemy ship - color based on type
        let enemyColor = COLORS.enemy; // default red
        switch(this.type) {
            case "scout": enemyColor = [255, 150, 0]; break;     // orange
            case "fighter": enemyColor = [255, 0, 110]; break;   // red
            case "heavy": enemyColor = [150, 50, 150]; break;    // purple
            case "stealth": enemyColor = [100, 100, 100]; break; // gray
            case "boss": enemyColor = [255, 50, 50]; break;      // bright red
        }

        fill(enemyColor);
        stroke(enemyColor);
        strokeWeight(this.type === "boss" ? 3 : 1);

        // Main body - larger for boss
        let bodyScale = this.type === "boss" ? 1.5 : 1;
        ellipse(0, 0, this.radius * 2 * bodyScale, this.radius * 1.5 * bodyScale);

        // Wings
        triangle(-this.radius * bodyScale, 0, -this.radius * 1.5 * bodyScale, -this.radius * bodyScale, -this.radius * 1.5 * bodyScale, this.radius * bodyScale);

        // Engine glow - brighter for boss
        let glowColor = this.type === "boss" ? [255, 0, 0, 200] : [255, 100, 0, 150];
        fill(glowColor);
        noStroke();
        let glowSize = this.type === "boss" ? 8 : 4;
        ellipse(-this.radius * 0.8 * bodyScale, 0, glowSize, glowSize/2);

        // Boss crown indicator
        if (this.type === "boss") {
            fill(255, 255, 0);
            stroke(255, 255, 0);
            strokeWeight(2);
            // Draw crown above boss
            let crownY = -this.radius * 1.8;
            triangle(-8, crownY, 0, crownY - 10, 8, crownY);
            triangle(-4, crownY, 0, crownY - 6, 4, crownY);
        }

        pop();

        // Health bar
        if (this.health < this.maxHealth) {
            let barWidth = this.radius * 2;
            let barHeight = 3;
            let x = this.x - barWidth/2;
            let y = this.y - this.radius - 8;

            fill(50, 50, 50);
            noStroke();
            rect(x, y, barWidth, barHeight);

            let healthPercent = this.health / this.maxHealth;
            fill(255 * (1 - healthPercent), 255 * healthPercent, 0);
            rect(x, y, barWidth * healthPercent, barHeight);
        }
    }

    takeDamage(amount) {
        this.health -= amount;

        // Damage particle
        particles.push(new Particle(this.x, this.y, [255, 100, 100], 20));

        if (this.health <= 0) {
            // Death explosion
            for (let i = 0; i < 8; i++) {
                particles.push(new Particle(
                    this.x + random(-10, 10),
                    this.y + random(-10, 10),
                    COLORS.enemy,
                    40
                ));
            }

            // Award credits
            credits += 15;
        }
    }
}

// --- Projectile Classes ---
class LaserBeam {
    constructor(x, y, targetX, targetY, damage) {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.damage = damage;
        this.lifespan = 10;
        this.isDead = false;

        // Deal damage immediately
        this.dealDamage();
    }

    dealDamage() {
        // Find enemy at target location
        for (let enemy of enemies) {
            if (dist(this.targetX, this.targetY, enemy.x, enemy.y) < 15) {
                enemy.takeDamage(this.damage);
                break;
            }
        }
    }

    update() {
        this.lifespan--;
        if (this.lifespan <= 0) {
            this.isDead = true;
        }
    }

    draw() {
        if (this.lifespan > 0) {
            stroke(COLORS.projectile[0], COLORS.projectile[1], COLORS.projectile[2], this.lifespan * 25);
            strokeWeight(2);
            line(this.x, this.y, this.targetX, this.targetY);

            // Glow effect
            stroke(COLORS.projectile[0], COLORS.projectile[1], COLORS.projectile[2], this.lifespan * 10);
            strokeWeight(4);
            line(this.x, this.y, this.targetX, this.targetY);
        }
    }
}

class Missile {
    constructor(x, y, target, damage) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.damage = damage;
        this.speed = 3;
        this.isDead = false;
        this.angle = 0;
    }

    update() {
        if (this.target && this.target.health > 0) {
            // Home in on target
            let dx = this.target.x - this.x;
            let dy = this.target.y - this.y;
            let distance = sqrt(dx * dx + dy * dy);

            if (distance > 5) {
                this.x += (dx / distance) * this.speed;
                this.y += (dy / distance) * this.speed;
                this.angle = atan2(dy, dx);
            } else {
                // Hit target
                this.target.takeDamage(this.damage);
                this.explode();
                this.isDead = true;
            }
        } else {
            this.isDead = true;
        }
    }

    explode() {
        // Explosion particles
        for (let i = 0; i < 6; i++) {
            particles.push(new Particle(
                this.x + random(-5, 5),
                this.y + random(-5, 5),
                [255, 150, 0],
                30
            ));
        }
    }

    draw() {
        push();
        translate(this.x, this.y);
        rotate(this.angle);

        // Missile body
        fill(COLORS.projectile);
        stroke(COLORS.projectile);
        strokeWeight(1);
        rect(-4, -1, 8, 2);

        // Exhaust trail
        fill(255, 100, 0, 100);
        noStroke();
        ellipse(-6, 0, 4, 1);

        pop();
    }
}

// --- New Projectile Classes ---
class PlasmaCannon {
    constructor(x, y, target, damage) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.damage = damage;
        this.speed = 4;
        this.isDead = false;
        this.size = 8;
    }

    update() {
        if (this.target && this.target.health > 0) {
            let dx = this.target.x - this.x;
            let dy = this.target.y - this.y;
            let distance = sqrt(dx * dx + dy * dy);

            if (distance > 10) {
                this.x += (dx / distance) * this.speed;
                this.y += (dy / distance) * this.speed;
            } else {
                this.target.takeDamage(this.damage);
                this.explode();
                this.isDead = true;
            }
        } else {
            this.isDead = true;
        }
    }

    explode() {
        for (let i = 0; i < 10; i++) {
            particles.push(new Particle(
                this.x + random(-15, 15),
                this.y + random(-15, 15),
                [0, 245, 255],
                40
            ));
        }
    }

    draw() {
        push();
        translate(this.x, this.y);

        // Plasma core
        fill(0, 245, 255, 200);
        noStroke();
        ellipse(0, 0, this.size, this.size);

        // Plasma glow
        fill(0, 245, 255, 100);
        ellipse(0, 0, this.size * 2, this.size * 2);

        // Energy crackling
        stroke(255, 255, 255, 150);
        strokeWeight(1);
        for (let i = 0; i < 3; i++) {
            let angle1 = random(0, 360);
            let angle2 = angle1 + random(-90, 90);
            let x1 = cos(radians(angle1)) * this.size/2;
            let y1 = sin(radians(angle1)) * this.size/2;
            let x2 = cos(radians(angle2)) * this.size/2;
            let y2 = sin(radians(angle2)) * this.size/2;
            line(x1, y1, x2, y2);
        }

        pop();
    }
}

class TeslaChain {
    constructor(x, y, target, damage) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.damage = damage;
        this.chainTargets = [];
        this.lifespan = 20;
        this.isDead = false;
        this.maxChains = 3;

        // Deal damage immediately and find chain targets
        this.dealDamage();
    }

    dealDamage() {
        if (this.target && this.target.health > 0) {
            this.target.takeDamage(this.damage);
            this.chainTargets.push({x: this.target.x, y: this.target.y});

            // Find nearby enemies to chain to
            let chainDamage = Math.floor(this.damage * 0.7);
            let chainsLeft = this.maxChains;
            let lastTarget = this.target;

            while (chainsLeft > 0 && chainDamage > 10) {
                let nearestEnemy = null;
                let nearestDistance = 80; // Chain range

                for (let enemy of enemies) {
                    if (enemy !== lastTarget && enemy.health > 0) {
                        let distance = dist(lastTarget.x, lastTarget.y, enemy.x, enemy.y);
                        if (distance < nearestDistance) {
                            nearestEnemy = enemy;
                            nearestDistance = distance;
                        }
                    }
                }

                if (nearestEnemy) {
                    nearestEnemy.takeDamage(chainDamage);
                    this.chainTargets.push({x: nearestEnemy.x, y: nearestEnemy.y});
                    lastTarget = nearestEnemy;
                    chainDamage = Math.floor(chainDamage * 0.7);
                    chainsLeft--;
                } else {
                    break;
                }
            }
        }
    }

    update() {
        this.lifespan--;
        if (this.lifespan <= 0) {
            this.isDead = true;
        }
    }

    draw() {
        if (this.chainTargets.length === 0) return;

        stroke(200, 200, 255, (this.lifespan / 20) * 255);
        strokeWeight(3);

        // Draw chain from source to first target
        this.drawLightning(this.x, this.y, this.chainTargets[0].x, this.chainTargets[0].y);

        // Draw chains between targets
        for (let i = 1; i < this.chainTargets.length; i++) {
            let prev = this.chainTargets[i - 1];
            let curr = this.chainTargets[i];
            strokeWeight(2);
            this.drawLightning(prev.x, prev.y, curr.x, curr.y);
        }
    }

    drawLightning(x1, y1, x2, y2) {
        let segments = 5;
        let prevX = x1;
        let prevY = y1;

        for (let i = 1; i <= segments; i++) {
            let progress = i / segments;
            let currentX = lerp(x1, x2, progress) + random(-5, 5);
            let currentY = lerp(y1, y2, progress) + random(-5, 5);

            if (i === segments) {
                currentX = x2;
                currentY = y2;
            }

            line(prevX, prevY, currentX, currentY);
            prevX = currentX;
            prevY = currentY;
        }
    }
}

class ShieldParticle {
    constructor(x, y, lifespan) {
        this.x = x;
        this.y = y;
        this.lifespan = lifespan;
        this.maxLifespan = lifespan;
        this.size = 12; // Larger for better collision
        this.isDead = false;
        this.health = 75; // Reduced shield durability for better balance
        this.maxHealth = 75;
        this.blockRadius = 15; // Area that blocks enemies
    }

    update() {
        this.lifespan--;

        // Check collisions with enemies
        this.checkEnemyCollisions();

        // Die if lifespan expires or health depleted
        if (this.lifespan <= 0 || this.health <= 0) {
            this.isDead = true;
        }
    }

    checkEnemyCollisions() {
        // Block enemies from passing through
        for (let enemy of enemies) {
            let distance = dist(this.x, this.y, enemy.x, enemy.y);

            if (distance < this.blockRadius + enemy.radius) {
                // Push enemy away from shield
                let angle = atan2(enemy.y - this.y, enemy.x - this.x);
                let pushDistance = (this.blockRadius + enemy.radius) - distance + 2;

                enemy.x += cos(angle) * pushDistance * 0.3; // Reduced push force
                enemy.y += sin(angle) * pushDistance * 0.3;

                // Slow down enemy based on shield strength
                let slowFactor = 0.7 + (this.health / this.maxHealth) * 0.2; // 0.7-0.9 speed
                enemy.speed *= slowFactor;

                // Calculate damage based on enemy type and size
                let baseDamage = 5; // Increased base damage
                let enemyDamageMultiplier = 1;

                switch(enemy.type) {
                    case "scout": enemyDamageMultiplier = 0.8; break;    // 4 damage/frame
                    case "fighter": enemyDamageMultiplier = 1.0; break;  // 5 damage/frame
                    case "heavy": enemyDamageMultiplier = 2.0; break;    // 10 damage/frame
                    case "stealth": enemyDamageMultiplier = 0.6; break;  // 3 damage/frame
                    case "boss": enemyDamageMultiplier = 4.0; break;     // 20 damage/frame
                    default: enemyDamageMultiplier = 1.0;
                }

                // Apply wave scaling - stronger enemies in later waves do more damage
                let waveMultiplier = 1 + (enemy.waveNumber - 1) * 0.1; // +10% per wave

                let totalDamage = baseDamage * enemyDamageMultiplier * waveMultiplier;
                this.health -= totalDamage;

                // Shield impact particles - more intense for stronger enemies
                if (frameCount % Math.max(2, 8 - Math.floor(enemyDamageMultiplier * 2)) === 0) {
                    let particleIntensity = Math.min(3, Math.floor(enemyDamageMultiplier));
                    for (let i = 0; i < particleIntensity; i++) {
                        particles.push(new Particle(
                            this.x + random(-5, 5),
                            this.y + random(-5, 5),
                            [100, 255, 255],
                            15 + enemyDamageMultiplier * 5
                        ));
                    }
                }

                // Screen shake effect for heavy damage
                if (totalDamage > 8) {
                    // Could add screen shake here if implemented
                }

                console.log(`${enemy.type} (Wave ${enemy.waveNumber}) dealing ${totalDamage.toFixed(1)} damage to shield`);
            }
        }
    }

    draw() {
        let healthPercent = this.health / this.maxHealth;
        let alpha = Math.min((this.lifespan / this.maxLifespan), healthPercent) * 150;

        // Main shield bubble - intensity based on health
        fill(100, 255, 255, alpha);
        stroke(150, 255, 255, alpha);
        strokeWeight(healthPercent > 0.5 ? 2 : 1);
        ellipse(this.x, this.y, this.size * healthPercent, this.size * healthPercent);

        // Shield hexagon
        noFill();
        stroke(100 + healthPercent * 155, 255, 255, alpha);
        this.drawHexagon(this.x, this.y, (this.size / 2) * healthPercent);

        // Health indicator - red tint when damaged
        if (healthPercent < 0.7) {
            fill(255, 100, 100, (1 - healthPercent) * 100);
            noStroke();
            ellipse(this.x, this.y, this.size * 0.8, this.size * 0.8);
        }
    }

    drawHexagon(x, y, size) {
        beginShape();
        for (let i = 0; i < 6; i++) {
            let angle = (i * 60) - 90;
            let px = x + cos(radians(angle)) * size;
            let py = y + sin(radians(angle)) * size;
            vertex(px, py);
        }
        endShape(CLOSE);
    }
}

class FloatingText {
    constructor(x, y, text, color, lifespan) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.color = color;
        this.lifespan = lifespan;
        this.maxLifespan = lifespan;
        this.vy = -1;
        this.isDead = false;
    }

    update() {
        this.y += this.vy;
        this.lifespan--;
        if (this.lifespan <= 0) {
            this.isDead = true;
        }
    }

    draw() {
        let alpha = (this.lifespan / this.maxLifespan) * 255;
        fill(this.color[0], this.color[1], this.color[2], alpha);
        textAlign(CENTER, CENTER);
        textSize(14);
        text(this.text, this.x, this.y);
    }
}

// --- Particle Class ---
class Particle {
    constructor(x, y, color, lifespan) {
        this.x = x;
        this.y = y;
        this.vx = random(-2, 2);
        this.vy = random(-2, 2);
        this.color = color;
        this.lifespan = lifespan;
        this.maxLifespan = lifespan;
        this.size = random(2, 6);
        this.isDead = false;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.98;
        this.vy *= 0.98;

        this.lifespan--;
        if (this.lifespan <= 0) {
            this.isDead = true;
        }
    }

    draw() {
        let alpha = (this.lifespan / this.maxLifespan) * 255;
        fill(this.color[0], this.color[1], this.color[2], alpha);
        noStroke();
        ellipse(this.x, this.y, this.size * (this.lifespan / this.maxLifespan), this.size * (this.lifespan / this.maxLifespan));
    }
}

// --- Wave System Functions ---
function updateWaveSystem() {
    if (gameState === "build") {
        // Handle auto start timer
        if (autoStartWaves && autoStartTimer > 0) {
            autoStartTimer -= gameSpeed;
            if (autoStartTimer <= 0) {
                startNextWave();
                console.log("Auto starting next wave!");
            }
        }
        return;
    } else if (gameState === "wave") {
        if (enemiesSpawned < enemiesPerWave) {
            // Use gameSpeed for spawn timing, with progressive difficulty
            let baseSpawnRate = Math.max(20, 60 - Math.floor(waveNumber / 10) * 5); // Gets faster every 10 waves
            if (frameCount % Math.max(5, Math.floor(baseSpawnRate / gameSpeed)) === 0) {
                spawnWaveEnemy();
                enemiesSpawned++;
            }
        }
        if (enemiesSpawned >= enemiesPerWave && enemies.length === 0) {
            // Calculate rewards for completed wave BEFORE incrementing
            let completedWave = waveNumber;
            credits += 50 + completedWave * 10;

            // Base points for wave completion
            let wavePoints = 100;

            // Only give wave multiplier bonus for perfect waves (no enemies reached center)
            if (perfectWave) {
                wavePoints += completedWave * 20;
                console.log(`Perfect wave ${completedWave}! Bonus points awarded.`);
            } else {
                console.log(`Wave ${completedWave} completed, but enemies reached the center. No bonus.`);
            }

            // Subtract points for each satellite built (encourages efficiency)
            let totalSatellites = satellites.length;
            let satellitePenalty = totalSatellites * 5; // 5 points penalty per satellite
            wavePoints = Math.max(0, wavePoints - satellitePenalty); // Don't go below 0

            if (totalSatellites > 0) {
                console.log(`${totalSatellites} satellites built: -${satellitePenalty} points penalty`);
            }

            points += wavePoints;

            waveNumber++;
            if (waveNumber > totalWaves) {
                gameState = "victory";
            } else {
                gameState = "build";
                generateWavePreview();

                // Start auto start timer if enabled
                if (autoStartWaves) {
                    autoStartTimer = autoStartDelay;
                }
            }
        }
    }
}

function spawnWaveEnemy() {
    let enemyType = "scout";

    // Check if this is a boss wave (every 10th wave)
    if (waveNumber % 10 === 0) {
        enemyType = "boss";
    } else {
        for (let enemyGroup of currentWaveEnemies) {
            if (enemyGroup.count > 0) {
                enemyType = enemyGroup.type;
                enemyGroup.count--;
                break;
            }
        }
    }

    let angle = random(0, 360);
    let spawnDistance = 400;
    let x = CENTER_X + cos(radians(angle)) * spawnDistance;
    let y = CENTER_Y + sin(radians(angle)) * spawnDistance;
    enemies.push(new Enemy(x, y, enemyType, waveNumber));
}

function startNextWave() {
    if (gameState === "build") {
        // Skip preview, start wave immediately
        gameState = "wave";
        enemiesSpawned = 0;
        enemiesKilled = 0; // Reset enemies killed counter
        perfectWave = true; // Reset perfect wave tracker
        console.log(`Starting Wave ${waveNumber} immediately!`);
    }
}

// --- Mouse Interaction ---
function mousePressed() {
    // Check satellite selection buttons
    let buttonHeight = 42; // Match the drawing height
    let buttonSpacing = 3;
    let startY = 100;

    if (mouseX >= 20 && mouseX <= 160) { // Updated width to match new button width (20 + 140)
        for (let i = 0; i < 5; i++) {
            let y = startY + i * (buttonHeight + buttonSpacing);
            if (mouseY >= y && mouseY <= y + buttonHeight) {
                let types = ["pylon", "laser", "missile", "tesla", "shield"];

                // NEW WORKFLOW: If we have a selected slot, place the satellite there
                if (selectedSlotRing && selectedSlotIndex !== null) {
                    let cost = getSatelliteCost(types[i]);
                    if (credits >= cost) {
                        credits -= cost;
                        let satellite = new Satellite(types[i], selectedSlotRing, selectedSlotIndex);
                        selectedSlotRing.addSatellite(satellite);

                        // Update energy
                        if (types[i] === "pylon") {
                            energyCapacity += 75;
                        } else {
                            energyUsed += satellite.energyCost;
                        }

                        console.log(`Placed ${types[i]} on Ring ${selectedSlotRing.number} Slot ${selectedSlotIndex}`);

                        // Clear selections and highlight the new satellite
                        selectedSlotRing = null;
                        selectedSlotIndex = null;
                        selectedSatellite = satellite;
                        highlightedSatellite = satellite;
                        selectedSatelliteType = null;
                    } else {
                        console.log("Not enough credits!");
                    }
                } else {
                    // Old workflow: just select the satellite type
                    selectedSatelliteType = types[i];
                    selectedSatellite = null;
                    highlightedSatellite = null;
                    console.log("Selected satellite type:", selectedSatelliteType);
                }
                return;
            }
        }
    }

    // Check ring unlock button
    let lockedRings = orbitalRings.filter(ring => !ring.unlocked);
    if (lockedRings.length > 0) {
        let nextRing = lockedRings[0];
        let buttonY = height - 55;

        if (mouseX >= 20 && mouseX <= 200 && mouseY >= buttonY && mouseY <= buttonY + 25) {
            if (credits >= nextRing.unlockCost) {
                credits -= nextRing.unlockCost;
                nextRing.unlocked = true;
                console.log(`Unlocked Ring ${nextRing.number}`);
                return;
            }
        }
    }

    // Check station upgrade button
    if (station.level < 5) {
        let upgradeCost = station.getUpgradeCost();
        if (mouseX >= width - 200 && mouseX <= width - 20 &&
            mouseY >= 90 && mouseY <= 115 && credits >= upgradeCost) {
            station.upgrade();
            console.log(`Upgraded station to level ${station.level}`);
            return;
        }
    }

    // Check satellite upgrade button
    if (selectedSatellite && selectedSatellite.level < 3) {
        let upgradeCost = selectedSatellite.getUpgradeCost();
        if (mouseX >= width - 200 && mouseX <= width - 20 &&
            mouseY >= 120 && mouseY <= 145 && credits >= upgradeCost) {
            selectedSatellite.upgrade();
            console.log(`Upgraded satellite to level ${selectedSatellite.level}`);
            return;
        }
    }

    // Check AUTO START toggle button
    if (gameState === "build") {
        if (mouseX >= width - 120 && mouseX <= width - 20 &&
            mouseY >= height - 85 && mouseY <= height - 60) {
            autoStartWaves = !autoStartWaves;
            console.log("Auto start waves:", autoStartWaves ? "ON" : "OFF");
            return;
        }
    }

    // Check START WAVE button
    if (gameState === "build") {
        if (mouseX >= width - 120 && mouseX <= width - 20 &&
            mouseY >= height - 50 && mouseY <= height - 20) {
            startNextWave();
            console.log("Starting next wave!");
            return;
        }
    }

    // Check speed control buttons - centered at top
    let speedY = 25;
    let speedButtonWidth = 35;
    let speedButtonHeight = 20;
    let speedButtonSpacing = 5;

    // Calculate total width for centering (same as in drawSpeedControl)
    let totalWidth = gameSpeedOptions.length * speedButtonWidth + (gameSpeedOptions.length - 1) * speedButtonSpacing;
    let startX = (width - totalWidth) / 2;

    for (let i = 0; i < gameSpeedOptions.length; i++) {
        let x = startX + i * (speedButtonWidth + speedButtonSpacing);
        if (mouseX >= x && mouseX <= x + speedButtonWidth &&
            mouseY >= speedY - 10 && mouseY <= speedY + 10) {
            currentSpeedIndex = i;
            gameSpeed = gameSpeedOptions[i];
            console.log(`Game speed set to ${gameSpeed}x`);
            return;
        }
    }

    // NEW SLOT-FIRST WORKFLOW: Select slot first, then choose satellite type (allow during any game state)
    if (gameState === "build" || gameState === "wave") {
        let mouseDistance = dist(mouseX, mouseY, CENTER_X, CENTER_Y);

        for (let ring of orbitalRings) {
            if (ring.unlocked && abs(mouseDistance - ring.radius) < 40) {
                // Find closest slot to mouse click
                let closestSlot = -1;
                let closestDistance = 30; // Click tolerance

                for (let i = 0; i < ring.slots; i++) {
                    let pos = ring.getSlotPosition(i);
                    let distance = dist(mouseX, mouseY, pos.x, pos.y);
                    if (distance < closestDistance) {
                        closestSlot = i;
                        closestDistance = distance;
                    }
                }

                if (closestSlot !== -1) {
                    let existingSatellite = ring.satellites.find(sat => sat.slotIndex === closestSlot);

                    if (existingSatellite) {
                        // Select existing satellite for upgrades/info
                        selectedSatellite = existingSatellite;
                        highlightedSatellite = existingSatellite;
                        selectedSatelliteType = null;
                        selectedSlotRing = null;
                        selectedSlotIndex = null;
                        console.log(`Selected satellite: ${existingSatellite.type} Level ${existingSatellite.level}`);
                    } else {
                        // Select empty slot - player will then choose satellite type
                        selectedSlotRing = ring;
                        selectedSlotIndex = closestSlot;
                        selectedSatellite = null;
                        highlightedSatellite = null;
                        selectedSatelliteType = null;
                        console.log(`Selected empty slot ${closestSlot} on Ring ${ring.number} - now choose a satellite type`);
                    }
                }
                return;
            }
        }

        // If clicking elsewhere, clear selections
        selectedSlotRing = null;
        selectedSlotIndex = null;
        selectedSatellite = null;
        highlightedSatellite = null;
        selectedSatelliteType = null;
    }
}

function getSatelliteCost(type) {
    switch(type) {
        case "pylon": return 200;
        case "laser": return 75;
        case "missile": return 125;
        case "tesla": return 150;
        case "shield": return 175;
        default: return 100;
    }
}

// Update all time-based systems to use gameSpeed
function updateGameWithSpeed() {
    // Update station
    station.update();

    // Update orbital rings
    for (let ring of orbitalRings) {
        ring.update();
    }

    // Update satellites with speed multiplier
    for (let satellite of satellites) {
        // Apply speed to fire timers
        if (satellite.fireTimer > 0) {
            satellite.fireTimer = Math.max(0, satellite.fireTimer - gameSpeed);
        }
        satellite.update();
    }

    // Update enemies with speed multiplier
    for (let i = enemies.length - 1; i >= 0; i--) {
        // Apply speed to movement
        for (let s = 0; s < gameSpeed; s++) {
            enemies[i].update();
        }
        if (enemies[i].health <= 0 || enemies[i].reachedCenter) {
            // Count killed enemies (not ones that reached center)
            if (enemies[i].health <= 0) {
                enemiesKilled++;
            }
            enemies.splice(i, 1);
        }
    }

    // Update projectiles with speed multiplier
    for (let i = projectiles.length - 1; i >= 0; i--) {
        for (let s = 0; s < gameSpeed; s++) {
            projectiles[i].update();
        }
        if (projectiles[i].isDead) {
            projectiles.splice(i, 1);
        }
    }
}