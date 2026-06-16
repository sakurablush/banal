import { describe, it, expect, vi } from 'vitest';
import { createCloseButton } from '../src/lib/close-button';

describe('createCloseButton', () => {
  it('renders an accessible button with a centered SVG icon', () => {
    const onClick = vi.fn();
    const btn = createCloseButton({ label: 'Close', onClick });

    expect(btn.type).toBe('button');
    expect(btn.className).toBe('icon-close-btn');
    expect(btn.getAttribute('aria-label')).toBe('Close');

    const icon = btn.querySelector('svg');
    expect(icon).toBeTruthy();
    expect(icon!.getAttribute('aria-hidden')).toBe('true');
    expect(icon!.querySelector('path')).toBeTruthy();
  });

  it('appends optional class names and handles clicks', () => {
    const onClick = vi.fn();
    const btn = createCloseButton({
      className: 'prompt-accordion-close',
      label: '閉じる',
      onClick,
    });

    expect(btn.className).toBe('icon-close-btn prompt-accordion-close');
    btn.click();
    expect(onClick).toHaveBeenCalledOnce();
  });
});
