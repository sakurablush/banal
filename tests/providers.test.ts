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
  BanalProviderError,
  type ChatMessage,
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

describe('BanalProviderError', () => {
  it('creates error with all options', () => {
    const error = new BanalProviderError('Test message', {
      code: 'NETWORK',
      friendlyMessage: 'Friendly message',
      provider: 'groq',
      model: 'llama-3',
      rateLimit: { isRateLimited: true, retryAfterSeconds: 30, friendlyMessage: 'Rate limited' },
    });

    expect(error.message).toBe('Test message');
    expect(error.code).toBe('NETWORK');
    expect(error.friendlyMessage).toBe('Friendly message');
    expect(error.provider).toBe('groq');
    expect(error.model).toBe('llama-3');
    expect(error.rateLimit).toBeDefined();
  });

  it('creates error without friendlyMessage', () => {
    const error = new BanalProviderError('Test message', {
      code: 'NETWORK',
    });

    expect(error.message).toBe('Test message');
    expect(error.code).toBe('NETWORK');
    expect(error.friendlyMessage).toBeUndefined();
    expect(error.provider).toBeUndefined();
    expect(error.model).toBeUndefined();
    expect(error.rateLimit).toBeUndefined();
  });

  it('creates error with cause', () => {
    const originalError = new Error('Original error');
    const error = new BanalProviderError('Test message', {
      code: 'NETWORK',
      cause: originalError,
    });

    expect(error.cause).toBe(originalError);
  });

  it('creates error without cause', () => {
    const error = new BanalProviderError('Test message', {
      code: 'NETWORK',
    });

    expect(error.cause).toBeUndefined();
  });
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

  it('ignores null keys gracefully', () => {
    storeApiKey('groq', null as any);
    expect(getStoredApiKey('groq')).toBeNull();
  });

  it('ignores undefined keys gracefully', () => {
    storeApiKey('groq', undefined as any);
    expect(getStoredApiKey('groq')).toBeNull();
  });

  it('ignores number keys gracefully', () => {
    storeApiKey('groq', 123 as any);
    expect(getStoredApiKey('groq')).toBeNull();
  });

  it('survives localStorage parse errors (private mode etc)', () => {
    // simulate bad data
    localStorage.setItem('banal-api-keys-v1', '{bad json');
    expect(getStoredApiKey('groq')).toBeNull();
    storeApiKey('groq', 'ok-key');
    expect(getStoredApiKey('groq')).toBe('ok-key');
  });

  it('handles localStorage being undefined', () => {
    const originalLocalStorage = global.localStorage;
    // @ts-ignore - simulate environment without localStorage
    delete global.localStorage;

    // Should not throw
    storeApiKey('groq', 'test-key');
    expect(getStoredApiKey('groq')).toBeNull();
    expect(getAllStoredKeys()).toEqual({});
    clearApiKey('groq');

    // Restore
    global.localStorage = originalLocalStorage;
  });
});

describe('providers — helper metadata', () => {
  it('gives correct free key signup URLs (no tracking)', () => {
    expect(getFreeKeyUrl('groq')).toContain('console.groq.com/keys');
    expect(getFreeKeyUrl('gemini')).toContain('aistudio.google.com');
    expect(getFreeKeyUrl('hf')).toContain('huggingface.co/settings/tokens');
  });

  it('returns fallback URL for ovh-anon (no key needed)', () => {
    expect(getFreeKeyUrl('ovh-anon')).toContain('console.groq.com/keys');
  });

  it('returns localized display names', () => {
    expect(getProviderDisplayName('groq', 'en')).toBe('Groq');
    expect(getProviderDisplayName('gemini', 'en')).toBe('Google Gemini');
    expect(getProviderDisplayName('hf', 'ja')).toBe('Hugging Face');
  });

  it('returns Japanese display names for all providers', () => {
    expect(getProviderDisplayName('groq', 'ja')).toBe('Groq');
    expect(getProviderDisplayName('gemini', 'ja')).toBe('Gemini');
    expect(getProviderDisplayName('hf', 'ja')).toBe('Hugging Face');
    expect(getProviderDisplayName('ovh-anon', 'ja')).toBe('Hugging Face');
  });

  it('has sane default models for free tiers including zero-key ovh-anon', () => {
    expect(getDefaultModel('groq')).toContain('llama');
    expect(getDefaultModel('gemini')).toContain('gemini-1.5-flash');
    expect(getDefaultModel('hf')).toContain('zephyr');
    expect(getDefaultModel('ovh-anon')).toContain('Llama');
  });

  it('returns fallback model for unknown provider', () => {
    expect(getDefaultModel('unknown' as any)).toContain('llama');
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

  it('handles Groq response with undefined choices', async () => {
    storeApiKey('groq', 'gsk_test');
    const mockResponse = {
      ok: true,
      json: async () => ({}),
    };
    (global.fetch as any).mockResolvedValue(mockResponse);

    const result = await sendFreeMessage('test', { provider: 'groq' });
    expect(result.text).toContain('Free path returned empty');
  });

  it('handles Groq response with empty choices array', async () => {
    storeApiKey('groq', 'gsk_test');
    const mockResponse = {
      ok: true,
      json: async () => ({ choices: [] }),
    };
    (global.fetch as any).mockResolvedValue(mockResponse);

    const result = await sendFreeMessage('test', { provider: 'groq' });
    expect(result.text).toContain('Free path returned empty');
  });

  it('handles Groq response with undefined message', async () => {
    storeApiKey('groq', 'gsk_test');
    const mockResponse = {
      ok: true,
      json: async () => ({ choices: [{}] }),
    };
    (global.fetch as any).mockResolvedValue(mockResponse);

    const result = await sendFreeMessage('test', { provider: 'groq' });
    expect(result.text).toContain('Free path returned empty');
  });

  it('handles Groq response with undefined content', async () => {
    storeApiKey('groq', 'gsk_test');
    const mockResponse = {
      ok: true,
      json: async () => ({ choices: [{ message: {} }] }),
    };
    (global.fetch as any).mockResolvedValue(mockResponse);

    const result = await sendFreeMessage('test', { provider: 'groq' });
    expect(result.text).toContain('Free path returned empty');
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

  it('handles Gemini response with multiple parts', async () => {
    storeApiKey('gemini', 'AIza_test');
    const mockResponse = {
      ok: true,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [{ text: 'Part 1: ' }, { text: 'Part 2: ' }, { text: 'Part 3' }],
            },
          },
        ],
      }),
    };
    (global.fetch as any).mockResolvedValue(mockResponse);

    const result = await sendFreeMessage('test', { provider: 'gemini' });
    expect(result.text).toBe('Part 1: Part 2: Part 3');
  });

  it('handles Gemini response with missing text in parts', async () => {
    storeApiKey('gemini', 'AIza_test');
    const mockResponse = {
      ok: true,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [{ text: 'Valid' }, {}, { text: 'Also valid' }],
            },
          },
        ],
      }),
    };
    (global.fetch as any).mockResolvedValue(mockResponse);

    const result = await sendFreeMessage('test', { provider: 'gemini' });
    expect(result.text).toBe('ValidAlso valid');
  });

  it('handles Gemini with empty message content', async () => {
    storeApiKey('gemini', 'AIza_test');
    const mockResponse = {
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: 'Response to empty' }] } }],
      }),
    };
    (global.fetch as any).mockResolvedValue(mockResponse);

    const result = await sendFreeMessage('', { provider: 'gemini' });
    expect(result.text).toBe('Response to empty');
  });

  it('handles Gemini response with undefined candidates', async () => {
    storeApiKey('gemini', 'AIza_test');
    const mockResponse = {
      ok: true,
      json: async () => ({}),
    };
    (global.fetch as any).mockResolvedValue(mockResponse);

    const result = await sendFreeMessage('test', { provider: 'gemini' });
    expect(result.text).toContain('Free path returned empty');
  });

  it('handles Gemini response with empty candidates array', async () => {
    storeApiKey('gemini', 'AIza_test');
    const mockResponse = {
      ok: true,
      json: async () => ({ candidates: [] }),
    };
    (global.fetch as any).mockResolvedValue(mockResponse);

    const result = await sendFreeMessage('test', { provider: 'gemini' });
    expect(result.text).toContain('Free path returned empty');
  });

  it('handles Gemini response with undefined content', async () => {
    storeApiKey('gemini', 'AIza_test');
    const mockResponse = {
      ok: true,
      json: async () => ({ candidates: [{}] }),
    };
    (global.fetch as any).mockResolvedValue(mockResponse);

    const result = await sendFreeMessage('test', { provider: 'gemini' });
    expect(result.text).toContain('Free path returned empty');
  });

  it('handles Gemini response with undefined parts', async () => {
    storeApiKey('gemini', 'AIza_test');
    const mockResponse = {
      ok: true,
      json: async () => ({ candidates: [{ content: {} }] }),
    };
    (global.fetch as any).mockResolvedValue(mockResponse);

    const result = await sendFreeMessage('test', { provider: 'gemini' });
    expect(result.text).toContain('Free path returned empty');
  });

  it('handles Gemini with only system message (empty geminiContents)', async () => {
    storeApiKey('gemini', 'AIza_test');
    const mockResponse = {
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: 'Response to system only' }] } }],
      }),
    };
    (global.fetch as any).mockResolvedValue(mockResponse);

    const systemOnly: ChatMessage[] = [{ role: 'system', content: 'You are helpful' }];
    const result = await sendFreeMessage(systemOnly, { provider: 'gemini' });
    expect(result.text).toBe('Response to system only');
  });

  it('handles Gemini with only system message and empty content', async () => {
    storeApiKey('gemini', 'AIza_test');
    const mockResponse = {
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: 'Response' }] } }],
      }),
    };
    (global.fetch as any).mockResolvedValue(mockResponse);

    const systemOnly: ChatMessage[] = [{ role: 'system', content: '' }];
    const result = await sendFreeMessage(systemOnly, { provider: 'gemini' });
    expect(result.text).toBe('Response');
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

  it('works with HF provider and system message', async () => {
    const mockResponse = {
      ok: true,
      json: async () => [{ generated_text: 'HF response with system prompt' }],
    };
    (global.fetch as any).mockResolvedValue(mockResponse);

    const result = await sendFreeMessage('test message', {
      provider: 'hf',
      apiKey: 'hf_test',
      systemPrompt: 'You are a helpful assistant',
    });
    expect(result.provider).toBe('hf');
    expect(result.text).toBe('HF response with system prompt');
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

  it('handles Groq non-rate-limit errors gracefully', async () => {
    storeApiKey('groq', 'gsk_test');
    const res500 = {
      ok: false,
      status: 500,
      headers: { get: () => null },
      json: async () => ({ error: { message: 'Internal server error' } }),
    };
    (global.fetch as any).mockResolvedValue(res500);

    await expect(sendFreeMessage('test', { provider: 'groq' })).rejects.toMatchObject({
      code: 'PROVIDER',
      message: expect.stringContaining('Groq error'),
    });
  });

  it('handles Gemini rate limit (429) with friendly message', async () => {
    storeApiKey('gemini', 'AIza_test');
    const res429 = {
      ok: false,
      status: 429,
      headers: { get: (h: string) => (h === 'retry-after' ? '30' : null) },
      json: async () => ({ error: { message: 'Quota exceeded' } }),
    };
    (global.fetch as any).mockResolvedValue(res429);

    await expect(sendFreeMessage('test', { provider: 'gemini' })).rejects.toMatchObject({
      code: 'RATE_LIMIT',
      message: expect.stringContaining('Free tier is busy'),
    });
  });

  it('handles Gemini rate limit without retry-after header', async () => {
    storeApiKey('gemini', 'AIza_test');
    const res429 = {
      ok: false,
      status: 429,
      headers: { get: () => null },
      json: async () => ({ error: { message: 'Rate limit exceeded' } }),
    };
    (global.fetch as any).mockResolvedValue(res429);

    await expect(sendFreeMessage('test', { provider: 'gemini' })).rejects.toMatchObject({
      code: 'RATE_LIMIT',
      message: expect.stringContaining('Free tier is busy'),
    });
  });

  it('handles Gemini non-rate-limit errors gracefully', async () => {
    storeApiKey('gemini', 'AIza_test');
    const res400 = {
      ok: false,
      status: 400,
      headers: { get: () => null },
      json: async () => ({ error: { message: 'Invalid request' } }),
    };
    (global.fetch as any).mockResolvedValue(res400);

    await expect(sendFreeMessage('test', { provider: 'gemini' })).rejects.toMatchObject({
      code: 'PROVIDER',
      message: expect.stringContaining('Gemini error'),
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

describe('providers — OVH anonymous provider (true zero-key public API)', () => {
  it('sends request without API key (anonymous tier)', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'OVH anonymous response for the people.' } }],
      }),
    };
    (global.fetch as any).mockResolvedValue(mockResponse);

    const result = await sendFreeMessage('Help me with my letter', { provider: 'ovh-anon' });
    expect(result.provider).toBe('ovh-anon');
    expect(result.text).toContain('OVH anonymous response');
    expect(result.isFreeTier).toBe(true);
    expect(result.freePowerNote).toContain('OVHcloud AI Endpoints anonymous tier');
    expect(result.latencyMs).toBeGreaterThanOrEqual(0);

    // Verify no Authorization header was sent (anonymous)
    const fetchCall = (global.fetch as any).mock.calls[0];
    const headers = fetchCall[1].headers;
    expect(headers.Authorization).toBeUndefined();
  });

  it('handles OVH rate limit (2 RPM per IP/model) with friendly message', async () => {
    const res429 = {
      ok: false,
      status: 429,
      headers: { get: (h: string) => (h === 'retry-after' ? '60' : null) },
      json: async () => ({ error: { message: 'Rate limit exceeded' } }),
    };
    (global.fetch as any).mockResolvedValue(res429);

    await expect(sendFreeMessage('test', { provider: 'ovh-anon' })).rejects.toMatchObject({
      code: 'RATE_LIMIT',
      message: expect.stringContaining('Free tier is busy'),
    });
  });

  it('handles OVH rate limit without retry-after header', async () => {
    const res429 = {
      ok: false,
      status: 429,
      headers: { get: () => null },
      json: async () => ({ error: { message: 'Rate limit exceeded' } }),
    };
    (global.fetch as any).mockResolvedValue(res429);

    await expect(sendFreeMessage('test', { provider: 'ovh-anon' })).rejects.toMatchObject({
      code: 'RATE_LIMIT',
      message: expect.stringContaining('Free tier is busy'),
    });
  });

  it('handles OVH non-rate-limit errors gracefully', async () => {
    const res500 = {
      ok: false,
      status: 500,
      headers: { get: () => null },
      json: async () => ({ error: { message: 'Internal server error' } }),
    };
    (global.fetch as any).mockResolvedValue(res500);

    await expect(sendFreeMessage('test', { provider: 'ovh-anon' })).rejects.toMatchObject({
      code: 'PROVIDER',
      message: expect.stringContaining('OVH anonymous error'),
    });
  });

  it('successfully sends message to OVH anonymous provider', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'OVH anonymous response' } }],
      }),
    };
    (global.fetch as any).mockResolvedValue(mockResponse);

    const result = await sendFreeMessage('test', { provider: 'ovh-anon' });
    expect(result.provider).toBe('ovh-anon');
    expect(result.text).toBe('OVH anonymous response');
    expect(result.isFreeTier).toBe(true);

    // Verify fetch was called with OVH URL
    expect(global.fetch).toHaveBeenCalledWith(
      'https://oai.endpoints.kepler.ai.cloud.ovh.net/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
    );
  });

  it('handles OVH rate limit without retry-after header (defaults to 30s)', async () => {
    const res429 = {
      ok: false,
      status: 429,
      headers: { get: () => null },
      json: async () => ({ error: { message: 'Too many requests' } }),
    };
    (global.fetch as any).mockResolvedValue(res429);

    try {
      await sendFreeMessage('test', { provider: 'ovh-anon' });
      expect.fail('Should have thrown');
    } catch (err: any) {
      expect(err.code).toBe('RATE_LIMIT');
      expect(err.rateLimit.retryAfterSeconds).toBe(30);
    }
  });

  it('handles OVH network errors gracefully', async () => {
    (global.fetch as any).mockRejectedValue(new Error('Network error'));

    await expect(sendFreeMessage('test', { provider: 'ovh-anon' })).rejects.toMatchObject({
      message: expect.stringContaining('Free path hiccup'),
    });
  });

  it('handles OVH empty response (choices array empty)', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ choices: [] }),
    };
    (global.fetch as any).mockResolvedValue(mockResponse);

    const result = await sendFreeMessage('test', { provider: 'ovh-anon' });
    expect(result.text).toContain('Public free path returned empty');
  });

  it('handles OVH malformed JSON response', async () => {
    const mockResponse = {
      ok: true,
      json: async () => {
        throw new Error('Invalid JSON');
      },
    };
    (global.fetch as any).mockResolvedValue(mockResponse);

    const result = await sendFreeMessage('test', { provider: 'ovh-anon' });
    expect(result.text).toContain('Public free path returned empty');
  });

  it('handles OVH 500 server error', async () => {
    storeApiKey('ovh-anon', 'test-key');
    const mockResponse = {
      ok: false,
      status: 500,
      headers: { get: () => null },
      json: async () => ({ error: { message: 'Internal server error' } }),
    };
    (global.fetch as any).mockResolvedValue(mockResponse);

    await expect(sendFreeMessage('test', { provider: 'ovh-anon' })).rejects.toMatchObject({
      code: 'PROVIDER',
      message: expect.stringContaining('OVH anonymous error'),
    });
  });

  it('handles OVH error without error.message field', async () => {
    storeApiKey('ovh-anon', 'test-key');
    const mockResponse = {
      ok: false,
      status: 503,
      headers: { get: () => null },
      json: async () => ({ status: 'service unavailable' }),
    };
    (global.fetch as any).mockResolvedValue(mockResponse);

    await expect(sendFreeMessage('test', { provider: 'ovh-anon' })).rejects.toMatchObject({
      code: 'PROVIDER',
      message: expect.stringContaining('OVH anonymous error'),
    });
  });
});

describe('providers — HuggingFace error paths', () => {
  it('handles HF rate limit (429) with friendly message', async () => {
    storeApiKey('hf', 'hf_test');
    const res429 = {
      ok: false,
      status: 429,
      headers: { get: (h: string) => (h === 'retry-after' ? '45' : null) },
      json: async () => ({ error: 'Rate limit exceeded' }),
    };
    (global.fetch as any).mockResolvedValue(res429);

    await expect(sendFreeMessage('test', { provider: 'hf' })).rejects.toMatchObject({
      code: 'RATE_LIMIT',
      message: expect.stringContaining('Free tier is busy'),
    });
  });

  it('handles HF 503 service unavailable', async () => {
    storeApiKey('hf', 'hf_test');
    const res503 = {
      ok: false,
      status: 503,
      headers: { get: () => null },
      json: async () => ({ error: 'Service unavailable' }),
    };
    (global.fetch as any).mockResolvedValue(res503);

    await expect(sendFreeMessage('test', { provider: 'hf' })).rejects.toMatchObject({
      code: 'PROVIDER',
      message: expect.stringContaining('HF error'),
    });
  });

  it('handles HF empty generated_text', async () => {
    storeApiKey('hf', 'hf_test');
    const mockResponse = {
      ok: true,
      json: async () => [{ generated_text: '' }],
    };
    (global.fetch as any).mockResolvedValue(mockResponse);

    const result = await sendFreeMessage('test', { provider: 'hf' });
    expect(result.text).toContain('Free path returned empty');
  });

  it('handles HF array response format', async () => {
    storeApiKey('hf', 'hf_test');
    const mockResponse = {
      ok: true,
      json: async () => [{ generated_text: 'Array format response' }],
    };
    (global.fetch as any).mockResolvedValue(mockResponse);

    const result = await sendFreeMessage('test', { provider: 'hf' });
    expect(result.text).toBe('Array format response');
  });

  it('handles HF object response format', async () => {
    storeApiKey('hf', 'hf_test');
    const mockResponse = {
      ok: true,
      json: async () => ({ generated_text: 'Object format response' }),
    };
    (global.fetch as any).mockResolvedValue(mockResponse);

    const result = await sendFreeMessage('test', { provider: 'hf' });
    expect(result.text).toBe('Object format response');
  });

  it('handles HF error with undefined JSON response', async () => {
    storeApiKey('hf', 'hf_test');
    const res500 = {
      ok: false,
      status: 500,
      headers: { get: () => null },
      json: async () => undefined,
    };
    (global.fetch as any).mockResolvedValue(res500);

    await expect(sendFreeMessage('test', { provider: 'hf' })).rejects.toMatchObject({
      code: 'PROVIDER',
      message: expect.stringContaining('HF error: 500'),
    });
  });

  it('handles HF error with empty error message', async () => {
    storeApiKey('hf', 'hf_test');
    const res500 = {
      ok: false,
      status: 500,
      headers: { get: () => null },
      json: async () => ({}),
    };
    (global.fetch as any).mockResolvedValue(res500);

    await expect(sendFreeMessage('test', { provider: 'hf' })).rejects.toMatchObject({
      code: 'PROVIDER',
      message: expect.stringContaining('HF error: {}'),
    });
  });
});

describe('providers — final error catch block (wraps all errors in BanalProviderError)', () => {
  it('handles Groq error with empty error message', async () => {
    storeApiKey('groq', 'gsk_test');
    const res500 = {
      ok: false,
      status: 500,
      headers: { get: () => null },
      json: async () => ({}),
    };
    (global.fetch as any).mockResolvedValue(res500);

    await expect(sendFreeMessage('test', { provider: 'groq' })).rejects.toMatchObject({
      code: 'PROVIDER',
      message: expect.stringContaining('Groq error: {}'),
    });
  });

  it('handles Gemini error with empty error message', async () => {
    storeApiKey('gemini', 'AIza_test');
    const res400 = {
      ok: false,
      status: 400,
      headers: { get: () => null },
      json: async () => ({}),
    };
    (global.fetch as any).mockResolvedValue(res400);

    await expect(sendFreeMessage('test', { provider: 'gemini' })).rejects.toMatchObject({
      code: 'PROVIDER',
      message: expect.stringContaining('Gemini error: {}'),
    });
  });

  it('handles OVH error with empty error message', async () => {
    const res500 = {
      ok: false,
      status: 500,
      headers: { get: () => null },
      json: async () => ({}),
    };
    (global.fetch as any).mockResolvedValue(res500);

    await expect(sendFreeMessage('test', { provider: 'ovh-anon' })).rejects.toMatchObject({
      code: 'PROVIDER',
      message: expect.stringContaining('OVH anonymous error: {}'),
    });
  });

  it('handles Groq error with undefined JSON response', async () => {
    storeApiKey('groq', 'gsk_test');
    const res500 = {
      ok: false,
      status: 500,
      headers: { get: () => null },
      json: async () => undefined,
    };
    (global.fetch as any).mockResolvedValue(res500);

    await expect(sendFreeMessage('test', { provider: 'groq' })).rejects.toMatchObject({
      code: 'PROVIDER',
      message: expect.stringContaining('Groq error: 500'),
    });
  });

  it('handles Gemini error with undefined JSON response', async () => {
    storeApiKey('gemini', 'AIza_test');
    const res400 = {
      ok: false,
      status: 400,
      headers: { get: () => null },
      json: async () => undefined,
    };
    (global.fetch as any).mockResolvedValue(res400);

    await expect(sendFreeMessage('test', { provider: 'gemini' })).rejects.toMatchObject({
      code: 'PROVIDER',
      message: expect.stringContaining('Gemini error: 400'),
    });
  });

  it('handles OVH error with undefined JSON response', async () => {
    const res500 = {
      ok: false,
      status: 500,
      headers: { get: () => null },
      json: async () => undefined,
    };
    (global.fetch as any).mockResolvedValue(res500);

    await expect(sendFreeMessage('test', { provider: 'ovh-anon' })).rejects.toMatchObject({
      code: 'PROVIDER',
      message: expect.stringContaining('OVH anonymous error: 500'),
    });
  });

  it('preserves original error in cause property', async () => {
    storeApiKey('gemini', 'test_key');
    const originalError = new Error('Original error');
    (global.fetch as any).mockImplementation(() => {
      throw originalError;
    });

    try {
      await sendFreeMessage('test', { provider: 'gemini' });
      expect.fail('Should have thrown');
    } catch (err: any) {
      expect(err.cause).toBe(originalError);
    }
  });

  it('provides friendly message for unknown errors', async () => {
    storeApiKey('hf', 'hf_test');
    (global.fetch as any).mockImplementation(() => {
      throw new Error('Completely unknown error');
    });

    try {
      await sendFreeMessage('test', { provider: 'hf' });
      expect.fail('Should have thrown');
    } catch (err: any) {
      expect(err.friendlyMessage).toContain('Free path hiccup');
      expect(err.friendlyMessage).not.toMatch(/shame|stupid|idiot/i);
    }
  });

  it('wraps string errors in BanalProviderError', async () => {
    storeApiKey('groq', 'gsk_test');
    (global.fetch as any).mockImplementation(() => {
      throw 'string error';
    });

    await expect(sendFreeMessage('test', { provider: 'groq' })).rejects.toMatchObject({
      code: 'NETWORK',
      message: expect.stringContaining('Free path hiccup: string error'),
    });
  });

  it('wraps number errors in BanalProviderError', async () => {
    storeApiKey('groq', 'gsk_test');
    (global.fetch as any).mockImplementation(() => {
      throw 404;
    });

    await expect(sendFreeMessage('test', { provider: 'groq' })).rejects.toMatchObject({
      code: 'NETWORK',
      message: expect.stringContaining('Free path hiccup: 404'),
    });
  });

  it('wraps object errors without message property', async () => {
    storeApiKey('groq', 'gsk_test');
    (global.fetch as any).mockImplementation(() => {
      throw { code: 'CUSTOM_ERROR', details: 'Something went wrong' };
    });

    await expect(sendFreeMessage('test', { provider: 'groq' })).rejects.toMatchObject({
      code: 'NETWORK',
      message: expect.stringContaining('Free path hiccup'),
    });
  });

  it('wraps Error with empty message', async () => {
    storeApiKey('groq', 'gsk_test');
    (global.fetch as any).mockImplementation(() => {
      throw new Error('');
    });

    await expect(sendFreeMessage('test', { provider: 'groq' })).rejects.toMatchObject({
      code: 'NETWORK',
      message: expect.stringContaining('Free path hiccup: unknown'),
    });
  });
});
