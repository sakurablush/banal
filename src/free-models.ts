/**
 * Free Models Module — renders two sections:
 *   1. "Free API Keys" - providers offering free hosted API access
 *   2. "Open Source Models" - models to download and run locally
 *
 * Section 1 (Free API Keys) displays a curated list of AI providers that offer
 * free hosted tiers with generous limits. Each card includes provider information,
 * limits, and links to get free API keys.
 *
 * Section 2 (Open Source Models) shows real open-weight models that can be
 * downloaded and run locally with no API keys and no rate limits.
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

interface OpenSourceModel {
  id: string;
  name: string;
  family: string;
  sizes: string;
  license: string;
  vram: string;
  links: { platform: string; url: string }[];
  bestFor: string;
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
    description: 'Truly anonymous API - no signup, no key needed. Perfect for quick tests.',
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
    description: 'Fastest inference available. Excellent for real-time applications.',
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
    description: 'High-quality models from Google. Great for complex tasks.',
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
    description: 'Access to thousands of open-source models. Great for experimentation.',
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
    description: 'European AI leader. Excellent for coding and multilingual tasks.',
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
    description: 'Excellent reasoning capabilities. Very affordable after free credits.',
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
    description: 'Access to largest open-source models. Great for high-quality outputs.',
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
    description: 'Fast and reliable inference platform. Good for production use.',
  },
];

const openSourceModels: OpenSourceModel[] = [
  {
    id: 'llama-3.3',
    name: 'Llama 3.3',
    family: 'Meta',
    sizes: '8B, 70B, 405B',
    license: 'Apache 2.0',
    vram: '8B: ~16GB | 70B: ~140GB | 405B: ~800GB',
    links: [
      { platform: 'HF', url: 'https://huggingface.co/meta-llama/Llama-3.3-70B-Instruct' },
      { platform: 'Ollama', url: 'https://ollama.com/search?q=llama+3.3' },
    ],
    bestFor: 'General-purpose, multilingual, coding, reasoning',
  },
  {
    id: 'qwen-2.5',
    name: 'Qwen 2.5',
    family: 'Alibaba',
    sizes: '0.6B, 1.5B, 3B, 7B, 14B, 32B, 72B, 110B, 235B, 397B',
    license: 'Apache 2.0',
    vram: '0.6B: ~2GB | 72B: ~140GB | 397B: ~800GB',
    links: [
      { platform: 'HF', url: 'https://huggingface.co/Qwen/Qwen2.5-72B-Instruct' },
      { platform: 'Ollama', url: 'https://ollama.com/search?q=qwen+2.5' },
    ],
    bestFor: 'Multilingual, coding, math, long context',
  },
  {
    id: 'glm-4',
    name: 'GLM-4',
    family: 'Zhipu AI',
    sizes: '9B, 33B',
    license: 'MIT / Apache 2.0',
    vram: '9B: ~18GB | 33B: ~66GB',
    links: [
      { platform: 'HF', url: 'https://huggingface.co/THUDM/glm-4-9b-chat' },
      { platform: 'ModelScope', url: 'https://modelscope.cn/models/ZhipuAI/glm-4-9b-chat' },
    ],
    bestFor: 'Multilingual, Chinese-English, reasoning',
  },
  {
    id: 'mistral',
    name: 'Mistral / Mixtral',
    family: 'Mistral AI',
    sizes: '7B, 8x7B, 8x22B',
    license: 'Apache 2.0',
    vram: '7B: ~14GB | 8x7B: ~90GB | 8x22B: ~280GB',
    links: [
      { platform: 'HF', url: 'https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.3' },
      { platform: 'Ollama', url: 'https://ollama.com/search?q=mistral' },
    ],
    bestFor: 'Fast, efficient, multilingual, coding',
  },
  {
    id: 'gemma-2',
    name: 'Gemma 2',
    family: 'Google',
    sizes: '2B, 9B, 27B',
    license: 'Apache 2.0',
    vram: '2B: ~4GB | 9B: ~18GB | 27B: ~54GB',
    links: [
      { platform: 'HF', url: 'https://huggingface.co/google/gemma-2-9b-it' },
      { platform: 'Ollama', url: 'https://ollama.com/search?q=gemma' },
    ],
    bestFor: 'Lightweight, efficient, safe, Google ecosystem',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek V3 / R1',
    family: 'DeepSeek',
    sizes: 'V3: 671B (37B active), R1: 671B (37B active)',
    license: 'MIT',
    vram: '37B activated: ~75GB (quantized)',
    links: [
      { platform: 'HF', url: 'https://huggingface.co/deepseek-ai/DeepSeek-R1' },
      { platform: 'Ollama', url: 'https://ollama.com/search?q=deepseek' },
    ],
    bestFor: 'Reasoning, coding, math, chain-of-thought',
  },
];

/**
 * Initialize the free models section.
 * Renders provider cards into the #free-models-root container.
 * Also renders open source models into #open-source-models-root if present.
 */
export function initFreeModels(): void {
  renderApiKeysSection();

  // Open Source Models section (if container exists)
  const osRoot = document.getElementById('open-source-models-root');
  if (osRoot) {
    renderOpenSourceModels(osRoot);
  }
}

/**
 * Render the "Free API Keys" section with hosted providers.
 */
function renderApiKeysSection(): void {
  const root = document.getElementById('free-models-root');
  if (!root) {
    console.warn('Free models root not found');
    return;
  }

  root.innerHTML = '';

  const grid = document.createElement('div');
  grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';

  providers.forEach((provider) => {
    const card = createProviderCard(provider);
    grid.appendChild(card);
  });

  root.appendChild(grid);
}

/**
 * Render the "Open Source Models" section with downloadable models.
 */
export function renderOpenSourceModels(container: HTMLElement): void {
  container.innerHTML = '';

  const tableWrap = document.createElement('div');
  tableWrap.className = 'overflow-x-auto';

  const table = document.createElement('table');
  table.className = 'w-full text-sm text-left';

  // Header
  const thead = document.createElement('thead');
  thead.className = 'text-xs text-white/40 uppercase border-b border-white/10';
  thead.innerHTML = `
    <tr>
      <th class="px-4 py-3">Model</th>
      <th class="px-4 py-3">Sizes</th>
      <th class="px-4 py-3">License</th>
      <th class="px-4 py-3">VRAM (min)</th>
      <th class="px-4 py-3">Best For</th>
      <th class="px-4 py-3">Download</th>
    </tr>
  `;
  table.appendChild(thead);

  // Body
  const tbody = document.createElement('tbody');
  openSourceModels.forEach((model) => {
    const tr = document.createElement('tr');
    tr.className = 'border-b border-white/5 hover:bg-white/5 transition-colors';

    // Model name + family
    const nameTd = document.createElement('td');
    nameTd.className = 'px-4 py-3 font-medium text-white';
    nameTd.innerHTML = `<div>${model.name}</div><div class="text-xs text-white/40">${model.family}</div>`;
    tr.appendChild(nameTd);

    // Sizes
    const sizesTd = document.createElement('td');
    sizesTd.className = 'px-4 py-3 text-white/70';
    sizesTd.textContent = model.sizes;
    tr.appendChild(sizesTd);

    // License
    const licenseTd = document.createElement('td');
    licenseTd.className = 'px-4 py-3';
    const licenseSpan = document.createElement('span');
    licenseSpan.className = 'px-2 py-1 rounded text-xs bg-green-500/20 text-green-400';
    licenseSpan.textContent = model.license;
    licenseTd.appendChild(licenseSpan);
    tr.appendChild(licenseTd);

    // VRAM
    const vramTd = document.createElement('td');
    vramTd.className = 'px-4 py-3 text-white/60 text-xs';
    vramTd.textContent = model.vram;
    tr.appendChild(vramTd);

    // Best For
    const bestForTd = document.createElement('td');
    bestForTd.className = 'px-4 py-3 text-white/60 text-xs max-w-[200px]';
    bestForTd.textContent = model.bestFor;
    tr.appendChild(bestForTd);

    // Download links
    const linksTd = document.createElement('td');
    linksTd.className = 'px-4 py-3';
    model.links.forEach((link) => {
      const a = document.createElement('a');
      a.href = link.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = 'text-xs text-violet-400 hover:text-violet-300 mr-2';
      a.textContent = link.platform;
      linksTd.appendChild(a);
    });
    tr.appendChild(linksTd);

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  tableWrap.appendChild(table);
  container.appendChild(tableWrap);
}

/**
 * Create a card element for a provider.
 */
function createProviderCard(provider: FreeModelProvider): HTMLElement {
  const card = document.createElement('div');
  card.className =
    'bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors';

  // Badge
  const badge = document.createElement('div');
  badge.className = `inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
    provider.tier === 'anonymous'
      ? 'bg-green-500/20 text-green-400'
      : provider.tier === 'free-key'
        ? 'bg-blue-500/20 text-blue-400'
        : 'bg-purple-500/20 text-purple-400'
  }`;
  badge.textContent =
    provider.tier === 'anonymous' ? 'NO KEY' : provider.tier === 'free-key' ? 'FREE KEY' : 'TRIAL';

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
  provider.advantages.forEach((adv) => {
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
  getKeyBtn.className =
    'flex-1 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition-colors text-center';
  getKeyBtn.textContent = 'Get Free Key';

  const termsLink = document.createElement('a');
  termsLink.href = provider.termsUrl;
  termsLink.target = '_blank';
  termsLink.rel = 'noopener noreferrer';
  termsLink.className =
    'px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-lg transition-colors text-center';
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
