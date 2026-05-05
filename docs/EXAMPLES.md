# Examples

## CLI smoke

```sh
node bin/wecombridge.js inspect fixtures/sample --output out
```

Expected summary:

```text
inspected 3 fixture(s): 1 allowed, 2 blocked
```

## JSON output

```sh
node bin/wecombridge.js inspect fixtures/sample --json
```

## Library

```sh
node examples/local-inspect.js
```
