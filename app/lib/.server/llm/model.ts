import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import type { Provider } from '~/lib/stores/apiConfig';

export function getModel(provider: Provider, apiKey: string) {
  switch (provider) {
    case 'anthropic': {
      const anthropic = createAnthropic({ apiKey });
      return anthropic('claude-3-5-sonnet-20240620');
    }
    case 'openai': {
      const openai = createOpenAI({ apiKey });
      return openai('gpt-4o');
    }
    case 'google': {
      const google = createGoogleGenerativeAI({ apiKey });
      return google('gemini-1.5-pro-latest');
    }
    default: {
      throw new Error('Unknown provider');
    }
  }
}
