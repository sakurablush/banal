/**
 * Free Models Module — renders cards for AI providers offering free API keys.
 * 
 * This module displays a curated list of AI providers that offer free tiers
 * with generous limits. Each card includes provider information, limits,
 * and links to get free API keys.
 */

interface FreeModelProvider {
  id: string;
  name: string;
  tier: 'anonymous' | 'free-key' | 'trial';
  models: string[];
  limits: string;
  advantages: string[];
  getKeyUrl: string;
  termsUrl: string;
  description: string;
}

const providers: FreeModelProvider[] = [
  {
    id: 'ovh-anon',
    name: 'OVHcloud AI Endpoints',
    tier: 'anonymous',
    models: ['Meta-Llama-3_3-70B-Instruct'],
    limits: '2 RPM per IP',
    advantages: ['No registration required', 'EU-hosted', 'Truly anonymous'],
    getKeyUrl: 'https://oai.endpoints.kepler.ai.cloud.ovh.net',
    termsUrl: 'https://www.ovhcloud.com/en/terms-and-conditions/',
    description: 'Truly anonymous API - no signup, no key needed. Perfect for quick tests.'
  },
  {
    id: 'groq',
    name: 'Groq',
    tier: 'free-key',
    models: ['Llama 3.1 8B', 'Llama 3.3 70B', 'Llama 4 Scout'],
    limits: '30 RPM, 6K TPM, 14.4K RPD',
    advantages: ['Ultra-fast inference', 'No credit card', 'Generous daily limits'],
    getKeyUrl: 'https://console.groq.com/keys',
    termsUrl: 'https://console.groq.com/docs/rate-limits',
    description: 'Fastest inference available. Excellent for real-time applications.'
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    tier: 'free-key',
    models: ['Gemini Flash', 'Gemini Pro'],
    limits: 'Rate-limited, generous free tier',
    advantages: ['Best quality', 'No credit card', 'Google ecosystem'],
    getKeyUrl: 'https://aistudio.google.com/app/apikey',
    termsUrl: 'https://ai.google.dev/gemini-api/docs/rate-limits',
    description: 'High-quality models from Google. Great for complex tasks.'
  },
  {
    id: 'hf',
    name: 'Hugging Face',
    tier: 'free-key',
    models: ['Llama 3.2 8B', 'Qwen 2.5 7B', 'Mistral 7B'],
    limits: '~10-20 RPM per IP',
    advantages: ['Large model selection', 'Open-source focus', 'Community-driven'],
    getKeyUrl: 'https://huggingface.co/settings/tokens',
    termsUrl: 'https://huggingface.co/pricing',
    description: 'Access to thousands of open-source models. Great for experimentation.'
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    tier: 'free-key',
    models: ['Mistral Large', 'Codestral', 'Pixtral'],
    limits: '2 RPM, 500K TPM, 1B tokens/month',
    advantages: ['High-quality models', 'No credit card', 'European company'],
    getKeyUrl: 'https://console.mistral.ai/',
    termsUrl: 'https://docs.mistral.ai/getting-started/pricing/',
    description: 'European AI leader. Excellent for coding and multilingual tasks.'
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    tier: 'free-key',
    models: ['DeepSeek V3', 'DeepSeek R1'],
    limits: '5M tokens on signup (30 days)',
    advantages: ['Very cheap after free tier', 'Strong reasoning', 'No credit card'],
    getKeyUrl: 'https://platform.deepseek.com/',
    termsUrl: 'https://api-docs.deepseek.com/',
    description: 'Excellent reasoning capabilities. Very affordable after free credits.'
  },
  {
    id: 'together',
    name: 'Together AI',
    tier: 'trial',
    models: ['Llama 3.1 405B', 'Mixtral 8x22B', 'Qwen 2 72B'],
    limits: '$5-25 trial credits',
    advantages: ['Large model selection', 'Fast inference', 'One-time credits'],
    getKeyUrl: 'https://api.together.xyz/',
    termsUrl: 'https://docs.together.ai/docs/pricing',
    description: 'Access to largest open-source models. Great for high-quality outputs.'
  },
  {
    id: 'fireworks',
    name: 'Fireworks AI',
    tier: 'trial',
    models: ['Llama 3.1 405B', 'Mixtral 8x22B', 'Qwen 2 72B'],
    limits: 'Trial credits on signup',
    advantages: ['Fast inference', 'Good model selection', 'Easy integration'],
    getKeyUrl: 'https://fireworks.ai/',
    termsUrl: 'https://docs.fireworks.ai/getting-started/pricing',
    description: 'Fast and reliable inference platform. Good for production use.'
  }
];

/**
 * Initialize the free models section.
 * Renders provider cards into the #free-models-root container.
 */
export function initFreeModels(): void {
  const root = document.getElementById('free-models-root');
  if (!root) {
    console.warn('Free models root not found');
    return;
  }

  root.innerHTML = '';
  
  const grid = document.createElement('div');
  grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
  
  providers.forEach(provider => {
    const card = createProviderCard(provider);
    grid.appendChild(card);
  });
  
  root.appendChild(grid);
}

/**
 * Create a card element for a provider.
 */
function createProviderCard(provider: FreeModelProvider): HTMLElement {
  const card = document.createElement('div');
  card.className = 'bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors';
  
  // Badge
  const badge = document.createElement('div');
  badge.className = `inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
    provider.tier === 'anonymous' 
      ? 'bg-green-500/20 text-green-400' 
      : provider.tier === 'free-key'
      ? 'bg-blue-500/20 text-blue-400'
      : 'bg-purple-500/20 text-purple-400'
  }`;
  badge.textContent = provider.tier === 'anonymous' 
    ? 'NO KEY' 
    : provider.tier === 'free-key'
    ? 'FREE KEY'
    : 'TRIAL';
  
  // Name
  const name = document.createElement('h3');
  name.className = 'text-xl font-bold text-white mb-2';
  name.textContent = provider.name;
  
  // Description
  const description = document.createElement('p');
  description.className = 'text-white/60 text-sm mb-4';
  description.textContent = provider.description;
  
  // Models
  const modelsDiv = document.createElement('div');
  modelsDiv.className = 'mb-3';
  const modelsLabel = document.createElement('div');
  modelsLabel.className = 'text-white/40 text-xs mb-1';
  modelsLabel.textContent = 'Models:';
  const modelsList = document.createElement('div');
  modelsList.className = 'text-white/80 text-sm';
  modelsList.textContent = provider.models.join(', ');
  modelsDiv.appendChild(modelsLabel);
  modelsDiv.appendChild(modelsList);
  
  // Limits
  const limitsDiv = document.createElement('div');
  limitsDiv.className = 'mb-4';
  const limitsLabel = document.createElement('div');
  limitsLabel.className = 'text-white/40 text-xs mb-1';
  limitsLabel.textContent = 'Limits:';
  const limitsValue = document.createElement('div');
  limitsValue.className = 'text-white/80 text-sm';
  limitsValue.textContent = provider.limits;
  limitsDiv.appendChild(limitsLabel);
  limitsDiv.appendChild(limitsValue);
  
  // Advantages
  const advantagesDiv = document.createElement('div');
  advantagesDiv.className = 'mb-4';
  const advantagesLabel = document.createElement('div');
  advantagesLabel.className = 'text-white/40 text-xs mb-1';
  advantagesLabel.textContent = 'Advantages:';
  const advantagesList = document.createElement('ul');
  advantagesList.className = 'text-white/80 text-sm list-disc list-inside';
  provider.advantages.forEach(adv => {
    const li = document.createElement('li');
    li.textContent = adv;
    advantagesList.appendChild(li);
  });
  advantagesDiv.appendChild(advantagesLabel);
  advantagesDiv.appendChild(advantagesList);
  
  // Links
  const linksDiv = document.createElement('div');
  linksDiv.className = 'flex gap-3 mt-4';
  
  const getKeyBtn = document.createElement('a');
  getKeyBtn.href = provider.getKeyUrl;
  getKeyBtn.target = '_blank';
  getKeyBtn.rel = 'noopener noreferrer';
  getKeyBtn.className = 'flex-1 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition-colors text-center';
  getKeyBtn.textContent = 'Get Free Key';
  
  const termsLink = document.createElement('a');
  termsLink.href = provider.termsUrl;
  termsLink.target = '_blank';
  termsLink.rel = 'noopener noreferrer';
  termsLink.className = 'px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-lg transition-colors text-center';
  termsLink.textContent = 'Terms';
  
  linksDiv.appendChild(getKeyBtn);
  linksDiv.appendChild(termsLink);
  
  // Assemble card
  card.appendChild(badge);
  card.appendChild(name);
  card.appendChild(description);
  card.appendChild(modelsDiv);
  card.appendChild(limitsDiv);
  card.appendChild(advantagesDiv);
  card.appendChild(linksDiv);
  
  return card;
}
