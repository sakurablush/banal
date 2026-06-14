/**
 * Quick Start Module — renders 5 popular prompt templates as cards.
 *
 * This module displays a curated selection of the most commonly used prompt templates
 * between the DIRECTORY and PROMPT TEMPLATES sections. Each card shows the title,
 * description, and a "Copy Template" button that opens a modal form.
 */

import {
  PromptTemplatesLibrary,
  extractTemplateVariables,
  type Locale,
} from './lib/prompt-templates';
import { t } from './i18n';

const POPULAR_TEMPLATES = [
  'job-gaps-as-strengths',
  'grounding-low-energy',
  'zero-budget-learning',
  'form-decoder',
  'micro-hustles',
];

/**
 * Initialize the quick start section.
 * Renders 5 popular prompt template cards into the #quickstart-root container.
 */
export function initQuickStart(): void {
  const root = document.getElementById('quickstart-root');
  if (!root) {
    console.warn('Quick start root not found');
    return;
  }

  root.innerHTML = '';

  const grid = document.createElement('div');
  grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';

  const lang = document.documentElement.lang?.startsWith('ja') ? 'ja' : 'en';
  const lib = new PromptTemplatesLibrary(lang as Locale);

  POPULAR_TEMPLATES.forEach((id) => {
    const pt = lib.getById(id);
    if (!pt) {
      console.warn(`Prompt template ${id} not found`);
      return;
    }

    const card = createPromptTemplateCard(pt, lib, lang as Locale);
    grid.appendChild(card);
  });

  root.appendChild(grid);
}

/**
 * Create a card element for a prompt template.
 */
function createPromptTemplateCard(
  pt: { id: string; title: string; description: string; template: string },
  lib: PromptTemplatesLibrary,
  lang: Locale
): HTMLElement {
  const card = document.createElement('article');
  card.className =
    'bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors';

  // Title
  const title = document.createElement('h3');
  title.className = 'text-xl font-bold text-white mb-2';
  title.textContent = pt.title;

  // Description
  const description = document.createElement('p');
  description.className = 'text-white/60 text-sm mb-4';
  description.textContent = pt.description;

  // Variables info
  const variables = extractTemplateVariables(pt.template);
  if (variables.length > 0) {
    const varsDiv = document.createElement('div');
    varsDiv.className = 'mb-4';
    const varsLabel = document.createElement('div');
    varsLabel.className = 'text-white/40 text-xs mb-1';
    varsLabel.textContent = t(lang as 'en' | 'ja', 'quickstart.fields');
    const varsValue = document.createElement('div');
    varsValue.className = 'text-white/80 text-sm';
    varsValue.textContent = `${variables.length} ${lang === 'ja' ? '項目' : 'fields'}`;
    varsDiv.appendChild(varsLabel);
    varsDiv.appendChild(varsValue);
    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(varsDiv);
  } else {
    card.appendChild(title);
    card.appendChild(description);
  }

  // Actions
  const actions = document.createElement('div');
  actions.className = 'flex gap-3 mt-4';

  const copyText = t(lang as 'en' | 'ja', 'quickstart.copyTemplate');
  const fillText = t(lang as 'en' | 'ja', 'quickstart.fillCopy');

  // Copy button
  const copyBtn = document.createElement('button');
  copyBtn.type = 'button';
  copyBtn.className =
    'flex-1 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-lg transition-colors';
  copyBtn.textContent = copyText;
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(pt.template);
      const originalText = copyBtn.textContent;
      copyBtn.textContent = t(lang as 'en' | 'ja', 'quickstart.copied');
      setTimeout(() => {
        copyBtn.textContent = originalText;
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      alert(t(lang as 'en' | 'ja', 'quickstart.copyFailed'));
    }
  });

  // Fill & Copy button
  const fillBtn = document.createElement('button');
  fillBtn.type = 'button';
  fillBtn.className =
    'flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-lg transition-colors';
  fillBtn.textContent = fillText;
  fillBtn.addEventListener('click', () => {
    openFillModal(pt, lib, lang);
  });

  actions.appendChild(copyBtn);
  actions.appendChild(fillBtn);
  card.appendChild(actions);

  return card;
}

/**
 * Open a modal form for filling in prompt template variables.
 */
function openFillModal(
  pt: { id: string; title: string; description: string; template: string },
  lib: PromptTemplatesLibrary,
  lang: Locale
): void {
  const variables = extractTemplateVariables(pt.template);

  // Create modal
  const modal = document.createElement('div');
  modal.className =
    'fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4';

  const modalContent = document.createElement('div');
  modalContent.className =
    'bg-[#06060b] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto';

  // Header
  const header = document.createElement('div');
  header.className = 'flex items-center justify-between p-6 border-b border-white/10';

  const title = document.createElement('h3');
  title.className = 'text-2xl font-bold text-white';
  title.textContent = pt.title;

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'text-white/60 hover:text-white text-2xl';
  closeBtn.textContent = '×';
  closeBtn.addEventListener('click', () => modal.remove());

  header.appendChild(title);
  header.appendChild(closeBtn);
  modalContent.appendChild(header);

  // Form
  const form = document.createElement('form');
  form.className = 'p-6 space-y-4';

  const formFields: Record<string, HTMLInputElement | HTMLTextAreaElement> = {};

  variables.forEach((varName) => {
    const field = document.createElement('div');
    field.className = 'space-y-2';

    const label = document.createElement('label');
    label.className = 'block text-white/80 text-sm font-semibold';
    label.textContent = varName.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());

    const isLong =
      varName.toLowerCase().includes('situation') ||
      varName.toLowerCase().includes('description') ||
      varName.toLowerCase().includes('story');

    let input: HTMLInputElement | HTMLTextAreaElement;
    if (isLong) {
      input = document.createElement('textarea');
      input.rows = 3;
      input.className =
        'w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-violet-500';
    } else {
      input = document.createElement('input');
      input.type = 'text';
      input.className =
        'w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-violet-500';
    }
    input.name = varName;
    input.required = false;

    field.appendChild(label);
    field.appendChild(input);
    form.appendChild(field);

    formFields[varName] = input;
  });

  // Actions
  const actions = document.createElement('div');
  actions.className = 'flex gap-3 mt-6';

  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className =
    'flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors';
  cancelBtn.textContent = t(lang as 'en' | 'ja', 'quickstart.cancel');
  cancelBtn.addEventListener('click', () => modal.remove());

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className =
    'flex-1 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-lg transition-colors';
  submitBtn.textContent = t(lang as 'en' | 'ja', 'quickstart.fillSubmit');

  actions.appendChild(cancelBtn);
  actions.appendChild(submitBtn);
  form.appendChild(actions);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const values: Record<string, string> = {};
    Object.entries(formFields).forEach(([key, input]) => {
      values[key] = input.value || `[${key}]`;
    });

    const filled = lib.fill(pt.id, values);

    try {
      await navigator.clipboard.writeText(filled);
      submitBtn.textContent = t(lang as 'en' | 'ja', 'quickstart.copied');
      setTimeout(() => modal.remove(), 1500);
    } catch (error) {
      console.error('Failed to copy:', error);
      alert(t(lang as 'en' | 'ja', 'quickstart.copyFailed'));
    }
  });

  modalContent.appendChild(form);
  modal.appendChild(modalContent);

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });

  document.body.appendChild(modal);
}
