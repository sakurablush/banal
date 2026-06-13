/**
 * Browser fetch layer for the API Playground.
 */

import {
  getPlaygroundKey,
  type PlaygroundKeyMode,
} from './keys';
import {
  classifyProviderError,
  getProviderById,
  type PlaygroundProvider,
} from './providers';
import { parseCoordinates } from './utils';
import type {
  PlaygroundChatMessage,
  PlaygroundExecutionResult,
  PlaygroundProviderId,
  PlaygroundRequest,
  PlaygroundRequestContext,
  PlaygroundResult,
  PlaygroundSettings,
  WeatherCoordinates,
} from './types';
import { PlaygroundError } from './types';

export interface PlaygroundSendOptions {
  providerId: PlaygroundProviderId;
  input: string;
  messages: PlaygroundChatMessage[];
  model?: string;
  settings: PlaygroundSettings;
  keyMode: PlaygroundKeyMode;
  signal?: AbortSignal;
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}

function headersToRecord(headers: Headers): Record<string, string> {
  const result: Record<string, string> = {};
  headers.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

function parseResponseJson(rawText: string): unknown {
  try {
    return rawText ? JSON.parse(rawText) : undefined;
  } catch {
    return undefined;
  }
}

function makeRequestSize(request: PlaygroundRequest): number {
  const body = request.redactedBody ?? request.body ?? request.url;
  return new Blob([JSON.stringify(body)]).size;
}

export async function resolveWeatherCoordinates(
  input: string,
  signal?: AbortSignal
): Promise<WeatherCoordinates> {
  const trimmed = input.trim();
  const coordinates = parseCoordinates(trimmed);
  if (coordinates) return coordinates;
  if (!trimmed) {
    throw new PlaygroundError('Enter coordinates or a city name.', {
      code: 'INVALID_INPUT',
      friendlyMessage: 'Enter coordinates like 52.52, 13.41 or a city name such as Berlin.',
    });
  }

  const url = new URL('https://geocoding-api.open-meteo.com/v1/search');
  url.searchParams.set('name', trimmed);
  url.searchParams.set('count', '1');
  url.searchParams.set('language', 'en');
  url.searchParams.set('format', 'json');

  const geocodeRequest: PlaygroundRequest = {
    url: url.toString(),
    method: 'GET',
    headers: { Accept: 'application/json' },
    redactedHeaders: { Accept: 'application/json' },
    redactedBody: { name: trimmed },
    createdAt: Date.now(),
  };
  const geocode = await executeRequest(geocodeRequest, signal);
  const data = geocode.json as Record<string, unknown>;
  const results = Array.isArray(data.results) ? data.results : [];
  const first = results[0];

  if (!first || typeof first !== 'object') {
    throw new PlaygroundError(`Open-Meteo could not find "${trimmed}".`, {
      code: 'INVALID_INPUT',
      friendlyMessage: `Open-Meteo could not find "${trimmed}". Try coordinates or a more specific city name.`,
    });
  }

  const record = first as Record<string, unknown>;
  const latitude = typeof record.latitude === 'number' ? String(record.latitude) : '';
  const longitude = typeof record.longitude === 'number' ? String(record.longitude) : '';
  const name = typeof record.name === 'string' ? record.name : undefined;

  if (!latitude || !longitude) {
    throw new PlaygroundError(`Open-Meteo returned an invalid geocode result for "${trimmed}".`, {
      code: 'INVALID_INPUT',
      friendlyMessage: `Open-Meteo returned an invalid geocode result for "${trimmed}".`,
    });
  }

  return { latitude, longitude, city: name };
}

export async function executeRequest(
  request: PlaygroundRequest,
  signal?: AbortSignal
): Promise<PlaygroundExecutionResult> {
  const startedAt = performance.now();

  try {
    const response = await fetch(request.url, {
      method: request.method,
      headers: request.headers,
      body: request.method === 'POST' ? JSON.stringify(request.body) : undefined,
      signal,
    });
    const rawText = await response.text();
    const latencyMs = Math.round(performance.now() - startedAt);

    return {
      status: response.status,
      statusText: response.statusText,
      headers: headersToRecord(response.headers),
      rawText,
      json: parseResponseJson(rawText),
      latencyMs,
      requestSizeBytes: makeRequestSize(request),
      responseSizeBytes: new Blob([rawText]).size,
    };
  } catch (error: unknown) {
    if (isAbortError(error)) {
      throw new PlaygroundError('Request cancelled.', {
        code: 'ABORTED',
        friendlyMessage: 'Cancelled. Nothing was sent after cancellation.',
      });
    }

    throw new PlaygroundError('Browser network or CORS error.', {
      code: 'CORS',
      friendlyMessage:
        'The browser could not complete this request. This usually means CORS, a network drop, or a provider that does not allow browser-origin calls.',
    });
  }
}

export async function sendPlaygroundRequest(
  options: PlaygroundSendOptions
): Promise<PlaygroundResult> {
  const provider = getProviderById(options.providerId);
  if (!provider) {
    throw new PlaygroundError(`Unknown provider "${options.providerId}".`, {
      code: 'PROVIDER_ERROR',
      friendlyMessage: 'The selected provider is not available.',
    });
  }

  const input = options.input.trim();
  if (!input) {
    throw new PlaygroundError('Enter a request before sending.', {
      code: 'INVALID_INPUT',
      friendlyMessage: 'Enter a request before sending.',
    });
  }

  if (provider.authMode === 'required') {
    const key = getPlaygroundKey(provider.id, options.keyMode);
    if (!key) {
      throw new PlaygroundError(`${provider.name} requires a key.`, {
        code: 'NO_KEY',
        friendlyMessage: `${provider.name} requires a free key. Save it in the Keys panel; it stays in this browser.`,
        providerId: provider.id,
      });
    }
    return executeProvider(provider, options, key);
  }

  if (provider.id === 'open-meteo') {
    const coordinates = await resolveWeatherCoordinates(input, options.signal);
    return executeProvider(provider, options, null, coordinates);
  }

  return executeProvider(provider, options, null);
}

async function executeProvider(
  provider: PlaygroundProvider,
  options: PlaygroundSendOptions,
  key: string | null,
  coordinates?: WeatherCoordinates
): Promise<PlaygroundResult> {
  const model = options.model || provider.defaultModel;
  const context: PlaygroundRequestContext = {
    provider,
    input: options.input,
    messages: options.messages,
    model,
    settings: options.settings,
    key,
    coordinates,
  };
  const request = provider.requestBuilder(context);
  const execution = await executeRequest(request, options.signal);
  const classification = classifyProviderError(
    execution.status,
    execution.json ?? execution.rawText,
    execution.rawText
  );

  if (!execution.status || execution.status < 200 || execution.status >= 300) {
    throw new PlaygroundError(classification.friendlyMessage, {
      code: classification.code,
      friendlyMessage: classification.friendlyMessage,
      providerId: provider.id,
      status: execution.status,
      rateLimit: classification.rateLimit,
    });
  }

  const rendered = provider.parseResponse(execution.json, execution.rawText);
  const warnings: string[] = [];
  if (provider.rateLimitHint) warnings.push(provider.rateLimitHint);
  if (classification.rateLimit?.isRateLimited && classification.rateLimit.friendlyMessage) {
    warnings.push(classification.rateLimit.friendlyMessage);
  }

  return {
    providerId: provider.id,
    providerName: provider.name,
    model,
    endpoint: request.url,
    status: execution.status,
    latencyMs: execution.latencyMs,
    request,
    execution,
    renderedText: rendered.text,
    renderedHtml: rendered.renderedHtml,
    warnings,
    rateLimit: classification.rateLimit,
    summary: rendered.summary,
    json: execution.json,
  };
}

export function getResponseSizeBytes(execution: PlaygroundExecutionResult): number {
  return execution.responseSizeBytes;
}

export function getRequestSizeBytes(request: PlaygroundRequest): number {
  const body = request.redactedBody ?? request.body ?? request.url;
  return new Blob([JSON.stringify(body)]).size;
}
