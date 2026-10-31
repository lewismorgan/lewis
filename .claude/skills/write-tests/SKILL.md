---
name: write-tests
description: Write or extend tests for a component, route handler, or util in this repo, picking Vitest or Playwright correctly. Use when asked to add tests, cover a component, or test a new feature.
argument-hint: <path to the file under test>
---

Write focused tests for `$ARGUMENTS` (or the file just changed if none is given).

1. Read the target and classify it:
   - Client component (`'use client'`), shared component, or util in `src/lib`: **Vitest** test at `<dir>/__tests__/<name>.test.tsx`.
   - Async server component (`src/components/server/`), or behavior that only shows up on the rendered page: **Playwright** spec in `test/`.
   - Route handler in `src/app/api/`: Vitest, calling the exported `GET` directly with Octokit mocked.
2. If a test file already exists, extend it instead of creating a new one. Match the style of a sibling test.
3. Cover the main render path, each interaction, and the empty/error/slow-mode states that apply. Keep it to one concern per test, with small inline fixtures typed from `~/lib/types`.
4. Run only the new file: `pnpm test -- <file>` or `pnpm test:e2e <spec>`. Iterate until it passes.
5. Finish with `pnpm lint:fix` and `pnpm check`.

Don't change source code to make a test pass unless you've found a real bug. If you do, report it.
