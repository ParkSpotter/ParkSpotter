import db from '../../DatabaseService';

export type Car = {
  available: boolean;
  occupiedBy: string | null;
  type: string;
  photo: string;
};
export class CarModel {
  static getCarByType(car: Car): Promise<Car | null> {
    return new Promise<Car | null>(
      (
        resolve: (value: Car | null) => void,
        reject: (reason?: any) => void
      ) => {
        db.getFirstAsync(`SELECT * FROM cars WHERE type = ?`, [car.type])
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
  static createCar(car: Car): Promise<void> {
    return new Promise<void>(
      (resolve: () => void, reject: (reason?: any) => void) => {
        db.runAsync(
          `INSERT INTO cars (available, occupiedBy, type, photo) VALUES (?, ?, ?, ?)`,
          [car.available, car.occupiedBy, car.type, car.photo]
        )
          .then(resolve)
          .catch(reject);
      }
    );
  }
  static updateCar(car: Car): Promise<void> {
    return new Promise<void>(
      (resolve: () => void, reject: (reason?: any) => void) => {
        db.runAsync(
          `UPDATE cars SET available = ?, occupiedBy = ?, type = ?, photo = ? WHERE type = ?`,
          [car.available, car.occupiedBy, car.type, car.photo, car.type]
        )
          .then(resolve)
          .catch(reject);
      }
    );
  }
  static deleteCar(car: Car): Promise<void> {
    return new Promise<void>(
      (resolve: () => void, reject: (reason?: any) => void) => {
        db.runAsync(`DELETE FROM cars WHERE type = ?`, [car.type])
          .then(resolve)
          .catch(reject);
      }
    );
  }
}
