/** Shared close (X) button with a flex-centered SVG icon. */

export interface CloseButtonOptions {
  className?: string;
  label: string;
  onClick: () => void;
}

function createCloseIconSvg(): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M6 6l12 12M18 6L6 18');
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', 'currentColor');
  path.setAttribute('stroke-width', '2');
  path.setAttribute('stroke-linecap', 'round');
  svg.appendChild(path);

  return svg;
}

export function createCloseButton(options: CloseButtonOptions): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = ['icon-close-btn', options.className].filter(Boolean).join(' ');
  btn.setAttribute('aria-label', options.label);
  btn.appendChild(createCloseIconSvg());
  btn.addEventListener('click', options.onClick);
  return btn;
}
