import { streamText as _streamText, convertToCoreMessages } from 'ai';
import { getAPIConfig, type APIConfig } from '~/lib/.server/llm/api-key';
import { getModel } from '~/lib/.server/llm/model';
import { MAX_TOKENS } from './constants';
import { getSystemPrompt } from './prompts';

interface ToolResult<Name extends string, Args, Result> {
  toolCallId: string;
  toolName: Name;
  args: Args;
  result: Result;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  toolInvocations?: ToolResult<string, unknown, unknown>[];
}

export type Messages = Message[];

export type StreamingOptions = Omit<Parameters<typeof _streamText>[0], 'model'>;

export function safeIterable<T extends { type: string }>(iterable: AsyncIterable<T>) {
  async function* generator() {
    for await (const chunk of iterable) {
      if (chunk.type === 'response-metadata') continue;
      if (!['delta', 'content', 'done'].includes(chunk.type)) continue;
      yield chunk;
    }
  }
  return generator();
}

export function streamText(messages: Messages, env: Env, options?: StreamingOptions, override?: APIConfig) {
  const config = getAPIConfig(env, override);

  const result = _streamText({
    model: getModel(config.provider, config.apiKey),
    system: getSystemPrompt(),
    maxTokens: MAX_TOKENS,
    headers: config.provider === 'anthropic' ? { 'anthropic-beta': 'max-tokens-3-5-sonnet-2024-07-15' } : undefined,
    messages: convertToCoreMessages(messages),
    ...options,
  });

  // filter out unknown chunk types emitted by newer LLM streams
  if ((result as any).originalStream instanceof ReadableStream) {
    (result as any).originalStream = (result as any).originalStream.pipeThrough(
      new TransformStream({
        async transform(chunk, controller) {
          async function* one() { yield chunk; }
          for await (const filtered of safeIterable(one())) {
            controller.enqueue(filtered);
          }
        },
      }),
    );
  }

  return result;
}
