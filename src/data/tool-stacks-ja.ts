/**
 * Japanese copy for tool stacks. Keys match tool-stacks.ts id fields.
 * English is source of truth in tool-stacks.ts.
 */

export interface ToolStackJa {
  name: string;
  description: string;
  useCase: string;
  tools: Array<{ role: string }>;
  workflow: Array<{ title: string; description: string }>;
  cost: { breakdown: Array<{ notes: string }> };
  resources: Array<{ title: string }>;
}

export const toolStacksJa: Record<string, ToolStackJa> = {
  'saas-mvp-zero': {
    name: '$0でSaaS MVPを構築',
    description:
      '1ドルも使わずにSaaS MVPを構築・ローンチするために必要なすべてのツール。初期段階のプロダクトに適した寛大な無料枠を備えています。',
    useCase: 'SaaSプロダクトを構築してローンチする',
    tools: [
      { role: 'コードエディタ' },
      { role: 'AIモデル' },
      { role: 'データベース' },
      { role: 'ホスティング' },
      { role: 'バージョン管理' },
    ],
    workflow: [
      {
        title: '開発環境のセットアップ',
        description:
          'VS CodeにKilo Code拡張をインストールし、OpenRouter APIキー（無料枠）を設定してGitリポジトリを初期化します。',
      },
      {
        title: 'データベーススキーマの設計',
        description:
          'Supabaseプロジェクトを作成し、ユーザー・プロジェクト・機能用のテーブルを設計します。Row Level Securityを有効にします。',
      },
      {
        title: 'フロントエンドの構築',
        description:
          'Kilo CodeとClaude 3.5 Sonnet（OpenRouter経由）でReactコンポーネントを生成し、認証を実装してUIを構築します。',
      },
      {
        title: 'バックエンドの実装',
        description:
          'Supabase Edge FunctionsでAPIエンドポイントを構築し、OpenRouter APIでAI機能を実装します。',
      },
      {
        title: '本番環境へのデプロイ',
        description:
          'GitHubリポジトリをCloudflare Pagesに接続し、プッシュ時の自動デプロイを設定します。',
      },
    ],
    cost: {
      breakdown: [
        { notes: '無料拡張、BYOK' },
        { notes: '無料枠：1日1,000リクエスト' },
        { notes: '無料枠：500MBデータベース' },
        { notes: '無料枠：サイト数無制限' },
        { notes: 'パブリックリポジトリは無料' },
      ],
    },
    resources: [
      { title: 'Supabase + OpenRouter 連携ガイド' },
      { title: 'Cloudflare Pages はじめに' },
    ],
  },

  'freelance-web-dev': {
    name: 'フリーランスWeb開発',
    description:
      'フリーランスWeb開発者向けの完全なツールキット。AI支援コーディングと無料ホスティングでクライアントサイトを効率的に構築します。',
    useCase: 'クライアント向けWebサイト・アプリケーションを構築する',
    tools: [
      { role: 'AIアシスタント' },
      { role: 'ホスティング' },
      { role: 'データベース' },
      { role: 'デザイン' },
      { role: 'バージョン管理' },
    ],
    workflow: [
      {
        title: 'クライアントヒアリングとデザイン',
        description:
          'Excalidrawでワイヤーフレームとモックアップを作成し、クライアントと共有してフィードバックを得ます。',
      },
      {
        title: 'プロジェクトのセットアップ',
        description:
          'Gitリポジトリを初期化し、Vercelでホスティングを設定してSupabaseデータベースを構成します。',
      },
      {
        title: 'AIで構築',
        description:
          'GitHub Copilotでコード補完とAI支援開発を行い、コンポーネントを反復的に構築します。',
      },
      {
        title: 'デプロイと改善',
        description:
          'Vercelにデプロイし、プレビューURLでクライアントレビューを受けます。フィードバックに基づいて改善します。',
      },
    ],
    cost: {
      breakdown: [
        { notes: '月2,000回の補完が無料' },
        { notes: 'ホビープロジェクト向け無料枠' },
        { notes: '無料枠：500MB' },
        { notes: 'オープンソース、無料' },
        { notes: '無料' },
      ],
    },
    resources: [{ title: 'Vercel デプロイガイド' }],
  },

  'local-ai-dev': {
    name: 'ローカルAI開発',
    description:
      '完全なプライバシーとクラウドコストゼロでAIモデルをローカル実行。機密データやオフライン開発に最適です。',
    useCase: 'プライバシーを完全に保ちながらAIモデルをローカルで実行する',
    tools: [
      { role: 'モデルランナー' },
      { role: 'チャットUI' },
      { role: 'IDE連携' },
      { role: '汎用モデル' },
      { role: 'コーディングモデル' },
    ],
    workflow: [
      {
        title: 'Ollamaのインストール',
        description: 'お使いのOS向けにOllamaをダウンロード・インストールします。1コマンドで始められます。',
      },
      {
        title: 'モデルのダウンロード',
        description:
          '汎用タスク用にQwen 2.5 7B、コーディング用にDeepSeek Coderをpullします。モデルは一度ダウンロードすればオフラインで実行できます。',
      },
      {
        title: 'チャットUIのセットアップ',
        description:
          'Open WebUIをインストールし、ローカルモデルに接続するブラウザベースのチャットUIを構築します。',
      },
      {
        title: 'IDE連携',
        description:
          'VS CodeにContinue.devをインストールし、ローカルモデルでAIコード補完を利用します。',
      },
    ],
    cost: {
      breakdown: [
        { notes: 'オープンソース、永久無料' },
        { notes: 'オープンソース' },
        { notes: 'オープンソース' },
        { notes: 'オープンウェイト、無料' },
        { notes: 'オープンウェイト、無料' },
      ],
    },
    resources: [
      { title: 'Ollama はじめに' },
      { title: 'Open WebUI セットアップガイド' },
    ],
  },

  'student-learning': {
    name: '学習者向けスタック',
    description:
      'プログラミング学習者向けの無料ツール。AIチューター、練習プラットフォーム、開発環境を含みます。',
    useCase: 'プログラミングとコンピュータサイエンスを学ぶ',
    tools: [
      { role: 'カリキュラム' },
      { role: '練習' },
      { role: 'CS基礎' },
      { role: 'コーディング環境' },
      { role: 'AIチューター' },
    ],
    workflow: [
      {
        title: '学習パスの選択',
        description:
          'freeCodeCampのカリキュラムまたはKhan AcademyのCS基礎から始めます。',
      },
      {
        title: '毎日の練習',
        description: 'Exercismでコーディング課題を解き、メンターからフィードバックを受けます。',
      },
      {
        title: 'プロジェクトの構築',
        description: 'Replitでセットアップ不要のブラウザ内プロジェクトを構築します。',
      },
      {
        title: 'AIの活用',
        description:
          '概念やデバッグで行き詰まったときはChatGPTやDuck.aiを活用します。',
      },
    ],
    cost: {
      breakdown: [
        { notes: '完全無料' },
        { notes: 'メンター付き無料' },
        { notes: '無料枠' },
        { notes: '無料枠' },
      ],
    },
    resources: [
      { title: 'freeCodeCamp カリキュラム' },
      { title: 'roadmap.sh 開発者ロードマップ' },
    ],
  },

  'content-creator': {
    name: 'コンテンツクリエイターキット',
    description:
      'コンテンツクリエイター向けの無料AIツール：動画編集、画像生成、音楽、執筆、プレゼンテーション。',
    useCase: 'YouTube、ブログ、SNS向けコンテンツを制作する',
    tools: [
      { role: '動画エディタ' },
      { role: 'デザイン' },
      { role: '音楽' },
      { role: 'プレゼン' },
      { role: '翻訳' },
    ],
    workflow: [
      {
        title: 'コンテンツの企画',
        description:
          'Gammaでプレゼン構成を作成し、Canvaでサムネイルを制作します。',
      },
      {
        title: 'ビジュアルの作成',
        description:
          'Canva AIで画像を生成し、Cleanup.Picturesで写真を編集します。',
      },
      {
        title: '動画の編集',
        description:
          'CapCutでAI自動字幕やエフェクト付きの動画編集を行います。',
      },
      {
        title: '音楽の追加',
        description:
          'SunoでBGMを生成するか、ロイヤリティフリーのトラックを使用します。',
      },
    ],
    cost: {
      breakdown: [
        { notes: '無料枠' },
        { notes: '無料枠' },
        { notes: '毎日無料クレジット' },
        { notes: '無料枠' },
      ],
    },
    resources: [],
  },

  'privacy-first': {
    name: 'プライバシー優先スタック',
    description:
      'プライバシーを尊重するツール群。テレメトリなし、デフォルトで暗号化、可能な限りセルフホスト対応。',
    useCase: 'プライバシーを維持しながら機密データを扱う',
    tools: [
      { role: 'ローカルAI' },
      { role: 'パスワード管理' },
      { role: 'メモ' },
      { role: 'ファイル同期' },
      { role: 'コラボレーション' },
    ],
    workflow: [
      {
        title: 'ローカルAIのセットアップ',
        description:
          'Janをインストールし、データが端末外に出ないプライベートなAIチャットを利用します。',
      },
      {
        title: 'パスワードの保護',
        description:
          'Vaultwardenをセルフホストし、家族・チーム向けのパスワード管理を行います。',
      },
      {
        title: 'プライベートなメモ',
        description:
          'Joplinでローカルファーストのメモを取り、必要に応じて同期します。',
      },
      {
        title: '暗号化同期',
        description:
          'Syncthingでクラウド仲介なしのP2Pファイル同期を行います。',
      },
    ],
    cost: {
      breakdown: [
        { notes: 'オープンソース' },
        { notes: 'セルフホスト' },
        { notes: 'オープンソース' },
        { notes: 'オープンソース' },
        { notes: '無料枠' },
      ],
    },
    resources: [],
  },

  'job-seeker-portfolio': {
    name: '就活・ポートフォリオ',
    description:
      '無料ツールでプロフェッショナルなポートフォリオを構築し、技術面接の準備を行います。',
    useCase: 'ポートフォリオを構築し、面接の準備をする',
    tools: [
      { role: 'ポートフォリオホスティング' },
      { role: '面接対策' },
      { role: '学習ロードマップ' },
      { role: '履歴書レビュー' },
      { role: 'バージョン管理' },
    ],
    workflow: [
      {
        title: '学習ロードマップの策定',
        description:
          'roadmap.shで目標職種に必要なスキルを特定します。',
      },
      {
        title: 'プロジェクトの構築',
        description:
          'ポートフォリオ用プロジェクトを作成し、GitHubにプッシュします。',
      },
      {
        title: '面接練習',
        description: 'LeetCodeで毎日コーディング問題を解きます。',
      },
      {
        title: '履歴書の仕上げ',
        description:
          'AIチャットで履歴書とカバーレターのレビュー・改善を行います。',
      },
    ],
    cost: {
      breakdown: [
        { notes: 'パブリックリポジトリは無料' },
        { notes: '多数の無料問題' },
        { notes: '無料' },
        { notes: '無料枠' },
      ],
    },
    resources: [],
  },

  'data-science': {
    name: 'データサイエンスキット',
    description:
      'データサイエンス・ML向けの無料ツール：ノートブック、データセット、可視化、GPUコンピュート。',
    useCase: 'データを分析しMLモデルを構築する',
    tools: [
      { role: 'ノートブック' },
      { role: 'データセット' },
      { role: '数学' },
      { role: '可視化' },
      { role: 'Pythonパッケージ' },
    ],
    workflow: [
      {
        title: 'データセットの探索',
        description: 'Kaggleで課題に関連するデータセットを探します。',
      },
      {
        title: 'データの探索',
        description:
          'Google Colabの無料GPUでデータ探索と可視化を行います。',
      },
      {
        title: 'モデルの構築',
        description:
          'Colabでscikit-learn、PyTorch、TensorFlowを使いMLモデルを学習します。',
      },
      {
        title: '結果の検証',
        description:
          'Wolfram AlphaとDesmosで数学的結果を検証します。',
      },
    ],
    cost: {
      breakdown: [
        { notes: '無料GPU' },
        { notes: '無料データセット + GPU' },
        { notes: '無料回答' },
        { notes: 'オープンソース' },
      ],
    },
    resources: [],
  },

  'automation-productivity': {
    name: '自動化と生産性向上',
    description:
      '反復タスクの自動化と生産性向上のための無料ワークフローツール。',
    useCase: '反復タスクとワークフローを自動化する',
    tools: [
      { role: 'ワークフロー自動化' },
      { role: 'タスクランナー' },
      { role: '環境管理' },
      { role: 'ターミナル効率化' },
      { role: 'ディレクトリ移動' },
    ],
    workflow: [
      {
        title: '自動化のセットアップ',
        description:
          'n8nをセルフホストし、ワークフロー自動化（Zapier代替）を構築します。',
      },
      {
        title: 'プロジェクトタスク',
        description:
          'justで読みやすいプロジェクトコマンド（test、build、deploy）を定義します。',
      },
      {
        title: '環境の安全な管理',
        description:
          'direnvでプロジェクトごとの環境変数を安全に読み込みます。',
      },
      {
        title: 'ターミナルの高速化',
        description:
          'fzfとzoxideでターミナル操作を高速化します。',
      },
    ],
    cost: {
      breakdown: [
        { notes: 'セルフホスト' },
        { notes: 'オープンソース' },
        { notes: 'オープンソース' },
        { notes: 'オープンソース' },
        { notes: 'オープンソース' },
      ],
    },
    resources: [],
  },

  'open-source-contributor': {
    name: 'オープンソース貢献者',
    description:
      'オープンソースプロジェクトへの効果的な貢献のためのツール。コードレビュー、テスト、コラボレーション。',
    useCase: 'オープンソースプロジェクトに貢献する',
    tools: [
      { role: 'バージョン管理' },
      { role: 'GitHub CLI' },
      { role: 'Git TUI' },
      { role: 'テスト' },
      { role: 'コード品質' },
    ],
    workflow: [
      {
        title: 'プロジェクトの探索',
        description:
          'GitHub CLIで使用言語のgood-first-issueラベル付きIssueを検索します。',
      },
      {
        title: 'フォークとブランチ',
        description:
          'プロジェクトをフォークし、フィーチャーブランチを作成して変更を加えます。',
      },
      {
        title: 'テストとLint',
        description: '提出前にテストとLintを実行します。',
      },
      {
        title: 'PRの提出',
        description:
          'GitHub CLIで明確な説明付きのプルリクエストを作成します。',
      },
    ],
    cost: {
      breakdown: [
        { notes: 'オープンソース' },
        { notes: 'オープンソース' },
        { notes: 'オープンソース' },
        { notes: 'オープンソース' },
        { notes: 'オープンソース' },
      ],
    },
    resources: [],
  },
};
