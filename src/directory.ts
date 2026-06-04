import { renderZeroKeyPowerPanel } from './zero-key-panel';
import { getCurrentLang } from './i18n';
import { zeroKeyTools } from './data/zero-key-tools';

/**
 * Initialize the main page Zero-Key Tools Directory.
 * Renders the panel inside #zero-key-directory-root,
 * populates the category badges/counts, and wires quick navigation filters.
 */
export function initDirectory(): void {
  const root = document.getElementById('zero-key-directory-root');
  if (!root) return;

  const render = (lang = getCurrentLang()) => {
    renderZeroKeyPowerPanel(root, {
      lang,
      onToolOpen: () => {
        // Safe tracking or custom callback if needed
      },
    });

    // Update dynamic tool counts
    updateToolCounts();
  };

  // Initial render
  render();

  // Re-render when language changes
  window.addEventListener('banal:language-changed', (e: Event) => {
    const nextLang = (e as CustomEvent).detail?.lang || getCurrentLang();
    render(nextLang);
  });

  // Wire up category quick nav links to filter the list
  document.querySelectorAll('[data-filter]').forEach((card) => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = card.getAttribute('data-filter');
      if (!cat) return;

      // Find the search input in the rendered panel and set its value
      const searchInput = root.querySelector('input[type="text"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.value = cat;
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      }

      // Smooth scroll to the tools section
      const toolsSec = document.getElementById('tools');
      if (toolsSec) {
        toolsSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/**
 * Calculates tool counts and updates category count elements and the total counter.
 */
function updateToolCounts(): void {
  const counts: Record<string, number> = {};

  zeroKeyTools.forEach((tool) => {
    counts[tool.category] = (counts[tool.category] || 0) + 1;
  });

  // Update category count badges (e.g. "(12)")
  document.querySelectorAll('[data-category-count]').forEach((el) => {
    const cat = el.getAttribute('data-category-count');
    if (cat) {
      el.textContent = `(${counts[cat] || 0})`;
    }
  });

  // Update total tool count badges across the page
  const total = zeroKeyTools.length;
  document.querySelectorAll('.tool-count-badge').forEach((el) => {
    el.textContent = `${total}+`;
  });
}
