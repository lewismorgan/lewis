<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# lewis — personal landing page

Single-page Next.js (App Router) site deployed on Vercel at lewismorgan.dev. The page pulls GitHub profile and repo data via Octokit. pnpm, Tailwind v4, shadcn/ui, Vitest + Playwright.

## Commands

- `pnpm dev` — dev server (localhost:3000)
- `pnpm check` — ESLint + `tsc --noEmit`. **`pnpm build` does NOT catch type errors** (`ignoreBuildErrors: true` in `next.config.js`), so always use `check`.
- `pnpm lint:fix` — ESLint autofix incl. Prettier formatting and import sorting
- `pnpm test` — Vitest unit tests; `pnpm test -- <path>` for one file
- `pnpm test:e2e` — Playwright (starts `pnpm dev` itself; needs a real `GITHUB_TOKEN` in `.env`)

## Before finishing a change

1. `pnpm lint:fix` once at the end (don't hand-format; Prettier owns style: no semicolons, single quotes, 2 spaces).
2. `pnpm check && pnpm test`.
3. UI or data-flow changes: also `pnpm test:e2e`, or say that you skipped it.

## Architecture

- `src/app/page.tsx` — the whole site; async server component, `revalidate = 3600`. `layout.tsx` wires fonts, `ThemeProvider` (next-themes), Vercel Analytics, footer.
- `src/server/` — GitHub data. `octokit.ts` = raw GitHub API calls only; `index.ts` = shaping, caching (`unstable_cache`), repo blacklist, slow-mode delays.
- `src/app/api/git/*` — route handlers used by client components (repo list, README dialog).
- `src/components/server/` server-only, `src/components/client/` `'use client'` only, `src/components/` shared, `src/components/ui/` shadcn primitives (generated; lint-ignored; don't hand-edit or add other UI libraries).
- `src/components/utils/` UI-adjacent helpers; `src/lib/` general utils and types (`~/lib/types`).
- Keep the `?slowmode=true` path working — it's a deliberate demo feature.

## Conventions

- Import via the `~/*` alias (→ `src/*`). File names are kebab-case.
- Explicit return types on exported functions; type-only imports use inline `type`.
- Prefer server components; add `'use client'` only for hooks or browser APIs.

## Env & security

- Env schema lives in `src/env.js` (t3 env). Read env only through `env` from `~/env`. Add new vars there and to `.env.example`.
- `GITHUB_TOKEN` is server-only; it must never reach a client component or `NEXT_PUBLIC_*`.
- `SKIP_ENV_VALIDATION=true` skips validation (CI uses it).
- Remote images are allowlisted in `next.config.js`; use `next/image`.

## Git

- `main` is protected: work on a branch and merge by PR.
- Conventional Commits: `type(scope): imperative summary` (≤72 chars). Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert.
