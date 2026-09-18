/**
 * Keep zk2 content/tiles height at the usual cap, but grow it when the
 * sidebar (categories + filters) is taller than that cap.
 */

import { PANEL_TILES_MIN_HEIGHT_PX, ZK2_CONTENT_MAX_HEIGHT_PX } from './layout-tokens';

/** Keep in sync with `@media (max-width: 900px)` in style.css */
export const ZK2_LAYOUT_MOBILE_BREAKPOINT_PX = 900;

const MIN_HEIGHT_VAR = '--zk2-layout-min-height';
const MAX_HEIGHT_VAR = '--zk2-content-max-height';
const LAYOUT_HEIGHT_VAR = '--zk2-layout-height';
const MOBILE_MEDIA = `(max-width: ${ZK2_LAYOUT_MOBILE_BREAKPOINT_PX}px)`;

function readPxVar(element: HTMLElement, varName: string, fallback: number): number {
  const probe = document.createElement('div');
  probe.style.cssText = `position:absolute;visibility:hidden;height:var(${varName});pointer-events:none;`;
  element.appendChild(probe);
  const height = probe.offsetHeight || fallback;
  probe.remove();
  return height;
}

export function computeZk2LayoutHeight(
  minHeight: number,
  maxHeight: number,
  sidebarHeight: number
): number {
  const baseline = Math.max(minHeight, maxHeight);
  if (sidebarHeight > baseline) {
    return Math.max(minHeight, sidebarHeight);
  }
  return baseline;
}

export function measureZk2SidebarNaturalHeight(sidebarColumn: HTMLElement): number {
  const style = getComputedStyle(sidebarColumn);
  const rowGap = Number.parseFloat(style.rowGap) || 0;

  let headingHeight = 0;
  sidebarColumn
    .querySelectorAll('.zk2-sidebar-categories-heading, .zk2-sidebar-filters-heading')
    .forEach((el) => {
      headingHeight = Math.max(headingHeight, (el as HTMLElement).getBoundingClientRect().height);
    });

  let panelHeight = 0;
  sidebarColumn.querySelectorAll('.zk2-sidebar-nav-panel').forEach((el) => {
    panelHeight = Math.max(panelHeight, (el as HTMLElement).scrollHeight);
  });

  return Math.ceil(headingHeight + rowGap + panelHeight);
}

export function isZk2LayoutMobileViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(MOBILE_MEDIA).matches;
}

export function syncZk2LayoutHeight(layout: HTMLElement): void {
  if (typeof window === 'undefined') return;

  if (isZk2LayoutMobileViewport()) {
    layout.style.removeProperty(LAYOUT_HEIGHT_VAR);
    return;
  }

  const sidebar = layout.querySelector('.zk2-sidebar-column') as HTMLElement | null;
  if (!sidebar) return;

  const minHeight = readPxVar(layout, MIN_HEIGHT_VAR, PANEL_TILES_MIN_HEIGHT_PX);
  const maxHeight = readPxVar(layout, MAX_HEIGHT_VAR, ZK2_CONTENT_MAX_HEIGHT_PX);
  const sidebarHeight = measureZk2SidebarNaturalHeight(sidebar);
  const height = computeZk2LayoutHeight(minHeight, maxHeight, sidebarHeight);
  const next = `${height}px`;

  if (layout.style.getPropertyValue(LAYOUT_HEIGHT_VAR) !== next) {
    layout.style.setProperty(LAYOUT_HEIGHT_VAR, next);
  }
}

function observeSidebarPanels(layout: HTMLElement, observer: ResizeObserver): void {
  layout.querySelectorAll('.zk2-sidebar-nav-panel').forEach((panel) => {
    observer.observe(panel);
  });
}

export function bindZk2LayoutHeightSync(layout: HTMLElement): () => void {
  let rafId = 0;

  const scheduleSync = () => {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = 0;
      syncZk2LayoutHeight(layout);
    });
  };

  const sidebar = layout.querySelector('.zk2-sidebar-column');
  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(scheduleSync) : null;

  if (ro) {
    if (sidebar) {
      ro.observe(sidebar);
    }
    observeSidebarPanels(layout, ro);
  }

  window.addEventListener('resize', scheduleSync, { passive: true });
  scheduleSync();

  return () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
    ro?.disconnect();
    window.removeEventListener('resize', scheduleSync);
    layout.style.removeProperty(LAYOUT_HEIGHT_VAR);
  };
}
