import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Resolve templates relative to the installed package root (dist/../templates)
const TEMPLATES_ROOT = path.resolve(__dirname, "../../templates");

export interface Feature {
  id: string;
  label: string;
  hint: string;
}

export interface Template {
  id: string;
  label: string;
  hint: string;
  dir: string;
  features: Feature[];
}

const PRETTIER_FEATURE: Feature = { id: "prettier", label: "Prettier", hint: "Opinionated code formatter" };
const HUSKY_FEATURE: Feature = { id: "husky", label: "Husky + lint-staged", hint: "Pre-commit hooks (includes Prettier)" };

export const TEMPLATES: Template[] = [
  {
    id: "react-vite",
    label: "React + Vite",
    hint: "TypeScript, ESLint, strict mode",
    dir: path.join(TEMPLATES_ROOT, "react-vite"),
    features: [
      PRETTIER_FEATURE,
      HUSKY_FEATURE,
    ],
  },
  {
    id: "react-next",
    label: "Next.js 15 (App Router)",
    hint: "Auth.js (GitHub OAuth), OpenFeature flags, GitHub Actions CI",
    dir: path.join(TEMPLATES_ROOT, "react-next"),
    features: [
      PRETTIER_FEATURE,
      HUSKY_FEATURE,
      { id: "prisma-auth", label: "Prisma + DB sessions", hint: "SQLite by default, swap to Postgres/MySQL" },
      { id: "vercel", label: "Vercel deploy config", hint: "vercel.json + deployment docs" },
    ],
  },
  {
    id: "node-api",
    label: "Node.js API (Fastify)",
    hint: "REST, OpenAPI/Swagger UI, CORS, Helmet, GitHub Actions CI",
    dir: path.join(TEMPLATES_ROOT, "node-api"),
    features: [
      PRETTIER_FEATURE,
      HUSKY_FEATURE,
      { id: "docker", label: "Dockerfile", hint: "Multi-stage Docker build" },
    ],
  },
];
