import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Animated, PanResponder } from 'react-native';
import { BASKET_MARGIN, BASKET_W } from '../constants/config';

/**
 * PanResponder over the bottom half of the play area. The live x lives in a
 * ref (never in state - rule #8); only the Animated.Value touches the view.
 */
export function useBasketDrag(playW: number) {
  const translateX = useRef(new Animated.Value(0)).current;
  const xRef = useRef(0);
  const grabRef = useRef(0);

  const bounds = useMemo(() => {
    const min = BASKET_MARGIN;
    const max = Math.max(min, playW - BASKET_W - BASKET_MARGIN);
    return { min, max };
  }, [playW]);

  const moveTo = useCallback(
    (value: number) => {
      const clamped = Math.min(bounds.max, Math.max(bounds.min, value));
      xRef.current = clamped;
      translateX.setValue(clamped);
    },
    [bounds, translateX],
  );

  useEffect(() => {
    if (playW > 0) {
      moveTo((playW - BASKET_W) / 2);
    }
  }, [playW, moveTo]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: evt => {
          const touch = evt.nativeEvent.locationX;
          if (typeof touch === 'number' && isFinite(touch)) {
            moveTo(touch - BASKET_W / 2);
          }
          grabRef.current = xRef.current;
        },
        onPanResponderMove: (_evt, gesture) => {
          moveTo(grabRef.current + gesture.dx);
        },
        onPanResponderRelease: () => {
          grabRef.current = xRef.current;
        },
      }),
    [moveTo],
  );

  return { translateX, xRef, panHandlers: panResponder.panHandlers, moveTo };
}
