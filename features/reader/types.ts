export type ReaderState = "idle" | "playing" | "paused";

export interface ReaderEngineOptions {
  words: string[];
  wpm: number;
  onWordChange: (word: string, index: number) => void;
}
