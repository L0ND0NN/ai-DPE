import OpenAI from "openai";
import fs from "fs";
import os from "os";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * POST /api/transcribe
 * Receives base64-encoded audio and returns the Whisper transcription.
 * Expected JSON body: { audioBase64: string, mime?: string }
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { audioBase64, mime = "audio/webm" } = req.body || {};
    if (!audioBase64) {
      return res.status(400).json({ error: "Missing audioBase64" });
    }

    // Decode base64 and write to a temporary file for Whisper
    const buffer = Buffer.from(audioBase64, "base64");
    const tmpPath = path.join(os.tmpdir(), `upload-${Date.now()}.webm`);
    fs.writeFileSync(tmpPath, buffer);

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tmpPath),
      model: "whisper-1",
      // you can hint language with the `language` property (e.g. 'en')
    });

    // Cleanup temp file
    try {
      fs.unlinkSync(tmpPath);
    } catch (err) {
      console.warn("Could not delete temp file", err);
    }

    return res.status(200).json({ transcript: transcription.text || "" });
  } catch (err) {
    console.error("Transcription error:", err);
    return res.status(500).json({ error: "Transcription failed" });
  }
}
