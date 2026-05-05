const DEFAULT_POLICY = Object.freeze({
  allowedRooms: ['*'],
  allowedCommands: ['help', 'ping', 'summarize', 'inspect'],
  requireMention: false,
  botUserId: 'wecombridge'
});

export function createPolicy(input = {}) {
  return {
    ...DEFAULT_POLICY,
    ...input,
    allowedRooms: normalizeList(input.allowedRooms ?? DEFAULT_POLICY.allowedRooms),
    allowedCommands: normalizeList(input.allowedCommands ?? DEFAULT_POLICY.allowedCommands),
    botUserId: String(input.botUserId ?? DEFAULT_POLICY.botUserId)
  };
}

export function evaluatePolicy(payload, policyInput = {}) {
  const policy = createPolicy(policyInput);
  const reasons = [];
  if (!matchesList(payload.roomId, policy.allowedRooms)) {
    reasons.push(`room not allowed: ${payload.roomId}`);
  }
  if (policy.requireMention && !payload.mentions.includes(policy.botUserId)) {
    reasons.push(`missing required mention: ${policy.botUserId}`);
  }
  if (payload.command && !matchesList(payload.command.name, policy.allowedCommands)) {
    reasons.push(`command not allowed: ${payload.command.name}`);
  }
  return {
    allowed: reasons.length === 0,
    reasons,
    policy
  };
}

function normalizeList(value) {
  if (value === '*') return ['*'];
  if (!Array.isArray(value)) return [String(value)];
  return value.map(String).filter(Boolean);
}

function matchesList(value, allowed) {
  return allowed.includes('*') || allowed.includes(String(value));
}
