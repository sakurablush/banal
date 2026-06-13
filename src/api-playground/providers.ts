/**
 * API Playground provider registry and request builders.
 *
 * This module is intentionally declarative: providers describe their metadata,
 * build their own requests, and know how to turn provider JSON into rendered UI.
 * The chat providers use the same endpoints and key IDs as `src/providers/index.ts`
 * so localStorage credentials continue to work across chat and playground.
 */

import {
  buildWeatherText,
  parseCoordinates,
  renderMarkdown,
  renderWeatherHtml,
} from './utils';
import type {
  PlaygroundCategory,
  PlaygroundErrorCode,
  PlaygroundExecutionResult,
  PlaygroundProvider,
  PlaygroundProviderId,
  PlaygroundRequest,
  PlaygroundRequestContext,
  PlaygroundRenderedResponse,
  PlaygroundSettings,
  WeatherCoordinates,
} from './types';

export type { PlaygroundProvider } from './types';

// Keep the type name local so the registry does not depend on the chat module's
// narrower Provider union.
type PlaygroundRateLimitMetadata = {
  isRateLimited: boolean;
  retryAfterSeconds?: number;
  friendlyMessage: string;
};

export { PLAYGROUND_CATEGORY_LABELS } from './utils';

export const GROQ_MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
  'gemma2-9b-it',
];

export const HUGGINGFACE_MODELS = [
  'openai/gpt-oss-120b:fastest',
  'meta-llama/Llama-3.1-8B-Instruct',
  'Qwen/Qwen2.5-Coder-32B-Instruct',
];

export const OVH_MODELS = ['Meta-Llama-3_3-70B-Instruct', 'Mixtral-8x7B-Instruct-v0.1'];

const DEFAULT_SETTINGS: PlaygroundSettings = {
  temperature: 0.7,
  maxTokens: 512,
  forecastDays: 3,
};

function jsonSize(value: unknown): number {
  return new Blob([JSON.stringify(value ?? '')]).size;
}

function redactHeaders(headers: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [
      key,
      key.toLowerCase() === 'authorization' ? 'Bearer ••••••••' : value,
    ])
  );
}

function normalizeMessages(input: string, messages?: PlaygroundRequestContext['messages']) {
  if (messages && messages.length > 0) return messages;
  return [{ role: 'user' as const, content: input.trim() }];
}

function buildOpenAiChatRequest(
  provider: PlaygroundProvider,
  context: PlaygroundRequestContext
): PlaygroundRequest {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (context.key) {
    headers.Authorization = `Bearer ${context.key}`;
  }

  const body = {
    model: context.model,
    messages: normalizeMessages(context.input, context.messages).map((message) => ({
      role: message.role,
      content: message.content,
    })),
    temperature: context.settings.temperature,
    max_tokens: context.settings.maxTokens,
  };

  return {
    url: provider.endpoint,
    method: 'POST',
    headers,
    redactedHeaders: redactHeaders(headers),
    body,
    redactedBody: body,
    createdAt: Date.now(),
  };
}

function buildGroqRequest(context: PlaygroundRequestContext): PlaygroundRequest {
  return buildOpenAiChatRequest(context.provider, context);
}

function buildHuggingFaceRequest(context: PlaygroundRequestContext): PlaygroundRequest {
  return buildOpenAiChatRequest(context.provider, context);
}

function buildOvhRequest(context: PlaygroundRequestContext): PlaygroundRequest {
  return buildOpenAiChatRequest(context.provider, { ...context, key: null });
}

function buildOpenMeteoRequest(context: PlaygroundRequestContext): PlaygroundRequest {
  const coordinates = context.coordinates;
  if (!coordinates) {
    throw new Error('Open-Meteo coordinates are required.');
  }

  const params = new URLSearchParams({
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    current: 'temperature_2m,wind_speed_10m,weather_code',
    hourly: 'temperature_2m,precipitation_probability,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum',
    forecast_days: String(context.settings.forecastDays),
    timezone: 'auto',
    temperature_unit: 'celsius',
    wind_speed_unit: 'kmh',
  });

  const url = `${context.provider.endpoint}?${params.toString()}`;
  const headers = { Accept: 'application/json' };
  const redactedBody = Object.fromEntries(params.entries());

  return {
    url,
    method: 'GET',
    headers,
    redactedHeaders: headers,
    redactedBody,
    createdAt: Date.now(),
  };
}

function parseOpenAiChatResponse(json: unknown, _rawText: string): PlaygroundRenderedResponse {
  const data = isRecord(json) ? json : {};
  const choices = Array.isArray(data.choices) ? data.choices : [];
  const choice = choices[0];
  const message = isRecord(choice?.message) ? choice.message : {};
  const content = typeof message.content === 'string' ? message.content.trim() : '';
  const text = content || '(Provider returned no message content.)';

  return {
    text,
    renderedHtml: renderMarkdown(text),
  };
}

function readStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function readNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function parseOpenMeteoResponse(json: unknown, _rawText: string): PlaygroundRenderedResponse {
  const data = isRecord(json) ? json : {};
  const current = isRecord(data.current) ? data.current : undefined;
  const currentWeather = isRecord(data.current_weather) ? data.current_weather : undefined;
  const hourly = isRecord(data.hourly) ? data.hourly : undefined;
  const daily = isRecord(data.daily) ? data.daily : undefined;
  const elevation = data.elevation;
  const location =
    typeof elevation === 'number' ? `Elevation ${Math.round(elevation)} m` : undefined;

  const currentSummary = current
    ? {
        time: String(current.time ?? ''),
        temperature: readNumber(current.temperature_2m),
        windSpeed: readNumber(current.wind_speed_10m),
        weatherCode: readNumber(current.weather_code),
      }
    : currentWeather
      ? {
          time: String(currentWeather.time ?? ''),
          temperature: readNumber(currentWeather.temperature),
          windSpeed: readNumber(currentWeather.windspeed),
          weatherCode: readNumber(currentWeather.weathercode),
        }
      : undefined;

  const hourlyTimes = readStringArray(hourly?.time);
  const hourlyTemperatures = Array.isArray(hourly?.temperature_2m)
    ? hourly.temperature_2m
    : [];
  const hourlyPrecipitation = Array.isArray(hourly?.precipitation_probability)
    ? hourly.precipitation_probability
    : [];
  const hourlyWind = Array.isArray(hourly?.wind_speed_10m) ? hourly.wind_speed_10m : [];

  const hourlySummary = hourlyTimes
    .slice(0, 24)
    .map((time, index) => ({
      time,
      temperature: readNumber(hourlyTemperatures[index]),
      precipitationProbability: readNumber(hourlyPrecipitation[index]),
      windSpeed: readNumber(hourlyWind[index]),
    }));

  const dailyTimes = readStringArray(daily?.time);
  const dailyMax = Array.isArray(daily?.temperature_2m_max) ? daily.temperature_2m_max : [];
  const dailyMin = Array.isArray(daily?.temperature_2m_min) ? daily.temperature_2m_min : [];
  const dailyPrecipitation = Array.isArray(daily?.precipitation_sum)
    ? daily.precipitation_sum
    : [];
  const dailyWeather = Array.isArray(daily?.weather_code) ? daily.weather_code : [];

  const dailySummary = dailyTimes.map((date, index) => ({
    date,
    temperatureMax: readNumber(dailyMax[index]),
    temperatureMin: readNumber(dailyMin[index]),
    precipitationSum: readNumber(dailyPrecipitation[index]),
    weatherCode: readNumber(dailyWeather[index]),
  }));

  const summary = {
    attribution: 'Weather data by Open-Meteo.com. Non-commercial use requires attribution.',
    location,
    current: currentSummary,
    hourly: hourlySummary,
    daily: dailySummary,
  };

  return {
    text: buildWeatherText(summary),
    renderedHtml: renderWeatherHtml(summary),
    summary,
  };
}

// Export for testing
export {
  parseOpenAiChatResponse,
  parseOpenMeteoResponse,
  buildGroqRequest,
  buildHuggingFaceRequest,
  buildOvhRequest,
  buildOpenMeteoRequest,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function rateLimitFromStatus(status: number | undefined, body: unknown): PlaygroundRateLimitMetadata {
  if (status === 429) {
    return {
      isRateLimited: true,
      retryAfterSeconds: 30,
      friendlyMessage:
        'This free tier is rate-limited right now. Wait about 30 seconds, reduce retries, or try OVH anonymous for a no-key escape hatch.',
    };
  }

  const text = typeof body === 'string' ? body : JSON.stringify(body ?? '');
  const lower = text.toLowerCase();
  if (lower.includes('rate') || lower.includes('quota') || lower.includes('too many')) {
    return {
      isRateLimited: true,
      retryAfterSeconds: 45,
      friendlyMessage:
        'The provider reported a free-tier quota limit. This is normal on shared infrastructure; wait briefly or switch to another provider.',
    };
  }

  return { isRateLimited: false, friendlyMessage: '' };
}

export function classifyProviderError(
  status: number | undefined,
  body: unknown,
  rawText: string
): {
  code: PlaygroundErrorCode;
  friendlyMessage: string;
  rateLimit?: PlaygroundRateLimitMetadata;
} {
  const rateLimit = rateLimitFromStatus(status, body ?? rawText);
  if (rateLimit.isRateLimited) {
    return { code: 'RATE_LIMIT', friendlyMessage: rateLimit.friendlyMessage, rateLimit };
  }

  if (status === 401 || status === 403) {
    return {
      code: 'INVALID_KEY',
      friendlyMessage:
        'The provider rejected the key. Check that it is current and has the required permissions, then save it again.',
    };
  }

  if (!status) {
    return {
      code: 'CORS',
      friendlyMessage:
        'The browser could not complete this request. This usually means CORS, a network drop, or a provider that does not allow browser-origin calls.',
    };
  }

  if (status >= 500) {
    return {
      code: 'PROVIDER_ERROR',
      friendlyMessage:
        'The provider returned a server error. Free tiers can be fragile; retry once, then try another provider if it persists.',
    };
  }

  return {
    code: 'PROVIDER_ERROR',
    friendlyMessage: `The provider returned HTTP ${status}. Check the request preview and provider docs for the expected shape.`,
  };
}

export function getRequestSizeBytes(request: PlaygroundRequest): number {
  return jsonSize(request.redactedBody ?? request.url);
}

export function getResponseSizeBytes(execution: PlaygroundExecutionResult): number {
  return execution.responseSizeBytes;
}

export function getProviderById(providerId: PlaygroundProviderId): PlaygroundProvider | undefined {
  return PLAYGROUND_PROVIDERS.find((provider) => provider.id === providerId);
}

export function getProvidersByCategory(): Record<PlaygroundCategory, PlaygroundProvider[]> {
  return PLAYGROUND_PROVIDERS.reduce(
    (groups, provider) => {
      groups[provider.category].push(provider);
      return groups;
    },
    {
      chat: [] as PlaygroundProvider[],
      data: [] as PlaygroundProvider[],
      image: [] as PlaygroundProvider[],
      utility: [] as PlaygroundProvider[],
    }
  );
}

export function getProvidersByMode(mode: PlaygroundCategory): PlaygroundProvider[] {
  return getProvidersByCategory()[mode] || [];
}

export function getDefaultSettings(): PlaygroundSettings {
  return { ...DEFAULT_SETTINGS };
}

export function providerStatus(provider: PlaygroundProvider, hasKey: boolean): string {
  if (provider.authMode === 'none') return 'Anonymous';
  if (provider.authMode === 'optional') return 'Optional key';
  return hasKey ? 'Ready' : 'Key needed';
}

export function providerEndpointLabel(provider: PlaygroundProvider): string {
  return new URL(provider.endpoint).hostname;
}

export function parseCoordinatesOrThrow(input: string): WeatherCoordinates {
  const coordinates = parseCoordinates(input);
  if (!coordinates) {
    throw new Error('Enter latitude and longitude, for example 52.52, 13.41.');
  }
  return coordinates;
}

export const PLAYGROUND_PROVIDERS: PlaygroundProvider[] = [
  {
    id: 'groq',
    name: 'Groq',
    description: 'OpenAI-compatible chat with a free Groq key.',
    category: 'chat',
    icon: '⚡',
    color: '#f59e0b',
    authMode: 'required',
    docsUrl: 'https://console.groq.com/docs/openai-compatible',
    keyUrl: 'https://console.groq.com/keys',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    defaultModel: GROQ_MODELS[0],
    models: GROQ_MODELS,
    inputPlaceholder: 'Ask anything. Groq will use your saved free key.',
    rateLimitHint: 'Free tier limits vary by model and account.',
    note: 'Groq requires a free key. Keys stay in this browser and are never sent to Banal.',
    requestBuilder: buildGroqRequest,
    parseResponse: parseOpenAiChatResponse,
  },
  {
    id: 'huggingface',
    name: 'Hugging Face Inference Providers',
    description: 'OpenAI-compatible HF router with provider-aware model policies.',
    category: 'chat',
    icon: '🤗',
    color: '#fbbf24',
    authMode: 'required',
    docsUrl: 'https://huggingface.co/docs/inference-providers',
    keyUrl: 'https://huggingface.co/settings/tokens',
    endpoint: 'https://router.huggingface.co/v1/chat/completions',
    defaultModel: HUGGINGFACE_MODELS[0],
    models: HUGGINGFACE_MODELS,
    inputPlaceholder: 'Ask the HF Inference Providers router. Use :fastest or a model/provider policy.',
    rateLimitHint: 'HF token permissions and model routing determine availability.',
    note: 'Use a Hugging Face token with Inference Providers access. This endpoint reuses the existing HF key.',
    requestBuilder: buildHuggingFaceRequest,
    parseResponse: parseOpenAiChatResponse,
  },
  {
    id: 'ovh',
    name: 'OVHcloud AI Anonymous',
    description: 'No-key OpenAI-compatible chat with a very small anonymous quota.',
    category: 'chat',
    icon: '🇪🇺',
    color: '#3b82f6',
    authMode: 'none',
    docsUrl: 'https://endpoints.ai.cloud.ovh.net/',
    endpoint: 'https://oai.endpoints.kepler.ai.cloud.ovh.net/v1/chat/completions',
    defaultModel: OVH_MODELS[0],
    models: OVH_MODELS,
    inputPlaceholder: 'Try a no-key chat request. Keep retries gentle: about 2 RPM anonymous.',
    rateLimitHint: 'Anonymous tier is about 2 requests/min per IP per model.',
    note: 'No key required. This is the no-key escape hatch, but it is intentionally rate-limited.',
    requestBuilder: buildOvhRequest,
    parseResponse: parseOpenAiChatResponse,
  },
  {
    id: 'open-meteo',
    name: 'Open-Meteo Weather',
    description: 'No-key weather forecast API with optional city geocoding.',
    category: 'data',
    icon: '🌤️',
    color: '#22d3ee',
    authMode: 'none',
    docsUrl: 'https://open-meteo.com/en/docs',
    endpoint: 'https://api.open-meteo.com/v1/forecast',
    defaultModel: 'forecast',
    models: ['forecast'],
    inputPlaceholder: 'Coordinates or city, e.g. 52.52, 13.41 or Berlin',
    rateLimitHint: 'Free for non-commercial use with attribution.',
    note: 'Enter coordinates or a city name. Open-Meteo requires attribution for non-commercial use.',
    requestBuilder: buildOpenMeteoRequest,
    parseResponse: parseOpenMeteoResponse,
  },
];
