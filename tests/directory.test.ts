import { beforeEach, describe, expect, it, vi } from 'vitest';
import { initDirectory } from '../src/directory';
import { zeroKeyTools } from '../src/data/zero-key-tools';

function makeDirectoryDOM() {
  document.body.innerHTML = `
    <div id="lang-en" class="active"></div>
    <div id="lang-ja"></div>
    <div class="tool-count-badge">0+</div>
    <div class="stat-number tool-count-badge">0+</div>
    
    <div id="categories">
      <a href="#tools" class="category-card" data-filter="ai-assistants">
        <span class="category-count" data-category-count="ai-assistants"></span>
      </a>
      <a href="#tools" class="category-card" data-filter="ai-image">
        <span class="category-count" data-category-count="ai-image"></span>
      </a>
    </div>

    <div id="zero-key-directory-root">
      <div class="tools-directory-container">Loading...</div>
    </div>

    <div id="tools"></div>
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

    const root = document.getElementById('zero-key-directory-root')!;
    expect(root.querySelectorAll('.zk-row').length).toBe(zeroKeyTools.length);

    // Verify total count badges are updated
    const badges = document.querySelectorAll('.tool-count-badge');
    expect(badges[0].textContent).toBe(`${zeroKeyTools.length}+`);
    expect(badges[1].textContent).toBe(`${zeroKeyTools.length}+`);

    // Verify category count badges are populated
    const countAssistants = document.querySelector('[data-category-count="ai-assistants"]')!;
    const countImage = document.querySelector('[data-category-count="ai-image"]')!;

    const expectedAssistants = zeroKeyTools.filter((t) => t.category === 'ai-assistants').length;
    const expectedImage = zeroKeyTools.filter((t) => t.category === 'ai-image').length;

    expect(countAssistants.textContent).toBe(`(${expectedAssistants})`);
    expect(countImage.textContent).toBe(`(${expectedImage})`);
  });

  it('wires data-filter category click events to trigger list filtering', () => {
    const scrollMock = vi.fn();
    const toolsSec = document.getElementById('tools')!;
    toolsSec.scrollIntoView = scrollMock;

    initDirectory();

    const assistantsCard = document.querySelector(
      '[data-filter="ai-assistants"]'
    ) as HTMLAnchorElement;

    // Should not throw when clicking a data-filter card
    expect(() => assistantsCard.click()).not.toThrow();

    // Should scroll smoothly
    expect(scrollMock).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('re-renders directory when language-changed custom event fires', () => {
    initDirectory();

    const root = document.getElementById('zero-key-directory-root')!;
    const firstCount = root.querySelectorAll('.zk-row').length;
    expect(firstCount).toBe(zeroKeyTools.length);

    // Re-render after language change
    window.dispatchEvent(new CustomEvent('banal:language-changed', { detail: { lang: 'ja' } }));

    // After re-render all tools are still rendered
    expect(root.querySelectorAll('.zk-row').length).toBe(zeroKeyTools.length);
  });
});
