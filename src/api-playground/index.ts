/**
 * Banal AI — professional API Playground UI.
 */

import { sendPlaygroundRequest, type PlaygroundSendOptions } from './client';
import {
  clearAllPlaygroundKeys,
  getSavedKeyMask,
  hasPlaygroundKey,
  setPlaygroundKey,
  type PlaygroundKeyMode,
} from './keys';
import {
  getProviderById,
  getProvidersByMode,
  PLAYGROUND_PROVIDERS,
  providerStatus,
  getDefaultSettings,
} from './providers';
import type {
  PlaygroundCategory,
  PlaygroundChatMessage,
  PlaygroundHistoryItem,
  PlaygroundProviderId,
  PlaygroundResponseTab,
  PlaygroundResult,
  PlaygroundSettings,
} from './types';
import { PlaygroundError } from './types';
import { copyText, escapeHtml, formatBytes, formatMs, PLAYGROUND_CATEGORY_LABELS } from './utils';
import type { Lang } from '../i18n';

interface PlaygroundUiState {
  selectedProviderId: PlaygroundProviderId;
  selectedMode: PlaygroundCategory;
  selectedModel: string;
  activeTab: PlaygroundResponseTab;
  keyMode: PlaygroundKeyMode;
  keysPanelOpen: boolean;
  messages: PlaygroundChatMessage[];
  history: PlaygroundHistoryItem[];
  response?: PlaygroundResult | PlaygroundError;
  settings: PlaygroundSettings;
  activeRequest: boolean;
  abortController?: AbortController;
}

const MODES: PlaygroundCategory[] = ['chat', 'data', 'image', 'utility'];
const RESPONSE_TABS: PlaygroundResponseTab[] = ['rendered', 'json', 'request', 'logs'];

const COPY = {
  en: {
    title: 'API Playground',
    subtitle: 'Free APIs, local keys, request inspection, and honest free-tier limits.',
    privacy: 'Keys stay in this browser. Banal never receives them and there is no server proxy.',
    providers: 'Providers',
    keys: 'Keys',
    close: 'Close',
    save: 'Save',
    clear: 'Clear',
    cancel: 'Cancel',
    send: 'Send',
    sending: 'Sending…',
    thinking: 'Waiting for provider…',
    clearConversation: 'Clear',
    model: 'Model',
    temperature: 'Temperature',
    maxTokens: 'Max tokens',
    forecastDays: 'Forecast days',
    prompt: 'Request or prompt',
    promptPlaceholder: 'Describe what you want to test…',
    response: 'Response',
    rendered: 'Rendered',
    json: 'JSON',
    request: 'Request',
    logs: 'Logs',
    noResponse: 'No response yet. Send a request to inspect latency, headers, and raw JSON.',
    noHistory: 'No history yet.',
    copy: 'Copy',
    copied: 'Copied',
    keyNeeded: 'Key needed',
    ready: 'Ready',
    anonymous: 'Anonymous',
    optionalKey: 'Optional key',
    rateLimited: 'Rate-limited',
    status: 'Status',
    latency: 'Latency',
    endpoint: 'Endpoint',
    requestSize: 'Request size',
    responseSize: 'Response size',
    warnings: 'Warnings',
    providerDocs: 'Docs',
    providerNote: 'Provider note',
    rateHint: 'Rate hint',
    sessionKeys: 'Session-only keys',
    sessionKeysHelp: 'Use sessionStorage instead of localStorage on shared machines.',
    clearAllKeys: 'Clear all playground keys',
    savedKey: 'Saved',
    enterKey: 'Enter key',
    keyWarning: 'Client-side keys are convenient but risky on shared devices. Use session-only keys when needed.',
    imageComingSoon: 'Image APIs are paused until a browser-safe, no-captcha provider is verified.',
    utilityComingSoon: 'Utility APIs are next. The playground is ready for CORS-friendly providers.',
    geocodeHint: 'Open-Meteo accepts coordinates or a city name and will geocode city names in-browser.',
    noKeyHint: 'No key is required for this provider.',
    abortHint: 'Cancelled. Nothing was sent after cancellation.',
  },
  ja: {
    title: 'API プレイグラウンド',
    subtitle: '無料API、ローカル鍵、リクエスト確認、正直な無料枠表示。',
    privacy: '鍵はこのブラウザ内だけ。Banalには送らず、サーバープロキシもありません。',
    providers: 'プロバイダー',
    keys: '鍵',
    close: '閉じる',
    save: '保存',
    clear: '消去',
    cancel: 'キャンセル',
    send: '送信',
    sending: '送信中…',
    thinking: 'プロバイダー待ち…',
    clearConversation: 'クリア',
    model: 'モデル',
    temperature: 'Temperature',
    maxTokens: 'Max tokens',
    forecastDays: 'Forecast days',
    prompt: 'リクエストまたはプロンプト',
    promptPlaceholder: 'テスト内容を入力…',
    response: 'レスポンス',
    rendered: '表示',
    json: 'JSON',
    request: 'リクエスト',
    logs: 'ログ',
    noResponse: 'まだレスポンスはありません。送信するとレイテンシ、ヘッダー、生JSONを確認できます。',
    noHistory: '履歴はまだありません。',
    copy: 'コピー',
    copied: 'コピー済み',
    keyNeeded: '鍵が必要',
    ready: '準備完了',
    anonymous: '匿名',
    optionalKey: '任意の鍵',
    rateLimited: 'レート制限',
    status: '状態',
    latency: 'レイテンシ',
    endpoint: 'エンドポイント',
    requestSize: 'リクエストサイズ',
    responseSize: 'レスポンスサイズ',
    warnings: '注意',
    providerDocs: 'ドキュメント',
    providerNote: 'プロバイダーメモ',
    rateHint: 'レート目安',
    sessionKeys: 'セッション鍵のみ',
    sessionKeysHelp: '共有端末では localStorage ではなく sessionStorage を使えます。',
    clearAllKeys: 'プレイグラウンドの鍵をすべて消去',
    savedKey: '保存済み',
    enterKey: '鍵を入力',
    keyWarning: 'クライアント側の鍵は便利ですが共有端末では注意。必要ならセッション鍵のみを使ってください。',
    imageComingSoon: '画像APIは、ブラウザ安全でCAPTCHA不要のプロバイダー確認まで保留です。',
    utilityComingSoon: 'ユーティリティAPIは次段階です。CORS対応プロバイダーを追加できます。',
    geocodeHint: 'Open-Meteoは緯度経度または都市名を受け付け、都市名はブラウザ内で地理コード化します。',
    noKeyHint: 'このプロバイダーは鍵不要です。',
    abortHint: 'キャンセルしました。キャンセル後の送信はありません。',
  },
};

export interface PlaygroundOptions {
  lang: Lang;
  container: HTMLElement;
}

export function renderPlayground({ lang, container }: PlaygroundOptions): void {
  const copy = COPY[lang];
  const state: PlaygroundUiState = {
    selectedProviderId: 'groq',
    selectedMode: 'chat',
    selectedModel: 'llama-3.3-70b-versatile',
    activeTab: 'rendered',
    keyMode: 'persistent',
    keysPanelOpen: false,
    messages: [],
    history: [],
    settings: getDefaultSettings(),
    activeRequest: false,
  };

  container.innerHTML = '';

  const root = document.createElement('div');
  root.className = 'pg-shell';
  root.innerHTML = `
    <header class="pg-header">
      <div class="pg-header-row">
        <div>
          <p class="pg-eyebrow">LOCAL-FIRST API LAB</p>
          <h3 class="pg-title"></h3>
          <p class="pg-subtitle"></p>
        </div>
        <div class="pg-header-actions">
          <button class="pg-button pg-button-secondary" type="button" data-action="keys"></button>
        </div>
      </div>
      <p class="pg-privacy"></p>
    </header>

    <nav class="pg-mode-tabs" aria-label="API categories"></nav>

    <div class="pg-layout">
      <aside class="pg-sidebar" aria-label="API providers">
        <div class="pg-sidebar-head">
          <div>
            <span class="pg-sidebar-title"></span>
            <span class="pg-sidebar-count"></span>
          </div>
        </div>
        <div class="pg-provider-list" data-role="providers"></div>
      </aside>

      <main class="pg-workspace">
        <section class="pg-provider-summary" data-role="summary"></section>
        <section class="pg-composer-panel">
          <div class="pg-messages" data-role="messages"></div>
          <label class="pg-field-label" for="pg-composer"></label>
          <textarea id="pg-composer" class="pg-textarea" rows="5"></textarea>
          <div class="pg-settings">
            <label class="pg-setting">
              <span class="pg-setting-label"></span>
              <select class="pg-select" data-setting="model"></select>
            </label>
            <label class="pg-setting">
              <span class="pg-setting-label"></span>
              <input class="pg-number" data-setting="temperature" type="number" min="0" max="2" step="0.1">
            </label>
            <label class="pg-setting">
              <span class="pg-setting-label"></span>
              <input class="pg-number" data-setting="maxTokens" type="number" min="64" max="8192" step="64">
            </label>
            <label class="pg-setting pg-weather-setting">
              <span class="pg-setting-label"></span>
              <input class="pg-number" data-setting="forecastDays" type="number" min="1" max="16" step="1">
            </label>
          </div>
          <div class="pg-actions">
            <button class="pg-button pg-button-primary" type="button" data-action="send"></button>
            <button class="pg-button pg-button-secondary" type="button" data-action="cancel"></button>
            <button class="pg-button pg-button-ghost" type="button" data-action="clear"></button>
          </div>
        </section>

        <section class="pg-response-panel">
          <div class="pg-response-head">
            <h4 class="pg-response-title"></h4>
            <div class="pg-tab-list" data-role="tabs"></div>
          </div>
          <div class="pg-response-body" data-role="response"></div>
        </section>

        <section class="pg-history-panel">
          <div class="pg-history-head">
            <h4>History</h4>
            <span data-role="history-count"></span>
          </div>
          <div class="pg-history-list" data-role="history"></div>
        </section>
      </main>
    </div>

    <section class="pg-keys-panel" data-role="keys-panel" hidden></section>
  `;

  container.appendChild(root);

  root.querySelector<HTMLElement>('.pg-title')!.textContent = copy.title;
  root.querySelector<HTMLElement>('.pg-subtitle')!.textContent = copy.subtitle;
  root.querySelector<HTMLElement>('.pg-privacy')!.textContent = copy.privacy;
  root.querySelector<HTMLButtonElement>('[data-action="keys"]')!.textContent = copy.keys;
  root.querySelector<HTMLLabelElement>('label[for="pg-composer"]')!.textContent = copy.prompt;
  root.querySelector<HTMLTextAreaElement>('#pg-composer')!.placeholder = copy.promptPlaceholder;
  root.querySelector<HTMLElement>('.pg-response-title')!.textContent = copy.response;
  root.querySelector<HTMLButtonElement>('[data-action="send"]')!.textContent = copy.send;
  root.querySelector<HTMLButtonElement>('[data-action="cancel"]')!.textContent = copy.cancel;
  root.querySelector<HTMLButtonElement>('[data-action="clear"]')!.textContent = copy.clearConversation;
  root.querySelector<HTMLElement>('.pg-sidebar-title')!.textContent = copy.providers;

  const settingLabels = root.querySelectorAll<HTMLElement>('.pg-setting-label');
  settingLabels[0].textContent = copy.model;
  settingLabels[1].textContent = copy.temperature;
  settingLabels[2].textContent = copy.maxTokens;
  settingLabels[3].textContent = copy.forecastDays;

  root.querySelector<HTMLButtonElement>('[data-action="keys"]')!.addEventListener('click', () => {
    state.keysPanelOpen = !state.keysPanelOpen;
    renderKeysPanel();
  });

  root.querySelector<HTMLButtonElement>('[data-action="send"]')!.addEventListener('click', () => {
    void sendCurrentRequest();
  });

  root.querySelector<HTMLButtonElement>('[data-action="cancel"]')!.addEventListener('click', () => {
    state.abortController?.abort();
  });

  root.querySelector<HTMLButtonElement>('[data-action="clear"]')!.addEventListener('click', () => {
    state.messages = [];
    state.response = undefined;
    const composer = root.querySelector<HTMLTextAreaElement>('#pg-composer');
    if (composer) composer.value = '';
    renderWorkspace();
    renderHistory();
  });

  root.querySelector<HTMLTextAreaElement>('#pg-composer')!.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      void sendCurrentRequest();
    }
  });

  renderAll();

  function renderAll(): void {
    renderModes();
    renderProviderList();
    renderWorkspace();
    renderHistory();
    renderKeysPanel();
  }

  function renderModes(): void {
    const tabs = root.querySelector<HTMLElement>('.pg-mode-tabs')!;
    tabs.innerHTML = '';
    MODES.forEach((mode) => {
      const tab = document.createElement('button');
      tab.type = 'button';
      tab.className = `pg-mode-tab${state.selectedMode === mode ? ' active' : ''}`;
      tab.textContent = PLAYGROUND_CATEGORY_LABELS[mode];
      tab.addEventListener('click', () => {
        state.selectedMode = mode;
        const providers = getProvidersByMode(mode);
        if (providers[0] && providers[0].id !== state.selectedProviderId) {
          state.selectedProviderId = providers[0].id;
        }
        state.activeTab = 'rendered';
        renderAll();
      });
      tabs.appendChild(tab);
    });
  }

  function renderProviderList(): void {
    const list = root.querySelector<HTMLElement>('[data-role="providers"]')!;
    const count = root.querySelector<HTMLElement>('.pg-sidebar-count')!;
    const providers = getProvidersByMode(state.selectedMode);
    list.innerHTML = '';
    count.textContent = `${providers.length}`;

    if (providers.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'pg-empty-state';
      empty.textContent =
        state.selectedMode === 'image' ? copy.imageComingSoon : copy.utilityComingSoon;
      list.appendChild(empty);
      return;
    }

    providers.forEach((provider) => {
      const hasKey = hasPlaygroundKey(provider.id, state.keyMode);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `pg-provider-button${provider.id === state.selectedProviderId ? ' active' : ''}`;
      button.style.setProperty('--provider-color', provider.color);
      button.innerHTML = `
        <span class="pg-provider-icon">${escapeHtml(provider.icon)}</span>
        <span class="pg-provider-copy">
          <span class="pg-provider-name"></span>
          <span class="pg-provider-desc"></span>
          <span class="pg-provider-meta">
            <span class="pg-status-pill ${statusClass(provider, hasKey)}"></span>
            <span class="pg-provider-rate"></span>
          </span>
        </span>
      `;
      button.querySelector<HTMLElement>('.pg-provider-name')!.textContent = provider.name;
      button.querySelector<HTMLElement>('.pg-provider-desc')!.textContent = provider.description;
      button.querySelector<HTMLElement>('.pg-status-pill')!.textContent = providerStatus(provider, hasKey);
      button.querySelector<HTMLElement>('.pg-provider-rate')!.textContent = provider.rateLimitHint;
      button.addEventListener('click', () => {
        state.selectedProviderId = provider.id;
        state.selectedMode = provider.category;
        state.activeTab = 'rendered';
        state.response = undefined;
        renderAll();
      });
      list.appendChild(button);
    });
  }

  function renderWorkspace(): void {
    const providers = getProvidersByMode(state.selectedMode);
    if (providers.length === 0) {
      renderEmptyWorkspace();
      return;
    }

    const provider = getProviderById(state.selectedProviderId) || providers[0];
    if (!providers.some((item) => item.id === provider.id)) {
      state.selectedProviderId = providers[0].id;
      renderWorkspace();
      return;
    }

    state.selectedProviderId = provider.id;
    if (!provider.models.includes(state.selectedModel)) {
      state.selectedModel = provider.defaultModel;
    }

    const summary = root.querySelector<HTMLElement>('[data-role="summary"]')!;
    const hasKey = hasPlaygroundKey(provider.id, state.keyMode);
    summary.innerHTML = `
      <div class="pg-summary-main">
        <span class="pg-summary-icon">${escapeHtml(provider.icon)}</span>
        <div>
          <div class="pg-summary-title"></div>
          <p class="pg-summary-desc"></p>
          <div class="pg-summary-pills">
            <span class="pg-status-pill ${statusClass(provider, hasKey)}"></span>
            <span class="pg-chip"></span>
          </div>
        </div>
      </div>
      <div class="pg-summary-actions">
        <a class="pg-link" href="${provider.docsUrl}" target="_blank" rel="noopener"></a>
        ${provider.keyUrl ? `<a class="pg-link" href="${provider.keyUrl}" target="_blank" rel="noopener">${copy.keys}</a>` : ''}
      </div>
      <div class="pg-provider-note"></div>
    `;
    summary.querySelector<HTMLElement>('.pg-summary-title')!.textContent = provider.name;
    summary.querySelector<HTMLElement>('.pg-summary-desc')!.textContent = provider.description;
    summary.querySelector<HTMLElement>('.pg-status-pill')!.textContent = providerStatus(provider, hasKey);
    summary.querySelector<HTMLElement>('.pg-chip')!.textContent = provider.rateLimitHint;
    const docsLink = summary.querySelector<HTMLAnchorElement>('a[href="' + provider.docsUrl + '"]');
    if (docsLink) docsLink.textContent = copy.providerDocs;
    summary.querySelector<HTMLElement>('.pg-provider-note')!.textContent = provider.note;

    renderModelAndSettings(provider);
    renderMessages(provider);
    renderResponse();
  }

  function renderEmptyWorkspace(): void {
    const summary = root.querySelector<HTMLElement>('[data-role="summary"]')!;
    summary.innerHTML = `
      <div class="pg-empty-state">
        <strong>${escapeHtml(state.selectedMode === 'image' ? PLAYGROUND_CATEGORY_LABELS.image : PLAYGROUND_CATEGORY_LABELS.utility)}</strong>
        <span>${escapeHtml(state.selectedMode === 'image' ? copy.imageComingSoon : copy.utilityComingSoon)}</span>
      </div>
    `;
    renderModelAndSettings(undefined);
    renderMessages(undefined);
    renderResponse();
  }

  function renderModelAndSettings(provider: ReturnType<typeof getProviderById>): void {
    const modelSelect = root.querySelector<HTMLSelectElement>('[data-setting="model"]')!;
    const temperature = root.querySelector<HTMLInputElement>('[data-setting="temperature"]')!;
    const maxTokens = root.querySelector<HTMLInputElement>('[data-setting="maxTokens"]')!;
    const forecastDays = root.querySelector<HTMLInputElement>('[data-setting="forecastDays"]')!;
    const weatherSetting = root.querySelector<HTMLElement>('.pg-weather-setting')!;

    modelSelect.innerHTML = '';
    if (provider) {
      provider.models.forEach((model) => {
        const option = document.createElement('option');
        option.value = model;
        option.textContent = model;
        modelSelect.appendChild(option);
      });
      modelSelect.value = state.selectedModel;
      modelSelect.disabled = false;
      weatherSetting.hidden = provider.id !== 'open-meteo';
    } else {
      const option = document.createElement('option');
      option.value = 'none';
      option.textContent = 'No model';
      modelSelect.appendChild(option);
      modelSelect.value = 'none';
      modelSelect.disabled = true;
      weatherSetting.hidden = false;
    }

    temperature.value = String(state.settings.temperature);
    maxTokens.value = String(state.settings.maxTokens);
    forecastDays.value = String(state.settings.forecastDays);

    modelSelect.onchange = () => {
      if (provider && modelSelect.value) state.selectedModel = modelSelect.value;
    };
    temperature.onchange = () => {
      state.settings.temperature = clamp(Number(temperature.value), 0, 2);
    };
    maxTokens.onchange = () => {
      state.settings.maxTokens = clamp(Number(maxTokens.value), 64, 8192);
    };
    forecastDays.onchange = () => {
      state.settings.forecastDays = clamp(Number(forecastDays.value), 1, 16);
    };
  }

  function renderMessages(provider: ReturnType<typeof getProviderById>): void {
    const messages = root.querySelector<HTMLElement>('[data-role="messages"]')!;
    messages.innerHTML = '';
    if (state.messages.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'pg-message-empty';
      empty.textContent = provider?.id === 'open-meteo' ? copy.geocodeHint : provider?.note || copy.noKeyHint;
      messages.appendChild(empty);
      return;
    }

    state.messages.forEach((message) => {
      const item = document.createElement('div');
      item.className = `pg-message ${message.role}`;
      item.innerHTML = `<strong></strong><p></p>`;
      item.querySelector('strong')!.textContent = message.role;
      item.querySelector('p')!.textContent = message.content;
      messages.appendChild(item);
    });
  }

  function renderResponse(): void {
    renderTabs();
    const body = root.querySelector<HTMLElement>('[data-role="response"]')!;
    body.innerHTML = '';

    if (!state.response) {
      const empty = document.createElement('div');
      empty.className = 'pg-empty-state';
      empty.textContent = copy.noResponse;
      body.appendChild(empty);
      return;
    }

    if (state.response instanceof PlaygroundError) {
      renderError(body, state.response);
      return;
    }

    const result = state.response;
    if (state.activeTab === 'rendered') {
      const rendered = document.createElement('div');
      rendered.className = 'pg-rendered';
      rendered.innerHTML = result.renderedHtml || escapeHtml(result.renderedText);
      body.appendChild(rendered);
      return;
    }

    if (state.activeTab === 'json') {
      const pre = document.createElement('pre');
      pre.className = 'pg-pre';
      pre.textContent = JSON.stringify(result.json ?? result.renderedText, null, 2);
      const copyButton = buttonWithCopy(JSON.stringify(result.json ?? result.renderedText, null, 2), body);
      body.append(copyButton, pre);
      return;
    }

    if (state.activeTab === 'request') {
      const preview = {
        url: result.request.url,
        method: result.request.method,
        headers: result.request.redactedHeaders,
        body: result.request.redactedBody,
      };
      const pre = document.createElement('pre');
      pre.className = 'pg-pre';
      pre.textContent = JSON.stringify(preview, null, 2);
      const copyButton = buttonWithCopy(JSON.stringify(preview, null, 2), body);
      body.append(copyButton, renderMetadata(result), pre);
      return;
    }

    const logs = [
      `Provider: ${result.providerName}`,
      `Model: ${result.model}`,
      `Status: ${result.status}`,
      `Latency: ${formatMs(result.latencyMs)}`,
      `Endpoint: ${result.endpoint}`,
      `Request size: ${formatBytes(result.execution.requestSizeBytes)}`,
      `Response size: ${formatBytes(result.execution.responseSizeBytes)}`,
      'Warnings:',
      ...result.warnings.map((warning) => `- ${warning}`),
    ].join('\n');
    const pre = document.createElement('pre');
    pre.className = 'pg-pre';
    pre.textContent = logs;
    const copyButton = buttonWithCopy(logs, body);
    body.append(copyButton, renderMetadata(result), pre);
  }

  function renderTabs(): void {
    const tabs = root.querySelector<HTMLElement>('[data-role="tabs"]')!;
    tabs.innerHTML = '';
    const tabCopy: Record<PlaygroundResponseTab, string> = {
      rendered: copy.rendered,
      json: copy.json,
      request: copy.request,
      logs: copy.logs,
    };
    RESPONSE_TABS.forEach((tab) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `pg-tab-button${state.activeTab === tab ? ' active' : ''}`;
      button.textContent = tabCopy[tab];
      button.addEventListener('click', () => {
        state.activeTab = tab;
        renderResponse();
      });
      tabs.appendChild(button);
    });
  }

  function renderError(body: HTMLElement, error: PlaygroundError): void {
    const errorBlock = document.createElement('div');
    errorBlock.className = 'pg-error-card';
    errorBlock.innerHTML = `
      <strong></strong>
      <p></p>
      ${error.status ? `<span></span>` : ''}
    `;
    errorBlock.querySelector('strong')!.textContent = error.code;
    errorBlock.querySelector('p')!.textContent = error.friendlyMessage || error.message;
    const status = errorBlock.querySelector('span');
    if (status) status.textContent = error.status ? `HTTP ${error.status}` : '';
    body.appendChild(errorBlock);

    if (error.code === 'NO_KEY') {
      const keysButton = document.createElement('button');
      keysButton.type = 'button';
      keysButton.className = 'pg-button pg-button-secondary pg-small-button';
      keysButton.textContent = copy.keys;
      keysButton.addEventListener('click', () => {
        state.keysPanelOpen = true;
        renderKeysPanel();
      });
      errorBlock.appendChild(keysButton);
    }
  }

  function renderMetadata(result: PlaygroundResult): HTMLElement {
    const meta = document.createElement('div');
    meta.className = 'pg-meta-grid';
    const rows: Array<[string, string]> = [
      [copy.providerDocs, result.providerName],
      [copy.model, result.model],
      [copy.latency, formatMs(result.latencyMs)],
      [copy.endpoint, result.endpoint],
      [copy.requestSize, formatBytes(result.execution.requestSizeBytes)],
      [copy.responseSize, formatBytes(result.execution.responseSizeBytes)],
    ];
    rows.forEach(([label, value]) => {
      const row = document.createElement('div');
      row.className = 'pg-meta-row';
      row.innerHTML = `<span></span><strong></strong>`;
      row.querySelector('span')!.textContent = label;
      row.querySelector('strong')!.textContent = value;
      meta.appendChild(row);
    });
    return meta;
  }

  function buttonWithCopy(text: string, parent: HTMLElement): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'pg-button pg-button-ghost pg-small-button';
    button.textContent = copy.copy;
    button.addEventListener('click', async () => {
      const copied = await copyText(text);
      button.textContent = copied ? copy.copied : copy.copy;
      setTimeout(() => {
        button.textContent = copy.copy;
      }, 1500);
    });
    parent.appendChild(button);
    return button;
  }

  function renderHistory(): void {
    const list = root.querySelector<HTMLElement>('[data-role="history"]')!;
    const count = root.querySelector<HTMLElement>('[data-role="history-count"]')!;
    list.innerHTML = '';
    count.textContent = `${state.history.length}`;

    if (state.history.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'pg-history-empty';
      empty.textContent = copy.noHistory;
      list.appendChild(empty);
      return;
    }

    state.history.slice(0, 6).forEach((item) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'pg-history-item';
      button.innerHTML = `
        <strong></strong>
        <span></span>
        <small></small>
      `;
      button.querySelector('strong')!.textContent = item.summary;
      button.querySelector('span')!.textContent = `${item.model} · ${formatMs(item.latencyMs)}`;
      button.querySelector('small')!.textContent = new Date(item.createdAt).toLocaleTimeString();
      button.addEventListener('click', () => {
        state.selectedProviderId = item.providerId;
        state.selectedMode = getProviderById(item.providerId)?.category || 'chat';
        renderAll();
      });
      list.appendChild(button);
    });
  }

  function renderKeysPanel(): void {
    const panel = root.querySelector<HTMLElement>('[data-role="keys-panel"]')!;
    panel.hidden = !state.keysPanelOpen;
    panel.innerHTML = '';

    if (!state.keysPanelOpen) return;

    panel.innerHTML = `
      <div class="pg-keys-head">
        <div>
          <strong>${escapeHtml(copy.keys)}</strong>
          <span>${escapeHtml(copy.keyWarning)}</span>
        </div>
        <button class="pg-icon-button" type="button" data-action="close-keys">${escapeHtml(copy.close)}</button>
      </div>
      <div class="pg-keys-body"></div>
    `;
    panel.querySelector<HTMLButtonElement>('[data-action="close-keys"]')!.addEventListener('click', () => {
      state.keysPanelOpen = false;
      renderKeysPanel();
    });

    const body = panel.querySelector<HTMLElement>('.pg-keys-body')!;
    const sessionToggle = document.createElement('label');
    sessionToggle.className = 'pg-toggle-row';
    sessionToggle.innerHTML = `
      <input type="checkbox" data-action="session-toggle">
      <span>
        <strong></strong>
        <small></small>
      </span>
    `;
    sessionToggle.querySelector('strong')!.textContent = copy.sessionKeys;
    sessionToggle.querySelector('small')!.textContent = copy.sessionKeysHelp;
    const checkbox = sessionToggle.querySelector<HTMLInputElement>('input')!;
    checkbox.checked = state.keyMode === 'session';
    checkbox.addEventListener('change', () => {
      state.keyMode = checkbox.checked ? 'session' : 'persistent';
      renderKeysPanel();
      renderProviderList();
      renderWorkspace();
    });
    body.appendChild(sessionToggle);

    PLAYGROUND_PROVIDERS.filter((provider) => provider.authMode === 'required').forEach((provider) => {
      const row = document.createElement('div');
      row.className = 'pg-key-row';
      row.innerHTML = `
        <label>
          <span></span>
          <input type="password" data-key="${provider.id}" autocomplete="off">
        </label>
        <a href="${provider.keyUrl}" target="_blank" rel="noopener"></a>
      `;
      row.querySelector('span')!.textContent = provider.name;
      const input = row.querySelector<HTMLInputElement>(`[data-key="${provider.id}"]`)!;
      const mask = getSavedKeyMask(provider.id, state.keyMode);
      input.placeholder = mask ? `${copy.savedKey} ${mask}` : copy.enterKey;
      row.querySelector('a')!.textContent = copy.providerDocs;
      body.appendChild(row);
    });

    const actions = document.createElement('div');
    actions.className = 'pg-key-actions';
    const save = document.createElement('button');
    save.type = 'button';
    save.className = 'pg-button pg-button-primary';
    save.textContent = copy.save;
    const clear = document.createElement('button');
    clear.type = 'button';
    clear.className = 'pg-button pg-button-danger';
    clear.textContent = copy.clearAllKeys;

    save.addEventListener('click', () => {
      PLAYGROUND_PROVIDERS.filter((provider) => provider.authMode === 'required').forEach((provider) => {
        const input = body.querySelector<HTMLInputElement>(`[data-key="${provider.id}"]`);
        if (input?.value) setPlaygroundKey(provider.id, input.value, state.keyMode);
      });
      renderKeysPanel();
      renderProviderList();
      renderWorkspace();
    });

    clear.addEventListener('click', () => {
      clearAllPlaygroundKeys(state.keyMode);
      renderKeysPanel();
      renderProviderList();
      renderWorkspace();
    });

    actions.append(save, clear);
    body.appendChild(actions);
  }

  async function sendCurrentRequest(): Promise<void> {
    const provider = getProviderById(state.selectedProviderId);
    const composer = root.querySelector<HTMLTextAreaElement>('#pg-composer');
    if (!provider || !composer || state.activeRequest) return;

    const input = composer.value.trim();
    if (!input) return;

    const messages: PlaygroundChatMessage[] = [
      ...state.messages,
      { role: 'user', content: input },
    ];
    state.messages = messages;
    state.activeRequest = true;
    state.abortController = new AbortController();
    composer.value = '';
    renderMessages(provider);
    renderResponse();

    try {
      const options: PlaygroundSendOptions = {
        providerId: provider.id,
        input,
        messages,
        model: provider.models.includes(state.selectedModel) ? state.selectedModel : provider.defaultModel,
        settings: state.settings,
        keyMode: state.keyMode,
        signal: state.abortController.signal,
      };
      const result = await sendPlaygroundRequest(options);
      state.response = result;
      state.history = [
        {
          id: `${Date.now()}-${provider.id}`,
          providerId: provider.id,
          model: result.model,
          latencyMs: result.latencyMs,
          status: result.status,
          createdAt: Date.now(),
          summary: result.renderedText.slice(0, 80),
        },
        ...state.history,
      ].slice(0, 10);
    } catch (error: unknown) {
      state.response =
        error instanceof PlaygroundError
          ? error
          : new PlaygroundError(error instanceof Error ? error.message : String(error), {
              code: 'PROVIDER_ERROR',
              friendlyMessage: error instanceof Error ? error.message : String(error),
              providerId: provider.id,
            });
    } finally {
      state.activeRequest = false;
      state.abortController = undefined;
      renderWorkspace();
      renderHistory();
    }
  }
}

function statusClass(provider: ReturnType<typeof getProviderById>, hasKey: boolean): string {
  const status = providerStatus(provider!, hasKey);
  if (status === 'Ready') return 'pg-status-ready';
  if (status === 'Anonymous') return 'pg-status-anonymous';
  if (status === 'Optional key') return 'pg-status-optional';
  return 'pg-status-key';
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}
