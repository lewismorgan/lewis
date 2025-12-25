---
agent: 'agent'
model: GPT-4.1 (copilot)
tools: ['codebase','search']
description: 'Create a new UI component for the Next.js + TypeScript site'
---
You are helping create a new React component in this Next.js project.

Guidance:
- Confirm requirements: purpose, inputs/props, state, data needs, a11y, and styling source.
- Prefer server components unless client interactivity or browser APIs are required.
- Keep props typed, small, and documented inline when non-obvious.
- Suggest tests only if scoped and lightweight (RTL/Playwright) once the test stack is added.
- Align with repository patterns and lint/prettier settings; avoid new dependencies unless justified.
