import React, { useCallback, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { SPRING } from '../constants/config';
import type { PhosphorIcon } from './icons';
import { LockIcon } from './icons';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type Props = {
  Icon: PhosphorIcon;
  name: string;
  done: number;
  total: number;
  locked: boolean;
  selected: boolean;
  width: number;
  onPress: () => void;
};

export function SetCard({
  Icon,
  name,
  done,
  total,
  locked,
  selected,
  width,
  onPress,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.96,
      ...SPRING.press,
      useNativeDriver: true,
    }).start();
  }, [scale]);
  const pressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      ...SPRING.press,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  const ratio = total > 0 ? Math.min(1, done / total) : 0;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={name}
      style={[styles.press, { width, height: 112 }]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.card,
          selected ? styles.selected : null,
          locked ? styles.locked : null,
          { transform: [{ scale }] },
        ]}>
        <View style={styles.highlight} pointerEvents="none" />
        <Icon
          size={34}
          color={selected ? theme.colors.earth.leafDark : theme.colors.earth.chestnut}
          weight="duotone"
          duotoneColor={theme.colors.earth.mustard}
          duotoneOpacity={0.45}
        />
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.progress} numberOfLines={1}>
          {done + '/' + total + ' WORDS'}
        </Text>
        <View style={styles.rail}>
          <View
            style={[
              styles.railFill,
              { width: (Math.round(ratio * 100) + '%') as `${number}%` },
            ]}
          />
        </View>
        {locked ? (
          <View style={styles.lockBadge}>
            <LockIcon
              size={16}
              color={theme.colors.text.secondary}
              weight="duotone"
              duotoneColor={theme.colors.earth.mustard}
              duotoneOpacity={0.5}
            />
          </View>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { borderRadius: theme.radius.md + 2 },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.md + 2,
    borderWidth: 2,
    borderColor: theme.colors.ui.border,
    backgroundColor: theme.colors.bg.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
    gap: 2,
    overflow: 'hidden',
    shadowColor: theme.colors.ui.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  selected: {
    borderColor: theme.colors.earth.leaf,
    backgroundColor: 'rgba(76,175,80,0.08)',
  },
  locked: { opacity: 0.55 },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  name: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
    letterSpacing: 1,
    color: theme.colors.text.primary,
  },
  progress: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: theme.colors.text.secondary,
  },
  rail: {
    marginTop: 4,
    width: '72%',
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.bg.sand,
    overflow: 'hidden',
  },
  railFill: { height: 4, borderRadius: 2, backgroundColor: theme.colors.earth.leaf },
  lockBadge: { position: 'absolute', top: 8, right: 8 },
});

export default SetCard;
