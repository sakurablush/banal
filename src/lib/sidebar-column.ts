/**
 * Navigation column: categories (left) beside filters/tags (right).
 */

export interface SidebarFiltersOptions {
  quickFilters?: HTMLElement | null;
  toolbar?: HTMLElement | null;
  /** Visible panel title (e.g. "Refine") */
  heading?: string;
  /** Unique id for heading — required when heading is set on pages with multiple panels */
  headingId?: string;
  /** Accessible region label; defaults to heading when omitted */
  ariaLabel?: string;
}

export interface SidebarColumnOptions extends SidebarFiltersOptions {
  sidebar: HTMLElement;
  categoriesHeading?: string;
  categoriesHeadingId?: string;
}

let headingIdCounter = 0;

function hasFilterContent(el?: HTMLElement | null): boolean {
  return !!el && el.childElementCount > 0;
}

function createFiltersDivider(): HTMLElement {
  const divider = document.createElement('div');
  divider.className = 'zk2-sidebar-filters-divider';
  divider.setAttribute('aria-hidden', 'true');
  return divider;
}

function createNavPanelBody(): HTMLElement {
  const body = document.createElement('div');
  body.className = 'zk2-sidebar-nav-panel';
  return body;
}

function getNavPanelBody(panel: HTMLElement): HTMLElement {
  return panel.querySelector(':scope > .zk2-sidebar-nav-panel') ?? panel;
}

function createNavHeading(label: string, className: string, headingId?: string): HTMLElement {
  const heading = document.createElement('h3');
  heading.className = className;
  heading.id = headingId ?? `zk2-sidebar-heading-${++headingIdCounter}`;
  heading.textContent = label;
  return heading;
}

export function buildSidebarFiltersPanel(options: SidebarFiltersOptions): HTMLElement | null {
  const quickFilters = hasFilterContent(options.quickFilters) ? options.quickFilters! : null;
  const toolbar = options.toolbar ?? null;
  if (!quickFilters && !toolbar) return null;

  const panel = document.createElement('div');
  panel.className = 'zk2-sidebar-filters';

  let heading: HTMLElement | null = null;
  if (options.heading) {
    heading = createNavHeading(options.heading, 'zk2-sidebar-filters-heading', options.headingId);
    panel.appendChild(heading);
  }

  const body = createNavPanelBody();
  body.setAttribute('role', 'region');
  const ariaLabel = options.ariaLabel ?? options.heading;
  if (ariaLabel) {
    body.setAttribute('aria-label', ariaLabel);
  }
  if (heading) {
    body.setAttribute('aria-labelledby', heading.id);
  }

  if (quickFilters) {
    body.appendChild(quickFilters);
  }

  if (quickFilters && toolbar) {
    body.appendChild(createFiltersDivider());
  }

  if (toolbar) {
    toolbar.classList.add('filter-toolbar--sidebar');
    body.appendChild(toolbar);
  }

  panel.appendChild(body);

  return panel;
}

function createCategoriesWrap(options: SidebarColumnOptions): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'zk2-sidebar-categories';

  let heading: HTMLElement | null = null;
  if (options.categoriesHeading) {
    heading = createNavHeading(
      options.categoriesHeading,
      'zk2-sidebar-categories-heading',
      options.categoriesHeadingId
    );
    wrap.appendChild(heading);
  }

  const body = createNavPanelBody();
  body.setAttribute('role', 'navigation');
  if (heading) {
    body.setAttribute('aria-labelledby', heading.id);
  }
  body.appendChild(options.sidebar);
  wrap.appendChild(body);

  return wrap;
}

/** Keep toolbar stable; only replace the quick-filter chip row when results change. */
export function syncQuickFiltersInPanel(
  panel: HTMLElement,
  quickFilters: HTMLElement | null
): void {
  const body = getNavPanelBody(panel);
  const nextFilters = hasFilterContent(quickFilters) ? quickFilters : null;
  body.querySelector('.quick-filters-row')?.remove();

  const toolbar = body.querySelector('.filter-toolbar');
  const divider = body.querySelector('.zk2-sidebar-filters-divider');

  if (!nextFilters) {
    divider?.remove();
    return;
  }

  const insertBefore = divider ?? toolbar ?? null;

  if (insertBefore) {
    body.insertBefore(nextFilters, insertBefore);
    if (toolbar && !body.querySelector('.zk2-sidebar-filters-divider')) {
      body.insertBefore(createFiltersDivider(), toolbar);
    }
    return;
  }

  divider?.remove();
  body.appendChild(nextFilters);
}

export function createSidebarColumn(options: SidebarColumnOptions): HTMLElement {
  const column = document.createElement('div');
  column.className = 'zk2-sidebar-column';

  column.appendChild(createCategoriesWrap(options));

  const panel = buildSidebarFiltersPanel(options);
  if (panel) {
    column.appendChild(panel);
  } else {
    column.classList.add('zk2-sidebar-column--categories-only');
  }

  return column;
}
