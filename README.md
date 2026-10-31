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

## Working with AI

- **Claude Code** (primary): project context in [CLAUDE.md](CLAUDE.md), shared settings in [.claude/settings.json](.claude/settings.json), path-scoped rules in [.claude/rules](.claude/rules), and skills (`/write-tests`, `/fix-tests`) in [.claude/skills](.claude/skills). Personal overrides go in `.claude/settings.local.json` (gitignored). The devcontainer installs Claude Code and keeps its login across rebuilds.
- **GitHub Copilot**: [.github/copilot-instructions.md](.github/copilot-instructions.md), plus [instructions](.github/instructions) and [prompts](.github/prompts).

## API routes

- `GET /api/git/repos` - repository summaries for the overview UI. See [src/app/api/git/repos/route.ts](src/app/api/git/repos/route.ts).
- `GET /api/git/readme/[repo]` - README content for a repository. See [src/app/api/git/readme/[repo]/route.ts](src/app/api/git/readme/[repo]/route.ts).

## Deploy (Vercel)

Connect the repo in Vercel and set env vars from [src/env.js](src/env.js) (at minimum `GITHUB_TOKEN`). Vercel will run `pnpm build` and `pnpm start`.

## Showcase

[showcase/](showcase) holds example work that's outside the scope of developing this website, such as AI skills and agents I built for other projects. None of it is used by this repo's tooling.

## License

MIT License
