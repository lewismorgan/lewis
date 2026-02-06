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
