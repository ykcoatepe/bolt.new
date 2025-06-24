import { describe, it, expect, vi } from 'vitest';

// mock the ai package used by stream-text.ts
const fakeChunks = [
  { type: 'response-metadata', foo: 'bar' },
  { type: 'delta', text: 'hi' },
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
import { safeIterable } from './stream-text';

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
    expect(received).toContainEqual(expect.objectContaining({ type: 'delta', text: 'hi' }));
  });

  it('safeIterable filters unknown chunks', async () => {
    async function* make() {
      yield { type: 'response-metadata' } as any;
      yield { type: 'delta', text: 'Hi' } as any;
    }

    const received: any[] = [];
    for await (const chunk of safeIterable(make())) {
      received.push(chunk);
    }

    expect(received).toEqual([{ type: 'delta', text: 'Hi' }]);
  });
});
