import { describe, it, expect, beforeEach } from 'vitest';
import { renderModelsPanel } from '../src/components/models-panel';

describe('Models Panel', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  it('should render models panel with title and subtitle', () => {
    const api = renderModelsPanel(container, { lang: 'en' });
    
    expect(container.querySelector('.models-panel-title')?.textContent).toBe('AI Models Directory');
    expect(container.querySelector('.models-panel-subtitle')?.textContent).toContain('Discover the best open-source LLMs');
    
    api.destroy();
  });

  it('should render filter bar with search input', () => {
    const api = renderModelsPanel(container, { lang: 'en' });
    
    const searchInput = container.querySelector('.models-search-input') as HTMLInputElement;
    expect(searchInput).toBeTruthy();
    expect(searchInput.placeholder).toContain('Search models');
    
    api.destroy();
  });

  it('should render family filter dropdown', () => {
    const api = renderModelsPanel(container, { lang: 'en' });
    
    const familySelect = container.querySelector('.models-filter-select') as HTMLSelectElement;
    expect(familySelect).toBeTruthy();
    
    api.destroy();
  });

  it('should render use case filter dropdown', () => {
    const api = renderModelsPanel(container, { lang: 'en' });
    
    const selects = container.querySelectorAll('.models-filter-select');
    expect(selects.length).toBeGreaterThanOrEqual(2);
    
    api.destroy();
  });

  it('should render license filter dropdown', () => {
    const api = renderModelsPanel(container, { lang: 'en' });
    
    const selects = container.querySelectorAll('.models-filter-select');
    expect(selects.length).toBeGreaterThanOrEqual(3);
    
    api.destroy();
  });

  it('should render quick filter chips', () => {
    const api = renderModelsPanel(container, { lang: 'en' });
    
    const chips = container.querySelectorAll('.models-quick-chip');
    expect(chips.length).toBeGreaterThan(0);
    
    api.destroy();
  });

  it('should render filter action buttons', () => {
    const api = renderModelsPanel(container, { lang: 'en' });
    
    const actionBtns = container.querySelectorAll('.models-filter-btn');
    expect(actionBtns.length).toBe(2); // Share + Save
    
    api.destroy();
  });

  it('should render model cards', () => {
    const api = renderModelsPanel(container, { lang: 'en' });
    
    const cards = container.querySelectorAll('.model-card');
    expect(cards.length).toBeGreaterThan(0);
    
    api.destroy();
  });

  it('should filter models by search query', () => {
    const api = renderModelsPanel(container, { lang: 'en' });
    
    const searchInput = container.querySelector('.models-search-input') as HTMLInputElement;
    searchInput.value = 'DeepSeek';
    searchInput.dispatchEvent(new Event('input'));
    
    const cards = container.querySelectorAll('.model-card');
    expect(cards.length).toBeGreaterThan(0);
    
    api.destroy();
  });

  it('should filter models by family', () => {
    const api = renderModelsPanel(container, { lang: 'en' });
    
    const familySelect = container.querySelector('.models-filter-select') as HTMLSelectElement;
    familySelect.value = 'Llama';
    familySelect.dispatchEvent(new Event('change'));
    
    const cards = container.querySelectorAll('.model-card');
    expect(cards.length).toBeGreaterThan(0);
    
    api.destroy();
  });

  it('should filter models by use case', () => {
    const api = renderModelsPanel(container, { lang: 'en' });
    
    const chip = container.querySelector('.models-quick-chip') as HTMLButtonElement;
    chip.click();
    
    const cards = container.querySelectorAll('.model-card');
    expect(cards.length).toBeGreaterThan(0);
    
    api.destroy();
  });

  it('should render comparison view when 2+ models selected', () => {
    const api = renderModelsPanel(container, { lang: 'en' });
    
    const checkboxes = container.querySelectorAll('.model-compare-check input[type="checkbox"]');
    if (checkboxes.length >= 2) {
      (checkboxes[0] as HTMLInputElement).checked = true;
      checkboxes[0].dispatchEvent(new Event('change'));
      (checkboxes[1] as HTMLInputElement).checked = true;
      checkboxes[1].dispatchEvent(new Event('change'));
      
      const comparison = container.querySelector('.models-comparison');
      expect(comparison).toBeTruthy();
    }
    
    api.destroy();
  });

  it('should open model detail on card click', () => {
    const api = renderModelsPanel(container, { lang: 'en' });
    
    const card = container.querySelector('.model-card') as HTMLElement;
    if (card) {
      card.click();
      
      const detail = container.querySelector('.model-detail-page');
      expect(detail).toBeTruthy();
    }
    
    api.destroy();
  });

  it('should render in Japanese', () => {
    const api = renderModelsPanel(container, { lang: 'ja' });
    
    expect(container.querySelector('.models-panel-title')?.textContent).toBe('AIモデルディレクトリ');
    
    api.destroy();
  });

  it('should reset filters via API', () => {
    const api = renderModelsPanel(container, { lang: 'en' });
    
    api.search('DeepSeek');
    
    const cardsBefore = container.querySelectorAll('.model-card').length;
    
    api.reset();
    
    const cardsAfter = container.querySelectorAll('.model-card').length;
    expect(cardsAfter).toBeGreaterThan(cardsBefore);
    
    api.destroy();
  });

  it('should search via API', () => {
    const api = renderModelsPanel(container, { lang: 'en' });
    
    api.search('Qwen');
    
    const cards = container.querySelectorAll('.model-card');
    expect(cards.length).toBeGreaterThan(0);
    
    api.destroy();
  });
});
