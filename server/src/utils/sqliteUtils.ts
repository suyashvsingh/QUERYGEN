import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import fs from "fs";

let db: Database<sqlite3.Database, sqlite3.Statement>;

const dbFilePath = "database.db";

export async function initializeDatabase() {
  db = await open({
    filename: dbFilePath,
    driver: sqlite3.Database,
  });
  console.log("SQLite database initialized.");
}

export async function createSchema(schema: string) {
  await db.exec(schema);
}

export async function executeQuery(query: string) {
  try {
    const result = await db.all(query);
    return result;
  } catch (error) {
    return { error: (error as Error).message };
  }
}

export async function closeAndDeleteDatabase() {
  await db.close();
  console.log("SQLite database connection closed.");
  fs.unlinkSync(dbFilePath);
  console.log(`Database file '${dbFilePath}' deleted successfully.`);
}
