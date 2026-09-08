# Nihaa Jewels

npm-workspaces monorepo with two independent Next.js apps:

- **apps/marketing** — the public e-catalogue website
- **apps/admin** — internal staff admin panel (placeholder for now; catalogue/auth functionality is a follow-up pass)

See [docs/deployment.md](docs/deployment.md) for environment variables and hosting notes.

## Getting started

```bash
npm install
npm run dev:marketing   # http://localhost:3000
npm run dev:admin       # http://localhost:3001
```

Other workspace scripts: `build:marketing`, `build:admin`, `start:marketing`, `start:admin`, `lint:marketing`, `lint:admin`.
