import type { CompletionRequest, GatewayError, ProviderAdapter } from './types';
import { OpenRouterAdapter } from './openrouter';
import { OllamaAdapter } from './ollama';
import { LMStudioAdapter } from './lmstudio';

export type ProviderName = 'openrouter' | 'ollama' | 'lmstudio';

export interface GatewayManager {
  getAdapter(): ProviderAdapter;
  setProvider(name: ProviderName): void;
  getActiveProvider(): ProviderName;
  stream(request: CompletionRequest): AsyncGenerator<string, void, unknown>;
}

class GatewayManagerImpl implements GatewayManager {
  private activeProvider: ProviderName = 'openrouter';
  private adapters: Record<ProviderName, ProviderAdapter>;

  constructor() {
    this.adapters = {
      openrouter: new OpenRouterAdapter(),
      ollama: new OllamaAdapter(),
      lmstudio: new LMStudioAdapter(),
    };
  }

  getAdapter(): ProviderAdapter {
    return this.adapters[this.activeProvider];
  }

  setProvider(name: ProviderName): void {
    this.activeProvider = name;
  }

  getActiveProvider(): ProviderName {
    return this.activeProvider;
  }

  async *stream(request: CompletionRequest): AsyncGenerator<string, void, unknown> {
    yield* this.getAdapter().stream(request);
  }
}

// Server-side singleton — safe because Next.js API routes run in Node.js process
let _manager: GatewayManagerImpl | null = null;

export function getGatewayManager(): GatewayManager {
  if (!_manager) {
    _manager = new GatewayManagerImpl();
  }
  return _manager;
}

export function isGatewayError(err: unknown): err is GatewayError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    'message' in err &&
    'provider' in err
  );
}
