/**
 * Zero-Key Panel v2 — Masterpiece Redesign
 * Card-based grid layout, category sidebar, working search, lazy loading.
 * Inspired by Raycast Store / Product Hunt / Notion Template Gallery.
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
  'ai-chat': '\u{1F4AC}',
  'ai-image': '\u{1F3A8}',
  'ai-video': '\u{1F3AC}',
  'ai-audio': '\u{1F3B5}',
  'ai-writing': '\u{270D}\uFE0F',
  'ai-search': '\u{1F50D}',
  'ai-pdf': '\u{1F4C4}',
  'ai-presentation': '\u{1F4CA}',
  'ai-math': '\u{1F9EE}',
  'ai-coding': '\u{1F916}',
  'ai-agents': '\u{1F916}',
  'ai-open-source': '\u{1F9E0}',
  // Developer categories
  'dev-coding': '\u{1F4BB}',
  'dev-docs': '\u{1F4DA}',
  'dev-data': '\u{1F5C4}\uFE0F',
  'dev-design': '\u{1F58C}\uFE0F',
  'dev-backend': '\u{2601}\uFE0F',
  'dev-automation': '\u{2699}\uFE0F',
  'dev-security': '\u{1F512}',
  'dev-productivity': '\u{1F4CB}',
  'dev-learning': '\u{1F393}',
};

// ─── Copy / i18n ─────────────────────────────────────────────────────────────

const COPY = {
  en: {
    title: '200+ Free AI Tools',
    searchPlaceholder: 'Search tools\u2026 (Ctrl+K to focus)',
    clearFilters: 'Clear all filters',
    open: 'Open',
    docs: 'Docs',
    noMatchesTitle: 'No tools match',
    noMatchesSuggestion: 'Try: chat, image, PDF, coding',
    showing: (visible: number, total: number) => `Showing ${visible} of ${total} tools`,
    loadMore: 'Load more tools',
    allCategory: 'All Tools',
  },
  ja: {
    title: '200+ \u7121\u6599AI\u30C4\u30FC\u30EB',
    searchPlaceholder: '\u691C\u7D22\u2026 (Ctrl+K)',
    clearFilters: '\u30D5\u30A3\u30EB\u30BF\u30FC\u30AF\u30EA\u30A2',
    open: '\u958B\u304F',
    docs: '\u30C9\u30AD\u30E5\u30E1\u30F3\u30C8',
    noMatchesTitle: '\u4E00\u81F4\u306A\u3057',
    noMatchesSuggestion: 'chat, image, PDF, coding \u3067\u691C\u7D22',
    showing: (visible: number, total: number) => `${visible} / ${total}\u4EF6`,
    loadMore: '\u3082\u3063\u3068\u8AAD\u307F\u8FBC\u3080',
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
    noMatchesTitle: string;
    noMatchesSuggestion: string;
    showing: (visible: number, total: number) => string;
    loadMore: string;
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
      id: 'open-source',
      label: e('Open source', 'オープンソース'),
      predicate: (tool) => tool.access === 'open-source' || tool.access === 'self-host',
    },
    {
      id: 'offline',
      label: e('Works offline', 'オフライン対応'),
      predicate: (tool, h) =>
        tool.access === 'open-source' ||
        tool.surface === 'cli' ||
        /local|offline|desktop|self-host|WebGPU/i.test(h),
    },
    {
      id: 'developer',
      label: e('For devs', '開発者向け'),
      predicate: (tool, h) =>
        tool.surface !== 'web' ||
        tool.category === 'dev-coding' ||
        /developer|coding|api|cli|git|database|deploy/i.test(h),
    },
  ];
}

// ─── State ───────────────────────────────────────────────────────────────────

export interface ZeroKeyPanelOptions {
  lang: Lang;
  onToolOpen?: () => void;
  categoryPrefix?: 'ai' | 'dev'; // Filter tools by category prefix
}

export interface ZeroKeyPanelApi {
  search: (query: string) => void;
  setCategory: (category: ZeroKeyCategory | null) => void;
  reset: () => void;
  destroy: () => void;
}

const PAGE_SIZE = 24;
const DEBOUNCE_MS = 100;
const MAX_RESULTS = 300;

interface PanelState {
  lang: Lang;
  allTools: ZeroKeyTool[];
  results: SearchResult[];
  query: string;
  activeCategory: ZeroKeyCategory | null;
  visibleCount: number;
  onToolOpen?: () => void;
  container: HTMLElement | null;
  categoryPrefix?: 'ai' | 'dev';
  lifeFilters: Set<string>;
  debounceTimer: ReturnType<typeof setTimeout> | null;
  heroAbortController: AbortController;
  pendingScrollToTools?: boolean;
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
      visibleCount: PAGE_SIZE,
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

function getCategoryCounts(state: PanelState): Record<string, number> {
  const counts: Record<string, number> = {};
  const tools = state.categoryPrefix
    ? state.allTools.filter((t) => matchesCategoryPrefix(t.category, state.categoryPrefix!))
    : state.allTools;
  for (const tool of tools) {
    counts[tool.category] = (counts[tool.category] || 0) + 1;
  }
  return counts;
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
  state.visibleCount = PAGE_SIZE;

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

// ─── Render: Category Sidebar ────────────────────────────────────────────────

function renderCategorySidebar(state: PanelState): HTMLElement {
  const sidebar = create('aside', 'zk2-sidebar');
  const counts = getCategoryCounts(state);
  const copy = COPY[state.lang];

  // Filter categories by prefix if specified
  const allCategories = Object.keys(categoryLabels) as ZeroKeyCategory[];
  const categories = state.categoryPrefix
    ? allCategories.filter((cat) => matchesCategoryPrefix(cat, state.categoryPrefix!))
    : allCategories;

  // "All" item
  const allItem = create('button', `zk2-cat-item${!state.activeCategory ? ' active' : ''}`);
  allItem.type = 'button';
  const totalTools = state.categoryPrefix
    ? state.allTools.filter((t) => matchesCategoryPrefix(t.category, state.categoryPrefix!)).length
    : state.allTools.length;
  allItem.innerHTML = `<span class="zk2-cat-label">${copy.allCategory}</span><span class="zk2-cat-count">${totalTools}</span>`;
  allItem.addEventListener('click', () => {
    state.activeCategory = null;
    performSearch(state);
    updateSidebarActive(state);
  });
  sidebar.appendChild(allItem);

  // Category items
  for (const cat of categories) {
    const count = counts[cat] || 0;
    if (count === 0) continue;

    const item = create('button', `zk2-cat-item${state.activeCategory === cat ? ' active' : ''}`);
    item.type = 'button';
    item.dataset.category = cat;
    item.innerHTML = `<span class="zk2-cat-icon">${categoryIcons[cat]}</span><span class="zk2-cat-label">${categoryLabels[cat]}</span><span class="zk2-cat-count">${count}</span>`;
    item.addEventListener('click', () => {
      state.activeCategory = state.activeCategory === cat ? null : cat;
      performSearch(state);
      updateSidebarActive(state);
    });
    sidebar.appendChild(item);
  }

  return sidebar;
}

function updateSidebarActive(state: PanelState): void {
  const container = state.container;
  if (!container) return;
  const items = container.querySelectorAll('.zk2-cat-item');
  items.forEach((item, index) => {
    if (index === 0) {
      item.classList.toggle('active', !state.activeCategory);
    } else {
      const cat = (item as HTMLElement).dataset.category;
      item.classList.toggle('active', cat === state.activeCategory);
    }
  });
}

// ─── Render: Quick Filters ───────────────────────────────────────────────────

function renderQuickFilters(state: PanelState): HTMLElement {
  const row = create('div', 'zk2-filters-row');
  const filters = getLifeFilters(state.lang);

  for (const def of filters) {
    const chip = create(
      'button',
      `zk2-filter-chip${state.lifeFilters.has(def.id) ? ' active' : ''}`
    );
    chip.type = 'button';
    chip.textContent = def.label;
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

// ─── Render: Tool Card ───────────────────────────────────────────────────────

function renderToolCard(state: PanelState, result: SearchResult): HTMLElement {
  const { tool } = result;
  const copy = COPY[state.lang];

  const card = create('article', 'zk2-card');

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

  // Description (bestFor)
  const desc = create('p', 'zk2-card-desc');
  desc.textContent = tool.bestFor.length > 90 ? tool.bestFor.slice(0, 87) + '\u2026' : tool.bestFor;
  card.appendChild(desc);

  // Badges
  if (tool.badges.length > 0) {
    const badgesWrap = create('div', 'zk2-card-badges');
    for (const b of tool.badges.slice(0, 3)) {
      const badge = create('span', 'zk2-badge');
      badge.textContent = b;
      badgesWrap.appendChild(badge);
    }
    card.appendChild(badgesWrap);
  }

  // Footer: caveat + open button
  const footer = create('div', 'zk2-card-footer');

  if (tool.caveat) {
    const caveat = create('span', 'zk2-card-caveat');
    caveat.textContent = '\u26A0\uFE0F ' + tool.caveat;
    caveat.title = tool.caveat;
    footer.appendChild(caveat);
  }

  // URL (truncated)
  const urlEl = create('span', 'zk2-card-url');
  const rawUrl = tool.url;
  urlEl.textContent = rawUrl.length > 40 ? rawUrl.slice(0, 37) + '...' : rawUrl;
  urlEl.title = rawUrl;
  footer.appendChild(urlEl);

  const btn = create('a', 'zk2-card-cta');
  btn.href = tool.url;
  btn.target = '_blank';
  btn.rel = 'noopener noreferrer';
  btn.textContent = (tool.surface === 'cli' ? copy.docs : copy.open) + ' \u2192';
  btn.addEventListener('click', () => {
    state.onToolOpen?.();
  });
  footer.appendChild(btn);

  const reportBtn = create('button', 'zk2-card-report');
  reportBtn.type = 'button';
  reportBtn.textContent = state.lang === 'ja' ? '\u5831\u544a' : 'Report';
  reportBtn.title =
    state.lang === 'ja'
      ? '\u3053\u306e\u30C4\u30FC\u30EB\u3092\u5831\u544a'
      : 'Report this tool as broken';
  reportBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const issueUrl = `https://github.com/sakurablush/banal/issues/new?title=Broken+tool:+${encodeURIComponent(tool.name)}&body=Tool:+${encodeURIComponent(tool.name)}%0AURL:+${encodeURIComponent(tool.url)}%0A%0AProblem:`;
    window.open(issueUrl, '_blank', 'noopener,noreferrer');
  });
  footer.appendChild(reportBtn);

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

// ─── Render: Main Content (grid + load more) ────────────────────────────────

function renderContent(state: PanelState): void {
  const container = state.container;
  if (!container) return;

  // Keep sidebar and top bar, replace content area
  const contentArea = container.querySelector('.zk2-content') as HTMLElement | null;
  if (!contentArea) return;

  contentArea.innerHTML = '';

  const copy = COPY[state.lang];
  const results = state.results;
  const visible = results.slice(0, state.visibleCount);

  // Filters row
  const filtersRow = renderQuickFilters(state);
  contentArea.appendChild(filtersRow);

  // Stats bar
  const statsBar = create('div', 'zk2-stats-bar');
  statsBar.textContent = copy.showing(visible.length, results.length);
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

  // Grid
  const grid = create('div', 'zk2-grid');
  visible.forEach((result, i) => {
    const card = renderToolCard(state, result);
    card.style.animationDelay = `${Math.min(i * 20, 400)}ms`;
    grid.appendChild(card);
  });
  contentArea.appendChild(grid);

  // Load more
  if (visible.length < results.length) {
    const loadMoreWrap = create('div', 'zk2-load-more-wrap');
    const loadMoreBtn = create('button', 'zk2-load-more');
    loadMoreBtn.type = 'button';
    loadMoreBtn.textContent = copy.loadMore;
    loadMoreBtn.addEventListener('click', () => {
      state.visibleCount += PAGE_SIZE;
      renderContent(state);
    });
    loadMoreWrap.appendChild(loadMoreBtn);
    contentArea.appendChild(loadMoreWrap);
  }

  // Update sidebar active states
  updateSidebarActive(state);
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
  state.visibleCount = PAGE_SIZE;
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

  // Main layout: sidebar + content
  const layout = create('div', 'zk2-layout');

  // Sidebar
  const sidebar = renderCategorySidebar(state);
  layout.appendChild(sidebar);

  // Content area
  const content = create('div', 'zk2-content');
  layout.appendChild(content);

  container.appendChild(layout);

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
      updateSidebarActive(state);
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
