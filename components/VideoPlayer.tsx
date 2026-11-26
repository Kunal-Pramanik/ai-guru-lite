"use client";

import { useEffect, useRef, useState } from "react";
import type { Lang, Topic } from "@/lib/content";
import { pickVoice, ui } from "@/lib/ui";
import { SceneVisual } from "./Scenes";

/*
 * "Video" player: animated scenes + narration + subtitles.
 * Narration priority: recorded MP3 (public/audio, made by scripts/make_audio.py)
 *   → browser voice (speechSynthesis) → silent timer.
 */

/** Split a scene's text into sentences (for synced subtitles). */
export const splitSentences = (text: string) => text.split(/(?<=[.!?।])\s+/).filter(Boolean);

/** Which sentence is being spoken, given how far (0–1) the audio has played. Longer sentences take longer. */
function sentenceAt(parts: string[], f: number) {
  const total = parts.reduce((n, p) => n + p.length, 0) || 1;
  let acc = 0;
  for (let i = 0; i < parts.length; i++) {
    acc += parts[i].length / total;
    if (f < acc) return i;
  }
  return parts.length - 1;
}

let manifestPromise: Promise<Set<string>> | null = null;
function loadManifest(): Promise<Set<string>> {
  if (!manifestPromise)
    manifestPromise = fetch("/audio/manifest.json")
      .then((r) => (r.ok ? r.json() : { files: [] }))
      .then((j: { files?: string[] }) => new Set(j.files ?? []))
      .catch(() => new Set<string>());
  return manifestPromise;
}

export function VideoPlayer({ topic, lang, onDone }: { topic: Topic; lang: Lang; onDone?: () => void }) {
  const t = ui(lang);
  const scenes = topic.scenes;
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [sent, setSent] = useState(0); // sentence being spoken now
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const runRef = useRef(0);
  const manifest = useRef<Set<string>>(new Set());

  useEffect(() => {
    loadManifest().then((m) => (manifest.current = m));
    // load browser voices early (Chrome loads them async)
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.getVoices();
  }, []);

  // stop everything when the player unmounts
  useEffect(() => {
    const r = runRef;
    const tm = timerRef;
    const au = audioRef;
    return () => {
      r.current++;
      if (tm.current) clearTimeout(tm.current);
      au.current?.pause();
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  function stopAll() {
    runRef.current++;
    if (timerRef.current) clearTimeout(timerRef.current);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  }

  function speakFallback(text: string, run: number, next: () => void) {
    if (run !== runRef.current) return;
    const voice = pickVoice(lang);
    if (voice && "speechSynthesis" in window) {
      // speak sentence by sentence (long utterances get cut in Chrome)
      const parts = splitSentences(text);
      let k = 0;
      const say = () => {
        if (run !== runRef.current) return;
        if (k >= parts.length) return next();
        setSent(k);
        const u = new SpeechSynthesisUtterance(parts[k++]);
        u.voice = voice;
        u.lang = voice.lang;
        u.rate = 0.9;
        u.onend = say;
        u.onerror = say;
        window.speechSynthesis.speak(u);
      };
      say();
    } else {
      // no voice at all: move the subtitle highlight sentence by sentence on a timer
      const parts = splitSentences(text);
      let k = 0;
      const tick = () => {
        if (run !== runRef.current) return;
        if (k >= parts.length) return next();
        setSent(k);
        timerRef.current = setTimeout(tick, Math.max(1800, parts[k++].length * 75));
      };
      tick();
    }
  }

  function playScene(i: number) {
    stopAll();
    const run = runRef.current;
    setIdx(i);
    setSent(0);
    setFinished(false);
    setPlaying(true);
    const text = scenes[i][lang];
    const next = () => {
      if (run !== runRef.current) return;
      if (i + 1 < scenes.length) {
        timerRef.current = setTimeout(() => run === runRef.current && playScene(i + 1), 700);
      } else {
        setPlaying(false);
        setFinished(true);
        onDone?.();
      }
    };
    const key = `${topic.id}/${lang}/${i}`;
    if (manifest.current.has(key)) {
      const a = new Audio(`/audio/${key}.mp3`);
      audioRef.current = a;
      const parts = splitSentences(text);
      a.ontimeupdate = () => {
        if (run === runRef.current && a.duration) setSent(sentenceAt(parts, a.currentTime / a.duration));
      };
      a.onended = next;
      a.onerror = () => speakFallback(text, run, next);
      a.play().catch(() => speakFallback(text, run, next));
      return;
    }
    speakFallback(text, run, next);
  }

  const start = () => {
    setStarted(true);
    playScene(finished ? 0 : idx);
  };
  const pause = () => {
    stopAll();
    setPlaying(false);
  };
  const go = (i: number) => {
    const n = Math.max(0, Math.min(scenes.length - 1, i));
    setStarted(true);
    playScene(n);
  };

  const scene = scenes[idx];
  return (
    <div className="overflow-hidden rounded-[1.6rem] bg-ink shadow-2xl">
      <div className="relative aspect-video w-full bg-[#140f33]">
        <div key={`${idx}-${lang}`} className="anim-in absolute inset-0">
          <SceneVisual v={scene.v} lang={lang} who={scene.who} emoji={topic.emoji} />
        </div>
        {!started && (
          <button onClick={start} className="absolute inset-0 grid place-items-center bg-ink/45" aria-label={t.play}>
            <span className="flex flex-col items-center gap-2">
              <span className="anim-pop grid h-24 w-24 place-items-center rounded-full bg-sun text-5xl shadow-2xl">▶</span>
              <span className="rounded-full bg-white px-4 py-1 text-lg font-extrabold text-ink">{t.tapToStart}</span>
            </span>
          </button>
        )}
        {finished && (
          <div className="anim-pop absolute inset-0 grid place-items-center bg-ink/55 p-4 text-center">
            <div className="rounded-3xl bg-white px-6 py-4 text-2xl font-extrabold text-ink shadow-2xl">{t.done}</div>
          </div>
        )}
      </div>

      {/* progress segments */}
        <div className="flex gap-1.5 bg-white px-4 pt-3">
          {scenes.map((_, i) => (
            <button key={i} onClick={() => go(i)} className="h-2 flex-1 overflow-hidden rounded-full bg-ink/15" aria-label={`${i + 1}`}>
              <span className={`block h-full rounded-full bg-sun transition-all duration-500 ${i < idx || (i === idx && (playing || finished)) ? "w-full" : "w-0"}`} />
            </button>
          ))}
        </div>
      {/* subtitles */}
      <div className="flex min-h-[7.5rem] items-start gap-3 bg-white px-4 py-4">
        <span className={`mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-full text-2xl ${scene.who === "r" ? "bg-berry/15" : "bg-grape/15"}`}>{scene.who === "r" ? "👧" : "🦉"}</span>
        <div>
          <p className={`text-sm font-extrabold ${scene.who === "r" ? "text-berry" : "text-grape"}`}>{scene.who === "r" ? t.rashmika : t.guru}</p>
          <p key={`${idx}-${lang}`} className="anim-in text-xl font-bold leading-snug sm:text-2xl">
            {splitSentences(scene[lang]).map((s, k) => (
              <span
                key={k}
                className={`rounded-lg transition-colors duration-300 ${
                  !started || finished ? "text-ink" : k === sent ? "bg-sun/60 text-ink" : k < sent ? "text-ink/45" : "text-ink/30"
                }`}
              >
                {s}{" "}
              </span>
            ))}
          </p>
        </div>
      </div>

      {/* controls */}
      <div className="flex items-center justify-center gap-3 bg-white px-4 pb-4">
        <button onClick={() => go(idx - 1)} disabled={idx === 0} className="btn3d h-14 w-14 bg-sky text-2xl disabled:opacity-40" aria-label={t.prev}>
          ⏮
        </button>
        {playing ? (
          <button onClick={pause} className="btn3d h-16 min-w-[9rem] bg-berry px-6 text-xl text-white">
            ⏸ {t.pause}
          </button>
        ) : (
          <button onClick={start} className="btn3d h-16 min-w-[9rem] bg-leaf px-6 text-xl text-white">
            {finished ? `🔁 ${t.replay}` : `▶ ${t.play}`}
          </button>
        )}
        <button onClick={() => go(idx + 1)} disabled={idx >= scenes.length - 1} className="btn3d h-14 w-14 bg-sky text-2xl disabled:opacity-40" aria-label={t.next}>
          ⏭
        </button>
      </div>
    </div>
  );
}
