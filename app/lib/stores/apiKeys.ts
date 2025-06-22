import { map } from 'nanostores';

export interface ApiKeys {
  openai?: string;
  google?: string;
  anthropic?: string;
}

const STORAGE_KEY = 'bolt_api_keys';

function loadKeys(): ApiKeys {
  if (typeof localStorage === 'undefined') return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {}
  return {};
}

export const apiKeysStore = map<ApiKeys>(loadKeys());

apiKeysStore.subscribe((value) => {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
});
