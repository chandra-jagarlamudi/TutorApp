---
created: "2026-04-15T00:00:00Z"
last_edited: "2026-04-15T00:00:00Z"
---

# Cavekit: Education Core

## Scope
Tutor identity, subject-aware prompting, content guardrails, and conversation persistence. This domain owns what the tutor "is" and remembers, but delegates the actual model communication to the Model Gateway.

## Requirements

### R1: Subject-Specific System Prompts
**Description:** Each supported subject has a distinct system prompt that shapes the tutor's persona and pedagogical approach.
**Acceptance Criteria:**
- [ ] System prompts exist for all six subjects: Math, Science, English, History, Coding, and General
- [ ] The Math prompt instructs the tutor to encourage showing work and step-by-step reasoning
- [ ] The English prompt instructs the tutor to ask about essay or writing goals before diving in
- [ ] Each subject prompt is retrievable by subject identifier
- [ ] Selecting a different subject returns a different system prompt
**Dependencies:** none

### R2: Educational Guardrails
**Description:** All system prompts include a base guardrail that keeps interactions educational and age-appropriate for middle and high school students.
**Acceptance Criteria:**
- [ ] Every subject system prompt contains instructions to stay on educational topics
- [ ] Every subject system prompt contains instructions to keep content appropriate for middle/high school age range
- [ ] Every subject system prompt contains instructions to avoid off-topic or inappropriate content
- [ ] The guardrail text is consistent across all six subject prompts (shared base, not duplicated independently)
**Dependencies:** R1

### R3: Conversation Persistence
**Description:** Conversation messages are persisted to a local database so they survive application restarts.
**Acceptance Criteria:**
- [ ] When a message is added to a conversation, it is written to persistent storage
- [ ] After the application restarts, previously stored conversations are still retrievable
- [ ] No external database service is required; storage is local to the machine
**Dependencies:** none

### R4: Conversation Retrieval
**Description:** Past conversations can be loaded by ID and listed in summary form.
**Acceptance Criteria:**
- [ ] Given a conversation ID, the full message history for that conversation is returned in chronological order
- [ ] A list of all conversations can be retrieved, returning metadata (not full message bodies)
- [ ] The conversation list is ordered by most recently active first
**Dependencies:** R3

### R5: Conversation Metadata
**Description:** Each conversation carries metadata for display and organization.
**Acceptance Criteria:**
- [ ] Each conversation has a title that is auto-generated from the content of the first user message
- [ ] Each conversation records which subject was selected
- [ ] Each conversation records which model was used
- [ ] Each conversation records a creation timestamp
- [ ] Each conversation records a last-updated timestamp
**Dependencies:** R3

### R6: Conversation Lifecycle
**Description:** Users can create new conversations and delete existing ones.
**Acceptance Criteria:**
- [ ] Creating a new conversation returns a unique conversation identifier
- [ ] A new conversation is associated with a selected subject and model
- [ ] Deleting a conversation removes it and all its messages from persistent storage
- [ ] Attempting to retrieve a deleted conversation returns a not-found indicator
**Dependencies:** R3

## Out of Scope
- Cross-conversation memory or context sharing between chats
- Retrieval-augmented generation (RAG) over past conversations
- User accounts or per-kid profiles
- Curriculum tracking, progress reports, or grading
- Custom or user-editable system prompts

## Cross-References
- See also: cavekit-model-gateway.md (system prompts and history are passed to the gateway for completions)
- See also: cavekit-chat-ui.md (reads conversation history and subject list for display)

## Changelog
