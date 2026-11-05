import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import theme from '../constants/theme';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type Props = {
  label: string;
  active: boolean;
  onPress: () => void;
  width?: number;
};

export function Chip({ label, active, onPress, width = 86 }: Props) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      style={[styles.chip, { width }, active ? styles.active : null]}>
      <Text
        style={[styles.label, active ? styles.labelActive : null]}
        numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.bg.secondary,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  active: {
    borderWidth: 2,
    borderColor: theme.colors.earth.leaf,
    backgroundColor: 'rgba(76,175,80,0.10)',
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.text.secondary,
  },
  labelActive: { color: theme.colors.earth.leafDark },
});

export default Chip;
