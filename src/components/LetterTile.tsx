import React, { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { SPRING } from '../constants/config';
import { LeafIcon } from './icons';

const HIT = { top: 6, bottom: 6, left: 6, right: 6 };

type Props = {
  letter: string;
  size: number;
  mastered: boolean;
  active: boolean;
  lowercase: boolean;
  onPress: (letter: string) => void;
};

export function LetterTile({
  letter,
  size,
  mastered,
  active,
  lowercase,
  onPress,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = useCallback(() => {
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 1.08,
        ...SPRING.press,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        ...SPRING.press,
        useNativeDriver: true,
      }),
    ]).start();
    onPress(letter);
  }, [letter, onPress, scale]);

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={letter}
      style={[styles.press, { width: size, height: size }]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.tile,
          active ? styles.active : null,
          { transform: [{ scale }] },
        ]}>
        <Text
          style={[styles.letter, active ? styles.letterActive : null]}
          numberOfLines={1}>
          {lowercase ? letter.toLowerCase() : letter}
        </Text>
        {mastered ? (
          <View style={styles.badge}>
            <LeafIcon
              size={12}
              color={theme.colors.earth.leafDark}
              weight="duotone"
              duotoneColor={theme.colors.earth.leaf}
              duotoneOpacity={0.4}
            />
          </View>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { borderRadius: theme.radius.md },
  tile: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.md,
    borderWidth: 2,
    borderColor: theme.colors.ui.border,
    backgroundColor: theme.colors.bg.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  active: {
    borderColor: theme.colors.earth.leaf,
    backgroundColor: 'rgba(76,175,80,0.10)',
  },
  letter: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800',
    color: theme.colors.text.primary,
  },
  letterActive: { color: theme.colors.earth.leafDark },
  badge: { position: 'absolute', top: 3, right: 3 },
});

export default LetterTile;
