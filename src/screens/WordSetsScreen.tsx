import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import AppShell from '../components/AppShell';
import ScreenHeader from '../components/ScreenHeader';
import NavChip from '../components/NavChip';
import SetCard from '../components/SetCard';
import PrimaryButton from '../components/PrimaryButton';
import {
  CaretLeftIcon,
  CarIcon,
  CarrotIcon,
  DogIcon,
  HouseIcon,
  PlayIcon,
  StarIcon,
  SunIcon,
} from '../components/icons';
import type { PhosphorIcon } from '../components/icons';
import assets from '../assets';
import theme from '../constants/theme';
import { WORD_SETS, SetId, WordSet } from '../game/wordSets';

const { width: SCREEN_W } = Dimensions.get('window');
const GRID_MAX_W = Math.min(SCREEN_W - 32, 380);
const GRID_FRAME = 6 + 2; // pad + border
const GAP = 12;
const CARD_W = Math.floor((GRID_MAX_W - 2 * GRID_FRAME - GAP) / 2);
const GRID_W = CARD_W * 2 + GAP + 2 * GRID_FRAME;

const ICONS: Record<WordSet['icon'], PhosphorIcon> = {
  dog: DogIcon,
  carrot: CarrotIcon,
  house: HouseIcon,
  sun: SunIcon,
  car: CarIcon,
  star: StarIcon,
};

type Props = {
  learnedWords: string[];
  selected: SetId;
  bedtime: boolean;
  onSelect: (id: SetId) => void;
  onStart: (id: SetId) => void;
  onBack: () => void;
  onHome: () => void;
};

export function WordSetsScreen({
  learnedWords,
  selected,
  bedtime,
  onSelect,
  onStart,
  onBack,
  onHome,
}: Props) {
  const [lockedNote, setLockedNote] = useState('');
  const rise = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.timing(rise, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [rise]);

  const doneCounts = useMemo(() => {
    const map: Record<string, number> = {};
    WORD_SETS.forEach(set => {
      map[set.id] = set.words.filter(w => learnedWords.includes(w)).length;
    });
    return map;
  }, [learnedWords]);

  const isLocked = useCallback(
    (set: WordSet) => {
      if (!set.unlockAfter) {
        return false;
      }
      const gate = WORD_SETS.find(s => s.id === set.unlockAfter);
      if (!gate) {
        return false;
      }
      return (doneCounts[gate.id] ?? 0) < 2;
    },
    [doneCounts],
  );

  const handleCard = useCallback(
    (set: WordSet) => {
      if (isLocked(set)) {
        setLockedNote('FINISH ' + (set.unlockAfter ?? '').toUpperCase() + ' FIRST');
        return;
      }
      setLockedNote('');
      onSelect(set.id);
    },
    [isLocked, onSelect],
  );

  const selectedSet = WORD_SETS.find(s => s.id === selected) ?? WORD_SETS[0];

  return (
    <AppShell variant="paper" dim={bedtime}>
      <ScreenHeader
        title="WORD SETS"
        leftSlot={
          <NavChip label="BACK" Icon={CaretLeftIcon} onPress={onBack} />
        }
        rightSlot={
          <NavChip label="HOME" image={assets.iconHome} onPress={onHome} />
        }
      />

      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.body,
          {
            opacity: rise,
            transform: [
              {
                translateY: rise.interpolate({
                  inputRange: [0, 1],
                  outputRange: [24, 0],
                }),
              },
            ],
          },
        ]}>
        <View style={styles.grid} pointerEvents="box-none">
          {WORD_SETS.map(set => (
            <SetCard
              key={set.id}
              Icon={ICONS[set.icon]}
              name={set.name}
              done={doneCounts[set.id] ?? 0}
              total={set.words.length}
              locked={isLocked(set)}
              selected={selected === set.id}
              width={CARD_W}
              onPress={() => handleCard(set)}
            />
          ))}
        </View>

        {lockedNote ? (
          <Text style={styles.lockedNote}>{lockedNote}</Text>
        ) : (
          <View style={styles.pictureRow} pointerEvents="none">
            <Image source={assets.sticker} style={styles.sticker} />
            <Text style={styles.pictureText}>
              {'FINISH A SET TO EARN A LEAF STICKER'}
            </Text>
          </View>
        )}

        <View style={styles.footer} pointerEvents="box-none">
          <Text style={styles.hint}>PICK A SET - THEN CATCH THE LETTERS</Text>
          <PrimaryButton
            label={'START PLAYING - ' + selectedSet.name}
            Icon={PlayIcon}
            height={56}
            onPress={() => onStart(selectedSet.id)}
          />
        </View>
      </Animated.View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, alignItems: 'center', paddingBottom: 20 },
  grid: {
    width: GRID_W,
    padding: GRID_FRAME,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
    justifyContent: 'center',
  },
  lockedNote: {
    marginTop: 14,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: theme.colors.earth.terracotta,
  },
  pictureRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
  },
  sticker: { width: 36, height: 36, resizeMode: 'contain' },
  pictureText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.text.secondary,
  },
  footer: {
    marginTop: 'auto',
    width: GRID_MAX_W,
    alignItems: 'stretch',
  },
  hint: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.6,
    textAlign: 'center',
    color: theme.colors.text.secondary,
    marginBottom: 10,
  },
});

export default WordSetsScreen;
