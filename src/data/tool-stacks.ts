/**
 * Tool Stacks — Curated tool combinations for zero-budget workflows.
 * Core data for the Workflow Discovery section.
 */

import type { ToolStack } from '../types/tool';

export const toolStacks: ToolStack[] = [
  {
    id: 'saas-mvp-zero',
    name: 'Build SaaS MVP for $0',
    description:
      'Everything needed to build and launch a SaaS MVP without spending a dollar. All tools have generous free tiers suitable for early-stage products.',
    audience: { type: 'indie-hacker', budget: 'zero', experience: 'beginner' },
    useCase: 'Build and launch a SaaS product',
    tools: [
      { toolId: 'kilo-code', role: 'Code Editor', optional: false, alternatives: ['cline', 'cursor'] },
      { toolId: 'openrouter-free', role: 'AI Models', optional: false, alternatives: ['groq-api', 'cerebras-inference'] },
      { toolId: 'supabase', role: 'Database', optional: false, alternatives: ['neon', 'firebase-studio'] },
      { toolId: 'cloudflare-pages', role: 'Hosting', optional: false, alternatives: ['vercel-free', 'github-pages'] },
      { toolId: 'git', role: 'Version Control', optional: false },
    ],
    workflow: [
      { step: 1, title: 'Setup Development Environment', description: 'Install Kilo Code extension in VS Code, configure OpenRouter API key (free tier), initialize Git repo.', tools: ['kilo-code', 'git'] },
      { step: 2, title: 'Design Database Schema', description: 'Create Supabase project, design tables for users, projects, and features. Enable Row Level Security.', tools: ['supabase'] },
      { step: 3, title: 'Build Frontend', description: 'Use Kilo Code with Claude 3.5 Sonnet (via OpenRouter) to generate React components, implement authentication, and build UI.', tools: ['kilo-code', 'openrouter-free'] },
      { step: 4, title: 'Implement Backend', description: 'Build API endpoints using Supabase Edge Functions, implement AI features using OpenRouter API.', tools: ['kilo-code', 'supabase'] },
      { step: 5, title: 'Deploy to Production', description: 'Connect GitHub repo to Cloudflare Pages, configure automatic deployments on push.', tools: ['cloudflare-pages', 'git'] },
    ],
    cost: {
      total: '$0/month',
      breakdown: [
        { tool: 'kilo-code', cost: '$0', notes: 'Free extension, BYOK' },
        { tool: 'openrouter-free', cost: '$0', notes: 'Free tier: 1K req/day' },
        { tool: 'supabase', cost: '$0', notes: 'Free tier: 500MB database' },
        { tool: 'cloudflare-pages', cost: '$0', notes: 'Free tier: unlimited sites' },
        { tool: 'git', cost: '$0', notes: 'Free for public repos' },
      ],
    },
    resources: [
      { title: 'Supabase + OpenRouter Integration Guide', url: 'https://supabase.com/docs', type: 'documentation' },
      { title: 'Cloudflare Pages Getting Started', url: 'https://developers.cloudflare.com/pages/', type: 'documentation' },
    ],
    createdBy: 'Banal Team',
    createdAt: '2026-06-15',
    updatedAt: '2026-06-15',
    verified: true,
  },
  {
    id: 'freelance-web-dev',
    name: 'Freelance Web Development',
    description:
      'Complete toolkit for freelance web developers. Build client sites efficiently with AI-assisted coding and free hosting.',
    audience: { type: 'freelancer', budget: 'low', experience: 'intermediate' },
    useCase: 'Build client websites and web applications',
    tools: [
      { toolId: 'github-copilot-free', role: 'AI Assistant', optional: false, alternatives: ['codeium', 'cline'] },
      { toolId: 'vercel-free', role: 'Hosting', optional: false, alternatives: ['cloudflare-pages', 'netlify'] },
      { toolId: 'supabase', role: 'Database', optional: false, alternatives: ['neon'] },
      { toolId: 'excalidraw', role: 'Design', optional: true },
      { toolId: 'git', role: 'Version Control', optional: false },
    ],
    workflow: [
      { step: 1, title: 'Client Discovery & Design', description: 'Use Excalidraw for wireframes and mockups. Share with client for feedback.', tools: ['excalidraw'] },
      { step: 2, title: 'Setup Project', description: 'Initialize Git repo, set up hosting on Vercel, configure Supabase database.', tools: ['git', 'vercel-free', 'supabase'] },
      { step: 3, title: 'Build with AI', description: 'Use GitHub Copilot for code completion and AI-assisted development. Build components iteratively.', tools: ['github-copilot-free'] },
      { step: 4, title: 'Deploy & Iterate', description: 'Deploy to Vercel with preview URLs for client review. Iterate based on feedback.', tools: ['vercel-free', 'git'] },
    ],
    cost: {
      total: '$0/month',
      breakdown: [
        { tool: 'github-copilot-free', cost: '$0', notes: '2K completions/month free' },
        { tool: 'vercel-free', cost: '$0', notes: 'Free tier for hobby projects' },
        { tool: 'supabase', cost: '$0', notes: 'Free tier: 500MB' },
        { tool: 'excalidraw', cost: '$0', notes: 'Open source, free' },
        { tool: 'git', cost: '$0', notes: 'Free' },
      ],
    },
    resources: [
      { title: 'Vercel Deployment Guide', url: 'https://vercel.com/docs', type: 'documentation' },
    ],
    createdBy: 'Banal Team',
    createdAt: '2026-06-15',
    updatedAt: '2026-06-15',
    verified: true,
  },
  {
    id: 'local-ai-dev',
    name: 'Local AI Development',
    description:
      'Run AI models locally for complete privacy and zero cloud costs. Perfect for sensitive data and offline development.',
    audience: { type: 'developer', budget: 'zero', experience: 'intermediate' },
    useCase: 'Run AI models locally with full privacy',
    tools: [
      { toolId: 'ollama', role: 'Model Runner', optional: false, alternatives: ['lm-studio', 'jan-ai'] },
      { toolId: 'open-webui', role: 'Chat Interface', optional: true },
      { toolId: 'continue-dev', role: 'IDE Integration', optional: true },
      { toolId: 'qwen-2.5-7b', role: 'General Model', optional: false, alternatives: ['llama-3.1-8b'] },
      { toolId: 'deepseek-r1-distill-70b', role: 'Coding Model', optional: true, alternatives: ['codestral'] },
    ],
    workflow: [
      { step: 1, title: 'Install Ollama', description: 'Download and install Ollama for your OS. One command to get started.', tools: ['ollama'] },
      { step: 2, title: 'Download Models', description: 'Pull Qwen 2.5 7B for general tasks and DeepSeek Coder for coding. Models download once and run offline.', tools: ['ollama'] },
      { step: 3, title: 'Setup Chat UI', description: 'Install Open WebUI for a browser-based chat interface connected to your local models.', tools: ['open-webui'] },
      { step: 4, title: 'IDE Integration', description: 'Install Continue.dev in VS Code for AI code completion using your local models.', tools: ['continue-dev'] },
    ],
    cost: {
      total: '$0/month',
      breakdown: [
        { tool: 'ollama', cost: '$0', notes: 'Open source, free forever' },
        { tool: 'open-webui', cost: '$0', notes: 'Open source' },
        { tool: 'continue-dev', cost: '$0', notes: 'Open source' },
        { tool: 'qwen-2.5-7b', cost: '$0', notes: 'Open weights, free' },
        { tool: 'deepseek-r1-distill-70b', cost: '$0', notes: 'Open weights, free' },
      ],
    },
    resources: [
      { title: 'Ollama Getting Started', url: 'https://ollama.com/', type: 'documentation' },
      { title: 'Open WebUI Setup Guide', url: 'https://github.com/open-webui/open-webui', type: 'documentation' },
    ],
    createdBy: 'Banal Team',
    createdAt: '2026-06-15',
    updatedAt: '2026-06-15',
    verified: true,
  },
  {
    id: 'student-learning',
    name: 'Student Learning Stack',
    description:
      'Free tools for students learning to code. Includes AI tutoring, practice platforms, and development environments.',
    audience: { type: 'student', budget: 'zero', experience: 'beginner' },
    useCase: 'Learn programming and computer science',
    tools: [
      { toolId: 'freecodecamp', role: 'Curriculum', optional: false },
      { toolId: 'exercism', role: 'Practice', optional: true, alternatives: ['leetcode-free'] },
      { toolId: 'khan-academy', role: 'CS Fundamentals', optional: true },
      { toolId: 'replit', role: 'Code Environment', optional: false, alternatives: ['stackblitz', 'codesandbox'] },
      { toolId: 'chatgpt-free', role: 'AI Tutor', optional: true, alternatives: ['duck-ai', 'google-gemini'] },
    ],
    workflow: [
      { step: 1, title: 'Choose a Learning Path', description: 'Start with freeCodeCamp curriculum or Khan Academy CS fundamentals.', tools: ['freecodecamp', 'khan-academy'] },
      { step: 2, title: 'Practice Daily', description: 'Solve coding challenges on Exercism with mentor feedback.', tools: ['exercism'] },
      { step: 3, title: 'Build Projects', description: 'Use Replit to build projects in the browser without any setup.', tools: ['replit'] },
      { step: 4, title: 'Get AI Help', description: 'Use ChatGPT or Duck.ai when stuck on concepts or debugging.', tools: ['chatgpt-free'] },
    ],
    cost: {
      total: '$0/month',
      breakdown: [
        { tool: 'freecodecamp', cost: '$0', notes: 'Completely free' },
        { tool: 'exercism', cost: '$0', notes: 'Free with mentorship' },
        { tool: 'replit', cost: '$0', notes: 'Free tier' },
        { tool: 'chatgpt-free', cost: '$0', notes: 'Free tier' },
      ],
    },
    resources: [
      { title: 'freeCodeCamp Curriculum', url: 'https://www.freecodecamp.org/learn/', type: 'tutorial' },
      { title: 'roadmap.sh Developer Roadmaps', url: 'https://roadmap.sh/', type: 'article' },
    ],
    createdBy: 'Banal Team',
    createdAt: '2026-06-15',
    updatedAt: '2026-06-15',
    verified: true,
  },
  {
    id: 'content-creator',
    name: 'Content Creator Toolkit',
    description:
      'Free AI tools for content creators: video editing, image generation, music, writing, and presentations.',
    audience: { type: 'freelancer', budget: 'zero', experience: 'beginner' },
    useCase: 'Create content for YouTube, blogs, and social media',
    tools: [
      { toolId: 'capcut', role: 'Video Editor', optional: false },
      { toolId: 'canva-free', role: 'Design', optional: false, alternatives: ['microsoft-designer'] },
      { toolId: 'suno', role: 'Music', optional: true, alternatives: ['udio'] },
      { toolId: 'gamma', role: 'Presentations', optional: true },
      { toolId: 'deepl-translator', role: 'Translation', optional: true },
    ],
    workflow: [
      { step: 1, title: 'Plan Content', description: 'Use Gamma for presentation outlines and Canva for thumbnails.', tools: ['gamma', 'canva-free'] },
      { step: 2, title: 'Create Visuals', description: 'Generate images with Canva AI, edit photos with Cleanup.Pictures.', tools: ['canva-free'] },
      { step: 3, title: 'Edit Video', description: 'Use CapCut for video editing with AI auto-captions and effects.', tools: ['capcut'] },
      { step: 4, title: 'Add Music', description: 'Generate background music with Suno or use royalty-free tracks.', tools: ['suno'] },
    ],
    cost: {
      total: '$0/month',
      breakdown: [
        { tool: 'capcut', cost: '$0', notes: 'Free tier' },
        { tool: 'canva-free', cost: '$0', notes: 'Free tier' },
        { tool: 'suno', cost: '$0', notes: 'Daily free credits' },
        { tool: 'gamma', cost: '$0', notes: 'Free tier' },
      ],
    },
    resources: [],
    createdBy: 'Banal Team',
    createdAt: '2026-06-15',
    updatedAt: '2026-06-15',
    verified: true,
  },
  {
    id: 'privacy-first',
    name: 'Privacy-First Stack',
    description:
      'Tools that respect your privacy. No telemetry, encrypted by default, self-hostable where possible.',
    audience: { type: 'developer', budget: 'zero', experience: 'intermediate' },
    useCase: 'Work with sensitive data while maintaining privacy',
    tools: [
      { toolId: 'jan-ai', role: 'Local AI', optional: false, alternatives: ['ollama'] },
      { toolId: 'vaultwarden', role: 'Passwords', optional: false, alternatives: ['bitwarden-free'] },
      { toolId: 'joplin-cloudless', role: 'Notes', optional: false, alternatives: ['logseq'] },
      { toolId: 'syncthing', role: 'File Sync', optional: false },
      { toolId: 'cryptpad', role: 'Collaboration', optional: true },
    ],
    workflow: [
      { step: 1, title: 'Setup Local AI', description: 'Install Jan for private AI chat with no data leaving your machine.', tools: ['jan-ai'] },
      { step: 2, title: 'Secure Passwords', description: 'Self-host Vaultwarden for family/team password management.', tools: ['vaultwarden'] },
      { step: 3, title: 'Private Notes', description: 'Use Joplin for local-first note-taking with optional sync.', tools: ['joplin-cloudless'] },
      { step: 4, title: 'Encrypted Sync', description: 'Use Syncthing for peer-to-peer file sync without cloud intermediaries.', tools: ['syncthing'] },
    ],
    cost: {
      total: '$0/month',
      breakdown: [
        { tool: 'jan-ai', cost: '$0', notes: 'Open source' },
        { tool: 'vaultwarden', cost: '$0', notes: 'Self-hosted' },
        { tool: 'joplin-cloudless', cost: '$0', notes: 'Open source' },
        { tool: 'syncthing', cost: '$0', notes: 'Open source' },
        { tool: 'cryptpad', cost: '$0', notes: 'Free tier' },
      ],
    },
    resources: [],
    createdBy: 'Banal Team',
    createdAt: '2026-06-15',
    updatedAt: '2026-06-15',
    verified: true,
  },
  {
    id: 'job-seeker-portfolio',
    name: 'Job Seeker Portfolio',
    description:
      'Build a professional portfolio and prepare for technical interviews with free tools.',
    audience: { type: 'job-seeker', budget: 'zero', experience: 'intermediate' },
    useCase: 'Build portfolio and prepare for interviews',
    tools: [
      { toolId: 'github-pages', role: 'Portfolio Hosting', optional: false, alternatives: ['cloudflare-pages'] },
      { toolId: 'leetcode-free', role: 'Interview Prep', optional: false, alternatives: ['exercism'] },
      { toolId: 'roadmap-sh', role: 'Learning Path', optional: false },
      { toolId: 'chatgpt-free', role: 'Resume Review', optional: true, alternatives: ['duck-ai'] },
      { toolId: 'git', role: 'Version Control', optional: false },
    ],
    workflow: [
      { step: 1, title: 'Plan Learning Path', description: 'Use roadmap.sh to identify skills needed for target roles.', tools: ['roadmap-sh'] },
      { step: 2, title: 'Build Projects', description: 'Create portfolio projects and push to GitHub.', tools: ['git', 'github-pages'] },
      { step: 3, title: 'Practice Interviews', description: 'Solve coding problems daily on LeetCode.', tools: ['leetcode-free'] },
      { step: 4, title: 'Polish Resume', description: 'Use AI chat to review and improve resume and cover letters.', tools: ['chatgpt-free'] },
    ],
    cost: {
      total: '$0/month',
      breakdown: [
        { tool: 'github-pages', cost: '$0', notes: 'Free for public repos' },
        { tool: 'leetcode-free', cost: '$0', notes: 'Many free problems' },
        { tool: 'roadmap-sh', cost: '$0', notes: 'Free' },
        { tool: 'chatgpt-free', cost: '$0', notes: 'Free tier' },
      ],
    },
    resources: [],
    createdBy: 'Banal Team',
    createdAt: '2026-06-15',
    updatedAt: '2026-06-15',
    verified: true,
  },
  {
    id: 'data-science',
    name: 'Data Science Toolkit',
    description:
      'Free tools for data science and ML: notebooks, datasets, visualization, and GPU compute.',
    audience: { type: 'developer', budget: 'zero', experience: 'intermediate' },
    useCase: 'Analyze data and build ML models',
    tools: [
      { toolId: 'google-colab', role: 'Notebooks', optional: false, alternatives: ['kaggle'] },
      { toolId: 'kaggle', role: 'Datasets', optional: false },
      { toolId: 'wolfram-alpha', role: 'Math', optional: true },
      { toolId: 'desmos', role: 'Visualization', optional: true },
      { toolId: 'uv', role: 'Python Packages', optional: false },
    ],
    workflow: [
      { step: 1, title: 'Find Datasets', description: 'Browse Kaggle for datasets relevant to your problem.', tools: ['kaggle'] },
      { step: 2, title: 'Explore Data', description: 'Use Google Colab with free GPU for data exploration and visualization.', tools: ['google-colab'] },
      { step: 3, title: 'Build Models', description: 'Train ML models in Colab using scikit-learn, PyTorch, or TensorFlow.', tools: ['google-colab', 'uv'] },
      { step: 4, title: 'Verify Results', description: 'Use Wolfram Alpha and Desmos to verify mathematical results.', tools: ['wolfram-alpha', 'desmos'] },
    ],
    cost: {
      total: '$0/month',
      breakdown: [
        { tool: 'google-colab', cost: '$0', notes: 'Free GPU' },
        { tool: 'kaggle', cost: '$0', notes: 'Free datasets + GPU' },
        { tool: 'wolfram-alpha', cost: '$0', notes: 'Free answers' },
        { tool: 'uv', cost: '$0', notes: 'Open source' },
      ],
    },
    resources: [],
    createdBy: 'Banal Team',
    createdAt: '2026-06-15',
    updatedAt: '2026-06-15',
    verified: true,
  },
  {
    id: 'automation-productivity',
    name: 'Automation & Productivity',
    description:
      'Automate repetitive tasks and boost productivity with free workflow tools.',
    audience: { type: 'developer', budget: 'zero', experience: 'intermediate' },
    useCase: 'Automate repetitive tasks and workflows',
    tools: [
      { toolId: 'n8n', role: 'Workflow Automation', optional: false },
      { toolId: 'just', role: 'Task Runner', optional: false },
      { toolId: 'direnv', role: 'Environment', optional: false },
      { toolId: 'fzf', role: 'Terminal Productivity', optional: true },
      { toolId: 'zoxide', role: 'Directory Jumping', optional: true },
    ],
    workflow: [
      { step: 1, title: 'Setup Automation', description: 'Self-host n8n for workflow automation (Zapier alternative).', tools: ['n8n'] },
      { step: 2, title: 'Project Tasks', description: 'Use just for clear, readable project commands (test, build, deploy).', tools: ['just'] },
      { step: 3, title: 'Environment Safety', description: 'Use direnv to load per-project environment variables safely.', tools: ['direnv'] },
      { step: 4, title: 'Terminal Speed', description: 'Use fzf and zoxide for faster terminal navigation.', tools: ['fzf', 'zoxide'] },
    ],
    cost: {
      total: '$0/month',
      breakdown: [
        { tool: 'n8n', cost: '$0', notes: 'Self-hosted' },
        { tool: 'just', cost: '$0', notes: 'Open source' },
        { tool: 'direnv', cost: '$0', notes: 'Open source' },
        { tool: 'fzf', cost: '$0', notes: 'Open source' },
        { tool: 'zoxide', cost: '$0', notes: 'Open source' },
      ],
    },
    resources: [],
    createdBy: 'Banal Team',
    createdAt: '2026-06-15',
    updatedAt: '2026-06-15',
    verified: true,
  },
  {
    id: 'open-source-contributor',
    name: 'Open Source Contributor',
    description:
      'Tools for contributing to open source projects effectively. Code review, testing, and collaboration.',
    audience: { type: 'developer', budget: 'zero', experience: 'intermediate' },
    useCase: 'Contribute to open source projects',
    tools: [
      { toolId: 'git', role: 'Version Control', optional: false },
      { toolId: 'gh-cli', role: 'GitHub CLI', optional: false },
      { toolId: 'lazygit', role: 'Git TUI', optional: true },
      { toolId: 'playwright', role: 'Testing', optional: true },
      { toolId: 'ruff', role: 'Code Quality', optional: true, alternatives: ['biome'] },
    ],
    workflow: [
      { step: 1, title: 'Find Projects', description: 'Use GitHub CLI to search for good-first-issue labels in your language.', tools: ['gh-cli'] },
      { step: 2, title: 'Fork & Branch', description: 'Fork the project, create a feature branch, and make changes.', tools: ['git', 'lazygit'] },
      { step: 3, title: 'Test & Lint', description: 'Run tests and linting before submitting.', tools: ['playwright', 'ruff'] },
      { step: 4, title: 'Submit PR', description: 'Create a pull request with clear description using GitHub CLI.', tools: ['gh-cli'] },
    ],
    cost: {
      total: '$0/month',
      breakdown: [
        { tool: 'git', cost: '$0', notes: 'Open source' },
        { tool: 'gh-cli', cost: '$0', notes: 'Open source' },
        { tool: 'lazygit', cost: '$0', notes: 'Open source' },
        { tool: 'playwright', cost: '$0', notes: 'Open source' },
        { tool: 'ruff', cost: '$0', notes: 'Open source' },
      ],
    },
    resources: [],
    createdBy: 'Banal Team',
    createdAt: '2026-06-15',
    updatedAt: '2026-06-15',
    verified: true,
  },
];

// ─── Helper Functions ───────────────────────────────────────────────────────

/** Get stack by ID */
export function getStackById(id: string): ToolStack | undefined {
  return toolStacks.find((s) => s.id === id);
}

/** Get stacks by audience type */
export function getStacksByAudience(audience: string): ToolStack[] {
  return toolStacks.filter((s) => s.audience.type === audience);
}

/** Get stacks by budget */
export function getStacksByBudget(budget: string): ToolStack[] {
  return toolStacks.filter((s) => s.audience.budget === budget);
}

/** Get zero-budget stacks */
export function getZeroBudgetStacks(): ToolStack[] {
  return toolStacks.filter((s) => s.audience.budget === 'zero');
}

/** Get all unique audience types */
export function getStackAudiences(): string[] {
  return [...new Set(toolStacks.map((s) => s.audience.type))].sort();
}
