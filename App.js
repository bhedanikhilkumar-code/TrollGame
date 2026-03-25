import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, Alert, Dimensions, Animated, Easing, Image } from 'react-native';

const Stack = createNativeStackNavigator();
const { width, height } = Dimensions.get('window');

const GameContext = createContext();

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
  const { playSound } = useGame();
  const [menuAnim] = useState(new Animated.Value(0));

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
        <Text style={styles.emojiDisplay}>😈</Text>
        
        <TouchableOpacity 
          style={styles.startButton}
          onPress={handleStart}
          activeOpacity={0.8}
        >
          <PulseAnimation>
            <Text style={styles.startButtonText}>START TROLLING</Text>
          </PulseAnimation>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.leaderboardButton}
          onPress={() => navigation.navigate('Leaderboard')}
          activeOpacity={0.8}
        >
          <Text style={styles.leaderboardText}>🏆 Leaderboard</Text>
        </TouchableOpacity>
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
        {[1, 2, 3, 4, 5].map((level) => (
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
          <Text style={styles.statValue}>{completedLevels.length}/5</Text>
        </View>
        <View style={[styles.statRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.statLabel}>Rank</Text>
          <Text style={styles.statValue}>
            {score >= 850 ? '🥇 TROLL MASTER' : 
             score >= 500 ? '🥈 ADVANCED TROLL' :
             score >= 200 ? '🥉 NOVICE TROLL' : '😇 INNOCENT'}
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
  const soundManager = useRef(new SoundManager());

  const addScore = (points) => {
    const finalPoints = Math.floor(points * multiplier);
    setScore(prev => {
      const newScore = prev + finalPoints;
      if (newScore > highScore) {
        setHighScore(newScore);
      }
      return newScore;
    });
    setCombo(prev => prev + 1);
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

  const resetCombo = () => {
    setCombo(0);
    setMultiplier(1);
    setStreak(0);
  };

  const setCompletedLevel = (level) => {
    setCompletedLevels(prev => {
      if (!prev.includes(level)) {
        return [...prev, level];
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
      playSound: soundManager.current.playSound 
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
          <Stack.Screen name="GameOver" component={GameOverScreen} />
          <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
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
});
