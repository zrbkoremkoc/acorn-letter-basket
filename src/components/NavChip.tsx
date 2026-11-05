import React, { useCallback, useRef } from 'react';
import {
  Animated,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import theme from '../constants/theme';
import { SPRING } from '../constants/config';
import type { PhosphorIcon } from './icons';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const SIZE = 48;

type Props = {
  onPress: () => void;
  label: string;
  Icon?: PhosphorIcon;
  image?: ImageSourcePropType;
};

/** The 48x48 square chip used for back / home / pause in every ScreenHeader. */
export function NavChip({ onPress, label, Icon, image }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.92,
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
      style={styles.press}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.chip, { transform: [{ scale }] }]}>
        <View style={styles.row} pointerEvents="none">
          {Icon ? (
            <Icon
              size={24}
              color={theme.colors.text.primary}
              weight="duotone"
              duotoneColor={theme.colors.earth.mustard}
              duotoneOpacity={0.5}
            />
          ) : null}
          {image ? <Image source={image} style={styles.image} /> : null}
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { width: SIZE, height: SIZE, borderRadius: theme.radius.md + 2 },
  chip: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.md + 2,
    backgroundColor: 'rgba(59,42,26,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(59,42,26,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: { alignItems: 'center', justifyContent: 'center' },
  image: { width: 24, height: 24, resizeMode: 'contain' },
});

export default NavChip;
