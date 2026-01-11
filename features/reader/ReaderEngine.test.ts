import { ReaderEngine } from "./ReaderEngine";

describe("ReaderEngine", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  test("plays words sequentially", () => {
    const words = ["Hello", "world."];
    const onWordChange = jest.fn();

    const engine = new ReaderEngine({
      words,
      wpm: 60,
      onWordChange,
    });

    engine.play();

    expect(onWordChange).toHaveBeenCalledWith("Hello", 0);

    jest.advanceTimersByTime(1000);
    expect(onWordChange).toHaveBeenCalledWith("world.", 1);
  });

  test("pauses correctly", () => {
    const words = ["One", "Two"];
    const onWordChange = jest.fn();

    const engine = new ReaderEngine({
      words,
      wpm: 60,
      onWordChange,
    });

    engine.play();
    engine.pause();

    jest.advanceTimersByTime(2000);

    expect(onWordChange).toHaveBeenCalledTimes(1);
  });

  test("jumpTo works", () => {
    const words = ["A", "B", "C"];
    const onWordChange = jest.fn();

    const engine = new ReaderEngine({
      words,
      wpm: 60,
      onWordChange,
    });

    engine.jumpTo(2);
    engine.play();

    expect(onWordChange).toHaveBeenCalledWith("C", 2);
  });
});
