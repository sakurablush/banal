/**
 * Local-first key storage for the API Playground.
 *
 * Persistent keys reuse the existing `banal-api-keys-v1` localStorage key so chat
 * and playground share Groq/HF/OVH credentials. Session-only keys live in
 * sessionStorage and are intended for shared machines.
 */

import {
  clearApiKey,
  getAllStoredKeys,
  getStoredApiKey,
  storeApiKey,
  type Provider as CoreProvider,
} from '../providers';
import { maskKey } from './utils';
import type { PlaygroundKeyMode, PlaygroundProviderId } from './types';

export type { PlaygroundKeyMode } from './types';

const SESSION_STORAGE_KEY = 'banal-api-keys-session-v1';

type SessionKeys = Partial<Record<PlaygroundProviderId, string>>;

const CORE_PROVIDER_BY_PLAYGROUND_ID: Record<PlaygroundProviderId, CoreProvider> = {
  groq: 'groq',
  huggingface: 'hf',
  ovh: 'ovh-anon',
  'open-meteo': 'ovh-anon',
};

const PLAYGROUND_CORE_PROVIDERS: CoreProvider[] = ['groq', 'hf', 'ovh-anon'];

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

  return getStoredApiKey(CORE_PROVIDER_BY_PLAYGROUND_ID[provider]);
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

  storeApiKey(CORE_PROVIDER_BY_PLAYGROUND_ID[provider], trimmed);
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

  clearApiKey(CORE_PROVIDER_BY_PLAYGROUND_ID[provider]);
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
    PLAYGROUND_CORE_PROVIDERS.forEach((provider) => clearApiKey(provider));
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
  return getAllStoredKeys();
}
