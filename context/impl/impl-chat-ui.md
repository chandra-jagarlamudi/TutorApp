---
created: "2026-04-16T00:00:00Z"
last_edited: "2026-04-16T00:00:00Z"
---
# Implementation Tracking: Chat UI

Build site: context/plans/build-site.md

| Task | Status | Notes |
|------|--------|-------|
| T-010 | DONE | MarkdownRenderer.tsx with react-markdown, remark-gfm, rehype-highlight, custom components for code/pre/h1-3/ul/ol |
| T-011 | DONE | AppShell.tsx: sidebar (collapsible on mobile, fixed on desktop), scrollable main, pinned bottom bar |
| T-021 | DONE | StreamingMessage.tsx: incremental tokens + pulsing cursor indicator; useStreamingChat hook consumes SSE |
| T-022 | DONE | SubjectSelector.tsx: 6 subjects, active highlighted, accessible aria-pressed |
| T-023 | DONE | ConversationSidebar.tsx: list with title+timestamp, select, new button, per-item delete |
| T-024 | DONE | AppShell.tsx already has collapsible sidebar (hidden on mobile, toggle via hamburger) |
| T-025 | TODO | Chat message display |
| T-026 | TODO | Empty state |
| T-027 | TODO | Model picker |
| T-028 | TODO | Message composition |
| T-029 | TODO | Input clear + send disable |
| T-030 | TODO | Model list refresh |
| T-034 | TODO | Mobile layout verification |
