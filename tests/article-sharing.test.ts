import { describe, it, expect, vi } from 'vitest';
import { copyArticleShareLink } from '../src/lib/article-sharing';

describe('copyArticleShareLink', () => {
  it('copies the provided URL to clipboard', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });

    const ok = await copyArticleShareLink('https://sakurablush.github.io/banal/articles/test/');

    expect(ok).toBe(true);
    expect(writeText).toHaveBeenCalledWith('https://sakurablush.github.io/banal/articles/test/');
  });

  it('returns false when clipboard write fails', async () => {
    vi.stubGlobal('navigator', {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
    });

    expect(await copyArticleShareLink('https://sakurablush.github.io/banal/articles/test/')).toBe(
      false
    );
  });
});
