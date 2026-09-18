/**
 * Modal editor for custom tool stacks.
 */

import type { Lang } from '../i18n';
import { t } from '../i18n';
import { zeroKeyTools } from '../data/zero-key-tools';
import type { CustomStack } from '../lib/stack-customization';
import {
  addToolToStack,
  removeToolFromStack,
  saveCustomStack,
  updateToolRole,
} from '../lib/stack-customization';
import { createCloseButton } from '../lib/close-button';

function create<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (className) el.className = className;
  return el;
}

export interface CustomStackEditorOptions {
  lang: Lang;
  stack: CustomStack;
  isNew?: boolean;
  onSaved: (stack: CustomStack) => void;
  onCancel: () => void;
}

export function openCustomStackEditor(options: CustomStackEditorOptions): void {
  const { lang, isNew, onSaved, onCancel } = options;
  let draft: CustomStack = {
    ...options.stack,
    tools: options.stack.tools.map((t) => ({ ...t })),
  };

  const overlay = create('div', 'filter-modal-overlay custom-stack-editor-overlay');
  const dialog = create('div', 'filter-modal custom-stack-editor');
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');

  const header = create('div', 'custom-stack-editor-header');
  const title = create('h3', 'filter-modal-title');
  title.textContent = isNew
    ? t(lang, 'stacks.editor.titleNew')
    : t(lang, 'stacks.editor.titleEdit');
  header.appendChild(title);
  header.appendChild(
    createCloseButton({
      label: t(lang, 'privacy.close'),
      onClick: () => {
        overlay.remove();
        onCancel();
      },
    })
  );
  dialog.appendChild(header);

  const nameLabel = create('label', 'filter-modal-label');
  nameLabel.textContent = t(lang, 'stacks.editor.nameLabel');
  const nameInput = create('input', 'filter-modal-input') as HTMLInputElement;
  nameInput.type = 'text';
  nameInput.maxLength = 120;
  nameInput.value = draft.name;
  nameInput.addEventListener('input', () => {
    draft = { ...draft, name: nameInput.value.trim() || draft.name };
  });
  nameLabel.appendChild(nameInput);
  dialog.appendChild(nameLabel);

  const toolsTitle = create('p', 'custom-stack-tools-label');
  toolsTitle.textContent = t(lang, 'stacks.editor.toolsLabel');
  dialog.appendChild(toolsTitle);

  const toolsList = create('div', 'custom-stack-tools-list');

  function renderToolsList(): void {
    toolsList.innerHTML = '';
    for (const stackTool of draft.tools) {
      const toolMeta = zeroKeyTools.find((tool) => tool.id === stackTool.toolId);
      const row = create('div', 'custom-stack-tool-row');

      const nameEl = create('span', 'custom-stack-tool-name');
      nameEl.textContent = toolMeta?.name || stackTool.toolId;
      row.appendChild(nameEl);

      const roleInput = create('input', 'custom-stack-role-input') as HTMLInputElement;
      roleInput.type = 'text';
      roleInput.maxLength = 80;
      roleInput.placeholder = t(lang, 'stacks.editor.rolePlaceholder');
      roleInput.value = stackTool.role;
      roleInput.addEventListener('change', () => {
        draft = updateToolRole(draft, stackTool.toolId, roleInput.value.trim() || stackTool.role);
      });
      row.appendChild(roleInput);

      const removeBtn = create('button', 'custom-stack-remove-btn');
      removeBtn.type = 'button';
      removeBtn.textContent = t(lang, 'stacks.editor.remove');
      removeBtn.addEventListener('click', () => {
        draft = removeToolFromStack(draft, stackTool.toolId);
        renderToolsList();
      });
      row.appendChild(removeBtn);
      toolsList.appendChild(row);
    }
  }

  renderToolsList();
  dialog.appendChild(toolsList);

  const addSection = create('div', 'custom-stack-add-section');
  const searchInput = create('input', 'filter-modal-input') as HTMLInputElement;
  searchInput.type = 'search';
  searchInput.placeholder = t(lang, 'stacks.editor.searchTools');
  searchInput.autocomplete = 'off';

  const select = create('select', 'custom-stack-tool-select') as HTMLSelectElement;
  const roleForAdd = create('input', 'custom-stack-role-input') as HTMLInputElement;
  roleForAdd.type = 'text';
  roleForAdd.maxLength = 80;
  roleForAdd.placeholder = t(lang, 'stacks.editor.rolePlaceholder');

  function refreshToolOptions(): void {
    const q = searchInput.value.trim().toLowerCase();
    const used = new Set(draft.tools.map((tool) => tool.toolId));
    const matches = zeroKeyTools
      .filter((tool) => !used.has(tool.id))
      .filter(
        (tool) =>
          !q ||
          tool.name.toLowerCase().includes(q) ||
          tool.id.toLowerCase().includes(q) ||
          tool.category.toLowerCase().includes(q)
      )
      .slice(0, 50);

    select.innerHTML = '';
    const placeholder = create('option');
    placeholder.value = '';
    placeholder.textContent = t(lang, 'stacks.editor.addTool');
    select.appendChild(placeholder);
    for (const tool of matches) {
      const opt = create('option');
      opt.value = tool.id;
      opt.textContent = tool.name;
      select.appendChild(opt);
    }
  }

  searchInput.addEventListener('input', refreshToolOptions);
  refreshToolOptions();

  const addBtn = create('button', 'filter-share-btn');
  addBtn.type = 'button';
  addBtn.textContent = t(lang, 'stacks.editor.addTool');
  addBtn.addEventListener('click', () => {
    const toolId = select.value;
    if (!toolId) return;
    const role = roleForAdd.value.trim() || 'Tool';
    draft = addToolToStack(draft, toolId, role);
    roleForAdd.value = '';
    refreshToolOptions();
    renderToolsList();
  });

  addSection.append(searchInput, select, roleForAdd, addBtn);
  dialog.appendChild(addSection);

  const errorEl = create('p', 'custom-stack-error');
  errorEl.hidden = true;
  dialog.appendChild(errorEl);

  const actions = create('div', 'filter-modal-actions');
  const cancelBtn = create('button', 'filter-share-btn');
  cancelBtn.type = 'button';
  cancelBtn.textContent = t(lang, 'filters.cancel');
  const saveBtn = create('button', 'filter-share-btn filter-share-btn-primary');
  saveBtn.type = 'button';
  saveBtn.textContent = t(lang, 'stacks.editor.save');

  const close = () => {
    overlay.remove();
  };

  cancelBtn.addEventListener('click', () => {
    close();
    onCancel();
  });
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      close();
      onCancel();
    }
  });

  saveBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (!name || draft.tools.length === 0) {
      errorEl.textContent = t(lang, 'stacks.editor.noTools');
      errorEl.hidden = false;
      return;
    }
    draft = {
      ...draft,
      name,
      customizedAt: new Date().toISOString(),
    };
    saveCustomStack(draft);
    close();
    onSaved(draft);
  });

  actions.append(cancelBtn, saveBtn);
  dialog.appendChild(actions);
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);
  nameInput.focus();
}
