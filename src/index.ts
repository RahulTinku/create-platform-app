#!/usr/bin/env node
import { runPrompts, scaffold } from "./prompts/questions.js";
import { logger } from "./utils/logger.js";

async function main() {
  // Accept project name as CLI arg: create-platform-app my-app
  const argProjectName = process.argv[2]?.trim();

  try {
    const config = await runPrompts(argProjectName);
    if (!config) process.exit(0);
    await scaffold(config);
  } catch (err) {
    logger.error(`Unexpected error: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }
}

main();
