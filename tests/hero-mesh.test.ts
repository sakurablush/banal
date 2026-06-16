import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import {
  columnSunLit,
  getHorizonY,
  getMeshPalette,
  getSunLayout,
  initHeroMesh,
  prefersReducedMotion,
  sunIllumination,
  waveOffset,
} from '../src/lib/hero-mesh';

function mockCanvasContext(): CanvasRenderingContext2D {
  const gradient = { addColorStop: vi.fn() };
  return {
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    fillRect: vi.fn(),
    fill: vi.fn(),
    arc: vi.fn(),
    closePath: vi.fn(),
    clip: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    setTransform: vi.fn(),
    createRadialGradient: vi.fn(() => gradient),
    createLinearGradient: vi.fn(() => gradient),
    globalAlpha: 1,
    strokeStyle: '',
    fillStyle: '',
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
      expect(dark.sunCore).toContain('232, 121, 249');
    });

    it('returns softer lines in light mode', () => {
      const light = getMeshPalette('light');
      expect(light.line).toContain('124, 58, 237');
      expect(light.lineFar).toContain('0.08');
      expect(light.sunBand).toContain('124, 58, 237');
    });
  });

  describe('getSunLayout', () => {
    it('anchors the sun on the horizon center', () => {
      const sun = getSunLayout(960, 520);
      expect(sun.cx).toBe(480);
      expect(sun.cy).toBe(getHorizonY(520));
      expect(sun.radius).toBeGreaterThan(0);
    });
  });

  describe('sunIllumination', () => {
    it('peaks at the sun center and falls off with distance', () => {
      const sun = getSunLayout(960, 520);
      const center = sunIllumination(sun.cx, sun.cy, sun);
      const far = sunIllumination(0, sun.cy, sun);
      expect(center).toBeGreaterThan(far);
      expect(center).toBeGreaterThan(0.2);
      expect(far).toBe(0);
    });
  });

  describe('columnSunLit', () => {
    it('dims columns away from the vanishing axis', () => {
      const sun = getSunLayout(960, 520);
      const center = columnSunLit(0, sun);
      const edge = columnSunLit(0.5, sun);
      expect(center).toBeGreaterThan(edge);
      expect(edge).toBeGreaterThan(0);
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

    it('skips canvas drawing when reduced motion is preferred', () => {
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
      expect(ctx.stroke).not.toHaveBeenCalled();
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

      const ctx = mockCanvasContext();
      vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctx);

      cleanup = initHeroMesh();
      const strokesAfterInit = (ctx.stroke as ReturnType<typeof vi.fn>).mock.calls.length;
      expect(strokesAfterInit).toBeGreaterThan(0);

      document.documentElement.setAttribute('data-theme', 'light');
      await new Promise<void>((resolve) => queueMicrotask(resolve));

      expect((ctx.stroke as ReturnType<typeof vi.fn>).mock.calls.length).toBeGreaterThan(
        strokesAfterInit
      );
    });
  });
});

describe('index.html hero mesh markup', () => {
  it('includes accessible hero mesh canvas shell', () => {
    const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf-8');
    expect(html).toContain('class="hero-section');
    expect(html).toContain('class="hero-mesh" aria-hidden="true"');
    expect(html).toContain('class="hero-mesh-canvas"');
  });

  it('uses semantic hero copy classes for theme-aware contrast', () => {
    const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf-8');
    expect(html).toContain('hero-subtitle');
    expect(html).toContain('hero-disclaimer');
    expect(html).not.toMatch(/hero-subtitle[^"]*text-white\/50/);
    expect(html).not.toMatch(/hero-disclaimer[^"]*text-white\/30/);
  });
});
