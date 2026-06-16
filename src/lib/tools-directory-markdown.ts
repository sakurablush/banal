/**
 * Markdown generators for the public tools catalog (README + docs).
 */

import { zeroKeyTools, categoryLabels, type ZeroKeyCategory } from '../data/zero-key-tools';
import { getSiteStats } from '../data/site-stats';

export const README_SECTION_START = '<!-- tools-directory:start -->';
export const README_SECTION_END = '<!-- tools-directory:end -->';

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

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function escapeMarkdownTableCell(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

export function escapeMarkdownLinkText(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/\[/g, '\\[').replace(/\]/g, '\\]');
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function groupToolsByCategory(): {
  categoryOrder: ZeroKeyCategory[];
  byCategory: Record<ZeroKeyCategory, typeof zeroKeyTools>;
} {
  const byCategory: Record<ZeroKeyCategory, typeof zeroKeyTools> = {} as Record<
    ZeroKeyCategory,
    typeof zeroKeyTools
  >;
  for (const tool of zeroKeyTools) {
    byCategory[tool.category] ??= [];
    byCategory[tool.category].push(tool);
  }

  const categoryOrder = (Object.keys(categoryLabels) as ZeroKeyCategory[]).filter(
    (cat) => (byCategory[cat]?.length ?? 0) > 0
  );

  return { categoryOrder, byCategory };
}

function renderCategoryTable(tools: typeof zeroKeyTools): string[] {
  const lines: string[] = [];
  lines.push('| Tool | Best for | Surface | Access |');
  lines.push('|------|----------|---------|--------|');

  for (const tool of tools) {
    const emoji = surfaceEmoji[tool.surface] || '🔧';
    const typeLabel = `${emoji} ${tool.surface.toUpperCase()}`;
    const access = accessLabels[tool.access] || tool.access;
    const name = `[${escapeMarkdownLinkText(tool.name)}](${tool.url})`;
    const desc = escapeMarkdownTableCell(
      tool.bestFor.slice(0, 80) + (tool.bestFor.length > 80 ? '…' : '')
    );
    lines.push(`| ${name} | ${desc} | ${typeLabel} | ${access} |`);
  }

  return lines;
}

function renderQuickJumpBullets(
  categoryOrder: ZeroKeyCategory[],
  byCategory: Record<ZeroKeyCategory, typeof zeroKeyTools>,
  prefix: 'ai' | 'dev'
): string[] {
  const lines: string[] = [];
  for (const cat of categoryOrder) {
    if (!cat.startsWith(prefix === 'ai' ? 'ai-' : 'dev-')) continue;
    const tools = byCategory[cat];
    if (!tools || tools.length === 0) continue;
    const label = categoryLabels[cat];
    const slug = slugify(label);
    lines.push(`- [${label}](#${slug}) (${tools.length})`);
  }
  return lines;
}

function renderReadmeCategoryBlock(
  cat: ZeroKeyCategory,
  tools: typeof zeroKeyTools,
  openByDefault: boolean
): string[] {
  const label = categoryLabels[cat];
  const slug = slugify(label);
  const lines: string[] = [];

  lines.push(`<a id="${slug}"></a>`);
  lines.push(`<details${openByDefault ? ' open' : ''}>`);
  lines.push(`<summary><strong>${escapeHtml(label)}</strong> (${tools.length})</summary>`);
  lines.push('');
  lines.push(...renderCategoryTable(tools));
  lines.push('');
  lines.push('</details>');
  lines.push('');

  return lines;
}

export function generateToolsDirectoryDoc(): string {
  const stats = getSiteStats();
  const lines: string[] = [];
  const { categoryOrder, byCategory } = groupToolsByCategory();

  lines.push('# Tools Directory');
  lines.push('');
  lines.push(
    `${stats.total} curated tools — ${stats.ai} AI, ${stats.dev} developer. Each row links to the public URL with honest access labels.`
  );
  lines.push('');
  lines.push(
    '> Auto-generated from `src/data/zero-key-tools.ts`. Run `npm run generate:tools-readme` to update. [View on README](../README.md#tools-directory).'
  );
  lines.push('');
  lines.push('## Quick jump');
  lines.push('');
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
    lines.push(...renderCategoryTable(tools));
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push(
    `*${stats.total} tools across ${categoryOrder.length} categories. Last generated: ${new Date().toISOString().split('T')[0]}.*`
  );
  lines.push('');

  return lines.join('\n');
}

export function generateReadmeToolsSection(): string {
  const stats = getSiteStats();
  const lines: string[] = [];
  const { categoryOrder, byCategory } = groupToolsByCategory();
  let firstAiCategory = true;

  lines.push(
    `> **${stats.total} tools** (${stats.ai} AI · ${stats.dev} developer) — auto-generated from \`src/data/zero-key-tools.ts\`. Run \`npm run generate:tools-readme\` after catalog edits.`
  );
  lines.push('');
  lines.push(`### Quick jump — AI (${stats.ai})`);
  lines.push('');
  lines.push(...renderQuickJumpBullets(categoryOrder, byCategory, 'ai'));
  lines.push('');
  lines.push(`### Quick jump — Developer (${stats.dev})`);
  lines.push('');
  lines.push(...renderQuickJumpBullets(categoryOrder, byCategory, 'dev'));
  lines.push('');
  lines.push(
    'Expand a category below, or open the [flat directory](docs/TOOLS-DIRECTORY.md) for the same tables without collapsibles.'
  );
  lines.push('');
  lines.push('### AI tools');
  lines.push('');

  for (const cat of categoryOrder) {
    if (!cat.startsWith('ai-')) continue;
    const tools = byCategory[cat];
    if (!tools || tools.length === 0) continue;
    lines.push(...renderReadmeCategoryBlock(cat, tools, firstAiCategory));
    firstAiCategory = false;
  }

  lines.push('### Developer tools');
  lines.push('');

  for (const cat of categoryOrder) {
    if (!cat.startsWith('dev-')) continue;
    const tools = byCategory[cat];
    if (!tools || tools.length === 0) continue;
    lines.push(...renderReadmeCategoryBlock(cat, tools, false));
  }

  return lines.join('\n').trimEnd();
}
