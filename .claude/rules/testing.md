---
paths:
  - 'src/**/__tests__/**'
  - '**/*.test.ts'
  - '**/*.test.tsx'
  - 'test/**'
  - 'vitest.config.mts'
  - 'playwright.config.ts'
---

# Testing rules

## Where tests go

- Unit tests (Vitest + React Testing Library) go in a `__tests__/` folder next to the source, e.g. `src/components/client/__tests__/hero.test.tsx`.
- E2E tests (Playwright) go in `test/*.spec.ts`.
- **Async server components (`src/components/server/`) get Playwright tests only.** Vitest can't render async server components.
- Shadcn primitives in `src/components/ui/` aren't tested.
- Shared mocks (e.g. `next/navigation`) live in `src/__tests__/setup.ts`; extend that file instead of redefining mocks per test.

## Vitest

- Globals are on and the environment is jsdom. Import the subject via `~/…`.
- No real network: stub Octokit/fetch with `vi.mock`. Reset in `afterEach`.
- Use fake timers only when needed, and restore them afterwards. Slow mode delays should be faked, not awaited.
- Assert on roles, labels and visible text, not classNames. Avoid snapshots of animated or random content.
- For `next-themes` consumers, mock the theme hook to control light and dark.

## Playwright

- Use role, label or test-id locators. Never use `page.waitForTimeout()`; wait on `expect(locator)`, the URL or responses.
- Keep tests independent, with no serial mode. Prefer assertions over full-page screenshots.
- The dev server starts automatically from `playwright.config.ts` and needs `GITHUB_TOKEN`.
