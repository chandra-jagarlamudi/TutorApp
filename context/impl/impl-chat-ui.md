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
| T-025 | DONE | ChatMessages.tsx: user/tutor bubble styling, chronological order, auto-scroll via useEffect+ref |
| T-026 | DONE | EmptyState in ChatMessages.tsx shown when messages=[] and !isStreaming |
| T-027 | DONE | ModelPicker.tsx: provider select + model select, fetches /api/models |
| T-028 | DONE | MessageInput.tsx: textarea, send button, Enter-to-send keyboard shortcut |
| T-029 | DONE | MessageInput clears after send; send button disabled when isStreaming |
| T-030 | DONE | ModelPicker useEffect depends on activeProvider — refetches on provider change |
| T-034 | DONE | AppShell: sidebar hidden on mobile, hamburger toggle, chat+bottomBar fill remaining height |
