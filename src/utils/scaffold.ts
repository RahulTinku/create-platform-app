import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Recursively copy a template directory to a destination.
 * Replaces {{projectName}} in all file contents and filenames.
 */
export async function copyTemplate(
  templateDir: string,
  destDir: string,
  tokens: Record<string, string>
): Promise<void> {
  await fs.promises.mkdir(destDir, { recursive: true });
  await copyDir(templateDir, destDir, tokens);
}

async function copyDir(src: string, dest: string, tokens: Record<string, string>) {
  const entries = await fs.promises.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    // Replace tokens in the filename itself
    const destName = applyTokens(entry.name, tokens);
    const destPath = path.join(dest, destName);

    if (entry.isDirectory()) {
      await fs.promises.mkdir(destPath, { recursive: true });
      await copyDir(srcPath, destPath, tokens);
    } else {
      const raw = await fs.promises.readFile(srcPath);
      // Only token-substitute in text files
      if (isTextFile(entry.name)) {
        const content = applyTokens(raw.toString("utf-8"), tokens);
        await fs.promises.writeFile(destPath, content, "utf-8");
      } else {
        await fs.promises.copyFile(srcPath, destPath);
      }
    }
  }
}

function isTextFile(filename: string): boolean {
  const TEXT_EXTS = [
    ".ts", ".tsx", ".js", ".jsx", ".json", ".html", ".css",
    ".md", ".txt", ".yml", ".yaml", ".env", ".gitignore",
    ".eslintrc", ".prettierrc", ".editorconfig",
  ];
  return TEXT_EXTS.some((ext) => filename.endsWith(ext)) || !filename.includes(".");
}

function applyTokens(str: string, tokens: Record<string, string>): string {
  return Object.entries(tokens).reduce(
    (s, [key, val]) => s.replaceAll(`{{${key}}}`, val),
    str
  );
}

/** Check if a directory is safe to scaffold into (empty or doesn't exist) */
export function checkDestination(destDir: string): { ok: boolean; reason?: string } {
  if (!fs.existsSync(destDir)) return { ok: true };
  const entries = fs.readdirSync(destDir).filter((f) => f !== ".git");
  if (entries.length > 0) {
    return { ok: false, reason: `Directory already exists and is not empty: ${destDir}` };
  }
  return { ok: true };
}

// ─── Feature application ──────────────────────────────────────────────────────

function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string, unknown> = { ...target };
  for (const [key, val] of Object.entries(source)) {
    if (
      val !== null &&
      typeof val === "object" &&
      !Array.isArray(val) &&
      typeof result[key] === "object" &&
      result[key] !== null &&
      !Array.isArray(result[key])
    ) {
      result[key] = deepMerge(
        result[key] as Record<string, unknown>,
        val as Record<string, unknown>
      );
    } else {
      result[key] = val;
    }
  }
  return result;
}

async function mergePackageJson(destDir: string, patchPath: string): Promise<void> {
  const pkgPath = path.join(destDir, "package.json");
  if (!fs.existsSync(pkgPath) || !fs.existsSync(patchPath)) return;

  const current = JSON.parse(
    await fs.promises.readFile(pkgPath, "utf-8")
  ) as Record<string, unknown>;
  const patch = JSON.parse(
    await fs.promises.readFile(patchPath, "utf-8")
  ) as Record<string, unknown>;

  const merged = deepMerge(current, patch);

  // Keep deps sorted alphabetically
  for (const field of ["dependencies", "devDependencies"] as const) {
    if (merged[field] && typeof merged[field] === "object") {
      merged[field] = Object.fromEntries(
        Object.entries(merged[field] as Record<string, string>).sort(([a], [b]) =>
          a.localeCompare(b)
        )
      );
    }
  }

  await fs.promises.writeFile(pkgPath, JSON.stringify(merged, null, 2) + "\n", "utf-8");
}

/**
 * Apply selected features to a scaffolded project.
 * Each feature in templates/features/<id>/ may contain:
 *   files/             → copied into the project root (overwrites base files)
 *   package.patch.json → deep-merged into the project's package.json
 */
export async function applyFeatures(
  destDir: string,
  features: string[],
  tokens: Record<string, string>
): Promise<void> {
  const FEATURES_ROOT = path.resolve(__dirname, "../../templates/features");

  for (const featureId of features) {
    const featureDir = path.join(FEATURES_ROOT, featureId);
    if (!fs.existsSync(featureDir)) continue;

    const filesDir = path.join(featureDir, "files");
    if (fs.existsSync(filesDir)) {
      await copyDir(filesDir, destDir, tokens);
    }

    const patchFile = path.join(featureDir, "package.patch.json");
    if (fs.existsSync(patchFile)) {
      await mergePackageJson(destDir, patchFile);
    }
  }
}

/** Run git init + initial commit in the scaffolded directory */
export async function initGit(destDir: string): Promise<boolean> {
  try {
    const { execSync } = await import("node:child_process");
    execSync("git init", { cwd: destDir, stdio: "ignore" });
    execSync("git add -A", { cwd: destDir, stdio: "ignore" });
    execSync('git commit -m "chore: initial scaffold"', { cwd: destDir, stdio: "ignore" });
    return true;
  } catch {
    return false; // non-fatal
  }
}
