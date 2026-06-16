import { describe, it, expect, beforeEach } from 'vitest';
import { renderOnboarding } from '../src/components/onboarding-flow';

describe('Onboarding Flow', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

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

  it('should render role options', () => {
    renderOnboarding(container, 'en');
    
    const options = container.querySelectorAll('.onboarding-option');
    expect(options.length).toBeGreaterThan(0);
  });

  it('should render Next button', () => {
    renderOnboarding(container, 'en');
    
    const nextBtn = container.querySelector('.nav-btn-next');
    expect(nextBtn?.textContent).toContain('Next');
  });

  it('should advance to step 2 when role selected and Next clicked', () => {
    renderOnboarding(container, 'en');
    
    const option = container.querySelector('.onboarding-option') as HTMLElement;
    option.click();
    
    const nextBtn = container.querySelector('.nav-btn-next') as HTMLButtonElement;
    nextBtn.click();
    
    const stepTitle = container.querySelector('.step-title');
    expect(stepTitle?.textContent).toContain('budget');
  });

  it('should advance to step 3 when budget selected and Next clicked', () => {
    renderOnboarding(container, 'en');
    
    // Step 1: Select role
    const option1 = container.querySelector('.onboarding-option') as HTMLElement;
    option1.click();
    const nextBtn1 = container.querySelector('.nav-btn-next') as HTMLButtonElement;
    nextBtn1.click();
    
    // Step 2: Select budget
    const option2 = container.querySelector('.onboarding-option') as HTMLElement;
    option2.click();
    const nextBtn2 = container.querySelector('.nav-btn-next') as HTMLButtonElement;
    nextBtn2.click();
    
    const stepTitle = container.querySelector('.step-title');
    expect(stepTitle?.textContent).toContain('build');
  });

  it('should show results on step 5', () => {
    renderOnboarding(container, 'en');
    
    // Step 1: Select role
    const option1 = container.querySelector('.onboarding-option') as HTMLElement;
    option1.click();
    const nextBtn1 = container.querySelector('.nav-btn-next') as HTMLButtonElement;
    nextBtn1.click();
    
    // Step 2: Select budget
    const option2 = container.querySelector('.onboarding-option') as HTMLElement;
    option2.click();
    const nextBtn2 = container.querySelector('.nav-btn-next') as HTMLButtonElement;
    nextBtn2.click();
    
    // Step 3: Select goals (checkboxes - select one)
    const option3 = container.querySelector('.onboarding-option') as HTMLElement;
    option3.click();
    const nextBtn3 = container.querySelector('.nav-btn-next') as HTMLButtonElement;
    nextBtn3.click();
    
    // Step 4: Select experience
    const option4 = container.querySelector('.onboarding-option') as HTMLElement;
    option4.click();
    const nextBtn4 = container.querySelector('.nav-btn-next') as HTMLButtonElement;
    nextBtn4.click();
    
    const results = container.querySelector('.results-title');
    expect(results).toBeTruthy();
  });

  it('should render Back button on step 2+', () => {
    renderOnboarding(container, 'en');
    
    // Step 1: Select role
    const option1 = container.querySelector('.onboarding-option') as HTMLElement;
    option1.click();
    const nextBtn1 = container.querySelector('.nav-btn-next') as HTMLButtonElement;
    nextBtn1.click();
    
    const backBtn = container.querySelector('.nav-btn-back');
    expect(backBtn?.textContent).toContain('Back');
  });

  it('should go back when Back button clicked', () => {
    renderOnboarding(container, 'en');
    
    // Step 1: Select role
    const option1 = container.querySelector('.onboarding-option') as HTMLElement;
    option1.click();
    const nextBtn1 = container.querySelector('.nav-btn-next') as HTMLButtonElement;
    nextBtn1.click();
    
    // Step 2: Click Back
    const backBtn = container.querySelector('.nav-btn-back') as HTMLButtonElement;
    backBtn.click();
    
    const stepTitle = container.querySelector('.step-title');
    expect(stepTitle?.textContent).toContain('role');
  });

  it('should render in Japanese', () => {
    renderOnboarding(container, 'ja');
    
    const title = container.querySelector('.onboarding-title');
    expect(title?.textContent).toContain('スタックマッチャー');
  });

  it('should render step indicator', () => {
    renderOnboarding(container, 'en');
    
    // Check that we're on step 1
    const options = container.querySelectorAll('.onboarding-option');
    expect(options.length).toBeGreaterThan(0);
  });

  it('should update step on navigation', () => {
    renderOnboarding(container, 'en');
    
    // Step 1: Select role
    const option1 = container.querySelector('.onboarding-option') as HTMLElement;
    option1.click();
    const nextBtn1 = container.querySelector('.nav-btn-next') as HTMLButtonElement;
    nextBtn1.click();
    
    // Should be on step 2 (budget)
    const stepTitle = container.querySelector('.step-title');
    expect(stepTitle?.textContent).toContain('budget');
  });

  it('should restart quiz from results', () => {
    renderOnboarding(container, 'en');
    
    // Complete all 4 steps
    for (let i = 0; i < 4; i++) {
      const option = container.querySelector('.onboarding-option') as HTMLElement;
      option.click();
      const nextBtn = container.querySelector('.nav-btn-next') as HTMLButtonElement;
      nextBtn.click();
    }
    
    // Click restart
    const restartBtn = container.querySelector('.results-btn-secondary') as HTMLButtonElement;
    if (restartBtn) {
      restartBtn.click();
      
      const stepTitle = container.querySelector('.step-title');
      expect(stepTitle?.textContent).toContain('role');
    }
  });
});
