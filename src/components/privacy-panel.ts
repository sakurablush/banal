/**
 * In-app privacy / stored-data panel.
 */

import type { Lang } from '../i18n';
import { t } from '../i18n';
import { createCloseButton } from '../lib/close-button';
import { clearBanalStorage, type StorageClearScope } from '../lib/storage-cleanup';

function create<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (className) el.className = className;
  return el;
}

function confirmAndClear(lang: Lang, scope: StorageClearScope, messageKey: string): void {
  if (!window.confirm(t(lang, messageKey))) return;
  clearBanalStorage(scope);
}

export function openPrivacyPanel(lang: Lang): void {
  const overlay = create('div', 'filter-modal-overlay privacy-panel-overlay');
  const dialog = create('div', 'filter-modal privacy-panel');
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', 'privacy-panel-title');

  const header = create('div', 'privacy-panel-header');
  const title = create('h3', 'filter-modal-title');
  title.id = 'privacy-panel-title';
  title.textContent = t(lang, 'privacy.title');
  header.appendChild(title);
  header.appendChild(
    createCloseButton({
      label: t(lang, 'privacy.close'),
      onClick: () => overlay.remove(),
    })
  );
  dialog.appendChild(header);

  const intro = create('p', 'privacy-panel-intro');
  intro.textContent = t(lang, 'privacy.intro');
  dialog.appendChild(intro);

  const sessionBlock = create('section', 'privacy-panel-block');
  const sessionTitle = create('h4', 'privacy-panel-subtitle');
  sessionTitle.textContent = t(lang, 'privacy.sessionTitle');
  const sessionBody = create('p', 'privacy-panel-body');
  sessionBody.textContent = t(lang, 'privacy.sessionBody');
  sessionBlock.append(sessionTitle, sessionBody);
  dialog.appendChild(sessionBlock);

  const localBlock = create('section', 'privacy-panel-block');
  const localTitle = create('h4', 'privacy-panel-subtitle');
  localTitle.textContent = t(lang, 'privacy.localTitle');
  const localBody = create('p', 'privacy-panel-body');
  localBody.textContent = t(lang, 'privacy.localBody');
  localBlock.append(localTitle, localBody);
  dialog.appendChild(localBlock);

  const never = create('p', 'privacy-panel-never');
  never.textContent = t(lang, 'privacy.neverSent');
  dialog.appendChild(never);

  const actions = create('div', 'privacy-panel-actions');

  const promptsBtn = create('button', 'filter-share-btn');
  promptsBtn.type = 'button';
  promptsBtn.textContent = t(lang, 'privacy.clearPrompts');
  promptsBtn.addEventListener('click', () =>
    confirmAndClear(lang, 'prompts', 'privacy.clearPromptsConfirm')
  );

  const filtersBtn = create('button', 'filter-share-btn');
  filtersBtn.type = 'button';
  filtersBtn.textContent = t(lang, 'privacy.clearFilters');
  filtersBtn.addEventListener('click', () =>
    confirmAndClear(lang, 'saved-filters', 'privacy.clearFiltersConfirm')
  );

  const stacksBtn = create('button', 'filter-share-btn');
  stacksBtn.type = 'button';
  stacksBtn.textContent = t(lang, 'privacy.clearStacks');
  stacksBtn.addEventListener('click', () =>
    confirmAndClear(lang, 'custom-stacks', 'privacy.clearStacksConfirm')
  );

  const allBtn = create('button', 'filter-share-btn filter-share-btn-primary');
  allBtn.type = 'button';
  allBtn.textContent = t(lang, 'privacy.clearAll');
  allBtn.addEventListener('click', () => confirmAndClear(lang, 'all', 'privacy.clearAllConfirm'));

  actions.append(promptsBtn, filtersBtn, stacksBtn, allBtn);
  dialog.appendChild(actions);

  overlay.appendChild(dialog);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });
  document.body.appendChild(overlay);
}

export function wirePrivacyPanelTriggers(): void {
  document.querySelectorAll('[data-privacy-panel]').forEach((el) => {
    if ((el as HTMLElement).dataset.privacyWired === '1') return;
    (el as HTMLElement).dataset.privacyWired = '1';
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const lang = document.documentElement.lang?.startsWith('ja') ? 'ja' : 'en';
      openPrivacyPanel(lang);
    });
  });
}
