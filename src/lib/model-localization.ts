import type { Lang } from '../i18n';

const USE_CASE_LABELS: Record<string, { en: string; ja: string }> = {
  coding: { en: 'Coding', ja: 'コーディング' },
  reasoning: { en: 'Reasoning', ja: '推論' },
  multilingual: { en: 'Multilingual', ja: '多言語' },
  'long-context': { en: 'Long Context', ja: '長文対応' },
  general: { en: 'General', ja: '汎用' },
  'all-round': { en: 'All-round', ja: 'オールラウンド' },
  'consumer-hardware': { en: 'Consumer Hardware', ja: 'コンシューマーGPU' },
  'edge-deployment': { en: 'Edge Deployment', ja: 'エッジ展開' },
  vision: { en: 'Vision', ja: 'ビジョン' },
  math: { en: 'Math', ja: '数学' },
  overall: { en: 'Overall', ja: '総合' },
  'single-gpu': { en: 'Single GPU', ja: 'シングルGPU' },
  efficient: { en: 'Efficient', ja: '効率的' },
  multimodal: { en: 'Multimodal', ja: 'マルチモーダル' },
  'eu-friendly': { en: 'EU-friendly', ja: 'EU向け' },
  ecosystem: { en: 'Ecosystem', ja: 'エコシステム' },
  knowledge: { en: 'Knowledge', ja: '知識' },
  agentic: { en: 'Agentic', ja: 'エージェント' },
  'long-tasks': { en: 'Long Tasks', ja: '長時間タスク' },
};

export function localizeUseCase(useCase: string, lang: Lang): string {
  const label = USE_CASE_LABELS[useCase];
  if (label) return label[lang];
  return useCase;
}
