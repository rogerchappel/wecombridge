import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const outDir = await mkdtemp(path.join(tmpdir(), 'wecombridge-smoke-'));
try {
  const { stdout } = await execFileAsync(process.execPath, ['bin/wecombridge.js', 'inspect', 'fixtures/sample', '--output', outDir]);
  if (!stdout.includes('3 fixture')) throw new Error(`unexpected stdout: ${stdout}`);
  const report = JSON.parse(await readFile(path.join(outDir, 'report.json'), 'utf8'));
  if (report.totals.fixtures !== 3 || report.totals.allowed !== 1 || report.totals.blocked !== 2) {
    throw new Error(`unexpected report totals: ${JSON.stringify(report.totals)}`);
  }
  console.log('smoke ok');
} finally {
  await rm(outDir, { recursive: true, force: true });
}
