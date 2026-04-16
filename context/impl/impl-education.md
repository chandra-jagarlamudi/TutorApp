---
created: "2026-04-16T00:00:00Z"
last_edited: "2026-04-16T00:00:00Z"
---
# Implementation Tracking: Education Core

Build site: context/plans/build-site.md

| Task | Status | Notes |
|------|--------|-------|
| T-008 | DONE | 6 subject prompts (math, science, english, history, coding, general) with shared EDUCATIONAL_GUARDRAIL |
| T-009 | DONE | SQLite schema (conversations + messages), addMessage() writes and updates updated_at |
| T-015 | DONE | Guardrail injected server-side via getSystemPrompt(subject) in /api/chat — never client-trusted |
| T-016 | DONE | GET /api/conversations (list, ordered by updated_at), GET /api/conversations/[id] (full history) |
| T-017 | DONE | conversations table has subject, model, title, created_at, updated_at; /api/conversations/[id] returns all |
| T-018 | DONE | POST /api/conversations (create, returns id), DELETE /api/conversations/[id], 404 on missing |
| T-032 | TODO | Conversation auto-title |
| T-033 | TODO | Conversation list ordering |
