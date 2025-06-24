import { type ActionFunctionArgs } from '@remix-run/cloudflare';
import { generateText } from 'ai';
import { getAPIConfig, type APIConfig } from '~/lib/.server/llm/api-key';
import { getModel } from '~/lib/.server/llm/model';

export async function action(args: ActionFunctionArgs) {
  return testAction(args);
}

async function testAction({ context, request }: ActionFunctionArgs) {
  const { provider, apiKey } = await request.json<APIConfig>();

  try {
    const config = provider && apiKey ? { provider, apiKey } : getAPIConfig(context.cloudflare.env);

    await generateText({
      model: getModel(config.provider, config.apiKey),
      messages: [{ role: 'user', content: 'Hello' }],
      maxTokens: 1,
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'content-type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: String(error) }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }
}
