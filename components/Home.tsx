"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CHAPTER, TOPICS, isLang, topicById, type Lang } from "@/lib/content";
import { ui } from "@/lib/ui";
import { LangToggle, Logo, OwlIcon } from "./Chrome";
import { Welcome, welcomeText, type Profile } from "./Welcome";

type Result = { isThisChapter: boolean; topicId: string | null; confidence: number };

/** Shrink a phone photo to ≤1600px JPEG (~300–600 KB) before upload. */
async function compress(file: File): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = url;
    });
    const scale = Math.min(1, 1600 / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement("canvas");
    c.width = Math.round(img.naturalWidth * scale);
    c.height = Math.round(img.naturalHeight * scale);
    c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL("image/jpeg", 0.82);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function Home({ initialLang }: { initialLang: Lang | null }) {
  const [lang, setLang] = useState<Lang>(initialLang ?? "hi");
  const [photo, setPhoto] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState(false);
  const camRef = useRef<HTMLInputElement>(null);
  const galRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ready, setReady] = useState(false);
  const t = ui(lang);
  const w = welcomeText(lang);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("aiGuruLang");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restore saved language/profile once
      if (!initialLang && isLang(saved)) setLang(saved);
      const p = JSON.parse(localStorage.getItem("aiGuruProfile") || "null");
      if (p && typeof p.name === "string" && p.cls === 7) setProfile(p);
    } catch {}
    setReady(true);
  }, [initialLang]);

  const saveProfile = (p: Profile | null) => {
    setProfile(p);
    try {
      if (p) localStorage.setItem("aiGuruProfile", JSON.stringify(p));
      else localStorage.removeItem("aiGuruProfile");
    } catch {}
  };

  const changeLang = (l: Lang) => {
    setLang(l);
    try {
      localStorage.setItem("aiGuruLang", l);
    } catch {}
  };

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    setError(false);
    setResult(null);
    setBusy(true);
    try {
      const data = await compress(f);
      setPhoto(data);
      const res = await fetch("/api/detect", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ image: data }) });
      const j = await res.json().catch(() => ({}));
      if (!res.ok || !j.topicId) throw new Error(j.error || "failed");
      setResult(j);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  };

  const topic = result?.topicId ? topicById(result.topicId) : null;

  if (!ready)
    return (
      <main className="grid min-h-[100dvh] place-items-center">
        <div className="anim-floaty">
          <OwlIcon size={110} />
        </div>
      </main>
    );
  if (!profile) return <Welcome lang={lang} onLang={changeLang} onDone={saveProfile} />;

  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-16 pt-3">
      <header className="mb-4 flex items-center justify-between gap-2">
        <Logo lang={lang} />
        <LangToggle lang={lang} onChange={changeLang} />
      </header>

      {/* Greeting */}
      <div className="mb-4 flex items-center justify-between gap-2 rounded-3xl bg-white/80 px-4 py-3 shadow">
        <p className="text-xl font-extrabold">
          {w.hi}, <span className="text-berry">{profile.name}</span>! 👋
          <span className="block text-base font-bold text-ink/60">
            {t.classN} {profile.cls} · {w.science}
          </span>
        </p>
        <button onClick={() => saveProfile(null)} className="shrink-0 rounded-full bg-lav px-3 py-2 text-base font-bold text-grape">
          ✏️ {w.change}
        </button>
      </div>

      {/* Hero / upload */}
      {!busy && !result && (
        <section className="card anim-in flex flex-col items-center gap-4 p-6 text-center">
          <div className="anim-floaty">
            <OwlIcon size={110} />
          </div>
          <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">{t.heroTitle}</h1>
          <p className="text-xl font-semibold text-ink/70">{t.heroSub}</p>
          <button onClick={() => camRef.current?.click()} className="btn3d w-full bg-berry py-5 text-2xl text-white">
            📷 {t.camera}
          </button>
          <button onClick={() => galRef.current?.click()} className="btn3d w-full bg-white py-3 text-xl text-ink">
            🖼️ {t.gallery}
          </button>
          <input ref={camRef} type="file" accept="image/*" capture="environment" hidden onChange={(e) => (onFile(e.target.files?.[0]), (e.target.value = ""))} />
          <input ref={galRef} type="file" accept="image/*" hidden onChange={(e) => (onFile(e.target.files?.[0]), (e.target.value = ""))} />
          {error && (
            <p className="anim-shake w-full rounded-2xl bg-berry/10 p-3 text-lg font-bold text-berry" role="alert">
              🙈 {t.error}
            </p>
          )}
        </section>
      )}

      {/* Reading */}
      {busy && (
        <section className="card anim-in flex flex-col items-center gap-4 p-6 text-center">
          {photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photo} alt="" className="max-h-56 rounded-2xl object-contain shadow" />
          )}
          <div className="anim-floaty">
            <OwlIcon size={90} />
          </div>
          <p className="text-2xl font-extrabold">{t.reading}</p>
          <p className="text-lg font-bold text-grape">{t.readingSub}</p>
          <div className="h-4 w-64 overflow-hidden rounded-full bg-lav">
            <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-leaf via-sun to-berry" style={{ animation: "slideBar 1.2s ease-in-out infinite" }} />
          </div>
        </section>
      )}

      {/* Result */}
      {result && topic && (
        <section className="card anim-pop flex flex-col gap-4 p-5">
          <div className="flex items-center gap-4">
            {photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt="" className="h-24 w-20 shrink-0 rounded-xl object-cover shadow" />
            )}
            <div>
              <p className="text-lg font-bold text-leaf">✅ {t.found}</p>
              <p className="text-base font-bold text-ink/60">
                {t.classN} {CHAPTER.class} · {t.chapter} {CHAPTER.number} · {t.section} {topic.section}
              </p>
              <h2 className="text-2xl font-extrabold leading-tight sm:text-3xl">
                {topic.emoji} {topic.title[lang]}
              </h2>
            </div>
          </div>
          {!result.isThisChapter && <p className="rounded-2xl bg-sun/30 p-3 text-lg font-bold">⚠️ {t.notChapter}</p>}
          {result.isThisChapter && result.confidence < 0.5 && <p className="rounded-2xl bg-sun/30 p-3 text-lg font-bold">🤔 {t.unsure}</p>}
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href={`/t/${topic.id}?view=video&lang=${lang}`} className="btn3d flex flex-col items-center bg-berry px-4 py-5 text-white">
              <span className="text-4xl">▶️</span>
              <span className="text-2xl">{t.video}</span>
              <span className="text-base font-semibold opacity-90">{t.videoSub}</span>
            </Link>
            <Link href={`/t/${topic.id}?view=notes&lang=${lang}`} className="btn3d flex flex-col items-center bg-leaf px-4 py-5 text-white">
              <span className="text-4xl">📝</span>
              <span className="text-2xl">{t.notes}</span>
              <span className="text-base font-semibold opacity-90">{t.notesSub}</span>
            </Link>
          </div>
          <button
            onClick={() => {
              setResult(null);
              setPhoto(null);
            }}
            className="text-lg font-bold text-grape underline"
          >
            📷 {t.another}
          </button>
        </section>
      )}

      {/* Topic picker (also the fallback) */}
      <section className="mt-6">
        <h3 className="mb-1 text-xl font-extrabold">{result ? t.wrongTopic : t.orPick}</h3>
        <p className="mb-3 text-base font-bold text-ink/60">
          {t.classN} {CHAPTER.class} · {t.chapter} {CHAPTER.number}: {CHAPTER.title[lang]}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {TOPICS.map((tp) => (
            <Link key={tp.id} href={`/t/${tp.id}?view=video&lang=${lang}`} className="card flex items-center gap-3 p-3 transition hover:-translate-y-1">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-lav text-3xl">{tp.emoji}</span>
              <span>
                <span className="block text-lg font-extrabold leading-tight">{tp.title[lang]}</span>
                <span className="text-sm font-bold text-ink/50">
                  {t.section} {tp.section} · {t.pages} {tp.pages}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
