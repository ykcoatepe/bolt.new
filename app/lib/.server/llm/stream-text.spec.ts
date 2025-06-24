import { describe, it, expect, vi } from 'vitest';

// mock the ai package used by stream-text.ts
const fakeChunks = [
  { type: 'response-metadata', foo: 'bar' },
  { type: 'text-delta', textDelta: 'hi' },
  {
    type: 'finish',
    finishReason: 'stop',
    usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
  },
];

const fakeStream = new ReadableStream({
  start(controller) {
    for (const chunk of fakeChunks) {
      controller.enqueue(chunk);
    }
    controller.close();
  },
});

const fakeResult = { originalStream: fakeStream } as any;

vi.mock('ai', async () => {
  return {
    streamText: vi.fn(() => fakeResult),
    convertToCoreMessages: (m: any) => m,
  };
});

import { streamText } from './stream-text';

describe('streamText', () => {
  it('ignores response-metadata chunks', async () => {
    const env = { OPENAI_API_KEY: 'test-key' } as Env;
    const result = streamText([], env);
    const reader = (result as any).originalStream.getReader();
    const received: any[] = [];

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      received.push(value);
    }

    expect(received).not.toContainEqual(expect.objectContaining({ type: 'response-metadata' }));
    expect(received).toContainEqual(expect.objectContaining({ type: 'text-delta', textDelta: 'hi' }));
  });
});
