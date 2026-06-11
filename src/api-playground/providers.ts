/**
 * Banal AI — API Playground
 * Test free APIs directly in the browser without leaving the site.
 * Zero cost, zero signup friction (where possible).
 */

export interface PlaygroundProvider {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  rateLimit: string;
  requiresKey: boolean;
  keyUrl?: string;
  endpoint: string;
  method: 'GET' | 'POST';
  headers?: Record<string, string>;
  bodyTemplate?: (input: string) => Record<string, unknown>;
  inputPlaceholder: string;
  outputFormat: 'text' | 'markdown' | 'json';
  category: 'chat' | 'image' | 'search' | 'data';
}

export const PLAYGROUND_PROVIDERS: PlaygroundProvider[] = [
  {
    id: 'groq',
    name: 'Groq',
    description: 'Blazingly fast LLM inference. Free tier with generous rate limits.',
    icon: '⚡',
    color: '#f59e0b',
    rateLimit: '30 req/min free',
    requiresKey: true,
    keyUrl: 'https://console.groq.com/keys',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    bodyTemplate: (input: string) => ({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: input }],
      max_tokens: 512,
    }),
    inputPlaceholder: 'Ask anything... (Groq free tier)',
    outputFormat: 'markdown',
    category: 'chat',
  },
  {
    id: 'huggingface',
    name: 'Hugging Face Inference',
    description: 'Free API access to thousands of open models.',
    icon: '🤗',
    color: '#fbbf24',
    rateLimit: '~100 req/day free',
    requiresKey: true,
    keyUrl: 'https://huggingface.co/settings/tokens',
    endpoint: 'https://api-inference.huggingface.co/models/meta-llama/Llama-3.1-8B-Instruct',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    bodyTemplate: (input: string) => ({
      inputs: input,
      parameters: { max_new_tokens: 256, temperature: 0.7 },
    }),
    inputPlaceholder: 'Try Llama 3.1 8B (free on HF)...',
    outputFormat: 'text',
    category: 'chat',
  },
  {
    id: 'pollinations-text',
    name: 'Pollinations Text',
    description: 'Free text generation API. No key required. May be rate-limited.',
    icon: '🌱',
    color: '#4ade80',
    rateLimit: 'Free, rate-limited',
    requiresKey: false,
    endpoint: 'https://text.pollinations.ai/',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    bodyTemplate: (input: string) => ({
      messages: [{ role: 'user', content: input }],
      model: 'openai',
      temperature: 0.7,
    }),
    inputPlaceholder: 'Free text generation — no API key needed (may be rate-limited)',
    outputFormat: 'text',
    category: 'chat',
  },
  {
    id: 'pollinations-image',
    name: 'Pollinations Image',
    description: 'Free image generation. Describe what you want to see.',
    icon: '🎨',
    color: '#a855f7',
    rateLimit: 'Free, generous',
    requiresKey: false,
    endpoint: 'https://image.pollinations.ai/prompt/',
    method: 'GET',
    bodyTemplate: (_input: string) => ({}),
    inputPlaceholder: 'Describe an image (e.g. "a cyberpunk cat in neon Tokyo")',
    outputFormat: 'text',
    category: 'image',
  },
  {
    id: 'ovh-anon',
    name: 'OVHcloud AI (Anonymous)',
    description: 'Free LLM inference. No key required. EU-hosted. Very rate-limited (2 RPM).',
    icon: '🇪🇺',
    color: '#3b82f6',
    rateLimit: '2 req/min per IP',
    requiresKey: false,
    endpoint: 'https://oai.endpoints.kepler.ai.cloud.ovh.net/v1/chat/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    bodyTemplate: (input: string) => ({
      model: 'Meta-Llama-3_3-70B-Instruct',
      messages: [{ role: 'user', content: input }],
      temperature: 0.7,
      max_tokens: 512,
    }),
    inputPlaceholder: 'Free LLM — no key, but very rate-limited (2 req/min)',
    outputFormat: 'markdown',
    category: 'chat',
  },
  {
    id: 'open-meteo',
    name: 'Open-Meteo Weather',
    description: 'Free weather API for any location. No key needed.',
    icon: '🌤️',
    color: '#22d3ee',
    rateLimit: 'Free, no key',
    requiresKey: false,
    endpoint: 'https://api.open-meteo.com/v1/forecast',
    method: 'GET',
    bodyTemplate: (input: string) => {
      // Parse lat,lon from input or use default
      const parts = input.split(',').map((s) => s.trim());
      const lat = parts[0] || '52.52';
      const lon = parts[1] || '13.41';
      return {
        latitude: lat,
        longitude: lon,
        current_weather: true,
      };
    },
    inputPlaceholder: 'Lat, Lon (e.g. 52.52, 13.41) or city name',
    outputFormat: 'json',
    category: 'data',
  },
];

export type PlaygroundCategory = PlaygroundProvider['category'];

export function getProvidersByCategory(): Record<PlaygroundCategory, PlaygroundProvider[]> {
  const grouped: Record<string, PlaygroundProvider[]> = {};
  for (const provider of PLAYGROUND_PROVIDERS) {
    const cat = provider.category;
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(provider);
  }
  return grouped as Record<PlaygroundCategory, PlaygroundProvider[]>;
}
