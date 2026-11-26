import { NextResponse } from "next/server";
import { FriendlyError, generateJson, toFriendly } from "@/lib/gemini";
import { CHAPTER, TOPICS } from "@/lib/content";

export const runtime = "nodejs";
export const maxDuration = 60;

const schema = {
  type: "object",
  properties: {
    isThisChapter: { type: "boolean" },
    topicId: { type: "string", enum: TOPICS.map((t) => t.id) },
    confidence: { type: "number" },
    pageNumber: { type: "string" },
    reason: { type: "string" },
  },
  required: ["isThisChapter", "topicId", "confidence", "reason"],
};

const catalog = TOPICS.map(
  (t) => `- id "${t.id}": section ${t.section}, printed pages ${t.pages}. "${t.title.en}". Page content clues: ${t.keywords}`,
).join("\n");

const SYSTEM = `You look at a phone photo of a school textbook page and decide which topic it belongs to.
The supported chapter is: NCERT ${CHAPTER.book}, Chapter ${CHAPTER.number} "${CHAPTER.title.en}" (printed pages ${CHAPTER.pages}).
Topics of this chapter:
${catalog}

Rules:
- Read the headings, figure numbers (Fig. 12.x), activity numbers, printed page number and text in the photo.
- If the page is from this chapter, pick the ONE topic that best matches the main content of the page.
- For end-of-chapter summary/exercise pages (pages 184-188), choose the topic that most questions on the page are about.
- If the photo is not a page of this chapter (another chapter, another book, or not a textbook page), set isThisChapter=false and pick the closest topic anyway with low confidence.
- confidence is between 0 and 1. reason: one short English sentence.
- The photo may be tilted, blurry or partial; do your best.`;

export async function POST(req: Request) {
  try {
    const { image } = (await req.json()) as { image?: string };
    const m = image?.match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/);
    if (!m) throw new FriendlyError("BAD_INPUT", 400, "Please send a photo.");
    if (m[2].length > 4_000_000) throw new FriendlyError("BAD_INPUT", 400, "Photo is too large.");

    const raw = (await generateJson({
      system: SYSTEM,
      parts: [{ inlineData: { mimeType: m[1], data: m[2] } }, { text: "Which topic is this page about? Answer as JSON." }],
      schema,
      temperature: 0,
      timeoutMs: 45_000,
      firstChain: "lite", // fast + larger free quota; falls back to Flash
    })) as { isThisChapter?: boolean; topicId?: string; confidence?: number; pageNumber?: string; reason?: string };

    const topic = TOPICS.find((t) => t.id === raw.topicId);
    return NextResponse.json({
      isThisChapter: raw.isThisChapter !== false && !!topic,
      topicId: topic?.id ?? null,
      confidence: Math.max(0, Math.min(1, Number(raw.confidence) || 0)),
      pageNumber: raw.pageNumber ?? null,
      reason: raw.reason ?? "",
    });
  } catch (err) {
    const fe = toFriendly(err);
    console.error("[detect]", fe.code, (err as Error)?.message);
    return NextResponse.json({ error: fe.message, code: fe.code }, { status: fe.status });
  }
}
