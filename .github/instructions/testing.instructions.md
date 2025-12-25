---
description: "Testing approach (currently minimal, plan-first)"
---
# Testing Strategy

- No automated tests yet; start with smoke coverage on critical flows before expanding.
- Add Playwright E2E for primary user paths (nav, hero, contact/CTA) once ready; keep fixtures lean.
- When introducing unit tests, prefer lightweight React Testing Library for components with behavior.
- Keep tests fast and isolated; avoid coupling to external services or network when not required.
- Track planned test debt in TODOs or issues; avoid blocking small fixes on missing tests but note gaps.
