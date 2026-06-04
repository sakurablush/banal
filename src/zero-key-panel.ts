/**
 * Zero-Key Panel — search-first, keyboard-first, no-bullshit directory.
 * Uses fuse-search for instant fuzzy matching.
 */

import { type Lang } from './i18n';
import {
  categoryLabels,
  zeroKeyTools,
  type ZeroKeyTool,
} from './data/zero-key-tools';
import { type SearchResult, searchTools } from './fuse-search';

const COPY = {
  en: {
    title: '200+ Free AI Tools',
    intro: 'Chat, image, video, audio, coding, PDF, research. Every tool tested. No login. No card.',
    searchPlaceholder: 'Search tools… (Ctrl+K to focus)',
    clearFilters: 'Clear',
    open: 'Open',
    docs: 'Docs',
    noMatches: 'No matches. Try different keywords.',
    note: 'Prioritizes no-card access, OSS, public APIs.',
    warning: 'Shared/public devices: Clear ALL data after use. Never embed private API keys in public code.',
    result: (count: number, _label: string) => `${count} tools`,
  },
  ja: {
    title: '200+ 無料AIツール',
    intro: 'チャット、画像、動画、音声、coding、PDF。全ツール動作確認済み。ログイン不要。',
    searchPlaceholder: '検索… (Ctrl+K)',
    clearFilters: 'クリア',
    open: '開く',
    docs: 'ドキュメント',
    noMatches: '一致なし。別のキーワードで。',
    note: 'カード不要・OSS・公開APIを優先。',
    warning: '共有PC使用後は全クリア。APIキーを公開コードに埋め込まないでください。',
    result: (count: number, _label: string) => `${count}件`,
  },
} satisfies Record<
  Lang,
  {
    title: string;
    intro: string;
    searchPlaceholder: string;
    clearFilters: string;
    open: string;
    docs: string;
    noMatches: string;
    note: string;
    warning: string;
    result: (count: number, label: string) => string;
  }
>;

const activeLifeFilters: Set<string> = new Set();

interface LifeFilterDefinition {
  id: string;
  label: string;
  predicate: (tool: ZeroKeyTool, haystack: string) => boolean;
}

export interface ZeroKeyPanelOptions {
  lang: Lang;
  onToolOpen?: () => void;
}

const MAX_VISIBLE_BADGES = 4;

function create<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (className) el.className = className;
  return el;
}

function appendText<K extends keyof HTMLElementTagNameMap>(
  parent: HTMLElement,
  tag: K,
  className: string,
  text: string
): HTMLElementTagNameMap[K] {
  const el = create(tag, className);
  el.textContent = text;
  parent.appendChild(el);
  return el;
}

function getLifeFilters(lang: Lang): LifeFilterDefinition[] {
  const e = (en: string, ja: string) => (lang === 'ja' ? ja : en);
  return [
    {
      id: 'privacy',
      label: e('Private / shared device', '共有デバイスでプライベート'),
      predicate: (tool, h) =>
        tool.category === 'security-privacy' ||
        /private|privacy|encrypted|local|self-host|no signup|password|secret|shared/i.test(h),
    },
    {
      id: 'bureaucracy',
      label: e('Bureaucracy, letters, housing', '行政・手紙・役所・住宅'),
      predicate: (_tool, h) =>
        /letter|office|form|appeal|housing|landlord|bureaucracy|government|civic|public|docs|translate|weather|map|library/i.test(h),
    },
    {
      id: 'visual',
      label: e('Needs images / visuals', '画像・ビジュアルが必要'),
      predicate: (tool, h) =>
        tool.category === 'design-media' ||
        /image|visual|diagram|design|photo|media|video|audio|whiteboard|PSD/i.test(h),
    },
    {
      id: 'lowenergy',
      label: e('Low energy / 2am', '低エネルギー・夜中2時'),
      predicate: (tool, h) =>
        tool.surface === 'web' &&
        /no signup|simple|instant|browser|private|chat|notes|translate|docs|learning|quick/i.test(h),
    },
    {
      id: 'unlimited',
      label: e('Truly unlimited / generous', '本当に無制限'),
      predicate: (tool, h) =>
        tool.access === 'open-source' ||
        tool.access === 'self-host' ||
        /no key|no signup|self-host|open-source|local|generous/i.test(h),
    },
    {
      id: 'developer',
      label: e('Developer / API / CLI', '開発者・API・CLI'),
      predicate: (tool, h) =>
        tool.surface !== 'web' ||
        tool.category === 'coding-devtools' ||
        /developer|coding|api|cli|git|postgres|deploy|test|json|database/i.test(h),
    },
  ];
}

// ─── Search state ────────────────────────────

const MAX_RESULTS = 200;
const DEBOUNCE_MS = 60;

interface PanelState {
  lang: Lang;
  allTools: ZeroKeyTool[];
  results: SearchResult[];
  selectedIndex: number;
  query: string;
  onToolOpen?: () => void;
}

const panelState: PanelState = {
  lang: 'en',
  allTools: zeroKeyTools,
  results: [],
  selectedIndex: 0,
  query: '',
  onToolOpen: undefined,
};

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

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

function applyLifeFilters(results: SearchResult[]): SearchResult[] {
  if (activeLifeFilters.size === 0) return results;
  return results.filter(({ tool }) => {
    const haystack = buildHaystack(tool).toLowerCase();
    for (const filterId of activeLifeFilters) {
      const def = getLifeFilters(panelState.lang).find((c) => c.id === filterId);
      if (def && !def.predicate(tool, haystack)) return false;
    }
    return true;
  });
}

function performSearch(query: string): void {
  panelState.query = query;

  let results: SearchResult[];
  if (!query.trim()) {
    results = panelState.allTools.map((tool) => ({ tool, score: 0, matches: {} }));
  } else {
    results = searchTools(panelState.allTools, query, MAX_RESULTS);
  }

  results = applyLifeFilters(results);
  panelState.results = results;
  panelState.selectedIndex = results.length > 0 ? 0 : -1;

  renderResultsList();
}

function debouncedSearch(query: string): void {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => performSearch(query), DEBOUNCE_MS);
}

function highlightMatch(text: string, query: string): string {
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>');
}

// ─── Render ──────────────────────────────────

function renderResultsList(): void {
  const root = document.getElementById('zero-key-directory-root');
  if (!root) return;
  root.innerHTML = '';

  const results = panelState.results;

  // Stats bar
  const stats = create('div', 'zk-stats');
  appendText(stats, 'span', 'zk-stats-count', `${results.length} tools`);
  if (activeLifeFilters.size > 0) {
    appendText(stats, 'span', 'zk-stats-filters', `${activeLifeFilters.size} filters active`);
  }
  root.appendChild(stats);

  // Life filters row
  const filtersRow = create('div', 'zk-filters');
  const filters = getLifeFilters(panelState.lang);
  filters.forEach((def) => {
    const chip = create('button');
    chip.type = 'button';
    chip.textContent = def.label;
    chip.className = `zk-chip${activeLifeFilters.has(def.id) ? ' active' : ''}`;
    chip.addEventListener('click', () => {
      if (activeLifeFilters.has(def.id)) {
        activeLifeFilters.delete(def.id);
      } else {
        activeLifeFilters.add(def.id);
      }
      performSearch(panelState.query);
    });
    filtersRow.appendChild(chip);
  });
  root.appendChild(filtersRow);

  // Results
  if (results.length === 0) {
    const empty = create('div', 'zk-empty');
    empty.textContent = COPY[panelState.lang].noMatches;
    root.appendChild(empty);
    return;
  }

  const list = create('div', 'zk-list');
  results.forEach((result, index) => {
    const row = buildToolRow(result, index === panelState.selectedIndex);
    list.appendChild(row);
  });
  root.appendChild(list);
}

function buildToolRow(result: SearchResult, isSelected: boolean): HTMLElement {
  const { tool, matches } = result;
  const row = create('div', `zk-row${isSelected ? ' selected' : ''}`);

  // Name
  const nameEl = create('span', 'zk-row-name');
  if (matches.name && panelState.query.trim()) {
    nameEl.innerHTML = highlightMatch(tool.name, panelState.query.trim());
  } else {
    nameEl.textContent = tool.name;
  }
  row.appendChild(nameEl);

  // Badges
  const badgesWrap = create('div', 'zk-row-badges');
  tool.badges.slice(0, MAX_VISIBLE_BADGES).forEach((b: string) => {
    const badgeEl = create('span', 'zk-badge');
    badgeEl.textContent = b;
    badgesWrap.appendChild(badgeEl);
  });
  row.appendChild(badgesWrap);

  // Surface
  const surf = create('span', `zk-surf zk-surf-${tool.surface}`);
  surf.textContent = tool.surface.toUpperCase();
  row.appendChild(surf);

  // Actions
  const actions = create('div', 'zk-row-actions');

  if (tool.caveat) {
    const caveat = create('span', 'zk-caveat');
    caveat.title = tool.caveat;
    caveat.textContent = '⚠';
    actions.appendChild(caveat);
  }

  const btn = create('button');
  btn.type = 'button';
  btn.className = 'zk-btn-open';
  btn.textContent = tool.surface === 'cli' ? COPY[panelState.lang].docs : COPY[panelState.lang].open;
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    panelState.onToolOpen?.();
    window.open(tool.url, '_blank', 'noopener,noreferrer');
  });
  actions.appendChild(btn);

  row.appendChild(actions);
  row.addEventListener('click', () => {
    panelState.onToolOpen?.();
    window.open(tool.url, '_blank', 'noopener,noreferrer');
  });

  return row;
}

// ─── Keyboard nav ────────────────────────────

function handleKeyboard(e: KeyboardEvent): void {
  const list = document.querySelector('.zk-list');
  if (!list) return;
  const rows = list.querySelectorAll('.zk-row');
  if (rows.length === 0) return;

  const len = panelState.results.length;

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      panelState.selectedIndex = (panelState.selectedIndex + 1) % len;
      syncSelection(rows);
      break;
    case 'ArrowUp':
      e.preventDefault();
      panelState.selectedIndex = (panelState.selectedIndex - 1 + len) % len;
      syncSelection(rows);
      break;
    case 'Enter': {
      e.preventDefault();
      const sel = panelState.results[panelState.selectedIndex];
      if (sel) {
        panelState.onToolOpen?.();
        window.open(sel.tool.url, '_blank', 'noopener,noreferrer');
      }
      break;
    }
    case 'Escape': {
      e.preventDefault();
      const input = document.getElementById('zk-search-input') as HTMLInputElement | null;
      if (input) {
        input.value = '';
        performSearch('');
      }
      break;
    }
    case 'k':
      if ((e.ctrlKey || e.metaKey) && panelState.lang) {
        e.preventDefault();
        (document.getElementById('zk-search-input') as HTMLInputElement | null)?.focus();
      }
      break;
  }
}

function syncSelection(rows: NodeListOf<Element>): void {
  rows.forEach((row, i) => {
    row.classList.toggle('selected', i === panelState.selectedIndex);
    if (i === panelState.selectedIndex) {
      row.scrollIntoView({ block: 'nearest' });
    }
  });
}

// ─── Public API ──────────────────────────────

export function renderZeroKeyPowerPanel(
  container: HTMLElement,
  options: ZeroKeyPanelOptions
): void {
  const { lang, onToolOpen } = options;

  panelState.lang = lang;
  panelState.onToolOpen = onToolOpen;
  panelState.query = '';
  panelState.selectedIndex = 0;
  panelState.results = zeroKeyTools.map((tool) => ({ tool, score: 0, matches: {} }));

  container.innerHTML = '';

  // Skeleton loading for perceived performance
  const skeletonWrap = create('div', 'skeleton-wrap');
  for (let i = 0; i < 8; i++) {
    const row = create('div', 'skeleton-row');
    const nameBar = create('div', 'skeleton-bar medium');
    const badgesBar = create('div', 'skeleton-bar short');
    const surfacePill = create('div', 'skeleton-pill');
    row.appendChild(nameBar);
    row.appendChild(badgesBar);
    row.appendChild(surfacePill);
    skeletonWrap.appendChild(row);
  }
  container.appendChild(skeletonWrap);

  // Real content swapped in next frame (feels instant but polished)
  requestAnimationFrame(() => {
    skeletonWrap.remove();
    renderResultsList();
  });

  // Header
  const header = create('div', 'zk-header');
  appendText(header, 'h3', 'zk-title', COPY[lang].title);
  appendText(header, 'span', 'zk-count', `${zeroKeyTools.length} tools`);
  container.appendChild(header);

  // Search
  const searchWrap = create('div', 'zk-search-wrap');
  const icon = create('span', 'zk-search-icon');
  icon.textContent = '⌕';
  searchWrap.appendChild(icon);

  const input = create('input');
  input.type = 'text';
  input.id = 'zk-search-input';
  input.className = 'zk-search-input';
  input.placeholder = COPY[lang].searchPlaceholder;
  input.autocomplete = 'off';
  input.spellcheck = false;

  input.addEventListener('input', () => debouncedSearch(input.value));
  input.addEventListener('keydown', handleKeyboard);
  searchWrap.appendChild(input);
  container.appendChild(searchWrap);

  const resultsRoot = create('div');
  resultsRoot.id = 'zero-key-directory-root';
  container.appendChild(resultsRoot);

  // Initial render
  renderResultsList();

  // Life filter chips
  const filtersBlock = create('div', 'zk-filters-block');
  const filters = getLifeFilters(lang);
  filters.forEach((def) => {
    const chip = create('button');
    chip.type = 'button';
    chip.className = `zk-chip${activeLifeFilters.has(def.id) ? ' active' : ''}`;
    chip.textContent = def.label;
    chip.addEventListener('click', () => {
      activeLifeFilters.has(def.id) ? activeLifeFilters.delete(def.id) : activeLifeFilters.add(def.id);
      performSearch(panelState.query);
    });
    filtersBlock.appendChild(chip);
  });
  container.appendChild(filtersBlock);

  // Global Ctrl+K
  const shortcutHandler = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      input.focus();
      input.select();
    }
  };
  document.addEventListener('keydown', shortcutHandler);
  container.dataset.shortcutHandler = 'true';
}

export function resetZeroKeyPanelFiltersForTests(): void {
  activeLifeFilters.clear();
  panelState.query = '';
  panelState.selectedIndex = 0;
}
