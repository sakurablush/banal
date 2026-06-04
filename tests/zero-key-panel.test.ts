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

  it('renders search input and tool rows', () => {
    const root = renderPanel();

    expect(root.querySelector('#zk-search-input')).not.toBeNull();
    expect(root.querySelectorAll('.zk-row').length).toBe(zeroKeyTools.length);
  });

  it('searches across names, categories, badges, and use cases', () => {
    const root = renderPanel();
    const input = root.querySelector('#zk-search-input') as HTMLInputElement;

    input.value = 'Postgres';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    // Flush debounce
    vi.advanceTimersByTime(100);

    expect(root.textContent).toContain('Supabase');
    expect(root.textContent).toContain('Neon');
    expect(root.querySelectorAll('.zk-row').length).toBeGreaterThan(0);
  });

  it('filters by life context without breaking results', () => {
    const root = renderPanel();
    const developerFilter = Array.from(root.querySelectorAll('button')).find((btn) =>
      (btn.textContent || '').includes('Developer')
    ) as HTMLButtonElement;

    developerFilter.click();

    expect(root.querySelectorAll('.zk-row').length).toBeGreaterThan(0);
  });

  it('shows clear empty state for impossible searches', () => {
    const root = renderPanel();
    const input = root.querySelector('#zk-search-input') as HTMLInputElement;

    input.value = 'zzzz-no-such-zero-key-tool';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    // Flush debounce
    vi.advanceTimersByTime(100);

    expect(root.textContent).toContain('No matches');
    expect(root.querySelectorAll('.zk-row').length).toBe(0);
  });

  it('fires open callback when a tool button is clicked', () => {
    const onToolOpen = vi.fn();
    const root = renderPanel('en', onToolOpen);
    const openBtn = root.querySelector('.zk-btn-open') as HTMLButtonElement;

    openBtn.click();

    expect(onToolOpen).toHaveBeenCalledTimes(1);
  });
});
