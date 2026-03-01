// backend/src/llm/client.ts
import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type GenerateTextArgs = {
  system: string;
  user: string;
};

export async function generateText({
  system,
  user,
}: GenerateTextArgs): Promise<string> {
  const response = await client.responses.create({
    model: "gpt-4o-mini", // gutes Preis/Leistungsmodell
    input: [
      {
        role: "system",
        content: system,
      },
      {
        role: "user",
        content: user,
      },
    ],
    temperature: 0.4,
  });

  console.log("response.usage: ", response.usage);

  if (!response.output_text) {
    throw new Error("No output_text returned from OpenAI.");
  }

  return response.output_text.trim();
}
