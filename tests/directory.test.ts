import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { initDirectory } from '../src/directory';
import { zeroKeyTools } from '../src/data/zero-key-tools';
import { renderZeroKeyPowerPanel } from '../src/zero-key-panel';

describe('directory module initialization & behavior', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    // Reset mocks/spies if any
    vi.restoreAllMocks();
  });

  afterEach(() => {
    // Clean up any timers
    vi.useRealTimers();
  });

  it('mounts the Zero-Key directory and renders tools in horizontal scroll layout', () => {
    // Create required DOM elements
    document.body.innerHTML = `
      <div id="stat-tools">227+</div>
      <div id="ai-tools-root" data-category-prefix="ai"></div>
      <div id="dev-tools-root" data-category-prefix="dev"></div>
    `;

    initDirectory();

    // Check AI tools section - now uses horizontal scroll
    const aiRoot = document.getElementById('ai-tools-root')!;
    const aiCards = aiRoot.querySelectorAll('.tool-card-horizontal');
    const aiToolsCount = zeroKeyTools.filter((t) => t.category.startsWith('ai-')).length;
    expect(aiCards.length).toBeGreaterThan(0);
    expect(aiCards.length).toBe(aiToolsCount); // All tools visible in horizontal scroll

    // Check Dev tools section - now uses horizontal scroll
    const devRoot = document.getElementById('dev-tools-root')!;
    const devCards = devRoot.querySelectorAll('.tool-card-horizontal');
    const devToolsCount = zeroKeyTools.filter((t) => t.category.startsWith('dev-')).length;
    expect(devCards.length).toBe(devToolsCount); // All tools visible in horizontal scroll

    // Verify total count in hero section
    const heroCount = document.getElementById('stat-tools');
    expect(heroCount?.textContent).toBe(`${zeroKeyTools.length}+`);
  });

  it('horizontal scroll layout has quick filters row', () => {
    document.body.innerHTML = `
      <div id="stat-tools">227+</div>
      <div id="ai-tools-root" data-category-prefix="ai"></div>
    `;

    initDirectory();

    const aiRoot = document.getElementById('ai-tools-root')!;
    const filtersRow = aiRoot.querySelector('.quick-filters-row');
    expect(filtersRow).not.toBeNull();
  });

  it('re-renders directory when language-changed custom event fires', () => {
    document.body.innerHTML = `
      <div id="stat-tools">227+</div>
      <div id="ai-tools-root" data-category-prefix="ai"></div>
      <div id="dev-tools-root" data-category-prefix="dev"></div>
    `;

    initDirectory();

    const aiRoot = document.getElementById('ai-tools-root')!;
    const aiToolsCount = zeroKeyTools.filter((t) => t.category.startsWith('ai-')).length;
    const firstCount = aiRoot.querySelectorAll('.tool-card-horizontal').length;
    expect(firstCount).toBe(aiToolsCount);

    // Re-render after language change
    window.dispatchEvent(new CustomEvent('banal:language-changed', { detail: { lang: 'ja' } }));

    // After re-render all AI tools are still rendered
    expect(aiRoot.querySelectorAll('.tool-card-horizontal').length).toBe(aiToolsCount);
  });

  it('displays error message when renderZeroKeyPowerPanel throws', async () => {
    // Import the module to spy on
    const zeroKeyPanel = await import('../src/zero-key-panel');

    document.body.innerHTML = `
      <div id="stat-tools">227+</div>
      <div id="ai-tools-root" data-category-prefix="ai"></div>
    `;

    // Spy on renderZeroKeyPowerPanel and make it throw
    const spy = vi.spyOn(zeroKeyPanel, 'renderZeroKeyPowerPanel').mockImplementation(() => {
      throw new Error('Render failed');
    });

    initDirectory();

    const aiRoot = document.getElementById('ai-tools-root')!;
    expect(aiRoot.innerHTML).toContain('Unable to load AI tools');
    expect(aiRoot.innerHTML).toContain('Please refresh the page');

    // Restore the spy
    spy.mockRestore();
  });
});

describe('multi-panel independent state', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('two panels maintain independent search state in horizontal layout', () => {
    // Create containers for both panels
    const aiRoot = document.createElement('section');
    aiRoot.id = 'ai-tools-root';
    document.body.appendChild(aiRoot);

    const devRoot = document.createElement('section');
    devRoot.id = 'dev-tools-root';
    document.body.appendChild(devRoot);

    // Render both panels
    renderZeroKeyPowerPanel(aiRoot, { lang: 'en', categoryPrefix: 'ai' });
    renderZeroKeyPowerPanel(devRoot, { lang: 'en', categoryPrefix: 'dev' });

    // Get panel search inputs
    const aiSearch = aiRoot.querySelector('#zk-search-input') as HTMLInputElement;

    // Type in AI panel
    aiSearch.value = 'chatgpt';
    aiSearch.dispatchEvent(new Event('input', { bubbles: true }));
    vi.advanceTimersByTime(150);

    // AI panel should show results in horizontal scroll
    const aiCards = aiRoot.querySelectorAll('.tool-card-horizontal');
    expect(aiCards.length).toBeGreaterThan(0);

    // Dev panel search should NOT be affected (it has its own state)
    // The Dev panel shouldn't show any AI chat tools
    const devVisibleTools = Array.from(devRoot.querySelectorAll('.tool-card-horizontal h3')).map(
      (h) => h.textContent?.toLowerCase() || ''
    );
    const hasAIMatchingTools = devVisibleTools.some(
      (t) => t.includes('chatgpt') || t.includes('gpt')
    );
    expect(hasAIMatchingTools).toBe(false);
  });

  it('hero search filters both panels independently', () => {
    // Create hero search input
    const heroInput = document.createElement('input');
    heroInput.id = 'hero-search';
    heroInput.type = 'text';
    document.body.appendChild(heroInput);

    const aiRoot = document.createElement('section');
    aiRoot.id = 'ai-tools-root';
    document.body.appendChild(aiRoot);

    const devRoot = document.createElement('section');
    devRoot.id = 'dev-tools-root';
    document.body.appendChild(devRoot);

    renderZeroKeyPowerPanel(aiRoot, { lang: 'en', categoryPrefix: 'ai' });
    renderZeroKeyPowerPanel(devRoot, { lang: 'en', categoryPrefix: 'dev' });

    // Type in hero search
    heroInput.value = 'docker';
    heroInput.dispatchEvent(new Event('input', { bubbles: true }));
    vi.advanceTimersByTime(150);

    // Both panels should receive the search value
    const aiSearch = aiRoot.querySelector('#zk-search-input') as HTMLInputElement;

    expect(aiSearch.value).toBe('docker');
  });
});