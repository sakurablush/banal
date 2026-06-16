/**
 * Cost Calculator — Estimates monthly costs for AI tools based on usage.
 * Shows free tier limits, overage costs, and alternative free options.
 */

import type { Lang } from '../i18n';
import type { PricingInfo } from '../types/tool';

// ─── Copy ───────────────────────────────────────────────────────────────────

const COPY = {
  en: {
    costCalculator: 'Cost Calculator',
    estimateMonthly: 'Estimate your monthly cost',
    usage: 'Usage',
    requestsPerDay: 'Requests per day',
    tokensPerRequest: 'Tokens per request',
    model: 'Model',
    estimatedMonthlyCost: 'Estimated Monthly Cost',
    freeTier: 'Free Tier',
    yourUsage: 'Your Usage',
    overage: 'Overage',
    costPerRequest: 'Cost per request',
    total: 'TOTAL',
    costBreakdown: 'Cost Breakdown',
    inputTokens: 'Input tokens',
    outputTokens: 'Output tokens',
    yourUsageTokens: 'Your usage',
    calculation: 'Calculation',
    alternatives: 'Alternatives',
    perMonth: '/month',
    free: 'Free',
    requests: 'requests',
    tokens: 'tokens',
    day: 'day',
  },
  ja: {
    costCalculator: 'コスト計算機',
    estimateMonthly: '月額費用を見積もる',
    usage: '使用量',
    requestsPerDay: '1日あたりのリクエスト数',
    tokensPerRequest: 'リクエストあたりのトークン数',
    model: 'モデル',
    estimatedMonthlyCost: '推定月額費用',
    freeTier: '無料枠',
    yourUsage: 'あなたの使用量',
    overage: '超過分',
    costPerRequest: 'リクエストあたりのコスト',
    total: '合計',
    costBreakdown: 'コスト内訳',
    inputTokens: '入力トークン',
    outputTokens: '出力トークン',
    yourUsageTokens: 'あなたの使用量',
    calculation: '計算',
    alternatives: '代替案',
    perMonth: '/月',
    free: '無料',
    requests: 'リクエスト',
    tokens: 'トークン',
    day: '日',
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

// ─── Cost Calculation Logic ─────────────────────────────────────────────────

interface CostEstimate {
  freeTierLimit: number; // requests per day
  yourUsagePerDay: number;
  overagePerDay: number;
  costPerRequest: number;
  totalMonthlyCost: number;
}

function calculateCost(
  requestsPerDay: number,
  _tokensPerRequest: number,
  pricing: PricingInfo
): CostEstimate {
  // Default free tier: 1000 requests/day
  const freeTierLimit = pricing.freeTier ? 1000 : 0;

  // Default cost per request: $0.002 (based on typical AI API pricing)
  const costPerRequest = 0.002;

  const yourUsagePerDay = requestsPerDay;
  const overagePerDay = Math.max(0, yourUsagePerDay - freeTierLimit);
  const totalMonthlyCost = overagePerDay * 30 * costPerRequest;

  return {
    freeTierLimit,
    yourUsagePerDay,
    overagePerDay,
    costPerRequest,
    totalMonthlyCost,
  };
}

// ─── Render: Cost Calculator ────────────────────────────────────────────────

export function renderCostCalculator(
  pricing: PricingInfo,
  lang: Lang,
  initialRequestsPerDay: number = 100,
  initialTokensPerRequest: number = 1000
): HTMLElement {
  const copy = COPY[lang];
  const container = create('div', 'cost-calculator');

  // Header
  const header = create('div', 'cost-calculator-header');
  const title = create('h3', 'cost-calculator-title');
  title.textContent = copy.costCalculator;
  header.appendChild(title);
  const subtitle = create('p', 'cost-calculator-subtitle');
  subtitle.textContent = copy.estimateMonthly;
  header.appendChild(subtitle);
  container.appendChild(header);

  // Usage inputs
  const usageSection = create('div', 'cost-usage-section');
  const usageLabel = create('label', 'cost-usage-label');
  usageLabel.textContent = copy.usage;
  usageSection.appendChild(usageLabel);

  // Requests per day input
  const requestsInput = create('input', 'cost-input');
  requestsInput.type = 'number';
  requestsInput.value = String(initialRequestsPerDay);
  requestsInput.min = '1';
  requestsInput.max = '100000';
  const requestsLabel = create('label', 'cost-input-label');
  requestsLabel.textContent = copy.requestsPerDay;
  usageSection.appendChild(requestsLabel);
  usageSection.appendChild(requestsInput);

  // Tokens per request input
  const tokensInput = create('input', 'cost-input');
  tokensInput.type = 'number';
  tokensInput.value = String(initialTokensPerRequest);
  tokensInput.min = '100';
  tokensInput.max = '1000000';
  const tokensLabel = create('label', 'cost-input-label');
  tokensLabel.textContent = copy.tokensPerRequest;
  usageSection.appendChild(tokensLabel);
  usageSection.appendChild(tokensInput);

  container.appendChild(usageSection);

  // Cost estimate display
  const estimateSection = create('div', 'cost-estimate-section');
  const estimateLabel = create('label', 'cost-estimate-label');
  estimateLabel.textContent = copy.estimatedMonthlyCost;
  estimateSection.appendChild(estimateLabel);

  const estimateDisplay = create('div', 'cost-estimate-display');
  estimateSection.appendChild(estimateDisplay);

  container.appendChild(estimateSection);

  // Update cost estimate on input change
  function updateEstimate() {
    const requestsPerDay = parseInt(requestsInput.value) || initialRequestsPerDay;
    const tokensPerRequest = parseInt(tokensInput.value) || initialTokensPerRequest;
    const estimate = calculateCost(requestsPerDay, tokensPerRequest, pricing);
    renderEstimate(estimateDisplay, estimate, copy);
  }

  requestsInput.addEventListener('input', updateEstimate);
  tokensInput.addEventListener('input', updateEstimate);

  // Initial render
  updateEstimate();

  return container;
}

function renderEstimate(
  container: HTMLElement,
  estimate: CostEstimate,
  copy: typeof COPY.en
): void {
  container.innerHTML = '';

  // Free tier line
  const freeTierLine = create('div', 'cost-estimate-line');
  freeTierLine.innerHTML = `<strong>${copy.freeTier}:</strong> $0 (${estimate.freeTierLimit.toLocaleString()} ${copy.requests}/${copy.day})`;
  container.appendChild(freeTierLine);

  // Your usage line
  const yourUsageLine = create('div', 'cost-estimate-line');
  yourUsageLine.innerHTML = `<strong>${copy.yourUsage}:</strong> ${estimate.yourUsagePerDay.toLocaleString()} ${copy.requests}/${copy.day} (${estimate.yourUsagePerDay * 30} ${copy.requests}/${copy.perMonth.replace('/', ' ')})`;
  container.appendChild(yourUsageLine);

  // Overage line
  if (estimate.overagePerDay > 0) {
    const overageLine = create('div', 'cost-estimate-line cost-overage');
    overageLine.innerHTML = `<strong>${copy.overage}:</strong> ${estimate.overagePerDay.toLocaleString()} ${copy.requests}/${copy.day}`;
    container.appendChild(overageLine);

    const costLine = create('div', 'cost-estimate-line');
    costLine.innerHTML = `<strong>${copy.costPerRequest}:</strong> $${estimate.costPerRequest.toFixed(3)}`;
    container.appendChild(costLine);
  }

  // Total line
  const totalLine = create('div', 'cost-estimate-line cost-total');
  totalLine.innerHTML = `<strong>${copy.total}:</strong> $${estimate.totalMonthlyCost.toFixed(2)}${copy.perMonth}`;
  container.appendChild(totalLine);
}
