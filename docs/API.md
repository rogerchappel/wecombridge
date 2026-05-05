# API

## `normalizePayload(raw, source?)`

Converts common WeCom-ish field names into a stable payload shape.

## `evaluatePolicy(payload, policy?)`

Returns `{ allowed, reasons, policy }` for room allowlists, command allowlists, and required bot mentions.

## `createStreamingReply(payload, options?)`

Creates deterministic reply frames. This is an adapter sketch for tests and demos, not a live WeCom sender.

## `inspectFixtures(inputDir, options?)`

Reads fixture JSON files, applies policy, creates frames for allowed payloads, and optionally writes `report.json` and `report.md`.
