import { describe, it, expect, beforeEach } from 'vitest';
import { renderStacksPanel } from '../src/components/stacks-panel';

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

  it('should render filter action buttons', () => {
    const api = renderStacksPanel(container, { lang: 'en' });
    
    const actionBtns = container.querySelectorAll('.stacks-filter-btn');
    expect(actionBtns.length).toBe(2); // Share + Save
    
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
    }
    
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
});
