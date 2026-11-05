import React, { useCallback, useRef } from 'react';
import {
  Animated,
  DimensionValue,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import theme from '../constants/theme';
import { SPRING } from '../constants/config';
import type { PhosphorIcon } from './icons';

const ICON = 24; // identical to PrimaryButton - icon sizes never differ (rule #20)
const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type Props = {
  label: string;
  onPress: () => void;
  Icon?: PhosphorIcon;
  height?: number;
  width?: DimensionValue;
  tone?: 'chestnut' | 'terracotta';
  style?: StyleProp<ViewStyle>;
};

export function SecondaryButton({
  label,
  onPress,
  Icon,
  height = 48,
  width = '100%',
  tone = 'chestnut',
  style,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const color =
    tone === 'terracotta'
      ? theme.colors.earth.terracotta
      : theme.colors.earth.chestnut;

  const pressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.95,
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

  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.press, { width, height }, style]}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.fill, { transform: [{ scale }] }]}>
        <View style={styles.row} pointerEvents="none">
          {Icon ? (
            <Icon
              size={ICON}
              color={color}
              weight="duotone"
              duotoneColor={theme.colors.earth.mustard}
              duotoneOpacity={0.45}
            />
          ) : null}
          <Text style={[styles.label, { color }]} numberOfLines={1}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { borderRadius: theme.radius.md + 2 },
  fill: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.md + 2,
    backgroundColor: 'rgba(160,82,45,0.10)',
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 13,
    lineHeight: ICON,
    fontWeight: '700',
    letterSpacing: 1.1,
  },
});

export default SecondaryButton;
