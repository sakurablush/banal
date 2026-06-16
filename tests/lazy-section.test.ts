import { describe, it, expect, vi, afterEach } from 'vitest';
import { whenVisible, whenIdle } from '../src/lib/lazy-section';

describe('whenVisible', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('registers an IntersectionObserver on the element', () => {
    const observe = vi.fn();
    class MockIntersectionObserver {
      constructor(_cb: IntersectionObserverCallback, _options?: IntersectionObserverInit) {}
      observe = observe;
      disconnect = vi.fn();
      unobserve = vi.fn();
      takeRecords = vi.fn();
    }
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

    const el = document.createElement('div');
    whenVisible(el, vi.fn());
    expect(observe).toHaveBeenCalledWith(el);
  });

  it('calls callback immediately when IntersectionObserver is unavailable', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    const cb = vi.fn();
    whenVisible(document.createElement('div'), cb);
    expect(cb).toHaveBeenCalledOnce();
  });
});

describe('whenIdle', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('falls back to requestAnimationFrame when requestIdleCallback is missing', () => {
    vi.stubGlobal('requestIdleCallback', undefined);
    const raf = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((fn) => {
      fn(0);
      return 0;
    });
    const cb = vi.fn();
    whenIdle(cb);
    expect(raf).toHaveBeenCalled();
    expect(cb).toHaveBeenCalledOnce();
    raf.mockRestore();
  });
});
