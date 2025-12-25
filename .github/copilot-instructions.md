# GitHub Copilot
Instructions

## Priority Guidelines
- Respect detected versions: Next 16.1.1 (App Router), React 19.2.3, TypeScript 5.9.x targeting ES2022 with Bundler resolution, Tailwind CSS 4.1.18, pnpm 10.26.x, Octokit 6.1.x, next-themes.
- Follow existing guidance in .github/instructions (code review, documentation, performance, security, testing)
- Keep to the monolithic personal-site architecture: App Router pages plus colocated server/client components; avoid introducing new layers or services.
- Match established patterns before inventing new ones; prefer server components unless browser APIs or stateful interactivity requires `"use client"` (see [src/components/client/hero.tsx](../src/components/client/hero.tsx)).
- Optimize for maintainability, performance, security, accessibility, and testability equally.

## Technology Version Detection
- Languages: TypeScript 5.9.x with `strict` and `noUncheckedIndexedAccess`, `target` ES2022 and `module` ESNext Bundler ([tsconfig.json](../tsconfig.json)). Avoid syntax needing newer targets.
- Frameworks/libraries: Next 16.1.1 App Router, React 19.2.3, Tailwind 4.1.18, Radix UI primitives, shadcn-style components, next-themes. Generate code that compiles against these exact versions.
- Tooling: pnpm 10.26.x package manager, Prettier 3.4, ESLint 9 with `eslint-config-next` and `simple-import-sort`. Do not introduce configs incompatible with these versions.

## Context Files
- Check .github/copilot for this file and any future architecture or tech-stack addenda.
- Also consult:
  - [.github/instructions/code-review.instructions.md](./instructions/code-review.instructions.md)
  - [.github/instructions/documentation.instructions.md](./instructions/documentation.instructions.md)
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
- Currently no automated tests. Do not block small fixes on missing tests; note gaps in TODOs/issues.
- When adding coverage, start with smoke/E2E for primary journeys (nav, hero, repo list) and keep fixtures lean; avoid external network in tests.

## Technology-Specific Guidelines
### JavaScript/TypeScript
- Honor `strict` TS and ES2022 target; include explicit return types on exports. Use discriminated unions over `any`.
- Stick to ES module syntax and the `~` alias for internal imports.

### React/Next.js
- App Router conventions: export `metadata` and `revalidate` where applicable; prefer server components, mark client components with `"use client"` at top.
- Use Next data-fetching primitives/route handlers over custom API helpers; return `Response.json` in routes as in [src/app/api/git/repos/route.ts](../src/app/api/git/repos/route.ts).
- Use `next/font` for typography and `next-themes` via `ThemeProvider` in layout; keep theme toggle placement consistent with [src/app/layout.tsx](../src/app/layout.tsx).

## Version Control Guidelines
- Assume Semantic Versioning for app releases; note breaking changes explicitly. Keep changes small and lint-clean before review.

## General Best Practices
- Reuse existing components (shadcn/ui, utils/icons) before adding new primitives; avoid new styling systems.
- Handle errors explicitly and log server-side only; avoid noisy client console logs.
- Keep bundle lean: prefer static assets under `public/` and `next/image` when adding media.

## Project-Specific Guidance
- Architecture is monolithic: App Router pages pull data via server helpers (`getMyGit`, `getRepositories`) using Octokit and env-backed token; client UI layers render results with hovercards/cards.
- Theming: dark default via `ThemeProvider`; suppress hydration warnings as in layout and reset theme-dependent state on change (see hero component behavior).
- Slow-mode simulation exists; preserve it when adjusting repo fetching so UX continues to reflect slow network paths.
- Keep footer attribution and external links patterns consistent with [src/app/layout.tsx](../src/app/layout.tsx) and hovercard usage in [src/app/page.tsx](../src/app/page.tsx).
