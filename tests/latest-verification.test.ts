import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  getLatestVerificationSnapshot,
  readmeVerificationPhrase,
  syncReadmeVerification,
} from '../src/lib/latest-verification';

describe('latest-verification', () => {
  it('reads the newest date-stamped snapshot', () => {
    const snapshot = getLatestVerificationSnapshot();
    expect(snapshot).not.toBeNull();
    expect(snapshot!.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(snapshot!.verified + snapshot!.failed).toBeLessThanOrEqual(snapshot!.totalTools);
  });

  it('syncReadmeVerification is a no-op when README already matches', () => {
    const snapshot = getLatestVerificationSnapshot();
    expect(snapshot).not.toBeNull();

    const readmePath = join(process.cwd(), 'README.md');
    const before = readFileSync(readmePath, 'utf8');
    expect(before).toContain(readmeVerificationPhrase(snapshot!));

    const { updated } = syncReadmeVerification();
    expect(updated).toBe(false);
    expect(readFileSync(readmePath, 'utf8')).toBe(before);
  });
});
