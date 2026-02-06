# Project Guidelines

## Code Style

- TypeScript is strict and ES2022 with bundler resolution; keep explicit return types on exports and use the `~/*` alias (see [tsconfig.json](../tsconfig.json)).
- Formatting is Prettier-driven (2 spaces, no semicolons, single quotes, Tailwind plugin) in [prettier.config.js](../prettier.config.js).
- ESLint uses Next core-web-vitals, type-checked rules, and `simple-import-sort` in [eslint.config.mjs](../eslint.config.mjs).

## Architecture

- App Router only: layout wires fonts, theme provider, and analytics in [src/app/layout.tsx](../src/app/layout.tsx).
- Home page is a server component that fetches GitHub data and passes it into client/server UI in [src/app/page.tsx](../src/app/page.tsx).
- Server data lives in [src/server/index.ts](../src/server/index.ts) using Octokit helpers in [src/server/octokit.ts](../src/server/octokit.ts) (GitHub API requests only).
- Client components are explicitly marked with `"use client"` (example: [src/components/client/hero.tsx](../src/components/client/hero.tsx)).

## Build and Test

- Install: `pnpm install`
- Dev: `pnpm dev` (Turbopack enabled by config)
- Lint + typecheck: `pnpm check`
- Unit tests (Vitest): `pnpm test`
- E2E (Playwright): `pnpm test:e2e`

## Project Conventions

- Server-only components live under [src/components/server](../src/components/server); client-only components live under [src/components/client](../src/components/client).
- General components that are neither server- nor client-only live in [src/components](../src/components).
- Shared hooks/utils can live in [src/components/utils](../src/components/utils) or [src/lib](../src/lib) depending on context.
- Prefer [src/components/utils](../src/components/utils) for UI-adjacent helpers and [src/lib](../src/lib) for general-purpose utilities/types.
- Keep the slow-mode simulation path intact (`slowmode` search param used in [src/app/page.tsx](../src/app/page.tsx)).
- UI primitives come from [src/components/ui](../src/components/ui) and should be shadcn components only; avoid introducing new styling systems.

## Integration Points

- GitHub API access uses Octokit with `GITHUB_TOKEN` (server only) via [src/server/octokit.ts](../src/server/octokit.ts); this layer is for GitHub API requests only.
- Env validation is centralized in [src/env.js](../src/env.js); `SKIP_ENV_VALIDATION` is supported in [next.config.js](../next.config.js).

## Security

- Never expose `GITHUB_TOKEN` to the client; only read it through [src/env.js](../src/env.js).
- Avoid mixed-content assets; prefer `next/image` and the existing remote image allowlist in [next.config.js](../next.config.js).
