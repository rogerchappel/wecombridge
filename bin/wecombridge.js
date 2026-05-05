#!/usr/bin/env node
import { inspectFixtures } from '../src/index.js';

const USAGE = `wecombridge - local-first WeCom fixture adapter\n\nUsage:\n  wecombridge --help\n  wecombridge inspect <fixture-dir> [--output <out-dir>] [--policy <policy.json>] [--json]\n\nNo network calls are made. All inputs are local fixture files.`;

async function main(argv) {
  if (argv.length === 0 || argv.includes('--help') || argv.includes('-h')) {
    console.log(USAGE);
    return;
  }
  const [command, inputDir] = argv;
  if (command !== 'inspect' || !inputDir) throw new Error('expected: inspect <fixture-dir>');
  const options = parseOptions(argv.slice(2));
  const report = await inspectFixtures(inputDir, { outputDir: options.output, policyPath: options.policy });
  if (options.json) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`inspected ${report.totals.fixtures} fixture(s): ${report.totals.allowed} allowed, ${report.totals.blocked} blocked`);
    if (options.output) console.log(`wrote ${options.output}/report.json and ${options.output}/report.md`);
  }
}

function parseOptions(args) {
  const options = { json: false };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === '--json') options.json = true;
    else if (arg === '--output') options.output = args[++i];
    else if (arg === '--policy') options.policy = args[++i];
    else throw new Error(`unknown option: ${arg}`);
  }
  return options;
}

main(process.argv.slice(2)).catch((error) => {
  console.error(`wecombridge: ${error.message}`);
  process.exitCode = 1;
});
