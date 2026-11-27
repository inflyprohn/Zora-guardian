# Agent guidance for Zora Guardian

Before changing code, inspect the relevant files and follow the matching instructions in `.agents/skills/`.

## Project invariants
- This is an existing React + Vite project. Preserve its current architecture and user-visible behavior unless the task explicitly requests a change.
- GitHub Pages serves the project under `/Zora-guardian/`. Preserve the Vite `base` configuration and verify asset URLs under this subpath.
- Do not remove the custom Vite asset-copy plugin without proving it is unnecessary.
- Do not overwrite user assets, branding, routes, or working functionality as part of unrelated changes.
- Do not add dependencies or modify lockfiles without explaining why and obtaining approval when the change is material.
- Keep secrets out of source control. Never expose private API keys or Supabase service-role keys in client code.
- Run the relevant checks after modifications and report exact commands and outcomes. Do not claim unrun tests passed.

## Skill routing
- Interface and visual changes: `.agents/skills/ui-ux-design/SKILL.md`
- React/Vite implementation and optimization: `.agents/skills/react-performance/SKILL.md`
- Accessibility and responsive review: `.agents/skills/web-accessibility/SKILL.md`
- Browser testing: `.agents/skills/webapp-testing/SKILL.md`
- Native mobile work: `.agents/skills/mobile-expo/SKILL.md`
- Server/API work: `.agents/skills/backend-api/SKILL.md`
- PostgreSQL and RLS: `.agents/skills/postgres-security/SKILL.md`
