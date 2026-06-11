/**
 * Particle system — "ghost in the machine" atmosphere.
 * Vanilla canvas, zero dependencies.
 * - ~120 particles
 * - Respects prefers-reduced-motion
 * - Throttled to 30fps on low-end devices
 */

export type ParticleColor = {
  r: number;
  g: number;
  b: number;
  a: number;
};

const PALETTE: ParticleColor[] = [
  { r: 168, g: 85, b: 247, a: 0.35 }, // violet
  { r: 217, g: 70, b: 239, a: 0.25 }, // fuchsia
  { r: 34, g: 211, b: 238, a: 0.2 }, // cyan
  { r: 245, g: 158, b: 11, a: 0.2 }, // amber
  { r: 255, g: 255, b: 255, a: 0.15 }, // white
];

const PARTICLE_COUNT = 120;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

export interface ParticleSystemOptions {
  canvas?: HTMLCanvasElement;
  colorPalette?: ParticleColor[];
  count?: number;
}

export class ParticleSystem {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly particles: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    color: ParticleColor;
    alpha: number;
    targetAlpha: number;
    pulse: number;
  }[] = [];
  private rafId: number | null = null;
  private lastFrame = 0;
  private frameInterval = 1000 / 30; // 30fps throttle
  private observer: IntersectionObserver | null = null;
  private isVisible = true;

  constructor(options: ParticleSystemOptions = {}) {
    this.canvas = options.canvas || document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
    this.resize();

    const palette = options.colorPalette || PALETTE;
    const count = options.count || PARTICLE_COUNT;

    for (let i = 0; i < count; i++) {
      const color = palette[Math.floor(Math.random() * palette.length)];
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.5 + 0.5,
        color,
        alpha: Math.random() * 0.5,
        targetAlpha: Math.random() * 0.5 + 0.1,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    window.addEventListener('resize', () => this.resize());
    reducedMotion.addEventListener('change', () => {
      if (reducedMotion.matches) this.stop();
      else this.start();
    });
  }

  mount(el: HTMLElement | string): void {
    const target = typeof el === 'string' ? document.querySelector(el) : el;
    if (!target) return;
    target.appendChild(this.canvas);

    // Set up Intersection Observer to pause when not visible
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          this.isVisible = entries[0].isIntersecting;
          if (this.isVisible && !reducedMotion.matches) {
            this.start();
          } else {
            this.stop();
          }
        },
        { threshold: 0.1 }
      );
      this.observer.observe(this.canvas);
    }

    if (!reducedMotion.matches) this.start();
  }

  start(): void {
    if (this.rafId !== null) return;
    this.lastFrame = performance.now();
    const loop = (now: number) => {
      this.rafId = requestAnimationFrame(loop);
      const delta = now - this.lastFrame;
      if (delta < this.frameInterval) return;
      this.lastFrame = now - (delta % this.frameInterval);
      this.update();
    };
    this.rafId = requestAnimationFrame(loop);
  }

  stop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  destroy(): void {
    this.stop();
    this.canvas.remove();
    window.removeEventListener('resize', this.resize);
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  private resize = (): void => {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  };

  private update(): void {
    const { ctx, canvas, particles } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += 0.02;

      // Wrap around edges with margin
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;
      if (p.y < -10) p.y = canvas.height + 10;
      if (p.y > canvas.height + 10) p.y = -10;

      // Fade in/out
      p.alpha += (p.targetAlpha - p.alpha) * 0.01;
      if (Math.abs(p.alpha - p.targetAlpha) < 0.01) {
        p.targetAlpha = Math.random() * 0.5 + 0.1;
      }

      const { r, g, b, a } = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a * (0.6 + 0.4 * Math.sin(p.pulse))})`;
      ctx.fill();

      // Subtle glow for larger particles
      if (p.radius > 1) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a * 0.15})`;
        ctx.fill();
      }
    }
  }
}
