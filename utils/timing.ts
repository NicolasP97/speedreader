// utils/timing.ts

export function wpmToMs(wpm: number): number {
  if (wpm <= 0) {
    throw new Error("WPM must be greater than 0");
  }

  return 60000 / wpm;
}

export function getPauseMultiplier(word: string): number {
  if (/[.!?]$/.test(word)) return 3;
  if (/[,;:]$/.test(word)) return 1.5;
  return 1;
}

export function getWordDurationMs(word: string, wpm: number): number {
  const base = wpmToMs(wpm);
  const multiplier = getPauseMultiplier(word);

  return base * multiplier;
}
