# TutorApp

An AI-powered tutor chat application built for middle and high school students. Supports six academic subjects, real-time streaming responses, conversation history, and multiple LLM providers — including local models.

## Features

- **Six subjects** — Math, Science, English, History, Coding, General
- **Subject-aware tutor prompts** — each subject has a distinct persona and teaching approach with shared educational guardrails
- **Multi-provider LLM support** — OpenRouter (cloud), Ollama (local), LM Studio (local); switch providers at runtime without restart
- **Streaming responses** — tokens stream incrementally as the model generates them
- **Math rendering** — LaTeX formulas rendered via KaTeX (`$inline$` and `$$block$$`)
- **Markdown + syntax highlighting** — code blocks, lists, bold/italic, links
- **Conversation persistence** — SQLite stores full history; survives restarts
- **Conversation sidebar** — browse past chats, auto-titled from first message, delete
- **Mobile-friendly** — responsive layout, collapsible sidebar, input pinned to bottom

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | SQLite via `better-sqlite3` |
| Markdown | `react-markdown` + `remark-gfm` + `rehype-highlight` |
| Math | `remark-math` + `rehype-katex` |
| LLM providers | OpenRouter API, Ollama, LM Studio |

## Getting Started

```bash
npm install
```

Copy `.env.local.example` to `.env.local` and set your keys:

```env
OPENROUTER_API_KEY=sk-or-...
OLLAMA_HOST=http://localhost:11434      # optional, default shown
LM_STUDIO_HOST=http://localhost:1234   # optional, default shown
```

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  app/
    page.tsx                  # Entry point
    api/
      chat/route.ts           # Streaming chat completion endpoint
      conversations/          # CRUD for conversation history
      models/route.ts         # Model list from active provider
      provider/route.ts       # Runtime provider switching
  components/
    TutorApp.tsx              # Root component — wires everything together
    AppShell.tsx              # Responsive layout (sidebar + main + bottom bar)
    ConversationSidebar.tsx   # Conversation list with new/delete controls
    ChatMessages.tsx          # Message thread with auto-scroll
    StreamingMessage.tsx      # Incremental token display with typing indicator
    MarkdownRenderer.tsx      # Markdown + math + syntax highlighting
    MessageInput.tsx          # Compose area with Enter-to-send
    ModelPicker.tsx           # Provider switch + model selection
    SubjectSelector.tsx       # Six-subject toggle
  lib/
    db.ts                     # SQLite schema, queries, types
    prompts/subjects.ts       # Subject system prompts + guardrails
    providers/                # OpenRouter / Ollama / LM Studio adapters
context/
  kits/                       # CaveKit design documents
  plans/build-site.md         # 34-task build plan with coverage matrix
  impl/                       # Implementation tracking logs
```

## How It Was Built — CaveKit Methodology

This project was built using **CaveKit**, an AI-assisted development methodology that structures the design → plan → build loop with Claude Code.

### Phase 1 — Sketch (Kits)

Three implementation-agnostic **kits** were written before any code:

| Kit | What it defines |
|-----|-----------------|
| `cavekit-model-gateway.md` | Unified streaming abstraction over OpenRouter, Ollama, LM Studio with runtime switching and API key isolation |
| `cavekit-education-core.md` | Subject prompts, educational guardrails, SQLite conversation persistence, metadata |
| `cavekit-chat-ui.md` | Chat message display, streaming indicator, Markdown rendering, subject selector, model picker, conversation sidebar, mobile layout |

Kits define **requirements** and **acceptance criteria** only — no implementation details. Total: 21 requirements, 74 acceptance criteria.

### Phase 2 — Map (Build Site)

The kits were compiled into a **build site** (`context/plans/build-site.md`) — a tiered dependency graph of 34 discrete tasks:

```
Tier 0 (11 tasks) — no dependencies: adapters, SQLite schema, Markdown component
Tier 1  (7 tasks) — API key isolation, streaming unification, provider switching
Tier 2  (6 tasks) — model list endpoint, streaming display, subject selector, sidebar
Tier 3  (5 tasks) — chat messages, model picker, message input
Tier 4  (5 tasks) — integration: model refresh on switch, auto-title, mobile polish
```

Each task is tagged to a kit requirement and effort size (S/M).

### Phase 3 — Make (Implementation)

Tasks were implemented tier-by-tier using `ck:make`, working unblocked tasks in parallel. Each tier's output was verified against kit acceptance criteria before moving to the next.

Final coverage: **74/74 acceptance criteria (100%)**.

### Why this approach

- Kits kept design decisions separate from implementation choices
- The tiered build site made parallelism explicit — no guessing what was safe to build next
- Acceptance criteria gave a concrete definition of done for every task
- No speculative features: every line of code traces back to a kit requirement

---

## Using CaveKit for Development

### Greenfield project (starting from scratch)

```
# 1. Bootstrap context hierarchy
/ck:init

# 2. Write kits — one per domain/concern
/ck:sketch "describe what you're building"

# 3. Generate tiered build plan from all kits
/ck:map

# 4. Implement tier by tier (repeatable)
/ck:make

# 5. Verify coverage against kit criteria
/ck:scan
```

### Adding a new feature to an existing project

```
# 1. Write a kit for the new feature only
/ck:sketch "describe the new feature"

# 2. Regenerate build plan — merges new tasks with existing
/ck:map

# 3. Implement new tasks (existing completed tasks are skipped)
/ck:make

# 4. Gap check
/ck:scan
```

### Other useful commands

| Command | Purpose |
|---------|---------|
| `/ck:progress` | Show task completion status |
| `/ck:check` | Gap analysis + what's left after a make loop |
| `/ck:revise` | Trace a manual bug fix back into the kit |
| `/ck:design` | Generate or update `DESIGN.md` visual spec |
| `/ck:research` | Deep research to ground a kit in evidence before writing |
