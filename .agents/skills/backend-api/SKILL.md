---
name: backend-api
description: Design and implement secure backend services, REST APIs, authentication, data access, and server-side integrations for web and mobile applications.
---

# Backend and API Engineering

## Workflow
1. Define resources, operations, data ownership, trust boundaries, and error contracts.
2. Inspect the existing server and hosting model before introducing a framework or database.
3. Validate all input at the server boundary; never trust client-side validation.
4. Apply authentication and authorization separately. Enforce least privilege on every protected operation.
5. Keep secrets server-side; never expose service-role keys, API tokens, or private credentials in browser/mobile bundles.
6. Use parameterized queries, safe serialization, rate limits, and bounded request sizes.
7. Add structured logs without passwords, tokens, personal data, or secret payloads.
8. Test success, validation failure, unauthorized, forbidden, not-found, rate-limited, and server-error paths.

## Supabase
When a project uses Supabase, consult the official skills:
- https://github.com/supabase/agent-skills/tree/main/skills/supabase
- https://github.com/supabase/agent-skills/tree/main/skills/supabase-postgres-best-practices

Follow current Supabase documentation for API changes. Enable RLS on exposed tables and design policies around the actual ownership model. Never put service_role or secret keys in frontend environment variables.

## Zora Guardian
The current repository has an Express server and Google GenAI dependency. Inspect server.ts and environment handling before changing backend behavior. Do not assume a database is configured.
