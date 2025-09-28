# Medieval Tower Defense

A medieval-themed tower defense game built with p5.js, featuring multiple difficulty levels, various tower types, and engaging wave-based gameplay.

## 🎮 Play the Game

The game is deployed on GitHub Pages: [Play Medieval Tower Defense](https://jparry.github.io/my-tower-defense/)

## 🏰 Game Features

### Difficulty Levels
- **Easy**: Longer path with more turns, slower enemies, more starting gold (600g)
- **Medium**: Balanced gameplay with standard settings (500g starting gold)
- **Hard**: Shorter path, faster enemies, less starting gold (400g)

### Tower Types
- **Archer Tower**: Fast firing rate with moderate damage - great for swarms
- **Mage Tower**: Magical attacks with special effects and good range
- **Cannon Tower**: High damage, explosive projectiles with area effect
- **Barracks**: Defensive structure that can block enemy movement

### Gameplay Mechanics
- **10 Progressive Waves**: Each wave increases in difficulty
- **Multiple Enemy Types**: Normal, fast, tank, and boss enemies
- **Tower Upgrades**: Improve damage, range, and special abilities
- **Resource Management**: Balance gold spending between new towers and upgrades
- **Perfect Wave Bonus**: Extra points for completing waves without enemy leaks
- **Dynamic Scoring**: Points system that rewards skilled play

## 🎯 How to Play

1. **Choose Difficulty**: Select Easy, Medium, or Hard mode
2. **Build Phase**: Place towers strategically along the enemy path
3. **Wave Combat**: Start waves and watch your towers defend
4. **Upgrade**: Enhance existing towers between waves
5. **Survive**: Complete all 10 waves to achieve victory

### Controls
- **Mouse**: Select towers, place buildings, navigate menus
- **R**: Restart game and return to difficulty selection
- **D**: Toggle debug mode for development
- **Speed Controls**: Adjust game speed during waves (1x, 2x, 3x)

## 🛠️ Technical Details

### Built With
- **p5.js** - Creative coding library for graphics and interaction
- **Vanilla JavaScript** - Core game logic and mechanics
- **HTML5 Canvas** - Rendering and animation

### Game Architecture
- Object-oriented design with separate classes for:
  - `Tower` - Tower management and combat
  - `Enemy` - Enemy behavior and pathfinding
  - `WaveManager` - Wave progression and spawning
  - `DifficultySelector` - Game difficulty configuration

### Features
- Grid-based tower placement system
- Pathfinding with waypoint navigation
- Particle effects for visual feedback
- Tooltip system for UI guidance
- Responsive canvas sizing
- Real-time performance optimization

## 🏗️ Development

### Local Setup
1. Clone the repository
2. Open `index.html` in a web browser
3. No build process required - runs directly in browser

### File Structure
```
my-tower-defense/
├── index.html      # Game entry point and p5.js setup
├── sketch.js       # Complete game logic and rendering
└── README.md       # This file
```

### Key Game Systems
- **Wave System**: Progressive difficulty with 10 challenging waves
- **Economy**: Gold-based resource management with wave rewards
- **Combat**: Real-time projectile physics and collision detection
- **UI/UX**: Intuitive tower selection and upgrade interface

## 🎨 Game Design

The game features a medieval aesthetic with:
- Hand-drawn style tower and enemy graphics
- Strategic grid-based gameplay
- Balanced difficulty progression
- Visual feedback for all player actions

## 📈 Scoring System

- Base points for enemy elimination
- Wave completion bonuses
- Perfect wave bonuses (no enemy leaks)
- Difficulty multipliers for higher scores on harder modes

## 🔧 Debug Features

Toggle debug mode with 'D' to access:
- Enemy health bars and stats
- Tower range indicators
- Performance metrics
- Grid overlay visualization

---

Enjoy defending your medieval realm! 🏰⚔️