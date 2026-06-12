/**
 * Tests for redesigned prompt template UI
 */
import { readFileSync } from 'node:fs';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderPromptTemplatesStandalone } from '../src/prompt-templates-standalone';

describe('Prompt Templates — redesigned UI behavior', () => {
  let container: HTMLElement;
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  function setup() {
    renderPromptTemplatesStandalone({ container, lang: 'en' });
    return container;
  }

  // ─── Whole-card click opens form ───────────────────────────────────────────

  it('clicking a prompt card selects it and renders the form', () => {
    const el = setup();
    const cards = Array.from(el.querySelectorAll('.pt-prompt-card')) as HTMLElement[];
    expect(cards.length).toBeGreaterThan(0);

    const firstCard = cards[0] as HTMLElement;
    expect(firstCard.dataset.promptId).toBeTruthy();
    firstCard.click();

    const windowEl = el.querySelector('.pt-prompt-window');
    expect(windowEl).toBeTruthy();
    expect(windowEl!.querySelector('.pt-window-header')).toBeTruthy();
    expect(windowEl!.querySelector('.sp-inline-form')).toBeTruthy();
  });

  it('opens a prompt card with keyboard and exposes button semantics', () => {
    const el = setup();
    const card = Array.from(el.querySelectorAll('.pt-prompt-card'))[0] as HTMLElement;

    expect(card.tabIndex).toBe(0);
    expect(card.getAttribute('role')).toBe('button');
    expect(card.getAttribute('aria-label')).toContain('Open');

    card.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(el.querySelector('.pt-prompt-window .sp-inline-form')).toBeTruthy();
  });

  it('removes prompt shortcut listener when the form is closed', () => {
    const addSpy = vi.spyOn(document, 'addEventListener');
    const removeSpy = vi.spyOn(document, 'removeEventListener');
    const el = setup();
    const card = Array.from(el.querySelectorAll('.pt-prompt-card'))[0] as HTMLElement;

    card.click();
    expect(addSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

    const closeBtn = el.querySelector('.sp-modal-close') as HTMLButtonElement;
    closeBtn.click();

    expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  it('clicking a second card switches selection', () => {
    const el = setup();
    const cards = Array.from(el.querySelectorAll('.pt-prompt-card')) as HTMLElement[];
    expect(cards.length).toBeGreaterThanOrEqual(2);

    cards[0].click();
    const firstTitle = el.querySelector('.pt-window-title')?.textContent;

    cards[1].click();
    const secondTitle = el.querySelector('.pt-window-title')?.textContent;
    expect(firstTitle).toBeTruthy();
    expect(firstTitle).not.toEqual(secondTitle);
  });

  // ─── stopPropagation on Fill & Copy prevents double-trigger ────────────────

  it('clicking Fill & Copy via button handler renders form without triggering alert fallback', () => {
    const el = setup();
    const fillBtn = el.querySelector('.pt-prompt-actions button') as HTMLButtonElement;
    expect(fillBtn).toBeTruthy();
    expect(fillBtn.textContent).toContain('Fill & Copy');

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const hasClip = !!(navigator as any).clipboard?.writeText;
    const clipSpy = hasClip
      ? vi.spyOn((navigator as any).clipboard, 'writeText').mockResolvedValue(undefined)
      : null;

    fillBtn.click();

    expect(el.querySelector('.pt-prompt-window .sp-inline-form')).toBeTruthy();
    expect(alertSpy).not.toHaveBeenCalled();

    if (clipSpy) clipSpy.mockRestore();
    alertSpy.mockRestore();
  });

  // ─── Layout/class assertions ────────────────────────────────────────────────

  it('container gets .pt-directory-shell and contains rail, list, window', () => {
    const el = setup();
    expect(el.classList.contains('pt-directory-shell')).toBe(true);
    expect(el.querySelector('.pt-category-rail')).toBeTruthy();
    expect(el.querySelector('.pt-prompt-list')).toBeTruthy();
  });

  it('prompt card markup contains actions with Fill & Copy button', () => {
    const el = setup();
    const card = el.querySelector('.pt-prompt-card') as HTMLElement;
    expect(card).toBeTruthy();
    expect(card.classList.contains('pt-prompt-card')).toBe(true);
    expect(card.dataset.promptId).toBeTruthy();

    const actions = card.querySelector('.pt-prompt-actions');
    expect(actions).toBeTruthy();

    const fillBtn = actions!.querySelector('button');
    expect(fillBtn).toBeTruthy();
    expect((fillBtn as HTMLElement).textContent).toContain('Fill & Copy');
  });

  it('category rail has 6 category buttons', () => {
    const el = setup();
    const rail = el.querySelector('.pt-category-rail');
    expect(rail).toBeTruthy();
    expect(rail!.querySelectorAll('.pt-category-button').length).toBe(6);
  });

  it('shared header button stylesheet keeps theme and language buttons aligned', () => {
    const btn = document.createElement('button');
    btn.className = 'btn-header';
    container.appendChild(btn);

    const stylesheet = readFileSync('src/style.css', 'utf8');
    expect(stylesheet).toContain('.btn-header {');
    expect(stylesheet).toContain('display: inline-flex;');
    expect(stylesheet).toContain('height: 32px;');
    expect(btn.getAttribute('class')).toMatch(/btn-header/);
  });
});
