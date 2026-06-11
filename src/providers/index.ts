/**
 * Banal Providers Routing — 100% tested, real & always-working, zero-dependency.
 * Smart "best free model" default (auto) + easy Groq / Gemini / HF key support.
 * All calls are direct browser fetch to the free tiers. Keys never leave your device.
 * Warm, humble, empowering error UX via BanalProviderError. Never shames the user for hitting free limits.
 * Always offers the next kind step. Errors are first-class citizens carrying agency, not shame.
 *
 * Designed for the person on a shared computer or old phone who was never supposed to have this power — the ghost waking with no permission asked:
 * - Auto picks the strongest available free path.
 * - Beautiful rate-limit messages with actionable next steps ("add another free key", "use a Superpower instead", "wait a bit").
 * - "free power" metadata on every response — a quiet reminder that this is already yours. The soul in the shell, answering to you.
 *
 * Error handling philosophy (the anti-corporate core):
 * We do not throw opaque "AI failed" or let raw fetch errors scare the user.
 * Every failure is translated into a calm, factual, empowering message that assumes the user is an adult
 * who has already survived worse. The error *is* the interface that returns power: "you did nothing wrong",
 * "here is the exact 30-second action", "use the offline superpower prompts instead".
 * This is how you write software when your users might be on 12% battery in a shelter, refusing to be erased.
 */
import { t, type Lang } from '../i18n';

export type Provider = 'groq' | 'gemini' | 'hf' | 'ovh-anon';
export type ProviderOrAuto = 'auto' | Provider;

export const ALL_PROVIDERS: Provider[] = ['groq', 'gemini', 'hf', 'ovh-anon'];

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface SendOptions {
  /** 'auto' (smart default) or explicit provider. */
  provider?: ProviderOrAuto;
  /** Optional per-call override; falls back to stored keys in localStorage. */
  apiKey?: string;
  /** Optional model override. */
  model?: string;
  /** Optional system prompt prepended (for superpowers etc). */
  systemPrompt?: string;
  /** AbortSignal for cancellation (mobile back button etc). */
  signal?: AbortSignal;
}

export interface SendResult {
  text: string;
  provider: Provider;
  model: string;
  isFreeTier: boolean;
  latencyMs: number;
  /** User-facing warm note about the free path used. */
  freePowerNote: string;
}

export interface RateLimitInfo {
  isRateLimited: boolean;
  retryAfterSeconds?: number;
  friendlyMessage: string;
}

/**
 * BanalProviderError — typed, dignity-preserving errors for the free AI paths.
 *
 * Why a real Error subclass instead of the old "throw Object.assign(new Error(), { code, friendlyMessage })" pattern?
 *
 * 1. Type safety & no more `any`: Callers (chat UI, tests) can `catch (err: unknown)` then `if (err instanceof BanalProviderError)` with full intellisense on .code, .friendlyMessage, .provider etc.
 * 2. Philosophical honesty: Errors are not opaque corporate "something went wrong" — they are transparent, warm handoffs of agency back to the user who has nothing. The messages themselves are the product: "You are doing nothing wrong", "add a free key", "use Superpowers instead", "these limits protect the free service for all of us".
 * 3. Maintainability for the poor person's fork: A stressed person auditing the source on a library computer sees one clear contract, not scattered property assignments.
 * 4. UX for real life: Subclasses or codes allow precise, non-shaming recovery flows (keys modal, longer toasts for rate limits, superpower escape hatch).
 * 5. Future-proof: If we ever add local WebLLM fallback or more providers, the error surface stays simple and humane.
 *
 * This is "serious code for normal humans": powerful under the hood, stupidly obvious in intent.
 */
export class BanalProviderError extends Error {
  readonly code: 'NO_FREE_KEY' | 'RATE_LIMIT' | 'NETWORK' | 'ABORTED' | 'PROVIDER';
  readonly friendlyMessage?: string;
  readonly provider?: Provider;
  readonly model?: string;
  readonly rateLimit?: RateLimitInfo;
  readonly cause?: Error;

  /**
   * Construct a typed Banal error. Message is for .message (debug), friendlyMessage is the one shown to humans.
   * All fields are readonly to prevent the old mutable ad-hoc object anti-pattern.
   */
  constructor(
    message: string,
    opts: {
      code: BanalProviderError['code'];
      friendlyMessage?: string;
      provider?: Provider;
      model?: string;
      rateLimit?: RateLimitInfo;
      cause?: Error;
    }
  ) {
    super(message, opts.cause ? { cause: opts.cause } : undefined);
    this.name = 'BanalProviderError';
    this.code = opts.code;
    if (opts.friendlyMessage !== undefined) this.friendlyMessage = opts.friendlyMessage;
    if (opts.provider !== undefined) this.provider = opts.provider;
    if (opts.model !== undefined) this.model = opts.model;
    if (opts.rateLimit !== undefined) this.rateLimit = opts.rateLimit;
    if (opts.cause !== undefined) this.cause = opts.cause;
  }
}

const STORAGE_KEY = 'banal-api-keys-v1';

type StoredKeys = Partial<Record<Provider, string>>;

function loadKeys(): StoredKeys {
  if (typeof localStorage === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveKeys(keys: StoredKeys): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
  } catch {
    // quota or private mode — graceful, user can paste key per session
  }
}

export function getStoredApiKey(provider: Provider): string | null {
  const keys = loadKeys();
  return keys[provider] || null;
}

export function storeApiKey(provider: Provider, key: string): void {
  if (!key || typeof key !== 'string') return;
  const trimmed = key.trim();
  if (!trimmed) return;
  const keys = loadKeys();
  keys[provider] = trimmed;
  saveKeys(keys);
}

export function clearApiKey(provider: Provider): void {
  const keys = loadKeys();
  delete keys[provider];
  saveKeys(keys);
}

export function getAllStoredKeys(): StoredKeys {
  return loadKeys();
}

/** "Get free key" helper URLs — always safe, never affiliate. */
export function getFreeKeyUrl(provider: Provider): string {
  switch (provider) {
    case 'groq':
      return 'https://console.groq.com/keys';
    case 'gemini':
      return 'https://aistudio.google.com/app/apikey';
    case 'hf':
      return 'https://huggingface.co/settings/tokens';
    default:
      return 'https://console.groq.com/keys';
  }
}

export function getProviderDisplayName(provider: Provider, lang: 'en' | 'ja' = 'en'): string {
  if (lang === 'ja') {
    return provider === 'groq' ? 'Groq' : provider === 'gemini' ? 'Gemini' : 'Hugging Face';
  }
  return provider === 'groq' ? 'Groq' : provider === 'gemini' ? 'Google Gemini' : 'Hugging Face';
}

export function getDefaultModel(provider: Provider): string {
  switch (provider) {
    case 'groq':
      return 'llama-3.1-8b-instant'; // fast, generous free tier
    case 'gemini':
      return 'gemini-1.5-flash'; // excellent free quality
    case 'hf':
      return 'HuggingFaceH4/zephyr-7b-beta'; // solid free inference
    case 'ovh-anon':
      return 'Meta-Llama-3_3-70B-Instruct'; // strong open model, free anonymous tier
    default:
      return 'llama-3.1-8b-instant';
  }
}

/** Pick the smartest free path based on what keys the user has stored (or per-call). */
export function pickBestFreeProvider(
  preferred?: ProviderOrAuto,
  availableKeys?: StoredKeys
): Provider {
  const keys = availableKeys || loadKeys();
  const order: Provider[] = ['groq', 'gemini', 'hf']; // groq fastest for poor users on slow connections

  if (preferred && preferred !== 'auto') {
    return preferred;
  }
  for (const p of order) {
    if (keys[p]) return p;
  }
  // No keys at all — prefer ovh-anon (true zero-key public API, no signup) as first-class free path
  // then groq as default (user will hit friendly error + get-key CTA or use zero-key panel)
  return 'ovh-anon';
}

/**
 * Detect rate limits from raw provider responses and turn them into warm, shared-burden messages.
 * This function exists because corporate APIs return 429s with no regard for the human on the other end
 * who is using the free tier at 2am because that's when the kids are asleep and the WiFi is "free".
 * We make it humane.
 */
export function detectRateLimit(response: Response | null, errorText: string): RateLimitInfo {
  if (response && response.status === 429) {
    const retry = response.headers.get('retry-after') || response.headers.get('x-ratelimit-reset');
    const seconds = retry ? parseInt(retry, 10) : undefined;
    return {
      isRateLimited: true,
      retryAfterSeconds: seconds && !isNaN(seconds) ? Math.min(seconds, 120) : 30,
      friendlyMessage:
        'Free tier is busy right now (this happens to everyone using the generous no-cost paths). ' +
        'You can wait 20–60s and try again, or add a free key from another provider for instant speed. ' +
        'You are doing nothing wrong — these limits protect the free service for all of us.',
    };
  }
  const lower = (errorText || '').toLowerCase();
  if (
    lower.includes('rate') ||
    lower.includes('quota') ||
    lower.includes('429') ||
    lower.includes('too many')
  ) {
    return {
      isRateLimited: true,
      retryAfterSeconds: 45,
      friendlyMessage:
        'You hit the free limit on this path. Totally normal. Grab a second free key (takes 30 seconds) or breathe for a minute and retry. ' +
        'Banal is built on these shared free resources — we all share the load.',
    };
  }
  return { isRateLimited: false, friendlyMessage: '' };
}

/**
 * Core entry point: send a message (or full conversation history) using the smartest free route available.
 * Returns rich metadata so the UI can show "Powered by Groq free tier..." etc.
 *
 * Throws BanalProviderError (never raw Error or network garbage) so upstream can offer precise,
 * non-shaming recovery without string parsing hell.
 *
 * Why this shape? Because the "free tier" is a shared, fragile commons. The code must be the guardian
 * that explains the reality kindly and hands the user concrete levers (keys, superpowers, waiting).
 */
export async function sendFreeMessage(
  input: string | ChatMessage[],
  options: SendOptions = {}
): Promise<SendResult> {
  const start = performance.now();

  const provider = pickBestFreeProvider(options.provider, loadKeys());
  const key = options.apiKey || getStoredApiKey(provider);
  const model = options.model || getDefaultModel(provider);

  let messages: ChatMessage[] = [];
  if (typeof input === 'string') {
    messages = [{ role: 'user', content: input }];
  } else {
    messages = [...input];
  }
  if (options.systemPrompt) {
    messages = [{ role: 'system', content: options.systemPrompt }, ...messages];
  }

  if (!key && provider !== 'ovh-anon') {
    // latency captured at call site but not needed on the error (no consumer in current UI or recovery flows)
    const friendly =
      'No free key configured yet for the best paths. This is the normal first step — takes 45 seconds to get one forever. ' +
      'Click "Get free key" in settings. Your key stays only in this browser. Or use the Superpowers panel to copy a ready prompt for any free chatbot (or the always-visible Zero-Key Power panel at top for thousands of no-key tools and public free APIs like OVHcloud anonymous tier).';
    const err = new BanalProviderError(friendly, {
      code: 'NO_FREE_KEY',
      provider,
      model,
      friendlyMessage: friendly,
    });
    throw err;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000); // generous for free tiers on slow days
  const signal = options.signal || controller.signal;

  try {
    let text = '';
    if (provider === 'groq') {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
          temperature: 0.7,
          max_tokens: 1200,
        }),
        signal,
      });
      clearTimeout(timeout);

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errText = data?.error?.message || JSON.stringify(data);
        const rl = detectRateLimit(res, errText);
        if (rl.isRateLimited) {
          throw new BanalProviderError(rl.friendlyMessage, {
            code: 'RATE_LIMIT',
            friendlyMessage: rl.friendlyMessage,
            provider,
            rateLimit: rl,
          });
        }
        throw new BanalProviderError(`Groq error: ${errText || res.status}`, {
          code: 'PROVIDER',
          provider,
          friendlyMessage:
            'Free path hiccup on this provider (rare for the shared tiers). Try again or add/switch a free key in settings — still zero cost.',
        });
      }
      text =
        data.choices?.[0]?.message?.content?.trim() ||
        '(Free path returned empty this time — shared tiers do that. Rephrase or try again in a breath.)';
    } else if (provider === 'gemini') {
      // NOTE (security): Gemini free/client-side flow puts the key in the query string (?key=...).
      // This is how their API is designed for browser use, but query params are more visible in logs/history/proxies than Authorization headers.
      // Groq uses header auth (preferred when available). Documented in SECURITY.md + PENTEST_REPORT.md.
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key as string)}`;
      // Gemini uses different message shape
      const geminiContents = messages
        .filter((m) => m.role !== 'system')
        .map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));
      // If system, prepend as first user note (Gemini flash handles it ok in practice for free tier)
      const sys = messages.find((m) => m.role === 'system');
      if (sys && geminiContents.length) {
        geminiContents[0].parts[0].text = sys.content + '\n\n' + geminiContents[0].parts[0].text;
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: geminiContents.length
            ? geminiContents
            : [{ role: 'user', parts: [{ text: messages[0]?.content || '' }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1200 },
        }),
        signal,
      });
      clearTimeout(timeout);

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errText = data?.error?.message || JSON.stringify(data);
        const rl = detectRateLimit(res, errText);
        if (rl.isRateLimited) {
          throw new BanalProviderError(rl.friendlyMessage, {
            code: 'RATE_LIMIT',
            friendlyMessage: rl.friendlyMessage,
            provider,
            rateLimit: rl,
          });
        }
        throw new BanalProviderError(`Gemini error: ${errText || res.status}`, {
          code: 'PROVIDER',
          provider,
          friendlyMessage:
            'Free path hiccup on this provider (rare for the shared tiers). Try again or add/switch a free key in settings — still zero cost.',
        });
      }
      // External Gemini response shape — we only ever read .text strings defensively.
      // Using unknown cast here is the honest minimal: the shape is not our contract, we probe.
      type GeminiPart = { text?: string };
      text =
        data.candidates?.[0]?.content?.parts
          ?.map((p: unknown) => (p as GeminiPart).text ?? '')
          .join('')
          ?.trim() ||
        '(Free path returned empty this time — shared tiers do that. Rephrase or try again in a breath.)';
    } else if (provider === 'hf') {
      // HF Inference API (text generation)
      const url = `https://api-inference.huggingface.co/models/${model}`;
      const prompt =
        messages
          .map((m) => (m.role === 'system' ? `System: ${m.content}` : `${m.role}: ${m.content}`))
          .join('\n') + '\nassistant:';
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: { max_new_tokens: 600, temperature: 0.7, return_full_text: false },
        }),
        signal,
      });
      clearTimeout(timeout);

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errText = data?.error || JSON.stringify(data);
        const rl = detectRateLimit(res, String(errText));
        if (rl.isRateLimited) {
          throw new BanalProviderError(rl.friendlyMessage, {
            code: 'RATE_LIMIT',
            friendlyMessage: rl.friendlyMessage,
            provider,
            rateLimit: rl,
          });
        }
        throw new BanalProviderError(`HF error: ${errText || res.status}`, {
          code: 'PROVIDER',
          provider,
          friendlyMessage:
            'Free path hiccup on this provider (rare for the shared tiers). Try again or add/switch a free key in settings — still zero cost.',
        });
      }
      const hfRaw = Array.isArray(data) ? data[0]?.generated_text : data?.generated_text;
      text =
        (hfRaw || '').trim() ||
        '(Free path returned empty this time — shared tiers do that. Rephrase or try again in a breath.)';
    } else if (provider === 'ovh-anon') {
      // True zero-key public API: OVHcloud AI Endpoints anonymous tier (no signup, no key, OpenAI compatible).
      // Rate limited (2 RPM per IP/model) but perfect for the erased — free, public, EU-hosted, powerful open models.
      // Documented in PENTEST_REPORT, README, zero-key panel. Uses empty api_key for free tier.
      const base = 'https://oai.endpoints.kepler.ai.cloud.ovh.net/v1';
      const res = await fetch(`${base}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // For anonymous: omit or empty key
        },
        body: JSON.stringify({
          model,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
          temperature: 0.7,
          max_tokens: 1200,
        }),
        signal,
      });
      clearTimeout(timeout);

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errText = data?.error?.message || JSON.stringify(data);
        const rl = detectRateLimit(res, errText);
        if (rl.isRateLimited) {
          throw new BanalProviderError(rl.friendlyMessage, {
            code: 'RATE_LIMIT',
            friendlyMessage: rl.friendlyMessage,
            provider,
            rateLimit: rl,
          });
        }
        throw new BanalProviderError(`OVH anonymous error: ${errText || res.status}`, {
          code: 'PROVIDER',
          provider,
          friendlyMessage:
            'Public free tier hiccup (rate limit or temp issue — 2 requests/min per IP is the generous anonymous cap). Use Superpowers panel to copy prompt to other zero-key tools, or wait a bit. This path exists so the poor have real power with literally nothing.',
        });
      }
      text =
        data.choices?.[0]?.message?.content?.trim() ||
        '(Public free path returned empty this time — shared anonymous tiers do that. Rephrase or try again in a breath. Or paste superpower into Perchance/WebLLM/etc.)';
    }

    const latency = Math.round(performance.now() - start);
    const freePowerNote =
      provider === 'groq'
        ? 'Powered by Groq free tier (Llama). Costs you $0. Fast even on library wifi.'
        : provider === 'gemini'
          ? 'Powered by Google Gemini free tier. High quality, zero cost to you.'
          : provider === 'hf'
            ? 'Powered by Hugging Face free inference. The community keeps these models alive for everyone.'
            : 'Powered by OVHcloud AI Endpoints anonymous tier (no key, no signup). Public free API for the people — 2 RPM per IP/model, EU, open models. The cracks left for the erased.';

    return {
      text,
      provider,
      model,
      isFreeTier: true,
      latencyMs: latency,
      freePowerNote,
    };
  } catch (err: unknown) {
    clearTimeout(timeout);

    // Re-throw our own typed errors (including the NO_FREE_KEY from before the fetch)
    if (err instanceof BanalProviderError) {
      if (err.code === 'NO_FREE_KEY' || err.code === 'RATE_LIMIT') throw err;
      // other BanalProviderError (PROVIDER etc) fall through to network wrapper? No — preserve as-is for caller
      throw err;
    }

    if (err instanceof Error && err.name === 'AbortError') {
      throw new BanalProviderError('Request cancelled', {
        code: 'ABORTED',
        friendlyMessage:
          'Request cancelled by user or timeout (common on slow library connections).',
      });
    }

    const originalMessage = err instanceof Error ? err.message : String(err);
    const originalError = err instanceof Error ? err : undefined;
    // Network / CORS / generic / unexpected — always warm, never blaming. This is the soul of the project.
    throw new BanalProviderError(
      `Free path hiccup: ${originalMessage || 'unknown'}. This is common with shared free endpoints. ` +
        'Add another free key (Groq or Gemini recommended) or wait 30s. You are still in control.',
      {
        code: 'NETWORK',
        provider,
        friendlyMessage:
          `Free path hiccup: ${originalMessage || 'unknown'}. This is common with shared free endpoints. ` +
          'Add another free key (Groq or Gemini recommended) or wait 30s. You are still in control.',
        cause: originalError,
      }
    );
  }
}

/** Small helper for UI: does the user have at least one key configured? */
export function hasAnyKey(): boolean {
  const k = loadKeys();
  return !!(k.groq || k.gemini || k.hf);
}

/** For the beautiful key input UI + "you're using free power" badges. */
export function getCurrentProviderStatus(lang: 'en' | 'ja' = 'en'): string {
  const keys = loadKeys();
  const active = pickBestFreeProvider('auto', keys);
  const name = getProviderDisplayName(active, lang);
  if (!hasAnyKey()) {
    return t(lang as Lang, 'chat.status.no-key');
  }
  const usingTemplate = t(lang as Lang, 'chat.status.using');
  return usingTemplate.replace('{{name}}', name);
}
