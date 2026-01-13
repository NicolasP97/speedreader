export function normalizeText(text: string): string {
  return (
    text
      // 1. Unicode normalization
      .normalize("NFKC")

      // 2. PDF / copy artefacts
      .replace(/\u00AD/g, "")
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      .replace(/\u00A0/g, " ")

      // 3. Fix hyphenated line breaks
      .replace(/(\w)-\s+(\w)/g, "$1$2")

      // 4. Remove non-linguistic markup symbols
      .replace(/\s[>]\s/g, " ")
      .replace(/^[>]\s?/g, "")

      // 5. Relation & symbol normalization (spoken language)

      .replace(/\s\+\s/g, " plus ")
      .replace(/\s=\s/g, " gleich ")
      .replace(/\s&\s/g, " und ")
      .replace(/(\d+)%/g, "$1 Prozent")
      .replace(/€/g, " Euro")
      .replace(/\$/g, " Dollar")
      .replace(/(\d+)\s*°\s*([CF])?/gi, "$1 Grad $2")

      // 6. Remove non-spoken symbols
      .replace(/[|^#]/g, "")

      // 7. Abbreviation expansion (before punctuation logic)
      .replace(/\be\s*\.?\s*g\s*\.?\s*\./gi, "zum Beispiel")
      .replace(/\bi\s*\.?\s*e\s*\.?\s*\./gi, "das heißt")
      .replace(/\bet\s*\.?\s*al\s*\.?\s*\./gi, "und andere")
      .replace(/\betc\s*\.?\s*\./gi, "und so weiter")
      .replace(/\bcf\s*\.?\s*\./gi, "vergleiche")

      // Deutsch
      .replace(/\bz\s*\.?\s*b\s*\.?\s*\./gi, "zum Beispiel")

      .replace(/\bd\s*\.?\s*h\s*\.?\s*\./gi, "das heißt")
      .replace(/\bu\s*\.?\s*a\s*\.?\s*\./gi, "unter anderem")
      .replace(/\bbzw\s*\.?\s*\./gi, "beziehungsweise")
      .replace(/\busw\s*\.?\s*\./gi, "und so weiter")
      .replace(/\bvgl\s*\.?\s*\./gi, "vergleiche")

      // 8. Normalize line breaks & whitespace
      .replace(/\r\n|\r|\n/g, " ")
      .replace(/\s+/g, " ")
      .trim()

      // 9. Typography normalization
      .replace(/[“”„]/g, '"')
      .replace(/[‘’]/g, "'")
      .replace(/[–—]/g, "-")
  );
}
