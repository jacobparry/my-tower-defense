# Tower Defense Collection

A collection of tower defense games built with p5.js, featuring unique mechanics, progressive difficulty, and engaging gameplay across different themes and settings.

## 🎮 Play the Games

The collection is deployed on GitHub Pages: [Play Tower Defense Collection](https://jparry.github.io/my-tower-defense/)

Choose your battlefield:
- **🏰 Medieval Defense**: Classic path-based tower defense
- **🚀 Galactic Outpost**: Revolutionary orbital mechanics system

## 🏰 Medieval Tower Defense

### Game Features
- **3 Difficulty Levels**: Easy, Medium, and Hard with different paths and resources
- **4 Tower Types**: Archer, Mage, Cannon, and Barracks with unique abilities
- **10 Progressive Waves**: Increasing difficulty with multiple enemy types
- **Strategic Gameplay**: Path-based defense with upgrade system

### Tower Types
- **Archer Tower**: Fast firing rate, great for swarms
- **Mage Tower**: Magical attacks with special effects
- **Cannon Tower**: High damage explosive projectiles
- **Barracks**: Defensive structures that block enemy movement

## 🚀 Galactic Outpost (Space Tower Defense)

### Revolutionary Orbital System
- **360° Radial Defense**: Enemies attack from all directions
- **Orbital Mechanics**: All towers rotate around your space station
- **3 Orbital Rings**: Expandable slots for satellite deployment
- **Power Grid Management**: Energy-based resource system

### Satellite Types
- **⚡ Power Pylon**: Generates energy for other towers (upgrades: 75→100→125 energy)
- **🔴 Laser Satellite**: Fast, precise targeting for swarms
- **🚀 Missile Platform**: High damage explosive projectiles
- **⚡ Tesla Coil**: Chain lightning attacks multiple enemies
- **🛡️ Shield Generator**: Creates physical barriers that block enemies

### Advanced Features
- **1000 Progressive Waves**: Epic campaign with scaling difficulty
- **Boss Waves**: Every 10th wave features powerful crowned bosses
- **Speed Controls**: 0x (Pause), 1x, 5x, 10x with full system integration
- **Mid-Wave Building**: Strategic satellite deployment during combat
- **Auto-Start Waves**: Optional automatic wave progression
- **Comprehensive Tooltips**: Detailed information for all towers and upgrades

### Enemy Types
- **🟠 Scout**: Fast, weak enemies (orange)
- **🔴 Fighter**: Balanced enemies (red)
- **🟣 Heavy**: Slow, tough enemies (purple)
- **⚫ Stealth**: Very fast, weak enemies (gray)
- **👑 Boss**: Massive enemies with crowns (bright red) - every 10th wave

### Unique Mechanics
- **Shield System**: Barriers physically block enemies and absorb damage
- **Wave Scaling**: +15% health, +5% speed per wave for all enemies
- **Perfect Wave Bonuses**: Extra points for no enemy leaks
- **Satellite Efficiency**: Fewer satellites = higher scores
- **Energy Management**: Balance power generation and consumption

## 🎯 How to Play

### Medieval Defense
1. Choose difficulty level
2. Place towers along enemy paths
3. Start waves and defend your realm
4. Upgrade towers between waves
5. Survive all 10 waves

### Galactic Outpost
1. Select orbital slots by clicking them
2. Choose satellite type to place
3. Manage energy with power pylons
4. Use speed controls and pause for strategy
5. Deploy shields to block enemy advances
6. Survive 1000 progressively harder waves

### Universal Controls
- **Mouse**: Select, build, upgrade, navigate
- **Speed Controls**: Adjust game tempo
- **Pause**: Strategic planning during waves
- **Tooltips**: Hover/select for detailed information

## 🛠️ Technical Details

### Built With
- **p5.js** - Creative coding library for graphics and interaction
- **Vanilla JavaScript** - Core game logic and mechanics
- **HTML5 Canvas** - Rendering and animation

### Architecture
- **Object-Oriented Design**: Separate classes for game systems
- **Modular Structure**: Independent game implementations
- **Shared UI Systems**: Common interface patterns
- **Performance Optimized**: Efficient collision detection and rendering

### Game Systems

#### Medieval Defense
- Grid-based tower placement
- Pathfinding with waypoint navigation
- Wave-based enemy spawning
- Gold economy system

#### Galactic Outpost
- Orbital mechanics with trigonometric positioning
- Dual-resource economy (credits + energy)
- Real-time collision detection for shields
- Multi-speed game state management
- Progressive difficulty scaling over 1000 waves

## 🏗️ Development

### Local Setup
1. Clone the repository
2. Open `index.html` in a web browser
3. No build process required - runs directly in browser

### File Structure
```
my-tower-defense/
├── index.html                 # Game selection hub
├── games/
│   ├── medieval/
│   │   ├── medieval.html      # Medieval game entry
│   │   └── medieval.js        # Medieval game logic
│   └── space/
│       ├── space.html         # Space game entry
│       └── space.js           # Space game logic (~2000+ lines)
└── README.md                  # This file
```

### Key Technical Features
- **Particle Systems**: Visual effects and feedback
- **Collision Detection**: Precise hit detection for all projectiles
- **State Management**: Complex game state transitions
- **Performance Optimization**: Efficient rendering and updates
- **Responsive Design**: Adaptive UI layouts

## 🎨 Game Design Philosophy

### Medieval Defense
- Classic tower defense mechanics
- Strategic path-based gameplay
- Medieval aesthetic with fantasy elements
- Balanced progression system

### Galactic Outpost
- Innovative orbital mechanics
- 360-degree strategic thinking
- Sci-fi aesthetic with particle effects
- Deep progression over 1000 waves
- Multi-layered resource management

## 📈 Scoring Systems

### Medieval Defense
- Enemy elimination points
- Wave completion bonuses
- Perfect wave multipliers
- Difficulty-based scoring

### Galactic Outpost
- Base points: 100 per wave
- Perfect wave bonus: +wave×20 (only if no enemies reach center)
- Satellite efficiency penalty: -5 points per satellite built
- Progressive scaling: Higher waves = higher potential scores

## 🎮 Game Balance

### Progressive Difficulty
- **Medieval**: 10 waves with increasing enemy variety
- **Space**: 1000 waves with exponential scaling

### Resource Management
- **Medieval**: Gold-based economy
- **Space**: Dual economy (credits for building, energy for operation)

### Strategic Depth
- **Medieval**: Path control and chokepoints
- **Space**: Energy management and orbital positioning

---

## 🌟 Future Enhancements

- Additional tower types and abilities
- More enemy varieties and behaviors
- Achievement systems
- Leaderboards and score tracking
- Additional game modes

---

Defend your realms across time and space! 🏰🚀✨