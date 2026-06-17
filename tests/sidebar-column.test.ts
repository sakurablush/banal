import { describe, it, expect } from 'vitest';
import {
  buildSidebarFiltersPanel,
  createSidebarColumn,
  syncQuickFiltersInPanel,
} from '../src/lib/sidebar-column';

describe('createSidebarColumn', () => {
  it('places categories left and filters right in a two-column nav', () => {
    const sidebar = document.createElement('div');
    sidebar.className = 'zk2-sidebar';

    const quickFilters = document.createElement('div');
    quickFilters.className = 'quick-filters-row';
    quickFilters.appendChild(document.createElement('button'));

    const toolbar = document.createElement('div');
    toolbar.className = 'filter-toolbar';

    const column = createSidebarColumn({
      sidebar,
      quickFilters,
      toolbar,
      heading: 'Refine',
      headingId: 'test-filters',
      ariaLabel: 'Refine results',
      categoriesHeading: 'Categories',
      categoriesHeadingId: 'test-categories',
    });

    expect(column.className).toBe('zk2-sidebar-column');
    expect(column.children.length).toBe(2);

    const categories = column.querySelector('.zk2-sidebar-categories');
    expect(categories).toBeTruthy();
    const categoriesBody = categories?.querySelector('.zk2-sidebar-nav-panel');
    expect(categoriesBody?.getAttribute('role')).toBe('navigation');
    expect(categoriesBody?.getAttribute('aria-labelledby')).toBe('test-categories');
    expect(categories?.querySelector('.zk2-sidebar-categories-heading')?.textContent).toBe(
      'Categories'
    );
    expect(categoriesBody?.querySelector('.zk2-sidebar')).toBe(sidebar);

    const panel = column.querySelector('.zk2-sidebar-filters');
    expect(panel).toBeTruthy();
    expect(column.children[0]).toBe(categories);
    expect(column.children[1]).toBe(panel);

    const filtersBody = panel?.querySelector('.zk2-sidebar-nav-panel');
    expect(filtersBody?.getAttribute('role')).toBe('region');
    expect(filtersBody?.getAttribute('aria-label')).toBe('Refine results');
    expect(filtersBody?.getAttribute('aria-labelledby')).toBe('test-filters');
    const heading = panel?.querySelector('.zk2-sidebar-filters-heading');
    expect(heading?.textContent).toBe('Refine');
    expect(filtersBody?.querySelector('.zk2-refine-details')).toBeTruthy();
    expect(filtersBody?.querySelector('.zk2-refine-body .quick-filters-row')).toBeTruthy();
    expect(filtersBody?.querySelector('.zk2-refine-body .filter-toolbar--sidebar')).toBeTruthy();
    expect(
      filtersBody?.querySelector('.zk2-refine-body .zk2-sidebar-filters-divider')
    ).toBeTruthy();
  });

  it('uses single column when filters panel is omitted', () => {
    const sidebar = document.createElement('div');
    sidebar.className = 'zk2-sidebar';

    const column = createSidebarColumn({ sidebar });

    expect(column.classList.contains('zk2-sidebar-column--categories-only')).toBe(true);
    expect(column.querySelector('.zk2-sidebar-filters')).toBeNull();
    expect(column.querySelector('.zk2-sidebar-categories')).toBeTruthy();
    expect(column.children.length).toBe(1);
  });

  it('skips empty quick filter rows', () => {
    const quickFilters = document.createElement('div');
    quickFilters.className = 'quick-filters-row';

    const toolbar = document.createElement('div');
    toolbar.className = 'filter-toolbar';

    const panel = buildSidebarFiltersPanel({ quickFilters, toolbar });
    const body = panel?.querySelector('.zk2-refine-body');
    expect(body?.querySelector('.quick-filters-row')).toBeNull();
    expect(body?.querySelector('.zk2-sidebar-filters-divider')).toBeNull();
    expect(body?.querySelector('.filter-toolbar--sidebar')).toBeTruthy();
  });
});

describe('syncQuickFiltersInPanel', () => {
  it('replaces chips and removes divider when filters disappear', () => {
    const oldFilters = document.createElement('div');
    oldFilters.className = 'quick-filters-row';
    oldFilters.appendChild(document.createElement('button'));

    const toolbar = document.createElement('div');
    toolbar.className = 'filter-toolbar';

    const panel = buildSidebarFiltersPanel({
      quickFilters: oldFilters,
      toolbar,
      heading: 'Refine',
    })!;

    syncQuickFiltersInPanel(panel, null);

    const body = panel.querySelector('.zk2-refine-body')!;
    expect(body.querySelector('.quick-filters-row')).toBeNull();
    expect(body.querySelector('.zk2-sidebar-filters-divider')).toBeNull();
    expect(body.querySelector('.filter-toolbar')).toBeTruthy();
  });

  it('inserts divider before toolbar when chips are added', () => {
    const toolbar = document.createElement('div');
    toolbar.className = 'filter-toolbar';

    const panel = buildSidebarFiltersPanel({
      toolbar,
      heading: 'Refine',
    })!;

    const nextFilters = document.createElement('div');
    nextFilters.className = 'quick-filters-row';
    nextFilters.appendChild(document.createElement('button'));

    syncQuickFiltersInPanel(panel, nextFilters);

    const body = panel.querySelector('.zk2-refine-body')!;
    const children = Array.from(body.children).map((el) => el.className);
    expect(children).toEqual([
      'quick-filters-row',
      'zk2-sidebar-filters-divider',
      'filter-toolbar filter-toolbar--sidebar',
    ]);
  });
});
