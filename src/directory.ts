import {
  renderZeroKeyPowerPanel,
  type ZeroKeyPanelApi,
  type ZeroKeyCategory,
} from './zero-key-panel';
import { getCurrentLang } from './i18n';
import { zeroKeyTools } from './data/zero-key-tools';

/**
 * Initialize the main page Zero-Key Tools Directory.
 * Renders two separate panels: AI Tools and Developer Tools,
 * populates the category badges/counts, and wires quick navigation filters.
 */
export function initDirectory(): void {
  const aiRoot = document.getElementById('ai-tools-root');
  const devRoot = document.getElementById('dev-tools-root');

  // Store panel APIs for category quick-nav
  let aiPanelApi: ZeroKeyPanelApi | null = null;
  let devPanelApi: ZeroKeyPanelApi | null = null;

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
              <p class="text-lg mb-2">⚠️ Unable to load AI tools</p>
              <p class="text-sm mb-4">Error: ${escapeHtml(errorMessage)}</p>
              <p class="text-sm">Please refresh the page or try again later.</p>
              <button onclick="location.reload()" class="mt-4 px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors">
                Refresh Page
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
              <p class="text-lg mb-2">⚠️ Unable to load developer tools</p>
              <p class="text-sm mb-4">Error: ${escapeHtml(errorMessage)}</p>
              <p class="text-sm">Please refresh the page or try again later.</p>
              <button onclick="location.reload()" class="mt-4 px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors">
                Refresh Page
              </button>
            </div>
          </div>
        `;
        devPanelApi = null;
      }
    }

    // Update dynamic tool counts
    updateToolCounts();
  };

  // Initial render
  render();

  // Re-render when language changes
  window.addEventListener('banal:language-changed', (e: Event) => {
    const nextLang = (e as CustomEvent).detail?.lang || getCurrentLang();
    render(nextLang);
    // APIs are reassigned on re-render
    aiPanelApi = null;
    devPanelApi = null;
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

export function getPanelApis(): { ai: ZeroKeyPanelApi | null; dev: ZeroKeyPanelApi | null } {
  // This is a convenience function for testing
  // In production, the APIs are managed internally by initDirectory
  return { ai: null, dev: null };
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
  const aiCount = zeroKeyTools.filter((t) => t.category.startsWith('ai-')).length;
  const devCount = zeroKeyTools.filter((t) => t.category.startsWith('dev-')).length;
  const total = zeroKeyTools.length;

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
    aiCountEl.textContent = `${aiCount}+`;
  }

  // Update Dev tools count
  const devCountEl = document.querySelector('#dev-tools .tool-count-badge');
  if (devCountEl) {
    devCountEl.textContent = `${devCount}+`;
  }

  // Update total tool count in hero section
  const heroCountEl = document.getElementById('stat-tools');
  if (heroCountEl) {
    heroCountEl.textContent = `${total}+`;
  }
}
