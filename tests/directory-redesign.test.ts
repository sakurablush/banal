/**
 * Tests for the new AI Tools Directory redesign components:
 * - Categories system
 * - Tags system
 * - AI Models data
 * - Tool Stacks data
 * - Inference Providers data
 * - Progressive filtering engine
 */

import { describe, it, expect } from 'vitest';
import {
  CATEGORY_DEFINITIONS,
  DOMAINS,
  getDomainForCategory,
  getCategoriesForDomain,
  getCategoryDefinition,
  getDomainDefinition,
  getCategoryLabel,
  getCategoryIcon,
  matchesCategoryPrefix,
  getCategoryCountsByDomain,
} from '../src/data/categories';
import type { ToolCategory } from '../src/types/tool';
import {
  ALL_TAGS,
  ACCESS_TAGS,
  PRICING_TAGS,
  PLATFORM_TAGS,
  CAPABILITY_TAGS,
  QUALITY_TAGS,
  getTagDefinition,
  getTagsByCategory,
  tagsContradict,
  contradictsActiveFilters,
  getNonContradictingTags,
  FILTER_PRESETS,
} from '../src/data/tags';
import {
  aiModels,
  getModelById,
  getModelsByFamily,
  getModelsByBestFor,
  getConsumerModels,
  getModelFamilies,
  getModelLicenses,
} from '../src/data/ai-models';
import {
  toolStacks,
  getStackById,
  getStacksByAudience,
  getStacksByBudget,
  getZeroBudgetStacks,
  getStackAudiences,
} from '../src/data/tool-stacks';
import { zeroKeyTools } from '../src/data/zero-key-tools';
import {
  inferenceProviders,
  getProviderById,
  getNoCardProviders,
  getOpenAICompatibleProviders,
} from '../src/data/inference-providers';
import {
  filtersToUrl,
  urlToFilters,
  getSavedFilters,
  saveFilter,
  deleteSavedFilter,
} from '../src/lib/filter-sharing';
import {
  createInitialFilterState,
  getVisibleTags,
  getAvailableSubcategories,
  getCategoriesByDomain,
  serializeFilterState,
  deserializeFilterState,
  applyProgressiveFilters,
} from '../src/lib/progressive-filter';

// ─── Categories Tests ───────────────────────────────────────────────────────

describe('Categories System', () => {
  it('should have 6 domains', () => {
    expect(DOMAINS).toHaveLength(6);
  });

  it('should have category definitions', () => {
    expect(CATEGORY_DEFINITIONS.length).toBeGreaterThan(20);
  });

  it('should map categories to domains correctly', () => {
    expect(getDomainForCategory('ai-chat')).toBe('ai');
    expect(getDomainForCategory('dev-editors')).toBe('dev');
    expect(getDomainForCategory('prod-notes')).toBe('prod');
    expect(getDomainForCategory('design-ui')).toBe('design');
  });

  it('should get categories for a domain', () => {
    const aiCats = getCategoriesForDomain('ai');
    expect(aiCats.length).toBeGreaterThan(5);
    expect(aiCats.every((c) => c.domain === 'ai')).toBe(true);
  });

  it('should get category definition by ID', () => {
    const def = getCategoryDefinition('ai-chat');
    expect(def).toBeDefined();
    expect(def?.label).toBe('Chat & Assistants');
  });

  it('should get category label with fallback', () => {
    expect(getCategoryLabel('ai-chat')).toBe('Chat & Assistants');
    expect(getCategoryLabel('unknown' as any)).toBe('unknown');
  });

  it('should get category icon with fallback', () => {
    expect(getCategoryIcon('ai-chat')).toBeTruthy();
    expect(getCategoryIcon('unknown' as any)).toBe('\u{1F4E6}');
  });

  it('should match category prefixes for backward compat', () => {
    expect(matchesCategoryPrefix('ai-chat', 'ai')).toBe(true);
    expect(matchesCategoryPrefix('ai-chat', 'dev')).toBe(false);
    expect(matchesCategoryPrefix('dev-editors', 'dev')).toBe(true);
    expect(matchesCategoryPrefix('dev-editors', 'ai')).toBe(false);
  });

  it('should get domain definition by ID', () => {
    const def = getDomainDefinition('ai');
    expect(def).toBeDefined();
    expect(def?.label).toBe('AI & Machine Learning');
    expect(def?.icon).toBeTruthy();
  });

  it('should return undefined for invalid domain', () => {
    const def = getDomainDefinition('invalid' as any);
    expect(def).toBeUndefined();
  });

  it('should count categories by domain', () => {
    const categories = ['ai-chat', 'ai-image', 'dev-editors', 'prod-notes'] as ToolCategory[];
    const counts = getCategoryCountsByDomain(categories);
    
    expect(counts.ai).toBe(2);
    expect(counts.dev).toBe(1);
    expect(counts.prod).toBe(1);
    expect(counts.design).toBe(0);
    expect(counts.business).toBe(0);
    expect(counts.infra).toBe(0);
  });

  it('should handle empty category list', () => {
    const counts = getCategoryCountsByDomain([] as ToolCategory[]);
    expect(counts.ai).toBe(0);
    expect(counts.dev).toBe(0);
  });
});

// ─── Tags Tests ─────────────────────────────────────────────────────────────

describe('Tags System', () => {
  it('should have all 5 tag categories', () => {
    expect(ACCESS_TAGS.length).toBeGreaterThan(0);
    expect(PRICING_TAGS.length).toBeGreaterThan(0);
    expect(PLATFORM_TAGS.length).toBeGreaterThan(0);
    expect(CAPABILITY_TAGS.length).toBeGreaterThan(0);
    expect(QUALITY_TAGS.length).toBeGreaterThan(0);
  });

  it('should have combined ALL_TAGS', () => {
    const total =
      ACCESS_TAGS.length +
      PRICING_TAGS.length +
      PLATFORM_TAGS.length +
      CAPABILITY_TAGS.length +
      QUALITY_TAGS.length;
    expect(ALL_TAGS).toHaveLength(total);
  });

  it('should get tag definition by ID', () => {
    const tag = getTagDefinition('no-signup');
    expect(tag).toBeDefined();
    expect(tag?.category).toBe('access');
  });

  it('should get tags by category', () => {
    const accessTags = getTagsByCategory('access');
    expect(accessTags.length).toBe(ACCESS_TAGS.length);
    expect(accessTags.every((t) => t.category === 'access')).toBe(true);
  });

  it('should detect contradictions', () => {
    expect(tagsContradict('no-signup', 'free-signup')).toBe(true);
    expect(tagsContradict('free-signup', 'no-signup')).toBe(true);
    expect(tagsContradict('gpu-required', 'cpu-only')).toBe(true);
    expect(tagsContradict('self-hosted', 'cloud-hosted')).toBe(true);
    expect(tagsContradict('no-signup', 'browser')).toBe(false);
  });

  it('should check contradictions against active filters', () => {
    expect(contradictsActiveFilters('free-signup', ['no-signup'])).toBe(true);
    expect(contradictsActiveFilters('browser', ['no-signup'])).toBe(false);
  });

  it('should filter out contradicting tags', () => {
    const available = ALL_TAGS.filter((t) => t.category === 'access');
    const filtered = getNonContradictingTags(available, ['no-signup']);
    expect(filtered.find((t) => t.id === 'free-signup')).toBeUndefined();
    expect(filtered.find((t) => t.id === 'no-signup')).toBeDefined();
  });

  it('should have filter presets', () => {
    expect(FILTER_PRESETS.length).toBeGreaterThan(0);
    for (const preset of FILTER_PRESETS) {
      expect(preset.id).toBeTruthy();
      expect(preset.name).toBeTruthy();
      expect(preset.filters).toBeDefined();
    }
  });
});

// ─── AI Models Tests ────────────────────────────────────────────────────────

describe('AI Models Data', () => {
  it('should have 30+ models', () => {
    expect(aiModels.length).toBeGreaterThanOrEqual(30);
  });

  it('should get model by ID', () => {
    const model = getModelById('deepseek-v4-pro');
    expect(model).toBeDefined();
    expect(model?.name).toContain('DeepSeek');
  });

  it('should get models by family', () => {
    const qwenModels = getModelsByFamily('Qwen');
    expect(qwenModels.length).toBeGreaterThan(0);
    expect(qwenModels.every((m) => m.family === 'Qwen')).toBe(true);
  });

  it('should get models by best-for use case', () => {
    const codingModels = getModelsByBestFor('coding');
    expect(codingModels.length).toBeGreaterThan(0);
  });

  it('should get consumer-friendly models', () => {
    const consumer = getConsumerModels();
    expect(consumer.length).toBeGreaterThan(0);
    expect(consumer.every((m) => m.hardware.gpu !== 'required')).toBe(true);
  });

  it('should get model families', () => {
    const families = getModelFamilies();
    expect(families.length).toBeGreaterThan(5);
    expect(families).toContain('Qwen');
    expect(families).toContain('Llama');
  });

  it('should get model licenses', () => {
    const licenses = getModelLicenses();
    expect(licenses.length).toBeGreaterThan(0);
    expect(licenses).toContain('MIT');
    expect(licenses).toContain('Apache 2.0');
  });

  it('should have valid model data', () => {
    for (const model of aiModels) {
      expect(model.id).toBeTruthy();
      expect(model.name).toBeTruthy();
      expect(model.provider).toBeTruthy();
      expect(model.family).toBeTruthy();
      expect(model.parameters.total).toBeTruthy();
      expect(model.contextWindow).toBeTruthy();
      expect(model.license.type).toBeTruthy();
      expect(model.hardware.minRam).toBeTruthy();
      expect(model.bestFor.length).toBeGreaterThan(0);
    }
  });
});

// ─── Tool Stacks Tests ──────────────────────────────────────────────────────

describe('Tool Stacks Data', () => {
  it('should have 8+ stacks', () => {
    expect(toolStacks.length).toBeGreaterThanOrEqual(8);
  });

  it('should get stack by ID', () => {
    const stack = getStackById('saas-mvp-zero');
    expect(stack).toBeDefined();
    expect(stack?.name.toLowerCase()).toMatch(/web app|saas/);
  });

  it('should get stacks by audience', () => {
    const devStacks = getStacksByAudience('developer');
    expect(devStacks.length).toBeGreaterThan(0);
  });

  it('should get stacks by budget', () => {
    const zeroStacks = getStacksByBudget('zero');
    expect(zeroStacks.length).toBeGreaterThan(0);
  });

  it('should get zero-budget stacks', () => {
    const zero = getZeroBudgetStacks();
    expect(zero.length).toBeGreaterThan(0);
    expect(zero.every((s) => s.audience.budget === 'zero')).toBe(true);
  });

  it('should get stack audiences', () => {
    const audiences = getStackAudiences();
    expect(audiences.length).toBeGreaterThan(0);
  });

  it('should have valid stack data', () => {
    for (const stack of toolStacks) {
      expect(stack.id).toBeTruthy();
      expect(stack.name).toBeTruthy();
      expect(stack.description).toBeTruthy();
      expect(stack.tools.length).toBeGreaterThan(0);
      expect(stack.workflow.length).toBeGreaterThan(0);
      expect(stack.cost.total).toBeTruthy();
      expect(stack.cost.breakdown.length).toBeGreaterThan(0);
    }
  });
});

// ─── Inference Providers Tests ──────────────────────────────────────────────

describe('Inference Providers Data', () => {
  it('should have 8+ providers', () => {
    expect(inferenceProviders.length).toBeGreaterThanOrEqual(8);
  });

  it('should get provider by ID', () => {
    const provider = getProviderById('groq');
    expect(provider).toBeDefined();
    expect(provider?.name).toContain('Groq');
  });

  it('should get no-card providers', () => {
    const noCard = getNoCardProviders();
    expect(noCard.length).toBeGreaterThan(0);
    expect(noCard.every((p) => !p.freeTier.requiresCard)).toBe(true);
  });

  it('should get OpenAI-compatible providers', () => {
    const compat = getOpenAICompatibleProviders();
    expect(compat.length).toBeGreaterThan(0);
    expect(compat.every((p) => p.apiFormat === 'openai-compatible')).toBe(true);
  });

  it('should have valid provider data', () => {
    for (const provider of inferenceProviders) {
      expect(provider.id).toBeTruthy();
      expect(provider.name).toBeTruthy();
      expect(provider.url).toBeTruthy();
      expect(provider.bestFor).toBeTruthy();
      expect(provider.topFreeModels.length).toBeGreaterThan(0);
    }
  });
});

// ─── Progressive Filtering Tests ────────────────────────────────────────────

describe('Progressive Filtering Engine', () => {
  it('should create initial filter state', () => {
    const state = createInitialFilterState();
    expect(state.category).toBeNull();
    expect(state.subcategory).toBeNull();
    expect(state.tags).toEqual([]);
    expect(state.searchQuery).toBe('');
    expect(state.sortBy).toBe('relevance');
  });

  it('should get visible tags', () => {
    const state = createInitialFilterState();
    const tags = getVisibleTags(state);
    expect(tags.length).toBeGreaterThan(0);
  });

  it('should get visible tags with contradictions filtered', () => {
    const state = { ...createInitialFilterState(), tags: ['no-signup'] };
    const tags = getVisibleTags(state);
    expect(tags.find((t) => t.id === 'free-signup')).toBeUndefined();
  });

  it('should get available subcategories', () => {
    const subs = getAvailableSubcategories('ai-coding');
    expect(subs.length).toBeGreaterThan(0);
  });

  it('should return empty subcategories for null category', () => {
    const subs = getAvailableSubcategories(null);
    expect(subs).toEqual([]);
  });

  it('should get categories by domain', () => {
    const grouped = getCategoriesByDomain();
    expect(grouped.length).toBeGreaterThan(0);
    expect(grouped[0].domain).toBeTruthy();
    expect(grouped[0].categories.length).toBeGreaterThan(0);
  });

  it('should serialize and deserialize filter state', () => {
    const state = {
      ...createInitialFilterState(),
      category: 'ai-chat' as any,
      tags: ['no-signup', 'browser'],
      searchQuery: 'test',
    };
    const serialized = serializeFilterState(state);
    expect(serialized).toContain('cat=ai-chat');
    expect(serialized).toContain('tags=no-signup%2Cbrowser');
    expect(serialized).toContain('q=test');

    const params = new URLSearchParams(serialized);
    const deserialized = deserializeFilterState(params);
    expect(deserialized.category).toBe('ai-chat');
    expect(deserialized.tags).toEqual(['no-signup', 'browser']);
    expect(deserialized.searchQuery).toBe('test');
  });
});

// ─── Data Completeness Tests ────────────────────────────────────────────────

describe('Data Completeness', () => {
  it('should have all critical AI coding tools from plan', () => {
    const criticalTools = [
      'kilo-code',
      'cline',
      'roo-code',
      'opencode',
      'cursor',
      'windsurf',
      'kiro',
      'aider',
      'continue-dev',
      'goose',
      'tabby',
      'void',
      'stagewise',
      'bolt-diy',
    ];

    const toolIds = zeroKeyTools.map((t) => t.id);
    for (const toolId of criticalTools) {
      expect(toolIds).toContain(toolId);
    }
  });

  it('should have all inference providers from plan', () => {
    const criticalProviders = [
      'google-ai-studio',
      'cerebras',
      'groq',
      'mistral',
      'nvidia-nim',
      'cloudflare',
      'openrouter',
      'together',
      'fireworks',
      'deepinfra',
      'huggingface',
      'kilo-gateway',
      'novita',
    ];

    const providerIds = inferenceProviders.map((p) => p.id);
    for (const providerId of criticalProviders) {
      expect(providerIds).toContain(providerId);
    }
  });

  it('should have 35+ AI models', () => {
    expect(aiModels.length).toBeGreaterThanOrEqual(35);
  });

  it('should have 10+ tool stacks', () => {
    expect(toolStacks.length).toBeGreaterThanOrEqual(10);
  });
});

// ─── Filter Integration Tests ───────────────────────────────────────────────

describe('Filter Integration', () => {
  it('should have filter sharing functions available', () => {
    expect(typeof filtersToUrl).toBe('function');
    expect(typeof urlToFilters).toBe('function');
  });

  it('should have saved filters functions available', () => {
    expect(typeof getSavedFilters).toBe('function');
    expect(typeof saveFilter).toBe('function');
    expect(typeof deleteSavedFilter).toBe('function');
  });

  it('should have progressive filter functions available', () => {
    expect(typeof getVisibleTags).toBe('function');
    expect(typeof applyProgressiveFilters).toBe('function');
  });
});
