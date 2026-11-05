/** The six picture-word sets. Words are stored uppercase; the Grown-Ups
 *  case switch lowercases them for display only. */
export type SetId = 'animals' | 'food' | 'home' | 'nature' | 'go' | 'fun';

export type WordSet = {
  id: SetId;
  name: string;
  icon: 'dog' | 'carrot' | 'house' | 'sun' | 'car' | 'star';
  unlockAfter: SetId | null;
  words: string[];
};

export const WORD_SETS: WordSet[] = [
  {
    id: 'animals',
    name: 'ANIMALS',
    icon: 'dog',
    unlockAfter: null,
    words: ['CAT', 'DOG', 'PIG', 'HEN', 'COW', 'FOX', 'BEE', 'OWL'],
  },
  {
    id: 'food',
    name: 'FOOD',
    icon: 'carrot',
    unlockAfter: null,
    words: ['JAM', 'EGG', 'BUN', 'PIE', 'NUT', 'FIG'],
  },
  {
    id: 'home',
    name: 'HOME',
    icon: 'house',
    unlockAfter: null,
    words: ['BED', 'CUP', 'POT', 'RUG', 'BOX', 'MUG'],
  },
  {
    id: 'nature',
    name: 'NATURE',
    icon: 'sun',
    unlockAfter: null,
    words: ['SUN', 'LOG', 'MUD', 'BUG', 'WEB', 'IVY'],
  },
  {
    id: 'go',
    name: 'GO',
    icon: 'car',
    unlockAfter: 'animals',
    words: ['VAN', 'BUS', 'JET', 'MAP', 'BAG', 'TRIP', 'ROAD'],
  },
  {
    id: 'fun',
    name: 'FUN',
    icon: 'star',
    unlockAfter: 'animals',
    words: ['TOY', 'HAT', 'TOP', 'PEN', 'KIT', 'PLAY', 'SONG'],
  },
];

export function getSet(id: SetId): WordSet {
  return WORD_SETS.find(s => s.id === id) ?? WORD_SETS[0];
}

/** Index of the first word of the set that has not been learned yet. */
export function firstUnlearned(set: WordSet, learned: string[]): number {
  const idx = set.words.findIndex(w => !learned.includes(w));
  return idx === -1 ? 0 : idx;
}
