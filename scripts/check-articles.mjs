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
    ['tools-mentioned', html.includes('tools-mentioned')],
    ['en block', html.includes('data-lang-only="en"')],
    ['ja block', html.includes('data-lang-only="ja"')],
    ['repo link', html.includes('sakurablush/banal')],
    ['no placeholder github', !html.includes('href="https://github.com"')],
    ['banal tools link', html.includes('#ai-tools')],
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
}

if (issues.length) {
  console.error(issues.join('\n'));
  process.exit(1);
}
console.log('Article checks passed');
