import { EXTRA, type Lang } from "./content";

// All interface text (lesson content lives in content.json)
const UI = {
  hi: {
    app: "AI गुरु",
    tagline: "किताब का पन्ना दिखाओ, आसान भाषा में समझो",
    heroTitle: "कौन सा पन्ना समझ नहीं आया?",
    heroSub: "उस पन्ने की फ़ोटो खींचो। गुरु बताएगा कि यह कौन सा विषय है और आसान भाषा में समझाएगा।",
    camera: "फ़ोटो खींचो",
    gallery: "गैलरी से चुनो",
    reading: "गुरु पन्ना पढ़ रहा है…",
    readingSub: "विषय ढूँढ रहा है 🔍",
    found: "मिल गया! यह विषय है:",
    chapter: "अध्याय",
    classN: "कक्षा",
    section: "भाग",
    video: "वीडियो से समझो",
    videoTab: "वीडियो",
    videoSub: "कहानी और चित्रों के साथ",
    notes: "आसान नोट्स",
    notesSub: "छोटे-छोटे पॉइंट्स में",
    wrongTopic: "यह विषय नहीं? सही विषय चुनो",
    orPick: "या सीधे विषय चुनो",
    another: "दूसरा पन्ना",
    notChapter: "यह पन्ना अध्याय 12 का नहीं लगता। अभी सिर्फ़ अध्याय 12 तैयार है। नीचे से विषय चुनो।",
    unsure: "पक्का नहीं पता। क्या यह सही विषय है?",
    error: "फ़ोटो पढ़ नहीं पाए। फिर से साफ़ फ़ोटो लो, या नीचे से विषय चुनो।",
    tryAgain: "फिर से कोशिश करो",
    play: "चलाओ",
    pause: "रोको",
    replay: "फिर से देखो",
    next: "आगे",
    prev: "पीछे",
    seeNotes: "अब नोट्स देखो",
    seeVideo: "वीडियो देखो",
    readAloud: "पढ़कर सुनाओ",
    stop: "रुको",
    term: "किताब का शब्द",
    example: "रोज़ की ज़िंदगी से उदाहरण",
    rashmika: "रश्मिका",
    guru: "गुरु",
    tapToStart: "शुरू करने के लिए छुओ",
    pages: "पेज",
    done: "बहुत बढ़िया! तुमने समझ लिया 🎉",
    home: "होम",
  },
  en: {
    app: "AI Guru",
    tagline: "Show a textbook page, understand it simply",
    heroTitle: "Which page is hard to understand?",
    heroSub: "Take a photo of that page. Guru will find the topic and explain it in simple words.",
    camera: "Take a photo",
    gallery: "Choose from gallery",
    reading: "Guru is reading the page…",
    readingSub: "Finding the topic 🔍",
    found: "Found it! The topic is:",
    chapter: "Chapter",
    classN: "Class",
    section: "Section",
    video: "Explain with video",
    videoTab: "Video",
    videoSub: "With a story and pictures",
    notes: "Easy notes",
    notesSub: "In short points",
    wrongTopic: "Not this topic? Pick the right one",
    orPick: "Or pick a topic directly",
    another: "Another page",
    notChapter: "This page does not seem to be from Chapter 12. Only Chapter 12 is ready now. Pick a topic below.",
    unsure: "Not fully sure. Is this the right topic?",
    error: "Could not read the photo. Take a clear photo again, or pick a topic below.",
    tryAgain: "Try again",
    play: "Play",
    pause: "Pause",
    replay: "Watch again",
    next: "Next",
    prev: "Back",
    seeNotes: "Now see the notes",
    seeVideo: "Watch the video",
    readAloud: "Read aloud",
    stop: "Stop",
    term: "Textbook word",
    example: "Example from daily life",
    rashmika: "Rashmika",
    guru: "Guru",
    tapToStart: "Tap to start",
    pages: "Pages",
    done: "Great! You understood it 🎉",
    home: "Home",
  },
} as const;

export type UIText = { [K in keyof (typeof UI)["hi"]]: string };
export const ui = (lang: Lang): UIText => (lang === "hi" || lang === "en" ? UI[lang] : ({ ...UI.en, ...EXTRA[lang].ui } as UIText));

/** Pick a speech voice for the language (fallback when no recorded audio exists). */
export function pickVoice(lang: Lang): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  const codes = { hi: ["hi-in", "hi"], en: ["en-in", "en-gb", "en-us", "en"], gu: ["gu-in", "gu"], bn: ["bn-in", "bn-bd", "bn"], mr: ["mr-in", "mr"] }[lang];
  for (const c of codes) {
    const m = voices.filter((v) => v.lang.toLowerCase().replace("_", "-").startsWith(c));
    if (m.length) return m.find((v) => /google|natural|online/i.test(v.name)) || m[0];
  }
  return null;
}