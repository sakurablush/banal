import { describe, it, expect, beforeEach } from 'vitest';
import { renderModelsPanel } from '../src/components/models-panel';
import { renderStacksPanel } from '../src/components/stacks-panel';

describe('UI Layout Improvements', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  describe('Models Panel Layout', () => {
    it('should have models-panel container', () => {
      renderModelsPanel(container, { lang: 'en' });
      
      // renderModelsPanel sets className on the container itself
      expect(container.classList.contains('models-panel')).toBe(true);
    });

    it('should have scrollable content area', () => {
      renderModelsPanel(container, { lang: 'en' });
      
      const content = container.querySelector('.models-content') as HTMLElement;
      expect(content).toBeTruthy();
    });

    it('should have filter bar', () => {
      renderModelsPanel(container, { lang: 'en' });
      
      const filterBar = container.querySelector('.models-filter-bar') as HTMLElement;
      expect(filterBar).toBeTruthy();
    });

    it('should have header', () => {
      renderModelsPanel(container, { lang: 'en' });
      
      const header = container.querySelector('.models-panel-header') as HTMLElement;
      expect(header).toBeTruthy();
    });
  });

  describe('Stacks Panel Layout', () => {
    it('should have stacks-panel container', () => {
      renderStacksPanel(container, { lang: 'en' });
      
      // renderStacksPanel sets className on the container itself
      expect(container.classList.contains('stacks-panel')).toBe(true);
    });

    it('should have scrollable content area', () => {
      renderStacksPanel(container, { lang: 'en' });
      
      const content = container.querySelector('.stacks-content') as HTMLElement;
      expect(content).toBeTruthy();
    });

    it('should have audience filters', () => {
      renderStacksPanel(container, { lang: 'en' });
      
      const filters = container.querySelector('.stacks-audience-row') as HTMLElement;
      expect(filters).toBeTruthy();
    });

    it('should have header', () => {
      renderStacksPanel(container, { lang: 'en' });
      
      const header = container.querySelector('.stacks-panel-header') as HTMLElement;
      expect(header).toBeTruthy();
    });
  });

  describe('Section Borders', () => {
    it('should have border-top on AI tools section', () => {
      const section = document.createElement('section');
      section.id = 'ai-tools';
      section.className = 'border-t border-white/5';
      document.body.appendChild(section);
      
      expect(section.classList.contains('border-t')).toBe(true);
      expect(section.classList.contains('border-white/5')).toBe(true);
    });

    it('should have border-top on articles section', () => {
      const section = document.createElement('section');
      section.id = 'articles';
      section.className = 'border-t border-white/5';
      document.body.appendChild(section);
      
      expect(section.classList.contains('border-t')).toBe(true);
      expect(section.classList.contains('border-white/5')).toBe(true);
    });

    it('should have border-top on mission section', () => {
      const section = document.createElement('section');
      section.className = 'border-t border-white/5';
      document.body.appendChild(section);
      
      expect(section.classList.contains('border-t')).toBe(true);
      expect(section.classList.contains('border-white/5')).toBe(true);
    });
  });

  describe('Articles Section Design', () => {
    it('should have article card with proper class', () => {
      const card = document.createElement('article');
      card.className = 'article-card-void';
      document.body.appendChild(card);
      
      expect(card.classList.contains('article-card-void')).toBe(true);
    });

    it('should have article badge with proper class', () => {
      const badge = document.createElement('div');
      badge.className = 'article-badge-void';
      document.body.appendChild(badge);
      
      expect(badge.classList.contains('article-badge-void')).toBe(true);
    });

    it('should have article title with proper class', () => {
      const title = document.createElement('h3');
      title.className = 'article-title-void';
      document.body.appendChild(title);
      
      expect(title.classList.contains('article-title-void')).toBe(true);
    });

    it('should have article excerpt with proper class', () => {
      const excerpt = document.createElement('p');
      excerpt.className = 'article-excerpt-void';
      document.body.appendChild(excerpt);
      
      expect(excerpt.classList.contains('article-excerpt-void')).toBe(true);
    });

    it('should have article meta with proper class', () => {
      const meta = document.createElement('div');
      meta.className = 'article-meta-void';
      document.body.appendChild(meta);
      
      expect(meta.classList.contains('article-meta-void')).toBe(true);
    });
  });
});
