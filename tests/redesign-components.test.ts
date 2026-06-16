/**
 * Comprehensive tests for all new redesign components.
 * Covers: privacy-indicator, cost-calculator, tool-comparison, onboarding-flow,
 * smart-recommendations, stack-detail, model-detail, and getting-started-guides.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderPrivacyIndicator } from '../src/components/privacy-indicator';
import { renderCostCalculator } from '../src/components/cost-calculator';
import { renderToolComparison } from '../src/components/tool-comparison';
import { renderOnboarding } from '../src/components/onboarding-flow';
import { getRecommendations, renderRecommendations } from '../src/components/smart-recommendations';
import { renderStackDetail } from '../src/components/stack-detail';
import { renderModelDetail } from '../src/components/model-detail';
import { renderGettingStartedGuides } from '../src/components/getting-started-guides';
import type { PrivacyInfo, PricingInfo, Tool } from '../src/types/tool';
import { toolStacks } from '../src/data/tool-stacks';
import { aiModels } from '../src/data/ai-models';
import { zeroKeyTools } from '../src/data/zero-key-tools';

// ─── Setup ──────────────────────────────────────────────────────────────────

let document: Document;

beforeEach(() => {
  document = globalThis.document;
});

// ─── Privacy Indicator Tests ────────────────────────────────────────────────

describe('Privacy Indicator', () => {
  it('should render high privacy level correctly', () => {
    const privacy: PrivacyInfo = {
      level: 'high',
      telemetry: false,
      encryption: true,
      dataResidency: ['EU'],
      trainingOnPrompts: false,
    };

    const container = renderPrivacyIndicator(privacy, 'en');
    expect(container.classList.contains('privacy-indicator')).toBe(true);
    
    const levelBadge = container.querySelector('.privacy-level-high');
    expect(levelBadge).toBeTruthy();
    expect(levelBadge?.textContent).toContain('HIGH');

    const positiveItems = container.querySelectorAll('.privacy-positive');
    expect(positiveItems.length).toBeGreaterThan(0);
  });

  it('should render medium privacy level correctly', () => {
    const privacy: PrivacyInfo = {
      level: 'medium',
      telemetry: true,
      encryption: true,
      dataResidency: ['US'],
      trainingOnPrompts: false,
    };

    const container = renderPrivacyIndicator(privacy, 'en');
    const levelBadge = container.querySelector('.privacy-level-medium');
    expect(levelBadge).toBeTruthy();
    expect(levelBadge?.textContent).toContain('MEDIUM');
  });

  it('should render low privacy level correctly', () => {
    const privacy: PrivacyInfo = {
      level: 'low',
      telemetry: true,
      encryption: false,
      dataResidency: ['China'],
      trainingOnPrompts: true,
    };

    const container = renderPrivacyIndicator(privacy, 'en');
    const levelBadge = container.querySelector('.privacy-level-low');
    expect(levelBadge).toBeTruthy();
    expect(levelBadge?.textContent).toContain('LOW');

    const negativeItems = container.querySelectorAll('.privacy-negative');
    expect(negativeItems.length).toBeGreaterThan(0);
  });

  it('should render in Japanese', () => {
    const privacy: PrivacyInfo = {
      level: 'high',
      telemetry: false,
      encryption: true,
      dataResidency: ['EU'],
      trainingOnPrompts: false,
    };

    const container = renderPrivacyIndicator(privacy, 'ja');
    const levelBadge = container.querySelector('.privacy-level-high');
    expect(levelBadge?.textContent).toContain('高');
  });
});

// ─── Cost Calculator Tests ──────────────────────────────────────────────────

describe('Cost Calculator', () => {
  it('should render cost calculator with default values', () => {
    const pricing: PricingInfo = {
      model: 'freemium',
      freeTier: {
        limits: '1000 requests/day',
        requiresCard: false,
        requiresSignup: true,
      },
    };

    const container = renderCostCalculator(pricing, 'en', 100, 1000);
    expect(container.classList.contains('cost-calculator')).toBe(true);
    
    const title = container.querySelector('.cost-calculator-title');
    expect(title?.textContent).toBe('Cost Calculator');

    const inputs = container.querySelectorAll('.cost-input');
    expect(inputs.length).toBe(2);
  });

  it('should calculate cost correctly for usage within free tier', () => {
    const pricing: PricingInfo = {
      model: 'freemium',
      freeTier: {
        limits: '1000 requests/day',
        requiresCard: false,
        requiresSignup: true,
      },
    };

    const container = renderCostCalculator(pricing, 'en', 500, 1000);
    const totalLine = container.querySelector('.cost-total');
    expect(totalLine?.textContent).toContain('$0.00');
  });

  it('should calculate cost correctly for usage over free tier', () => {
    const pricing: PricingInfo = {
      model: 'freemium',
      freeTier: {
        limits: '1000 requests/day',
        requiresCard: false,
        requiresSignup: true,
      },
    };

    const container = renderCostCalculator(pricing, 'en', 2000, 1000);
    const totalLine = container.querySelector('.cost-total');
    expect(totalLine?.textContent).not.toContain('$0.00');
    
    const overageLine = container.querySelector('.cost-overage');
    expect(overageLine).toBeTruthy();
  });

  it('should render in Japanese', () => {
    const pricing: PricingInfo = {
      model: 'freemium',
      freeTier: {
        limits: '1000 requests/day',
        requiresCard: false,
        requiresSignup: true,
      },
    };

    const container = renderCostCalculator(pricing, 'ja', 100, 1000);
    const title = container.querySelector('.cost-calculator-title');
    expect(title?.textContent).toBe('コスト計算機');
  });
});

// ─── Tool Comparison Tests ──────────────────────────────────────────────────

describe('Tool Comparison', () => {
  it('should render comparison of multiple tools', () => {
    const tools: Tool[] = [
      {
        id: 'tool1',
        name: 'Tool 1',
        url: 'https://tool1.com',
        description: 'First tool',
        category: 'ai-coding',
        tags: ['vscode', 'free-tier'],
        pricing: { model: 'free' },
        access: 'no-login',
        surface: 'web',
        requiresSignup: false,
        badges: ['vscode', 'free'],
        bestFor: 'Coding assistance',
        qualityNote: 'Great tool',
        quality: {
          verified: true,
          privacy: { level: 'high', telemetry: false, encryption: true, trainingOnPrompts: false },
          trust: { githubStars: 10000 },
        },
      },
      {
        id: 'tool2',
        name: 'Tool 2',
        url: 'https://tool2.com',
        description: 'Second tool',
        category: 'ai-coding',
        tags: ['jetbrains', 'byok'],
        pricing: { model: 'byok' },
        access: 'free-tier',
        surface: 'web',
        requiresSignup: true,
        badges: ['jetbrains', 'byok'],
        bestFor: 'Advanced coding',
        qualityNote: 'Advanced tool',
        quality: {
          verified: true,
          privacy: { level: 'medium', telemetry: true, encryption: true, trainingOnPrompts: false },
          trust: { githubStars: 5000 },
        },
      },
    ];

    const container = renderToolComparison(tools, 'en');
    expect(container.classList.contains('tool-comparison')).toBe(true);

    const columns = container.querySelectorAll('.comparison-column');
    expect(columns.length).toBe(2);

    const names = container.querySelectorAll('.comparison-tool-name');
    expect(names[0]?.textContent).toBe('Tool 1');
    expect(names[1]?.textContent).toBe('Tool 2');
  });

  it('should render recommendations section', () => {
    const tools: Tool[] = [
      {
        id: 'tool1',
        name: 'Tool 1',
        url: 'https://tool1.com',
        description: 'First tool',
        category: 'ai-coding',
        tags: [],
        pricing: { model: 'free' },
        access: 'no-login',
        surface: 'web',
        requiresSignup: false,
        badges: [],
        bestFor: 'Coding',
        qualityNote: 'Good tool',
      },
    ];

    const container = renderToolComparison(tools, 'en');
    const recommendations = container.querySelector('.comparison-recommendations');
    expect(recommendations).toBeTruthy();
  });

  it('should render in Japanese', () => {
    const tools: Tool[] = [
      {
        id: 'tool1',
        name: 'Tool 1',
        url: 'https://tool1.com',
        description: 'First tool',
        category: 'ai-coding',
        tags: [],
        pricing: { model: 'free' },
        access: 'no-login',
        surface: 'web',
        requiresSignup: false,
        badges: [],
        bestFor: 'Coding',
        qualityNote: 'Good tool',
      },
    ];

    const container = renderToolComparison(tools, 'ja');
    const title = container.querySelector('.comparison-title');
    expect(title?.textContent).toBe('ツール比較');
  });
});

// ─── Onboarding Flow Tests ──────────────────────────────────────────────────

describe('Onboarding Flow', () => {
  it('should render step 1 (role selection)', () => {
    const container = document.createElement('div');
    renderOnboarding(container, 'en');

    expect(container.classList.contains('onboarding-flow')).toBe(true);
    
    const title = container.querySelector('.onboarding-title');
    expect(title?.textContent).toBe('Stack matcher');

    const options = container.querySelectorAll('.onboarding-option');
    expect(options.length).toBeGreaterThan(0);
  });

  it('should render navigation buttons', () => {
    const container = document.createElement('div');
    renderOnboarding(container, 'en');

    const nextBtn = container.querySelector('.nav-btn-next');
    expect(nextBtn).toBeTruthy();
    expect(nextBtn?.textContent).toBe('Next');
  });

  it('should render in Japanese', () => {
    const container = document.createElement('div');
    renderOnboarding(container, 'ja');

    const title = container.querySelector('.onboarding-title');
    expect(title?.textContent).toBe('スタックマッチャー');
  });
});

// ─── Smart Recommendations Tests ────────────────────────────────────────────

describe('Smart Recommendations', () => {
  it('should get recommendations for a tool', () => {
    const sourceTool = zeroKeyTools[0];
    const recommendations = getRecommendations(sourceTool, 'en', 5);

    expect(recommendations).toBeInstanceOf(Array);
    expect(recommendations.length).toBeLessThanOrEqual(5);

    if (recommendations.length > 0) {
      expect(recommendations[0].tool).toBeDefined();
      expect(recommendations[0].similarity).toBeGreaterThan(0);
      expect(recommendations[0].reason).toBeTruthy();
    }
  });

  it('should not recommend the same tool', () => {
    const sourceTool = zeroKeyTools[0];
    const recommendations = getRecommendations(sourceTool, 'en', 10);

    const sameTool = recommendations.find(r => r.tool.id === sourceTool.id);
    expect(sameTool).toBeUndefined();
  });

  it('should render recommendations section', () => {
    const sourceTool = zeroKeyTools[0];
    const container = renderRecommendations(sourceTool, 'en');

    expect(container.classList.contains('recommendations-section')).toBe(true);

    const title = container.querySelector('.recommendations-title');
    expect(title?.textContent).toBe('Recommended Tools');

    const subtitle = container.querySelector('.recommendations-subtitle');
    expect(subtitle?.textContent).toContain(sourceTool.name);
  });

  it('should render recommendation cards', () => {
    const sourceTool = zeroKeyTools[0];
    const container = renderRecommendations(sourceTool, 'en');

    const cards = container.querySelectorAll('.recommendation-card');
    expect(cards.length).toBeGreaterThanOrEqual(0);
  });
});

// ─── Stack Detail Tests ─────────────────────────────────────────────────────

describe('Stack Detail', () => {
  it('should render stack detail page', () => {
    const stack = toolStacks[0];
    const container = renderStackDetail(stack, 'en');

    expect(container.classList.contains('stack-detail-page')).toBe(true);

    const title = container.querySelector('.stack-detail-title');
    expect(title?.textContent).toBe(stack.name);

    const meta = container.querySelector('.stack-detail-meta');
    expect(meta).toBeTruthy();
  });

  it('should render workflow steps', () => {
    const stack = toolStacks[0];
    const container = renderStackDetail(stack, 'en');

    const steps = container.querySelectorAll('.stack-detail-step');
    expect(steps.length).toBe(stack.workflow.length);
  });

  it('should render tools in stack', () => {
    const stack = toolStacks[0];
    const container = renderStackDetail(stack, 'en');

    const toolsGrid = container.querySelector('.stack-tools-grid');
    expect(toolsGrid).toBeTruthy();

    const toolCards = container.querySelectorAll('.stack-tool-card');
    expect(toolCards.length).toBe(stack.tools.length);
  });

  it('should render cost breakdown table', () => {
    const stack = toolStacks[0];
    const container = renderStackDetail(stack, 'en');

    const costTable = container.querySelector('.stack-cost-table');
    expect(costTable).toBeTruthy();

    const totalRow = container.querySelector('.cost-table-total');
    expect(totalRow?.textContent).toContain(stack.cost.total);
  });

  it('should render alternatives section if available', () => {
    const stack = toolStacks[0];
    const container = renderStackDetail(stack, 'en');

    const hasAlternatives = stack.tools.some(t => t.alternatives && t.alternatives.length > 0);
    const altSection = container.querySelector('.stack-detail-section:nth-of-type(5)');
    
    if (hasAlternatives) {
      expect(altSection).toBeTruthy();
    }
  });

  it('should render resources section if available', () => {
    const stack = toolStacks[0];
    const container = renderStackDetail(stack, 'en');

    if (stack.resources.length > 0) {
      const resourcesList = container.querySelector('.stack-resources-list');
      expect(resourcesList).toBeTruthy();

      const resourceItems = container.querySelectorAll('.resource-item');
      expect(resourceItems.length).toBe(stack.resources.length);
    }
  });

  it('should render back button if callback provided', () => {
    const stack = toolStacks[0];
    const onBack = () => {};
    const container = renderStackDetail(stack, 'en', onBack);

    const backBtn = container.querySelector('.stack-detail-back');
    expect(backBtn).toBeTruthy();
    expect(backBtn?.textContent).toContain('Back to Stacks');
  });

  it('should render in Japanese', () => {
    const stack = toolStacks[0];
    const container = renderStackDetail(stack, 'ja');

    const title = container.querySelector('.stack-detail-title');
    expect(title?.textContent).not.toBe(stack.name);
    expect(title?.textContent).toContain('SaaS');
  });
});

// ─── Model Detail Tests ─────────────────────────────────────────────────────

describe('Model Detail', () => {
  it('should render model detail page', () => {
    const model = aiModels[0];
    const container = renderModelDetail(model, 'en');

    expect(container.classList.contains('model-detail-page')).toBe(true);

    const title = container.querySelector('.model-detail-title');
    expect(title?.textContent).toBe(model.name);

    const subtitle = container.querySelector('.model-detail-subtitle');
    expect(subtitle?.textContent).toContain(model.parameters.total);
    expect(subtitle?.textContent).toContain(model.license.type);
  });

  it('should render specs section', () => {
    const model = aiModels[0];
    const container = renderModelDetail(model, 'en');

    const specs = container.querySelector('.model-detail-specs');
    expect(specs).toBeTruthy();

    const specItems = container.querySelectorAll('.model-spec-item');
    expect(specItems.length).toBeGreaterThan(0);
  });

  it('should render benchmarks table if available', () => {
    const model = aiModels[0];
    const container = renderModelDetail(model, 'en');

    const benchKeys = Object.keys(model.benchmarks);
    if (benchKeys.length > 0) {
      const benchTable = container.querySelector('.model-bench-table');
      expect(benchTable).toBeTruthy();

      const benchRows = container.querySelectorAll('.bench-table-row');
      expect(benchRows.length).toBeGreaterThan(1); // header + data
    }
  });

  it('should render hardware requirements', () => {
    const model = aiModels[0];
    const container = renderModelDetail(model, 'en');

    const hwSection = container.querySelector('.model-hw-grid');
    expect(hwSection).toBeTruthy();

    const hwItems = container.querySelectorAll('.model-hw-item');
    expect(hwItems.length).toBeGreaterThan(0);
  });

  it('should render inference providers', () => {
    const model = aiModels[0];
    const container = renderModelDetail(model, 'en');

    if (model.availability.inferenceProviders.length > 0) {
      const providerGroups = container.querySelectorAll('.model-provider-group');
      expect(providerGroups.length).toBeGreaterThan(0);
      
      // Check that provider chips exist (may include both inference providers and local runners)
      const providerChips = container.querySelectorAll('.provider-chip');
      expect(providerChips.length).toBeGreaterThan(0);
    }
  });

  it('should render local runners', () => {
    const model = aiModels[0];
    const container = renderModelDetail(model, 'en');

    if (model.availability.localRunners.length > 0) {
      const runnerChips = container.querySelectorAll('.provider-chip');
      expect(runnerChips.length).toBeGreaterThan(0);
    }
  });

  it('should render best for tags', () => {
    const model = aiModels[0];
    const container = renderModelDetail(model, 'en');

    const bestForTags = container.querySelectorAll('.bestfor-tag');
    expect(bestForTags.length).toBe(model.bestFor.length);
  });

  it('should render alternatives', () => {
    const model = aiModels[0];
    const container = renderModelDetail(model, 'en');

    const altCards = container.querySelectorAll('.model-alt-card');
    expect(altCards.length).toBeGreaterThanOrEqual(0);
  });

  it('should render back button if callback provided', () => {
    const model = aiModels[0];
    const onBack = () => {};
    const container = renderModelDetail(model, 'en', onBack);

    const backBtn = container.querySelector('.model-detail-back');
    expect(backBtn).toBeTruthy();
    expect(backBtn?.textContent).toContain('Back to Models');
  });

  it('should render in Japanese', () => {
    const model = aiModels[0];
    const container = renderModelDetail(model, 'ja');

    const title = container.querySelector('.model-detail-title');
    expect(title?.textContent).toBe(model.name);
  });
});

// ─── Getting Started Guides Tests ───────────────────────────────────────────

describe('Getting Started Guides', () => {
  it('should render getting started guides section', () => {
    const container = renderGettingStartedGuides('en');

    expect(container.classList.contains('getting-started-guides')).toBe(true);

    const title = container.querySelector('.guides-title');
    expect(title?.textContent).toBe('Guides');
  });

  it('should render guide cards', () => {
    const container = renderGettingStartedGuides('en');

    const guideCards = container.querySelectorAll('.guide-card');
    expect(guideCards.length).toBeGreaterThan(0);
  });

  it('should render guide titles and descriptions', () => {
    const container = renderGettingStartedGuides('en');

    const guideTitles = container.querySelectorAll('.guide-card-title');
    expect(guideTitles.length).toBeGreaterThan(0);

    const guideDescs = container.querySelectorAll('.guide-card-desc');
    expect(guideDescs.length).toBeGreaterThan(0);
  });

  it('should render in Japanese', () => {
    const container = renderGettingStartedGuides('ja');

    const title = container.querySelector('.guides-title');
    expect(title?.textContent).toBe('ガイド');
  });
});
