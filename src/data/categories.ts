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
  labelJa: string;
  icon: string;
  description: string;
  descriptionJa: string;
}

export const DOMAINS: DomainDefinition[] = [
  { id: 'ai', label: 'AI & Machine Learning', labelJa: 'AI・機械学習', icon: '\u{1F916}', description: 'AI-powered tools for chat, image, video, coding, and more', descriptionJa: 'チャット、画像、動画、コーディングなどのAIツール' },
  { id: 'dev', label: 'Development & DevOps', labelJa: '開発・DevOps', icon: '\u{1F4BB}', description: 'Code editors, version control, databases, and automation', descriptionJa: 'コードエディタ、バージョン管理、データベース、自動化' },
  { id: 'prod', label: 'Productivity & Collaboration', labelJa: '生産性・コラボレーション', icon: '\u{1F4CB}', description: 'Notes, project management, and communication', descriptionJa: 'メモ、プロジェクト管理、コミュニケーション' },
  { id: 'design', label: 'Design & Creative', labelJa: 'デザイン・クリエイティブ', icon: '\u{1F3A8}', description: 'UI/UX, graphic design, 3D, and video editing', descriptionJa: 'UI/UX、グラフィックデザイン、3D、動画編集' },
  { id: 'business', label: 'Business & Marketing', labelJa: 'ビジネス・マーケティング', icon: '\u{1F4C8}', description: 'CRM, email, social media, and analytics', descriptionJa: 'CRM、メール、ソーシャルメディア、分析' },
  { id: 'infra', label: 'Infrastructure & Hosting', labelJa: 'インフラ・ホスティング', icon: '\u{1F680}', description: 'Cloud hosting, serverless, containers, and monitoring', descriptionJa: 'クラウドホスティング、サーバーレス、コンテナ、モニタリング' },
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
  labelJa: string;
  icon: string;
  domain: Domain;
  description: string;
  descriptionJa: string;
  subcategories?: Subcategory[];
}

export const CATEGORY_DEFINITIONS: CategoryDefinition[] = [
  // AI & Machine Learning
  { id: 'ai-chat', label: 'Chat & Assistants', labelJa: 'チャット＆アシスタント', icon: '\u{1F4AC}', domain: 'ai', description: 'AI chatbots and conversational assistants', descriptionJa: 'AIチャットボットと対話型アシスタント', subcategories: ['general-purpose', 'privacy-focused', 'code-focused', 'research-focused'] },
  { id: 'ai-image', label: 'Image Generation', labelJa: '画像生成', icon: '\u{1F3A8}', domain: 'ai', description: 'AI-powered image creation and editing', descriptionJa: 'AIによる画像作成・編集' },
  { id: 'ai-video', label: 'Video Generation', labelJa: '動画生成', icon: '\u{1F3AC}', domain: 'ai', description: 'AI video creation, editing, and effects', descriptionJa: 'AIによる動画作成・編集・エフェクト' },
  { id: 'ai-audio', label: 'Audio & Music', labelJa: '音声・音楽', icon: '\u{1F3B5}', domain: 'ai', description: 'AI music, voice, TTS, and audio processing', descriptionJa: 'AI音楽・音声・TTS・音声処理' },
  { id: 'ai-writing', label: 'Writing & Content', labelJa: '文章作成・コンテンツ', icon: '\u{270D}\uFE0F', domain: 'ai', description: 'AI writing, summarization, and translation', descriptionJa: 'AI文章作成・要約・翻訳' },
  { id: 'ai-search', label: 'Search & Research', labelJa: '検索・リサーチ', icon: '\u{1F50D}', domain: 'ai', description: 'AI-powered search engines and research tools', descriptionJa: 'AI検索エンジン・リサーチツール' },
  { id: 'ai-document', label: 'Document Processing', labelJa: 'ドキュメント処理', icon: '\u{1F4C4}', domain: 'ai', description: 'AI tools for PDFs, documents, and data extraction', descriptionJa: 'PDF・ドキュメント・データ抽出のAIツール' },
  { id: 'ai-presentation', label: 'Presentations', labelJa: 'プレゼンテーション', icon: '\u{1F4CA}', domain: 'ai', description: 'AI-powered slide and presentation creation', descriptionJa: 'AIによるスライド・プレゼン作成' },
  { id: 'ai-math', label: 'Math & Science', labelJa: '数学・科学', icon: '\u{1F9EE}', domain: 'ai', description: 'AI for mathematics, science, and education', descriptionJa: '数学・科学・教育向けAI' },
  { id: 'ai-coding', label: 'Coding Assistants', labelJa: 'コーディングアシスタント', icon: '\u{1F6E0}\uFE0F', domain: 'ai', description: 'AI-powered code generation and assistance', descriptionJa: 'AIによるコード生成・支援', subcategories: ['vscode-extension', 'jetbrains-plugin', 'cli-tool', 'cloud-ide'] },
  { id: 'ai-agents', label: 'Agent Platforms', labelJa: 'エージェントプラットフォーム', icon: '\u{1F916}', domain: 'ai', description: 'Autonomous AI agents and orchestration platforms', descriptionJa: '自律型AIエージェント・オーケストレーションプラットフォーム' },
  { id: 'ai-models', label: 'Models & Weights', labelJa: 'モデル・重み', icon: '\u{1F31F}', domain: 'ai', description: 'Open-source LLMs and model weights', descriptionJa: 'オープンソースLLM・モデル重み', subcategories: ['long-context', 'reasoning', 'multilingual', 'coding-specialist'] },
  { id: 'ai-inference', label: 'Inference Providers', labelJa: '推論プロバイダー', icon: '\u{26A1}', domain: 'ai', description: 'API providers for running AI models', descriptionJa: 'AIモデル実行用APIプロバイダー' },
  // Development & DevOps
  { id: 'dev-editors', label: 'Code Editors & IDEs', labelJa: 'コードエディタ・IDE', icon: '\u{1F4BB}', domain: 'dev', description: 'Code editors, IDEs, and development environments', descriptionJa: 'コードエディタ・IDE・開発環境' },
  { id: 'dev-vcs', label: 'Version Control', labelJa: 'バージョン管理', icon: '\u{1F500}', domain: 'dev', description: 'Git, version control, and collaboration', descriptionJa: 'Git・バージョン管理・コラボレーション' },
  { id: 'dev-databases', label: 'Databases', labelJa: 'データベース', icon: '\u{1F5C4}\uFE0F', domain: 'dev', description: 'Databases, ORMs, and data storage', descriptionJa: 'データベース・ORM・データストレージ' },
  { id: 'dev-backend', label: 'Backend & APIs', labelJa: 'バックエンド・API', icon: '\u{1F527}', domain: 'dev', description: 'Backend frameworks, APIs, and server tools', descriptionJa: 'バックエンドフレームワーク・API・サーバーツール' },
  { id: 'dev-automation', label: 'Automation & CI/CD', labelJa: '自動化・CI/CD', icon: '\u{2699}\uFE0F', domain: 'dev', description: 'Automation, CI/CD, and DevOps tools', descriptionJa: '自動化・CI/CD・DevOpsツール' },
  { id: 'dev-testing', label: 'Testing & QA', labelJa: 'テスト・QA', icon: '\u{1F9EA}', domain: 'dev', description: 'Testing frameworks, QA tools, and mocking', descriptionJa: 'テストフレームワーク・QAツール・モッキング' },
  { id: 'dev-security', label: 'Security & Privacy', labelJa: 'セキュリティ・プライバシー', icon: '\u{1F512}', domain: 'dev', description: 'Security scanning, encryption, and privacy tools', descriptionJa: 'セキュリティスキャン・暗号化・プライバシーツール' },
  { id: 'dev-cli', label: 'CLI Tools', labelJa: 'CLIツール', icon: '\u{1F4DF}', domain: 'dev', description: 'Command-line utilities and developer productivity', descriptionJa: 'コマンドラインユーティリティ・開発者生産性' },
  // Productivity
  { id: 'prod-notes', label: 'Note-taking & Knowledge', labelJa: 'メモ・ナレッジ', icon: '\u{1F4DD}', domain: 'prod', description: 'Notes, wikis, and knowledge management', descriptionJa: 'メモ・Wiki・ナレッジ管理' },
  { id: 'prod-project', label: 'Project Management', labelJa: 'プロジェクト管理', icon: '\u{1F4CB}', domain: 'prod', description: 'Task tracking, project planning, and collaboration', descriptionJa: 'タスク追跡・プロジェクト計画・コラボレーション' },
  { id: 'prod-communication', label: 'Communication', labelJa: 'コミュニケーション', icon: '\u{1F4E7}', domain: 'prod', description: 'Email, messaging, and team communication', descriptionJa: 'メール・メッセージング・チームコミュニケーション' },
  { id: 'prod-time', label: 'Time Tracking', labelJa: '時間追跡', icon: '\u{23F0}', domain: 'prod', description: 'Time tracking, calendars, and scheduling', descriptionJa: '時間追跡・カレンダー・スケジューリング' },
  // Design
  { id: 'design-ui', label: 'UI/UX Design', labelJa: 'UI/UXデザイン', icon: '\u{1F58C}\uFE0F', domain: 'design', description: 'UI design, prototyping, and wireframing', descriptionJa: 'UIデザイン・プロトタイピング・ワイヤーフレーム' },
  { id: 'design-graphic', label: 'Graphic Design', labelJa: 'グラフィックデザイン', icon: '\u{1F3A8}', domain: 'design', description: 'Graphic design, illustrations, and branding', descriptionJa: 'グラフィックデザイン・イラスト・ブランディング' },
  { id: 'design-3d', label: '3D & Animation', labelJa: '3D・アニメーション', icon: '\u{1F3AE}', domain: 'design', description: '3D modeling, animation, and rendering', descriptionJa: '3Dモデリング・アニメーション・レンダリング' },
  { id: 'design-photo', label: 'Photo & Video Editing', labelJa: '写真・動画編集', icon: '\u{1F4F7}', domain: 'design', description: 'Photo editing, video editing, and effects', descriptionJa: '写真編集・動画編集・エフェクト' },
  // Business
  { id: 'biz-crm', label: 'CRM & Sales', labelJa: 'CRM・営業', icon: '\u{1F4BC}', domain: 'business', description: 'Customer relationship management and sales', descriptionJa: '顧客関係管理・営業' },
  { id: 'biz-email', label: 'Email Marketing', labelJa: 'メールマーケティング', icon: '\u{1F4E8}', domain: 'business', description: 'Email campaigns, newsletters, and automation', descriptionJa: 'メールキャンペーン・ニュースレター・自動化' },
  { id: 'biz-social', label: 'Social Media', labelJa: 'ソーシャルメディア', icon: '\u{1F4F1}', domain: 'business', description: 'Social media management and scheduling', descriptionJa: 'ソーシャルメディア管理・スケジューリング' },
  { id: 'biz-analytics', label: 'Analytics', labelJa: '分析', icon: '\u{1F4CA}', domain: 'business', description: 'Web analytics, tracking, and insights', descriptionJa: 'Web分析・追跡・インサイト' },
  // Infrastructure
  { id: 'infra-cloud', label: 'Cloud Hosting', labelJa: 'クラウドホスティング', icon: '\u{2601}\uFE0F', domain: 'infra', description: 'Cloud hosting, VPS, and static sites', descriptionJa: 'クラウドホスティング・VPS・静的サイト' },
  { id: 'infra-serverless', label: 'Serverless', labelJa: 'サーバーレス', icon: '\u{26A1}', domain: 'infra', description: 'Serverless functions and edge computing', descriptionJa: 'サーバーレス関数・エッジコンピューティング' },
  { id: 'infra-containers', label: 'Containers', labelJa: 'コンテナ', icon: '\u{1F4E6}', domain: 'infra', description: 'Docker, Kubernetes, and container orchestration', descriptionJa: 'Docker・Kubernetes・コンテナオーケストレーション' },
  { id: 'infra-monitoring', label: 'Monitoring', labelJa: 'モニタリング', icon: '\u{1F4C9}', domain: 'infra', description: 'Uptime monitoring, logging, and observability', descriptionJa: '稼働監視・ロギング・オブザーバビリティ' },
  // Legacy categories (mapped for backward compatibility)
  { id: 'dev-coding', label: 'Coding & Developer Workflow', labelJa: 'コーディング・開発者ワークフロー', icon: '\u{1F4BB}', domain: 'dev', description: 'Developer tools and coding workflows', descriptionJa: '開発者ツール・コーディングワークフロー' },
  { id: 'dev-learning', label: 'Learning & Career', labelJa: '学習・キャリア', icon: '\u{1F393}', domain: 'dev', description: 'Learning platforms and career resources', descriptionJa: '学習プラットフォーム・キャリアリソース' },
  { id: 'dev-data', label: 'Public Data & Datasets', labelJa: '公開データ・データセット', icon: '\u{1F5C4}\uFE0F', domain: 'dev', description: 'Open data APIs and public datasets', descriptionJa: 'オープンデータAPI・公開データセット' },
  { id: 'dev-docs', label: 'Docs & Research', labelJa: 'ドキュメント・リサーチ', icon: '\u{1F4DA}', domain: 'dev', description: 'Documentation, research, and knowledge tools', descriptionJa: 'ドキュメント・リサーチ・ナレッジツール' },
  { id: 'dev-design', label: 'Design & Media', labelJa: 'デザイン・メディア', icon: '\u{1F58C}\uFE0F', domain: 'design', description: 'Design, images, audio, and video tools', descriptionJa: 'デザイン・画像・音声・動画ツール' },
  { id: 'dev-productivity', label: 'Productivity & Life Admin', labelJa: '生産性・ライフ管理', icon: '\u{1F4CB}', domain: 'prod', description: 'Productivity tools and life management', descriptionJa: '生産性ツール・ライフ管理' },
  { id: 'ai-open-source', label: 'Open Source Models', labelJa: 'オープンソースモデル', icon: '\u{1F4BE}', domain: 'ai', description: 'Downloadable open-source AI models', descriptionJa: 'ダウンロード可能なオープンソースAIモデル' },
  { id: 'ai-pdf', label: 'Document & PDF Tools', labelJa: 'ドキュメント・PDFツール', icon: '\u{1F4C4}', domain: 'ai', description: 'AI-powered PDF and document processing', descriptionJa: 'AIによるPDF・ドキュメント処理' },
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
