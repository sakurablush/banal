/**
 * Small, pure, extremely well-tested utilities for Banal.
 * Everything here must have 100% test coverage.
 * No side effects. Easy to audit.
 *
 * Why a dedicated utils module even for tiny helpers?
 * Because when the person reading the source is a volunteer in a community org at 11pm,
 * every file must be obviously correct in one pass. No hidden mutations, no "clever" code.
 * The truncate helper exists so future chat previews (search, history) never cut a person's story in half.
 */

import type { Lang } from './i18n';

/** Type guard used by consumers (and tests) to prove a string is one of our supported languages. */
export function isSupportedLang(lang: string): lang is Lang {
  return lang === 'en' || lang === 'ja';
}

export function getDisplayName(lang: Lang): string {
  return lang === 'ja' ? '日本語' : 'English';
}

/**
 * Very banal helper: safely truncate user input preview (future chat use).
 * Respects unicode and avoids breaking in the middle of words where possible.
 */
export function truncateForPreview(input: string, maxLength = 120): string {
  if (input.length <= maxLength) return input.trim();

  const truncated = input.slice(0, maxLength);
  // try to cut at last space
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > maxLength * 0.6) {
    return truncated.slice(0, lastSpace).trim() + '…';
  }
  return truncated.trim() + '…';
}

/**
 * Proper HTML escaping for untrusted/user or AI-generated content when building raw HTML strings
 * (used in self-contained exports and any future static HTML generation).
 * Escapes &, <, >, ", ' to prevent markup breakage and reduce injection surface.
 */
export function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Allow only http(s) links on anchors built from catalog data. */
export function safeExternalHref(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.href;
    }
  } catch {
    // invalid URL
  }
  return null;
}

export function setSafeExternalHref(anchor: HTMLAnchorElement, url: string): void {
  const safe = safeExternalHref(url);
  if (safe) {
    anchor.setAttribute('href', safe);
  } else {
    anchor.removeAttribute('href');
  }
}
