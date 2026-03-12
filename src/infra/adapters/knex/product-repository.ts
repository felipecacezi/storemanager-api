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
            company_id: product.company_id,
            name: product.name,
            description: product.description,
            cost_price: product.cost_price,
            sell_price: product.sell_price,
            inventory: product.inventory,
            status: product.status,
        });
    }

    async update(product: ProductUpdate): Promise<ProductUpdate | null> {
        const { company_id, ...updateData } = product;
        return await this.db("products").where({ id: product.id, company_id }).update(updateData);
    }

    async delete(id: number, companyId: number): Promise<boolean> {
        return await this.db("products").where({ id, company_id: companyId }).update({ status: false });
    }

    async getById(id: number, companyId: number): Promise<Product | null> {
        return await this.db("products").where({ id, company_id: companyId }).first();
    }

    async getAll(page: number, limit: number, companyId: number, search?: string, status?: boolean | undefined): Promise<Product[]> {
        const query = this.db("products").where({ company_id: companyId });

        if (status !== undefined) {
            query.where({ status });
        }

        return await query.limit(limit).offset((page - 1) * limit);
    }

    async count(companyId: number, search?: string, status?: boolean | undefined): Promise<number> {
        const query = this.db("products").where({ company_id: companyId });

        if (status !== undefined) {
            query.where({ status });
        }

        const result = await query.count({ count: '*' }).first();
        return Number(result?.count || 0);
    }

    async getByName(name: string, companyId: number): Promise<Product | null> {
        return await this.db("products").where({ name, company_id: companyId }).first();
    }
}
