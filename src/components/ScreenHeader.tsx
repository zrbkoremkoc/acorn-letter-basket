import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';

type Props = {
  title?: string;
  titleNode?: React.ReactNode;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  tone?: 'plain' | 'surface';
};

/**
 * One header for every screen (Menu / WordSets / Game / GameOver / Letters /
 * Grown-Ups). Inline header markup drifts between screens - this does not.
 * paddingTop 44 keeps it clear of the status bar (rule #6).
 */
export function ScreenHeader({
  title,
  titleNode,
  leftSlot,
  rightSlot,
  tone = 'plain',
}: Props) {
  return (
    <View
      style={[styles.header, tone === 'surface' ? styles.surface : null]}
      pointerEvents="box-none">
      <View style={styles.side} pointerEvents="box-none">
        {leftSlot ?? null}
      </View>
      <View style={styles.center} pointerEvents="box-none">
        {titleNode ?? null}
        {title ? (
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        ) : null}
      </View>
      <View style={[styles.side, styles.sideRight]} pointerEvents="box-none">
        {rightSlot ?? null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 116,
    paddingTop: 44,
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  surface: {
    backgroundColor: 'rgba(59,42,26,0.14)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59,42,26,0.18)',
  },
  side: { width: 96, alignItems: 'flex-start', justifyContent: 'center' },
  sideRight: { alignItems: 'flex-end' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: theme.colors.text.primary,
  },
});

export default ScreenHeader;
