import { CATCH_BAND_BOTTOM, CATCH_BAND_TOP, BASKET_W } from '../constants/config';

export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** First slot of the word that still needs a letter, or -1 when the word is done. */
export function nextNeededIndex(caught: boolean[]): number {
  return caught.indexOf(false);
}

export function neededLetter(word: string, caught: boolean[]): string | null {
  const idx = nextNeededIndex(caught);
  return idx === -1 ? null : word[idx];
}

function randomOf(pool: string[]): string {
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * 55% the needed letter, 30% another letter of the same word, 15% a distractor.
 * `force` overrides everything so a child never waits more than
 * FORCE_NEEDED_EVERY spawns for a useful acorn.
 */
export function pickLetter(word: string, caught: boolean[], force: boolean): string {
  const needed = neededLetter(word, caught);
  if (!needed) {
    return randomOf(ALPHABET.split(''));
  }
  if (force) {
    return needed;
  }
  const roll = Math.random();
  if (roll < 0.55) {
    return needed;
  }
  if (roll < 0.85) {
    const others = word.split('').filter(l => l !== needed);
    return others.length > 0 ? randomOf(others) : needed;
  }
  const distractors = ALPHABET.split('').filter(l => !word.includes(l));
  return distractors.length > 0 ? randomOf(distractors) : needed;
}

/** True when a falling acorn has entered the basket mouth. */
export function isCaught(
  acornLeft: number,
  acornSize: number,
  acornY: number,
  basketLeft: number,
  basketTop: number,
): boolean {
  const bottom = acornY + acornSize;
  if (bottom < basketTop + CATCH_BAND_TOP || bottom > basketTop + CATCH_BAND_BOTTOM) {
    return false;
  }
  const acornCenter = acornLeft + acornSize / 2;
  const basketCenter = basketLeft + BASKET_W / 2;
  return Math.abs(acornCenter - basketCenter) <= BASKET_W / 2 + 8;
}

export type RoundStatus = 'intro' | 'playing' | 'complete';
