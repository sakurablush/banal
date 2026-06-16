/**
 * Generate docs/TOOLS-DIRECTORY.md and sync the README tools catalog.
 *
 * Usage: npm run generate:tools-readme
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { zeroKeyTools } from '../src/data/zero-key-tools';
import { syncReadmeVerification } from '../src/lib/latest-verification';
import {
  README_SECTION_END,
  README_SECTION_START,
  generateReadmeToolsSection,
  generateToolsDirectoryDoc,
} from '../src/lib/tools-directory-markdown';

const OUTPUT_PATH = resolve(import.meta.dirname, '../docs/TOOLS-DIRECTORY.md');
const README_PATH = resolve(import.meta.dirname, '../README.md');

function syncReadmeToolsSection(): boolean {
  const readme = readFileSync(README_PATH, 'utf8');
  const start = readme.indexOf(README_SECTION_START);
  const end = readme.indexOf(README_SECTION_END);

  if (start === -1 || end === -1 || end <= start) {
    throw new Error(
      `README.md must contain ${README_SECTION_START} and ${README_SECTION_END} markers`
    );
  }

  const sectionBody = generateReadmeToolsSection();
  const currentBody = readme
    .slice(start + README_SECTION_START.length, end)
    .trim();
  if (currentBody === sectionBody) return false;

  const before = readme.slice(0, start + README_SECTION_START.length);
  const after = readme.slice(end);
  writeFileSync(README_PATH, `${before}\n\n${sectionBody}\n\n${after}`, 'utf8');
  return true;
}

const markdown = generateToolsDirectoryDoc();
writeFileSync(OUTPUT_PATH, markdown, 'utf8');
console.log(`Wrote ${OUTPUT_PATH} (${zeroKeyTools.length} tools)`);

const readmeToolsUpdated = syncReadmeToolsSection();
console.log(
  readmeToolsUpdated
    ? `Updated README.md tools directory section (${zeroKeyTools.length} tools)`
    : `README.md tools directory section already current (${zeroKeyTools.length} tools)`
);

const { updated, snapshot } = syncReadmeVerification(resolve(import.meta.dirname, '..'));
if (snapshot) {
  console.log(
    updated
      ? `Updated README.md verification line (${snapshot.verified}/${snapshot.totalTools} as of ${snapshot.date})`
      : `README.md verification line already current (${snapshot.verified}/${snapshot.totalTools} as of ${snapshot.date})`
  );
}
