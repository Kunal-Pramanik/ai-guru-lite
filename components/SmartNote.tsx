"use client";

import { useEffect, useRef, useState } from "react";
import { CHAPTER, type Lang, type Topic } from "@/lib/content";
import smart from "@/lib/smart.json";
import { pickVoice, ui } from "@/lib/ui";
import { SceneVisual } from "./Scenes";
import { OwlIcon } from "./Chrome";

type SmartTopic = { flow: string[]; words: [string, string][]; mistake: { wrong: string; right: string } };
const S = smart as unknown as { labels: Record<Lang, Record<string, string>>; topics: Record<string, Record<Lang, SmartTopic>> };

const COLORS = ["border-ocean bg-ocean/10", "border-berry bg-berry/10", "border-leaf bg-leaf/10", "border-tang bg-tang/10", "border-grape bg-grape/10", "border-sun bg-sun/15"];
const DOTS = ["bg-ocean", "bg-berry", "bg-leaf", "bg-tang", "bg-grape", "bg-sun"];
const FLOW = ["bg-ocean", "bg-grape", "bg-berry", "bg-tang", "bg-leaf"];

function Bold({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((p, k) =>
        p.startsWith("**") ? (
          <mark key={k} className="rounded-lg bg-sun/70 px-1 font-extrabold text-ink">
            {p.slice(2, -2)}
          </mark>
        ) : (
          <span key={k}>{p}</span>
        ),
      )}
    </>
  );
}

export function SmartNote({ topic, lang, onVideo }: { topic: Topic; lang: Lang; onVideo: () => void }) {
  const t = ui(lang);
  const L = S.labels[lang];
  const sm = S.topics[topic.id]?.[lang] ?? S.topics[topic.id]?.en;
  const notes = topic.notes[lang];
  const [reading, setReading] = useState<number | "all" | null>(null);
  const [name, setName] = useState("");
  const run = useRef(0);

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem("aiGuruProfile") || "null");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- read saved name once
      if (p?.name) setName(p.name);
    } catch {}
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

  // "Download PDF": the browser's print dialog → "Save as PDF" (works on Android, iPhone and laptops)
  const download = () => {
    const old = document.title;
    document.title = `AI-Guru_${topic.id}_${lang}`;
    const restore = () => {
      document.title = old;
      window.removeEventListener("afterprint", restore);
    };
    window.addEventListener("afterprint", restore);
    window.print();
    setTimeout(restore, 3000);
  };

  return (
    <div className="anim-in flex flex-col gap-4">
      {/* action bar (not printed) */}
      <div className="no-print grid grid-cols-2 gap-3">
        <button onClick={download} className="btn3d bg-grape py-3 text-lg text-white">
          ⬇ {L.download}
        </button>
        <button onClick={() => speak(notes, "all")} className={`btn3d py-3 text-lg ${reading === "all" ? "bg-berry text-white" : "bg-sun text-ink"}`}>
          {reading === "all" ? `⏹ ${t.stop}` : `🔊 ${t.readAloud}`}
        </button>
      </div>

      {/* ===== the printable smart note ===== */}
      <article id="smart-note" className="flex flex-col gap-4 rounded-[1.6rem] bg-white p-4 shadow-xl sm:p-6">
        <header className="flex items-center gap-3 border-b-4 border-dashed border-grape/20 pb-3">
          <OwlIcon size={52} />
          <div className="flex-1">
            <p className="text-sm font-extrabold uppercase tracking-wide text-grape">
              📝 {L.card} · {t.classN} {CHAPTER.class} · {t.chapter} {CHAPTER.number} · {t.section} {topic.section}
            </p>
            <h2 className="text-2xl font-extrabold leading-tight sm:text-3xl">
              {topic.emoji} {topic.title[lang]}
            </h2>
            {name && (
              <p className="text-base font-bold text-ink/60">
                {L.name}: {name}
              </p>
            )}
          </div>
        </header>

        <div className="print-avoid overflow-hidden rounded-2xl">
          <div className="aspect-video w-full">
            <SceneVisual v={topic.diagram} lang={lang} />
          </div>
        </div>

        <div className="print-avoid rounded-2xl bg-sun/30 px-4 py-2">
          <span className="text-sm font-bold text-ink/70">📖 {t.term}: </span>
          <span className="text-xl font-extrabold">
            {topic.term[lang]} ({lang === "en" ? topic.term.hi : topic.term.en})
          </span>
        </div>

        {/* easy points */}
        <section>
          <h3 className="mb-2 text-xl font-extrabold">✅ {L.points}</h3>
          <ol className="flex flex-col gap-2.5">
            {notes.map((n, i) => (
              <li key={i} className={`print-avoid flex items-center gap-3 rounded-2xl border-l-8 p-3 text-lg font-semibold leading-snug sm:text-xl ${COLORS[i % 6]}`}>
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-base font-extrabold text-white ${DOTS[i % 6]}`}>{i + 1}</span>
                <span className="flex-1">
                  <Bold text={n} />
                </span>
                <button onClick={() => speak([n], i)} className="no-print grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-lg shadow" aria-label={t.readAloud}>
                  {reading === i ? "⏹" : "🔊"}
                </button>
              </li>
            ))}
          </ol>
        </section>

        {sm && (
          <>
            {/* flowchart, drawn by code */}
            <section className="print-avoid">
              <h3 className="mb-2 text-xl font-extrabold">🔄 {L.flow}</h3>
              <div className="flex flex-col items-center">
                {sm.flow.map((step, i) => (
                  <div key={i} className="flex w-full flex-col items-center">
                    <div className={`flex w-full max-w-md items-center gap-3 rounded-2xl px-4 py-3 text-white shadow-md ${FLOW[i % 5]}`}>
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/90 text-base font-extrabold text-ink">{i + 1}</span>
                      <span className="text-lg font-bold leading-snug">{step}</span>
                    </div>
                    {i < sm.flow.length - 1 && (
                      <svg width="28" height="30" viewBox="0 0 28 30" aria-hidden className="my-0.5">
                        <path d="M14 2 V22" stroke="#2b2350" strokeWidth="4" strokeLinecap="round" />
                        <path d="M5 16 L14 27 L23 16" fill="none" stroke="#2b2350" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* key words */}
            <section className="print-avoid">
              <h3 className="mb-2 text-xl font-extrabold">🔑 {L.words}</h3>
              <div className="grid gap-2.5 sm:grid-cols-3">
                {sm.words.map(([w, m], i) => (
                  <div key={i} className="rounded-2xl border-2 border-grape/25 bg-lav p-3">
                    <p className="text-xl font-extrabold text-grape">{w}</p>
                    <p className="text-base font-semibold leading-snug text-ink/80">{m}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* common mistake */}
            <section className="print-avoid rounded-2xl border-4 border-berry/30 bg-berry/5 p-4">
              <h3 className="mb-2 text-xl font-extrabold text-berry">⚠️ {L.mistake}</h3>
              <p className="text-lg font-semibold">
                <span className="mr-2 rounded-lg bg-berry px-2 py-0.5 text-sm font-extrabold text-white">❌ {L.wrong}</span>
                <span className="text-ink/70 line-through decoration-berry/60">{sm.mistake.wrong}</span>
              </p>
              <p className="mt-2 text-lg font-bold">
                <span className="mr-2 rounded-lg bg-leaf px-2 py-0.5 text-sm font-extrabold text-white">✅ {L.right}</span>
                {sm.mistake.right}
              </p>
            </section>
          </>
        )}

        <section className="print-avoid rounded-2xl bg-grape/10 p-4">
          <p className="text-base font-extrabold text-grape">💡 {t.example}</p>
          <p className="mt-1 text-lg font-semibold">{topic.example[lang]}</p>
        </section>

        <footer className="border-t-2 border-dashed border-ink/10 pt-2 text-center text-sm font-bold text-ink/50">
          AI Guru · {CHAPTER.book} · {t.classN} {CHAPTER.class} · {t.pages} {topic.pages}
        </footer>
      </article>

      <button onClick={onVideo} className="no-print btn3d bg-berry py-4 text-xl text-white">
        ▶ {t.seeVideo}
      </button>
    </div>
  );
}
