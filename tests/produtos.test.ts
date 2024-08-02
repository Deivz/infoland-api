import { app } from "../src/app";
import request from "supertest";
import { expect, it, describe, beforeEach, afterEach } from "vitest";
import { closeDatabase, openDatabase } from "../src/config/database";
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
  let uuidGlobal: string
  let idGlobal: string

  const product = {
    name: 'Produto Teste',
    type: 'Teste',
    price: 10.50,
    description: 'Descrição teste'
  }

  const productUpdated = {
    name: 'Produto Testado',
    type: 'Teste',
    price: 15.50,
    description: 'Descrição testada'
  }

  beforeEach(async () => {
    const productCreated = await request(app)
      .post('/produtos')
      .send(product)

    idGlobal = productCreated.body.data.id

    const productFound = await findById(idGlobal);

    if (!productFound) {
      throw new Error(`Product with id ${idGlobal} not found`);
    }

    uuidGlobal = productFound.uuid
  })

  afterEach(async () => {
    await request(app)
      .delete(`/produtos/${uuidGlobal}`)
  })

  it('should be able to create a new product', async () => {
    // Arrange

    // Act
    const response = await request(app)
      .post('/produtos')
      .send(product)

    const id = response.body.data.id

    const productFound = await findById(id);

    if (!productFound) {
      throw new Error(`Product with id ${id} not found`);
    }

    const uuid: string = productFound.uuid

    await request(app)
      .delete(`/produtos/${uuid}`)

    // Assert
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      message: 'Criado com sucesso!',
      data: {
        id
      }
    })
  });

  it('should bring all products created', async () => {
    // Arrange

    // Act
    const response = await request(app)
      .get('/produtos')

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('success');
    const productFound = response.body.data.find((prod: Produto) => prod.uuid === uuidGlobal);
    expect(productFound).toEqual(expect.objectContaining({
      uuid: uuidGlobal,
      name: product.name,
      type: product.type,
      price: product.price,
      description: product.description
    }));
  });

  it('should bring a specific product by its uuid', async () => {
    // Arrange

    // Act
    const response = await request(app)
      .get(`/produtos/${uuidGlobal}`)

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'success',
      data: {
        uuid: uuidGlobal,
        name: product.name,
        type: product.type,
        price: product.price,
        description: product.description
      }
    })
  });

  it('should be able to edit a specific product', async () => {
    // Arrange

    // Act
    const response = await request(app)
      .patch(`/produtos/${uuidGlobal}`)
      .send(productUpdated)

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Alterado com sucesso!');
  });

  it('should delete a specific product by its uuid', async () => {
    // Arrange
    const productCreated = await request(app)
      .post('/produtos')
      .send(product)

    const id = productCreated.body.data.id

    const productFound = await findById(id);

    if (!productFound) {
      throw new Error(`Product with id ${id} not found`);
    }

    const uuid: string = productFound.uuid

    // Act
    const response = await request(app)
      .delete(`/produtos/${uuid}`)

    // Assert
    expect(response.statusCode).toBe(204);
  });
});