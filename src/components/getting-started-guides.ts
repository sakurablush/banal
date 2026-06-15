/**
 * Getting Started Guides — Beginner-friendly guides for using AI tools.
 * Provides step-by-step tutorials for common use cases.
 */

import type { Lang } from '../i18n';

// ─── Copy ───────────────────────────────────────────────────────────────────

const COPY = {
  en: {
    title: 'Getting Started Guides',
    subtitle: 'Learn how to use AI tools effectively',
    readGuide: 'Read Guide',
    guides: [
      {
        id: 'ai-coding-assistants',
        title: 'Getting Started with AI Coding Assistants',
        description: 'Learn how to use AI coding assistants to write code faster, catch bugs, and learn new languages. Perfect for beginners.',
        steps: [
          'Choose the right tool for your needs',
          'Install and configure your first assistant',
          'Learn best practices for prompting',
          'Avoid common pitfalls',
          'Master advanced techniques',
        ],
      },
      {
        id: 'local-ai-models',
        title: 'Running AI Models Locally',
        description: 'Set up local AI models for complete privacy and zero cloud costs. Run Llama, Qwen, and more on your own machine.',
        steps: [
          'Check your hardware requirements',
          'Install Ollama or LM Studio',
          'Download your first model',
          'Start chatting with local AI',
          'Integrate with your development tools',
        ],
      },
      {
        id: 'free-inference-providers',
        title: 'Using Free Inference Providers',
        description: 'Access powerful AI models for free through providers like Groq, Cerebras, and OpenRouter. No credit card required.',
        steps: [
          'Compare free tier limits',
          'Sign up for your first provider',
          'Get your API key',
          'Make your first API call',
          'Optimize for cost and performance',
        ],
      },
      {
        id: 'zero-budget-saas',
        title: 'Building a SaaS for $0',
        description: 'Launch your SaaS product without spending a dollar. Use free tiers of modern tools to build, deploy, and scale.',
        steps: [
          'Set up your development environment',
          'Design your database schema',
          'Build your frontend with AI assistance',
          'Implement backend and authentication',
          'Deploy to production for free',
        ],
      },
      {
        id: 'ai-for-content-creators',
        title: 'AI Tools for Content Creators',
        description: 'Use AI to create videos, images, music, and written content. Perfect for YouTubers, bloggers, and podcasters.',
        steps: [
          'Generate images and thumbnails',
          'Edit videos with AI captions',
          'Create background music',
          'Write and translate content',
          'Automate your workflow',
        ],
      },
    ],
  },
  ja: {
    title: 'はじめにガイド',
    subtitle: 'AIツールの効果的な使い方を学ぶ',
    readGuide: 'ガイドを読む',
    guides: [
      {
        id: 'ai-coding-assistants',
        title: 'AIコーディングアシスタント入門',
        description: 'AIコーディングアシスタントを使って、コードを速く書き、バグを見つけ、新しい言語を学ぶ方法を学びましょう。初心者に最適です。',
        steps: [
          'ニーズに合ったツールを選ぶ',
          '最初のアシスタントをインストールして設定する',
          'プロンプトのベストプラクティスを学ぶ',
          '一般的な落とし穴を避ける',
          '高度なテクニックをマスターする',
        ],
      },
      {
        id: 'local-ai-models',
        title: 'AIモデルをローカルで実行する',
        description: '完全なプライバシーとクラウドコストゼロでローカルAIモデルを設定します。Llama、Qwenなどを自分のマシンで実行します。',
        steps: [
          'ハードウェア要件を確認する',
          'OllamaまたはLM Studioをインストールする',
          '最初のモデルをダウンロードする',
          'ローカルAIとチャットを始める',
          '開発ツールと統合する',
        ],
      },
      {
        id: 'free-inference-providers',
        title: '無料の推論プロバイダーを使う',
        description: 'Groq、Cerebras、OpenRouterなどのプロバイダーを通じて、強力なAIモデルに無料でアクセスします。クレジットカードは不要です。',
        steps: [
          '無料枠の制限を比較する',
          '最初のプロバイダーにサインアップする',
          'APIキーを取得する',
          '最初のAPI呼び出しを行う',
          'コストとパフォーマンスを最適化する',
        ],
      },
      {
        id: 'zero-budget-saas',
        title: '$0でSaaSを構築する',
        description: '1ドルも使わずにSaaS製品をローンチします。モダンツールの無料枠を使って、構築、デプロイ、スケールします。',
        steps: [
          '開発環境を設定する',
          'データベーススキーマを設計する',
          'AI支援でフロントエンドを構築する',
          'バックエンドと認証を実装する',
          '無料で本番環境にデプロイする',
        ],
      },
      {
        id: 'ai-for-content-creators',
        title: 'コンテンツクリエイターのためのAIツール',
        description: 'AIを使って動画、画像、音楽、文章コンテンツを作成します。YouTuber、ブロガー、ポッドキャスターに最適です。',
        steps: [
          '画像とサムネイルを生成する',
          'AIキャプションで動画を編集する',
          'バックグラウンド音楽を作成する',
          'コンテンツを書き、翻訳する',
          'ワークフローを自動化する',
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
