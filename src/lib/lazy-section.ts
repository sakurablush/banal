/**
 * Mount below-fold UI when a section enters (or nears) the viewport.
 * Falls back to immediate mount when IntersectionObserver is unavailable.
 */
export function whenVisible(
  el: HTMLElement,
  cb: () => void,
  rootMargin = '200px'
): void {
  if (typeof IntersectionObserver === 'undefined') {
    cb();
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (entry?.isIntersecting) {
        io.disconnect();
        cb();
      }
    },
    { rootMargin }
  );

  io.observe(el);
}

/** Defer non-critical work until the browser is idle (with timeout fallback). */
export function whenIdle(cb: () => void, timeoutMs = 500): void {
  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(cb, { timeout: timeoutMs });
    return;
  }
  requestAnimationFrame(cb);
}
