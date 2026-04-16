import type { CompletionRequest, GatewayError, ProviderAdapter } from './types';

function makeGatewayError(code: string, message: string): GatewayError {
  return { code, message, provider: 'lmstudio' };
}

// LM Studio uses OpenAI-compatible chat completions API with SSE streaming
export class LMStudioAdapter implements ProviderAdapter {
  private host: string;

  constructor() {
    this.host = process.env.LMSTUDIO_HOST ?? 'http://localhost:1234';
  }

  async *stream(request: CompletionRequest): AsyncGenerator<string, void, unknown> {
    const messages = request.systemPrompt
      ? [{ role: 'system', content: request.systemPrompt }, ...request.messages]
      : request.messages;

    let response: Response;
    try {
      response = await fetch(`${this.host}/v1/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: request.model, messages, stream: true }),
      });
    } catch (err) {
      throw makeGatewayError(
        'lmstudio_unavailable',
        `LM Studio is unreachable at ${this.host}. Make sure LM Studio is running. (${String(err)})`
      );
    }

    if (!response.ok) {
      let errorMsg = `LM Studio returned ${response.status}`;
      try {
        const body = await response.json() as { error?: { message?: string } };
        if (body.error?.message) errorMsg = body.error.message;
      } catch { /* ignore */ }
      throw makeGatewayError('lmstudio_error', errorMsg);
    }

    if (!response.body) {
      throw makeGatewayError('lmstudio_error', 'No response body from LM Studio');
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
      response = await fetch(`${this.host}/v1/models`);
    } catch (err) {
      throw makeGatewayError('lmstudio_unavailable', `LM Studio is unreachable at ${this.host}. Make sure LM Studio is running. (${String(err)})`);
    }
    if (!response.ok) {
      throw makeGatewayError('lmstudio_error', `LM Studio models endpoint returned ${response.status}`);
    }
    const body = await response.json() as { data?: Array<{ id: string }> };
    return (body.data ?? []).map((m) => m.id);
  }
}
