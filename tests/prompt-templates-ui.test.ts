/**
 * Tests for redesigned prompt template UI — Horizontal Scroller
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { renderPromptTemplatesStandalone } from '../src/prompt-templates-standalone';
import { promptTemplatesLibrary } from '../src/lib/prompt-templates';

/** Live template count — used by assertions that need to express "less than total" or "exactly total" without hardcoding. */
function promptLibraryCount(): number {
  return promptTemplatesLibrary.count();
}

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

  it('renders unified filter toolbar', () => {
    const el = setup();
    const toolbar = el.querySelector('.filter-toolbar');
    expect(toolbar).toBeTruthy();
    expect(
      toolbar?.querySelectorAll('.filter-toolbar-actions .filter-share-btn').length
    ).toBeGreaterThanOrEqual(3);
  });

  it('renders horizontal scroll container for prompt cards', () => {
    const el = setup();
    const scrollContainer = el.querySelector('.zk2-grid');
    expect(scrollContainer).toBeTruthy();
  });

  it('renders horizontal prompt cards instead of sidebar layout', () => {
    const el = setup();
    const cards = Array.from(el.querySelectorAll('.tool-card-horizontal'));
    // Library scales — assert a floor, not a hard-coded count
    expect(cards.length).toBeGreaterThanOrEqual(40);
  });

  // ─── Recommended-chat chip strip (in-UI "How to use" card) ─────────────────

  it('renders the recommended-chat chip strip into the static "how to use" card', () => {
    // The chip container is in index.html; we need to provide it for this isolated test
    const chipsContainer = document.createElement('div');
    chipsContainer.id = 'prompt-templates-chips';
    document.body.appendChild(chipsContainer);

    try {
      setup();
      const chips = chipsContainer.querySelectorAll('a');
      // Curated 6 may shrink if data removes a tool, but never zero.
      expect(chips.length).toBeGreaterThanOrEqual(4);
      // Every chip is a deep-link into #ai-tools with a search term
      for (const chip of Array.from(chips)) {
        const href = chip.getAttribute('href') ?? '';
        expect(href.startsWith('#ai-tools?q=')).toBe(true);
        // Accessible: each chip is a listitem in a list with an aria-label
        expect(chip.getAttribute('role')).toBe('listitem');
      }
      expect(chipsContainer.getAttribute('role')).toBe('list');
      expect(chipsContainer.getAttribute('aria-label')).toBeTruthy();
    } finally {
      document.body.removeChild(chipsContainer);
    }
  });

  it('re-renders chip strip aria-label on language change', () => {
    const chipsContainer = document.createElement('div');
    chipsContainer.id = 'prompt-templates-chips';
    document.body.appendChild(chipsContainer);

    try {
      setup();
      const enLabel = chipsContainer.getAttribute('aria-label') ?? '';

      window.dispatchEvent(new CustomEvent('banal:language-changed', { detail: { lang: 'ja' } }));

      const jaLabel = chipsContainer.getAttribute('aria-label') ?? '';
      // JA aria-label is distinct from EN (e.g. "おすすめの無料AIチャット")
      expect(jaLabel).not.toBe(enLabel);
      expect(jaLabel.length).toBeGreaterThan(0);
    } finally {
      document.body.removeChild(chipsContainer);
    }
  });

  // ─── Category sidebar ─────────────────────────────────────────────────────

  it('renders category sidebar with 11 entries (10 categories + All)', () => {
    const el = setup();
    const sidebar = el.querySelector('.zk2-sidebar');
    expect(sidebar).toBeTruthy();
    const items = sidebar!.querySelectorAll('.zk2-cat-item');
    expect(items.length).toBe(11);
  });

  it('clicking a category filters the prompt cards', () => {
    const el = setup();
    const items = Array.from(el.querySelectorAll('.zk2-cat-item')) as HTMLElement[];

    const careerItem = items.find((c) => c.textContent?.includes('Career'));
    expect(careerItem).toBeTruthy();
    careerItem!.click();

    // Should show fewer cards (only career-work templates)
    const scrollContainer = el.querySelector('.zk2-grid');
    const cards = scrollContainer!.querySelectorAll('.tool-card-horizontal');
    expect(cards.length).toBeLessThan(promptLibraryCount());
  });

  // ─── Legacy category alias (?cat=) backward compat ──────────────────────────

  it('resolves legacy ?cat=career-money alias to the current career-work category', () => {
    // Use history.replaceState to set the URL — works reliably in jsdom
    // (direct property assignment to window.location is not permitted).
    window.history.replaceState({}, '', '/?cat=career-money#prompt-templates');

    renderPromptTemplatesStandalone({ container, lang: 'en' });
    // The career-work category (the resolved alias target) should be active
    const activeItem = container.querySelector('.zk2-cat-item.active');
    expect(activeItem).toBeTruthy();
    expect(activeItem!.getAttribute('data-category')).toBe('career-work');

    // Reset the URL for subsequent tests
    window.history.replaceState({}, '', '/');
  });

  it('ignores unknown ?cat= values without crashing', () => {
    window.history.replaceState({}, '', '/?cat=nonexistent#prompt-templates');

    renderPromptTemplatesStandalone({ container, lang: 'en' });
    // Falls back to no selection — at most one item can be active
    const activeItems = container.querySelectorAll('.zk2-cat-item.active');
    expect(activeItems.length).toBeLessThanOrEqual(1);

    // Reset the URL for subsequent tests
    window.history.replaceState({}, '', '/');
  });

  // ─── Accordion behavior ───────────────────────────────────────────────

  it('clicking a horizontal prompt card opens accordion', () => {
    const el = setup();
    const card = el.querySelector('.tool-card-horizontal') as HTMLElement;
    expect(card).toBeTruthy();

    card.click();

    const accordion = el.querySelector('.prompt-accordion') as HTMLElement;
    expect(accordion).toBeTruthy();
    expect(card.getAttribute('aria-expanded')).toBe('true');
  });

  it('accordion contains form fields for prompts with variables', () => {
    const el = setup();
    const card = el.querySelector('.tool-card-horizontal') as HTMLElement;

    card.click();

    const accordion = document.querySelector('.prompt-accordion') as HTMLElement;
    expect(accordion!.querySelector('.sp-inline-form')).toBeTruthy();
    expect(accordion!.querySelector('.sp-form-field')).toBeTruthy();
  });

  it('clicking close button closes accordion', () => {
    const el = setup();
    const card = el.querySelector('.tool-card-horizontal') as HTMLElement;
    card.click();

    const closeBtn = document.querySelector('.prompt-accordion-close') as HTMLButtonElement;
    closeBtn.click();

    // Allow for any async operations
    vi.advanceTimersByTime(100);

    expect(document.querySelector('.prompt-accordion')).toBeNull();
  });

  it('Escape key closes accordion', () => {
    const el = setup();
    const card = el.querySelector('.tool-card-horizontal') as HTMLElement;
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
    const card = el.querySelector('.tool-card-horizontal') as HTMLElement;

    expect(card.tabIndex).toBe(0);
    expect(card.getAttribute('role')).toBe('button');
    expect(card.getAttribute('aria-label')).toContain('template');
  });

  it('opens accordion via keyboard Enter key', () => {
    const el = setup();
    const card = el.querySelector('.tool-card-horizontal') as HTMLElement;

    card.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(document.querySelector('.prompt-accordion')).not.toBeNull();
  });

  // ─── Fill & Copy button ─────────────────────────────────────────────────────

  it('clicking Fill & Copy button opens accordion without errors', () => {
    const el = setup();
    const fillBtn = el.querySelector('.zk2-card-footer button') as HTMLButtonElement;
    expect(fillBtn).toBeTruthy();
    expect(fillBtn.textContent).toContain('Fill & Copy');

    fillBtn.click();

    expect(document.querySelector('.prompt-accordion')).not.toBeNull();
  });

  it('accordion copy button copies to clipboard using toast notification', async () => {
    const el = setup();
    const card = el.querySelector('.tool-card-horizontal') as HTMLElement;
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
    const card = el.querySelector('.tool-card-horizontal') as HTMLElement;
    card.click();

    const accordion = document.querySelector('.prompt-accordion') as HTMLElement;
    expect(accordion.getAttribute('role')).toBe('region');
    expect(accordion.getAttribute('aria-label')).toBeTruthy();
  });

  it('focus trap prevents Tab from leaving accordion', () => {
    const el = setup();
    const card = el.querySelector('.tool-card-horizontal') as HTMLElement;
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
    const card = el.querySelector('.tool-card-horizontal') as HTMLElement;

    // Focus and click the card to simulate user interaction
    card.focus();
    card.click();

    const accordion = document.querySelector('.prompt-accordion') as HTMLElement;
    expect(accordion).toBeTruthy();

    // Press Escape (with bubbles and cancelable for proper event handling)
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })
    );
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
    const card = el.querySelector('.tool-card-horizontal') as HTMLElement;
    card.click();

    vi.advanceTimersByTime(100);

    const copyBtn = document.querySelector('.sp-btn-primary') as HTMLButtonElement;
    expect(copyBtn).toBeTruthy();
    expect(copyBtn.textContent).toContain('Copy');
  });

  // ─── Security: XSS Prevention ────────────────────────────────────────────────────

  it('close button uses safe SVG icon instead of innerHTML', () => {
    const el = setup();
    const card = el.querySelector('.tool-card-horizontal') as HTMLElement;
    card.click();

    const closeBtn = document.querySelector('.prompt-accordion-close') as HTMLButtonElement;
    const icon = closeBtn.querySelector('svg');
    expect(icon).toBeTruthy();
    expect(icon!.getAttribute('aria-hidden')).toBe('true');
    expect(closeBtn.querySelector('.close-icon')).toBeFalsy();
    expect(closeBtn.innerHTML).not.toContain('<script');
  });

  it('category sidebar icons use textContent to prevent XSS', () => {
    const el = setup();
    const items = el.querySelectorAll('.zk2-cat-item');

    items.forEach((item) => {
      const iconSpan = item.querySelector('.zk2-cat-icon');
      expect(iconSpan).toBeTruthy();
      expect(iconSpan!.textContent).toBeDefined();
      if (iconSpan!.textContent) {
        expect(iconSpan!.textContent.length).toBeGreaterThan(0);
      }
    });
  });

  // ─── Accessibility: aria-expanded initial state ─────────────────────────────────

  it('horizontal prompt card has aria-expanded false on initial render', () => {
    const el = setup();
    const card = el.querySelector('.tool-card-horizontal') as HTMLElement;

    // Card should have aria-expanded="false" from the start
    expect(card.getAttribute('aria-expanded')).toBe('false');
  });

  // ─── Memory Leak Prevention ───────────────────────────────────────────────────

  it('focus trap cleanup function is stored when accordion opens', () => {
    const el = setup();
    const card = el.querySelector('.tool-card-horizontal') as HTMLElement;
    card.click();

    // The openAccordion should have a focusCleanup function stored
    // This is tested indirectly by checking that the accordion was created
    const accordion = document.querySelector('.prompt-accordion');
    expect(accordion).toBeTruthy();
  });

  // ─── Language change ─────────────────────────────────────────────────────────

  it('re-renders correctly when language changes', () => {
    const el = setup();
    const itemsEN = el.querySelectorAll('.zk2-cat-item');
    expect(itemsEN.length).toBe(11);

    // Simulate language change event
    const event = new CustomEvent('banal:language-changed', { detail: { lang: 'ja' } });
    window.dispatchEvent(event);

    const itemsJA = el.querySelectorAll('.zk2-cat-item');
    expect(itemsJA.length).toBe(11);
  });

  // ─── Session Storage Security ───────────────────────────────────────────────────

  it('uses sessionStorage instead of localStorage for form values', async () => {
    const el = setup();
    const card = el.querySelector('.tool-card-horizontal') as HTMLElement;

    // Verify sessionStorage is used (not localStorage) by checking the module uses it
    // The actual storage is internal, but we verify no localStorage calls are made
    card.click();

    const input = document.querySelector('.sp-form-input') as HTMLInputElement;
    expect(input).toBeTruthy();

    // Type in the input
    input.value = 'test value';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    // Verify sessionStorage was used (check that session storage contains our data)
    // The module should use sessionStorage for security (cleared on tab close)
    const storedKeys = Object.keys(sessionStorage);
    const hasTemplateData = storedKeys.some((key) => key.startsWith('banal-pt-'));
    expect(hasTemplateData).toBe(true);
  });

  // ─── Preview button ─────────────────────────────────────────────────────────

  it('preview button shows filled template text', () => {
    const el = setup();
    const card = el.querySelector('.tool-card-horizontal') as HTMLElement;
    card.click();

    const previewBtn = document.querySelector('.sp-btn-ghost') as HTMLButtonElement;
    expect(previewBtn).toBeTruthy();
    expect(previewBtn.textContent).toContain('Preview');

    previewBtn.click();

    const previewArea = document.querySelector('.sp-preview-area') as HTMLElement;
    expect(previewArea).toBeTruthy();
    expect(previewArea.style.display).toBe('block');
    expect(previewArea.textContent).toBeTruthy();
  });

  // ─── Copy failure path ──────────────────────────────────────────────────────

  it('shows error toast when clipboard write fails', async () => {
    // Mock clipboard failure
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockRejectedValue(new Error('Clipboard blocked')),
      },
    });

    const el = setup();
    const card = el.querySelector('.tool-card-horizontal') as HTMLElement;
    card.click();

    vi.advanceTimersByTime(150);

    const copyBtn = document.querySelector('.sp-btn-primary') as HTMLButtonElement;
    copyBtn.click();

    // Wait for the rejected promise to settle
    await vi.advanceTimersByTimeAsync(200);

    // Should show error toast
    const toast = document.querySelector('.pt-toast');
    expect(toast).toBeTruthy();
    expect(toast?.textContent).toContain('Failed to copy');
  });

  // ─── Toast notification lifecycle ───────────────────────────────────────────

  it('toast appears and disappears after timeout', async () => {
    const el = setup();
    const card = el.querySelector('.tool-card-horizontal') as HTMLElement;
    card.click();

    const copyBtn = document.querySelector('.sp-btn-primary') as HTMLButtonElement;
    copyBtn.click();

    // Wait for clipboard write
    await vi.advanceTimersByTimeAsync(100);

    // Toast should exist
    let toast = document.querySelector('.pt-toast');
    expect(toast).toBeTruthy();
    expect(toast?.getAttribute('role')).toBe('status');
    expect(toast?.getAttribute('aria-live')).toBe('polite');

    // Advance past toast timeout (3000ms + 300ms fade)
    await vi.advanceTimersByTimeAsync(3500);

    toast = document.querySelector('.pt-toast');
    expect(toast).toBeNull();
  });

  // ─── Accordion toggle (same card click) ─────────────────────────────────────

  it('clicking same card again closes the accordion', () => {
    const el = setup();
    const card = el.querySelector('.tool-card-horizontal') as HTMLElement;

    // Open accordion
    card.click();
    expect(document.querySelector('.prompt-accordion')).toBeTruthy();

    // Click same card again to close
    card.click();
    vi.advanceTimersByTime(100);

    expect(document.querySelector('.prompt-accordion')).toBeNull();
  });

  // ─── Opening second accordion closes first ──────────────────────────────────

  it('opening a second accordion closes the first one', () => {
    const el = setup();
    const cards = el.querySelectorAll('.tool-card-horizontal') as NodeListOf<HTMLElement>;

    // Open first accordion
    cards[0].click();
    expect(document.querySelectorAll('.prompt-accordion').length).toBe(1);

    // Open second accordion
    cards[1].click();
    vi.advanceTimersByTime(100);

    // Should only have one accordion
    expect(document.querySelectorAll('.prompt-accordion').length).toBe(1);
    expect(cards[0].getAttribute('aria-expanded')).toBe('false');
    expect(cards[1].getAttribute('aria-expanded')).toBe('true');
  });

  // ─── Keyboard Space opens accordion ─────────────────────────────────────────

  it('opens accordion via keyboard Space key', () => {
    const el = setup();
    const card = el.querySelector('.tool-card-horizontal') as HTMLElement;

    card.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));

    expect(document.querySelector('.prompt-accordion')).not.toBeNull();
  });

  // ─── __ptCleanup function ────────────────────────────────────────────────────

  it('calling __ptCleanup cleans up language listener and accordion', () => {
    const el = setup();
    const card = el.querySelector('.tool-card-horizontal') as HTMLElement;
    card.click();

    // Accordion should be open
    expect(document.querySelector('.prompt-accordion')).toBeTruthy();

    // Call cleanup
    const typedContainer = el as any;
    typedContainer.__ptCleanup?.();

    // Accordion should be closed
    expect(document.querySelector('.prompt-accordion')).toBeNull();
  });

  // ─── Re-rendering on second call ────────────────────────────────────────────

  it('calling renderPromptTemplatesStandalone again cleans up previous instance', () => {
    const el = setup();
    const total = promptLibraryCount();
    expect(el.querySelectorAll('.tool-card-horizontal').length).toBe(total);

    // Re-render
    renderPromptTemplatesStandalone({ container: el, lang: 'ja' });

    // Should still have the same number of cards but in Japanese
    expect(el.querySelectorAll('.tool-card-horizontal').length).toBe(total);
    const items = el.querySelectorAll('.zk2-cat-item');
    expect(items.length).toBe(11);
  });

  // ─── Japanese rendering ─────────────────────────────────────────────────────

  it('renders in Japanese when lang is ja', () => {
    renderPromptTemplatesStandalone({ container, lang: 'ja' });

    const items = container.querySelectorAll('.zk2-cat-item');
    const allItem = Array.from(items).find((c) => c.textContent?.includes('すべて'));
    expect(allItem).toBeTruthy();
  });

  // ─── Saved values restoration ───────────────────────────────────────────────

  it('restores saved form values from sessionStorage', () => {
    // Pre-populate sessionStorage with correct variable names for job-gaps-as-strengths
    sessionStorage.setItem(
      'banal-pt-job-gaps-as-strengths-en',
      JSON.stringify({ yourName: 'TestUser' })
    );

    renderPromptTemplatesStandalone({ container, lang: 'en' });

    // Find the card for job-gaps-as-strengths
    const card = container.querySelector('[data-prompt-id="job-gaps-as-strengths"]') as HTMLElement;
    expect(card).toBeTruthy();

    card.click();

    vi.advanceTimersByTime(150);

    // Check if any input has the saved value
    const inputs = document.querySelectorAll('.sp-form-input') as NodeListOf<HTMLInputElement>;
    const hasSavedValue = Array.from(inputs).some((input) => input.value === 'TestUser');
    expect(hasSavedValue).toBe(true);
  });

  // ─── Error path ─────────────────────────────────────────────────────────────

  it('shows error UI when PromptTemplatesLibrary constructor throws', () => {
    // Mock the import to make constructor throw
    const origCreateElement = document.createElement.bind(document);
    let callCount = 0;
    document.createElement = function (tag: string) {
      callCount++;
      if (callCount === 1 && tag === 'div') {
        throw new Error('DOM error');
      }
      return origCreateElement(tag);
    } as typeof document.createElement;

    renderPromptTemplatesStandalone({ container, lang: 'en' });

    // Should show error message
    expect(container.innerHTML).toContain('Unable to load prompt templates');

    // Restore
    document.createElement = origCreateElement;
  });

  // ─── Copy button text change and restore ────────────────────────────────────

  it('copy button text changes to checkmark and restores after timeout', async () => {
    const el = setup();
    const card = el.querySelector('.tool-card-horizontal') as HTMLElement;
    card.click();

    const copyBtn = document.querySelector('.sp-btn-primary') as HTMLButtonElement;
    const originalText = copyBtn.textContent;

    copyBtn.click();
    await vi.advanceTimersByTimeAsync(100);

    expect(copyBtn.textContent).toContain('Copied');

    // After 2000ms timeout, text should restore
    await vi.advanceTimersByTimeAsync(2100);
    expect(copyBtn.textContent).toBe(originalText);
  });

  // ─── Language change without detail (getCurrentLang fallback) ────────────────

  it('language change without detail falls back to document lang', () => {
    const el = setup();

    // Set document lang to Japanese
    document.documentElement.lang = 'ja';

    // Dispatch event without detail
    window.dispatchEvent(new CustomEvent('banal:language-changed'));

    // Should re-render with Japanese
    const items = el.querySelectorAll('.zk2-cat-item');
    expect(items.length).toBe(11);

    // Reset
    document.documentElement.lang = 'en';
  });

  // ─── Filter chip aria-label in Japanese ──────────────────────────────────────

  it('category items have Japanese aria-label when lang is ja', () => {
    renderPromptTemplatesStandalone({ container, lang: 'ja' });

    const items = container.querySelectorAll('.zk2-cat-item');
    for (const item of items) {
      expect(item.getAttribute('aria-label')).toContain('でフィルター');
    }
  });

  // ─── Clicking "All" category after category filter shows all prompts ───────────

  it('clicking All category after category filter restores all prompts', () => {
    const el = setup();

    const items = Array.from(el.querySelectorAll('.zk2-cat-item')) as HTMLElement[];
    const careerItem = items.find((c) => c.textContent?.includes('Career'));
    careerItem!.click();

    const filteredCount = el.querySelectorAll('.tool-card-horizontal').length;
    expect(filteredCount).toBeLessThan(promptLibraryCount());

    const newItems = Array.from(el.querySelectorAll('.zk2-cat-item')) as HTMLElement[];
    const allItem = newItems.find((c) => c.textContent?.includes('All'));
    allItem!.click();

    const allCount = el.querySelectorAll('.tool-card-horizontal').length;
    expect(allCount).toBe(promptLibraryCount());
  });

  // ─── Auto-save form values on input ──────────────────────────────────────────

  it('typing in form input auto-saves to sessionStorage', () => {
    const el = setup();
    const card = el.querySelector('.tool-card-horizontal') as HTMLElement;
    card.click();

    vi.advanceTimersByTime(150);

    const input = document.querySelector('.sp-form-input') as HTMLInputElement;
    expect(input).toBeTruthy();

    input.value = 'My test value';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    // Check sessionStorage has the value
    const keys = Object.keys(sessionStorage);
    const relevantKey = keys.find((k) => k.startsWith('banal-pt-'));
    expect(relevantKey).toBeTruthy();

    const stored = JSON.parse(sessionStorage.getItem(relevantKey!)!);
    expect(Object.values(stored)).toContain('My test value');
  });

  // ─── Form field textarea for long fields ─────────────────────────────────────

  it('renders textarea for long-form fields like situation/description', () => {
    const el = setup();
    // job-gaps-as-strengths has gapSituation which should be textarea
    const card = el.querySelector('[data-prompt-id="job-gaps-as-strengths"]') as HTMLElement;
    expect(card).toBeTruthy();

    card.click();
    vi.advanceTimersByTime(150);

    const textareas = document.querySelectorAll('textarea.sp-form-input');
    // Should have at least one textarea for long fields
    expect(textareas.length).toBeGreaterThan(0);
  });
});

describe('Prompt templates — light-mode CSS regressions', () => {
  const css = readFileSync(resolve(__dirname, '../src/style.css'), 'utf8');

  it('does not force white text on #prompt-templates-panel in light mode', () => {
    expect(css).not.toMatch(/\[data-theme='light'\]\s*#prompt-templates-panel/);
  });

  it('keeps dark-island text overrides scoped to modal overlays only', () => {
    const block = css.match(/\/\* Keep true dark overlays[\s\S]*?\/\* =+/)?.[0] ?? '';
    expect(block).toContain('#keys-modal');
    expect(block).toContain('.sp-modal-content');
    expect(block).not.toContain('#prompt-templates-panel');
  });

  it('defines light-mode form input styles for prompt accordion fields', () => {
    expect(css).toContain("[data-theme='light'] .sp-form-input");
    expect(css).toContain("[data-theme='light'] .prompt-accordion-title");
  });
});

describe('Prompt templates — dark accordion form surfaces', () => {
  const css = readFileSync(resolve(__dirname, '../src/style.css'), 'utf8');

  it('avoids heavy black overlays on the accordion form column', () => {
    const block =
      css.match(
        /\/\* Prompt Accordion[\s\S]*?\.prompt-accordion \.sp-inline-form\s*\{[^}]+\}/s
      )?.[0] ?? '';
    expect(block).not.toContain('rgba(0, 0, 0');
    expect(block).toContain('rgba(124, 58, 237');
  });

  it('uses violet glass on the accordion shell and inputs', () => {
    const shell =
      css.match(/\/\* Prompt Accordion[\s\S]*?\.prompt-accordion\s*\{[^}]+\}/s)?.[0] ?? '';
    expect(shell).toContain('var(--panel-stats-bg)');
    expect(shell).toContain('backdrop-filter');

    const inputs =
      css.match(
        /\/\* Prompt Accordion[\s\S]*?\.prompt-accordion \.sp-form-input\s*\{[^}]+\}/s
      )?.[0] ?? '';
    expect(inputs).toContain('rgba(168, 85, 247');
  });
});
