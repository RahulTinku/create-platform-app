import fs from "node:fs";
import path from "node:path";

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
