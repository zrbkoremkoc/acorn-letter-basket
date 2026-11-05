import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { soundOf } from '../game/letterSounds';

export type SlotSize = 'header' | 'tray' | 'hero';

type Props = {
  word: string;
  caught: boolean[];
  size: SlotSize;
  lowercase?: boolean;
  showSounds?: boolean;
};

const METRICS = {
  header: { box: 28, height: 38, font: 24, gap: 4 },
  tray: { box: 30, height: 40, font: 26, gap: 6 },
  hero: { box: 44, height: 58, font: 40, gap: 8 },
} as const;

/** The single source of truth for how a word is displayed - header, floating
 *  tray and the word-reveal hero all come through here. */
export function WordSlots({
  word,
  caught,
  size,
  lowercase = false,
  showSounds = false,
}: Props) {
  const m = METRICS[size];
  const letters = word.split('');

  return (
    <View style={[styles.row, { gap: m.gap }]} pointerEvents="none">
      {letters.map((letter, index) => {
        const done = caught[index] === true;
        return (
          <View key={index + letter} style={{ alignItems: 'center' }}>
            <Text
              style={[
                styles.letter,
                {
                  width: m.box,
                  height: m.height,
                  lineHeight: m.height,
                  fontSize: m.font,
                  color: done ? theme.colors.earth.leaf : theme.colors.text.primary,
                  opacity: done ? 1 : 0.28,
                },
              ]}>
              {lowercase ? letter.toLowerCase() : letter}
            </Text>
            {showSounds && done ? (
              <Text style={styles.sound} numberOfLines={1}>
                {soundOf(letter)}
              </Text>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center' },
  letter: {
    textAlign: 'center',
    fontWeight: '900',
    letterSpacing: 0,
  },
  sound: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: theme.colors.text.secondary,
  },
});

export default WordSlots;
