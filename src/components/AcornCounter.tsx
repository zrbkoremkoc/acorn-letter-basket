import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text } from 'react-native';
import assets from '../assets';
import theme from '../constants/theme';

type Props = { count: number };

/** The pantry counter. No money, no currency symbol - acorns only. */
export function AcornCounter({ count }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.18,
        duration: 130,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 130,
        useNativeDriver: true,
      }),
    ]).start();
  }, [count, scale]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.pill, { transform: [{ scale }] }]}>
      <Image source={assets.acorn} style={styles.icon} />
      <Text style={styles.value} numberOfLines={1}>
        {String(count)}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  pill: {
    width: 92,
    height: 34,
    borderRadius: 17,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(59,42,26,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(59,42,26,0.18)',
  },
  icon: { width: 20, height: 20, resizeMode: 'contain' },
  value: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
    color: theme.colors.text.primary,
  },
});

export default AcornCounter;
