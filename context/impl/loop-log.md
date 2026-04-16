---
created: "2026-04-16T00:00:00Z"
last_edited: "2026-04-16T00:00:00Z"
---
# Loop Log

### Wave 1 — 2026-04-16
- T-001–007: Gateway adapters (OpenRouter SSE, Ollama NDJSON, LM Studio SSE) — DONE. Files: src/lib/gateway/*. Build P, Tests N/A. Next: T-012,T-013,T-014
- T-008: Subject prompts (6 subjects + shared guardrail) — DONE. Files: src/lib/prompts/subjects.ts. Build P, Tests N/A. Next: T-015,T-022
- T-009: SQLite schema + addMessage() — DONE. Files: src/lib/db/schema.ts, src/lib/db/index.ts. Build P, Tests N/A. Next: T-016,T-017,T-018
- T-010: MarkdownRenderer with syntax highlighting — DONE. Files: src/components/MarkdownRenderer.tsx. Build P, Tests N/A. Next: T-025
- T-011: AppShell responsive layout foundation — DONE. Files: src/components/AppShell.tsx. Build P, Tests N/A. Next: T-024,T-034

### Wave 2 — 2026-04-16
- T-012: API key isolation — DONE. Files: src/lib/gateway/openrouter.ts (env read), src/app/api/chat/route.ts. Build P. Next: (unblocks chat API)
- T-013: Unified streaming format — DONE. Files: src/app/api/chat/route.ts. SSE format consistent. Build P. Next: T-021,T-028,T-031
- T-014: Runtime provider switching — DONE. Files: src/lib/gateway/manager.ts, src/app/api/provider/route.ts. Build P. Next: T-019,T-020,T-027
- T-015: Guardrails injection — DONE. Files: src/app/api/chat/route.ts. Server-side prompt lookup. Build P. Next: T-022
- T-016: Conversation retrieval — DONE. Files: src/app/api/conversations/route.ts, [id]/route.ts. Build P. Next: T-023,T-025,T-033
- T-017: Conversation metadata — DONE. Files: src/lib/db/index.ts, API routes. subject/model/timestamps. Build P. Next: T-032,T-033
- T-018: Conversation lifecycle — DONE. Files: src/app/api/conversations/route.ts, [id]/route.ts. Build P. Next: T-023,T-032

### Wave 3 — 2026-04-16
- T-019/T-020: Model list endpoint + error — DONE. Files: src/app/api/models/route.ts, adapters. Build P. Next: T-027
- T-021: StreamingMessage + useStreamingChat — DONE. Files: src/components/StreamingMessage.tsx, src/hooks/useStreamingChat.ts. Build P. Next: T-029
- T-022: SubjectSelector — DONE. Files: src/components/SubjectSelector.tsx. Build P. Next: T-034
- T-023: ConversationSidebar — DONE. Files: src/components/ConversationSidebar.tsx. Build P. Next: T-025
- T-024: Sidebar collapsible — DONE. Already in AppShell.tsx from T-011. Build P. Next: T-034
