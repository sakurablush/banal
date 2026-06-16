/**
 * Dismissible banner after first prompt form keystroke (session-only storage notice).
 */

import type { Lang } from '../i18n';
import { t } from '../i18n';
import { STORAGE_KEYS } from './storage-cleanup';
import { openPrivacyPanel } from '../components/privacy-panel';

let shownThisSession = false;

function isDismissed(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEYS.privacyBannerDismissed) === '1';
  } catch {
    return false;
  }
}

export function maybeShowPrivacyBanner(lang: Lang): void {
  if (shownThisSession || isDismissed()) return;
  shownThisSession = true;

  const existing = document.getElementById('banal-privacy-banner');
  if (existing) return;

  const banner = document.createElement('div');
  banner.id = 'banal-privacy-banner';
  banner.className = 'privacy-banner';
  banner.setAttribute('role', 'status');

  const text = document.createElement('p');
  text.className = 'privacy-banner-text';
  text.textContent = t(lang, 'privacy.banner');
  banner.appendChild(text);

  const link = document.createElement('button');
  link.type = 'button';
  link.className = 'privacy-banner-link';
  link.textContent = t(lang, 'privacy.bannerLink');
  link.addEventListener('click', () => openPrivacyPanel(lang));
  banner.appendChild(link);

  const dismiss = document.createElement('button');
  dismiss.type = 'button';
  dismiss.className = 'privacy-banner-dismiss';
  dismiss.textContent = t(lang, 'privacy.bannerDismiss');
  dismiss.addEventListener('click', () => {
    try {
      sessionStorage.setItem(STORAGE_KEYS.privacyBannerDismissed, '1');
    } catch {
      /* ignore */
    }
    banner.remove();
  });
  banner.appendChild(dismiss);

  const root = document.getElementById('prompt-templates-root');
  if (root?.parentElement) {
    root.parentElement.insertBefore(banner, root);
  } else {
    document.body.appendChild(banner);
  }
}

export function onPromptFormInput(lang: Lang, values: Record<string, string>): void {
  const hasText = Object.values(values).some((v) => v.trim().length > 0);
  if (hasText) maybeShowPrivacyBanner(lang);
}
