# lewis

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/lewismorgan/lewis/ci.yml)
![GitHub deployments](https://img.shields.io/github/deployments/lewismorgan/lewis/Production?logo=vercel&label=Vercel&link=https%3A%2F%2Flewismorgan.dev)

Personal landing page built with Next.js App Router and Tailwind CSS, deployed on Vercel. It pulls GitHub profile and repository data via Octokit.

## Setup

1. Copy [.env.example](.env.example) to [.env](.env) and set `GITHUB_TOKEN` (schema in [src/env.js](src/env.js)).
2. `pnpm install`

```bash
git clone https://github.com/lewismorgan/lewis.git
```

## Run

- `pnpm dev` - local dev with Turbopack
- `pnpm preview` - production build + start

## Lint + typecheck

- `pnpm check` - lint + TypeScript
- `pnpm lint` - lint only
- `pnpm format:check` - formatting check

## Tests

- `pnpm test`, `pnpm test:watch`, `pnpm test:coverage`
- `pnpm test:e2e`, `pnpm test:e2e:ui`
- Details in [TESTING.md](TESTING.md)

## API routes

- `GET /api/git/repos` - repository summaries for the overview UI. See [src/app/api/git/repos/route.ts](src/app/api/git/repos/route.ts).
- `GET /api/git/readme/[repo]` - README content for a repository. See [src/app/api/git/readme/[repo]/route.ts](src/app/api/git/readme/[repo]/route.ts).

## Deploy (Vercel)

Connect the repo in Vercel and set env vars from [src/env.js](src/env.js) (at minimum `GITHUB_TOKEN`). Vercel will run `pnpm build` and `pnpm start`.

## License

MIT License
