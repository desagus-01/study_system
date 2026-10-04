import type Database from "better-sqlite3";

export interface DatabaseMigration {
  version: number;
  name: string;
  up(database: Database.Database): void;
}

export const DATABASE_MIGRATIONS: readonly DatabaseMigration[] = [
  {
    version: 1,
    name: "create course and source tables",
    up: (database) => {
      database.exec(`
        CREATE TABLE courses (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          created_at TEXT NOT NULL
        );

        CREATE TABLE sources (
          id TEXT PRIMARY KEY,
          course_id TEXT NOT NULL REFERENCES courses(id),
          title TEXT NOT NULL,
          source_type TEXT NOT NULL CHECK (source_type IN ('document', 'note', 'web')),
          created_at TEXT NOT NULL
        );

        CREATE INDEX sources_course_id_index ON sources(course_id);

        CREATE TABLE source_segments (
          id TEXT PRIMARY KEY,
          source_id TEXT NOT NULL REFERENCES sources(id),
          ordinal INTEGER NOT NULL CHECK (ordinal >= 0),
          content TEXT NOT NULL,
          location_label TEXT,
          created_at TEXT NOT NULL,
          UNIQUE (source_id, ordinal)
        );

        CREATE INDEX source_segments_source_id_index ON source_segments(source_id);
      `);
    }
  }
];

export function runMigrations(
  database: Database.Database,
  migrations: readonly DatabaseMigration[] = DATABASE_MIGRATIONS
): void {
  validateMigrations(migrations);

  database.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at TEXT NOT NULL
    )
  `);

  const appliedVersions = new Set(
    database
      .prepare("SELECT version FROM schema_migrations")
      .all()
      .map((row) => (row as { version: number }).version)
  );

  const recordMigration = database.prepare(
    "INSERT INTO schema_migrations (version, name, applied_at) VALUES (?, ?, ?)"
  );

  for (const migration of migrations) {
    if (appliedVersions.has(migration.version)) {
      continue;
    }

    database.transaction(() => {
      migration.up(database);
      recordMigration.run(
        migration.version,
        migration.name,
        new Date().toISOString()
      );
    })();
  }
}

function validateMigrations(migrations: readonly DatabaseMigration[]): void {
  let previousVersion = 0;

  for (const migration of migrations) {
    if (!Number.isInteger(migration.version) || migration.version < 1) {
      throw new Error(`Migration version must be a positive integer: ${migration.name}`);
    }

    if (migration.version <= previousVersion) {
      throw new Error("Migrations must have unique, ascending versions.");
    }

    previousVersion = migration.version;
  }
}
