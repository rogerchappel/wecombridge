# wecombridge docs

`wecombridge` is an MVP toolkit for local-first WeCom channel adapter development.

## MVP capabilities

1. Normalize local WeCom-ish JSON payload fixtures.
2. Evaluate group allowlist, command allowlist, and mention requirements.
3. Generate deterministic streaming reply frames for allowed payloads.
4. Write JSON and Markdown inspection reports.
5. Provide CLI and Node API smokes that run without network access.

## Non-goals

- Running a production WeCom bot.
- Managing live credentials.
- Sending messages to WeCom.
- Copying adjacent adapter implementations.

## Development loop

```sh
npm test
npm run check
npm run build
npm run smoke
bash scripts/validate.sh
```
