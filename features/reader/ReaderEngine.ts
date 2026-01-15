import { ReaderEngineOptions, ReaderState } from "./types";

export class ReaderEngine {
  private length: number;

  private index = -1;
  private state: ReaderState = "idle";
  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  private getDurationMs: (index: number) => number;
  private onIndexChange: (index: number) => void;
  private onStateChange?: (state: ReaderState) => void;

  constructor(options: ReaderEngineOptions) {
    if (options.length <= 0) {
      throw new Error("ReaderEngine: length must be > 0");
    }

    this.length = options.length;
    this.getDurationMs = options.getDurationMs;
    this.onIndexChange = options.onIndexChange;
    this.onStateChange = options.onStateChange;
  }

  play() {
    if (this.state === "playing") return;
    if (this.index >= this.length - 1) return;

    if (this.index === -1) {
      this.index = 0;
      this.onIndexChange(this.index);
    }

    this.setState("playing");
    this.tick();
  }

  pause() {
    this.clearTimer();
    this.setState("paused");
  }

  reset() {
    this.clearTimer();
    this.index = -1;
    this.setState("idle");
  }

  skipForward(count = 1) {
    this.skipTo(this.index + count);
  }

  skipBackward(count = 1) {
    this.skipTo(this.index - count);
  }

  private skipTo(targetIndex: number) {
    this.clearTimer();

    const clampedIndex = Math.max(-1, Math.min(targetIndex, this.length - 1));

    this.index = clampedIndex;

    if (this.index >= 0) {
      this.onIndexChange(this.index);
    }

    this.setState("paused");
  }

  private tick() {
    if (this.state !== "playing") return;

    if (this.index < 0 || this.index >= this.length) {
      this.reset();
      return;
    }

    const duration = this.getDurationMs(this.index);

    this.timeoutId = setTimeout(() => {
      if (this.index >= this.length - 1) {
        this.setState("idle");
        return;
      }

      this.index += 1;
      this.onIndexChange(this.index);
      this.tick();
    }, duration);
  }

  private setState(state: ReaderState) {
    if (this.state === state) return;
    this.state = state;
    this.onStateChange?.(state);
  }

  private clearTimer() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
