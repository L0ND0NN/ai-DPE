// pages/api/tts.js
// This route synthesizes speech using ElevenLabs. To change providers,
// adjust the environment variables and request logic accordingly.

export const config = { api: { responseLimit: false } };

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { text } = req.body || {};
    if (!text) {
      return res.status(400).json({ error: "Missing text" });
    }

    // For now we only support ElevenLabs
    const provider = process.env.TTS_API_PROVIDER;
    if (provider !== "elevenlabs") {
      return res.status(400).json({ error: "Unsupported TTS provider" });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = process.env.ELEVENLABS_VOICE_ID;
    if (!apiKey || !voiceId) {
      return res.status(400).json({ error: "Missing ElevenLabs API key or voice ID" });
    }

    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?optimize_streaming_latency=0&output_format=mp3_44100_128`;

    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        voice_settings: {
          stability: 0.4,
          similarity_boost: 0.8,
        },
      }),
    });

    if (!resp.ok) {
      const message = await resp.text();
      console.error("ElevenLabs error:", message);
      return res.status(500).json({ error: "TTS provider error" });
    }

    const buffer = Buffer.from(await resp.arrayBuffer());
    const base64Audio = buffer.toString("base64");
    return res.status(200).json({ audioBase64: base64Audio, mime: "audio/mpeg" });
  } catch (err) {
    console.error("TTS error:", err);
    return res.status(500).json({ error: "TTS failed" });
  }
}
