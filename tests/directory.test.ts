import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { initDirectory } from '../src/directory';
import { zeroKeyTools } from '../src/data/zero-key-tools';
import { renderZeroKeyPowerPanel } from '../src/zero-key-panel';

const PAGE_SIZE = 24; // matches lazy-load page size in panel

function makeDirectoryDOM() {
  document.body.innerHTML = `
    <div id="lang-en" class="active"></div>
    <div id="lang-ja"></div>
    <div class="tool-count-badge">0+</div>
    <div class="stat-number tool-count-badge">0+</div>
    <div id="stat-tools">227+</div>
    
    <div id="categories">
      <a href="#ai-tools" class="category-card" data-filter="ai-chat">
        <span class="category-count" data-category-count="ai-chat"></span>
      </a>
      <a href="#ai-tools" class="category-card" data-filter="ai-image">
        <span class="category-count" data-category-count="ai-image"></span>
      </a>
      <a href="#dev-tools" class="category-card" data-filter="dev-coding">
        <span class="category-count" data-category-count="dev-coding"></span>
      </a>
    </div>

    <div id="ai-tools-root" data-category-prefix="ai">
      <div class="tools-directory-container">Loading...</div>
    </div>

    <div id="dev-tools-root" data-category-prefix="dev">
      <div class="tools-directory-container">Loading...</div>
    </div>

    <div id="ai-tools"></div>
    <div id="dev-tools"></div>
  `;
}

describe('directory module initialization & behavior', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    makeDirectoryDOM();
    // Reset mocks/spies if any
    vi.restoreAllMocks();
  });

  afterEach(() => {
    // Clean up any timers
    vi.useRealTimers();
  });

  it('mounts the Zero-Key directory and updates tool counts', () => {
    initDirectory();

    // Check AI tools section
    const aiRoot = document.getElementById('ai-tools-root')!;
    const aiCards = aiRoot.querySelectorAll('.zk2-card');
    const aiToolsCount = zeroKeyTools.filter((t) => t.category.startsWith('ai-')).length;
    expect(aiCards.length).toBe(Math.min(PAGE_SIZE, aiToolsCount));

    // Check Dev tools section
    const devRoot = document.getElementById('dev-tools-root')!;
    const devCards = devRoot.querySelectorAll('.zk2-card');
    const devToolsCount = zeroKeyTools.filter((t) => t.category.startsWith('dev-')).length;
    expect(devCards.length).toBe(Math.min(PAGE_SIZE, devToolsCount));

    // Verify total count in hero section
    const heroCount = document.getElementById('stat-tools');
    expect(heroCount?.textContent).toBe(`${zeroKeyTools.length}+`);

    // Verify category count badges are populated
    const countChat = document.querySelector('[data-category-count="ai-chat"]')!;
    const countImage = document.querySelector('[data-category-count="ai-image"]')!;

    const expectedChat = zeroKeyTools.filter((t) => t.category === 'ai-chat').length;
    const expectedImage = zeroKeyTools.filter((t) => t.category === 'ai-image').length;

    expect(countChat.textContent).toBe(`(${expectedChat})`);
    expect(countImage.textContent).toBe(`(${expectedImage})`);
  });

  it('wires data-filter category click events to trigger list filtering via API', () => {
    const scrollMock = vi.fn();
    const aiToolsSec = document.getElementById('ai-tools')!;
    aiToolsSec.scrollIntoView = scrollMock;

    initDirectory();

    const chatCard = document.querySelector('[data-filter="ai-chat"]') as HTMLAnchorElement;

    // Should not throw when clicking a data-filter card
    expect(() => chatCard.click()).not.toThrow();

    // Should scroll smoothly to AI tools section
    expect(scrollMock).toHaveBeenCalledWith({ behavior: 'smooth' });

    // Verify the AI panel has active category set
    const aiRoot = document.getElementById('ai-tools-root')!;
    const activeCatBtn = aiRoot.querySelector('.zk2-cat-item.active[data-category="ai-chat"]');
    expect(activeCatBtn).not.toBeNull();
  });

  it('re-renders directory when language-changed custom event fires', () => {
    initDirectory();

    const aiRoot = document.getElementById('ai-tools-root')!;
    const aiToolsCount = zeroKeyTools.filter((t) => t.category.startsWith('ai-')).length;
    const firstCount = aiRoot.querySelectorAll('.zk2-card').length;
    expect(firstCount).toBe(Math.min(PAGE_SIZE, aiToolsCount));

    // Re-render after language change
    window.dispatchEvent(new CustomEvent('banal:language-changed', { detail: { lang: 'ja' } }));

    // After re-render all AI tools are still rendered (first page)
    expect(aiRoot.querySelectorAll('.zk2-card').length).toBe(Math.min(PAGE_SIZE, aiToolsCount));
  });

  it('displays error message when renderZeroKeyPowerPanel throws', async () => {
    // Import the module to spy on
    const zeroKeyPanel = await import('../src/zero-key-panel');

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

  it('two panels maintain independent search state', () => {
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

    // AI panel should show results
    const aiCards = aiRoot.querySelectorAll('.zk2-card');
    expect(aiCards.length).toBeGreaterThan(0);

    // Dev panel search should NOT be affected (it has its own state)
    // The Dev panel shouldn't show any AI chat tools
    const devVisibleTools = Array.from(devRoot.querySelectorAll('.zk2-card h3')).map(
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
