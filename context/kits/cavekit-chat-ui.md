---
created: "2026-04-15T00:00:00Z"
last_edited: "2026-04-15T00:00:00Z"
---

# Cavekit: Chat UI

## Scope
Everything the user sees and interacts with: the chat conversation view, message composition, subject and model selection, conversation management sidebar, and responsive layout for phone and desktop use.

## Requirements

### R1: Chat Message Display
**Description:** Messages appear as visually distinct bubbles differentiating user messages from tutor responses, similar to Claude's chat interface.
**Acceptance Criteria:**
- [ ] User messages and tutor messages are visually distinguishable (different alignment, color, or styling)
- [ ] Messages appear in chronological order within a conversation
- [ ] The most recent message is visible without manual scrolling (auto-scroll to bottom)
- [ ] An empty state is shown when no conversation is active, prompting the user to start one
**Dependencies:** cavekit-education-core.md R4

### R2: Streaming Response Display
**Description:** Tutor responses appear token-by-token as they stream in, giving immediate feedback.
**Acceptance Criteria:**
- [ ] While a response is streaming, tokens appear incrementally in the tutor message bubble
- [ ] A visual indicator (e.g., cursor or animation) signals that the response is still generating
- [ ] Once streaming completes, the indicator disappears and the message appears in its final form
- [ ] The user can see partial responses while they are being generated
**Dependencies:** cavekit-model-gateway.md R7

### R3: Markdown Rendering
**Description:** Tutor responses render Markdown formatting for rich educational content.
**Acceptance Criteria:**
- [ ] Headers (h1-h3), bold, italic, and links render as formatted text rather than raw Markdown
- [ ] Ordered and unordered lists render with proper indentation and markers
- [ ] Fenced code blocks render with syntax highlighting and a monospace font
- [ ] Inline code renders with a distinct background or style
**Dependencies:** none

### R4: Subject Selector
**Description:** The user can choose a subject for the current conversation from the supported list.
**Acceptance Criteria:**
- [ ] All six subjects are selectable: Math, Science, English, History, Coding, General
- [ ] The currently active subject is visually indicated
- [ ] Selecting a subject when starting a new conversation associates that subject with the conversation
- [ ] The subject selector is accessible before or at the start of a new conversation
**Dependencies:** cavekit-education-core.md R1

### R5: Model Picker
**Description:** The user can choose which model to use from the currently active provider.
**Acceptance Criteria:**
- [ ] The model picker displays the list of available models from the active provider
- [ ] The user can select a model and subsequent messages in that conversation use the selected model
- [ ] The user can switch the active provider (OpenRouter, Ollama, LM Studio)
- [ ] The model list refreshes when the provider is switched
**Dependencies:** cavekit-model-gateway.md R4, cavekit-model-gateway.md R5

### R6: Conversation Sidebar
**Description:** A sidebar lists past conversations and provides controls to start new ones.
**Acceptance Criteria:**
- [ ] The sidebar displays a list of past conversations showing title and timestamp
- [ ] Selecting a conversation from the sidebar loads its full message history in the chat view
- [ ] A control to start a new conversation is present and visible
- [ ] A control to delete a conversation is available for each listed conversation
- [ ] The sidebar can be collapsed or hidden on smaller screens to maximize chat space
**Dependencies:** cavekit-education-core.md R4, cavekit-education-core.md R6

### R7: Message Composition
**Description:** The user can compose and send messages to the tutor.
**Acceptance Criteria:**
- [ ] A text input area is present for composing messages
- [ ] The user can submit a message by pressing a send control or using a keyboard shortcut
- [ ] The input area is cleared after a message is sent
- [ ] The send control is disabled while a response is actively streaming
**Dependencies:** cavekit-model-gateway.md R7

### R8: Mobile-Friendly Layout
**Description:** The interface is usable on phone-sized screens since the kids primarily use phones.
**Acceptance Criteria:**
- [ ] On viewports 480px wide or narrower, all interactive elements (input, send, subject selector, model picker) are reachable without horizontal scrolling
- [ ] On mobile viewports, the conversation sidebar does not permanently obscure the chat area
- [ ] Text in message bubbles is readable without zooming on a phone-sized screen (minimum 14px equivalent body text)
- [ ] The input area remains accessible (fixed to bottom or always in view) while scrolling through messages
**Dependencies:** none

## Out of Scope
- Authentication or login screens
- Per-kid profiles or personalization
- Admin dashboard or settings beyond subject/model selection
- File upload or image generation
- Voice input or text-to-speech

## Cross-References
- See also: cavekit-model-gateway.md (streaming completions, model list, provider switching)
- See also: cavekit-education-core.md (conversation history, subject list, conversation lifecycle)

## Changelog
