/**
 * Shared sticky stats row used at the top of scrollable module content.
 */

export function createPanelStatsBar(className: string, text: string): HTMLDivElement {
  const bar = document.createElement('div');
  bar.className = className;
  bar.setAttribute('role', 'status');
  bar.setAttribute('aria-live', 'polite');
  bar.setAttribute('aria-atomic', 'true');
  bar.textContent = text;
  return bar;
}
