"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CHAPTER, type Lang, type Topic } from "@/lib/content";
import { ui } from "@/lib/ui";
import { VideoPlayer } from "./VideoPlayer";
import { SmartNote } from "./SmartNote";
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
        <SmartNote topic={topic} lang={lang} onVideo={() => update(lang, "video")} />
      )}

      <Link href={`/?lang=${lang}`} className="no-print btn3d mt-6 flex items-center justify-center bg-grape py-4 text-xl text-white">
        📷 {t.another}
      </Link>
    </main>
  );
}