import { zeroKeyTools } from './zero-key-tools';
import { aiModels } from './ai-models';
import { toolStacks } from './tool-stacks';

export interface SiteStats {
  total: number;
  ai: number;
  dev: number;
  models: number;
  stacks: number;
}

/** Live counts from curated data — single source of truth for all page copy. */
export function getSiteStats(): SiteStats {
  const ai = zeroKeyTools.filter((t) => t.category.startsWith('ai-')).length;
  const dev = zeroKeyTools.filter((t) => t.category.startsWith('dev-')).length;
  return {
    total: zeroKeyTools.length,
    ai,
    dev,
    models: aiModels.length,
    stacks: toolStacks.length,
  };
}

/** Replace `{total}`, `{ai}`, `{dev}`, `{models}`, `{stacks}` in translated strings. */
export function interpolateSiteStats(text: string, stats: SiteStats = getSiteStats()): string {
  return text
    .replace(/\{total\}/g, String(stats.total))
    .replace(/\{ai\}/g, String(stats.ai))
    .replace(/\{dev\}/g, String(stats.dev))
    .replace(/\{models\}/g, String(stats.models))
    .replace(/\{stacks\}/g, String(stats.stacks));
}
