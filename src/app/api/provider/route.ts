import { NextRequest } from 'next/server';
import { getGatewayManager } from '@/lib/gateway/manager';
import type { ProviderName } from '@/lib/gateway/manager';

const VALID_PROVIDERS: ProviderName[] = ['openrouter', 'ollama', 'lmstudio'];

export async function GET() {
  const manager = getGatewayManager();
  return Response.json({ provider: manager.getActiveProvider() });
}

export async function POST(req: NextRequest) {
  let provider: string;
  try {
    const body = await req.json() as { provider: string };
    provider = body.provider;
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!VALID_PROVIDERS.includes(provider as ProviderName)) {
    return new Response(
      JSON.stringify({ error: `Invalid provider. Must be one of: ${VALID_PROVIDERS.join(', ')}` }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const manager = getGatewayManager();
  manager.setProvider(provider as ProviderName);

  return Response.json({ provider: manager.getActiveProvider() });
}
