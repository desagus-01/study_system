import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import { getPiStatus } from "../../src/main/pi-status";

const temporaryDirectories: string[] = [];

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { force: true, recursive: true });
  }
});

describe("getPiStatus", () => {
  it("reports not configured without Pi configuration files", () => {
    const directory = mkdtempSync(join(tmpdir(), "pi-learn-"));
    temporaryDirectories.push(directory);

    expect(
      getPiStatus({
        authPath: join(directory, "auth.json"),
        modelsPath: join(directory, "models.json")
      })
    ).toBe("not configured");
  });

  it("reports available when Pi configuration files exist", () => {
    const directory = mkdtempSync(join(tmpdir(), "pi-learn-"));
    temporaryDirectories.push(directory);
    const authPath = join(directory, "auth.json");
    const modelsPath = join(directory, "models.json");
    writeFileSync(authPath, "{}");
    writeFileSync(modelsPath, "{}");

    expect(getPiStatus({ authPath, modelsPath })).toBe("available");
  });
});
