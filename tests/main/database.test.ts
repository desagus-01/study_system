import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import { openDatabase } from "../../src/main/database";

const temporaryDirectories: string[] = [];

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { force: true, recursive: true });
  }
});

describe("openDatabase", () => {
  it("creates and opens a local SQLite database", () => {
    const directory = mkdtempSync(join(tmpdir(), "pi-learn-"));
    temporaryDirectories.push(directory);
    const databasePath = join(directory, "data", "pi-learn.sqlite");

    const database = openDatabase(databasePath);

    expect(database.prepare("SELECT 1 AS value").get()).toEqual({ value: 1 });
    expect(existsSync(databasePath)).toBe(true);

    database.close();
  });
});
