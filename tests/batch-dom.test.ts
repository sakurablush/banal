import { describe, it, expect, vi } from 'vitest';
import { appendChildrenBatched } from '../src/lib/batch-dom';

describe('appendChildrenBatched', () => {
  it('appends all items to the parent', async () => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((fn) => {
      fn(0);
      return 0;
    });

    const parent = document.createElement('div');
    appendChildrenBatched(
      parent,
      [1, 2, 3, 4, 5],
      (n) => {
        const el = document.createElement('span');
        el.textContent = String(n);
        return el;
      },
      2
    );

    expect(parent.children).toHaveLength(5);
    expect(parent.textContent).toBe('12345');
  });

  it('does nothing for empty lists', () => {
    const parent = document.createElement('div');
    appendChildrenBatched(parent, [], () => document.createElement('span'));
    expect(parent.children).toHaveLength(0);
  });

  it('stops when shouldContinue returns false', () => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((fn) => {
      fn(0);
      return 0;
    });

    let alive = true;
    const parent = document.createElement('div');
    appendChildrenBatched(
      parent,
      [1, 2, 3, 4, 5],
      (n) => {
        const el = document.createElement('span');
        el.textContent = String(n);
        if (n === 2) alive = false;
        return el;
      },
      1,
      () => alive
    );

    expect(parent.children.length).toBeLessThan(5);
  });
});
