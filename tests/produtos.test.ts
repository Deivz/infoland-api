import { app } from "../src/app";
import request from "supertest";
import { test, expect, afterAll, afterEach } from "vitest";

test('User can create a new product', async () => {
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