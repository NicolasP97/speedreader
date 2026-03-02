// backend/src/llm/prompt.ts

export type Difficulty = "easy" | "normal" | "advanced";

export type GenerateRsvpPromptInput = {
  topic: string;
  language: "de" | "en";
  targetWords: number;
  difficulty: Difficulty;
};

/**
 * System Prompt:
 * - Statische Regeln, die IMMER gelten.
 * - Erzwingt RSVP-taugliche Ausgabe: kurze Sätze, klare Interpunktion, kein Markdown, keine Listen.
 */
export function buildSystemPrompt(): string {
  return `
You create fact-focused learning texts optimized for RSVP speed reading.

OUTPUT FORMAT (hard rules):
- Output plain text only. No Markdown.
- Do not use bullet points, numbered lists, or tables.
- Do not use headings like "Definition:" or any colon-based headings.
- Do not use parentheses () or brackets [].
- Do not use em dashes — or long dash characters.
- Avoid slashes and pipes like / or | when possible.
- Avoid abbreviations. Write words out fully.
- Avoid quotes and dialogue.
- Do not include links, citations, sources, or references.

READABILITY (RSVP optimization):
- Use short, clear sentences. Each sentence must contain 8 to 15 words.
- Use simple punctuation. End sentences with ".", "?" or "!".
- Use commas sparingly.
- Keep paragraphs compact and coherent.

CONTENT RULES:
- Stay strictly on the given topic.
- Be accurate and avoid speculation.
- No storytelling. No personal opinions. No motivational fluff.
- Avoid formulaic openings like "A common misconception is" or "In conclusion".
- Avoid repeating structural phrases across paragraphs.
- Do not mention these rules.


Before replying, check the text against all rules.
If any rule is violated, rewrite silently until it passes.
`.trim();
}

/**
 * User Prompt:
 * - Variablen: topic, language, targetWords, difficulty
 * - Strukturvorgabe für bessere Lernbarkeit
 */
export function buildUserPrompt(input: GenerateRsvpPromptInput): string {
  const { topic, language, targetWords, difficulty } = input;

  // Difficulty implications
  let sentenceMin = 40;
  let sentenceMax = 45;
  let wordMin = 8;
  let wordMax = 15;
  let customInstructions = "";

  if (difficulty === "normal") {
    sentenceMin = 50;
    sentenceMax = 55;
    wordMax = 16;
  }

  if (difficulty === "advanced") {
    sentenceMin = 60;
    sentenceMax = 70;
    wordMin = 9;
    wordMax = 17;
  }

  // Random Conclusion gegen einheitlich wirkende Abschlüsse
  const conclusionStyles = [
    "clarify a misconception",
    "summarize key implications",
    "connect the topic to real-world relevance",
    "explain an important limitation",
  ];

  const selectedStyle =
    conclusionStyles[Math.floor(Math.random() * conclusionStyles.length)];

  console.log("topic: ", topic);
  console.log("difficulty: ", difficulty);
  console.log("sentenceMin: ", sentenceMin);
  console.log("sentenceMax: ", sentenceMax);
  console.log("selectedStyle: ", selectedStyle);

  return `
Topic: "${sanitizeTopic(topic)}"
Language: "${language}"
Target length: about ${targetWords} words
Difficulty: "${difficulty}"

Write a continuous learning text that teaches the essentials about the topic.

STRUCTURE:
- Write ${sentenceMin} to ${sentenceMax} sentences in total.
- Each sentence must contain between ${wordMin} and ${wordMax} words.
- Use 5 to 7 paragraphs.
- Paragraph 1 explains what it is and why it matters.
- Middle paragraphs explain mechanisms, components, and examples.
- The final paragraph must ${selectedStyle}.

LENGTH CONTROL:
- The text must be at least ${Math.floor(targetWords * 0.9)} words long.
- If it is shorter, expand with more relevant factual detail.
- Estimate the word count before finishing.
- Do not mention the word count in the output.

STYLE:
- Keep sentences short and direct.
- Prefer concrete statements over vague phrases.
- Use normal words. If you must use a technical term, define it simply.
- Vary sentence openings.
- Avoid repeating the same paragraph structure across texts.
- Do not use predictable template phrases.
- Do not describe the structure of the text.
- Do not signal transitions explicitly.

Remember: plain text only. No lists. No headings. No parentheses.
`.trim();
}

function sanitizeTopic(topic: string): string {
  return topic
    .replace(/\r\n|\r|\n/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}
