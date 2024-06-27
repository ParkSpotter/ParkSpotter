import { SQLiteDatabase } from 'expo-sqlite';

export type User = {
  cars?: any[];
  email: string;
  groups?: any[];
  id: string;
  image: string | null;
  password: string;
  username: string;
};

export const createUser = async (db: SQLiteDatabase, user: User) => {
  await db.runAsync(
    `INSERT INTO users (id, email, cars, groups, image, password, username) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      user.id,
      user.email,
      JSON.stringify(user.cars),
      JSON.stringify(user.groups),
      user.image,
      user.password,
      user.username,
    ]
  );
};
export const getUserByUid = async (db: SQLiteDatabase, user: User) => {
  await db.getFirstAsync(`SELECT * FROM users WHERE id = ?`, [user.id]);
};

export const updateUser = async (db: SQLiteDatabase, user: User) => {
  await db.runAsync(
    `UPDATE users SET email = ?, cars = ?, groups = ?, image = ?, password = ?, username = ? WHERE id = ?`,
    [
      user.email,
      JSON.stringify(user.cars),
      JSON.stringify(user.groups),
      user.image,
      user.password,
      user.username,
      user.id,
    ]
  );
};
