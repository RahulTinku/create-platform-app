import pc from "picocolors";

export const logger = {
  step: (msg: string) => console.log(pc.cyan("  ▸"), msg),
  success: (msg: string) => console.log(pc.green("  ✓"), msg),
  warn: (msg: string) => console.log(pc.yellow("  ⚠"), msg),
  error: (msg: string) => console.error(pc.red("  ✗"), msg),
  dim: (msg: string) => console.log(pc.dim(msg)),
};
