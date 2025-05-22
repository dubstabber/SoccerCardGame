# Soccer Card Game 🎮⚽

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen.svg)](https://dubstabber.github.io/SoccerCardGame/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow.svg)](https://www.ecma-international.org/ecma-262/6.0/)
[![SASS](https://img.shields.io/badge/SASS-1.62.1-ff69b4.svg)](https://sass-lang.com/)
[![Mobile Friendly](https://img.shields.io/badge/responsive-yes-blue.svg)](https://dubstabber.github.io/SoccerCardGame/)

A modern, strategic card game built with vanilla JavaScript and ES6 modules. Players compete against an AI opponent to score the most goals in a soccer-themed card battle.

![Soccer Card Game Screenshot](img/soccer-bg.jpg)

## ✨ Features

- **Modern Architecture**: Built with ES6 modules and classes for better code organization and maintainability
- **Responsive Design**: Fully playable on desktop, tablet, and mobile devices
- **Touch Support**: Intuitive touch controls for mobile gameplay
- **Rich Animations**: Smooth transitions and visual feedback enhance the gaming experience
- **Strategic Gameplay**: Match cards strategically to score goals and defend against the AI
- **Audio Feedback**: Sound effects provide immersive gameplay

## 🎮 How to Play

1. **Objective**: Score more goals than the AI across two rounds
2. **Card Types**:
   - **Attack Cards**: Used to score goals (your offensive move)
   - **Goal Cards**: Used to defend against attacks (your defensive move)
3. **Gameplay**:
   - Take turns with the AI playing cards
   - An attack card scores a goal unless the opponent has a matching color goal card
   - Match the color of the AI's attack card with your goal card to defend
4. **Winning**: The player with the most goals at the end of two rounds wins

## 🚀 Live Demo

Try the game: [Soccer Card Game Live Demo](https://dubstabber.github.io/SoccerCardGame/)

## 🛠️ Technologies Used

- **Vanilla JavaScript** with ES6+ features
- **ES6 Modules** for code organization
- **SASS/SCSS** for structured styling
- **Responsive Design** techniques
- **Touch Events API** for mobile support
- **CSS Animations** for visual effects
- **Audio API** for sound effects

## 🏗️ Architecture

The project follows a modular architecture with clear separation of concerns:

- **GameManager**: Coordinates game flow and player/AI interactions
- **Deck**: Manages card collections and finding specific cards
- **Card**: Represents individual cards with their properties and behaviors
- **AssetLoader**: Handles preloading of images and audio resources
- **AudioManager**: Controls sound playback and volume settings

## 📱 Responsive Design

The game adapts seamlessly to different screen sizes:

- **Desktop**: Full-size cards and game board
- **Tablet**: Optimized layout with appropriately sized elements
- **Mobile**: Touch-friendly interface with properly scaled cards and controls

## 🔧 Development

### Prerequisites

- Node.js (v14+)
- npm (v6+)

### Installation

```bash
# Clone the repository
git clone https://github.com/dubstabber/SoccerCardGame.git
cd SoccerCardGame

# Install dependencies
npm install
```

### Development Commands

```bash
# Compile SASS and watch for changes
npm run watch:sass

# Build production assets
npm run build

# Start local development server
npm start

# Run ESLint
npm run lint
```

## 🔍 Future Improvements

- Add difficulty levels for AI opponents
- Implement multiplayer support
- Add more card types and special abilities
- Create tournament mode
- Add persistent statistics tracking
