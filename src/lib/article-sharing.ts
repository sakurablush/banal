/**
 * Article share link — copy current article URL to clipboard.
 */

export async function copyArticleShareLink(url?: string): Promise<boolean> {
  try {
    const link = url ?? window.location.href;
    await navigator.clipboard.writeText(link);
    return true;
  } catch {
    return false;
  }
}
