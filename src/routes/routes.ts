import express from 'express';
import ProdutosController from '../controllers/produtosController';

const produtosController = new ProdutosController();

export const routes = express.Router();

routes.get('/produtos', produtosController.getAll);
routes.get('/produtos/:uuid', produtosController.getByUuid);
routes.post('/produtos', produtosController.save);