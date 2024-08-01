import {openDatabase, closeDatabase} from './database';

const db = openDatabase();

const createTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uuid TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT NOT NULL
    )
  `;

  db.run(sql, (err) => {
    if (err) {
      console.error('Erro ao criar tabela:', err.message);
    } else {
      console.log('Tabela criada com sucesso.');
    }
  });
};

createTable();

closeDatabase(db);