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
  fontFamily: keyof typeof MONO_GLYPH_WIDTH_FACTOR;
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
  options: PrepareWordsOptions,
): PreparedWord[] {
  const { fontSize, fontWeight, orpX, fontFamily } = options;

  return words
    .filter((w): w is string => typeof w === "string")
    .map((word) => {
      const orpIndex = getOrpIndex(word);

      const left = word.slice(0, orpIndex);
      const orpChar = word.charAt(orpIndex);

      const leftWidth = measureText(left, fontSize, fontWeight, fontFamily);
      const orpWidth = measureText(orpChar, fontSize, fontWeight, fontFamily);

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

/**
   *Monospace fontFactor Werte:
   - Inconsolata = fontSize * 0.5;
   - Firacode = fontSize * 0.59;
   */
const MONO_GLYPH_WIDTH_FACTOR: Record<string, number> = {
  Atkinson: 0.62,
  Azeret: 0.64,
  B612: 0.64,
  Cousine: 0.59,
  Firacode: 0.59,
  Fragment: 0.61,
  Inconsolata: 0.5,
  JetBrains: 0.59,
  Libertinus: 0.64,
  Oxygen: 0.6,
  Reddit: 0.555,
  Ubuntu: 0.5,
  Xanh: 0.49,
};

function measureText(
  text: string,
  fontSize: number,
  fontWeight: "600",
  fontFamily: keyof typeof MONO_GLYPH_WIDTH_FACTOR,
): number {
  if (!text) return 0;

  const factor = MONO_GLYPH_WIDTH_FACTOR[fontFamily] ?? 0.55; // fallback

  // text.length ist einfach Anzahl der Monospace Buchstaben
  return text.length * fontSize * factor;
}
