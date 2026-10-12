# Deployment

This repo is an npm-workspaces monorepo with two independent Next.js apps:

```
apps/
├── marketing/   the public e-catalogue website
└── admin/       internal staff admin panel (placeholder — CRUD not yet built)
```

Each app builds, deploys, and runs independently. There is no shared code
package — anything both apps need is duplicated in each (see "Duplicated
files" below).

## Running locally

```bash
npm install                # once, from repo root — installs both workspaces
npm run dev:marketing
npm run dev:admin
```

Neither app pins a port. Next starts on 3000 and moves to the next free
port if it is taken, so whichever app you start second lands on 3001 —
check the URL Next prints on startup rather than assuming.

Both can run at the same time, which is the usual way to work: add a
product in admin, then reload the collection page on the marketing app to
see it appear.

## Environment variables

### apps/marketing/.env.local

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_GOOGLE_SHEET_URL` | Contact/custom-design form submission endpoint (Google Apps Script webhook) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics measurement ID |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/publishable key |

### apps/admin/.env.local

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Same project URL as marketing |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same anon key as marketing |
| `SUPABASE_SERVICE_ROLE_KEY` | **Secret.** Bypasses RLS. Admin only, server-side only, never `NEXT_PUBLIC_`-prefixed |

> The CSP in `apps/marketing/next.config.ts` derives the Supabase origin
> from `NEXT_PUBLIC_SUPABASE_URL` **at build time**. Changing the project
> requires a rebuild, not just an env change, or the browser will block
> every Supabase request.

## Database

Schema and seed data live in `supabase/migrations/`. To apply them:

```bash
npx supabase link --project-ref <project-ref>   # asks for the DB password
npx supabase db push
```

Conventions worth knowing before changing the schema:

- **`gold_rates` is append-only.** Never `UPDATE` a rate; insert a new row.
  The current rate is the newest `effective_from` per karat, which gives a
  free audit trail of what was quoted when.
- **`appointments` has no public SELECT policy.** It holds customer phone
  numbers, and the marketing app's anon key is public. Insert-only is
  deliberate — do not add a read policy for `anon`.
- **Categories are database rows, not routes.** `/collections/[category]`
  renders any active category, so staff add collections without a deploy.

See [e-catalogue-plan.md](e-catalogue-plan.md) for the full module plan.

## Hosting

Each app needs its **own separate hosting deployment** (e.g. two separate
Vercel projects, one pointed at `apps/marketing` and one at `apps/admin`).
This repo does not configure hosting — that's a manual step:

1. Create two hosting projects, each with its Root Directory set to
   `apps/marketing` or `apps/admin` respectively.
2. Set each project's environment variables per the tables above.
3. DNS: point your public domain (e.g. `nihaajewels.com`) at the marketing
   deployment, and choose a separate hostname (e.g. an internal subdomain)
   for the admin deployment. Domain/DNS setup is outside this codebase.

## Duplicated files (no shared package)

Since there is no shared package between the two apps, any file both apps
need is a separate copy in each app. Today (placeholder admin, no backend
yet) there is no real duplication — admin doesn't share any component or
utility with marketing.

Once the Supabase-backed catalogue work lands, expect duplication of things
like generated Supabase TypeScript types and any DB client setup that both
apps need to read/write the same tables. When that happens, this section
will document exactly which files are duplicated and the manual re-sync
process (e.g. "regenerate types with `supabase gen types`, then copy the
output into both `apps/marketing/src/types/database.ts` and
`apps/admin/src/types/database.ts`").

## Known gaps / follow-up work

- Admin app is a placeholder — no auth, no database connection, no CRUD
  screens yet. This is intentional; catalogue/auth functionality is a
  separate follow-up pass.
- No Supabase project exists yet. Schema, migrations (in `supabase/`),
  and admin authentication will be designed in that follow-up pass.
- Marketing's collection pages currently render static "coming soon"
  placeholders — they'll switch to live reads from Supabase once the
  catalogue backend exists.
