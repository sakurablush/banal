/**
 * Tool Stacks — Honest, zero-budget workflows with real limits stated up front.
 * Written for people who need tools that work all week, not demos that hit a paywall on day two.
 */

import type { ToolStack } from '../types/tool';

export const toolStacks: ToolStack[] = [
  {
    id: 'saas-mvp-zero',
    name: 'Build a web app for $0',
    description:
      'For developers building a web app, side project, or Gen AI product without paying monthly tool fees. Use Kilo Code daily (free models, ~200 requests/hour per IP). When you see rate-limit errors, switch to Groq or OpenRouter free the same day. Use Google Antigravity every few weeks for planning or a second opinion—not as your everyday editor.',
    audience: { type: 'developer', budget: 'zero', experience: 'intermediate' },
    useCase: 'Ship a web app or AI-powered product on free tiers',
    tools: [
      {
        toolId: 'kilo-code',
        role: 'Daily coding (VS Code)',
        optional: false,
        alternatives: ['cline', 'aider'],
      },
      {
        toolId: 'groq-api',
        role: 'Backup when Kilo caps',
        optional: false,
        alternatives: ['openrouter-free'],
      },
      { toolId: 'google-antigravity', role: 'Plan & review (occasional)', optional: true },
      { toolId: 'supabase', role: 'Database & auth', optional: false, alternatives: ['neon'] },
      {
        toolId: 'cloudflare-pages',
        role: 'Hosting',
        optional: false,
        alternatives: ['vercel-free'],
      },
      { toolId: 'git', role: 'Version control', optional: false },
    ],
    workflow: [
      {
        step: 1,
        title: 'Set up your repo and Kilo',
        description:
          'Install Kilo Code in VS Code, pick kilo-auto/free (no credit card). Initialize Git. Do not put secrets in Auto Free prompts—free routes may log data upstream.',
        tools: ['kilo-code', 'git'],
      },
      {
        step: 2,
        title: 'Create the database',
        description:
          'Spin up Supabase (500 MB free). Design tables, enable Row Level Security. Free projects pause after 7 days of inactivity—log in weekly or you lose API access until you unpause.',
        tools: ['supabase'],
      },
      {
        step: 3,
        title: 'Build day to day with Kilo',
        description:
          'Ship features in small chunks. When Kilo returns HTTP 429, add a Groq API key (free tier is model-specific; many models allow ~14.4k requests/day) and keep going. Quality on free models varies—review diffs before merging.',
        tools: ['kilo-code', 'groq-api'],
      },
      {
        step: 4,
        title: 'Periodic architecture review',
        description:
          'Every few weeks, paste your module list or a stuck file into Google Antigravity (free during public preview; pricing TBD later). Use it for roadmaps and reviews, not every autocomplete.',
        tools: ['google-antigravity'],
      },
      {
        step: 5,
        title: 'Deploy',
        description:
          'Connect GitHub to Cloudflare Pages (generous hobby tier—not a license for unlimited traffic). Set env vars for Supabase. Real traffic spikes may need paid tiers eventually.',
        tools: ['cloudflare-pages', 'git'],
      },
    ],
    cost: {
      total: '$0/month (with limits)',
      breakdown: [
        { tool: 'kilo-code', cost: '$0', notes: 'Auto Free ~200 req/hr per IP; 429 when capped' },
        {
          tool: 'groq-api',
          cost: '$0',
          notes: 'Free tier per model; ~14.4k req/day on many models',
        },
        { tool: 'google-antigravity', cost: '$0', notes: 'Free in preview; may change' },
        { tool: 'supabase', cost: '$0', notes: '500 MB; pauses if idle 7 days' },
        { tool: 'cloudflare-pages', cost: '$0', notes: 'Hobby tier; fair-use limits' },
        { tool: 'git', cost: '$0', notes: 'Public repos free on GitHub' },
      ],
    },
    resources: [
      {
        title: 'Kilo usage & free model limits',
        url: 'https://kilo.ai/docs/gateway/usage-and-billing',
        type: 'documentation',
      },
      {
        title: 'Supabase free tier limits',
        url: 'https://supabase.com/pricing',
        type: 'documentation',
      },
    ],
    createdBy: 'Banal Team',
    createdAt: '2026-06-15',
    updatedAt: '2026-06-16',
    verified: true,
  },
  {
    id: 'freelance-web-dev',
    name: 'Freelance client websites',
    description:
      'Build client sites without stacking subscriptions. Kilo Code for implementation, Excalidraw for quick wireframes, Vercel or Cloudflare for previews. Free tiers are fine for demos and small sites; active clients with traffic usually need paid hosting or DB plans eventually.',
    audience: { type: 'freelancer', budget: 'low', experience: 'intermediate' },
    useCase: 'Deliver client websites and small web apps',
    tools: [
      {
        toolId: 'kilo-code',
        role: 'Build & fix code',
        optional: false,
        alternatives: ['github-copilot-free'],
      },
      {
        toolId: 'groq-api',
        role: 'When Kilo caps',
        optional: true,
        alternatives: ['openrouter-free'],
      },
      { toolId: 'excalidraw', role: 'Wireframes', optional: true },
      {
        toolId: 'vercel-free',
        role: 'Preview URLs',
        optional: false,
        alternatives: ['cloudflare-pages'],
      },
      { toolId: 'supabase', role: 'Forms & data', optional: true, alternatives: ['neon'] },
      { toolId: 'git', role: 'Version control', optional: false },
    ],
    workflow: [
      {
        step: 1,
        title: 'Agree on scope in plain language',
        description:
          'Sketch pages in Excalidraw (free, no account). Share a link—clients understand boxes better than Figma jargon.',
        tools: ['excalidraw'],
      },
      {
        step: 2,
        title: 'Scaffold the project',
        description:
          'Git repo + Vercel hobby project. If the site needs a contact form or login, add Supabase free tier and note the 500 MB / idle-pause limits to the client.',
        tools: ['git', 'vercel-free', 'supabase'],
      },
      {
        step: 3,
        title: 'Implement with AI assistance',
        description:
          'Use Kilo for components and fixes. Rotate to Groq or OpenRouter when rate-limited. Bill clients for your time, not for Copilot Pro—unless they require a specific toolchain.',
        tools: ['kilo-code', 'groq-api'],
      },
      {
        step: 4,
        title: 'Ship preview, then production',
        description:
          'Every push gets a Vercel preview URL for feedback. Move the client to a paid plan before launch if traffic or DB size will exceed free caps.',
        tools: ['vercel-free', 'git'],
      },
    ],
    cost: {
      total: '$0/month to start',
      breakdown: [
        { tool: 'kilo-code', cost: '$0', notes: 'Free models rate-limited' },
        { tool: 'groq-api', cost: '$0', notes: 'Optional backup; per-model daily caps' },
        { tool: 'vercel-free', cost: '$0', notes: 'Hobby; commercial use may need Pro' },
        { tool: 'supabase', cost: '$0', notes: 'Optional; 500 MB cap' },
        { tool: 'excalidraw', cost: '$0', notes: 'Open source' },
        { tool: 'git', cost: '$0', notes: 'Free' },
      ],
    },
    resources: [
      { title: 'Vercel hobby vs Pro', url: 'https://vercel.com/docs/plans', type: 'documentation' },
    ],
    createdBy: 'Banal Team',
    createdAt: '2026-06-15',
    updatedAt: '2026-06-16',
    verified: true,
  },
  {
    id: 'local-ai-dev',
    name: 'Local AI on your own PC',
    description:
      'Run models offline when cloud free tiers are not enough or data must stay on your machine. Realistic on 8–16 GB VRAM: 7B–8B quantized models only. A 70B model is not a laptop stack—ignore hype configs that need datacenter GPUs.',
    audience: { type: 'developer', budget: 'zero', experience: 'intermediate' },
    useCase: 'Code and chat without sending data to the cloud',
    tools: [
      {
        toolId: 'ollama',
        role: 'Run models locally',
        optional: false,
        alternatives: ['lm-studio', 'jan-ai'],
      },
      {
        toolId: 'qwen-2.5',
        role: 'General 7B model',
        optional: false,
        alternatives: ['qwen3-coder'],
      },
      { toolId: 'open-webui', role: 'Browser chat UI', optional: true },
      { toolId: 'continue-dev', role: 'Editor integration', optional: true },
      { toolId: 'deepseek-r1', role: 'Harder reasoning (if GPU allows)', optional: true },
    ],
    workflow: [
      {
        step: 1,
        title: 'Check your hardware honestly',
        description:
          '8 GB VRAM → stick to 7B Q4 models. 16 GB → 8B–14B comfortably. CPU-only works but is slow—fine for privacy, not for all-day coding.',
        tools: ['ollama'],
      },
      {
        step: 2,
        title: 'Install and pull a small model',
        description:
          'Install Ollama, then pull qwen2.5:7b or similar. First download is large (several GB); after that it runs offline.',
        tools: ['ollama', 'qwen-2.5'],
      },
      {
        step: 3,
        title: 'Chat in the browser',
        description:
          'Optional: Open WebUI for a ChatGPT-like UI pointed at localhost. Slower than cloud APIs but no token caps.',
        tools: ['open-webui'],
      },
      {
        step: 4,
        title: 'Wire into your editor',
        description:
          'Continue.dev can call your local Ollama endpoint. Expect weaker completions than frontier cloud models—use for boilerplate and privacy-sensitive files.',
        tools: ['continue-dev'],
      },
    ],
    cost: {
      total: '$0/month (+ electricity)',
      breakdown: [
        { tool: 'ollama', cost: '$0', notes: 'Open source' },
        { tool: 'qwen-2.5', cost: '$0', notes: '~4–6 GB VRAM for 7B Q4' },
        { tool: 'open-webui', cost: '$0', notes: 'Self-hosted' },
        { tool: 'continue-dev', cost: '$0', notes: 'Open source' },
        { tool: 'deepseek-r1', cost: '$0', notes: 'Large quant only on big GPUs' },
      ],
    },
    resources: [
      { title: 'Ollama model library', url: 'https://ollama.com/library', type: 'documentation' },
    ],
    createdBy: 'Banal Team',
    createdAt: '2026-06-15',
    updatedAt: '2026-06-16',
    verified: true,
  },
  {
    id: 'student-learning',
    name: 'Learn to code for $0',
    description:
      'Structured learning without bootcamp prices. freeCodeCamp for curriculum, Exercism for practice, browser IDEs so you do not need a powerful PC. ChatGPT or Duck.ai for stuck moments—free tiers cap messages per day, so use them for blockers, not lazy copy-paste.',
    audience: { type: 'student', budget: 'zero', experience: 'beginner' },
    useCase: 'Learn programming from scratch',
    tools: [
      { toolId: 'freecodecamp', role: 'Structured lessons', optional: false },
      { toolId: 'exercism', role: 'Practice with feedback', optional: true },
      { toolId: 'stackblitz', role: 'Browser IDE', optional: false, alternatives: ['replit'] },
      {
        toolId: 'duck-ai',
        role: 'Ask when stuck',
        optional: true,
        alternatives: ['chatgpt-free', 'google-gemini'],
      },
      { toolId: 'roadmap-sh', role: 'Skill roadmap', optional: true },
    ],
    workflow: [
      {
        step: 1,
        title: 'Pick one path and stay on it',
        description:
          'Start freeCodeCamp responsive web design or roadmap.sh for your goal. Switching courses every week is how people quit.',
        tools: ['freecodecamp', 'roadmap-sh'],
      },
      {
        step: 2,
        title: 'Practice with feedback',
        description:
          'Exercism gives mentor-style feedback on small exercises. Do one exercise on bad days, three on good days.',
        tools: ['exercism'],
      },
      {
        step: 3,
        title: 'Build in the browser',
        description:
          'StackBlitz or Replit free tiers run in the browser—no install. Replit free has usage limits; StackBlitz is lighter for static frontends.',
        tools: ['stackblitz'],
      },
      {
        step: 4,
        title: 'Use AI like a tutor, not an answer key',
        description:
          'When stuck, explain what you tried in Duck.ai or ChatGPT free. If you hit the daily cap, sleep on it or read the docs—that is still learning.',
        tools: ['duck-ai'],
      },
    ],
    cost: {
      total: '$0/month',
      breakdown: [
        { tool: 'freecodecamp', cost: '$0', notes: 'Fully free' },
        { tool: 'exercism', cost: '$0', notes: 'Free mentorship track' },
        { tool: 'stackblitz', cost: '$0', notes: 'Generous free tier' },
        { tool: 'duck-ai', cost: '$0', notes: 'No signup; shared rate limits' },
        { tool: 'roadmap-sh', cost: '$0', notes: 'Free roadmaps' },
      ],
    },
    resources: [
      {
        title: 'freeCodeCamp curriculum',
        url: 'https://www.freecodecamp.org/learn/',
        type: 'tutorial',
      },
    ],
    createdBy: 'Banal Team',
    createdAt: '2026-06-15',
    updatedAt: '2026-06-16',
    verified: true,
  },
  {
    id: 'content-creator',
    name: 'Make videos and posts for $0',
    description:
      'Create YouTube, blog, and social content without Adobe subscriptions. CapCut and Canva free tiers are enough to start. Suno and Gamma give daily credits—not unlimited—so batch work on good days and export everything locally.',
    audience: { type: 'freelancer', budget: 'zero', experience: 'beginner' },
    useCase: 'Publish content regularly on a zero budget',
    tools: [
      { toolId: 'capcut', role: 'Video editing', optional: false },
      { toolId: 'canva-free', role: 'Thumbnails & graphics', optional: false },
      { toolId: 'gamma', role: 'Slide outlines', optional: true },
      { toolId: 'suno', role: 'Background music', optional: true, alternatives: ['udio'] },
      { toolId: 'deepl-translator', role: 'Translation check', optional: true },
    ],
    workflow: [
      {
        step: 1,
        title: 'Outline before you generate',
        description:
          'Write bullet points in Gamma or a notes app. AI slides are a draft—you still edit every caption.',
        tools: ['gamma'],
      },
      {
        step: 2,
        title: 'Make visuals',
        description:
          'Canva free for thumbnails and short graphics. Export PNG—do not rely on Canva hosting forever.',
        tools: ['canva-free'],
      },
      {
        step: 3,
        title: 'Edit video',
        description:
          'CapCut desktop or mobile with auto-captions. Free tier adds watermarks on some exports—check before publishing.',
        tools: ['capcut'],
      },
      {
        step: 4,
        title: 'Music and languages',
        description:
          'Suno free credits renew daily—generate a few tracks and keep the files. DeepL free has character limits; use for polish, not full book translation.',
        tools: ['suno', 'deepl-translator'],
      },
    ],
    cost: {
      total: '$0/month (daily caps)',
      breakdown: [
        { tool: 'capcut', cost: '$0', notes: 'Some exports watermarked' },
        { tool: 'canva-free', cost: '$0', notes: 'Limited templates' },
        { tool: 'suno', cost: '$0', notes: 'Daily credit allowance' },
        { tool: 'deepl-translator', cost: '$0', notes: 'Character limits on free' },
        { tool: 'gamma', cost: '$0', notes: 'Limited AI credits' },
      ],
    },
    resources: [],
    createdBy: 'Banal Team',
    createdAt: '2026-06-15',
    updatedAt: '2026-06-16',
    verified: true,
  },
  {
    id: 'privacy-first',
    name: "Keep your data off other people's servers",
    description:
      'For health, legal, or personal work you do not want in a cloud training set. Local AI (Jan or Ollama), password manager you control, notes that sync only when you say so. Self-hosting takes an afternoon to set up—budget time, not money.',
    audience: { type: 'developer', budget: 'zero', experience: 'intermediate' },
    useCase: 'Handle sensitive files without cloud AI',
    tools: [
      { toolId: 'jan-ai', role: 'Offline chat', optional: false, alternatives: ['ollama'] },
      {
        toolId: 'bitwarden-free',
        role: 'Passwords',
        optional: false,
        alternatives: ['vaultwarden'],
      },
      { toolId: 'joplin-cloudless', role: 'Local notes', optional: false },
      { toolId: 'syncthing', role: 'File sync (P2P)', optional: true },
      { toolId: 'cryptpad', role: 'Shared docs', optional: true },
    ],
    workflow: [
      {
        step: 1,
        title: 'Chat without uploading',
        description:
          'Jan or Ollama on your machine. Smaller models only on consumer hardware—trade quality for privacy.',
        tools: ['jan-ai'],
      },
      {
        step: 2,
        title: 'Passwords in one place',
        description:
          'Bitwarden free is fine for most people. Vaultwarden if you want self-hosted family sharing.',
        tools: ['bitwarden-free'],
      },
      {
        step: 3,
        title: 'Notes that stay yours',
        description:
          'Joplin stores markdown locally; sync is optional. Good for medical, legal, or journal content.',
        tools: ['joplin-cloudless'],
      },
      {
        step: 4,
        title: 'Share files without Dropbox',
        description:
          'Syncthing syncs device to device. Cryptpad for occasional encrypted collaboration.',
        tools: ['syncthing', 'cryptpad'],
      },
    ],
    cost: {
      total: '$0/month',
      breakdown: [
        { tool: 'jan-ai', cost: '$0', notes: 'Local only' },
        { tool: 'bitwarden-free', cost: '$0', notes: 'Free personal vault' },
        { tool: 'joplin-cloudless', cost: '$0', notes: 'Open source' },
        { tool: 'syncthing', cost: '$0', notes: 'No cloud account' },
        { tool: 'cryptpad', cost: '$0', notes: 'Free tier' },
      ],
    },
    resources: [],
    createdBy: 'Banal Team',
    createdAt: '2026-06-15',
    updatedAt: '2026-06-16',
    verified: true,
  },
  {
    id: 'job-seeker-portfolio',
    name: 'Get hired: portfolio & practice',
    description:
      'Show work on GitHub Pages, practice coding questions on LeetCode free set, use AI to tighten your resume—not to invent experience. Interview prep is repetition; free tools are enough if you show up daily.',
    audience: { type: 'job-seeker', budget: 'zero', experience: 'intermediate' },
    useCase: 'Land a dev job with proof of work',
    tools: [
      {
        toolId: 'github-pages',
        role: 'Portfolio site',
        optional: false,
        alternatives: ['cloudflare-pages'],
      },
      { toolId: 'leetcode-free', role: 'Interview practice', optional: false },
      { toolId: 'roadmap-sh', role: 'Skills checklist', optional: false },
      { toolId: 'duck-ai', role: 'Resume wording', optional: true, alternatives: ['chatgpt-free'] },
      { toolId: 'git', role: 'Show real commits', optional: false },
    ],
    workflow: [
      {
        step: 1,
        title: 'Know what the job asks for',
        description:
          'roadmap.sh for the role you want. Circle gaps—you only need 2–3 portfolio projects that prove those skills.',
        tools: ['roadmap-sh'],
      },
      {
        step: 2,
        title: 'Ship projects publicly',
        description:
          'Push code to GitHub; host a simple portfolio on GitHub Pages. Employers click repos, not buzzwords.',
        tools: ['git', 'github-pages'],
      },
      {
        step: 3,
        title: 'Practice problems',
        description:
          'LeetCode free problems + explain solutions out loud. Quality beats quantity—one problem understood beats ten copied.',
        tools: ['leetcode-free'],
      },
      {
        step: 4,
        title: 'Polish application text',
        description:
          'Paste your resume bullet into Duck.ai: "Make this specific and shorter." Verify every claim is true.',
        tools: ['duck-ai'],
      },
    ],
    cost: {
      total: '$0/month',
      breakdown: [
        { tool: 'github-pages', cost: '$0', notes: 'Public repos' },
        { tool: 'leetcode-free', cost: '$0', notes: 'Subset of problems' },
        { tool: 'roadmap-sh', cost: '$0', notes: 'Free' },
        { tool: 'duck-ai', cost: '$0', notes: 'Rate limited' },
        { tool: 'git', cost: '$0', notes: 'Public repos free' },
      ],
    },
    resources: [],
    createdBy: 'Banal Team',
    createdAt: '2026-06-15',
    updatedAt: '2026-06-16',
    verified: true,
  },
  {
    id: 'data-science',
    name: 'Data analysis without paying for GPUs',
    description:
      'Kaggle and Google Colab free GPUs are enough for learning and small projects. Sessions disconnect, quotas change, and Colab free is not for 24/7 training—download checkpoints often.',
    audience: { type: 'developer', budget: 'zero', experience: 'intermediate' },
    useCase: 'Explore data and train small models',
    tools: [
      {
        toolId: 'google-colab',
        role: 'Notebooks + GPU',
        optional: false,
        alternatives: ['kaggle'],
      },
      { toolId: 'kaggle', role: 'Datasets & competitions', optional: false },
      { toolId: 'uv', role: 'Fast Python env', optional: false },
      { toolId: 'desmos', role: 'Quick plots', optional: true },
      { toolId: 'wolfram-alpha', role: 'Sanity-check math', optional: true },
    ],
    workflow: [
      {
        step: 1,
        title: 'Find data',
        description:
          'Kaggle datasets include notebooks from others—read before you copy. Check license for commercial use.',
        tools: ['kaggle'],
      },
      {
        step: 2,
        title: 'Explore in Colab',
        description:
          'Free GPU sessions time out. Save to Drive or download CSV/models before the runtime dies.',
        tools: ['google-colab'],
      },
      {
        step: 3,
        title: 'Reproducible Python',
        description:
          'Use uv for local venv when Colab is not enough. Same code should run locally on CPU for small data.',
        tools: ['uv'],
      },
      {
        step: 4,
        title: 'Check your math',
        description:
          'Desmos for quick charts; Wolfram Alpha free for integrals and unit checks—not for cheating homework.',
        tools: ['desmos', 'wolfram-alpha'],
      },
    ],
    cost: {
      total: '$0/month (session limits)',
      breakdown: [
        { tool: 'google-colab', cost: '$0', notes: 'GPU not guaranteed; timeouts' },
        { tool: 'kaggle', cost: '$0', notes: '~30 GPU hrs/week; quota resets weekly' },
        { tool: 'uv', cost: '$0', notes: 'Open source' },
        { tool: 'desmos', cost: '$0', notes: 'Free plotting' },
        { tool: 'wolfram-alpha', cost: '$0', notes: 'Limited free queries' },
      ],
    },
    resources: [],
    createdBy: 'Banal Team',
    createdAt: '2026-06-15',
    updatedAt: '2026-06-16',
    verified: true,
  },
  {
    id: 'automation-productivity',
    name: 'Automate boring computer tasks',
    description:
      'Self-hosted n8n replaces Zapier for personal workflows. Pair with just, direnv, and terminal tools so projects stay repeatable. You need a machine that stays on—or accept that automations pause when your laptop sleeps.',
    audience: { type: 'developer', budget: 'zero', experience: 'intermediate' },
    useCase: 'Stop doing the same clicks every day',
    tools: [
      { toolId: 'n8n', role: 'Visual automation', optional: false },
      { toolId: 'just', role: 'Project commands', optional: false },
      { toolId: 'direnv', role: 'Per-folder env vars', optional: false },
      { toolId: 'fzf', role: 'Fuzzy find files', optional: true },
      { toolId: 'zoxide', role: 'Jump directories', optional: true },
    ],
    workflow: [
      {
        step: 1,
        title: 'Automate one annoying thing',
        description:
          'Self-host n8n (Docker). Start with email → spreadsheet or webhook → notification. One working flow beats ten half-built ones.',
        tools: ['n8n'],
      },
      {
        step: 2,
        title: 'Make commands obvious',
        description:
          'justfile with test, build, deploy recipes so future-you does not guess npm scripts.',
        tools: ['just'],
      },
      {
        step: 3,
        title: 'Stop leaking API keys',
        description: 'direnv loads .env when you cd into a project and unloads when you leave.',
        tools: ['direnv'],
      },
      {
        step: 4,
        title: 'Move faster in the terminal',
        description: 'fzf + zoxide are optional quality-of-life—install when basics work.',
        tools: ['fzf', 'zoxide'],
      },
    ],
    cost: {
      total: '$0/month (your hardware)',
      breakdown: [
        { tool: 'n8n', cost: '$0', notes: 'Self-hosted; fair-use on cloud' },
        { tool: 'just', cost: '$0', notes: 'Open source' },
        { tool: 'direnv', cost: '$0', notes: 'Open source' },
        { tool: 'fzf', cost: '$0', notes: 'Open source' },
        { tool: 'zoxide', cost: '$0', notes: 'Open source' },
      ],
    },
    resources: [],
    createdBy: 'Banal Team',
    createdAt: '2026-06-15',
    updatedAt: '2026-06-16',
    verified: true,
  },
  {
    id: 'open-source-contributor',
    name: 'Contribute to open source',
    description:
      'Find issues, fork, test, open a PR. No paid tools required—maintainers care about clear diffs and communication, not your IDE brand. Start with docs or typos if code feels scary.',
    audience: { type: 'developer', budget: 'zero', experience: 'intermediate' },
    useCase: 'Land your first merged pull request',
    tools: [
      { toolId: 'git', role: 'Version control', optional: false },
      { toolId: 'gh-cli', role: 'GitHub from terminal', optional: false },
      {
        toolId: 'kilo-code',
        role: 'Navigate unfamiliar code',
        optional: true,
        alternatives: ['github-copilot-free'],
      },
      { toolId: 'playwright', role: 'Run UI tests', optional: true },
      { toolId: 'ruff', role: 'Python lint', optional: true, alternatives: ['biome'] },
    ],
    workflow: [
      {
        step: 1,
        title: 'Find a welcoming issue',
        description:
          'gh search issues --label "good first issue" in a repo you already use. Read CONTRIBUTING.md before coding.',
        tools: ['gh-cli'],
      },
      {
        step: 2,
        title: 'Fork and branch',
        description:
          'Small branches, one fix per PR. git switch -c fix-typo-in-readme beats giant refactors.',
        tools: ['git'],
      },
      {
        step: 3,
        title: 'Run what maintainers run',
        description:
          "Tests and linters locally. CI failures waste everyone's time—including yours.",
        tools: ['playwright', 'ruff'],
      },
      {
        step: 4,
        title: 'Open a clear PR',
        description:
          'gh pr create with what changed and why. Link the issue. Be polite when review comments arrive.',
        tools: ['gh-cli', 'kilo-code'],
      },
    ],
    cost: {
      total: '$0/month',
      breakdown: [
        { tool: 'git', cost: '$0', notes: 'Open source' },
        { tool: 'gh-cli', cost: '$0', notes: 'Open source' },
        { tool: 'kilo-code', cost: '$0', notes: 'Optional; free tier limits' },
        { tool: 'playwright', cost: '$0', notes: 'Open source' },
        { tool: 'ruff', cost: '$0', notes: 'Open source' },
      ],
    },
    resources: [],
    createdBy: 'Banal Team',
    createdAt: '2026-06-15',
    updatedAt: '2026-06-16',
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
