# 🎭 Troll Game

A fun prank game where you have to beat the troll!

## Features

- 5 Levels with different troll mechanics
- Combo/Multiplier system (up to ×5)
- Score tracking with high score
- Level Select screen
- Stats/Leaderboard
- Floating particle animations
- Pulsing buttons

## How to Play

1. **Level 1**: Find the secret button hidden in the corner
2. **Level 2**: Don't follow instructions - touch RED not GREEN
3. **Level 3**: Catch the moving button
4. **Level 4**: Solve the math trick (2+2 = 3, not 4!)
5. **Level 5**: Wait for the countdown, then click!

## Installation

```bash
npm install
npx expo start
```

## Build APK

```bash
npx expo prebuild --platform android
cd android
./gradlew assembleDebug
```

## Tech Stack

- React Native (Expo)
- React Navigation
- Animated API
