import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import theme from '../constants/theme';
import { SOUND_PULSE_MS } from '../constants/config';

type Props = {
  trigger: number;
  color?: string;
  size?: number;
};

/**
 * The app ships no audio dependency, so a "sound" is shown: three leaf-green
 * rings expanding out of the letter. Transform + opacity only, so the native
 * driver is safe here.
 */
export function SoundPulse({
  trigger,
  color = theme.colors.earth.leaf,
  size = 56,
}: Props) {
  const rings = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    if (trigger <= 0) {
      return;
    }
    const anims = rings.map((value, index) => {
      value.setValue(0);
      return Animated.timing(value, {
        toValue: 1,
        duration: SOUND_PULSE_MS,
        delay: index * 90,
        useNativeDriver: true,
      });
    });
    const group = Animated.parallel(anims);
    group.start();
    return () => group.stop();
  }, [trigger, rings]);

  const styleFor = useMemo(
    () =>
      rings.map(value => ({
        transform: [
          {
            scale: value.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.6],
            }),
          },
        ],
        opacity: value.interpolate({
          inputRange: [0, 1],
          outputRange: [0.5, 0],
        }),
      })),
    [rings],
  );

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.wrap, { width: size, height: size }]}>
      {styleFor.map((animStyle, index) => (
        <Animated.View
          key={index}
          pointerEvents="none"
          style={[
            styles.ring,
            { width: size, height: size, borderRadius: size / 2, borderColor: color },
            animStyle,
          ]}
        />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: { position: 'absolute', borderWidth: 2 },
});

export default SoundPulse;
