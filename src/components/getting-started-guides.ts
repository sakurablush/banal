/**
 * Getting Started Guides — Beginner-friendly guides for using AI tools.
 */

import type { Lang } from '../i18n';
import { getGettingStartedGuidesCopy } from '../data/getting-started-guides-copy';

export { getGettingStartedGuidesMeta } from '../data/getting-started-guides-copy';

function create<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (className) el.className = className;
  return el;
}

export function renderGettingStartedGuides(lang: Lang): HTMLElement {
  const copy = getGettingStartedGuidesCopy(lang);
  const container = create('div', 'getting-started-guides');

  const header = create('div', 'guides-header');
  const title = create('h2', 'guides-title');
  title.textContent = copy.title;
  header.appendChild(title);
  const subtitle = create('p', 'guides-subtitle');
  subtitle.textContent = copy.subtitle;
  header.appendChild(subtitle);
  container.appendChild(header);

  const grid = create('div', 'guides-grid');
  for (const guide of copy.guides) {
    const card = create('article', 'guide-card');

    const cardTitle = create('h3', 'guide-card-title');
    cardTitle.textContent = guide.title;
    card.appendChild(cardTitle);

    const cardDesc = create('p', 'guide-card-desc');
    cardDesc.textContent = guide.description;
    card.appendChild(cardDesc);

    const stepsList = create('ol', 'guide-steps');
    for (const step of guide.steps) {
      const li = create('li', 'guide-step');
      li.textContent = step;
      stepsList.appendChild(li);
    }
    card.appendChild(stepsList);

    grid.appendChild(card);
  }
  container.appendChild(grid);

  return container;
}
