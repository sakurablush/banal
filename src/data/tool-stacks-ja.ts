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
    name: '$0でWebアプリを作る',
    description:
      'Webアプリ・副業プロジェクト・生成AIプロダクトを、月額ツール代なしで作る開発者向け。日常のコーディングはKilo Code（無料モデル、IPあたり約200リクエスト/時）。レート制限（429）が出たら同日中にGroqやOpenRouter無料枠へ切り替え。Google Antigravityは数週間に一度の設計・レビュー用—毎日のエディタではない。',
    useCase: '無料枠でWebアプリやAIプロダクトを出す',
    tools: [
      { role: '日常のコーディング（VS Code）' },
      { role: 'Kilo上限時の予備' },
      { role: '設計・レビュー（たまに）' },
      { role: 'DB・認証' },
      { role: 'ホスティング' },
      { role: 'バージョン管理' },
    ],
    workflow: [
      {
        title: 'リポジトリとKiloの準備',
        description:
          'VS CodeにKilo Codeを入れ、kilo-auto/freeを選択（クレカ不要）。Gitを初期化。Auto Freeには機密コードを入れない—無料ルートは上流でログされる場合あり。',
      },
      {
        title: 'データベースを作る',
        description:
          'Supabase無料枠（500MB）を作成。テーブル設計とRLSを有効化。7日間非アクティブでプロジェクトが一時停止—週1ログインしないとAPIが止まる。',
      },
      {
        title: 'Kiloで毎日実装',
        description:
          '小さく区切って出す。HTTP 429ならGroq APIキーを追加（無料枠はモデルごとに日次上限あり）して続行。無料モデルの品質はばらつく—マージ前に差分を確認。',
      },
      {
        title: '定期的な設計レビュー',
        description:
          '数週間ごとに、モジュール一覧や詰まったファイルをGoogle Antigravityへ（公開プレビュー中は無料、将来有料の可能性）。ロードマップとレビュー向き。',
      },
      {
        title: 'デプロイ',
        description:
          'GitHubをCloudflare Pagesに接続（ホビー無料）。Supabaseの環境変数を設定。本番トラフィックが増えたら有料枠が必要になることも。',
      },
    ],
    cost: {
      breakdown: [
        { notes: 'Auto Free 約200 req/時/IP；上限で429' },
        { notes: '無料枠はモデル別；大量本番向きでない' },
        { notes: 'プレビュー中無料；変更の可能性' },
        { notes: '500MB；7日放置で一時停止' },
        { notes: 'ホビー無料；フェアユースあり' },
        { notes: 'GitHubパブリックリポジトリ無料' },
      ],
    },
    resources: [
      { title: 'Kilo 利用料・無料モデル制限' },
      { title: 'Supabase 無料枠' },
    ],
  },

  'freelance-web-dev': {
    name: 'フリーランス向けクライアントサイト',
    description:
      'サブスクを積み上げずにクライアントサイトを納品。実装はKilo Code、ワイヤーはExcalidraw、プレビューはVercelかCloudflare。デモや小規模サイトは無料枠で足りるが、アクセスが増えたらホスティングやDBの有料化を前提に。',
    useCase: 'クライアント向けWebサイト・小規模アプリを納品する',
    tools: [
      { role: '実装・修正' },
      { role: 'ワイヤーフレーム' },
      { role: 'プレビューURL' },
      { role: 'フォーム・データ' },
      { role: 'バージョン管理' },
    ],
    workflow: [
      {
        title: '平易な言葉で範囲を合意',
        description:
          'Excalidrawでページ構成（無料・アカウント不要）。クライアントには箱よりFigma用語が伝わりやすい。',
      },
      {
        title: 'プロジェクトの土台',
        description:
          'Git＋Vercelホビー。フォームやログインが必要ならSupabase無料枠—500MBと放置停止の制限をクライアントに共有。',
      },
      {
        title: 'AIで実装',
        description:
          'Kiloでコンポーネントと修正。レート制限時はGroq/OpenRouterへ。Copilot Proはクライアント要件がなければ必須ではない。',
      },
      {
        title: 'プレビューから本番へ',
        description:
          'プッシュごとにVercelプレビューURL。トラフィックやDBサイズが無料枠を超えるなら公開前に有料プランへ。',
      },
    ],
    cost: {
      breakdown: [
        { notes: '無料モデルはレート制限あり' },
        { notes: 'ホビー；商用はProが必要な場合あり' },
        { notes: '任意；500MB上限' },
        { notes: 'オープンソース' },
        { notes: '無料' },
      ],
    },
    resources: [{ title: 'Vercel ホビーとPro' }],
  },

  'local-ai-dev': {
    name: '自分のPCでローカルAI',
    description:
      'クラウド無料枠が足りない、またはデータを外に出したくないとき向け。8〜16GB VRAMなら7B〜8B量子化が現実的。70BはノートPC向けではない—データセンターGPU向けの話と混同しない。',
    useCase: 'データをクラウドに送らずコーディング・チャット',
    tools: [
      { role: 'ローカル実行' },
      { role: '汎用7Bモデル' },
      { role: 'ブラウザチャット' },
      { role: 'エディタ連携' },
      { role: '難しい推論（GPU次第）' },
    ],
    workflow: [
      {
        title: 'ハードを正直に見積もる',
        description:
          'VRAM 8GB → 7B Q4まで。16GB → 8B〜14Bが現実的。CPUのみも可だが遅い—プライバシー向き、終日コーディング向きではない。',
      },
      {
        title: '小さいモデルをpull',
        description:
          'Ollamaを入れ、qwen2.5:7bなどを取得。初回は数GBダウンロード、その後はオフライン。',
      },
      {
        title: 'ブラウザでチャット',
        description:
          '任意：Open WebUIでlocalhost向けUI。クラウドより遅いがトークン上限なし。',
      },
      {
        title: 'エディタに接続',
        description:
          'Continue.devからOllamaへ。フロンティアクラウドより弱い—定型コードと機密ファイル向き。',
      },
    ],
    cost: {
      breakdown: [
        { notes: 'オープンソース' },
        { notes: '7B Q4で約4〜6GB VRAM' },
        { notes: 'セルフホスト' },
        { notes: 'オープンソース' },
        { notes: '大容量量子化は大きいGPUのみ' },
      ],
    },
    resources: [{ title: 'Ollama モデル一覧' }],
  },

  'student-learning': {
    name: '$0でプログラミングを学ぶ',
    description:
      'ブートキャンプ料金なしで学ぶ。freeCodeCampでカリキュラム、Exercismで練習、ブラウザIDEで高スペックPC不要。ChatGPTやDuck.aiは行き詰まり用—無料枠は1日のメッセージ数に上限があるので、答えコピーではなくブロッカー解消に使う。',
    useCase: 'ゼロからプログラミングを学ぶ',
    tools: [
      { role: '体系的なレッスン' },
      { role: 'フィードバック付き練習' },
      { role: 'ブラウザIDE' },
      { role: '行き詰まり時の質問' },
      { role: 'スキルロードマップ' },
    ],
    workflow: [
      {
        title: '1つの道筋を選んで続ける',
        description:
          'freeCodeCampかroadmap.shから開始。毎週コースを変えると挫折しやすい。',
      },
      {
        title: 'フィードバック付きで練習',
        description:
          'Exercismは小さな課題にメンター的フィードバック。調子悪い日は1問、良い日は3問。',
      },
      {
        title: 'ブラウザで作る',
        description:
          'StackBlitzやReplit無料枠。Replitは使用量制限あり；静的フロントならStackBlitzが軽い。',
      },
      {
        title: 'AIは家庭教師として',
        description:
          '詰まったら試したことを書いてDuck.aiへ。日次上限なら寝かせるかドキュメントを読む—それも学習。',
      },
    ],
    cost: {
      breakdown: [
        { notes: '完全無料' },
        { notes: '無料メンタートラック' },
        { notes: '無料枠は寛容' },
        { notes: '登録不要；共有レート制限' },
      ],
    },
    resources: [{ title: 'freeCodeCamp カリキュラム' }],
  },

  'content-creator': {
    name: '$0で動画・投稿を作る',
    description:
      'AdobeなしでYouTube・ブログ・SNS向けコンテンツ。CapCutとCanva無料枠で開始可能。SunoとGammaは日次クレジット制—調子の良い日にまとめ作業し、ファイルはローカルに保存。',
    useCase: '予算ゼロで定期的にコンテンツを出す',
    tools: [
      { role: '動画編集' },
      { role: 'サムネ・画像' },
      { role: 'スライド構成' },
      { role: 'BGM' },
      { role: '翻訳チェック' },
    ],
    workflow: [
      {
        title: '生成の前に骨子を書く',
        description:
          'Gammaやメモに箇条書き。AIスライドは下書き—キャプションは必ず手で直す。',
      },
      {
        title: 'ビジュアル作成',
        description:
          'Canva無料でサムネと短い画像。PNGで書き出し—Canvaホスティングだけに頼らない。',
      },
      {
        title: '動画編集',
        description:
          'CapCutで自動字幕など。一部エクスポートに透かしがある場合あり—公開前に確認。',
      },
      {
        title: '音楽と言語',
        description:
          'Sunoは日次クレジット—数曲生成して保存。DeepL無料は文字数制限；全体翻訳ではなく仕上げ用。',
      },
    ],
    cost: {
      breakdown: [
        { notes: '一部エクスポートに透かし' },
        { notes: 'テンプレ制限' },
        { notes: '日次クレジット' },
        { notes: 'AIクレジット制限' },
      ],
    },
    resources: [],
  },

  'privacy-first': {
    name: 'データを他人のサーバーに載せない',
    description:
      '健康・法律・個人の作業を学習データに入れたくないとき。ローカルAI（Jan/Ollama）、自分で管理するパスワード、同期は自分が選ぶメモ。セルフホストはお金より半日のセットアップ時間が必要。',
    useCase: '機密ファイルをクラウドAIなしで扱う',
    tools: [
      { role: 'オフラインチャット' },
      { role: 'パスワード' },
      { role: 'ローカルメモ' },
      { role: 'P2Pファイル同期' },
      { role: '共有ドキュメント' },
    ],
    workflow: [
      {
        title: 'アップロードなしでチャット',
        description:
          'JanまたはOllamaを自PCに。一般向けGPUでは小さいモデルのみ—品質とプライバシーのトレードオフ。',
      },
      {
        title: 'パスワードを一箇所に',
        description:
          '多くの人はBitwarden無料で十分。家族共有を自前でならVaultwarden。',
      },
      {
        title: 'メモは自分のもの',
        description:
          'JoplinはローカルMarkdown；同期は任意。医療・法律・日記向き。',
      },
      {
        title: 'Dropboxなしで共有',
        description:
          'Syncthingは端末間同期。たまの共同作業はCryptpad。',
      },
    ],
    cost: {
      breakdown: [
        { notes: 'ローカルのみ' },
        { notes: '個人無料枠' },
        { notes: 'オープンソース' },
        { notes: 'クラウドアカウント不要' },
        { notes: '無料枠' },
      ],
    },
    resources: [],
  },

  'job-seeker-portfolio': {
    name: '就活：ポートフォリオと練習',
    description:
      'GitHub Pagesで作品を見せ、LeetCode無料問題で練習、AIは履歴書の言い回し用—経歴の捏造には使わない。面接対策は反復；毎日続ければ無料ツールで足りる。',
    useCase: '作品で開発職に応募する',
    tools: [
      { role: 'ポートフォリオサイト' },
      { role: '面接練習' },
      { role: 'スキルチェックリスト' },
      { role: '履歴書の推敲' },
      { role: '実コミットの証明' },
    ],
    workflow: [
      {
        title: '職種が求めることを把握',
        description:
          'roadmap.shで目標職種の穴を洗い出す—証明に必要なポートフォリオは2〜3個でよい。',
      },
      {
        title: '公開リポジトリで出す',
        description:
          'GitHubにpushし、GitHub Pagesで簡単なポートフォリオ。採用側は流行語よりリポジトリを見る。',
      },
      {
        title: '問題練習',
        description:
          'LeetCode無料＋声に出して説明。理解した1問が、コピーした10問より価値がある。',
      },
      {
        title: '応募文の仕上げ',
        description:
          'Duck.aiに「具体的に短く」と箇条書きを渡す。すべて事実か確認。',
      },
    ],
    cost: {
      breakdown: [
        { notes: 'パブリックリポジトリ' },
        { notes: '問題の一部が無料' },
        { notes: '無料' },
        { notes: 'レート制限あり' },
      ],
    },
    resources: [],
  },

  'data-science': {
    name: 'GPU代なしでデータ分析',
    description:
      'KaggleとGoogle Colab無料GPUは学習と小規模プロジェクト向け。セッション切断・クォータ変更あり。Colab無料は24時間学習用ではない—こまめにチェックポイント保存。',
    useCase: 'データ探索と小さなモデル学習',
    tools: [
      { role: 'ノートブック＋GPU' },
      { role: 'データセット' },
      { role: '高速Python環境' },
      { role: '簡易グラフ' },
      { role: '計算の確認' },
    ],
    workflow: [
      {
        title: 'データを探す',
        description:
          'Kaggleの他者ノートを読んでからコピー。商用利用のライセンスを確認。',
      },
      {
        title: 'Colabで探索',
        description:
          '無料GPUセッションはタイムアウト。Drive保存かCSV/モデルのダウンロードを忘れない。',
      },
      {
        title: '再現可能なPython',
        description:
          'Colabだけでは足りないときuvでローカルvenv。小データならCPUでも同じコードを回す。',
      },
      {
        title: '計算の確認',
        description:
          'Desmosで簡易プロット；Wolfram Alpha無料で積分・単位確認—宿題の丸写し用ではない。',
      },
    ],
    cost: {
      breakdown: [
        { notes: 'GPUは保証されずタイムアウト' },
        { notes: '無料で週30GPU時間程度' },
        { notes: 'オープンソース' },
        { notes: '無料クエリ数制限' },
      ],
    },
    resources: [],
  },

  'automation-productivity': {
    name: '面倒なPC作業を自動化',
    description:
      'セルフホストn8nでZapier代替。just・direnv・ターミナルツールで再現性を上げる。常時起動マシンが必要—ノートPCがスリープすると自動化も止まる。',
    useCase: '毎日同じクリックをやめる',
    tools: [
      { role: 'ビジュアル自動化' },
      { role: 'プロジェクトコマンド' },
      { role: 'フォルダ別環境変数' },
      { role: 'ファジー検索' },
      { role: 'ディレクトリジャンプ' },
    ],
    workflow: [
      {
        title: '一番うざい作業を1つ',
        description:
          'Dockerでn8nをセルフホスト。メール→表、Webhook→通知など。動く1本が未完成10本より価値がある。',
      },
      {
        title: 'コマンドを明確に',
        description:
          'justfileにtest/build/deploy。未来の自分がnpmスクリプトを推測しなくてよい。',
      },
      {
        title: 'APIキーの漏洩を防ぐ',
        description:
          'direnvでcd時に.envを読み込み、出るとアンロード。',
      },
      {
        title: 'ターミナルを速く',
        description:
          'fzf＋zoxideは任意。基本が動いてからでよい。',
      },
    ],
    cost: {
      breakdown: [
        { notes: 'セルフホスト；クラウドはフェアユース' },
        { notes: 'オープンソース' },
        { notes: 'オープンソース' },
        { notes: 'オープンソース' },
        { notes: 'オープンソース' },
      ],
    },
    resources: [],
  },

  'open-source-contributor': {
    name: 'オープンソースに貢献する',
    description:
      'Issueを見つけ、フォークし、テストし、PRを出す。有料ツール不要—メンテナーが見るのは明確な差分とコミュニケーション。コードが怖ければドキュメントやtypoから。',
    useCase: '初めてマージされるPRを出す',
    tools: [
      { role: 'バージョン管理' },
      { role: 'ターミナルからGitHub' },
      { role: '見慣れないコードの理解' },
      { role: 'UIテスト実行' },
      { role: 'Python Lint' },
    ],
    workflow: [
      {
        title: '歓迎されるIssueを探す',
        description:
          '普段使うリポジトリでgood first issue。コーディング前にCONTRIBUTING.mdを読む。',
      },
      {
        title: 'フォークとブランチ',
        description:
          '小さなブランチ、1 PR 1修正。巨大リファクタよりREADMEのtypo修正から。',
      },
      {
        title: 'メンテナーと同じチェック',
        description:
          'ローカルでテストとLint。CI失敗は全員の時間の無駄。',
      },
      {
        title: '明確なPR',
        description:
          'gh pr createで変更理由を書く。Issueをリンク。レビューコメントには丁寧に。',
      },
    ],
    cost: {
      breakdown: [
        { notes: 'オープンソース' },
        { notes: 'オープンソース' },
        { notes: '任意；無料枠制限' },
        { notes: 'オープンソース' },
        { notes: 'オープンソース' },
      ],
    },
    resources: [],
  },
};
