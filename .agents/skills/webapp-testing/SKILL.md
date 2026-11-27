---
name: webapp-testing
description: Plan and run browser-level tests for web applications, verify user journeys, diagnose UI behavior, and report reproducible defects.
---

# Web Application Testing

## Workflow
1. Inspect package.json and existing test scripts before choosing tools.
2. Start the application using its documented command; do not assume a port.
3. Test the rendered application, not only source code. Wait for navigation and asynchronous UI to settle.
4. Cover primary journeys, navigation, forms, validation, responsive layouts, and failure states.
5. Capture console errors, failed network requests, and screenshots for defects.
6. Re-run relevant tests after fixes and report what was actually verified.

## Tooling
- Prefer the project's existing test framework.
- If Playwright is already installed, use it for browser automation.
- If it is not installed, ask before adding a new dependency; do not silently modify package.json or lockfiles.
- Never run destructive production actions or use real customer data in tests.

## Zora Guardian notes
- Preserve the existing React + Vite setup and GitHub Pages base path.
- Verify asset paths under the deployed /Zora-guardian/ subpath, not just localhost root.
- Verify logo, images, navigation, sensor/simulator interactions, and mobile breakpoints.
- Never claim a test passed unless it was run and its result observed.

## Upstream inspiration
Workflow adapted from Anthropic's webapp-testing skill.
Source: https://github.com/anthropics/skills/tree/main/skills/webapp-testing
Upstream license: Apache-2.0. This adaptation is original; see LICENSE.txt in this folder.
