---
applyTo: "**/*.ts,**/*.tsx"
description: "TypeScript + Next.js guidance"
---
# TypeScript & Next.js Standards

- Use strict typing; favor explicit return types for exported functions and components.
- Prefer server components by default; use client components only when state, effects, or browser-only APIs are required.
- Co-locate component-specific styles and utilities; keep shared logic in `src/lib` or `src/components`.
- Use Next.js data-fetching primitives (`fetch` with revalidation, route handlers) and avoid ad-hoc REST helpers unless needed.
- Handle errors with typed results or narrowed discriminated unions; avoid silent catches.
- Keep React components small; lift state thoughtfully and avoid prop drilling via context only when necessary.
