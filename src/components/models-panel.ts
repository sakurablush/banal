/**
 * AI Models Panel — Renders the AI Models section with search, filtering,
 * and comparison capabilities. Shows 50+ open-source LLMs with benchmarks.
 */

import type { Lang } from '../i18n';
import { aiModels, getModelFamilies } from '../data/ai-models';
import type { AIModel } from '../types/tool';
import { renderModelDetail } from './model-detail';

// ─── Copy ───────────────────────────────────────────────────────────────────

const COPY = {
  en: {
    title: 'AI Models Directory',
    subtitle: 'Discover the best open-source LLMs for your use case',
    searchPlaceholder: 'Search models\u2026',
    allModels: 'All Models',
    featured: 'Featured',
    bestFor: 'Best For',
    license: 'License',
    context: 'Context',
    params: 'Parameters',
    architecture: 'Architecture',
    hardware: 'Hardware',
    providers: 'Providers',
    runners: 'Local Runners',
    compare: 'Compare',
    viewDetails: 'View Details',
    showing: (visible: number, total: number) => `Showing ${visible} of ${total} models`,
    noMatches: 'No models match your search',
    filterByFamily: 'Filter by Family',
    filterByUseCase: 'Filter by Use Case',
    filterByLicense: 'Filter by License',
    coding: 'Coding',
    reasoning: 'Reasoning',
    multilingual: 'Multilingual',
    longContext: 'Long Context',
    singleGpu: 'Single GPU',
    allFamilies: 'All Families',
    allLicenses: 'All Licenses',
    allUseCases: 'All Use Cases',
  },
  ja: {
    title: 'AIモデルディレクトリ',
    subtitle: '用途に最適なオープンソースLLMを発見',
    searchPlaceholder: 'モデルを検索\u2026',
    allModels: '全モデル',
    featured: '注目',
    bestFor: '最適用途',
    license: 'ライセンス',
    context: 'コンテキスト',
    params: 'パラメータ',
    architecture: 'アーキテクチャ',
    hardware: 'ハードウェア',
    providers: 'プロバイダー',
    runners: 'ローカルランナー',
    compare: '比較',
    viewDetails: '詳細',
    showing: (visible: number, total: number) => `${visible} / ${total}モデル`,
    noMatches: '一致するモデルがありません',
    filterByFamily: 'ファミリーで絞り込み',
    filterByUseCase: '用途で絞り込み',
    filterByLicense: 'ライセンスで絞り込み',
    coding: 'コーディング',
    reasoning: '推論',
    multilingual: '多言語',
    longContext: '長文対応',
    singleGpu: 'シングルGPU',
    allFamilies: '全ファミリー',
    allLicenses: '全ライセンス',
    allUseCases: '全用途',
  },
} satisfies Record<Lang, Record<string, string | ((...args: number[]) => string)>>;

// ─── State ──────────────────────────────────────────────────────────────────

interface ModelsPanelState {
  lang: Lang;
  query: string;
  familyFilter: string | null;
  useCaseFilter: string | null;
  licenseFilter: string | null;
  compareSet: Set<string>;
  container: HTMLElement | null;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function create<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (className) el.className = className;
  return el;
}

/** Create a spec element with label and value using safe DOM manipulation */
function createSpec(label: string, value: string, valueClass?: string): HTMLElement {
  const spec = create('div', 'model-spec');
  const labelEl = create('span', 'model-spec-label');
  labelEl.textContent = label;
  spec.appendChild(labelEl);
  const valueEl = create('span', valueClass || 'model-spec-value');
  valueEl.textContent = value;
  spec.appendChild(valueEl);
  return spec;
}

/** Create a comparison row with label and value using safe DOM manipulation */
function createCompRow(label: string, value: string): HTMLElement {
  const row = create('div', 'comparison-row');
  const labelEl = create('span', 'comparison-label');
  labelEl.textContent = label;
  row.appendChild(labelEl);
  const valueEl = create('span', 'comparison-value');
  valueEl.textContent = value;
  row.appendChild(valueEl);
  return row;
}

function filterModels(state: ModelsPanelState): AIModel[] {
  let models = [...aiModels];

  // Search filter
  if (state.query.trim()) {
    const q = state.query.toLowerCase();
    models = models.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.provider.toLowerCase().includes(q) ||
        m.family.toLowerCase().includes(q) ||
        m.bestFor.some((b) => b.toLowerCase().includes(q)) ||
        m.license.type.toLowerCase().includes(q)
    );
  }

  // Family filter
  if (state.familyFilter) {
    models = models.filter((m) => m.family === state.familyFilter);
  }

  // Use case filter
  if (state.useCaseFilter) {
    models = models.filter((m) => m.bestFor.includes(state.useCaseFilter!));
  }

  // License filter
  if (state.licenseFilter) {
    models = models.filter((m) => m.license.type === state.licenseFilter);
  }

  return models;
}

// ─── Render: Model Card ─────────────────────────────────────────────────────

function renderModelCard(state: ModelsPanelState, model: AIModel): HTMLElement {
  const copy = COPY[state.lang];
  const card = create('article', 'model-card');

  // Header
  const header = create('div', 'model-card-header');
  const nameEl = create('h3', 'model-card-name');
  nameEl.textContent = model.name;
  header.appendChild(nameEl);

  const providerEl = create('span', 'model-card-provider');
  providerEl.textContent = model.provider;
  header.appendChild(providerEl);
  card.appendChild(header);

  // Key specs
  const specs = create('div', 'model-card-specs');

  const paramsLabel = typeof copy.params === 'string' ? copy.params : 'Parameters';
  const paramsValue = model.parameters.active
    ? `${model.parameters.total} / ${model.parameters.active}`
    : model.parameters.total;
  specs.appendChild(createSpec(paramsLabel, paramsValue));

  const archLabel = typeof copy.architecture === 'string' ? copy.architecture : 'Architecture';
  specs.appendChild(createSpec(archLabel, model.parameters.architecture.toUpperCase()));

  const ctxLabel = typeof copy.context === 'string' ? copy.context : 'Context';
  specs.appendChild(createSpec(ctxLabel, model.contextWindow));

  const licLabel = typeof copy.license === 'string' ? copy.license : 'License';
  specs.appendChild(createSpec(licLabel, model.license.type, 'model-spec-value model-license-badge'));

  card.appendChild(specs);

  // Benchmarks (if available)
  const benchKeys = Object.keys(model.benchmarks) as Array<keyof typeof model.benchmarks>;
  if (benchKeys.length > 0) {
    const benchmarks = create('div', 'model-card-benchmarks');
    for (const key of benchKeys) {
      const value = model.benchmarks[key];
      if (value !== undefined) {
        const bench = create('span', 'model-benchmark');
        bench.textContent = `${key}: ${value}`;
        benchmarks.appendChild(bench);
      }
    }
    card.appendChild(benchmarks);
  }

  // Best for tags
  if (model.bestFor.length > 0) {
    const bestFor = create('div', 'model-card-bestfor');
    for (const use of model.bestFor.slice(0, 4)) {
      const tag = create('span', 'model-use-tag');
      tag.textContent = use;
      bestFor.appendChild(tag);
    }
    card.appendChild(bestFor);
  }

  // Hardware info
  const hw = create('div', 'model-card-hardware');
  hw.textContent = `${typeof copy.hardware === 'string' ? copy.hardware : 'Hardware'}: ${model.hardware.minRam}${model.hardware.gpu === 'required' ? ' (GPU required)' : model.hardware.gpu === 'recommended' ? ' (GPU recommended)' : ''}`;
  card.appendChild(hw);

  // Availability
  const avail = create('div', 'model-card-availability');
  if (model.availability.inferenceProviders.length > 0) {
    const provEl = create('div', 'model-avail-row');
    provEl.textContent = `${typeof copy.providers === 'string' ? copy.providers : 'Providers'}: ${model.availability.inferenceProviders.join(', ')}`;
    avail.appendChild(provEl);
  }
  if (model.availability.localRunners.length > 0) {
    const runEl = create('div', 'model-avail-row');
    runEl.textContent = `${typeof copy.runners === 'string' ? copy.runners : 'Local Runners'}: ${model.availability.localRunners.join(', ')}`;
    avail.appendChild(runEl);
  }
  card.appendChild(avail);

  // Compare checkbox
  const compareWrap = create('label', 'model-compare-check');
  const checkbox = create('input');
  checkbox.type = 'checkbox';
  checkbox.checked = state.compareSet.has(model.id);
  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      state.compareSet.add(model.id);
    } else {
      state.compareSet.delete(model.id);
    }
    renderContent(state);
  });
  compareWrap.appendChild(checkbox);
  const compareLabel = create('span');
  compareLabel.textContent = typeof copy.compare === 'string' ? copy.compare : 'Compare';
  compareWrap.appendChild(compareLabel);
  card.appendChild(compareWrap);

  // Click to open detail view
  card.style.cursor = 'pointer';
  card.addEventListener('click', (e) => {
    // Don't open detail if clicking on checkbox
    if ((e.target as HTMLElement).closest('.model-compare-check')) return;
    
    const container = state.container;
    if (!container) return;
    
    // Store original content
    const originalContent = container.innerHTML;
    
    // Render detail view
    container.innerHTML = '';
    const detailView = renderModelDetail(model, state.lang, () => {
      // Back button callback - restore original content
      container.innerHTML = originalContent;
      renderContent(state);
    });
    container.appendChild(detailView);
  });

  return card;
}

// ─── Render: Filter Bar ─────────────────────────────────────────────────────

function renderFilterBar(state: ModelsPanelState): HTMLElement {
  const copy = COPY[state.lang];
  const bar = create('div', 'models-filter-bar');

  // Search
  const searchWrap = create('div', 'models-search-wrap');
  const searchInput = create('input');
  searchInput.type = 'text';
  searchInput.className = 'models-search-input';
  searchInput.placeholder = typeof copy.searchPlaceholder === 'string' ? copy.searchPlaceholder : 'Search models\u2026';
  searchInput.value = state.query;
  searchInput.addEventListener('input', () => {
    state.query = searchInput.value;
    renderContent(state);
  });
  searchWrap.appendChild(searchInput);
  bar.appendChild(searchWrap);

  // Filter chips row
  const chipsRow = create('div', 'models-filter-chips');

  // Family filter
  const families = getModelFamilies();
  const familySelect = create('select', 'models-filter-select');
  const allFamOpt = create('option');
  allFamOpt.value = '';
  allFamOpt.textContent = typeof copy.allFamilies === 'string' ? copy.allFamilies : 'All Families';
  familySelect.appendChild(allFamOpt);
  for (const fam of families) {
    const opt = create('option');
    opt.value = fam;
    opt.textContent = fam;
    if (state.familyFilter === fam) opt.selected = true;
    familySelect.appendChild(opt);
  }
  familySelect.addEventListener('change', () => {
    state.familyFilter = familySelect.value || null;
    renderContent(state);
  });
  chipsRow.appendChild(familySelect);

  // Use case filter
  const useCases = ['coding', 'reasoning', 'multilingual', 'long-context', 'general', 'all-round', 'consumer-hardware', 'edge-deployment', 'vision'];
  const useCaseSelect = create('select', 'models-filter-select');
  const allUseOpt = create('option');
  allUseOpt.value = '';
  allUseOpt.textContent = typeof copy.allUseCases === 'string' ? copy.allUseCases : 'All Use Cases';
  useCaseSelect.appendChild(allUseOpt);
  for (const uc of useCases) {
    const opt = create('option');
    opt.value = uc;
    opt.textContent = uc;
    if (state.useCaseFilter === uc) opt.selected = true;
    useCaseSelect.appendChild(opt);
  }
  useCaseSelect.addEventListener('change', () => {
    state.useCaseFilter = useCaseSelect.value || null;
    renderContent(state);
  });
  chipsRow.appendChild(useCaseSelect);

  // License filter
  const licenses = [...new Set(aiModels.map((m) => m.license.type))].sort();
  const licSelect = create('select', 'models-filter-select');
  const allLicOpt = create('option');
  allLicOpt.value = '';
  allLicOpt.textContent = typeof copy.allLicenses === 'string' ? copy.allLicenses : 'All Licenses';
  licSelect.appendChild(allLicOpt);
  for (const lic of licenses) {
    const opt = create('option');
    opt.value = lic;
    opt.textContent = lic;
    if (state.licenseFilter === lic) opt.selected = true;
    licSelect.appendChild(opt);
  }
  licSelect.addEventListener('change', () => {
    state.licenseFilter = licSelect.value || null;
    renderContent(state);
  });
  chipsRow.appendChild(licSelect);

  bar.appendChild(chipsRow);

  // Quick filter chips
  const quickChips = create('div', 'models-quick-chips');
  const chipDefs = [
    { label: typeof copy.coding === 'string' ? copy.coding : 'Coding', useCase: 'coding' },
    { label: typeof copy.reasoning === 'string' ? copy.reasoning : 'Reasoning', useCase: 'reasoning' },
    { label: typeof copy.multilingual === 'string' ? copy.multilingual : 'Multilingual', useCase: 'multilingual' },
    { label: typeof copy.longContext === 'string' ? copy.longContext : 'Long Context', useCase: 'long-context' },
    { label: typeof copy.singleGpu === 'string' ? copy.singleGpu : 'Single GPU', useCase: 'consumer-hardware' },
  ];
  for (const chip of chipDefs) {
    const btn = create('button', `models-quick-chip${state.useCaseFilter === chip.useCase ? ' active' : ''}`);
    btn.type = 'button';
    btn.textContent = chip.label;
    btn.addEventListener('click', () => {
      state.useCaseFilter = state.useCaseFilter === chip.useCase ? null : chip.useCase;
      renderContent(state);
    });
    quickChips.appendChild(btn);
  }
  bar.appendChild(quickChips);

  return bar;
}

// ─── Render: Comparison View ────────────────────────────────────────────────

function renderComparison(state: ModelsPanelState): HTMLElement | null {
  if (state.compareSet.size < 2) return null;

  const copy = COPY[state.lang];
  const selectedModels = aiModels.filter((m) => state.compareSet.has(m.id));
  if (selectedModels.length < 2) return null;

  const wrapper = create('div', 'models-comparison');
  const title = create('h3', 'models-comparison-title');
  title.textContent = `${typeof copy.compare === 'string' ? copy.compare : 'Compare'} (${selectedModels.length})`;
  wrapper.appendChild(title);

  const grid = create('div', 'models-comparison-grid');
  for (const model of selectedModels) {
    const col = create('div', 'models-comparison-col');

    const name = create('h4', 'comparison-model-name');
    name.textContent = model.name;
    col.appendChild(name);

    const rows = [
      { label: typeof copy.params === 'string' ? copy.params : 'Parameters', value: `${model.parameters.total}${model.parameters.active ? ` / ${model.parameters.active}` : ''}` },
      { label: typeof copy.license === 'string' ? copy.license : 'License', value: model.license.type },
      { label: typeof copy.context === 'string' ? copy.context : 'Context', value: model.contextWindow },
      { label: typeof copy.architecture === 'string' ? copy.architecture : 'Architecture', value: model.parameters.architecture.toUpperCase() },
      { label: typeof copy.hardware === 'string' ? copy.hardware : 'Hardware', value: model.hardware.minRam },
    ];

    for (const row of rows) {
      col.appendChild(createCompRow(row.label, row.value));
    }

    // Benchmarks
    const benchKeys = Object.keys(model.benchmarks) as Array<keyof typeof model.benchmarks>;
    if (benchKeys.length > 0) {
      const benchSection = create('div', 'comparison-benchmarks');
      const benchTitle = create('span', 'comparison-section-title');
      benchTitle.textContent = 'Benchmarks';
      benchSection.appendChild(benchTitle);
      for (const key of benchKeys) {
        const value = model.benchmarks[key];
        if (value !== undefined) {
          benchSection.appendChild(createCompRow(key, String(value)));
        }
      }
      col.appendChild(benchSection);
    }

    grid.appendChild(col);
  }

  wrapper.appendChild(grid);
  return wrapper;
}

// ─── Render: Content ────────────────────────────────────────────────────────

function renderContent(state: ModelsPanelState): void {
  const container = state.container;
  if (!container) return;

  const contentArea = container.querySelector('.models-content') as HTMLElement | null;
  if (!contentArea) return;

  contentArea.innerHTML = '';
  const copy = COPY[state.lang];
  const models = filterModels(state);

  // Stats bar
  const stats = create('div', 'models-stats-bar');
  stats.setAttribute('aria-live', 'polite');
  stats.textContent = typeof copy.showing === 'function' ? copy.showing(models.length, aiModels.length) : `${models.length} / ${aiModels.length} models`;
  contentArea.appendChild(stats);

  // Comparison view (if 2+ selected)
  const comparison = renderComparison(state);
  if (comparison) {
    contentArea.appendChild(comparison);
  }

  // Empty state
  if (models.length === 0) {
    const empty = create('div', 'models-empty');
    empty.textContent = typeof copy.noMatches === 'string' ? copy.noMatches : 'No models match';
    contentArea.appendChild(empty);
    return;
  }

  // Model cards grid
  const grid = create('div', 'models-grid');
  for (const model of models) {
    grid.appendChild(renderModelCard(state, model));
  }
  contentArea.appendChild(grid);
}

// ─── Public API ─────────────────────────────────────────────────────────────

export interface ModelsPanelApi {
  search: (query: string) => void;
  reset: () => void;
  destroy: () => void;
}

export function renderModelsPanel(
  container: HTMLElement,
  options: { lang: Lang }
): ModelsPanelApi {
  const { lang } = options;
  const copy = COPY[lang];

  const state: ModelsPanelState = {
    lang,
    query: '',
    familyFilter: null,
    useCaseFilter: null,
    licenseFilter: null,
    compareSet: new Set(),
    container,
  };

  container.innerHTML = '';
  container.className = 'models-panel';

  // Header
  const header = create('div', 'models-panel-header');
  const title = create('h2', 'models-panel-title');
  title.textContent = typeof copy.title === 'string' ? copy.title : 'AI Models';
  header.appendChild(title);
  const subtitle = create('p', 'models-panel-subtitle');
  subtitle.textContent = typeof copy.subtitle === 'string' ? copy.subtitle : 'Discover open-source LLMs';
  header.appendChild(subtitle);
  container.appendChild(header);

  // Filter bar
  container.appendChild(renderFilterBar(state));

  // Content area
  const content = create('div', 'models-content');
  container.appendChild(content);

  // Initial render
  renderContent(state);

  return {
    search: (query: string) => {
      state.query = query;
      renderContent(state);
    },
    reset: () => {
      state.query = '';
      state.familyFilter = null;
      state.useCaseFilter = null;
      state.licenseFilter = null;
      state.compareSet.clear();
      renderContent(state);
    },
    destroy: () => {
      state.compareSet.clear();
    },
  };
}
