/**
 * Shared stats row + scroll shell for directory module content panes.
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

export function createPanelContentHead(statsBar: HTMLElement): HTMLDivElement {
  const head = document.createElement('div');
  head.className = 'panel-content-head';
  head.appendChild(statsBar);
  return head;
}

export function createPanelScrollArea(): HTMLDivElement {
  const scroll = document.createElement('div');
  scroll.className = 'panel-content-scroll';
  return scroll;
}

/** Fixed stats head + scrollable body — tiles never paint under the stats row. */
export function mountPanelContent(
  container: HTMLElement,
  statsBar: HTMLElement,
  mountBody: (scrollArea: HTMLDivElement) => void
): void {
  const scroll = createPanelScrollArea();
  mountBody(scroll);
  container.replaceChildren(createPanelContentHead(statsBar), scroll);
}
