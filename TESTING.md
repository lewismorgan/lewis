# Testing Setup Guide

This document outlines the testing infrastructure set up for the lewis-app project.

## Overview

The project includes both **unit tests** (Jest + React Testing Library) and **end-to-end tests** (Playwright) to cover critical user flows.

## Unit Tests (Jest + React Testing Library)

### Running Tests

```bash
# Run all tests once
pnpm test

# Run tests in watch mode (for development)
pnpm test:watch
```

### Test Structure

Unit tests are colocated with their components using the `.test.tsx` naming convention:

- [src/components/client/hero.test.tsx](../src/components/client/hero.test.tsx) - Hero component tests
- [src/components/client/theme-toggle.test.tsx](../src/components/client/theme-toggle.test.tsx) - Theme toggle tests
- [src/components/links.test.tsx](../src/components/links.test.tsx) - ExternalLink component tests

### Test Utilities

[src/lib/test-utils.tsx](../src/lib/test-utils.tsx) provides a custom render function that wraps components with necessary providers:

- `ThemeProvider` - Ensures theme context is available during tests

Usage:

```typescript
import { render, screen } from '~/lib/test-utils'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('expected text')).toBeInTheDocument()
  })
})
```

### Configuration

- **jest.config.ts** - Main Jest configuration with Next.js integration
- **jest.setup.ts** - Setup file that:
  - Imports `@testing-library/jest-dom` for extended matchers
  - Polyfills `window.matchMedia` for `next-themes` compatibility

### Key Testing Practices

1. **Test critical user journeys** - Focus on components visible to users (Hero, ThemeToggle, navigation)
2. **Use semantic queries** - Prefer `getByRole`, `getByLabelText`, and `getByText` over implementation details
3. **Keep tests simple** - One assertion per test when possible; multiple related assertions are acceptable
4. **Mock minimally** - Let components render naturally; only mock external dependencies if needed

## End-to-End Tests (Playwright)

### Running Tests

```bash
# Run all E2E tests
pnpm test:e2e

# Run E2E tests with interactive UI
pnpm test:e2e:ui

# Run specific test file
pnpm test:e2e e2e/home.spec.ts
```

### Test Structure

E2E tests are located in the `e2e/` directory:

- [e2e/home.spec.ts](../e2e/home.spec.ts) - Tests for the home page including hero section, repository display, and footer

### Configuration

**playwright.config.ts** includes:

- Base URL configuration (`http://localhost:3000`)
- Browser configuration (Chromium)
- Automatic dev server startup
- HTML reporter for test results

### What's Tested

The E2E suite covers critical user flows:

1. **Home Page Display** - Hero section loads with greeting and welcome message
2. **Software Engineer Section** - Displays correctly with proper styling
3. **Theme Toggle** - Button is visible and accessible
4. **Repository Section** - Shows repository listing and GitHub link
5. **Footer** - Displays attribution and GitHub link

## Integration with CI/CD

Add tests to your CI pipeline by running:

```bash
pnpm lint && pnpm test && pnpm test:e2e
```

## Future Testing Improvements

As the project grows, consider:

1. **Increase unit test coverage** - Add tests for utility functions and server components
2. **Add visual regression tests** - Use Playwright's screenshot comparison
3. **Test accessibility** - Integrate `axe-core` for automated a11y testing
4. **Performance testing** - Use Lighthouse or similar tools
5. **Test data utilities** - Create fixtures for consistent test data across suites

## Troubleshooting

### Tests fail with "window.matchMedia is not a function"

This issue is typically resolved by the polyfill in `jest.setup.ts`. If you encounter this, verify:
- `jest.setup.ts` is properly configured
- `jest.config.ts` includes `setupFilesAfterEnv: ['<rootDir>/jest.setup.ts']`

### Components don't render in tests

Ensure components are wrapped with the custom `render` function from `test-utils.tsx`:

```typescript
// ✓ Correct
import { render } from '~/lib/test-utils'

// ✗ Wrong - missing providers
import { render } from '@testing-library/react'
```

### E2E tests can't reach localhost

Ensure the dev server is running (or let Playwright start it automatically) and the base URL matches your actual dev environment.
