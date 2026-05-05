import test from 'node:test';
import assert from 'node:assert/strict';
import { createStreamingReply, normalizePayload, streamReply } from '../src/index.js';

test('creates deterministic streaming reply frames', () => {
  const payload = normalizePayload({ id: 'x', roomId: 'r', sender: 's', text: '/ping' });
  const frames = createStreamingReply(payload);
  assert.equal(frames.length, 3);
  assert.equal(frames.at(-1).final, true);
});

test('streams reply frames as async iterator', async () => {
  const payload = normalizePayload({ id: 'x', text: 'hello' });
  const frames = [];
  for await (const frame of streamReply(payload, { chunks: ['a', 'b'] })) frames.push(frame);
  assert.deepEqual(frames.map((frame) => frame.text), ['a', 'b']);
});
