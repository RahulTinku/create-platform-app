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

export const TEMPLATES: Template[] = [
  {
    id: "react-vite",
    label: "React + Vite",
    hint: "TypeScript, ESLint, strict mode",
    dir: path.join(TEMPLATES_ROOT, "react-vite"),
    features: [
      { id: "prettier", label: "Prettier", hint: "Opinionated code formatter" },
      { id: "husky", label: "Husky + lint-staged", hint: "Pre-commit hooks" },
    ],
  },
  {
    id: "react-next",
    label: "Next.js 15 (App Router)",
    hint: "Auth.js (GitHub OAuth), OpenFeature flags, GitHub Actions CI",
    dir: path.join(TEMPLATES_ROOT, "react-next"),
    features: [
      { id: "vercel", label: "Vercel deploy config", hint: "vercel.json + deployment docs" },
    ],
  },
  {
    id: "node-api",
    label: "Node.js API (Fastify)",
    hint: "REST, OpenAPI/Swagger UI, CORS, Helmet, GitHub Actions CI",
    dir: path.join(TEMPLATES_ROOT, "node-api"),
    features: [
      { id: "docker", label: "Dockerfile", hint: "Multi-stage Docker build" },
    ],
  },
];
