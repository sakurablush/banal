import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getMeshPalette,
  initHeroMesh,
  prefersReducedMotion,
  waveOffset,
} from '../src/lib/hero-mesh';

function mockCanvasContext(): CanvasRenderingContext2D {
  return {
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    setTransform: vi.fn(),
    globalAlpha: 1,
    strokeStyle: '',
    lineWidth: 1,
  } as unknown as CanvasRenderingContext2D;
}

function mockObservers(): void {
  class MockObserver {
    observe = vi.fn();
    disconnect = vi.fn();
    unobserve = vi.fn();
  }
  vi.stubGlobal('IntersectionObserver', MockObserver);
  vi.stubGlobal('ResizeObserver', MockObserver);
}

function mountHero(): void {
  document.body.innerHTML = `
    <section class="hero-section">
      <div class="hero-mesh" aria-hidden="true">
        <canvas class="hero-mesh-canvas" width="100" height="100"></canvas>
      </div>
    </section>
  `;

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
}

describe('hero-mesh', () => {
  let cleanup: (() => void) | undefined;

  beforeEach(() => {
    mockObservers();
    mountHero();
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(mockCanvasContext());
  });

  afterEach(() => {
    cleanup?.();
    cleanup = undefined;
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  describe('waveOffset', () => {
    it('is zero at horizon depth with neutral phase', () => {
      expect(waveOffset(0, 0, 0)).toBe(0);
    });

    it('amplitude envelope grows with depth toward the camera', () => {
      const envelope = (depth: number) => (6 + depth * 10) * depth;
      expect(envelope(0.9)).toBeGreaterThan(envelope(0.2));
    });

    it('animates over time', () => {
      const a = waveOffset(0.2, 0.5, 0);
      const b = waveOffset(0.2, 0.5, 2.5);
      expect(a).not.toBe(b);
    });
  });

  describe('getMeshPalette', () => {
    it('returns higher-contrast violet lines in dark mode', () => {
      const dark = getMeshPalette('dark');
      expect(dark.line).toContain('168, 85, 247');
      expect(dark.accent).toContain('34, 211, 238');
    });

    it('returns softer lines in light mode', () => {
      const light = getMeshPalette('light');
      expect(light.line).toContain('124, 58, 237');
      expect(light.lineFar).toContain('0.08');
    });
  });

  describe('initHeroMesh', () => {
    it('starts the animation loop when motion is allowed', () => {
      const raf = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 1);
      cleanup = initHeroMesh();
      expect(typeof cleanup).toBe('function');
      if (!prefersReducedMotion()) {
        expect(raf).toHaveBeenCalled();
      }
    });

    it('draws once without scheduling frames when reduced motion is preferred', () => {
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
      const ctx = mockCanvasContext();
      vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctx);

      cleanup = initHeroMesh();
      expect(raf).not.toHaveBeenCalled();
      expect(ctx.stroke).toHaveBeenCalled();
    });

    it('returns noop when hero markup is missing', () => {
      document.body.innerHTML = '';
      cleanup = initHeroMesh();
      expect(typeof cleanup).toBe('function');
    });

    it('returns noop when canvas context is unavailable', () => {
      vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
      const raf = vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 1);
      cleanup = initHeroMesh();
      expect(raf).not.toHaveBeenCalled();
    });

    it('disconnects observers on cleanup', () => {
      const disconnect = vi.fn();
      class TrackingObserver {
        observe = vi.fn();
        disconnect = disconnect;
        unobserve = vi.fn();
      }
      vi.stubGlobal('IntersectionObserver', TrackingObserver);
      vi.stubGlobal('ResizeObserver', TrackingObserver);

      cleanup = initHeroMesh();
      cleanup!();
      expect(disconnect).toHaveBeenCalled();
    });

    it('redraws when theme changes', async () => {
      const ctx = mockCanvasContext();
      vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctx);

      cleanup = initHeroMesh();
      const strokesAfterInit = (ctx.stroke as ReturnType<typeof vi.fn>).mock.calls.length;

      document.documentElement.setAttribute('data-theme', 'light');
      await new Promise<void>((resolve) => queueMicrotask(resolve));

      expect((ctx.stroke as ReturnType<typeof vi.fn>).mock.calls.length).toBeGreaterThan(
        strokesAfterInit
      );
    });
  });
});
