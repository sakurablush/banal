import { describe, it, expect } from 'vitest';
import { zeroKeyTools, categoryLabels } from '../src/data/zero-key-tools';
import { getSiteStats } from '../src/data/site-stats';
import {
  escapeHtml,
  escapeMarkdownLinkText,
  escapeMarkdownTableCell,
  generateReadmeToolsSection,
  generateToolsDirectoryDoc,
  slugify,
} from '../src/lib/tools-directory-markdown';

describe('tools-directory-markdown', () => {
  it('slugify produces stable GitHub-friendly anchors', () => {
    expect(slugify('AI Chat & Assistants')).toBe('ai-chat-assistants');
    expect(slugify('Open Source Models (Download & Run Locally)')).toBe(
      'open-source-models-download-run-locally'
    );
  });

  it('escapes markdown and HTML edge cases', () => {
    expect(escapeMarkdownTableCell('a|b')).toBe('a\\|b');
    expect(escapeMarkdownLinkText('Tool [beta]')).toBe('Tool \\[beta\\]');
    expect(escapeHtml('A & B <script>')).toBe('A &amp; B &lt;script&gt;');
  });

  it('generateToolsDirectoryDoc includes every tool and category', () => {
    const doc = generateToolsDirectoryDoc();
    const stats = getSiteStats();
    expect(doc).toContain(`${stats.total} curated tools`);
    for (const tool of zeroKeyTools) {
      expect(doc).toContain(`[${escapeMarkdownLinkText(tool.name)}](${tool.url})`);
    }
    for (const label of Object.values(categoryLabels)) {
      expect(doc).toContain(`## ${label}`);
    }
  });

  it('generateReadmeToolsSection uses bullet quick jump and opens first AI category', () => {
    const section = generateReadmeToolsSection();
    expect(section).toContain('### Quick jump — AI');
    expect(section).toContain('### Quick jump — Developer');
    expect(section).toContain('- [AI Chat & Assistants](#ai-chat-assistants)');
    expect(section).toContain('<details open>');
    expect(section).not.toContain('Last sync:');
  });
});
