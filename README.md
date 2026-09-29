# Nihaa Jewels

npm-workspaces monorepo with two independent Next.js apps:

- **apps/marketing** — the public e-catalogue website
- **apps/admin** — internal staff admin panel (placeholder for now; catalogue/auth functionality is a follow-up pass)

See [docs/deployment.md](docs/deployment.md) for environment variables and hosting notes.

## Getting started

```bash
npm install
npm run dev:marketing
npm run dev:admin
```

Neither app pins a port — Next starts on 3000 and uses the next free port
if that is taken, so the second app you start lands on 3001. Check the URL
Next prints on startup.

Other workspace scripts: `build:marketing`, `build:admin`, `start:marketing`, `start:admin`, `lint:marketing`, `lint:admin`.
