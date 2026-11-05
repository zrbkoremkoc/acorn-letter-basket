import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import theme from '../constants/theme';
import { SPRING } from '../constants/config';

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const TRACK_W = 52;
const TRACK_H = 30;
const KNOB = 24;

type Props = {
  value: boolean;
  onChange: (next: boolean) => void;
  label: string;
};

export function ToggleSwitch({ value, onChange, label }: Props) {
  const pos = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(pos, {
      toValue: value ? 1 : 0,
      ...SPRING.soft,
      useNativeDriver: true,
    }).start();
  }, [value, pos]);

  const translateX = pos.interpolate({
    inputRange: [0, 1],
    outputRange: [3, TRACK_W - KNOB - 3],
  });

  return (
    <Pressable
      onPress={() => onChange(!value)}
      hitSlop={HIT}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={label}
      style={styles.press}>
      <View
        style={[styles.track, value ? styles.trackOn : null]}
        pointerEvents="none">
        <Animated.View
          pointerEvents="none"
          style={[styles.knob, { transform: [{ translateX }] }]}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: TRACK_W,
    height: TRACK_H + 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: {
    width: TRACK_W,
    height: TRACK_H,
    borderRadius: TRACK_H / 2,
    backgroundColor: theme.colors.bg.tertiary,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    justifyContent: 'center',
  },
  trackOn: {
    backgroundColor: 'rgba(76,175,80,0.22)',
    borderColor: theme.colors.earth.leaf,
  },
  knob: {
    width: KNOB,
    height: KNOB,
    borderRadius: KNOB / 2,
    backgroundColor: theme.colors.bg.primary,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    shadowColor: theme.colors.ui.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
});

export default ToggleSwitch;
