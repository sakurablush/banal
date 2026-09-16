/**
 * Shared helpers for EN source + locale overlay parity tests.
 */

export function missingOverlayKeys(
  expectedKeys: readonly string[],
  overlay: Record<string, unknown>
): string[] {
  return expectedKeys.filter((key) => overlay[key] === undefined);
}

export function extraOverlayKeys(
  expectedKeys: readonly string[],
  overlay: Record<string, unknown>
): string[] {
  const expected = new Set(expectedKeys);
  return Object.keys(overlay).filter((key) => !expected.has(key));
}
