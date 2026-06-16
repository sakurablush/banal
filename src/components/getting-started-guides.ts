/**
 * Getting Started Guides — Beginner-friendly guides for using AI tools.
 * Provides step-by-step tutorials for common use cases.
 */

import type { Lang } from '../i18n';

// ─── Copy ───────────────────────────────────────────────────────────────────

const COPY = {
  en: {
    title: 'Guides',
    subtitle: 'Honest setup notes—limits included, no marketing speak',
    readGuide: 'Read Guide',
    guides: [
      {
        id: 'ai-coding-assistants',
        title: 'AI coding assistants that last all week',
        description:
          'Kilo Code is the strongest $0 daily driver (VS Code/JetBrains, ~200 free requests/hour per IP). When you hit 429, add Groq or OpenRouter free keys as backups—not replacements for reading diffs. Cursor/Windsurf free tiers run out in days if you code full-time.',
        steps: [
          'Install Kilo Code; start on kilo-auto/free—no card required',
          'Do not paste secrets into Auto Free (upstream may log prompts)',
          'Add Groq or OpenRouter API key before your first rate-limit wall',
          'Use Google Antigravity occasionally for planning/reviews, not every keystroke',
          'Commit small chunks; free models hallucinate imports and APIs',
        ],
      },
      {
        id: 'local-ai-models',
        title: 'Running models on your own hardware',
        description:
          'Ollama + 7B–8B models fit 8–16 GB GPUs. You trade speed and quality for privacy and zero token caps. A 70B stack is not a laptop project—ignore configs that need datacenter VRAM.',
        steps: [
          'Check VRAM: 8 GB → qwen2.5:7b Q4; 16 GB → up to ~14B quantized',
          'Install Ollama; pull one small model and benchmark tokens/sec',
          'Use Open WebUI or Continue.dev only after the base model works',
          'Keep cloud free tier as fallback for hard bugs local models miss',
          'Expect slower completions—use local for drafts and sensitive files',
        ],
      },
      {
        id: 'free-inference-providers',
        title: 'Free inference APIs (with real caps)',
        description:
          'Groq, OpenRouter :free routes, and Cerebras publish limits that change. Good for side projects and backups when Kilo caps—not for production traffic. Monitor dashboards; quotas are per model and per day.',
        steps: [
          'Read each provider’s current free-tier page before wiring into prod',
          'Create keys only where signup is required; store in direnv/.env',
          'Send one curl test; log latency and error shape (429 vs 402)',
          'Rotate providers when one hits daily cap instead of paying panic',
          'Plan paid tier or local inference before launch traffic',
        ],
      },
      {
        id: 'zero-budget-saas',
        title: 'Ship a web app on free tiers',
        description:
          'Supabase (500 MB, pauses after 7 idle days), Cloudflare/Vercel hobby hosting, Kilo + Groq for code. Enough for MVPs and demos; real users usually force paid DB/hosting eventually.',
        steps: [
          'List every service’s pause/limit (Supabase idle, Vercel commercial rules)',
          'Build with Kilo daily; Groq when rate-limited',
          'Auth + DB on Supabase with RLS from day one',
          'Deploy staging on Cloudflare Pages or Vercel preview URLs',
          'Set a calendar reminder to log into Supabase weekly so projects stay awake',
        ],
      },
      {
        id: 'ai-for-content-creators',
        title: 'AI for videos, images, and posts',
        description:
          'CapCut, Canva, Suno, and Gamma free tiers use daily credits—not unlimited generation. Batch work on good days; download masters locally. Check watermark and commercial-use terms per tool.',
        steps: [
          'Outline in text first; AI is for drafts, not final copy',
          'Generate variants until credits run out, then edit offline',
          'Export PNG/MP3 to your drive—do not rely on tool hosting forever',
          'Read license on AI-generated music/images before monetizing',
          'Keep a simple spreadsheet of which tool caps on which day',
        ],
      },
    ],
  },
  ja: {
    title: 'ガイド',
    subtitle: '制限も書いた正直なセットアップメモ',
    readGuide: 'ガイドを読む',
    guides: [
      {
        id: 'ai-coding-assistants',
        title: '1週間持つAIコーディングアシスタント',
        description:
          'Kilo Codeが$0の日常ドライバー（VS Code/JetBrains、無料約200 req/時/IP）。429ならGroq/OpenRouter無料キーを予備に。Cursor/Windsurf無料枠は毎日フルタイムコーディングだと数日で尽きる。',
        steps: [
          'Kilo Codeを入れ、kilo-auto/freeから（クレカ不要）',
          'Auto Freeに秘密情報を入れない（上流でログの可能性）',
          '初めてレート制限に当たる前にGroq/OpenRouterキーを用意',
          'Google Antigravityは設計・レビューのたま使い',
          '小さくコミット；無料モデルはimport/APIを hallucinate しやすい',
        ],
      },
      {
        id: 'local-ai-models',
        title: '自分のPCでモデルを動かす',
        description:
          'Ollama＋7B〜8Bは8〜16GB VRAM向け。速度と品質と引き換えにプライバシーとトークン上限なし。70BはノートPC向けではない。',
        steps: [
          'VRAM確認：8GB→qwen2.5:7b Q4；16GB→〜14B量子化',
          'Ollamaを入れ、小さいモデル1つでtokens/sec計測',
          '基本動作後にOpen WebUIやContinue.dev',
          '難しいバグはクラウド無料枠を予備に',
          'ローカルは下書きと機密ファイル向き；遅い前提',
        ],
      },
      {
        id: 'free-inference-providers',
        title: '無料推論API（実際の上限付き）',
        description:
          'Groq、OpenRouter :free、Cerebrasは上限が変わる。副業とKilo上限時の予備向き。本番トラフィック向きでない。ダッシュボードで使用量を見る。',
        steps: [
          '本番配線前に各社の無料枠ページを読む',
          '必要ならだけサインアップ；キーはdirenv/.envへ',
          'curlで1回テスト；429と402の違いを記録',
          '日次上限なら別プロバイダへローテーション',
          'ローンチ前に有料かローカルへ計画',
        ],
      },
      {
        id: 'zero-budget-saas',
        title: '無料枠でWebアプリを出す',
        description:
          'Supabase（500MB、7日放置で停止）、Cloudflare/Vercelホビー、コードはKilo＋Groq。MVPとデモには足りる；本番ユーザーで有料化が現実的。',
        steps: [
          '各サービスの停止・上限を一覧（Supabase放置、Vercel商用ルール）',
          '日常はKilo；レート制限時Groq',
          '初日からSupabaseでRLS',
          'ステージングはCloudflare PagesかVercelプレビュー',
          'Supabaseを週1ログインするリマインダーを設定',
        ],
      },
      {
        id: 'ai-for-content-creators',
        title: '動画・画像・投稿向けAI',
        description:
          'CapCut、Canva、Suno、Gammaは日次クレジット制。調子の良い日にまとめ作業し、マスターをローカル保存。透かしと商用利用条項を確認。',
        steps: [
          'まずテキストで骨子；AIは下書き用',
          'クレジットが尽きるまでバリエーション生成→オフライン編集',
          'PNG/MP3を自分のドライブへ—ツールホスティングだけに頼らない',
          '収益化前にAI生成物のライセンス確認',
          'どのツールが何日で上限か簡単な表で管理',
        ],
      },
    ],
  },
} satisfies Record<Lang, {
  title: string;
  subtitle: string;
  readGuide: string;
  guides: Array<{
    id: string;
    title: string;
    description: string;
    steps: string[];
  }>;
}>;

// ─── Helpers ────────────────────────────────────────────────────────────────

function create<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (className) el.className = className;
  return el;
}

// ─── Render: Getting Started Guides ─────────────────────────────────────────

export function renderGettingStartedGuides(lang: Lang): HTMLElement {
  const copy = COPY[lang];
  const container = create('div', 'getting-started-guides');

  // Header
  const header = create('div', 'guides-header');
  const title = create('h2', 'guides-title');
  title.textContent = copy.title;
  header.appendChild(title);
  const subtitle = create('p', 'guides-subtitle');
  subtitle.textContent = copy.subtitle;
  header.appendChild(subtitle);
  container.appendChild(header);

  // Guides grid
  const grid = create('div', 'guides-grid');
  for (const guide of copy.guides) {
    const card = create('article', 'guide-card');
    
    const cardTitle = create('h3', 'guide-card-title');
    cardTitle.textContent = guide.title;
    card.appendChild(cardTitle);

    const cardDesc = create('p', 'guide-card-desc');
    cardDesc.textContent = guide.description;
    card.appendChild(cardDesc);

    const stepsList = create('ol', 'guide-steps');
    for (const step of guide.steps) {
      const li = create('li', 'guide-step');
      li.textContent = step;
      stepsList.appendChild(li);
    }
    card.appendChild(stepsList);

    const readBtn = create('button', 'guide-read-btn');
    readBtn.textContent = copy.readGuide;
    card.appendChild(readBtn);

    grid.appendChild(card);
  }
  container.appendChild(grid);

  return container;
}
