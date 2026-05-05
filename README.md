# wecombridge

Local-first WeCom fixture replay, group policy checks, and streaming reply adapter sketches for agent channel development.

`wecombridge` helps you design a WeCom / WeChat Work channel adapter without touching live credentials. It reads local JSON fixtures, applies explicit room/command/mention policy, and emits deterministic reports plus streaming reply frames that are easy to test in CI.

## Why this exists

This project is a fresh OSS idea inspired by the existence of small WeCom/OpenClaw adapter experiments, including [`vincentkoc/openclaw-plugin-wecom`](https://github.com/vincentkoc/openclaw-plugin-wecom). It does **not** copy that implementation. V1 is deliberately local-first: fixtures, policies, reports, and CLI smokes before any real network integration.

## Quickstart

```sh
npm install
npm test
npm run smoke
node bin/wecombridge.js inspect fixtures/sample --output out
```

Inspect the generated files:

```sh
cat out/report.md
cat out/report.json
```

## CLI

```sh
wecombridge --help
wecombridge inspect <fixture-dir> [--output <out-dir>] [--policy <policy.json>] [--json]
```

Example:

```sh
node bin/wecombridge.js inspect fixtures/sample --json
```

No network calls are made by the CLI. Inputs are local fixture files only.

## Fixture format

A fixture is a JSON file in a directory. `policy.json` is reserved for local policy.

```json
{
  "id": "msg-001",
  "type": "command",
  "roomId": "eng-oncall",
  "sender": "alice",
  "text": "/ping",
  "timestamp": "2026-05-06T06:00:00+10:00",
  "mentions": ["wecombridge"]
}
```

Policy example:

```json
{
  "allowedRooms": ["eng-oncall", "agent-lab"],
  "allowedCommands": ["ping", "summarize", "inspect"],
  "requireMention": true,
  "botUserId": "wecombridge"
}
```

## Library example

```js
import { inspectFixtures, streamReply } from 'wecombridge';

const report = await inspectFixtures('fixtures/sample');
console.log(report.totals);

for await (const frame of streamReply(report.items[0].payload)) {
  console.log(frame);
}
```

## Safety boundaries

- Local-first by design: no hidden network, credential scraping, telemetry, or publishing behavior.
- Policy defaults are explicit and inspectable.
- Group allowlists and command allowlists are checked before streaming reply frames are produced.
- Real WeCom API calls are out of scope for this MVP.

## Verify

```sh
npm test
npm run check
npm run build
npm run smoke
bash scripts/validate.sh
```

`scripts/validate.sh` runs the standard local checks and treats missing optional `agent-qc` as a skip.

## Project layout

- `src/` — library modules for payload normalization, policy, streaming, and inspection reports.
- `bin/wecombridge.js` — CLI entrypoint.
- `fixtures/sample/` — deterministic local fixtures.
- `test/` — Node test runner coverage.
- `examples/` — small library usage examples.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Small, reviewable changes with fixtures and tests are preferred.

## Security

See [SECURITY.md](SECURITY.md). Please do not submit real WeCom secrets, production chat exports, or private message content as fixtures.

## License

MIT
