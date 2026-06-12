# platform-app-cli

> Scaffold production-ready React/Next.js/Node.js apps with enterprise patterns in under a minute.

```bash
npx platform-app-cli my-app
```

## Templates

| Template | What's included |
|----------|----------------|
| **React + Vite** | React 19, TypeScript strict, ESLint, Vite 6 |
| **Next.js 15 (App Router)** | Auth.js v5 (GitHub OAuth, JWT), OpenFeature flags, GitHub Actions CI |
| **Node.js API (Fastify)** | Fastify 5, OpenAPI/Swagger UI, CORS, Helmet, GitHub Actions CI |

## Why

`create-t3-app` gives you type-safety. This gives you **platform patterns** — the architectural decisions a platform engineering team makes for a production app:

- **Auth** wired from day one (no weekend spent reading Auth.js docs)
- **Feature flags** via OpenFeature — provider-agnostic, swap your backend later
- **OpenAPI spec auto-generated** from route schemas — no manual documentation
- **CI/CD** included — push and your first build runs

## Usage

```bash
# Run directly (no install needed)
npx platform-app-cli my-app

# Or pass the project name as an argument to skip the first prompt
npx platform-app-cli my-app
```

The CLI will ask:
1. **Template** — React + Vite / Next.js 15 / Node.js API
2. **Features** — template-specific extras (Vercel config, Dockerfile)
3. **Git init** — initialise a git repository
4. **Install deps** — run `npm install` automatically

## Templates in depth

### React + Vite
```
src/
├── main.tsx
└── App.tsx
```
Minimal and clean. TypeScript strict mode, ESLint configured. Start here if you're building a SPA.

### Next.js 15 (App Router)
```
src/
├── app/
│   ├── page.tsx              — force-dynamic (safe with auth())
│   ├── layout.tsx
│   ├── auth/sign-in|out/     — Server Action forms
│   └── api/auth/[...nextauth] — Auth.js handler
├── auth.ts                   — NextAuth v5-beta: GitHub OAuth, JWT
├── components/
│   ├── providers.tsx         — OpenFeatureProvider
│   └── home-content.tsx      — useBooleanFlagValue hook usage
└── lib/flags.ts              — typed flag definitions, InMemoryProvider
```

**Auth setup** — after scaffolding:
```bash
cp .env.example .env.local
# Add your AUTH_SECRET (npx auth secret) and GitHub OAuth credentials
```

**Feature flags** — defined in `src/lib/flags.ts`. Swap `InMemoryProvider` with LaunchDarkly, Flagsmith, or any OpenFeature-compliant provider.

### Node.js API (Fastify)
```
src/
├── index.ts          — PORT from env, host 0.0.0.0 (container-safe)
├── server.ts         — plugin registration order: security → swagger → routes → swagger-ui
├── plugins/
│   ├── swagger.ts    — @fastify/swagger (before routes) + swagger-ui (after)
│   └── security.ts   — @fastify/cors + @fastify/helmet
└── routes/
    ├── health.ts     — GET /health → {status, uptime, timestamp}
    └── items.ts      — CRUD /api/v1/items with full OpenAPI schema
```

Swagger UI available at `http://localhost:3000/documentation` after `npm run dev`.

## Development

```bash
git clone https://github.com/RahulTinku/platform-app-cli
cd platform-app-cli
npm install
npm run build
node dist/index.js my-test-app
```

## Roadmap

- [ ] Prettier + lint-staged + Husky pre-commit hooks
- [ ] Next.js template: Prisma + database adapter for Auth.js
- [ ] Node.js template: Docker multi-stage build
- [ ] `--template` flag to skip interactive prompts (for CI/scripts)
- [x] Publish to npm — package ready, publish off VPN when ready

## License

MIT
