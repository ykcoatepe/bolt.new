import { create } from 'zustand';

type Provider = 'openai' | 'google' | 'anthropic';

interface ApiKeysState {
  openai?: string;
  google?: string;
  anthropic?: string;
  getKey: (provider: Provider) => string | undefined;
  setKey: (provider: Provider, key: string) => void;
  clearKey: (provider: Provider) => void;
  load: () => void;
  persist: () => void;
}

const STORAGE_KEY = 'bolt.apiKeys';

export const useApiKeysStore = create<ApiKeysState>((set, get) => ({
  getKey: (provider) => get()[provider],
  setKey: (provider, key) => set({ [provider]: key }),
  clearKey: (provider) => set({ [provider]: undefined }),
  load: () => {
    if (typeof localStorage === 'undefined') {
      return;
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);

      if (raw) {
        set(JSON.parse(raw));
      }
    } catch {}
  },
  persist: () => {
    if (typeof localStorage === 'undefined') {
      return;
    }

    const { openai, google, anthropic } = get();

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ openai, google, anthropic }));
  },
}));
