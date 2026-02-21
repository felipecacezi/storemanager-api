import type { KnexProductRepository } from "../../../infra/adapters/knex/product-repository.js";
import type { Product } from "../../domain/entities/Product.js";
import { ErrorMessages } from "../../domain/erros/error-mesages.js";
import { z } from "zod";

export class CreateProductUseCase {
    constructor(
        private productRepository: KnexProductRepository
    ) { }

    async execute(product: Product) {
        const schema = z.object({
            name: z.string({ message: ErrorMessages.PRODUCT_NAME_REQUIRED })
                .min(1, ErrorMessages.PRODUCT_NAME_REQUIRED),
            cost_price: z.number({
                message: ErrorMessages.PRODUCT_COST_PRICE_REQUIRED,
                invalid_type_error: ErrorMessages.PRODUCT_COST_PRICE_REQUIRED,
            }).int(ErrorMessages.PRODUCT_COST_PRICE_REQUIRED),
            sell_price: z.number({
                message: ErrorMessages.PRODUCT_SELL_PRICE_REQUIRED,
                invalid_type_error: ErrorMessages.PRODUCT_SELL_PRICE_REQUIRED,
            }).int(ErrorMessages.PRODUCT_SELL_PRICE_REQUIRED),
        });

        const result = schema.safeParse(product);
        if (!result.success) {
            throw new Error(result.error.issues[0].message);
        }

        const productExists = await this.productRepository.getByName(result.data.name);
        if (productExists) {
            throw new Error(ErrorMessages.PRODUCT_ALREADY_EXISTS);
        }

        return await this.productRepository.create(product);
    }
}
