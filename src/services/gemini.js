// Minimal Gemini service wrapper
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || window?.__GEMINI_API_KEY__;
let client;

function getClient() {
  if (!client) {
    if (!apiKey) {
      throw new Error("Missing VITE_GEMINI_API_KEY environment variable");
    }
    client = new GoogleGenerativeAI(apiKey);
  }
  return client;
}

export async function generateText({ prompt, model = "gemini-1.5-flash", generationConfig } = {}) {
  const genAI = getClient();
  const m = genAI.getGenerativeModel({ model, generationConfig: { temperature: 0.6, maxOutputTokens: 1024, ...generationConfig } });
  const res = await m.generateContent([{ text: prompt }]);
  return res.response.text();
}

export async function chatStream({ system, messages = [], model = "gemini-1.5-flash", generationConfig } = {}) {
  const genAI = getClient();
  const m = genAI.getGenerativeModel({ model, systemInstruction: system, generationConfig: { temperature: 0.5, maxOutputTokens: 768, ...generationConfig } });
  return m.startChat({ history: messages });
}

export async function generateJSON({ schema, prompt, model = "gemini-1.5-flash" }) {
  const genAI = getClient();
  const m = genAI.getGenerativeModel({ model });
  const res = await m.generateContent([
    { text: `${prompt}\nReturn strict JSON matching this schema: ${JSON.stringify(schema)}` },
  ]);
  const text = res.response.text();
  try {
    return JSON.parse(text);
  } catch (_) {
    return { error: "Invalid JSON from model", raw: text };
  }
}


