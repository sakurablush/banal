/**
 * Hero horizon mesh — perspective grid with slow gravitational-wave ripples
 * and a digital synthwave sun at the vanishing point.
 * Canvas only in the hero; pauses off-screen, hidden tab, and reduced motion.
 */

const COLS = 22;
const ROWS = 13;
const MAX_DPR = 1.25;
const FRAME_MS = 1000 / 30;
const HORIZON_RATIO = 0.52;
const SUN_BANDS = 13;

export type MeshPalette = {
  line: string;
  lineFar: string;
  accent: string;
  sunCore: string;
  sunBand: string;
  sunGlow: string;
  sunGlowMid: string;
  sunGlowEdge: string;
  sunFloor: string;
};

export type SunLayout = {
  cx: number;
  cy: number;
  radius: number;
};

export type MeshTheme = 'light' | 'dark';

export function getMeshPalette(theme: MeshTheme): MeshPalette {
  if (theme === 'light') {
    return {
      line: 'rgba(124, 58, 237, 0.2)',
      lineFar: 'rgba(124, 58, 237, 0.08)',
      accent: 'rgba(8, 145, 178, 0.14)',
      sunCore: 'rgba(192, 132, 252, 0.55)',
      sunBand: 'rgba(124, 58, 237, 0.42)',
      sunGlow: 'rgba(168, 85, 247, 0.22)',
      sunGlowMid: 'rgba(124, 58, 237, 0.08)',
      sunGlowEdge: 'rgba(124, 58, 237, 0)',
      sunFloor: 'rgba(168, 85, 247, 0.14)',
    };
  }
  return {
    line: 'rgba(168, 85, 247, 0.22)',
    lineFar: 'rgba(168, 85, 247, 0.07)',
    accent: 'rgba(34, 211, 238, 0.12)',
    sunCore: 'rgba(232, 121, 249, 0.7)',
    sunBand: 'rgba(168, 85, 247, 0.5)',
    sunGlow: 'rgba(192, 132, 252, 0.28)',
    sunGlowMid: 'rgba(168, 85, 247, 0.08)',
    sunGlowEdge: 'rgba(168, 85, 247, 0)',
    sunFloor: 'rgba(192, 132, 252, 0.18)',
  };
}

/** Shared horizon Y for mesh perspective and sun placement. */
export function getHorizonY(height: number): number {
  return height * HORIZON_RATIO;
}

/** Horizon sun position — shared by draw + mesh lighting (testable, pure). */
export function getSunLayout(width: number, height: number): SunLayout {
  const horizon = getHorizonY(height);
  const radius = Math.min(width * 0.17, height * 0.34, 148);
  return { cx: width * 0.5, cy: horizon, radius };
}

/** 0–1 falloff from the digital sun; cheap per-line lighting for mesh strokes. */
export function sunIllumination(x: number, y: number, sun: SunLayout): number {
  const reachX = sun.radius * 2.85;
  const reachY = sun.radius * 1.35;
  const dx = (x - sun.cx) / reachX;
  const dy = (y - sun.cy) / reachY;
  const dist2 = dx * dx + dy * dy;
  if (dist2 >= 1) return 0;
  const core = 1 - dist2;
  return core * core * 0.42;
}

/** Lateral dimming for columns away from the vanishing point / sun axis. */
export function columnSunLit(u: number, sun: SunLayout): number {
  const base = sunIllumination(sun.cx, sun.cy, sun);
  return base * (1 - Math.abs(u) * 0.38);
}

type SunPaintCache = {
  key: string;
  glow: CanvasGradient;
  floor: CanvasGradient;
};

let sunPaintCache: SunPaintCache | null = null;

function getSunPaintCache(
  ctx: CanvasRenderingContext2D,
  sun: SunLayout,
  palette: MeshPalette,
  width: number,
  height: number,
  theme: MeshTheme
): SunPaintCache {
  const key = `${theme}|${width}|${height}|${sun.cx}|${sun.cy}|${sun.radius}`;
  if (sunPaintCache?.key === key) return sunPaintCache;

  const glow = ctx.createRadialGradient(
    sun.cx,
    sun.cy,
    sun.radius * 0.15,
    sun.cx,
    sun.cy,
    sun.radius * 2.9
  );
  glow.addColorStop(0, palette.sunGlow);
  glow.addColorStop(0.45, palette.sunGlowMid);
  glow.addColorStop(1, palette.sunGlowEdge);

  const floor = ctx.createLinearGradient(0, sun.cy, 0, height);
  floor.addColorStop(0, palette.sunFloor);
  floor.addColorStop(0.55, palette.sunGlowMid);
  floor.addColorStop(1, palette.sunGlowEdge);

  sunPaintCache = { key, glow, floor };
  return sunPaintCache;
}

function drawDigitalSun(
  ctx: CanvasRenderingContext2D,
  sun: SunLayout,
  palette: MeshPalette,
  width: number,
  height: number,
  theme: MeshTheme
): void {
  const { cx, cy, radius } = sun;
  if (radius < 8) return;

  const paint = getSunPaintCache(ctx, sun, palette, width, height, theme);

  ctx.fillStyle = paint.glow;
  ctx.globalAlpha = 1;
  ctx.fillRect(cx - radius * 3.2, cy - radius * 2.4, radius * 6.4, radius * 3.6);

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, Math.PI, 0);
  ctx.closePath();
  ctx.clip();

  const bandH = radius / SUN_BANDS;
  for (let i = 0; i < SUN_BANDS; i++) {
    if (i % 3 === 1) continue;

    const y = cy - radius + i * bandH;
    const t = i / (SUN_BANDS - 1);
    const bandAlpha = 0.34 + (1 - t) * 0.52;
    ctx.fillStyle = i % 2 === 0 ? palette.sunCore : palette.sunBand;
    ctx.globalAlpha = bandAlpha;
    ctx.fillRect(cx - radius, y, radius * 2, bandH + 0.5);
  }

  ctx.restore();

  ctx.globalAlpha = 0.5;
  ctx.strokeStyle = palette.sunCore;
  ctx.lineWidth = 1.25;
  ctx.beginPath();
  ctx.moveTo(cx - radius * 1.08, cy);
  ctx.lineTo(cx + radius * 1.08, cy);
  ctx.stroke();

  ctx.globalAlpha = 0.22;
  ctx.fillStyle = paint.floor;
  ctx.fillRect(0, cy, width, height - cy);

  ctx.globalAlpha = 1;
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
  const horizon = getHorizonY(height);
  const vanishX = width * 0.5;
  const span = width * 0.92;
  const sun = getSunLayout(width, height);

  ctx.clearRect(0, 0, width, height);
  if (width < 2 || height < 2) return;

  drawDigitalSun(ctx, sun, palette, width, height, theme);

  for (let r = 0; r <= ROWS; r++) {
    const depth = r / ROWS;
    const yBase = horizon + (height - horizon) * depth * depth;
    const y = yBase + waveOffset(0, depth, time);
    const lit = sunIllumination(vanishX, y, sun);
    const alpha = Math.min(1, (0.08 + depth * 0.92) * (1 + lit * 0.75) + lit * 0.18);

    ctx.beginPath();
    ctx.strokeStyle = depth < 0.35 ? palette.lineFar : lit > 0.15 ? palette.sunCore : palette.line;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = depth < 0.2 ? 0.6 : 1;

    for (let c = 0; c <= COLS; c++) {
      const u = c / COLS - 0.5;
      const x = vanishX + u * span * depth;
      const yPt = yBase + waveOffset(u, depth, time);
      if (c === 0) ctx.moveTo(x, yPt);
      else ctx.lineTo(x, yPt);
    }
    ctx.stroke();
  }

  for (let c = 0; c <= COLS; c++) {
    const u = c / COLS - 0.5;
    const lit = columnSunLit(u, sun);
    const baseAlpha = 0.35 + Math.abs(u) * 0.45;
    const alpha = Math.min(1, baseAlpha * (1 + lit * 0.85) + lit * 0.24);
    const centerCol = Math.abs(u) < 0.08;

    ctx.beginPath();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle =
      lit > 0.14 ? palette.sunCore : centerCol ? palette.accent : palette.line;

    for (let r = 0; r <= ROWS; r++) {
      const depth = r / ROWS;
      const yBase = horizon + (height - horizon) * depth * depth;
      const x = vanishX + u * span * depth;
      const y = yBase + waveOffset(u, depth, time);
      if (r === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.lineWidth = centerCol ? 1.1 : 0.75;
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
