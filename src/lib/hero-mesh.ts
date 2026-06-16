/**
 * Hero horizon mesh — perspective grid with slow gravitational-wave ripples.
 * Canvas only in the hero; pauses off-screen, hidden tab, and reduced motion.
 */

const COLS = 22;
const ROWS = 13;
const MAX_DPR = 1.25;
const FRAME_MS = 1000 / 30;

export type MeshPalette = {
  line: string;
  lineFar: string;
  accent: string;
};

export type MeshTheme = 'light' | 'dark';

export function getMeshPalette(theme: MeshTheme): MeshPalette {
  if (theme === 'light') {
    return {
      line: 'rgba(124, 58, 237, 0.2)',
      lineFar: 'rgba(124, 58, 237, 0.08)',
      accent: 'rgba(8, 145, 178, 0.14)',
    };
  }
  return {
    line: 'rgba(168, 85, 247, 0.22)',
    lineFar: 'rgba(168, 85, 247, 0.07)',
    accent: 'rgba(34, 211, 238, 0.12)',
  };
}

function readTheme(): MeshTheme {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

/** Gravitational-wave displacement along a mesh row (testable, pure). */
export function waveOffset(u: number, depth: number, time: number): number {
  const a =
    Math.sin(u * 5.4 - time * 1.35) * 0.55 +
    Math.sin(u * 3.1 + time * 0.85 + depth * 1.8) * 0.45;
  const amp = (6 + depth * 10) * depth;
  return a * amp;
}

function drawMesh(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  theme: MeshTheme
): void {
  const palette = getMeshPalette(theme);
  const horizon = height * 0.52;
  const vanishX = width * 0.5;
  const span = width * 0.92;

  ctx.clearRect(0, 0, width, height);
  if (width < 2 || height < 2) return;

  for (let r = 0; r <= ROWS; r++) {
    const depth = r / ROWS;
    const yBase = horizon + (height - horizon) * depth * depth;
    const alpha = 0.08 + depth * 0.92;

    ctx.beginPath();
    ctx.strokeStyle = depth < 0.35 ? palette.lineFar : palette.line;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = depth < 0.2 ? 0.6 : 1;

    for (let c = 0; c <= COLS; c++) {
      const u = c / COLS - 0.5;
      const x = vanishX + u * span * depth;
      const y = yBase + waveOffset(u, depth, time);
      if (c === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  for (let c = 0; c <= COLS; c++) {
    const u = c / COLS - 0.5;
    ctx.beginPath();
    ctx.globalAlpha = 0.35 + Math.abs(u) * 0.45;
    ctx.strokeStyle = Math.abs(u) < 0.08 ? palette.accent : palette.line;

    for (let r = 0; r <= ROWS; r++) {
      const depth = r / ROWS;
      const yBase = horizon + (height - horizon) * depth * depth;
      const x = vanishX + u * span * depth;
      const y = yBase + waveOffset(u, depth, time);
      if (r === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.lineWidth = Math.abs(u) < 0.06 ? 1.1 : 0.75;
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function initHeroMesh(root: ParentNode = document): () => void {
  const section = root.querySelector('.hero-section');
  const canvas = root.querySelector('.hero-mesh-canvas') as HTMLCanvasElement | null;
  if (!section || !canvas) return () => {};

  const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
  if (!ctx) return () => {};

  let width = 0;
  let height = 0;
  let rafId = 0;
  let visible = true;
  let running = false;
  let lastFrame = 0;
  let time = 0;

  const render = (): void => {
    if (prefersReducedMotion()) return;
    drawMesh(ctx, width, height, time, readTheme());
  };

  const resize = (): void => {
    const rect = section.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    width = Math.max(1, Math.floor(rect.width));
    height = Math.max(1, Math.floor(rect.height));
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const cancelFrame = (): void => {
    if (!rafId) return;
    cancelAnimationFrame(rafId);
    rafId = 0;
  };

  const paint = (now: number): void => {
    if (!running) return;
    rafId = 0;

    if (!visible || document.hidden || prefersReducedMotion()) return;

    if (now - lastFrame >= FRAME_MS) {
      time += (now - lastFrame) / 1000;
      lastFrame = now;
    }

    render();
    schedule();
  };

  const schedule = (): void => {
    if (!running || rafId || !visible || document.hidden || prefersReducedMotion()) return;
    rafId = requestAnimationFrame(paint);
  };

  const start = (): void => {
    if (running) return;
    running = true;
    lastFrame = performance.now();
    resize();
    render();
    if (!prefersReducedMotion()) schedule();
  };

  const stop = (): void => {
    running = false;
    cancelFrame();
  };

  const observer = new IntersectionObserver(
    (entries) => {
      visible = entries.some((e) => e.isIntersecting);
      if (visible && running && !prefersReducedMotion()) {
        schedule();
      } else {
        cancelFrame();
      }
    },
    { root: null, threshold: 0.05 }
  );
  observer.observe(section);

  const resizeObserver = new ResizeObserver(() => {
    resize();
    render();
  });
  resizeObserver.observe(section);

  const onVisibility = (): void => {
    if (!document.hidden && visible && running && !prefersReducedMotion()) {
      schedule();
    } else {
      cancelFrame();
    }
  };
  document.addEventListener('visibilitychange', onVisibility);

  const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const onMotion = (): void => {
    if (prefersReducedMotion()) {
      cancelFrame();
      render();
      return;
    }
    lastFrame = performance.now();
    schedule();
  };
  motionMq.addEventListener('change', onMotion);

  const themeObserver = new MutationObserver(() => render());
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  start();

  return () => {
    stop();
    observer.disconnect();
    resizeObserver.disconnect();
    themeObserver.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    motionMq.removeEventListener('change', onMotion);
  };
}
