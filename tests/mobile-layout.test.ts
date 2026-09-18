import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  buildSidebarFiltersPanel,
  createSidebarColumn,
  syncRefineSummary,
} from '../src/lib/sidebar-column';

describe('mobile layout structure', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  function mockRefineViewport(desktop: boolean): void {
    vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => ({
      matches: desktop && query.includes('901px'),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }));
  }

  it('wraps filter content in collapsible refine details', () => {
    const quickFilters = document.createElement('div');
    quickFilters.className = 'quick-filters-row';
    quickFilters.appendChild(document.createElement('button'));

    const toolbar = document.createElement('div');
    toolbar.className = 'filter-toolbar';

    const panel = buildSidebarFiltersPanel({
      quickFilters,
      toolbar,
      heading: 'Refine',
      headingId: 'mobile-refine',
    });

    expect(panel?.querySelector('.zk2-refine-details')).toBeTruthy();
    expect(panel?.querySelector('.zk2-refine-summary')).toBeTruthy();
    expect(panel?.querySelector('.zk2-refine-body .quick-filters-row')).toBeTruthy();
    expect(panel?.querySelector('.zk2-refine-body .filter-toolbar--sidebar')).toBeTruthy();

    const summary = panel?.querySelector('.zk2-refine-summary');
    expect(summary?.getAttribute('aria-labelledby')).toBe('mobile-refine');
  });

  it('places categories before filters in DOM order', () => {
    const sidebar = document.createElement('div');
    sidebar.className = 'zk2-sidebar';

    const column = createSidebarColumn({
      sidebar,
      quickFilters: null,
      toolbar: document.createElement('div'),
      heading: 'Refine',
      categoriesHeading: 'Categories',
    });

    expect(column.children[0]?.classList.contains('zk2-sidebar-categories')).toBe(true);
    expect(column.children[1]?.classList.contains('zk2-sidebar-filters')).toBe(true);
  });

  it('syncRefineSummary renders active count and pills', () => {
    const panel = buildSidebarFiltersPanel({
      quickFilters: document.createElement('div'),
      toolbar: document.createElement('div'),
      heading: 'Refine',
    })!;

    syncRefineSummary(panel, {
      lang: 'en',
      activeCount: 4,
      activeLabels: ['No Signup', 'Browser', 'CLI', 'API'],
    });

    const meta = panel.querySelector('.zk2-refine-summary-meta');
    expect(meta?.textContent).toBe('4 active');

    const pills = panel.querySelectorAll('.zk2-refine-active-pill');
    expect(pills.length).toBe(4);
    expect(pills[3]?.textContent).toBe('+1 more');
  });

  it('starts collapsed on mobile viewport', () => {
    mockRefineViewport(false);

    const panel = buildSidebarFiltersPanel({
      quickFilters: document.createElement('div'),
      toolbar: document.createElement('div'),
      heading: 'Refine',
    })!;

    const details = panel.querySelector('.zk2-refine-details') as HTMLDetailsElement;
    expect(details.open).toBe(false);
  });

  it('starts expanded on desktop viewport', () => {
    mockRefineViewport(true);

    const panel = buildSidebarFiltersPanel({
      quickFilters: document.createElement('div'),
      toolbar: document.createElement('div'),
      heading: 'Refine',
    })!;

    const details = panel.querySelector('.zk2-refine-details') as HTMLDetailsElement;
    expect(details.open).toBe(true);
  });

  it('opens refine details when filters are active until user toggles', () => {
    mockRefineViewport(false);

    const panel = buildSidebarFiltersPanel({
      quickFilters: document.createElement('div'),
      toolbar: document.createElement('div'),
      heading: 'Refine',
    })!;

    const details = panel.querySelector('.zk2-refine-details') as HTMLDetailsElement;
    expect(details.open).toBe(false);

    syncRefineSummary(panel, {
      lang: 'en',
      activeCount: 1,
      activeLabels: ['Browser'],
    });
    expect(details.open).toBe(true);

    syncRefineSummary(panel, {
      lang: 'en',
      activeCount: 2,
      activeLabels: ['Browser', 'CLI'],
    });
    expect(details.open).toBe(true);

    panel.querySelector('.zk2-refine-summary')?.dispatchEvent(new MouseEvent('click'));
    details.open = false;
    expect(details.open).toBe(false);

    syncRefineSummary(panel, {
      lang: 'en',
      activeCount: 3,
      activeLabels: ['Browser', 'CLI', 'API'],
    });
    expect(details.open).toBe(false);
  });
});
