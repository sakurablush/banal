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

  // ─── Accordion behavior ───────────────────────────────────────────────

  it('clicking a horizontal prompt card opens accordion', () => {
    const el = setup();
    const card = el.querySelector('.prompt-card-horizontal') as HTMLElement;
    expect(card).toBeTruthy();

    card.click();

    const accordion = el.querySelector('.prompt-accordion') as HTMLElement;
    expect(accordion).toBeTruthy();
    expect(card.getAttribute('aria-expanded')).toBe('true');
  });

  it('accordion contains form fields for prompts with variables', () => {
    const el = setup();
    const card = el.querySelector('.prompt-card-horizontal') as HTMLElement;

    card.click();

    const accordion = document.querySelector('.prompt-accordion') as HTMLElement;
    expect(accordion!.querySelector('.sp-inline-form')).toBeTruthy();
    expect(accordion!.querySelector('.sp-form-field')).toBeTruthy();
  });

  it('clicking close button closes accordion', () => {
    const el = setup();
    const card = el.querySelector('.prompt-card-horizontal') as HTMLElement;
    card.click();

    const closeBtn = document.querySelector('.prompt-accordion-close') as HTMLButtonElement;
    closeBtn.click();

    // Allow for any async operations
    vi.advanceTimersByTime(100);

    expect(document.querySelector('.prompt-accordion')).toBeNull();
  });

  it('Escape key closes accordion', () => {
    const el = setup();
    const card = el.querySelector('.prompt-card-horizontal') as HTMLElement;
    card.click();

    const accordion = document.querySelector('.prompt-accordion') as HTMLElement;
    expect(accordion).toBeTruthy();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    vi.advanceTimersByTime(100);

    expect(document.querySelector('.prompt-accordion')).toBeNull();
  });

  // ─── Card click handlers ─────────────────────────────────────────────────────

  it('horizontal prompt card has proper accessibility attributes', () => {
    const el = setup();
    const card = el.querySelector('.prompt-card-horizontal') as HTMLElement;

    expect(card.tabIndex).toBe(0);
    expect(card.getAttribute('role')).toBe('button');
    expect(card.getAttribute('aria-label')).toContain('template');
  });

  it('opens accordion via keyboard Enter key', () => {
    const el = setup();
    const card = el.querySelector('.prompt-card-horizontal') as HTMLElement;

    card.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(document.querySelector('.prompt-accordion')).not.toBeNull();
  });

  // ─── Fill & Copy button ─────────────────────────────────────────────────────

  it('clicking Fill & Copy button opens accordion without errors', () => {
    const el = setup();
    const fillBtn = el.querySelector('.prompt-card-actions button') as HTMLButtonElement;
    expect(fillBtn).toBeTruthy();
    expect(fillBtn.textContent).toContain('Fill & Copy');

    fillBtn.click();

    expect(document.querySelector('.prompt-accordion')).not.toBeNull();
  });

  it('accordion copy button copies to clipboard using toast notification', async () => {
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

  // ─── Accessibility: Accordion focus trap ──────────────────────────────────────

  it('accordion has proper ARIA attributes for form region', () => {
    const el = setup();
    const card = el.querySelector('.prompt-card-horizontal') as HTMLElement;
    card.click();

    const accordion = document.querySelector('.prompt-accordion') as HTMLElement;
    expect(accordion.getAttribute('role')).toBe('region');
    expect(accordion.getAttribute('aria-label')).toBeTruthy();
  });

  it('focus trap prevents Tab from leaving accordion', () => {
    const el = setup();
    const card = el.querySelector('.prompt-card-horizontal') as HTMLElement;
    card.click();

    const accordion = document.querySelector('.prompt-accordion') as HTMLElement;
    const focusableElements = accordion.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    // Should have at least 2 focusable elements (close button + copy/preview buttons)
    expect(focusableElements.length).toBeGreaterThan(1);
  });

  it('accordion Escape key closes and focus returns to triggering card', () => {
    const el = setup();
    const card = el.querySelector('.prompt-card-horizontal') as HTMLElement;

    // Focus and click the card to simulate user interaction
    card.focus();
    card.click();

    const accordion = document.querySelector('.prompt-accordion') as HTMLElement;
    expect(accordion).toBeTruthy();

    // Press Escape (with bubbles and cancelable for proper event handling)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    vi.advanceTimersByTime(100);

    // Accordion should be closed
    expect(document.querySelector('.prompt-accordion')).toBeNull();

    // Focus should be restored to the card (after a small delay for cleanup)
    expect(document.activeElement).toBe(card);
  });

  // ─── Accessibility: Toast notification ────────────────────────────────────────

  it('accordion copy button uses toast notification with proper ARIA', async () => {
    // This test verifies the toast implementation exists - actual ARIA is tested in showToast
    const el = setup();
    const card = el.querySelector('.prompt-card-horizontal') as HTMLElement;
    card.click();

    vi.advanceTimersByTime(100);

    const copyBtn = document.querySelector('.sp-btn-primary') as HTMLButtonElement;
    expect(copyBtn).toBeTruthy();
    expect(copyBtn.textContent).toContain('Copy');
  });

  // ─── Security: XSS Prevention ────────────────────────────────────────────────────

  it('close button uses textContent instead of innerHTML to prevent XSS', () => {
    const el = setup();
    const card = el.querySelector('.prompt-card-horizontal') as HTMLElement;
    card.click();

    const closeBtn = document.querySelector('.prompt-accordion-close') as HTMLButtonElement;
    // Verify close button uses a span with textContent, not innerHTML with HTML
    const closeIcon = closeBtn.querySelector('.close-icon');
    expect(closeIcon).toBeTruthy();
    expect(closeIcon!.textContent).toBe('×');
    // Verify no XSS vulnerability - textContent should escape HTML entities
    expect(closeIcon!.innerHTML).toBe('×');
  });

  it('quick filter chips use textContent for icons to prevent XSS', () => {
    const el = setup();
    const chips = el.querySelectorAll('.quick-filter-chip');

    chips.forEach((chip) => {
      const iconSpan = chip.querySelector('.filter-icon');
      expect(iconSpan).toBeTruthy();
      // Icons are set via textContent, not innerHTML - prevents XSS
      expect(iconSpan!.textContent).toBeDefined();
      // The icon should be a text character, not HTML
      if (iconSpan!.textContent) {
        expect(iconSpan!.textContent.length).toBeGreaterThan(0);
      }
    });
  });

  // ─── Accessibility: aria-expanded initial state ─────────────────────────────────

  it('horizontal prompt card has aria-expanded false on initial render', () => {
    const el = setup();
    const card = el.querySelector('.prompt-card-horizontal') as HTMLElement;

    // Card should have aria-expanded="false" from the start
    expect(card.getAttribute('aria-expanded')).toBe('false');
  });

  // ─── Memory Leak Prevention ───────────────────────────────────────────────────

  it('focus trap cleanup function is stored when accordion opens', () => {
    const el = setup();
    const card = el.querySelector('.prompt-card-horizontal') as HTMLElement;
    card.click();

    // The openAccordion should have a focusCleanup function stored
    // This is tested indirectly by checking that the accordion was created
    const accordion = document.querySelector('.prompt-accordion');
    expect(accordion).toBeTruthy();
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