import data from "./content.json";
import extra from "./lang-extra.json";

export const LANGS = ["hi", "en", "gu", "bn", "mr"] as const;
export type Lang = (typeof LANGS)[number];
type XLang = "gu" | "bn" | "mr";
export const isLang = (x: unknown): x is Lang => LANGS.includes(x as Lang);
export const LANG_NAMES: Record<Lang, string> = { hi: "हिंदी", en: "English", gu: "ગુજરાતી", bn: "বাংলা", mr: "मराठी" };

export type Bi = Record<Lang, string>;
export type Scene = { v: string; who: "r" | "g" } & Record<Lang, string>;
export interface Topic { id: string; section: string; pages: string; emoji: string; diagram: string; title: Bi; short: Bi; term: Bi; keywords: string; scenes: Scene[]; notes: Record<Lang, string[]>; example: Bi; }

type XTopic = { title: string; short: string; term: string; example: string; scenes: string[]; notes: string[] };
type XPack = { name: string; chapterTitle: string; ui: Record<string, string>; labels: Record<string, string>; topics: Record<string, XTopic> };
export const EXTRA = extra as Record<XLang, XPack>;
const XL: XLang[] = ["gu", "bn", "mr"];

type Base = { hi: string; en: string };
type RawTopic = Omit<Topic, "title" | "short" | "term" | "example" | "scenes" | "notes"> & {
  title: Base; short: Base; term: Base; example: Base;
  scenes: ({ v: string; who: "r" | "g" } & Base)[];
  notes: { hi: string[]; en: string[] };
};

const add = (b: Base, k: "title" | "short" | "term" | "example", id: string): Bi => ({ ...b, ...Object.fromEntries(XL.map((l) => [l, EXTRA[l].topics[id]?.[k] ?? b.en])) }) as Bi;

export const TOPICS: Topic[] = (data.topics as RawTopic[]).map((t) => ({
  ...t,
  title: add(t.title, "title", t.id),
  short: add(t.short, "short", t.id),
  term: add(t.term, "term", t.id),
  example: add(t.example, "example", t.id),
  scenes: t.scenes.map((s, i) => ({ ...s, ...Object.fromEntries(XL.map((l) => [l, EXTRA[l].topics[t.id]?.scenes[i] ?? s.en])) }) as Scene),
  notes: { ...t.notes, ...Object.fromEntries(XL.map((l) => [l, EXTRA[l].topics[t.id]?.notes ?? t.notes.en])) } as Record<Lang, string[]>,
}));

export const CHAPTER = { ...data.chapter, title: { ...data.chapter.title, ...Object.fromEntries(XL.map((l) => [l, EXTRA[l].chapterTitle])) } as Bi };
export const topicById = (id: string) => TOPICS.find((t) => t.id === id);