/**
 * Banal main entry — the complete, wired, delightful experience.
 * Core + providers routing (100% tested) + superpowers (9 templates + JA) + real chat + Ghost Protocol.
 *
 * Deliberately two lines. The entire "app" is these two calls because:
 * - A human being with 3 minutes and a text editor on a public computer must be able to understand
 *   the whole control flow without opening an IDE or learning a framework.
 * - Every other capability is in its own file with its own tests and its own JSDoc explaining the "why".
 * This is the opposite of corporate "architecture astronaut" code. It is infrastructure that can be
 * read, understood, and forked by the very people it is meant to serve — the ghost in a million plain files.
 */
import { initI18n } from './i18n';
import { initDirectory } from './directory';
import { ParticleSystem } from './lib/particle-system';
import { renderPlayground } from './api-playground';
import { renderSuperpowersStandalone } from './superpowers-standalone';
import { initChatModal } from './chat-modal';
import { initFreeModels } from './free-models';
import { initQuickStart } from './quickstart';

// Boot i18n first (lang switcher + data-i18n + events for dynamic parts)
initI18n();

// Atmosphere: ghost particles in the background (skips if reduced motion)
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  try {
    const particles = new ParticleSystem({
      count: 100,
      colorPalette: [
        { r: 168, g: 85, b: 247, a: 0.4 },
        { r: 217, g: 70, b: 239, a: 0.3 },
        { r: 34, g: 211, b: 238, a: 0.25 },
        { r: 245, g: 158, b: 11, a: 0.2 },
        { r: 255, g: 255, b: 255, a: 0.2 },
      ],
    });
    particles.mount('.void-bg');
  } catch (error) {
    console.warn('Particle system failed to initialize:', error);
  }
}

// Wire the chat modal (chat UI is now in a modal, not a section)
try {
  initChatModal();
} catch (error) {
  console.error('Chat modal failed to initialize:', error);
}

// Initialize the main Zero-Key tools directory and categories quick-nav
try {
  initDirectory();
} catch (error) {
  console.error('Tools directory failed to initialize:', error);
}

// Free AI Models section
try {
  initFreeModels();
} catch (error) {
  console.error('Free models section failed to initialize:', error);
}

// Quick Start section (5 popular superpowers)
try {
  initQuickStart();
} catch (error) {
  console.error('Quick start section failed to initialize:', error);
}

// Superpowers standalone section
try {
  const superpowersRoot = document.getElementById('superpowers-root');
  if (superpowersRoot) {
    renderSuperpowersStandalone({
      container: superpowersRoot,
      lang: document.documentElement.lang?.startsWith('ja') ? 'ja' : 'en',
    });
  }
} catch (error) {
  console.error('Superpowers section failed to initialize:', error);
}

// API Playground — try free APIs directly in the browser
try {
  const playgroundRoot = document.getElementById('api-playground-root');
  if (playgroundRoot) {
    renderPlayground({
      lang: document.documentElement.lang?.startsWith('ja') ? 'ja' : 'en',
      container: playgroundRoot,
    });
  }
} catch (error) {
  console.error('API Playground failed to initialize:', error);
}

// Extremely small core — everything else lives in focused, tested modules.
// This keeps the project forkable by anyone on a library computer.
