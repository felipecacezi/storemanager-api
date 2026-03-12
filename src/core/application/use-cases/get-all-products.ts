import type { KnexProductRepository } from "../../../infra/adapters/knex/product-repository.js";
import { ErrorMessages } from "../../domain/erros/error-mesages.js";
import { z } from "zod";

export class GetAllProductsUseCase {
    constructor(
        private productRepository: KnexProductRepository
    ) { }

    async execute(params: { page: number, limit: number, company_id: number, status?: boolean | undefined }) {
        const schema = z.object({
            page: z.number({
                message: ErrorMessages.PRODUCT_PAGE_REQUIRED,
            })
                .min(1, ErrorMessages.PRODUCT_PAGE_REQUIRED)
                .max(50, ErrorMessages.PRODUCT_PAGE_MAX),
            limit: z.number({
                message: ErrorMessages.PRODUCT_LIMIT_REQUIRED,
            })
                .min(1, ErrorMessages.PRODUCT_LIMIT_REQUIRED)
                .max(100, ErrorMessages.PRODUCT_LIMIT_MAX),
            status: z.boolean().optional(),
        });

        const result = schema.safeParse(params);
        if (!result.success) {
            throw new Error(result.error!.issues[0]!.message);
        }

        const { page, limit, status } = result.data;
        const products = await this.productRepository.getAll(page, limit, params.company_id, undefined, status);
        return products;
    }
}
