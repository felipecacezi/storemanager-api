import type { Product, ProductUpdate } from "../../domain/entities/Product.js";

export interface ProductRepository {
    create(product: Product): Promise<Product | null>;
    update(product: ProductUpdate): Promise<ProductUpdate | null>;
    delete(id: number): Promise<boolean>;
    getById(id: number): Promise<Product | null>;
    getAll(page: number, limit: number, search?: string): Promise<Product[]>;
    count(search?: string): Promise<number>;
    getByName(name: string): Promise<Product | null>;
}
