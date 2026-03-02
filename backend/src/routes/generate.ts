// backend/src/routes/generate.ts
import { Router } from "express";
import { z } from "zod";
import { buildSystemPrompt, buildUserPrompt } from "../llm/prompt";
import { generateText } from "../llm/client";

export const generateRouter = Router();

const BodySchema = z.object({
  topic: z.string().min(2).max(120),
  language: z.enum(["de", "en"]).default("de"),
  targetWords: z.number().int().min(150).max(1200),
  difficulty: z.enum(["easy", "normal", "advanced"]).default("normal"),
});

generateRouter.post("/generate-rsvp-text", async (req, res) => {
  const parsed = BodySchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid input",
      details: parsed.error.flatten(),
    });
  }

  const input = parsed.data;

  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(input);

  let lastError: any;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      let text = await generateText({
        system: systemPrompt,
        user: userPrompt,
      });

      const words = text.split(/\s+/).length;
      const minWords = Math.floor(input.targetWords * 0.9);

      if (words < minWords) {
        const expansionPrompt = `
The following text is too short.

Current length: ${words} words.
Required minimum length: ${minWords} words.

Expand the text with additional relevant factual detail.
Do not repeat sentences.
Keep all original formatting rules.
Return the full improved text.

TEXT:
${text}
      `.trim();

        text = await generateText({
          system: systemPrompt,
          user: expansionPrompt,
        });
      }

      return res.json({ text });
    } catch (error: any) {
      lastError = error;
    }
  }

  console.error("LLM generation failed:", lastError?.message);
  return res.status(500).json({
    error: "Text generation failed",
  });
});
