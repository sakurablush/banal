import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'articles');
const slugs = ['free-ai-coding-setup-2026', 'honest-truth-ai-coding-agents-2026'];
const issues = [];

for (const slug of slugs) {
  const html = fs.readFileSync(path.join(root, slug, 'index.html'), 'utf8');
  const checks = [
    ['share btn', html.includes('id="article-share-btn"')],
    ['lang toggle', html.includes('id="lang-toggle"') && html.includes('lang-icon')],
    ['no legacy lang btn', !html.includes('article-lang-toggle')],
    ['article main', html.includes('article-page-main') && html.includes('page-shell')],
    ['back to top', html.includes('id="top"')],
    ['site footer', html.includes('site-footer-title')],
    ['tools-mentioned', html.includes('tools-mentioned')],
    ['en block', html.includes('data-lang-only="en"')],
    ['ja block', html.includes('data-lang-only="ja"')],
    ['repo link', html.includes('sakurablush/banal')],
    ['discussions link', html.includes('github.com/sakurablush/banal/discussions')],
    ['no placeholder github', !html.includes('href="https://github.com"')],
    ['banal tools link', html.includes('#ai-tools')],
    ['lang blocks', (html.match(/data-lang-only="/g) ?? []).length === 2],
    ['sibling lang blocks', /<\/div>\s*<div data-lang-only="ja" hidden>/.test(html)],
    ['banal ref links', html.includes('article-banal-ref')],
    [
      'published date',
      html.includes('class="article-published"') && html.includes('datetime="2026-06-16"'),
    ],
    ['agents table', slug === 'honest-truth-ai-coding-agents-2026' ? html.includes('article-table') : true],
  ];
  for (const [name, ok] of checks) {
    if (!ok) issues.push(`${slug}: failed ${name}`);
  }
  const enMatch = html.match(/<div data-lang-only="en">([\s\S]*)<div data-lang-only="ja" hidden>/);
  const jaMatch = html.match(/<div data-lang-only="ja" hidden>([\s\S]*)<\/div>\s*<\/article>/);
  const en = enMatch?.[1] ?? '';
  const ja = jaMatch?.[1] ?? '';
  if (!enMatch) issues.push(`${slug}: missing EN block boundary`);
  if (!jaMatch) issues.push(`${slug}: missing JA block boundary`);
  const enLinks = (en.match(/<a /g) ?? []).length;
  const jaLinks = (ja.match(/<a /g) ?? []).length;
  if (enLinks < 15) issues.push(`${slug}: only ${enLinks} EN links`);
  if (jaLinks < 15) issues.push(`${slug}: only ${jaLinks} JA links`);

  if (html.includes('(Banal)')) issues.push(`${slug}: legacy (Banal) inline text`);
  if (/data-lang-only="en">0/.test(html)) issues.push(`${slug}: corrupt EN dollar fragment`);
  if (/data-lang-only="ja" hidden>0/.test(html)) issues.push(`${slug}: corrupt JA dollar fragment`);

  const refMatch = html.match(/class="article-banal-ref"[\s\S]*?<span[^>]*>([^<]*)</);
  if (!refMatch) issues.push(`${slug}: missing article-banal-ref glyph`);
  else if (refMatch[1] !== '↗') issues.push(`${slug}: banal ref glyph is ${JSON.stringify(refMatch[1])}`);

  if (slug === 'honest-truth-ai-coding-agents-2026') {
    if (!en.includes('$100')) issues.push(`${slug}: EN missing $100`);
    if (!en.includes('get shit done')) issues.push(`${slug}: EN missing subtitle`);
    if (!ja.includes('10〜20倍')) issues.push(`${slug}: JA missing price takeaway`);
  }

  if (slug === 'free-ai-coding-setup-2026') {
    if (!en.includes('kilo-auto/free')) issues.push(`${slug}: EN missing kilo-auto/free`);
    if (!ja.includes('kilo-auto/free')) issues.push(`${slug}: JA missing kilo-auto/free`);
  }
}

if (issues.length) {
  console.error(issues.join('\n'));
  process.exit(1);
}
console.log('Article checks passed');
