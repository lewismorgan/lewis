# Testing Setup Guide

This document outlines the testing infrastructure set up for the lewis-app project.

## Overview

The project includes both **unit tests** (Vitest + React Testing Library) and **end-to-end tests** (Playwright) to cover critical user flows.

## Unit Tests (Vitest + React Testing Library)

### Running Tests

```bash
# Run all tests once
pnpm test

# Run tests in watch mode (for development)
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage
```

### Test Structure

Unit tests are organized in the `src/test/` directory, mirroring the source structure:

```
src/test/
  lib/
    utils.test.ts                 # Utility function tests
  components/
    client/
      hero.test.tsx               # Client component tests
  setup.ts                        # Test environment setup
```

### Configuration

- **[vitest.config.mts](../vitest.config.mts)** - Vitest configuration with:
  - `jsdom` environment for DOM testing
  - React plugin for JSX support
  - TypeScript path aliases (`~/*` support)
  - Setup files for test initialization
  - E2E test exclusion (Playwright compatibility)
  - UI base components (`src/components/ui/**`) excluded from unit tests

- **[src/test/setup.ts](../src/test/setup.ts)** - Setup file that:
  - Imports `@testing-library/jest-dom` for extended matchers
  - Configures automatic cleanup after each test
  - Mocks `next/navigation` for Next.js routing
  - Mocks `next-themes` for theme context

### Available Dependencies

- `vitest` - Fast unit test framework
- `@testing-library/react` - React component testing utilities
- `@testing-library/dom` - DOM testing utilities
- `@testing-library/jest-dom` - Extended DOM matchers
- `@testing-library/user-event` - User interaction simulation
- `jsdom` - JavaScript DOM implementation
- `@vitejs/plugin-react` - React support
- `vite-tsconfig-paths` - TypeScript path alias resolution

### Key Testing Practices

1. **Test behavior, not implementation** - Test what users see and do
2. **Use semantic queries** - Prefer `getByRole()`, `getByLabelText()`, `getByText()` over `getByTestId()`
3. **Mock external dependencies** - Mock API calls, routing, and theme providers
4. **Test user interactions** - Use `userEvent` for realistic user behavior
5. **Keep tests focused** - One main behavior per test
6. **Use descriptive names** - `should X when Y happens`

### Writing Tests

#### Test File Template

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MyComponent } from '~/components/MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })

  it('should handle user interactions', async () => {
    const user = userEvent.setup()
    render(<MyComponent />)
    
    const button = screen.getByRole('button', { name: /click/i })
    await user.click(button)
    
    expect(screen.getByText('Updated Text')).toBeInTheDocument()
  })
})
```

#### Common Query Methods

```typescript
// Recommended - semantic queries
screen.getByRole('button', { name: /submit/i })
screen.getByLabelText('Username')
screen.getByText('Welcome')

// Acceptable - specific queries
screen.getByPlaceholderText('Enter name')
screen.getByAltText('Profile')
screen.getByTestId('custom-element')

// Multiple elements
screen.getAllByRole('listitem')
screen.queryByText('Optional')  // Returns null if not found
screen.findByText('Async text') // For async updates
```

#### User Interaction Examples

```typescript
const user = userEvent.setup()

// Click
await user.click(element)

// Type
await user.type(inputElement, 'text')
await user.keyboard('{Enter}')

// Select
await user.selectOptions(selectElement, 'option-value')

// Hover
await user.hover(element)
```

#### Common Assertions

```typescript
expect(element).toBeInTheDocument()
expect(element).toBeVisible()
expect(element).toBeDisabled()
expect(element).toHaveClass('className')
expect(element).toHaveAttribute('src', '/image.jpg')
expect(element).toHaveTextContent('text')
expect(element).toHaveValue('value')
```

### Mocking Examples

#### Mock a Module

```typescript
vi.mock('~/lib/api', () => ({
  fetchUser: vi.fn(() => Promise.resolve({ id: 1, name: 'John' })),
}))

import { fetchUser } from '~/lib/api'

it('loads user data', async () => {
  expect(await fetchUser()).toEqual({ id: 1, name: 'John' })
})
```

#### Mock a Function

```typescript
const handleClick = vi.fn()
render(<Button onClick={handleClick}>Click</Button>)

await user.click(screen.getByRole('button'))
expect(handleClick).toHaveBeenCalledOnce()
```

#### Clear Mocks Between Tests

```typescript
afterEach(() => {
  vi.clearAllMocks()
})
```

### Current Test Coverage

| Category | Files | Tests | Status |
|----------|-------|-------|--------|
| Utilities | `src/lib/utils.ts` | 17 | ✓ Passing |
| Client Components | `src/components/client/hero.tsx` | 7 | ✓ Passing |
| **Total** | **2 files** | **24** | ✓ **All Passing** |

#### Test Examples

**[src/test/lib/utils.test.ts](../src/test/lib/utils.test.ts)** - Tests for utility functions including:
- `cn()` - Class name merging
- `formatTimeRelativeToNow()` - Time formatting with fake timers
- `sleep()` - Promise-based delay

**[src/test/components/client/hero.test.tsx](../src/test/components/client/hero.test.tsx)** - Tests for the Hero component including:
- Rendering typing animation
- Display of welcome message
- Interactive click handlers for glowsticks, lizards, and code

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
