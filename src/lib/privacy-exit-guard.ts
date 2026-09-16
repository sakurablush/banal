/**
 * Best-effort beforeunload when prompt form data exists in sessionStorage.
 * Browsers show a generic system message — custom text is not allowed.
 */

import { hasSensitiveSessionData } from './storage-cleanup';

let attached = false;

function onBeforeUnload(e: BeforeUnloadEvent): void {
  if (!hasSensitiveSessionData()) return;
  e.preventDefault();
  e.returnValue = '';
}

export function initPrivacyExitGuard(): void {
  if (attached) return;
  attached = true;
  window.addEventListener('beforeunload', onBeforeUnload);
}

export function refreshPrivacyExitGuard(): void {
  // Listener stays registered; beforeunload checks storage each time.
}
