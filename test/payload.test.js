import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizePayload } from '../src/index.js';

test('normalizes common WeCom-ish payload fields', () => {
  const payload = normalizePayload({ chat_id: 'room-a', user_id: 'u1', content: '/ping now' }, 'inline');
  assert.equal(payload.type, 'command');
  assert.equal(payload.roomId, 'room-a');
  assert.deepEqual(payload.command, { name: 'ping', args: ['now'] });
});

test('rejects unsupported explicit payload type', () => {
  assert.throws(() => normalizePayload({ type: 'webhook' }), /unsupported payload type/);
});
