---
created: "2026-04-15T00:00:00Z"
last_edited: "2026-04-15T00:00:00Z"
---

# Cavekit: Model Gateway

## Scope
Unified abstraction layer over all LLM providers. Any component that needs to send a prompt and receive a completion goes through this gateway. Handles provider switching, model discovery, streaming delivery, and API key isolation.

## Requirements

### R1: OpenRouter Adapter
**Description:** The gateway can send chat completion requests to OpenRouter and return streaming responses.
**Acceptance Criteria:**
- [ ] A chat completion request with a system prompt and message history sent to the OpenRouter adapter returns a streamed response
- [ ] The adapter forwards model selection to OpenRouter so the caller can choose which OpenRouter-hosted model to use
- [ ] If the OpenRouter API returns an error (invalid key, rate limit, model not found), the gateway surfaces a structured error with a human-readable message
**Dependencies:** none

### R2: Ollama Adapter
**Description:** The gateway can send chat completion requests to a local Ollama instance and return streaming responses.
**Acceptance Criteria:**
- [ ] A chat completion request sent to the Ollama adapter connects to a configurable host (defaulting to localhost:11434) and returns a streamed response
- [ ] If the Ollama instance is unreachable, the gateway returns a structured error indicating the local service is unavailable
**Dependencies:** none

### R3: LM Studio Adapter
**Description:** The gateway can send chat completion requests to a local LM Studio server and return streaming responses.
**Acceptance Criteria:**
- [ ] A chat completion request sent to the LM Studio adapter connects to a configurable host (defaulting to localhost:1234) and returns a streamed response
- [ ] If the LM Studio server is unreachable, the gateway returns a structured error indicating the local service is unavailable
**Dependencies:** none

### R4: Runtime Provider Switching
**Description:** The active provider (OpenRouter, Ollama, or LM Studio) can be changed at runtime without restarting the application.
**Acceptance Criteria:**
- [ ] A request to switch from one provider to another takes effect on the next chat completion call without requiring an application restart
- [ ] After switching providers, subsequent completion requests are routed to the newly selected provider
**Dependencies:** R1, R2, R3

### R5: Model List Endpoint
**Description:** The gateway can return a list of available models from whichever provider is currently active.
**Acceptance Criteria:**
- [ ] Requesting the model list from the active provider returns an array of model identifiers
- [ ] If the provider is unreachable, the endpoint returns a structured error rather than an empty list
**Dependencies:** R4

### R6: API Key Isolation
**Description:** The OpenRouter API key is stored server-side and never transmitted to the browser.
**Acceptance Criteria:**
- [ ] The API key is read from a server-side environment variable
- [ ] No API response or client-facing payload contains the API key value
- [ ] Requests from the browser do not need to include the API key; the server injects it
**Dependencies:** R1

### R7: Streaming Delivery
**Description:** Completions are delivered to the caller as a stream of incremental chunks, enabling real-time token-by-token display.
**Acceptance Criteria:**
- [ ] The gateway emits completion tokens incrementally as they arrive from the provider, rather than buffering the full response
- [ ] The streaming format is consistent regardless of which provider is active
- [ ] The stream includes a terminal signal so the consumer knows when the response is complete
**Dependencies:** R1, R2, R3

## Out of Scope
- Model fine-tuning or training
- Prompt caching or response caching
- Load balancing or failover across multiple providers simultaneously
- Token counting or cost tracking
- Provider-specific advanced parameters (temperature, top-p) beyond what is passed through transparently

## Cross-References
- See also: cavekit-chat-ui.md (consumes streaming completions and model list)
- See also: cavekit-education-core.md (supplies system prompts and history to completion requests)

## Changelog
