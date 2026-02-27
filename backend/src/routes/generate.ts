import { Router } from "express";
import { z } from "zod";

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

  const { topic, language, targetWords, difficulty } = parsed.data;

  const text =
    language === "de"
      ? `Thema: ${topic}. Modus: ${difficulty}. Ziel: ${targetWords} Wörter. Dies ist ein Platzhaltertext.`
      : `Topic: ${topic}. Mode: ${difficulty}. Target: ${targetWords} words. This is placeholder text.`;

  res.json({ text });
});
