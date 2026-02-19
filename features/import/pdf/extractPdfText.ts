// features/import/pdf/extractPdfText.ts
import { extractText } from "expo-pdf-text-extract";

export async function extractPdfText(uri: string): Promise<string> {
  // expo-pdf-text-extract erwartet eine lokale file:// URI (DocumentPicker + copyToCacheDirectory = true)
  const text = await extractText(uri);

  // Defensive: manchmal kommt null/undefined/whitespace
  return (text ?? "").trim();
}
