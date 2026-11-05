import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import AppShell from '../components/AppShell';
import ScreenHeader from '../components/ScreenHeader';
import NavChip from '../components/NavChip';
import PictureCard from '../components/PictureCard';
import SoundPulse from '../components/SoundPulse';
import StatCard from '../components/StatCard';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import {
  ArrowCounterClockwiseIcon,
  BookOpenTextIcon,
  CheckCircleIcon,
  HouseIcon,
} from '../components/icons';
import assets from '../assets';
import theme from '../constants/theme';
import { SPRING, TOTAL_WORDS } from '../constants/config';

type Props = {
  word: string;
  caughtLetters: number;
  totalLetters: number;
  wordsLearned: number;
  stickerEarned: boolean;
  lowercase: boolean;
  bedtime: boolean;
  onPlayAgain: () => void;
  onMenu: () => void;
};

export function GameOverScreen({
  word,
  caughtLetters,
  totalLetters,
  wordsLearned,
  stickerEarned,
  lowercase,
  bedtime,
  onPlayAgain,
  onMenu,
}: Props) {
  const letters = useMemo(() => word.split(''), [word]);
  const pops = useRef(letters.map(() => new Animated.Value(0))).current;
  const rewardY = useRef(new Animated.Value(-70)).current;
  const rewardFade = useRef(new Animated.Value(0)).current;
  const blockIn = useRef(new Animated.Value(0)).current;
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const stagger = Animated.stagger(
      120,
      pops.map(value =>
        Animated.spring(value, {
          toValue: 1,
          ...SPRING.celebrate,
          useNativeDriver: true,
        }),
      ),
    );
    const reward = Animated.parallel([
      Animated.spring(rewardY, {
        toValue: 0,
        ...SPRING.celebrate,
        useNativeDriver: true,
      }),
      Animated.timing(rewardFade, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      }),
    ]);
    const block = Animated.timing(blockIn, {
      toValue: 1,
      duration: 320,
      delay: 180,
      useNativeDriver: true,
    });

    stagger.start();
    block.start();
    const rewardTimer = setTimeout(() => reward.start(), 320);
    const pulseTimer = setTimeout(() => setPulse(1), 420);

    return () => {
      stagger.stop();
      reward.stop();
      block.stop();
      clearTimeout(rewardTimer);
      clearTimeout(pulseTimer);
    };
  }, [pops, rewardY, rewardFade, blockIn]);

  const soundOut = letters.join(' - ');

  return (
    <AppShell variant="reveal" dim={bedtime}>
      <ScreenHeader
        title="WORD LEARNED"
        rightSlot={
          <NavChip label="HOME" Icon={HouseIcon} onPress={onMenu} />
        }
      />

      <View style={styles.body} pointerEvents="box-none">
        <View style={styles.heroRow} pointerEvents="none">
          {letters.map((letter, index) => (
            <Animated.Text
              key={index + letter}
              style={[
                styles.hero,
                {
                  opacity: pops[index],
                  transform: [
                    {
                      scale: pops[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.4, 1],
                      }),
                    },
                  ],
                },
              ]}>
              {lowercase ? letter.toLowerCase() : letter}
            </Animated.Text>
          ))}
        </View>

        <View style={styles.pictureWrap} pointerEvents="none">
          <PictureCard
            word={word}
            size={92}
            lowercase={lowercase}
            showCaption={false}
          />
          <View style={styles.pulseAnchor} pointerEvents="none">
            <SoundPulse trigger={pulse} size={104} />
          </View>
        </View>

        <Text style={styles.soundOut}>{soundOut}</Text>

        <Animated.View
          pointerEvents="none"
          style={[
            styles.reward,
            { opacity: rewardFade, transform: [{ translateY: rewardY }] },
          ]}>
          <Image
            source={stickerEarned ? assets.sticker : assets.jar}
            style={styles.rewardIcon}
          />
          <Text style={styles.rewardText} numberOfLines={2}>
            {stickerEarned ? '+1 STICKER' : 'WORD ADDED TO THE PANTRY'}
          </Text>
        </Animated.View>

        <Animated.View
          pointerEvents="none"
          style={[
            styles.statsRow,
            {
              opacity: blockIn,
              transform: [
                {
                  translateY: blockIn.interpolate({
                    inputRange: [0, 1],
                    outputRange: [16, 0],
                  }),
                },
              ],
            },
          ]}>
          <View style={styles.statSlot}>
            <StatCard
              Icon={CheckCircleIcon}
              value={caughtLetters + '/' + totalLetters}
              label="letters"
              valueColor={theme.colors.earth.leaf}
            />
          </View>
          <View style={styles.statSlot}>
            <StatCard
              Icon={BookOpenTextIcon}
              value={wordsLearned + '/' + TOTAL_WORDS}
              label="words"
              valueColor={theme.colors.earth.chestnut}
            />
          </View>
        </Animated.View>

        <View style={styles.footer} pointerEvents="box-none">
          <Text style={styles.hint}>NEXT WORD IS READY</Text>
          <PrimaryButton
            label="PLAY AGAIN"
            Icon={ArrowCounterClockwiseIcon}
            colors={theme.gradients.successBtn as unknown as string[]}
            shadowColor={theme.colors.earth.leaf}
            onPress={onPlayAgain}
          />
          <SecondaryButton
            label="BACK TO TREEHOUSE"
            onPress={onMenu}
            style={styles.secondary}
          />
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, alignItems: 'center', paddingHorizontal: 20, paddingBottom: 20 },
  heroRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  hero: {
    fontSize: 44,
    lineHeight: 50,
    fontWeight: '900',
    letterSpacing: 4,
    color: theme.colors.earth.leaf,
    textShadowColor: 'rgba(59,42,26,0.22)',
    textShadowRadius: 6,
    textShadowOffset: { width: 0, height: 2 },
  },
  pictureWrap: {
    marginTop: 10,
    width: 104,
    height: 104,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseAnchor: {
    position: 'absolute',
    width: 104,
    height: 104,
    alignItems: 'center',
    justifyContent: 'center',
  },
  soundOut: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '800',
    letterSpacing: 3,
    color: theme.colors.text.secondary,
  },
  reward: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: theme.radius.lg,
    backgroundColor: 'rgba(246,241,222,0.88)',
    borderWidth: 1.5,
    borderColor: theme.colors.ui.border,
  },
  rewardIcon: { width: 48, height: 48, resizeMode: 'contain' },
  rewardText: {
    maxWidth: 190,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: theme.colors.earth.chestnut,
  },
  statsRow: { flexDirection: 'row', gap: 12, marginTop: 10, alignSelf: 'stretch' },
  statSlot: { flex: 1 },
  footer: { marginTop: 'auto', alignSelf: 'stretch', paddingTop: 12 },
  hint: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.6,
    textAlign: 'center',
    color: theme.colors.text.secondary,
    marginBottom: 10,
  },
  secondary: { marginTop: 12 },
});

export default GameOverScreen;
