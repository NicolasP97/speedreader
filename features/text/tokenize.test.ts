import { normalizeText } from "./normalize";
import { tokenizeText } from "./tokenize";

describe("text normalization", () => {
  test("removes line breaks and extra whitespace", () => {
    const input = "Hello\n\nworld   this is\n a test";
    const result = normalizeText(input);

    expect(result).toBe("Hello world this is a test");
  });
});

describe("tokenization", () => {
  test("splits text into words", () => {
    const input = "Hello world.";
    const tokens = tokenizeText(input);

    expect(tokens).toEqual(["Hello", "world."]);
  });

  test("handles empty input", () => {
    expect(tokenizeText("")).toEqual([]);
    expect(tokenizeText("   ")).toEqual([]);
  });

  test("keeps punctuation attached", () => {
    const input = "Wait, what?";
    const tokens = tokenizeText(input);

    expect(tokens).toEqual(["Wait,", "what?"]);
  });
});
