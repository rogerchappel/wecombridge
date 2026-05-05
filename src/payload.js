import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { WeComBridgeError, assertObject } from './errors.js';

const EVENT_TYPES = new Set(['message', 'command', 'stream', 'system']);

export function normalizePayload(raw, source = '<memory>') {
  assertObject(raw, 'payload');
  const id = stringOr(raw.id, fallbackId(source, raw));
  const type = stringOr(raw.type, inferType(raw));
  if (!EVENT_TYPES.has(type)) {
    throw new WeComBridgeError(`unsupported payload type: ${type}`, {
      code: 'UNSUPPORTED_PAYLOAD_TYPE',
      details: { source, type }
    });
  }
  const roomId = stringOr(raw.roomId ?? raw.room_id ?? raw.chatId ?? raw.chat_id, 'direct');
  const sender = stringOr(raw.sender ?? raw.from ?? raw.userId ?? raw.user_id, 'unknown');
  const text = stringOr(raw.text ?? raw.content ?? raw.message, '');
  const timestamp = stringOr(raw.timestamp ?? raw.createdAt ?? raw.created_at, new Date(0).toISOString());
  const mentions = Array.isArray(raw.mentions) ? raw.mentions.map(String) : [];
  const command = raw.command ? normalizeCommand(raw.command) : parseCommand(text);

  return {
    id,
    type,
    roomId,
    sender,
    text,
    timestamp,
    mentions,
    command,
    raw,
    source
  };
}

export async function readPayloadFile(filePath) {
  const text = await readFile(filePath, 'utf8');
  try {
    return normalizePayload(JSON.parse(text), filePath);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new WeComBridgeError(`invalid JSON fixture: ${filePath}`, {
        code: 'INVALID_JSON',
        details: { filePath, message: error.message }
      });
    }
    throw error;
  }
}

function normalizeCommand(command) {
  if (typeof command === 'string') return { name: command, args: [] };
  assertObject(command, 'command');
  return {
    name: stringOr(command.name, ''),
    args: Array.isArray(command.args) ? command.args.map(String) : []
  };
}

function parseCommand(text) {
  const trimmed = text.trim();
  if (!trimmed.startsWith('/')) return null;
  const [name, ...args] = trimmed.slice(1).split(/\s+/).filter(Boolean);
  return name ? { name, args } : null;
}

function inferType(raw) {
  if (raw.command || String(raw.text ?? raw.content ?? '').trim().startsWith('/')) return 'command';
  return 'message';
}

function fallbackId(source, raw) {
  const basis = `${source}:${raw.timestamp ?? ''}:${raw.text ?? raw.content ?? ''}`;
  let hash = 0;
  for (const char of basis) hash = ((hash << 5) - hash + char.charCodeAt(0)) | 0;
  return `fixture-${Math.abs(hash)}`;
}

function stringOr(value, fallback) {
  if (value === undefined || value === null || value === '') return fallback;
  return String(value);
}

export function fixtureName(filePath) {
  return path.basename(filePath, path.extname(filePath));
}
