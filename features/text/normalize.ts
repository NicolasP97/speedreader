export function normalizeText(text: string): string {
  return (
    text
      // 1. Unicode normalization
      .normalize("NFKC")

      // 2. PDF artefacts
      .replace(/\u00AD/g, "")
      .replace(/[\u200B-\u200D\uFEFF]/g, "")
      .replace(/\u00A0/g, " ")

      // 3. Fix hyphenated line breaks
      .replace(/(\w)-\s+(\w)/g, "$1$2")

      // 4. Normalize line breaks & whitespace
      .replace(/\r\n|\r|\n/g, " ")
      .replace(/\s+/g, " ")
      .trim()

      // 5. Typography normalization
      .replace(/[“”„]/g, '"')
      .replace(/[‘’]/g, "'")
      .replace(/[–—]/g, "-")
  );
}
