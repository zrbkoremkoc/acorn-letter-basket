import React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Ellipse, Line } from 'react-native-svg';
import theme from '../constants/theme';

type Props = { width: number; height?: number };

/** The oak branch the acorns drop from: a wood-grain plank with leaf clusters. */
export function WoodBand({ width, height = 26 }: Props) {
  return (
    <View style={[styles.band, { width, height }]} pointerEvents="none">
      <LinearGradient
        colors={theme.gradients.wood as unknown as string[]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Svg width={width} height={height}>
        <Line
          x1={0}
          y1={height * 0.32}
          x2={width}
          y2={height * 0.32}
          stroke="rgba(59,42,26,0.22)"
          strokeWidth={2}
        />
        <Line
          x1={0}
          y1={height * 0.62}
          x2={width}
          y2={height * 0.62}
          stroke="rgba(59,42,26,0.16)"
          strokeWidth={2}
        />
        <Ellipse
          cx={width * 0.22}
          cy={height - 3}
          rx={16}
          ry={7}
          fill={theme.colors.earth.leaf}
          opacity={0.55}
        />
        <Ellipse
          cx={width * 0.55}
          cy={height - 2}
          rx={20}
          ry={8}
          fill={theme.colors.earth.leaf}
          opacity={0.42}
        />
        <Ellipse
          cx={width * 0.84}
          cy={height - 3}
          rx={14}
          ry={6}
          fill={theme.colors.earth.leaf}
          opacity={0.5}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  band: {
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(59,42,26,0.25)',
  },
});

export default WoodBand;
