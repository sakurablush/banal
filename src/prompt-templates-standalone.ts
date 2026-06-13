/**
 * Standalone Prompt Templates UI — Horizontal Scroller Redesign
 *
 * Renders 9 prompt templates in a horizontal scroll layout (Android app drawer style):
 * - All templates visible in a horizontal scroll container
 * - Clicking a card opens the form in an overlay modal
 * - Keyboard navigation with ← → arrows
 * - Quick filter chips for categories
 *
 * Features preserved from original:
 * - Auto-save to localStorage per template
 * - Keyboard shortcuts: Ctrl/Cmd+Enter to copy, Esc to close form
 * - Toast notification on copy
 * - Preview mode
 */

import { PromptTemplatesLibrary, type Locale, type PromptTemplate } from './lib/prompt-templates';

const STORAGE_PREFIX = 'banal-pt-';

// ─── Category Taxonomy ──────────────────────────────────────────────────────────

interface PromptCategory {
  id: string;
  labelEn: string;
  labelJa: string;
  icon: string;
}

const PROMPT_CATEGORIES: PromptCategory[] = [
  { id: 'all', labelEn: 'All', labelJa: 'すべて', icon: '' },
  { id: 'career-money', labelEn: 'Career & Money', labelJa: '仕事・お金', icon: '\u{1F4B0}' },
  { id: 'learning-growth', labelEn: 'Learning', labelJa: '学び', icon: '\u{1F393}' },
  { id: 'health-grounding', labelEn: 'Grounding', labelJa: 'グラウンディング', icon: '\u{1F914}' },
  { id: 'paperwork-rights', labelEn: 'Paperwork', labelJa: '手続き', icon: '\u{1F4DC}' },
  { id: 'communication', labelEn: 'Communication', labelJa: 'コミュニケーション', icon: '\u{1F4AC}' },
];

// Map prompt IDs to categories
const PROMPT_CATEGORY_MAP: Record<string, string> = {
  'job-gaps-as-strengths': 'career-money',
  'micro-hustles': 'career-money',
  'star-stories-caregiving': 'career-money',
  'debt-hardship-scripts': 'career-money',
  'zero-budget-learning': 'learning-growth',
  'grounding-low-energy': 'health-grounding',
  'bureaucracy-letters': 'paperwork-rights',
  'form-decoder': 'paperwork-rights',
  'en-ja-cultural-bridge': 'communication',
};

function getPromptsForCategory(
  categoryId: string,
  allPrompts: PromptTemplate[]
): PromptTemplate[] {
  if (categoryId === 'all') {
    return allPrompts;
  }
  return allPrompts.filter((pt) => PROMPT_CATEGORY_MAP[pt.id] === categoryId);
}

function getCategoryCounts(
  allPrompts: PromptTemplate[]
): Record<string, number> {
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
  modalCleanup: (() => void) | null;
}

interface PromptTemplatesContainer extends HTMLElement {
  __ptCleanup?: () => void;
}

// ─── LocalStorage Helpers ──────────────────────────────────────────────────────

function getSavedValues(templateId: string, lang: Locale): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + templateId + '-' + lang);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore parse errors
  }
  return {};
}

function saveValues(templateId: string, lang: Locale, values: Record<string, string>): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + templateId + '-' + lang, JSON.stringify(values));
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
      modalCleanup: null,
    };

    // Initialize saved values for all prompts
    for (const pt of prompts) {
      state.valuesByTemplate[pt.id] = getSavedValues(pt.id, lang);
    }

    const typedContainer = container as PromptTemplatesContainer;
    typedContainer.__ptCleanup?.();

    container.innerHTML = '';
    container.className = 'pt-horizontal-shell';

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
  // Quick filters row
  const filtersRow = createQuickFilters(state);
  state.container.appendChild(filtersRow);

  // Horizontal scroll container for prompt cards
  const scrollContainer = createPromptScrollContainer(state);
  state.container.appendChild(scrollContainer);
}

function createQuickFilters(state: PromptTemplatesViewState): HTMLElement {
  const row = document.createElement('div');
  row.className = 'quick-filters-row';

  const counts = getCategoryCounts(state.prompts);
  const filters = PROMPT_CATEGORIES;

  for (const cat of filters) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = `quick-filter-chip${state.selectedCategory === cat.id ? ' active' : ''}`;
    chip.dataset.category = cat.id;
    const label = state.lang === 'ja' ? cat.labelJa : cat.labelEn;
    const count = counts[cat.id] || 0;
    chip.innerHTML = `<span class="filter-icon">${cat.icon}</span> <span class="filter-label">${label}</span> <span class="filter-count">(${count})</span>`;
    chip.addEventListener('click', () => {
      state.selectedCategory = cat.id;
      reRenderHorizontal(state);
    });
    row.appendChild(chip);
  }

  return row;
}

function createPromptScrollContainer(state: PromptTemplatesViewState): HTMLElement {
  const scroll = document.createElement('div');
  scroll.className = 'prompts-horizontal-scroll';

  const filteredPrompts = getPromptsForCategory(state.selectedCategory, state.prompts);

  for (const pt of filteredPrompts) {
    const card = createHorizontalPromptCard(state, pt);
    scroll.appendChild(card);
  }

  return scroll;
}

function createHorizontalPromptCard(state: PromptTemplatesViewState, pt: PromptTemplate): HTMLElement {
  const card = document.createElement('article');
  card.className = 'prompt-card-horizontal';
  card.dataset.promptId = pt.id;
  card.tabIndex = 0;
  card.role = 'button';
  card.setAttribute(
    'aria-label',
    state.lang === 'ja' ? `${pt.title}のテンプレートを開く` : `Open ${pt.title} template`
  );

  // Category icon badge
  const cat = PROMPT_CATEGORY_MAP[pt.id] || 'all';
  const catData = PROMPT_CATEGORIES.find((c) => c.id === cat);
  const iconBadge = document.createElement('div');
  iconBadge.className = 'prompt-card-icon';
  iconBadge.textContent = catData?.icon || '\u{1F4AC}';
  card.appendChild(iconBadge);

  // Category label
  const categoryLabel = document.createElement('div');
  categoryLabel.className = 'pt-prompt-category';
  categoryLabel.textContent = catData ? (state.lang === 'ja' ? catData.labelJa : catData.labelEn) : '';
  card.appendChild(categoryLabel);

  // Title
  const title = document.createElement('h3');
  title.className = 'pt-prompt-title';
  title.textContent = pt.title;
  card.appendChild(title);

  // Description
  const desc = document.createElement('p');
  desc.className = 'pt-prompt-desc';
  desc.textContent = pt.description;
  card.appendChild(desc);

  // Actions
  const actions = document.createElement('div');
  actions.className = 'prompt-card-actions';

  const fillBtn = document.createElement('button');
  fillBtn.type = 'button';
  fillBtn.className = 'sp-btn sp-btn-secondary';
  fillBtn.textContent = state.lang === 'ja' ? '入力してコピー' : 'Fill & Copy';
  fillBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openPromptModal(state, pt);
  });
  actions.appendChild(fillBtn);

  card.appendChild(actions);

  // Click on card opens modal
  card.addEventListener('click', () => {
    openPromptModal(state, pt);
  });

  // Keyboard access
  card.addEventListener('keydown', (e) => {
    if (e.target !== card) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openPromptModal(state, pt);
    }
  });

  return card;
}

// ─── Modal Overlay ────────────────────────────────────────────────────────────

function openPromptModal(state: PromptTemplatesViewState, pt: PromptTemplate): void {
  // Close any existing modal
  closePromptModal(state);

  const overlay = document.createElement('div');
  overlay.className = 'pt-modal-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');

  const modalContent = document.createElement('div');
  modalContent.className = 'pt-modal-content';

  // Header
  const header = document.createElement('div');
  header.className = 'pt-window-header';

  const title = document.createElement('h3');
  title.className = 'pt-window-title';
  title.textContent = pt.title;
  header.appendChild(title);

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'sp-modal-close';
  closeBtn.innerHTML = '&times;';
  closeBtn.title = state.lang === 'ja' ? '閉じる' : 'Close';
  closeBtn.setAttribute('aria-label', state.lang === 'ja' ? '閉じる' : 'Close');
  closeBtn.addEventListener('click', () => {
    closePromptModal(state);
  });
  header.appendChild(closeBtn);
  modalContent.appendChild(header);

  // Description
  const desc = document.createElement('p');
  desc.className = 'pt-window-desc';
  desc.textContent = pt.description;
  modalContent.appendChild(desc);

  // Form fields
  const variables = extractTemplateVariables(pt.template);
  if (variables.length > 0) {
    const formWrap = document.createElement('div');
    formWrap.className = 'sp-inline-form';

    const formTitle = document.createElement('div');
    formTitle.className = 'sp-inline-form-title';
    formTitle.textContent = state.lang === 'ja' ? `「${pt.title}」を入力` : `Fill: ${pt.title}`;
    formWrap.appendChild(formTitle);

    const form = document.createElement('form');
    form.className = 'sp-inline-form-fields';

    const formFields: Record<string, HTMLInputElement | HTMLTextAreaElement> = {};

    for (const varName of variables) {
      const field = document.createElement('div');
      field.className = 'sp-form-field';

      const label = document.createElement('label');
      label.textContent = varName.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
      field.appendChild(label);

      const isLong =
        varName.toLowerCase().includes('situation') ||
        varName.toLowerCase().includes('description') ||
        varName.toLowerCase().includes('story') ||
        varName.toLowerCase().includes('content');

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

    formWrap.appendChild(form);

    // Preview area
    const previewArea = document.createElement('div');
    previewArea.className = 'sp-preview-area';
    previewArea.style.display = 'none';
    formWrap.appendChild(previewArea);

    // Actions
    const actions = document.createElement('div');
    actions.className = 'sp-inline-actions';

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
    actions.appendChild(previewBtn);

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
    actions.appendChild(copyFilledBtn);

    formWrap.appendChild(actions);
    modalContent.appendChild(formWrap);

    // Keyboard shortcuts
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closePromptModal(state);
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        copyFilledBtn.click();
      }
    };
    document.addEventListener('keydown', handleKeydown);
    state.keyboardCleanup = () => document.removeEventListener('keydown', handleKeydown);

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
    modalContent.appendChild(copyBtn);
  }

  overlay.appendChild(modalContent);
  document.body.appendChild(overlay);

  // Click outside to close
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closePromptModal(state);
    }
  });

  state.modalCleanup = () => {
    if (overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
  };
}

function closePromptModal(state: PromptTemplatesViewState): void {
  // Remove overlay from DOM
  const overlay = document.querySelector('.pt-modal-overlay');
  if (overlay && overlay.parentNode) {
    overlay.parentNode.removeChild(overlay);
  }
  state.modalCleanup?.();
  state.modalCleanup = null;
  state.keyboardCleanup?.();
  state.keyboardCleanup = null;
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

  // Clear and re-render
  container.innerHTML = '';
  const filtersRow = createQuickFilters(state);
  container.appendChild(filtersRow);
  const scrollContainer = createPromptScrollContainer(state);
  container.appendChild(scrollContainer);
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

    reRenderHorizontal(state);
  };

  window.addEventListener('banal:language-changed', handler);
  state.languageCleanup = () => window.removeEventListener('banal:language-changed', handler);
  (state.container as PromptTemplatesContainer).__ptCleanup = () => {
    cleanupLanguageListener(state);
    cleanupKeyboardShortcut(state);
    closePromptModal(state);
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