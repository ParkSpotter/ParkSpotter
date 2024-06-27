import { SQLiteDatabase } from 'expo-sqlite';

export type Car = {
  number: string;
  type: string;
  photo: string;
};

export const getCarByType = async (db: SQLiteDatabase, car: Car) => {
  await db.getFirstAsync(`SELECT * FROM cars WHERE type = ?`, [car.type]);
};
export const createCar = async (db: SQLiteDatabase, car: Car) => {
  await db.runAsync(`INSERT INTO cars (type, number, photo) VALUES (?, ?, ?)`, [
    car.type,
    car.number,
    car.photo,
  ]);
};
export const updateCar = async (db: SQLiteDatabase, car: Car) => {
  await db.runAsync(
    `UPDATE cars SET type = ?, number = ?, photo = ? WHERE type = ?`,
    [car.type, car.number, car.photo]
  );
};
export const deleteCar = async (db: SQLiteDatabase, car: Car) => {
  await db.runAsync(`DELETE FROM cars WHERE type = ?`, [car.type]);
};
