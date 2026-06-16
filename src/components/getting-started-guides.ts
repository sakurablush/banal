/**
 * Getting Started Guides — Beginner-friendly guides for using AI tools.
 * Provides step-by-step tutorials for common use cases.
 */

import type { Lang } from '../i18n';

// ─── Copy ───────────────────────────────────────────────────────────────────

const COPY = {
  en: {
    title: 'Guides',
    subtitle: 'Step-by-step setup for common workflows',
    readGuide: 'Read Guide',
    guides: [
      {
        id: 'ai-coding-assistants',
        title: 'AI coding assistants',
        description:
          'Compare free and freemium assistants. Install, configure API keys, and set rate-limit expectations.',
        steps: [
          'Pick a tool that matches your stack and access type',
          'Install the extension or CLI',
          'Add API key or sign in if required',
          'Write prompts with file context and clear scope',
          'Check output before committing',
        ],
      },
      {
        id: 'local-ai-models',
        title: 'Running models locally',
        description:
          'Run Llama, Qwen, and other open weights on your hardware. No cloud API cost; VRAM and disk apply.',
        steps: [
          'Check VRAM and disk against model card requirements',
          'Install Ollama or LM Studio',
          'Pull a model matching your GPU',
          'Test inference speed and context length',
          'Point your editor or CLI at the local endpoint',
        ],
      },
      {
        id: 'free-inference-providers',
        title: 'Free inference providers',
        description:
          'Use Groq, Cerebras, OpenRouter, and similar hosts. Free tiers have rate limits and model lists that change.',
        steps: [
          'Compare free-tier limits in the directory',
          'Create an account if required',
          'Generate an API key',
          'Send a test request with curl or SDK',
          'Monitor usage against daily caps',
        ],
      },
      {
        id: 'zero-budget-saas',
        title: 'SaaS on free tiers',
        description:
          'Build and deploy using free tiers of hosting, database, and auth. Production traffic usually needs paid plans.',
        steps: [
          'List required services and their free-tier limits',
          'Set up local dev environment',
          'Use free hosting for staging',
          'Add auth and database within tier caps',
          'Plan upgrade path before launch traffic',
        ],
      },
      {
        id: 'ai-for-content-creators',
        title: 'AI for content production',
        description:
          'Image, video, audio, and text tools for publishing workflows. Check license terms on generated assets.',
        steps: [
          'Pick image or video tools with stated limits',
          'Generate drafts and variants',
          'Edit captions and metadata manually',
          'Translate if needed with a second pass for accuracy',
          'Archive prompts and outputs for reuse',
        ],
      },
    ],
  },
  ja: {
    title: 'ガイド',
    subtitle: 'よくあるワークフローの手順',
    readGuide: 'ガイドを読む',
    guides: [
      {
        id: 'ai-coding-assistants',
        title: 'AIコーディングアシスタント',
        description:
          '無料・フリーミアムのアシスタントを比較。インストール、APIキー設定、レート制限の確認。',
        steps: [
          'スタックとアクセス種別に合うツールを選ぶ',
          '拡張機能またはCLIをインストール',
          '必要ならAPIキー追加またはサインイン',
          'ファイル文脈と範囲を明示してプロンプトを書く',
          'コミット前に出力を確認する',
        ],
      },
      {
        id: 'local-ai-models',
        title: 'ローカルでモデルを実行',
        description:
          'Llama、Qwenなどのオープンウェイトを自前ハードで実行。クラウドAPI料金なし。VRAMとディスクが必要。',
        steps: [
          'モデルカードのVRAM・ディスク要件を確認',
          'OllamaまたはLM Studioをインストール',
          'GPUに合うモデルを取得',
          '推論速度とコンテキスト長をテスト',
          'エディタまたはCLIをローカルエンドポイントに向ける',
        ],
      },
      {
        id: 'free-inference-providers',
        title: '無料推論プロバイダー',
        description:
          'Groq、Cerebras、OpenRouterなど。無料枠はレート制限があり、モデル一覧は変わる。',
        steps: [
          'ディレクトリで無料枠の制限を比較',
          '必要ならアカウント作成',
          'APIキーを発行',
          'curlまたはSDKでテストリクエスト',
          '日次上限に対する使用量を監視',
        ],
      },
      {
        id: 'zero-budget-saas',
        title: '無料枠でSaaSを構築',
        description:
          'ホスティング、DB、認証の無料枠で構築・デプロイ。本番トラフィックは通常有料プランが必要。',
        steps: [
          '必要サービスと無料枠の制限を一覧化',
          'ローカル開発環境を構築',
          'ステージング用に無料ホスティングを使う',
          '枠内で認証とDBを追加',
          'ローンチ前にアップグレード経路を計画',
        ],
      },
      {
        id: 'ai-for-content-creators',
        title: 'コンテンツ制作向けAI',
        description:
          '画像・動画・音声・テキストツール。生成物のライセンス条項を確認する。',
        steps: [
          '制限が明記された画像・動画ツールを選ぶ',
          '下書きとバリエーションを生成',
          'キャプションとメタデータを手動で編集',
          '必要なら翻訳し、精度を二重確認',
          'プロンプトと出力を再利用用に保存',
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
