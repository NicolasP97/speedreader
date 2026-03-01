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

  try {
    const text = await generateText({
      system: systemPrompt,
      user: userPrompt,
    });

    return res.json({ text });
  } catch (error: any) {
    console.error("LLM generation failed:", error?.message);

    return res.status(500).json({
      error: "Text generation failed",
    });
  }
});
