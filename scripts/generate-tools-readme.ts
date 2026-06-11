/**
 * Generate Tools Directory section for README.md
 *
 * This script imports all tools from zero-key-tools.ts and generates
 * a markdown table grouped by category with table of contents.
 *
 * Usage: npx tsx scripts/generate-tools-readme.ts
 *
 * Output: Prints markdown to stdout. Redirect to a file or copy to README.
 */

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
  'self-host': 'Self-host',
};

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

  // Group tools by category
  const byCategory: Record<ZeroKeyCategory, typeof zeroKeyTools> = {} as any;
  for (const tool of zeroKeyTools) {
    byCategory[tool.category] ??= [];
    byCategory[tool.category].push(tool);
  }

  // Header
  lines.push(`## 📋 Tools Directory (${zeroKeyTools.length} verified free AI tools)`);
  lines.push('');
  lines.push(
    '> Auto-generated from `src/data/zero-key-tools.ts`. Run `npx tsx scripts/generate-tools-readme.ts` to update.'
  );
  lines.push('');

  // Table of Contents
  lines.push('### Quick Jump');
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
  lines.push(tocParts.join(' | '));
  lines.push('');

  // Category sections
  for (const cat of categoryOrder) {
    const tools = byCategory[cat];
    if (!tools || tools.length === 0) continue;

    const label = categoryLabels[cat];
    lines.push(`### ${label}`);
    lines.push('');
    lines.push('| Tool | Description | Type | Access |');
    lines.push('|------|-------------|------|--------|');

    for (const tool of tools) {
      const emoji = surfaceEmoji[tool.surface] || '🔧';
      const typeLabel = `${emoji} ${tool.surface.toUpperCase()}`;
      const access = accessLabels[tool.access] || tool.access;
      const name = `[${escapeMarkdown(tool.name)}](${tool.url})`;
      const desc = escapeMarkdown(
        tool.bestFor.slice(0, 80) + (tool.bestFor.length > 80 ? '...' : '')
      );
      lines.push(`| ${name} | ${desc} | ${typeLabel} | ${access} |`);
    }

    lines.push('');
  }

  // Footer
  lines.push('---');
  lines.push('');
  lines.push(
    `*Total: ${zeroKeyTools.length} tools across ${categoryOrder.filter((c) => byCategory[c]?.length > 0).length} categories. Last generated: ${new Date().toISOString().split('T')[0]}*`
  );
  lines.push('');

  return lines.join('\n');
}

// Run
console.log(generateToolsReadme());
