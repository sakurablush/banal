/**
 * Catalog size constants for site copy — kept separate from heavy data modules
 * so homepage boot does not parse ai-models, tool-stacks, or prompt-templates.
 * Drift is guarded in tests/content-integrity.test.ts.
 */
export const AI_MODEL_COUNT = 38;
export const TOOL_STACK_COUNT = 10;
export const PROMPT_TEMPLATE_COUNT = 52;
