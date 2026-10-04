import Database from "better-sqlite3";
import { describe, expect, it } from "vitest";

import { runMigrations, type DatabaseMigration } from "../../src/main/migrations";

function openMemoryDatabase(): Database.Database {
  const database = new Database(":memory:");
  database.pragma("foreign_keys = ON");
  return database;
}

describe("runMigrations", () => {
  it("applies registered migrations once and records them in order", () => {
    const database = openMemoryDatabase();
    const migrations: readonly DatabaseMigration[] = [
      {
        version: 1,
        name: "create example",
        up: (connection) => {
          connection.exec("CREATE TABLE example (id INTEGER PRIMARY KEY)");
        }
      },
      {
        version: 2,
        name: "add example title",
        up: (connection) => {
          connection.exec("ALTER TABLE example ADD COLUMN title TEXT");
        }
      }
    ];

    runMigrations(database, migrations);
    runMigrations(database, migrations);

    expect(
      database
        .prepare("SELECT version, name FROM schema_migrations ORDER BY version")
        .all()
    ).toEqual([
      { version: 1, name: "create example" },
      { version: 2, name: "add example title" }
    ]);
    expect(
      database
        .prepare("PRAGMA table_info(example)")
        .all()
        .map((column) => (column as { name: string }).name)
    ).toContain("title");

    database.close();
  });

  it("rolls back a failed migration without recording it", () => {
    const database = openMemoryDatabase();
    const migrations: readonly DatabaseMigration[] = [
      {
        version: 1,
        name: "create transient table then fail",
        up: (connection) => {
          connection.exec("CREATE TABLE transient_record (id INTEGER PRIMARY KEY)");
          throw new Error("migration failed");
        }
      }
    ];

    expect(() => runMigrations(database, migrations)).toThrow("migration failed");
    expect(
      database
        .prepare(
          "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'transient_record'"
        )
        .get()
    ).toBeUndefined();
    expect(database.prepare("SELECT * FROM schema_migrations").all()).toEqual([]);

    database.close();
  });

  it("rejects duplicate or out-of-order migration versions", () => {
    const database = openMemoryDatabase();

    expect(() =>
      runMigrations(database, [
        { version: 2, name: "second", up: () => undefined },
        { version: 1, name: "first", up: () => undefined }
      ])
    ).toThrow("Migrations must have unique, ascending versions.");

    database.close();
  });
});
