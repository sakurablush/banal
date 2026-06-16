/**
 * Tool content localization — bestFor, qualityNote, caveat, and badge labels.
 * English is source of truth in zero-key-tools.ts; Japanese lives in zero-key-tools-ja.ts.
 */

import type { Lang } from '../i18n';
import type { ZeroKeyTool } from '../data/zero-key-tools';

type JaToolOverlay = {
  bestFor: string;
  qualityNote: string;
  caveat?: string;
};

let jaCache: Record<string, JaToolOverlay> | null = null;
let jaLoadPromise: Promise<void> | null = null;

/** Load Japanese tool copy on demand (skipped for EN-only visitors). */
export async function ensureJaLocaleLoaded(): Promise<void> {
  if (jaCache) return;
  if (!jaLoadPromise) {
    jaLoadPromise = import('../data/zero-key-tools-ja').then((mod) => {
      jaCache = mod.zeroKeyToolsJa;
    });
  }
  await jaLoadPromise;
}

export interface LocalizedToolCopy {
  bestFor: string;
  qualityNote: string;
  caveat?: string;
}

/** Common badge strings → Japanese. Proper nouns and model names stay as-is when missing. */
const BADGE_JA: Record<string, string> = {
  'no signup': 'アカウント不要',
  'no billing': '課金不要',
  'no install': 'インストール不要',
  'no key': 'キー不要',
  'no google': 'Google不要',
  private: 'プライベート',
  local: 'ローカル',
  'local ai': 'ローカルAI',
  'local models': 'ローカルモデル',
  'local-first': 'ローカル優先',
  'open-source': 'オープンソース',
  oss: 'OSS',
  'oss core': 'OSSコア',
  free: '無料',
  'free tier': '無料枠',
  'free credits': '無料クレジット',
  'free gpu': '無料GPU',
  'free knowledge': '無料ナレッジ',
  'true-free-models': '完全無料モデル',
  generous: '寛大な無料枠',
  simple: 'シンプル',
  popular: '人気',
  versatile: '汎用',
  powerful: '高性能',
  capable: '高品質',
  trusted: '信頼性',
  quality: '高品質',
  fast: '高速',
  'ultra-fast': '超高速',
  instant: '即時',
  unlimited: '無制限',
  'unlimited completions': '無制限補完',
  'unlimited concurrency': '無制限並列',
  multilingual: '多言語',
  multimodal: 'マルチモーダル',
  conversational: '会話型',
  empathetic: '共感的',
  developer: '開発者向け',
  'developer-friendly': '開発者向け',
  'developer career': 'キャリア向け',
  coding: 'コーディング',
  reasoning: '推論',
  research: 'リサーチ',
  'research-grade': '研究グレード',
  'research assistant': 'リサーチアシスタント',
  'model comparison': 'モデル比較',
  'multi-model': 'マルチモデル',
  'open models': 'オープンモデル',
  'open weights': 'オープンウェイト',
  community: 'コミュニティ',
  searchable: '検索可能',
  models: 'モデル',
  'web search': 'Web検索',
  'ai search': 'AI検索',
  chat: 'チャット',
  'image gen': '画像生成',
  'image editor': '画像エディタ',
  'text-to-image': 'テキスト→画像',
  'text-to-video': 'テキスト→動画',
  'text-to-music': 'テキスト→音楽',
  'text-to-speech': 'テキスト読み上げ',
  'text-to-slides': 'テキスト→スライド',
  'background removal': '背景除去',
  'object removal': 'オブジェクト除去',
  inpainting: 'インペインティング',
  diagramming: '図表作成',
  diagrams: '図表',
  'offline-capable': 'オフライン対応',
  browser: 'ブラウザ',
  'browser ide': 'ブラウザIDE',
  'browser editor': 'ブラウザエディタ',
  'browser-based': 'ブラウザベース',
  'web ide': 'Web IDE',
  'static hosting': '静的ホスティング',
  'custom domain': 'カスタムドメイン',
  'self-host': 'セルフホスト',
  'self-hosted': 'セルフホスト',
  postgres: 'Postgres',
  auth: '認証',
  storage: 'ストレージ',
  encryption: '暗号化',
  encrypted: '暗号化済み',
  privacy: 'プライバシー',
  security: 'セキュリティ',
  monitoring: 'モニタリング',
  automation: '自動化',
  testing: 'テスト',
  documentation: 'ドキュメント',
  templates: 'テンプレート',
  workflows: 'ワークフロー',
  collaboration: 'コラボ',
  collaborative: '共同作業',
  teams: 'チーム',
  education: '教育',
  courses: 'コース',
  curriculum: 'カリキュラム',
  practice: '練習',
  mentorship: 'メンター',
  academic: '学術',
  papers: '論文',
  translation: '翻訳',
  grammar: '文法',
  summarizer: '要約',
  paraphrasing: '言い換え',
  'step-by-step': 'ステップ解説',
  'math solver': '数学ソルバー',
  'math tools': '数学ツール',
  geometry: '幾何学',
  graphing: 'グラフ',
  computational: '計算',
  'high quality': '高品質',
  professional: 'プロ品質',
  beautiful: '美しい',
  affordable: '手頃',
  comprehensive: '包括的',
  'figma alternative': 'Figma代替',
  'cursor alternative': 'Cursor代替',
  'ide extension': 'IDE拡張',
  'codebase-aware': 'コードベース対応',
  'rate limit': 'レート制限',
  'files deleted': 'ファイル自動削除',
  'sketch-to-image': 'スケッチ→画像',
  'background music': 'BGM',
  'voice clone': 'ボイスクローン',
  'chat with pdf': 'PDFチャット',
  'pdf tools': 'PDFツール',
  'pdf summary': 'PDF要約',
  'smart slides': 'スマートスライド',
  'design suite': 'デザインスイート',
  'design rules': 'デザインルール',
  'ai writing': 'AI文章',
  'ai writer': 'AIライター',
  'ai tutor': 'AIチューター',
  'ai slides': 'AIスライド',
  'ai music': 'AI音楽',
  'ai features': 'AI機能',
  'ai-powered': 'AI搭載',
  'ai agent': 'AIエージェント',
  'ai assistant': 'AIアシスタント',
  'ai code assistant': 'AIコーディング',
  'ai autocomplete': 'AI補完',
  'full-stack': 'フルスタック',
  'full songs': 'フルソング',
  'instant deploy': '即時デプロイ',
  'node in browser': 'ブラウザ内Node',
  frontend: 'フロントエンド',
  backend: 'バックエンド',
  database: 'データベース',
  serverless: 'サーバーレス',
  edge: 'エッジ',
  git: 'Git',
  terminal: 'ターミナル',
  cli: 'CLI',
  api: 'API',
  'api available': 'API利用可',
  'open api': 'オープンAPI',
  deploy: 'デプロイ',
  sharing: '共有',
  notes: 'メモ',
  wiki: 'Wiki',
  search: '検索',
  guides: 'ガイド',
  books: '書籍',
  recipes: 'レシピ',
  weather: '天気',
  news: 'ニュース',
  food: '食品',
  animation: 'アニメーション',
  anime: 'アニメ',
  music: '音楽',
  'music ai': '音楽AI',
  video: '動画',
  'video editor': '動画編集',
  'video editing': '動画編集',
  'video ai': '動画AI',
  transcription: '文字起こし',
  tts: 'TTS',
  'many voices': '多数の声',
  '130+ languages': '130+言語',
  citations: '引用付き',
  'cited search': '引用付き検索',
  'evidence-based': 'エビデンス重視',
  'paper exploration': '論文探索',
  'visual graph': 'ビジュアルグラフ',
  discovery: '発見',
  'real-time': 'リアルタイム',
  european: '欧州',
  transparent: '透明性',
  byok: 'BYOK',
  'rate limited': '制限あり',
};

const BADGE_FREE_JA = '🔓 無料';
const BADGE_FREE_EN = '🔓 Free';

export function getLocalizedToolCopy(tool: ZeroKeyTool, lang: Lang): LocalizedToolCopy {
  if (lang === 'ja' && jaCache) {
    const ja = jaCache[tool.id];
    if (ja) {
      return {
        bestFor: ja.bestFor,
        qualityNote: ja.qualityNote,
        caveat: ja.caveat,
      };
    }
  }
  return {
    bestFor: tool.bestFor,
    qualityNote: tool.qualityNote,
    caveat: tool.caveat,
  };
}

export function localizeBadge(badge: string, lang: Lang): string {
  if (lang === 'en') {
    return badge === 'true-free-models' ? BADGE_FREE_EN : badge;
  }
  if (badge === 'true-free-models') return BADGE_FREE_JA;
  const key = badge.toLowerCase();
  return BADGE_JA[key] ?? BADGE_JA[badge] ?? badge;
}

/** Reset cached JA copy (for tests). */
export function resetJaLocaleCacheForTests(): void {
  jaCache = null;
  jaLoadPromise = null;
}
