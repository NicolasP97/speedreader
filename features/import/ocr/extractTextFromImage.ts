// ./features/import/ocr/extractTextFromImage.ts
import { extractTextFromImage, isSupported } from "expo-text-extractor";

export async function ocrImage(uri: string): Promise<string> {
  if (!isSupported) {
    throw new Error("OCR is not supported on this device.");
  }

  const lines = await extractTextFromImage(uri); // Promise<string[]> :contentReference[oaicite:5]{index=5}
  return (lines ?? []).join("\n").trim();
}
