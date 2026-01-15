import { getWordDurationMs } from "../../utils/timing";
import { ReaderEngineOptions, ReaderState } from "./types";
import { PreparedWord } from "./prepareWords";

export class ReaderEngine {
  private words: PreparedWord[];
  private wpm: number;

  /** Zentraler State-Setter */
  private setState(state: ReaderState) {
    if (this.state === state) return;
    this.state = state;
    this.onStateChange?.(state);
  }

  setWords(words: PreparedWord[]) {
    this.reset();
    this.words = words;
    this.index = -1;
  }

  private onWordChange: ReaderEngineOptions["onWordChange"];
  private onStateChange?: ReaderEngineOptions["onStateChange"];

  private index = -1;
  private state: ReaderState = "idle";
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor(options: ReaderEngineOptions) {
    if (!options.words) {
      throw new Error("ReaderEngine: words must be defined");
    }

    this.words = options.words;
    this.wpm = options.wpm;
    this.onWordChange = options.onWordChange;
    // 🔹 NEU
    this.onStateChange = options.onStateChange;
  }

  /** 🔹 Laufzeitänderung der Lesegeschwindigkeit */
  setWpm(wpm: number) {
    if (wpm <= 0) return;
    this.wpm = wpm;
  }

  play() {
    if (this.state === "playing") return;
    if (this.words.length === 0) return;

    //  Am Ende des Textes: nichts tun
    if (this.index === this.words.length - 1) {
      this.setState("paused");
      return;
    }

    if (this.wpm <= 0) {
      throw new Error("ReaderEngine: WPM must be set before play()");
    }

    if (this.index === -1) {
      this.index = 0;
    }

    this.setState("playing");
    this.tick();
  }

  pause() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    this.setState("paused");
  }

  reset() {
    console.log("Reset index: ", this.index);
    this.pause();
    this.index = -1;
    this.setState("idle");
  }

  skipForward(count: number = 1) {
    if (this.index >= this.words.length - 1) {
      return;
    }
    this.skipTo(this.index + count);
  }

  skipBackward(count: number = 1) {
    if (this.index >= 1) {
      this.skipTo(this.index - count);
    }
  }

  private skipTo(targetIndex: number) {
    // 1. Immer pausieren
    this.pause();

    // 2. Clamp Index
    const clampedIndex = Math.max(
      0,
      Math.min(targetIndex, this.words.length - 1)
    );

    this.index = clampedIndex;

    // 3. Sofort rendern
    const preparedWord = this.words[this.index];
    if (!preparedWord) return;

    this.onWordChange(preparedWord, this.index);
  }

  private tick() {
    if (this.state !== "playing") return;

    if (this.index < 0 || this.index >= this.words.length) {
      this.pause();
      return;
    }

    const preparedWord = this.words[this.index];
    if (!preparedWord) {
      this.pause();
      return;
    }

    this.onWordChange(preparedWord, this.index);

    const duration = getWordDurationMs(preparedWord.word, this.wpm);

    this.timeoutId = setTimeout(() => {
      if (this.index >= this.words.length - 1) {
        this.pause();
        return;
      }

      this.index += 1;
      this.tick();
    }, duration);
  }
}
