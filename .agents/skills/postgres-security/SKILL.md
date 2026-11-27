---
name: postgres-security
description: Review PostgreSQL schema, SQL, migrations, indexes, access control, and Row Level Security for correctness, security, and performance.
license: MIT
metadata:
  author: Supabase
  source: https://github.com/supabase/agent-skills/tree/main/skills/supabase-postgres-best-practices
---

# PostgreSQL Security and Performance

Before changing a database:
- Inspect current schema, migrations, constraints, indexes, and access patterns.
- Use explicit types, constraints, foreign keys, and transactions where appropriate.
- Use parameterized SQL; never concatenate untrusted input into SQL.
- Enable and verify RLS on tables exposed through public APIs.
- Write policies based on authenticated identity, tenant ownership, and least privilege.
- Never authorize with user-editable profile metadata.
- Explain query plans for material performance concerns; add indexes based on measured query patterns.
- Avoid destructive migrations without backup, rollback plan, and explicit approval.
- Test policies as anonymous, authenticated, and unauthorized users.

Official detailed guidance: https://github.com/supabase/agent-skills/tree/main/skills/supabase-postgres-best-practices
This project-specific skill is an original concise checklist, not a verbatim copy of the upstream skill.
