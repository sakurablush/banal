/**
 * Category hierarchy system for the redesigned AI Tools Directory.
 * 3-level hierarchy: Domain → Function → Subcategory.
 * Provides labels, icons, and parent-child relationships.
 */

import type { Domain, ToolCategory, Subcategory } from '../types/tool';

// ─── Domain Definitions ─────────────────────────────────────────────────────

export interface DomainDefinition {
  id: Domain;
  label: string;
  icon: string;
  description: string;
}

export const DOMAINS: DomainDefinition[] = [
  { id: 'ai', label: 'AI & Machine Learning', icon: '\u{1F916}', description: 'AI-powered tools for chat, image, video, coding, and more' },
  { id: 'dev', label: 'Development & DevOps', icon: '\u{1F4BB}', description: 'Code editors, version control, databases, and automation' },
  { id: 'prod', label: 'Productivity & Collaboration', icon: '\u{1F4CB}', description: 'Notes, project management, and communication' },
  { id: 'design', label: 'Design & Creative', icon: '\u{1F3A8}', description: 'UI/UX, graphic design, 3D, and video editing' },
  { id: 'business', label: 'Business & Marketing', icon: '\u{1F4C8}', description: 'CRM, email, social media, and analytics' },
  { id: 'infra', label: 'Infrastructure & Hosting', icon: '\u{1F680}', description: 'Cloud hosting, serverless, containers, and monitoring' },
];

// ─── Category → Domain Mapping ──────────────────────────────────────────────

export const CATEGORY_TO_DOMAIN: Record<ToolCategory, Domain> = {
  // AI
  'ai-chat': 'ai',
  'ai-image': 'ai',
  'ai-video': 'ai',
  'ai-audio': 'ai',
  'ai-writing': 'ai',
  'ai-search': 'ai',
  'ai-document': 'ai',
  'ai-presentation': 'ai',
  'ai-math': 'ai',
  'ai-coding': 'ai',
  'ai-agents': 'ai',
  'ai-models': 'ai',
  'ai-inference': 'ai',
  // Dev
  'dev-editors': 'dev',
  'dev-vcs': 'dev',
  'dev-databases': 'dev',
  'dev-backend': 'dev',
  'dev-automation': 'dev',
  'dev-testing': 'dev',
  'dev-security': 'dev',
  'dev-cli': 'dev',
  // Productivity
  'prod-notes': 'prod',
  'prod-project': 'prod',
  'prod-communication': 'prod',
  'prod-time': 'prod',
  // Design
  'design-ui': 'design',
  'design-graphic': 'design',
  'design-3d': 'design',
  'design-photo': 'design',
  // Business
  'biz-crm': 'business',
  'biz-email': 'business',
  'biz-social': 'business',
  'biz-analytics': 'business',
  // Infrastructure
  'infra-cloud': 'infra',
  'infra-serverless': 'infra',
  'infra-containers': 'infra',
  'infra-monitoring': 'infra',
  // Legacy mappings
  'dev-coding': 'dev',
  'dev-learning': 'dev',
  'dev-data': 'dev',
  'dev-docs': 'dev',
  'dev-design': 'design',
  'dev-productivity': 'prod',
  'ai-open-source': 'ai',
  'ai-pdf': 'ai',
};

// ─── Category Definitions ───────────────────────────────────────────────────

export interface CategoryDefinition {
  id: ToolCategory;
  label: string;
  icon: string;
  domain: Domain;
  description: string;
  subcategories?: Subcategory[];
}

export const CATEGORY_DEFINITIONS: CategoryDefinition[] = [
  // AI & Machine Learning
  { id: 'ai-chat', label: 'Chat & Assistants', icon: '\u{1F4AC}', domain: 'ai', description: 'AI chatbots and conversational assistants', subcategories: ['general-purpose', 'privacy-focused', 'code-focused', 'research-focused'] },
  { id: 'ai-image', label: 'Image Generation', icon: '\u{1F3A8}', domain: 'ai', description: 'AI-powered image creation and editing' },
  { id: 'ai-video', label: 'Video Generation', icon: '\u{1F3AC}', domain: 'ai', description: 'AI video creation, editing, and effects' },
  { id: 'ai-audio', label: 'Audio & Music', icon: '\u{1F3B5}', domain: 'ai', description: 'AI music, voice, TTS, and audio processing' },
  { id: 'ai-writing', label: 'Writing & Content', icon: '\u{270D}\uFE0F', domain: 'ai', description: 'AI writing, summarization, and translation' },
  { id: 'ai-search', label: 'Search & Research', icon: '\u{1F50D}', domain: 'ai', description: 'AI-powered search engines and research tools' },
  { id: 'ai-document', label: 'Document Processing', icon: '\u{1F4C4}', domain: 'ai', description: 'AI tools for PDFs, documents, and data extraction' },
  { id: 'ai-presentation', label: 'Presentations', icon: '\u{1F4CA}', domain: 'ai', description: 'AI-powered slide and presentation creation' },
  { id: 'ai-math', label: 'Math & Science', icon: '\u{1F9EE}', domain: 'ai', description: 'AI for mathematics, science, and education' },
  { id: 'ai-coding', label: 'Coding Assistants', icon: '\u{1F6E0}\uFE0F', domain: 'ai', description: 'AI-powered code generation and assistance', subcategories: ['vscode-extension', 'jetbrains-plugin', 'cli-tool', 'cloud-ide'] },
  { id: 'ai-agents', label: 'Agent Platforms', icon: '\u{1F916}', domain: 'ai', description: 'Autonomous AI agents and orchestration platforms' },
  { id: 'ai-models', label: 'Models & Weights', icon: '\u{1F31F}', domain: 'ai', description: 'Open-source LLMs and model weights', subcategories: ['long-context', 'reasoning', 'multilingual', 'coding-specialist'] },
  { id: 'ai-inference', label: 'Inference Providers', icon: '\u{26A1}', domain: 'ai', description: 'API providers for running AI models' },
  // Development & DevOps
  { id: 'dev-editors', label: 'Code Editors & IDEs', icon: '\u{1F4BB}', domain: 'dev', description: 'Code editors, IDEs, and development environments' },
  { id: 'dev-vcs', label: 'Version Control', icon: '\u{1F500}', domain: 'dev', description: 'Git, version control, and collaboration' },
  { id: 'dev-databases', label: 'Databases', icon: '\u{1F5C4}\uFE0F', domain: 'dev', description: 'Databases, ORMs, and data storage' },
  { id: 'dev-backend', label: 'Backend & APIs', icon: '\u{1F527}', domain: 'dev', description: 'Backend frameworks, APIs, and server tools' },
  { id: 'dev-automation', label: 'Automation & CI/CD', icon: '\u{2699}\uFE0F', domain: 'dev', description: 'Automation, CI/CD, and DevOps tools' },
  { id: 'dev-testing', label: 'Testing & QA', icon: '\u{1F9EA}', domain: 'dev', description: 'Testing frameworks, QA tools, and mocking' },
  { id: 'dev-security', label: 'Security & Privacy', icon: '\u{1F512}', domain: 'dev', description: 'Security scanning, encryption, and privacy tools' },
  { id: 'dev-cli', label: 'CLI Tools', icon: '\u{1F4DF}', domain: 'dev', description: 'Command-line utilities and developer productivity' },
  // Productivity
  { id: 'prod-notes', label: 'Note-taking & Knowledge', icon: '\u{1F4DD}', domain: 'prod', description: 'Notes, wikis, and knowledge management' },
  { id: 'prod-project', label: 'Project Management', icon: '\u{1F4CB}', domain: 'prod', description: 'Task tracking, project planning, and collaboration' },
  { id: 'prod-communication', label: 'Communication', icon: '\u{1F4E7}', domain: 'prod', description: 'Email, messaging, and team communication' },
  { id: 'prod-time', label: 'Time Tracking', icon: '\u{23F0}', domain: 'prod', description: 'Time tracking, calendars, and scheduling' },
  // Design
  { id: 'design-ui', label: 'UI/UX Design', icon: '\u{1F58C}\uFE0F', domain: 'design', description: 'UI design, prototyping, and wireframing' },
  { id: 'design-graphic', label: 'Graphic Design', icon: '\u{1F3A8}', domain: 'design', description: 'Graphic design, illustrations, and branding' },
  { id: 'design-3d', label: '3D & Animation', icon: '\u{1F3AE}', domain: 'design', description: '3D modeling, animation, and rendering' },
  { id: 'design-photo', label: 'Photo & Video Editing', icon: '\u{1F4F7}', domain: 'design', description: 'Photo editing, video editing, and effects' },
  // Business
  { id: 'biz-crm', label: 'CRM & Sales', icon: '\u{1F4BC}', domain: 'business', description: 'Customer relationship management and sales' },
  { id: 'biz-email', label: 'Email Marketing', icon: '\u{1F4E8}', domain: 'business', description: 'Email campaigns, newsletters, and automation' },
  { id: 'biz-social', label: 'Social Media', icon: '\u{1F4F1}', domain: 'business', description: 'Social media management and scheduling' },
  { id: 'biz-analytics', label: 'Analytics', icon: '\u{1F4CA}', domain: 'business', description: 'Web analytics, tracking, and insights' },
  // Infrastructure
  { id: 'infra-cloud', label: 'Cloud Hosting', icon: '\u{2601}\uFE0F', domain: 'infra', description: 'Cloud hosting, VPS, and static sites' },
  { id: 'infra-serverless', label: 'Serverless', icon: '\u{26A1}', domain: 'infra', description: 'Serverless functions and edge computing' },
  { id: 'infra-containers', label: 'Containers', icon: '\u{1F4E6}', domain: 'infra', description: 'Docker, Kubernetes, and container orchestration' },
  { id: 'infra-monitoring', label: 'Monitoring', icon: '\u{1F4C9}', domain: 'infra', description: 'Uptime monitoring, logging, and observability' },
  // Legacy categories (mapped for backward compatibility)
  { id: 'dev-coding', label: 'Coding & Developer Workflow', icon: '\u{1F4BB}', domain: 'dev', description: 'Developer tools and coding workflows' },
  { id: 'dev-learning', label: 'Learning & Career', icon: '\u{1F393}', domain: 'dev', description: 'Learning platforms and career resources' },
  { id: 'dev-data', label: 'Public Data & Datasets', icon: '\u{1F5C4}\uFE0F', domain: 'dev', description: 'Open data APIs and public datasets' },
  { id: 'dev-docs', label: 'Docs & Research', icon: '\u{1F4DA}', domain: 'dev', description: 'Documentation, research, and knowledge tools' },
  { id: 'dev-design', label: 'Design & Media', icon: '\u{1F58C}\uFE0F', domain: 'design', description: 'Design, images, audio, and video tools' },
  { id: 'dev-productivity', label: 'Productivity & Life Admin', icon: '\u{1F4CB}', domain: 'prod', description: 'Productivity tools and life management' },
  { id: 'ai-open-source', label: 'Open Source Models', icon: '\u{1F4BE}', domain: 'ai', description: 'Downloadable open-source AI models' },
  { id: 'ai-pdf', label: 'Document & PDF Tools', icon: '\u{1F4C4}', domain: 'ai', description: 'AI-powered PDF and document processing' },
];

// ─── Helper Functions ───────────────────────────────────────────────────────

/** Get the domain for a given category */
export function getDomainForCategory(category: ToolCategory): Domain {
  return CATEGORY_TO_DOMAIN[category] || 'ai';
}

/** Get all categories for a given domain */
export function getCategoriesForDomain(domain: Domain): CategoryDefinition[] {
  return CATEGORY_DEFINITIONS.filter((c) => c.domain === domain);
}

/** Get category definition by ID */
export function getCategoryDefinition(category: ToolCategory): CategoryDefinition | undefined {
  return CATEGORY_DEFINITIONS.find((c) => c.id === category);
}

/** Get domain definition by ID */
export function getDomainDefinition(domain: Domain): DomainDefinition | undefined {
  return DOMAINS.find((d) => d.id === domain);
}

/** Get category label by ID (with fallback) */
export function getCategoryLabel(category: ToolCategory): string {
  return getCategoryDefinition(category)?.label || category;
}

/** Get category icon by ID (with fallback) */
export function getCategoryIcon(category: ToolCategory): string {
  return getCategoryDefinition(category)?.icon || '\u{1F4E6}';
}

/** Check if a category matches a domain prefix (backward compat) */
export function matchesCategoryPrefix(category: ToolCategory, prefix: 'ai' | 'dev'): boolean {
  const domain = getDomainForCategory(category);
  if (prefix === 'ai') return domain === 'ai';
  if (prefix === 'dev') return domain === 'dev' || domain === 'infra';
  return false;
}

/** Get tool count per domain from a list of categories */
export function getCategoryCountsByDomain(categories: ToolCategory[]): Record<Domain, number> {
  const counts: Record<Domain, number> = { ai: 0, dev: 0, prod: 0, design: 0, business: 0, infra: 0 };
  for (const cat of categories) {
    const domain = getDomainForCategory(cat);
    counts[domain]++;
  }
  return counts;
}
