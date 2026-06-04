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
import { initChat } from './chat';
import { initDirectory } from './directory';
import { ParticleSystem } from './lib/particle-system';
import { CipherMenu } from './components/cipher-menu';
import { renderPlayground } from './api-playground';

// Boot i18n first (lang switcher + data-i18n + events for dynamic parts)
initI18n();

// Atmosphere: ghost particles in the background (skips if reduced motion)
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
}

// Wire the real functional chat (uses providers + superpowers + exports + beautiful UX)
initChat();

// Initialize the main Zero-Key tools directory and categories quick-nav
initDirectory();

// API Playground — try free APIs directly in the browser
const playgroundRoot = document.getElementById('api-playground-root');
if (playgroundRoot) {
  renderPlayground({
    lang: document.documentElement.lang?.startsWith('ja') ? 'ja' : 'en',
    container: playgroundRoot,
  });
}

// Extremely small core — everything else lives in focused, tested modules.
// This keeps the project forkable by anyone on a library computer.

// Cipher Rotary Menu — sci-fi cockpit navigation
const cipherRoot = document.getElementById('cipher-menu-root');
if (cipherRoot) {
  const cipherNav = new CipherMenu({
    items: [
      { id: 'tools', label: 'Tools', icon: '⚡', href: '#tools', color: 'rgba(168,85,247,0.7)' },
      { id: 'playground', label: 'APIs', icon: '◈', href: '#playground', color: 'rgba(34,211,238,0.7)' },
      { id: 'chat', label: 'Chat', icon: '◉', href: '#chat', color: 'rgba(245,158,11,0.7)' },
      { id: 'articles', label: 'Articles', icon: '▣', href: '#articles', color: 'rgba(217,70,239,0.7)' },
      { id: 'about', label: 'About', icon: '◎', href: '#about', color: 'rgba(255,255,255,0.7)' },
    ],
    subItems: [],
    size: 220,
  });
  cipherNav.mount(cipherRoot);
}
