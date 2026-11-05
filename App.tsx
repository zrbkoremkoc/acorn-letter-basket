/**
 * AcornLetterBasket - App.tsx is the state machine only. No gameplay here.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StatusBar, StyleSheet, View } from 'react-native';
import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';
import WordSetsScreen from './src/screens/WordSetsScreen';
import GameScreen from './src/screens/GameScreen';
import GameOverScreen from './src/screens/GameOverScreen';
import LetterSoundsScreen from './src/screens/LetterSoundsScreen';
import GrownUpsScreen from './src/screens/GrownUpsScreen';
import theme from './src/constants/theme';
import {
  BEDTIME_MULTIPLIER,
  FALL_MS,
  SpeedKey,
} from './src/constants/config';
import { useProgress, masteredCount } from './src/hooks/useProgress';
import { WORD_SETS, SetId, getSet } from './src/game/wordSets';

type Screen =
  | 'loader'
  | 'menu'
  | 'wordsets'
  | 'game'
  | 'gameover'
  | 'letters'
  | 'grownups';

type RoundResult = {
  word: string;
  caught: number;
  total: number;
  sticker: boolean;
};

export default function App() {
  const [screen, setScreen] = useState<Screen>('loader');
  const [setId, setSetId] = useState<SetId>('animals');
  const [wordIndex, setWordIndex] = useState(0);
  const [result, setResult] = useState<RoundResult | null>(null);

  const [speed, setSpeed] = useState<SpeedKey>('normal');
  const [lowercase, setLowercase] = useState(false);
  const [bedtime, setBedtime] = useState(false);

  const { progress, registerCatch, completeWord, reset } = useProgress();

  const fade = useRef(new Animated.Value(1)).current;
  const pending = useRef<Screen | null>(null);

  const go = useCallback(
    (next: Screen) => {
      if (pending.current === next) {
        return;
      }
      pending.current = next;
      Animated.timing(fade, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start(() => {
        setScreen(next);
        pending.current = null;
        Animated.timing(fade, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }).start();
      });
    },
    [fade],
  );

  const activeSet = getSet(setId);
  const word = activeSet.words[wordIndex % activeSet.words.length];
  const fallMs = Math.round(FALL_MS[speed] * (bedtime ? BEDTIME_MULTIPLIER : 1));

  const startSet = useCallback((id: SetId) => {
    setSetId(id);
    setWordIndex(0);
  }, []);

  const handleGameOver = useCallback(
    (finishedWord: string, caught: number, total: number) => {
      const set = getSet(setId);
      const learnedInSet = set.words.filter(
        w => w === finishedWord || progress.learnedWords.includes(w),
      ).length;
      const sticker = learnedInSet >= set.words.length;
      completeWord(finishedWord, sticker);
      setResult({ word: finishedWord, caught, total, sticker });
      go('gameover');
    },
    [setId, progress.learnedWords, completeWord, go],
  );

  const handlePlayAgain = useCallback(() => {
    const set = getSet(setId);
    const nextIndex = wordIndex + 1;
    if (nextIndex < set.words.length) {
      setWordIndex(nextIndex);
      go('game');
      return;
    }
    const order = WORD_SETS.findIndex(s => s.id === set.id);
    const nextSet = WORD_SETS[(order + 1) % WORD_SETS.length];
    setSetId(nextSet.id);
    setWordIndex(0);
    go('game');
  }, [setId, wordIndex, go]);

  const handleReset = useCallback(() => {
    reset();
    setWordIndex(0);
    setSetId('animals');
  }, [reset]);

  useEffect(() => {
    StatusBar.setBarStyle(screen === 'loader' ? 'light-content' : 'dark-content');
  }, [screen]);

  const lettersMastered = masteredCount(progress.letterHits);

  return (
    <View style={styles.root}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={screen === 'loader' ? 'light-content' : 'dark-content'}
      />
      <Animated.View
        pointerEvents="box-none"
        style={[styles.root, { opacity: fade }]}>
        {screen === 'loader' ? <LoaderScreen onDone={() => go('menu')} /> : null}

        {screen === 'menu' ? (
          <MenuScreen
            acorns={progress.acorns}
            wordsLearned={progress.learnedWords.length}
            lettersMastered={lettersMastered}
            bedtime={bedtime}
            onStart={() => go('wordsets')}
            onLetters={() => go('letters')}
            onGrownUps={() => go('grownups')}
          />
        ) : null}

        {screen === 'wordsets' ? (
          <WordSetsScreen
            learnedWords={progress.learnedWords}
            selected={setId}
            bedtime={bedtime}
            onSelect={startSet}
            onStart={id => {
              startSet(id);
              go('game');
            }}
            onBack={() => go('menu')}
            onHome={() => go('menu')}
          />
        ) : null}

        {screen === 'game' ? (
          <GameScreen
            key={activeSet.id + '-' + word}
            word={word}
            setName={activeSet.name}
            acorns={progress.acorns}
            fallMs={fallMs}
            lowercase={lowercase}
            bedtime={bedtime}
            onCatchLetter={registerCatch}
            onGameOver={handleGameOver}
            onPause={() => go('menu')}
          />
        ) : null}

        {screen === 'gameover' && result ? (
          <GameOverScreen
            key={result.word}
            word={result.word}
            caughtLetters={result.caught}
            totalLetters={result.total}
            wordsLearned={progress.learnedWords.length}
            stickerEarned={result.sticker}
            lowercase={lowercase}
            bedtime={bedtime}
            onPlayAgain={handlePlayAgain}
            onMenu={() => go('menu')}
          />
        ) : null}

        {screen === 'letters' ? (
          <LetterSoundsScreen
            letterHits={progress.letterHits}
            lowercase={lowercase}
            bedtime={bedtime}
            onBack={() => go('menu')}
            onHome={() => go('menu')}
          />
        ) : null}

        {screen === 'grownups' ? (
          <GrownUpsScreen
            speed={speed}
            lowercase={lowercase}
            bedtime={bedtime}
            onSpeed={setSpeed}
            onCase={setLowercase}
            onBedtime={setBedtime}
            onReset={handleReset}
            onBack={() => go('menu')}
            onHome={() => go('menu')}
          />
        ) : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg.primary },
});
