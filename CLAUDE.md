# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run start:dev       # Watch mode (preferred for development)
npm run start:prod      # Production (runs compiled dist/)
npm run build           # Compile TypeScript via NestJS CLI

# Testing
npm run test            # Unit tests (Jest, rootDir: src, *.spec.ts)
npm run test:e2e        # End-to-end tests (test/jest-e2e.json)
npm run test:cov        # Coverage report

# Linting & formatting
npm run lint            # ESLint with --fix
npm run format          # Prettier

# Prisma
npm run prisma:generate   # Regenerate Prisma client after schema changes
npm run prisma:db:push    # Push schema to DB without migrations
npm run prisma:db:seed    # Seed DB (runs prisma/seed.ts via ts-node)
npx prisma migrate dev    # Create and apply a new migration
```

Requires `DATABASE_URL` env var pointing to a PostgreSQL instance. All Prisma models live in the `digital-invitations` schema.

Swagger docs are served at `GET /docs` when the server is running.

## Architecture

NestJS REST API backed by PostgreSQL (via Prisma with `@prisma/adapter-pg`). All feature code lives under `src/modules/`, each module following the NestJS pattern: `*.module.ts`, `*.controller.ts`, `*.service.ts`, `dto/`.

**Module map:**

| Module | Routes | Notes |
|---|---|---|
| `invitations` | `POST /invitations`, `GET /invitations`, `GET /invitations/:id`, `PATCH /invitations/:id`, `POST /invitations/:id/publish`, `POST /invitations/:id/unpublish` | Admin CRUD; slug auto-generated via `nanoid(8)` on create |
| `public` | `GET /public/i/:slug` | Public read-only; only returns PUBLISHED invitations |
| `rsvp` | `POST /public/i/:slug/rsvp`, `GET /invitations/:id/rsvps`, `DELETE /rsvps/:id` | Public submit + admin manage |
| `music` | Scoped to invitations | Music suggestions per invitation |
| `gifts` | Scoped to invitations | Gift suggestions per invitation |
| `photos` | Scoped to invitations | Photo gallery per invitation |
| `templates` | CRUD | Seeded via `prisma/seed.ts`; define default `settings` and `sections` JSON |

**Key data flow:** `Template` → `Invitation` (inherits `defaultSettings`/`defaultSections` unless overridden) → child records (`Photo`, `Rsvp`, `MusicSuggestion`, `GiftSuggestion`).

**Shared infrastructure:**
- `src/prisma/` — `PrismaService` extends `PrismaClient` using the `PrismaPg` driver adapter; injected via `PrismaModule` (global-ish, imported per module).
- Global `ValidationPipe` with `whitelist: true` and `transform: true` — DTOs must use `class-validator` decorators.
- `@nestjs/config` is global; access env vars via `process.env.*` or inject `ConfigService`.

**Prisma schema notes:**
- All models use `@@schema("digital-invitations")` — the PostgreSQL schema must exist before running migrations.
- `settings` and `sections` on `Invitation`/`Template` are untyped `Json` columns — changes to their shape are purely in application code.
- After editing `prisma/schema.prisma`, always run `npm run prisma:generate` to update the client.
