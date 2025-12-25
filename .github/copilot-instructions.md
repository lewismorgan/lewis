---
description: "Repository-wide Copilot guidance for a Next.js + TypeScript personal site hosted on Vercel"
---
# Copilot Usage Guidelines

- Default to TypeScript, React function components, and Next.js App Router conventions.
- Prefer accessibility-first UI (semantic HTML, ARIA where needed, focus management on dialogs and menus).
- Keep changes small and incremental; prioritize clarity over cleverness.
- Honor existing lint/prettier rules; do not disable lint rules unless explicitly asked.
- Surface trade-offs and risks before large refactors; offer safer fallback options when time is tight.
- Avoid adding dependencies unless justified (performance, accessibility, or maintainability).
- Document non-obvious decisions directly in code comments or short README snippets when helpful.
