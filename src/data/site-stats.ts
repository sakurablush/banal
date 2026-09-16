import { zeroKeyTools } from './zero-key-tools';
import { AI_MODEL_COUNT, PROMPT_TEMPLATE_COUNT, TOOL_STACK_COUNT } from './catalog-counts';

export interface SiteStats {
  total: number;
  ai: number;
  dev: number;
  models: number;
  stacks: number;
  prompts: number;
}

/** Live counts from curated data — single source of truth for all page copy. */
export function getSiteStats(): SiteStats {
  const ai = zeroKeyTools.filter((t) => t.category.startsWith('ai-')).length;
  const dev = zeroKeyTools.filter((t) => t.category.startsWith('dev-')).length;
  return {
    total: zeroKeyTools.length,
    ai,
    dev,
    models: AI_MODEL_COUNT,
    stacks: TOOL_STACK_COUNT,
    prompts: PROMPT_TEMPLATE_COUNT,
  };
}

/** Replace `{total}`, `{ai}`, `{dev}`, `{models}`, `{stacks}`, `{prompts}` in translated strings. */
export function interpolateSiteStats(text: string, stats: SiteStats = getSiteStats()): string {
  return text
    .replace(/\{total\}/g, String(stats.total))
    .replace(/\{ai\}/g, String(stats.ai))
    .replace(/\{dev\}/g, String(stats.dev))
    .replace(/\{models\}/g, String(stats.models))
    .replace(/\{stacks\}/g, String(stats.stacks))
    .replace(/\{prompts\}/g, String(stats.prompts));
}
