---
description: "Performance and delivery"
---
# Performance

- Favor Next.js image optimization (`next/image`) and avoid unoptimized external assets when possible.
- Keep bundle size small: prefer tree-shakeable imports, avoid heavy UI kits without need.
- Use static generation or ISR for marketing pages; avoid unnecessary dynamic rendering.
- Monitor layout shift: set explicit sizes for media and critical UI elements.
