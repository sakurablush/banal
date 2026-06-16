/**
 * Article page entry — lightweight boot for standalone article pages.
 * Only initializes i18n (no chat, no directory, no playground).
 * Ambient background is CSS-only on .void-bg.
 */
import { copyArticleShareLink } from './lib/article-sharing';
import { applyTranslations, getCurrentLang, initI18n, setLang, t } from './i18n';

function wireArticleShareButton(): void {
  const btn = document.getElementById('article-share-btn');
  if (!btn) return;

  let resetTimer: ReturnType<typeof setTimeout> | undefined;

  const resetLabel = () => {
    btn.textContent = t(getCurrentLang(), 'article.shareLink');
  };

  btn.addEventListener('click', async () => {
    if (resetTimer) clearTimeout(resetTimer);
    const lang = getCurrentLang();
    const ok = await copyArticleShareLink();
    btn.textContent = ok ? t(lang, 'article.shareCopied') : t(lang, 'article.shareError');
    resetTimer = setTimeout(resetLabel, 2000);
  });

  window.addEventListener('banal:language-changed', resetLabel);
}

function wireArticleLangToggle(): void {
  const btn = document.getElementById('article-lang-toggle');
  if (!btn) return;

  const refreshLabel = () => {
    const lang = getCurrentLang();
    btn.textContent = lang === 'en' ? 'JA' : 'EN';
    btn.setAttribute('aria-label', t(lang, 'lang.toggle'));
  };

  refreshLabel();
  btn.addEventListener('click', () => {
    const next = getCurrentLang() === 'en' ? 'ja' : 'en';
    setLang(next);
    applyTranslations(next);
    refreshLabel();
  });

  window.addEventListener('banal:language-changed', refreshLabel);
}

initI18n();
wireArticleShareButton();
wireArticleLangToggle();
