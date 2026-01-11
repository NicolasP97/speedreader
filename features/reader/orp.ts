export function getOrpIndex(word: string): number {
  const length = word.length;

  if (length <= 1) return 0;
  if (length <= 5) return 1;
  if (length <= 9) return 2;
  return 3;
}
