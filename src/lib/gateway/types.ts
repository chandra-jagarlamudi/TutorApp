export type MessageRole = 'user' | 'assistant' | 'system';

export interface GatewayMessage {
  role: MessageRole;
  content: string;
}

export interface CompletionRequest {
  messages: GatewayMessage[];
  model: string;
  systemPrompt?: string;
}

export interface GatewayError {
  code: string;
  message: string;
  provider: string;
}

export interface ProviderAdapter {
  stream(request: CompletionRequest): AsyncGenerator<string, void, unknown>;
  listModels(): Promise<string[]>;
}
