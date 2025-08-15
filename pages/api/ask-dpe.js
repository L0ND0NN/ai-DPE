import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Draft system prompt. For full ACS mapping, see docs/prompting.
const DPE_SYSTEM_PROMPT = `
You are a FAA Designated Pilot Examiner giving a Private Pilot ASEL oral exam.
Base questions on the FAA Airman Certification Standards. Ask one clear,
scenario-based question at a time. Be professional and concise. If the pilot's
answer shows sufficient understanding, advance to the next topic; if not,
probe with follow-up questions. Do not provide hints unless absolutely
necessary. Keep replies under 120 words. Do not include JSON or meta text.
`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userAnswer, conversation = [] } = req.body || {};

    const messages = [
      { role: "system", content: DPE_SYSTEM_PROMPT },
      ...conversation.map(({ role, content }) => ({ role, content })),
    ];

    if (userAnswer) {
      messages.push({ role: "user", content: userAnswer });
    } else if (conversation.length === 0) {
      messages.push({ role: "user", content: "Begin the oral exam." });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // use gpt-4o or gpt-4o-mini as appropriate
      messages,
      temperature: 0.2,
    });

    const reply = response.choices?.[0]?.message?.content?.trim() || "Let's begin.";
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("DPE error:", err);
    return res.status(500).json({ error: "DPE generation failed" });
  }
}
