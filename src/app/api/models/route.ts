import { getGatewayManager, isGatewayError } from '@/lib/gateway/manager';

export async function GET() {
  const manager = getGatewayManager();

  try {
    const models = await manager.listModels();
    return Response.json({ models });
  } catch (err) {
    if (isGatewayError(err)) {
      return Response.json(
        { error: err.message, code: err.code, provider: err.provider },
        { status: 503 }
      );
    }
    return Response.json({ error: 'Failed to fetch models' }, { status: 500 });
  }
}
