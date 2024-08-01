import { app } from "../src/app";
import request from "supertest";
import { expect, it, describe } from "vitest";

describe('Products Routes', () => {
  it('should be able to create a new product', async () => {
    const response = await request(app)
      .post('/produtos')
      .send({
        name: 'Teste',
        type: 'Teste',
        price: 10,
        description: 'Teste'
      })
      .expect(201);
    
    expect(response.body.message).toBe('Criado com sucesso!');
  });

  it('should bring all products created', async () => {
    const response = await request(app)
      .get('/produtos')
      .expect(200);
    
    expect(response.body.message).toBe('Criado com sucesso!');
  });
})
