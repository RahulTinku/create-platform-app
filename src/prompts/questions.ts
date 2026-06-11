import {
  intro,
  outro,
  text,
  select,
  multiselect,
  confirm,
  spinner,
  isCancel,
  cancel,
  note,
} from "@clack/prompts";
import pc from "picocolors";
import path from "node:path";
import { copyTemplate, checkDestination, initGit } from "../utils/scaffold.js";
import { logger } from "../utils/logger.js";
import { TEMPLATES } from "../templates/registry.js";

export interface ProjectConfig {
  projectName: string;
  template: string;
  features: string[];
  installDeps: boolean;
  initGitRepo: boolean;
}

export async function runPrompts(argProjectName?: string): Promise<ProjectConfig | null> {
  intro(pc.bold(pc.cyan("create-platform-app")));
  console.log(pc.dim("  Scaffold production-ready apps with platform patterns.\n"));

  // — Project name —
  let projectName: string;
  if (argProjectName) {
    projectName = argProjectName;
    logger.step(`Project name: ${pc.cyan(projectName)}`);
  } else {
    const nameResult = await text({
      message: "Project name",
      placeholder: "my-app",
      validate: (v) => {
        if (!v || !v.trim()) return "Project name is required";
        if (!/^[a-z0-9-_]+$/i.test(v.trim())) return "Use only letters, numbers, hyphens, and underscores";
        return undefined;
      },
    });
    if (isCancel(nameResult)) { cancel("Cancelled."); return null; }
    projectName = (nameResult as string).trim();
  }

  // — Check destination —
  const destDir = path.resolve(process.cwd(), projectName);
  const check = checkDestination(destDir);
  if (!check.ok) {
    logger.error(check.reason!);
    return null;
  }

  // — Template —
  const templateResult = await select({
    message: "Choose a template",
    options: TEMPLATES.map((t) => ({
      value: t.id,
      label: t.label,
      hint: t.hint,
    })),
  });
  if (isCancel(templateResult)) { cancel("Cancelled."); return null; }
  const template = templateResult as string;

  // — Features —
  const availableFeatures = TEMPLATES.find((t) => t.id === template)?.features ?? [];
  let features: string[] = [];
  if (availableFeatures.length > 0) {
    const featResult = await multiselect({
      message: "Add platform features",
      options: availableFeatures.map((f) => ({
        value: f.id,
        label: f.label,
        hint: f.hint,
      })),
      required: false,
    });
    if (isCancel(featResult)) { cancel("Cancelled."); return null; }
    features = featResult as string[];
  }

  // — Git init —
  const gitResult = await confirm({ message: "Initialise a git repository?", initialValue: true });
  if (isCancel(gitResult)) { cancel("Cancelled."); return null; }

  // — Install deps —
  const installResult = await confirm({ message: "Install dependencies now?", initialValue: true });
  if (isCancel(installResult)) { cancel("Cancelled."); return null; }

  return {
    projectName,
    template,
    features: features as string[],
    installDeps: installResult as boolean,
    initGitRepo: gitResult as boolean,
  };
}

export async function scaffold(config: ProjectConfig): Promise<void> {
  const { projectName, template, installDeps, initGitRepo } = config;
  const destDir = path.resolve(process.cwd(), projectName);
  const templateEntry = TEMPLATES.find((t) => t.id === template)!;

  const s = spinner();

  // — Copy template —
  s.start("Copying template files");
  await copyTemplate(templateEntry.dir, destDir, { projectName });
  s.stop("Template files copied");

  // — Git —
  if (initGitRepo) {
    s.start("Initialising git repository");
    const ok = await initGit(destDir);
    s.stop(ok ? "Git repository initialised" : "Git init skipped (git not found)");
  }

  // — Install dependencies —
  if (installDeps) {
    s.start("Installing dependencies");
    try {
      const { execSync } = await import("node:child_process");
      execSync("npm install", { cwd: destDir, stdio: "ignore" });
      s.stop("Dependencies installed");
    } catch {
      s.stop("Dependency install failed — run npm install manually");
    }
  }

  // — Next steps —
  const cmds = [
    `cd ${projectName}`,
    ...(installDeps ? [] : ["npm install"]),
    "npm run dev",
  ];

  note(cmds.join("\n"), "Next steps");
  outro(pc.green(`✓ ${projectName} is ready!`));
}
