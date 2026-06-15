/**
 * Model Detail Page — Full detail view for an AI model.
 * Shows overview, benchmarks, hardware requirements, providers, runners, and alternatives.
 */

import type { Lang } from '../i18n';
import type { AIModel } from '../types/tool';
import { aiModels } from '../data/ai-models';
import { renderPrivacyIndicator } from './privacy-indicator';

// ─── Copy ───────────────────────────────────────────────────────────────────

const COPY = {
  en: {
    parameters: 'Parameters',
    active: 'Active',
    architecture: 'Architecture',
    contextWindow: 'Context Window',
    license: 'License',
    commercial: 'Commercial use',
    yes: 'Yes',
    no: 'No',
    restrictions: 'Restrictions',
    overview: 'Overview',
    benchmarks: 'Benchmarks',
    benchmark: 'Benchmark',
    score: 'Score',
    rank: 'Rank',
    hardwareRequirements: 'Hardware Requirements',
    minimum: 'Minimum',
    recommended: 'Recommended',
    gpu: 'GPU',
    required: 'Required',
    optional: 'Optional',
    quantization: 'Quantization',
    whereToUse: 'Where to Use This Model',
    inferenceProviders: 'Inference Providers',
    localRunners: 'Local Runners',
    bestFor: 'Best For',
    alternatives: 'Alternatives',
    resources: 'Resources',
    huggingFace: 'Hugging Face',
    backToModels: '← Back to Models',
    modalities: 'Modalities',
    releaseDate: 'Release Date',
    lastUpdated: 'Last Updated',
  },
  ja: {
    parameters: 'パラメータ',
    active: 'アクティブ',
    architecture: 'アーキテクチャ',
    contextWindow: 'コンテキストウィンドウ',
    license: 'ライセンス',
    commercial: '商用利用',
    yes: '可',
    no: '不可',
    restrictions: '制限',
    overview: '概要',
    benchmarks: 'ベンチマーク',
    benchmark: 'ベンチマーク',
    score: 'スコア',
    rank: 'ランク',
    hardwareRequirements: 'ハードウェア要件',
    minimum: '最小',
    recommended: '推奨',
    gpu: 'GPU',
    required: '必須',
    optional: 'オプション',
    quantization: '量子化',
    whereToUse: 'このモデルの使用場所',
    inferenceProviders: '推論プロバイダー',
    localRunners: 'ローカルランナー',
    bestFor: '最適用途',
    alternatives: '代替モデル',
    resources: 'リソース',
    huggingFace: 'Hugging Face',
    backToModels: '← モデルに戻る',
    modalities: 'モダリティ',
    releaseDate: 'リリース日',
    lastUpdated: '最終更新',
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

function span(className: string, text: string): HTMLSpanElement {
  const el = create('span', className);
  el.textContent = text;
  return el;
}

// ─── Render: Model Detail Page ──────────────────────────────────────────────

export function renderModelDetail(
  model: AIModel,
  lang: Lang,
  onBack?: () => void
): HTMLElement {
  const copy = COPY[lang];
  const container = create('div', 'model-detail-page');

  // Back button
  if (onBack) {
    const backBtn = create('button', 'model-detail-back');
    backBtn.textContent = copy.backToModels;
    backBtn.addEventListener('click', onBack);
    container.appendChild(backBtn);
  }

  // Header
  const header = create('div', 'model-detail-header');
  const title = create('h1', 'model-detail-title');
  title.textContent = model.name;
  header.appendChild(title);

  const subtitle = create('p', 'model-detail-subtitle');
  const paramsText = model.parameters.active
    ? `${model.parameters.total} ${copy.parameters} (${model.parameters.active} ${copy.active})`
    : `${model.parameters.total} ${copy.parameters}`;
  subtitle.textContent = `${paramsText} • ${model.license.type} • ${model.contextWindow}`;
  header.appendChild(subtitle);

  container.appendChild(header);

  // Quick specs
  const specs = create('div', 'model-detail-specs');
  
  const archSpec = createSpecItem(copy.architecture, model.parameters.architecture.toUpperCase());
  specs.appendChild(archSpec);

  const ctxSpec = createSpecItem(copy.contextWindow, model.contextWindow);
  specs.appendChild(ctxSpec);

  const licSpec = createSpecItem(copy.license, model.license.type);
  specs.appendChild(licSpec);

  const commSpec = createSpecItem(copy.commercial, model.license.commercial ? copy.yes : copy.no);
  specs.appendChild(commSpec);

  if (model.license.restrictions && model.license.restrictions.length > 0) {
    const restSpec = createSpecItem(copy.restrictions, model.license.restrictions.join(', '));
    specs.appendChild(restSpec);
  }

  const modalSpec = createSpecItem(copy.modalities, model.modalities.join(', '));
  specs.appendChild(modalSpec);

  container.appendChild(specs);

  // Benchmarks
  const benchKeys = Object.keys(model.benchmarks) as Array<keyof typeof model.benchmarks>;
  if (benchKeys.length > 0) {
    const benchSection = create('section', 'model-detail-section');
    const benchTitle = create('h2', 'section-title');
    benchTitle.textContent = copy.benchmarks;
    benchSection.appendChild(benchTitle);

    const benchTable = create('div', 'model-bench-table');
    
    // Header
    const headerRow = create('div', 'bench-table-row bench-table-header');
    headerRow.appendChild(span('bench-cell', copy.benchmark));
    headerRow.appendChild(span('bench-cell', copy.score));
    benchTable.appendChild(headerRow);

    // Data
    for (const key of benchKeys) {
      const value = model.benchmarks[key];
      if (value !== undefined) {
        const row = create('div', 'bench-table-row');
        row.appendChild(span('bench-cell bench-name', formatBenchmarkName(key)));
        row.appendChild(span('bench-cell bench-score', String(value)));
        benchTable.appendChild(row);
      }
    }

    benchSection.appendChild(benchTable);
    container.appendChild(benchSection);
  }

  // Hardware Requirements
  const hwSection = create('section', 'model-detail-section');
  const hwTitle = create('h2', 'section-title');
  hwTitle.textContent = copy.hardwareRequirements;
  hwSection.appendChild(hwTitle);

  const hwGrid = create('div', 'model-hw-grid');
  
  const minItem = createHwItem(copy.minimum, model.hardware.minRam);
  hwGrid.appendChild(minItem);

  const recItem = createHwItem(copy.recommended, model.hardware.recommendedRam);
  hwGrid.appendChild(recItem);

  const gpuLabel = model.hardware.gpu === 'required' ? copy.required : model.hardware.gpu === 'recommended' ? copy.recommended : copy.optional;
  const gpuItem = createHwItem(copy.gpu, gpuLabel);
  hwGrid.appendChild(gpuItem);

  if (model.hardware.quantization && model.hardware.quantization.length > 0) {
    const quantItem = createHwItem(copy.quantization, model.hardware.quantization.join(', '));
    hwGrid.appendChild(quantItem);
  }

  hwSection.appendChild(hwGrid);
  container.appendChild(hwSection);

  // Where to Use
  const whereSection = create('section', 'model-detail-section');
  const whereTitle = create('h2', 'section-title');
  whereTitle.textContent = copy.whereToUse;
  whereSection.appendChild(whereTitle);

  // Inference Providers
  if (model.availability.inferenceProviders.length > 0) {
    const provGroup = create('div', 'model-provider-group');
    const provLabel = create('h3', 'provider-group-label');
    provLabel.textContent = copy.inferenceProviders;
    provGroup.appendChild(provLabel);
    const provList = create('div', 'provider-chips');
    for (const prov of model.availability.inferenceProviders) {
      provList.appendChild(span('provider-chip', prov));
    }
    provGroup.appendChild(provList);
    whereSection.appendChild(provGroup);
  }

  // Local Runners
  if (model.availability.localRunners.length > 0) {
    const runGroup = create('div', 'model-provider-group');
    const runLabel = create('h3', 'provider-group-label');
    runLabel.textContent = copy.localRunners;
    runGroup.appendChild(runLabel);
    const runList = create('div', 'provider-chips');
    for (const runner of model.availability.localRunners) {
      runList.appendChild(span('provider-chip', runner));
    }
    runGroup.appendChild(runList);
    whereSection.appendChild(runGroup);
  }

  container.appendChild(whereSection);

  // Best For
  if (model.bestFor.length > 0) {
    const bestSection = create('section', 'model-detail-section');
    const bestTitle = create('h2', 'section-title');
    bestTitle.textContent = copy.bestFor;
    bestSection.appendChild(bestTitle);
    const bestList = create('div', 'model-bestfor-tags');
    for (const use of model.bestFor) {
      bestList.appendChild(span('bestfor-tag', use));
    }
    bestSection.appendChild(bestList);
    container.appendChild(bestSection);
  }

  // Alternatives (same family or same bestFor)
  const alternatives = findAlternatives(model);
  if (alternatives.length > 0) {
    const altSection = create('section', 'model-detail-section');
    const altTitle = create('h2', 'section-title');
    altTitle.textContent = copy.alternatives;
    altSection.appendChild(altTitle);
    const altList = create('div', 'model-alt-list');
    for (const alt of alternatives) {
      const altCard = create('div', 'model-alt-card');
      const altName = create('h4', 'alt-card-name');
      altName.textContent = alt.name;
      altCard.appendChild(altName);
      const altParams = create('span', 'alt-card-params');
      altParams.textContent = alt.parameters.total;
      altCard.appendChild(altParams);
      const altLic = create('span', 'alt-card-license');
      altLic.textContent = alt.license.type;
      altCard.appendChild(altLic);
      altList.appendChild(altCard);
    }
    altSection.appendChild(altList);
    container.appendChild(altSection);
  }

  // Resources
  const resSection = create('section', 'model-detail-section');
  const resTitle = create('h2', 'section-title');
  resTitle.textContent = copy.resources;
  resSection.appendChild(resTitle);
  const resList = create('div', 'model-resources-list');
  
  if (model.availability.huggingFace) {
    const hfLink = create('a', 'resource-link');
    hfLink.href = model.availability.huggingFace;
    hfLink.target = '_blank';
    hfLink.rel = 'noopener noreferrer';
    hfLink.textContent = copy.huggingFace;
    resList.appendChild(hfLink);
  }

  resSection.appendChild(resList);
  container.appendChild(resSection);

  // Privacy & License Info
  const privacySection = create('section', 'model-detail-section');
  const privacyTitle = create('h2', 'section-title');
  privacyTitle.textContent = lang === 'ja' ? 'プライバシーとライセンス' : 'Privacy & License';
  privacySection.appendChild(privacyTitle);
  
  // Derive privacy level from license
  const privacyLevel = model.license.commercial && !model.license.restrictions?.length
    ? 'high' as const
    : model.license.commercial
    ? 'medium' as const
    : 'low' as const;
  
  const privacyInfo = {
    level: privacyLevel,
    telemetry: false,
    encryption: true,
    dataResidency: ['Local'] as string[],
    trainingOnPrompts: false,
  };
  privacySection.appendChild(renderPrivacyIndicator(privacyInfo, lang));
  container.appendChild(privacySection);

  // Smart Recommendations (alternative models)
  if (alternatives.length > 0) {
    const recSection = create('section', 'model-detail-section');
    const recTitle = create('h2', 'section-title');
    recTitle.textContent = lang === 'ja' ? 'おすすめモデル' : 'Recommended Models';
    recSection.appendChild(recTitle);
    
    const recList = create('div', 'model-recommendations-list');
    for (const alt of alternatives.slice(0, 3)) {
      const recCard = create('div', 'recommendation-card');
      const recName = create('h4', 'recommendation-name');
      recName.textContent = alt.name;
      recCard.appendChild(recName);
      
      const recDesc = create('p', 'recommendation-desc');
      recDesc.textContent = `${alt.parameters.total} params • ${alt.license.type} • ${alt.contextWindow}`;
      recCard.appendChild(recDesc);
      
      const recReason = create('span', 'recommendation-reason');
      recReason.textContent = alt.family === model.family 
        ? (lang === 'ja' ? '同じファミリー' : 'Same family')
        : (lang === 'ja' ? '類似の用途' : 'Similar use cases');
      recCard.appendChild(recReason);
      
      recList.appendChild(recCard);
    }
    recSection.appendChild(recList);
    container.appendChild(recSection);
  }

  // Metadata
  const metaSection = create('div', 'model-detail-meta');
  metaSection.appendChild(span('meta-item', `${copy.releaseDate}: ${model.releaseDate}`));
  metaSection.appendChild(span('meta-item', `${copy.lastUpdated}: ${model.lastUpdated}`));
  container.appendChild(metaSection);

  return container;
}

function createSpecItem(label: string, value: string): HTMLElement {
  const item = create('div', 'model-spec-item');
  const labelEl = create('span', 'spec-label');
  labelEl.textContent = label;
  item.appendChild(labelEl);
  const valueEl = create('span', 'spec-value');
  valueEl.textContent = value;
  item.appendChild(valueEl);
  return item;
}

function createHwItem(label: string, value: string): HTMLElement {
  const item = create('div', 'model-hw-item');
  const labelEl = create('span', 'hw-label');
  labelEl.textContent = label;
  item.appendChild(labelEl);
  const valueEl = create('span', 'hw-value');
  valueEl.textContent = value;
  item.appendChild(valueEl);
  return item;
}

function formatBenchmarkName(key: string): string {
  const names: Record<string, string> = {
    mmlu: 'MMLU (Knowledge)',
    humanEval: 'HumanEval (Coding)',
    math: 'MATH-500 (Math)',
    reasoning: 'GPQA (Reasoning)',
    multilingual: 'Multilingual',
    sweBench: 'SWE-Bench (Coding)',
  };
  return names[key] || key;
}

function findAlternatives(model: AIModel): AIModel[] {
  return aiModels
    .filter(m => m.id !== model.id)
    .filter(m => {
      // Same family
      if (m.family === model.family) return true;
      // Same bestFor overlap
      const overlap = m.bestFor.filter(b => model.bestFor.includes(b));
      return overlap.length >= 2;
    })
    .slice(0, 5);
}
