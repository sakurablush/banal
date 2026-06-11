/**
 * Article page entry — lightweight boot for standalone article pages.
 * Only initializes i18n and particles (no chat, no directory, no playground).
 */
import { initI18n } from './i18n';
import { ParticleSystem } from './lib/particle-system';

initI18n();

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const particles = new ParticleSystem({
    count: 60,
    colorPalette: [
      { r: 168, g: 85, b: 247, a: 0.3 },
      { r: 217, g: 70, b: 239, a: 0.2 },
      { r: 34, g: 211, b: 238, a: 0.15 },
      { r: 245, g: 158, b: 11, a: 0.15 },
      { r: 255, g: 255, b: 255, a: 0.15 },
    ],
  });
  particles.mount('.void-bg');
}
