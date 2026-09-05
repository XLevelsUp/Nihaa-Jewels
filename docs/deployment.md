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
npm run dev:marketing       # http://localhost:3000
npm run dev:admin           # http://localhost:3001
```

Ports are pinned in each app's own `package.json` (`admin` uses `-p 3001`)
so both can run side by side without colliding.

## Environment variables

### apps/marketing/.env.local

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_GOOGLE_SHEET_URL` | Contact/custom-design form submission endpoint (Google Apps Script webhook) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics measurement ID |

### apps/admin/.env.local

None yet. Admin is currently a placeholder app with no backend wiring.
When the catalogue/auth backend (Supabase) is added in a later pass, this
file will need at minimum a Supabase project URL and anon/service key —
documented here once that work happens.

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
