/** Tunables for the catch loop and the shell timings. */
export const LOADER_DURATION_MS = 8000; // EXACTLY 8000 - shorter races the screenshot gate
export const LOADER_FADE_MS = 350;

export const FALL_MS = { calm: 5200, normal: 4200, quick: 3200 } as const;
export type SpeedKey = keyof typeof FALL_MS;

export const BEDTIME_MULTIPLIER = 1.4;
export const SPAWN_MS = 1500;
export const MAX_ACORNS = 3;
export const FORCE_NEEDED_EVERY = 3;

export const CATCH_BOUNCE_MS = 140;
export const REJECT_HOP_MS = 420;
export const SOUND_PULSE_MS = 420;

export const BASKET_W = 120;
export const BASKET_H = 78;
export const BASKET_BOTTOM = 108;
export const BASKET_MARGIN = 10;
export const ACORN = 64;
export const LANES = 4;
export const CATCH_BAND_TOP = 4;
export const CATCH_BAND_BOTTOM = 48;

export const ROUND_INTRO_MS = 900;
export const ROUND_OUTRO_MS = 600;

export const HOLD_GATE_MS = 3000;
export const TOTAL_WORDS = 150;
export const MASTERY_HITS = 5;
export const TOTAL_LETTERS = 26;

export const SPRING = {
  soft: { tension: 45, friction: 8 },
  press: { tension: 300, friction: 12 },
  celebrate: { tension: 60, friction: 6 },
  enter: { tension: 40, friction: 9 },
} as const;
