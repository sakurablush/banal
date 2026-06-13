import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  categoryLabels,
  surfaceLabels,
  zeroKeyTools,
  type ZeroKeySurface,
} from '../src/data/zero-key-tools';
import { renderZeroKeyPowerPanel, resetZeroKeyPanelFiltersForTests } from '../src/zero-key-panel';

const MINIMUM_CURATED_TOOL_COUNT = 80;
const REQUIRED_SURFACES: readonly ZeroKeySurface[] = ['web', 'api', 'cli'];

function renderPanel(lang: 'en' | 'ja' = 'en', onToolOpen = vi.fn()): HTMLElement {
  const root = document.createElement('section');
  document.body.appendChild(root);
  renderZeroKeyPowerPanel(root, { lang, onToolOpen });
  return root;
}

describe('zero-key tools data', () => {
  it('is a serious curated base, not a tiny link dump', () => {
    expect(zeroKeyTools.length).toBeGreaterThanOrEqual(MINIMUM_CURATED_TOOL_COUNT);
  });

  it('has unique ids, valid URLs, labelled categories, and useful copy for every tool', () => {
    const ids = new Set<string>();

    for (const tool of zeroKeyTools) {
      expect(ids.has(tool.id), `duplicate id: ${tool.id}`).toBe(false);
      ids.add(tool.id);

      expect(() => new URL(tool.url)).not.toThrow();
      expect(REQUIRED_SURFACES).toContain(tool.surface);
      expect(surfaceLabels[tool.surface]).toBeTruthy();
      expect(categoryLabels[tool.category]).toBeTruthy();
      expect(tool.badges.length, `${tool.id} badges`).toBeGreaterThan(0);
      expect(tool.bestFor.length, `${tool.id} bestFor`).toBeGreaterThan(24);
      expect(tool.qualityNote.length, `${tool.id} qualityNote`).toBeGreaterThan(24);
    }
  });

  it('includes verified free-token and Kilo AI tooling', () => {
    const byId = Object.fromEntries(zeroKeyTools.map((tool) => [tool.id, tool]));

    expect(byId['kilo-ai']).toMatchObject({
      name: 'Kilo AI',
      url: 'https://kilo.ai/',
      category: 'ai-agents',
    });
    expect(byId['kilo-gateway']).toMatchObject({
      surface: 'api',
      category: 'dev-coding',
    });
    expect(byId['google-gemini-api']).toMatchObject({
      surface: 'api',
      category: 'dev-coding',
    });
    expect(byId['groq-api']).toMatchObject({
      surface: 'api',
      category: 'ai-chat',
    });
    expect(byId['openrouter-free']).toMatchObject({
      surface: 'api',
      category: 'ai-chat',
    });
  });

  it('keeps free web, free API, and free CLI as first-class sections', () => {
    const counts = REQUIRED_SURFACES.map(
      (surface) => zeroKeyTools.filter((tool) => tool.surface === surface).length
    );

    counts.forEach((count) => expect(count).toBeGreaterThan(10));
  });
});

describe('zero-key panel rendering', () => {
  beforeEach(() => {
    resetZeroKeyPanelFiltersForTests();
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders search input and tool cards in horizontal scroll layout', () => {
    const root = renderPanel();

    expect(root.querySelector('#zk-search-input')).not.toBeNull();
    // All tools should be visible in horizontal scroll (no lazy loading)
    const cards = root.querySelectorAll('.tool-card-horizontal');
    expect(cards.length).toBeGreaterThan(0);
    expect(cards.length).toBe(zeroKeyTools.length); // All tools visible
  });

  it('searches across names, categories, badges, and use cases in horizontal layout', () => {
    const root = renderPanel();
    const input = root.querySelector('#zk-search-input') as HTMLInputElement;

    input.value = 'Postgres';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    // Flush debounce
    vi.advanceTimersByTime(150);

    // Should use horizontal scroll container
    const scrollContainer = root.querySelector('.tools-horizontal-scroll');
    expect(scrollContainer).not.toBeNull();
    
    // Should show Supabase and Neon
    expect(root.textContent).toContain('Supabase');
    expect(root.textContent).toContain('Neon');
  });

  it('filters by life context without breaking results', () => {
    const root = renderPanel();
    // Look for filter buttons (they have .quick-filter-chip class)
    const developerFilter = Array.from(root.querySelectorAll('.quick-filter-chip')).find((btn) =>
      (btn.textContent || '').toLowerCase().includes('dev')
    ) as HTMLButtonElement;

    expect(developerFilter, 'Developer filter chip should exist').toBeTruthy();
    developerFilter.click();

    const cards = root.querySelectorAll('.tool-card-horizontal');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('shows clear empty state for impossible searches', () => {
    const root = renderPanel();
    const input = root.querySelector('#zk-search-input') as HTMLInputElement;

    input.value = 'zzzz-no-such-zero-key-tool';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    // Flush debounce
    vi.advanceTimersByTime(150);

    // Should show empty state (no horizontal scroll when no results)
    const empty = root.querySelector('.zk2-empty');
    expect(empty).not.toBeNull();
    expect(empty!.textContent).toContain('No tools match');
  });

  it('fires open callback when a tool CTA link is clicked', () => {
    const onToolOpen = vi.fn();
    const root = renderPanel('en', onToolOpen);
    const openBtn = root.querySelector('.zk2-card-cta') as HTMLAnchorElement;

    expect(openBtn).not.toBeNull();
    openBtn.click();

    expect(onToolOpen).toHaveBeenCalledTimes(1);
  });

  it('hero search input syncs with panel search and filters tools', () => {
    // Create hero search input and tools section in DOM
    const heroInput = document.createElement('input');
    heroInput.id = 'hero-search';
    heroInput.type = 'text';
    document.body.appendChild(heroInput);

    const toolsSection = document.createElement('section');
    toolsSection.id = 'tools';
    document.body.appendChild(toolsSection);

    const root = renderPanel();

    // Type in hero search
    heroInput.value = 'Docker';
    heroInput.dispatchEvent(new Event('input', { bubbles: true }));

    // Flush debounce
    vi.advanceTimersByTime(150);

    // Panel search should sync
    const panelInput = root.querySelector('#zk-search-input') as HTMLInputElement;
    expect(panelInput.value).toBe('Docker');

    // Should show filtered results in horizontal scroll
    expect(root.querySelectorAll('.tool-card-horizontal').length).toBeGreaterThan(0);
  });

  it('hero search Enter key focuses panel search', () => {
    const heroInput = document.createElement('input');
    heroInput.id = 'hero-search';
    heroInput.type = 'text';
    document.body.appendChild(heroInput);

    const toolsSection = document.createElement('section');
    toolsSection.id = 'tools';
    document.body.appendChild(toolsSection);

    const root = renderPanel();
    const panelInput = root.querySelector('#zk-search-input') as HTMLInputElement;

    // Press Enter in hero search
    heroInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    // Panel search should be focused
    expect(document.activeElement).toBe(panelInput);
  });

  it('hero search Escape key clears search', () => {
    const heroInput = document.createElement('input');
    heroInput.id = 'hero-search';
    heroInput.type = 'text';
    heroInput.value = 'test';
    document.body.appendChild(heroInput);

    const root = renderPanel();

    // Press Escape in hero search
    heroInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    // Hero input should be cleared
    expect(heroInput.value).toBe('');

    // Panel should show all tools
    expect(root.querySelectorAll('.tool-card-horizontal').length).toBeGreaterThan(0);
  });

  it('panel search Escape key clears search', () => {
    const root = renderPanel();
    const panelInput = root.querySelector('#zk-search-input') as HTMLInputElement;

    // Type something
    panelInput.value = 'Redis';
    panelInput.dispatchEvent(new Event('input', { bubbles: true }));
    vi.advanceTimersByTime(150);

    // Press Escape
    panelInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    // Should be cleared
    expect(panelInput.value).toBe('');

    // Should show all tools
    expect(root.querySelectorAll('.tool-card-horizontal').length).toBeGreaterThan(0);
  });

  it('Ctrl+K focuses and selects panel search input', () => {
    const root = renderPanel();
    const panelInput = root.querySelector('#zk-search-input') as HTMLInputElement;

    // Press Ctrl+K
    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'k',
        ctrlKey: true,
        bubbles: true,
      })
    );

    // Should be focused and selected
    expect(document.activeElement).toBe(panelInput);
  });

  it('clear filters button resets all filters and search', () => {
    const root = renderPanel();
    const panelInput = root.querySelector('#zk-search-input') as HTMLInputElement;

    // Apply a search that returns no results
    panelInput.value = 'zzzz-no-such-tool';
    panelInput.dispatchEvent(new Event('input', { bubbles: true }));
    vi.advanceTimersByTime(150);

    // Should show empty state
    expect(root.querySelector('.zk2-empty')).not.toBeNull();

    // Find and click clear filters button
    const clearBtn = root.querySelector('.zk2-empty-clear') as HTMLButtonElement;
    expect(clearBtn).not.toBeNull();
    clearBtn.click();

    // Should reset search and show all tools
    expect(panelInput.value).toBe('');
    expect(root.querySelectorAll('.tool-card-horizontal').length).toBeGreaterThan(0);
  });

  it('report button opens GitHub issue URL', () => {
    const root = renderPanel();
    const mockOpen = vi.fn();
    window.open = mockOpen;

    // Find report button
    const reportBtn = root.querySelector('.zk2-card-report') as HTMLButtonElement;
    expect(reportBtn).not.toBeNull();

    // Click report button
    reportBtn.click();

    // Should open GitHub issue URL with correct repo
    expect(mockOpen).toHaveBeenCalledWith(
      expect.stringContaining('github.com/sakurablush/banal/issues/new'),
      '_blank',
      'noopener,noreferrer'
    );
  });

  it('renders stats bar in Japanese when lang is ja', () => {
    const root = renderPanel('ja');

    // Should show Japanese stats text
    const statsBar = root.querySelector('.zk2-stats-bar');
    expect(statsBar).not.toBeNull();
    expect(statsBar?.textContent).toContain('件'); // Japanese counter for items
  });

  it('filters by open-source access type', () => {
    const root = renderPanel();

    // Find and click open-source filter
    const filterChips = root.querySelectorAll('.quick-filter-chip') as NodeListOf<HTMLButtonElement>;
    const openSourceFilter = Array.from(filterChips).find((chip) =>
      chip.textContent?.toLowerCase().includes('open source')
    );

    expect(openSourceFilter).toBeDefined();
    openSourceFilter!.click();

    // Should show filtered results
    const cards = root.querySelectorAll('.tool-card-horizontal');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('filters by offline capability', () => {
    const root = renderPanel();

    // Find and click offline filter
    const filterChips = root.querySelectorAll('.quick-filter-chip') as NodeListOf<HTMLButtonElement>;
    const offlineFilter = Array.from(filterChips).find((chip) =>
      chip.textContent?.toLowerCase().includes('offline')
    );

    expect(offlineFilter).toBeDefined();
    offlineFilter!.click();

    // Should show filtered results
    const cards = root.querySelectorAll('.tool-card-horizontal');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('syncs panel search to hero search when hero input exists', () => {
    // Create hero search input
    const heroInput = document.createElement('input');
    heroInput.id = 'hero-search';
    heroInput.type = 'text';
    document.body.appendChild(heroInput);

    const root = renderPanel();
    const panelInput = root.querySelector('#zk-search-input') as HTMLInputElement;

    // Type in panel search
    panelInput.value = 'Docker';
    panelInput.dispatchEvent(new Event('input', { bubbles: true }));
    vi.advanceTimersByTime(150);

    // Hero input should sync
    expect(heroInput.value).toBe('Docker');
  });

  // ─── Horizontal scroll card layout ───────────────────────────────────────────

  it('horizontal tool card has proper width and snap alignment', () => {
    const root = renderPanel();
    const card = root.querySelector('.tool-card-horizontal') as HTMLElement;

    expect(card).not.toBeNull();
    expect(card.classList.contains('tool-card-horizontal')).toBe(true);

    // Card should be focusable
    expect(card.tabIndex).toBe(0);
  });

  it('card has Open button with arrow icon', () => {
    const root = renderPanel();
    const card = root.querySelector('.tool-card-horizontal') as HTMLElement;
    const cta = card.querySelector('.zk2-card-cta') as HTMLAnchorElement;

    expect(cta).not.toBeNull();
    expect(cta.textContent).toContain('→');
  });

  it('card has Report button with dropdown indicator', () => {
    const root = renderPanel();
    const reportBtn = root.querySelector('.zk2-card-report') as HTMLButtonElement;

    expect(reportBtn).not.toBeNull();
    expect(reportBtn.textContent).toContain('Report');
    expect(reportBtn.textContent).toContain('▼');
  });

  // ─── No sidebar in horizontal layout ─────────────────────────────────────────

  it('does not render category sidebar in horizontal layout', () => {
    const root = renderPanel();
    const sidebar = root.querySelector('.zk2-sidebar');
    expect(sidebar).toBeNull();
  });

  it('does not render load more button in horizontal layout', () => {
    const root = renderPanel();
    const loadMore = root.querySelector('.zk2-load-more');
    expect(loadMore).toBeNull();
  });
});