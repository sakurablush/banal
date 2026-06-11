/**
 * Tool Verification Script
 *
 * Verifies that all tools in the database have working URLs.
 * Can be run manually or via GitHub Actions for weekly verification.
 *
 * Usage: npx tsx scripts/verify-tools.ts
 *
 * Output: Writes results to verification-results.json
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

interface VerificationReport {
  timestamp: string;
  totalTools: number;
  verified: number;
  failed: number;
  errors: number;
  results: VerificationResult[];
}

const TIMEOUT_MS = 10000;
const CONCURRENCY = 5; // Don't hammer servers too hard

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
    results,
  };

  return report;
}

async function main() {
  const report = await verifyAllTools();

  // Write results to file
  const outputPath = path.join(process.cwd(), 'verification-results.json');
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));

  // Summary
  console.log('\n=== Verification Complete ===');
  console.log(`Total tools: ${report.totalTools}`);
  console.log(`Verified (OK): ${report.verified}`);
  console.log(`Failed (HTTP error): ${report.failed}`);
  console.log(`Errors (network/timeout): ${report.errors}`);
  console.log(`\nResults written to: ${outputPath}`);

  // List failures
  const failures = report.results.filter((r) => !r.ok);
  if (failures.length > 0) {
    console.log('\n=== Failed Tools ===');
    failures.forEach((f) => {
      console.log(`- ${f.name} (${f.url}): ${f.status} ${f.error || ''}`);
    });
  }

  // Exit with error code if too many failures
  const failureRate = failures.length / report.totalTools;
  if (failureRate > 0.1) {
    console.error(`\nWarning: ${Math.round(failureRate * 100)}% of tools failed verification!`);
    process.exit(1);
  }
}

main().catch(console.error);
