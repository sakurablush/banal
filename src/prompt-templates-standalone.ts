/**
 * Standalone Prompt Templates UI
 * Renders the 9 prompt templates as cards that users can copy and use
 * without needing the chat system.
 */

import {
  PromptTemplatesLibrary,
  extractTemplateVariables,
  type Locale,
} from './lib/prompt-templates';

interface PromptTemplatesUIOptions {
  container: HTMLElement;
  lang: Locale;
}

export function renderPromptTemplatesStandalone(options: PromptTemplatesUIOptions): void {
  const { container, lang } = options;

  try {
    const lib = new PromptTemplatesLibrary(lang);
    const promptTemplates = lib.getAll();

    container.innerHTML = '';

    const grid = document.createElement('div');
    grid.className = 'sp-grid';

    promptTemplates.forEach((pt) => {
      const card = createPromptTemplateCard(pt, lib, lang);
      grid.appendChild(card);
    });

    container.appendChild(grid);
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

function createPromptTemplateCard(
  pt: { id: string; title: string; description: string; template: string },
  lib: PromptTemplatesLibrary,
  lang: Locale
): HTMLElement {
  const card = document.createElement('article');
  card.className = 'sp-card';

  // Header
  const header = document.createElement('div');
  header.className = 'sp-card-header';

  const title = document.createElement('h3');
  title.className = 'sp-card-title';
  title.textContent = pt.title;
  header.appendChild(title);

  card.appendChild(header);

  // Description
  const desc = document.createElement('p');
  desc.className = 'sp-card-desc';
  desc.textContent = pt.description;
  card.appendChild(desc);

  // Variables info
  const variables = extractTemplateVariables(pt.template);
  if (variables.length > 0) {
    const varsDiv = document.createElement('div');
    varsDiv.className = 'sp-card-vars';
    varsDiv.innerHTML = `<span class="sp-vars-label">${lang === 'ja' ? '入力項目:' : 'Fields:'}</span> ${variables.length}`;
    card.appendChild(varsDiv);
  }

  // Actions
  const actions = document.createElement('div');
  actions.className = 'sp-card-actions';

  // Copy button
  const copyBtn = document.createElement('button');
  copyBtn.type = 'button';
  copyBtn.className = 'sp-btn sp-btn-primary';
  copyBtn.textContent = lang === 'ja' ? 'テンプレートをコピー' : 'Copy Template';
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(pt.template);
      const originalText = copyBtn.textContent;
      copyBtn.textContent = lang === 'ja' ? '✓ コピーしました' : '✓ Copied!';
      setTimeout(() => {
        copyBtn.textContent = originalText;
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      alert(lang === 'ja' ? 'コピーに失敗しました' : 'Failed to copy to clipboard');
    }
  });
  actions.appendChild(copyBtn);

  // Fill & Copy button (opens modal)
  const fillBtn = document.createElement('button');
  fillBtn.type = 'button';
  fillBtn.className = 'sp-btn sp-btn-secondary';
  fillBtn.textContent = lang === 'ja' ? '入力してコピー' : 'Fill & Copy';
  fillBtn.addEventListener('click', () => {
    openFillModal(pt, lib, lang);
  });
  actions.appendChild(fillBtn);

  card.appendChild(actions);

  return card;
}

function openFillModal(
  sp: { id: string; title: string; description: string; template: string },
  lib: PromptTemplatesLibrary,
  lang: Locale
): void {
  const variables = extractTemplateVariables(sp.template);

  // Create modal
  const modal = document.createElement('div');
  modal.className = 'sp-modal-overlay';

  const modalContent = document.createElement('div');
  modalContent.className = 'sp-modal-content';

  // Header
  const header = document.createElement('div');
  header.className = 'sp-modal-header';

  const title = document.createElement('h3');
  title.textContent = sp.title;
  header.appendChild(title);

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'sp-modal-close';
  closeBtn.textContent = '×';
  closeBtn.addEventListener('click', () => modal.remove());
  header.appendChild(closeBtn);

  modalContent.appendChild(header);

  // Form
  const form = document.createElement('form');
  form.className = 'sp-modal-form';

  const formFields: Record<string, HTMLInputElement | HTMLTextAreaElement> = {};

  variables.forEach((varName) => {
    const field = document.createElement('div');
    field.className = 'sp-form-field';

    const label = document.createElement('label');
    label.textContent = varName.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
    field.appendChild(label);

    const isLong =
      varName.toLowerCase().includes('situation') ||
      varName.toLowerCase().includes('description') ||
      varName.toLowerCase().includes('story');

    let input: HTMLInputElement | HTMLTextAreaElement;
    if (isLong) {
      input = document.createElement('textarea');
      input.rows = 3;
    } else {
      input = document.createElement('input');
      input.type = 'text';
    }
    input.name = varName;
    input.required = false;
    field.appendChild(input);

    formFields[varName] = input;
    form.appendChild(field);
  });

  // Actions
  const actions = document.createElement('div');
  actions.className = 'sp-modal-actions';

  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.className = 'sp-btn sp-btn-secondary';
  cancelBtn.textContent = lang === 'ja' ? 'キャンセル' : 'Cancel';
  cancelBtn.addEventListener('click', () => modal.remove());
  actions.appendChild(cancelBtn);

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'sp-btn sp-btn-primary';
  submitBtn.textContent = lang === 'ja' ? '入力してコピー' : 'Fill & Copy';
  actions.appendChild(submitBtn);

  form.appendChild(actions);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const values: Record<string, string> = {};
    Object.entries(formFields).forEach(([key, input]) => {
      values[key] = input.value || `[${key}]`;
    });

    const filled = lib.fill(sp.id, values);

    try {
      await navigator.clipboard.writeText(filled);
      submitBtn.textContent = lang === 'ja' ? '✓ コピーしました' : '✓ Copied!';
      setTimeout(() => modal.remove(), 1500);
    } catch (error) {
      console.error('Failed to copy:', error);
      alert(lang === 'ja' ? 'コピーに失敗しました' : 'Failed to copy to clipboard');
    }
  });

  modalContent.appendChild(form);
  modal.appendChild(modalContent);

  // Close on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });

  document.body.appendChild(modal);
}
