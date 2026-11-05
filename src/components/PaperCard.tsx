import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import theme from '../constants/theme';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  raised?: boolean;
  tone?: 'paper' | 'tile';
};

/** The skeuomorphic surface: warm paper, deep-sand border, inner top highlight. */
export function PaperCard({ children, style, raised = true, tone = 'paper' }: Props) {
  return (
    <View
      style={[
        styles.card,
        tone === 'tile' ? styles.tile : null,
        raised ? styles.raised : null,
        style,
      ]}>
      <View style={styles.highlight} pointerEvents="none" />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.bg.primary,
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    borderColor: theme.colors.ui.border,
    overflow: 'hidden',
  },
  tile: { backgroundColor: theme.colors.bg.tertiary },
  raised: {
    shadowColor: theme.colors.ui.shadow,
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
});

export default PaperCard;
