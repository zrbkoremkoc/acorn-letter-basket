import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import type { PhosphorIcon } from './icons';

type Props = {
  Icon: PhosphorIcon;
  value: string;
  label: string;
  valueColor: string;
};

/**
 * width:'100%' - never flex:1 inside a flex:1 slot (rule #19a). Every pill in a
 * row is the same box; only the colour, the number and the caption differ.
 */
export function StatCard({ Icon, value, label, valueColor }: Props) {
  return (
    <View style={[styles.card, { borderColor: valueColor + '55' }]}>
      <View style={styles.highlight} pointerEvents="none" />
      <View style={[styles.iconWrap, { backgroundColor: valueColor + '1A' }]}>
        <Icon
          size={22}
          color={valueColor}
          weight="duotone"
          duotoneColor={valueColor}
          duotoneOpacity={0.3}
        />
      </View>
      <Text style={[styles.value, { color: valueColor }]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderRadius: theme.radius.md + 2,
    borderWidth: 2,
    backgroundColor: theme.colors.bg.primary,
    shadowColor: theme.colors.ui.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    overflow: 'hidden',
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  value: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  label: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: theme.colors.text.secondary,
  },
});

export default StatCard;
