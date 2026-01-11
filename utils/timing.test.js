const {
  wpmToMs,
  getPauseMultiplier,
  getWordDurationMs,
} = require("../utils/timing");

describe("timing utils", () => {
  test("wpmToMs converts correctly", () => {
    expect(wpmToMs(60)).toBe(1000);
    expect(wpmToMs(300)).toBe(200);
  });

  test("pause multiplier for punctuation", () => {
    expect(getPauseMultiplier("hello")).toBe(1);
    expect(getPauseMultiplier("hello,")).toBe(1.5);
    expect(getPauseMultiplier("hello.")).toBe(3);
    expect(getPauseMultiplier("hello!")).toBe(3);
  });

  test("word duration combines wpm and punctuation", () => {
    expect(getWordDurationMs("test", 60)).toBe(1000);
    expect(getWordDurationMs("test.", 60)).toBe(3000);
  });
});
