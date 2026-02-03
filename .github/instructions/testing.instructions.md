---
description: 'Testing guidance for this Next.js app (Vitest + Playwright)'
applyTo: '**/{__tests__/**,*.test.ts,*.test.tsx,test/**}'
---

# Testing Instructions (Vitest + Playwright)

## Overview

- Target stack: Next 16.1.1 (App Router) + React 19.2.3, TypeScript 5.9 strict, pnpm 10.26.
- Unit: Vitest + React Testing Library; E2E: Playwright.
- Co-locate tests with source for fast discoverability; keep E2E in `test/`.

## Structure

- Unit tests live beside code in `__tests__` (e.g., `src/components/client/__tests__/hero.test.tsx`).
- Use `src/__tests__/setup.ts` for shared Vitest config/mocks; avoid per-test redefinition.
- Skip UI primitive snapshots unless behaviorful; prefer interaction/state tests for client components.
- E2E specs live in `test/` (e.g., `test/home.spec.ts`). Keep fixtures lean and deterministic.

## Next App Router Considerations

- Prefer server components to limit client mocking; only mark components with `"use client"` when hooks or browser APIs are required.
- Keep slow-mode behaviors covered: simulate delays without real network by stubbing fetch/Octokit in Vitest.
- Maintain accessibility in App Router layouts/pages; verify headings, roles, and focus order in both unit and E2E paths.

## Vitest Guidance

- Use `vi.mock` with `__mocks__` when stubbing Octokit or fetch; reset via `vi.resetAllMocks()`/`vi.restoreAllMocks()` in `afterEach`.
- Keep tests deterministic: no real network; seed fixtures inline or in small helpers. Use `vi.useFakeTimers()` only when needed and restore afterward.
- Assert behavior and ARIA roles over implementation details; avoid className snapshot brittleness.
- Keep tests small: one concern per test; extract local helpers in the file before introducing shared utils.

## Playwright Guidance

- Use robust locators (roles, labels, test IDs) instead of positional selectors; avoid `nth` unless unavoidable.
- Prefer assertion-style checks over full-page snapshots; reserve snapshots for stable, rarely changing surfaces.
- Keep tests isolated so retries stay fast; avoid serial mode unless a dependency is unavoidable.
- Avoid `page.waitForTimeout()` unless absolutely necessary. Prefer deterministic waits like `expect(locator).toBeVisible()`, `page.waitForSelector()`, `page.waitForURL()`, or waiting on network/response events.

## What to Cover

- Critical flows: hero render, theme toggle placement, repo slow-mode paths, hovercards showing Git data, footer links.
- Data guards: empty/error states for repos/commits/languages; slow-mode delays; missing env handling stays server-side.
- Accessibility: focusability, ARIA labels on interactive elements, keyboard navigation in hovercards/buttons.

## Running & Commands

- Unit: `pnpm test` (Vitest, colocated `__tests__`).
- Coverage: `pnpm test:coverage` (Vitest coverage report).
- E2E: `pnpm test:e2e` (Playwright in `test/`). Run after major UI changes.

## Authoring Tips

- Use `render` from RTL with sensible wrappers; avoid custom render unless necessary.
- For client components using `next-themes`, mock theme provider to control light/dark cases.
- When testing async UI (slow mode), await screen queries with timeouts matching simulated delays.
- Snapshot only stable markup (metadata, simple text); avoid snapshotting animated or randomized content.

## Maintenance

- Update tests when routing, data fetching, or Octokit shapes change; prefer type-safe fixtures mirroring `~/lib/types`.
- Document intentional gaps with TODOs; do not block small fixes but note missing coverage.
