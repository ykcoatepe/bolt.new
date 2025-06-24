import { atom } from 'nanostores';

export type Provider = 'anthropic' | 'openai' | 'google';

export interface APIConfig {
  provider: Provider;
  apiKey: string;
}

const STORAGE_KEY = 'bolt_api_config';

export const apiConfigStore = atom<APIConfig | null>(initStore());

function initStore(): APIConfig | null {
  if (import.meta.env.SSR) {
    return null;
  }

  const data = localStorage.getItem(STORAGE_KEY);

  return data ? (JSON.parse(data) as APIConfig) : null;
}

export function setAPIConfig(config: APIConfig) {
  apiConfigStore.set(config);

  if (!import.meta.env.SSR) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }
}
