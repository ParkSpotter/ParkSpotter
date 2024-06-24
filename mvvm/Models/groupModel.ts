import db from '../../DatabaseService';

export type GroupModel = {
  id: string;
  name: string;
  description: string;
  members: string[];
  cars: string[];
  creator_id: string | null;
};

export class GroupM {
  static getAllGroups(group: GroupModel): Promise<GroupModel | null> {
    return new Promise<GroupModel | null>(
      (
        resolve: (value: GroupModel | null) => void,
        reject: (reason?: any) => void
      ) => {
        db.getAllAsync(`SELECT * FROM groups`)
          .then(({ rows }: any) => {
            if (rows.length === 0) {
              resolve(null);
            } else {
              resolve(rows);
            }
          })
          .catch(reject);
      }
    );
  }
  static deleteGroupByCreator(group: GroupModel): Promise<GroupModel | null> {
    return new Promise<GroupModel | null>(
      (
        resolve: (value: GroupModel | null) => void,
        reject: (reason?: any) => void
      ) => {
        db.runAsync(`DELETE FROM groups WHERE creator_id = ?`, [
          group.creator_id,
        ])
          .then(({ rows }: any) => {
            if (rows.length === 0) {
              resolve(null);
            } else {
              resolve(rows);
            }
          })
          .catch(reject);
      }
    );
  }
  static createGroup(group: GroupModel): Promise<void> {
    return new Promise<void>(
      (resolve: () => void, reject: (reason?: any) => void) => {
        db.runAsync(
          `INSERT INTO groups (name, description, members, cars, creator_id) VALUES (?, ?, ?, ?, ?)`,
          [
            group.name,
            group.description,
            JSON.stringify(group.members),
            JSON.stringify(group.cars),
            group.creator_id,
          ]
        )
          .then(resolve)
          .catch(reject);
      }
    );
  }
  static leaveGroup(group: GroupModel, userId: string): Promise<void> {
    return new Promise<void>(
      (resolve: () => void, reject: (reason?: any) => void) => {
        // SQL to remove userId from the members string
        const sql = `
          UPDATE groups 
          SET members = TRIM(BOTH ',' FROM REPLACE(REPLACE(REPLACE(members, ?, ''), ',,', ','), ',,', ','))
          WHERE id = ? AND members LIKE ?
        `;
        // Prepare the parameters for the SQL query
        const params = [
          `${userId},`, // Case: userId is in the middle or start
          group.id, // Assuming group model has an id field to identify the group
          `%${userId}%`, // Check if userId is part of the members string
        ];

        db.runAsync(sql, params).then(resolve).catch(reject);
      }
    );
  }
}
