/**
 * Generate the full tools directory for docs/TOOLS-DIRECTORY.md
 *
 * Imports all tools from zero-key-tools.ts and writes a markdown table
 * grouped by category with a quick-jump table of contents.
 *
 * Usage: npm run generate:tools-readme
 */

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { zeroKeyTools, categoryLabels, type ZeroKeyCategory } from '../src/data/zero-key-tools';

const surfaceEmoji: Record<string, string> = {
  web: '🌐',
  api: '📡',
  cli: '💻',
};

const accessLabels: Record<string, string> = {
  'no-login': 'No login',
  'public-api': 'Public API',
  'open-source': 'Open source',
  'free-tier': 'Free tier',
  'free-key': 'Free API key',
  'self-host': 'Self-host',
};

const OUTPUT_PATH = resolve(import.meta.dirname, '../docs/TOOLS-DIRECTORY.md');

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function escapeMarkdown(text: string): string {
  return text.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function generateToolsReadme(): string {
  const lines: string[] = [];
  const aiCount = zeroKeyTools.filter((t) => t.category.startsWith('ai-')).length;
  const devCount = zeroKeyTools.filter((t) => t.category.startsWith('dev-')).length;

  lines.push('# Tools Directory');
  lines.push('');
  lines.push(
    `${zeroKeyTools.length} curated tools — ${aiCount} AI, ${devCount} developer. Each row links to the public URL with honest access labels.`
  );
  lines.push('');
  lines.push(
    '> Auto-generated from `src/data/zero-key-tools.ts`. Run `npm run generate:tools-readme` to update.'
  );
  lines.push('');

  const byCategory: Record<ZeroKeyCategory, typeof zeroKeyTools> = {} as Record<
    ZeroKeyCategory,
    typeof zeroKeyTools
  >;
  for (const tool of zeroKeyTools) {
    byCategory[tool.category] ??= [];
    byCategory[tool.category].push(tool);
  }

  lines.push('## Quick jump');
  lines.push('');
  const categoryOrder = Object.keys(categoryLabels) as ZeroKeyCategory[];
  const tocParts: string[] = [];
  for (const cat of categoryOrder) {
    const tools = byCategory[cat];
    if (!tools || tools.length === 0) continue;
    const label = categoryLabels[cat];
    const slug = slugify(label);
    tocParts.push(`[${label}](#${slug}) (${tools.length})`);
  }
  lines.push(tocParts.join(' · '));
  lines.push('');

  for (const cat of categoryOrder) {
    const tools = byCategory[cat];
    if (!tools || tools.length === 0) continue;

    const label = categoryLabels[cat];
    lines.push(`## ${label}`);
    lines.push('');
    lines.push('| Tool | Best for | Surface | Access |');
    lines.push('|------|----------|---------|--------|');

    for (const tool of tools) {
      const emoji = surfaceEmoji[tool.surface] || '🔧';
      const typeLabel = `${emoji} ${tool.surface.toUpperCase()}`;
      const access = accessLabels[tool.access] || tool.access;
      const name = `[${escapeMarkdown(tool.name)}](${tool.url})`;
      const desc = escapeMarkdown(
        tool.bestFor.slice(0, 80) + (tool.bestFor.length > 80 ? '…' : '')
      );
      lines.push(`| ${name} | ${desc} | ${typeLabel} | ${access} |`);
    }

    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push(
    `*${zeroKeyTools.length} tools across ${categoryOrder.filter((c) => byCategory[c]?.length > 0).length} categories. Last generated: ${new Date().toISOString().split('T')[0]}.*`
  );
  lines.push('');

  return lines.join('\n');
}

const markdown = generateToolsReadme();
writeFileSync(OUTPUT_PATH, markdown, 'utf8');
console.log(`Wrote ${OUTPUT_PATH} (${zeroKeyTools.length} tools)`);
