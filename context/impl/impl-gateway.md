---
created: "2026-04-16T00:00:00Z"
last_edited: "2026-04-16T00:00:00Z"
---
# Implementation Tracking: Model Gateway

Build site: context/plans/build-site.md

| Task | Status | Notes |
|------|--------|-------|
| T-001 | DONE | OpenRouter adapter with SSE streaming, API key from env |
| T-002 | DONE | Model forwarded via CompletionRequest.model to OpenRouter |
| T-003 | DONE | GatewayError with code/message/provider on HTTP errors and network failures |
| T-004 | DONE | Ollama adapter, NDJSON streaming, configurable host via OLLAMA_HOST |
| T-005 | DONE | ECONNREFUSED/network error → GatewayError code=ollama_unavailable |
| T-006 | DONE | LM Studio adapter, SSE streaming, configurable host via LMSTUDIO_HOST |
| T-007 | DONE | Network error → GatewayError code=lmstudio_unavailable |
| T-012 | DONE | API key from env in OpenRouterAdapter, never returned in API response |
| T-013 | DONE | Unified SSE format: data: {"token": "..."} + data: [DONE] regardless of provider |
| T-014 | DONE | GatewayManager.setProvider() switches on next call, POST /api/provider |
| T-019 | DONE | GET /api/models → {models: string[]} from active provider |
| T-020 | DONE | GatewayError thrown on unreachable → 503 with {error, code, provider} |
| T-031 | TODO | Streaming terminal signal |
