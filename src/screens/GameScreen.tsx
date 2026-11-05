import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AppShell from '../components/AppShell';
import ScreenHeader from '../components/ScreenHeader';
import NavChip from '../components/NavChip';
import AcornCounter from '../components/AcornCounter';
import WordSlots from '../components/WordSlots';
import PictureCard from '../components/PictureCard';
import SoundPulse from '../components/SoundPulse';
import FallingAcorn from '../components/FallingAcorn';
import BasketRig from '../components/BasketRig';
import WoodBand from '../components/WoodBand';
import { SpeakerHighIcon } from '../components/icons';
import assets from '../assets';
import theme from '../constants/theme';
import {
  ACORN,
  BASKET_BOTTOM,
  BASKET_H,
  FORCE_NEEDED_EVERY,
  LANES,
  MAX_ACORNS,
  ROUND_INTRO_MS,
  ROUND_OUTRO_MS,
  SPAWN_MS,
} from '../constants/config';
import { pickLetter } from '../game/catchEngine';
import { soundOf } from '../game/letterSounds';
import { useBasketDrag } from '../hooks/useBasketDrag';
import { useAcornSpawner } from '../hooks/useAcornSpawner';

const { width: SCREEN_W } = Dimensions.get('window');
const PLAY_MAX_W = Math.min(SCREEN_W - 32, 380);
const PLAY_FRAME = 6 + 2; // pad + border
const LANE_W = Math.floor((PLAY_MAX_W - 2 * PLAY_FRAME) / LANES);
const PLAY_W = LANE_W * LANES + 2 * PLAY_FRAME;
const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type Acorn = { id: number; letter: string; x: number };

type Props = {
  word: string;
  setName: string;
  acorns: number;
  fallMs: number;
  lowercase: boolean;
  bedtime: boolean;
  onCatchLetter: (letter: string) => void;
  onGameOver: (word: string, caught: number, total: number) => void;
  onPause: () => void;
};

export function GameScreen({
  word,
  setName,
  acorns,
  fallMs,
  lowercase,
  bedtime,
  onCatchLetter,
  onGameOver,
  onPause,
}: Props) {
  const total = word.length;
  const [caught, setCaught] = useState<boolean[]>(() =>
    new Array(total).fill(false),
  );
  const [falling, setFalling] = useState<Acorn[]>([]);
  const [playH, setPlayH] = useState(0);
  const [status, setStatus] = useState<'intro' | 'playing' | 'complete'>('intro');
  const [pulse, setPulse] = useState(0);
  const [lastSound, setLastSound] = useState('');

  const caughtRef = useRef(caught);
  const fallingRef = useRef(falling);
  const idRef = useRef(0);
  const sinceNeeded = useRef(0);
  const gameOverRef = useRef(onGameOver);
  caughtRef.current = caught;
  fallingRef.current = falling;
  gameOverRef.current = onGameOver;

  const { translateX, xRef, panHandlers } = useBasketDrag(PLAY_W);

  const basketTop = Math.max(0, playH - BASKET_BOTTOM - BASKET_H);

  // A fresh word resets the round.
  useEffect(() => {
    sinceNeeded.current = 0;
    idRef.current = 0;
    setCaught(new Array(word.length).fill(false));
    setFalling([]);
    setPulse(0);
    setLastSound('');
    setStatus('intro');
    const timer = setTimeout(() => setStatus('playing'), ROUND_INTRO_MS);
    return () => clearTimeout(timer);
  }, [word]);

  const handleSpawn = useCallback(() => {
    if (fallingRef.current.length >= MAX_ACORNS) {
      return;
    }
    const force = sinceNeeded.current >= FORCE_NEEDED_EVERY - 1;
    const letter = pickLetter(word, caughtRef.current, force);
    const needed = caughtRef.current.indexOf(false);
    if (needed !== -1 && word[needed] === letter) {
      sinceNeeded.current = 0;
    } else {
      sinceNeeded.current += 1;
    }
    const lane = Math.floor(Math.random() * LANES);
    const x = PLAY_FRAME + lane * LANE_W + (LANE_W - ACORN) / 2;
    idRef.current += 1;
    const next: Acorn = { id: idRef.current, letter, x };
    setFalling(prev => [...prev, next]);
  }, [word]);

  useAcornSpawner({
    active: status === 'playing' && playH > 0,
    spawnMs: SPAWN_MS,
    onSpawn: handleSpawn,
  });

  const handleVerdict = useCallback(
    (_id: number, letter: string) => {
      const current = caughtRef.current;
      const idx = current.indexOf(false);
      if (idx === -1 || current[idx] === true) {
        return false;
      }
      if (word[idx] !== letter) {
        return false;
      }
      const updated = current.slice();
      updated[idx] = true;
      caughtRef.current = updated;
      setCaught(updated);
      setPulse(p => p + 1);
      setLastSound(soundOf(letter));
      onCatchLetter(letter);
      if (updated.every(Boolean)) {
        setStatus('complete');
      }
      return true;
    },
    [word, onCatchLetter],
  );

  const handleDone = useCallback((id: number) => {
    setFalling(prev => prev.filter(a => a.id !== id));
  }, []);

  // The round closes on the Word Reveal screen (rule #12).
  useEffect(() => {
    if (status !== 'complete') {
      return;
    }
    const timer = setTimeout(
      () => gameOverRef.current(word, word.length, word.length),
      ROUND_OUTRO_MS,
    );
    return () => clearTimeout(timer);
  }, [status, word]);

  const onPlayLayout = useCallback((e: LayoutChangeEvent) => {
    setPlayH(Math.round(e.nativeEvent.layout.height));
  }, []);

  const replaySound = useCallback(() => {
    setPulse(p => p + 1);
    const idx = caughtRef.current.indexOf(false);
    setLastSound(soundOf(idx === -1 ? word[word.length - 1] : word[idx]));
  }, [word]);

  const caughtCount = useMemo(() => caught.filter(Boolean).length, [caught]);

  return (
    <AppShell variant="play" dim={bedtime}>
      <ScreenHeader
        tone="surface"
        leftSlot={
          <NavChip label="PAUSE" image={assets.iconPause} onPress={onPause} />
        }
        titleNode={
          <WordSlots
            word={word}
            caught={caught}
            size="header"
            lowercase={lowercase}
          />
        }
        rightSlot={<AcornCounter count={acorns} />}
      />

      <View style={styles.strip} pointerEvents="box-none">
        <View style={styles.stripCard} pointerEvents="box-none">
          <View style={styles.stripHighlight} pointerEvents="none" />
          <PictureCard
            word={word}
            size={64}
            lowercase={lowercase}
            showCaption={false}
          />
          <View style={styles.stripText} pointerEvents="none">
            <Text style={styles.stripWord} numberOfLines={1}>
              {lowercase ? word.toLowerCase() : word}
            </Text>
            <Text style={styles.stripHint} numberOfLines={1}>
              {lastSound
                ? 'IT SAYS "' + lastSound + '"'
                : setName + ' - ' + caughtCount + ' OF ' + total}
            </Text>
          </View>
          <Pressable
            onPress={replaySound}
            hitSlop={HIT}
            accessibilityRole="button"
            accessibilityLabel="SOUND IT OUT"
            style={styles.speaker}>
            <View style={styles.speakerInner} pointerEvents="none">
              <SpeakerHighIcon
                size={24}
                color={theme.colors.earth.chestnut}
                weight="duotone"
                duotoneColor={theme.colors.earth.mustard}
                duotoneOpacity={0.5}
              />
            </View>
          </Pressable>
        </View>
        <View style={styles.pulseAnchor} pointerEvents="none">
          <SoundPulse trigger={pulse} size={56} />
        </View>
      </View>

      <View style={styles.playOuter} pointerEvents="box-none">
        <View style={styles.play} onLayout={onPlayLayout} pointerEvents="box-none">
          {falling.map(a => (
            <FallingAcorn
              key={a.id}
              id={a.id}
              letter={a.letter}
              x={a.x}
              fallMs={fallMs}
              playH={playH}
              basketTop={basketTop}
              basketXRef={xRef}
              onVerdict={handleVerdict}
              onDone={handleDone}
            />
          ))}

          <WoodBand width={PLAY_W} />

          {playH > 0 ? <BasketRig translateX={translateX} /> : null}

          <View style={styles.tray} pointerEvents="none">
            <WordSlots
              word={word}
              caught={caught}
              size="tray"
              lowercase={lowercase}
              showSounds
            />
          </View>

          <View style={styles.dragLayer} {...panHandlers} />
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  strip: {
    height: 96,
    marginHorizontal: 16,
    marginTop: 8,
    justifyContent: 'center',
  },
  stripCard: {
    height: 84,
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    borderColor: theme.colors.ui.border,
    backgroundColor: theme.colors.bg.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 12,
    overflow: 'hidden',
    shadowColor: theme.colors.ui.shadow,
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  stripHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  stripText: { flex: 1 },
  stripWord: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '900',
    letterSpacing: 2,
    color: theme.colors.text.primary,
  },
  stripHint: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.text.secondary,
  },
  speaker: { width: 48, height: 48, borderRadius: theme.radius.md },
  speakerInner: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(160,82,45,0.10)',
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseAnchor: {
    position: 'absolute',
    right: 14,
    top: 20,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playOuter: { flex: 1, alignItems: 'center' },
  play: {
    flex: 1,
    width: PLAY_W,
    alignSelf: 'center',
  },
  tray: {
    position: 'absolute',
    left: 8,
    right: 8,
    bottom: 16,
    height: 62,
    borderRadius: theme.radius.lg,
    borderWidth: 1.5,
    borderColor: theme.colors.ui.border,
    backgroundColor: 'rgba(246,241,222,0.94)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.ui.shadow,
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  dragLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '42%',
    bottom: 0,
    backgroundColor: 'transparent',
  },
});

export default GameScreen;
