import { describe, it, expect } from 'vitest';
import { getSiteStats, interpolateSiteStats } from '../src/data/site-stats';
import { zeroKeyTools } from '../src/data/zero-key-tools';

describe('site-stats', () => {
  it('counts tools from live data', () => {
    const stats = getSiteStats();
    const ai = zeroKeyTools.filter((t) => t.category.startsWith('ai-')).length;
    const dev = zeroKeyTools.filter((t) => t.category.startsWith('dev-')).length;

    expect(stats.total).toBe(zeroKeyTools.length);
    expect(stats.ai).toBe(ai);
    expect(stats.dev).toBe(dev);
    expect(stats.total).toBe(stats.ai + stats.dev);
  });

  it('interpolates placeholders in copy strings', () => {
    const stats = getSiteStats();
    const text = '{total} tools — {ai} AI, {dev} dev, {models} models, {stacks} stacks';
    expect(interpolateSiteStats(text, stats)).toBe(
      `${stats.total} tools — ${stats.ai} AI, ${stats.dev} dev, ${stats.models} models, ${stats.stacks} stacks`
    );
  });
});
