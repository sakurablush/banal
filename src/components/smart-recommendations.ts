/**
 * Smart Recommendations — "If you like X, try Y" system.
 * Suggests similar tools based on category, features, and use cases.
 */

import type { Lang } from '../i18n';
import { zeroKeyTools } from '../data/zero-key-tools';
import type { ZeroKeyTool } from '../data/zero-key-tools';

// ─── Copy ───────────────────────────────────────────────────────────────────

const COPY = {
  en: {
    recommendations: 'Recommended Tools',
    ifYouLike: 'If you like {name}, try',
    similarTools: 'Similar tools',
    viewTool: 'View',
  },
  ja: {
    recommendations: 'おすすめツール',
    ifYouLike: '{name}が好きなら、こちらも',
    similarTools: '類似ツール',
    viewTool: '見る',
  },
} satisfies Record<Lang, Record<string, string>>;

// ─── Recommendation Logic ───────────────────────────────────────────────────

interface Recommendation {
  tool: ZeroKeyTool;
  similarity: number;
  reason: string;
}

export function getRecommendations(
  sourceTool: ZeroKeyTool,
  _lang: Lang,
  limit: number = 5
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  for (const tool of zeroKeyTools) {
    if (tool.id === sourceTool.id) continue;

    let similarity = 0;
    const reasons: string[] = [];

    // Same category
    if (tool.category === sourceTool.category) {
      similarity += 0.4;
      reasons.push('same category');
    }

    // Same surface
    if (tool.surface === sourceTool.surface) {
      similarity += 0.2;
      reasons.push('same interface');
    }

    // Same access type
    if (tool.access === sourceTool.access) {
      similarity += 0.15;
      reasons.push('same access type');
    }

    // Overlapping badges
    const commonBadges = tool.badges.filter(b => sourceTool.badges.includes(b));
    if (commonBadges.length > 0) {
      similarity += 0.1 * Math.min(commonBadges.length, 3);
      reasons.push(`shares: ${commonBadges.slice(0, 2).join(', ')}`);
    }

    // Similar bestFor keywords
    const sourceKeywords = extractKeywords(sourceTool.bestFor);
    const toolKeywords = extractKeywords(tool.bestFor);
    const commonKeywords = sourceKeywords.filter(k => toolKeywords.includes(k));
    if (commonKeywords.length > 0) {
      similarity += 0.15;
      reasons.push('similar use case');
    }

    if (similarity > 0.3) {
      recommendations.push({
        tool,
        similarity,
        reason: reasons.join(', '),
      });
    }
  }

  return recommendations
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}

function extractKeywords(text: string): string[] {
  const keywords = [
    'coding', 'code', 'development', 'programming',
    'image', 'photo', 'design', 'graphic',
    'video', 'animation', 'motion',
    'audio', 'music', 'voice', 'speech',
    'writing', 'text', 'content', 'copywriting',
    'chat', 'conversation', 'assistant',
    'search', 'research', 'discovery',
    'pdf', 'document', 'file',
    'presentation', 'slides',
    'math', 'science', 'education',
    'api', 'backend', 'database',
    'automation', 'workflow', 'productivity',
    'security', 'privacy', 'encryption',
    'ai', 'machine learning', 'llm',
  ];

  const lowerText = text.toLowerCase();
  return keywords.filter(k => lowerText.includes(k));
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function create<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (className) el.className = className;
  return el;
}

// ─── Render: Recommendations ────────────────────────────────────────────────

export function renderRecommendations(
  sourceTool: ZeroKeyTool,
  lang: Lang
): HTMLElement {
  const copy = COPY[lang];
  const container = create('div', 'recommendations-section');

  // Header
  const header = create('div', 'recommendations-header');
  const title = create('h3', 'recommendations-title');
  title.textContent = copy.recommendations;
  header.appendChild(title);
  const subtitle = create('p', 'recommendations-subtitle');
  subtitle.textContent = copy.ifYouLike.replace('{name}', sourceTool.name);
  header.appendChild(subtitle);
  container.appendChild(header);

  // Recommendations list
  const recommendations = getRecommendations(sourceTool, lang);
  const list = create('div', 'recommendations-list');

  for (const rec of recommendations) {
    const card = create('div', 'recommendation-card');
    
    const name = create('h4', 'recommendation-name');
    name.textContent = rec.tool.name;
    card.appendChild(name);

    const desc = create('p', 'recommendation-desc');
    desc.textContent = rec.tool.bestFor;
    card.appendChild(desc);

    const reason = create('span', 'recommendation-reason');
    reason.textContent = rec.reason;
    card.appendChild(reason);

    const viewBtn = create('a', 'recommendation-btn');
    viewBtn.href = rec.tool.url;
    viewBtn.target = '_blank';
    viewBtn.rel = 'noopener noreferrer';
    viewBtn.textContent = copy.viewTool;
    card.appendChild(viewBtn);

    list.appendChild(card);
  }

  container.appendChild(list);

  return container;
}
