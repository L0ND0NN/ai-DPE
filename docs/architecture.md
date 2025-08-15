# Architecture (MVP)

## High Level
Client (Next.js) → API routes for:
1) /api/transcribe → Whisper
2) /api/ask-dpe → GPT (system prompt = DPE persona)
3) /api/tts → TTS provider (stream or URL)

DB (Supabase): users, sessions, turns, rubric_scores

## Flow (turn-based MVP)
1. User holds mic → we record WebM/PCM
2. POST audio → /api/transcribe (Whisper)
3. Ask GPT with system prompt (DPE persona + rubric hooks)
4. GPT returns next question or feedback
5. TTS synthesizes the GPT reply → play audio
6. Repeat until “end session,” then /api/debrief compiles scores + notes
