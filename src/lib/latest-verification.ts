/**
 * Read the newest committed URL-audit snapshot from docs/verification/.
 * Used by README sync scripts and content-integrity tests.
 */

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export interface VerificationSnapshot {
  date: string;
  totalTools: number;
  verified: number;
  failed: number;
  successRate: number;
}

const SNAPSHOT_FILE_RE = /^\d{4}-\d{2}-\d{2}\.json$/;

/** Parenthetical copied into README after weekly audits. */
export function readmeVerificationPhrase(snapshot: VerificationSnapshot): string {
  return `(${snapshot.verified}/${snapshot.totalTools} as of ${snapshot.date} — bots and rate limits cause false negatives)`;
}

const README_VERIFICATION_RE =
  /\(\d+\/\d+ as of \d{4}-\d{2}-\d{2} — bots and rate limits cause false\s+negatives\)/;

export function getLatestVerificationSnapshot(cwd = process.cwd()): VerificationSnapshot | null {
  const dir = join(cwd, 'docs', 'verification');
  if (!existsSync(dir)) return null;

  const files = readdirSync(dir)
    .filter((name) => SNAPSHOT_FILE_RE.test(name))
    .sort()
    .reverse();
  if (files.length === 0) return null;

  const raw = JSON.parse(readFileSync(join(dir, files[0]!), 'utf8')) as {
    date: string;
    totalTools: number;
    verified: number;
    failed: number;
    successRate: number;
  };

  if (raw.verified + raw.failed > raw.totalTools) {
    throw new Error(
      `Invalid verification snapshot ${files[0]}: verified (${raw.verified}) + failed (${raw.failed}) exceeds totalTools (${raw.totalTools})`
    );
  }

  return {
    date: raw.date,
    totalTools: raw.totalTools,
    verified: raw.verified,
    failed: raw.failed,
    successRate: raw.successRate,
  };
}

/** Replace the README audit parenthetical with the latest snapshot stats. */
export function syncReadmeVerification(cwd = process.cwd()): {
  updated: boolean;
  snapshot: VerificationSnapshot | null;
} {
  const snapshot = getLatestVerificationSnapshot(cwd);
  if (!snapshot) return { updated: false, snapshot: null };

  const readmePath = join(cwd, 'README.md');
  const before = readFileSync(readmePath, 'utf8');
  const phrase = readmeVerificationPhrase(snapshot);

  let after = before.replace(README_VERIFICATION_RE, phrase);
  if (after === before) {
    after = before.replace(
      /still respond \(\d+\/\d+ as of \d{4}-\d{2}-\d{2} — bots and rate limits cause false\s+negatives\)/,
      `still respond ${phrase}`
    );
  }

  if (after !== before) {
    writeFileSync(readmePath, after, 'utf8');
    return { updated: true, snapshot };
  }

  if (!before.includes(phrase)) {
    console.warn(
      'README.md: no verification parenthetical found — add a line like "still respond (0/0 as of YYYY-MM-DD — …)" in What you get'
    );
  }

  return { updated: false, snapshot };
}
