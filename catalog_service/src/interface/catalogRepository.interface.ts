import { Product } from "../models/product.model";

export interface ICatalogRepository {
  findStock(productId: number[]): unknown;
  create(data: Product): Promise<Product>;
  update(data: Product): Promise<Product>;
  delete(id: any): any;
  find(limit: number, offset: number): Promise<Product[]>;
  findOne(id: number): Promise<Product>;
}
