---
agent: 'agent'
model: GPT-4.1 (copilot)
tools: ['codebase','search']
description: 'Plan and execute small refactors safely'
---
Provide a minimal refactor plan and changes.

Guidance:
- Define goals (readability, duplication, perf) and expected impact before editing.
- Keep PR-sized changes; avoid dependency churn.
- Preserve behavior; note any intentional changes explicitly.
- Propose quick verification steps after edits.
