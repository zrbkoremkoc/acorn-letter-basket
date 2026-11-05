import React, { useCallback, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import AppShell from '../components/AppShell';
import ScreenHeader from '../components/ScreenHeader';
import NavChip from '../components/NavChip';
import LetterTile from '../components/LetterTile';
import SoundPulse from '../components/SoundPulse';
import SecondaryButton from '../components/SecondaryButton';
import { CaretLeftIcon, SpeakerHighIcon } from '../components/icons';
import assets from '../assets';
import theme from '../constants/theme';
import { MASTERY_HITS } from '../constants/config';
import { LETTER_SOUNDS, exampleOf, soundOf } from '../game/letterSounds';

const { width: SCREEN_W } = Dimensions.get('window');
const GRID_MAX_W = Math.min(SCREEN_W - 32, 380);
const GRID_FRAME = 6 + 2;
const COLS = 6;
const GAP = 8;
const TILE = Math.floor((GRID_MAX_W - 2 * GRID_FRAME - (COLS - 1) * GAP) / COLS);
const GRID_W = TILE * COLS + (COLS - 1) * GAP + 2 * GRID_FRAME;

type Props = {
  letterHits: Record<string, number>;
  lowercase: boolean;
  bedtime: boolean;
  onBack: () => void;
  onHome: () => void;
};

export function LetterSoundsScreen({
  letterHits,
  lowercase,
  bedtime,
  onBack,
  onHome,
}: Props) {
  const [active, setActive] = useState('A');
  const [pulse, setPulse] = useState(0);

  const handleTile = useCallback((letter: string) => {
    setActive(letter);
    setPulse(p => p + 1);
  }, []);

  return (
    <AppShell variant="paper" dim={bedtime}>
      <ScreenHeader
        title="LETTER SOUNDS"
        leftSlot={<NavChip label="BACK" Icon={CaretLeftIcon} onPress={onBack} />}
        rightSlot={<NavChip label="HOME" image={assets.iconHome} onPress={onHome} />}
      />

      <View style={styles.body} pointerEvents="box-none">
        <Text style={styles.lead}>TAP A LETTER TO SEE ITS SOUND</Text>

        <View style={styles.grid} pointerEvents="box-none">
          {LETTER_SOUNDS.map(item => (
            <LetterTile
              key={item.letter}
              letter={item.letter}
              size={TILE}
              mastered={(letterHits[item.letter] ?? 0) >= MASTERY_HITS}
              active={active === item.letter}
              lowercase={lowercase}
              onPress={handleTile}
            />
          ))}
        </View>

        <View style={styles.bar} pointerEvents="box-none">
          <View style={styles.barHighlight} pointerEvents="none" />
          <View style={styles.barIcon} pointerEvents="none">
            <SpeakerHighIcon
              size={24}
              color={theme.colors.earth.chestnut}
              weight="duotone"
              duotoneColor={theme.colors.earth.mustard}
              duotoneOpacity={0.5}
            />
            <SoundPulse trigger={pulse} size={44} />
          </View>
          <View style={styles.barText} pointerEvents="none">
            <Text style={styles.barTitle} numberOfLines={1}>
              {(lowercase ? active.toLowerCase() : active) +
                ' says "' +
                soundOf(active) +
                '"'}
            </Text>
            <Text style={styles.barSub} numberOfLines={1}>
              {'AS IN ' + exampleOf(active)}
            </Text>
          </View>
        </View>

        <View style={styles.footer} pointerEvents="box-none">
          <Text style={styles.hint}>CATCH A LETTER FIVE TIMES TO MASTER IT</Text>
          <SecondaryButton label="BACK TO TREEHOUSE" onPress={onHome} />
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, alignItems: 'center', paddingBottom: 20 },
  lead: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: theme.colors.text.secondary,
    marginBottom: 12,
  },
  grid: {
    width: GRID_W,
    padding: GRID_FRAME,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
    justifyContent: 'flex-start',
  },
  bar: {
    marginTop: 16,
    width: GRID_MAX_W,
    minHeight: 72,
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    borderColor: theme.colors.ui.border,
    backgroundColor: theme.colors.bg.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 14,
    overflow: 'hidden',
    shadowColor: theme.colors.ui.shadow,
    shadowOpacity: 0.14,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  barHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  barIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(160,82,45,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  barText: { flex: 1 },
  barTitle: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: theme.colors.text.primary,
  },
  barSub: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: theme.colors.text.secondary,
  },
  footer: { marginTop: 'auto', width: GRID_MAX_W, paddingTop: 16 },
  hint: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.4,
    textAlign: 'center',
    color: theme.colors.text.secondary,
    marginBottom: 10,
  },
});

export default LetterSoundsScreen;
