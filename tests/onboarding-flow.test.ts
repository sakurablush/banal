import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  isOnboardingStepComplete,
  renderOnboarding,
} from '../src/components/onboarding-flow';

describe('isOnboardingStepComplete', () => {
  it('requires an answer on each quiz step before advancing', () => {
    expect(isOnboardingStepComplete(1, {})).toBe(false);
    expect(isOnboardingStepComplete(1, { role: 'student' })).toBe(true);

    expect(isOnboardingStepComplete(2, { role: 'student' })).toBe(false);
    expect(isOnboardingStepComplete(2, { role: 'student', budget: 'zero' })).toBe(true);

    expect(isOnboardingStepComplete(3, { budget: 'zero' })).toBe(false);
    expect(isOnboardingStepComplete(3, { goals: ['web'] })).toBe(true);
    expect(isOnboardingStepComplete(3, { goals: [] })).toBe(false);

    expect(isOnboardingStepComplete(4, { goals: ['web'] })).toBe(false);
    expect(isOnboardingStepComplete(4, { goals: ['web'], experience: 'beginner' })).toBe(true);
  });
});

describe('Onboarding Flow', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  function getNext(): HTMLButtonElement {
    return container.querySelector('.nav-btn-next') as HTMLButtonElement;
  }

  function getOptions(): HTMLElement[] {
    return [...container.querySelectorAll('.onboarding-option')] as HTMLElement[];
  }

  function selectFirstOption(): void {
    getOptions()[0]?.click();
  }

  function advanceStep(): void {
    selectFirstOption();
    getNext().click();
  }

  it('should render onboarding with title', () => {
    renderOnboarding(container, 'en');

    const title = container.querySelector('.onboarding-title');
    expect(title?.textContent).toContain('Stack matcher');
  });

  it('should render subtitle', () => {
    renderOnboarding(container, 'en');

    const subtitle = container.querySelector('.onboarding-subtitle');
    expect(subtitle?.textContent).toContain('Stack recommendations');
  });

  it('should render step 1 (role selection)', () => {
    renderOnboarding(container, 'en');

    const stepTitle = container.querySelector('.step-title');
    expect(stepTitle?.textContent).toContain('role');
  });

  it('should render role options as keyboard-focusable buttons', () => {
    renderOnboarding(container, 'en');

    const options = getOptions();
    expect(options.length).toBe(4);
    for (const option of options) {
      expect(option.getAttribute('role')).toBe('button');
      expect(option.getAttribute('aria-pressed')).toBe('false');
      expect(option.tabIndex).toBe(0);
    }
  });

  it('should center option labels with flex layout in CSS', () => {
    const css = readFileSync(join(process.cwd(), 'src/style.css'), 'utf8');
    const blocks = [...css.matchAll(/\.onboarding-option\s*\{[^}]+\}/gs)].map((match) => match[0]);
    const mainBlock = blocks.find((block) => block.includes('display: flex'));
    expect(mainBlock).toBeTruthy();
    expect(mainBlock).toContain('align-items: center');
    expect(mainBlock).toContain('justify-content: center');
  });

  it('should render Next button', () => {
    renderOnboarding(container, 'en');

    expect(getNext().textContent).toContain('Next');
    expect(getNext().type).toBe('button');
  });

  it('should disable Next until the current step has an answer', () => {
    renderOnboarding(container, 'en');

    expect(getNext().disabled).toBe(true);

    selectFirstOption();
    expect(getNext().disabled).toBe(false);
  });

  it('should keep Next disabled on step 2 until budget is selected', () => {
    renderOnboarding(container, 'en');
    advanceStep();

    expect(container.querySelector('.step-title')?.textContent).toContain('budget');
    expect(getNext().disabled).toBe(true);

    selectFirstOption();
    expect(getNext().disabled).toBe(false);
  });

  it('should disable Next on step 3 when all goals are deselected', () => {
    renderOnboarding(container, 'en');
    advanceStep();
    advanceStep();

    expect(container.querySelector('.step-title')?.textContent).toContain('build');
    selectFirstOption();
    expect(getNext().disabled).toBe(false);

    selectFirstOption();
    expect(getNext().disabled).toBe(true);
  });

  it('should show Finish label on step 4 when experience is selected', () => {
    renderOnboarding(container, 'en');
    advanceStep();
    advanceStep();
    advanceStep();

    expect(getNext().textContent).toBe('Finish');
    expect(getNext().disabled).toBe(true);

    selectFirstOption();
    expect(getNext().disabled).toBe(false);
  });

  it('should advance to step 2 when role selected and Next clicked', () => {
    renderOnboarding(container, 'en');
    advanceStep();

    expect(container.querySelector('.step-title')?.textContent).toContain('budget');
  });

  it('should advance to step 3 when budget selected and Next clicked', () => {
    renderOnboarding(container, 'en');
    advanceStep();
    advanceStep();

    expect(container.querySelector('.step-title')?.textContent).toContain('build');
  });

  it('should show results on step 5', () => {
    renderOnboarding(container, 'en');

    for (let i = 0; i < 4; i++) {
      advanceStep();
    }

    expect(container.querySelector('.results-title')).toBeTruthy();
  });

  it('should render Back button on step 2+', () => {
    renderOnboarding(container, 'en');
    advanceStep();

    expect(container.querySelector('.nav-btn-back')?.textContent).toContain('Back');
  });

  it('should go back when Back button clicked', () => {
    renderOnboarding(container, 'en');
    advanceStep();

    (container.querySelector('.nav-btn-back') as HTMLButtonElement).click();

    expect(container.querySelector('.step-title')?.textContent).toContain('role');
  });

  it('should keep Next enabled when returning to a step that already has an answer', () => {
    renderOnboarding(container, 'en');
    advanceStep();
    (container.querySelector('.nav-btn-back') as HTMLButtonElement).click();

    expect(getNext().disabled).toBe(false);
  });

  it('should render in Japanese', () => {
    renderOnboarding(container, 'ja');

    expect(container.querySelector('.onboarding-title')?.textContent).toContain(
      'スタックマッチャー'
    );
  });

  it('should activate options with Enter key', () => {
    renderOnboarding(container, 'en');

    getOptions()[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(getNext().disabled).toBe(false);
    expect(getOptions()[0].classList.contains('selected')).toBe(true);
    expect(getOptions()[0].getAttribute('aria-pressed')).toBe('true');
  });

  it('should restart quiz from results and disable Next again', () => {
    renderOnboarding(container, 'en');

    for (let i = 0; i < 4; i++) {
      advanceStep();
    }

    const restartBtn = container.querySelector('.results-btn-secondary') as HTMLButtonElement;
    restartBtn.click();

    expect(container.querySelector('.step-title')?.textContent).toContain('role');
    expect(getNext().disabled).toBe(true);
  });
});
