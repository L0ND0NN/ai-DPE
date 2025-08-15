export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { text } = req.body;
  // TODO: integrate TTS provider like ElevenLabs or Amazon Polly
  const audioUrl = 'https://example.com/audio-placeholder.mp3';
  res.status(200).json({ audioUrl });
}
