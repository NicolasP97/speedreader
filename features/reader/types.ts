export type ReaderState = "idle" | "playing" | "paused";

export interface ReaderEngineOptions {
  length: number;
  wpm: number;
  getDurationMs: (index: number) => number;

  onIndexChange: (index: number) => void;
  onStateChange?: (state: ReaderState) => void;
}
