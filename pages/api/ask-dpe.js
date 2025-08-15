export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { question, conversationHistory } = req.body;
  // TODO: integrate OpenAI chat to simulate DPE
  const answer = 'This is a placeholder response from the DPE.';
  res.status(200).json({ answer });
}
