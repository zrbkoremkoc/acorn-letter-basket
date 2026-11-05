/**
 * WARM_EARTHY preset copy with the two brief accents overridden
 * (chestnut primary + leaf-green "correct"). The `name` field stays verbatim.
 */
export const theme = {
  name: 'warm-earthy',
  colors: {
    bg: {
      primary: '#F6F1DE',
      secondary: '#F2EAD8',
      tertiary: '#E8DDC4',
      accent: '#D8C9A8',
      sand: '#E3D5A9',
    },
    earth: {
      chestnut: '#A0522D',
      chestnutLight: '#B9603A',
      leaf: '#4CAF50',
      leafDark: '#3E9E43',
      terracotta: '#D97B4D',
      mustard: '#D9B36C',
      walnut: '#6B5740',
      bark: '#8A6B4A',
      cream: '#FFF8E8',
    },
    text: {
      primary: '#3B2A1A',
      secondary: '#8A7355',
      muted: '#A89B82',
      onDark: '#FFF8E8',
      accent: '#4CAF50',
    },
    ui: {
      border: '#D8C9A8',
      divider: '#E8DDC4',
      overlay: 'rgba(44,30,18,0.88)',
      glass: 'rgba(246,241,222,0.94)',
      shadow: '#3B2A1A',
    },
  },
  gradients: {
    dusk: ['rgba(44,30,18,0.88)', 'rgba(59,42,26,0.94)', 'rgba(26,18,10,0.97)'],
    duskDeep: ['rgba(26,18,10,0.93)', 'rgba(44,30,18,0.96)', 'rgba(16,10,5,0.98)'],
    day: ['rgba(246,241,222,0.10)', 'rgba(246,241,222,0.42)', '#F6F1DE'],
    paper: ['rgba(246,241,222,0.92)', 'rgba(232,221,196,0.96)'],
    play: ['rgba(246,241,222,0.20)', 'rgba(246,241,222,0.55)', 'rgba(227,213,169,0.82)'],
    reveal: ['rgba(76,175,80,0.22)', 'rgba(246,241,222,0.92)', 'rgba(227,213,169,0.96)'],
    primaryBtn: ['#A0522D', '#B9603A'],
    successBtn: ['#4CAF50', '#3E9E43'],
    loaderBar: ['#A0522D', '#4CAF50'],
    wood: ['#9B7850', '#8A6B4A', '#71553A'],
  },
  typography: {
    hero: { fontSize: 44, fontWeight: '900' as const, letterSpacing: 4 },
    title: { fontSize: 28, fontWeight: '900' as const, letterSpacing: 1.2 },
    section: { fontSize: 18, fontWeight: '800' as const, letterSpacing: 1.4 },
    body: { fontSize: 15, fontWeight: '600' as const, letterSpacing: 0.2 },
    caption: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 1.6 },
  },
  radius: { sm: 8, md: 12, lg: 16, xl: 22, round: 999 },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },
} as const;

export type Theme = typeof theme;
export default theme;
