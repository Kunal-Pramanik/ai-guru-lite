"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CHAPTER, type Lang, type Topic } from "@/lib/content";
import { pickVoice, ui } from "@/lib/ui";
import { SceneVisual } from "./Scenes";
import { VideoPlayer } from "./VideoPlayer";
import { LangToggle, Logo } from "./Chrome";

export function TopicView({ topic, initialLang, initialView }: { topic: Topic; initialLang: Lang; initialView: "video" | "notes" }) {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>(initialLang);
  const [view, setView] = useState<"video" | "notes">(initialView);
  const t = ui(lang);

  const update = (l: Lang, v: "video" | "notes") => {
    setLang(l);
    setView(v);
    try {
      localStorage.setItem("aiGuruLang", l);
    } catch {}
    router.replace(`/t/${topic.id}?view=${v}&lang=${l}`, { scroll: false });
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-16 pt-3">
      <header className="mb-3 flex items-center justify-between gap-2">
        <Link href={`/?lang=${lang}`} className="flex items-center gap-2" aria-label={t.home}>
          <Logo lang={lang} />
        </Link>
        <LangToggle lang={lang} onChange={(l) => update(l, view)} />
      </header>

      <div className="mb-4">
        <p className="text-base font-bold text-ink/60">
          {t.classN} {CHAPTER.class} · {t.chapter} {CHAPTER.number}: {CHAPTER.title[lang]} · {t.section} {topic.section}
        </p>
        <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">
          {topic.emoji} {topic.title[lang]}
        </h1>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <button onClick={() => update(lang, "video")} className={`btn3d text-xl ${view === "video" ? "bg-berry text-white" : "bg-white text-ink"}`}>
          ▶ {t.videoTab}
        </button>
        <button onClick={() => update(lang, "notes")} className={`btn3d text-xl ${view === "notes" ? "bg-leaf text-white" : "bg-white text-ink"}`}>
          📝 {t.notes}
        </button>
      </div>

      {view === "video" ? (
        <div className="anim-in flex flex-col gap-4">
          <VideoPlayer key={lang} topic={topic} lang={lang} />
          <button onClick={() => update(lang, "notes")} className="btn3d bg-leaf py-4 text-xl text-white">
            📝 {t.seeNotes}
          </button>
        </div>
      ) : (
        <Notes topic={topic} lang={lang} onVideo={() => update(lang, "video")} />
      )}

      <Link href={`/?lang=${lang}`} className="btn3d mt-6 flex items-center justify-center bg-grape py-4 text-xl text-white">
        📷 {t.another}
      </Link>
    </main>
  );
}

function Notes({ topic, lang, onVideo }: { topic: Topic; lang: Lang; onVideo: () => void }) {
  const t = ui(lang);
  const [reading, setReading] = useState<number | "all" | null>(null);
  const run = useRef(0);
  const notes = topic.notes[lang];

  useEffect(() => {
    const r = run;
    return () => {
      r.current++;
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  const speak = (items: string[], key: number | "all") => {
    if (!("speechSynthesis" in window)) return;
    const my = ++run.current;
    window.speechSynthesis.cancel();
    if (reading === key) {
      setReading(null);
      return;
    }
    const voice = pickVoice(lang);
    setReading(key);
    let k = 0;
    const next = () => {
      if (my !== run.current) return;
      if (k >= items.length) return setReading(null);
      const u = new SpeechSynthesisUtterance(items[k++].replace(/\*\*/g, ""));
      if (voice) u.voice = voice;
      u.lang = voice?.lang ?? `${lang}-IN`;
      u.rate = 0.9;
      u.onend = next;
      u.onerror = next;
      window.speechSynthesis.speak(u);
    };
    next();
  };

  const colors = ["border-ocean bg-ocean/10", "border-berry bg-berry/10", "border-leaf bg-leaf/10", "border-tang bg-tang/10", "border-grape bg-grape/10", "border-sun bg-sun/15"];
  const dots = ["bg-ocean", "bg-berry", "bg-leaf", "bg-tang", "bg-grape", "bg-sun"];

  return (
    <div className="anim-in flex flex-col gap-4">
      <div className="card overflow-hidden">
        <div className="aspect-video w-full">
          <SceneVisual v={topic.diagram} lang={lang} />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="rounded-2xl bg-sun/30 px-4 py-2">
          <span className="text-sm font-bold text-ink/70">📖 {t.term}: </span>
          <span className="text-xl font-extrabold">
            {topic.term[lang]} ({lang === "en" ? topic.term.hi : topic.term.en})
          </span>
        </div>
        <button onClick={() => speak(notes, "all")} className={`btn3d shrink-0 px-4 text-lg ${reading === "all" ? "bg-berry text-white" : "bg-sun text-ink"}`}>
          {reading === "all" ? `⏹ ${t.stop}` : `🔊 ${t.readAloud}`}
        </button>
      </div>

      <ol className="flex flex-col gap-3">
        {notes.map((n, i) => (
          <li key={i} className={`flex items-center gap-3 rounded-3xl border-l-8 p-4 text-xl font-semibold leading-snug ${colors[i % 6]}`}>
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-lg font-extrabold text-white ${dots[i % 6]}`}>{i + 1}</span>
            <span className="flex-1">
              {n.split(/(\*\*[^*]+\*\*)/g).map((p, k) =>
                p.startsWith("**") ? (
                  <mark key={k} className="rounded-lg bg-sun/70 px-1 font-extrabold text-ink">
                    {p.slice(2, -2)}
                  </mark>
                ) : (
                  <span key={k}>{p}</span>
                ),
              )}
            </span>
            <button onClick={() => speak([n], i)} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-xl shadow" aria-label={t.readAloud}>
              {reading === i ? "⏹" : "🔊"}
            </button>
          </li>
        ))}
      </ol>

      <div className="rounded-3xl bg-grape/10 p-4">
        <p className="text-base font-extrabold text-grape">💡 {t.example}</p>
        <p className="mt-1 text-xl font-semibold">{topic.example[lang]}</p>
      </div>

      <button onClick={onVideo} className="btn3d bg-berry py-4 text-xl text-white">
        ▶ {t.seeVideo}
      </button>
    </div>
  );
}
