import { describe, it, expect } from 'vitest';
import {
  createPanelStatsBar,
  createPanelContentHead,
  createPanelScrollArea,
  mountPanelContent,
} from '../src/lib/panel-stats-bar';

describe('createPanelStatsBar', () => {
  it('creates an accessible stats row element', () => {
    const bar = createPanelStatsBar('zk2-stats-bar', 'Showing 12 of 178 tools');

    expect(bar.className).toBe('zk2-stats-bar');
    expect(bar.getAttribute('role')).toBe('status');
    expect(bar.getAttribute('aria-live')).toBe('polite');
    expect(bar.getAttribute('aria-atomic')).toBe('true');
    expect(bar.textContent).toBe('Showing 12 of 178 tools');
  });
});

describe('mountPanelContent', () => {
  it('mounts fixed head and scrollable body so tiles never sit under the stats row', () => {
    const container = document.createElement('div');
    const bar = createPanelStatsBar('zk2-stats-bar', 'Showing 3 of 10 tools');

    mountPanelContent(container, bar, (scroll) => {
      const grid = document.createElement('div');
      grid.className = 'zk2-grid';
      scroll.appendChild(grid);
    });

    const head = container.querySelector('.panel-content-head');
    const scroll = container.querySelector('.panel-content-scroll');
    expect(head?.querySelector('.zk2-stats-bar')).toBe(bar);
    expect(scroll?.querySelector('.zk2-grid')).toBeTruthy();
    expect(head?.nextElementSibling).toBe(scroll);
  });
});

describe('panel content shell helpers', () => {
  it('createPanelContentHead wraps the stats bar', () => {
    const bar = createPanelStatsBar('models-stats-bar', '2 models');
    const head = createPanelContentHead(bar);
    expect(head.className).toBe('panel-content-head');
    expect(head.firstElementChild).toBe(bar);
  });

  it('createPanelScrollArea returns scroll container', () => {
    const scroll = createPanelScrollArea();
    expect(scroll.className).toBe('panel-content-scroll');
  });
});
