/**
 * Append DOM nodes in frame-budget batches so the main thread stays responsive.
 * Pass shouldContinue to cancel in-flight batches when a newer render supersedes this one.
 */
export function appendChildrenBatched<T>(
  parent: HTMLElement,
  items: readonly T[],
  renderItem: (item: T, index: number) => HTMLElement,
  batchSize = 20,
  shouldContinue: () => boolean = () => true
): void {
  if (items.length === 0) return;

  let index = 0;

  const tick = (): void => {
    if (!shouldContinue()) return;

    const end = Math.min(index + batchSize, items.length);
    const fragment = document.createDocumentFragment();
    for (; index < end; index++) {
      fragment.appendChild(renderItem(items[index], index));
    }
    parent.appendChild(fragment);
    if (index < items.length && shouldContinue()) {
      requestAnimationFrame(tick);
    }
  };

  tick();
}
