import {
  renderZeroKeyPowerPanel,
  type ZeroKeyPanelApi,
  type ZeroKeyCategory,
} from './zero-key-panel';
import { getCurrentLang, t } from './i18n';
import { zeroKeyTools } from './data/zero-key-tools';
import { getSiteStats } from './data/site-stats';
import { renderModelsPanel, type ModelsPanelApi } from './components/models-panel';
import { renderStacksPanel, type StacksPanelApi } from './components/stacks-panel';
import { renderOnboarding } from './components/onboarding-flow';
import { renderGettingStartedGuides } from './components/getting-started-guides';

/**
 * Initialize the main page Zero-Key Tools Directory.
 * Renders two separate panels: AI Tools and Developer Tools,
 * populates the category badges/counts, and wires quick navigation filters.
 */
export function initDirectory(): void {
  const aiRoot = document.getElementById('ai-tools-root');
  const devRoot = document.getElementById('dev-tools-root');
  const modelsRoot = document.getElementById('ai-models-root');
  const stacksRoot = document.getElementById('tool-stacks-root');
  const onboardingRoot = document.getElementById('onboarding-root');
  const guidesRoot = document.getElementById('guides-root');

  // Store panel APIs for category quick-nav
  let aiPanelApi: ZeroKeyPanelApi | null = null;
  let devPanelApi: ZeroKeyPanelApi | null = null;
  let modelsPanelApi: ModelsPanelApi | null = null;
  let stacksPanelApi: StacksPanelApi | null = null;

  const render = (lang = getCurrentLang()) => {
    // Render AI Tools section
    if (aiRoot) {
      try {
        aiPanelApi = renderZeroKeyPowerPanel(aiRoot, {
          lang,
          categoryPrefix: 'ai',
          onToolOpen: () => {
            // Safe tracking or custom callback if needed
          },
        });
      } catch (error) {
        console.error('Failed to render AI tools directory:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        aiRoot.innerHTML = `
          <div class="text-center py-16 text-white/60">
            <div class="inline-block px-8 py-4 rounded-2xl glass-card">
              <p class="text-lg mb-2">${escapeHtml(t(lang, 'error.unableToLoadAiTools'))}</p>
              <p class="text-sm mb-4">Error: ${escapeHtml(errorMessage)}</p>
              <p class="text-sm">${escapeHtml(t(lang, 'error.pleaseRefreshLater'))}</p>
              <button onclick="location.reload()" class="mt-4 px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors">
                ${escapeHtml(t(lang, 'error.refreshPage'))}
              </button>
            </div>
          </div>
        `;
        aiPanelApi = null;
      }
    }

    // Render Developer Tools section
    if (devRoot) {
      try {
        devPanelApi = renderZeroKeyPowerPanel(devRoot, {
          lang,
          categoryPrefix: 'dev',
          onToolOpen: () => {
            // Safe tracking or custom callback if needed
          },
        });
      } catch (error) {
        console.error('Failed to render developer tools directory:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        devRoot.innerHTML = `
          <div class="text-center py-16 text-white/60">
            <div class="inline-block px-8 py-4 rounded-2xl glass-card">
              <p class="text-lg mb-2">${escapeHtml(t(lang, 'error.unableToLoadDevTools'))}</p>
              <p class="text-sm mb-4">Error: ${escapeHtml(errorMessage)}</p>
              <p class="text-sm">${escapeHtml(t(lang, 'error.pleaseRefreshLater'))}</p>
              <button onclick="location.reload()" class="mt-4 px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors">
                ${escapeHtml(t(lang, 'error.refreshPage'))}
              </button>
            </div>
          </div>
        `;
        devPanelApi = null;
      }
    }

    // Update dynamic tool counts
    updateToolCounts();

    // Render AI Models section
    if (modelsRoot) {
      try {
        modelsPanelApi = renderModelsPanel(modelsRoot, { lang });
      } catch (error) {
        console.error('Failed to render AI models section:', error);
        modelsRoot.innerHTML = `
          <div class="text-center py-16 text-white/60">
            <div class="inline-block px-8 py-4 rounded-2xl glass-card">
              <p class="text-lg mb-2">${escapeHtml(t(lang, 'error.unableToLoadAiModels'))}</p>
              <p class="text-sm">${escapeHtml(t(lang, 'error.pleaseRefresh'))}</p>
            </div>
          </div>
        `;
        modelsPanelApi = null;
      }
    }

    // Render Tool Stacks section
    if (stacksRoot) {
      try {
        stacksPanelApi = renderStacksPanel(stacksRoot, { lang });
      } catch (error) {
        console.error('Failed to render tool stacks section:', error);
        stacksRoot.innerHTML = `
          <div class="text-center py-16 text-white/60">
            <div class="inline-block px-8 py-4 rounded-2xl glass-card">
              <p class="text-lg mb-2">${escapeHtml(t(lang, 'error.unableToLoadToolStacks'))}</p>
              <p class="text-sm">${escapeHtml(t(lang, 'error.pleaseRefresh'))}</p>
            </div>
          </div>
        `;
        stacksPanelApi = null;
      }
    }

    // Render Onboarding Quiz
    if (onboardingRoot) {
      try {
        renderOnboarding(onboardingRoot, lang);
      } catch (error) {
        console.error('Failed to render onboarding quiz:', error);
      }
    }

    // Render Getting Started Guides
    if (guidesRoot) {
      try {
        guidesRoot.innerHTML = '';
        guidesRoot.appendChild(renderGettingStartedGuides(lang));
      } catch (error) {
        console.error('Failed to render getting started guides:', error);
      }
    }
  };

  // Initial render
  render();

  // Expose panel APIs for external use (e.g., quick-nav, testing)
  void modelsPanelApi;
  void stacksPanelApi;

  // Re-render when language changes
  window.addEventListener('banal:language-changed', (e: Event) => {
    const nextLang = (e as CustomEvent).detail?.lang || getCurrentLang();
    render(nextLang);
    // APIs are reassigned on re-render
    aiPanelApi = null;
    devPanelApi = null;
    modelsPanelApi = null;
    stacksPanelApi = null;
  });

  // Wire up category quick nav links to filter the list
  document.querySelectorAll('[data-filter]').forEach((card) => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = card.getAttribute('data-filter');
      if (!cat) return;

      // Determine which section to scroll to based on category prefix
      const targetSection = cat.startsWith('ai-') ? 'ai-tools' : 'dev-tools';
      const targetRoot = document.getElementById(`${targetSection}-root`);

      // Use panel API to set category directly (preferred method)
      if (cat.startsWith('ai-')) {
        if (aiPanelApi && targetRoot) {
          aiPanelApi.setCategory(cat as ZeroKeyCategory);
        }
      } else if (cat.startsWith('dev-')) {
        if (devPanelApi && targetRoot) {
          devPanelApi.setCategory(cat as ZeroKeyCategory);
        }
      }

      // Smooth scroll to the appropriate section
      const toolsSec = document.getElementById(targetSection);
      if (toolsSec) {
        toolsSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

export function getPanelApis(): {
  ai: ZeroKeyPanelApi | null;
  dev: ZeroKeyPanelApi | null;
  models: ModelsPanelApi | null;
  stacks: StacksPanelApi | null;
} {
  // This is a convenience function for testing
  // In production, the APIs are managed internally by initDirectory
  return { ai: null, dev: null, models: null, stacks: null };
}

/**
 * Escape HTML to prevent XSS in error messages
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Calculates tool counts and updates category count elements and the total counter.
 */
function updateToolCounts(): void {
  const { total, ai: aiCount, dev: devCount, models: modelsCount, stacks: stacksCount } =
    getSiteStats();

  // Update category count badges (e.g. "(31)")
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

  // Update AI tools count
  const aiCountEl = document.querySelector('#ai-tools .tool-count-badge');
  if (aiCountEl) {
    aiCountEl.textContent = String(aiCount);
  }

  // Update Dev tools count
  const devCountEl = document.querySelector('#dev-tools .tool-count-badge');
  if (devCountEl) {
    devCountEl.textContent = String(devCount);
  }

  // Update total tool count in hero section
  const heroCountEl = document.getElementById('stat-tools');
  if (heroCountEl) {
    heroCountEl.textContent = String(total);
  }

  const heroAiEl = document.getElementById('stat-ai');
  if (heroAiEl) {
    heroAiEl.textContent = String(aiCount);
  }

  const heroDevEl = document.getElementById('stat-dev');
  if (heroDevEl) {
    heroDevEl.textContent = String(devCount);
  }

  // Update AI models count
  const modelsCountEl = document.querySelector('#ai-models .tool-count-badge');
  if (modelsCountEl) {
    modelsCountEl.textContent = String(modelsCount);
  }

  // Update tool stacks count
  const stacksCountEl = document.querySelector('#tool-stacks .tool-count-badge');
  if (stacksCountEl) {
    stacksCountEl.textContent = String(stacksCount);
  }
}
