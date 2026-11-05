import React from 'react';
import { Animated, Image, StyleSheet } from 'react-native';
import Svg, { Ellipse } from 'react-native-svg';
import assets from '../assets';
import { BASKET_BOTTOM, BASKET_H, BASKET_W } from '../constants/config';

type Props = {
  translateX: Animated.Value;
};

/**
 * The woven basket with the squirrel standing behind it. Driven purely by a
 * translateX Animated.Value, pointerEvents="none" so the drag layer underneath
 * keeps every touch.
 */
export function BasketRig({ translateX }: Props) {
  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.rig, { transform: [{ translateX }] }]}>
      <Svg width={BASKET_W} height={18} style={styles.shadow}>
        <Ellipse
          cx={BASKET_W / 2}
          cy={9}
          rx={BASKET_W / 2 - 8}
          ry={7}
          fill="#3B2A1A"
          opacity={0.18}
        />
      </Svg>
      <Image source={assets.squirrel} style={styles.squirrel} />
      <Image source={assets.basket} style={styles.basket} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  rig: {
    position: 'absolute',
    left: 0,
    bottom: BASKET_BOTTOM,
    width: BASKET_W,
    height: BASKET_H,
  },
  shadow: { position: 'absolute', left: 0, bottom: -12 },
  squirrel: {
    position: 'absolute',
    left: -26,
    bottom: 10,
    width: 64,
    height: 64,
    resizeMode: 'contain',
  },
  basket: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: BASKET_W,
    height: BASKET_H,
    resizeMode: 'contain',
  },
});

export default BasketRig;
