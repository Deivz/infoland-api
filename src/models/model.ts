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

  private filterPropertiesNoUuid(item: T): Partial<T> {
    const filteredItem = { ...item } as any;
    delete filteredItem.tableName;
    delete filteredItem.id;
    delete filteredItem.uuid;
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

      db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        db.run(sql, values, function (err) {
          if (err) {
            console.error('Erro ao inserir dados:', err.message);
            db.run('ROLLBACK', () => closeDatabase(db));
            reject(err);
          } else {
            db.run('COMMIT', () => {
              closeDatabase(db);
              resolve(this.lastID);
            });
          }
        });
      });
    });
  }

  update(uuid: string, item: T): Promise<void> {
    const filteredItem = this.filterPropertiesNoUuid(item);
    const keys = Object.keys(filteredItem);
    const values = Object.values(filteredItem);
    const placeholders = keys.map(key => `${key} = ?`).join(',');

    const sql = `UPDATE ${this.tableName} SET ${placeholders} WHERE uuid = '${uuid}'`;

    return new Promise((resolve, reject) => {
      const db = openDatabase();

      db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        db.run(sql, values, function (err) {
          if (err) {
            console.error('Erro ao atualizar dados:', err.message);
            db.run('ROLLBACK', () => closeDatabase(db));
            reject(err);
          } else {
            db.run('COMMIT', () => {
              closeDatabase(db);
              resolve();
            });
          }
        });
      });
    });
  }

  delete(uuid: string): Promise<void> {
    const sql = `DELETE FROM ${this.tableName} WHERE uuid = '${uuid}'`;

    return new Promise((resolve, reject) => {
      const db = openDatabase();

      db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        db.run(sql, [], function (err) {
          if (err) {
            console.error('Erro ao excluir dados:', err.message);
            db.run('ROLLBACK', () => {
              closeDatabase(db);
              reject(err);
            });
          } else {
            db.run('COMMIT', () => {
              closeDatabase(db);
              resolve();
            });
          }
        });
      });
    });
  }

  protected abstract createInstance(row: any): T
}