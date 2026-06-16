/**
 * Enhanced Tool type system for the redesigned AI Tools Directory.
 * Supports unified taxonomy, progressive filtering, privacy transparency,
 * and workflow discovery across AI, Dev, Productivity, and more.
 */

// ─── Category System (3-level hierarchy) ────────────────────────────────────

/** Level 1: Domain (6 top-level domains) */
export type Domain = 'ai' | 'dev' | 'prod' | 'design' | 'business' | 'infra';

/** Level 2: Function categories (24 functions across domains) */
export type ToolCategory =
  // AI & Machine Learning (11)
  | 'ai-chat'
  | 'ai-image'
  | 'ai-video'
  | 'ai-audio'
  | 'ai-writing'
  | 'ai-search'
  | 'ai-document'
  | 'ai-presentation'
  | 'ai-math'
  | 'ai-coding'
  | 'ai-agents'
  | 'ai-models'
  | 'ai-inference'
  // Development & DevOps (8)
  | 'dev-editors'
  | 'dev-vcs'
  | 'dev-databases'
  | 'dev-backend'
  | 'dev-automation'
  | 'dev-testing'
  | 'dev-security'
  | 'dev-cli'
  // Productivity & Collaboration (4)
  | 'prod-notes'
  | 'prod-project'
  | 'prod-communication'
  | 'prod-time'
  // Design & Creative (4)
  | 'design-ui'
  | 'design-graphic'
  | 'design-3d'
  | 'design-photo'
  // Business & Marketing (4)
  | 'biz-crm'
  | 'biz-email'
  | 'biz-social'
  | 'biz-analytics'
  // Infrastructure & Hosting (4)
  | 'infra-cloud'
  | 'infra-serverless'
  | 'infra-containers'
  | 'infra-monitoring'
  // Legacy / Migration (kept for backward compat)
  | 'dev-coding'
  | 'dev-learning'
  | 'dev-data'
  | 'dev-docs'
  | 'dev-design'
  | 'dev-productivity'
  | 'ai-open-source'
  | 'ai-pdf';

/** Level 3: Specific use case subcategories (optional) */
export type Subcategory =
  | 'vscode-extension'
  | 'jetbrains-plugin'
  | 'cli-tool'
  | 'cloud-ide'
  | 'general-purpose'
  | 'privacy-focused'
  | 'code-focused'
  | 'research-focused'
  | 'long-context'
  | 'reasoning'
  | 'multilingual'
  | 'coding-specialist';

// ─── Tag System (5 categories) ──────────────────────────────────────────────

export type TagCategory = 'access' | 'pricing' | 'platform' | 'capability' | 'quality';

export interface TagDefinition {
  id: string;
  label: string;
  category: TagCategory;
  description: string;
  icon?: string;
  applicableTo?: ToolCategory[];
}

// ─── Surface / Access Types ─────────────────────────────────────────────────

export type Surface = 'web' | 'api' | 'cli';

export type AccessType =
  | 'no-login'
  | 'public-api'
  | 'open-source'
  | 'free-tier'
  | 'free-key'
  | 'self-host';

export type PricingModel = 'free' | 'freemium' | 'paid' | 'byok' | 'open-source';

// ─── Platform Support ───────────────────────────────────────────────────────

export interface PlatformInfo {
  web: boolean;
  desktop: {
    windows: boolean;
    mac: boolean;
    linux: boolean;
  };
  mobile: {
    ios: boolean;
    android: boolean;
  };
  cli: boolean;
  api: boolean;
  ide: {
    vscode: boolean;
    jetbrains: boolean;
    neovim: boolean;
    other: string[];
  };
  docker: boolean;
}

// ─── Pricing Info ───────────────────────────────────────────────────────────

export interface PricingInfo {
  model: PricingModel;
  freeTier?: {
    limits: string;
    requiresCard: boolean;
    requiresSignup: boolean;
  };
  paidTiers?: Array<{
    name: string;
    price: string;
    features: string[];
  }>;
  byokProviders?: string[];
}

// ─── Privacy Info ───────────────────────────────────────────────────────────

export type PrivacyLevel = 'high' | 'medium' | 'low';

export interface PrivacyInfo {
  level: PrivacyLevel;
  telemetry: boolean;
  trainingOnPrompts: boolean;
  encryption: boolean;
  dataResidency?: string[];
}

// ─── Quality & Trust ────────────────────────────────────────────────────────

export interface QualityInfo {
  verified: boolean;
  verifiedDate?: string;
  privacy: PrivacyInfo;
  trust: {
    communityRating?: number;
    githubStars?: number;
  };
}

// ─── Enhanced Tool Interface ────────────────────────────────────────────────

export interface Tool {
  id: string;
  name: string;
  url: string;
  description: string;
  longDescription?: string;

  category: ToolCategory;
  subcategory?: Subcategory;
  tags: string[];

  surface: Surface;
  access: AccessType;
  requiresSignup: boolean;

  pricing: PricingInfo;
  platforms?: Partial<PlatformInfo>;
  quality?: Partial<QualityInfo>;

  badges: string[];
  bestFor: string;
  qualityNote: string;
  caveat?: string;

  alternatives?: string[];
  stacks?: string[];

  lastVerified?: string;
  addedDate?: string;
}

// ─── AI Model Interface ─────────────────────────────────────────────────────

export type ModelArchitecture = 'dense' | 'moe';

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  family: string;

  parameters: {
    total: string;
    active?: string;
    architecture: ModelArchitecture;
  };
  contextWindow: string;

  modalities: Array<'text' | 'image' | 'audio' | 'video' | 'code'>;
  benchmarks: {
    mmlu?: number;
    humanEval?: number;
    math?: number;
    reasoning?: number;
    multilingual?: number;
    sweBench?: number;
  };

  license: {
    type: string;
    commercial: boolean;
    restrictions?: string[];
  };

  availability: {
    openWeights: boolean;
    huggingFace?: string;
    inferenceProviders: string[];
    localRunners: string[];
  };

  hardware: {
    minRam: string;
    recommendedRam: string;
    gpu: 'required' | 'recommended' | 'optional';
    quantization?: string[];
  };

  bestFor: string[];
  releaseDate: string;
  lastUpdated: string;
}

// ─── Tool Stack Interface ───────────────────────────────────────────────────

export type StackAudience =
  | 'freelancer'
  | 'indie-hacker'
  | 'startup'
  | 'student'
  | 'job-seeker'
  | 'developer';

export type StackBudget = 'zero' | 'low' | 'medium' | 'high';
export type StackExperience = 'beginner' | 'intermediate' | 'advanced';

export interface ToolStack {
  id: string;
  name: string;
  description: string;

  audience: {
    type: StackAudience;
    budget: StackBudget;
    experience: StackExperience;
  };

  useCase: string;

  tools: Array<{
    toolId: string;
    role: string;
    optional: boolean;
    alternatives?: string[];
  }>;

  workflow: Array<{
    step: number;
    title: string;
    description: string;
    tools: string[];
  }>;

  cost: {
    total: string;
    breakdown: Array<{
      tool: string;
      cost: string;
      notes?: string;
    }>;
  };

  resources: Array<{
    title: string;
    url: string;
    type: 'tutorial' | 'video' | 'article' | 'documentation';
  }>;

  createdBy: string;
  createdAt: string;
  updatedAt: string;
  verified: boolean;
}

// ─── Inference Provider Interface ───────────────────────────────────────────

export interface InferenceProvider {
  id: string;
  name: string;
  url: string;

  freeTier: {
    tokensPerDay?: string;
    requestsPerDay?: string;
    requiresCard: boolean;
    requiresSignup: boolean;
    limits: string;
  };

  topFreeModels: string[];
  apiFormat: 'openai-compatible' | 'custom' | 'anthropic-compatible';

  quality: {
    speed: 'ultra-fast' | 'fast' | 'normal' | 'slow';
    reliability: 'high' | 'medium' | 'low';
  };

  bestFor: string;
  caveat?: string;
  lastVerified?: string;
}

// ─── Filter State ───────────────────────────────────────────────────────────

export interface FilterState {
  category: ToolCategory | null;
  subcategory: Subcategory | null;
  tags: string[];
  searchQuery: string;
  platforms: string[];
  sortBy: 'relevance' | 'popularity' | 'newest' | 'name';
}

export interface FilterPreset {
  id: string;
  name: string;
  description: string;
  filters: Partial<FilterState>;
}

// ─── Recommendation ─────────────────────────────────────────────────────────

export interface Recommendation {
  sourceToolId: string;
  recommendedToolId: string;
  reason: string;
  similarity: number;
}
