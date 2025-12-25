---
description: "Security guardrails"
---
# Security

- Do not commit secrets; rely on Vercel/CI secrets for env values.
- Validate and sanitize any user-facing input; avoid trusting client data even for personal sites.
- Use HTTPS-only assumptions; avoid embedding mixed-content assets.
- Keep dependencies lean; remove unused packages and watch for high-risk additions.
