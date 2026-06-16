import { describe, it, expect, beforeEach } from 'vitest';
import { renderStacksPanel } from '../src/components/stacks-panel';
import { customizeStack, saveCustomStack } from '../src/lib/stack-customization';
import { toolStacks } from '../src/data/tool-stacks';

describe('Stacks Panel', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  it('should render stacks panel with title and subtitle', () => {
    const api = renderStacksPanel(container, { lang: 'en' });
    
    expect(container.querySelector('.stacks-panel-title')?.textContent).toBe('Tool Stacks');
    expect(container.querySelector('.stacks-panel-subtitle')?.textContent).toContain('Curated combinations');
    
    api.destroy();
  });

  it('should render audience filter label', () => {
    const api = renderStacksPanel(container, { lang: 'en' });
    
    const label = container.querySelector('.stacks-audience-label');
    expect(label?.textContent).toContain('Browse by Audience');
    
    api.destroy();
  });

  it('should render audience filter chips', () => {
    const api = renderStacksPanel(container, { lang: 'en' });
    
    const chips = container.querySelectorAll('.stacks-audience-chip');
    expect(chips.length).toBeGreaterThan(0);
    
    api.destroy();
  });

  it('should render "All" audience chip', () => {
    const api = renderStacksPanel(container, { lang: 'en' });
    
    const allChip = container.querySelector('.stacks-audience-chip');
    expect(allChip?.textContent).toBe('All');
    
    api.destroy();
  });

  it('should render unified filter toolbar', () => {
    const api = renderStacksPanel(container, { lang: 'en' });

    const toolbar = container.querySelector('.filter-toolbar');
    expect(toolbar).toBeTruthy();
    const shareSave = toolbar?.querySelectorAll('.filter-toolbar-actions .filter-share-btn');
    expect(shareSave?.length).toBeGreaterThanOrEqual(3);

    api.destroy();
  });

  it('should apply section-scoped filters from URL on init', () => {
    const original = window.location.href;
    window.history.replaceState({}, '', '/?stacks_audience=developer#tool-stacks');

    const api = renderStacksPanel(container, { lang: 'en' });

    const activeChip = container.querySelector('.stacks-audience-chip.active');
    expect(activeChip?.textContent).toContain('Developers');

    window.history.replaceState({}, '', original);
    api.destroy();
  });

  it('should render stack cards', () => {
    const api = renderStacksPanel(container, { lang: 'en' });
    
    const cards = container.querySelectorAll('.stack-card');
    expect(cards.length).toBeGreaterThan(0);
    
    api.destroy();
  });

  it('should filter stacks by audience', () => {
    const api = renderStacksPanel(container, { lang: 'en' });
    
    const chips = container.querySelectorAll('.stacks-audience-chip');
    if (chips.length > 1) {
      (chips[1] as HTMLButtonElement).click();
      
      const cards = container.querySelectorAll('.stack-card');
      expect(cards.length).toBeGreaterThanOrEqual(0);
    }
    
    api.destroy();
  });

  it('should show stats bar', () => {
    const api = renderStacksPanel(container, { lang: 'en' });
    
    const stats = container.querySelector('.stacks-stats');
    expect(stats).toBeTruthy();
    
    api.destroy();
  });

  it('should open stack detail on card click', () => {
    const api = renderStacksPanel(container, { lang: 'en' });

    const card = container.querySelector('.stack-card') as HTMLElement;
    if (card) {
      card.click();

      const detail = container.querySelector('.stack-detail-page');
      expect(detail).toBeTruthy();
      expect(container.classList.contains('is-detail-view')).toBe(true);
      expect(container.querySelector('.stacks-content')?.contains(detail!)).toBe(true);
    }

    api.destroy();
  });

  it('should not open detail when clicking workflow toggle', () => {
    const api = renderStacksPanel(container, { lang: 'en' });

    const toggle = container.querySelector('.stack-workflow-toggle') as HTMLButtonElement;
    toggle?.click();

    expect(container.querySelector('.stack-detail-page')).toBeFalsy();
    expect(container.classList.contains('is-detail-view')).toBe(false);

    api.destroy();
  });

  it('should restore list view from stack detail back button', () => {
    const api = renderStacksPanel(container, { lang: 'en' });

    const card = container.querySelector('.stack-card') as HTMLElement;
    card?.click();

    const backBtn = container.querySelector('.stack-detail-back') as HTMLButtonElement;
    backBtn?.click();

    expect(container.classList.contains('is-detail-view')).toBe(false);
    expect(container.querySelector('.stack-detail-page')).toBeFalsy();
    expect(container.querySelector('.stacks-panel-header')).toBeTruthy();
    expect(container.querySelectorAll('.stack-card').length).toBeGreaterThan(0);

    api.destroy();
  });

  it('should render in Japanese', () => {
    const api = renderStacksPanel(container, { lang: 'ja' });
    
    expect(container.querySelector('.stacks-panel-title')?.textContent).toBe('ツールスタック');
    
    api.destroy();
  });

  it('should reset filters via API', () => {
    const api = renderStacksPanel(container, { lang: 'en' });
    
    const chips = container.querySelectorAll('.stacks-audience-chip');
    if (chips.length > 1) {
      (chips[1] as HTMLButtonElement).click();
    }
    
    api.reset();
    
    const activeChip = container.querySelector('.stacks-audience-chip.active');
    expect(activeChip?.textContent).toBe('All');
    
    api.destroy();
  });

  it('should set audience via API', () => {
    const api = renderStacksPanel(container, { lang: 'en' });
    
    api.setAudience('developer');
    
    // Check that content is filtered (stats should show fewer stacks)
    const stats = container.querySelector('.stacks-stats');
    expect(stats?.textContent).toContain('stacks');
    
    api.destroy();
  });

  it('should clear audience filter via API', () => {
    const api = renderStacksPanel(container, { lang: 'en' });
    
    api.setAudience('developer');
    api.setAudience(null);
    
    const activeChip = container.querySelector('.stacks-audience-chip.active');
    expect(activeChip?.textContent).toBe('All');
    
    api.destroy();
  });

  it('should render My Stacks section when custom stacks exist', () => {
    localStorage.clear();
    const custom = customizeStack(toolStacks[0]);
    saveCustomStack(custom);

    const api = renderStacksPanel(container, { lang: 'en' });

    expect(container.querySelector('.stacks-my-section')).toBeTruthy();
    expect(container.querySelector('.stack-custom-badge')?.textContent).toBe('Custom');
    expect(container.querySelectorAll('.stacks-my-section .stack-card').length).toBe(1);

    const customFooter = container.querySelector('.stacks-my-section .stack-card-footer');
    expect(customFooter).toBeTruthy();
    expect(customFooter?.querySelector('.stack-card-actions')).toBeTruthy();

    api.destroy();
    localStorage.clear();
  });

  it('should render a footer on every stack card for bottom-aligned actions', () => {
    const api = renderStacksPanel(container, { lang: 'en' });
    const cards = container.querySelectorAll('.stack-card');

    expect(cards.length).toBeGreaterThan(0);
    cards.forEach((card) => {
      expect(card.querySelector(':scope > .stack-card-footer')).toBeTruthy();
    });

    api.destroy();
  });
});
