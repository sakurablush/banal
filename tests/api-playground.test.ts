/**
 * Exhaustive tests for API Playground modules.
 * Tests request builders, key storage, parsers, error classification, and client.
 */
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  buildGroqRequest,
  buildHuggingFaceRequest,
  buildOvhRequest,
  buildOpenMeteoRequest,
  parseOpenAiChatResponse,
  parseOpenMeteoResponse,
  getProvidersByMode,
  getProvidersByCategory,
  getDefaultSettings,
  providerStatus,
  classifyProviderError,
  PLAYGROUND_PROVIDERS,
} from '../src/api-playground/providers';
import {
  getPlaygroundKey,
  setPlaygroundKey,
  clearPlaygroundKey,
  clearAllPlaygroundKeys,
  hasPlaygroundKey,
  getSavedKeyMask,
} from '../src/api-playground/keys';
import {
  escapeHtml,
  formatBytes,
  formatMs,
  parseCoordinates,
  weatherCodeLabel,
  buildWeatherText,
  maskKey,
  renderMarkdown,
  PLAYGROUND_CATEGORY_LABELS,
} from '../src/api-playground/utils';
import {
  sendPlaygroundRequest,
  executeRequest,
  resolveWeatherCoordinates,
  getResponseSizeBytes,
  getRequestSizeBytes as clientGetRequestSizeBytes,
} from '../src/api-playground/client';
import { PlaygroundError } from '../src/api-playground/types';

const mockFetch = vi.fn();

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  vi.clearAllMocks();
  // @ts-ignore - test mock of global
  global.fetch = mockFetch;
});

afterEach(() => {
  // @ts-ignore - restore global mock
  global.fetch = undefined;
});

describe('API Playground Types', () => {
  it('defines correct provider IDs', () => {
    expect(PLAYGROUND_PROVIDERS.map((p) => p.id)).toContain('groq');
    expect(PLAYGROUND_PROVIDERS.map((p) => p.id)).toContain('huggingface');
    expect(PLAYGROUND_PROVIDERS.map((p) => p.id)).toContain('ovh');
    expect(PLAYGROUND_PROVIDERS.map((p) => p.id)).toContain('open-meteo');
  });

  it('has valid category labels', () => {
    expect(PLAYGROUND_CATEGORY_LABELS.chat).toBe('Chat');
    expect(PLAYGROUND_CATEGORY_LABELS.data).toBe('Data');
    expect(PLAYGROUND_CATEGORY_LABELS.image).toBe('Image');
    expect(PLAYGROUND_CATEGORY_LABELS.utility).toBe('Utility');
  });
});

describe('API Playground Providers', () => {
  describe('getProvidersByMode', () => {
    it('returns chat providers', () => {
      const chatProviders = getProvidersByMode('chat');
      expect(chatProviders.length).toBe(3);
      expect(chatProviders.map((p) => p.id)).toEqual(
        expect.arrayContaining(['groq', 'huggingface', 'ovh'])
      );
    });

    it('returns data providers', () => {
      const dataProviders = getProvidersByMode('data');
      expect(dataProviders.length).toBe(1);
      expect(dataProviders[0].id).toBe('open-meteo');
    });

    it('returns empty arrays for image and utility', () => {
      expect(getProvidersByMode('image')).toEqual([]);
      expect(getProvidersByMode('utility')).toEqual([]);
    });
  });

  describe('getProvidersByCategory', () => {
    it('groups providers by category', () => {
      const categories = getProvidersByCategory();
      expect(categories.chat.length).toBe(3);
      expect(categories.data.length).toBe(1);
      expect(categories.image.length).toBe(0);
      expect(categories.utility.length).toBe(0);
    });
  });

  describe('getDefaultSettings', () => {
    it('returns default settings with expected values', () => {
      const settings = getDefaultSettings();
      expect(settings.temperature).toBe(0.7);
      expect(settings.maxTokens).toBe(512);
      expect(settings.forecastDays).toBe(3);
    });

    it('returns a new object each time (not shared reference)', () => {
      const s1 = getDefaultSettings();
      const s2 = getDefaultSettings();
      s1.temperature = 1.0;
      expect(s2.temperature).toBe(0.7);
    });
  });

  describe('providerStatus', () => {
    it('returns Anonymous for providers with no auth', () => {
      const ovh = PLAYGROUND_PROVIDERS.find((p) => p.id === 'ovh');
      expect(providerStatus(ovh!, false)).toBe('Anonymous');
    });

    it('returns Ready when key is present', () => {
      const groq = PLAYGROUND_PROVIDERS.find((p) => p.id === 'groq');
      expect(providerStatus(groq!, true)).toBe('Ready');
    });

    it('returns Key needed when key is missing for required provider', () => {
      const groq = PLAYGROUND_PROVIDERS.find((p) => p.id === 'groq');
      expect(providerStatus(groq!, false)).toBe('Key needed');
    });
  });

  describe('Request builders', () => {
    const groqProvider = PLAYGROUND_PROVIDERS.find((p) => p.id === 'groq')!;
    const hfProvider = PLAYGROUND_PROVIDERS.find((p) => p.id === 'huggingface')!;
    const ovhProvider = PLAYGROUND_PROVIDERS.find((p) => p.id === 'ovh')!;
    const openMeteoProvider = PLAYGROUND_PROVIDERS.find((p) => p.id === 'open-meteo')!;

    const mockContext = {
      input: 'test input',
      messages: [{ role: 'user' as const, content: 'test input' }],
      model: 'test-model',
      settings: { temperature: 0.7, maxTokens: 512, forecastDays: 3 },
    };

    it('builds Groq request with Authorization header', () => {
      const context = {
        ...mockContext,
        provider: groqProvider,
        key: 'gsk_test_key',
      };
      const request = buildGroqRequest(context as any);
      expect(request.url).toContain('api.groq.com');
      expect(request.headers.Authorization).toBe('Bearer gsk_test_key');
      expect(request.headers['Content-Type']).toBe('application/json');
      expect(request.redactedHeaders.Authorization).toBe('Bearer ••••••••');
    });

    it('builds HuggingFace request with Authorization header', () => {
      const context = {
        ...mockContext,
        provider: hfProvider,
        key: 'hf_test_token',
      };
      const request = buildHuggingFaceRequest(context as any);
      expect(request.url).toContain('router.huggingface.co');
      expect(request.headers.Authorization).toBe('Bearer hf_test_token');
    });

    it('builds OVH request without key (anonymous)', () => {
      const context = {
        ...mockContext,
        provider: ovhProvider,
      };
      const request = buildOvhRequest(context as any);
      expect(request.url).toContain('oai.endpoints.kepler');
      expect(request.headers.Authorization).toBeUndefined();
    });

    it('builds Open-Meteo request with correct parameters', () => {
      const context = {
        ...mockContext,
        provider: openMeteoProvider,
        coordinates: { latitude: '52.52', longitude: '13.41' },
      };
      const request = buildOpenMeteoRequest(context as any);
      expect(request.url).toContain('api.open-meteo.com');
      expect(request.url).toContain('latitude=52.52');
      expect(request.url).toContain('longitude=13.41');
      expect(request.url).toContain('forecast_days=3');
    });

    it('throws error when building Open-Meteo without coordinates', () => {
      expect(() =>
        buildOpenMeteoRequest({ ...mockContext, provider: openMeteoProvider } as any)
      ).toThrow('coordinates are required');
    });

    it('builds request with correct body structure', () => {
      const context = {
        ...mockContext,
        provider: groqProvider,
        key: 'test-key',
      };
      const request = buildGroqRequest(context as any);
      expect((request.body as any).model).toBe('test-model');
      expect((request.body as any).messages).toHaveLength(1);
      expect((request.body as any).temperature).toBe(0.7);
      expect((request.body as any).max_tokens).toBe(512);
    });
  });

  describe('Response parsers', () => {
    it('parses OpenAI chat response with content', () => {
      const json = {
        choices: [{ message: { content: 'Hello, world!' } }],
      };
      const result = parseOpenAiChatResponse(json, '');
      expect(result.text).toBe('Hello, world!');
      expect(result.renderedHtml).toBeDefined();
    });

    it('handles empty choices in OpenAI response', () => {
      const json = { choices: [] };
      const result = parseOpenAiChatResponse(json, '');
      expect(result.text).toContain('no message content');
    });

    it('handles missing choices in OpenAI response', () => {
      const result = parseOpenAiChatResponse({}, '');
      expect(result.text).toContain('no message content');
    });

    it('parses Open-Meteo response with current weather', () => {
      const json = {
        latitude: 52.52,
        longitude: 13.41,
        elevation: 45,
        current: {
          time: '2024-01-01T12:00',
          temperature_2m: 15.5,
          wind_speed_10m: 12.3,
          weather_code: 0, // Clear sky
        },
        hourly: {
          time: ['12:00', '13:00'],
          temperature_2m: [15, 16],
          precipitation_probability: [0, 10],
          wind_speed_10m: [12, 11],
        },
        daily: {
          time: ['2024-01-01'],
          temperature_2m_max: [18],
          temperature_2m_min: [5],
          precipitation_sum: [0],
          weather_code: [1],
        },
      };
      const result = parseOpenMeteoResponse(json, '');
      expect(result.text).toContain('Clear sky');
      expect(result.summary).toBeDefined();
      expect(result.summary?.current).toBeDefined();
      expect(result.summary?.hourly).toHaveLength(2);
      expect(result.summary?.daily).toHaveLength(1);
    });

    it('handles missing current weather in Open-Meteo response', () => {
      const json = {
        daily: {
          time: ['2024-01-01'],
          temperature_2m_max: [18],
          temperature_2m_min: [5],
          precipitation_sum: [0],
          weather_code: [1],
        },
      };
      const result = parseOpenMeteoResponse(json, '');
      expect(result.text).toContain('Open-Meteo forecast');
    });

    it('handles current_weather legacy format in Open-Meteo response', () => {
      const json = {
        current_weather: {
          time: '2024-01-01T12:00',
          temperature: 15,
          windspeed: 10,
          weathercode: 2,
        },
      };
      const result = parseOpenMeteoResponse(json, '');
      expect(result.text).toContain('Partly cloudy');
    });
  });

  describe('classifyProviderError', () => {
    it('classifies 429 as RATE_LIMIT', () => {
      const result = classifyProviderError(429, {}, '');
      expect(result.code).toBe('RATE_LIMIT');
      expect(result.rateLimit?.isRateLimited).toBe(true);
    });

    it('classifies 401 as INVALID_KEY', () => {
      const result = classifyProviderError(401, {}, '');
      expect(result.code).toBe('INVALID_KEY');
    });

    it('classifies 403 as INVALID_KEY', () => {
      const result = classifyProviderError(403, {}, '');
      expect(result.code).toBe('INVALID_KEY');
    });

    it('classifies missing status as CORS', () => {
      const result = classifyProviderError(undefined, {}, '');
      expect(result.code).toBe('CORS');
    });

    it('classifies 5xx as PROVIDER_ERROR', () => {
      const result = classifyProviderError(500, {}, '');
      expect(result.code).toBe('PROVIDER_ERROR');
    });

    it('classifies 4xx as PROVIDER_ERROR', () => {
      const result = classifyProviderError(400, {}, '');
      expect(result.code).toBe('PROVIDER_ERROR');
    });

    it('detects rate limit keywords in body', () => {
      const result = classifyProviderError(400, 'rate limit exceeded', '');
      expect(result.code).toBe('RATE_LIMIT');
    });

    it('detects quota keywords in body', () => {
      const result = classifyProviderError(400, 'quota exceeded', '');
      expect(result.code).toBe('RATE_LIMIT');
    });
  });
});

describe('API Playground Utils', () => {
  describe('escapeHtml', () => {
    it('escapes HTML special characters', () => {
      expect(escapeHtml('<script>alert("XSS")')).toBe('&lt;script&gt;alert(&quot;XSS&quot;)');
      expect(escapeHtml("a'b'c")).toBe('a&#39;b&#39;c');
      expect(escapeHtml('a & b')).toBe('a &amp; b');
    });

    it('handles non-string values', () => {
      expect(escapeHtml(null)).toBe('');
      expect(escapeHtml(undefined)).toBe('');
      expect(escapeHtml(123)).toBe('123');
    });
  });

  describe('maskKey', () => {
    it('masks short keys', () => {
      expect(maskKey('ab12')).toBe('ab••••12');
    });

    it('masks long keys', () => {
      expect(maskKey('gsk_test_key_12345')).toContain('••••');
      expect(maskKey('gsk_test_key_12345')).not.toContain('test_key_12345');
    });

    it('trims input before masking', () => {
      expect(maskKey('  gsk_test  ')).toContain('••••');
    });
  });

  describe('formatBytes', () => {
    it('formats bytes correctly', () => {
      expect(formatBytes(0)).toBe('0 B');
      expect(formatBytes(512)).toBe('512 B');
      expect(formatBytes(1024)).toBe('1.0 KB');
      expect(formatBytes(1536)).toBe('1.5 KB');
      expect(formatBytes(1048576)).toBe('1.0 MB');
    });
  });

  describe('formatMs', () => {
    it('formats milliseconds correctly', () => {
      expect(formatMs(0)).toBe('0 ms');
      expect(formatMs(1500)).toBe('1500 ms');
      expect(formatMs(999)).toBe('999 ms');
    });

    it('handles negative values', () => {
      expect(formatMs(-100)).toBe('0 ms');
    });
  });

  describe('parseCoordinates', () => {
    it('parses valid coordinates', () => {
      expect(parseCoordinates('52.52, 13.41')).toEqual({ latitude: '52.52', longitude: '13.41' });
      expect(parseCoordinates('-33.87, 151.21')).toEqual({
        latitude: '-33.87',
        longitude: '151.21',
      });
      expect(parseCoordinates('52.52 13.41')).toEqual({ latitude: '52.52', longitude: '13.41' });
    });

    it('returns null for invalid coordinates', () => {
      expect(parseCoordinates('invalid')).toBeNull();
      expect(parseCoordinates('91, 0')).toBeNull();
      expect(parseCoordinates('0, 181')).toBeNull();
      expect(parseCoordinates('')).toBeNull();
    });
  });

  describe('weatherCodeLabel', () => {
    it('returns correct labels for weather codes', () => {
      expect(weatherCodeLabel(0)).toBe('Clear sky');
      expect(weatherCodeLabel(1)).toBe('Partly cloudy');
      expect(weatherCodeLabel(3)).toBe('Partly cloudy');
      // fog is 45-48 in Open-Meteo, 10-48 is fog per implementation
      expect(weatherCodeLabel(45)).toBe('Fog');
      expect(weatherCodeLabel(60)).toBe('Rain');
      expect(weatherCodeLabel(80)).toBe('Rain showers');
      expect(weatherCodeLabel(95)).toBe('Thunderstorm');
    });
  });

  describe('buildWeatherText', () => {
    it('builds weather summary text', () => {
      const summary = {
        attribution: 'Weather data by Open-Meteo.com.',
        location: 'Elevation 45 m',
        current: {
          time: '2024-01-01T12:00',
          temperature: 15,
          windSpeed: 10,
          weatherCode: 1,
        },
        daily: [
          {
            date: '2024-01-01',
            temperatureMax: 18,
            temperatureMin: 5,
            precipitationSum: 0,
            weatherCode: 1,
          },
        ],
      };
      const result = buildWeatherText(summary);
      expect(result).toContain('Elevation 45 m');
      expect(result).toContain('Partly cloudy');
    });

    it('handles missing summary', () => {
      expect(buildWeatherText()).toBe('No weather summary available.');
    });
  });

  describe('renderMarkdown', () => {
    it('escapes and formats markdown', () => {
      const result = renderMarkdown('**bold** and *italic*');
      expect(result).toContain('<strong>bold</strong>');
      expect(result).toContain('<em>italic</em>');
    });

    it('handles code blocks', () => {
      const result = renderMarkdown('```js\nconst x = 1;\n```');
      expect(result).toContain('<pre><code>');
    });

    it('handles inline code', () => {
      const result = renderMarkdown('use `const` keyword');
      expect(result).toContain('<code>const</code>');
    });
  });
});

describe('API Playground Keys', () => {
  describe('Persistent storage (localStorage)', () => {
    it('stores and retrieves keys for groq', () => {
      setPlaygroundKey('groq', 'gsk_real_key');
      expect(getPlaygroundKey('groq', 'persistent')).toBe('gsk_real_key');
      expect(hasPlaygroundKey('groq')).toBe(true);
    });

    it('stores and retrieves keys for huggingface', () => {
      setPlaygroundKey('huggingface', 'hf_token');
      expect(getPlaygroundKey('huggingface', 'persistent')).toBe('hf_token');
    });

    it('does not store keys for open-meteo (no key needed)', () => {
      setPlaygroundKey('open-meteo', 'fake_key');
      expect(getPlaygroundKey('open-meteo', 'persistent')).toBeNull();
      expect(hasPlaygroundKey('open-meteo')).toBe(false);
    });

    it('clears individual keys', () => {
      setPlaygroundKey('groq', 'gsk_key');
      setPlaygroundKey('huggingface', 'hf_key');
      clearPlaygroundKey('groq');
      expect(getPlaygroundKey('groq')).toBeNull();
      expect(getPlaygroundKey('huggingface')).toBe('hf_key');
    });

    it('clears all keys', () => {
      setPlaygroundKey('groq', 'gsk_key');
      setPlaygroundKey('huggingface', 'hf_key');
      setPlaygroundKey('ovh', 'ovh_key');
      clearAllPlaygroundKeys('persistent');
      expect(getPlaygroundKey('groq')).toBeNull();
      expect(getPlaygroundKey('huggingface')).toBeNull();
      expect(getPlaygroundKey('ovh')).toBeNull();
    });

    it('ignores empty keys', () => {
      setPlaygroundKey('groq', '');
      expect(getPlaygroundKey('groq')).toBeNull();
    });

    it('ignores whitespace keys', () => {
      setPlaygroundKey('groq', '   ');
      expect(getPlaygroundKey('groq')).toBeNull();
    });
  });

  describe('Session storage', () => {
    it('stores in sessionStorage when mode is session', () => {
      setPlaygroundKey('groq', 'session_key', 'session');
      expect(sessionStorage.getItem('banal-api-keys-session-v1')).toContain('session_key');
    });

    it('retrieves from sessionStorage when mode is session', () => {
      setPlaygroundKey('groq', 'session_key', 'session');
      expect(getPlaygroundKey('groq', 'session')).toBe('session_key');
    });

    it('distinguishes between session and persistent modes', () => {
      setPlaygroundKey('groq', 'persistent_key', 'persistent');
      setPlaygroundKey('groq', 'session_key', 'session');
      expect(getPlaygroundKey('groq', 'persistent')).toBe('persistent_key');
      expect(getPlaygroundKey('groq', 'session')).toBe('session_key');
    });
  });

  describe('getSavedKeyMask', () => {
    it('returns masked key', () => {
      setPlaygroundKey('groq', 'gsk_test_12345');
      expect(getSavedKeyMask('groq')).toContain('••••');
      expect(getSavedKeyMask('groq')).not.toContain('gsk_test_12345');
    });

    it('returns empty string when no key', () => {
      expect(getSavedKeyMask('groq')).toBe('');
    });
  });
});

describe('API Playground Client', () => {
  describe('executeRequest', () => {
    it('executes successful request', async () => {
      mockFetch.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        headers: new Headers(),
        text: async () => '{"result": "success"}',
      } as any);

      const request = {
        url: 'https://api.example.com/endpoint',
        method: 'GET' as const,
        headers: { Accept: 'application/json' },
        redactedHeaders: { Accept: 'application/json' },
        redactedBody: {},
        createdAt: Date.now(),
      };

      const result = await executeRequest(request);
      expect(result.status).toBe(200);
      expect(result.json).toEqual({ result: 'success' });
      expect(result.latencyMs).toBeGreaterThanOrEqual(0);
    });

    it('handles abort signal', async () => {
      const controller = new AbortController();
      controller.abort();

      mockFetch.mockRejectedValue(Object.assign(new Error('Aborted'), { name: 'AbortError' }));

      const request = {
        url: 'https://api.example.com/endpoint',
        method: 'GET' as const,
        headers: {},
        redactedHeaders: {},
        redactedBody: {},
        createdAt: Date.now(),
      };

      await expect(executeRequest(request, controller.signal)).rejects.toThrow();
    });
  });

  describe('resolveWeatherCoordinates', () => {
    it('returns coordinates if already in coordinate format', async () => {
      const result = await resolveWeatherCoordinates('52.52, 13.41');
      expect(result).toEqual({ latitude: '52.52', longitude: '13.41' });
    });

    it('geocodes city names via Open-Meteo geocoding API', async () => {
      // The executeRequest calls response.text() then parses it, so we need to mock accordingly
      mockFetch.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        ok: true,
        headers: new Headers(),
        text: async () =>
          JSON.stringify({
            results: [{ latitude: 52.52, longitude: 13.41, name: 'Berlin' }],
          }),
      } as any);

      const result = await resolveWeatherCoordinates('Berlin');
      expect(result?.latitude).toBe('52.52');
      expect(result?.longitude).toBe('13.41');
      expect(result?.city).toBe('Berlin');
    });

    it('throws error for unknown city', async () => {
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers(),
        text: async () => '',
        json: async () => ({ results: [] }),
      } as any);

      await expect(resolveWeatherCoordinates('UnknownCity123')).rejects.toThrow();
    });
  });

  describe('sendPlaygroundRequest', () => {
    it('throws error for unknown provider', async () => {
      await expect(
        sendPlaygroundRequest({
          providerId: 'nonexistent' as any,
          input: 'test',
          messages: [],
          settings: getDefaultSettings(),
          keyMode: 'persistent',
        })
      ).rejects.toThrow();
    });

    it('throws INVALID_INPUT for empty input', async () => {
      await expect(
        sendPlaygroundRequest({
          providerId: 'groq',
          input: '',
          messages: [],
          settings: getDefaultSettings(),
          keyMode: 'persistent',
        })
      ).rejects.toMatchObject({
        code: 'INVALID_INPUT',
      });
    });

    it('throws NO_KEY when key is required but missing', async () => {
      await expect(
        sendPlaygroundRequest({
          providerId: 'groq',
          input: 'test',
          messages: [],
          settings: getDefaultSettings(),
          keyMode: 'persistent',
        })
      ).rejects.toMatchObject({
        code: 'NO_KEY',
        providerId: 'groq',
      });
    });

    it('successfully sends request to OVH (no key required)', async () => {
      mockFetch.mockResolvedValue({
        status: 200,
        statusText: 'OK',
        ok: true,
        headers: new Headers(),
        text: async () => '{"choices": [{"message": {"content": "OVH response"}}]}',
      } as any);

      const result = await sendPlaygroundRequest({
        providerId: 'ovh',
        input: 'test',
        messages: [],
        settings: getDefaultSettings(),
        keyMode: 'persistent',
      });

      expect(result.status).toBe(200);
      expect(result.providerName).toBe('OVHcloud AI Anonymous');
      expect(result.renderedText).toBe('OVH response');
    });
  });

  describe('getRequestSizeBytes / getResponseSizeBytes', () => {
    it('calculates request size correctly', () => {
      const request = {
        url: 'https://api.example.com',
        method: 'POST' as const,
        headers: {},
        redactedHeaders: {},
        body: { test: 'data' },
        redactedBody: {},
        createdAt: Date.now(),
      };
      const size = clientGetRequestSizeBytes(request);
      expect(size).toBeGreaterThan(0);
    });

    it('calculates response size correctly', () => {
      const execution = {
        status: 200,
        statusText: 'OK',
        headers: {},
        rawText: '{"test": "data"}',
        json: { test: 'data' },
        latencyMs: 100,
        requestSizeBytes: 50,
        responseSizeBytes: 25,
      };
      expect(getResponseSizeBytes(execution)).toBe(25);
    });
  });
});

describe('API Playground Error Types', () => {
  it('creates PlaygroundError with all properties', () => {
    const error = new PlaygroundError('Test error', {
      code: 'RATE_LIMIT',
      friendlyMessage: 'Rate limited',
      providerId: 'groq',
      status: 429,
    });
    expect(error.message).toBe('Test error');
    expect(error.code).toBe('RATE_LIMIT');
    expect(error.friendlyMessage).toBe('Rate limited');
    expect(error.providerId).toBe('groq');
    expect(error.status).toBe(429);
  });

  it('creates PlaygroundError without optional properties', () => {
    const error = new PlaygroundError('Test error', {
      code: 'INVALID_INPUT',
    });
    expect(error.message).toBe('Test error');
    expect(error.code).toBe('INVALID_INPUT');
    expect(error.friendlyMessage).toBeUndefined();
    expect(error.providerId).toBeUndefined();
  });
});
