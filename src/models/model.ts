import { openDatabase, closeDatabase } from "../database/database";

export default abstract class Model<T> {
  tableName?: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  private filterProperties(item: T): Partial<T> {
    const filteredItem = { ...item } as any;
    delete filteredItem.tableName;
    delete filteredItem.id;
    return filteredItem;
  }

  findAll(): Promise<Array<T>> {
    const query = `SELECT * FROM ${this.tableName}`;

    return new Promise((resolve, reject) => {
      const db = openDatabase();

      db.all(query, [], (err: Error | null, rows?: Array<T>) => {
        if (err) {
          console.error('Erro ao buscar dados:', err.message);
          reject(err);
        } else {
          resolve(rows ? rows.map(row => this.createInstance(row)) : []);
        }
      });

      closeDatabase(db);
    });
  }

  findByUuid(uuid: string): Promise<T | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE uuid = ?`;

    return new Promise((resolve, reject) => {
      const db = openDatabase();

      db.get(query, uuid, (err: Error | null, row?: T) => {
        if (err) {
          console.error('Erro ao buscar dados:', err.message);
          reject(err);
        } else {
          resolve(row ? this.createInstance(row) : null);
        }
      });

      closeDatabase(db);
    });
  }

  create(item: T): Promise<number> {
    const filteredItem = this.filterProperties(item);
    const keys = Object.keys(filteredItem);
    const values = Object.values(filteredItem);
    const placeholders = keys.map(() => '?').join(',');

    const sql = `INSERT INTO ${this.tableName} (${keys.join(',')}) VALUES (${placeholders})`;

    return new Promise((resolve, reject) => {
      const db = openDatabase();

      db.run(sql, values, function (err) {
        if (err) {
          console.error('Erro ao inserir dados:', err.message);
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });

      closeDatabase(db);
    });
  }

  protected abstract createInstance(row: any): T
}