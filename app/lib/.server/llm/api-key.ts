import { env } from 'node:process';
import type { Provider } from '~/lib/stores/apiConfig';

export interface APIConfig {
  provider: Provider;
  apiKey: string;
}

export function getAPIConfig(cloudflareEnv: Env, override?: APIConfig): APIConfig {
  if (override) {
    return override;
  }

  const anthropic = env.ANTHROPIC_API_KEY || cloudflareEnv.ANTHROPIC_API_KEY;

  if (anthropic) {
    return { provider: 'anthropic', apiKey: anthropic };
  }

  const openai = env.OPENAI_API_KEY || cloudflareEnv.OPENAI_API_KEY;

  if (openai) {
    return { provider: 'openai', apiKey: openai };
  }

  const google = env.GOOGLE_API_KEY || cloudflareEnv.GOOGLE_API_KEY;

  if (google) {
    return { provider: 'google', apiKey: google };
  }

  throw new Error('No API key provided');
}
