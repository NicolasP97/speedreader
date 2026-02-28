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
- Use short, clear sentences. Prefer 8 to 14 words per sentence.
- Use simple punctuation. End sentences with ".", "?" or "!".
- Use commas sparingly.
- Keep paragraphs compact and coherent.

CONTENT RULES:
- Stay strictly on the given topic.
- Be accurate and avoid speculation.
- No storytelling. No personal opinions. No motivational fluff.
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

  return `
Topic: "${sanitizeTopic(topic)}"
Language: "${language}"
Target length: about ${targetWords} words
Difficulty: "${difficulty}"

Write a continuous learning text that teaches the essentials about the topic.

STRUCTURE:
- 4 to 6 paragraphs.
- Each paragraph has 3 to 5 sentences.
- Paragraph 1 explains what it is and why it matters.
- Middle paragraphs explain key mechanisms, components, and examples.
- Final paragraph explains common misconceptions or practical implications.

STYLE:
- Keep sentences short and direct.
- Prefer concrete statements over vague phrases.
- Use normal words. If you must use a technical term, define it simply.

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
