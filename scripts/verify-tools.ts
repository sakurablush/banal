/**
 * Tool Verification Script
 *
 * Verifies that all tools in the database have working URLs.
 * Also checks for duplicate URLs and reports lastVerified coverage.
 * Can be run manually or via GitHub Actions for weekly verification.
 *
 * Usage: npm run verify:tools
 *    or: npx tsx scripts/verify-tools.ts
 *
 * Outputs:
 *   - verification-results.json  (full per-tool report, gitignored)
 *   - docs/verification/YYYY-MM-DD.json  (date-stamped summary, safe to commit)
 */

import { zeroKeyTools, type ZeroKeyTool } from '../src/data/zero-key-tools';
import * as fs from 'fs';
import * as path from 'path';

interface VerificationResult {
  id: string;
  name: string;
  url: string;
  status: number | 'error';
  ok: boolean;
  responseTime: number;
  error?: string;
  timestamp: string;
}

interface DuplicateEntry {
  url: string;
  tools: { id: string; name: string }[];
}

interface VerificationReport {
  timestamp: string;
  totalTools: number;
  verified: number;
  failed: number;
  errors: number;
  duplicateUrls: DuplicateEntry[];
  lastVerifiedCoverage: {
    total: number;
    withDate: number;
    withoutDate: number;
    percentage: number;
  };
  results: VerificationResult[];
}

const TIMEOUT_MS = 10000;
const CONCURRENCY = 5; // Don't hammer servers too hard

/**
 * Pre-flight check: detect duplicate URLs in the tool database.
 * Same URL with different surfaces (web/api/cli) is allowed and reported separately.
 */
function detectDuplicateUrls(tools: ZeroKeyTool[]): DuplicateEntry[] {
  const urlMap = new Map<string, { id: string; name: string; surface: string }[]>();

  for (const tool of tools) {
    const existing = urlMap.get(tool.url) || [];
    existing.push({ id: tool.id, name: tool.name, surface: tool.surface });
    urlMap.set(tool.url, existing);
  }

  const duplicates: DuplicateEntry[] = [];
  for (const [url, tools] of urlMap) {
    if (tools.length > 1) {
      // Check if all entries have different surfaces (intentional multi-surface)
      const surfaces = new Set(tools.map((t) => t.surface));
      if (surfaces.size < tools.length) {
        // Same surface + same URL = true duplicate (should not exist)
        duplicates.push({ url, tools: tools.map(({ id, name }) => ({ id, name })) });
      }
    }
  }

  return duplicates;
}

/**
 * Calculate lastVerified coverage statistics.
 */
function calculateLastVerifiedCoverage(tools: ZeroKeyTool[]): {
  total: number;
  withDate: number;
  withoutDate: number;
  percentage: number;
} {
  const total = tools.length;
  const withDate = tools.filter((t) => t.lastVerified).length;
  const withoutDate = total - withDate;
  const percentage = Math.round((withDate / total) * 100);
  return { total, withDate, withoutDate, percentage };
}

async function verifyTool(tool: ZeroKeyTool): Promise<VerificationResult> {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(tool.url, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'BanalAI-ToolVerifier/1.0 (https://github.com/banal-ai)',
      },
      redirect: 'follow',
    });

    clearTimeout(timeoutId);

    return {
      id: tool.id,
      name: tool.name,
      url: tool.url,
      status: response.status,
      ok: response.ok || response.status === 405, // Some servers don't allow HEAD
      responseTime: Date.now() - startTime,
      timestamp,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    // Retry with GET if HEAD failed (some servers block HEAD)
    if (errorMessage.includes('abort') || errorMessage.includes('timeout')) {
      return {
        id: tool.id,
        name: tool.name,
        url: tool.url,
        status: 'error',
        ok: false,
        responseTime: Date.now() - startTime,
        error: 'Timeout',
        timestamp,
      };
    }

    // Try GET request as fallback
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

      const response = await fetch(tool.url, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'User-Agent': 'BanalAI-ToolVerifier/1.0',
        },
        redirect: 'follow',
      });

      clearTimeout(timeoutId);

      return {
        id: tool.id,
        name: tool.name,
        url: tool.url,
        status: response.status,
        ok: response.ok,
        responseTime: Date.now() - startTime,
        timestamp,
      };
    } catch (getError) {
      return {
        id: tool.id,
        name: tool.name,
        url: tool.url,
        status: 'error',
        ok: false,
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : String(error),
        timestamp,
      };
    }
  }
}

async function verifyBatch(tools: ZeroKeyTool[]): Promise<VerificationResult[]> {
  return Promise.all(tools.map(verifyTool));
}

async function verifyAllTools(): Promise<VerificationReport> {
  console.log(`Starting verification of ${zeroKeyTools.length} tools...`);
  console.log(`Concurrency: ${CONCURRENCY}, Timeout: ${TIMEOUT_MS}ms\n`);

  // Pre-flight checks
  const duplicateUrls = detectDuplicateUrls(zeroKeyTools);
  if (duplicateUrls.length > 0) {
    console.log('⚠️  Duplicate URLs detected (same URL + same surface):');
    for (const dup of duplicateUrls) {
      console.log(`  ${dup.url}`);
      for (const tool of dup.tools) {
        console.log(`    - ${tool.id} (${tool.name})`);
      }
    }
    console.log('');
  }

  const lastVerifiedCoverage = calculateLastVerifiedCoverage(zeroKeyTools);
  console.log(
    `📅 lastVerified coverage: ${lastVerifiedCoverage.withDate}/${lastVerifiedCoverage.total} (${lastVerifiedCoverage.percentage}%)`
  );
  if (lastVerifiedCoverage.withoutDate > 0) {
    console.log(
      `   ${lastVerifiedCoverage.withoutDate} tools missing lastVerified date\n`
    );
  }

  const results: VerificationResult[] = [];

  // Process in batches
  for (let i = 0; i < zeroKeyTools.length; i += CONCURRENCY) {
    const batch = zeroKeyTools.slice(i, i + CONCURRENCY);
    const batchResults = await verifyBatch(batch);
    results.push(...batchResults);

    // Progress indicator
    const progress = Math.round(((i + batch.length) / zeroKeyTools.length) * 100);
    console.log(`Progress: ${progress}% (${i + batch.length}/${zeroKeyTools.length})`);
  }

  const verified = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok && r.status !== 'error').length;
  const errors = results.filter((r) => r.status === 'error').length;

  const report: VerificationReport = {
    timestamp: new Date().toISOString(),
    totalTools: zeroKeyTools.length,
    verified,
    failed,
    errors,
    duplicateUrls,
    lastVerifiedCoverage,
    results,
  };

  return report;
}

interface VerificationSummary {
  date: string;            // YYYY-MM-DD
  generatedAt: string;     // full ISO timestamp
  totalTools: number;
  verified: number;
  failed: number;
  errors: number;
  successRate: number;     // verified / totalTools, 0..1
  lastVerifiedCoverage: VerificationReport['lastVerifiedCoverage'];
  failedTools: { id: string; name: string; url: string; status: number | null }[];
  duplicates: { url: string; ids: string[] }[];
  avgResponseTimeMs: number;
}

/**
 * Write a compact, date-stamped summary to docs/verification/YYYY-MM-DD.json.
 * Only this file is intended to be committed, so it stays small and comparable.
 */
function writeDatedSummary(report: VerificationReport): void {
  const date = report.timestamp.slice(0, 10); // YYYY-MM-DD

  const failedTools = report.results
    .filter((r) => !r.ok)
    .map((r) => ({ id: r.id, name: r.name, url: r.url, status: r.status }));

  const duplicates = report.duplicateUrls.map((d) => ({
    url: d.url,
    ids: d.entries.map((e) => e.id),
  }));

  const avgResponseTimeMs =
    report.results.length > 0
      ? Math.round(
          report.results.reduce((sum, r) => sum + r.responseTime, 0) /
            report.results.length,
        )
      : 0;

  const summary: VerificationSummary = {
    date,
    generatedAt: report.timestamp,
    totalTools: report.totalTools,
    verified: report.verified,
    failed: report.failed,
    errors: report.errors,
    successRate:
      report.totalTools > 0
        ? Math.round((report.verified / report.totalTools) * 1000) / 1000
        : 0,
    lastVerifiedCoverage: report.lastVerifiedCoverage,
    failedTools,
    duplicates,
    avgResponseTimeMs,
  };

  const dir = path.join(process.cwd(), 'docs', 'verification');
  fs.mkdirSync(dir, { recursive: true });
  const outPath = path.join(dir, `${date}.json`);
  fs.writeFileSync(outPath, JSON.stringify(summary, null, 2) + '\n');
  console.log(`Summary written to ${path.relative(process.cwd(), outPath)}`);
}

async function main() {
  const report = await verifyAllTools();

  // Write full results (gitignored, used locally / by CI)
  const outputPath = path.join(process.cwd(), 'verification-results.json');
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));

  // Write date-stamped summary (safe to commit; small, comparable over time)
  writeDatedSummary(report);

  // Summary
  console.log('\n=== Verification Complete ===');
  console.log(`Total tools: ${report.totalTools}`);
  console.log(`Verified (OK): ${report.verified}`);
  console.log(`Failed (HTTP error): ${report.failed}`);
  console.log(`Errors (network/timeout): ${report.errors}`);
  console.log(
    `lastVerified coverage: ${report.lastVerifiedCoverage.withDate}/${report.lastVerifiedCoverage.total} (${report.lastVerifiedCoverage.percentage}%)`
  );
  console.log(`\nResults written to: ${outputPath}`);

  // List failures
  const failures = report.results.filter((r) => !r.ok);
  if (failures.length > 0) {
    console.log('\n=== Failed Tools ===');
    failures.forEach((f) => {
      console.log(`- ${f.name} (${f.url}): ${f.status} ${f.error || ''}`);
    });
  }

  // List tools missing lastVerified
  const missingVerified = zeroKeyTools.filter((t) => !t.lastVerified);
  if (missingVerified.length > 0) {
    console.log(`\n=== Tools Missing lastVerified (${missingVerified.length}) ===`);
    missingVerified.slice(0, 20).forEach((t) => {
      console.log(`- ${t.name} (${t.id})`);
    });
    if (missingVerified.length > 20) {
      console.log(`  ... and ${missingVerified.length - 20} more`);
    }
  }

  // Exit with error code if too many failures
  const failureRate = failures.length / report.totalTools;
  if (failureRate > 0.1) {
    console.error(`\n⚠️  ${Math.round(failureRate * 100)}% of tools failed verification!`);
    process.exit(1);
  }

  // Warn about duplicate URLs
  if (report.duplicateUrls.length > 0) {
    console.error(`\n⚠️  ${report.duplicateUrls.length} duplicate URL(s) found — please merge or fix.`);
    process.exit(1);
  }
}

main().catch(console.error);
