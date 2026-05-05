import { mkdir, rm, writeFile } from 'node:fs/promises';
import { inspectFixtures } from '../src/index.js';

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
const report = await inspectFixtures('fixtures/sample');
await writeFile('dist/sample-report.json', `${JSON.stringify(report, null, 2)}\n`);
console.log('build ok');
