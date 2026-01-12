import { getWordDurationMs } from "../../utils/timing";
import { ReaderEngineOptions, ReaderState } from "./types";

export class ReaderEngine {
  private words: string[];
  private wpm: number;

  private onWordChange: ReaderEngineOptions["onWordChange"];

  private index = 0;
  private state: ReaderState = "idle";
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor(options: ReaderEngineOptions) {
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
    if (this.state === "playing") return;

    // Schutz: nicht starten ohne gültige WPM
    if (this.wpm <= 0) {
      throw new Error("ReaderEngine: WPM must be set before play()");
    }

    this.state = "playing";
    this.tick();
  }

  pause() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    this.state = "paused";
  }

  reset() {
    this.pause();
    this.index = 0;
    this.state = "idle";
  }

  jumpTo(index: number) {
    if (index < 0 || index >= this.words.length) return;

    this.index = index;

    if (this.state === "playing") {
      this.pause();
      this.play();
    }
  }

  private tick() {
    if (this.state !== "playing") return;
    if (this.index >= this.words.length) {
      this.reset();
      return;
    }

    const word = this.words[this.index];
    this.onWordChange(word, this.index);

    const duration = getWordDurationMs(word, this.wpm);

    this.timeoutId = setTimeout(() => {
      this.index += 1;
      this.tick();
    }, duration);
  }
}
