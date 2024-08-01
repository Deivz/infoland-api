import express from 'express';
import ProdutosController from '../controllers/produtosController';

export const routes = express.Router();

routes.get('/produtos', ProdutosController.getAll);
routes.post('/produtos', ProdutosController.save);