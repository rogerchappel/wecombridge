# Safety model

`wecombridge` V1 is intentionally offline.

## Allowed in V1

- Reading local JSON fixtures.
- Reading an optional local `policy.json`.
- Writing local report files when `--output` is provided.
- Emitting deterministic streaming frame objects.

## Not allowed in V1

- Network calls.
- Credential discovery.
- Telemetry.
- Sending real WeCom messages.
- Loading private chat exports into committed fixtures.

## Fixture hygiene

Use synthetic payloads. If a real incident transcript is needed for debugging, reduce it to the smallest possible redacted fixture before committing.
