import { getWordDurationMs } from "../../utils/timing";
import { ReaderEngineOptions, ReaderState } from "./types";
import { PreparedWord } from "./prepareWords";

export class ReaderEngine {
  private words: PreparedWord[];
  private wpm: number;

  private onWordChange: ReaderEngineOptions["onWordChange"];

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
  }

  /** 🔹 Laufzeitänderung der Lesegeschwindigkeit */
  setWpm(wpm: number) {
    if (wpm <= 0) return;
    this.wpm = wpm;
  }

  play() {
    console.log("play");
    if (this.state === "playing") return;
    if (this.words.length === 0) return;

    if (this.wpm <= 0) {
      throw new Error("ReaderEngine: WPM must be set before play()");
    }

    this.state = "playing";
    if (this.index === -1) {
      this.index = 0;
    }
    this.tick();
  }

  pause() {
    console.log("pause");
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    if (this.state === "playing") {
      this.state = "paused";
    }
  }

  reset() {
    console.log("Reset index: ", this.index);
    this.pause();
    this.index = -1;
    this.state = "idle";
  }

  skipForward(count: number = 1) {
    if (this.index >= this.words.length - 1) {
      return;
    }
    this.skipTo(this.index + count);
    console.log("Forward 2 index: ", this.index);
  }

  skipBackward(count: number = 1) {
    if (this.index >= 1) {
      this.skipTo(this.index - count);
      console.log("Backward index: ", this.index);
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

    // Ende erreicht → stoppen, NICHT resetten
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
      this.index += 1;

      // Wenn wir JETZT über das Ende hinaus wären → stoppen
      if (this.index >= this.words.length) {
        this.index = this.words.length - 1;
        this.pause();
        return;
      }

      this.tick();
    }, duration);
  }
}
