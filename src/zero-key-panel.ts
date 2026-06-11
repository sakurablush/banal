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
import { type SearchResult, searchTools } from './fuse-search';

// ─── Category Icons ──────────────────────────────────────────────────────────

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

const activeLifeFilters: Set<string> = new Set();

function getLifeFilters(lang: Lang): LifeFilterDefinition[] {
  const e = (en: string, ja: string) => (lang === 'ja' ? ja : en);
  return [
    {
      id: 'no-signup',
      label: e('No signup', '\u30A2\u30AB\u30A6\u30F3\u30C8\u4E0D\u8981'),
      predicate: (tool, h) =>
        tool.access === 'no-login' ||
        tool.access === 'public-api' ||
        /no signup|no login|no account|anonymous/i.test(h),
    },
    {
      id: 'open-source',
      label: e('Open source', '\u30AA\u30FC\u30D7\u30F3\u30BD\u30FC\u30B9'),
      predicate: (tool) => tool.access === 'open-source' || tool.access === 'self-host',
    },
    {
      id: 'offline',
      label: e('Works offline', '\u30AA\u30D5\u30E9\u30A4\u30F3\u5BFE\u5FDC'),
      predicate: (tool, h) =>
        tool.access === 'open-source' ||
        tool.surface === 'cli' ||
        /local|offline|desktop|self-host|WebGPU/i.test(h),
    },
    {
      id: 'developer',
      label: e('For devs', '\u958B\u767A\u8005\u5411\u3051'),
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
}

const state: PanelState = {
  lang: 'en',
  allTools: zeroKeyTools,
  results: [],
  query: '',
  activeCategory: null,
  visibleCount: PAGE_SIZE,
  onToolOpen: undefined,
  container: null,
  categoryPrefix: undefined,
};

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let heroAbortController: AbortController | null = null;
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

function getCategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  const tools = state.categoryPrefix
    ? state.allTools.filter((t) => t.category.startsWith(state.categoryPrefix!))
    : state.allTools;
  for (const tool of tools) {
    counts[tool.category] = (counts[tool.category] || 0) + 1;
  }
  return counts;
}

// ─── Search & Filter Logic ───────────────────────────────────────────────────

function applyLifeFilters(results: SearchResult[]): SearchResult[] {
  if (activeLifeFilters.size === 0) return results;
  const filters = getLifeFilters(state.lang);
  const activeFilterDefs = filters.filter((f) => activeLifeFilters.has(f.id));
  if (activeFilterDefs.length === 0) return results;
  return results.filter(({ tool }) => {
    const haystack = buildHaystack(tool).toLowerCase();
    for (const def of activeFilterDefs) {
      if (!def.predicate(tool, haystack)) return false;
    }
    return true;
  });
}

function applyCategoryFilter(results: SearchResult[]): SearchResult[] {
  if (!state.activeCategory) return results;
  return results.filter(({ tool }) => tool.category === state.activeCategory);
}

function performSearch(query: string): void {
  state.query = query;
  state.visibleCount = PAGE_SIZE;

  // Filter tools by category prefix if specified
  const filteredTools = state.categoryPrefix
    ? state.allTools.filter((t) => t.category.startsWith(state.categoryPrefix!))
    : state.allTools;

  let results: SearchResult[];
  if (!query.trim()) {
    results = filteredTools.map((tool) => ({ tool, score: 0, matches: {} }));
  } else {
    results = searchTools(filteredTools, query, MAX_RESULTS);
  }

  results = applyCategoryFilter(results);
  results = applyLifeFilters(results);
  state.results = results;

  renderContent();
}

function debouncedSearch(query: string): void {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => performSearch(query), DEBOUNCE_MS);
}

// ─── Sync hero search ↔ panel search ────────────────────────────────────────

function syncSearchInputs(value: string, source: 'hero' | 'panel'): void {
  const heroInput = document.getElementById('hero-search') as HTMLInputElement | null;
  const panelInput = document.getElementById('zk-search-input') as HTMLInputElement | null;

  if (source === 'hero' && panelInput && panelInput.value !== value) {
    panelInput.value = value;
  }
  if (source === 'panel' && heroInput && heroInput.value !== value) {
    heroInput.value = value;
  }
}

// ─── Render: Category Sidebar ────────────────────────────────────────────────

function renderCategorySidebar(): HTMLElement {
  const sidebar = create('aside', 'zk2-sidebar');
  const counts = getCategoryCounts();
  const copy = COPY[state.lang];

  // Filter categories by prefix if specified
  const allCategories = Object.keys(categoryLabels) as ZeroKeyCategory[];
  const categories = state.categoryPrefix
    ? allCategories.filter((cat) => cat.startsWith(state.categoryPrefix!))
    : allCategories;

  // "All" item
  const allItem = create('button', `zk2-cat-item${!state.activeCategory ? ' active' : ''}`);
  allItem.type = 'button';
  const totalTools = state.categoryPrefix
    ? state.allTools.filter((t) => t.category.startsWith(state.categoryPrefix!)).length
    : state.allTools.length;
  allItem.innerHTML = `<span class="zk2-cat-label">${copy.allCategory}</span><span class="zk2-cat-count">${totalTools}</span>`;
  allItem.addEventListener('click', () => {
    state.activeCategory = null;
    performSearch(state.query);
    updateSidebarActive();
  });
  sidebar.appendChild(allItem);

  // Category items
  for (const cat of categories) {
    const count = counts[cat] || 0;
    if (count === 0) continue;

    const item = create('button', `zk2-cat-item${state.activeCategory === cat ? ' active' : ''}`);
    item.type = 'button';
    item.dataset.category = cat;
    item.innerHTML = `<span class="zk2-cat-icon">${categoryIcons[cat]}</span><span class="zk2-cat-label">${categoryLabels[cat].split(' ').slice(0, 3).join(' ')}</span><span class="zk2-cat-count">${count}</span>`;
    item.addEventListener('click', () => {
      state.activeCategory = state.activeCategory === cat ? null : cat;
      performSearch(state.query);
      updateSidebarActive();
    });
    sidebar.appendChild(item);
  }

  return sidebar;
}

function updateSidebarActive(): void {
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

function renderQuickFilters(): HTMLElement {
  const row = create('div', 'zk2-filters-row');
  const filters = getLifeFilters(state.lang);

  for (const def of filters) {
    const chip = create(
      'button',
      `zk2-filter-chip${activeLifeFilters.has(def.id) ? ' active' : ''}`
    );
    chip.type = 'button';
    chip.textContent = def.label;
    chip.addEventListener('click', () => {
      if (activeLifeFilters.has(def.id)) {
        activeLifeFilters.delete(def.id);
      } else {
        activeLifeFilters.add(def.id);
      }
      performSearch(state.query);
    });
    row.appendChild(chip);
  }

  return row;
}

// ─── Render: Tool Card ───────────────────────────────────────────────────────

function renderToolCard(result: SearchResult): HTMLElement {
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
    const issueUrl = `https://github.com/banal-ai/banal/issues/new?title=Broken+tool:+${encodeURIComponent(tool.name)}&body=Tool:+${encodeURIComponent(tool.name)}%0AURL:+${encodeURIComponent(tool.url)}%0A%0AProblem:`;
    window.open(issueUrl, '_blank', 'noopener,noreferrer');
  });
  footer.appendChild(reportBtn);

  card.appendChild(footer);

  return card;
}

// ─── Render: Empty State ─────────────────────────────────────────────────────

function renderEmptyState(): HTMLElement {
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
    activeLifeFilters.clear();
    const heroInput = document.getElementById('hero-search') as HTMLInputElement | null;
    const panelInput = document.getElementById('zk-search-input') as HTMLInputElement | null;
    if (heroInput) heroInput.value = '';
    if (panelInput) panelInput.value = '';
    performSearch('');
  });
  return empty;
}

// ─── Render: Main Content (grid + load more) ────────────────────────────────

function renderContent(): void {
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
  const filtersRow = renderQuickFilters();
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
    contentArea.appendChild(renderEmptyState());
    return;
  }

  // Grid
  const grid = create('div', 'zk2-grid');
  visible.forEach((result, i) => {
    const card = renderToolCard(result);
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
      renderContent();
    });
    loadMoreWrap.appendChild(loadMoreBtn);
    contentArea.appendChild(loadMoreWrap);
  }

  // Update sidebar active states
  updateSidebarActive();
}

// ─── Keyboard Navigation ─────────────────────────────────────────────────────

function handleGlobalKeyboard(e: KeyboardEvent): void {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    const input = document.getElementById('zk-search-input') as HTMLInputElement | null;
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
): void {
  const { lang, onToolOpen, categoryPrefix } = options;

  // Abort previous hero listeners to prevent accumulation on re-render
  if (heroAbortController) {
    heroAbortController.abort();
  }
  heroAbortController = new AbortController();
  const { signal } = heroAbortController;

  // Reset all state including life filters
  activeLifeFilters.clear();
  state.lang = lang;
  state.onToolOpen = onToolOpen;
  state.categoryPrefix = categoryPrefix;
  state.query = '';
  state.activeCategory = null;
  state.visibleCount = PAGE_SIZE;
  
  // Filter tools by category prefix if specified
  const filteredTools = categoryPrefix
    ? zeroKeyTools.filter((t) => t.category.startsWith(categoryPrefix))
    : zeroKeyTools;
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
    syncSearchInputs(searchInput.value, 'panel');
    debouncedSearch(searchInput.value);
  });
  searchWrap.appendChild(searchInput);
  container.appendChild(searchWrap);

  // Main layout: sidebar + content
  const layout = create('div', 'zk2-layout');

  // Sidebar
  const sidebar = renderCategorySidebar();
  layout.appendChild(sidebar);

  // Content area
  const content = create('div', 'zk2-content');
  layout.appendChild(content);

  container.appendChild(layout);

  // Wire hero search (with AbortController to prevent listener accumulation)
  const heroInput = document.getElementById('hero-search') as HTMLInputElement | null;
  if (heroInput) {
    heroInput.addEventListener(
      'input',
      () => {
        syncSearchInputs(heroInput.value, 'hero');
        debouncedSearch(heroInput.value);

        // Scroll to tools section when user starts typing in hero
        if (heroInput.value.trim()) {
          const toolsSection = document.getElementById('tools');
          if (toolsSection) {
            toolsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
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
          const toolsSection = document.getElementById('tools');
          if (toolsSection) {
            toolsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
        if (e.key === 'Escape') {
          heroInput.value = '';
          syncSearchInputs('', 'hero');
          performSearch('');
        }
      },
      { signal }
    );
  }

  // Panel search keyboard
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchInput.value = '';
      syncSearchInputs('', 'panel');
      performSearch('');
    }
  });

  // Global Ctrl+K (only attach once — addEventListener deduplicates same fn reference)
  if (!globalKeyboardAttached) {
    document.addEventListener('keydown', handleGlobalKeyboard);
    globalKeyboardAttached = true;
  }

  // Initial render (use performSearch to apply any state correctly)
  performSearch(state.query);
}

export function resetZeroKeyPanelFiltersForTests(): void {
  activeLifeFilters.clear();
  state.query = '';
  state.activeCategory = null;
  state.visibleCount = PAGE_SIZE;
}
