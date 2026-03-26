import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, Alert, Dimensions, Animated, Easing, Image, TextInput, Switch, Vibration } from 'react-native';

const Stack = createNativeStackNavigator();
const { width, height } = Dimensions.get('window');

const GameContext = createContext();

const ACHIEVEMENTS = [
  { id: 'first_win', name: 'First Victory', desc: 'Complete any level', icon: '🎉' },
  { id: 'troll_master', name: 'Troll Master', desc: 'Complete all 10 levels', icon: '👑' },
  { id: 'speed_demon', name: 'Speed Demon', desc: 'Complete Time Attack', icon: '⚡' },
  { id: 'combo_king', name: 'Combo King', desc: 'Get 10x combo', icon: '🔥' },
  { id: 'perfectionist', name: 'Perfectionist', desc: 'Score 1500+ points', icon: '💯' },
  { id: 'lucky_finder', name: 'Lucky Finder', desc: 'Find all secret spots', icon: '🍀' },
  { id: 'daily_champion', name: 'Daily Champion', desc: 'Complete Daily Challenge', icon: '📅' },
  { id: 'survivor', name: 'Survivor', desc: 'Complete Endless Mode', icon: '♾️' },
  { id: 'theme_explorer', name: 'Theme Explorer', desc: 'Try all themes', icon: '🎨' },
  { id: 'boss_slayer', name: 'Boss Slayer', desc: 'Complete Boss Rush', icon: '⚔️' },
  { id: 'collector', name: 'Collector', desc: 'Unlock all skins', icon: '🏆' },
  { id: 'dedicated', name: 'Dedicated', desc: 'Play 50 times', icon: '💪' },
  { id: 'rich', name: 'Rich', desc: 'Collect 1000 coins', icon: '💰' },
];

const GAME_VERSION = '2.0.0';

const LEVELS_PREVIEW = {
  dark: { bg: '#1a1a2e', primary: '#f1c40f', secondary: '#e94560' },
  light: { bg: '#f5f5f5', primary: '#3498db', secondary: '#e74c3c' },
  neon: { bg: '#000000', primary: '#00ff00', secondary: '#ff00ff' },
  ocean: { bg: '#1a3a5c', primary: '#00d4ff', secondary: '#ff6b6b' },
};

const DAILY_CHALLENGES = [
  { title: 'Speed Run', desc: 'Complete 3 levels in 30s', type: 'speed' },
  { title: 'No Mistakes', desc: 'Complete without failing', type: 'perfect' },
  { title: 'Combo Master', desc: 'Get 5x combo', type: 'combo' },
];

const POWERUPS = [
  { id: 'shield', name: '🛡️ Shield', desc: 'One free mistake', cost: 100 },
  { id: 'time', name: '⏰ +10s', desc: 'Add 10 seconds', cost: 75 },
  { id: 'double', name: '2️⃣ 2x Points', desc: 'Double score', cost: 150 },
  { id: 'skip', name: '⏭️ Skip Level', desc: 'Skip current level', cost: 200 },
];

const SKINS = [
  { id: 'default', name: '😈 Default', unlockAt: 0, emoji: '😈' },
  { id: 'clown', name: '🤡 Clown', unlockAt: 500, emoji: '🤡' },
  { id: 'ghost', name: '👻 Ghost', unlockAt: 1000, emoji: '👻' },
  { id: 'alien', name: '👽 Alien', unlockAt: 1500, emoji: '👽' },
  { id: 'robot', name: '🤖 Robot', unlockAt: 2000, emoji: '🤖' },
  { id: 'dragon', name: '🐉 Dragon', unlockAt: 3000, emoji: '🐉' },
  { id: 'king', name: '👑 King', unlockAt: 5000, emoji: '👑' },
  { id: 'legend', name: '🦄 Legend', unlockAt: 10000, emoji: '🦄' },
];

const BOSSES = [
  { name: '😈 Mini Troll', hp: 3, emoji: '😈' },
  { name: '👹 Cave Troll', hp: 5, emoji: '👹' },
  { name: '💀 Death Troll', hp: 7, emoji: '💀' },
  { name: '👑 Troll King', hp: 10, emoji: '👑' },
];

const RANDOM_EVENTS = [
  { type: 'bonus', text: '🎁 Bonus! +50 Points', points: 50 },
  { type: 'combo', text: '🔥 Combo x2!', multiplier: 2 },
  { type: 'shield', text: '🛡️ Free Shield!', shield: true },
  { type: 'skip', text: '⏭️ Skip Next Level!', skip: true },
];

const LEVELS_PREVIEW = {
  1: { name: 'The Trap', difficulty: 'Easy', tip: 'Think outside the box!' },
  2: { name: 'Green Light', difficulty: 'Easy', tip: 'Break the rules!' },
  3: { name: 'Catch Me', difficulty: 'Medium', tip: 'Be patient!' },
  4: { name: 'Brain Test', difficulty: 'Medium', tip: 'Trust your gut!' },
  5: { name: 'Timing is Key', difficulty: 'Hard', tip: 'Wait for it...' },
  6: { name: 'Hidden Maze', difficulty: 'Hard', tip: 'Look everywhere!' },
  7: { name: 'Password', difficulty: 'Medium', tip: 'Think like a troll!' },
  8: { name: 'Boss Battle', difficulty: 'Expert', tip: 'Find the pattern!' },
  9: { name: 'Diamond Hunt', difficulty: 'Hard', tip: 'The golden one!' },
  10: { name: 'Memory Test', difficulty: 'Expert', tip: 'Watch carefully!' },
};

const DAILY_REWARDS = [
  { day: 1, coins: 50, prize: '🪙 50 Coins' },
  { day: 2, coins: 75, prize: '🪙 75 Coins' },
  { day: 3, coins: 100, prize: '🪙 100 Coins' },
  { day: 4, coins: 125, prize: '🪙 125 Coins' },
  { day: 5, coins: 150, prize: '🪙 150 Coins' },
  { day: 6, coins: 200, prize: '🪙 200 Coins' },
  { day: 7, coins: 500, prize: '🎁 Big Prize!' },
];

const SOUNDS = {
  click: () => Vibration.vibrate(50),
  success: () => Vibration.vibrate([0, 100, 50, 100]),
  fail: () => Vibration.vibrate([0, 200, 100, 200]),
  combo: () => Vibration.vibrate(30),
};

function useGame() {
  return useContext(GameContext);
}

function ParticleBackground() {
  const particles = [...Array(25)].map((_, i) => ({
    id: i,
    x: Math.random() * width,
    y: Math.random() * height,
    size: 10 + Math.random() * 30,
    duration: 3000 + Math.random() * 4000,
    color: ['#e94560', '#f1c40f', '#9b59b6', '#2ecc71', '#3498db'][Math.floor(Math.random() * 5)],
  }));

  return (
    <View style={styles.particlesContainer}>
      {particles.map((p) => (
        <FloatingParticle key={p.id} {...p} />
      ))}
    </View>
  );
}

function FloatingParticle({ x, y, size, duration, color }) {
  const anim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -50],
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: x,
          top: y,
          width: size,
          height: size,
          backgroundColor: color,
          transform: [{ translateY }],
        },
      ]}
    />
  );
}

function PulseAnimation({ children }) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.05,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return <Animated.View style={{ transform: [{ scale }] }}>{children}</Animated.View>;
}

function ShakeAnimation({ children, trigger }) {
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (trigger) {
      Animated.sequence([
        Animated.timing(translateX, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(translateX, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(translateX, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(translateX, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(translateX, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
  }, [trigger]);

  return (
    <Animated.View style={{ transform: [{ translateX }] }}>
      {children}
    </Animated.View>
  );
}

function MainMenuScreen({ navigation }) {
  const { playSound, currentSkin, coins } = useGame();
  const [menuAnim] = useState(new Animated.Value(0));

  const currentEmoji = SKINS.find(s => s.id === currentSkin)?.emoji || '😈';

  useEffect(() => {
    Animated.timing(menuAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleStart = async () => {
    navigation.navigate('LevelSelect');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ParticleBackground />
      
      <Animated.View style={[styles.menuContent, { opacity: menuAnim, transform: [{ scale: menuAnim }] }]}>
        <Text style={styles.title}>🎭 TROLL GAME</Text>
        <Text style={styles.subtitle}>Can you beat the troll?</Text>
        <Text style={styles.emojiDisplay}>{currentEmoji}</Text>
        
        <View style={styles.coinDisplay}>
          <Text style={styles.coinText}>🪙 {coins}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.startButton}
          onPress={handleStart}
          activeOpacity={0.8}
        >
          <PulseAnimation>
            <Text style={styles.startButtonText}>START TROLLING</Text>
          </PulseAnimation>
        </TouchableOpacity>

        <View style={styles.menuButtonsRow}>
          <TouchableOpacity 
            style={styles.menuButtonSmall}
            onPress={() => navigation.navigate('TimeAttack')}
            activeOpacity={0.8}
          >
            <Text style={styles.menuButtonSmallText}>⚡ Time Attack</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuButtonSmall}
            onPress={() => navigation.navigate('Settings')}
            activeOpacity={0.8}
          >
            <Text style={styles.menuButtonSmallText}>⚙️ Settings</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.leaderboardButton}
          onPress={() => navigation.navigate('Leaderboard')}
          activeOpacity={0.8}
        >
          <Text style={styles.leaderboardText}>🏆 Stats</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.leaderboardButton}
          onPress={() => navigation.navigate('Achievements')}
          activeOpacity={0.8}
        >
          <Text style={styles.leaderboardText}>🏅 Achievements</Text>
        </TouchableOpacity>

        <View style={styles.menuButtonsRow}>
          <TouchableOpacity 
            style={[styles.menuButtonSmall, { backgroundColor: '#9b59b6' }]}
            onPress={() => navigation.navigate('DailyChallenge')}
            activeOpacity={0.8}
          >
            <Text style={styles.menuButtonSmallText}>📅 Daily</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuButtonSmall, { backgroundColor: '#2ecc71' }]}
            onPress={() => navigation.navigate('EndlessMode')}
            activeOpacity={0.8}
          >
            <Text style={styles.menuButtonSmallText}>♾️ Endless</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuButtonSmall, { backgroundColor: '#f39c12' }]}
            onPress={() => navigation.navigate('Theme')}
            activeOpacity={0.8}
          >
            <Text style={styles.menuButtonSmallText}>🎨 Themes</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuButtonsRow}>
          <TouchableOpacity 
            style={[styles.menuButtonSmall, { backgroundColor: '#e94560' }]}
            onPress={() => navigation.navigate('PowerUps')}
            activeOpacity={0.8}
          >
            <Text style={styles.menuButtonSmallText}>⚡ Power-ups</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuButtonSmall, { backgroundColor: '#3498db' }]}
            onPress={() => navigation.navigate('Skins')}
            activeOpacity={0.8}
          >
            <Text style={styles.menuButtonSmallText}>🎭 Skins</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuButtonSmall, { backgroundColor: '#e74c3c' }]}
            onPress={() => navigation.navigate('BossRush')}
            activeOpacity={0.8}
          >
            <Text style={styles.menuButtonSmallText}>👹 Boss Rush</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuButtonsRow}>
          <TouchableOpacity 
            style={[styles.menuButtonSmall, { backgroundColor: '#1abc9c' }]}
            onPress={() => navigation.navigate('Tutorial')}
            activeOpacity={0.8}
          >
            <Text style={styles.menuButtonSmallText}>❓ How to Play</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuButtonSmall, { backgroundColor: '#9b59b6' }]}
            onPress={() => navigation.navigate('Statistics')}
            activeOpacity={0.8}
          >
            <Text style={styles.menuButtonSmallText}>📊 Stats</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuButtonsRow}>
          <TouchableOpacity 
            style={[styles.menuButtonSmall, { backgroundColor: '#e67e22' }]}
            onPress={() => navigation.navigate('DailyBonus')}
            activeOpacity={0.8}
          >
            <Text style={styles.menuButtonSmallText}>🎁 Daily</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuButtonSmall, { backgroundColor: '#2ecc71' }]}
            onPress={() => navigation.navigate('QuickPlay')}
            activeOpacity={0.8}
          >
            <Text style={styles.menuButtonSmallText}>⚡ Quick</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuButtonsRow}>
          <TouchableOpacity 
            style={[styles.menuButtonSmall, { backgroundColor: '#3498db' }]}
            onPress={() => navigation.navigate('LevelPreview')}
            activeOpacity={0.8}
          >
            <Text style={styles.menuButtonSmallText}>📋 Levels</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuButtonSmall, { backgroundColor: '#e74c3c' }]}
            onPress={() => navigation.navigate('ShareScore')}
            activeOpacity={0.8}
          >
            <Text style={styles.menuButtonSmallText}>📤 Share</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuButtonsRow}>
          <TouchableOpacity 
            style={[styles.menuButtonSmall, { backgroundColor: '#95a5a6' }]}
            onPress={() => navigation.navigate('About')}
            activeOpacity={0.8}
          >
            <Text style={styles.menuButtonSmallText}>ℹ️ About</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

function LevelSelectScreen({ navigation }) {
  const { score, completedLevels } = useGame();

  return (
    <View style={styles.levelSelectContainer}>
      <StatusBar style="light" />
      <ParticleBackground />
      
      <Text style={styles.levelSelectTitle}>SELECT LEVEL</Text>
      <Text style={styles.totalScore}>Total Score: {score}</Text>
      
      <View style={styles.levelsGrid}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.levelButton,
              completedLevels.includes(level) && styles.levelCompleted
            ]}
            onPress={() => navigation.navigate(`Level${level}`)}
            activeOpacity={0.7}
          >
            <Text style={styles.levelNumber}>{level}</Text>
            {completedLevels.includes(level) && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
}

function ComboDisplay() {
  const { combo, multiplier, streak } = useGame();

  if (combo < 2) return null;

  return (
    <View style={styles.comboContainer}>
      <View style={styles.comboBadge}>
        <Text style={styles.comboText}>🔥 {combo} COMBO</Text>
      </View>
      <View style={styles.multiplierBadge}>
        <Text style={styles.multiplierText}>×{multiplier.toFixed(1)}</Text>
      </View>
    </View>
  );
}

function ScoreDisplay() {
  const { score, highScore } = useGame();

  return (
    <View style={styles.scoreDisplayContainer}>
      <Text style={styles.scoreText}>⭐ {score}</Text>
      {score > 0 && score === highScore && score > 100 && (
        <Text style={styles.newHighScore}>NEW HIGH!</Text>
      )}
    </View>
  );
}

function Level1Screen({ navigation }) {
  const { addScore, resetCombo } = useGame();
  const [shake, setShake] = useState(false);

  const handleFakeButton = async () => {
    setShake(true);
    SOUNDS.fail();
    setTimeout(() => {
      navigation.replace('GameOver');
    }, 500);
  };

  const handleSecretDot = async () => {

    addScore(100);
    Alert.alert(
      '🎉 Wait, how did you find that?!',
      'Level Cleared! +100 Points',
      [
        {
          text: 'Next Level',
          onPress: () => navigation.replace('Level2'),
        },
      ]
    );
  };

  return (
    <View style={styles.levelContainer}>
      <StatusBar style="light" />
      <ParticleBackground />
      <ComboDisplay />
      <ScoreDisplay />
      
      <Text style={styles.levelTitle}>Level 1</Text>
      <Text style={styles.instruction}>Click the button to advance!</Text>
      <Text style={styles.hint}>Hint: Big isn't always right 😏</Text>

      <ShakeAnimation trigger={shake}>
        <TouchableOpacity 
          style={styles.fakeButton}
          onPress={handleFakeButton}
          activeOpacity={0.9}
        >
          <View style={styles.fakeButtonInner}>
            <Text style={styles.fakeButtonText}>NEXT LEVEL</Text>
          </View>
        </TouchableOpacity>
      </ShakeAnimation>

      <TouchableWithoutFeedback onPress={handleSecretDot}>
        <View style={styles.secretDot} />
      </TouchableWithoutFeedback>
    </View>
  );
}

function Level2Screen({ navigation }) {
  const { addScore } = useGame();
  const [shake, setShake] = useState(false);

  const handleGreenBox = async () => {
    setShake(true);

    setTimeout(() => {
      navigation.replace('GameOver');
    }, 500);
  };

  const handleRedBox = async () => {

    addScore(100);
    Alert.alert(
      'Rule Breaker!',
      'You Win! +100 Points',
      [
        {
          text: 'Next Level',
          onPress: () => navigation.replace('Level3'),
        },
      ]
    );
  };

  return (
    <View style={styles.level2Container}>
      <StatusBar style="light" />
      <ParticleBackground />
      <ComboDisplay />
      <ScoreDisplay />
      
      <Text style={styles.warningText}>WARNING: Do NOT touch the green box!</Text>
      <Text style={styles.hint}>Hint: Follow instructions... or not 🤔</Text>

      <ShakeAnimation trigger={shake}>
        <View style={styles.boxesContainer}>
          <TouchableOpacity 
            style={styles.redBox}
            onPress={handleRedBox}
            activeOpacity={0.8}
          >
            <Text style={styles.redBoxText}>RED</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.greenBox}
            onPress={handleGreenBox}
            activeOpacity={0.8}
          >
            <Text style={styles.greenBoxText}>GREEN</Text>
          </TouchableOpacity>
        </View>
      </ShakeAnimation>
    </View>
  );
}

function Level3Screen({ navigation }) {
  const { addScore, setCompletedLevel } = useGame();
  const [moving, setMoving] = useState(false);
  const btnPosition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setCompletedLevel(3);
  }, []);

  const handleCatch = async () => {

    addScore(150);
    Alert.alert(
      '🎯 Gotcha!',
      'You caught the button! +150 Points',
      [
        {
          text: 'Next Level',
          onPress: () => navigation.replace('Level4'),
        },
      ]
    );
  };

  const startMoving = () => {
    setMoving(true);
    Animated.loop(
      Animated.sequence([
        Animated.timing(btnPosition, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(btnPosition, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    const timer = setTimeout(startMoving, 2000);
    return () => clearTimeout(timer);
  }, []);

  const translateX = btnPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 150],
  });

  return (
    <View style={styles.level3Container}>
      <StatusBar style="light" />
      <ParticleBackground />
      <ComboDisplay />
      <ScoreDisplay />
      
      <Text style={styles.level3Title}>🎯 Level 3</Text>
      <Text style={styles.level3Subtitle}>Catch the button before it runs away!</Text>
      <Text style={styles.hint}>Wait for it...</Text>
      
      <View style={styles.catchContainer}>
        <Animated.View style={{ transform: [{ translateX }] }}>
          <TouchableOpacity 
            style={styles.catchButton}
            onPress={handleCatch}
            activeOpacity={0.8}
          >
            <Text style={styles.catchText}>CATCH ME!</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <TouchableOpacity 
        style={styles.backToMenuButton}
        onPress={() => navigation.replace('LevelSelect')}
      >
        <Text style={styles.backToMenuText}>← Levels</Text>
      </TouchableOpacity>
    </View>
  );
}

function Level4Screen({ navigation }) {
  const { addScore } = useGame();
  const [shake, setShake] = useState(false);
  const [showCorrect, setShowCorrect] = useState(false);

  const handleTap = async (index) => {
    if (index === 1) {
      setShowCorrect(true);
  
      addScore(200);
      Alert.alert(
        '🧠 Smart Cookie!',
        'You chose the middle! +200 Points',
        [
          {
            text: 'Next Level',
            onPress: () => navigation.replace('Level5'),
          },
        ]
      );
    } else {
      setShake(true);
  
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <View style={styles.level4Container}>
      <StatusBar style="light" />
      <ParticleBackground />
      <ComboDisplay />
      <ScoreDisplay />
      
      <Text style={styles.level4Title}>🧠 Level 4</Text>
      <Text style={styles.level4Subtitle}>Choose the correct answer:</Text>
      <Text style={styles.mathProblem}>2 + 2 = ?</Text>

      <View style={styles.optionsContainer}>
        {[3, 4, 5].map((num, i) => (
          <ShakeAnimation key={num} trigger={shake && !showCorrect}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => handleTap(i)}
              activeOpacity={0.7}
            >
              <Text style={styles.optionText}>{num}</Text>
            </TouchableOpacity>
          </ShakeAnimation>
        ))}
      </View>
      
      <Text style={styles.hint}>Trust your gut, not the trolls!</Text>
    </View>
  );
}

function Level5Screen({ navigation }) {
  const { addScore, setCompletedLevel } = useGame();
  const [countdown, setCountdown] = useState(3);
  const [canClick, setCanClick] = useState(false);

  useEffect(() => {
    setCompletedLevel(5);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanClick(true);
          return 0;
        }
        return prev - 1;
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const handleWin = async () => {
    if (!canClick) return;
    SOUNDS.success();
    addScore(300);
    Alert.alert(
      '🏆 ULTIMATE TROLL MASTER!',
      'You completed ALL levels! +300 Points',
      [
        {
          text: 'Victory Lap!',
          onPress: () => navigation.replace('MainMenu'),
        },
      ]
    );
  };

  return (
    <View style={styles.level5Container}>
      <StatusBar style="light" />
      <ParticleBackground />
      <ComboDisplay />
      <ScoreDisplay />
      
      <Text style={styles.level5Title}>🏆 Level 5</Text>
      <Text style={styles.level5Subtitle}>Wait for it...</Text>

      <View style={styles.countdownContainer}>
        <Text style={styles.countdownText}>
          {countdown > 0 ? countdown : 'CLICK NOW!'}
        </Text>
      </View>

      <TouchableOpacity 
        style={[
          styles.finalButton,
          canClick && styles.finalButtonActive
        ]}
        onPress={handleWin}
        disabled={!canClick}
        activeOpacity={0.8}
      >
        <Text style={styles.finalButtonText}>
          {canClick ? '🎉 WIN!' : '⏳ Wait...'}
        </Text>
      </TouchableOpacity>

      {!canClick && (
        <Text style={styles.warningText}>
          Too early = Game Over! 😈
        </Text>
      )}
    </View>
  );
}

function Level6Screen({ navigation }) {
  const { addScore, setCompletedLevel } = useGame();
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setCompletedLevel(6);
  }, []);

  const handleTap = (btnIndex) => {
    SOUNDS.fail();
    navigation.replace('GameOver');
  };

  const handleSecretTap = () => {
    SOUNDS.success();
    addScore(200);
    Alert.alert(
      '🎯 Hidden Found!',
      'You found the secret! +200 Points',
      [{ text: 'Next Level', onPress: () => navigation.replace('Level7') }]
    );
  };

  return (
    <View style={styles.level6Container}>
      <StatusBar style="light" />
      <ParticleBackground />
      <ComboDisplay />
      <ScoreDisplay />
      
      <Text style={styles.level6Title}>🔍 Level 6</Text>
      <Text style={styles.level6Subtitle}>Find the real button!</Text>

      <View style={styles.buttonMaze}>
        {[...Array(9)].map((_, i) => (
          <TouchableOpacity
            key={i}
            style={styles.fakeButton2}
            onPress={() => handleTap(i)}
            activeOpacity={0.8}
          >
            <Text style={styles.fakeButton2Text}>FAKE</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity 
        style={styles.realButton}
        onPress={handleSecretTap}
        activeOpacity={0.9}
      >
        <Text style={styles.realButtonText}>NEXT LEVEL</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.hintButton} onPress={() => setShowHint(true)}>
        <Text style={styles.hintButtonText}>? Hint</Text>
      </TouchableOpacity>

      {showHint && (
        <View style={styles.hintPopup}>
          <Text style={styles.hintPopupText}>Not this one! 🤔</Text>
        </View>
      )}
    </View>
  );
}

function Level7Screen({ navigation }) {
  const { addScore, setCompletedLevel } = useGame();
  const [password, setPassword] = useState('');
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    setCompletedLevel(7);
  }, []);

  const handleSubmit = () => {
    if (password.toLowerCase() === 'troll') {
      SOUNDS.success();
      addScore(250);
      Alert.alert(
        '🔓 Password Correct!',
        'You cracked the code! +250 Points',
        [{ text: 'Next Level', onPress: () => navigation.replace('Level8') }]
      );
    } else {
      setAttempts(prev => prev + 1);
      setPassword('');
      SOUNDS.fail();
      if (attempts >= 2) {
        navigation.replace('GameOver');
      } else {
        Alert.alert('❌ Wrong!', `${2 - attempts} attempts left...`);
      }
    }
  };

  return (
    <View style={styles.level7Container}>
      <StatusBar style="light" />
      <ParticleBackground />
      <ComboDisplay />
      <ScoreDisplay />
      
      <Text style={styles.level7Title}>🔐 Level 7</Text>
      <Text style={styles.level7Subtitle}>Enter the password:</Text>
      <Text style={styles.passwordHint}>Hint: What do we call the game? 😏</Text>

      <TextInput
        style={styles.passwordInput}
        value={password}
        onChangeText={setPassword}
        placeholder="Enter password..."
        placeholderTextColor="#7f8c8d"
        secureTextEntry
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>SUBMIT</Text>
      </TouchableOpacity>
    </View>
  );
}

function Level8Screen({ navigation }) {
  const { addScore, setCompletedLevel, score } = useGame();
  const [health, setHealth] = useState(3);
  const [bossHealth, setBossHealth] = useState(5);
  const [bossPhase, setBossPhase] = useState(0);

  useEffect(() => {
    setCompletedLevel(8);
  }, []);

  const handleAttack = () => {
    SOUNDS.combo();
    setBossHealth(prev => prev - 1);
    if (bossHealth <= 1) {
      SOUNDS.success();
      addScore(500);
      const totalScore = score + 500;
      Alert.alert(
        '🏆 BOSS DEFEATED!',
        `You beat the Troll King! +500 Points\nTotal: ${totalScore}`,
        [{ text: 'Victory!', onPress: () => navigation.replace('MainMenu') }]
      );
    }
  };

  const handleTrap = () => {
    SOUNDS.fail();
    setHealth(prev => prev - 1);
    if (health <= 1) {
      navigation.replace('GameOver');
    }
  };

  const bossEmojis = ['😈', '👹', '💀', '👻', '👽'];

  return (
    <View style={styles.level8Container}>
      <StatusBar style="light" />
      <ParticleBackground />
      <ComboDisplay />
      <ScoreDisplay />
      
      <Text style={styles.level8Title}>👹 BOSS LEVEL</Text>
      
      <View style={styles.bossContainer}>
        <Text style={styles.bossEmoji}>{bossEmojis[bossPhase]}</Text>
        <View style={styles.bossHealthBar}>
          <View style={[styles.bossHealthFill, { width: `${(bossHealth / 5) * 100}%` }]} />
        </View>
        <Text style={styles.bossHealthText}>{bossHealth}/5</Text>
      </View>

      <View style={styles.playerStats}>
        <Text style={styles.healthText}>❤️ HP: {health}/3</Text>
      </View>

      <View style={styles.bossButtons}>
        <TouchableOpacity style={styles.attackButton} onPress={handleAttack}>
          <Text style={styles.attackButtonText}>⚔️ ATTACK</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.trapButton} onPress={handleTrap}>
          <Text style={styles.trapButtonText}>🎯 TRAP</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.bossHint}>Find the pattern! 😈</Text>
    </View>
  );
}

function Level9Screen({ navigation }) {
  const { addScore, setCompletedLevel } = useGame();
  const [tapCount, setTapCount] = useState(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setCompletedLevel(9);
  }, []);

  const handleTap = (index) => {
    SOUNDS.click();
    if (index === 2) {
      SOUNDS.success();
      addScore(300);
      Alert.alert(
        '🎯 Level Cleared!',
        'You found the golden button! +300 Points',
        [{ text: 'Next Level', onPress: () => navigation.replace('Level10') }]
      );
    } else {
      setTapCount(prev => prev + 1);
      if (tapCount >= 2) {
        SOUNDS.fail();
        navigation.replace('GameOver');
      }
    }
  };

  const handleHint = () => {
    setRevealed(true);
  };

  return (
    <View style={styles.level9Container}>
      <StatusBar style="light" />
      <ParticleBackground />
      <ComboDisplay />
      <ScoreDisplay />
      
      <Text style={styles.level9Title}>💎 Level 9</Text>
      <Text style={styles.level9Subtitle}>Find the diamond among stones!</Text>
      <Text style={styles.level9Hint}>Hint: {revealed ? 'Third button' : 'Tap to reveal (costs attempt)'}</Text>

      <View style={styles.diamondButtons}>
        {[0,1,2,3,4].map(i => (
          <TouchableOpacity
            key={i}
            style={[styles.diamondButton, i === 2 && styles.diamondButtonGold]}
            onPress={() => handleTap(i)}
            activeOpacity={0.8}
          >
            <Text style={styles.diamondEmoji}>💎</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.hintRevealButton} onPress={handleHint}>
        <Text style={styles.hintRevealText}>💡 Get Hint</Text>
      </TouchableOpacity>

      <Text style={styles.attemptText}>Attempts: {tapCount}/3</Text>
    </View>
  );
}

function Level10Screen({ navigation }) {
  const { addScore, setCompletedLevel, score } = useGame();
  const [sequence, setSequence] = useState([]);
  const [playerSeq, setPlayerSeq] = useState([]);
  const [gameState, setGameState] = useState('watch');

  useEffect(() => {
    setCompletedLevel(10);
    const newSeq = [...Array(5)].map((_, i) => Math.floor(Math.random() * 4));
    setSequence(newSeq);
  }, []);

  const handleColorPress = (colorIndex) => {
    if (gameState !== 'play') return;
    
    const newPlayerSeq = [...playerSeq, colorIndex];
    setPlayerSeq(newPlayerSeq);

    if (newPlayerSeq[newPlayerSeq.length - 1] !== sequence[newPlayerSeq.length - 1]) {
      SOUNDS.fail();
      navigation.replace('GameOver');
      return;
    }

    if (newPlayerSeq.length === sequence.length) {
      SOUNDS.success();
      addScore(400);
      const totalScore = score + 400;
      Alert.alert(
        '🏆 FINAL VICTORY!',
        `You completed ALL 10 levels!\n+400 Points\nTotal: ${totalScore}`,
        [{ text: '🏅 View Stats', onPress: () => navigation.replace('Leaderboard') }]
      );
    }
  };

  const startPlay = () => {
    setGameState('play');
  };

  const colors = ['🔴', '🔵', '🟢', '🟡'];

  return (
    <View style={styles.level10Container}>
      <StatusBar style="light" />
      <ParticleBackground />
      <ComboDisplay />
      <ScoreDisplay />
      
      <Text style={styles.level10Title}>🎮 FINAL LEVEL</Text>
      <Text style={styles.level10Subtitle}>Memory Challenge!</Text>

      {gameState === 'watch' ? (
        <View>
          <Text style={styles.watchText}>Watch the sequence...</Text>
          <View style={styles.sequencePreview}>
            {sequence.map((s, i) => (
              <Text key={i} style={styles.sequenceItem}>{colors[s]}</Text>
            ))}
          </View>
          <TouchableOpacity style={styles.startPlayButton} onPress={startPlay}>
            <Text style={styles.startPlayText}>▶️ YOUR TURN</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.colorGrid}>
          {colors.map((c, i) => (
            <TouchableOpacity
              key={i}
              style={styles.colorButton}
              onPress={() => handleColorPress(i)}
              activeOpacity={0.8}
            >
              <Text style={styles.colorButtonText}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

function TimeAttackScreen({ navigation }) {
  const { addScore, resetScore, resetCombo } = useGame();
  const [timeLeft, setTimeLeft] = useState(60);
  const [level, setLevel] = useState(1);
  const [score, setLevelScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCompleteLevel = () => {
    const points = level * 50;
    setLevelScore(s => s + points);
    addScore(points);
    SOUNDS.success();
    if (level >= 5) {
      addScore(200);
      Alert.alert(
        '🏆 TIME ATTACK COMPLETE!',
        'You completed all levels in time! +200 Bonus',
        [{ text: 'Done', onPress: () => navigation.replace('MainMenu') }]
      );
    } else {
      setLevel(l => l + 1);
    }
  };

  const handleFail = () => {
    SOUNDS.fail();
    setTimeLeft(0);
    setGameOver(true);
  };

  if (gameOver) {
    return (
      <View style={styles.gameOverContainer}>
        <StatusBar style="light" />
        <ParticleBackground />
        <Text style={styles.gameOverText}>⏰ TIME'S UP!</Text>
        <Text style={styles.scoreDisplay}>Score: {score}</Text>
        <TouchableOpacity style={styles.tryAgainButton} onPress={() => navigation.replace('MainMenu')}>
          <Text style={styles.tryAgainText}>Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.timeAttackContainer}>
      <StatusBar style="light" />
      <ParticleBackground />
      
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>⏱️ {timeLeft}s</Text>
      </View>

      <Text style={styles.timeAttackTitle}>⚡ TIME ATTACK</Text>
      <Text style={styles.timeAttackLevel}>Level {level}/10</Text>

      <View style={styles.timeAttackButtons}>
        <TouchableOpacity style={styles.timeButton} onPress={handleCompleteLevel}>
          <Text style={styles.timeButtonText}>✅ Complete</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.timeButton, styles.timeFailButton]} onPress={handleFail}>
          <Text style={styles.timeButtonText}>❌ Fail</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function DailyChallengeScreen({ navigation }) {
  const { addScore } = useGame();
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          Alert.alert('⏰ Time Up!', 'Daily Challenge incomplete', [
            { text: 'Home', onPress: () => navigation.replace('MainMenu') }
          ]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleComplete = () => {
    SOUNDS.success();
    setCompleted(prev => prev + 1);
    if (challengeIndex < 2) {
      setChallengeIndex(i => i + 1);
      setTimeLeft(30);
    } else {
      addScore(500);
      Alert.alert('🎉 Daily Complete!', '+500 Points!', [
        { text: 'Claim', onPress: () => navigation.replace('MainMenu') }
      ]);
    }
  };

  const challenge = DAILY_CHALLENGES[challengeIndex];

  return (
    <View style={styles.dailyChallengeContainer}>
      <StatusBar style="light" />
      <ParticleBackground />
      
      <View style={styles.dailyHeader}>
        <Text style={styles.dailyTitle}>📅 DAILY CHALLENGE</Text>
        <Text style={styles.dailyTimer}>⏱️ {timeLeft}s</Text>
      </View>

      <View style={styles.dailyProgress}>
        <Text style={styles.dailyProgressText}>Day {new Date().getDate()}</Text>
        <View style={styles.progressDots}>
          {[0,1,2].map(i => (
            <View key={i} style={[styles.dot, i <= completed && styles.dotCompleted]} />
          ))}
        </View>
      </View>

      <View style={styles.challengeCard}>
        <Text style={styles.challengeTitle}>{challenge.title}</Text>
        <Text style={styles.challengeDesc}>{challenge.desc}</Text>
        <Text style={styles.challengeNumber}>{challengeIndex + 1}/3</Text>
      </View>

      <TouchableOpacity style={styles.completeChallengeButton} onPress={handleComplete}>
        <Text style={styles.completeChallengeText}>✓ COMPLETE</Text>
      </TouchableOpacity>
    </View>
  );
}

function EndlessModeScreen({ navigation }) {
  const { addScore, resetCombo } = useGame();
  const [level, setLevel] = useState(1);
  const [health, setHealth] = useState(3);
  const [score, setLevelScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const handlePass = () => {
    SOUNDS.success();
    const points = level * 25;
    setLevelScore(s => s + points);
    addScore(points);
    setLevel(l => l + 1);
  };

  const handleFail = () => {
    SOUNDS.fail();
    setHealth(h => h - 1);
    if (health <= 1) {
      setGameOver(true);
    }
  };

  if (gameOver) {
    return (
      <View style={styles.gameOverContainer}>
        <StatusBar style="light" />
        <ParticleBackground />
        <Text style={styles.gameOverText}>♾️ GAME OVER</Text>
        <Text style={styles.scoreDisplay}>Score: {score}</Text>
        <Text style={styles.highScoreText}>Level Reached: {level}</Text>
        <TouchableOpacity style={styles.tryAgainButton} onPress={() => navigation.replace('MainMenu')}>
          <Text style={styles.tryAgainText}>Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.endlessContainer}>
      <StatusBar style="light" />
      <ParticleBackground />
      
      <View style={styles.endlessStats}>
        <Text style={styles.endlessLevel}>Level {level}</Text>
        <Text style={styles.endlessHealth}>❤️ {health}/3</Text>
      </View>

      <Text style={styles.endlessTitle}>♾️ ENDLESS MODE</Text>
      <Text style={styles.endlessScore}>Score: {score}</Text>

      <View style={styles.endlessButtons}>
        <TouchableOpacity style={styles.passButton} onPress={handlePass}>
          <Text style={styles.passButtonText}>✓ Pass</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.failButton} onPress={handleFail}>
          <Text style={styles.failButtonText}>✗ Fail</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ThemeScreen({ navigation }) {
  const { currentTheme, setCurrentTheme, unlockAchievement } = useGame();

  const handleThemeSelect = (themeKey) => {
    setCurrentTheme(themeKey);
    unlockAchievement('theme_explorer');
    Alert.alert('🎨 Theme Changed!', `${themeKey.charAt(0).toUpperCase() + themeKey.slice(1)} theme applied`);
  };

  return (
    <View style={styles.themeContainer}>
      <StatusBar style="light" />
      <ParticleBackground />
      
      <Text style={styles.themeTitle}>🎨 THEMES</Text>

      <View style={styles.themeGrid}>
        {Object.keys(THEMES).map((key) => (
          <TouchableOpacity
            key={key}
            style={[styles.themeCard, { backgroundColor: THEMES[key].bg }]}
            onPress={() => handleThemeSelect(key)}
          >
            <Text style={[styles.themeName, { color: THEMES[key].primary }]}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Text>
            <Text style={styles.themePreview}>🎨</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
}

function PowerUpsScreen({ navigation }) {
  const { addScore, score, setPowerUp, powerUps } = useGame();
  const [coins, setCoins] = useState(0);

  const handleBuy = (powerup) => {
    if (coins >= powerup.cost) {
      setCoins(c => c - powerup.cost);
      setPowerUp(powerup.id);
      Alert.alert('✅ Purchased!', `${powerup.name} activated!`);
    } else {
      Alert.alert('❌ Not enough coins!', `Need ${powerup.cost - coins} more coins`);
    }
  };

  return (
    <View style={styles.powerupsContainer}>
      <StatusBar style="light" />
      <ParticleBackground />
      
      <Text style={styles.powerupsTitle}>⚡ POWER-UPS</Text>
      <Text style={styles.coinsDisplay}>🪙 Coins: {coins}</Text>

      <View style={styles.powerupsList}>
        {POWERUPS.map((p) => (
          <TouchableOpacity
            key={p.id}
            style={styles.powerupCard}
            onPress={() => handleBuy(p)}
          >
            <Text style={styles.powerupIcon}>{p.name}</Text>
            <Text style={styles.powerupDesc}>{p.desc}</Text>
            <Text style={styles.powerupCost}>🪙 {p.cost}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
}

function SkinsScreen({ navigation }) {
  const { score, currentSkin, setCurrentSkin, unlockSkin } = useGame();
  const [showUnlockAnim, setShowUnlockAnim] = useState(false);

  const handleSelect = (skin) => {
    if (score >= skin.unlockAt || skin.id === 'default') {
      setCurrentSkin(skin.id);
      unlockSkin(skin.id);
    } else {
      Alert.alert('🔒 Locked!', `Need ${skin.unlockAt} points to unlock`);
    }
  };

  return (
    <View style={styles.skinsContainer}>
      <StatusBar style="light" />
      <ParticleBackground />
      
      <Text style={styles.skinsTitle}>🎭 CHARACTERS</Text>
      <Text style={styles.skinsScore}>Your Score: {score}</Text>

      <View style={styles.skinsGrid}>
        {SKINS.map((skin) => {
          const unlocked = score >= skin.unlockAt || skin.id === 'default';
          return (
            <TouchableOpacity
              key={skin.id}
              style={[
                styles.skinCard,
                currentSkin === skin.id && styles.skinCardActive,
                !unlocked && styles.skinCardLocked
              ]}
              onPress={() => handleSelect(skin)}
            >
              <Text style={styles.skinEmoji}>{skin.emoji}</Text>
              <Text style={[styles.skinName, !unlocked && styles.skinNameLocked]}>
                {skin.name}
              </Text>
              {!unlocked && (
                <Text style={styles.skinUnlock}>🔒 {skin.unlockAt}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
}

function BossRushScreen({ navigation }) {
  const { addScore, score, setCompletedLevel } = useGame();
  const [bossIndex, setBossIndex] = useState(0);
  const [bossHp, setBossHp] = useState(0);
  const [playerHp, setPlayerHp] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);

  useEffect(() => {
    setBossHp(BOSSES[0].hp);
  }, []);

  const handleAttack = () => {
    SOUNDS.combo();
    const newHp = bossHp - 1;
    setBossHp(newHp);
    if (newHp <= 0) {
      if (bossIndex >= BOSSES.length - 1) {
        setVictory(true);
        addScore(1000);
        Alert.alert('🏆 BOSS RUSH COMPLETE!', '+1000 Points!', [
          { text: 'Claim', onPress: () => navigation.replace('MainMenu') }
        ]);
      } else {
        const nextBoss = bossIndex + 1;
        setBossIndex(nextBoss);
        setBossHp(BOSSES[nextBoss].hp);
        Alert.alert('🎉 Boss Defeated!', `Next: ${BOSSES[nextBoss].name}`);
      }
    }
  };

  const handleFail = () => {
    SOUNDS.fail();
    setPlayerHp(h => h - 1);
    if (playerHp <= 1) {
      setGameOver(true);
    }
  };

  if (gameOver) {
    return (
      <View style={styles.gameOverContainer}>
        <StatusBar style="light" />
        <ParticleBackground />
        <Text style={styles.gameOverText}>💀 DEFEATED</Text>
        <Text style={styles.scoreDisplay}>Bosses Beaten: {bossIndex}</Text>
        <TouchableOpacity style={styles.tryAgainButton} onPress={() => navigation.replace('MainMenu')}>
          <Text style={styles.tryAgainText}>Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const boss = BOSSES[bossIndex];

  return (
    <View style={styles.bossRushContainer}>
      <StatusBar style="light" />
      <ParticleBackground />
      
      <Text style={styles.bossRushTitle}>👹 BOSS RUSH</Text>
      <Text style={styles.bossRushProgress}>{bossIndex + 1}/{BOSSES.length}</Text>

      <View style={styles.bossDisplay}>
        <Text style={styles.bossRushEmoji}>{boss.emoji}</Text>
        <Text style={styles.bossRushName}>{boss.name}</Text>
        <View style={styles.bossRushHpBar}>
          <View style={[styles.bossRushHpFill, { width: `${(bossHp / boss.hp) * 100}%` }]} />
        </View>
        <Text style={styles.bossRushHpText}>{bossHp}/{boss.hp}</Text>
      </View>

      <Text style={styles.playerHealth}>❤️ Your HP: {playerHp}/3</Text>

      <View style={styles.bossRushButtons}>
        <TouchableOpacity style={styles.attackButtonLarge} onPress={handleAttack}>
          <Text style={styles.attackButtonTextLarge}>⚔️ ATTACK</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.failButtonLarge} onPress={handleFail}>
          <Text style={styles.failButtonTextLarge}>❌ TRAP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function TutorialScreen({ navigation }) {
  const [step, setStep] = useState(0);

  const tutorialSteps = [
    { title: '🎮 Welcome!', content: 'Troll Game is all about outsmarting the trolls! Find the correct answers, avoid traps, and become the ultimate Troll Master!', emoji: '🎭' },
    { title: '🎯 Gameplay', content: 'Each level has a puzzle. Look for hidden clues, think outside the box, and don\'t trust everything you see!', emoji: '🧠' },
    { title: '💎 Scoring', content: 'Earn points by completing levels. Build combos by winning consecutively to multiply your score up to 5x!', emoji: '⭐' },
    { title: '🏆 Modes', content: 'Play Story Mode (10 levels), Time Attack (speed), Endless Mode (unlimited), or Daily Challenges!', emoji: '🎮' },
    { title: '🛡️ Power-ups', content: 'Use coins to buy power-ups like Shield, Time Bonus, Double Points, or Level Skip!', emoji: '⚡' },
    { title: '🎭 Skins', content: 'Unlock new character skins by earning points. The more you play, the more you unlock!', emoji: '👑' },
  ];

  const nextStep = () => {
    if (step < tutorialSteps.length - 1) {
      setStep(s => s + 1);
    } else {
      navigation.goBack();
    }
  };

  const current = tutorialSteps[step];

  return (
    <View style={styles.tutorialContainer}>
      <StatusBar style="light" />
      <ParticleBackground />
      
      <View style={styles.tutorialProgress}>
        {tutorialSteps.map((_, i) => (
          <View key={i} style={[styles.tutorialDot, i === step && styles.tutorialDotActive]} />
        ))}
      </View>

      <Text style={styles.tutorialEmoji}>{current.emoji}</Text>
      <Text style={styles.tutorialTitle}>{current.title}</Text>
      <Text style={styles.tutorialContent}>{current.content}</Text>

      <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
        <Text style={styles.nextButtonText}>
          {step === tutorialSteps.length - 1 ? '✅ Done!' : 'Next →'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function StatisticsScreen({ navigation }) {
  const { score, highScore, maxCombo, completedLevels, totalPlays, totalTime } = useGame();

  return (
    <View style={styles.statsContainer}>
      <StatusBar style="light" />
      <ParticleBackground />
      
      <Text style={styles.statsTitle}>📊 STATISTICS</Text>

      <View style={styles.statsCard}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Total Plays</Text>
          <Text style={styles.statValue}>{totalPlays || 0}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Play Time</Text>
          <Text style={styles.statValue}>{totalTime ? `${Math.floor(totalTime/60)}m` : '0m'}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>High Score</Text>
          <Text style={styles.statValue}>{highScore}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Best Combo</Text>
          <Text style={styles.statValue}>{maxCombo}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Levels Beaten</Text>
          <Text style={styles.statValue}>{completedLevels.length}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
}

function RandomEventScreen({ navigation }) {
  const { addScore } = useGame();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const randomEvent = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
    setEvent(randomEvent);
  }, []);

  const handleClaim = () => {
    if (event.type === 'bonus') {
      addScore(event.points);
    } else if (event.type === 'combo') {
      // Apply multiplier effect
    }
    navigation.goBack();
  };

  if (!event) return null;

  return (
    <View style={styles.randomEventContainer}>
      <StatusBar style="light" />
      <ParticleBackground />
      
      <Text style={styles.randomEventEmoji}>🎁</Text>
      <Text style={styles.randomEventText}>{event.text}</Text>

      <TouchableOpacity style={styles.claimButton} onPress={handleClaim}>
        <Text style={styles.claimButtonText}>Claim! 🎉</Text>
      </TouchableOpacity>
    </View>
  );
}

function DailyBonusScreen({ navigation }) {
  const { coins, setCoins, lastLoginDay, setLastLoginDay } = useGame();
  const [todayClaimed, setTodayClaimed] = useState(false);

  const handleClaim = (dayIndex) => {
    const reward = DAILY_REWARDS[dayIndex];
    setCoins(c => c + reward.coins);
    setLastLoginDay(dayIndex + 1);
    setTodayClaimed(true);
    SOUNDS.success();
    Alert.alert('🎉 Reward Claimed!', `${reward.prize}\n+${reward.coins} coins!`);
  };

  return (
    <View style={styles.dailyBonusContainer}>
      <StatusBar style="light" />
      <ParticleBackground />
      
      <Text style={styles.dailyBonusTitle}>📅 DAILY REWARDS</Text>
      <Text style={styles.dailyBonusSubtitle}>Login 7 days in a row!</Text>

      <View style={styles.dailyRewardsGrid}>
        {DAILY_REWARDS.map((reward, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dailyRewardCard,
              index < (lastLoginDay || 0) && styles.dailyRewardClaimed,
              index === (lastLoginDay || 0) && !todayClaimed && styles.dailyRewardCurrent
            ]}
            onPress={() => index === (lastLoginDay || 0) && !todayClaimed && handleClaim(index)}
            disabled={index !== (lastLoginDay || 0) || todayClaimed}
          >
            <Text style={styles.dailyDayText}>Day {reward.day}</Text>
            <Text style={styles.dailyRewardText}>{reward.prize}</Text>
            {index < (lastLoginDay || 0) && <Text style={styles.checkMark}>✓</Text>}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
}

function QuickPlayScreen({ navigation }) {
  const { addScore, setCompletedLevel } = useGame();
  const [score, setQuickScore] = useState(0);
  const [level, setQuickLevel] = useState(1);

  const handleWin = () => {
    SOUNDS.success();
    const points = level * 30;
    setQuickScore(s => s + points);
    addScore(points);
    setQuickLevel(l => l + 1);
    if (level >= 3) {
      addScore(100);
      Alert.alert('🏆 Quick Play Complete!', '+100 Bonus!', [
        { text: 'Done', onPress: () => navigation.replace('MainMenu') }
      ]);
    }
  };

  const handleLose = () => {
    SOUNDS.fail();
    Alert.alert('💀 Game Over', `Score: ${score}`, [
      { text: 'Try Again', onPress: () => { setQuickScore(0); setQuickLevel(1); } },
      { text: 'Exit', onPress: () => navigation.replace('MainMenu') }
    ]);
  };

  return (
    <View style={styles.quickPlayContainer}>
      <StatusBar style="light" />
      <ParticleBackground />
      
      <Text style={styles.quickPlayTitle}>⚡ QUICK PLAY</Text>
      <Text style={styles.quickPlayLevel}>Level {level}/3</Text>
      <Text style={styles.quickPlayScore}>Score: {score}</Text>

      <View style={styles.quickPlayButtons}>
        <TouchableOpacity style={styles.quickWinButton} onPress={handleWin}>
          <Text style={styles.quickWinText}>✅ WIN</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickLoseButton} onPress={handleLose}>
          <Text style={styles.quickLoseText}>❌ LOSE</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.quickPlayHint}>Tap win to continue, lose to exit</Text>
    </View>
  );
}

function LevelPreviewScreen({ navigation }) {
  const { completedLevels } = useGame();

  return (
    <View style={styles.levelPreviewContainer}>
      <StatusBar style="light" />
      <ParticleBackground />
      
      <Text style={styles.levelPreviewTitle}>📋 LEVEL PREVIEW</Text>

      <View style={styles.levelPreviewList}>
        {Object.entries(LEVELS_PREVIEW).map(([num, info]) => {
          const completed = completedLevels.includes(parseInt(num));
          return (
            <View key={num} style={[styles.levelPreviewCard, completed && styles.levelPreviewCompleted]}>
              <View style={styles.levelPreviewHeader}>
                <Text style={styles.levelPreviewNum}>Level {num}</Text>
                <Text style={styles.levelPreviewName}>{info.name}</Text>
              </View>
              <Text style={styles.levelPreviewDiff}>{info.difficulty}</Text>
              <Text style={styles.levelPreviewTip}>💡 {info.tip}</Text>
              {completed && <Text style={styles.levelPreviewCheck}>✓ Completed</Text>}
            </View>
          );
        })}
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
}

function ShareScoreScreen({ navigation }) {
  const { score, highScore, maxCombo, completedLevels } = useGame();

  const shareText = `🎭 I'm playing Troll Game!\n\n⭐ Score: ${score}\n🏆 High Score: ${highScore}\n🔥 Max Combo: ${maxCombo}\n🎯 Levels: ${completedLevels.length}/10\n\nCan you beat me? 👀`;

  const handleShare = () => {
    Alert.alert('📤 Share', `Share this score:\n\n${shareText}`, [
      { text: 'Copy', onPress: () => Alert.alert('✅ Copied!', 'Score copied to clipboard') },
      { text: 'Close', style: 'cancel' }
    ]);
  };

  return (
    <View style={styles.shareContainer}>
      <StatusBar style="light" />
      <ParticleBackground />
      
      <Text style={styles.shareTitle}>📤 SHARE SCORE</Text>
      
      <View style={styles.shareCard}>
        <Text style={styles.shareEmoji}>🎭</Text>
        <Text style={styles.shareScore}>Score: {score}</Text>
        <Text style={styles.shareHighScore}>Best: {highScore}</Text>
        <Text style={styles.shareCombo}>Max Combo: {maxCombo}</Text>
        <Text style={styles.shareLevels}>Levels: {completedLevels.length}/10</Text>
      </View>

      <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
        <Text style={styles.shareButtonText}>📋 Copy Score</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
}

function ScorePopup({ points }) {
  const translateY = useRef(new Animated.Value(-50)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, { toValue: -100, duration: 500, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]).start();
    }, 1000);
  }, []);

  return (
    <Animated.View style={[styles.scorePopup, { transform: [{ translateY }], opacity }]}>
      <Text style={styles.scorePopupText}>+{points}</Text>
    </Animated.View>
  );
}

function AboutScreen({ navigation }) {
  return (
    <View style={styles.aboutContainer}>
      <StatusBar style="light" />
      <ParticleBackground />
      
      <Text style={styles.aboutLogo}>🎭</Text>
      <Text style={styles.aboutTitle}>TROLL GAME</Text>
      <Text style={styles.aboutVersion}>Version {GAME_VERSION}</Text>
      
      <View style={styles.aboutCard}>
        <Text style={styles.aboutDesc}>
          A fun puzzle game where you have to outsmart the trolls!
        </Text>
        <Text style={styles.aboutFeatures}>
          • 10 Story Levels{'\n'}
          • Time Attack{'\n'}
          • Endless Mode{'\n'}
          • Boss Rush{'\n'}
          • Daily Challenges{'\n'}
          • And much more!
        </Text>
      </View>

      <Text style={styles.aboutCopyright}>Made with ❤️</Text>
      <Text style={styles.aboutCredit}>Created by Bhedanikhil</Text>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
}

function LevelCompleteScreen({ navigation, route }) {
  const { points, level, nextLevel } = route.params || { points: 100, level: 1, nextLevel: 2 };
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  return (
    <View style={styles.levelCompleteContainer}>
      <StatusBar style="light" />
      <ParticleBackground />
      
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.levelCompleteEmoji}>🎉</Text>
        <Text style={styles.levelCompleteTitle}>Level {level} Complete!</Text>
        <Text style={styles.levelCompleteScore}>+{points} Points</Text>
        
        <View style={styles.levelCompleteStats}>
          <Text style={styles.levelCompleteNext}>Next: Level {nextLevel}</Text>
        </View>

        <TouchableOpacity 
          style={styles.nextLevelButton} 
          onPress={() => navigation.replace(`Level${nextLevel}`)}
        >
          <Text style={styles.nextLevelButtonText}>Continue →</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => navigation.replace('LevelSelect')}
        >
          <Text style={styles.menuButtonText}>📋 Levels</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

function AchievementsScreen({ navigation }) {
  const { unlockedAchievements, score, maxCombo, completedLevels } = useGame();

  return (
    <View style={styles.achievementsContainer}>
      <StatusBar style="light" />
      <ParticleBackground />
      
      <Text style={styles.achievementsTitle}>🏅 ACHIEVEMENTS</Text>
      
      <View style={styles.achievementsList}>
        {ACHIEVEMENTS.map((ach) => {
          const unlocked = unlockedAchievements.includes(ach.id);
          return (
            <View key={ach.id} style={[styles.achievementCard, !unlocked && styles.achievementLocked]}>
              <Text style={styles.achievementIcon}>{unlocked ? ach.icon : '🔒'}</Text>
              <View style={styles.achievementInfo}>
                <Text style={[styles.achievementName, !unlocked && styles.achievementNameLocked]}>{ach.name}</Text>
                <Text style={[styles.achievementDesc, !unlocked && styles.achievementDescLocked]}>{ach.desc}</Text>
              </View>
            </View>
          );
        })}
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
}

function SettingsScreen({ navigation }) {
  const { soundEnabled, setSoundEnabled, vibrationEnabled, setVibrationEnabled } = useGame();

  return (
    <View style={styles.settingsContainer}>
      <StatusBar style="light" />
      <ParticleBackground />
      
      <Text style={styles.settingsTitle}>⚙️ SETTINGS</Text>
      
      <View style={styles.settingsCard}>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>🔊 Sound Effects</Text>
          <Switch value={soundEnabled} onValueChange={setSoundEnabled} trackColor={{ true: '#2ecc71' }} />
        </View>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>📳 Vibration</Text>
          <Switch value={vibrationEnabled} onValueChange={setVibrationEnabled} trackColor={{ true: '#2ecc71' }} />
        </View>
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={() => {
        Alert.alert('Reset Progress', 'Are you sure?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Reset', style: 'destructive', onPress: () => navigation.replace('MainMenu') }
        ]);
      }}>
        <Text style={styles.resetButtonText}>🔄 Reset Progress</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
}

function GameOverScreen({ navigation }) {
  const { score, resetScore, maxCombo, highScore, combo, resetCombo } = useGame();
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    resetCombo();
  }, []);

  const handleTryAgain = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Level1' }],
    });
  };

  const handleGoHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainMenu' }],
    });
  };

  return (
    <View style={styles.gameOverContainer}>
      <StatusBar style="light" />
      <ParticleBackground />

      <Animated.View style={{ opacity: fadeAnim }}>
        <Text style={styles.gameOverText}>YOU GOT TROLLED!</Text>
        <Text style={styles.cryingEmoji}>😂</Text>
        <Text style={styles.gameOverSubtext}>The troll got you this time...</Text>
        <Text style={styles.scoreDisplay}>Score: {score}</Text>
        {highScore > 0 && (
          <>
            <Text style={styles.highScoreText}>🏆 Best: {highScore}</Text>
            <Text style={styles.maxComboText}>🔥 Max Combo: {maxCombo}</Text>
          </>
        )}

        <TouchableOpacity 
          style={styles.tryAgainButton}
          onPress={handleTryAgain}
          activeOpacity={0.8}
        >
          <Text style={styles.tryAgainText}>Try Again</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.homeButton}
          onPress={handleGoHome}
          activeOpacity={0.8}
        >
          <Text style={styles.homeButtonText}>🏠 Home</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

function LeaderboardScreen({ navigation }) {
  const { score, completedLevels, highScore, maxCombo, multiplier } = useGame();

  return (
    <View style={styles.leaderboardContainer}>
      <StatusBar style="light" />
      <ParticleBackground />

      <Text style={styles.leaderboardTitle}>🏆 STATS</Text>
      
      <View style={styles.statsCard}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Current Score</Text>
          <Text style={styles.statValue}>{score}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>🏆 High Score</Text>
          <Text style={[styles.statValue, { color: '#f1c40f' }]}>{highScore}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>🔥 Max Combo</Text>
          <Text style={styles.statValue}>{maxCombo}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>⚡ Max Multiplier</Text>
          <Text style={styles.statValue}>×{multiplier.toFixed(1)}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Levels Completed</Text>
          <Text style={styles.statValue}>{completedLevels.length}/10</Text>
        </View>
        <View style={[styles.statRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.statLabel}>Rank</Text>
          <Text style={styles.statValue}>
            {score >= 1000 ? '🥇 TROLL MASTER' : 
             score >= 600 ? '🥈 ADVANCED TROLL' :
             score >= 300 ? '🥉 NOVICE TROLL' : '😇 INNOCENT'}
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  const [score, setScore] = useState(0);
  const [completedLevels, setCompletedLevels] = useState([]);
  const [combo, setCombo] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [streak, setStreak] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [currentSkin, setCurrentSkin] = useState('default');
  const [unlockedSkins, setUnlockedSkins] = useState(['default']);
  const [powerUps, setPowerUps] = useState(null);
  const [coins, setCoins] = useState(0);
  const [totalPlays, setTotalPlays] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [lastLoginDay, setLastLoginDay] = useState(0);

  const addScore = (points) => {
    const finalPoints = Math.floor(points * multiplier);
    setScore(prev => {
      const newScore = prev + finalPoints;
      if (newScore > highScore) {
        setHighScore(newScore);
      }
      if (newScore >= 1000) unlockAchievement('perfectionist');
      return newScore;
    });
    setCombo(prev => {
      const newCombo = prev + 1;
      if (newCombo >= 10) unlockAchievement('combo_king');
      return newCombo;
    });
    setStreak(prev => {
      const newStreak = prev + 1;
      if (newStreak > maxCombo) {
        setMaxCombo(newStreak);
      }
      return newStreak;
    });
    
    if (combo >= 2) {
      setMultiplier(prev => Math.min(prev + 0.5, 5));
    }
  };

  const unlockAchievement = (id) => {
    if (!unlockedAchievements.includes(id)) {
      setUnlockedAchievements(prev => [...prev, id]);
      if (vibrationEnabled) Vibration.vibrate(100);
    }
  };

  const resetCombo = () => {
    setCombo(0);
    setMultiplier(1);
    setStreak(0);
  };

  const setCompletedLevel = (level) => {
    setCompletedLevels(prev => {
      if (!prev.includes(level)) {
        const newLevels = [...prev, level];
        if (newLevels.length === 1) unlockAchievement('first_win');
        if (newLevels.length === 10) unlockAchievement('troll_master');
        return newLevels;
      }
      return prev;
    });
  };

  const resetScore = () => {
    setScore(0);
    setCompletedLevels([]);
    setCombo(0);
    setMultiplier(1);
    setStreak(0);
  };

  return (
    <GameContext.Provider value={{ 
      score, 
      addScore, 
      setCompletedLevel, 
      completedLevels,
      resetScore,
      combo,
      multiplier,
      streak,
      maxCombo,
      highScore,
      resetCombo,
      soundEnabled,
      setSoundEnabled,
      vibrationEnabled,
      setVibrationEnabled,
      unlockedAchievements,
      currentTheme,
      setCurrentTheme,
      unlockAchievement,
      currentSkin,
      setCurrentSkin,
      unlockedSkins,
      unlockSkin: (id) => setUnlockedSkins(prev => prev.includes(id) ? prev : [...prev, id]),
      powerUps,
      setPowerUp: (id) => setPowerUps(id),
      coins,
      setCoins,
      totalPlays,
      totalTime,
      lastLoginDay,
      setLastLoginDay
    }}>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="MainMenu"
          screenOptions={{ 
            headerShown: false,
            animation: 'fade',
            contentStyle: { backgroundColor: '#1a1a2e' }
          }}
        >
          <Stack.Screen name="MainMenu" component={MainMenuScreen} />
          <Stack.Screen name="LevelSelect" component={LevelSelectScreen} />
          <Stack.Screen name="Level1" component={Level1Screen} />
          <Stack.Screen name="Level2" component={Level2Screen} />
          <Stack.Screen name="Level3" component={Level3Screen} />
          <Stack.Screen name="Level4" component={Level4Screen} />
          <Stack.Screen name="Level5" component={Level5Screen} />
          <Stack.Screen name="Level6" component={Level6Screen} />
          <Stack.Screen name="Level7" component={Level7Screen} />
          <Stack.Screen name="Level8" component={Level8Screen} />
          <Stack.Screen name="Level9" component={Level9Screen} />
          <Stack.Screen name="Level10" component={Level10Screen} />
          <Stack.Screen name="GameOver" component={GameOverScreen} />
          <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
          <Stack.Screen name="Achievements" component={AchievementsScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="TimeAttack" component={TimeAttackScreen} />
          <Stack.Screen name="DailyChallenge" component={DailyChallengeScreen} />
          <Stack.Screen name="EndlessMode" component={EndlessModeScreen} />
          <Stack.Screen name="Theme" component={ThemeScreen} />
          <Stack.Screen name="PowerUps" component={PowerUpsScreen} />
          <Stack.Screen name="Skins" component={SkinsScreen} />
          <Stack.Screen name="BossRush" component={BossRushScreen} />
          <Stack.Screen name="Tutorial" component={TutorialScreen} />
          <Stack.Screen name="Statistics" component={StatisticsScreen} />
          <Stack.Screen name="RandomEvent" component={RandomEventScreen} />
          <Stack.Screen name="DailyBonus" component={DailyBonusScreen} />
          <Stack.Screen name="QuickPlay" component={QuickPlayScreen} />
          <Stack.Screen name="LevelPreview" component={LevelPreviewScreen} />
          <Stack.Screen name="ShareScore" component={ShareScoreScreen} />
          <Stack.Screen name="About" component={AboutScreen} />
          <Stack.Screen name="LevelComplete" component={LevelCompleteScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GameContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  particlesContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    borderRadius: 100,
    opacity: 0.4,
  },
  menuContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#f1c40f',
    textShadowColor: '#f1c40f',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  emojiDisplay: {
    fontSize: 80,
    marginVertical: 30,
  },
  coinDisplay: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#f39c12',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  coinText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    color: '#eaeaea',
    marginBottom: 60,
    opacity: 0.8,
  },
  startButton: {
    backgroundColor: '#e94560',
    paddingVertical: 20,
    paddingHorizontal: 50,
    borderRadius: 30,
    shadowColor: '#e94560',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 20,
  },
  startButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 2,
  },
  leaderboardButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  leaderboardText: {
    fontSize: 18,
    color: '#f1c40f',
    fontWeight: '600',
  },
  levelSelectContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  levelSelectTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#f1c40f',
    marginBottom: 10,
  },
  totalScore: {
    fontSize: 20,
    color: '#2ecc71',
    marginBottom: 40,
    fontWeight: 'bold',
  },
  levelsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
  },
  levelButton: {
    width: 100,
    height: 100,
    backgroundColor: '#e94560',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    shadowColor: '#e94560',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  levelCompleted: {
    backgroundColor: '#2ecc71',
  },
  levelNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  checkmark: {
    fontSize: 20,
    color: '#ffffff',
    position: 'absolute',
    top: 5,
    right: 5,
  },
  backButton: {
    position: 'absolute',
    bottom: 40,
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  backButtonText: {
    fontSize: 18,
    color: '#eaeaea',
    fontWeight: '600',
  },
  levelContainer: {
    flex: 1,
    backgroundColor: '#16213e',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  levelTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#f1c40f',
    marginBottom: 20,
  },
  hint: {
    fontSize: 16,
    color: '#9b59b6',
    marginTop: 30,
    fontStyle: 'italic',
  },
  instruction: {
    fontSize: 18,
    color: '#eaeaea',
    marginBottom: 40,
    opacity: 0.8,
  },
  fakeButton: {
    width: width * 0.75,
    height: 140,
    borderRadius: 25,
    backgroundColor: '#e94560',
    shadowColor: '#e94560',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.7,
    shadowRadius: 25,
    elevation: 20,
    borderWidth: 5,
    borderColor: '#f1c40f',
  },
  fakeButtonInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e94560',
    borderRadius: 20,
  },
  fakeButtonText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 2,
  },
  secretDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 5,
    height: 5,
    backgroundColor: '#000000',
  },
  gameOverContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  gameOverText: {
    fontSize: Math.min(width * 0.1, 48),
    fontWeight: 'bold',
    color: '#9b59b6',
    textShadowColor: '#9b59b6',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    textAlign: 'center',
    marginBottom: 20,
  },
  cryingEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  scoreDisplay: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f1c40f',
    marginBottom: 10,
  },
  highScoreText: {
    fontSize: 18,
    color: '#f1c40f',
    marginBottom: 5,
  },
  maxComboText: {
    fontSize: 16,
    color: '#e94560',
    marginBottom: 30,
  },
  gameOverSubtext: {
    fontSize: 18,
    color: '#eaeaea',
    marginBottom: 50,
    opacity: 0.7,
    textAlign: 'center',
  },
  tryAgainButton: {
    backgroundColor: '#9b59b6',
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 30,
    shadowColor: '#9b59b6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
    marginBottom: 15,
  },
  tryAgainText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  homeButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  homeButtonText: {
    fontSize: 18,
    color: '#eaeaea',
  },
  level2Container: {
    flex: 1,
    backgroundColor: '#1e3a5f',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  warningText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 10,
    textAlign: 'center',
  },
  boxesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
    marginTop: 40,
  },
  greenBox: {
    width: 120,
    height: 120,
    backgroundColor: '#2ecc71',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2ecc71',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 15,
  },
  greenBoxText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  redBox: {
    width: 70,
    height: 70,
    backgroundColor: '#c0392b',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e74c3c',
  },
  redBoxText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  level3Container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  level3Title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#f1c40f',
    marginBottom: 20,
  },
  level3Subtitle: {
    fontSize: 18,
    color: '#eaeaea',
    marginBottom: 20,
    textAlign: 'center',
  },
  catchContainer: {
    height: 100,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  catchButton: {
    backgroundColor: '#9b59b6',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 25,
    shadowColor: '#9b59b6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 10,
  },
  catchText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  backToMenuButton: {
    position: 'absolute',
    bottom: 40,
    paddingVertical: 15,
  },
  backToMenuText: {
    fontSize: 16,
    color: '#9b59b6',
  },
  level4Container: {
    flex: 1,
    backgroundColor: '#2c3e50',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  level4Title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 20,
  },
  level4Subtitle: {
    fontSize: 18,
    color: '#eaeaea',
    marginBottom: 10,
  },
  mathProblem: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#f1c40f',
    marginBottom: 40,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  optionButton: {
    width: 80,
    height: 80,
    backgroundColor: '#34495e',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#3498db',
  },
  optionText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  level5Container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  level5Title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#f1c40f',
    marginBottom: 20,
  },
  level5Subtitle: {
    fontSize: 18,
    color: '#eaeaea',
    marginBottom: 40,
  },
  countdownContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#2c3e50',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    borderWidth: 5,
    borderColor: '#f1c40f',
  },
  countdownText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#f1c40f',
  },
  finalButton: {
    backgroundColor: '#7f8c8d',
    paddingVertical: 25,
    paddingHorizontal: 60,
    borderRadius: 30,
  },
  finalButtonActive: {
    backgroundColor: '#2ecc71',
    shadowColor: '#2ecc71',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 15,
  },
  finalButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  leaderboardContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  leaderboardTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#f1c40f',
    marginBottom: 40,
  },
  statsCard: {
    backgroundColor: '#16213e',
    borderRadius: 20,
    padding: 30,
    width: '90%',
    elevation: 10,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2c3e50',
  },
  statLabel: {
    fontSize: 18,
    color: '#eaeaea',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  comboContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    flexDirection: 'row',
    gap: 10,
    zIndex: 100,
  },
  comboBadge: {
    backgroundColor: '#e94560',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#e94560',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  comboText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  multiplierBadge: {
    backgroundColor: '#f1c40f',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#f1c40f',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  multiplierText: {
    color: '#1a1a2e',
    fontWeight: 'bold',
    fontSize: 16,
  },
  scoreDisplayContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    alignItems: 'flex-start',
  },
  scoreText: {
    color: '#f1c40f',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: '#f1c40f',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  newHighScore: {
    color: '#e94560',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
  },
  level6Container: {
    flex: 1,
    backgroundColor: '#2c3e50',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  level6Title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 20,
  },
  level6Subtitle: {
    fontSize: 18,
    color: '#eaeaea',
    marginBottom: 30,
  },
  buttonMaze: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 30,
  },
  fakeButton2: {
    width: 80,
    height: 80,
    backgroundColor: '#e74c3c',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fakeButton2Text: {
    color: '#fff',
    fontWeight: 'bold',
  },
  realButton: {
    width: 200,
    height: 60,
    backgroundColor: '#34495e',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.3,
  },
  realButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  hintButton: {
    marginTop: 20,
    padding: 10,
  },
  hintButtonText: {
    color: '#f39c12',
    fontSize: 16,
  },
  hintPopup: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#e74c3c',
    borderRadius: 10,
  },
  hintPopupText: {
    color: '#fff',
    fontSize: 16,
  },
  level7Container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  level7Title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#9b59b6',
    marginBottom: 20,
  },
  level7Subtitle: {
    fontSize: 18,
    color: '#eaeaea',
    marginBottom: 10,
  },
  passwordHint: {
    fontSize: 14,
    color: '#f39c12',
    marginBottom: 30,
    fontStyle: 'italic',
  },
  passwordInput: {
    width: '80%',
    height: 50,
    backgroundColor: '#2c3e50',
    borderRadius: 25,
    paddingHorizontal: 20,
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#9b59b6',
  },
  submitButton: {
    backgroundColor: '#9b59b6',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  level8Container: {
    flex: 1,
    backgroundColor: '#0a0a15',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  level8Title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 30,
    textShadowColor: '#e74c3c',
    textShadowRadius: 15,
  },
  bossContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  bossEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  bossHealthBar: {
    width: 200,
    height: 20,
    backgroundColor: '#2c3e50',
    borderRadius: 10,
    overflow: 'hidden',
  },
  bossHealthFill: {
    height: '100%',
    backgroundColor: '#e74c3c',
  },
  bossHealthText: {
    color: '#e74c3c',
    marginTop: 5,
    fontWeight: 'bold',
  },
  playerStats: {
    marginBottom: 30,
  },
  healthText: {
    fontSize: 24,
    color: '#2ecc71',
    fontWeight: 'bold',
  },
  bossButtons: {
    flexDirection: 'row',
    gap: 20,
  },
  attackButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  attackButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  trapButton: {
    backgroundColor: '#f39c12',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  trapButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  bossHint: {
    marginTop: 30,
    color: '#7f8c8d',
    fontSize: 14,
    fontStyle: 'italic',
  },
  timeAttackContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  timerContainer: {
    position: 'absolute',
    top: 50,
  },
  timerText: {
    fontSize: 36,
    color: '#e94560',
    fontWeight: 'bold',
  },
  timeAttackTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#f1c40f',
    marginBottom: 10,
  },
  timeAttackLevel: {
    fontSize: 20,
    color: '#2ecc71',
    marginBottom: 40,
  },
  timeAttackButtons: {
    gap: 20,
  },
  timeButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 20,
    paddingHorizontal: 50,
    borderRadius: 20,
    width: 200,
    alignItems: 'center',
  },
  timeFailButton: {
    backgroundColor: '#e74c3c',
  },
  timeButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  achievementsContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  achievementsTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#f1c40f',
    marginBottom: 30,
  },
  achievementsList: {
    width: '100%',
    gap: 15,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    padding: 15,
    borderRadius: 15,
    gap: 15,
  },
  achievementLocked: {
    opacity: 0.5,
  },
  achievementIcon: {
    fontSize: 30,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  achievementNameLocked: {
    color: '#7f8c8d',
  },
  achievementDesc: {
    fontSize: 14,
    color: '#eaeaea',
  },
  achievementDescLocked: {
    color: '#7f8c8d',
  },
  settingsContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  settingsTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 40,
  },
  settingsCard: {
    backgroundColor: '#16213e',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    marginBottom: 30,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2c3e50',
  },
  settingLabel: {
    fontSize: 18,
    color: '#eaeaea',
  },
  resetButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginBottom: 30,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuButtonsRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },
  menuButtonSmall: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  menuButtonSmallText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  level9Container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  level9Title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#9b59b6',
    marginBottom: 20,
  },
  level9Subtitle: {
    fontSize: 18,
    color: '#eaeaea',
    marginBottom: 20,
  },
  level9Hint: {
    fontSize: 14,
    color: '#f39c12',
    marginBottom: 30,
    fontStyle: 'italic',
  },
  diamondButtons: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 30,
  },
  diamondButton: {
    width: 60,
    height: 60,
    backgroundColor: '#34495e',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diamondButtonGold: {
    backgroundColor: '#f1c40f',
  },
  diamondEmoji: {
    fontSize: 30,
  },
  hintRevealButton: {
    padding: 10,
    marginBottom: 20,
  },
  hintRevealText: {
    color: '#f39c12',
    fontSize: 16,
  },
  attemptText: {
    color: '#e94560',
    fontSize: 16,
  },
  level10Container: {
    flex: 1,
    backgroundColor: '#0a0a15',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  level10Title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#00ff00',
    marginBottom: 20,
    textShadowColor: '#00ff00',
    textShadowRadius: 15,
  },
  level10Subtitle: {
    fontSize: 20,
    color: '#eaeaea',
    marginBottom: 40,
  },
  watchText: {
    fontSize: 20,
    color: '#f1c40f',
    marginBottom: 20,
  },
  sequencePreview: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 30,
  },
  sequenceItem: {
    fontSize: 40,
  },
  startPlayButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  startPlayText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'center',
  },
  colorButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34495e',
  },
  colorButtonText: {
    fontSize: 40,
  },
  dailyChallengeContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  dailyHeader: {
    position: 'absolute',
    top: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  dailyTitle: {
    fontSize: 24,
    color: '#f1c40f',
    fontWeight: 'bold',
  },
  dailyTimer: {
    fontSize: 24,
    color: '#e94560',
    fontWeight: 'bold',
  },
  dailyProgress: {
    alignItems: 'center',
    marginBottom: 40,
  },
  dailyProgressText: {
    fontSize: 18,
    color: '#eaeaea',
    marginBottom: 15,
  },
  progressDots: {
    flexDirection: 'row',
    gap: 15,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#34495e',
  },
  dotCompleted: {
    backgroundColor: '#2ecc71',
  },
  challengeCard: {
    backgroundColor: '#16213e',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 30,
    width: '80%',
  },
  challengeTitle: {
    fontSize: 24,
    color: '#f1c40f',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  challengeDesc: {
    fontSize: 16,
    color: '#eaeaea',
    marginBottom: 10,
  },
  challengeNumber: {
    fontSize: 14,
    color: '#9b59b6',
  },
  completeChallengeButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 20,
    paddingHorizontal: 50,
    borderRadius: 30,
  },
  completeChallengeText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  endlessContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  endlessStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  endlessLevel: {
    fontSize: 24,
    color: '#3498db',
    fontWeight: 'bold',
  },
  endlessHealth: {
    fontSize: 24,
    color: '#e94560',
    fontWeight: 'bold',
  },
  endlessTitle: {
    fontSize: 40,
    color: '#f1c40f',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  endlessScore: {
    fontSize: 20,
    color: '#2ecc71',
    marginBottom: 40,
  },
  endlessButtons: {
    flexDirection: 'row',
    gap: 20,
  },
  passButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 25,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  passButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  failButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 25,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  failButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  themeContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  themeTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#f1c40f',
    marginBottom: 40,
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
  },
  themeCard: {
    width: 120,
    height: 120,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#34495e',
  },
  themeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  themePreview: {
    fontSize: 30,
  },
  powerupsContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  powerupsTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#f1c40f',
    marginBottom: 10,
  },
  coinsDisplay: {
    fontSize: 24,
    color: '#f39c12',
    marginBottom: 30,
  },
  powerupsList: {
    width: '100%',
    gap: 15,
  },
  powerupCard: {
    backgroundColor: '#16213e',
    padding: 20,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  powerupIcon: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  powerupDesc: {
    fontSize: 14,
    color: '#eaeaea',
    flex: 1,
    marginLeft: 10,
  },
  powerupCost: {
    fontSize: 16,
    color: '#f39c12',
    fontWeight: 'bold',
  },
  skinsContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  skinsTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#9b59b6',
    marginBottom: 10,
  },
  skinsScore: {
    fontSize: 20,
    color: '#2ecc71',
    marginBottom: 30,
  },
  skinsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
  },
  skinCard: {
    width: 90,
    height: 110,
    backgroundColor: '#16213e',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#34495e',
  },
  skinCardActive: {
    borderColor: '#f1c40f',
    backgroundColor: '#2c3e50',
  },
  skinCardLocked: {
    opacity: 0.5,
  },
  skinEmoji: {
    fontSize: 40,
    marginBottom: 5,
  },
  skinName: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  skinNameLocked: {
    color: '#7f8c8d',
  },
  skinUnlock: {
    fontSize: 10,
    color: '#f39c12',
  },
  bossRushContainer: {
    flex: 1,
    backgroundColor: '#0a0a15',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  bossRushTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 10,
  },
  bossRushProgress: {
    fontSize: 20,
    color: '#f1c40f',
    marginBottom: 30,
  },
  bossDisplay: {
    alignItems: 'center',
    marginBottom: 30,
  },
  bossRushEmoji: {
    fontSize: 80,
    marginBottom: 10,
  },
  bossRushName: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  bossRushHpBar: {
    width: 200,
    height: 20,
    backgroundColor: '#2c3e50',
    borderRadius: 10,
    overflow: 'hidden',
  },
  bossRushHpFill: {
    height: '100%',
    backgroundColor: '#e74c3c',
  },
  bossRushHpText: {
    color: '#e74c3c',
    marginTop: 5,
    fontWeight: 'bold',
  },
  playerHealth: {
    fontSize: 24,
    color: '#2ecc71',
    marginBottom: 30,
  },
  bossRushButtons: {
    flexDirection: 'row',
    gap: 20,
  },
  attackButtonLarge: {
    backgroundColor: '#e74c3c',
    paddingVertical: 25,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  attackButtonTextLarge: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  failButtonLarge: {
    backgroundColor: '#f39c12',
    paddingVertical: 25,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  failButtonTextLarge: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  tutorialContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  tutorialProgress: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 40,
  },
  tutorialDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#34495e',
  },
  tutorialDotActive: {
    backgroundColor: '#f1c40f',
  },
  tutorialEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  tutorialTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f1c40f',
    marginBottom: 20,
    textAlign: 'center',
  },
  tutorialContent: {
    fontSize: 18,
    color: '#eaeaea',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 40,
  },
  nextButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 25,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statsContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  statsTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 30,
  },
  randomEventContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  randomEventEmoji: {
    fontSize: 80,
    marginBottom: 30,
  },
  randomEventText: {
    fontSize: 28,
    color: '#f1c40f',
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  claimButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 25,
    paddingHorizontal: 60,
    borderRadius: 30,
  },
  claimButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  dailyBonusContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  dailyBonusTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#f1c40f',
    marginBottom: 10,
  },
  dailyBonusSubtitle: {
    fontSize: 18,
    color: '#eaeaea',
    marginBottom: 30,
  },
  dailyRewardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  dailyRewardCard: {
    width: 100,
    height: 90,
    backgroundColor: '#16213e',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#34495e',
  },
  dailyRewardClaimed: {
    backgroundColor: '#2ecc71',
    borderColor: '#27ae60',
  },
  dailyRewardCurrent: {
    borderColor: '#f1c40f',
    backgroundColor: '#2c3e50',
  },
  dailyDayText: {
    fontSize: 14,
    color: '#9b59b6',
    fontWeight: 'bold',
  },
  dailyRewardText: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
  },
  checkMark: {
    fontSize: 20,
    color: '#fff',
    marginTop: 5,
  },
  quickPlayContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  quickPlayTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#2ecc71',
    marginBottom: 20,
  },
  quickPlayLevel: {
    fontSize: 24,
    color: '#f1c40f',
    marginBottom: 10,
  },
  quickPlayScore: {
    fontSize: 30,
    color: '#fff',
    marginBottom: 40,
  },
  quickPlayButtons: {
    flexDirection: 'row',
    gap: 30,
    marginBottom: 30,
  },
  quickWinButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 25,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  quickWinText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  quickLoseButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 25,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  quickLoseText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  quickPlayHint: {
    fontSize: 14,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  levelPreviewContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  levelPreviewTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 20,
  },
  levelPreviewList: {
    width: '100%',
    gap: 10,
  },
  levelPreviewCard: {
    backgroundColor: '#16213e',
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#e94560',
  },
  levelPreviewCompleted: {
    borderLeftColor: '#2ecc71',
    backgroundColor: '#1e3a2f',
  },
  levelPreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  levelPreviewNum: {
    fontSize: 16,
    color: '#f1c40f',
    fontWeight: 'bold',
  },
  levelPreviewName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  levelPreviewDiff: {
    fontSize: 12,
    color: '#9b59b6',
    marginTop: 5,
  },
  levelPreviewTip: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 5,
    fontStyle: 'italic',
  },
  levelPreviewCheck: {
    fontSize: 12,
    color: '#2ecc71',
    marginTop: 5,
  },
  shareContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  shareTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 30,
  },
  shareCard: {
    backgroundColor: '#16213e',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    width: '80%',
    marginBottom: 30,
  },
  shareEmoji: {
    fontSize: 60,
    marginBottom: 15,
  },
  shareScore: {
    fontSize: 28,
    color: '#f1c40f',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  shareHighScore: {
    fontSize: 18,
    color: '#eaeaea',
    marginBottom: 5,
  },
  shareCombo: {
    fontSize: 16,
    color: '#e94560',
    marginBottom: 5,
  },
  shareLevels: {
    fontSize: 16,
    color: '#2ecc71',
  },
  shareButton: {
    backgroundColor: '#3498db',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scorePopup: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    backgroundColor: '#f1c40f',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    zIndex: 1000,
  },
  scorePopupText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  aboutContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  aboutLogo: {
    fontSize: 80,
    marginBottom: 20,
  },
  aboutTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#f1c40f',
    marginBottom: 10,
  },
  aboutVersion: {
    fontSize: 18,
    color: '#9b59b6',
    marginBottom: 30,
  },
  aboutCard: {
    backgroundColor: '#16213e',
    padding: 25,
    borderRadius: 20,
    width: '85%',
    marginBottom: 30,
  },
  aboutDesc: {
    fontSize: 16,
    color: '#eaeaea',
    textAlign: 'center',
    marginBottom: 20,
  },
  aboutFeatures: {
    fontSize: 14,
    color: '#2ecc71',
    lineHeight: 24,
  },
  aboutCopyright: {
    fontSize: 16,
    color: '#e94560',
    marginBottom: 10,
  },
  aboutCredit: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 30,
  },
  levelCompleteContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  levelCompleteEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  levelCompleteTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2ecc71',
    marginBottom: 10,
  },
  levelCompleteScore: {
    fontSize: 28,
    color: '#f1c40f',
    marginBottom: 30,
  },
  levelCompleteStats: {
    marginBottom: 30,
  },
  levelCompleteNext: {
    fontSize: 18,
    color: '#3498db',
  },
  nextLevelButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginBottom: 15,
  },
  nextLevelButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
  menuButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});
