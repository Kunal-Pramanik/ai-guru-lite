import "server-only";
import { ApiError, FileState, GoogleGenAI, type Part } from "@google/genai";

/* Server-side Gemini helper: one client, JSON output, retry with exponential backoff. */

let client: GoogleGenAI | null = null;

export class FriendlyError extends Error {
  constructor(
    public code: "NO_KEY" | "BUSY" | "QUOTA" | "BAD_INPUT" | "BAD_OUTPUT" | "TIMEOUT" | "UNKNOWN",
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new FriendlyError("NO_KEY", 500, "GEMINI_API_KEY is missing in .env.local");
  if (!client)
    client = new GoogleGenAI({
      apiKey,
      // only used for local testing with a mock server
      ...(process.env.GEMINI_BASE_URL ? { httpOptions: { baseUrl: process.env.GEMINI_BASE_URL } } : {}),
    });
  return client;
}

/* ------------------------------------------------------------------ */
/* Model selection with automatic fallback.                            */
/* Google retires model IDs regularly. Each task has a chain of model  */
/* IDs (newest first); if one is retired / unknown / unavailable on    */
/* this key, the next is tried, and the first one that works is        */
/* remembered for the rest of the session.                             */
/* ------------------------------------------------------------------ */

const env = (k: string) => (process.env[k] ? [process.env[k] as string] : []);

export const MODEL_CHAINS = {
  text: [...env("GEMINI_MODEL"), "gemini-3.5-flash", "gemini-3.6-flash", "gemini-3.7-flash", "gemini-3.8-flash", "gemini-flash-latest", "gemini-2.5-flash"],
  lite: [...env("GEMINI_LITE_MODEL"), "gemini-3.5-flash-lite", "gemini-3.1-flash-lite", "gemini-flash-lite-latest", "gemini-2.5-flash-lite"],
  image: [...env("IMAGE_MODEL"), "gemini-3.1-flash-image", "gemini-3.1-flash-lite-image", "gemini-2.5-flash-image"],
};
export type ChainName = keyof typeof MODEL_CHAINS;

const working: Partial<Record<ChainName, string>> = {};

function isModelMissing(err: unknown): boolean {
  const status = err instanceof ApiError ? err.status : 0;
  const m = String((err as Error)?.message || "");
  return status === 404 || /not found|not supported|no longer available|is not available|deprecated|unknown model|invalid model/i.test(m);
}

function isOverloaded(err: unknown): boolean {
  const status = err instanceof ApiError ? err.status : 0;
  return status === 503 || /high demand|overloaded|UNAVAILABLE/i.test(String((err as Error)?.message || ""));
}

/** Run fn with the first model in the chain that exists for this API key. */
export async function withModel<T>(chain: ChainName, fn: (model: string) => Promise<T>): Promise<T> {
  const list = working[chain] ? [working[chain]!, ...MODEL_CHAINS[chain].filter((m) => m !== working[chain])] : MODEL_CHAINS[chain];
  let lastErr: unknown;
  for (const model of Array.from(new Set(list))) {
    try {
      const out = await fn(model);
      if (working[chain] !== model) console.info(`[gemini] using ${model} for ${chain}`);
      working[chain] = model;
      return out;
    } catch (err) {
      lastErr = err;
      if (isOverloaded(err)) {
        // 503 "high demand": another model in the chain is often free right now.
        console.warn(`[gemini] ${model} is busy (503) – trying the next model`);
        continue;
      }
      if (!isModelMissing(err)) throw err;
      console.warn(`[gemini] model ${model} not available – trying the next one`);
      if (working[chain] === model) delete working[chain];
    }
  }
  throw lastErr;
}

/** Gemini 3 models work best at their default temperature. */
export const tempFor = (model: string, t: number) => (model.startsWith("gemini-3") ? undefined : t);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function statusOf(err: unknown): number {
  if (err instanceof ApiError) return err.status;
  const m = String((err as Error)?.message || "");
  const code = m.match(/\b(429|500|502|503|504)\b/);
  if (code) return Number(code[1]);
  if (/timeout|timed out|aborted|ECONNRESET|fetch failed|network/i.test(m)) return 599;
  return 0;
}

const TRANSIENT = new Set([429, 500, 502, 503, 504, 599]);

/** True when a 429 is the per-DAY quota (resets at midnight Pacific), not a per-minute burst. */
export function isDailyQuota(err: unknown): boolean {
  return statusOf(err) === 429 && /per.?day|perday|daily|RPD/i.test(String((err as Error)?.message || ""));
}

/**
 * Generate JSON from Gemini. Retries transient failures (max 4 attempts, 1.5s → 3s → 6s backoff),
 * switching to a lighter model on the last attempt if the main model is overloaded.
 */
export async function generateJson(opts: {
  parts: Part[];
  system: string;
  schema: unknown;
  temperature?: number;
  timeoutMs?: number;
  /** which model chain to try first (default "text"); the last attempt uses the other chain */
  firstChain?: ChainName;
}): Promise<unknown> {
  const ai = getClient();
  const maxAttempts = 4;
  let lastErr: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const first: ChainName = opts.firstChain ?? "text";
    const chain: ChainName = attempt === maxAttempts ? (first === "text" ? "lite" : "text") : first;
    try {
      return await withModel(chain, async (model) => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), opts.timeoutMs ?? 170_000);
        try {
          const res = await ai.models.generateContent({
            model,
            contents: [{ role: "user", parts: opts.parts }],
            config: {
              systemInstruction: opts.system,
              responseMimeType: "application/json",
              responseJsonSchema: opts.schema,
              temperature: tempFor(model, opts.temperature ?? 0.4),
              abortSignal: controller.signal,
            },
          });
          const text = res.text ?? "";
          try {
            return JSON.parse(text);
          } catch {
            const m = text.match(/\{[\s\S]*\}/);
            if (m) return JSON.parse(m[0]);
            throw new FriendlyError("BAD_OUTPUT", 502, "The AI returned an unreadable answer.");
          }
        } finally {
          clearTimeout(timer);
        }
      });
    } catch (err) {
      lastErr = err;
      if (err instanceof FriendlyError && err.code !== "BAD_OUTPUT") throw err;
      const status = statusOf(err);
      const retryable = TRANSIENT.has(status) || err instanceof FriendlyError || err instanceof SyntaxError;
      console.warn(`[gemini] attempt ${attempt}/${maxAttempts} (${chain}) failed (status ${status || "?"}): ${String((err as Error)?.message).slice(0, 160)}`);
      if (!retryable || attempt === maxAttempts) break;
      if (isDailyQuota(err)) {
        // Daily limit for this model is used up: waiting won't help, jump straight to the Lite model.
        console.warn("[gemini] daily quota reached – switching to the Lite model");
        attempt = maxAttempts - 1;
        continue;
      }
      await sleep((status === 429 ? 5000 : 1500) * 2 ** (attempt - 1) + Math.random() * 400);
    }
  }
  throw toFriendly(lastErr);
}

export function toFriendly(err: unknown): FriendlyError {
  if (err instanceof FriendlyError) return err;
  const s = statusOf(err);
  if (s === 429) return new FriendlyError("QUOTA", 429, "Guru is a little tired (API limit reached). Please try again in a minute.");
  if (s === 503 || s === 500 || s === 502 || s === 504) return new FriendlyError("BUSY", 503, "Guru's AI helper is busy right now. Please try again.");
  if (s === 599) return new FriendlyError("TIMEOUT", 504, "That took too long. Please try again with fewer pages.");
  if (s === 0 && /not found|no longer available/i.test(String((err as Error)?.message))) return new FriendlyError("UNKNOWN", 502, "The AI model is not available for this key. Set GEMINI_MODEL in .env.local.");
  if (s === 400) return new FriendlyError("BAD_INPUT", 400, "Guru could not read these files. Try clearer photos or a PDF.");
  if (s === 401 || s === 403) return new FriendlyError("NO_KEY", 500, "The Gemini API key is not valid. Check .env.local.");
  return new FriendlyError("UNKNOWN", 500, "Something went wrong. Please try again.");
}

/** Upload big files with the Files API; small files go inline as base64. */
export async function filesToParts(files: File[]): Promise<Part[]> {
  const ai = getClient();
  const total = files.reduce((n, f) => n + f.size, 0);
  const inline = total < 14 * 1024 * 1024;
  const parts: Part[] = [];
  for (const f of files) {
    const mimeType = f.type || (f.name.toLowerCase().endsWith(".pdf") ? "application/pdf" : "image/jpeg");
    if (inline) {
      const b64 = Buffer.from(await f.arrayBuffer()).toString("base64");
      parts.push({ inlineData: { data: b64, mimeType } });
    } else {
      const uploaded = await ai.files.upload({ file: f, config: { mimeType, displayName: f.name } });
      // wait until processed (PDFs can take a moment)
      let info = uploaded;
      for (let i = 0; i < 20 && info.state === FileState.PROCESSING && info.name; i++) {
        await sleep(1500);
        info = await ai.files.get({ name: info.name });
      }
      if (!info.uri) throw new FriendlyError("BAD_INPUT", 400, "Upload failed for " + f.name);
      parts.push({ fileData: { fileUri: info.uri, mimeType } });
    }
  }
  return parts;
}
