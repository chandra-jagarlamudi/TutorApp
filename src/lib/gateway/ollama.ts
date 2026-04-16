import type { CompletionRequest, GatewayError, ProviderAdapter } from './types';

function makeGatewayError(code: string, message: string): GatewayError {
  return { code, message, provider: 'ollama' };
}

export class OllamaAdapter implements ProviderAdapter {
  private host: string;

  constructor() {
    this.host = process.env.OLLAMA_HOST ?? 'http://localhost:11434';
  }

  async *stream(request: CompletionRequest): AsyncGenerator<string, void, unknown> {
    const messages = request.systemPrompt
      ? [{ role: 'system', content: request.systemPrompt }, ...request.messages]
      : request.messages;

    let response: Response;
    try {
      response = await fetch(`${this.host}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: request.model, messages, stream: true }),
      });
    } catch (err) {
      throw makeGatewayError(
        'ollama_unavailable',
        `Ollama is unreachable at ${this.host}. Make sure Ollama is running. (${String(err)})`
      );
    }

    if (!response.ok) {
      let errorMsg = `Ollama returned ${response.status}`;
      try {
        const body = await response.json() as { error?: string };
        if (body.error) errorMsg = body.error;
      } catch { /* ignore */ }
      throw makeGatewayError('ollama_error', errorMsg);
    }

    if (!response.body) {
      throw makeGatewayError('ollama_error', 'No response body from Ollama');
    }

    // Ollama streams NDJSON, one JSON object per line
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
          if (!trimmed) continue;
          try {
            const parsed = JSON.parse(trimmed) as {
              message?: { content?: string };
              done?: boolean;
            };
            if (parsed.message?.content) yield parsed.message.content;
            if (parsed.done) return;
          } catch { /* skip malformed lines */ }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  async listModels(): Promise<string[]> {
    let response: Response;
    try {
      response = await fetch(`${this.host}/api/tags`);
    } catch (err) {
      throw makeGatewayError('ollama_unavailable', `Ollama is unreachable at ${this.host}. Make sure Ollama is running. (${String(err)})`);
    }
    if (!response.ok) {
      throw makeGatewayError('ollama_error', `Ollama tags endpoint returned ${response.status}`);
    }
    const body = await response.json() as { models?: Array<{ name: string }> };
    return (body.models ?? []).map((m) => m.name);
  }
}
