import Model from "./model";
import { randomUUID }  from 'node:crypto';

export default class Produto extends Model<Produto> {
  id?: string;
  uuid: string;
  name: string;
  type: string;
  price: number;
  description: string;

  constructor(id?: string, uuid?: string, name?: string, type?: string, price?: number, description?: string) {
    super("produtos");
    this.id = id || '';
    this.uuid = uuid || '';
    this.name = name || '';
    this.type = type || '';
    this.price = price || 0;
    this.description = description || '';
  }

  protected createInstance(row: any): Produto {
    const produto: Produto = new Produto(row.id, row.uuid, row.name, row.type, row.price, row.description);

    delete produto.tableName;
    delete produto.id;

    return produto
  }
}