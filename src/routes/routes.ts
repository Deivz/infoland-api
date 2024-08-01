import express from 'express';
import ProdutosController from '../controllers/produtosController';

const produtosController = new ProdutosController();

export const routes = express.Router();

routes.get('/produtos', produtosController.getAll);
routes.post('/produtos', produtosController.save);