/**
 * Zero-Key Panel — Horizontal Scroller Redesign
 * Android app drawer style: horizontal scroll with snapping cards.
 * All tools visible at once, no lazy loading.
 * Includes quick filter chips and new button design (Open → + Report ▼ dropdown).
 */

import { type Lang } from './i18n';
import {
  categoryLabels,
  zeroKeyTools,
  type ZeroKeyCategory,
  type ZeroKeyTool,
} from './data/zero-key-tools';
export type { ZeroKeyCategory };
import { type SearchResult, searchTools } from './fuse-search';

// ─── Category Icons ──────────────────────────────────────────────────────────

/**
 * Checks if a category matches the given prefix.
 * Uses delimiter-based matching to avoid false positives.
 * Example: "ai" matches "ai-chat" but not "aid" or "airplane"
 */
function matchesCategoryPrefix(category: string, prefix: 'ai' | 'dev'): boolean {
  return category === prefix || category.startsWith(`${prefix}-`);
}

const categoryIcons: Record<ZeroKeyCategory, string> = {
  // AI categories
  'ai-chat': '\u{1F4AC}', // 💬 speech balloon
  'ai-image': '\u{1F3A8}', // 🎨 artist palette
  'ai-video': '\u{1F3AC}', // 🎬 clapper board
  'ai-audio': '\u{1F3B5}', // 🎵 musical note
  'ai-writing': '\u{270D}\uFE0F', // ✍️ writing hand
  'ai-search': '\u{1F50D}', // 🔍 magnifying glass
  'ai-pdf': '\u{1F4C4}', // 📄 page
  'ai-presentation': '\u{1F4CA}', // 📊 chart
  'ai-math': '\u{1F9EE}', // 🧮 abacus
  'ai-coding': '\u{1F6E0}\uFE0F', // 🛠️ hammer & wrench (coding/tools)
  'ai-agents': '\u{1F916}', // 🤖 robot (agents/platforms)
  'ai-open-source': '\u{1F4BE}', // 💾 floppy disk (download models)
  'ai-models': '\u{1F31F}', // 🌟 glowing star (newest models)
  // Developer categories
  'dev-coding': '\u{1F4BB}', // 💻 laptop
  'dev-docs': '\u{1F4DA}', // 📚 books
  'dev-data': '\u{1F5C4}\uFE0F', // 🗄️ file cabinet
  'dev-design': '\u{1F58C}\uFE0F', // 🎽 drafting compass
  'dev-backend': '\u{1F680}', // 🚀 rocket (hosting/deployment)
  'dev-automation': '\u{2699}\uFE0F', // ⚙️ gear
  'dev-security': '\u{1F512}', // 🔒 lock
  'dev-productivity': '\u{1F4CB}', // 📋 clipboard
  'dev-learning': '\u{1F393}', // 🎓 graduation cap
};

// ─── Copy / i18n ─────────────────────────────────────────────────────────────

const COPY = {
  en: {
    title: 'AI Tools & Models',
    searchPlaceholder: 'Search tools\u2026 (Ctrl+K to focus)',
    clearFilters: 'Clear all filters',
    open: 'Open',
    docs: 'Docs',
    report: 'Report',
    noMatchesTitle: 'No tools match',
    noMatchesSuggestion: 'Try: chat, image, PDF, coding',
    showing: (visible: number, total: number) => `Showing ${visible} of ${total} tools`,
    allCategory: 'All Tools',
  },
  ja: {
    title: 'AIツール＆モデル',
    searchPlaceholder: '\u691C\u7D22\u2026 (Ctrl+K)',
    clearFilters: '\u30D5\u30A3\u30EALL\u30BF\u30FC\u30AF\u30EA\u30A2',
    open: '\u958B\u304F',
    docs: '\u30C9\u30AD\u30E5\u30E1\u30F3\u30C8',
    report: '\u5831\u544A',
    noMatchesTitle: '\u4E00\u81F4\u306A\u3057',
    noMatchesSuggestion: 'chat, image, PDF, coding \u3067\u691C\u7D22',
    showing: (visible: number, total: number) => `${visible} / ${total}\u4EF6`,
    allCategory: '\u5168\u30C4\u30FC\u30EB',
  },
} satisfies Record<
  Lang,
  {
    title: string;
    searchPlaceholder: string;
    clearFilters: string;
    open: string;
    docs: string;
    report: string;
    noMatchesTitle: string;
    noMatchesSuggestion: string;
    showing: (visible: number, total: number) => string;
    allCategory: string;
  }
>;

// ─── Life Filters ────────────────────────────────────────────────────────────

interface LifeFilterDefinition {
  id: string;
  label: string;
  predicate: (tool: ZeroKeyTool, haystack: string) => boolean;
}

function getLifeFilters(lang: Lang): LifeFilterDefinition[] {
  const e = (en: string, ja: string) => (lang === 'ja' ? ja : en);
  return [
    // Access filters - core zero-budget needs
    {
      id: 'no-signup',
      label: e('No Signup', 'アカウント不要'),
      predicate: (tool) => tool.requiresSignup === false,
    },
    {
      id: 'free-signup-ok',
      label: e('Free Signup OK', '無料サインアップ可'),
      predicate: (tool) => tool.requiresSignup === true,
    },
    {
      id: 'no-key',
      label: e('No API Key', 'APIキー不要'),
      predicate: (tool) => tool.requiresSignup === false || tool.access === 'open-source',
    },
    // Free tokens/API credits for zero-budget developers
    {
      id: 'free-tokens',
      label: e('Free Tokens', '無料トークン'),
      predicate: (_tool, h) =>
        /free token|free credit|hugging face|google ai studio|cohere|trial/i.test(h),
    },
    // Surface filters - where you run tools
    {
      id: 'cli',
      label: e('CLI', 'CLI'),
      predicate: (tool) => tool.surface === 'cli',
    },
    {
      id: 'browser',
      label: e('Browser', 'ブラウザ'),
      predicate: (tool) => tool.surface === 'web',
    },
    {
      id: 'api',
      label: e('API', 'API'),
      predicate: (tool) => tool.surface === 'api',
    },
    // Deployment filters - self-hosted and open source
    {
      id: 'self-host',
      label: e('Self-host', 'セルフホスト'),
      predicate: (tool) => tool.access === 'self-host' || tool.access === 'open-source',
    },
    {
      id: 'open-source',
      label: e('Open Source', 'オープンソース'),
      predicate: (tool) => tool.access === 'open-source',
    },
    // Capability filters - what you can do
    {
      id: 'free-api',
      label: e('Free API', '無料API'),
      predicate: (tool) => tool.access === 'public-api' && tool.caveat?.toLowerCase().includes('rate') === false,
    },
    {
      id: 'high-context',
      label: e('1M+ Context', '長文対応'),
      predicate: (_tool, h) => /1M|256K|400K/i.test(h),
    },
    {
      id: 'developer',
      label: e('For Devs', '開発者向け'),
      predicate: (tool, h) =>
        tool.surface !== 'web' ||
        tool.category === 'dev-coding' ||
        /developer|coding|api|cli|git|database|deploy/i.test(h),
    },
    // Special needs for zero-budget developers
    {
      id: 'multilingual',
      label: e('Multilingual', '多言語'),
      predicate: (_tool, h) => /multilingual|chinese|japanese|korean|spanish/i.test(h.toLowerCase()),
    },
    // Money filters - free access paths
    {
      id: 'rate-limited',
      label: e('Free Limited', '無料制限あり'),
      predicate: (tool) =>
        (tool.caveat?.toLowerCase().includes('rate limit') ?? false) ||
        (tool.caveat?.toLowerCase().includes('daily') ?? false),
    },
    // Privacy & offline capability
    {
      id: 'web-llm',
      label: e('Web LLM', 'WebLLM'),
      predicate: (_tool, h) =>
        /webllm|local|offline|browser ll?lm/i.test(h.toLowerCase()),
    },
    {
      id: 'privacy-first',
      label: e('Privacy', 'プライバシー'),
      predicate: (_tool, h) =>
        /private|privacy|encrypted|local/i.test(h.toLowerCase()),
    },
  ];
}

// ─── State ───────────────────────────────────────────────────────────────────

export interface ZeroKeyPanelOptions {
  lang: Lang;
  onToolOpen?: () => void;
  categoryPrefix?: 'ai' | 'dev';
}

export interface ZeroKeyPanelApi {
  search: (query: string) => void;
  setCategory: (category: ZeroKeyCategory | null) => void;
  reset: () => void;
  destroy: () => void;
}

const DEBOUNCE_MS = 100;
const MAX_RESULTS = 300;

interface PanelState {
  lang: Lang;
  allTools: ZeroKeyTool[];
  results: SearchResult[];
  query: string;
  activeCategory: ZeroKeyCategory | null;
  onToolOpen?: () => void;
  container: HTMLElement | null;
  categoryPrefix?: 'ai' | 'dev';
  lifeFilters: Set<string>;
  debounceTimer: ReturnType<typeof setTimeout> | null;
  heroAbortController: AbortController;
}

// Per-panel state storage using WeakMap
const panelStateMap = new WeakMap<HTMLElement, PanelState>();

// Global keyboard handler flag (shared across all panels)
let globalKeyboardAttached = false;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function create<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (className) el.className = className;
  return el;
}

function buildHaystack(tool: ZeroKeyTool): string {
  return [
    tool.name,
    tool.url,
    tool.surface,
    tool.category,
    categoryLabels[tool.category],
    tool.access,
    ...tool.badges,
    tool.bestFor,
    tool.qualityNote,
    tool.caveat || '',
  ].join(' ');
}

function getState(container: HTMLElement): PanelState {
  let state = panelStateMap.get(container);
  if (!state) {
    state = {
      lang: 'en',
      allTools: [],
      results: [],
      query: '',
      activeCategory: null,
      lifeFilters: new Set(),
      debounceTimer: null,
      heroAbortController: new AbortController(),
      container: null,
    };
    panelStateMap.set(container, state);
  }
  return state;
}

// The panel's search input is identified by data-panel-search on its container
function getPanelSearchInput(container: HTMLElement): HTMLInputElement | null {
  return container.querySelector(`.zk2-search-input`) as HTMLInputElement | null;
}

// ─── Search & Filter Logic ───────────────────────────────────────────────────

function applyLifeFilters(state: PanelState, results: SearchResult[]): SearchResult[] {
  if (state.lifeFilters.size === 0) return results;
  const filters = getLifeFilters(state.lang);
  const activeFilterDefs = filters.filter((f) => state.lifeFilters.has(f.id));
  if (activeFilterDefs.length === 0) return results;
  return results.filter(({ tool }) => {
    const haystack = buildHaystack(tool).toLowerCase();
    for (const def of activeFilterDefs) {
      if (!def.predicate(tool, haystack)) return false;
    }
    return true;
  });
}

function applyCategoryFilter(state: PanelState, results: SearchResult[]): SearchResult[] {
  if (!state.activeCategory) return results;
  return results.filter(({ tool }) => tool.category === state.activeCategory);
}

function performSearch(state: PanelState): void {
  const query = state.query;

  // Filter tools by category prefix if specified
  const filteredTools = state.categoryPrefix
    ? state.allTools.filter((t) => matchesCategoryPrefix(t.category, state.categoryPrefix!))
    : state.allTools;

  let results: SearchResult[];
  if (!query.trim()) {
    results = filteredTools.map((tool) => ({ tool, score: 0, matches: {} }));
  } else {
    results = searchTools(filteredTools, query, MAX_RESULTS);
  }

  results = applyCategoryFilter(state, results);
  results = applyLifeFilters(state, results);
  state.results = results;

  updateSidebarActiveState(state);
  renderContent(state);
}

function debouncedSearch(state: PanelState, query: string): void {
  if (state.debounceTimer) clearTimeout(state.debounceTimer);
  state.query = query;
  state.debounceTimer = setTimeout(() => performSearch(state), DEBOUNCE_MS);
}

// ─── Sync hero search ↔ panel search ────────────────────────────────────────

function syncSearchInputs(container: HTMLElement, value: string, source: 'hero' | 'panel'): void {
  const heroInput = document.getElementById('hero-search') as HTMLInputElement | null;
  const panelInput = getPanelSearchInput(container);

  if (source === 'hero' && panelInput && panelInput.value !== value) {
    panelInput.value = value;
  }
  if (source === 'panel' && heroInput && heroInput.value !== value) {
    heroInput.value = value;
  }
}

// ─── Render: Quick Filters ───────────────────────────────────────────────────

function renderQuickFilters(state: PanelState): HTMLElement {
  const row = create('div', 'quick-filters-row');
  const filters = getLifeFilters(state.lang);

  for (const def of filters) {
    const chip = create(
      'button',
      `quick-filter-chip${state.lifeFilters.has(def.id) ? ' active' : ''}`
    );
    chip.type = 'button';
    chip.textContent = def.label;
    chip.setAttribute(
      'aria-label',
      state.lang === 'ja' ? `${def.label}でフィルター` : `Filter by ${def.label}`
    );
    chip.addEventListener('click', () => {
      if (state.lifeFilters.has(def.id)) {
        state.lifeFilters.delete(def.id);
      } else {
        state.lifeFilters.add(def.id);
      }
      performSearch(state);
    });
    row.appendChild(chip);
  }

  return row;
}

// ─── Render: Horizontal Tool Card ───────────────────────────────────────────

function renderHorizontalToolCard(state: PanelState, result: SearchResult): HTMLElement {
  const { tool } = result;
  const copy = COPY[state.lang];

  const card = create('article', 'tool-card-horizontal');
  card.tabIndex = 0; // Make cards focusable for keyboard navigation

  // Header: icon + surface badge
  const header = create('div', 'zk2-card-header');
  const icon = create('span', 'zk2-card-icon');
  icon.textContent = categoryIcons[tool.category];
  header.appendChild(icon);

  const surface = create('span', `zk2-card-surface zk2-surface-${tool.surface}`);
  surface.textContent = tool.surface.toUpperCase();
  header.appendChild(surface);
  card.appendChild(header);

  // Access type badges
  const accessBadges = create('div', 'zk2-card-access-badges');

  // AI vs Dev badge
  const isAI = tool.category.startsWith('ai-');
  const typeBadge = create('span', `zk2-access-badge zk2-access-${isAI ? 'ai' : 'dev'}`);
  typeBadge.textContent = isAI ? '🤖 AI' : '💻 Dev';
  accessBadges.appendChild(typeBadge);

  // Access type badge - use requiresSignup field for transparency
  if (tool.requiresSignup === false) {
    const accessBadge = create('span', 'zk2-access-badge zk2-access-no-key');
    accessBadge.textContent = '🔓 No Signup';
    accessBadges.appendChild(accessBadge);
  } else if (tool.requiresSignup === true) {
    const accessBadge = create('span', 'zk2-access-badge zk2-access-free-key');
    accessBadge.textContent = '🔑 Free Signup';
    accessBadges.appendChild(accessBadge);
  }

  // Rate limit badge
  if (tool.caveat && tool.caveat.toLowerCase().includes('rate limit')) {
    const rateBadge = create('span', 'zk2-access-badge zk2-access-rate-limited');
    rateBadge.textContent = '⚡ Rate Limited';
    accessBadges.appendChild(rateBadge);
  }

  card.appendChild(accessBadges);

  // Name
  const name = create('h3', 'zk2-card-name');
  name.textContent = tool.name;
  card.appendChild(name);

  // URL (full width under name, before description)
  const urlEl = create('a', 'zk2-card-url');
  const rawUrl = tool.url;
  urlEl.href = rawUrl;
  urlEl.target = '_blank';
  urlEl.rel = 'noopener noreferrer';
  urlEl.textContent = rawUrl.length > 40 ? rawUrl.slice(0, 37) + '...' : rawUrl;
  urlEl.title = rawUrl;
  card.appendChild(urlEl);

  // Description (bestFor)
  const desc = create('p', 'zk2-card-desc');
  desc.textContent = tool.bestFor.length > 90 ? tool.bestFor.slice(0, 87) + '\u2026' : tool.bestFor;
  card.appendChild(desc);

  // Badges
  if (tool.badges.length > 0) {
    const badgesWrap = create('div', 'zk2-card-badges');
    for (const b of tool.badges.slice(0, 4)) {
      const badge = create(
        'span',
        b === 'true-free-models' ? 'zk2-badge zk2-badge-free' : 'zk2-badge'
      );
      badge.textContent = b === 'true-free-models' ? '🔓 Free' : b;
      badgesWrap.appendChild(badge);
    }
    card.appendChild(badgesWrap);
  }

  // Caveat (full width as yellow bar, before footer)
  if (tool.caveat) {
    const caveat = create('div', 'zk2-card-caveat');
    caveat.textContent = '\u26A0\uFE0F ' + tool.caveat;
    caveat.title = tool.caveat;
    card.appendChild(caveat);
  }

  // Footer: Report button (left) | Open button (right)
  const footer = create('div', 'zk2-card-footer');

  // Report button with dropdown
  const reportBtn = create('button', 'zk2-card-report');
  reportBtn.type = 'button';
  reportBtn.innerHTML = `<span class="report-text">${state.lang === 'ja' ? '\u5831\u544A' : 'Report'} ▼</span>`;
  reportBtn.title =
    state.lang === 'ja'
      ? '\u3053\u306e\u30C4\u30FC\u30EB\u3092\u5831\u544A'
      : 'Report this tool as broken';
  reportBtn.setAttribute(
    'aria-label',
    state.lang === 'ja'
      ? `${tool.name}のリンクを報告: ${tool.name}`
      : `Report broken link: ${tool.name}`
  );
  reportBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const issueUrl = `https://github.com/sakurablush/banal/issues/new?title=Broken+tool:+${encodeURIComponent(tool.name)}&body=Tool:+${encodeURIComponent(tool.name)}%0AURL:+${encodeURIComponent(tool.url)}%0A%0AProblem:`;
    window.open(issueUrl, '_blank', 'noopener,noreferrer');
  });
  footer.appendChild(reportBtn);

  // Open button (CTA)
  const btn = create('a', 'zk2-card-cta');
  btn.href = tool.url;
  btn.target = '_blank';
  btn.rel = 'noopener noreferrer';
  btn.textContent = (tool.surface === 'cli' ? copy.docs : copy.open) + ' \u2192';
  btn.setAttribute(
    'aria-label',
    state.lang === 'ja'
      ? `${tool.surface === 'cli' ? copy.docs : copy.open}: ${tool.name}`
      : `${tool.surface === 'cli' ? copy.docs : copy.open} ${tool.name}`
  );
  btn.addEventListener('click', () => {
    state.onToolOpen?.();
  });
  footer.appendChild(btn);

  card.appendChild(footer);

  return card;
}

// ─── Render: Empty State ─────────────────────────────────────────────────────

function renderEmptyState(state: PanelState): HTMLElement {
  const copy = COPY[state.lang];
  const empty = create('div', 'zk2-empty');

  const iconEl = create('div', 'zk2-empty-icon');
  iconEl.textContent = '\u{1F50D}';
  empty.appendChild(iconEl);

  const titleEl = create('h3', 'zk2-empty-title');
  titleEl.textContent = `${copy.noMatchesTitle} "${state.query || ''}"`;
  empty.appendChild(titleEl);

  const hintEl = create('p', 'zk2-empty-hint');
  hintEl.textContent = copy.noMatchesSuggestion;
  empty.appendChild(hintEl);

  const clearBtn = create('button', 'zk2-empty-clear');
  clearBtn.type = 'button';
  clearBtn.textContent = copy.clearFilters;
  empty.appendChild(clearBtn);

  clearBtn.addEventListener('click', () => {
    state.query = '';
    state.activeCategory = null;
    state.lifeFilters.clear();
    const heroInput = document.getElementById('hero-search') as HTMLInputElement | null;
    const panelInput = getPanelSearchInput(state.container!);
    if (heroInput) heroInput.value = '';
    if (panelInput) panelInput.value = '';
    performSearch(state);
  });
  return empty;
}

// ─── Render: Sidebar Categories ─────────────────────────────────────────────

function renderSidebar(state: PanelState): HTMLElement {
  const sidebar = create('div', 'zk2-sidebar');

  // Get unique categories from tools
  const categories = Array.from(new Set(state.allTools.map((t) => t.category)))
    .sort()
    .filter((cat): cat is ZeroKeyCategory => !!categoryLabels[cat as ZeroKeyCategory]);

  // All category button
  const allBtn = create('button', `zk2-cat-item${state.activeCategory === null ? ' active' : ''}`);
  allBtn.type = 'button';
  allBtn.innerHTML = `<span class="zk2-cat-icon">📦</span> <span class="zk2-cat-label">${COPY[state.lang].allCategory}</span> <span class="zk2-cat-count">${state.allTools.length}</span>`;
  allBtn.dataset.category = 'all';
  allBtn.addEventListener('click', () => {
    state.activeCategory = null;
    updateSidebarActiveState(state);
    performSearch(state);
  });
  sidebar.appendChild(allBtn);

  // Individual category buttons
  for (const cat of categories) {
    const toolCount = state.allTools.filter((t) => t.category === cat).length;
    const btn = create('button', `zk2-cat-item${state.activeCategory === cat ? ' active' : ''}`);
    btn.type = 'button';
    btn.innerHTML = `<span class="zk2-cat-icon">${categoryIcons[cat]}</span> <span class="zk2-cat-label">${categoryLabels[cat]}</span> <span class="zk2-cat-count">${toolCount}</span>`;
    btn.dataset.category = cat;
    btn.addEventListener('click', () => {
      state.activeCategory = cat;
      updateSidebarActiveState(state);
      performSearch(state);
    });
    sidebar.appendChild(btn);
  }

  return sidebar;
}

// Update active state on sidebar buttons
function updateSidebarActiveState(state: PanelState): void {
  const container = state.container;
  if (!container) return;

  const sidebar = container.querySelector('.zk2-sidebar');
  if (!sidebar) return;

  const buttons = sidebar.querySelectorAll('.zk2-cat-item');
  buttons.forEach((btn) => {
    const cat = (btn as HTMLElement).dataset.category;
    btn.classList.toggle(
      'active',
      cat === 'all' ? state.activeCategory === null : cat === state.activeCategory
    );
  });
}

// ─── Render: Main Content (horizontal scroll) ─────────────────────────────

function renderContent(state: PanelState): void {
  const container = state.container;
  if (!container) return;

  // Clear content area (keep search bar)
  const contentArea = container.querySelector('.zk2-horizontal-content') as HTMLElement | null;
  if (!contentArea) return;

  contentArea.innerHTML = '';

  const copy = COPY[state.lang];
  const results = state.results;

  // Quick filters row
  const filtersRow = renderQuickFilters(state);
  contentArea.appendChild(filtersRow);

  // Stats bar with aria-live for screen reader announcements
  const statsBar = create('div', 'zk2-stats-bar');
  statsBar.setAttribute('aria-live', 'polite');
  statsBar.setAttribute('aria-atomic', 'true');
  statsBar.textContent = copy.showing(results.length, results.length);
  if (state.activeCategory) {
    const catLabel = create('span', 'zk2-stats-category');
    catLabel.textContent = ` \u2022 ${categoryIcons[state.activeCategory]} ${categoryLabels[state.activeCategory]}`;
    statsBar.appendChild(catLabel);
  }
  contentArea.appendChild(statsBar);

  // Empty state
  if (results.length === 0) {
    contentArea.appendChild(renderEmptyState(state));
    return;
  }

  // Scroll container
  const scrollContainer = create('div', 'tools-horizontal-scroll');
  results.forEach((result, i) => {
    const card = renderHorizontalToolCard(state, result);
    card.style.animationDelay = `${Math.min(i * 20, 400)}ms`;
    scrollContainer.appendChild(card);
  });
  contentArea.appendChild(scrollContainer);
}

// ─── Keyboard Navigation ─────────────────────────────────────────────────────

function handleGlobalKeyboard(e: KeyboardEvent): void {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    // Focus the first panel search input we find
    const input = document.querySelector('.zk2-search-input') as HTMLInputElement | null;
    if (input) {
      input.focus();
      input.select();
    }
  }
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function renderZeroKeyPowerPanel(
  container: HTMLElement,
  options: ZeroKeyPanelOptions
): ZeroKeyPanelApi {
  const { lang, onToolOpen, categoryPrefix } = options;
  const state = getState(container);

  // Abort any previous hero listeners for this panel and create new controller
  state.heroAbortController.abort();
  state.heroAbortController = new AbortController();
  const { signal } = state.heroAbortController;

  // Initialize/reset state
  state.lang = lang;
  state.onToolOpen = onToolOpen;
  state.categoryPrefix = categoryPrefix;
  state.query = '';
  state.activeCategory = null;
  state.lifeFilters = new Set();

  // Filter tools by category prefix if specified
  const filteredTools = categoryPrefix
    ? zeroKeyTools.filter((t) => matchesCategoryPrefix(t.category, categoryPrefix))
    : zeroKeyTools;
  state.allTools = filteredTools;
  state.results = filteredTools.map((tool) => ({ tool, score: 0, matches: {} }));
  state.container = container;

  container.innerHTML = '';
  container.className = 'zk2-panel';

  // Panel search bar
  const searchWrap = create('div', 'zk2-search-wrap');
  const searchIcon = create('span', 'zk2-search-icon');
  searchIcon.textContent = '\u2315';
  searchWrap.appendChild(searchIcon);

  const searchInput = create('input');
  searchInput.type = 'text';
  searchInput.id = 'zk-search-input';
  searchInput.className = 'zk2-search-input';
  searchInput.placeholder = COPY[lang].searchPlaceholder;
  searchInput.autocomplete = 'off';
  searchInput.spellcheck = false;

  searchInput.addEventListener('input', () => {
    syncSearchInputs(container, searchInput.value, 'panel');
    debouncedSearch(state, searchInput.value);
  });
  searchWrap.appendChild(searchInput);
  container.appendChild(searchWrap);

  // Layout wrapper with sidebar
  const layout = create('div', 'zk2-layout');
  container.appendChild(layout);

  // Sidebar with categories
  const sidebar = renderSidebar(state);
  layout.appendChild(sidebar);

  // Horizontal content area
  const content = create('div', 'zk2-horizontal-content');
  layout.appendChild(content);

  // Wire hero search (each panel gets its own listener)
  const heroInput = document.getElementById('hero-search') as HTMLInputElement | null;
  if (heroInput) {
    heroInput.addEventListener(
      'input',
      () => {
        syncSearchInputs(container, heroInput.value, 'hero');
        debouncedSearch(state, heroInput.value);
      },
      { signal }
    );

    // Enter on hero → focus panel search
    heroInput.addEventListener(
      'keydown',
      (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          searchInput.focus();
        }
        if (e.key === 'Escape') {
          state.query = '';
          state.activeCategory = null;
          heroInput.value = '';
          syncSearchInputs(container, '', 'hero');
          performSearch(state);
        }
      },
      { signal }
    );
  }

  // Panel search keyboard
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      state.query = '';
      state.activeCategory = null;
      searchInput.value = '';
      syncSearchInputs(container, '', 'panel');
      performSearch(state);
    }
  });

  // Global Ctrl+K (attach once)
  if (!globalKeyboardAttached) {
    document.addEventListener('keydown', handleGlobalKeyboard);
    globalKeyboardAttached = true;
  }

  // Initial render
  performSearch(state);

  return {
    search: (query: string) => {
      state.query = query;
      performSearch(state);
    },
    setCategory: (category: ZeroKeyCategory | null) => {
      state.activeCategory = category;
      performSearch(state);
    },
    reset: () => {
      state.query = '';
      state.activeCategory = null;
      state.lifeFilters.clear();
      const panelInput = getPanelSearchInput(container);
      if (panelInput) panelInput.value = '';
      performSearch(state);
    },
    destroy: () => {
      state.heroAbortController.abort();
      state.lifeFilters.clear();
      if (state.debounceTimer) {
        clearTimeout(state.debounceTimer);
        state.debounceTimer = null;
      }
    },
  };
}

export function resetZeroKeyPanelFiltersForTests(): void {
  // Note: Per-panel state is not cleared here for backward compatibility with tests
  // that call renderZeroKeyPowerPanel directly. Each panel manages its own state.
}
