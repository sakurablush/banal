/**
 * Tests for data validation utilities.
 */

import { describe, it, expect } from 'vitest';
import {
  validateZeroKeyTool,
  validateTool,
  validateAIModel,
  validateToolStack,
  validateAllZeroKeyTools,
  validateAllAIModels,
  validateAllToolStacks,
  checkDuplicateIds,
  generateValidationReport,
} from '../src/lib/data-validation';
import { zeroKeyTools } from '../src/data/zero-key-tools';
import { aiModels } from '../src/data/ai-models';
import { toolStacks } from '../src/data/tool-stacks';
import type { Tool } from '../src/types/tool';

// ─── ZeroKeyTool Validation Tests ───────────────────────────────────────────

describe('ZeroKeyTool Validation', () => {
  it('should validate a valid tool', () => {
    const tool = zeroKeyTools[0];
    const result = validateZeroKeyTool(tool);
    expect(result.valid).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  it('should detect missing ID', () => {
    const tool = { ...zeroKeyTools[0], id: '' };
    const result = validateZeroKeyTool(tool);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === 'id')).toBe(true);
  });

  it('should detect missing name', () => {
    const tool = { ...zeroKeyTools[0], name: '' };
    const result = validateZeroKeyTool(tool);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === 'name')).toBe(true);
  });

  it('should detect missing URL', () => {
    const tool = { ...zeroKeyTools[0], url: '' };
    const result = validateZeroKeyTool(tool);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === 'url')).toBe(true);
  });

  it('should detect invalid URL', () => {
    const tool = { ...zeroKeyTools[0], url: 'not-a-url' };
    const result = validateZeroKeyTool(tool);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === 'url' && e.message.includes('not valid'))).toBe(
      true
    );
  });

  it('should warn about missing bestFor', () => {
    const tool = { ...zeroKeyTools[0], bestFor: '' };
    const result = validateZeroKeyTool(tool);
    expect(result.warnings.some((w) => w.field === 'bestFor')).toBe(true);
  });

  it('should warn about missing qualityNote', () => {
    const tool = { ...zeroKeyTools[0], qualityNote: '' };
    const result = validateZeroKeyTool(tool);
    expect(result.warnings.some((w) => w.field === 'qualityNote')).toBe(true);
  });

  it('should warn about empty badges', () => {
    const tool = { ...zeroKeyTools[0], badges: [] };
    const result = validateZeroKeyTool(tool);
    expect(result.warnings.some((w) => w.field === 'badges')).toBe(true);
  });

  it('should warn about too many badges', () => {
    const tool = { ...zeroKeyTools[0], badges: Array(11).fill('badge') };
    const result = validateZeroKeyTool(tool);
    expect(
      result.warnings.some((w) => w.field === 'badges' && w.message.includes('too many'))
    ).toBe(true);
  });
});

// ─── Tool Validation Tests ──────────────────────────────────────────────────

describe('Tool Validation', () => {
  const validTool: Tool = {
    id: 'test-tool',
    name: 'Test Tool',
    url: 'https://test.com',
    description: 'A test tool',
    category: 'ai-coding',
    tags: ['vscode', 'free'],
    pricing: { model: 'free' },
    access: 'no-login',
    surface: 'web',
    requiresSignup: false,
    badges: ['free', 'vscode'],
    bestFor: 'Testing',
    qualityNote: 'Great tool',
  };

  it('should validate a valid tool', () => {
    const result = validateTool(validTool);
    expect(result.valid).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  it('should detect missing ID', () => {
    const tool = { ...validTool, id: '' };
    const result = validateTool(tool);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === 'id')).toBe(true);
  });

  it('should detect missing description', () => {
    const tool = { ...validTool, description: '' };
    const result = validateTool(tool);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === 'description')).toBe(true);
  });

  it('should detect missing pricing', () => {
    const tool = { ...validTool, pricing: undefined as any };
    const result = validateTool(tool);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === 'pricing')).toBe(true);
  });

  it('should warn about empty tags', () => {
    const tool = { ...validTool, tags: [] };
    const result = validateTool(tool);
    expect(result.warnings.some((w) => w.field === 'tags')).toBe(true);
  });
});

// ─── AIModel Validation Tests ───────────────────────────────────────────────

describe('AIModel Validation', () => {
  it('should validate a valid model', () => {
    const model = aiModels[0];
    const result = validateAIModel(model);
    expect(result.valid).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  it('should detect missing ID', () => {
    const model = { ...aiModels[0], id: '' };
    const result = validateAIModel(model);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === 'id')).toBe(true);
  });

  it('should detect missing provider', () => {
    const model = { ...aiModels[0], provider: '' };
    const result = validateAIModel(model);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === 'provider')).toBe(true);
  });

  it('should detect missing parameters', () => {
    const model = { ...aiModels[0], parameters: undefined as any };
    const result = validateAIModel(model);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field.includes('parameters'))).toBe(true);
  });

  it('should detect missing license', () => {
    const model = { ...aiModels[0], license: undefined as any };
    const result = validateAIModel(model);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field.includes('license'))).toBe(true);
  });

  it('should warn about missing benchmarks', () => {
    const model = { ...aiModels[0], benchmarks: {} };
    const result = validateAIModel(model);
    expect(result.warnings.some((w) => w.field === 'benchmarks')).toBe(true);
  });

  it('should warn about missing inference providers', () => {
    const model = {
      ...aiModels[0],
      availability: { ...aiModels[0].availability, inferenceProviders: [] },
    };
    const result = validateAIModel(model);
    expect(result.warnings.some((w) => w.field === 'availability.inferenceProviders')).toBe(true);
  });
});

// ─── ToolStack Validation Tests ─────────────────────────────────────────────

describe('ToolStack Validation', () => {
  it('should validate a valid stack', () => {
    const stack = toolStacks[0];
    const result = validateToolStack(stack);
    expect(result.valid).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  it('should detect missing ID', () => {
    const stack = { ...toolStacks[0], id: '' };
    const result = validateToolStack(stack);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === 'id')).toBe(true);
  });

  it('should detect missing description', () => {
    const stack = { ...toolStacks[0], description: '' };
    const result = validateToolStack(stack);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === 'description')).toBe(true);
  });

  it('should detect missing audience', () => {
    const stack = { ...toolStacks[0], audience: undefined as any };
    const result = validateToolStack(stack);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field.includes('audience'))).toBe(true);
  });

  it('should detect empty tools', () => {
    const stack = { ...toolStacks[0], tools: [] };
    const result = validateToolStack(stack);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === 'tools')).toBe(true);
  });

  it('should detect empty workflow', () => {
    const stack = { ...toolStacks[0], workflow: [] };
    const result = validateToolStack(stack);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.field === 'workflow')).toBe(true);
  });

  it('should warn about too few tools', () => {
    const stack = { ...toolStacks[0], tools: toolStacks[0].tools.slice(0, 2) };
    const result = validateToolStack(stack);
    expect(
      result.warnings.some((w) => w.field === 'tools' && w.message.includes('fewer than 3'))
    ).toBe(true);
  });

  it('should warn about missing resources', () => {
    const stack = { ...toolStacks[0], resources: [] };
    const result = validateToolStack(stack);
    expect(result.warnings.some((w) => w.field === 'resources')).toBe(true);
  });
});

// ─── Batch Validation Tests ─────────────────────────────────────────────────

describe('Batch Validation', () => {
  it('should validate all ZeroKeyTools', () => {
    const result = validateAllZeroKeyTools(zeroKeyTools);
    // All tools should be valid
    expect(result.valid).toBe(true);
  });

  it('should validate all AIModels', () => {
    const result = validateAllAIModels(aiModels);
    // All models should be valid
    expect(result.valid).toBe(true);
  });

  it('should validate all ToolStacks', () => {
    const result = validateAllToolStacks(toolStacks);
    // All stacks should be valid
    expect(result.valid).toBe(true);
  });
});

// ─── Helper Function Tests ──────────────────────────────────────────────────

describe('Helper Functions', () => {
  it('should detect duplicate IDs', () => {
    const items = [{ id: 'a' }, { id: 'b' }, { id: 'a' }, { id: 'c' }, { id: 'b' }];
    const duplicates = checkDuplicateIds(items);
    expect(duplicates).toContain('a');
    expect(duplicates).toContain('b');
    expect(duplicates).not.toContain('c');
  });

  it('should return empty array for no duplicates', () => {
    const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
    const duplicates = checkDuplicateIds(items);
    expect(duplicates.length).toBe(0);
  });

  it('should generate validation report', () => {
    const result = {
      valid: false,
      errors: [{ field: 'id', message: 'ID is required', severity: 'error' as const }],
      warnings: [{ field: 'badges', message: 'No badges', severity: 'warning' as const }],
    };
    const report = generateValidationReport(result);
    expect(report).toContain('✗ INVALID');
    expect(report).toContain('Errors: 1');
    expect(report).toContain('Warnings: 1');
    expect(report).toContain('ID is required');
    expect(report).toContain('No badges');
  });

  it('should generate valid report', () => {
    const result = {
      valid: true,
      errors: [],
      warnings: [],
    };
    const report = generateValidationReport(result);
    expect(report).toContain('✓ VALID');
    expect(report).toContain('Errors: 0');
    expect(report).toContain('Warnings: 0');
  });
});
