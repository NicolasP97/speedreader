import { Router } from "express";
import { z } from "zod";
import { buildSystemPrompt, buildUserPrompt } from "../llm/prompt";

export const generateRouter = Router();

const BodySchema = z.object({
  topic: z.string().min(2).max(120),
  language: z.enum(["de", "en"]).default("de"),
  targetWords: z.number().int().min(150).max(1200),
  difficulty: z.enum(["easy", "normal", "advanced"]).default("normal"),
});

generateRouter.post("/generate-rsvp-text", (req, res) => {
  const parsed = BodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid input",
      details: parsed.error.flatten(),
    });
  }

  const input = parsed.data;

  // Prompt bauen (noch kein LLM Call)
  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(input);

  // TEMP: Debug-Response, damit wir den Prompt prüfen können.
  return res.json({
    systemPrompt,
    userPrompt,
  });
});
