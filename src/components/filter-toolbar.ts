/**
 * Unified filter toolbar: suggestions, share, save, saved presets.
 */

import type { Lang } from '../i18n';
import { t } from '../i18n';
import { buildSectionShareUrl, type SectionFilterId } from '../lib/section-filter-url';
import {
  deleteSavedSectionFilter,
  getSavedSectionFilters,
  saveSectionFilter,
} from '../lib/saved-section-filters';
import type { FilterSuggestion } from '../lib/filter-suggestions';

export interface FilterToolbarOptions {
  section: SectionFilterId;
  lang: Lang;
  getValues: () => Record<string, string | null | undefined>;
  onApply: (values: Record<string, string>) => void;
  suggestions?: FilterSuggestion[];
}

function create<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (className) el.className = className;
  return el;
}

function hasActiveFilters(values: Record<string, string | null | undefined>): boolean {
  return Object.values(values).some((v) => v != null && String(v).trim() !== '');
}

function showSaveModal(lang: Lang, onSave: (name: string) => void): void {
  const overlay = create('div', 'filter-modal-overlay');
  const dialog = create('div', 'filter-modal');
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', 'filter-save-title');

  const title = create('h3', 'filter-modal-title');
  title.id = 'filter-save-title';
  title.textContent = t(lang, 'filters.saveTitle');
  dialog.appendChild(title);

  const label = create('label', 'filter-modal-label');
  label.textContent = t(lang, 'filters.saveNameLabel');
  const input = create('input', 'filter-modal-input') as HTMLInputElement;
  input.type = 'text';
  input.maxLength = 40;
  input.placeholder = t(lang, 'filters.saveNamePlaceholder');
  label.appendChild(input);
  dialog.appendChild(label);

  const actions = create('div', 'filter-modal-actions');
  const cancelBtn = create('button', 'filter-share-btn');
  cancelBtn.type = 'button';
  cancelBtn.textContent = t(lang, 'filters.cancel');
  const saveBtn = create('button', 'filter-share-btn filter-share-btn-primary');
  saveBtn.type = 'button';
  saveBtn.textContent = t(lang, 'filters.saveConfirm');

  const close = () => overlay.remove();

  cancelBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  saveBtn.addEventListener('click', () => {
    const name = input.value.trim();
    if (!name) return;
    onSave(name);
    close();
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') saveBtn.click();
    if (e.key === 'Escape') close();
  });

  actions.append(cancelBtn, saveBtn);
  dialog.appendChild(actions);
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);
  input.focus();
}

export function renderFilterToolbar(options: FilterToolbarOptions): HTMLElement {
  const { section, lang, getValues, onApply, suggestions = [] } = options;
  const root = create('div', 'filter-toolbar');

  if (suggestions.length > 0) {
    const sugRow = create('div', 'filter-suggestions-row');
    const sugLabel = create('span', 'filter-suggestions-label');
    sugLabel.textContent = t(lang, 'filters.oftenUsed');
    sugRow.appendChild(sugLabel);

    for (const sug of suggestions) {
      const chip = create('button', 'filter-suggestion-chip');
      chip.type = 'button';
      chip.textContent = sug.label;
      chip.title = t(lang, 'filters.apply');
      chip.addEventListener('click', () => onApply(sug.values));
      sugRow.appendChild(chip);
    }
    root.appendChild(sugRow);
  }

  const actions = create('div', 'filter-toolbar-actions');

  const shareBtn = create('button', 'filter-share-btn');
  shareBtn.type = 'button';
  shareBtn.textContent = t(lang, 'filters.shareLink');
  shareBtn.title = t(lang, 'filters.shareTitle');
  shareBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(buildSectionShareUrl(section, getValues()));
      shareBtn.textContent = t(lang, 'filters.shareCopied');
      setTimeout(() => {
        shareBtn.textContent = t(lang, 'filters.shareLink');
      }, 2000);
    } catch {
      shareBtn.textContent = t(lang, 'filters.shareError');
      setTimeout(() => {
        shareBtn.textContent = t(lang, 'filters.shareLink');
      }, 2000);
    }
  });
  actions.appendChild(shareBtn);

  const saveBtn = create('button', 'filter-share-btn');
  saveBtn.type = 'button';
  saveBtn.textContent = t(lang, 'filters.save');
  saveBtn.addEventListener('click', () => {
    if (!hasActiveFilters(getValues())) return;
    showSaveModal(lang, (name) => {
      const saved = saveSectionFilter(section, name, getValues());
      if (saved) {
        saveBtn.textContent = t(lang, 'filters.saved');
        setTimeout(() => {
          saveBtn.textContent = t(lang, 'filters.save');
          refreshSavedMenu();
        }, 1500);
        refreshSavedMenu();
      }
    });
  });
  actions.appendChild(saveBtn);

  const savedWrap = create('div', 'filter-saved-wrap');
  const savedToggle = create('button', 'filter-share-btn filter-saved-toggle');
  savedToggle.type = 'button';
  savedToggle.textContent = t(lang, 'filters.savedMenu');
  savedToggle.setAttribute('aria-haspopup', 'true');
  savedToggle.setAttribute('aria-expanded', 'false');

  const savedMenu = create('div', 'filter-saved-menu');
  savedMenu.hidden = true;

  function refreshSavedMenu(): void {
    savedMenu.innerHTML = '';
    const items = getSavedSectionFilters(section);
    if (items.length === 0) {
      const empty = create('p', 'filter-saved-empty');
      empty.textContent = t(lang, 'filters.savedEmpty');
      savedMenu.appendChild(empty);
      return;
    }
    for (const item of items) {
      const row = create('div', 'filter-saved-item');
      const applyBtn = create('button', 'filter-saved-apply');
      applyBtn.type = 'button';
      applyBtn.textContent = item.name;
      applyBtn.addEventListener('click', () => {
        onApply(item.values);
        savedMenu.hidden = true;
        savedToggle.setAttribute('aria-expanded', 'false');
      });
      const delBtn = create('button', 'filter-saved-delete');
      delBtn.type = 'button';
      delBtn.textContent = '×';
      delBtn.title = t(lang, 'filters.delete');
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteSavedSectionFilter(item.id);
        refreshSavedMenu();
      });
      row.append(applyBtn, delBtn);
      savedMenu.appendChild(row);
    }
  }

  savedToggle.addEventListener('click', () => {
    const open = savedMenu.hidden;
    refreshSavedMenu();
    savedMenu.hidden = !open;
    savedToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  document.addEventListener(
    'click',
    (e) => {
      if (!savedWrap.contains(e.target as Node)) {
        savedMenu.hidden = true;
        savedToggle.setAttribute('aria-expanded', 'false');
      }
    },
    { capture: true }
  );

  savedWrap.append(savedToggle, savedMenu);
  actions.appendChild(savedWrap);
  root.appendChild(actions);

  return root;
}
