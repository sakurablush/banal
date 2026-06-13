/**
 * Shared types for the local-first API Playground.
 */

export type PlaygroundProviderId = 'groq' | 'huggingface' | 'ovh' | 'open-meteo';
export type PlaygroundCategory = 'chat' | 'data' | 'image' | 'utility';
export type PlaygroundAuthMode = 'none' | 'required' | 'optional';
export type PlaygroundHttpMethod = 'GET' | 'POST';

export type PlaygroundErrorCode =
  | 'NO_KEY'
  | 'INVALID_KEY'
  | 'RATE_LIMIT'
  | 'NETWORK'
  | 'CORS'
  | 'PROVIDER_ERROR'
  | 'ABORTED'
  | 'INVALID_INPUT';

export interface PlaygroundChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface PlaygroundSettings {
  temperature: number;
  maxTokens: number;
  forecastDays: number;
}

export interface WeatherCoordinates {
  latitude: string;
  longitude: string;
  city?: string;
}

export interface PlaygroundRequest {
  url: string;
  method: PlaygroundHttpMethod;
  headers: Record<string, string>;
  redactedHeaders: Record<string, string>;
  body?: unknown;
  redactedBody?: unknown;
  createdAt: number;
}

export interface PlaygroundExecutionResult {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  rawText: string;
  json: unknown;
  latencyMs: number;
  requestSizeBytes: number;
  responseSizeBytes: number;
}

export interface RateLimitMetadata {
  isRateLimited: boolean;
  retryAfterSeconds?: number;
  friendlyMessage: string;
}

export interface WeatherSummary {
  attribution: string;
  location?: string;
  current?: {
    time: string;
    temperature: number;
    windSpeed: number;
    weatherCode: number;
  };
  hourly?: Array<{
    time: string;
    temperature: number;
    precipitationProbability: number;
    windSpeed: number;
  }>;
  daily?: Array<{
    date: string;
    temperatureMax: number;
    temperatureMin: number;
    precipitationSum: number;
    weatherCode: number;
  }>;
}

export interface PlaygroundRenderedResponse {
  text: string;
  renderedHtml: string;
  summary?: WeatherSummary;
}

export interface PlaygroundResult {
  providerId: PlaygroundProviderId;
  providerName: string;
  model: string;
  endpoint: string;
  status: number;
  latencyMs: number;
  request: PlaygroundRequest;
  execution: PlaygroundExecutionResult;
  renderedText: string;
  renderedHtml: string;
  warnings: string[];
  rateLimit?: RateLimitMetadata;
  summary?: WeatherSummary;
  json?: unknown;
}

export interface PlaygroundRequestContext {
  provider: PlaygroundProvider;
  input: string;
  messages: PlaygroundChatMessage[];
  model: string;
  settings: PlaygroundSettings;
  key?: string | null;
  coordinates?: WeatherCoordinates;
}

export interface PlaygroundProvider {
  id: PlaygroundProviderId;
  name: string;
  description: string;
  category: PlaygroundCategory;
  icon: string;
  color: string;
  authMode: PlaygroundAuthMode;
  docsUrl: string;
  keyUrl?: string;
  endpoint: string;
  defaultModel: string;
  models: string[];
  inputPlaceholder: string;
  rateLimitHint: string;
  note: string;
  requestBuilder: (context: PlaygroundRequestContext) => PlaygroundRequest;
  parseResponse: (json: unknown, rawText: string) => PlaygroundRenderedResponse;
}

export interface PlaygroundErrorInfo {
  code: PlaygroundErrorCode;
  friendlyMessage?: string;
  providerId?: PlaygroundProviderId;
  status?: number;
  rateLimit?: RateLimitMetadata;
}

export class PlaygroundError extends Error {
  readonly code: PlaygroundErrorCode;
  readonly friendlyMessage?: string;
  readonly providerId?: PlaygroundProviderId;
  readonly status?: number;
  readonly rateLimit?: RateLimitMetadata;

  constructor(message: string, info: PlaygroundErrorInfo) {
    super(message);
    this.name = 'PlaygroundError';
    this.code = info.code;
    if (info.friendlyMessage !== undefined) this.friendlyMessage = info.friendlyMessage;
    if (info.providerId !== undefined) this.providerId = info.providerId;
    if (info.status !== undefined) this.status = info.status;
    if (info.rateLimit !== undefined) this.rateLimit = info.rateLimit;
  }
}

export type PlaygroundResponseTab = 'rendered' | 'json' | 'request' | 'logs';
export type PlaygroundKeyMode = 'persistent' | 'session';

export interface PlaygroundHistoryItem {
  id: string;
  providerId: PlaygroundProviderId;
  model: string;
  latencyMs: number;
  status: number;
  createdAt: number;
  summary: string;
}
