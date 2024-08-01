import Produto from "../models/produto";
import { randomUUID }  from 'node:crypto';
import Controller from "./controller";

export default class ProdutosController extends Controller<Produto> {

  constructor() {
    super(new Produto());
    this.getAll = this.getAll.bind(this);
    this.getByUuid = this.getByUuid.bind(this);
    this.save = this.save.bind(this);
    this.edit = this.edit.bind(this);
  }

  protected createInstance(data: Produto): Produto {
    const { name, type, price, description } = data;
    return new Produto(undefined, randomUUID(), name, type, price, description);
  }

  protected editInstance(data: Produto): Produto {
    const { name, type, price, description } = data;
    return new Produto(undefined, undefined, name, type, price, description);
  }
}