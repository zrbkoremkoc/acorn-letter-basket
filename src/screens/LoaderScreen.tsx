import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import assets from '../assets';
import theme from '../constants/theme';
import { LOADER_DURATION_MS } from '../constants/config';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const BAR_W = 220;

const LEAVES = [
  { cx: 0.12, cy: 0.1, r: 12, o: 0.16 },
  { cx: 0.3, cy: 0.05, r: 8, o: 0.12 },
  { cx: 0.52, cy: 0.14, r: 14, o: 0.18 },
  { cx: 0.74, cy: 0.07, r: 9, o: 0.12 },
  { cx: 0.88, cy: 0.17, r: 11, o: 0.15 },
  { cx: 0.2, cy: 0.24, r: 7, o: 0.1 },
  { cx: 0.66, cy: 0.26, r: 10, o: 0.13 },
];

const DRIFTERS = [
  { left: 0.18, delay: 0, duration: 5200 },
  { left: 0.52, delay: 900, duration: 6100 },
  { left: 0.82, delay: 1800, duration: 7000 },
];

type Props = { onDone: () => void };

/**
 * The dusk version of the woodland art - a 0.9 dark overlay, no chips and no
 * CTA, so it can never be confused with the Menu (rule #14).
 */
export function LoaderScreen({ onDone }: Props) {
  const logoScale = useRef(new Animated.Value(0.6)).current;
  const logoFade = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;
  const bar = useRef(new Animated.Value(0)).current;
  const textFade = useRef(new Animated.Value(0)).current;
  const drift = useRef(DRIFTERS.map(() => new Animated.Value(0))).current;

  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const entrance = Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 38,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(logoFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(textFade, {
        toValue: 1,
        duration: 600,
        delay: 260,
        useNativeDriver: true,
      }),
    ]);

    const idle = Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1,
          duration: 1300,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: 1300,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    // width is NOT native-driver safe - this one stays on the JS driver.
    const progress = Animated.timing(bar, {
      toValue: 1,
      duration: LOADER_DURATION_MS,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false,
    });

    const drifts = drift.map((value, index) =>
      Animated.loop(
        Animated.timing(value, {
          toValue: 1,
          duration: DRIFTERS[index].duration,
          delay: DRIFTERS[index].delay,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ),
    );

    entrance.start();
    idle.start();
    progress.start();
    drifts.forEach(d => d.start());

    const timer = setTimeout(() => doneRef.current(), LOADER_DURATION_MS);

    return () => {
      clearTimeout(timer);
      entrance.stop();
      idle.stop();
      progress.stop();
      drifts.forEach(d => d.stop());
    };
  }, [logoScale, logoFade, textFade, float, bar, drift]);

  const floatY = useMemo(
    () => float.interpolate({ inputRange: [0, 1], outputRange: [0, -8] }),
    [float],
  );

  const barWidth = bar.interpolate({
    inputRange: [0, 1],
    outputRange: [0, BAR_W],
  });

  return (
    <View style={styles.root}>
      <Image source={assets.bgGame} style={styles.bg} />
      <LinearGradient
        colors={theme.gradients.duskDeep as unknown as string[]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <Svg
        width={SCREEN_W}
        height={SCREEN_H}
        style={StyleSheet.absoluteFill}
        pointerEvents="none">
        {LEAVES.map((leaf, i) => (
          <Circle
            key={i}
            cx={SCREEN_W * leaf.cx}
            cy={SCREEN_H * leaf.cy}
            r={leaf.r}
            fill={theme.colors.earth.leaf}
            opacity={leaf.o}
          />
        ))}
      </Svg>

      {DRIFTERS.map((d, i) => (
        <Animated.Image
          key={i}
          source={assets.acorn}
          style={[
            styles.drifter,
            {
              left: SCREEN_W * d.left,
              opacity: 0.22,
              transform: [
                {
                  translateY: drift[i].interpolate({
                    inputRange: [0, 1],
                    outputRange: [-60, SCREEN_H + 60],
                  }),
                },
              ],
            },
          ]}
        />
      ))}

      <View style={styles.center} pointerEvents="none">
        <Animated.View
          pointerEvents="none"
          style={[
            styles.brandCard,
            { opacity: logoFade, transform: [{ scale: logoScale }, { translateY: floatY }] },
          ]}>
          <Image source={assets.logo} style={styles.logo} />
        </Animated.View>

        <Animated.View style={{ opacity: textFade }} pointerEvents="none">
          <Text style={styles.title}>ACORN LETTER BASKET</Text>
          <Text style={styles.subtitle}>CATCH THE LETTERS, SPELL THE WORD</Text>
        </Animated.View>
      </View>

      <View style={styles.footer} pointerEvents="none">
        <View style={styles.track}>
          <Animated.View style={[styles.fillWrap, { width: barWidth }]}>
            <LinearGradient
              colors={theme.gradients.loaderBar as unknown as string[]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.fill}
            />
          </Animated.View>
        </View>
        <Text style={styles.loading}>LOADING...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1A120A' },
  bg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_W,
    height: SCREEN_H,
    resizeMode: 'cover',
  },
  drifter: { position: 'absolute', top: 0, width: 28, height: 28, resizeMode: 'contain' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  brandCard: {
    width: 184,
    height: 184,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(246,241,222,0.08)',
    borderWidth: 2,
    borderColor: 'rgba(246,241,222,0.18)',
    marginBottom: 30,
  },
  logo: { width: 160, height: 160, resizeMode: 'contain' },
  title: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '900',
    letterSpacing: 2.5,
    textAlign: 'center',
    color: theme.colors.bg.primary,
    textShadowColor: 'rgba(0,0,0,0.45)',
    textShadowRadius: 8,
    textShadowOffset: { width: 0, height: 2 },
  },
  subtitle: {
    marginTop: 14,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: 2,
    textAlign: 'center',
    color: theme.colors.bg.sand,
    opacity: 0.85,
  },
  footer: { alignItems: 'center', paddingBottom: 72 },
  track: {
    width: BAR_W,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(246,241,222,0.18)',
    overflow: 'hidden',
  },
  fillWrap: { height: 8, borderRadius: 4, overflow: 'hidden' },
  fill: { flex: 1, borderRadius: 4 },
  loading: {
    marginTop: 14,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 3,
    color: theme.colors.bg.sand,
  },
});

export default LoaderScreen;
