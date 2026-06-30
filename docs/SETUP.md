# PlayPulse — Infrastructure Setup Runbook

What's already done in the repo (code/config) vs. what **you** need to do in
the Neon / Upstash / Vercel dashboards (account-bound, no CLI installed here).

Legend: ✅ done in repo · ☐ you do it in a dashboard.

---

## 4. PostgreSQL + Prisma (Neon)

✅ Prisma installed; `prisma/schema.prisma` wired with `url` (pooled) +
`directUrl` (direct); `src/lib/prisma.ts` singleton client; `db:*` scripts.

☐ **Create the databases (Neon branches):**

1. Create a Neon project named `playpulse`.
2. The default branch is `main` → this is **production**.
3. Create a branch off `main` named `dev` → this is **development** (seedable,
   safe to break).
4. For each branch copy two connection strings from the Neon dashboard:
   - **Pooled** (`...-pooler...`) → `DATABASE_URL`
   - **Direct** (no `-pooler`) → `DIRECT_URL`
5. Put the `dev` branch strings in your local `.env`, then:
   ```bash
   npm run db:migrate -- --name init   # creates prisma/migrations + applies
   ```
   Commit the generated `prisma/migrations/` directory.

## 5. Redis + per-environment secrets (Upstash + Vercel)

✅ `ioredis` installed; `src/lib/redis.ts` (lazy client + `createSubscriber()`);
`src/lib/env.ts` validates all env vars at boot; `.env.example` template.

☐ **Upstash:** create two Redis databases — `playpulse-dev` and
`playpulse-prod` — and copy each `rediss://` URL into `REDIS_URL` for the
matching environment.

☐ **Local:** real values live in `.env` (gitignored). Never commit secrets.

☐ **Vercel env vars** (Project → Settings → Environment Variables), set per
environment:

| Variable              | Development (Preview)     | Production           |
| --------------------- | ------------------------- | -------------------- |
| `DATABASE_URL`        | Neon `dev` pooled         | Neon `main` pooled   |
| `DIRECT_URL`          | Neon `dev` direct         | Neon `main` direct   |
| `REDIS_URL`           | Upstash `playpulse-dev`   | Upstash `playpulse-prod` |
| `NEXT_PUBLIC_APP_URL` | the dev/preview URL       | `https://playpulse.cdlav.us` |

## 6. Deploy pipeline (Vercel + migrations)

☐ **Vercel:** import the GitHub repo. Set the **Production Branch** to `main`.
Pushes to `dev` produce a Development/Preview deployment; pushes to `main`
deploy Production. (Optional: assign a stable domain alias to the latest `dev`
deployment.)

✅ **Migrations on deploy:** `.github/workflows/migrate.yml` runs
`prisma migrate deploy` after CI passes — against the `dev` database on a `dev`
push and the `main` database on a `main` push.

☐ **GitHub Environments:** create two environments named **`development`** and
**`production`** (repo → Settings → Environments). Add `DATABASE_URL` and
`DIRECT_URL` secrets to each (same values as Vercel). The migrate workflow
selects the environment automatically by branch. Optionally require reviewers
on `production` so destructive migrations are approved before reaching `main`.

## 7. CI/CD gates

✅ `.github/workflows/ci.yml` runs lint · typecheck · format · test · build as
the `quality` job on every PR/push to `main` and `dev`.

✅ Branch protection on `main`: PR required, `quality` status check required,
stale approvals dismissed, conversation resolution required, enforced for
admins. (Applied via `gh api` during setup — see git history.)

---

### Quick verification once provisioned

```bash
npm run db:deploy           # apply migrations to the target DB
curl -s localhost:3000/api/health | jq   # {"status":"ok","checks":{"db":"ok","redis":"ok"}}
```
