# ai-DPE
AI-powered mock oral check ride simulator for private, instrument, and commercial pilots.
- Voice chat (Whisper STT + TTS engine)
- DPE-style dialogue using OpenAI (GPT-4o family)
- ACS-aligned question bank + rubrics
- End-of-session debrief with missed topics + references

## Planned Stack
- **App:** Next.js (React + App Router) + Tailwind
- **APIs:** OpenAI (GPT + Whisper), ElevenLabs/Polly for TTS
- **DB/Auth:** Supabase (Postgres, Auth, Storage)
- **Payments (later):** Stripe
- **Deploy:** Vercel (app) / (optional) Render/Fly.io if needed

## Structure (initial)
```
ai-DPE/
  docs/
    architecture.md
    roadmap.md
    prompting/
      dpe-system-prompt.md
      grading-schema.md
  data/
    acs/ (ACS excerpts/notes, links, mappings — no copyrighted dumps)
    seeds/
  .gitignore
  LICENSE
  README.md
```

## Roadmap (Short)
- [ ] Step 1: Repo scaffolding (you are here)
- [ ] Step 2: Next.js app scaffold + Tailwind
- [ ] Step 3: Simple “press to talk” demo (record → Whisper → GPT → TTS → play)
- [ ] Step 4: DPE persona + grading schema
- [ ] Step 5: Session summary UI
- [ ] Step 6: Supabase auth + progress storage
- [ ] Step 7: Stripe metered billing

## Notes
- Accuracy matters: we’ll anchor content to ACS language and FAA references.
- This repo will not host copyrighted FAA pubs; we’ll store references & mappings.
