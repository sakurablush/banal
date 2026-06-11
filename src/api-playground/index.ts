/**
 * Banal AI — API Playground UI
 * Renders a compact "try it yourself" panel for free APIs.
 */

import {
  getProvidersByCategory,
  PLAYGROUND_PROVIDERS,
  type PlaygroundProvider,
  type PlaygroundCategory,
} from './providers';
import type { Lang } from '../i18n';

const COPY = {
  en: {
    title: 'API Playground',
    subtitle: 'Test free APIs directly. No signup required for some.',
    selectProvider: 'Choose an API',
    input: 'Your request…',
    send: 'Send',
    sending: 'Sending…',
    response: 'Response',
    copy: 'Copy',
    copied: 'Copied!',
    requiresKey: 'Requires free key',
    noKey: 'No key needed',
    error: 'Error',
    latency: 'Latency',
    categories: {
      chat: 'Chat',
      image: 'Image',
      search: 'Search',
      data: 'Data',
    } as Record<PlaygroundCategory, string>,
  },
  ja: {
    title: 'API プレイグラウンド',
    subtitle: '無料APIを直接テスト。不要なものはサインアップ不要。',
    selectProvider: 'APIを選択',
    input: 'リクエスト内容…',
    send: '送信',
    sending: '送信中…',
    response: 'レスポンス',
    copy: 'コピー',
    copied: 'コピーしました！',
    requiresKey: '無料キーが必要',
    noKey: 'キー不要',
    error: 'エラー',
    latency: 'レイテンシ',
    categories: {
      chat: 'チャット',
      image: '画像',
      search: '検索',
      data: 'データ',
    } as Record<PlaygroundCategory, string>,
  },
};

export interface PlaygroundOptions {
  lang: Lang;
  container: HTMLElement;
}

export function renderPlayground({ lang, container }: PlaygroundOptions): void {
  const copy = COPY[lang];
  const grouped = getProvidersByCategory();

  container.innerHTML = '';

  // Header
  const header = document.createElement('div');
  header.className = 'pg-header';
  header.innerHTML = `
    <h3 class="pg-title">${copy.title}</h3>
    <p class="pg-subtitle">${copy.subtitle}</p>
  `;
  container.appendChild(header);

  // Category tabs
  const tabs = document.createElement('div');
  tabs.className = 'pg-tabs';
  const categories = Object.keys(grouped) as PlaygroundCategory[];
  categories.forEach((cat, idx) => {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = `pg-tab${idx === 0 ? ' active' : ''}`;
    tab.textContent = copy.categories[cat];
    tab.addEventListener('click', () => {
      tabs.querySelectorAll('.pg-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      renderProviderList(grouped[cat]);
    });
    tabs.appendChild(tab);
  });
  container.appendChild(tabs);

  // Provider list
  const list = document.createElement('div');
  list.className = 'pg-providers';
  container.appendChild(list);

  function renderProviderList(providers: PlaygroundProvider[]): void {
    list.innerHTML = '';
    providers.forEach((provider) => {
      const card = document.createElement('div');
      card.className = 'pg-card';
      card.innerHTML = `
        <div class="pg-card-header">
          <span class="pg-icon">${provider.icon}</span>
          <div>
            <div class="pg-name">${provider.name}</div>
            <div class="pg-desc">${provider.description}</div>
          </div>
        </div>
        <div class="pg-meta">
          <span class="pg-limit">${provider.rateLimit}</span>
          ${
            provider.requiresKey
              ? `<a href="${provider.keyUrl}" target="_blank" rel="noopener" class="pg-key-link">${copy.requiresKey} ↗</a>`
              : `<span class="pg-free">${copy.noKey}</span>`
          }
        </div>
        <div class="pg-form">
          <textarea
            class="pg-input"
            placeholder="${provider.inputPlaceholder}"
            rows="3"
          ></textarea>
          <button type="button" class="pg-send" data-provider="${provider.id}">
            ${copy.send}
          </button>
        </div>
        <div class="pg-output" data-output="${provider.id}"></div>
      `;
      list.appendChild(card);
    });

    // Wire send buttons
    list.querySelectorAll<HTMLButtonElement>('.pg-send').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const providerId = btn.getAttribute('data-provider') as string;
        const provider = PLAYGROUND_PROVIDERS.find((p) => p.id === providerId);
        if (!provider) return;

        const textarea = btn.parentElement?.querySelector('.pg-input') as HTMLTextAreaElement;
        const output = list.querySelector(`[data-output="${providerId}"]`) as HTMLElement;
        const inputValue = textarea?.value?.trim();

        if (!inputValue) return;

        btn.disabled = true;
        btn.textContent = copy.sending;
        output.innerHTML = '<div class="pg-loading">⏳</div>';

        const start = performance.now();

        try {
          const result = await callProvider(provider, inputValue);
          const latency = Math.round(performance.now() - start);

          output.innerHTML = `
            <div class="pg-result">
              <div class="pg-result-meta">
                <span>${copy.latency}: ${latency}ms</span>
                <button class="pg-copy" type="button">${copy.copy}</button>
              </div>
              <pre class="pg-response">${escapeHtml(result)}</pre>
            </div>
          `;

          output.querySelector('.pg-copy')?.addEventListener('click', () => {
            navigator.clipboard.writeText(result);
            const copyBtn = output.querySelector('.pg-copy');
            if (copyBtn) copyBtn.textContent = copy.copied;
            setTimeout(() => {
              if (copyBtn) copyBtn.textContent = copy.copy;
            }, 2000);
          });
        } catch (err) {
          output.innerHTML = `
            <div class="pg-error">
              ${copy.error}: ${err instanceof Error ? err.message : 'Unknown error'}
            </div>
          `;
        } finally {
          btn.disabled = false;
          btn.textContent = copy.send;
        }
      });
    });
  }

  renderProviderList(grouped[categories[0]]);
}

async function callProvider(provider: PlaygroundProvider, input: string): Promise<string> {
  const url = new URL(provider.endpoint);

  // For GET requests with bodyTemplate returning query params
  if (provider.method === 'GET' && provider.bodyTemplate) {
    const params = provider.bodyTemplate(input);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && key !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const options: RequestInit = {
    method: provider.method,
    headers: {
      ...provider.headers,
    },
  };

  if (provider.method === 'POST' && provider.bodyTemplate) {
    options.body = JSON.stringify(provider.bodyTemplate(input));
  }

  const response = await fetch(url.toString(), options);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text.slice(0, 200)}`);
  }

  // For image generation (GET returning image)
  if (provider.category === 'image' && provider.method === 'GET') {
    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);
    return `<img src="${imageUrl}" alt="Generated image" style="max-width: 100%; border-radius: 8px;" />`;
  }

  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const json = await response.json();
    return JSON.stringify(json, null, 2);
  }

  return await response.text();
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
