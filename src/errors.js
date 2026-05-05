export class WeComBridgeError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = 'WeComBridgeError';
    this.code = options.code ?? 'WECOMBRIDGE_ERROR';
    this.details = options.details;
  }
}

export function assertObject(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new WeComBridgeError(`${label} must be an object`, {
      code: 'INVALID_OBJECT',
      details: { label }
    });
  }
}
