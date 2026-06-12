/**
 * Standalone Prompt Templates UI — Directory-Style Layout
 *
 * Renders 9 prompt templates in a Directory-style layout:
 * - Category rail/sidebar with counts
 * - Prompt list inside selected category
 * - Right-side/in-line prompt window for the selected prompt
 *
 * Features preserved from original:
 * - Auto-save to localStorage per template
 * - Keyboard shortcuts: Ctrl/Cmd+Enter to copy, Esc to close form
 * - Toast notification on copy
 * - Preview mode
 * - Mobile-first (sticky copy button)
 */

import {
  PromptTemplatesLibrary,
  type Locale,
} from './lib/prompt-templates';

const STORAGE_PREFIX = 'banal-pt-';

// ─── Category Taxonomy ──────────────────────────────────────────────────────────

interface PromptCategory {
  id: string;
  labelEn: string;
  labelJa: string;
}

const PROMPT_CATEGORIES: PromptCategory[] = [
  { id: 'all', labelEn: 'All prompts', labelJa: 'すべてのテンプレート' },
  { id: 'career-money', labelEn: 'Career & Money', labelJa: '仕事・お金' },
  { id: 'learning-growth', labelEn: 'Learning & Growth', labelJa: '学び・成長' },
  { id: 'health-grounding', labelEn: 'Health & Grounding', labelJa: 'こころ・グラウンディング' },
  { id: 'paperwork-rights', labelEn: 'Paperwork & Rights', labelJa: '手続き・権利' },
  { id: 'communication', labelEn: 'Communication', labelJa: 'コミュニケーション' },
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

function getPromptsForCategory(categoryId: string, allPrompts: Array<{ id: string; title: string; description: string; template: string }>): Array<{ id: string; title: string; description: string; template: string }> {
  if (categoryId === 'all') {
    return allPrompts;
  }
  return allPrompts.filter((pt) => PROMPT_CATEGORY_MAP[pt.id] === categoryId);
}

function getCategoryCounts(allPrompts: Array<{ id: string; title: string; description: string; template: string }>): Record<string, number> {
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
  valuesByTemplate: Record<string, Record<string, string>>;
  lang: Locale;
  container: HTMLElement;
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
  const state: PromptTemplatesViewState = {
    selectedCategory: 'all',
    selectedPromptId: null,
    valuesByTemplate: {},
    lang,
    container,
  };

  try {
    const lib = new PromptTemplatesLibrary(lang);
    const allPrompts = lib.getAll();

    // Initialize saved values for all prompts
    for (const pt of allPrompts) {
      state.valuesByTemplate[pt.id] = getSavedValues(pt.id, lang);
    }

    container.innerHTML = '';
    container.className = 'pt-directory-shell';

    // Store prompts and lib in closure for re-render
    (state as any)._prompts = allPrompts;
    (state as any)._lib = lib;

    // Render the directory layout
    renderDirectoryLayout(state);

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

// ─── Directory Layout ────────────────────────────────────────────────────────

function renderDirectoryLayout(state: PromptTemplatesViewState): void {
  // Category rail (sidebar)
  const rail = createCategoryRail(state);
  state.container.appendChild(rail);

  // Prompt list
  const list = createPromptList(state);
  state.container.appendChild(list);

  // Prompt window (right side or inline)
  const lib = (state as any)._lib;
  const window = createPromptWindow(state, lib);
  state.container.appendChild(window);
}

function createCategoryRail(state: PromptTemplatesViewState): HTMLElement {
  const rail = document.createElement('aside');
  rail.className = 'pt-category-rail';

  const prompts = (state as any)._prompts;
  const counts = getCategoryCounts(prompts);

  for (const cat of PROMPT_CATEGORIES) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `pt-category-button${state.selectedCategory === cat.id ? ' active' : ''}`;
    btn.dataset.category = cat.id;
    const label = state.lang === 'ja' ? cat.labelJa : cat.labelEn;
    const count = counts[cat.id] || 0;
    btn.innerHTML = `
      <span class="pt-cat-label">${label}</span>
      <span class="pt-cat-count">${count}</span>
    `;
    btn.addEventListener('click', () => {
      state.selectedCategory = cat.id;
      // Clear selected prompt when switching categories
      state.selectedPromptId = null;
      reRenderDirectory(state);
    });
    rail.appendChild(btn);
  }

  return rail;
}

function createPromptList(state: PromptTemplatesViewState): HTMLElement {
  const list = document.createElement('div');
  list.className = 'pt-prompt-list';

  const prompts = (state as any)._prompts;
  const filteredPrompts = getPromptsForCategory(state.selectedCategory, prompts);

  for (const pt of filteredPrompts) {
    const card = document.createElement('article');
    card.className = `pt-prompt-card${state.selectedPromptId === pt.id ? ' active' : ''}`;
    card.dataset.promptId = pt.id;

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

    // Field count
    const fieldCount = extractTemplateVariables(pt.template).length;
    if (fieldCount > 0) {
      const varsInfo = document.createElement('div');
      varsInfo.className = 'sp-card-vars';
      varsInfo.innerHTML = `<span class="sp-vars-label">${state.lang === 'ja' ? '入力項目:' : 'Fields:'}</span> ${fieldCount}`;
      card.appendChild(varsInfo);
    }

    // Action buttons
    const actions = document.createElement('div');
    actions.className = 'pt-prompt-actions';

    const fillBtn = document.createElement('button');
    fillBtn.type = 'button';
    fillBtn.className = 'sp-btn sp-btn-secondary';
    fillBtn.textContent = state.lang === 'ja' ? '入力してコピー' : 'Fill & Copy';
    fillBtn.addEventListener('click', () => {
      state.selectedPromptId = pt.id;
      reRenderDirectory(state);
    });
    actions.appendChild(fillBtn);

    card.appendChild(actions);
    list.appendChild(card);
  }

  return list;
}

function createPromptWindow(state: PromptTemplatesViewState, lib: PromptTemplatesLibrary): HTMLElement {
  const window = document.createElement('div');
  window.className = 'pt-prompt-window';

  if (!state.selectedPromptId) {
    // Empty state - show placeholder
    const empty = document.createElement('div');
    empty.className = 'pt-window-empty';
    empty.innerHTML = `
      <div class="pt-empty-icon">\u{1F4AC}</div>
      <p class="pt-empty-text">${state.lang === 'ja' ? 'テンプレートを選択してください' : 'Select a template to get started'}</p>
    `;
    window.appendChild(empty);
    return window;
  }

  const prompts = (state as any)._prompts;
  const pt = prompts.find((p: { id: string }) => p.id === state.selectedPromptId);
  if (!pt) return window;

  // Window header
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
    state.selectedPromptId = null;
    reRenderDirectory(state);
  });
  header.appendChild(closeBtn);
  window.appendChild(header);

  // Description
  const desc = document.createElement('p');
  desc.className = 'pt-window-desc';
  desc.textContent = pt.description;
  window.appendChild(desc);

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
        (input as HTMLTextAreaElement).rows = 3;
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
      const filled = lib.fill(pt.id, values);
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
      const filled = lib.fill(pt.id, values);

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
        alert(state.lang === 'ja' ? 'コピーに失敗しました' : 'Failed to copy to clipboard');
      }
    });
    actions.appendChild(copyFilledBtn);

    formWrap.appendChild(actions);
    window.appendChild(formWrap);

    // Keyboard shortcuts
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        state.selectedPromptId = null;
        reRenderDirectory(state);
        document.removeEventListener('keydown', handleKeydown);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        copyFilledBtn.click();
      }
    };
    document.addEventListener('keydown', handleKeydown);

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
        alert(state.lang === 'ja' ? 'コピーに失敗しました' : 'Failed to copy to clipboard');
      }
    });
    window.appendChild(copyBtn);
  }

  return window;
}

function reRenderDirectory(state: PromptTemplatesViewState): void {
  const container = state.container;
  if (!container) return;

  // Re-render layout
  container.innerHTML = '';
  const rail = createCategoryRail(state);
  container.appendChild(rail);
  const list = createPromptList(state);
  container.appendChild(list);
  const lib = (state as any)._lib;
  const window = createPromptWindow(state, lib);
  container.appendChild(window);
}

// ─── Language Change Listener ─────────────────────────────────────────────────

function listenForLanguageChanges(state: PromptTemplatesViewState): void {
  const handler = (e: Event) => {
    const nextLang = (e as CustomEvent).detail?.lang || getCurrentLang();
    state.lang = nextLang;

    // Re-initialize saved values with new language
    const lib = (state as any)._lib;
    const prompts = lib.getAll();
    for (const pt of prompts) {
      state.valuesByTemplate[pt.id] = getSavedValues(pt.id, nextLang);
    }

    reRenderDirectory(state);
  };

  window.addEventListener('banal:language-changed', handler);
  (state.container as any).__ptCleanup = () => {
    window.removeEventListener('banal:language-changed', handler);
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