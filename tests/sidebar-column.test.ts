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
    expect(categories?.getAttribute('role')).toBe('navigation');
    expect(categories?.getAttribute('aria-labelledby')).toBe('test-categories');
    expect(categories?.querySelector('.zk2-sidebar-categories-heading')?.textContent).toBe(
      'Categories'
    );
    expect(categories?.querySelector('.zk2-sidebar')).toBe(sidebar);

    const panel = column.querySelector('.zk2-sidebar-filters');
    expect(panel).toBeTruthy();
    expect(column.children[0]).toBe(categories);
    expect(column.children[1]).toBe(panel);

    expect(panel?.getAttribute('role')).toBe('region');
    expect(panel?.getAttribute('aria-label')).toBe('Refine results');
    expect(panel?.getAttribute('aria-labelledby')).toBe('test-filters');
    const heading = panel?.querySelector('.zk2-sidebar-filters-heading');
    expect(heading?.textContent).toBe('Refine');
    expect(panel?.querySelector('.quick-filters-row')).toBeTruthy();
    expect(panel?.querySelector('.filter-toolbar--sidebar')).toBeTruthy();
    expect(panel?.querySelector('.zk2-sidebar-filters-divider')).toBeTruthy();
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
    expect(panel?.querySelector('.quick-filters-row')).toBeNull();
    expect(panel?.querySelector('.zk2-sidebar-filters-divider')).toBeNull();
    expect(panel?.querySelector('.filter-toolbar--sidebar')).toBeTruthy();
  });
});

describe('syncQuickFiltersInPanel', () => {
  it('replaces chips and removes divider when filters disappear', () => {
    const panel = document.createElement('div');
    panel.className = 'zk2-sidebar-filters';

    const oldFilters = document.createElement('div');
    oldFilters.className = 'quick-filters-row';
    oldFilters.appendChild(document.createElement('button'));

    const divider = document.createElement('div');
    divider.className = 'zk2-sidebar-filters-divider';

    const toolbar = document.createElement('div');
    toolbar.className = 'filter-toolbar';

    panel.append(oldFilters, divider, toolbar);

    syncQuickFiltersInPanel(panel, null);

    expect(panel.querySelector('.quick-filters-row')).toBeNull();
    expect(panel.querySelector('.zk2-sidebar-filters-divider')).toBeNull();
    expect(panel.querySelector('.filter-toolbar')).toBeTruthy();
  });

  it('inserts divider before toolbar when chips are added', () => {
    const panel = document.createElement('div');
    panel.className = 'zk2-sidebar-filters';

    const heading = document.createElement('h3');
    heading.className = 'zk2-sidebar-filters-heading';
    panel.appendChild(heading);

    const toolbar = document.createElement('div');
    toolbar.className = 'filter-toolbar';
    panel.appendChild(toolbar);

    const nextFilters = document.createElement('div');
    nextFilters.className = 'quick-filters-row';
    nextFilters.appendChild(document.createElement('button'));

    syncQuickFiltersInPanel(panel, nextFilters);

    const children = Array.from(panel.children).map((el) => el.className);
    expect(children).toEqual([
      'zk2-sidebar-filters-heading',
      'quick-filters-row',
      'zk2-sidebar-filters-divider',
      'filter-toolbar',
    ]);
  });
});
