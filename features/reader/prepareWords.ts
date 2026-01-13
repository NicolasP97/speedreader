import { getOrpIndex } from "./orp";

/**
 * Ergebnisstruktur für RSVP-Rendering
 */
export interface PreparedWord {
  word: string;
  orpIndex: number;
  leftOffset: number;
}

/**
 * Optionen, die für die Messung relevant sind
 * (müssen exakt mit dem Renderer übereinstimmen!)
 */
interface PrepareWordsOptions {
  fontSize: number;
  fontWeight: "600";
  orpX: number;
}

/**
 * Bereitet Wörter vollständig für RSVP vor.
 *
 * WICHTIG:
 * - Diese Funktion MUSS aufgerufen werden,
 *   nachdem die Screen-Breite bekannt ist
 * - Sie darf NICHT während des Renderings laufen
 */
export function prepareWords(
  words: string[],
  options: PrepareWordsOptions
): PreparedWord[] {
  const { fontSize, fontWeight, orpX } = options;

  return words
    .filter((w): w is string => typeof w === "string")
    .map((word) => {
      const orpIndex = getOrpIndex(word);

      const left = word.slice(0, orpIndex);
      const orpChar = word.charAt(orpIndex);

      const leftWidth = measureText(left, fontSize, fontWeight);
      const orpWidth = measureText(orpChar, fontSize, fontWeight);

      const leftOffset = orpX - (leftWidth + orpWidth / 2);

      return {
        word,
        orpIndex,
        leftOffset,
      };
    });
}

/**
 * Platzhalter für Textmessung.
 *
 * Aktuell:
 * - bewusst synchron
 * - bewusst gekapselt
 *
 * Nächster Schritt:
 * - Austausch gegen react-native-text-size
 *   oder native Text-Metrics
 */
function measureText(
  text: string,
  fontSize: number,
  fontWeight: "600"
): number {
  if (!text) return 0;

  /**
   * TEMPORÄRE NÄHERUNG:
   * durchschnittliche Glyphenbreite ≈ 0.55 * fontSize
   *
   * Das ist:
   * - nicht perfekt
   * - aber deterministisch
   * - und gut genug, um Option B sauber aufzubauen
   */
  const AVERAGE_GLYPH_WIDTH = fontSize * 0.5;

  console.log("prepareWords text.length: ", text.length);
  console.log("prepareWords AVERAGE_GLYPH_WIDTH: ", AVERAGE_GLYPH_WIDTH);

  return text.length * AVERAGE_GLYPH_WIDTH;
}
