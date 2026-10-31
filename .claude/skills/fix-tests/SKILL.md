---
name: fix-tests
description: Run the test suite, diagnose failures, and fix them until green. Use when tests are failing locally or in CI.
argument-hint: '[test file or pattern]'
---

Get the tests passing for `$ARGUMENTS` (or the whole unit suite if none is given).

1. Run `pnpm test -- $ARGUMENTS`. Read the first failure fully before you touch anything.
2. Work out whether the bug is in the source, a stale assertion, test setup or mocks (`src/__tests__/setup.ts`), or async/timer handling.
3. Fix the root cause with the smallest change:
   - Wrong behavior: fix the source.
   - Intended behavior changed: update the assertion, and say so.
   - Never delete or `.skip` a test to get green without telling the user.
4. Re-run only the affected file until it passes, then run the full `pnpm test` once.
5. If the failures are in Playwright (`test/`), use `pnpm test:e2e <spec>`. Check that `GITHUB_TOKEN` is set before assuming a code bug.
6. Finish with `pnpm lint:fix && pnpm check`. Summarize each fix and say which side (source or test) it was on.
