import { app } from "../src/app";
import request from "supertest";
import { expect, it, describe } from "vitest";
import { closeDatabase, openDatabase } from "../src/database/database";
import Produto from "../src/models/produto";

function createInstance(row: any): Produto {
  return new Produto(
    row.id,
    row.uuid,
    row.name,
    row.type,
    row.price,
    row.description,
  );
}

function findById(id: string): Promise<Produto | null> {
  const query = `SELECT * FROM produtos WHERE id = ?`;

  return new Promise((resolve, reject) => {
    const db = openDatabase();

    db.get(query, id, (err: Error | null, row?: Produto) => {
      if (err) {
        console.error('Erro ao buscar dados:', err.message);
        reject(err);
      } else {
        resolve(row ? createInstance(row) : null);
      }
    });

    closeDatabase(db);
  });
}

describe('Products Routes', () => {

  const product = {
    name: 'Produto Teste',
    type: 'Teste',
    price: 10.50,
    description: 'Descrição teste'
  }

  const productUpdate = {
    name: 'Produto Testado',
    type: 'Teste',
    price: 15.50,
    description: 'Descrição teste'
  }

  let id: string

  it('should be able to create a new product', async () => {
    const response = await request(app)
      .post('/produtos')
      .send(product)
      .expect(201);

    id = response.body.data.id

    expect(response.body.message).toBe('Criado com sucesso!');
  });

  it('should bring all products created', async () => {
    const response = await request(app)
      .get('/produtos')
      .expect(200);

    expect(response.body.message).toBe('success');
  });

  it('should delete a specific product by its uuid', async () => {
    // Arrange
    const foundProduct = await findById(id);

    if (!foundProduct) {
      throw new Error(`Product with id ${id} not found`);
    }

    const uuid: string = foundProduct.uuid

    // Act
    const response = await request(app)
      .delete(`/produtos/${uuid}`)
      .send(product)

    // Assert
    expect(response.statusCode).toBe(204);
  });
});