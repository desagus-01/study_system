import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

import type { PiStatus } from "../shared/types";

export interface PiRuntimePaths {
  authPath: string;
  modelsPath: string;
}

export function getPiRuntimePaths(): PiRuntimePaths {
  const agentDirectory =
    process.env.PI_CODING_AGENT_DIR ?? join(homedir(), ".pi", "agent");

  return {
    authPath: join(agentDirectory, "auth.json"),
    modelsPath: join(agentDirectory, "models.json")
  };
}

export function getPiStatus(paths = getPiRuntimePaths()): PiStatus {
  try {
    return existsSync(paths.authPath) && existsSync(paths.modelsPath)
      ? "available"
      : "not configured";
  } catch {
    return "error";
  }
}
