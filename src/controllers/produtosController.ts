import { Request, Response } from "express";
import Produto from "../models/produto";
import { randomUUID }  from 'node:crypto';

export default class ProdutosController {
  static async getAll(req: Request, res: Response) {
    try {
      const produto = new Produto();
      const produtos = await produto.findAll();
      res.json({
        message: "success",
        data: produtos
      });
    } catch (err: any) {
      res.status(400).json({
        error: err.message
      });
    }
  }

  static async save(req: Request, res: Response) {
    try {
      const { name, type, price, description } = req.body;
      const novoProduto = new Produto(undefined, randomUUID(), name, type, price, description);
      const id = await novoProduto.create(novoProduto);
      res.json({
        message: "Produto criado com sucesso!",
        data: { id }
      });
    } catch (err: any) {
      res.status(400).json({
        error: err.message
      });
    }
  }
}