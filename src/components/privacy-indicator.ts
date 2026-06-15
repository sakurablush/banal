/**
 * Privacy Level Indicator — Shows privacy transparency for tools.
 * Displays privacy level (high/medium/low) with detailed breakdown.
 */

import type { Lang } from '../i18n';
import type { PrivacyInfo } from '../types/tool';

// ─── Copy ───────────────────────────────────────────────────────────────────

const COPY = {
  en: {
    privacyLevel: 'Privacy Level',
    high: 'HIGH',
    medium: 'MEDIUM',
    low: 'LOW',
    noTelemetry: 'No telemetry',
    endToEndEncryption: 'End-to-end encryption',
    euDataResidency: 'EU data residency',
    gdprCompliant: 'GDPR compliant',
    noTrainingOnData: 'No training on user data',
    openSourceAuditable: 'Open source (auditable)',
    hasTelemetry: 'Has telemetry',
    noEncryption: 'No end-to-end encryption',
    usDataResidency: 'US data residency',
    chinaDataResidency: 'China data residency',
    mayTrainOnData: 'May train on user data',
    closedSource: 'Closed source',
  },
  ja: {
    privacyLevel: 'プライバシーレベル',
    high: '高',
    medium: '中',
    low: '低',
    noTelemetry: 'テレメトリなし',
    endToEndEncryption: 'エンドツーエンド暗号化',
    euDataResidency: 'EUデータ所在地',
    gdprCompliant: 'GDPR準拠',
    noTrainingOnData: 'ユーザーデータで学習しない',
    openSourceAuditable: 'オープンソース（監査可能）',
    hasTelemetry: 'テレメトリあり',
    noEncryption: 'エンドツーエンド暗号化なし',
    usDataResidency: 'USデータ所在地',
    chinaDataResidency: '中国データ所在地',
    mayTrainOnData: 'ユーザーデータで学習する可能性',
    closedSource: 'クローズドソース',
  },
} satisfies Record<Lang, Record<string, string>>;

// ─── Helpers ────────────────────────────────────────────────────────────────

function create<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (className) el.className = className;
  return el;
}

// ─── Render: Privacy Level Indicator ────────────────────────────────────────

export function renderPrivacyIndicator(
  privacy: PrivacyInfo,
  lang: Lang
): HTMLElement {
  const copy = COPY[lang];
  const container = create('div', 'privacy-indicator');

  // Privacy level badge
  const levelBadge = create('div', `privacy-level privacy-level-${privacy.level}`);
  const levelText = privacy.level === 'high' ? copy.high : privacy.level === 'medium' ? copy.medium : copy.low;
  levelBadge.textContent = `${copy.privacyLevel}: ${levelText}`;
  container.appendChild(levelBadge);

  // Privacy details list
  const detailsList = create('ul', 'privacy-details-list');

  // Telemetry
  if (!privacy.telemetry) {
    detailsList.appendChild(createPrivacyItem('✓', copy.noTelemetry, true));
  } else {
    detailsList.appendChild(createPrivacyItem('✗', copy.hasTelemetry, false));
  }

  // Encryption
  if (privacy.encryption) {
    detailsList.appendChild(createPrivacyItem('✓', copy.endToEndEncryption, true));
  } else {
    detailsList.appendChild(createPrivacyItem('✗', copy.noEncryption, false));
  }

  // Data residency
  if (privacy.dataResidency?.includes('EU')) {
    detailsList.appendChild(createPrivacyItem('✓', copy.euDataResidency, true));
  } else if (privacy.dataResidency?.includes('US')) {
    detailsList.appendChild(createPrivacyItem('⚠', copy.usDataResidency, false));
  } else if (privacy.dataResidency?.includes('China')) {
    detailsList.appendChild(createPrivacyItem('⚠', copy.chinaDataResidency, false));
  }

  // Training on prompts
  if (!privacy.trainingOnPrompts) {
    detailsList.appendChild(createPrivacyItem('✓', copy.noTrainingOnData, true));
  } else {
    detailsList.appendChild(createPrivacyItem('✗', copy.mayTrainOnData, false));
  }

  container.appendChild(detailsList);

  return container;
}

function createPrivacyItem(icon: string, text: string, isPositive: boolean): HTMLElement {
  const item = create('li', `privacy-details-item ${isPositive ? 'privacy-positive' : 'privacy-negative'}`);
  const iconSpan = create('span', 'privacy-icon');
  iconSpan.textContent = icon;
  item.appendChild(iconSpan);
  const textSpan = create('span', 'privacy-text');
  textSpan.textContent = text;
  item.appendChild(textSpan);
  return item;
}
