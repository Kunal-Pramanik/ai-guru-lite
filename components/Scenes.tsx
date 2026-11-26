/* Animated, scientifically careful SVG scenes for Chapter 12.
   Every scene is 800x450 (16:9). Animations use SVG SMIL + CSS so they play on any phone browser.
   Sizes and distances are not to scale (same note as the textbook figures). */
import type { ReactNode } from "react";
import { EXTRA, type Lang } from "@/lib/content";

const T: Record<string, { hi: string; en: string }> = {
  east: { hi: "पूरब", en: "East" },
  west: { hi: "पश्चिम", en: "West" },
  sun: { hi: "सूरज", en: "Sun" },
  earth: { hi: "पृथ्वी", en: "Earth" },
  moon: { hi: "चाँद", en: "Moon" },
  day: { hi: "दिन", en: "Day" },
  night: { hi: "रात", en: "Night" },
  axis: { hi: "धुरी", en: "Axis" },
  np: { hi: "उत्तरी ध्रुव", en: "North Pole" },
  sp: { hi: "दक्षिणी ध्रुव", en: "South Pole" },
  equator: { hi: "भूमध्य रेखा", en: "Equator" },
  w2e: { hi: "पश्चिम ➜ पूरब", en: "West ➜ East" },
  h24: { hi: "1 चक्कर ≈ 24 घंटे", en: "1 turn ≈ 24 hours" },
  sunrise: { hi: "सूर्योदय", en: "Sunrise" },
  sunset: { hi: "सूर्यास्त", en: "Sunset" },
  village: { hi: "हमारा गाँव", en: "Our village" },
  youSpin: { hi: "तुम घूम रहे हो", en: "You are spinning" },
  treesSeem: { hi: "पेड़ उल्टे घूमते दिखते हैं", en: "Trees seem to turn the other way" },
  torch: { hi: "टॉर्च", en: "Torch" },
  ball: { hi: "गेंद", en: "Ball" },
  pole: { hi: "ध्रुव तारा", en: "Pole Star" },
  dipper: { hi: "सप्तर्षि", en: "Big Dipper" },
  boatMoves: { hi: "नाव आगे ➜", en: "Boat moves ➜" },
  shoreSeems: { hi: "⬅ किनारा पीछे जाता दिखता है", en: "⬅ Shore seems to go back" },
  orbit: { hi: "कक्षा", en: "Orbit" },
  year: { hi: "1 चक्कर ≈ 365 दिन", en: "1 trip ≈ 365 days" },
  jan: { hi: "जनवरी", en: "January" },
  mar: { hi: "मार्च", en: "March" },
  jun: { hi: "जून", en: "June" },
  sep: { hi: "सितंबर", en: "September" },
  dec: { hi: "दिसंबर", en: "December" },
  seeStars: { hi: "रात में ये तारे दिखते हैं", en: "Stars seen at night" },
  summerN: { hi: "उत्तर में गर्मी ☀️", en: "Summer in the North ☀️" },
  winterN: { hi: "उत्तर में सर्दी ❄️", en: "Winter in the North ❄️" },
  tilt: { hi: "झुकी धुरी", en: "Tilted axis" },
  direct: { hi: "सीधी धूप: छोटी जगह, ज़्यादा तेज़", en: "Direct light: small area, stronger" },
  slant: { hi: "तिरछी धूप: बड़ी जगह, कम तेज़", en: "Slanted light: big area, weaker" },
  near: { hi: "पास", en: "Near" },
  far: { hi: "दूर", en: "Far" },
  thumb: { hi: "अंगूठा", en: "Thumb" },
  friend: { hi: "दोस्त (5 मीटर दूर)", en: "Friend (5 m away)" },
  smallNear: { hi: "छोटा, पर पास", en: "Small, but near" },
  bigFar: { hi: "बहुत बड़ा, पर बहुत दूर", en: "Huge, but very far" },
  sameSize: { hi: "आसमान में: बराबर!", en: "In the sky: same size!" },
  line: { hi: "एक सीध में = ग्रहण", en: "In one line = eclipse" },
  solar: { hi: "सूर्य ग्रहण", en: "Solar eclipse" },
  lunar: { hi: "चंद्र ग्रहण", en: "Lunar eclipse" },
  moonMiddle: { hi: "चाँद बीच में", en: "Moon in the middle" },
  earthMiddle: { hi: "पृथ्वी बीच में", en: "Earth in the middle" },
  shadow: { hi: "छाया", en: "Shadow" },
  total: { hi: "पूर्ण", en: "Total" },
  partial: { hi: "आंशिक", en: "Partial" },
  dontLook: { hi: "सीधे मत देखो!", en: "Never look directly!" },
  noSunglass: { hi: "धूप का चश्मा भी नहीं", en: "Not even sunglasses" },
  safeWay: { hi: "सुरक्षित तरीका", en: "Safe way" },
  mirror: { hi: "शीशा", en: "Mirror" },
  wall: { hi: "दीवार पर सूरज", en: "Sun on the wall" },
  glasses: { hi: "ग्रहण वाला खास चश्मा", en: "Special eclipse glasses" },
  redMoon: { hi: "छाया में चाँद लाल दिखता है", en: "In the shadow the Moon looks red" },
  safeLunar: { hi: "देखना सुरक्षित ✓", en: "Safe to watch ✓" },
  notScale: { hi: "आकार और दूरी सही अनुपात में नहीं", en: "Not to scale" },
  moonComes: { hi: "चाँद बीच में आया", en: "Moon comes in between" },
  lightBlocked: { hi: "रोशनी रुकी", en: "Light blocked" },
  umbra: { hi: "पूरी छाया", en: "Full shadow" },
  penumbra: { hi: "हल्की छाया", en: "Light shadow" },
  totalHere: { hi: "यहाँ पूर्ण सूर्य ग्रहण", en: "Total solar eclipse here" },
  partialHere: { hi: "यहाँ आंशिक सूर्य ग्रहण", en: "Partial solar eclipse here" },
  youHere: { hi: "तुम यहाँ हो", en: "You are here" },
  dayDark: { hi: "दिन में रात जैसा अंधेरा!", en: "Dark like night in the daytime!" },
  partCovered: { hi: "सूरज का कुछ हिस्सा ढका", en: "Only part of the Sun covered" },
  moonShadowOnEarth: { hi: "चाँद की छाया पृथ्वी पर", en: "Moon's shadow on the Earth" },
  moonOrbit: { hi: "चाँद का रास्ता", en: "Moon's path" },
  sunlight: { hi: "धूप", en: "Sunlight" },
};

const tx = (k: string, lang: Lang) => (lang === "hi" || lang === "en" ? T[k]?.[lang] : EXTRA[lang].labels[k]) ?? T[k]?.en ?? k;

/* ------------------------------ building blocks ----------------------------- */
function Defs() {
  return (
    <defs>
      <radialGradient id="gSun" cx="45%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#fff6b0" />
        <stop offset="55%" stopColor="#ffc93c" />
        <stop offset="100%" stopColor="#ff8a3d" />
      </radialGradient>
      <radialGradient id="gGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffe27a" stopOpacity=".8" />
        <stop offset="100%" stopColor="#ffe27a" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="gOcean" cx="35%" cy="30%" r="75%">
        <stop offset="0%" stopColor="#7fd0ff" />
        <stop offset="100%" stopColor="#1f6fd6" />
      </radialGradient>
      <radialGradient id="gMoon" cx="35%" cy="30%" r="75%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#b8bccb" />
      </radialGradient>
      <linearGradient id="gSpace" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#140f33" />
        <stop offset="100%" stopColor="#2b2350" />
      </linearGradient>
      <linearGradient id="gDaySky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#8fd3ff" />
        <stop offset="100%" stopColor="#e6f6ff" />
      </linearGradient>
      <linearGradient id="gNightSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0c0a2a" />
        <stop offset="100%" stopColor="#2e2a6b" />
      </linearGradient>
      <linearGradient id="gNightSide" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#0b0930" stopOpacity="0" />
        <stop offset="12%" stopColor="#0b0930" stopOpacity=".78" />
        <stop offset="100%" stopColor="#0b0930" stopOpacity=".85" />
      </linearGradient>
      <linearGradient id="gBeam" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#fff3a6" stopOpacity=".9" />
        <stop offset="100%" stopColor="#fff3a6" stopOpacity=".15" />
      </linearGradient>
    </defs>
  );
}

function Stars({ n = 60, seed = 1, h = 450 }: { n?: number; seed?: number; h?: number }) {
  const out: ReactNode[] = [];
  let s = seed * 9301;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < n; i++) {
    const x = rnd() * 800, y = rnd() * h, r = 0.8 + rnd() * 1.8;
    out.push(
      <circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity={0.4 + rnd() * 0.6}>
        <animate attributeName="opacity" values="0.2;1;0.2" dur={`${2 + rnd() * 3}s`} repeatCount="indefinite" begin={`${rnd() * 3}s`} />
      </circle>,
    );
  }
  return <g>{out}</g>;
}

function Sun({ cx, cy, r, rays = true }: { cx: number; cy: number; r: number; rays?: boolean }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r * 1.9} fill="url(#gGlow)" />
      {rays && (
        <g>
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i * Math.PI) / 6;
            return (
              <line key={i} x1={cx + Math.cos(a) * r * 1.15} y1={cy + Math.sin(a) * r * 1.15} x2={cx + Math.cos(a) * r * 1.45} y2={cy + Math.sin(a) * r * 1.45} stroke="#ffb020" strokeWidth={r * 0.12} strokeLinecap="round" />
            );
          })}
          <animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`} dur="20s" repeatCount="indefinite" />
        </g>
      )}
      <circle cx={cx} cy={cy} r={r} fill="url(#gSun)" />
    </g>
  );
}

let earthId = 0;
/** Earth with scrolling continents (West ➜ East), optional night side and tilt. */
function Earth({ cx, cy, r, night, tilt = 0, spin = 8, axis = false, id, plain }: { cx: number; cy: number; r: number; night?: "left" | "right"; tilt?: number; spin?: number; axis?: boolean; id?: string; plain?: boolean }) {
  const cid = id ?? `ec${++earthId}`;
  if (plain)
    return (
      <g>
        <circle cx={cx} cy={cy} r={r} fill="url(#gOcean)" />
        <ellipse cx={cx - r * 0.35} cy={cy - r * 0.2} rx={r * 0.35} ry={r * 0.25} fill="#3fbf6f" />
        <ellipse cx={cx + r * 0.3} cy={cy + r * 0.3} rx={r * 0.25} ry={r * 0.3} fill="#3fbf6f" />
        <ellipse cx={cx} cy={cy - r * 0.85} rx={r * 0.4} ry={r * 0.13} fill="#fff" opacity=".9" />
      </g>
    );
  const land = (dx: number) => (
    <g transform={`translate(${dx} 0)`} fill="#3fbf6f">
      <path d={`M${cx - r * 0.9} ${cy - r * 0.35} q ${r * 0.25} -${r * 0.35} ${r * 0.55} -${r * 0.1} q ${r * 0.2} ${r * 0.25} -${r * 0.05} ${r * 0.45} q -${r * 0.3} ${r * 0.1} -${r * 0.5} -${r * 0.35} z`} />
      <path d={`M${cx - r * 0.1} ${cy - r * 0.6} q ${r * 0.4} -${r * 0.1} ${r * 0.55} ${r * 0.2} q ${r * 0.05} ${r * 0.35} -${r * 0.25} ${r * 0.55} q -${r * 0.25} ${r * 0.1} -${r * 0.35} -${r * 0.25} q -${r * 0.1} -${r * 0.3} ${r * 0.05} -${r * 0.5} z`} />
      <path d={`M${cx + r * 0.5} ${cy + r * 0.15} q ${r * 0.3} ${r * 0.05} ${r * 0.3} ${r * 0.35} q -${r * 0.1} ${r * 0.3} -${r * 0.35} ${r * 0.2} q -${r * 0.15} -${r * 0.25} ${r * 0.05} -${r * 0.55} z`} />
      <path d={`M${cx - r * 0.55} ${cy + r * 0.3} q ${r * 0.2} -${r * 0.05} ${r * 0.3} ${r * 0.15} q 0 ${r * 0.3} -${r * 0.2} ${r * 0.35} q -${r * 0.15} -${r * 0.2} -${r * 0.1} -${r * 0.5} z`} />
    </g>
  );
  return (
    <g transform={`rotate(${tilt} ${cx} ${cy})`}>
      <defs>
        <clipPath id={cid}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>
      {axis && <line x1={cx} y1={cy - r * 1.45} x2={cx} y2={cy + r * 1.45} stroke="#ff5c8a" strokeWidth={3} strokeDasharray="7 6" />}
      <circle cx={cx} cy={cy} r={r} fill="url(#gOcean)" />
      <g clipPath={`url(#${cid})`}>
        <g>
          {land(0)}
          {land(-2 * r)}
          {spin > 0 && <animateTransform attributeName="transform" type="translate" from="0 0" to={`${2 * r} 0`} dur={`${spin}s`} repeatCount="indefinite" />}
        </g>
        <ellipse cx={cx} cy={cy - r * 0.92} rx={r * 0.5} ry={r * 0.16} fill="#fff" opacity=".9" />
        <ellipse cx={cx} cy={cy + r * 0.94} rx={r * 0.45} ry={r * 0.14} fill="#fff" opacity=".9" />
        {night === "right" && <rect x={cx - r * 0.12} y={cy - r} width={r * 1.2} height={r * 2} fill="url(#gNightSide)" />}
        {night === "left" && <rect x={cx - r * 0.12} y={cy - r} width={r * 1.2} height={r * 2} fill="url(#gNightSide)" transform={`rotate(180 ${cx} ${cy})`} />}
      </g>
      {axis && <circle cx={cx} cy={cy - r * 1.45} r={4} fill="#ff5c8a" />}
    </g>
  );
}

function Moon({ cx, cy, r, children }: { cx: number; cy: number; r: number; children?: ReactNode }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="url(#gMoon)">
        {children}
      </circle>
      <circle cx={cx - r * 0.3} cy={cy - r * 0.2} r={r * 0.18} fill="#a9adbd" opacity=".6" />
      <circle cx={cx + r * 0.25} cy={cy + r * 0.25} r={r * 0.12} fill="#a9adbd" opacity=".6" />
    </g>
  );
}

function Label({ x, y, children, size = 22, color = "#2b2350", anchor = "middle", bg }: { x: number; y: number; children: ReactNode; size?: number; color?: string; anchor?: "start" | "middle" | "end"; bg?: string }) {
  return (
    <text x={x} y={y} fontSize={size} fontWeight={800} fill={color} textAnchor={anchor} style={{ paintOrder: "stroke" }} stroke={bg ?? "none"} strokeWidth={bg ? 6 : 0} strokeLinejoin="round">
      {children}
    </text>
  );
}

function Village({ y = 360, night = false }: { y?: number; night?: boolean }) {
  const g = night ? "#1d3b2a" : "#7ed957";
  const g2 = night ? "#16301f" : "#4cb944";
  return (
    <g>
      <path d={`M0 ${y + 10} Q 200 ${y - 30} 400 ${y + 5} T 800 ${y} V 450 H 0 Z`} fill={g} />
      <path d={`M0 ${y + 40} Q 250 ${y + 10} 500 ${y + 35} T 800 ${y + 30} V 450 H 0 Z`} fill={g2} />
      {[[120, y - 8], [610, y - 4]].map(([hx, hy], i) => (
        <g key={i}>
          <rect x={hx} y={hy - 36} width={56} height={40} fill={night ? "#5a4a3a" : "#f4c48a"} rx={4} />
          <path d={`M${hx - 8} ${hy - 34} L ${hx + 28} ${hy - 62} L ${hx + 64} ${hy - 34} Z`} fill={night ? "#6b2a2a" : "#d9534f"} />
          <rect x={hx + 22} y={hy - 18} width={14} height={22} fill={night ? "#2a2018" : "#8a5a2b"} />
          {night && <rect x={hx + 6} y={hy - 28} width={10} height={10} fill="#ffd86b" />}
        </g>
      ))}
      {[[260, y - 2], [700, y - 6]].map(([px, py], i) => (
        <g key={i}>
          <path d={`M${px} ${py} q 6 -60 -4 -110`} stroke={night ? "#3a2c1c" : "#8a5a2b"} strokeWidth={9} fill="none" strokeLinecap="round" />
          {[-60, -20, 20, 60, 100].map((a, k) => (
            <path key={k} d={`M${px - 4} ${py - 110} q ${Math.cos((a * Math.PI) / 180) * 30} ${-20 + Math.sin((a * Math.PI) / 180) * 10} ${Math.cos((a * Math.PI) / 180) * 50} ${10 + Math.sin((a * Math.PI) / 180) * 30}`} stroke={night ? "#1f4a2e" : "#2f9e55"} strokeWidth={8} fill="none" strokeLinecap="round" />
          ))}
        </g>
      ))}
    </g>
  );
}

function Girl({ x, y, s = 1, talking = false }: { x: number; y: number; s?: number; talking?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g>
        {talking && <animateTransform attributeName="transform" type="translate" values="0 0;0 -6;0 0" dur="0.9s" repeatCount="indefinite" />}
        <ellipse cx={0} cy={118} rx={46} ry={8} fill="#000" opacity=".15" />
        <path d="M-34 110 L -26 40 Q 0 26 26 40 L 34 110 Z" fill="#2fa8ff" />
        <rect x={-30} y={40} width={60} height={18} fill="#fff" rx={6} />
        <rect x={-18} y={108} width={10} height={12} fill="#7a4a2a" />
        <rect x={8} y={108} width={10} height={12} fill="#7a4a2a" />
        <circle cx={0} cy={8} r={30} fill="#b97a4f" />
        <path d="M-31 6 Q -30 -28 0 -26 Q 30 -28 31 6 Q 22 -12 0 -10 Q -22 -12 -31 6 Z" fill="#1c1430" />
        <path d="M-30 4 q -12 24 -6 48" stroke="#1c1430" strokeWidth={9} fill="none" strokeLinecap="round" />
        <path d="M30 4 q 12 24 6 48" stroke="#1c1430" strokeWidth={9} fill="none" strokeLinecap="round" />
        <circle cx={-36} cy={52} r={5} fill="#ff5c8a" />
        <circle cx={36} cy={52} r={5} fill="#ff5c8a" />
        <circle cx={-10} cy={8} r={4} fill="#1c1430" />
        <circle cx={10} cy={8} r={4} fill="#1c1430" />
        <path d={talking ? "M-8 20 Q 0 30 8 20 Z" : "M-8 20 Q 0 27 8 20"} stroke="#1c1430" strokeWidth={3} fill={talking ? "#7a1f3a" : "none"} strokeLinecap="round" />
        <circle cx={-18} cy={17} r={4} fill="#ff8fb1" opacity=".6" />
        <circle cx={18} cy={17} r={4} fill="#ff8fb1" opacity=".6" />
      </g>
    </g>
  );
}

export function Owl({ x, y, s = 1, talking = false }: { x: number; y: number; s?: number; talking?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g>
        {talking && <animateTransform attributeName="transform" type="translate" values="0 0;0 -6;0 0" dur="0.9s" repeatCount="indefinite" />}
        <ellipse cx={100} cy={190} rx={52} ry={8} fill="#000" opacity=".15" />
        <path d="M48 58 L40 22 L74 46 Z" fill="#6a4cf0" />
        <path d="M152 58 L160 22 L126 46 Z" fill="#6a4cf0" />
        <ellipse cx={40} cy={118} rx={14} ry={34} fill="#6a4cf0" transform="rotate(14 40 118)" />
        <ellipse cx={160} cy={118} rx={14} ry={34} fill="#6a4cf0" transform="rotate(-14 160 118)" />
        <ellipse cx={100} cy={112} rx={64} ry={72} fill="#7c5cff" />
        <ellipse cx={100} cy={132} rx={40} ry={46} fill="#c9b8ff" />
        <circle cx={74} cy={78} r={26} fill="#fff" />
        <circle cx={126} cy={78} r={26} fill="#fff" />
        <circle cx={78} cy={80} r={12} fill="#2b2350" />
        <circle cx={122} cy={80} r={12} fill="#2b2350" />
        <circle cx={82} cy={74} r={4} fill="#fff" />
        <circle cx={126} cy={74} r={4} fill="#fff" />
        <path d="M92 98 L108 98 L100 112 Z" fill="#ffc93c" />
        <rect x={84} y={150} width={32} height={22} rx={3} fill="#ffc93c" />
        <path d="M80 182 l-6 6 M80 182 l0 7 M80 182 l6 6 M120 182 l-6 6 M120 182 l0 7 M120 182 l6 6" stroke="#ff8a3d" strokeWidth={5} strokeLinecap="round" />
      </g>
    </g>
  );
}

function Frame({ children, bg = "url(#gDaySky)" }: { children: ReactNode; bg?: string }) {
  return (
    <svg viewBox="0 0 800 450" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ display: "block", fontFamily: "var(--font-kid)" }}>
      <Defs />
      <rect width={800} height={450} fill={bg} />
      {children}
    </svg>
  );
}

const ScaleNote = ({ lang, dark }: { lang: Lang; dark?: boolean }) => (
  <Label x={790} y={440} size={13} anchor="end" color={dark ? "#cfc8f5" : "#5b5280"}>
    {tx("notScale", lang)}
  </Label>
);

/* ---------------------------------- scenes ---------------------------------- */
type P = { lang: Lang; who?: "r" | "g"; emoji?: string };

function Story({ who = "r", emoji = "❓" }: P) {
  return (
    <Frame>
      <circle cx={690} cy={70} r={34} fill="#ffe066" />
      <Village y={370} />
      <rect x={300} y={250} width={200} height={110} fill="#ffe8c2" rx={6} />
      <path d="M290 252 L 400 200 L 510 252 Z" fill="#ff8a3d" />
      <rect x={385} y={300} width={30} height={60} fill="#8a5a2b" />
      <rect x={320} y={272} width={40} height={28} fill="#8fd3ff" />
      <rect x={440} y={272} width={40} height={28} fill="#8fd3ff" />
      <Girl x={190} y={250} s={1.25} talking={who === "r"} />
      <Owl x={500} y={170} s={1.05} talking={who === "g"} />
      <g>
        <ellipse cx={who === "r" ? 230 : 600} cy={92} rx={70} ry={52} fill="#fff" stroke="#2b2350" strokeWidth={3} />
        <path d={who === "r" ? "M215 140 L 200 175 L 245 142" : "M585 140 L 590 172 L 612 142"} fill="#fff" stroke="#2b2350" strokeWidth={3} strokeLinejoin="round" />
        <text x={who === "r" ? 230 : 600} y={112} fontSize={56} textAnchor="middle">
          {who === "r" ? "🤔" : emoji}
        </text>
        <animateTransform attributeName="transform" type="scale" values="1;1.04;1" dur="2s" repeatCount="indefinite" additive="sum" />
      </g>
    </Frame>
  );
}

function SunSky({ lang }: P) {
  const arc = "M 70 360 Q 400 -60 730 360";
  return (
    <Frame>
      <path d={arc} fill="none" stroke="#ff8a3d" strokeWidth={4} strokeDasharray="10 10" opacity=".7" />
      <g>
        <Sun cx={0} cy={0} r={34} />
        <animateMotion dur="9s" repeatCount="indefinite" path={arc} />
      </g>
      <Village y={360} />
      <Label x={70} y={428} size={30} bg="#fff">⬅ {tx("east", lang)}</Label>
      <Label x={730} y={428} size={30} bg="#fff">{tx("west", lang)} ➜</Label>
      <Label x={110} y={300} size={20} bg="#fff">{tx("sunrise", lang)}</Label>
      <Label x={690} y={300} size={20} bg="#fff">{tx("sunset", lang)}</Label>
    </Frame>
  );
}

function MerryGoRound({ lang }: P) {
  return (
    <Frame bg="#bfe9a8">
      {/* trees around (fixed) */}
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        const x = 400 + Math.cos(a) * 300, y = 225 + Math.sin(a) * 175;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={26} fill="#2f9e55" />
            <circle cx={x - 8} cy={y - 8} r={10} fill="#4cc06d" />
          </g>
        );
      })}
      {/* "seem to move" arrow, clockwise */}
      <g>
        <circle cx={400} cy={225} r={240} fill="none" stroke="#ff5c8a" strokeWidth={4} strokeDasharray="14 12" opacity=".8" />
        <path d="M 640 210 l 14 22 l 12 -24" fill="none" stroke="#ff5c8a" strokeWidth={5} strokeLinecap="round" />
        <animateTransform attributeName="transform" type="rotate" from="0 400 225" to="360 400 225" dur="14s" repeatCount="indefinite" />
      </g>
      {/* merry-go-round, anti-clockwise */}
      <g>
        <circle cx={400} cy={225} r={120} fill="#ffc93c" stroke="#ff8a3d" strokeWidth={8} />
        {Array.from({ length: 6 }, (_, i) => (
          <line key={i} x1={400} y1={225} x2={400 + Math.cos((i * Math.PI) / 3) * 120} y2={225 + Math.sin((i * Math.PI) / 3) * 120} stroke="#ff8a3d" strokeWidth={6} />
        ))}
        <circle cx={400} cy={225} r={18} fill="#ff5c8a" />
        <circle cx={505} cy={225} r={18} fill="#b97a4f" stroke="#1c1430" strokeWidth={4} />
        <circle cx={510} cy={225} r={4} fill="#1c1430" />
        <animateTransform attributeName="transform" type="rotate" from="0 400 225" to="-360 400 225" dur="6s" repeatCount="indefinite" />
      </g>
      <Label x={400} y={232} size={20} color="#fff">↺</Label>
      <Label x={400} y={34} size={24} bg="#fff">↺ {tx("youSpin", lang)}</Label>
      <Label x={400} y={438} size={24} color="#c2185b" bg="#fff">↻ {tx("treesSeem", lang)}</Label>
    </Frame>
  );
}

function EarthSpin({ lang }: P) {
  return (
    <Frame bg="url(#gSpace)">
      <Stars n={70} seed={2} />
      <Earth cx={400} cy={235} r={150} axis spin={7} id="es1" />
      <g transform="translate(400 30)">
        <path d="M0 -14 L4 -4 L14 -4 L6 3 L9 13 L0 7 L-9 13 L-6 3 L-14 -4 L-4 -4 Z" fill="#fff6b0" />
      </g>
      <Label x={400} y={78} size={20} color="#ffc6d8">{tx("np", lang)}</Label>
      <Label x={500} y={60} size={20} color="#ff8fb1" anchor="start">{tx("axis", lang)}</Label>
      <line x1={250} y1={235} x2={550} y2={235} stroke="#fff" strokeWidth={2} strokeDasharray="6 6" opacity=".6" />
      <Label x={605} y={240} size={18} color="#cfe8ff" anchor="start">{tx("equator", lang)}</Label>
      <g>
        <path d="M 230 410 L 570 410" stroke="#ffc93c" strokeWidth={6} />
        <path d="M 570 410 l -18 -12 l 0 24 z" fill="#ffc93c" />
      </g>
      <Label x={400} y={400} size={24} color="#ffc93c">{tx("w2e", lang)}</Label>
      <Label x={130} y={120} size={22} color="#fff">{tx("h24", lang)}</Label>
    </Frame>
  );
}

function DayNight({ lang }: P) {
  return (
    <Frame bg="url(#gSpace)">
      <Stars n={50} seed={3} />
      <Sun cx={70} cy={225} r={80} />
      {[150, 190, 225, 260, 300].map((y, i) => (
        <line key={i} x1={170} y1={y} x2={360} y2={y} stroke="#ffe27a" strokeWidth={3} strokeDasharray="10 8" opacity=".7">
          <animate attributeName="stroke-dashoffset" from="36" to="0" dur="1s" repeatCount="indefinite" />
        </line>
      ))}
      <Earth cx={520} cy={225} r={150} night="right" spin={8} id="dn1" />
      {/* village marker going around */}
      <g>
        <circle r={11} fill="#ff5c8a" stroke="#fff" strokeWidth={3} />
        <animateMotion dur="8s" repeatCount="indefinite" path="M 520 70 A 155 155 0 0 1 520 380 A 155 155 0 0 1 520 70" rotate="0" />
      </g>
      <Label x={440} y={235} size={30} color="#fff" bg="#e0a800">{tx("day", lang)} ☀️</Label>
      <Label x={610} y={235} size={30} color="#fff" bg="#0b0930">{tx("night", lang)} 🌙</Label>
      <Label x={520} y={415} size={20} color="#ffc6d8">● {tx("village", lang)}</Label>
      <Label x={520} y={55} size={18} color="#ffe27a">{tx("sunset", lang)} ↓</Label>
      <Label x={520} y={445} size={18} color="#ffe27a">↑ {tx("sunrise", lang)}</Label>
    </Frame>
  );
}

function TorchGlobe({ lang }: P) {
  return (
    <Frame bg="#1b1636">
      <path d="M 210 200 L 520 90 L 520 360 L 210 250 Z" fill="url(#gBeam)" opacity=".7" />
      <g transform="rotate(-8 150 225)">
        <rect x={60} y={200} width={130} height={50} rx={12} fill="#7c5cff" />
        <rect x={180} y={192} width={34} height={66} rx={8} fill="#c9b8ff" />
        <circle cx={214} cy={225} r={24} fill="#fff8c4" />
      </g>
      <g>
        <clipPath id="tgclip">
          <circle cx={580} cy={225} r={120} />
        </clipPath>
        <circle cx={580} cy={225} r={120} fill="#ff8a3d" />
        <rect x={580} y={105} width={130} height={240} fill="#140f2e" opacity=".82" clipPath="url(#tgclip)" />
        <circle cx={580} cy={225} r={120} fill="none" stroke="#000" strokeOpacity=".2" strokeWidth={2} />
        <circle r={10} fill="#2fa8ff" stroke="#fff" strokeWidth={3}>
          <animateMotion dur="7s" repeatCount="indefinite" path="M 580 125 A 100 100 0 0 1 580 325 A 100 100 0 0 1 580 125" />
        </circle>
      </g>
      <Label x={125} y={300} size={24} color="#fff">🔦 {tx("torch", lang)}</Label>
      <Label x={520} y={225} size={26} color="#2b2350" bg="#fff">{tx("day", lang)}</Label>
      <Label x={650} y={225} size={26} color="#fff">{tx("night", lang)}</Label>
      <Label x={580} y={400} size={22} color="#ffc93c">⚽ {tx("ball", lang)}</Label>
    </Frame>
  );
}

function PoleStar({ lang }: P) {
  const px = 400, py = 150;
  const dipper = [
    [0, 0], [38, 10], [70, 30], [98, 58], [92, 98], [136, 108], [146, 66],
  ];
  return (
    <Frame bg="url(#gNightSky)">
      <Stars n={80} seed={4} h={330} />
      {[70, 120, 170, 220].map((r, i) => (
        <circle key={i} cx={px} cy={py} r={r} fill="none" stroke="#9fb4ff" strokeOpacity=".25" strokeWidth={2} strokeDasharray="4 8" />
      ))}
      <g>
        <g transform={`translate(${px + 40} ${py + 30})`}>
          <polyline points={dipper.map(([x, y]) => `${x},${y}`).join(" ")} fill="none" stroke="#ffe27a" strokeWidth={2} strokeOpacity=".6" />
          {dipper.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={6} fill="#fff6b0" />
          ))}
          <text x={60} y={140} fontSize={20} fontWeight={800} fill="#ffe27a" textAnchor="middle">
            {tx("dipper", lang)}
          </text>
        </g>
        <animateTransform attributeName="transform" type="rotate" from={`0 ${px} ${py}`} to={`-360 ${px} ${py}`} dur="16s" repeatCount="indefinite" />
      </g>
      <circle cx={px} cy={py} r={14} fill="#fff" />
      <circle cx={px} cy={py} r={26} fill="#fff" opacity=".25">
        <animate attributeName="r" values="20;30;20" dur="2s" repeatCount="indefinite" />
      </circle>
      <Label x={px} y={py - 34} size={24} color="#fff">{tx("pole", lang)} ⭐</Label>
      <Village y={370} night />
      <Label x={400} y={440} size={22} color="#ffe27a">⬇ North / उत्तर</Label>
    </Frame>
  );
}

function Boat({ lang }: P) {
  return (
    <Frame bg="url(#gNightSky)">
      <Stars n={50} seed={5} h={220} />
      <g>
        <g>
          {[0, 1].map((k) => (
            <g key={k} transform={`translate(${k * 800} 0)`}>
              <path d="M0 250 Q 120 200 240 240 T 480 235 T 800 245 V 290 H 0 Z" fill="#1f4a2e" />
              {[80, 300, 520, 700].map((x, i) => (
                <g key={i}>
                  <rect x={x} y={200} width={8} height={50} fill="#3a2c1c" />
                  <circle cx={x + 4} cy={195} r={26} fill="#2f6e44" />
                </g>
              ))}
            </g>
          ))}
          <animateTransform attributeName="transform" type="translate" from="0 0" to="-800 0" dur="10s" repeatCount="indefinite" />
        </g>
      </g>
      <rect x={0} y={285} width={800} height={165} fill="#2457a6" />
      {[310, 350, 395].map((y, i) => (
        <path key={i} d={`M0 ${y} q 50 -10 100 0 t 100 0 t 100 0 t 100 0 t 100 0 t 100 0 t 100 0 t 100 0`} stroke="#7fb4ff" strokeWidth={3} fill="none" opacity=".5">
          <animateTransform attributeName="transform" type="translate" from="0 0" to="-100 0" dur={`${2 + i}s`} repeatCount="indefinite" />
        </path>
      ))}
      <g>
        <path d="M 290 330 L 510 330 L 470 375 L 330 375 Z" fill="#8a5a2b" />
        <rect x={396} y={230} width={8} height={100} fill="#5a3a1a" />
        <path d="M 404 235 L 404 320 L 470 320 Z" fill="#fff6e0" />
        <Girl x={350} y={240} s={0.7} />
        <animateTransform attributeName="transform" type="translate" values="0 0;0 5;0 0" dur="2.2s" repeatCount="indefinite" />
      </g>
      <Label x={400} y={420} size={24} color="#fff">{tx("boatMoves", lang)}</Label>
      <Label x={400} y={180} size={22} color="#ffe27a">{tx("shoreSeems", lang)}</Label>
    </Frame>
  );
}

function Orbit({ lang }: P) {
  const path = "M 680 225 A 280 150 0 0 1 120 225 A 280 150 0 0 1 680 225";
  return (
    <Frame bg="url(#gSpace)">
      <Stars n={70} seed={6} />
      <ellipse cx={400} cy={225} rx={280} ry={150} fill="none" stroke="#9fb4ff" strokeWidth={3} strokeDasharray="10 10" />
      <Sun cx={400} cy={225} r={60} />
      <g>
        <g>
          <Earth cx={0} cy={0} r={30} plain />
        </g>
        <animateMotion dur="12s" repeatCount="indefinite" path={path} />
      </g>
      <Label x={400} y={56} size={20} color="#cfe8ff">{tx("orbit", lang)}</Label>
      <Label x={400} y={430} size={26} color="#ffc93c">☀️ {tx("year", lang)} 🌍</Label>
      <ScaleNote lang={lang} dark />
    </Frame>
  );
}

function NightSky({ lang }: P) {
  const groups = [
    [400, 30],
    [770, 225],
    [400, 420],
    [30, 225],
  ];
  return (
    <Frame bg="url(#gSpace)">
      <Stars n={40} seed={7} />
      {groups.map(([x, y], i) => (
        <g key={i}>
          {Array.from({ length: 5 }, (_, k) => (
            <circle key={k} cx={x + Math.cos(k * 1.3 + i) * 22} cy={y + Math.sin(k * 1.7 + i) * 14} r={4} fill={["#ffe27a", "#8fd3ff", "#ff8fb1", "#a7f3c8"][i]} />
          ))}
        </g>
      ))}
      <circle cx={400} cy={225} r={170} fill="none" stroke="#9fb4ff" strokeWidth={2} strokeDasharray="8 10" />
      <Sun cx={400} cy={225} r={45} />
      <g>
        <path d="M 590 225 L 760 160 L 760 290 Z" fill="#ffe27a" opacity=".18" />
        <g transform="translate(570 225)">
          <Earth cx={0} cy={0} r={24} night="right" spin={2} id="ns1" />
        </g>
        <animateTransform attributeName="transform" type="rotate" from="0 400 225" to="-360 400 225" dur="14s" repeatCount="indefinite" />
      </g>
      <Label x={400} y={445} size={20} color="#ffe27a">{tx("seeStars", lang)} ✨</Label>
      <ScaleNote lang={lang} dark />
    </Frame>
  );
}

function Seasons({ lang }: P) {
  return (
    <Frame bg="url(#gSpace)">
      <Stars n={60} seed={8} />
      <ellipse cx={400} cy={240} rx={300} ry={95} fill="none" stroke="#9fb4ff" strokeWidth={3} strokeDasharray="10 10" />
      <Sun cx={400} cy={240} r={55} />
      {/* June: left, North Pole tilted towards the Sun (right) */}
      <Earth cx={120} cy={240} r={62} night="left" tilt={23} axis spin={5} id="s1" />
      {/* December: right, same tilt in space => North Pole tilted away from the Sun */}
      <Earth cx={680} cy={240} r={62} night="right" tilt={23} axis spin={5} id="s2" />
      <g>
        <circle r={14} fill="#2fa8ff" stroke="#fff" strokeWidth={2} />
        <animateMotion dur="12s" repeatCount="indefinite" path="M 700 240 A 300 95 0 0 1 100 240 A 300 95 0 0 1 700 240" />
      </g>
      <Label x={120} y={360} size={26} color="#ffc93c">{tx("jun", lang)}</Label>
      <Label x={120} y={392} size={22} color="#fff">{tx("summerN", lang)}</Label>
      <Label x={680} y={360} size={26} color="#8fd3ff">{tx("dec", lang)}</Label>
      <Label x={680} y={392} size={22} color="#fff">{tx("winterN", lang)}</Label>
      <Label x={400} y={60} size={22} color="#ff8fb1">↗ {tx("tilt", lang)} (23½°) ↗</Label>
      <ScaleNote lang={lang} dark />
    </Frame>
  );
}

function Rays({ lang }: P) {
  const rays = (x0: number, y0: number, x1: number, y1: number, n: number, dx: number) =>
    Array.from({ length: n }, (_, i) => (
      <line key={i} x1={x0 + i * dx} y1={y0} x2={x1 + i * dx} y2={y1} stroke="#ffc93c" strokeWidth={4} strokeDasharray="12 8">
        <animate attributeName="stroke-dashoffset" from="40" to="0" dur="0.8s" repeatCount="indefinite" />
      </line>
    ));
  return (
    <Frame bg="#fff8e6">
      <line x1={400} y1={20} x2={400} y2={430} stroke="#e8dcff" strokeWidth={3} />
      {/* direct */}
      {rays(150, 60, 150, 330, 5, 25)}
      <rect x={60} y={330} width={300} height={40} fill="#a0703f" />
      <ellipse cx={200} cy={334} rx={62} ry={10} fill="#ff5c2a" opacity=".85">
        <animate attributeName="opacity" values=".6;1;.6" dur="1.6s" repeatCount="indefinite" />
      </ellipse>
      <Label x={200} y={45} size={34}>☀️</Label>
      <Label x={200} y={405} size={19} color="#c2185b">{tx("direct", lang)}</Label>
      {/* slanted */}
      {rays(450, 60, 520, 330, 5, 50)}
      <rect x={440} y={330} width={330} height={40} fill="#a0703f" />
      <ellipse cx={620} cy={334} rx={130} ry={12} fill="#ffb27a" opacity=".55" />
      <Label x={480} y={45} size={34}>☀️</Label>
      <Label x={605} y={405} size={19} color="#1f6fd6">{tx("slant", lang)}</Label>
    </Frame>
  );
}

function Thumb({ lang }: P) {
  return (
    <Frame>
      <rect x={0} y={330} width={800} height={120} fill="#bfe9a8" />
      {/* eye */}
      <g transform="translate(70 200)">
        <ellipse cx={0} cy={0} rx={34} ry={20} fill="#fff" stroke="#2b2350" strokeWidth={3} />
        <circle cx={6} cy={0} r={10} fill="#2b2350" />
      </g>
      {/* sight lines */}
      <line x1={104} y1={200} x2={700} y2={120} stroke="#ff5c8a" strokeWidth={3} strokeDasharray="8 8" />
      <line x1={104} y1={200} x2={700} y2={262} stroke="#ff5c8a" strokeWidth={3} strokeDasharray="8 8" />
      {/* friend far */}
      <g>
        <circle cx={660} cy={188} r={38} fill="#b97a4f" />
        <path d="M622 182 Q 624 146 660 148 Q 696 146 698 182 Q 680 168 660 168 Q 640 168 622 182 Z" fill="#1c1430" />
        <rect x={628} y={226} width={64} height={104} rx={20} fill="#34c38f" />
      </g>
      {/* thumb near */}
      <g>
        <rect x={185} y={178} width={26} height={44} rx={12} fill="#d9a07a" stroke="#8a5a2b" strokeWidth={2} />
        <rect x={180} y={218} width={40} height={60} rx={14} fill="#d9a07a" stroke="#8a5a2b" strokeWidth={2} />
        <animateTransform attributeName="transform" type="translate" values="0 90;0 90;0 0;0 0;0 90" keyTimes="0;0.15;0.4;0.85;1" dur="6s" repeatCount="indefinite" />
      </g>
      <Label x={198} y={320} size={20}>👍 {tx("thumb", lang)} ({tx("near", lang)})</Label>
      <Label x={660} y={365} size={20}>{tx("friend", lang)}</Label>
      <Label x={400} y={50} size={26} color="#7c5cff" bg="#fff">{tx("smallNear", lang)} ⬌ {tx("bigFar", lang)}</Label>
    </Frame>
  );
}

function Sizes({ lang }: P) {
  return (
    <Frame bg="url(#gSpace)">
      <Stars n={40} seed={9} />
      <circle cx={900} cy={225} r={330} fill="url(#gSun)" />
      <Earth cx={70} cy={225} r={40} spin={3} id="sz1" />
      <line x1={110} y1={225} x2={720} y2={60} stroke="#fff" strokeWidth={2} strokeDasharray="6 8" opacity=".7" />
      <line x1={110} y1={225} x2={720} y2={390} stroke="#fff" strokeWidth={2} strokeDasharray="6 8" opacity=".7" />
      <Moon cx={240} cy={225} r={34} />
      <Label x={240} y={300} size={20} color="#fff">{tx("moon", lang)}: {tx("smallNear", lang)}</Label>
      <Label x={690} y={440} size={20} color="#2b2350">{tx("sun", lang)}: {tx("bigFar", lang)}</Label>
      <g transform="translate(330 40)">
        <rect x={0} y={0} width={230} height={90} rx={16} fill="#fff" opacity=".95" />
        <circle cx={60} cy={45} r={28} fill="url(#gSun)" />
        <circle cx={150} cy={45} r={28} fill="url(#gMoon)" />
        <text x={115} y={86} fontSize={15} fontWeight={800} textAnchor="middle" fill="#2b2350">
          {tx("sameSize", lang)}
        </text>
      </g>
      <ScaleNote lang={lang} dark />
    </Frame>
  );
}

function MoonOrbit({ lang }: P) {
  return (
    <Frame bg="url(#gSpace)">
      <Stars n={60} seed={10} />
      <Sun cx={80} cy={225} r={70} />
      <circle cx={520} cy={225} r={150} fill="none" stroke="#9fb4ff" strokeWidth={2} strokeDasharray="8 10" />
      <Earth cx={520} cy={225} r={60} night="right" spin={4} id="mo1" />
      <g>
        <Moon cx={0} cy={0} r={22} />
        <animateMotion dur="10s" repeatCount="indefinite" path="M 520 225 m -150 0 a 150 150 0 1 0 300 0 a 150 150 0 1 0 -300 0" />
      </g>
      <line x1={150} y1={225} x2={700} y2={225} stroke="#ffc93c" strokeWidth={4} strokeDasharray="12 10">
        <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.4;0.5;0.6;1" dur="10s" repeatCount="indefinite" />
      </line>
      <Label x={520} y={420} size={24} color="#ffc93c">☀️ — 🌑 — 🌍  {tx("line", lang)}</Label>
      <ScaleNote lang={lang} dark />
    </Frame>
  );
}

function Compare({ lang }: P) {
  return (
    <Frame bg="url(#gSpace)">
      <Stars n={40} seed={11} />
      {/* solar */}
      <Sun cx={90} cy={115} r={45} rays={false} />
      <Moon cx={330} cy={115} r={18} />
      <path d="M 340 100 L 585 108 L 585 122 L 340 130 Z" fill="#000" opacity=".55" />
      <Earth cx={620} cy={115} r={42} spin={4} id="cp1" />
      <circle cx={580} cy={115} r={8} fill="#000" opacity=".7" />
      <Label x={330} y={60} size={22} color="#ffc93c">{tx("solar", lang)}: {tx("moonMiddle", lang)}</Label>
      <line x1={20} y1={225} x2={780} y2={225} stroke="#fff" strokeOpacity=".2" />
      {/* lunar */}
      <Sun cx={90} cy={335} r={45} rays={false} />
      <Earth cx={380} cy={335} r={42} spin={4} id="cp2" />
      <path d="M 420 318 L 640 326 L 640 344 L 420 352 Z" fill="#000" opacity=".55" />
      <circle cx={650} cy={335} r={20} fill="#b33a2a">
        <animate attributeName="fill" values="#e8e8f0;#b33a2a;#b33a2a;#e8e8f0" dur="5s" repeatCount="indefinite" />
      </circle>
      <Label x={380} y={420} size={22} color="#ff8fb1">{tx("lunar", lang)}: {tx("earthMiddle", lang)}</Label>
    </Frame>
  );
}

function SolarEclipse({ lang }: P) {
  return (
    <Frame bg="url(#gSpace)">
      <Stars n={60} seed={12} />
      <Sun cx={80} cy={225} r={95} />
      <Earth cx={660} cy={225} r={95} spin={6} id="se1" />
      {/* moon moving into line */}
      <g>
        <Moon cx={380} cy={225} r={24} />
        <animateTransform attributeName="transform" type="translate" values="0 -150;0 0;0 0;0 150" keyTimes="0;0.35;0.75;1" dur="9s" repeatCount="indefinite" />
      </g>
      {/* shadow cone + spot */}
      <g opacity="0">
        <path d="M 395 206 L 578 214 L 578 236 L 395 244 Z" fill="#000" opacity=".7" />
        <path d="M 395 200 L 585 170 L 585 280 L 395 250 Z" fill="#000" opacity=".25" />
        <circle cx={572} cy={225} r={13} fill="#000" opacity=".8" />
        <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.33;0.4;0.72;0.8" dur="9s" repeatCount="indefinite" />
      </g>
      <Label x={80} y={370} size={26} color="#ffc93c">{tx("sun", lang)}</Label>
      <Label x={380} y={330} size={24} color="#e8e8f0">{tx("moon", lang)}</Label>
      <Label x={660} y={370} size={26} color="#8fd3ff">{tx("earth", lang)}</Label>
      <Label x={540} y={90} size={20} color="#fff">{tx("shadow", lang)} ➘</Label>
      <Label x={400} y={430} size={24} color="#ffc93c">{tx("sun", lang)} ➜ {tx("moon", lang)} ➜ {tx("earth", lang)}</Label>
      <ScaleNote lang={lang} dark />
    </Frame>
  );
}

function EclipseSky({ lang }: P) {
  const dur = "10s";
  return (
    <Frame>
      <rect width={800} height={450} fill="#0c0a2a" opacity="0">
        <animate attributeName="opacity" values="0;0.3;0.85;0.85;0.3;0" keyTimes="0;0.3;0.48;0.58;0.75;1" dur={dur} repeatCount="indefinite" />
      </rect>
      <g opacity="0">
        <Stars n={40} seed={13} h={300} />
        <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;0.4;0.48;0.58;0.66;1" dur={dur} repeatCount="indefinite" />
      </g>
      <circle cx={400} cy={160} r={95} fill="#fff" opacity="0">
        <animate attributeName="opacity" values="0;0;0.6;0.6;0;0" keyTimes="0;0.45;0.5;0.56;0.6;1" dur={dur} repeatCount="indefinite" />
      </circle>
      <circle cx={400} cy={160} r={70} fill="url(#gSun)" />
      <circle cx={400} cy={160} r={70} fill="#1b1738">
        <animate attributeName="cx" values="200;400;400;600" keyTimes="0;0.5;0.56;1" dur={dur} repeatCount="indefinite" />
      </circle>
      <Village y={360} />
      <g>
        <Label x={400} y={290} size={28} color="#fff" bg="#2b2350">{tx("partial", lang)}</Label>
        <animate attributeName="opacity" values="0;1;0;0;1;0" keyTimes="0;0.25;0.45;0.6;0.8;1" dur={dur} repeatCount="indefinite" />
      </g>
      <g opacity="0">
        <Label x={400} y={290} size={30} color="#ffc93c" bg="#2b2350">{tx("total", lang)} 🌑</Label>
        <animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;0.46;0.48;0.58;0.6;1" dur={dur} repeatCount="indefinite" />
      </g>
      <Label x={400} y={40} size={22} color="#2b2350" bg="#fff">{tx("solar", lang)}</Label>
    </Frame>
  );
}

function Safety({ lang }: P) {
  return (
    <Frame bg="#fff8e6">
      <line x1={400} y1={20} x2={400} y2={430} stroke="#e8dcff" strokeWidth={3} />
      {/* wrong */}
      <Sun cx={90} cy={80} r={40} />
      <Girl x={230} y={190} s={1.1} />
      <line x1={110} y1={100} x2={220} y2={190} stroke="#ffc93c" strokeWidth={5} />
      <g stroke="#e53935" strokeWidth={14} strokeLinecap="round">
        <line x1={150} y1={150} x2={330} y2={330} />
        <line x1={330} y1={150} x2={150} y2={330} />
      </g>
      <Label x={200} y={385} size={26} color="#e53935">❌ {tx("dontLook", lang)}</Label>
      <Label x={200} y={418} size={18} color="#e53935">🕶️ {tx("noSunglass", lang)}</Label>
      {/* right */}
      <Label x={600} y={45} size={24} color="#1d9a6c">✅ {tx("safeWay", lang)}</Label>
      <Sun cx={470} cy={110} r={30} rays={false} />
      <rect x={700} y={90} width={70} height={230} fill="#e8dcff" />
      <circle cx={735} cy={180} r={26} fill="#ffc93c" />
      <circle cx={748} cy={172} r={22} fill="#e8dcff" />
      <g>
        <circle cx={560} cy={280} r={30} fill="#34c38f" />
        <rect x={548} y={256} width={24} height={14} fill="#cfe8ff" stroke="#2b2350" strokeWidth={2} />
      </g>
      <line x1={490} y1={125} x2={560} y2={258} stroke="#ffc93c" strokeWidth={4} />
      <line x1={560} y1={258} x2={705} y2={185} stroke="#ffc93c" strokeWidth={4} strokeDasharray="10 6">
        <animate attributeName="stroke-dashoffset" from="32" to="0" dur="1s" repeatCount="indefinite" />
      </line>
      <Label x={560} y={340} size={18}>🪞 {tx("mirror", lang)}</Label>
      <Label x={735} y={345} size={16}>{tx("wall", lang)}</Label>
      <Label x={600} y={405} size={18} color="#1d9a6c">{tx("glasses", lang)} ✓</Label>
    </Frame>
  );
}

function LunarEclipse({ lang }: P) {
  return (
    <Frame bg="url(#gSpace)">
      <Stars n={60} seed={14} />
      <Sun cx={70} cy={225} r={80} />
      <Earth cx={380} cy={225} r={80} night="right" spin={6} id="le1" />
      <path d="M 380 145 L 760 195 L 760 255 L 380 305 Z" fill="#000" opacity=".45" />
      <g>
        <circle cx={680} cy={225} r={30} fill="#e8e8f0">
          <animate attributeName="fill" values="#e8e8f0;#e8e8f0;#a83a28;#a83a28;#e8e8f0" keyTimes="0;0.3;0.42;0.72;0.85" dur="9s" repeatCount="indefinite" />
        </circle>
        <animateTransform attributeName="transform" type="translate" values="0 -170;0 0;0 0;0 170" keyTimes="0;0.35;0.75;1" dur="9s" repeatCount="indefinite" />
      </g>
      <Label x={70} y={360} size={26} color="#ffc93c">{tx("sun", lang)}</Label>
      <Label x={380} y={360} size={26} color="#8fd3ff">{tx("earth", lang)}</Label>
      <Label x={680} y={300} size={24} color="#ff8fb1">{tx("moon", lang)}</Label>
      <Label x={580} y={130} size={20} color="#fff">{tx("shadow", lang)}</Label>
      <Label x={400} y={430} size={24} color="#ffc93c">{tx("sun", lang)} ➜ {tx("earth", lang)} ➜ {tx("moon", lang)}</Label>
      <ScaleNote lang={lang} dark />
    </Frame>
  );
}

function MoonSky({ lang }: P) {
  const dur = "10s";
  return (
    <Frame bg="url(#gNightSky)">
      <Stars n={80} seed={15} h={320} />
      <defs>
        <clipPath id="msclip">
          <circle cx={400} cy={150} r={70} />
        </clipPath>
      </defs>
      <circle cx={400} cy={150} r={70} fill="#f4f4fa">
        <animate attributeName="fill" values="#f4f4fa;#f4f4fa;#b0412c;#b0412c;#f4f4fa" keyTimes="0;0.35;0.5;0.7;0.9" dur={dur} repeatCount="indefinite" />
      </circle>
      <g clipPath="url(#msclip)">
        <circle cx={240} cy={150} r={110} fill="#2a0f0a" opacity=".55">
          <animate attributeName="cx" values="240;400;400;560" keyTimes="0;0.45;0.7;1" dur={dur} repeatCount="indefinite" />
        </circle>
      </g>
      <Village y={360} night />
      <Label x={400} y={265} size={22} color="#ffb4a2">{tx("redMoon", lang)}</Label>
      <Label x={400} y={440} size={22} color="#a7f3c8">{tx("safeLunar", lang)}</Label>
    </Frame>
  );
}


/* ---------- Solar eclipse, step by step (book-style) ---------- */

/** Book-style diagram: Sun → Moon → Earth with full shadow (umbra) and light shadow (penumbra). */
function ShadowDiagram({ lang, focus, mini = false, uid }: { lang: Lang; focus?: "total" | "partial" | "both"; mini?: boolean; uid: string }) {
  const E = { cx: 690, cy: 225, r: 120 };
  const fadeIn = (delay: string) => (mini ? null : <animate attributeName="opacity" from="0" to="1" begin={delay} dur="1s" fill="freeze" />);
  return (
    <g>
      <rect width={800} height={450} fill="url(#gSpace)" />
      {!mini && <Stars n={45} seed={21} />}
      <circle cx={E.cx} cy={E.cy} r={270} fill="none" stroke="#9fb4ff" strokeOpacity=".35" strokeWidth={2} strokeDasharray="8 10" />
      <Sun cx={40} cy={225} r={150} rays={false} />
      {/* sunlight wedges, like the textbook figure */}
      <polygon points="70,90 70,150 420,206" fill="#ffe27a" opacity=".35" />
      <polygon points="70,300 70,360 420,244" fill="#ffe27a" opacity=".35" />
      <Earth cx={E.cx} cy={E.cy} r={E.r} night="right" spin={mini ? 0 : 12} id={`sdE-${uid}`} />
      <defs>
        <clipPath id={`sdC-${uid}`}>
          <circle cx={E.cx} cy={E.cy} r={E.r} />
        </clipPath>
      </defs>
      {/* shadow cones behind the Moon */}
      <g opacity={mini ? 1 : 0}>
        <polygon points="420,205 420,245 592,302 592,148" fill="#8f96b8" opacity=".38" />
        <polygon points="420,205 420,245 574,231 574,219" fill="#000" opacity=".8" />
        <g clipPath={`url(#sdC-${uid})`}>
          <ellipse cx={584} cy={225} rx={24} ry={70} fill="#14112b" opacity=".45" />
          <ellipse cx={574} cy={225} rx={9} ry={13} fill="#000" opacity=".9" />
        </g>
        {fadeIn("0.6s")}
      </g>
      <Moon cx={420} cy={225} r={20} />
      {/* highlight rings */}
      {(focus === "total" || focus === "both") && (
        <circle cx={574} cy={225} r={20} fill="none" stroke="#ffc93c" strokeWidth={mini ? 8 : 4}>
          <animate attributeName="r" values="16;26;16" dur="1.4s" repeatCount="indefinite" />
        </circle>
      )}
      {(focus === "partial" || focus === "both") && (
        <ellipse cx={590} cy={225} rx={34} ry={82} fill="none" stroke="#ff8fb1" strokeWidth={mini ? 8 : 4} strokeDasharray={mini ? "0" : "10 6"}>
          <animate attributeName="stroke-opacity" values="1;.35;1" dur="1.4s" repeatCount="indefinite" />
        </ellipse>
      )}
      {!mini && (
        <g>
          <Label x={95} y={420} size={26} color="#ffc93c">{tx("sun", lang)}</Label>
          <Label x={420} y={282} size={22} color="#e8e8f0">{tx("moon", lang)}</Label>
          <Label x={760} y={395} size={24} color="#8fd3ff">{tx("earth", lang)}</Label>
          <Label x={240} y={70} size={16} color="#ffe27a">{tx("sunlight", lang)}</Label>
          <Label x={300} y={160} size={15} color="#cfc8f5" anchor="middle">{tx("moonOrbit", lang)}</Label>
          <g opacity="0">
            <Label x={498} y={196} size={15} color="#fff">{tx("umbra", lang)}</Label>
            <Label x={505} y={305} size={15} color="#cfd4ee">{tx("penumbra", lang)}</Label>
            {(focus === "total" || focus === "both") && (
              <g>
                <line x1={560} y1={62} x2={574} y2={208} stroke="#ffc93c" strokeWidth={3} />
                <Label x={560} y={50} size={19} color="#ffc93c">{tx("totalHere", lang)}</Label>
              </g>
            )}
            {(focus === "partial" || focus === "both") && (
              <g>
                <line x1={560} y1={398} x2={590} y2={300} stroke="#ff8fb1" strokeWidth={3} />
                <Label x={560} y={420} size={19} color="#ff8fb1">{tx("partialHere", lang)}</Label>
              </g>
            )}
            {fadeIn("1.4s")}
          </g>
        </g>
      )}
    </g>
  );
}

/** Small "you are here" copy of the book diagram for the sky views. */
function ShadowInset({ lang, focus, uid }: { lang: Lang; focus: "total" | "partial"; uid: string }) {
  return (
    <g transform="translate(12 12)">
      <rect x={-4} y={-4} width={244} height={168} rx={14} fill="#fff" opacity=".95" />
      <svg x={0} y={0} width={236} height={133} viewBox="0 0 800 450">
        <ShadowDiagram lang={lang} focus={focus} mini uid={uid} />
      </svg>
      <text x={118} y={154} fontSize={17} fontWeight={800} textAnchor="middle" fill={focus === "total" ? "#c98a00" : "#d6336c"}>
        📍 {tx("youHere", lang)}: {tx(focus === "total" ? "umbra" : "penumbra", lang)}
      </text>
    </g>
  );
}

function MoonBetween({ lang }: P) {
  return (
    <Frame bg="url(#gSpace)">
      <Stars n={50} seed={22} />
      <Sun cx={80} cy={225} r={100} />
      <polygon points="180,160 580,175 580,275 180,290" fill="#ffe27a" opacity=".22" />
      <Earth cx={680} cy={225} r={100} night="right" spin={10} id="mb1" />
      {/* shadow appears once the Moon is in line */}
      <g opacity="0">
        <polygon points="398,206 582,216 582,234 398,244" fill="#000" opacity=".75" />
        <circle cx={584} cy={225} r={9} fill="#000" opacity=".85" />
        <animate attributeName="opacity" from="0" to="1" begin="2.8s" dur="0.8s" fill="freeze" />
      </g>
      <g>
        <Moon cx={380} cy={225} r={22} />
        <Label x={380} y={278} size={22} color="#e8e8f0">{tx("moon", lang)}</Label>
        <animateTransform attributeName="transform" type="translate" from="0 -190" to="0 0" dur="3s" fill="freeze" calcMode="spline" keySplines="0.3 0 0.2 1" keyTimes="0;1" />
      </g>
      <Label x={80} y={370} size={26} color="#ffc93c">{tx("sun", lang)}</Label>
      <Label x={680} y={370} size={26} color="#8fd3ff">{tx("earth", lang)}</Label>
      <g opacity="0">
        <Label x={380} y={60} size={24} color="#ffc93c" bg="#2b2350">⬇ {tx("moonComes", lang)}</Label>
        <Label x={500} y={430} size={22} color="#fff" bg="#2b2350">🚫 {tx("lightBlocked", lang)}</Label>
        <animate attributeName="opacity" from="0" to="1" begin="2.8s" dur="0.6s" fill="freeze" />
      </g>
      <ScaleNote lang={lang} dark />
    </Frame>
  );
}

function SolarShadow({ lang }: P) {
  return (
    <Frame bg="url(#gSpace)">
      <ShadowDiagram lang={lang} focus="both" uid="full" />
      <Label x={330} y={440} size={20} color="#fff" bg="#2b2350">{tx("moonShadowOnEarth", lang)}</Label>
      <ScaleNote lang={lang} dark />
    </Frame>
  );
}

function EclipseTotal({ lang }: P) {
  return (
    <Frame>
      <Village y={360} />
      {/* the sky gets dark as the Moon covers the Sun */}
      <rect width={800} height={450} fill="#0c0a2a" opacity="0">
        <animate attributeName="opacity" from="0" to="0.88" begin="0.5s" dur="2.5s" fill="freeze" />
      </rect>
      <g opacity="0">
        <Stars n={35} seed={23} h={300} />
        <animate attributeName="opacity" from="0" to="1" begin="2.8s" dur="1s" fill="freeze" />
      </g>
      <circle cx={430} cy={150} r={100} fill="url(#gGlow)" />
      <circle cx={430} cy={150} r={92} fill="#fff" opacity="0">
        <animate attributeName="opacity" from="0" to="0.55" begin="2.9s" dur="1s" fill="freeze" />
      </circle>
      <circle cx={430} cy={150} r={70} fill="url(#gSun)" />
      <circle cx={250} cy={150} r={72} fill="#1b1738">
        <animate attributeName="cx" from="250" to="430" dur="3s" fill="freeze" />
      </circle>
      <g opacity="0">
        <Label x={430} y={295} size={30} color="#ffc93c" bg="#2b2350">🌑 {tx("total", lang)} {tx("solar", lang)}</Label>
        <Label x={430} y={335} size={22} color="#fff" bg="#2b2350">{tx("dayDark", lang)}</Label>
        <animate attributeName="opacity" from="0" to="1" begin="3s" dur="0.6s" fill="freeze" />
      </g>
      <ShadowInset lang={lang} focus="total" uid="it" />
    </Frame>
  );
}

function EclipsePartial({ lang }: P) {
  return (
    <Frame>
      <Village y={360} />
      <rect width={800} height={450} fill="#0c0a2a" opacity="0">
        <animate attributeName="opacity" from="0" to="0.25" begin="0.5s" dur="2.5s" fill="freeze" />
      </rect>
      <circle cx={430} cy={150} r={100} fill="url(#gGlow)" />
      <circle cx={430} cy={150} r={70} fill="url(#gSun)" />
      <circle cx={250} cy={150} r={72} fill="#2b2350" opacity=".92">
        <animate attributeName="cx" from="250" to="382" dur="3s" fill="freeze" />
      </circle>
      <g opacity="0">
        <Label x={430} y={295} size={30} color="#d6336c" bg="#fff">🌗 {tx("partial", lang)} {tx("solar", lang)}</Label>
        <Label x={430} y={335} size={22} color="#2b2350" bg="#fff">{tx("partCovered", lang)}</Label>
        <animate attributeName="opacity" from="0" to="1" begin="3s" dur="0.6s" fill="freeze" />
      </g>
      <ShadowInset lang={lang} focus="partial" uid="ip" />
    </Frame>
  );
}

const MAP: Record<string, (p: P) => ReactNode> = {
  story: Story,
  sunSky: SunSky,
  merryGoRound: MerryGoRound,
  earthSpin: EarthSpin,
  dayNight: DayNight,
  torchGlobe: TorchGlobe,
  poleStar: PoleStar,
  boat: Boat,
  orbit: Orbit,
  nightSky: NightSky,
  seasons: Seasons,
  rays: Rays,
  thumb: Thumb,
  sizes: Sizes,
  moonOrbit: MoonOrbit,
  compare: Compare,
  solarEclipse: SolarEclipse,
  eclipseSky: EclipseSky,
  safety: Safety,
  lunarEclipse: LunarEclipse,
  moonSky: MoonSky,
  moonBetween: MoonBetween,
  solarShadow: SolarShadow,
  eclipseTotal: EclipseTotal,
  eclipsePartial: EclipsePartial,
};

export function SceneVisual({ v, lang, who, emoji }: { v: string; lang: Lang; who?: "r" | "g"; emoji?: string }) {
  const C = MAP[v] ?? Story;
  return <>{C({ lang, who, emoji })}</>;
}
