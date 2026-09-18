/**
 * Progressive Filtering Engine — Context-aware filter system for the redesigned directory.
 * Shows only relevant filters based on current selection, detects contradictions,
 * and supports filter presets.
 */

import type { FilterState, FilterPreset, TagDefinition, ToolCategory } from '../types/tool';
import { ALL_TAGS, getNonContradictingTags, getTagsForToolCategory } from '../data/tags';
import { CATEGORY_DEFINITIONS } from '../data/categories';
import type { ZeroKeyTool } from '../data/zero-key-tools';

// ─── Filter State Management ────────────────────────────────────────────────

export function createInitialFilterState(): FilterState {
  return {
    category: null,
    subcategory: null,
    tags: [],
    searchQuery: '',
    platforms: [],
    sortBy: 'relevance',
  };
}

// ─── Progressive Tag Visibility ─────────────────────────────────────────────

/**
 * Get visible tags based on current filter state.
 * Shows only tags that are:
 * 1. Applicable to the selected category
 * 2. Not contradicting active filters
 * 3. Sorted by relevance
 */
export function getVisibleTags(state: FilterState): TagDefinition[] {
  // 1. Get tags applicable to selected category
  let applicableTags: TagDefinition[];
  if (state.category) {
    applicableTags = getTagsForToolCategory(state.category);
  } else {
    applicableTags = ALL_TAGS;
  }

  // 2. Filter out contradicting tags
  const nonContradicting = getNonContradictingTags(applicableTags, state.tags);

  // 3. Sort: active tags first, then by category, then alphabetically
  return nonContradicting.sort((a, b) => {
    const aActive = state.tags.includes(a.id) ? 0 : 1;
    const bActive = state.tags.includes(b.id) ? 0 : 1;
    if (aActive !== bActive) return aActive - bActive;
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    return a.label.localeCompare(b.label);
  });
}

/**
 * Get available subcategories based on selected category.
 */
export function getAvailableSubcategories(category: ToolCategory | null): string[] {
  if (!category) return [];
  const def = CATEGORY_DEFINITIONS.find((c) => c.id === category);
  return def?.subcategories || [];
}

/**
 * Get available categories grouped by domain.
 */
export function getCategoriesByDomain(): Array<{
  domain: string;
  domainLabel: string;
  domainIcon: string;
  categories: Array<{ id: ToolCategory; label: string; icon: string }>;
}> {
  const domains = ['ai', 'dev', 'prod', 'design', 'business', 'infra'] as const;
  const result: Array<{
    domain: string;
    domainLabel: string;
    domainIcon: string;
    categories: Array<{ id: ToolCategory; label: string; icon: string }>;
  }> = [];

  for (const domain of domains) {
    const cats = CATEGORY_DEFINITIONS.filter((c) => c.domain === domain);
    if (cats.length === 0) continue;

    const domainDef = {
      ai: { label: 'AI & Machine Learning', icon: '\u{1F916}' },
      dev: { label: 'Development & DevOps', icon: '\u{1F4BB}' },
      prod: { label: 'Productivity', icon: '\u{1F4CB}' },
      design: { label: 'Design & Creative', icon: '\u{1F3A8}' },
      business: { label: 'Business', icon: '\u{1F4C8}' },
      infra: { label: 'Infrastructure', icon: '\u{1F680}' },
    } as const;

    result.push({
      domain,
      domainLabel: domainDef[domain].label,
      domainIcon: domainDef[domain].icon,
      categories: cats.map((c) => ({ id: c.id, label: c.label, icon: c.icon })),
    });
  }

  return result;
}

// ─── Tool Filtering ─────────────────────────────────────────────────────────

/**
 * Apply progressive filters to a list of tools.
 * Combines category, tag, and platform filters.
 */
export function applyProgressiveFilters(
  tools: readonly ZeroKeyTool[],
  state: FilterState
): ZeroKeyTool[] {
  let filtered = [...tools];

  // Category filter
  if (state.category) {
    filtered = filtered.filter((t) => t.category === state.category);
  }

  // Tag filters (using existing badge/access/surface fields)
  if (state.tags.length > 0) {
    filtered = filtered.filter((tool) => {
      return state.tags.every((tagId) => matchesTag(tool, tagId));
    });
  }

  // Platform filters
  if (state.platforms.length > 0) {
    filtered = filtered.filter((tool) => {
      return state.platforms.some((platform) => matchesPlatform(tool, platform));
    });
  }

  // Sort
  filtered = sortTools(filtered, state.sortBy);

  return filtered;
}

/**
 * Check if a tool matches a specific tag.
 * Maps new tag IDs to existing tool fields.
 */
function matchesTag(tool: ZeroKeyTool, tagId: string): boolean {
  const haystack = [
    tool.name,
    tool.url,
    tool.surface,
    tool.category,
    tool.access,
    ...tool.badges,
    tool.bestFor,
    tool.qualityNote,
    tool.caveat || '',
  ]
    .join(' ')
    .toLowerCase();

  switch (tagId) {
    // Access tags
    case 'no-signup':
      return tool.requiresSignup === false;
    case 'free-signup':
      return tool.requiresSignup === true;
    case 'no-api-key':
      return tool.requiresSignup === false || tool.access === 'open-source';
    case 'byok':
      return /byok|bring your own key/i.test(haystack);
    case 'open-source':
      return tool.access === 'open-source';
    case 'self-hosted':
      return tool.access === 'self-host' || tool.access === 'open-source';
    case 'cloud-hosted':
      return tool.access !== 'self-host';

    // Pricing tags
    case 'free-forever':
      return tool.access === 'no-login' || tool.access === 'open-source';
    case 'free-tier':
      return tool.access === 'free-tier' || tool.access === 'free-key';
    case 'free-tokens':
      return /free token|free credit|hugging face|google ai studio|cohere|trial/i.test(haystack);
    case 'freemium':
      return tool.access === 'free-tier' && (tool.caveat?.toLowerCase().includes('paid') ?? false);
    case 'rate-limited':
      return (
        (tool.caveat?.toLowerCase().includes('rate limit') ?? false) ||
        (tool.caveat?.toLowerCase().includes('daily') ?? false)
      );
    case 'daily-limit':
      return tool.caveat?.toLowerCase().includes('daily') ?? false;
    case 'monthly-limit':
      return tool.caveat?.toLowerCase().includes('month') ?? false;

    // Platform tags
    case 'browser':
      return tool.surface === 'web';
    case 'cli':
      return tool.surface === 'cli';
    case 'api':
      return tool.surface === 'api';
    case 'vscode':
      return /vs ?code|vscode/i.test(haystack);
    case 'jetbrains':
      return /jetbrains|intellij|webstorm|pycharm/i.test(haystack);
    case 'neovim':
      return /neovim|nvim/i.test(haystack);
    case 'docker':
      return /docker|container/i.test(haystack);

    // Capability tags
    case 'local-models':
      return /local|ollama|lm studio|jan|offline/i.test(haystack);
    case 'cloud-models':
      return /cloud|api|hosted|server/i.test(haystack);
    case 'multi-model':
      return /multi.?model|multiple model|many model/i.test(haystack);
    case 'gpu-required':
      return /gpu required|needs gpu|gpu.*required/i.test(haystack);
    case 'cpu-only':
      return /cpu only|no gpu|cpu.*only/i.test(haystack);
    case 'low-hardware':
      return /low.?end|low.?resource|old laptop|modest hardware/i.test(haystack);
    case 'high-context':
      return /1M|256K|400K|10M|2M/i.test(haystack);
    case 'vision':
      return /vision|image.*understand|multimodal/i.test(haystack);
    case 'code-generation':
      return /code.*gen|generates.*code|coding/i.test(haystack);
    case 'reasoning':
      return /reasoning|chain.?of.?thought|thinking/i.test(haystack);
    case 'multilingual':
      return /multilingual|chinese|japanese|korean|spanish/i.test(haystack);
    case 'agent':
      return /agent|autonomous|orchestrat/i.test(haystack);
    case 'rag':
      return /rag|retrieval.?augment/i.test(haystack);
    case 'function-calling':
      return /function.?call|tool.?use/i.test(haystack);
    case 'git-integration':
      return /git|version control/i.test(haystack);
    case 'ci-cd':
      return /ci.?cd|pipeline|deploy/i.test(haystack);
    case 'testing':
      return /test|e2e|playwright/i.test(haystack);
    case 'debugging':
      return /debug|inspect|trace/i.test(haystack);
    case 'deployment':
      return /deploy|hosting|publish/i.test(haystack);
    case 'monitoring':
      return /monitor|uptime|observ/i.test(haystack);

    // Quality tags
    case 'privacy-friendly':
      return /private|privacy|encrypted|local/i.test(haystack);
    case 'no-telemetry':
      return /no telemetry|zero telemetry|no tracking/i.test(haystack);
    case 'encrypted':
      return /encrypt|e2e|end.?to.?end/i.test(haystack);
    case 'beginner-friendly':
      return /beginner|easy|simple|friendly/i.test(haystack);
    case 'verified':
      return tool.lastVerified !== undefined;
    case 'community-trusted':
      return /community|trusted|popular|beloved/i.test(haystack);
    case 'enterprise-ready':
      return /enterprise|production|soc2|hipaa/i.test(haystack);
    case 'freelancer-friendly':
      return /freelanc|client|project/i.test(haystack);
    case 'indie-hacker':
      return /indie|startup|launch|mvp/i.test(haystack);

    default:
      return true;
  }
}

/**
 * Check if a tool matches a platform filter.
 */
function matchesPlatform(tool: ZeroKeyTool, platform: string): boolean {
  switch (platform) {
    case 'web':
      return tool.surface === 'web';
    case 'cli':
      return tool.surface === 'cli';
    case 'api':
      return tool.surface === 'api';
    default:
      return true;
  }
}

/**
 * Sort tools by the given criteria.
 */
function sortTools(tools: ZeroKeyTool[], sortBy: FilterState['sortBy']): ZeroKeyTool[] {
  switch (sortBy) {
    case 'name':
      return tools.sort((a, b) => a.name.localeCompare(b.name));
    case 'newest':
      return tools.sort((a, b) => {
        const aDate = a.lastVerified || '';
        const bDate = b.lastVerified || '';
        return bDate.localeCompare(aDate);
      });
    case 'relevance':
    case 'popularity':
    default:
      return tools; // Keep original order (curated)
  }
}

// ─── Filter Preset Application ──────────────────────────────────────────────

/**
 * Apply a filter preset to the current state.
 */
export function applyFilterPreset(state: FilterState, preset: FilterPreset): FilterState {
  return {
    ...state,
    ...preset.filters,
    tags: [...(state.tags || []), ...(preset.filters.tags || [])],
  };
}

/**
 * Serialize filter state to URL params for sharing.
 */
export function serializeFilterState(state: FilterState): string {
  const params = new URLSearchParams();
  if (state.category) params.set('cat', state.category);
  if (state.subcategory) params.set('sub', state.subcategory);
  if (state.tags.length > 0) params.set('tags', state.tags.join(','));
  if (state.searchQuery) params.set('q', state.searchQuery);
  if (state.sortBy !== 'relevance') params.set('sort', state.sortBy);
  return params.toString();
}

/**
 * Deserialize filter state from URL params.
 */
export function deserializeFilterState(params: URLSearchParams): Partial<FilterState> {
  const state: Partial<FilterState> = {};
  const cat = params.get('cat');
  if (cat) state.category = cat as ToolCategory;
  const sub = params.get('sub');
  if (sub) state.subcategory = sub as FilterState['subcategory'];
  const tags = params.get('tags');
  if (tags) state.tags = tags.split(',');
  const q = params.get('q');
  if (q) state.searchQuery = q;
  const sort = params.get('sort');
  if (sort) state.sortBy = sort as FilterState['sortBy'];
  return state;
}
