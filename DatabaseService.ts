// DatabaseService.ts
import SQLite, { SQLiteDatabase } from 'expo-sqlite';

let db: SQLiteDatabase | null = null;

const openDatabaseAsync = async () => {
  console.log('Opening database...');
  const database = await SQLite.openDatabaseAsync('databaseName');
  console.log('Database opened.');
  return database;
};

export const setupDatabase = async () => {
  if (!db) {
    db = await openDatabaseAsync();
  }
  console.log('Executing database setup commands...');
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY NOT NULL,
        email TEXT NOT NULL,
        cars TEXT, -- Assuming JSON array
        groups TEXT, -- Assuming JSON array
        image TEXT,
        password TEXT NOT NULL,
        username TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS groups (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        cars TEXT, -- Assuming JSON array
        members TEXT, -- Assuming JSON array
        creator_id TEXT,
        FOREIGN KEY (creator_id) REFERENCES users(id)
    );
  `);
  console.log('Database setup commands executed.');
};

export default async () => {
  if (!db) {
    db = await openDatabaseAsync();
  }
  return db;
};
