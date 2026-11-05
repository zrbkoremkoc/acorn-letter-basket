import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import theme from '../constants/theme';
import { HOLD_GATE_MS } from '../constants/config';

const RING = 56;
const STROKE = 5;
const RADIUS = (RING - STROKE) / 2;
const CIRC = 2 * Math.PI * RADIUS;
const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type Props = { onUnlock: () => void };

/** Parent gate: hold for three seconds. No arithmetic puzzle, no keyboard. */
export function HoldGate({ onUnlock }: Props) {
  const value = useRef(new Animated.Value(0)).current;
  const [ratio, setRatio] = useState(0);
  const unlockRef = useRef(onUnlock);
  unlockRef.current = onUnlock;

  useEffect(() => {
    const sub = value.addListener(e => setRatio(e.value));
    return () => value.removeListener(sub);
  }, [value]);

  const start = useCallback(() => {
    Animated.timing(value, {
      toValue: 1,
      duration: HOLD_GATE_MS,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        unlockRef.current();
      }
    });
  }, [value]);

  const cancel = useCallback(() => {
    value.stopAnimation(() => {
      Animated.timing(value, {
        toValue: 0,
        duration: 220,
        useNativeDriver: false,
      }).start();
    });
  }, [value]);

  return (
    <View style={styles.wrap}>
      <Pressable
        onPressIn={start}
        onPressOut={cancel}
        hitSlop={HIT}
        accessibilityRole="button"
        accessibilityLabel="HOLD FOR 3 SECONDS"
        style={styles.press}>
        <View style={styles.inner} pointerEvents="none">
          <View style={styles.ringBox}>
            <Svg width={RING} height={RING}>
              <Circle
                cx={RING / 2}
                cy={RING / 2}
                r={RADIUS}
                stroke={theme.colors.bg.sand}
                strokeWidth={STROKE}
                fill="none"
              />
              <Circle
                cx={RING / 2}
                cy={RING / 2}
                r={RADIUS}
                stroke={theme.colors.earth.leaf}
                strokeWidth={STROKE}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={CIRC + ' ' + CIRC}
                strokeDashoffset={CIRC * (1 - ratio)}
                transform={'rotate(-90 ' + RING / 2 + ' ' + RING / 2 + ')'}
              />
            </Svg>
            <Text style={styles.percent}>{Math.round(ratio * 100)}</Text>
          </View>
          <View style={styles.copy}>
            <Text style={styles.title}>HOLD FOR 3 SECONDS</Text>
            <Text style={styles.sub}>GROWN-UPS ONLY</Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'stretch', paddingHorizontal: 20 },
  press: {
    width: '100%',
    height: 84,
    borderRadius: theme.radius.lg,
  },
  inner: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    borderColor: theme.colors.ui.border,
    backgroundColor: theme.colors.bg.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 14,
  },
  ringBox: {
    width: RING,
    height: RING,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percent: {
    position: 'absolute',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
    color: theme.colors.text.primary,
  },
  copy: { flex: 1 },
  title: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: theme.colors.text.primary,
  },
  sub: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: theme.colors.text.secondary,
  },
});

export default HoldGate;
