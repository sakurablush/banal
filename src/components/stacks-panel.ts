/**
 * Tool Stacks Panel — Renders curated tool combinations for zero-budget workflows.
 * Shows predefined stacks with audience filtering, workflow steps, and cost breakdown.
 */

import type { Lang } from '../i18n';
import { toolStacks, getStackAudiences } from '../data/tool-stacks';
import type { ToolStack, StackAudience } from '../types/tool';
import { renderStackDetail } from './stack-detail';

// ─── Copy ───────────────────────────────────────────────────────────────────

const COPY = {
  en: {
    title: 'Tool Stacks',
    subtitle: 'Curated combinations for zero-budget workflows',
    browseByAudience: 'Browse by Audience',
    allAudiences: 'All',
    featured: 'Featured Stacks',
    tools: 'Tools',
    workflow: 'Workflow',
    cost: 'Cost',
    totalCost: 'Total',
    viewStack: 'View Stack',
    alternatives: 'Alternatives',
    resources: 'Resources',
    step: 'Step',
    for: 'For',
    budget: 'Budget',
    experience: 'Experience',
    showing: (n: number) => `${n} stacks`,
    noMatches: 'No stacks match this audience',
  },
  ja: {
    title: 'ツールスタック',
    subtitle: '予算ゼロのワークフローのための厳選組み合わせ',
    browseByAudience: '対象で絞り込み',
    allAudiences: 'すべて',
    featured: 'おすすめスタック',
    tools: 'ツール',
    workflow: 'ワークフロー',
    cost: 'コスト',
    totalCost: '合計',
    viewStack: 'スタックを見る',
    alternatives: '代替',
    resources: 'リソース',
    step: 'ステップ',
    for: '対象',
    budget: '予算',
    experience: '経験',
    showing: (n: number) => `${n}スタック`,
    noMatches: '一致するスタックがありません',
  },
} satisfies Record<Lang, Record<string, string | ((...args: number[]) => string)>>;

// ─── Audience Labels ────────────────────────────────────────────────────────

const AUDIENCE_LABELS: Record<StackAudience, { en: string; ja: string; icon: string }> = {
  freelancer: { en: 'Freelancers', ja: 'フリーランサー', icon: '\u{1F4BC}' },
  'indie-hacker': { en: 'Indie Hackers', ja: 'インディーハッカー', icon: '\u{1F680}' },
  startup: { en: 'Startups', ja: 'スタートアップ', icon: '\u{1F31F}' },
  student: { en: 'Students', ja: '学生', icon: '\u{1F393}' },
  'job-seeker': { en: 'Job Seekers', ja: '求職者', icon: '\u{1F50D}' },
  developer: { en: 'Developers', ja: '開発者', icon: '\u{1F4BB}' },
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function create<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (className) el.className = className;
  return el;
}

/** Helper: create a span with text */
function span(className: string, text: string): HTMLSpanElement {
  const el = create('span', className);
  el.textContent = text;
  return el;
}

// ─── Render: Stack Card ─────────────────────────────────────────────────────

function renderStackCard(state: StacksPanelState, stack: ToolStack): HTMLElement {
  const copy = COPY[state.lang];
  const card = create('article', 'stack-card');

  // Header
  const header = create('div', 'stack-card-header');
  const name = create('h3', 'stack-card-name');
  name.textContent = stack.name;
  header.appendChild(name);

  const meta = create('div', 'stack-card-meta');
  const audienceLabel = AUDIENCE_LABELS[stack.audience.type];
  meta.appendChild(span('stack-meta-item', `${audienceLabel[state.lang]} ${audienceLabel.icon}`));
  meta.appendChild(span('stack-meta-item', `${typeof copy.budget === 'string' ? copy.budget : 'Budget'}: ${stack.cost.total}`));
  header.appendChild(meta);
  card.appendChild(header);

  // Description
  const desc = create('p', 'stack-card-desc');
  desc.textContent = stack.description;
  card.appendChild(desc);

  // Tools list
  const toolsSection = create('div', 'stack-card-tools');
  const toolsTitle = create('span', 'stack-section-title');
  toolsTitle.textContent = typeof copy.tools === 'string' ? copy.tools : 'Tools';
  toolsSection.appendChild(toolsTitle);

  const toolsList = create('div', 'stack-tools-list');
  for (const tool of stack.tools) {
    const toolItem = create('div', 'stack-tool-item');
    toolItem.appendChild(span('stack-tool-role', tool.role));
    toolItem.appendChild(span('stack-tool-id', tool.toolId));
    if (tool.optional) {
      toolItem.appendChild(span('stack-tool-optional', 'optional'));
    }
    toolsList.appendChild(toolItem);
  }
  toolsSection.appendChild(toolsList);
  card.appendChild(toolsSection);

  // Workflow steps (collapsed by default)
  const workflowSection = create('div', 'stack-card-workflow');
  const workflowToggle = create('button', 'stack-workflow-toggle');
  workflowToggle.type = 'button';
  workflowToggle.textContent = `\u25B6 ${typeof copy.workflow === 'string' ? copy.workflow : 'Workflow'} (${stack.workflow.length} ${typeof copy.step === 'string' ? copy.step : 'steps'})`;
  workflowToggle.addEventListener('click', () => {
    const steps = workflowSection.querySelector('.stack-workflow-steps') as HTMLElement;
    if (steps) {
      const isHidden = steps.style.display === 'none';
      steps.style.display = isHidden ? 'block' : 'none';
      workflowToggle.textContent = `${isHidden ? '\u25BC' : '\u25B6'} ${typeof copy.workflow === 'string' ? copy.workflow : 'Workflow'} (${stack.workflow.length} ${typeof copy.step === 'string' ? copy.step : 'steps'})`;
    }
  });
  workflowSection.appendChild(workflowToggle);

  const steps = create('div', 'stack-workflow-steps');
  steps.style.display = 'none';
  for (const step of stack.workflow) {
    const stepEl = create('div', 'stack-step');
    stepEl.appendChild(span('stack-step-number', String(step.step)));
    const content = create('div', 'stack-step-content');
    const titleEl = create('strong');
    titleEl.textContent = step.title;
    content.appendChild(titleEl);
    const descEl = create('p');
    descEl.textContent = step.description;
    content.appendChild(descEl);
    stepEl.appendChild(content);
    steps.appendChild(stepEl);
  }
  workflowSection.appendChild(steps);
  card.appendChild(workflowSection);

  // Cost breakdown
  const costSection = create('div', 'stack-card-cost');
  const costTitle = create('span', 'stack-section-title');
  costTitle.textContent = `${typeof copy.cost === 'string' ? copy.cost : 'Cost'}: ${stack.cost.total}`;
  costSection.appendChild(costTitle);

  const costList = create('div', 'stack-cost-list');
  for (const item of stack.cost.breakdown) {
    const costItem = create('div', 'stack-cost-item');
    costItem.appendChild(span('cost-tool', item.tool));
    costItem.appendChild(span('cost-amount', item.cost));
    if (item.notes) {
      costItem.appendChild(span('cost-notes', item.notes));
    }
    costList.appendChild(costItem);
  }
  costSection.appendChild(costList);
  card.appendChild(costSection);

  // Click to open detail view
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => {
    const container = state.container;
    if (!container) return;
    
    // Store original content
    const originalContent = container.innerHTML;
    
    // Render detail view
    container.innerHTML = '';
    const detailView = renderStackDetail(stack, state.lang, () => {
      // Back button callback - restore original content
      container.innerHTML = originalContent;
      renderContent(state);
    });
    container.appendChild(detailView);
  });

  return card;
}

// ─── State ──────────────────────────────────────────────────────────────────

interface StacksPanelState {
  lang: Lang;
  audienceFilter: StackAudience | null;
  container: HTMLElement | null;
}

// ─── Render: Content ────────────────────────────────────────────────────────

function renderContent(state: StacksPanelState): void {
  const container = state.container;
  if (!container) return;

  const contentArea = container.querySelector('.stacks-content') as HTMLElement | null;
  if (!contentArea) return;

  contentArea.innerHTML = '';
  const copy = COPY[state.lang];

  // Filter stacks
  let stacks = [...toolStacks];
  if (state.audienceFilter) {
    stacks = stacks.filter((s) => s.audience.type === state.audienceFilter);
  }

  // Stats
  const stats = create('div', 'stacks-stats');
  stats.textContent = typeof copy.showing === 'function' ? copy.showing(stacks.length) : `${stacks.length} stacks`;
  contentArea.appendChild(stats);

  // Empty state
  if (stacks.length === 0) {
    const empty = create('div', 'stacks-empty');
    empty.textContent = typeof copy.noMatches === 'string' ? copy.noMatches : 'No stacks match';
    contentArea.appendChild(empty);
    return;
  }

  // Stack cards grid
  const grid = create('div', 'stacks-grid');
  for (const stack of stacks) {
    grid.appendChild(renderStackCard(state, stack));
  }
  contentArea.appendChild(grid);
}

// ─── Public API ─────────────────────────────────────────────────────────────

export interface StacksPanelApi {
  setAudience: (audience: StackAudience | null) => void;
  reset: () => void;
  destroy: () => void;
}

export function renderStacksPanel(
  container: HTMLElement,
  options: { lang: Lang }
): StacksPanelApi {
  const { lang } = options;
  const copy = COPY[lang];

  const state: StacksPanelState = {
    lang,
    audienceFilter: null,
    container,
  };

  container.innerHTML = '';
  container.className = 'stacks-panel';

  // Header
  const header = create('div', 'stacks-panel-header');
  const title = create('h2', 'stacks-panel-title');
  title.textContent = typeof copy.title === 'string' ? copy.title : 'Tool Stacks';
  header.appendChild(title);
  const subtitle = create('p', 'stacks-panel-subtitle');
  subtitle.textContent = typeof copy.subtitle === 'string' ? copy.subtitle : 'Curated workflows';
  header.appendChild(subtitle);
  container.appendChild(header);

  // Audience filter chips
  const audienceRow = create('div', 'stacks-audience-row');
  const audienceLabel = create('span', 'stacks-audience-label');
  audienceLabel.textContent = typeof copy.browseByAudience === 'string' ? copy.browseByAudience : 'Browse by Audience';
  audienceRow.appendChild(audienceLabel);

  const chips = create('div', 'stacks-audience-chips');

  // All chip
  const allChip = create('button', `stacks-audience-chip${state.audienceFilter === null ? ' active' : ''}`);
  allChip.type = 'button';
  allChip.textContent = typeof copy.allAudiences === 'string' ? copy.allAudiences : 'All';
  allChip.addEventListener('click', () => {
    state.audienceFilter = null;
    renderContent(state);
  });
  chips.appendChild(allChip);

  // Audience chips
  const audiences = getStackAudiences();
  for (const aud of audiences) {
    const label = AUDIENCE_LABELS[aud as StackAudience];
    if (!label) continue;
    const chip = create('button', `stacks-audience-chip${state.audienceFilter === aud ? ' active' : ''}`);
    chip.type = 'button';
    chip.textContent = `${label.icon} ${label[state.lang]}`;
    chip.addEventListener('click', () => {
      state.audienceFilter = state.audienceFilter === aud ? null : (aud as StackAudience);
      renderContent(state);
    });
    chips.appendChild(chip);
  }
  audienceRow.appendChild(chips);
  container.appendChild(audienceRow);

  // Content area
  const content = create('div', 'stacks-content');
  container.appendChild(content);

  // Initial render
  renderContent(state);

  return {
    setAudience: (audience: StackAudience | null) => {
      state.audienceFilter = audience;
      renderContent(state);
    },
    reset: () => {
      state.audienceFilter = null;
      renderContent(state);
    },
    destroy: () => {
      // cleanup
    },
  };
}
