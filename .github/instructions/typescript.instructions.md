---
applyTo: "**/*.ts,**/*.tsx"
description: "TypeScript + Next.js guidance"
---
# TypeScript & Next.js Development Standards

Comprehensive TypeScript best practices for Next.js 16+ App Router development, aligned with strict type safety, performance optimization, and maintainability.

## Project Configuration

### TypeScript Compiler Options

**Required strict settings (matching project tsconfig.json):**
- `"strict": true` — Enable all strict type-checking options
- `"noUncheckedIndexedAccess": true` — Add `undefined` to indexed access types to prevent runtime errors
- `"checkJs": true` — Type-check JavaScript files
- `"target": "es2022"` — Use ES2022 features, aligning with modern Node.js and browser support
- `"module": "ESNext"` — Use ESNext module system
- `"moduleResolution": "Bundler"` — Optimized for bundlers like Webpack/Turbopack
- `"jsx": "react-jsx"` — Use modern JSX transform (no React import needed)

**Path alias configuration:**
```typescript
"baseUrl": ".",
"paths": {
  "~/*": ["./src/*"]
}
```

### Next.js TypeScript Integration

- Use `next.config.ts` (TypeScript config) for type-safe configuration
- Include `.next/types/**/*.ts` in `tsconfig.json` for generated route types
- Enable statically typed links by running `next dev` or `next build` to generate route types

## Component Type Standards

### Server Components (Default)

**Server Components are the default in App Router.** Use for data fetching, heavy logic, and static UI.

```typescript
// ✅ Good: Server component with explicit return type
export default async function Page(): Promise<JSX.Element> {
  const data = await fetchData()
  return <div>{data.title}</div>
}

// ✅ Good: Typed props with PageProps helper
import type { PageProps } from 'next'

export default async function ProductPage({
  params,
  searchParams,
}: PageProps<{ id: string }>): Promise<JSX.Element> {
  const product = await getProduct(params.id)
  return <div>{product.name}</div>
}
```

### Client Components

**Mark with `'use client'` only when:**
- Using React hooks (`useState`, `useEffect`, `useContext`, etc.)
- Accessing browser APIs (`window`, `document`, `localStorage`, etc.)
- Requiring event handlers with state
- Using third-party libraries that depend on client-side features

```typescript
// ✅ Good: Client component with explicit typing
'use client'

import { useState } from 'react'

interface CounterProps {
  initialCount?: number
}

export function Counter({ initialCount = 0 }: CounterProps): JSX.Element {
  const [count, setCount] = useState<number>(initialCount)
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}
```

### Component Composition Patterns

**Pass Server Components as children to Client Components:**

```typescript
// ✅ Good: Server Component passed to Client Component
// app/page.tsx (Server Component)
import Modal from './modal' // Client Component
import Cart from './cart'   // Server Component

export default function Page(): JSX.Element {
  return (
    <Modal>
      <Cart /> {/* Server Component rendered inside Client Component slot */}
    </Modal>
  )
}

// modal.tsx (Client Component)
'use client'

interface ModalProps {
  children: React.ReactNode
}

export default function Modal({ children }: ModalProps): JSX.Element {
  return <div className="modal">{children}</div>
}
```

**Wrap third-party client-only components:**

```typescript
// ✅ Good: Wrapper for third-party client component
'use client'

import { Carousel } from 'acme-carousel'

// Re-export as Client Component
export default Carousel
```

## Type Safety Best Practices

### Explicit Return Types

**Always specify return types for exported functions and components:**

```typescript
// ✅ Good: Explicit return types
export async function getUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}

export function UserCard({ user }: { user: User }): JSX.Element {
  return <div>{user.name}</div>
}

// ❌ Bad: Implicit return types
export async function getUser(id: string) {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}
```

### Props Interface Pattern

**Define interfaces for component props:**

```typescript
// ✅ Good: Explicit interface
interface UserCardProps {
  user: User
  showEmail?: boolean
  onSelect?: (id: string) => void
}

export function UserCard({ 
  user, 
  showEmail = false,
  onSelect 
}: UserCardProps): JSX.Element {
  // Implementation
}

// ❌ Bad: Inline types
export function UserCard({ user, showEmail }: { 
  user: User
  showEmail?: boolean 
}) {
  // Implementation
}
```

### Handling Undefined and Null

**Use `noUncheckedIndexedAccess` for safe array/object access:**

```typescript
// With noUncheckedIndexedAccess: true

// ✅ Good: Handle potential undefined
const repos = await getRepositories()
const firstRepo = repos[0] // Type: Repository | undefined

if (firstRepo) {
  console.log(firstRepo.name) // Safe access
}

// Or use optional chaining
console.log(repos[0]?.name)

// ❌ Bad: Assume index exists
const firstRepo = repos[0] // Still typed as | undefined
console.log(firstRepo.name) // Error without null check
```

### Discriminated Unions for Error Handling

**Prefer discriminated unions over throwing errors:**

```typescript
// ✅ Good: Type-safe error handling
type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string }

async function fetchUser(id: string): Promise<Result<User>> {
  try {
    const user = await getUser(id)
    return { success: true, data: user }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

// Usage with type narrowing
const result = await fetchUser('123')
if (result.success) {
  console.log(result.data.name) // Type: User
} else {
  console.error(result.error) // Type: string
}
```

## Next.js App Router Specific Types

### Route Params and Search Params

**Use Next.js type helpers for automatic type inference:**

```typescript
import type { PageProps, LayoutProps, RouteContext } from 'next'

// Page with dynamic route: app/products/[id]/page.tsx
export default async function ProductPage({
  params,
  searchParams,
}: PageProps<{ id: string }>): Promise<JSX.Element> {
  // params.id is typed as string
  // searchParams typed as Record<string, string | string[] | undefined>
  const product = await getProduct(params.id)
  return <div>{product.name}</div>
}

// Layout: app/products/[id]/layout.tsx
export default function ProductLayout({
  children,
  params,
}: LayoutProps<{ id: string }>): JSX.Element {
  return <div>{children}</div>
}

// Route handler: app/api/products/[id]/route.ts
export async function GET(
  request: Request,
  context: RouteContext<{ id: string }>
): Promise<Response> {
  const { id } = context.params
  const product = await getProduct(id)
  return Response.json(product)
}
```

### Generic Route Type

**Use `Route<T>` for type-safe navigation:**

```typescript
import type { Route } from 'next'
import Link from 'next/link'

interface CardProps<T extends string> {
  href: Route<T> | URL
  title: string
}

function Card<T extends string>({ href, title }: CardProps<T>): JSX.Element {
  return (
    <Link href={href}>
      <div>{title}</div>
    </Link>
  )
}

// Usage - TypeScript validates route exists
<Card href="/products/123" title="Product" /> // ✅ Valid route
<Card href="/invalid-route" title="Invalid" /> // ❌ Type error if route doesn't exist
```

## Data Fetching Patterns

### Server-Side Data Fetching

**Prefer native `fetch` with Next.js caching and revalidation:**

```typescript
// ✅ Good: Server function with caching
export async function getRepositories(
  slow: boolean
): Promise<RepositoryData[]> {
  // Simulate slow network if needed
  if (slow) await sleep(1000)
  
  const response = await fetch('https://api.github.com/repos', {
    next: { revalidate: 3600 } // Cache for 1 hour
  })
  
  if (!response.ok) {
    console.error('Failed to fetch repositories:', response.statusText)
    return [] // Safe fallback
  }
  
  const data = await response.json()
  return data as RepositoryData[]
}
```

### Route Handlers (API Routes)

**Type route handler functions with Web API types:**

```typescript
// app/api/repos/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const repos = await getRepositories(false)
    return NextResponse.json(repos)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch repositories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest): Promise<Response> {
  const body = await request.json()
  
  // Validate body with Zod or similar
  const validated = repoSchema.parse(body)
  
  // Process...
  return Response.json({ success: true }, { status: 201 })
}
```

## File Organization

### Component Structure

```
src/
├── components/
│   ├── client/          # Client Components (with 'use client')
│   │   ├── hero.tsx
│   │   └── __tests__/
│   ├── server/          # Server Components
│   │   └── repo-overview.tsx
│   └── ui/              # Reusable UI primitives
│       └── button.tsx
├── lib/
│   ├── types.ts         # Shared TypeScript types
│   └── utils.ts         # Utility functions
└── server/
    └── index.ts         # Server-only data fetching logic
```

### Import Patterns

**Use path alias consistently:**

```typescript
// ✅ Good: Use ~ alias
import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/button'
import { getMyGit } from '~/server'

// ❌ Bad: Relative paths from deep nesting
import { cn } from '../../../lib/utils'
```

## Error Handling

### Type-Safe Error Handling

```typescript
// ✅ Good: Narrow error types
function handleError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'An unknown error occurred'
}

// ✅ Good: Safe async/await with error boundaries
export async function getUser(id: string): Promise<User | null> {
  try {
    const user = await fetchUser(id)
    return user
  } catch (error) {
    console.error('Failed to fetch user:', handleError(error))
    return null // Safe fallback
  }
}

// ❌ Bad: Silent catch or any type
try {
  await fetchUser(id)
} catch (e: any) {
  // Silent fail - bad
}
```

## Common Patterns

### Avoid `any` and `unknown`

```typescript
// ✅ Good: Specific types
function processData(data: User[]): string[] {
  return data.map(user => user.name)
}

// ⚠️ Acceptable: unknown with type narrowing
function processUnknown(data: unknown): string | null {
  if (typeof data === 'object' && data !== null && 'name' in data) {
    return (data as { name: string }).name
  }
  return null
}

// ❌ Bad: any bypasses type safety
function processData(data: any) {
  return data.map(user => user.name) // No type checking
}
```

### Type Guards

```typescript
// ✅ Good: Custom type guard
interface User {
  id: string
  name: string
}

function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    typeof value.id === 'string' &&
    typeof value.name === 'string'
  )
}

// Usage
const data: unknown = await response.json()
if (isUser(data)) {
  console.log(data.name) // Type: User
}
```

## Testing Types

**Colocate tests with TypeScript sources:**

```
src/components/client/
├── hero.tsx
└── __tests__/
    └── hero.test.tsx
```

**Use explicit types in tests:**

```typescript
import { render, screen } from '@testing-library/react'
import { Hero } from '../hero'

describe('Hero', () => {
  it('renders with correct props', () => {
    const props = {
      profileImage: '/avatar.jpg',
      name: 'Lewis Morgan'
    }
    
    render(<Hero {...props} />)
    expect(screen.getByText(/Lewis Morgan/i)).toBeInTheDocument()
  })
})
```

## Environment Variables

**Use typed environment validation:**

```typescript
// src/env.js
import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']),
    GITHUB_TOKEN: z.string().min(1),
  },
  client: {
    // NEXT_PUBLIC_API_URL: z.string().url(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  },
})

// Usage - fully typed
import { env } from '~/env'
const token = env.GITHUB_TOKEN // Type: string
```

## Performance Considerations

- **Use Server Components by default** to reduce client bundle size
- **Lazy load heavy Client Components** with `React.lazy` or `next/dynamic`
- **Minimize client-side state** by leveraging server data fetching
- **Type imports explicitly** to enable tree-shaking when possible

## Common Mistakes to Avoid

| Mistake | Why It's Bad | Better Approach |
|---------|--------------|-----------------|
| Using `any` type | Bypasses all type safety | Use `unknown` and narrow with type guards |
| Missing return types on exports | Loses type information at boundaries | Always specify return types |
| Marking components `'use client'` unnecessarily | Increases bundle size | Default to Server Components |
| Not handling `undefined` from indexed access | Runtime errors with `noUncheckedIndexedAccess` | Check for `undefined` before use |
| Silent error catching | Hides bugs and makes debugging hard | Log errors and return safe fallbacks |
| Deep relative imports | Hard to maintain and refactor | Use `~/*` path alias |

## Validation

- **Type checking**: `pnpm tsc --noEmit`
- **Linting**: `pnpm lint` (includes TypeScript-specific rules)
- **Testing**: `pnpm test` (Vitest with TypeScript support)

## Additional Resources

- [Next.js TypeScript Documentation](https://nextjs.org/docs/app/building-your-application/configuring/typescript)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Next.js App Router Type Safety](https://nextjs.org/docs/app/building-your-application/configuring/typescript)
