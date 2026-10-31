# AI skills & agents

Custom AI tooling I wrote for **Azerdex**, a Rust/Tauri desktop app with a Svelte + Tailwind v4 frontend. It has nothing to do with this website. I keep it here as an example of how I build AI-assisted workflows.

These files are **inactive in this repo**. They live outside `.github/` and `.claude/` on purpose, so Copilot and Claude Code don't pick them up while working on this site.

## [`battlenet-api`](skills/battlenet-api/SKILL.md) (skill)

Teaches an agent to turn Battle.net API JSON responses into Rust DTOs, Request/Response endpoint structs, and client extension traits that follow the project's conventions.

- **Progressive disclosure:** a short `SKILL.md` covers the workflow and pulls in [templates](skills/battlenet-api/templates) and a [sample response](skills/battlenet-api/references) only when they're needed.
- **Design rules, not just steps:** when to reuse a DTO versus create one, when `#[serde(flatten)]` is allowed, and why every endpoint gets a wrapper Response.
- **Self-checks:** points at in-repo files as the source of truth and ends with a troubleshooting table for common deserialization mistakes.

## [`tailwind-optimizer`](agents/tailwind-optimizer.agent.md) (Copilot custom agent)

A specialist agent that cleans up Tailwind classes in Svelte components without changing how they look.

- **Scoped tools:** limited to read, edit and search, plus a [Context7](https://context7.com) MCP server so it checks Tailwind v4 syntax against current docs instead of relying on memory.
- **Delegation:** can hand off to subagents for project-wide runs.
- **Design-system aware:** prefers the project's `@theme` tokens over arbitrary values, follows desktop-first rules (no responsive breakpoints in a desktop app), and flags repeated patterns to extract.

## Using them

Copy a skill into `.claude/skills/` or `.github/skills/`, or the agent into `.github/agents/`, in a project with a matching structure. Then update the paths and conventions it references.
