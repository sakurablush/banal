/**
 * One-off generator: builds src/data/zero-key-tools-ja.ts from tools-en-export.json + JA map.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const en = JSON.parse(readFileSync(join(root, 'tools-en-export.json'), 'utf8'));

/** @type {Record<string, { bestFor: string; qualityNote: string; caveat?: string }>} */
const JA = JSON.parse(readFileSync(join(root, 'scripts', 'zero-key-tools-ja-map.json'), 'utf8'));

const ids = en.map((t) => t.id);
const missing = ids.filter((id) => !JA[id]);
const extra = Object.keys(JA).filter((id) => !ids.includes(id));
if (missing.length) throw new Error(`Missing JA entries: ${missing.join(', ')}`);
if (extra.length) throw new Error(`Extra JA entries: ${extra.join(', ')}`);

const lines = [
  '/**',
  ' * Japanese copy for zero-key tools. Keys match zero-key-tools.ts id fields.',
  ' */',
  'export const zeroKeyToolsJa: Record<string, { bestFor: string; qualityNote: string; caveat?: string }> = {',
];

for (const id of ids) {
  const t = JA[id];
  lines.push(`  '${id}': {`);
  lines.push(`    bestFor: ${JSON.stringify(t.bestFor)},`);
  lines.push(`    qualityNote: ${JSON.stringify(t.qualityNote)},`);
  if (t.caveat) lines.push(`    caveat: ${JSON.stringify(t.caveat)},`);
  lines.push('  },');
}

lines.push('};', '');
writeFileSync(join(root, 'src', 'data', 'zero-key-tools-ja.ts'), lines.join('\n'), 'utf8');
console.log(`Wrote ${ids.length} entries to src/data/zero-key-tools-ja.ts`);
