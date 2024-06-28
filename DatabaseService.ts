import { SQLiteDatabase } from 'expo-sqlite'
import * as FileSystem from 'expo-file-system'
import { User } from './mvvm/Models/userModel'

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  console.log(FileSystem.documentDirectory)

  const DATABASE_VERSION = 1
  let result = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version'
  )
  let currentDbVersion = result?.user_version ?? 0

  if (currentDbVersion >= DATABASE_VERSION) {
    console.log('Database is up to date')
    return
  }

  if (currentDbVersion === 0) {
    try {
      const result = await db.execAsync(`
        PRAGMA journal_mode = 'wal';

        CREATE TABLE users (
          id TEXT PRIMARY KEY NOT NULL,
          email TEXT NOT NULL,
          cars TEXT, -- Assuming JSON array
          groups TEXT, -- Assuming JSON array
          image TEXT NULL,
          password TEXT NOT NULL,
          username TEXT NOT NULL
        );

        CREATE TABLE groups (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          cars TEXT, -- Assuming JSON array
          members TEXT, -- Assuming JSON array
          creator_id TEXT,
          FOREIGN KEY (creator_id) REFERENCES users(id)
        );
      `)
      console.log(result)

      currentDbVersion = 1
    } catch (error) {
      console.error('Migration Error:', error)
      return
    }
  }

  // if (currentDbVersion === 1) {
  //   Add more migrations
  // }

  try {
    await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`)
    console.log('Database version set to:', DATABASE_VERSION)
  } catch (error) {
    console.error('Error setting database version:', error)
  }
}
