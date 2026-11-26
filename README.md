# AI Guru (Lite) – photo → topic → video / easy notes

Class 7 Science, Chapter 12 "Earth, Moon, and the Sun" (NCERT Curiosity). Hindi + English.

1. A child photographs a textbook page.
2. Gemini (one call, server side) detects which topic of Chapter 12 it is.
3. Two options: **▶ video** (animated scenes + narration + subtitles) or **📝 easy notes**.

The lesson content (scripts, notes, examples) is prepared in `lib/content.json` and checked against the
textbook, so explanations are always the same and accurate. AI is used only for topic detection.

## Run locally
```
npm install
# .env.local (never commit it):  GEMINI_API_KEY=your_key
npm run dev        # http://localhost:3000
```

## Narration voices (recommended, once, on your laptop)
```
pip install edge-tts
python scripts/make_audio.py
```
This creates `public/audio/**.mp3` + `manifest.json` (96 clips). Commit them. Without them the player uses
the phone's own voice, and if none, plays silently with subtitles.

## Deploy (Vercel)
Push to GitHub → Vercel builds automatically. Keep `GEMINI_API_KEY` in Vercel → Settings → Environment Variables.

## Files
- `lib/content.json` – all 8 topics: scenes (video script), notes, textbook term, example
- `components/Scenes.tsx` – 21 animated SVG science scenes
- `components/VideoPlayer.tsx` – scene player (MP3 → browser voice → timer)
- `components/TopicView.tsx` – video / notes page
- `components/Home.tsx` – photo upload, detection result, topic picker
- `app/api/detect/route.ts` – Gemini topic detection
