import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

export function openDatabase(databasePath: string): Database.Database {
  mkdirSync(dirname(databasePath), { recursive: true });

  const database = new Database(databasePath);
  database.pragma("journal_mode = WAL");
  database.prepare("SELECT 1").get();

  return database;
}
