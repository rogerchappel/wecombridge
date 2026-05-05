import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { inspectFixtures, renderMarkdown } from '../src/index.js';

test('inspects sample fixtures and writes reports', async () => {
  const out = await mkdtemp(path.join(tmpdir(), 'wecombridge-test-'));
  try {
    const report = await inspectFixtures('fixtures/sample', { outputDir: out });
    assert.deepEqual(report.totals, { fixtures: 3, allowed: 1, blocked: 2, streamFrames: 3 });
    const json = JSON.parse(await readFile(path.join(out, 'report.json'), 'utf8'));
    assert.equal(json.totals.allowed, 1);
    assert.match(await readFile(path.join(out, 'report.md'), 'utf8'), /blocked: 2/);
  } finally {
    await rm(out, { recursive: true, force: true });
  }
});

test('renders markdown summary', async () => {
  const report = await inspectFixtures('fixtures/sample');
  assert.match(renderMarkdown(report), /wecombridge inspection report/);
});
