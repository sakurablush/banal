/**
 * Tool Comparison View — Side-by-side comparison of multiple tools.
 * Shows pricing, features, privacy, and recommendations.
 */

import type { Lang } from '../i18n';
import type { Tool } from '../types/tool';

// ─── Copy ───────────────────────────────────────────────────────────────────

const COPY = {
  en: {
    compareTools: 'Compare Tools',
    addTool: 'Add tool',
    removeTool: 'Remove tool',
    shareComparison: 'Share comparison',
    pricing: 'Pricing',
    license: 'License',
    stars: 'Stars',
    models: 'Models',
    ideSupport: 'IDE Support',
    keyFeatures: 'Key Features',
    privacy: 'Privacy',
    bestFor: 'Best For',
    recommendation: 'Recommendation',
    chooseIf: 'Choose {name} if',
    free: 'Free',
    freeTier: 'Free tier',
    paid: 'Paid',
    byok: 'BYOK',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  },
  ja: {
    compareTools: 'ツール比較',
    addTool: 'ツールを追加',
    removeTool: 'ツールを削除',
    shareComparison: '比較を共有',
    pricing: '価格',
    license: 'ライセンス',
    stars: 'スター',
    models: 'モデル',
    ideSupport: 'IDEサポート',
    keyFeatures: '主な機能',
    privacy: 'プライバシー',
    bestFor: '最適用途',
    recommendation: 'おすすめ',
    chooseIf: '{name}を選ぶべき場合',
    free: '無料',
    freeTier: '無料枠',
    paid: '有料',
    byok: 'BYOK',
    high: '高',
    medium: '中',
    low: '低',
  },
} satisfies Record<Lang, Record<string, string>>;

// ─── Helpers ────────────────────────────────────────────────────────────────

function create<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (className) el.className = className;
  return el;
}

// ─── Render: Comparison View ────────────────────────────────────────────────

export function renderToolComparison(
  tools: Tool[],
  lang: Lang
): HTMLElement {
  const copy = COPY[lang];
  const container = create('div', 'tool-comparison');

  // Header
  const header = create('div', 'comparison-header');
  const title = create('h2', 'comparison-title');
  title.textContent = copy.compareTools;
  header.appendChild(title);

  const actions = create('div', 'comparison-actions');
  const addBtn = create('button', 'comparison-btn');
  addBtn.textContent = copy.addTool;
  actions.appendChild(addBtn);
  const shareBtn = create('button', 'comparison-btn');
  shareBtn.textContent = copy.shareComparison;
  actions.appendChild(shareBtn);
  header.appendChild(actions);

  container.appendChild(header);

  // Tools grid
  const grid = create('div', 'comparison-grid');
  for (const tool of tools) {
    grid.appendChild(renderToolColumn(tool, copy));
  }
  container.appendChild(grid);

  // Recommendations
  const recommendations = create('div', 'comparison-recommendations');
  const recTitle = create('h3', 'recommendations-title');
  recTitle.textContent = copy.recommendation;
  recommendations.appendChild(recTitle);

  for (const tool of tools) {
    const rec = create('div', 'recommendation-item');
    const recText = create('p', 'recommendation-text');
    recText.textContent = `${copy.chooseIf.replace('{name}', tool.name)}: ${tool.bestFor}`;
    rec.appendChild(recText);
    recommendations.appendChild(rec);
  }

  container.appendChild(recommendations);

  return container;
}

function renderToolColumn(tool: Tool, copy: typeof COPY.en): HTMLElement {
  const column = create('div', 'comparison-column');

  // Tool name
  const name = create('h3', 'comparison-tool-name');
  name.textContent = tool.name;
  column.appendChild(name);

  // Pricing
  column.appendChild(renderComparisonRow(copy.pricing, getPricingLabel(tool, copy)));

  // License
  if (tool.quality?.privacy) {
    column.appendChild(renderComparisonRow(copy.license, 'Open Source'));
  }

  // Stars (if available)
  if (tool.quality?.trust?.githubStars) {
    column.appendChild(renderComparisonRow(copy.stars, formatStars(tool.quality.trust.githubStars)));
  }

  // IDE Support
  const ideSupport = getIdeSupport(tool);
  if (ideSupport) {
    column.appendChild(renderComparisonRow(copy.ideSupport, ideSupport));
  }

  // Key Features
  column.appendChild(renderComparisonRow(copy.keyFeatures, tool.badges.slice(0, 3).join(', ')));

  // Privacy
  if (tool.quality?.privacy) {
    const privacyLevel = tool.quality.privacy.level;
    const privacyLabel = privacyLevel === 'high' ? copy.high : privacyLevel === 'medium' ? copy.medium : copy.low;
    column.appendChild(renderComparisonRow(copy.privacy, privacyLabel));
  }

  // Best For
  column.appendChild(renderComparisonRow(copy.bestFor, tool.bestFor));

  return column;
}

function renderComparisonRow(label: string, value: string): HTMLElement {
  const row = create('div', 'comparison-row');
  const labelEl = create('div', 'comparison-row-label');
  labelEl.textContent = label;
  row.appendChild(labelEl);
  const valueEl = create('div', 'comparison-row-value');
  valueEl.textContent = value;
  row.appendChild(valueEl);
  return row;
}

function getPricingLabel(tool: Tool, copy: typeof COPY.en): string {
  if (tool.pricing.model === 'free') return copy.free;
  if (tool.pricing.model === 'byok') return copy.byok;
  if (tool.pricing.freeTier) return copy.freeTier;
  return copy.paid;
}

function formatStars(stars: number): string {
  if (stars >= 1000) {
    return `${(stars / 1000).toFixed(1)}K`;
  }
  return String(stars);
}

function getIdeSupport(tool: Tool): string | null {
  const ides: string[] = [];
  if (tool.platforms?.ide?.vscode) ides.push('VS Code');
  if (tool.platforms?.ide?.jetbrains) ides.push('JetBrains');
  if (tool.platforms?.ide?.neovim) ides.push('Neovim');
  return ides.length > 0 ? ides.join(', ') : null;
}
