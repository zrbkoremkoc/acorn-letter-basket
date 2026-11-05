import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import assets from '../assets';
import theme from '../constants/theme';

type Props = {
  word: string;
  size: number;
  lowercase?: boolean;
  showCaption?: boolean;
};

/** The word's picture tile - a framed basket sprite on warm paper. */
export function PictureCard({
  word,
  size,
  lowercase = false,
  showCaption = true,
}: Props) {
  return (
    <View style={styles.wrap}>
      <View style={[styles.frame, { width: size, height: size }]}>
        <View style={styles.highlight} pointerEvents="none" />
        <Image
          source={assets.basket}
          style={{
            width: size - 18,
            height: size - 18,
            resizeMode: 'contain',
          }}
        />
      </View>
      {showCaption ? (
        <Text style={styles.caption} numberOfLines={1}>
          {lowercase ? word.toLowerCase() : word}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  frame: {
    borderRadius: theme.radius.md,
    borderWidth: 2,
    borderColor: theme.colors.ui.border,
    backgroundColor: theme.colors.bg.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: theme.colors.ui.shadow,
    shadowOpacity: 0.14,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  caption: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: theme.colors.text.secondary,
  },
});

export default PictureCard;
