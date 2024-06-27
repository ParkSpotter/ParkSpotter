import { SQLiteDatabase } from 'expo-sqlite';

export type GroupModel = {
  name: string;
  members: string[];
  creator_id: string | null;
};

export const getAllGroups = async (db: SQLiteDatabase, group: GroupModel) => {
  await db.getAllAsync(`SELECT * FROM groups`);
};
export const deleteGroupByCreator = async (
  db: SQLiteDatabase,
  group: GroupModel
) => {
  await db.runAsync(`DELETE FROM groups WHERE creator_id = ?`, [
    group.creator_id,
  ]);
};
export const createGroupB = async (db: SQLiteDatabase, group: GroupModel) => {
  await db.runAsync(
    `INSERT INTO groups (name,  members,  creator_id) VALUES (?, ?, ?, ?, ?)`,
    [group.name, JSON.stringify(group.members), group.creator_id]
  );
};

export const deleteGroup = async (db: SQLiteDatabase, group: GroupModel) => {
  await db.runAsync(`DELETE FROM groups WHERE id = ?`, [group.id]);
};
