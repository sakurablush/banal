/**
 * Inference Providers — API services for running AI models with free tiers.
 * Core data for the Inference Providers section.
 */

import type { InferenceProvider } from '../types/tool';

export const inferenceProviders: InferenceProvider[] = [
  {
    id: 'google-ai-studio',
    name: 'Google AI Studio',
    url: 'https://aistudio.google.com/',
    freeTier: {
      tokensPerDay: 'Effectively unlimited',
      requestsPerDay: '1,000-1,500',
      requiresCard: false,
      requiresSignup: true,
      limits: 'Gemini Flash: 15 RPM, 1M TPM; Gemini Pro: 2 RPM',
    },
    topFreeModels: ['Gemini 2.5 Flash', 'Gemini 2.5 Pro', 'Gemma 4'],
    apiFormat: 'custom',
    quality: { speed: 'fast', reliability: 'high' },
    bestFor: 'Effectively unlimited Gemini access with generous free quotas',
    caveat: 'Requires Google account. Free usage may improve Google services.',
    lastVerified: '2026-06-14',
  },
  {
    id: 'cerebras',
    name: 'Cerebras Inference',
    url: 'https://cloud.cerebras.ai/',
    freeTier: {
      tokensPerDay: '1,000,000',
      requestsPerDay: '14,400',
      requiresCard: false,
      requiresSignup: true,
      limits: '1M tokens/day, 14.4K requests/day for selected models',
    },
    topFreeModels: ['Qwen3 235B Instruct', 'Llama 3.3 70B', 'DeepSeek R1 Distill 70B'],
    apiFormat: 'openai-compatible',
    quality: { speed: 'ultra-fast', reliability: 'high' },
    bestFor: 'Highest daily token budget (1M tokens/day) with ultra-fast inference',
    caveat: 'Model selection limited on free tier. Quotas may change.',
    lastVerified: '2026-06-14',
  },
  {
    id: 'groq',
    name: 'Groq',
    url: 'https://console.groq.com/',
    freeTier: {
      tokensPerDay: '500K-1M',
      requestsPerDay: '1,000-14,400',
      requiresCard: false,
      requiresSignup: true,
      limits: '6K TPM, 14.4K req/day (varies by model)',
    },
    topFreeModels: ['Llama 4 Scout', 'Llama 4 Maverick', 'Qwen3 235B', 'DeepSeek R1'],
    apiFormat: 'openai-compatible',
    quality: { speed: 'ultra-fast', reliability: 'high' },
    bestFor: 'Lightning-fast inference on open-source models via custom LPU hardware',
    caveat: 'Rate limits vary by model and organization. Context limits on some models.',
    lastVerified: '2026-06-14',
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    url: 'https://console.mistral.ai/',
    freeTier: {
      tokensPerDay: '~1B tokens/month',
      requestsPerDay: '500K tok/min',
      requiresCard: false,
      requiresSignup: true,
      limits: '~1B tokens/month, phone verification required',
    },
    topFreeModels: ['Mistral Large 3', 'Codestral', 'Mistral Small 3'],
    apiFormat: 'openai-compatible',
    quality: { speed: 'fast', reliability: 'high' },
    bestFor: 'EU-friendly inference with access to all Mistral models',
    caveat: 'Phone verification required. EU data residency.',
    lastVerified: '2026-06-14',
  },
  {
    id: 'nvidia-nim',
    name: 'NVIDIA NIM',
    url: 'https://build.nvidia.com/',
    freeTier: {
      requestsPerDay: '40 RPM',
      requiresCard: false,
      requiresSignup: true,
      limits: '91 models, 40 RPM via Developer Program',
    },
    topFreeModels: ['DeepSeek V3.2', 'Llama 3.3 70B', 'Mistral Large'],
    apiFormat: 'openai-compatible',
    quality: { speed: 'fast', reliability: 'high' },
    bestFor: 'Access to 91 models with NVIDIA Developer Program (free)',
    caveat: 'Requires NVIDIA Developer Program signup. Rate limits apply.',
    lastVerified: '2026-06-14',
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare Workers AI',
    url: 'https://developers.cloudflare.com/workers-ai/',
    freeTier: {
      tokensPerDay: '10K neurons/day',
      requiresCard: false,
      requiresSignup: true,
      limits: '10,000 neurons/day, unlimited requests',
    },
    topFreeModels: ['Llama 3.3 70B', 'Mistral 7B', 'Whisper'],
    apiFormat: 'custom',
    quality: { speed: 'fast', reliability: 'high' },
    bestFor: 'Edge inference with Cloudflare global network',
    caveat: 'Neuron-based pricing model. Limited model selection.',
    lastVerified: '2026-06-14',
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    url: 'https://openrouter.ai/',
    freeTier: {
      tokensPerDay: '~200K-1M+',
      requestsPerDay: '50-1,000/day',
      requiresCard: false,
      requiresSignup: true,
      limits: '29 free models, $10 unlocks 1K+ models',
    },
    topFreeModels: ['DeepSeek R1 0528', 'Llama 4 Scout', 'Qwen3 Coder 480B', 'Qwen3 235B'],
    apiFormat: 'openai-compatible',
    quality: { speed: 'normal', reliability: 'medium' },
    bestFor: 'Universal gateway — one API key for 200+ models across all providers',
    caveat: 'Free models rotate and have per-minute/day caps. $10 credit unlocks more.',
    lastVerified: '2026-06-14',
  },
  {
    id: 'together',
    name: 'Together AI',
    url: 'https://together.ai/',
    freeTier: {
      requiresCard: false,
      requiresSignup: true,
      limits: 'Free starter credits on signup',
    },
    topFreeModels: ['Llama 4 Maverick', 'Qwen 2.5 72B', 'DeepSeek R1'],
    apiFormat: 'openai-compatible',
    quality: { speed: 'fast', reliability: 'high' },
    bestFor: 'Fast inference on open models with free starter credits',
    caveat: 'Free credits run out. Paid tiers for continued use.',
    lastVerified: '2026-06-14',
  },
  {
    id: 'fireworks',
    name: 'Fireworks AI',
    url: 'https://fireworks.ai/',
    freeTier: {
      requiresCard: false,
      requiresSignup: true,
      limits: 'Free credits on signup',
    },
    topFreeModels: ['Llama 4 Maverick', 'Qwen 2.5 72B', 'DeepSeek V3'],
    apiFormat: 'openai-compatible',
    quality: { speed: 'fast', reliability: 'high' },
    bestFor: 'Production-grade inference with fast cold starts',
    caveat: 'Free credits limited. Paid tiers for production use.',
    lastVerified: '2026-06-14',
  },
  {
    id: 'deepinfra',
    name: 'DeepInfra',
    url: 'https://deepinfra.com/',
    freeTier: {
      requiresCard: false,
      requiresSignup: true,
      limits: 'Lowest cost per token, free trial credits',
    },
    topFreeModels: ['DeepSeek V3', 'Qwen 2.5 72B', 'Llama 3.3 70B'],
    apiFormat: 'openai-compatible',
    quality: { speed: 'fast', reliability: 'medium' },
    bestFor: 'Lowest cost per token for budget-conscious developers',
    caveat: 'Free trial credits limited. Smaller provider.',
    lastVerified: '2026-06-14',
  },
  {
    id: 'huggingface',
    name: 'Hugging Face Inference API',
    url: 'https://huggingface.co/inference-api',
    freeTier: {
      requestsPerDay: '~1,000+/hr',
      requiresCard: false,
      requiresSignup: true,
      limits: '~2M tokens (PRO $9/mo), 200+ serverless models',
    },
    topFreeModels: ['Llama 3.3 70B', 'Qwen 2.5 72B', 'Mistral Large'],
    apiFormat: 'custom',
    quality: { speed: 'normal', reliability: 'medium' },
    bestFor: 'Broadest open-model catalog with serverless inference',
    caveat: 'Free endpoints share capacity and can sleep. PRO ($9/mo) for reliability.',
    lastVerified: '2026-06-14',
  },
  {
    id: 'kilo-gateway',
    name: 'Kilo Gateway',
    url: 'https://kilo.ai/gateway',
    freeTier: {
      requestsPerDay: '200/hour',
      requiresCard: false,
      requiresSignup: false,
      limits: 'Auto Free routes: 200 req/hour, no signup required',
    },
    topFreeModels: ['500+ models via OpenRouter', 'DeepSeek', 'Qwen', 'Llama'],
    apiFormat: 'openai-compatible',
    quality: { speed: 'fast', reliability: 'medium' },
    bestFor: '500+ models with free routes, BYOK, and zero markup',
    caveat: 'Anonymous free routes are rate-limited. Some providers may log data.',
    lastVerified: '2026-06-14',
  },
];

// ─── Helper Functions ───────────────────────────────────────────────────────

/** Get provider by ID */
export function getProviderById(id: string): InferenceProvider | undefined {
  return inferenceProviders.find((p) => p.id === id);
}

/** Get providers that don't require credit card */
export function getNoCardProviders(): InferenceProvider[] {
  return inferenceProviders.filter((p) => !p.freeTier.requiresCard);
}

/** Get providers with OpenAI-compatible API */
export function getOpenAICompatibleProviders(): InferenceProvider[] {
  return inferenceProviders.filter((p) => p.apiFormat === 'openai-compatible');
}

/** Get providers sorted by free tier generosity */
export function getProvidersByGenerosity(): InferenceProvider[] {
  return [...inferenceProviders].sort((a, b) => {
    const aScore = getGenerosityScore(a);
    const bScore = getGenerosityScore(b);
    return bScore - aScore;
  });
}

function getGenerosityScore(provider: InferenceProvider): number {
  let score = 0;
  if (!provider.freeTier.requiresCard) score += 10;
  if (!provider.freeTier.requiresSignup) score += 5;
  if (provider.freeTier.tokensPerDay) score += 8;
  if (provider.quality.speed === 'ultra-fast') score += 5;
  if (provider.quality.reliability === 'high') score += 5;
  return score;
}
