import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { readPayloadFile, fixtureName } from './payload.js';
import { evaluatePolicy } from './policy.js';
import { createStreamingReply } from './stream.js';

export async function loadPolicy(inputDir, explicitPolicyPath) {
  const policyPath = explicitPolicyPath ?? path.join(inputDir, 'policy.json');
  try {
    return JSON.parse(await readFile(policyPath, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return {};
    throw error;
  }
}

export async function inspectFixtures(inputDir, options = {}) {
  const entries = await readdir(inputDir, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json') && entry.name !== 'policy.json')
    .map((entry) => path.join(inputDir, entry.name))
    .sort();
  const policy = await loadPolicy(inputDir, options.policyPath);
  const items = [];
  for (const file of files) {
    const payload = await readPayloadFile(file);
    const decision = evaluatePolicy(payload, policy);
    const stream = decision.allowed ? createStreamingReply(payload, options.stream ?? {}) : [];
    items.push({
      fixture: fixtureName(file),
      file,
      payload: summarizePayload(payload),
      decision,
      stream
    });
  }
  const report = {
    generatedAt: new Date(0).toISOString(),
    inputDir,
    totals: {
      fixtures: items.length,
      allowed: items.filter((item) => item.decision.allowed).length,
      blocked: items.filter((item) => !item.decision.allowed).length,
      streamFrames: items.reduce((sum, item) => sum + item.stream.length, 0)
    },
    policy,
    items
  };
  if (options.outputDir) await writeReport(options.outputDir, report);
  return report;
}

export async function writeReport(outputDir, report) {
  await mkdir(outputDir, { recursive: true });
  await writeFile(path.join(outputDir, 'report.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  await writeFile(path.join(outputDir, 'report.md'), renderMarkdown(report), 'utf8');
}

export function renderMarkdown(report) {
  const lines = [
    '# wecombridge inspection report',
    '',
    `- fixtures: ${report.totals.fixtures}`,
    `- allowed: ${report.totals.allowed}`,
    `- blocked: ${report.totals.blocked}`,
    `- stream frames: ${report.totals.streamFrames}`,
    '',
    '## Fixtures',
    ''
  ];
  for (const item of report.items) {
    lines.push(`### ${item.fixture}`);
    lines.push('');
    lines.push(`- room: ${item.payload.roomId}`);
    lines.push(`- sender: ${item.payload.sender}`);
    lines.push(`- command: ${item.payload.command?.name ?? 'none'}`);
    lines.push(`- allowed: ${item.decision.allowed ? 'yes' : 'no'}`);
    if (item.decision.reasons.length > 0) lines.push(`- reasons: ${item.decision.reasons.join('; ')}`);
    lines.push(`- stream frames: ${item.stream.length}`);
    lines.push('');
  }
  return `${lines.join('\n')}\n`;
}

function summarizePayload(payload) {
  return {
    id: payload.id,
    type: payload.type,
    roomId: payload.roomId,
    sender: payload.sender,
    text: payload.text,
    timestamp: payload.timestamp,
    mentions: payload.mentions,
    command: payload.command
  };
}
