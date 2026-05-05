import { access, readFile } from 'node:fs/promises';

const required = ['README.md', 'SECURITY.md', 'CONTRIBUTING.md', 'src/index.js', 'bin/wecombridge.js', 'fixtures/sample/policy.json'];
for (const file of required) await access(file);
const pkg = JSON.parse(await readFile('package.json', 'utf8'));
if (pkg.name !== 'wecombridge') throw new Error('package name must be wecombridge');
if (!pkg.bin?.wecombridge) throw new Error('missing wecombridge bin');
const readme = await readFile('README.md', 'utf8');
for (const phrase of ['local-first', 'No network calls', 'Quickstart']) {
  if (!readme.includes(phrase)) throw new Error(`README missing phrase: ${phrase}`);
}
console.log('check ok');
