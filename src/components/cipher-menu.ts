/**
 * Cipher Rotary Menu — koncentriczne ringi nawigacyjne
 */
export interface CipherMenuItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  color?: string;
  subItems?: CipherMenuItem[];
}

export interface CipherMenuOptions {
  items: CipherMenuItem[];
  subItems?: CipherMenuItem[];
  size?: number;
  onNavigate?: (item: CipherMenuItem) => void;
}

export class CipherMenu {
  private readonly container: HTMLElement;
  private readonly items: CipherMenuItem[];
  private readonly size: number;

  constructor(opts: CipherMenuOptions) {
    this.container = document.createElement('div');
    this.container.className = 'cipher-menu';
    this.items = opts.items;
    this.size = opts.size || 400;
    this.render();
  }

  private render(): void {
    this.container.innerHTML = `
      <div class="cipher-menu-wrapper" style="width:${this.size}px;height:${this.size}px">
        <svg viewBox="0 0 400 400" class="cipher-svg"></svg>
        <div class="cipher-labels"></div>
      </div>
    `;
    this.renderSegments();
    this.renderCenter();
  }

  private renderSegments(): void {
    const svg = this.container.querySelector('.cipher-svg')!;
    const cx = 200, cy = 200;
    const outerR = 175, innerR = 125;
    const count = this.items.length;
    const gap = 3;
    const slice = (360 - count * gap) / count;

    this.items.forEach((item, i) => {
      const start = i * (slice + gap) - 90;
      const end = start + slice;
      const d = this.arc(cx, cy, innerR, outerR, start, end);

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      path.setAttribute('data-id', item.id);
      path.style.setProperty('--c', item.color || 'rgba(168,85,247,0.55)');
      svg.appendChild(path);

      path.addEventListener('click', () => {
        this.activate(item.id);
        window.location.href = item.href;
      });
    });

    const labels = this.container.querySelector('.cipher-labels')!;
    this.items.forEach((item, i) => {
      const angle = (i / count) * 2 * Math.PI - Math.PI / 2;
      const r = 150;
      const x = 200 + r * Math.cos(angle);
      const y = 200 + r * Math.sin(angle);
      const el = document.createElement('div');
      el.className = 'cipher-label';
      el.textContent = item.icon + ' ' + item.label;
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      labels.appendChild(el);
    });
  }

  private renderCenter(): void {
    const svg = this.container.querySelector('.cipher-svg')!;
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '200');
    circle.setAttribute('cy', '200');
    circle.setAttribute('r', '55');
    svg.appendChild(circle);
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', '200');
    text.setAttribute('y', '205');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('class', 'cipher-center-text');
    text.textContent = 'BANAL';
    svg.appendChild(text);
  }

  private activate(id: string): void {
    this.container.querySelectorAll<SVGElement>('.cipher-segment-active').forEach(el => {
      el.classList.remove('cipher-segment-active');
      el.setAttribute('fill', '');
    });
    const el = this.container.querySelector<SVGElement>(`[data-id="${id}"]`);
    if (el) {
      el.classList.add('cipher-segment-active');
      el.setAttribute('fill', 'rgba(168,85,247,0.85)');
    }
  }

  private arc(cx: number, cy: number, ir: number, or: number, s: number, e: number): string {
    const p1 = this.cart(cx, cy, or, e);
    const p2 = this.cart(cx, cy, or, s);
    const p3 = this.cart(cx, cy, ir, s);
    const p4 = this.cart(cx, cy, ir, e);
    const large = e - s > 180 ? 1 : 0;
    return [
      'M', p1.x, p1.y,
      'A', or, or, 0, large, 0, p2.x, p2.y,
      'L', p3.x, p3.y,
      'A', ir, ir, 0, large, 1, p4.x, p4.y,
      'Z'
    ].join(' ');
  }

  private cart(cx: number, cy: number, r: number, a: number): {x: number; y: number} {
    const rad = (a * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  public mount(el: HTMLElement | string): void {
    const target = typeof el === 'string' ? document.querySelector(el) : el;
    if (target) target.appendChild(this.container);
  }

  public destroy(): void {
    this.container.remove();
  }
}
