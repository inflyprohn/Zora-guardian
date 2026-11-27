# Zora Guardian — Agent Skills

Skills for compatible coding agents, including Codex, stored in the repository under .agents/skills/.

## Included
- ui-ux-design — original adaptation inspired by Anthropic frontend-design (Apache-2.0 attribution/license included).
- react-performance — Vercel React best practices (MIT; source linked in metadata).
- web-accessibility — original audit workflow; links to Vercel's public guideline project rather than redistributing its rule snapshot.
- webapp-testing — original Playwright-oriented workflow inspired by Anthropic webapp-testing (Apache-2.0 attribution/license included).
- mobile-expo — original Expo/React Native workflow; official Expo skills are linked as the detailed source.
- backend-api — original secure backend/API workflow with Supabase references.
- postgres-security — original PostgreSQL checklist with Supabase reference.

## Dependencies
No runtime dependencies are added to the Zora Guardian application by these instruction files. Browser testing uses the existing test stack if present; ask before adding Playwright. Expo CLI / EAS dependencies are only needed in a separate mobile app.

## Trust and updates
These files are instructions, not executable code. Review upstream changes before updating. Never run downloaded scripts blindly. Keep API keys, service-role keys, signing credentials, and .env files out of Git.

## Global Codex setup
For global use, install the selected official skills in your local Codex environment using the documented plugin/skills CLI. For example, the official Expo README documents:
`codex plugin add expo@openai-curated`
For portable project skills, Codex discovers repository-local skills under `.agents/skills/`. Restart/refresh Codex after adding or changing skills.

Upstream repositories:
- https://github.com/anthropics/skills
- https://github.com/vercel-labs/agent-skills
- https://github.com/expo/skills
- https://github.com/supabase/agent-skills
