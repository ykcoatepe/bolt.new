import { useApiKeysStore } from '~/lib/stores/apiKeys';

type CommonRequest = Omit<RequestInit, 'body'> & { body?: URLSearchParams };

export async function request(url: string, init?: CommonRequest) {
  if (import.meta.env.DEV) {
    const nodeFetch = await import('node-fetch');
    const https = await import('node:https');

    const agent = url.startsWith('https') ? new https.Agent({ rejectUnauthorized: false }) : undefined;

    return nodeFetch.default(url, { ...init, agent });
  }

  return fetch(url, init);
}

export async function fetchWithApiKeys(url: string, init?: CommonRequest) {
  const { openai, google, anthropic } = useApiKeysStore.getState();
  const headers = new Headers(init?.headers);

  if (openai) {
    headers.set('x-openai-key', openai);
  }

  if (google) {
    headers.set('x-google-key', google);
  }

  if (anthropic) {
    headers.set('x-anthropic-key', anthropic);
  }

  return request(url, { ...init, headers });
}
