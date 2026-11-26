"use client";

import { LANGS, LANG_NAMES, type Lang } from "@/lib/content";
import { ui } from "@/lib/ui";

export function OwlIcon({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" aria-hidden>
      <path d="M48 58 L40 22 L74 46 Z" fill="#6a4cf0" />
      <path d="M152 58 L160 22 L126 46 Z" fill="#6a4cf0" />
      <ellipse cx="100" cy="112" rx="64" ry="72" fill="#7c5cff" />
      <ellipse cx="100" cy="132" rx="40" ry="46" fill="#c9b8ff" />
      <circle cx="74" cy="78" r="26" fill="#fff" />
      <circle cx="126" cy="78" r="26" fill="#fff" />
      <circle cx="78" cy="80" r="12" fill="#2b2350" />
      <circle cx="122" cy="80" r="12" fill="#2b2350" />
      <path d="M92 98 L108 98 L100 112 Z" fill="#ffc93c" />
      <rect x="84" y="150" width="32" height="22" rx="3" fill="#ffc93c" />
    </svg>
  );
}

export function Logo({ lang }: { lang: Lang }) {
  return (
    <span className="flex items-center gap-2">
      <OwlIcon />
      <span className="text-2xl font-extrabold text-grape">{ui(lang).app}</span>
    </span>
  );
}

export function LangToggle({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  return (
    <label className="relative flex items-center rounded-full bg-grape text-white shadow">
      <span className="pointer-events-none absolute left-3 text-lg">🌐</span>
      <select
        aria-label="Language"
        value={lang}
        onChange={(e) => onChange(e.target.value as Lang)}
        className="min-h-[44px] appearance-none rounded-full bg-transparent py-1 pl-10 pr-9 text-lg font-extrabold text-white outline-none"
      >
        {LANGS.map((l) => (
          <option key={l} value={l} className="text-ink">
            {LANG_NAMES[l]}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3 text-sm">▼</span>
    </label>
  );
}
