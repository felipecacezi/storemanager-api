import type { Product, ProductUpdate } from "../../domain/entities/Product.js";

export interface ProductRepository {
    create(product: Product): Promise<Product | null>;
    update(product: ProductUpdate): Promise<ProductUpdate | null>;
    delete(id: number, companyId: number): Promise<boolean>;
    getById(id: number, companyId: number): Promise<Product | null>;
    getAll(page: number, limit: number, companyId: number, search?: string): Promise<Product[]>;
    count(companyId: number, search?: string): Promise<number>;
    getByName(name: string, companyId: number): Promise<Product | null>;
}
