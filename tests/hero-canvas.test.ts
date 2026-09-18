import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock three.js before importing the module under test — no real WebGL in jsdom.
vi.mock('three', () => {
  class MockMesh {
    geometry = { dispose: vi.fn() };
  }
  class MockScene {
    add = vi.fn();
  }
  class MockOrthographicCamera {}
  class MockClock {
    getDelta = vi.fn(() => 0.016);
  }
  class MockShaderMaterial {
    uniforms: Record<string, { value: unknown }> = {};
    dispose = vi.fn();
  }
  class MockWebGLRenderer {
    setPixelRatio = vi.fn();
    setSize = vi.fn();
    render = vi.fn();
    dispose = vi.fn();
  }
  class MockPlaneGeometry {}
  return {
    WebGLRenderer: MockWebGLRenderer,
    Scene: MockScene,
    OrthographicCamera: MockOrthographicCamera,
    ShaderMaterial: MockShaderMaterial,
    Mesh: MockMesh,
    PlaneGeometry: MockPlaneGeometry,
    Clock: MockClock,
    Vector2: class {
      constructor(
        public x = 0,
        public y = 0
      ) {}
    },
    Vector3: class {
      constructor(
        public x = 0,
        public y = 0,
        public z = 0
      ) {}
    },
    IUniform: {},
  };
});

import { initHeroMesh } from '../src/lib/hero-canvas';

function mockObservers(): void {
  class MockObserver {
    observe = vi.fn();
    disconnect = vi.fn();
    unobserve = vi.fn();
  }
  vi.stubGlobal('IntersectionObserver', MockObserver);
  vi.stubGlobal('ResizeObserver', MockObserver);
}

function mockWebGLContext(): WebGLRenderingContext {
  return {
    getParameter: vi.fn(() => 0),
    getShaderPrecisionFormat: vi.fn(() => ({ precision: 1, rangeMin: 1, rangeMax: 1 })),
  } as unknown as WebGLRenderingContext;
}

function mountHero(): void {
  document.body.innerHTML = `
    <section class="hero-section">
      <div class="hero-mesh" aria-hidden="true">
        <canvas class="hero-mesh-canvas" width="100" height="100"></canvas>
      </div>
    </section>
  `;
}

describe('hero-canvas (WebGL cosmic shader)', () => {
  let cleanup: (() => void) | undefined;

  beforeEach(() => {
    mockObservers();
    mountHero();
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(mockWebGLContext());
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
      width: 960,
      height: 520,
      top: 0,
      left: 0,
      right: 960,
      bottom: 520,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect);
  });

  afterEach(() => {
    cleanup?.();
    cleanup = undefined;
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('returns a cleanup function when hero markup and WebGL are present', () => {
    cleanup = initHeroMesh();
    expect(typeof cleanup).toBe('function');
  });

  it('returns a noop function when hero markup is missing', () => {
    document.body.innerHTML = '';
    cleanup = initHeroMesh();
    expect(typeof cleanup).toBe('function');
    cleanup();
  });

  it('returns a noop function when WebGL context is unavailable', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
    const raf = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 1);
    cleanup = initHeroMesh();
    expect(raf).not.toHaveBeenCalled();
  });

  it('does not start the animation loop under reduced motion', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      onchange: null,
      dispatchEvent: vi.fn(),
    }));

    const raf = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 1);
    cleanup = initHeroMesh();
    expect(raf).not.toHaveBeenCalled();
  });

  it('starts the animation loop when motion is allowed', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      onchange: null,
      dispatchEvent: vi.fn(),
    }));

    const raf = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 1);
    cleanup = initHeroMesh();
    expect(raf).toHaveBeenCalled();
  });

  it('pauses the loop when the tab is hidden', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      onchange: null,
      dispatchEvent: vi.fn(),
    }));

    const raf = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 1);
    cleanup = initHeroMesh();
    const callsBefore = raf.mock.calls.length;

    Object.defineProperty(document, 'hidden', { value: true, configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    const callsAfterVisibility = raf.mock.calls.length;

    expect(callsAfterVisibility).toBe(callsBefore);

    Object.defineProperty(document, 'hidden', { value: false, configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    expect(raf.mock.calls.length).toBeGreaterThan(callsAfterVisibility);
  });

  it('disconnects observers and removes listeners on cleanup', () => {
    const disconnect = vi.fn();
    class TrackingObserver {
      observe = vi.fn();
      disconnect = disconnect;
      unobserve = vi.fn();
    }
    vi.stubGlobal('IntersectionObserver', TrackingObserver);
    vi.stubGlobal('ResizeObserver', TrackingObserver);

    const addSpy = vi.spyOn(window, 'addEventListener');
    cleanup = initHeroMesh();
    cleanup!();
    expect(disconnect).toHaveBeenCalled();
    expect(addSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
  });

  it('respects the reduced-motion media query change', () => {
    const mq = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    vi.spyOn(window, 'matchMedia').mockReturnValue(mq as unknown as MediaQueryList);

    const raf = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 1);
    cleanup = initHeroMesh();
    const callsBefore = raf.mock.calls.length;

    mq.matches = true;
    (mq.addEventListener.mock.calls[0]![1] as () => void)();
    // After switching to reduced motion the loop must stop scheduling.
    expect(raf.mock.calls.length).toBe(callsBefore);
  });
});
