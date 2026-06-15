/**
 * Onboarding Flow — Interactive quiz to help new users find the right tools.
 * Asks about role, budget, goals, and experience level to recommend personalized stacks.
 */

import type { Lang } from '../i18n';
import { toolStacks } from '../data/tool-stacks';
import type { ToolStack, StackAudience, StackBudget, StackExperience } from '../types/tool';

// ─── Copy ───────────────────────────────────────────────────────────────────

const COPY = {
  en: {
    welcome: 'Welcome to Banal AI Tools (beta)',
    findPerfectTools: "Let's find the perfect tools for you",
    step1Title: "What's your role?",
    step2Title: "What's your budget?",
    step3Title: 'What do you want to build?',
    step4Title: "What's your experience level?",
    freelancer: 'Freelancer',
    indieHacker: 'Indie Hacker',
    student: 'Student',
    jobSeeker: 'Job Seeker',
    developer: 'Developer',
    other: 'Other',
    zeroBudget: '$0 (Zero budget)',
    lowBudget: '$1-50/month (Low budget)',
    mediumBudget: '$50-200/month (Medium budget)',
    highBudget: '$200+/month (High budget)',
    webApp: 'Web application',
    mobileApp: 'Mobile app',
    aiTool: 'AI-powered tool',
    content: 'Content (blog, video, podcast)',
    designPortfolio: 'Design portfolio',
    beginner: 'Beginner (new to coding/AI)',
    intermediate: 'Intermediate (some experience)',
    advanced: 'Advanced (experienced developer)',
    next: 'Next',
    back: 'Back',
    finish: 'Finish',
    yourRecommendations: 'Your Personalized Recommendations',
    basedOnAnswers: 'Based on your answers, we recommend:',
    viewStack: 'View Stack',
    browseAllTools: 'Browse All Tools',
    takeQuizAgain: 'Take Quiz Again',
  },
  ja: {
    welcome: 'Banal AIツールへようこそ（ベータ）',
    findPerfectTools: 'あなたにぴったりのツールを見つけましょう',
    step1Title: 'あなたの役割は？',
    step2Title: '予算は？',
    step3Title: '何を構築したいですか？',
    step4Title: '経験レベルは？',
    freelancer: 'フリーランサー',
    indieHacker: 'インディーハッカー',
    student: '学生',
    jobSeeker: '求職者',
    developer: '開発者',
    other: 'その他',
    zeroBudget: '$0（予算ゼロ）',
    lowBudget: '$1-50/月（低予算）',
    mediumBudget: '$50-200/月（中予算）',
    highBudget: '$200+/月（高予算）',
    webApp: 'Webアプリケーション',
    mobileApp: 'モバイルアプリ',
    aiTool: 'AI搭載ツール',
    content: 'コンテンツ（ブログ、動画、ポッドキャスト）',
    designPortfolio: 'デザインポートフォリオ',
    beginner: '初心者（コーディング/AI未経験）',
    intermediate: '中級者（多少の経験あり）',
    advanced: '上級者（経験豊富な開発者）',
    next: '次へ',
    back: '戻る',
    finish: '完了',
    yourRecommendations: 'あなたへのおすすめ',
    basedOnAnswers: 'あなたの回答に基づいて、以下をおすすめします：',
    viewStack: 'スタックを見る',
    browseAllTools: '全ツールを見る',
    takeQuizAgain: 'もう一度クイズをする',
  },
} satisfies Record<Lang, Record<string, string>>;

// ─── State ──────────────────────────────────────────────────────────────────

interface OnboardingState {
  lang: Lang;
  currentStep: number;
  answers: {
    role?: StackAudience;
    budget?: StackBudget;
    goals?: string[];
    experience?: StackExperience;
  };
  container: HTMLElement | null;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function create<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (className) el.className = className;
  return el;
}

// ─── Render: Onboarding Flow ────────────────────────────────────────────────

export function renderOnboarding(
  container: HTMLElement,
  lang: Lang
): void {
  const state: OnboardingState = {
    lang,
    currentStep: 1,
    answers: {},
    container,
  };

  renderStep(state);
}

function renderStep(state: OnboardingState): void {
  const container = state.container;
  if (!container) return;

  container.innerHTML = '';
  container.className = 'onboarding-flow';

  const copy = COPY[state.lang];

  // Header
  const header = create('div', 'onboarding-header');
  const title = create('h2', 'onboarding-title');
  title.textContent = copy.welcome;
  header.appendChild(title);
  const subtitle = create('p', 'onboarding-subtitle');
  subtitle.textContent = copy.findPerfectTools;
  header.appendChild(subtitle);
  container.appendChild(header);

  // Step content
  const stepContent = create('div', 'onboarding-step-content');
  
  switch (state.currentStep) {
    case 1:
      renderStep1(stepContent, state, copy);
      break;
    case 2:
      renderStep2(stepContent, state, copy);
      break;
    case 3:
      renderStep3(stepContent, state, copy);
      break;
    case 4:
      renderStep4(stepContent, state, copy);
      break;
    case 5:
      renderResults(stepContent, state, copy);
      break;
  }

  container.appendChild(stepContent);
}

function renderStep1(
  container: HTMLElement,
  state: OnboardingState,
  copy: typeof COPY.en
): void {
  const title = create('h3', 'step-title');
  title.textContent = copy.step1Title;
  container.appendChild(title);

  const options = create('div', 'onboarding-options');
  const roles: Array<{ value: StackAudience; label: string }> = [
    { value: 'freelancer', label: copy.freelancer },
    { value: 'indie-hacker', label: copy.indieHacker },
    { value: 'student', label: copy.student },
    { value: 'job-seeker', label: copy.jobSeeker },
    { value: 'developer', label: copy.developer },
  ];

  for (const role of roles) {
    const option = createOption(role.label, state.answers.role === role.value);
    option.addEventListener('click', () => {
      state.answers.role = role.value;
      renderStep(state);
    });
    options.appendChild(option);
  }

  container.appendChild(options);
  renderNavigation(container, state, copy);
}

function renderStep2(
  container: HTMLElement,
  state: OnboardingState,
  copy: typeof COPY.en
): void {
  const title = create('h3', 'step-title');
  title.textContent = copy.step2Title;
  container.appendChild(title);

  const options = create('div', 'onboarding-options');
  const budgets: Array<{ value: StackBudget; label: string }> = [
    { value: 'zero', label: copy.zeroBudget },
    { value: 'low', label: copy.lowBudget },
    { value: 'medium', label: copy.mediumBudget },
    { value: 'high', label: copy.highBudget },
  ];

  for (const budget of budgets) {
    const option = createOption(budget.label, state.answers.budget === budget.value);
    option.addEventListener('click', () => {
      state.answers.budget = budget.value;
      renderStep(state);
    });
    options.appendChild(option);
  }

  container.appendChild(options);
  renderNavigation(container, state, copy);
}

function renderStep3(
  container: HTMLElement,
  state: OnboardingState,
  copy: typeof COPY.en
): void {
  const title = create('h3', 'step-title');
  title.textContent = copy.step3Title;
  container.appendChild(title);

  const options = create('div', 'onboarding-options');
  const goals = [
    { value: 'web', label: copy.webApp },
    { value: 'mobile', label: copy.mobileApp },
    { value: 'ai', label: copy.aiTool },
    { value: 'content', label: copy.content },
    { value: 'design', label: copy.designPortfolio },
  ];

  for (const goal of goals) {
    const isSelected = state.answers.goals?.includes(goal.value) || false;
    const option = createOption(goal.label, isSelected);
    option.addEventListener('click', () => {
      if (!state.answers.goals) state.answers.goals = [];
      if (isSelected) {
        state.answers.goals = state.answers.goals.filter(g => g !== goal.value);
      } else {
        state.answers.goals.push(goal.value);
      }
      renderStep(state);
    });
    options.appendChild(option);
  }

  container.appendChild(options);
  renderNavigation(container, state, copy);
}

function renderStep4(
  container: HTMLElement,
  state: OnboardingState,
  copy: typeof COPY.en
): void {
  const title = create('h3', 'step-title');
  title.textContent = copy.step4Title;
  container.appendChild(title);

  const options = create('div', 'onboarding-options');
  const experiences: Array<{ value: StackExperience; label: string }> = [
    { value: 'beginner', label: copy.beginner },
    { value: 'intermediate', label: copy.intermediate },
    { value: 'advanced', label: copy.advanced },
  ];

  for (const exp of experiences) {
    const option = createOption(exp.label, state.answers.experience === exp.value);
    option.addEventListener('click', () => {
      state.answers.experience = exp.value;
      renderStep(state);
    });
    options.appendChild(option);
  }

  container.appendChild(options);
  renderNavigation(container, state, copy);
}

function renderResults(
  container: HTMLElement,
  state: OnboardingState,
  copy: typeof COPY.en
): void {
  const title = create('h3', 'results-title');
  title.textContent = copy.yourRecommendations;
  container.appendChild(title);

  const subtitle = create('p', 'results-subtitle');
  subtitle.textContent = copy.basedOnAnswers;
  container.appendChild(subtitle);

  // Find matching stacks
  const matchingStacks = findMatchingStacks(state.answers);

  const stacksList = create('div', 'recommended-stacks');
  for (const stack of matchingStacks.slice(0, 3)) {
    const stackCard = create('div', 'recommended-stack-card');
    const stackName = create('h4', 'stack-name');
    stackName.textContent = stack.name;
    stackCard.appendChild(stackName);
    const stackDesc = create('p', 'stack-description');
    stackDesc.textContent = stack.description;
    stackCard.appendChild(stackDesc);
    const viewBtn = create('button', 'stack-view-btn');
    viewBtn.textContent = copy.viewStack;
    stackCard.appendChild(viewBtn);
    stacksList.appendChild(stackCard);
  }

  container.appendChild(stacksList);

  // Actions
  const actions = create('div', 'results-actions');
  const browseBtn = create('button', 'results-btn');
  browseBtn.textContent = copy.browseAllTools;
  actions.appendChild(browseBtn);
  const retryBtn = create('button', 'results-btn results-btn-secondary');
  retryBtn.textContent = copy.takeQuizAgain;
  retryBtn.addEventListener('click', () => {
    state.currentStep = 1;
    state.answers = {};
    renderStep(state);
  });
  actions.appendChild(retryBtn);
  container.appendChild(actions);
}

function renderNavigation(
  container: HTMLElement,
  state: OnboardingState,
  copy: typeof COPY.en
): void {
  const nav = create('div', 'onboarding-navigation');
  
  if (state.currentStep > 1) {
    const backBtn = create('button', 'nav-btn nav-btn-back');
    backBtn.textContent = copy.back;
    backBtn.addEventListener('click', () => {
      state.currentStep--;
      renderStep(state);
    });
    nav.appendChild(backBtn);
  }

  const nextBtn = create('button', 'nav-btn nav-btn-next');
  nextBtn.textContent = state.currentStep === 4 ? copy.finish : copy.next;
  nextBtn.addEventListener('click', () => {
    state.currentStep++;
    renderStep(state);
  });
  nav.appendChild(nextBtn);

  container.appendChild(nav);
}

function createOption(label: string, isSelected: boolean): HTMLElement {
  const option = create('div', `onboarding-option ${isSelected ? 'selected' : ''}`);
  option.textContent = label;
  return option;
}

function findMatchingStacks(answers: OnboardingState['answers']): ToolStack[] {
  // Score each stack by how many criteria match, then sort best-first.
  // This ensures we always return results even when no exact match exists.
  const scored = toolStacks.map(stack => {
    let score = 0;
    let totalCriteria = 0;
    if (answers.role) {
      totalCriteria++;
      if (stack.audience.type === answers.role) score++;
    }
    if (answers.budget) {
      totalCriteria++;
      if (stack.audience.budget === answers.budget) score++;
    }
    if (answers.experience) {
      totalCriteria++;
      if (stack.audience.experience === answers.experience) score++;
    }
    return { stack, score, totalCriteria };
  });

  // Sort by score descending; ties broken by original order
  scored.sort((a, b) => b.score - a.score);

  // Return stacks that match at least one criterion (or all if no criteria given)
  const minScore = 1;
  return scored
    .filter(s => s.totalCriteria === 0 || s.score >= minScore)
    .map(s => s.stack);
}
