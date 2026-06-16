/**
 * 5-category tag system for the redesigned AI Tools Directory.
 * Tags: Access, Pricing, Platform, Capability, Quality.
 * Supports progressive filtering with contradiction detection.
 */

import type { TagDefinition, TagCategory, ToolCategory } from '../types/tool';

// ─── Access Tags ────────────────────────────────────────────────────────────

export const ACCESS_TAGS: TagDefinition[] = [
  { id: 'no-signup', label: 'No Signup', category: 'access', description: 'Use without creating an account', icon: '\u{1F513}' },
  { id: 'free-signup', label: 'Free Signup', category: 'access', description: 'Account required but free', icon: '\u{1F511}' },
  { id: 'no-api-key', label: 'No API Key', category: 'access', description: 'No API key needed', icon: '\u{1F6AB}' },
  { id: 'byok', label: 'BYOK', category: 'access', description: 'Bring Your Own Key', icon: '\u{1F510}' },
  { id: 'open-source', label: 'Open Source', category: 'access', description: 'Source code available', icon: '\u{1F4BB}' },
  { id: 'self-hosted', label: 'Self-Hosted', category: 'access', description: 'Run on your own infrastructure', icon: '\u{1F3E0}' },
  { id: 'cloud-hosted', label: 'Cloud Hosted', category: 'access', description: 'Hosted by provider', icon: '\u{2601}\uFE0F' },
];

// ─── Pricing Tags ───────────────────────────────────────────────────────────

export const PRICING_TAGS: TagDefinition[] = [
  { id: 'free-forever', label: 'Free Forever', category: 'pricing', description: 'No cost, no limits', icon: '\u{1F193}' },
  { id: 'free-tier', label: 'Free Tier', category: 'pricing', description: 'Free with usage limits', icon: '\u{1F4B0}' },
  { id: 'free-tokens', label: 'Free Tokens', category: 'pricing', description: 'Free API tokens or credits', icon: '\u{1FA99}' },
  { id: 'freemium', label: 'Freemium', category: 'pricing', description: 'Free + paid tiers', icon: '\u{1F4B3}' },
  { id: 'paid', label: 'Paid Only', category: 'pricing', description: 'Requires payment', icon: '\u{1F4B5}' },
  { id: 'rate-limited', label: 'Rate Limited', category: 'pricing', description: 'Usage limits apply', icon: '\u{26A1}' },
  { id: 'daily-limit', label: 'Daily Limit', category: 'pricing', description: 'Resets daily', icon: '\u{1F4C5}' },
  { id: 'monthly-limit', label: 'Monthly Limit', category: 'pricing', description: 'Resets monthly', icon: '\u{1F4C6}' },
];

// ─── Platform Tags ──────────────────────────────────────────────────────────

export const PLATFORM_TAGS: TagDefinition[] = [
  { id: 'browser', label: 'Browser', category: 'platform', description: 'Runs in web browser', icon: '\u{1F310}' },
  { id: 'desktop-windows', label: 'Windows', category: 'platform', description: 'Windows desktop app', icon: '\u{1F5B3}\uFE0F' },
  { id: 'desktop-mac', label: 'macOS', category: 'platform', description: 'Mac desktop app', icon: '\u{1F34E}' },
  { id: 'desktop-linux', label: 'Linux', category: 'platform', description: 'Linux desktop app', icon: '\u{1F427}' },
  { id: 'mobile-ios', label: 'iOS', category: 'platform', description: 'iPhone/iPad app', icon: '\u{1F4F1}' },
  { id: 'mobile-android', label: 'Android', category: 'platform', description: 'Android app', icon: '\u{1F916}' },
  { id: 'cli', label: 'CLI', category: 'platform', description: 'Command-line interface', icon: '\u{1F4DF}' },
  { id: 'api', label: 'API', category: 'platform', description: 'API access available', icon: '\u{1F50C}' },
  { id: 'vscode', label: 'VS Code', category: 'platform', description: 'VS Code extension', icon: '\u{1F4D8}' },
  { id: 'jetbrains', label: 'JetBrains', category: 'platform', description: 'JetBrains plugin', icon: '\u{1F4D9}' },
  { id: 'neovim', label: 'Neovim', category: 'platform', description: 'Neovim plugin', icon: '\u{1F4D7}' },
  { id: 'docker', label: 'Docker', category: 'platform', description: 'Docker image available', icon: '\u{1F433}' },
];

// ─── Capability Tags ────────────────────────────────────────────────────────

export const CAPABILITY_TAGS: TagDefinition[] = [
  // AI-specific
  { id: 'local-models', label: 'Local Models', category: 'capability', description: 'Run models locally', icon: '\u{1F4BE}' },
  { id: 'cloud-models', label: 'Cloud Models', category: 'capability', description: 'Use cloud-hosted models', icon: '\u{2601}\uFE0F' },
  { id: 'multi-model', label: 'Multi-Model', category: 'capability', description: 'Supports multiple models', icon: '\u{1F500}' },
  { id: 'gpu-required', label: 'GPU Required', category: 'capability', description: 'Requires GPU', icon: '\u{1F3AE}' },
  { id: 'cpu-only', label: 'CPU Only', category: 'capability', description: 'Works on CPU only', icon: '\u{1F5A5}\uFE0F' },
  { id: 'low-hardware', label: 'Low Hardware', category: 'capability', description: 'Works on low-end machines', icon: '\u{1F4C9}' },
  { id: 'high-context', label: '1M+ Context', category: 'capability', description: 'Supports 1M+ token context', icon: '\u{1F4DC}' },
  { id: 'vision', label: 'Vision', category: 'capability', description: 'Image understanding', icon: '\u{1F441}\uFE0F' },
  { id: 'code-generation', label: 'Code Gen', category: 'capability', description: 'Generates code', icon: '\u{1F4BB}' },
  { id: 'reasoning', label: 'Reasoning', category: 'capability', description: 'Strong reasoning capabilities', icon: '\u{1F9E0}' },
  { id: 'multilingual', label: 'Multilingual', category: 'capability', description: 'Supports multiple languages', icon: '\u{1F30D}' },
  { id: 'agent', label: 'Agent', category: 'capability', description: 'Autonomous agent capabilities', icon: '\u{1F916}' },
  { id: 'rag', label: 'RAG', category: 'capability', description: 'Retrieval-augmented generation', icon: '\u{1F50D}' },
  { id: 'function-calling', label: 'Function Calling', category: 'capability', description: 'Tool use / function calling', icon: '\u{1F4DE}' },
  // Dev-specific
  { id: 'git-integration', label: 'Git Integration', category: 'capability', description: 'Integrates with Git', icon: '\u{1F500}' },
  { id: 'ci-cd', label: 'CI/CD', category: 'capability', description: 'CI/CD integration', icon: '\u{2699}\uFE0F' },
  { id: 'testing', label: 'Testing', category: 'capability', description: 'Testing capabilities', icon: '\u{1F9EA}' },
  { id: 'debugging', label: 'Debugging', category: 'capability', description: 'Debugging tools', icon: '\u{1F41B}' },
  { id: 'deployment', label: 'Deployment', category: 'capability', description: 'Deployment capabilities', icon: '\u{1F680}' },
  { id: 'monitoring', label: 'Monitoring', category: 'capability', description: 'Monitoring & observability', icon: '\u{1F4CA}' },
];

// ─── Quality Tags ───────────────────────────────────────────────────────────

export const QUALITY_TAGS: TagDefinition[] = [
  { id: 'verified', label: 'Verified', category: 'quality', description: 'Verified by Banal team', icon: '\u{2705}' },
  { id: 'privacy-friendly', label: 'Privacy Friendly', category: 'quality', description: 'Strong privacy practices', icon: '\u{1F512}' },
  { id: 'no-telemetry', label: 'No Telemetry', category: 'quality', description: 'No usage tracking', icon: '\u{1F6AB}' },
  { id: 'encrypted', label: 'Encrypted', category: 'quality', description: 'End-to-end encryption', icon: '\u{1F510}' },
  { id: 'gdpr-compliant', label: 'GDPR', category: 'quality', description: 'GDPR compliant', icon: '\u{1F1EA}\u{1F1FA}' },
  { id: 'eu-hosted', label: 'EU Hosted', category: 'quality', description: 'Hosted in EU', icon: '\u{1F1EA}\u{1F1FA}' },
  { id: 'community-trusted', label: 'Community Trusted', category: 'quality', description: 'High community trust', icon: '\u{1F91D}' },
  { id: 'enterprise-ready', label: 'Enterprise Ready', category: 'quality', description: 'Suitable for enterprise', icon: '\u{1F3E2}' },
  { id: 'beginner-friendly', label: 'Beginner Friendly', category: 'quality', description: 'Easy for beginners', icon: '\u{1F331}' },
  { id: 'freelancer-friendly', label: 'Freelancer Friendly', category: 'quality', description: 'Good for freelancers', icon: '\u{1F4BC}' },
  { id: 'indie-hacker', label: 'Ship your own app', category: 'quality', description: 'Good for solo app builders', icon: '\u{1F4BB}' },
];

// ─── All Tags Combined ──────────────────────────────────────────────────────

export const ALL_TAGS: TagDefinition[] = [
  ...ACCESS_TAGS,
  ...PRICING_TAGS,
  ...PLATFORM_TAGS,
  ...CAPABILITY_TAGS,
  ...QUALITY_TAGS,
];

// ─── Tag Lookup ─────────────────────────────────────────────────────────────

/** Get tag definition by ID */
export function getTagDefinition(tagId: string): TagDefinition | undefined {
  return ALL_TAGS.find((t) => t.id === tagId);
}

/** Get all tags for a given category */
export function getTagsByCategory(category: TagCategory): TagDefinition[] {
  return ALL_TAGS.filter((t) => t.category === category);
}

/** Get tags applicable to a given tool category */
export function getTagsForToolCategory(toolCategory: ToolCategory): TagDefinition[] {
  // All tags are applicable by default; filter by applicableTo if set
  return ALL_TAGS.filter((tag) => {
    if (!tag.applicableTo || tag.applicableTo.length === 0) return true;
    return tag.applicableTo.includes(toolCategory);
  });
}

// ─── Contradiction Detection ────────────────────────────────────────────────

const TAG_CONTRADICTIONS: Record<string, string[]> = {
  'no-signup': ['free-signup'],
  'gpu-required': ['cpu-only', 'low-hardware'],
  'self-hosted': ['cloud-hosted'],
  'free-forever': ['paid', 'freemium'],
  'local-models': ['cloud-models'],
};

/** Check if two tags contradict each other */
export function tagsContradict(tagA: string, tagB: string): boolean {
  return (
    TAG_CONTRADICTIONS[tagA]?.includes(tagB) === true ||
    TAG_CONTRADICTIONS[tagB]?.includes(tagA) === true
  );
}

/** Check if a tag contradicts any active filter */
export function contradictsActiveFilters(tagId: string, activeTags: string[]): boolean {
  return activeTags.some((active) => tagsContradict(tagId, active));
}

/** Filter out contradicting tags from available options */
export function getNonContradictingTags(available: TagDefinition[], activeTags: string[]): TagDefinition[] {
  return available.filter((tag) => !contradictsActiveFilters(tag.id, activeTags));
}

// ─── Filter Presets ─────────────────────────────────────────────────────────

export const FILTER_PRESETS = [
  {
    id: 'zero-budget-coding',
    name: 'Zero-Budget AI Coding',
    description: 'Free AI coding tools with no signup required',
    filters: { tags: ['free-forever', 'no-signup', 'vscode'] },
  },
  {
    id: 'privacy-first',
    name: 'Privacy-First Tools',
    description: 'Tools with strong privacy and no telemetry',
    filters: { tags: ['privacy-friendly', 'no-telemetry', 'encrypted'] },
  },
  {
    id: 'local-ai',
    name: 'Local AI (No Cloud)',
    description: 'Run AI models locally without sending data to cloud',
    filters: { tags: ['local-models', 'self-hosted'] },
  },
  {
    id: 'freelancer-stack',
    name: 'Freelancer Essentials',
    description: 'Tools for freelance developers and designers',
    filters: { tags: ['freelancer-friendly', 'free-tier'] },
  },
  {
    id: 'indie-hacker',
    name: 'Indie Hacker Toolkit',
    description: 'Tools for building and launching indie products',
    filters: { tags: ['indie-hacker', 'free-tier', 'beginner-friendly'] },
  },
  {
    id: 'low-hardware',
    name: 'Low-End Hardware',
    description: 'Tools that work on low-end machines without GPU',
    filters: { tags: ['low-hardware', 'cpu-only'] },
  },
  {
    id: 'high-context-models',
    name: 'Long Context Models',
    description: 'AI models with 1M+ token context windows',
    filters: { tags: ['high-context'] },
  },
  {
    id: 'beginner-friendly',
    name: 'Beginner Friendly',
    description: 'Easy-to-use tools for beginners',
    filters: { tags: ['beginner-friendly', 'free-tier', 'no-signup'] },
  },
];
