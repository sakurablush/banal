import { describe, it, expect } from 'vitest';
import { createPanelStatsBar } from '../src/lib/panel-stats-bar';

describe('createPanelStatsBar', () => {
  it('creates an accessible sticky stats row element', () => {
    const bar = createPanelStatsBar('zk2-stats-bar', 'Showing 12 of 178 tools');

    expect(bar.className).toBe('zk2-stats-bar');
    expect(bar.getAttribute('role')).toBe('status');
    expect(bar.getAttribute('aria-live')).toBe('polite');
    expect(bar.getAttribute('aria-atomic')).toBe('true');
    expect(bar.textContent).toBe('Showing 12 of 178 tools');
  });
});
