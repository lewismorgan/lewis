# GitHub Copilot

Instructions

## Priority Guidelines

- Respect detected versions: NextJS using App Router, React, TypeScript targeting ES2022 with Bundler resolution, Tailwind CSS v4, pnpm, Octokit, next-themes, and any other dependencies from the package.json at the root of the project directory.
- Follow existing guidance in .github/instructions (code review, documentation, performance, security, testing)
- Keep to the monolithic personal-site architecture: App Router pages plus colocated server/client components; avoid introducing new layers or services.
- Match established patterns before inventing new ones; prefer server components unless browser APIs or stateful interactivity requires `"use client"` (see [src/components/client/hero.tsx](../src/components/client/hero.tsx)).
- Optimize for maintainability, performance, security, accessibility, and testability equally.
- Always use context7 when I need code generation, setup or configuration steps, or library/API documentation and guidance. This means you should automatically use the Context7 MCP tools to resolve library id and get library docs without me having to explicitly ask.

## Technology Version Detection

- Languages: TypeScript 5 with `strict` and `noUncheckedIndexedAccess`, `target` ES2022 and `module` ESNext Bundler ([tsconfig.json](../tsconfig.json)). Avoid syntax needing newer targets.
- Frameworks/libraries: Next.js 16, React 19, Tailwind CSS 4, Radix UI primitives, shadcn-style components, next-themes
- Key utilities: Octokit 7 for GitHub API, Zod 4 for validation (@t3-oss/env-nextjs for env schema), lucide-react for icons, class-variance-authority + tailwind-merge for styling
- Testing: Vitest 4 + React Testing Library for unit tests, Playwright 1 for E2E
- Tooling: pnpm 10 package manager, Prettier 3 for formatting, ESLint 9 with `eslint-config-next` and `simple-import-sort`. Do not introduce configs incompatible with these versions.
- Package manager: always use `pnpm` for install/build/lint/test/run commands; never use `npm` or `npx`. That means you should never have a package-lock.json, a pnpm-lock.yaml file will exist in the project instead; always use pnpm commands for any package management tasks.

## Context Files

- Check .github/copilot for this file and any future architecture or tech-stack addenda.
- Also consult:
  - [.github/instructions/code-review.instructions.md](./instructions/code-review.instructions.md)
  - [.github/instructions/containerization-docker-best-practices.instructions.md](./instructions/containerization-docker-best-practices.instructions.md) (applies to Dockerfile, docker-compose)
  - [.github/instructions/documentation.instructions.md](./instructions/documentation.instructions.md)
  - [.github/instructions/git-commit-messages.instructions.md](./instructions/git-commit-messages.instructions.md)
  - [.github/instructions/github-actions-ci-cd-best-practices.instructions.md](./instructions/github-actions-ci-cd-best-practices.instructions.md) (applies to .github/workflows)
  - [.github/instructions/nextjs.instructions.md](./instructions/nextjs.instructions.md)
  - [.github/instructions/performance.instructions.md](./instructions/performance.instructions.md)
  - [.github/instructions/security.instructions.md](./instructions/security.instructions.md)
  - [.github/instructions/testing.instructions.md](./instructions/testing.instructions.md)
  - [.github/instructions/typescript.instructions.md](./instructions/typescript.instructions.md) (applies to ts/tsx)

## Codebase Scanning Instructions

- Prefer patterns from similar files: App router layout/page ([src/app/layout.tsx](../src/app/layout.tsx), [src/app/page.tsx](../src/app/page.tsx)), server data access ([src/server/index.ts](../src/server/index.ts), [src/server/octokit.ts](../src/server/octokit.ts)), UI primitives ([src/components/ui](../src/components/ui)).
- Observe component split: server components by default; client components marked with `"use client"` for stateful/themed interactions (e.g., [src/components/client/hero.tsx](../src/components/client/hero.tsx)).
- Follow existing naming (PascalCase components, camelCase functions, `~` path alias) and Tailwind utility styling.
- Keep data-fetching via server helpers and route handlers instead of ad-hoc client fetches; reuse `getMyGit`/`getRepositories` patterns.

## Code Quality Standards

### Maintainability

- Keep components small and focused; colocate related UI in `src/components` and shared logic in `src/lib` or `src/server`.
- Use explicit types for exports; align with existing type aliases in [src/lib/types.ts](../src/lib/types.ts).
- Preserve path alias `~/*` and avoid deep relative paths.

### Performance

- Default to server components and streaming where possible; revalidate or cache rather than client polling (see `revalidate = 3600` in [src/app/page.tsx](../src/app/page.tsx)).
- Use Tailwind utilities and shadcn primitives to avoid heavy UI deps; prefer tree-shakeable imports.
- Avoid unbounded parallel Octokit calls; respect existing `slow` simulation toggles when adding network waits.

### Security

- Never expose `GITHUB_TOKEN`; read env through the validated schema in [src/env.js](../src/env.js).
- Validate or guard external data; handle fetch/Octokit failures with safe fallbacks rather than throwing to the client (e.g., empty arrays on failure).
- Keep HTTPS-only assumptions and avoid mixed content or insecure asset embeds.

### Accessibility

- Use semantic HTML and Radix/shadcn primitives for accessible UI (e.g., HoverCard, Separator). Provide `aria` labels when adding interactive controls.
- Preserve keyboard focusability; avoid click-only interactions.
- Ensure text alternatives for media and maintain contrast; keep motion optional when adding animations.

### Testability

- Structure logic in small functions to enable future tests; keep side effects isolated in client components.
- When adding tests later, prefer lightweight RTL for components and Playwright for primary flows.

## Documentation Requirements

- Keep docs concise: update README for new install/run/lint/deploy steps; add short notes for non-obvious architecture or dependency choices.
- Inline comments only for non-obvious behavior (e.g., hydration suppression in [src/app/layout.tsx](../src/app/layout.tsx)).

## Testing Approach

All new components that are created should be structured to facilitate future testing, even if tests are not added immediately. When adding a new component, you should always include at least one test in a colocated `__tests__` folder.

Tests do not need to be added for small fixes or refactors, but any new features or significant changes should include tests. If tests are not added immediately, please note the gaps in TODOs or issues for future work. No tests are required for shadcn/ui components or simple presentational components that do not contain logic.

**Structure:**

- Unit tests live in colocated `__tests__` folders next to source code (e.g., `src/components/client/__tests__/hero.test.tsx`)
- Vitest setup: `src/__tests__/setup.ts`
- Playwright E2E tests: `test/` folder (e.g., `test/home.spec.ts`)

**Guidelines:**

- Do not block small fixes on missing tests; note gaps in TODOs/issues
- When adding coverage, start with smoke/E2E for primary journeys (nav, hero, repo list) and keep fixtures lean; avoid external network in tests
- Use React Testing Library for unit tests; Playwright for E2E
- Keep tests fast and isolated

## Technology-Specific Guidelines

### JavaScript/TypeScript

- Honor `strict` TS and ES2022 target; include explicit return types on exports. Prefer discriminated unions over `any`.
- Avoid `any` and `unknown` unless absolutely necessary; if used, include a short comment explaining why the escape hatch is required and prefer type narrowing or generics first.
- Stick to ES module syntax and the `~` alias for internal imports.

### React/Next.js

- App Router conventions: export `metadata` and `revalidate` where applicable; prefer server components, mark client components with `"use client"` at top.
- Use Next data-fetching primitives/route handlers over custom API helpers; return `Response.json` in routes as in [src/app/api/git/repos/route.ts](../src/app/api/git/repos/route.ts).
- Use `next/font` for typography and `next-themes` via `ThemeProvider` in layout; keep theme toggle placement consistent with [src/app/layout.tsx](../src/app/layout.tsx).
- Turbo mode: development server uses `--turbo` flag for faster builds.

### Code Formatting & Quality

- Format code with Prettier before committing; use `pnpm format:write` to auto-format or `pnpm format:check` to verify.
- Run linting with `pnpm lint` (or `pnpm lint:fix` to auto-fix); ensure zero errors before commits.
- Use `pnpm check` to run both linting and type-checking together.
- Prettier config includes tailwindcss and packagejson plugins for consistent sorting.

## Version Control Guidelines

### Commit Messages

- Follow the [Conventional Commits specification](https://www.conventionalcommits.org/) for all commit messages (see [git-commit-messages.instructions.md](./instructions/git-commit-messages.instructions.md)).
- Use standard commit types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- Include scope when applicable (e.g., `feat(hero):`, `fix(api):`, `test(repo-card):`).
- Write descriptions in imperative mood: "add" not "added", "fix" not "fixed".
- Mark breaking changes with `!` after type/scope (e.g., `feat!:`) and include `BREAKING CHANGE:` in footer.
- Reference issues in footer when applicable (e.g., `Fixes #42`, `Relates to #123`).

### Versioning & Changes

- Assume Semantic Versioning for app releases; note breaking changes explicitly.
- Keep changes small, atomic, and lint-clean before review.
- Ensure tests pass (`pnpm test`) and code is formatted (`pnpm lint`) before committing.

## General Best Practices

- Reuse existing components (shadcn/ui, utils/icons) before adding new primitives; avoid new styling systems.
- Handle errors explicitly and log server-side only; avoid noisy client console logs.
- Keep bundle lean: prefer static assets under `public/` and `next/image` when adding media.
- Environment variables: use `.env.example` as template; never commit `.env` files. Validate env schema in [src/env.js](../src/env.js).

### CI/CD & Deployment

- CI workflow: lint, type-check, unit tests, and E2E tests run on push/PR to `main` (see [.github/workflows/ci.yml](../.github/workflows/ci.yml)).
- Use `SKIP_ENV_VALIDATION=true` in CI when GitHub token isn't needed.
- Deploy target: Vercel (optimized for Next.js App Router with automatic deployments).
- Dev container support: `.devcontainer` available for consistent development environments.

## Project-Specific Guidance

- Architecture is monolithic: App Router pages pull data via server helpers (`getMyGit`, `getRepositories`) using Octokit and env-backed token; client UI layers render results with hovercards/cards.
- Theming: dark default via `ThemeProvider`; suppress hydration warnings as in layout and reset theme-dependent state on change (see hero component behavior).
- Slow-mode simulation exists; preserve it when adjusting repo fetching so UX continues to reflect slow network paths.
- Keep footer attribution and external links patterns consistent with [src/app/layout.tsx](../src/app/layout.tsx) and hovercard usage in [src/app/page.tsx](../src/app/page.tsx).
