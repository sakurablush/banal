/**
 * Measure production bundle sizes after `npm run build`.
 *
 * Baseline (pre perf split, 2026-06-17): shared i18n chunk ~437 KB raw; homepage critical JS ~496 KB raw.
 * Post split (2026-06-17): i18n chunk ~175 KB raw / ~51 KB gzip; homepage critical JS ~232 KB raw / ~70 KB gzip.
 *
 * Lighthouse manual checklist (production preview on localhost:4173):
 * - Homepage cold load: LCP, TBT, JS transfer size
 * - Article page: no Google Fonts network requests
 * - EN/JA toggle, hero mesh, AI tools search/filters, light/dark theme
 * - prefers-reduced-motion: aurora + canvas paused
 *
 * Usage: node scripts/measure-bundle.mjs [--fail-kb=N]
 */

import { readdirSync, readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const distAssets = join(root, 'dist', 'assets');
const distIndex = join(root, 'dist', 'index.html');

const failKbArg = process.argv.find((a) => a.startsWith('--fail-kb='));
const failKb = failKbArg ? Number(failKbArg.split('=')[1]) : null;

function gzipSize(bytes) {
  return gzipSync(bytes).length;
}

function formatKb(n) {
  return `${(n / 1024).toFixed(1)} KB`;
}

function listAssets() {
  try {
    return readdirSync(distAssets)
      .filter((f) => f.endsWith('.js') || f.endsWith('.css'))
      .map((f) => {
        const buf = readFileSync(join(distAssets, f));
        return {
          name: f,
          raw: buf.length,
          gzip: gzipSize(buf),
        };
      })
      .sort((a, b) => b.raw - a.raw);
  } catch {
    console.error('Run `npm run build` first — dist/assets not found.');
    process.exit(1);
  }
}

function parseHomepageScripts(html) {
  const scripts = [];
  const re = /<script[^>]+src="\.\/assets\/([^"]+\.js)"[^>]*>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    scripts.push(m[1]);
  }
  const cssRe = /<link[^>]+href="\.\/assets\/([^"]+\.css)"[^>]*>/g;
  const styles = [];
  while ((m = cssRe.exec(html)) !== null) {
    styles.push(m[1]);
  }
  return { scripts, styles };
}

const assets = listAssets();
const assetMap = new Map(assets.map((a) => [a.name, a]));

console.log('\nBanal bundle report\n');
console.log('File                          Raw        Gzip');
console.log('─'.repeat(52));
for (const a of assets) {
  const pad = a.name.padEnd(28);
  console.log(`${pad} ${formatKb(a.raw).padStart(10)} ${formatKb(a.gzip).padStart(10)}`);
}

let homepageJsRaw = 0;
let homepageJsGzip = 0;
let homepageCssRaw = 0;
let homepageCssGzip = 0;

try {
  const html = readFileSync(distIndex, 'utf8');
  const { scripts, styles } = parseHomepageScripts(html);
  console.log('\nHomepage entry (from index.html):');
  for (const s of scripts) {
    const a = assetMap.get(s);
    if (a) {
      console.log(`  JS  ${s}: ${formatKb(a.raw)} raw / ${formatKb(a.gzip)} gzip`);
      homepageJsRaw += a.raw;
      homepageJsGzip += a.gzip;
    }
  }
  for (const s of styles) {
    const a = assetMap.get(s);
    if (a) {
      console.log(`  CSS ${s}: ${formatKb(a.raw)} raw / ${formatKb(a.gzip)} gzip`);
      homepageCssRaw += a.raw;
      homepageCssGzip += a.gzip;
    }
  }
  console.log(
    `\nHomepage critical JS total:  ${formatKb(homepageJsRaw)} raw / ${formatKb(homepageJsGzip)} gzip`
  );
  console.log(
    `Homepage CSS total:          ${formatKb(homepageCssRaw)} raw / ${formatKb(homepageCssGzip)} gzip`
  );

  const i18nChunk = assets.find((a) => /^i18n-.*\.js$/.test(a.name) && !a.name.includes('ja'));
  if (i18nChunk && scripts.length > 0) {
    const bootRaw = homepageJsRaw + i18nChunk.raw;
    const bootGzip = homepageJsGzip + i18nChunk.gzip;
    console.log(
      `\nHomepage boot JS (main + ${i18nChunk.name}): ${formatKb(bootRaw)} raw / ${formatKb(bootGzip)} gzip`
    );
  }
} catch {
  console.warn('\nCould not parse dist/index.html');
}

if (failKb != null && !Number.isNaN(failKb)) {
  const limit = failKb * 1024;
  if (homepageJsGzip > limit) {
    console.error(
      `\nFAIL: homepage JS gzip ${formatKb(homepageJsGzip)} exceeds ${failKb} KB limit`
    );
    process.exit(1);
  }
  console.log(`\nOK: homepage JS gzip within ${failKb} KB limit`);
}

console.log('');
