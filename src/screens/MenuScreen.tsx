import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AppShell from '../components/AppShell';
import ScreenHeader from '../components/ScreenHeader';
import AcornCounter from '../components/AcornCounter';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import StatCard from '../components/StatCard';
import {
  BookOpenTextIcon,
  LeafIcon,
  LockIcon,
  PlayIcon,
  SpeakerHighIcon,
} from '../components/icons';
import assets from '../assets';
import theme from '../constants/theme';
import { SPRING, TOTAL_LETTERS, TOTAL_WORDS } from '../constants/config';

type Props = {
  acorns: number;
  wordsLearned: number;
  lettersMastered: number;
  bedtime: boolean;
  onStart: () => void;
  onLetters: () => void;
  onGrownUps: () => void;
};

export function MenuScreen({
  acorns,
  wordsLearned,
  lettersMastered,
  bedtime,
  onStart,
  onLetters,
  onGrownUps,
}: Props) {
  const sheetY = useRef(new Animated.Value(120)).current;
  const titleIn = useRef(new Animated.Value(0)).current;
  const statsIn = useRef(new Animated.Value(0)).current;
  const ctaIn = useRef(new Animated.Value(0)).current;
  const bob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const enter = Animated.parallel([
      Animated.spring(sheetY, {
        toValue: 0,
        ...SPRING.enter,
        useNativeDriver: true,
      }),
      Animated.stagger(90, [
        Animated.timing(titleIn, {
          toValue: 1,
          duration: 320,
          useNativeDriver: true,
        }),
        Animated.timing(statsIn, {
          toValue: 1,
          duration: 320,
          useNativeDriver: true,
        }),
        Animated.timing(ctaIn, {
          toValue: 1,
          duration: 320,
          useNativeDriver: true,
        }),
      ]),
    ]);

    const idle = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(bob, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    enter.start();
    idle.start();
    return () => {
      enter.stop();
      idle.stop();
    };
  }, [sheetY, titleIn, statsIn, ctaIn, bob]);

  const rise = (value: Animated.Value) => ({
    opacity: value,
    transform: [
      {
        translateY: value.interpolate({
          inputRange: [0, 1],
          outputRange: [18, 0],
        }),
      },
    ],
  });

  return (
    <AppShell variant="day" dim={bedtime}>
      <View style={styles.art} pointerEvents="box-none">
        <ScreenHeader
          leftSlot={
            <View style={styles.brandRow} pointerEvents="none">
              <Image source={assets.iconHome} style={styles.brandIcon} />
              <Text style={styles.brandText}>PANTRY</Text>
            </View>
          }
          rightSlot={<AcornCounter count={acorns} />}
        />
        <Animated.Image
          source={assets.jar}
          style={[
            styles.jar,
            {
              transform: [
                {
                  translateY: bob.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -7],
                  }),
                },
              ],
            },
          ]}
        />
        <Image source={assets.squirrel} style={styles.squirrel} />
      </View>

      <Animated.View
        pointerEvents="box-none"
        style={[styles.sheet, { transform: [{ translateY: sheetY }] }]}>
        <View style={styles.grabber} pointerEvents="none" />

        <Animated.View style={rise(titleIn)} pointerEvents="none">
          <Text style={styles.title}>ACORN LETTER BASKET</Text>
          <Text style={styles.tagline}>CATCH LETTERS - SPELL WORDS</Text>
        </Animated.View>

        <Animated.View
          style={[styles.statsRow, rise(statsIn)]}
          pointerEvents="none">
          <View style={styles.statSlot}>
            <StatCard
              Icon={BookOpenTextIcon}
              value={wordsLearned + '/' + TOTAL_WORDS}
              label="words"
              valueColor={theme.colors.earth.chestnut}
            />
          </View>
          <View style={styles.statSlot}>
            <StatCard
              Icon={LeafIcon}
              value={lettersMastered + '/' + TOTAL_LETTERS}
              label="letters"
              valueColor={theme.colors.earth.leaf}
            />
          </View>
        </Animated.View>

        <Animated.View
          style={[styles.ctaBlock, rise(ctaIn)]}
          pointerEvents="box-none">
          <Text style={styles.hint}>TAP A WORD SET TO BEGIN</Text>
          <PrimaryButton label="START PLAYING" Icon={PlayIcon} onPress={onStart} />
          <View style={styles.secondaryRow} pointerEvents="box-none">
            <View style={styles.secondaryHalf}>
              <SecondaryButton
                label="LETTER SOUNDS"
                Icon={SpeakerHighIcon}
                onPress={onLetters}
              />
            </View>
            <View style={styles.secondaryHalf}>
              <SecondaryButton
                label="GROWN-UPS"
                Icon={LockIcon}
                onPress={onGrownUps}
              />
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  art: { flex: 1, minHeight: 180 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandIcon: { width: 28, height: 28, resizeMode: 'contain' },
  brandText: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '800',
    letterSpacing: 1.6,
    color: theme.colors.text.primary,
  },
  jar: {
    position: 'absolute',
    right: 24,
    top: 128,
    width: 72,
    height: 72,
    resizeMode: 'contain',
  },
  squirrel: {
    position: 'absolute',
    left: 18,
    bottom: 12,
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  sheet: {
    backgroundColor: theme.colors.bg.primary,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 2,
    borderColor: theme.colors.ui.border,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 24,
    shadowColor: theme.colors.ui.shadow,
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: -6 },
    elevation: 10,
  },
  grabber: {
    alignSelf: 'center',
    width: 54,
    height: 5,
    borderRadius: 3,
    backgroundColor: theme.colors.bg.accent,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    lineHeight: 33,
    fontWeight: '900',
    letterSpacing: 1.2,
    textAlign: 'center',
    color: theme.colors.text.primary,
  },
  tagline: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 1.6,
    textAlign: 'center',
    color: theme.colors.text.secondary,
  },
  statsRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  statSlot: { flex: 1 },
  ctaBlock: { marginTop: 18 },
  hint: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.6,
    textAlign: 'center',
    color: theme.colors.text.secondary,
    marginBottom: 10,
  },
  secondaryRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  secondaryHalf: { flex: 1 },
});

export default MenuScreen;
