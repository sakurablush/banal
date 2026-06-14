/**
 * Local-first key storage for the API Playground.
 *
 * Persistent keys use sessionStorage. Session-only keys live in
 * sessionStorage and are intended for shared machines.
 */

import { maskKey } from './utils';
import type { PlaygroundKeyMode, PlaygroundProviderId } from './types';

export type { PlaygroundKeyMode } from './types';

const STORAGE_KEY = 'banal-api-keys-v1';

// Core providers that use the shared key storage
type CoreProvider = 'groq' | 'gemini' | 'hf' | 'ovh-anon';

// Stored keys type (for persistent storage)
type StoredKeys = Partial<Record<CoreProvider, string>>;

// Session keys type (maps playground provider ID to key)
type SessionKeys = Partial<Record<PlaygroundProviderId, string>>;

const SESSION_STORAGE_KEY = 'banal-api-keys-session-v1';

// Mapping from PlaygroundProviderId to CoreProvider (for shared key storage)
const PLAYGROUND_TO_CORE: Record<PlaygroundProviderId, CoreProvider | null> = {
  groq: 'groq',
  gemini: 'gemini',
  huggingface: 'hf',
  ovh: 'ovh-anon',
  'open-meteo': null, // no key needed
};

function loadPersistentKeys(): StoredKeys {
  if (typeof sessionStorage === 'undefined') return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function savePersistentKeys(keys: StoredKeys): void {
  if (typeof sessionStorage === 'undefined') return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
  } catch {
    // quota or incognito — conversation still works this session
  }
}

function getStoredApiKey(provider: CoreProvider): string | null {
  const keys = loadPersistentKeys();
  return keys[provider] || null;
}

function storeApiKey(provider: CoreProvider, key: string): void {
  if (!key || typeof key !== 'string') return;
  const trimmed = key.trim();
  if (!trimmed) return;
  const keys = loadPersistentKeys();
  keys[provider] = trimmed;
  savePersistentKeys(keys);
}

function clearApiKey(provider: CoreProvider): void {
  const keys = loadPersistentKeys();
  delete keys[provider];
  savePersistentKeys(keys);
}

function getAllStoredKeys(): StoredKeys {
  return loadPersistentKeys();
}

function readSessionKeys(): SessionKeys {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeSessionKeys(keys: SessionKeys): void {
  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(keys));
  } catch {
    // Session storage can be unavailable in hardened browser modes.
  }
}

export function getPlaygroundKey(
  provider: PlaygroundProviderId,
  mode: PlaygroundKeyMode = 'persistent'
): string | null {
  if (provider === 'open-meteo') return null;

  if (mode === 'session') {
    return readSessionKeys()[provider] || null;
  }

  const core = PLAYGROUND_TO_CORE[provider];
  return core ? getStoredApiKey(core) : null;
}

export function setPlaygroundKey(
  provider: PlaygroundProviderId,
  key: string,
  mode: PlaygroundKeyMode = 'persistent'
): void {
  const trimmed = key.trim();
  if (!trimmed || provider === 'open-meteo') return;

  if (mode === 'session') {
    const keys = readSessionKeys();
    keys[provider] = trimmed;
    writeSessionKeys(keys);
    return;
  }

  const core = PLAYGROUND_TO_CORE[provider];
  if (core) {
    storeApiKey(core, trimmed);
  }
}

export function clearPlaygroundKey(
  provider: PlaygroundProviderId,
  mode: PlaygroundKeyMode = 'persistent'
): void {
  if (provider === 'open-meteo') return;

  if (mode === 'session') {
    const keys = readSessionKeys();
    delete keys[provider];
    writeSessionKeys(keys);
    return;
  }

  const core = PLAYGROUND_TO_CORE[provider];
  if (core) {
    clearApiKey(core);
  }
}

export function clearAllPlaygroundKeys(mode: PlaygroundKeyMode | 'all' = 'all'): void {
  if (mode === 'session' || mode === 'all') {
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // Session storage can be unavailable in hardened browser modes.
    }
  }

  if (mode === 'persistent' || mode === 'all') {
    (['groq', 'gemini', 'hf', 'ovh-anon'] as CoreProvider[]).forEach((provider) =>
      clearApiKey(provider)
    );
  }
}

export function hasPlaygroundKey(
  provider: PlaygroundProviderId,
  mode: PlaygroundKeyMode = 'persistent'
): boolean {
  return getPlaygroundKey(provider, mode) !== null;
}

export function getSavedKeyMask(
  provider: PlaygroundProviderId,
  mode: PlaygroundKeyMode = 'persistent'
): string {
  const key = getPlaygroundKey(provider, mode);
  return key ? maskKey(key) : '';
}

export function getAllPersistentKeys(): Record<string, string> {
  return getAllStoredKeys() as Record<string, string>;
}
