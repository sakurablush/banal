/**
 * Cross-content integrity: stacks, guides, and prompt templates stay aligned
 * with zero-key-tools IDs, EN/JA parity, and honest-limit copy conventions.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { toolStacks } from '../src/data/tool-stacks';
import { toolStacksJa } from '../src/data/tool-stacks-ja';
import { zeroKeyTools } from '../src/data/zero-key-tools';
import { zeroKeyToolsJa } from '../src/data/zero-key-tools-ja';
import { getSiteStats } from '../src/data/site-stats';
import {
  getGettingStartedGuidesMeta,
  getGettingStartedGuidesCopy,
} from '../src/data/getting-started-guides-copy';
import { getLocalizedStack } from '../src/lib/stack-localization';
import {
  getLatestVerificationSnapshot,
  readmeVerificationPhrase,
} from '../src/lib/latest-verification';
import {
  generateReadmeToolsSection,
  README_SECTION_END,
  README_SECTION_START,
} from '../src/lib/tools-directory-markdown';
import { missingOverlayKeys, extraOverlayKeys } from '../src/lib/locale-parity';
import { translations } from '../src/i18n';
import { PromptTemplatesLibrary, PROMPT_TEMPLATE_COUNT } from '../src/lib/prompt-templates';
import prettier from 'prettier';

async function canonicalReadmeToolsSection(content: string): Promise<string> {
  const wrapped = `${README_SECTION_START}\n${content}\n${README_SECTION_END}`;
  const formatted = await prettier.format(wrapped, { filepath: 'README.md' });
  const start = formatted.indexOf(README_SECTION_START);
  const end = formatted.indexOf(README_SECTION_END);
  return formatted.slice(start + README_SECTION_START.length, end).trim();
}

const zeroKeyIds = new Set(zeroKeyTools.map((t) => t.id));

describe('Tool stacks — directory IDs and workflow refs', () => {
  it('has exactly 10 curated stacks', () => {
    expect(toolStacks).toHaveLength(10);
  });

  it('every stack toolId and alternative exists in zero-key-tools', () => {
    const issues: string[] = [];
    for (const stack of toolStacks) {
      for (const entry of stack.tools) {
        if (!zeroKeyIds.has(entry.toolId)) {
          issues.push(`${stack.id}: unknown toolId ${entry.toolId}`);
        }
        for (const alt of entry.alternatives ?? []) {
          if (!zeroKeyIds.has(alt)) {
            issues.push(`${stack.id}: unknown alternative ${alt} for ${entry.toolId}`);
          }
        }
      }
    }
    expect(issues, issues.join('\n')).toEqual([]);
  });

  it('workflow steps only reference tools listed in the stack (or alternatives)', () => {
    const issues: string[] = [];
    for (const stack of toolStacks) {
      const allowed = new Set(stack.tools.flatMap((t) => [t.toolId, ...(t.alternatives ?? [])]));
      for (const step of stack.workflow) {
        for (const toolId of step.tools ?? []) {
          if (!zeroKeyIds.has(toolId)) {
            issues.push(`${stack.id} step ${step.step}: unknown tool ${toolId}`);
          } else if (!allowed.has(toolId)) {
            issues.push(`${stack.id} step ${step.step}: ${toolId} not in stack tools`);
          }
        }
      }
    }
    expect(issues, issues.join('\n')).toEqual([]);
  });

  it('cost breakdown references only stack tools that exist in the directory', () => {
    const issues: string[] = [];
    for (const stack of toolStacks) {
      const stackToolIds = new Set(stack.tools.map((t) => t.toolId));
      for (const line of stack.cost.breakdown) {
        if (line.tool && !zeroKeyIds.has(line.tool)) {
          issues.push(`${stack.id}: unknown cost tool ${line.tool}`);
        }
        if (line.tool && !stackToolIds.has(line.tool)) {
          issues.push(`${stack.id}: cost line for ${line.tool} not in stack tools`);
        }
      }
    }
    expect(issues, issues.join('\n')).toEqual([]);
  });

  it('every stack tool has a matching cost breakdown line', () => {
    const issues: string[] = [];
    for (const stack of toolStacks) {
      const costTools = new Set(
        stack.cost.breakdown.map((line) => line.tool).filter(Boolean) as string[]
      );
      for (const entry of stack.tools) {
        if (!costTools.has(entry.toolId)) {
          issues.push(`${stack.id}: missing cost line for ${entry.toolId}`);
        }
      }
    }
    expect(issues, issues.join('\n')).toEqual([]);
  });

  it('no stack uses indie-hacker audience (rewritten to developer/freelancer/etc.)', () => {
    for (const stack of toolStacks) {
      expect(stack.audience.type).not.toBe('indie-hacker');
    }
  });
});

describe('Tool stacks — Japanese parity', () => {
  it('JA keys match every EN stack id exactly', () => {
    const enIds = toolStacks.map((s) => s.id).sort();
    const jaIds = Object.keys(toolStacksJa).sort();
    expect(jaIds).toEqual(enIds);
  });

  it('JA tools, workflow, cost breakdown lengths match EN per stack', () => {
    const issues: string[] = [];
    for (const stack of toolStacks) {
      const ja = toolStacksJa[stack.id];
      if (!ja) {
        issues.push(`missing JA entry for ${stack.id}`);
        continue;
      }
      if (!ja.cost.total) {
        issues.push(`${stack.id}: missing JA cost.total`);
      }
      if (ja.tools.length !== stack.tools.length) {
        issues.push(`${stack.id}: tools EN=${stack.tools.length} JA=${ja.tools.length}`);
      }
      if (ja.workflow.length !== stack.workflow.length) {
        issues.push(`${stack.id}: workflow EN=${stack.workflow.length} JA=${ja.workflow.length}`);
      }
      if (ja.cost.breakdown.length !== stack.cost.breakdown.length) {
        issues.push(
          `${stack.id}: cost EN=${stack.cost.breakdown.length} JA=${ja.cost.breakdown.length}`
        );
      }
      if (ja.resources.length !== stack.resources.length) {
        issues.push(
          `${stack.id}: resources EN=${stack.resources.length} JA=${ja.resources.length}`
        );
      }
    }
    expect(issues, issues.join('\n')).toEqual([]);
  });

  it('getLocalizedStack applies JA copy for every stack without dropping tools', () => {
    for (const stack of toolStacks) {
      const localized = getLocalizedStack(stack, 'ja');
      expect(localized.name).toBe(toolStacksJa[stack.id].name);
      expect(localized.cost.total).toBe(toolStacksJa[stack.id].cost.total);
      expect(localized.tools).toHaveLength(stack.tools.length);
      expect(localized.workflow).toHaveLength(stack.workflow.length);
      expect(localized.cost.breakdown).toHaveLength(stack.cost.breakdown.length);
      for (let i = 0; i < stack.tools.length; i++) {
        expect(localized.tools[i].role).toBe(toolStacksJa[stack.id].tools[i].role);
      }
    }
  });
});

describe('Zero-key tools — Japanese parity', () => {
  it('JA overlay covers every tool id in the catalog', () => {
    const ids = zeroKeyTools.map((tool) => tool.id);
    expect(missingOverlayKeys(ids, zeroKeyToolsJa)).toEqual([]);
    expect(extraOverlayKeys(ids, zeroKeyToolsJa)).toEqual([]);
  });
});

describe('Getting started guides — EN/JA parity', () => {
  it('has five guides with matching ids and five steps each in both locales', () => {
    const en = getGettingStartedGuidesMeta('en');
    const ja = getGettingStartedGuidesMeta('ja');
    expect(en).toHaveLength(5);
    expect(ja).toHaveLength(5);
    expect(ja.map((g) => g.id)).toEqual(en.map((g) => g.id));
    for (const guide of en) {
      expect(guide.stepCount).toBe(5);
    }
    for (const guide of ja) {
      expect(guide.stepCount).toBe(5);
    }
  });

  it('coding guide mentions Kilo and rate-limit backup in both locales', () => {
    for (const lang of ['en', 'ja'] as const) {
      const guide = getGettingStartedGuidesCopy(lang).guides.find(
        (g) => g.id === 'ai-coding-assistants'
      );
      expect(guide).toBeDefined();
      expect(guide!.description).toMatch(/Kilo/i);
      expect(guide!.description).toMatch(/Groq|OpenRouter/);
      expect(guide!.steps.some((s) => /Antigravity/i.test(s))).toBe(true);
    }
  });
});

describe('Prompt templates — parity and paste notes', () => {
  it('validateParity passes for all templates', () => {
    const { valid, issues } = PromptTemplatesLibrary.validateParity();
    expect(valid, issues.join('\n')).toBe(true);
  });

  it('getById appends free-tier paste note in EN and JA', () => {
    const en = new PromptTemplatesLibrary('en');
    const ja = new PromptTemplatesLibrary('ja');
    for (const id of PromptTemplatesLibrary.getAllIds()) {
      const enPt = en.getById(id)!;
      const jaPt = ja.getById(id)!;
      // EN paste note names the curated chats
      expect(enPt.description).toMatch(/Duck\.ai/);
      expect(enPt.description).toMatch(/Free tiers cap daily messages/);
      // JA paste note mentions the free-tier cap
      expect(jaPt.description).toMatch(/Duck\.ai/);
      expect(jaPt.description).toMatch(/無料枠/);
    }
  });

  it('raw template descriptions do not duplicate the paste note', () => {
    const en = new PromptTemplatesLibrary('en');
    for (const id of PromptTemplatesLibrary.getAllIds()) {
      const withNote = en.getById(id)!.description;
      // The new paste note references the curated 6 chats
      expect(withNote).toMatch(/Free tiers cap daily messages/);
      // Strip the canonical paste note and assert the underlying description
      // does not already contain the paste-note text (no double-up).
      const withoutNote = withNote.replace(
        ' Paste into Duck.ai, Microsoft Copilot, ChatGPT free, Gemini, Meta AI, or Mistral Le Chat. Free tiers cap daily messages — split big jobs across days.',
        ''
      );
      expect(withoutNote).not.toMatch(/Free tiers cap daily messages/);
    }
  });

  it('site-stats.prompts matches the live template count (no drift)', () => {
    const stats = getSiteStats();
    expect(stats.prompts).toBe(PROMPT_TEMPLATE_COUNT);
    expect(stats.prompts).toBeGreaterThanOrEqual(40);
  });

  it('section prompt-templates i18n strings use the data-driven count, not a hardcoded 9', () => {
    // Prevents a regression of the original "9 PROMPT TEMPLATES" hardcode.
    // The strings must interpolate {prompts} from getSiteStats(), never embed a number.
    for (const lang of ['en', 'ja'] as const) {
      const strings = translations[lang] as Record<string, string>;
      const eyebrow = strings['section.promptTemplates.eyebrow'] ?? '';
      const title1 = strings['section.promptTemplates.title1'] ?? '';
      const more = strings['promptTemplates.more'] ?? '';
      const intro = strings['promptTemplates.intro'] ?? '';
      for (const [name, value] of [
        ['eyebrow', eyebrow],
        ['title1', title1],
        ['more', more],
        ['intro', intro],
      ]) {
        expect(value, `${lang} ${name} must use {prompts} placeholder`).toMatch(/\{prompts\}/);
        // And must NOT contain a baked-in small number that would mislead readers.
        expect(value, `${lang} ${name} must not hardcode a number`).not.toMatch(/\b9\b/);
      }
    }
  });
});

describe('Public docs — counts match live data', () => {
  it('README.md reflects getSiteStats() and prompt template count', () => {
    const readme = readFileSync(join(process.cwd(), 'README.md'), 'utf8');
    const stats = getSiteStats();
    expect(readme).toContain(`${stats.total} tools`);
    expect(readme).toContain(`${stats.ai} AI`);
    expect(readme).toContain(`${stats.dev} developer`);
    expect(readme).toContain(`${stats.prompts} prompt`);
    expect(readme).toContain(`${stats.models} open models`);
    expect(readme).toContain(`${stats.stacks} workflow stacks`);
    expect(PROMPT_TEMPLATE_COUNT).toBe(stats.prompts);
  });

  it('README.md verification stats match the latest docs/verification snapshot', () => {
    const snapshot = getLatestVerificationSnapshot();
    expect(snapshot, 'commit at least one docs/verification/YYYY-MM-DD.json').not.toBeNull();

    const readme = readFileSync(join(process.cwd(), 'README.md'), 'utf8');
    const phrase = readmeVerificationPhrase(snapshot!);
    expect(readme.replace(/\s+/g, ' ')).toContain(phrase);
    expect(snapshot!.totalTools).toBe(getSiteStats().total);
  });

  it('README.md auto-generated tools catalog matches the live catalog', async () => {
    const readme = readFileSync(join(process.cwd(), 'README.md'), 'utf8');
    expect(readme).toContain('<!-- tools-directory:start -->');
    expect(readme).toContain('<!-- tools-directory:end -->');
    expect(readme).toContain('<a id="tools-directory"></a>');
    expect(readme).toContain('### Quick jump — AI');

    const start = readme.indexOf('<!-- tools-directory:start -->');
    const end = readme.indexOf('<!-- tools-directory:end -->');
    expect(start).toBeGreaterThan(-1);
    expect(end).toBeGreaterThan(start);

    const section = readme.slice(start + '<!-- tools-directory:start -->'.length, end).trim();
    expect(await canonicalReadmeToolsSection(section)).toBe(
      await canonicalReadmeToolsSection(generateReadmeToolsSection())
    );
  });

  it('README, ARCHITECTURE, and DIAMOND agree on test suite size', () => {
    const pattern = /(\d+) tests across (\d+) files/g;
    const counts = new Set<string>();
    for (const file of ['README.md', 'docs/ARCHITECTURE.md', 'DIAMOND.md']) {
      const text = readFileSync(join(process.cwd(), file), 'utf8');
      for (const match of text.matchAll(pattern)) {
        counts.add(`${match[1]} tests / ${match[2]} files`);
      }
    }
    expect(counts.size, `inconsistent test counts across docs:\n${[...counts].join('\n')}`).toBe(1);
  });
});
