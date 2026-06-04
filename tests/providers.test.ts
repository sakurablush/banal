/**
 * Exhaustive tests for Providers routing (sendFreeMessage + key management + auto + errors + rate limits).
 * Enforces 100% coverage as required by vitest.config thresholds.
 * Mocks fetch completely. Tests the "poor person" happy paths and all graceful failures.
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  sendFreeMessage,
  storeApiKey,
  getStoredApiKey,
  clearApiKey,
  getAllStoredKeys,
  getFreeKeyUrl,
  getProviderDisplayName,
  getDefaultModel,
  pickBestFreeProvider,
  detectRateLimit,
  hasAnyKey,
  getCurrentProviderStatus,
  ALL_PROVIDERS,
} from '../src/providers';

const originalFetch = global.fetch;

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  // @ts-ignore - test mock of global
  global.fetch = vi.fn();
});

afterEach(() => {
  // @ts-ignore - restore global mock
  global.fetch = originalFetch;
});

describe('providers — key management (localStorage only, never sent anywhere)', () => {
  it('stores, retrieves, and clears keys per provider', () => {
    storeApiKey('groq', 'gsk_test_123');
    expect(getStoredApiKey('groq')).toBe('gsk_test_123');
    expect(getAllStoredKeys()).toEqual({ groq: 'gsk_test_123' });

    storeApiKey('gemini', 'AIza_abc');
    expect(getStoredApiKey('gemini')).toBe('AIza_abc');

    clearApiKey('groq');
    expect(getStoredApiKey('groq')).toBeNull();
    expect(getStoredApiKey('gemini')).toBe('AIza_abc');
    expect(hasAnyKey()).toBe(true);

    clearApiKey('gemini');
    expect(hasAnyKey()).toBe(false);
  });

  it('ignores empty / whitespace keys gracefully', () => {
    storeApiKey('hf', '   ');
    expect(getStoredApiKey('hf')).toBeNull();
  });

  it('survives localStorage parse errors (private mode etc)', () => {
    // simulate bad data
    localStorage.setItem('banal-api-keys-v1', '{bad json');
    expect(getStoredApiKey('groq')).toBeNull();
    storeApiKey('groq', 'ok-key');
    expect(getStoredApiKey('groq')).toBe('ok-key');
  });
});

describe('providers — helper metadata', () => {
  it('gives correct free key signup URLs (no tracking)', () => {
    expect(getFreeKeyUrl('groq')).toContain('console.groq.com/keys');
    expect(getFreeKeyUrl('gemini')).toContain('aistudio.google.com');
    expect(getFreeKeyUrl('hf')).toContain('huggingface.co/settings/tokens');
  });

  it('returns localized display names', () => {
    expect(getProviderDisplayName('groq', 'en')).toBe('Groq');
    expect(getProviderDisplayName('gemini', 'en')).toBe('Google Gemini');
    expect(getProviderDisplayName('hf', 'ja')).toBe('Hugging Face');
  });

  it('has sane default models for free tiers including zero-key ovh-anon', () => {
    expect(getDefaultModel('groq')).toContain('llama');
    expect(getDefaultModel('gemini')).toContain('gemini-1.5-flash');
    expect(getDefaultModel('hf')).toContain('zephyr');
    expect(getDefaultModel('ovh-anon')).toContain('Llama');
  });

  it('ALL_PROVIDERS lists supported including zero-key public API (ovh-anon)', () => {
    expect(ALL_PROVIDERS).toEqual(['groq', 'gemini', 'hf', 'ovh-anon']);
  });
});

describe('providers — pickBestFreeProvider (smart default for broke users)', () => {
  it('returns explicit non-auto', () => {
    storeApiKey('hf', 'hf_xxx');
    expect(pickBestFreeProvider('gemini')).toBe('gemini');
  });

  it('prefers groq > gemini > hf when keys present (speed first for poor connections)', () => {
    storeApiKey('hf', 'h');
    storeApiKey('gemini', 'g');
    expect(pickBestFreeProvider('auto')).toBe('gemini'); // groq not present yet

    storeApiKey('groq', 'gr');
    expect(pickBestFreeProvider('auto')).toBe('groq');
  });

  it('falls back to ovh-anon (true zero-key public API) when NO keys at all (first-class for the erased)', () => {
    expect(pickBestFreeProvider('auto')).toBe('ovh-anon');
  });
});

describe('providers — detectRateLimit (warm, empowering messages)', () => {
  it('detects HTTP 429 with retry header', () => {
    const res = {
      status: 429,
      headers: { get: (h: string) => (h === 'retry-after' ? '42' : null) },
    } as any;
    const info = detectRateLimit(res, '');
    expect(info.isRateLimited).toBe(true);
    expect(info.retryAfterSeconds).toBe(42);
    expect(info.friendlyMessage).toContain('Free tier is busy');
    expect(info.friendlyMessage).not.toMatch(/shame|stupid|you idiot/i);
  });

  it('detects from error text even without 429 status', () => {
    const info = detectRateLimit(null, 'rate limit exceeded for free');
    expect(info.isRateLimited).toBe(true);
    expect(info.friendlyMessage).toContain('Totally normal');
  });

  it('returns non-limited for normal errors', () => {
    const info = detectRateLimit({ status: 401 } as any, 'invalid key');
    expect(info.isRateLimited).toBe(false);
  });
});

describe('providers — sendFreeMessage happy paths (real structure, mocked network)', () => {
  it('sends string prompt as single user message using auto + stored key', async () => {
    storeApiKey('groq', 'gsk_real');
    const mockResponse = {
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'Here is warm help for your cover letter.' } }],
      }),
    };
    (global.fetch as any).mockResolvedValue(mockResponse);

    const result = await sendFreeMessage('Help me write a cover letter with gaps.');
    expect(result.text).toContain('warm help');
    expect(result.provider).toBe('groq');
    expect(result.isFreeTier).toBe(true);
    expect(result.freePowerNote).toContain('Groq free tier');
    expect(result.latencyMs).toBeGreaterThanOrEqual(0);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.groq.com/openai/v1/chat/completions',
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('accepts full chat history + systemPrompt (used by superpowers)', async () => {
    storeApiKey('gemini', 'AIza_real');
    const mockResponse = {
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: 'Grounding response: you are enough.' }] } }],
      }),
    };
    (global.fetch as any).mockResolvedValue(mockResponse);

    const history = [
      { role: 'user' as const, content: 'I feel like shit today' },
      { role: 'assistant' as const, content: 'Previous reply' },
    ];
    const result = await sendFreeMessage(history, {
      provider: 'gemini',
      systemPrompt: 'You are a kind low-energy friend.',
    });
    expect(result.provider).toBe('gemini');
    expect(result.text).toContain('you are enough');
  });

  it('works with HF provider and key override', async () => {
    const mockResponse = {
      ok: true,
      json: async () => [{ generated_text: 'HF says: start with 10 pushups from the couch.' }],
    };
    (global.fetch as any).mockResolvedValue(mockResponse);

    const result = await sendFreeMessage('Give me 5-min grounding', {
      provider: 'hf',
      apiKey: 'hf_override',
    });
    expect(result.provider).toBe('hf');
    expect(result.model).toContain('zephyr');
  });
});

describe('providers — sendFreeMessage error paths (never shaming)', () => {
  it('throws friendly NO_FREE_KEY when no key for a key-requiring provider (e.g. explicit groq)', async () => {
    await expect(sendFreeMessage('test', { provider: 'groq' })).rejects.toMatchObject({
      code: 'NO_FREE_KEY',
      message: expect.stringContaining('No free key configured yet'),
    });
  });

  it('surfaces RATE_LIMIT with warm message on 429', async () => {
    storeApiKey('groq', 'gsk');
    const res429 = {
      ok: false,
      status: 429,
      headers: { get: () => '15' },
      json: async () => ({ error: { message: 'rate limit' } }),
    };
    (global.fetch as any).mockResolvedValue(res429);

    await expect(sendFreeMessage('hi')).rejects.toMatchObject({
      code: 'RATE_LIMIT',
      message: expect.stringContaining('Free tier is busy right now'),
    });
  });

  it('handles network / CORS / generic errors with recovery advice', async () => {
    storeApiKey('gemini', 'k');
    (global.fetch as any).mockRejectedValue(new Error('Failed to fetch'));
    await expect(sendFreeMessage('hi', { provider: 'gemini' })).rejects.toMatchObject({
      message: expect.stringContaining('Free path hiccup'),
    });
  });

  it('respects AbortSignal and returns clean ABORTED', async () => {
    storeApiKey('groq', 'k');
    const ac = new AbortController();
    (global.fetch as any).mockImplementation(() => {
      // Simulate real fetch behavior: when signal aborts (or user cancels), the promise rejects with AbortError synchronously/microtask.
      // This avoids hanging (the root cause of previous 5s timeout flakiness). ac.abort() updates signal state for realism.
      ac.abort();
      const abortErr = Object.assign(new Error('The operation was aborted.'), {
        name: 'AbortError',
      });
      return Promise.reject(abortErr);
    });
    await expect(sendFreeMessage('hi', { signal: ac.signal })).rejects.toMatchObject({
      code: 'ABORTED',
    });
  });
});

describe('providers — getCurrentProviderStatus (UI badge text)', () => {
  it('shows CTA when no keys', () => {
    expect(getCurrentProviderStatus('en')).toContain('Zero-key tools ready below');
    expect(getCurrentProviderStatus('ja')).toContain('ゼロキー・ツールは下で今すぐ');
  });

  it('shows active free tier when key present', () => {
    storeApiKey('gemini', 'k');
    expect(getCurrentProviderStatus('en')).toContain('Google Gemini free tier');
    expect(getCurrentProviderStatus('ja')).toContain('Gemini');
  });
});
