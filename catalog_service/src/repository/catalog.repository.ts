import { PrismaClient } from "@prisma/client";
import { ICatalogRepository } from "../interface/catalogRepository.interface";
import { Product } from "../models/product.model";
import { ProductFactory } from "../utils/fixtures";
import { NotFoundError } from "../utils";

export class CatalogRepository implements ICatalogRepository {
  _prisma: PrismaClient;

  constructor() {
    this._prisma = new PrismaClient();
  }

  async create(data: Product): Promise<Product> {
    return this._prisma.product.create({
      data,
    });
    // const product = ProductFactory.build()
    // return Promise.resolve(product)
  }

  async update(data: Product): Promise<Product> {
    // const product = ProductFactory.build();
    // return Promise.resolve(product);
    return this._prisma.product.update({
      where: { id: data.id },
      data,
    });
  }

  async delete(id: any) {
    // const product = ProductFactory.build();
    // return Promise.resolve(product);
    return this._prisma.product.delete({
      where: { id },
    });
  }

  async find(limit: number, offset: number): Promise<Product[]> {
    // const products = ProductFactory.buildList(limit);
    // return Promise.resolve(products);
    return this._prisma.product.findMany({
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: number): Promise<Product> {
    // const product = ProductFactory.build();
    // return   Promise.resolve(product);
    const product = await this._prisma.product.findFirst({
      where: { id },
    });
    if (product) return Promise.resolve(product);
    else throw new NotFoundError("Product not found");
  }

  async findStock(productId: number[]): Promise<Product[]> {
    return this._prisma.product.findMany({
      where: { id: { in: productId } },
    });
  }
}
