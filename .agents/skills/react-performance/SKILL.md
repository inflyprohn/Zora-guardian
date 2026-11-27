---
name: react-performance
description: Apply React and Vite performance best practices when writing, reviewing, or refactoring React applications, including rendering, async work, bundle size, and state management.
license: MIT
metadata:
  author: Vercel
  source: https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices
---

# React Performance

Apply these rules to React applications. For Zora Guardian, use the existing React + Vite stack; do not introduce Next.js-specific patterns unless the architecture changes.

## Priorities
1. Avoid request waterfalls: run independent requests concurrently with Promise.all; defer awaits until needed.
2. Keep bundles lean: import only used modules, lazy-load heavy routes/features, avoid importing entire libraries for one utility.
3. Reduce unnecessary renders: keep state close to consumers, derive values during render, use memoization only when profiling or complexity justifies it.
4. Avoid effect-driven derived state; use event handlers for interaction-driven work.
5. Stabilize expensive lists with pagination or virtualization when data volume warrants it.
6. Handle loading, error, empty, retry, and cancellation states for asynchronous UI.
7. Measure before optimizing; use browser performance tools and production build output.

## Review checklist
- No avoidable sequential network calls.
- No oversized dependencies without clear value.
- No duplicate event listeners or subscriptions.
- No unbounded polling, timers, or memory leaks.
- Images have explicit dimensions, appropriate formats, and lazy loading when below the fold.
- Vite base paths and asset URLs work under the deployed subpath.
- Existing routes and interactions remain functional.

## Constraints
Do not add packages or alter the lockfile unless the task requires it. Verify Vite-specific behavior against the project's installed version and official documentation.
