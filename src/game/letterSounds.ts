/** letter -> phonetic caption + example word. The app has no audio dependency,
 *  so every "sound" is shown, not played (see SoundPulse). */
export type LetterSound = { letter: string; say: string; example: string };

export const LETTER_SOUNDS: LetterSound[] = [
  { letter: 'A', say: 'aa', example: 'ACORN' },
  { letter: 'B', say: 'buh', example: 'BASKET' },
  { letter: 'C', say: 'kuh', example: 'CAT' },
  { letter: 'D', say: 'duh', example: 'DOG' },
  { letter: 'E', say: 'eh', example: 'EGG' },
  { letter: 'F', say: 'fff', example: 'FOX' },
  { letter: 'G', say: 'guh', example: 'GRASS' },
  { letter: 'H', say: 'huh', example: 'HEN' },
  { letter: 'I', say: 'ih', example: 'IVY' },
  { letter: 'J', say: 'juh', example: 'JAM' },
  { letter: 'K', say: 'kuh', example: 'KIT' },
  { letter: 'L', say: 'lll', example: 'LOG' },
  { letter: 'M', say: 'mmm', example: 'MUD' },
  { letter: 'N', say: 'nnn', example: 'NUT' },
  { letter: 'O', say: 'oh', example: 'OWL' },
  { letter: 'P', say: 'puh', example: 'PIG' },
  { letter: 'Q', say: 'kwuh', example: 'QUILL' },
  { letter: 'R', say: 'rrr', example: 'RUG' },
  { letter: 'S', say: 'sss', example: 'SUN' },
  { letter: 'T', say: 'tuh', example: 'TOY' },
  { letter: 'U', say: 'uh', example: 'UP' },
  { letter: 'V', say: 'vvv', example: 'VAN' },
  { letter: 'W', say: 'wuh', example: 'WEB' },
  { letter: 'X', say: 'ks', example: 'BOX' },
  { letter: 'Y', say: 'yuh', example: 'YARN' },
  { letter: 'Z', say: 'zzz', example: 'ZIP' },
];

const BY_LETTER: Record<string, LetterSound> = LETTER_SOUNDS.reduce(
  (acc, item) => {
    acc[item.letter] = item;
    return acc;
  },
  {} as Record<string, LetterSound>,
);

export function soundOf(letter: string): string {
  return BY_LETTER[letter.toUpperCase()]?.say ?? '';
}

export function exampleOf(letter: string): string {
  return BY_LETTER[letter.toUpperCase()]?.example ?? '';
}
