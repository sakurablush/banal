/**
 * Section-scoped filter URLs for multi-module pages.
 * Each module uses its own query prefix (e.g. models_useCase) plus a section hash.
 */

import type { Lang } from '../i18n';

export type SectionFilterId = 'models' | 'stacks' | 'prompts' | 'ai-tools' | 'dev-tools';

export const SECTION_HASH: Record<SectionFilterId, string> = {
  models: 'ai-models',
  stacks: 'tool-stacks',
  prompts: 'prompt-templates',
  'ai-tools': 'ai-tools',
  'dev-tools': 'dev-tools',
};

function paramPrefix(section: SectionFilterId): string {
  switch (section) {
    case 'models':
      return 'models';
    case 'stacks':
      return 'stacks';
    case 'prompts':
      return 'prompts';
    case 'ai-tools':
      return 'ai';
    case 'dev-tools':
      return 'dev';
  }
}

/** Unprefixed query keys accepted only when the URL hash targets that section. */
const LEGACY_QUERY_KEYS: Partial<Record<SectionFilterId, Record<string, string>>> = {
  models: { family: 'family', useCase: 'useCase', license: 'license', q: 'q' },
  stacks: { audience: 'audience' },
  prompts: { cat: 'cat' },
  'ai-tools': { cat: 'cat', q: 'q', life: 'life' },
  'dev-tools': { cat: 'cat', q: 'q', life: 'life' },
};

function readPrefixedParams(section: SectionFilterId): Record<string, string> {
  const prefix = `${paramPrefix(section)}_`;
  const out: Record<string, string> = {};
  for (const [key, value] of new URLSearchParams(window.location.search)) {
    if (key.startsWith(prefix) && value) out[key.slice(prefix.length)] = value;
  }
  return out;
}

function sectionMatchesHash(section: SectionFilterId): boolean {
  const hash = window.location.hash.replace(/^#/, '');
  if (!hash) return false;
  return hash === SECTION_HASH[section];
}

export function clearSectionParams(url: URL, section: SectionFilterId): void {
  const prefix = `${paramPrefix(section)}_`;
  for (const key of [...url.searchParams.keys()]) {
    if (key.startsWith(prefix)) url.searchParams.delete(key);
  }
}

export function setSectionParams(
  url: URL,
  section: SectionFilterId,
  values: Record<string, string | null | undefined>
): void {
  clearSectionParams(url, section);
  const prefix = `${paramPrefix(section)}_`;
  for (const [key, value] of Object.entries(values)) {
    if (value) url.searchParams.set(`${prefix}${key}`, value);
  }
}

export function getSectionParams(section: SectionFilterId): Record<string, string> {
  const out = readPrefixedParams(section);

  if (!sectionMatchesHash(section)) return out;

  const legacyMap = LEGACY_QUERY_KEYS[section];
  if (!legacyMap) return out;

  const params = new URLSearchParams(window.location.search);
  for (const [legacyKey, canonicalKey] of Object.entries(legacyMap)) {
    if (!out[canonicalKey]) {
      const value = params.get(legacyKey);
      if (value) out[canonicalKey] = value;
    }
  }

  return out;
}

export function buildSectionShareUrl(
  section: SectionFilterId,
  values: Record<string, string | null | undefined>
): string {
  const url = new URL(window.location.href);
  setSectionParams(url, section, values);
  url.hash = SECTION_HASH[section];
  return url.toString();
}

const SHARE_LABELS = {
  en: {
    label: '🔗 Share link',
    copied: '✓ Copied!',
    error: '✗ Error',
    title: 'Copy a link to this filtered view',
  },
  ja: {
    label: '🔗 リンクを共有',
    copied: '✓ コピーしました！',
    error: '✗ エラー',
    title: 'この絞り込み状態のリンクをコピー',
  },
} as const;

export function createShareFiltersButton(options: {
  section: SectionFilterId;
  lang: Lang;
  className?: string;
  getValues: () => Record<string, string | null | undefined>;
}): HTMLButtonElement {
  const copy = SHARE_LABELS[options.lang];
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = options.className ?? 'filter-share-btn';
  btn.textContent = copy.label;
  btn.title = copy.title;
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(
        buildSectionShareUrl(options.section, options.getValues())
      );
      btn.textContent = copy.copied;
      setTimeout(() => {
        btn.textContent = copy.label;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy share URL:', err);
      btn.textContent = copy.error;
      setTimeout(() => {
        btn.textContent = copy.label;
      }, 2000);
    }
  });
  return btn;
}
