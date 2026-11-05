import { useEffect, useRef } from 'react';

type Options = {
  active: boolean;
  spawnMs: number;
  onSpawn: () => void;
};

/** Drives the spawn loop. The callback is held in a ref so restarting the
 *  interval never depends on a fresh closure. */
export function useAcornSpawner({ active, spawnMs, onSpawn }: Options) {
  const cbRef = useRef(onSpawn);
  cbRef.current = onSpawn;

  useEffect(() => {
    if (!active) {
      return;
    }
    const first = setTimeout(() => cbRef.current(), 260);
    const timer = setInterval(() => cbRef.current(), spawnMs);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, [active, spawnMs]);
}
