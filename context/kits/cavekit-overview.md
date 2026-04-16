---
created: "2026-04-15T00:00:00Z"
last_edited: "2026-04-15T00:00:00Z"
---

# Cavekit Overview: Family Education Chat App

A tutor chat application for two middle/high school kids, powered by local and cloud LLMs, with a Claude-like conversational interface.

## Kit Index

| Kit | File | Description |
|-----|------|-------------|
| Model Gateway | cavekit-model-gateway.md | Unified abstraction over OpenRouter, Ollama, and LM Studio with streaming delivery and runtime provider switching |
| Education Core | cavekit-education-core.md | Subject-aware tutor prompts, educational guardrails, and conversation persistence |
| Chat UI | cavekit-chat-ui.md | Chat interface with message display, Markdown rendering, subject/model selection, conversation sidebar, and mobile layout |

## Dependency Graph

```
Chat UI
  |---> Model Gateway      (streaming completions, model list, provider switching)
  |---> Education Core     (conversation history, subject prompts, conversation lifecycle)

Education Core
  |---> Model Gateway      (passes system prompt + history to completions)

Model Gateway
  |---> (no kit dependencies — foundational layer)
```

**Build order:** Model Gateway -> Education Core -> Chat UI

## Coverage Summary

| Kit | Requirements | Acceptance Criteria |
|-----|-------------|-------------------|
| Model Gateway | 7 | 17 |
| Education Core | 6 | 24 |
| Chat UI | 8 | 33 |
| **Total** | **21** | **74** |

## Changelog
