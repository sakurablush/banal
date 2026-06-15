/**
 * Data Validation Utilities — Validates tool, model, and stack data integrity.
 * Ensures all required fields are present and data quality is maintained.
 */

import type { Tool, AIModel, ToolStack } from '../types/tool';
import type { ZeroKeyTool } from '../data/zero-key-tools';

// ─── Validation Result ──────────────────────────────────────────────────────

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error';
}

export interface ValidationWarning {
  field: string;
  message: string;
  severity: 'warning';
}

// ─── Tool Validation ────────────────────────────────────────────────────────

/**
 * Validate a ZeroKeyTool (legacy format)
 */
export function validateZeroKeyTool(tool: ZeroKeyTool): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Required fields
  if (!tool.id || tool.id.trim() === '') {
    errors.push({ field: 'id', message: 'Tool ID is required', severity: 'error' });
  }

  if (!tool.name || tool.name.trim() === '') {
    errors.push({ field: 'name', message: 'Tool name is required', severity: 'error' });
  }

  if (!tool.url || tool.url.trim() === '') {
    errors.push({ field: 'url', message: 'Tool URL is required', severity: 'error' });
  } else if (!isValidUrl(tool.url)) {
    errors.push({ field: 'url', message: 'Tool URL is not valid', severity: 'error' });
  }

  if (!tool.category || tool.category.trim() === '') {
    errors.push({ field: 'category', message: 'Tool category is required', severity: 'error' });
  }

  if (!tool.surface || tool.surface.trim() === '') {
    errors.push({ field: 'surface', message: 'Tool surface is required', severity: 'error' });
  }

  if (!tool.access || tool.access.trim() === '') {
    errors.push({ field: 'access', message: 'Tool access type is required', severity: 'error' });
  }

  if (!tool.bestFor || tool.bestFor.trim() === '') {
    warnings.push({ field: 'bestFor', message: 'Tool bestFor description is recommended', severity: 'warning' });
  }

  if (!tool.qualityNote || tool.qualityNote.trim() === '') {
    warnings.push({ field: 'qualityNote', message: 'Tool qualityNote is recommended', severity: 'warning' });
  }

  // Warnings
  if (tool.badges && tool.badges.length === 0) {
    warnings.push({ field: 'badges', message: 'Tool has no badges', severity: 'warning' });
  }

  if (tool.badges && tool.badges.length > 10) {
    warnings.push({ field: 'badges', message: 'Tool has too many badges (>10)', severity: 'warning' });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate an enhanced Tool (new format)
 */
export function validateTool(tool: Tool): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Required fields
  if (!tool.id || tool.id.trim() === '') {
    errors.push({ field: 'id', message: 'Tool ID is required', severity: 'error' });
  }

  if (!tool.name || tool.name.trim() === '') {
    errors.push({ field: 'name', message: 'Tool name is required', severity: 'error' });
  }

  if (!tool.url || tool.url.trim() === '') {
    errors.push({ field: 'url', message: 'Tool URL is required', severity: 'error' });
  } else if (!isValidUrl(tool.url)) {
    errors.push({ field: 'url', message: 'Tool URL is not valid', severity: 'error' });
  }

  if (!tool.description || tool.description.trim() === '') {
    errors.push({ field: 'description', message: 'Tool description is required', severity: 'error' });
  }

  if (!tool.category) {
    errors.push({ field: 'category', message: 'Tool category is required', severity: 'error' });
  }

  if (!tool.pricing || !tool.pricing.model) {
    errors.push({ field: 'pricing', message: 'Tool pricing is required', severity: 'error' });
  }

  if (!tool.access) {
    errors.push({ field: 'access', message: 'Tool access type is required', severity: 'error' });
  }

  // Warnings
  if (!tool.bestFor || tool.bestFor.trim() === '') {
    warnings.push({ field: 'bestFor', message: 'Tool bestFor is recommended', severity: 'warning' });
  }

  if (!tool.qualityNote || tool.qualityNote.trim() === '') {
    warnings.push({ field: 'qualityNote', message: 'Tool qualityNote is recommended', severity: 'warning' });
  }

  if (tool.tags && tool.tags.length === 0) {
    warnings.push({ field: 'tags', message: 'Tool has no tags', severity: 'warning' });
  }

  if (tool.badges && tool.badges.length > 10) {
    warnings.push({ field: 'badges', message: 'Tool has too many badges (>10)', severity: 'warning' });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ─── Model Validation ───────────────────────────────────────────────────────

/**
 * Validate an AIModel
 */
export function validateAIModel(model: AIModel): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Required fields
  if (!model.id || model.id.trim() === '') {
    errors.push({ field: 'id', message: 'Model ID is required', severity: 'error' });
  }

  if (!model.name || model.name.trim() === '') {
    errors.push({ field: 'name', message: 'Model name is required', severity: 'error' });
  }

  if (!model.provider || model.provider.trim() === '') {
    errors.push({ field: 'provider', message: 'Model provider is required', severity: 'error' });
  }

  if (!model.family || model.family.trim() === '') {
    errors.push({ field: 'family', message: 'Model family is required', severity: 'error' });
  }

  if (!model.parameters || !model.parameters.total) {
    errors.push({ field: 'parameters.total', message: 'Model parameters total is required', severity: 'error' });
  }

  if (!model.parameters || !model.parameters.architecture) {
    errors.push({ field: 'parameters.architecture', message: 'Model architecture is required', severity: 'error' });
  }

  if (!model.contextWindow || model.contextWindow.trim() === '') {
    errors.push({ field: 'contextWindow', message: 'Model context window is required', severity: 'error' });
  }

  if (!model.license || !model.license.type) {
    errors.push({ field: 'license.type', message: 'Model license type is required', severity: 'error' });
  }

  if (!model.hardware || !model.hardware.minRam) {
    errors.push({ field: 'hardware.minRam', message: 'Model minimum RAM is required', severity: 'error' });
  }

  if (!model.bestFor || model.bestFor.length === 0) {
    warnings.push({ field: 'bestFor', message: 'Model bestFor is recommended', severity: 'warning' });
  }

  // Warnings
  if (!model.benchmarks || Object.keys(model.benchmarks).length === 0) {
    warnings.push({ field: 'benchmarks', message: 'Model has no benchmarks', severity: 'warning' });
  }

  if (!model.availability || model.availability.inferenceProviders.length === 0) {
    warnings.push({ field: 'availability.inferenceProviders', message: 'Model has no inference providers', severity: 'warning' });
  }

  if (!model.availability || model.availability.localRunners.length === 0) {
    warnings.push({ field: 'availability.localRunners', message: 'Model has no local runners', severity: 'warning' });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ─── Stack Validation ───────────────────────────────────────────────────────

/**
 * Validate a ToolStack
 */
export function validateToolStack(stack: ToolStack): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Required fields
  if (!stack.id || stack.id.trim() === '') {
    errors.push({ field: 'id', message: 'Stack ID is required', severity: 'error' });
  }

  if (!stack.name || stack.name.trim() === '') {
    errors.push({ field: 'name', message: 'Stack name is required', severity: 'error' });
  }

  if (!stack.description || stack.description.trim() === '') {
    errors.push({ field: 'description', message: 'Stack description is required', severity: 'error' });
  }

  if (!stack.audience || !stack.audience.type) {
    errors.push({ field: 'audience.type', message: 'Stack audience type is required', severity: 'error' });
  }

  if (!stack.audience || !stack.audience.budget) {
    errors.push({ field: 'audience.budget', message: 'Stack audience budget is required', severity: 'error' });
  }

  if (!stack.audience || !stack.audience.experience) {
    errors.push({ field: 'audience.experience', message: 'Stack audience experience is required', severity: 'error' });
  }

  if (!stack.tools || stack.tools.length === 0) {
    errors.push({ field: 'tools', message: 'Stack must have at least one tool', severity: 'error' });
  }

  if (!stack.workflow || stack.workflow.length === 0) {
    errors.push({ field: 'workflow', message: 'Stack must have at least one workflow step', severity: 'error' });
  }

  if (!stack.cost || !stack.cost.total) {
    errors.push({ field: 'cost.total', message: 'Stack total cost is required', severity: 'error' });
  }

  if (!stack.cost || !stack.cost.breakdown || stack.cost.breakdown.length === 0) {
    errors.push({ field: 'cost.breakdown', message: 'Stack cost breakdown is required', severity: 'error' });
  }

  // Warnings
  if (stack.tools && stack.tools.length < 3) {
    warnings.push({ field: 'tools', message: 'Stack has fewer than 3 tools', severity: 'warning' });
  }

  if (stack.workflow && stack.workflow.length < 3) {
    warnings.push({ field: 'workflow', message: 'Stack has fewer than 3 workflow steps', severity: 'warning' });
  }

  if (!stack.resources || stack.resources.length === 0) {
    warnings.push({ field: 'resources', message: 'Stack has no resources', severity: 'warning' });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ─── Batch Validation ───────────────────────────────────────────────────────

/**
 * Validate all ZeroKeyTools
 */
export function validateAllZeroKeyTools(tools: readonly ZeroKeyTool[]): ValidationResult {
  const allErrors: ValidationError[] = [];
  const allWarnings: ValidationWarning[] = [];

  for (const tool of tools) {
    const result = validateZeroKeyTool(tool);
    allErrors.push(...result.errors.map(e => ({ ...e, message: `[${tool.id}] ${e.message}` })));
    allWarnings.push(...result.warnings.map(w => ({ ...w, message: `[${tool.id}] ${w.message}` })));
  }

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
  };
}

/**
 * Validate all AIModels
 */
export function validateAllAIModels(models: readonly AIModel[]): ValidationResult {
  const allErrors: ValidationError[] = [];
  const allWarnings: ValidationWarning[] = [];

  for (const model of models) {
    const result = validateAIModel(model);
    allErrors.push(...result.errors.map(e => ({ ...e, message: `[${model.id}] ${e.message}` })));
    allWarnings.push(...result.warnings.map(w => ({ ...w, message: `[${model.id}] ${w.message}` })));
  }

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
  };
}

/**
 * Validate all ToolStacks
 */
export function validateAllToolStacks(stacks: readonly ToolStack[]): ValidationResult {
  const allErrors: ValidationError[] = [];
  const allWarnings: ValidationWarning[] = [];

  for (const stack of stacks) {
    const result = validateToolStack(stack);
    allErrors.push(...result.errors.map(e => ({ ...e, message: `[${stack.id}] ${e.message}` })));
    allWarnings.push(...result.warnings.map(w => ({ ...w, message: `[${stack.id}] ${w.message}` })));
  }

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
  };
}

// ─── Helper Functions ───────────────────────────────────────────────────────

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check for duplicate IDs in a collection
 */
export function checkDuplicateIds<T extends { id: string }>(items: readonly T[]): string[] {
  const ids = items.map(item => item.id);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  return [...new Set(duplicates)];
}

/**
 * Generate a validation report
 */
export function generateValidationReport(results: ValidationResult): string {
  const lines: string[] = [];
  
  lines.push('=== Validation Report ===');
  lines.push(`Status: ${results.valid ? '✓ VALID' : '✗ INVALID'}`);
  lines.push(`Errors: ${results.errors.length}`);
  lines.push(`Warnings: ${results.warnings.length}`);
  lines.push('');

  if (results.errors.length > 0) {
    lines.push('--- Errors ---');
    for (const error of results.errors) {
      lines.push(`  ✗ ${error.field}: ${error.message}`);
    }
    lines.push('');
  }

  if (results.warnings.length > 0) {
    lines.push('--- Warnings ---');
    for (const warning of results.warnings) {
      lines.push(`  ⚠ ${warning.field}: ${warning.message}`);
    }
  }

  return lines.join('\n');
}
