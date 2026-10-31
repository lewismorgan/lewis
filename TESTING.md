# Testing

## Commands

```bash
pnpm test
pnpm test:watch
pnpm test:coverage
pnpm test:e2e
pnpm test:e2e:ui
```

## Locations

- Unit tests live under [src/components](src/components) and [src/lib](src/lib) in `__tests__` folders.
- Global test setup is in [src/__tests__/setup.ts](src/__tests__/setup.ts).
- Playwright specs live in [test](test).

## Configuration

- [vitest.config.mts](vitest.config.mts)
- [playwright.config.ts](playwright.config.ts)

## E2E against a deployment

Playwright targets `pnpm dev` on `localhost:3000` by default. Set `PLAYWRIGHT_BASE_URL` to test a deployed site instead; the local web server is skipped.

```bash
# Live site (pass the deployed commit so the footer spec can check it)
PLAYWRIGHT_BASE_URL=https://lewismorgan.dev VERCEL_GIT_COMMIT_SHA=<sha> pnpm test:e2e

# Protected Vercel preview
PLAYWRIGHT_BASE_URL=https://<preview>.vercel.app VERCEL_AUTOMATION_BYPASS_SECRET=<secret> VERCEL_GIT_COMMIT_SHA=<sha> pnpm test:e2e
```

When `VERCEL_AUTOMATION_BYPASS_SECRET` is set, [test/global-setup.ts](test/global-setup.ts) exchanges it for a Vercel bypass cookie, so the secret is never sent to third-party hosts.

## CI

[.github/workflows/e2e.yml](.github/workflows/e2e.yml) runs the suite against real deployments, so PRs run it once against the preview:

| Trigger | Target | Expected commit |
| --- | --- | --- |
| Preview `deployment_status` (each PR push) | the preview URL | the deployment's sha |
| Production `deployment_status` (merge to `main`) | `https://lewismorgan.dev` | the deployment's sha; the job waits until Vercel reports the alias serves it |
| Monthly schedule / manual dispatch | `https://lewismorgan.dev` (or the dispatch `url`) | whatever Vercel reports is live |

The deployed commit comes from the Vercel API (`GET /v13/deployments/<host>`), not the page. Preview runs are skipped when the commit has no app changes compared with `main` (same path filter as `ci.yml`, in [.github/filters.yml](.github/filters.yml)). A skipped job still satisfies the required `e2e` check. Failures against the live site open or update one issue labelled `e2e-prod`, and the next green run closes it.

Required secrets: `VERCEL_AUTOMATION_BYPASS_SECRET` (Deployment Protection → Protection Bypass for Automation) and `VERCEL_TOKEN`. Set the repo variable `VERCEL_TEAM_ID` if the project belongs to a team.
