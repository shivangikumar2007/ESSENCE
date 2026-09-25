import "dotenv/config";
import express from "express";
import { InferenceClient } from "@huggingface/inference";

const app = express();
const port = Number(process.env.API_PORT ?? 3001);
const model = process.env.HF_MODEL ?? "Qwen/Qwen2.5-7B-Instruct";

app.use(express.json({ limit: "32kb" }));

app.post("/api/chat", async (req, res) => {
  const token = process.env.HF_TOKEN;
  if (!token) {
    return res.status(503).json({ error: "Add your Hugging Face token to the local .env file." });
  }

  if (!Array.isArray(req.body?.messages)) {
    return res.status(400).json({ error: "A conversation is required." });
  }

  const messages = req.body.messages
    .slice(-12)
    .filter(
      (message) =>
        (message?.role === "user" || message?.role === "assistant") &&
        typeof message.content === "string" &&
        message.content.trim().length > 0 &&
        message.content.length <= 3000,
    )
    .map(({ role, content }) => ({ role, content: content.trim() }));

  if (!messages.length || messages.at(-1)?.role !== "user") {
    return res.status(400).json({ error: "Send a message to continue the conversation." });
  }

  try {
    const client = new InferenceClient(token);
    const result = await client.chatCompletion({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are ESSENCE, a warm and thoughtful conversation companion. Respond to the specific details the user shared, with empathy and concise, natural language. Ask at most one gentle follow-up question. Do not diagnose or claim to be a therapist. For immediate danger or self-harm, encourage contacting local emergency services or a trusted person right away.",
        },
        ...messages,
      ],
      max_tokens: 220,
      temperature: 0.7,
    });

    const reply = result.choices?.[0]?.message?.content;
    if (typeof reply !== "string" || !reply.trim()) {
      return res.status(502).json({ error: "The chat service returned an empty reply. Please try again." });
    }

    return res.json({ reply: reply.trim() });
  } catch (error) {
    console.error("Chat request failed:", error);
    return res.status(502).json({ error: "I couldn’t reach the chat service. Please try again." });
  }
});

app.listen(port, () => {
  console.log(`ESSENCE chat API listening on http://localhost:${port}`);
});