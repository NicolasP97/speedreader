import { normalizeText } from "./normalize";

export function tokenizeText(text: string): string[] {
  const normalized = normalizeText(text);

  if (!normalized) return [];
  const normalizedText = normalized.split(" ");

  return normalizedText;
}
