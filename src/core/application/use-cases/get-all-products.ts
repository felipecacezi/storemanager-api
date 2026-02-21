import type { KnexProductRepository } from "../../../infra/adapters/knex/product-repository.js";
import { ErrorMessages } from "../../domain/erros/error-mesages.js";
import { z } from "zod";

export class GetAllProductsUseCase {
    constructor(
        private productRepository: KnexProductRepository
    ) { }

    async execute(params: { page: number, limit: number }) {
        const schema = z.object({
            page: z.number({
                required_error: ErrorMessages.PRODUCT_PAGE_REQUIRED,
                invalid_type_error: ErrorMessages.PRODUCT_PAGE_INVALID,
            })
                .min(1, ErrorMessages.PRODUCT_PAGE_REQUIRED)
                .max(50, ErrorMessages.PRODUCT_PAGE_MAX),
            limit: z.number({
                required_error: ErrorMessages.PRODUCT_LIMIT_REQUIRED,
                invalid_type_error: ErrorMessages.PRODUCT_LIMIT_INVALID,
            })
                .min(1, ErrorMessages.PRODUCT_LIMIT_REQUIRED)
                .max(100, ErrorMessages.PRODUCT_LIMIT_MAX),
        });

        const result = schema.safeParse(params);
        if (!result.success) {
            throw new Error(result.error.issues[0].message);
        }

        const { page, limit } = result.data;
        const products = await this.productRepository.getAll(page, limit);
        return products;
    }
}
