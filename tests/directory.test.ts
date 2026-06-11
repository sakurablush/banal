import { beforeEach, describe, expect, it, vi } from 'vitest';
import { initDirectory } from '../src/directory';
import { zeroKeyTools } from '../src/data/zero-key-tools';

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

  it('wires data-filter category click events to trigger list filtering', () => {
    const scrollMock = vi.fn();
    const aiToolsSec = document.getElementById('ai-tools')!;
    aiToolsSec.scrollIntoView = scrollMock;

    initDirectory();

    const chatCard = document.querySelector('[data-filter="ai-chat"]') as HTMLAnchorElement;

    // Should not throw when clicking a data-filter card
    expect(() => chatCard.click()).not.toThrow();

    // Should scroll smoothly to AI tools section
    expect(scrollMock).toHaveBeenCalledWith({ behavior: 'smooth' });
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
