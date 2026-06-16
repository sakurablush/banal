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
    expect(actionBtns.length).toBe(1);

    api.destroy();
  });

  it('should apply section-scoped filters from URL on init', () => {
    const original = window.location.href;
    window.history.replaceState({}, '', '/?models_useCase=multilingual&models_family=Llama#ai-models');

    const api = renderModelsPanel(container, { lang: 'en' });

    const familySelect = container.querySelector('.models-filter-select') as HTMLSelectElement;
    const useCaseSelect = container.querySelectorAll('.models-filter-select')[1] as HTMLSelectElement;
    expect(familySelect.value).toBe('Llama');
    expect(useCaseSelect.value).toBe('multilingual');

    window.history.replaceState({}, '', original);
    api.destroy();
  });

  it('should ignore invalid URL filter values', () => {
    const original = window.location.href;
    window.history.replaceState({}, '', '/?models_useCase=not-a-real-use-case&models_family=Nope#ai-models');

    const api = renderModelsPanel(container, { lang: 'en' });

    const familySelect = container.querySelector('.models-filter-select') as HTMLSelectElement;
    const useCaseSelect = container.querySelectorAll('.models-filter-select')[1] as HTMLSelectElement;
    expect(familySelect.value).toBe('');
    expect(useCaseSelect.value).toBe('');

    window.history.replaceState({}, '', original);
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
      expect(container.classList.contains('is-detail-view')).toBe(true);
      expect(container.querySelector('.models-content')?.contains(detail!)).toBe(true);
    }

    api.destroy();
  });

  it('should restore list view from model detail back button', () => {
    const api = renderModelsPanel(container, { lang: 'en' });

    const card = container.querySelector('.model-card') as HTMLElement;
    card?.click();

    const backBtn = container.querySelector('.model-detail-back') as HTMLButtonElement;
    backBtn?.click();

    expect(container.classList.contains('is-detail-view')).toBe(false);
    expect(container.querySelector('.model-detail-page')).toBeFalsy();
    expect(container.querySelector('.models-panel-header')).toBeTruthy();
    expect(container.querySelectorAll('.model-card').length).toBeGreaterThan(0);

    api.destroy();
  });

  it('should exit detail view when reset via API', () => {
    const api = renderModelsPanel(container, { lang: 'en' });

    const card = container.querySelector('.model-card') as HTMLElement;
    card?.click();
    expect(container.classList.contains('is-detail-view')).toBe(true);

    api.reset();

    expect(container.classList.contains('is-detail-view')).toBe(false);
    expect(container.querySelector('.models-panel-header')).toBeTruthy();

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
