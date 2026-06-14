# PlayPulse — Build Steps

A simple, ordered checklist for when we start coding. See [PLAN.md](PLAN.md) for the full detail behind each step.

## Setup
1. Create the repo, initialize git, and create the `main` and `dev` branches (protect `main`: PR + passing CI required).
2. Scaffold the Next.js + TypeScript app with Tailwind.
3. Add the Sora font and brand color tokens (gradient + neutrals) from the brand kit.
4. Set up PostgreSQL + Prisma and connect the app (separate `dev` and `main`/prod databases, e.g. Neon branches).
5. Add Redis (cache + realtime) and per-environment config/secrets (`.env` local; Vercel env vars for dev + prod).
6. Set up the deploy pipeline: `dev` branch → Development environment, `main` → Production; run migrations on deploy.
7. Set up CI/CD gates (lint, typecheck, test, build) required to merge.

## Foundations
8. Define the Prisma schema for the core data model (Organization, Season, Competition, Division, Club, Team, Player, etc.).
9. Run the first migration.
10. Build auth: email/password sign-up + login, email verification, password reset, magic link, and **Sign in with Google** (OAuth); set up the `User`/`AuthIdentity` model and JWT + refresh sessions.
11. Build account/profile screens (edit profile, manage linked sign-in methods, delete account).
12. Add Organization + Membership + role-based access control (RBAC).
13. Build the base app layout, navigation, and the shared component library.

## Manage
14. Build Clubs, Teams, and rosters (with player photo upload).
15. Build Players + guardian links.
16. Build season-level registration (no payment yet) and member invites.

## Schedule
17. Build Venues + Fields.
18. Build the manual schedule editor.
19. Build the auto-scheduler with conflict detection.
20. Build RSVP and calendar feeds.
21. Wire up email (Resend) + web push notifications.

## Game Day & Insights
22. Build live score entry + game events.
23. Build finalize → standings recompute.
24. Add realtime channels (WebSocket).
25. Build public schedule + standings pages.

## Compete
26. Build the tournament engine (formats, seeding, auto-advance).
27. Build the bracket UI + public bracket pages.

## Polish (fast-follow)
28. Activate Stripe payments on the existing bones.
29. Add reporting/exports and player stats.

---
*Always confirm each screen is fully responsive (phone, tablet, desktop) as you build it.*
