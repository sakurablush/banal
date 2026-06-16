/**
 * Banal main entry — the complete, wired, delightful experience.
 * Core + providers routing (100% tested) + prompt templates (9 templates + JA) + real chat + Ghost Protocol.
 *
 * Deliberately two lines. The entire "app" is these two calls because:
 * - A human being with 3 minutes and a text editor on a public computer must be able to understand
 *   the whole control flow without opening an IDE or learning a framework.
 * - Every other capability is in its own file with its own tests and its own JSDoc explaining the "why".
 * This is the opposite of corporate "architecture astronaut" code. It is infrastructure that can be
 * read, understood, and forked by the very people it is meant to serve — the ghost in a million plain files.
 */
import { initI18n } from './i18n';
import { initTheme, setTheme } from './theme';
import { initDirectory } from './directory';
import { renderPromptTemplatesStandalone } from './prompt-templates-standalone';

// Boot theme first (before any rendering so CSS variables are correct)
initTheme();

// Wire theme toggle button (setTheme is already available via static import)
const themeToggleBtn = document.getElementById('theme-toggle');
if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
  });
}

// Boot i18n first (lang switcher + data-i18n + events for dynamic parts)
initI18n();

// Ambient background is pure CSS on .void-bg (no JS, no canvas)

// Initialize the main Zero-Key tools directory and categories quick-nav
try {
  initDirectory();
} catch (error) {
  console.error('Tools directory failed to initialize:', error);
}

// Prompt Templates standalone section
try {
  const promptTemplatesRoot = document.getElementById('prompt-templates-root');
  if (promptTemplatesRoot) {
    renderPromptTemplatesStandalone({
      container: promptTemplatesRoot,
      lang: document.documentElement.lang?.startsWith('ja') ? 'ja' : 'en',
    });
  }
} catch (error) {
  console.error('Prompt Templates section failed to initialize:', error);
}

// Footer: stamp the current year so the copyright line is never stale.
try {
  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
} catch {
  // Non-critical — leave the static fallback year in place if anything goes wrong.
}

// Extremely small core — everything else lives in focused, tested modules.
// This keeps the project forkable by anyone on a library computer.
