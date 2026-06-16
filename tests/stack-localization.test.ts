import { describe, it, expect } from 'vitest';
import { toolStacks } from '../src/data/tool-stacks';
import { toolStacksJa } from '../src/data/tool-stacks-ja';
import { customizeStack } from '../src/lib/stack-customization';
import { getDisplayStack, getLocalizedStack } from '../src/lib/stack-localization';

describe('stack-localization', () => {
  it('localizes cost.total for every curated stack', () => {
    for (const stack of toolStacks) {
      const localized = getLocalizedStack(stack, 'ja');
      expect(localized.cost.total).toBe(toolStacksJa[stack.id].cost.total);
      expect(localized.cost.total).not.toBe(stack.cost.total);
    }
  });

  it('re-localizes custom stacks from their EN base', () => {
    const base = toolStacks[0];
    const custom = customizeStack(base, 'en');
    const display = getDisplayStack(custom, 'ja');

    expect(display.name).toBe(`${toolStacksJa[base.id].name} （カスタム）`);
    expect(display.description).toBe(toolStacksJa[base.id].description);
    expect(display.tools[0].role).toBe(toolStacksJa[base.id].tools[0].role);
    expect(display.cost.total).toBe(toolStacksJa[base.id].cost.total);
    expect(display.cost.breakdown[0].notes).toBe(toolStacksJa[base.id].cost.breakdown[0].notes);
  });

  it('resolves base stack id from custom-* id when baseStackId is missing', () => {
    const base = toolStacks[1];
    const custom = {
      ...customizeStack(base, 'en'),
      baseStackId: undefined,
      id: `custom-${base.id}-1234567890`,
    };
    const display = getDisplayStack(custom, 'ja');
    expect(display.description).toBe(toolStacksJa[base.id].description);
  });

  it('returns EN stacks unchanged (including custom stacks)', () => {
    const base = toolStacks[0];
    const custom = customizeStack(base, 'en');
    expect(getDisplayStack(base, 'en')).toBe(base);
    expect(getDisplayStack(custom, 'en')).toBe(custom);
  });
});
