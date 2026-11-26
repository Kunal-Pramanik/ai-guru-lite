"use client";

import { useState } from "react";
import { LANGS, LANG_NAMES, type Lang } from "@/lib/content";
import { OwlIcon } from "./Chrome";

export type Profile = { name: string; cls: number };

// Welcome-flow text in all 5 languages
const W: Record<Lang, Record<string, string>> = {
  hi: {
    hello: "नमस्ते! 🙏",
    iam: "मैं AI गुरु हूँ। किताब का जो पन्ना समझ न आए, उसकी फ़ोटो दिखाओ, मैं आसान भाषा में समझाऊँगा।",
    pickLang: "अपनी भाषा चुनो",
    start: "चलो शुरू करें",
    askName: "तुम्हारा नाम क्या है?",
    namePh: "अपना नाम लिखो",
    next: "आगे",
    back: "पीछे",
    hi: "नमस्ते",
    askClass: "तुम किस कक्षा में पढ़ते हो?",
    classN: "कक्षा",
    ready: "तैयार",
    soon: "जल्द आएगा",
    soonMsg: "इस कक्षा के पाठ जल्द आएँगे। अभी कक्षा 7 (विज्ञान) तैयार है।",
    privacy: "तुम्हारा नाम सिर्फ़ इसी फ़ोन में रहता है।",
    change: "बदलो",
    science: "विज्ञान",
  },
  en: {
    hello: "Hello! 🙏",
    iam: "I am AI Guru. Show me a photo of any textbook page you don't understand, and I will explain it in simple words.",
    pickLang: "Choose your language",
    start: "Let's start",
    askName: "What is your name?",
    namePh: "Write your name",
    next: "Next",
    back: "Back",
    hi: "Hello",
    askClass: "Which class are you in?",
    classN: "Class",
    ready: "Ready",
    soon: "Coming soon",
    soonMsg: "Lessons for this class are coming soon. Class 7 (Science) is ready now.",
    privacy: "Your name stays only on this phone.",
    change: "Change",
    science: "Science",
  },
  gu: {
    hello: "નમસ્તે! 🙏",
    iam: "હું AI ગુરુ છું. પુસ્તકનું જે પાનું ન સમજાય, તેનો ફોટો બતાવો, હું સરળ ભાષામાં સમજાવીશ.",
    pickLang: "તમારી ભાષા પસંદ કરો",
    start: "ચાલો શરૂ કરીએ",
    askName: "તમારું નામ શું છે?",
    namePh: "તમારું નામ લખો",
    next: "આગળ",
    back: "પાછળ",
    hi: "નમસ્તે",
    askClass: "તમે કયા ધોરણમાં ભણો છો?",
    classN: "ધોરણ",
    ready: "તૈયાર",
    soon: "જલ્દી આવશે",
    soonMsg: "આ ધોરણના પાઠ જલ્દી આવશે. હમણાં ધોરણ 7 (વિજ્ઞાન) તૈયાર છે.",
    privacy: "તમારું નામ ફક્ત આ જ ફોનમાં રહે છે.",
    change: "બદલો",
    science: "વિજ્ઞાન",
  },
  bn: {
    hello: "নমস্কার! 🙏",
    iam: "আমি AI গুরু। বইয়ের যে পাতা বুঝতে পারছ না, তার ছবি দেখাও, আমি সহজ ভাষায় বুঝিয়ে দেব।",
    pickLang: "তোমার ভাষা বাছো",
    start: "চলো শুরু করি",
    askName: "তোমার নাম কী?",
    namePh: "তোমার নাম লেখো",
    next: "পরের",
    back: "আগের",
    hi: "নমস্কার",
    askClass: "তুমি কোন শ্রেণিতে পড়ো?",
    classN: "শ্রেণি",
    ready: "তৈরি",
    soon: "শীঘ্রই আসছে",
    soonMsg: "এই শ্রেণির পাঠ শীঘ্রই আসবে। এখন শ্রেণি 7 (বিজ্ঞান) তৈরি আছে।",
    privacy: "তোমার নাম শুধু এই ফোনেই থাকে।",
    change: "বদলাও",
    science: "বিজ্ঞান",
  },
  mr: {
    hello: "नमस्कार! 🙏",
    iam: "मी AI गुरू आहे. पुस्तकाचं जे पान समजत नाही, त्याचा फोटो दाखवा, मी सोप्या भाषेत समजावेन.",
    pickLang: "तुमची भाषा निवडा",
    start: "चला सुरू करूया",
    askName: "तुमचं नाव काय?",
    namePh: "तुमचं नाव लिहा",
    next: "पुढे",
    back: "मागे",
    hi: "नमस्कार",
    askClass: "तुम्ही कोणत्या इयत्तेत शिकता?",
    classN: "इयत्ता",
    ready: "तयार",
    soon: "लवकरच येईल",
    soonMsg: "या इयत्तेचे धडे लवकरच येतील. सध्या इयत्ता 7 (विज्ञान) तयार आहे.",
    privacy: "तुमचं नाव फक्त याच फोनमध्ये राहतं.",
    change: "बदला",
    science: "विज्ञान",
  },
};

export const welcomeText = (lang: Lang) => W[lang];

const CLASS_COLORS = ["bg-ocean", "bg-berry", "bg-leaf", "bg-tang", "bg-grape", "bg-sun", "bg-berry", "bg-ocean"];

export function Welcome({ lang, onLang, onDone }: { lang: Lang; onLang: (l: Lang) => void; onDone: (p: Profile) => void }) {
  const w = W[lang];
  const [step, setStep] = useState<"welcome" | "name" | "class">("welcome");
  const [name, setName] = useState("");
  const [soonFor, setSoonFor] = useState<number | null>(null);
  const clean = name.trim().slice(0, 20);

  return (
    <main className="mx-auto flex min-h-[100dvh] w-full max-w-xl flex-col px-4 pb-10 pt-6">
      {/* step dots */}
      <div className="mb-6 flex justify-center gap-2">
        {["welcome", "name", "class"].map((s) => (
          <span key={s} className={`h-3 rounded-full transition-all ${s === step ? "w-10 bg-grape" : "w-3 bg-grape/25"}`} />
        ))}
      </div>

      {step === "welcome" && (
        <section key="w" className="card anim-in flex flex-col items-center gap-4 p-6 text-center">
          <div className="anim-floaty">
            <OwlIcon size={140} />
          </div>
          <h1 className="text-4xl font-extrabold text-grape">{w.hello}</h1>
          <p className="text-xl font-semibold text-ink/75">{w.iam}</p>
          <p className="mt-2 text-lg font-extrabold">{w.pickLang}</p>
          <div className="grid w-full grid-cols-2 gap-3">
            {LANGS.map((l) => (
              <button
                key={l}
                onClick={() => onLang(l)}
                className={`btn3d py-3 text-xl ${l === "hi" ? "col-span-2" : ""} ${lang === l ? "bg-grape text-white" : "bg-white text-ink"}`}
              >
                {lang === l ? "✓ " : ""}
                {LANG_NAMES[l]}
              </button>
            ))}
          </div>
          <button onClick={() => setStep("name")} className="btn3d mt-2 w-full bg-berry py-5 text-2xl text-white">
            {w.start} ➜
          </button>
        </section>
      )}

      {step === "name" && (
        <section key="n" className="card anim-in flex flex-col items-center gap-5 p-6 text-center">
          <div className="anim-floaty">
            <OwlIcon size={110} />
          </div>
          <h1 className="text-3xl font-extrabold">{w.askName}</h1>
          <form
            className="flex w-full flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (clean) setStep("class");
            }}
          >
            <input
              autoFocus
              value={name}
              maxLength={20}
              onChange={(e) => setName(e.target.value)}
              placeholder={w.namePh}
              aria-label={w.namePh}
              className="w-full rounded-2xl border-4 border-grape/30 bg-white px-4 py-4 text-center text-2xl font-bold outline-none focus:border-grape"
            />
            {clean && (
              <p className="anim-pop text-2xl font-extrabold text-berry">
                {w.hi}, {clean}! 👋
              </p>
            )}
            <button type="submit" disabled={!clean} className="btn3d w-full bg-berry py-5 text-2xl text-white disabled:opacity-40">
              {w.next} ➜
            </button>
          </form>
          <p className="text-base font-semibold text-ink/50">🔒 {w.privacy}</p>
          <button onClick={() => setStep("welcome")} className="text-lg font-bold text-grape underline">
            ← {w.back}
          </button>
        </section>
      )}

      {step === "class" && (
        <section key="c" className="card anim-in flex flex-col items-center gap-5 p-6 text-center">
          <h1 className="text-3xl font-extrabold">
            {w.hi}, {clean}! 👋
          </h1>
          <p className="text-2xl font-extrabold text-ink/80">{w.askClass}</p>
          <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((c, i) => {
              const ready = c === 7;
              return (
                <button
                  key={c}
                  onClick={() => (ready ? onDone({ name: clean, cls: c }) : setSoonFor(c))}
                  className={`btn3d flex flex-col items-center py-4 ${ready ? `${CLASS_COLORS[i]} text-white ring-4 ring-sun` : "bg-white text-ink/50"}`}
                >
                  <span className="text-sm font-bold">{w.classN}</span>
                  <span className="text-4xl font-extrabold leading-none">{c}</span>
                  <span className={`mt-1 text-xs font-extrabold ${ready ? "" : "text-ink/40"}`}>{ready ? `✓ ${w.ready}` : w.soon}</span>
                </button>
              );
            })}
          </div>
          {soonFor !== null && (
            <p key={soonFor} className="anim-shake w-full rounded-2xl bg-sun/30 p-3 text-lg font-bold" role="status">
              📚 {w.classN} {soonFor}: {w.soonMsg}
            </p>
          )}
          <button onClick={() => setStep("name")} className="text-lg font-bold text-grape underline">
            ← {w.back}
          </button>
        </section>
      )}
    </main>
  );
}
