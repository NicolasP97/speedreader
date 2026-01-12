import { PreparedWord } from "./prepareWords";

export type ReaderState = "idle" | "playing" | "paused";

export interface ReaderEngineOptions {
  words: PreparedWord[];
  wpm: number;
  onWordChange: (word: PreparedWord, index: number) => void;
}
