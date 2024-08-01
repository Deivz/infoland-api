import { Request, Response } from "express";
import Model from "../models/model";

export default abstract class Controller<T> {

  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }
  
  async getAll(req: Request, res: Response) {
    try {
      const data = await this.model.findAll();
      res.status(200).json({
        message: "success",
        data
      });
    } catch (err: any) {
      res.status(400).json({
        error: err.message
      });
    }
  }

  async getByUuid(req: Request, res: Response) {
    try {
      const data = await this.model.findByUuid(req.params.uuid);
      res.status(200).json({
        message: "success",
        data
      });
    } catch (err: any) {
      res.status(400).json({
        error: err.message
      });
    }
  }

  async save(req: Request, res: Response) {
    try {
      const newItem = this.createInstance(req.body);
      const id = await this.model.create(newItem);
      res.status(201).json({
        message: "Criado com sucesso!",
        data: { id }
      });
    } catch (err: any) {
      res.status(400).json({
        error: err.message
      });
    }
  }

  async edit(req: Request, res: Response) {
    try {
      const newItem = this.editInstance(req.body);
      await this.model.update(req.params.uuid, newItem);
      res.status(200).json({
        message: "Alterado com sucesso!",
      });
    } catch (err: any) {
      res.status(400).json({
        error: err.message
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await this.model.delete(req.params.uuid);
      res.status(204).end();
    } catch (err: any) {
      res.status(400).json({
        error: err.message
      });
    }
  }

  protected abstract createInstance(data: T): T;
  protected abstract editInstance(data: T): T;
}