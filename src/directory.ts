import {
  renderZeroKeyPowerPanel,
  type ZeroKeyPanelApi,
  type ZeroKeyCategory,
} from './zero-key-panel';
import { getCurrentLang, t, type Lang } from './i18n';
import { zeroKeyTools } from './data/zero-key-tools';
import { getSiteStats } from './data/site-stats';
import type { ModelsPanelApi } from './components/models-panel';
import type { StacksPanelApi } from './components/stacks-panel';
import { whenIdle, whenVisible } from './lib/lazy-section';
import { ensureJaLocaleLoaded } from './lib/tool-localization';

/**
 * Initialize the main page Zero-Key Tools Directory.
 * Renders AI tools immediately; defers below-fold sections for faster first paint.
 */
export function initDirectory(): void {
  const aiRoot = document.getElementById('ai-tools-root');
  const devRoot = document.getElementById('dev-tools-root');
  const modelsRoot = document.getElementById('ai-models-root');
  const stacksRoot = document.getElementById('tool-stacks-root');
  const onboardingRoot = document.getElementById('onboarding-root');
  const guidesRoot = document.getElementById('guides-root');

  let aiPanelApi: ZeroKeyPanelApi | null = null;
  let devPanelApi: ZeroKeyPanelApi | null = null;

  const mounted = {
    dev: false,
    models: false,
    stacks: false,
    onboarding: false,
    guides: false,
  };

  const scheduled = {
    models: false,
    stacks: false,
    onboarding: false,
    guides: false,
  };

  let devSeq = 0;
  let modelsSeq = 0;
  let stacksSeq = 0;
  let onboardingSeq = 0;
  let guidesSeq = 0;

  async function prepareLocale(lang: Lang): Promise<void> {
    if (lang === 'ja') {
      await ensureJaLocaleLoaded();
    }
  }

  function renderAiToolsSync(lang: Lang): void {
    if (!aiRoot) return;
    try {
      aiPanelApi = renderZeroKeyPowerPanel(aiRoot, {
        lang,
        categoryPrefix: 'ai',
        onToolOpen: () => {},
      });
    } catch (error) {
      console.error('Failed to render AI tools directory:', error);
      aiRoot.innerHTML = renderPanelError(lang, t(lang, 'error.unableToLoadAiTools'), error);
      aiPanelApi = null;
    }
  }

  function renderDevToolsSync(lang: Lang): void {
    if (!devRoot) return;
    try {
      devPanelApi = renderZeroKeyPowerPanel(devRoot, {
        lang,
        categoryPrefix: 'dev',
        onToolOpen: () => {},
      });
      mounted.dev = true;
    } catch (error) {
      console.error('Failed to render developer tools directory:', error);
      devRoot.innerHTML = renderPanelError(lang, t(lang, 'error.unableToLoadDevTools'), error);
      devPanelApi = null;
    }
  }

  async function renderAiTools(lang: Lang): Promise<void> {
    await prepareLocale(lang);
    renderAiToolsSync(lang);
  }

  async function renderDevTools(lang: Lang): Promise<void> {
    const seq = ++devSeq;
    await prepareLocale(lang);
    if (seq !== devSeq) return;
    renderDevToolsSync(lang);
  }

  async function renderModelsSection(lang: Lang): Promise<void> {
    if (!modelsRoot) return;
    const seq = ++modelsSeq;
    try {
      const { renderModelsPanel } = await import('./components/models-panel');
      if (seq !== modelsSeq) return;
      renderModelsPanel(modelsRoot, { lang });
      mounted.models = true;
    } catch (error) {
      if (seq !== modelsSeq) return;
      console.error('Failed to render AI models section:', error);
      modelsRoot.innerHTML = `
        <div class="text-center py-16 text-white/60">
          <div class="inline-block px-8 py-4 rounded-2xl glass-card">
            <p class="text-lg mb-2">${escapeHtml(t(lang, 'error.unableToLoadAiModels'))}</p>
            <p class="text-sm">${escapeHtml(t(lang, 'error.pleaseRefresh'))}</p>
          </div>
        </div>
      `;
    }
  }

  async function renderStacksSection(lang: Lang): Promise<void> {
    if (!stacksRoot) return;
    const seq = ++stacksSeq;
    try {
      const { renderStacksPanel } = await import('./components/stacks-panel');
      if (seq !== stacksSeq) return;
      renderStacksPanel(stacksRoot, { lang });
      mounted.stacks = true;
    } catch (error) {
      if (seq !== stacksSeq) return;
      console.error('Failed to render tool stacks section:', error);
      stacksRoot.innerHTML = `
        <div class="text-center py-16 text-white/60">
          <div class="inline-block px-8 py-4 rounded-2xl glass-card">
            <p class="text-lg mb-2">${escapeHtml(t(lang, 'error.unableToLoadToolStacks'))}</p>
            <p class="text-sm">${escapeHtml(t(lang, 'error.pleaseRefresh'))}</p>
          </div>
        </div>
      `;
    }
  }

  async function renderOnboardingSection(lang: Lang): Promise<void> {
    if (!onboardingRoot) return;
    const seq = ++onboardingSeq;
    try {
      const { renderOnboarding } = await import('./components/onboarding-flow');
      if (seq !== onboardingSeq) return;
      renderOnboarding(onboardingRoot, lang);
      mounted.onboarding = true;
    } catch (error) {
      if (seq !== onboardingSeq) return;
      console.error('Failed to render onboarding quiz:', error);
    }
  }

  async function renderGuidesSection(lang: Lang): Promise<void> {
    if (!guidesRoot) return;
    const seq = ++guidesSeq;
    try {
      const { renderGettingStartedGuides } = await import('./components/getting-started-guides');
      if (seq !== guidesSeq) return;
      guidesRoot.innerHTML = '';
      guidesRoot.appendChild(renderGettingStartedGuides(lang));
      mounted.guides = true;
    } catch (error) {
      if (seq !== guidesSeq) return;
      console.error('Failed to render getting started guides:', error);
    }
  }

  async function renderAll(lang: Lang): Promise<void> {
    await renderAiTools(lang);
    updateToolCounts();

    const tasks: Promise<void>[] = [];
    if (mounted.dev) tasks.push(renderDevTools(lang));
    if (mounted.models || scheduled.models) tasks.push(renderModelsSection(lang));
    if (mounted.stacks || scheduled.stacks) tasks.push(renderStacksSection(lang));
    if (mounted.onboarding || scheduled.onboarding) tasks.push(renderOnboardingSection(lang));
    if (mounted.guides || scheduled.guides) tasks.push(renderGuidesSection(lang));
    await Promise.all(tasks);
  }

  function scheduleDeferredSections(): void {
    whenIdle(() => {
      void renderDevTools(getCurrentLang());
    });

    const modelsSection = document.getElementById('ai-models');
    if (modelsSection && modelsRoot) {
      whenVisible(modelsSection, () => {
        scheduled.models = true;
        void renderModelsSection(getCurrentLang());
      });
    }

    const stacksSection = document.getElementById('tool-stacks');
    if (stacksSection && stacksRoot) {
      whenVisible(stacksSection, () => {
        scheduled.stacks = true;
        void renderStacksSection(getCurrentLang());
      });
    }

    const onboardingSection = document.getElementById('onboarding');
    if (onboardingSection && onboardingRoot) {
      whenVisible(onboardingSection, () => {
        scheduled.onboarding = true;
        void renderOnboardingSection(getCurrentLang());
      });
    }

    const guidesSection = document.getElementById('guides');
    if (guidesSection && guidesRoot) {
      whenVisible(guidesSection, () => {
        scheduled.guides = true;
        void renderGuidesSection(getCurrentLang());
      });
    }
  }

  function bootDirectory(): void {
    const lang = getCurrentLang();
    if (lang === 'ja') {
      void ensureJaLocaleLoaded()
        .then(() => {
          renderAiToolsSync(lang);
          updateToolCounts();
          scheduleDeferredSections();
        })
        .catch((error) => {
          console.error('Failed to load Japanese locale:', error);
          if (aiRoot) {
            aiRoot.innerHTML = renderPanelError(lang, t(lang, 'error.unableToLoadAiTools'), error);
          }
        });
      return;
    }

    renderAiToolsSync(lang);
    updateToolCounts();
    scheduleDeferredSections();
  }

  bootDirectory();

  window.addEventListener('banal:language-changed', (e: Event) => {
    const nextLang = (e as CustomEvent).detail?.lang || getCurrentLang();
    void renderAll(nextLang);
  });

  document.querySelectorAll('[data-filter]').forEach((card) => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = card.getAttribute('data-filter');
      if (!cat) return;

      const targetSection = cat.startsWith('ai-') ? 'ai-tools' : 'dev-tools';

      if (cat.startsWith('ai-')) {
        aiPanelApi?.setCategory(cat as ZeroKeyCategory);
      } else if (cat.startsWith('dev-')) {
        if (!mounted.dev) {
          void renderDevTools(getCurrentLang()).then(() => {
            devPanelApi?.setCategory(cat as ZeroKeyCategory);
          });
        } else {
          devPanelApi?.setCategory(cat as ZeroKeyCategory);
        }
      }

      const toolsSec = document.getElementById(targetSection);
      toolsSec?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

export function getPanelApis(): {
  ai: ZeroKeyPanelApi | null;
  dev: ZeroKeyPanelApi | null;
  models: ModelsPanelApi | null;
  stacks: StacksPanelApi | null;
} {
  return { ai: null, dev: null, models: null, stacks: null };
}

function renderPanelError(lang: Lang, title: string, error: unknown): string {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  return `
    <div class="text-center py-16 text-white/60">
      <div class="inline-block px-8 py-4 rounded-2xl glass-card">
        <p class="text-lg mb-2">${escapeHtml(title)}</p>
        <p class="text-sm mb-4">Error: ${escapeHtml(errorMessage)}</p>
        <p class="text-sm">${escapeHtml(t(lang, 'error.pleaseRefreshLater'))}</p>
        <button onclick="location.reload()" class="mt-4 px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors">
          ${escapeHtml(t(lang, 'error.refreshPage'))}
        </button>
      </div>
    </div>
  `;
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function updateToolCounts(): void {
  const {
    total,
    ai: aiCount,
    dev: devCount,
    models: modelsCount,
    stacks: stacksCount,
  } = getSiteStats();

  const categoryCounts: Record<string, number> = {};
  zeroKeyTools.forEach((tool) => {
    categoryCounts[tool.category] = (categoryCounts[tool.category] || 0) + 1;
  });

  document.querySelectorAll('[data-category-count]').forEach((el) => {
    const cat = el.getAttribute('data-category-count');
    if (cat && categoryCounts[cat]) {
      el.textContent = `(${categoryCounts[cat]})`;
    }
  });

  const aiCountEl = document.querySelector('#ai-tools .tool-count-badge');
  if (aiCountEl) aiCountEl.textContent = String(aiCount);

  const devCountEl = document.querySelector('#dev-tools .tool-count-badge');
  if (devCountEl) devCountEl.textContent = String(devCount);

  const heroCountEl = document.getElementById('stat-tools');
  if (heroCountEl) heroCountEl.textContent = String(total);

  const heroAiEl = document.getElementById('stat-ai');
  if (heroAiEl) heroAiEl.textContent = String(aiCount);

  const heroDevEl = document.getElementById('stat-dev');
  if (heroDevEl) heroDevEl.textContent = String(devCount);

  const modelsCountEl = document.querySelector('#ai-models .tool-count-badge');
  if (modelsCountEl) modelsCountEl.textContent = String(modelsCount);

  const stacksCountEl = document.querySelector('#tool-stacks .tool-count-badge');
  if (stacksCountEl) stacksCountEl.textContent = String(stacksCount);
}
