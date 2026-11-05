import React, { useCallback, useRef } from 'react';
import {
  Animated,
  DimensionValue,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../constants/theme';
import { SPRING } from '../constants/config';
import type { PhosphorIcon } from './icons';

const ICON = 24;
const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

type Props = {
  label: string;
  onPress: () => void;
  Icon?: PhosphorIcon;
  colors?: string[];
  shadowColor?: string;
  height?: number;
  width?: DimensionValue;
  disabled?: boolean;
};

/**
 * Pressable is the PARENT, the Animated.View sits INSIDE it (rule #8). The
 * animated wrapper still carries pointerEvents="box-none" so no animated layer
 * can swallow the tap on an Android release build.
 */
export function PrimaryButton({
  label,
  onPress,
  Icon,
  colors = theme.gradients.primaryBtn as unknown as string[],
  shadowColor = theme.colors.earth.chestnut,
  height = 60,
  width = '100%',
  disabled = false,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

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
      disabled={disabled}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[
        styles.press,
        { width, height, shadowColor },
        disabled ? styles.disabled : null,
      ]}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.fill, { transform: [{ scale }] }]}>
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.grad}>
          <View style={styles.row} pointerEvents="none">
            {Icon ? (
              <Icon
                size={ICON}
                color={theme.colors.earth.cream}
                weight="duotone"
                duotoneColor={theme.colors.bg.sand}
                duotoneOpacity={0.4}
              />
            ) : null}
            <Text style={styles.label} numberOfLines={1}>
              {label}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    borderRadius: theme.radius.lg,
    shadowOpacity: 0.45,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  disabled: { opacity: 0.45 },
  fill: { width: '100%', height: '100%', borderRadius: theme.radius.lg },
  grad: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(59,42,26,0.35)',
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
    fontSize: 18,
    lineHeight: ICON,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: theme.colors.earth.cream,
  },
});

export default PrimaryButton;
