export function createStreamingReply(payload, options = {}) {
  const chunks = Array.isArray(options.chunks) && options.chunks.length > 0
    ? options.chunks.map(String)
    : defaultChunks(payload);
  return chunks.map((chunk, index) => ({
    event: index === chunks.length - 1 ? 'reply.done' : 'reply.delta',
    id: `${payload.id}:${index}`,
    roomId: payload.roomId,
    text: chunk,
    final: index === chunks.length - 1
  }));
}

export async function* streamReply(payload, options = {}) {
  for (const frame of createStreamingReply(payload, options)) {
    yield frame;
  }
}

function defaultChunks(payload) {
  const command = payload.command ? `/${payload.command.name}` : 'message';
  return [
    `received ${command}`,
    ` from ${payload.sender}`,
    ` in ${payload.roomId}`
  ];
}
