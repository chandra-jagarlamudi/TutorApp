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
| T-012 | TODO | API key isolation |
| T-013 | TODO | Unified streaming format |
| T-014 | TODO | Runtime provider switching |
| T-019 | TODO | Model list endpoint |
| T-020 | TODO | Model list error handling |
| T-031 | TODO | Streaming terminal signal |
