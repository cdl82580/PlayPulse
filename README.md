# PlayPulse

Run your league end to end — seasons, schedules, live scores, and standings.

See [PLAN.md](PLAN.md) for the product/architecture plan and
[BUILD-STEPS.md](BUILD-STEPS.md) for the ordered build checklist.

## Stack

| Layer            | Choice                                            |
| ---------------- | ------------------------------------------------- |
| Web + API        | Next.js 16 (App Router, route handlers) + TS      |
| Styling          | Tailwind CSS v4, Sora font, brand tokens          |
| Database         | PostgreSQL (Neon) + Prisma ORM                     |
| Cache / realtime | Redis (Upstash) — `ioredis`                        |
| Hosting          | Vercel (Development + Production)                  |
| CI/CD            | GitHub Actions (lint · typecheck · test · build)  |

## Local development

```bash
cp .env.example .env   # then fill in DATABASE_URL, DIRECT_URL, REDIS_URL
npm install
npm run db:migrate     # apply migrations to your dev database
npm run dev            # http://localhost:3000
```

Health probe: `GET /api/health` reports Postgres + Redis connectivity.

## Scripts

| Script                 | Purpose                          |
| ---------------------- | -------------------------------- |
| `npm run dev`          | Dev server                       |
| `npm run build`        | Production build                 |
| `npm run lint`         | ESLint                           |
| `npm run typecheck`    | `tsc --noEmit`                   |
| `npm run test`         | Vitest                           |
| `npm run format`       | Prettier (write)                 |
| `npm run db:migrate`   | Create/apply a dev migration     |
| `npm run db:deploy`    | Apply migrations (CI/prod)       |
| `npm run db:studio`    | Prisma Studio                    |

## Branches & environments

| Branch | Environment | Vercel     | Neon branch |
| ------ | ----------- | ---------- | ----------- |
| `dev`  | Development | Preview    | `dev`       |
| `main` | Production  | Production | `main`      |

`main` is protected: PRs only, CI (`quality`) must pass. Cloud provisioning
steps are in [docs/SETUP.md](docs/SETUP.md).
