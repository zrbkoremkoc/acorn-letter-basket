import React, { memo, useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, Text } from 'react-native';
import assets from '../assets';
import theme from '../constants/theme';
import {
  ACORN,
  BASKET_W,
  CATCH_BOUNCE_MS,
  REJECT_HOP_MS,
} from '../constants/config';
import { isCaught } from '../game/catchEngine';

type Props = {
  id: number;
  letter: string;
  x: number;
  fallMs: number;
  playH: number;
  basketTop: number;
  basketXRef: React.MutableRefObject<number>;
  /** Returns true when this letter was the one the word needed. */
  onVerdict: (id: number, letter: string) => boolean;
  onDone: (id: number) => void;
};

/**
 * One acorn. It owns its Animated.Value and its collision listener; all live
 * geometry stays in refs so no frame ever triggers a React render (rule #8).
 * The view is pointerEvents="none" so it can never eat the basket drag.
 */
function FallingAcornBase({
  id,
  letter,
  x,
  fallMs,
  playH,
  basketTop,
  basketXRef,
  onVerdict,
  onDone,
}: Props) {
  const y = useRef(new Animated.Value(0)).current;
  const hopY = useRef(new Animated.Value(0)).current;
  const hopX = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const resolved = useRef(false);
  const verdictRef = useRef(onVerdict);
  const doneRef = useRef(onDone);
  verdictRef.current = onVerdict;
  doneRef.current = onDone;

  useEffect(() => {
    let frame = 0;
    const finish = () => {
      if (!resolved.current) {
        resolved.current = true;
        doneRef.current(id);
      }
    };

    const resolveNow = () => {
      if (resolved.current) {
        return;
      }
      resolved.current = true;
      fall.stop();
      const correct = verdictRef.current(id, letter);
      if (correct) {
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.2,
            duration: 70,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.parallel([
            Animated.timing(scale, {
              toValue: 0.6,
              duration: CATCH_BOUNCE_MS,
              easing: Easing.bezier(0.34, 1.56, 0.64, 1),
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: CATCH_BOUNCE_MS,
              useNativeDriver: true,
            }),
          ]),
        ]).start(() => doneRef.current(id));
        return;
      }
      // A wrong acorn hops softly out of the basket. Nothing flashes red.
      const acornCenter = x + ACORN / 2;
      const basketCenter = basketXRef.current + BASKET_W / 2;
      const dir = acornCenter <= basketCenter ? -1 : 1;
      Animated.parallel([
        Animated.timing(hopX, {
          toValue: dir * 70,
          duration: REJECT_HOP_MS,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(hopY, {
            toValue: -40,
            duration: REJECT_HOP_MS * 0.4,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(hopY, {
            toValue: 120,
            duration: REJECT_HOP_MS * 0.6,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(opacity, {
          toValue: 0,
          duration: REJECT_HOP_MS,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start(() => doneRef.current(id));
    };

    const sub = y.addListener(({ value }) => {
      if (resolved.current) {
        return;
      }
      if (!isCaught(x, ACORN, value, basketXRef.current, basketTop)) {
        return;
      }
      // Defer one frame so the running native animation is not stopped from
      // inside its own update callback.
      frame = requestAnimationFrame(resolveNow);
    });

    const fall = Animated.timing(y, {
      toValue: playH + ACORN,
      duration: fallMs,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    });

    fall.start(({ finished }) => {
      if (finished) {
        finish();
      }
    });

    // Safety net: nothing stays on screen forever.
    const guard = setTimeout(finish, fallMs + 1600);

    return () => {
      y.removeListener(sub);
      fall.stop();
      clearTimeout(guard);
      if (frame) {
        cancelAnimationFrame(frame);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.wrap,
        {
          left: x,
          opacity,
          transform: [
            { translateY: y },
            { translateY: hopY },
            { translateX: hopX },
            { scale },
          ],
        },
      ]}>
      <Image source={assets.acorn} style={styles.sprite} />
      <Text style={styles.letter} numberOfLines={1}>
        {letter}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 0,
    width: ACORN,
    height: ACORN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sprite: { width: ACORN, height: ACORN, resizeMode: 'contain' },
  letter: {
    position: 'absolute',
    width: ACORN,
    height: ACORN,
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: ACORN,
    fontSize: 26,
    fontWeight: '900',
    color: theme.colors.earth.cream,
    textShadowColor: 'rgba(59,42,26,0.75)',
    textShadowRadius: 4,
    textShadowOffset: { width: 0, height: 1 },
  },
});

export const FallingAcorn = memo(FallingAcornBase);
export default FallingAcorn;
