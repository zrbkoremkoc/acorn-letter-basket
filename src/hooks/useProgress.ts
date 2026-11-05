import { useCallback, useState } from 'react';
import { MASTERY_HITS } from '../constants/config';

export type ProgressState = {
  acorns: number;
  learnedWords: string[];
  letterHits: Record<string, number>;
  stickers: number;
};

const EMPTY: ProgressState = {
  acorns: 0,
  learnedWords: [],
  letterHits: {},
  stickers: 0,
};

export function masteredCount(letterHits: Record<string, number>): number {
  return Object.keys(letterHits).filter(k => letterHits[k] >= MASTERY_HITS).length;
}

/** Owned once, in App.tsx. Screens receive the individual numbers they need
 *  rather than the whole object (react-state-minimize). */
export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(EMPTY);

  const registerCatch = useCallback((letter: string) => {
    setProgress(prev => ({
      ...prev,
      acorns: prev.acorns + 1,
      letterHits: { ...prev.letterHits, [letter]: (prev.letterHits[letter] ?? 0) + 1 },
    }));
  }, []);

  const completeWord = useCallback((word: string, setFinished: boolean) => {
    setProgress(prev => ({
      ...prev,
      learnedWords: prev.learnedWords.includes(word)
        ? prev.learnedWords
        : [...prev.learnedWords, word],
      stickers: setFinished ? prev.stickers + 1 : prev.stickers,
    }));
  }, []);

  const reset = useCallback(() => setProgress(EMPTY), []);

  return { progress, registerCatch, completeWord, reset };
}
