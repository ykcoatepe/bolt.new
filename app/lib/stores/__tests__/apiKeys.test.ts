import { describe, it, expect, beforeEach } from 'vitest';
import { useApiKeysStore } from '~/lib/stores/apiKeys';

declare const localStorage: Storage;

beforeEach(() => {
  localStorage.clear();
  useApiKeysStore.setState({ openai: undefined, google: undefined, anthropic: undefined });
});

describe('apiKeys store', () => {
  it('persists keys to localStorage', () => {
    const store = useApiKeysStore.getState();
    store.setKey('openai', 'a');
    store.setKey('google', 'b');
    store.setKey('anthropic', 'c');
    store.persist();
    expect(JSON.parse(localStorage.getItem('bolt.apiKeys')!)).toEqual({
      openai: 'a',
      google: 'b',
      anthropic: 'c',
    });
  });

  it('loads keys from localStorage', () => {
    localStorage.setItem('bolt.apiKeys', JSON.stringify({ openai: 'x' }));

    const store = useApiKeysStore.getState();
    store.load();
    expect(store.getKey('openai')).toBe('x');
  });
});
