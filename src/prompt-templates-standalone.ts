/**
 * Standalone Prompt Templates UI — Horizontal Scroller Redesign
 *
 * Renders prompt templates in a horizontal scroll layout (Android app drawer style):
 * - All templates visible in a horizontal scroll container
 * - Clicking a card opens the form in an accordion slide-down under the card
 * - Keyboard navigation with ← → arrows
 * - Category sidebar with filter toolbar above categories
 *
 * Features preserved from original:
 * - Auto-save to sessionStorage per template (more secure - cleared on tab close)
 * - Keyboard shortcuts: Ctrl/Cmd+Enter to copy, Esc to close form
 * - Toast notification on copy
 * - Preview mode
 */

import { PromptTemplatesLibrary, type Locale, type PromptTemplate } from './lib/prompt-templates';
import { createCloseButton } from './lib/close-button';
import { getSectionParams } from './lib/section-filter-url';
import { renderFilterToolbar } from './components/filter-toolbar';
import { createSidebarColumn } from './lib/sidebar-column';
import { createPanelStatsBar, mountPanelContent } from './lib/panel-stats-bar';
import { bindZk2LayoutHeightSync, syncZk2LayoutHeight } from './lib/sync-zk2-layout-height';
import { t } from './i18n';
import { applyPromptsFilterValues } from './lib/apply-prompts-filters';
import { appendChildrenBatched } from './lib/batch-dom';
import { getRawSuggestionsForSection } from './lib/filter-suggestions';
import type { FilterSuggestion } from './lib/filter-suggestions';
import { trackFilterEvent } from './lib/filter-analytics';
import { onPromptFormInput } from './lib/privacy-banner';
import { zeroKeyTools } from './data/zero-key-tools';

const STORAGE_PREFIX = 'banal-pt-';

/**
 * Curated set of "no-friction" AI chats to surface in the How-to-use chip strip.
 * Sorted by access preference, then by id, to make the strip stable across renders.
 */
const RECOMMENDED_CHAT_IDS: readonly string[] = [
  'duck-ai',
  'microsoft-copilot',
  'meta-ai',
  'chatgpt-free',
  'google-gemini',
  'mistral-le-chat',
];

// ─── Category Taxonomy ──────────────────────────────────────────────────────────

interface PromptCategory {
  id: string;
  labelEn: string;
  labelJa: string;
  icon: string;
}

const PROMPT_CATEGORIES: PromptCategory[] = [
  { id: 'all', labelEn: 'All', labelJa: 'すべて', icon: '' },
  { id: 'career-work', labelEn: 'Career & Work', labelJa: '仕事・キャリア', icon: '\u{1F4BC}' },
  { id: 'money-finance', labelEn: 'Money & Finance', labelJa: 'お金・家計', icon: '\u{1F4B0}' },
  { id: 'learning-growth', labelEn: 'Learning & Growth', labelJa: '学び・成長', icon: '\u{1F4DA}' },
  { id: 'health-wellbeing', labelEn: 'Health & Wellbeing', labelJa: '健康・心', icon: '\u{1F33F}' },
  {
    id: 'paperwork-rights',
    labelEn: 'Paperwork & Rights',
    labelJa: '書類・権利',
    icon: '\u{1F4C4}',
  },
  {
    id: 'communication',
    labelEn: 'Communication & Relationships',
    labelJa: '連絡・人間関係',
    icon: '\u{1F4AC}',
  },
  { id: 'home-daily', labelEn: 'Home & Daily Life', labelJa: '家・暮らし', icon: '\u{1F3E0}' },
  { id: 'creative-fun', labelEn: 'Creative & Fun', labelJa: '創作・遊び', icon: '\u{1F3A8}' },
  { id: 'builder-dev', labelEn: 'Builder & Dev', labelJa: '開発者向け', icon: '\u{1F6E0}' },
  {
    id: 'crisis-hard-times',
    labelEn: 'Crisis & Hard Times',
    labelJa: '困難なとき',
    icon: '\u{1F917}',
  },
];

/**
 * Backward compatibility for old `?cat=` query params.
 * Old URLs keep working — they silently redirect to the new category id.
 */
const LEGACY_CATEGORY_ALIASES: Record<string, string> = {
  'career-money': 'career-work',
  health: 'health-wellbeing',
  grounding: 'health-wellbeing',
  paperwork: 'paperwork-rights',
  relationships: 'communication',
  daily: 'home-daily',
  home: 'home-daily',
  creative: 'creative-fun',
  dev: 'builder-dev',
  builder: 'builder-dev',
  crisis: 'crisis-hard-times',
  hardship: 'crisis-hard-times',
};

function resolveCategoryId(input: string | null | undefined): string | null {
  if (!input) return null;
  if (PROMPT_CATEGORIES.some((c) => c.id === input)) return input;
  return LEGACY_CATEGORY_ALIASES[input] ?? null;
}

// Map prompt IDs to categories
const PROMPT_CATEGORY_MAP: Record<string, string> = {
  // Career & Work (6)
  'job-gaps-as-strengths': 'career-work',
  'star-stories-caregiving': 'career-work',
  'salary-negotiation-scripts': 'career-work',
  'resignation-letter': 'career-work',
  'performance-review-self-eval': 'career-work',
  'freelancer-client-comms': 'career-work',
  // Money & Finance (6)
  'debt-hardship-scripts': 'money-finance',
  'budget-zero-budget-builder': 'money-finance',
  'rent-hardship-letter': 'money-finance',
  'subscription-cancel-script': 'money-finance',
  'tax-prep-checklist': 'money-finance',
  'invoice-collection-email': 'money-finance',
  // Learning & Growth (5)
  'zero-budget-learning': 'learning-growth',
  'book-notes-that-stick': 'learning-growth',
  'teach-it-back-explainer': 'learning-growth',
  'career-skill-roadmap': 'learning-growth',
  'conference-talk-abstract': 'learning-growth',
  // Health & Wellbeing (5)
  'grounding-low-energy': 'health-wellbeing',
  'doctor-visit-prep': 'health-wellbeing',
  'therapy-first-session-brief': 'health-wellbeing',
  'sleep-reset-tonight': 'health-wellbeing',
  'panic-anchor-script': 'health-wellbeing',
  // Paperwork & Rights (5)
  'bureaucracy-letters': 'paperwork-rights',
  'form-decoder': 'paperwork-rights',
  'insurance-claim-letter': 'paperwork-rights',
  'lease-renewal-negotiation': 'paperwork-rights',
  'small-claims-complaint': 'paperwork-rights',
  // Communication & Relationships (6)
  'en-ja-cultural-bridge': 'communication',
  'difficult-conversation-script': 'communication',
  'apology-that-means-it': 'communication',
  'feedback-sandwich-free': 'communication',
  'school-email-parent': 'communication',
  'thank-you-note-real': 'communication',
  // Home & Daily Life (5)
  'weekly-meal-plan-budget': 'home-daily',
  'declutter-one-room': 'home-daily',
  'repair-decide-call-fix': 'home-daily',
  'moving-checklist-zero-fluff': 'home-daily',
  'pet-vet-visit-prep': 'home-daily',
  // Creative & Fun (5)
  'weekend-trip-plan': 'creative-fun',
  'gift-idea-by-person': 'creative-fun',
  'short-story-from-prompt': 'creative-fun',
  'song-lyrics-from-mood': 'creative-fun',
  'birthday-card-real': 'creative-fun',
  // Builder & Dev (5)
  'code-review-polite-firm': 'builder-dev',
  'bug-report-that-gets-fixed': 'builder-dev',
  'readme-from-working-code': 'builder-dev',
  'commit-message-history': 'builder-dev',
  'tech-decision-record': 'builder-dev',
  // Crisis & Hard Times (4)
  'grief-first-week': 'crisis-hard-times',
  'job-loss-first-72h': 'crisis-hard-times',
  'eviction-response-letter': 'crisis-hard-times',
  'breakup-no-contact-script': 'crisis-hard-times',
};

function getPromptsForCategory(categoryId: string, allPrompts: PromptTemplate[]): PromptTemplate[] {
  if (categoryId === 'all') {
    return allPrompts;
  }
  return allPrompts.filter((pt) => PROMPT_CATEGORY_MAP[pt.id] === categoryId);
}

function getCategoryCounts(allPrompts: PromptTemplate[]): Record<string, number> {
  const counts: Record<string, number> = { all: allPrompts.length };
  for (const pt of allPrompts) {
    const cat = PROMPT_CATEGORY_MAP[pt.id] || 'all';
    counts[cat] = (counts[cat] || 0) + 1;
  }
  return counts;
}

// ─── State ─────────────────────────────────────────────────────────────────────

interface PromptTemplatesViewState {
  selectedCategory: string;
  selectedPromptId: string | null;
  prompts: PromptTemplate[];
  lib: PromptTemplatesLibrary;
  valuesByTemplate: Record<string, Record<string, string>>;
  lang: Locale;
  container: HTMLElement;
  keyboardCleanup: (() => void) | null;
  languageCleanup: (() => void) | null;
  accordionCleanup: (() => void) | null;
  focusCleanup: (() => void) | null;
  layoutHeightCleanup: (() => void) | null;
}

interface PromptTemplatesContainer extends HTMLElement {
  __ptCleanup?: () => void;
}

interface PromptAccordionResult {
  accordion: HTMLElement;
  focusCleanup: () => void;
}

function getCategoryLabel(catId: string, lang: Locale): string {
  const cat = PROMPT_CATEGORIES.find((c) => c.id === catId);
  if (!cat) return catId;
  return lang === 'ja' ? cat.labelJa : cat.labelEn;
}

function buildPromptSuggestions(state: PromptTemplatesViewState): FilterSuggestion[] {
  const raw = getRawSuggestionsForSection('prompts', 8);
  const validCategories = new Set(PROMPT_CATEGORIES.map((c) => c.id).filter((id) => id !== 'all'));
  const out: FilterSuggestion[] = [];
  for (const { values, analyticsKey } of raw) {
    if (!values.cat || !validCategories.has(values.cat)) continue;
    const count = getPromptsForCategory(values.cat, state.prompts).length;
    if (count === 0) continue;
    out.push({
      label: getCategoryLabel(values.cat, state.lang),
      values,
      analyticsKey,
    });
    if (out.length >= 3) break;
  }
  return out;
}

function selectPromptCategory(state: PromptTemplatesViewState, catId: string): void {
  const prev = state.selectedCategory;
  state.selectedCategory = catId;
  const count = getPromptsForCategory(catId, state.prompts).length;
  if (catId === 'all') {
    trackFilterEvent({
      action: 'remove',
      filterType: 'category',
      filterValue: `cat:${prev}`,
      resultCount: count,
    });
  } else {
    trackFilterEvent({
      action: 'apply',
      filterType: 'category',
      filterValue: `cat:${catId}`,
      resultCount: count,
    });
  }
  reRenderHorizontal(state);
}

// ─── SessionStorage Helpers ──────────────────────────────────────────────────────

function getSavedValues(templateId: string, lang: Locale): Record<string, string> {
  try {
    const raw = sessionStorage.getItem(STORAGE_PREFIX + templateId + '-' + lang);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore parse errors
  }
  return {};
}

function saveValues(templateId: string, lang: Locale, values: Record<string, string>): void {
  try {
    sessionStorage.setItem(STORAGE_PREFIX + templateId + '-' + lang, JSON.stringify(values));
    onPromptFormInput(lang, values);
  } catch {
    // ignore storage errors
  }
}

// ─── Prompt Variable Extraction ───────────────────────────────────────────────

function extractTemplateVariables(template: string): string[] {
  if (!template || typeof template !== 'string') return [];
  const matches = template.match(/\{\{([a-zA-Z0-9_]+)\}\}/g) || [];
  const vars = matches.map((m) => m.slice(2, -2));
  return [...new Set(vars)].sort();
}

// ─── Main Render Function ─────────────────────────────────────────────────────

/**
 * Render the curated recommended-chats chip strip into the static "how to use" card
 * (which lives in index.html, above the prompt-templates-root).
 * Renders nothing if the container is missing or the curated tools have been removed
 * from the data — the card gracefully degrades to "no chips".
 */
function renderRecommendedChatChips(lang: Locale): void {
  const container = document.getElementById('prompt-templates-chips');
  if (!container) return;

  // Resolve the curated set against the live data, preserving the curated order.
  const byId = new Map(zeroKeyTools.filter((t) => t.category === 'ai-chat').map((t) => [t.id, t]));
  const ordered = RECOMMENDED_CHAT_IDS.map((id) => byId.get(id)).filter(
    (t): t is NonNullable<typeof t> => Boolean(t)
  );

  container.innerHTML = '';
  container.setAttribute('aria-label', t(lang, 'promptTemplates.howTo.chipsLabel'));
  container.setAttribute('role', 'list');

  for (const tool of ordered) {
    const chip = document.createElement('a');
    chip.href = `#ai-tools?q=${encodeURIComponent(tool.name)}`;
    chip.className =
      'zk2-card-surface zk2-surface-web inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm hover:bg-white/10 transition-colors';
    chip.setAttribute('role', 'listitem');
    chip.setAttribute(
      'aria-label',
      lang === 'ja'
        ? `${tool.name} — おすすめ無料AIチャット`
        : `${tool.name} — recommended free AI chat`
    );
    chip.textContent = tool.name;
    container.appendChild(chip);
  }
}

export function renderPromptTemplatesStandalone(options: {
  container: HTMLElement;
  lang: Locale;
}): void {
  const { container, lang } = options;

  try {
    const lib = new PromptTemplatesLibrary(lang);
    const prompts = lib.getAll();
    const state: PromptTemplatesViewState = {
      selectedCategory: 'all',
      selectedPromptId: null,
      prompts,
      lib,
      valuesByTemplate: {},
      lang,
      container,
      keyboardCleanup: null,
      languageCleanup: null,
      accordionCleanup: null,
      focusCleanup: null,
      layoutHeightCleanup: null,
    };

    const fromUrl = getSectionParams('prompts');
    const resolvedCat = resolveCategoryId(fromUrl.cat);
    if (resolvedCat && resolvedCat !== 'all') {
      state.selectedCategory = resolvedCat;
    }

    // Initialize saved values for all prompts
    for (const pt of prompts) {
      state.valuesByTemplate[pt.id] = getSavedValues(pt.id, lang);
    }

    const typedContainer = container as PromptTemplatesContainer;
    typedContainer.__ptCleanup?.();

    container.innerHTML = '';
    container.className = 'pt-horizontal-shell';

    // Render the recommended-chats chip strip into the static "how to use" card
    renderRecommendedChatChips(lang);

    // Render the horizontal layout
    renderHorizontalLayout(state);

    // Listen for language changes
    listenForLanguageChanges(state);
  } catch (error) {
    console.error('Failed to render prompt templates:', error);
    container.innerHTML = `
      <div class="text-center py-12 text-white/60">
        <div class="inline-block px-6 py-3 rounded-xl glass-card">
          <p class="text-sm">⚠️ Unable to load prompt templates</p>
        </div>
      </div>
    `;
  }
}

// ─── Horizontal Layout ────────────────────────────────────────────────────────

function renderHorizontalLayout(state: PromptTemplatesViewState): void {
  // Create zk2-layout wrapper (same as tools directories)
  const layout = document.createElement('div');
  layout.className = 'zk2-layout';
  state.container.appendChild(layout);

  layout.appendChild(
    createSidebarColumn({
      sidebar: createSidebar(state),
      toolbar: createFilterToolbar(state),
      heading: t(state.lang, 'filters.panelHeading'),
      headingId: 'pt-filters',
      ariaLabel: t(state.lang, 'filters.panelLabel'),
      categoriesHeading: t(state.lang, 'filters.categoriesHeading'),
      categoriesHeadingId: 'pt-categories',
    })
  );

  // Content area with grid
  const content = document.createElement('div');
  content.className = 'zk2-horizontal-content';
  layout.appendChild(content);

  // Stats bar
  const filteredPrompts = getPromptsForCategory(state.selectedCategory, state.prompts);
  const statsBar = createPanelStatsBar(
    'zk2-stats-bar',
    t(state.lang, 'prompts.showing').replace('{count}', String(filteredPrompts.length))
  );

  mountPanelContent(content, statsBar, (scroll) => {
    scroll.appendChild(createPromptGridContainer(state));
  });

  state.layoutHeightCleanup?.();
  state.layoutHeightCleanup = bindZk2LayoutHeightSync(layout);
  syncZk2LayoutHeight(layout);
}

function createSidebar(state: PromptTemplatesViewState): HTMLElement {
  const sidebar = document.createElement('div');
  sidebar.className = 'zk2-sidebar';

  const counts = getCategoryCounts(state.prompts);
  const categories = PROMPT_CATEGORIES;

  for (const cat of categories) {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = `zk2-cat-item${state.selectedCategory === cat.id ? ' active' : ''}`;
    item.dataset.category = cat.id;

    const icon = document.createElement('span');
    icon.className = 'zk2-cat-icon';
    icon.textContent = cat.icon;

    const label = document.createElement('span');
    label.className = 'zk2-cat-label';
    label.textContent = state.lang === 'ja' ? cat.labelJa : cat.labelEn;

    const count = document.createElement('span');
    count.className = 'zk2-cat-count';
    count.textContent = `(${counts[cat.id] || 0})`;

    item.append(icon, label, count);
    const labelText = state.lang === 'ja' ? cat.labelJa : cat.labelEn;
    item.setAttribute(
      'aria-label',
      state.lang === 'ja' ? `${labelText}でフィルター` : `Filter by ${labelText}`
    );
    item.addEventListener('click', () => {
      selectPromptCategory(state, cat.id);
    });
    sidebar.appendChild(item);
  }

  return sidebar;
}

function createFilterToolbar(state: PromptTemplatesViewState): HTMLElement {
  const validCategories = new Set(PROMPT_CATEGORIES.map((c) => c.id).filter((id) => id !== 'all'));
  validCategories.add('all');

  return renderFilterToolbar({
    section: 'prompts',
    lang: state.lang,
    getValues: () => ({
      cat: state.selectedCategory !== 'all' ? state.selectedCategory : null,
    }),
    onApply: (values) => {
      applyPromptsFilterValues(state, values, validCategories);
      reRenderHorizontal(state);
    },
    suggestions: buildPromptSuggestions(state),
  });
}

function createPromptGridContainer(state: PromptTemplatesViewState): HTMLElement {
  const grid = document.createElement('div');
  grid.className = 'zk2-grid';

  const filteredPrompts = getPromptsForCategory(state.selectedCategory, state.prompts);

  appendChildrenBatched(grid, filteredPrompts, (pt) => createHorizontalPromptCard(state, pt));

  return grid;
}

function createHorizontalPromptCard(
  state: PromptTemplatesViewState,
  pt: PromptTemplate
): HTMLElement {
  const card = document.createElement('article');
  card.className = 'tool-card-horizontal';
  card.dataset.promptId = pt.id;
  card.tabIndex = 0;
  card.role = 'button';
  card.setAttribute('aria-expanded', 'false');
  card.setAttribute(
    'aria-label',
    state.lang === 'ja' ? `${pt.title}のテンプレートを開く` : `Open ${pt.title} template`
  );

  // Header: icon + category badge (same structure as tool cards)
  const header = document.createElement('div');
  header.className = 'zk2-card-header';
  const icon = document.createElement('span');
  icon.className = 'zk2-card-icon';
  const cat = PROMPT_CATEGORY_MAP[pt.id] || 'all';
  const catData = PROMPT_CATEGORIES.find((c) => c.id === cat);
  icon.textContent = catData?.icon || '\u{1F4AC}';
  header.appendChild(icon);

  // Category badge
  const catBadge = document.createElement('span');
  catBadge.className = 'zk2-card-surface zk2-surface-web';
  catBadge.textContent = (
    catData ? (state.lang === 'ja' ? catData.labelJa : catData.labelEn) : ''
  ).toUpperCase();
  header.appendChild(catBadge);

  card.appendChild(header);

  // Access type badge - prompt templates are always browser-based
  const accessBadges = document.createElement('div');
  accessBadges.className = 'zk2-card-access-badges';
  const typeBadge = document.createElement('span');
  typeBadge.className = 'zk2-access-badge zk2-access-ai';
  typeBadge.textContent = state.lang === 'ja' ? '🤖 AI' : '🤖 AI';
  accessBadges.appendChild(typeBadge);
  card.appendChild(accessBadges);

  // Title
  const title = document.createElement('h3');
  title.className = 'zk2-card-name';
  title.textContent = pt.title;
  card.appendChild(title);

  // Description
  const desc = document.createElement('p');
  desc.className = 'zk2-card-desc';
  desc.textContent = pt.description;
  card.appendChild(desc);

  // Footer with actions
  const footer = document.createElement('div');
  footer.className = 'zk2-card-footer';

  const fillBtn = document.createElement('button');
  fillBtn.type = 'button';
  fillBtn.className = 'zk2-card-cta';
  fillBtn.textContent = state.lang === 'ja' ? '入力してコピー →' : 'Fill & Copy →';
  fillBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openPromptAccordion(state, pt, card);
  });
  footer.appendChild(fillBtn);

  card.appendChild(footer);

  // Click on card opens accordion
  card.addEventListener('click', () => {
    openPromptAccordion(state, pt, card);
  });

  // Keyboard access
  card.addEventListener('keydown', (e) => {
    if (e.target !== card) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openPromptAccordion(state, pt, card);
    }
  });

  return card;
}

// ─── Accordion State ────────────────────────────────────────────────────────────

// Track the element that opened the accordion for focus restoration
let lastFocusedElement: HTMLElement | null = null;
// Track currently open accordion to close it when another opens
let openAccordion: { card: HTMLElement; accordion: HTMLElement; focusCleanup?: () => void } | null =
  null;

function closeAccordion(
  card: HTMLElement,
  accordion: HTMLElement,
  focusCleanup?: () => void
): void {
  accordion.remove();
  card.setAttribute('aria-expanded', 'false');
  card.classList.remove('expanded');
  openAccordion = null;

  // Clean up focus trap to prevent memory leak
  focusCleanup?.();

  // Restore focus to the triggering card
  if (lastFocusedElement && document.contains(lastFocusedElement)) {
    lastFocusedElement.focus();
  }
  lastFocusedElement = null;
}

function escapeHandler(e: KeyboardEvent): void {
  if (e.key === 'Escape' && openAccordion) {
    e.preventDefault();
    closeAccordion(openAccordion.card, openAccordion.accordion, openAccordion.focusCleanup);
  }
}

function trapFocus(element: HTMLElement): () => void {
  const focusable = element.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  const handleTab = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last?.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    }
  };

  element.addEventListener('keydown', handleTab);
  return () => element.removeEventListener('keydown', handleTab);
}

function createPromptAccordion(
  state: PromptTemplatesViewState,
  pt: PromptTemplate,
  card: HTMLElement
): PromptAccordionResult {
  const accordion = document.createElement('div');
  accordion.className = 'prompt-accordion';
  accordion.setAttribute('role', 'region');
  accordion.setAttribute(
    'aria-label',
    state.lang === 'ja' ? `${pt.title}の入力フォーム` : `${pt.title} form`
  );

  // Header with title and close button
  const header = document.createElement('div');
  header.className = 'prompt-accordion-header';

  const title = document.createElement('h3');
  title.className = 'prompt-accordion-title';
  title.textContent = pt.title;
  header.appendChild(title);

  const closeBtn = createCloseButton({
    className: 'prompt-accordion-close',
    label: state.lang === 'ja' ? '閉じる' : 'Close',
    onClick: () => {
      closeAccordion(card, accordion, focusCleanup);
    },
  });
  header.appendChild(closeBtn);
  accordion.appendChild(header);

  // Content area with two-column layout
  const content = document.createElement('div');
  content.className = 'prompt-accordion-content';
  accordion.appendChild(content);

  // Form fields (left column)
  const variables = extractTemplateVariables(pt.template);

  if (variables.length > 0) {
    const formColumn = document.createElement('div');
    formColumn.className = 'sp-inline-form';

    const formTitle = document.createElement('div');
    formTitle.className = 'sp-inline-form-title';
    formTitle.textContent = state.lang === 'ja' ? `「${pt.title}」を入力` : `Fill: ${pt.title}`;
    formColumn.appendChild(formTitle);

    const form = document.createElement('form');
    form.className = 'sp-inline-form-fields';

    const formFields: Record<string, HTMLInputElement | HTMLTextAreaElement> = {};

    for (const varName of variables) {
      const field = document.createElement('div');
      field.className = 'sp-form-field';

      const label = document.createElement('label');
      label.textContent = varName.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
      field.appendChild(label);

      // Heuristic: which variable names are long-form text that should render as
      // a <textarea rows="2"> instead of a single-line <input>.
      // List the unique SHORT substrings. Longer names (e.g. "symptomTimeline",
      // "noticeText", "breakupMessage", "griefFirstWeekTasks") match because
      // we use `.includes()`.
      const LONG_VAR_SUBSTRINGS = [
        'situation',
        'description',
        'story',
        'content',
        'letter',
        'message',
        'notice',
        'plan',
        'checklist',
        'reasoning',
        'context',
        'background',
        'notes',
        'feedback',
        'comment',
        'review',
        'abstract',
        'symptom',
        'route',
        'roadmap',
        'tasks',
        'breakup',
        'grief',
      ] as const;
      const isLong = LONG_VAR_SUBSTRINGS.some((sub) => varName.toLowerCase().includes(sub));

      let input: HTMLInputElement | HTMLTextAreaElement;
      if (isLong) {
        input = document.createElement('textarea');
        (input as HTMLTextAreaElement).rows = 2;
      } else {
        input = document.createElement('input');
        input.type = 'text';
      }
      input.name = varName;
      input.required = false;
      input.className = 'sp-form-input';

      // Restore saved value
      if (state.valuesByTemplate[pt.id]?.[varName]) {
        input.value = state.valuesByTemplate[pt.id][varName];
      }

      // Auto-save on input
      input.addEventListener('input', () => {
        state.valuesByTemplate[pt.id] = state.valuesByTemplate[pt.id] || {};
        state.valuesByTemplate[pt.id][varName] = input.value;
        saveValues(pt.id, state.lang, state.valuesByTemplate[pt.id]);
      });

      field.appendChild(input);
      formFields[varName] = input;
      form.appendChild(field);
    }

    formColumn.appendChild(form);

    // Preview area (below form in left column)
    const previewArea = document.createElement('div');
    previewArea.className = 'sp-preview-area';
    previewArea.style.display = 'none';
    formColumn.appendChild(previewArea);
    content.appendChild(formColumn);

    // Actions column (right side)
    const actionsColumn = document.createElement('div');
    actionsColumn.className = 'sp-inline-actions';

    const previewBtn = document.createElement('button');
    previewBtn.type = 'button';
    previewBtn.className = 'sp-btn sp-btn-ghost';
    previewBtn.textContent = state.lang === 'ja' ? 'プレビュー' : 'Preview';
    previewBtn.addEventListener('click', () => {
      const values: Record<string, string> = {};
      for (const [key, input] of Object.entries(formFields)) {
        values[key] = input.value || `[${key}]`;
      }
      const filled = state.lib.fill(pt.id, values);
      previewArea.textContent = filled;
      previewArea.style.display = 'block';
      previewArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
    actionsColumn.appendChild(previewBtn);

    const copyFilledBtn = document.createElement('button');
    copyFilledBtn.type = 'button';
    copyFilledBtn.className = 'sp-btn sp-btn-primary';
    copyFilledBtn.textContent = state.lang === 'ja' ? 'コピー' : 'Copy Filled';
    copyFilledBtn.addEventListener('click', async () => {
      const values: Record<string, string> = {};
      for (const [key, input] of Object.entries(formFields)) {
        values[key] = input.value || `[${key}]`;
      }
      const filled = state.lib.fill(pt.id, values);

      try {
        await navigator.clipboard.writeText(filled);
        const originalText = copyFilledBtn.textContent;
        copyFilledBtn.textContent = state.lang === 'ja' ? '✓ コピーしました' : '✓ Copied!';
        showToast(state.lang === 'ja' ? 'コピーしました！' : 'Copied to clipboard!');
        setTimeout(() => {
          copyFilledBtn.textContent = originalText;
        }, 2000);
      } catch (error) {
        console.error('Failed to copy:', error);
        showToast(state.lang === 'ja' ? 'コピーに失敗しました' : 'Failed to copy to clipboard');
      }
    });
    actionsColumn.appendChild(copyFilledBtn);

    content.appendChild(actionsColumn);

    // Focus first input
    const firstInput = form.querySelector('input, textarea') as HTMLElement | null;
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  } else {
    // No form fields - just show copy button
    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'sp-btn sp-btn-primary';
    copyBtn.textContent = state.lang === 'ja' ? 'コピー' : 'Copy Template';
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(pt.template);
        const originalText = copyBtn.textContent;
        copyBtn.textContent = state.lang === 'ja' ? '✓ コピーしました' : '✓ Copied!';
        showToast(state.lang === 'ja' ? 'コピーしました！' : 'Copied to clipboard!');
        setTimeout(() => {
          copyBtn.textContent = originalText;
        }, 2000);
      } catch (error) {
        console.error('Failed to copy:', error);
        showToast(state.lang === 'ja' ? 'コピーに失敗しました' : 'Failed to copy to clipboard');
      }
    });
    accordion.appendChild(copyBtn);
  }

  // Attach focus trap to accordion and store cleanup function
  const focusCleanup = trapFocus(accordion);

  // Return both accordion and focusCleanup for proper memory management
  return { accordion, focusCleanup };
}

function openPromptAccordion(
  state: PromptTemplatesViewState,
  pt: PromptTemplate,
  card: HTMLElement
): void {
  // Close any existing accordion first
  if (openAccordion && openAccordion.card !== card) {
    closeAccordion(openAccordion.card, openAccordion.accordion, openAccordion.focusCleanup);
  }

  // If clicking the same card that's already open, close it
  if (openAccordion && openAccordion.card === card) {
    const accordion = document.querySelector('.prompt-accordion') as HTMLElement;
    if (accordion) {
      closeAccordion(card, accordion, openAccordion.focusCleanup);
    }
    return;
  }

  // Store the triggering element for focus restoration
  lastFocusedElement = document.activeElement as HTMLElement;

  const { accordion, focusCleanup } = createPromptAccordion(state, pt, card);

  // Find the content area and append accordion at the end (under the grid)
  const contentArea = state.container.querySelector('.zk2-horizontal-content') as HTMLElement;
  if (contentArea) {
    contentArea.appendChild(accordion);
  } else {
    // Fallback: insert after card if content area not found
    card.parentNode!.insertBefore(accordion, card.nextSibling);
  }

  // Set up Escape handler
  document.removeEventListener('keydown', escapeHandler);
  document.addEventListener('keydown', escapeHandler);

  // Store reference with focusCleanup for proper cleanup
  openAccordion = { card, accordion, focusCleanup };
  card.setAttribute('aria-expanded', 'true');
  card.classList.add('expanded');

  // Scroll to accordion
  accordion.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function closePromptAccordion(): void {
  // Clean up focus trap if any accordion is open
  if (openAccordion?.focusCleanup) {
    openAccordion.focusCleanup();
  }

  // Close any open accordion
  const accordions = document.querySelectorAll('.prompt-accordion');
  accordions.forEach((accordion) => {
    accordion.remove();
  });

  // Remove expanded state from all cards
  const cards = document.querySelectorAll('.tool-card-horizontal');
  cards.forEach((card) => {
    card.setAttribute('aria-expanded', 'false');
    card.classList.remove('expanded');
  });

  openAccordion = null;
  lastFocusedElement = null;
  document.removeEventListener('keydown', escapeHandler);
}

function cleanupKeyboardShortcut(state: PromptTemplatesViewState): void {
  state.keyboardCleanup?.();
  state.keyboardCleanup = null;
}

function cleanupLanguageListener(state: PromptTemplatesViewState): void {
  state.languageCleanup?.();
  state.languageCleanup = null;
}

function reRenderHorizontal(state: PromptTemplatesViewState): void {
  const container = state.container;
  if (!container) return;

  state.layoutHeightCleanup?.();
  state.layoutHeightCleanup = null;

  // Clear and re-render
  container.innerHTML = '';
  renderHorizontalLayout(state);
}

// ─── Language Change Listener ─────────────────────────────────────────────────

function listenForLanguageChanges(state: PromptTemplatesViewState): void {
  cleanupLanguageListener(state);

  const handler = (e: Event) => {
    const nextLang = (e as CustomEvent).detail?.lang || getCurrentLang();
    state.lang = nextLang;
    state.lib.setLocale(nextLang);
    state.prompts = state.lib.getAll();

    // Re-initialize saved values with new language
    for (const pt of state.prompts) {
      state.valuesByTemplate[pt.id] = getSavedValues(pt.id, nextLang);
    }

    // The "how to use" card body is data-i18n-driven and is re-translated by the
    // global i18n flow. Only the chip strip's aria-label and chip names are
    // JS-rendered, so we re-render them here.
    renderRecommendedChatChips(nextLang);

    reRenderHorizontal(state);
  };

  window.addEventListener('banal:language-changed', handler);
  state.languageCleanup = () => window.removeEventListener('banal:language-changed', handler);
  (state.container as PromptTemplatesContainer).__ptCleanup = () => {
    state.layoutHeightCleanup?.();
    state.layoutHeightCleanup = null;
    cleanupLanguageListener(state);
    cleanupKeyboardShortcut(state);
    closePromptAccordion();
  };
}

function getCurrentLang(): Locale {
  const htmlLang = document.documentElement.lang;
  return htmlLang?.startsWith('ja') ? 'ja' : 'en';
}

// ─── Toast Notification ───────────────────────────────────────────────────────

function showToast(message: string): void {
  // Remove existing toast
  const existing = document.querySelector('.pt-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'pt-toast';
  toast.textContent = message;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('pt-toast-visible');
  });

  setTimeout(() => {
    toast.classList.remove('pt-toast-visible');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
