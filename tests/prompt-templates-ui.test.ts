/**
 * Tests for redesigned prompt template UI — Horizontal Scroller
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderPromptTemplatesStandalone } from '../src/prompt-templates-standalone';

describe('Prompt Templates — horizontal scroller UI behavior', () => {
  let container: HTMLElement;
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
    vi.useFakeTimers();
  });

  afterEach(() => {
    document.body.removeChild(container);
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  function setup() {
    renderPromptTemplatesStandalone({ container, lang: 'en' });
    return container;
  }

  // ─── Horizontal scroll layout ───────────────────────────────────────────────

  it('container gets pt-horizontal-shell class for horizontal layout', () => {
    const el = setup();
    expect(el.classList.contains('pt-horizontal-shell')).toBe(true);
  });

  it('renders horizontal scroll container for prompt cards', () => {
    const el = setup();
    const scrollContainer = el.querySelector('.prompts-horizontal-scroll');
    expect(scrollContainer).toBeTruthy();
  });

  it('renders horizontal prompt cards instead of sidebar layout', () => {
    const el = setup();
    const cards = Array.from(el.querySelectorAll('.prompt-card-horizontal'));
    expect(cards.length).toBe(9); // 9 templates total
  });

  // ─── Quick filters instead of category rail ─────────────────────────────────

  it('renders quick filter chips row with 6 categories', () => {
    const el = setup();
    const filtersRow = el.querySelector('.quick-filters-row');
    expect(filtersRow).toBeTruthy();
    const chips = filtersRow!.querySelectorAll('.quick-filter-chip');
    expect(chips.length).toBe(6);
  });

  it('clicking a filter chip filters the prompt cards', () => {
    const el = setup();
    const chips = Array.from(el.querySelectorAll('.quick-filter-chip')) as HTMLElement[];
    
    // Click on "Career & Money" filter
    const careerChip = chips.find(c => c.textContent?.includes('Career'));
    expect(careerChip).toBeTruthy();
    careerChip!.click();

    // Should show fewer cards (only career-money templates)
    const scrollContainer = el.querySelector('.prompts-horizontal-scroll');
    const cards = scrollContainer!.querySelectorAll('.prompt-card-horizontal');
    expect(cards.length).toBeLessThan(9);
  });

  // ─── Modal overlay for forms ───────────────────────────────────────────────

  it('clicking a horizontal prompt card opens modal overlay', () => {
    const el = setup();
    const card = el.querySelector('.prompt-card-horizontal') as HTMLElement;
    expect(card).toBeTruthy();

    card.click();

    const modal = document.querySelector('.pt-modal-overlay') as HTMLElement;
    expect(modal).toBeTruthy();
    expect(modal.getAttribute('aria-modal')).toBe('true');
  });

  it('modal contains form fields for prompts with variables', () => {
    const el = setup();
    const card = el.querySelector('.prompt-card-horizontal') as HTMLElement;
    
    card.click();

    const modal = document.querySelector('.pt-modal-overlay') as HTMLElement;
    expect(modal!.querySelector('.sp-inline-form')).toBeTruthy();
    expect(modal!.querySelector('.sp-form-field')).toBeTruthy();
  });

  it('clicking close button closes modal', () => {
    const el = setup();
    const card = el.querySelector('.prompt-card-horizontal') as HTMLElement;
    card.click();

    const closeBtn = document.querySelector('.sp-modal-close') as HTMLButtonElement;
    closeBtn.click();

    // Allow for any async operations
    vi.advanceTimersByTime(100);
    
    expect(document.querySelector('.pt-modal-overlay')).toBeNull();
  });

  it('Escape key closes modal', () => {
    const el = setup();
    const card = el.querySelector('.prompt-card-horizontal') as HTMLElement;
    card.click();

    const modal = document.querySelector('.pt-modal-overlay') as HTMLElement;
    expect(modal).toBeTruthy();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    vi.advanceTimersByTime(100);

    expect(document.querySelector('.pt-modal-overlay')).toBeNull();
  });

  // ─── Card click handlers ─────────────────────────────────────────────────────

  it('horizontal prompt card has proper accessibility attributes', () => {
    const el = setup();
    const card = el.querySelector('.prompt-card-horizontal') as HTMLElement;

    expect(card.tabIndex).toBe(0);
    expect(card.getAttribute('role')).toBe('button');
    expect(card.getAttribute('aria-label')).toContain('template');
  });

  it('opens modal via keyboard Enter key', () => {
    const el = setup();
    const card = el.querySelector('.prompt-card-horizontal') as HTMLElement;

    card.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(document.querySelector('.pt-modal-overlay')).not.toBeNull();
  });

  // ─── Fill & Copy button ─────────────────────────────────────────────────────

  it('clicking Fill & Copy button opens modal without errors', () => {
    const el = setup();
    const fillBtn = el.querySelector('.prompt-card-actions button') as HTMLButtonElement;
    expect(fillBtn).toBeTruthy();
    expect(fillBtn.textContent).toContain('Fill & Copy');

    fillBtn.click();

    expect(document.querySelector('.pt-modal-overlay')).not.toBeNull();
  });

  it('modal copy button copies to clipboard using toast notification', async () => {
    const el = setup();
    const card = el.querySelector('.prompt-card-horizontal') as HTMLElement;
    card.click();

    const copyBtn = document.querySelector('.sp-btn-primary') as HTMLButtonElement;
    expect(copyBtn).toBeTruthy();

    copyBtn.click();

    // Wait for async clipboard write and toast to be created
    await vi.runAllTimersAsync();

    expect((navigator as any).clipboard.writeText).toHaveBeenCalled();
  });

  // ─── Language change ─────────────────────────────────────────────────────────

  it('re-renders correctly when language changes', () => {
    const el = setup();
    const chipsEN = el.querySelectorAll('.quick-filter-chip');
    expect(chipsEN.length).toBe(6);

    // Simulate language change event
    const event = new CustomEvent('banal:language-changed', { detail: { lang: 'ja' } });
    window.dispatchEvent(event);

    // Should still have 6 chips but with Japanese labels
    const chipsJA = el.querySelectorAll('.quick-filter-chip');
    expect(chipsJA.length).toBe(6);
  });
});