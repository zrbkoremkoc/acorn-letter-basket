import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import assets from '../assets';
import theme from '../constants/theme';

export type ShellVariant = 'dusk' | 'day' | 'paper' | 'play' | 'reveal';

const OVERLAYS: Record<ShellVariant, string[]> = {
  dusk: theme.gradients.dusk as unknown as string[],
  day: theme.gradients.day as unknown as string[],
  paper: theme.gradients.paper as unknown as string[],
  play: theme.gradients.play as unknown as string[],
  reveal: theme.gradients.reveal as unknown as string[],
};

type Props = {
  variant: ShellVariant;
  dim?: boolean;
  children: React.ReactNode;
};

/** Every screen gets the same woodland art and differs only by its overlay
 *  (rule #14). Never a flat fill. */
export function AppShell({ variant, dim, children }: Props) {
  return (
    <ImageBackground source={assets.bgGame} resizeMode="cover" style={styles.bg}>
      <LinearGradient
        colors={OVERLAYS[variant]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {dim ? <View style={styles.bedtime} pointerEvents="none" /> : null}
      <View style={styles.content} pointerEvents="box-none">
        {children}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: theme.colors.bg.primary },
  content: { flex: 1 },
  bedtime: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(44,30,18,0.55)' },
});

export default AppShell;
