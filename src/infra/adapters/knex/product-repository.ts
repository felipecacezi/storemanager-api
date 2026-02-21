import type { Knex } from "knex";
import type { Product, ProductUpdate } from "../../../core/domain/entities/Product.js";
import type { ProductRepository } from "../../../core/application/repositories/product-repository.js";

export class KnexProductRepository implements ProductRepository {
    constructor(
        private readonly db: Knex
    ) { }

    async create(product: Product): Promise<Product | null> {
        return await this.db("products").insert({
            id: product.id,
            name: product.name,
            description: product.description,
            cost_price: product.cost_price,
            sell_price: product.sell_price,
            inventory: product.inventory,
            status: product.status,
        });
    }

    async update(product: ProductUpdate): Promise<ProductUpdate | null> {
        return await this.db("products").where({ id: product.id }).update(product);
    }

    async delete(id: number): Promise<boolean> {
        return await this.db("products").where({ id }).update({ status: false });
    }

    async getById(id: number): Promise<Product | null> {
        return await this.db("products").where({ id }).first();
    }

    async getAll(page: number, limit: number, search?: string): Promise<Product[]> {
        return await this.db("products").where({ status: true }).limit(limit).offset((page - 1) * limit);
    }

    async count(search?: string): Promise<number> {
        return await this.db("products").where({ status: true }).count();
    }

    async getByName(name: string): Promise<Product | null> {
        return await this.db("products").where({ name }).first();
    }
}
