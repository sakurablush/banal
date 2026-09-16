/**
 * Hero cosmic canvas — WebGL port of the musicflow shader.
 * Replaces the 2D horizon-mesh canvas on the hero section.
 *
 * Contract preserved: initHeroMesh(root) => cleanup, so src/main.ts wiring is unchanged.
 * Pauses when: off-screen (IntersectionObserver), tab hidden, prefers-reduced-motion,
 * or WebGL is unavailable (falls back to static CSS gradient — no JS crash).
 */

import * as THREE from 'three';
import { cosmicFragmentShader, cosmicVertexShader } from './cosmicShader';

const DPR_CAP = 1.5;
const FRAME_MS = 1000 / 30;

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function initHeroMesh(root: ParentNode = document): () => void {
  const section = root.querySelector('.hero-section');
  const canvas = root.querySelector('.hero-mesh-canvas') as HTMLCanvasElement | null;
  if (!section || !canvas) return () => {};

  // WebGL must be available — otherwise stay silent (CSS gradient handles visuals).
  const gl = canvas.getContext('webgl', { alpha: true, antialias: false });
  if (!gl) return () => {};

  const width = Math.max(1, Math.floor(section.getBoundingClientRect().width));
  const height = Math.max(1, Math.floor(section.getBoundingClientRect().height));

  const renderer = new THREE.WebGLRenderer({
    canvas,
    context: gl,
    precision: 'mediump',
    antialias: false,
    alpha: false,
    powerPreference: 'high-performance',
    stencil: false,
    depth: false,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, DPR_CAP));
  if (width > 0 && height > 0) renderer.setSize(width, height);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const uniforms: { [key: string]: THREE.IUniform } = {
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(width, height) },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uColor1: { value: new THREE.Vector3(0.08, 0.04, 0.01) },
    uColor2: { value: new THREE.Vector3(0.95, 0.65, 0.15) },
    uColor3: { value: new THREE.Vector3(1.0, 0.9, 0.6) },
    uSpeed: { value: 1.0 },
    uMorphSpeed: { value: 1.0 },
    uTwist: { value: 0.6 },
    uComplexity: { value: 1.2 },
    uBrightness: { value: 1.15 },
    uScanlineIntensity: { value: 0.45 },
    uAudioBass: { value: 0 },
    uAudioLevel: { value: 0 },
    uMode: { value: 0.0 },
    uPerfMode: { value: 1.0 },
  };

  const material = new THREE.ShaderMaterial({
    vertexShader: cosmicVertexShader,
    fragmentShader: cosmicFragmentShader,
    uniforms,
    depthWrite: false,
    depthTest: false,
  });

  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  scene.add(mesh);

  const mouse = { x: 0.5, y: 0.5 };

  const handleMouseMove = (e: MouseEvent): void => {
    const rect = section.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    mouse.x = (e.clientX - rect.left) / rect.width;
    mouse.y = 1.0 - (e.clientY - rect.top) / rect.height;
  };
  window.addEventListener('mousemove', handleMouseMove);

  const resize = (): void => {
    const rect = section.getBoundingClientRect();
    const w = Math.max(1, Math.floor(rect.width));
    const h = Math.max(1, Math.floor(rect.height));
    renderer.setSize(w, h);
    uniforms.uResolution.value.x = w;
    uniforms.uResolution.value.y = h;
  };

  const resizeObserver = new ResizeObserver(() => {
    resize();
    render();
  });
  resizeObserver.observe(section);

  let rafId = 0;
  let visible = true;
  let running = false;
  let lastFrame = 0;
  const clock = new THREE.Clock();

  const render = (): void => {
    if (prefersReducedMotion()) return;
    uniforms.uTime.value += clock.getDelta();
    uniforms.uMouse.value.x += (mouse.x - uniforms.uMouse.value.x) * 0.05;
    uniforms.uMouse.value.y += (mouse.y - uniforms.uMouse.value.y) * 0.05;
    renderer.render(scene, camera);
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
      render();
      lastFrame = now;
    }
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
      return;
    }
    lastFrame = performance.now();
    schedule();
  };
  motionMq.addEventListener('change', onMotion);

  start();

  return () => {
    stop();
    observer.disconnect();
    resizeObserver.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    motionMq.removeEventListener('change', onMotion);
    window.removeEventListener('mousemove', handleMouseMove);
    material.dispose();
    mesh.geometry.dispose();
    renderer.dispose();
  };
}
