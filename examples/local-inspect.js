import { inspectFixtures } from '../src/index.js';

const report = await inspectFixtures(new URL('../fixtures/sample', import.meta.url).pathname);
console.log(report.totals);
