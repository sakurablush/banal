import { describe, it, expect } from 'vitest';
import {
  PANEL_TILES_MIN_HEIGHT_PX,
  ZK2_CONTENT_MAX_HEIGHT_PX,
} from '../src/lib/layout-tokens';
import {
  computeZk2LayoutHeight,
  measureZk2SidebarNaturalHeight,
  syncZk2LayoutHeight,
} from '../src/lib/sync-zk2-layout-height';

describe('computeZk2LayoutHeight', () => {
  const min = PANEL_TILES_MIN_HEIGHT_PX;
  const max = ZK2_CONTENT_MAX_HEIGHT_PX;

  it('uses the default cap when the sidebar is shorter', () => {
    expect(computeZk2LayoutHeight(min, max, 500)).toBe(max);
    expect(computeZk2LayoutHeight(min, max, max)).toBe(max);
  });

  it('grows past the cap when the sidebar is taller', () => {
    expect(computeZk2LayoutHeight(min, max, max + 50)).toBe(max + 50);
    expect(computeZk2LayoutHeight(min, max, 2200)).toBe(2200);
  });

  it('never drops below the layout minimum', () => {
    expect(computeZk2LayoutHeight(min, max, 0)).toBe(max);
  });
});

describe('measureZk2SidebarNaturalHeight', () => {
  it('sums heading row and tallest nav panel content', () => {
    const column = document.createElement('div');
    column.className = 'zk2-sidebar-column';
    column.style.rowGap = '4px';

    const heading = document.createElement('h3');
    heading.className = 'zk2-sidebar-categories-heading';
    heading.getBoundingClientRect = () =>
      ({ height: 20, width: 0, top: 0, left: 0, right: 0, bottom: 0, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect;
    column.appendChild(heading);

    const panel = document.createElement('div');
    panel.className = 'zk2-sidebar-nav-panel';
    Object.defineProperty(panel, 'scrollHeight', { value: 320 });
    column.appendChild(panel);

    expect(measureZk2SidebarNaturalHeight(column)).toBe(344);
  });
});

describe('syncZk2LayoutHeight', () => {
  it('raises --zk2-layout-height when sidebar content exceeds the default cap', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: () => ({
        matches: false,
        media: '',
        addEventListener: () => {},
        removeEventListener: () => {},
      }),
    });

    const layout = document.createElement('div');
    layout.className = 'zk2-layout';
    layout.style.setProperty('--zk2-layout-min-height', `${PANEL_TILES_MIN_HEIGHT_PX}px`);
    layout.style.setProperty('--zk2-content-max-height', `${ZK2_CONTENT_MAX_HEIGHT_PX}px`);

    const column = document.createElement('div');
    column.className = 'zk2-sidebar-column';
    column.style.rowGap = '0px';

    const panel = document.createElement('div');
    panel.className = 'zk2-sidebar-nav-panel';
    Object.defineProperty(panel, 'scrollHeight', { value: 1900 });

    column.appendChild(panel);
    layout.appendChild(column);
    document.body.appendChild(layout);

    syncZk2LayoutHeight(layout);

    expect(layout.style.getPropertyValue('--zk2-layout-height')).toBe('1900px');

    layout.remove();
  });
});
