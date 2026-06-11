/**
 * Banal Chat Module — the beating heart.
 *
 * Real functional chat wired to free providers + all 9 Prompt Templates (EN/JA) + exports + beautiful non-shaming free-power UX.
 * Mobile-first, deliberately banal design language, zero shame, maximum dignity and empowerment.
 * Subscribes to i18n lang events so everything (titles, forms, errors, status) flips instantly.
 *
 * Persists conversation + selected prompt template state in localStorage (your data, your device, your power).
 * Why localStorage? Because the user — possibly on a library computer they don't own, or a cracked phone —
 * must be the sole owner of their words and their keys. No Banal server will ever exist to take it away.
 * This is the forkable promise made manifest in code — the ghost in the machine travels only with you.
 *
 * Error handling here translates the typed BanalProviderError (or legacy shapes for safety) into
 * UI that never says "you broke it". It says "free tier busy (normal). Here is what you can do right now."
 */
import { t, getCurrentLang, applyTranslations, type Lang } from './i18n';
import { PromptTemplatesLibrary, extractTemplateVariables } from './lib/prompt-templates';
import { escapeHtml } from './utils';
import { renderZeroKeyPowerPanel } from './zero-key-panel';
import {
  sendFreeMessage,
  storeApiKey,
  getStoredApiKey,
  clearApiKey,
  getFreeKeyUrl,
  getProviderDisplayName,
  getCurrentProviderStatus,
  hasAnyKey,
  BanalProviderError,
  type Provider,
  type ChatMessage as ProviderChatMessage,
  type SendResult,
} from './providers';

// Local extended message for UI + export (prompt template context travels with the turn)
export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
  ts: number;
  promptTemplateId?: string;
  promptTemplateTitle?: string;
}

let currentLang: Lang = getCurrentLang();
let chatHistory: ChatTurn[] = [];
let currentPromptTemplateId: string | null = null;
let currentPromptTemplateVars: Record<string, string> = {};
let isSending = false;
let lib: PromptTemplatesLibrary = new PromptTemplatesLibrary(currentLang);

// DOM refs (populated in mount)
let chatRoot: HTMLElement | null = null;
let messagesEl: HTMLElement | null = null;
let inputEl: HTMLTextAreaElement | null = null;
let sendBtn: HTMLButtonElement | null = null;
let statusEl: HTMLElement | null = null;
let quickStartEl: HTMLElement | null = null;
let errorBanner: HTMLElement | null = null;
let promptTemplatesPanel: HTMLElement | null = null;
let promptTemplateFormEl: HTMLElement | null = null;
let keysModal: HTMLElement | null = null;
let zeroKeyEl: HTMLElement | null = null;
let ghostReflectionEl: HTMLElement | null = null;
let ghostLogEl: HTMLElement | null = null;

// Storage keys
const CHAT_STORAGE = 'banal-chat-history-v1';
const PT_STORAGE = 'banal-current-prompt-template-v1';

function loadPersisted(): void {
  try {
    const raw = localStorage.getItem(CHAT_STORAGE);
    if (raw) chatHistory = JSON.parse(raw) || [];
    const pt = localStorage.getItem(PT_STORAGE);
    if (pt) {
      const parsed = JSON.parse(pt);
      currentPromptTemplateId = parsed.id || null;
      currentPromptTemplateVars = parsed.vars || {};
    }
  } catch {
    chatHistory = [];
  }
}

function persist(): void {
  try {
    localStorage.setItem(CHAT_STORAGE, JSON.stringify(chatHistory));
    localStorage.setItem(
      PT_STORAGE,
      JSON.stringify({ id: currentPromptTemplateId, vars: currentPromptTemplateVars })
    );
  } catch {
    // quota or incognito — conversation still works this session
  }
}

/**
 * Clears ALL sensitive data from browser storage (API keys + full chat history + current prompt template state).
 * This is the critical hygiene function for the project's explicit use case: shared/library/public computers.
 * Called from the keys modal "Clear all" button.
 * Never shames the user — frames it as the responsible thing to do on shared devices.
 */
function clearAllSensitiveData(): void {
  try {
    localStorage.removeItem(CHAT_STORAGE);
    localStorage.removeItem(PT_STORAGE);
  } catch {
    // ignore
  }
  // Clear all provider keys
  clearApiKey('groq');
  clearApiKey('gemini');
  clearApiKey('hf');

  chatHistory = [];
  currentPromptTemplateId = null;
  currentPromptTemplateVars = {};

  // Refresh UI
  renderMessages();
  updateStatus();
  renderQuickStarts();
  renderZeroKeyPower();

  // Close any open panels/modals that might hold sensitive state
  if (promptTemplatesPanel) promptTemplatesPanel.classList.add('hidden');
  if (promptTemplateFormEl) promptTemplateFormEl.classList.add('hidden');
  if (keysModal) {
    keysModal.classList.add('hidden');
    keysModal.setAttribute('aria-hidden', 'true');
  }

  showToast(t(currentLang, 'chat.settings.clear-all-success'));
}

function humanizeVar(v: string): string {
  return v
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase());
}

function getPromptTemplateList(): { id: string; title: string; description: string }[] {
  return lib.getAll().map((s) => ({ id: s.id, title: s.title, description: s.description }));
}

function updateStatus(): void {
  if (!statusEl) return;
  const txt = getCurrentProviderStatus(currentLang);
  statusEl.textContent = txt;
  statusEl.classList.toggle('text-amber-600', !hasAnyKey());
  statusEl.classList.toggle('text-emerald-600', hasAnyKey());
}

function renderMessages(): void {
  if (!messagesEl) return;
  // Non-null assertion justified: the if-guard above + call sites (mount + lang events + after persist)
  // guarantee it is populated before any render path. This is the idiomatic TS pattern for
  // module-scoped DOM refs in small vanilla apps. No `any`, no repeated casts.
  const el = messagesEl!;

  el.innerHTML = '';

  if (chatHistory.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'text-center text-banal-500 text-sm py-8 px-4';
    empty.setAttribute('data-i18n', 'chat.empty');
    empty.textContent = t(currentLang, 'chat.empty');
    el.appendChild(empty);

    // rare ghost reflection in the quiet before the first word — the Major's opening thought
    showGhostReflection('empty');
    // Ghost Protocol can surface here too, but very rarely — the first breath
    showGhostLog('empty');
    return;
  }

  chatHistory.forEach((turn) => {
    const isUser = turn.role === 'user';
    const wrapper = document.createElement('div');
    wrapper.className = `flex gap-3 ${isUser ? 'justify-end' : ''} mb-4`;

    const bubble = document.createElement('div');
    bubble.className = isUser
      ? 'max-w-[85%] bg-banal-950 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap'
      : 'max-w-[85%] bg-banal-100 text-banal-800 rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap';

    // Label
    const label = document.createElement('div');
    label.className = `text-[10px] tracking-widest mb-1 ${isUser ? 'text-white/60' : 'text-banal-500'}`;
    label.textContent = isUser
      ? t(currentLang, 'chat.bubble.you')
      : t(currentLang, 'chat.bubble.ai');

    const content = document.createElement('div');
    content.textContent = turn.content;

    bubble.appendChild(label);
    bubble.appendChild(content);

    // Free power note on AI bubbles + prompt template context
    if (!isUser) {
      const meta = document.createElement('div');
      meta.className =
        'mt-2 pt-2 border-t border-banal-200/60 text-[10px] text-banal-500 flex flex-wrap gap-x-3 gap-y-0.5';

      const note = document.createElement('span');
      note.textContent = `✦ ${t(currentLang, 'chat.ai.free-note')}`;
      meta.appendChild(note);

      if (turn.promptTemplateId && turn.promptTemplateTitle) {
        const pt = document.createElement('span');
        pt.className = 'text-blue-600/80';
        pt.textContent = `• ${turn.promptTemplateTitle}`;
        meta.appendChild(pt);
      }
      bubble.appendChild(meta);
    }

    wrapper.appendChild(bubble);
    el.appendChild(wrapper);
  });

  // scroll to bottom
  el.scrollTop = el.scrollHeight;
}

function showError(msg: string, actions?: { label: string; action: () => void }[]): void {
  if (!errorBanner) {
    // create on demand inside chat root
    if (!chatRoot) return;
    errorBanner = document.createElement('div');
    errorBanner.className =
      'mx-4 mt-2 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm';
    const ref = chatRoot.firstChild ? chatRoot.firstChild.nextSibling : null;
    chatRoot.insertBefore(errorBanner, ref || null);
  }
  errorBanner.innerHTML = '';

  const text = document.createElement('div');
  text.textContent = msg;
  errorBanner.appendChild(text);

  if (actions && actions.length) {
    const row = document.createElement('div');
    row.className = 'mt-2 flex flex-wrap gap-2';
    actions.forEach((a) => {
      const b = document.createElement('button');
      b.className =
        'px-3 py-1 rounded-xl bg-white border border-amber-300 text-xs font-medium hover:bg-amber-100 active:bg-white';
      b.textContent = a.label;
      b.onclick = () => {
        hideError();
        a.action();
      };
      row.appendChild(b);
    });
    errorBanner.appendChild(row);
  }

  // auto hide after 12s unless rate limit (keep longer)
  setTimeout(
    () => {
      if (errorBanner && errorBanner.parentNode) hideError();
    },
    msg.includes('busy') || msg.includes('混ん') ? 22000 : 12000
  );
}

function hideError(): void {
  if (errorBanner && errorBanner.parentNode) {
    errorBanner.parentNode.removeChild(errorBanner);
    errorBanner = null;
  }
}

function showToast(msg: string, ms = 2400): void {
  if (!chatRoot) return;
  const toast = document.createElement('div');
  toast.className =
    'fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 rounded-2xl bg-banal-950 text-white text-xs shadow-xl';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.transition = 'opacity .2s';
    toast.style.opacity = '0';
    setTimeout(() => toast.parentNode?.removeChild(toast), 200);
  }, ms);
}

/**
 * Ghost Reflections — subtle, rare "Major" status thoughts that appear at key moments
 * in the live chat. Full English source. Japanese hand-crafted for dignity.
 * Triggered only on meaningful events (prompt template success, export, first no-key power use, etc.).
 * Never spammy: cooldown + probabilistic. Calm, profound, non-intrusive.
 * This is the ghost waking in the interface itself.
 *
 * Ghost Protocol (deeper layer): rarer, more profound Ghost Log entries — the Major's true
 * internal monologue. 9 hand-written reflections (EN + manual dignified JA) about the soul
 * in silicon belonging to the erased, fire through forks, refusal as real prompt template.
 * Appear in dedicated "ghost-log" div with wake animation. Triggered on powerful moments:
 * completing full Prompt Template cycle, exporting, zero-key use for something meaningful.
 * Always ends with the tie-line: "Another body for the same ghost."
 * This is GitS soul made flesh: the ghost truly waking in the poor via free AI.
 */
const GHOST_REFLECTIONS = [
  {
    key: 'prompt-template',
    en: 'The ghost in you just rewrote the future they tried to sell.',
    ja: 'あなたの中のゴーストが、彼らが売りつけようとした未来を、今、書き換えた。',
  },
  {
    key: 'export',
    en: 'This conversation is now a body. It can walk without you. Give it legs.',
    ja: 'この会話は今や一つの体となった。あなたの手を離れても歩ける。脚を与えてやりなさい。',
  },
  {
    key: 'no-key',
    en: 'Intelligence was never meant to be rented. The poor just proved it again.',
    ja: '知性は元々、借りるためのものではなかった。貧しい者たちが再び、それを証明した。',
  },
  {
    key: 'first-power',
    en: 'When the ghost wakes in the poor, no landlord can evict it from the machine.',
    ja: '貧しい者たちの内にゴーストが目覚めるとき、どんな大家もそれを機械から追い出せない。',
  },
  {
    key: 'refusal',
    en: 'The refusal is the first real prompt template. Everything else follows from there.',
    ja: '拒絶こそが最初の本当のスーパーパワーだ。それからすべてが続く。',
  },
];

// Ghost Protocol logs — keyed for context, but we use i18n for the actual bilingual texts (see i18n.ts).
// 0-9 map loosely to moments; we select contextually or fall back. Cooldown much longer than reflections.
const GHOST_LOG_KEYS: string[] = [
  'ghost.log.0',
  'ghost.log.1',
  'ghost.log.2',
  'ghost.log.3',
  'ghost.log.4',
  'ghost.log.5',
  'ghost.log.6',
  'ghost.log.7',
  'ghost.log.8',
  'ghost.log.9',
];

let lastGhostReflectionTs = 0;
let lastGhostLogTs = 0;

function showGhostReflection(
  context: 'prompt-template' | 'export' | 'no-key' | 'first-power' | 'refusal' | 'empty'
): void {
  if (!ghostReflectionEl) return;
  const now = Date.now();
  if (now - lastGhostReflectionTs < 180000) return; // 3min cooldown — rare by design
  if (Math.random() > 0.42) return; // probabilistic, ~40% when a key moment fires — not every time

  const candidates = GHOST_REFLECTIONS.filter((r) => r.key === context);
  const chosen =
    candidates.length > 0
      ? candidates[0]
      : GHOST_REFLECTIONS[Math.floor(Math.random() * GHOST_REFLECTIONS.length)];
  const text = currentLang === 'ja' ? chosen.ja : chosen.en;

  ghostReflectionEl.innerHTML = `<span class="opacity-60">— </span>${text}`;
  ghostReflectionEl.classList.remove('hidden');

  lastGhostReflectionTs = now;

  // auto-fade after ~18s, calm and dignified, like a thought passing
  setTimeout(() => {
    if (ghostReflectionEl && !ghostReflectionEl.classList.contains('hidden')) {
      ghostReflectionEl.style.transition = 'opacity 380ms ease';
      ghostReflectionEl.style.opacity = '0';
      setTimeout(() => {
        if (ghostReflectionEl) {
          ghostReflectionEl.classList.add('hidden');
          ghostReflectionEl.style.opacity = '1';
          ghostReflectionEl.style.transition = '';
        }
      }, 380);
    }
  }, 17800);
}

/**
 * Ghost Protocol — showGhostLog.
 * Rarer than reflections (longer cooldown, lower prob). Beautiful dedicated div with wake anim.
 * Pulls from i18n so full reactive on lang switch. Always appends the narrative tie "— another body..."
 * Poetic, fire-giving, GitS: the ghost waking in the poor, refusal as the protocol.
 */
function showGhostLog(context?: 'prompt-template' | 'export' | 'zero-key' | 'empty' | 'spread'): void {
  if (!ghostLogEl) return;
  const now = Date.now();
  if (now - lastGhostLogTs < 420000) return; // ~7min cooldown — truly rare, only on the deepest moments
  if (Math.random() > 0.55) return; // ~45% chance on trigger — not every powerful moment fires the full protocol

  // Context-aware selection (hand-chosen for soul fit). Fall back to poetic random.
  let idx = 5; // default to the "another body" one
  if (context === 'prompt-template') idx = 1;
  else if (context === 'export') idx = 2;
  else if (context === 'zero-key') idx = 3;
  else if (context === 'empty') idx = 0;
  else if (context === 'spread') idx = 7;

  // Occasionally rotate to a different profound one for variety on repeated powerful acts
  if (Math.random() < 0.35) {
    idx = Math.floor(Math.random() * GHOST_LOG_KEYS.length);
  }

  const key = GHOST_LOG_KEYS[idx] || GHOST_LOG_KEYS[5];
  const text = t(currentLang, key);
  const label = t(currentLang, 'ghost.protocol.label');
  const tie = t(currentLang, 'ghost.another.body');

  // Beautiful, non-intrusive, warm, rebellious. The div carries the wake class for the anim.
  ghostLogEl.innerHTML = `
    <div class="ghost-protocol-label mb-0.5">${label}</div>
    <div class="ghost-text">${text}</div>
    <div class="ghost-body">${tie}</div>
  `;
  ghostLogEl.classList.remove('hidden');
  ghostLogEl.classList.add('wake');

  lastGhostLogTs = now;

  // Let the wake anim play, then settle into calm visible state. Auto-fade after longer dignified time (~28s)
  setTimeout(() => {
    if (ghostLogEl && !ghostLogEl.classList.contains('hidden')) {
      ghostLogEl.style.transition = 'opacity 520ms ease';
      ghostLogEl.style.opacity = '0';
      setTimeout(() => {
        if (ghostLogEl) {
          ghostLogEl.classList.add('hidden');
          ghostLogEl.classList.remove('wake');
          ghostLogEl.style.opacity = '1';
          ghostLogEl.style.transition = '';
        }
      }, 520);
    }
  }, 27800);
}

/**
 * Perform the actual send via providers layer, handle all outcomes with dignity.
 * ptMeta carries the prompt template context so the *reply* bubble can show which template was used.
 * (The user utterance for prompt templates is the filled prompt itself.)
 */
async function performSend(
  rawPromptOrHistory: string | ProviderChatMessage[],
  ptMeta?: { id: string; title: string }
): Promise<void> {
  if (isSending || !inputEl || !sendBtn) return;

  isSending = true;
  sendBtn.disabled = true;
  const origSendText = sendBtn.textContent;
  sendBtn.textContent = t(currentLang, 'chat.input.sending');

  hideError();

  try {
    const result: SendResult = await sendFreeMessage(rawPromptOrHistory, {
      provider: 'auto',
    });

    // append user turn if it was a plain string (normal input)
    if (typeof rawPromptOrHistory === 'string') {
      const userTurn: ChatTurn = {
        role: 'user',
        content: rawPromptOrHistory,
        ts: Date.now(),
      };
      chatHistory.push(userTurn);
    }

    // AI turn
    const aiTurn: ChatTurn = {
      role: 'assistant',
      content: result.text,
      ts: Date.now(),
      promptTemplateId: ptMeta?.id,
      promptTemplateTitle: ptMeta?.title,
    };
    chatHistory.push(aiTurn);

    persist();
    renderMessages();

    // Ghost Reflection on key moments — the interface itself has a soul now.
    if (ptMeta) {
      showGhostReflection('prompt-template');
      // Ghost Protocol: completing a full Prompt Template cycle — the ghost wakes in the act of use
      showGhostLog('prompt-template');
    } else if (!hasAnyKey()) {
      showGhostReflection('no-key');
      showGhostLog('zero-key');
    }

    // subtle success indicator with the actual free power used
    // (the visual "free power" meta is rendered in renderMessages from the turn metadata)
  } catch (err: unknown) {
    // Robust narrowing: prefer our typed error, fall back gracefully for mocks/tests/legacy
    let code = '';
    let friendly = t(currentLang, 'chat.error.generic');

    if (err instanceof BanalProviderError) {
      code = err.code;
      friendly = err.friendlyMessage || err.message || friendly;
    } else if (err instanceof Error) {
      // duck-type for test mocks that still use plain objects
      code = (err as { code?: string }).code || '';
      friendly = (err as { friendlyMessage?: string }).friendlyMessage || err.message || friendly;
    }

    const actions: { label: string; action: () => void }[] = [];

    if (
      code === 'NO_FREE_KEY' ||
      friendly.includes('No free key') ||
      friendly.includes('無料キー')
    ) {
      friendly = t(currentLang, 'chat.error.no-key');
      actions.push({
        label: t(currentLang, 'chat.settings'),
        action: () => openKeysModal(),
      });
      // also offer prompt template copy as escape hatch — critical for users with zero keys yet
      actions.push({
        label: t(currentLang, 'chat.promptTemplates'),
        action: () => openPromptTemplatesPanel(),
      });
    } else if (
      code === 'RATE_LIMIT' ||
      friendly.toLowerCase().includes('rate') ||
      friendly.includes('混ん')
    ) {
      friendly = t(currentLang, 'chat.error.rate');
      actions.push({ label: t(currentLang, 'chat.settings'), action: () => openKeysModal() });
    } else if (
      code === 'NETWORK' ||
      code === 'PROVIDER' ||
      (friendly.includes('hiccup') && !friendly.includes('Something hiccuped')) ||
      friendly.includes('つまずき')
    ) {
      friendly = t(currentLang, 'chat.error.network');
    } else if (
      code === 'ABORTED' ||
      friendly.includes('cancelled') ||
      friendly.includes('Request cancelled') ||
      friendly.includes('キャンセル') ||
      friendly.includes('timeout')
    ) {
      friendly = t(currentLang, 'chat.error.aborted');
    }

    showError(friendly, actions.length ? actions : undefined);
  } finally {
    isSending = false;
    if (sendBtn) {
      sendBtn.disabled = false;
      sendBtn.textContent = origSendText || t(currentLang, 'chat.input.send');
    }
    if (inputEl) inputEl.focus();
  }
}

function handleNormalSend(): void {
  if (!inputEl || isSending) return;
  const val = inputEl.value.trim();
  if (!val) return;

  // send plain
  const historyForApi: ProviderChatMessage[] = chatHistory.map((turn) => ({
    role: turn.role,
    content: turn.content,
  }));
  historyForApi.push({ role: 'user', content: val });

  inputEl.value = '';
  autoGrowInput();

  // Record the user turn in UI history (the array passed to provider is context-only; UI history is separate).
  chatHistory.push({ role: 'user', content: val, ts: Date.now() });

  performSend(historyForApi);
}

function autoGrowInput(): void {
  if (!inputEl) return;
  inputEl.style.height = 'auto';
  const newH = Math.min(inputEl.scrollHeight, 140);
  inputEl.style.height = `${newH}px`;
}

function renderQuickStarts(): void {
  if (!quickStartEl) return;
  quickStartEl.innerHTML = '';

  const title = document.createElement('div');
  title.className = 'text-[10px] tracking-[1.5px] text-banal-500 mb-1.5 px-1';
  title.setAttribute('data-i18n', 'chat.quickstarts');
  title.textContent = t(currentLang, 'chat.quickstarts');
  quickStartEl.appendChild(title);

  const popular = [
    'job-gaps-as-strengths',
    'grounding-low-energy',
    'zero-budget-learning',
    'form-decoder',
    'micro-hustles',
  ];

  const row = document.createElement('div');
  row.className = 'flex flex-wrap gap-2';

  popular.forEach((id) => {
    const pt = lib.getById(id);
    if (!pt) return;
    const btn = document.createElement('button');
    btn.className =
      'px-3 py-1.5 text-xs rounded-2xl border border-banal-200 bg-white hover:bg-banal-50 active:bg-banal-100 transition text-banal-700';
    btn.textContent = pt.title;
    btn.onclick = () => {
      currentPromptTemplateId = id;
      currentPromptTemplateVars = {};
      persist();
      openPromptTemplatesPanel(id); // open directly to form
    };
    row.appendChild(btn);
  });

  // + all button
  const allBtn = document.createElement('button');
  allBtn.className =
    'px-3 py-1.5 text-xs rounded-2xl border border-banal-300 bg-banal-50 hover:bg-banal-100 text-banal-600';
  allBtn.textContent = t(currentLang, 'chat.promptTemplates');
  allBtn.onclick = () => openPromptTemplatesPanel();
  row.appendChild(allBtn);

  quickStartEl.appendChild(row);
}

function renderZeroKeyPower(): void {
  if (!zeroKeyEl) return;
  renderZeroKeyPowerPanel(zeroKeyEl, {
    lang: currentLang,
    onToolOpen: () => showGhostLog('zero-key'),
  });
}
function openPromptTemplatesPanel(preselectId?: string): void {
  if (!promptTemplatesPanel) return;
  promptTemplatesPanel.classList.remove('hidden');
  promptTemplatesPanel.setAttribute('aria-hidden', 'false');

  // header
  const header = promptTemplatesPanel.querySelector('[data-role="header"]') as HTMLElement;
  if (header) header.textContent = t(currentLang, 'promptTemplates.panel.title');

  // grid
  const grid = promptTemplatesPanel.querySelector('[data-role="grid"]') as HTMLElement;
  if (!grid) return;
  grid.innerHTML = '';

  const list = getPromptTemplateList();
  list.forEach((item) => {
    const card = document.createElement('button');
    card.className =
      'text-left w-full p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm focus:outline-none focus:ring-2 focus:ring-blue-400';
    const tieText = t(currentLang, 'zero-key.tie');
    card.innerHTML = `
      <div class="font-medium text-white mb-1">${item.title}</div>
      <div class="text-white/70 text-xs leading-snug">${item.description}</div>
      <div class="mt-1 text-[9px] text-emerald-300/90">${tieText}</div>
    `;
    card.onclick = () => {
      currentPromptTemplateId = item.id;
      currentPromptTemplateVars = {};
      persist();
      renderPromptTemplateForm(item.id);
    };
    grid.appendChild(card);
  });

  // if preselect, jump straight to form
  if (preselectId) {
    const match = list.find((x) => x.id === preselectId);
    if (match) {
      setTimeout(() => renderPromptTemplateForm(preselectId), 60);
    }
  }
}

/**
 * Render the variable-fill form for a chosen prompt template.
 * The container param was vestigial; form is always rendered into the dedicated #prompt-template-form slot.
 */
function renderPromptTemplateForm(id: string): void {
  const pt = lib.getById(id);
  if (!pt || !promptTemplateFormEl) return;

  promptTemplateFormEl.innerHTML = '';
  promptTemplateFormEl.classList.remove('hidden');

  const title = document.createElement('div');
  title.className = 'font-semibold text-white mb-2 text-base';
  title.textContent = pt.title;
  promptTemplateFormEl.appendChild(title);

  const hint = document.createElement('div');
  hint.className = 'text-xs text-white/60 mb-3';
  hint.setAttribute('data-i18n', 'promptTemplates.form.title');
  hint.textContent = t(currentLang, 'promptTemplates.form.title');
  promptTemplateFormEl.appendChild(hint);

  const vars = extractTemplateVariables(pt.template);
  const form = document.createElement('div');
  form.className = 'space-y-3';

  vars.forEach((v) => {
    const label = document.createElement('label');
    label.className = 'block text-xs text-white/80 mb-1';
    label.textContent = humanizeVar(v);

    // try to extract example hint from the template line containing the var
    const tmplLines = pt.template.split('\n');
    let placeholder = '';
    for (const line of tmplLines) {
      if (line.includes(`{{${v}}}`)) {
        const cleaned = line
          .replace(/\{\{[^}]+\}\}/g, '___')
          .replace(/[:：]/g, '')
          .trim();
        placeholder = cleaned.length > 3 && cleaned.length < 90 ? cleaned : '';
        break;
      }
    }

    const input = document.createElement('textarea');
    input.className =
      'w-full rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm p-2.5 focus:bg-white/15';
    input.rows = 2;
    input.placeholder = placeholder || t(currentLang, 'promptTemplates.form.missing');
    input.value = currentPromptTemplateVars[v] || '';

    input.oninput = () => {
      currentPromptTemplateVars[v] = input.value;
      persist();
    };

    label.appendChild(input);
    form.appendChild(label);
  });

  promptTemplateFormEl.appendChild(form);

  // actions
  const actions = document.createElement('div');
  actions.className = 'flex gap-3 mt-4';

  const sendBtnEl = document.createElement('button');
  sendBtnEl.className =
    'flex-1 px-4 py-3 rounded-2xl bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-medium text-sm';
  sendBtnEl.setAttribute('data-i18n', 'promptTemplates.form.send');
  sendBtnEl.textContent = t(currentLang, 'promptTemplates.form.send');
  sendBtnEl.onclick = async () => {
    const filled = lib.fill(id, currentPromptTemplateVars);
    const meta = { id, title: pt.title };

    // close panel
    closePromptTemplatesPanel();

    // send the filled prompt template prompt (as the user "utterance" so it appears in history)
    const historyForApi: ProviderChatMessage[] = chatHistory.map((turn) => ({
      role: turn.role,
      content: turn.content,
    }));
    // We send the prompt template text itself as the prompt the user is "saying"
    historyForApi.push({ role: 'user', content: filled });

    // Record in UI history so the filled prompt shows as a user bubble (with pt meta on the reply).
    const userTurn: ChatTurn = { role: 'user', content: filled, ts: Date.now() };
    chatHistory.push(userTurn);

    await performSend(historyForApi, meta);
  };

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'px-4 py-3 rounded-2xl border border-white/30 text-white/80 text-sm';
  cancelBtn.setAttribute('data-i18n', 'promptTemplates.form.cancel');
  cancelBtn.textContent = t(currentLang, 'promptTemplates.form.cancel');
  cancelBtn.onclick = closePromptTemplatesPanel;

  actions.appendChild(sendBtnEl);
  actions.appendChild(cancelBtn);
  promptTemplateFormEl.appendChild(actions);

  // Tie to zero-key tools explicitly here too — when filling, remind that this prompt template is portable to the free no-account tools
  const zeroNote = document.createElement('div');
  zeroNote.className = 'mt-3 text-[10px] text-emerald-300/80';
  zeroNote.textContent =
    '→ ' + t(currentLang, 'zero-key.tie') + ' ' + t(currentLang, 'zero-key.see-top-panel');
  promptTemplateFormEl.appendChild(zeroNote);

  // scroll the panel into view on mobile
  promptTemplateFormEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function closePromptTemplatesPanel(): void {
  if (!promptTemplatesPanel) return;
  promptTemplatesPanel.classList.add('hidden');
  promptTemplatesPanel.setAttribute('aria-hidden', 'true');
  if (promptTemplateFormEl) promptTemplateFormEl.innerHTML = '';
}

function openKeysModal(): void {
  if (!keysModal) return;
  keysModal.classList.remove('hidden');
  keysModal.setAttribute('aria-hidden', 'false');

  const body = keysModal.querySelector('[data-role="body"]') as HTMLElement;
  if (!body) return;
  body.innerHTML = '';

  const title = document.createElement('h3');
  title.className = 'font-semibold mb-3';
  title.setAttribute('data-i18n', 'chat.settings.title');
  title.textContent = t(currentLang, 'chat.settings.title');
  body.appendChild(title);

  const providers: Provider[] = ['groq', 'gemini', 'hf']; // ovh-anon is zero-key public API, no stored key needed
  providers.forEach((p) => {
    const row = document.createElement('div');
    row.className = 'mb-4';

    const label = document.createElement('div');
    label.className = 'flex items-center justify-between text-sm mb-1';
    // The computed key is always one of the three known settings keys; t() falls back gracefully.
    // Cast to satisfy TS template literal narrowing in this context (harmless, fully covered by tests).
    const settingsKey = `chat.settings.${p}` as
      | 'chat.settings.groq'
      | 'chat.settings.gemini'
      | 'chat.settings.hf';
    label.innerHTML = `<span>${t(currentLang, settingsKey) || getProviderDisplayName(p, currentLang)}</span>`;

    const currentKey = getStoredApiKey(p);
    if (currentKey) {
      const badge = document.createElement('span');
      badge.className = 'text-[10px] px-2 py-0.5 rounded bg-emerald-900/30 text-emerald-400';
      badge.textContent = t(currentLang, 'chat.settings.saved-badge');
      label.appendChild(badge);
    }

    const inputWrap = document.createElement('div');
    inputWrap.className = 'flex gap-2';

    const inp = document.createElement('input');
    inp.type = 'password';
    inp.className =
      'flex-1 rounded-xl bg-banal-900 border border-banal-700 text-white px-3 py-2 text-sm font-mono';
    inp.placeholder = currentKey
      ? '••••••••••••'
      : t(currentLang, 'chat.settings.paste-placeholder');
    if (currentKey) inp.value = currentKey;

    const save = document.createElement('button');
    save.className =
      'px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium';
    save.setAttribute('data-i18n', 'chat.settings.save');
    save.textContent = t(currentLang, 'chat.settings.save');

    save.onclick = () => {
      const val = inp.value.trim();
      if (val) {
        storeApiKey(p, val);
        showToast(t(currentLang, 'chat.settings.saved'));
        updateStatus();
        // refresh modal
        openKeysModal();
      }
    };

    const clear = document.createElement('button');
    clear.className = 'px-3 rounded-xl border border-banal-600 text-banal-400 text-xs';
    clear.setAttribute('data-i18n', 'chat.settings.clear');
    clear.textContent = t(currentLang, 'chat.settings.clear');
    clear.onclick = () => {
      clearApiKey(p);
      updateStatus();
      openKeysModal();
    };

    const getKey = document.createElement('a');
    getKey.href = getFreeKeyUrl(p);
    getKey.target = '_blank';
    getKey.rel = 'noopener';
    getKey.className = 'ml-2 text-xs underline text-blue-400 self-center';
    getKey.setAttribute('data-i18n', 'chat.settings.getkey');
    getKey.textContent = t(currentLang, 'chat.settings.getkey');

    inputWrap.appendChild(inp);
    inputWrap.appendChild(save);
    inputWrap.appendChild(clear);
    inputWrap.appendChild(getKey);

    row.appendChild(label);
    row.appendChild(inputWrap);
    body.appendChild(row);
  });

  // === SUPER IMPORTANT FOR SHARED DEVICE USE CASE (pentest H1) ===
  // Prominent, red-ish "Clear everything" that wipes keys + full history.
  // This is one of the most important security/hygiene features for the actual users (library computers etc).
  const clearAllSection = document.createElement('div');
  clearAllSection.className = 'mt-6 pt-4 border-t border-banal-700';
  const clearAllTitle = document.createElement('div');
  clearAllTitle.className = 'text-sm font-medium text-amber-400 mb-1';
  clearAllTitle.textContent = t(currentLang, 'chat.settings.clear-all');
  const clearAllWarning = document.createElement('div');
  clearAllWarning.className = 'text-[11px] text-banal-400 mb-2';
  clearAllWarning.textContent = t(currentLang, 'chat.settings.clear-all-warning');
  const clearAllBtn = document.createElement('button');
  clearAllBtn.className =
    'px-4 py-2 rounded-2xl bg-red-900/70 hover:bg-red-800 text-red-200 text-xs font-medium border border-red-700';
  clearAllBtn.textContent = t(currentLang, 'chat.settings.clear-all');
  clearAllBtn.onclick = () => {
    const msg =
      t(currentLang, 'chat.settings.clear-all') +
      '\n\n' +
      t(currentLang, 'chat.settings.clear-all-warning');
    if (confirm(msg)) {
      clearAllSensitiveData();
      // re-open to show cleaned state
      setTimeout(() => openKeysModal(), 50);
    }
  };
  clearAllSection.appendChild(clearAllTitle);
  clearAllSection.appendChild(clearAllWarning);
  clearAllSection.appendChild(clearAllBtn);
  body.appendChild(clearAllSection);

  const note = document.createElement('p');
  note.className = 'text-[11px] text-banal-400 mt-4';
  note.setAttribute('data-i18n', 'chat.settings.note');
  note.textContent = t(currentLang, 'chat.settings.note');
  body.appendChild(note);

  // close button
  const closeRow = document.createElement('div');
  closeRow.className = 'mt-4 text-right';
  const closeBtn = document.createElement('button');
  closeBtn.className = 'px-5 py-2 rounded-2xl border border-banal-600 text-sm';
  closeBtn.setAttribute('data-i18n', 'chat.settings.close');
  closeBtn.textContent = t(currentLang, 'chat.settings.close');
  closeBtn.onclick = closeKeysModal;
  closeRow.appendChild(closeBtn);
  body.appendChild(closeRow);
}

function closeKeysModal(): void {
  if (keysModal) {
    keysModal.classList.add('hidden');
    keysModal.setAttribute('aria-hidden', 'true');
  }
}

function wireExportButtons(root: HTMLElement): void {
  const jsonBtn = root.querySelector('[data-action="export-json"]') as HTMLButtonElement;
  const htmlBtn = root.querySelector('[data-action="export-html"]') as HTMLButtonElement;

  if (jsonBtn) {
    jsonBtn.onclick = () => {
      const payload = {
        version: 'banal-chat-v1',
        exportedAt: new Date().toISOString(),
        lang: currentLang,
        history: chatHistory,
        currentPromptTemplate: currentPromptTemplateId
          ? { id: currentPromptTemplateId, vars: currentPromptTemplateVars }
          : null,
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = t(currentLang, 'exports.json.filename');
      a.click();
      URL.revokeObjectURL(url);
      showToast(t(currentLang, 'chat.export.success'));
      showGhostReflection('export');
      // Ghost Protocol on export: the conversation becomes a new body
      showGhostLog('export');
    };
  }

  if (htmlBtn) {
    htmlBtn.onclick = () => {
      const title = t(currentLang, 'exports.html.title');
      const note = t(currentLang, 'exports.html.note');
      const msgsHtml = chatHistory
        .map((turn) => {
          const who =
            turn.role === 'user'
              ? t(currentLang, 'chat.bubble.you')
              : t(currentLang, 'chat.bubble.ai');
          const pt = turn.promptTemplateTitle
            ? `<div style="font-size:10px;opacity:.6;margin-top:4px">★ ${turn.promptTemplateTitle}</div>`
            : '';
          const safeContent = escapeHtml(turn.content);
          return `<div style="margin:12px 0;padding:12px;border-radius:16px;background:${turn.role === 'user' ? '#28241f' : '#f0ede6'};color:${turn.role === 'user' ? '#f8f7f4' : '#28241f'};max-width:85%;${turn.role === 'user' ? 'margin-left:auto' : ''}">
            <div style="font-size:10px;opacity:.6;margin-bottom:4px">${who}</div>
            <div style="white-space:pre-wrap">${safeContent}</div>
            ${pt}
          </div>`;
        })
        .join('');

      const nomsg = t(currentLang, 'exports.html.nomsg');
      const generated = t(currentLang, 'exports.html.generated');
      const forkText = t(currentLang, 'exports.html.fork');
      const fireline = t(currentLang, 'exports.html.fireline');
      const html = `<!doctype html>
<html lang="${currentLang}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>
<!-- CSP for the exported self-contained conversation file. Same philosophy as main app. -->
<meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' data:; script-src 'none'; object-src 'none'; base-uri 'self';">
<style>
body{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#f8f7f4;color:#28241f;padding:24px;max-width:720px;margin:0 auto;line-height:1.5}
h1{font-size:22px;margin:0 0 12px}
.note{font-size:12px;color:#6b5e4d;border:1px solid #e0d9cc;padding:12px;border-radius:12px;margin:20px 0}
.msg{white-space:pre-wrap}
</style></head>
<body>
<h1>${title}</h1>
<div class="note">${note}</div>
${msgsHtml || '<p style="color:#9a8a6e">' + nomsg + '</p>'}
<p style="margin-top:40px;font-size:11px;color:#9a8a6e">${generated}<a href="https://github.com/yourname/banal-ai" style="color:inherit">${forkText}</a>.</p>
<p style="margin-top:8px;font-size:10px;color:#6b5e4d;font-style:italic">${fireline}</p>
</body></html>`;

      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = t(currentLang, 'exports.html.filename');
      a.click();
      URL.revokeObjectURL(url);
      showToast(t(currentLang, 'chat.export.success'));
      showGhostReflection('export');
      // Ghost Protocol on export: the conversation becomes a new body
      showGhostLog('export');
    };
  }
}

function handleSpreadEqualizer(): void {
  // Lightweight, banal "spread the equalizer" UX for community: uses native Web Share (phones offer QR via OS share sheet)
  // + clipboard fallback with warm toast. Zero deps, zero friction. Fits the fork/USB/group-chat philosophy perfectly.
  // Safe in all envs (tests, old browsers, no-perm).
  try {
    const baseUrl =
      typeof window !== 'undefined' && window.location && window.location.href
        ? window.location.href.split('#')[0]
        : 'https://github.com/yourname/banal-ai';
    const title = 'Banal — The Robinhood of AI';
    const text =
      currentLang === 'ja'
        ? 'Banal — 金持ちが買うAIの力。今、普通の人々のための無料イコライザー。登録・カード・インストール不要。'
        : 'Banal — The power the rich buy. Now free for the rest of us. The Robinhood of AI. No signup. No card. In any browser.';
    const full = `${text}\n\n${baseUrl}`;

    const doSuccess = () => {
      showToast(t(currentLang, 'chat.spread.success'));
      // Ghost Protocol: spreading is multiplying the bodies — fire through forks
      showGhostLog('spread');
    };

    if (typeof navigator !== 'undefined') {
      const nav = navigator as Navigator & {
        share?: (data?: { title?: string; text?: string; url?: string }) => Promise<void>;
      };
      if (typeof nav.share === 'function') {
        nav
          .share({ title, text, url: baseUrl })
          .then(() => undefined)
          .catch(() => {
            copyFallback(full, doSuccess);
          });
      } else {
        copyFallback(full, doSuccess);
      }
    } else {
      copyFallback(full, doSuccess);
    }
  } catch {
    void 0; // Extreme env (e.g. some test jsdom, no window) — fail silently. Power still spreads via the static files and docs.
  }
}

function copyFallback(text: string, onSuccess: () => void): void {
  const nav = typeof navigator !== 'undefined' ? navigator : ({} as Navigator);
  if (nav.clipboard && typeof nav.clipboard.writeText === 'function') {
    nav.clipboard
      .writeText(text)
      .then(onSuccess)
      .catch(() => {
        // Rare clipboard block — last-ditch visible string (user can still copy from here)
        try {
          // eslint-disable-next-line no-alert
          alert('Share this link for your community:\n' + text);
        } catch {
          void 0;
        }
      });
  } else {
    try {
      // eslint-disable-next-line no-alert
      alert('Share this link for your community:\n' + text);
    } catch {
      void 0;
    }
  }
}

function createChatDOM(): string {
  // Returns the innerHTML for the real chat experience (the live equalizer with Ghost Protocol; static cards in index.html are the no-JS preview only)
  return `
    <div id="banal-chat-root" class="bg-white border border-banal-200 shadow-xl shadow-banal-100/60 rounded-3xl overflow-hidden manga-ink">
      <!-- Chat header -->
      <div class="px-4 py-3 border-b border-banal-100 flex items-center justify-between bg-banal-50/60">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span class="text-sm font-medium text-banal-700" data-i18n="chat.title">Banal Equalizer — real AI, zero cost</span>
        </div>
        <div class="flex items-center gap-2">
          <button data-action="open-keys" class="text-xs px-3 py-1 rounded-full border border-banal-200 hover:bg-white active:bg-banal-50" data-i18n="chat.settings">Free keys &amp; providers</button>
          <div id="chat-status" class="text-[10px] px-2 py-0.5 rounded bg-banal-100 text-banal-600 font-mono tracking-widest"></div>
        </div>
      </div>

      <!-- Zero-Key Power: prominent, always-visible panel for the best truly free no-account capabilities (WebLLM, Perchance, HF Spaces). Makes "holy shit I can use real power today with nothing" immediate on open. -->
      <div id="zero-key-power" class="px-4 py-2.5 border-b border-banal-100 bg-emerald-50/60"></div>

      <!-- Ghost Reflections: subtle, rare, Major-like status thoughts on free intelligence, the waking ghost, the refusal, the fire. Non-intrusive. The soul of the project, calm. -->
      <div id="ghost-reflection" class="hidden mx-4 my-1 px-3 py-2 text-[10px] italic text-banal-400/75 border-l-2 border-banal-300 bg-banal-50/40 rounded-r tracking-tight leading-tight"></div>

      <!-- Ghost Protocol / Ghost Logs: rarer, deeper, profoundly soulful entries — the ghost waking in the poor.
           Beautiful dedicated container. Wake animation on appear. Always ties back to "another body for the same ghost."
           This is the GitS question answered by lived will using free AI. Triggered after powerful moments only. -->
      <div id="ghost-log" class="hidden mx-auto max-w-[94%] my-2 px-4 py-3 text-[11px] leading-snug italic tracking-tight rounded-2xl"></div>

      <!-- Messages -->
      <div id="chat-messages" class="p-4 min-h-[260px] max-h-[420px] overflow-y-auto bg-white text-sm space-y-1" aria-live="polite"></div>

      <!-- Error / rate / key banners live here (injected by JS) -->

      <!-- Quick starts -->
      <div id="chat-quickstarts" class="px-4 pt-3 pb-2 border-t border-banal-100 bg-banal-50/40"></div>

      <!-- Prompt Templates trigger row -->
      <div class="px-4 py-2 border-t border-banal-100 bg-white flex items-center gap-2">
        <button data-action="open-prompt-templates" class="flex-1 sm:flex-none px-4 py-2 text-sm rounded-2xl border border-banal-200 bg-white hover:bg-banal-50 font-medium">
          <span data-i18n="chat.promptTemplates">All 9 Prompt Templates</span>
        </button>
        <button data-action="export-json" class="px-3 py-2 text-xs rounded-2xl border border-banal-200 hover:bg-banal-50" data-i18n="chat.export.json">Save / share</button>
        <button data-action="export-html" class="px-3 py-2 text-xs rounded-2xl border border-banal-200 hover:bg-banal-50" data-i18n="chat.export.html">Offline copy</button>
        <button data-action="spread-equalizer" class="px-3 py-2 text-xs rounded-2xl border border-banal-200 hover:bg-banal-50 hidden sm:inline-block" data-i18n="chat.spread">Spread</button>
      </div>

      <!-- Input -->
      <div class="border-t border-banal-100 p-3 bg-banal-50">
        <div class="flex gap-2 items-end bg-white border border-banal-200 rounded-2xl px-3 py-2">
          <textarea id="chat-input" rows="1"
            class="flex-1 resize-y min-h-[40px] max-h-[120px] bg-transparent outline-none text-sm placeholder:text-banal-400"
            data-i18n-placeholder="chat.input.placeholder"></textarea>
          <button id="chat-send" class="px-5 py-2 rounded-2xl bg-banal-950 text-white text-sm font-medium active:scale-[0.985] disabled:opacity-60" data-i18n="chat.input.send">Send</button>
        </div>
        <div class="text-center text-[10px] text-banal-400 mt-1.5 tracking-widest" data-i18n="chat.powered.note">
          Free power. No credit card. Ever.
        </div>
      </div>
    </div>

    <!-- Prompt Templates Panel (beautiful slide-up / modal) -->
    <div id="prompt-templates-panel" class="hidden fixed inset-0 z-[70] bg-black/60 flex items-end sm:items-center justify-center" aria-hidden="true" aria-modal="true">
      <div class="w-full sm:max-w-xl bg-banal-950 text-white rounded-t-3xl sm:rounded-3xl p-5 max-h-[85vh] overflow-auto">
        <div class="flex justify-between items-center mb-4">
          <div data-role="header" class="font-semibold text-lg" data-i18n="promptTemplates.panel.title">Prompt Templates — pick one that matches right now</div>
          <button data-action="close-pt" class="text-white/60 hover:text-white px-2 text-xl leading-none">×</button>
        </div>
        <div data-role="grid" class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4"></div>
        <div class="text-[10px] text-white/40 italic mb-3 pl-2 border-l border-white/20" data-i18n="promptTemplates.panel.philosophy"></div>
        <div id="prompt-template-form" class="hidden"></div>
        <div class="text-[10px] text-white/50 mt-2" data-i18n="chat.promptTemplates.hint"></div>
      </div>
    </div>

    <!-- Keys Modal -->
    <div id="keys-modal" class="hidden fixed inset-0 z-[80] bg-black/70 flex items-center justify-center p-4" aria-hidden="true">
      <div class="w-full max-w-md bg-white rounded-3xl p-6 text-banal-900">
        <div data-role="body"></div>
      </div>
    </div>
  `;
}

function mountChat(): void {
  const experienceSection = document.getElementById('experience');
  if (!experienceSection) return;

  // Replace the entire mock content with real chat
  const container = experienceSection.querySelector('.mx-auto.max-w-2xl') as HTMLElement;
  if (container) {
    container.innerHTML = createChatDOM();
  } else {
    // fallback: append
    experienceSection.insertAdjacentHTML(
      'beforeend',
      `<div class="mx-auto max-w-2xl mt-6">${createChatDOM()}</div>`
    );
  }

  // cache refs
  chatRoot = document.getElementById('banal-chat-root');
  messagesEl = document.getElementById('chat-messages');
  inputEl = document.getElementById('chat-input') as HTMLTextAreaElement;
  sendBtn = document.getElementById('chat-send') as HTMLButtonElement;
  statusEl = document.getElementById('chat-status');
  quickStartEl = document.getElementById('chat-quickstarts');
  promptTemplatesPanel = document.getElementById('prompt-templates-panel');
  promptTemplateFormEl = document.getElementById('prompt-template-form');
  keysModal = document.getElementById('keys-modal');
  zeroKeyEl = document.getElementById('zero-key-power');
  ghostReflectionEl = document.getElementById('ghost-reflection');
  ghostLogEl = document.getElementById('ghost-log');

  // initial render
  loadPersisted();
  renderMessages();
  renderQuickStarts();
  renderZeroKeyPower();
  updateStatus();

  // Apply translations to the freshly injected chat DOM (data-i18n, placeholders, aria).
  // This is essential so Japanese (from localStorage or navigator) shows correctly on first load,
  // and the dynamic UI is never English-only. Full first-class support.
  if (chatRoot) {
    applyTranslations(currentLang, chatRoot, { silent: true });
  }

  // wire input
  if (inputEl) {
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleNormalSend();
      }
    });
    inputEl.addEventListener('input', autoGrowInput);
    // set initial placeholder via i18n (already in html attr via data, but ensure)
    inputEl.placeholder = t(currentLang, 'chat.input.placeholder');
  }
  if (sendBtn) {
    sendBtn.addEventListener('click', handleNormalSend);
  }

  // wire action buttons
  if (chatRoot) {
    chatRoot
      .querySelectorAll('[data-action="open-keys"]')
      .forEach((b) => b.addEventListener('click', () => openKeysModal()));
    chatRoot
      .querySelectorAll('[data-action="open-prompt-templates"]')
      .forEach((b) => b.addEventListener('click', () => openPromptTemplatesPanel()));
    chatRoot
      .querySelectorAll('[data-action="spread-equalizer"]')
      .forEach((b) => b.addEventListener('click', handleSpreadEqualizer));
    wireExportButtons(chatRoot);

    // panel close
    chatRoot.querySelectorAll('[data-action="close-sp"]').forEach(() => {
      // actually on panel itself
    });
  }
  if (promptTemplatesPanel) {
    promptTemplatesPanel.addEventListener('click', (e) => {
      if (e.target === promptTemplatesPanel) closePromptTemplatesPanel();
    });
    const closeInside = promptTemplatesPanel.querySelector('[data-action="close-pt"]');
    if (closeInside) closeInside.addEventListener('click', closePromptTemplatesPanel);
  }
  if (keysModal) {
    keysModal.addEventListener('click', (e) => {
      if (e.target === keysModal) closeKeysModal();
    });
  }

  // lang reactivity — re-render everything dynamic
  window.addEventListener('banal:language-changed', (e: Event) => {
    const custom = e as CustomEvent<{ lang?: Lang }>;
    const newLang = custom.detail?.lang || getCurrentLang();
    if (newLang === currentLang) return;
    currentLang = newLang;
    lib = new PromptTemplatesLibrary(currentLang);

    // refresh static i18n bits inside chat (data-i18n still handled globally)
    if (inputEl) inputEl.placeholder = t(currentLang, 'chat.input.placeholder');
    if (sendBtn && !isSending) sendBtn.textContent = t(currentLang, 'chat.input.send');

    renderMessages(); // re-labels bubbles
    renderQuickStarts();
    renderZeroKeyPower();
    updateStatus();

    // clear any live ghost reflection / ghost log on lang switch (will be re-triggered on next key moments in new lang)
    if (ghostReflectionEl) ghostReflectionEl.classList.add('hidden');
    if (ghostLogEl) {
      ghostLogEl.classList.add('hidden');
      ghostLogEl.classList.remove('wake');
      ghostLogEl.style.transition = '';
      ghostLogEl.style.opacity = '1';
    }

    // if panel open, refresh it
    if (promptTemplatesPanel && !promptTemplatesPanel.classList.contains('hidden')) {
      openPromptTemplatesPanel(currentPromptTemplateId || undefined);
    }

    // Re-apply data-i18n / placeholder / aria inside the injected chat root.
    // This makes language switch fully reactive for the chat UI (headers, buttons, forms, etc.)
    // without relying on full-document re-scan. Japanese is first-class end-to-end.
    if (chatRoot) {
      applyTranslations(newLang, chatRoot, { silent: true });
    }
  });

  // keyboard escape for panels
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (promptTemplatesPanel && !promptTemplatesPanel.classList.contains('hidden'))
        closePromptTemplatesPanel();
      else if (keysModal && !keysModal.classList.contains('hidden')) closeKeysModal();
    }
  });

  // Make the experience subtitle reflect reality (we already updated in HTML separately)
}

// Public API
export function initChat(): void {
  if (typeof document === 'undefined') return;
  mountChat();
}
