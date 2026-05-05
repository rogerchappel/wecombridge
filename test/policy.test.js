import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluatePolicy, normalizePayload } from '../src/index.js';

test('allows commands in allowed rooms with required mention', () => {
  const payload = normalizePayload({ roomId: 'agent-lab', text: '/ping', mentions: ['bot'] });
  const decision = evaluatePolicy(payload, { allowedRooms: ['agent-lab'], requireMention: true, botUserId: 'bot' });
  assert.equal(decision.allowed, true);
});

test('blocks disallowed rooms and commands', () => {
  const payload = normalizePayload({ roomId: 'random', text: '/delete', mentions: ['bot'] });
  const decision = evaluatePolicy(payload, { allowedRooms: ['agent-lab'], allowedCommands: ['ping'], requireMention: true, botUserId: 'bot' });
  assert.equal(decision.allowed, false);
  assert.equal(decision.reasons.length, 2);
});
