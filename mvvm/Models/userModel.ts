import db from '../../DatabaseService';

export type User = {
  cars?: any[];
  email: string;
  groups?: any[];
  id: string;
  image: string;
  password: string;
  username: string;
};

export class UserModel {
  static getUserByUid(user: User): Promise<User | null> {
    return new Promise<User | null>(
      (
        resolve: (value: User | null) => void,
        reject: (reason?: any) => void
      ) => {
        db.getFirstAsync(`SELECT * FROM users WHERE id = ?`, [user.id])
          .then(({ rows }: any) => {
            if (rows.length === 0) {
              resolve(null);
            } else {
              resolve(rows.item(0));
            }
          })
          .catch(reject);
      }
    );
  }
  static createUser(user: User): Promise<void> {
    return new Promise<void>(
      (resolve: () => void, reject: (reason?: any) => void) => {
        db.runAsync(
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
        )
          .then(resolve)
          .catch(reject);
      }
    );
  }
  static updateUser(user: User): Promise<void> {
    return new Promise<void>(
      (resolve: () => void, reject: (reason?: any) => void) => {
        db.runAsync(
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
        )
          .then(resolve)
          .catch(reject);
      }
    );
  }
}
