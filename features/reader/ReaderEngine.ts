import { getWordDurationMs } from "../../utils/timing";
import { ReaderEngineOptions, ReaderState } from "./types";
import { PreparedWord } from "./prepareWords";

export class ReaderEngine {
  private words: PreparedWord[];
  private wpm: number;

  private onWordChange: ReaderEngineOptions["onWordChange"];

  private index = 0;
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

    const preparedWord = this.words[this.index];
    if (!preparedWord) {
      this.reset();
      return;
    }
    this.onWordChange(preparedWord, this.index);

    const duration = getWordDurationMs(preparedWord.word, this.wpm);

    console.log(
      "Reader Engine PREPARE WORD:",
      preparedWord,
      typeof preparedWord
    );

    this.timeoutId = setTimeout(() => {
      this.index += 1;
      this.tick();
    }, duration);
  }
}
