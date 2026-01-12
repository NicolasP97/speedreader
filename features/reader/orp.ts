export function getOrpIndex(word: unknown): number {
  if (typeof word !== "string" || word.length === 0) {
    return 0;
  }

  const length = word.length;

  if (length <= 1) return 0;
  if (length <= 5) return 1;
  if (length <= 9) return 2;
  return 3;
}
