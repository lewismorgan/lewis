---
description: 'Generate a Vitest file for the current component following repo standards'
agent: 'agent'
tools: ['vscode', 'read', 'edit', 'search', 'context7/*']
---
# Generate Vitest test for current component

Mission:

- Write a focused Vitest + React Testing Library test file for the currently open component.
- Follow this repo’s testing/style rules (see .github/instructions/testing.instructions.md and typescript.instructions.md).

Scope & Preconditions:

- Prefer colocated tests under a __tests__ folder next to the component (e.g., src/components/client/__tests__/ComponentName.test.tsx).
- Use existing Vitest setup at src/__tests__/setup.ts.
- Apply the repo’s client/server split: only mark the test subject with 'use client' when it is a client component.

Inputs:

- ${input:componentPath:${file}}
- ${input:testPath:${componentPathDir}/__tests__/${componentFileBase}.test.tsx}

Workflow:

1) Inspect the component to understand its props, hooks, and external helpers; identify any side effects (time, theme, routing, data fetching).
2) Plan minimal, deterministic cases that cover the primary render/interaction paths; avoid snapshots unless markup is stable.
3) Add or update the test file at ${input:testPath}:
   - Import from the component using the ~ alias; use RTL utilities from the shared setup.
   - Mock external helpers (date/formatting, routing, theme, network) with vi.mock to keep tests deterministic.
   - Provide realistic sample props and assert user-visible text/ARIA roles/state; avoid implementation details.
   - Include interaction tests only when the component has interactive behavior; otherwise keep to render assertions.
4) Keep TypeScript strict: explicit types where needed; no any/unknown.
5) Save the file and format per repo defaults; do not alter unrelated files.

Output Expectations:

- A single test file at ${input:testPath} covering the key behaviours of the component.
- Clear test names and minimal fixtures; no unused imports.

Quality Assurance:

- Verify imports use the ~ alias where applicable.
- Tests pass with pnpm test (do not run automatically unless requested).
- Keep console noise out; avoid leaking real dates or timers into assertions.
