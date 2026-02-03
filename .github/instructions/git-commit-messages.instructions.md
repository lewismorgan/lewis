---
description: 'Git commit message formatting using Conventional Commits specification'
applyTo: '**'
---

# Git Commit Message Guidelines

Follow the [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/) for all commit messages to maintain consistency and enable automated changelog generation.

## Commit Message Structure

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Components

- **type**: Required. The type of change (see below)
- **scope**: Optional but recommended. The area of the codebase affected (e.g., `hero`, `auth`, `ci`, `deps`)
- **description**: Required. A short summary in imperative mood (e.g., "add", "fix", "update", not "added", "fixed", "updated")
- **body**: Optional. Additional context or explanation for the change
- **footer**: Optional. Breaking changes or issue references

## Commit Types

| Type       | Usage                                               | Examples                                          |
| ---------- | --------------------------------------------------- | ------------------------------------------------- |
| `feat`     | New features or functionality                       | `feat(hero): add force-sensitive avatar toggle`   |
| `fix`      | Bug fixes                                           | `fix(ui): correct button alignment in dark mode`  |
| `docs`     | Documentation changes only                          | `docs: update README with deployment steps`       |
| `style`    | Code style/formatting (no logic changes)            | `style: format with prettier`                     |
| `refactor` | Code changes that neither fix bugs nor add features | `refactor: extract repo fetching logic to helper` |
| `perf`     | Performance improvements                            | `perf(api): cache repository language data`       |
| `test`     | Adding or updating tests                            | `test(hero): add tests for theme switching`       |
| `build`    | Build system or dependencies                        | `build: upgrade next to 16.2.0`                   |
| `ci`       | CI/CD configuration changes                         | `ci: add coverage reporting to workflow`          |
| `chore`    | Maintenance tasks, tooling                          | `chore: update eslint rules`                      |
| `revert`   | Reverting previous commits                          | `revert: revert feat(hero): add lizards button`   |

## Scope Guidelines

Use scopes to indicate the area of change:

- **Component names**: `hero`, `navbar`, `footer`, `repo-card`
- **Functionality areas**: `auth`, `api`, `server`, `client`
- **Infrastructure**: `ci`, `deps`, `config`, `docker`
- **Documentation**: `readme`, `instructions`, `testing`

## Description Guidelines

- Use imperative mood: "add" not "added", "fix" not "fixed"
- Start with lowercase (unless proper noun)
- No period at the end
- Keep under 72 characters
- Be concise but descriptive

## Breaking Changes

Indicate breaking changes in two ways:

1. **Type with `!`**: `feat!: send email on registration`
2. **Footer**:

   ```
   feat(api): change authentication endpoint

   BREAKING CHANGE: API authentication endpoint moved from /auth to /api/auth.
   Update all client integrations accordingly.
   ```

## Examples

### Simple Changes

```
feat(hero): add typing animation component
fix(repo-card): handle missing description gracefully
docs: add testing instructions to TESTING.md
style: format code with prettier
refactor(server): simplify octokit error handling
perf(api): add caching for repository data
test(hero): add unit tests for force-side toggle
build(deps): update next to 16.1.2
ci: fix permissions for coverage upload
chore: clean up unused imports
```

### With Body

```
feat(api): add rate limiting middleware

Implement rate limiting using next-rate-limit to prevent API abuse.
Limits are set to 100 requests per minute per IP address.
```

### With Issue References

```
fix(hero): prevent theme state reset on navigation

Fixes #42
```

### Breaking Changes

```
feat!: migrate to App Router from Pages Router

BREAKING CHANGE: All pages have been migrated from the pages/
directory to the app/ directory. Custom middleware and API routes
require updates. See migration guide in docs/MIGRATION.md.
```

## Multi-line Commits

For commits with body or footer, use:

```bash
git commit -m "type(scope): description" -m "Body paragraph" -m "Footer"
```

Or use an editor:

```bash
git commit
```

## Best Practices

1. **Atomic commits**: Each commit should represent a single logical change
2. **Test before committing**: Ensure tests pass (`pnpm test`) and code is linted (`pnpm lint`)
3. **Review diff**: Use `git diff --cached` to review staged changes before committing
4. **Meaningful scopes**: Use consistent scope names across the project
5. **Link issues**: Reference GitHub issues in footer when applicable (e.g., `Fixes #123`, `Relates to #456`)

## When Creating Commits

Before suggesting or creating a commit:

1. Review staged changes with `git status` and `git diff --cached`
2. Determine the appropriate type based on the changes
3. Identify the scope from affected files/components
4. Write a clear, imperative description
5. Add body if context is needed
6. Add footer for breaking changes or issue references

## Validation

Commit messages should match this pattern:

```regex
^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([a-z-]+\))?!?: .{1,72}$
```

For the first line, with optional body and footer following blank lines.
