import type { CompletionRequest, GatewayError, ProviderAdapter } from './types';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

function makeGatewayError(code: string, message: string): GatewayError {
  return { code, message, provider: 'openrouter' };
}

export class OpenRouterAdapter implements ProviderAdapter {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY ?? '';
  }

  async *stream(request: CompletionRequest): AsyncGenerator<string, void, unknown> {
    const messages = request.systemPrompt
      ? [{ role: 'system', content: request.systemPrompt }, ...request.messages]
      : request.messages;

    let response: Response;
    try {
      response = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
          'HTTP-Referer': 'http://localhost:3000',
        },
        body: JSON.stringify({ model: request.model, messages, stream: true }),
      });
    } catch (err) {
      throw makeGatewayError('network_error', `Network error connecting to OpenRouter: ${String(err)}`);
    }

    if (!response.ok) {
      let errorMsg = `OpenRouter returned ${response.status}`;
      try {
        const body = await response.json() as { error?: { message?: string } };
        if (body.error?.message) errorMsg = body.error.message;
      } catch { /* ignore parse errors */ }
      throw makeGatewayError('openrouter_error', errorMsg);
    }

    if (!response.body) {
      throw makeGatewayError('openrouter_error', 'No response body from OpenRouter');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const data = trimmed.slice(5).trim();
          if (data === '[DONE]') return;
          try {
            const parsed = JSON.parse(data) as { choices?: Array<{ delta?: { content?: string } }> };
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) yield content;
          } catch { /* skip malformed SSE lines */ }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  async listModels(): Promise<string[]> {
    let response: Response;
    try {
      response = await fetch('https://openrouter.ai/api/v1/models', {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      });
    } catch (err) {
      throw makeGatewayError('network_error', `Network error fetching OpenRouter models: ${String(err)}`);
    }

    if (!response.ok) {
      throw makeGatewayError('openrouter_error', `OpenRouter models endpoint returned ${response.status}`);
    }

    const body = await response.json() as { data?: Array<{ id: string }> };
    return (body.data ?? []).map((m) => m.id);
  }
}
