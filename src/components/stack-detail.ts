/**
 * Stack Detail Page — Full detail view for a tool stack.
 * Shows overview, workflow steps, tools, cost breakdown, alternatives, and resources.
 */

import type { Lang } from '../i18n';
import type { ToolStack } from '../types/tool';
import { zeroKeyTools } from '../data/zero-key-tools';
import { getDisplayStack } from '../lib/stack-localization';
import { setSafeExternalHref } from '../utils';

// ─── Copy ───────────────────────────────────────────────────────────────────

const COPY = {
  en: {
    for: 'For',
    budget: 'Budget',
    experience: 'Experience',
    overview: 'Overview',
    whatYoullBuild: "What you'll build",
    workflow: 'Workflow',
    step: 'Step',
    tools: 'Tools',
    time: 'Time',
    viewTutorial: 'View Tutorial',
    toolsInStack: 'Tools in This Stack',
    view: 'View',
    alt: 'Alt',
    costBreakdown: 'Cost Breakdown',
    tool: 'Tool',
    cost: 'Cost',
    notes: 'Notes',
    total: 'TOTAL',
    alternatives: 'Alternatives',
    cantFind: "Can't find what you need? Try these alternatives:",
    resources: 'Resources',
    backToStacks: '← Back to Stacks',
  },
  ja: {
    for: '対象',
    budget: '予算',
    experience: '経験',
    overview: '概要',
    whatYoullBuild: '構築できるもの',
    workflow: 'ワークフロー',
    step: 'ステップ',
    tools: 'ツール',
    time: '時間',
    viewTutorial: 'チュートリアルを見る',
    toolsInStack: 'このスタックのツール',
    view: '見る',
    alt: '代替',
    costBreakdown: 'コスト内訳',
    tool: 'ツール',
    cost: 'コスト',
    notes: '備考',
    total: '合計',
    alternatives: '代替案',
    cantFind: 'お探しのものが見つかりませんか？これらの代替案をお試しください：',
    resources: 'リソース',
    backToStacks: '← スタックに戻る',
  },
} satisfies Record<Lang, Record<string, string>>;

// ─── Audience Labels ────────────────────────────────────────────────────────

const AUDIENCE_LABELS: Record<string, { en: string; ja: string }> = {
  freelancer: { en: 'Freelancers', ja: 'フリーランサー' },
  'indie-hacker': { en: 'Building your own app', ja: '自分でアプリを作る' },
  startup: { en: 'Startups', ja: 'スタートアップ' },
  student: { en: 'Students', ja: '学生' },
  'job-seeker': { en: 'Job Seekers', ja: '求職者' },
  developer: { en: 'Developers', ja: '開発者' },
};

const EXPERIENCE_LABELS: Record<string, { en: string; ja: string }> = {
  beginner: { en: 'Beginner', ja: '初心者' },
  intermediate: { en: 'Intermediate', ja: '中級者' },
  advanced: { en: 'Advanced', ja: '上級者' },
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

function span(className: string, text: string): HTMLSpanElement {
  const el = create('span', className);
  el.textContent = text;
  return el;
}

// ─── Render: Stack Detail Page ──────────────────────────────────────────────

export function renderStackDetail(stack: ToolStack, lang: Lang, onBack?: () => void): HTMLElement {
  const copy = COPY[lang];
  stack = getDisplayStack(stack, lang);
  const container = create('div', 'stack-detail-page');

  // Back button
  if (onBack) {
    const backBtn = create('button', 'stack-detail-back');
    backBtn.textContent = copy.backToStacks;
    backBtn.addEventListener('click', onBack);
    container.appendChild(backBtn);
  }

  // Header
  const header = create('div', 'stack-detail-header');
  const title = create('h1', 'stack-detail-title');
  title.textContent = stack.name;
  header.appendChild(title);

  const meta = create('div', 'stack-detail-meta');
  const audienceLabel = AUDIENCE_LABELS[stack.audience.type]?.[lang] || stack.audience.type;
  meta.appendChild(span('stack-meta-item', `${copy.for}: ${audienceLabel}`));
  meta.appendChild(span('stack-meta-item', `${copy.budget}: ${stack.cost.total}`));
  const expLabel =
    EXPERIENCE_LABELS[stack.audience.experience]?.[lang] || stack.audience.experience;
  meta.appendChild(span('stack-meta-item', `${copy.experience}: ${expLabel}`));
  header.appendChild(meta);

  container.appendChild(header);

  // Overview
  const overview = create('section', 'stack-detail-section');
  const overviewTitle = create('h2', 'section-title');
  overviewTitle.textContent = copy.overview;
  overview.appendChild(overviewTitle);
  const overviewText = create('p', 'stack-detail-overview-text');
  overviewText.textContent = stack.description;
  overview.appendChild(overviewText);

  // What you'll build
  const buildTitle = create('h3', 'section-subtitle');
  buildTitle.textContent = copy.whatYoullBuild;
  overview.appendChild(buildTitle);
  const buildList = create('ul', 'stack-build-list');
  // Infer from workflow steps
  const buildItems = new Set<string>();
  for (const step of stack.workflow) {
    buildItems.add(step.title);
  }
  for (const item of buildItems) {
    const li = create('li', 'stack-build-item');
    li.textContent = item;
    buildList.appendChild(li);
  }
  overview.appendChild(buildList);
  container.appendChild(overview);

  // Workflow
  const workflow = create('section', 'stack-detail-section');
  const workflowTitle = create('h2', 'section-title');
  workflowTitle.textContent = copy.workflow;
  workflow.appendChild(workflowTitle);

  const stepsContainer = create('div', 'stack-workflow-steps');
  for (const step of stack.workflow) {
    const stepEl = create('div', 'stack-detail-step');

    const stepHeader = create('div', 'step-header');
    const stepNum = create('span', 'step-number');
    stepNum.textContent = `${copy.step} ${step.step}`;
    stepHeader.appendChild(stepNum);
    const stepTitle = create('h3', 'step-title');
    stepTitle.textContent = step.title;
    stepHeader.appendChild(stepTitle);
    stepEl.appendChild(stepHeader);

    const stepTools = create('div', 'step-tools');
    stepTools.textContent = `${copy.tools}: ${step.tools.join(', ')}`;
    stepEl.appendChild(stepTools);

    const stepDesc = create('p', 'step-description');
    stepDesc.textContent = step.description;
    stepEl.appendChild(stepDesc);

    stepsContainer.appendChild(stepEl);
  }
  workflow.appendChild(stepsContainer);
  container.appendChild(workflow);

  // Tools in Stack
  const toolsSection = create('section', 'stack-detail-section');
  const toolsTitle = create('h2', 'section-title');
  toolsTitle.textContent = copy.toolsInStack;
  toolsSection.appendChild(toolsTitle);

  const toolsGrid = create('div', 'stack-tools-grid');
  for (const stackTool of stack.tools) {
    const toolCard = create('div', 'stack-tool-card');

    // Find tool data
    const toolData = zeroKeyTools.find((t) => t.id === stackTool.toolId);

    const toolName = create('h4', 'tool-card-name');
    toolName.textContent = toolData?.name || stackTool.toolId;
    toolCard.appendChild(toolName);

    const toolRole = create('span', 'tool-card-role');
    toolRole.textContent = stackTool.role;
    toolCard.appendChild(toolRole);

    // Find cost from breakdown
    const costItem = stack.cost.breakdown.find((c) => c.tool === stackTool.toolId);
    const toolCost = create('span', 'tool-card-cost');
    toolCost.textContent = costItem?.cost || '$0';
    toolCard.appendChild(toolCost);

    // Actions
    const actions = create('div', 'tool-card-actions');
    if (toolData) {
      const viewLink = create('a', 'tool-card-link');
      setSafeExternalHref(viewLink, toolData.url);
      viewLink.target = '_blank';
      viewLink.rel = 'noopener noreferrer';
      viewLink.textContent = copy.view;
      actions.appendChild(viewLink);
    }
    if (stackTool.alternatives && stackTool.alternatives.length > 0) {
      const altBtn = create('button', 'tool-card-alt-btn');
      altBtn.textContent = copy.alt;
      actions.appendChild(altBtn);
    }
    toolCard.appendChild(actions);

    toolsGrid.appendChild(toolCard);
  }
  toolsSection.appendChild(toolsGrid);
  container.appendChild(toolsSection);

  // Cost Breakdown
  const costSection = create('section', 'stack-detail-section');
  const costTitle = create('h2', 'section-title');
  costTitle.textContent = copy.costBreakdown;
  costSection.appendChild(costTitle);

  const costTable = create('div', 'stack-cost-table');

  // Header row
  const headerRow = create('div', 'cost-table-row cost-table-header');
  headerRow.appendChild(span('cost-cell', copy.tool));
  headerRow.appendChild(span('cost-cell', copy.cost));
  headerRow.appendChild(span('cost-cell', copy.notes));
  costTable.appendChild(headerRow);

  // Data rows
  for (const item of stack.cost.breakdown) {
    const row = create('div', 'cost-table-row');
    row.appendChild(
      span('cost-cell', zeroKeyTools.find((t) => t.id === item.tool)?.name ?? item.tool)
    );
    row.appendChild(span('cost-cell cost-amount', item.cost));
    row.appendChild(span('cost-cell cost-notes', item.notes || ''));
    costTable.appendChild(row);
  }

  // Total row
  const totalRow = create('div', 'cost-table-row cost-table-total');
  totalRow.appendChild(span('cost-cell cost-total-label', copy.total));
  totalRow.appendChild(span('cost-cell cost-total-amount', stack.cost.total));
  totalRow.appendChild(span('cost-cell', ''));
  costTable.appendChild(totalRow);

  costSection.appendChild(costTable);
  container.appendChild(costSection);

  // Alternatives
  const allAlternatives = stack.tools
    .filter((t) => t.alternatives && t.alternatives.length > 0)
    .flatMap((t) => t.alternatives || []);

  if (allAlternatives.length > 0) {
    const altSection = create('section', 'stack-detail-section');
    const altTitle = create('h2', 'section-title');
    altTitle.textContent = copy.alternatives;
    altSection.appendChild(altTitle);
    const altText = create('p', 'stack-alt-text');
    altText.textContent = copy.cantFind;
    altSection.appendChild(altText);

    const altList = create('div', 'stack-alt-list');
    // Group by role
    const grouped: Record<string, string[]> = {};
    for (const stackTool of stack.tools) {
      if (stackTool.alternatives && stackTool.alternatives.length > 0) {
        grouped[stackTool.role] = stackTool.alternatives;
      }
    }
    for (const [role, alts] of Object.entries(grouped)) {
      const altGroup = create('div', 'stack-alt-group');
      const altGroupLabel = create('span', 'alt-group-label');
      altGroupLabel.textContent = `${role}:`;
      altGroup.appendChild(altGroupLabel);
      for (const alt of alts) {
        const altChip = create('span', 'alt-chip');
        altChip.textContent = alt;
        altGroup.appendChild(altChip);
      }
      altList.appendChild(altGroup);
    }
    altSection.appendChild(altList);
    container.appendChild(altSection);
  }

  // Resources
  if (stack.resources.length > 0) {
    const resSection = create('section', 'stack-detail-section');
    const resTitle = create('h2', 'section-title');
    resTitle.textContent = copy.resources;
    resSection.appendChild(resTitle);

    const resList = create('ul', 'stack-resources-list');
    for (const res of stack.resources) {
      const li = create('li', 'resource-item');
      const link = create('a', 'resource-link');
      setSafeExternalHref(link, res.url);
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = res.title;
      li.appendChild(link);
      const typeTag = create('span', 'resource-type');
      typeTag.textContent = res.type;
      li.appendChild(typeTag);
      resList.appendChild(li);
    }
    resSection.appendChild(resList);
    container.appendChild(resSection);
  }

  return container;
}
