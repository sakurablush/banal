import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { initDirectory, getPanelApis } from '../src/directory';
import { zeroKeyTools } from '../src/data/zero-key-tools';
import { renderZeroKeyPowerPanel } from '../src/zero-key-panel';

function stubDeferredMount(): void {
  vi.stubGlobal('requestIdleCallback', (cb: IdleRequestCallback) => {
    cb({ didTimeout: false, timeRemaining: () => 50 } as IdleDeadline);
    return 1;
  });
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    cb(0);
    return 0;
  });
}

async function flushAsyncMounts(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
}

describe('directory module initialization & behavior', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
    stubDeferredMount();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('mounts the Zero-Key directory and renders tools in horizontal scroll layout', async () => {
    // Create required DOM elements
    document.body.innerHTML = `
      <div id="stat-tools">227+</div>
      <div id="ai-tools-root" data-category-prefix="ai"></div>
      <div id="dev-tools-root" data-category-prefix="dev"></div>
    `;

    initDirectory();
    await flushAsyncMounts();

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
    expect(heroCount?.textContent).toBe(String(zeroKeyTools.length));
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

    const aiSearch = aiRoot.querySelector('#zk-search-input-ai') as HTMLInputElement;
    const devSearch = devRoot.querySelector('#zk-search-input-dev') as HTMLInputElement;
    expect(aiSearch).toBeTruthy();
    expect(devSearch).toBeTruthy();
    expect(aiSearch.id).not.toBe(devSearch.id);

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
    const aiSearch = aiRoot.querySelector('#zk-search-input-ai') as HTMLInputElement;
    const devSearch = devRoot.querySelector('#zk-search-input-dev') as HTMLInputElement;

    expect(aiSearch.value).toBe('docker');
    expect(devSearch.value).toBe('docker');
  });
});

// ─── Additional coverage tests ────────────────────────────────────────────────

describe('directory: getPanelApis', () => {
  it('returns null panel apis as convenience function', () => {
    const apis = getPanelApis();
    expect(apis).toEqual({ ai: null, dev: null, models: null, stacks: null });
  });
});

describe('directory: updateToolCounts', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('updates category count badges with correct counts', () => {
    document.body.innerHTML = `
      <div id="stat-tools">0+</div>
      <div id="ai-tools-root" data-category-prefix="ai"></div>
      <div id="dev-tools-root" data-category-prefix="dev"></div>
      <span data-category-count="ai-chat"></span>
      <span data-category-count="dev-coding"></span>
    `;

    initDirectory();

    const aiChatCount = document.querySelector('[data-category-count="ai-chat"]');
    const devCodingCount = document.querySelector('[data-category-count="dev-coding"]');

    const expectedAiChat = zeroKeyTools.filter((t) => t.category === 'ai-chat').length;
    const expectedDevCoding = zeroKeyTools.filter((t) => t.category === 'dev-coding').length;

    expect(aiChatCount?.textContent).toBe(`(${expectedAiChat})`);
    expect(devCodingCount?.textContent).toBe(`(${expectedDevCoding})`);
  });

  it('updates AI and Dev tool count badges', () => {
    document.body.innerHTML = `
      <div id="stat-tools">0+</div>
      <div id="ai-tools-root" data-category-prefix="ai"></div>
      <div id="dev-tools-root" data-category-prefix="dev"></div>
      <div id="ai-tools"><span class="tool-count-badge">0+</span></div>
      <div id="dev-tools"><span class="tool-count-badge">0+</span></div>
    `;

    initDirectory();

    const aiCount = zeroKeyTools.filter((t) => t.category.startsWith('ai-')).length;
    const devCount = zeroKeyTools.filter((t) => t.category.startsWith('dev-')).length;

    const aiBadge = document.querySelector('#ai-tools .tool-count-badge');
    const devBadge = document.querySelector('#dev-tools .tool-count-badge');

    expect(aiBadge?.textContent).toBe(String(aiCount));
    expect(devBadge?.textContent).toBe(String(devCount));
  });

  it('handles missing DOM elements gracefully', () => {
    // No stat-tools, no badges, no category counts
    document.body.innerHTML = `
      <div id="ai-tools-root"></div>
      <div id="dev-tools-root"></div>
    `;

    // Should not throw
    expect(() => initDirectory()).not.toThrow();
  });
});

describe('directory: escapeHtml XSS prevention', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('escapes HTML in error messages to prevent XSS', async () => {
    const zeroKeyPanel = await import('../src/zero-key-panel');

    document.body.innerHTML = `
      <div id="stat-tools">0+</div>
      <div id="ai-tools-root"></div>
    `;

    const spy = vi.spyOn(zeroKeyPanel, 'renderZeroKeyPowerPanel').mockImplementation(() => {
      throw new Error('<script>alert("xss")</script>');
    });

    initDirectory();

    const aiRoot = document.getElementById('ai-tools-root')!;
    // The error message should be escaped, not rendered as HTML
    expect(aiRoot.innerHTML).not.toContain('<script>alert');
    expect(aiRoot.textContent).toContain('<script>alert("xss")</script>');

    spy.mockRestore();
  });

  it('handles non-Error exceptions in error messages', async () => {
    const zeroKeyPanel = await import('../src/zero-key-panel');

    document.body.innerHTML = `
      <div id="stat-tools">0+</div>
      <div id="ai-tools-root"></div>
    `;

    const spy = vi.spyOn(zeroKeyPanel, 'renderZeroKeyPowerPanel').mockImplementation(() => {
      throw 'string error'; // non-Error throw
    });

    initDirectory();

    const aiRoot = document.getElementById('ai-tools-root')!;
    expect(aiRoot.innerHTML).toContain('Unknown error');

    spy.mockRestore();
  });
});

describe('directory: dev tools error handling', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
    stubDeferredMount();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('displays error message for dev tools when render throws', async () => {
    const zeroKeyPanel = await import('../src/zero-key-panel');

    document.body.innerHTML = `
      <div id="stat-tools">0+</div>
      <div id="ai-tools-root"></div>
      <div id="dev-tools-root"></div>
    `;

    let callCount = 0;
    const spy = vi.spyOn(zeroKeyPanel, 'renderZeroKeyPowerPanel').mockImplementation(() => {
      callCount++;
      if (callCount === 2) {
        throw new Error('Dev render failed');
      }
      return {
        search: vi.fn(),
        setCategory: vi.fn(),
        reset: vi.fn(),
        destroy: vi.fn(),
      };
    });

    initDirectory();
    await flushAsyncMounts();

    const devRoot = document.getElementById('dev-tools-root')!;
    expect(devRoot.innerHTML).toContain('Unable to load developer tools');

    spy.mockRestore();
  });
});

describe('directory: category filter navigation', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('clicking data-filter card scrolls to appropriate section and sets category', () => {
    document.body.innerHTML = `
      <div id="stat-tools">0+</div>
      <div id="ai-tools"></div>
      <div id="ai-tools-root"></div>
      <div id="dev-tools"></div>
      <div id="dev-tools-root"></div>
      <a data-filter="ai-chat" href="#">AI Chat</a>
      <a data-filter="dev-coding" href="#">Dev Coding</a>
    `;

    initDirectory();

    // Mock scrollIntoView
    const aiSection = document.getElementById('ai-tools')!;
    aiSection.scrollIntoView = vi.fn();

    const devSection = document.getElementById('dev-tools')!;
    devSection.scrollIntoView = vi.fn();

    // Click AI filter
    const aiFilter = document.querySelector('[data-filter="ai-chat"]') as HTMLElement;
    aiFilter.click();

    expect(aiSection.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });

    // Click Dev filter
    const devFilter = document.querySelector('[data-filter="dev-coding"]') as HTMLElement;
    devFilter.click();

    expect(devSection.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('ignores data-filter click when category attribute is empty', () => {
    document.body.innerHTML = `
      <div id="stat-tools">0+</div>
      <div id="ai-tools-root"></div>
      <div id="dev-tools-root"></div>
      <a data-filter="" href="#">Empty</a>
    `;

    initDirectory();

    const filter = document.querySelector('[data-filter=""]') as HTMLElement;
    // Should not throw
    expect(() => filter.click()).not.toThrow();
  });
});

describe('directory: missing root elements', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
    stubDeferredMount();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('handles missing ai-tools-root gracefully', async () => {
    document.body.innerHTML = `
      <div id="stat-tools">0+</div>
      <div id="dev-tools-root"></div>
    `;

    expect(() => initDirectory()).not.toThrow();
    await flushAsyncMounts();

    const devRoot = document.getElementById('dev-tools-root')!;
    const devCards = devRoot.querySelectorAll('.tool-card-horizontal');
    expect(devCards.length).toBeGreaterThan(0);
  });

  it('handles missing dev-tools-root gracefully', () => {
    document.body.innerHTML = `
      <div id="stat-tools">0+</div>
      <div id="ai-tools-root"></div>
    `;

    expect(() => initDirectory()).not.toThrow();

    const aiRoot = document.getElementById('ai-tools-root')!;
    const aiCards = aiRoot.querySelectorAll('.tool-card-horizontal');
    expect(aiCards.length).toBeGreaterThan(0);
  });

  it('handles both roots missing gracefully', () => {
    document.body.innerHTML = `
      <div id="stat-tools">0+</div>
    `;

    expect(() => initDirectory()).not.toThrow();
  });
});

describe('directory: language change with no detail', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('falls back to getCurrentLang when event has no lang detail', () => {
    document.body.innerHTML = `
      <div id="stat-tools">0+</div>
      <div id="ai-tools-root"></div>
      <div id="dev-tools-root"></div>
    `;

    initDirectory();

    // Dispatch event with no detail (fallback path)
    window.dispatchEvent(new CustomEvent('banal:language-changed'));

    const aiRoot = document.getElementById('ai-tools-root')!;
    const aiCards = aiRoot.querySelectorAll('.tool-card-horizontal');
    expect(aiCards.length).toBeGreaterThan(0);
  });
});
