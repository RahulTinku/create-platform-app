#!/usr/bin/env node
import { runPrompts, scaffold } from "./prompts/questions.js";
import { logger } from "./utils/logger.js";

/**
 * Usage:
 *   platform-app-cli [project-name] [options]
 *
 * Options:
 *   --template <id>   Skip the template prompt. Valid: react-vite, react-next, node-api
 *   --no-install      Skip dependency installation
 *   --no-git          Skip git initialisation
 */
async function main() {
  const args = process.argv.slice(2);

  // Project name: first non-flag argument
  const argProjectName = args.find((a) => !a.startsWith("-"))?.trim();

  // --template react-vite  OR  --template=react-vite
  const templateFlagIdx = args.findIndex((a) => a === "--template");
  const templateFromFlag =
    templateFlagIdx >= 0 && args[templateFlagIdx + 1] && !args[templateFlagIdx + 1].startsWith("-")
      ? args[templateFlagIdx + 1]
      : args.find((a) => a.startsWith("--template="))?.slice("--template=".length);

  const noInstall = args.includes("--no-install");
  const noGit = args.includes("--no-git");

  try {
    const config = await runPrompts(argProjectName, {
      template: templateFromFlag,
      noInstall,
      noGit,
    });
    if (!config) process.exit(0);
    await scaffold(config);
  } catch (err) {
    logger.error(`Unexpected error: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }
}

main();
