/**
 * Cross-content integrity: stacks, guides, and prompt templates stay aligned
 * with zero-key-tools IDs, EN/JA parity, and honest-limit copy conventions.
 */

import { describe, it, expect } from 'vitest';
import { toolStacks } from '../src/data/tool-stacks';
import { toolStacksJa } from '../src/data/tool-stacks-ja';
import { zeroKeyTools } from '../src/data/zero-key-tools';
import {
  getGettingStartedGuidesMeta,
  getGettingStartedGuidesCopy,
} from '../src/data/getting-started-guides-copy';
import { getLocalizedStack } from '../src/lib/stack-localization';
import { PromptTemplatesLibrary } from '../src/lib/prompt-templates';

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

  it('JA tools, workflow, and cost breakdown lengths match EN per stack', () => {
    const issues: string[] = [];
    for (const stack of toolStacks) {
      const ja = toolStacksJa[stack.id];
      if (!ja) {
        issues.push(`missing JA entry for ${stack.id}`);
        continue;
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
    }
    expect(issues, issues.join('\n')).toEqual([]);
  });

  it('getLocalizedStack applies JA copy for every stack without dropping tools', () => {
    for (const stack of toolStacks) {
      const localized = getLocalizedStack(stack, 'ja');
      expect(localized.name).toBe(toolStacksJa[stack.id].name);
      expect(localized.tools).toHaveLength(stack.tools.length);
      expect(localized.workflow).toHaveLength(stack.workflow.length);
      expect(localized.cost.breakdown).toHaveLength(stack.cost.breakdown.length);
      for (let i = 0; i < stack.tools.length; i++) {
        expect(localized.tools[i].role).toBe(toolStacksJa[stack.id].tools[i].role);
      }
    }
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
  it('validateParity passes for all nine templates', () => {
    const { valid, issues } = PromptTemplatesLibrary.validateParity();
    expect(valid, issues.join('\n')).toBe(true);
  });

  it('getById appends free-tier paste note in EN and JA', () => {
    const en = new PromptTemplatesLibrary('en');
    const ja = new PromptTemplatesLibrary('ja');
    for (const id of PromptTemplatesLibrary.getAllIds()) {
      const enPt = en.getById(id)!;
      const jaPt = ja.getById(id)!;
      expect(enPt.description).toContain('Duck.ai');
      expect(enPt.description).toContain('Free tiers cap messages');
      expect(jaPt.description).toContain('Duck.ai');
      expect(jaPt.description).toContain('無料枠');
    }
  });

  it('raw template descriptions do not duplicate the paste note', () => {
    const en = new PromptTemplatesLibrary('en');
    for (const id of PromptTemplatesLibrary.getAllIds()) {
      const withNote = en.getById(id)!.description;
      expect(withNote).toContain('Free tiers cap messages');
      const withoutNote = withNote.replace(
        ' Paste into Duck.ai, ChatGPT free, or Gemini free. Free tiers cap messages per day—split big jobs across days.',
        ''
      );
      expect(withoutNote).not.toContain('Free tiers cap messages');
    }
  });
});
