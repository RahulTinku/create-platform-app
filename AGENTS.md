# create-platform-app — Agent Instructions

## This is a PUBLIC repository

## 🔴 Commit message rule
No Wibey attribution. Plain commit messages only.

## 🔴 Pre-commit scan
```bash
grep -ri "walmart\|npme\.\|gecgithub\|@gtpjs\|@walmart\|wibey\|wcnp\|r0k067s\|ceecore" \
  . --include="*.ts" --include="*.json" --include="*.md" --include="*.yml" \
  --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git
```
Zero matches required before pushing.

## Known issue: `package-lock.json`
Gitignored — installing on Walmart network fills it with `npme.walmart.com` URLs.

## Project
An interactive CLI (like `create-t3-app` but for platform engineers) that scaffolds
production-ready React/Next.js/Node.js apps with enterprise patterns baked in.

## Stack
- TypeScript + Node.js CLI
- `@clack/prompts` for interactive prompts
- `degit` for template copying
- Templates in `./templates/` directory

## Key CLI flow
1. `npx create-platform-app my-app`
2. Prompts: framework (Next.js / Vite / Node API), features (auth, feature-flags, telemetry, CI/CD)
3. Copies selected template, substitutes project name
4. Runs `git init`, installs deps, prints next steps

## Templates
- `templates/react-next/` — Next.js 15 + Auth.js + OpenFeature + GitHub Actions
- `templates/react-vite/` — Vite + React + TypeScript + ESLint + Prettier
- `templates/node-api/` — Fastify + TypeScript + OpenAPI

## Build
```bash
npm install && npm run build
node dist/index.js my-test-app
```
